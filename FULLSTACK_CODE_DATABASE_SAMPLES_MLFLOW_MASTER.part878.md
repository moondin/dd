---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 878
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 878 of 991)

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

---[FILE: test_inferred_code_path.py]---
Location: mlflow-master/tests/pyfunc/test_inferred_code_path.py

```python
import os
import pickle

import numpy as np
import pytest
import sklearn.datasets
import sklearn.neighbors

import mlflow
from mlflow.models import Model


@pytest.fixture
def model_path(tmp_path):
    return tmp_path / "model"


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


def _walk_dir(path):
    return {
        str(p.relative_to(path))
        for p in path.rglob("*")
        if p.is_file() and p.parent.name != "__pycache__"
    }


def test_loader_module_model_save_load(
    sklearn_knn_model, iris_data, tmp_path, model_path, monkeypatch
):
    monkeypatch.chdir(os.path.dirname(__file__))
    monkeypatch.syspath_prepend(".")
    sk_model_path = tmp_path / "knn.pkl"
    with open(sk_model_path, "wb") as f:
        pickle.dump(sklearn_knn_model, f)

    model_config = Model(run_id="test", artifact_path="testtest")
    mlflow.pyfunc.save_model(
        path=model_path,
        data_path=sk_model_path,
        loader_module="custom_model.loader",
        mlflow_model=model_config,
        infer_code_paths=True,
    )

    reloaded_model_config = Model.load(model_path / "MLmodel")

    assert _walk_dir(model_path / "code") == {
        "custom_model/loader.py",
        "custom_model/mod1/__init__.py",
        "custom_model/mod1/mod2/__init__.py",
        "custom_model/mod1/mod4.py",
    }
    assert model_config.__dict__ == reloaded_model_config.__dict__
    assert mlflow.pyfunc.FLAVOR_NAME in reloaded_model_config.flavors
    assert mlflow.pyfunc.PY_VERSION in reloaded_model_config.flavors[mlflow.pyfunc.FLAVOR_NAME]
    reloaded_model = mlflow.pyfunc.load_model(model_path)
    np.testing.assert_array_equal(
        sklearn_knn_model.predict(iris_data[0]), reloaded_model.predict(iris_data[0])
    )


def get_model_class():
    """
    Defines a custom Python model class that wraps a scikit-learn estimator.
    This can be invoked within a pytest fixture to define the class in the ``__main__`` scope.
    Alternatively, it can be invoked within a module to define the class in the module's scope.
    """
    from custom_model.mod1 import mod2

    class CustomSklearnModel(mlflow.pyfunc.PythonModel):
        def __init__(self):
            self.mod2 = mod2

        def predict(self, context, model_input, params=None):
            return [x + 10 for x in model_input]

    return CustomSklearnModel


def test_python_model_save_load(tmp_path, monkeypatch):
    monkeypatch.chdir(os.path.dirname(__file__))
    monkeypatch.syspath_prepend(".")

    model_class = get_model_class()

    pyfunc_model_path = tmp_path / "pyfunc_model"

    mlflow.pyfunc.save_model(
        path=pyfunc_model_path,
        python_model=model_class(),
        infer_code_paths=True,
    )

    assert _walk_dir(pyfunc_model_path / "code") == {
        "custom_model/mod1/__init__.py",
        "custom_model/mod1/mod2/__init__.py",
        "custom_model/mod1/mod4.py",
    }
    loaded_pyfunc_model = mlflow.pyfunc.load_model(model_uri=pyfunc_model_path)
    np.testing.assert_array_equal(
        loaded_pyfunc_model.predict([1, 2, 3]),
        [11, 12, 13],
    )
```

--------------------------------------------------------------------------------

---[FILE: test_logged_models.py]---
Location: mlflow-master/tests/pyfunc/test_logged_models.py

