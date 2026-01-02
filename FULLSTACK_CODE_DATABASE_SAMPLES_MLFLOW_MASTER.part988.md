---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:55Z
part: 988
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 988 of 991)

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

---[FILE: test_utils.py]---
Location: mlflow-master/tests/utils/test_utils.py

```python
from unittest import mock

import pytest

from mlflow.utils import (
    AttrDict,
    _chunk_dict,
    _get_fully_qualified_class_name,
    _truncate_dict,
    merge_dicts,
)


def test_truncate_dict():
    d = {"12345": "12345"}
    length = 5

    with mock.patch("mlflow.utils._logger.warning") as mock_warning:
        max_length = length - 1

        # Truncate keys
        assert _truncate_dict(d, max_key_length=max_length) == {"1...": "12345"}
        mock_warning.assert_called_once_with("Truncated the key `1...`")
        mock_warning.reset_mock()

        # Truncate values
        assert _truncate_dict(d, max_value_length=max_length) == {"12345": "1..."}
        mock_warning.assert_called_once_with(
            "Truncated the value of the key `12345`. Truncated value: `1...`"
        )
        mock_warning.reset_mock()

        # Truncate both keys and values
        assert _truncate_dict(d, max_key_length=max_length, max_value_length=max_length) == {
            "1...": "1..."
        }
        assert mock_warning.call_count == 2
        (args1, _), (args2, _) = mock_warning.call_args_list
        assert args1[0] == "Truncated the key `1...`"
        assert args2[0] == "Truncated the value of the key `1...`. Truncated value: `1...`"

    assert _truncate_dict(d, max_key_length=length, max_value_length=length) == {"12345": "12345"}
    assert _truncate_dict(d, max_key_length=length + 1, max_value_length=length + 1) == {
        "12345": "12345"
    }

    with pytest.raises(
        ValueError, match="Must specify at least either `max_key_length` or `max_value_length`"
    ):
        _truncate_dict(d)


def test_merge_dicts():
    dict_a = {"a": 3, "b": {"c": {"d": [1, 2, 3]}}, "k": "hello"}
    dict_b = {"test_var": [1, 2]}
    expected_ab = {"a": 3, "b": {"c": {"d": [1, 2, 3]}}, "k": "hello", "test_var": [1, 2]}
    assert merge_dicts(dict_a, dict_b) == expected_ab

    dict_c = {"a": 10}
    with pytest.raises(ValueError, match="contains duplicate keys"):
        merge_dicts(dict_a, dict_c)

    expected_ac = {"a": 10, "b": {"c": {"d": [1, 2, 3]}}, "k": "hello"}
    assert merge_dicts(dict_a, dict_c, raise_on_duplicates=False) == expected_ac


def test_chunk_dict():
    d = {i: i for i in range(10)}
    assert list(_chunk_dict(d, 4)) == [
        {i: i for i in range(4)},
        {i: i for i in range(4, 8)},
        {i: i for i in range(8, 10)},
    ]
    assert list(_chunk_dict(d, 5)) == [
        {i: i for i in range(5)},
        {i: i for i in range(5, 10)},
    ]
    assert list(_chunk_dict(d, len(d))) == [d]
    assert list(_chunk_dict(d, len(d) + 1)) == [d]


def test_get_fully_qualified_class_name():
    class Foo:
        pass

    assert _get_fully_qualified_class_name(Foo()) == f"{__name__}.Foo"


def test_inspect_original_var_name():
    from mlflow.utils import _inspect_original_var_name

    def f1(a1, expected_name):
        assert _inspect_original_var_name(a1, "unknown") == expected_name

    xyz1 = object()
    f1(xyz1, "xyz1")

    f1(str(xyz1), "unknown")

    f1(None, "unknown")

    def f2(b1, expected_name):
        f1(b1, expected_name)

    f2(xyz1, "xyz1")

    def f3(a1, *, b1, expected_a1_name, expected_b1_name):
        assert _inspect_original_var_name(a1, None) == expected_a1_name
        assert _inspect_original_var_name(b1, None) == expected_b1_name

    xyz2 = object()
    xyz3 = object()

    f3(*[xyz2], **{"b1": xyz3, "expected_a1_name": "xyz2", "expected_b1_name": "xyz3"})


def test_random_name_generation():
    from mlflow.utils import name_utils

    # Validate exhausted loop truncation
    name = name_utils._generate_random_name(max_length=8)
    assert len(name) == 8

    # Validate default behavior while calling 1000 times that names end in integer
    names = [name_utils._generate_random_name() for i in range(1000)]
    assert all(len(name) <= 20 for name in names)
    assert all(name[-1].isnumeric() for name in names)


def test_basic_attribute_access():
    d = AttrDict({"a": 1, "b": 2})
    assert d.a == 1
    assert d.b == 2


def test_nested_attribute_access():
    d = AttrDict({"a": 1, "b": {"c": 3, "d": 4}})
    assert d.b.c == 3
    assert d.b.d == 4


def test_non_existent_attribute():
    d = AttrDict({"a": 1, "b": 2})
    with pytest.raises(AttributeError, match="'AttrDict' object has no attribute 'c'"):
        _ = d.c


def test_hasattr():
    d = AttrDict({"a": 1, "b": {"c": 3, "d": 4}})
    assert hasattr(d, "a")
    assert hasattr(d, "b")
    assert not hasattr(d, "e")
    assert hasattr(d.b, "c")
    assert not hasattr(d.b, "e")


def test_subclass_hasattr():
    class SubAttrDict(AttrDict):
        pass

    d = SubAttrDict({"a": 1, "b": {"c": 3, "d": 4}})
    assert hasattr(d, "a")
    assert not hasattr(d, "e")
    assert hasattr(d.b, "c")
    assert not hasattr(d.b, "e")

    with pytest.raises(AttributeError, match="'SubAttrDict' object has no attribute 'g'"):
        _ = d.g


def test_setattr():
    d = AttrDict({"a": 1, "b": 2})

    # Set existing attribute
    d.a = 10
    assert d.a == 10
    assert d["a"] == 10

    # Set new attribute
    d.c = 3
    assert d.c == 3
    assert d["c"] == 3
    assert "c" in d


def test_delattr():
    d = AttrDict({"a": 1, "b": 2, "c": 3})

    # Delete existing attribute
    del d.b
    assert "b" not in d
    assert not hasattr(d, "b")

    # Verify other attributes still exist
    assert d.a == 1
    assert d.c == 3


def test_delattr_non_existent():
    d = AttrDict({"a": 1, "b": 2, "c": 3})
    with pytest.raises(KeyError, match="nonexistent"):
        del d.nonexistent
```

