---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 920
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 920 of 991)

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

---[FILE: test_ftp_artifact_repo.py]---
Location: mlflow-master/tests/store/artifact/test_ftp_artifact_repo.py

```python
import ftplib
import posixpath
from ftplib import FTP
from unittest.mock import MagicMock

import pytest

from mlflow.store.artifact.artifact_repository_registry import get_artifact_repository
from mlflow.store.artifact.ftp_artifact_repo import FTPArtifactRepository


@pytest.fixture
def ftp_mock():
    return MagicMock(autospec=FTP)


def test_artifact_uri_factory():
    repo = get_artifact_repository("ftp://user:pass@test_ftp:123/some/path")
    assert isinstance(repo, FTPArtifactRepository)


def test_list_artifacts_empty(ftp_mock):
    repo = FTPArtifactRepository("ftp://test_ftp/some/path")

    repo.get_ftp_client = MagicMock()
    call_mock = MagicMock(return_value=ftp_mock)
    repo.get_ftp_client.return_value = MagicMock(__enter__=call_mock)

    ftp_mock.nlst = MagicMock(return_value=[])
    assert repo.list_artifacts() == []
    ftp_mock.nlst.assert_called_once_with("/some/path")


def test_list_artifacts(ftp_mock):
    artifact_root_path = "/experiment_id/run_id/"
    repo = FTPArtifactRepository("ftp://test_ftp" + artifact_root_path)

    repo.get_ftp_client = MagicMock()
    call_mock = MagicMock(return_value=ftp_mock)
    repo.get_ftp_client.return_value = MagicMock(__enter__=call_mock)

    # mocked file structure
    #  |- file
    #  |- model
    #     |- model.pb

    file_path = "file"
    file_size = 678
    dir_path = "model"
    ftp_mock.cwd = MagicMock(side_effect=[None, ftplib.error_perm, None])
    ftp_mock.nlst = MagicMock(return_value=[file_path, dir_path])

    ftp_mock.size = MagicMock(return_value=file_size)

    artifacts = repo.list_artifacts(path=None)

    ftp_mock.nlst.assert_called_once_with(artifact_root_path)
    ftp_mock.size.assert_called_once_with(artifact_root_path + file_path)

    assert len(artifacts) == 2
    assert artifacts[0].path == file_path
    assert artifacts[0].is_dir is False
    assert artifacts[0].file_size == file_size
    assert artifacts[1].path == dir_path
    assert artifacts[1].is_dir is True
    assert artifacts[1].file_size is None


def test_list_artifacts_malicious_path(ftp_mock):
    artifact_root_path = "/experiment_id/run_id/"
    repo = FTPArtifactRepository("ftp://test_ftp" + artifact_root_path)
    repo.get_ftp_client = MagicMock()
    call_mock = MagicMock(return_value=ftp_mock)
    repo.get_ftp_client.return_value = MagicMock(__enter__=call_mock)
    ftp_mock.nlst = MagicMock(return_value=[".", "/.", "/..", "//.."])

    artifacts = repo.list_artifacts(path=None)
    assert artifacts == []


def test_list_artifacts_when_ftp_nlst_returns_absolute_paths(ftp_mock):
    artifact_root_path = "/experiment_id/run_id/"
    repo = FTPArtifactRepository("ftp://test_ftp" + artifact_root_path)

    repo.get_ftp_client = MagicMock()
    call_mock = MagicMock(return_value=ftp_mock)
    repo.get_ftp_client.return_value = MagicMock(__enter__=call_mock)

    # mocked file structure
    #  |- file
    #  |- model
    #     |- model.pb

    file_path = "file"
    dir_path = "model"
    file_size = 678
    ftp_mock.cwd = MagicMock(side_effect=[None, ftplib.error_perm, None])
    ftp_mock.nlst = MagicMock(
        return_value=[
            posixpath.join(artifact_root_path, file_path),
            posixpath.join(artifact_root_path, dir_path),
        ]
    )

    ftp_mock.size = MagicMock(return_value=file_size)

    artifacts = repo.list_artifacts(path=None)

    ftp_mock.nlst.assert_called_once_with(artifact_root_path)
    ftp_mock.size.assert_called_once_with(artifact_root_path + file_path)

    assert len(artifacts) == 2
    assert artifacts[0].path == file_path
    assert artifacts[0].is_dir is False
    assert artifacts[0].file_size == file_size
    assert artifacts[1].path == dir_path
    assert artifacts[1].is_dir is True
    assert artifacts[1].file_size is None


def test_list_artifacts_with_subdir(ftp_mock):
    artifact_root_path = "/experiment_id/run_id/"
    repo = FTPArtifactRepository("sftp://test_sftp" + artifact_root_path)

    repo.get_ftp_client = MagicMock()
    call_mock = MagicMock(return_value=ftp_mock)
    repo.get_ftp_client.return_value = MagicMock(__enter__=call_mock)

    # mocked file structure
    #  |- model
    #     |- model.pb
    #     |- variables
    dir_name = "model"

    # list artifacts at sub directory level
    file_path = "model.pb"
    file_size = 345
    subdir_name = "variables"

    ftp_mock.nlst = MagicMock(return_value=[file_path, subdir_name])

    ftp_mock.cwd = MagicMock(side_effect=[None, ftplib.error_perm, None])

    ftp_mock.size = MagicMock(return_value=file_size)

    artifacts = repo.list_artifacts(path=dir_name)

    ftp_mock.nlst.assert_called_once_with(artifact_root_path + dir_name)
    ftp_mock.size.assert_called_once_with(artifact_root_path + dir_name + "/" + file_path)

    assert len(artifacts) == 2
    assert artifacts[0].path == dir_name + "/" + file_path
    assert artifacts[0].is_dir is False
    assert artifacts[0].file_size == file_size
    assert artifacts[1].path == dir_name + "/" + subdir_name
    assert artifacts[1].is_dir is True
    assert artifacts[1].file_size is None


def test_log_artifact(ftp_mock, tmp_path):
    repo = FTPArtifactRepository("ftp://test_ftp/some/path")

    repo.get_ftp_client = MagicMock()
    call_mock = MagicMock(return_value=ftp_mock)
    repo.get_ftp_client.return_value = MagicMock(__enter__=call_mock)

    d = tmp_path.joinpath("data")
    d.mkdir()
    f = d.joinpath("test.txt")
    f.write_text("hello world!")
    fpath = d.joinpath("test.txt")
    fpath = str(fpath)

    ftp_mock.cwd = MagicMock(side_effect=[ftplib.error_perm, None])

    repo.log_artifact(fpath)

    ftp_mock.mkd.assert_called_once_with("/some/path")
    ftp_mock.cwd.assert_called_with("/some/path")
    ftp_mock.storbinary.assert_called_once()
    assert ftp_mock.storbinary.call_args_list[0][0][0] == "STOR test.txt"


def test_log_artifact_multiple_calls(ftp_mock, tmp_path):
    repo = FTPArtifactRepository("ftp://test_ftp/some/path")

    repo.get_ftp_client = MagicMock()
    call_mock = MagicMock(return_value=ftp_mock)
    repo.get_ftp_client.return_value = MagicMock(__enter__=call_mock)

    d = tmp_path.joinpath("data")
    d.mkdir()
    file1 = d.joinpath("test1.txt")
    file1.write_text("hello world!")
    fpath1 = d.joinpath("test1.txt")
    fpath1 = str(fpath1)

    file2 = d.joinpath("test2.txt")
    file2.write_text("hello world!")
    fpath2 = d.joinpath("test2.txt")
    fpath2 = str(fpath2)

    ftp_mock.cwd = MagicMock(
        side_effect=[ftplib.error_perm, None, ftplib.error_perm, None, None, None]
    )

    repo.log_artifact(fpath1)
    ftp_mock.mkd.assert_called_once_with("/some/path")
    ftp_mock.cwd.assert_called_with("/some/path")
    ftp_mock.storbinary.assert_called()
    assert ftp_mock.storbinary.call_args_list[0][0][0] == "STOR test1.txt"
    ftp_mock.reset_mock()

    repo.log_artifact(fpath1, "subdir")
    ftp_mock.mkd.assert_called_once_with("/some/path/subdir")
    ftp_mock.cwd.assert_called_with("/some/path/subdir")
    ftp_mock.storbinary.assert_called()
    assert ftp_mock.storbinary.call_args_list[0][0][0] == "STOR test1.txt"
    ftp_mock.reset_mock()

    repo.log_artifact(fpath2)
    ftp_mock.mkd.assert_not_called()
    ftp_mock.cwd.assert_called_with("/some/path")
    ftp_mock.storbinary.assert_called()
    assert ftp_mock.storbinary.call_args_list[0][0][0] == "STOR test2.txt"


def __posixpath_parents(pathname, root):
    parents = [posixpath.dirname(pathname)]
    root = posixpath.normpath(root)
    while parents[-1] != "/" and parents[-1] != root:
        parents.append(posixpath.dirname(parents[-1]))
    return parents


@pytest.mark.parametrize("artifact_path", [None, "dir", "dir1/dir2"])
def test_log_artifacts(artifact_path, ftp_mock, tmp_path):
    # Setup FTP mock.
    dest_path_root = "/some/path"
    repo = FTPArtifactRepository("ftp://test_ftp" + dest_path_root)

    repo.get_ftp_client = MagicMock()
    call_mock = MagicMock(return_value=ftp_mock)
    repo.get_ftp_client.return_value = MagicMock(__enter__=call_mock)

    dirs_created = {dest_path_root}
    files_created = set()
    cwd_history = ["/"]

    def mkd_mock(pathname):
        abs_pathname = posixpath.join(cwd_history[-1], pathname)
        if posixpath.dirname(abs_pathname) not in dirs_created:
            raise ftplib.error_perm
        dirs_created.add(abs_pathname)

    ftp_mock.mkd = MagicMock(side_effect=mkd_mock)

    def cwd_mock(pathname):
        abs_pathname = posixpath.join(cwd_history[-1], pathname)
        if abs_pathname not in dirs_created:
            raise ftplib.error_perm
        cwd_history.append(abs_pathname)

    ftp_mock.cwd = MagicMock(side_effect=cwd_mock)

    def storbinary_mock(cmd, _):
        head, basename = cmd.split(" ", 1)
        assert head == "STOR"
        assert "/" not in basename
        files_created.add(posixpath.join(cwd_history[-1], basename))

    ftp_mock.storbinary = MagicMock(side_effect=storbinary_mock)

    # Test
    data = tmp_path.joinpath("data")
    data.mkdir()
    subd = data.joinpath("subdir")
    subd.mkdir()
    subd.joinpath("a.txt").write_text("A")
    subd.joinpath("b.txt").write_text("B")
    subd.joinpath("c.txt").write_text("C")
    subd.joinpath("empty1").mkdir()
    subsubd = subd.joinpath("subsubdir")
    subsubd.mkdir()
    subsubd.joinpath("aa.txt").write_text("AA")
    subsubd.joinpath("bb.txt").write_text("BB")
    subsubd.joinpath("cc.txt").write_text("CC")
    subsubd.joinpath("empty2").mkdir()

    dest_path = (
        dest_path_root if artifact_path is None else posixpath.join(dest_path_root, artifact_path)
    )
    dirs_expected = {
        dest_path,
        posixpath.join(dest_path, "empty1"),
        posixpath.join(dest_path, "subsubdir"),
        posixpath.join(dest_path, "subsubdir", "empty2"),
    }

    files_expected = {
        posixpath.join(dest_path, "a.txt"),
        posixpath.join(dest_path, "b.txt"),
        posixpath.join(dest_path, "c.txt"),
        posixpath.join(dest_path, "subsubdir/aa.txt"),
        posixpath.join(dest_path, "subsubdir/bb.txt"),
        posixpath.join(dest_path, "subsubdir/cc.txt"),
    }

    for dirs_expected_i in dirs_expected.copy():
        if dirs_expected_i != dest_path_root:
            dirs_expected |= set(__posixpath_parents(dirs_expected_i, root=dest_path_root))

    repo.log_artifacts(subd, artifact_path)
    assert dirs_created == dirs_expected
    assert files_created == files_expected


def test_download_artifacts_single(ftp_mock):
    repo = FTPArtifactRepository("ftp://test_ftp/some/path")

    repo.get_ftp_client = MagicMock()
    call_mock = MagicMock(return_value=ftp_mock)
    repo.get_ftp_client.return_value = MagicMock(__enter__=call_mock)

    ftp_mock.cwd = MagicMock(side_effect=ftplib.error_perm)

    repo.download_artifacts("test.txt")

    ftp_mock.retrbinary.assert_called_once()
    assert ftp_mock.retrbinary.call_args_list[0][0][0] == "RETR /some/path/test.txt"


def test_download_artifacts(ftp_mock):
    artifact_root_path = "/some/path"
    repo = FTPArtifactRepository("ftp://test_ftp" + artifact_root_path)

    repo.get_ftp_client = MagicMock()
    call_mock = MagicMock(return_value=ftp_mock)
    repo.get_ftp_client.return_value = MagicMock(__enter__=call_mock)

    # mocked file structure
    #  |- model
    #     |- model.pb
    #     |- empty_dir
    #     |- variables
    #        |- test.txt
    dir_path = posixpath.join(artifact_root_path, "model")

    # list artifacts at sub directory level
    model_file_path_sub = "model.pb"
    model_file_path_full = posixpath.join(dir_path, model_file_path_sub)
    empty_dir_name = "empty_dir"
    empty_dir_path = posixpath.join(dir_path, empty_dir_name)
    subdir_name = "variables"
    subdir_path_full = posixpath.join(dir_path, subdir_name)
    subfile_name = "test.txt"
    subfile_path_full = posixpath.join(artifact_root_path, subdir_path_full, subfile_name)

    is_dir_mapping = {
        dir_path: True,
        empty_dir_path: True,
        model_file_path_full: False,
        subdir_path_full: True,
        subfile_path_full: False,
    }

    is_dir_call_args = [
        dir_path,
        model_file_path_full,
        empty_dir_path,
        subdir_path_full,
        model_file_path_full,
        subdir_path_full,
        subfile_path_full,
        subfile_path_full,
    ]

    def cwd_side_effect(call_arg):
        if not is_dir_mapping[call_arg]:
            raise ftplib.error_perm

    ftp_mock.cwd = MagicMock(side_effect=cwd_side_effect)

    def nlst_side_effect(call_arg):
        if call_arg == dir_path:
            return [model_file_path_sub, subdir_name, empty_dir_name]
        elif call_arg == subdir_path_full:
            return [subfile_name]
        elif call_arg == empty_dir_path:
            return []
        else:
            raise Exception(f"should never call nlst for non-directories {call_arg}")

    ftp_mock.nlst = MagicMock(side_effect=nlst_side_effect)
    repo.download_artifacts("model")

    cwd_call_args = [arg_entry[0][0] for arg_entry in ftp_mock.cwd.call_args_list]

    assert set(cwd_call_args) == set(is_dir_call_args)
    assert ftp_mock.nlst.call_count == 3
    assert ftp_mock.retrbinary.call_args_list[0][0][0] == "RETR " + model_file_path_full
    assert ftp_mock.retrbinary.call_args_list[1][0][0] == "RETR " + subfile_path_full


def test_log_artifact_reuse_ftp_client(ftp_mock, tmp_path):
    repo = FTPArtifactRepository("ftp://test_ftp/some/path")

    repo.get_ftp_client = MagicMock()
    call_mock = MagicMock(return_value=ftp_mock)
    repo.get_ftp_client.return_value = MagicMock(__enter__=call_mock)

    d = tmp_path.joinpath("data")
    d.mkdir()
    file = d.joinpath("test.txt")
    file.write_text("hello world!")
    fpath = str(file)

    repo.log_artifact(fpath)
    repo.log_artifact(fpath, "subdir1/subdir2")
    repo.log_artifact(fpath, "subdir3")

    assert repo.get_ftp_client.call_count == 3
```

