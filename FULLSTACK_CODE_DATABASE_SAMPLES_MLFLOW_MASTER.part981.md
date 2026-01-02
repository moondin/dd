---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:55Z
part: 981
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 981 of 991)

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

---[FILE: test_file_utils.py]---
Location: mlflow-master/tests/utils/test_file_utils.py

```python
import filecmp
import hashlib
import os
import shutil
import stat
import tarfile

import pandas as pd
import pytest
from pyspark.sql import SparkSession

import mlflow
from mlflow.utils import file_utils
from mlflow.utils.file_utils import (
    TempDir,
    _copy_file_or_tree,
    _handle_readonly_on_windows,
    get_parent_dir,
    get_total_file_size,
    local_file_uri_to_path,
    read_parquet_as_pandas_df,
    write_pandas_df_as_parquet,
    write_spark_dataframe_to_parquet_on_local_disk,
)
from mlflow.utils.os import is_windows

from tests.helper_functions import random_int
from tests.projects.utils import TEST_PROJECT_DIR


@pytest.fixture(scope="module")
def spark_session():
    with SparkSession.builder.master("local[*]").getOrCreate() as session:
        yield session


def test_mkdir(tmp_path):
    temp_dir = str(tmp_path)
    new_dir_name = f"mkdir_test_{random_int()}"
    file_utils.mkdir(temp_dir, new_dir_name)
    assert os.listdir(temp_dir) == [new_dir_name]

    with pytest.raises(OSError, match="bad directory"):
        file_utils.mkdir("/   bad directory @ name ", "ouch")

    # does not raise if directory exists already
    file_utils.mkdir(temp_dir, new_dir_name)

    # raises if it exists already but is a file
    dummy_file_path = str(tmp_path.joinpath("dummy_file"))
    with open(dummy_file_path, "a"):
        pass

    with pytest.raises(OSError, match="exists"):
        file_utils.mkdir(dummy_file_path)


def test_make_tarfile(tmp_path):
    # Tar a local project
    tarfile0 = str(tmp_path.joinpath("first-tarfile"))
    file_utils.make_tarfile(
        output_filename=tarfile0, source_dir=TEST_PROJECT_DIR, archive_name="some-archive"
    )
    # Copy local project into a temp dir
    dst_dir = str(tmp_path.joinpath("project-directory"))
    shutil.copytree(TEST_PROJECT_DIR, dst_dir)
    # Tar the copied project
    tarfile1 = str(tmp_path.joinpath("second-tarfile"))
    file_utils.make_tarfile(
        output_filename=tarfile1, source_dir=dst_dir, archive_name="some-archive"
    )
    # Compare the archives & explicitly verify their SHA256 hashes match (i.e. that
    # changes in file modification timestamps don't affect the archive contents)
    assert filecmp.cmp(tarfile0, tarfile1, shallow=False)
    with open(tarfile0, "rb") as first_tar, open(tarfile1, "rb") as second_tar:
        assert (
            hashlib.sha256(first_tar.read()).hexdigest()
            == hashlib.sha256(second_tar.read()).hexdigest()
        )
    # Extract the TAR and check that its contents match the original directory
    extract_dir = str(tmp_path.joinpath("extracted-tar"))
    os.makedirs(extract_dir)
    with tarfile.open(tarfile0, "r:gz") as handle:
        handle.extractall(path=extract_dir)
    dir_comparison = filecmp.dircmp(os.path.join(extract_dir, "some-archive"), TEST_PROJECT_DIR)
    assert len(dir_comparison.left_only) == 0
    assert len(dir_comparison.right_only) == 0
    assert len(dir_comparison.diff_files) == 0
    assert len(dir_comparison.funny_files) == 0


def test_get_parent_dir(tmp_path):
    child_dir = tmp_path.joinpath("dir")
    child_dir.mkdir()
    assert str(tmp_path) == get_parent_dir(str(child_dir))


def test_file_copy():
    with TempDir() as tmp:
        file_path = tmp.path("test_file.txt")
        copy_path = tmp.path("test_dir1/")
        os.mkdir(copy_path)
        with open(file_path, "a") as f:
            f.write("testing")
        _copy_file_or_tree(file_path, copy_path, "")
        assert filecmp.cmp(file_path, os.path.join(copy_path, "test_file.txt"))


def test_dir_create():
    with TempDir() as tmp:
        file_path = tmp.path("test_file.txt")
        create_dir = tmp.path("test_dir2/")
        with open(file_path, "a") as f:
            f.write("testing")
        name = _copy_file_or_tree(file_path, file_path, create_dir)
        assert filecmp.cmp(file_path, name)


def test_dir_copy():
    with TempDir() as tmp:
        dir_path = tmp.path("test_dir1/")
        copy_path = tmp.path("test_dir2")
        os.mkdir(dir_path)
        with open(os.path.join(dir_path, "test_file.txt"), "a") as f:
            f.write("testing")
        _copy_file_or_tree(dir_path, copy_path, "")
        assert filecmp.dircmp(dir_path, copy_path)


def test_read_and_write_parquet(tmp_path):
    file_source = tmp_path.joinpath("sample-file-to-write")
    data_frame = pd.DataFrame({"horizon": 10, "frequency": "W"}, index=[0])
    write_pandas_df_as_parquet(data_frame, file_source)
    serialized_data_frame = read_parquet_as_pandas_df(file_source)
    pd.testing.assert_frame_equal(data_frame, serialized_data_frame)


def test_write_spark_df_to_parquet(spark_session, tmp_path):
    sdf = spark_session.createDataFrame(
        [
            (0, "a b c d e spark", 1.0),
            (1, "b d", 0.0),
            (2, "spark f g h", 1.0),
            (3, "hadoop mapreduce", 0.0),
        ],
        ["id", "text", "label"],
    )
    output_path = str(tmp_path / "output")
    write_spark_dataframe_to_parquet_on_local_disk(sdf, output_path)
    pd.testing.assert_frame_equal(sdf.toPandas(), pd.read_parquet(output_path))


@pytest.mark.skipif(not is_windows(), reason="requires Windows")
def test_handle_readonly_on_windows(tmp_path):
    tmp_path = tmp_path.joinpath("file")
    with open(tmp_path, "w"):
        pass

    # Make the file read-only
    os.chmod(tmp_path, stat.S_IREAD | stat.S_IRGRP | stat.S_IROTH)
    # Ensure the file can't be removed
    with pytest.raises(PermissionError, match="Access is denied") as exc:
        os.unlink(tmp_path)

    _handle_readonly_on_windows(
        os.unlink,
        tmp_path,
        (exc.type, exc.value, exc.traceback),
    )
    assert not os.path.exists(tmp_path)


@pytest.mark.skipif(not is_windows(), reason="This test only passes on Windows")
@pytest.mark.parametrize(
    ("input_uri", "expected_path"),
    [
        (r"\\my_server\my_path\my_sub_path", r"\\my_server\my_path\my_sub_path"),
    ],
)
def test_local_file_uri_to_path_on_windows(input_uri, expected_path):
    assert local_file_uri_to_path(input_uri) == expected_path


def test_shutil_copytree_without_file_permissions(tmp_path):
    src_dir = tmp_path.joinpath("src-dir")
    src_dir.mkdir()
    dst_dir = tmp_path.joinpath("dst-dir")
    dst_dir.mkdir()
    # Test copying empty directory
    mlflow.utils.file_utils.shutil_copytree_without_file_permissions(src_dir, dst_dir)
    assert len(os.listdir(dst_dir)) == 0
    # Test copying directory with contents
    src_dir.joinpath("subdir").mkdir()
    src_dir.joinpath("subdir/subdir-file.txt").write_text("testing 123")
    src_dir.joinpath("top-level-file.txt").write_text("hi")
    mlflow.utils.file_utils.shutil_copytree_without_file_permissions(src_dir, dst_dir)
    assert set(os.listdir(dst_dir)) == {"top-level-file.txt", "subdir"}
    assert set(os.listdir(dst_dir.joinpath("subdir"))) == {"subdir-file.txt"}
    assert dst_dir.joinpath("subdir/subdir-file.txt").read_text() == "testing 123"
    assert dst_dir.joinpath("top-level-file.txt").read_text() == "hi"


def test_get_total_size_basic(tmp_path):
    subdir = tmp_path.joinpath("subdir")
    subdir.mkdir()

    def generate_file(path, size_in_bytes):
        with path.open("wb") as fp:
            fp.write(b"\0" * size_in_bytes)

    file_size_map = {"file1.txt": 11, "file2.txt": 23}
    for name, size in file_size_map.items():
        generate_file(tmp_path.joinpath(name), size)
    generate_file(subdir.joinpath("file3.txt"), 22)
    assert get_total_file_size(tmp_path) == 56
    assert get_total_file_size(subdir) == 22

    path_not_exists = tmp_path.joinpath("does_not_exist")
    assert get_total_file_size(path_not_exists) is None

    path_file = tmp_path.joinpath("file1.txt")
    assert get_total_file_size(path_file) is None
```

