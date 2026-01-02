---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 912
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 912 of 991)

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

---[FILE: utils.py]---
Location: mlflow-master/tests/spark/autologging/utils.py

```python
import os

import pyspark
from packaging.version import Version
from pyspark.sql import SparkSession

import mlflow
from mlflow.spark.autologging import _SPARK_TABLE_INFO_TAG_NAME


def _get_mlflow_spark_jar_path():
    spark_dir = "spark_2.13" if Version(pyspark.__version__).major >= 4 else "spark_2.12"
    jar_dir = os.path.join(os.path.dirname(mlflow.__file__), "java", spark_dir, "target")
    jar_filenames = [
        fname
        for fname in os.listdir(jar_dir)
        if ".jar" in fname and "sources" not in fname and "javadoc" not in fname
    ]
    return os.path.abspath(os.path.join(jar_dir, jar_filenames[0]))


def _get_expected_table_info_row(path, data_format, version=None):
    expected_path = f"file:{path}"
    if version is None:
        return f"path={expected_path},format={data_format}"
    return f"path={expected_path},version={version},format={data_format}"


def _assert_spark_data_logged(run, path, data_format, version=None):
    assert _SPARK_TABLE_INFO_TAG_NAME in run.data.tags
    table_info_tag = run.data.tags[_SPARK_TABLE_INFO_TAG_NAME]
    expected_tag = _get_expected_table_info_row(path, data_format, version)
    assert table_info_tag == expected_tag, f"Got: {table_info_tag} Expected: {expected_tag}"


def _assert_spark_data_not_logged(run):
    assert _SPARK_TABLE_INFO_TAG_NAME not in run.data.tags


def _get_or_create_spark_session(jars=None):
    jar_path = jars if jars is not None else _get_mlflow_spark_jar_path()
    return SparkSession.builder.config("spark.jars", jar_path).master("local[*]").getOrCreate()
```

--------------------------------------------------------------------------------

---[FILE: conftest.py]---
Location: mlflow-master/tests/spark/autologging/datasource/conftest.py

```python
import os
import tempfile

import pytest
from pyspark.sql import Row
from pyspark.sql.types import IntegerType, StringType, StructField, StructType

from mlflow.spark.autologging import clear_table_infos

from tests.spark.autologging.utils import _get_or_create_spark_session


# Module-scoped version of pytest monkeypatch fixture. Original monkeypatch in pytest
# is function-scoped, thus we need a larger scoped one to use that in module/session
# scoped fixtures.
@pytest.fixture(scope="module")
def monkeypatch_module():
    with pytest.MonkeyPatch().context() as m:
        yield m


@pytest.fixture(autouse=True, scope="module")
def disable_pyspark_pin_thread(monkeypatch_module: pytest.MonkeyPatch):
    # PYSPARK_PIN_THREAD is set to true by default since Pyspark 3.2.0, which causes
    # issues with Py4J callbacks, so we ask users to set it to false.
    monkeypatch_module.setenv("PYSPARK_PIN_THREAD", "false")


@pytest.fixture(scope="module")
def spark_session():
    with _get_or_create_spark_session() as session:
        yield session


@pytest.fixture
def data_format(format_to_file_path):
    res, _ = min(format_to_file_path.items())
    return res


@pytest.fixture
def file_path(format_to_file_path):
    _, file_path = min(format_to_file_path.items())
    return file_path


@pytest.fixture
def format_to_file_path(spark_session):
    rows = [Row(8, 32, "bat"), Row(64, 40, "mouse"), Row(-27, 55, "horse")]
    schema = StructType(
        [
            StructField("number2", IntegerType()),
            StructField("number1", IntegerType()),
            StructField("word", StringType()),
        ]
    )
    rdd = spark_session.sparkContext.parallelize(rows)
    df = spark_session.createDataFrame(rdd, schema)
    res = {}
    with tempfile.TemporaryDirectory() as tempdir:
        for data_format in ["csv", "parquet", "json"]:
            res[data_format] = os.path.join(tempdir, f"test-data-{data_format}")

        for data_format, file_path in res.items():
            df.write.option("header", "true").format(data_format).save(file_path)
        yield res


@pytest.fixture(autouse=True)
def tear_down():
    yield

    # Clear cached table infos. When the datasource event from Spark arrives but there is no
    # active run (e.g. the even comes with some delay), MLflow keep them in memory and logs them to
    # the next **and any successive active run** (ref: PR #4086).
    # However, this behavior is not desirable during tests, as we don't want any tests to be
    # affected by the previous test. Hence, this fixture is executed on every test function
    # to clear the accumulated table infos stored in the global context.
    clear_table_infos()
```

