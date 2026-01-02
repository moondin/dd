---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 376
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 376 of 991)

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

---[FILE: unity_catalog_oss_messages_pb2.pyi]---
Location: mlflow-master/mlflow/protos/unity_catalog_oss_messages_pb2.pyi

```text
import databricks_pb2 as _databricks_pb2
from scalapb import scalapb_pb2 as _scalapb_pb2
from google.protobuf.internal import containers as _containers
from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Mapping as _Mapping, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class ModelVersionStatus(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    MODEL_VERSION_STATUS_UNKNOWN: _ClassVar[ModelVersionStatus]
    PENDING_REGISTRATION: _ClassVar[ModelVersionStatus]
    FAILED_REGISTRATION: _ClassVar[ModelVersionStatus]
    READY: _ClassVar[ModelVersionStatus]

class ModelVersionOperation(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    UNKNOWN_MODEL_VERSION_OPERATION: _ClassVar[ModelVersionOperation]
    READ_MODEL_VERSION: _ClassVar[ModelVersionOperation]
    READ_WRITE_MODEL_VERSION: _ClassVar[ModelVersionOperation]
MODEL_VERSION_STATUS_UNKNOWN: ModelVersionStatus
PENDING_REGISTRATION: ModelVersionStatus
FAILED_REGISTRATION: ModelVersionStatus
READY: ModelVersionStatus
UNKNOWN_MODEL_VERSION_OPERATION: ModelVersionOperation
READ_MODEL_VERSION: ModelVersionOperation
READ_WRITE_MODEL_VERSION: ModelVersionOperation

class RegisteredModelInfo(_message.Message):
    __slots__ = ("name", "catalog_name", "schema_name", "comment", "storage_location", "full_name", "created_at", "created_by", "updated_at", "updated_by", "id", "browse_only")
    NAME_FIELD_NUMBER: _ClassVar[int]
    CATALOG_NAME_FIELD_NUMBER: _ClassVar[int]
    SCHEMA_NAME_FIELD_NUMBER: _ClassVar[int]
    COMMENT_FIELD_NUMBER: _ClassVar[int]
    STORAGE_LOCATION_FIELD_NUMBER: _ClassVar[int]
    FULL_NAME_FIELD_NUMBER: _ClassVar[int]
    CREATED_AT_FIELD_NUMBER: _ClassVar[int]
    CREATED_BY_FIELD_NUMBER: _ClassVar[int]
    UPDATED_AT_FIELD_NUMBER: _ClassVar[int]
    UPDATED_BY_FIELD_NUMBER: _ClassVar[int]
    ID_FIELD_NUMBER: _ClassVar[int]
    BROWSE_ONLY_FIELD_NUMBER: _ClassVar[int]
    name: str
    catalog_name: str
    schema_name: str
    comment: str
    storage_location: str
    full_name: str
    created_at: int
    created_by: str
    updated_at: int
    updated_by: str
    id: str
    browse_only: bool
    def __init__(self, name: _Optional[str] = ..., catalog_name: _Optional[str] = ..., schema_name: _Optional[str] = ..., comment: _Optional[str] = ..., storage_location: _Optional[str] = ..., full_name: _Optional[str] = ..., created_at: _Optional[int] = ..., created_by: _Optional[str] = ..., updated_at: _Optional[int] = ..., updated_by: _Optional[str] = ..., id: _Optional[str] = ..., browse_only: bool = ...) -> None: ...

class CreateRegisteredModel(_message.Message):
    __slots__ = ("name", "catalog_name", "schema_name", "comment", "storage_location")
    class Response(_message.Message):
        __slots__ = ("registered_model_info",)
        REGISTERED_MODEL_INFO_FIELD_NUMBER: _ClassVar[int]
        registered_model_info: RegisteredModelInfo
        def __init__(self, registered_model_info: _Optional[_Union[RegisteredModelInfo, _Mapping]] = ...) -> None: ...
    NAME_FIELD_NUMBER: _ClassVar[int]
    CATALOG_NAME_FIELD_NUMBER: _ClassVar[int]
    SCHEMA_NAME_FIELD_NUMBER: _ClassVar[int]
    COMMENT_FIELD_NUMBER: _ClassVar[int]
    STORAGE_LOCATION_FIELD_NUMBER: _ClassVar[int]
    name: str
    catalog_name: str
    schema_name: str
    comment: str
    storage_location: str
    def __init__(self, name: _Optional[str] = ..., catalog_name: _Optional[str] = ..., schema_name: _Optional[str] = ..., comment: _Optional[str] = ..., storage_location: _Optional[str] = ...) -> None: ...

class DeleteRegisteredModel(_message.Message):
    __slots__ = ("full_name", "force")
    class Response(_message.Message):
        __slots__ = ()
        def __init__(self) -> None: ...
    FULL_NAME_FIELD_NUMBER: _ClassVar[int]
    FORCE_FIELD_NUMBER: _ClassVar[int]
    full_name: str
    force: bool
    def __init__(self, full_name: _Optional[str] = ..., force: bool = ...) -> None: ...

class GetRegisteredModel(_message.Message):
    __slots__ = ("full_name",)
    class Response(_message.Message):
        __slots__ = ("registered_model_info",)
        REGISTERED_MODEL_INFO_FIELD_NUMBER: _ClassVar[int]
        registered_model_info: RegisteredModelInfo
        def __init__(self, registered_model_info: _Optional[_Union[RegisteredModelInfo, _Mapping]] = ...) -> None: ...
    FULL_NAME_FIELD_NUMBER: _ClassVar[int]
    full_name: str
    def __init__(self, full_name: _Optional[str] = ...) -> None: ...

class UpdateRegisteredModel(_message.Message):
    __slots__ = ("full_name", "new_name", "comment")
    class Response(_message.Message):
        __slots__ = ("registered_model_info",)
        REGISTERED_MODEL_INFO_FIELD_NUMBER: _ClassVar[int]
        registered_model_info: RegisteredModelInfo
        def __init__(self, registered_model_info: _Optional[_Union[RegisteredModelInfo, _Mapping]] = ...) -> None: ...
    FULL_NAME_FIELD_NUMBER: _ClassVar[int]
    NEW_NAME_FIELD_NUMBER: _ClassVar[int]
    COMMENT_FIELD_NUMBER: _ClassVar[int]
    full_name: str
    new_name: str
    comment: str
    def __init__(self, full_name: _Optional[str] = ..., new_name: _Optional[str] = ..., comment: _Optional[str] = ...) -> None: ...

class ListRegisteredModels(_message.Message):
    __slots__ = ("catalog_name", "schema_name", "max_results", "page_token")
    class Response(_message.Message):
        __slots__ = ("registered_models", "next_page_token")
        REGISTERED_MODELS_FIELD_NUMBER: _ClassVar[int]
        NEXT_PAGE_TOKEN_FIELD_NUMBER: _ClassVar[int]
        registered_models: _containers.RepeatedCompositeFieldContainer[RegisteredModelInfo]
        next_page_token: str
        def __init__(self, registered_models: _Optional[_Iterable[_Union[RegisteredModelInfo, _Mapping]]] = ..., next_page_token: _Optional[str] = ...) -> None: ...
    CATALOG_NAME_FIELD_NUMBER: _ClassVar[int]
    SCHEMA_NAME_FIELD_NUMBER: _ClassVar[int]
    MAX_RESULTS_FIELD_NUMBER: _ClassVar[int]
    PAGE_TOKEN_FIELD_NUMBER: _ClassVar[int]
    catalog_name: str
    schema_name: str
    max_results: int
    page_token: str
    def __init__(self, catalog_name: _Optional[str] = ..., schema_name: _Optional[str] = ..., max_results: _Optional[int] = ..., page_token: _Optional[str] = ...) -> None: ...

class ModelVersionInfo(_message.Message):
    __slots__ = ("model_name", "catalog_name", "schema_name", "source", "comment", "run_id", "status", "version", "storage_location", "created_at", "created_by", "updated_at", "updated_by", "id")
    MODEL_NAME_FIELD_NUMBER: _ClassVar[int]
    CATALOG_NAME_FIELD_NUMBER: _ClassVar[int]
    SCHEMA_NAME_FIELD_NUMBER: _ClassVar[int]
    SOURCE_FIELD_NUMBER: _ClassVar[int]
    COMMENT_FIELD_NUMBER: _ClassVar[int]
    RUN_ID_FIELD_NUMBER: _ClassVar[int]
    STATUS_FIELD_NUMBER: _ClassVar[int]
    VERSION_FIELD_NUMBER: _ClassVar[int]
    STORAGE_LOCATION_FIELD_NUMBER: _ClassVar[int]
    CREATED_AT_FIELD_NUMBER: _ClassVar[int]
    CREATED_BY_FIELD_NUMBER: _ClassVar[int]
    UPDATED_AT_FIELD_NUMBER: _ClassVar[int]
    UPDATED_BY_FIELD_NUMBER: _ClassVar[int]
    ID_FIELD_NUMBER: _ClassVar[int]
    model_name: str
    catalog_name: str
    schema_name: str
    source: str
    comment: str
    run_id: str
    status: ModelVersionStatus
    version: int
    storage_location: str
    created_at: int
    created_by: str
    updated_at: int
    updated_by: str
    id: str
    def __init__(self, model_name: _Optional[str] = ..., catalog_name: _Optional[str] = ..., schema_name: _Optional[str] = ..., source: _Optional[str] = ..., comment: _Optional[str] = ..., run_id: _Optional[str] = ..., status: _Optional[_Union[ModelVersionStatus, str]] = ..., version: _Optional[int] = ..., storage_location: _Optional[str] = ..., created_at: _Optional[int] = ..., created_by: _Optional[str] = ..., updated_at: _Optional[int] = ..., updated_by: _Optional[str] = ..., id: _Optional[str] = ...) -> None: ...

class CreateModelVersion(_message.Message):
    __slots__ = ("model_name", "catalog_name", "schema_name", "source", "run_id", "comment")
    class Response(_message.Message):
        __slots__ = ("model_version_info",)
        MODEL_VERSION_INFO_FIELD_NUMBER: _ClassVar[int]
        model_version_info: ModelVersionInfo
        def __init__(self, model_version_info: _Optional[_Union[ModelVersionInfo, _Mapping]] = ...) -> None: ...
    MODEL_NAME_FIELD_NUMBER: _ClassVar[int]
    CATALOG_NAME_FIELD_NUMBER: _ClassVar[int]
    SCHEMA_NAME_FIELD_NUMBER: _ClassVar[int]
    SOURCE_FIELD_NUMBER: _ClassVar[int]
    RUN_ID_FIELD_NUMBER: _ClassVar[int]
    COMMENT_FIELD_NUMBER: _ClassVar[int]
    model_name: str
    catalog_name: str
    schema_name: str
    source: str
    run_id: str
    comment: str
    def __init__(self, model_name: _Optional[str] = ..., catalog_name: _Optional[str] = ..., schema_name: _Optional[str] = ..., source: _Optional[str] = ..., run_id: _Optional[str] = ..., comment: _Optional[str] = ...) -> None: ...

class DeleteModelVersion(_message.Message):
    __slots__ = ("full_name", "version")
    class Response(_message.Message):
        __slots__ = ()
        def __init__(self) -> None: ...
    FULL_NAME_FIELD_NUMBER: _ClassVar[int]
    VERSION_FIELD_NUMBER: _ClassVar[int]
    full_name: str
    version: int
    def __init__(self, full_name: _Optional[str] = ..., version: _Optional[int] = ...) -> None: ...

class FinalizeModelVersion(_message.Message):
    __slots__ = ("full_name", "version")
    class Response(_message.Message):
        __slots__ = ("model_version_info",)
        MODEL_VERSION_INFO_FIELD_NUMBER: _ClassVar[int]
        model_version_info: ModelVersionInfo
        def __init__(self, model_version_info: _Optional[_Union[ModelVersionInfo, _Mapping]] = ...) -> None: ...
    FULL_NAME_FIELD_NUMBER: _ClassVar[int]
    VERSION_FIELD_NUMBER: _ClassVar[int]
    full_name: str
    version: int
    def __init__(self, full_name: _Optional[str] = ..., version: _Optional[int] = ...) -> None: ...

class GetModelVersion(_message.Message):
    __slots__ = ("full_name", "version")
    class Response(_message.Message):
        __slots__ = ("model_version_info",)
        MODEL_VERSION_INFO_FIELD_NUMBER: _ClassVar[int]
        model_version_info: ModelVersionInfo
        def __init__(self, model_version_info: _Optional[_Union[ModelVersionInfo, _Mapping]] = ...) -> None: ...
    FULL_NAME_FIELD_NUMBER: _ClassVar[int]
    VERSION_FIELD_NUMBER: _ClassVar[int]
    full_name: str
    version: int
    def __init__(self, full_name: _Optional[str] = ..., version: _Optional[int] = ...) -> None: ...

class UpdateModelVersion(_message.Message):
    __slots__ = ("full_name", "version", "comment")
    class Response(_message.Message):
        __slots__ = ("model_version_info",)
        MODEL_VERSION_INFO_FIELD_NUMBER: _ClassVar[int]
        model_version_info: ModelVersionInfo
        def __init__(self, model_version_info: _Optional[_Union[ModelVersionInfo, _Mapping]] = ...) -> None: ...
    FULL_NAME_FIELD_NUMBER: _ClassVar[int]
    VERSION_FIELD_NUMBER: _ClassVar[int]
    COMMENT_FIELD_NUMBER: _ClassVar[int]
    full_name: str
    version: int
    comment: str
    def __init__(self, full_name: _Optional[str] = ..., version: _Optional[int] = ..., comment: _Optional[str] = ...) -> None: ...

class ListModelVersions(_message.Message):
    __slots__ = ("full_name", "max_results", "page_token")
    class Response(_message.Message):
        __slots__ = ("model_versions", "next_page_token")
        MODEL_VERSIONS_FIELD_NUMBER: _ClassVar[int]
        NEXT_PAGE_TOKEN_FIELD_NUMBER: _ClassVar[int]
        model_versions: _containers.RepeatedCompositeFieldContainer[ModelVersionInfo]
        next_page_token: str
        def __init__(self, model_versions: _Optional[_Iterable[_Union[ModelVersionInfo, _Mapping]]] = ..., next_page_token: _Optional[str] = ...) -> None: ...
    FULL_NAME_FIELD_NUMBER: _ClassVar[int]
    MAX_RESULTS_FIELD_NUMBER: _ClassVar[int]
    PAGE_TOKEN_FIELD_NUMBER: _ClassVar[int]
    full_name: str
    max_results: int
    page_token: str
    def __init__(self, full_name: _Optional[str] = ..., max_results: _Optional[int] = ..., page_token: _Optional[str] = ...) -> None: ...

class TemporaryCredentials(_message.Message):
    __slots__ = ("aws_temp_credentials", "azure_user_delegation_sas", "gcp_oauth_token", "expiration_time")
    AWS_TEMP_CREDENTIALS_FIELD_NUMBER: _ClassVar[int]
    AZURE_USER_DELEGATION_SAS_FIELD_NUMBER: _ClassVar[int]
    GCP_OAUTH_TOKEN_FIELD_NUMBER: _ClassVar[int]
    EXPIRATION_TIME_FIELD_NUMBER: _ClassVar[int]
    aws_temp_credentials: AwsCredentials
    azure_user_delegation_sas: AzureUserDelegationSAS
    gcp_oauth_token: GcpOauthToken
    expiration_time: int
    def __init__(self, aws_temp_credentials: _Optional[_Union[AwsCredentials, _Mapping]] = ..., azure_user_delegation_sas: _Optional[_Union[AzureUserDelegationSAS, _Mapping]] = ..., gcp_oauth_token: _Optional[_Union[GcpOauthToken, _Mapping]] = ..., expiration_time: _Optional[int] = ...) -> None: ...

class AwsCredentials(_message.Message):
    __slots__ = ("access_key_id", "secret_access_key", "session_token")
    ACCESS_KEY_ID_FIELD_NUMBER: _ClassVar[int]
    SECRET_ACCESS_KEY_FIELD_NUMBER: _ClassVar[int]
    SESSION_TOKEN_FIELD_NUMBER: _ClassVar[int]
    access_key_id: str
    secret_access_key: str
    session_token: str
    def __init__(self, access_key_id: _Optional[str] = ..., secret_access_key: _Optional[str] = ..., session_token: _Optional[str] = ...) -> None: ...

class AzureUserDelegationSAS(_message.Message):
    __slots__ = ("sas_token",)
    SAS_TOKEN_FIELD_NUMBER: _ClassVar[int]
    sas_token: str
    def __init__(self, sas_token: _Optional[str] = ...) -> None: ...

class GcpOauthToken(_message.Message):
    __slots__ = ("oauth_token",)
    OAUTH_TOKEN_FIELD_NUMBER: _ClassVar[int]
    oauth_token: str
    def __init__(self, oauth_token: _Optional[str] = ...) -> None: ...

class GenerateTemporaryModelVersionCredential(_message.Message):
    __slots__ = ("catalog_name", "schema_name", "model_name", "version", "operation")
    class Response(_message.Message):
        __slots__ = ("credentials",)
        CREDENTIALS_FIELD_NUMBER: _ClassVar[int]
        credentials: TemporaryCredentials
        def __init__(self, credentials: _Optional[_Union[TemporaryCredentials, _Mapping]] = ...) -> None: ...
    CATALOG_NAME_FIELD_NUMBER: _ClassVar[int]
    SCHEMA_NAME_FIELD_NUMBER: _ClassVar[int]
    MODEL_NAME_FIELD_NUMBER: _ClassVar[int]
    VERSION_FIELD_NUMBER: _ClassVar[int]
    OPERATION_FIELD_NUMBER: _ClassVar[int]
    catalog_name: str
    schema_name: str
    model_name: str
    version: int
    operation: ModelVersionOperation
    def __init__(self, catalog_name: _Optional[str] = ..., schema_name: _Optional[str] = ..., model_name: _Optional[str] = ..., version: _Optional[int] = ..., operation: _Optional[_Union[ModelVersionOperation, str]] = ...) -> None: ...
```

