---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 673
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 673 of 991)

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

---[FILE: optimized_s3_artifact_repo.py]---
Location: mlflow-master/mlflow/store/artifact/optimized_s3_artifact_repo.py

```python
import json
import logging
import os
import posixpath
import urllib.parse
from mimetypes import guess_type

from mlflow.entities import FileInfo
from mlflow.environment_variables import (
    MLFLOW_ENABLE_MULTIPART_UPLOAD,
    MLFLOW_MULTIPART_UPLOAD_CHUNK_SIZE,
    MLFLOW_S3_EXPECTED_BUCKET_OWNER,
    MLFLOW_S3_UPLOAD_EXTRA_ARGS,
)
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_artifacts_pb2 import ArtifactCredentialInfo
from mlflow.store.artifact.artifact_repo import _retry_with_new_creds
from mlflow.store.artifact.cloud_artifact_repo import (
    CloudArtifactRepository,
    _complete_futures,
    _compute_num_chunks,
    _validate_chunk_size_aws,
)
from mlflow.store.artifact.s3_artifact_repo import _get_s3_client
from mlflow.utils.file_utils import read_chunk
from mlflow.utils.request_utils import cloud_storage_http_request
from mlflow.utils.rest_utils import augmented_raise_for_status

_logger = logging.getLogger(__name__)
_BUCKET_REGION = "BucketRegion"
_RESPONSE_METADATA = "ResponseMetadata"
_HTTP_HEADERS = "HTTPHeaders"
_HTTP_HEADER_BUCKET_REGION = "x-amz-bucket-region"
_BUCKET_LOCATION_NAME = "BucketLocationName"


class OptimizedS3ArtifactRepository(CloudArtifactRepository):
    """
    An optimized version of the S3 Artifact Repository.

    This class is used for uploading and downloading S3 artifacts for UC models. While it largely
    copies the behavior of the S3ArtifactRepository, the `log_artifact`, `log_artifacts`, and
    `_download_file` methods are optimized by replacing boto3 client operations with the use of
    presigned URLs for both uploads and downloads.
    """

    def __init__(
        self,
        artifact_uri,
        access_key_id=None,
        secret_access_key=None,
        session_token=None,
        credential_refresh_def=None,
        addressing_style=None,
        s3_endpoint_url=None,
        s3_upload_extra_args=None,
        tracking_uri=None,
        registry_uri: str | None = None,
    ):
        super().__init__(artifact_uri, tracking_uri=tracking_uri, registry_uri=registry_uri)
        self._access_key_id = access_key_id
        self._secret_access_key = secret_access_key
        self._session_token = session_token
        self._credential_refresh_def = credential_refresh_def
        self._addressing_style = addressing_style
        self._s3_endpoint_url = s3_endpoint_url
        self.bucket, self.bucket_path = self.parse_s3_compliant_uri(self.artifact_uri)
        self._bucket_owner_params = (
            {"ExpectedBucketOwner": owner}
            if (owner := MLFLOW_S3_EXPECTED_BUCKET_OWNER.get())
            else {}
        )
        self._region_name = self._get_region_name()
        self._s3_upload_extra_args = s3_upload_extra_args or {}

    def _refresh_credentials(self):
        if not self._credential_refresh_def:
            return self._get_s3_client()
        new_creds = self._credential_refresh_def()
        self._access_key_id = new_creds["access_key_id"]
        self._secret_access_key = new_creds["secret_access_key"]
        self._session_token = new_creds["session_token"]
        self._s3_upload_extra_args = new_creds["s3_upload_extra_args"]
        return self._get_s3_client()

    def _get_region_name(self):
        from botocore.exceptions import ClientError

        temp_client = _get_s3_client(
            addressing_style=self._addressing_style,
            access_key_id=self._access_key_id,
            secret_access_key=self._secret_access_key,
            session_token=self._session_token,
            s3_endpoint_url=self._s3_endpoint_url,
        )
        try:
            head_bucket_resp = temp_client.head_bucket(
                Bucket=self.bucket, **self._bucket_owner_params
            )
            # A normal response will have the region in the Bucket_Region field of the response
            if _BUCKET_REGION in head_bucket_resp:
                return head_bucket_resp[_BUCKET_REGION]
            # If the bucket exists but the caller does not have permissions, the http headers
            # are passed back as part of the metadata of a normal, non-throwing response.  In
            # this case we use the x-amz-bucket-region field of the HTTP headers which should
            # always be populated with the region.
            if (
                _RESPONSE_METADATA in head_bucket_resp
                and _HTTP_HEADERS in head_bucket_resp[_RESPONSE_METADATA]
                and _HTTP_HEADER_BUCKET_REGION
                in head_bucket_resp[_RESPONSE_METADATA][_HTTP_HEADERS]
            ):
                return head_bucket_resp[_RESPONSE_METADATA][_HTTP_HEADERS][
                    _HTTP_HEADER_BUCKET_REGION
                ]
            # Directory buckets do not have a Bucket_Region and instead have a
            # Bucket_Location_Name.  This name cannot be used as the region name
            # however, so we warn that this has happened and allow the exception
            # at the end to be raised.
            if _BUCKET_LOCATION_NAME in head_bucket_resp:
                _logger.warning(
                    f"Directory bucket {self.bucket} found with BucketLocationName "
                    f"{head_bucket_resp[_BUCKET_LOCATION_NAME]}."
                )
            raise Exception(f"Unable to get the region name for bucket {self.bucket}.")
        except ClientError as error:
            # If a client error occurs, we check to see if the x-amz-bucket-region field is set
            # in the response and return that.  If it is not present, this will raise due to the
            # key not being present.
            return error.response[_RESPONSE_METADATA][_HTTP_HEADERS][_HTTP_HEADER_BUCKET_REGION]

    def _get_s3_client(self):
        return _get_s3_client(
            addressing_style=self._addressing_style,
            access_key_id=self._access_key_id,
            secret_access_key=self._secret_access_key,
            session_token=self._session_token,
            region_name=self._region_name,
            s3_endpoint_url=self._s3_endpoint_url,
        )

    def parse_s3_compliant_uri(self, uri):
        """Parse an S3 URI, returning (bucket, path)"""
        parsed = urllib.parse.urlparse(uri)
        if parsed.scheme != "s3":
            raise Exception(f"Not an S3 URI: {uri}")
        path = parsed.path
        path = path.removeprefix("/")
        return parsed.netloc, path

    @staticmethod
    def get_s3_file_upload_extra_args():
        if s3_file_upload_extra_args := MLFLOW_S3_UPLOAD_EXTRA_ARGS.get():
            return json.loads(s3_file_upload_extra_args)
        else:
            return None

    def _upload_file(self, s3_client, local_file, bucket, key):
        extra_args = {}
        extra_args.update(self._s3_upload_extra_args)
        guessed_type, guessed_encoding = guess_type(local_file)
        if guessed_type is not None:
            extra_args["ContentType"] = guessed_type
        if guessed_encoding is not None:
            extra_args["ContentEncoding"] = guessed_encoding
        extra_args.update(self._bucket_owner_params)
        environ_extra_args = self.get_s3_file_upload_extra_args()
        if environ_extra_args is not None:
            extra_args.update(environ_extra_args)

        def try_func(creds):
            creds.upload_file(Filename=local_file, Bucket=bucket, Key=key, ExtraArgs=extra_args)

        _retry_with_new_creds(
            try_func=try_func, creds_func=self._refresh_credentials, orig_creds=s3_client
        )

    def log_artifact(self, local_file, artifact_path=None):
        artifact_file_path = os.path.basename(local_file)
        if artifact_path:
            artifact_file_path = posixpath.join(artifact_path, artifact_file_path)
        self._upload_to_cloud(
            cloud_credential_info=self._get_s3_client(),
            src_file_path=local_file,
            artifact_file_path=artifact_file_path,
        )

    def _get_write_credential_infos(self, remote_file_paths):
        """
        Instead of returning ArtifactCredentialInfo objects, we instead return a list of initialized
        S3 client. We do so because S3 clients cannot be instantiated within each thread.
        """
        return [self._get_s3_client() for _ in remote_file_paths]

    def _upload_to_cloud(self, cloud_credential_info, src_file_path, artifact_file_path):
        dest_path = posixpath.join(self.bucket_path, artifact_file_path)
        key = posixpath.normpath(dest_path)
        if (
            MLFLOW_ENABLE_MULTIPART_UPLOAD.get()
            and os.path.getsize(src_file_path) > MLFLOW_MULTIPART_UPLOAD_CHUNK_SIZE.get()
        ):
            self._multipart_upload(cloud_credential_info, src_file_path, self.bucket, key)
        else:
            self._upload_file(cloud_credential_info, src_file_path, self.bucket, key)

    def _multipart_upload(self, cloud_credential_info, local_file, bucket, key):
        # Create multipart upload
        s3_client = cloud_credential_info
        response = s3_client.create_multipart_upload(
            Bucket=bucket, Key=key, **self._bucket_owner_params
        )
        upload_id = response["UploadId"]

        num_parts = _compute_num_chunks(local_file, MLFLOW_MULTIPART_UPLOAD_CHUNK_SIZE.get())
        _validate_chunk_size_aws(MLFLOW_MULTIPART_UPLOAD_CHUNK_SIZE.get())

        # define helper functions for uploading data
        def _upload_part(part_number, local_file, start_byte, size):
            data = read_chunk(local_file, size, start_byte)

            def try_func(creds):
                # Create presigned URL for each part
                presigned_url = creds.generate_presigned_url(
                    "upload_part",
                    Params={
                        "Bucket": bucket,
                        "Key": key,
                        "UploadId": upload_id,
                        "PartNumber": part_number,
                        **self._bucket_owner_params,
                    },
                )
                with cloud_storage_http_request("put", presigned_url, data=data) as response:
                    augmented_raise_for_status(response)
                    return response.headers["ETag"]

            return _retry_with_new_creds(
                try_func=try_func, creds_func=self._refresh_credentials, orig_creds=s3_client
            )

        try:
            # Upload each part with retries
            futures = {}
            for index in range(num_parts):
                part_number = index + 1
                start_byte = index * MLFLOW_MULTIPART_UPLOAD_CHUNK_SIZE.get()
                future = self.chunk_thread_pool.submit(
                    _upload_part,
                    part_number=part_number,
                    local_file=local_file,
                    start_byte=start_byte,
                    size=MLFLOW_MULTIPART_UPLOAD_CHUNK_SIZE.get(),
                )
                futures[future] = part_number

            results, errors = _complete_futures(futures, local_file)
            if errors:
                raise MlflowException(
                    f"Failed to upload at least one part of {local_file}. Errors: {errors}"
                )
            parts = [
                {"PartNumber": part_number, "ETag": results[part_number]}
                for part_number in sorted(results)
            ]

            # Complete multipart upload
            s3_client.complete_multipart_upload(
                Bucket=bucket,
                Key=key,
                UploadId=upload_id,
                MultipartUpload={"Parts": parts},
                **self._bucket_owner_params,
            )
        except Exception as e:
            _logger.warning(
                "Encountered an unexpected error during multipart upload: %s, aborting", e
            )
            s3_client.abort_multipart_upload(
                Bucket=bucket,
                Key=key,
                UploadId=upload_id,
                **self._bucket_owner_params,
            )
            raise e

    def list_artifacts(self, path=None):
        artifact_path = self.bucket_path
        dest_path = self.bucket_path
        if path:
            dest_path = posixpath.join(dest_path, path)
        infos = []
        dest_path = dest_path.rstrip("/") if dest_path else ""
        prefix = dest_path + "/" if dest_path else ""
        s3_client = self._get_s3_client()
        paginator = s3_client.get_paginator("list_objects_v2")
        results = paginator.paginate(
            Bucket=self.bucket,
            Prefix=prefix,
            Delimiter="/",
            **self._bucket_owner_params,
        )
        for result in results:
            # Subdirectories will be listed as "common prefixes" due to the way we made the request
            for obj in result.get("CommonPrefixes", []):
                subdir_path = obj.get("Prefix")
                self._verify_listed_object_contains_artifact_path_prefix(
                    listed_object_path=subdir_path, artifact_path=artifact_path
                )
                subdir_rel_path = posixpath.relpath(path=subdir_path, start=artifact_path)
                subdir_rel_path = subdir_rel_path.removesuffix("/")
                infos.append(FileInfo(subdir_rel_path, True, None))
            # Objects listed directly will be files
            for obj in result.get("Contents", []):
                file_path = obj.get("Key")
                self._verify_listed_object_contains_artifact_path_prefix(
                    listed_object_path=file_path, artifact_path=artifact_path
                )
                file_rel_path = posixpath.relpath(path=file_path, start=artifact_path)
                file_size = int(obj.get("Size"))
                infos.append(FileInfo(file_rel_path, False, file_size))
        return sorted(infos, key=lambda f: f.path)

    @staticmethod
    def _verify_listed_object_contains_artifact_path_prefix(listed_object_path, artifact_path):
        if not listed_object_path.startswith(artifact_path):
            raise MlflowException(
                "The path of the listed S3 object does not begin with the specified"
                f" artifact path. Artifact path: {artifact_path}. Object path:"
                f" {listed_object_path}."
            )

    def _get_presigned_uri(self, remote_file_path):
        s3_client = self._get_s3_client()
        s3_full_path = posixpath.join(self.bucket_path, remote_file_path)
        return s3_client.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": self.bucket,
                "Key": s3_full_path,
                **self._bucket_owner_params,
            },
        )

    def _get_read_credential_infos(self, remote_file_paths):
        return [
            ArtifactCredentialInfo(signed_uri=self._get_presigned_uri(path))
            for path in remote_file_paths
        ]

    def _download_from_cloud(self, remote_file_path, local_path):
        s3_client = self._get_s3_client()
        s3_full_path = posixpath.join(self.bucket_path, remote_file_path)

        def try_func(creds):
            download_kwargs = (
                {"ExtraArgs": self._bucket_owner_params} if self._bucket_owner_params else {}
            )
            creds.download_file(self.bucket, s3_full_path, local_path, **download_kwargs)

        _retry_with_new_creds(
            try_func=try_func, creds_func=self._refresh_credentials, orig_creds=s3_client
        )

    def delete_artifacts(self, artifact_path=None):
        dest_path = self.bucket_path
        if artifact_path:
            dest_path = posixpath.join(dest_path, artifact_path)

        dest_path = dest_path.rstrip("/") if dest_path else ""
        s3_client = self._get_s3_client()
        paginator = s3_client.get_paginator("list_objects_v2")
        results = paginator.paginate(
            Bucket=self.bucket,
            Prefix=dest_path,
            **self._bucket_owner_params,
        )
        for result in results:
            keys = []
            for to_delete_obj in result.get("Contents", []):
                file_path = to_delete_obj.get("Key")
                self._verify_listed_object_contains_artifact_path_prefix(
                    listed_object_path=file_path, artifact_path=dest_path
                )
                keys.append({"Key": file_path})
            if keys:
                s3_client.delete_objects(
                    Bucket=self.bucket,
                    Delete={"Objects": keys},
                    **self._bucket_owner_params,
                )
```