--------------------------------------------------------------------------------

---[FILE: test_validation.py]---
Location: mlflow-master/tests/utils/test_validation.py

```python
import copy

import pytest

from mlflow.entities import Metric, Param, RunTag
from mlflow.environment_variables import MLFLOW_ARTIFACT_LOCATION_MAX_LENGTH
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE, ErrorCode
from mlflow.utils.os import is_windows
from mlflow.utils.validation import (
    MAX_TAG_VAL_LENGTH,
    _is_numeric,
    _validate_batch_log_data,
    _validate_batch_log_limits,
    _validate_db_type_string,
    _validate_experiment_artifact_location,
    _validate_experiment_artifact_location_length,
    _validate_experiment_name,
    _validate_list_param,
    _validate_metric_name,
    _validate_model_alias_name,
    _validate_model_alias_name_reserved,
    _validate_param_name,
    _validate_run_id,
    _validate_tag_name,
    path_not_unique,
)

GOOD_METRIC_OR_PARAM_NAMES = [
    "a",
    "Ab-5_",
    "a/b/c",
    "a.b.c",
    ".a",
    "b.",
    "a..a/._./o_O/.e.",
    "a b/c d",
]
BAD_METRIC_OR_PARAM_NAMES = [
    "",
    ".",
    "/",
    "..",
    "//",
    "a//b",
    "a/./b",
    "/a",
    "a/",
    "\\",
    "./",
    "/./",
]

GOOD_ALIAS_NAMES = [
    "a",
    "Ab-5_",
    "test-alias",
    "1a2b5cDeFgH",
    "a" * 255,
    "lates",  # spellchecker: disable-line
    "v123_temp",
    "123",
    "123v",
    "temp_V123",
]

BAD_ALIAS_NAMES = [
    "",
    ".",
    "/",
    "..",
    "//",
    "a b",
    "a/./b",
    "/a",
    "a/",
    ":",
    "\\",
    "./",
    "/./",
    "a" * 256,
    None,
    "$dgs",
]


@pytest.mark.parametrize(
    ("path", "expected"),
    [
        ("a", False),
        ("a/b/c", False),
        ("a.b/c", False),
        (".a", False),
        # Not unique paths
        ("./a", True),
        ("a/b/../c", True),
        (".", True),
        ("../a/b", True),
        ("/a/b/c", True),
    ],
)
def test_path_not_unique(path, expected):
    assert path_not_unique(path) is expected


@pytest.mark.parametrize(
    ("value", "expected"),
    [
        (0, True),
        (0.0, True),
        # Non-numeric cases
        (True, False),
        (False, False),
        ("0", False),
        (None, False),
    ],
)
def test_is_numeric(value, expected):
    assert _is_numeric(value) is expected


@pytest.mark.parametrize("metric_name", GOOD_METRIC_OR_PARAM_NAMES)
def test_validate_metric_name_good(metric_name):
    _validate_metric_name(metric_name)


def _bad_parameter_pattern(name):
    if name == "\\":
        return r"Invalid value \"\\\\\" for parameter"  # Manually handle the backslash case
    elif name == "*****":
        return r"Invalid value \"\*\*\*\*\*\" for parameter"
    else:
        return f'Invalid value "{name}" for parameter'


@pytest.mark.parametrize("metric_name", BAD_METRIC_OR_PARAM_NAMES)
def test_validate_metric_name_bad(metric_name):
    with pytest.raises(
        MlflowException,
        match=_bad_parameter_pattern(metric_name),
    ) as e:
        _validate_metric_name(metric_name)
    assert e.value.error_code == ErrorCode.Name(INVALID_PARAMETER_VALUE)


@pytest.mark.parametrize("param_name", GOOD_METRIC_OR_PARAM_NAMES)
def test_validate_param_name_good(param_name):
    _validate_param_name(param_name)


@pytest.mark.parametrize("param_name", BAD_METRIC_OR_PARAM_NAMES)
def test_validate_param_name_bad(param_name):
    with pytest.raises(MlflowException, match=_bad_parameter_pattern(param_name)) as e:
        _validate_param_name(param_name)
    assert e.value.error_code == ErrorCode.Name(INVALID_PARAMETER_VALUE)


@pytest.mark.skipif(not is_windows(), reason="Windows do not support colon in params and metrics")
@pytest.mark.parametrize(
    "param_name",
    [
        ":",
        "aa:bb:cc",
    ],
)
def test_validate_colon_name_bad_windows(param_name):
    with pytest.raises(MlflowException, match=_bad_parameter_pattern(param_name)) as e:
        _validate_param_name(param_name)
    assert e.value.error_code == ErrorCode.Name(INVALID_PARAMETER_VALUE)


@pytest.mark.parametrize("tag_name", GOOD_METRIC_OR_PARAM_NAMES)
def test_validate_tag_name_good(tag_name):
    _validate_tag_name(tag_name)


@pytest.mark.parametrize("tag_name", BAD_METRIC_OR_PARAM_NAMES)
def test_validate_tag_name_bad(tag_name):
    with pytest.raises(MlflowException, match=_bad_parameter_pattern(tag_name)) as e:
        _validate_tag_name(tag_name)
    assert e.value.error_code == ErrorCode.Name(INVALID_PARAMETER_VALUE)


@pytest.mark.parametrize("alias_name", GOOD_ALIAS_NAMES)
def test_validate_model_alias_name_good(alias_name):
    _validate_model_alias_name(alias_name)


@pytest.mark.parametrize("alias_name", BAD_ALIAS_NAMES)
def test_validate_model_alias_name_bad(alias_name):
    with pytest.raises(MlflowException, match="alias name") as e:
        _validate_model_alias_name(alias_name)
    assert e.value.error_code == ErrorCode.Name(INVALID_PARAMETER_VALUE)


@pytest.mark.parametrize("alias_name", ["latest", "LATEST", "Latest", "v123", "V1"])
def test_validate_model_alias_name_reserved(alias_name):
    with pytest.raises(MlflowException, match="reserved") as e:
        _validate_model_alias_name_reserved(alias_name)
    assert e.value.error_code == ErrorCode.Name(INVALID_PARAMETER_VALUE)


@pytest.mark.parametrize(
    "run_id",
    [
        "a" * 32,
        "f0" * 16,
        "abcdef0123456789" * 2,
        "a" * 33,
        "a" * 31,
        "a" * 256,
        "A" * 32,
        "g" * 32,
        "a_" * 32,
        "abcdefghijklmnopqrstuvqxyz",
    ],
)
def test_validate_run_id_good(run_id):
    _validate_run_id(run_id)


@pytest.mark.parametrize("run_id", ["a/bc" * 8, "", "a" * 400, "*" * 5])
def test_validate_run_id_bad(run_id):
    with pytest.raises(MlflowException, match=_bad_parameter_pattern(run_id)) as e:
        _validate_run_id(run_id)
    assert e.value.error_code == ErrorCode.Name(INVALID_PARAMETER_VALUE)


def test_validate_batch_log_limits():
    too_many_metrics = [Metric(f"metric-key-{i}", 1, 0, i * 2) for i in range(1001)]
    too_many_params = [Param(f"param-key-{i}", "b") for i in range(101)]
    too_many_tags = [RunTag(f"tag-key-{i}", "b") for i in range(101)]

    good_kwargs = {"metrics": [], "params": [], "tags": []}
    bad_kwargs = {
        "metrics": [too_many_metrics],
        "params": [too_many_params],
        "tags": [too_many_tags],
    }
    match = r"A batch logging request can contain at most \d+"
    for arg_name, arg_values in bad_kwargs.items():
        for arg_value in arg_values:
            final_kwargs = copy.deepcopy(good_kwargs)
            final_kwargs[arg_name] = arg_value
            with pytest.raises(MlflowException, match=match):
                _validate_batch_log_limits(**final_kwargs)
    # Test the case where there are too many entities in aggregate
    with pytest.raises(MlflowException, match=match):
        _validate_batch_log_limits(too_many_metrics[:900], too_many_params[:51], too_many_tags[:50])
    # Test that we don't reject entities within the limit
    _validate_batch_log_limits(too_many_metrics[:1000], [], [])
    _validate_batch_log_limits([], too_many_params[:100], [])
    _validate_batch_log_limits([], [], too_many_tags[:100])


def test_validate_batch_log_data(monkeypatch):
    metrics_with_bad_key = [
        Metric("good-metric-key", 1.0, 0, 0),
        Metric("super-long-bad-key" * 1000, 4.0, 0, 0),
    ]
    metrics_with_bad_val = [Metric("good-metric-key", "not-a-double-val", 0, 0)]
    metrics_with_bool_val = [Metric("good-metric-key", True, 0, 0)]
    metrics_with_bad_ts = [Metric("good-metric-key", 1.0, "not-a-timestamp", 0)]
    metrics_with_neg_ts = [Metric("good-metric-key", 1.0, -123, 0)]
    metrics_with_bad_step = [Metric("good-metric-key", 1.0, 0, "not-a-step")]
    params_with_bad_key = [
        Param("good-param-key", "hi"),
        Param("super-long-bad-key" * 1000, "but-good-val"),
    ]
    params_with_bad_val = [
        Param("good-param-key", "hi"),
        Param("another-good-key", "but-bad-val" * 1000),
    ]
    tags_with_bad_key = [
        RunTag("good-tag-key", "hi"),
        RunTag("super-long-bad-key" * 1000, "but-good-val"),
    ]
    tags_with_bad_val = [
        RunTag("good-tag-key", "hi"),
        RunTag("another-good-key", "a" * (MAX_TAG_VAL_LENGTH + 1)),
    ]
    bad_kwargs = {
        "metrics": [
            metrics_with_bad_key,
            metrics_with_bad_val,
            metrics_with_bool_val,
            metrics_with_bad_ts,
            metrics_with_neg_ts,
            metrics_with_bad_step,
        ],
        "params": [params_with_bad_key, params_with_bad_val],
        "tags": [tags_with_bad_key, tags_with_bad_val],
    }
    good_kwargs = {"metrics": [], "params": [], "tags": []}
    monkeypatch.setenv("MLFLOW_TRUNCATE_LONG_VALUES", "false")
    for arg_name, arg_values in bad_kwargs.items():
        for arg_value in arg_values:
            final_kwargs = copy.deepcopy(good_kwargs)
            final_kwargs[arg_name] = arg_value
            with pytest.raises(MlflowException, match=r".+"):
                _validate_batch_log_data(**final_kwargs)
    # Test that we don't reject entities within the limit
    _validate_batch_log_data(
        metrics=[Metric("metric-key", 1.0, 0, 0)],
        params=[Param("param-key", "param-val")],
        tags=[RunTag("tag-key", "tag-val")],
    )


@pytest.mark.parametrize("location", ["abcde", None])
def test_validate_experiment_artifact_location_good(location):
    _validate_experiment_artifact_location(location)


@pytest.mark.parametrize("location", ["runs:/blah/bleh/blergh"])
def test_validate_experiment_artifact_location_bad(location):
    with pytest.raises(MlflowException, match="Artifact location cannot be a runs:/ URI"):
        _validate_experiment_artifact_location(location)


@pytest.mark.parametrize("experiment_name", ["validstring", b"test byte string".decode("utf-8")])
def test_validate_experiment_name_good(experiment_name):
    _validate_experiment_name(experiment_name)


@pytest.mark.parametrize("experiment_name", ["", 12, 12.7, None, {}, []])
def test_validate_experiment_name_bad(experiment_name):
    with pytest.raises(MlflowException, match="Invalid experiment name"):
        _validate_experiment_name(experiment_name)


@pytest.mark.parametrize("db_type", ["mysql", "mssql", "postgresql", "sqlite"])
def test_validate_db_type_string_good(db_type):
    _validate_db_type_string(db_type)


@pytest.mark.parametrize("db_type", ["MySQL", "mongo", "cassandra", "sql", ""])
def test_validate_db_type_string_bad(db_type):
    with pytest.raises(MlflowException, match="Invalid database engine") as e:
        _validate_db_type_string(db_type)
    assert "Invalid database engine" in e.value.message


@pytest.mark.parametrize(
    "artifact_location",
    [
        "s3://test-bucket/",
        "file:///path/to/artifacts",
        "mlflow-artifacts:/path/to/artifacts",
        "dbfs:/databricks/mlflow-tracking/some-id",
    ],
)
def test_validate_experiment_artifact_location_length_good(artifact_location):
    _validate_experiment_artifact_location_length(artifact_location)


@pytest.mark.parametrize(
    "artifact_location",
    ["s3://test-bucket/" + "a" * 10000, "file:///path/to/" + "directory" * 1111],
)
def test_validate_experiment_artifact_location_length_bad(artifact_location):
    with pytest.raises(MlflowException, match="Invalid artifact path length"):
        _validate_experiment_artifact_location_length(artifact_location)


def test_setting_experiment_artifact_location_env_var_works(monkeypatch):
    artifact_location = "file://aaaa"  # length 11

    # should not throw
    _validate_experiment_artifact_location_length(artifact_location)

    # reduce limit to 10
    monkeypatch.setenv(MLFLOW_ARTIFACT_LOCATION_MAX_LENGTH.name, "10")
    with pytest.raises(MlflowException, match="Invalid artifact path length"):
        _validate_experiment_artifact_location_length(artifact_location)

    # increase limit to 11
    monkeypatch.setenv(MLFLOW_ARTIFACT_LOCATION_MAX_LENGTH.name, "11")
    _validate_experiment_artifact_location_length(artifact_location)


@pytest.mark.parametrize(
    "param_value",
    [
        ["1", "2", "3"],
        [],
        [1, 2, 3],
    ],
)
def test_validate_list_param_with_valid_list(param_value):
    _validate_list_param("experiment_ids", param_value)


def test_validate_list_param_with_none_not_allowed():
    with pytest.raises(MlflowException, match="experiment_ids must be a list"):
        _validate_list_param("experiment_ids", None, allow_none=False)


def test_validate_list_param_with_none_allowed():
    _validate_list_param("experiment_ids", None, allow_none=True)


@pytest.mark.parametrize(
    ("param_name", "param_value", "expected_type"),
    [
        ("experiment_ids", 4, "int"),
        ("param_name", "value", "str"),
        ("my_param", {"key": "value"}, "dict"),
    ],
)
def test_validate_list_param_with_invalid_type(param_name, param_value, expected_type):
    with pytest.raises(
        MlflowException, match=rf"{param_name} must be a list, got {expected_type}"
    ) as exc_info:
        _validate_list_param(param_name, param_value)
    assert f"Did you mean to use {param_name}=[{param_value!r}]?" in str(exc_info.value)
    assert exc_info.value.error_code == "INVALID_PARAMETER_VALUE"
```

