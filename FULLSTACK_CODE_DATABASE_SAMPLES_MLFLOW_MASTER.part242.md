---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 242
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 242 of 991)

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

---[FILE: spark_dataset.py]---
Location: mlflow-master/mlflow/data/spark_dataset.py

```python
import json
import logging
from functools import cached_property
from typing import TYPE_CHECKING, Any

from packaging.version import Version

from mlflow.data.dataset import Dataset
from mlflow.data.dataset_source import DatasetSource
from mlflow.data.delta_dataset_source import DeltaDatasetSource
from mlflow.data.digest_utils import get_normalized_md5_digest
from mlflow.data.evaluation_dataset import EvaluationDataset
from mlflow.data.pyfunc_dataset_mixin import PyFuncConvertibleDatasetMixin, PyFuncInputsOutputs
from mlflow.data.spark_dataset_source import SparkDatasetSource
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INTERNAL_ERROR, INVALID_PARAMETER_VALUE
from mlflow.types import Schema
from mlflow.types.utils import _infer_schema

if TYPE_CHECKING:
    import pyspark

_logger = logging.getLogger(__name__)


class SparkDataset(Dataset, PyFuncConvertibleDatasetMixin):
    """
    Represents a Spark dataset (e.g. data derived from a Spark Table / file directory or Delta
    Table) for use with MLflow Tracking.
    """

    def __init__(
        self,
        df: "pyspark.sql.DataFrame",
        source: DatasetSource,
        targets: str | None = None,
        name: str | None = None,
        digest: str | None = None,
        predictions: str | None = None,
    ):
        if targets is not None and targets not in df.columns:
            raise MlflowException(
                f"The specified Spark dataset does not contain the specified targets column"
                f" '{targets}'.",
                INVALID_PARAMETER_VALUE,
            )
        if predictions is not None and predictions not in df.columns:
            raise MlflowException(
                f"The specified Spark dataset does not contain the specified predictions column"
                f" '{predictions}'.",
                INVALID_PARAMETER_VALUE,
            )

        self._df = df
        self._targets = targets
        self._predictions = predictions
        super().__init__(source=source, name=name, digest=digest)

    def _compute_digest(self) -> str:
        """
        Computes a digest for the dataset. Called if the user doesn't supply
        a digest when constructing the dataset.
        """
        # Retrieve a semantic hash of the DataFrame's logical plan, which is much more efficient
        # and deterministic than hashing DataFrame records
        import numpy as np
        import pyspark

        # Spark 3.1.0+ has a semanticHash() method on DataFrame
        if Version(pyspark.__version__) >= Version("3.1.0"):
            semantic_hash = self._df.semanticHash()
        else:
            semantic_hash = self._df._jdf.queryExecution().analyzed().semanticHash()
        return get_normalized_md5_digest([np.int64(semantic_hash)])

    def to_dict(self) -> dict[str, str]:
        """Create config dictionary for the dataset.

        Returns a string dictionary containing the following fields: name, digest, source, source
        type, schema, and profile.
        """
        schema = json.dumps({"mlflow_colspec": self.schema.to_dict()}) if self.schema else None
        config = super().to_dict()
        config.update(
            {
                "schema": schema,
                "profile": json.dumps(self.profile),
            }
        )
        return config

    @property
    def df(self):
        """The Spark DataFrame instance.

        Returns:
            The Spark DataFrame instance.

        """
        return self._df

    @property
    def targets(self) -> str | None:
        """The name of the Spark DataFrame column containing targets (labels) for supervised
        learning.

        Returns:
            The string name of the Spark DataFrame column containing targets.
        """
        return self._targets

    @property
    def predictions(self) -> str | None:
        """
        The name of the predictions column. May be ``None`` if no predictions column
        was specified when the dataset was created.
        """
        return self._predictions

    @property
    def source(self) -> SparkDatasetSource | DeltaDatasetSource:
        """
        Spark dataset source information.

        Returns:
            An instance of
            :py:class:`SparkDatasetSource <mlflow.data.spark_dataset_source.SparkDatasetSource>` or
            :py:class:`DeltaDatasetSource <mlflow.data.delta_dataset_source.DeltaDatasetSource>`.
        """
        return self._source

    @property
    def profile(self) -> Any | None:
        """
        A profile of the dataset. May be None if no profile is available.
        """
        try:
            from pyspark.rdd import BoundedFloat

            # Use Spark RDD countApprox to get approximate count since count() may be expensive.
            # Note that we call the Scala RDD API because the PySpark API does not respect the
            # specified timeout. Reference code:
            # https://spark.apache.org/docs/3.4.0/api/python/_modules/pyspark/rdd.html
            # #RDD.countApprox. This is confirmed to work in all Spark 3.x versions
            py_rdd = self.df.rdd
            drdd = py_rdd.mapPartitions(lambda it: [float(sum(1 for i in it))])
            jrdd = drdd.mapPartitions(lambda it: [float(sum(it))])._to_java_object_rdd()
            jdrdd = drdd.ctx._jvm.JavaDoubleRDD.fromRDD(jrdd.rdd())
            timeout_millis = 5000
            confidence = 0.9
            approx_count_operation = jdrdd.sumApprox(timeout_millis, confidence)
            approx_count_result = approx_count_operation.initialValue()
            approx_count_float = BoundedFloat(
                mean=approx_count_result.mean(),
                confidence=approx_count_result.confidence(),
                low=approx_count_result.low(),
                high=approx_count_result.high(),
            )
            approx_count = int(approx_count_float)
            if approx_count <= 0:
                # An approximate count of zero likely indicates that the count timed
                # out before an estimate could be made. In this case, we use the value
                # "unknown" so that users don't think the dataset is empty
                approx_count = "unknown"

            return {
                "approx_count": approx_count,
            }
        except Exception as e:
            _logger.warning(
                "Encountered an unexpected exception while computing Spark dataset profile."
                " Exception: %s",
                e,
            )

    @cached_property
    def schema(self) -> Schema | None:
        """
        The MLflow ColSpec schema of the Spark dataset.
        """
        try:
            return _infer_schema(self._df)
        except Exception as e:
            _logger.warning("Failed to infer schema for Spark dataset. Exception: %s", e)
            return None

    def to_pyfunc(self) -> PyFuncInputsOutputs:
        """
        Converts the Spark DataFrame to pandas and splits the resulting
        :py:class:`pandas.DataFrame` into: 1. a :py:class:`pandas.DataFrame` of features and
        2. a :py:class:`pandas.Series` of targets.

        To avoid overuse of driver memory, only the first 10,000 DataFrame rows are selected.
        """
        df = self._df.limit(10000).toPandas()
        if self._targets is not None:
            if self._targets not in df.columns:
                raise MlflowException(
                    f"Failed to convert Spark dataset to pyfunc inputs and outputs because"
                    f" the pandas representation of the Spark dataset does not contain the"
                    f" specified targets column '{self._targets}'.",
                    # This is an internal error because we should have validated the presence of
                    # the target column in the Hugging Face dataset at construction time
                    INTERNAL_ERROR,
                )
            inputs = df.drop(columns=self._targets)
            outputs = df[self._targets]
            return PyFuncInputsOutputs(inputs=inputs, outputs=outputs)
        else:
            return PyFuncInputsOutputs(inputs=df, outputs=None)

    def to_evaluation_dataset(self, path=None, feature_names=None) -> EvaluationDataset:
        """
        Converts the dataset to an EvaluationDataset for model evaluation. Required
        for use with mlflow.evaluate().
        """
        return EvaluationDataset(
            data=self._df.limit(10000).toPandas(),
            targets=self._targets,
            path=path,
            feature_names=feature_names,
            predictions=self._predictions,
            name=self.name,
            digest=self.digest,
        )


def load_delta(
    path: str | None = None,
    table_name: str | None = None,
    version: str | None = None,
    targets: str | None = None,
    name: str | None = None,
    digest: str | None = None,
) -> SparkDataset:
    """
    Loads a :py:class:`SparkDataset <mlflow.data.spark_dataset.SparkDataset>` from a Delta table
    for use with MLflow Tracking.

    Args:
        path: The path to the Delta table. Either ``path`` or ``table_name`` must be specified.
        table_name: The name of the Delta table. Either ``path`` or ``table_name`` must be
            specified.
        version: The Delta table version. If not specified, the version will be inferred.
        targets: Optional. The name of the Delta table column containing targets (labels) for
            supervised learning.
        name: The name of the dataset. E.g. "wiki_train". If unspecified, a name is
            automatically generated.
        digest: The digest (hash, fingerprint) of the dataset. If unspecified, a digest
            is automatically computed.

    Returns:
        An instance of :py:class:`SparkDataset <mlflow.data.spark_dataset.SparkDataset>`.
    """
    from mlflow.data.spark_delta_utils import (
        _try_get_delta_table_latest_version_from_path,
        _try_get_delta_table_latest_version_from_table_name,
    )

    if (path, table_name).count(None) != 1:
        raise MlflowException(
            "Must specify exactly one of `table_name` or `path`.",
            INVALID_PARAMETER_VALUE,
        )

    if version is None:
        if path is not None:
            version = _try_get_delta_table_latest_version_from_path(path)
        else:
            version = _try_get_delta_table_latest_version_from_table_name(table_name)

    if name is None and table_name is not None:
        name = table_name + (f"@v{version}" if version is not None else "")

    source = DeltaDatasetSource(path=path, delta_table_name=table_name, delta_table_version=version)
    df = source.load()

    return SparkDataset(
        df=df,
        source=source,
        targets=targets,
        name=name,
        digest=digest,
    )


def from_spark(
    df: "pyspark.sql.DataFrame",
    path: str | None = None,
    table_name: str | None = None,
    version: str | None = None,
    sql: str | None = None,
    targets: str | None = None,
    name: str | None = None,
    digest: str | None = None,
    predictions: str | None = None,
) -> SparkDataset:
    """
    Given a Spark DataFrame, constructs a
    :py:class:`SparkDataset <mlflow.data.spark_dataset.SparkDataset>` object for use with
    MLflow Tracking.

    Args:
        df: The Spark DataFrame from which to construct a SparkDataset.
        path: The path of the Spark or Delta source that the DataFrame originally came from. Note
            that the path does not have to match the DataFrame exactly, since the DataFrame may have
            been modified by Spark operations. This is used to reload the dataset upon request via
            :py:func:`SparkDataset.source.load()
            <mlflow.data.spark_dataset_source.SparkDatasetSource.load>`. If none of ``path``,
            ``table_name``, or ``sql`` are specified, a CodeDatasetSource is used, which will source
            information from the run context.
        table_name: The name of the Spark or Delta table that the DataFrame originally came from.
            Note that the table does not have to match the DataFrame exactly, since the DataFrame
            may have been modified by Spark operations. This is used to reload the dataset upon
            request via :py:func:`SparkDataset.source.load()
            <mlflow.data.spark_dataset_source.SparkDatasetSource.load>`. If none of ``path``,
            ``table_name``, or ``sql`` are specified, a CodeDatasetSource is used, which will source
            information from the run context.
        version: If the DataFrame originally came from a Delta table, specifies the version of the
            Delta table. This is used to reload the dataset upon request via
            :py:func:`SparkDataset.source.load()
            <mlflow.data.spark_dataset_source.SparkDatasetSource.load>`. ``version`` cannot be
            specified if ``sql`` is specified.
        sql: The Spark SQL statement that was originally used to construct the DataFrame. Note that
            the Spark SQL statement does not have to match the DataFrame exactly, since the
            DataFrame may have been modified by Spark operations. This is used to reload the dataset
            upon request via :py:func:`SparkDataset.source.load()
            <mlflow.data.spark_dataset_source.SparkDatasetSource.load>`. If none of ``path``,
            ``table_name``, or ``sql`` are specified, a CodeDatasetSource is used, which will source
            information from the run context.
        targets: Optional. The name of the Data Frame column containing targets (labels) for
            supervised learning.
        name: The name of the dataset. E.g. "wiki_train". If unspecified, a name is automatically
            generated.
        digest: The digest (hash, fingerprint) of the dataset. If unspecified, a digest is
            automatically computed.
        predictions: Optional. The name of the column containing model predictions,
            if the dataset contains model predictions. If specified, this column
            must be present in the dataframe (``df``).

    Returns:
        An instance of :py:class:`SparkDataset <mlflow.data.spark_dataset.SparkDataset>`.
    """
    from mlflow.data.code_dataset_source import CodeDatasetSource
    from mlflow.data.spark_delta_utils import (
        _is_delta_table,
        _is_delta_table_path,
        _try_get_delta_table_latest_version_from_path,
        _try_get_delta_table_latest_version_from_table_name,
    )
    from mlflow.tracking.context import registry

    if (path, table_name, sql).count(None) < 2:
        raise MlflowException(
            "Must specify at most one of `path`, `table_name`, or `sql`.",
            INVALID_PARAMETER_VALUE,
        )

    if (sql, version).count(None) == 0:
        raise MlflowException(
            "`version` may not be specified when `sql` is specified. `version` may only be"
            " specified when `table_name` or `path` is specified.",
            INVALID_PARAMETER_VALUE,
        )

    if sql is not None:
        source = SparkDatasetSource(sql=sql)
    elif path is not None:
        if _is_delta_table_path(path):
            version = version or _try_get_delta_table_latest_version_from_path(path)
            source = DeltaDatasetSource(path=path, delta_table_version=version)
        elif version is None:
            source = SparkDatasetSource(path=path)
        else:
            raise MlflowException(
                f"Version '{version}' was specified, but the path '{path}' does not refer"
                f" to a Delta table.",
                INVALID_PARAMETER_VALUE,
            )
    elif table_name is not None:
        if _is_delta_table(table_name):
            version = version or _try_get_delta_table_latest_version_from_table_name(table_name)
            source = DeltaDatasetSource(
                delta_table_name=table_name,
                delta_table_version=version,
            )
        elif version is None:
            source = SparkDatasetSource(table_name=table_name)
        else:
            raise MlflowException(
                f"Version '{version}' was specified, but could not find a Delta table with name"
                f" '{table_name}'.",
                INVALID_PARAMETER_VALUE,
            )
    else:
        context_tags = registry.resolve_tags()
        source = CodeDatasetSource(tags=context_tags)

    return SparkDataset(
        df=df,
        source=source,
        targets=targets,
        name=name,
        digest=digest,
        predictions=predictions,
    )
```

