---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 255
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 255 of 991)

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

---[FILE: trace_location.py]---
Location: mlflow-master/mlflow/entities/trace_location.py

```python
from abc import ABC, abstractmethod
from dataclasses import dataclass
from enum import Enum
from typing import Any

from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.exceptions import MlflowException
from mlflow.protos import service_pb2 as pb
from mlflow.utils.annotations import deprecated

_UC_SCHEMA_DEFAULT_SPANS_TABLE_NAME = "mlflow_experiment_trace_otel_spans"
_UC_SCHEMA_DEFAULT_LOGS_TABLE_NAME = "mlflow_experiment_trace_otel_logs"


@dataclass
class TraceLocationBase(_MlflowObject, ABC):
    """
    Base class for trace location classes.
    """

    @abstractmethod
    def to_dict(self) -> dict[str, Any]: ...

    @classmethod
    @abstractmethod
    def from_dict(cls, d: dict[str, Any]) -> "TraceLocationBase": ...


@dataclass
class MlflowExperimentLocation(TraceLocationBase):
    """
    Represents the location of an MLflow experiment.

    Args:
        experiment_id: The ID of the MLflow experiment where the trace is stored.
    """

    experiment_id: str

    def to_proto(self):
        return pb.TraceLocation.MlflowExperimentLocation(experiment_id=self.experiment_id)

    @classmethod
    def from_proto(cls, proto) -> "MlflowExperimentLocation":
        return cls(experiment_id=proto.experiment_id)

    def to_dict(self) -> dict[str, Any]:
        return {"experiment_id": self.experiment_id}

    @classmethod
    def from_dict(cls, d: dict[str, Any]) -> "MlflowExperimentLocation":
        return cls(experiment_id=d["experiment_id"])


@deprecated(since="3.7.0")
@dataclass
class InferenceTableLocation(TraceLocationBase):
    """
    Represents the location of a Databricks inference table.

    Args:
        full_table_name: The fully qualified name of the inference table where
            the trace is stored, in the format of `<catalog>.<schema>.<table>`.
    """

    full_table_name: str

    def to_proto(self):
        return pb.TraceLocation.InferenceTableLocation(full_table_name=self.full_table_name)

    @classmethod
    def from_proto(cls, proto) -> "InferenceTableLocation":
        return cls(full_table_name=proto.full_table_name)

    def to_dict(self) -> dict[str, Any]:
        return {"full_table_name": self.full_table_name}

    @classmethod
    def from_dict(cls, d: dict[str, Any]) -> "InferenceTableLocation":
        return cls(full_table_name=d["full_table_name"])


@dataclass
class UCSchemaLocation(TraceLocationBase):
    """
    Represents the location of a Databricks Unity Catalog (UC) schema.

    Args:
        catalog_name: The name of the Unity Catalog catalog name.
        schema_name: The name of the Unity Catalog schema.
    """

    catalog_name: str
    schema_name: str

    # These table names are set by the backend
    _otel_spans_table_name: str | None = _UC_SCHEMA_DEFAULT_SPANS_TABLE_NAME
    _otel_logs_table_name: str | None = _UC_SCHEMA_DEFAULT_LOGS_TABLE_NAME

    @property
    def schema_location(self) -> str:
        return f"{self.catalog_name}.{self.schema_name}"

    @property
    def full_otel_spans_table_name(self) -> str | None:
        if self._otel_spans_table_name:
            return f"{self.catalog_name}.{self.schema_name}.{self._otel_spans_table_name}"

    @property
    def full_otel_logs_table_name(self) -> str | None:
        if self._otel_logs_table_name:
            return f"{self.catalog_name}.{self.schema_name}.{self._otel_logs_table_name}"

    def to_dict(self) -> dict[str, Any]:
        d = {
            "catalog_name": self.catalog_name,
            "schema_name": self.schema_name,
        }
        if self._otel_spans_table_name:
            d["otel_spans_table_name"] = self._otel_spans_table_name
        if self._otel_logs_table_name:
            d["otel_logs_table_name"] = self._otel_logs_table_name
        return d

    @classmethod
    def from_dict(cls, d: dict[str, Any]) -> "UCSchemaLocation":
        location = cls(
            catalog_name=d["catalog_name"],
            schema_name=d["schema_name"],
        )
        if otel_spans_table_name := d.get("otel_spans_table_name"):
            location._otel_spans_table_name = otel_spans_table_name
        if otel_logs_table_name := d.get("otel_logs_table_name"):
            location._otel_logs_table_name = otel_logs_table_name
        return location


class TraceLocationType(str, Enum):
    TRACE_LOCATION_TYPE_UNSPECIFIED = "TRACE_LOCATION_TYPE_UNSPECIFIED"
    MLFLOW_EXPERIMENT = "MLFLOW_EXPERIMENT"
    INFERENCE_TABLE = "INFERENCE_TABLE"
    UC_SCHEMA = "UC_SCHEMA"

    def to_proto(self):
        return pb.TraceLocation.TraceLocationType.Value(self)

    @classmethod
    def from_proto(cls, proto: int) -> "TraceLocationType":
        return TraceLocationType(pb.TraceLocation.TraceLocationType.Name(proto))

    @classmethod
    def from_dict(cls, d: dict[str, Any]) -> "TraceLocationType":
        return cls(d["type"])


@dataclass
class TraceLocation(_MlflowObject):
    """
    Represents the location where the trace is stored.

    Currently, MLflow supports two types of trace locations:

        - MLflow experiment: The trace is stored in an MLflow experiment.
        - Inference table: The trace is stored in a Databricks inference table.

    Args:
        type: The type of the trace location, should be one of the
            :py:class:`TraceLocationType` enum values.
        mlflow_experiment: The MLflow experiment location. Set this when the
            location type is MLflow experiment.
        inference_table: The inference table location. Set this when the
            location type is Databricks Inference table.
    """

    type: TraceLocationType
    mlflow_experiment: MlflowExperimentLocation | None = None
    inference_table: InferenceTableLocation | None = None
    uc_schema: UCSchemaLocation | None = None

    def __post_init__(self) -> None:
        if (
            sum(
                [
                    self.mlflow_experiment is not None,
                    self.inference_table is not None,
                    self.uc_schema is not None,
                ]
            )
            > 1
        ):
            raise MlflowException.invalid_parameter_value(
                "Only one of mlflow_experiment, inference_table, or uc_schema can be provided."
            )

        if (
            (self.mlflow_experiment and self.type != TraceLocationType.MLFLOW_EXPERIMENT)
            or (self.inference_table and self.type != TraceLocationType.INFERENCE_TABLE)
            or (self.uc_schema and self.type != TraceLocationType.UC_SCHEMA)
        ):
            raise MlflowException.invalid_parameter_value(
                f"Trace location type {self.type} does not match the provided location "
                f"{self.mlflow_experiment or self.inference_table or self.uc_schema}."
            )

    def to_dict(self) -> dict[str, Any]:
        d = {"type": self.type.value}
        if self.mlflow_experiment:
            d["mlflow_experiment"] = self.mlflow_experiment.to_dict()
        elif self.inference_table:
            d["inference_table"] = self.inference_table.to_dict()
        elif self.uc_schema:
            d["uc_schema"] = self.uc_schema.to_dict()
        return d

    @classmethod
    def from_dict(cls, d: dict[str, Any]) -> "TraceLocation":
        return cls(
            type=TraceLocationType(d["type"]),
            mlflow_experiment=(
                MlflowExperimentLocation.from_dict(v) if (v := d.get("mlflow_experiment")) else None
            ),
            inference_table=(
                InferenceTableLocation.from_dict(v) if (v := d.get("inference_table")) else None
            ),
            uc_schema=(UCSchemaLocation.from_dict(v) if (v := d.get("uc_schema")) else None),
        )

    def to_proto(self) -> pb.TraceLocation:
        if self.mlflow_experiment:
            return pb.TraceLocation(
                type=self.type.to_proto(),
                mlflow_experiment=self.mlflow_experiment.to_proto(),
            )
        elif self.inference_table:
            return pb.TraceLocation(
                type=self.type.to_proto(),
                inference_table=self.inference_table.to_proto(),
            )
        # uc schema is not supported in to_proto since it's databricks specific, should use
        # databricks_service_utils to convert to proto
        else:
            return pb.TraceLocation(type=self.type.to_proto())

    @classmethod
    def from_proto(cls, proto) -> "TraceLocation":
        from mlflow.utils.databricks_tracing_utils import trace_location_from_proto

        return trace_location_from_proto(proto)

    @classmethod
    def from_experiment_id(cls, experiment_id: str) -> "TraceLocation":
        return cls(
            type=TraceLocationType.MLFLOW_EXPERIMENT,
            mlflow_experiment=MlflowExperimentLocation(experiment_id=experiment_id),
        )

    @classmethod
    def from_databricks_uc_schema(cls, catalog_name: str, schema_name: str) -> "TraceLocation":
        return cls(
            type=TraceLocationType.UC_SCHEMA,
            uc_schema=UCSchemaLocation(catalog_name=catalog_name, schema_name=schema_name),
        )
```