--------------------------------------------------------------------------------

---[FILE: test_autologging_behavior_without_spark_session.py]---
Location: mlflow-master/tests/spark/autologging/datasource/test_autologging_behavior_without_spark_session.py

```python
import mlflow


def test_enabling_autologging_does_not_throw_when_spark_hasnt_been_started():
    from pyspark.sql import SparkSession

    assert SparkSession.getActiveSession() is None

    mlflow.spark.autolog(disable=True)
```

--------------------------------------------------------------------------------

---[FILE: test_spark_datasource_autologging.py]---
Location: mlflow-master/tests/spark/autologging/datasource/test_spark_datasource_autologging.py
Signals: FastAPI

```python
import time
from unittest import mock

from pyspark.sql import Row
from pyspark.sql.types import IntegerType, StructField, StructType

import mlflow
import mlflow.spark
from mlflow.spark.autologging import _SPARK_TABLE_INFO_TAG_NAME
from mlflow.utils.validation import MAX_TAG_VAL_LENGTH

from tests.spark.autologging.utils import _assert_spark_data_logged
from tests.tracking.integration_test_utils import _init_server


def _get_expected_table_info_row(path, data_format, version=None):
    expected_path = f"file:{path}"
    if version is None:
        return f"path={expected_path},format={data_format}"
    return f"path={expected_path},version={version},format={data_format}"


# Note that the following tests run one-after-the-other and operate on the SAME spark_session
#   (it is not reset between tests)


def test_autologging_of_datasources_with_different_formats(spark_session, format_to_file_path):
    mlflow.spark.autolog()
    for data_format, file_path in format_to_file_path.items():
        base_df = (
            spark_session.read.format(data_format)
            .option("header", "true")
            .option("inferSchema", "true")
            .load(file_path)
        )
        base_df.createOrReplaceTempView("temptable")
        table_df0 = spark_session.table("temptable")
        table_df1 = spark_session.sql("SELECT number1, number2 from temptable LIMIT 5")
        dfs = [
            base_df,
            table_df0,
            table_df1,
            base_df.filter("number1 > 0"),
            base_df.select("number1"),
            base_df.limit(2),
            base_df.filter("number1 > 0").select("number1").limit(2),
        ]

        for df in dfs:
            with mlflow.start_run():
                run_id = mlflow.active_run().info.run_id
                df.collect()
                time.sleep(1)

            run = mlflow.get_run(run_id)
            _assert_spark_data_logged(run=run, path=file_path, data_format=data_format)


def test_autologging_does_not_throw_on_api_failures(spark_session, format_to_file_path, tmp_path):
    mlflow.spark.autolog()
    with _init_server(
        f"sqlite:///{tmp_path}/test.db", root_artifact_uri=tmp_path.as_uri(), server_type="fastapi"
    ) as url:
        mlflow.set_tracking_uri(url)
        with mlflow.start_run():
            with mock.patch(
                "mlflow.utils.rest_utils.http_request", side_effect=Exception("API request failed!")
            ):
                data_format = list(format_to_file_path.keys())[0]
                file_path = format_to_file_path[data_format]
                df = (
                    spark_session.read.format(data_format)
                    .option("header", "true")
                    .option("inferSchema", "true")
                    .load(file_path)
                )
                df.collect()
                df.filter("number1 > 0").collect()
                df.limit(2).collect()
                df.collect()
                time.sleep(1)


def test_autologging_dedups_multiple_reads_of_same_datasource(spark_session, format_to_file_path):
    mlflow.spark.autolog()
    data_format = list(format_to_file_path.keys())[0]
    file_path = format_to_file_path[data_format]
    df = (
        spark_session.read.format(data_format)
        .option("header", "true")
        .option("inferSchema", "true")
        .load(file_path)
    )
    with mlflow.start_run():
        run_id = mlflow.active_run().info.run_id
        df.collect()
        df.filter("number1 > 0").collect()
        df.limit(2).collect()
        df.collect()
        time.sleep(1)
    run = mlflow.get_run(run_id)
    _assert_spark_data_logged(run=run, path=file_path, data_format=data_format)
    # Test context provider flow
    df.filter("number1 > 0").collect()
    df.limit(2).collect()
    df.collect()
    with mlflow.start_run():
        run_id2 = mlflow.active_run().info.run_id
    time.sleep(1)
    run2 = mlflow.get_run(run_id2)
    _assert_spark_data_logged(run=run2, path=file_path, data_format=data_format)


def test_autologging_multiple_reads_same_run(spark_session, format_to_file_path):
    mlflow.spark.autolog()
    with mlflow.start_run():
        for data_format, file_path in format_to_file_path.items():
            run_id = mlflow.active_run().info.run_id
            df = spark_session.read.format(data_format).load(file_path)
            df.collect()
            time.sleep(1)
        run = mlflow.get_run(run_id)
        assert _SPARK_TABLE_INFO_TAG_NAME in run.data.tags
        table_info_tag = run.data.tags[_SPARK_TABLE_INFO_TAG_NAME]
        assert table_info_tag == "\n".join(
            [
                _get_expected_table_info_row(path, data_format)
                for data_format, path in format_to_file_path.items()
            ]
        )


def test_autologging_multiple_runs_same_data(spark_session, format_to_file_path):
    mlflow.spark.autolog()
    data_format = list(format_to_file_path.keys())[0]
    file_path = format_to_file_path[data_format]
    df = (
        spark_session.read.format(data_format)
        .option("header", "true")
        .option("inferSchema", "true")
        .load(file_path)
    )
    df.collect()

    for _ in range(2):
        with mlflow.start_run():
            time.sleep(1)
            run_id = mlflow.active_run().info.run_id
            run = mlflow.get_run(run_id)
            _assert_spark_data_logged(run=run, path=file_path, data_format=data_format)


def test_autologging_does_not_start_run(spark_session, format_to_file_path):
    try:
        mlflow.spark.autolog()
        data_format = list(format_to_file_path.keys())[0]
        file_path = format_to_file_path[data_format]
        df = (
            spark_session.read.format(data_format)
            .option("header", "true")
            .option("inferSchema", "true")
            .load(file_path)
        )
        df.collect()
        time.sleep(1)
        active_run = mlflow.active_run()
        assert active_run is None
        assert len(mlflow.search_runs()) == 0
    finally:
        mlflow.end_run()


def test_autologging_slow_api_requests(spark_session, format_to_file_path):
    import mlflow.utils.rest_utils

    orig = mlflow.utils.rest_utils.http_request

    def _slow_api_req_mock(*args, **kwargs):
        if kwargs.get("method") == "POST":
            time.sleep(1)
        return orig(*args, **kwargs)

    mlflow.spark.autolog()
    with mlflow.start_run():
        # Mock slow API requests to log Spark datasource information
        with mock.patch("mlflow.utils.rest_utils.http_request") as http_request_mock:
            http_request_mock.side_effect = _slow_api_req_mock
            run_id = mlflow.active_run().info.run_id
            for data_format, file_path in format_to_file_path.items():
                df = (
                    spark_session.read.format(data_format)
                    .option("header", "true")
                    .option("inferSchema", "true")
                    .load(file_path)
                )
                df.collect()
        # Sleep a bit prior to ending the run to guarantee that the Python process can pick up on
        # datasource read events (simulate the common case of doing work, e.g. model training,
        # on the DataFrame after reading from it)
        time.sleep(1)

    # Python subscriber threads should pick up the active run at the time they're notified
    # & make API requests against that run, even if those requests are slow.
    time.sleep(5)
    run = mlflow.get_run(run_id)
    assert _SPARK_TABLE_INFO_TAG_NAME in run.data.tags
    table_info_tag = run.data.tags[_SPARK_TABLE_INFO_TAG_NAME]
    assert table_info_tag == "\n".join(
        [
            _get_expected_table_info_row(path, data_format)
            for data_format, path in format_to_file_path.items()
        ]
    )


def test_autologging_truncates_datasource_tag_to_maximum_supported_value(tmp_path, spark_session):
    rows = [Row(100)]
    schema = StructType([StructField("number2", IntegerType())])
    rdd = spark_session.sparkContext.parallelize(rows)
    df = spark_session.createDataFrame(rdd, schema)

    # Save a Spark Dataframe to multiple paths with an aggregate path length
    # exceeding the maximum length of an MLflow tag (`MAX_TAG_VAL_LENGTH`)
    long_path_base = str(tmp_path.joinpath("a" * 150))
    saved_df_paths = []
    for path_suffix in range(int(MAX_TAG_VAL_LENGTH / len(long_path_base)) + 5):
        long_path = long_path_base + str(path_suffix)
        df.write.option("header", "true").format("csv").save(long_path)
        saved_df_paths.append(long_path)

    for path in saved_df_paths[:-1]:
        # Read the serialized Spark Dataframe from each path, ensuring that the aggregate length of
        # all Spark Datasource paths exceeds the maximum length of an MLflow tag
        # (`MAX_TAG_VAL_LENGTH`). One path is left out to be read during the MLflow run to verify
        # that tag value updates perform truncation as expected
        df = (
            spark_session.read.format("csv")
            .option("header", "true")
            .option("inferSchema", "true")
            .load(path)
        )
        df.collect()

    # Sleep a bit after reading datasources to guarantee that the Python
    # process can pick up on datasource read events
    time.sleep(3)

    def assert_tag_value_meets_requirements(run_id):
        """
        Verify that the Spark Datasource tag set on the run has been truncated to the maximum
        tag value length allowed by MLflow
        """
        run = mlflow.get_run(run_id)
        assert _SPARK_TABLE_INFO_TAG_NAME in run.data.tags
        table_info_tag = run.data.tags[_SPARK_TABLE_INFO_TAG_NAME]
        assert len(table_info_tag) == MAX_TAG_VAL_LENGTH
        assert table_info_tag.endswith("...")

    mlflow.spark.autolog()
    with mlflow.start_run() as run:
        # Verify that the Spark Datasource info tag contains truncated content from datasource
        # reads that occurred prior to run creation
        assert_tag_value_meets_requirements(run.info.run_id)

        # Read the serialized Spark Dataframe from the final path and verify that the resulting
        # Spark Datasource tag update performs truncation as expected
        df = (
            spark_session.read.format("csv")
            .option("header", "true")
            .option("inferSchema", "true")
            .load(saved_df_paths[-1])
        )
        df.collect()
        # Sleep a bit after reading datasources to guarantee that the Python
        # process can pick up on datasource read events
        time.sleep(3)
        assert_tag_value_meets_requirements(run.info.run_id)


def test_enabling_autologging_does_not_throw_when_spark_hasnt_been_started(spark_session):
    spark_session.stop()
    mlflow.spark.autolog()
```

