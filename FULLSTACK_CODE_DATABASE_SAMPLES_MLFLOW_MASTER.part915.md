---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 915
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 915 of 991)

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

---[FILE: test_trace_correlation.py]---
Location: mlflow-master/tests/store/analytics/test_trace_correlation.py

```python
import math

import pytest

from mlflow.store.analytics.trace_correlation import (
    calculate_npmi_from_counts,
    calculate_smoothed_npmi,
)


@pytest.mark.parametrize(
    (
        "joint_count",
        "filter1_count",
        "filter2_count",
        "total_count",
        "expected_npmi",
        "expected_smoothed_range",
    ),
    [
        (10, 10, 10, 100, 1.0, (0.95, 1.0)),
        (0, 20, 30, 100, -1.0, None),
        (10, 20, 50, 100, 0.0, None),
        (100, 100, 100, 100, 1.0, None),
    ],
    ids=["perfect_positive", "perfect_negative", "independence", "all_match_both"],
)
def test_npmi_correlations(
    joint_count, filter1_count, filter2_count, total_count, expected_npmi, expected_smoothed_range
):
    result = calculate_npmi_from_counts(joint_count, filter1_count, filter2_count, total_count)

    if expected_npmi == 0.0:
        assert abs(result.npmi) < 0.01
    else:
        assert result.npmi == expected_npmi

    if expected_smoothed_range:
        assert expected_smoothed_range[0] < result.npmi_smoothed <= expected_smoothed_range[1]


@pytest.mark.parametrize(
    ("joint_count", "filter1_count", "filter2_count", "total_count"),
    [
        (0, 0, 10, 100),
        (0, 10, 0, 100),
        (0, 0, 0, 100),
        (0, 0, 0, 0),
        (50, 30, 40, 100),
    ],
    ids=["zero_filter1", "zero_filter2", "both_zero", "empty_dataset", "inconsistent"],
)
def test_npmi_undefined_cases(joint_count, filter1_count, filter2_count, total_count):
    result = calculate_npmi_from_counts(joint_count, filter1_count, filter2_count, total_count)
    assert math.isnan(result.npmi)


def test_npmi_partial_overlap():
    result = calculate_npmi_from_counts(
        joint_count=15, filter1_count=40, filter2_count=30, total_count=100
    )
    assert 0 < result.npmi < 1
    assert 0.1 < result.npmi < 0.2


def test_npmi_with_smoothing():
    result = calculate_npmi_from_counts(
        joint_count=0, filter1_count=2, filter2_count=3, total_count=10
    )
    assert result.npmi == -1.0
    assert result.npmi_smoothed is not None
    assert -1.0 < result.npmi_smoothed < 0

    npmi_smooth = calculate_smoothed_npmi(
        joint_count=0, filter1_count=2, filter2_count=3, total_count=10
    )
    assert -1.0 < npmi_smooth < 0


def test_npmi_all_traces_match_both():
    result = calculate_npmi_from_counts(
        joint_count=100, filter1_count=100, filter2_count=100, total_count=100
    )
    assert result.npmi == 1.0


@pytest.mark.parametrize(
    ("joint_count", "filter1_count", "filter2_count", "total_count"),
    [
        (50, 50, 50, 100),
        (1, 2, 3, 100),
        (99, 99, 99, 100),
        (25, 50, 75, 100),
    ],
    ids=["half_match", "small_counts", "near_all", "quarter_match"],
)
def test_npmi_clamping(joint_count, filter1_count, filter2_count, total_count):
    result = calculate_npmi_from_counts(joint_count, filter1_count, filter2_count, total_count)
    if not math.isnan(result.npmi):
        assert -1.0 <= result.npmi <= 1.0


def test_both_npmi_values_returned():
    result = calculate_npmi_from_counts(
        joint_count=0, filter1_count=10, filter2_count=15, total_count=100
    )

    assert result.npmi == -1.0
    assert result.npmi_smoothed is not None
    assert -1.0 < result.npmi_smoothed < 0

    result2 = calculate_npmi_from_counts(
        joint_count=5, filter1_count=10, filter2_count=15, total_count=100
    )

    assert result2.npmi > 0
    assert result2.npmi_smoothed > 0
    assert abs(result2.npmi - result2.npmi_smoothed) > 0.001


def test_symmetry():
    result_ab = calculate_npmi_from_counts(15, 30, 40, 100)
    result_reversed = calculate_npmi_from_counts(15, 40, 30, 100)
    assert abs(result_ab.npmi - result_reversed.npmi) < 1e-10


def test_monotonicity_joint_count():
    npmis = []
    for joint in range(0, 21):
        result = calculate_npmi_from_counts(joint, 30, 40, 100)
        npmis.append(result.npmi)

    for i in range(1, len(npmis)):
        if not math.isnan(npmis[i]) and not math.isnan(npmis[i - 1]):
            assert npmis[i] >= npmis[i - 1]


@pytest.mark.parametrize(
    ("joint_count", "filter1_count", "filter2_count", "total_count", "expected_range"),
    [
        (30, 30, 50, 100, (0.5, 1.0)),
        (1, 30, 50, 100, (-0.7, -0.5)),
    ],
    ids=["high_overlap", "low_overlap"],
)
def test_boundary_values(joint_count, filter1_count, filter2_count, total_count, expected_range):
    result = calculate_npmi_from_counts(joint_count, filter1_count, filter2_count, total_count)
    assert expected_range[0] < result.npmi < expected_range[1]
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/tests/store/analytics/__init__.py

```python
# Analytics store tests
```

--------------------------------------------------------------------------------

---[FILE: constants.py]---
Location: mlflow-master/tests/store/artifact/constants.py

```python
MODELS_ARTIFACT_REPOSITORY_PACKAGE = "mlflow.store.artifact.models_artifact_repo"
MODELS_ARTIFACT_REPOSITORY = MODELS_ARTIFACT_REPOSITORY_PACKAGE + ".ModelsArtifactRepository"
WORKSPACE_MODELS_ARTIFACT_REPOSITORY = (
    f"{MODELS_ARTIFACT_REPOSITORY_PACKAGE}.DatabricksModelsArtifactRepository"
)
UC_MODELS_ARTIFACT_REPOSITORY = (
    f"{MODELS_ARTIFACT_REPOSITORY_PACKAGE}.UnityCatalogModelsArtifactRepository"
)

