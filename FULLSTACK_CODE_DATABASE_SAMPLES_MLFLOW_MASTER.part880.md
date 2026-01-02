---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 880
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 880 of 991)

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

---[FILE: test_model_export_with_loader_module_and_data_path.py]---
Location: mlflow-master/tests/pyfunc/test_model_export_with_loader_module_and_data_path.py

```python
import os
import pickle
import types

import cloudpickle
import numpy as np
import pytest
import sklearn.datasets
import sklearn.linear_model
import sklearn.neighbors
import yaml

import mlflow
import mlflow.pyfunc
import mlflow.pyfunc.model
import mlflow.sklearn
from mlflow.exceptions import MlflowException
from mlflow.models import Model, infer_signature
from mlflow.models.utils import _read_example
from mlflow.tracking.artifact_utils import _download_artifact_from_uri
from mlflow.utils.environment import _mlflow_conda_env
from mlflow.utils.file_utils import TempDir
from mlflow.utils.model_utils import _get_flavor_configuration

from tests.helper_functions import _assert_pip_requirements


def _load_pyfunc(path):
    with open(path, "rb") as f:
        return pickle.load(f, encoding="latin1")


@pytest.fixture
def pyfunc_custom_env_file(tmp_path):
    conda_env = os.path.join(tmp_path, "conda_env.yml")
    _mlflow_conda_env(
        conda_env,
        additional_pip_deps=[
            "scikit-learn",
            "pytest",
            "cloudpickle",
            "-e " + os.path.dirname(mlflow.__path__[0]),
        ],
    )
    return conda_env


@pytest.fixture
def pyfunc_custom_env_dict():
    return _mlflow_conda_env(
        additional_pip_deps=[
            "scikit-learn",
            "pytest",
            "cloudpickle",
            "-e " + os.path.dirname(mlflow.__path__[0]),
        ],
    )


@pytest.fixture(scope="module")
def iris_data():
    iris = sklearn.datasets.load_iris()
    x = iris.data[:, :2]
    y = iris.target
    return x, y


@pytest.fixture(scope="module")
def sklearn_knn_model(iris_data):
    x, y = iris_data
    knn_model = sklearn.neighbors.KNeighborsClassifier()
    knn_model.fit(x, y)
    return knn_model


@pytest.fixture
def model_path(tmp_path):
    return os.path.join(tmp_path, "model")


def test_model_save_load(sklearn_knn_model, iris_data, tmp_path, model_path):
    sk_model_path = os.path.join(tmp_path, "knn.pkl")
    with open(sk_model_path, "wb") as f:
        pickle.dump(sklearn_knn_model, f)

    model_config = Model(run_id="test", artifact_path="testtest")
    mlflow.pyfunc.save_model(
        path=model_path,
        data_path=sk_model_path,
        loader_module=__name__,
        code_paths=[__file__],
        mlflow_model=model_config,
    )

    reloaded_model_config = Model.load(os.path.join(model_path, "MLmodel"))
    assert model_config.__dict__ == reloaded_model_config.__dict__
    assert mlflow.pyfunc.FLAVOR_NAME in reloaded_model_config.flavors
    assert mlflow.pyfunc.PY_VERSION in reloaded_model_config.flavors[mlflow.pyfunc.FLAVOR_NAME]
    reloaded_model = mlflow.pyfunc.load_model(model_path)
    np.testing.assert_array_equal(
        sklearn_knn_model.predict(iris_data[0]), reloaded_model.predict(iris_data[0])
    )


def test_signature_and_examples_are_saved_correctly(sklearn_knn_model, iris_data):
    data = iris_data
    signature_ = infer_signature(*data)
    example_ = data[0][:3]
    for signature in (None, signature_):
        for example in (None, example_):
            with TempDir() as tmp:
                with open(tmp.path("skmodel"), "wb") as f:
                    pickle.dump(sklearn_knn_model, f)
                path = tmp.path("model")
                mlflow.pyfunc.save_model(
                    path=path,
                    data_path=tmp.path("skmodel"),
                    loader_module=__name__,
                    code_paths=[__file__],
                    signature=signature,
                    input_example=example,
                )
                mlflow_model = Model.load(path)
                assert signature == mlflow_model.signature
                if example is None:
                    assert mlflow_model.saved_input_example_info is None
                else:
                    np.testing.assert_array_equal(_read_example(mlflow_model, path), example)


def test_model_log_load(sklearn_knn_model, iris_data, tmp_path):
    sk_model_path = os.path.join(tmp_path, "knn.pkl")
    with open(sk_model_path, "wb") as f:
        pickle.dump(sklearn_knn_model, f)

    pyfunc_artifact_path = "pyfunc_model"
    with mlflow.start_run():
        mlflow.pyfunc.log_model(
            name=pyfunc_artifact_path,
            data_path=sk_model_path,
            loader_module=__name__,
            code_paths=[__file__],
        )
        pyfunc_model_path = _download_artifact_from_uri(
            f"runs:/{mlflow.active_run().info.run_id}/{pyfunc_artifact_path}"
        )

    model_config = Model.load(os.path.join(pyfunc_model_path, "MLmodel"))
    assert mlflow.pyfunc.FLAVOR_NAME in model_config.flavors
    assert mlflow.pyfunc.PY_VERSION in model_config.flavors[mlflow.pyfunc.FLAVOR_NAME]
    reloaded_model = mlflow.pyfunc.load_model(pyfunc_model_path)
    assert model_config.to_yaml() == reloaded_model.metadata.to_yaml()
    np.testing.assert_array_equal(
        sklearn_knn_model.predict(iris_data[0]), reloaded_model.predict(iris_data[0])
    )


@pytest.mark.skip(
    reason="In MLflow 3.0, `log_model` does not start a run. Consider removing this test."
)
def test_model_log_load_no_active_run(sklearn_knn_model, iris_data, tmp_path):
    sk_model_path = os.path.join(tmp_path, "knn.pkl")
    with open(sk_model_path, "wb") as f:
        pickle.dump(sklearn_knn_model, f)

    pyfunc_artifact_path = "pyfunc_model"
    assert mlflow.active_run() is None
    mlflow.pyfunc.log_model(
        name=pyfunc_artifact_path,
        data_path=sk_model_path,
        loader_module=__name__,
        code_paths=[__file__],
    )
    pyfunc_model_path = _download_artifact_from_uri(
        f"runs:/{mlflow.active_run().info.run_id}/{pyfunc_artifact_path}"
    )

    model_config = Model.load(os.path.join(pyfunc_model_path, "MLmodel"))
    assert mlflow.pyfunc.FLAVOR_NAME in model_config.flavors
    assert mlflow.pyfunc.PY_VERSION in model_config.flavors[mlflow.pyfunc.FLAVOR_NAME]
    reloaded_model = mlflow.pyfunc.load_model(pyfunc_model_path)
    np.testing.assert_array_equal(
        sklearn_knn_model.predict(iris_data[0]), reloaded_model.predict(iris_data[0])
    )
    mlflow.end_run()


def test_save_model_with_unsupported_argument_combinations_throws_exception(model_path):
    with pytest.raises(
        MlflowException, match="Either `loader_module` or `python_model` must be specified"
    ):
        mlflow.pyfunc.save_model(path=model_path, data_path="/path/to/data")


def test_log_model_with_unsupported_argument_combinations_throws_exception():
    with (
        mlflow.start_run(),
        pytest.raises(
            MlflowException, match="Either `loader_module` or `python_model` must be specified"
        ),
    ):
        mlflow.pyfunc.log_model(name="pyfunc_model", data_path="/path/to/data")


def test_log_model_persists_specified_conda_env_file_in_mlflow_model_directory(
    sklearn_knn_model, tmp_path, pyfunc_custom_env_file
):
    sk_model_path = os.path.join(tmp_path, "knn.pkl")
    with open(sk_model_path, "wb") as f:
        pickle.dump(sklearn_knn_model, f)

    pyfunc_artifact_path = "pyfunc_model"
    with mlflow.start_run():
        mlflow.pyfunc.log_model(
            name=pyfunc_artifact_path,
            data_path=sk_model_path,
            loader_module=__name__,
            code_paths=[__file__],
            conda_env=pyfunc_custom_env_file,
        )
        run_id = mlflow.active_run().info.run_id

    pyfunc_model_path = _download_artifact_from_uri(f"runs:/{run_id}/{pyfunc_artifact_path}")

    pyfunc_conf = _get_flavor_configuration(
        model_path=pyfunc_model_path, flavor_name=mlflow.pyfunc.FLAVOR_NAME
    )
    saved_conda_env_path = os.path.join(pyfunc_model_path, pyfunc_conf[mlflow.pyfunc.ENV]["conda"])
    assert os.path.exists(saved_conda_env_path)
    assert saved_conda_env_path != pyfunc_custom_env_file

    with open(pyfunc_custom_env_file) as f:
        pyfunc_custom_env_parsed = yaml.safe_load(f)
    with open(saved_conda_env_path) as f:
        saved_conda_env_parsed = yaml.safe_load(f)
    assert saved_conda_env_parsed == pyfunc_custom_env_parsed


def test_log_model_persists_specified_conda_env_dict_in_mlflow_model_directory(
    sklearn_knn_model, tmp_path, pyfunc_custom_env_dict
):
    sk_model_path = os.path.join(tmp_path, "knn.pkl")
    with open(sk_model_path, "wb") as f:
        pickle.dump(sklearn_knn_model, f)

    pyfunc_artifact_path = "pyfunc_model"
    with mlflow.start_run():
        mlflow.pyfunc.log_model(
            name=pyfunc_artifact_path,
            data_path=sk_model_path,
            loader_module=__name__,
            code_paths=[__file__],
            conda_env=pyfunc_custom_env_dict,
        )
        run_id = mlflow.active_run().info.run_id

    pyfunc_model_path = _download_artifact_from_uri(f"runs:/{run_id}/{pyfunc_artifact_path}")

    pyfunc_conf = _get_flavor_configuration(
        model_path=pyfunc_model_path, flavor_name=mlflow.pyfunc.FLAVOR_NAME
    )
    saved_conda_env_path = os.path.join(pyfunc_model_path, pyfunc_conf[mlflow.pyfunc.ENV]["conda"])
    assert os.path.exists(saved_conda_env_path)

    with open(saved_conda_env_path) as f:
        saved_conda_env_parsed = yaml.safe_load(f)
    assert saved_conda_env_parsed == pyfunc_custom_env_dict


def test_log_model_persists_requirements_in_mlflow_model_directory(
    sklearn_knn_model, tmp_path, pyfunc_custom_env_dict
):
    sk_model_path = os.path.join(tmp_path, "knn.pkl")
    with open(sk_model_path, "wb") as f:
        pickle.dump(sklearn_knn_model, f)

    pyfunc_artifact_path = "pyfunc_model"
    with mlflow.start_run():
        mlflow.pyfunc.log_model(
            name=pyfunc_artifact_path,
            data_path=sk_model_path,
            loader_module=__name__,
            code_paths=[__file__],
            conda_env=pyfunc_custom_env_dict,
        )
        run_id = mlflow.active_run().info.run_id

    pyfunc_model_path = _download_artifact_from_uri(f"runs:/{run_id}/{pyfunc_artifact_path}")

    saved_pip_req_path = os.path.join(pyfunc_model_path, "requirements.txt")
    assert os.path.exists(saved_pip_req_path)

    with open(saved_pip_req_path) as f:
        requirements = f.read().split("\n")

    assert pyfunc_custom_env_dict["dependencies"][-1]["pip"] == requirements


def test_log_model_without_specified_conda_env_uses_default_env_with_expected_dependencies(
    sklearn_knn_model, tmp_path
):
    sk_model_path = os.path.join(tmp_path, "knn.pkl")
    with open(sk_model_path, "wb") as f:
        pickle.dump(sklearn_knn_model, f)

    pyfunc_artifact_path = "pyfunc_model"
    with mlflow.start_run():
        model_info = mlflow.pyfunc.log_model(
            name=pyfunc_artifact_path,
            data_path=sk_model_path,
            loader_module=__name__,
            code_paths=[__file__],
        )
    _assert_pip_requirements(model_info.model_uri, mlflow.pyfunc.get_default_pip_requirements())


def test_streamable_model_save_load(tmp_path, model_path):
    class StreamableModel:
        def __init__(self):
            pass

        def predict(self, model_input, params=None):
            pass

        def predict_stream(self, model_input, params=None):
            yield "test1"
            yield "test2"

    custom_model = StreamableModel()

    custom_model_path = os.path.join(tmp_path, "model.pkl")
    with open(custom_model_path, "wb") as f:
        cloudpickle.dump(custom_model, f)

    model_config = Model(run_id="test", artifact_path="testtest")
    mlflow.pyfunc.save_model(
        path=model_path,
        data_path=custom_model_path,
        loader_module=__name__,
        code_paths=[__file__],
        mlflow_model=model_config,
        streamable=True,
    )
    loaded_pyfunc_model = mlflow.pyfunc.load_model(model_uri=model_path)

    stream_result = loaded_pyfunc_model.predict_stream("single-input")
    assert isinstance(stream_result, types.GeneratorType)

    assert list(stream_result) == ["test1", "test2"]
```

