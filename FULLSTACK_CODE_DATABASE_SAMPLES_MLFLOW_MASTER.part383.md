---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 383
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 383 of 991)

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

---[FILE: webhooks_pb2.pyi]---
Location: mlflow-master/mlflow/protos/webhooks_pb2.pyi

```text
import databricks_pb2 as _databricks_pb2
from scalapb import scalapb_pb2 as _scalapb_pb2
from google.protobuf.internal import containers as _containers
from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import service as _service
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Mapping as _Mapping, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class WebhookStatus(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    ACTIVE: _ClassVar[WebhookStatus]
    DISABLED: _ClassVar[WebhookStatus]

class WebhookEntity(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    ENTITY_UNSPECIFIED: _ClassVar[WebhookEntity]
    REGISTERED_MODEL: _ClassVar[WebhookEntity]
    MODEL_VERSION: _ClassVar[WebhookEntity]
    MODEL_VERSION_TAG: _ClassVar[WebhookEntity]
    MODEL_VERSION_ALIAS: _ClassVar[WebhookEntity]
    PROMPT: _ClassVar[WebhookEntity]
    PROMPT_VERSION: _ClassVar[WebhookEntity]
    PROMPT_TAG: _ClassVar[WebhookEntity]
    PROMPT_VERSION_TAG: _ClassVar[WebhookEntity]
    PROMPT_ALIAS: _ClassVar[WebhookEntity]

class WebhookAction(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    ACTION_UNSPECIFIED: _ClassVar[WebhookAction]
    CREATED: _ClassVar[WebhookAction]
    UPDATED: _ClassVar[WebhookAction]
    DELETED: _ClassVar[WebhookAction]
    SET: _ClassVar[WebhookAction]
ACTIVE: WebhookStatus
DISABLED: WebhookStatus
ENTITY_UNSPECIFIED: WebhookEntity
REGISTERED_MODEL: WebhookEntity
MODEL_VERSION: WebhookEntity
MODEL_VERSION_TAG: WebhookEntity
MODEL_VERSION_ALIAS: WebhookEntity
PROMPT: WebhookEntity
PROMPT_VERSION: WebhookEntity
PROMPT_TAG: WebhookEntity
PROMPT_VERSION_TAG: WebhookEntity
PROMPT_ALIAS: WebhookEntity
ACTION_UNSPECIFIED: WebhookAction
CREATED: WebhookAction
UPDATED: WebhookAction
DELETED: WebhookAction
SET: WebhookAction

class WebhookEvent(_message.Message):
    __slots__ = ("entity", "action")
    ENTITY_FIELD_NUMBER: _ClassVar[int]
    ACTION_FIELD_NUMBER: _ClassVar[int]
    entity: WebhookEntity
    action: WebhookAction
    def __init__(self, entity: _Optional[_Union[WebhookEntity, str]] = ..., action: _Optional[_Union[WebhookAction, str]] = ...) -> None: ...

class Webhook(_message.Message):
    __slots__ = ("webhook_id", "name", "description", "url", "events", "status", "creation_timestamp", "last_updated_timestamp")
    WEBHOOK_ID_FIELD_NUMBER: _ClassVar[int]
    NAME_FIELD_NUMBER: _ClassVar[int]
    DESCRIPTION_FIELD_NUMBER: _ClassVar[int]
    URL_FIELD_NUMBER: _ClassVar[int]
    EVENTS_FIELD_NUMBER: _ClassVar[int]
    STATUS_FIELD_NUMBER: _ClassVar[int]
    CREATION_TIMESTAMP_FIELD_NUMBER: _ClassVar[int]
    LAST_UPDATED_TIMESTAMP_FIELD_NUMBER: _ClassVar[int]
    webhook_id: str
    name: str
    description: str
    url: str
    events: _containers.RepeatedCompositeFieldContainer[WebhookEvent]
    status: WebhookStatus
    creation_timestamp: int
    last_updated_timestamp: int
    def __init__(self, webhook_id: _Optional[str] = ..., name: _Optional[str] = ..., description: _Optional[str] = ..., url: _Optional[str] = ..., events: _Optional[_Iterable[_Union[WebhookEvent, _Mapping]]] = ..., status: _Optional[_Union[WebhookStatus, str]] = ..., creation_timestamp: _Optional[int] = ..., last_updated_timestamp: _Optional[int] = ...) -> None: ...

class WebhookTestResult(_message.Message):
    __slots__ = ("success", "response_status", "response_body", "error_message")
    SUCCESS_FIELD_NUMBER: _ClassVar[int]
    RESPONSE_STATUS_FIELD_NUMBER: _ClassVar[int]
    RESPONSE_BODY_FIELD_NUMBER: _ClassVar[int]
    ERROR_MESSAGE_FIELD_NUMBER: _ClassVar[int]
    success: bool
    response_status: int
    response_body: str
    error_message: str
    def __init__(self, success: bool = ..., response_status: _Optional[int] = ..., response_body: _Optional[str] = ..., error_message: _Optional[str] = ...) -> None: ...

class CreateWebhook(_message.Message):
    __slots__ = ("name", "description", "url", "events", "secret", "status")
    class Response(_message.Message):
        __slots__ = ("webhook",)
        WEBHOOK_FIELD_NUMBER: _ClassVar[int]
        webhook: Webhook
        def __init__(self, webhook: _Optional[_Union[Webhook, _Mapping]] = ...) -> None: ...
    NAME_FIELD_NUMBER: _ClassVar[int]
    DESCRIPTION_FIELD_NUMBER: _ClassVar[int]
    URL_FIELD_NUMBER: _ClassVar[int]
    EVENTS_FIELD_NUMBER: _ClassVar[int]
    SECRET_FIELD_NUMBER: _ClassVar[int]
    STATUS_FIELD_NUMBER: _ClassVar[int]
    name: str
    description: str
    url: str
    events: _containers.RepeatedCompositeFieldContainer[WebhookEvent]
    secret: str
    status: WebhookStatus
    def __init__(self, name: _Optional[str] = ..., description: _Optional[str] = ..., url: _Optional[str] = ..., events: _Optional[_Iterable[_Union[WebhookEvent, _Mapping]]] = ..., secret: _Optional[str] = ..., status: _Optional[_Union[WebhookStatus, str]] = ...) -> None: ...

class ListWebhooks(_message.Message):
    __slots__ = ("max_results", "page_token")
    class Response(_message.Message):
        __slots__ = ("webhooks", "next_page_token")
        WEBHOOKS_FIELD_NUMBER: _ClassVar[int]
        NEXT_PAGE_TOKEN_FIELD_NUMBER: _ClassVar[int]
        webhooks: _containers.RepeatedCompositeFieldContainer[Webhook]
        next_page_token: str
        def __init__(self, webhooks: _Optional[_Iterable[_Union[Webhook, _Mapping]]] = ..., next_page_token: _Optional[str] = ...) -> None: ...
    MAX_RESULTS_FIELD_NUMBER: _ClassVar[int]
    PAGE_TOKEN_FIELD_NUMBER: _ClassVar[int]
    max_results: int
    page_token: str
    def __init__(self, max_results: _Optional[int] = ..., page_token: _Optional[str] = ...) -> None: ...

class GetWebhook(_message.Message):
    __slots__ = ("webhook_id",)
    class Response(_message.Message):
        __slots__ = ("webhook",)
        WEBHOOK_FIELD_NUMBER: _ClassVar[int]
        webhook: Webhook
        def __init__(self, webhook: _Optional[_Union[Webhook, _Mapping]] = ...) -> None: ...
    WEBHOOK_ID_FIELD_NUMBER: _ClassVar[int]
    webhook_id: str
    def __init__(self, webhook_id: _Optional[str] = ...) -> None: ...

class UpdateWebhook(_message.Message):
    __slots__ = ("webhook_id", "name", "description", "url", "events", "secret", "status")
    class Response(_message.Message):
        __slots__ = ("webhook",)
        WEBHOOK_FIELD_NUMBER: _ClassVar[int]
        webhook: Webhook
        def __init__(self, webhook: _Optional[_Union[Webhook, _Mapping]] = ...) -> None: ...
    WEBHOOK_ID_FIELD_NUMBER: _ClassVar[int]
    NAME_FIELD_NUMBER: _ClassVar[int]
    DESCRIPTION_FIELD_NUMBER: _ClassVar[int]
    URL_FIELD_NUMBER: _ClassVar[int]
    EVENTS_FIELD_NUMBER: _ClassVar[int]
    SECRET_FIELD_NUMBER: _ClassVar[int]
    STATUS_FIELD_NUMBER: _ClassVar[int]
    webhook_id: str
    name: str
    description: str
    url: str
    events: _containers.RepeatedCompositeFieldContainer[WebhookEvent]
    secret: str
    status: WebhookStatus
    def __init__(self, webhook_id: _Optional[str] = ..., name: _Optional[str] = ..., description: _Optional[str] = ..., url: _Optional[str] = ..., events: _Optional[_Iterable[_Union[WebhookEvent, _Mapping]]] = ..., secret: _Optional[str] = ..., status: _Optional[_Union[WebhookStatus, str]] = ...) -> None: ...

class DeleteWebhook(_message.Message):
    __slots__ = ("webhook_id",)
    class Response(_message.Message):
        __slots__ = ()
        def __init__(self) -> None: ...
    WEBHOOK_ID_FIELD_NUMBER: _ClassVar[int]
    webhook_id: str
    def __init__(self, webhook_id: _Optional[str] = ...) -> None: ...

class TestWebhook(_message.Message):
    __slots__ = ("webhook_id", "event")
    class Response(_message.Message):
        __slots__ = ("result",)
        RESULT_FIELD_NUMBER: _ClassVar[int]
        result: WebhookTestResult
        def __init__(self, result: _Optional[_Union[WebhookTestResult, _Mapping]] = ...) -> None: ...
    WEBHOOK_ID_FIELD_NUMBER: _ClassVar[int]
    EVENT_FIELD_NUMBER: _ClassVar[int]
    webhook_id: str
    event: WebhookEvent
    def __init__(self, webhook_id: _Optional[str] = ..., event: _Optional[_Union[WebhookEvent, _Mapping]] = ...) -> None: ...

class WebhookService(_service.service): ...

class WebhookService_Stub(WebhookService): ...
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/mlflow/protos/opentelemetry/README.md

```text
# OpenTelemetry Protocol Buffer Definitions