UC_OSS_MODELS_ARTIFACT_REPOSITORY = (
    f"{MODELS_ARTIFACT_REPOSITORY_PACKAGE}.UnityCatalogOSSModelsArtifactRepository"
)
```

--------------------------------------------------------------------------------

---[FILE: test_artifact_repo.py]---
Location: mlflow-master/tests/store/artifact/test_artifact_repo.py

```python
import logging
import posixpath
import time
from unittest import mock

import pytest

from mlflow.entities import FileInfo
from mlflow.exceptions import MlflowException
from mlflow.store.artifact.artifact_repo import ArtifactRepository
from mlflow.utils.file_utils import TempDir

from tests.utils.test_logging_utils import logger, reset_logging_level  # noqa F401

_MOCK_ERROR = "MOCK ERROR"
_MODEL_FILE = "modelfile"
_MODEL_DIR = "model"
_PARENT_DIR = "12345"
_PARENT_MODEL_DIR = _PARENT_DIR + "/" + _MODEL_DIR
_PARENT_MODEL_FILE = _PARENT_MODEL_DIR + "/" + _MODEL_FILE
_EMPTY_DIR = "emptydir"
_DUMMY_FILE_SIZE = 123
_EMPTY_FILE_SIZE = 0


class ArtifactRepositoryImpl(ArtifactRepository):
    def log_artifact(self, local_file, artifact_path=None):
        raise NotImplementedError()

    def log_artifacts(self, local_dir, artifact_path=None):
        raise NotImplementedError()

    def list_artifacts(self, path):
        raise NotImplementedError()

    def _download_file(self, remote_file_path, local_path):
        assert remote_file_path.endswith(_MODEL_FILE)


class SlowArtifactRepositoryImpl(ArtifactRepository):
    """Implementation of ArtifactRepository which simulates large artifact download."""

    def log_artifact(self, local_file, artifact_path=None):
        raise NotImplementedError()

    def log_artifacts(self, local_dir, artifact_path=None):
        raise NotImplementedError()

    def list_artifacts(self, path):
        raise NotImplementedError()

    def _download_file(self, remote_file_path, local_path):
        # Sleep in order to simulate a longer-running asynchronous download
        time.sleep(2)
        assert remote_file_path.endswith(_MODEL_FILE)


class FailureArtifactRepositoryImpl(ArtifactRepository):
    """Implementation of ArtifactRepository which simulates download failures."""

    def log_artifact(self, local_file, artifact_path=None):
        raise NotImplementedError()

    def log_artifacts(self, local_dir, artifact_path=None):
        raise NotImplementedError()

    def list_artifacts(self, path):
        raise NotImplementedError()

    def _download_file(self, remote_file_path, local_path):
        raise MlflowException(_MOCK_ERROR)


@pytest.mark.parametrize(
    ("base_uri", "download_arg", "list_return_val"),
    [
        (_PARENT_MODEL_DIR, "", [_MODEL_FILE]),
        (_PARENT_MODEL_DIR, "", [".", _MODEL_FILE]),
        (_PARENT_DIR, _MODEL_DIR, [_MODEL_DIR + "/" + _MODEL_FILE]),
        (_PARENT_DIR, _MODEL_DIR, [_MODEL_DIR, _MODEL_DIR + "/" + _MODEL_FILE]),
        ("", _PARENT_MODEL_DIR, [_PARENT_MODEL_FILE]),
        ("", _PARENT_MODEL_DIR, [_PARENT_MODEL_DIR, _PARENT_MODEL_FILE]),
    ],
)
def test_download_artifacts_does_not_infinitely_loop(base_uri, download_arg, list_return_val):
    def list_artifacts(path):
        fullpath = posixpath.join(base_uri, path)
        if fullpath.endswith(_MODEL_DIR) or fullpath.endswith(_MODEL_DIR + "/"):
            return [FileInfo(item, False, _DUMMY_FILE_SIZE) for item in list_return_val]
        elif fullpath.endswith(_PARENT_MODEL_DIR) or fullpath.endswith(_PARENT_MODEL_DIR + "/"):
            return [FileInfo(posixpath.join(path, _MODEL_DIR), True, _EMPTY_FILE_SIZE)]
        else:
            return []

    with mock.patch.object(ArtifactRepositoryImpl, "list_artifacts") as list_artifacts_mock:
        list_artifacts_mock.side_effect = list_artifacts
        repo = ArtifactRepositoryImpl(base_uri)
        repo.download_artifacts(download_arg)


