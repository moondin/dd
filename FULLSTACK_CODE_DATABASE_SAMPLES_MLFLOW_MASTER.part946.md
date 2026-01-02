---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 946
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 946 of 991)

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
Location: mlflow-master/tests/telemetry/test_utils.py

```python
from unittest.mock import Mock, patch

from mlflow.telemetry.constant import (
    CONFIG_STAGING_URL,
    CONFIG_URL,
    FALLBACK_UI_CONFIG,
    UI_CONFIG_STAGING_URL,
    UI_CONFIG_URL,
)
from mlflow.telemetry.utils import (
    _get_config_url,
    fetch_ui_telemetry_config,
    is_telemetry_disabled,
)


def test_is_telemetry_disabled(monkeypatch, bypass_env_check):
    assert is_telemetry_disabled() is False

    with monkeypatch.context() as m:
        m.setenv("MLFLOW_DISABLE_TELEMETRY", "true")
        assert is_telemetry_disabled() is True

    assert is_telemetry_disabled() is False

    with monkeypatch.context() as m:
        m.setenv("DO_NOT_TRACK", "true")
        assert is_telemetry_disabled() is True


def test_get_config_url(bypass_env_check):
    assert _get_config_url("1.0.0") == f"{CONFIG_URL}/1.0.0.json"
    assert _get_config_url("1.0.0.rc0") == f"{CONFIG_URL}/1.0.0.rc0.json"
    assert _get_config_url("1.0.0.dev0") == f"{CONFIG_STAGING_URL}/1.0.0.dev0.json"
    assert _get_config_url("1.0.0+abc") is None
    assert _get_config_url("1.0.0", is_ui=True) == f"{UI_CONFIG_URL}/1.0.0.json"
    assert _get_config_url("1.0.0.rc0", is_ui=True) == f"{UI_CONFIG_URL}/1.0.0.rc0.json"
    assert _get_config_url("1.0.0.dev0", is_ui=True) == f"{UI_CONFIG_STAGING_URL}/1.0.0.dev0.json"
    assert _get_config_url("1.0.0+abc", is_ui=True) is None


def test_fetch_ui_telemetry_config_fetch_success(bypass_env_check):
    mock_config = {
        "mlflow_version": "3.7.1.dev0",
        "disable_telemetry": False,
        "rollout_percentage": 100,
        "ingestion_url": "https://api.mlflow-telemetry.io/staging/log",
        "disable_sdks": [],
        "disable_os": [],
        "disable_events": [],
        "disable_ui_telemetry": False,
        "disable_ui_events": ["test_event"],
        "ui_rollout_percentage": 100,
    }

    with patch("requests.get") as mock_get:
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = mock_config
        mock_get.return_value = mock_response

        result = fetch_ui_telemetry_config()

        assert result["disable_ui_telemetry"] is False
        assert result["disable_ui_events"] == ["test_event"]
        assert result["ui_rollout_percentage"] == 100


def test_fetch_ui_telemetry_config_fetch_error_fallback(bypass_env_check):
    with patch("requests.get") as mock_get:
        mock_response = Mock()
        mock_response.status_code = 404
        mock_get.return_value = mock_response

        result = fetch_ui_telemetry_config()

        assert result == FALLBACK_UI_CONFIG
        assert result["disable_ui_telemetry"] is True

    with patch("requests.get") as mock_get:
        mock_get.side_effect = Exception("Network error")

        result = fetch_ui_telemetry_config()

        assert result == FALLBACK_UI_CONFIG
        assert result["disable_ui_telemetry"] is True
        assert result["disable_ui_events"] == []
        assert result["ui_rollout_percentage"] == 0
```

--------------------------------------------------------------------------------

---[FILE: iris_data_utils.py]---
Location: mlflow-master/tests/tensorflow/iris_data_utils.py

