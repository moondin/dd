---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 919
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 919 of 991)

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

---[FILE: test_databricks_sdk_models_artifact_repo.py]---
Location: mlflow-master/tests/store/artifact/test_databricks_sdk_models_artifact_repo.py

```python
import io
from types import SimpleNamespace
from unittest import mock

import pytest
from databricks.sdk import WorkspaceClient
from databricks.sdk.errors.platform import NotFound
from databricks.sdk.service.files import DirectoryEntry, DownloadResponse

from mlflow.entities.file_info import FileInfo
from mlflow.entities.model_registry import ModelVersion
from mlflow.store._unity_catalog.registry.rest_store import (
    UcModelRegistryStore,
)
from mlflow.store.artifact.databricks_sdk_models_artifact_repo import (
    DatabricksSDKModelsArtifactRepository,
)
from mlflow.store.artifact.unity_catalog_models_artifact_repo import (
    UnityCatalogModelsArtifactRepository,
)

TEST_MODEL_NAME = "catalog.schema.model"
TEST_CATALOG = "catalog"
TEST_SCHEMA = "schema"
TEST_MODEL = "model"
TEST_MODEL_VERSION = 1
TEST_MODEL_BASE_PATH = f"/Models/{TEST_CATALOG}/{TEST_SCHEMA}/{TEST_MODEL}/{TEST_MODEL_VERSION}"


@pytest.fixture
def mock_databricks_workspace_client():
    mock_databricks_workspace_client = mock.MagicMock(autospec=WorkspaceClient)
    with mock.patch(
        "mlflow.store.artifact.databricks_sdk_models_artifact_repo._get_databricks_workspace_client",
        return_value=mock_databricks_workspace_client,
    ):
        yield mock_databricks_workspace_client


def test_list_artifacts_empty(mock_databricks_workspace_client):
    repo = DatabricksSDKModelsArtifactRepository(TEST_MODEL_NAME, TEST_MODEL_VERSION)
    mock_databricks_workspace_client.files.list_directory_contents.return_value = iter([])
    assert repo.list_artifacts() == []


def test_list_artifacts_listfile(mock_databricks_workspace_client):
    repo = DatabricksSDKModelsArtifactRepository(TEST_MODEL_NAME, TEST_MODEL_VERSION)
    mock_databricks_workspace_client.files.get_directory_metadata.side_effect = NotFound
    assert repo.list_artifacts() == []


def test_list_artifacts_single_file(mock_databricks_workspace_client):
    repo = DatabricksSDKModelsArtifactRepository(TEST_MODEL_NAME, TEST_MODEL_VERSION)

    entry = DirectoryEntry(is_directory=False, path=f"{TEST_MODEL_BASE_PATH}/file")
    mock_databricks_workspace_client.files.list_directory_contents.return_value = iter([entry])

    assert repo.list_artifacts() == [FileInfo(is_dir=False, path="file", file_size=None)]


def test_list_artifacts_many_files(mock_databricks_workspace_client):
    repo = DatabricksSDKModelsArtifactRepository(TEST_MODEL_NAME, TEST_MODEL_VERSION)

    # Directory structure:
    root = DirectoryEntry(is_directory=True, path=f"{TEST_MODEL_BASE_PATH}/root")
    file1 = DirectoryEntry(
        is_directory=False, path=f"{TEST_MODEL_BASE_PATH}/root/file1", file_size=1
    )
    file2 = DirectoryEntry(
        is_directory=False, path=f"{TEST_MODEL_BASE_PATH}/root/file2", file_size=2
    )
    subdir1 = DirectoryEntry(is_directory=True, path=f"{TEST_MODEL_BASE_PATH}/root/subdir1")
    file3 = DirectoryEntry(
        is_directory=False, path=f"{TEST_MODEL_BASE_PATH}/root/subdir1/file3", file_size=3
    )
    subdir2 = DirectoryEntry(is_directory=True, path=f"{TEST_MODEL_BASE_PATH}/root/subdir2")
    file4 = DirectoryEntry(
        is_directory=False, path=f"{TEST_MODEL_BASE_PATH}/root/subdir2/file4", file_size=4
    )
    file5 = DirectoryEntry(
        is_directory=False, path=f"{TEST_MODEL_BASE_PATH}/root/subdir2/file5", file_size=5
    )

    def list_directory_contents_side_effect(path):
        if path is None or path == TEST_MODEL_BASE_PATH:
            return iter([root])
        elif path == f"{TEST_MODEL_BASE_PATH}/root":
            return iter([file1, file2, subdir1, subdir2])
        elif path == f"{TEST_MODEL_BASE_PATH}/root/subdir1":
            return iter([file3])
        elif path == f"{TEST_MODEL_BASE_PATH}/root/subdir2":
            return iter([file4, file5])

    mock_databricks_workspace_client.files.list_directory_contents.side_effect = (
        list_directory_contents_side_effect
    )

    observed_artifacts = repo.list_artifacts()
    assert observed_artifacts == [FileInfo(is_dir=True, path="root", file_size=None)]

    observed_artifacts = repo.list_artifacts("root")
    assert observed_artifacts == [
        FileInfo(is_dir=False, path="root/file1", file_size=1),
        FileInfo(is_dir=False, path="root/file2", file_size=2),
        FileInfo(is_dir=True, path="root/subdir1", file_size=None),
        FileInfo(is_dir=True, path="root/subdir2", file_size=None),
    ]

    observed_artifacts = repo.list_artifacts("root/subdir1")
    assert observed_artifacts == [
        FileInfo(is_dir=False, path="root/subdir1/file3", file_size=3),
    ]

    observed_artifacts = repo.list_artifacts("root/subdir2")
    assert observed_artifacts == [
        FileInfo(is_dir=False, path="root/subdir2/file4", file_size=4),
        FileInfo(is_dir=False, path="root/subdir2/file5", file_size=5),
    ]


def test_upload_to_cloud(mock_databricks_workspace_client, tmp_path):
    # write some content to a file at a local path
    file_name = "a.txt"
    file_content = b"file_content"
    local_file_path = tmp_path.joinpath(file_name)
    local_file_path.write_bytes(file_content)

    # assert that databricks sdk file upload function is called to upload that content
    # to expected_remote_file_path
    repo = DatabricksSDKModelsArtifactRepository(TEST_MODEL_NAME, TEST_MODEL_VERSION)
    repo._upload_to_cloud(None, local_file_path, file_name)

    expected_remote_file_path = f"{TEST_MODEL_BASE_PATH}/a.txt"
    mock_databricks_workspace_client.files.upload.assert_called_once_with(
        expected_remote_file_path, mock.ANY, overwrite=mock.ANY
    )


def test_download_from_cloud(mock_databricks_workspace_client, tmp_path):
    # write some content to a file at a local path
    file_name = "a.txt"
    local_file_path = tmp_path.joinpath(file_name)

    # assert that databricks sdk file download function is called to download
    # from expected_remote_file_path to local_file_path
    mock_databricks_workspace_client.files.download.return_value = DownloadResponse(
        contents=io.BytesIO(b"file_content")
    )
    repo = DatabricksSDKModelsArtifactRepository(TEST_MODEL_NAME, TEST_MODEL_VERSION)
    repo._download_from_cloud(file_name, local_file_path)

    expected_remote_file_path = f"{TEST_MODEL_BASE_PATH}/a.txt"
    mock_databricks_workspace_client.files.download.assert_called_once_with(
        expected_remote_file_path
    )


def test_log_artifact(mock_databricks_workspace_client, tmp_path):
    # write some content to a file at a local path
    file_name = "a.txt"
    file_content = b"file_content"
    local_file_path = tmp_path.joinpath(file_name)
    local_file_path.write_bytes(file_content)

    # assert that databricks sdk file upload function is called to upload that content
    # to expected_remote_file_path
    repo = DatabricksSDKModelsArtifactRepository(TEST_MODEL_NAME, TEST_MODEL_VERSION)
    repo.log_artifact(local_file_path, file_name)

    expected_remote_file_path = f"{TEST_MODEL_BASE_PATH}/a.txt"
    mock_databricks_workspace_client.files.upload.assert_called_once_with(
        expected_remote_file_path, mock.ANY, overwrite=mock.ANY
    )


def test_mlflow_use_databricks_sdk_model_artifacts_repo_for_uc(tmp_path, monkeypatch):
    monkeypatch.setenv("MLFLOW_USE_DATABRICKS_SDK_MODEL_ARTIFACTS_REPO_FOR_UC", "true")
    monkeypatch.setenv("DATABRICKS_HOST", "my-host")
    monkeypatch.setenv("DATABRICKS_TOKEN", "my-token")
    with mock.patch(
        "mlflow.utils._unity_catalog_utils.call_endpoint",
        side_effect=[
            Exception("lineage emission fails"),
        ],
    ):
        uc_repo = UnityCatalogModelsArtifactRepository("models:/a.b.c/1", "databricks-uc")
        repo = uc_repo._get_artifact_repo()
        assert isinstance(repo, DatabricksSDKModelsArtifactRepository)

        store = UcModelRegistryStore(store_uri="databricks-uc", tracking_uri=str(tmp_path))
        assert isinstance(
            store._get_artifact_repo(
                ModelVersion(
                    name="name",
                    version="version",
                    creation_timestamp=1,
                ),
                TEST_MODEL_NAME,
            ),
            DatabricksSDKModelsArtifactRepository,
        )


def test_mlflow_use_databricks_sdk_model_artifacts_repo_for_uc_seg(tmp_path, monkeypatch):
    monkeypatch.setenv("DATABRICKS_HOST", "my-host")
    monkeypatch.setenv("DATABRICKS_TOKEN", "my-token")
    with mock.patch(
        "mlflow.utils._unity_catalog_utils.call_endpoint",
        side_effect=[
            SimpleNamespace(is_databricks_sdk_models_artifact_repository_enabled=True),
            Exception("lineage emission fails"),
            SimpleNamespace(is_databricks_sdk_models_artifact_repository_enabled=True),
        ],
    ):
        uc_repo = UnityCatalogModelsArtifactRepository("models:/a.b.c/1", "databricks-uc")
        repo = uc_repo._get_artifact_repo()
        assert isinstance(repo, DatabricksSDKModelsArtifactRepository)

        store = UcModelRegistryStore(store_uri="databricks-uc", tracking_uri=str(tmp_path))
        assert isinstance(
            store._get_artifact_repo(
                ModelVersion(
                    name="name",
                    version="version",
                    creation_timestamp=1,
                ),
                TEST_MODEL_NAME,
            ),
            DatabricksSDKModelsArtifactRepository,
        )
```