--------------------------------------------------------------------------------

---[FILE: test_spark_datasource_autologging_crossframework.py]---
Location: mlflow-master/tests/spark/autologging/datasource/test_spark_datasource_autologging_crossframework.py

```python
import time

import numpy as np
import pytest
from sklearn.linear_model import LinearRegression

import mlflow
import mlflow.spark

from tests.spark.autologging.utils import _assert_spark_data_logged


@pytest.fixture
def http_tracking_uri_mock():
    mlflow.set_tracking_uri("http://some-cool-uri")
    yield
    mlflow.set_tracking_uri(None)


def _fit_sklearn(pandas_df):
    x = pandas_df.values
    y = np.array([4] * len(x))
    LinearRegression().fit(x, y)
    # Sleep to allow time for datasource read event to fire asynchronously from the JVM & for
    # the Python-side event handler to run & log a tag to the current active run.
    # This race condition (& the risk of dropping datasource read events for short-lived runs)
    # is known and documented in
    # https://mlflow.org/docs/latest/python_api/mlflow.spark.html#mlflow.spark.autolog
    time.sleep(5)


def _fit_sklearn_model_with_active_run(pandas_df):
    run_id = mlflow.active_run().info.run_id
    _fit_sklearn(pandas_df)
    return mlflow.get_run(run_id)


def _fit_sklearn_model_no_active_run(pandas_df):
    orig_runs = mlflow.search_runs()
    orig_run_ids = set(orig_runs["run_id"])
    _fit_sklearn(pandas_df)
    new_runs = mlflow.search_runs()
    new_run_ids = set(new_runs["run_id"])
    assert len(new_run_ids) == len(orig_run_ids) + 1
    run_id = (new_run_ids - orig_run_ids).pop()
    return mlflow.get_run(run_id)


def _fit_sklearn_model(pandas_df):
    active_run = mlflow.active_run()
    if active_run:
        return _fit_sklearn_model_with_active_run(pandas_df)
    else:
        return _fit_sklearn_model_no_active_run(pandas_df)


def test_spark_autologging_with_sklearn_autologging(spark_session, data_format, file_path):
    assert mlflow.active_run() is None
    mlflow.spark.autolog()
    mlflow.sklearn.autolog()
    df = (
        spark_session.read.format(data_format)
        .option("header", "true")
        .option("inferSchema", "true")
        .load(file_path)
        .select("number1", "number2")
    )
    pandas_df = df.toPandas()
    run = _fit_sklearn_model(pandas_df)
    _assert_spark_data_logged(run, file_path, data_format)
    assert mlflow.active_run() is None


def test_spark_sklearn_autologging_context_provider(spark_session, data_format, file_path):
    mlflow.spark.autolog()
    mlflow.sklearn.autolog()

    df = (
        spark_session.read.format(data_format)
        .option("header", "true")
        .option("inferSchema", "true")
        .load(file_path)
        .select("number1", "number2")
    )
    pandas_df = df.toPandas()

    # DF info should be logged to the first run (it should be added to our context provider after
    # the toPandas() call above & then logged here)
    with mlflow.start_run():
        run = _fit_sklearn_model(pandas_df)
    _assert_spark_data_logged(run, file_path, data_format)

    with mlflow.start_run():
        pandas_df2 = df.filter("number1 > 0").toPandas()
        run2 = _fit_sklearn_model(pandas_df2)
    assert run2.info.run_id != run.info.run_id
    _assert_spark_data_logged(run2, file_path, data_format)
    time.sleep(1)
    assert mlflow.active_run() is None


def test_spark_and_sklearn_autologging_all_runs_managed(spark_session, data_format, file_path):
    mlflow.spark.autolog()
    mlflow.sklearn.autolog()
    for _ in range(2):
        with mlflow.start_run():
            df = (
                spark_session.read.format(data_format)
                .option("header", "true")
                .option("inferSchema", "true")
                .load(file_path)
                .select("number1", "number2")
            )
            pandas_df = df.toPandas()
            run = _fit_sklearn_model(pandas_df)
        _assert_spark_data_logged(run, file_path, data_format)
    assert mlflow.active_run() is None
```

