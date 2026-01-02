---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 256
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 256 of 991)

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

---[FILE: model_version.py]---
Location: mlflow-master/mlflow/entities/model_registry/model_version.py

```python
from mlflow.entities.logged_model_parameter import LoggedModelParameter as ModelParam
from mlflow.entities.metric import Metric
from mlflow.entities.model_registry._model_registry_entity import _ModelRegistryEntity
from mlflow.entities.model_registry.model_version_deployment_job_state import (
    ModelVersionDeploymentJobState,
)
from mlflow.entities.model_registry.model_version_status import ModelVersionStatus
from mlflow.entities.model_registry.model_version_tag import ModelVersionTag
from mlflow.protos.model_registry_pb2 import ModelVersion as ProtoModelVersion
from mlflow.protos.model_registry_pb2 import ModelVersionTag as ProtoModelVersionTag


class ModelVersion(_ModelRegistryEntity):
    """
    MLflow entity for Model Version.
    """

    def __init__(
        self,
        name: str,
        version: str,
        creation_timestamp: int,
        last_updated_timestamp: int | None = None,
        description: str | None = None,
        user_id: str | None = None,
        current_stage: str | None = None,
        source: str | None = None,
        run_id: str | None = None,
        status: str = ModelVersionStatus.to_string(ModelVersionStatus.READY),
        status_message: str | None = None,
        tags: list[ModelVersionTag] | None = None,
        run_link: str | None = None,
        aliases: list[str] | None = None,
        # TODO: Make model_id a required field
        # (currently optional to minimize breakages during prototype development)
        model_id: str | None = None,
        params: list[ModelParam] | None = None,
        metrics: list[Metric] | None = None,
        deployment_job_state: ModelVersionDeploymentJobState | None = None,
    ):
        super().__init__()
        self._name: str = name
        self._version: str = version
        self._creation_time: int = creation_timestamp
        self._last_updated_timestamp: int | None = last_updated_timestamp
        self._description: str | None = description
        self._user_id: str | None = user_id
        self._current_stage: str | None = current_stage
        self._source: str | None = source
        self._run_id: str | None = run_id
        self._run_link: str | None = run_link
        self._status: str = status
        self._status_message: str | None = status_message
        self._tags: dict[str, str] = {tag.key: tag.value for tag in (tags or [])}
        self._aliases: list[str] = aliases or []
        self._model_id: str | None = model_id
        self._params: list[ModelParam] | None = params
        self._metrics: list[Metric] | None = metrics
        self._deployment_job_state: ModelVersionDeploymentJobState | None = deployment_job_state

    @property
    def name(self) -> str:
        """String. Unique name within Model Registry."""
        return self._name

    @name.setter
    def name(self, new_name: str):
        self._name = new_name

    @property
    def version(self) -> str:
        """Version"""
        return self._version

    @property
    def creation_timestamp(self) -> int:
        """Integer. Model version creation timestamp (milliseconds since the Unix epoch)."""
        return self._creation_time

    @property
    def last_updated_timestamp(self) -> int | None:
        """Integer. Timestamp of last update for this model version (milliseconds since the Unix
        epoch).
        """
        return self._last_updated_timestamp

    @last_updated_timestamp.setter
    def last_updated_timestamp(self, updated_timestamp: int):
        self._last_updated_timestamp = updated_timestamp

    @property
    def description(self) -> str | None:
        """String. Description"""
        return self._description

    @description.setter
    def description(self, description: str):
        self._description = description

    @property
    def user_id(self) -> str | None:
        """String. User ID that created this model version."""
        return self._user_id

    @property
    def current_stage(self) -> str | None:
        """String. Current stage of this model version."""
        return self._current_stage

    @current_stage.setter
    def current_stage(self, stage: str):
        self._current_stage = stage

    @property
    def source(self) -> str | None:
        """String. Source path for the model."""
        return self._source

    @property
    def run_id(self) -> str | None:
        """String. MLflow run ID that generated this model."""
        return self._run_id

    @property
    def run_link(self) -> str | None:
        """String. MLflow run link referring to the exact run that generated this model version."""
        return self._run_link

    @property
    def status(self) -> str:
        """String. Current Model Registry status for this model."""
        return self._status

    @property
    def status_message(self) -> str | None:
        """String. Descriptive message for error status conditions."""
        return self._status_message

    @property
    def tags(self) -> dict[str, str]:
        """Dictionary of tag key (string) -> tag value for the current model version."""
        return self._tags

    @property
    def aliases(self) -> list[str]:
        """List of aliases (string) for the current model version."""
        return self._aliases

    @aliases.setter
    def aliases(self, aliases: list[str]):
        self._aliases = aliases

    @property
    def model_id(self) -> str | None:
        """String. ID of the model associated with this version."""
        return self._model_id

    @property
    def params(self) -> list[ModelParam] | None:
        """List of parameters associated with this model version."""
        return self._params

    @property
    def metrics(self) -> list[Metric] | None:
        """List of metrics associated with this model version."""
        return self._metrics

    @property
    def deployment_job_state(self) -> ModelVersionDeploymentJobState | None:
        """Deployment job state for the current model version."""
        return self._deployment_job_state

    @classmethod
    def _properties(cls) -> list[str]:
        # aggregate with base class properties since cls.__dict__ does not do it automatically
        return sorted(cls._get_properties_helper())

    def _add_tag(self, tag: ModelVersionTag):
        self._tags[tag.key] = tag.value

    # proto mappers
    @classmethod
    def from_proto(cls, proto) -> "ModelVersion":
        # input: mlflow.protos.model_registry_pb2.ModelVersion
        # returns: ModelVersion entity
        model_version = cls(
            proto.name,
            proto.version,
            proto.creation_timestamp,
            proto.last_updated_timestamp,
            proto.description if proto.HasField("description") else None,
            proto.user_id,
            proto.current_stage,
            proto.source,
            proto.run_id if proto.HasField("run_id") else None,
            ModelVersionStatus.to_string(proto.status),
            proto.status_message if proto.HasField("status_message") else None,
            run_link=proto.run_link,
            aliases=proto.aliases,
            deployment_job_state=ModelVersionDeploymentJobState.from_proto(
                proto.deployment_job_state
            ),
        )
        for tag in proto.tags:
            model_version._add_tag(ModelVersionTag.from_proto(tag))
        # TODO: Include params, metrics, and model ID in proto
        return model_version

    def to_proto(self):
        # input: ModelVersion entity
        # returns mlflow.protos.model_registry_pb2.ModelVersion
        model_version = ProtoModelVersion()
        model_version.name = self.name
        model_version.version = str(self.version)
        model_version.creation_timestamp = self.creation_timestamp
        if self.last_updated_timestamp is not None:
            model_version.last_updated_timestamp = self.last_updated_timestamp
        if self.description is not None:
            model_version.description = self.description
        if self.user_id is not None:
            model_version.user_id = self.user_id
        if self.current_stage is not None:
            model_version.current_stage = self.current_stage
        if self.source is not None:
            model_version.source = str(self.source)
        if self.run_id is not None:
            model_version.run_id = str(self.run_id)
        if self.run_link is not None:
            model_version.run_link = str(self.run_link)
        if self.status is not None:
            model_version.status = ModelVersionStatus.from_string(self.status)
        if self.status_message:
            model_version.status_message = self.status_message
        model_version.tags.extend(
            [ProtoModelVersionTag(key=key, value=value) for key, value in self._tags.items()]
        )
        model_version.aliases.extend(self.aliases)
        if self.deployment_job_state is not None:
            ModelVersionDeploymentJobState.to_proto(self.deployment_job_state)
        # TODO: Include params, metrics, and model ID in proto
        return model_version
```

