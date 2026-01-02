---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 860
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 860 of 991)

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

---[FILE: test_model_input_examples.py]---
Location: mlflow-master/tests/models/test_model_input_examples.py

```python
import json
import math
from io import StringIO
from unittest import mock

import numpy as np
import pandas as pd
import pytest
import sklearn.neighbors as knn
from scipy.sparse import csc_matrix, csr_matrix
from sklearn import datasets
from sklearn.base import BaseEstimator, ClassifierMixin

import mlflow
from mlflow.models import Model
from mlflow.models.signature import ModelSignature, infer_signature
from mlflow.models.utils import (
    _Example,
    _read_sparse_matrix_from_json,
    parse_inputs_data,
)
from mlflow.types import DataType
from mlflow.types.schema import ColSpec, Schema, TensorSpec
from mlflow.types.utils import TensorsNotSupportedException
from mlflow.utils.file_utils import TempDir
from mlflow.utils.proto_json_utils import dataframe_from_raw_json


@pytest.fixture
def pandas_df_with_all_types():
    df = pd.DataFrame(
        {
            "boolean": [True, False, True],
            "integer": np.array([1, 2, 3], np.int32),
            "long": np.array([1, 2, 3], np.int64),
            "float": np.array([math.pi, 2 * math.pi, 3 * math.pi], np.float32),
            "double": [math.pi, 2 * math.pi, 3 * math.pi],
            "binary": [bytes([1, 2, 3]), bytes([4, 5, 6]), bytes([7, 8, 9])],
            "string": ["a", "b", "c"],
            "boolean_ext": [True, False, True],
            "integer_ext": [1, 2, 3],
            "string_ext": ["a", "b", "c"],
            "array": np.array(["a", "b", "c"]),
        }
    )
    df["boolean_ext"] = df["boolean_ext"].astype("boolean")
    df["integer_ext"] = df["integer_ext"].astype("Int64")
    df["string_ext"] = df["string_ext"].astype("string")
    return df


@pytest.fixture
def df_without_columns():
    return pd.DataFrame({0: [1, 2, 3], 1: [4, 5, 6], 2: [7, 8, 9]})


@pytest.fixture
def df_with_nan():
    return pd.DataFrame(
        {
            "boolean": [True, False, True],
            "integer": np.array([1, 2, 3], np.int32),
            "long": np.array([1, 2, 3], np.int64),
            "float": np.array([np.nan, 2 * math.pi, 3 * math.pi], np.float32),
            "double": [math.pi, np.nan, 3 * math.pi],
            "binary": [bytes([1, 2, 3]), bytes([4, 5, 6]), bytes([7, 8, 9])],
            "string": ["a", "b", "c"],
        }
    )


@pytest.fixture
def dict_of_ndarrays():
    return {
        "1D": np.arange(0, 12, 0.5),
        "2D": np.arange(0, 12, 0.5).reshape(3, 8),
        "3D": np.arange(0, 12, 0.5).reshape(2, 3, 4),
        "4D": np.arange(0, 12, 0.5).reshape(3, 2, 2, 2),
    }


@pytest.fixture
def dict_of_ndarrays_with_nans():
    return {
        "1D": np.array([0.5, np.nan, 2.0]),
        "2D": np.array([[0.1, 0.2], [np.nan, 0.5]]),
        "3D": np.array([[[0.1, np.nan], [0.3, 0.4]], [[np.nan, 0.6], [0.7, np.nan]]]),
    }


@pytest.fixture
def dict_of_sparse_matrix():
    return {
        "sparse_matrix_csc": csc_matrix(np.arange(0, 12, 0.5).reshape(3, 8)),
        "sparse_matrix_csr": csr_matrix(np.arange(0, 12, 0.5).reshape(3, 8)),
    }


def test_input_examples(pandas_df_with_all_types, dict_of_ndarrays):
    sig = infer_signature(pandas_df_with_all_types)
    # test setting example with data frame with all supported data types
    with TempDir() as tmp:
        example = _Example(pandas_df_with_all_types)
        example.save(tmp.path())
        filename = example.info["artifact_path"]
        with open(tmp.path(filename)) as f:
            data = json.load(f)
            assert set(data.keys()) == {"columns", "data"}
        parsed_df = dataframe_from_raw_json(tmp.path(filename), schema=sig.inputs)
        pd.testing.assert_frame_equal(pandas_df_with_all_types, parsed_df, check_dtype=False)
        # the frame read without schema should match except for the binary values
        pd.testing.assert_frame_equal(
            parsed_df.drop(columns=["binary"]),
            dataframe_from_raw_json(tmp.path(filename)).drop(columns=["binary"]),
            check_dtype=False,
        )

    # NB: Drop columns that cannot be encoded by proto_json_utils.pyNumpyEncoder
    new_df = pandas_df_with_all_types.drop(columns=["boolean_ext", "integer_ext", "string_ext"])

    # pass the input as dictionary instead
    with TempDir() as tmp:
        d = {name: new_df[name].values for name in new_df.columns}
        example = _Example(d)
        example.save(tmp.path())
        filename = example.info["artifact_path"]
        parsed_dict = parse_inputs_data(tmp.path(filename))
        assert d.keys() == parsed_dict.keys()
        # Asserting binary will fail since it is converted to base64 encoded strings.
        # The check above suffices that the binary input is stored.
        del d["binary"]
        for key in d:
            np.testing.assert_array_equal(d[key], parsed_dict[key])

    # input passed as numpy array
    new_df = pandas_df_with_all_types.drop(columns=["binary"])
    for col in new_df:
        input_example = new_df[col].to_numpy()
        with TempDir() as tmp:
            example = _Example(input_example)
            example.save(tmp.path())
            filename = example.info["artifact_path"]
            parsed_ary = parse_inputs_data(tmp.path(filename))
            np.testing.assert_array_equal(parsed_ary, input_example)

    # pass multidimensional array
    for col in dict_of_ndarrays:
        input_example = dict_of_ndarrays[col]
        with TempDir() as tmp:
            example = _Example(input_example)
            example.save(tmp.path())
            filename = example.info["artifact_path"]
            parsed_ary = parse_inputs_data(tmp.path(filename))
            np.testing.assert_array_equal(parsed_ary, input_example)

    # pass multidimensional array as a list
    example = np.array([[1, 2, 3]])
    with pytest.raises(
        TensorsNotSupportedException,
        match=r"Numpy arrays in list are not supported as input examples.",
    ):
        _Example([example, example])

    # pass dict with scalars
    with TempDir() as tmp:
        example = {"a": 1, "b": "abc"}
        x = _Example(example)
        x.save(tmp.path())
        filename = x.info["artifact_path"]
        with open(tmp.path(filename)) as f:
            parsed_data = json.load(f)
        assert example == parsed_data


def test_pandas_orients_for_input_examples(
    pandas_df_with_all_types, df_without_columns, dict_of_ndarrays
):
    # test setting example with data frame with all supported data types
    with TempDir() as tmp:
        example = _Example(pandas_df_with_all_types)
        example.save(tmp.path())
        filename = example.info["artifact_path"]
        assert example.info["type"] == "dataframe"
        assert example.info["pandas_orient"] == "split"
        with open(tmp.path(filename)) as f:
            data = json.load(f)
            dataframe = pd.read_json(
                StringIO(json.dumps(data)), orient=example.info["pandas_orient"], precise_float=True
            )
            pd.testing.assert_frame_equal(
                pandas_df_with_all_types.drop(columns=["binary"]),
                dataframe.drop(columns=["binary"]),
                check_dtype=False,
            )

    with TempDir() as tmp:
        example = _Example(df_without_columns)
        example.save(tmp.path())
        filename = example.info["artifact_path"]
        assert example.info["type"] == "dataframe"
        assert example.info["pandas_orient"] == "values"
        with open(tmp.path(filename)) as f:
            data = json.load(f)
            assert set(data.keys()) == {"data"}
            # NOTE: when no column names are provided (i.e. values orient),
            # saving an example adds a "data" key rather than directly storing the plain data
            data = data["data"]
            dataframe = pd.read_json(
                StringIO(json.dumps(data)), orient=example.info["pandas_orient"]
            )
            pd.testing.assert_frame_equal(dataframe, df_without_columns, check_dtype=False)

    # pass dict with scalars
    with TempDir() as tmp:
        example = {"a": 1, "b": "abc"}
        x = _Example(example)
        x.save(tmp.path())
        filename = x.info["artifact_path"]
        assert x.info["type"] == "json_object"
        with open(tmp.path(filename)) as f:
            parsed_json = json.load(f)
            assert parsed_json == example


def test_sparse_matrix_input_examples(dict_of_sparse_matrix):
    for example_type, input_example in dict_of_sparse_matrix.items():
        with TempDir() as tmp:
            example = _Example(input_example)
            example.save(tmp.path())
            filename = example.info["artifact_path"]
            assert example.info["type"] == example_type
            parsed_matrix = _read_sparse_matrix_from_json(tmp.path(filename), example_type)
            np.testing.assert_array_equal(parsed_matrix.toarray(), input_example.toarray())


def test_input_examples_with_nan(df_with_nan, dict_of_ndarrays_with_nans):
    # test setting example with data frame with NaN values in it
    sig = infer_signature(df_with_nan)
    with TempDir() as tmp:
        example = _Example(df_with_nan)
        example.save(tmp.path())
        filename = example.info["artifact_path"]
        assert example.info["type"] == "dataframe"
        assert example.info["pandas_orient"] == "split"
        with open(tmp.path(filename)) as f:
            data = json.load(f)
            assert set(data.keys()) == {"columns", "data"}
            pd.read_json(StringIO(json.dumps(data)), orient=example.info["pandas_orient"])

        parsed_df = dataframe_from_raw_json(tmp.path(filename), schema=sig.inputs)

        # by definition of NaN, NaN == NaN is False but NaN != NaN is True
        pd.testing.assert_frame_equal(df_with_nan, parsed_df, check_dtype=False)
        # the frame read without schema should match except for the binary values
        no_schema_df = dataframe_from_raw_json(tmp.path(filename))
        a = parsed_df.drop(columns=["binary"])
        b = no_schema_df.drop(columns=["binary"])
        pd.testing.assert_frame_equal(a, b, check_dtype=False)

    # pass multidimensional array
    for col in dict_of_ndarrays_with_nans:
        input_example = dict_of_ndarrays_with_nans[col]
        sig = infer_signature(input_example)
        with TempDir() as tmp:
            example = _Example(input_example)
            example.save(tmp.path())
            filename = example.info["artifact_path"]
            assert example.info["type"] == "ndarray"
            parsed_ary = parse_inputs_data(tmp.path(filename), schema=sig.inputs)
            assert np.array_equal(parsed_ary, input_example, equal_nan=True)

            # without a schema/dtype specified, the resulting tensor will keep the None type
            no_schema_df = parse_inputs_data(tmp.path(filename))
            np.testing.assert_array_equal(
                no_schema_df, np.where(np.isnan(input_example), None, input_example)
            )


class DummySklearnModel(BaseEstimator, ClassifierMixin):
    def __init__(self, output_shape=(1,)):
        self.output_shape = output_shape

    def fit(self, X, y=None):
        return self

    def predict(self, X):
        n_samples = X.shape[0]
        full_output_shape = (n_samples,) + self.output_shape
        return np.zeros(full_output_shape, dtype=np.dtype("int64"))


@pytest.mark.parametrize(
    ("input_is_tabular", "output_shape", "expected_signature"),
    [
        # When the input example is column-based, output 1D numpy arrays are interpreted `ColSpec`s
        (
            True,
            (),
            ModelSignature(
                inputs=Schema([ColSpec(name="feature", type=DataType.string)]),
                outputs=Schema([ColSpec(type=DataType.long)]),
            ),
        ),
        # But if the output numpy array has higher dimensions, fallback to interpreting the model
        # output as `TensorSpec`s.
        (
            True,
            (2,),
            ModelSignature(
                inputs=Schema([ColSpec(name="feature", type=DataType.string)]),
                outputs=Schema([TensorSpec(np.dtype("int64"), (-1, 2))]),
            ),
        ),
        # If the input example is tensor-based, interpret output numpy arrays as `TensorSpec`s
        (
            False,
            (),
            ModelSignature(
                inputs=Schema([TensorSpec(np.dtype("int64"), (-1, 1))]),
                outputs=Schema([TensorSpec(np.dtype("int64"), (-1,))]),
            ),
        ),
    ],
)
def test_infer_signature_with_input_example(input_is_tabular, output_shape, expected_signature):
    model = DummySklearnModel(output_shape=output_shape)
    artifact_path = "model"
    example = pd.DataFrame({"feature": ["value"]}) if input_is_tabular else np.array([[1]])

    with mlflow.start_run():
        model_info = mlflow.sklearn.log_model(model, name=artifact_path, input_example=example)

    mlflow_model = Model.load(model_info.model_uri)
    assert mlflow_model.signature == expected_signature


def test_infer_signature_from_example_can_be_disabled():
    artifact_path = "model"
    with mlflow.start_run():
        model_info = mlflow.sklearn.log_model(
            DummySklearnModel(output_shape=()),
            name=artifact_path,
            input_example=np.array([[1]]),
            signature=False,
        )

    mlflow_model = Model.load(model_info.model_uri)
    assert mlflow_model.signature is None


def test_infer_signature_raises_if_predict_on_input_example_fails(monkeypatch):
    monkeypatch.setenv("MLFLOW_TESTING", "false")

    class ErrorModel(BaseEstimator, ClassifierMixin):
        def fit(self, X, y=None):
            return self

        def predict(self, X):
            raise Exception("oh no!")

    with mock.patch("mlflow.models.model._logger.warning") as mock_warning:
        with mlflow.start_run():
            mlflow.sklearn.log_model(ErrorModel(), name="model", input_example=np.array([[1]]))
        assert any(
            "Failed to validate serving input example" in call[0][0]
            for call in mock_warning.call_args_list
        )


@pytest.fixture(scope="module")
def iris_model():
    X, y = datasets.load_iris(return_X_y=True, as_frame=True)
    return knn.KNeighborsClassifier().fit(X, y)


@pytest.mark.parametrize(
    "input_example",
    [
        {
            "sepal length (cm)": 5.1,
            "sepal width (cm)": 3.5,
            "petal length (cm)": 1.4,
            "petal width (cm)": 0.2,
        },
        pd.DataFrame([[5.1, 3.5, 1.4, 0.2]]),
        pd.DataFrame(
            {
                "sepal length (cm)": 5.1,
                "sepal width (cm)": 3.5,
                "petal length (cm)": 1.4,
                "petal width (cm)": 0.2,
            },
            index=[0],
        ),
    ],
)
def test_infer_signature_on_multi_column_input_examples(input_example, iris_model):
    artifact_path = "model"

    with mlflow.start_run():
        model_info = mlflow.sklearn.log_model(
            iris_model, name=artifact_path, input_example=input_example
        )

    mlflow_model = Model.load(model_info.model_uri)
    input_columns = mlflow_model.signature.inputs.inputs
    assert len(input_columns) == 4
    assert all(col.type == DataType.double for col in input_columns)
    assert mlflow_model.signature.outputs == Schema([ColSpec(type=DataType.long)])


@pytest.mark.parametrize(
    "input_example",
    ["some string", bytes([1, 2, 3])],
)
def test_infer_signature_on_scalar_input_examples(input_example):
    class IdentitySklearnModel(BaseEstimator, ClassifierMixin):
        def fit(self, X, y=None):
            return self

        def predict(self, X):
            if isinstance(X, pd.DataFrame):
                return X
            raise Exception("Unsupported input type")

    artifact_path = "model"

    with mlflow.start_run():
        model_info = mlflow.sklearn.log_model(
            IdentitySklearnModel(), name=artifact_path, input_example=input_example
        )

    mlflow_model = Model.load(model_info.model_uri)
    signature = mlflow_model.signature
    assert isinstance(signature, ModelSignature)
    assert signature.inputs.inputs[0].name is None
    t = DataType.string if isinstance(input_example, str) else DataType.binary
    assert signature == ModelSignature(
        inputs=Schema([ColSpec(type=t)]),
        outputs=Schema([ColSpec(name=0, type=t)]),
    )
    # test that a single string still passes pyfunc schema enforcement
    mlflow.pyfunc.load_model(model_info.model_uri).predict(input_example)
```

