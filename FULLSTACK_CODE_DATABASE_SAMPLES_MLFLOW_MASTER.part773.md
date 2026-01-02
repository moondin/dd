---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 773
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 773 of 991)

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

---[FILE: test_polars_dataset.py]---
Location: mlflow-master/tests/data/test_polars_dataset.py

```python
from __future__ import annotations

import json
import re
from datetime import date, datetime
from pathlib import Path

import pandas as pd
import polars as pl
import pytest

from mlflow.data.code_dataset_source import CodeDatasetSource
from mlflow.data.evaluation_dataset import EvaluationDataset
from mlflow.data.filesystem_dataset_source import FileSystemDatasetSource
from mlflow.data.polars_dataset import PolarsDataset, from_polars, infer_schema
from mlflow.data.pyfunc_dataset_mixin import PyFuncInputsOutputs
from mlflow.exceptions import MlflowException
from mlflow.types.schema import Array, ColSpec, DataType, Object, Property, Schema

from tests.resources.data.dataset_source import SampleDatasetSource


@pytest.fixture(name="source", scope="module")
def sample_source() -> SampleDatasetSource:
    source_uri = "test:/my/test/uri"
    return SampleDatasetSource._resolve(source_uri)


def test_infer_schema() -> None:
    data = [
        [
            b"asd",
            True,
            datetime(2024, 1, 1, 12, 34, 56, 789),
            10,
            10,
            10,
            10,
            10,
            10,
            "asd",
            "😆",
            "category",
            "val2",
            date(2024, 1, 1),
            10,
            10,
            10,
            [1, 2, 3],
            [1, 2, 3],
            {"col1": 1},
        ]
    ]
    schema = {
        "Binary": pl.Binary,
        "Boolean": pl.Boolean,
        "Datetime": pl.Datetime,
        "Float32": pl.Float32,
        "Float64": pl.Float64,
        "Int8": pl.Int8,
        "Int16": pl.Int16,
        "Int32": pl.Int32,
        "Int64": pl.Int64,
        "String": pl.String,
        "Utf8": pl.Utf8,
        "Categorical": pl.Categorical,
        "Enum": pl.Enum(["val1", "val2"]),
        "Date": pl.Date,
        "UInt8": pl.UInt8,
        "UInt16": pl.UInt16,
        "UInt32": pl.UInt32,
        "List": pl.List(pl.Int8),
        "Array": pl.Array(pl.Int8, 3),
        "Struct": pl.Struct({"col1": pl.Int8}),
    }
    df = pl.DataFrame(data=data, schema=schema)

    assert infer_schema(df) == Schema(
        [
            ColSpec(name="Binary", type=DataType.binary),
            ColSpec(name="Boolean", type=DataType.boolean),
            ColSpec(name="Datetime", type=DataType.datetime),
            ColSpec(name="Float32", type=DataType.float),
            ColSpec(name="Float64", type=DataType.double),
            ColSpec(name="Int8", type=DataType.integer),
            ColSpec(name="Int16", type=DataType.integer),
            ColSpec(name="Int32", type=DataType.integer),
            ColSpec(name="Int64", type=DataType.long),
            ColSpec(name="String", type=DataType.string),
            ColSpec(name="Utf8", type=DataType.string),
            ColSpec(name="Categorical", type=DataType.string),
            ColSpec(name="Enum", type=DataType.string),
            ColSpec(name="Date", type=DataType.datetime),
            ColSpec(name="UInt8", type=DataType.integer),
            ColSpec(name="UInt16", type=DataType.integer),
            ColSpec(name="UInt32", type=DataType.long),
            ColSpec(name="List", type=Array(DataType.integer)),
            ColSpec(name="Array", type=Array(DataType.integer)),
            ColSpec(name="Struct", type=Object([Property(name="col1", dtype=DataType.integer)])),
        ]
    )


def test_conversion_to_json(source: SampleDatasetSource) -> None:
    dataset = PolarsDataset(
        df=pl.DataFrame([1, 2, 3], schema=["Numbers"]), source=source, name="testname"
    )

    dataset_json = dataset.to_json()
    parsed_json = json.loads(dataset_json)

    assert parsed_json.keys() <= {"name", "digest", "source", "source_type", "schema", "profile"}
    assert parsed_json["name"] == dataset.name
    assert parsed_json["digest"] == dataset.digest
    assert parsed_json["source"] == dataset.source.to_json()
    assert parsed_json["source_type"] == dataset.source._get_source_type()
    assert parsed_json["profile"] == json.dumps(dataset.profile)

    schema_json = json.dumps(json.loads(parsed_json["schema"])["mlflow_colspec"])
    assert Schema.from_json(schema_json) == dataset.schema


def test_digest_property_has_expected_value(source: SampleDatasetSource) -> None:
    dataset = PolarsDataset(df=pl.DataFrame([1, 2, 3], schema=["Numbers"]), source=source)
    assert dataset.digest == dataset._compute_digest()
    # Digest value varies across Polars versions due to hash_rows() implementation changes
    assert re.match(r"^\d+$", dataset.digest)


def test_digest_consistent(source: SampleDatasetSource) -> None:
    dataset1 = PolarsDataset(
        df=pl.DataFrame({"numbers": [1, 2, 3], "strs": ["a", "b", "c"]}), source=source
    )

    dataset2 = PolarsDataset(
        df=pl.DataFrame({"numbers": [2, 3, 1], "strs": ["b", "c", "a"]}), source=source
    )
    assert dataset1.digest == dataset2.digest


def test_digest_change(source: SampleDatasetSource) -> None:
    dataset1 = PolarsDataset(
        df=pl.DataFrame({"numbers": [1, 2, 3], "strs": ["a", "b", "c"]}), source=source
    )

    dataset2 = PolarsDataset(
        df=pl.DataFrame({"numbers": [10, 20, 30], "strs": ["aa", "bb", "cc"]}), source=source
    )
    assert dataset1.digest != dataset2.digest


def test_df_property(source: SampleDatasetSource) -> None:
    df = pl.DataFrame({"numbers": [1, 2, 3]})
    dataset = PolarsDataset(df=df, source=source)
    assert dataset.df.equals(df)


def test_targets_none(source: SampleDatasetSource) -> None:
    df_no_targets = pl.DataFrame({"numbers": [1, 2, 3]})
    dataset_no_targets = PolarsDataset(df=df_no_targets, source=source)
    assert dataset_no_targets._targets is None


def test_targets_not_none(source: SampleDatasetSource) -> None:
    df_with_targets = pl.DataFrame({"a": [1, 1], "b": [2, 2], "c": [3, 3]})
    dataset_with_targets = PolarsDataset(df=df_with_targets, source=source, targets="c")
    assert dataset_with_targets._targets == "c"


def test_targets_invalid(source: SampleDatasetSource) -> None:
    df = pl.DataFrame({"a": [1, 1], "b": [2, 2], "c": [3, 3]})
    with pytest.raises(
        MlflowException,
        match="DataFrame does not contain specified targets column: 'd'",
    ):
        PolarsDataset(df=df, source=source, targets="d")


def test_to_pyfunc_wo_outputs(source: SampleDatasetSource) -> None:
    df = pl.DataFrame({"numbers": [1, 2, 3]})
    dataset = PolarsDataset(df=df, source=source)

    input_outputs = dataset.to_pyfunc()

    assert isinstance(input_outputs, PyFuncInputsOutputs)
    assert len(input_outputs.inputs) == 1
    assert isinstance(input_outputs.inputs[0], pd.DataFrame)
    assert input_outputs.inputs[0].equals(pd.DataFrame({"numbers": [1, 2, 3]}))


def test_to_pyfunc_with_outputs(source: SampleDatasetSource) -> None:
    df = pl.DataFrame({"a": [1, 1], "b": [2, 2], "c": [3, 3]})
    dataset = PolarsDataset(df=df, source=source, targets="c")

    input_outputs = dataset.to_pyfunc()

    assert isinstance(input_outputs, PyFuncInputsOutputs)
    assert len(input_outputs.inputs) == 1
    assert isinstance(input_outputs.inputs[0], pd.DataFrame)
    assert input_outputs.inputs[0].equals(pd.DataFrame({"a": [1, 1], "b": [2, 2]}))
    assert len(input_outputs.outputs) == 1
    assert isinstance(input_outputs.outputs[0], pd.Series)
    assert input_outputs.outputs[0].equals(pd.Series([3, 3], name="c"))


def test_from_polars_with_targets(tmp_path: Path) -> None:
    df = pl.DataFrame({"a": [1, 1], "b": [2, 2], "c": [3, 3]})
    path = tmp_path / "temp.csv"
    df.write_csv(path)

    dataset = from_polars(df, targets="c", source=str(path))
    input_outputs = dataset.to_pyfunc()

    assert isinstance(input_outputs, PyFuncInputsOutputs)
    assert len(input_outputs.inputs) == 1
    assert isinstance(input_outputs.inputs[0], pd.DataFrame)
    assert input_outputs.inputs[0].equals(pd.DataFrame({"a": [1, 1], "b": [2, 2]}))
    assert len(input_outputs.outputs) == 1
    assert isinstance(input_outputs.outputs[0], pd.Series)
    assert input_outputs.outputs[0].equals(pd.Series([3, 3], name="c"))


def test_from_polars_file_system_datasource(tmp_path: Path) -> None:
    df = pl.DataFrame({"a": [1, 1], "b": [2, 2], "c": [3, 3]})
    path = tmp_path / "temp.csv"
    df.write_csv(path)

    mlflow_df = from_polars(df, source=str(path))

    assert isinstance(mlflow_df, PolarsDataset)
    assert mlflow_df.df.equals(df)
    assert mlflow_df.schema == infer_schema(df)
    assert mlflow_df.profile == {"num_rows": 2, "num_elements": 6}
    assert isinstance(mlflow_df.source, FileSystemDatasetSource)


def test_from_polars_no_source_specified() -> None:
    df = pl.DataFrame({"a": [1, 1], "b": [2, 2], "c": [3, 3]})

    mlflow_df = from_polars(df)

    assert isinstance(mlflow_df, PolarsDataset)
    assert isinstance(mlflow_df.source, CodeDatasetSource)
    assert "mlflow.source.name" in mlflow_df.source.to_json()


def test_to_evaluation_dataset(source: SampleDatasetSource) -> None:
    import numpy as np

    df = pl.DataFrame({"a": [1, 1], "b": [2, 2], "c": [3, 3]})
    dataset = PolarsDataset(df=df, source=source, targets="c", name="testname")
    evaluation_dataset = dataset.to_evaluation_dataset()

    assert evaluation_dataset.name is not None
    assert evaluation_dataset.digest is not None
    assert isinstance(evaluation_dataset, EvaluationDataset)
    assert isinstance(evaluation_dataset.features_data, pd.DataFrame)
    assert evaluation_dataset.features_data.equals(df.drop("c").to_pandas())
    assert isinstance(evaluation_dataset.labels_data, np.ndarray)
    assert np.array_equal(evaluation_dataset.labels_data, df["c"].to_numpy())
```