--------------------------------------------------------------------------------

---[FILE: trace_state.py]---
Location: mlflow-master/mlflow/entities/trace_state.py

```python
from enum import Enum

from opentelemetry import trace as trace_api

from mlflow.protos import service_pb2 as pb


class TraceState(str, Enum):
    """Enum representing the state of a trace.

    - ``STATE_UNSPECIFIED``: Unspecified trace state.
    - ``OK``: Trace successfully completed.
    - ``ERROR``: Trace encountered an error.
    - ``IN_PROGRESS``: Trace is currently in progress.
    """

    STATE_UNSPECIFIED = "STATE_UNSPECIFIED"
    OK = "OK"
    ERROR = "ERROR"
    IN_PROGRESS = "IN_PROGRESS"

    def __str__(self):
        return self.value

    def to_proto(self):
        return pb.TraceInfoV3.State.Value(self)

    @classmethod
    def from_proto(cls, proto: int) -> "TraceState":
        return TraceState(pb.TraceInfoV3.State.Name(proto))

    @staticmethod
    def from_otel_status(otel_status: trace_api.Status):
        """Convert OpenTelemetry status code to MLflow TraceState."""
        return _OTEL_STATUS_CODE_TO_MLFLOW[otel_status.status_code]


_OTEL_STATUS_CODE_TO_MLFLOW = {
    trace_api.StatusCode.OK: TraceState.OK,
    trace_api.StatusCode.ERROR: TraceState.ERROR,
    trace_api.StatusCode.UNSET: TraceState.STATE_UNSPECIFIED,
}
```

