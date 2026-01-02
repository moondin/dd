---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 916
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 916 of 991)

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

---[FILE: test_azure_data_lake_artifact_repo.py]---
Location: mlflow-master/tests/store/artifact/test_azure_data_lake_artifact_repo.py

```python
import json
import os
import posixpath
from unittest import mock
from unittest.mock import ANY

import pytest
import requests
from azure.core.credentials import AzureSasCredential
from azure.storage.filedatalake import (
    DataLakeDirectoryClient,
    DataLakeFileClient,
    DataLakeServiceClient,
    FileSystemClient,
    PathProperties,
)

from mlflow.exceptions import MlflowException, MlflowTraceDataCorrupted
from mlflow.protos.databricks_artifacts_pb2 import ArtifactCredentialInfo
from mlflow.protos.service_pb2 import FileInfo
from mlflow.store.artifact.artifact_repo import try_read_trace_data
from mlflow.store.artifact.azure_data_lake_artifact_repo import (
    AzureDataLakeArtifactRepository,
    _parse_abfss_uri,
)

TEST_ROOT_PATH = "some/path"
TEST_DATA_LAKE_URI_BASE = "abfss://filesystem@account.dfs.core.windows.net"
TEST_DATA_LAKE_URI = posixpath.join(TEST_DATA_LAKE_URI_BASE, TEST_ROOT_PATH)
TEST_CREDENTIAL = mock.Mock()

ADLS_REPOSITORY_PACKAGE = "mlflow.store.artifact.azure_data_lake_artifact_repo"
ADLS_ARTIFACT_REPOSITORY = f"{ADLS_REPOSITORY_PACKAGE}.AzureDataLakeArtifactRepository"


class MockPathList:
    def __init__(self, items, next_marker=None):
        self.items = items
        self.next_marker = next_marker

    def __iter__(self):
        return iter(self.items)


@pytest.fixture
def mock_data_lake_client():
    mock_adls_client = mock.MagicMock(autospec=DataLakeServiceClient)
    with mock.patch(
        "mlflow.store.artifact.azure_data_lake_artifact_repo._get_data_lake_client",
        return_value=mock_adls_client,
    ):
        yield mock_adls_client


@pytest.fixture
def mock_filesystem_client(mock_data_lake_client):
    mock_fs_client = mock.MagicMock(autospec=FileSystemClient)
    mock_data_lake_client.get_file_system_client.return_value = mock_fs_client
    return mock_fs_client


@pytest.fixture
def mock_directory_client(mock_filesystem_client):
    mock_directory_client = mock.MagicMock(autospec=DataLakeDirectoryClient)
    mock_filesystem_client.get_directory_client.return_value = mock_directory_client
    return mock_directory_client


@pytest.fixture
def mock_file_client(mock_directory_client):
    mock_file_client = mock.MagicMock(autospec=DataLakeFileClient)
    mock_directory_client.get_file_client.return_value = mock_file_client
    return mock_file_client


@pytest.mark.parametrize(
    ("uri", "filesystem", "account", "region_suffix", "path"),
    [
        (
            "abfss://filesystem@acct.dfs.core.windows.net/path",
            "filesystem",
            "acct",
            "dfs.core.windows.net",
            "path",
        ),
        (
            "abfss://filesystem@acct.dfs.core.windows.net",
            "filesystem",
            "acct",
            "dfs.core.windows.net",
            "",
        ),
        (
            "abfss://filesystem@acct.dfs.core.windows.net/",
            "filesystem",
            "acct",
            "dfs.core.windows.net",
            "",
        ),
        (
            "abfss://filesystem@acct.dfs.core.windows.net/a/b",
            "filesystem",
            "acct",
            "dfs.core.windows.net",
            "a/b",
        ),
        (
            "abfss://filesystem@acct.dfs.core.chinacloudapi.cn/a/b",
            "filesystem",
            "acct",
            "dfs.core.chinacloudapi.cn",
            "a/b",
        ),
        (
            "abfss://filesystem@acct.privatelink.dfs.core.windows.net/a/b",
            "filesystem",
            "acct",
            "privatelink.dfs.core.windows.net",
            "a/b",
        ),
        (
            "abfss://filesystem@acct.dfs.core.usgovcloudapi.net/a/b",
            "filesystem",
            "acct",
            "dfs.core.usgovcloudapi.net",
            "a/b",
        ),
    ],
)
def test_parse_valid_abfss_uri(uri, filesystem, account, region_suffix, path):
    assert _parse_abfss_uri(uri) == (filesystem, account, region_suffix, path)


@pytest.mark.parametrize(
    "uri",
    [
        "abfss://filesystem@acct/path",
        "abfss://acct.dfs.core.windows.net/path",
        "abfss://@acct.dfs.core.windows.net/path",
    ],
)
def test_parse_invalid_abfss_uri(uri):
    with pytest.raises(MlflowException, match="ABFSS URI must be of the form"):
        _parse_abfss_uri(uri)


def test_parse_invalid_abfss_uri_bad_scheme():
    with pytest.raises(MlflowException, match="Not an ABFSS URI"):
        _parse_abfss_uri("abfs://cont@acct.dfs.core.windows.net/path")


def test_list_artifacts_empty(mock_data_lake_client):
    repo = AzureDataLakeArtifactRepository(TEST_DATA_LAKE_URI, credential=TEST_CREDENTIAL)
    mock_data_lake_client.get_file_system_client.get_paths.return_value = MockPathList([])
    assert repo.list_artifacts() == []


def test_list_artifacts_single_file(mock_data_lake_client):
    repo = AzureDataLakeArtifactRepository(TEST_DATA_LAKE_URI, credential=TEST_CREDENTIAL)

    # Evaluate single file
    path_props = PathProperties(name=posixpath.join(TEST_DATA_LAKE_URI, "file"), content_length=42)
    mock_data_lake_client.get_file_system_client.get_paths.return_value = MockPathList([path_props])
    assert repo.list_artifacts("file") == []


def test_list_artifacts(mock_filesystem_client):
    repo = AzureDataLakeArtifactRepository(TEST_DATA_LAKE_URI, credential=TEST_CREDENTIAL)

    # Create some files to return
    dir_prefix = PathProperties(is_directory=True, name=posixpath.join(TEST_ROOT_PATH, "dir"))
    path_props = PathProperties(content_length=42, name=posixpath.join(TEST_ROOT_PATH, "file"))
    mock_filesystem_client.get_paths.return_value = MockPathList([dir_prefix, path_props])

    artifacts = repo.list_artifacts()
    mock_filesystem_client.get_paths.assert_called_once_with(path=TEST_ROOT_PATH, recursive=False)
    assert artifacts[0].path == "dir"
    assert artifacts[0].is_dir is True
    assert artifacts[0].file_size is None
    assert artifacts[1].path == "file"
    assert artifacts[1].is_dir is False
    assert artifacts[1].file_size == 42

    mock_filesystem_client.reset_mock()
    repo.list_artifacts(path="nonexistent-dir")
    mock_filesystem_client.get_paths.assert_called_once_with(
        path=posixpath.join(TEST_ROOT_PATH, "nonexistent-dir"), recursive=False
    )


@pytest.mark.parametrize(
    "contents",
    ["", "B"],
)
def test_log_artifact(mock_filesystem_client, mock_directory_client, tmp_path, contents):
    file_name = "b.txt"
    repo = AzureDataLakeArtifactRepository(TEST_DATA_LAKE_URI, credential=TEST_CREDENTIAL)

    parentd = tmp_path.joinpath("data")
    parentd.mkdir()
    subd = parentd.joinpath("subdir")
    subd.mkdir()
    subd.joinpath("b.txt").write_text(contents)

    repo.log_artifact(subd.joinpath("b.txt"))

    mock_filesystem_client.get_directory_client.assert_called_once_with(TEST_ROOT_PATH)
    mock_directory_client.get_file_client.assert_called_once_with(file_name)

    if contents == "":
        mock_directory_client.get_file_client(file_name).create_file.assert_called()
    else:
        mock_directory_client.get_file_client(file_name).upload_data.assert_called()


def test_log_artifacts(mock_filesystem_client, mock_directory_client, tmp_path):
    fake_sas_token = "fake_session_token"
    repo = AzureDataLakeArtifactRepository(
        TEST_DATA_LAKE_URI, credential=AzureSasCredential(fake_sas_token)
    )

    parentd = tmp_path.joinpath("data")
    parentd.mkdir()
    subd = parentd.joinpath("subdir")
    subd.mkdir()
    parentd.joinpath("a.txt").write_text("A")
    subd.joinpath("b.txt").write_text("B")
    subd.joinpath("empty-file.txt").write_text("")

    repo.log_artifacts(parentd)

    called_directories = [
        call[0][0] for call in mock_filesystem_client.get_directory_client.call_args_list
    ]
    assert len(called_directories) == 3
    assert sorted(called_directories) == [
        posixpath.join(TEST_ROOT_PATH, "."),
        posixpath.join(TEST_ROOT_PATH, "subdir"),
        posixpath.join(TEST_ROOT_PATH, "subdir"),
    ]

    uploaded_filenames = [
        call[0][0] for call in mock_directory_client.get_file_client.call_args_list
    ]
    assert len(uploaded_filenames) == 3
    assert set(uploaded_filenames) == {"a.txt", "b.txt", "empty-file.txt"}

    mock_directory_client.get_file_client("a.txt").upload_data.assert_called()
    mock_directory_client.get_file_client("b.txt").upload_data.assert_called()
    mock_directory_client.get_file_client("subdir/empty-file.txt").create_file.assert_called()


def test_log_artifacts_in_parallel_when_necessary(tmp_path, monkeypatch):
    fake_sas_token = "fake_session_token"
    repo = AzureDataLakeArtifactRepository(
        TEST_DATA_LAKE_URI, credential=AzureSasCredential(fake_sas_token)
    )

    parentd = tmp_path.joinpath("data")
    parentd.mkdir()
    parentd.joinpath("a.txt").write_text("ABCDE")

    monkeypatch.setenv("MLFLOW_MULTIPART_UPLOAD_CHUNK_SIZE", "0")
    with (
        mock.patch(
            f"{ADLS_ARTIFACT_REPOSITORY}._multipart_upload", return_value=None
        ) as multipart_upload_mock,
        mock.patch(f"{ADLS_ARTIFACT_REPOSITORY}.log_artifact", return_value=None),
    ):
        repo.log_artifacts(parentd)
        multipart_upload_mock.assert_called_with(
            ArtifactCredentialInfo(
                signed_uri="https://account.dfs.core.windows.net/filesystem/some/path/"
                + "./a.txt?fake_session_token"
            ),
            ANY,
            "./a.txt",
        )


@pytest.mark.parametrize(
    ("file_size", "is_parallel_download"),
    [(None, False), (100, False), (500 * 1024**2 - 1, False), (500 * 1024**2, True)],
)
def test_download_file_in_parallel_when_necessary(file_size, is_parallel_download):
    repo = AzureDataLakeArtifactRepository(TEST_DATA_LAKE_URI, credential=TEST_CREDENTIAL)
    remote_file_path = "file_1.txt"
    list_artifacts_result = (
        [FileInfo(path=remote_file_path, is_dir=False, file_size=file_size)] if file_size else []
    )
    with (
        mock.patch(
            f"{ADLS_ARTIFACT_REPOSITORY}.list_artifacts",
            return_value=list_artifacts_result,
        ),
        mock.patch(
            f"{ADLS_ARTIFACT_REPOSITORY}._download_from_cloud", return_value=None
        ) as download_mock,
        mock.patch(
            f"{ADLS_ARTIFACT_REPOSITORY}._parallelized_download_from_cloud", return_value=None
        ) as parallel_download_mock,
    ):
        repo.download_artifacts("")
        if is_parallel_download:
            parallel_download_mock.assert_called_with(file_size, remote_file_path, ANY)
        else:
            download_mock.assert_called()


def test_download_file_artifact(mock_directory_client, mock_file_client, tmp_path):
    repo = AzureDataLakeArtifactRepository(TEST_DATA_LAKE_URI, credential=TEST_CREDENTIAL)

    def create_file(file):
        local_path = os.path.basename(file.name)
        f = tmp_path.joinpath(local_path)
        f.write_text("hello world!")

    mock_file_client.download_file().readinto.side_effect = create_file
    repo.download_artifacts("test.txt")
    assert os.path.exists(os.path.join(tmp_path, "test.txt"))
    mock_directory_client.get_file_client.assert_called_once_with("test.txt")


def test_download_directory_artifact(mock_filesystem_client, mock_file_client, tmp_path):
    repo = AzureDataLakeArtifactRepository(TEST_DATA_LAKE_URI, credential=TEST_CREDENTIAL)

    file_path_1 = "file_1"
    file_path_2 = "file_2"

    path_props_1 = PathProperties(
        content_length=42, name=posixpath.join(TEST_ROOT_PATH, file_path_1)
    )
    path_props_2 = PathProperties(
        content_length=42, name=posixpath.join(TEST_ROOT_PATH, file_path_2)
    )

    dir_name = "dir"
    dir_path = posixpath.join(TEST_ROOT_PATH, dir_name)
    dir_props = PathProperties(is_directory=True, name=dir_path)
    dir_file_name = "subdir_file"
    dir_file_props = PathProperties(content_length=42, name=posixpath.join(dir_path, dir_file_name))

    def get_mock_listing(*args, **kwargs):
        """
        Produces a mock listing that only contains content if the
        specified prefix is the artifact root. This allows us to mock
        `list_artifacts` during the `_download_artifacts_into` subroutine
        without recursively listing the same artifacts at every level of the
        directory traversal.
        """

        path_arg = posixpath.abspath(kwargs["path"])
        if path_arg == posixpath.abspath(TEST_ROOT_PATH):
            return MockPathList([path_props_1, path_props_2, dir_props])
        elif path_arg == posixpath.abspath(dir_path):
            return MockPathList([dir_file_props])
        else:
            return MockPathList([])

    def create_file(buffer):
        buffer.write(b"hello world!")

    mock_filesystem_client.get_paths.side_effect = get_mock_listing
    mock_file_client.download_file().readinto.side_effect = create_file

    # Ensure that the root directory can be downloaded successfully
    dest_dir = tmp_path.joinpath("download_dir")
    dest_dir.mkdir()
    repo.download_artifacts(artifact_path="", dst_path=dest_dir)
    # Ensure that the `mkfile` side effect copied all of the download artifacts into `tmp_path`
    dir_contents = os.listdir(dest_dir)
    assert file_path_1 in dir_contents
    assert file_path_2 in dir_contents
    assert dir_name in dir_contents
    subdir_contents = os.listdir(dest_dir.joinpath(dir_name))
    assert dir_file_name in subdir_contents


def test_refresh_credentials():
    dl_client = mock.MagicMock()
    with mock.patch(
        f"{ADLS_REPOSITORY_PACKAGE}._get_data_lake_client", return_value=dl_client
    ) as get_data_lake_client_mock:
        fs_client = mock.MagicMock()
        dl_client.get_file_system_client.return_value = fs_client
        resp = requests.Response()
        resp.status_code = 401
        err = requests.HTTPError(response=resp)
        fs_client.get_directory_client.side_effect = err

        second_credential = AzureSasCredential("new_fake_token")

        def credential_refresh():
            return {"credential": second_credential}

        first_credential = AzureSasCredential("fake_token")
        repo = AzureDataLakeArtifactRepository(
            TEST_DATA_LAKE_URI,
            credential=first_credential,
            credential_refresh_def=credential_refresh,
        )

        get_data_lake_client_mock.assert_called_with(account_url=ANY, credential=first_credential)

        try:
            repo._download_from_cloud("test.txt", "local_path")
        except requests.HTTPError as e:
            assert e == err

        get_data_lake_client_mock.assert_called_with(account_url=ANY, credential=second_credential)


def test_trace_data(mock_data_lake_client, tmp_path):
    repo = AzureDataLakeArtifactRepository(TEST_DATA_LAKE_URI, credential=TEST_CREDENTIAL)
    with pytest.raises(MlflowException, match=r"Trace data not found for path="):
        repo.download_trace_data()
    trace_data_path = tmp_path.joinpath("traces.json")
    trace_data_path.write_text("invalid data")
    with (
        mock.patch(
            "mlflow.store.artifact.artifact_repo.try_read_trace_data",
            side_effect=lambda x: try_read_trace_data(trace_data_path),
        ),
        pytest.raises(MlflowTraceDataCorrupted, match=r"Trace data is corrupted for path="),
    ):
        repo.download_trace_data()

    mock_trace_data = {"spans": [], "request": {"test": 1}, "response": {"test": 2}}
    trace_data_path.write_text(json.dumps(mock_trace_data))
    with mock.patch(
        "mlflow.store.artifact.artifact_repo.try_read_trace_data",
        side_effect=lambda x: try_read_trace_data(trace_data_path),
    ):
        assert repo.download_trace_data() == mock_trace_data
```

