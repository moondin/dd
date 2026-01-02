---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 918
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 918 of 991)

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

---[FILE: test_databricks_logged_model_artifact_repo.py]---
Location: mlflow-master/tests/store/artifact/test_databricks_logged_model_artifact_repo.py

```python
from pathlib import Path
from unittest import mock

import pytest
from databricks.sdk.service.files import DirectoryEntry

from mlflow.entities.file_info import FileInfo
from mlflow.exceptions import MlflowException
from mlflow.store.artifact.databricks_logged_model_artifact_repo import (
    DatabricksLoggedModelArtifactRepository,
)


@pytest.fixture(autouse=True)
def set_fake_databricks_creds(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("DATABRICKS_HOST", "https://localhost:8080")
    monkeypatch.setenv("DATABRICKS_TOKEN", "token")


def test_log_artifact(tmp_path: Path):
    local_file = tmp_path / "local_file.txt"
    local_file.write_text("test content")
    mock_databricks_artifact_repo = mock.MagicMock()
    with (
        mock.patch(
            "mlflow.store.artifact.databricks_sdk_artifact_repo.DatabricksSdkArtifactRepository.files_api"
        ) as mock_files_api,
        mock.patch(
            "mlflow.store.artifact.databricks_tracking_artifact_repo.DatabricksArtifactRepository",
            return_value=mock_databricks_artifact_repo,
        ),
    ):
        repo = DatabricksLoggedModelArtifactRepository(
            "dbfs:/databricks/mlflow-tracking/1/logged_models/1"
        )

        # Simulate success
        repo.log_artifact(str(local_file), "artifact_path")
        mock_files_api.upload.assert_called_once()

        # Simulate failure and fallback
        mock_files_api.upload.side_effect = RuntimeError("Upload failed")
        with pytest.raises(RuntimeError, match=r"^Upload failed$"):
            repo.databricks_sdk_repo.log_artifact(str(local_file), "artifact_path")

        repo.log_artifact(str(local_file), "artifact_path")
        mock_databricks_artifact_repo.log_artifact.assert_called_once()


def test_log_artifacts(tmp_path: Path):
    local_dir = tmp_path / "local_dir"
    local_dir.mkdir()
    (local_dir / "file1.txt").write_text("content1")
    (local_dir / "file2.txt").write_text("content2")
    mock_databricks_artifact_repo = mock.MagicMock()
    with (
        mock.patch(
            "mlflow.store.artifact.databricks_sdk_artifact_repo.DatabricksSdkArtifactRepository.files_api"
        ) as mock_files_api,
        mock.patch(
            "mlflow.store.artifact.databricks_tracking_artifact_repo.DatabricksArtifactRepository",
            return_value=mock_databricks_artifact_repo,
        ),
    ):
        repo = DatabricksLoggedModelArtifactRepository(
            "dbfs:/databricks/mlflow-tracking/1/logged_models/1"
        )

        # Simulate success
        repo.log_artifacts(str(local_dir), "artifact_path")
        mock_files_api.upload.assert_called()

        # Simulate failure and fallback
        mock_files_api.upload.side_effect = RuntimeError("Upload failed")
        with pytest.raises(RuntimeError, match=r"^Upload failed$"):
            repo.databricks_sdk_repo.log_artifacts(str(local_dir), "artifact_path")

        mock_databricks_artifact_repo.log_artifact.side_effect = RuntimeError("Fallback failed")
        with pytest.raises(RuntimeError, match=r"^Fallback failed$"):
            repo.databricks_artifact_repo.log_artifact("test", "artifact_path")

        repo.log_artifacts(str(local_dir), "artifact_path")
        mock_databricks_artifact_repo.log_artifacts.assert_called_once()


def test_download_file(tmp_path: Path):
    local_file = tmp_path / "downloaded_file.txt"
    mock_databricks_artifact_repo = mock.MagicMock()
    with (
        mock.patch(
            "mlflow.store.artifact.databricks_sdk_artifact_repo.DatabricksSdkArtifactRepository.files_api"
        ) as mock_files_api,
        mock.patch(
            "mlflow.store.artifact.databricks_tracking_artifact_repo.DatabricksArtifactRepository"
        ) as mock_fallback_repo,
    ):
        mock_fallback_repo.return_value = mock_databricks_artifact_repo
        repo = DatabricksLoggedModelArtifactRepository(
            "dbfs:/databricks/mlflow-tracking/1/logged_models/1"
        )

        # Simulate success
        mock_files_api.download.return_value.contents.read.side_effect = [b"test", b""]
        repo._download_file("remote_file_path", str(local_file))
        mock_files_api.download.assert_called_once()
        mock_databricks_artifact_repo._download_file.assert_not_called()

        # Simulate failure and fallback
        mock_files_api.download.side_effect = RuntimeError("Download failed")
        with pytest.raises(RuntimeError, match=r"^Download failed$"):
            repo.databricks_sdk_repo._download_file("remote_file_path", str(local_file))

        repo._download_file("remote_file_path", str(local_file))
        mock_databricks_artifact_repo._download_file.assert_called_once()


def test_list_artifacts():
    mock_databricks_artifact_repo = mock.MagicMock()
    with (
        mock.patch(
            "mlflow.store.artifact.databricks_sdk_artifact_repo.DatabricksSdkArtifactRepository.files_api"
        ) as mock_files_api,
        mock.patch(
            "mlflow.store.artifact.databricks_tracking_artifact_repo.DatabricksArtifactRepository",
            return_value=mock_databricks_artifact_repo,
        ),
    ):
        repo = DatabricksLoggedModelArtifactRepository(
            "dbfs:/databricks/mlflow-tracking/1/logged_models/1"
        )

        # Simulate success with a non-empty list
        mock_files_api.list_directory_contents.return_value = [
            DirectoryEntry(path="artifact1", is_directory=False, file_size=123),
            DirectoryEntry(path="dir", is_directory=True),
        ]
        artifacts = repo.list_artifacts("artifact_path")
        mock_files_api.list_directory_contents.assert_called_once()
        assert len(artifacts) == 2

        # Simulate failure and fallback
        mock_files_api.list_directory_contents.side_effect = RuntimeError("List failed")
        with pytest.raises(RuntimeError, match=r"^List failed$"):
            repo.databricks_sdk_repo.list_artifacts("artifact_path")

        mock_databricks_artifact_repo.list_artifacts.return_value = [
            FileInfo(path="fallback_artifact", is_dir=False, file_size=456)
        ]
        artifacts = repo.list_artifacts("artifact_path")
        mock_databricks_artifact_repo.list_artifacts.assert_called_once()
        assert len(artifacts) == 1


def test_constructor_with_valid_uri():
    mock_databricks_artifact_repo = mock.MagicMock()
    mock_databricks_sdk_repo = mock.MagicMock()
    with (
        mock.patch(
            "mlflow.store.artifact.databricks_tracking_artifact_repo.DatabricksArtifactRepository",
            return_value=mock_databricks_artifact_repo,
        ),
        mock.patch(
            "mlflow.store.artifact.databricks_tracking_artifact_repo.DatabricksSdkArtifactRepository",
            return_value=mock_databricks_sdk_repo,
        ),
    ):
        repo = DatabricksLoggedModelArtifactRepository(
            "dbfs:/databricks/mlflow-tracking/1/logged_models/1"
        )
        assert repo is not None


@pytest.mark.parametrize(
    "invalid_uri",
    [
        "invalid_uri",
        "dbfs:/databricks/mlflow-tracking/1/runs/1",
        "dbfs:/databricks/mlflow-tracking/1/other/1",
        "http://example.com",
        "s3://bucket/path",
    ],
)
def test_constructor_with_invalid_uri(invalid_uri: str):
    with pytest.raises(MlflowException, match="Invalid artifact URI"):
        DatabricksLoggedModelArtifactRepository(invalid_uri)


@pytest.mark.parametrize(
    ("uri", "expected_result"),
    [
        # Valid logged model URIs
        ("dbfs:/databricks/mlflow-tracking/1/logged_models/1", True),
        ("dbfs:/databricks/mlflow-tracking/123/logged_models/456", True),
        # Invalid URIs
        ("dbfs:/databricks/mlflow-tracking/1/runs/1", False),
        ("dbfs:/databricks/mlflow-tracking/1/other/1", False),
        ("dbfs:/databricks/mlflow-tracking/1", False),
        ("dbfs:/databricks/mlflow-tracking/1/logged_models", False),
        ("dbfs:/databricks/mlflow-tracking/logged_models/1", False),
    ],
)
def test_is_logged_model_uri(uri: str, expected_result: bool):
    result = DatabricksLoggedModelArtifactRepository.is_logged_model_uri(uri)
    assert result == expected_result


def test_uri_parsing():
    mock_databricks_artifact_repo = mock.MagicMock()
    mock_databricks_sdk_repo = mock.MagicMock()
    with (
        mock.patch(
            "mlflow.store.artifact.databricks_tracking_artifact_repo.DatabricksArtifactRepository",
            return_value=mock_databricks_artifact_repo,
        ),
        mock.patch(
            "mlflow.store.artifact.databricks_tracking_artifact_repo.DatabricksSdkArtifactRepository",
            return_value=mock_databricks_sdk_repo,
        ),
    ):
        repo = DatabricksLoggedModelArtifactRepository(
            "dbfs:/databricks/mlflow-tracking/123/logged_models/456"
        )

        # Access the regex match to verify parsing
        m = repo._get_uri_regex().search("dbfs:/databricks/mlflow-tracking/123/logged_models/456")
        assert m is not None
        assert m.group("experiment_id") == "123"
        assert m.group("model_id") == "456"
        assert m.group("relative_path") is None


def test_build_root_path():
    mock_databricks_artifact_repo = mock.MagicMock()
    mock_databricks_sdk_repo = mock.MagicMock()
    with (
        mock.patch(
            "mlflow.store.artifact.databricks_tracking_artifact_repo.DatabricksArtifactRepository",
            return_value=mock_databricks_artifact_repo,
        ),
        mock.patch(
            "mlflow.store.artifact.databricks_tracking_artifact_repo.DatabricksSdkArtifactRepository",
            return_value=mock_databricks_sdk_repo,
        ),
    ):
        repo = DatabricksLoggedModelArtifactRepository(
            "dbfs:/databricks/mlflow-tracking/123/logged_models/456"
        )

        # Test root path building
        m = repo._get_uri_regex().search("dbfs:/databricks/mlflow-tracking/123/logged_models/456")
        root_path = repo._build_root_path("123", m, "")
        expected_path = "/WorkspaceInternal/Mlflow/Artifacts/123/LoggedModels/456"
        assert root_path == expected_path


def test_expected_uri_format():
    mock_databricks_artifact_repo = mock.MagicMock()
    mock_databricks_sdk_repo = mock.MagicMock()
    with (
        mock.patch(
            "mlflow.store.artifact.databricks_tracking_artifact_repo.DatabricksArtifactRepository",
            return_value=mock_databricks_artifact_repo,
        ),
        mock.patch(
            "mlflow.store.artifact.databricks_tracking_artifact_repo.DatabricksSdkArtifactRepository",
            return_value=mock_databricks_sdk_repo,
        ),
    ):
        repo = DatabricksLoggedModelArtifactRepository(
            "dbfs:/databricks/mlflow-tracking/1/logged_models/1"
        )
        expected_format = "databricks/mlflow-tracking/<EXP_ID>/logged_models/<MODEL_ID>"
        assert repo._get_expected_uri_format() == expected_format
```