--------------------------------------------------------------------------------

---[FILE: presigned_url_artifact_repo.py]---
Location: mlflow-master/mlflow/store/artifact/presigned_url_artifact_repo.py

```python
import json
import os
import posixpath

from mlflow.entities import FileInfo
from mlflow.environment_variables import MLFLOW_MULTIPART_DOWNLOAD_CHUNK_SIZE
from mlflow.exceptions import RestException
from mlflow.protos.databricks_artifacts_pb2 import ArtifactCredentialInfo
from mlflow.protos.databricks_filesystem_service_pb2 import (
    CreateDownloadUrlRequest,
    CreateDownloadUrlResponse,
    CreateUploadUrlRequest,
    CreateUploadUrlResponse,
    FilesystemService,
    ListDirectoryResponse,
)
from mlflow.protos.databricks_pb2 import NOT_FOUND, ErrorCode
from mlflow.store.artifact.artifact_repo import _retry_with_new_creds
from mlflow.store.artifact.cloud_artifact_repo import CloudArtifactRepository
from mlflow.utils.file_utils import download_file_using_http_uri
from mlflow.utils.proto_json_utils import message_to_json
from mlflow.utils.request_utils import augmented_raise_for_status, cloud_storage_http_request
from mlflow.utils.rest_utils import (
    _REST_API_PATH_PREFIX,
    call_endpoint,
    extract_api_info_for_service,
)

FILESYSTEM_METHOD_TO_INFO = extract_api_info_for_service(FilesystemService, _REST_API_PATH_PREFIX)
DIRECTORIES_ENDPOINT = "/api/2.0/fs/directories"


class PresignedUrlArtifactRepository(CloudArtifactRepository):
    """
    Stores and retrieves model artifacts using presigned URLs.
    """

    def __init__(
        self,
        db_creds,
        model_full_name,
        model_version,
        tracking_uri: str | None = None,
        registry_uri: str | None = None,
    ):
        artifact_uri = posixpath.join(
            "/Models", model_full_name.replace(".", "/"), str(model_version)
        )
        super().__init__(artifact_uri, tracking_uri, registry_uri)
        self.db_creds = db_creds

    def log_artifact(self, local_file, artifact_path=None):
        artifact_file_path = os.path.basename(local_file)
        if artifact_path:
            artifact_file_path = posixpath.join(artifact_path, artifact_file_path)
        cloud_credentials = self._get_write_credential_infos(
            remote_file_paths=[artifact_file_path]
        )[0]
        self._upload_to_cloud(
            cloud_credential_info=cloud_credentials,
            src_file_path=local_file,
            artifact_file_path=artifact_file_path,
        )

    def _get_write_credential_infos(self, remote_file_paths):
        endpoint, method = FILESYSTEM_METHOD_TO_INFO[CreateUploadUrlRequest]
        credential_infos = []
        for relative_path in remote_file_paths:
            fs_full_path = posixpath.join(self.artifact_uri, relative_path)
            req_body = message_to_json(CreateUploadUrlRequest(path=fs_full_path))
            response_proto = CreateUploadUrlResponse()
            resp = call_endpoint(
                host_creds=self.db_creds,
                endpoint=endpoint,
                method=method,
                json_body=req_body,
                response_proto=response_proto,
            )
            headers = [
                ArtifactCredentialInfo.HttpHeader(name=header.name, value=header.value)
                for header in resp.headers
            ]
            credential_infos.append(ArtifactCredentialInfo(signed_uri=resp.url, headers=headers))
        return credential_infos

    def _upload_to_cloud(self, cloud_credential_info, src_file_path, artifact_file_path=None):
        # artifact_file_path is unused in this implementation because the presigned URL
        # and local file path are sufficient for upload to cloud storage
        def try_func(creds):
            presigned_url = creds.signed_uri
            headers = {header.name: header.value for header in creds.headers}
            with open(src_file_path, "rb") as source_file:
                data = source_file.read()
                with cloud_storage_http_request(
                    "put", presigned_url, data=data, headers=headers
                ) as response:
                    augmented_raise_for_status(response)

        def creds_func():
            return self._get_write_credential_infos(remote_file_paths=[artifact_file_path])[0]

        _retry_with_new_creds(
            try_func=try_func, creds_func=creds_func, orig_creds=cloud_credential_info
        )

    def list_artifacts(self, path=""):
        infos = []
        page_token = ""
        while True:
            endpoint = posixpath.join(DIRECTORIES_ENDPOINT, self.artifact_uri.lstrip("/"), path)
            req_body = json.dumps({"page_token": page_token}) if page_token else None

            response_proto = ListDirectoryResponse()

            # If the path specified is not a directory, we return an empty list instead of raising
            # an exception. This is due to this method being used in artifact_repo._is_directory
            # to determine when a filepath is a directory.
            try:
                resp = call_endpoint(
                    host_creds=self.db_creds,
                    endpoint=endpoint,
                    method="GET",
                    json_body=req_body,
                    response_proto=response_proto,
                )
            except RestException as e:
                if e.error_code == ErrorCode.Name(NOT_FOUND):
                    return []
                else:
                    raise e
            for dir_entry in resp.contents:
                rel_path = posixpath.relpath(dir_entry.path, self.artifact_uri)
                if dir_entry.is_directory:
                    infos.append(FileInfo(rel_path, True, None))
                else:
                    infos.append(FileInfo(rel_path, False, dir_entry.file_size))
            page_token = resp.next_page_token
            if not page_token:
                break
        return sorted(infos, key=lambda f: f.path)

    def _get_read_credential_infos(self, remote_file_paths):
        credential_infos = []
        for remote_file_path in remote_file_paths:
            resp = self._get_download_presigned_url_and_headers(remote_file_path)
            headers = [
                ArtifactCredentialInfo.HttpHeader(name=header.name, value=header.value)
                for header in resp.headers
            ]
            credential_infos.append(ArtifactCredentialInfo(signed_uri=resp.url, headers=headers))
        return credential_infos

    def _download_from_cloud(self, remote_file_path, local_path):
        def creds_func():
            return self._get_download_presigned_url_and_headers(remote_file_path)

        def try_func(creds):
            presigned_url = creds.url
            headers = {header.name: header.value for header in creds.headers}
            download_file_using_http_uri(
                http_uri=presigned_url,
                download_path=local_path,
                chunk_size=MLFLOW_MULTIPART_DOWNLOAD_CHUNK_SIZE.get(),
                headers=headers,
            )

        _retry_with_new_creds(try_func=try_func, creds_func=creds_func)

    def _get_download_presigned_url_and_headers(self, remote_file_path):
        remote_file_full_path = posixpath.join(self.artifact_uri, remote_file_path)
        endpoint, method = FILESYSTEM_METHOD_TO_INFO[CreateDownloadUrlRequest]
        req_body = message_to_json(CreateDownloadUrlRequest(path=remote_file_full_path))
        response_proto = CreateDownloadUrlResponse()
        return call_endpoint(
            host_creds=self.db_creds,
            endpoint=endpoint,
            method=method,
            json_body=req_body,
            response_proto=response_proto,
        )
```

