---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 672
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 672 of 991)

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

---[FILE: http_artifact_repo.py]---
Location: mlflow-master/mlflow/store/artifact/http_artifact_repo.py

```python
import logging
import os
import posixpath

import requests
from requests import HTTPError

from mlflow.entities import FileInfo
from mlflow.entities.multipart_upload import (
    CreateMultipartUploadResponse,
    MultipartUploadCredential,
    MultipartUploadPart,
)
from mlflow.environment_variables import (
    MLFLOW_ENABLE_PROXY_MULTIPART_UPLOAD,
    MLFLOW_MULTIPART_UPLOAD_CHUNK_SIZE,
    MLFLOW_MULTIPART_UPLOAD_MINIMUM_FILE_SIZE,
)
from mlflow.exceptions import MlflowException, _UnsupportedMultipartUploadException
from mlflow.store.artifact.artifact_repo import (
    ArtifactRepository,
    MultipartUploadMixin,
    verify_artifact_path,
)
from mlflow.store.artifact.cloud_artifact_repo import _complete_futures, _compute_num_chunks
from mlflow.utils.credentials import get_default_host_creds
from mlflow.utils.file_utils import read_chunk, relative_path_to_artifact_path
from mlflow.utils.mime_type_utils import _guess_mime_type
from mlflow.utils.rest_utils import augmented_raise_for_status, http_request
from mlflow.utils.uri import validate_path_is_safe

_logger = logging.getLogger(__name__)


class HttpArtifactRepository(ArtifactRepository, MultipartUploadMixin):
    """Stores artifacts in a remote artifact storage using HTTP requests"""

    @property
    def _host_creds(self):
        return get_default_host_creds(self.artifact_uri)

    def log_artifact(self, local_file, artifact_path=None):
        verify_artifact_path(artifact_path)

        # Try to perform multipart upload if the file is large.
        # If the server does not support, or if the upload failed, revert to normal upload.
        if (
            MLFLOW_ENABLE_PROXY_MULTIPART_UPLOAD.get()
            and os.path.getsize(local_file) >= MLFLOW_MULTIPART_UPLOAD_MINIMUM_FILE_SIZE.get()
        ):
            try:
                self._try_multipart_upload(local_file, artifact_path)
                return
            except _UnsupportedMultipartUploadException:
                pass

        file_name = os.path.basename(local_file)
        mime_type = _guess_mime_type(file_name)
        paths = (artifact_path, file_name) if artifact_path else (file_name,)
        endpoint = posixpath.join("/", *paths)
        extra_headers = {"Content-Type": mime_type}
        with open(local_file, "rb") as f:
            resp = http_request(
                self._host_creds, endpoint, "PUT", data=f, extra_headers=extra_headers
            )
            augmented_raise_for_status(resp)

    def log_artifacts(self, local_dir, artifact_path=None):
        local_dir = os.path.abspath(local_dir)
        for root, _, filenames in os.walk(local_dir):
            if root == local_dir:
                artifact_dir = artifact_path
            else:
                rel_path = os.path.relpath(root, local_dir)
                rel_path = relative_path_to_artifact_path(rel_path)
                artifact_dir = (
                    posixpath.join(artifact_path, rel_path) if artifact_path else rel_path
                )
            for f in filenames:
                self.log_artifact(os.path.join(root, f), artifact_dir)

    def list_artifacts(self, path=None):
        endpoint = "/mlflow-artifacts/artifacts"
        url, tail = self.artifact_uri.split(endpoint, maxsplit=1)
        root = tail.lstrip("/")
        params = {"path": posixpath.join(root, path) if path else root}
        host_creds = get_default_host_creds(url)
        resp = http_request(host_creds, endpoint, "GET", params=params)
        augmented_raise_for_status(resp)
        file_infos = []
        for f in resp.json().get("files", []):
            validated_path = validate_path_is_safe(f["path"])
            file_info = FileInfo(
                posixpath.join(path, validated_path) if path else validated_path,
                f["is_dir"],
                int(f["file_size"]) if ("file_size" in f) else None,
            )
            file_infos.append(file_info)

        return sorted(file_infos, key=lambda f: f.path)

    def _download_file(self, remote_file_path, local_path):
        endpoint = posixpath.join("/", remote_file_path)
        resp = http_request(self._host_creds, endpoint, "GET", stream=True)
        augmented_raise_for_status(resp)
        with open(local_path, "wb") as f:
            chunk_size = 1024 * 1024  # 1 MB
            for chunk in resp.iter_content(chunk_size=chunk_size):
                f.write(chunk)

    def delete_artifacts(self, artifact_path=None):
        endpoint = posixpath.join("/", artifact_path) if artifact_path else "/"
        resp = http_request(self._host_creds, endpoint, "DELETE", stream=True)
        augmented_raise_for_status(resp)

    def _construct_mpu_uri_and_path(self, base_endpoint, artifact_path):
        uri, path = self.artifact_uri.split("/mlflow-artifacts/artifacts", maxsplit=1)
        path = path.strip("/")
        endpoint = (
            posixpath.join(base_endpoint, path, artifact_path)
            if artifact_path
            else posixpath.join(base_endpoint, path)
        )
        return uri, endpoint

    def create_multipart_upload(self, local_file, num_parts=1, artifact_path=None):
        uri, endpoint = self._construct_mpu_uri_and_path(
            "/mlflow-artifacts/mpu/create", artifact_path
        )
        host_creds = get_default_host_creds(uri)
        params = {
            "path": local_file,
            "num_parts": num_parts,
        }
        resp = http_request(host_creds, endpoint, "POST", json=params)
        augmented_raise_for_status(resp)
        return CreateMultipartUploadResponse.from_dict(resp.json())

    def complete_multipart_upload(self, local_file, upload_id, parts=None, artifact_path=None):
        uri, endpoint = self._construct_mpu_uri_and_path(
            "/mlflow-artifacts/mpu/complete", artifact_path
        )
        host_creds = get_default_host_creds(uri)
        params = {
            "path": local_file,
            "upload_id": upload_id,
            "parts": [part.to_dict() for part in parts],
        }
        resp = http_request(host_creds, endpoint, "POST", json=params)
        augmented_raise_for_status(resp)

    def abort_multipart_upload(self, local_file, upload_id, artifact_path=None):
        uri, endpoint = self._construct_mpu_uri_and_path(
            "/mlflow-artifacts/mpu/abort", artifact_path
        )
        host_creds = get_default_host_creds(uri)
        params = {
            "path": local_file,
            "upload_id": upload_id,
        }
        resp = http_request(host_creds, endpoint, "POST", json=params)
        augmented_raise_for_status(resp)

    @staticmethod
    def _upload_part(credential: MultipartUploadCredential, local_file, size, start_byte):
        data = read_chunk(local_file, size, start_byte)
        response = requests.put(credential.url, data=data, headers=credential.headers)
        augmented_raise_for_status(response)
        return MultipartUploadPart(
            part_number=credential.part_number,
            etag=response.headers.get("ETag", ""),
            url=credential.url,
        )

    def _try_multipart_upload(self, local_file, artifact_path=None):
        """
        Attempts to perform multipart upload to log an artifact.
        Returns if the multipart upload is successful.
        Raises UnsupportedMultipartUploadException if multipart upload is unsupported.
        """
        chunk_size = MLFLOW_MULTIPART_UPLOAD_CHUNK_SIZE.get()
        num_parts = _compute_num_chunks(local_file, chunk_size)

        try:
            create = self.create_multipart_upload(local_file, num_parts, artifact_path)
        except HTTPError as e:
            # return False if server does not support multipart upload
            error_message = e.response.json().get("message", "")
            if isinstance(error_message, str) and error_message.startswith(
                _UnsupportedMultipartUploadException.MESSAGE
            ):
                raise _UnsupportedMultipartUploadException()
            raise

        try:
            futures = {}
            for i, credential in enumerate(create.credentials):
                future = self.thread_pool.submit(
                    self._upload_part,
                    credential=credential,
                    local_file=local_file,
                    size=chunk_size,
                    start_byte=chunk_size * i,
                )
                futures[future] = credential.part_number

            parts, errors = _complete_futures(futures, local_file)
            if errors:
                raise MlflowException(
                    f"Failed to upload at least one part of {local_file}. Errors: {errors}"
                )

            parts = sorted(parts.values(), key=lambda part: part.part_number)
            self.complete_multipart_upload(local_file, create.upload_id, parts, artifact_path)
        except Exception as e:
            self.abort_multipart_upload(local_file, create.upload_id, artifact_path)
            _logger.warning(f"Failed to upload file {local_file} using multipart upload: {e}")
            raise
```