This directory contains the OpenTelemetry Protocol Buffer (protobuf) specifications.

## What's Included?

MLflow only vendors the minimal set of OpenTelemetry proto files needed:

- `proto/trace/v1/trace.proto` - Trace data model (used by MLflow tracing)
- `proto/common/v1/common.proto` - Common data types
- `proto/resource/v1/resource.proto` - Resource attributes

**Note:** This is intentionally a minimal subset. If MLflow needs additional OpenTelemetry
proto files (e.g., metrics, logs), update `update.sh` to include the additional files in
the extraction list.

## Updating

To update the OpenTelemetry proto files to a new version:

1. Edit `update.sh` and update the `COMMIT_SHA` variable
2. Run the script:

   ```sh
   ./mlflow/protos/opentelemetry/update.sh
   ```
```

--------------------------------------------------------------------------------

---[FILE: update.sh]---
Location: mlflow-master/mlflow/protos/opentelemetry/update.sh

```bash
#!/usr/bin/env bash
#
# Script to update OpenTelemetry proto files in the MLflow repository.
#
# Usage:
#   ./mlflow/protos/opentelemetry/update.sh
#

set -eo pipefail

# Commit SHA from opentelemetry-proto repository
# v1.7.0: https://github.com/open-telemetry/opentelemetry-proto/commit/8654ab7a5a43ca25fe8046e59dcd6935c3f76de0
COMMIT_SHA="8654ab7a5a43ca25fe8046e59dcd6935c3f76de0"
ARCHIVE_URL="https://github.com/open-telemetry/opentelemetry-proto/archive/${COMMIT_SHA}.tar.gz"

