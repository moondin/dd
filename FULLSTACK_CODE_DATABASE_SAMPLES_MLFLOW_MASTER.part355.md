---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 355
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 355 of 991)

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

---[FILE: databricks_artifacts_pb2.pyi]---
Location: mlflow-master/mlflow/protos/databricks_artifacts_pb2.pyi

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

class ArtifactCredentialType(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    AZURE_SAS_URI: _ClassVar[ArtifactCredentialType]
    AWS_PRESIGNED_URL: _ClassVar[ArtifactCredentialType]
    GCP_SIGNED_URL: _ClassVar[ArtifactCredentialType]
    AZURE_ADLS_GEN2_SAS_URI: _ClassVar[ArtifactCredentialType]
AZURE_SAS_URI: ArtifactCredentialType
AWS_PRESIGNED_URL: ArtifactCredentialType
GCP_SIGNED_URL: ArtifactCredentialType
AZURE_ADLS_GEN2_SAS_URI: ArtifactCredentialType

class ArtifactCredentialInfo(_message.Message):
    __slots__ = ("run_id", "path", "signed_uri", "headers", "type")
    class HttpHeader(_message.Message):
        __slots__ = ("name", "value")
        NAME_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        name: str
        value: str
        def __init__(self, name: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...
    RUN_ID_FIELD_NUMBER: _ClassVar[int]
    PATH_FIELD_NUMBER: _ClassVar[int]
    SIGNED_URI_FIELD_NUMBER: _ClassVar[int]
    HEADERS_FIELD_NUMBER: _ClassVar[int]
    TYPE_FIELD_NUMBER: _ClassVar[int]
    run_id: str
    path: str
    signed_uri: str
    headers: _containers.RepeatedCompositeFieldContainer[ArtifactCredentialInfo.HttpHeader]
    type: ArtifactCredentialType
    def __init__(self, run_id: _Optional[str] = ..., path: _Optional[str] = ..., signed_uri: _Optional[str] = ..., headers: _Optional[_Iterable[_Union[ArtifactCredentialInfo.HttpHeader, _Mapping]]] = ..., type: _Optional[_Union[ArtifactCredentialType, str]] = ...) -> None: ...

class LoggedModelArtifactCredential(_message.Message):
    __slots__ = ("model_id", "credential_info")
    MODEL_ID_FIELD_NUMBER: _ClassVar[int]
    CREDENTIAL_INFO_FIELD_NUMBER: _ClassVar[int]
    model_id: str
    credential_info: ArtifactCredentialInfo
    def __init__(self, model_id: _Optional[str] = ..., credential_info: _Optional[_Union[ArtifactCredentialInfo, _Mapping]] = ...) -> None: ...

class GetCredentialsForRead(_message.Message):
    __slots__ = ("run_id", "path", "page_token")
    class Response(_message.Message):
        __slots__ = ("credential_infos", "next_page_token")
        CREDENTIAL_INFOS_FIELD_NUMBER: _ClassVar[int]
        NEXT_PAGE_TOKEN_FIELD_NUMBER: _ClassVar[int]
        credential_infos: _containers.RepeatedCompositeFieldContainer[ArtifactCredentialInfo]
        next_page_token: str
        def __init__(self, credential_infos: _Optional[_Iterable[_Union[ArtifactCredentialInfo, _Mapping]]] = ..., next_page_token: _Optional[str] = ...) -> None: ...
    RUN_ID_FIELD_NUMBER: _ClassVar[int]
    PATH_FIELD_NUMBER: _ClassVar[int]
    PAGE_TOKEN_FIELD_NUMBER: _ClassVar[int]
    run_id: str
    path: _containers.RepeatedScalarFieldContainer[str]
    page_token: str
    def __init__(self, run_id: _Optional[str] = ..., path: _Optional[_Iterable[str]] = ..., page_token: _Optional[str] = ...) -> None: ...

class GetCredentialsForWrite(_message.Message):
    __slots__ = ("run_id", "path", "page_token")
    class Response(_message.Message):
        __slots__ = ("credential_infos", "next_page_token")
        CREDENTIAL_INFOS_FIELD_NUMBER: _ClassVar[int]
        NEXT_PAGE_TOKEN_FIELD_NUMBER: _ClassVar[int]
        credential_infos: _containers.RepeatedCompositeFieldContainer[ArtifactCredentialInfo]
        next_page_token: str
        def __init__(self, credential_infos: _Optional[_Iterable[_Union[ArtifactCredentialInfo, _Mapping]]] = ..., next_page_token: _Optional[str] = ...) -> None: ...
    RUN_ID_FIELD_NUMBER: _ClassVar[int]
    PATH_FIELD_NUMBER: _ClassVar[int]
    PAGE_TOKEN_FIELD_NUMBER: _ClassVar[int]
    run_id: str
    path: _containers.RepeatedScalarFieldContainer[str]
    page_token: str
    def __init__(self, run_id: _Optional[str] = ..., path: _Optional[_Iterable[str]] = ..., page_token: _Optional[str] = ...) -> None: ...

class CreateMultipartUpload(_message.Message):
    __slots__ = ("run_id", "path", "num_parts")
    class Response(_message.Message):
        __slots__ = ("upload_id", "upload_credential_infos", "abort_credential_info")
        UPLOAD_ID_FIELD_NUMBER: _ClassVar[int]
        UPLOAD_CREDENTIAL_INFOS_FIELD_NUMBER: _ClassVar[int]
        ABORT_CREDENTIAL_INFO_FIELD_NUMBER: _ClassVar[int]
        upload_id: str
        upload_credential_infos: _containers.RepeatedCompositeFieldContainer[ArtifactCredentialInfo]
        abort_credential_info: ArtifactCredentialInfo
        def __init__(self, upload_id: _Optional[str] = ..., upload_credential_infos: _Optional[_Iterable[_Union[ArtifactCredentialInfo, _Mapping]]] = ..., abort_credential_info: _Optional[_Union[ArtifactCredentialInfo, _Mapping]] = ...) -> None: ...
    RUN_ID_FIELD_NUMBER: _ClassVar[int]
    PATH_FIELD_NUMBER: _ClassVar[int]
    NUM_PARTS_FIELD_NUMBER: _ClassVar[int]
    run_id: str
    path: str
    num_parts: int
    def __init__(self, run_id: _Optional[str] = ..., path: _Optional[str] = ..., num_parts: _Optional[int] = ...) -> None: ...

class PartEtag(_message.Message):
    __slots__ = ("part_number", "etag")
    PART_NUMBER_FIELD_NUMBER: _ClassVar[int]
    ETAG_FIELD_NUMBER: _ClassVar[int]
    part_number: int
    etag: str
    def __init__(self, part_number: _Optional[int] = ..., etag: _Optional[str] = ...) -> None: ...

class CompleteMultipartUpload(_message.Message):
    __slots__ = ("run_id", "path", "upload_id", "part_etags")
    class Response(_message.Message):
        __slots__ = ()
        def __init__(self) -> None: ...
    RUN_ID_FIELD_NUMBER: _ClassVar[int]
    PATH_FIELD_NUMBER: _ClassVar[int]
    UPLOAD_ID_FIELD_NUMBER: _ClassVar[int]
    PART_ETAGS_FIELD_NUMBER: _ClassVar[int]
    run_id: str
    path: str
    upload_id: str
    part_etags: _containers.RepeatedCompositeFieldContainer[PartEtag]
    def __init__(self, run_id: _Optional[str] = ..., path: _Optional[str] = ..., upload_id: _Optional[str] = ..., part_etags: _Optional[_Iterable[_Union[PartEtag, _Mapping]]] = ...) -> None: ...

class GetPresignedUploadPartUrl(_message.Message):
    __slots__ = ("run_id", "path", "upload_id", "part_number")
    class Response(_message.Message):
        __slots__ = ("upload_credential_info",)
        UPLOAD_CREDENTIAL_INFO_FIELD_NUMBER: _ClassVar[int]
        upload_credential_info: ArtifactCredentialInfo
        def __init__(self, upload_credential_info: _Optional[_Union[ArtifactCredentialInfo, _Mapping]] = ...) -> None: ...
    RUN_ID_FIELD_NUMBER: _ClassVar[int]
    PATH_FIELD_NUMBER: _ClassVar[int]
    UPLOAD_ID_FIELD_NUMBER: _ClassVar[int]
    PART_NUMBER_FIELD_NUMBER: _ClassVar[int]
    run_id: str
    path: str
    upload_id: str
    part_number: int
    def __init__(self, run_id: _Optional[str] = ..., path: _Optional[str] = ..., upload_id: _Optional[str] = ..., part_number: _Optional[int] = ...) -> None: ...

class GetCredentialsForTraceDataDownload(_message.Message):
    __slots__ = ("request_id",)
    class Response(_message.Message):
        __slots__ = ("credential_info",)
        CREDENTIAL_INFO_FIELD_NUMBER: _ClassVar[int]
        credential_info: ArtifactCredentialInfo
        def __init__(self, credential_info: _Optional[_Union[ArtifactCredentialInfo, _Mapping]] = ...) -> None: ...
    REQUEST_ID_FIELD_NUMBER: _ClassVar[int]
    request_id: str
    def __init__(self, request_id: _Optional[str] = ...) -> None: ...

class GetCredentialsForTraceDataUpload(_message.Message):
    __slots__ = ("request_id",)
    class Response(_message.Message):
        __slots__ = ("credential_info",)
        CREDENTIAL_INFO_FIELD_NUMBER: _ClassVar[int]
        credential_info: ArtifactCredentialInfo
        def __init__(self, credential_info: _Optional[_Union[ArtifactCredentialInfo, _Mapping]] = ...) -> None: ...
    REQUEST_ID_FIELD_NUMBER: _ClassVar[int]
    request_id: str
    def __init__(self, request_id: _Optional[str] = ...) -> None: ...

class GetCredentialsForLoggedModelUpload(_message.Message):
    __slots__ = ("model_id", "paths", "page_token")
    class Response(_message.Message):
        __slots__ = ("credentials", "next_page_token")
        CREDENTIALS_FIELD_NUMBER: _ClassVar[int]
        NEXT_PAGE_TOKEN_FIELD_NUMBER: _ClassVar[int]
        credentials: _containers.RepeatedCompositeFieldContainer[LoggedModelArtifactCredential]
        next_page_token: str
        def __init__(self, credentials: _Optional[_Iterable[_Union[LoggedModelArtifactCredential, _Mapping]]] = ..., next_page_token: _Optional[str] = ...) -> None: ...
    MODEL_ID_FIELD_NUMBER: _ClassVar[int]
    PATHS_FIELD_NUMBER: _ClassVar[int]
    PAGE_TOKEN_FIELD_NUMBER: _ClassVar[int]
    model_id: str
    paths: _containers.RepeatedScalarFieldContainer[str]
    page_token: str
    def __init__(self, model_id: _Optional[str] = ..., paths: _Optional[_Iterable[str]] = ..., page_token: _Optional[str] = ...) -> None: ...

class GetCredentialsForLoggedModelDownload(_message.Message):
    __slots__ = ("model_id", "paths", "page_token")
    class Response(_message.Message):
        __slots__ = ("credentials", "next_page_token")
        CREDENTIALS_FIELD_NUMBER: _ClassVar[int]
        NEXT_PAGE_TOKEN_FIELD_NUMBER: _ClassVar[int]
        credentials: _containers.RepeatedCompositeFieldContainer[LoggedModelArtifactCredential]
        next_page_token: str
        def __init__(self, credentials: _Optional[_Iterable[_Union[LoggedModelArtifactCredential, _Mapping]]] = ..., next_page_token: _Optional[str] = ...) -> None: ...
    MODEL_ID_FIELD_NUMBER: _ClassVar[int]
    PATHS_FIELD_NUMBER: _ClassVar[int]
    PAGE_TOKEN_FIELD_NUMBER: _ClassVar[int]
    model_id: str
    paths: _containers.RepeatedScalarFieldContainer[str]
    page_token: str
    def __init__(self, model_id: _Optional[str] = ..., paths: _Optional[_Iterable[str]] = ..., page_token: _Optional[str] = ...) -> None: ...

class DatabricksMlflowArtifactsService(_service.service): ...

class DatabricksMlflowArtifactsService_Stub(DatabricksMlflowArtifactsService): ...
```

--------------------------------------------------------------------------------

---[FILE: databricks_filesystem_service.proto]---
Location: mlflow-master/mlflow/protos/databricks_filesystem_service.proto

```proto
// Check Databricks Protobuf Style Guide (go/protostyleguide) about recommended Protobuf practices.
// See go/protostyleguide/syntax.
syntax = "proto2";

// See go/protostyleguide/packages.
package mlflow.filesystem;

import "databricks.proto";
import "scalapb/scalapb.proto";

option java_generate_equals_and_hash = true;
option java_package = "com.databricks.api.proto.filesystem";
option py_generic_services = true;
option (scalapb.options) = {flat_package: true};

service FilesystemService {
  // Only for internal usage for now. Endpoint and request format are to be finalized.
  rpc CreateDownloadUrl(CreateDownloadUrlRequest) returns (CreateDownloadUrlResponse) {
    option (rpc) = {
      endpoints: {
        method: "POST"
        path: "/fs/create-download-url"
        since: {
          major: 2
          minor: 0
        }
      }
      visibility: PUBLIC_UNDOCUMENTED
    };
  }

  rpc CreateUploadUrl(CreateUploadUrlRequest) returns (CreateUploadUrlResponse) {
    option (rpc) = {
      endpoints: {
        method: "POST"
        path: "/fs/create-upload-url"
        since: {
          major: 2
          minor: 0
        }
      }
      visibility: PUBLIC_UNDOCUMENTED
    };
  }
}

message HttpHeader {
  optional string name = 1;
  optional string value = 2;
}

message CreateDownloadUrlRequest {
  option (scalapb.message).extends = "com.databricks.rpc.RPC[CreateDownloadUrlResponse]";

  // The path to the file for which we would like a pre-signed download URL from which you may GET
  // the file's contents. This path can be an HDFS-style path starting with a scheme, or a
  // Unix-style absolute path. For example:
  // "dbfs:/Volumes/<catalog>/<schema>/<volume>/<path_to_file>" or
  // "/Volumes/<catalog>/<schema>/<volume>/<path_to_file>".
  optional string path = 1;
}

message CreateDownloadUrlResponse {
  option (scalapb.message).extends = "com.databricks.rpc.DoNotLogContents";
  // The pre-signed download URL which you may use to GET the specified file.
  //
  // To download the file, issue an HTTP GET request with the headers specified below
  // (see 'headers') and the body of the response should be the file's contents. If the file
  // does not exist or can't be accessed, you'll receive a cloud-service-provider-specific
  // error response.
  optional string url = 1;

  // These headers must be included in your HTTP request to the given 'url'. If all of the headers
  // are not included exactly, the behavior of the request is unspecified (most likely you will get
  // an error response).
  repeated HttpHeader headers = 2;
}

message CreateUploadUrlRequest {
  option (scalapb.message).extends = "com.databricks.rpc.RPC[CreateUploadUrlResponse]";

  // The path to the file for which we would like a pre-signed upload URL to which you may PUT
  // the file's contents. This path can be an HDFS-style path starting with a scheme, or a
  // Unix-style absolute path. For example:
  // "dbfs:/Volumes/<catalog>/<schema>/<volume>/<path_to_file>" or
  // "/Volumes/<catalog>/<schema>/<volume>/<path_to_file>".
  optional string path = 1;
}

message CreateUploadUrlResponse {
  option (scalapb.message).extends = "com.databricks.rpc.DoNotLogContents";

  // The pre-signed download URL which you may use to PUT the specified file's contents.
  //
  // To upload the file, issue an HTTP PUT request with the headers specified below, and with the
  // body of the request being the file contents you wish to upload.
  //
  // You must add the "Content-Length" header to your request with the value being the number of
  // bytes you are uploading. The maximum possible Content-Length depends on the cloud service
  // provider, but is at least 5GB.
  //
  // The headers include a "Content-Type" of "application/octet-stream". You must encode your file
  // contents in the request body as an octet-stream.
  //
  // You'll receive a cloud-service-provider-specific response.
  optional string url = 1;

  // These headers must be included in your HTTP request to the given 'url'. If all of the headers
  // are not included exactly, the behavior of the request is unspecified (most likely you will get
  // an error response).
  repeated HttpHeader headers = 2;
}

message DirectoryEntry {
  option (scalapb.message).extends = "com.databricks.rpc.DoNotLogContents";

  // The path of the file or directory.
  // Directories have a trailing slash.
  // Example 1: "/Volumes/catalog/schema/volume/directory/file.txt"
  // Example 2: "/Volumes/catalog/schema/volume/directory/"
  optional string path = 1;

  // True if the path is a directory.
  optional bool is_directory = 2;

  // The length of the file in bytes or null if the path is a directory.
  optional int64 file_size = 3;

  // Last modification time of given file/directory in milliseconds since the Unix Epoch.
  // NOTE: This field is not set for directories.
  optional int64 last_modified = 4;

  // Name of the file or directory.
  // There is no slash at the end of the directory names.
  // Example: "file.txt" or "mydirectory"
  optional string name = 5;
}

// The response structure for listing files with the /fs/directories endpoint.
message ListDirectoryResponse {
  option (scalapb.message).extends = "com.databricks.rpc.DoNotLogContents";

  // The files and directories in the specified path.
  // Note that a file and a directory can share the same path.
  repeated DirectoryEntry contents = 1;

  // A token that can be sent as `page_token` to retrieve the next page.
  // If this field is omitted, there are no subsequent pages.
  optional string next_page_token = 2;
}
```

--------------------------------------------------------------------------------

---[FILE: databricks_filesystem_service_pb2.py]---
Location: mlflow-master/mlflow/protos/databricks_filesystem_service_pb2.py

```python

import google.protobuf
from packaging.version import Version
if Version(google.protobuf.__version__).major >= 5:
  # -*- coding: utf-8 -*-
  # Generated by the protocol buffer compiler.  DO NOT EDIT!
  # source: databricks_filesystem_service.proto
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


  DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n#databricks_filesystem_service.proto\x12\x11mlflow.filesystem\x1a\x10\x64\x61tabricks.proto\x1a\x15scalapb/scalapb.proto\")\n\nHttpHeader\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\r\n\x05value\x18\x02 \x01(\t\"`\n\x18\x43reateDownloadUrlRequest\x12\x0c\n\x04path\x18\x01 \x01(\t:6\xe2?3\n1com.databricks.rpc.RPC[CreateDownloadUrlResponse]\"\x82\x01\n\x19\x43reateDownloadUrlResponse\x12\x0b\n\x03url\x18\x01 \x01(\t\x12.\n\x07headers\x18\x02 \x03(\x0b\x32\x1d.mlflow.filesystem.HttpHeader:(\xe2?%\n#com.databricks.rpc.DoNotLogContents\"\\\n\x16\x43reateUploadUrlRequest\x12\x0c\n\x04path\x18\x01 \x01(\t:4\xe2?1\n/com.databricks.rpc.RPC[CreateUploadUrlResponse]\"\x80\x01\n\x17\x43reateUploadUrlResponse\x12\x0b\n\x03url\x18\x01 \x01(\t\x12.\n\x07headers\x18\x02 \x03(\x0b\x32\x1d.mlflow.filesystem.HttpHeader:(\xe2?%\n#com.databricks.rpc.DoNotLogContents\"\x96\x01\n\x0e\x44irectoryEntry\x12\x0c\n\x04path\x18\x01 \x01(\t\x12\x14\n\x0cis_directory\x18\x02 \x01(\x08\x12\x11\n\tfile_size\x18\x03 \x01(\x03\x12\x15\n\rlast_modified\x18\x04 \x01(\x03\x12\x0c\n\x04name\x18\x05 \x01(\t:(\xe2?%\n#com.databricks.rpc.DoNotLogContents\"\x8f\x01\n\x15ListDirectoryResponse\x12\x33\n\x08\x63ontents\x18\x01 \x03(\x0b\x32!.mlflow.filesystem.DirectoryEntry\x12\x17\n\x0fnext_page_token\x18\x02 \x01(\t:(\xe2?%\n#com.databricks.rpc.DoNotLogContents2\xcb\x02\n\x11\x46ilesystemService\x12\x9d\x01\n\x11\x43reateDownloadUrl\x12+.mlflow.filesystem.CreateDownloadUrlRequest\x1a,.mlflow.filesystem.CreateDownloadUrlResponse\"-\xf2\x86\x19)\n%\n\x04POST\x12\x17/fs/create-download-url\x1a\x04\x08\x02\x10\x00\x10\x03\x12\x95\x01\n\x0f\x43reateUploadUrl\x12).mlflow.filesystem.CreateUploadUrlRequest\x1a*.mlflow.filesystem.CreateUploadUrlResponse\"+\xf2\x86\x19\'\n#\n\x04POST\x12\x15/fs/create-upload-url\x1a\x04\x08\x02\x10\x00\x10\x03\x42\x30\n#com.databricks.api.proto.filesystem\x90\x01\x01\xa0\x01\x01\xe2?\x02\x10\x01')

  _globals = globals()
  _builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
  _builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'databricks_filesystem_service_pb2', _globals)
  if not _descriptor._USE_C_DESCRIPTORS:
    _globals['DESCRIPTOR']._loaded_options = None
    _globals['DESCRIPTOR']._serialized_options = b'\n#com.databricks.api.proto.filesystem\220\001\001\240\001\001\342?\002\020\001'
    _globals['_CREATEDOWNLOADURLREQUEST']._loaded_options = None
    _globals['_CREATEDOWNLOADURLREQUEST']._serialized_options = b'\342?3\n1com.databricks.rpc.RPC[CreateDownloadUrlResponse]'
    _globals['_CREATEDOWNLOADURLRESPONSE']._loaded_options = None
    _globals['_CREATEDOWNLOADURLRESPONSE']._serialized_options = b'\342?%\n#com.databricks.rpc.DoNotLogContents'
    _globals['_CREATEUPLOADURLREQUEST']._loaded_options = None
    _globals['_CREATEUPLOADURLREQUEST']._serialized_options = b'\342?1\n/com.databricks.rpc.RPC[CreateUploadUrlResponse]'
    _globals['_CREATEUPLOADURLRESPONSE']._loaded_options = None
    _globals['_CREATEUPLOADURLRESPONSE']._serialized_options = b'\342?%\n#com.databricks.rpc.DoNotLogContents'
    _globals['_DIRECTORYENTRY']._loaded_options = None
    _globals['_DIRECTORYENTRY']._serialized_options = b'\342?%\n#com.databricks.rpc.DoNotLogContents'
    _globals['_LISTDIRECTORYRESPONSE']._loaded_options = None
    _globals['_LISTDIRECTORYRESPONSE']._serialized_options = b'\342?%\n#com.databricks.rpc.DoNotLogContents'
    _globals['_FILESYSTEMSERVICE'].methods_by_name['CreateDownloadUrl']._loaded_options = None
    _globals['_FILESYSTEMSERVICE'].methods_by_name['CreateDownloadUrl']._serialized_options = b'\362\206\031)\n%\n\004POST\022\027/fs/create-download-url\032\004\010\002\020\000\020\003'
    _globals['_FILESYSTEMSERVICE'].methods_by_name['CreateUploadUrl']._loaded_options = None
    _globals['_FILESYSTEMSERVICE'].methods_by_name['CreateUploadUrl']._serialized_options = b'\362\206\031\'\n#\n\004POST\022\025/fs/create-upload-url\032\004\010\002\020\000\020\003'
    _globals['_HTTPHEADER']._serialized_start=99
    _globals['_HTTPHEADER']._serialized_end=140
    _globals['_CREATEDOWNLOADURLREQUEST']._serialized_start=142
    _globals['_CREATEDOWNLOADURLREQUEST']._serialized_end=238
    _globals['_CREATEDOWNLOADURLRESPONSE']._serialized_start=241
    _globals['_CREATEDOWNLOADURLRESPONSE']._serialized_end=371
    _globals['_CREATEUPLOADURLREQUEST']._serialized_start=373
    _globals['_CREATEUPLOADURLREQUEST']._serialized_end=465
    _globals['_CREATEUPLOADURLRESPONSE']._serialized_start=468
    _globals['_CREATEUPLOADURLRESPONSE']._serialized_end=596
    _globals['_DIRECTORYENTRY']._serialized_start=599
    _globals['_DIRECTORYENTRY']._serialized_end=749
    _globals['_LISTDIRECTORYRESPONSE']._serialized_start=752
    _globals['_LISTDIRECTORYRESPONSE']._serialized_end=895
    _globals['_FILESYSTEMSERVICE']._serialized_start=898
    _globals['_FILESYSTEMSERVICE']._serialized_end=1229
  _builder.BuildServices(DESCRIPTOR, 'databricks_filesystem_service_pb2', _globals)
  # @@protoc_insertion_point(module_scope)

else:
  # -*- coding: utf-8 -*-
  # Generated by the protocol buffer compiler.  DO NOT EDIT!
  # source: databricks_filesystem_service.proto
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


  DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n#databricks_filesystem_service.proto\x12\x11mlflow.filesystem\x1a\x10\x64\x61tabricks.proto\x1a\x15scalapb/scalapb.proto\")\n\nHttpHeader\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\r\n\x05value\x18\x02 \x01(\t\"`\n\x18\x43reateDownloadUrlRequest\x12\x0c\n\x04path\x18\x01 \x01(\t:6\xe2?3\n1com.databricks.rpc.RPC[CreateDownloadUrlResponse]\"\x82\x01\n\x19\x43reateDownloadUrlResponse\x12\x0b\n\x03url\x18\x01 \x01(\t\x12.\n\x07headers\x18\x02 \x03(\x0b\x32\x1d.mlflow.filesystem.HttpHeader:(\xe2?%\n#com.databricks.rpc.DoNotLogContents\"\\\n\x16\x43reateUploadUrlRequest\x12\x0c\n\x04path\x18\x01 \x01(\t:4\xe2?1\n/com.databricks.rpc.RPC[CreateUploadUrlResponse]\"\x80\x01\n\x17\x43reateUploadUrlResponse\x12\x0b\n\x03url\x18\x01 \x01(\t\x12.\n\x07headers\x18\x02 \x03(\x0b\x32\x1d.mlflow.filesystem.HttpHeader:(\xe2?%\n#com.databricks.rpc.DoNotLogContents\"\x96\x01\n\x0e\x44irectoryEntry\x12\x0c\n\x04path\x18\x01 \x01(\t\x12\x14\n\x0cis_directory\x18\x02 \x01(\x08\x12\x11\n\tfile_size\x18\x03 \x01(\x03\x12\x15\n\rlast_modified\x18\x04 \x01(\x03\x12\x0c\n\x04name\x18\x05 \x01(\t:(\xe2?%\n#com.databricks.rpc.DoNotLogContents\"\x8f\x01\n\x15ListDirectoryResponse\x12\x33\n\x08\x63ontents\x18\x01 \x03(\x0b\x32!.mlflow.filesystem.DirectoryEntry\x12\x17\n\x0fnext_page_token\x18\x02 \x01(\t:(\xe2?%\n#com.databricks.rpc.DoNotLogContents2\xcb\x02\n\x11\x46ilesystemService\x12\x9d\x01\n\x11\x43reateDownloadUrl\x12+.mlflow.filesystem.CreateDownloadUrlRequest\x1a,.mlflow.filesystem.CreateDownloadUrlResponse\"-\xf2\x86\x19)\n%\n\x04POST\x12\x17/fs/create-download-url\x1a\x04\x08\x02\x10\x00\x10\x03\x12\x95\x01\n\x0f\x43reateUploadUrl\x12).mlflow.filesystem.CreateUploadUrlRequest\x1a*.mlflow.filesystem.CreateUploadUrlResponse\"+\xf2\x86\x19\'\n#\n\x04POST\x12\x15/fs/create-upload-url\x1a\x04\x08\x02\x10\x00\x10\x03\x42\x30\n#com.databricks.api.proto.filesystem\x90\x01\x01\xa0\x01\x01\xe2?\x02\x10\x01')



  _HTTPHEADER = DESCRIPTOR.message_types_by_name['HttpHeader']
  _CREATEDOWNLOADURLREQUEST = DESCRIPTOR.message_types_by_name['CreateDownloadUrlRequest']
  _CREATEDOWNLOADURLRESPONSE = DESCRIPTOR.message_types_by_name['CreateDownloadUrlResponse']
  _CREATEUPLOADURLREQUEST = DESCRIPTOR.message_types_by_name['CreateUploadUrlRequest']
  _CREATEUPLOADURLRESPONSE = DESCRIPTOR.message_types_by_name['CreateUploadUrlResponse']
  _DIRECTORYENTRY = DESCRIPTOR.message_types_by_name['DirectoryEntry']
  _LISTDIRECTORYRESPONSE = DESCRIPTOR.message_types_by_name['ListDirectoryResponse']
  HttpHeader = _reflection.GeneratedProtocolMessageType('HttpHeader', (_message.Message,), {
    'DESCRIPTOR' : _HTTPHEADER,
    '__module__' : 'databricks_filesystem_service_pb2'
    # @@protoc_insertion_point(class_scope:mlflow.filesystem.HttpHeader)
    })
  _sym_db.RegisterMessage(HttpHeader)

  CreateDownloadUrlRequest = _reflection.GeneratedProtocolMessageType('CreateDownloadUrlRequest', (_message.Message,), {
    'DESCRIPTOR' : _CREATEDOWNLOADURLREQUEST,
    '__module__' : 'databricks_filesystem_service_pb2'
    # @@protoc_insertion_point(class_scope:mlflow.filesystem.CreateDownloadUrlRequest)
    })
  _sym_db.RegisterMessage(CreateDownloadUrlRequest)

  CreateDownloadUrlResponse = _reflection.GeneratedProtocolMessageType('CreateDownloadUrlResponse', (_message.Message,), {
    'DESCRIPTOR' : _CREATEDOWNLOADURLRESPONSE,
    '__module__' : 'databricks_filesystem_service_pb2'
    # @@protoc_insertion_point(class_scope:mlflow.filesystem.CreateDownloadUrlResponse)
    })
  _sym_db.RegisterMessage(CreateDownloadUrlResponse)

  CreateUploadUrlRequest = _reflection.GeneratedProtocolMessageType('CreateUploadUrlRequest', (_message.Message,), {
    'DESCRIPTOR' : _CREATEUPLOADURLREQUEST,
    '__module__' : 'databricks_filesystem_service_pb2'
    # @@protoc_insertion_point(class_scope:mlflow.filesystem.CreateUploadUrlRequest)
    })
  _sym_db.RegisterMessage(CreateUploadUrlRequest)

  CreateUploadUrlResponse = _reflection.GeneratedProtocolMessageType('CreateUploadUrlResponse', (_message.Message,), {
    'DESCRIPTOR' : _CREATEUPLOADURLRESPONSE,
    '__module__' : 'databricks_filesystem_service_pb2'
    # @@protoc_insertion_point(class_scope:mlflow.filesystem.CreateUploadUrlResponse)
    })
  _sym_db.RegisterMessage(CreateUploadUrlResponse)

  DirectoryEntry = _reflection.GeneratedProtocolMessageType('DirectoryEntry', (_message.Message,), {
    'DESCRIPTOR' : _DIRECTORYENTRY,
    '__module__' : 'databricks_filesystem_service_pb2'
    # @@protoc_insertion_point(class_scope:mlflow.filesystem.DirectoryEntry)
    })
  _sym_db.RegisterMessage(DirectoryEntry)

  ListDirectoryResponse = _reflection.GeneratedProtocolMessageType('ListDirectoryResponse', (_message.Message,), {
    'DESCRIPTOR' : _LISTDIRECTORYRESPONSE,
    '__module__' : 'databricks_filesystem_service_pb2'
    # @@protoc_insertion_point(class_scope:mlflow.filesystem.ListDirectoryResponse)
    })
  _sym_db.RegisterMessage(ListDirectoryResponse)

  _FILESYSTEMSERVICE = DESCRIPTOR.services_by_name['FilesystemService']
  if _descriptor._USE_C_DESCRIPTORS == False:

    DESCRIPTOR._options = None
    DESCRIPTOR._serialized_options = b'\n#com.databricks.api.proto.filesystem\220\001\001\240\001\001\342?\002\020\001'
    _CREATEDOWNLOADURLREQUEST._options = None
    _CREATEDOWNLOADURLREQUEST._serialized_options = b'\342?3\n1com.databricks.rpc.RPC[CreateDownloadUrlResponse]'
    _CREATEDOWNLOADURLRESPONSE._options = None
    _CREATEDOWNLOADURLRESPONSE._serialized_options = b'\342?%\n#com.databricks.rpc.DoNotLogContents'
    _CREATEUPLOADURLREQUEST._options = None
    _CREATEUPLOADURLREQUEST._serialized_options = b'\342?1\n/com.databricks.rpc.RPC[CreateUploadUrlResponse]'
    _CREATEUPLOADURLRESPONSE._options = None
    _CREATEUPLOADURLRESPONSE._serialized_options = b'\342?%\n#com.databricks.rpc.DoNotLogContents'
    _DIRECTORYENTRY._options = None
    _DIRECTORYENTRY._serialized_options = b'\342?%\n#com.databricks.rpc.DoNotLogContents'
    _LISTDIRECTORYRESPONSE._options = None
    _LISTDIRECTORYRESPONSE._serialized_options = b'\342?%\n#com.databricks.rpc.DoNotLogContents'
    _FILESYSTEMSERVICE.methods_by_name['CreateDownloadUrl']._options = None
    _FILESYSTEMSERVICE.methods_by_name['CreateDownloadUrl']._serialized_options = b'\362\206\031)\n%\n\004POST\022\027/fs/create-download-url\032\004\010\002\020\000\020\003'
    _FILESYSTEMSERVICE.methods_by_name['CreateUploadUrl']._options = None
    _FILESYSTEMSERVICE.methods_by_name['CreateUploadUrl']._serialized_options = b'\362\206\031\'\n#\n\004POST\022\025/fs/create-upload-url\032\004\010\002\020\000\020\003'
    _HTTPHEADER._serialized_start=99
    _HTTPHEADER._serialized_end=140
    _CREATEDOWNLOADURLREQUEST._serialized_start=142
    _CREATEDOWNLOADURLREQUEST._serialized_end=238
    _CREATEDOWNLOADURLRESPONSE._serialized_start=241
    _CREATEDOWNLOADURLRESPONSE._serialized_end=371
    _CREATEUPLOADURLREQUEST._serialized_start=373
    _CREATEUPLOADURLREQUEST._serialized_end=465
    _CREATEUPLOADURLRESPONSE._serialized_start=468
    _CREATEUPLOADURLRESPONSE._serialized_end=596
    _DIRECTORYENTRY._serialized_start=599
    _DIRECTORYENTRY._serialized_end=749
    _LISTDIRECTORYRESPONSE._serialized_start=752
    _LISTDIRECTORYRESPONSE._serialized_end=895
    _FILESYSTEMSERVICE._serialized_start=898
    _FILESYSTEMSERVICE._serialized_end=1229
  FilesystemService = service_reflection.GeneratedServiceType('FilesystemService', (_service.Service,), dict(
    DESCRIPTOR = _FILESYSTEMSERVICE,
    __module__ = 'databricks_filesystem_service_pb2'
    ))

  FilesystemService_Stub = service_reflection.GeneratedServiceStubType('FilesystemService_Stub', (FilesystemService,), dict(
    DESCRIPTOR = _FILESYSTEMSERVICE,
    __module__ = 'databricks_filesystem_service_pb2'
    ))


  # @@protoc_insertion_point(module_scope)
```

--------------------------------------------------------------------------------

---[FILE: databricks_filesystem_service_pb2.pyi]---
Location: mlflow-master/mlflow/protos/databricks_filesystem_service_pb2.pyi

```text
import databricks_pb2 as _databricks_pb2
from scalapb import scalapb_pb2 as _scalapb_pb2
from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import service as _service
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Mapping as _Mapping, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class HttpHeader(_message.Message):
    __slots__ = ("name", "value")
    NAME_FIELD_NUMBER: _ClassVar[int]
    VALUE_FIELD_NUMBER: _ClassVar[int]
    name: str
    value: str
    def __init__(self, name: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...

class CreateDownloadUrlRequest(_message.Message):
    __slots__ = ("path",)
    PATH_FIELD_NUMBER: _ClassVar[int]
    path: str
    def __init__(self, path: _Optional[str] = ...) -> None: ...

class CreateDownloadUrlResponse(_message.Message):
    __slots__ = ("url", "headers")
    URL_FIELD_NUMBER: _ClassVar[int]
    HEADERS_FIELD_NUMBER: _ClassVar[int]
    url: str
    headers: _containers.RepeatedCompositeFieldContainer[HttpHeader]
    def __init__(self, url: _Optional[str] = ..., headers: _Optional[_Iterable[_Union[HttpHeader, _Mapping]]] = ...) -> None: ...

class CreateUploadUrlRequest(_message.Message):
    __slots__ = ("path",)
    PATH_FIELD_NUMBER: _ClassVar[int]
    path: str
    def __init__(self, path: _Optional[str] = ...) -> None: ...

class CreateUploadUrlResponse(_message.Message):
    __slots__ = ("url", "headers")
    URL_FIELD_NUMBER: _ClassVar[int]
    HEADERS_FIELD_NUMBER: _ClassVar[int]
    url: str
    headers: _containers.RepeatedCompositeFieldContainer[HttpHeader]
    def __init__(self, url: _Optional[str] = ..., headers: _Optional[_Iterable[_Union[HttpHeader, _Mapping]]] = ...) -> None: ...

class DirectoryEntry(_message.Message):
    __slots__ = ("path", "is_directory", "file_size", "last_modified", "name")
    PATH_FIELD_NUMBER: _ClassVar[int]
    IS_DIRECTORY_FIELD_NUMBER: _ClassVar[int]
    FILE_SIZE_FIELD_NUMBER: _ClassVar[int]
    LAST_MODIFIED_FIELD_NUMBER: _ClassVar[int]
    NAME_FIELD_NUMBER: _ClassVar[int]
    path: str
    is_directory: bool
    file_size: int
    last_modified: int
    name: str
    def __init__(self, path: _Optional[str] = ..., is_directory: bool = ..., file_size: _Optional[int] = ..., last_modified: _Optional[int] = ..., name: _Optional[str] = ...) -> None: ...

class ListDirectoryResponse(_message.Message):
    __slots__ = ("contents", "next_page_token")
    CONTENTS_FIELD_NUMBER: _ClassVar[int]
    NEXT_PAGE_TOKEN_FIELD_NUMBER: _ClassVar[int]
    contents: _containers.RepeatedCompositeFieldContainer[DirectoryEntry]
    next_page_token: str
    def __init__(self, contents: _Optional[_Iterable[_Union[DirectoryEntry, _Mapping]]] = ..., next_page_token: _Optional[str] = ...) -> None: ...

class FilesystemService(_service.service): ...

class FilesystemService_Stub(FilesystemService): ...
```

--------------------------------------------------------------------------------

---[FILE: databricks_managed_catalog_messages.proto]---
Location: mlflow-master/mlflow/protos/databricks_managed_catalog_messages.proto

```proto
syntax = "proto2";

package mlflow.managedcatalog;

import "scalapb/scalapb.proto";

option java_generate_equals_and_hash = true;
option java_package = "com.databricks.api.proto.managedcatalog";
option (scalapb.options) = {flat_package: true};

message TableInfo {
  // Output-only fields (modified to include only what mlflow needs):

  // [Create,Update:IGN BROWSABLE] Full name of Table, in form of <catalog_name>.<schema_name>.<table_name>
  optional string full_name = 15;
  // [Create,Update:IGN] Id of the table.
  optional string table_id = 22;
}

message GetTable {
  // Required. Full name of the Table (from URL).
  optional string full_name_arg = 1;

  // Optional. Whether to omit the columns of the table from the response or not.
  optional bool omit_columns = 5;

  // Optional. Whether to omit the properties of the table from the response or not.
  optional bool omit_properties = 6;

  // Optional. Whether to omit the constraints of the table from the response or not.
  optional bool omit_constraints = 7;

  // Optional. Whether to omit the dependencies of the table from the response or not.
  optional bool omit_dependencies = 8;

  // Optional. Whether to get usernames in response, including owner, created_by, updated_by.
  optional bool omit_username = 11;

  // Optional. Whether to omit the storage credential name of tables from the response or not.
  optional bool omit_storage_credential_name = 12;
}

message GetTableResponse {
  // Output-only fields (modified to include only what mlflow needs):

  // [Create,Update:IGN BROWSABLE] Full name of Table, in form of <catalog_name>.<schema_name>.<table_name>
  optional string full_name = 15;
  // [Create,Update:IGN] Id of the table.
  optional string table_id = 22;
}
```

--------------------------------------------------------------------------------

````
