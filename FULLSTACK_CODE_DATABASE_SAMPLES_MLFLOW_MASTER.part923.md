---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 923
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 923 of 991)

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

---[FILE: test_presigned_url_artifact_repo.py]---
Location: mlflow-master/tests/store/artifact/test_presigned_url_artifact_repo.py

```python
import json
import os
import random
import string
from unittest import mock
from unittest.mock import ANY

import pytest
import requests

from mlflow.environment_variables import MLFLOW_MULTIPART_DOWNLOAD_CHUNK_SIZE
from mlflow.exceptions import RestException
from mlflow.protos.databricks_artifacts_pb2 import ArtifactCredentialInfo
from mlflow.protos.databricks_filesystem_service_pb2 import (
    CreateDownloadUrlRequest,
    CreateDownloadUrlResponse,
    CreateUploadUrlRequest,
    CreateUploadUrlResponse,
    DirectoryEntry,
    HttpHeader,
    ListDirectoryResponse,
)
from mlflow.store.artifact.artifact_repo import _retry_with_new_creds
from mlflow.store.artifact.presigned_url_artifact_repo import (
    DIRECTORIES_ENDPOINT,
    FILESYSTEM_METHOD_TO_INFO,
    PresignedUrlArtifactRepository,
)
from mlflow.utils.proto_json_utils import message_to_json

MODEL_NAME = "catalog.schema.model"
MODEL_VERSION = 1
MODEL_URI = "/Models/catalog/schema/model/1"
PRESIGNED_URL_ARTIFACT_REPOSITORY = "mlflow.store.artifact.presigned_url_artifact_repo"
_DATABRICKS_UC_SCHEME = "databricks-uc"


@pytest.fixture(autouse=True)
def run_around_tests():
    # mock this call to credentials for all tests in suite
    with mock.patch("mlflow.utils.databricks_utils.get_databricks_host_creds"):
        yield


def test_artifact_uri():
    artifact_repo = PresignedUrlArtifactRepository(_DATABRICKS_UC_SCHEME, MODEL_NAME, MODEL_VERSION)
    assert MODEL_URI == artifact_repo.artifact_uri


def mock_list_directory(*args, **kwargs):
    endpoint = kwargs["endpoint"]
    json_body = kwargs["json_body"]

    if endpoint == f"{DIRECTORIES_ENDPOINT}{MODEL_URI}/dir" and json_body == json.dumps(
        {"page_token": "some_token"}
    ):
        return ListDirectoryResponse(
            contents=[
                DirectoryEntry(is_directory=False, path=f"{MODEL_URI}/dir/file2", file_size=2)
            ]
        )
    elif endpoint == f"{DIRECTORIES_ENDPOINT}{MODEL_URI}/dir":
        return ListDirectoryResponse(
            contents=[
                DirectoryEntry(is_directory=False, path=f"{MODEL_URI}/dir/file1", file_size=1)
            ],
            next_page_token="some_token",
        )
    elif endpoint == f"{DIRECTORIES_ENDPOINT}{MODEL_URI}/":
        return ListDirectoryResponse(
            contents=[DirectoryEntry(is_directory=True, path=f"{MODEL_URI}/dir")],
        )
    else:
        raise ValueError(f"Unexpected endpoint: {endpoint}")


def test_list_artifact_pagination():
    artifact_repo = PresignedUrlArtifactRepository(_DATABRICKS_UC_SCHEME, MODEL_NAME, MODEL_VERSION)

    with mock.patch(
        f"{PRESIGNED_URL_ARTIFACT_REPOSITORY}.call_endpoint", side_effect=mock_list_directory
    ) as mock_list:
        resp = artifact_repo.list_artifacts()
        assert len(resp) == 1
        assert resp[0].path == "dir"
        assert resp[0].is_dir is True
        assert resp[0].file_size is None

        resp = artifact_repo.list_artifacts("dir")
        assert len(resp) == 2
        assert {r.path for r in resp} == {"dir/file1", "dir/file2"}
        assert {r.is_dir for r in resp} == {False}
        assert {r.file_size for r in resp} == {1, 2}

        assert mock_list.call_count == 3


def test_list_artifacts_failure():
    artifact_repo = PresignedUrlArtifactRepository(_DATABRICKS_UC_SCHEME, MODEL_NAME, MODEL_VERSION)
    remote_file_path = "some/remote/file/path"
    exc_code = "NOT_FOUND"
    exc_message = "The directory being accessed is not found."
    exc = RestException({"error_code": exc_code, "message": exc_message})
    with mock.patch(f"{PRESIGNED_URL_ARTIFACT_REPOSITORY}.call_endpoint", side_effect=exc):
        empty_infos = artifact_repo.list_artifacts(remote_file_path)
        assert len(empty_infos) == 0


def _make_presigned_url(remote_path):
    return f"presigned_url/{remote_path}"


def _make_headers(remote_path):
    return {f"path_header-{remote_path}": f"remote-path={remote_path}"}


def mock_create_download_url(*args, **kwargs):
    remote_path = json.loads(kwargs["json_body"])["path"]
    return CreateDownloadUrlResponse(
        url=_make_presigned_url(remote_path),
        headers=[
            HttpHeader(name=header, value=val) for header, val in _make_headers(remote_path).items()
        ],
    )


def test_get_read_credentials():
    remote_file_paths = ["file", "dir/file1", "dir/file2"]
    artifact_repo = PresignedUrlArtifactRepository(_DATABRICKS_UC_SCHEME, MODEL_NAME, MODEL_VERSION)

    download_url_endpoint = "/api/2.0/fs/create-download-url"

    with mock.patch(
        f"{PRESIGNED_URL_ARTIFACT_REPOSITORY}.call_endpoint", side_effect=mock_create_download_url
    ) as mock_call_endpoint:
        creds = artifact_repo._get_read_credential_infos(remote_file_paths)
        assert mock_call_endpoint.call_count == 3

        for remote_file_path in remote_file_paths:
            mock_call_endpoint.assert_any_call(
                host_creds=ANY,
                endpoint=f"{download_url_endpoint}",
                method="POST",
                json_body=message_to_json(
                    CreateDownloadUrlRequest(path=f"{MODEL_URI}/{remote_file_path}")
                ),
                response_proto=ANY,
            )

        assert {_make_presigned_url(f"{MODEL_URI}/{path}") for path in remote_file_paths} == {
            cred.signed_uri for cred in creds
        }
        expected_headers = {}
        for path in remote_file_paths:
            expected_headers.update(_make_headers(f"{MODEL_URI}/{path}"))
        actual_headers = {}
        for cred in creds:
            actual_headers.update({header.name: header.value for header in cred.headers})
        assert expected_headers == actual_headers


def mock_create_upload_url(*args, **kwargs):
    remote_path = json.loads(kwargs["json_body"])["path"]
    return CreateUploadUrlResponse(
        url=_make_presigned_url(remote_path),
        headers=[
            HttpHeader(name=header, value=val) for header, val in _make_headers(remote_path).items()
        ],
    )


def test_get_write_credentials():
    remote_file_paths = ["file", "dir/file1", "dir/file2"]
    artifact_repo = PresignedUrlArtifactRepository(_DATABRICKS_UC_SCHEME, MODEL_NAME, MODEL_VERSION)

    upload_url_endpoint = "/api/2.0/fs/create-upload-url"

    with mock.patch(
        f"{PRESIGNED_URL_ARTIFACT_REPOSITORY}.call_endpoint", side_effect=mock_create_upload_url
    ) as mock_call_endpoint:
        creds = artifact_repo._get_write_credential_infos(remote_file_paths)
        assert mock_call_endpoint.call_count == 3
        for remote_file_path in remote_file_paths:
            mock_call_endpoint.assert_any_call(
                host_creds=ANY,
                endpoint=f"{upload_url_endpoint}",
                method="POST",
                json_body=message_to_json(
                    CreateUploadUrlRequest(path=f"{MODEL_URI}/{remote_file_path}")
                ),
                response_proto=ANY,
            )

        expected_headers = {}
        for path in remote_file_paths:
            expected_headers.update(_make_headers(f"{MODEL_URI}/{path}"))
        actual_headers = {}
        for cred in creds:
            actual_headers.update({header.name: header.value for header in cred.headers})
        assert expected_headers == actual_headers


def test_download_from_cloud():
    artifact_repo = PresignedUrlArtifactRepository(_DATABRICKS_UC_SCHEME, MODEL_NAME, MODEL_VERSION)
    remote_file_path = "some/remote/file/path"
    with (
        mock.patch(
            f"{PRESIGNED_URL_ARTIFACT_REPOSITORY}.PresignedUrlArtifactRepository._get_download_presigned_url_and_headers",
            return_value=CreateDownloadUrlResponse(
                url=_make_presigned_url(remote_file_path),
                headers=[
                    HttpHeader(name=k, value=v) for k, v in _make_headers(remote_file_path).items()
                ],
            ),
        ) as mock_request,
        mock.patch(
            f"{PRESIGNED_URL_ARTIFACT_REPOSITORY}.download_file_using_http_uri"
        ) as mock_download,
    ):
        local_file = "local_file"
        artifact_repo._download_from_cloud(remote_file_path, local_file)

        mock_request.assert_called_once_with(remote_file_path)
        mock_download.assert_called_once_with(
            http_uri=_make_presigned_url(remote_file_path),
            download_path=local_file,
            chunk_size=MLFLOW_MULTIPART_DOWNLOAD_CHUNK_SIZE.get(),
            headers=_make_headers(remote_file_path),
        )


def test_download_from_cloud_fail():
    artifact_repo = PresignedUrlArtifactRepository(_DATABRICKS_UC_SCHEME, MODEL_NAME, MODEL_VERSION)
    remote_file_path = "some/remote/file/path"
    endpoint, _ = FILESYSTEM_METHOD_TO_INFO[CreateDownloadUrlRequest]
    exc_code = "ENDPOINT_NOT_FOUND"
    exc_message = f"Endpoint not found for {endpoint.lstrip('api')}."
    exc = RestException({"error_code": exc_code, "message": exc_message})
    with (
        mock.patch(f"{PRESIGNED_URL_ARTIFACT_REPOSITORY}.call_endpoint", side_effect=exc),
        pytest.raises(RestException) as exc_info,  # noqa: PT011
    ):
        artifact_repo._download_from_cloud(remote_file_path, "local_file")

    assert exc_info.value.error_code == exc_code
    assert str(exc_info.value) == f"{exc_code}: {exc_message}"


def test_log_artifact():
    artifact_repo = PresignedUrlArtifactRepository(_DATABRICKS_UC_SCHEME, MODEL_NAME, MODEL_VERSION)
    local_file = "local_file"
    artifact_path = "remote/file/location"
    total_remote_path = f"{artifact_path}/{os.path.basename(local_file)}"
    creds = ArtifactCredentialInfo(
        signed_uri=_make_presigned_url(total_remote_path),
        headers=[
            ArtifactCredentialInfo.HttpHeader(name=k, value=v)
            for k, v in _make_headers(total_remote_path).items()
        ],
    )
    with (
        mock.patch(
            f"{PRESIGNED_URL_ARTIFACT_REPOSITORY}.PresignedUrlArtifactRepository._get_write_credential_infos",
            return_value=[creds],
        ) as mock_request,
        mock.patch(
            f"{PRESIGNED_URL_ARTIFACT_REPOSITORY}.PresignedUrlArtifactRepository._upload_to_cloud",
            return_value=None,
        ) as mock_upload,
    ):
        artifact_repo.log_artifact(local_file, artifact_path)
        mock_request.assert_called_once_with(remote_file_paths=[total_remote_path])
        mock_upload.assert_called_once_with(
            cloud_credential_info=creds,
            src_file_path=local_file,
            artifact_file_path=total_remote_path,
        )


def test_upload_to_cloud(tmp_path):
    artifact_repo = PresignedUrlArtifactRepository(_DATABRICKS_UC_SCHEME, MODEL_NAME, MODEL_VERSION)
    local_file = os.path.join(tmp_path, "file.txt")
    content = "content"
    with open(local_file, "w") as f:
        f.write(content)
    remote_file_path = "some/remote/file/path"
    resp = mock.create_autospec(requests.Response, return_value=None)
    with (
        mock.patch(
            f"{PRESIGNED_URL_ARTIFACT_REPOSITORY}.cloud_storage_http_request", return_value=resp
        ) as mock_cloud,
        mock.patch(
            f"{PRESIGNED_URL_ARTIFACT_REPOSITORY}.augmented_raise_for_status"
        ) as mock_status,
    ):
        cred_info = ArtifactCredentialInfo(
            signed_uri=_make_presigned_url(remote_file_path),
            headers=[
                ArtifactCredentialInfo.HttpHeader(name=k, value=v)
                for k, v in _make_headers(remote_file_path).items()
            ],
        )
        artifact_repo._upload_to_cloud(cred_info, local_file, "some/irrelevant/path")
        mock_cloud.assert_called_once_with(
            "put",
            _make_presigned_url(remote_file_path),
            data=bytearray(content, "utf-8"),
            headers=_make_headers(remote_file_path),
        )
        mock_status.assert_called_once_with(resp.__enter__())


def test_upload_to_cloud_fail():
    artifact_repo = PresignedUrlArtifactRepository(_DATABRICKS_UC_SCHEME, MODEL_NAME, MODEL_VERSION)
    remote_file_path = "some/remote/file/path"
    endpoint, _ = FILESYSTEM_METHOD_TO_INFO[CreateUploadUrlRequest]
    exc_code = "ENDPOINT_NOT_FOUND"
    exc_message = f"Endpoint not found for {endpoint.lstrip('api')}."
    exc = RestException({"error_code": exc_code, "message": exc_message})
    with (
        mock.patch(f"{PRESIGNED_URL_ARTIFACT_REPOSITORY}.call_endpoint", side_effect=exc),
        pytest.raises(RestException) as exc_info,  # noqa: PT011
    ):
        artifact_repo._download_from_cloud(remote_file_path, "local_file")

    assert exc_info.value.error_code == exc_code
    assert str(exc_info.value) == f"{exc_code}: {exc_message}"


@pytest.mark.parametrize("throw", [True, False])
@pytest.mark.parametrize("use_og_creds", [True, False])
@pytest.mark.parametrize("status_code", [401, 403])
def test_retry_refresh_creds_no_creds(throw, use_og_creds, status_code):
    credentials = "og_creds"
    called = False

    def creds_func():
        nonlocal credentials
        credentials = "".join(random.choices(string.ascii_lowercase, k=10))
        return credentials

    def try_func(creds):
        nonlocal called, credentials
        assert creds == credentials
        resp = requests.Response()
        resp.status_code = status_code
        if throw and not called:
            called = True
            raise requests.HTTPError(response=resp)

    mock_creds = mock.Mock(side_effect=creds_func)
    mock_func = mock.Mock(side_effect=try_func)
    if use_og_creds:
        _retry_with_new_creds(try_func=mock_func, creds_func=mock_creds, orig_creds=credentials)
    else:
        _retry_with_new_creds(try_func=mock_func, creds_func=mock_creds)

    if throw:
        assert mock_func.call_count == 2
        assert mock_creds.call_count == 1 if use_og_creds else 2
    else:
        assert mock_func.call_count == 1
        assert mock_creds.call_count == 0 if use_og_creds else 1
```