--------------------------------------------------------------------------------

---[FILE: test_cli.py]---
Location: mlflow-master/tests/store/artifact/test_cli.py

```python
import json
import pathlib
from unittest import mock

import pytest
from click.testing import CliRunner

import mlflow
import mlflow.pyfunc
from mlflow.entities import FileInfo
from mlflow.store.artifact.cli import _file_infos_to_json, download_artifacts
from mlflow.tracking.artifact_utils import _download_artifact_from_uri


@pytest.fixture
def run_with_artifact(tmp_path):
    artifact_path = "test"
    artifact_content = "content"
    local_path = tmp_path.joinpath("file.txt")
    local_path.write_text(artifact_content)
    with mlflow.start_run() as run:
        mlflow.log_artifact(local_path, artifact_path)

    return (run, artifact_path, artifact_content)


def test_file_info_to_json():
    file_infos = [
        FileInfo("/my/file", False, 123),
        FileInfo("/my/dir", True, None),
    ]
    info_str = _file_infos_to_json(file_infos)
    assert json.loads(info_str) == [
        {"path": "/my/file", "is_dir": False, "file_size": 123},
        {"path": "/my/dir", "is_dir": True},
    ]


def test_download_from_uri():
    class TestArtifactRepo:
        def __init__(self, scheme):
            self.scheme = scheme

        def download_artifacts(self, artifact_path, **kwargs):
            return (self.scheme, artifact_path)

    def test_get_artifact_repository(artifact_uri, tracking_uri=None, registry_uri=None):
        return TestArtifactRepo(artifact_uri)

    pairs = [
        ("path", ("", "path")),
        ("path/", ("path", "")),
        ("/path", ("/", "path")),
        ("/path/", ("/path", "")),
        ("path/to/dir", ("path/to", "dir")),
        ("file:", ("file:", "")),
        ("file:path", ("file:", "path")),
        ("file:path/", ("file:path", "")),
        ("file:path/to/dir", ("file:path/to", "dir")),
        ("file:/", ("file:///", "")),
        ("file:/path", ("file:///", "path")),
        ("file:/path/", ("file:///path", "")),
        ("file:/path/to/dir", ("file:///path/to", "dir")),
        ("file:///", ("file:///", "")),
        ("file:///path", ("file:///", "path")),
        ("file:///path/", ("file:///path", "")),
        ("file:///path/to/dir", ("file:///path/to", "dir")),
        ("s3://", ("s3:", "")),
        ("s3://path", ("s3://path", "")),  # path is netloc in this case
        ("s3://path/", ("s3://path/", "")),
        ("s3://path/to/", ("s3://path/to", "")),
        ("s3://path/to", ("s3://path/", "to")),
        ("s3://path/to/dir", ("s3://path/to", "dir")),
    ]
    with mock.patch(
        "mlflow.tracking.artifact_utils.get_artifact_repository"
    ) as get_artifact_repo_mock:
        get_artifact_repo_mock.side_effect = test_get_artifact_repository

        for uri, expected_result in pairs:
            actual_result = _download_artifact_from_uri(uri)
            assert expected_result == actual_result


def _run_download_artifact_command(args) -> pathlib.Path:
    """
    Args:
        command: An `mlflow artifacts` command list.

    Returns:
        Path to the downloaded artifact.
    """
    runner = CliRunner()
    resp = runner.invoke(download_artifacts, args=args, catch_exceptions=False)
    assert resp.exit_code == 0
    download_output_path = resp.stdout.rstrip().split("\n")[-1]
    return next(pathlib.Path(download_output_path).iterdir())


def test_download_artifacts_with_uri(run_with_artifact):
    run, artifact_path, artifact_content = run_with_artifact
    run_uri = f"runs:/{run.info.run_id}/{artifact_path}"
    actual_uri = str(pathlib.PurePosixPath(run.info.artifact_uri) / artifact_path)
    for uri in (run_uri, actual_uri):
        downloaded_content = _run_download_artifact_command(["-u", uri]).read_text()
        assert downloaded_content == artifact_content

    # Check for backwards compatibility with preexisting behavior in MLflow <= 1.24.0 where
    # specifying `artifact_uri` and `artifact_path` together did not throw an exception (unlike
    # `mlflow.artifacts.download_artifacts()`) and instead used `artifact_uri` while ignoring
    # `run_id` and `artifact_path`
    downloaded_content = _run_download_artifact_command(
        ["-u", uri, "--run-id", "bad", "--artifact-path", "bad"]
    ).read_text()
    assert downloaded_content == artifact_content


def test_download_artifacts_with_run_id_and_path(run_with_artifact):
    run, artifact_path, artifact_content = run_with_artifact
    downloaded_content = _run_download_artifact_command(
        [
            "--run-id",
            run.info.run_id,
            "--artifact-path",
            artifact_path,
        ]
    ).read_text()
    assert downloaded_content == artifact_content


@pytest.mark.parametrize("dst_subdir_path", [None, "doesnt_exist_yet"])
def test_download_artifacts_with_dst_path(run_with_artifact, tmp_path, dst_subdir_path):
    run, artifact_path, _ = run_with_artifact
    artifact_uri = f"runs:/{run.info.run_id}/{artifact_path}"
    dst_path = tmp_path / dst_subdir_path if dst_subdir_path else tmp_path
    downloaded_file_path = _run_download_artifact_command(["-u", artifact_uri, "-d", str(dst_path)])
    assert str(downloaded_file_path).startswith(str(dst_path))
```