--------------------------------------------------------------------------------

---[FILE: test_spark_dataset.py]---
Location: mlflow-master/tests/data/test_spark_dataset.py

```python
import json
import os
from typing import TYPE_CHECKING, Any

import pandas as pd
import pytest

import mlflow.data
from mlflow.data.code_dataset_source import CodeDatasetSource
from mlflow.data.delta_dataset_source import DeltaDatasetSource
from mlflow.data.evaluation_dataset import EvaluationDataset
from mlflow.data.spark_dataset import SparkDataset
from mlflow.data.spark_dataset_source import SparkDatasetSource
from mlflow.exceptions import MlflowException
from mlflow.types.schema import Schema
from mlflow.types.utils import _infer_schema

if TYPE_CHECKING:
    from pyspark.sql import SparkSession


@pytest.fixture(scope="module")
def spark_session(tmp_path_factory: pytest.TempPathFactory):
    import pyspark
    from packaging.version import Version
    from pyspark.sql import SparkSession

    pyspark_version = Version(pyspark.__version__)
    if pyspark_version.major >= 4:
        delta_package = "io.delta:delta-spark_2.13:4.0.0"
    else:
        delta_package = "io.delta:delta-spark_2.12:3.0.0"

    tmp_dir = tmp_path_factory.mktemp("spark_tmp")
    with (
        SparkSession.builder.master("local[*]")
        .config("spark.jars.packages", delta_package)
        .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
        .config(
            "spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog"
        )
        .config("spark.sql.warehouse.dir", str(tmp_dir))
        .getOrCreate()
    ) as session:
        yield session


@pytest.fixture(autouse=True)
def drop_tables(spark_session: "SparkSession"):
    yield
    for row in spark_session.sql("SHOW TABLES").collect():
        spark_session.sql(f"DROP TABLE IF EXISTS {row.tableName}")


@pytest.fixture
def df():
    return pd.DataFrame([[1, 2, 3], [1, 2, 3]], columns=["a", "b", "c"])


def _assert_dataframes_equal(df1, df2):
    if df1.schema == df2.schema:
        diff = df1.exceptAll(df2)
        assert diff.rdd.isEmpty()
    else:
        assert False


def _validate_profile_approx_count(parsed_json: dict[str, Any]) -> None:
    """Validate approx_count in profile data, handling platform/version differences."""
    # On Windows with certain PySpark versions, Spark datasets may return "unknown" for approx_count
    # instead of the actual count. We should check that the profile is valid JSON and contains
    # the expected key, but not assert on the exact value.
    profile_data = json.loads(parsed_json["profile"])
    assert "approx_count" in profile_data
    assert profile_data["approx_count"] in [1, 2, "unknown"]


def _check_spark_dataset(dataset, original_df, df_spark, expected_source_type, expected_name=None):
    assert isinstance(dataset, SparkDataset)
    _assert_dataframes_equal(dataset.df, df_spark)
    assert dataset.schema == _infer_schema(original_df)
    assert isinstance(dataset.profile, dict)
    approx_count = dataset.profile.get("approx_count")
    assert isinstance(approx_count, int) or approx_count == "unknown"
    assert isinstance(dataset.source, expected_source_type)
    # NB: In real-world scenarios, Spark dataset sources may not match Spark DataFrames precisely.
    # For example, users may transform Spark DataFrames after loading contents from source files.
    # To ensure that source loading works properly for the purpose of the test cases in this suite,
    # we require the source to match the DataFrame and make the following equality assertion
    _assert_dataframes_equal(dataset.source.load(), df_spark)
    if expected_name is not None:
        assert dataset.name == expected_name


def test_conversion_to_json_spark_dataset_source(spark_session, tmp_path, df):
    df_spark = spark_session.createDataFrame(df)
    path = str(tmp_path / "temp.parquet")
    df_spark.write.parquet(path)

    source = SparkDatasetSource(path=path)

    dataset = SparkDataset(
        df=df_spark,
        source=source,
        name="testname",
    )

    dataset_json = dataset.to_json()
    parsed_json = json.loads(dataset_json)
    assert parsed_json.keys() <= {"name", "digest", "source", "source_type", "schema", "profile"}
    assert parsed_json["name"] == dataset.name
    assert parsed_json["digest"] == dataset.digest
    assert parsed_json["source"] == dataset.source.to_json()
    assert parsed_json["source_type"] == dataset.source._get_source_type()
    _validate_profile_approx_count(parsed_json)

    schema_json = json.dumps(json.loads(parsed_json["schema"])["mlflow_colspec"])
    assert Schema.from_json(schema_json) == dataset.schema


def test_conversion_to_json_delta_dataset_source(spark_session, tmp_path, df):
    df_spark = spark_session.createDataFrame(df)
    path = str(tmp_path / "temp.parquet")
    df_spark.write.format("delta").save(path)

    source = DeltaDatasetSource(path=path)

    dataset = SparkDataset(
        df=df_spark,
        source=source,
        name="testname",
    )

    dataset_json = dataset.to_json()
    parsed_json = json.loads(dataset_json)
    assert parsed_json.keys() <= {"name", "digest", "source", "source_type", "schema", "profile"}
    assert parsed_json["name"] == dataset.name
    assert parsed_json["digest"] == dataset.digest
    assert parsed_json["source"] == dataset.source.to_json()
    assert parsed_json["source_type"] == dataset.source._get_source_type()
    _validate_profile_approx_count(parsed_json)

    schema_json = json.dumps(json.loads(parsed_json["schema"])["mlflow_colspec"])
    assert Schema.from_json(schema_json) == dataset.schema


def test_digest_property_has_expected_value(spark_session, tmp_path, df):
    df_spark = spark_session.createDataFrame(df)
    path = str(tmp_path / "temp.parquet")
    df_spark.write.parquet(path)

    source = SparkDatasetSource(path=path)

    dataset = SparkDataset(
        df=df_spark,
        source=source,
        name="testname",
    )
    assert dataset.digest == dataset._compute_digest()
    # Note that digests are stable within a session, but may not be stable across sessions
    # Hence we are not checking the digest value here


def test_df_property_has_expected_value(spark_session, tmp_path, df):
    df_spark = spark_session.createDataFrame(df)
    path = str(tmp_path / "temp.parquet")
    df_spark.write.parquet(path)

    source = SparkDatasetSource(path=path)

    dataset = SparkDataset(
        df=df_spark,
        source=source,
        name="testname",
    )
    assert dataset.df == df_spark


def test_targets_property(spark_session, tmp_path, df):
    df_spark = spark_session.createDataFrame(df)
    path = str(tmp_path / "temp.parquet")
    df_spark.write.parquet(path)

    source = SparkDatasetSource(path=path)
    dataset_no_targets = SparkDataset(
        df=df_spark,
        source=source,
        name="testname",
    )
    assert dataset_no_targets.targets is None
    dataset_with_targets = SparkDataset(
        df=df_spark,
        source=source,
        targets="c",
        name="testname",
    )
    assert dataset_with_targets.targets == "c"

    with pytest.raises(
        MlflowException,
        match="The specified Spark dataset does not contain the specified targets column",
    ):
        SparkDataset(
            df=df_spark,
            source=source,
            targets="nonexistent",
            name="testname",
        )


def test_predictions_property(spark_session, tmp_path, df):
    df_spark = spark_session.createDataFrame(df)
    path = str(tmp_path / "temp.parquet")
    df_spark.write.parquet(path)

    source = SparkDatasetSource(path=path)
    dataset_no_predictions = SparkDataset(
        df=df_spark,
        source=source,
        name="testname",
    )
    assert dataset_no_predictions.predictions is None
    dataset_with_predictions = SparkDataset(
        df=df_spark,
        source=source,
        predictions="b",
        name="testname",
    )
    assert dataset_with_predictions.predictions == "b"

    with pytest.raises(
        MlflowException,
        match="The specified Spark dataset does not contain the specified predictions column",
    ):
        SparkDataset(
            df=df_spark,
            source=source,
            predictions="nonexistent",
            name="testname",
        )


def test_from_spark_no_source_specified(spark_session, df):
    df_spark = spark_session.createDataFrame(df)
    mlflow_df = mlflow.data.from_spark(df_spark)

    assert isinstance(mlflow_df, SparkDataset)

    assert isinstance(mlflow_df.source, CodeDatasetSource)
    assert "mlflow.source.name" in mlflow_df.source.to_json()


def test_from_spark_with_sql_and_version(spark_session, tmp_path, df):
    df_spark = spark_session.createDataFrame(df)
    path = str(tmp_path / "temp.parquet")
    df_spark.write.parquet(path)
    with pytest.raises(
        MlflowException,
        match="`version` may not be specified when `sql` is specified. `version` may only be"
        " specified when `table_name` or `path` is specified.",
    ):
        mlflow.data.from_spark(df_spark, sql="SELECT * FROM table", version=1)


def test_from_spark_path(spark_session, tmp_path, df):
    df_spark = spark_session.createDataFrame(df)
    dir_path = str(tmp_path / "df_dir")
    df_spark.write.parquet(dir_path)
    assert os.path.isdir(dir_path)

    mlflow_df_from_dir = mlflow.data.from_spark(df_spark, path=dir_path)
    _check_spark_dataset(mlflow_df_from_dir, df, df_spark, SparkDatasetSource)

    file_path = str(tmp_path / "df.parquet")
    df_spark.toPandas().to_parquet(file_path)
    assert not os.path.isdir(file_path)

    mlflow_df_from_file = mlflow.data.from_spark(df_spark, path=file_path)
    _check_spark_dataset(mlflow_df_from_file, df, df_spark, SparkDatasetSource)


def test_from_spark_delta_path(spark_session, tmp_path, df):
    df_spark = spark_session.createDataFrame(df)
    path = str(tmp_path / "temp.delta")
    df_spark.write.format("delta").save(path)

    mlflow_df = mlflow.data.from_spark(df_spark, path=path)

    _check_spark_dataset(mlflow_df, df, df_spark, DeltaDatasetSource)


def test_from_spark_sql(spark_session, df):
    df_spark = spark_session.createDataFrame(df)
    df_spark.createOrReplaceTempView("table")

    mlflow_df = mlflow.data.from_spark(df_spark, sql="SELECT * FROM table")

    _check_spark_dataset(mlflow_df, df, df_spark, SparkDatasetSource)


def test_from_spark_table_name(spark_session, df):
    df_spark = spark_session.createDataFrame(df)
    df_spark.createOrReplaceTempView("my_spark_table")

    mlflow_df = mlflow.data.from_spark(df_spark, table_name="my_spark_table")

    _check_spark_dataset(mlflow_df, df, df_spark, SparkDatasetSource)


def test_from_spark_table_name_with_version(spark_session, df):
    df_spark = spark_session.createDataFrame(df)
    df_spark.createOrReplaceTempView("my_spark_table")

    with pytest.raises(
        MlflowException,
        match="Version '1' was specified, but could not find a Delta table "
        "with name 'my_spark_table'",
    ):
        mlflow.data.from_spark(df_spark, table_name="my_spark_table", version=1)


def test_from_spark_delta_table_name(spark_session, df):
    df_spark = spark_session.createDataFrame(df)
    # write to delta table
    df_spark.write.format("delta").mode("overwrite").saveAsTable("my_delta_table")

    mlflow_df = mlflow.data.from_spark(df_spark, table_name="my_delta_table")

    _check_spark_dataset(mlflow_df, df, df_spark, DeltaDatasetSource)


def test_from_spark_delta_table_name_and_version(spark_session, df):
    df_spark = spark_session.createDataFrame(df)
    # write to delta table
    df_spark.write.format("delta").mode("overwrite").saveAsTable("my_delta_table")

    mlflow_df = mlflow.data.from_spark(df_spark, table_name="my_delta_table", version=0)

    _check_spark_dataset(mlflow_df, df, df_spark, DeltaDatasetSource)


def test_load_delta_with_no_source_info():
    with pytest.raises(
        MlflowException,
        match="Must specify exactly one of `table_name` or `path`.",
    ):
        mlflow.data.load_delta()


def test_load_delta_with_both_table_name_and_path():
    with pytest.raises(
        MlflowException,
        match="Must specify exactly one of `table_name` or `path`.",
    ):
        mlflow.data.load_delta(table_name="my_table", path="my_path")


def test_load_delta_path(spark_session, tmp_path, df):
    df_spark = spark_session.createDataFrame(df)
    path = str(tmp_path / "temp.delta")
    df_spark.write.format("delta").mode("overwrite").save(path)

    mlflow_df = mlflow.data.load_delta(path=path)

    _check_spark_dataset(mlflow_df, df, df_spark, DeltaDatasetSource)


def test_load_delta_path_with_version(spark_session, tmp_path, df):
    path = str(tmp_path / "temp.delta")

    df_v0 = pd.DataFrame([[4, 5, 6], [4, 5, 6]], columns=["a", "b", "c"])
    assert not df_v0.equals(df)
    df_v0_spark = spark_session.createDataFrame(df_v0)
    df_v0_spark.write.format("delta").mode("overwrite").save(path)

    # write again to create a new version
    df_v1_spark = spark_session.createDataFrame(df)
    df_v1_spark.write.format("delta").mode("overwrite").save(path)

    mlflow_df = mlflow.data.load_delta(path=path, version=1)
    _check_spark_dataset(mlflow_df, df, df_v1_spark, DeltaDatasetSource)


def test_load_delta_table_name(spark_session, df):
    df_spark = spark_session.createDataFrame(df)
    # write to delta table
    df_spark.write.format("delta").mode("overwrite").saveAsTable("my_delta_table")

    mlflow_df = mlflow.data.load_delta(table_name="my_delta_table")

    _check_spark_dataset(mlflow_df, df, df_spark, DeltaDatasetSource, "my_delta_table@v0")


def test_load_delta_table_name_with_version(spark_session, df):
    df_spark = spark_session.createDataFrame(df)
    df_spark.write.format("delta").mode("overwrite").saveAsTable("my_delta_table_versioned")

    df2 = pd.DataFrame([[4, 5, 6], [4, 5, 6]], columns=["a", "b", "c"])
    assert not df2.equals(df)
    df2_spark = spark_session.createDataFrame(df2)
    df2_spark.write.format("delta").mode("overwrite").saveAsTable("my_delta_table_versioned")

    mlflow_df = mlflow.data.load_delta(table_name="my_delta_table_versioned", version=1)

    _check_spark_dataset(
        mlflow_df, df2, df2_spark, DeltaDatasetSource, "my_delta_table_versioned@v1"
    )
    pd.testing.assert_frame_equal(mlflow_df.df.toPandas(), df2)


def test_to_evaluation_dataset(spark_session, tmp_path, df):
    import numpy as np

    df_spark = spark_session.createDataFrame(df)
    path = str(tmp_path / "temp.parquet")
    df_spark.write.parquet(path)

    source = SparkDatasetSource(path=path)

    dataset = SparkDataset(
        df=df_spark,
        source=source,
        targets="c",
        name="testname",
        predictions="b",
    )
    evaluation_dataset = dataset.to_evaluation_dataset()
    assert isinstance(evaluation_dataset, EvaluationDataset)
    assert evaluation_dataset.features_data.equals(df_spark.toPandas()[["a"]])
    assert np.array_equal(evaluation_dataset.labels_data, df_spark.toPandas()["c"].values)
    assert np.array_equal(evaluation_dataset.predictions_data, df_spark.toPandas()["b"].values)
```

