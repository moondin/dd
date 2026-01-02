---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 921
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 921 of 991)

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

---[FILE: test_hdfs_artifact_repo.py]---
Location: mlflow-master/tests/store/artifact/test_hdfs_artifact_repo.py

```python
import sys
from tempfile import NamedTemporaryFile
from unittest import mock
from unittest.mock import call

import pyarrow
import pytest

from mlflow.entities import FileInfo
from mlflow.store.artifact.hdfs_artifact_repo import (
    HdfsArtifactRepository,
    _parse_extra_conf,
    _relative_path_remote,
    _resolve_base_path,
)


@pytest.fixture
def hdfs_system_mock():
    with mock.patch(
        "mlflow.store.artifact.hdfs_artifact_repo.HadoopFileSystem",
        spec=pyarrow.fs.HadoopFileSystem,
    ) as mock_hdfs:
        yield mock_hdfs


def test_log_artifact(hdfs_system_mock, tmp_path):
    repo = HdfsArtifactRepository("hdfs://host_name:8020/hdfs/path")

    local_file = tmp_path.joinpath("sample_file")
    local_file.write_text("PyArrow Works")

    repo.log_artifact(str(local_file), "more_path/some")

    hdfs_system_mock.assert_called_once_with(
        extra_conf=None, host="hdfs://host_name", kerb_ticket=None, port=8020, user=None
    )

    upload_mock = hdfs_system_mock.return_value.open_output_stream
    upload_mock.assert_called_once_with("/hdfs/path/more_path/some/sample_file")


def test_log_artifact_viewfs(hdfs_system_mock, tmp_path):
    repo = HdfsArtifactRepository("viewfs://host_name/mypath")

    local_file = tmp_path.joinpath("sample_file")
    local_file.write_text("PyArrow Works")

    repo.log_artifact(str(local_file), "more_path/some")

    hdfs_system_mock.assert_called_once_with(
        extra_conf=None, host="viewfs://host_name", kerb_ticket=None, port=0, user=None
    )
    upload_mock = hdfs_system_mock.return_value.open_output_stream
    upload_mock.assert_called_once_with("/mypath/more_path/some/sample_file")


def test_log_artifact_with_kerberos_setup(hdfs_system_mock, monkeypatch):
    if sys.platform == "win32":
        pytest.skip()
    monkeypatch.setenv("MLFLOW_KERBEROS_TICKET_CACHE", "/tmp/krb5cc_22222222")
    monkeypatch.setenv("MLFLOW_KERBEROS_USER", "some_kerberos_user")

    repo = HdfsArtifactRepository("hdfs:/some/maybe/path")

    with NamedTemporaryFile() as tmp_local_file:
        tmp_local_file.write(b"PyArrow Works")
        tmp_local_file.seek(0)

        repo.log_artifact(tmp_local_file.name, "test_hdfs/some/path")

        hdfs_system_mock.assert_called_once_with(
            extra_conf=None,
            host="default",
            kerb_ticket="/tmp/krb5cc_22222222",
            port=0,
            user="some_kerberos_user",
        )
        upload_mock = hdfs_system_mock.return_value.open_output_stream
        upload_mock.assert_called_once()


def test_log_artifact_with_invalid_local_dir(hdfs_system_mock):
    repo = HdfsArtifactRepository("hdfs://host_name:8020/maybe/path")

    with pytest.raises(Exception, match="No such file or directory: '/not/existing/local/path'"):
        repo.log_artifact("/not/existing/local/path", "test_hdfs/some/path")


def test_log_artifacts(hdfs_system_mock, monkeypatch, tmp_path):
    monkeypatch.setenv("MLFLOW_KERBEROS_TICKET_CACHE", "/tmp/krb5cc_22222222")
    monkeypatch.setenv("MLFLOW_KERBEROS_USER", "some_kerberos_user")

    repo = HdfsArtifactRepository("hdfs:/some_path/maybe/path")

    file_one = tmp_path.joinpath("file_one.txt")
    file_one.write_text("PyArrow Works once")

    subdir = tmp_path.joinpath("subdir")
    subdir.mkdir()
    file_two = subdir.joinpath("file_two.txt")
    file_two.write_text("PyArrow Works two")

    repo.log_artifacts(str(tmp_path))

    hdfs_system_mock.assert_called_once_with(
        extra_conf=None,
        host="default",
        kerb_ticket="/tmp/krb5cc_22222222",
        port=0,
        user="some_kerberos_user",
    )

    upload_mock = hdfs_system_mock.return_value.open_output_stream
    upload_mock.assert_has_calls(
        calls=[
            call("/some_path/maybe/path/file_one.txt"),
            call("/some_path/maybe/path/subdir/file_two.txt"),
        ],
        any_order=True,
    )


def test_list_artifacts_root(hdfs_system_mock):
    repo = HdfsArtifactRepository("hdfs://host/some/path")

    expected = [FileInfo("model", True, 0)]

    hdfs_system_mock.return_value.get_file_info.side_effect = [
        pyarrow.fs.FileInfo(path="/some/path/", type=pyarrow.fs.FileType.Directory, size=0),
        [pyarrow.fs.FileInfo(path="/some/path/model", type=pyarrow.fs.FileType.Directory, size=0)],
    ]

    actual = repo.list_artifacts()

    assert actual == expected


def test_list_artifacts_nested(hdfs_system_mock):
    repo = HdfsArtifactRepository("hdfs://host/some/path")

    expected = [
        FileInfo("model/conda.yaml", False, 33),
        FileInfo("model/model.pkl", False, 33),
        FileInfo("model/MLmodel", False, 33),
    ]

    hdfs_system_mock.return_value.get_file_info.side_effect = [
        pyarrow.fs.FileInfo(path="/some/path/model", type=pyarrow.fs.FileType.Directory, size=0),
        [
            pyarrow.fs.FileInfo(
                path="/some/path/model/conda.yaml", type=pyarrow.fs.FileType.File, size=33
            ),
            pyarrow.fs.FileInfo(
                path="/some/path/model/model.pkl", type=pyarrow.fs.FileType.File, size=33
            ),
            pyarrow.fs.FileInfo(
                path="/some/path/model/MLmodel", type=pyarrow.fs.FileType.File, size=33
            ),
        ],
    ]

    actual = repo.list_artifacts("model")

    assert actual == expected


def test_list_artifacts_empty_hdfs_dir(hdfs_system_mock):
    hdfs_system_mock.return_value.get_file_info.return_value = pyarrow.fs.FileInfo(
        path="/some_path/maybe/path", type=pyarrow.fs.FileType.NotFound, size=0
    )

    repo = HdfsArtifactRepository("hdfs:/some_path/maybe/path")
    actual = repo.list_artifacts()
    assert actual == []


def test_resolve_path():
    assert _resolve_base_path("/dir/some/path", None) == "/dir/some/path"
    assert _resolve_base_path("/dir/some/path", "subdir/path") == "/dir/some/path/subdir/path"


def test_relative_path():
    assert _relative_path_remote("/dir/some", "/dir/some/path/file.txt") == "path/file.txt"
    assert _relative_path_remote("/dir/some", "/dir/some") is None


def test_parse_extra_conf():
    assert _parse_extra_conf("fs.permissions.umask-mode=022,some_other.extra.conf=abcd") == {
        "fs.permissions.umask-mode": "022",
        "some_other.extra.conf": "abcd",
    }
    assert _parse_extra_conf(None) is None

    with pytest.raises(ValueError, match="not enough values to unpack "):
        _parse_extra_conf("missing_equals_sign")


def test_delete_artifacts(hdfs_system_mock):
    repo = HdfsArtifactRepository("hdfs:/some_path/maybe/path/")
    hdfs_system_mock.return_value.get_file_info.return_value = pyarrow.fs.FileInfo(
        path="/some_path/maybe/path/file.txt", type=pyarrow.fs.FileType.File, size=0
    )
    delete_mock = hdfs_system_mock.return_value.delete_file
    repo.delete_artifacts("file.ext")
    delete_mock.assert_called_once_with("/some_path/maybe/path/file.ext")
    hdfs_system_mock.return_value.get_file_info.return_value = pyarrow.fs.FileInfo(
        path="/some_path/maybe/path/artifacts", type=pyarrow.fs.FileType.Directory, size=0
    )
    delete_mock = hdfs_system_mock.return_value.delete_dir_contents
    repo.delete_artifacts("artifacts")
    delete_mock.assert_called_once_with("/some_path/maybe/path/artifacts")


def test_is_directory_called_with_relative_path(hdfs_system_mock):
    repo = HdfsArtifactRepository("hdfs://host/some/path")

    get_file_info_mock = hdfs_system_mock.return_value.get_file_info
    get_file_info_mock.side_effect = [
        pyarrow.fs.FileInfo(path="/some/path/dir", type=pyarrow.fs.FileType.Directory, size=0),
    ]

    assert repo._is_directory("dir")
    get_file_info_mock.assert_called_once_with("/some/path/dir")
```

