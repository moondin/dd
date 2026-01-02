---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 204
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 204 of 991)

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

---[FILE: test_sktime_model_export.py]---
Location: mlflow-master/examples/sktime/test_sktime_model_export.py

```python
import os
from pathlib import Path
from unittest import mock

import boto3
import flavor
import moto
import numpy as np
import pandas as pd
import pytest
from botocore.config import Config
from sktime.datasets import load_airline, load_longley
from sktime.datatypes import convert
from sktime.forecasting.arima import AutoARIMA
from sktime.forecasting.model_selection import temporal_train_test_split
from sktime.forecasting.naive import NaiveForecaster

import mlflow
from mlflow import pyfunc
from mlflow.exceptions import MlflowException
from mlflow.models import Model, infer_signature
from mlflow.models.utils import _read_example
from mlflow.store.artifact.s3_artifact_repo import S3ArtifactRepository
from mlflow.tracking._model_registry import DEFAULT_AWAIT_MAX_SLEEP_SECONDS
from mlflow.tracking.artifact_utils import _download_artifact_from_uri
from mlflow.utils.environment import _mlflow_conda_env

FH = [1, 2, 3]
COVERAGE = [0.1, 0.5, 0.9]
ALPHA = [0.1, 0.5, 0.9]
COV = False


@pytest.fixture
def model_path(tmp_path):
    """Create a temporary path to save/log model."""
    return tmp_path.joinpath("model")


@pytest.fixture(scope="module")
def mock_s3_bucket():
    """Create a mock S3 bucket using moto.

    Returns
    -------
    string with name of mock S3 bucket
    """
    with moto.mock_s3():
        bucket_name = "mock-bucket"
        my_config = Config(region_name="us-east-1")
        s3_client = boto3.client("s3", config=my_config)
        s3_client.create_bucket(Bucket=bucket_name)
        yield bucket_name


@pytest.fixture
def sktime_custom_env(tmp_path):
    """Create a conda environment and returns path to conda environment yml file."""
    conda_env = tmp_path.joinpath("conda_env.yml")
    _mlflow_conda_env(conda_env, additional_pip_deps=["sktime"])
    return conda_env


@pytest.fixture(scope="module")
def data_airline():
    """Create sample data for univariate model without exogenous regressor."""
    return load_airline()


@pytest.fixture(scope="module")
def data_longley():
    """Create sample data for univariate model with exogenous regressor."""
    y, X = load_longley()
    y_train, y_test, X_train, X_test = temporal_train_test_split(y, X)
    return y_train, y_test, X_train, X_test


@pytest.fixture(scope="module")
def auto_arima_model(data_airline):
    """Create instance of fitted auto arima model."""
    return AutoARIMA(sp=12, d=0, max_p=2, max_q=2, suppress_warnings=True).fit(data_airline)


@pytest.fixture(scope="module")
def naive_forecaster_model_with_regressor(data_longley):
    """Create instance of fitted naive forecaster model."""
    y_train, _, X_train, _ = data_longley
    model = NaiveForecaster()
    return model.fit(y_train, X_train)


@pytest.mark.parametrize("serialization_format", ["pickle", "cloudpickle"])
def test_auto_arima_model_save_and_load(auto_arima_model, model_path, serialization_format):
    flavor.save_model(
        sktime_model=auto_arima_model,
        path=model_path,
        serialization_format=serialization_format,
    )
    loaded_model = flavor.load_model(
        model_uri=model_path,
    )

    np.testing.assert_array_equal(auto_arima_model.predict(fh=FH), loaded_model.predict(fh=FH))


@pytest.mark.parametrize("serialization_format", ["pickle", "cloudpickle"])
def test_auto_arima_model_pyfunc_output(auto_arima_model, model_path, serialization_format):
    flavor.save_model(
        sktime_model=auto_arima_model,
        path=model_path,
        serialization_format=serialization_format,
    )
    loaded_pyfunc = flavor.pyfunc.load_model(model_uri=model_path)

    model_predict = auto_arima_model.predict(fh=FH)
    predict_conf = pd.DataFrame([{"fh": FH, "predict_method": "predict"}])
    pyfunc_predict = loaded_pyfunc.predict(predict_conf)
    np.testing.assert_array_equal(model_predict, pyfunc_predict)

    model_predict_interval = auto_arima_model.predict_interval(fh=FH, coverage=COVERAGE)
    predict_interval_conf = pd.DataFrame(
        [
            {
                "fh": FH,
                "predict_method": "predict_interval",
                "coverage": COVERAGE,
            }
        ]
    )
    pyfunc_predict_interval = loaded_pyfunc.predict(predict_interval_conf)
    np.testing.assert_array_equal(model_predict_interval.values, pyfunc_predict_interval.values)

    model_predict_quantiles = auto_arima_model.predict_quantiles(fh=FH, alpha=ALPHA)
    predict_quantiles_conf = pd.DataFrame(
        [
            {
                "fh": FH,
                "predict_method": "predict_quantiles",
                "alpha": ALPHA,
            }
        ]
    )
    pyfunc_predict_quantiles = loaded_pyfunc.predict(predict_quantiles_conf)
    np.testing.assert_array_equal(model_predict_quantiles.values, pyfunc_predict_quantiles.values)

    model_predict_var = auto_arima_model.predict_var(fh=FH, cov=COV)
    predict_var_conf = pd.DataFrame([{"fh": FH, "predict_method": "predict_var", "cov": COV}])
    pyfunc_predict_var = loaded_pyfunc.predict(predict_var_conf)
    np.testing.assert_array_equal(model_predict_var.values, pyfunc_predict_var.values)


def test_naive_forecaster_model_with_regressor_pyfunc_output(
    naive_forecaster_model_with_regressor, model_path, data_longley
):
    _, _, _, X_test = data_longley

    flavor.save_model(sktime_model=naive_forecaster_model_with_regressor, path=model_path)
    loaded_pyfunc = flavor.pyfunc.load_model(model_uri=model_path)

    X_test_array = convert(X_test, "pd.DataFrame", "np.ndarray")

    model_predict = naive_forecaster_model_with_regressor.predict(fh=FH, X=X_test)
    predict_conf = pd.DataFrame([{"fh": FH, "predict_method": "predict", "X": X_test_array}])
    pyfunc_predict = loaded_pyfunc.predict(predict_conf)
    np.testing.assert_array_equal(model_predict, pyfunc_predict)

    model_predict_interval = naive_forecaster_model_with_regressor.predict_interval(
        fh=FH, coverage=COVERAGE, X=X_test
    )
    predict_interval_conf = pd.DataFrame(
        [
            {
                "fh": FH,
                "predict_method": "predict_interval",
                "coverage": COVERAGE,
                "X": X_test_array,
            }
        ]
    )
    pyfunc_predict_interval = loaded_pyfunc.predict(predict_interval_conf)
    np.testing.assert_array_equal(model_predict_interval.values, pyfunc_predict_interval.values)

    model_predict_quantiles = naive_forecaster_model_with_regressor.predict_quantiles(
        fh=FH, alpha=ALPHA, X=X_test
    )
    predict_quantiles_conf = pd.DataFrame(
        [
            {
                "fh": FH,
                "predict_method": "predict_quantiles",
                "alpha": ALPHA,
                "X": X_test_array,
            }
        ]
    )
    pyfunc_predict_quantiles = loaded_pyfunc.predict(predict_quantiles_conf)
    np.testing.assert_array_equal(model_predict_quantiles.values, pyfunc_predict_quantiles.values)

    model_predict_var = naive_forecaster_model_with_regressor.predict_var(fh=FH, cov=COV, X=X_test)
    predict_var_conf = pd.DataFrame(
        [
            {
                "fh": FH,
                "predict_method": "predict_var",
                "cov": COV,
                "X": X_test_array,
            }
        ]
    )
    pyfunc_predict_var = loaded_pyfunc.predict(predict_var_conf)
    np.testing.assert_array_equal(model_predict_var.values, pyfunc_predict_var.values)


@pytest.mark.parametrize("use_signature", [True, False])
@pytest.mark.parametrize("use_example", [True, False])
def test_signature_and_examples_saved_correctly(
    auto_arima_model, data_airline, model_path, use_signature, use_example
):
    # Note: Signature inference fails on native model predict_interval/predict_quantiles
    prediction = auto_arima_model.predict(fh=FH)
    signature = infer_signature(data_airline, prediction) if use_signature else None
    example = pd.DataFrame(data_airline[0:5].copy(deep=False)) if use_example else None
    flavor.save_model(auto_arima_model, path=model_path, signature=signature, input_example=example)
    mlflow_model = Model.load(model_path)
    assert signature == mlflow_model.signature
    if example is None:
        assert mlflow_model.saved_input_example_info is None
    else:
        r_example = _read_example(mlflow_model, model_path).copy(deep=False)
        np.testing.assert_array_equal(r_example, example)


@pytest.mark.parametrize("use_signature", [True, False])
def test_predict_var_signature_saved_correctly(
    auto_arima_model, data_airline, model_path, use_signature
):
    prediction = auto_arima_model.predict_var(fh=FH)
    signature = infer_signature(data_airline, prediction) if use_signature else None
    flavor.save_model(auto_arima_model, path=model_path, signature=signature)
    mlflow_model = Model.load(model_path)
    assert signature == mlflow_model.signature


@pytest.mark.parametrize("use_signature", [True, False])
@pytest.mark.parametrize("use_example", [True, False])
def test_signature_and_example_for_pyfunc_predict_interval(
    auto_arima_model, model_path, data_airline, use_signature, use_example
):
    model_path_primary = model_path.joinpath("primary")
    model_path_secondary = model_path.joinpath("secondary")
    flavor.save_model(sktime_model=auto_arima_model, path=model_path_primary)
    loaded_pyfunc = flavor.pyfunc.load_model(model_uri=model_path_primary)
    predict_conf = pd.DataFrame(
        [
            {
                "fh": FH,
                "predict_method": "predict_interval",
                "coverage": COVERAGE,
            }
        ]
    )
    forecast = loaded_pyfunc.predict(predict_conf)
    signature = infer_signature(data_airline, forecast) if use_signature else None
    example = pd.DataFrame(data_airline[0:5].copy(deep=False)) if use_example else None
    flavor.save_model(
        auto_arima_model,
        path=model_path_secondary,
        signature=signature,
        input_example=example,
    )
    mlflow_model = Model.load(model_path_secondary)
    assert signature == mlflow_model.signature
    if example is None:
        assert mlflow_model.saved_input_example_info is None
    else:
        r_example = _read_example(mlflow_model, model_path_secondary).copy(deep=False)
        np.testing.assert_array_equal(r_example, example)


@pytest.mark.parametrize("use_signature", [True, False])
def test_signature_for_pyfunc_predict_quantiles(
    auto_arima_model, model_path, data_airline, use_signature
):
    model_path_primary = model_path.joinpath("primary")
    model_path_secondary = model_path.joinpath("secondary")
    flavor.save_model(sktime_model=auto_arima_model, path=model_path_primary)
    loaded_pyfunc = flavor.pyfunc.load_model(model_uri=model_path_primary)
    predict_conf = pd.DataFrame(
        [
            {
                "fh": FH,
                "predict_method": "predict_quantiles",
                "alpha": ALPHA,
            }
        ]
    )
    forecast = loaded_pyfunc.predict(predict_conf)
    signature = infer_signature(data_airline, forecast) if use_signature else None
    flavor.save_model(auto_arima_model, path=model_path_secondary, signature=signature)
    mlflow_model = Model.load(model_path_secondary)
    assert signature == mlflow_model.signature


def test_load_from_remote_uri_succeeds(auto_arima_model, model_path, mock_s3_bucket):
    flavor.save_model(sktime_model=auto_arima_model, path=model_path)

    artifact_root = f"s3://{mock_s3_bucket}"
    artifact_path = "model"
    artifact_repo = S3ArtifactRepository(artifact_root)
    artifact_repo.log_artifacts(model_path, artifact_path=artifact_path)

    model_uri = os.path.join(artifact_root, artifact_path)
    reloaded_sktime_model = flavor.load_model(model_uri=model_uri)

    np.testing.assert_array_equal(
        auto_arima_model.predict(fh=FH),
        reloaded_sktime_model.predict(fh=FH),
    )


@pytest.mark.parametrize("should_start_run", [True, False])
@pytest.mark.parametrize("serialization_format", ["pickle", "cloudpickle"])
def test_log_model(auto_arima_model, tmp_path, should_start_run, serialization_format):
    try:
        if should_start_run:
            mlflow.start_run()
        artifact_path = "sktime"
        conda_env = tmp_path.joinpath("conda_env.yaml")
        _mlflow_conda_env(conda_env, additional_pip_deps=["sktime"])
        model_info = flavor.log_model(
            sktime_model=auto_arima_model,
            artifact_path=artifact_path,
            conda_env=str(conda_env),
            serialization_format=serialization_format,
        )
        model_uri = f"runs:/{mlflow.active_run().info.run_id}/{artifact_path}"
        assert model_info.model_uri == model_uri
        reloaded_model = flavor.load_model(
            model_uri=model_uri,
        )
        np.testing.assert_array_equal(auto_arima_model.predict(), reloaded_model.predict())
        model_path = Path(_download_artifact_from_uri(artifact_uri=model_uri))
        model_config = Model.load(str(model_path.joinpath("MLmodel")))
        assert pyfunc.FLAVOR_NAME in model_config.flavors
    finally:
        mlflow.end_run()


def test_log_model_calls_register_model(auto_arima_model, tmp_path):
    artifact_path = "sktime"
    register_model_patch = mock.patch("mlflow.register_model")
    with mlflow.start_run(), register_model_patch:
        conda_env = tmp_path.joinpath("conda_env.yaml")
        _mlflow_conda_env(conda_env, additional_pip_deps=["sktime"])
        flavor.log_model(
            sktime_model=auto_arima_model,
            artifact_path=artifact_path,
            conda_env=str(conda_env),
            registered_model_name="SktimeModel",
        )
        model_uri = f"runs:/{mlflow.active_run().info.run_id}/{artifact_path}"
        mlflow.register_model.assert_called_once_with(
            model_uri,
            "SktimeModel",
            await_registration_for=DEFAULT_AWAIT_MAX_SLEEP_SECONDS,
        )


def test_log_model_no_registered_model_name(auto_arima_model, tmp_path):
    artifact_path = "sktime"
    register_model_patch = mock.patch("mlflow.register_model")
    with mlflow.start_run(), register_model_patch:
        conda_env = tmp_path.joinpath("conda_env.yaml")
        _mlflow_conda_env(conda_env, additional_pip_deps=["sktime"])
        flavor.log_model(
            sktime_model=auto_arima_model,
            artifact_path=artifact_path,
            conda_env=str(conda_env),
        )
        mlflow.register_model.assert_not_called()


def test_sktime_pyfunc_raises_invalid_df_input(auto_arima_model, model_path):
    flavor.save_model(sktime_model=auto_arima_model, path=model_path)
    loaded_pyfunc = flavor.pyfunc.load_model(model_uri=model_path)

    with pytest.raises(MlflowException, match="The provided prediction pd.DataFrame "):
        loaded_pyfunc.predict(pd.DataFrame([{"predict_method": "predict"}, {"fh": FH}]))

    with pytest.raises(MlflowException, match="The provided prediction configuration "):
        loaded_pyfunc.predict(pd.DataFrame([{"invalid": True}]))

    with pytest.raises(MlflowException, match="Invalid `predict_method` value"):
        loaded_pyfunc.predict(pd.DataFrame([{"predict_method": "predict_proba"}]))


def test_sktime_save_model_raises_invalid_serialization_format(auto_arima_model, model_path):
    with pytest.raises(MlflowException, match="Unrecognized serialization format: "):
        flavor.save_model(
            sktime_model=auto_arima_model, path=model_path, serialization_format="json"
        )
```

