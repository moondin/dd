---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 922
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 922 of 991)

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

---[FILE: test_mlflow_artifact_repo.py]---
Location: mlflow-master/tests/store/artifact/test_mlflow_artifact_repo.py

```python
import os
import posixpath
from unittest import mock

import pytest

from mlflow.exceptions import MlflowException
from mlflow.store.artifact.artifact_repository_registry import get_artifact_repository
from mlflow.store.artifact.mlflow_artifacts_repo import MlflowArtifactsRepository
from mlflow.utils.credentials import get_default_host_creds


@pytest.fixture(scope="module", autouse=True)
def set_tracking_uri():
    with mock.patch(
        "mlflow.store.artifact.mlflow_artifacts_repo.get_tracking_uri",
        return_value="http://localhost:5000/",
    ):
        yield


def test_artifact_uri_factory():
    repo = get_artifact_repository("mlflow-artifacts://test.com")
    assert isinstance(repo, MlflowArtifactsRepository)


base_url = "/api/2.0/mlflow-artifacts/artifacts"
base_path = "/my/artifact/path"
conditions = [
    (
        f"mlflow-artifacts://myhostname:4242{base_path}/hostport",
        f"http://myhostname:4242{base_url}{base_path}/hostport",
    ),
    (
        f"mlflow-artifacts://myhostname{base_path}/host",
        f"http://myhostname{base_url}{base_path}/host",
    ),
    (
        f"mlflow-artifacts:{base_path}/nohost",
        f"http://localhost:5000{base_url}{base_path}/nohost",
    ),
    (
        f"mlflow-artifacts://{base_path}/redundant",
        f"http://localhost:5000{base_url}{base_path}/redundant",
    ),
    ("mlflow-artifacts:/", f"http://localhost:5000{base_url}"),
]


@pytest.mark.parametrize("tracking_uri", ["http://localhost:5000", "http://localhost:5000/"])
@pytest.mark.parametrize(("artifact_uri", "resolved_uri"), conditions)
def test_mlflow_artifact_uri_formats_resolved(artifact_uri, resolved_uri, tracking_uri):
    assert MlflowArtifactsRepository.resolve_uri(artifact_uri, tracking_uri) == resolved_uri


def test_mlflow_artifact_uri_raises_with_invalid_tracking_uri():
    with pytest.raises(
        MlflowException,
        match="When an mlflow-artifacts URI was supplied, the tracking URI must be a valid",
    ):
        MlflowArtifactsRepository.resolve_uri(
            artifact_uri=f"mlflow-artifacts://myhostname:4242{base_path}/hostport",
            tracking_uri="file:///tmp",
        )


def test_mlflow_artifact_uri_raises_with_invalid_artifact_uri():
    failing_conditions = [f"mlflow-artifacts://5000/{base_path}", "mlflow-artifacts://5000/"]

    for failing_condition in failing_conditions:
        with pytest.raises(
            MlflowException,
            match="The mlflow-artifacts uri was supplied with a port number: 5000, but no "
            "host was defined.",
        ):
            MlflowArtifactsRepository(failing_condition)


class MockResponse:
    def __init__(self, data, status_code):
        self.data = data
        self.status_code = status_code

    def json(self):
        return self.data

    def raise_for_status(self):
        if self.status_code >= 400:
            raise Exception("request failed")


class MockStreamResponse(MockResponse):
    def iter_content(self, chunk_size):
        yield self.data.encode("utf-8")

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        pass


class FileObjectMatcher:
    def __init__(self, name, mode):
        self.name = name
        self.mode = mode

    def __eq__(self, other):
        return self.name == other.name and self.mode == other.mode


@pytest.fixture
def mlflow_artifact_repo():
    artifact_uri = "mlflow-artifacts:/api/2.0/mlflow-artifacts/artifacts"
    return MlflowArtifactsRepository(artifact_uri)


@pytest.fixture
def mlflow_artifact_repo_with_host():
    artifact_uri = "mlflow-artifacts://test.com:5000/api/2.0/mlflow-artifacts/artifacts"
    return MlflowArtifactsRepository(artifact_uri)


@pytest.mark.parametrize("artifact_path", [None, "dir", "path/to/artifacts/storage"])
def test_log_artifact(mlflow_artifact_repo, tmp_path, artifact_path):
    tmp_path = tmp_path.joinpath("a.txt")
    tmp_path.write_text("0")
    with mock.patch(
        "mlflow.store.artifact.http_artifact_repo.http_request",
        return_value=MockResponse({}, 200),
    ) as mock_put:
        mlflow_artifact_repo.log_artifact(tmp_path, artifact_path)
        paths = (artifact_path, tmp_path.name) if artifact_path else (tmp_path.name,)
        mock_put.assert_called_once_with(
            mlflow_artifact_repo._host_creds,
            posixpath.join("/", *paths),
            "PUT",
            extra_headers={"Content-Type": "text/plain"},
            data=FileObjectMatcher(str(tmp_path), "rb"),
        )

    with mock.patch(
        "mlflow.store.artifact.http_artifact_repo.http_request",
        return_value=MockResponse({}, 400),
    ):
        with pytest.raises(Exception, match="request failed"):
            mlflow_artifact_repo.log_artifact(tmp_path, artifact_path)


@pytest.mark.parametrize("artifact_path", [None, "dir", "path/to/artifacts/storage"])
def test_log_artifact_with_host_and_port(mlflow_artifact_repo_with_host, tmp_path, artifact_path):
    tmp_path = tmp_path.joinpath("a.txt")
    tmp_path.write_text("0")
    with mock.patch(
        "mlflow.store.artifact.http_artifact_repo.http_request",
        return_value=MockResponse({}, 200),
    ) as mock_put:
        mlflow_artifact_repo_with_host.log_artifact(tmp_path, artifact_path)
        paths = (artifact_path, tmp_path.name) if artifact_path else (tmp_path.name,)
        mock_put.assert_called_once_with(
            mlflow_artifact_repo_with_host._host_creds,
            posixpath.join("/", *paths),
            "PUT",
            extra_headers={"Content-Type": "text/plain"},
            data=FileObjectMatcher(str(tmp_path), "rb"),
        )

    with mock.patch(
        "mlflow.store.artifact.http_artifact_repo.http_request",
        return_value=MockResponse({}, 400),
    ):
        with pytest.raises(Exception, match="request failed"):
            mlflow_artifact_repo_with_host.log_artifact(tmp_path, artifact_path)


@pytest.mark.parametrize("artifact_path", [None, "dir", "path/to/artifacts/storage"])
def test_log_artifacts(mlflow_artifact_repo, tmp_path, artifact_path):
    tmp_path_a = tmp_path.joinpath("a.txt")
    directory = tmp_path.joinpath("dir")
    directory.mkdir()
    tmp_path_b = directory.joinpath("b.txt")
    tmp_path_a.write_text("0")
    tmp_path_b.write_text("1")

    with mock.patch.object(mlflow_artifact_repo, "log_artifact") as mock_log_artifact:
        mlflow_artifact_repo.log_artifacts(tmp_path, artifact_path)
        mock_log_artifact.assert_has_calls(
            [
                mock.call(str(tmp_path_a), artifact_path),
                mock.call(
                    str(tmp_path_b),
                    posixpath.join(artifact_path, "dir") if artifact_path else "dir",
                ),
            ],
        )

    with mock.patch(
        "mlflow.store.artifact.http_artifact_repo.http_request",
        return_value=MockResponse({}, 400),
    ):
        with pytest.raises(Exception, match="request failed"):
            mlflow_artifact_repo.log_artifacts(tmp_path, artifact_path)


def test_list_artifacts(mlflow_artifact_repo):
    with mock.patch(
        "mlflow.store.artifact.http_artifact_repo.http_request",
        return_value=MockResponse({}, 200),
    ) as mock_get:
        assert mlflow_artifact_repo.list_artifacts() == []
        endpoint = "/mlflow-artifacts/artifacts"
        url, _ = mlflow_artifact_repo.artifact_uri.split(endpoint, maxsplit=1)
        mock_get.assert_called_once_with(
            get_default_host_creds(url),
            endpoint,
            "GET",
            params={"path": ""},
        )

    with mock.patch(
        "mlflow.store.artifact.http_artifact_repo.http_request",
        return_value=MockResponse(
            {
                "files": [
                    {"path": "1.txt", "is_dir": False, "file_size": 1},
                    {"path": "dir", "is_dir": True},
                ]
            },
            200,
        ),
    ):
        assert [a.path for a in mlflow_artifact_repo.list_artifacts()] == ["1.txt", "dir"]

    with mock.patch(
        "mlflow.store.artifact.http_artifact_repo.http_request",
        return_value=MockResponse(
            {
                "files": [
                    {"path": "1.txt", "is_dir": False, "file_size": 1},
                    {"path": "dir", "is_dir": True},
                ]
            },
            200,
        ),
    ):
        assert [a.path for a in mlflow_artifact_repo.list_artifacts(path="path")] == [
            "path/1.txt",
            "path/dir",
        ]

    with mock.patch(
        "mlflow.store.artifact.http_artifact_repo.http_request",
        return_value=MockResponse({}, 400),
    ):
        with pytest.raises(Exception, match="request failed"):
            mlflow_artifact_repo.list_artifacts()


def read_file(path):
    with open(path) as f:
        return f.read()


@pytest.mark.parametrize("remote_file_path", ["a.txt", "dir/b.xtx"])
def test_download_file(mlflow_artifact_repo, tmp_path, remote_file_path):
    with mock.patch(
        "mlflow.store.artifact.http_artifact_repo.http_request",
        return_value=MockStreamResponse("data", 200),
    ) as mock_get:
        tmp_path = tmp_path.joinpath(posixpath.basename(remote_file_path))
        mlflow_artifact_repo._download_file(remote_file_path, tmp_path)
        mock_get.assert_called_once_with(
            mlflow_artifact_repo._host_creds,
            posixpath.join("/", remote_file_path),
            "GET",
            stream=True,
        )
        with open(tmp_path) as f:
            assert f.read() == "data"

    with mock.patch(
        "mlflow.store.artifact.http_artifact_repo.http_request",
        return_value=MockStreamResponse("data", 400),
    ):
        with pytest.raises(Exception, match="request failed"):
            mlflow_artifact_repo._download_file(remote_file_path, tmp_path)


def test_download_artifacts(mlflow_artifact_repo, tmp_path):
    # This test simulates downloading artifacts in the following structure:
    # ---------
    # - a.txt
    # - dir
    #   - b.txt
    # ---------
    def http_request(_host_creds, endpoint, _method, **kwargs):
        # Responses for list_artifacts
        if params := kwargs.get("params"):
            if params.get("path") == "":
                return MockResponse(
                    {
                        "files": [
                            {"path": "a.txt", "is_dir": False, "file_size": 1},
                            {"path": "dir", "is_dir": True},
                        ]
                    },
                    200,
                )
            elif params.get("path") == "dir":
                return MockResponse(
                    {
                        "files": [
                            {"path": "b.txt", "is_dir": False, "file_size": 1},
                        ]
                    },
                    200,
                )
            else:
                Exception("Unreachable")

        # Responses for _download_file
        if endpoint == "/a.txt":
            return MockStreamResponse("data_a", 200)
        elif endpoint == "/dir/b.txt":
            return MockStreamResponse("data_b", 200)
        else:
            raise Exception("Unreachable")

    with mock.patch("mlflow.store.artifact.http_artifact_repo.http_request", http_request):
        mlflow_artifact_repo.download_artifacts("", tmp_path)
        paths = [os.path.join(root, f) for root, _, files in os.walk(tmp_path) for f in files]
        assert [os.path.relpath(p, tmp_path) for p in paths] == [
            "a.txt",
            os.path.join("dir", "b.txt"),
        ]
        assert read_file(paths[0]) == "data_a"
        assert read_file(paths[1]) == "data_b"
```