def test_download_artifacts_download_file():
    with mock.patch.object(ArtifactRepositoryImpl, "list_artifacts", return_value=[]):
        repo = ArtifactRepositoryImpl(_PARENT_DIR)
        repo.download_artifacts(_MODEL_FILE)


def test_download_artifacts_dst_path_does_not_exist(tmp_path):
    repo = ArtifactRepositoryImpl(_PARENT_DIR)
    dst_path = tmp_path.joinpath("does_not_exist")
    with pytest.raises(
        MlflowException, match="The destination path for downloaded artifacts does not exist"
    ):
        repo.download_artifacts(_MODEL_DIR, dst_path)


def test_download_artifacts_dst_path_is_file(tmp_path):
    repo = ArtifactRepositoryImpl(_PARENT_DIR)
    dst_path = tmp_path.joinpath("file")
    dst_path.touch()
    with pytest.raises(
        MlflowException, match="The destination path for downloaded artifacts must be a directory"
    ):
        repo.download_artifacts(_MODEL_DIR, dst_path)


@pytest.mark.parametrize(
    ("base_uri", "download_arg", "list_return_val"),
    [
        (
            "",
            _PARENT_MODEL_DIR,
            [_PARENT_MODEL_DIR, _PARENT_MODEL_FILE, _PARENT_MODEL_DIR + "/" + _EMPTY_DIR],
        )
    ],
)
def test_download_artifacts_handles_empty_dir(base_uri, download_arg, list_return_val):
    def list_artifacts(path):
        if path.endswith(_MODEL_DIR):
            return [
                FileInfo(item, item.endswith(_EMPTY_DIR), _DUMMY_FILE_SIZE)
                for item in list_return_val
            ]
        elif path.endswith(_PARENT_DIR) or path.endswith(_PARENT_DIR + "/"):
            return [FileInfo(_PARENT_MODEL_DIR, True, _EMPTY_FILE_SIZE)]
        else:
            return []

    with mock.patch.object(ArtifactRepositoryImpl, "list_artifacts") as list_artifacts_mock:
        list_artifacts_mock.side_effect = list_artifacts
        repo = ArtifactRepositoryImpl(base_uri)
        with TempDir() as tmp:
            repo.download_artifacts(download_arg, dst_path=tmp.path())


@pytest.mark.parametrize(
    ("base_uri", "download_arg", "list_return_val"),
    [
        (_PARENT_MODEL_DIR, "", [_MODEL_FILE]),
        (_PARENT_MODEL_DIR, "", [".", _MODEL_FILE]),
        (_PARENT_DIR, _MODEL_DIR, [_MODEL_DIR + "/" + _MODEL_FILE]),
        (_PARENT_DIR, _MODEL_DIR, [_MODEL_DIR, _MODEL_DIR + "/" + _MODEL_FILE]),
        ("", _PARENT_MODEL_DIR, [_PARENT_MODEL_FILE]),
        ("", _PARENT_MODEL_DIR, [_PARENT_MODEL_DIR, _PARENT_MODEL_FILE]),
    ],
)
def test_download_artifacts_awaits_download_completion(base_uri, download_arg, list_return_val):
    """
    Verifies that all asynchronous artifact downloads are joined before `download_artifacts()`
    returns a result to the caller
    """

    def list_artifacts(path):
        fullpath = posixpath.join(base_uri, path)
        if fullpath.endswith(_MODEL_DIR) or fullpath.endswith(_MODEL_DIR + "/"):
            return [FileInfo(item, False, _DUMMY_FILE_SIZE) for item in list_return_val]
        elif fullpath.endswith(_PARENT_MODEL_DIR) or fullpath.endswith(_PARENT_MODEL_DIR + "/"):
            return [FileInfo(posixpath.join(path, _MODEL_DIR), True, _EMPTY_FILE_SIZE)]
        else:
            return []

    with mock.patch.object(SlowArtifactRepositoryImpl, "list_artifacts") as list_artifacts_mock:
        list_artifacts_mock.side_effect = list_artifacts
        repo = SlowArtifactRepositoryImpl(base_uri)
        repo.download_artifacts(download_arg)


@pytest.mark.parametrize(
    ("base_uri", "download_arg", "list_return_val"),
    [
        (_PARENT_MODEL_DIR, "", [_MODEL_FILE]),
    ],
)
def test_download_artifacts_provides_failure_info(base_uri, download_arg, list_return_val):
    def list_artifacts(path):
        fullpath = posixpath.join(base_uri, path)
        if fullpath.endswith(_MODEL_DIR) or fullpath.endswith(_MODEL_DIR + "/"):
            return [FileInfo(item, False, _DUMMY_FILE_SIZE) for item in list_return_val]
        else:
            return []

    with mock.patch.object(FailureArtifactRepositoryImpl, "list_artifacts") as list_artifacts_mock:
        list_artifacts_mock.side_effect = list_artifacts
        repo = FailureArtifactRepositoryImpl(base_uri)
        match = r"The following failures occurred while downloading one or more artifacts."
        with pytest.raises(MlflowException, match=match) as exc:
            repo.download_artifacts(download_arg)

        err_msg = str(exc.value)
        assert _MODEL_FILE in err_msg
        assert _MOCK_ERROR in err_msg


