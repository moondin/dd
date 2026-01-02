---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 668
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 668 of 991)

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

---[FILE: azure_data_lake_artifact_repo.py]---
Location: mlflow-master/mlflow/store/artifact/azure_data_lake_artifact_repo.py

```python
import os
import posixpath
import re
import urllib.parse

import requests

from mlflow.azure.client import patch_adls_file_upload, patch_adls_flush, put_adls_file_creation
from mlflow.entities import FileInfo
from mlflow.environment_variables import (
    MLFLOW_ARTIFACT_UPLOAD_DOWNLOAD_TIMEOUT,
    MLFLOW_ENABLE_MULTIPART_UPLOAD,
    MLFLOW_MULTIPART_UPLOAD_CHUNK_SIZE,
)
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_artifacts_pb2 import ArtifactCredentialInfo
from mlflow.store.artifact.artifact_repo import _retry_with_new_creds
from mlflow.store.artifact.cloud_artifact_repo import (
    CloudArtifactRepository,
    _complete_futures,
    _compute_num_chunks,
)


def _parse_abfss_uri(uri):
    """
    Parse an ABFSS URI in the format
    "abfss://<file_system>@<account_name>.<domain_suffix>/<path>",
    returning a tuple consisting of the filesystem, account name, domain suffix, and path

    See more details about ABFSS URIs at
    https://learn.microsoft.com/en-us/azure/storage/blobs/data-lake-storage-abfs-driver#uri-scheme-to-reference-data.
    Also, see different domain suffixes for:
    * Azure China: https://learn.microsoft.com/en-us/azure/china/resources-developer-guide
    * Azure Government: https://learn.microsoft.com/en-us/azure/azure-government/compare-azure-government-global-azure#guidance-for-developers
    * Azure Private Link: https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-dns#government
    Args:
        uri: ABFSS URI to parse

    Returns:
        A tuple containing the name of the filesystem, account name, domain suffix,
        and path
    """
    parsed = urllib.parse.urlparse(uri)
    if parsed.scheme != "abfss":
        raise MlflowException(f"Not an ABFSS URI: {uri}")

    match = re.match(r"([^@]+)@([^.]+)\.(.*)", parsed.netloc)

    if match is None:
        raise MlflowException(
            "ABFSS URI must be of the form abfss://<filesystem>@<account>.<domain_suffix>"
        )
    filesystem = match.group(1)
    account_name = match.group(2)
    domain_suffix = match.group(3)
    path = parsed.path
    path = path.removeprefix("/")
    return filesystem, account_name, domain_suffix, path


def _get_data_lake_client(account_url, credential):
    from azure.storage.filedatalake import DataLakeServiceClient

    return DataLakeServiceClient(account_url, credential)


class AzureDataLakeArtifactRepository(CloudArtifactRepository):
    """
    Stores artifacts on Azure Data Lake Storage Gen2.

    This repository is used with URIs of the form
    ``abfs[s]://file_system@account_name.dfs.core.windows.net/<path>/<path>``.

    Args
        credential: Azure credential (see options in https://learn.microsoft.com/en-us/python/api/azure-core/azure.core.credentials?view=azure-python)
            to use to authenticate to storage
    """

    def __init__(
        self,
        artifact_uri: str,
        credential=None,
        credential_refresh_def=None,
        tracking_uri: str | None = None,
        registry_uri: str | None = None,
    ) -> None:
        super().__init__(artifact_uri, tracking_uri, registry_uri)
        _DEFAULT_TIMEOUT = 600  # 10 minutes
        self.write_timeout = MLFLOW_ARTIFACT_UPLOAD_DOWNLOAD_TIMEOUT.get() or _DEFAULT_TIMEOUT
        self._parse_credentials(credential)
        self._credential_refresh_def = credential_refresh_def

    def _parse_credentials(self, credential):
        (filesystem, account_name, domain_suffix, path) = _parse_abfss_uri(self.artifact_uri)
        account_url = f"https://{account_name}.{domain_suffix}"
        self.sas_token = ""
        if credential is None:
            if sas_token := os.environ.get("AZURE_STORAGE_SAS_TOKEN"):
                self.sas_token = f"?{sas_token}"
                account_url += self.sas_token
            else:
                from azure.identity import DefaultAzureCredential

                credential = DefaultAzureCredential()
        self.credential = credential
        data_lake_client = _get_data_lake_client(
            account_url=account_url, credential=self.credential
        )
        self.fs_client = data_lake_client.get_file_system_client(filesystem)
        self.domain_suffix = domain_suffix
        self.base_data_lake_directory = path
        self.account_name = account_name
        self.container = filesystem

    def _refresh_credentials(self):
        if not self._credential_refresh_def:
            return self.fs_client
        new_creds = self._credential_refresh_def()
        self._parse_credentials(new_creds["credential"])
        return self.fs_client

    def log_artifact(self, local_file, artifact_path=None):
        dest_path = self.base_data_lake_directory
        if artifact_path:
            dest_path = posixpath.join(dest_path, artifact_path)
        local_file_path = os.path.abspath(local_file)
        file_name = os.path.basename(local_file_path)

        def try_func(creds):
            dir_client = creds.get_directory_client(dest_path)
            file_client = dir_client.get_file_client(file_name)
            if os.path.getsize(local_file_path) == 0:
                file_client.create_file()
            else:
                with open(local_file_path, "rb") as file:
                    file_client.upload_data(data=file, overwrite=True)

        _retry_with_new_creds(
            try_func=try_func, creds_func=self._refresh_credentials, orig_creds=self.fs_client
        )

    def list_artifacts(self, path=None):
        directory_to_list = self.base_data_lake_directory
        if path:
            directory_to_list = posixpath.join(directory_to_list, path)
        infos = []
        for result in self.fs_client.get_paths(path=directory_to_list, recursive=False):
            if (
                directory_to_list == result.name
            ):  # result isn't actually a child of the path we're interested in, so skip it
                continue
            if result.is_directory:
                subdir = posixpath.relpath(path=result.name, start=self.base_data_lake_directory)
                subdir = subdir.removesuffix("/")
                infos.append(FileInfo(subdir, is_dir=True, file_size=None))
            else:
                file_name = posixpath.relpath(path=result.name, start=self.base_data_lake_directory)
                infos.append(FileInfo(file_name, is_dir=False, file_size=result.content_length))

        # The list_artifacts API expects us to return an empty list if the
        # the path references a single file.
        rel_path = directory_to_list[len(self.base_data_lake_directory) + 1 :]
        if (len(infos) == 1) and not infos[0].is_dir and (infos[0].path == rel_path):
            return []
        return sorted(infos, key=lambda f: f.path)

    def _download_from_cloud(self, remote_file_path, local_path):
        remote_full_path = posixpath.join(self.base_data_lake_directory, remote_file_path)
        base_dir = posixpath.dirname(remote_full_path)

        def try_func(creds):
            dir_client = creds.get_directory_client(base_dir)
            filename = posixpath.basename(remote_full_path)
            file_client = dir_client.get_file_client(filename)
            with open(local_path, "wb") as file:
                file_client.download_file().readinto(file)

        _retry_with_new_creds(
            try_func=try_func, creds_func=self._refresh_credentials, orig_creds=self.fs_client
        )

    def delete_artifacts(self, artifact_path=None):
        raise NotImplementedError("This artifact repository does not support deleting artifacts")

    def _upload_to_cloud(self, cloud_credential_info, src_file_path, artifact_file_path):
        if (
            MLFLOW_ENABLE_MULTIPART_UPLOAD.get()
            and os.path.getsize(src_file_path) > MLFLOW_MULTIPART_UPLOAD_CHUNK_SIZE.get()
        ):
            self._multipart_upload(cloud_credential_info, src_file_path, artifact_file_path)
        else:
            artifact_subdir = posixpath.dirname(artifact_file_path)
            self.log_artifact(src_file_path, artifact_subdir)

    def _retryable_adls_function(self, func, artifact_file_path, **kwargs):
        # Attempt to call the passed function.  Retry if the credentials have expired
        try:
            func(**kwargs)
        except requests.HTTPError as e:
            if e.response.status_code in [403]:
                new_credentials = self._get_write_credential_infos([artifact_file_path])[0]
                kwargs["sas_url"] = new_credentials.signed_uri
                func(**kwargs)
            else:
                raise e

    def _multipart_upload(self, credentials, src_file_path, artifact_file_path):
        """
        Uploads a file to a given Azure storage location using the ADLS gen2 API.
        """
        try:
            headers = self._extract_headers_from_credentials(credentials.headers)
            # try to create the file
            self._retryable_adls_function(
                func=put_adls_file_creation,
                artifact_file_path=artifact_file_path,
                sas_url=credentials.signed_uri,
                headers=headers,
            )
            # next try to append the file
            futures = {}
            file_size = os.path.getsize(src_file_path)
            num_chunks = _compute_num_chunks(
                src_file_path, MLFLOW_MULTIPART_UPLOAD_CHUNK_SIZE.get()
            )
            use_single_part_upload = num_chunks == 1
            for index in range(num_chunks):
                start_byte = index * MLFLOW_MULTIPART_UPLOAD_CHUNK_SIZE.get()
                future = self.chunk_thread_pool.submit(
                    self._retryable_adls_function,
                    func=patch_adls_file_upload,
                    artifact_file_path=artifact_file_path,
                    sas_url=credentials.signed_uri,
                    local_file=src_file_path,
                    start_byte=start_byte,
                    size=MLFLOW_MULTIPART_UPLOAD_CHUNK_SIZE.get(),
                    position=start_byte,
                    headers=headers,
                    is_single=use_single_part_upload,
                )
                futures[future] = index

            _, errors = _complete_futures(futures, src_file_path)
            if errors:
                raise MlflowException(
                    f"Failed to upload at least one part of {artifact_file_path}. Errors: {errors}"
                )

            # finally try to flush the file
            if not use_single_part_upload:
                self._retryable_adls_function(
                    func=patch_adls_flush,
                    artifact_file_path=artifact_file_path,
                    sas_url=credentials.signed_uri,
                    position=file_size,
                    headers=headers,
                )
        except Exception as err:
            raise MlflowException(err)

    def _get_presigned_uri(self, artifact_file_path):
        """
        Gets the presigned URL required to upload a file to or download a file from a given Azure
        storage location.

        Args:
            artifact_file_path: Path of the file relative to the artifact repository root.

        Returns:
            a string presigned URL.
        """
        sas_token = (
            f"?{self.credential.signature}"
            if hasattr(self.credential, "signature")
            else self.sas_token
        )
        return (
            f"https://{self.account_name}.{self.domain_suffix}/{self.container}/"
            f"{self.base_data_lake_directory}/{artifact_file_path}{sas_token}"
        )

    def _get_write_credential_infos(self, remote_file_paths) -> list[ArtifactCredentialInfo]:
        return [
            ArtifactCredentialInfo(signed_uri=self._get_presigned_uri(path))
            for path in remote_file_paths
        ]

    def _get_read_credential_infos(self, remote_file_paths) -> list[ArtifactCredentialInfo]:
        return [
            ArtifactCredentialInfo(signed_uri=self._get_presigned_uri(path))
            for path in remote_file_paths
        ]
```