--------------------------------------------------------------------------------

---[FILE: train.py]---
Location: mlflow-master/examples/sktime/train.py

```python
import json

import flavor
import pandas as pd
from sktime.datasets import load_longley
from sktime.forecasting.model_selection import temporal_train_test_split
from sktime.forecasting.naive import NaiveForecaster
from sktime.performance_metrics.forecasting import (
    mean_absolute_error,
    mean_absolute_percentage_error,
)

import mlflow

with mlflow.start_run() as run:
    y, X = load_longley()
    y_train, y_test, X_train, X_test = temporal_train_test_split(y, X)

    forecaster = NaiveForecaster()
    forecaster.fit(
        y_train,
        X=X_train,
    )

    # Extract parameters
    parameters = forecaster.get_params()

    # Evaluate model
    y_pred = forecaster.predict(fh=[1, 2, 3, 4], X=X_test)
    metrics = {
        "mae": mean_absolute_error(y_test, y_pred),
        "mape": mean_absolute_percentage_error(y_test, y_pred),
    }

    print(f"Parameters: \n{json.dumps(parameters, indent=2)}")
    print(f"Metrics: \n{json.dumps(metrics, indent=2)}")

    # Log parameters and metrics
    mlflow.log_params(parameters)
    mlflow.log_metrics(metrics)

    # Log model using custom model flavor with pickle serialization (default).
    # Note that pickle serialization requires using the same python environment
    # (version) in whatever environment you're going to use this model for
    # inference to ensure that the model will load with appropriate version of
    # pickle.
    model_info = flavor.log_model(
        sktime_model=forecaster,
        artifact_path="sktime_model",
        serialization_format="pickle",
    )
    model_uri = model_info.model_uri

# Load model in native sktime flavor and pyfunc flavor
loaded_model = flavor.load_model(model_uri=model_uri)
loaded_pyfunc = flavor.pyfunc.load_model(model_uri=model_uri)

# Convert test data to 2D numpy array so it can be passed to pyfunc predict using
# a single-row Pandas DataFrame configuration argument
X_test_array = X_test.to_numpy()

# Create configuration DataFrame for interval forecast with nominal coverage
# value [0.9,0.95], future forecast horizon of 4 periods, and exogenous regressor.
# Read more in the flavor.py module docstrings about the possible configurations.
predict_conf = pd.DataFrame(
    [
        {
            "fh": [1, 2, 3, 4],
            "predict_method": "predict_interval",
            "coverage": [0.9, 0.95],
            "X": X_test_array,
        }
    ]
)

# Generate interval forecasts with native sktime flavor and pyfunc flavor
print(
    f"\nNative sktime 'predict_interval':\n${loaded_model.predict_interval(fh=[1, 2, 3], X=X_test, coverage=[0.9, 0.95])}"
)
print(f"\nPyfunc 'predict_interval':\n${loaded_pyfunc.predict(predict_conf)}")

# Print the run id which is used for serving the model to a local REST API endpoint
# in the score_model.py module
print(f"\nMLflow run id:\n{run.info.run_id}")
```