--------------------------------------------------------------------------------

---[FILE: test_databricks_models_artifact_repo.py]---
Location: mlflow-master/tests/store/artifact/test_databricks_models_artifact_repo.py

```python
import json
from unittest import mock
from unittest.mock import ANY

import pytest
import requests

from mlflow.entities import FileInfo
from mlflow.entities.model_registry import ModelVersion
from mlflow.environment_variables import MLFLOW_MULTIPART_DOWNLOAD_CHUNK_SIZE
from mlflow.exceptions import MlflowException
from mlflow.store.artifact.databricks_models_artifact_repo import (
    DatabricksModelsArtifactRepository,
)
from mlflow.tracking._model_registry.client import ModelRegistryClient
from mlflow.utils.file_utils import _Chunk

DATABRICKS_MODEL_ARTIFACT_REPOSITORY_PACKAGE = (
    "mlflow.store.artifact.databricks_models_artifact_repo"
)
DATABRICKS_MODEL_ARTIFACT_REPOSITORY = (
    DATABRICKS_MODEL_ARTIFACT_REPOSITORY_PACKAGE + ".DatabricksModelsArtifactRepository"
)
MOCK_MODEL_ROOT_URI_WITH_PROFILE = "models://profile@databricks/MyModel/12"
MOCK_MODEL_ROOT_URI_WITHOUT_PROFILE = "models:/MyModel/12"
MOCK_PROFILE = "databricks://profile"
MOCK_MODEL_NAME = "MyModel"
MOCK_MODEL_VERSION = "12"

REGISTRY_LIST_ARTIFACTS_ENDPOINT = "/api/2.0/mlflow/model-versions/list-artifacts"
REGISTRY_ARTIFACT_PRESIGNED_URI_ENDPOINT = "/api/2.0/mlflow/model-versions/get-signed-download-uri"


@pytest.fixture
def databricks_model_artifact_repo():
    return DatabricksModelsArtifactRepository(MOCK_MODEL_ROOT_URI_WITH_PROFILE)


def test_init_with_version_uri_containing_profile():
    repo = DatabricksModelsArtifactRepository(MOCK_MODEL_ROOT_URI_WITH_PROFILE)
    assert repo.artifact_uri == MOCK_MODEL_ROOT_URI_WITH_PROFILE
    assert repo.model_name == MOCK_MODEL_NAME
    assert repo.model_version == MOCK_MODEL_VERSION


@pytest.mark.parametrize(
    "stage_uri_with_profile",
    [
        "models://profile@databricks/MyModel/Staging",
        "models://profile@databricks/MyModel/Production",
    ],
)
def test_init_with_stage_uri_containing_profile(stage_uri_with_profile):
    model_version_detailed = ModelVersion(
        MOCK_MODEL_NAME,
        MOCK_MODEL_VERSION,
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
    with get_latest_versions_patch:
        repo = DatabricksModelsArtifactRepository(stage_uri_with_profile)
        assert repo.artifact_uri == stage_uri_with_profile
        assert repo.model_name == MOCK_MODEL_NAME
        assert repo.model_version == MOCK_MODEL_VERSION
        assert repo.databricks_profile_uri == MOCK_PROFILE


@pytest.mark.parametrize(
    "invalid_artifact_uri",
    [
        "s3://test",
        "dbfs:/databricks/mlflow/MV-id/models",
        "dbfs://scope:key@notdatabricks/databricks/mlflow-regisry/123/models",
        "models:/MyModel/12",
        "models://scope:key@notdatabricks/MyModel/12",
    ],
)
def test_init_with_invalid_artifact_uris(invalid_artifact_uri):
    with pytest.raises(
        MlflowException,
        match="A valid databricks profile is required to instantiate this repository",
    ):
        DatabricksModelsArtifactRepository(invalid_artifact_uri)


def test_init_with_version_uri_and_profile_is_inferred():
    # First mock for `is_using_databricks_registry` to pass
    # Second mock to set `databricks_profile_uri` during instantiation
    with (
        mock.patch(
            "mlflow.store.artifact.utils.models.mlflow.get_registry_uri",
            return_value=MOCK_PROFILE,
        ),
        mock.patch("mlflow.tracking.get_registry_uri", return_value=MOCK_PROFILE),
    ):
        repo = DatabricksModelsArtifactRepository(MOCK_MODEL_ROOT_URI_WITHOUT_PROFILE)
        assert repo.artifact_uri == MOCK_MODEL_ROOT_URI_WITHOUT_PROFILE
        assert repo.model_name == MOCK_MODEL_NAME
        assert repo.model_version == MOCK_MODEL_VERSION
        assert repo.databricks_profile_uri == MOCK_PROFILE


@pytest.mark.parametrize(
    "stage_uri_without_profile",
    ["models:/MyModel/Staging", "models:/MyModel/Production"],
)
def test_init_with_stage_uri_and_profile_is_inferred(stage_uri_without_profile):
    model_version_detailed = ModelVersion(
        MOCK_MODEL_NAME,
        MOCK_MODEL_VERSION,
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
    with (
        get_latest_versions_patch,
        mock.patch(
            "mlflow.store.artifact.utils.models.mlflow.get_registry_uri",
            return_value=MOCK_PROFILE,
        ),
        mock.patch("mlflow.tracking.get_registry_uri", return_value=MOCK_PROFILE),
    ):
        repo = DatabricksModelsArtifactRepository(stage_uri_without_profile)
        assert repo.artifact_uri == stage_uri_without_profile
        assert repo.model_name == MOCK_MODEL_NAME
        assert repo.model_version == MOCK_MODEL_VERSION
        assert repo.databricks_profile_uri == MOCK_PROFILE


@pytest.mark.parametrize(
    "valid_profileless_artifact_uri",
    ["models:/MyModel/12", "models:/MyModel/Staging"],
)
def test_init_with_valid_uri_but_no_profile(valid_profileless_artifact_uri):
    # Mock for `is_using_databricks_registry` fail when calling `get_registry_uri`
    with mock.patch(
        "mlflow.store.artifact.utils.models.mlflow.get_registry_uri",
        return_value=None,
    ):
        with pytest.raises(
            MlflowException,
            match="A valid databricks profile is required to instantiate this repository",
        ):
            DatabricksModelsArtifactRepository(valid_profileless_artifact_uri)


def test_list_artifacts(databricks_model_artifact_repo):
    status_code = 200

    def _raise_for_status():
        if status_code == 404:
            raise Exception(
                "404 Client Error: Not Found for url: https://shard-uri/api/2.0/mlflow/model-versions/list-artifacts?name=model&version=1"
            )

    list_artifact_dir_response_mock = mock.MagicMock()
    list_artifact_dir_response_mock.status_code = status_code
    list_artifact_dir_json_mock = {
        "files": [
            {"path": "MLmodel", "is_dir": False, "file_size": 294},
            {"path": "data", "is_dir": True, "file_size": None},
        ]
    }
    list_artifact_dir_response_mock.text = json.dumps(list_artifact_dir_json_mock)
    list_artifact_dir_response_mock.raise_for_status.side_effect = _raise_for_status
    with mock.patch(
        DATABRICKS_MODEL_ARTIFACT_REPOSITORY + "._call_endpoint",
        return_value=list_artifact_dir_response_mock,
    ) as call_endpoint_mock:
        artifacts = databricks_model_artifact_repo.list_artifacts("")
        assert isinstance(artifacts, list)
        assert len(artifacts) == 2
        assert artifacts[0].path == "MLmodel"
        assert artifacts[0].is_dir is False
        assert artifacts[0].file_size == 294
        assert artifacts[1].path == "data"
        assert artifacts[1].is_dir is True
        assert artifacts[1].file_size is None
        call_endpoint_mock.assert_called_once_with(ANY, REGISTRY_LIST_ARTIFACTS_ENDPOINT)

    # errors from API are propagated through to cli response
    list_artifact_dir_bad_response_mock = mock.MagicMock()
    status_code = 404
    list_artifact_dir_bad_response_mock.status_code = status_code
    list_artifact_dir_bad_response_mock.text = "An error occurred"
    list_artifact_dir_bad_response_mock.raise_for_status.side_effect = _raise_for_status
    with mock.patch(
        DATABRICKS_MODEL_ARTIFACT_REPOSITORY + "._call_endpoint",
        return_value=list_artifact_dir_bad_response_mock,
    ) as call_endpoint_mock:
        with pytest.raises(
            MlflowException,
            match=r"API request to list files under path `` failed with status code 404. "
            "Response body: An error occurred",
        ):
            databricks_model_artifact_repo.list_artifacts("")
        call_endpoint_mock.assert_called_once_with(ANY, REGISTRY_LIST_ARTIFACTS_ENDPOINT)


def test_list_artifacts_for_single_file(databricks_model_artifact_repo):
    list_artifact_file_response_mock = mock.MagicMock()
    list_artifact_file_response_mock.status_code = 200
    list_artifact_file_json_mock = {
        "files": [{"path": "MLmodel", "is_dir": False, "file_size": 294}]
    }
    list_artifact_file_response_mock.text = json.dumps(list_artifact_file_json_mock)
    with mock.patch(
        DATABRICKS_MODEL_ARTIFACT_REPOSITORY + "._call_endpoint",
        return_value=list_artifact_file_response_mock,
    ):
        artifacts = databricks_model_artifact_repo.list_artifacts("MLmodel")
        assert len(artifacts) == 0


@pytest.mark.parametrize(
    ("remote_file_path", "local_path"),
    [
        ("test_file.txt", ""),
        ("test_file.txt", None),
        ("output/test_file", None),
    ],
)
def test_download_file(databricks_model_artifact_repo, remote_file_path, local_path):
    signed_uri_response_mock = mock.MagicMock()
    signed_uri_response_mock.status_code = 200
    signed_uri_mock = {
        "signed_uri": "https://my-amazing-signed-uri-to-rule-them-all.com/1234-numbers-yay-567",
        "headers": [{"name": "header_name", "value": "header_value"}],
    }
    expected_headers = {"header_name": "header_value"}
    signed_uri_response_mock.text = json.dumps(signed_uri_mock)
    with (
        mock.patch(
            DATABRICKS_MODEL_ARTIFACT_REPOSITORY + "._call_endpoint",
            return_value=signed_uri_response_mock,
        ) as call_endpoint_mock,
        mock.patch(
            DATABRICKS_MODEL_ARTIFACT_REPOSITORY_PACKAGE + ".download_file_using_http_uri",
            return_value=None,
        ) as download_mock,
    ):
        databricks_model_artifact_repo.download_artifacts(remote_file_path, local_path)
        call_endpoint_mock.assert_called_with(ANY, REGISTRY_ARTIFACT_PRESIGNED_URI_ENDPOINT)
        download_mock.assert_called_with(
            signed_uri_mock["signed_uri"],
            ANY,
            ANY,
            expected_headers,
        )


@pytest.mark.parametrize(
    ("remote_file_path"),
    [
        ("test_file.txt"),
        ("output/test_file"),
    ],
)
def test_parallelized_download_file_using_http_uri_success(
    databricks_model_artifact_repo, remote_file_path
):
    signed_uri_mock = {
        "signed_uri": "https://my-amazing-signed-uri-to-rule-them-all.com/1234-numbers-yay-567",
        "headers": [{"name": "header_name", "value": "header_value"}],
    }

    with (
        mock.patch(
            DATABRICKS_MODEL_ARTIFACT_REPOSITORY + ".list_artifacts",
            return_value=[
                FileInfo(remote_file_path, True, MLFLOW_MULTIPART_DOWNLOAD_CHUNK_SIZE.get() + 1)
            ],
        ),
        mock.patch(
            DATABRICKS_MODEL_ARTIFACT_REPOSITORY + "._get_signed_download_uri",
            return_value=(signed_uri_mock["signed_uri"], signed_uri_mock["headers"]),
        ),
        mock.patch(
            "mlflow.utils.databricks_utils.get_databricks_env_vars",
            return_value={},
        ),
        mock.patch(
            DATABRICKS_MODEL_ARTIFACT_REPOSITORY_PACKAGE
            + ".parallelized_download_file_using_http_uri",
            return_value={},
        ) as download_file_mock,
    ):
        databricks_model_artifact_repo._download_file(remote_file_path, "")
        download_file_mock.assert_called()


@pytest.mark.parametrize(
    ("remote_file_path"),
    [
        ("test_file.txt"),
        ("output/test_file"),
    ],
)
def test_parallelized_download_file_using_http_uri_with_error_downloads(
    databricks_model_artifact_repo, remote_file_path
):
    signed_uri_mock = {
        "signed_uri": "https://my-amazing-signed-uri-to-rule-them-all.com/1234-numbers-yay-567",
        "headers": [{"name": "header_name", "value": "header_value"}],
    }
    error_downloads = {_Chunk(1, 2, 3, "test"): Exception("Internal Server Error")}

    with (
        mock.patch(
            DATABRICKS_MODEL_ARTIFACT_REPOSITORY + ".list_artifacts",
            return_value=[
                FileInfo(remote_file_path, True, MLFLOW_MULTIPART_DOWNLOAD_CHUNK_SIZE.get() + 1)
            ],
        ),
        mock.patch(
            DATABRICKS_MODEL_ARTIFACT_REPOSITORY + "._get_signed_download_uri",
            return_value=(signed_uri_mock["signed_uri"], signed_uri_mock["headers"]),
        ),
        mock.patch(
            "mlflow.utils.databricks_utils.get_databricks_env_vars",
            return_value={},
        ),
        mock.patch(
            DATABRICKS_MODEL_ARTIFACT_REPOSITORY_PACKAGE
            + ".parallelized_download_file_using_http_uri",
            return_value=error_downloads,
        ),
        mock.patch(
            "mlflow.utils.file_utils.download_chunk", side_effect=Exception("Retry failed")
        ) as mock_download_chunk,
    ):
        with pytest.raises(MlflowException, match="Retry failed"):
            databricks_model_artifact_repo._download_file(remote_file_path, "")

        mock_download_chunk.assert_called_with(
            range_start=2,
            range_end=3,
            headers={"header_name": "header_value"},
            download_path="",
            http_uri="https://my-amazing-signed-uri-to-rule-them-all.com/1234-numbers-yay-567",
        )


@pytest.mark.parametrize(
    ("remote_file_path"),
    [
        ("test_file.txt"),
        ("output/test_file"),
    ],
)
def test_parallelized_download_file_using_http_uri_with_failed_downloads(
    databricks_model_artifact_repo, remote_file_path
):
    signed_uri_mock = {
        "signed_uri": "https://my-amazing-signed-uri-to-rule-them-all.com/1234-numbers-yay-567",
        "headers": [{"name": "header_name", "value": "header_value"}],
    }
    failed_downloads = {_Chunk(1, 2, 3, "test"): Exception("Internal Server Error")}

    with (
        mock.patch(
            DATABRICKS_MODEL_ARTIFACT_REPOSITORY + ".list_artifacts",
            return_value=[
                FileInfo(remote_file_path, True, MLFLOW_MULTIPART_DOWNLOAD_CHUNK_SIZE.get() + 1)
            ],
        ),
        mock.patch(
            DATABRICKS_MODEL_ARTIFACT_REPOSITORY + "._get_signed_download_uri",
            return_value=(signed_uri_mock["signed_uri"], signed_uri_mock["headers"]),
        ),
        mock.patch(
            "mlflow.utils.databricks_utils.get_databricks_env_vars",
            return_value={},
        ),
        mock.patch(
            DATABRICKS_MODEL_ARTIFACT_REPOSITORY_PACKAGE
            + ".parallelized_download_file_using_http_uri",
            return_value=failed_downloads,
        ),
        mock.patch(
            "mlflow.utils.file_utils.download_chunk",
            return_value=None,
        ) as download_chunk_mock,
    ):
        databricks_model_artifact_repo._download_file(remote_file_path, "")
        download_chunk_mock.assert_called()


def test_download_file_get_request_fail(databricks_model_artifact_repo):
    with mock.patch(DATABRICKS_MODEL_ARTIFACT_REPOSITORY + "._call_endpoint") as call_endpoint_mock:
        call_endpoint_mock.side_effect = MlflowException("MOCK ERROR")
        with pytest.raises(MlflowException, match=r".+"):
            databricks_model_artifact_repo.download_artifacts("Something")


def test_log_artifact_fail(databricks_model_artifact_repo):
    with pytest.raises(MlflowException, match="This repository does not support logging artifacts"):
        databricks_model_artifact_repo.log_artifact("Some file")


def test_log_artifacts_fail(databricks_model_artifact_repo):
    with pytest.raises(MlflowException, match="This repository does not support logging artifacts"):
        databricks_model_artifact_repo.log_artifacts("Some dir")


def test_delete_artifacts_fail(databricks_model_artifact_repo):
    with pytest.raises(
        NotImplementedError,
        match="This artifact repository does not support deleting artifacts",
    ):
        databricks_model_artifact_repo.delete_artifacts()


def test_empty_headers_with_presigned_url(databricks_model_artifact_repo):
    url = "https://test.com/1234"
    encoding = "utf-8"
    response = requests.Response()
    response._content = bytes(json.dumps({"signed_uri": url}), encoding)
    response.encoding = encoding
    with mock.patch(
        DATABRICKS_MODEL_ARTIFACT_REPOSITORY + "._call_endpoint",
        return_value=response,
    ) as call_endpoint_mock:
        ret_url, headers = databricks_model_artifact_repo._get_signed_download_uri("test_file.txt")
        call_endpoint_mock.assert_called_with(ANY, REGISTRY_ARTIFACT_PRESIGNED_URI_ENDPOINT)

        assert ret_url == url
        assert headers is None

        new_headers = databricks_model_artifact_repo._extract_headers_from_signed_url(headers)

        assert new_headers == {}
```

