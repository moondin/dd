---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 357
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 357 of 991)

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

---[FILE: databricks_pb2.pyi]---
Location: mlflow-master/mlflow/protos/databricks_pb2.pyi

```text
from google.protobuf import descriptor_pb2 as _descriptor_pb2
from scalapb import scalapb_pb2 as _scalapb_pb2
from google.protobuf.internal import containers as _containers
from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Mapping as _Mapping, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class Visibility(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    PUBLIC: _ClassVar[Visibility]
    INTERNAL: _ClassVar[Visibility]
    PUBLIC_UNDOCUMENTED: _ClassVar[Visibility]

class ErrorCode(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    INTERNAL_ERROR: _ClassVar[ErrorCode]
    TEMPORARILY_UNAVAILABLE: _ClassVar[ErrorCode]
    IO_ERROR: _ClassVar[ErrorCode]
    BAD_REQUEST: _ClassVar[ErrorCode]
    SERVICE_UNDER_MAINTENANCE: _ClassVar[ErrorCode]
    WORKSPACE_TEMPORARILY_UNAVAILABLE: _ClassVar[ErrorCode]
    DEADLINE_EXCEEDED: _ClassVar[ErrorCode]
    CANCELLED: _ClassVar[ErrorCode]
    RESOURCE_EXHAUSTED: _ClassVar[ErrorCode]
    ABORTED: _ClassVar[ErrorCode]
    NOT_FOUND: _ClassVar[ErrorCode]
    ALREADY_EXISTS: _ClassVar[ErrorCode]
    UNAUTHENTICATED: _ClassVar[ErrorCode]
    INVALID_PARAMETER_VALUE: _ClassVar[ErrorCode]
    ENDPOINT_NOT_FOUND: _ClassVar[ErrorCode]
    MALFORMED_REQUEST: _ClassVar[ErrorCode]
    INVALID_STATE: _ClassVar[ErrorCode]
    PERMISSION_DENIED: _ClassVar[ErrorCode]
    FEATURE_DISABLED: _ClassVar[ErrorCode]
    CUSTOMER_UNAUTHORIZED: _ClassVar[ErrorCode]
    REQUEST_LIMIT_EXCEEDED: _ClassVar[ErrorCode]
    RESOURCE_CONFLICT: _ClassVar[ErrorCode]
    UNPARSEABLE_HTTP_ERROR: _ClassVar[ErrorCode]
    NOT_IMPLEMENTED: _ClassVar[ErrorCode]
    DATA_LOSS: _ClassVar[ErrorCode]
    INVALID_STATE_TRANSITION: _ClassVar[ErrorCode]
    COULD_NOT_ACQUIRE_LOCK: _ClassVar[ErrorCode]
    RESOURCE_ALREADY_EXISTS: _ClassVar[ErrorCode]
    RESOURCE_DOES_NOT_EXIST: _ClassVar[ErrorCode]
    QUOTA_EXCEEDED: _ClassVar[ErrorCode]
    MAX_BLOCK_SIZE_EXCEEDED: _ClassVar[ErrorCode]
    MAX_READ_SIZE_EXCEEDED: _ClassVar[ErrorCode]
    PARTIAL_DELETE: _ClassVar[ErrorCode]
    MAX_LIST_SIZE_EXCEEDED: _ClassVar[ErrorCode]
    DRY_RUN_FAILED: _ClassVar[ErrorCode]
    RESOURCE_LIMIT_EXCEEDED: _ClassVar[ErrorCode]
    DIRECTORY_NOT_EMPTY: _ClassVar[ErrorCode]
    DIRECTORY_PROTECTED: _ClassVar[ErrorCode]
    MAX_NOTEBOOK_SIZE_EXCEEDED: _ClassVar[ErrorCode]
    MAX_CHILD_NODE_SIZE_EXCEEDED: _ClassVar[ErrorCode]
    SEARCH_QUERY_TOO_LONG: _ClassVar[ErrorCode]
    SEARCH_QUERY_TOO_SHORT: _ClassVar[ErrorCode]
    MANAGED_RESOURCE_GROUP_DOES_NOT_EXIST: _ClassVar[ErrorCode]
    PERMISSION_NOT_PROPAGATED: _ClassVar[ErrorCode]
    DEPLOYMENT_TIMEOUT: _ClassVar[ErrorCode]
    GIT_CONFLICT: _ClassVar[ErrorCode]
    GIT_UNKNOWN_REF: _ClassVar[ErrorCode]
    GIT_SENSITIVE_TOKEN_DETECTED: _ClassVar[ErrorCode]
    GIT_URL_NOT_ON_ALLOW_LIST: _ClassVar[ErrorCode]
    GIT_REMOTE_ERROR: _ClassVar[ErrorCode]
    PROJECTS_OPERATION_TIMEOUT: _ClassVar[ErrorCode]
    IPYNB_FILE_IN_REPO: _ClassVar[ErrorCode]
    INSECURE_PARTNER_RESPONSE: _ClassVar[ErrorCode]
    MALFORMED_PARTNER_RESPONSE: _ClassVar[ErrorCode]
    METASTORE_DOES_NOT_EXIST: _ClassVar[ErrorCode]
    DAC_DOES_NOT_EXIST: _ClassVar[ErrorCode]
    CATALOG_DOES_NOT_EXIST: _ClassVar[ErrorCode]
    SCHEMA_DOES_NOT_EXIST: _ClassVar[ErrorCode]
    TABLE_DOES_NOT_EXIST: _ClassVar[ErrorCode]
    SHARE_DOES_NOT_EXIST: _ClassVar[ErrorCode]
    RECIPIENT_DOES_NOT_EXIST: _ClassVar[ErrorCode]
    STORAGE_CREDENTIAL_DOES_NOT_EXIST: _ClassVar[ErrorCode]
    EXTERNAL_LOCATION_DOES_NOT_EXIST: _ClassVar[ErrorCode]
    PRINCIPAL_DOES_NOT_EXIST: _ClassVar[ErrorCode]
    PROVIDER_DOES_NOT_EXIST: _ClassVar[ErrorCode]
    METASTORE_ALREADY_EXISTS: _ClassVar[ErrorCode]
    DAC_ALREADY_EXISTS: _ClassVar[ErrorCode]
    CATALOG_ALREADY_EXISTS: _ClassVar[ErrorCode]
    SCHEMA_ALREADY_EXISTS: _ClassVar[ErrorCode]
    TABLE_ALREADY_EXISTS: _ClassVar[ErrorCode]
    SHARE_ALREADY_EXISTS: _ClassVar[ErrorCode]
    RECIPIENT_ALREADY_EXISTS: _ClassVar[ErrorCode]
    STORAGE_CREDENTIAL_ALREADY_EXISTS: _ClassVar[ErrorCode]
    EXTERNAL_LOCATION_ALREADY_EXISTS: _ClassVar[ErrorCode]
    PROVIDER_ALREADY_EXISTS: _ClassVar[ErrorCode]
    CATALOG_NOT_EMPTY: _ClassVar[ErrorCode]
    SCHEMA_NOT_EMPTY: _ClassVar[ErrorCode]
    METASTORE_NOT_EMPTY: _ClassVar[ErrorCode]
    PROVIDER_SHARE_NOT_ACCESSIBLE: _ClassVar[ErrorCode]
PUBLIC: Visibility
INTERNAL: Visibility
PUBLIC_UNDOCUMENTED: Visibility
INTERNAL_ERROR: ErrorCode
TEMPORARILY_UNAVAILABLE: ErrorCode
IO_ERROR: ErrorCode
BAD_REQUEST: ErrorCode
SERVICE_UNDER_MAINTENANCE: ErrorCode
WORKSPACE_TEMPORARILY_UNAVAILABLE: ErrorCode
DEADLINE_EXCEEDED: ErrorCode
CANCELLED: ErrorCode
RESOURCE_EXHAUSTED: ErrorCode
ABORTED: ErrorCode
NOT_FOUND: ErrorCode
ALREADY_EXISTS: ErrorCode
UNAUTHENTICATED: ErrorCode
INVALID_PARAMETER_VALUE: ErrorCode
ENDPOINT_NOT_FOUND: ErrorCode
MALFORMED_REQUEST: ErrorCode
INVALID_STATE: ErrorCode
PERMISSION_DENIED: ErrorCode
FEATURE_DISABLED: ErrorCode
CUSTOMER_UNAUTHORIZED: ErrorCode
REQUEST_LIMIT_EXCEEDED: ErrorCode
RESOURCE_CONFLICT: ErrorCode
UNPARSEABLE_HTTP_ERROR: ErrorCode
NOT_IMPLEMENTED: ErrorCode
DATA_LOSS: ErrorCode
INVALID_STATE_TRANSITION: ErrorCode
COULD_NOT_ACQUIRE_LOCK: ErrorCode
RESOURCE_ALREADY_EXISTS: ErrorCode
RESOURCE_DOES_NOT_EXIST: ErrorCode
QUOTA_EXCEEDED: ErrorCode
MAX_BLOCK_SIZE_EXCEEDED: ErrorCode
MAX_READ_SIZE_EXCEEDED: ErrorCode
PARTIAL_DELETE: ErrorCode
MAX_LIST_SIZE_EXCEEDED: ErrorCode
DRY_RUN_FAILED: ErrorCode
RESOURCE_LIMIT_EXCEEDED: ErrorCode
DIRECTORY_NOT_EMPTY: ErrorCode
DIRECTORY_PROTECTED: ErrorCode
MAX_NOTEBOOK_SIZE_EXCEEDED: ErrorCode
MAX_CHILD_NODE_SIZE_EXCEEDED: ErrorCode
SEARCH_QUERY_TOO_LONG: ErrorCode
SEARCH_QUERY_TOO_SHORT: ErrorCode
MANAGED_RESOURCE_GROUP_DOES_NOT_EXIST: ErrorCode
PERMISSION_NOT_PROPAGATED: ErrorCode
DEPLOYMENT_TIMEOUT: ErrorCode
GIT_CONFLICT: ErrorCode
GIT_UNKNOWN_REF: ErrorCode
GIT_SENSITIVE_TOKEN_DETECTED: ErrorCode
GIT_URL_NOT_ON_ALLOW_LIST: ErrorCode
GIT_REMOTE_ERROR: ErrorCode
PROJECTS_OPERATION_TIMEOUT: ErrorCode
IPYNB_FILE_IN_REPO: ErrorCode
INSECURE_PARTNER_RESPONSE: ErrorCode
MALFORMED_PARTNER_RESPONSE: ErrorCode
METASTORE_DOES_NOT_EXIST: ErrorCode
DAC_DOES_NOT_EXIST: ErrorCode
CATALOG_DOES_NOT_EXIST: ErrorCode
SCHEMA_DOES_NOT_EXIST: ErrorCode
TABLE_DOES_NOT_EXIST: ErrorCode
SHARE_DOES_NOT_EXIST: ErrorCode
RECIPIENT_DOES_NOT_EXIST: ErrorCode
STORAGE_CREDENTIAL_DOES_NOT_EXIST: ErrorCode
EXTERNAL_LOCATION_DOES_NOT_EXIST: ErrorCode
PRINCIPAL_DOES_NOT_EXIST: ErrorCode
PROVIDER_DOES_NOT_EXIST: ErrorCode
METASTORE_ALREADY_EXISTS: ErrorCode
DAC_ALREADY_EXISTS: ErrorCode
CATALOG_ALREADY_EXISTS: ErrorCode
SCHEMA_ALREADY_EXISTS: ErrorCode
TABLE_ALREADY_EXISTS: ErrorCode
SHARE_ALREADY_EXISTS: ErrorCode
RECIPIENT_ALREADY_EXISTS: ErrorCode
STORAGE_CREDENTIAL_ALREADY_EXISTS: ErrorCode
EXTERNAL_LOCATION_ALREADY_EXISTS: ErrorCode
PROVIDER_ALREADY_EXISTS: ErrorCode
CATALOG_NOT_EMPTY: ErrorCode
SCHEMA_NOT_EMPTY: ErrorCode
METASTORE_NOT_EMPTY: ErrorCode
PROVIDER_SHARE_NOT_ACCESSIBLE: ErrorCode
VISIBILITY_FIELD_NUMBER: _ClassVar[int]
visibility: _descriptor.FieldDescriptor
VALIDATE_REQUIRED_FIELD_NUMBER: _ClassVar[int]
validate_required: _descriptor.FieldDescriptor
JSON_INLINE_FIELD_NUMBER: _ClassVar[int]
json_inline: _descriptor.FieldDescriptor
JSON_MAP_FIELD_NUMBER: _ClassVar[int]
json_map: _descriptor.FieldDescriptor
FIELD_DOC_FIELD_NUMBER: _ClassVar[int]
field_doc: _descriptor.FieldDescriptor
RPC_FIELD_NUMBER: _ClassVar[int]
rpc: _descriptor.FieldDescriptor
METHOD_DOC_FIELD_NUMBER: _ClassVar[int]
method_doc: _descriptor.FieldDescriptor
GRAPHQL_FIELD_NUMBER: _ClassVar[int]
graphql: _descriptor.FieldDescriptor
MESSAGE_DOC_FIELD_NUMBER: _ClassVar[int]
message_doc: _descriptor.FieldDescriptor
SERVICE_DOC_FIELD_NUMBER: _ClassVar[int]
service_doc: _descriptor.FieldDescriptor
ENUM_DOC_FIELD_NUMBER: _ClassVar[int]
enum_doc: _descriptor.FieldDescriptor
ENUM_VALUE_VISIBILITY_FIELD_NUMBER: _ClassVar[int]
enum_value_visibility: _descriptor.FieldDescriptor
ENUM_VALUE_DOC_FIELD_NUMBER: _ClassVar[int]
enum_value_doc: _descriptor.FieldDescriptor

class DatabricksRpcOptions(_message.Message):
    __slots__ = ("endpoints", "visibility", "error_codes", "rate_limit", "rpc_doc_title")
    ENDPOINTS_FIELD_NUMBER: _ClassVar[int]
    VISIBILITY_FIELD_NUMBER: _ClassVar[int]
    ERROR_CODES_FIELD_NUMBER: _ClassVar[int]
    RATE_LIMIT_FIELD_NUMBER: _ClassVar[int]
    RPC_DOC_TITLE_FIELD_NUMBER: _ClassVar[int]
    endpoints: _containers.RepeatedCompositeFieldContainer[HttpEndpoint]
    visibility: Visibility
    error_codes: _containers.RepeatedScalarFieldContainer[ErrorCode]
    rate_limit: RateLimit
    rpc_doc_title: str
    def __init__(self, endpoints: _Optional[_Iterable[_Union[HttpEndpoint, _Mapping]]] = ..., visibility: _Optional[_Union[Visibility, str]] = ..., error_codes: _Optional[_Iterable[_Union[ErrorCode, str]]] = ..., rate_limit: _Optional[_Union[RateLimit, _Mapping]] = ..., rpc_doc_title: _Optional[str] = ...) -> None: ...

class DatabricksGraphqlOptions(_message.Message):
    __slots__ = ()
    def __init__(self) -> None: ...

class HttpEndpoint(_message.Message):
    __slots__ = ("method", "path", "since")
    METHOD_FIELD_NUMBER: _ClassVar[int]
    PATH_FIELD_NUMBER: _ClassVar[int]
    SINCE_FIELD_NUMBER: _ClassVar[int]
    method: str
    path: str
    since: ApiVersion
    def __init__(self, method: _Optional[str] = ..., path: _Optional[str] = ..., since: _Optional[_Union[ApiVersion, _Mapping]] = ...) -> None: ...

class ApiVersion(_message.Message):
    __slots__ = ("major", "minor")
    MAJOR_FIELD_NUMBER: _ClassVar[int]
    MINOR_FIELD_NUMBER: _ClassVar[int]
    major: int
    minor: int
    def __init__(self, major: _Optional[int] = ..., minor: _Optional[int] = ...) -> None: ...

class RateLimit(_message.Message):
    __slots__ = ("max_burst", "max_sustained_per_second")
    MAX_BURST_FIELD_NUMBER: _ClassVar[int]
    MAX_SUSTAINED_PER_SECOND_FIELD_NUMBER: _ClassVar[int]
    max_burst: int
    max_sustained_per_second: int
    def __init__(self, max_burst: _Optional[int] = ..., max_sustained_per_second: _Optional[int] = ...) -> None: ...

class DocumentationMetadata(_message.Message):
    __slots__ = ("docstring", "lead_doc", "visibility", "original_proto_path", "position")
    DOCSTRING_FIELD_NUMBER: _ClassVar[int]
    LEAD_DOC_FIELD_NUMBER: _ClassVar[int]
    VISIBILITY_FIELD_NUMBER: _ClassVar[int]
    ORIGINAL_PROTO_PATH_FIELD_NUMBER: _ClassVar[int]
    POSITION_FIELD_NUMBER: _ClassVar[int]
    docstring: str
    lead_doc: str
    visibility: Visibility
    original_proto_path: _containers.RepeatedScalarFieldContainer[str]
    position: int
    def __init__(self, docstring: _Optional[str] = ..., lead_doc: _Optional[str] = ..., visibility: _Optional[_Union[Visibility, str]] = ..., original_proto_path: _Optional[_Iterable[str]] = ..., position: _Optional[int] = ...) -> None: ...
```