--------------------------------------------------------------------------------

---[FILE: test_models_artifact_repo.py]---
Location: mlflow-master/tests/store/artifact/test_models_artifact_repo.py

```python
from pathlib import Path
from unittest import mock

import pytest

from mlflow import MlflowClient
from mlflow.entities.model_registry import ModelVersion
from mlflow.store.artifact.databricks_models_artifact_repo import DatabricksModelsArtifactRepository
from mlflow.store.artifact.models_artifact_repo import ModelsArtifactRepository
from mlflow.store.artifact.unity_catalog_models_artifact_repo import (
    UnityCatalogModelsArtifactRepository,
)
from mlflow.store.artifact.unity_catalog_oss_models_artifact_repo import (
    UnityCatalogOSSModelsArtifactRepository,
)
from mlflow.tracking._model_registry.client import ModelRegistryClient
from mlflow.utils.os import is_windows

from tests.store.artifact.constants import (
    UC_MODELS_ARTIFACT_REPOSITORY,
    UC_OSS_MODELS_ARTIFACT_REPOSITORY,
    WORKSPACE_MODELS_ARTIFACT_REPOSITORY,
)


@pytest.mark.parametrize(
    ("uri", "expected"),
    [
        ("models:/123", True),
        ("models:/name/1", False),
        ("/path/to/model", False),
        (Path("path/to/model"), False),
        ("s3://bucket/path/to/model", False),
    ],
)
def test_is_logged_model_uri(uri: str, expected: bool):
    assert ModelsArtifactRepository._is_logged_model_uri(uri) is expected


@pytest.mark.parametrize(
    "uri_with_profile",
    [
        "models://profile@databricks/MyModel/12",
        "models://profile@databricks/MyModel/Staging",
        "models://profile@databricks/MyModel/Production",
    ],
)
def test_models_artifact_repo_init_with_uri_containing_profile(uri_with_profile):
    with mock.patch(WORKSPACE_MODELS_ARTIFACT_REPOSITORY, autospec=True) as mock_repo:
        mock_repo.return_value.model_name = "MyModel"
        mock_repo.return_value.model_version = "12"
        models_repo = ModelsArtifactRepository(uri_with_profile)
        assert models_repo.artifact_uri == uri_with_profile
        assert isinstance(models_repo.repo, DatabricksModelsArtifactRepository)
        mock_repo.assert_called_once_with(
            uri_with_profile, tracking_uri=None, registry_uri=mock.ANY
        )


@pytest.mark.parametrize(
    "uri_without_profile",
    ["models:/MyModel/12", "models:/MyModel/Staging", "models:/MyModel/Production"],
)
def test_models_artifact_repo_init_with_db_profile_inferred_from_context(uri_without_profile):
    with (
        mock.patch(WORKSPACE_MODELS_ARTIFACT_REPOSITORY, autospec=True) as mock_repo,
        mock.patch(
            "mlflow.store.artifact.utils.models.mlflow.get_registry_uri",
            return_value="databricks://getRegistryUriDefault",
        ),
    ):
        mock_repo.return_value.model_name = "MyModel"
        mock_repo.return_value.model_version = "12"
        models_repo = ModelsArtifactRepository(uri_without_profile)
        assert models_repo.artifact_uri == uri_without_profile
        assert isinstance(models_repo.repo, DatabricksModelsArtifactRepository)
        mock_repo.assert_called_once_with(
            uri_without_profile,
            tracking_uri=None,
            registry_uri="databricks://getRegistryUriDefault",
        )


def test_models_artifact_repo_init_with_uc_registry_db_profile_inferred_from_context():
    model_uri = "models:/MyModel/12"
    uc_registry_uri = "databricks-uc://getRegistryUriDefault"
    with (
        mock.patch(UC_MODELS_ARTIFACT_REPOSITORY, autospec=True) as mock_repo,
        mock.patch("mlflow.get_registry_uri", return_value=uc_registry_uri),
    ):
        mock_repo.return_value.model_name = "MyModel"
        mock_repo.return_value.model_version = "12"
        models_repo = ModelsArtifactRepository(model_uri)
        assert models_repo.artifact_uri == model_uri
        assert isinstance(models_repo.repo, UnityCatalogModelsArtifactRepository)
        mock_repo.assert_called_once_with(
            model_uri, registry_uri=uc_registry_uri, tracking_uri=None
        )


def test_models_artifact_repo_init_with_uc_oss_profile_inferred_from_context():
    model_uri = "models:/MyModel/12"
    uc_registry_uri = "uc://getRegistryUriDefault"
    with (
        mock.patch(UC_OSS_MODELS_ARTIFACT_REPOSITORY, autospec=True) as mock_repo,
        mock.patch("mlflow.get_registry_uri", return_value=uc_registry_uri),
    ):
        mock_repo.return_value.model_name = "MyModel"
        mock_repo.return_value.model_version = "12"
        models_repo = ModelsArtifactRepository(model_uri)
        assert models_repo.artifact_uri == model_uri
        assert isinstance(models_repo.repo, UnityCatalogOSSModelsArtifactRepository)
        mock_repo.assert_called_once_with(
            model_uri, registry_uri=uc_registry_uri, tracking_uri=None
        )


def test_models_artifact_repo_init_with_version_uri_and_not_using_databricks_registry():
    non_databricks_uri = "non_databricks_uri"
    artifact_location = "s3://blah_bucket/"
    with (
        mock.patch.object(
            MlflowClient, "get_model_version_download_uri", return_value=artifact_location
        ),
        mock.patch(
            "mlflow.store.artifact.utils.models.mlflow.get_registry_uri",
            return_value=non_databricks_uri,
        ),
        mock.patch(
            "mlflow.store.artifact.artifact_repository_registry.get_artifact_repository",
            return_value=None,
        ) as get_repo_mock,
    ):
        model_uri = "models:/MyModel/12"
        ModelsArtifactRepository(model_uri)
        get_repo_mock.assert_called_once_with(
            artifact_location, tracking_uri=None, registry_uri=mock.ANY
        )


def test_models_artifact_repo_init_with_stage_uri_and_not_using_databricks_registry():
    model_uri = "models:/MyModel/Staging"
    artifact_location = "s3://blah_bucket/"
    model_version_detailed = ModelVersion(
        "MyModel",
        "10",
        "2345671890",
        "234567890",
        "some description",
        "UserID",
        "Production",
        "source",
        "run12345",
    )
    get_latest_versions_patch = mock.patch.object(
        ModelRegistryClient, "get_latest_versions", return_value=[model_version_detailed]
    )
    get_model_version_download_uri_patch = mock.patch.object(
        MlflowClient, "get_model_version_download_uri", return_value=artifact_location
    )
    with (
        get_latest_versions_patch,
        get_model_version_download_uri_patch,
        mock.patch(
            "mlflow.store.artifact.artifact_repository_registry.get_artifact_repository",
            return_value=None,
        ) as get_repo_mock,
    ):
        ModelsArtifactRepository(model_uri)
        get_repo_mock.assert_called_once_with(
            artifact_location, tracking_uri=None, registry_uri=mock.ANY
        )


def test_models_artifact_repo_uses_repo_download_artifacts(tmp_path):
    """
    `ModelsArtifactRepository` should delegate `download_artifacts` to its
    `self.repo.download_artifacts` function.
    """
    artifact_location = "s3://blah_bucket/"
    dummy_file = tmp_path / "dummy_file.txt"
    dummy_file.touch()

    with (
        mock.patch.object(
            MlflowClient, "get_model_version_download_uri", return_value=artifact_location
        ),
        mock.patch.object(ModelsArtifactRepository, "_add_registered_model_meta_file"),
    ):
        model_uri = "models:/MyModel/12"
        models_repo = ModelsArtifactRepository(model_uri)
        models_repo.repo = mock.Mock(**{"download_artifacts.return_value": str(dummy_file)})

        models_repo.download_artifacts("artifact_path", str(tmp_path))

        models_repo.repo.download_artifacts.assert_called_once_with("artifact_path", str(tmp_path))


@pytest.mark.skipif(is_windows(), reason="This test fails on Windows")
def test_models_artifact_repo_download_with_real_files(tmp_path):
    # Simulate an artifact repository
    temp_remote_storage = tmp_path / "remote_storage"
    model_dir = temp_remote_storage / "model_dir"
    model_dir.mkdir(parents=True)
    mlmodel_path = model_dir / "MLmodel"
    mlmodel_path.touch()

    # Mock get_model_version_download_uri to return the path to the temp_remote_storage location
    with mock.patch.object(
        MlflowClient, "get_model_version_download_uri", return_value=str(model_dir)
    ):
        # Create ModelsArtifactRepository instance
        models_repo = ModelsArtifactRepository("models:/MyModel/1")

        # Use another temporary directory as the download destination
        temp_local_storage = tmp_path / "local_storage"
        temp_local_storage.mkdir()

        # Download artifacts
        models_repo.download_artifacts("", str(temp_local_storage))

        # Check if the files are downloaded correctly
        downloaded_mlmodel_path = temp_local_storage / "MLmodel"
        assert downloaded_mlmodel_path.exists()

        # Check if the metadata file is created
        metadata_file_path = temp_local_storage / "registered_model_meta"
        assert metadata_file_path.exists()


def test_models_artifact_repo_does_not_add_meta_for_file(tmp_path):
    artifact_path = "artifact_file.txt"
    model_name = "MyModel"
    model_version = "12"
    artifact_location = f"s3://blah_bucket/{artifact_path}"

    dummy_file = tmp_path / artifact_path
    dummy_file.touch()

    with (
        mock.patch.object(
            MlflowClient, "get_model_version_download_uri", return_value=artifact_location
        ),
        mock.patch.object(
            ModelsArtifactRepository, "_add_registered_model_meta_file"
        ) as add_meta_mock,
    ):
        models_repo = ModelsArtifactRepository(f"models:/{model_name}/{model_version}")
        models_repo.repo = mock.Mock(**{"download_artifacts.return_value": str(dummy_file)})

        models_repo.download_artifacts(artifact_path, str(tmp_path))

        add_meta_mock.assert_not_called()


def test_models_artifact_repo_does_not_add_meta_for_directory_without_mlmodel(tmp_path):
    artifact_path = "artifact_directory"
    model_name = "MyModel"
    model_version = "12"
    artifact_location = f"s3://blah_bucket/{artifact_path}"

    # Create a directory without an MLmodel file
    dummy_dir = tmp_path / artifact_path
    dummy_dir.mkdir()
    dummy_file = dummy_dir / "dummy_file.txt"
    dummy_file.touch()

    with (
        mock.patch.object(
            MlflowClient, "get_model_version_download_uri", return_value=artifact_location
        ),
        mock.patch.object(
            ModelsArtifactRepository, "_add_registered_model_meta_file"
        ) as add_meta_mock,
    ):
        models_repo = ModelsArtifactRepository(f"models:/{model_name}/{model_version}")
        models_repo.repo = mock.Mock(**{"download_artifacts.return_value": str(dummy_dir)})

        models_repo.download_artifacts(artifact_path, str(tmp_path))

        add_meta_mock.assert_not_called()


@pytest.mark.parametrize(
    ("model_uri", "expected_uri", "expected_path"),
    [
        ("models:/model/1", "models:/model/1", ""),
        ("models:/model/1/", "models:/model/1", ""),
        ("models:/model/1/path", "models:/model/1", "path"),
        ("models:/model/1/path/to/artifact", "models:/model/1", "path/to/artifact"),
        ("models:/model@alias", "models:/model@alias", ""),
        ("models:/model@alias/", "models:/model@alias", ""),
        ("models:/model@alias/path", "models:/model@alias", "path"),
        ("models:/model@alias/path/to/artifact", "models:/model@alias", "path/to/artifact"),
        (
            "models://scope:prefix@databricks/model/1",
            "models://scope:prefix@databricks/model/1",
            "",
        ),
        (
            "models://scope:prefix@databricks/model/1/path/to/artifact",
            "models://scope:prefix@databricks/model/1",
            "path/to/artifact",
        ),
    ],
)
def test_split_models_uri(model_uri, expected_uri, expected_path):
    assert ModelsArtifactRepository.split_models_uri(model_uri) == (expected_uri, expected_path)
```