--------------------------------------------------------------------------------

---[FILE: test_dbfs_artifact_repo.py]---
Location: mlflow-master/tests/store/artifact/test_dbfs_artifact_repo.py

```python
from unittest import mock

import pytest

from mlflow.exceptions import MlflowException
from mlflow.store.artifact.databricks_run_artifact_repo import DatabricksRunArtifactRepository
from mlflow.store.artifact.dbfs_artifact_repo import (
    DbfsRestArtifactRepository,
    dbfs_artifact_repo_factory,
)
from mlflow.store.artifact.local_artifact_repo import LocalArtifactRepository


@pytest.mark.parametrize(
    ("artifact_uri", "uri_at_init"),
    [("dbfs:/path", "file:///dbfs/path"), ("dbfs://databricks/path", "file:///dbfs/path")],
)
def test_dbfs_artifact_repo_factory_local_repo(artifact_uri, uri_at_init):
    with (
        mock.patch("mlflow.utils.databricks_utils.is_dbfs_fuse_available", return_value=True),
        mock.patch(
            "mlflow.store.artifact.dbfs_artifact_repo.LocalArtifactRepository", autospec=True
        ) as mock_repo,
    ):
        repo = dbfs_artifact_repo_factory(artifact_uri)
        assert isinstance(repo, LocalArtifactRepository)
        mock_repo.assert_called_once_with(uri_at_init, tracking_uri=None, registry_uri=None)


@pytest.mark.parametrize(
    "artifact_uri",
    [
        "dbfs://someProfile@databricks/path",
        "dbfs://somewhere:else@databricks/path",
        # Model registry paths should use the REST artifact repo, both when communicating
        # with the current workspace (authority component = "databricks") and other workspaces
        # (authority component = "someProfile@databricks"), as model registry paths cannot
        # be accessed via the local filesystem (via FUSE)
        "dbfs://databricks/databricks/mlflow-registry/abcdefg123/path",
        "dbfs://someProfile@databricks/mlflow-registry/abcdefg123/path",
        "dbfs://somewhere:else@databricks/mlflow-registry/abcdefg123/path",
        "dbfs:/databricks/mlflow-registry/abcdefg123/path",
    ],
)
def test_dbfs_artifact_repo_factory_dbfs_rest_repo(artifact_uri):
    with (
        mock.patch("mlflow.utils.databricks_utils.is_dbfs_fuse_available", return_value=True),
        mock.patch(
            "mlflow.store.artifact.dbfs_artifact_repo.DbfsRestArtifactRepository", autospec=True
        ) as mock_repo,
    ):
        repo = dbfs_artifact_repo_factory(artifact_uri)
        assert isinstance(repo, DbfsRestArtifactRepository)
        mock_repo.assert_called_once_with(artifact_uri, tracking_uri=None, registry_uri=None)


@pytest.mark.parametrize(
    "artifact_uri",
    [
        ("dbfs:/databricks/mlflow-tracking/experiment/1/run/2"),
        ("dbfs://@databricks/databricks/mlflow-tracking/experiment/1/run/2"),
        ("dbfs://someProfile@databricks/databricks/mlflow-tracking/experiment/1/run/2"),
    ],
)
def test_dbfs_artifact_repo_factory_acled_paths(artifact_uri):
    with (
        mock.patch(
            "mlflow.store.artifact.dbfs_artifact_repo.DatabricksRunArtifactRepository",
            autospec=True,
        ) as mock_repo,
    ):
        repo = dbfs_artifact_repo_factory(artifact_uri)
        assert isinstance(repo, DatabricksRunArtifactRepository)
        mock_repo.assert_called_once_with(artifact_uri, tracking_uri=None, registry_uri=None)


@pytest.mark.parametrize(
    "artifact_uri", [("notdbfs:/path"), ("dbfs://some:where@notdatabricks/path")]
)
def test_dbfs_artifact_repo_factory_errors(artifact_uri):
    with pytest.raises(MlflowException, match="DBFS URI must be of the form dbfs"):
        dbfs_artifact_repo_factory(artifact_uri)
```

