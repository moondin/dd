---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 924
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 924 of 991)

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

---[FILE: test_s3_artifact_repo.py]---
Location: mlflow-master/tests/store/artifact/test_s3_artifact_repo.py

```python
import json
import os
import posixpath
import tarfile
from datetime import datetime, timezone
from unittest import mock
from unittest.mock import ANY

import botocore.exceptions
import pytest
import requests

from mlflow.entities.multipart_upload import MultipartUploadPart
from mlflow.exceptions import MlflowException, MlflowTraceDataCorrupted
from mlflow.store.artifact.artifact_repository_registry import get_artifact_repository
from mlflow.store.artifact.optimized_s3_artifact_repo import OptimizedS3ArtifactRepository
from mlflow.store.artifact.s3_artifact_repo import (
    _MAX_CACHE_SECONDS,
    S3ArtifactRepository,
    _cached_get_s3_client,
)

from tests.helper_functions import set_boto_credentials  # noqa: F401


@pytest.fixture
def s3_artifact_root(mock_s3_bucket):
    return f"s3://{mock_s3_bucket}"


@pytest.fixture(params=[True, False])
def s3_artifact_repo(s3_artifact_root, request):
    if request.param:
        return OptimizedS3ArtifactRepository(posixpath.join(s3_artifact_root, "some/path"))
    return S3ArtifactRepository(posixpath.join(s3_artifact_root, "some/path"))


@pytest.fixture(autouse=True)
def reset_cached_get_s3_client():
    _cached_get_s3_client.cache_clear()


def teardown_function():
    if "MLFLOW_S3_UPLOAD_EXTRA_ARGS" in os.environ:
        del os.environ["MLFLOW_S3_UPLOAD_EXTRA_ARGS"]


def test_file_artifact_is_logged_and_downloaded_successfully(s3_artifact_repo, tmp_path):
    file_name = "test.txt"
    file_path = os.path.join(tmp_path, file_name)
    file_text = "Hello world!"

    with open(file_path, "w") as f:
        f.write(file_text)

    s3_artifact_repo.log_artifact(file_path)
    with open(s3_artifact_repo.download_artifacts(file_name)) as f:
        assert f.read() == file_text


def test_file_artifact_is_logged_with_content_metadata(
    s3_artifact_repo, s3_artifact_root, tmp_path
):
    file_name = "test.txt"
    file_path = os.path.join(tmp_path, file_name)
    file_text = "Hello world!"

    with open(file_path, "w") as f:
        f.write(file_text)

    s3_artifact_repo.log_artifact(file_path)

    bucket, _ = s3_artifact_repo.parse_s3_compliant_uri(s3_artifact_root)
    s3_client = s3_artifact_repo._get_s3_client()
    response = s3_client.head_object(Bucket=bucket, Key="some/path/test.txt")
    assert response.get("ContentType") == "text/plain"
    assert response.get("ContentEncoding") == "aws-chunked"


def test_get_s3_client_hits_cache(s3_artifact_root, monkeypatch):
    repo = get_artifact_repository(posixpath.join(s3_artifact_root, "some/path"))
    repo._get_s3_client()
    cache_info = _cached_get_s3_client.cache_info()
    assert cache_info.hits == 0
    assert cache_info.misses == 1
    assert cache_info.currsize == 1

    repo._get_s3_client()
    cache_info = _cached_get_s3_client.cache_info()
    assert cache_info.hits == 1
    assert cache_info.misses == 1
    assert cache_info.currsize == 1

    monkeypatch.setenv("MLFLOW_EXPERIMENTAL_S3_SIGNATURE_VERSION", "s3v2")
    repo._get_s3_client()
    cache_info = _cached_get_s3_client.cache_info()
    assert cache_info.hits == 1
    assert cache_info.misses == 2
    assert cache_info.currsize == 2

    with mock.patch(
        "mlflow.store.artifact.s3_artifact_repo._get_utcnow_timestamp",
        return_value=datetime.now(timezone.utc).timestamp() + _MAX_CACHE_SECONDS,
    ):
        repo._get_s3_client()
    cache_info = _cached_get_s3_client.cache_info()
    assert cache_info.hits == 1
    assert cache_info.misses == 3
    assert cache_info.currsize == 3


@pytest.mark.parametrize(
    ("ignore_tls_env", "verify"), [("0", None), ("1", False), ("true", False), ("false", None)]
)
def test_get_s3_client_verify_param_set_correctly(
    s3_artifact_root, ignore_tls_env, verify, monkeypatch
):
    monkeypatch.setenv("MLFLOW_S3_IGNORE_TLS", ignore_tls_env)
    with mock.patch("boto3.client") as mock_get_s3_client:
        repo = get_artifact_repository(posixpath.join(s3_artifact_root, "some/path"))
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


def test_s3_client_config_set_correctly(s3_artifact_root):
    repo = get_artifact_repository(posixpath.join(s3_artifact_root, "some/path"))
    s3_client = repo._get_s3_client()
    assert s3_client.meta.config.s3.get("addressing_style") == "auto"


def test_s3_creds_passed_to_client(s3_artifact_root):
    with mock.patch("boto3.client") as mock_get_s3_client:
        repo = S3ArtifactRepository(
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


def test_file_artifacts_are_logged_with_content_metadata_in_batch(
    s3_artifact_repo, s3_artifact_root, tmp_path
):
    subdir = tmp_path / "subdir"
    subdir.mkdir()
    subdir_path = str(subdir)
    nested_path = os.path.join(subdir_path, "nested")
    os.makedirs(nested_path)
    path_a = os.path.join(subdir_path, "a.txt")
    path_b = os.path.join(subdir_path, "b.tar.gz")
    path_c = os.path.join(nested_path, "c.csv")

    with open(path_a, "w") as f:
        f.write("A")
    with tarfile.open(path_b, "w:gz") as f:
        f.add(path_a)
    with open(path_c, "w") as f:
        f.write("col1,col2\n1,3\n2,4\n")

    s3_artifact_repo.log_artifacts(subdir_path)

    bucket, _ = s3_artifact_repo.parse_s3_compliant_uri(s3_artifact_root)
    s3_client = s3_artifact_repo._get_s3_client()

    response_a = s3_client.head_object(Bucket=bucket, Key="some/path/a.txt")
    assert response_a.get("ContentType") == "text/plain"
    assert response_a.get("ContentEncoding") == "aws-chunked"

    response_b = s3_client.head_object(Bucket=bucket, Key="some/path/b.tar.gz")
    assert response_b.get("ContentType") == "application/x-tar"
    assert response_b.get("ContentEncoding") == "gzip,aws-chunked"

    response_c = s3_client.head_object(Bucket=bucket, Key="some/path/nested/c.csv")
    assert response_c.get("ContentType") == "text/csv"
    assert response_c.get("ContentEncoding") == "aws-chunked"


def test_file_and_directories_artifacts_are_logged_and_downloaded_successfully_in_batch(
    s3_artifact_repo, tmp_path
):
    subdir = tmp_path / "subdir"
    subdir.mkdir()
    subdir_path = str(subdir)
    nested_path = os.path.join(subdir_path, "nested")
    os.makedirs(nested_path)
    with open(os.path.join(subdir_path, "a.txt"), "w") as f:
        f.write("A")
    with open(os.path.join(subdir_path, "b.txt"), "w") as f:
        f.write("B")
    with open(os.path.join(nested_path, "c.txt"), "w") as f:
        f.write("C")

    s3_artifact_repo.log_artifacts(subdir_path)

    # Download individual files and verify correctness of their contents
    with open(s3_artifact_repo.download_artifacts("a.txt")) as f:
        assert f.read() == "A"
    with open(s3_artifact_repo.download_artifacts("b.txt")) as f:
        assert f.read() == "B"
    with open(s3_artifact_repo.download_artifacts("nested/c.txt")) as f:
        assert f.read() == "C"

    # Download the nested directory and verify correctness of its contents
    downloaded_dir = s3_artifact_repo.download_artifacts("nested")
    assert os.path.basename(downloaded_dir) == "nested"
    with open(os.path.join(downloaded_dir, "c.txt")) as f:
        assert f.read() == "C"

    # Download the root directory and verify correctness of its contents
    downloaded_dir = s3_artifact_repo.download_artifacts("")
    dir_contents = os.listdir(downloaded_dir)
    assert "nested" in dir_contents
    assert os.path.isdir(os.path.join(downloaded_dir, "nested"))
    assert "a.txt" in dir_contents
    assert "b.txt" in dir_contents


def test_file_and_directories_artifacts_are_logged_and_listed_successfully_in_batch(
    s3_artifact_repo, tmp_path
):
    subdir = tmp_path / "subdir"
    subdir.mkdir()
    subdir_path = str(subdir)
    nested_path = os.path.join(subdir_path, "nested")
    os.makedirs(nested_path)
    with open(os.path.join(subdir_path, "a.txt"), "w") as f:
        f.write("A")
    with open(os.path.join(subdir_path, "b.txt"), "w") as f:
        f.write("B")
    with open(os.path.join(nested_path, "c.txt"), "w") as f:
        f.write("C")

    s3_artifact_repo.log_artifacts(subdir_path)

    root_artifacts_listing = sorted(
        [(f.path, f.is_dir, f.file_size) for f in s3_artifact_repo.list_artifacts()]
    )
    assert root_artifacts_listing == [
        ("a.txt", False, 1),
        ("b.txt", False, 1),
        ("nested", True, None),
    ]

    nested_artifacts_listing = sorted(
        [(f.path, f.is_dir, f.file_size) for f in s3_artifact_repo.list_artifacts("nested")]
    )
    assert nested_artifacts_listing == [("nested/c.txt", False, 1)]


def test_download_directory_artifact_succeeds_when_artifact_root_is_s3_bucket_root(
    s3_artifact_root, tmp_path
):
    file_a_name = "a.txt"
    file_a_text = "A"
    subdir = tmp_path / "subdir"
    subdir.mkdir()
    subdir_path = str(subdir)
    nested_path = os.path.join(subdir_path, "nested")
    os.makedirs(nested_path)
    with open(os.path.join(nested_path, file_a_name), "w") as f:
        f.write(file_a_text)

    repo = get_artifact_repository(s3_artifact_root)
    repo.log_artifacts(subdir_path)

    downloaded_dir_path = repo.download_artifacts("nested")
    assert file_a_name in os.listdir(downloaded_dir_path)
    with open(os.path.join(downloaded_dir_path, file_a_name)) as f:
        assert f.read() == file_a_text


def test_download_file_artifact_succeeds_when_artifact_root_is_s3_bucket_root(
    s3_artifact_root, tmp_path
):
    file_a_name = "a.txt"
    file_a_text = "A"
    file_a_path = os.path.join(tmp_path, file_a_name)
    with open(file_a_path, "w") as f:
        f.write(file_a_text)

    repo = get_artifact_repository(s3_artifact_root)
    repo.log_artifact(file_a_path)

    downloaded_file_path = repo.download_artifacts(file_a_name)
    with open(downloaded_file_path) as f:
        assert f.read() == file_a_text


def test_get_s3_file_upload_extra_args():
    os.environ.setdefault(
        "MLFLOW_S3_UPLOAD_EXTRA_ARGS",
        '{"ServerSideEncryption": "aws:kms", "SSEKMSKeyId": "123456"}',
    )

    parsed_args = S3ArtifactRepository.get_s3_file_upload_extra_args()

    assert parsed_args == {"ServerSideEncryption": "aws:kms", "SSEKMSKeyId": "123456"}


def test_get_s3_file_upload_extra_args_env_var_not_present():
    parsed_args = S3ArtifactRepository.get_s3_file_upload_extra_args()

    assert parsed_args is None


def test_get_s3_file_upload_extra_args_invalid_json():
    os.environ.setdefault(
        "MLFLOW_S3_UPLOAD_EXTRA_ARGS", '"ServerSideEncryption": "aws:kms", "SSEKMSKeyId": "123456"}'
    )

    with pytest.raises(json.decoder.JSONDecodeError, match=r".+"):
        S3ArtifactRepository.get_s3_file_upload_extra_args()


def test_delete_artifacts(s3_artifact_repo, tmp_path):
    subdir = tmp_path / "subdir"
    subdir.mkdir()
    nested_path = subdir / "nested"
    nested_path.mkdir()
    path_a = subdir / "a.txt"

    path_a.write_text("A")
    with tarfile.open(str(subdir / "b.tar.gz"), "w:gz") as f:
        f.add(str(path_a))
    (nested_path / "c.csv").write_text("col1,col2\n1,3\n2,4\n")

    s3_artifact_repo.log_artifacts(str(subdir))

    # confirm that artifacts are present
    artifact_file_names = [obj.path for obj in s3_artifact_repo.list_artifacts()]
    assert "a.txt" in artifact_file_names
    assert "b.tar.gz" in artifact_file_names
    assert "nested" in artifact_file_names

    s3_artifact_repo.delete_artifacts()
    assert s3_artifact_repo.list_artifacts() == []


def test_delete_artifacts_single_object(s3_artifact_repo, tmp_path):
    subdir = tmp_path / "subdir"
    subdir.mkdir()
    path_a = subdir / "a.txt"
    path_a.write_text("A")

    s3_artifact_repo.log_artifacts(str(subdir))

    # confirm that artifact is present
    artifact_file_names = [obj.path for obj in s3_artifact_repo.list_artifacts()]
    assert "a.txt" in artifact_file_names

    s3_artifact_repo.delete_artifacts(artifact_path="a.txt")
    assert s3_artifact_repo.list_artifacts() == []


@pytest.mark.parametrize("artifact_path", ["subdir", "subdir/"])
def test_list_and_delete_artifacts_path(s3_artifact_repo, tmp_path, artifact_path):
    subdir = tmp_path / "subdir"
    subdir.mkdir()
    path_a = subdir / "a.txt"
    path_a.write_text("A")

    s3_artifact_repo.log_artifacts(str(subdir), artifact_path.rstrip("/"))

    # confirm that artifact is present
    artifact_file_names = [obj.path for obj in s3_artifact_repo.list_artifacts(artifact_path)]
    assert "subdir/a.txt" in artifact_file_names

    s3_artifact_repo.delete_artifacts(artifact_path=artifact_path)
    assert s3_artifact_repo.list_artifacts(artifact_path) == []
    assert s3_artifact_repo.list_artifacts() == []


@pytest.mark.parametrize(
    ("boto_error_code", "expected_mlflow_error"),
    [
        ("AccessDenied", "PERMISSION_DENIED"),
        ("NoSuchBucket", "RESOURCE_DOES_NOT_EXIST"),
        ("NoSuchKey", "RESOURCE_DOES_NOT_EXIST"),
        ("InvalidAccessKeyId", "UNAUTHENTICATED"),
        ("SignatureDoesNotMatch", "UNAUTHENTICATED"),
    ],
)
def test_list_artifacts_error_handling(s3_artifact_root, boto_error_code, expected_mlflow_error):
    artifact_path = "some/path/"
    s3_repo = S3ArtifactRepository(posixpath.join(s3_artifact_root, artifact_path))

    with mock.patch.object(s3_repo, "_get_s3_client") as mock_client:
        mock_paginator = mock.Mock()
        boto_error_message = "Error message from the client"
        mock_paginator.paginate.side_effect = botocore.exceptions.ClientError(
            {"Error": {"Code": boto_error_code, "Message": boto_error_message}}, "ListObjectsV2"
        )
        mock_client.return_value.get_paginator.return_value = mock_paginator

        with pytest.raises(
            MlflowException, match=f"Failed to list artifacts in {s3_repo.artifact_uri}:"
        ) as exc_info:
            s3_repo.list_artifacts(artifact_path)
        assert exc_info.value.error_code == expected_mlflow_error
        assert boto_error_message in exc_info.value.message


def test_delete_artifacts_pagination(s3_artifact_repo, tmp_path):
    subdir = tmp_path / "subdir"
    subdir.mkdir()
    # The maximum number of objects that can be listed in a single call is 1000
    # https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html
    for i in range(1100):
        (subdir / f"{i}.txt").write_text("A")

    s3_artifact_repo.log_artifacts(str(subdir))

    # confirm that artifacts are present
    artifact_file_names = [obj.path for obj in s3_artifact_repo.list_artifacts()]
    for i in range(1100):
        assert f"{i}.txt" in artifact_file_names

    s3_artifact_repo.delete_artifacts()
    assert s3_artifact_repo.list_artifacts() == []


def test_create_multipart_upload(s3_artifact_root):
    repo = get_artifact_repository(posixpath.join(s3_artifact_root, "some/path"))
    create = repo.create_multipart_upload("local_file")

    # confirm that a mpu is created with the correct upload_id
    bucket, _ = repo.parse_s3_compliant_uri(s3_artifact_root)
    s3_client = repo._get_s3_client()
    response = s3_client.list_multipart_uploads(Bucket=bucket)
    uploads = response.get("Uploads")
    assert len(uploads) == 1
    assert uploads[0]["UploadId"] == create.upload_id


def test_complete_multipart_upload(s3_artifact_root):
    repo = get_artifact_repository(posixpath.join(s3_artifact_root, "some/path"))
    local_file = "local_file"
    create = repo.create_multipart_upload(local_file, 2)

    # cannot complete invalid upload
    fake_parts = [
        MultipartUploadPart(part_number=1, etag="fake_etag1"),
        MultipartUploadPart(part_number=2, etag="fake_etag2"),
    ]
    with pytest.raises(botocore.exceptions.ClientError, match=r"InvalidPart"):
        repo.complete_multipart_upload(local_file, create.upload_id, fake_parts)

    # can complete valid upload
    parts = []
    data = b"0" * 5 * 1024 * 1024
    for credential in create.credentials:
        url = credential.url
        response = requests.put(url, data=data)
        parts.append(
            MultipartUploadPart(part_number=credential.part_number, etag=response.headers["ETag"])
        )

    repo.complete_multipart_upload(local_file, create.upload_id, parts)

    # verify upload is completed
    bucket, _ = repo.parse_s3_compliant_uri(s3_artifact_root)
    s3_client = repo._get_s3_client()
    response = s3_client.list_multipart_uploads(Bucket=bucket)
    assert response.get("Uploads") is None


def test_abort_multipart_upload(s3_artifact_root):
    repo = get_artifact_repository(posixpath.join(s3_artifact_root, "some/path"))
    local_file = "local_file"
    create = repo.create_multipart_upload(local_file, 2)

    # cannot abort a non-existing upload
    with pytest.raises(botocore.exceptions.ClientError, match=r"NoSuchUpload"):
        repo.abort_multipart_upload(local_file, "fake_upload_id")

    # can abort the created upload
    repo.abort_multipart_upload(local_file, create.upload_id)

    # verify upload is aborted
    bucket, _ = repo.parse_s3_compliant_uri(s3_artifact_root)
    s3_client = repo._get_s3_client()
    response = s3_client.list_multipart_uploads(Bucket=bucket)
    assert response.get("Uploads") is None


def test_trace_data(s3_artifact_root):
    repo = get_artifact_repository(s3_artifact_root)
    # s3 download_file raises exception directly if the file doesn't exist
    with pytest.raises(Exception, match=r"Trace data not found"):
        repo.download_trace_data()
    repo.upload_trace_data("invalid data")
    with pytest.raises(MlflowTraceDataCorrupted, match=r"Trace data is corrupted for path="):
        repo.download_trace_data()

    mock_trace_data = {"spans": [], "request": {"test": 1}, "response": {"test": 2}}
    repo.upload_trace_data(json.dumps(mock_trace_data))
    assert repo.download_trace_data() == mock_trace_data


def test_bucket_ownership_verification_with_env_var(s3_artifact_repo, tmp_path, monkeypatch):
    file_name = "test.txt"
    file_path = tmp_path / file_name
    file_path.touch()

    monkeypatch.setenv("MLFLOW_S3_EXPECTED_BUCKET_OWNER", "123456789012")
    repo_with_owner = S3ArtifactRepository(s3_artifact_repo.artifact_uri)
    assert repo_with_owner._bucket_owner_params == {"ExpectedBucketOwner": "123456789012"}

    mock_s3 = mock.Mock()

    with mock.patch.object(repo_with_owner, "_get_s3_client", return_value=mock_s3):
        repo_with_owner.log_artifact(file_path)

    mock_s3.upload_file.assert_called_once()
    call_kwargs = mock_s3.upload_file.call_args[1]
    assert "ExtraArgs" in call_kwargs
    assert call_kwargs["ExtraArgs"]["ExpectedBucketOwner"] == "123456789012"


def test_bucket_ownership_verification_without_env_var(s3_artifact_root, tmp_path, monkeypatch):
    file_name = "test.txt"
    file_path = tmp_path / file_name
    file_path.touch()

    monkeypatch.delenv("MLFLOW_S3_EXPECTED_BUCKET_OWNER", raising=False)
    s3_artifact_repo = S3ArtifactRepository(s3_artifact_root)
    assert s3_artifact_repo._bucket_owner_params == {}

    mock_s3 = mock.Mock()

    with mock.patch.object(s3_artifact_repo, "_get_s3_client", return_value=mock_s3):
        s3_artifact_repo.log_artifact(file_path)

    mock_s3.upload_file.assert_called_once()
    call_kwargs = mock_s3.upload_file.call_args[1]
    assert "ExpectedBucketOwner" not in call_kwargs.get("ExtraArgs", {})


def test_bucket_takeover_scenario(s3_artifact_root, tmp_path, monkeypatch):
    """
    Test the bucket takeover scenario where:
    1. A user creates and uses a bucket (e.g., `my-mlflow-artifacts`)
    2. The bucket is deleted
    3. An attacker creates a new bucket with the same name
    4. MLflow continues to use the same bucket URI, unknowingly sending
       artifacts to the attacker's bucket

    This test verifies that when MLFLOW_S3_EXPECTED_BUCKET_OWNER is set, operations
    will fail if the bucket owner doesn't match, preventing the takeover attack.
    """
    file_name = "sensitive_data.txt"
    file_path = tmp_path / file_name
    file_text = "Sensitive information"

    with open(file_path, "w") as f:
        f.write(file_text)

    monkeypatch.setenv("MLFLOW_S3_EXPECTED_BUCKET_OWNER", "123456789012")
    repo_with_owner = S3ArtifactRepository(s3_artifact_root)

    mock_s3 = mock.Mock()
    mock_s3.upload_file.side_effect = botocore.exceptions.ClientError(
        {
            "Error": {
                "Code": "AccessDenied",
                "Message": "The bucket owner does not match the expected bucket owner",
            }
        },
        "PutObject",
    )

    with mock.patch.object(repo_with_owner, "_get_s3_client", return_value=mock_s3):
        with pytest.raises(
            botocore.exceptions.ClientError,
            match=r"The bucket owner does not match the expected bucket owner",
        ):
            repo_with_owner.log_artifact(file_path)


def test_list_artifacts_with_bucket_owner(s3_artifact_root, tmp_path, monkeypatch):
    subdir = tmp_path / "subdir"
    subdir.mkdir()
    path_a = subdir / "a.txt"
    path_a.touch()

    monkeypatch.setenv("MLFLOW_S3_EXPECTED_BUCKET_OWNER", "123456789012")
    repo_with_owner = S3ArtifactRepository(s3_artifact_root)
    repo_with_owner.log_artifacts(str(subdir))

    mock_s3 = mock.Mock()
    mock_paginator = mock.Mock()
    mock_s3.get_paginator.return_value = mock_paginator
    mock_paginator.paginate.return_value = [{"Contents": [], "CommonPrefixes": []}]

    with mock.patch.object(repo_with_owner, "_get_s3_client", return_value=mock_s3):
        repo_with_owner.list_artifacts()

    mock_paginator.paginate.assert_called_once()
    call_kwargs = mock_paginator.paginate.call_args[1]
    assert "ExpectedBucketOwner" in call_kwargs
    assert call_kwargs["ExpectedBucketOwner"] == "123456789012"


def test_multipart_upload_with_bucket_owner(s3_artifact_root, monkeypatch):
    monkeypatch.setenv("MLFLOW_S3_EXPECTED_BUCKET_OWNER", "123456789012")
    repo_with_owner = S3ArtifactRepository(s3_artifact_root)

    mock_s3 = mock.Mock()
    mock_s3.create_multipart_upload.return_value = {"UploadId": "test-upload-id"}
    mock_s3.generate_presigned_url.return_value = "https://example.com/presigned"

    with mock.patch.object(repo_with_owner, "_get_s3_client", return_value=mock_s3):
        repo_with_owner.create_multipart_upload("local_file", num_parts=2)

    mock_s3.create_multipart_upload.assert_called_once()
    call_kwargs = mock_s3.create_multipart_upload.call_args[1]
    assert "ExpectedBucketOwner" in call_kwargs
    assert call_kwargs["ExpectedBucketOwner"] == "123456789012"
    presigned_calls = mock_s3.generate_presigned_url.call_args_list
    for call in presigned_calls:
        params = call[1]["Params"]
        assert "ExpectedBucketOwner" in params
        assert params["ExpectedBucketOwner"] == "123456789012"


def test_delete_artifacts_with_bucket_owner(s3_artifact_root, tmp_path, monkeypatch):
    subdir = tmp_path / "subdir"
    subdir.mkdir()
    path_a = subdir / "a.txt"
    path_a.touch()

    monkeypatch.setenv("MLFLOW_S3_EXPECTED_BUCKET_OWNER", "123456789012")
    repo_with_owner = S3ArtifactRepository(s3_artifact_root)
    repo_with_owner.log_artifacts(str(subdir))

    mock_s3 = mock.Mock()
    mock_paginator = mock.Mock()
    mock_s3.get_paginator.return_value = mock_paginator
    mock_paginator.paginate.return_value = [
        {"Contents": [{"Key": "some/path/a.txt"}], "CommonPrefixes": []}
    ]

    with mock.patch.object(repo_with_owner, "_get_s3_client", return_value=mock_s3):
        repo_with_owner.delete_artifacts()

    mock_paginator.paginate.assert_called_once()
    paginate_call_kwargs = mock_paginator.paginate.call_args[1]
    assert "ExpectedBucketOwner" in paginate_call_kwargs
    assert paginate_call_kwargs["ExpectedBucketOwner"] == "123456789012"
    mock_s3.delete_objects.assert_called_once()
    delete_call_kwargs = mock_s3.delete_objects.call_args[1]
    assert "ExpectedBucketOwner" in delete_call_kwargs
    assert delete_call_kwargs["ExpectedBucketOwner"] == "123456789012"
```

