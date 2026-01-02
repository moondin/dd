---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 670
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 670 of 991)

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

---[FILE: databricks_artifact_repo_resources.py]---
Location: mlflow-master/mlflow/store/artifact/databricks_artifact_repo_resources.py

```python
import posixpath
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Callable

from mlflow.entities.file_info import FileInfo
from mlflow.protos.databricks_artifacts_pb2 import (
    DatabricksMlflowArtifactsService,
    GetCredentialsForLoggedModelDownload,
    GetCredentialsForLoggedModelUpload,
    GetCredentialsForRead,
    GetCredentialsForTraceDataDownload,
    GetCredentialsForTraceDataUpload,
    GetCredentialsForWrite,
)
from mlflow.protos.service_pb2 import (
    GetLoggedModel,
    GetRun,
    ListArtifacts,
    ListLoggedModelArtifacts,
    MlflowService,
)
from mlflow.utils.proto_json_utils import message_to_json
from mlflow.utils.uri import extract_and_normalize_path


class _CredentialType(Enum):
    READ = 1
    WRITE = 2


@dataclass
class HttpHeader:
    name: str
    value: str


@dataclass
class ArtifactCredentialInfo:
    signed_uri: str
    type: Any
    headers: list[HttpHeader] = field(default_factory=list)


@dataclass
class ListArtifactsPage:
    # List of files in the current page
    files: list[FileInfo]
    # Token to fetch the next page of files
    next_page_token: str | None = None

    @classmethod
    def empty(cls):
        return cls(files=[], next_page_token=None)


class _Resource(ABC):
    """
    Represents a resource that `DatabricksArtifactRepository` interacts with.
    """

    def __init__(self, id_: str, artifact_uri: str, call_endpoint: Callable[..., Any]):
        self.id = id_
        self.artifact_uri = artifact_uri
        self._call_endpoint = call_endpoint
        self._artifact_root = None
        self._relative_path = None

    @property
    def call_endpoint(self) -> Callable[..., Any]:
        return self._call_endpoint

    @property
    def artifact_root(self) -> str:
        if self._artifact_root is None:
            self._artifact_root = self.get_artifact_root()
        return self._artifact_root

    @property
    def relative_path(self) -> str:
        if self._relative_path is None:
            # Fetch the artifact root for the MLflow resource associated with `artifact_uri` and
            # compute the path of `artifact_uri` relative to the MLflow resource's artifact root
            # All operations performed on this artifact repository will be performed relative to
            # this computed location.
            artifact_repo_root_path = extract_and_normalize_path(self.artifact_uri)
            artifact_root_path = extract_and_normalize_path(self.artifact_root)
            # If the paths are equal, then use empty string over "./" for ListArtifact compatibility
            self._relative_path = (
                ""
                if artifact_root_path == artifact_repo_root_path
                else posixpath.relpath(artifact_repo_root_path, artifact_root_path)
            )
        return self._relative_path

    @abstractmethod
    def get_credentials(
        self,
        cred_type: _CredentialType,
        paths: list[str] | None = None,
        page_token: str | None = None,
    ) -> tuple[list[ArtifactCredentialInfo], str | None]:
        """
        Fetches read/write credentials for the specified paths.
        """

    @abstractmethod
    def get_artifact_root(self) -> str:
        """
        Get the artifact root URI of this resource.
        """

    @abstractmethod
    def _list_artifacts(
        self,
        path: str | None = None,
        page_token: str | None = None,
    ) -> ListArtifactsPage:
        """
        List artifacts under the specified path.
        """

    def list_artifacts(self, path: str | None = None) -> list[FileInfo]:
        """
        Handle pagination and return all artifacts under the specified path.
        """
        files: list[FileInfo] = []
        page_token: str | None = None
        while True:
            page = self._list_artifacts(path, page_token)
            files.extend(page.files)
            if len(page.files) == 0 or not page.next_page_token:
                break
            page_token = page.next_page_token

        return files


class _LoggedModel(_Resource):
    def get_credentials(
        self,
        cred_type: _CredentialType,
        paths: list[str] | None = None,
        page_token: str | None = None,
    ) -> tuple[list[ArtifactCredentialInfo], str | None]:
        api = (
            GetCredentialsForLoggedModelDownload
            if cred_type == _CredentialType.READ
            else GetCredentialsForLoggedModelUpload
        )
        payload = api(paths=paths, page_token=page_token)
        response = self.call_endpoint(
            DatabricksMlflowArtifactsService,
            api,
            message_to_json(payload),
            path_params={"model_id": self.id},
        )
        credential_infos = [
            ArtifactCredentialInfo(
                signed_uri=c.credential_info.signed_uri,
                type=c.credential_info.type,
                headers=[HttpHeader(name=h.name, value=h.value) for h in c.credential_info.headers],
            )
            for c in response.credentials
        ]
        return credential_infos, response.next_page_token

    def get_artifact_root(self) -> str:
        json_body = message_to_json(GetLoggedModel(model_id=self.id))
        response = self.call_endpoint(
            MlflowService, GetLoggedModel, json_body, path_params={"model_id": self.id}
        )
        return response.model.info.artifact_uri

    def _list_artifacts(
        self,
        path: str | None = None,
        page_token: str | None = None,
    ) -> ListArtifactsPage:
        path = posixpath.join(self.relative_path, path) if path else self.relative_path
        json_body = message_to_json(
            ListLoggedModelArtifacts(page_token=page_token, artifact_directory_path=path)
        )
        response = self.call_endpoint(
            MlflowService, ListLoggedModelArtifacts, json_body, path_params={"model_id": self.id}
        )
        files = response.files
        # If `path` is a file, ListLoggedModelArtifacts returns a single list element with the
        # same name as `path`. The list_artifacts API expects us to return an empty list in this
        # case, so we do so here.
        if len(files) == 1 and files[0].path == path and not files[0].is_dir:
            return ListArtifactsPage.empty()

        return ListArtifactsPage(
            files=[
                FileInfo(
                    posixpath.relpath(f.path, self.relative_path),
                    f.is_dir,
                    None if f.is_dir else f.file_size,
                )
                for f in files
            ],
            next_page_token=response.next_page_token,
        )


class _Run(_Resource):
    def get_credentials(
        self,
        cred_type: _CredentialType,
        paths: list[str] | None = None,
        page_token: str | None = None,
    ) -> tuple[list[ArtifactCredentialInfo], str | None]:
        api = GetCredentialsForRead if cred_type == _CredentialType.READ else GetCredentialsForWrite
        json_body = api(run_id=self.id, path=paths, page_token=page_token)
        response = self.call_endpoint(
            DatabricksMlflowArtifactsService, api, message_to_json(json_body)
        )
        credential_infos = [
            ArtifactCredentialInfo(
                signed_uri=c.signed_uri,
                type=c.type,
                headers=[HttpHeader(name=h.name, value=h.value) for h in c.headers],
            )
            for c in response.credential_infos
        ]
        return credential_infos, response.next_page_token

    def get_artifact_root(self) -> str:
        json_body = message_to_json(GetRun(run_id=self.id))
        run_response = self.call_endpoint(MlflowService, GetRun, json_body)
        return run_response.run.info.artifact_uri

    def _list_artifacts(
        self,
        path: str | None = None,
        page_token: str | None = None,
    ) -> ListArtifactsPage:
        path = posixpath.join(self.relative_path, path) if path else self.relative_path
        json_body = message_to_json(
            ListArtifacts(run_id=self.id, path=path, page_token=page_token),
        )
        response = self.call_endpoint(MlflowService, ListArtifacts, json_body)
        files = response.files
        # If `path` is a file, ListArtifacts returns a single list element with the
        # same name as `path`. The list_artifacts API expects us to return an empty list in this
        # case, so we do so here.
        if len(files) == 1 and files[0].path == path and not files[0].is_dir:
            return ListArtifactsPage.empty()

        return ListArtifactsPage(
            files=[
                FileInfo(
                    posixpath.relpath(f.path, self.relative_path),
                    f.is_dir,
                    None if f.is_dir else f.file_size,
                )
                for f in files
            ],
            next_page_token=response.next_page_token,
        )


class _Trace(_Resource):
    def get_artifact_root(self) -> str:
        return None

    def get_credentials(
        self,
        cred_type: _CredentialType,
        paths: list[str] | None = None,
        page_token: str | None = None,
        timeout: int | None = None,
    ) -> tuple[list[ArtifactCredentialInfo], str | None]:
        res = self.call_endpoint(
            DatabricksMlflowArtifactsService,
            (
                GetCredentialsForTraceDataDownload
                if cred_type == _CredentialType.READ
                else GetCredentialsForTraceDataUpload
            ),
            path_params={"request_id": self.id},
            retry_timeout_seconds=timeout,
        )
        cred_inf = ArtifactCredentialInfo(
            signed_uri=res.credential_info.signed_uri,
            type=res.credential_info.type,
            headers=[HttpHeader(name=h.name, value=h.value) for h in res.credential_info.headers],
        )
        return [cred_inf], None

    def get_artifact_root(self) -> str:
        raise NotImplementedError

    def _list_artifacts(
        self,
        path: str | None = None,
        page_token: str | None = None,
    ) -> ListArtifactsPage:
        raise NotImplementedError
```