--------------------------------------------------------------------------------

---[FILE: model_version_deployment_job_run_state.py]---
Location: mlflow-master/mlflow/entities/model_registry/model_version_deployment_job_run_state.py

```python
from mlflow.protos.databricks_uc_registry_messages_pb2 import (
    ModelVersionDeploymentJobState as ProtoModelVersionDeploymentJobState,
)


class ModelVersionDeploymentJobRunState:
    """Enum for model version deployment state of an
    :py:class:`mlflow.entities.model_registry.ModelVersion`.
    """

    NO_VALID_DEPLOYMENT_JOB_FOUND = ProtoModelVersionDeploymentJobState.DeploymentJobRunState.Value(
        "NO_VALID_DEPLOYMENT_JOB_FOUND"
    )
    RUNNING = ProtoModelVersionDeploymentJobState.DeploymentJobRunState.Value("RUNNING")
    SUCCEEDED = ProtoModelVersionDeploymentJobState.DeploymentJobRunState.Value("SUCCEEDED")
    FAILED = ProtoModelVersionDeploymentJobState.DeploymentJobRunState.Value("FAILED")
    PENDING = ProtoModelVersionDeploymentJobState.DeploymentJobRunState.Value("PENDING")
    _STRING_TO_STATE = {
        k: ProtoModelVersionDeploymentJobState.DeploymentJobRunState.Value(k)
        for k in ProtoModelVersionDeploymentJobState.DeploymentJobRunState.keys()
    }
    _STATE_TO_STRING = {value: key for key, value in _STRING_TO_STATE.items()}

    @staticmethod
    def from_string(state_str):
        if state_str not in ModelVersionDeploymentJobRunState._STRING_TO_STATE:
            raise Exception(
                f"Could not get deployment job run state corresponding to string {state_str}. "
                f"Valid state strings: {ModelVersionDeploymentJobRunState.all_states()}"
            )
        return ModelVersionDeploymentJobRunState._STRING_TO_STATE[state_str]

    @staticmethod
    def to_string(state):
        if state not in ModelVersionDeploymentJobRunState._STATE_TO_STRING:
            raise Exception(
                f"Could not get string corresponding to deployment job run {state}. "
                f"Valid states: {ModelVersionDeploymentJobRunState.all_states()}"
            )
        return ModelVersionDeploymentJobRunState._STATE_TO_STRING[state]

    @staticmethod
    def all_states():
        return list(ModelVersionDeploymentJobRunState._STATE_TO_STRING.keys())
```

