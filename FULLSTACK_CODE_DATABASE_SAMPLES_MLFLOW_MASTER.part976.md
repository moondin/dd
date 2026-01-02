---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:55Z
part: 976
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 976 of 991)

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

---[FILE: test_type_hints.py]---
Location: mlflow-master/tests/types/test_type_hints.py
Signals: Pydantic

```python
import datetime
from typing import Any, Dict, List, Optional, Union, get_args
from unittest import mock

import numpy as np
import pandas as pd
import pydantic
import pytest
from scipy.sparse import csc_matrix, csr_matrix

from mlflow.exceptions import MlflowException
from mlflow.models.utils import _enforce_schema
from mlflow.types.schema import AnyType, Array, ColSpec, DataType, Map, Object, Property, Schema
from mlflow.types.type_hints import (
    InvalidTypeHintException,
    UnsupportedTypeHintException,
    _convert_data_to_type_hint,
    _convert_dataframe_to_example_format,
    _infer_schema_from_list_type_hint,
    _is_example_valid_for_type_from_example,
    _signature_cannot_be_inferred_from_type_hint,
    _validate_data_against_type_hint,
)
from mlflow.types.utils import _infer_schema


class CustomModel(pydantic.BaseModel):
    long_field: int
    str_field: str
    bool_field: bool
    double_field: float
    binary_field: bytes
    datetime_field: datetime.datetime
    any_field: Any
    optional_str: str | None = None


class Message(pydantic.BaseModel):
    role: str
    content: str


class CustomModel2(pydantic.BaseModel):
    custom_field: dict[str, Any]
    messages: list[Message]
    optional_int: int | None = None


@pytest.mark.parametrize(
    ("type_hint", "expected_schema"),
    [
        (
            list[CustomModel],
            Schema(
                [
                    ColSpec(
                        type=Object(
                            [
                                Property(name="long_field", dtype=DataType.long),
                                Property(name="str_field", dtype=DataType.string),
                                Property(name="bool_field", dtype=DataType.boolean),
                                Property(name="double_field", dtype=DataType.double),
                                Property(name="binary_field", dtype=DataType.binary),
                                Property(name="datetime_field", dtype=DataType.datetime),
                                Property(name="any_field", dtype=AnyType()),
                                Property(
                                    name="optional_str", dtype=DataType.string, required=False
                                ),
                            ]
                        )
                    )
                ]
            ),
        ),
        (
            list[list[CustomModel]],
            Schema(
                [
                    ColSpec(
                        type=Array(
                            Object(
                                [
                                    Property(name="long_field", dtype=DataType.long),
                                    Property(name="str_field", dtype=DataType.string),
                                    Property(name="bool_field", dtype=DataType.boolean),
                                    Property(name="double_field", dtype=DataType.double),
                                    Property(name="binary_field", dtype=DataType.binary),
                                    Property(name="datetime_field", dtype=DataType.datetime),
                                    Property(name="any_field", dtype=AnyType()),
                                    Property(
                                        name="optional_str", dtype=DataType.string, required=False
                                    ),
                                ]
                            )
                        )
                    )
                ]
            ),
        ),
        (
            list[CustomModel2],
            Schema(
                [
                    ColSpec(
                        type=Object(
                            [
                                Property(name="custom_field", dtype=Map(AnyType())),
                                Property(
                                    name="messages",
                                    dtype=Array(
                                        Object(
                                            [
                                                Property(name="role", dtype=DataType.string),
                                                Property(name="content", dtype=DataType.string),
                                            ]
                                        )
                                    ),
                                ),
                                Property(name="optional_int", dtype=DataType.long, required=False),
                            ]
                        )
                    )
                ]
            ),
        ),
    ],
)
def test_infer_schema_from_pydantic_model(type_hint, expected_schema):
    schema = _infer_schema_from_list_type_hint(type_hint)
    assert schema == expected_schema


@pytest.mark.parametrize(
    ("type_hint", "expected_schema"),
    [
        # scalars
        (list[int], Schema([ColSpec(type=DataType.long)])),
        (list[str], Schema([ColSpec(type=DataType.string)])),
        (list[bool], Schema([ColSpec(type=DataType.boolean)])),
        (list[float], Schema([ColSpec(type=DataType.double)])),
        (list[bytes], Schema([ColSpec(type=DataType.binary)])),
        (list[datetime.datetime], Schema([ColSpec(type=DataType.datetime)])),
        # lists
        (list[list[str]], Schema([ColSpec(type=Array(DataType.string))])),
        (List[List[str]], Schema([ColSpec(type=Array(DataType.string))])),  # noqa: UP006
        (list[list[list[str]]], Schema([ColSpec(type=Array(Array(DataType.string)))])),
        (List[List[List[str]]], Schema([ColSpec(type=Array(Array(DataType.string)))])),  # noqa: UP006
        # dictionaries
        (list[dict[str, str]], Schema([ColSpec(type=Map(DataType.string))])),
        (list[dict[str, int]], Schema([ColSpec(type=Map(DataType.long))])),
        (list[Dict[str, int]], Schema([ColSpec(type=Map(DataType.long))])),  # noqa: UP006
        (list[dict[str, list[str]]], Schema([ColSpec(type=Map(Array(DataType.string)))])),
        (list[Dict[str, List[str]]], Schema([ColSpec(type=Map(Array(DataType.string)))])),  # noqa: UP006
        # Union
        (list[Union[int, str]], Schema([ColSpec(type=AnyType())])),  # noqa: UP007
        (list[int | str], Schema([ColSpec(type=AnyType())])),
        (list[list[int | str]], Schema([ColSpec(type=Array(AnyType()))])),
        # Any
        (list[Any], Schema([ColSpec(type=AnyType())])),
        (list[list[Any]], Schema([ColSpec(type=Array(AnyType()))])),
    ],
)
def test_infer_schema_from_python_type_hints(type_hint, expected_schema):
    schema = _infer_schema_from_list_type_hint(type_hint)
    assert schema == expected_schema


@pytest.mark.parametrize(
    "type_hint",
    [
        pd.DataFrame,
        pd.Series,
        np.ndarray,
        csc_matrix,
        csr_matrix,
    ],
)
def test_type_hints_needs_signature(type_hint):
    assert _signature_cannot_be_inferred_from_type_hint(type_hint) is True


def test_infer_schema_from_type_hints_errors():
    with pytest.raises(MlflowException, match=r"Type hints must be wrapped in list\[...\]"):
        _infer_schema_from_list_type_hint(str)

    with pytest.raises(
        MlflowException, match=r"Type hint `list` doesn't contain a collection element type"
    ):
        _infer_schema_from_list_type_hint(list)

    class InvalidModel(pydantic.BaseModel):
        bool_field: bool | None

    message = (
        r"Optional field `bool_field` in Pydantic model `InvalidModel` "
        r"doesn't have a default value. Please set default value to None for this field."
    )
    with pytest.raises(
        MlflowException,
        match=message,
    ):
        _infer_schema_from_list_type_hint(list[InvalidModel])

    with pytest.raises(MlflowException, match=message):
        _infer_schema_from_list_type_hint(list[list[InvalidModel]])

    message = r"Input cannot be Optional type"
    with pytest.raises(MlflowException, match=message):
        _infer_schema_from_list_type_hint(Optional[list[str]])  # noqa: UP045

    with pytest.raises(MlflowException, match=message):
        _infer_schema_from_list_type_hint(list[str] | None)

    with pytest.raises(MlflowException, match=message):
        _infer_schema_from_list_type_hint(list[Optional[str]])  # noqa: UP045

    with pytest.raises(MlflowException, match=message):
        _infer_schema_from_list_type_hint(list[str | None])

    with pytest.raises(MlflowException, match=message):
        _infer_schema_from_list_type_hint(list[Union[str, int, type(None)]])  # noqa: UP007

    with pytest.raises(MlflowException, match=message):
        _infer_schema_from_list_type_hint(list[str | int | type(None)])

    with pytest.raises(
        MlflowException, match=r"Collections must have only a single type definition"
    ):
        _infer_schema_from_list_type_hint(list[str, int])

    with pytest.raises(MlflowException, match=r"Dictionary key type must be str"):
        _infer_schema_from_list_type_hint(list[dict[int, int]])

    with pytest.raises(
        MlflowException, match=r"Dictionary type hint must contain two element types"
    ):
        _infer_schema_from_list_type_hint(list[dict[int]])

    message = r"it must include a valid element type"
    with pytest.raises(MlflowException, match=message):
        _infer_schema_from_list_type_hint(list[Union])

    with pytest.raises(MlflowException, match=message):
        _infer_schema_from_list_type_hint(list[Optional])

    with pytest.raises(MlflowException, match=message):
        _infer_schema_from_list_type_hint(list[list])

    with pytest.raises(MlflowException, match=message):
        _infer_schema_from_list_type_hint(list[dict])

    with pytest.raises(UnsupportedTypeHintException, match=r"Unsupported type hint"):
        _infer_schema_from_list_type_hint(list[object])


@pytest.mark.parametrize(
    ("type_hint", "example"),
    [
        (
            CustomModel,
            {
                "long_field": 1,
                "str_field": "a",
                "bool_field": False,
                "double_field": 1.0,
                "binary_field": b"abc",
                "datetime_field": datetime.datetime.now(),
                "any_field": "a",
                "optional_str": "b",
            },
        ),
        (
            CustomModel,
            {
                "long_field": 1,
                "str_field": "a",
                "bool_field": True,
                "double_field": 1.0,
                "binary_field": b"abc",
                "datetime_field": datetime.datetime.now(),
                "any_field": "a",
            },
        ),
        (
            CustomModel,
            CustomModel(
                long_field=1,
                str_field="a",
                bool_field=True,
                double_field=1.0,
                datetime_field=datetime.datetime.now(),
                binary_field=b"abc",
                any_field="a",
            ),
        ),
        (
            list[CustomModel],
            [
                {
                    "long_field": 1,
                    "str_field": "a",
                    "bool_field": True,
                    "double_field": 1.0,
                    "binary_field": b"abc",
                    "datetime_field": datetime.datetime.now(),
                    "any_field": "a",
                    "optional_str": "b",
                },
                {
                    "long_field": 2,
                    "str_field": "b",
                    "bool_field": False,
                    "double_field": 2.0,
                    "binary_field": b"def",
                    "datetime_field": datetime.datetime.now(),
                    "any_field": "b",
                },
            ],
        ),
        (
            CustomModel2,
            {
                "custom_field": {"a": 1},
                "messages": [{"role": "a", "content": "b"}],
                "optional_int": 1,
            },
        ),
        (
            CustomModel2,
            {
                "custom_field": {"a": "abc"},
                "messages": [{"role": "a", "content": "b"}, {"role": "c", "content": "d"}],
            },
        ),
    ],
)
def test_pydantic_model_validation(type_hint, example):
    if isinstance(example, dict):
        assert _validate_data_against_type_hint(data=example, type_hint=type_hint) == type_hint(
            **example
        )
    elif isinstance(example, list):
        assert _validate_data_against_type_hint(data=example, type_hint=type_hint) == [
            get_args(type_hint)[0](**item) for item in example
        ]
    else:
        assert (
            _validate_data_against_type_hint(data=example.model_dump(), type_hint=type_hint)
            == example
        )


@pytest.mark.parametrize(
    ("type_hint", "example"),
    [
        (int, 1),
        (str, "a"),
        (bool, True),
        (float, 1.0),
        (bytes, b"abc"),
        (datetime.datetime, datetime.datetime.now()),
        (Any, "a"),
        (Any, ["a", 1]),
        (list[str], ["a", "b"]),
        (list[list[str]], [["a", "b"], ["c", "d"]]),
        (dict[str, int], {"a": 1, "b": 2}),
        (dict[str, list[str]], {"a": ["a", "b"], "b": ["c", "d"]}),
        (Union[int, str], 1),  # noqa: UP007
        (Union[int, str], "a"),  # noqa: UP007
        (int | str, 1),
        (int | str, "a"),
        # Union type is inferred as AnyType, so it accepts double here as well
        (Union[int, str], 1.2),  # noqa: UP007
        (int | str, 1.2),
        (list[Any], [1, "a"]),
    ],
)
def test_python_type_hints_validation(type_hint, example):
    assert _validate_data_against_type_hint(data=example, type_hint=type_hint) == example


def test_type_hints_validation_errors():
    with pytest.raises(MlflowException, match=r"Data doesn't match type hint"):
        _validate_data_against_type_hint({"long_field": 1, "str_field": "a"}, CustomModel)

    with pytest.raises(MlflowException, match=r"Expected type int, but got str"):
        _validate_data_against_type_hint("a", int)

    with pytest.raises(MlflowException, match=r"Expected list, but got str"):
        _validate_data_against_type_hint("a", list[str])

    with pytest.raises(
        MlflowException,
        match=r"Failed to validate data against type hint `list\[str\]`",
    ):
        _validate_data_against_type_hint(["a", 1], list[str])

    with pytest.raises(
        MlflowException,
        match=r"Expected dict, but got list",
    ):
        _validate_data_against_type_hint(["a", 1], dict[str, int])

    with pytest.raises(
        MlflowException,
        match=r"Failed to validate data against type hint `dict\[str, list\[str\]\]`",
    ):
        _validate_data_against_type_hint({1: ["a", "b"], "a": 1}, dict[str, list[str]])

    with pytest.raises(
        MlflowException,
        match=r"Expected type int, but got str",
    ):
        _validate_data_against_type_hint("a", int | None)

    with pytest.raises(
        InvalidTypeHintException,
        match=r"Invalid type hint `list`, it must include a valid element type.",
    ):
        _validate_data_against_type_hint(["a"], list)


@pytest.mark.parametrize(
    ("data", "type_hint", "expected_data"),
    [
        ("a", str, "a"),
        (["a", "b"], list[str], ["a", "b"]),
        ({"a": 1, "b": 2}, dict[str, int], {"a": 1, "b": 2}),
        (1, Optional[int], 1),  # noqa: UP045
        (1, int | None, 1),
        (None, Optional[int], None),  # noqa: UP045
        (None, int | None, None),
        (pd.DataFrame({"a": ["a", "b"]}), list[str], ["a", "b"]),
        (pd.DataFrame({"a": [{"x": "x"}]}), list[dict[str, str]], [{"x": "x"}]),
        # This is a temp workaround for evaluate
        (pd.DataFrame({"a": ["x", "y"], "b": ["c", "d"]}), list[str], ["x", "y"]),
    ],
)
def test_maybe_convert_data_for_type_hint(data, type_hint, expected_data):
    if isinstance(expected_data, pd.DataFrame):
        pd.testing.assert_frame_equal(_convert_data_to_type_hint(data, type_hint), expected_data)
    else:
        assert _convert_data_to_type_hint(data, type_hint) == expected_data


def test_maybe_convert_data_for_type_hint_errors():
    with mock.patch("mlflow.types.type_hints._logger.warning") as mock_warning:
        _convert_data_to_type_hint(pd.DataFrame({"a": ["x", "y"], "b": ["c", "d"]}), list[str])
        assert mock_warning.call_count == 1
        assert (
            "The data will be converted to a list of the first column."
            in mock_warning.call_args[0][0]
        )

    with pytest.raises(
        MlflowException,
        match=r"Only `list\[\.\.\.\]` type hint supports pandas DataFrame input",
    ):
        _convert_data_to_type_hint(pd.DataFrame([["a", "b"]]), str)


def test_is_example_valid_for_type_from_example():
    for data in [
        pd.DataFrame({"a": ["x", "y", "z"], "b": [1, 2, 3]}),
        pd.Series([1, 2, 3]),
        ["a", "b", "c"],
        [1, 2, 3],
    ]:
        assert _is_example_valid_for_type_from_example(data) is True

    for data in [
        "abc",
        123,
        None,
        {"a": 1},
        {"a": ["x", "y"]},
    ]:
        assert _is_example_valid_for_type_from_example(data) is False


@pytest.mark.parametrize(
    "data",
    [
        # list[scalar]
        ["x", "y", "z"],
        [1, 2, 3],
        [1.0, 2.0, 3.0],
        [True, False, True],
        [b"Hello", b"World"],
        # list[dict]
        [{"a": 1, "b": 2}],
        [{"role": "user", "content": "hello"}, {"role": "admin", "content": "hi"}],
        # pd Series
        pd.Series([1, 2, 3]),
        # pd DataFrame
        pd.DataFrame({"a": [1, 2, 3], "b": ["x", "y", "z"]}),
    ],
)
def test_convert_dataframe_to_example_format(data):
    schema = _infer_schema(data)
    df = _enforce_schema(data, schema)
    converted_data = _convert_dataframe_to_example_format(df, data)
    if isinstance(data, pd.Series):
        pd.testing.assert_series_equal(converted_data, data)
    elif isinstance(data, pd.DataFrame):
        pd.testing.assert_frame_equal(converted_data, data)
    else:
        assert converted_data == data
```