--------------------------------------------------------------------------------

---[FILE: unity_catalog_oss_service.proto]---
Location: mlflow-master/mlflow/protos/unity_catalog_oss_service.proto

```proto
syntax = "proto2";

package mlflow.unitycatalog;

import "databricks.proto";
import "scalapb/scalapb.proto";
import "unity_catalog_oss_messages.proto";

option java_generate_equals_and_hash = true;
option java_package = "com.databricks.api.proto.managedcatalog";
option py_generic_services = true;
option (scalapb.options) = {flat_package: true};

service UnityCatalogService {
  // Registered Model Management API
  rpc createRegisteredModel(CreateRegisteredModel) returns (CreateRegisteredModel.Response) {
    option (rpc) = {
      endpoints: {
        method: "POST"
        path: "/unity-catalog/models"
        since: {
          major: 2
          minor: 1
        }
      }
      // https://docs.databricks.com/api/workspace/registeredmodels/create
      visibility: PUBLIC
    };
  }

  rpc updateRegisteredModel(UpdateRegisteredModel) returns (UpdateRegisteredModel.Response) {
    option (rpc) = {
      endpoints: {
        method: "PATCH"
        path: "/unity-catalog/models/{full_name}"
        since: {
          major: 2
          minor: 1
        }
      }
      visibility: PUBLIC_UNDOCUMENTED
    };
  }

  rpc deleteRegisteredModel(DeleteRegisteredModel) returns (DeleteRegisteredModel.Response) {
    option (rpc) = {
      endpoints: {
        method: "DELETE"
        path: "/unity-catalog/models/{full_name}"
        since: {
          major: 2
          minor: 1
        }
      }
      visibility: PUBLIC_UNDOCUMENTED
    };
  }

  rpc getRegisteredModel(GetRegisteredModel) returns (GetRegisteredModel.Response) {
    option idempotency_level = IDEMPOTENT;
    option (rpc) = {
      endpoints: {
        method: "GET"
        path: "/unity-catalog/models/{full_name}"
        since: {
          major: 2
          minor: 1
        }
      }
      visibility: PUBLIC_UNDOCUMENTED
    };
  }

  rpc getModelVersion(GetModelVersion) returns (GetModelVersion.Response) {
    option idempotency_level = IDEMPOTENT;
    option (rpc) = {
      endpoints: {
        method: "GET"
        path: "/unity-catalog/models/{full_name}/versions/{version}"
        since: {
          major: 2
          minor: 1
        }
      }
      visibility: PUBLIC_UNDOCUMENTED
    };
  }

  rpc deleteModelVersion(DeleteModelVersion) returns (DeleteModelVersion.Response) {
    option (rpc) = {
      endpoints: {
        method: "DELETE"
        path: "/unity-catalog/models/{full_name}/versions/{version}"
        since: {
          major: 2
          minor: 1
        }
      }
      visibility: PUBLIC_UNDOCUMENTED
    };
  }

  rpc createModelVersion(CreateModelVersion) returns (CreateModelVersion.Response) {
    option (rpc) = {
      endpoints: {
        method: "POST"
        path: "/unity-catalog/models/versions"
        since: {
          major: 2
          minor: 1
        }
      }
    };
  }

  rpc generateTemporaryModelVersionCredential(GenerateTemporaryModelVersionCredential) returns (GenerateTemporaryModelVersionCredential.Response) {
    option (rpc) = {
      endpoints: {
        method: "POST"
        path: "/unity-catalog/temporary-model-version-credentials"
        since: {
          major: 2
          minor: 1
        }
      }
      visibility: PUBLIC_UNDOCUMENTED
    };
  }

  rpc finalizeModelVersion(FinalizeModelVersion) returns (FinalizeModelVersion.Response) {
    option (rpc) = {
      endpoints: {
        method: "PATCH"
        path: "/unity-catalog/models/{full_name}/versions/{version}/finalize"
        since: {
          major: 2
          minor: 1
        }
      }
      visibility: PUBLIC_UNDOCUMENTED
    };
  }

  rpc updateModelVersion(UpdateModelVersion) returns (UpdateModelVersion.Response) {
    option (rpc) = {
      endpoints: {
        method: "PATCH"
        path: "/unity-catalog/models/{full_name}/versions/{version}"
        since: {
          major: 2
          minor: 1
        }
      }
      visibility: PUBLIC_UNDOCUMENTED
    };
  }

  rpc listRegisteredModels(ListRegisteredModels) returns (ListRegisteredModels.Response) {
    option idempotency_level = IDEMPOTENT;
    option (rpc) = {
      endpoints: {
        method: "GET"
        path: "/unity-catalog/models"
        since: {
          major: 2
          minor: 1
        }
      }
      visibility: PUBLIC_UNDOCUMENTED
    };
  }

  rpc listModelVersions(ListModelVersions) returns (ListModelVersions.Response) {
    option idempotency_level = IDEMPOTENT;
    option (rpc) = {
      endpoints: {
        method: "GET"
        path: "/unity-catalog/models/{full_name}/versions"
        since: {
          major: 2
          minor: 1
        }
      }
      visibility: PUBLIC_UNDOCUMENTED
    };
  }
}
```