--------------------------------------------------------------------------------

---[FILE: tracing.py]---
Location: mlflow-master/examples/smolagents/tracing.py

```python
"""
This is an example for leveraging MLflow's auto tracing capabilities for Smolagents.
For more information about MLflow Tracing, see: https://mlflow.org/docs/latest/llms/tracing/index.html
"""

from smolagents import CodeAgent, LiteLLMModel

import mlflow

# Turn on auto tracing for Smolagents by calling mlflow.smolagents.autolog()
mlflow.smolagents.autolog()

model = LiteLLMModel(model_id="openai/gpt-4o-mini", api_key="API_KEY")
agent = CodeAgent(tools=[], model=model, add_base_tools=True)

result = agent.run(
    "Could you give me the 118th number in the Fibonacci sequence?",
)
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/examples/spacy/MLproject

```text
name: spacy_ner_example

python_env: python_env.yaml

entry_points:
  main:
    command: "python train.py"
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/examples/spacy/python_env.yaml

```yaml
build_dependencies:
  - pip
dependencies:
  - mlflow>=1.0
  - spacy==3.8.2
```

--------------------------------------------------------------------------------

---[FILE: train.py]---
Location: mlflow-master/examples/spacy/train.py

```python
import random

import spacy
from packaging.version import Version
from spacy.training import Example
from spacy.util import compounding, minibatch

import mlflow.spacy

IS_SPACY_VERSION_NEWER_THAN_OR_EQUAL_TO_3_0_0 = Version(spacy.__version__).major >= 3

# training data
TRAIN_DATA = [
    ("Who is Shaka Khan?", {"entities": [(7, 17, "PERSON")]}),
    ("I like London and Berlin.", {"entities": [(7, 13, "LOC"), (18, 24, "LOC")]}),
]

if __name__ == "__main__":
    # Adaptation of spaCy example: https://github.com/explosion/spaCy/blob/master/examples/training/train_ner.py

    # create blank model and add ner to the pipeline
    nlp = spacy.blank("en")
    if IS_SPACY_VERSION_NEWER_THAN_OR_EQUAL_TO_3_0_0:
        ner = nlp.add_pipe("ner", last=True)
    else:
        ner = nlp.create_pipe("ner")
        nlp.add_pipe(ner, last=True)

    # add labels
    for _, annotations in TRAIN_DATA:
        for ent in annotations.get("entities"):
            ner.add_label(ent[2])

    params = {"n_iter": 100, "drop": 0.5}
    mlflow.log_params(params)

    examples = []
    for text, annotations in TRAIN_DATA:
        examples.append(Example.from_dict(nlp.make_doc(text), annotations))
    nlp.initialize(lambda: examples)
    for itn in range(params["n_iter"]):
        random.shuffle(TRAIN_DATA)
        losses = {}
        # batch up the examples using spaCy's minibatch
        for batch in minibatch(examples, size=compounding(4.0, 32.0, 1.001)):
            nlp.update(
                batch,
                drop=params["drop"],  # dropout - make it harder to memorise data
                losses=losses,
            )
        print("Losses", losses)
        mlflow.log_metrics(losses)

    # Log the spaCy model using mlflow
    mlflow.spacy.log_model(spacy_model=nlp, name="model")
    model_uri = f"runs:/{mlflow.active_run().info.run_id}/model"

    print(f"Model saved in run {mlflow.active_run().info.run_id}")

    # Load the model using mlflow and use it to predict data
    nlp2 = mlflow.spacy.load_model(model_uri=model_uri)
    for text, _ in TRAIN_DATA:
        doc = nlp2(text)
        print("Entities", [(ent.text, ent.label_) for ent in doc.ents])
        print("Tokens", [(t.text, t.ent_type_, t.ent_iob) for t in doc])
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/spark_udf/README.md

```text
### MLflow Spark UDF Examples