--------------------------------------------------------------------------------

---[FILE: cli.py]---
Location: mlflow-master/mlflow/store/artifact/cli.py

```python
import logging

import click

from mlflow.artifacts import download_artifacts as _download_artifacts
from mlflow.store.artifact.artifact_repository_registry import get_artifact_repository
from mlflow.tracking import _get_store
from mlflow.utils.proto_json_utils import message_to_json

_logger = logging.getLogger(__name__)


@click.group("artifacts")
def commands():
    """
    Upload, list, and download artifacts from an MLflow artifact repository.

    To manage artifacts for a run associated with a tracking server, set the MLFLOW_TRACKING_URI
    environment variable to the URL of the desired server.
    """


@commands.command("log-artifact")
@click.option("--local-file", "-l", required=True, help="Local path to artifact to log")
@click.option("--run-id", "-r", required=True, help="Run ID into which we should log the artifact.")
@click.option(
    "--artifact-path",
    "-a",
    help="If specified, we will log the artifact into this subdirectory of the "
    + "run's artifact directory.",
)
def log_artifact(local_file, run_id, artifact_path):
    """
    Log a local file as an artifact of a run, optionally within a run-specific
    artifact path. Run artifacts can be organized into directories, so you can
    place the artifact in a directory this way.
    """
    store = _get_store()
    artifact_uri = store.get_run(run_id).info.artifact_uri
    artifact_repo = get_artifact_repository(artifact_uri)
    artifact_repo.log_artifact(local_file, artifact_path)
    _logger.info(
        "Logged artifact from local file %s to artifact_path=%s", local_file, artifact_path
    )


@commands.command("log-artifacts")
@click.option("--local-dir", "-l", required=True, help="Directory of local artifacts to log")
@click.option("--run-id", "-r", required=True, help="Run ID into which we should log the artifact.")
@click.option(
    "--artifact-path",
    "-a",
    help="If specified, we will log the artifact into this subdirectory of the "
    + "run's artifact directory.",
)
def log_artifacts(local_dir, run_id, artifact_path):
    """
    Log the files within a local directory as an artifact of a run, optionally
    within a run-specific artifact path. Run artifacts can be organized into
    directories, so you can place the artifact in a directory this way.
    """
    store = _get_store()
    artifact_uri = store.get_run(run_id).info.artifact_uri
    artifact_repo = get_artifact_repository(artifact_uri)
    artifact_repo.log_artifacts(local_dir, artifact_path)
    _logger.info("Logged artifact from local dir %s to artifact_path=%s", local_dir, artifact_path)


@commands.command("list")
@click.option("--run-id", "-r", required=True, help="Run ID to be listed")
@click.option(
    "--artifact-path",
    "-a",
    help="If specified, a path relative to the run's root directory to list.",
)
def list_artifacts(run_id, artifact_path):
    """
    Return all the artifacts directly under run's root artifact directory,
    or a sub-directory. The output is a JSON-formatted list.
    """
    artifact_path = artifact_path if artifact_path is not None else ""
    store = _get_store()
    artifact_uri = store.get_run(run_id).info.artifact_uri
    artifact_repo = get_artifact_repository(artifact_uri)
    file_infos = artifact_repo.list_artifacts(artifact_path)
    click.echo(_file_infos_to_json(file_infos))


def _file_infos_to_json(file_infos):
    json_list = [message_to_json(file_info.to_proto()) for file_info in file_infos]
    return "[" + ", ".join(json_list) + "]"


@commands.command("download")
@click.option("--run-id", "-r", help="Run ID from which to download")
@click.option(
    "--artifact-path",
    "-a",
    help="For use with Run ID: if specified, a path relative to the run's root "
    "directory to download",
)
@click.option(
    "--artifact-uri",
    "-u",
    help="URI pointing to the artifact file or artifacts directory; use as an "
    "alternative to specifying --run_id and --artifact-path",
)
@click.option(
    "--dst-path",
    "-d",
    help=(
        "Path of the local filesystem destination directory to which to download the"
        " specified artifacts. If the directory does not exist, it is created. If unspecified"
        " the artifacts are downloaded to a new uniquely-named directory on the local filesystem,"
        " unless the artifacts already exist on the local filesystem, in which case their local"
        " path is returned directly"
    ),
)
def download_artifacts(run_id, artifact_path, artifact_uri, dst_path):
    """
    Download an artifact file or directory to a local directory.
    The output is the name of the file or directory on the local filesystem.

    Either ``--artifact-uri`` or ``--run-id`` must be provided.
    """
    # Preserve preexisting behavior in MLflow <= 1.24.0 where specifying `artifact_uri` and
    # `artifact_path` together did not throw an exception (unlike
    # `mlflow.artifacts.download_artifacts()`) and instead used `artifact_uri` while ignoring
    # `run_id` and `artifact_path`
    if artifact_uri is not None:
        run_id = None
        artifact_path = None

    downloaded_local_artifact_location = _download_artifacts(
        artifact_uri=artifact_uri, run_id=run_id, artifact_path=artifact_path, dst_path=dst_path
    )
    click.echo(f"\n{downloaded_local_artifact_location}")


if __name__ == "__main__":
    commands()
```