--------------------------------------------------------------------------------

---[FILE: test_dbfs_artifact_repo_delegation.py]---
Location: mlflow-master/tests/store/artifact/test_dbfs_artifact_repo_delegation.py

```python
import os
from unittest import mock

import pytest

from mlflow.store.artifact.artifact_repository_registry import get_artifact_repository
from mlflow.store.artifact.databricks_run_artifact_repo import DatabricksRunArtifactRepository
from mlflow.store.artifact.dbfs_artifact_repo import DbfsRestArtifactRepository
from mlflow.store.artifact.local_artifact_repo import LocalArtifactRepository
from mlflow.utils.rest_utils import MlflowHostCreds


@pytest.fixture(autouse=True)
def set_fake_databricks_creds(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("DATABRICKS_HOST", "https://localhost:8080")
    monkeypatch.setenv("DATABRICKS_TOKEN", "token")


@pytest.fixture
def host_creds_mock():
    with mock.patch(
        "mlflow.store.artifact.dbfs_artifact_repo._get_host_creds_from_default_store",
        return_value=lambda: MlflowHostCreds("http://host"),
    ):
        yield


def test_dbfs_artifact_repo_delegates_to_correct_repo(host_creds_mock, monkeypatch):
    with mock.patch("mlflow.utils.databricks_utils.is_dbfs_fuse_available", return_value=True):
        # fuse available
        artifact_uri = "dbfs:/databricks/my/absolute/dbfs/path"
        repo = get_artifact_repository(artifact_uri)
        assert isinstance(repo, LocalArtifactRepository)
        assert repo.artifact_dir == os.path.join(
            os.path.sep, "dbfs", "databricks", "my", "absolute", "dbfs", "path"
        )
        # fuse available but a model repository DBFS location
        repo = get_artifact_repository("dbfs:/databricks/mlflow-registry/version12345/models")
        assert isinstance(repo, DbfsRestArtifactRepository)
        # fuse not available
        with monkeypatch.context() as m:
            m.setenv("MLFLOW_ENABLE_DBFS_FUSE_ARTIFACT_REPO", "false")
            fuse_disabled_repo = get_artifact_repository(artifact_uri)
        assert isinstance(fuse_disabled_repo, DbfsRestArtifactRepository)
        assert fuse_disabled_repo.artifact_uri == artifact_uri

    with mock.patch("mlflow.utils.databricks_utils.is_dbfs_fuse_available", return_value=False):
        rest_repo = get_artifact_repository(artifact_uri)
        assert isinstance(rest_repo, DbfsRestArtifactRepository)
        assert rest_repo.artifact_uri == artifact_uri

        mock_uri = "dbfs:/databricks/mlflow-tracking/MOCK-EXP/MOCK-RUN-ID/artifacts"
        databricks_repo = get_artifact_repository(mock_uri)
        assert isinstance(databricks_repo, DatabricksRunArtifactRepository)
        assert databricks_repo.artifact_uri == mock_uri
```