--------------------------------------------------------------------------------

---[FILE: trace_status.py]---
Location: mlflow-master/mlflow/entities/trace_status.py

```python
from enum import Enum

from opentelemetry import trace as trace_api

from mlflow.entities.trace_state import TraceState
from mlflow.protos.service_pb2 import TraceStatus as ProtoTraceStatus
from mlflow.utils.annotations import deprecated


@deprecated(alternative="mlflow.entities.trace_state.TraceState")
class TraceStatus(str, Enum):
    """Enum for status of an :py:class:`mlflow.entities.TraceInfo`."""

    UNSPECIFIED = "TRACE_STATUS_UNSPECIFIED"
    OK = "OK"
    ERROR = "ERROR"
    IN_PROGRESS = "IN_PROGRESS"

    def to_state(self) -> TraceState:
        if self == TraceStatus.UNSPECIFIED:
            return TraceState.STATE_UNSPECIFIED
        elif self == TraceStatus.OK:
            return TraceState.OK
        elif self == TraceStatus.ERROR:
            return TraceState.ERROR
        elif self == TraceStatus.IN_PROGRESS:
            return TraceState.IN_PROGRESS
        raise ValueError(f"Unknown TraceStatus: {self}")

    @classmethod
    def from_state(cls, state: TraceState) -> "TraceStatus":
        if state == TraceState.STATE_UNSPECIFIED:
            return cls.UNSPECIFIED
        elif state == TraceState.OK:
            return cls.OK
        elif state == TraceState.ERROR:
            return cls.ERROR
        elif state == TraceState.IN_PROGRESS:
            return cls.IN_PROGRESS
        raise ValueError(f"Unknown TraceState: {state}")

    def to_proto(self):
        return ProtoTraceStatus.Value(self)

    @staticmethod
    def from_proto(proto_status):
        return TraceStatus(ProtoTraceStatus.Name(proto_status))

    @staticmethod
    def from_otel_status(otel_status: trace_api.Status):
        return _OTEL_STATUS_CODE_TO_MLFLOW[otel_status.status_code]

    @classmethod
    def pending_statuses(cls):
        """Traces in pending statuses can be updated to any statuses."""
        return {cls.IN_PROGRESS}

    @classmethod
    def end_statuses(cls):
        """Traces in end statuses cannot be updated to any statuses."""
        return {cls.UNSPECIFIED, cls.OK, cls.ERROR}


_OTEL_STATUS_CODE_TO_MLFLOW = {
    trace_api.StatusCode.OK: TraceStatus.OK,
    trace_api.StatusCode.ERROR: TraceStatus.ERROR,
    trace_api.StatusCode.UNSET: TraceStatus.UNSPECIFIED,
}
```

--------------------------------------------------------------------------------

---[FILE: view_type.py]---
Location: mlflow-master/mlflow/entities/view_type.py

```python
from mlflow.protos import service_pb2


class ViewType:
    """Enum to filter requested experiment types."""

    ACTIVE_ONLY, DELETED_ONLY, ALL = range(1, 4)
    _VIEW_TO_STRING = {
        ACTIVE_ONLY: "active_only",
        DELETED_ONLY: "deleted_only",
        ALL: "all",
    }
    _STRING_TO_VIEW = {value: key for key, value in _VIEW_TO_STRING.items()}

    @classmethod
    def from_string(cls, view_str):
        if view_str not in cls._STRING_TO_VIEW:
            raise Exception(
                f"Could not get valid view type corresponding to string {view_str}. "
                f"Valid view types are {list(cls._STRING_TO_VIEW.keys())}"
            )
        return cls._STRING_TO_VIEW[view_str]

    @classmethod
    def to_string(cls, view_type):
        if view_type not in cls._VIEW_TO_STRING:
            raise Exception(
                f"Could not get valid view type corresponding to string {view_type}. "
                f"Valid view types are {list(cls._VIEW_TO_STRING.keys())}"
            )
        return cls._VIEW_TO_STRING[view_type]

    @classmethod
    def to_proto(cls, view_type):
        if view_type == cls.ACTIVE_ONLY:
            return service_pb2.ACTIVE_ONLY
        elif view_type == cls.DELETED_ONLY:
            return service_pb2.DELETED_ONLY
        elif view_type == cls.ALL:
            return service_pb2.ALL
        raise ValueError(f"Unexpected view_type: {view_type}")

    @classmethod
    def from_proto(cls, proto_view_type):
        if proto_view_type == service_pb2.ACTIVE_ONLY:
            return cls.ACTIVE_ONLY
        elif proto_view_type == service_pb2.DELETED_ONLY:
            return cls.DELETED_ONLY
        elif proto_view_type == service_pb2.ALL:
            return cls.ALL
        raise ValueError(f"Unexpected proto_view_type: {proto_view_type}")
```