--------------------------------------------------------------------------------

---[FILE: test_spark_datasource_autologging_missing_jar.py]---
Location: mlflow-master/tests/spark/autologging/datasource/test_spark_datasource_autologging_missing_jar.py

```python
import pytest

import mlflow.spark
from mlflow.exceptions import MlflowException

from tests.spark.autologging.utils import _get_or_create_spark_session


def test_enabling_autologging_throws_for_missing_jar():
    with _get_or_create_spark_session(jars=""):
        with pytest.raises(MlflowException, match="ensure you have the mlflow-spark JAR attached"):
            mlflow.spark.autolog()
```

--------------------------------------------------------------------------------

---[FILE: test_spark_datasource_autologging_order.py]---
Location: mlflow-master/tests/spark/autologging/datasource/test_spark_datasource_autologging_order.py

```python
import os
import time

import pytest
from pyspark.sql import Row
from pyspark.sql.types import IntegerType, StructField, StructType

import mlflow
import mlflow.spark

from tests.spark.autologging.utils import (
    _assert_spark_data_logged,
    _assert_spark_data_not_logged,
    _get_or_create_spark_session,
)


@pytest.mark.parametrize("disable", [False, True])
def test_enabling_autologging_before_spark_session_works(disable, tmp_path):
    mlflow.spark.autolog(disable=disable)

    # creating spark session AFTER autolog was enabled
    with _get_or_create_spark_session() as spark_session:
        rows = [Row(100)]
        schema = StructType([StructField("number2", IntegerType())])
        rdd = spark_session.sparkContext.parallelize(rows)
        df = spark_session.createDataFrame(rdd, schema)
        filepath = os.path.join(tmp_path, "test-data")
        df.write.option("header", "true").format("csv").save(filepath)

        read_df = (
            spark_session.read.format("csv")
            .option("header", "true")
            .option("inferSchema", "true")
            .load(filepath)
        )

        with mlflow.start_run():
            run_id = mlflow.active_run().info.run_id
            read_df.collect()
            time.sleep(1)

        run = mlflow.get_run(run_id)
        if disable:
            _assert_spark_data_not_logged(run=run)
        else:
            _assert_spark_data_logged(run=run, path=filepath, data_format="csv")
```