# Navigate to the directory containing this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

# Remove existing proto directory
rm -rf proto

echo "Fetching and extracting .proto files from: $ARCHIVE_URL"

# Download and extract to temp directory (works on both macOS BSD tar and GNU tar)
TEMP_DIR=$(mktemp -d)
trap "rm -rf ${TEMP_DIR}" EXIT

curl -fsSL "$ARCHIVE_URL" | tar -xzf - -C "$TEMP_DIR"

# Copy only the proto files we need
EXTRACTED_DIR="${TEMP_DIR}/opentelemetry-proto-${COMMIT_SHA}"
mkdir -p proto/trace/v1 proto/common/v1 proto/resource/v1
cp "${EXTRACTED_DIR}/opentelemetry/proto/trace/v1/trace.proto" proto/trace/v1/
cp "${EXTRACTED_DIR}/opentelemetry/proto/common/v1/common.proto" proto/common/v1/
cp "${EXTRACTED_DIR}/opentelemetry/proto/resource/v1/resource.proto" proto/resource/v1/

echo "Extraction complete."
```

--------------------------------------------------------------------------------

---[FILE: common.proto]---
Location: mlflow-master/mlflow/protos/opentelemetry/proto/common/v1/common.proto

```proto
// Copyright 2019, OpenTelemetry Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