--------------------------------------------------------------------------------

---[FILE: webhook.py]---
Location: mlflow-master/mlflow/entities/webhook.py

```python
from enum import Enum
from typing import Literal, TypeAlias

from typing_extensions import Self

from mlflow.exceptions import MlflowException
from mlflow.protos.webhooks_pb2 import Webhook as ProtoWebhook
from mlflow.protos.webhooks_pb2 import WebhookAction as ProtoWebhookAction
from mlflow.protos.webhooks_pb2 import WebhookEntity as ProtoWebhookEntity
from mlflow.protos.webhooks_pb2 import WebhookEvent as ProtoWebhookEvent
from mlflow.protos.webhooks_pb2 import WebhookStatus as ProtoWebhookStatus
from mlflow.protos.webhooks_pb2 import WebhookTestResult as ProtoWebhookTestResult


class WebhookStatus(str, Enum):
    ACTIVE = "ACTIVE"
    DISABLED = "DISABLED"

    def __str__(self) -> str:
        return self.value

    @classmethod
    def from_proto(cls, proto: int) -> Self:
        proto_name = ProtoWebhookStatus.Name(proto)
        try:
            return cls(proto_name)
        except ValueError:
            raise ValueError(f"Unknown proto status: {proto_name}")

    def to_proto(self) -> int:
        return ProtoWebhookStatus.Value(self.value)

    def is_active(self) -> bool:
        return self == WebhookStatus.ACTIVE


class WebhookEntity(str, Enum):
    REGISTERED_MODEL = "registered_model"
    MODEL_VERSION = "model_version"
    MODEL_VERSION_TAG = "model_version_tag"
    MODEL_VERSION_ALIAS = "model_version_alias"
    PROMPT = "prompt"
    PROMPT_VERSION = "prompt_version"
    PROMPT_TAG = "prompt_tag"
    PROMPT_VERSION_TAG = "prompt_version_tag"
    PROMPT_ALIAS = "prompt_alias"

    def __str__(self) -> str:
        return self.value

    @classmethod
    def from_proto(cls, proto: int) -> Self:
        proto_name = ProtoWebhookEntity.Name(proto)
        entity_value = proto_name.lower()
        return cls(entity_value)

    def to_proto(self) -> int:
        proto_name = self.value.upper()
        return ProtoWebhookEntity.Value(proto_name)


class WebhookAction(str, Enum):
    CREATED = "created"
    UPDATED = "updated"
    DELETED = "deleted"
    SET = "set"

    def __str__(self) -> str:
        return self.value

    @classmethod
    def from_proto(cls, proto: int) -> Self:
        proto_name = ProtoWebhookAction.Name(proto)
        # Convert UPPER_CASE to lowercase
        action_value = proto_name.lower()
        try:
            return cls(action_value)
        except ValueError:
            raise ValueError(f"Unknown proto action: {proto_name}")

    def to_proto(self) -> int:
        # Convert lowercase to UPPER_CASE
        proto_name = self.value.upper()
        return ProtoWebhookAction.Value(proto_name)


WebhookEventStr: TypeAlias = Literal[
    "registered_model.created",
    "model_version.created",
    "model_version_tag.set",
    "model_version_tag.deleted",
    "model_version_alias.created",
    "model_version_alias.deleted",
    "prompt.created",
    "prompt_version.created",
    "prompt_tag.set",
    "prompt_tag.deleted",
    "prompt_version_tag.set",
    "prompt_version_tag.deleted",
    "prompt_alias.created",
    "prompt_alias.deleted",
]

# Valid actions for each entity type
VALID_ENTITY_ACTIONS: dict[WebhookEntity, set[WebhookAction]] = {
    WebhookEntity.REGISTERED_MODEL: {
        WebhookAction.CREATED,
    },
    WebhookEntity.MODEL_VERSION: {
        WebhookAction.CREATED,
    },
    WebhookEntity.MODEL_VERSION_TAG: {
        WebhookAction.SET,
        WebhookAction.DELETED,
    },
    WebhookEntity.MODEL_VERSION_ALIAS: {
        WebhookAction.CREATED,
        WebhookAction.DELETED,
    },
    WebhookEntity.PROMPT: {
        WebhookAction.CREATED,
    },
    WebhookEntity.PROMPT_VERSION: {
        WebhookAction.CREATED,
    },
    WebhookEntity.PROMPT_TAG: {
        WebhookAction.SET,
        WebhookAction.DELETED,
    },
    WebhookEntity.PROMPT_VERSION_TAG: {
        WebhookAction.SET,
        WebhookAction.DELETED,
    },
    WebhookEntity.PROMPT_ALIAS: {
        WebhookAction.CREATED,
        WebhookAction.DELETED,
    },
}


class WebhookEvent:
    """
    Represents a webhook event with a resource and action.
    """

    def __init__(
        self,
        entity: str | WebhookEntity,
        action: str | WebhookAction,
    ):
        """
        Initialize a WebhookEvent.

        Args:
            entity: The entity type (string or WebhookEntity enum)
            action: The action type (string or WebhookAction enum)

        Raises:
            MlflowException: If the entity/action combination is invalid
        """
        self._entity = WebhookEntity(entity) if isinstance(entity, str) else entity
        self._action = WebhookAction(action) if isinstance(action, str) else action

        # Validate entity/action combination
        if not self._is_valid_combination(self._entity, self._action):
            valid_actions = VALID_ENTITY_ACTIONS.get(self._entity, set())
            raise MlflowException.invalid_parameter_value(
                f"Invalid action '{self._action}' for entity '{self._entity}'. "
                f"Valid actions are: {sorted([a.value for a in valid_actions])}"
            )

    @property
    def entity(self) -> WebhookEntity:
        return self._entity

    @property
    def action(self) -> WebhookAction:
        return self._action

    @staticmethod
    def _is_valid_combination(entity: WebhookEntity, action: WebhookAction) -> bool:
        """
        Check if an entity/action combination is valid.

        Args:
            entity: The webhook entity
            action: The webhook action

        Returns:
            True if the combination is valid, False otherwise
        """
        valid_actions = VALID_ENTITY_ACTIONS.get(entity, set())
        return action in valid_actions

    @classmethod
    def from_proto(cls, proto: ProtoWebhookEvent) -> Self:
        return cls(
            entity=WebhookEntity.from_proto(proto.entity),
            action=WebhookAction.from_proto(proto.action),
        )

    @classmethod
    def from_str(cls, event_str: WebhookEventStr) -> Self:
        """
        Create a WebhookEvent from a dot-separated string representation.

        Args:
            event_str: Valid webhook event string (e.g., "registered_model.created")

        Returns:
            A WebhookEvent instance
        """
        match event_str.split("."):
            case [entity_str, action_str]:
                try:
                    entity = WebhookEntity(entity_str)
                    action = WebhookAction(action_str)
                    return cls(entity=entity, action=action)
                except ValueError as e:
                    raise MlflowException.invalid_parameter_value(
                        f"Invalid entity or action in event string: {event_str}. Error: {e}"
                    )
            case _:
                raise MlflowException.invalid_parameter_value(
                    f"Invalid event string format: {event_str}. "
                    "Expected format: 'entity.action' (e.g., 'registered_model.created')"
                )

    def to_proto(self) -> ProtoWebhookEvent:
        event = ProtoWebhookEvent()
        event.entity = self.entity.to_proto()
        event.action = self.action.to_proto()
        return event

    def __str__(self) -> str:
        return f"{self.entity.value}.{self.action.value}"

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, WebhookEvent):
            return False
        return self.entity == other.entity and self.action == other.action

    def __hash__(self) -> int:
        return hash((self.entity, self.action))

    def __repr__(self) -> str:
        return f"WebhookEvent(entity={self.entity}, action={self.action})"


class Webhook:
    """
    MLflow entity for Webhook.
    """

    def __init__(
        self,
        webhook_id: str,
        name: str,
        url: str,
        events: list[WebhookEvent],
        creation_timestamp: int,
        last_updated_timestamp: int,
        description: str | None = None,
        status: str | WebhookStatus = WebhookStatus.ACTIVE,
        secret: str | None = None,
    ):
        """
        Initialize a Webhook entity.

        Args:
            webhook_id: Unique webhook identifier
            name: Human-readable webhook name
            url: Webhook endpoint URL
            events: List of WebhookEvent objects that trigger this webhook
            creation_timestamp: Creation timestamp in milliseconds since Unix epoch
            last_updated_timestamp: Last update timestamp in milliseconds since Unix epoch
            description: Optional webhook description
            status: Webhook status (ACTIVE or DISABLED)
            secret: Optional secret key for HMAC signature verification
        """
        super().__init__()
        self._webhook_id = webhook_id
        self._name = name
        self._url = url
        if not events:
            raise MlflowException.invalid_parameter_value("Webhook events cannot be empty")
        self._events = events
        self._description = description
        self._status = WebhookStatus(status) if isinstance(status, str) else status
        self._secret = secret
        self._creation_timestamp = creation_timestamp
        self._last_updated_timestamp = last_updated_timestamp

    @property
    def webhook_id(self) -> str:
        return self._webhook_id

    @property
    def name(self) -> str:
        return self._name

    @property
    def url(self) -> str:
        return self._url

    @property
    def events(self) -> list[WebhookEvent]:
        return self._events

    @property
    def description(self) -> str | None:
        return self._description

    @property
    def status(self) -> WebhookStatus:
        return self._status

    @property
    def secret(self) -> str | None:
        return self._secret

    @property
    def creation_timestamp(self) -> int:
        return self._creation_timestamp

    @property
    def last_updated_timestamp(self) -> int:
        return self._last_updated_timestamp

    @classmethod
    def from_proto(cls, proto: ProtoWebhook) -> Self:
        return cls(
            webhook_id=proto.webhook_id,
            name=proto.name,
            url=proto.url,
            events=[WebhookEvent.from_proto(e) for e in proto.events],
            description=proto.description or None,
            status=WebhookStatus.from_proto(proto.status),
            creation_timestamp=proto.creation_timestamp,
            last_updated_timestamp=proto.last_updated_timestamp,
        )

    def to_proto(self):
        webhook = ProtoWebhook()
        webhook.webhook_id = self.webhook_id
        webhook.name = self.name
        webhook.url = self.url
        webhook.events.extend([event.to_proto() for event in self.events])
        if self.description:
            webhook.description = self.description
        webhook.status = self.status.to_proto()
        webhook.creation_timestamp = self.creation_timestamp
        webhook.last_updated_timestamp = self.last_updated_timestamp
        return webhook

    def __repr__(self) -> str:
        return (
            f"Webhook("
            f"webhook_id='{self.webhook_id}', "
            f"name='{self.name}', "
            f"url='{self.url}', "
            f"status='{self.status}', "
            f"events={self.events}, "
            f"creation_timestamp={self.creation_timestamp}, "
            f"last_updated_timestamp={self.last_updated_timestamp}"
            f")"
        )


class WebhookTestResult:
    """
    MLflow entity for WebhookTestResult.
    """

    def __init__(
        self,
        success: bool,
        response_status: int | None = None,
        response_body: str | None = None,
        error_message: str | None = None,
    ):
        """
        Initialize a WebhookTestResult entity.

        Args:
            success: Whether the test succeeded
            response_status: HTTP response status code if available
            response_body: Response body if available
            error_message: Error message if test failed
        """
        self._success = success
        self._response_status = response_status
        self._response_body = response_body
        self._error_message = error_message

    @property
    def success(self) -> bool:
        return self._success

    @property
    def response_status(self) -> int | None:
        return self._response_status

    @property
    def response_body(self) -> str | None:
        return self._response_body

    @property
    def error_message(self) -> str | None:
        return self._error_message

    @classmethod
    def from_proto(cls, proto: ProtoWebhookTestResult) -> Self:
        return cls(
            success=proto.success,
            response_status=proto.response_status or None,
            response_body=proto.response_body or None,
            error_message=proto.error_message or None,
        )

    def to_proto(self) -> ProtoWebhookTestResult:
        return ProtoWebhookTestResult(
            success=self.success,
            response_status=self.response_status,
            response_body=self.response_body,
            error_message=self.error_message,
        )

    def __repr__(self) -> str:
        return (
            f"WebhookTestResult("
            f"success={self.success!r}, "
            f"response_status={self.response_status!r}, "
            f"response_body={self.response_body!r}, "
            f"error_message={self.error_message!r}"
            f")"
        )
```