--------------------------------------------------------------------------------

---[FILE: model_version_deployment_job_state.py]---
Location: mlflow-master/mlflow/entities/model_registry/model_version_deployment_job_state.py

```python
from mlflow.entities.model_registry._model_registry_entity import _ModelRegistryEntity
from mlflow.entities.model_registry.model_version_deployment_job_run_state import (
    ModelVersionDeploymentJobRunState,
)
from mlflow.entities.model_registry.registered_model_deployment_job_state import (
    RegisteredModelDeploymentJobState,
)
from mlflow.protos.databricks_uc_registry_messages_pb2 import (
    ModelVersionDeploymentJobState as ProtoModelVersionDeploymentJobState,
)


class ModelVersionDeploymentJobState(_ModelRegistryEntity):
    """Deployment Job state object associated with a model version."""

    def __init__(self, job_id, run_id, job_state, run_state, current_task_name):
        self._job_id = job_id
        self._run_id = run_id
        self._job_state = job_state
        self._run_state = run_state
        self._current_task_name = current_task_name

    def __eq__(self, other):
        if type(other) is type(self):
            return self.__dict__ == other.__dict__
        return False

    @property
    def job_id(self):
        return self._job_id

    @property
    def run_id(self):
        return self._run_id

    @property
    def job_state(self):
        return self._job_state

    @property
    def run_state(self):
        return self._run_state

    @property
    def current_task_name(self):
        return self._current_task_name

    @classmethod
    def from_proto(cls, proto):
        return cls(
            job_id=proto.job_id,
            run_id=proto.run_id,
            job_state=RegisteredModelDeploymentJobState.to_string(proto.job_state),
            run_state=ModelVersionDeploymentJobRunState.to_string(proto.run_state),
            current_task_name=proto.current_task_name,
        )

    def to_proto(self):
        state = ProtoModelVersionDeploymentJobState()
        if self.job_id is not None:
            state.job_id = self.job_id
        if self.run_id is not None:
            state.run_id = self.run_id
        if self.job_state is not None:
            state.job_state = RegisteredModelDeploymentJobState.from_string(self.job_state)
        if self.run_state is not None:
            state.run_state = ModelVersionDeploymentJobRunState.from_string(self.run_state)
        if self.current_task_name is not None:
            state.current_task_name = self.current_task_name
        return state
```

--------------------------------------------------------------------------------

---[FILE: model_version_search.py]---
Location: mlflow-master/mlflow/entities/model_registry/model_version_search.py

```python
from mlflow.entities.model_registry import ModelVersion


class ModelVersionSearch(ModelVersion):
    def __init__(self, *args, **kwargs):
        kwargs["tags"] = []
        kwargs["aliases"] = []
        super().__init__(*args, **kwargs)

    def tags(self):
        raise Exception(
            "UC Model Versions gathered through search_model_versions do not have tags. "
            "Please use get_model_version to obtain an individual version's tags."
        )

    def aliases(self):
        raise Exception(
            "UC Model Versions gathered through search_model_versions do not have aliases. "
            "Please use get_model_version to obtain an individual version's aliases."
        )

    def __eq__(self, other):
        if type(other) in {type(self), ModelVersion}:
            return self.__dict__ == other.__dict__
        return False
```

--------------------------------------------------------------------------------

---[FILE: model_version_stages.py]---
Location: mlflow-master/mlflow/entities/model_registry/model_version_stages.py

```python
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE

STAGE_NONE = "None"
STAGE_STAGING = "Staging"
STAGE_PRODUCTION = "Production"
STAGE_ARCHIVED = "Archived"

STAGE_DELETED_INTERNAL = "Deleted_Internal"

ALL_STAGES = [STAGE_NONE, STAGE_STAGING, STAGE_PRODUCTION, STAGE_ARCHIVED]
DEFAULT_STAGES_FOR_GET_LATEST_VERSIONS = [STAGE_STAGING, STAGE_PRODUCTION]
_CANONICAL_MAPPING = {stage.lower(): stage for stage in ALL_STAGES}


def get_canonical_stage(stage):
    key = stage.lower()
    if key not in _CANONICAL_MAPPING:
        raise MlflowException(
            "Invalid Model Version stage: {}. Value must be one of {}.".format(
                stage, ", ".join(ALL_STAGES)
            ),
            INVALID_PARAMETER_VALUE,
        )
    return _CANONICAL_MAPPING[key]
```