--------------------------------------------------------------------------------

---[FILE: test_spark_datasource_autologging_unit.py]---
Location: mlflow-master/tests/spark/autologging/datasource/test_spark_datasource_autologging_unit.py

```python
from unittest import mock

import pytest

import mlflow
import mlflow.spark
from mlflow.exceptions import MlflowException
from mlflow.spark.autologging import PythonSubscriber, _get_current_listener


@pytest.fixture
def mock_get_current_listener():
    with mock.patch(
        "mlflow.spark.autologging._get_current_listener", return_value=None
    ) as get_listener_patch:
        yield get_listener_patch


@pytest.mark.usefixtures("spark_session")
def test_autolog_call_idempotent():
    mlflow.spark.autolog()
    listener = _get_current_listener()
    mlflow.spark.autolog()
    assert _get_current_listener() == listener


def test_subscriber_methods():
    # Test that PythonSubscriber satisfies the contract expected by the underlying Scala trait
    # it implements (MlflowAutologEventSubscriber)
    subscriber = PythonSubscriber()
    subscriber.ping()
    # Assert repl ID is stable & different between subscribers
    assert subscriber.replId() == subscriber.replId()
    assert PythonSubscriber().replId() != subscriber.replId()


def test_enabling_autologging_throws_for_wrong_spark_version(
    spark_session, mock_get_current_listener
):
    with mock.patch("mlflow.spark.autologging._get_spark_major_version", return_value=2):
        with pytest.raises(
            MlflowException, match="Spark autologging unsupported for Spark versions < 3"
        ):
            mlflow.spark.autolog()


def test_spark_datasource_autologging_raise_on_databricks_serverless_shared_cluster(spark_session):
    for mock_fun in [
        "is_in_databricks_serverless_runtime",
        "is_in_databricks_shared_cluster_runtime",
    ]:
        with mock.patch(f"mlflow.utils.databricks_utils.{mock_fun}", return_value=True):
            mlflow.spark.autolog(disable=True)  # assert no error is raised.
            with pytest.raises(
                MlflowException,
                match=(
                    "MLflow Spark dataset autologging is not supported on Databricks "
                    "shared clusters or Databricks serverless clusters."
                ),
            ):
                mlflow.spark.autolog()
```