The examples in this directory illustrate how you can use the `mlflow.pyfunc.spark_udf` API for batch inference,
including environment reproducibility capabilities with argument `env_manager="conda"`,
which creates a spark UDF for model inference that executes in an environment containing the exact dependency
versions used during training.

- Example `spark_udf.py` runs a sklearn model inference via spark UDF
  using a python environment containing the precise versions of dependencies used during model training.

#### Prerequisites

```
pip install scikit-learn
```

#### How to run the examples

Simple example:

```
python spark_udf.py
```

Spark UDF example with input data of datetime type:

```
python spark_udf_datetime.py
```

Spark UDF example with input data of struct and array type:

```
python structs_and_arrays.py
```

Spark UDF example using prebuilt model environment:

```
python spark_udf_with_prebuilt_env.py
```
```

--------------------------------------------------------------------------------

---[FILE: spark_udf.py]---
Location: mlflow-master/examples/spark_udf/spark_udf.py

```python
from pyspark.sql import SparkSession
from sklearn import datasets
from sklearn.neighbors import KNeighborsClassifier

import mlflow
from mlflow.models import infer_signature

with SparkSession.builder.getOrCreate() as spark:
    X, y = datasets.load_iris(as_frame=True, return_X_y=True)
    model = KNeighborsClassifier()
    model.fit(X, y)
    predictions = model.predict(X)
    signature = infer_signature(X, predictions)

    with mlflow.start_run():
        model_info = mlflow.sklearn.log_model(model, name="model", signature=signature)

    infer_spark_df = spark.createDataFrame(X)

    pyfunc_udf = mlflow.pyfunc.spark_udf(spark, model_info.model_uri, env_manager="conda")
    result = infer_spark_df.select(pyfunc_udf(*X.columns).alias("predictions")).toPandas()

    print(result)