--------------------------------------------------------------------------------

---[FILE: _job.py]---
Location: mlflow-master/mlflow/entities/_job.py

```python
import json
from typing import Any

from mlflow.entities._job_status import JobStatus
from mlflow.entities._mlflow_object import _MlflowObject


class Job(_MlflowObject):
    """
    MLflow entity representing a Job.
    """

    def __init__(
        self,
        job_id: str,
        creation_time: int,
        job_name: str,
        params: str,
        timeout: float | None,
        status: JobStatus,
        result: str | None,
        retry_count: int,
        last_update_time: int,
    ):
        super().__init__()
        self._job_id = job_id
        self._creation_time = creation_time
        self._job_name = job_name
        self._params = params
        self._timeout = timeout
        self._status = status
        self._result = result
        self._retry_count = retry_count
        self._last_update_time = last_update_time

    @property
    def job_id(self) -> str:
        """String containing job ID."""
        return self._job_id

    @property
    def creation_time(self) -> int:
        """Creation timestamp of the job, in number of milliseconds since the UNIX epoch."""
        return self._creation_time

    @property
    def job_name(self) -> str:
        """
        String containing the static job name that uniquely identifies the decorated job function.
        """
        return self._job_name

    @property
    def params(self) -> str:
        """
        String containing the job serialized parameters in JSON format.
        For example, `{"a": 3, "b": 4}` represents two params:
        `a` with value 3 and `b` with value 4.
        """
        return self._params

    @property
    def timeout(self) -> float | None:
        """
        Job execution timeout in seconds.
        """
        return self._timeout

    @property
    def status(self) -> JobStatus:
        """
        One of the values in :py:class:`mlflow.entities._job_status.JobStatus`
        describing the status of the job.
        """
        return self._status

    @property
    def result(self) -> str | None:
        """String containing the job result or error message."""
        return self._result

    @property
    def parsed_result(self) -> Any:
        """
        Return the parsed result.
        If job status is SUCCEEDED, the parsed result is the
        job function returned value
        If job status is FAILED, the parsed result is the error string.
        Otherwise, the parsed result is None.
        """
        if self.status == JobStatus.SUCCEEDED:
            return json.loads(self.result)
        return self.result

    @property
    def retry_count(self) -> int:
        """Integer containing the job retry count"""
        return self._retry_count

    @property
    def last_update_time(self) -> int:
        """Last update timestamp of the job, in number of milliseconds since the UNIX epoch."""
        return self._last_update_time

    def __repr__(self) -> str:
        return f"<Job(job_id={self.job_id}, job_name={self.job_name})>"
```