--------------------------------------------------------------------------------

---[FILE: test_http_artifact_repo.py]---
Location: mlflow-master/tests/store/artifact/test_http_artifact_repo.py

```python
import os
import posixpath
from unittest import mock

import pytest
from requests import HTTPError

from mlflow.entities.multipart_upload import (
    CreateMultipartUploadResponse,
    MultipartUploadCredential,
    MultipartUploadPart,
)
from mlflow.environment_variables import (
    MLFLOW_MULTIPART_UPLOAD_MINIMUM_FILE_SIZE,
    MLFLOW_TRACKING_CLIENT_CERT_PATH,
    MLFLOW_TRACKING_INSECURE_TLS,
    MLFLOW_TRACKING_PASSWORD,
    MLFLOW_TRACKING_SERVER_CERT_PATH,
    MLFLOW_TRACKING_TOKEN,
    MLFLOW_TRACKING_USERNAME,
)
from mlflow.exceptions import MlflowException
from mlflow.store.artifact.artifact_repository_registry import get_artifact_repository
from mlflow.store.artifact.http_artifact_repo import HttpArtifactRepository
from mlflow.utils.credentials import get_default_host_creds
from mlflow.utils.rest_utils import MlflowHostCreds


@pytest.mark.parametrize("scheme", ["http", "https"])
def test_artifact_uri_factory(scheme):
    repo = get_artifact_repository(f"{scheme}://test.com")
    assert isinstance(repo, HttpArtifactRepository)


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
def http_artifact_repo():
    artifact_uri = "http://test.com/api/2.0/mlflow-artifacts/artifacts"
    return HttpArtifactRepository(artifact_uri)


@pytest.mark.parametrize(
    ("filename", "expected_mime_type"),
    [
        ("c.txt", "text/plain"),
        ("c.pkl", "application/octet-stream"),
        ("MLmodel", "text/plain"),
    ],
)
@pytest.mark.parametrize("artifact_path", [None, "dir"])
def test_log_artifact(
    http_artifact_repo,
    tmp_path,
    artifact_path,
    filename,
    expected_mime_type,
    monkeypatch,
):
    file_path = tmp_path.joinpath(filename)
    file_path.write_text("0")

    def assert_called_log_artifact(mock_http_request):
        paths = (artifact_path, file_path.name) if artifact_path else (file_path.name,)
        mock_http_request.assert_called_once_with(
            http_artifact_repo._host_creds,
            posixpath.join("/", *paths),
            "PUT",
            data=FileObjectMatcher(str(file_path), "rb"),
            extra_headers={"Content-Type": expected_mime_type},
        )

    with mock.patch(
        "mlflow.store.artifact.http_artifact_repo.http_request",
        return_value=MockResponse({}, 200),
    ) as mock_put:
        http_artifact_repo.log_artifact(file_path, artifact_path)
        assert_called_log_artifact(mock_put)

    with mock.patch(
        "mlflow.store.artifact.http_artifact_repo.http_request",
        return_value=MockResponse({}, 400),
    ):
        with pytest.raises(Exception, match="request failed"):
            http_artifact_repo.log_artifact(file_path, artifact_path)

    monkeypatch.setenv("MLFLOW_ENABLE_PROXY_MULTIPART_UPLOAD", "true")
    # assert mpu is triggered when file size is larger than minimum file size
    file_path.write_text("0" * MLFLOW_MULTIPART_UPLOAD_MINIMUM_FILE_SIZE.get())
    with mock.patch.object(
        http_artifact_repo, "_try_multipart_upload", return_value=200
    ) as mock_mpu:
        http_artifact_repo.log_artifact(file_path, artifact_path)
        mock_mpu.assert_called_once()

    # assert reverted to normal upload when mpu is not supported
    # mock that create_multipart_upload will returns a 400 error with appropriate message
    with (
        mock.patch.object(
            http_artifact_repo,
            "create_multipart_upload",
            side_effect=HTTPError(
                response=MockResponse(
                    data={
                        "message": "Multipart upload is not supported for the current "
                        "artifact repository"
                    },
                    status_code=501,
                )
            ),
        ),
        mock.patch(
            "mlflow.store.artifact.http_artifact_repo.http_request",
            return_value=MockResponse({}, 200),
        ) as mock_put,
    ):
        http_artifact_repo.log_artifact(file_path, artifact_path)
        assert_called_log_artifact(mock_put)

    # assert if mpu is triggered but the uploads failed, mpu is aborted and exception is raised
    with (
        mock.patch("requests.put", side_effect=Exception("MPU_UPLOAD_FAILS")),
        mock.patch.object(
            http_artifact_repo,
            "create_multipart_upload",
            return_value=CreateMultipartUploadResponse(
                upload_id="upload_id",
                credentials=[MultipartUploadCredential(url="url", part_number=1, headers={})],
            ),
        ),
        mock.patch.object(
            http_artifact_repo,
            "abort_multipart_upload",
            return_value=None,
        ) as mock_abort,
    ):
        with pytest.raises(Exception, match="MPU_UPLOAD_FAILS"):
            http_artifact_repo.log_artifact(file_path, artifact_path)
        mock_abort.assert_called_once()


@pytest.mark.parametrize("artifact_path", [None, "dir"])
def test_log_artifacts(http_artifact_repo, tmp_path, artifact_path):
    tmp_path_a = tmp_path.joinpath("a.txt")
    d = tmp_path.joinpath("dir")
    d.mkdir()
    tmp_path_b = d.joinpath("b.txt")
    tmp_path_a.write_text("0")
    tmp_path_b.write_text("1")

    with mock.patch.object(http_artifact_repo, "log_artifact") as mock_log_artifact:
        http_artifact_repo.log_artifacts(tmp_path, artifact_path)
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
            http_artifact_repo.log_artifacts(tmp_path, artifact_path)


def test_list_artifacts(http_artifact_repo):
    with mock.patch(
        "mlflow.store.artifact.http_artifact_repo.http_request",
        return_value=MockResponse({}, 200),
    ) as mock_get:
        assert http_artifact_repo.list_artifacts() == []
        endpoint = "/mlflow-artifacts/artifacts"
        url, _ = http_artifact_repo.artifact_uri.split(endpoint, maxsplit=1)
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
        assert [a.path for a in http_artifact_repo.list_artifacts()] == ["1.txt", "dir"]

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
        assert [a.path for a in http_artifact_repo.list_artifacts(path="path")] == [
            "path/1.txt",
            "path/dir",
        ]

    with mock.patch(
        "mlflow.store.artifact.http_artifact_repo.http_request",
        return_value=MockResponse({}, 400),
    ):
        with pytest.raises(Exception, match="request failed"):
            http_artifact_repo.list_artifacts()


@pytest.mark.parametrize("path", ["/tmp/path", "../../path", "%2E%2E%2Fpath"])
def test_list_artifacts_malicious_path(http_artifact_repo, path):
    with mock.patch(
        "mlflow.store.artifact.http_artifact_repo.http_request",
        return_value=MockResponse(
            {
                "files": [
                    {"path": path, "is_dir": False, "file_size": 1},
                ]
            },
            200,
        ),
    ):
        with pytest.raises(MlflowException, match="Invalid path"):
            http_artifact_repo.list_artifacts()


def read_file(path):
    with open(path) as f:
        return f.read()


@pytest.mark.parametrize("remote_file_path", ["a.txt", "dir/b.xtx"])
def test_download_file(http_artifact_repo, tmp_path, remote_file_path):
    with mock.patch(
        "mlflow.store.artifact.http_artifact_repo.http_request",
        return_value=MockStreamResponse("data", 200),
    ) as mock_get:
        file_path = tmp_path.joinpath(posixpath.basename(remote_file_path))
        http_artifact_repo._download_file(remote_file_path, file_path)
        mock_get.assert_called_once_with(
            http_artifact_repo._host_creds,
            posixpath.join("/", remote_file_path),
            "GET",
            stream=True,
        )
        assert file_path.read_text() == "data"

    with mock.patch(
        "mlflow.store.artifact.http_artifact_repo.http_request",
        return_value=MockStreamResponse("data", 400),
    ):
        with pytest.raises(Exception, match="request failed"):
            http_artifact_repo._download_file(remote_file_path, tmp_path)


def test_download_artifacts(http_artifact_repo, tmp_path):
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
        http_artifact_repo.download_artifacts("", tmp_path)
        paths = [os.path.join(root, f) for root, _, files in os.walk(tmp_path) for f in files]
        assert [os.path.relpath(p, tmp_path) for p in paths] == [
            "a.txt",
            os.path.join("dir", "b.txt"),
        ]
        assert read_file(paths[0]) == "data_a"
        assert read_file(paths[1]) == "data_b"


def test_default_host_creds(monkeypatch):
    artifact_uri = "https://test.com"
    username = "user"
    password = "pass"
    token = "token"
    ignore_tls_verification = False
    client_cert_path = "client_cert_path"
    server_cert_path = "server_cert_path"

    expected_host_creds = MlflowHostCreds(
        host=artifact_uri,
        username=username,
        password=password,
        token=token,
        ignore_tls_verification=ignore_tls_verification,
        client_cert_path=client_cert_path,
        server_cert_path=server_cert_path,
    )

    repo = HttpArtifactRepository(artifact_uri)

    monkeypatch.setenv(MLFLOW_TRACKING_USERNAME.name, username)
    monkeypatch.setenv(MLFLOW_TRACKING_PASSWORD.name, password)
    monkeypatch.setenv(MLFLOW_TRACKING_TOKEN.name, token)
    monkeypatch.setenv(MLFLOW_TRACKING_INSECURE_TLS.name, str(ignore_tls_verification))
    monkeypatch.setenv(MLFLOW_TRACKING_CLIENT_CERT_PATH.name, client_cert_path)
    monkeypatch.setenv(MLFLOW_TRACKING_SERVER_CERT_PATH.name, server_cert_path)
    assert repo._host_creds == expected_host_creds


@pytest.mark.parametrize("remote_file_path", ["a.txt", "dir/b.txt", None])
def test_delete_artifacts(http_artifact_repo, remote_file_path):
    with mock.patch(
        "mlflow.store.artifact.http_artifact_repo.http_request",
        return_value=MockStreamResponse("data", 200),
    ) as mock_get:
        http_artifact_repo.delete_artifacts(remote_file_path)
        mock_get.assert_called_once_with(
            http_artifact_repo._host_creds,
            posixpath.join("/", remote_file_path or ""),
            "DELETE",
            stream=True,
        )


def test_create_multipart_upload(http_artifact_repo, monkeypatch):
    monkeypatch.setenv("MLFLOW_ENABLE_PROXY_MULTIPART_UPLOAD", "true")
    with mock.patch(
        "mlflow.store.artifact.http_artifact_repo.http_request",
        return_value=MockResponse(
            {
                "upload_id": "upload_id",
                "credentials": [
                    {
                        "url": "/some/url",
                        "part_number": 1,
                        "headers": {},
                    }
                ],
            },
            200,
        ),
    ):
        response = http_artifact_repo.create_multipart_upload("", 1)
        assert response.upload_id == "upload_id"
        assert len(response.credentials) == 1
        assert response.credentials[0].url == "/some/url"


def test_complete_multipart_upload(http_artifact_repo, monkeypatch):
    monkeypatch.setenv("MLFLOW_ENABLE_PROXY_MULTIPART_UPLOAD", "true")
    with mock.patch(
        "mlflow.store.artifact.http_artifact_repo.http_request",
        return_value=MockResponse({}, 200),
    ) as mock_post:
        http_artifact_repo.complete_multipart_upload(
            local_file="local_file",
            upload_id="upload_id",
            parts=[
                MultipartUploadPart(part_number=1, etag="etag1"),
                MultipartUploadPart(part_number=2, etag="etag2"),
            ],
            artifact_path="artifact/path",
        )
        endpoint = "/mlflow-artifacts"
        url, _ = http_artifact_repo.artifact_uri.split(endpoint, maxsplit=1)
        mock_post.assert_called_once_with(
            get_default_host_creds(url),
            "/mlflow-artifacts/mpu/complete/artifact/path",
            "POST",
            json={
                "path": "local_file",
                "upload_id": "upload_id",
                "parts": [
                    {"part_number": 1, "etag": "etag1", "url": None},
                    {"part_number": 2, "etag": "etag2", "url": None},
                ],
            },
        )


def test_abort_multipart_upload(http_artifact_repo, monkeypatch):
    monkeypatch.setenv("MLFLOW_ENABLE_PROXY_MULTIPART_UPLOAD", "true")
    with mock.patch(
        "mlflow.store.artifact.http_artifact_repo.http_request",
        return_value=MockResponse({}, 200),
    ) as mock_post:
        http_artifact_repo.abort_multipart_upload(
            local_file="local_file",
            upload_id="upload_id",
            artifact_path="artifact/path",
        )
        endpoint = "/mlflow-artifacts"
        url, _ = http_artifact_repo.artifact_uri.split(endpoint, maxsplit=1)
        mock_post.assert_called_once_with(
            get_default_host_creds(url),
            "/mlflow-artifacts/mpu/abort/artifact/path",
            "POST",
            json={
                "path": "local_file",
                "upload_id": "upload_id",
            },
        )
```