@pytest.mark.parametrize("debug", [True, False])
def test_download_artifacts_provides_traceback_info(debug, reset_logging_level):
    if debug:
        logger.setLevel(logging.DEBUG)
    else:
        logger.setLevel(logging.INFO)

    def list_artifacts(path):
        fullpath = posixpath.join(_PARENT_MODEL_DIR, path)
        if fullpath.endswith(_MODEL_DIR) or fullpath.endswith(_MODEL_DIR + "/"):
            return [FileInfo(item, False, _DUMMY_FILE_SIZE) for item in [_MODEL_FILE]]
        else:
            return []

    with mock.patch.object(FailureArtifactRepositoryImpl, "list_artifacts") as list_artifacts_mock:
        list_artifacts_mock.side_effect = list_artifacts
        repo = FailureArtifactRepositoryImpl(_PARENT_MODEL_DIR)
        try:
            repo.download_artifacts("")
        except MlflowException as exc:
            err_msg = str(exc.message)
            if debug:
                assert "Traceback" in err_msg
            else:
                assert "Traceback" not in err_msg
```

--------------------------------------------------------------------------------

---[FILE: test_artifact_repository_registry.py]---
Location: mlflow-master/tests/store/artifact/test_artifact_repository_registry.py

```python
from importlib import reload
from unittest import mock

import pytest

import mlflow
from mlflow.store.artifact import artifact_repository_registry
from mlflow.store.artifact.artifact_repository_registry import ArtifactRepositoryRegistry


def test_standard_artifact_registry():
    mock_entrypoint = mock.Mock()
    mock_entrypoint.name = "mock-scheme"

    with mock.patch("mlflow.utils.plugins._get_entry_points", return_value=[mock_entrypoint]):
        # Entrypoints are registered at import time, so we need to reload the
        # module to register the entrypoint given by the mocked
        # entrypoints.get_group_all
        reload(artifact_repository_registry)

        expected_artifact_repository_registry = {
            "",
            "s3",
            "gs",
            "wasbs",
            "ftp",
            "sftp",
            "dbfs",
            "mock-scheme",
        }

    assert expected_artifact_repository_registry.issubset(
        artifact_repository_registry._artifact_repository_registry._registry.keys()
    )


def test_plugin_registration_via_installed_package():
    reload(artifact_repository_registry)

    assert "file-plugin" in artifact_repository_registry._artifact_repository_registry._registry

    from mlflow_test_plugin.local_artifact import PluginLocalArtifactRepository

    test_uri = "file-plugin:test-path"

    plugin_repo = artifact_repository_registry.get_artifact_repository(test_uri)

    assert isinstance(plugin_repo, PluginLocalArtifactRepository)
    assert plugin_repo.is_plugin


def test_plugin_registration():
    artifact_repository_registry = ArtifactRepositoryRegistry()

    mock_plugin = mock.Mock()
    artifact_repository_registry.register("mock-scheme", mock_plugin)
    assert "mock-scheme" in artifact_repository_registry._registry
    repository_instance = artifact_repository_registry.get_artifact_repository(
        artifact_uri="mock-scheme://fake-host/fake-path"
    )
    assert repository_instance == mock_plugin.return_value

    mock_plugin.assert_called_once_with(
        "mock-scheme://fake-host/fake-path", tracking_uri=None, registry_uri=None
    )


def test_get_unknown_scheme():
    artifact_repository_registry = ArtifactRepositoryRegistry()

    with pytest.raises(
        mlflow.exceptions.MlflowException, match="Could not find a registered artifact repository"
    ):
        artifact_repository_registry.get_artifact_repository("unknown-scheme://")


def test_plugin_registration_via_entrypoints():
    mock_plugin_function = mock.Mock()
    mock_entrypoint = mock.Mock(load=mock.Mock(return_value=mock_plugin_function))
    mock_entrypoint.name = "mock-scheme"

    with mock.patch(
        "mlflow.utils.plugins._get_entry_points", return_value=[mock_entrypoint]
    ) as mock_get_group_all:
        artifact_repository_registry = ArtifactRepositoryRegistry()
        artifact_repository_registry.register_entrypoints()

    assert (
        artifact_repository_registry.get_artifact_repository("mock-scheme://fake-host/fake-path")
        == mock_plugin_function.return_value
    )

    mock_plugin_function.assert_called_once_with(
        "mock-scheme://fake-host/fake-path", tracking_uri=None, registry_uri=None
    )
    mock_get_group_all.assert_called_once_with("mlflow.artifact_repository")


@pytest.mark.parametrize(
    "exception", [AttributeError("test exception"), ImportError("test exception")]
)
def test_plugin_registration_failure_via_entrypoints(exception):
    mock_entrypoint = mock.Mock(load=mock.Mock(side_effect=exception))
    mock_entrypoint.name = "mock-scheme"

    with mock.patch(
        "mlflow.utils.plugins._get_entry_points", return_value=[mock_entrypoint]
    ) as mock_get_group_all:
        repo_registry = ArtifactRepositoryRegistry()

        # Check that the raised warning contains the message from the original exception
        with pytest.warns(UserWarning, match="test exception"):
            repo_registry.register_entrypoints()

    mock_entrypoint.load.assert_called_once()
    mock_get_group_all.assert_called_once_with("mlflow.artifact_repository")