--------------------------------------------------------------------------------

---[FILE: _job_status.py]---
Location: mlflow-master/mlflow/entities/_job_status.py

```python
from enum import Enum

from mlflow.exceptions import MlflowException


class JobStatus(str, Enum):
    """Enum for status of a Job."""

    PENDING = "PENDING"
    RUNNING = "RUNNING"
    SUCCEEDED = "SUCCEEDED"
    FAILED = "FAILED"
    TIMEOUT = "TIMEOUT"

    @classmethod
    def from_int(cls, status_int: int) -> "JobStatus":
        """Convert integer status to JobStatus enum."""
        try:
            return next(e for i, e in enumerate(JobStatus) if i == status_int)
        except StopIteration:
            raise MlflowException.invalid_parameter_value(
                f"The value {status_int} can't be converted to JobStatus enum value."
            )

    @classmethod
    def from_str(cls, status_str: str) -> "JobStatus":
        """Convert string status to JobStatus enum."""
        try:
            return JobStatus[status_str]
        except KeyError:
            raise MlflowException.invalid_parameter_value(
                f"The string '{status_str}' can't be converted to JobStatus enum value."
            )

    def to_int(self) -> int:
        """Convert JobStatus enum to integer."""
        return next(i for i, e in enumerate(JobStatus) if e == self)

    def __str__(self):
        return self.name

    @staticmethod
    def is_finalized(status: "JobStatus") -> bool:
        """
        Determines whether or not a JobStatus is a finalized status.
        A finalized status indicates that no further status updates will occur.
        """
        return status in [JobStatus.SUCCEEDED, JobStatus.FAILED, JobStatus.TIMEOUT]
```

