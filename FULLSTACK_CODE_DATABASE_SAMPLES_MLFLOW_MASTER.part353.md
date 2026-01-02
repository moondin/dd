---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 353
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 353 of 991)

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

---[FILE: databricks.proto]---
Location: mlflow-master/mlflow/protos/databricks.proto

```proto
syntax = "proto2";

package mlflow;

import "google/protobuf/descriptor.proto";
import "scalapb/scalapb.proto";

option java_package = "com.databricks.api.proto.databricks";
option (scalapb.options).flat_package = true;

// Note: 51310 is the beginning of the range of proto extension values for use by applications.
extend google.protobuf.FieldOptions {
  // Indicates an overriding visibility for this field. This can only reduce the visibility;
  // a public field in an internal API will not have an effect.
  optional Visibility visibility = 51310;

  // This annotation indicates that certain fields must be supplied for the request to be carried
  // out successfully.
  // A request field may go from being required to optional over time, but a field may not
  // go from being optional to required, for backwards compatiblity reasons.
  // Request RPCs are validated automatically prior to processing for required fields, but
  // returned values are not validated in any way.
  optional bool validate_required = 51311;

  // Causes the fields within the tagged Message to be inlined into this Message, for the purposes
  // of our JSON API.
  // For example, rather than serializing
  //   {
  //     "attrs" : {
  //       "cluster_name" : "Foo"
  //     }
  //   }
  // If "attrs" were marked json_inline, we would upgrade cluster_name to a top-level field:
  //   {
  //     "cluster_name" : "Foo"
  //   }
  // Note that this is only applicable to singular Message fields.
  optional bool json_inline = 51312;

  // Causes a field which conceptually represents a Map to be serialized as a JSON Map.
  // The given field must be a Message with exactly 2 fields called "key" and "value", where key
  // must be a string.
  // For example, rather than serializing
  //   [ { "key" : "spark.speculation", "value" : "false" } ]
  // If this field were marked json_map, we would serialize it as
  //   { "spark.speculation" : "false" }
  optional bool json_map = 51313;

  // The documentation meta data for this field. This gets added automatically when the proto is
  // parsed.
  // There are as many doc blocks as visibility levels.
  // This is not meant to be crafted by hand; this will be automatically generated when parsing
  // the proto file.
  repeated DocumentationMetadata field_doc = 51314;
}

// Defines the set of options declared for every service RPC which are used to
// direct RPCs to endpoints, as well as other metadata about the RPC.
message DatabricksRpcOptions {
  repeated HttpEndpoint endpoints = 1;

  // Indicates which users are allowed to initiate this RPC.
  optional Visibility visibility = 2;

  // Complete definition of all error codes (from a statically defined set) which this method
  // may return.
  repeated ErrorCode error_codes = 3;

  // If defined, a rate limit will be applied to this RPC for all requests from the API proxy.
  optional RateLimit rate_limit = 4;

  // If defined, overrides the default title used for in the API docs. See ProtobufDocGenerator
  // for more info.
  optional string rpc_doc_title = 5;
}

// Defines the set of options needed for autogenerating graphql modules.
// Will add more fields (batch loader, renaming) later.
// Empty for now. The rpc will be visible for graphql module autogeneration if this field is set.
message DatabricksGraphqlOptions {}

// Note: 51310 is the beginning of the range of proto extension values for use by applications.
extend google.protobuf.MethodOptions {
  optional DatabricksRpcOptions rpc = 51310;

  // The documentation metadata.
  // This is not meant to be crafted by hand; this will be automatically generated when parsing
  // the proto file.
  repeated DocumentationMetadata method_doc = 51314; // Same id everywhere

  // If this is set, this rpc will be visible for graphql module autogeneration.
  optional DatabricksGraphqlOptions graphql = 51399;
}

// Note: 51310 is the beginning of the range of proto extension values for use by applications.
extend google.protobuf.MessageOptions {
  // The documentation metadata.
  // This is not meant to be crafted by hand; this will be automatically generated when parsing
  // the proto file.
  repeated DocumentationMetadata message_doc = 51314; // Same id everywhere
}

// Note: 51310 is the beginning of the range of proto extension values for use by applications.
extend google.protobuf.ServiceOptions {
  // The documentation metadata.
  // This is not meant to be crafted by hand; this will be automatically generated when parsing
  // the proto file.
  repeated DocumentationMetadata service_doc = 51314; // Same id everywhere
}

// Note: 51310 is the beginning of the range of proto extension values for use by applications.
extend google.protobuf.EnumOptions {
  // The documentation metadata.
  // This is not meant to be crafted by hand; this will be automatically generated when parsing
  // the proto file.
  repeated DocumentationMetadata enum_doc = 51314; // Same id everywhere
}

// Note: 51310 is the beginning of the range of proto extension values for use by applications.
extend google.protobuf.EnumValueOptions {
  // Indicates an overriding visibility for this field. This can only reduce the visibility;
  // a public field in an internal API will not have an effect.
  optional Visibility enum_value_visibility = 51310;
  // The documentation metadata.
  // This is not meant to be crafted by hand; this will be automatically generated when parsing
  // the proto file.
  repeated DocumentationMetadata enum_value_doc = 51314; // Same id everywhere
}

message HttpEndpoint {
  // HTTP method like POST or GET.
  optional string method = 1 [default = "POST"];

  // Conceptual path of the API, like "/clusters" or "/clusters/create". Should start with a slash.
  optional string path = 2;

  // A version like 1.1 which is prepended to the URL (e.g., GET /1.1/clusters).
  // Breaking changes to an RPC must use a different version number.
  optional ApiVersion since = 3;
}

message ApiVersion {
  optional int32 major = 1;
  optional int32 minor = 2;
}

// API rate limits applied to RPCs coming from the API Proxy. The rate limits are applied on a
// per organization basis.
message RateLimit {
  // The maximum burst of API requests allowed for a single endpoint. In the context of the
  // token bucket algorithm, this constant represents the total capacity of the token bucket.
  optional int64 max_burst = 1;

  // The maximum sustained request per second limit for a single endpoint. In the context of the,
  // token bucket algorithm, this constant represents the rate at which the token bucket fills.
  optional int64 max_sustained_per_second = 2;
}

// Visibility defines who is allowed to use the RPC.
enum Visibility {
  // Public indicates visible to both external and internal customers.
  PUBLIC = 1;

  // Internal is only available to Databricks-internal clients.
  INTERNAL = 2;

  // Public-undocumented are accessible via public endpoints, but not documented. This is useful
  // for internal clients that depend on public endpoints (e.g. workflows running in the driver).
  PUBLIC_UNDOCUMENTED = 3;
}

// A block of documentation that is added to the AST after parsing the original protocol buffer.
message DocumentationMetadata {
  // The string of documentation attached to this particular item.
  optional string docstring = 1;
  // The string of documentation that is *before* this item. This only makes sense for top-level
  // items such as (top-level) messages, (top-level) enumerations, or services. In all other
  // cases, this string is empty.
  optional string lead_doc = 2;
  // The visibility level when the docstring was generated.
  // The documentation extractor builds multiple versions of the documentation, one for each
  // visibility level. The documentation is then generated for each visibility level.
  optional Visibility visibility = 3;
  // The original proto path in the internal representation. This is useful when performing field
  // flattening to figure out what the original field was.
  // One example is ["jobs","Run","original_attempt_run_id"] for jobs.
  // This path is unique.
  repeated string original_proto_path = 4;
  // The location (line number) of the start of the documentation. This is required to keep the
  // pieces of documentation sorted.
  optional int32 position = 5;
}

enum ErrorCode {
  // Internal error. This means that some invariants expected by the underlying system have been
  // broken. This error code is reserved for serious errors, which generally cannot be resolved
  // by the user.
  //
  // Prefer this over all kinds of detailed error messages (e.g IO_ERROR), unless there's some
  // automation that relies on the custom error code.
  //
  // Maps to:
  // - google.rpc.Code: INTERNAL = 13;
  // - HTTP code: 500 Internal Server Error
  INTERNAL_ERROR = 1;

  // The service is currently unavailable. This is most likely a transient condition, which can be
  // corrected by retrying with a backoff. Note that it is not always safe to retrynon-idempotent
  // operations.
  //
  // Prefer this over SERVICE_UNDER_MAINTENANCE, WORKSPACE_TEMPORARILY_UNAVAILABLE.
  //
  // Maps to:
  // - google.rpc.Code: UNAVAILABLE = 14;
  // - HTTP code: 503 Service Unavailable
  TEMPORARILY_UNAVAILABLE = 2;

  // Indicates that an IOException has been internally thrown.
  IO_ERROR = 3;

  // The request is invalid. Prefer more specific error code whenever possible.
  // Also see similar recommendation for the google.rpc.Code.FAILED_PRECONDITION.
  //
  // Prefer this error code over MALFORMED_REQUEST, INVALID_STATE, UNPARSEABLE_HTTP_ERROR.
  //
  // Maps to:
  // - google.rpc.Code: FAILED_PRECONDITION = 9;
  // - HTTP code: 400 Bad Request
  BAD_REQUEST = 4;

  // An external service is unavailable temporarily as it is being updated/re-deployed. Indicates
  // gateway proxy to safely retry the request.
  SERVICE_UNDER_MAINTENANCE = 5;

  // A workspace is temporarily unavailable as the workspace is being re-assigned.
  WORKSPACE_TEMPORARILY_UNAVAILABLE = 6;

  // The deadline expired before the operation could complete. For operations that change the state
  // of the system, this error may be returned even if the operation has completed successfully.
  // For example, a successful response from a server could have been delayed long enough for
  // the deadline to expire. When possible - implementations should make sure further processing of
  // the request is aborted, e.g. by throwing an exception instead of making the RPC request,
  // making the database query, etc.
  //
  // Maps to:
  // - google.rpc.Code: DEADLINE_EXCEEDED = 4;
  // - HTTP code: 504 Gateway Timeout
  DEADLINE_EXCEEDED = 7;

  // The operation was canceled by the caller. An example - client closed the connection without
  // waiting for a response.
  //
  // Maps to:
  // - google.rpc.Code: CANCELLED = 1;
  // - HTTP code: 499 Client Closed Request
  CANCELLED = 8;

  // Operation is rejected due to throttling, e.g. some resource has been exhausted, per-user quota
  // triggered, or the entire file system is out of space.
  //
  // Maps to:
  // - google.rpc.Code: RESOURCE_EXHAUSTED = 8;
  // - HTTP code: 429 Too Many Requests
  RESOURCE_EXHAUSTED = 9;

  // The operation was aborted, typically due to a concurrency issue such as a sequencer
  // check failure, transaction abort, or transaction conflict.
  //
  // Maps to:
  // - google.rpc.Code: ABORTED = 10;
  // - HTTP code: 409 Conflict
  ABORTED = 10;

  // Operation was performed on a resource that does not exist,
  // e.g. file or directory was not found.
  //
  // Maps to:
  // - google.rpc.Code: NOT_FOUND = 5;
  // - HTTP code: 404 Not Found
  NOT_FOUND = 11;

  // Operation was rejected due a conflict with an existing resource, e.g. attempted to create
  // file or directory that already exists.
  //
  // Prefer this over RESOURCE_CONFLICT.
  //
  // Maps to:
  // - google.rpc.Code: ALREADY_EXISTS = 6;
  // - HTTP code: 409 Conflict
  ALREADY_EXISTS = 12;

  // The request does not have valid authentication (AuthN) credentials for the operation.
  //
  // Prefer this over CUSTOMER_UNAUTHORIZED, unless you need to keep consistent behavior with legacy
  // code.
  // For authorization (AuthZ) errors use PERMISSION_DENIED.
  //
  // Maps to:
  // - google.rpc.Code: UNAUTHENTICATED = 16;
  // - HTTP code: 401 Unauthorized
  UNAUTHENTICATED = 13;

  //
  // Common application-level error codes, which were caused by the user input but may be returned
  // by multiple services.
  //

  // Supplied value for a parameter was invalid (e.g., giving a number for a string parameter).
  //
  // Maps to:
  // - google.rpc.Code: INVALID_ARGUMENT = 3;
  // - HTTP code: 400 Bad Request
  INVALID_PARAMETER_VALUE = 1000;

  // Indicates that the given API endpoint does not exist. Legacy, when possible - NOT_IMPLEMENTED
  // should be used instead to indicate that API doesn't exist.
  //
  // Maps to:
  // - google.rpc.Code: NOT_FOUND = 5;
  // - HTTP code: 404 Not Found
  ENDPOINT_NOT_FOUND = 1001;

  // Indicates that the given API request was malformed.
  MALFORMED_REQUEST = 1002;

  // If one or more of the inputs to a given RPC are not in a valid state for the action.
  INVALID_STATE = 1003;

  // The caller does not have permission to execute the specified operation.
  // PERMISSION_DENIED must not be used for rejections caused by exhausting some resource,
  // use RESOURCE_EXHAUSTED instead for those errors.
  // PERMISSION_DENIED must not be used if the caller can not be identified,
  // use CUSTOMER_UNAUTHORIZED instead for those errors.
  // This error code does not imply the request is valid or the requested entity exists or
  // satisfies other pre-conditions.
  //
  // Maps to:
  // - google.rpc.Code: PERMISSION_DENIED = 7;
  // - HTTP code: 403 Forbidden
  PERMISSION_DENIED = 1004;

  // If a given user/entity is trying to use a feature which has been disabled.
  //
  // Maps to:
  // - google.rpc.Code: NOT_FOUND = 5;
  // - HTTP code: 404 Not Found
  FEATURE_DISABLED = 1005;

  // The request does not have valid authentication (AuthN) credentials for the operation.
  //
  // For authentication (AuthN) errors prefer using UNAUTHENTICATED, unless you need to keep
  // consistent behavior with legacy code.
  // For authorization (AuthZ) errors use PERMISSION_DENIED.
  //
  // Important: name is confusing, this error code is for authentication (AuthN) errors, not
  // authorization (AuthZ) errors. It maps to 401 Unauthorized and suffers from the same confusing
  // naming. See https://datatracker.ietf.org/doc/html/rfc7235#section-3.1 - "[...] status code
  // indicates that the request has not been applied because it lacks valid authentication
  // credentials for the target resource. [...] If the request included authentication credentials,
  // then the 401 response indicates that authorization has been refused for those credentials."
  //
  // Also, see https://stackoverflow.com/a/6937030/16352922, it covers it pretty well.
  //
  // Maps to:
  // - google.rpc.Code: UNAUTHENTICATED = 16;
  // - HTTP code: 401 Unauthorized
  CUSTOMER_UNAUTHORIZED = 1006;

  // If the API request is rejected due to throttling.
  // Prefer a more generic RESOURCE_EXHAUSTED for the new use cases.
  //
  // Maps to:
  // - google.rpc.Code: RESOURCE_EXHAUSTED = 8;
  // - HTTP code: 429 Too Many Requests
  REQUEST_LIMIT_EXCEEDED = 1007;

  // Indicates API request was rejected due a conflict with an existing resource.
  RESOURCE_CONFLICT = 1008;

  // Indicates that the HTTP response cannot be correctly deserialized.
  // This currently is only used in DUST test clients, and not by any real service code.
  UNPARSEABLE_HTTP_ERROR = 1009;

  // The operation is not implemented or is not supported/enabled in this service.
  //
  // Maps to:
  // - google.rpc.Code: UNIMPLEMENTED = 12;
  // - HTTP code: 501 Not Implemented
  NOT_IMPLEMENTED = 1010;

  // Unrecoverable data loss or corruption.
  //
  // One of the major use cases is to indicate that server failed to validate the integrity of
  // the request. This error can occur when the checksum specified in the `X-Databricks-Checksum`
  // request header (or trailer) doesn't match the actual request content checksum.
  //
  // Note, in case of the severe corruption that results in a malformed request, the server may
  // send a generic `400 Bad Request` response rather than sending this error code.
  //
  // Maps to:
  // - google.rpc.Code: DATA_LOSS = 15;
  // - HTTP code: 500 Internal Server Error
  DATA_LOSS = 1011;

  ///////////
  // VAULT //
  ///////////

  // If the user attempts to perform an invalid state transition on a shard.
  INVALID_STATE_TRANSITION = 2001;

  // Unable to perform the operation because the shard was locked by some other operation.
  COULD_NOT_ACQUIRE_LOCK = 2002;

  ///////////////
  // EXECUTION //
  ///////////////

  // Operation was performed on a resource that already exists.
  //
  // Prefer using ALREADY_EXISTS. Unlike ALREADY_EXISTS - this maps to HTTP code
  // 500 Internal Server Error due to legacy reasons, remapping will be a backwards incompatible
  // change.
  RESOURCE_ALREADY_EXISTS = 3001;

  // Operation was performed on a resource that does not exist.
  //
  // Prefer using NOT_FOUND - see the note for the RESOURCE_ALREADY_EXISTS, because this pair of
  // codes is related and RESOURCE_ALREADY_EXISTS has bad mapping to the HTTP codes we added
  // new error codes NOT_FOUND and ALREADY_EXISTS, and recommend to use them instead.
  RESOURCE_DOES_NOT_EXIST = 3002;

  ///////////
  // DBFS ///
  ///////////

  QUOTA_EXCEEDED = 4001;

  MAX_BLOCK_SIZE_EXCEEDED = 4002;

  MAX_READ_SIZE_EXCEEDED = 4003;

  PARTIAL_DELETE = 4004;

  MAX_LIST_SIZE_EXCEEDED = 4005;

  //////////////
  // CLUSTERS //
  //////////////

  DRY_RUN_FAILED = 5001;

  // Cluster request was rejected because it would exceed a resource limit.
  RESOURCE_LIMIT_EXCEEDED = 5002;

  //////////////
  // WORKSPACE //
  //////////////

  DIRECTORY_NOT_EMPTY = 6001;

  DIRECTORY_PROTECTED = 6002;

  MAX_NOTEBOOK_SIZE_EXCEEDED = 6003;

  MAX_CHILD_NODE_SIZE_EXCEEDED = 6004;

  //////////////////////
  // WORKSPACE SEARCH //
  //////////////////////

  SEARCH_QUERY_TOO_LONG = 6100;

  SEARCH_QUERY_TOO_SHORT = 6101;

  /////////
  // AAD //
  /////////

  MANAGED_RESOURCE_GROUP_DOES_NOT_EXIST = 7001;

  PERMISSION_NOT_PROPAGATED = 7002;

  DEPLOYMENT_TIMEOUT = 7003;

  //////////////
  // PROJECTS //
  //////////////

  GIT_CONFLICT = 8001;

  GIT_UNKNOWN_REF = 8002;

  GIT_SENSITIVE_TOKEN_DETECTED = 8003;

  GIT_URL_NOT_ON_ALLOW_LIST = 8004;

  GIT_REMOTE_ERROR = 8005;

  PROJECTS_OPERATION_TIMEOUT = 8006;

  IPYNB_FILE_IN_REPO = 8007;

  /////////////////
  // Partner Hub //
  /////////////////

  INSECURE_PARTNER_RESPONSE = 8100;

  MALFORMED_PARTNER_RESPONSE = 8101;

  ///////////////////
  // UNITY CATALOG //
  ///////////////////

  METASTORE_DOES_NOT_EXIST = 9000;

  DAC_DOES_NOT_EXIST = 9001;

  CATALOG_DOES_NOT_EXIST = 9002;

  SCHEMA_DOES_NOT_EXIST = 9003;

  TABLE_DOES_NOT_EXIST = 9004;

  SHARE_DOES_NOT_EXIST = 9005;

  RECIPIENT_DOES_NOT_EXIST = 9006;

  STORAGE_CREDENTIAL_DOES_NOT_EXIST = 9007;

  EXTERNAL_LOCATION_DOES_NOT_EXIST = 9008;

  PRINCIPAL_DOES_NOT_EXIST = 9009;

  PROVIDER_DOES_NOT_EXIST = 9010;

  METASTORE_ALREADY_EXISTS = 9020;

  DAC_ALREADY_EXISTS = 9021;

  CATALOG_ALREADY_EXISTS = 9022;

  SCHEMA_ALREADY_EXISTS = 9023;

  TABLE_ALREADY_EXISTS = 9024;

  SHARE_ALREADY_EXISTS = 9025;

  RECIPIENT_ALREADY_EXISTS = 9026;

  STORAGE_CREDENTIAL_ALREADY_EXISTS = 9027;

  EXTERNAL_LOCATION_ALREADY_EXISTS = 9028;

  PROVIDER_ALREADY_EXISTS = 9029;

  CATALOG_NOT_EMPTY = 9040;

  SCHEMA_NOT_EMPTY = 9041;

  METASTORE_NOT_EMPTY = 9042;

  PROVIDER_SHARE_NOT_ACCESSIBLE = 9060;
}
```