--------------------------------------------------------------------------------

---[FILE: databricks_logged_model_artifact_repo.py]---
Location: mlflow-master/mlflow/store/artifact/databricks_logged_model_artifact_repo.py

```python
import re

from mlflow.store.artifact.databricks_tracking_artifact_repo import (
    DatabricksTrackingArtifactRepository,
)


class DatabricksLoggedModelArtifactRepository(DatabricksTrackingArtifactRepository):
    """
    Artifact repository for interacting with logged model artifacts in a Databricks workspace.
    If operations using the Databricks SDK fail for any reason, this repository automatically
    falls back to using the `DatabricksArtifactRepository`, ensuring operational resilience.
    """

    # Matches URIs of the form:
    # databricks/mlflow-tracking/<experiment_id>/logged_models/<model_id>/<relative_path>
    _URI_REGEX = re.compile(
        r"databricks/mlflow-tracking/(?P<experiment_id>[^/]+)/logged_models/(?P<model_id>[^/]+)(?P<relative_path>/.*)?$"
    )

    def _get_uri_regex(self) -> re.Pattern[str]:
        return self._URI_REGEX

    def _get_expected_uri_format(self) -> str:
        return "databricks/mlflow-tracking/<EXP_ID>/logged_models/<MODEL_ID>"

    def _build_root_path(self, experiment_id: str, match: re.Match, relative_path: str) -> str:
        model_id = match.group("model_id")
        return (
            f"/WorkspaceInternal/Mlflow/Artifacts/{experiment_id}/LoggedModels/{model_id}"
            f"{relative_path}"
        )

    @staticmethod
    def is_logged_model_uri(artifact_uri: str) -> bool:
        return bool(DatabricksLoggedModelArtifactRepository._URI_REGEX.search(artifact_uri))
```