--------------------------------------------------------------------------------

---[FILE: test_pyfunc_class_methods.py]---
Location: mlflow-master/tests/pyfunc/test_pyfunc_class_methods.py

```python
import mlflow
from mlflow.pyfunc import PythonModel, load_model, log_model


def test_unwrap_python_model_from_pyfunc_class():
    class MyModel(PythonModel):
        def __init__(self, param_1: str, param_2: int):
            self.param_1 = param_1
            self.param_2 = param_2

        def predict(self, context, model_input, params=None):
            return model_input + self.param_2

        def upper_param_1(self):
            return self.param_1.upper()

    with mlflow.start_run():
        model = MyModel("this is test message", 2)
        model_uri = log_model("mlruns", python_model=model).model_uri
        loaded_model = load_model(model_uri).unwrap_python_model()
        assert isinstance(loaded_model, MyModel)
        assert loaded_model.param_1 == "this is test message"
        assert loaded_model.param_2 == 2
        assert loaded_model.predict(None, 1) == 3
        assert loaded_model.upper_param_1() == "THIS IS TEST MESSAGE"
```

--------------------------------------------------------------------------------

---[FILE: test_pyfunc_exceptions.py]---
Location: mlflow-master/tests/pyfunc/test_pyfunc_exceptions.py

```python
import pytest

import mlflow
from mlflow.exceptions import MlflowException


class UnpicklableModel(mlflow.pyfunc.PythonModel):
    def __init__(self, path):
        with open(path, "w+") as f:
            pass

        self.not_a_file = f


def test_pyfunc_unpicklable_exception(tmp_path):
    model = UnpicklableModel(tmp_path / "model.pkl")

    with pytest.raises(
        MlflowException,
        match="Please save the model into a python file and use code-based logging method instead",
    ):
        mlflow.pyfunc.save_model(python_model=model, path=tmp_path / "model")
```