--------------------------------------------------------------------------------

---[FILE: test_optimized_s3_artifact_repo.py]---
Location: mlflow-master/tests/store/artifact/test_optimized_s3_artifact_repo.py

```python
import os
import posixpath
from datetime import datetime, timezone
from unittest import mock
from unittest.mock import ANY

import pytest
import requests

from mlflow.protos.service_pb2 import FileInfo
from mlflow.store.artifact.optimized_s3_artifact_repo import OptimizedS3ArtifactRepository
from mlflow.store.artifact.s3_artifact_repo import (
    _MAX_CACHE_SECONDS,
    _cached_get_s3_client,
)

from tests.helper_functions import set_boto_credentials  # noqa: F401

S3_REPOSITORY_MODULE = "mlflow.store.artifact.optimized_s3_artifact_repo"
S3_ARTIFACT_REPOSITORY = f"{S3_REPOSITORY_MODULE}.OptimizedS3ArtifactRepository"
DEFAULT_REGION_NAME = "us_random_region"


@pytest.fixture
def s3_artifact_root(mock_s3_bucket):
    return f"s3://{mock_s3_bucket}"


@pytest.fixture(autouse=True)
def reset_cached_get_s3_client():
    _cached_get_s3_client.cache_clear()


def test_get_s3_client_hits_cache(s3_artifact_root, monkeypatch):
    with mock.patch("boto3.client") as mock_get_s3_client:
        s3_client_mock = mock.Mock()
        mock_get_s3_client.return_value = s3_client_mock
        s3_client_mock.head_bucket.return_value = {"BucketRegion": "us-west-2"}

        repo = OptimizedS3ArtifactRepository(posixpath.join(s3_artifact_root, "some/path"))

        # We get the s3 client once during initialization to get the bucket region name
        cache_info = _cached_get_s3_client.cache_info()
        assert cache_info.hits == 0
        assert cache_info.misses == 1
        assert cache_info.currsize == 1

        # When the s3 client is fetched via class method, it is called with the region name
        repo._get_s3_client()
        cache_info = _cached_get_s3_client.cache_info()
        assert cache_info.hits == 0
        assert cache_info.misses == 2
        assert cache_info.currsize == 2

        # A second fetch via class method leads to cache hit
        repo._get_s3_client()
        cache_info = _cached_get_s3_client.cache_info()
        assert cache_info.hits == 1
        assert cache_info.misses == 2
        assert cache_info.currsize == 2

        monkeypatch.setenv("MLFLOW_EXPERIMENTAL_S3_SIGNATURE_VERSION", "s3v2")
        repo._get_s3_client()
        cache_info = _cached_get_s3_client.cache_info()
        assert cache_info.hits == 1
        assert cache_info.misses == 3
        assert cache_info.currsize == 3

        with mock.patch(
            "mlflow.store.artifact.s3_artifact_repo._get_utcnow_timestamp",
            return_value=datetime.now(timezone.utc).timestamp() + _MAX_CACHE_SECONDS,
        ):
            repo._get_s3_client()
        cache_info = _cached_get_s3_client.cache_info()
        assert cache_info.hits == 1
        assert cache_info.misses == 4
        assert cache_info.currsize == 4


@pytest.mark.parametrize(
    ("ignore_tls_env", "verify"), [("0", None), ("1", False), ("true", False), ("false", None)]
)
def test_get_s3_client_verify_param_set_correctly(
    s3_artifact_root, ignore_tls_env, verify, monkeypatch
):
    monkeypatch.setenv("MLFLOW_S3_IGNORE_TLS", ignore_tls_env)
    with mock.patch("boto3.client") as mock_get_s3_client:
        s3_client_mock = mock.Mock()
        s3_client_mock.head_bucket.return_value = {
            "ResponseMetadata": {
                "HTTPHeaders": {"x-amz-bucket-region": DEFAULT_REGION_NAME},
            }
        }
        mock_get_s3_client.return_value = s3_client_mock
        repo = OptimizedS3ArtifactRepository(posixpath.join(s3_artifact_root, "some/path"))
        repo._get_s3_client()
        mock_get_s3_client.assert_called_with(
            "s3",
            config=ANY,
            endpoint_url=ANY,
            verify=verify,
            aws_access_key_id=None,
            aws_secret_access_key=None,
            aws_session_token=None,
            region_name=ANY,
        )


@pytest.mark.parametrize("client_throws", [True, False])
def test_get_s3_client_region_name_set_correctly(s3_artifact_root, client_throws):
    region_name = "us_random_region_42"
    with mock.patch("boto3.client") as mock_get_s3_client:
        from botocore.exceptions import ClientError

        s3_client_mock = mock.Mock()
        mock_get_s3_client.return_value = s3_client_mock
        if client_throws:
            error = ClientError(
                {
                    "Error": {"Code": "403", "Message": "Forbidden"},
                    "ResponseMetadata": {
                        "HTTPHeaders": {"x-amz-bucket-region": region_name},
                    },
                },
                "head_bucket",
            )
            s3_client_mock.head_bucket.side_effect = error
        else:
            s3_client_mock.head_bucket.return_value = {"BucketRegion": region_name}

        repo = OptimizedS3ArtifactRepository(posixpath.join(s3_artifact_root, "some/path"))
        repo._get_s3_client()

        mock_get_s3_client.assert_called_with(
            "s3",
            config=ANY,
            endpoint_url=ANY,
            verify=None,
            aws_access_key_id=None,
            aws_secret_access_key=None,
            aws_session_token=None,
            region_name=region_name,
        )


def test_get_s3_client_region_name_set_correctly_with_non_throwing_response(s3_artifact_root):
    region_name = "us_random_region_42"
    with mock.patch("boto3.client") as mock_get_s3_client:
        s3_client_mock = mock.Mock()
        mock_get_s3_client.return_value = s3_client_mock
        s3_client_mock.head_bucket.return_value = {
            "ResponseMetadata": {
                "HTTPHeaders": {"x-amz-bucket-region": region_name},
            }
        }
        repo = OptimizedS3ArtifactRepository(posixpath.join(s3_artifact_root, "some/path"))
        repo._get_s3_client()

        mock_get_s3_client.assert_called_with(
            "s3",
            config=ANY,
            endpoint_url=ANY,
            verify=None,
            aws_access_key_id=None,
            aws_secret_access_key=None,
            aws_session_token=None,
            region_name=region_name,
        )


def test_s3_client_config_set_correctly(s3_artifact_root):
    repo = OptimizedS3ArtifactRepository(posixpath.join(s3_artifact_root, "some/path"))
    s3_client = repo._get_s3_client()
    assert s3_client.meta.config.s3.get("addressing_style") == "auto"


def test_s3_creds_passed_to_client(s3_artifact_root):
    with mock.patch("boto3.client") as mock_get_s3_client:
        s3_client_mock = mock.Mock()
        s3_client_mock.head_bucket.return_value = {
            "ResponseMetadata": {
                "HTTPHeaders": {"x-amz-bucket-region": DEFAULT_REGION_NAME},
            }
        }
        mock_get_s3_client.return_value = s3_client_mock
        repo = OptimizedS3ArtifactRepository(
            s3_artifact_root,
            access_key_id="my-id",
            secret_access_key="my-key",
            session_token="my-session-token",
        )
        repo._get_s3_client()
        mock_get_s3_client.assert_called_with(
            "s3",
            config=ANY,
            endpoint_url=ANY,
            verify=None,
            aws_access_key_id="my-id",
            aws_secret_access_key="my-key",
            aws_session_token="my-session-token",
            region_name=ANY,
        )


def test_log_artifacts_in_parallel_when_necessary(
    s3_artifact_root, mock_s3_bucket, tmp_path, monkeypatch
):
    repo = OptimizedS3ArtifactRepository(posixpath.join(s3_artifact_root, "some/path"))

    file_a_name = "a.txt"
    file_a_text = "A"
    file_a_path = os.path.join(tmp_path, file_a_name)
    with open(file_a_path, "w") as f:
        f.write(file_a_text)

    monkeypatch.setenv("MLFLOW_MULTIPART_UPLOAD_CHUNK_SIZE", "0")
    with mock.patch(
        f"{S3_ARTIFACT_REPOSITORY}._multipart_upload", return_value=None
    ) as multipart_upload_mock:
        repo.log_artifacts(tmp_path)
        multipart_upload_mock.assert_called_once_with(ANY, ANY, mock_s3_bucket, "some/path/a.txt")


@pytest.mark.parametrize(
    ("file_size", "is_parallel_download"),
    [(None, False), (100, False), (500 * 1024**2 - 1, False), (500 * 1024**2, True)],
)
def test_download_file_in_parallel_when_necessary(
    s3_artifact_root, file_size, is_parallel_download
):
    repo = OptimizedS3ArtifactRepository(posixpath.join(s3_artifact_root, "some/path"))
    remote_file_path = "file_1.txt"
    list_artifacts_result = (
        [FileInfo(path=remote_file_path, is_dir=False, file_size=file_size)] if file_size else []
    )
    with (
        mock.patch(
            f"{S3_ARTIFACT_REPOSITORY}.list_artifacts",
            return_value=list_artifacts_result,
        ),
        mock.patch(
            f"{S3_ARTIFACT_REPOSITORY}._download_from_cloud", return_value=None
        ) as download_mock,
        mock.patch(
            f"{S3_ARTIFACT_REPOSITORY}._parallelized_download_from_cloud", return_value=None
        ) as parallel_download_mock,
    ):
        repo.download_artifacts("")
        if is_parallel_download:
            parallel_download_mock.assert_called_with(file_size, remote_file_path, ANY)
        else:
            download_mock.assert_called()


def test_refresh_credentials():
    with (
        mock.patch(
            "mlflow.store.artifact.optimized_s3_artifact_repo._get_s3_client"
        ) as mock_get_s3_client,
        mock.patch(
            "mlflow.store.artifact.optimized_s3_artifact_repo.OptimizedS3ArtifactRepository._get_region_name"
        ) as mock_get_region_name,
    ):
        s3_client_mock = mock.Mock()
        mock_get_s3_client.return_value = s3_client_mock
        resp = requests.Response()
        resp.status_code = 401
        err = requests.HTTPError(response=resp)
        s3_client_mock.download_file.side_effect = err
        mock_get_region_name.return_value = "us-west-2"

        def credential_refresh_def():
            return {
                "access_key_id": "my-id-2",
                "secret_access_key": "my-key-2",
                "session_token": "my-session-2",
                "s3_upload_extra_args": {},
            }

        repo = OptimizedS3ArtifactRepository(
            "s3://my_bucket/my_path",
            access_key_id="my-id-1",
            secret_access_key="my-key-1",
            session_token="my-session-1",
            credential_refresh_def=credential_refresh_def,
        )
        try:
            repo._download_from_cloud("file_1.txt", "local_path")
        except requests.HTTPError as e:
            assert e == err

        mock_get_s3_client.assert_any_call(
            addressing_style=None,
            access_key_id="my-id-1",
            secret_access_key="my-key-1",
            session_token="my-session-1",
            region_name="us-west-2",
            s3_endpoint_url=None,
        )

        mock_get_s3_client.assert_any_call(
            addressing_style=None,
            access_key_id="my-id-2",
            secret_access_key="my-key-2",
            session_token="my-session-2",
            region_name="us-west-2",
            s3_endpoint_url=None,
        )
```

--------------------------------------------------------------------------------

````