```python
# From https://github.com/tensorflow/models/blob/master/samples/core/get_started/iris_data.py
# This file is the example used by TensorFlow to get users started. This code is used for testing.
import pandas as pd
import tensorflow as tf

TRAIN_URL = "http://download.tensorflow.org/data/iris_training.csv"
TEST_URL = "http://download.tensorflow.org/data/iris_test.csv"

CSV_COLUMN_NAMES = ["SepalLength", "SepalWidth", "PetalLength", "PetalWidth", "Species"]
SPECIES = ["Setosa", "Versicolor", "Virginica"]


def maybe_download():
    train_path = tf.keras.utils.get_file(TRAIN_URL.split("/")[-1], TRAIN_URL)
    test_path = tf.keras.utils.get_file(TEST_URL.split("/")[-1], TEST_URL)

    return train_path, test_path


def load_data(y_name="Species"):
    """Returns the iris dataset as (train_x, train_y), (test_x, test_y)."""
    train_path, test_path = maybe_download()

    train = pd.read_csv(train_path, names=CSV_COLUMN_NAMES, header=0)
    train_y = train.pop(y_name)
    train_x = train

    test = pd.read_csv(test_path, names=CSV_COLUMN_NAMES, header=0)
    test_y = test.pop(y_name)
    test_x = test

    return (train_x, train_y), (test_x, test_y)


def train_input_fn(features, labels, batch_size):
    """An input function for training"""
    # Convert the inputs to a Dataset.
    dataset = tf.data.Dataset.from_tensor_slices((dict(features), labels))

    # Shuffle, repeat, and batch the examples.
    return dataset.shuffle(1000).repeat().batch(batch_size)


def eval_input_fn(features, labels, batch_size):
    """An input function for evaluation or prediction"""
    features = dict(features)

    # Use only features when labels are null.
    inputs = features if labels is None else (features, labels)

    # Convert the inputs to a Dataset.
    dataset = tf.data.Dataset.from_tensor_slices(inputs)

    # Batch the examples
    assert batch_size is not None, "batch_size must not be None"
    return dataset.batch(batch_size)


# The remainder of this file contains a simple example of a csv parser,
#     implemented using the `Dataset` class.

# `tf.parse_csv` sets the types of the outputs to match the examples given in
#     the `record_defaults` argument.
CSV_TYPES = [[0.0], [0.0], [0.0], [0.0], [0]]


def _parse_line(line):
    # Decode the line into its fields
    fields = tf.decode_csv(line, record_defaults=CSV_TYPES)

    # Pack the result into a dictionary
    features = dict(zip(CSV_COLUMN_NAMES, fields))

    # Separate the label from the features
    label = features.pop("Species")

    return features, label


def csv_input_fn(csv_path, batch_size):
    # Create a dataset containing the text lines.
    dataset = tf.data.TextLineDataset(csv_path).skip(1)

    # Parse each line.
    dataset = dataset.map(_parse_line)

    # Shuffle, repeat, and batch the examples.
    return dataset.shuffle(1000).repeat().batch(batch_size)
```

--------------------------------------------------------------------------------

---[FILE: iris_test.csv]---
Location: mlflow-master/tests/tensorflow/iris_test.csv

```text
30,4,setosa,versicolor,virginica
5.9,3.0,4.2,1.5,1
6.9,3.1,5.4,2.1,2
5.1,3.3,1.7,0.5,0
6.0,3.4,4.5,1.6,1
5.5,2.5,4.0,1.3,1
6.2,2.9,4.3,1.3,1
5.5,4.2,1.4,0.2,0
6.3,2.8,5.1,1.5,2
5.6,3.0,4.1,1.3,1
6.7,2.5,5.8,1.8,2
7.1,3.0,5.9,2.1,2
4.3,3.0,1.1,0.1,0
5.6,2.8,4.9,2.0,2
5.5,2.3,4.0,1.3,1
6.0,2.2,4.0,1.0,1
5.1,3.5,1.4,0.2,0
5.7,2.6,3.5,1.0,1
4.8,3.4,1.9,0.2,0
5.1,3.4,1.5,0.2,0
5.7,2.5,5.0,2.0,2
5.4,3.4,1.7,0.2,0
5.6,3.0,4.5,1.5,1
6.3,2.9,5.6,1.8,2
6.3,2.5,4.9,1.5,1
5.8,2.7,3.9,1.2,1
6.1,3.0,4.6,1.4,1
5.2,4.1,1.5,0.1,0
6.7,3.1,4.7,1.5,1
6.7,3.3,5.7,2.5,2
6.4,2.9,4.3,1.3,1
```

--------------------------------------------------------------------------------

---[FILE: iris_training.csv]---
Location: mlflow-master/tests/tensorflow/iris_training.csv