syntax = "proto3";

package opentelemetry.proto.common.v1;

option csharp_namespace = "OpenTelemetry.Proto.Common.V1";
option java_multiple_files = true;
option java_package = "io.opentelemetry.proto.common.v1";
option java_outer_classname = "CommonProto";
option go_package = "go.opentelemetry.io/proto/otlp/common/v1";

// AnyValue is used to represent any type of attribute value. AnyValue may contain a
// primitive value such as a string or integer or it may contain an arbitrary nested
// object containing arrays, key-value lists and primitives.
message AnyValue {
  // The value is one of the listed fields. It is valid for all values to be unspecified
  // in which case this AnyValue is considered to be "empty".
  oneof value {
    string string_value = 1;
    bool bool_value = 2;
    int64 int_value = 3;
    double double_value = 4;
    ArrayValue array_value = 5;
    KeyValueList kvlist_value = 6;
    bytes bytes_value = 7;
  }
}

// ArrayValue is a list of AnyValue messages. We need ArrayValue as a message
// since oneof in AnyValue does not allow repeated fields.
message ArrayValue {
  // Array of values. The array may be empty (contain 0 elements).
  repeated AnyValue values = 1;
}

// KeyValueList is a list of KeyValue messages. We need KeyValueList as a message
// since `oneof` in AnyValue does not allow repeated fields. Everywhere else where we need
// a list of KeyValue messages (e.g. in Span) we use `repeated KeyValue` directly to
// avoid unnecessary extra wrapping (which slows down the protocol). The 2 approaches
// are semantically equivalent.
message KeyValueList {
  // A collection of key/value pairs of key-value pairs. The list may be empty (may
  // contain 0 elements).
  // The keys MUST be unique (it is not allowed to have more than one
  // value with the same key).
  repeated KeyValue values = 1;
}

// KeyValue is a key-value pair that is used to store Span attributes, Link
// attributes, etc.
message KeyValue {
  string key = 1;
  AnyValue value = 2;
}

// InstrumentationScope is a message representing the instrumentation scope information
// such as the fully qualified name and version. 
message InstrumentationScope {
  // An empty instrumentation scope name means the name is unknown.
  string name = 1;
  string version = 2;

  // Additional attributes that describe the scope. [Optional].
  // Attribute keys MUST be unique (it is not allowed to have more than one
  // attribute with the same key).
  repeated KeyValue attributes = 3;
  uint32 dropped_attributes_count = 4;
}

// A reference to an Entity.
// Entity represents an object of interest associated with produced telemetry: e.g spans, metrics, profiles, or logs.
//
// Status: [Development]
message EntityRef {
  // The Schema URL, if known. This is the identifier of the Schema that the entity data
  // is recorded in. To learn more about Schema URL see
  // https://opentelemetry.io/docs/specs/otel/schemas/#schema-url
  //
  // This schema_url applies to the data in this message and to the Resource attributes
  // referenced by id_keys and description_keys.
  // TODO: discuss if we are happy with this somewhat complicated definition of what
  // the schema_url applies to.
  //
  // This field obsoletes the schema_url field in ResourceMetrics/ResourceSpans/ResourceLogs.
  string schema_url = 1;

  // Defines the type of the entity. MUST not change during the lifetime of the entity.
  // For example: "service" or "host". This field is required and MUST not be empty
  // for valid entities.
  string type = 2;

  // Attribute Keys that identify the entity.
  // MUST not change during the lifetime of the entity. The Id must contain at least one attribute.
  // These keys MUST exist in the containing {message}.attributes.
  repeated string id_keys = 3;

  // Descriptive (non-identifying) attribute keys of the entity.
  // MAY change over the lifetime of the entity. MAY be empty.
  // These attribute keys are not part of entity's identity.
  // These keys MUST exist in the containing {message}.attributes.
  repeated string description_keys = 4;
}
```

--------------------------------------------------------------------------------

---[FILE: resource.proto]---
Location: mlflow-master/mlflow/protos/opentelemetry/proto/resource/v1/resource.proto

```proto
// Copyright 2019, OpenTelemetry Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