```python
import json
import os
from concurrent.futures import ThreadPoolExecutor

import pytest

import mlflow
from mlflow.entities.logged_model_status import LoggedModelStatus
from mlflow.exceptions import MlflowException
from mlflow.models import Model
from mlflow.tracing.constant import TraceMetadataKey
from mlflow.utils.mlflow_tags import MLFLOW_MODEL_IS_EXTERNAL


class DummyModel(mlflow.pyfunc.PythonModel):
    def predict(self, model_input):
        return len(model_input) * [0]


class TraceModel(mlflow.pyfunc.PythonModel):
    @mlflow.trace
    def predict(self, model_input):
        return len(model_input) * [0]


def test_model_id_tracking():
    model = TraceModel()
    model.predict([1, 2, 3])
    trace = mlflow.get_trace(mlflow.get_last_active_trace_id())
    assert TraceMetadataKey.MODEL_ID not in trace.info.request_metadata

    with mlflow.start_run():
        info = mlflow.pyfunc.log_model(name="my_model", python_model=model)
        # Log another model to ensure that the model ID is correctly associated with the first model
        mlflow.pyfunc.log_model(name="another_model", python_model=model)

    model = mlflow.pyfunc.load_model(info.model_uri)
    model.predict([4, 5, 6])

    trace = mlflow.get_trace(mlflow.get_last_active_trace_id())
    assert trace is not None
    assert trace.info.request_metadata[TraceMetadataKey.MODEL_ID] == info.model_id


def test_model_id_tracking_evaluate():
    with mlflow.start_run():
        info = mlflow.pyfunc.log_model(name="my_model", python_model=TraceModel())

    mlflow.evaluate(model=info.model_uri, data=[[1, 2, 3]], model_type="regressor", targets=[1])
    trace = mlflow.get_trace(mlflow.get_last_active_trace_id())
    assert trace is not None
    assert trace.info.request_metadata[TraceMetadataKey.MODEL_ID] == info.model_id


def test_model_id_tracking_thread_safety():
    models = []
    for _ in range(5):
        with mlflow.start_run():
            info = mlflow.pyfunc.log_model(
                name="my_model",
                python_model=TraceModel(),
                pip_requirements=[],  # to skip dependency inference
            )
            model = mlflow.pyfunc.load_model(info.model_uri)
            models.append(model)

    def predict(idx, model) -> None:
        model.predict([idx])

    with ThreadPoolExecutor(max_workers=len(models)) as executor:
        futures = [executor.submit(predict, idx, model) for idx, model in enumerate(models)]
        for f in futures:
            f.result()

    traces = mlflow.search_traces(return_type="list")
    assert len(traces) == len(models)
    for trace in traces:
        trace_inputs = trace.info.request_metadata["mlflow.traceInputs"]
        index = json.loads(trace_inputs)["model_input"][0]
        model_id = trace.info.request_metadata["mlflow.modelId"]
        assert model_id == models[index].model_id


def test_run_params_are_logged_to_model():
    with mlflow.start_run():
        mlflow.log_params({"a": 1})
        mlflow.pyfunc.log_model(name="my_model", python_model=DummyModel())

    model = mlflow.last_logged_model()
    assert model.params == {"a": "1"}


def test_run_metrics_are_logged_to_model():
    with mlflow.start_run():
        mlflow.log_metrics({"a": 1, "b": 2})
        mlflow.pyfunc.log_model(name="my_model", python_model=DummyModel())

    model = mlflow.last_logged_model()
    assert [(m.key, m.value) for m in model.metrics] == [("a", 1), ("b", 2)]


def test_log_model_finalizes_existing_pending_model():
    model = mlflow.initialize_logged_model(name="testmodel")
    assert model.status == LoggedModelStatus.PENDING
    mlflow.pyfunc.log_model(python_model=DummyModel(), model_id=model.model_id)
    updated_model = mlflow.get_logged_model(model.model_id)
    assert updated_model.status == LoggedModelStatus.READY


def test_log_model_permits_logging_to_ready_model(tmp_path):
    # Create a non-external model and finalize it to READY status
    model = mlflow.initialize_logged_model(name="testmodel")
    model = mlflow.finalize_logged_model(model.model_id, LoggedModelStatus.READY)
    assert model.status == LoggedModelStatus.READY
    assert model.tags.get(MLFLOW_MODEL_IS_EXTERNAL, "false").lower() == "false"

    # Verify we can log to the READY model
    mlflow.pyfunc.log_model(python_model=DummyModel(), model_id=model.model_id)

    # Verify the model can be loaded
    mlflow.pyfunc.load_model(f"models:/{model.model_id}")

    # Verify the model artifacts were updated
    dst_dir = os.path.join(tmp_path, "dst")
    mlflow.artifacts.download_artifacts(f"models:/{model.model_id}", dst_path=dst_dir)
    mlflow_model = Model.load(os.path.join(dst_dir, "MLmodel"))
    assert mlflow_model.flavors.get("python_function") is not None


def test_log_model_permits_logging_model_artifacts_to_external_models(tmp_path):
    model = mlflow.create_external_model(name="testmodel")
    assert model.status == LoggedModelStatus.READY
    assert model.tags.get(MLFLOW_MODEL_IS_EXTERNAL) == "true"
    dst_dir_1 = os.path.join(tmp_path, "dst_1")
    mlflow.artifacts.download_artifacts(f"models:/{model.model_id}", dst_path=dst_dir_1)
    mlflow_model: Model = Model.load(os.path.join(dst_dir_1, "MLmodel"))

    model_info = mlflow.pyfunc.log_model(python_model=DummyModel(), model_id=model.model_id)

    # Verify that the model can now be loaded and is no longer tagged as external
    mlflow.pyfunc.load_model(model_info.model_uri)
    assert MLFLOW_MODEL_IS_EXTERNAL not in mlflow.get_logged_model(model.model_id).tags
    dst_dir_2 = os.path.join(tmp_path, "dst_2")
    mlflow.artifacts.download_artifacts(f"models:/{model.model_id}", dst_path=dst_dir_2)
    mlflow_model = Model.load(os.path.join(dst_dir_2, "MLmodel"))
    assert MLFLOW_MODEL_IS_EXTERNAL not in (mlflow_model.metadata or {})


def test_external_logged_model_cannot_be_loaded_with_pyfunc():
    model = mlflow.create_external_model(name="testmodel")
    with pytest.raises(
        MlflowException,
        match="This model's artifacts are external.*cannot be loaded",
    ):
        mlflow.pyfunc.load_model(f"models:/{model.model_id}")
```