--------------------------------------------------------------------------------

---[FILE: databricks_tracing.proto]---
Location: mlflow-master/mlflow/protos/databricks_tracing.proto

```proto
// This file contains the proto definition for communicating with the Databricks tracking server.
// The message definition should be kept in (mostly) sync with the MLflow service definition.
syntax = "proto2";

package mlflow.databricks;

import "assessments.proto";
import "databricks.proto";
import "google/protobuf/duration.proto";
import "google/protobuf/field_mask.proto";
import "google/protobuf/timestamp.proto";
import "opentelemetry/proto/trace/v1/trace.proto";
import "scalapb/scalapb.proto";

option py_generic_services = true;

service DatabricksTrackingService {
  rpc createTraceInfo(CreateTraceInfo) returns (TraceInfo) {
    option (rpc) = {
      endpoints: [
        {
          method: "POST"
          path: "/mlflow/traces/{location_id}/{trace_info.trace_id}/info"
          since: {
            major: 4
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "Create Trace Info v4"
    };
  }

  // Get complete traces with spans for given trace identifiers.
  rpc batchGetTraces(BatchGetTraces) returns (BatchGetTraces.Response) {
    option (rpc) = {
      endpoints: [
        {
          method: "GET"
          path: "/mlflow/traces/{location_id}/batchGet"
          since: {
            major: 4
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "Get Traces V4"
    };
  }

  // Get Trace Info
  rpc getTraceInfo(GetTraceInfo) returns (GetTraceInfo.Response) {
    option (rpc) = {
      endpoints: [
        {
          method: "GET"
          path: "/mlflow/traces/{location}/{trace_id}/info"
          since: {
            major: 4
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "Get TraceInfo"
    };
  }

  // Set a tag on a trace. Tags are mutable and can be updated as desired.
  rpc setTraceTag(SetTraceTag) returns (SetTraceTag.Response) {
    option (rpc) = {
      endpoints: [
        {
          method: "PATCH"
          path: "/mlflow/traces/{location_id}/{trace_id}/tags"
          since: {
            major: 4
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "Set Trace Tag"
    };
  }

  // Delete a tag from a trace.
  rpc deleteTraceTag(DeleteTraceTag) returns (DeleteTraceTag.Response) {
    option (rpc) = {
      endpoints: [
        {
          method: "DELETE"
          path: "/mlflow/traces/{location_id}/{trace_id}/tags/{key}"
          since: {
            major: 4
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "Delete Trace Tag"
    };
  }

  // Search traces
  rpc searchTraces(SearchTraces) returns (SearchTraces.Response) {
    option (rpc) = {
      endpoints: [
        {
          method: "POST"
          path: "/mlflow/traces/search"
          since: {
            major: 4
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "Search Traces"
    };
  }

  // =============================================================================
  // Enablement RPCs
  // =============================================================================

  rpc createTraceUCStorageLocation(CreateTraceUCStorageLocation) returns (CreateTraceUCStorageLocation.Response) {
    option (rpc) = {
      endpoints: [
        {
          method: "POST"
          path: "/mlflow/traces/location"
          since: {
            major: 4
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "Create Trace UC Storage Location"
    };
  }

  rpc linkExperimentToUCTraceLocation(LinkExperimentToUCTraceLocation) returns (LinkExperimentToUCTraceLocation.Response) {
    option (rpc) = {
      endpoints: [
        {
          method: "POST"
          path: "/mlflow/traces/{experiment_id}/link-location"
          since: {
            major: 4
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "Link Experiment to UC Trace Location"
    };
  }

  rpc unlinkExperimentToUCTraceLocation(UnLinkExperimentToUCTraceLocation) returns (UnLinkExperimentToUCTraceLocation.Response) {
    option (rpc) = {
      endpoints: [
        {
          method: "POST"
          path: "/mlflow/traces/{experiment_id}/unlink-location"
          since: {
            major: 4
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "Unlink Experiment to UC Trace Location"
    };
  }

  // =============================================================================
  // Assessment RPCs
  // =============================================================================

  // Create an assessment associated with a trace.
  rpc createAssessment(CreateAssessment) returns (CreateAssessment.Response) {
    option (rpc) = {
      endpoints: [
        {
          method: "POST"
          path: "/mlflow/traces/{location_id}/{assessment.trace_id}/assessments"
          since: {
            major: 4
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "Create Assessment"
    };
  }

  // Get an assessment.
  rpc getAssessment(GetAssessment) returns (GetAssessment.Response) {
    option (rpc) = {
      endpoints: [
        {
          method: "GET"
          path: "/mlflow/traces/{location_id}/{trace_id}/assessments/{assessment_id}"
          since: {
            major: 4
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "Get Assessment"
    };
  }

  // Update an assessment.
  rpc updateAssessment(UpdateAssessment) returns (UpdateAssessment.Response) {
    option (rpc) = {
      endpoints: [
        {
          method: "PATCH"
          path: "/mlflow/traces/{location_id}/{assessment.trace_id}/assessments/{assessment.assessment_id}"
          since: {
            major: 4
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "Update Assessment"
    };
  }

  // Delete an assessment.
  rpc deleteAssessment(DeleteAssessment) returns (DeleteAssessment.Response) {
    option (rpc) = {
      endpoints: [
        {
          method: "DELETE"
          path: "/mlflow/traces/{location_id}/{trace_id}/assessments/{assessment_id}"
          since: {
            major: 4
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "Delete Assessment"
    };
  }

  // =============================================================================
  // Trace-to-Run Linking RPCs
  // =============================================================================

  // Link traces to a run by creating internal trace-to-run relationships.
  // This API allows associating multiple traces with a single run for evaluation and labeling workflows.
  rpc batchLinkTraceToRun(BatchLinkTraceToRun) returns (BatchLinkTraceToRun.Response) {
    option (rpc) = {
      endpoints: [
        {
          method: "POST"
          path: "/mlflow/traces/{location_id}/link-to-run/batchCreate"
          since: {
            major: 4
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "Link Traces to Run"
    };
  }

  // Unlink traces from a run by removing the internal trace-to-run relationships.
  // This API allows batch edit of relationship across multiple traces with a single run.
  rpc batchUnlinkTraceFromRun(BatchUnlinkTraceFromRun) returns (BatchUnlinkTraceFromRun.Response) {
    option (rpc) = {
      endpoints: [
        {
          method: "DELETE"
          path: "/mlflow/traces/{location_id}/unlink-from-run/batchDelete"
          since: {
            major: 4
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "Unlink Traces from Run"
    };
  }
}

message UCSchemaLocation {
  optional string catalog_name = 1;
  optional string schema_name = 2;
  // spans table name, only for output
  optional string otel_spans_table_name = 3;
  // logs table name, only for output
  optional string otel_logs_table_name = 4;
}

message MlflowExperimentLocation {
  // MLflow experiment ID which is the ACL container holding the trace.
  optional string experiment_id = 1;
}

message InferenceTableLocation {
  // Full inference table name in the form of catalog.schema.table_name
  optional string full_table_name = 1;
}

// The location where the traces was stored and produced
message TraceLocation {
  enum TraceLocationType {
    TRACE_LOCATION_TYPE_UNSPECIFIED = 0;
    MLFLOW_EXPERIMENT = 1;
    INFERENCE_TABLE = 2;
    UC_SCHEMA = 3;
  }
  optional TraceLocationType type = 1;

  oneof identifier {
    MlflowExperimentLocation mlflow_experiment = 2;
    InferenceTableLocation inference_table = 3;
    UCSchemaLocation uc_schema = 4;
  }
}

message TraceInfo {
  // The primary key associated with the trace
  optional string trace_id = 1;

  // Client supplied request ID associated with the trace. This could be used to identify the trace/request from an
  // external system that produced the trace.
  optional string client_request_id = 2;

  optional TraceLocation trace_location = 3;

  // A preview of the request to the model/agent represented as a JSON string. This is equivalent to the input of the root
  // span. This preview value is truncated to 10KB while the full request is stored in the trace data in blob storage.
  optional string request_preview = 4;

  // A preview of the request to the model/agent represented as a JSON string. This is equivalent to the output of the root
  // span. This preview value is truncated to 10KB while the full response is stored in the trace data in blob storage.
  optional string response_preview = 5;

  // Start time of the trace
  optional google.protobuf.Timestamp request_time = 6;

  // Execution time of the trace
  optional google.protobuf.Duration execution_duration = 7;

  // Execution state of the trace at the time that it was logged.
  enum State {
    STATE_UNSPECIFIED = 0;

    // The operation being traced was successful.
    OK = 1;

    // The operation being traced failed.
    ERROR = 2;

    // The operation being traced is still in progress. This is useful for incremental/distributed tracing logging in
    // contrast with when the full trace is logged only upon its completion.
    IN_PROGRESS = 3;
  }
  optional State state = 8;

  // Metadata associated with the trace.
  // Examples include:
  // - run_id: The ID of the mlflow Run (i.e. evaluation job) that produced the trace. May not be
  //           applicable in certain situations such as if the trace was created via interactive vibe checks)
  // - model_id: The ID of the associated model that produced the trace.
  // - dataset_id: The ID of the mlflow Dataset (usually used together with dataset_record_id)
  // - dataset_record_id: The ID of the mlflow Dataset (usually used together with dataset_record_id)
  // - session_id: The ID of the session (e.g. chat conversation) where the request came from
  map<string, string> trace_metadata = 9;

  repeated Assessment assessments = 10;

  // Mutable, user-defined tags for the trace, e.g. "question_topic": "DBSQL"
  map<string, string> tags = 11;
}

message CreateTraceInfo {
  option (scalapb.message).extends = "com.databricks.rpc.RPC[$this.Response]";

  // The location ID of the trace.
  optional string location_id = 1 [(validate_required) = true];

  // The information for the trace being created.
  optional TraceInfo trace_info = 2 [(validate_required) = true];

  message Response {
    // The created trace information.
    optional TraceInfo trace_info = 1;
  }
}

message TracePath {
  // location of the trace
  optional TraceLocation trace_location = 1 [(validate_required) = true];

  // ID of the trace.
  optional string trace_id = 2 [(validate_required) = true];
}

message Trace {
  optional TraceInfo trace_info = 1;
  repeated opentelemetry.proto.trace.v1.Span spans = 2;
}

message BatchGetTraces {
  option (scalapb.message).extends = "com.databricks.rpc.RPC[$this.Response]";

  // The location ID to search on (e.g. "main.catalog" for UC schema).
  optional string location_id = 1 [(validate_required) = true];

  // The trace IDs to fetch. They must all be located in the same location specified by location_id.
  repeated string trace_ids = 2;

  // SQL warehouse ID for UC queries
  optional string sql_warehouse_id = 3;

  message Response {
    // The fetched trace information.
    repeated Trace traces = 1;
  }
}

message GetTraceInfo {
  option (scalapb.message).extends = "com.databricks.rpc.RPC[$this.Response]";

  // ID of the trace to fetch. Must be provided.
  optional string trace_id = 1 [(validate_required) = true];

  // Location of the trace to fetch from. Must be provided.
  optional string location = 2 [(validate_required) = true];

  // Optional SQL warehouse ID for fetching trace data.
  optional string sql_warehouse_id = 3;

  message Response {
    optional Trace trace = 1;
  }
}

message SetTraceTag {
  option (scalapb.message).extends = "com.databricks.rpc.RPC[$this.Response]";

  // ID of the trace on which to set a tag.
  optional string trace_id = 1 [(validate_required) = true];

  // The location ID (experiment_id or catalog.schema).
  optional string location_id = 2 [(validate_required) = true];

  // Name of the tag. Maximum size depends on storage backend.
  // All storage backends are guaranteed to support key values up to 250 bytes in size.
  optional string key = 3 [(validate_required) = true];

  // String value of the tag being logged. Maximum size depends on storage backend.
  // All storage backends are guaranteed to support key values up to 250 bytes in size.
  optional string value = 4;

  message Response {}
}

message DeleteTraceTag {
  option (scalapb.message).extends = "com.databricks.rpc.RPC[$this.Response]";

  // ID of the trace on which to set a tag.
  optional string trace_id = 1 [(validate_required) = true];

  // The location ID (experiment_id or catalog.schema).
  optional string location_id = 2 [(validate_required) = true];

  // Name of the tag to delete.
  optional string key = 3 [(validate_required) = true];

  // Optional SQL warehouse ID for setting trace tag.
  optional string sql_warehouse_id = 4;

  message Response {}
}

message SearchTraces {
  option (scalapb.message).extends = "com.databricks.rpc.RPC[$this.Response]";

  // A list of trace locations to search over.
  repeated TraceLocation locations = 1;

  // A filter expression over trace attributes and tags that allows returning a subset of
  // traces. The syntax is a subset of SQL that supports ANDing together binary operations
  // Example: ``trace.status = 'OK' and trace.timestamp_ms > 1711089570679``.
  optional string filter = 2;

  // Maximum number of traces desired. Max threshold is 500.
  optional int32 max_results = 3 [default = 100];

  // List of columns for ordering the results, e.g. ``["timestamp_ms DESC"]``.
  repeated string order_by = 4;

  // Optional SQL warehouse ID for searching traces.
  optional string sql_warehouse_id = 5;

  // Token indicating the page of traces to fetch.
  optional string page_token = 6;

  message Response {
    // Information about traces that match the search criteria.
    repeated TraceInfo trace_infos = 1;
    optional string next_page_token = 2;
  }
}

// =============================================================================
// Enablement API Messages
// =============================================================================

message CreateTraceUCStorageLocation {
  option (scalapb.message).extends = "com.databricks.rpc.RPC[$this.Response]";

  oneof location {
    UCSchemaLocation uc_schema = 1;
  }

  // SQL warehouse ID for creating views and querying
  optional string sql_warehouse_id = 2 [(validate_required) = true];

  message Response {
    optional UCSchemaLocation uc_schema = 1;
  }
}

message LinkExperimentToUCTraceLocation {
  option (scalapb.message).extends = "com.databricks.rpc.RPC[$this.Response]";

  // The experiment ID to link the location
  optional string experiment_id = 1 [(validate_required) = true];

  // Location to link.
  oneof location {
    UCSchemaLocation uc_schema = 2;
  }

  message Response {}
}

message UnLinkExperimentToUCTraceLocation {
  option (scalapb.message).extends = "com.databricks.rpc.RPC[$this.Response]";

  // Experiment ID to unlink from
  optional string experiment_id = 1 [(validate_required) = true];

  // Location to unlink.
  oneof location {
    UCSchemaLocation uc_schema = 2;
  }

  message Response {}
}

// =============================================================================
// Assessment API Messages
// =============================================================================
// Note: We import assessment types from assessments.proto and extend Assessment
// with trace_location field for Databricks-specific use cases.

// Data and metadata for an assessment of a trace.
message Assessment {
  // Unique ID of the assessment.
  // NB: This is not marked as required field via "validate_required", because the message is
  //  used in the context of creating a new assessment, where the ID is not known.
  optional string assessment_id = 1;

  // Name of the assessment. The name must not contain ".".
  optional string assessment_name = 2 [(validate_required) = true];

  // ID of the trace this assessment is associated with.
  optional string trace_id = 3 [(validate_required) = true];

  // Location of the trace this assessment is associated with.
  optional TraceLocation trace_location = 4;

  // ID of the span if the assessment is for a particular span (optional).
  optional string span_id = 5;

  // The source this assessment came from.
  optional assessments.AssessmentSource source = 6;

  // The creation time of this assessment.
  optional google.protobuf.Timestamp create_time = 7;

  // The last update time of this assessment.
  optional google.protobuf.Timestamp last_update_time = 8;

  // An Assessment can either be human/code/judge Feedback, human-generated Expectation, or an error.
  // The name of the Feedback or Expectation must be the same with the assessment_name.
  oneof value {
    // The feedback on the trace from this assessment.
    assessments.Feedback feedback = 9;
    // A representation of the guidelines and/or expected response from the agent.
    assessments.Expectation expectation = 10;
  }

  // Justification for the assessment.
  optional string rationale = 11;

  // Additional metadata describing the assessment and store additional information,
  // such as the chunk relevance chunk_index. This metadata is required to be JSON-serializable.
  map<string, string> metadata = 12;

  // The ID of the assessment which this assessment overrides.
  optional string overrides = 13;

  // Whether this assessment is valid (i.e. has not been superseded)
  // defaults to true, and is set to false if a new superseding assessment
  // is created.
  optional bool valid = 14 [default = true];
}

// Create an assessment.
message CreateAssessment {
  option (scalapb.message).extends = "com.databricks.rpc.RPC[$this.Response]";

  // Location ID (experiment_id or catalog.schema)
  // This must match the trace_location supplied in the assessment field.
  optional string location_id = 1 [(validate_required) = true];
  // Assessment to create
  optional Assessment assessment = 2 [(validate_required) = true];
  // SQL warehouse ID for UC queries
  optional string sql_warehouse_id = 3;

  message Response {
    // The created assessment.
    optional Assessment assessment = 1;
  }
}

// Get an assessment.
message GetAssessment {
  option (scalapb.message).extends = "com.databricks.rpc.RPC[$this.Response]";

  // Location ID (experiment_id or catalog.schema)
  optional string location_id = 1 [(validate_required) = true];
  // Trace ID
  optional string trace_id = 2 [(validate_required) = true];
  // Assessment ID to retrieve
  optional string assessment_id = 3 [(validate_required) = true];
  // SQL warehouse ID for UC queries
  optional string sql_warehouse_id = 4;

  message Response {
    // The requested assessment.
    optional Assessment assessment = 1;
  }
}

// Update an assessment.
message UpdateAssessment {
  option (scalapb.message).extends = "com.databricks.rpc.RPC[$this.Response]";

  // Location ID (experiment_id or catalog.schema)
  optional string location_id = 1 [(validate_required) = true];
  // Assessment with updated fields
  optional Assessment assessment = 2 [(validate_required) = true];
  // Field mask specifying which fields to update
  //
  // Valid field names to update are:
  //    `assessment_name`,
  //    `span_id`,
  //    `source`,
  //    `feedback`,
  //    `expectation`,
  //    `rationale`,
  //    `metadata`,
  //    `overrides`, and
  //    `valid`.
  optional google.protobuf.FieldMask update_mask = 3 [(validate_required) = true];
  // SQL warehouse ID for UC queries
  optional string sql_warehouse_id = 4;

  message Response {
    // The assessment after the update.
    optional Assessment assessment = 1;
  }
}

// Delete an assessment.
message DeleteAssessment {
  option (scalapb.message).extends = "com.databricks.rpc.RPC[$this.Response]";

  // Location ID (experiment_id or catalog.schema)
  optional string location_id = 1 [(validate_required) = true];
  // Trace ID
  optional string trace_id = 2 [(validate_required) = true];
  // Assessment ID to delete
  optional string assessment_id = 3 [(validate_required) = true];
  // SQL warehouse ID for UC queries
  optional string sql_warehouse_id = 4;

  message Response {}
}

// =============================================================================
// Trace-to-Run Linking API Messages
// =============================================================================

// Link traces to a run by creating internal trace-to-run relationships.
message BatchLinkTraceToRun {
  option (scalapb.message).extends = "com.databricks.rpc.RPC[$this.Response]";

  // The location ID (experiment_id or catalog.schema) where the traces are stored.
  optional string location_id = 1 [(validate_required) = true];

  // IDs of the traces to link to the run.
  // The maximum number of trace IDs that can be linked in a single request is 100.
  repeated string trace_ids = 2;

  // ID of the run to link the traces to.
  optional string run_id = 3 [(validate_required) = true];

  message Response {
    // Empty response
  }
}

// Unlink traces from a run by removing the internal trace-to-run relationships.
message BatchUnlinkTraceFromRun {
  option (scalapb.message).extends = "com.databricks.rpc.RPC[$this.Response]";

  // The location ID (experiment_id or catalog.schema) where the traces are stored.
  optional string location_id = 1 [(validate_required) = true];

  // IDs of the traces to unlink from the run.
  // The maximum number of trace IDs that can be unlinked in a single request is 100.
  repeated string trace_ids = 2;

  // ID of the run to unlink the traces from.
  optional string run_id = 3 [(validate_required) = true];

  message Response {
    // Empty response
  }
}
```

--------------------------------------------------------------------------------

````