--------------------------------------------------------------------------------

---[FILE: test_pyfunc.py]---
Location: mlflow-master/tests/models/test_pyfunc.py

```python
MLFLOW_VERSION = "1.0.0"  # we expect this model to be bound to this mlflow version.


class PyFuncTestModel:
    def __init__(self, check_version=True):
        self._check_version = check_version

    def predict(self, df):
        from mlflow.version import VERSION

        if self._check_version:
            assert VERSION == MLFLOW_VERSION
        mu = df.mean().mean()
        return [mu for _ in range(len(df))]


def _load_pyfunc(_):
    return PyFuncTestModel()
```

--------------------------------------------------------------------------------

---[FILE: test_python_api.py]---
Location: mlflow-master/tests/models/test_python_api.py

```python
import datetime
import json
import os
import sys
from unittest import mock

import numpy as np
import pandas as pd
import pytest
import scipy.sparse

import mlflow
from mlflow.exceptions import MlflowException
from mlflow.models.python_api import (
    _CONTENT_TYPE_CSV,
    _CONTENT_TYPE_JSON,
    _serialize_input_data,
)
from mlflow.tracing.constant import TraceMetadataKey
from mlflow.utils.env_manager import CONDA, LOCAL, UV, VIRTUALENV

from tests.tracing.helper import get_traces


@pytest.mark.parametrize(
    ("input_data", "expected_data", "content_type"),
    [
        (
            "x,y\n1,3\n2,4",
            pd.DataFrame({"x": [1, 2], "y": [3, 4]}),
            _CONTENT_TYPE_CSV,
        ),
        (
            {"a": [1]},
            {"a": np.array([1])},
            _CONTENT_TYPE_JSON,
        ),
        (
            1,
            np.array(1),
            _CONTENT_TYPE_JSON,
        ),
        (
            np.array([1, 2, 3]),
            np.array([1, 2, 3]),
            _CONTENT_TYPE_JSON,
        ),
        (
            scipy.sparse.csc_matrix([[1, 2], [3, 4]]),
            np.array([[1, 2], [3, 4]]),
            _CONTENT_TYPE_JSON,
        ),
        (
            # uLLM input, no change
            {"input": "some_data"},
            {"input": "some_data"},
            _CONTENT_TYPE_JSON,
        ),
    ],
)
@pytest.mark.parametrize(
    "env_manager",
    [VIRTUALENV, UV],
)
def test_predict(input_data, expected_data, content_type, env_manager):
    class TestModel(mlflow.pyfunc.PythonModel):
        def predict(self, context, model_input):
            if isinstance(model_input, pd.DataFrame):
                assert model_input.equals(expected_data)
            elif isinstance(model_input, np.ndarray):
                assert np.array_equal(model_input, expected_data)
            else:
                assert model_input == expected_data
            return {}

    with mlflow.start_run():
        model_info = mlflow.pyfunc.log_model(
            name="model",
            python_model=TestModel(),
            extra_pip_requirements=["pytest"],
        )

    mlflow.models.predict(
        model_uri=model_info.model_uri,
        input_data=input_data,
        content_type=content_type,
        env_manager=env_manager,
    )


@pytest.mark.parametrize(
    "env_manager",
    [VIRTUALENV, CONDA, UV],
)
def test_predict_with_pip_requirements_override(env_manager):
    if env_manager == CONDA:
        if sys.platform == "win32":
            pytest.skip("Skipping conda tests on Windows")

    class TestModel(mlflow.pyfunc.PythonModel):
        def predict(self, context, model_input):
            # XGBoost should be installed by pip_requirements_override
            import xgboost

            assert xgboost.__version__ == "1.7.3"

            # Scikit-learn version should be overridden to 1.3.0 by pip_requirements_override
            import sklearn

            assert sklearn.__version__ == "1.3.0"

    with mlflow.start_run():
        model_info = mlflow.pyfunc.log_model(
            name="model",
            python_model=TestModel(),
            extra_pip_requirements=["scikit-learn==1.3.2", "pytest"],
        )

    requirements_override = ["xgboost==1.7.3", "scikit-learn==1.3.0"]
    if env_manager == CONDA:
        # Install charset-normalizer with conda-forge to work around pip-vs-conda issue during
        # CI tests. At the beginning of the CI test, it installs MLflow dependencies via pip,
        # which includes charset-normalizer. Then when it runs this test case, the conda env
        # is created but charset-normalizer is installed via the default channel, which is one
        # major version behind the version installed via pip (as of 2024 Jan). As a result,
        # Python env confuses pip and conda versions and cause errors like "ImportError: cannot
        # import name 'COMMON_SAFE_ASCII_CHARACTERS' from 'charset_normalizer.constant'".
        # To work around this, we install the latest cversion from the conda-forge.
        # TODO: Implement better isolation approach for pip and conda environments during testing.
        requirements_override.append("conda-forge::charset-normalizer")

    mlflow.models.predict(
        model_uri=model_info.model_uri,
        input_data={"inputs": [1, 2, 3]},
        content_type=_CONTENT_TYPE_JSON,
        pip_requirements_override=requirements_override,
        env_manager=env_manager,
    )


@pytest.mark.parametrize("env_manager", [VIRTUALENV, CONDA, UV])
def test_predict_with_model_alias(env_manager):
    class TestModel(mlflow.pyfunc.PythonModel):
        def predict(self, context, model_input):
            assert os.environ["TEST"] == "test"
            return model_input

    with mlflow.start_run():
        mlflow.pyfunc.log_model(
            name="model",
            python_model=TestModel(),
            registered_model_name="model_name",
        )
    client = mlflow.MlflowClient()
    client.set_registered_model_alias("model_name", "test_alias", 1)

    mlflow.models.predict(
        model_uri="models:/model_name@test_alias",
        input_data="abc",
        env_manager=env_manager,
        extra_envs={"TEST": "test"},
    )


@pytest.mark.parametrize("env_manager", [VIRTUALENV, CONDA, UV])
def test_predict_with_extra_envs(env_manager):
    class TestModel(mlflow.pyfunc.PythonModel):
        def predict(self, context, model_input):
            assert os.environ["TEST"] == "test"
            return model_input

    with mlflow.start_run():
        model_info = mlflow.pyfunc.log_model(
            name="model",
            python_model=TestModel(),
        )

    mlflow.models.predict(
        model_uri=model_info.model_uri,
        input_data="abc",
        content_type=_CONTENT_TYPE_JSON,
        env_manager=env_manager,
        extra_envs={"TEST": "test"},
    )


def test_predict_with_extra_envs_errors():
    class TestModel(mlflow.pyfunc.PythonModel):
        def predict(self, context, model_input):
            assert os.environ["TEST"] == "test"
            return model_input

    with mlflow.start_run():
        model_info = mlflow.pyfunc.log_model(
            name="model",
            python_model=TestModel(),
        )

    with pytest.raises(
        MlflowException,
        match=r"Extra environment variables are only "
        r"supported when env_manager is set to 'virtualenv', 'conda' or 'uv'",
    ):
        mlflow.models.predict(
            model_uri=model_info.model_uri,
            input_data="abc",
            content_type=_CONTENT_TYPE_JSON,
            env_manager=LOCAL,
            extra_envs={"TEST": "test"},
        )

    with pytest.raises(
        MlflowException, match=r"An exception occurred while running model prediction"
    ):
        mlflow.models.predict(
            model_uri=model_info.model_uri,
            input_data="abc",
            content_type=_CONTENT_TYPE_JSON,
        )


@pytest.fixture
def mock_backend():
    mock_backend = mock.MagicMock()
    with mock.patch("mlflow.models.python_api.get_flavor_backend", return_value=mock_backend):
        yield mock_backend


def test_predict_with_both_input_data_and_path_raise(mock_backend):
    with pytest.raises(MlflowException, match=r"Both input_data and input_path are provided"):
        mlflow.models.predict(
            model_uri="runs:/test/Model",
            input_data={"inputs": [1, 2, 3]},
            input_path="input.csv",
            content_type=_CONTENT_TYPE_CSV,
        )


def test_predict_invalid_content_type(mock_backend):
    with pytest.raises(MlflowException, match=r"Content type must be one of"):
        mlflow.models.predict(
            model_uri="runs:/test/Model",
            input_data={"inputs": [1, 2, 3]},
            content_type="any",
        )


def test_predict_with_input_none(mock_backend):
    mlflow.models.predict(
        model_uri="runs:/test/Model",
        content_type=_CONTENT_TYPE_CSV,
    )

    mock_backend.predict.assert_called_once_with(
        model_uri="runs:/test/Model",
        input_path=None,
        output_path=None,
        content_type=_CONTENT_TYPE_CSV,
        pip_requirements_override=None,
        extra_envs=None,
    )


@pytest.mark.parametrize(
    ("input_data", "content_type", "expected"),
    [
        # String (convert to serving input)
        ("[1, 2, 3]", _CONTENT_TYPE_JSON, '{"inputs": "[1, 2, 3]"}'),
        # uLLM String (no change)
        ({"input": "data"}, _CONTENT_TYPE_JSON, '{"input": "data"}'),
        ("x,y,z\n1,2,3\n4,5,6", _CONTENT_TYPE_CSV, "x,y,z\n1,2,3\n4,5,6"),
        # Bool
        (True, _CONTENT_TYPE_JSON, '{"inputs": true}'),
        # Int
        (1, _CONTENT_TYPE_JSON, '{"inputs": 1}'),
        # Float
        (1.0, _CONTENT_TYPE_JSON, '{"inputs": 1.0}'),
        # Datetime
        (
            datetime.datetime(2021, 1, 1, 0, 0, 0),
            _CONTENT_TYPE_JSON,
            '{"inputs": "2021-01-01T00:00:00"}',
        ),
        # List
        ([1, 2, 3], _CONTENT_TYPE_CSV, "0\n1\n2\n3\n"),  # a header '0' is added by pandas
        ([[1, 2, 3], [4, 5, 6]], _CONTENT_TYPE_CSV, "0,1,2\n1,2,3\n4,5,6\n"),
        # Dict (pandas)
        (
            {
                "x": [
                    1,
                    2,
                ],
                "y": [3, 4],
            },
            _CONTENT_TYPE_CSV,
            "x,y\n1,3\n2,4\n",
        ),
        # Dict (json)
        ({"a": [1, 2, 3]}, _CONTENT_TYPE_JSON, '{"inputs": {"a": [1, 2, 3]}}'),
        # Pandas DataFrame (csv)
        (pd.DataFrame({"x": [1, 2, 3], "y": [4, 5, 6]}), _CONTENT_TYPE_CSV, "x,y\n1,4\n2,5\n3,6\n"),
        # Pandas DataFrame (json)
        (
            pd.DataFrame({"x": [1, 2, 3], "y": [4, 5, 6]}),
            _CONTENT_TYPE_JSON,
            '{"dataframe_split": {"columns": ["x", "y"], "data": [[1, 4], [2, 5], [3, 6]]}}',
        ),
        # Numpy Array
        (np.array([1, 2, 3]), _CONTENT_TYPE_JSON, '{"inputs": [1, 2, 3]}'),
        # CSC Matrix
        (
            scipy.sparse.csc_matrix([[1, 2], [3, 4]]),
            _CONTENT_TYPE_JSON,
            '{"inputs": [[1, 2], [3, 4]]}',
        ),
        # CSR Matrix
        (
            scipy.sparse.csr_matrix([[1, 2], [3, 4]]),
            _CONTENT_TYPE_JSON,
            '{"inputs": [[1, 2], [3, 4]]}',
        ),
    ],
)
def test_serialize_input_data(input_data, content_type, expected):
    if content_type == _CONTENT_TYPE_JSON:
        assert json.loads(_serialize_input_data(input_data, content_type)) == json.loads(expected)
    else:
        assert _serialize_input_data(input_data, content_type) == expected


@pytest.mark.parametrize(
    ("input_data", "content_type"),
    [
        # Invalid input datatype for the content type
        (1, _CONTENT_TYPE_CSV),
        ({1, 2, 3}, _CONTENT_TYPE_CSV),
        # Invalid string
        ("x,y\n1,2\n3,4,5\n", _CONTENT_TYPE_CSV),
        # Invalid list
        ([[1, 2], [3, 4], 5], _CONTENT_TYPE_CSV),
        # Invalid dict (unserealizable)
        ({"x": 1, "y": {1, 2, 3}}, _CONTENT_TYPE_JSON),
    ],
)
def test_serialize_input_data_invalid_format(input_data, content_type):
    with pytest.raises(MlflowException):  # noqa: PT011
        _serialize_input_data(input_data, content_type)


def test_predict_use_current_experiment():
    class TestModel(mlflow.pyfunc.PythonModel):
        @mlflow.trace
        def predict(self, context, model_input: list[str]):
            return model_input

    exp_id = mlflow.set_experiment("test_experiment").experiment_id
    client = mlflow.MlflowClient()
    with mlflow.start_run():
        model_info = mlflow.pyfunc.log_model(
            name="model",
            python_model=TestModel(),
        )

    assert len(client.search_traces(experiment_ids=[exp_id])) == 0
    mlflow.models.predict(
        model_uri=model_info.model_uri,
        input_data=["a", "b", "c"],
        env_manager=VIRTUALENV,
    )
    traces = client.search_traces(experiment_ids=[exp_id])
    assert len(traces) == 1
    assert json.loads(traces[0].data.request)["model_input"] == ["a", "b", "c"]


def test_predict_traces_link_to_active_model():
    model = mlflow.set_active_model(name="test_model")

    class TestModel(mlflow.pyfunc.PythonModel):
        @mlflow.trace
        def predict(self, context, model_input: list[str]):
            return model_input

    with mlflow.start_run():
        model_info = mlflow.pyfunc.log_model(
            name="model",
            python_model=TestModel(),
        )

    traces = get_traces()
    assert len(traces) == 0

    mlflow.models.predict(
        model_uri=model_info.model_uri,
        input_data=["a", "b", "c"],
        env_manager=VIRTUALENV,
    )
    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.request_metadata[TraceMetadataKey.MODEL_ID] == model.model_id
```

--------------------------------------------------------------------------------

````