--------------------------------------------------------------------------------

---[FILE: test_gorilla.py]---
Location: mlflow-master/tests/utils/test_gorilla.py

```python
import pytest

from mlflow.utils import gorilla


class Delegator:
    def __init__(self, delegated_fn):
        self.delegated_fn = delegated_fn

    def __get__(self, instance, owner):
        return self.delegated_fn


def delegate(delegated_fn):
    return lambda fn: Delegator(delegated_fn)


def gen_class_A_B():
    class A:
        def f1(self):
            pass

        def f2(self):
            pass

        def delegated_f3(self):
            pass

        @delegate(delegated_f3)
        def f3(self):
            pass

    class B(A):
        def f1(self):
            pass

    return A, B


@pytest.fixture
def gorilla_setting():
    return gorilla.Settings(allow_hit=True, store_hit=True)


def test_basic_patch_for_class(gorilla_setting):
    A, B = gen_class_A_B()

    original_A_f1 = A.f1
    original_A_f2 = A.f2
    original_B_f1 = B.f1

    def patched_A_f1(self):
        pass

    def patched_A_f2(self):
        pass

    def patched_B_f1(self):
        pass

    patch_A_f1 = gorilla.Patch(A, "f1", patched_A_f1, gorilla_setting)
    patch_A_f2 = gorilla.Patch(A, "f2", patched_A_f2, gorilla_setting)
    patch_B_f1 = gorilla.Patch(B, "f1", patched_B_f1, gorilla_setting)

    assert gorilla.get_original_attribute(A, "f1") is original_A_f1
    assert gorilla.get_original_attribute(B, "f1") is original_B_f1
    assert gorilla.get_original_attribute(B, "f2") is original_A_f2

    gorilla.apply(patch_A_f1)
    assert A.f1 is patched_A_f1
    assert gorilla.get_original_attribute(A, "f1") is original_A_f1
    assert gorilla.get_original_attribute(B, "f1") is original_B_f1

    gorilla.apply(patch_B_f1)
    assert A.f1 is patched_A_f1
    assert B.f1 is patched_B_f1
    assert gorilla.get_original_attribute(A, "f1") is original_A_f1
    assert gorilla.get_original_attribute(B, "f1") is original_B_f1

    gorilla.apply(patch_A_f2)
    assert A.f2 is patched_A_f2
    assert B.f2 is patched_A_f2
    assert gorilla.get_original_attribute(A, "f2") is original_A_f2
    assert gorilla.get_original_attribute(B, "f2") is original_A_f2

    gorilla.revert(patch_A_f2)
    assert A.f2 is original_A_f2
    assert B.f2 is original_A_f2
    assert gorilla.get_original_attribute(A, "f2") == original_A_f2
    assert gorilla.get_original_attribute(B, "f2") == original_A_f2

    gorilla.revert(patch_B_f1)
    assert A.f1 is patched_A_f1
    assert B.f1 is original_B_f1
    assert gorilla.get_original_attribute(A, "f1") == original_A_f1
    assert gorilla.get_original_attribute(B, "f1") == original_B_f1

    gorilla.revert(patch_A_f1)
    assert A.f1 is original_A_f1
    assert B.f1 is original_B_f1
    assert gorilla.get_original_attribute(A, "f1") == original_A_f1
    assert gorilla.get_original_attribute(B, "f1") == original_B_f1


def test_patch_for_descriptor(gorilla_setting):
    A, _ = gen_class_A_B()

    original_A_f3_raw = object.__getattribute__(A, "f3")

    def patched_A_f3(self):
        pass

    patch_A_f3 = gorilla.Patch(A, "f3", patched_A_f3, gorilla_setting)

    assert gorilla.get_original_attribute(A, "f3") is A.delegated_f3
    assert (
        gorilla.get_original_attribute(A, "f3", bypass_descriptor_protocol=True)
        is original_A_f3_raw
    )

    gorilla.apply(patch_A_f3)
    assert A.f3 is patched_A_f3
    assert gorilla.get_original_attribute(A, "f3") is A.delegated_f3
    assert (
        gorilla.get_original_attribute(A, "f3", bypass_descriptor_protocol=True)
        is original_A_f3_raw
    )

    gorilla.revert(patch_A_f3)
    assert A.f3 is A.delegated_f3
    assert gorilla.get_original_attribute(A, "f3") is A.delegated_f3
    assert (
        gorilla.get_original_attribute(A, "f3", bypass_descriptor_protocol=True)
        is original_A_f3_raw
    )

    # test patch a descriptor
    @delegate(patched_A_f3)
    def new_patched_A_f3(self):
        pass

    new_patch_A_f3 = gorilla.Patch(A, "f3", new_patched_A_f3, gorilla_setting)
    gorilla.apply(new_patch_A_f3)
    assert A.f3 is patched_A_f3
    assert object.__getattribute__(A, "f3") is new_patched_A_f3
    assert gorilla.get_original_attribute(A, "f3") is A.delegated_f3
    assert (
        gorilla.get_original_attribute(A, "f3", bypass_descriptor_protocol=True)
        is original_A_f3_raw
    )


@pytest.mark.parametrize("store_hit", [True, False])
def test_patch_on_inherit_method(store_hit):
    A, B = gen_class_A_B()

    original_A_f2 = A.f2

    def patched_B_f2(self):
        pass

    gorilla_setting = gorilla.Settings(allow_hit=True, store_hit=store_hit)
    patch_B_f2 = gorilla.Patch(B, "f2", patched_B_f2, gorilla_setting)
    gorilla.apply(patch_B_f2)

    assert B.f2 is patched_B_f2

    assert gorilla.get_original_attribute(B, "f2") is original_A_f2

    gorilla.revert(patch_B_f2)
    assert B.f2 is original_A_f2
    assert gorilla.get_original_attribute(B, "f2") is original_A_f2
    assert "f2" not in B.__dict__  # assert no side effect after reverting


@pytest.mark.parametrize("store_hit", [True, False])
def test_patch_on_attribute_not_exist(store_hit):
    A, _ = gen_class_A_B()

    def patched_fx(self):
        return 101

    gorilla_setting = gorilla.Settings(allow_hit=True, store_hit=store_hit)
    fx_patch = gorilla.Patch(A, "fx", patched_fx, gorilla_setting)
    gorilla.apply(fx_patch)
    a1 = A()
    assert a1.fx() == 101
    gorilla.revert(fx_patch)
    assert not hasattr(A, "fx")
```