syntax = "proto3";

package opentelemetry.proto.resource.v1;

import "opentelemetry/proto/common/v1/common.proto";

option csharp_namespace = "OpenTelemetry.Proto.Resource.V1";
option java_multiple_files = true;
option java_package = "io.opentelemetry.proto.resource.v1";
option java_outer_classname = "ResourceProto";
option go_package = "go.opentelemetry.io/proto/otlp/resource/v1";

// Resource information.
message Resource {
  // Set of attributes that describe the resource.
  // Attribute keys MUST be unique (it is not allowed to have more than one
  // attribute with the same key).
  repeated opentelemetry.proto.common.v1.KeyValue attributes = 1;

  // dropped_attributes_count is the number of dropped attributes. If the value is 0, then
  // no attributes were dropped.
  uint32 dropped_attributes_count = 2;

  // Set of entities that participate in this Resource.
  //
  // Note: keys in the references MUST exist in attributes of this message.
  //
  // Status: [Development]
  repeated opentelemetry.proto.common.v1.EntityRef entity_refs = 3;
}
```

--------------------------------------------------------------------------------

---[FILE: trace.proto]---
Location: mlflow-master/mlflow/protos/opentelemetry/proto/trace/v1/trace.proto

```proto
// Copyright 2019, OpenTelemetry Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

syntax = "proto3";

package opentelemetry.proto.trace.v1;

import "opentelemetry/proto/common/v1/common.proto";
import "opentelemetry/proto/resource/v1/resource.proto";

option csharp_namespace = "OpenTelemetry.Proto.Trace.V1";
option java_multiple_files = true;
option java_package = "io.opentelemetry.proto.trace.v1";
option java_outer_classname = "TraceProto";
option go_package = "go.opentelemetry.io/proto/otlp/trace/v1";

// TracesData represents the traces data that can be stored in a persistent storage,
// OR can be embedded by other protocols that transfer OTLP traces data but do
// not implement the OTLP protocol.
//
// The main difference between this message and collector protocol is that
// in this message there will not be any "control" or "metadata" specific to
// OTLP protocol.
//
// When new fields are added into this message, the OTLP request MUST be updated
// as well.
message TracesData {
  // An array of ResourceSpans.
  // For data coming from a single resource this array will typically contain
  // one element. Intermediary nodes that receive data from multiple origins
  // typically batch the data before forwarding further and in that case this
  // array will contain multiple elements.
  repeated ResourceSpans resource_spans = 1;
}

// A collection of ScopeSpans from a Resource.
message ResourceSpans {
  reserved 1000;

  // The resource for the spans in this message.
  // If this field is not set then no resource info is known.
  opentelemetry.proto.resource.v1.Resource resource = 1;

  // A list of ScopeSpans that originate from a resource.
  repeated ScopeSpans scope_spans = 2;

  // The Schema URL, if known. This is the identifier of the Schema that the resource data
  // is recorded in. Notably, the last part of the URL path is the version number of the
  // schema: http[s]://server[:port]/path/<version>. To learn more about Schema URL see
  // https://opentelemetry.io/docs/specs/otel/schemas/#schema-url
  // This schema_url applies to the data in the "resource" field. It does not apply
  // to the data in the "scope_spans" field which have their own schema_url field.
  string schema_url = 3;
}

// A collection of Spans produced by an InstrumentationScope.
message ScopeSpans {
  // The instrumentation scope information for the spans in this message.
  // Semantically when InstrumentationScope isn't set, it is equivalent with
  // an empty instrumentation scope name (unknown).
  opentelemetry.proto.common.v1.InstrumentationScope scope = 1;

  // A list of Spans that originate from an instrumentation scope.
  repeated Span spans = 2;

  // The Schema URL, if known. This is the identifier of the Schema that the span data
  // is recorded in. Notably, the last part of the URL path is the version number of the
  // schema: http[s]://server[:port]/path/<version>. To learn more about Schema URL see
  // https://opentelemetry.io/docs/specs/otel/schemas/#schema-url
  // This schema_url applies to all spans and span events in the "spans" field.
  string schema_url = 3;
}