--------------------------------------------------------------------------------

---[FILE: test_spark_dataset_source.py]---
Location: mlflow-master/tests/data/test_spark_dataset_source.py

```python
import json

import pandas as pd
import pytest

from mlflow.data.dataset_source_registry import get_dataset_source_from_json
from mlflow.data.spark_dataset_source import SparkDatasetSource
from mlflow.exceptions import MlflowException


@pytest.fixture(scope="module")
def spark_session():
    from pyspark.sql import SparkSession

    with (
        SparkSession.builder.master("local[*]")
        .config("spark.jars.packages", "io.delta:delta-spark_2.12:3.0.0")
        .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
        .config(
            "spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog"
        )
        .getOrCreate()
    ) as session:
        yield session


def test_spark_dataset_source_from_path(spark_session, tmp_path):
    df = pd.DataFrame([[1, 2, 3], [1, 2, 3]], columns=["a", "b", "c"])
    df_spark = spark_session.createDataFrame(df)
    path = str(tmp_path / "temp.parquet")
    df_spark.write.parquet(path)

    spark_datasource = SparkDatasetSource(path=path)
    assert spark_datasource.to_json() == json.dumps({"path": path})
    loaded_df_spark = spark_datasource.load()
    assert loaded_df_spark.count() == df_spark.count()

    reloaded_source = get_dataset_source_from_json(
        spark_datasource.to_json(), source_type=spark_datasource._get_source_type()
    )
    assert isinstance(reloaded_source, SparkDatasetSource)
    assert type(spark_datasource) == type(reloaded_source)
    assert reloaded_source.to_json() == spark_datasource.to_json()


def test_spark_dataset_source_from_table(spark_session, tmp_path):
    df = pd.DataFrame([[1, 2, 3], [1, 2, 3]], columns=["a", "b", "c"])
    df_spark = spark_session.createDataFrame(df)
    df_spark.write.mode("overwrite").saveAsTable("temp", path=tmp_path)

    spark_datasource = SparkDatasetSource(table_name="temp")
    assert spark_datasource.to_json() == json.dumps({"table_name": "temp"})
    loaded_df_spark = spark_datasource.load()
    assert loaded_df_spark.count() == df_spark.count()

    reloaded_source = get_dataset_source_from_json(
        spark_datasource.to_json(), source_type=spark_datasource._get_source_type()
    )
    assert isinstance(reloaded_source, SparkDatasetSource)
    assert type(spark_datasource) == type(reloaded_source)
    assert reloaded_source.to_json() == spark_datasource.to_json()


def test_spark_dataset_source_from_sql(spark_session, tmp_path):
    df = pd.DataFrame([[1, 2, 3], [1, 2, 3]], columns=["a", "b", "c"])
    df_spark = spark_session.createDataFrame(df)
    df_spark.write.mode("overwrite").saveAsTable("temp_sql", path=tmp_path)

    spark_datasource = SparkDatasetSource(sql="SELECT * FROM temp_sql")
    assert spark_datasource.to_json() == json.dumps({"sql": "SELECT * FROM temp_sql"})
    loaded_df_spark = spark_datasource.load()
    assert loaded_df_spark.count() == df_spark.count()

    reloaded_source = get_dataset_source_from_json(
        spark_datasource.to_json(), source_type=spark_datasource._get_source_type()
    )
    assert isinstance(reloaded_source, SparkDatasetSource)
    assert type(spark_datasource) == type(reloaded_source)
    assert reloaded_source.to_json() == spark_datasource.to_json()


def test_spark_dataset_source_too_many_inputs(spark_session, tmp_path):
    df = pd.DataFrame([[1, 2, 3], [1, 2, 3]], columns=["a", "b", "c"])
    df_spark = spark_session.createDataFrame(df)
    df_spark.write.mode("overwrite").saveAsTable("temp", path=tmp_path)

    with pytest.raises(
        MlflowException, match='Must specify exactly one of "path", "table_name", or "sql"'
    ):
        SparkDatasetSource(path=tmp_path, table_name="temp")
```

--------------------------------------------------------------------------------

````