```

--------------------------------------------------------------------------------

---[FILE: test_azure_blob_artifact_repo.py]---
Location: mlflow-master/tests/store/artifact/test_azure_blob_artifact_repo.py

```python
import base64
import json
import os
import posixpath
from unittest import mock

import pytest
from azure.core.exceptions import ResourceNotFoundError
from azure.storage.blob import BlobPrefix, BlobProperties, BlobServiceClient

from mlflow.entities.multipart_upload import MultipartUploadPart
from mlflow.exceptions import MlflowException, MlflowTraceDataCorrupted
from mlflow.store.artifact.artifact_repo import try_read_trace_data
from mlflow.store.artifact.artifact_repository_registry import get_artifact_repository
from mlflow.store.artifact.azure_blob_artifact_repo import AzureBlobArtifactRepository

TEST_ROOT_PATH = "some/path"
TEST_BLOB_CONTAINER_ROOT = "wasbs://container@account.blob.core.windows.net/"
TEST_URI = os.path.join(TEST_BLOB_CONTAINER_ROOT, TEST_ROOT_PATH)


class MockBlobList:
    def __init__(self, items, next_marker=None):
        self.items = items
        self.next_marker = next_marker

    def __iter__(self):
        return iter(self.items)


@pytest.fixture
def mock_client():
    # Make sure that our environment variable aren't set to actually access Azure
    old_access_key = os.environ.get("AZURE_STORAGE_ACCESS_KEY")
    if old_access_key is not None:
        del os.environ["AZURE_STORAGE_ACCESS_KEY"]
    old_conn_string = os.environ.get("AZURE_STORAGE_CONNECTION_STRING")
    if old_conn_string is not None:
        del os.environ["AZURE_STORAGE_CONNECTION_STRING"]

    yield mock.MagicMock(autospec=BlobServiceClient)

    if old_access_key is not None:
        os.environ["AZURE_STORAGE_ACCESS_KEY"] = old_access_key
    if old_conn_string is not None:
        os.environ["AZURE_STORAGE_CONNECTION_STRING"] = old_conn_string


def test_artifact_uri_factory(mock_client, monkeypatch):
    # We pass in the mock_client here to clear Azure environment variables, but we don't use it;
    # We do need to set up a fake access key for the code to run though
    monkeypatch.setenv("AZURE_STORAGE", "")
    repo = get_artifact_repository(TEST_URI)
    assert isinstance(repo, AzureBlobArtifactRepository)


def test_default_az_cred_if_no_env_vars(mock_client):
    # We pass in the mock_client here to clear Azure environment variables, but we don't use it
    with mock.patch("azure.identity.DefaultAzureCredential") as mock_default_azure_credential:
        AzureBlobArtifactRepository(TEST_URI)
        assert mock_default_azure_credential.call_count == 1


def test_parse_global_wasbs_uri():
    parse = AzureBlobArtifactRepository.parse_wasbs_uri
    global_api_suffix = "blob.core.windows.net"

    global_wasb_with_short_path = "wasbs://cont@acct.blob.core.windows.net/path"
    assert parse(global_wasb_with_short_path) == ("cont", "acct", "path", global_api_suffix)

    global_wasb_without_path = "wasbs://cont@acct.blob.core.windows.net"
    assert parse(global_wasb_without_path) == ("cont", "acct", "", global_api_suffix)

    global_wasb_without_path2 = "wasbs://cont@acct.blob.core.windows.net/"
    assert parse(global_wasb_without_path2) == ("cont", "acct", "", global_api_suffix)

    global_wasb_with_multi_path = "wasbs://cont@acct.blob.core.windows.net/a/b"
    assert parse(global_wasb_with_multi_path) == ("cont", "acct", "a/b", global_api_suffix)

    with pytest.raises(Exception, match="WASBS URI must be of the form"):
        parse("wasbs://cont@acct.blob.core.evil.net/path")
    with pytest.raises(Exception, match="WASBS URI must be of the form"):
        parse("wasbs://cont@acct/path")
    with pytest.raises(Exception, match="WASBS URI must be of the form"):
        parse("wasbs://acct.blob.core.windows.net/path")
    with pytest.raises(Exception, match="WASBS URI must be of the form"):
        parse("wasbs://@acct.blob.core.windows.net/path")
    with pytest.raises(Exception, match="WASBS URI must be of the form"):
        parse("wasbs://cont@acctxblob.core.windows.net/path")
    with pytest.raises(Exception, match="Not a WASBS URI"):
        parse("wasb://cont@acct.blob.core.windows.net/path")