--------------------------------------------------------------------------------

---[FILE: r2_artifact_repo.py]---
Location: mlflow-master/mlflow/store/artifact/r2_artifact_repo.py

```python
from urllib.parse import urlparse

from mlflow.store.artifact.optimized_s3_artifact_repo import OptimizedS3ArtifactRepository
from mlflow.store.artifact.s3_artifact_repo import _get_s3_client


class R2ArtifactRepository(OptimizedS3ArtifactRepository):
    """Stores artifacts on Cloudflare R2."""

    def __init__(
        self,
        artifact_uri,
        access_key_id=None,
        secret_access_key=None,
        session_token=None,
        credential_refresh_def=None,
        s3_upload_extra_args=None,
        tracking_uri=None,
        registry_uri: str | None = None,
    ):
        # setup Cloudflare R2 backend to be endpoint_url, otherwise all s3 requests
        # will go to AWS S3 by default
        s3_endpoint_url = self.convert_r2_uri_to_s3_endpoint_url(artifact_uri)
        self._access_key_id = access_key_id
        self._secret_access_key = secret_access_key
        self._session_token = session_token
        self._s3_endpoint_url = s3_endpoint_url
        self.bucket, self.bucket_path = self.parse_s3_compliant_uri(artifact_uri)
        super().__init__(
            artifact_uri,
            access_key_id=access_key_id,
            secret_access_key=secret_access_key,
            session_token=session_token,
            credential_refresh_def=credential_refresh_def,
            addressing_style="virtual",
            s3_endpoint_url=s3_endpoint_url,
            s3_upload_extra_args=s3_upload_extra_args,
            tracking_uri=tracking_uri,
            registry_uri=registry_uri,
        )

    # Cloudflare implementation of head_bucket is not the same as AWS's, so we
    # temporarily use the old method of get_bucket_location until cloudflare
    # updates their implementation
    def _get_region_name(self):
        # note: s3 client enforces path addressing style for get_bucket_location
        temp_client = _get_s3_client(
            addressing_style="path",
            access_key_id=self._access_key_id,
            secret_access_key=self._secret_access_key,
            session_token=self._session_token,
            s3_endpoint_url=self._s3_endpoint_url,
        )
        return temp_client.get_bucket_location(Bucket=self.bucket)["LocationConstraint"]

    def parse_s3_compliant_uri(self, uri):
        # r2 uri format(virtual): r2://<bucket-name>@<account-id>.r2.cloudflarestorage.com/<path>
        parsed = urlparse(uri)
        if parsed.scheme != "r2":
            raise Exception(f"Not an R2 URI: {uri}")

        host = parsed.netloc
        path = parsed.path

        bucket = host.split("@")[0]
        path = path.removeprefix("/")
        return bucket, path

    @staticmethod
    def convert_r2_uri_to_s3_endpoint_url(r2_uri):
        host = urlparse(r2_uri).netloc
        host_without_bucket = host.split("@")[-1]
        return f"https://{host_without_bucket}"
```

