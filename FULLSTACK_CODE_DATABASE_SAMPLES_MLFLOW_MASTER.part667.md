---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 667
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 667 of 991)

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

---[FILE: artifact_repo.py]---
Location: mlflow-master/mlflow/store/artifact/artifact_repo.py

```python
import json
import logging
import os
import posixpath
import tempfile
import traceback
from abc import ABC, ABCMeta, abstractmethod
from concurrent.futures import ThreadPoolExecutor, as_completed
from contextlib import contextmanager
from pathlib import Path
from typing import Any

from mlflow.entities.file_info import FileInfo
from mlflow.entities.multipart_upload import (
    CreateMultipartUploadResponse,
    MultipartUploadPart,
)
from mlflow.exceptions import (
    MlflowException,
    MlflowTraceDataCorrupted,
    MlflowTraceDataNotFound,
)
from mlflow.protos.databricks_pb2 import (
    INVALID_PARAMETER_VALUE,
    RESOURCE_DOES_NOT_EXIST,
)
from mlflow.tracing.utils.artifact_utils import TRACE_DATA_FILE_NAME
from mlflow.utils.annotations import developer_stable
from mlflow.utils.async_logging.async_artifacts_logging_queue import (
    AsyncArtifactsLoggingQueue,
)
from mlflow.utils.file_utils import ArtifactProgressBar, create_tmp_dir
from mlflow.utils.validation import bad_path_message, path_not_unique

# Constants used to determine max level of parallelism to use while uploading/downloading artifacts.
# Max threads to use for parallelism.
_NUM_MAX_THREADS = 20
# Max threads per CPU
_NUM_MAX_THREADS_PER_CPU = 2
assert _NUM_MAX_THREADS >= _NUM_MAX_THREADS_PER_CPU
assert _NUM_MAX_THREADS_PER_CPU > 0
# Default number of CPUs to assume on the machine if unavailable to fetch it using os.cpu_count()
_NUM_DEFAULT_CPUS = _NUM_MAX_THREADS // _NUM_MAX_THREADS_PER_CPU
_logger = logging.getLogger(__name__)


def _truncate_error(err: str, max_length: int = 10_000) -> str:
    if len(err) <= max_length:
        return err
    half = max_length // 2
    return err[:half] + "\n\n*** Error message is too long, truncated ***\n\n" + err[-half:]


def _retry_with_new_creds(try_func, creds_func, orig_creds=None):
    """
    Attempt the try_func with the original credentials (og_creds) if provided, or by generating the
    credentials using creds_func. If the try_func throws, then try again with new credentials
    provided by creds_func.
    """
    try:
        first_creds = creds_func() if orig_creds is None else orig_creds
        return try_func(first_creds)
    except Exception as e:
        _logger.info(
            f"Failed to complete request, possibly due to credential expiration (Error: {e})."
            " Refreshing credentials and trying again..."
        )
        new_creds = creds_func()
        return try_func(new_creds)


@developer_stable
class ArtifactRepository:
    """
    Abstract artifact repo that defines how to upload (log) and download potentially large
    artifacts from different storage backends.
    """

    __metaclass__ = ABCMeta

    def __init__(
        self, artifact_uri: str, tracking_uri: str | None = None, registry_uri: str | None = None
    ) -> None:
        self.artifact_uri = artifact_uri
        self.tracking_uri = tracking_uri
        self.registry_uri = registry_uri
        # Limit the number of threads used for artifact uploads/downloads. Use at most
        # constants._NUM_MAX_THREADS threads or 2 * the number of CPU cores available on the
        # system (whichever is smaller)
        self.thread_pool = self._create_thread_pool()

        def log_artifact_handler(filename, artifact_path=None, artifact=None):
            with tempfile.TemporaryDirectory() as tmp_dir:
                tmp_path = os.path.join(tmp_dir, filename)
                if artifact is not None:
                    # User should already have installed PIL to log a PIL image
                    from PIL import Image

                    if isinstance(artifact, Image.Image):
                        artifact.save(tmp_path)
                self.log_artifact(tmp_path, artifact_path)

        self._async_logging_queue = AsyncArtifactsLoggingQueue(log_artifact_handler)

    def __repr__(self) -> str:
        return (
            f"{self.__class__.__name__}("
            f"artifact_uri={self.artifact_uri!r}, "
            f"tracking_uri={self.tracking_uri!r}, "
            f"registry_uri={self.registry_uri!r}"
            f")"
        )

    def _create_thread_pool(self):
        return ThreadPoolExecutor(
            max_workers=self.max_workers, thread_name_prefix=f"Mlflow{self.__class__.__name__}"
        )

    def flush_async_logging(self):
        """
        Flushes the async logging queue, ensuring that all pending logging operations have
        completed.
        """
        if self._async_logging_queue._is_activated:
            self._async_logging_queue.flush()

    @abstractmethod
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

    def _log_artifact_async(self, filename, artifact_path=None, artifact=None):
        """
        Asynchronously log a local file as an artifact, optionally taking an ``artifact_path`` to
        place it within the run's artifacts. Run artifacts can be organized into directory, so you
        can place the artifact in the directory this way. Cleanup tells the function whether to
        cleanup the local_file after running log_artifact, since it could be a Temporary
        Directory.

        Args:
            filename: Filename of the artifact to be logged.
            artifact_path: Directory within the run's artifact directory in which to log the
                artifact.
            artifact: The artifact to be logged.

        Returns:
            An :py:class:`mlflow.utils.async_logging.run_operations.RunOperations` instance
            that represents future for logging operation.
        """

        if not self._async_logging_queue.is_active():
            self._async_logging_queue.activate()

        return self._async_logging_queue.log_artifacts_async(
            filename=filename, artifact_path=artifact_path, artifact=artifact
        )

    @abstractmethod
    def log_artifacts(self, local_dir, artifact_path=None):
        """
        Log the files in the specified local directory as artifacts, optionally taking
        an ``artifact_path`` to place them in within the run's artifacts.

        Args:
            local_dir: Directory of local artifacts to log.
            artifact_path: Directory within the run's artifact directory in which to log the
                artifacts.
        """

    @abstractmethod
    def list_artifacts(self, path: str | None = None) -> list[FileInfo]:
        """
        Return all the artifacts for this run_id directly under path. If path is a file, returns
        an empty list. Will error if path is neither a file nor directory.

        Args:
            path: Relative source path that contains desired artifacts.

        Returns:
            List of artifacts as FileInfo listed directly under path.
        """

    def _is_directory(self, artifact_path):
        listing = self.list_artifacts(artifact_path)
        return len(listing) > 0

    def _create_download_destination(self, src_artifact_path, dst_local_dir_path=None):
        """
        Creates a local filesystem location to be used as a destination for downloading the artifact
        specified by `src_artifact_path`. The destination location is a subdirectory of the
        specified `dst_local_dir_path`, which is determined according to the structure of
        `src_artifact_path`. For example, if `src_artifact_path` is `dir1/file1.txt`, then the
        resulting destination path is `<dst_local_dir_path>/dir1/file1.txt`. Local directories are
        created for the resulting destination location if they do not exist.

        Args:
            src_artifact_path: A relative, POSIX-style path referring to an artifact stored
                within the repository's artifact root location. `src_artifact_path` should be
                specified relative to the repository's artifact root location.
            dst_local_dir_path: The absolute path to a local filesystem directory in which the
                local destination path will be contained. The local destination path may be
                contained in a subdirectory of `dst_root_dir` if `src_artifact_path` contains
                subdirectories.

        Returns:
            The absolute path to a local filesystem location to be used as a destination
            for downloading the artifact specified by `src_artifact_path`.
        """
        src_artifact_path = src_artifact_path.rstrip("/")  # Ensure correct dirname for trailing '/'
        dirpath = posixpath.dirname(src_artifact_path)
        local_dir_path = os.path.join(dst_local_dir_path, dirpath)
        local_file_path = os.path.join(dst_local_dir_path, src_artifact_path)
        if not os.path.exists(local_dir_path):
            os.makedirs(local_dir_path, exist_ok=True)
        return local_file_path

    def _iter_artifacts_recursive(self, path):
        dir_content = [
            file_info
            for file_info in self.list_artifacts(path)
            # prevent infinite loop, sometimes the dir is recursively included
            if file_info.path not in [".", path]
        ]
        # Empty directory
        if not dir_content:
            yield FileInfo(path=path, is_dir=True, file_size=None)
            return

        for file_info in dir_content:
            if file_info.is_dir:
                yield from self._iter_artifacts_recursive(file_info.path)
            else:
                yield file_info

    def download_artifacts(self, artifact_path, dst_path=None):
        """
        Download an artifact file or directory to a local directory if applicable, and return a
        local path for it.
        The caller is responsible for managing the lifecycle of the downloaded artifacts.

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
        if dst_path:
            dst_path = os.path.abspath(dst_path)
            if not os.path.exists(dst_path):
                raise MlflowException(
                    message=(
                        "The destination path for downloaded artifacts does not"
                        f" exist! Destination path: {dst_path}"
                    ),
                    error_code=RESOURCE_DOES_NOT_EXIST,
                )
            elif not os.path.isdir(dst_path):
                raise MlflowException(
                    message=(
                        "The destination path for downloaded artifacts must be a directory!"
                        f" Destination path: {dst_path}"
                    ),
                    error_code=INVALID_PARAMETER_VALUE,
                )
        else:
            dst_path = create_tmp_dir()

        def _download_file(src_artifact_path, dst_local_dir_path):
            dst_local_file_path = self._create_download_destination(
                src_artifact_path=src_artifact_path, dst_local_dir_path=dst_local_dir_path
            )
            return self.thread_pool.submit(
                self._download_file,
                remote_file_path=src_artifact_path,
                local_path=dst_local_file_path,
            )

        # Submit download tasks
        futures = {}
        if self._is_directory(artifact_path):
            for file_info in self._iter_artifacts_recursive(artifact_path):
                if file_info.is_dir:  # Empty directory
                    os.makedirs(os.path.join(dst_path, file_info.path), exist_ok=True)
                else:
                    fut = _download_file(file_info.path, dst_path)
                    futures[fut] = file_info.path
        else:
            fut = _download_file(artifact_path, dst_path)
            futures[fut] = artifact_path

        # Wait for downloads to complete and collect failures
        failed_downloads = {}
        tracebacks = {}
        with ArtifactProgressBar.files(desc="Downloading artifacts", total=len(futures)) as pbar:
            for f in as_completed(futures):
                try:
                    f.result()
                    pbar.update()
                except Exception as e:
                    path = futures[f]
                    failed_downloads[path] = e
                    tracebacks[path] = traceback.format_exc()

        if failed_downloads:
            if _logger.isEnabledFor(logging.DEBUG):
                template = "##### File {path} #####\n{error}\nTraceback:\n{traceback}\n"
            else:
                template = "##### File {path} #####\n{error}"

            failures = "\n".join(
                template.format(path=path, error=error, traceback=tracebacks[path])
                for path, error in failed_downloads.items()
            )
            raise MlflowException(
                message=(
                    "The following failures occurred while downloading one or more"
                    f" artifacts from {self.artifact_uri}:\n{_truncate_error(failures)}"
                )
            )

        return os.path.join(dst_path, artifact_path)

    @abstractmethod
    def _download_file(self, remote_file_path, local_path):
        """
        Download the file at the specified relative remote path and saves
        it at the specified local path.

        Args:
            remote_file_path: Source path to the remote file, relative to the root
                directory of the artifact repository.
            local_path: The path to which to save the downloaded file.
        """

    def delete_artifacts(self, artifact_path=None):
        """
        Delete the artifacts at the specified location.
        Supports the deletion of a single file or of a directory. Deletion of a directory
        is recursive.

        Args:
            artifact_path: Path of the artifact to delete.
        """

    @property
    def max_workers(self) -> int:
        """Compute the number of workers to use for multi-threading."""
        num_cpus = os.cpu_count() or _NUM_DEFAULT_CPUS
        return min(num_cpus * _NUM_MAX_THREADS_PER_CPU, _NUM_MAX_THREADS)

    def download_trace_data(self) -> dict[str, Any]:
        """
        Download the trace data.

        Returns:
            The trace data as a dictionary.

        Raises:
            - `MlflowTraceDataNotFound`: The trace data is not found.
            - `MlflowTraceDataCorrupted`: The trace data is corrupted.
        """
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_file = Path(temp_dir, TRACE_DATA_FILE_NAME)
            try:
                self._download_file(TRACE_DATA_FILE_NAME, temp_file)
            except Exception as e:
                # `MlflowTraceDataNotFound` is caught in `TrackingServiceClient.search_traces` and
                # is used to filter out traces with failed trace data download.
                raise MlflowTraceDataNotFound(artifact_path=TRACE_DATA_FILE_NAME) from e
            return try_read_trace_data(temp_file)

    def upload_trace_data(self, trace_data: str) -> None:
        """
        Upload the trace data.

        Args:
            trace_data: The json-serialized trace data to upload.
        """
        with write_local_temp_trace_data_file(trace_data) as temp_file:
            self.log_artifact(temp_file)


@contextmanager
def write_local_temp_trace_data_file(trace_data: str):
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_file = Path(temp_dir, TRACE_DATA_FILE_NAME)
        temp_file.write_text(trace_data, encoding="utf-8")
        yield temp_file


def try_read_trace_data(trace_data_path):
    if not os.path.exists(trace_data_path):
        raise MlflowTraceDataNotFound(artifact_path=trace_data_path)
    with open(trace_data_path, encoding="utf-8") as f:
        data = f.read()
    if not data:
        raise MlflowTraceDataNotFound(artifact_path=trace_data_path)
    try:
        return json.loads(data)
    except json.decoder.JSONDecodeError as e:
        raise MlflowTraceDataCorrupted(artifact_path=trace_data_path) from e


class MultipartUploadMixin(ABC):
    @abstractmethod
    def create_multipart_upload(
        self, local_file: str, num_parts: int, artifact_path: str | None = None
    ) -> CreateMultipartUploadResponse:
        """
        Initiate a multipart upload and retrieve the pre-signed upload URLS and upload id.

        Args:
            local_file: Path of artifact to upload.
            num_parts: Number of parts to upload. Only required by S3 and GCS.
            artifact_path: Directory within the run's artifact directory in which to upload the
                artifact.

        """

    @abstractmethod
    def complete_multipart_upload(
        self,
        local_file: str,
        upload_id: str,
        parts: list[MultipartUploadPart],
        artifact_path: str | None = None,
    ) -> None:
        """
        Complete a multipart upload.

        Args:
            local_file: Path of artifact to upload.
            upload_id: The upload ID. Only required by S3 and GCS.
            parts: A list containing the metadata of each part that has been uploaded.
            artifact_path: Directory within the run's artifact directory in which to upload the
                artifact.

        """

    @abstractmethod
    def abort_multipart_upload(
        self,
        local_file: str,
        upload_id: str,
        artifact_path: str | None = None,
    ) -> None:
        """
        Abort a multipart upload.

        Args:
            local_file: Path of artifact to upload.
            upload_id: The upload ID. Only required by S3 and GCS.
            artifact_path: Directory within the run's artifact directory in which to upload the
                artifact.

        """


def verify_artifact_path(artifact_path):
    if artifact_path and path_not_unique(artifact_path):
        raise MlflowException(
            f"Invalid artifact path: '{artifact_path}'. {bad_path_message(artifact_path)}"
        )
```