--------------------------------------------------------------------------------

---[FILE: test_yaml_utils.py]---
Location: mlflow-master/tests/utils/test_yaml_utils.py

```python
import codecs
import os

from mlflow.utils.yaml_utils import (
    read_yaml,
    safe_edit_yaml,
    write_yaml,
)

from tests.helper_functions import random_file, random_int


def test_yaml_read_and_write(tmp_path):
    temp_dir = str(tmp_path)
    yaml_file = random_file("yaml")
    long_value = 1
    data = {
        "a": random_int(),
        "B": random_int(),
        "text_value": "中文",
        "long_value": long_value,
        "int_value": 32,
        "text_value_2": "hi",
    }
    write_yaml(temp_dir, yaml_file, data)
    read_data = read_yaml(temp_dir, yaml_file)
    assert data == read_data
    yaml_path = os.path.join(temp_dir, yaml_file)
    with codecs.open(yaml_path, encoding="utf-8") as handle:
        contents = handle.read()
    assert "!!python" not in contents
    # Check that UTF-8 strings are written properly to the file (rather than as ASCII
    # representations of their byte sequences).
    assert "中文" in contents

    def edit_func(old_dict):
        old_dict["more_text"] = "西班牙语"
        return old_dict

    assert "more_text" not in read_yaml(temp_dir, yaml_file)
    with safe_edit_yaml(temp_dir, yaml_file, edit_func):
        edited_dict = read_yaml(temp_dir, yaml_file)
        assert "more_text" in edited_dict
        assert edited_dict["more_text"] == "西班牙语"
    assert "more_text" not in read_yaml(temp_dir, yaml_file)


def test_yaml_write_sorting(tmp_path):
    temp_dir = str(tmp_path)
    data = {
        "a": 1,
        "c": 2,
        "b": 3,
    }

    sorted_yaml_file = random_file("yaml")
    write_yaml(temp_dir, sorted_yaml_file, data, sort_keys=True)
    expected_sorted = """a: 1
b: 3
c: 2
"""
    with open(os.path.join(temp_dir, sorted_yaml_file)) as f:
        actual_sorted = f.read()

    assert actual_sorted == expected_sorted

    unsorted_yaml_file = random_file("yaml")
    write_yaml(temp_dir, unsorted_yaml_file, data, sort_keys=False)
    expected_unsorted = """a: 1
c: 2
b: 3
"""
    with open(os.path.join(temp_dir, unsorted_yaml_file)) as f:
        actual_unsorted = f.read()

    assert actual_unsorted == expected_unsorted
```