--------------------------------------------------------------------------------

---[FILE: test_cloud_artifact_repo.py]---
Location: mlflow-master/tests/store/artifact/test_cloud_artifact_repo.py

```python
from concurrent.futures import Future
from unittest import mock

import pytest

from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_artifacts_pb2 import ArtifactCredentialInfo, ArtifactCredentialType
from mlflow.store.artifact.cloud_artifact_repo import (
    CloudArtifactRepository,
    _readable_size,
    _validate_chunk_size_aws,
)


@pytest.mark.parametrize(
    ("size", "size_str"), [(5 * 1024**2, "5.00 MB"), (712.345 * 1024**2, "712.35 MB")]
)
def test_readable_size(size, size_str):
    assert _readable_size(size) == size_str


def test_chunk_size_validation_failure():
    with pytest.raises(MlflowException, match="Multipart chunk size"):
        _validate_chunk_size_aws(5 * 1024**2 - 1)
    with pytest.raises(MlflowException, match="Multipart chunk size"):
        _validate_chunk_size_aws(5 * 1024**3 + 1)


@pytest.mark.parametrize(
    ("future_result", "expected_call_count"),
    [
        (None, 2),  # Simulate where creds are expired, but successfully download after refresh
        (Exception("fake_exception"), 4),
        # Simulate where there is a download failure and retries are exhausted
    ],
)
def test__parallelized_download_from_cloud(
    monkeypatch, future_result, expected_call_count, tmp_path
):
    # Mock environment variables
    monkeypatch.setenv("_MLFLOW_MPD_NUM_RETRIES", "3")
    monkeypatch.setenv("_MLFLOW_MPD_RETRY_INTERVAL_SECONDS", "0")

    with mock.patch(
        "mlflow.store.artifact.cloud_artifact_repo.CloudArtifactRepository"
    ) as cloud_artifact_mock:
        cloud_artifact_instance = cloud_artifact_mock.return_value

        # Mock all methods except '_parallelized_download_from_cloud'
        cloud_artifact_instance._parallelized_download_from_cloud.side_effect = (
            lambda *args, **kwargs: CloudArtifactRepository._parallelized_download_from_cloud(
                cloud_artifact_instance, *args, **kwargs
            )
        )

        # Mock the chunk object
        class FakeChunk:
            def __init__(self, index, start, end, path):
                self.index = index
                self.start = start
                self.end = end
                self.path = path

        fake_chunk_1 = FakeChunk(index=1, start=0, end=100, path="fake_path_1")
        mock_failed_downloads = {fake_chunk_1: "fake_chunk_1"}

        # Wrap fake_chunk_1 in a Future
        future = Future()
        if future_result is None:
            future.set_result(fake_chunk_1)
        else:
            future.set_exception(future_result)

        futures = {future: fake_chunk_1}

        # Create a new ArtifactCredentialInfo object
        fake_credential = ArtifactCredentialInfo(
            signed_uri="fake_signed_uri",
            type=ArtifactCredentialType.AWS_PRESIGNED_URL,
        )
        fake_credential.headers.extend(
            [ArtifactCredentialInfo.HttpHeader(name="fake_header_name", value="fake_header_value")]
        )

        # Set the return value of _get_read_credential_infos to the fake_credential object
        cloud_artifact_instance._get_read_credential_infos.return_value = [fake_credential]

        # Set return value for mocks
        cloud_artifact_instance._get_read_credential_infos.return_value = [fake_credential]
        cloud_artifact_instance._get_uri_for_path.return_value = "fake_uri_path"

        cloud_artifact_instance.chunk_thread_pool.submit.return_value = future

        # Create a fake local path using tmp_path
        fake_local_path = tmp_path / "downloaded_file"

        with (
            mock.patch(
                "mlflow.store.artifact.cloud_artifact_repo.parallelized_download_file_using_http_uri",
                return_value=mock_failed_downloads,
            ),
            mock.patch(
                "mlflow.store.artifact.cloud_artifact_repo.as_completed",
                return_value=futures,
            ),
        ):
            if future_result:
                with pytest.raises(
                    MlflowException, match="All retries have been exhausted. Download has failed."
                ):
                    cloud_artifact_instance._parallelized_download_from_cloud(
                        1, "fake_remote_path", str(fake_local_path)
                    )
            else:
                cloud_artifact_instance._parallelized_download_from_cloud(
                    1, "fake_remote_path", str(fake_local_path)
                )

            assert (
                cloud_artifact_instance._get_read_credential_infos.call_count == expected_call_count
            )
            assert (
                cloud_artifact_instance._get_read_credential_infos.call_count == expected_call_count
            )

            for call in cloud_artifact_instance.chunk_thread_pool.submit.call_args_list:
                assert call == mock.call(
                    mock.ANY,
                    range_start=fake_chunk_1.start,
                    range_end=fake_chunk_1.end,
                    headers=mock.ANY,
                    download_path=str(fake_local_path),
                    http_uri="fake_signed_uri",
                )
```

--------------------------------------------------------------------------------

````