--------------------------------------------------------------------------------

---[FILE: databricks_artifacts.proto]---
Location: mlflow-master/mlflow/protos/databricks_artifacts.proto

```proto
syntax = "proto2";

package mlflow;

import "databricks.proto";
import "scalapb/scalapb.proto";

option java_generate_equals_and_hash = true;
option java_package = "com.databricks.api.proto.mlflow";
option py_generic_services = true;
option (scalapb.options) = {flat_package: true};

service DatabricksMlflowArtifactsService {
  // Fetch credentials to read from the specified MLflow artifact location
  //
  // Note: Even if no artifacts exist at the specified artifact location, this API will
  // still provide read credentials as long as the format of the location is valid.
  // Callers must subsequently check for the existence of the artifacts using the appropriate
  // cloud storage APIs (as determined by the `ArtifactCredentialType` property of the response)
  rpc getCredentialsForRead(GetCredentialsForRead) returns (GetCredentialsForRead.Response) {
    option (rpc) = {
      endpoints: [
        {
          method: "POST"
          path: "/mlflow/artifacts/credentials-for-read"
          since: {
            major: 2
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
    };
  }

  // Fetch credentials to write to the specified MLflow artifact location
  rpc getCredentialsForWrite(GetCredentialsForWrite) returns (GetCredentialsForWrite.Response) {
    option (rpc) = {
      endpoints: [
        {
          method: "POST"
          path: "/mlflow/artifacts/credentials-for-write"
          since: {
            major: 2
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
    };
  }

  // Initiate a multipart upload and return presinged URLs for uploading parts and aborting the
  // initiated multipart upload.
  rpc createMultipartUpload(CreateMultipartUpload) returns (CreateMultipartUpload.Response) {
    option (rpc) = {
      endpoints: [
        {
          method: "POST"
          path: "/mlflow/artifacts/create-multipart-upload"
          since: {
            major: 2
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
    };
  }

  // Complete a multipart upload
  rpc completeMultipartUpload(CompleteMultipartUpload) returns (CompleteMultipartUpload.Response) {
    option (rpc) = {
      endpoints: [
        {
          method: "POST"
          path: "/mlflow/artifacts/complete-multipart-upload"
          since: {
            major: 2
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
    };
  }

  // Get a presigned URL to upload a part. Used when we need to retry failed part uploads.
  rpc getPresignedUploadPartUrl(GetPresignedUploadPartUrl) returns (GetPresignedUploadPartUrl.Response) {
    option (rpc) = {
      endpoints: [
        {
          method: "GET"
          path: "/mlflow/artifacts/get-presigned-upload-part-url"
          since: {
            major: 2
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
    };
  }

  rpc getCredentialsForTraceDataDownload(GetCredentialsForTraceDataDownload) returns (GetCredentialsForTraceDataDownload.Response) {
    option (rpc) = {
      endpoints: [
        {
          method: "GET"
          path: "/mlflow/traces/{request_id}/credentials-for-data-download"
          since: {
            major: 2
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
    };
  }

  rpc getCredentialsForTraceDataUpload(GetCredentialsForTraceDataUpload) returns (GetCredentialsForTraceDataUpload.Response) {
    option (rpc) = {
      endpoints: [
        {
          method: "GET"
          path: "/mlflow/traces/{request_id}/credentials-for-data-upload"
          since: {
            major: 2
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
    };
  }

  rpc getCredentialsForLoggedModelUpload(GetCredentialsForLoggedModelUpload) returns (GetCredentialsForLoggedModelUpload.Response) {
    option (rpc) = {
      endpoints: [
        {
          method: "POST"
          path: "/mlflow/logged-models/{model_id}/artifacts/credentials-for-upload"
          since: {
            major: 2
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
    };
  }

  rpc getCredentialsForLoggedModelDownload(GetCredentialsForLoggedModelDownload) returns (GetCredentialsForLoggedModelDownload.Response) {
    option (rpc) = {
      endpoints: [
        {
          method: "POST"
          path: "/mlflow/logged-models/{model_id}/artifacts/credentials-for-download"
          since: {
            major: 2
            minor: 0
          }
        }
      ]
      visibility: PUBLIC_UNDOCUMENTED
    };
  }
}

// The type of a given artifact access credential
enum ArtifactCredentialType {
  // The credential is an Azure Shared Access Signature URI. For more information, see
  // https://docs.microsoft.com/en-us/azure/storage/common/storage-sas-overview
  AZURE_SAS_URI = 1;

  // The credential is an AWS Presigned URL. For more information, see
  // https://docs.aws.amazon.com/AmazonS3/latest/dev/ShareObjectPreSignedURL.html
  AWS_PRESIGNED_URL = 2;

  // The credential is a GCP Signed URL. For more information, see
  // https://cloud.google.com/storage/docs/access-control/signed-urls
  GCP_SIGNED_URL = 3;

  // The credential is an Azure Shared Access Signature URI for ADLS.  For more
  // information see
  // https://docs.microsoft.com/en-us/rest/api/storageservices/data-lake-storage-gen2
  // and
  // https://docs.microsoft.com/en-us/azure/storage/common/storage-sas-overview
  AZURE_ADLS_GEN2_SAS_URI = 4;
}

message ArtifactCredentialInfo {
  // The ID of the MLflow Run containing the artifact that can be accessed
  // with the credential
  optional string run_id = 1;

  // The path, relative to the Run's artifact root location, of the artifact
  // that can be accessed with the credential
  optional string path = 2;

  // The signed URI credential that provides access to the artifact
  optional string signed_uri = 3;

  message HttpHeader {
    // The HTTP header name
    optional string name = 1;

    // The HTTP header value
    optional string value = 2;
  }

  // A collection of HTTP headers that should be specified when uploading to
  // or downloading from the specified `signed_uri`
  repeated HttpHeader headers = 4;

  // The type of the signed credential URI (e.g., an AWS presigned URL
  // or an Azure Shared Access Signature URI)
  optional ArtifactCredentialType type = 5;
}

// Credentials returned by GetCredentialsForLoggedModelUpload and GetCredentialsForLoggedModelDownload for
// writing and reading respectively to the artifact locations of a logged model.
// Contains an ArtifactCredentialInfo object for the logged model artifacts.
message LoggedModelArtifactCredential {
  // The ID of the MLflow logged model containing the artifact that can be accessed with the credential
  optional string model_id = 1;

  // The ArtifactCredentialInfo object for the logged model artifacts
  optional ArtifactCredentialInfo credential_info = 2;
}

message GetCredentialsForRead {
  option (scalapb.message).extends = "com.databricks.rpc.RPC[$this.Response]";

  // The ID of the MLflow Run for which to fetch artifact read credentials
  optional string run_id = 1 [(validate_required) = true];

  // The artifact paths, relative to the Run's artifact root location, for which to
  // fetch artifact read credentials. Must not be empty.
  repeated string path = 2;

  // Token specifying the page of credentials to fetch for large requests that require pagination
  optional string page_token = 3;

  message Response {
    // Credentials for reading from the specified artifact locations
    repeated ArtifactCredentialInfo credential_infos = 2;

    // Token used to fetch the next page of credentials for large requests that require pagination
    optional string next_page_token = 3;

    // Older versions of the MLflow client use this field to retrieve credentials via point fetches.
    reserved 1;
  }
}

message GetCredentialsForWrite {
  option (scalapb.message).extends = "com.databricks.rpc.RPC[$this.Response]";

  // The ID of the MLflow Run for which to fetch artifact write credentials
  optional string run_id = 1 [(validate_required) = true];

  // The artifact paths, relative to the Run's artifact root location, for which to
  // fetch artifact write credentials. Must not be empty.
  repeated string path = 2;

  // Token specifying the page of credentials to fetch for large requests that require pagination
  optional string page_token = 3;

  message Response {
    // Credentials for writing to the specified artifact locations
    repeated ArtifactCredentialInfo credential_infos = 2;

    // Token used to fetch the next page of credentials for large requests that require pagination
    optional string next_page_token = 3;

    // Older versions of the MLflow client use this field to retrieve credentials via point fetches.
    reserved 1;
  }
}

message CreateMultipartUpload {
  option (scalapb.message).extends = "com.databricks.rpc.RPC[$this.Response]";

  // Run ID
  optional string run_id = 1 [(validate_required) = true];

  // Artifact path, relative to the Run's artifact root location (e.g. "path/to/file")
  optional string path = 2;

  // Number of file parts (chunks of data) to upload in the initiated multipart upload
  optional int64 num_parts = 3 [(validate_required) = true];

  message Response {
    // ID identifying the initiated multipart upload
    optional string upload_id = 1;

    // Credentials for uploading file parts in the initiated multipart upload
    repeated ArtifactCredentialInfo upload_credential_infos = 2;

    // Why doesn't the response contain a presigned URL for completing the multipart upload?
    // As reported in https://github.com/aws/aws-sdk-java/issues/1537, AWS Java SDK v1
    // doesn't support generating a presigned URL for completing a multipart upload.

    // Credential for aborting the initiated multipart upload
    optional ArtifactCredentialInfo abort_credential_info = 3;
  }
}

message PartEtag {
  optional int64 part_number = 1;

  optional string etag = 2;
}

message CompleteMultipartUpload {
  option (scalapb.message).extends = "com.databricks.rpc.RPC[$this.Response]";

  // Run ID
  optional string run_id = 1 [(validate_required) = true];

  // Artifact path, relative to the Run's artifact root location (e.g. "path/to/file")
  optional string path = 2;

  // ID identifying the multipart upload to complete
  optional string upload_id = 3 [(validate_required) = true];

  // A list of file parts uploaded in the multipart upload to complete
  repeated PartEtag part_etags = 4;

  message Response {}
}

message GetPresignedUploadPartUrl {
  option (scalapb.message).extends = "com.databricks.rpc.RPC[$this.Response]";

  // Run ID
  optional string run_id = 1 [(validate_required) = true];

  // Atifact path, relative to the Run's artifact root location (e.g. "path/to/file")
  optional string path = 2;

  // ID identifying the multipart upload in which the part is uploaded
  optional string upload_id = 3 [(validate_required) = true];

  // Part number
  optional int64 part_number = 4 [(validate_required) = true];

  message Response {
    // Credential for uploading the part
    optional ArtifactCredentialInfo upload_credential_info = 1;
  }
}

message GetCredentialsForTraceDataDownload {
  option (scalapb.message).extends = "com.databricks.rpc.RPC[$this.Response]";

  optional string request_id = 1 [(validate_required) = true];

  message Response {
    optional ArtifactCredentialInfo credential_info = 1;
  }
}

message GetCredentialsForTraceDataUpload {
  option (scalapb.message).extends = "com.databricks.rpc.RPC[$this.Response]";

  optional string request_id = 1 [(validate_required) = true];

  message Response {
    optional ArtifactCredentialInfo credential_info = 1;
  }
}

message GetCredentialsForLoggedModelUpload {
  option (scalapb.message).extends = "com.databricks.rpc.RPC[$this.Response]";

  // The ID of the LoggedModel for which to fetch artifact write credentials
  optional string model_id = 1 [(validate_required) = true];

  // The artifact paths, relative to the LoggedModel's artifact root location,
  // for which to fetch artifact write credentials
  repeated string paths = 2;

  // Token specifying the page of credentials to fetch for large requests that require pagination
  optional string page_token = 3;

  message Response {
    // Credentials for writing to the specified artifact locations
    repeated LoggedModelArtifactCredential credentials = 1;

    // Token used to fetch the next page of credentials for large requests that require pagination
    optional string next_page_token = 2;
  }
}

message GetCredentialsForLoggedModelDownload {
  option (scalapb.message).extends = "com.databricks.rpc.RPC[$this.Response]";

  // The ID of the LoggedModel for which to fetch artifact read credentials
  optional string model_id = 1 [(validate_required) = true];

  // The artifact paths, relative to the LoggedModel's artifact root location,
  // for which to fetch artifact read credentials
  repeated string paths = 2;

  // Token specifying the page of credentials to fetch for large requests that require pagination
  optional string page_token = 3;

  message Response {
    // Credentials for reading the specified artifact locations
    repeated LoggedModelArtifactCredential credentials = 1;

    // Token used to fetch the next page of credentials for large requests that require pagination
    optional string next_page_token = 2;
  }
}
```

--------------------------------------------------------------------------------

````