// A Span represents a single operation performed by a single component of the system.
//
// The next available field id is 17.
message Span {
  // A unique identifier for a trace. All spans from the same trace share
  // the same `trace_id`. The ID is a 16-byte array. An ID with all zeroes OR
  // of length other than 16 bytes is considered invalid (empty string in OTLP/JSON
  // is zero-length and thus is also invalid).
  //
  // This field is required.
  bytes trace_id = 1;

  // A unique identifier for a span within a trace, assigned when the span
  // is created. The ID is an 8-byte array. An ID with all zeroes OR of length
  // other than 8 bytes is considered invalid (empty string in OTLP/JSON
  // is zero-length and thus is also invalid).
  //
  // This field is required.
  bytes span_id = 2;

  // trace_state conveys information about request position in multiple distributed tracing graphs.
  // It is a trace_state in w3c-trace-context format: https://www.w3.org/TR/trace-context/#tracestate-header
  // See also https://github.com/w3c/distributed-tracing for more details about this field.
  string trace_state = 3;

  // The `span_id` of this span's parent span. If this is a root span, then this
  // field must be empty. The ID is an 8-byte array.
  bytes parent_span_id = 4;

  // Flags, a bit field.
  //
  // Bits 0-7 (8 least significant bits) are the trace flags as defined in W3C Trace
  // Context specification. To read the 8-bit W3C trace flag, use
  // `flags & SPAN_FLAGS_TRACE_FLAGS_MASK`.
  //
  // See https://www.w3.org/TR/trace-context-2/#trace-flags for the flag definitions.
  //
  // Bits 8 and 9 represent the 3 states of whether a span's parent
  // is remote. The states are (unknown, is not remote, is remote).
  // To read whether the value is known, use `(flags & SPAN_FLAGS_CONTEXT_HAS_IS_REMOTE_MASK) != 0`.
  // To read whether the span is remote, use `(flags & SPAN_FLAGS_CONTEXT_IS_REMOTE_MASK) != 0`.
  //
  // When creating span messages, if the message is logically forwarded from another source
  // with an equivalent flags fields (i.e., usually another OTLP span message), the field SHOULD
  // be copied as-is. If creating from a source that does not have an equivalent flags field
  // (such as a runtime representation of an OpenTelemetry span), the high 22 bits MUST
  // be set to zero.
  // Readers MUST NOT assume that bits 10-31 (22 most significant bits) will be zero.
  //
  // [Optional].
  fixed32 flags = 16;

  // A description of the span's operation.
  //
  // For example, the name can be a qualified method name or a file name
  // and a line number where the operation is called. A best practice is to use
  // the same display name at the same call point in an application.
  // This makes it easier to correlate spans in different traces.
  //
  // This field is semantically required to be set to non-empty string.
  // Empty value is equivalent to an unknown span name.
  //
  // This field is required.
  string name = 5;

  // SpanKind is the type of span. Can be used to specify additional relationships between spans
  // in addition to a parent/child relationship.
  enum SpanKind {
    // Unspecified. Do NOT use as default.
    // Implementations MAY assume SpanKind to be INTERNAL when receiving UNSPECIFIED.
    SPAN_KIND_UNSPECIFIED = 0;

    // Indicates that the span represents an internal operation within an application,
    // as opposed to an operation happening at the boundaries. Default value.
    SPAN_KIND_INTERNAL = 1;

    // Indicates that the span covers server-side handling of an RPC or other
    // remote network request.
    SPAN_KIND_SERVER = 2;

    // Indicates that the span describes a request to some remote service.
    SPAN_KIND_CLIENT = 3;

    // Indicates that the span describes a producer sending a message to a broker.
    // Unlike CLIENT and SERVER, there is often no direct critical path latency relationship
    // between producer and consumer spans. A PRODUCER span ends when the message was accepted
    // by the broker while the logical processing of the message might span a much longer time.
    SPAN_KIND_PRODUCER = 4;

    // Indicates that the span describes consumer receiving a message from a broker.
    // Like the PRODUCER kind, there is often no direct critical path latency relationship
    // between producer and consumer spans.
    SPAN_KIND_CONSUMER = 5;
  }

  // Distinguishes between spans generated in a particular context. For example,
  // two spans with the same name may be distinguished using `CLIENT` (caller)
  // and `SERVER` (callee) to identify queueing latency associated with the span.
  SpanKind kind = 6;

  // start_time_unix_nano is the start time of the span. On the client side, this is the time
  // kept by the local machine where the span execution starts. On the server side, this
  // is the time when the server's application handler starts running.
  // Value is UNIX Epoch time in nanoseconds since 00:00:00 UTC on 1 January 1970.
  //
  // This field is semantically required and it is expected that end_time >= start_time.
  fixed64 start_time_unix_nano = 7;

  // end_time_unix_nano is the end time of the span. On the client side, this is the time
  // kept by the local machine where the span execution ends. On the server side, this
  // is the time when the server application handler stops running.
  // Value is UNIX Epoch time in nanoseconds since 00:00:00 UTC on 1 January 1970.
  //
  // This field is semantically required and it is expected that end_time >= start_time.
  fixed64 end_time_unix_nano = 8;

  // attributes is a collection of key/value pairs. Note, global attributes
  // like server name can be set using the resource API. Examples of attributes:
  //
  //     "/http/user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36"
  //     "/http/server_latency": 300
  //     "example.com/myattribute": true
  //     "example.com/score": 10.239
  //
  // The OpenTelemetry API specification further restricts the allowed value types:
  // https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/common/README.md#attribute
  // Attribute keys MUST be unique (it is not allowed to have more than one
  // attribute with the same key).
  repeated opentelemetry.proto.common.v1.KeyValue attributes = 9;

  // dropped_attributes_count is the number of attributes that were discarded. Attributes
  // can be discarded because their keys are too long or because there are too many
  // attributes. If this value is 0, then no attributes were dropped.
  uint32 dropped_attributes_count = 10;

  // Event is a time-stamped annotation of the span, consisting of user-supplied
  // text description and key-value pairs.
  message Event {
    // time_unix_nano is the time the event occurred.
    fixed64 time_unix_nano = 1;

    // name of the event.
    // This field is semantically required to be set to non-empty string.
    string name = 2;

    // attributes is a collection of attribute key/value pairs on the event.
    // Attribute keys MUST be unique (it is not allowed to have more than one
    // attribute with the same key).
    repeated opentelemetry.proto.common.v1.KeyValue attributes = 3;

    // dropped_attributes_count is the number of dropped attributes. If the value is 0,
    // then no attributes were dropped.
    uint32 dropped_attributes_count = 4;
  }

  // events is a collection of Event items.
  repeated Event events = 11;

  // dropped_events_count is the number of dropped events. If the value is 0, then no
  // events were dropped.
  uint32 dropped_events_count = 12;

  // A pointer from the current span to another span in the same trace or in a
  // different trace. For example, this can be used in batching operations,
  // where a single batch handler processes multiple requests from different
  // traces or when the handler receives a request from a different project.
  message Link {
    // A unique identifier of a trace that this linked span is part of. The ID is a
    // 16-byte array.
    bytes trace_id = 1;

    // A unique identifier for the linked span. The ID is an 8-byte array.
    bytes span_id = 2;

    // The trace_state associated with the link.
    string trace_state = 3;

    // attributes is a collection of attribute key/value pairs on the link.
    // Attribute keys MUST be unique (it is not allowed to have more than one
    // attribute with the same key).
    repeated opentelemetry.proto.common.v1.KeyValue attributes = 4;

    // dropped_attributes_count is the number of dropped attributes. If the value is 0,
    // then no attributes were dropped.
    uint32 dropped_attributes_count = 5;

    // Flags, a bit field.
    //
    // Bits 0-7 (8 least significant bits) are the trace flags as defined in W3C Trace
    // Context specification. To read the 8-bit W3C trace flag, use
    // `flags & SPAN_FLAGS_TRACE_FLAGS_MASK`.
    //
    // See https://www.w3.org/TR/trace-context-2/#trace-flags for the flag definitions.
    //
    // Bits 8 and 9 represent the 3 states of whether the link is remote.
    // The states are (unknown, is not remote, is remote).
    // To read whether the value is known, use `(flags & SPAN_FLAGS_CONTEXT_HAS_IS_REMOTE_MASK) != 0`.
    // To read whether the link is remote, use `(flags & SPAN_FLAGS_CONTEXT_IS_REMOTE_MASK) != 0`.
    //
    // Readers MUST NOT assume that bits 10-31 (22 most significant bits) will be zero.
    // When creating new spans, bits 10-31 (most-significant 22-bits) MUST be zero.
    //
    // [Optional].
    fixed32 flags = 6;
  }

  // links is a collection of Links, which are references from this span to a span
  // in the same or different trace.
  repeated Link links = 13;

  // dropped_links_count is the number of dropped links after the maximum size was
  // enforced. If this value is 0, then no links were dropped.
  uint32 dropped_links_count = 14;

  // An optional final status for this span. Semantically when Status isn't set, it means
  // span's status code is unset, i.e. assume STATUS_CODE_UNSET (code = 0).
  Status status = 15;
}