--------------------------------------------------------------------------------

---[FILE: test_uc_oss_integration.py]---
Location: mlflow-master/tests/uc_oss/test_uc_oss_integration.py

```python
import os
import subprocess
import sys

import pandas as pd
import pytest
from sklearn import datasets
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

import mlflow
from mlflow.exceptions import MlflowException

from tests.helper_functions import get_safe_port
from tests.tracking.integration_test_utils import _await_server_up_or_die

pytestmark = pytest.mark.skipif(
    "UC_OSS_INTEGRATION" not in os.environ,
    reason="This test is only valid w/in the github workflow integration job",
)


@pytest.fixture(scope="module")
def setup_servers():
    port = get_safe_port()
    with (
        subprocess.Popen(
            ["bin/start-uc-server"],
            cwd="unitycatalog",
        ) as uc_proc,
        subprocess.Popen(
            [sys.executable, "-m", "mlflow", "server", "--port", str(port)]
        ) as mlflow_proc,
    ):
        try:
            _await_server_up_or_die(port)
            _await_server_up_or_die(8080)

            mlflow_tracking_url = f"http://127.0.0.1:{port}"
            uc_oss_url = "uc:http://127.0.0.1:8080"

            mlflow.set_tracking_uri(mlflow_tracking_url)
            mlflow.set_registry_uri(uc_oss_url)

            yield mlflow_tracking_url
        finally:
            mlflow_proc.terminate()
            uc_proc.terminate()


def test_integration(setup_servers, tmp_path):
    catalog = "unity"
    schema = "default"
    registered_model_name = "iris"
    model_name = f"{catalog}.{schema}.{registered_model_name}"
    mlflow.set_experiment("iris-uc-oss")
    client = mlflow.MlflowClient()
    with pytest.raises(MlflowException, match="NOT_FOUND"):
        client.get_registered_model(model_name)

    X, y = datasets.load_iris(return_X_y=True, as_frame=True)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    with mlflow.start_run():
        # Train a sklearn model on the iris dataset
        clf = RandomForestClassifier(max_depth=7)
        clf.fit(X_train, y_train)
        # Take the first row of the training dataset as the model input example.
        input_example = X.iloc[[0]]
        # Log the model and register it as a new version in UC.
        mlflow.sklearn.log_model(
            clf,
            name="model",
            # The signature is automatically inferred from the input example and
            # its predicted output.
            input_example=input_example,
            registered_model_name=model_name,
        )

    model_version = 1
    model_uri = f"models:/{model_name}/{model_version}"
    rm_desc = "UC-OSS/MLflow Iris model"
    mv_desc = "Version 1 of the UC-OSS/MLflow Iris model"

    # Load the model and do some batch inference.
    # By specifying the UC OSS model uri, mlflow will make UC OSS
    # REST API calls to retrieve the model
    loaded_model = mlflow.pyfunc.load_model(model_uri)
    predictions = loaded_model.predict(X_test)
    iris_feature_names = datasets.load_iris().feature_names
    result = pd.DataFrame(X_test, columns=iris_feature_names)
    result["actual_class"] = y_test
    result["predicted_class"] = predictions
    assert result[:4] is not None

    # list_artifacts will use the UC OSS model URI and make REST API calls to
    # UC OSS to:
    #   1) retrieve credentials (none for file based UC OSS)
    #   2) use the storage location returned from UC OSS for the model version
    #      list the artifacts stored in the location
    mlflow.artifacts.list_artifacts(model_uri)

    path = os.path.join(tmp_path, "models", model_name, str(model_version))

    # download_artifacts will use the UC OSS model URI and make REST API calls
    # to UC OSS to:
    #   1) retrieve credentials (none for file based UC OSS)
    #   2) copy the artifact files from the storage location to the
    #      destination path
    mlflow.artifacts.download_artifacts(
        artifact_uri=f"models:/{model_name}/{model_version}",
        dst_path=path,
    )
    requirements_path = f"{path}/requirements.txt"
    assert os.path.exists(requirements_path), f"File {requirements_path} does not exist."
    with open(requirements_path) as file:
        lines = file.readlines()
    assert len(lines) > 0

    # Test get RM/MV works
    model1 = client.get_registered_model(model_name)
    assert model1.name == model_name
    assert model1.description == ""
    model_v1 = client.get_model_version(name=model_name, version=model_version)
    assert model_v1.name == model_name
    assert model_v1.version == 1
    assert model_v1.description == ""

    # Test update RM/MV works
    client.update_registered_model(model_name, description=rm_desc)
    model2 = mlflow.MlflowClient().get_registered_model(model_name)
    assert model2.name == model_name
    assert model2.description == rm_desc
    client.update_model_version(name=model_name, version=model_version, description=mv_desc)
    model_v1_2 = client.get_model_version(name=model_name, version=model_version)
    assert model_v1_2.name == model_name
    assert model_v1_2.version == 1
    assert model_v1_2.description == mv_desc

    rms = client.search_registered_models()
    assert len(rms) == 1
    mvs = client.search_model_versions(f"name='{model_name}'")
    assert len(mvs) == 1
    client.delete_model_version(name=model_name, version=1)
    mvs = client.search_model_versions(f"name='{model_name}'")
    assert len(mvs) == 0
    client.delete_registered_model(name=model_name)
    rms = client.search_registered_models()
    assert len(rms) == 0
    with pytest.raises(MlflowException, match="NOT_FOUND"):
        client.get_registered_model(model_name)
```