--------------------------------------------------------------------------------

---[FILE: local_artifact_repo.py]---
Location: mlflow-master/mlflow/store/artifact/local_artifact_repo.py

```python
import os
import shutil
from typing import Any

from mlflow.store.artifact.artifact_repo import (
    ArtifactRepository,
    try_read_trace_data,
    verify_artifact_path,
)
from mlflow.tracing.utils.artifact_utils import TRACE_DATA_FILE_NAME
from mlflow.utils.file_utils import (
    get_file_info,
    list_all,
    local_file_uri_to_path,
    mkdir,
    relative_path_to_artifact_path,
    shutil_copytree_without_file_permissions,
)
from mlflow.utils.uri import validate_path_is_safe, validate_path_within_directory


class LocalArtifactRepository(ArtifactRepository):
    """Stores artifacts as files in a local directory."""

    def __init__(
        self, artifact_uri: str, tracking_uri: str | None = None, registry_uri: str | None = None
    ) -> None:
        super().__init__(artifact_uri, tracking_uri, registry_uri)
        self._artifact_dir = local_file_uri_to_path(self.artifact_uri)

    @property
    def artifact_dir(self):
        return self._artifact_dir

    def log_artifact(self, local_file, artifact_path=None):
        verify_artifact_path(artifact_path)
        # NOTE: The artifact_path is expected to be in posix format.
        # Posix paths work fine on windows but just in case we normalize it here.
        if artifact_path:
            artifact_path = os.path.normpath(artifact_path)

        artifact_dir = (
            os.path.join(self.artifact_dir, artifact_path) if artifact_path else self.artifact_dir
        )
        if not os.path.exists(artifact_dir):
            mkdir(artifact_dir)
        try:
            shutil.copy2(local_file, os.path.join(artifact_dir, os.path.basename(local_file)))
        except shutil.SameFileError:
            pass

    def _is_directory(self, artifact_path):
        # NOTE: The path is expected to be in posix format.
        # Posix paths work fine on windows but just in case we normalize it here.
        path = os.path.normpath(artifact_path) if artifact_path else ""
        list_dir = os.path.join(self.artifact_dir, path) if path else self.artifact_dir
        return os.path.isdir(list_dir)

    def log_artifacts(self, local_dir, artifact_path=None):
        verify_artifact_path(artifact_path)
        # NOTE: The artifact_path is expected to be in posix format.
        # Posix paths work fine on windows but just in case we normalize it here.
        if artifact_path:
            artifact_path = os.path.normpath(artifact_path)
        artifact_dir = (
            os.path.join(self.artifact_dir, artifact_path) if artifact_path else self.artifact_dir
        )
        if not os.path.exists(artifact_dir):
            mkdir(artifact_dir)
        shutil_copytree_without_file_permissions(local_dir, artifact_dir)

    def download_artifacts(self, artifact_path, dst_path=None):
        """
        Artifacts tracked by ``LocalArtifactRepository`` already exist on the local filesystem.
        If ``dst_path`` is ``None``, the absolute filesystem path of the specified artifact is
        returned. If ``dst_path`` is not ``None``, the local artifact is copied to ``dst_path``.

        Args:
            artifact_path: Relative source path to the desired artifacts.
            dst_path: Absolute path of the local filesystem destination directory to which to
                download the specified artifacts. This directory must already exist. If
                unspecified, the absolute path of the local artifact will be returned.

        Returns:
            Absolute path of the local filesystem location containing the desired artifacts.
        """
        if dst_path:
            return super().download_artifacts(artifact_path, dst_path)
        artifact_path = validate_path_is_safe(artifact_path)
        local_artifact_path = os.path.join(self.artifact_dir, os.path.normpath(artifact_path))
        validate_path_within_directory(self.artifact_dir, local_artifact_path)
        if not os.path.exists(local_artifact_path):
            raise OSError(f"No such file or directory: '{local_artifact_path}'")
        return os.path.abspath(local_artifact_path)

    def list_artifacts(self, path=None):
        if path:
            path = os.path.normpath(path)
        list_dir = os.path.join(self.artifact_dir, path) if path else self.artifact_dir
        validate_path_within_directory(self.artifact_dir, list_dir)
        if os.path.isdir(list_dir):
            artifact_files = list_all(list_dir, full_path=True)
            infos = [
                get_file_info(
                    f, relative_path_to_artifact_path(os.path.relpath(f, self.artifact_dir))
                )
                for f in artifact_files
            ]
            return sorted(infos, key=lambda f: f.path)
        else:
            return []

    def _download_file(self, remote_file_path, local_path):
        remote_file_path = validate_path_is_safe(remote_file_path)
        remote_file_path = os.path.join(self.artifact_dir, os.path.normpath(remote_file_path))
        validate_path_within_directory(self.artifact_dir, remote_file_path)
        shutil.copy2(remote_file_path, local_path)

    def delete_artifacts(self, artifact_path=None):
        artifact_path = local_file_uri_to_path(
            os.path.join(self._artifact_dir, artifact_path) if artifact_path else self._artifact_dir
        )

        if os.path.exists(artifact_path):
            if os.path.isfile(artifact_path):
                os.remove(artifact_path)
            else:
                shutil.rmtree(artifact_path)

    def download_trace_data(self) -> dict[str, Any]:
        """
        Download the trace data.

        Returns:
            The trace data as a dictionary.

        Raises:
            - `MlflowTraceDataNotFound`: The trace data is not found.
            - `MlflowTraceDataCorrupted`: The trace data is corrupted.
        """
        trace_data_path = os.path.join(self.artifact_dir, TRACE_DATA_FILE_NAME)
        return try_read_trace_data(trace_data_path)
```