--------------------------------------------------------------------------------

---[FILE: _mlflow_object.py]---
Location: mlflow-master/mlflow/entities/_mlflow_object.py

```python
import pprint
from abc import abstractmethod


class _MlflowObject:
    def __iter__(self):
        # Iterate through list of properties and yield as key -> value
        for prop in self._properties():
            yield prop, self.__getattribute__(prop)

    @classmethod
    def _get_properties_helper(cls):
        return sorted([p for p in cls.__dict__ if isinstance(getattr(cls, p), property)])

    @classmethod
    def _properties(cls):
        return cls._get_properties_helper()

    @classmethod
    @abstractmethod
    def from_proto(cls, proto):
        pass

    @classmethod
    def from_dictionary(cls, the_dict):
        filtered_dict = {key: value for key, value in the_dict.items() if key in cls._properties()}
        return cls(**filtered_dict)

    def __repr__(self):
        return to_string(self)


def to_string(obj):
    return _MlflowObjectPrinter().to_string(obj)


def get_classname(obj):
    return type(obj).__name__


class _MlflowObjectPrinter:
    def __init__(self):
        super().__init__()
        self.printer = pprint.PrettyPrinter()

    def to_string(self, obj):
        if isinstance(obj, _MlflowObject):
            return f"<{get_classname(obj)}: {self._entity_to_string(obj)}>"
        return self.printer.pformat(obj)

    def _entity_to_string(self, entity):
        return ", ".join([f"{key}={self.to_string(value)}" for key, value in entity])
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/entities/__init__.py

```python
"""
The ``mlflow.entities`` module defines entities returned by the MLflow
`REST API <../rest-api.html>`_.
"""