--------------------------------------------------------------------------------

---[FILE: artifact_repository_registry.py]---
Location: mlflow-master/mlflow/store/artifact/artifact_repository_registry.py

```python
import warnings

from mlflow.exceptions import MlflowException
from mlflow.store.artifact.artifact_repo import ArtifactRepository
from mlflow.store.artifact.azure_blob_artifact_repo import AzureBlobArtifactRepository
from mlflow.store.artifact.azure_data_lake_artifact_repo import AzureDataLakeArtifactRepository
from mlflow.store.artifact.dbfs_artifact_repo import dbfs_artifact_repo_factory
from mlflow.store.artifact.ftp_artifact_repo import FTPArtifactRepository
from mlflow.store.artifact.gcs_artifact_repo import GCSArtifactRepository
from mlflow.store.artifact.hdfs_artifact_repo import HdfsArtifactRepository
from mlflow.store.artifact.http_artifact_repo import HttpArtifactRepository
from mlflow.store.artifact.local_artifact_repo import LocalArtifactRepository
from mlflow.store.artifact.mlflow_artifacts_repo import MlflowArtifactsRepository
from mlflow.store.artifact.models_artifact_repo import ModelsArtifactRepository
from mlflow.store.artifact.r2_artifact_repo import R2ArtifactRepository
from mlflow.store.artifact.runs_artifact_repo import RunsArtifactRepository
from mlflow.store.artifact.s3_artifact_repo import S3ArtifactRepository
from mlflow.store.artifact.sftp_artifact_repo import SFTPArtifactRepository
from mlflow.store.artifact.uc_volume_artifact_repo import uc_volume_artifact_repo_factory
from mlflow.utils.plugins import get_entry_points
from mlflow.utils.uri import get_uri_scheme, is_uc_volumes_uri


class ArtifactRepositoryRegistry:
    """Scheme-based registry for artifact repository implementations

    This class allows the registration of a function or class to provide an implementation for a
    given scheme of `artifact_uri` through the `register` method. Implementations declared though
    the entrypoints `mlflow.artifact_repository` group can be automatically registered through the
    `register_entrypoints` method.

    When instantiating an artifact repository through the `get_artifact_repository` method, the
    scheme of the artifact URI provided will be used to select which implementation to instantiate,
    which will be called with same arguments passed to the `get_artifact_repository` method.
    """

    def __init__(self):
        self._registry = {}

    def register(self, scheme, repository):
        """Register artifact repositories provided by other packages"""
        self._registry[scheme] = repository

    def register_entrypoints(self):
        # Register artifact repositories provided by other packages
        for entrypoint in get_entry_points("mlflow.artifact_repository"):
            try:
                self.register(entrypoint.name, entrypoint.load())
            except (AttributeError, ImportError) as exc:
                warnings.warn(
                    'Failure attempting to register artifact repository for scheme "{}": {}'.format(
                        entrypoint.name, str(exc)
                    ),
                    stacklevel=2,
                )

    def get_artifact_repository(
        self, artifact_uri: str, tracking_uri: str | None = None, registry_uri: str | None = None
    ) -> ArtifactRepository:
        """
        Get an artifact repository from the registry based on the scheme of artifact_uri

        Args:
            artifact_uri: The artifact store URI. This URI is used to select which artifact
                repository implementation to instantiate and is passed to the constructor of the
                implementation.
            tracking_uri: The tracking URI. This URI is passed to the constructor of the
                implementation.
            registry_uri: The registry URI. This URI is passed to the constructor of the
                implementation.

        Returns:
            An instance of `mlflow.store.ArtifactRepository` that fulfills the artifact URI
            requirements.
        """
        scheme = get_uri_scheme(artifact_uri)
        repository = self._registry.get(scheme)
        if repository is None:
            raise MlflowException(
                f"Could not find a registered artifact repository for: {artifact_uri}. "
                f"Currently registered schemes are: {list(self._registry.keys())}"
            )
        return repository(artifact_uri, tracking_uri=tracking_uri, registry_uri=registry_uri)

    def get_registered_artifact_repositories(self):
        """
        Get all registered artifact repositories.

        Returns:
            A dictionary mapping string artifact URI schemes to artifact repositories.
        """
        return self._registry


def _dbfs_artifact_repo_factory(
    artifact_uri: str, tracking_uri: str | None = None, registry_uri: str | None = None
) -> ArtifactRepository:
    return (
        uc_volume_artifact_repo_factory(artifact_uri, tracking_uri, registry_uri)
        if is_uc_volumes_uri(artifact_uri)
        else dbfs_artifact_repo_factory(artifact_uri, tracking_uri, registry_uri)
    )


_artifact_repository_registry = ArtifactRepositoryRegistry()

_artifact_repository_registry.register("", LocalArtifactRepository)
_artifact_repository_registry.register("file", LocalArtifactRepository)
_artifact_repository_registry.register("s3", S3ArtifactRepository)
_artifact_repository_registry.register("r2", R2ArtifactRepository)
_artifact_repository_registry.register("gs", GCSArtifactRepository)
_artifact_repository_registry.register("wasbs", AzureBlobArtifactRepository)
_artifact_repository_registry.register("ftp", FTPArtifactRepository)
_artifact_repository_registry.register("sftp", SFTPArtifactRepository)
_artifact_repository_registry.register("dbfs", _dbfs_artifact_repo_factory)
_artifact_repository_registry.register("hdfs", HdfsArtifactRepository)
_artifact_repository_registry.register("viewfs", HdfsArtifactRepository)
_artifact_repository_registry.register("runs", RunsArtifactRepository)
_artifact_repository_registry.register("models", ModelsArtifactRepository)
for scheme in ["http", "https"]:
    _artifact_repository_registry.register(scheme, HttpArtifactRepository)
_artifact_repository_registry.register("mlflow-artifacts", MlflowArtifactsRepository)
_artifact_repository_registry.register("abfss", AzureDataLakeArtifactRepository)

_artifact_repository_registry.register_entrypoints()


def get_artifact_repository(
    artifact_uri: str, tracking_uri: str | None = None, registry_uri: str | None = None
) -> ArtifactRepository:
    """
    Get an artifact repository from the registry based on the scheme of artifact_uri

    Args:
        artifact_uri: The artifact store URI. This URI is used to select which artifact
            repository implementation to instantiate and is passed to the constructor of the
            implementation.
        tracking_uri: The tracking URI. This URI is passed to the constructor of the
            implementation.
        registry_uri: The registry URI. This URI is passed to the constructor of the
            implementation.

    Returns:
        An instance of `mlflow.store.ArtifactRepository` that fulfills the artifact URI
        requirements.
    """
    return _artifact_repository_registry.get_artifact_repository(
        artifact_uri, tracking_uri, registry_uri
    )


def get_registered_artifact_repositories() -> dict[str, ArtifactRepository]:
    """
    Get all registered artifact repositories.

    Returns:
        A dictionary mapping string artifact URI schemes to artifact repositories.
    """
    return _artifact_repository_registry.get_registered_artifact_repositories()
```