--------------------------------------------------------------------------------

---[FILE: spark_dataset_source.py]---
Location: mlflow-master/mlflow/data/spark_dataset_source.py

```python
from typing import Any

from mlflow.data.dataset_source import DatasetSource
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE


class SparkDatasetSource(DatasetSource):
    """
    Represents the source of a dataset stored in a spark table.
    """

    def __init__(
        self,
        path: str | None = None,
        table_name: str | None = None,
        sql: str | None = None,
    ):
        if (path, table_name, sql).count(None) != 2:
            raise MlflowException(
                'Must specify exactly one of "path", "table_name", or "sql"',
                INVALID_PARAMETER_VALUE,
            )
        self._path = path
        self._table_name = table_name
        self._sql = sql

    @staticmethod
    def _get_source_type() -> str:
        return "spark"

    def load(self, **kwargs):
        """Loads the dataset source as a Spark Dataset Source.

        Returns:
            An instance of ``pyspark.sql.DataFrame``.

        """
        from pyspark.sql import SparkSession

        spark = SparkSession.builder.getOrCreate()

        if self._path:
            return spark.read.parquet(self._path)
        if self._table_name:
            return spark.read.table(self._table_name)
        if self._sql:
            return spark.sql(self._sql)

    @staticmethod
    def _can_resolve(raw_source: Any):
        return False

    @classmethod
    def _resolve(cls, raw_source: str) -> "SparkDatasetSource":
        raise NotImplementedError

    def to_dict(self) -> dict[Any, Any]:
        info = {}
        if self._path is not None:
            info["path"] = self._path
        elif self._table_name is not None:
            info["table_name"] = self._table_name
        elif self._sql is not None:
            info["sql"] = self._sql
        return info

    @classmethod
    def from_dict(cls, source_dict: dict[Any, Any]) -> "SparkDatasetSource":
        return cls(
            path=source_dict.get("path"),
            table_name=source_dict.get("table_name"),
            sql=source_dict.get("sql"),
        )
```