def test_parse_cn_wasbs_uri():
    parse = AzureBlobArtifactRepository.parse_wasbs_uri
    cn_api_suffix = "blob.core.chinacloudapi.cn"

    cn_wasb_with_short_path = "wasbs://cont@acct.blob.core.chinacloudapi.cn/path"
    assert parse(cn_wasb_with_short_path) == ("cont", "acct", "path", cn_api_suffix)

    cn_wasb_without_path = "wasbs://cont@acct.blob.core.chinacloudapi.cn"
    assert parse(cn_wasb_without_path) == ("cont", "acct", "", cn_api_suffix)

    cn_wasb_without_path2 = "wasbs://cont@acct.blob.core.chinacloudapi.cn/"
    assert parse(cn_wasb_without_path2) == ("cont", "acct", "", cn_api_suffix)

    cn_wasb_with_multi_path = "wasbs://cont@acct.blob.core.chinacloudapi.cn/a/b"
    assert parse(cn_wasb_with_multi_path) == ("cont", "acct", "a/b", cn_api_suffix)

    with pytest.raises(Exception, match="WASBS URI must be of the form"):
        parse("wasbs://cont@acct.blob.core.evil.cn/path")
    with pytest.raises(Exception, match="WASBS URI must be of the form"):
        parse("wasbs://cont@acct/path")
    with pytest.raises(Exception, match="WASBS URI must be of the form"):
        parse("wasbs://acct.blob.core.chinacloudapi.cn/path")
    with pytest.raises(Exception, match="WASBS URI must be of the form"):
        parse("wasbs://@acct.blob.core.chinacloudapi.cn/path")
    with pytest.raises(Exception, match="WASBS URI must be of the form"):
        parse("wasbs://cont@acctxblob.core.chinacloudapi.cn/path")
    with pytest.raises(Exception, match="Not a WASBS URI"):
        parse("wasb://cont@acct.blob.core.chinacloudapi.cn/path")


def test_list_artifacts_empty(mock_client):
    repo = AzureBlobArtifactRepository(TEST_URI, client=mock_client)
    mock_client.get_container_client().walk_blobs.return_value = MockBlobList([])
    assert repo.list_artifacts() == []


def test_list_artifacts_single_file(mock_client):
    repo = AzureBlobArtifactRepository(TEST_URI, client=mock_client)

    # Evaluate single file
    blob_props = BlobProperties()
    blob_props.name = posixpath.join(TEST_ROOT_PATH, "file")
    mock_client.get_container_client().walk_blobs.return_value = MockBlobList([blob_props])
    assert repo.list_artifacts("file") == []


@pytest.mark.parametrize("root_path", ["some/path", "some/path/"])
def test_list_artifacts(mock_client, root_path):
    repo = AzureBlobArtifactRepository(
        posixpath.join(TEST_BLOB_CONTAINER_ROOT, root_path), client=mock_client
    )

    # Create some files to return
    dir_prefix = BlobPrefix()
    dir_prefix.name = posixpath.join(TEST_ROOT_PATH, "dir")

    blob_props = BlobProperties()
    blob_props.size = 42
    blob_props.name = posixpath.join(TEST_ROOT_PATH, "file")

    mock_client.get_container_client().walk_blobs.return_value = MockBlobList(
        [dir_prefix, blob_props]
    )

    artifacts = repo.list_artifacts()
    mock_client.get_container_client().walk_blobs.assert_called_with(name_starts_with="some/path/")
    assert artifacts[0].path == "dir"
    assert artifacts[0].is_dir is True
    assert artifacts[0].file_size is None
    assert artifacts[1].path == "file"
    assert artifacts[1].is_dir is False
    assert artifacts[1].file_size == 42


def test_log_artifact(mock_client, tmp_path):
    repo = AzureBlobArtifactRepository(TEST_URI, client=mock_client)

    d = tmp_path.joinpath("data")
    d.mkdir()
    f = d.joinpath("test.txt")
    f.write_text("hello world!")
    fpath = posixpath.join(str(d), "test.txt")

    repo.log_artifact(fpath)

    mock_client.get_container_client.assert_called_with("container")
    arg1, arg2 = mock_client.get_container_client().upload_blob.call_args[0]
    assert arg1 == posixpath.join(TEST_ROOT_PATH, "test.txt")
    # arg2 should be a filebuffer
    assert arg2.name == fpath


def test_log_artifacts(mock_client, tmp_path):
    repo = AzureBlobArtifactRepository(TEST_URI, client=mock_client)

    parentd = tmp_path.joinpath("data")
    parentd.mkdir()
    subd = parentd.joinpath("subdir")
    subd.mkdir()
    a_txt = parentd.joinpath("a.txt")
    a_txt.write_text("A")
    b_txt = subd.joinpath("b.txt")
    b_txt.write_text("B")
    c_txt = subd.joinpath("c.txt")
    c_txt.write_text("C")

    repo.log_artifacts(parentd)

    mock_client.get_container_client.assert_called_with("container")
    call_list = mock_client.get_container_client().upload_blob.call_args_list

    # Ensure that the order of the calls do not matter
    for call in call_list:
        arg1, arg2 = call[0]
        assert arg1 in [
            posixpath.join(TEST_ROOT_PATH, x) for x in ["a.txt", "subdir/b.txt", "subdir/c.txt"]
        ]
        # arg2 should be a filebuffer
        if arg1.endswith("/a.txt"):
            assert arg2.name == str(a_txt)
        elif arg1.endswith("/b.txt"):
            assert arg2.name == str(b_txt)
        elif arg1.endswith("/c.txt"):
            assert arg2.name == str(c_txt)
        else:
            # This should be unreachable
            assert False


def test_download_file_artifact(mock_client, tmp_path):
    repo = AzureBlobArtifactRepository(TEST_URI, client=mock_client)

    mock_client.get_container_client().walk_blobs.return_value = MockBlobList([])

    def create_file(buffer):
        local_path = os.path.basename(buffer.name)
        f = tmp_path.joinpath(local_path)
        f.write_text("hello world!")

    mock_client.get_container_client().download_blob().readinto.side_effect = create_file

    repo.download_artifacts("test.txt")
    assert os.path.exists(os.path.join(tmp_path, "test.txt"))
    mock_client.get_container_client().download_blob.assert_called_with(
        posixpath.join(TEST_ROOT_PATH, "test.txt")
    )