--------------------------------------------------------------------------------

---[FILE: test_annotations.py]---
Location: mlflow-master/tests/utils/test_annotations.py

```python
import re
from dataclasses import dataclass, fields

import pytest

from mlflow.utils.annotations import _get_min_indent_of_docstring, deprecated, keyword_only


class MyClass:
    @deprecated()
    def method(self):
        """
        Returns 0
        """
        return 0


@deprecated()
def function():
    """
    Returns 1
    """
    return 1


@keyword_only
@deprecated(since="0.0.0")
def deprecated_and_keyword_only_first(x):
    """Description

    Args:
        x: x

    Returns:
        y
    """
    return 1


@deprecated(since="0.0.0")
@keyword_only
def deprecated_and_keyword_only_second(x):
    """
    Description

    Args:
        x: x

    Returns:
        y
    """
    return 1


@deprecated()
class DeprecatedClass:
    """
    A deprecated class.
    """

    def __init__(self):
        pass

    def greet(self):
        """
        Greets the user.
        """
        return "Hello"


@deprecated(since="1.0.0")
@dataclass
class DeprecatedDataClass:
    """
    A deprecated dataclass.
    """

    x: int
    y: int

    def add(self):
        return self.x + self.y


@deprecated(since="1.0.0")
@dataclass
class AnotherDeprecatedDataClass:
    a: int
    b: int

    def add(self):
        return self.a + self.b


@deprecated()
@dataclass
class AnotherDeprecatedDataClassOrder:
    """
    A deprecated dataclass with decorators in different order.
    """

    m: int
    n: int


def test_deprecated_method():
    msg = "``tests.utils.test_annotations.MyClass.method`` is deprecated"
    with pytest.warns(FutureWarning, match=re.escape(msg)):
        assert MyClass().method() == 0
    docstring = MyClass.method.__doc__
    assert docstring is not None
    assert msg in docstring


def test_deprecated_function():
    msg = "``tests.utils.test_annotations.function`` is deprecated"
    with pytest.warns(FutureWarning, match=re.escape(msg)):
        assert function() == 1
    docstring = function.__doc__
    assert docstring is not None
    assert msg in docstring


def test_empty_docstring():
    docstring = ""
    expected_indent = ""
    assert _get_min_indent_of_docstring(docstring) == expected_indent


def test_single_line_docstring():
    docstring = """Single line with indent."""
    expected_indent = ""
    assert _get_min_indent_of_docstring(docstring) == expected_indent


def test_multi_line_docstring_first_line():
    first_line_docstring = """Description

    Args:
        x: x

    Returns:
        y
    """
    expected_indent = "    "
    assert _get_min_indent_of_docstring(first_line_docstring) == expected_indent


def test_multi_line_docstring_second_line():
    second_line_docstring = """
    Description

    Args:
        x: x

    Returns:
        y
    """
    expected_indent = "    "
    assert _get_min_indent_of_docstring(second_line_docstring) == expected_indent


def test_deprecated_and_keyword_first():
    docstring = deprecated_and_keyword_only_first.__doc__
    assert docstring is not None
    assert docstring.rstrip() == (
        """    .. note:: This method requires all argument be specified by keyword.
    .. Warning:: ``tests.utils.test_annotations.deprecated_and_keyword_only_first`` is deprecated since 0.0.0. This method will be removed in a future release.
Description

    Args:
        x: x

    Returns:
        y"""  # noqa: E501
    )


def test_deprecated_and_keyword_second():
    docstring = deprecated_and_keyword_only_second.__doc__
    assert docstring is not None
    assert docstring.rstrip() == (
        """    .. Warning:: ``tests.utils.test_annotations.deprecated_and_keyword_only_second`` is deprecated since 0.0.0. This method will be removed in a future release.
    .. note:: This method requires all argument be specified by keyword.

    Description

    Args:
        x: x

    Returns:
        y"""  # noqa: E501
    )


def test_deprecated_class():
    msg = "``tests.utils.test_annotations.DeprecatedClass`` is deprecated"
    with pytest.warns(FutureWarning, match=re.escape(msg)):
        DeprecatedClass()
    docstring = DeprecatedClass.__doc__
    assert docstring is not None
    assert msg in docstring


def test_deprecated_class_method():
    msg = "``tests.utils.test_annotations.DeprecatedClass`` is deprecated"
    with pytest.warns(FutureWarning, match=re.escape(msg)):
        instance = DeprecatedClass()
    assert instance.greet() == "Hello"
    docstring = DeprecatedClass.__doc__
    assert docstring is not None
    assert msg in docstring


def test_deprecated_dataclass():
    msg = "``tests.utils.test_annotations.DeprecatedDataClass`` is deprecated since 1.0.0"
    with pytest.warns(FutureWarning, match=re.escape(msg)):
        DeprecatedDataClass(x=10, y=20)
    docstring = DeprecatedDataClass.__doc__
    assert docstring is not None
    assert msg in docstring


def test_deprecated_dataclass_fields():
    msg = "``tests.utils.test_annotations.DeprecatedDataClass`` is deprecated since 1.0.0"
    with pytest.warns(FutureWarning, match=re.escape(msg)):
        instance = DeprecatedDataClass(x=5, y=15)
    assert instance.x == 5
    assert instance.y == 15
    docstring = DeprecatedDataClass.__doc__
    assert docstring is not None
    assert msg in docstring


def test_deprecated_dataclass_method():
    msg = "``tests.utils.test_annotations.AnotherDeprecatedDataClass`` is deprecated since 1.0.0"
    with pytest.warns(FutureWarning, match=re.escape(msg)):
        instance = AnotherDeprecatedDataClass(a=3, b=4)
    assert instance.add() == 7
    docstring = AnotherDeprecatedDataClass.__doc__
    assert docstring is not None
    assert msg in docstring


def test_deprecated_dataclass_different_order():
    msg = "``tests.utils.test_annotations.AnotherDeprecatedDataClassOrder`` is deprecated"
    with pytest.warns(FutureWarning, match=re.escape(msg)):
        AnotherDeprecatedDataClassOrder(m=7, n=8)
    docstring = AnotherDeprecatedDataClassOrder.__doc__
    assert docstring is not None
    assert msg in docstring


def test_deprecated_dataclass_dunder_methods():
    instance = DeprecatedDataClass(x=1, y=2)

    assert instance.x == 1
    assert instance.y == 2

    expected_repr = "DeprecatedDataClass(x=1, y=2)"
    assert repr(instance) == expected_repr

    instance2 = DeprecatedDataClass(x=1, y=2)
    instance3 = DeprecatedDataClass(x=2, y=3)
    assert instance == instance2
    assert instance != instance3


def test_deprecated_dataclass_preserves_fields():
    instance = DeprecatedDataClass(x=100, y=200)
    field_names = {f.name for f in fields(DeprecatedDataClass)}
    assert field_names == {"x", "y"}
    assert instance.x == 100
    assert instance.y == 200


def test_deprecated_dataclass_preserves_methods():
    instance = DeprecatedDataClass(x=10, y=20)
    assert instance.add() == 30


def test_deprecated_dataclass_preserves_class_attributes():
    assert DeprecatedDataClass.__module__ == "tests.utils.test_annotations"
    assert DeprecatedDataClass.__qualname__ == "DeprecatedDataClass"


def test_deprecated_dataclass_dunder_methods_not_mutated():
    instance = DeprecatedDataClass(x=5, y=10)
    assert instance.x == 5
    assert instance.y == 10

    expected_repr = "DeprecatedDataClass(x=5, y=10)"
    assert repr(instance) == expected_repr

    same_instance = DeprecatedDataClass(x=5, y=10)
    different_instance = DeprecatedDataClass(x=1, y=2)
    assert instance == same_instance
    assert instance != different_instance

    assert instance.add() == 15

    allowed_attrs = {"x", "y", "add"}
    attrs = {attr for attr in dir(instance) if not attr.startswith("__")}
    assert attrs == allowed_attrs


def test_deprecated_dataclass_special_methods_integrity():
    instance = DeprecatedDataClass(x=42, y=84)

    assert instance.x == 42
    assert instance.y == 84

    expected_repr = "DeprecatedDataClass(x=42, y=84)"
    assert repr(instance) == expected_repr

    same_instance = DeprecatedDataClass(x=42, y=84)
    different_instance = DeprecatedDataClass(x=1, y=2)
    assert instance == same_instance
    assert instance != different_instance

    assert instance.add() == 126

    allowed_attrs = {"x", "y", "add"}
    attrs = {attr for attr in dir(instance) if not attr.startswith("__")}
    assert attrs == allowed_attrs
```