--------------------------------------------------------------------------------

---[FILE: test_local_artifact_repo.py]---
Location: mlflow-master/tests/store/artifact/test_local_artifact_repo.py

```python
import json
import os
import pathlib
import posixpath

import pytest

from mlflow.exceptions import MlflowException, MlflowTraceDataCorrupted, MlflowTraceDataNotFound
from mlflow.store.artifact.local_artifact_repo import LocalArtifactRepository
from mlflow.utils.file_utils import TempDir


@pytest.fixture
def local_artifact_root(tmp_path):
    return str(tmp_path)


@pytest.fixture
def local_artifact_repo(local_artifact_root):
    from mlflow.utils.file_utils import path_to_local_file_uri

    return LocalArtifactRepository(artifact_uri=path_to_local_file_uri(local_artifact_root))


def test_list_artifacts(local_artifact_repo, local_artifact_root):
    assert len(local_artifact_repo.list_artifacts()) == 0

    artifact_rel_path = "artifact"
    artifact_path = os.path.join(local_artifact_root, artifact_rel_path)
    with open(artifact_path, "w") as f:
        f.write("artifact")
    artifacts_list = local_artifact_repo.list_artifacts()
    assert len(artifacts_list) == 1
    assert artifacts_list[0].path == artifact_rel_path


def test_log_artifacts(local_artifact_repo, local_artifact_root):
    artifact_rel_path = "test.txt"
    artifact_text = "hello world!"
    with TempDir() as src_dir:
        artifact_src_path = src_dir.path(artifact_rel_path)
        with open(artifact_src_path, "w") as f:
            f.write(artifact_text)
        local_artifact_repo.log_artifact(artifact_src_path)

    artifacts_list = local_artifact_repo.list_artifacts()
    assert len(artifacts_list) == 1
    assert artifacts_list[0].path == artifact_rel_path

    artifact_dst_path = os.path.join(local_artifact_root, artifact_rel_path)
    assert os.path.exists(artifact_dst_path)
    assert artifact_dst_path != artifact_src_path
    with open(artifact_dst_path) as f:
        assert f.read() == artifact_text


@pytest.mark.parametrize("dst_path", [None, "dest"])
def test_download_artifacts(local_artifact_repo, dst_path):
    artifact_rel_path = "test.txt"
    artifact_text = "hello world!"
    empty_dir_path = "empty_dir"
    with TempDir(chdr=True) as local_dir:
        if dst_path:
            os.mkdir(dst_path)
        artifact_src_path = local_dir.path(artifact_rel_path)
        os.mkdir(local_dir.path(empty_dir_path))
        with open(artifact_src_path, "w") as f:
            f.write(artifact_text)
        local_artifact_repo.log_artifacts(local_dir.path())
        result = local_artifact_repo.download_artifacts(
            artifact_path=artifact_rel_path, dst_path=dst_path
        )
        with open(result) as f:
            assert f.read() == artifact_text
        result = local_artifact_repo.download_artifacts(artifact_path="", dst_path=dst_path)
        empty_dir_dst_path = os.path.join(result, empty_dir_path)
        assert os.path.isdir(empty_dir_dst_path)
        assert len(os.listdir(empty_dir_dst_path)) == 0


def test_download_artifacts_does_not_copy(local_artifact_repo):
    """
    The LocalArtifactRepository.download_artifact function should not copy the artifact if
    the ``dst_path`` argument is None.
    """
    artifact_rel_path = "test.txt"
    artifact_text = "hello world!"
    with TempDir(chdr=True) as local_dir:
        artifact_src_path = local_dir.path(artifact_rel_path)
        with open(artifact_src_path, "w") as f:
            f.write(artifact_text)
        local_artifact_repo.log_artifact(artifact_src_path)
        dst_path = local_artifact_repo.download_artifacts(artifact_path=artifact_rel_path)
        with open(dst_path) as f:
            assert f.read() == artifact_text
        assert dst_path.startswith(local_artifact_repo.artifact_dir), (
            "downloaded artifact is not in local_artifact_repo.artifact_dir root"
        )


def test_download_artifacts_returns_absolute_paths(local_artifact_repo):
    artifact_rel_path = "test.txt"
    artifact_text = "hello world!"
    with TempDir(chdr=True) as local_dir:
        artifact_src_path = local_dir.path(artifact_rel_path)
        with open(artifact_src_path, "w") as f:
            f.write(artifact_text)
        local_artifact_repo.log_artifact(artifact_src_path)

        for dst_dir in ["dst1", local_dir.path("dst2"), None]:
            if dst_dir is not None:
                os.makedirs(dst_dir)
            dst_path = local_artifact_repo.download_artifacts(
                artifact_path=artifact_rel_path, dst_path=dst_dir
            )
            if dst_dir is not None:
                # If dst_dir isn't none, assert we're actually downloading to dst_dir.
                assert dst_path.startswith(os.path.abspath(dst_dir))
            assert dst_path == os.path.abspath(dst_path)


@pytest.mark.parametrize("repo_subdir_path", ["aaa", "aaa/bbb", "aaa/bbb/ccc/ddd"])
def test_artifacts_are_logged_to_and_downloaded_from_repo_subdirectory_successfully(
    local_artifact_repo, repo_subdir_path
):
    artifact_rel_path = "test.txt"
    artifact_text = "hello world!"
    with TempDir(chdr=True) as local_dir:
        artifact_src_path = local_dir.path(artifact_rel_path)
        with open(artifact_src_path, "w") as f:
            f.write(artifact_text)
        local_artifact_repo.log_artifact(artifact_src_path, artifact_path=repo_subdir_path)

    downloaded_subdir = local_artifact_repo.download_artifacts(repo_subdir_path)
    assert os.path.isdir(downloaded_subdir)
    subdir_contents = os.listdir(downloaded_subdir)
    assert len(subdir_contents) == 1
    assert artifact_rel_path in subdir_contents
    with open(os.path.join(downloaded_subdir, artifact_rel_path)) as f:
        assert f.read() == artifact_text

    downloaded_file = local_artifact_repo.download_artifacts(
        posixpath.join(repo_subdir_path, artifact_rel_path)
    )
    with open(downloaded_file) as f:
        assert f.read() == artifact_text


def test_log_artifact_throws_exception_for_invalid_artifact_paths(local_artifact_repo):
    with TempDir() as local_dir:
        for bad_artifact_path in ["/", "//", "/tmp", "/bad_path", ".", "../terrible_path"]:
            with pytest.raises(MlflowException, match="Invalid artifact path"):
                local_artifact_repo.log_artifact(local_dir.path(), bad_artifact_path)


def test_logging_directory_of_artifacts_produces_expected_repo_contents(local_artifact_repo):
    with TempDir() as local_dir:
        os.mkdir(local_dir.path("subdir"))
        os.mkdir(local_dir.path("subdir", "nested"))
        with open(local_dir.path("subdir", "a.txt"), "w") as f:
            f.write("A")
        with open(local_dir.path("subdir", "b.txt"), "w") as f:
            f.write("B")
        with open(local_dir.path("subdir", "nested", "c.txt"), "w") as f:
            f.write("C")
        local_artifact_repo.log_artifacts(local_dir.path("subdir"))
        with open(local_artifact_repo.download_artifacts("a.txt")) as f:
            assert f.read() == "A"
        with open(local_artifact_repo.download_artifacts("b.txt")) as f:
            assert f.read() == "B"
        with open(local_artifact_repo.download_artifacts("nested/c.txt")) as f:
            assert f.read() == "C"


def test_hidden_files_are_logged_correctly(local_artifact_repo):
    with TempDir() as local_dir:
        hidden_file = local_dir.path(".mystery")
        with open(hidden_file, "w") as f:
            f.write("42")
        local_artifact_repo.log_artifact(hidden_file)
        with open(local_artifact_repo.download_artifacts(".mystery")) as f:
            assert f.read() == "42"


def test_delete_artifacts_folder(local_artifact_repo):
    with TempDir() as local_dir:
        os.mkdir(local_dir.path("subdir"))
        os.mkdir(local_dir.path("subdir", "nested"))
        with open(local_dir.path("subdir", "a.txt"), "w") as f:
            f.write("A")
        with open(local_dir.path("subdir", "b.txt"), "w") as f:
            f.write("B")
        with open(local_dir.path("subdir", "nested", "c.txt"), "w") as f:
            f.write("C")
        local_artifact_repo.log_artifacts(local_dir.path("subdir"))
        assert os.path.exists(os.path.join(local_artifact_repo._artifact_dir, "nested"))
        assert os.path.exists(os.path.join(local_artifact_repo._artifact_dir, "a.txt"))
        assert os.path.exists(os.path.join(local_artifact_repo._artifact_dir, "b.txt"))
        local_artifact_repo.delete_artifacts()
        assert not os.path.exists(os.path.join(local_artifact_repo._artifact_dir))


def test_delete_artifacts_files(local_artifact_repo, tmp_path):
    subdir = tmp_path / "subdir"
    nested = subdir / "nested"
    subdir.mkdir()
    nested.mkdir()

    (subdir / "a.txt").write_text("A")
    (subdir / "b.txt").write_text("B")
    (nested / "c.txt").write_text("C")

    local_artifact_repo.log_artifacts(str(subdir))
    artifact_dir = pathlib.Path(local_artifact_repo._artifact_dir)
    assert (artifact_dir / "nested").exists()
    assert (artifact_dir / "a.txt").exists()
    assert (artifact_dir / "b.txt").exists()

    local_artifact_repo.delete_artifacts(artifact_path="nested/c.txt")
    local_artifact_repo.delete_artifacts(artifact_path="b.txt")

    assert not (artifact_dir / "nested" / "c.txt").exists()
    assert not (artifact_dir / "b.txt").exists()
    assert (artifact_dir / "a.txt").exists()


def test_delete_artifacts_with_nonexistent_path_succeeds(local_artifact_repo):
    local_artifact_repo.delete_artifacts("nonexistent")


def test_download_artifacts_invalid_remote_file_path(local_artifact_repo):
    with pytest.raises(MlflowException, match="Invalid path"):
        local_artifact_repo.download_artifacts("/absolute/path/to/file")


def test_trace_data(local_artifact_repo):
    with pytest.raises(MlflowTraceDataNotFound, match=r"Trace data not found for path="):
        local_artifact_repo.download_trace_data()
    local_artifact_repo.upload_trace_data("invalid data")
    with pytest.raises(MlflowTraceDataCorrupted, match=r"Trace data is corrupted for path="):
        local_artifact_repo.download_trace_data()

    mock_trace_data = {"spans": [], "request": {"test": 1}, "response": {"test": 2}}
    local_artifact_repo.upload_trace_data(json.dumps(mock_trace_data))
    assert local_artifact_repo.download_trace_data() == mock_trace_data


@pytest.fixture
def external_secret_dir(tmp_path):
    secret_dir = tmp_path.parent / "secrets_outside"
    secret_dir.mkdir(exist_ok=True)
    secret_file = secret_dir / "secret.txt"
    secret_file.touch()
    return secret_dir


def _execute_operation(local_artifact_repo, operation, access_path, tmp_path):
    if operation == "download_artifacts":
        local_artifact_repo.download_artifacts(access_path)
    elif operation == "list_artifacts":
        local_artifact_repo.list_artifacts(access_path)
    elif operation == "_download_file":
        dst_path = tmp_path / "downloaded.txt"
        local_artifact_repo._download_file(access_path, str(dst_path))


@pytest.mark.parametrize(
    ("symlink_name", "access_path", "operation"),
    [
        ("leak", "leak/secret.txt", "download_artifacts"),
        ("leak", "leak", "list_artifacts"),
        ("leak", "leak/secret.txt", "_download_file"),
        ("parent_link", "parent_link/secret.txt", "download_artifacts"),
    ],
)
def test_symlink_path_traversal_blocked(
    local_artifact_repo, external_secret_dir, tmp_path, symlink_name, access_path, operation
):
    artifact_dir = pathlib.Path(local_artifact_repo.artifact_dir)
    symlink_path = artifact_dir / symlink_name
    symlink_path.symlink_to(external_secret_dir)

    with pytest.raises(MlflowException, match="resolved path is outside the artifact directory"):
        _execute_operation(local_artifact_repo, operation, access_path, tmp_path)


def test_nested_symlink_traversal_blocked(local_artifact_repo, external_secret_dir):
    artifact_dir = pathlib.Path(local_artifact_repo.artifact_dir)
    nested_dir = artifact_dir / "nested"
    nested_dir.mkdir()
    symlink_path = nested_dir / "leak"
    symlink_path.symlink_to(external_secret_dir)

    with pytest.raises(MlflowException, match="resolved path is outside the artifact directory"):
        local_artifact_repo.download_artifacts("nested/leak/secret.txt")


@pytest.mark.parametrize(
    ("setup_type", "access_path", "expected_content"),
    [
        ("file", "artifact_link.txt", "LEGITIMATE_CONTENT"),
        ("subdir", "link_to_subdir/file.txt", "CONTENT"),
    ],
)
def test_symlink_within_artifact_dir_allowed(
    local_artifact_repo, setup_type, access_path, expected_content
):
    artifact_dir = pathlib.Path(local_artifact_repo.artifact_dir)

    if setup_type == "file":
        real_file = artifact_dir / "real_artifact.txt"
        real_file.write_text(expected_content)
        symlink_path = artifact_dir / "artifact_link.txt"
        symlink_path.symlink_to(real_file)
    elif setup_type == "subdir":
        subdir = artifact_dir / "subdir"
        subdir.mkdir()
        real_file = subdir / "file.txt"
        real_file.write_text(expected_content)
        symlink_path = artifact_dir / "link_to_subdir"
        symlink_path.symlink_to(subdir)

    result = local_artifact_repo.download_artifacts(access_path)
    with open(result) as f:
        assert f.read() == expected_content

    if setup_type == "subdir":
        artifacts = local_artifact_repo.list_artifacts("link_to_subdir")
        assert len(artifacts) == 1
        assert artifacts[0].path == "link_to_subdir/file.txt"
```

--------------------------------------------------------------------------------

````