--------------------------------------------------------------------------------

---[FILE: test_jsonpath_utils.py]---
Location: mlflow-master/tests/utils/test_jsonpath_utils.py

```python
import pytest

from mlflow.utils.jsonpath_utils import (
    filter_json_by_fields,
    jsonpath_extract_values,
    split_path_respecting_backticks,
    validate_field_paths,
)


def test_jsonpath_extract_values_simple():
    data = {"info": {"trace_id": "tr-123", "state": "OK"}}
    values = jsonpath_extract_values(data, "info.trace_id")
    assert values == ["tr-123"]


def test_jsonpath_extract_values_nested():
    data = {"info": {"metadata": {"user": "test@example.com"}}}
    values = jsonpath_extract_values(data, "info.metadata.user")
    assert values == ["test@example.com"]


def test_jsonpath_extract_values_wildcard_array():
    data = {"info": {"assessments": [{"feedback": {"value": 0.8}}, {"feedback": {"value": 0.9}}]}}
    values = jsonpath_extract_values(data, "info.assessments.*.feedback.value")
    assert values == [0.8, 0.9]


def test_jsonpath_extract_values_wildcard_dict():
    data = {"data": {"spans": {"span1": {"name": "first"}, "span2": {"name": "second"}}}}
    values = jsonpath_extract_values(data, "data.spans.*.name")
    assert set(values) == {"first", "second"}  # Order may vary with dict


def test_jsonpath_extract_values_missing_field():
    data = {"info": {"trace_id": "tr-123"}}
    values = jsonpath_extract_values(data, "info.nonexistent")
    assert values == []


def test_jsonpath_extract_values_partial_path_missing():
    data = {"info": {"trace_id": "tr-123"}}
    values = jsonpath_extract_values(data, "info.metadata.user")
    assert values == []


@pytest.mark.parametrize(
    ("input_string", "expected"),
    [
        ("info.trace_id", ["info", "trace_id"]),
        ("info.tags.`mlflow.traceName`", ["info", "tags", "mlflow.traceName"]),
        ("`field.one`.middle.`field.two`", ["field.one", "middle", "field.two"]),
        ("`mlflow.traceName`.value", ["mlflow.traceName", "value"]),
        ("info.`mlflow.traceName`", ["info", "mlflow.traceName"]),
    ],
)
def test_split_path_respecting_backticks(input_string, expected):
    assert split_path_respecting_backticks(input_string) == expected


def test_jsonpath_extract_values_with_backticks():
    # Field name with dot
    data = {"tags": {"mlflow.traceName": "test_trace"}}
    values = jsonpath_extract_values(data, "tags.`mlflow.traceName`")
    assert values == ["test_trace"]

    # Nested structure with dotted field names
    data = {"info": {"tags": {"mlflow.traceName": "my_trace", "user.id": "user123"}}}
    assert jsonpath_extract_values(data, "info.tags.`mlflow.traceName`") == ["my_trace"]
    assert jsonpath_extract_values(data, "info.tags.`user.id`") == ["user123"]

    # Mixed regular and backticked fields
    data = {"metadata": {"mlflow.source.type": "NOTEBOOK", "regular_field": "value"}}
    assert jsonpath_extract_values(data, "metadata.`mlflow.source.type`") == ["NOTEBOOK"]
    assert jsonpath_extract_values(data, "metadata.regular_field") == ["value"]


def test_jsonpath_extract_values_empty_array():
    data = {"info": {"assessments": []}}
    values = jsonpath_extract_values(data, "info.assessments.*.feedback.value")
    assert values == []


def test_jsonpath_extract_values_mixed_types():
    data = {
        "data": {
            "spans": [
                {"attributes": {"key1": "value1"}},
                {"attributes": {"key1": 42}},
                {"attributes": {"key1": True}},
            ]
        }
    }
    values = jsonpath_extract_values(data, "data.spans.*.attributes.key1")
    assert values == ["value1", 42, True]


def test_filter_json_by_fields_single_field():
    data = {"info": {"trace_id": "tr-123", "state": "OK"}, "data": {"spans": []}}
    filtered = filter_json_by_fields(data, ["info.trace_id"])
    expected = {"info": {"trace_id": "tr-123"}}
    assert filtered == expected


def test_filter_json_by_fields_multiple_fields():
    data = {
        "info": {"trace_id": "tr-123", "state": "OK", "unused": "value"},
        "data": {"spans": [], "metadata": {}},
    }
    filtered = filter_json_by_fields(data, ["info.trace_id", "info.state"])
    expected = {"info": {"trace_id": "tr-123", "state": "OK"}}
    assert filtered == expected


def test_filter_json_by_fields_wildcards():
    data = {
        "info": {
            "assessments": [
                {"feedback": {"value": 0.8}, "unused": "data"},
                {"feedback": {"value": 0.9}, "unused": "data"},
            ]
        }
    }
    filtered = filter_json_by_fields(data, ["info.assessments.*.feedback.value"])
    expected = {
        "info": {"assessments": [{"feedback": {"value": 0.8}}, {"feedback": {"value": 0.9}}]}
    }
    assert filtered == expected


def test_filter_json_by_fields_nested_arrays():
    data = {
        "data": {
            "spans": [
                {
                    "name": "span1",
                    "events": [
                        {"name": "event1", "data": "d1"},
                        {"name": "event2", "data": "d2"},
                    ],
                    "unused": "value",
                }
            ]
        }
    }
    filtered = filter_json_by_fields(data, ["data.spans.*.events.*.name"])
    expected = {"data": {"spans": [{"events": [{"name": "event1"}, {"name": "event2"}]}]}}
    assert filtered == expected


def test_filter_json_by_fields_missing_paths():
    data = {"info": {"trace_id": "tr-123"}}
    filtered = filter_json_by_fields(data, ["info.nonexistent", "missing.path"])
    assert filtered == {}


def test_filter_json_by_fields_partial_matches():
    data = {"info": {"trace_id": "tr-123", "state": "OK"}}
    filtered = filter_json_by_fields(data, ["info.trace_id", "info.nonexistent"])
    expected = {"info": {"trace_id": "tr-123"}}
    assert filtered == expected


def test_validate_field_paths_valid():
    data = {"info": {"trace_id": "tr-123", "assessments": [{"feedback": {"value": 0.8}}]}}
    # Should not raise any exception
    validate_field_paths(["info.trace_id", "info.assessments.*.feedback.value"], data)


def test_validate_field_paths_invalid():
    data = {"info": {"trace_id": "tr-123"}}

    with pytest.raises(ValueError, match="Invalid field path") as exc_info:
        validate_field_paths(["info.nonexistent"], data)

    assert "Invalid field path" in str(exc_info.value)
    assert "info.nonexistent" in str(exc_info.value)


def test_validate_field_paths_multiple_invalid():
    data = {"info": {"trace_id": "tr-123"}}

    with pytest.raises(ValueError, match="Invalid field path") as exc_info:
        validate_field_paths(["info.missing", "other.invalid"], data)

    error_msg = str(exc_info.value)
    assert "Invalid field path" in error_msg
    # Should mention both invalid paths
    assert "info.missing" in error_msg or "other.invalid" in error_msg


def test_validate_field_paths_suggestions():
    data = {"info": {"trace_id": "tr-123", "assessments": [], "metadata": {}}}

    with pytest.raises(ValueError, match="Invalid field path") as exc_info:
        validate_field_paths(["info.traces"], data)  # Close to "trace_id"

    error_msg = str(exc_info.value)
    assert "Available fields" in error_msg
    assert "info.trace_id" in error_msg


def test_complex_trace_structure():
    trace_data = {
        "info": {
            "trace_id": "tr-abc123def",
            "state": "OK",
            "execution_duration": 1500,
            "assessments": [
                {
                    "assessment_id": "a-123",
                    "feedback": {"value": 0.85},
                    "source": {"source_type": "HUMAN", "source_id": "user@example.com"},
                }
            ],
            "tags": {"environment": "production", "mlflow.traceName": "test_trace"},
        },
        "data": {
            "spans": [
                {
                    "span_id": "span-1",
                    "name": "root_span",
                    "attributes": {"mlflow.spanType": "AGENT"},
                    "events": [{"name": "start", "attributes": {"key": "value"}}],
                }
            ]
        },
    }

    # Test various field extractions
    assert jsonpath_extract_values(trace_data, "info.trace_id") == ["tr-abc123def"]
    assert jsonpath_extract_values(trace_data, "info.assessments.*.feedback.value") == [0.85]
    assert jsonpath_extract_values(trace_data, "data.spans.*.name") == ["root_span"]
    assert jsonpath_extract_values(trace_data, "data.spans.*.events.*.name") == ["start"]

    # Test filtering preserves structure
    filtered = filter_json_by_fields(
        trace_data, ["info.trace_id", "info.assessments.*.feedback.value", "data.spans.*.name"]
    )

    assert "info" in filtered
    assert filtered["info"]["trace_id"] == "tr-abc123def"
    assert len(filtered["info"]["assessments"]) == 1
    assert filtered["info"]["assessments"][0]["feedback"]["value"] == 0.85
    assert "data" in filtered
    assert len(filtered["data"]["spans"]) == 1
    assert filtered["data"]["spans"][0]["name"] == "root_span"
    # Should not contain other fields
    assert "source" not in filtered["info"]["assessments"][0]
    assert "attributes" not in filtered["data"]["spans"][0]
```

