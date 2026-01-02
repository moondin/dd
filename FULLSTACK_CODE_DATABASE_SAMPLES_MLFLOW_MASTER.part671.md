---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 671
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 671 of 991)

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

---[FILE: dbfs_artifact_repo.py]---
Location: mlflow-master/mlflow/store/artifact/dbfs_artifact_repo.py

```python
import json
import os
import posixpath

import mlflow.utils.databricks_utils
from mlflow.entities import FileInfo
from mlflow.environment_variables import (
    MLFLOW_DISABLE_DATABRICKS_SDK_FOR_RUN_ARTIFACTS,
    MLFLOW_ENABLE_DBFS_FUSE_ARTIFACT_REPO,
)
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE
from mlflow.store.artifact.artifact_repo import ArtifactRepository
from mlflow.store.artifact.databricks_artifact_repo import DatabricksArtifactRepository
from mlflow.store.artifact.databricks_logged_model_artifact_repo import (
    DatabricksLoggedModelArtifactRepository,
)
from mlflow.store.artifact.databricks_run_artifact_repo import DatabricksRunArtifactRepository
from mlflow.store.artifact.local_artifact_repo import LocalArtifactRepository
from mlflow.store.tracking.rest_store import RestStore
from mlflow.tracking._tracking_service import utils
from mlflow.utils.databricks_utils import get_databricks_host_creds
from mlflow.utils.file_utils import relative_path_to_artifact_path
from mlflow.utils.rest_utils import (
    RESOURCE_NON_EXISTENT,
    http_request,
    http_request_safe,
)
from mlflow.utils.string_utils import strip_prefix
from mlflow.utils.uri import (
    get_databricks_profile_uri_from_artifact_uri,
    is_databricks_acled_artifacts_uri,
    is_databricks_model_registry_artifacts_uri,
    is_valid_dbfs_uri,
    remove_databricks_profile_info_from_artifact_uri,
    strip_scheme,
)

# The following constants are defined as @developer_stable
LIST_API_ENDPOINT = "/api/2.0/dbfs/list"
GET_STATUS_ENDPOINT = "/api/2.0/dbfs/get-status"
DOWNLOAD_CHUNK_SIZE = 1024


class DbfsRestArtifactRepository(ArtifactRepository):
    """
    Stores artifacts on DBFS using the DBFS REST API.

    This repository is used with URIs of the form ``dbfs:/<path>``. The repository can only be used
    together with the RestStore.
    """

    def __init__(
        self, artifact_uri: str, tracking_uri: str | None = None, registry_uri: str | None = None
    ) -> None:
        if not is_valid_dbfs_uri(artifact_uri):
            raise MlflowException(
                message="DBFS URI must be of the form dbfs:/<path> or "
                + "dbfs://profile@databricks/<path>",
                error_code=INVALID_PARAMETER_VALUE,
            )

        # The dbfs:/ path ultimately used for artifact operations should not contain the
        # Databricks profile info, so strip it before setting ``artifact_uri``.
        super().__init__(
            remove_databricks_profile_info_from_artifact_uri(artifact_uri),
            tracking_uri,
            registry_uri,
        )

        if databricks_profile_uri := get_databricks_profile_uri_from_artifact_uri(artifact_uri):
            hostcreds_from_uri = get_databricks_host_creds(databricks_profile_uri)
            self.get_host_creds = lambda: hostcreds_from_uri
        else:
            self.get_host_creds = _get_host_creds_from_default_store()

    def _databricks_api_request(self, endpoint, method, **kwargs):
        host_creds = self.get_host_creds()
        return http_request_safe(host_creds=host_creds, endpoint=endpoint, method=method, **kwargs)

    def _dbfs_list_api(self, json):
        host_creds = self.get_host_creds()
        return http_request(
            host_creds=host_creds, endpoint=LIST_API_ENDPOINT, method="GET", params=json
        )

    def _dbfs_download(self, output_path, endpoint):
        with open(output_path, "wb") as f:
            response = self._databricks_api_request(endpoint=endpoint, method="GET", stream=True)
            try:
                for content in response.iter_content(chunk_size=DOWNLOAD_CHUNK_SIZE):
                    f.write(content)
            finally:
                response.close()

    def _is_directory(self, artifact_path):
        dbfs_path = self._get_dbfs_path(artifact_path) if artifact_path else self._get_dbfs_path("")
        return self._dbfs_is_dir(dbfs_path)

    def _dbfs_is_dir(self, dbfs_path):
        response = self._databricks_api_request(
            endpoint=GET_STATUS_ENDPOINT, method="GET", params={"path": dbfs_path}
        )
        json_response = json.loads(response.text)
        try:
            return json_response["is_dir"]
        except KeyError:
            raise MlflowException(f"DBFS path {dbfs_path} does not exist")

    def _get_dbfs_path(self, artifact_path):
        return "/{}/{}".format(
            strip_scheme(self.artifact_uri).lstrip("/"),
            artifact_path.lstrip("/"),
        )

    def _get_dbfs_endpoint(self, artifact_path):
        return f"/dbfs{self._get_dbfs_path(artifact_path)}"

    def log_artifact(self, local_file, artifact_path=None):
        basename = os.path.basename(local_file)
        if artifact_path:
            http_endpoint = self._get_dbfs_endpoint(posixpath.join(artifact_path, basename))
        else:
            http_endpoint = self._get_dbfs_endpoint(basename)
        if os.stat(local_file).st_size == 0:
            # The API frontend doesn't like it when we post empty files to it using
            # `requests.request`, potentially due to the bug described in
            # https://github.com/requests/requests/issues/4215
            self._databricks_api_request(
                endpoint=http_endpoint, method="POST", data="", allow_redirects=False
            )
        else:
            with open(local_file, "rb") as f:
                self._databricks_api_request(
                    endpoint=http_endpoint, method="POST", data=f, allow_redirects=False
                )

    def log_artifacts(self, local_dir, artifact_path=None):
        artifact_path = artifact_path or ""
        for dirpath, _, filenames in os.walk(local_dir):
            artifact_subdir = artifact_path
            if dirpath != local_dir:
                rel_path = os.path.relpath(dirpath, local_dir)
                rel_path = relative_path_to_artifact_path(rel_path)
                artifact_subdir = posixpath.join(artifact_path, rel_path)
            for name in filenames:
                file_path = os.path.join(dirpath, name)
                self.log_artifact(file_path, artifact_subdir)

    def list_artifacts(self, path: str | None = None) -> list[FileInfo]:
        dbfs_path = self._get_dbfs_path(path) if path else self._get_dbfs_path("")
        dbfs_list_json = {"path": dbfs_path}
        response = self._dbfs_list_api(dbfs_list_json)
        try:
            json_response = json.loads(response.text)
        except ValueError:
            raise MlflowException(
                f"API request to list files under DBFS path {dbfs_path} failed with "
                f"status code {response.status_code}. Response body: {response.text}"
            )
        # /api/2.0/dbfs/list will not have the 'files' key in the response for empty directories.
        infos = []
        artifact_prefix = strip_prefix(self.artifact_uri, "dbfs:")
        if json_response.get("error_code", None) == RESOURCE_NON_EXISTENT:
            return []
        dbfs_files = json_response.get("files", [])
        for dbfs_file in dbfs_files:
            stripped_path = strip_prefix(dbfs_file["path"], artifact_prefix + "/")
            # If `path` is a file, the DBFS list API returns a single list element with the
            # same name as `path`. The list_artifacts API expects us to return an empty list in this
            # case, so we do so here.
            if stripped_path == path:
                return []
            is_dir = dbfs_file["is_dir"]
            artifact_size = None if is_dir else dbfs_file["file_size"]
            infos.append(FileInfo(stripped_path, is_dir, artifact_size))
        return sorted(infos, key=lambda f: f.path)

    def _download_file(self, remote_file_path, local_path):
        self._dbfs_download(
            output_path=local_path, endpoint=self._get_dbfs_endpoint(remote_file_path)
        )

    def delete_artifacts(self, artifact_path=None):
        raise MlflowException("Not implemented yet")


def _get_host_creds_from_default_store():
    store = utils._get_store()
    if not isinstance(store, RestStore):
        raise MlflowException(
            "Failed to get credentials for DBFS; they are read from the "
            + "Databricks CLI credentials or MLFLOW_TRACKING* environment "
            + "variables."
        )
    return store.get_host_creds


def dbfs_artifact_repo_factory(
    artifact_uri: str, tracking_uri: str | None = None, registry_uri: str | None = None
):
    """
    Returns an ArtifactRepository subclass for storing artifacts on DBFS.

    This factory method is used with URIs of the form ``dbfs:/<path>``. DBFS-backed artifact
    storage can only be used together with the RestStore.

    In the special case where the URI is of the form
    `dbfs:/databricks/mlflow-tracking/<Exp-ID>/<Run-ID>/<path>',
    a DatabricksArtifactRepository is returned. This is capable of storing access controlled
    artifacts.

    Args:
        artifact_uri: DBFS root artifact URI.
        tracking_uri: The tracking URI.
        registry_uri: The registry URI.

    Returns:
        Subclass of ArtifactRepository capable of storing artifacts on DBFS.
    """
    if not is_valid_dbfs_uri(artifact_uri):
        raise MlflowException(
            "DBFS URI must be of the form dbfs:/<path> or "
            + "dbfs://profile@databricks/<path>, but received "
            + artifact_uri
        )

    cleaned_artifact_uri = artifact_uri.rstrip("/")
    db_profile_uri = get_databricks_profile_uri_from_artifact_uri(cleaned_artifact_uri)
    if is_databricks_acled_artifacts_uri(artifact_uri):
        if DatabricksLoggedModelArtifactRepository.is_logged_model_uri(artifact_uri):
            return DatabricksLoggedModelArtifactRepository(
                cleaned_artifact_uri, tracking_uri=tracking_uri, registry_uri=registry_uri
            )
        elif (
            not MLFLOW_DISABLE_DATABRICKS_SDK_FOR_RUN_ARTIFACTS.get()
            and DatabricksRunArtifactRepository.is_run_uri(artifact_uri)
        ):
            return DatabricksRunArtifactRepository(
                cleaned_artifact_uri, tracking_uri=tracking_uri, registry_uri=registry_uri
            )
        return DatabricksArtifactRepository(
            cleaned_artifact_uri, tracking_uri=tracking_uri, registry_uri=registry_uri
        )
    elif (
        mlflow.utils.databricks_utils.is_dbfs_fuse_available()
        and MLFLOW_ENABLE_DBFS_FUSE_ARTIFACT_REPO.get()
        and not is_databricks_model_registry_artifacts_uri(artifact_uri)
        and (db_profile_uri is None or db_profile_uri == "databricks")
    ):
        # If the DBFS FUSE mount is available, write artifacts directly to
        # /dbfs/... using local filesystem APIs.
        # Note: it is possible for a named Databricks profile to point to the current workspace,
        # but we're going to avoid doing a complex check and assume users will use `databricks`
        # to mean the current workspace. Using `DbfsRestArtifactRepository` to access the current
        # workspace's DBFS should still work; it just may be slower.
        final_artifact_uri = remove_databricks_profile_info_from_artifact_uri(cleaned_artifact_uri)
        file_uri = "file:///dbfs/{}".format(strip_prefix(final_artifact_uri, "dbfs:/"))
        return LocalArtifactRepository(
            file_uri, tracking_uri=tracking_uri, registry_uri=registry_uri
        )
    return DbfsRestArtifactRepository(
        cleaned_artifact_uri, tracking_uri=tracking_uri, registry_uri=registry_uri
    )
```

--------------------------------------------------------------------------------

---[FILE: ftp_artifact_repo.py]---
Location: mlflow-master/mlflow/store/artifact/ftp_artifact_repo.py

```python
import ftplib
import os
import posixpath
import urllib.parse
from contextlib import contextmanager
from ftplib import FTP
from urllib.parse import unquote

from mlflow.entities.file_info import FileInfo
from mlflow.exceptions import MlflowException
from mlflow.store.artifact.artifact_repo import ArtifactRepository
from mlflow.utils.file_utils import relative_path_to_artifact_path


class FTPArtifactRepository(ArtifactRepository):
    """Stores artifacts as files in a remote directory, via ftp."""

    def __init__(
        self, artifact_uri: str, tracking_uri: str | None = None, registry_uri: str | None = None
    ) -> None:
        super().__init__(artifact_uri, tracking_uri, registry_uri)
        parsed = urllib.parse.urlparse(artifact_uri)
        self.config = {
            "host": parsed.hostname,
            "port": 21 if parsed.port is None else parsed.port,
            "username": parsed.username,
            "password": parsed.password,
        }
        self.path = parsed.path or "/"

        if self.config["host"] is None:
            self.config["host"] = "localhost"
        if self.config["password"] is None:
            self.config["password"] = ""
        else:
            self.config["password"] = unquote(parsed.password)

    @contextmanager
    def get_ftp_client(self):
        ftp = FTP()
        ftp.connect(self.config["host"], self.config["port"])
        ftp.login(self.config["username"], self.config["password"])
        yield ftp
        ftp.close()

    @staticmethod
    def _is_dir(ftp, full_file_path):
        try:
            ftp.cwd(full_file_path)
            return True
        except ftplib.error_perm:
            return False

    @staticmethod
    def _mkdir(ftp, artifact_dir):
        try:
            if not FTPArtifactRepository._is_dir(ftp, artifact_dir):
                ftp.mkd(artifact_dir)
        except ftplib.error_perm:
            head, _ = posixpath.split(artifact_dir)
            FTPArtifactRepository._mkdir(ftp, head)
            FTPArtifactRepository._mkdir(ftp, artifact_dir)

    @staticmethod
    def _size(ftp, full_file_path):
        ftp.voidcmd("TYPE I")
        size = ftp.size(full_file_path)
        ftp.voidcmd("TYPE A")
        return size

    def log_artifact(self, local_file, artifact_path=None):
        with self.get_ftp_client() as ftp:
            artifact_dir = posixpath.join(self.path, artifact_path) if artifact_path else self.path
            self._mkdir(ftp, artifact_dir)
            with open(local_file, "rb") as f:
                ftp.cwd(artifact_dir)
                ftp.storbinary("STOR " + os.path.basename(local_file), f)

    def log_artifacts(self, local_dir, artifact_path=None):
        dest_path = posixpath.join(self.path, artifact_path) if artifact_path else self.path

        local_dir = os.path.abspath(local_dir)
        for root, _, filenames in os.walk(local_dir):
            upload_path = dest_path
            if root != local_dir:
                rel_path = os.path.relpath(root, local_dir)
                rel_upload_path = relative_path_to_artifact_path(rel_path)
                upload_path = posixpath.join(dest_path, rel_upload_path)
            if not filenames:
                with self.get_ftp_client() as ftp:
                    self._mkdir(ftp, upload_path)
            for f in filenames:
                if os.path.isfile(os.path.join(root, f)):
                    self.log_artifact(os.path.join(root, f), upload_path)

    def _is_directory(self, artifact_path):
        artifact_dir = self.path
        list_dir = posixpath.join(artifact_dir, artifact_path) if artifact_path else artifact_dir
        with self.get_ftp_client() as ftp:
            return self._is_dir(ftp, list_dir)

    def list_artifacts(self, path=None):
        with self.get_ftp_client() as ftp:
            artifact_dir = self.path
            list_dir = posixpath.join(artifact_dir, path) if path else artifact_dir
            if not self._is_dir(ftp, list_dir):
                return []
            artifact_files = ftp.nlst(list_dir)
            # Make sure artifact_files is a list of file names because ftp.nlst
            # may return absolute paths.
            artifact_files = [os.path.basename(f) for f in artifact_files]
            artifact_files = list(filter(lambda x: x not in {".", ".."}, artifact_files))
            infos = []
            for file_name in artifact_files:
                file_path = file_name if path is None else posixpath.join(path, file_name)
                full_file_path = posixpath.join(list_dir, file_name)
                if self._is_dir(ftp, full_file_path):
                    infos.append(FileInfo(file_path, True, None))
                else:
                    size = self._size(ftp, full_file_path)
                    infos.append(FileInfo(file_path, False, size))
        return infos

    def _download_file(self, remote_file_path, local_path):
        remote_full_path = (
            posixpath.join(self.path, remote_file_path) if remote_file_path else self.path
        )
        with self.get_ftp_client() as ftp:
            with open(local_path, "wb") as f:
                ftp.retrbinary("RETR " + remote_full_path, f.write)

    def delete_artifacts(self, artifact_path=None):
        raise MlflowException("Not implemented yet")
```

--------------------------------------------------------------------------------

---[FILE: gcs_artifact_repo.py]---
Location: mlflow-master/mlflow/store/artifact/gcs_artifact_repo.py

```python
import datetime
import importlib.metadata
import os
import posixpath
import urllib.parse
from typing import Any, NamedTuple

from packaging.version import Version

from mlflow.entities import FileInfo
from mlflow.entities.multipart_upload import (
    CreateMultipartUploadResponse,
    MultipartUploadCredential,
)
from mlflow.environment_variables import (
    MLFLOW_ARTIFACT_UPLOAD_DOWNLOAD_TIMEOUT,
    MLFLOW_GCS_DOWNLOAD_CHUNK_SIZE,
    MLFLOW_GCS_UPLOAD_CHUNK_SIZE,
)
from mlflow.exceptions import _UnsupportedMultipartUploadException
from mlflow.store.artifact.artifact_repo import (
    ArtifactRepository,
    MultipartUploadMixin,
    _retry_with_new_creds,
)
from mlflow.utils.file_utils import relative_path_to_artifact_path


class GCSMPUArguments(NamedTuple):
    transport: Any
    url: str
    headers: dict[str, str]
    content_type: str


class GCSArtifactRepository(ArtifactRepository, MultipartUploadMixin):
    """
    Stores artifacts on Google Cloud Storage.

    Args:
        artifact_uri: URI of GCS bucket
        client: Optional. The client to use for GCS operations; a default
            client object will be created if unspecified, using default
            credentials as described in https://google-cloud.readthedocs.io/en/latest/core/auth.html
    """

    def __init__(
        self,
        artifact_uri: str,
        client=None,
        credential_refresh_def=None,
        tracking_uri: str | None = None,
        registry_uri: str | None = None,
    ) -> None:
        super().__init__(artifact_uri, tracking_uri, registry_uri)
        from google.auth.exceptions import DefaultCredentialsError
        from google.cloud import storage as gcs_storage
        from google.cloud.storage.constants import _DEFAULT_TIMEOUT

        self._GCS_DOWNLOAD_CHUNK_SIZE = MLFLOW_GCS_DOWNLOAD_CHUNK_SIZE.get()
        self._GCS_UPLOAD_CHUNK_SIZE = MLFLOW_GCS_UPLOAD_CHUNK_SIZE.get()
        self._GCS_DEFAULT_TIMEOUT = (
            MLFLOW_ARTIFACT_UPLOAD_DOWNLOAD_TIMEOUT.get() or _DEFAULT_TIMEOUT
        )
        # Method to use for refresh
        self.credential_refresh_def = credential_refresh_def
        # If the user-supplied timeout environment variable value is -1,
        # use `None` for `self._GCS_DEFAULT_TIMEOUT`
        # to use indefinite timeout
        self._GCS_DEFAULT_TIMEOUT = (
            None if self._GCS_DEFAULT_TIMEOUT == -1 else self._GCS_DEFAULT_TIMEOUT
        )
        if client is not None:
            self.client = client
        else:
            try:
                self.client = gcs_storage.Client()
            except DefaultCredentialsError:
                self.client = gcs_storage.Client.create_anonymous_client()

    @staticmethod
    def parse_gcs_uri(uri):
        """Parse an GCS URI, returning (bucket, path)"""
        parsed = urllib.parse.urlparse(uri)
        if parsed.scheme != "gs":
            raise Exception(f"Not a GCS URI: {uri}")
        path = parsed.path
        path = path.removeprefix("/")
        return parsed.netloc, path

    def _get_bucket(self, bucket):
        return self.client.bucket(bucket)

    def _refresh_credentials(self):
        from google.cloud.storage import Client
        from google.oauth2.credentials import Credentials

        (bucket, _) = self.parse_gcs_uri(self.artifact_uri)
        if not self.credential_refresh_def:
            return self._get_bucket(bucket)
        new_token = self.credential_refresh_def()
        credentials = Credentials(new_token["oauth_token"])
        self.client = Client(project="mlflow", credentials=credentials)
        return self._get_bucket(bucket)

    def log_artifact(self, local_file, artifact_path=None):
        (bucket, dest_path) = self.parse_gcs_uri(self.artifact_uri)
        if artifact_path:
            dest_path = posixpath.join(dest_path, artifact_path)
        dest_path = posixpath.join(dest_path, os.path.basename(local_file))

        gcs_bucket = self._get_bucket(bucket)
        blob = gcs_bucket.blob(dest_path, chunk_size=self._GCS_UPLOAD_CHUNK_SIZE)
        blob.upload_from_filename(local_file, timeout=self._GCS_DEFAULT_TIMEOUT)

    def log_artifacts(self, local_dir, artifact_path=None):
        (bucket, dest_path) = self.parse_gcs_uri(self.artifact_uri)
        if artifact_path:
            dest_path = posixpath.join(dest_path, artifact_path)

        local_dir = os.path.abspath(local_dir)

        for root, _, filenames in os.walk(local_dir):
            upload_path = dest_path
            if root != local_dir:
                rel_path = os.path.relpath(root, local_dir)
                rel_path = relative_path_to_artifact_path(rel_path)
                upload_path = posixpath.join(dest_path, rel_path)
            for f in filenames:
                gcs_bucket = self._get_bucket(bucket)
                path = posixpath.join(upload_path, f)
                # For large models, we need to speculatively retry a credential refresh
                # and throw if it still fails.  We cannot use the built-in refresh because UC
                # does not return a refresh token with the oauth token
                file_name = os.path.join(root, f)

                def try_func(gcs_bucket):
                    gcs_bucket.blob(
                        path, chunk_size=self._GCS_UPLOAD_CHUNK_SIZE
                    ).upload_from_filename(file_name, timeout=self._GCS_DEFAULT_TIMEOUT)

                _retry_with_new_creds(
                    try_func=try_func, creds_func=self._refresh_credentials, orig_creds=gcs_bucket
                )

    def list_artifacts(self, path=None):
        (bucket, artifact_path) = self.parse_gcs_uri(self.artifact_uri)
        dest_path = artifact_path
        if path:
            dest_path = posixpath.join(dest_path, path)
        prefix = dest_path if dest_path.endswith("/") else dest_path + "/"

        bkt = self._get_bucket(bucket)

        infos = self._list_folders(bkt, prefix, artifact_path)

        results = bkt.list_blobs(prefix=prefix, delimiter="/")
        for result in results:
            # skip blobs matching current directory path as list_blobs api
            # returns subdirectories as well
            if result.name == prefix:
                continue
            blob_path = result.name[len(artifact_path) + 1 :]
            infos.append(FileInfo(blob_path, False, result.size))

        return sorted(infos, key=lambda f: f.path)

    def _list_folders(self, bkt, prefix, artifact_path):
        results = bkt.list_blobs(prefix=prefix, delimiter="/")
        dir_paths = set()
        for page in results.pages:
            dir_paths.update(page.prefixes)

        return [FileInfo(path[len(artifact_path) + 1 : -1], True, None) for path in dir_paths]

    def _download_file(self, remote_file_path, local_path):
        (bucket, remote_root_path) = self.parse_gcs_uri(self.artifact_uri)
        remote_full_path = posixpath.join(remote_root_path, remote_file_path)
        gcs_bucket = self._get_bucket(bucket)
        gcs_bucket.blob(
            remote_full_path, chunk_size=self._GCS_DOWNLOAD_CHUNK_SIZE
        ).download_to_filename(local_path, timeout=self._GCS_DEFAULT_TIMEOUT)

    def delete_artifacts(self, artifact_path=None):
        (bucket_name, dest_path) = self.parse_gcs_uri(self.artifact_uri)
        if artifact_path:
            dest_path = posixpath.join(dest_path, artifact_path)

        gcs_bucket = self._get_bucket(bucket_name)
        blobs = gcs_bucket.list_blobs(prefix=f"{dest_path}")
        for blob in blobs:
            blob.delete()

    @staticmethod
    def _validate_support_mpu():
        if Version(importlib.metadata.version("google-cloud-storage")) < Version(
            "2.12.0"
        ) or Version(importlib.metadata.version("google-resumable-media")) < Version("2.6.0"):
            raise _UnsupportedMultipartUploadException()

    @staticmethod
    def _gcs_mpu_arguments(filename: str, blob) -> GCSMPUArguments:
        """See :py:func:`google.cloud.storage.transfer_manager.upload_chunks_concurrently`"""
        from google.cloud.storage.transfer_manager import _headers_from_metadata

        bucket = blob.bucket
        client = blob.client
        transport = blob._get_transport(client)

        hostname = client._connection.get_api_base_url_for_mtls()
        url = f"{hostname}/{bucket.name}/{blob.name}"

        base_headers, object_metadata, content_type = blob._get_upload_arguments(
            client, None, filename=filename, command="tm.upload_sharded"
        )
        headers = {**base_headers, **_headers_from_metadata(object_metadata)}

        if blob.user_project is not None:
            headers["x-goog-user-project"] = blob.user_project

        if blob.kms_key_name is not None and "cryptoKeyVersions" not in blob.kms_key_name:
            headers["x-goog-encryption-kms-key-name"] = blob.kms_key_name

        return GCSMPUArguments(
            transport=transport, url=url, headers=headers, content_type=content_type
        )

    def create_multipart_upload(self, local_file, num_parts=1, artifact_path=None):
        self._validate_support_mpu()
        from google.resumable_media.requests import XMLMPUContainer

        (bucket, dest_path) = self.parse_gcs_uri(self.artifact_uri)
        if artifact_path:
            dest_path = posixpath.join(dest_path, artifact_path)
        dest_path = posixpath.join(dest_path, os.path.basename(local_file))

        gcs_bucket = self._get_bucket(bucket)
        blob = gcs_bucket.blob(dest_path)
        args = self._gcs_mpu_arguments(local_file, blob)
        container = XMLMPUContainer(args.url, local_file, headers=args.headers)
        container.initiate(transport=args.transport, content_type=args.content_type)
        upload_id = container.upload_id

        credentials = []
        for i in range(1, num_parts + 1):  # part number must be in [1, 10000]
            signed_url = blob.generate_signed_url(
                method="PUT",
                version="v4",
                expiration=datetime.timedelta(minutes=60),
                query_parameters={
                    "partNumber": i,
                    "uploadId": upload_id,
                },
            )
            credentials.append(
                MultipartUploadCredential(
                    url=signed_url,
                    part_number=i,
                    headers={},
                )
            )
        return CreateMultipartUploadResponse(
            credentials=credentials,
            upload_id=upload_id,
        )

    def complete_multipart_upload(self, local_file, upload_id, parts=None, artifact_path=None):
        self._validate_support_mpu()
        from google.resumable_media.requests import XMLMPUContainer

        (bucket, dest_path) = self.parse_gcs_uri(self.artifact_uri)
        if artifact_path:
            dest_path = posixpath.join(dest_path, artifact_path)
        dest_path = posixpath.join(dest_path, os.path.basename(local_file))

        gcs_bucket = self._get_bucket(bucket)
        blob = gcs_bucket.blob(dest_path)
        args = self._gcs_mpu_arguments(local_file, blob)
        container = XMLMPUContainer(args.url, local_file, headers=args.headers)
        container._upload_id = upload_id
        for part in parts:
            container.register_part(part.part_number, part.etag)

        container.finalize(transport=args.transport)

    def abort_multipart_upload(self, local_file, upload_id, artifact_path=None):
        self._validate_support_mpu()
        from google.resumable_media.requests import XMLMPUContainer

        (bucket, dest_path) = self.parse_gcs_uri(self.artifact_uri)
        if artifact_path:
            dest_path = posixpath.join(dest_path, artifact_path)
        dest_path = posixpath.join(dest_path, os.path.basename(local_file))

        gcs_bucket = self._get_bucket(bucket)
        blob = gcs_bucket.blob(dest_path)
        args = self._gcs_mpu_arguments(local_file, blob)
        container = XMLMPUContainer(args.url, local_file, headers=args.headers)
        container._upload_id = upload_id
        container.cancel(transport=args.transport)
```

--------------------------------------------------------------------------------

---[FILE: hdfs_artifact_repo.py]---
Location: mlflow-master/mlflow/store/artifact/hdfs_artifact_repo.py

```python
import os
import posixpath
import urllib.parse
from contextlib import contextmanager

try:
    from pyarrow.fs import FileSelector, FileType, HadoopFileSystem
except ImportError:
    pass

from mlflow.entities import FileInfo
from mlflow.environment_variables import (
    MLFLOW_KERBEROS_TICKET_CACHE,
    MLFLOW_KERBEROS_USER,
    MLFLOW_PYARROW_EXTRA_CONF,
)
from mlflow.store.artifact.artifact_repo import ArtifactRepository
from mlflow.utils.file_utils import relative_path_to_artifact_path


class HdfsArtifactRepository(ArtifactRepository):
    """
    Stores artifacts on HDFS.

    This repository is used with URIs of the form ``hdfs:/<path>``. The repository can only be used
    together with the RestStore.
    """

    def __init__(
        self, artifact_uri: str, tracking_uri: str | None = None, registry_uri: str | None = None
    ) -> None:
        super().__init__(artifact_uri, tracking_uri, registry_uri)
        self.scheme, self.host, self.port, self.path = _resolve_connection_params(artifact_uri)

    def log_artifact(self, local_file, artifact_path=None):
        """
        Log artifact in hdfs.

        Args:
            local_file: Source file path.
            artifact_path: When specified will attempt to write under artifact_uri/artifact_path.
        """
        hdfs_base_path = _resolve_base_path(self.path, artifact_path)

        with hdfs_system(scheme=self.scheme, host=self.host, port=self.port) as hdfs:
            _, file_name = os.path.split(local_file)
            destination_path = posixpath.join(hdfs_base_path, file_name)
            with open(local_file, "rb") as source:
                with hdfs.open_output_stream(destination_path) as destination:
                    destination.write(source.read())

    def log_artifacts(self, local_dir, artifact_path=None):
        """
        Log artifacts in hdfs.
        Missing remote sub-directories will be created if needed.

        Args:
            local_dir: Source dir path.
            artifact_path: When specified will attempt to write under artifact_uri/artifact_path.
        """
        hdfs_base_path = _resolve_base_path(self.path, artifact_path)

        with hdfs_system(scheme=self.scheme, host=self.host, port=self.port) as hdfs:
            if not hdfs.get_file_info(hdfs_base_path).type == FileType.Directory:
                hdfs.create_dir(hdfs_base_path, recursive=True)

            for subdir_path, _, files in os.walk(local_dir):
                relative_path = _relative_path_local(local_dir, subdir_path)

                hdfs_subdir_path = (
                    posixpath.join(hdfs_base_path, relative_path)
                    if relative_path
                    else hdfs_base_path
                )

                if not hdfs.get_file_info(hdfs_subdir_path).type == FileType.Directory:
                    hdfs.create_dir(hdfs_subdir_path, recursive=True)

                for each_file in files:
                    source_path = os.path.join(subdir_path, each_file)
                    destination_path = posixpath.join(hdfs_subdir_path, each_file)
                    with open(source_path, "rb") as source:
                        with hdfs.open_output_stream(destination_path) as destination:
                            destination.write(source.read())

    def list_artifacts(self, path=None):
        """
        Lists files and directories under artifacts directory for the current run_id.
        (self.path contains the base path - hdfs:/some/path/run_id/artifacts)

        Args:
            path: Relative source path. Possible subdirectory existing under
                hdfs:/some/path/run_id/artifacts

        Returns:
            List of FileInfos under given path
        """
        hdfs_base_path = _resolve_base_path(self.path, path)

        with hdfs_system(scheme=self.scheme, host=self.host, port=self.port) as hdfs:
            paths = []
            base_info = hdfs.get_file_info(hdfs_base_path)
            if base_info.type == FileType.Directory:
                selector = FileSelector(hdfs_base_path)
            elif base_info.type == FileType.File:
                selector = [hdfs_base_path]
            else:
                return []

            for file_detail in hdfs.get_file_info(selector):
                file_name = file_detail.path

                # file_name is hdfs_base_path and not a child of that path
                if file_name == hdfs_base_path:
                    continue

                # Strip off anything that comes before the artifact root e.g. hdfs://name
                offset = file_name.index(self.path)
                rel_path = _relative_path_remote(self.path, file_name[offset:])
                is_dir = file_detail.type == FileType.Directory
                size = file_detail.size
                paths.append(FileInfo(rel_path, is_dir=is_dir, file_size=size))
            return sorted(paths, key=lambda f: paths)

    def _is_directory(self, artifact_path):
        hdfs_base_path = _resolve_base_path(self.path, artifact_path)
        with hdfs_system(scheme=self.scheme, host=self.host, port=self.port) as hdfs:
            return hdfs.get_file_info(hdfs_base_path).type == FileType.Directory

    def _download_file(self, remote_file_path, local_path):
        hdfs_base_path = _resolve_base_path(self.path, remote_file_path)
        with hdfs_system(scheme=self.scheme, host=self.host, port=self.port) as hdfs:
            with hdfs.open_input_stream(hdfs_base_path) as source:
                with open(local_path, "wb") as destination:
                    destination.write(source.read())

    def delete_artifacts(self, artifact_path=None):
        path = posixpath.join(self.path, artifact_path) if artifact_path else self.path
        with hdfs_system(scheme=self.scheme, host=self.host, port=self.port) as hdfs:
            file_info = hdfs.get_file_info(path)
            if file_info.type == FileType.File:
                hdfs.delete_file(path)
            elif file_info.type == FileType.Directory:
                hdfs.delete_dir_contents(path)


@contextmanager
def hdfs_system(scheme, host, port):
    """
    hdfs system context - Attempt to establish the connection to hdfs
    and yields HadoopFileSystem

    Args:
        scheme: scheme or use hdfs:// as default
        host: hostname or when relaying on the core-site.xml config use 'default'
        port: port or when relaying on the core-site.xml config use 0
    """
    kerb_ticket = MLFLOW_KERBEROS_TICKET_CACHE.get()
    kerberos_user = MLFLOW_KERBEROS_USER.get()
    extra_conf = _parse_extra_conf(MLFLOW_PYARROW_EXTRA_CONF.get())

    host = scheme + "://" + host if host else "default"

    yield HadoopFileSystem(
        host=host,
        port=port or 0,
        user=kerberos_user,
        kerb_ticket=kerb_ticket,
        extra_conf=extra_conf,
    )


def _resolve_connection_params(artifact_uri):
    parsed = urllib.parse.urlparse(artifact_uri)

    return parsed.scheme, parsed.hostname, parsed.port, parsed.path


def _resolve_base_path(path, artifact_path):
    if path == artifact_path:
        return path
    if artifact_path:
        return posixpath.join(path, artifact_path)
    return path


def _relative_path(base_dir, subdir_path, path_module):
    relative_path = path_module.relpath(subdir_path, base_dir)
    return relative_path if relative_path != "." else None


def _relative_path_local(base_dir, subdir_path):
    rel_path = _relative_path(base_dir, subdir_path, os.path)
    return relative_path_to_artifact_path(rel_path) if rel_path is not None else None


def _relative_path_remote(base_dir, subdir_path):
    return _relative_path(base_dir, subdir_path, posixpath)


def _parse_extra_conf(extra_conf):
    if extra_conf:

        def as_pair(config):
            key, val = config.split("=")
            return key, val

        list_of_key_val = [as_pair(conf) for conf in extra_conf.split(",")]
        return dict(list_of_key_val)
    return None
```

--------------------------------------------------------------------------------

````