--------------------------------------------------------------------------------

---[FILE: test_sftp_artifact_repo.py]---
Location: mlflow-master/tests/store/artifact/test_sftp_artifact_repo.py

```python
import os
import posixpath
from tempfile import NamedTemporaryFile

import pytest

import mlflow
from mlflow.store.artifact.artifact_repository_registry import get_artifact_repository
from mlflow.store.artifact.sftp_artifact_repo import SFTPArtifactRepository
from mlflow.utils.file_utils import TempDir

pytestmark = pytest.mark.requires_ssh


def test_artifact_uri_factory(tmp_path):
    assert isinstance(get_artifact_repository(f"sftp://{tmp_path}"), SFTPArtifactRepository)


def test_list_artifacts_empty(tmp_path):
    repo = SFTPArtifactRepository(f"sftp://{tmp_path}")
    assert repo.list_artifacts() == []


@pytest.mark.parametrize("artifact_path", [None, "sub_dir", "very/nested/sub/dir"])
def test_list_artifacts(tmp_path, artifact_path):
    file_path = "file"
    dir_path = "model"
    tmp_path.joinpath(artifact_path or "").mkdir(parents=True, exist_ok=True)
    tmp_path.joinpath(artifact_path or "", file_path).write_text("test")
    tmp_path.joinpath(artifact_path or "", dir_path).mkdir()

    repo = SFTPArtifactRepository(f"sftp://{tmp_path}")
    artifacts = repo.list_artifacts(path=artifact_path)
    assert len(artifacts) == 2
    assert artifacts[0].path == posixpath.join(artifact_path or "", file_path)
    assert artifacts[0].is_dir is False
    assert artifacts[0].file_size == 4
    assert artifacts[1].path == posixpath.join(artifact_path or "", dir_path)
    assert artifacts[1].is_dir is True
    assert artifacts[1].file_size is None


@pytest.mark.parametrize("artifact_path", [None, "sub_dir", "very/nested/sub/dir"])
def test_log_artifact(artifact_path):
    file_content = "A simple test artifact\nThe artifact is located in: " + str(artifact_path)
    with NamedTemporaryFile(mode="w") as local, TempDir() as remote:
        local.write(file_content)
        local.flush()

        sftp_path = "sftp://" + remote.path()
        store = SFTPArtifactRepository(sftp_path)
        store.log_artifact(local.name, artifact_path)

        remote_file = posixpath.join(
            remote.path(),
            "." if artifact_path is None else artifact_path,
            os.path.basename(local.name),
        )
        assert posixpath.isfile(remote_file)

        with open(remote_file) as remote_content:
            assert remote_content.read() == file_content


@pytest.mark.parametrize("artifact_path", [None, "sub_dir", "very/nested/sub/dir"])
def test_log_artifacts(artifact_path):
    file_content_1 = "A simple test artifact\nThe artifact is located in: " + str(artifact_path)
    file_content_2 = os.urandom(300)

    file1 = "meta.yaml"
    directory = "saved_model"
    file2 = "sk_model.pickle"
    with TempDir() as local, TempDir() as remote:
        with open(os.path.join(local.path(), file1), "w") as f:
            f.write(file_content_1)
        os.mkdir(os.path.join(local.path(), directory))
        with open(os.path.join(local.path(), directory, file2), "wb") as f:
            f.write(file_content_2)

        sftp_path = "sftp://" + remote.path()
        store = SFTPArtifactRepository(sftp_path)
        store.log_artifacts(local.path(), artifact_path)

        remote_dir = posixpath.join(remote.path(), "." if artifact_path is None else artifact_path)
        assert posixpath.isdir(remote_dir)
        assert posixpath.isdir(posixpath.join(remote_dir, directory))
        assert posixpath.isfile(posixpath.join(remote_dir, file1))
        assert posixpath.isfile(posixpath.join(remote_dir, directory, file2))

        with open(posixpath.join(remote_dir, file1)) as remote_content:
            assert remote_content.read() == file_content_1

        with open(posixpath.join(remote_dir, directory, file2), "rb") as remote_content:
            assert remote_content.read() == file_content_2


@pytest.mark.parametrize("artifact_path", [None, "sub_dir", "very/nested/sub/dir"])
def test_delete_artifact(artifact_path):
    file_content = f"A simple test artifact\nThe artifact is located in: {artifact_path}"
    with NamedTemporaryFile(mode="w") as local, TempDir() as remote:
        local.write(file_content)
        local.flush()

        sftp_path = f"sftp://{remote.path()}"
        store = SFTPArtifactRepository(sftp_path)
        store.log_artifact(local.name, artifact_path)

        remote_file = posixpath.join(
            remote.path(),
            "." if artifact_path is None else artifact_path,
            os.path.basename(local.name),
        )
        assert posixpath.isfile(remote_file)

        with open(remote_file) as remote_content:
            assert remote_content.read() == file_content

        store.delete_artifacts(remote.path())

        assert not posixpath.exists(remote_file)
        assert not posixpath.exists(remote.path())


@pytest.mark.parametrize("artifact_path", [None, "sub_dir", "very/nested/sub/dir"])
def test_delete_artifacts(artifact_path):
    file_content_1 = f"A simple test artifact\nThe artifact is located in: {artifact_path}"
    file_content_2 = os.urandom(300)

    file1 = "meta.yaml"
    directory = "saved_model"
    file2 = "sk_model.pickle"
    with TempDir() as local, TempDir() as remote:
        with open(os.path.join(local.path(), file1), "w", encoding="utf8") as f:
            f.write(file_content_1)
        os.mkdir(os.path.join(local.path(), directory))
        with open(os.path.join(local.path(), directory, file2), "wb") as f:
            f.write(file_content_2)

        sftp_path = f"sftp://{remote.path()}"
        store = SFTPArtifactRepository(sftp_path)
        store.log_artifacts(local.path(), artifact_path)

        remote_dir = posixpath.join(remote.path(), "." if artifact_path is None else artifact_path)
        assert posixpath.isdir(remote_dir)
        assert posixpath.isdir(posixpath.join(remote_dir, directory))
        assert posixpath.isfile(posixpath.join(remote_dir, file1))
        assert posixpath.isfile(posixpath.join(remote_dir, directory, file2))

        with open(posixpath.join(remote_dir, file1), encoding="utf8") as remote_content:
            assert remote_content.read() == file_content_1

        with open(posixpath.join(remote_dir, directory, file2), "rb") as remote_content:
            assert remote_content.read() == file_content_2

        store.delete_artifacts(remote.path())

        assert not posixpath.exists(posixpath.join(remote_dir, directory))
        assert not posixpath.exists(posixpath.join(remote_dir, file1))
        assert not posixpath.exists(posixpath.join(remote_dir, directory, file2))
        assert not posixpath.exists(remote_dir)
        assert not posixpath.exists(remote.path())


@pytest.mark.parametrize("artifact_path", [None, "sub_dir", "very/nested/sub/dir"])
def test_delete_selective_artifacts(artifact_path):
    file_content_1 = f"A simple test artifact\nThe artifact is located in: {artifact_path}"
    file_content_2 = os.urandom(300)

    file1 = "meta.yaml"
    directory = "saved_model"
    file2 = "sk_model.pickle"
    with TempDir() as local, TempDir() as remote:
        with open(os.path.join(local.path(), file1), "w", encoding="utf8") as f:
            f.write(file_content_1)
        os.mkdir(os.path.join(local.path(), directory))
        with open(os.path.join(local.path(), directory, file2), "wb") as f:
            f.write(file_content_2)

        sftp_path = f"sftp://{remote.path()}"
        store = SFTPArtifactRepository(sftp_path)
        store.log_artifacts(local.path(), artifact_path)

        remote_dir = posixpath.join(remote.path(), "." if artifact_path is None else artifact_path)
        assert posixpath.isdir(remote_dir)
        assert posixpath.isdir(posixpath.join(remote_dir, directory))
        assert posixpath.isfile(posixpath.join(remote_dir, file1))
        assert posixpath.isfile(posixpath.join(remote_dir, directory, file2))

        with open(posixpath.join(remote_dir, file1), encoding="utf8") as remote_content:
            assert remote_content.read() == file_content_1

        with open(posixpath.join(remote_dir, directory, file2), "rb") as remote_content:
            assert remote_content.read() == file_content_2

        store.delete_artifacts(posixpath.join(remote_dir, file1))

        assert posixpath.isdir(posixpath.join(remote_dir, directory))
        assert not posixpath.exists(posixpath.join(remote_dir, file1))
        assert posixpath.isfile(posixpath.join(remote_dir, directory, file2))
        assert posixpath.isdir(remote_dir)


def test_log_and_download_sklearn_model(tmp_path):
    from numpy.testing import assert_allclose
    from sklearn.datasets import load_iris
    from sklearn.linear_model import LogisticRegression

    X, y = load_iris(return_X_y=True)
    original = LogisticRegression().fit(X, y)

    experiment_id = mlflow.create_experiment(
        name="sklearn-model-experiment",
        artifact_location=f"sftp://{tmp_path}",
    )
    with mlflow.start_run(experiment_id=experiment_id):
        model_uri = mlflow.sklearn.log_model(original, name="model").model_uri
        downloaded = mlflow.sklearn.load_model(model_uri)

    assert_allclose(original.predict(X), downloaded.predict(X))
```

