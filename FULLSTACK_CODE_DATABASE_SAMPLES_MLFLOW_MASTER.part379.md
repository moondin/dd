---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 379
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 379 of 991)

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

---[FILE: unity_catalog_prompt_messages_pb2.pyi]---
Location: mlflow-master/mlflow/protos/unity_catalog_prompt_messages_pb2.pyi

```text
import databricks_pb2 as _databricks_pb2
from google.protobuf import timestamp_pb2 as _timestamp_pb2
from scalapb import scalapb_pb2 as _scalapb_pb2
from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Mapping as _Mapping, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class Prompt(_message.Message):
    __slots__ = ("name", "creation_timestamp", "last_updated_timestamp", "description", "aliases", "tags")
    NAME_FIELD_NUMBER: _ClassVar[int]
    CREATION_TIMESTAMP_FIELD_NUMBER: _ClassVar[int]
    LAST_UPDATED_TIMESTAMP_FIELD_NUMBER: _ClassVar[int]
    DESCRIPTION_FIELD_NUMBER: _ClassVar[int]
    ALIASES_FIELD_NUMBER: _ClassVar[int]
    TAGS_FIELD_NUMBER: _ClassVar[int]
    name: str
    creation_timestamp: _timestamp_pb2.Timestamp
    last_updated_timestamp: _timestamp_pb2.Timestamp
    description: str
    aliases: _containers.RepeatedCompositeFieldContainer[PromptAlias]
    tags: _containers.RepeatedCompositeFieldContainer[PromptTag]
    def __init__(self, name: _Optional[str] = ..., creation_timestamp: _Optional[_Union[_timestamp_pb2.Timestamp, _Mapping]] = ..., last_updated_timestamp: _Optional[_Union[_timestamp_pb2.Timestamp, _Mapping]] = ..., description: _Optional[str] = ..., aliases: _Optional[_Iterable[_Union[PromptAlias, _Mapping]]] = ..., tags: _Optional[_Iterable[_Union[PromptTag, _Mapping]]] = ...) -> None: ...

class PromptVersion(_message.Message):
    __slots__ = ("name", "version", "creation_timestamp", "last_updated_timestamp", "description", "template", "aliases", "tags")
    NAME_FIELD_NUMBER: _ClassVar[int]
    VERSION_FIELD_NUMBER: _ClassVar[int]
    CREATION_TIMESTAMP_FIELD_NUMBER: _ClassVar[int]
    LAST_UPDATED_TIMESTAMP_FIELD_NUMBER: _ClassVar[int]
    DESCRIPTION_FIELD_NUMBER: _ClassVar[int]
    TEMPLATE_FIELD_NUMBER: _ClassVar[int]
    ALIASES_FIELD_NUMBER: _ClassVar[int]
    TAGS_FIELD_NUMBER: _ClassVar[int]
    name: str
    version: str
    creation_timestamp: _timestamp_pb2.Timestamp
    last_updated_timestamp: _timestamp_pb2.Timestamp
    description: str
    template: str
    aliases: _containers.RepeatedCompositeFieldContainer[PromptAlias]
    tags: _containers.RepeatedCompositeFieldContainer[PromptVersionTag]
    def __init__(self, name: _Optional[str] = ..., version: _Optional[str] = ..., creation_timestamp: _Optional[_Union[_timestamp_pb2.Timestamp, _Mapping]] = ..., last_updated_timestamp: _Optional[_Union[_timestamp_pb2.Timestamp, _Mapping]] = ..., description: _Optional[str] = ..., template: _Optional[str] = ..., aliases: _Optional[_Iterable[_Union[PromptAlias, _Mapping]]] = ..., tags: _Optional[_Iterable[_Union[PromptVersionTag, _Mapping]]] = ...) -> None: ...

class PromptTag(_message.Message):
    __slots__ = ("key", "value")
    KEY_FIELD_NUMBER: _ClassVar[int]
    VALUE_FIELD_NUMBER: _ClassVar[int]
    key: str
    value: str
    def __init__(self, key: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...

class PromptVersionTag(_message.Message):
    __slots__ = ("key", "value")
    KEY_FIELD_NUMBER: _ClassVar[int]
    VALUE_FIELD_NUMBER: _ClassVar[int]
    key: str
    value: str
    def __init__(self, key: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...

class PromptAlias(_message.Message):
    __slots__ = ("alias", "version")
    ALIAS_FIELD_NUMBER: _ClassVar[int]
    VERSION_FIELD_NUMBER: _ClassVar[int]
    alias: str
    version: str
    def __init__(self, alias: _Optional[str] = ..., version: _Optional[str] = ...) -> None: ...

class UnityCatalogSchema(_message.Message):
    __slots__ = ("catalog_name", "schema_name")
    CATALOG_NAME_FIELD_NUMBER: _ClassVar[int]
    SCHEMA_NAME_FIELD_NUMBER: _ClassVar[int]
    catalog_name: str
    schema_name: str
    def __init__(self, catalog_name: _Optional[str] = ..., schema_name: _Optional[str] = ...) -> None: ...

class CreatePromptRequest(_message.Message):
    __slots__ = ("name", "prompt")
    NAME_FIELD_NUMBER: _ClassVar[int]
    PROMPT_FIELD_NUMBER: _ClassVar[int]
    name: str
    prompt: Prompt
    def __init__(self, name: _Optional[str] = ..., prompt: _Optional[_Union[Prompt, _Mapping]] = ...) -> None: ...

class UpdatePromptRequest(_message.Message):
    __slots__ = ("name", "prompt")
    NAME_FIELD_NUMBER: _ClassVar[int]
    PROMPT_FIELD_NUMBER: _ClassVar[int]
    name: str
    prompt: Prompt
    def __init__(self, name: _Optional[str] = ..., prompt: _Optional[_Union[Prompt, _Mapping]] = ...) -> None: ...

class DeletePromptRequest(_message.Message):
    __slots__ = ("name",)
    NAME_FIELD_NUMBER: _ClassVar[int]
    name: str
    def __init__(self, name: _Optional[str] = ...) -> None: ...

class DeletePromptResponse(_message.Message):
    __slots__ = ()
    def __init__(self) -> None: ...

class GetPromptRequest(_message.Message):
    __slots__ = ("name",)
    NAME_FIELD_NUMBER: _ClassVar[int]
    name: str
    def __init__(self, name: _Optional[str] = ...) -> None: ...

class SearchPromptsRequest(_message.Message):
    __slots__ = ("filter", "catalog_schema", "max_results", "page_token")
    FILTER_FIELD_NUMBER: _ClassVar[int]
    CATALOG_SCHEMA_FIELD_NUMBER: _ClassVar[int]
    MAX_RESULTS_FIELD_NUMBER: _ClassVar[int]
    PAGE_TOKEN_FIELD_NUMBER: _ClassVar[int]
    filter: str
    catalog_schema: UnityCatalogSchema
    max_results: int
    page_token: str
    def __init__(self, filter: _Optional[str] = ..., catalog_schema: _Optional[_Union[UnityCatalogSchema, _Mapping]] = ..., max_results: _Optional[int] = ..., page_token: _Optional[str] = ...) -> None: ...

class SearchPromptsResponse(_message.Message):
    __slots__ = ("prompts", "next_page_token")
    PROMPTS_FIELD_NUMBER: _ClassVar[int]
    NEXT_PAGE_TOKEN_FIELD_NUMBER: _ClassVar[int]
    prompts: _containers.RepeatedCompositeFieldContainer[Prompt]
    next_page_token: str
    def __init__(self, prompts: _Optional[_Iterable[_Union[Prompt, _Mapping]]] = ..., next_page_token: _Optional[str] = ...) -> None: ...

class CreatePromptVersionRequest(_message.Message):
    __slots__ = ("name", "prompt_version")
    NAME_FIELD_NUMBER: _ClassVar[int]
    PROMPT_VERSION_FIELD_NUMBER: _ClassVar[int]
    name: str
    prompt_version: PromptVersion
    def __init__(self, name: _Optional[str] = ..., prompt_version: _Optional[_Union[PromptVersion, _Mapping]] = ...) -> None: ...

class UpdatePromptVersionRequest(_message.Message):
    __slots__ = ("name", "version", "prompt_version")
    NAME_FIELD_NUMBER: _ClassVar[int]
    VERSION_FIELD_NUMBER: _ClassVar[int]
    PROMPT_VERSION_FIELD_NUMBER: _ClassVar[int]
    name: str
    version: str
    prompt_version: PromptVersion
    def __init__(self, name: _Optional[str] = ..., version: _Optional[str] = ..., prompt_version: _Optional[_Union[PromptVersion, _Mapping]] = ...) -> None: ...

class DeletePromptVersionRequest(_message.Message):
    __slots__ = ("name", "version")
    NAME_FIELD_NUMBER: _ClassVar[int]
    VERSION_FIELD_NUMBER: _ClassVar[int]
    name: str
    version: str
    def __init__(self, name: _Optional[str] = ..., version: _Optional[str] = ...) -> None: ...

class GetPromptVersionRequest(_message.Message):
    __slots__ = ("name", "version")
    NAME_FIELD_NUMBER: _ClassVar[int]
    VERSION_FIELD_NUMBER: _ClassVar[int]
    name: str
    version: str
    def __init__(self, name: _Optional[str] = ..., version: _Optional[str] = ...) -> None: ...

class SearchPromptVersionsRequest(_message.Message):
    __slots__ = ("name", "max_results", "page_token")
    NAME_FIELD_NUMBER: _ClassVar[int]
    MAX_RESULTS_FIELD_NUMBER: _ClassVar[int]
    PAGE_TOKEN_FIELD_NUMBER: _ClassVar[int]
    name: str
    max_results: int
    page_token: str
    def __init__(self, name: _Optional[str] = ..., max_results: _Optional[int] = ..., page_token: _Optional[str] = ...) -> None: ...

class SearchPromptVersionsResponse(_message.Message):
    __slots__ = ("prompt_versions", "next_page_token")
    PROMPT_VERSIONS_FIELD_NUMBER: _ClassVar[int]
    NEXT_PAGE_TOKEN_FIELD_NUMBER: _ClassVar[int]
    prompt_versions: _containers.RepeatedCompositeFieldContainer[PromptVersion]
    next_page_token: str
    def __init__(self, prompt_versions: _Optional[_Iterable[_Union[PromptVersion, _Mapping]]] = ..., next_page_token: _Optional[str] = ...) -> None: ...

class SetPromptAliasRequest(_message.Message):
    __slots__ = ("name", "alias", "version")
    NAME_FIELD_NUMBER: _ClassVar[int]
    ALIAS_FIELD_NUMBER: _ClassVar[int]
    VERSION_FIELD_NUMBER: _ClassVar[int]
    name: str
    alias: str
    version: str
    def __init__(self, name: _Optional[str] = ..., alias: _Optional[str] = ..., version: _Optional[str] = ...) -> None: ...

class DeletePromptAliasRequest(_message.Message):
    __slots__ = ("name", "alias")
    NAME_FIELD_NUMBER: _ClassVar[int]
    ALIAS_FIELD_NUMBER: _ClassVar[int]
    name: str
    alias: str
    def __init__(self, name: _Optional[str] = ..., alias: _Optional[str] = ...) -> None: ...

class GetPromptVersionByAliasRequest(_message.Message):
    __slots__ = ("name", "alias")
    NAME_FIELD_NUMBER: _ClassVar[int]
    ALIAS_FIELD_NUMBER: _ClassVar[int]
    name: str
    alias: str
    def __init__(self, name: _Optional[str] = ..., alias: _Optional[str] = ...) -> None: ...

class SetPromptTagRequest(_message.Message):
    __slots__ = ("name", "key", "value")
    NAME_FIELD_NUMBER: _ClassVar[int]
    KEY_FIELD_NUMBER: _ClassVar[int]
    VALUE_FIELD_NUMBER: _ClassVar[int]
    name: str
    key: str
    value: str
    def __init__(self, name: _Optional[str] = ..., key: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...

class DeletePromptTagRequest(_message.Message):
    __slots__ = ("name", "key")
    NAME_FIELD_NUMBER: _ClassVar[int]
    KEY_FIELD_NUMBER: _ClassVar[int]
    name: str
    key: str
    def __init__(self, name: _Optional[str] = ..., key: _Optional[str] = ...) -> None: ...

class SetPromptVersionTagRequest(_message.Message):
    __slots__ = ("name", "version", "key", "value")
    NAME_FIELD_NUMBER: _ClassVar[int]
    VERSION_FIELD_NUMBER: _ClassVar[int]
    KEY_FIELD_NUMBER: _ClassVar[int]
    VALUE_FIELD_NUMBER: _ClassVar[int]
    name: str
    version: str
    key: str
    value: str
    def __init__(self, name: _Optional[str] = ..., version: _Optional[str] = ..., key: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...

class DeletePromptVersionTagRequest(_message.Message):
    __slots__ = ("name", "version", "key")
    NAME_FIELD_NUMBER: _ClassVar[int]
    VERSION_FIELD_NUMBER: _ClassVar[int]
    KEY_FIELD_NUMBER: _ClassVar[int]
    name: str
    version: str
    key: str
    def __init__(self, name: _Optional[str] = ..., version: _Optional[str] = ..., key: _Optional[str] = ...) -> None: ...

class LinkPromptVersionsToModelsRequest(_message.Message):
    __slots__ = ("prompt_versions", "model_ids")
    PROMPT_VERSIONS_FIELD_NUMBER: _ClassVar[int]
    MODEL_IDS_FIELD_NUMBER: _ClassVar[int]
    prompt_versions: _containers.RepeatedCompositeFieldContainer[PromptVersionLinkEntry]
    model_ids: _containers.RepeatedScalarFieldContainer[str]
    def __init__(self, prompt_versions: _Optional[_Iterable[_Union[PromptVersionLinkEntry, _Mapping]]] = ..., model_ids: _Optional[_Iterable[str]] = ...) -> None: ...

class LinkPromptsToTracesRequest(_message.Message):
    __slots__ = ("prompt_versions", "trace_ids")
    PROMPT_VERSIONS_FIELD_NUMBER: _ClassVar[int]
    TRACE_IDS_FIELD_NUMBER: _ClassVar[int]
    prompt_versions: _containers.RepeatedCompositeFieldContainer[PromptVersionLinkEntry]
    trace_ids: _containers.RepeatedScalarFieldContainer[str]
    def __init__(self, prompt_versions: _Optional[_Iterable[_Union[PromptVersionLinkEntry, _Mapping]]] = ..., trace_ids: _Optional[_Iterable[str]] = ...) -> None: ...

class LinkPromptVersionsToRunsRequest(_message.Message):
    __slots__ = ("prompt_versions", "run_ids")
    PROMPT_VERSIONS_FIELD_NUMBER: _ClassVar[int]
    RUN_IDS_FIELD_NUMBER: _ClassVar[int]
    prompt_versions: _containers.RepeatedCompositeFieldContainer[PromptVersionLinkEntry]
    run_ids: _containers.RepeatedScalarFieldContainer[str]
    def __init__(self, prompt_versions: _Optional[_Iterable[_Union[PromptVersionLinkEntry, _Mapping]]] = ..., run_ids: _Optional[_Iterable[str]] = ...) -> None: ...

class PromptVersionLinkEntry(_message.Message):
    __slots__ = ("name", "version")
    NAME_FIELD_NUMBER: _ClassVar[int]
    VERSION_FIELD_NUMBER: _ClassVar[int]
    name: str
    version: str
    def __init__(self, name: _Optional[str] = ..., version: _Optional[str] = ...) -> None: ...
```