```

--------------------------------------------------------------------------------

---[FILE: spark_udf_datetime.py]---
Location: mlflow-master/examples/spark_udf/spark_udf_datetime.py

```python
import datetime
import random

from pyspark.sql import SparkSession
from sklearn.compose import ColumnTransformer
from sklearn.datasets import load_iris
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import FunctionTransformer

import mlflow


def print_with_title(title, *args):
    print(f"\n===== {title} =====\n")
    for a in args:
        print(a)


def extract_month(df):
    print_with_title("extract_month input", df.head(), df.dtypes)
    transformed = df.assign(month=df["timestamp"].dt.month)
    print_with_title("extract_month output", transformed.head(), transformed.dtypes)
    return transformed


def main():
    X, y = load_iris(as_frame=True, return_X_y=True)
    X = X.assign(
        timestamp=[datetime.datetime(2022, random.randint(1, 12), 1) for _ in range(len(X))]
    )
    print_with_title("Ran input", X.head(30), X.dtypes)

    signature = mlflow.models.infer_signature(X, y)
    print_with_title("Signature", signature)

    month_extractor = FunctionTransformer(extract_month, validate=False)
    timestamp_remover = ColumnTransformer(
        [("selector", "passthrough", X.columns.drop("timestamp"))], remainder="drop"
    )
    model = Pipeline(
        [
            ("month_extractor", month_extractor),
            ("timestamp_remover", timestamp_remover),
            ("knn", KNeighborsClassifier()),
        ]
    )
    model.fit(X, y)

    with mlflow.start_run():
        model_info = mlflow.sklearn.log_model(model, name="model", signature=signature)

    with SparkSession.builder.getOrCreate() as spark:
        infer_spark_df = spark.createDataFrame(X.sample(n=10, random_state=42))
        print_with_title(
            "Inference input",
            infer_spark_df._jdf.showString(5, 20, False),  # numRows, truncate, vertical
            infer_spark_df._jdf.schema().treeString(),
        )

        pyfunc_udf = mlflow.pyfunc.spark_udf(spark, model_info.model_uri, env_manager="conda")
        result = infer_spark_df.select(pyfunc_udf(*X.columns).alias("predictions")).toPandas()
        print_with_title("Inference result", result)


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: spark_udf_with_prebuilt_env.py]---
Location: mlflow-master/examples/spark_udf/spark_udf_with_prebuilt_env.py