--------------------------------------------------------------------------------

---[FILE: dummy_module.py]---
Location: mlflow-master/tests/utils/test_resources/dummy_module.py

```python
# this is a blank module used for testing _add_code_to_system_path from model_utils.py
```

--------------------------------------------------------------------------------

---[FILE: base.py]---
Location: mlflow-master/tests/utils/test_resources/dummy_package/base.py

```python
# This call should import the **system** operator, not the dummy_package.operator
# module that is adjacent to this file
import operator  # noqa: F401
```

--------------------------------------------------------------------------------

---[FILE: operator.py]---
Location: mlflow-master/tests/utils/test_resources/dummy_package/operator.py

```python
# This module is meant to test shadowing of the built-in operator module
raise Exception(
    "This package should not have been imported! "
    "This means that the sys.path was not configured correctly"
)
```

--------------------------------------------------------------------------------

---[FILE: pandas.py]---
Location: mlflow-master/tests/utils/test_resources/dummy_package/pandas.py

```python
# This module is meant to test shadowing of the 3rd party module
raise Exception(
    "This package should not have been imported! "
    "This means that the sys.path was not configured correctly"
)
```

--------------------------------------------------------------------------------

---[FILE: app.py]---
Location: mlflow-master/tests/webhooks/app.py
Signals: FastAPI