--------------------------------------------------------------------------------

---[FILE: test_pyfunc_input_converter.py]---
Location: mlflow-master/tests/pyfunc/test_pyfunc_input_converter.py

```python
from dataclasses import asdict, dataclass
from typing import Optional

import pandas as pd
import pytest

from mlflow.models.rag_signatures import ChatCompletionRequest
from mlflow.pyfunc.utils.input_converter import _hydrate_dataclass


def test_hydrate_dataclass_input_no_dataclass():
    # Define a class that is not a dataclass
    class NotADataclass:
        pass

    # Create some dummy data as a pandas df
    data = {"a": 1, "b": 2}
    df = pd.DataFrame(data, index=[0])

    # Check that an error is raised when trying to hydrate the dataclass
    with pytest.raises(ValueError, match="NotADataclass is not a dataclass"):
        _hydrate_dataclass(NotADataclass, df.iloc[0])


def test_hydrate_dataclass_simple():
    # Define a dataclass
    @dataclass
    class MyDataclass:
        a: int
        b: int

    # Create some dummy data as a pandas df
    df = pd.DataFrame({"a": [1], "b": [2]})

    # Check that the dataclass is hydrated
    result = _hydrate_dataclass(MyDataclass, df.iloc[0])
    assert result == MyDataclass(a=1, b=2)


def test_hydrate_dataclass_complex():
    # Define a more complex dataclass
    @dataclass
    class MyDataclass:
        a: int
        b: int

    @dataclass
    class MyListDataclass:
        c: list[MyDataclass]

    # Create some dummy data as a pandas df
    df = pd.DataFrame({"c": [[{"a": 1, "b": 2}, {"a": 3, "b": 4}]]})

    # Check that the dataclass is hydrated
    result = _hydrate_dataclass(MyListDataclass, df.iloc[0])
    assert result == MyListDataclass(c=[MyDataclass(a=1, b=2), MyDataclass(a=3, b=4)])


@dataclass
class CustomInput:
    id: int = 0


@dataclass
class FlexibleChatCompletionRequest(ChatCompletionRequest):
    custom_input: Optional[CustomInput] = None  # noqa: UP045
    another_custom_input: CustomInput | None = None


def test_hydrate_child_dataclass():
    result = _hydrate_dataclass(
        FlexibleChatCompletionRequest,
        asdict(
            FlexibleChatCompletionRequest(
                custom_input=CustomInput(), another_custom_input=CustomInput()
            )
        ),
    )
    assert result == FlexibleChatCompletionRequest(
        custom_input=CustomInput(), another_custom_input=CustomInput()
    )


def test_hydrate_optional_dataclass():
    result = _hydrate_dataclass(
        FlexibleChatCompletionRequest,
        asdict(FlexibleChatCompletionRequest(custom_input=None, another_custom_input=None)),
    )
    assert result == FlexibleChatCompletionRequest(custom_input=None, another_custom_input=None)
```