```python
"""
This example code shows how to use `mlflow.pyfunc.spark_udf` with Databricks Connect
outside Databricks runtime.
"""

import os

from databricks.connect import DatabricksSession
from databricks.sdk import WorkspaceClient
from sklearn import datasets
from sklearn.neighbors import KNeighborsClassifier

import mlflow

ws = WorkspaceClient()

spark = DatabricksSession.builder.remote(
    host=os.environ["DATABRICKS_HOST"],
    token=os.environ["DATABRICKS_TOKEN"],
    cluster_id="<cluster id>",  # get cluster id by spark.conf.get("spark.databricks.clusterUsageTags.clusterId")
).getOrCreate()

X, y = datasets.load_iris(as_frame=True, return_X_y=True)
model = KNeighborsClassifier()
model.fit(X, y)

with mlflow.start_run():
    model_info = mlflow.sklearn.log_model(model, name="model")

model_uri = model_info.model_uri

# The prebuilt model environment archive file path.
# To build the model environment, run the following line code in Databricks runtime:
# `model_env_uc_path = mlflow.pyfunc.build_model_env(model_uri, "/Volumes/...")`
model_env_uc_path = "dbfs:/Volumes/..."

infer_spark_df = spark.createDataFrame(X)

# Setting 'prebuilt_env_uri' parameter so that `spark_udf` can use the
# prebuilt python environment and skip rebuilding python environment.
pyfunc_udf = mlflow.pyfunc.spark_udf(spark, model_uri, prebuilt_env_uri=model_env_uc_path)
result = infer_spark_df.select(pyfunc_udf(*X.columns).alias("predictions")).toPandas()

print(result)
```