--------------------------------------------------------------------------------

---[FILE: spark_delta_utils.py]---
Location: mlflow-master/mlflow/data/spark_delta_utils.py

```python
import logging
import os

from mlflow.utils.string_utils import _backtick_quote

_logger = logging.getLogger(__name__)


def _is_delta_table(table_name: str) -> bool:
    """Checks if a Delta table exists with the specified table name.

    Returns:
        True if a Delta table exists with the specified table name. False otherwise.

    """
    from pyspark.sql import SparkSession
    from pyspark.sql.utils import AnalysisException

    spark = SparkSession.builder.getOrCreate()

    try:
        # use DESCRIBE DETAIL to check if the table is a Delta table
        # https://docs.databricks.com/delta/delta-utility.html#describe-detail
        # format will be `delta` for delta tables
        spark.sql(f"DESCRIBE DETAIL {table_name}").filter("format = 'delta'").count()
        return True
    except AnalysisException:
        return False


def _is_delta_table_path(path: str) -> bool:
    """Checks if the specified filesystem path is a Delta table.

    Returns:
        True if the specified path is a Delta table. False otherwise.
    """
    if os.path.exists(path) and os.path.isdir(path) and "_delta_log" in os.listdir(path):
        return True
    from mlflow.utils.uri import dbfs_hdfs_uri_to_fuse_path

    try:
        dbfs_path = dbfs_hdfs_uri_to_fuse_path(path)
        return os.path.exists(dbfs_path) and "_delta_log" in os.listdir(dbfs_path)
    except Exception:
        return False


def _try_get_delta_table_latest_version_from_path(path: str) -> int | None:
    """Gets the latest version of the Delta table located at the specified path.

    Args:
        path: The path to the Delta table.

    Returns:
        The version of the Delta table, or None if it cannot be resolved (e.g. because the
        Delta core library is not installed or the specified path does not refer to a Delta
        table).

    """
    from pyspark.sql import SparkSession

    try:
        spark = SparkSession.builder.getOrCreate()
        j_delta_table = spark._jvm.io.delta.tables.DeltaTable.forPath(spark._jsparkSession, path)
        return _get_delta_table_latest_version(j_delta_table)
    except Exception as e:
        _logger.warning(
            "Failed to obtain version information for Delta table at path '%s'. Version information"
            " may not be included in the dataset source for MLflow Tracking. Exception: %s",
            path,
            e,
        )


def _try_get_delta_table_latest_version_from_table_name(table_name: str) -> int | None:
    """Gets the latest version of the Delta table with the specified name.

    Args:
        table_name: The name of the Delta table.

    Returns:
        The version of the Delta table, or None if it cannot be resolved (e.g. because the
        Delta core library is not installed or no such table exists).
    """
    from pyspark.sql import SparkSession

    try:
        spark = SparkSession.builder.getOrCreate()
        backticked_table_name = ".".join(map(_backtick_quote, table_name.split(".")))
        j_delta_table = spark._jvm.io.delta.tables.DeltaTable.forName(
            spark._jsparkSession, backticked_table_name
        )
        return _get_delta_table_latest_version(j_delta_table)
    except Exception as e:
        _logger.warning(
            "Failed to obtain version information for Delta table with name '%s'. Version"
            " information may not be included in the dataset source for MLflow Tracking."
            " Exception: %s",
            table_name,
            e,
        )


def _get_delta_table_latest_version(j_delta_table) -> int:
    """Obtains the latest version of the specified Delta table Java class.

    Args:
        j_delta_table: A Java DeltaTable class instance.

    Returns:
        The version of the Delta table.

    """
    latest_commit_jdf = j_delta_table.history(1)
    latest_commit_row = latest_commit_jdf.head()
    version_field_idx = latest_commit_row.fieldIndex("version")
    return latest_commit_row.get(version_field_idx)
```