--------------------------------------------------------------------------------

---[FILE: test_uc_volumes_artifact_repo.py]---
Location: mlflow-master/tests/store/artifact/test_uc_volumes_artifact_repo.py

```python
import posixpath
from unittest import mock

import pytest
from databricks.sdk.service.files import DirectoryEntry

from mlflow.entities.file_info import FileInfo
from mlflow.exceptions import MlflowException
from mlflow.store.artifact.artifact_repository_registry import get_artifact_repository
from mlflow.store.artifact.uc_volume_artifact_repo import UCVolumesArtifactRepository

HOST = "http://localhost:5000"


def join_non_empty(*args):
    """
    Join path components, ignoring empty components.
    """
    non_empty_args = [a for a in args if a]
    return posixpath.join(*non_empty_args)


@pytest.fixture(autouse=True)
def set_creds(monkeypatch):
    monkeypatch.setenv("DATABRICKS_HOST", "http://localhost:5000")
    monkeypatch.setenv("DATABRICKS_TOKEN", "abc")


@pytest.fixture
def artifact_repo(monkeypatch):
    return get_artifact_repository("dbfs:/Volumes/catalog/schema/volume/run_id/artifacts")


@pytest.mark.parametrize(
    "artifact_uri",
    [
        "dbfs:/Volumes/catalog/schema/volume/path",
        "dbfs:/volumes/catalog/schema/volume/path",
        "dbfs:/Volume/catalog/schema/volume/path",
        "dbfs:/volume/catalog/schema/volume/path",
        "dbfs:/Volumes/catalog/schema/volume/some/path",
        "dbfs://profile@databricks/Volumes/catalog/schema/volume/some/path",
    ],
)
def test_get_artifact_repository(artifact_uri: str):
    repo = get_artifact_repository(artifact_uri)
    assert isinstance(repo, UCVolumesArtifactRepository)


@pytest.mark.parametrize(
    "artifact_uri",
    [
        "dbfs:/Volumes/catalog",
        "dbfs:/Volumes/catalog/schema",
        "dbfs:/Volumes/catalog/schema/volume",
        "dbfs://profile@databricks/Volumes/catalog",
        "dbfs://profile@databricks/Volumes/catalog/schema",
        "dbfs://profile@databricks/Volumes/catalog/schema/volume",
    ],
)
def test_get_artifact_repository_invalid_uri(artifact_uri: str):
    with pytest.raises(MlflowException, match="UC volumes URI must be of the form"):
        get_artifact_repository(artifact_uri)


@pytest.mark.parametrize("artifact_path", [None, "dir"])
def test_log_artifact(artifact_repo, artifact_path, tmp_path):
    with mock.patch(
        "mlflow.store.artifact.databricks_sdk_artifact_repo.DatabricksSdkArtifactRepository.files_api"
    ) as mock_files_api:
        tmp_file = tmp_path.joinpath("local_file")
        tmp_file.touch()
        artifact_repo.log_artifact(tmp_file, artifact_path)
        mock_files_api.upload.assert_called_once_with(
            join_non_empty(
                "/Volumes/catalog/schema/volume/run_id/artifacts", artifact_path, tmp_file.name
            ),
            mock.ANY,
            overwrite=True,
        )


@pytest.mark.parametrize("artifact_path", [None, "dir"])
def test_log_artifacts(artifact_repo, artifact_path, tmp_path):
    with mock.patch(
        "mlflow.store.artifact.databricks_sdk_artifact_repo.DatabricksSdkArtifactRepository.files_api"
    ) as mock_files_api:
        file1 = tmp_path.joinpath("local_file1")
        file1.touch()
        subdir = tmp_path.joinpath("dir")
        subdir.mkdir()
        file2 = subdir.joinpath("local_file2")
        file2.touch()
        artifact_repo.log_artifacts(tmp_path, artifact_path)
        assert mock_files_api.upload.call_count == 2
        mock_files_api.upload.assert_any_call(
            join_non_empty(
                "/Volumes/catalog/schema/volume/run_id/artifacts", artifact_path, file1.name
            ),
            mock.ANY,
            overwrite=True,
        )
        mock_files_api.upload.assert_any_call(
            join_non_empty(
                "/Volumes/catalog/schema/volume/run_id/artifacts", artifact_path, "dir", file2.name
            ),
            mock.ANY,
            overwrite=True,
        )


@pytest.mark.parametrize("artifact_path", [None, "dir"])
def test_list_artifacts(artifact_repo, artifact_path):
    with mock.patch(
        "mlflow.store.artifact.databricks_sdk_artifact_repo.DatabricksSdkArtifactRepository.files_api"
    ) as mock_files_api:
        mock_files_api.list_directory_contents.return_value = [
            DirectoryEntry(
                path=join_non_empty(
                    "/Volumes/catalog/schema/volume/run_id/artifacts", artifact_path, "file"
                ),
                is_directory=False,
                file_size=123,
            ),
            DirectoryEntry(
                path=join_non_empty(
                    "/Volumes/catalog/schema/volume/run_id/artifacts", artifact_path, "dir"
                ),
                is_directory=True,
            ),
        ]
        artifacts = artifact_repo.list_artifacts(artifact_path)
        assert artifacts == [
            FileInfo(join_non_empty(artifact_path, "dir"), True, None),
            FileInfo(join_non_empty(artifact_path, "file"), False, 123),
        ]


@pytest.mark.parametrize("remote_file_path", ["file", "dir/file"])
def test_download_file(artifact_repo, remote_file_path, tmp_path):
    with mock.patch(
        "mlflow.store.artifact.databricks_sdk_artifact_repo.DatabricksSdkArtifactRepository.files_api"
    ) as mock_files_api:
        output_path = tmp_path.joinpath("output_path")
        mock_files_api.download.return_value.contents.read.side_effect = [b"test", b""]
        artifact_repo._download_file(remote_file_path, output_path)
        assert mock_files_api.download.call_count == 1
```

--------------------------------------------------------------------------------

````