def test_download_directory_artifact_succeeds_when_artifact_root_is_not_blob_container_root(
    mock_client, tmp_path
):
    assert TEST_URI is not TEST_BLOB_CONTAINER_ROOT
    repo = AzureBlobArtifactRepository(TEST_URI, client=mock_client)

    file_path_1 = "file_1"
    file_path_2 = "file_2"

    blob_props_1 = BlobProperties()
    blob_props_1.size = 42
    blob_props_1.name = posixpath.join(TEST_ROOT_PATH, file_path_1)

    blob_props_2 = BlobProperties()
    blob_props_2.size = 42
    blob_props_2.name = posixpath.join(TEST_ROOT_PATH, file_path_2)

    def get_mock_listing(*args, **kwargs):
        """
        Produces a mock listing that only contains content if the
        specified prefix is the artifact root. This allows us to mock
        `list_artifacts` during the `_download_artifacts_into` subroutine
        without recursively listing the same artifacts at every level of the
        directory traversal.
        """

        if posixpath.abspath(kwargs["name_starts_with"]) == posixpath.abspath(TEST_ROOT_PATH):
            return MockBlobList([blob_props_1, blob_props_2])
        else:
            return MockBlobList([])

    def create_file(buffer):
        fname = os.path.basename(buffer.name)
        f = tmp_path.joinpath(fname)
        f.write_text("hello world!")

    mock_client.get_container_client().walk_blobs.side_effect = get_mock_listing
    mock_client.get_container_client().download_blob().readinto.side_effect = create_file

    # Ensure that the root directory can be downloaded successfully
    repo.download_artifacts("")
    # Ensure that the `mkfile` side effect copied all of the download artifacts into `tmpdir`
    dir_contents = os.listdir(tmp_path)
    assert file_path_1 in dir_contents
    assert file_path_2 in dir_contents


def test_download_directory_artifact_succeeds_when_artifact_root_is_blob_container_root(
    mock_client, tmp_path
):
    repo = AzureBlobArtifactRepository(TEST_BLOB_CONTAINER_ROOT, client=mock_client)

    subdir_path = "my_directory"
    dir_prefix = BlobPrefix()
    dir_prefix.name = subdir_path

    file_path_1 = "file_1"
    file_path_2 = "file_2"

    blob_props_1 = BlobProperties()
    blob_props_1.size = 42
    blob_props_1.name = posixpath.join(subdir_path, file_path_1)

    blob_props_2 = BlobProperties()
    blob_props_2.size = 42
    blob_props_2.name = posixpath.join(subdir_path, file_path_2)

    def get_mock_listing(*args, **kwargs):
        """
        Produces a mock listing that only contains content if the specified prefix is the artifact
        root or a relevant subdirectory. This allows us to mock `list_artifacts` during the
        `_download_artifacts_into` subroutine without recursively listing the same artifacts at
        every level of the directory traversal.
        """

        if posixpath.abspath(kwargs["name_starts_with"]) == "/":
            return MockBlobList([dir_prefix])
        if posixpath.abspath(kwargs["name_starts_with"]) == posixpath.abspath(subdir_path):
            return MockBlobList([blob_props_1, blob_props_2])
        else:
            return MockBlobList([])

    def create_file(buffer):
        fname = os.path.basename(buffer.name)
        f = tmp_path.joinpath(fname)
        f.write_text("hello world!")

    mock_client.get_container_client().walk_blobs.side_effect = get_mock_listing
    mock_client.get_container_client().download_blob().readinto.side_effect = create_file

    # Ensure that the root directory can be downloaded successfully
    repo.download_artifacts("")
    # Ensure that the `mkfile` side effect copied all of the download artifacts into `tmpdir`
    dir_contents = os.listdir(tmp_path)
    assert file_path_1 in dir_contents
    assert file_path_2 in dir_contents


def test_download_artifact_throws_value_error_when_listed_blobs_do_not_contain_artifact_root_prefix(
    mock_client,
):
    repo = AzureBlobArtifactRepository(TEST_URI, client=mock_client)

    # Create a "bad blob" with a name that is not prefixed by the root path of the artifact store
    bad_blob_props = BlobProperties()
    bad_blob_props.size = 42
    bad_blob_props.name = "file_path"

    def get_mock_listing(*args, **kwargs):
        """
        Produces a mock listing that only contains content if the
        specified prefix is the artifact root. This allows us to mock
        `list_artifacts` during the `_download_artifacts_into` subroutine
        without recursively listing the same artifacts at every level of the
        directory traversal.
        """

        if posixpath.abspath(kwargs["name_starts_with"]) == posixpath.abspath(TEST_ROOT_PATH):
            # Return a blob that is not prefixed by the root path of the artifact store. This
            # should result in an exception being raised
            return MockBlobList([bad_blob_props])
        else:
            return MockBlobList([])

    mock_client.get_container_client().walk_blobs.side_effect = get_mock_listing

    with pytest.raises(
        MlflowException, match="Azure blob does not begin with the specified artifact path"
    ):
        repo.download_artifacts("")