--------------------------------------------------------------------------------

---[FILE: test_pyfunc_model_config.py]---
Location: mlflow-master/tests/pyfunc/test_pyfunc_model_config.py

```python
import os

import pytest
import yaml

import mlflow
from mlflow.models import Model


@pytest.fixture
def model_path(tmp_path):
    return os.path.join(tmp_path, "model")


@pytest.fixture
def model_config():
    return {
        "use_gpu": True,
        "temperature": 0.9,
        "timeout": 300,
    }


def _load_pyfunc(path):
    return TestModel()


class TestModel(mlflow.pyfunc.PythonModel):
    def predict(self, context, model_input, params=None):
        return model_input


class InferenceContextModel(mlflow.pyfunc.PythonModel):
    def predict(self, context, model_input, params=None):
        # This mock class returns the internal inference configuration keys and values available
        return context.model_config.items()


def test_save_with_model_config(model_path, model_config):
    model = InferenceContextModel()
    mlflow.pyfunc.save_model(model_path, python_model=model, model_config=model_config)

    loaded_model = mlflow.pyfunc.load_model(model_uri=model_path)

    assert loaded_model.model_config
    assert set(model_config.keys()) == set(loaded_model.model_config)
    assert all(loaded_model.model_config[k] == v for k, v in model_config.items())
    assert all(loaded_model.model_config[k] == v for k, v in loaded_model.predict([[0]]))


@pytest.mark.parametrize(
    "model_config_path",
    [
        os.path.abspath("tests/pyfunc/sample_code/config.yml"),
        "tests/pyfunc/../pyfunc/sample_code/config.yml",
    ],
)
def test_save_with_model_config_path(model_path, model_config, model_config_path):
    model = InferenceContextModel()
    mlflow.pyfunc.save_model(model_path, python_model=model, model_config=model_config_path)

    loaded_model = mlflow.pyfunc.load_model(model_uri=model_path)

    assert loaded_model.model_config
    assert set(model_config.keys()) == set(loaded_model.model_config)
    assert all(loaded_model.model_config[k] == v for k, v in model_config.items())
    assert all(loaded_model.model_config[k] == v for k, v in loaded_model.predict([[0]]))


def test_override_model_config(model_path, model_config):
    model = TestModel()
    inference_override = {"timeout": 400}

    mlflow.pyfunc.save_model(model_path, python_model=model, model_config=model_config)
    loaded_model = mlflow.pyfunc.load_model(model_uri=model_path, model_config=inference_override)

    assert loaded_model.model_config["timeout"] == 400
    assert all(loaded_model.model_config[k] == v for k, v in inference_override.items())


@pytest.mark.parametrize(
    "model_config_path",
    [
        os.path.abspath("tests/pyfunc/sample_code/config.yml"),
        "tests/pyfunc/../pyfunc/sample_code/config.yml",
    ],
)
def test_override_model_config_path(tmp_path, model_path, model_config_path):
    model = TestModel()
    inference_override = {"timeout": 400}
    config_path = tmp_path / "config.yml"
    config_path.write_text(yaml.dump(inference_override))

    mlflow.pyfunc.save_model(model_path, python_model=model, model_config=model_config_path)
    loaded_model = mlflow.pyfunc.load_model(model_uri=model_path, model_config=str(config_path))

    assert loaded_model.model_config["timeout"] == 400
    assert all(loaded_model.model_config[k] == v for k, v in inference_override.items())


def test_override_model_config_ignore_invalid(model_path, model_config):
    model = TestModel()
    inference_override = {"invalid_key": 400}

    mlflow.pyfunc.save_model(model_path, python_model=model, model_config=model_config)
    loaded_model = mlflow.pyfunc.load_model(model_uri=model_path, model_config=inference_override)

    assert loaded_model.predict([[5]])
    assert all(k not in loaded_model.model_config for k in inference_override.keys())


@pytest.mark.parametrize(
    "model_config_path",
    [
        os.path.abspath("tests/pyfunc/sample_code/config.yml"),
        "tests/pyfunc/../pyfunc/sample_code/config.yml",
    ],
)
def test_override_model_config_path_ignore_invalid(tmp_path, model_path, model_config_path):
    model = TestModel()
    inference_override = {"invalid_key": 400}
    config_path = tmp_path / "config.yml"
    config_path.write_text(yaml.dump(inference_override))

    mlflow.pyfunc.save_model(model_path, python_model=model, model_config=model_config_path)
    loaded_model = mlflow.pyfunc.load_model(model_uri=model_path, model_config=str(config_path))

    assert loaded_model.predict([[5]])
    assert all(k not in loaded_model.model_config for k in inference_override.keys())


def test_pyfunc_without_model_config(model_path, model_config):
    model = TestModel()
    mlflow.pyfunc.save_model(model_path, python_model=model)

    loaded_model = mlflow.pyfunc.load_model(model_uri=model_path, model_config=model_config)

    assert loaded_model.predict([[5]])
    assert not loaded_model.model_config


def test_pyfunc_loader_without_model_config(model_path):
    mlflow.pyfunc.save_model(
        path=model_path,
        data_path=".",
        loader_module=__name__,
        code_paths=[__file__],
        mlflow_model=Model(run_id="test", artifact_path="testtest"),
    )

    inference_override = {"invalid_key": 400}
    pyfunc_model = mlflow.pyfunc.load_model(model_path, model_config=inference_override)

    assert not pyfunc_model.model_config
```

--------------------------------------------------------------------------------

````