```python
import base64
import hashlib
import hmac
import itertools
import json
import sys
from pathlib import Path

import fastapi
import uvicorn
from fastapi import HTTPException, Request

from mlflow.webhooks.constants import (
    WEBHOOK_DELIVERY_ID_HEADER,
    WEBHOOK_SIGNATURE_HEADER,
    WEBHOOK_SIGNATURE_VERSION,
    WEBHOOK_TIMESTAMP_HEADER,
)

LOG_FILE = Path("logs.jsonl")

app = fastapi.FastAPI()


@app.get("/health")
async def health_check():
    return {"status": "ok"}


@app.post("/insecure-webhook")
async def insecure_webhook(request: Request):
    payload = await request.json()
    # Extract the data field from webhook payload
    actual_payload = payload.get("data", payload)
    webhook_data = {
        "endpoint": "/insecure-webhook",
        "payload": actual_payload,
        "headers": dict(request.headers),
        "status_code": 200,
        "error": None,
    }
    with LOG_FILE.open("a") as f:
        f.write(json.dumps(webhook_data) + "\n")

    return {"status": "received"}


@app.post("/reset")
async def reset():
    """Reset both logs and counters for testing"""
    global flaky_counter, rate_limited_counter

    # Clear logs
    if LOG_FILE.exists():
        LOG_FILE.open("w").close()

    # Reset all counters
    flaky_counter = itertools.count(1)
    rate_limited_counter = itertools.count(1)

    return {"status": "reset complete", "logs": "cleared", "counters": "reset"}


@app.get("/logs")
async def get_logs():
    if not LOG_FILE.exists():
        return {"logs": []}

    with LOG_FILE.open("r") as f:
        logs = [json.loads(s) for line in f if (s := line.strip())]
        return {"logs": logs}


# Secret key for HMAC verification (in real world, this would be stored securely)
WEBHOOK_SECRET = "test-secret-key"


def verify_webhook_signature(
    payload: str, signature: str, delivery_id: str, timestamp: str
) -> bool:
    if not signature or not signature.startswith(f"{WEBHOOK_SIGNATURE_VERSION},"):
        return False

    # Signature format: delivery_id.timestamp.payload
    signed_content = f"{delivery_id}.{timestamp}.{payload}"
    expected_signature = hmac.new(
        WEBHOOK_SECRET.encode("utf-8"), signed_content.encode("utf-8"), hashlib.sha256
    ).digest()
    expected_signature_b64 = base64.b64encode(expected_signature).decode("utf-8")

    provided_signature = signature.removeprefix(f"{WEBHOOK_SIGNATURE_VERSION},")
    return hmac.compare_digest(expected_signature_b64, provided_signature)


@app.post("/secure-webhook")
async def secure_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get(WEBHOOK_SIGNATURE_HEADER)
    timestamp = request.headers.get(WEBHOOK_TIMESTAMP_HEADER)
    delivery_id = request.headers.get(WEBHOOK_DELIVERY_ID_HEADER)

    if not signature:
        error_data = {
            "endpoint": "/secure-webhook",
            "headers": dict(request.headers),
            "status_code": 400,
            "payload": None,
            "error": "Missing signature header",
        }
        with LOG_FILE.open("a") as f:
            f.write(json.dumps(error_data) + "\n")
        raise HTTPException(status_code=400, detail="Missing signature header")

    if not timestamp:
        error_data = {
            "endpoint": "/secure-webhook",
            "error": "Missing timestamp header",
            "status_code": 400,
            "headers": dict(request.headers),
        }
        with LOG_FILE.open("a") as f:
            f.write(json.dumps(error_data) + "\n")
        raise HTTPException(status_code=400, detail="Missing timestamp header")

    if not delivery_id:
        error_data = {
            "endpoint": "/secure-webhook",
            "error": "Missing delivery ID header",
            "status_code": 400,
            "headers": dict(request.headers),
        }
        with LOG_FILE.open("a") as f:
            f.write(json.dumps(error_data) + "\n")
        raise HTTPException(status_code=400, detail="Missing delivery ID header")

    if not verify_webhook_signature(body.decode("utf-8"), signature, delivery_id, timestamp):
        error_data = {
            "endpoint": "/secure-webhook",
            "headers": dict(request.headers),
            "status_code": 401,
            "payload": None,
            "error": "Invalid signature",
        }
        with LOG_FILE.open("a") as f:
            f.write(json.dumps(error_data) + "\n")
        raise HTTPException(status_code=401, detail="Invalid signature")

    payload = json.loads(body)
    # Extract the data field from webhook payload
    actual_payload = payload.get("data", payload)
    webhook_data = {
        "endpoint": "/secure-webhook",
        "payload": actual_payload,
        "headers": dict(request.headers),
        "status_code": 200,
        "error": None,
    }

    with LOG_FILE.open("a") as f:
        f.write(json.dumps(webhook_data) + "\n")

    return {"status": "received", "signature": "verified"}


# Create separate counters for each endpoint using itertools.count
flaky_counter = itertools.count(1)
rate_limited_counter = itertools.count(1)


@app.post("/flaky-webhook")
async def flaky_webhook(request: Request):
    """Endpoint that fails initially but succeeds after retries"""
    attempt = next(flaky_counter)

    payload = await request.json()
    actual_payload = payload.get("data", payload)

    # Log the attempt
    webhook_data = {
        "endpoint": "/flaky-webhook",
        "payload": actual_payload,
        "headers": dict(request.headers),
        "attempt": attempt,
        "error": None,
    }

    # Fail on first two attempts with 500 error
    if attempt <= 2:
        webhook_data["status_code"] = 500
        webhook_data["error"] = "Server error (will retry)"
        with LOG_FILE.open("a") as f:
            f.write(json.dumps(webhook_data) + "\n")
        raise HTTPException(status_code=500, detail="Internal server error")

    # Succeed on third attempt
    webhook_data["status_code"] = 200
    with LOG_FILE.open("a") as f:
        f.write(json.dumps(webhook_data) + "\n")

    return {"status": "received", "attempt": attempt}


@app.post("/rate-limited-webhook")
async def rate_limited_webhook(request: Request):
    """Endpoint that returns 429 with Retry-After header"""
    attempt = next(rate_limited_counter)

    payload = await request.json()
    actual_payload = payload.get("data", payload)

    # Log the attempt
    webhook_data = {
        "endpoint": "/rate-limited-webhook",
        "payload": actual_payload,
        "headers": dict(request.headers),
        "attempt": attempt,
        "error": None,
    }

    # Return 429 on first attempt
    if attempt == 1:
        webhook_data["status_code"] = 429
        webhook_data["error"] = "Rate limited"
        with LOG_FILE.open("a") as f:
            f.write(json.dumps(webhook_data) + "\n")
        # Return 429 with Retry-After header
        response = fastapi.Response(content="Rate limited", status_code=429)
        response.headers["Retry-After"] = "2"
        return response

    # Succeed on second attempt
    webhook_data["status_code"] = 200
    with LOG_FILE.open("a") as f:
        f.write(json.dumps(webhook_data) + "\n")

    return {"status": "received", "attempt": attempt}


if __name__ == "__main__":
    port = sys.argv[1]
    uvicorn.run(app, host="0.0.0.0", port=int(port))
```