--------------------------------------------------------------------------------

---[FILE: test_r2_artifact_repo.py]---
Location: mlflow-master/tests/store/artifact/test_r2_artifact_repo.py

```python
import posixpath
from unittest import mock
from unittest.mock import ANY

import pytest

from mlflow.store.artifact.artifact_repository_registry import get_artifact_repository
from mlflow.store.artifact.s3_artifact_repo import _cached_get_s3_client

from tests.helper_functions import set_boto_credentials  # noqa: F401


@pytest.fixture
def r2_artifact_root():
    return "r2://mock-r2-bucket@account.r2.cloudflarestorage.com"


@pytest.fixture(autouse=True)
def reset_cached_get_s3_client():
    _cached_get_s3_client.cache_clear()


def test_parse_r2_uri(r2_artifact_root):
    with mock.patch("boto3.client") as _:
        artifact_uri = posixpath.join(r2_artifact_root, "some/path")
        repo = get_artifact_repository(artifact_uri)
        parsed_bucket, parsed_path = repo.parse_s3_compliant_uri(artifact_uri)
        assert parsed_bucket == "mock-r2-bucket"
        assert parsed_path == "some/path"


def test_s3_client_config_set_correctly(r2_artifact_root):
    with mock.patch(
        "mlflow.store.artifact.r2_artifact_repo.R2ArtifactRepository._get_region_name"
    ) as mock_method:
        mock_method.return_value = None

        artifact_uri = posixpath.join(r2_artifact_root, "some/path")
        repo = get_artifact_repository(artifact_uri)

        s3_client = repo._get_s3_client()
        assert s3_client.meta.config.s3.get("addressing_style") == "virtual"


def test_convert_r2_uri_to_s3_endpoint_url(r2_artifact_root):
    with mock.patch("boto3.client") as _:
        artifact_uri = posixpath.join(r2_artifact_root, "some/path")
        repo = get_artifact_repository(artifact_uri)

        s3_endpoint_url = repo.convert_r2_uri_to_s3_endpoint_url(r2_artifact_root)
        assert s3_endpoint_url == "https://account.r2.cloudflarestorage.com"


def test_s3_endpoint_url_is_used_to_get_s3_client(r2_artifact_root):
    with mock.patch("boto3.client") as mock_get_s3_client:
        artifact_uri = posixpath.join(r2_artifact_root, "some/path")
        repo = get_artifact_repository(artifact_uri)
        repo._get_s3_client()
        mock_get_s3_client.assert_called_with(
            "s3",
            config=ANY,
            endpoint_url="https://account.r2.cloudflarestorage.com",
            verify=None,
            aws_access_key_id=None,
            aws_secret_access_key=None,
            aws_session_token=None,
            region_name=ANY,
        )


def test_get_r2_client_region_name_set_correctly(r2_artifact_root):
    region_name = "us_random_region_42"
    with mock.patch("boto3.client") as mock_get_s3_client:
        s3_client_mock = mock.Mock()
        mock_get_s3_client.return_value = s3_client_mock
        s3_client_mock.get_bucket_location.return_value = {"LocationConstraint": region_name}

        artifact_uri = posixpath.join(r2_artifact_root, "some/path")
        repo = get_artifact_repository(artifact_uri)
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
```