from mlflow.entities.assessment import (
    Assessment,
    AssessmentError,
    AssessmentSource,
    AssessmentSourceType,
    Expectation,
    Feedback,
)
from mlflow.entities.dataset import Dataset
from mlflow.entities.dataset_input import DatasetInput
from mlflow.entities.dataset_record import DatasetRecord
from mlflow.entities.dataset_record_source import DatasetRecordSource, DatasetRecordSourceType
from mlflow.entities.dataset_summary import _DatasetSummary
from mlflow.entities.document import Document
from mlflow.entities.entity_type import EntityAssociationType
from mlflow.entities.experiment import Experiment
from mlflow.entities.experiment_tag import ExperimentTag
from mlflow.entities.file_info import FileInfo
from mlflow.entities.gateway_endpoint import (
    GatewayEndpoint,
    GatewayEndpointBinding,
    GatewayEndpointModelMapping,
    GatewayEndpointTag,
    GatewayModelDefinition,
    GatewayResourceType,
)
from mlflow.entities.gateway_secrets import GatewaySecretInfo
from mlflow.entities.input_tag import InputTag
from mlflow.entities.lifecycle_stage import LifecycleStage
from mlflow.entities.logged_model import LoggedModel
from mlflow.entities.logged_model_input import LoggedModelInput
from mlflow.entities.logged_model_output import LoggedModelOutput
from mlflow.entities.logged_model_parameter import LoggedModelParameter
from mlflow.entities.logged_model_status import LoggedModelStatus
from mlflow.entities.logged_model_tag import LoggedModelTag
from mlflow.entities.metric import Metric
from mlflow.entities.model_registry import Prompt
from mlflow.entities.param import Param
from mlflow.entities.run import Run
from mlflow.entities.run_data import RunData
from mlflow.entities.run_info import RunInfo
from mlflow.entities.run_inputs import RunInputs
from mlflow.entities.run_outputs import RunOutputs
from mlflow.entities.run_status import RunStatus
from mlflow.entities.run_tag import RunTag
from mlflow.entities.scorer import ScorerVersion
from mlflow.entities.source_type import SourceType
from mlflow.entities.span import LiveSpan, NoOpSpan, Span, SpanType
from mlflow.entities.span_event import SpanEvent
from mlflow.entities.span_status import SpanStatus, SpanStatusCode
from mlflow.entities.trace import Trace
from mlflow.entities.trace_data import TraceData
from mlflow.entities.trace_info import TraceInfo
from mlflow.entities.trace_location import (
    InferenceTableLocation,
    MlflowExperimentLocation,
    TraceLocation,
    TraceLocationType,
    UCSchemaLocation,
)
from mlflow.entities.trace_state import TraceState
from mlflow.entities.view_type import ViewType
from mlflow.entities.webhook import (
    Webhook,
    WebhookEvent,
    WebhookStatus,
    WebhookTestResult,
)

__all__ = [
    "Experiment",
    "ExperimentTag",
    "FileInfo",
    "Metric",
    "Param",
    "Prompt",
    "Run",
    "RunData",
    "RunInfo",
    "RunStatus",
    "RunTag",
    "ScorerVersion",
    "SourceType",
    "ViewType",
    "LifecycleStage",
    "Dataset",
    "InputTag",
    "DatasetInput",
    "RunInputs",
    "RunOutputs",
    "Span",
    "LiveSpan",
    "NoOpSpan",
    "SpanEvent",
    "SpanStatus",
    "SpanType",
    "Trace",
    "TraceData",
    "TraceInfo",
    "TraceLocation",
    "TraceLocationType",
    "MlflowExperimentLocation",
    "InferenceTableLocation",
    "UCSchemaLocation",
    "TraceState",
    "SpanStatusCode",
    "_DatasetSummary",
    "LoggedModel",
    "LoggedModelInput",
    "LoggedModelOutput",
    "LoggedModelStatus",
    "LoggedModelTag",
    "LoggedModelParameter",
    "Document",
    "Assessment",
    "AssessmentError",
    "AssessmentSource",
    "AssessmentSourceType",
    "Expectation",
    "Feedback",
    # Note: EvaluationDataset is intentionally excluded from __all__ to prevent
    # circular import issues during plugin registration. It can still be imported
    # explicitly via: from mlflow.entities import EvaluationDataset
    "DatasetRecord",
    "DatasetRecordSource",
    "DatasetRecordSourceType",
    "EntityAssociationType",
    "GatewayEndpoint",
    "GatewayEndpointBinding",
    "GatewayEndpointModelMapping",
    "GatewayEndpointTag",
    "GatewayModelDefinition",
    "GatewayResourceType",
    "GatewaySecretInfo",
    "Webhook",
    "WebhookEvent",
    "WebhookStatus",
    "WebhookTestResult",
]


def __getattr__(name):
    """Lazy loading for EvaluationDataset to avoid circular imports."""
    if name == "EvaluationDataset":
        try:
            from mlflow.entities.evaluation_dataset import EvaluationDataset

            return EvaluationDataset
        except ImportError:
            # EvaluationDataset requires mlflow.data which may not be available
            # in minimal installations like mlflow-tracing
            raise AttributeError(
                "EvaluationDataset is not available. It requires the mlflow.data module "
                "which is not included in this installation."
            )
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
```

--------------------------------------------------------------------------------

````