--------------------------------------------------------------------------------

---[FILE: test_logging_utils.py]---
Location: mlflow-master/tests/utils/test_logging_utils.py

```python
import logging
import os
import re
import subprocess
import sys
import uuid
from io import StringIO

import pytest

import mlflow
from mlflow.utils import logging_utils
from mlflow.utils.logging_utils import LOGGING_LINE_FORMAT, eprint, suppress_logs

logger = logging.getLogger(mlflow.__name__)

LOGGING_FNS_TO_TEST = [logger.info, logger.warning, logger.critical, eprint]


@pytest.fixture(autouse=True)
def reset_stderr():
    prev_stderr = sys.stderr
    yield
    sys.stderr = prev_stderr


@pytest.fixture(autouse=True)
def reset_logging_enablement():
    yield
    logging_utils.enable_logging()


@pytest.fixture(autouse=True)
def reset_logging_level():
    level_before = logger.level
    yield
    logger.setLevel(level_before)


class SampleStream:
    def __init__(self):
        self.content = None
        self.flush_count = 0

    def write(self, text):
        self.content = (self.content or "") + text

    def flush(self):
        self.flush_count += 1

    def reset(self):
        self.content = None
        self.flush_count = 0


@pytest.mark.parametrize("logging_fn", LOGGING_FNS_TO_TEST)
def test_event_logging_apis_respect_stderr_reassignment(logging_fn):
    stream1 = SampleStream()
    stream2 = SampleStream()
    message_content = "test message"

    sys.stderr = stream1
    assert stream1.content is None
    logging_fn(message_content)
    assert message_content in stream1.content
    assert stream2.content is None
    stream1.reset()

    sys.stderr = stream2
    assert stream2.content is None
    logging_fn(message_content)
    assert message_content in stream2.content
    assert stream1.content is None


@pytest.mark.parametrize("logging_fn", LOGGING_FNS_TO_TEST)
def test_event_logging_apis_respect_stream_disablement_enablement(logging_fn):
    stream = SampleStream()
    sys.stderr = stream
    message_content = "test message"

    assert stream.content is None
    logging_fn(message_content)
    assert message_content in stream.content
    stream.reset()

    logging_utils.disable_logging()
    logging_fn(message_content)
    assert stream.content is None
    stream.reset()

    logging_utils.enable_logging()
    assert stream.content is None
    logging_fn(message_content)
    assert message_content in stream.content


def test_event_logging_stream_flushes_properly():
    stream = SampleStream()
    sys.stderr = stream

    eprint("foo", flush=True)
    assert "foo" in stream.content
    assert stream.flush_count > 0


def test_debug_logs_emitted_correctly_when_configured():
    stream = SampleStream()
    sys.stderr = stream

    logger.setLevel(logging.DEBUG)
    logger.debug("test debug")
    assert "test debug" in stream.content


def test_suppress_logs():
    module = "test_logger"
    logger = logging.getLogger(module)

    message = "This message should be suppressed."

    capture_stream = StringIO()
    stream_handler = logging.StreamHandler(capture_stream)
    logger.addHandler(stream_handler)

    logger.error(message)
    assert message in capture_stream.getvalue()

    capture_stream.truncate(0)
    with suppress_logs(module, re.compile(r"This .* be suppressed.")):
        logger.error(message)
    assert len(capture_stream.getvalue()) == 0


@pytest.mark.parametrize(
    ("log_level", "expected"),
    [
        ("DEBUG", True),
        ("INFO", False),
        ("NOTSET", False),
    ],
)
def test_logging_level(log_level: str, expected: bool) -> None:
    random_str = str(uuid.uuid4())
    stdout = subprocess.check_output(
        [
            sys.executable,
            "-c",
            f"from mlflow.utils.logging_utils import _debug; _debug({random_str!r})",
        ],
        env=os.environ.copy() | {"MLFLOW_LOGGING_LEVEL": log_level},
        stderr=subprocess.STDOUT,
        text=True,
    )

    assert (random_str in stdout) is expected


@pytest.mark.parametrize(
    "env_var_name",
    ["MLFLOW_CONFIGURE_LOGGING", "MLFLOW_LOGGING_CONFIGURE_LOGGING"],
)
@pytest.mark.parametrize(
    "value",
    ["0", "1"],
)
def test_mlflow_configure_logging_env_var(env_var_name: str, value: str) -> None:
    expected_level = logging.INFO if value == "1" else logging.WARNING
    subprocess.check_call(
        [
            sys.executable,
            "-c",
            f"""
import logging
import mlflow

assert logging.getLogger("mlflow").isEnabledFor({expected_level})
""",
        ],
        env=os.environ.copy() | {env_var_name: value},
    )


@pytest.mark.parametrize("configure_logging", ["0", "1"])
def test_alembic_logging_respects_configure_flag(configure_logging: str, tmp_sqlite_uri: str):
    user_specified_format = "CUSTOM: %(name)s - %(message)s"
    actual_format = user_specified_format if configure_logging == "0" else LOGGING_LINE_FORMAT
    code = f"""
import logging

# user-specified format, this should only take effect if configure_logging is 0
logging.basicConfig(level=logging.INFO, format={user_specified_format!r})

import mlflow

# Check the alembic logger format, which is now configured in _configure_mlflow_loggers
alembic_logger = logging.getLogger("alembic")
if {configure_logging!r} == "1":
    # When MLFLOW_CONFIGURE_LOGGING is enabled, alembic logger has its own handler
    assert len(alembic_logger.handlers) > 0
    actual_format = alembic_logger.handlers[0].formatter._fmt
else:
    # When MLFLOW_CONFIGURE_LOGGING is disabled, alembic logger propagates to root
    assert alembic_logger.propagate
    root_logger = logging.getLogger()
    actual_format = root_logger.handlers[0].formatter._fmt

assert actual_format == {actual_format!r}, actual_format
"""
    subprocess.check_call(
        [sys.executable, "-c", code],
        env={
            **os.environ,
            "MLFLOW_TRACKING_URI": tmp_sqlite_uri,
            "MLFLOW_CONFIGURE_LOGGING": configure_logging,
        },
    )
```