--------------------------------------------------------------------------------

---[FILE: model_version_status.py]---
Location: mlflow-master/mlflow/entities/model_registry/model_version_status.py

```python
from mlflow.protos.model_registry_pb2 import ModelVersionStatus as ProtoModelVersionStatus


class ModelVersionStatus:
    """Enum for status of an :py:class:`mlflow.entities.model_registry.ModelVersion`."""

    PENDING_REGISTRATION = ProtoModelVersionStatus.Value("PENDING_REGISTRATION")
    FAILED_REGISTRATION = ProtoModelVersionStatus.Value("FAILED_REGISTRATION")
    READY = ProtoModelVersionStatus.Value("READY")
    _STRING_TO_STATUS = {
        k: ProtoModelVersionStatus.Value(k) for k in ProtoModelVersionStatus.keys()
    }
    _STATUS_TO_STRING = {value: key for key, value in _STRING_TO_STATUS.items()}

    @staticmethod
    def from_string(status_str):
        if status_str not in ModelVersionStatus._STRING_TO_STATUS:
            raise Exception(
                f"Could not get model version status corresponding to string {status_str}. "
                f"Valid status strings: {list(ModelVersionStatus._STRING_TO_STATUS.keys())}"
            )
        return ModelVersionStatus._STRING_TO_STATUS[status_str]

    @staticmethod
    def to_string(status):
        if status not in ModelVersionStatus._STATUS_TO_STRING:
            raise Exception(
                f"Could not get string corresponding to model version status {status}. "
                f"Valid statuses: {list(ModelVersionStatus._STATUS_TO_STRING.keys())}"
            )
        return ModelVersionStatus._STATUS_TO_STRING[status]

    @staticmethod
    def all_status():
        return list(ModelVersionStatus._STATUS_TO_STRING.keys())
```

--------------------------------------------------------------------------------

---[FILE: model_version_tag.py]---
Location: mlflow-master/mlflow/entities/model_registry/model_version_tag.py

```python
from mlflow.entities.model_registry._model_registry_entity import _ModelRegistryEntity
from mlflow.protos.model_registry_pb2 import ModelVersionTag as ProtoModelVersionTag


class ModelVersionTag(_ModelRegistryEntity):
    """Tag object associated with a model version."""

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

    @classmethod
    def from_proto(cls, proto):
        return cls(proto.key, proto.value)

    def to_proto(self):
        tag = ProtoModelVersionTag()
        tag.key = self.key
        tag.value = self.value
        return tag
```

--------------------------------------------------------------------------------

---[FILE: prompt.py]---
Location: mlflow-master/mlflow/entities/model_registry/prompt.py

```python
"""
Prompt entity for MLflow Model Registry.

This represents a prompt in the registry with its metadata, without version-specific
content like template text. For version-specific content, use PromptVersion.
"""


class Prompt:
    """
    Entity representing a prompt in the MLflow Model Registry.

    This contains prompt-level information (name, description, tags) but not version-specific
    content. To access version-specific content like the template, use PromptVersion.
    """

    def __init__(
        self,
        name: str,
        description: str | None = None,
        creation_timestamp: int | None = None,
        tags: dict[str, str] | None = None,
    ):
        """
        Construct a Prompt entity.

        Args:
            name: Name of the prompt.
            description: Description of the prompt.
            creation_timestamp: Timestamp when the prompt was created.
            tags: Prompt-level metadata as key-value pairs.
        """
        self._name = name
        self._description = description
        self._creation_timestamp = creation_timestamp
        self._tags = tags or {}

    @property
    def name(self) -> str:
        """The name of the prompt."""
        return self._name

    @property
    def description(self) -> str | None:
        """The description of the prompt."""
        return self._description

    @property
    def creation_timestamp(self) -> int | None:
        """The creation timestamp of the prompt."""
        return self._creation_timestamp

    @property
    def tags(self) -> dict[str, str]:
        """Prompt-level metadata as key-value pairs."""
        return self._tags.copy()

    def __eq__(self, other) -> bool:
        if not isinstance(other, Prompt):
            return False
        return (
            self.name == other.name
            and self.description == other.description
            and self.creation_timestamp == other.creation_timestamp
            and self.tags == other.tags
        )

    def __repr__(self) -> str:
        return (
            f"<PromptInfo: name='{self.name}', description='{self.description}', tags={self.tags}>"
        )
```

--------------------------------------------------------------------------------

````