```text
120,4,setosa,versicolor,virginica
6.4,2.8,5.6,2.2,2
5.0,2.3,3.3,1.0,1
4.9,2.5,4.5,1.7,2
4.9,3.1,1.5,0.1,0
5.7,3.8,1.7,0.3,0
4.4,3.2,1.3,0.2,0
5.4,3.4,1.5,0.4,0
6.9,3.1,5.1,2.3,2
6.7,3.1,4.4,1.4,1
5.1,3.7,1.5,0.4,0
5.2,2.7,3.9,1.4,1
6.9,3.1,4.9,1.5,1
5.8,4.0,1.2,0.2,0
5.4,3.9,1.7,0.4,0
7.7,3.8,6.7,2.2,2
6.3,3.3,4.7,1.6,1
6.8,3.2,5.9,2.3,2
7.6,3.0,6.6,2.1,2
6.4,3.2,5.3,2.3,2
5.7,4.4,1.5,0.4,0
6.7,3.3,5.7,2.1,2
6.4,2.8,5.6,2.1,2
5.4,3.9,1.3,0.4,0
6.1,2.6,5.6,1.4,2
7.2,3.0,5.8,1.6,2
5.2,3.5,1.5,0.2,0
5.8,2.6,4.0,1.2,1
5.9,3.0,5.1,1.8,2
5.4,3.0,4.5,1.5,1
6.7,3.0,5.0,1.7,1
6.3,2.3,4.4,1.3,1
5.1,2.5,3.0,1.1,1
6.4,3.2,4.5,1.5,1
6.8,3.0,5.5,2.1,2
6.2,2.8,4.8,1.8,2
6.9,3.2,5.7,2.3,2
6.5,3.2,5.1,2.0,2
5.8,2.8,5.1,2.4,2
5.1,3.8,1.5,0.3,0
4.8,3.0,1.4,0.3,0
7.9,3.8,6.4,2.0,2
5.8,2.7,5.1,1.9,2
6.7,3.0,5.2,2.3,2
5.1,3.8,1.9,0.4,0
4.7,3.2,1.6,0.2,0
6.0,2.2,5.0,1.5,2
4.8,3.4,1.6,0.2,0
7.7,2.6,6.9,2.3,2
4.6,3.6,1.0,0.2,0
7.2,3.2,6.0,1.8,2
5.0,3.3,1.4,0.2,0
6.6,3.0,4.4,1.4,1
6.1,2.8,4.0,1.3,1
5.0,3.2,1.2,0.2,0
7.0,3.2,4.7,1.4,1
6.0,3.0,4.8,1.8,2
7.4,2.8,6.1,1.9,2
5.8,2.7,5.1,1.9,2
6.2,3.4,5.4,2.3,2
5.0,2.0,3.5,1.0,1
5.6,2.5,3.9,1.1,1
6.7,3.1,5.6,2.4,2
6.3,2.5,5.0,1.9,2
6.4,3.1,5.5,1.8,2
6.2,2.2,4.5,1.5,1
7.3,2.9,6.3,1.8,2
4.4,3.0,1.3,0.2,0
7.2,3.6,6.1,2.5,2
6.5,3.0,5.5,1.8,2
5.0,3.4,1.5,0.2,0
4.7,3.2,1.3,0.2,0
6.6,2.9,4.6,1.3,1
5.5,3.5,1.3,0.2,0
7.7,3.0,6.1,2.3,2
6.1,3.0,4.9,1.8,2
4.9,3.1,1.5,0.1,0
5.5,2.4,3.8,1.1,1
5.7,2.9,4.2,1.3,1
6.0,2.9,4.5,1.5,1
6.4,2.7,5.3,1.9,2
5.4,3.7,1.5,0.2,0
6.1,2.9,4.7,1.4,1
6.5,2.8,4.6,1.5,1
5.6,2.7,4.2,1.3,1
6.3,3.4,5.6,2.4,2
4.9,3.1,1.5,0.1,0
6.8,2.8,4.8,1.4,1
5.7,2.8,4.5,1.3,1
6.0,2.7,5.1,1.6,1
5.0,3.5,1.3,0.3,0
6.5,3.0,5.2,2.0,2
6.1,2.8,4.7,1.2,1
5.1,3.5,1.4,0.3,0
4.6,3.1,1.5,0.2,0
6.5,3.0,5.8,2.2,2
4.6,3.4,1.4,0.3,0
4.6,3.2,1.4,0.2,0
7.7,2.8,6.7,2.0,2
5.9,3.2,4.8,1.8,1
5.1,3.8,1.6,0.2,0
4.9,3.0,1.4,0.2,0
4.9,2.4,3.3,1.0,1
4.5,2.3,1.3,0.3,0
5.8,2.7,4.1,1.0,1
5.0,3.4,1.6,0.4,0
5.2,3.4,1.4,0.2,0
5.3,3.7,1.5,0.2,0
5.0,3.6,1.4,0.2,0
5.6,2.9,3.6,1.3,1
4.8,3.1,1.6,0.2,0
6.3,2.7,4.9,1.8,2
5.7,2.8,4.1,1.3,1
5.0,3.0,1.6,0.2,0
6.3,3.3,6.0,2.5,2
5.0,3.5,1.6,0.6,0
5.5,2.6,4.4,1.2,1
5.7,3.0,4.2,1.2,1
4.4,2.9,1.4,0.2,0
4.8,3.0,1.4,0.1,0
5.5,2.4,3.7,1.0,1
```

--------------------------------------------------------------------------------

---[FILE: test_keras_model_export.py]---
Location: mlflow-master/tests/tensorflow/test_keras_model_export.py