--------------------------------------------------------------------------------

---[FILE: test_databricks_run_artifact_repo.py]---
Location: mlflow-master/tests/store/artifact/test_databricks_run_artifact_repo.py

```python
from pathlib import Path
from unittest import mock

import pytest
from databricks.sdk.service.files import DirectoryEntry

from mlflow.entities.file_info import FileInfo
from mlflow.store.artifact.databricks_run_artifact_repo import DatabricksRunArtifactRepository


@pytest.fixture(autouse=True)
def set_fake_databricks_creds(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("DATABRICKS_HOST", "https://localhost:8080")
    monkeypatch.setenv("DATABRICKS_TOKEN", "token")


def test_log_artifact(tmp_path: Path):
    local_file = tmp_path / "local_file.txt"
    local_file.write_text("test content")
    mock_databricks_artifact_repo = mock.MagicMock()
    with (
        mock.patch(
            "mlflow.store.artifact.databricks_sdk_artifact_repo.DatabricksSdkArtifactRepository.files_api"
        ) as mock_files_api,
        mock.patch(
            "mlflow.store.artifact.databricks_tracking_artifact_repo.DatabricksArtifactRepository",
            return_value=mock_databricks_artifact_repo,
        ),
    ):
        repo = DatabricksRunArtifactRepository("dbfs:/databricks/mlflow-tracking/1/123")

        # Simulate success
        repo.log_artifact(str(local_file), "artifact_path")
        mock_files_api.upload.assert_called_once()

        # Simulate failure and fallback
        mock_files_api.upload.side_effect = RuntimeError("Upload failed")
        with pytest.raises(RuntimeError, match=r"^Upload failed$"):
            repo.databricks_sdk_repo.log_artifact(str(local_file), "artifact_path")

        repo.log_artifact(str(local_file), "artifact_path")
        mock_databricks_artifact_repo.log_artifact.assert_called_once()


def test_log_artifacts(tmp_path: Path):
    local_dir = tmp_path / "local_dir"
    local_dir.mkdir()
    (local_dir / "file1.txt").write_text("content1")
    (local_dir / "file2.txt").write_text("content2")
    mock_databricks_artifact_repo = mock.MagicMock()
    with (
        mock.patch(
            "mlflow.store.artifact.databricks_sdk_artifact_repo.DatabricksSdkArtifactRepository.files_api"
        ) as mock_files_api,
        mock.patch(
            "mlflow.store.artifact.databricks_tracking_artifact_repo.DatabricksArtifactRepository",
            return_value=mock_databricks_artifact_repo,
        ),
    ):
        repo = DatabricksRunArtifactRepository("dbfs:/databricks/mlflow-tracking/1/456")

        # Simulate success
        repo.log_artifacts(str(local_dir), "artifact_path")
        mock_files_api.upload.assert_called()

        # Simulate failure and fallback
        mock_files_api.upload.side_effect = RuntimeError("Upload failed")
        with pytest.raises(RuntimeError, match=r"^Upload failed$"):
            repo.databricks_sdk_repo.log_artifacts(str(local_dir), "artifact_path")

        mock_databricks_artifact_repo.log_artifact.side_effect = RuntimeError("Fallback failed")
        with pytest.raises(RuntimeError, match=r"^Fallback failed$"):
            repo.databricks_artifact_repo.log_artifact("test", "artifact_path")

        repo.log_artifacts(str(local_dir), "artifact_path")
        mock_databricks_artifact_repo.log_artifacts.assert_called_once()


def test_download_file(tmp_path: Path):
    local_file = tmp_path / "downloaded_file.txt"
    mock_databricks_artifact_repo = mock.MagicMock()
    with (
        mock.patch(
            "mlflow.store.artifact.databricks_sdk_artifact_repo.DatabricksSdkArtifactRepository.files_api"
        ) as mock_files_api,
        mock.patch(
            "mlflow.store.artifact.databricks_tracking_artifact_repo.DatabricksArtifactRepository"
        ) as mock_fallback_repo,
    ):
        mock_fallback_repo.return_value = mock_databricks_artifact_repo
        repo = DatabricksRunArtifactRepository("dbfs:/databricks/mlflow-tracking/1/789")

        # Simulate success
        mock_files_api.download.return_value.contents.read.side_effect = [b"test", b""]
        repo._download_file("remote_file_path", str(local_file))
        mock_files_api.download.assert_called_once()
        mock_databricks_artifact_repo._download_file.assert_not_called()

        # Simulate failure and fallback
        mock_files_api.download.side_effect = RuntimeError("Download failed")
        with pytest.raises(RuntimeError, match=r"^Download failed$"):
            repo.databricks_sdk_repo._download_file("remote_file_path", str(local_file))

        repo._download_file("remote_file_path", str(local_file))
        mock_databricks_artifact_repo._download_file.assert_called_once()


def test_list_artifacts():
    mock_databricks_artifact_repo = mock.MagicMock()
    with (
        mock.patch(
            "mlflow.store.artifact.databricks_sdk_artifact_repo.DatabricksSdkArtifactRepository.files_api"
        ) as mock_files_api,
        mock.patch(
            "mlflow.store.artifact.databricks_tracking_artifact_repo.DatabricksArtifactRepository",
            return_value=mock_databricks_artifact_repo,
        ),
    ):
        repo = DatabricksRunArtifactRepository("dbfs:/databricks/mlflow-tracking/1/123")

        # Simulate success with a non-empty list
        mock_files_api.list_directory_contents.return_value = [
            DirectoryEntry(path="artifact1", is_directory=False, file_size=123),
            DirectoryEntry(path="dir", is_directory=True),
        ]
        artifacts = repo.list_artifacts("artifact_path")
        mock_files_api.list_directory_contents.assert_called_once()
        assert len(artifacts) == 2

        # Simulate failure and fallback
        mock_files_api.list_directory_contents.side_effect = RuntimeError("List failed")
        with pytest.raises(RuntimeError, match=r"^List failed$"):
            repo.databricks_sdk_repo.list_artifacts("artifact_path")

        mock_databricks_artifact_repo.list_artifacts.return_value = [
            FileInfo(path="fallback_artifact", is_dir=False, file_size=456)
        ]
        artifacts = repo.list_artifacts("artifact_path")
        mock_databricks_artifact_repo.list_artifacts.assert_called_once()
        assert len(artifacts) == 1


@pytest.mark.parametrize(
    "valid_uri",
    [
        "dbfs:/databricks/mlflow-tracking/1/123",
        "dbfs:/databricks/mlflow-tracking/1/456/artifacts",
        "dbfs:/databricks/mlflow-tracking/1/789/artifacts/model",
    ],
)
def test_constructor_with_valid_uri(valid_uri: str):
    with (
        mock.patch(
            "mlflow.store.artifact.databricks_sdk_artifact_repo.DatabricksSdkArtifactRepository"
        ),
        mock.patch(
            "mlflow.store.artifact.databricks_tracking_artifact_repo.DatabricksArtifactRepository"
        ),
    ):
        repo = DatabricksRunArtifactRepository(valid_uri)
        assert repo is not None


@pytest.mark.parametrize(
    "invalid_uri",
    [
        "dbfs:/invalid/uri",
        "dbfs:/databricks/mlflow-tracking/1",
        "dbfs:/databricks/mlflow-tracking/1/logged_models/1",
    ],
)
def test_constructor_with_invalid_uri(invalid_uri: str):
    with pytest.raises(
        Exception,  # The exact exception type depends on the parent class
        match="Invalid artifact URI",
    ):
        DatabricksRunArtifactRepository(invalid_uri)


@pytest.mark.parametrize(
    ("uri", "expected_result"),
    [
        # Valid run URIs
        ("dbfs:/databricks/mlflow-tracking/1/123", True),
        ("dbfs:/databricks/mlflow-tracking/1/456/artifacts", True),
        ("dbfs:/databricks/mlflow-tracking/1/789/artifacts/model", True),
        # Invalid URIs
        ("dbfs:/databricks/mlflow-tracking/1", False),
        ("dbfs:/databricks/mlflow-tracking/1/logged_models/1", False),
        ("dbfs:/databricks/mlflow-tracking/1/tr-1", False),
        ("dbfs:/invalid/uri", False),
        ("s3://bucket/path", False),
    ],
)
def test_is_run_uri(uri: str, expected_result: bool):
    result = DatabricksRunArtifactRepository.is_run_uri(uri)
    assert result == expected_result


@pytest.mark.parametrize(
    ("uri", "expected_experiment_id", "expected_run_id", "expected_relative_path"),
    [
        ("dbfs:/databricks/mlflow-tracking/123/456", "123", "456", None),
        ("dbfs:/databricks/mlflow-tracking/123/456/artifacts", "123", "456", "/artifacts"),
    ],
)
def test_uri_parsing(
    uri: str,
    expected_experiment_id: str,
    expected_run_id: str,
    expected_relative_path: str | None,
):
    with (
        mock.patch(
            "mlflow.store.artifact.databricks_sdk_artifact_repo.DatabricksSdkArtifactRepository"
        ),
        mock.patch(
            "mlflow.store.artifact.databricks_tracking_artifact_repo.DatabricksArtifactRepository"
        ),
    ):
        repo = DatabricksRunArtifactRepository(uri)

        # Test that the regex pattern matches correctly
        match = repo._get_uri_regex().search(uri)
        assert match is not None
        assert match.group("experiment_id") == expected_experiment_id
        assert match.group("run_id") == expected_run_id
        assert match.group("relative_path") == expected_relative_path


@pytest.mark.parametrize(
    ("uri", "expected_root_path"),
    [
        (
            "dbfs:/databricks/mlflow-tracking/123/456",
            "/WorkspaceInternal/Mlflow/Artifacts/123/Runs/456",
        ),
        (
            "dbfs:/databricks/mlflow-tracking/123/456/artifacts",
            "/WorkspaceInternal/Mlflow/Artifacts/123/Runs/456/artifacts",
        ),
    ],
)
def test_build_root_path(uri: str, expected_root_path: str):
    with (
        mock.patch(
            "mlflow.store.artifact.databricks_sdk_artifact_repo.DatabricksSdkArtifactRepository"
        ),
        mock.patch(
            "mlflow.store.artifact.databricks_tracking_artifact_repo.DatabricksArtifactRepository"
        ),
    ):
        repo = DatabricksRunArtifactRepository(uri)

        # Test root path building
        match = repo._get_uri_regex().search(uri)
        if match.group("relative_path"):
            root_path = repo._build_root_path(
                match.group("experiment_id"), match, match.group("relative_path")
            )
        else:
            root_path = repo._build_root_path(match.group("experiment_id"), match, "")
        assert root_path == expected_root_path


def test_expected_uri_format():
    with (
        mock.patch(
            "mlflow.store.artifact.databricks_sdk_artifact_repo.DatabricksSdkArtifactRepository"
        ),
        mock.patch(
            "mlflow.store.artifact.databricks_tracking_artifact_repo.DatabricksArtifactRepository"
        ),
    ):
        repo = DatabricksRunArtifactRepository("dbfs:/databricks/mlflow-tracking/1/123")
        assert repo._get_expected_uri_format() == (
            "databricks/mlflow-tracking/<EXPERIMENT_ID>/<RUN_ID>"
        )
```

--------------------------------------------------------------------------------

````