--------------------------------------------------------------------------------

---[FILE: databricks_models_artifact_repo.py]---
Location: mlflow-master/mlflow/store/artifact/databricks_models_artifact_repo.py

```python
import json
import logging
import os
import posixpath

import mlflow.tracking
from mlflow.entities import FileInfo
from mlflow.environment_variables import (
    MLFLOW_ENABLE_MULTIPART_DOWNLOAD,
    MLFLOW_MULTIPART_DOWNLOAD_CHUNK_SIZE,
)
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE
from mlflow.store.artifact.artifact_repo import ArtifactRepository
from mlflow.store.artifact.utils.models import (
    get_model_name_and_version,
    is_using_databricks_registry,
)
from mlflow.utils.databricks_utils import (
    get_databricks_host_creds,
    warn_on_deprecated_cross_workspace_registry_uri,
)
from mlflow.utils.file_utils import (
    download_chunk_retries,
    download_file_using_http_uri,
    parallelized_download_file_using_http_uri,
    remove_on_error,
)
from mlflow.utils.rest_utils import http_request
from mlflow.utils.uri import get_databricks_profile_uri_from_artifact_uri

_logger = logging.getLogger(__name__)
# The constant REGISTRY_LIST_ARTIFACT_ENDPOINT is defined as @developer_stable
REGISTRY_LIST_ARTIFACTS_ENDPOINT = "/api/2.0/mlflow/model-versions/list-artifacts"
# The constant REGISTRY_ARTIFACT_PRESIGNED_URI_ENDPOINT is defined as @developer_stable
REGISTRY_ARTIFACT_PRESIGNED_URI_ENDPOINT = "/api/2.0/mlflow/model-versions/get-signed-download-uri"


class DatabricksModelsArtifactRepository(ArtifactRepository):
    """
    Performs storage operations on artifacts controlled by a Databricks-hosted model registry.

    Signed access URIs for the appropriate cloud storage locations are fetched from the
    MLflow service and used to download model artifacts.

    The artifact_uri is expected to be of the form
    - `models:/<model_name>/<model_version>`
    - `models:/<model_name>/<stage>`  (refers to the latest model version in the given stage)
    - `models:/<model_name>/latest`  (refers to the latest of all model versions)
    - `models://<profile>/<model_name>/<model_version or stage or 'latest'>`

    Note : This artifact repository is meant is to be instantiated by the ModelsArtifactRepository
    when the client is pointing to a Databricks-hosted model registry.
    """

    def __init__(
        self, artifact_uri: str, tracking_uri: str | None = None, registry_uri: str | None = None
    ) -> None:
        if not is_using_databricks_registry(artifact_uri, registry_uri):
            raise MlflowException(
                message="A valid databricks profile is required to instantiate this repository",
                error_code=INVALID_PARAMETER_VALUE,
            )
        super().__init__(artifact_uri, tracking_uri, registry_uri)
        from mlflow.tracking.client import MlflowClient

        self.databricks_profile_uri = (
            get_databricks_profile_uri_from_artifact_uri(artifact_uri)
            or registry_uri
            or mlflow.get_registry_uri()
        )
        warn_on_deprecated_cross_workspace_registry_uri(self.databricks_profile_uri)
        client = MlflowClient(registry_uri=self.databricks_profile_uri)
        self.model_name, self.model_version = get_model_name_and_version(client, artifact_uri)
        # Use an isolated thread pool executor for chunk uploads/downloads to avoid a deadlock
        # caused by waiting for a chunk-upload/download task within a file-upload/download task.
        # See https://superfastpython.com/threadpoolexecutor-deadlock/#Deadlock_1_Submit_and_Wait_for_a_Task_Within_a_Task
        # for more details
        self.chunk_thread_pool = self._create_thread_pool()

    def _call_endpoint(self, json, endpoint):
        db_creds = get_databricks_host_creds(self.databricks_profile_uri)
        return http_request(host_creds=db_creds, endpoint=endpoint, method="GET", params=json)

    def _make_json_body(self, path, page_token=None):
        body = {"name": self.model_name, "version": self.model_version, "path": path}
        if page_token:
            body["page_token"] = page_token
        return body

    def list_artifacts(self, path: str | None = None) -> list[FileInfo]:
        infos = []
        page_token = None
        if not path:
            path = ""
        while True:
            json_body = self._make_json_body(path, page_token)
            response = self._call_endpoint(json_body, REGISTRY_LIST_ARTIFACTS_ENDPOINT)
            try:
                response.raise_for_status()
                json_response = json.loads(response.text)
            except Exception:
                raise MlflowException(
                    f"API request to list files under path `{path}` failed with status code "
                    f"{response.status_code}. Response body: {response.text}"
                )
            artifact_list = json_response.get("files", [])
            next_page_token = json_response.get("next_page_token", None)
            # If `path` is a file, ListArtifacts returns a single list element with the
            # same name as `path`. The list_artifacts API expects us to return an empty list in this
            # case, so we do so here.
            if (
                len(artifact_list) == 1
                and artifact_list[0]["path"] == path
                and not artifact_list[0]["is_dir"]
            ):
                return []
            for output_file in artifact_list:
                artifact_size = None if output_file["is_dir"] else output_file["file_size"]
                infos.append(FileInfo(output_file["path"], output_file["is_dir"], artifact_size))
            if len(artifact_list) == 0 or not next_page_token:
                break
            page_token = next_page_token
        return infos

    # TODO: Change the implementation of this to match how databricks_artifact_repo.py handles this
    def _get_signed_download_uri(self, path=None):
        if not path:
            path = ""
        json_body = self._make_json_body(path)
        response = self._call_endpoint(json_body, REGISTRY_ARTIFACT_PRESIGNED_URI_ENDPOINT)
        try:
            json_response = json.loads(response.text)
        except ValueError:
            raise MlflowException(
                f"API request to get presigned uri to for file under path `{path}` failed with"
                f" status code {response.status_code}. Response body: {response.text}"
            )
        return json_response.get("signed_uri", None), json_response.get("headers", None)

    def _extract_headers_from_signed_url(self, headers):
        if headers is None:
            return {}
        filtered_headers = filter(lambda h: "name" in h and "value" in h, headers)
        return {header.get("name"): header.get("value") for header in filtered_headers}

    def _parallelized_download_from_cloud(
        self, signed_uri, headers, file_size, dst_local_file_path, dst_run_relative_artifact_path
    ):
        from mlflow.utils.databricks_utils import get_databricks_env_vars

        with remove_on_error(dst_local_file_path):
            parallel_download_subproc_env = os.environ.copy()
            parallel_download_subproc_env.update(
                get_databricks_env_vars(self.databricks_profile_uri)
            )
            failed_downloads = parallelized_download_file_using_http_uri(
                thread_pool_executor=self.chunk_thread_pool,
                http_uri=signed_uri,
                download_path=dst_local_file_path,
                remote_file_path=dst_run_relative_artifact_path,
                file_size=file_size,
                # URI type is not known in this context
                uri_type=None,
                chunk_size=MLFLOW_MULTIPART_DOWNLOAD_CHUNK_SIZE.get(),
                env=parallel_download_subproc_env,
                headers=headers,
            )
            if failed_downloads:
                new_signed_uri, new_headers = self._get_signed_download_uri(
                    dst_run_relative_artifact_path
                )
                new_headers = self._extract_headers_from_signed_url(new_headers)
                download_chunk_retries(
                    chunks=list(failed_downloads),
                    http_uri=new_signed_uri,
                    headers=new_headers,
                    download_path=dst_local_file_path,
                )

    def _download_file(self, remote_file_path, local_path):
        try:
            parent_dir, _ = posixpath.split(remote_file_path)
            file_infos = self.list_artifacts(parent_dir)
            file_info = [info for info in file_infos if info.path == remote_file_path]
            file_size = file_info[0].file_size if len(file_info) == 1 else None
            signed_uri, raw_headers = self._get_signed_download_uri(remote_file_path)
            headers = {}
            if raw_headers is not None:
                # Don't send None to _extract_headers_from_signed_url
                headers = self._extract_headers_from_signed_url(raw_headers)
            if (
                not file_size
                or file_size <= MLFLOW_MULTIPART_DOWNLOAD_CHUNK_SIZE.get()
                or not MLFLOW_ENABLE_MULTIPART_DOWNLOAD.get()
            ):
                download_file_using_http_uri(
                    signed_uri, local_path, MLFLOW_MULTIPART_DOWNLOAD_CHUNK_SIZE.get(), headers
                )
            else:
                self._parallelized_download_from_cloud(
                    signed_uri,
                    headers,
                    file_size,
                    local_path,
                    remote_file_path,
                )

        except Exception as err:
            raise MlflowException(err)

    def log_artifact(self, local_file, artifact_path=None):
        raise MlflowException("This repository does not support logging artifacts.")

    def log_artifacts(self, local_dir, artifact_path=None):
        raise MlflowException("This repository does not support logging artifacts.")

    def delete_artifacts(self, artifact_path=None):
        raise NotImplementedError("This artifact repository does not support deleting artifacts")
```

--------------------------------------------------------------------------------

---[FILE: databricks_run_artifact_repo.py]---
Location: mlflow-master/mlflow/store/artifact/databricks_run_artifact_repo.py

```python
import re

from mlflow.store.artifact.databricks_tracking_artifact_repo import (
    DatabricksTrackingArtifactRepository,
)


class DatabricksRunArtifactRepository(DatabricksTrackingArtifactRepository):
    """
    Artifact repository for interacting with run artifacts in a Databricks workspace.
    If operations using the Databricks SDK fail for any reason, this repository automatically
    falls back to using the `DatabricksArtifactRepository`, ensuring operational resilience.
    """

    # Matches URIs of the form:
    # databricks/mlflow-tracking/<experiment_id>/<run_id>/<relative_path>
    # But excludes trace URIs (run_id starting with "tr-") and logged_models
    _URI_REGEX = re.compile(
        r"databricks/mlflow-tracking/(?P<experiment_id>[^/]+)/(?P<run_id>(?!tr-|logged_models)[^/]+)(?P<relative_path>/.*)?$"
    )

    def _get_uri_regex(self) -> re.Pattern[str]:
        return self._URI_REGEX

    def _get_expected_uri_format(self) -> str:
        return "databricks/mlflow-tracking/<EXPERIMENT_ID>/<RUN_ID>"

    def _build_root_path(self, experiment_id: str, match: re.Match, relative_path: str) -> str:
        run_id = match.group("run_id")
        return f"/WorkspaceInternal/Mlflow/Artifacts/{experiment_id}/Runs/{run_id}{relative_path}"

    @staticmethod
    def is_run_uri(artifact_uri: str) -> bool:
        return bool(DatabricksRunArtifactRepository._URI_REGEX.search(artifact_uri))
```

--------------------------------------------------------------------------------

---[FILE: databricks_sdk_artifact_repo.py]---
Location: mlflow-master/mlflow/store/artifact/databricks_sdk_artifact_repo.py

```python
import importlib.metadata
import logging
import posixpath
from concurrent.futures import Future
from pathlib import Path
from typing import TYPE_CHECKING

from packaging.version import Version

from mlflow.entities import FileInfo
from mlflow.environment_variables import MLFLOW_MULTIPART_UPLOAD_CHUNK_SIZE
from mlflow.exceptions import MlflowException
from mlflow.store.artifact.artifact_repo import ArtifactRepository

if TYPE_CHECKING:
    from databricks.sdk.service.files import FilesAPI


def _sdk_supports_large_file_uploads() -> bool:
    # https://github.com/databricks/databricks-sdk-py/commit/7ca3fb7e8643126b74c9f5779dc01fb20c1741fb
    return Version(importlib.metadata.version("databricks-sdk")) >= Version("0.45.0")


_logger = logging.getLogger(__name__)


# TODO: The following artifact repositories should use this class. Migrate them.
#   - databricks_sdk_models_artifact_repo.py
class DatabricksSdkArtifactRepository(ArtifactRepository):
    def __init__(
        self, artifact_uri: str, tracking_uri: str | None = None, registry_uri: str | None = None
    ) -> None:
        from databricks.sdk import WorkspaceClient
        from databricks.sdk.config import Config

        super().__init__(artifact_uri, tracking_uri, registry_uri)
        supports_large_file_uploads = _sdk_supports_large_file_uploads()
        wc = WorkspaceClient(
            config=(
                Config(enable_experimental_files_api_client=True)
                if supports_large_file_uploads
                else None
            )
        )
        if supports_large_file_uploads:
            # `Config` has a `multipart_upload_min_stream_size` parameter but the constructor
            # doesn't set it. This is a bug in databricks-sdk.
            # >>> from databricks.sdk.config import Config
            # >>> config = Config(multipart_upload_chunk_size=123)
            # >>> assert config.multipart_upload_chunk_size != 123
            try:
                wc.files._config.multipart_upload_chunk_size = (
                    MLFLOW_MULTIPART_UPLOAD_CHUNK_SIZE.get()
                )
            except AttributeError:
                _logger.debug("Failed to set multipart_upload_chunk_size in Config", exc_info=True)
        self.wc = wc

    @property
    def files_api(self) -> "FilesAPI":
        return self.wc.files

    def _is_dir(self, path: str) -> bool:
        from databricks.sdk.errors.platform import NotFound

        try:
            self.files_api.get_directory_metadata(path)
        except NotFound:
            return False
        return True

    def full_path(self, artifact_path: str | None) -> str:
        return f"{self.artifact_uri}/{artifact_path}" if artifact_path else self.artifact_uri

    def log_artifact(self, local_file: str, artifact_path: str | None = None) -> None:
        if Path(local_file).stat().st_size > 5 * (1024**3) and not _sdk_supports_large_file_uploads:
            raise MlflowException.invalid_parameter_value(
                "Databricks SDK version < 0.41.0 does not support uploading files larger than 5GB. "
                "Please upgrade the databricks-sdk package to version >= 0.41.0."
            )

        with open(local_file, "rb") as f:
            name = Path(local_file).name
            self.files_api.upload(
                self.full_path(posixpath.join(artifact_path, name) if artifact_path else name),
                f,
                overwrite=True,
            )

    def log_artifacts(self, local_dir: str, artifact_path: str | None = None) -> None:
        local_dir = Path(local_dir).resolve()
        futures: list[Future[None]] = []
        with self._create_thread_pool() as executor:
            for f in local_dir.rglob("*"):
                if not f.is_file():
                    continue

                paths: list[str] = []
                if artifact_path:
                    paths.append(artifact_path)
                if f.parent != local_dir:
                    paths.append(str(f.parent.relative_to(local_dir)))

                fut = executor.submit(
                    self.log_artifact,
                    local_file=f,
                    artifact_path=posixpath.join(*paths) if paths else None,
                )
                futures.append(fut)

        for fut in futures:
            fut.result()

    def list_artifacts(self, path: str | None = None) -> list[FileInfo]:
        dest_path = self.full_path(path)
        if not self._is_dir(dest_path):
            return []

        file_infos: list[FileInfo] = []
        for directory_entry in self.files_api.list_directory_contents(dest_path):
            relative_path = posixpath.relpath(directory_entry.path, self.artifact_uri)
            file_infos.append(
                FileInfo(
                    path=relative_path,
                    is_dir=directory_entry.is_directory,
                    file_size=directory_entry.file_size,
                )
            )

        return sorted(file_infos, key=lambda f: f.path)

    def _download_file(self, remote_file_path: str, local_path: str) -> None:
        download_resp = self.files_api.download(self.full_path(remote_file_path))
        with open(local_path, "wb") as f:
            while chunk := download_resp.contents.read(10 * 1024 * 1024):
                f.write(chunk)
```

--------------------------------------------------------------------------------

---[FILE: databricks_sdk_models_artifact_repo.py]---
Location: mlflow-master/mlflow/store/artifact/databricks_sdk_models_artifact_repo.py

```python
import posixpath

from mlflow.entities import FileInfo
from mlflow.environment_variables import (
    MLFLOW_MULTIPART_DOWNLOAD_CHUNK_SIZE,
)
from mlflow.store.artifact.cloud_artifact_repo import CloudArtifactRepository


def _get_databricks_workspace_client():
    from databricks.sdk import WorkspaceClient

    return WorkspaceClient()


class DatabricksSDKModelsArtifactRepository(CloudArtifactRepository):
    """
    Stores and retrieves model artifacts via Databricks SDK, agnostic to the underlying cloud
    that stores the model artifacts.
    """

    def __init__(
        self,
        model_name,
        model_version,
        tracking_uri: str | None = None,
        registry_uri: str | None = None,
    ):
        self.model_name = model_name
        self.model_version = model_version
        self.model_base_path = f"/Models/{model_name.replace('.', '/')}/{model_version}"
        self.client = _get_databricks_workspace_client()
        super().__init__(self.model_base_path, tracking_uri, registry_uri)

    def list_artifacts(self, path: str | None = None) -> list[FileInfo]:
        dest_path = self.model_base_path
        if path:
            dest_path = posixpath.join(dest_path, path)

        file_infos = []

        # check if dest_path is file, if so return empty dir
        if not self._is_dir(dest_path):
            return file_infos

        resp = self.client.files.list_directory_contents(dest_path)
        for directory_entry in resp:
            relative_path = posixpath.relpath(directory_entry.path, self.model_base_path)
            file_infos.append(
                FileInfo(
                    path=relative_path,
                    is_dir=directory_entry.is_directory,
                    file_size=directory_entry.file_size,
                )
            )

        return sorted(file_infos, key=lambda f: f.path)

    def _is_dir(self, artifact_path):
        from databricks.sdk.errors.platform import NotFound

        try:
            self.client.files.get_directory_metadata(artifact_path)
        except NotFound:
            return False
        return True

    def _upload_to_cloud(self, cloud_credential_info, src_file_path, artifact_file_path=None):
        dest_path = self.model_base_path
        if artifact_file_path:
            dest_path = posixpath.join(dest_path, artifact_file_path)

        with open(src_file_path, "rb") as f:
            self.client.files.upload(dest_path, f, overwrite=True)

    def log_artifact(self, local_file, artifact_path=None):
        self._upload_to_cloud(
            cloud_credential_info=None,
            src_file_path=local_file,
            artifact_file_path=artifact_path,
        )

    def _download_from_cloud(self, remote_file_path, local_path):
        dest_path = self.model_base_path
        if remote_file_path:
            dest_path = posixpath.join(dest_path, remote_file_path)

        resp = self.client.files.download(dest_path)
        contents = resp.contents
        chunk_size = MLFLOW_MULTIPART_DOWNLOAD_CHUNK_SIZE.get()

        with open(local_path, "wb") as f:
            while chunk := contents.read(chunk_size):
                f.write(chunk)

    def _get_write_credential_infos(self, remote_file_paths):
        # Databricks sdk based model download/upload don't need any extra credentials
        return [None] * len(remote_file_paths)

    def _get_read_credential_infos(self, remote_file_paths):
        # Databricks sdk based model download/upload don't need any extra credentials
        return [None] * len(remote_file_paths)
```

--------------------------------------------------------------------------------

---[FILE: databricks_tracking_artifact_repo.py]---
Location: mlflow-master/mlflow/store/artifact/databricks_tracking_artifact_repo.py

```python
import logging
import re
from abc import ABC, abstractmethod

from mlflow.entities import FileInfo
from mlflow.exceptions import MlflowException
from mlflow.store.artifact.artifact_repo import ArtifactRepository
from mlflow.store.artifact.databricks_artifact_repo import DatabricksArtifactRepository
from mlflow.store.artifact.databricks_sdk_artifact_repo import DatabricksSdkArtifactRepository

_logger = logging.getLogger(__name__)


_FALLBACK_MESSAGE_TEMPLATE = (
    "Failed to perform {operation} operation using Databricks SDK, falling back to "
    "DatabricksArtifactRepository. Original error: %s"
)


class DatabricksTrackingArtifactRepository(ArtifactRepository, ABC):
    """
    Base artifact repository for interacting with tracking artifacts in a Databricks workspace.
    If operations using the Databricks SDK fail for any reason, this repository automatically
    falls back to using the `DatabricksArtifactRepository`, ensuring operational resilience.

    This is an abstract base class that should be extended by specific tracking artifact
    repositories (e.g., for runs, logged models, etc.).
    """

    def __init__(
        self, artifact_uri: str, tracking_uri: str | None = None, registry_uri: str | None = None
    ) -> None:
        super().__init__(artifact_uri, tracking_uri, registry_uri)
        m = self._get_uri_regex().search(artifact_uri)
        if not m:
            raise MlflowException.invalid_parameter_value(
                f"Invalid artifact URI: {artifact_uri}. Expected URI of the form "
                f"{self._get_expected_uri_format()}"
            )
        experiment_id = m.group("experiment_id")
        relative_path = m.group("relative_path") or ""
        root_path = self._build_root_path(experiment_id, m, relative_path)
        self.databricks_sdk_repo = DatabricksSdkArtifactRepository(root_path)
        self.databricks_artifact_repo = DatabricksArtifactRepository(artifact_uri)

    @abstractmethod
    def _get_uri_regex(self) -> re.Pattern[str]:
        """Return the regex pattern for matching URIs of this type."""

    @abstractmethod
    def _get_expected_uri_format(self) -> str:
        """Return a description of the expected URI format."""

    @abstractmethod
    def _build_root_path(self, experiment_id: str, match: re.Match, relative_path: str) -> str:
        """Build the root path for the Databricks SDK repository."""

    def log_artifact(self, local_file: str, artifact_path: str | None = None) -> None:
        try:
            self.databricks_sdk_repo.log_artifact(local_file, artifact_path)
        except Exception as e:
            _logger.debug(
                _FALLBACK_MESSAGE_TEMPLATE.format(operation="log_artifact") % str(e),
                exc_info=True,
            )
            self.databricks_artifact_repo.log_artifact(local_file, artifact_path)

    def log_artifacts(self, local_dir: str, artifact_path: str | None = None) -> None:
        try:
            self.databricks_sdk_repo.log_artifacts(local_dir, artifact_path)
        except Exception as e:
            _logger.debug(
                _FALLBACK_MESSAGE_TEMPLATE.format(operation="log_artifacts") % str(e),
                exc_info=True,
            )
            self.databricks_artifact_repo.log_artifacts(local_dir, artifact_path)

    def list_artifacts(self, path: str | None = None) -> list[FileInfo]:
        try:
            return self.databricks_sdk_repo.list_artifacts(path)
        except Exception as e:
            _logger.debug(
                _FALLBACK_MESSAGE_TEMPLATE.format(operation="list_artifacts") % str(e),
                exc_info=True,
            )
            return self.databricks_artifact_repo.list_artifacts(path)

    def _download_file(self, remote_file_path: str, local_path: str) -> None:
        try:
            self.databricks_sdk_repo._download_file(remote_file_path, local_path)
        except Exception as e:
            _logger.debug(
                _FALLBACK_MESSAGE_TEMPLATE.format(operation="download_file") % str(e),
                exc_info=True,
            )
            self.databricks_artifact_repo._download_file(remote_file_path, local_path)
```

--------------------------------------------------------------------------------

````