```python
import os
import random
import shutil
from pathlib import Path
from unittest import mock

import numpy as np
import pandas as pd
import pytest
import tensorflow as tf
import yaml
from packaging.version import Version
from sklearn import datasets
from tensorflow.keras import backend as K
from tensorflow.keras.layers import Dense, Layer
from tensorflow.keras.models import Sequential
from tensorflow.keras.optimizers import SGD

import mlflow
import mlflow.pyfunc.scoring_server as pyfunc_scoring_server
from mlflow import pyfunc
from mlflow.deployments import PredictionsResponse
from mlflow.models import Model, ModelSignature
from mlflow.models.utils import _read_example, load_serving_example
from mlflow.store.artifact.s3_artifact_repo import S3ArtifactRepository
from mlflow.tracking.artifact_utils import _download_artifact_from_uri
from mlflow.types.schema import Schema, TensorSpec
from mlflow.utils.environment import _mlflow_conda_env
from mlflow.utils.file_utils import TempDir
from mlflow.utils.model_utils import _get_flavor_configuration

from tests.helper_functions import (
    PROTOBUF_REQUIREMENT,
    _assert_pip_requirements,
    _compare_conda_env_requirements,
    _compare_logged_code_paths,
    _is_available_on_pypi,
    _is_importable,
    _mlflow_major_version_string,
    assert_array_almost_equal,
    assert_register_model_called_with_local_model_path,
    pyfunc_serve_and_score_model,
)
from tests.pyfunc.test_spark import score_model_as_udf

EXTRA_PYFUNC_SERVING_TEST_ARGS = (
    [] if _is_available_on_pypi("tensorflow") else ["--env-manager", "local"]
)
extra_pip_requirements = (
    [PROTOBUF_REQUIREMENT] if Version(tf.__version__) < Version("2.6.0") else []
)


@pytest.fixture(scope="module", autouse=True)
def fix_random_seed():
    SEED = 0
    os.environ["PYTHONHASHSEED"] = str(SEED)
    random.seed(SEED)
    np.random.seed(SEED)

    if Version(tf.__version__).major >= 2:
        tf.random.set_seed(SEED)
    else:
        tf.set_random_seed(SEED)


@pytest.fixture(scope="module")
def data():
    return datasets.load_iris(return_X_y=True)


def get_model(data):
    x, y = data
    model = Sequential()
    model.add(Dense(3, input_dim=4))
    model.add(Dense(1))
    # Use a small learning rate to prevent exploding gradients which may produce
    # infinite prediction values
    lr = 0.001
    kwargs = (
        # `lr` was renamed to `learning_rate` in keras 2.3.0:
        # https://github.com/keras-team/keras/releases/tag/2.3.0
        {"lr": lr} if Version(tf.__version__) < Version("2.3.0") else {"learning_rate": lr}
    )
    model.compile(loss="mean_squared_error", optimizer=SGD(**kwargs))
    model.fit(x, y)
    return model


@pytest.fixture(scope="module")
def model(data):
    return get_model(data)


@pytest.fixture(scope="module")
def model_signature():
    return ModelSignature(
        inputs=Schema([TensorSpec(np.dtype("float64"), (-1, 4))]),
        outputs=Schema([TensorSpec(np.dtype("float32"), (-1, 1))]),
    )


def get_tf_keras_model(data):
    x, y = data
    model = Sequential()
    model.add(Dense(3, input_dim=4))
    model.add(Dense(1))
    model.compile(loss="mean_squared_error", optimizer=SGD(learning_rate=0.001))
    model.fit(x, y)
    return model


@pytest.fixture(scope="module")
def tf_keras_model(data):
    return get_tf_keras_model(data)


@pytest.fixture(scope="module")
def predicted(model, data):
    x, _ = data
    return model.predict(x)


@pytest.fixture(scope="module")
def custom_layer():
    class MyDense(Layer):
        def __init__(self, output_dim, **kwargs):
            self.output_dim = output_dim
            super().__init__(**kwargs)

        def build(self, input_shape):
            self.kernel = self.add_weight(
                name="kernel",
                shape=(input_shape[1], self.output_dim),
                initializer="uniform",
                trainable=True,
            )
            super().build(input_shape)

        def call(self, inputs):
            return K.dot(inputs, self.kernel)

        def compute_output_shape(self, input_shape):
            return (input_shape[0], self.output_dim)

        def get_config(self):
            return {"output_dim": self.output_dim}

    return MyDense


@pytest.fixture(scope="module")
def custom_model(data, custom_layer):
    x, y = data
    model = Sequential()
    model.add(Dense(6, input_dim=4))
    model.add(custom_layer(1))
    model.compile(loss="mean_squared_error", optimizer="SGD")
    model.fit(x, y, epochs=1)
    return model


@pytest.fixture(scope="module")
def custom_predicted(custom_model, data):
    x, _ = data
    return custom_model.predict(x)


@pytest.fixture
def model_path(tmp_path):
    return os.path.join(tmp_path, "model")


@pytest.fixture
def keras_custom_env(tmp_path):
    conda_env = os.path.join(tmp_path, "conda_env.yml")
    _mlflow_conda_env(conda_env, additional_pip_deps=["keras", "tensorflow", "pytest"])
    return conda_env


@pytest.mark.parametrize(
    ("build_model", "save_format"),
    [
        (get_model, None),
        (get_tf_keras_model, None),
        (get_tf_keras_model, "h5"),
        (get_tf_keras_model, "tf"),
    ],
)
def test_model_save_load(build_model, save_format, model_path, data):
    x, _ = data
    keras_model = build_model(data)
    if build_model == get_tf_keras_model:
        model_path = os.path.join(model_path, "tf")
    else:
        model_path = os.path.join(model_path, "plain")
    expected = keras_model.predict(x)
    kwargs = {"save_format": save_format} if save_format else {}
    mlflow.tensorflow.save_model(keras_model, path=model_path, keras_model_kwargs=kwargs)
    # Loading Keras model
    model_loaded = mlflow.tensorflow.load_model(model_path)
    # When saving as SavedModel, we actually convert the model
    # to a slightly different format, so we cannot assume it is
    # exactly the same.
    if save_format != "tf":
        assert type(keras_model) == type(model_loaded)
    np.testing.assert_allclose(model_loaded.predict(x), expected, rtol=1e-5)
    # Loading pyfunc model
    pyfunc_loaded = mlflow.pyfunc.load_model(model_path)
    np.testing.assert_allclose(pyfunc_loaded.predict(x), expected, rtol=1e-5)


def test_pyfunc_serve_and_score(data):
    x, _ = data
    model = get_model(data)
    with mlflow.start_run():
        model_info = mlflow.tensorflow.log_model(model, name="model", input_example=x)
    expected = model.predict(x)
    inference_payload = load_serving_example(model_info.model_uri)
    scoring_response = pyfunc_serve_and_score_model(
        model_uri=model_info.model_uri,
        data=inference_payload,
        content_type=pyfunc_scoring_server.CONTENT_TYPE_JSON,
        extra_args=EXTRA_PYFUNC_SERVING_TEST_ARGS,
    )
    actual_scoring_response = (
        PredictionsResponse.from_json(scoring_response.content.decode("utf-8"))
        .get_predictions()
        .values.astype(np.float32)
    )
    np.testing.assert_allclose(actual_scoring_response, expected, rtol=1e-5)


def test_score_model_as_spark_udf(data):
    x, _ = data
    model = get_model(data)
    with mlflow.start_run():
        model_info = mlflow.tensorflow.log_model(model, name="model")
    expected = model.predict(x)
    x_df = pd.DataFrame(x, columns=["0", "1", "2", "3"])
    spark_udf_preds = score_model_as_udf(
        model_uri=model_info.model_uri, pandas_df=x_df, result_type="float"
    )
    np.testing.assert_allclose(
        np.array(spark_udf_preds), expected.reshape(len(spark_udf_preds)), rtol=1e-5
    )


def test_signature_and_examples_are_saved_correctly(model, data, model_signature):
    signature_ = model_signature
    example_ = data[0][:3, :]
    for signature in (None, signature_):
        for example in (None, example_):
            with TempDir() as tmp:
                path = tmp.path("model")
                mlflow.tensorflow.save_model(
                    model, path=path, signature=signature, input_example=example
                )
                mlflow_model = Model.load(path)
                if signature is None and example is None:
                    assert signature is None
                else:
                    assert mlflow_model.signature == signature_
                if example is None:
                    assert mlflow_model.saved_input_example_info is None
                else:
                    np.testing.assert_allclose(_read_example(mlflow_model, path), example)


def test_custom_model_save_load(custom_model, custom_layer, data, custom_predicted, model_path):
    x, _ = data
    custom_objects = {"MyDense": custom_layer}
    mlflow.tensorflow.save_model(custom_model, path=model_path, custom_objects=custom_objects)
    # Loading Keras model
    model_loaded = mlflow.tensorflow.load_model(model_path)
    assert all(model_loaded.predict(x) == custom_predicted)
    # Loading pyfunc model
    pyfunc_loaded = mlflow.pyfunc.load_model(model_path)
    assert all(pyfunc_loaded.predict(x) == custom_predicted)


@pytest.mark.allow_infer_pip_requirements_fallback
@pytest.mark.skipif(
    Version(tf.__version__) == Version("2.11.1"),
    reason="TensorFlow 2.11.1 has a bug with layers specifying output dimensions",
)
def test_custom_model_save_respects_user_custom_objects(custom_model, custom_layer, model_path):
    class DifferentCustomLayer:
        def __init__(self):
            pass

        def __call__(self):
            pass

    incorrect_custom_objects = {"MyDense": DifferentCustomLayer()}
    correct_custom_objects = {"MyDense": custom_layer}
    mlflow.tensorflow.save_model(
        custom_model, path=model_path, custom_objects=incorrect_custom_objects
    )
    model_loaded = mlflow.tensorflow.load_model(
        model_path, keras_model_kwargs={"custom_objects": correct_custom_objects}
    )
    assert model_loaded is not None
    if Version(tf.__version__) <= Version("2.11.0") or Version(tf.__version__).release >= (2, 16):
        with pytest.raises(TypeError, match=r".+"):
            mlflow.tensorflow.load_model(model_path)
    else:
        # TF dev build following the release of 2.11.0 introduced changes to the recursive
        # loading strategy wherein the validation stage of custom objects loaded won't be
        # validated eagerly. This prevents a TypeError from being thrown as in the above
        # expectation catching validation block. The change in logic now permits loading and
        # will not raise an Exception, as validated below.
        # TF 2.16.0 updates the logic such that if the custom object is not saved with the
        # model or supplied in the load_model call, the model will not be loaded.
        incorrect_loaded = mlflow.tensorflow.load_model(model_path)
        assert incorrect_loaded is not None


def test_model_load_from_remote_uri_succeeds(model, model_path, mock_s3_bucket, data, predicted):
    x, _ = data
    mlflow.tensorflow.save_model(model, path=model_path)

    artifact_root = f"s3://{mock_s3_bucket}"
    artifact_path = "model"
    artifact_repo = S3ArtifactRepository(artifact_root)
    artifact_repo.log_artifacts(model_path, artifact_path=artifact_path)

    model_uri = artifact_root + "/" + artifact_path
    model_loaded = mlflow.tensorflow.load_model(model_uri=model_uri)
    assert all(model_loaded.predict(x) == predicted)


def test_model_log(model, data, predicted):
    x, _ = data
    # should_start_run tests whether or not calling log_model() automatically starts a run.
    for should_start_run in [False, True]:
        try:
            if should_start_run:
                mlflow.start_run()
            artifact_path = "keras_model"
            model_info = mlflow.tensorflow.log_model(model, name=artifact_path)
            # Load model
            model_loaded = mlflow.tensorflow.load_model(model_uri=model_info.model_uri)
            assert all(model_loaded.predict(x) == predicted)
            # Loading pyfunc model
            pyfunc_loaded = mlflow.pyfunc.load_model(model_info.model_uri)
            assert all(pyfunc_loaded.predict(x) == predicted)
        finally:
            mlflow.end_run()


def test_log_model_calls_register_model(model):
    artifact_path = "model"
    register_model_patch = mock.patch("mlflow.tracking._model_registry.fluent._register_model")
    with mlflow.start_run(), register_model_patch:
        model_info = mlflow.tensorflow.log_model(
            model, name=artifact_path, registered_model_name="AdsModel1"
        )
        assert_register_model_called_with_local_model_path(
            register_model_mock=mlflow.tracking._model_registry.fluent._register_model,
            model_uri=model_info.model_uri,
            registered_model_name="AdsModel1",
        )


def test_log_model_no_registered_model_name(model):
    artifact_path = "model"
    register_model_patch = mock.patch("mlflow.tracking._model_registry.fluent._register_model")
    with mlflow.start_run(), register_model_patch:
        mlflow.tensorflow.log_model(model, name=artifact_path)
        mlflow.tracking._model_registry.fluent._register_model.assert_not_called()


def test_model_save_persists_specified_conda_env_in_mlflow_model_directory(
    model, model_path, keras_custom_env
):
    mlflow.tensorflow.save_model(model, path=model_path, conda_env=keras_custom_env)

    pyfunc_conf = _get_flavor_configuration(model_path=model_path, flavor_name=pyfunc.FLAVOR_NAME)
    saved_conda_env_path = os.path.join(model_path, pyfunc_conf[pyfunc.ENV]["conda"])
    assert os.path.exists(saved_conda_env_path)
    assert saved_conda_env_path != keras_custom_env

    with open(keras_custom_env) as f:
        keras_custom_env_parsed = yaml.safe_load(f)
    with open(saved_conda_env_path) as f:
        saved_conda_env_parsed = yaml.safe_load(f)
    assert saved_conda_env_parsed == keras_custom_env_parsed


def test_model_save_accepts_conda_env_as_dict(model, model_path):
    conda_env = dict(mlflow.tensorflow.get_default_conda_env())
    conda_env["dependencies"].append("pytest")
    mlflow.tensorflow.save_model(model, path=model_path, conda_env=conda_env)

    pyfunc_conf = _get_flavor_configuration(model_path=model_path, flavor_name=pyfunc.FLAVOR_NAME)
    saved_conda_env_path = os.path.join(model_path, pyfunc_conf[pyfunc.ENV]["conda"])
    assert os.path.exists(saved_conda_env_path)

    with open(saved_conda_env_path) as f:
        saved_conda_env_parsed = yaml.safe_load(f)
    assert saved_conda_env_parsed == conda_env


def test_model_save_persists_requirements_in_mlflow_model_directory(
    model, model_path, keras_custom_env
):
    mlflow.tensorflow.save_model(model, path=model_path, conda_env=keras_custom_env)

    saved_pip_req_path = os.path.join(model_path, "requirements.txt")
    _compare_conda_env_requirements(keras_custom_env, saved_pip_req_path)


def test_log_model_with_pip_requirements(model, tmp_path):
    expected_mlflow_version = _mlflow_major_version_string()
    # Path to a requirements file
    req_file = tmp_path.joinpath("requirements.txt")
    req_file.write_text("a")
    with mlflow.start_run():
        model_info = mlflow.tensorflow.log_model(
            model, name="model", pip_requirements=str(req_file)
        )
        _assert_pip_requirements(model_info.model_uri, [expected_mlflow_version, "a"], strict=True)

    # List of requirements
    with mlflow.start_run():
        model_info = mlflow.tensorflow.log_model(
            model,
            name="model",
            pip_requirements=[f"-r {req_file}", "b"],
        )
        _assert_pip_requirements(
            model_info.model_uri, [expected_mlflow_version, "a", "b"], strict=True
        )

    # Constraints file
    with mlflow.start_run():
        model_info = mlflow.tensorflow.log_model(
            model,
            name="model",
            pip_requirements=[f"-c {req_file}", "b"],
        )
        _assert_pip_requirements(
            model_info.model_uri,
            [expected_mlflow_version, "b", "-c constraints.txt"],
            ["a"],
            strict=True,
        )


def test_log_model_with_extra_pip_requirements(model, tmp_path):
    expected_mlflow_version = _mlflow_major_version_string()
    default_reqs = mlflow.tensorflow.get_default_pip_requirements()
    # Path to a requirements file
    req_file = tmp_path.joinpath("requirements.txt")
    req_file.write_text("a")
    with mlflow.start_run():
        model_info = mlflow.tensorflow.log_model(
            model, name="model", extra_pip_requirements=str(req_file)
        )
        _assert_pip_requirements(
            model_info.model_uri, [expected_mlflow_version, *default_reqs, "a"]
        )

    # List of requirements
    with mlflow.start_run():
        model_info = mlflow.tensorflow.log_model(
            model,
            name="model",
            extra_pip_requirements=[f"-r {req_file}", "b"],
        )
        _assert_pip_requirements(
            model_info.model_uri, [expected_mlflow_version, *default_reqs, "a", "b"]
        )

    # Constraints file
    with mlflow.start_run():
        model_info = mlflow.tensorflow.log_model(
            model,
            name="model",
            extra_pip_requirements=[f"-c {req_file}", "b"],
        )
        _assert_pip_requirements(
            model_info.model_uri,
            [expected_mlflow_version, *default_reqs, "b", "-c constraints.txt"],
            ["a"],
        )


def test_model_log_persists_requirements_in_mlflow_model_directory(model, keras_custom_env):
    artifact_path = "model"
    with mlflow.start_run():
        model_info = mlflow.tensorflow.log_model(
            model, name=artifact_path, conda_env=keras_custom_env
        )

    model_path = _download_artifact_from_uri(model_info.model_uri)
    saved_pip_req_path = os.path.join(model_path, "requirements.txt")
    _compare_conda_env_requirements(keras_custom_env, saved_pip_req_path)


def test_model_log_persists_specified_conda_env_in_mlflow_model_directory(model, keras_custom_env):
    artifact_path = "model"
    with mlflow.start_run():
        model_info = mlflow.tensorflow.log_model(
            model, name=artifact_path, conda_env=keras_custom_env
        )
        model_path = _download_artifact_from_uri(model_info.model_uri)

    pyfunc_conf = _get_flavor_configuration(model_path=model_path, flavor_name=pyfunc.FLAVOR_NAME)
    saved_conda_env_path = os.path.join(model_path, pyfunc_conf[pyfunc.ENV]["conda"])
    assert os.path.exists(saved_conda_env_path)
    assert saved_conda_env_path != keras_custom_env

    with open(keras_custom_env) as f:
        keras_custom_env_parsed = yaml.safe_load(f)
    with open(saved_conda_env_path) as f:
        saved_conda_env_parsed = yaml.safe_load(f)
    assert saved_conda_env_parsed == keras_custom_env_parsed


def test_model_save_without_specified_conda_env_uses_default_env_with_expected_dependencies(
    model, model_path
):
    mlflow.tensorflow.save_model(model, path=model_path)
    _assert_pip_requirements(model_path, mlflow.tensorflow.get_default_pip_requirements())


def test_model_log_without_specified_conda_env_uses_default_env_with_expected_dependencies(model):
    with mlflow.start_run():
        model_info = mlflow.tensorflow.log_model(model, name="model")
    _assert_pip_requirements(model_info.model_uri, mlflow.tensorflow.get_default_pip_requirements())


def test_model_load_succeeds_with_missing_data_key_when_data_exists_at_default_path(
    tf_keras_model, model_path, data
):
    """
    This is a backwards compatibility test to ensure that models saved in MLflow version <= 0.8.0
    can be loaded successfully. These models are missing the `data` flavor configuration key.
    """
    mlflow.tensorflow.save_model(
        tf_keras_model, path=model_path, keras_model_kwargs={"save_format": "h5"}
    )
    shutil.move(os.path.join(model_path, "data", "model.h5"), os.path.join(model_path, "model.h5"))
    model_conf_path = os.path.join(model_path, "MLmodel")
    model_conf = Model.load(model_conf_path)
    flavor_conf = model_conf.flavors.get(mlflow.tensorflow.FLAVOR_NAME, None)
    assert flavor_conf is not None
    del flavor_conf["data"]
    model_conf.save(model_conf_path)

    model_loaded = mlflow.tensorflow.load_model(model_path)
    assert all(model_loaded.predict(data[0]) == tf_keras_model.predict(data[0]))


@pytest.mark.allow_infer_pip_requirements_fallback
def test_save_model_with_tf_save_format(model_path):
    """Ensures that Keras models can be saved with SavedModel format.

    Using SavedModel format (save_format="tf") requires that the file extension
    is _not_ "h5".
    """
    keras_model = mock.Mock(spec=tf.keras.Model)
    mlflow.tensorflow.save_model(
        keras_model, path=model_path, keras_model_kwargs={"save_format": "tf"}
    )
    _, args, kwargs = keras_model.save.mock_calls[0]
    # Ensure that save_format propagated through
    assert kwargs["save_format"] == "tf"
    # Ensure that the saved model does not have h5 extension
    assert not args[0].endswith(".h5")


def test_save_and_load_model_with_tf_save_format(tf_keras_model, model_path, data):
    mlflow.tensorflow.save_model(
        tf_keras_model, path=model_path, keras_model_kwargs={"save_format": "tf"}
    )
    model_conf_path = os.path.join(model_path, "MLmodel")
    model_conf = Model.load(model_conf_path)
    flavor_conf = model_conf.flavors.get(mlflow.tensorflow.FLAVOR_NAME, None)
    assert flavor_conf is not None
    assert flavor_conf.get("save_format") == "tf"
    assert not os.path.exists(os.path.join(model_path, "data", "model.h5")), (
        "TF model was saved with HDF5 format; expected SavedModel"
    )
    if Version(tf.__version__).release < (2, 16):
        assert os.path.isdir(os.path.join(model_path, "data", "model")), (
            "Expected directory containing saved_model.pb"
        )
    else:
        assert os.path.exists(os.path.join(model_path, "data", "model.keras")), (
            "Expected model saved as model.keras"
        )

    model_loaded = mlflow.tensorflow.load_model(model_path)
    np.testing.assert_allclose(model_loaded.predict(data[0]), tf_keras_model.predict(data[0]))


def test_load_without_save_format(tf_keras_model, model_path, data):
    mlflow.tensorflow.save_model(
        tf_keras_model, path=model_path, keras_model_kwargs={"save_format": "h5"}
    )
    model_conf_path = os.path.join(model_path, "MLmodel")
    model_conf = Model.load(model_conf_path)
    flavor_conf = model_conf.flavors.get(mlflow.tensorflow.FLAVOR_NAME)
    assert flavor_conf is not None
    del flavor_conf["save_format"]
    model_conf.save(model_conf_path)

    model_loaded = mlflow.tensorflow.load_model(model_path)
    np.testing.assert_allclose(model_loaded.predict(data[0]), tf_keras_model.predict(data[0]))


# TODO: Remove skipif condition `not Version(tf.__version__).is_devrelease` once
#  https://github.com/huggingface/transformers/issues/22421 is resolved.
@pytest.mark.skipif(
    not (
        _is_importable("transformers")
        and Version("2.6.0") <= Version(tf.__version__) < Version("2.16")
    ),
    reason="This test requires transformers, which is no longer compatible with Keras < 2.6.0, "
    "and transformers is not compatible with Tensorflow >= 2.16, see "
    "https://github.com/huggingface/transformers/issues/22421",
)
def test_pyfunc_serve_and_score_transformers():
    from transformers import BertConfig, TFBertModel

    bert_model = TFBertModel(
        BertConfig(
            vocab_size=16,
            hidden_size=2,
            num_hidden_layers=2,
            num_attention_heads=2,
            intermediate_size=2,
        )
    )
    dummy_inputs = bert_model.dummy_inputs["input_ids"].numpy()
    input_ids = tf.keras.layers.Input(shape=(dummy_inputs.shape[1],), dtype=tf.int32)
    model = tf.keras.Model(
        inputs=[input_ids], outputs=[bert_model.bert(input_ids).last_hidden_state]
    )
    model.compile()

    with mlflow.start_run():
        model_info = mlflow.tensorflow.log_model(
            model,
            name="model",
            extra_pip_requirements=extra_pip_requirements,
            input_example=dummy_inputs,
        )

    inference_payload = load_serving_example(model_info.model_uri)
    resp = pyfunc_serve_and_score_model(
        model_info.model_uri,
        inference_payload,
        pyfunc_scoring_server.CONTENT_TYPE_JSON,
        extra_args=EXTRA_PYFUNC_SERVING_TEST_ARGS,
    )

    scores = PredictionsResponse.from_json(resp.content.decode("utf-8")).get_predictions(
        predictions_format="ndarray"
    )
    assert_array_almost_equal(scores, model.predict(dummy_inputs))


def test_log_model_with_code_paths(model):
    artifact_path = "model"
    with (
        mlflow.start_run(),
        mock.patch("mlflow.tensorflow._add_code_from_conf_to_system_path") as add_mock,
    ):
        model_info = mlflow.tensorflow.log_model(model, name=artifact_path, code_paths=[__file__])
        _compare_logged_code_paths(__file__, model_info.model_uri, mlflow.tensorflow.FLAVOR_NAME)
        mlflow.tensorflow.load_model(model_info.model_uri)
        add_mock.assert_called()


def test_virtualenv_subfield_points_to_correct_path(model, model_path):
    mlflow.tensorflow.save_model(model, path=model_path)
    pyfunc_conf = _get_flavor_configuration(model_path=model_path, flavor_name=pyfunc.FLAVOR_NAME)
    python_env_path = Path(model_path, pyfunc_conf[pyfunc.ENV]["virtualenv"])
    assert python_env_path.exists()
    assert python_env_path.is_file()


def test_load_tf_keras_model_with_options(tf_keras_model, model_path):
    mlflow.tensorflow.save_model(tf_keras_model, path=model_path)
    keras_model_kwargs = {
        "compile": False,
        "options": tf.saved_model.LoadOptions(),
    }
    with mock.patch("mlflow.tensorflow._load_keras_model") as mock_load:
        mlflow.tensorflow.load_model(model_path, keras_model_kwargs=keras_model_kwargs)
        mock_load.assert_called_once_with(
            model_path=mock.ANY, keras_module=mock.ANY, save_format=mock.ANY, **keras_model_kwargs
        )


def test_model_save_load_with_metadata(tf_keras_model, model_path):
    mlflow.tensorflow.save_model(
        tf_keras_model, path=model_path, metadata={"metadata_key": "metadata_value"}
    )

    reloaded_model = mlflow.pyfunc.load_model(model_uri=model_path)
    assert reloaded_model.metadata.metadata["metadata_key"] == "metadata_value"


def test_model_log_with_metadata(tf_keras_model):
    artifact_path = "model"

    with mlflow.start_run():
        model_info = mlflow.tensorflow.log_model(
            tf_keras_model, name=artifact_path, metadata={"metadata_key": "metadata_value"}
        )

    reloaded_model = mlflow.pyfunc.load_model(model_uri=model_info.model_uri)
    assert reloaded_model.metadata.metadata["metadata_key"] == "metadata_value"


def test_model_log_with_signature_inference(tf_keras_model, data, model_signature):
    artifact_path = "model"
    example = data[0][:3, :]

    with mlflow.start_run():
        model_info = mlflow.tensorflow.log_model(
            tf_keras_model, name=artifact_path, input_example=example
        )

    mlflow_model = Model.load(model_info.model_uri)
    assert mlflow_model.signature == model_signature
```

--------------------------------------------------------------------------------

````