--------------------------------------------------------------------------------

---[FILE: structs_and_arrays.py]---
Location: mlflow-master/examples/spark_udf/structs_and_arrays.py

```python
from pyspark.sql import SparkSession
from pyspark.sql import types as T

import mlflow


class MyModel(mlflow.pyfunc.PythonModel):
    def predict(self, context, model_input):
        return [str(" | ".join(map(str, row))) for _, row in model_input.iterrows()]


def main():
    with SparkSession.builder.getOrCreate() as spark:
        df = spark.createDataFrame(
            [
                (
                    "a",
                    [0],
                    {"bool": True},
                    [{"double": 0.1}],
                )
            ],
            schema=T.StructType(
                [
                    T.StructField(
                        "str",
                        T.StringType(),
                    ),
                    T.StructField(
                        "arr",
                        T.ArrayType(T.IntegerType()),
                    ),
                    T.StructField(
                        "obj",
                        T.StructType(
                            [
                                T.StructField("bool", T.BooleanType()),
                            ]
                        ),
                    ),
                    T.StructField(
                        "obj_arr",
                        T.ArrayType(
                            T.StructType(
                                [
                                    T.StructField("double", T.DoubleType()),
                                ]
                            )
                        ),
                    ),
                ]
            ),
        )
        df.printSchema()
        df.show()

        with mlflow.start_run():
            model_info = mlflow.pyfunc.log_model(
                name="model",
                python_model=MyModel(),
                signature=mlflow.models.infer_signature(df),
            )

        udf = mlflow.pyfunc.spark_udf(
            spark=spark,
            model_uri=model_info.model_uri,
            result_type="string",
        )
        df.withColumn("output", udf("str", "arr", "obj", "obj_arr")).show()


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/examples/statsmodels/MLproject

```text
name: statsmodels-example
python_env: python_env.yaml
entry_points:
  main:
    parameters:
      inverse_method: {type: str, default: 'pinv'}
    command: |
        python train.py \
          --inverse-method={inverse_method}
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/examples/statsmodels/python_env.yaml

```yaml
build_dependencies:
  - pip
dependencies:
  - mlflow
  - statsmodels
  - scikit-learn
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/statsmodels/README.md

```text
# Statsmodels Example

This example trains a Statsmodels OLS (Ordinary Least Squares) model with synthetically generated data
and logs hyperparameters, metric (MSE), and trained model.

## Running the code

```
python train.py --inverse-method qr
```

The inverse method is the method used to compute the inverse matrix, and can be either qr or pinv (default).
'pinv' uses the Moore-Penrose pseudoinverse to solve the least squares problem. 'qr' uses the QR factorization.
You can try experimenting with both, as well as omitting the --inverse-method argument.

Then you can open the MLflow UI to track the experiments and compare your runs via:

```
mlflow server
```

## Running the code as a project

```
mlflow run . -P inverse_method=qr

```
```

--------------------------------------------------------------------------------

---[FILE: train.py]---
Location: mlflow-master/examples/statsmodels/train.py

```python
import argparse

import numpy as np
import statsmodels.api as sm
from sklearn.metrics import mean_squared_error

import mlflow
import mlflow.statsmodels


def parse_args():
    parser = argparse.ArgumentParser(description="Statsmodels example")
    parser.add_argument(
        "--inverse-method",
        type=str,
        default="pinv",
        help="Can be 'pinv', or 'qr'. 'pinv' uses the Moore-Penrose pseudoinverse "
        "to solve the least squares problem. 'qr' uses the QR factorization. "
        "(default: 'pinv')",
    )
    return parser.parse_args()


def main():
    # parse command-line arguments
    args = parse_args()

    # prepare train and test data
    # Ordinary Least Squares (OLS)
    np.random.seed(9876789)
    nsamples = 100
    x = np.linspace(0, 10, 100)
    X = np.column_stack((x, x**2))
    beta = np.array([1, 0.1, 10])
    e = np.random.normal(size=nsamples)
    X = sm.add_constant(X)
    y = np.dot(X, beta) + e

    # enable auto logging
    mlflow.statsmodels.autolog()

    with mlflow.start_run():
        ols = sm.OLS(y, X)
        model = ols.fit(method=args.inverse_method)

        # evaluate model
        y_pred = model.predict(X)
        mse = mean_squared_error(y, y_pred)

        # log metrics
        mlflow.log_metrics({"mse": mse})


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: tracing.py]---
Location: mlflow-master/examples/strands/tracing.py