--------------------------------------------------------------------------------

---[FILE: test_dbfs_fuse_artifact_repo.py]---
Location: mlflow-master/tests/store/artifact/test_dbfs_fuse_artifact_repo.py

```python
import os
from unittest import mock
from unittest.mock import PropertyMock

import pytest

from mlflow.store.artifact.artifact_repository_registry import get_artifact_repository

TEST_FILE_1_CONTENT = "Hello 🍆🍔".encode()
TEST_FILE_2_CONTENT = "World 🍆🍔🍆".encode()
TEST_FILE_3_CONTENT = "¡🍆🍆🍔🍆🍆!".encode()


@pytest.fixture
def artifact_dir(tmp_path):
    return os.path.join(tmp_path, "artifacts-to-log")


@pytest.fixture
def force_dbfs_fuse_repo(artifact_dir):
    in_databricks_mock_path = "mlflow.utils.databricks_utils.is_dbfs_fuse_available"
    local_artifact_repo_package = "mlflow.store.artifact.local_artifact_repo"
    artifact_dir_mock_path = local_artifact_repo_package + ".LocalArtifactRepository.artifact_dir"
    with (
        mock.patch(in_databricks_mock_path, return_value=True),
        mock.patch(artifact_dir_mock_path, new_callable=PropertyMock, return_value=artifact_dir),
    ):
        yield


@pytest.fixture
def dbfs_fuse_artifact_repo(force_dbfs_fuse_repo):
    return get_artifact_repository("dbfs:/unused/path/replaced/by/mock")


@pytest.fixture
def files_dir(tmp_path):
    d = tmp_path.joinpath("files")
    d.mkdir()
    return d


@pytest.fixture
def test_file(files_dir):
    p = files_dir.joinpath("test.txt")
    with open(p, "wb") as f:
        f.write(TEST_FILE_1_CONTENT)
    return p


@pytest.fixture
def test_dir(files_dir):
    subdir = files_dir.joinpath("subdir")
    subdir.mkdir()
    with open(subdir.joinpath("test.txt"), "wb") as f:
        f.write(TEST_FILE_2_CONTENT)
    with open(files_dir.joinpath("test.txt"), "wb") as f:
        f.write(TEST_FILE_3_CONTENT)
    with open(files_dir.joinpath("empty-file"), "wb"):
        pass
    return files_dir


@pytest.mark.parametrize("artifact_path", [None, "output", ""])
def test_log_artifact(dbfs_fuse_artifact_repo, test_file, artifact_path, artifact_dir):
    dbfs_fuse_artifact_repo.log_artifact(test_file, artifact_path)
    expected_file_path = os.path.join(
        artifact_dir,
        artifact_path or "",
        os.path.basename(test_file),
    )
    with open(expected_file_path, "rb") as handle:
        data = handle.read()
    assert data == TEST_FILE_1_CONTENT


def test_log_artifact_empty_file(dbfs_fuse_artifact_repo, test_dir, artifact_dir):
    dbfs_fuse_artifact_repo.log_artifact(os.path.join(test_dir, "empty-file"))
    expected_file_path = os.path.join(artifact_dir, "empty-file")
    with open(expected_file_path, "rb") as handle:
        data = handle.read()
    assert data == b""


@pytest.mark.parametrize(
    "artifact_path",
    [
        None,
        "",  # should behave like '/' and exclude base name of logged_dir
        "abc",
        # We should add '.',
    ],
)
def test_log_artifacts(dbfs_fuse_artifact_repo, test_dir, artifact_path, artifact_dir):
    dbfs_fuse_artifact_repo.log_artifacts(test_dir, artifact_path)
    artifact_dst_path = os.path.join(artifact_dir, artifact_path or "")
    assert os.path.exists(artifact_dst_path)
    expected_contents = {
        "subdir/test.txt": TEST_FILE_2_CONTENT,
        "test.txt": TEST_FILE_3_CONTENT,
        "empty-file": b"",
    }
    for filename, contents in expected_contents.items():
        with open(os.path.join(artifact_dst_path, filename), "rb") as handle:
            assert handle.read() == contents


def test_list_artifacts(dbfs_fuse_artifact_repo, test_dir):
    assert len(dbfs_fuse_artifact_repo.list_artifacts()) == 0
    dbfs_fuse_artifact_repo.log_artifacts(test_dir)
    artifacts = dbfs_fuse_artifact_repo.list_artifacts()
    assert len(artifacts) == 3
    assert artifacts[0].path == "empty-file"
    assert artifacts[0].is_dir is False
    assert artifacts[0].file_size == 0
    assert artifacts[1].path == "subdir"
    assert artifacts[1].is_dir is True
    assert artifacts[1].file_size is None
    assert artifacts[2].path == "test.txt"
    assert artifacts[2].is_dir is False
    assert artifacts[2].file_size == 23


def test_download_artifacts(dbfs_fuse_artifact_repo, test_dir):
    dbfs_fuse_artifact_repo.log_artifacts(test_dir)
    local_download_dir = dbfs_fuse_artifact_repo.download_artifacts("")
    expected_contents = {
        "subdir/test.txt": TEST_FILE_2_CONTENT,
        "test.txt": TEST_FILE_3_CONTENT,
        "empty-file": b"",
    }
    for filename, contents in expected_contents.items():
        with open(os.path.join(local_download_dir, filename), "rb") as handle:
            assert handle.read() == contents
```