--------------------------------------------------------------------------------

---[FILE: mlflow_artifacts_repo.py]---
Location: mlflow-master/mlflow/store/artifact/mlflow_artifacts_repo.py

```python
import re
from urllib.parse import urlparse, urlunparse

from mlflow.exceptions import MlflowException
from mlflow.store.artifact.http_artifact_repo import HttpArtifactRepository
from mlflow.tracking._tracking_service.utils import get_tracking_uri


def _check_if_host_is_numeric(hostname):
    if hostname:
        try:
            float(hostname)
            return True
        except ValueError:
            return False
    else:
        return False


def _validate_port_mapped_to_hostname(uri_parse):
    # This check is to catch an mlflow-artifacts uri that has a port designated but no
    # hostname specified. `urllib.parse.urlparse` will treat such a uri as a filesystem
    # definition, mapping the provided port as a hostname value if this condition is not
    # validated.
    if uri_parse.hostname and _check_if_host_is_numeric(uri_parse.hostname) and not uri_parse.port:
        raise MlflowException(
            "The mlflow-artifacts uri was supplied with a port number: "
            f"{uri_parse.hostname}, but no host was defined."
        )


def _validate_uri_scheme(parsed_uri):
    allowable_schemes = {"http", "https"}
    if parsed_uri.scheme not in allowable_schemes:
        raise MlflowException(
            "When an mlflow-artifacts URI was supplied, the tracking URI must be a valid "
            f"http or https URI, but it was currently set to {parsed_uri.geturl()}. "
            "Perhaps you forgot to set the tracking URI to the running MLflow server. "
            "To set the tracking URI, use either of the following methods:\n"
            "1. Set the MLFLOW_TRACKING_URI environment variable to the desired tracking URI. "
            "`export MLFLOW_TRACKING_URI=http://localhost:5000`\n"
            "2. Set the tracking URI programmatically by calling `mlflow.set_tracking_uri`. "
            "`mlflow.set_tracking_uri('http://localhost:5000')`"
        )