--------------------------------------------------------------------------------

---[FILE: test_mime_type_utils.py]---
Location: mlflow-master/tests/utils/test_mime_type_utils.py

```python
import pytest

from mlflow.utils.mime_type_utils import _guess_mime_type
from mlflow.utils.os import is_windows


@pytest.mark.skipif(is_windows(), reason="This test fails on Windows")
@pytest.mark.parametrize(
    ("file_path", "expected_mime_type"),
    [
        ("c.txt", "text/plain"),
        ("c.pkl", "application/octet-stream"),
        ("/a/b/c.pkl", "application/octet-stream"),
        ("/a/b/c.png", "image/png"),
        ("/a/b/c.pdf", "application/pdf"),
        ("/a/b/MLmodel", "text/plain"),
        ("/a/b/mlproject", "text/plain"),
    ],
)
def test_guess_mime_type(file_path, expected_mime_type):
    assert _guess_mime_type(file_path) == expected_mime_type


@pytest.mark.skipif(not is_windows(), reason="This test only passes on Windows")
@pytest.mark.parametrize(
    ("file_path", "expected_mime_type"),
    [
        ("C:\\a\\b\\c.txt", "text/plain"),
        ("c.txt", "text/plain"),
        ("c.pkl", "application/octet-stream"),
        ("C:\\a\\b\\c.pkl", "application/octet-stream"),
        ("C:\\a\\b\\c.png", "image/png"),
        ("C:\\a\\b\\c.pdf", "application/pdf"),
        ("C:\\a\\b\\MLmodel", "text/plain"),
        ("C:\\a\\b\\mlproject", "text/plain"),
    ],
)
def test_guess_mime_type_on_windows(file_path, expected_mime_type):
    assert _guess_mime_type(file_path) == expected_mime_type
```