--------------------------------------------------------------------------------

---[FILE: azure_blob_artifact_repo.py]---
Location: mlflow-master/mlflow/store/artifact/azure_blob_artifact_repo.py

```python
import base64
import datetime
import os
import posixpath
import re
import urllib.parse
from datetime import timezone

from mlflow.entities import FileInfo
from mlflow.entities.multipart_upload import (
    CreateMultipartUploadResponse,
    MultipartUploadCredential,
)
from mlflow.environment_variables import MLFLOW_ARTIFACT_UPLOAD_DOWNLOAD_TIMEOUT
from mlflow.exceptions import MlflowException
from mlflow.store.artifact.artifact_repo import ArtifactRepository, MultipartUploadMixin
from mlflow.utils.credentials import get_default_host_creds


def encode_base64(data: str | bytes) -> str:
    if isinstance(data, str):
        data = data.encode("utf-8")
    encoded = base64.b64encode(data)
    return encoded.decode("utf-8")


def decode_base64(encoded: str) -> str:
    decoded_bytes = base64.b64decode(encoded)
    return decoded_bytes.decode("utf-8")


class AzureBlobArtifactRepository(ArtifactRepository, MultipartUploadMixin):
    """
    Stores artifacts on Azure Blob Storage.

    This repository is used with URIs of the form
    ``wasbs://<container-name>@<ystorage-account-name>.blob.core.windows.net/<path>``,
    following the same URI scheme as Hadoop on Azure blob storage. It requires either that:
    - Azure storage connection string is in the env var ``AZURE_STORAGE_CONNECTION_STRING``
    - Azure storage access key is in the env var ``AZURE_STORAGE_ACCESS_KEY``
    - DefaultAzureCredential is configured
    """

    def __init__(
        self,
        artifact_uri: str,
        client=None,
        tracking_uri: str | None = None,
        registry_uri: str | None = None,
    ) -> None:
        super().__init__(artifact_uri, tracking_uri, registry_uri)

        _DEFAULT_TIMEOUT = 600  # 10 minutes
        self.write_timeout = MLFLOW_ARTIFACT_UPLOAD_DOWNLOAD_TIMEOUT.get() or _DEFAULT_TIMEOUT

        # Allow override for testing
        if client:
            self.client = client
            return

        from azure.storage.blob import BlobServiceClient

        (_, account, _, api_uri_suffix) = AzureBlobArtifactRepository.parse_wasbs_uri(artifact_uri)
        if "AZURE_STORAGE_CONNECTION_STRING" in os.environ:
            self.client = BlobServiceClient.from_connection_string(
                conn_str=os.environ.get("AZURE_STORAGE_CONNECTION_STRING"),
                connection_verify=get_default_host_creds(artifact_uri).verify,
            )
        elif "AZURE_STORAGE_ACCESS_KEY" in os.environ:
            account_url = f"https://{account}.{api_uri_suffix}"
            self.client = BlobServiceClient(
                account_url=account_url,
                credential=os.environ.get("AZURE_STORAGE_ACCESS_KEY"),
                connection_verify=get_default_host_creds(artifact_uri).verify,
            )
        else:
            try:
                from azure.identity import DefaultAzureCredential
            except ImportError as exc:
                raise ImportError(
                    "Using DefaultAzureCredential requires the azure-identity package. "
                    "Please install it via: pip install azure-identity"
                ) from exc

            account_url = f"https://{account}.{api_uri_suffix}"
            self.client = BlobServiceClient(
                account_url=account_url,
                credential=DefaultAzureCredential(),
                connection_verify=get_default_host_creds(artifact_uri).verify,
            )

    @staticmethod
    def parse_wasbs_uri(uri):
        """Parse a wasbs:// URI, returning (container, storage_account, path, api_uri_suffix)."""
        parsed = urllib.parse.urlparse(uri)
        if parsed.scheme != "wasbs":
            raise Exception(f"Not a WASBS URI: {uri}")

        match = re.match(
            r"([^@]+)@([^.]+)\.(blob\.core\.(windows\.net|chinacloudapi\.cn))", parsed.netloc
        )

        if match is None:
            raise Exception(
                "WASBS URI must be of the form "
                "<container>@<account>.blob.core.windows.net"
                " or <container>@<account>.blob.core.chinacloudapi.cn"
            )
        container = match.group(1)
        storage_account = match.group(2)
        api_uri_suffix = match.group(3)
        path = parsed.path
        path = path.removeprefix("/")
        return container, storage_account, path, api_uri_suffix

    def log_artifact(self, local_file, artifact_path=None):
        (container, _, dest_path, _) = self.parse_wasbs_uri(self.artifact_uri)
        container_client = self.client.get_container_client(container)
        if artifact_path:
            dest_path = posixpath.join(dest_path, artifact_path)
        dest_path = posixpath.join(dest_path, os.path.basename(local_file))
        with open(local_file, "rb") as file:
            container_client.upload_blob(
                dest_path, file, overwrite=True, timeout=self.write_timeout
            )

    def log_artifacts(self, local_dir, artifact_path=None):
        (container, _, dest_path, _) = self.parse_wasbs_uri(self.artifact_uri)
        container_client = self.client.get_container_client(container)
        if artifact_path:
            dest_path = posixpath.join(dest_path, artifact_path)
        local_dir = os.path.abspath(local_dir)
        for root, _, filenames in os.walk(local_dir):
            upload_path = dest_path
            if root != local_dir:
                rel_path = os.path.relpath(root, local_dir)
                upload_path = posixpath.join(dest_path, rel_path)
            for f in filenames:
                remote_file_path = posixpath.join(upload_path, f)
                local_file_path = os.path.join(root, f)
                with open(local_file_path, "rb") as file:
                    container_client.upload_blob(
                        remote_file_path, file, overwrite=True, timeout=self.write_timeout
                    )

    def list_artifacts(self, path=None):
        # Newer versions of `azure-storage-blob` (>= 12.4.0) provide a public
        # `azure.storage.blob.BlobPrefix` object to signify that a blob is a directory,
        # while older versions only expose this API internally as
        # `azure.storage.blob._models.BlobPrefix`
        try:
            from azure.storage.blob import BlobPrefix
        except ImportError:
            from azure.storage.blob._models import BlobPrefix

        def is_dir(result):
            return isinstance(result, BlobPrefix)

        (container, _, artifact_path, _) = self.parse_wasbs_uri(self.artifact_uri)
        container_client = self.client.get_container_client(container)
        dest_path = artifact_path
        if path:
            dest_path = posixpath.join(dest_path, path)
        infos = []
        prefix = dest_path if dest_path.endswith("/") else dest_path + "/"
        results = container_client.walk_blobs(name_starts_with=prefix)

        for result in results:
            if (
                dest_path == result.name
            ):  # result isn't actually a child of the path we're interested in, so skip it
                continue

            if not result.name.startswith(artifact_path):
                raise MlflowException(
                    "The name of the listed Azure blob does not begin with the specified"
                    f" artifact path. Artifact path: {artifact_path}. Blob name: {result.name}"
                )

            if is_dir(result):
                subdir = posixpath.relpath(path=result.name, start=artifact_path)
                subdir = subdir.removesuffix("/")
                infos.append(FileInfo(subdir, is_dir=True, file_size=None))
            else:  # Just a plain old blob
                file_name = posixpath.relpath(path=result.name, start=artifact_path)
                infos.append(FileInfo(file_name, is_dir=False, file_size=result.size))

        # The list_artifacts API expects us to return an empty list if the
        # the path references a single file.
        rel_path = dest_path[len(artifact_path) + 1 :]
        if (len(infos) == 1) and not infos[0].is_dir and (infos[0].path == rel_path):
            return []
        return sorted(infos, key=lambda f: f.path)

    def _download_file(self, remote_file_path, local_path):
        (container, _, remote_root_path, _) = self.parse_wasbs_uri(self.artifact_uri)
        container_client = self.client.get_container_client(container)
        remote_full_path = posixpath.join(remote_root_path, remote_file_path)
        blob = container_client.download_blob(remote_full_path)
        with open(local_path, "wb") as file:
            blob.readinto(file)

    def delete_artifacts(self, artifact_path=None):
        from azure.core.exceptions import ResourceNotFoundError

        (container, _, dest_path, _) = self.parse_wasbs_uri(self.artifact_uri)
        container_client = self.client.get_container_client(container)
        if artifact_path:
            dest_path = posixpath.join(dest_path, artifact_path)

        try:
            blobs = container_client.list_blobs(name_starts_with=dest_path)
            blob_list = list(blobs)
            if not blob_list:
                raise MlflowException(f"No such file or directory: '{dest_path}'")

            for blob in blob_list:
                container_client.delete_blob(blob.name)
        except ResourceNotFoundError:
            raise MlflowException(f"No such file or directory: '{dest_path}'")

    def create_multipart_upload(self, local_file, num_parts=1, artifact_path=None):
        from azure.storage.blob import BlobSasPermissions, generate_blob_sas

        (container, _, dest_path, _) = self.parse_wasbs_uri(self.artifact_uri)
        if artifact_path:
            dest_path = posixpath.join(dest_path, artifact_path)
        dest_path = posixpath.join(dest_path, os.path.basename(local_file))

        # Put Block: https://learn.microsoft.com/en-us/rest/api/storageservices/put-block?tabs=microsoft-entra-id
        # SDK: https://learn.microsoft.com/en-us/python/api/azure-storage-blob/azure.storage.blob.blobclient?view=azure-python#azure-storage-blob-blobclient-stage-block
        blob_url = posixpath.join(self.client.url, container, dest_path)
        sas_token = generate_blob_sas(
            account_name=self.client.account_name,
            container_name=container,
            blob_name=dest_path,
            account_key=self.client.credential.account_key,
            permission=BlobSasPermissions(read=True, write=True),
            expiry=datetime.datetime.now(timezone.utc) + datetime.timedelta(hours=1),
        )
        credentials = []
        for i in range(1, num_parts + 1):
            block_id = f"mlflow_block_{i}"
            # see https://github.com/Azure/azure-sdk-for-python/blob/18a66ef98c6f2153491489d3d7d2fe4a5849e4ac/sdk/storage/azure-storage-blob/azure/storage/blob/_blob_client.py#L2468
            safe_block_id = urllib.parse.quote(encode_base64(block_id), safe="")
            url = f"{blob_url}?comp=block&blockid={safe_block_id}&{sas_token}"
            credentials.append(
                MultipartUploadCredential(
                    url=url,
                    part_number=i,
                    headers={},
                )
            )
        return CreateMultipartUploadResponse(
            credentials=credentials,
            upload_id=None,
        )

    def complete_multipart_upload(self, local_file, upload_id, parts=None, artifact_path=None):
        (container, _, dest_path, _) = self.parse_wasbs_uri(self.artifact_uri)
        if artifact_path:
            dest_path = posixpath.join(dest_path, artifact_path)
        dest_path = posixpath.join(dest_path, os.path.basename(local_file))

        block_ids = []
        for part in parts:
            qs = urllib.parse.urlparse(part.url).query
            block_id = urllib.parse.parse_qs(qs)["blockid"][0]
            block_id = decode_base64(urllib.parse.unquote(block_id))
            block_ids.append(block_id)
        blob_client = self.client.get_blob_client(container, dest_path)
        blob_client.commit_block_list(block_ids)

    def abort_multipart_upload(self, local_file, upload_id, artifact_path=None):
        # There is no way to delete uncommitted blocks in Azure Blob Storage.
        # Instead, they are garbage collected within 7 days.
        # See https://docs.microsoft.com/en-us/rest/api/storageservices/put-block-list#remarks
        # The blob may already exist so we cannot delete it either.
        pass
```

--------------------------------------------------------------------------------

````