--------------------------------------------------------------------------------

---[FILE: tensorflow_dataset.py]---
Location: mlflow-master/mlflow/data/tensorflow_dataset.py

```python
import json
import logging
from functools import cached_property
from typing import Any

import numpy as np

from mlflow.data.dataset import Dataset
from mlflow.data.dataset_source import DatasetSource
from mlflow.data.digest_utils import (
    MAX_ROWS,
    compute_numpy_digest,
    get_normalized_md5_digest,
)
from mlflow.data.evaluation_dataset import EvaluationDataset
from mlflow.data.pyfunc_dataset_mixin import PyFuncConvertibleDatasetMixin, PyFuncInputsOutputs
from mlflow.data.schema import TensorDatasetSchema
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INTERNAL_ERROR, INVALID_PARAMETER_VALUE
from mlflow.types.schema import Schema
from mlflow.types.utils import _infer_schema

_logger = logging.getLogger(__name__)


class TensorFlowDataset(Dataset, PyFuncConvertibleDatasetMixin):
    """
    Represents a TensorFlow dataset for use with MLflow Tracking.
    """

    def __init__(
        self,
        features,
        source: DatasetSource,
        targets=None,
        name: str | None = None,
        digest: str | None = None,
    ):
        """
        Args:
            features: A TensorFlow dataset or tensor of features.
            source: The source of the TensorFlow dataset.
            targets: A TensorFlow dataset or tensor of targets. Optional.
            name: The name of the dataset. E.g. "wiki_train". If unspecified, a name is
                automatically generated.
            digest: The digest (hash, fingerprint) of the dataset. If unspecified, a digest
                is automatically computed.
        """
        import tensorflow as tf

        if not isinstance(features, tf.data.Dataset) and not tf.is_tensor(features):
            raise MlflowException(
                f"'features' must be an instance of tf.data.Dataset or a TensorFlow Tensor."
                f" Found: {type(features)}.",
                INVALID_PARAMETER_VALUE,
            )

        if tf.is_tensor(features) and targets is not None and not tf.is_tensor(targets):
            raise MlflowException(
                f"If 'features' is a TensorFlow Tensor, then 'targets' must also be a TensorFlow"
                f" Tensor. Found: {type(targets)}.",
                INVALID_PARAMETER_VALUE,
            )

        if (
            isinstance(features, tf.data.Dataset)
            and targets is not None
            and not isinstance(targets, tf.data.Dataset)
        ):
            raise MlflowException(
                "If 'features' is an instance of tf.data.Dataset, then 'targets' must also be an"
                f" instance of tf.data.Dataset. Found: {type(targets)}.",
                INVALID_PARAMETER_VALUE,
            )

        self._features = features
        self._targets = targets
        super().__init__(source=source, name=name, digest=digest)

    def _compute_tensorflow_dataset_digest(
        self,
        dataset,
        targets=None,
    ) -> str:
        """Computes a digest for the given Tensorflow dataset.

        Args:
            dataset: A Tensorflow dataset.

        Returns:
            A string digest.
        """
        import pandas as pd
        import tensorflow as tf

        hashable_elements = []

        def hash_tf_dataset_iterator_element(element):
            if element is None:
                return
            flat_element = tf.nest.flatten(element)
            flattened_array = np.concatenate([x.flatten() for x in flat_element])
            trimmed_array = flattened_array[0:MAX_ROWS]
            try:
                hashable_elements.append(pd.util.hash_array(trimmed_array))
            except TypeError:
                hashable_elements.append(np.int64(trimmed_array.size))

        for element in dataset.as_numpy_iterator():
            hash_tf_dataset_iterator_element(element)
        if targets is not None:
            for element in targets.as_numpy_iterator():
                hash_tf_dataset_iterator_element(element)

        return get_normalized_md5_digest(hashable_elements)

    def _compute_tensor_digest(
        self,
        tensor_data,
        tensor_targets,
    ) -> str:
        """Computes a digest for the given Tensorflow tensor.

        Args:
            tensor_data: A Tensorflow tensor, representing the features.
            tensor_targets: A Tensorflow tensor, representing the targets. Optional.

        Returns:
            A string digest.
        """
        if tensor_targets is None:
            return compute_numpy_digest(tensor_data.numpy())
        else:
            return compute_numpy_digest(tensor_data.numpy(), tensor_targets.numpy())

    def _compute_digest(self) -> str:
        """
        Computes a digest for the dataset. Called if the user doesn't supply
        a digest when constructing the dataset.
        """
        import tensorflow as tf

        if isinstance(self._features, tf.data.Dataset):
            return self._compute_tensorflow_dataset_digest(self._features, self._targets)
        return self._compute_tensor_digest(self._features, self._targets)

    def to_dict(self) -> dict[str, str]:
        """Create config dictionary for the dataset.

        Returns a string dictionary containing the following fields: name, digest, source, source
        type, schema, and profile.
        """
        schema = json.dumps(self.schema.to_dict()) if self.schema else None
        config = super().to_dict()
        config.update(
            {
                "schema": schema,
                "profile": json.dumps(self.profile),
            }
        )
        return config

    @property
    def data(self):
        """
        The underlying TensorFlow data.
        """
        return self._features

    @property
    def source(self) -> DatasetSource:
        """
        The source of the dataset.
        """
        return self._source

    @property
    def targets(self):
        """
        The targets of the dataset.
        """
        return self._targets

    @property
    def profile(self) -> Any | None:
        """
        A profile of the dataset. May be None if no profile is available.
        """
        import tensorflow as tf

        profile = {
            "features_cardinality": int(self._features.cardinality().numpy())
            if isinstance(self._features, tf.data.Dataset)
            else int(tf.size(self._features).numpy()),
        }
        if self._targets is not None:
            profile.update(
                {
                    "targets_cardinality": int(self._targets.cardinality().numpy())
                    if isinstance(self._targets, tf.data.Dataset)
                    else int(tf.size(self._targets).numpy()),
                }
            )
        return profile

    @cached_property
    def schema(self) -> TensorDatasetSchema | None:
        """
        An MLflow TensorSpec schema representing the tensor dataset
        """
        try:
            features_schema = TensorFlowDataset._get_tf_object_schema(self._features)
            targets_schema = None
            if self._targets is not None:
                targets_schema = TensorFlowDataset._get_tf_object_schema(self._targets)
            return TensorDatasetSchema(features=features_schema, targets=targets_schema)
        except Exception as e:
            _logger.warning("Failed to infer schema for TensorFlow dataset. Exception: %s", e)
            return None

    @staticmethod
    def _get_tf_object_schema(tf_object) -> Schema:
        import tensorflow as tf

        if isinstance(tf_object, tf.data.Dataset):
            numpy_data = next(tf_object.as_numpy_iterator())
            if isinstance(numpy_data, np.ndarray):
                return _infer_schema(numpy_data)
            elif isinstance(numpy_data, dict):
                return TensorFlowDataset._get_schema_from_tf_dataset_dict_numpy_data(numpy_data)
            elif isinstance(numpy_data, tuple):
                return TensorFlowDataset._get_schema_from_tf_dataset_tuple_numpy_data(numpy_data)
            else:
                raise MlflowException(
                    f"Failed to infer schema for tf.data.Dataset due to unrecognized numpy iterator"
                    f" data type. Numpy iterator data types 'np.ndarray', 'dict', and 'tuple' are"
                    f" supported. Found: {type(numpy_data)}.",
                    INVALID_PARAMETER_VALUE,
                )
        elif tf.is_tensor(tf_object):
            return _infer_schema(tf_object.numpy())
        else:
            raise MlflowException(
                f"Cannot infer schema of an object that is not an instance of tf.data.Dataset or"
                f" a TensorFlow Tensor. Found: {type(tf_object)}",
                INTERNAL_ERROR,
            )

    @staticmethod
    def _get_schema_from_tf_dataset_dict_numpy_data(numpy_data: dict[Any, Any]) -> Schema:
        if not all(isinstance(data_element, np.ndarray) for data_element in numpy_data.values()):
            raise MlflowException(
                "Failed to infer schema for tf.data.Dataset. Schemas can only be inferred"
                " if the dataset consists of tensors. Ragged tensors, tensor arrays, and"
                " other types are not supported. Additionally, datasets with nested tensors"
                " are not supported.",
                INVALID_PARAMETER_VALUE,
            )
        return _infer_schema(numpy_data)

    @staticmethod
    def _get_schema_from_tf_dataset_tuple_numpy_data(numpy_data: tuple[Any]) -> Schema:
        if not all(isinstance(data_element, np.ndarray) for data_element in numpy_data):
            raise MlflowException(
                "Failed to infer schema for tf.data.Dataset. Schemas can only be inferred"
                " if the dataset consists of tensors. Ragged tensors, tensor arrays, and"
                " other types are not supported. Additionally, datasets with nested tensors"
                " are not supported.",
                INVALID_PARAMETER_VALUE,
            )
        return _infer_schema(
            {
                # MLflow Schemas currently require each tensor to have a name, if more than
                # one tensor is defined. Accordingly, use the index as the name
                str(i): data_element
                for i, data_element in enumerate(numpy_data)
            }
        )

    def to_pyfunc(self) -> PyFuncInputsOutputs:
        """
        Converts the dataset to a collection of pyfunc inputs and outputs for model
        evaluation. Required for use with mlflow.evaluate().
        """
        return PyFuncInputsOutputs(self._features, self._targets)

    def to_evaluation_dataset(self, path=None, feature_names=None) -> EvaluationDataset:
        """
        Converts the dataset to an EvaluationDataset for model evaluation. Only supported if the
        dataset is a Tensor. Required for use with mlflow.evaluate().
        """
        import tensorflow as tf

        # check that data and targets are Tensors
        if not tf.is_tensor(self._features):
            raise MlflowException("Data must be a Tensor to convert to an EvaluationDataset.")
        if self._targets is not None and not tf.is_tensor(self._targets):
            raise MlflowException("Targets must be a Tensor to convert to an EvaluationDataset.")
        return EvaluationDataset(
            data=self._features.numpy(),
            targets=self._targets.numpy() if self._targets is not None else None,
            path=path,
            feature_names=feature_names,
            name=self.name,
            digest=self.digest,
        )


def from_tensorflow(
    features,
    source: str | DatasetSource | None = None,
    targets=None,
    name: str | None = None,
    digest: str | None = None,
) -> TensorFlowDataset:
    """Constructs a TensorFlowDataset object from TensorFlow data, optional targets, and source.

    If the source is path like, then this will construct a DatasetSource object from the source
    path. Otherwise, the source is assumed to be a DatasetSource object.

    Args:
        features: A TensorFlow dataset or tensor of features.
        source: The source from which the data was derived, e.g. a filesystem
            path, an S3 URI, an HTTPS URL, a delta table name with version, or
            spark table etc. If source is not a path like string,
            pass in a DatasetSource object directly. If no source is specified,
            a CodeDatasetSource is used, which will source information from the run
            context.
        targets: A TensorFlow dataset or tensor of targets. Optional.
        name: The name of the dataset. If unspecified, a name is generated.
        digest: A dataset digest (hash). If unspecified, a digest is computed
            automatically.
    """
    from mlflow.data.code_dataset_source import CodeDatasetSource
    from mlflow.data.dataset_source_registry import resolve_dataset_source
    from mlflow.tracking.context import registry

    if source is not None:
        if isinstance(source, DatasetSource):
            resolved_source = source
        else:
            resolved_source = resolve_dataset_source(
                source,
            )
    else:
        context_tags = registry.resolve_tags()
        resolved_source = CodeDatasetSource(tags=context_tags)
    return TensorFlowDataset(
        features=features, source=resolved_source, targets=targets, name=name, digest=digest
    )
```