--------------------------------------------------------------------------------

---[FILE: test_model_utils.py]---
Location: mlflow-master/tests/utils/test_model_utils.py

```python
import os
import sys
from unittest import mock

import pytest
import sklearn.neighbors as knn
from sklearn import datasets

import mlflow.sklearn
import mlflow.utils.model_utils as mlflow_model_utils
from mlflow.environment_variables import MLFLOW_RECORD_ENV_VARS_IN_MODEL_LOGGING
from mlflow.exceptions import MlflowException
from mlflow.models import Model
from mlflow.utils.file_utils import TempDir
from mlflow.utils.model_utils import env_var_tracker


@pytest.fixture(scope="module")
def sklearn_knn_model():
    iris = datasets.load_iris()
    X = iris.data[:, :2]  # we only take the first two features.
    y = iris.target
    knn_model = knn.KNeighborsClassifier()
    knn_model.fit(X, y)
    return knn_model


@pytest.fixture
def model_path(tmp_path):
    return os.path.join(tmp_path, "model")


def test_get_flavor_configuration_throws_exception_when_requested_flavor_is_missing(
    model_path, sklearn_knn_model
):
    mlflow.sklearn.save_model(sk_model=sklearn_knn_model, path=model_path)

    # The saved model contains the "sklearn" flavor, so this call should succeed
    sklearn_flavor_config = mlflow_model_utils._get_flavor_configuration(
        model_path=model_path, flavor_name=mlflow.sklearn.FLAVOR_NAME
    )
    assert sklearn_flavor_config is not None


def test_get_flavor_configuration_with_present_flavor_returns_expected_configuration(
    sklearn_knn_model, model_path
):
    mlflow.sklearn.save_model(sk_model=sklearn_knn_model, path=model_path)

    sklearn_flavor_config = mlflow_model_utils._get_flavor_configuration(
        model_path=model_path, flavor_name=mlflow.sklearn.FLAVOR_NAME
    )
    model_config = Model.load(os.path.join(model_path, "MLmodel"))
    assert sklearn_flavor_config == model_config.flavors[mlflow.sklearn.FLAVOR_NAME]


def test_add_code_to_system_path(sklearn_knn_model, model_path):
    mlflow.sklearn.save_model(
        sk_model=sklearn_knn_model,
        path=model_path,
        code_paths=[
            "tests/utils/test_resources/dummy_module.py",
            "tests/utils/test_resources/dummy_package",
        ],
    )

    sklearn_flavor_config = mlflow_model_utils._get_flavor_configuration(
        model_path=model_path, flavor_name=mlflow.sklearn.FLAVOR_NAME
    )
    with TempDir(chdr=True):
        # Load the model from a new directory that is not a parent of the source code path to
        # verify that source code paths and their subdirectories are resolved correctly
        with pytest.raises(ModuleNotFoundError, match="No module named 'dummy_module'"):
            import dummy_module

        mlflow_model_utils._add_code_from_conf_to_system_path(model_path, sklearn_flavor_config)
        import dummy_module  # noqa: F401

    # If this raises an exception it's because dummy_package.test imported
    # dummy_package.operator and not the built-in operator module. This only
    # happens if MLflow is misconfiguring the system path.
    from dummy_package import base  # noqa: F401

    # Ensure that the custom tests/utils/test_resources/dummy_package/pandas.py is not
    # overwriting the 3rd party `pandas` package
    assert "dummy_package" in sys.modules
    assert "pandas" in sys.modules
    assert "site-packages" in sys.modules["pandas"].__file__


def test_add_code_to_system_path_not_copyable_file(sklearn_knn_model, model_path):
    with mock.patch("builtins.open", side_effect=OSError("[Errno 95] Operation not supported")):
        with pytest.raises(MlflowException, match=r"Failed to copy the specified code path"):
            mlflow.sklearn.save_model(
                sk_model=sklearn_knn_model,
                path=model_path,
                code_paths=["tests/utils/test_resources/dummy_module.py"],
            )


def test_env_var_tracker(monkeypatch):
    monkeypatch.setenv("DATABRICKS_HOST", "host")
    assert "DATABRICKS_HOST" in os.environ
    assert "TEST_API_KEY" not in os.environ

    with env_var_tracker() as tracked_env_names:
        assert os.environ["DATABRICKS_HOST"] == "host"
        monkeypatch.setenv("TEST_API_KEY", "key")
        # accessed env var is tracked
        assert os.environ.get("TEST_API_KEY") == "key"
        # test non-existing env vars fetched by `get` are not tracked
        os.environ.get("INVALID_API_KEY", "abc")
        # test non-existing env vars are not tracked
        try:
            os.environ["ANOTHER_API_KEY"]
        except KeyError:
            pass
        assert all(x in tracked_env_names for x in ["DATABRICKS_HOST", "TEST_API_KEY"])
        assert all(x not in tracked_env_names for x in ["INVALID_API_KEY", "ANOTHER_API_KEY"])

    assert isinstance(os.environ, os._Environ)
    assert all(x in os.environ for x in ["DATABRICKS_HOST", "TEST_API_KEY"])
    assert all(x not in os.environ for x in ["INVALID_API_KEY", "ANOTHER_API_KEY"])

    monkeypatch.setenv(MLFLOW_RECORD_ENV_VARS_IN_MODEL_LOGGING.name, "false")
    with env_var_tracker() as env:
        os.environ.get("API_KEY")
        assert env == set()
```