--------------------------------------------------------------------------------

---[FILE: test_runs_artifact_repo.py]---
Location: mlflow-master/tests/store/artifact/test_runs_artifact_repo.py

```python
from unittest import mock
from unittest.mock import Mock

import pytest

import mlflow
from mlflow.exceptions import MlflowException
from mlflow.store.artifact.runs_artifact_repo import RunsArtifactRepository
from mlflow.store.artifact.s3_artifact_repo import S3ArtifactRepository


@pytest.mark.parametrize(
    ("uri", "expected_run_id", "expected_artifact_path"),
    [
        ("runs:/1234abcdf1394asdfwer33/path/to/model", "1234abcdf1394asdfwer33", "path/to/model"),
        ("runs:/1234abcdf1394asdfwer33/path/to/model/", "1234abcdf1394asdfwer33", "path/to/model/"),
        ("runs://profile@databricks/1234abcdf1394asdfwer33/path", "1234abcdf1394asdfwer33", "path"),
        ("runs:/1234abcdf1394asdfwer33", "1234abcdf1394asdfwer33", None),
        ("runs:/1234abcdf1394asdfwer33/", "1234abcdf1394asdfwer33", None),
        ("runs:///1234abcdf1394asdfwer33/", "1234abcdf1394asdfwer33", None),
        ("runs://profile@databricks/1234abcdf1394asdfwer33/", "1234abcdf1394asdfwer33", None),
    ],
)
def test_parse_runs_uri_valid_input(uri, expected_run_id, expected_artifact_path):
    (run_id, artifact_path) = RunsArtifactRepository.parse_runs_uri(uri)
    assert run_id == expected_run_id
    assert artifact_path == expected_artifact_path


@pytest.mark.parametrize(
    "uri",
    [
        "notruns:/1234abcdf1394asdfwer33/",  # wrong scheme
        "runs:/",  # no run id
        "runs:1234abcdf1394asdfwer33/",  # missing slash
        "runs://1234abcdf1394asdfwer33/",  # hostnames are not yet supported
    ],
)
def test_parse_runs_uri_invalid_input(uri):
    with pytest.raises(MlflowException, match="Not a proper runs"):
        RunsArtifactRepository.parse_runs_uri(uri)


@pytest.mark.parametrize(
    ("uri", "expected_tracking_uri", "mock_uri", "expected_result_uri"),
    [
        ("runs:/1234abcdf1394asdfwer33/path/model", None, "s3:/some/path", "s3:/some/path"),
        ("runs:/1234abcdf1394asdfwer33/path/model", None, "dbfs:/some/path", "dbfs:/some/path"),
        (
            "runs://profile@databricks/1234abcdf1394asdfwer33/path/model",
            "databricks://profile",
            "s3:/some/path",
            "s3:/some/path",
        ),
        (
            "runs://profile@databricks/1234abcdf1394asdfwer33/path/model",
            "databricks://profile",
            "dbfs:/some/path",
            "dbfs://profile@databricks/some/path",
        ),
        (
            "runs://scope:key@databricks/1234abcdf1394asdfwer33/path/model",
            "databricks://scope:key",
            "dbfs:/some/path",
            "dbfs://scope:key@databricks/some/path",
        ),
    ],
)
def test_get_artifact_uri(uri, expected_tracking_uri, mock_uri, expected_result_uri):
    with mock.patch(
        "mlflow.tracking.artifact_utils.get_artifact_uri", return_value=mock_uri
    ) as get_artifact_uri_mock:
        result_uri = RunsArtifactRepository.get_underlying_uri(uri)
        get_artifact_uri_mock.assert_called_once_with(
            run_id="1234abcdf1394asdfwer33",
            artifact_path="path/model",
            tracking_uri=expected_tracking_uri,
        )
        assert result_uri == expected_result_uri


def test_runs_artifact_repo_init_with_real_run():
    artifact_location = "s3://blah_bucket/"
    experiment_id = mlflow.create_experiment("expr_abc", artifact_location)
    with mlflow.start_run(experiment_id=experiment_id):
        run_id = mlflow.active_run().info.run_id
    runs_uri = f"runs:/{run_id}/path/to/model"
    runs_repo = RunsArtifactRepository(runs_uri)

    assert runs_repo.artifact_uri == runs_uri
    assert isinstance(runs_repo.repo, S3ArtifactRepository)
    expected_absolute_uri = f"{artifact_location}{run_id}/artifacts/path/to/model"
    assert runs_repo.repo.artifact_uri == expected_absolute_uri


def test_runs_artifact_repo_uses_repo_download_artifacts():
    """
    The RunsArtifactRepo should delegate `download_artifacts` to it's self.repo.download_artifacts
    function
    """
    artifact_location = "s3://blah_bucket/"
    experiment_id = mlflow.create_experiment("expr_abcd", artifact_location)
    with mlflow.start_run(experiment_id=experiment_id):
        run_id = mlflow.active_run().info.run_id
    runs_repo = RunsArtifactRepository(f"runs:/{run_id}")
    runs_repo.repo = Mock()
    runs_repo.download_artifacts("artifact_path", "dst_path")
    runs_repo.repo.download_artifacts.assert_called_once()


def test_runs_artifact_repo_tracking_uri_passed_as_keyword():
    """
    Test that tracking_uri is passed as keyword argument to get_artifact_repository.
    This verifies the fix for issue #16873 where tracking_uri was incorrectly passed
    as a positional argument, causing it to be interpreted as access_key_id in S3.
    """
    with mock.patch(
        "mlflow.tracking.artifact_utils.get_artifact_uri",
        return_value="s3://test-bucket/some-run-id/artifacts/path/to/model",
    ) as mock_get_artifact_uri:
        runs_repo = RunsArtifactRepository(
            artifact_uri="runs:/some-run-id/path/to/model",
            tracking_uri="http://test-tracking-server:5000",
        )
        assert isinstance(runs_repo.repo, S3ArtifactRepository)
        mock_get_artifact_uri.assert_called_once()
```

--------------------------------------------------------------------------------

````