--------------------------------------------------------------------------------

---[FILE: uc_volume_dataset_source.py]---
Location: mlflow-master/mlflow/data/uc_volume_dataset_source.py

```python
import logging
from typing import Any

from mlflow.data.dataset_source import DatasetSource
from mlflow.exceptions import MlflowException

_logger = logging.getLogger(__name__)


class UCVolumeDatasetSource(DatasetSource):
    """Represents the source of a dataset stored in Databricks Unified Catalog Volume.

    If you are using a delta table, please use `mlflow.data.delta_dataset_source.DeltaDatasetSource`
    instead. This `UCVolumeDatasetSource` does not provide loading function, and is mostly useful
    when you are logging a `mlflow.data.meta_dataset.MetaDataset` to MLflow, i.e., you want
    to log the source of dataset to MLflow without loading the dataset.

    Args:
        path: the UC path of your data. It should be a valid UC path following the pattern
            "/Volumes/{catalog}/{schema}/{volume}/{file_path}". For example,
            "/Volumes/MyCatalog/MySchema/MyVolume/MyFile.json".
    """

    def __init__(self, path: str):
        self.path = path
        self._verify_uc_path_is_valid()

    def _verify_uc_path_is_valid(self):
        """Verify if the path exists in Databricks Unified Catalog."""
        try:
            from databricks.sdk import WorkspaceClient

            w = WorkspaceClient()
        except ImportError:
            _logger.warning(
                "Cannot verify the path of `UCVolumeDatasetSource` because of missing"
                "`databricks-sdk`. Please install `databricks-sdk` via "
                "`pip install -U databricks-sdk`. This does not block creating "
                "`UCVolumeDatasetSource`, but your `UCVolumeDatasetSource` might be invalid."
            )
            return
        except Exception:
            _logger.warning(
                "Cannot verify the path of `UCVolumeDatasetSource` due to a connection failure "
                "with Databricks workspace. Please run `mlflow.login()` to log in to Databricks. "
                "This does not block creating `UCVolumeDatasetSource`, but your "
                "`UCVolumeDatasetSource` might be invalid."
            )
            return

        try:
            # Check if `self.path` points to a valid UC file.
            w.files.get_metadata(self.path)
        except Exception:
            try:
                # Check if `self.path` points to a valid UC directory.
                w.files.get_directory_metadata(self.path)
                # Append a slash to `self.path` to indicate it's a directory.
                self.path += "/" if not self.path.endswith("/") else ""
            except Exception:
                # Neither file nor directory exists, we throw an exception.
                raise MlflowException(f"{self.path} does not exist in Databricks Unified Catalog.")

    @staticmethod
    def _get_source_type() -> str:
        return "uc_volume"

    @staticmethod
    def _can_resolve(raw_source: Any):
        raise NotImplementedError

    @classmethod
    def _resolve(cls, raw_source: str):
        raise NotImplementedError

    def to_dict(self) -> dict[Any, Any]:
        return {"path": self.path}

    @classmethod
    def from_dict(cls, source_dict: dict[Any, Any]) -> "UCVolumeDatasetSource":
        return cls(**source_dict)
```

--------------------------------------------------------------------------------

````
