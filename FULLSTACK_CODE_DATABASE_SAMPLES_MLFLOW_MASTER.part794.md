---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 794
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 794 of 991)

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

---[FILE: test_default_evaluator_delta.py]---
Location: mlflow-master/tests/evaluate/test_default_evaluator_delta.py

```python
import tempfile

import pandas as pd
import pytest
from pyspark.sql import SparkSession

import mlflow
from mlflow.exceptions import MlflowException


def language_model(inputs: list[str]) -> list[str]:
    return inputs


def test_write_to_delta_fails_without_spark():
    with mlflow.start_run():
        model_info = mlflow.pyfunc.log_model(
            name="model", python_model=language_model, input_example=["a", "b"]
        )
        data = pd.DataFrame({"text": ["Hello world", "My name is MLflow"]})
        with pytest.raises(
            MlflowException,
            match="eval_results_path is only supported in Spark environment",
        ):
            mlflow.evaluate(
                model_info.model_uri,
                data,
                extra_metrics=[mlflow.metrics.latency()],
                evaluators="default",
                evaluator_config={
                    "eval_results_path": "my_path",
                    "eval_results_mode": "overwrite",
                },
            )


@pytest.fixture
def spark_session_with_delta():
    with tempfile.TemporaryDirectory() as tmpdir:
        with (
            SparkSession.builder.master("local[*]")
            .config("spark.jars.packages", "io.delta:delta-spark_2.13:4.0.0")
            .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
            .config(
                "spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog"
            )
            .config("spark.sql.warehouse.dir", tmpdir)
            .getOrCreate() as spark
        ):
            yield spark, tmpdir


def test_write_to_delta_fails_with_invalid_mode(spark_session_with_delta):
    with mlflow.start_run():
        model_info = mlflow.pyfunc.log_model(
            name="model", python_model=language_model, input_example=["a", "b"]
        )
        data = pd.DataFrame({"text": ["Hello world", "My name is MLflow"]})
        with pytest.raises(
            MlflowException,
            match="eval_results_mode can only be 'overwrite' or 'append'",
        ):
            mlflow.evaluate(
                model_info.model_uri,
                data,
                extra_metrics=[mlflow.metrics.latency()],
                evaluators="default",
                evaluator_config={
                    "eval_results_path": "my_path",
                    "eval_results_mode": "invalid_mode",
                },
            )


def test_write_eval_table_to_delta(spark_session_with_delta):
    spark_session, tmpdir = spark_session_with_delta
    with mlflow.start_run():
        model_info = mlflow.pyfunc.log_model(
            name="model", python_model=language_model, input_example=["a", "b"]
        )
        data = pd.DataFrame({"text": ["Hello world", "My name is MLflow"]})
        results = mlflow.evaluate(
            model_info.model_uri,
            data,
            extra_metrics=[mlflow.metrics.latency()],
            evaluators="default",
            evaluator_config={
                "eval_results_path": "my_path",
                "eval_results_mode": "overwrite",
            },
        )

        eval_table = results.tables["eval_results_table"].sort_values("text").reset_index(drop=True)

        eval_table_from_delta = (
            spark_session.read.format("delta")
            .load(f"{tmpdir}/my_path")
            .toPandas()
            .sort_values("text")
            .reset_index(drop=True)
        )

        pd.testing.assert_frame_equal(eval_table_from_delta, eval_table)


def test_write_eval_table_to_delta_append(spark_session_with_delta):
    spark_session, tmpdir = spark_session_with_delta
    with mlflow.start_run():
        model_info = mlflow.pyfunc.log_model(
            name="model", python_model=language_model, input_example=["a", "b"]
        )
        data = pd.DataFrame({"text": ["Hello world", "My name is MLflow"]})
        mlflow.evaluate(
            model_info.model_uri,
            data,
            extra_metrics=[mlflow.metrics.latency()],
            evaluators="default",
            evaluator_config={
                "eval_results_path": "my_path",
                "eval_results_mode": "overwrite",
            },
        )

        mlflow.evaluate(
            model_info.model_uri,
            data,
            extra_metrics=[mlflow.metrics.latency()],
            evaluators="default",
            evaluator_config={
                "eval_results_path": "my_path",
                "eval_results_mode": "append",
            },
        )

        eval_table_from_delta = spark_session.read.format("delta").load(f"{tmpdir}/my_path")

        assert eval_table_from_delta.count() == 4
```

--------------------------------------------------------------------------------

---[FILE: test_deprecated.py]---
Location: mlflow-master/tests/evaluate/test_deprecated.py

```python
import warnings
from contextlib import contextmanager
from unittest.mock import patch

import pandas as pd
import pytest

import mlflow

_TEST_DATA = pd.DataFrame({"x": [1, 2, 3], "y": [4, 5, 6]})


@pytest.mark.parametrize("tracking_uri", ["databricks", "http://localhost:5000"])
def test_global_evaluate_warn_in_tracking_uri(tracking_uri):
    with patch("mlflow.get_tracking_uri", return_value=tracking_uri):
        with pytest.warns(FutureWarning, match="The `mlflow.evaluate` API has been deprecated"):
            mlflow.evaluate(
                data=_TEST_DATA,
                model=lambda x: x["x"] * 2,
                extra_metrics=[mlflow.metrics.latency()],
            )


@contextmanager
def no_future_warning():
    with warnings.catch_warnings():
        # Translate future warning into an exception
        warnings.simplefilter("error", FutureWarning)
        yield


@pytest.mark.parametrize("tracking_uri", ["databricks", "sqlite://"])
def test_models_evaluate_does_not_warn(tracking_uri):
    with patch("mlflow.get_tracking_uri", return_value=tracking_uri):
        with no_future_warning():
            mlflow.models.evaluate(
                data=_TEST_DATA,
                model=lambda x: x["x"] * 2,
                extra_metrics=[mlflow.metrics.mse()],
            )
```

--------------------------------------------------------------------------------

````