// The Status type defines a logical error model that is suitable for different
// programming environments, including REST APIs and RPC APIs.
message Status {
  reserved 1;

  // A developer-facing human readable error message.
  string message = 2;

  // For the semantics of status codes see
  // https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/api.md#set-status
  enum StatusCode {
    // The default status.
    STATUS_CODE_UNSET               = 0;
    // The Span has been validated by an Application developer or Operator to 
    // have completed successfully.
    STATUS_CODE_OK                  = 1;
    // The Span contains an error.
    STATUS_CODE_ERROR               = 2;
  };

  // The status code.
  StatusCode code = 3;
}

// SpanFlags represents constants used to interpret the
// Span.flags field, which is protobuf 'fixed32' type and is to
// be used as bit-fields. Each non-zero value defined in this enum is
// a bit-mask.  To extract the bit-field, for example, use an
// expression like:
//
//   (span.flags & SPAN_FLAGS_TRACE_FLAGS_MASK)
//
// See https://www.w3.org/TR/trace-context-2/#trace-flags for the flag definitions.
//
// Note that Span flags were introduced in version 1.1 of the
// OpenTelemetry protocol.  Older Span producers do not set this
// field, consequently consumers should not rely on the absence of a
// particular flag bit to indicate the presence of a particular feature.
enum SpanFlags {
  // The zero value for the enum. Should not be used for comparisons.
  // Instead use bitwise "and" with the appropriate mask as shown above.
  SPAN_FLAGS_DO_NOT_USE = 0;