--------------------------------------------------------------------------------

---[FILE: unity_catalog_prompt_messages_pb2_grpc.py]---
Location: mlflow-master/mlflow/protos/unity_catalog_prompt_messages_pb2_grpc.py

```python
# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
import grpc
import warnings


GRPC_GENERATED_VERSION = '1.71.0'
GRPC_VERSION = grpc.__version__
_version_not_supported = False

try:
    from grpc._utilities import first_version_is_lower
    _version_not_supported = first_version_is_lower(GRPC_VERSION, GRPC_GENERATED_VERSION)
except ImportError:
    _version_not_supported = True

if _version_not_supported:
    raise RuntimeError(
        f'The grpc package installed is at version {GRPC_VERSION},'
        + f' but the generated code in unity_catalog_prompt_messages_pb2_grpc.py depends on'
        + f' grpcio>={GRPC_GENERATED_VERSION}.'
        + f' Please upgrade your grpc module to grpcio>={GRPC_GENERATED_VERSION}'
        + f' or downgrade your generated code using grpcio-tools<={GRPC_VERSION}.'
    )
```

--------------------------------------------------------------------------------

---[FILE: unity_catalog_prompt_service.proto]---
Location: mlflow-master/mlflow/protos/unity_catalog_prompt_service.proto

```proto
syntax = "proto2";

package mlflow.unitycatalog;

import "databricks.proto";
import "google/protobuf/empty.proto";
import "scalapb/scalapb.proto";
import "unity_catalog_prompt_messages.proto";

option java_generate_equals_and_hash = true;
option java_package = "com.databricks.api.proto.managedcatalog";
option py_generic_services = true;
option (scalapb.options) = {flat_package: true};

service UnityCatalogPromptService {
  rpc CreatePrompt(CreatePromptRequest) returns (Prompt) {
    option (rpc) = {
      endpoints: [
        {
          method: "POST"
          path: "/mlflow/unity-catalog/prompts"
          since: {
            major: 2
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "(Unity Catalog) Create Prompt"
    };
  }

  rpc UpdatePrompt(UpdatePromptRequest) returns (Prompt) {
    option (rpc) = {
      endpoints: [
        {
          method: "PATCH"
          path: "/mlflow/unity-catalog/prompts/{name}"
          since: {
            major: 2
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "(Unity Catalog) Update Prompt"
    };
  }

  rpc DeletePrompt(DeletePromptRequest) returns (google.protobuf.Empty) {
    option (rpc) = {
      endpoints: [
        {
          method: "DELETE"
          path: "/mlflow/unity-catalog/prompts/{name}"
          since: {
            major: 2
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "(Unity Catalog) Delete Prompt"
    };
  }

  rpc GetPrompt(GetPromptRequest) returns (Prompt) {
    option (rpc) = {
      endpoints: [
        {
          method: "GET"
          path: "/mlflow/unity-catalog/prompts/{name}"
          since: {
            major: 2
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "(Unity Catalog) Get Prompt"
    };
  }

  rpc SearchPrompts(SearchPromptsRequest) returns (SearchPromptsResponse) {
    option (rpc) = {
      endpoints: [
        {
          method: "POST"
          path: "/mlflow/unity-catalog/prompts/search"
          since: {
            major: 2
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "(Unity Catalog) Search Prompts"
    };
  }

  rpc CreatePromptVersion(CreatePromptVersionRequest) returns (PromptVersion) {
    option (rpc) = {
      endpoints: [
        {
          method: "POST"
          path: "/mlflow/unity-catalog/prompts/{name}/versions"
          since: {
            major: 2
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "(Unity Catalog) Create Prompt Version"
    };
  }

  rpc UpdatePromptVersion(UpdatePromptVersionRequest) returns (PromptVersion) {
    option (rpc) = {
      endpoints: [
        {
          method: "PATCH"
          path: "/mlflow/unity-catalog/prompts/{name}/versions/{version}"
          since: {
            major: 2
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "(Unity Catalog) Update Prompt Version"
    };
  }

  rpc DeletePromptVersion(DeletePromptVersionRequest) returns (google.protobuf.Empty) {
    option (rpc) = {
      endpoints: [
        {
          method: "DELETE"
          path: "/mlflow/unity-catalog/prompts/{name}/versions/{version}"
          since: {
            major: 2
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "(Unity Catalog) Delete Prompt Version"
    };
  }

  rpc GetPromptVersion(GetPromptVersionRequest) returns (PromptVersion) {
    option (rpc) = {
      endpoints: [
        {
          method: "GET"
          path: "/mlflow/unity-catalog/prompts/{name}/versions/{version}"
          since: {
            major: 2
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "(Unity Catalog) Get Prompt Version"
    };
  }

  rpc SearchPromptVersions(SearchPromptVersionsRequest) returns (SearchPromptVersionsResponse) {
    option (rpc) = {
      endpoints: [
        {
          method: "POST"
          path: "/mlflow/unity-catalog/prompts/{name}/versions/search"
          since: {
            major: 2
            minor: 0
          }
        }
      ]
      error_codes: [
        INVALID_PARAMETER_VALUE,
        PERMISSION_DENIED,
        RESOURCE_DOES_NOT_EXIST,
        INTERNAL_ERROR
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "(Unity Catalog) Search Prompt Versions"
    };
  }

  rpc SetPromptAlias(SetPromptAliasRequest) returns (google.protobuf.Empty) {
    option (rpc) = {
      endpoints: [
        {
          method: "POST"
          path: "/mlflow/unity-catalog/prompts/{name}/aliases/{alias}"
          since: {
            major: 2
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "(Unity Catalog) Set Prompt Alias"
    };
  }

  rpc DeletePromptAlias(DeletePromptAliasRequest) returns (google.protobuf.Empty) {
    option (rpc) = {
      endpoints: [
        {
          method: "DELETE"
          path: "/mlflow/unity-catalog/prompts/{name}/aliases/{alias}"
          since: {
            major: 2
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "(Unity Catalog) Delete Prompt Alias"
    };
  }

  rpc GetPromptVersionByAlias(GetPromptVersionByAliasRequest) returns (PromptVersion) {
    option (rpc) = {
      endpoints: [
        {
          method: "GET"
          path: "/mlflow/unity-catalog/prompts/{name}/versions/by-alias/{alias}"
          since: {
            major: 2
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "(Unity Catalog) Get Prompt Version By Alias"
    };
  }

  rpc SetPromptTag(SetPromptTagRequest) returns (google.protobuf.Empty) {
    option (rpc) = {
      endpoints: [
        {
          method: "POST"
          path: "/mlflow/unity-catalog/prompts/{name}/tags"
          since: {
            major: 2
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "(Unity Catalog) Set Prompt Tag"
    };
  }

  rpc DeletePromptTag(DeletePromptTagRequest) returns (google.protobuf.Empty) {
    option (rpc) = {
      endpoints: [
        {
          method: "DELETE"
          path: "/mlflow/unity-catalog/prompts/{name}/tags/{key}"
          since: {
            major: 2
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "(Unity Catalog) Delete Prompt Tag"
    };
  }

  rpc SetPromptVersionTag(SetPromptVersionTagRequest) returns (google.protobuf.Empty) {
    option (rpc) = {
      endpoints: [
        {
          method: "POST"
          path: "/mlflow/unity-catalog/prompts/{name}/versions/{version}/tags"
          since: {
            major: 2
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "(Unity Catalog) Set Prompt Version Tag"
    };
  }

  rpc DeletePromptVersionTag(DeletePromptVersionTagRequest) returns (google.protobuf.Empty) {
    option (rpc) = {
      endpoints: [
        {
          method: "DELETE"
          path: "/mlflow/unity-catalog/prompts/{name}/versions/{version}/tags/{key}"
          since: {
            major: 2
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "(Unity Catalog) Delete Prompt Version Tag"
    };
  }

  rpc LinkPromptVersionsToModels(LinkPromptVersionsToModelsRequest) returns (google.protobuf.Empty) {
    option (rpc) = {
      endpoints: [
        {
          method: "POST"
          path: "/mlflow/unity-catalog/prompt-versions/links-to-models"
          since: {
            major: 2
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "(Unity Catalog) Link Prompt Versions to Models"
    };
  }

  rpc LinkPromptsToTraces(LinkPromptsToTracesRequest) returns (google.protobuf.Empty) {
    option (rpc) = {
      endpoints: [
        {
          method: "POST"
          path: "/mlflow/unity-catalog/prompt-versions/links-to-traces"
          since: {
            major: 2
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "(Unity Catalog) Link Prompts to Traces"
    };
  }

  rpc LinkPromptVersionsToRuns(LinkPromptVersionsToRunsRequest) returns (google.protobuf.Empty) {
    option (rpc) = {
      endpoints: [
        {
          method: "POST"
          path: "/mlflow/unity-catalog/prompt-versions/links-to-runs"
          since: {
            major: 2
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
      rpc_doc_title: "(Unity Catalog) Link Prompt Versions to Runs"
    };
  }
}
```

--------------------------------------------------------------------------------

````