--------------------------------------------------------------------------------

---[FILE: runs_artifact_repo.py]---
Location: mlflow-master/mlflow/store/artifact/runs_artifact_repo.py

```python
import logging
import os
import urllib.parse
from typing import Iterator

import mlflow
from mlflow.entities.file_info import FileInfo
from mlflow.entities.logged_model import LoggedModel
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import RESOURCE_DOES_NOT_EXIST
from mlflow.store.artifact.artifact_repo import ArtifactRepository
from mlflow.utils.file_utils import create_tmp_dir
from mlflow.utils.uri import (
    add_databricks_profile_info_to_artifact_uri,
    get_databricks_profile_uri_from_artifact_uri,
)

_logger = logging.getLogger(__name__)


class RunsArtifactRepository(ArtifactRepository):
    """
    Handles artifacts associated with a Run via URIs of the form
      `runs:/<run_id>/run-relative/path/to/artifact`.
    It is a light wrapper that resolves the artifact path to an absolute URI then instantiates
    and uses the artifact repository for that URI.

    The relative path part of ``artifact_uri`` is expected to be in posixpath format, so Windows
    users should take special care when constructing the URI.
    """

    def __init__(
        self, artifact_uri: str, tracking_uri: str | None = None, registry_uri: str | None = None
    ) -> None:
        from mlflow.store.artifact.artifact_repository_registry import get_artifact_repository

        super().__init__(artifact_uri, tracking_uri, registry_uri)
        uri = RunsArtifactRepository.get_underlying_uri(artifact_uri, tracking_uri)
        self.repo = get_artifact_repository(
            uri, tracking_uri=self.tracking_uri, registry_uri=self.registry_uri
        )

    @staticmethod
    def is_runs_uri(uri):
        return urllib.parse.urlparse(uri).scheme == "runs"

    @staticmethod
    def get_underlying_uri(runs_uri: str, tracking_uri: str | None = None) -> str:
        from mlflow.tracking.artifact_utils import get_artifact_uri

        (run_id, artifact_path) = RunsArtifactRepository.parse_runs_uri(runs_uri)
        databricks_profile_uri = get_databricks_profile_uri_from_artifact_uri(runs_uri)
        uri = get_artifact_uri(
            run_id=run_id,
            artifact_path=artifact_path,
            tracking_uri=databricks_profile_uri or tracking_uri,
        )
        assert not RunsArtifactRepository.is_runs_uri(uri)  # avoid an infinite loop
        return add_databricks_profile_info_to_artifact_uri(
            artifact_uri=uri, databricks_profile_uri=databricks_profile_uri or tracking_uri
        )

    @staticmethod
    def parse_runs_uri(run_uri):
        parsed = urllib.parse.urlparse(run_uri)
        if parsed.scheme != "runs":
            raise MlflowException(
                f"Not a proper runs:/ URI: {run_uri}. "
                + "Runs URIs must be of the form 'runs:/<run_id>/run-relative/path/to/artifact'"
            )

        path = parsed.path
        if not path.startswith("/") or len(path) <= 1:
            raise MlflowException(
                f"Not a proper runs:/ URI: {run_uri}. "
                + "Runs URIs must be of the form 'runs:/<run_id>/run-relative/path/to/artifact'"
            )
        path = path[1:]

        path_parts = path.split("/")
        run_id = path_parts[0]
        if run_id == "":
            raise MlflowException(
                f"Not a proper runs:/ URI: {run_uri}. "
                + "Runs URIs must be of the form 'runs:/<run_id>/run-relative/path/to/artifact'"
            )

        artifact_path = "/".join(path_parts[1:]) if len(path_parts) > 1 else None
        artifact_path = artifact_path if artifact_path != "" else None

        return run_id, artifact_path

    def log_artifact(self, local_file, artifact_path=None):
        """
        Log a local file as an artifact, optionally taking an ``artifact_path`` to place it in
        within the run's artifacts. Run artifacts can be organized into directories, so you can
        place the artifact in a directory this way.

        Args:
            local_file: Path to artifact to log.
            artifact_path: Directory within the run's artifact directory in which to log the
                artifact.
        """
        self.repo.log_artifact(local_file, artifact_path)

    def log_artifacts(self, local_dir, artifact_path=None):
        """
        Log the files in the specified local directory as artifacts, optionally taking
        an ``artifact_path`` to place them in within the run's artifacts.

        Args:
            local_dir: Directory of local artifacts to log.
            artifact_path: Directory within the run's artifact directory in which to log the
                artifacts.
        """
        self.repo.log_artifacts(local_dir, artifact_path)

    def _is_directory(self, artifact_path):
        return self.repo._is_directory(artifact_path)

    def list_artifacts(self, path: str | None = None) -> list[FileInfo]:
        """
        Return all the artifacts for this run_id directly under path. If path is a file, returns
        an empty list. Will error if path is neither a file nor directory. When the run has an
        associated model, the artifacts of the model are also listed.

        Args:
            path: Relative source path that contain desired artifacts

        Returns:
            List of artifacts as FileInfo listed directly under path.
        """
        return self._list_run_artifacts(path) + self._list_model_artifacts(path)

    def _list_run_artifacts(self, path: str | None = None) -> list[FileInfo]:
        return self.repo.list_artifacts(path)

    def _get_logged_model_artifact_repo(self, run_id: str, name: str) -> ArtifactRepository | None:
        """
        Get the artifact repository for a logged model with the given name and run ID.
        Returns None if no such model exists.
        """
        from mlflow.store.artifact.artifact_repository_registry import get_artifact_repository

        client = mlflow.tracking.MlflowClient(self.tracking_uri)
        experiment_id = client.get_run(run_id).info.experiment_id

        def iter_models() -> Iterator[LoggedModel]:
            page_token: str | None = None
            while True:
                page = client.search_logged_models(
                    experiment_ids=[experiment_id],
                    # TODO: Filter by 'source_run_id' once Databricks backend supports it
                    filter_string=f"name = '{name}'",
                    page_token=page_token,
                )
                yield from page
                if not page.token:
                    break
                page_token = page.token

        if matched := next((m for m in iter_models() if m.source_run_id == run_id), None):
            return get_artifact_repository(
                matched.artifact_location, tracking_uri=self.tracking_uri
            )

        return None

    def _list_model_artifacts(self, path: str | None = None) -> list[FileInfo]:
        """
        A run can have an associated model. If so, this method lists the artifacts of the model.
        """
        full_path = f"{self.artifact_uri}/{path}" if path else self.artifact_uri
        run_id, rel_path = RunsArtifactRepository.parse_runs_uri(full_path)
        if not rel_path:
            # At least one part of the path must be present (e.g. "runs:/<run_id>/<name>")
            return []
        [model_name, *rest] = rel_path.split("/", 1)
        rel_path = rest[0] if rest else ""
        if repo := self._get_logged_model_artifact_repo(run_id=run_id, name=model_name):
            artifacts = repo.list_artifacts(path=rel_path)
            return [
                FileInfo(path=f"{model_name}/{a.path}", is_dir=a.is_dir, file_size=a.file_size)
                for a in artifacts
            ]

        return []

    def download_artifacts(self, artifact_path: str, dst_path: str | None = None) -> str:
        """
        Download an artifact file or directory to a local directory if applicable, and return a
        local path for it. When the run has an associated model, the artifacts of the model are also
        downloaded to the specified destination directory. The caller is responsible for managing
        the lifecycle of the downloaded artifacts.

        Args:
            artifact_path: Relative source path to the desired artifacts.
            dst_path: Absolute path of the local filesystem destination directory to which to
                download the specified artifacts. This directory must already exist.
                If unspecified, the artifacts will either be downloaded to a new
                uniquely-named directory on the local filesystem or will be returned
                directly in the case of the LocalArtifactRepository.

        Returns:
            Absolute path of the local filesystem location containing the desired artifacts.
        """
        dst_path = dst_path or create_tmp_dir()
        run_out_path: str | None = None
        try:
            # This fails when the run has no artifacts, so we catch the exception
            run_out_path = self.repo.download_artifacts(artifact_path, dst_path)
        except Exception:
            _logger.debug(
                f"Failed to download artifacts from {self.artifact_uri}/{artifact_path}.",
                exc_info=True,
            )

        # If there are artifacts with the same name in the run and model, the model artifacts
        # will overwrite the run artifacts.
        model_out_path: str | None = None
        try:
            model_out_path = self._download_model_artifacts(artifact_path, dst_path=dst_path)
        except Exception:
            _logger.debug(
                f"Failed to download model artifacts from {self.artifact_uri}/{artifact_path}.",
                exc_info=True,
            )
        path = run_out_path or model_out_path
        if path is None:
            raise MlflowException(
                f"Failed to download artifacts from path {artifact_path!r}, "
                "please ensure that the path is correct.",
                error_code=RESOURCE_DOES_NOT_EXIST,
            )
        return path

    def _download_model_artifacts(self, artifact_path: str, dst_path: str) -> str | None:
        """
        A run can have an associated model. If so, this method downloads the artifacts of the model.
        """
        full_path = f"{self.artifact_uri}/{artifact_path}" if artifact_path else self.artifact_uri
        run_id, rel_path = RunsArtifactRepository.parse_runs_uri(full_path)
        if not rel_path:
            # At least one part of the path must be present (e.g. "runs:/<run_id>/<name>")
            return None
        [model_name, *rest] = rel_path.split("/", 1)
        rel_path = rest[0] if rest else ""
        if repo := self._get_logged_model_artifact_repo(run_id=run_id, name=model_name):
            dst = os.path.join(dst_path, model_name)
            os.makedirs(dst, exist_ok=True)
            return repo.download_artifacts(artifact_path=rel_path, dst_path=dst)

        return None

    def _download_file(self, remote_file_path, local_path):
        """
        Download the file at the specified relative remote path and saves
        it at the specified local path.

        Args:
            remote_file_path: Source path to the remote file, relative to the root
                directory of the artifact repository.
            local_path: The path to which to save the downloaded file.

        """
        self.repo._download_file(remote_file_path, local_path)

    def delete_artifacts(self, artifact_path=None):
        self.repo.delete_artifacts(artifact_path)
```

--------------------------------------------------------------------------------

````