class MlflowArtifactsRepository(HttpArtifactRepository):
    """Scheme wrapper around HttpArtifactRepository for mlflow-artifacts server functionality"""

    def __init__(
        self, artifact_uri: str, tracking_uri: str | None = None, registry_uri: str | None = None
    ) -> None:
        effective_tracking_uri = tracking_uri or get_tracking_uri()
        super().__init__(
            self.resolve_uri(artifact_uri, effective_tracking_uri), tracking_uri, registry_uri
        )

    @classmethod
    def resolve_uri(cls, artifact_uri, tracking_uri):
        base_url = "/api/2.0/mlflow-artifacts/artifacts"

        track_parse = urlparse(tracking_uri)

        uri_parse = urlparse(artifact_uri)

        # Check to ensure that a port is present with no hostname
        _validate_port_mapped_to_hostname(uri_parse)

        # Check that tracking uri is http or https
        _validate_uri_scheme(track_parse)

        if uri_parse.path == "/":  # root directory; build simple path
            resolved = f"{base_url}{uri_parse.path}"
        elif uri_parse.path == base_url:  # for operations like list artifacts
            resolved = base_url
        else:
            resolved = f"{track_parse.path}/{base_url}/{uri_parse.path}"
        resolved = re.sub(r"//+", "/", resolved)

        resolved_artifacts_uri = urlunparse(
            (
                # scheme
                track_parse.scheme,
                # netloc
                uri_parse.netloc or track_parse.netloc,
                # path
                resolved,
                # params
                "",
                # query
                "",
                # fragment
                "",
            )
        )

        return resolved_artifacts_uri.replace("///", "/").rstrip("/")