--------------------------------------------------------------------------------

---[FILE: test_delivery.py]---
Location: mlflow-master/tests/webhooks/test_delivery.py

```python
from pathlib import Path
from unittest.mock import patch

import pytest

from mlflow.entities.webhook import WebhookAction, WebhookEntity, WebhookEvent
from mlflow.store.model_registry.file_store import FileStore
from mlflow.store.model_registry.sqlalchemy_store import SqlAlchemyStore
from mlflow.webhooks.delivery import deliver_webhook


@pytest.fixture
def file_store(tmp_path: Path) -> FileStore:
    return FileStore(str(tmp_path))


@pytest.fixture
def sql_store(tmp_path: Path) -> SqlAlchemyStore:
    db_file = tmp_path / "test.db"
    db_uri = f"sqlite:///{db_file}"
    return SqlAlchemyStore(db_uri)


@pytest.fixture
def webhook_event() -> WebhookEvent:
    return WebhookEvent(WebhookEntity.REGISTERED_MODEL, WebhookAction.CREATED)


@pytest.fixture
def webhook_payload() -> dict[str, str]:
    return {"name": "test_model", "description": "Test model"}


def test_deliver_webhook_exits_early_for_file_store(
    file_store: FileStore, webhook_event: WebhookEvent, webhook_payload: dict[str, str]
) -> None:
    with patch("mlflow.webhooks.delivery._deliver_webhook_impl") as mock_impl:
        deliver_webhook(
            event=webhook_event,
            payload=webhook_payload,
            store=file_store,
        )

        # _deliver_webhook_impl should not be called for FileStore
        mock_impl.assert_not_called()


def test_deliver_webhook_calls_impl_for_sql_store(
    sql_store: SqlAlchemyStore, webhook_event: WebhookEvent, webhook_payload: dict[str, str]
) -> None:
    with patch("mlflow.webhooks.delivery._deliver_webhook_impl") as mock_impl:
        deliver_webhook(
            event=webhook_event,
            payload=webhook_payload,
            store=sql_store,
        )

        # _deliver_webhook_impl should be called for SqlAlchemyStore
        mock_impl.assert_called_once_with(
            event=webhook_event,
            payload=webhook_payload,
            store=sql_store,
        )


def test_deliver_webhook_handles_exception_for_sql_store(
    sql_store: SqlAlchemyStore, webhook_event: WebhookEvent, webhook_payload: dict[str, str]
) -> None:
    with (
        patch("mlflow.webhooks.delivery._deliver_webhook_impl", side_effect=Exception("Test")),
        patch("mlflow.webhooks.delivery._logger") as mock_logger,
    ):
        # This should not raise an exception
        deliver_webhook(
            event=webhook_event,
            payload=webhook_payload,
            store=sql_store,
        )

        # Verify that the error was logged
        mock_logger.error.assert_called_once()
        assert "Failed to deliver webhook for event" in str(mock_logger.error.call_args)


def test_deliver_webhook_no_exception_for_file_store(
    file_store: FileStore, webhook_event: WebhookEvent, webhook_payload: dict[str, str]
) -> None:
    with (
        patch(
            "mlflow.webhooks.delivery._deliver_webhook_impl", side_effect=Exception("Test")
        ) as mock_impl,
        patch("mlflow.webhooks.delivery._logger") as mock_logger,
    ):
        # This should not raise an exception and should return early
        deliver_webhook(
            event=webhook_event,
            payload=webhook_payload,
            store=file_store,
        )

        # _deliver_webhook_impl should not be called, so no error should be logged
        mock_impl.assert_not_called()
        mock_logger.error.assert_not_called()
```

--------------------------------------------------------------------------------

````