def test_create_multipart_upload(mock_client):
    repo = AzureBlobArtifactRepository(TEST_URI, client=mock_client)

    mock_client.url = "some-url"
    mock_client.account_name = "some-account"
    mock_client.credential.account_key = base64.b64encode(b"some-key").decode("utf-8")

    create = repo.create_multipart_upload("local_file")
    assert create.upload_id is None
    assert len(create.credentials) == 1
    assert create.credentials[0].url.startswith(
        "some-url/container/some/path/local_file?comp=block"
    )


def test_complete_multipart_upload(mock_client, tmp_path):
    repo = AzureBlobArtifactRepository(TEST_URI, client=mock_client)

    parts = [
        MultipartUploadPart(1, "", "some-url?comp=block&blockid=YQ%3D%3D%3D%3D"),
        MultipartUploadPart(2, "", "some-url?comp=block&blockid=Yg%3D%3D%3D%3D"),
    ]
    repo.complete_multipart_upload("local_file", "", parts)
    mock_client.get_blob_client.assert_called_with("container", f"{TEST_ROOT_PATH}/local_file")
    mock_client.get_blob_client().commit_block_list.assert_called_with(["a", "b"])


def test_trace_data(mock_client, tmp_path):
    repo = AzureBlobArtifactRepository(TEST_URI, client=mock_client)
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


def test_delete_artifacts_single_file(mock_client):
    repo = AzureBlobArtifactRepository(TEST_URI, client=mock_client)

    # Mock the list_blobs method to return a single file
    blob_props = BlobProperties()
    blob_props.name = posixpath.join(TEST_ROOT_PATH, "file")
    mock_client.get_container_client().list_blobs.return_value = [blob_props]

    repo.delete_artifacts("file")

    mock_client.get_container_client().delete_blob.assert_called_with(blob_props.name)


def test_delete_artifacts_directory(mock_client):
    repo = AzureBlobArtifactRepository(TEST_URI, client=mock_client)

    # Mock the list_blobs method to return multiple files in a directory
    blob_props_1 = BlobProperties()
    blob_props_1.name = posixpath.join(TEST_ROOT_PATH, "dir/file1")
    blob_props_2 = BlobProperties()
    blob_props_2.name = posixpath.join(TEST_ROOT_PATH, "dir/file2")
    mock_client.get_container_client().list_blobs.return_value = [blob_props_1, blob_props_2]

    repo.delete_artifacts("dir")

    mock_client.get_container_client().delete_blob.assert_any_call(blob_props_1.name)
    mock_client.get_container_client().delete_blob.assert_any_call(blob_props_2.name)


def test_delete_artifacts_nonexistent_path(mock_client):
    repo = AzureBlobArtifactRepository(TEST_URI, client=mock_client)

    # Mock the list_blobs method to return an empty list
    mock_client.get_container_client().list_blobs.return_value = []

    with pytest.raises(MlflowException, match="No such file or directory"):
        repo.delete_artifacts("nonexistent_path")


def test_delete_artifacts_failure(mock_client):
    repo = AzureBlobArtifactRepository(TEST_URI, client=mock_client)

    # Mock the list_blobs method to return a single file
    blob_props = BlobProperties()
    blob_props.name = posixpath.join(TEST_ROOT_PATH, "file")
    mock_client.get_container_client().list_blobs.return_value = [blob_props]

    # Mock the delete_blob method to raise an exception
    mock_client.get_container_client().delete_blob.side_effect = ResourceNotFoundError(
        "Deletion failed"
    )

    with pytest.raises(MlflowException, match=f"No such file or directory: '{blob_props.name}'"):
        repo.delete_artifacts("file")


def test_delete_artifacts_folder(mock_client):
    repo = AzureBlobArtifactRepository(TEST_URI, client=mock_client)

    # Mock the list_blobs method to return multiple files in a folder
    blob_props_1 = BlobProperties()
    blob_props_1.name = posixpath.join(TEST_ROOT_PATH, "folder/file1")
    blob_props_2 = BlobProperties()
    blob_props_2.name = posixpath.join(TEST_ROOT_PATH, "folder/file2")
    mock_client.get_container_client().list_blobs.return_value = [blob_props_1, blob_props_2]

    repo.delete_artifacts("folder")

    mock_client.get_container_client().delete_blob.assert_any_call(blob_props_1.name)
    mock_client.get_container_client().delete_blob.assert_any_call(blob_props_2.name)


def test_delete_artifacts_folder_with_nested_folders_and_files(mock_client):
    repo = AzureBlobArtifactRepository(TEST_URI, client=mock_client)

    # Mock the list_blobs method to return multiple files in a folder with nested folders and files
    blob_props_1 = BlobProperties()
    blob_props_1.name = posixpath.join(TEST_ROOT_PATH, "folder/nested_folder/file1")
    blob_props_2 = BlobProperties()
    blob_props_2.name = posixpath.join(TEST_ROOT_PATH, "folder/nested_folder/file2")
    blob_props_3 = BlobProperties()
    blob_props_3.name = posixpath.join(TEST_ROOT_PATH, "folder/nested_folder/nested_file")
    mock_client.get_container_client().list_blobs.return_value = [
        blob_props_1,
        blob_props_2,
        blob_props_3,
    ]

    repo.delete_artifacts("folder")

    mock_client.get_container_client().delete_blob.assert_any_call(blob_props_1.name)
    mock_client.get_container_client().delete_blob.assert_any_call(blob_props_2.name)
    mock_client.get_container_client().delete_blob.assert_any_call(blob_props_3.name)
```

--------------------------------------------------------------------------------

````