--------------------------------------------------------------------------------

---[FILE: test_mlserver.py]---
Location: mlflow-master/tests/pyfunc/test_mlserver.py

```python
import os
from typing import Any

import pytest

from mlflow.pyfunc.mlserver import MLServerDefaultModelName, MLServerMLflowRuntime, get_cmd


@pytest.mark.parametrize(
    ("params", "expected"),
    [
        (
            {"port": 5000, "host": "0.0.0.0", "nworkers": 4},
            {
                "MLSERVER_HTTP_PORT": "5000",
                "MLSERVER_HOST": "0.0.0.0",
                "MLSERVER_PARALLEL_WORKERS": "4",
                "MLSERVER_MODEL_NAME": MLServerDefaultModelName,
            },
        ),
        (
            {"host": "0.0.0.0", "nworkers": 4},
            {
                "MLSERVER_HOST": "0.0.0.0",
                "MLSERVER_PARALLEL_WORKERS": "4",
                "MLSERVER_MODEL_NAME": MLServerDefaultModelName,
            },
        ),
        (
            {"port": 5000, "nworkers": 4},
            {
                "MLSERVER_HTTP_PORT": "5000",
                "MLSERVER_PARALLEL_WORKERS": "4",
                "MLSERVER_MODEL_NAME": MLServerDefaultModelName,
            },
        ),
        (
            {"port": 5000},
            {
                "MLSERVER_HTTP_PORT": "5000",
                "MLSERVER_MODEL_NAME": MLServerDefaultModelName,
            },
        ),
        (
            {"model_name": "mymodel", "model_version": "12"},
            {"MLSERVER_MODEL_NAME": "mymodel", "MLSERVER_MODEL_VERSION": "12"},
        ),
        ({}, {"MLSERVER_MODEL_NAME": MLServerDefaultModelName}),
    ],
)
def test_get_cmd(params: dict[str, Any], expected: dict[str, Any]):
    model_uri = "/foo/bar"
    cmd, cmd_env = get_cmd(model_uri=model_uri, **params)

    assert cmd == f"mlserver start {model_uri}"

    assert cmd_env == {
        "MLSERVER_MODEL_URI": model_uri,
        "MLSERVER_MODEL_IMPLEMENTATION": MLServerMLflowRuntime,
        **expected,
        **os.environ.copy(),
    }
```

--------------------------------------------------------------------------------

````