--------------------------------------------------------------------------------

---[FILE: test_spark_disable_autologging.py]---
Location: mlflow-master/tests/spark/autologging/datasource/test_spark_disable_autologging.py

```python
import time

import mlflow
import mlflow.spark

from tests.spark.autologging.utils import (
    _assert_spark_data_logged,
    _assert_spark_data_not_logged,
)

# Note that the following tests run one-after-the-other and operate on the SAME spark_session
#   (it is not reset between tests)


def test_autologging_disabled_logging_datasource_with_different_formats(
    spark_session, format_to_file_path
):
    mlflow.spark.autolog(disable=True)
    for data_format, file_path in format_to_file_path.items():
        df = (
            spark_session.read.format(data_format)
            .option("header", "true")
            .option("inferSchema", "true")
            .load(file_path)
        )

        with mlflow.start_run():
            run_id = mlflow.active_run().info.run_id
            df.collect()
            time.sleep(1)
        run = mlflow.get_run(run_id)
        _assert_spark_data_not_logged(run=run)


def test_autologging_disabled_logging_with_or_without_active_run(
    spark_session, format_to_file_path
):
    mlflow.spark.autolog(disable=True)
    data_format = list(format_to_file_path.keys())[0]
    file_path = format_to_file_path[data_format]
    df = (
        spark_session.read.format(data_format)
        .option("header", "true")
        .option("inferSchema", "true")
        .load(file_path)
    )

    # Reading data source before starting a run
    df.filter("number1 > 0").collect()
    df.limit(2).collect()
    df.collect()

    # If there was any tag info collected it will be logged here
    with mlflow.start_run():
        run_id = mlflow.active_run().info.run_id
    time.sleep(1)

    # Confirm nothing was logged.
    run = mlflow.get_run(run_id)
    _assert_spark_data_not_logged(run=run)

    # Reading data source during an active run
    with mlflow.start_run():
        run_id = mlflow.active_run().info.run_id
        df.collect()
        time.sleep(1)
    run = mlflow.get_run(run_id)
    _assert_spark_data_not_logged(run=run)


def test_autologging_disabled_then_enabled(spark_session, format_to_file_path):
    mlflow.spark.autolog(disable=True)
    data_format = list(format_to_file_path.keys())[0]
    file_path = format_to_file_path[data_format]
    df = (
        spark_session.read.format(data_format)
        .option("header", "true")
        .option("inferSchema", "true")
        .load(file_path)
    )
    # Logging is disabled here.
    with mlflow.start_run():
        run_id = mlflow.active_run().info.run_id
        df.collect()
        time.sleep(1)
    run = mlflow.get_run(run_id)
    _assert_spark_data_not_logged(run=run)

    # Logging is enabled here.
    mlflow.spark.autolog(disable=False)
    with mlflow.start_run():
        run_id = mlflow.active_run().info.run_id
        df.filter("number1 > 0").collect()
        time.sleep(1)
    run = mlflow.get_run(run_id)
    _assert_spark_data_logged(run=run, path=file_path, data_format=data_format)
```

--------------------------------------------------------------------------------

````