--------------------------------------------------------------------------------

---[FILE: test_dbfs_rest_artifact_repo.py]---
Location: mlflow-master/tests/store/artifact/test_dbfs_rest_artifact_repo.py

```python
import json
import os
from unittest import mock
from unittest.mock import Mock

import pytest

from mlflow.exceptions import MlflowException
from mlflow.store.artifact.artifact_repository_registry import get_artifact_repository
from mlflow.store.artifact.dbfs_artifact_repo import (
    DbfsRestArtifactRepository,
    _get_host_creds_from_default_store,
)
from mlflow.store.tracking.file_store import FileStore
from mlflow.store.tracking.rest_store import RestStore
from mlflow.utils.rest_utils import MlflowHostCreds, http_request


@pytest.fixture
def dbfs_artifact_repo():
    with mock.patch(
        "mlflow.store.artifact.dbfs_artifact_repo._get_host_creds_from_default_store",
        return_value=lambda: MlflowHostCreds("http://host"),
    ):
        return get_artifact_repository("dbfs:/test/")


TEST_FILE_1_CONTENT = "Hello 🍆🍔".encode()
TEST_FILE_2_CONTENT = "World 🍆🍔🍆".encode()
TEST_FILE_3_CONTENT = "¡🍆🍆🍔🍆🍆!".encode()

DBFS_ARTIFACT_REPOSITORY_PACKAGE = "mlflow.store.artifact.dbfs_artifact_repo"
DBFS_ARTIFACT_REPOSITORY = DBFS_ARTIFACT_REPOSITORY_PACKAGE + ".DbfsRestArtifactRepository"


@pytest.fixture
def test_file(tmp_path):
    p = tmp_path.joinpath("test.txt")
    p.write_bytes(TEST_FILE_1_CONTENT)
    return str(p)


@pytest.fixture
def test_dir(tmp_path):
    subdir = tmp_path.joinpath("subdir")
    subdir.mkdir()
    subdir.joinpath("test.txt").write_bytes(TEST_FILE_2_CONTENT)
    tmp_path.joinpath("test.txt").write_bytes(bytes(TEST_FILE_3_CONTENT))
    tmp_path.joinpath("empty-file").touch()
    return str(tmp_path)


LIST_ARTIFACTS_RESPONSE = {
    "files": [
        {"path": "/test/a.txt", "is_dir": False, "file_size": 100},
        {"path": "/test/dir", "is_dir": True, "file_size": 0},
    ]
}

LIST_ARTIFACTS_SINGLE_FILE_RESPONSE = {
    "files": [{"path": "/test/a.txt", "is_dir": False, "file_size": 0}]
}

MOCK_SUCCESS_RESPONSE = Mock(status_code=200, text="{}")
MOCK_REQUEST_KWARGS = {
    "allow_redirects": False,
    "verify": True,
    "headers": mock.ANY,
    "timeout": mock.ANY,
    "data": mock.ANY,
}


def test_init_validation_and_cleaning():
    with mock.patch(
        DBFS_ARTIFACT_REPOSITORY_PACKAGE + "._get_host_creds_from_default_store",
        return_value=lambda: MlflowHostCreds("http://host"),
    ):
        repo = get_artifact_repository("dbfs:/test/")
        assert repo.artifact_uri == "dbfs:/test"
        match = "DBFS URI must be of the form dbfs:/<path>"
        with pytest.raises(MlflowException, match=match):
            DbfsRestArtifactRepository("s3://test")
        with pytest.raises(MlflowException, match=match):
            DbfsRestArtifactRepository("dbfs://profile@notdatabricks/test/")


def test_init_get_host_creds_with_databricks_profile_uri():
    databricks_host = "https://something.databricks.com"
    default_host = "http://host"
    with (
        mock.patch(
            DBFS_ARTIFACT_REPOSITORY_PACKAGE + "._get_host_creds_from_default_store",
            return_value=lambda: MlflowHostCreds(default_host),
        ),
        mock.patch(
            DBFS_ARTIFACT_REPOSITORY_PACKAGE + ".get_databricks_host_creds",
            return_value=MlflowHostCreds(databricks_host),
        ),
    ):
        repo = DbfsRestArtifactRepository("dbfs://profile@databricks/test/")
        assert repo.artifact_uri == "dbfs:/test/"
        creds = repo.get_host_creds()
        assert creds.host == databricks_host
        # no databricks_profile_uri given
        repo = DbfsRestArtifactRepository("dbfs:/test/")
        creds = repo.get_host_creds()
        assert creds.host == default_host


@pytest.mark.parametrize(
    ("artifact_path", "expected_endpoint"),
    [(None, "/dbfs/test/test.txt"), ("output", "/dbfs/test/output/test.txt")],
)
def test_log_artifact(dbfs_artifact_repo, test_file, artifact_path, expected_endpoint):
    with (
        mock.patch("mlflow.utils.rest_utils.http_request") as http_request_mock,
        mock.patch(
            "requests.Session.request", return_value=MOCK_SUCCESS_RESPONSE
        ) as mock_base_request,
    ):
        endpoints = []
        data = []

        def my_http_request(host_creds, **kwargs):
            endpoints.append(kwargs["endpoint"])
            data.append(kwargs["data"].read())
            return http_request(host_creds, **kwargs)

        http_request_mock.side_effect = my_http_request
        dbfs_artifact_repo.log_artifact(test_file, artifact_path)
        assert endpoints == [expected_endpoint]
        assert data == [TEST_FILE_1_CONTENT]
        mock_base_request.assert_called_once_with(
            "POST", f"http://host{expected_endpoint}", **MOCK_REQUEST_KWARGS
        )


def test_log_artifact_empty_file(dbfs_artifact_repo, test_dir):
    with (
        mock.patch("mlflow.utils.rest_utils.http_request") as http_request_mock,
        mock.patch(
            "requests.Session.request", return_value=MOCK_SUCCESS_RESPONSE
        ) as mock_base_request,
    ):

        def my_http_request(host_creds, **kwargs):
            assert kwargs["endpoint"] == "/dbfs/test/empty-file"
            assert kwargs["data"] == ""
            return http_request(host_creds, **kwargs)

        http_request_mock.side_effect = my_http_request
        dbfs_artifact_repo.log_artifact(os.path.join(test_dir, "empty-file"))
        mock_base_request.assert_called_once_with(
            "POST", "http://host/dbfs/test/empty-file", **MOCK_REQUEST_KWARGS
        )


def test_log_artifact_empty_artifact_path(dbfs_artifact_repo, test_file):
    with (
        mock.patch("mlflow.utils.rest_utils.http_request") as http_request_mock,
        mock.patch(
            "requests.Session.request", return_value=MOCK_SUCCESS_RESPONSE
        ) as mock_base_request,
    ):

        def my_http_request(host_creds, **kwargs):
            assert kwargs["endpoint"] == "/dbfs/test/test.txt"
            assert kwargs["data"].read() == TEST_FILE_1_CONTENT
            return http_request(host_creds, **kwargs)

        http_request_mock.side_effect = my_http_request
        dbfs_artifact_repo.log_artifact(test_file, "")
        mock_base_request.assert_called_once_with(
            "POST", "http://host/dbfs/test/test.txt", **MOCK_REQUEST_KWARGS
        )


def test_log_artifact_error(dbfs_artifact_repo, test_file):
    with mock.patch(
        "mlflow.utils.rest_utils.http_request", return_value=Mock(status_code=409, text="")
    ):
        with pytest.raises(MlflowException, match=r"API request to endpoint .+ failed"):
            dbfs_artifact_repo.log_artifact(test_file)


@pytest.mark.parametrize(
    "artifact_path",
    [
        None,
        "",  # should behave like '/' and exclude base name of logged_dir
        # We should add '.',
    ],
)
def test_log_artifacts(dbfs_artifact_repo, test_dir, artifact_path):
    with (
        mock.patch("mlflow.utils.rest_utils.http_request") as http_request_mock,
        mock.patch(
            "requests.Session.request", return_value=MOCK_SUCCESS_RESPONSE
        ) as mock_base_request,
    ):
        endpoints = []
        data = []

        def my_http_request(host_creds, **kwargs):
            endpoints.append(kwargs["endpoint"])
            if kwargs["endpoint"] == "/dbfs/test/empty-file":
                data.append(kwargs["data"])
            else:
                data.append(kwargs["data"].read())
            return http_request(host_creds, **kwargs)

        http_request_mock.side_effect = my_http_request
        dbfs_artifact_repo.log_artifacts(test_dir, artifact_path)
        assert set(endpoints) == {
            "/dbfs/test/subdir/test.txt",
            "/dbfs/test/test.txt",
            "/dbfs/test/empty-file",
        }
        assert set(data) == {
            TEST_FILE_2_CONTENT,
            TEST_FILE_3_CONTENT,
            "",
        }

        mock_calls = [
            mock.call("POST", "http://host/dbfs/test/empty-file", **MOCK_REQUEST_KWARGS),
            mock.call("POST", "http://host/dbfs/test/test.txt", **MOCK_REQUEST_KWARGS),
            mock.call("POST", "http://host/dbfs/test/subdir/test.txt", **MOCK_REQUEST_KWARGS),
        ]
        mock_base_request.assert_has_calls(mock_calls, any_order=True)


def test_log_artifacts_error(dbfs_artifact_repo, test_dir):
    with mock.patch(
        "mlflow.utils.rest_utils.http_request", return_value=Mock(status_code=409, text="")
    ):
        with pytest.raises(MlflowException, match=r"API request to endpoint .+ failed"):
            dbfs_artifact_repo.log_artifacts(test_dir)


@pytest.mark.parametrize(
    ("artifact_path", "expected_endpoints"),
    [
        (
            "a",
            {
                "/dbfs/test/a/subdir/test.txt",
                "/dbfs/test/a/test.txt",
                "/dbfs/test/a/empty-file",
            },
        ),
        (
            "a/",
            {
                "/dbfs/test/a/subdir/test.txt",
                "/dbfs/test/a/test.txt",
                "/dbfs/test/a/empty-file",
            },
        ),
        ("/", {"/dbfs/test/subdir/test.txt", "/dbfs/test/test.txt", "/dbfs/test/empty-file"}),
    ],
)
def test_log_artifacts_with_artifact_path(
    dbfs_artifact_repo, test_dir, artifact_path, expected_endpoints
):
    with (
        mock.patch("mlflow.utils.rest_utils.http_request") as http_request_mock,
        mock.patch(
            "requests.Session.request", return_value=MOCK_SUCCESS_RESPONSE
        ) as mock_base_request,
    ):
        endpoints = []

        def my_http_request(host_creds, **kwargs):
            endpoints.append(kwargs["endpoint"])
            return http_request(host_creds, **kwargs)

        http_request_mock.side_effect = my_http_request
        dbfs_artifact_repo.log_artifacts(test_dir, artifact_path)
        assert set(endpoints) == expected_endpoints
        mock_calls = [
            mock.call("POST", f"http://host{endpoint}", **MOCK_REQUEST_KWARGS)
            for endpoint in expected_endpoints
        ]
        mock_base_request.assert_has_calls(mock_calls, any_order=True)


def test_list_artifacts(dbfs_artifact_repo):
    with mock.patch("requests.Session.request") as mock_base_request:
        mock_base_request.return_value = Mock(text=json.dumps(LIST_ARTIFACTS_RESPONSE))
        artifacts = dbfs_artifact_repo.list_artifacts()
        assert len(artifacts) == 2
        assert artifacts[0].path == "a.txt"
        assert artifacts[0].is_dir is False
        assert artifacts[0].file_size == 100
        assert artifacts[1].path == "dir"
        assert artifacts[1].is_dir is True
        assert artifacts[1].file_size is None
        mock_base_request.assert_called_with(
            "GET",
            "http://host/api/2.0/dbfs/list",
            allow_redirects=True,
            headers=mock.ANY,
            verify=True,
            timeout=mock.ANY,
            params={"path": "/test/"},
        )
        # Calling list_artifacts() on a path that's a file should return an empty list
        mock_base_request.return_value.text = json.dumps(LIST_ARTIFACTS_SINGLE_FILE_RESPONSE)
        list_on_file = dbfs_artifact_repo.list_artifacts("a.txt")
        assert len(list_on_file) == 0
        mock_base_request.assert_called_with(
            "GET",
            "http://host/api/2.0/dbfs/list",
            allow_redirects=True,
            headers=mock.ANY,
            verify=True,
            timeout=mock.ANY,
            params={"path": "/test/a.txt"},
        )


def test_download_artifacts(dbfs_artifact_repo):
    with (
        mock.patch(DBFS_ARTIFACT_REPOSITORY + "._dbfs_is_dir") as is_dir_mock,
        mock.patch(DBFS_ARTIFACT_REPOSITORY + "._dbfs_list_api") as list_mock,
        mock.patch(DBFS_ARTIFACT_REPOSITORY + "._dbfs_download") as download_mock,
    ):
        is_dir_mock.side_effect = [
            True,
            False,
            True,
        ]
        list_mock.side_effect = [
            Mock(text=json.dumps(LIST_ARTIFACTS_RESPONSE)),
            Mock(text="{}"),  # this call is for listing `/dir`.
            Mock(text="{}"),  # this call is for listing `/dir/a.txt`.
        ]
        dbfs_artifact_repo.download_artifacts("/")
        assert list_mock.call_count == 2
        assert download_mock.call_count == 1
        chronological_download_calls = list(download_mock.call_args_list)
        # Calls are in reverse chronological order by default
        chronological_download_calls.reverse()
        _, kwargs_call = chronological_download_calls[0]
        assert kwargs_call["endpoint"] == "/dbfs/test/a.txt"


def test_get_host_creds_from_default_store_file_store():
    with mock.patch("mlflow.tracking._tracking_service.utils._get_store", return_value=FileStore()):
        with pytest.raises(MlflowException, match="Failed to get credentials for DBFS"):
            _get_host_creds_from_default_store()


def test_get_host_creds_from_default_store_rest_store():
    with mock.patch(
        "mlflow.tracking._tracking_service.utils._get_store",
        return_value=RestStore(lambda: MlflowHostCreds("http://host")),
    ):
        assert isinstance(_get_host_creds_from_default_store()(), MlflowHostCreds)
```

--------------------------------------------------------------------------------

````