--------------------------------------------------------------------------------

---[FILE: unity_catalog_oss_service_pb2.py]---
Location: mlflow-master/mlflow/protos/unity_catalog_oss_service_pb2.py

```python

import google.protobuf
from packaging.version import Version
if Version(google.protobuf.__version__).major >= 5:
  # -*- coding: utf-8 -*-
  # Generated by the protocol buffer compiler.  DO NOT EDIT!
  # source: unity_catalog_oss_service.proto
  # Protobuf Python Version: 5.26.0
  """Generated protocol buffer code."""
  from google.protobuf import descriptor as _descriptor
  from google.protobuf import descriptor_pool as _descriptor_pool
  from google.protobuf import symbol_database as _symbol_database
  from google.protobuf.internal import builder as _builder
  # @@protoc_insertion_point(imports)

  _sym_db = _symbol_database.Default()


  from . import databricks_pb2 as databricks__pb2
  from .scalapb import scalapb_pb2 as scalapb_dot_scalapb__pb2
  from . import unity_catalog_oss_messages_pb2 as unity_catalog_oss_messages_pb2


  DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x1funity_catalog_oss_service.proto\x12\x13mlflow.unitycatalog\x1a\x10\x64\x61tabricks.proto\x1a\x15scalapb/scalapb.proto\x1a unity_catalog_oss_messages.proto2\xd4\x11\n\x13UnityCatalogService\x12\xa5\x01\n\x15\x63reateRegisteredModel\x12*.mlflow.unitycatalog.CreateRegisteredModel\x1a\x33.mlflow.unitycatalog.CreateRegisteredModel.Response\"+\xf2\x86\x19\'\n#\n\x04POST\x12\x15/unity-catalog/models\x1a\x04\x08\x02\x10\x01\x10\x01\x12\xb2\x01\n\x15updateRegisteredModel\x12*.mlflow.unitycatalog.UpdateRegisteredModel\x1a\x33.mlflow.unitycatalog.UpdateRegisteredModel.Response\"8\xf2\x86\x19\x34\n0\n\x05PATCH\x12!/unity-catalog/models/{full_name}\x1a\x04\x08\x02\x10\x01\x10\x03\x12\xb3\x01\n\x15\x64\x65leteRegisteredModel\x12*.mlflow.unitycatalog.DeleteRegisteredModel\x1a\x33.mlflow.unitycatalog.DeleteRegisteredModel.Response\"9\xf2\x86\x19\x35\n1\n\x06\x44\x45LETE\x12!/unity-catalog/models/{full_name}\x1a\x04\x08\x02\x10\x01\x10\x03\x12\xaa\x01\n\x12getRegisteredModel\x12\'.mlflow.unitycatalog.GetRegisteredModel\x1a\x30.mlflow.unitycatalog.GetRegisteredModel.Response\"9\x90\x02\x02\xf2\x86\x19\x32\n.\n\x03GET\x12!/unity-catalog/models/{full_name}\x1a\x04\x08\x02\x10\x01\x10\x03\x12\xb4\x01\n\x0fgetModelVersion\x12$.mlflow.unitycatalog.GetModelVersion\x1a-.mlflow.unitycatalog.GetModelVersion.Response\"L\x90\x02\x02\xf2\x86\x19\x45\nA\n\x03GET\x12\x34/unity-catalog/models/{full_name}/versions/{version}\x1a\x04\x08\x02\x10\x01\x10\x03\x12\xbd\x01\n\x12\x64\x65leteModelVersion\x12\'.mlflow.unitycatalog.DeleteModelVersion\x1a\x30.mlflow.unitycatalog.DeleteModelVersion.Response\"L\xf2\x86\x19H\nD\n\x06\x44\x45LETE\x12\x34/unity-catalog/models/{full_name}/versions/{version}\x1a\x04\x08\x02\x10\x01\x10\x03\x12\xa3\x01\n\x12\x63reateModelVersion\x12\'.mlflow.unitycatalog.CreateModelVersion\x1a\x30.mlflow.unitycatalog.CreateModelVersion.Response\"2\xf2\x86\x19.\n,\n\x04POST\x12\x1e/unity-catalog/models/versions\x1a\x04\x08\x02\x10\x01\x12\xf8\x01\n\'generateTemporaryModelVersionCredential\x12<.mlflow.unitycatalog.GenerateTemporaryModelVersionCredential\x1a\x45.mlflow.unitycatalog.GenerateTemporaryModelVersionCredential.Response\"H\xf2\x86\x19\x44\n@\n\x04POST\x12\x32/unity-catalog/temporary-model-version-credentials\x1a\x04\x08\x02\x10\x01\x10\x03\x12\xcb\x01\n\x14\x66inalizeModelVersion\x12).mlflow.unitycatalog.FinalizeModelVersion\x1a\x32.mlflow.unitycatalog.FinalizeModelVersion.Response\"T\xf2\x86\x19P\nL\n\x05PATCH\x12=/unity-catalog/models/{full_name}/versions/{version}/finalize\x1a\x04\x08\x02\x10\x01\x10\x03\x12\xbc\x01\n\x12updateModelVersion\x12\'.mlflow.unitycatalog.UpdateModelVersion\x1a\x30.mlflow.unitycatalog.UpdateModelVersion.Response\"K\xf2\x86\x19G\nC\n\x05PATCH\x12\x34/unity-catalog/models/{full_name}/versions/{version}\x1a\x04\x08\x02\x10\x01\x10\x03\x12\xa4\x01\n\x14listRegisteredModels\x12).mlflow.unitycatalog.ListRegisteredModels\x1a\x32.mlflow.unitycatalog.ListRegisteredModels.Response\"-\x90\x02\x02\xf2\x86\x19&\n\"\n\x03GET\x12\x15/unity-catalog/models\x1a\x04\x08\x02\x10\x01\x10\x03\x12\xb0\x01\n\x11listModelVersions\x12&.mlflow.unitycatalog.ListModelVersions\x1a/.mlflow.unitycatalog.ListModelVersions.Response\"B\x90\x02\x02\xf2\x86\x19;\n7\n\x03GET\x12*/unity-catalog/models/{full_name}/versions\x1a\x04\x08\x02\x10\x01\x10\x03\x42\x34\n\'com.databricks.api.proto.managedcatalog\x90\x01\x01\xa0\x01\x01\xe2?\x02\x10\x01')

  _globals = globals()
  _builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
  _builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'unity_catalog_oss_service_pb2', _globals)
  if not _descriptor._USE_C_DESCRIPTORS:
    _globals['DESCRIPTOR']._loaded_options = None
    _globals['DESCRIPTOR']._serialized_options = b'\n\'com.databricks.api.proto.managedcatalog\220\001\001\240\001\001\342?\002\020\001'
    _globals['_UNITYCATALOGSERVICE'].methods_by_name['createRegisteredModel']._loaded_options = None
    _globals['_UNITYCATALOGSERVICE'].methods_by_name['createRegisteredModel']._serialized_options = b'\362\206\031\'\n#\n\004POST\022\025/unity-catalog/models\032\004\010\002\020\001\020\001'
    _globals['_UNITYCATALOGSERVICE'].methods_by_name['updateRegisteredModel']._loaded_options = None
    _globals['_UNITYCATALOGSERVICE'].methods_by_name['updateRegisteredModel']._serialized_options = b'\362\206\0314\n0\n\005PATCH\022!/unity-catalog/models/{full_name}\032\004\010\002\020\001\020\003'
    _globals['_UNITYCATALOGSERVICE'].methods_by_name['deleteRegisteredModel']._loaded_options = None
    _globals['_UNITYCATALOGSERVICE'].methods_by_name['deleteRegisteredModel']._serialized_options = b'\362\206\0315\n1\n\006DELETE\022!/unity-catalog/models/{full_name}\032\004\010\002\020\001\020\003'
    _globals['_UNITYCATALOGSERVICE'].methods_by_name['getRegisteredModel']._loaded_options = None
    _globals['_UNITYCATALOGSERVICE'].methods_by_name['getRegisteredModel']._serialized_options = b'\220\002\002\362\206\0312\n.\n\003GET\022!/unity-catalog/models/{full_name}\032\004\010\002\020\001\020\003'
    _globals['_UNITYCATALOGSERVICE'].methods_by_name['getModelVersion']._loaded_options = None
    _globals['_UNITYCATALOGSERVICE'].methods_by_name['getModelVersion']._serialized_options = b'\220\002\002\362\206\031E\nA\n\003GET\0224/unity-catalog/models/{full_name}/versions/{version}\032\004\010\002\020\001\020\003'
    _globals['_UNITYCATALOGSERVICE'].methods_by_name['deleteModelVersion']._loaded_options = None
    _globals['_UNITYCATALOGSERVICE'].methods_by_name['deleteModelVersion']._serialized_options = b'\362\206\031H\nD\n\006DELETE\0224/unity-catalog/models/{full_name}/versions/{version}\032\004\010\002\020\001\020\003'
    _globals['_UNITYCATALOGSERVICE'].methods_by_name['createModelVersion']._loaded_options = None
    _globals['_UNITYCATALOGSERVICE'].methods_by_name['createModelVersion']._serialized_options = b'\362\206\031.\n,\n\004POST\022\036/unity-catalog/models/versions\032\004\010\002\020\001'
    _globals['_UNITYCATALOGSERVICE'].methods_by_name['generateTemporaryModelVersionCredential']._loaded_options = None
    _globals['_UNITYCATALOGSERVICE'].methods_by_name['generateTemporaryModelVersionCredential']._serialized_options = b'\362\206\031D\n@\n\004POST\0222/unity-catalog/temporary-model-version-credentials\032\004\010\002\020\001\020\003'
    _globals['_UNITYCATALOGSERVICE'].methods_by_name['finalizeModelVersion']._loaded_options = None
    _globals['_UNITYCATALOGSERVICE'].methods_by_name['finalizeModelVersion']._serialized_options = b'\362\206\031P\nL\n\005PATCH\022=/unity-catalog/models/{full_name}/versions/{version}/finalize\032\004\010\002\020\001\020\003'
    _globals['_UNITYCATALOGSERVICE'].methods_by_name['updateModelVersion']._loaded_options = None
    _globals['_UNITYCATALOGSERVICE'].methods_by_name['updateModelVersion']._serialized_options = b'\362\206\031G\nC\n\005PATCH\0224/unity-catalog/models/{full_name}/versions/{version}\032\004\010\002\020\001\020\003'
    _globals['_UNITYCATALOGSERVICE'].methods_by_name['listRegisteredModels']._loaded_options = None
    _globals['_UNITYCATALOGSERVICE'].methods_by_name['listRegisteredModels']._serialized_options = b'\220\002\002\362\206\031&\n\"\n\003GET\022\025/unity-catalog/models\032\004\010\002\020\001\020\003'
    _globals['_UNITYCATALOGSERVICE'].methods_by_name['listModelVersions']._loaded_options = None
    _globals['_UNITYCATALOGSERVICE'].methods_by_name['listModelVersions']._serialized_options = b'\220\002\002\362\206\031;\n7\n\003GET\022*/unity-catalog/models/{full_name}/versions\032\004\010\002\020\001\020\003'
    _globals['_UNITYCATALOGSERVICE']._serialized_start=132
    _globals['_UNITYCATALOGSERVICE']._serialized_end=2392
  _builder.BuildServices(DESCRIPTOR, 'unity_catalog_oss_service_pb2', _globals)
  # @@protoc_insertion_point(module_scope)

else:
  # -*- coding: utf-8 -*-
  # Generated by the protocol buffer compiler.  DO NOT EDIT!
  # source: unity_catalog_oss_service.proto
  """Generated protocol buffer code."""
  from google.protobuf import descriptor as _descriptor
  from google.protobuf import descriptor_pool as _descriptor_pool
  from google.protobuf import message as _message
  from google.protobuf import reflection as _reflection
  from google.protobuf import symbol_database as _symbol_database
  from google.protobuf import service as _service
  from google.protobuf import service_reflection
  # @@protoc_insertion_point(imports)

  _sym_db = _symbol_database.Default()


  from . import databricks_pb2 as databricks__pb2
  from .scalapb import scalapb_pb2 as scalapb_dot_scalapb__pb2
  from . import unity_catalog_oss_messages_pb2 as unity_catalog_oss_messages_pb2


  DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x1funity_catalog_oss_service.proto\x12\x13mlflow.unitycatalog\x1a\x10\x64\x61tabricks.proto\x1a\x15scalapb/scalapb.proto\x1a unity_catalog_oss_messages.proto2\xd4\x11\n\x13UnityCatalogService\x12\xa5\x01\n\x15\x63reateRegisteredModel\x12*.mlflow.unitycatalog.CreateRegisteredModel\x1a\x33.mlflow.unitycatalog.CreateRegisteredModel.Response\"+\xf2\x86\x19\'\n#\n\x04POST\x12\x15/unity-catalog/models\x1a\x04\x08\x02\x10\x01\x10\x01\x12\xb2\x01\n\x15updateRegisteredModel\x12*.mlflow.unitycatalog.UpdateRegisteredModel\x1a\x33.mlflow.unitycatalog.UpdateRegisteredModel.Response\"8\xf2\x86\x19\x34\n0\n\x05PATCH\x12!/unity-catalog/models/{full_name}\x1a\x04\x08\x02\x10\x01\x10\x03\x12\xb3\x01\n\x15\x64\x65leteRegisteredModel\x12*.mlflow.unitycatalog.DeleteRegisteredModel\x1a\x33.mlflow.unitycatalog.DeleteRegisteredModel.Response\"9\xf2\x86\x19\x35\n1\n\x06\x44\x45LETE\x12!/unity-catalog/models/{full_name}\x1a\x04\x08\x02\x10\x01\x10\x03\x12\xaa\x01\n\x12getRegisteredModel\x12\'.mlflow.unitycatalog.GetRegisteredModel\x1a\x30.mlflow.unitycatalog.GetRegisteredModel.Response\"9\x90\x02\x02\xf2\x86\x19\x32\n.\n\x03GET\x12!/unity-catalog/models/{full_name}\x1a\x04\x08\x02\x10\x01\x10\x03\x12\xb4\x01\n\x0fgetModelVersion\x12$.mlflow.unitycatalog.GetModelVersion\x1a-.mlflow.unitycatalog.GetModelVersion.Response\"L\x90\x02\x02\xf2\x86\x19\x45\nA\n\x03GET\x12\x34/unity-catalog/models/{full_name}/versions/{version}\x1a\x04\x08\x02\x10\x01\x10\x03\x12\xbd\x01\n\x12\x64\x65leteModelVersion\x12\'.mlflow.unitycatalog.DeleteModelVersion\x1a\x30.mlflow.unitycatalog.DeleteModelVersion.Response\"L\xf2\x86\x19H\nD\n\x06\x44\x45LETE\x12\x34/unity-catalog/models/{full_name}/versions/{version}\x1a\x04\x08\x02\x10\x01\x10\x03\x12\xa3\x01\n\x12\x63reateModelVersion\x12\'.mlflow.unitycatalog.CreateModelVersion\x1a\x30.mlflow.unitycatalog.CreateModelVersion.Response\"2\xf2\x86\x19.\n,\n\x04POST\x12\x1e/unity-catalog/models/versions\x1a\x04\x08\x02\x10\x01\x12\xf8\x01\n\'generateTemporaryModelVersionCredential\x12<.mlflow.unitycatalog.GenerateTemporaryModelVersionCredential\x1a\x45.mlflow.unitycatalog.GenerateTemporaryModelVersionCredential.Response\"H\xf2\x86\x19\x44\n@\n\x04POST\x12\x32/unity-catalog/temporary-model-version-credentials\x1a\x04\x08\x02\x10\x01\x10\x03\x12\xcb\x01\n\x14\x66inalizeModelVersion\x12).mlflow.unitycatalog.FinalizeModelVersion\x1a\x32.mlflow.unitycatalog.FinalizeModelVersion.Response\"T\xf2\x86\x19P\nL\n\x05PATCH\x12=/unity-catalog/models/{full_name}/versions/{version}/finalize\x1a\x04\x08\x02\x10\x01\x10\x03\x12\xbc\x01\n\x12updateModelVersion\x12\'.mlflow.unitycatalog.UpdateModelVersion\x1a\x30.mlflow.unitycatalog.UpdateModelVersion.Response\"K\xf2\x86\x19G\nC\n\x05PATCH\x12\x34/unity-catalog/models/{full_name}/versions/{version}\x1a\x04\x08\x02\x10\x01\x10\x03\x12\xa4\x01\n\x14listRegisteredModels\x12).mlflow.unitycatalog.ListRegisteredModels\x1a\x32.mlflow.unitycatalog.ListRegisteredModels.Response\"-\x90\x02\x02\xf2\x86\x19&\n\"\n\x03GET\x12\x15/unity-catalog/models\x1a\x04\x08\x02\x10\x01\x10\x03\x12\xb0\x01\n\x11listModelVersions\x12&.mlflow.unitycatalog.ListModelVersions\x1a/.mlflow.unitycatalog.ListModelVersions.Response\"B\x90\x02\x02\xf2\x86\x19;\n7\n\x03GET\x12*/unity-catalog/models/{full_name}/versions\x1a\x04\x08\x02\x10\x01\x10\x03\x42\x34\n\'com.databricks.api.proto.managedcatalog\x90\x01\x01\xa0\x01\x01\xe2?\x02\x10\x01')



  _UNITYCATALOGSERVICE = DESCRIPTOR.services_by_name['UnityCatalogService']
  if _descriptor._USE_C_DESCRIPTORS == False:

    DESCRIPTOR._options = None
    DESCRIPTOR._serialized_options = b'\n\'com.databricks.api.proto.managedcatalog\220\001\001\240\001\001\342?\002\020\001'
    _UNITYCATALOGSERVICE.methods_by_name['createRegisteredModel']._options = None
    _UNITYCATALOGSERVICE.methods_by_name['createRegisteredModel']._serialized_options = b'\362\206\031\'\n#\n\004POST\022\025/unity-catalog/models\032\004\010\002\020\001\020\001'
    _UNITYCATALOGSERVICE.methods_by_name['updateRegisteredModel']._options = None
    _UNITYCATALOGSERVICE.methods_by_name['updateRegisteredModel']._serialized_options = b'\362\206\0314\n0\n\005PATCH\022!/unity-catalog/models/{full_name}\032\004\010\002\020\001\020\003'
    _UNITYCATALOGSERVICE.methods_by_name['deleteRegisteredModel']._options = None
    _UNITYCATALOGSERVICE.methods_by_name['deleteRegisteredModel']._serialized_options = b'\362\206\0315\n1\n\006DELETE\022!/unity-catalog/models/{full_name}\032\004\010\002\020\001\020\003'
    _UNITYCATALOGSERVICE.methods_by_name['getRegisteredModel']._options = None
    _UNITYCATALOGSERVICE.methods_by_name['getRegisteredModel']._serialized_options = b'\220\002\002\362\206\0312\n.\n\003GET\022!/unity-catalog/models/{full_name}\032\004\010\002\020\001\020\003'
    _UNITYCATALOGSERVICE.methods_by_name['getModelVersion']._options = None
    _UNITYCATALOGSERVICE.methods_by_name['getModelVersion']._serialized_options = b'\220\002\002\362\206\031E\nA\n\003GET\0224/unity-catalog/models/{full_name}/versions/{version}\032\004\010\002\020\001\020\003'
    _UNITYCATALOGSERVICE.methods_by_name['deleteModelVersion']._options = None
    _UNITYCATALOGSERVICE.methods_by_name['deleteModelVersion']._serialized_options = b'\362\206\031H\nD\n\006DELETE\0224/unity-catalog/models/{full_name}/versions/{version}\032\004\010\002\020\001\020\003'
    _UNITYCATALOGSERVICE.methods_by_name['createModelVersion']._options = None
    _UNITYCATALOGSERVICE.methods_by_name['createModelVersion']._serialized_options = b'\362\206\031.\n,\n\004POST\022\036/unity-catalog/models/versions\032\004\010\002\020\001'
    _UNITYCATALOGSERVICE.methods_by_name['generateTemporaryModelVersionCredential']._options = None
    _UNITYCATALOGSERVICE.methods_by_name['generateTemporaryModelVersionCredential']._serialized_options = b'\362\206\031D\n@\n\004POST\0222/unity-catalog/temporary-model-version-credentials\032\004\010\002\020\001\020\003'
    _UNITYCATALOGSERVICE.methods_by_name['finalizeModelVersion']._options = None
    _UNITYCATALOGSERVICE.methods_by_name['finalizeModelVersion']._serialized_options = b'\362\206\031P\nL\n\005PATCH\022=/unity-catalog/models/{full_name}/versions/{version}/finalize\032\004\010\002\020\001\020\003'
    _UNITYCATALOGSERVICE.methods_by_name['updateModelVersion']._options = None
    _UNITYCATALOGSERVICE.methods_by_name['updateModelVersion']._serialized_options = b'\362\206\031G\nC\n\005PATCH\0224/unity-catalog/models/{full_name}/versions/{version}\032\004\010\002\020\001\020\003'
    _UNITYCATALOGSERVICE.methods_by_name['listRegisteredModels']._options = None
    _UNITYCATALOGSERVICE.methods_by_name['listRegisteredModels']._serialized_options = b'\220\002\002\362\206\031&\n\"\n\003GET\022\025/unity-catalog/models\032\004\010\002\020\001\020\003'
    _UNITYCATALOGSERVICE.methods_by_name['listModelVersions']._options = None
    _UNITYCATALOGSERVICE.methods_by_name['listModelVersions']._serialized_options = b'\220\002\002\362\206\031;\n7\n\003GET\022*/unity-catalog/models/{full_name}/versions\032\004\010\002\020\001\020\003'
    _UNITYCATALOGSERVICE._serialized_start=132
    _UNITYCATALOGSERVICE._serialized_end=2392
  UnityCatalogService = service_reflection.GeneratedServiceType('UnityCatalogService', (_service.Service,), dict(
    DESCRIPTOR = _UNITYCATALOGSERVICE,
    __module__ = 'unity_catalog_oss_service_pb2'
    ))

  UnityCatalogService_Stub = service_reflection.GeneratedServiceStubType('UnityCatalogService_Stub', (UnityCatalogService,), dict(
    DESCRIPTOR = _UNITYCATALOGSERVICE,
    __module__ = 'unity_catalog_oss_service_pb2'
    ))


  # @@protoc_insertion_point(module_scope)
```

--------------------------------------------------------------------------------

---[FILE: unity_catalog_oss_service_pb2.pyi]---
Location: mlflow-master/mlflow/protos/unity_catalog_oss_service_pb2.pyi

```text
import databricks_pb2 as _databricks_pb2
from scalapb import scalapb_pb2 as _scalapb_pb2
import unity_catalog_oss_messages_pb2 as _unity_catalog_oss_messages_pb2
from google.protobuf import descriptor as _descriptor
from google.protobuf import service as _service
from typing import ClassVar as _ClassVar

DESCRIPTOR: _descriptor.FileDescriptor

class UnityCatalogService(_service.service): ...

class UnityCatalogService_Stub(UnityCatalogService): ...
```

--------------------------------------------------------------------------------

````