--------------------------------------------------------------------------------

---[FILE: test_arguments_utils.py]---
Location: mlflow-master/tests/utils/test_arguments_utils.py

```python
import functools

import pytest

from mlflow.utils.arguments_utils import _get_arg_names


def no_args():
    pass


def positional(a, b):
    return a, b


def keyword(a=0, b=0):
    return a, b


def positional_and_keyword(a, b=0):
    return a, b


def keyword_only(*, a, b=0):
    return a, b


def var_positional(*args):
    return args


def var_keyword(**kwargs):
    return kwargs


def var_positional_and_keyword(*args, **kwargs):
    return args, kwargs


@functools.wraps(positional)
def wrapper(*args, **kwargs):
    return positional(*args, **kwargs)


@pytest.mark.parametrize(
    ("func", "expected_args"),
    [
        (no_args, []),
        (positional, ["a", "b"]),
        (keyword, ["a", "b"]),
        (positional_and_keyword, ["a", "b"]),
        (keyword_only, ["a", "b"]),
        (var_positional, ["args"]),
        (var_keyword, ["kwargs"]),
        (var_positional_and_keyword, ["args", "kwargs"]),
        (wrapper, ["a", "b"]),
    ],
)
def test_get_arg_names(func, expected_args):
    assert _get_arg_names(func) == expected_args
```

--------------------------------------------------------------------------------

````