--------------------------------------------------------------------------------

---[FILE: test_name_utils.py]---
Location: mlflow-master/tests/utils/test_name_utils.py

```python
from mlflow.utils.name_utils import _generate_random_name, _generate_unique_integer_id


def test_random_name_generation():
    # Validate exhausted loop truncation
    name = _generate_random_name(max_length=8)
    assert len(name) == 8

    # Validate default behavior while calling 1000 times that names end in integer
    names = [_generate_random_name() for _ in range(1000)]
    assert all(len(name) <= 20 for name in names)
    assert all(name[-1].isnumeric() for name in names)


def test_experiment_id_generation():
    generate_count = 1000000
    generated_values = {_generate_unique_integer_id() for _ in range(generate_count)}

    # validate that in 1 million experiments written to a set, no collisions occur
    assert len(generated_values) == generate_count
```

--------------------------------------------------------------------------------

---[FILE: test_oss_registry_utils.py]---
Location: mlflow-master/tests/utils/test_oss_registry_utils.py

```python
from unittest import mock

import pytest

from mlflow.exceptions import MlflowException
from mlflow.utils.oss_registry_utils import get_oss_host_creds
from mlflow.utils.rest_utils import MlflowHostCreds


@pytest.mark.parametrize(
    ("server_uri", "expected_creds"),
    [
        ("uc:databricks-uc", MlflowHostCreds(host="databricks-uc")),
        ("uc:http://localhost:8081", MlflowHostCreds(host="http://localhost:8081")),
        ("invalid_scheme:http://localhost:8081", MlflowException),
        ("databricks-uc", MlflowException),
    ],
)
def test_get_oss_host_creds(server_uri, expected_creds):
    with mock.patch(
        "mlflow.utils.oss_registry_utils.get_databricks_host_creds",
        return_value=MlflowHostCreds(host="databricks-uc"),
    ):
        if expected_creds == MlflowException:
            with pytest.raises(
                MlflowException, match="The scheme of the server_uri should be 'uc'"
            ):
                get_oss_host_creds(server_uri)
        else:
            actual_creds = get_oss_host_creds(server_uri)
            assert actual_creds == expected_creds


def test_get_databricks_host_creds():
    # Test case: When the scheme is "uc" and the new scheme is "_DATABRICKS_UNITY_CATALOG_SCHEME"
    server_uri = "uc:databricks-uc"
    with mock.patch(
        "mlflow.utils.oss_registry_utils.get_databricks_host_creds", return_value=mock.MagicMock()
    ) as mock_get_databricks_host_creds:
        get_oss_host_creds(server_uri)
        assert mock_get_databricks_host_creds.call_args_list == [mock.call("databricks-uc")]
```