  // Bits 0-7 are used for trace flags.
  SPAN_FLAGS_TRACE_FLAGS_MASK = 0x000000FF;

  // Bits 8 and 9 are used to indicate that the parent span or link span is remote.
  // Bit 8 (`HAS_IS_REMOTE`) indicates whether the value is known.
  // Bit 9 (`IS_REMOTE`) indicates whether the span or link is remote.
  SPAN_FLAGS_CONTEXT_HAS_IS_REMOTE_MASK = 0x00000100;
  SPAN_FLAGS_CONTEXT_IS_REMOTE_MASK = 0x00000200;

  // Bits 10-31 are reserved for future use.
}
```

--------------------------------------------------------------------------------

---[FILE: scalapb.proto]---
Location: mlflow-master/mlflow/protos/scalapb/scalapb.proto

```proto
syntax = "proto2";

package scalapb;

import "google/protobuf/descriptor.proto";

option java_package = "org.mlflow.scalapb_interface";

message ScalaPbOptions {
  // If set then it overrides the java_package and package.
  optional string package_name = 1;

  // If true, the compiler does not append the proto base file name
  // into the generated package name. If false (the default), the
  // generated scala package name is the package_name.basename where
  // basename is the proto file name without the .proto extension.
  optional bool flat_package = 2;

  // Adds the following imports at the top of the file (this is meant
  // to provide implicit TypeMappers)
  repeated string import = 3;
}

extend google.protobuf.FileOptions {
  // File-level optionals for ScalaPB.
  // Extension number officially assigned by protobuf-global-extension-registry@google.com
  optional ScalaPbOptions options = 1020;
}

message MessageOptions {
  // additional classes and traits to mix in to the case class.
  repeated string extends = 1;
}

extend google.protobuf.MessageOptions {
  // Message-level optionals for ScalaPB.
  // Extension number officially assigned by protobuf-global-extension-registry@google.com
  optional MessageOptions message = 1020;
}

message FieldOptions {
  optional string type = 1;
}

extend google.protobuf.FieldOptions {
  // File-level optionals for ScalaPB.
  // Extension number officially assigned by protobuf-global-extension-registry@google.com
  optional FieldOptions field = 1020;
}
```

--------------------------------------------------------------------------------

````