--------------------------------------------------------------------------------

---[FILE: cloud_artifact_repo.py]---
Location: mlflow-master/mlflow/store/artifact/cloud_artifact_repo.py

```python
import logging
import math
import os
import posixpath
import time
from abc import abstractmethod
from concurrent.futures import as_completed
from typing import NamedTuple

from mlflow.environment_variables import (
    _MLFLOW_MPD_NUM_RETRIES,
    _MLFLOW_MPD_RETRY_INTERVAL_SECONDS,
    MLFLOW_ENABLE_MULTIPART_DOWNLOAD,
    MLFLOW_MULTIPART_DOWNLOAD_CHUNK_SIZE,
    MLFLOW_MULTIPART_DOWNLOAD_MINIMUM_FILE_SIZE,
    MLFLOW_MULTIPART_UPLOAD_CHUNK_SIZE,
)
from mlflow.exceptions import MlflowException
from mlflow.store.artifact.artifact_repo import ArtifactRepository
from mlflow.utils import chunk_list
from mlflow.utils.file_utils import (
    ArtifactProgressBar,
    parallelized_download_file_using_http_uri,
    relative_path_to_artifact_path,
    remove_on_error,
)
from mlflow.utils.request_utils import download_chunk
from mlflow.utils.uri import is_fuse_or_uc_volumes_uri

_logger = logging.getLogger(__name__)
_ARTIFACT_UPLOAD_BATCH_SIZE = (
    50  # Max number of artifacts for which to fetch write credentials at once.
)
_AWS_MIN_CHUNK_SIZE = 5 * 1024**2  # 5 MB is the minimum chunk size for S3 multipart uploads
_AWS_MAX_CHUNK_SIZE = 5 * 1024**3  # 5 GB is the maximum chunk size for S3 multipart uploads


def _readable_size(size: int) -> str:
    return f"{size / 1024**2:.2f} MB"


def _validate_chunk_size_aws(chunk_size: int) -> None:
    """
    Validates the specified chunk size in bytes is in valid range for AWS multipart uploads.
    """
    if chunk_size < _AWS_MIN_CHUNK_SIZE or chunk_size > _AWS_MAX_CHUNK_SIZE:
        raise MlflowException(
            message=(
                f"Multipart chunk size {_readable_size(chunk_size)} must be in range: "
                f"{_readable_size(_AWS_MIN_CHUNK_SIZE)} to {_readable_size(_AWS_MAX_CHUNK_SIZE)}."
            )
        )


def _compute_num_chunks(local_file: os.PathLike, chunk_size: int) -> int:
    """
    Computes the number of chunks to use for a multipart upload of the specified file.
    """
    return math.ceil(os.path.getsize(local_file) / chunk_size)


def _complete_futures(futures_dict, file):
    """
    Waits for the completion of all the futures in the given dictionary and returns
    a tuple of two dictionaries. The first dictionary contains the results of the
    futures (unordered) and the second contains the errors (unordered) that occurred
    during the execution of the futures.
    """
    results = {}
    errors = {}

    with ArtifactProgressBar.chunks(
        os.path.getsize(file),
        f"Uploading {file}",
        MLFLOW_MULTIPART_UPLOAD_CHUNK_SIZE.get(),
    ) as pbar:
        for future in as_completed(futures_dict):
            key = futures_dict[future]
            try:
                results[key] = future.result()
                pbar.update()
            except Exception as e:
                errors[key] = repr(e)

    return results, errors


class StagedArtifactUpload(NamedTuple):
    # Local filesystem path of the source file to upload
    src_file_path: str
    # Base artifact URI-relative path specifying the upload destination
    artifact_file_path: str


class CloudArtifactRepository(ArtifactRepository):
    def __init__(
        self, artifact_uri: str, tracking_uri: str | None = None, registry_uri: str | None = None
    ) -> None:
        super().__init__(artifact_uri, tracking_uri, registry_uri)
        # Use an isolated thread pool executor for chunk uploads/downloads to avoid a deadlock
        # caused by waiting for a chunk-upload/download task within a file-upload/download task.
        # See https://superfastpython.com/threadpoolexecutor-deadlock/#Deadlock_1_Submit_and_Wait_for_a_Task_Within_a_Task
        # for more details
        self.chunk_thread_pool = self._create_thread_pool()

    # Write APIs

    def log_artifacts(self, local_dir, artifact_path=None):
        """
        Parallelized implementation of `log_artifacts`.
        """

        artifact_path = artifact_path or ""

        staged_uploads = []
        for dirpath, _, filenames in os.walk(local_dir):
            artifact_subdir = artifact_path
            if dirpath != local_dir:
                rel_path = os.path.relpath(dirpath, local_dir)
                rel_path = relative_path_to_artifact_path(rel_path)
                artifact_subdir = posixpath.join(artifact_path, rel_path)
            for name in filenames:
                src_file_path = os.path.join(dirpath, name)
                src_file_name = os.path.basename(src_file_path)
                staged_uploads.append(
                    StagedArtifactUpload(
                        src_file_path=src_file_path,
                        artifact_file_path=posixpath.join(artifact_subdir, src_file_name),
                    )
                )

        # Join futures to ensure that all artifacts have been uploaded prior to returning
        failed_uploads = {}

        # For each batch of files, upload them in parallel and wait for completion
        # TODO: change to class method
        def upload_artifacts_iter():
            for staged_upload_chunk in chunk_list(staged_uploads, _ARTIFACT_UPLOAD_BATCH_SIZE):
                write_credential_infos = self._get_write_credential_infos(
                    remote_file_paths=[
                        staged_upload.artifact_file_path for staged_upload in staged_upload_chunk
                    ],
                )

                inflight_uploads = {}
                for staged_upload, write_credential_info in zip(
                    staged_upload_chunk, write_credential_infos
                ):
                    upload_future = self.thread_pool.submit(
                        self._upload_to_cloud,
                        cloud_credential_info=write_credential_info,
                        src_file_path=staged_upload.src_file_path,
                        artifact_file_path=staged_upload.artifact_file_path,
                    )
                    inflight_uploads[staged_upload.src_file_path] = upload_future

                yield from inflight_uploads.items()

        with ArtifactProgressBar.files(
            desc="Uploading artifacts", total=len(staged_uploads)
        ) as pbar:
            for src_file_path, upload_future in upload_artifacts_iter():
                try:
                    upload_future.result()
                    pbar.update()
                except Exception as e:
                    failed_uploads[src_file_path] = repr(e)

        if len(failed_uploads) > 0:
            raise MlflowException(
                message=(
                    "The following failures occurred while uploading one or more artifacts"
                    f" to {self.artifact_uri}: {failed_uploads}"
                )
            )

    @abstractmethod
    def _get_write_credential_infos(self, remote_file_paths):
        """
        Retrieve write credentials for a batch of remote file paths, including presigned URLs.

        Args:
            remote_file_paths: List of file paths in the remote artifact repository.

        Returns:
            List of ArtifactCredentialInfo objects corresponding to each file path.
        """

    @abstractmethod
    def _upload_to_cloud(self, cloud_credential_info, src_file_path, artifact_file_path):
        """
        Upload a single file to the cloud.

        Args:
            cloud_credential_info: ArtifactCredentialInfo object with presigned URL for the file.
            src_file_path: Local source file path for the upload.
            artifact_file_path: Path in the artifact repository where the artifact will be logged.

        """

    # Read APIs

    def _extract_headers_from_credentials(self, headers):
        """
        Returns:
            A python dictionary of http headers converted from the protobuf credentials.
        """
        return {header.name: header.value for header in headers}

    def _parallelized_download_from_cloud(self, file_size, remote_file_path, local_path):
        read_credentials = self._get_read_credential_infos([remote_file_path])
        # Read credentials for only one file were requested. So we expected only one value in
        # the response.
        assert len(read_credentials) == 1
        cloud_credential_info = read_credentials[0]

        with remove_on_error(local_path):
            parallel_download_subproc_env = os.environ.copy()
            failed_downloads = parallelized_download_file_using_http_uri(
                thread_pool_executor=self.chunk_thread_pool,
                http_uri=cloud_credential_info.signed_uri,
                download_path=local_path,
                remote_file_path=remote_file_path,
                file_size=file_size,
                uri_type=cloud_credential_info.type,
                chunk_size=MLFLOW_MULTIPART_DOWNLOAD_CHUNK_SIZE.get(),
                env=parallel_download_subproc_env,
                headers=self._extract_headers_from_credentials(cloud_credential_info.headers),
            )
            num_retries = _MLFLOW_MPD_NUM_RETRIES.get()
            interval = _MLFLOW_MPD_RETRY_INTERVAL_SECONDS.get()
            failed_downloads = list(failed_downloads)
            while failed_downloads and num_retries > 0:
                self._refresh_credentials()
                new_cloud_creds = self._get_read_credential_infos([remote_file_path])[0]
                new_signed_uri = new_cloud_creds.signed_uri
                new_headers = self._extract_headers_from_credentials(new_cloud_creds.headers)

                futures = {
                    self.chunk_thread_pool.submit(
                        download_chunk,
                        range_start=chunk.start,
                        range_end=chunk.end,
                        headers=new_headers,
                        download_path=local_path,
                        http_uri=new_signed_uri,
                    ): chunk
                    for chunk in failed_downloads
                }

                new_failed_downloads = []

                for future in as_completed(futures):
                    chunk = futures[future]
                    try:
                        future.result()
                    except Exception as e:
                        _logger.info(
                            f"Failed to download chunk {chunk.index} for {chunk.path}: {e}. "
                            f"The download of this chunk will be retried later."
                        )
                        new_failed_downloads.append(chunk)

                failed_downloads = new_failed_downloads
                num_retries -= 1
                time.sleep(interval)

            if failed_downloads:
                raise MlflowException(
                    message=("All retries have been exhausted. Download has failed.")
                )

    def _download_file(self, remote_file_path, local_path):
        # list_artifacts API only returns a list of FileInfos at the specified path
        # if it's a directory. To get file size, we need to iterate over FileInfos
        # contained by the parent directory. A bad path could result in there being
        # no matching FileInfos (by path), so fall back to None size to prevent
        # parallelized download.
        parent_dir = posixpath.dirname(remote_file_path)
        file_infos = self.list_artifacts(parent_dir)
        file_info = [info for info in file_infos if info.path == remote_file_path]
        file_size = file_info[0].file_size if len(file_info) == 1 else None

        # NB: FUSE mounts do not support file write from a non-0th index seek position.
        # Due to this limitation (writes must start at the beginning of a file),
        # offset writes are disabled if FUSE is the local_path destination.
        if (
            not MLFLOW_ENABLE_MULTIPART_DOWNLOAD.get()
            or not file_size
            or file_size < MLFLOW_MULTIPART_DOWNLOAD_MINIMUM_FILE_SIZE.get()
            or is_fuse_or_uc_volumes_uri(local_path)
            # DatabricksSDKModelsArtifactRepository can only download file via databricks sdk
            # rather than presigned uri used in _parallelized_download_from_cloud.
            or type(self).__name__ == "DatabricksSDKModelsArtifactRepository"
        ):
            self._download_from_cloud(remote_file_path, local_path)
        else:
            self._parallelized_download_from_cloud(file_size, remote_file_path, local_path)

    @abstractmethod
    def _get_read_credential_infos(self, remote_file_paths):
        """
        Retrieve read credentials for a batch of remote file paths, including presigned URLs.

        Args:
            remote_file_paths: List of file paths in the remote artifact repository.

        Returns:
            List of ArtifactCredentialInfo objects corresponding to each file path.
        """

    @abstractmethod
    def _download_from_cloud(self, remote_file_path, local_path):
        """
        Download a file from the input `remote_file_path` and save it to `local_path`.

        Args:
            remote_file_path: Path to file in the remote artifact repository.
            local_path: Local path to download file to.

        """

    def _refresh_credentials(self):
        """
        Refresh credentials for user in the case of credential expiration

        Args:
            None
        """
```

--------------------------------------------------------------------------------

````