```

--------------------------------------------------------------------------------

---[FILE: models_artifact_repo.py]---
Location: mlflow-master/mlflow/store/artifact/models_artifact_repo.py

```python
import logging
import os
import urllib.parse
from pathlib import Path

import mlflow
from mlflow.exceptions import MlflowException
from mlflow.store.artifact.artifact_repo import ArtifactRepository
from mlflow.store.artifact.databricks_models_artifact_repo import DatabricksModelsArtifactRepository
from mlflow.store.artifact.unity_catalog_models_artifact_repo import (
    UnityCatalogModelsArtifactRepository,
)
from mlflow.store.artifact.unity_catalog_oss_models_artifact_repo import (
    UnityCatalogOSSModelsArtifactRepository,
)
from mlflow.store.artifact.utils.models import (
    _parse_model_uri,
    get_model_name_and_version,
    is_using_databricks_registry,
)
from mlflow.utils.uri import (
    add_databricks_profile_info_to_artifact_uri,
    get_databricks_profile_uri_from_artifact_uri,
    is_databricks_unity_catalog_uri,
    is_models_uri,
    is_oss_unity_catalog_uri,
)

REGISTERED_MODEL_META_FILE_NAME = "registered_model_meta"

_logger = logging.getLogger(__name__)


class ModelsArtifactRepository(ArtifactRepository):
    """
    Handles artifacts associated with a model version in the model registry via URIs of the form:
      - `models:/<model_name>/<model_version>`
      - `models:/<model_name>/<stage>`  (refers to the latest model version in the given stage)
      - `models:/<model_name>/latest` (refers to the latest of all model versions)
    It is a light wrapper that resolves the artifact path to an absolute URI then instantiates
    and uses the artifact repository for that URI.
    """

    def __init__(
        self, artifact_uri: str, tracking_uri: str | None = None, registry_uri: str | None = None
    ) -> None:
        from mlflow.store.artifact.artifact_repository_registry import get_artifact_repository

        super().__init__(artifact_uri, tracking_uri, registry_uri)
        registry_uri = registry_uri or mlflow.get_registry_uri()
        self.is_logged_model_uri = self._is_logged_model_uri(artifact_uri)
        if is_databricks_unity_catalog_uri(uri=registry_uri) and not self.is_logged_model_uri:
            self.repo = UnityCatalogModelsArtifactRepository(
                artifact_uri=artifact_uri,
                registry_uri=registry_uri,
                tracking_uri=tracking_uri,
            )
            self.model_name = self.repo.model_name
            self.model_version = self.repo.model_version
        elif is_oss_unity_catalog_uri(uri=registry_uri) and not self.is_logged_model_uri:
            self.repo = UnityCatalogOSSModelsArtifactRepository(
                artifact_uri=artifact_uri,
                registry_uri=registry_uri,
                tracking_uri=tracking_uri,
            )
            self.model_name = self.repo.model_name
            self.model_version = self.repo.model_version
        elif (
            is_using_databricks_registry(artifact_uri, registry_uri)
            and not self.is_logged_model_uri
        ):
            # Use the DatabricksModelsArtifactRepository if a databricks profile is being used.
            self.repo = DatabricksModelsArtifactRepository(
                artifact_uri, tracking_uri=tracking_uri, registry_uri=registry_uri
            )
            self.model_name = self.repo.model_name
            self.model_version = self.repo.model_version
        else:
            (
                self.model_name,
                self.model_version,
                underlying_uri,
            ) = ModelsArtifactRepository._get_model_uri_infos(artifact_uri)
            self.repo = get_artifact_repository(
                underlying_uri, tracking_uri=tracking_uri, registry_uri=registry_uri
            )
            # TODO: it may be nice to fall back to the source URI explicitly here if for some reason
            #  we don't get a download URI here, or fail during the download itself.

    @staticmethod
    def is_models_uri(uri):
        return urllib.parse.urlparse(uri).scheme == "models"

    @staticmethod
    def split_models_uri(uri):
        """
        Split 'models:/<name>/<version>/path/to/model' into
        ('models:/<name>/<version>', 'path/to/model').
        Split 'models://<scope>:<prefix>@databricks/<name>/<version>/path/to/model' into
        ('models://<scope>:<prefix>@databricks/<name>/<version>', 'path/to/model').
        Split 'models:/<name>@alias/path/to/model' into
        ('models:/<name>@alias', 'path/to/model').
        """
        uri = uri.rstrip("/")
        parsed_url = urllib.parse.urlparse(uri)
        path = parsed_url.path
        netloc = parsed_url.netloc
        if path.count("/") >= 2 and not path.endswith("/"):
            splits = path.split("/", 3)
            cut_index = 2 if "@" in splits[1] else 3
            model_name_and_version = splits[:cut_index]
            artifact_path = "/".join(splits[cut_index:])
            base_part = f"models://{netloc}" if netloc else "models:"
            return base_part + "/".join(model_name_and_version), artifact_path
        return uri, ""

    @staticmethod
    def _is_logged_model_uri(uri: str | Path) -> bool:
        """
        Returns True if the URI is a logged model URI (e.g. 'models:/<model_id>'), False otherwise.
        """
        uri = str(uri)
        return is_models_uri(uri) and _parse_model_uri(uri).model_id is not None

    @staticmethod
    def _get_model_uri_infos(uri):
        # Note: to support a registry URI that is different from the tracking URI here,
        # we'll need to add setting of registry URIs via environment variables.

        from mlflow import MlflowClient

        databricks_profile_uri = (
            get_databricks_profile_uri_from_artifact_uri(uri) or mlflow.get_registry_uri()
        )
        client = MlflowClient(registry_uri=databricks_profile_uri)
        name_and_version_or_id = get_model_name_and_version(client, uri)
        if len(name_and_version_or_id) == 1:
            name = None
            version = None
            model_id = name_and_version_or_id[0]
            download_uri = client.get_logged_model(model_id).artifact_location
        else:
            name, version = name_and_version_or_id
            download_uri = client.get_model_version_download_uri(name, version)

        return (
            name,
            version,
            add_databricks_profile_info_to_artifact_uri(download_uri, databricks_profile_uri),
        )

    @staticmethod
    def get_underlying_uri(uri):
        _, _, underlying_uri = ModelsArtifactRepository._get_model_uri_infos(uri)

        return underlying_uri

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
        if self.is_logged_model_uri:
            return self.repo.log_artifact(local_file, artifact_path)
        raise ValueError(
            "log_artifact is not supported for models:/<name>/<version> URIs. "
            "Use register_model instead."
        )

    def log_artifacts(self, local_dir, artifact_path=None):
        """
        Log the files in the specified local directory as artifacts, optionally taking
        an ``artifact_path`` to place them in within the run's artifacts.

        Args:
            local_dir: Directory of local artifacts to log.
            artifact_path: Directory within the run's artifact directory in which to log the
                artifacts.
        """
        if self.is_logged_model_uri:
            return self.repo.log_artifacts(local_dir, artifact_path)
        raise ValueError(
            "log_artifacts is not supported for models:/<name>/<version> URIs. "
            "Use register_model instead."
        )

    def list_artifacts(self, path):
        """
        Return all the artifacts for this run_id directly under path. If path is a file, returns
        an empty list. Will error if path is neither a file nor directory.

        Args:
            path: Relative source path that contain desired artifacts.

        Returns:
            List of artifacts as FileInfo listed directly under path.
        """
        return self.repo.list_artifacts(path)

    def _add_registered_model_meta_file(self, model_path):
        from mlflow.utils.yaml_utils import write_yaml

        write_yaml(
            model_path,
            REGISTERED_MODEL_META_FILE_NAME,
            {
                "model_name": self.model_name,
                "model_version": self.model_version,
            },
            overwrite=True,
            ensure_yaml_extension=False,
        )

    def download_artifacts(self, artifact_path, dst_path=None, lineage_header_info=None):
        """
        Download an artifact file or directory to a local directory if applicable, and return a
        local path for it.
        For registered models, when the artifact is downloaded, the model name and version
        are saved in the "registered_model_meta" file on the caller's side.
        The caller is responsible for managing the lifecycle of the downloaded artifacts.

        Args:
            artifact_path: Relative source path to the desired artifacts.
            dst_path: Absolute path of the local filesystem destination directory to which to
                download the specified artifacts. This directory must already exist.
                If unspecified, the artifacts will either be downloaded to a new
                uniquely-named directory on the local filesystem or will be returned
                directly in the case of the LocalArtifactRepository.
            lineage_header_info: Linear header information.

        Returns:
            Absolute path of the local filesystem location containing the desired artifacts.
        """

        from mlflow.models.model import MLMODEL_FILE_NAME

        # Pass lineage header info if model is registered in UC
        if isinstance(self.repo, UnityCatalogModelsArtifactRepository):
            model_path = self.repo.download_artifacts(
                artifact_path, dst_path, lineage_header_info=lineage_header_info
            )
        else:
            model_path = self.repo.download_artifacts(artifact_path, dst_path)
        # NB: only add the registered model metadata iff the artifact path is at the root model
        # directory. For individual files or subdirectories within the model directory, do not
        # create the metadata file.
        if os.path.isdir(model_path) and MLMODEL_FILE_NAME in os.listdir(model_path):
            self._add_registered_model_meta_file(model_path)

        return model_path

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
        raise MlflowException("Not implemented yet")
```

--------------------------------------------------------------------------------

````
