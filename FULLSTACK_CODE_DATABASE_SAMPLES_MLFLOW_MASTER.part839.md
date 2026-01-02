---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 839
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 839 of 991)

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

---[FILE: test_save.py]---
Location: mlflow-master/tests/keras/test_save.py

```python
import keras
import numpy as np
import pytest

import mlflow
from mlflow.keras.utils import get_model_signature
from mlflow.models import ModelSignature
from mlflow.types import Schema, TensorSpec


def _get_keras_model():
    return keras.Sequential(
        [
            keras.Input([28, 28, 3]),
            keras.layers.Flatten(),
            keras.layers.Dense(2),
        ]
    )


def test_keras_save_model_export():
    if keras.backend.backend() == "torch":
        pytest.skip("Keras model exporting is not supported in torch backend.")

    model = _get_keras_model()

    model.compile(
        loss=keras.losses.SparseCategoricalCrossentropy(from_logits=True),
        optimizer=keras.optimizers.Adam(0.002),
        metrics=[keras.metrics.SparseCategoricalAccuracy()],
    )

    model_path = "model"
    input_schema = Schema([TensorSpec(np.dtype(np.float32), (-1, 28, 28, 3))])
    signature = ModelSignature(inputs=input_schema)
    with mlflow.start_run():
        model_info = mlflow.keras.log_model(
            model,
            name=model_path,
            save_exported_model=True,
            signature=signature,
        )

    loaded_model = mlflow.keras.load_model(model_info.model_uri)

    # Test the loaded model produces the same output for the same input as the model.
    test_input = np.random.uniform(size=[2, 28, 28, 3]).astype(np.float32)
    np.testing.assert_allclose(
        keras.ops.convert_to_numpy(model(test_input)),
        loaded_model.serve(test_input),
    )

    # Test the loaded pyfunc model produces the same output for the same input as the model.
    loaded_pyfunc_model = mlflow.pyfunc.load_model(model_info.model_uri)
    predict_outputs = loaded_pyfunc_model.predict(test_input)
    assert isinstance(predict_outputs, np.ndarray)
    np.testing.assert_allclose(
        keras.ops.convert_to_numpy(model(test_input)),
        predict_outputs,
    )


def test_keras_save_model_non_export():
    model = _get_keras_model()

    model.compile(
        loss=keras.losses.SparseCategoricalCrossentropy(from_logits=True),
        optimizer=keras.optimizers.Adam(0.002),
        metrics=[keras.metrics.SparseCategoricalAccuracy()],
    )

    with mlflow.start_run():
        model_info = mlflow.keras.log_model(model, name="model", save_exported_model=False)

    loaded_model = mlflow.keras.load_model(model_info.model_uri)

    # Test the loaded model produces the same output for the same input as the model.
    test_input = np.random.uniform(size=[2, 28, 28, 3])
    np.testing.assert_allclose(
        keras.ops.convert_to_numpy(model(test_input)),
        loaded_model.predict(test_input),
    )

    assert loaded_model.optimizer.name == "adam"
    assert loaded_model.optimizer.learning_rate == model.optimizer.learning_rate

    # Test the loaded pyfunc model produces the same output for the same input as the model.
    loaded_pyfunc_model = mlflow.pyfunc.load_model(model_info.model_uri)
    np.testing.assert_allclose(
        keras.ops.convert_to_numpy(model(test_input)),
        loaded_pyfunc_model.predict(test_input),
    )


def test_save_model_with_signature():
    keras.mixed_precision.set_dtype_policy("mixed_float16")

    model = _get_keras_model()
    signature = get_model_signature(model)
    assert signature.outputs.input_types()[0] == np.dtype("float16")
    model_path = "model"
    with mlflow.start_run():
        model_info = mlflow.keras.log_model(model, name=model_path, signature=signature)

    loaded_pyfunc_model = mlflow.pyfunc.load_model(model_info.model_uri)

    assert signature == loaded_pyfunc_model.metadata.signature

    # Test the loaded model produces the same output for the same input as the model.
    test_input = np.random.uniform(size=[2, 28, 28, 3]).astype(np.float32)
    np.testing.assert_allclose(
        keras.ops.convert_to_numpy(model(test_input)),
        loaded_pyfunc_model.predict(test_input),
    )

    # Clean up the global policy.
    keras.mixed_precision.set_dtype_policy("float32")
```

--------------------------------------------------------------------------------

---[FILE: conftest.py]---
Location: mlflow-master/tests/langchain/conftest.py
Signals: Pydantic

```python
import importlib
from unittest import mock

import openai
import pytest
from langchain.embeddings.base import Embeddings
from pydantic import BaseModel

from tests.helper_functions import start_mock_openai_server
from tests.tracing.helper import reset_autolog_state  # noqa: F401


@pytest.fixture(autouse=True)
def set_envs(monkeypatch, mock_openai):
    monkeypatch.setenv("OPENAI_API_KEY", "test")
    monkeypatch.setenv("OPENAI_API_BASE", mock_openai)
    monkeypatch.setenv("SERPAPI_API_KEY", "test")
    importlib.reload(openai)


@pytest.fixture(scope="module", autouse=True)
def mock_openai():
    with start_mock_openai_server() as base_url:
        yield base_url


@pytest.fixture(autouse=True)
def reset_autolog(reset_autolog_state):
    # Apply the reset_autolog_state fixture to all tests for LangChain
    return


@pytest.fixture(autouse=True)
def mock_init_auth():
    def mocked_init_auth(config_instance):
        config_instance.host = "https://databricks.com/"
        config_instance._header_factory = lambda: {}

    with mock.patch("databricks.sdk.config.Config.init_auth", new=mocked_init_auth):
        yield


# Define a special embedding for testing
class DeterministicDummyEmbeddings(Embeddings, BaseModel):
    size: int

    def _get_embedding(self, text: str) -> list[float]:
        import numpy as np

        seed = abs(hash(text)) % (10**8)
        np.random.seed(seed)
        return list(np.random.normal(size=self.size))

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        return [self._get_embedding(t) for t in texts]

    def embed_query(self, text: str) -> list[float]:
        return self._get_embedding(text)
```

--------------------------------------------------------------------------------

````