--------------------------------------------------------------------------------

---[FILE: test_process_utils.py]---
Location: mlflow-master/tests/utils/test_process_utils.py

```python
import os
import uuid

import pytest

from mlflow.utils.os import is_windows
from mlflow.utils.process import cache_return_value_per_process


@cache_return_value_per_process
def _gen_random_str1(v):
    return str(v) + uuid.uuid4().hex


@cache_return_value_per_process
def _gen_random_str2(v):
    return str(v) + uuid.uuid4().hex


@cache_return_value_per_process
def _gen_random_no_arg():
    return uuid.uuid4().hex


def test_cache_return_value_per_process():
    path1 = _gen_random_str1(True)
    path2 = _gen_random_str1(True)

    assert path1 == path2

    path3 = _gen_random_str1(False)
    assert path3 != path2

    no_arg_path1 = _gen_random_no_arg()
    no_arg_path2 = _gen_random_no_arg()
    assert no_arg_path1 == no_arg_path2

    with pytest.raises(
        ValueError,
        match="The function decorated by `cache_return_value_per_process` is not allowed to be "
        "called with key-word style arguments.",
    ):
        _gen_random_str1(v=True)

    f2_path1 = _gen_random_str2(True)
    f2_path2 = _gen_random_str2(False)

    assert len({path1, path3, f2_path1, f2_path2}) == 4

    # Skip the following block on Windows which doesn't support `os.fork`
    if not is_windows():
        # Use `os.fork()` to make parent and child processes share the same global variable
        # `_per_process_value_cache_map`.
        pid = os.fork()
        if pid > 0:
            # in parent process
            child_pid = pid
            # check child process exit with return value 0.
            assert os.waitpid(child_pid, 0)[1] == 0
        else:
            # in forked out child process
            child_path1 = _gen_random_str1(True)
            child_path2 = _gen_random_str1(False)
            test_pass = len({path1, path3, child_path1, child_path2}) == 4
            # exit forked out child process with exit code representing testing pass or fail.
            os._exit(0 if test_pass else 1)
```

--------------------------------------------------------------------------------

````