--------------------------------------------------------------------------------

---[FILE: test_gcs_artifact_repo.py]---
Location: mlflow-master/tests/store/artifact/test_gcs_artifact_repo.py

```python
import os
import posixpath
from unittest import mock

import pytest
import requests
from google.auth.exceptions import DefaultCredentialsError
from google.cloud.storage import client as gcs_client

from mlflow.entities.multipart_upload import MultipartUploadPart
from mlflow.store.artifact.artifact_repository_registry import get_artifact_repository
from mlflow.store.artifact.gcs_artifact_repo import GCSArtifactRepository, GCSMPUArguments

from tests.helper_functions import mock_method_chain


@pytest.fixture
def mock_client():
    return mock.MagicMock(autospec=gcs_client.Client)


def test_artifact_uri_factory():
    repo = get_artifact_repository("gs://test_bucket/some/path")
    assert isinstance(repo, GCSArtifactRepository)


def test_list_artifacts_empty(mock_client):
    repo = GCSArtifactRepository("gs://test_bucket/some/path", client=mock_client)
    mock_client.bucket.return_value.list_blobs.return_value = mock.MagicMock()
    assert repo.list_artifacts() == []


def test_custom_gcs_client_used():
    mock_client = mock.MagicMock(autospec=gcs_client.Client)
    repo = GCSArtifactRepository("gs://test_bucket/some/path", client=mock_client)
    mock_client.bucket.return_value.list_blobs.return_value = mock.MagicMock()
    repo.list_artifacts()
    mock_client.bucket.assert_called()


def test_list_artifacts(mock_client):
    artifact_root_path = "/experiment_id/run_id/"
    repo = GCSArtifactRepository("gs://test_bucket" + artifact_root_path, client=mock_client)

    # mocked bucket/blob structure
    # gs://test_bucket/experiment_id/run_id/
    #  |- file
    #  |- model
    #     |- model.pb

    # mocking a single blob returned by bucket.list_blobs iterator
    # https://googlecloudplatform.github.io/google-cloud-python/latest/storage/buckets.html#google.cloud.storage.bucket.Bucket.list_blobs

    # list artifacts at artifact root level
    obj_mock = mock.Mock()
    file_path = "file"
    obj_mock.configure_mock(name=artifact_root_path + file_path, size=1)

    dir_mock = mock.Mock()
    dir_name = "model"
    dir_mock.configure_mock(prefixes=(artifact_root_path + dir_name + "/",))

    mock_results = mock.MagicMock()
    mock_results.configure_mock(pages=[dir_mock])
    mock_results.__iter__.return_value = [obj_mock]

    mock_client.bucket.return_value.list_blobs.return_value = mock_results

    artifacts = repo.list_artifacts(path=None)

    assert len(artifacts) == 2
    assert artifacts[0].path == file_path
    assert artifacts[0].is_dir is False
    assert artifacts[0].file_size == obj_mock.size
    assert artifacts[1].path == dir_name
    assert artifacts[1].is_dir is True
    assert artifacts[1].file_size is None


@pytest.mark.parametrize("dir_name", ["model", "model/"])
def test_list_artifacts_with_subdir(mock_client, dir_name):
    artifact_root_path = "/experiment_id/run_id/"
    repo = GCSArtifactRepository("gs://test_bucket" + artifact_root_path, client=mock_client)

    # mocked bucket/blob structure
    # gs://test_bucket/experiment_id/run_id/
    #  |- model
    #     |- model.pb
    #     |- variables

    # list artifacts at sub directory level
    obj_mock = mock.Mock()
    file_path = posixpath.join(dir_name, "model.pb")
    obj_mock.configure_mock(name=artifact_root_path + file_path, size=1)

    subdir_mock = mock.Mock()
    subdir_name = posixpath.join(dir_name, "variables")
    subdir_mock.configure_mock(prefixes=(artifact_root_path + subdir_name + "/",))

    mock_results = mock.MagicMock()
    mock_results.configure_mock(pages=[subdir_mock])
    mock_results.__iter__.return_value = [obj_mock]

    mock_client.bucket.return_value.list_blobs.return_value = mock_results

    artifacts = repo.list_artifacts(path=dir_name)
    mock_client.bucket().list_blobs.assert_called_with(
        prefix=posixpath.join(artifact_root_path[1:], "model/"), delimiter="/"
    )
    assert len(artifacts) == 2
    assert artifacts[0].path == file_path
    assert artifacts[0].is_dir is False
    assert artifacts[0].file_size == obj_mock.size
    assert artifacts[1].path == subdir_name
    assert artifacts[1].is_dir is True
    assert artifacts[1].file_size is None


def test_log_artifact(mock_client, tmp_path):
    repo = GCSArtifactRepository("gs://test_bucket/some/path", client=mock_client)

    d = tmp_path.joinpath("data")
    d.mkdir()
    f = d.joinpath("test.txt")
    f.write_text("hello world!")
    fpath = d.joinpath("test.txt")
    fpath = str(fpath)

    # This will call isfile on the code path being used,
    # thus testing that it's being called with an actually file path
    def custom_isfile(*args, **kwargs):
        if args:
            return os.path.isfile(args[0])
        return os.path.isfile(kwargs.get("filename"))

    mock_method_chain(
        mock_client,
        [
            "bucket",
            "blob",
            "upload_from_filename",
        ],
        side_effect=custom_isfile,
    )
    repo.log_artifact(fpath)

    mock_client.bucket.assert_called_with("test_bucket")
    mock_client.bucket().blob.assert_called_with(
        "some/path/test.txt", chunk_size=repo._GCS_UPLOAD_CHUNK_SIZE
    )
    mock_client.bucket().blob().upload_from_filename.assert_called_with(
        fpath, timeout=repo._GCS_DEFAULT_TIMEOUT
    )


def test_log_artifacts(mock_client, tmp_path):
    repo = GCSArtifactRepository("gs://test_bucket/some/path", client=mock_client)

    data = tmp_path.joinpath("data")
    data.mkdir()
    subd = data.joinpath("subdir")
    subd.mkdir()
    subd.joinpath("a.txt").write_text("A")
    subd.joinpath("b.txt").write_text("B")
    subd.joinpath("c.txt").write_text("C")

    def custom_isfile(*args, **kwargs):
        if args:
            return os.path.isfile(args[0])
        return os.path.isfile(kwargs.get("filename"))

    mock_method_chain(
        mock_client,
        [
            "bucket",
            "blob",
            "upload_from_filename",
        ],
        side_effect=custom_isfile,
    )
    repo.log_artifacts(subd)

    mock_client.bucket.assert_called_with("test_bucket")
    mock_client.bucket().blob().upload_from_filename.assert_has_calls(
        [
            mock.call(os.path.normpath(f"{subd}/a.txt"), timeout=repo._GCS_DEFAULT_TIMEOUT),
            mock.call(os.path.normpath(f"{subd}/b.txt"), timeout=repo._GCS_DEFAULT_TIMEOUT),
            mock.call(os.path.normpath(f"{subd}/c.txt"), timeout=repo._GCS_DEFAULT_TIMEOUT),
        ],
        any_order=True,
    )


def test_download_artifacts_calls_expected_gcs_client_methods(mock_client, tmp_path):
    repo = GCSArtifactRepository("gs://test_bucket/some/path", client=mock_client)

    def mkfile(fname, **kwargs):
        fname = os.path.basename(fname)
        f = tmp_path.joinpath(fname)
        f.write_text("hello world!")

    mock_method_chain(
        mock_client,
        [
            "bucket",
            "blob",
            "download_to_filename",
        ],
        side_effect=mkfile,
    )

    repo.download_artifacts("test.txt")
    assert tmp_path.joinpath("test.txt").exists()
    mock_client.bucket.assert_called_with("test_bucket")
    mock_client.bucket().blob.assert_called_with(
        "some/path/test.txt", chunk_size=repo._GCS_DOWNLOAD_CHUNK_SIZE
    )
    download_calls = mock_client.bucket().blob().download_to_filename.call_args_list
    assert len(download_calls) == 1
    download_path_arg = download_calls[0][0][0]
    assert "test.txt" in download_path_arg


def test_get_anonymous_bucket():
    with mock.patch("google.cloud.storage", autospec=True) as gcs_mock:
        gcs_mock.Client.side_effect = DefaultCredentialsError("Test")
        repo = GCSArtifactRepository("gs://test_bucket")
        repo._get_bucket("gs://test_bucket")
        anon_call_count = gcs_mock.Client.create_anonymous_client.call_count
        assert anon_call_count == 1
        bucket_call_count = gcs_mock.Client.create_anonymous_client.return_value.bucket.call_count
        assert bucket_call_count == 1


def test_download_artifacts_downloads_expected_content(mock_client, tmp_path):
    artifact_root_path = "/experiment_id/run_id/"
    repo = GCSArtifactRepository("gs://test_bucket" + artifact_root_path, client=mock_client)

    obj_mock_1 = mock.Mock()
    file_path_1 = "file1"
    obj_mock_1.configure_mock(name=os.path.join(artifact_root_path, file_path_1), size=1)
    obj_mock_2 = mock.Mock()
    file_path_2 = "file2"
    obj_mock_2.configure_mock(name=os.path.join(artifact_root_path, file_path_2), size=1)
    mock_populated_results = mock.MagicMock()
    mock_populated_results.__iter__.return_value = [obj_mock_1, obj_mock_2]

    mock_empty_results = mock.MagicMock()
    mock_empty_results.__iter__.return_value = []

    def get_mock_listing(prefix, **kwargs):
        """
        Produces a mock listing that only contains content if the
        specified prefix is the artifact root. This allows us to mock
        `list_artifacts` during the `_download_artifacts_into` subroutine
        without recursively listing the same artifacts at every level of the
        directory traversal.
        """

        prefix = os.path.join("/", prefix)
        if os.path.abspath(prefix) == os.path.abspath(artifact_root_path):
            return mock_populated_results
        else:
            return mock_empty_results

    def mkfile(fname, **kwargs):
        fname = os.path.basename(fname)
        f = tmp_path.joinpath(fname)
        f.write_text("hello world!")

    mock_method_chain(
        mock_client,
        [
            "bucket",
            "list_blobs",
        ],
        side_effect=get_mock_listing,
    )
    mock_method_chain(
        mock_client,
        [
            "bucket",
            "blob",
            "download_to_filename",
        ],
        side_effect=mkfile,
    )

    # Ensure that the root directory can be downloaded successfully
    repo.download_artifacts("")
    # Ensure that the `mkfile` side effect copied all of the download artifacts into `tmpdir`
    dir_contents = os.listdir(tmp_path)
    assert file_path_1 in dir_contents
    assert file_path_2 in dir_contents


def test_delete_artifacts(mock_client):
    experiment_root_path = "/experiment_id/"
    repo = GCSArtifactRepository("gs://test_bucket" + experiment_root_path, client=mock_client)

    def delete_file():
        del obj_mock.name
        del obj_mock.size
        return obj_mock

    obj_mock = mock.Mock()
    run_id_path = experiment_root_path + "run_id/"
    file_path = "file"
    attrs = {"name": run_id_path + file_path, "size": 1, "delete.side_effect": delete_file}
    obj_mock.configure_mock(**attrs)

    def get_mock_listing(prefix, **kwargs):
        """
        Produces a mock listing that only contains content if the
        specified prefix is the artifact root. This allows us to mock
        `list_artifacts` during the `_download_artifacts_into` subroutine
        without recursively listing the same artifacts at every level of the
        directory traversal.
        """

        if hasattr(obj_mock, "name") and hasattr(obj_mock, "size"):
            mock_results = mock.MagicMock()
            mock_results.__iter__.return_value = [obj_mock]
            return mock_results
        else:
            mock_empty_results = mock.MagicMock()
            mock_empty_results.__iter__.return_value = []
            return mock_empty_results

    mock_method_chain(
        mock_client,
        [
            "bucket",
            "list_blobs",
        ],
        side_effect=get_mock_listing,
    )

    artifact_file_names = [obj.path for obj in repo.list_artifacts()]
    assert "run_id/file" in artifact_file_names
    repo.delete_artifacts()
    artifact_file_names = [obj.path for obj in repo.list_artifacts()]
    assert not artifact_file_names


def test_gcs_mpu_arguments():
    artifact_root_path = "/experiment_id/run_id/"
    repo = GCSArtifactRepository("gs://test_bucket" + artifact_root_path, client=mock_client)
    requests_session = requests.Session()
    mock_blob = mock.MagicMock()
    mock_blob.name = "experiment_id/run_id/file.txt"
    mock_blob.bucket.name = "test_bucket"
    mock_blob.kms_key_name = None
    mock_blob.user_project = None
    mock_blob._get_upload_arguments.return_value = {}, {}, "application/octet-stream"
    mock_blob._get_transport.return_value = requests_session
    mock_blob.client._connection.get_api_base_url_for_mtls.return_value = "gcs_base_url"
    args = repo._gcs_mpu_arguments("file.txt", mock_blob)
    assert args.transport == requests_session
    assert args.url == "gcs_base_url/test_bucket/experiment_id/run_id/file.txt"
    assert args.headers == {}
    assert args.content_type == "application/octet-stream"


def test_create_multipart_upload(mock_client):
    artifact_root_path = "experiment_id/run_id/"
    bucket_name = "test_bucket"
    file_name = "file.txt"
    gcs_base_url = "gcs_base_url"
    repo = GCSArtifactRepository("gs://test_bucket" + artifact_root_path, client=mock_client)

    gcs_mpu_arguments_patch = mock.patch(
        "mlflow.store.artifact.gcs_artifact_repo.GCSArtifactRepository._gcs_mpu_arguments",
        return_value=GCSMPUArguments(
            requests.Session(),
            f"{gcs_base_url}/{bucket_name}/{artifact_root_path}/{file_name}",
            {},
            "application/octet-stream",
        ),
    )

    # mock the XML API response of initiate multipart upload
    # see https://cloud.google.com/storage/docs/xml-api/post-object-multipart#example
    upload_id = "some_upload_id"
    resp = mock.Mock(status_code=200)
    resp.text = f"""<?xml version="1.0" encoding="UTF-8"?>
<InitiateMultipartUploadResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
  <Bucket>{bucket_name}</Bucket>
  <Key>{file_name}</Key>
  <UploadId>{upload_id}</UploadId>
</InitiateMultipartUploadResult>"""

    with (
        gcs_mpu_arguments_patch,
        mock.patch("requests.Session.request", return_value=resp) as request_mock,
    ):
        create = repo.create_multipart_upload(
            file_name, num_parts=5, artifact_path=artifact_root_path
        )
        request_mock.assert_called_once()
        args, kwargs = request_mock.call_args
        assert args == (
            "POST",
            f"{gcs_base_url}/{bucket_name}/{artifact_root_path}/{file_name}?uploads",
        )
        assert len(create.credentials) == 5
        assert create.upload_id == upload_id
        assert kwargs["data"] is None


def test_complete_multipart_upload(mock_client):
    artifact_root_path = "experiment_id/run_id/"
    bucket_name = "test_bucket"
    file_name = "file.txt"
    gcs_base_url = "gcs_base_url"
    repo = GCSArtifactRepository("gs://test_bucket" + artifact_root_path, client=mock_client)

    upload_id = "some_upload_id"
    parts = [
        MultipartUploadPart(part_number=part_number, etag=f"etag_{part_number}")
        for part_number in range(1, 3)
    ]

    gcs_mpu_arguments_patch = mock.patch(
        "mlflow.store.artifact.gcs_artifact_repo.GCSArtifactRepository._gcs_mpu_arguments",
        return_value=GCSMPUArguments(
            requests.Session(),
            f"{gcs_base_url}/{bucket_name}/{artifact_root_path}/{file_name}",
            {},
            "application/octet-stream",
        ),
    )

    # See https://cloud.google.com/storage/docs/xml-api/post-object-complete
    expected_payload = (
        b"<CompleteMultipartUpload>"
        b"<Part><PartNumber>1</PartNumber>"
        b"<ETag>etag_1</ETag></Part>"
        b"<Part><PartNumber>2</PartNumber>"
        b"<ETag>etag_2</ETag></Part>"
        b"</CompleteMultipartUpload>"
    )

    resp = mock.Mock(status_code=200)
    with (
        gcs_mpu_arguments_patch,
        mock.patch("requests.Session.request", return_value=resp) as request_mock,
    ):
        repo.complete_multipart_upload(file_name, upload_id, parts, artifact_root_path)
        request_mock.assert_called_once()
        args, kwargs = request_mock.call_args
        assert args == (
            "POST",
            f"{gcs_base_url}/{bucket_name}/{artifact_root_path}/{file_name}?uploadId={upload_id}",
        )
        assert kwargs["data"] == expected_payload


def test_abort_multipart_upload(mock_client):
    artifact_root_path = "experiment_id/run_id/"
    bucket_name = "test_bucket"
    file_name = "file.txt"
    gcs_base_url = "gcs_base_url"
    repo = GCSArtifactRepository("gs://test_bucket" + artifact_root_path, client=mock_client)

    upload_id = "some_upload_id"
    gcs_mpu_arguments_patch = mock.patch(
        "mlflow.store.artifact.gcs_artifact_repo.GCSArtifactRepository._gcs_mpu_arguments",
        return_value=GCSMPUArguments(
            requests.Session(),
            f"{gcs_base_url}/{bucket_name}/{artifact_root_path}/{file_name}",
            {},
            "application/octet-stream",
        ),
    )

    resp = mock.Mock(status_code=204)
    with (
        gcs_mpu_arguments_patch,
        mock.patch("requests.Session.request", return_value=resp) as request_mock,
    ):
        repo.abort_multipart_upload(file_name, upload_id, artifact_root_path)
        request_mock.assert_called_once()
        args, kwargs = request_mock.call_args
        assert args == (
            "DELETE",
            f"{gcs_base_url}/{bucket_name}/{artifact_root_path}/{file_name}?uploadId={upload_id}",
        )
        assert kwargs["data"] is None


@pytest.mark.parametrize("throw", [True, False])
def test_retryable_log_artifacts(throw, tmp_path):
    with (
        mock.patch("google.cloud.storage.Client") as mock_gcs_client_factory,
        mock.patch("google.oauth2.credentials.Credentials") as mock_gcs_credentials_factory,
    ):
        gcs_client_mock = mock.Mock()
        gcs_bucket_mock = mock.Mock()
        gcs_client_mock.bucket.return_value = gcs_bucket_mock

        gcs_refreshed_client_mock = mock.Mock()
        gcs_refreshed_bucket_mock = mock.Mock()
        gcs_refreshed_client_mock.bucket.return_value = gcs_refreshed_bucket_mock
        mock_gcs_client_factory.return_value = gcs_refreshed_client_mock

        def exception_thrown_side_effect_func(*args, **kwargs):
            if throw:
                raise Exception("Test Exception")
            return None

        def success_side_effect_func(*args, **kwargs):
            return None

        def creds_func():
            return {"oauth_token": "new_creds"}

        gcs_bucket_mock.blob.return_value.upload_from_filename.side_effect = (
            exception_thrown_side_effect_func
        )
        gcs_refreshed_bucket_mock.blob.return_value.upload_from_filename.side_effect = (
            success_side_effect_func
        )

        repo = GCSArtifactRepository(
            artifact_uri="gs://test_bucket/test_root/",
            client=gcs_client_mock,
            credential_refresh_def=creds_func,
        )

        data = tmp_path.joinpath("data")
        data.mkdir()
        subd = data.joinpath("subdir")
        subd.mkdir()
        subd.joinpath("a.txt").write_text("A")

        repo.log_artifacts(subd)

        if throw:
            gcs_bucket_mock.blob.assert_called_once()
            gcs_refreshed_bucket_mock.blob.assert_called_once()
            mock_gcs_client_factory.assert_called_once()
            mock_gcs_credentials_factory.assert_called_once()
        else:
            gcs_bucket_mock.blob.assert_called_once()
            gcs_refreshed_bucket_mock.blob.assert_not_called()
            mock_gcs_client_factory.assert_not_called()
            mock_gcs_credentials_factory.assert_not_called()
```

--------------------------------------------------------------------------------

````