```python
import mlflow

mlflow.strands.autolog()
mlflow.set_experiment("Strand Agent")

from strands import Agent
from strands.models.openai import OpenAIModel
from strands_tools import calculator

model = OpenAIModel(
    client_args={"api_key": "<api-key>"},
    # **model_config
    model_id="gpt-4o",
    params={
        "max_tokens": 1000,
        "temperature": 0.7,
    },
)

agent = Agent(model=model, tools=[calculator])
response = agent("What is 2+2")
print(response)
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/examples/supply_chain_security/MLproject

```text
name: supply-chain-security-example
python_env: python_env.yaml
entry_points:
  main:
    command: python train.py
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/examples/supply_chain_security/python_env.yaml

```yaml
python: "3.10"
build_dependencies:
  - pip
dependencies:
  - numpy
  - pandas
  - scipy
  - scikit-learn
  - mlflow
```

--------------------------------------------------------------------------------

---[FILE: README.rst]---
Location: mlflow-master/examples/supply_chain_security/README.rst

```text
Python Package Anti-Tampering with MLflow
-----------------------------------------
This directory contains an MLflow project showing how to harden the ML supply chain, and in particular
how to protect against Python package tampering by enforcing
`hash checks <https://pip.pypa.io/en/latest/cli/pip_install/#hash-checking-mode>`_ on packages.

Running this Example
^^^^^^^^^^^^^^^^^^^^

First, install MLflow (via ``pip install mlflow``).

The model is trained locally by running:

.. code-block:: bash

  mlflow run .

At the end of the training, note the run ID (say ``e651fcd4dab140a2bd4d3745a32370ac``).

The model is served locally by running:

.. code-block:: bash

  mlflow models serve -m runs:/e651fcd4dab140a2bd4d3745a32370ac/model

Inference is performed by sending JSON POST requests to http://localhost:5000/invocations:

.. code-block:: bash

  curl -X POST -d "{\"dataframe_split\": {\"data\":[[0.0199132142,0.0506801187,0.1048086895,0.0700725447,-0.0359677813,-0.0266789028,-0.0249926566,-0.002592262,0.0037117382,0.0403433716]]}}" -H "Content-Type: application/json" http://localhost:5000/invocations

Which returns ``[235.11371081266924]``.

Structure of this MLflow Project
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. code-block:: yaml

  name: mlflow-supply-chain-security
  channels:
  - nodefaults
  dependencies:
  - python=3.9
  - pip
  - pip:
    - --require-hashes
    - -r requirements.txt

This ensures that all the package requirements referenced in ``requirements.txt`` have been pinned through both version and hash:

.. code-block:: text

  mlflow==1.20.2 \
      --hash=sha256:963c22532e82a93450674ab97d62f9e528ed0906b580fadb7c003e696197557c \
      --hash=sha256:b15ff0c7e5e64f864a0b40c99b9a582227315eca2065d9f831db9aeb8f24637b
  numpy==1.21.4 \
      --hash=sha256:0b78ecfa070460104934e2caf51694ccd00f37d5e5dbe76f021b1b0b0d221823 \
  ...

That same conda environment is referenced when logging the model in ``train.py`` so the environment matches during inference:

.. code-block:: python

  mlflow.sklearn.log_model(
      model,
      name="model",
      signature=mlflow.models.infer_signature(X_train[:10], y_train[:10]),
      input_example=X_train[:10],
      conda_env="conda.yaml",
  )

The package requirements are managed in ``requirements.in``:

.. code-block:: text

  pandas==1.3.2
  scikit-learn==0.24.2
  mlflow==1.20.2

They are compiled using ``pip-tools`` to resolve all the package dependencies, their versions, and their hashes:

.. code-block:: bash

  pip install pip-tools
  pip-compile --generate-hashes --output-file=requirements.txt requirements.in
```

--------------------------------------------------------------------------------

---[FILE: train.py]---
Location: mlflow-master/examples/supply_chain_security/train.py

```python
import sklearn

import mlflow

# Use explicit model logging to control the conda environment and pip requirements
mlflow.sklearn.autolog(log_models=False)

# Load data
X, y = sklearn.datasets.load_diabetes(return_X_y=True)
X_train, X_test, y_train, y_test = sklearn.model_selection.train_test_split(
    X, y, test_size=0.2, random_state=0
)

# Train model
with mlflow.start_run() as run:
    print(f"MLflow run ID: {run.info.run_id}")

    model = sklearn.linear_model.Ridge(alpha=0.03)
    model.fit(X_train, y_train)

    mlflow.sklearn.log_model(
        model,
        name="model",
        signature=mlflow.models.infer_signature(X_train[:10], y_train[:10]),
        input_example=X_train[:10],
    )
```

--------------------------------------------------------------------------------

````
