---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 239
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 239 of 991)

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

---[FILE: dataset_source_registry.py]---
Location: mlflow-master/mlflow/data/dataset_source_registry.py

```python
import warnings
from typing import Any

from mlflow.data.dataset_source import DatasetSource
from mlflow.data.http_dataset_source import HTTPDatasetSource
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import RESOURCE_DOES_NOT_EXIST
from mlflow.utils.plugins import get_entry_points


class DatasetSourceRegistry:
    def __init__(self):
        self.sources = []

    def register(self, source: DatasetSource):
        """Registers a DatasetSource for use with MLflow Tracking.

        Args:
            source: The DatasetSource to register.
        """
        self.sources.append(source)

    def register_entrypoints(self):
        """
        Registers dataset sources defined as Python entrypoints. For reference, see
        https://mlflow.org/docs/latest/plugins.html#defining-a-plugin.
        """
        for entrypoint in get_entry_points("mlflow.dataset_source"):
            try:
                self.register(entrypoint.load())
            except (AttributeError, ImportError) as exc:
                warnings.warn(
                    "Failure attempting to register dataset constructor"
                    + f' "{entrypoint}": {exc}',
                    stacklevel=2,
                )

    def resolve(
        self, raw_source: Any, candidate_sources: list[DatasetSource] | None = None
    ) -> DatasetSource:
        """Resolves a raw source object, such as a string URI, to a DatasetSource for use with
        MLflow Tracking.

        Args:
            raw_source: The raw source, e.g. a string like "s3://mybucket/path/to/iris/data" or a
                HuggingFace :py:class:`datasets.Dataset` object.
            candidate_sources: A list of DatasetSource classes to consider as potential sources
                when resolving the raw source. Subclasses of the specified candidate sources are
                also considered. If unspecified, all registered sources are considered.

        Raises:
            MlflowException: If no DatasetSource class can resolve the raw source.

        Returns:
            The resolved DatasetSource.
        """
        matching_sources = []
        for source in self.sources:
            if candidate_sources and not any(
                issubclass(source, candidate_src) for candidate_src in candidate_sources
            ):
                continue
            try:
                if source._can_resolve(raw_source):
                    matching_sources.append(source)
            except Exception as e:
                warnings.warn(
                    f"Failed to determine whether {source.__name__} can resolve source"
                    f" information for '{raw_source}'. Exception: {e}",
                    stacklevel=2,
                )
                continue

        if len(matching_sources) > 1:
            source_class_names_str = ", ".join([source.__name__ for source in matching_sources])
            warnings.warn(
                f"The specified dataset source can be interpreted in multiple ways:"
                f" {source_class_names_str}. MLflow will assume that this is a"
                f" {matching_sources[-1].__name__} source.",
                stacklevel=2,
            )

        for matching_source in reversed(matching_sources):
            try:
                return matching_source._resolve(raw_source)
            except Exception as e:
                warnings.warn(
                    f"Encountered an unexpected error while using {matching_source.__name__} to"
                    f" resolve source information for '{raw_source}'. Exception: {e}",
                    stacklevel=2,
                )
                continue

        raise MlflowException(
            f"Could not find a source information resolver for the specified"
            f" dataset source: {raw_source}.",
            RESOURCE_DOES_NOT_EXIST,
        )

    def get_source_from_json(self, source_json: str, source_type: str) -> DatasetSource:
        """Parses and returns a DatasetSource object from its JSON representation.

        Args:
            source_json: The JSON representation of the DatasetSource.
            source_type: The string type of the DatasetSource, which indicates how to parse the
                source JSON.
        """
        for source in reversed(self.sources):
            if source._get_source_type() == source_type:
                return source.from_json(source_json)

        raise MlflowException(
            f"Could not parse dataset source from JSON due to unrecognized"
            f" source type: {source_type}.",
            RESOURCE_DOES_NOT_EXIST,
        )


def register_dataset_source(source: DatasetSource):
    """Registers a DatasetSource for use with MLflow Tracking.

    Args:
        source: The DatasetSource to register.
    """
    _dataset_source_registry.register(source)


def resolve_dataset_source(
    raw_source: Any, candidate_sources: list[DatasetSource] | None = None
) -> DatasetSource:
    """Resolves a raw source object, such as a string URI, to a DatasetSource for use with
    MLflow Tracking.

    Args:
        raw_source: The raw source, e.g. a string like "s3://mybucket/path/to/iris/data" or a
            HuggingFace :py:class:`datasets.Dataset` object.
        candidate_sources: A list of DatasetSource classes to consider as potential sources
            when resolving the raw source. Subclasses of the specified candidate
            sources are also considered. If unspecified, all registered sources
            are considered.

    Raises:
        MlflowException: If no DatasetSource class can resolve the raw source.

    Returns:
        The resolved DatasetSource.
    """
    return _dataset_source_registry.resolve(
        raw_source=raw_source, candidate_sources=candidate_sources
    )


def get_dataset_source_from_json(source_json: str, source_type: str) -> DatasetSource:
    """Parses and returns a DatasetSource object from its JSON representation.

    Args:
        source_json: The JSON representation of the DatasetSource.
        source_type: The string type of the DatasetSource, which indicates how to parse the
            source JSON.
    """
    return _dataset_source_registry.get_source_from_json(
        source_json=source_json, source_type=source_type
    )


def get_registered_sources() -> list[DatasetSource]:
    """Obtains the registered dataset sources.

    Returns:
        A list of registered dataset sources.

    """
    return _dataset_source_registry.sources


# NB: The ordering here is important. The last dataset source to be registered takes precedence
# when resolving dataset information for a raw source (e.g. a string like "s3://mybucket/my/path").
# Dataset sources derived from artifact repositories are the most generic / provide the most
# general information about dataset source locations, so they are registered first. More specific
# source information is provided by specialized dataset platform sources like
# HuggingFaceDatasetSource, so these sources are registered next. Finally, externally-defined
# dataset sources are registered last because externally-defined behavior should take precedence
# over any internally-defined generic behavior
_dataset_source_registry = DatasetSourceRegistry()

# Register artifact sources first (they should take lower precedence)
from mlflow.data.artifact_dataset_sources import register_artifact_dataset_sources

register_artifact_dataset_sources()

_dataset_source_registry.register(HTTPDatasetSource)
_dataset_source_registry.register_entrypoints()

try:
    from mlflow.data.huggingface_dataset_source import HuggingFaceDatasetSource

    _dataset_source_registry.register(HuggingFaceDatasetSource)
except ImportError:
    pass
try:
    from mlflow.data.spark_dataset_source import SparkDatasetSource

    _dataset_source_registry.register(SparkDatasetSource)
except ImportError:
    pass
try:
    from mlflow.data.delta_dataset_source import DeltaDatasetSource

    _dataset_source_registry.register(DeltaDatasetSource)
except ImportError:
    pass
try:
    from mlflow.data.code_dataset_source import CodeDatasetSource

    _dataset_source_registry.register(CodeDatasetSource)
except ImportError:
    pass
try:
    from mlflow.data.uc_volume_dataset_source import UCVolumeDatasetSource

    _dataset_source_registry.register(UCVolumeDatasetSource)
except ImportError:
    pass
try:
    from mlflow.genai.datasets.databricks_evaluation_dataset_source import (
        DatabricksEvaluationDatasetSource,
        DatabricksUCTableDatasetSource,
    )

    _dataset_source_registry.register(DatabricksEvaluationDatasetSource)
    _dataset_source_registry.register(DatabricksUCTableDatasetSource)
except ImportError:
    pass
```

--------------------------------------------------------------------------------

---[FILE: delta_dataset_source.py]---
Location: mlflow-master/mlflow/data/delta_dataset_source.py

```python
import logging
from typing import Any

from mlflow.data.dataset_source import DatasetSource
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_managed_catalog_messages_pb2 import (
    GetTable,
    GetTableResponse,
)
from mlflow.protos.databricks_managed_catalog_service_pb2 import DatabricksUnityCatalogService
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE
from mlflow.utils._spark_utils import _get_active_spark_session
from mlflow.utils._unity_catalog_utils import get_full_name_from_sc
from mlflow.utils.databricks_utils import get_databricks_host_creds
from mlflow.utils.proto_json_utils import message_to_json
from mlflow.utils.rest_utils import (
    _REST_API_PATH_PREFIX,
    call_endpoint,
    extract_api_info_for_service,
)
from mlflow.utils.string_utils import _backtick_quote

DATABRICKS_HIVE_METASTORE_NAME = "hive_metastore"
# these two catalog names both points to the workspace local default HMS (hive metastore).
DATABRICKS_LOCAL_METASTORE_NAMES = [DATABRICKS_HIVE_METASTORE_NAME, "spark_catalog"]
# samples catalog is managed by databricks for hosting public dataset like NYC taxi dataset.
# it is neither a UC nor local metastore catalog
DATABRICKS_SAMPLES_CATALOG_NAME = "samples"

_logger = logging.getLogger(__name__)


class DeltaDatasetSource(DatasetSource):
    """
    Represents the source of a dataset stored at in a delta table.
    """

    def __init__(
        self,
        path: str | None = None,
        delta_table_name: str | None = None,
        delta_table_version: int | None = None,
        delta_table_id: str | None = None,
    ):
        if (path, delta_table_name).count(None) != 1:
            raise MlflowException(
                'Must specify exactly one of "path" or "table_name"',
                INVALID_PARAMETER_VALUE,
            )
        self._path = path
        if delta_table_name is not None:
            self._delta_table_name = get_full_name_from_sc(
                delta_table_name, _get_active_spark_session()
            )
        else:
            self._delta_table_name = delta_table_name
        self._delta_table_version = delta_table_version
        self._delta_table_id = delta_table_id

    @staticmethod
    def _get_source_type() -> str:
        return "delta_table"

    def load(self, **kwargs):
        """
        Loads the dataset source as a Delta Dataset Source.

        Returns:
            An instance of ``pyspark.sql.DataFrame``.
        """
        from pyspark.sql import SparkSession

        spark = SparkSession.builder.getOrCreate()

        spark_read_op = spark.read.format("delta")
        if self._delta_table_version is not None:
            spark_read_op = spark_read_op.option("versionAsOf", self._delta_table_version)

        if self._path:
            return spark_read_op.load(self._path)
        else:
            backticked_delta_table_name = ".".join(
                map(_backtick_quote, self._delta_table_name.split("."))
            )
            return spark_read_op.table(backticked_delta_table_name)

    @property
    def path(self) -> str | None:
        return self._path

    @property
    def delta_table_name(self) -> str | None:
        return self._delta_table_name

    @property
    def delta_table_id(self) -> str | None:
        return self._delta_table_id

    @property
    def delta_table_version(self) -> int | None:
        return self._delta_table_version

    @staticmethod
    def _can_resolve(raw_source: Any):
        return False

    @classmethod
    def _resolve(cls, raw_source: str) -> "DeltaDatasetSource":
        raise NotImplementedError

    # check if table is in the Databricks Unity Catalog
    def _is_databricks_uc_table(self):
        if self._delta_table_name is not None:
            catalog_name = self._delta_table_name.split(".", 1)[0]
            return (
                catalog_name not in DATABRICKS_LOCAL_METASTORE_NAMES
                and catalog_name != DATABRICKS_SAMPLES_CATALOG_NAME
            )
        else:
            return False

    def _lookup_table_id(self, table_name):
        try:
            req_body = message_to_json(GetTable(full_name_arg=table_name))
            _METHOD_TO_INFO = extract_api_info_for_service(
                DatabricksUnityCatalogService, _REST_API_PATH_PREFIX
            )
            db_creds = get_databricks_host_creds()
            endpoint, method = _METHOD_TO_INFO[GetTable]
            # We need to replace the full_name_arg in the endpoint definition with
            # the actual table name for the REST API to work.
            final_endpoint = endpoint.replace("{full_name_arg}", table_name)
            resp = call_endpoint(
                host_creds=db_creds,
                endpoint=final_endpoint,
                method=method,
                json_body=req_body,
                response_proto=GetTableResponse,
            )
            return resp.table_id
        except Exception:
            return None

    def to_dict(self) -> dict[Any, Any]:
        info = {}
        if self._path:
            info["path"] = self._path
        if self._delta_table_name:
            info["delta_table_name"] = self._delta_table_name
        if self._delta_table_version:
            info["delta_table_version"] = self._delta_table_version
        if self._is_databricks_uc_table():
            info["is_databricks_uc_table"] = True
            if self._delta_table_id:
                info["delta_table_id"] = self._delta_table_id
            else:
                info["delta_table_id"] = self._lookup_table_id(self._delta_table_name)
        return info

    @classmethod
    def from_dict(cls, source_dict: dict[Any, Any]) -> "DeltaDatasetSource":
        return cls(
            path=source_dict.get("path"),
            delta_table_name=source_dict.get("delta_table_name"),
            delta_table_version=source_dict.get("delta_table_version"),
            delta_table_id=source_dict.get("delta_table_id"),
        )
```

--------------------------------------------------------------------------------

---[FILE: digest_utils.py]---
Location: mlflow-master/mlflow/data/digest_utils.py

```python
import hashlib
from typing import Any

from packaging.version import Version

from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE

MAX_ROWS = 10000


def compute_pandas_digest(df) -> str:
    """Computes a digest for the given Pandas DataFrame.

    Args:
        df: A Pandas DataFrame.

    Returns:
        A string digest.
    """
    import numpy as np
    import pandas as pd

    # trim to max rows
    trimmed_df = df.head(MAX_ROWS)

    # keep string and number columns, drop other column types
    if Version(pd.__version__) >= Version("2.1.0"):
        string_columns = trimmed_df.columns[(df.map(type) == str).all(0)]
    else:
        string_columns = trimmed_df.columns[(df.applymap(type) == str).all(0)]
    numeric_columns = trimmed_df.select_dtypes(include=[np.number]).columns

    desired_columns = string_columns.union(numeric_columns)
    trimmed_df = trimmed_df[desired_columns]

    return get_normalized_md5_digest(
        [
            pd.util.hash_pandas_object(trimmed_df).values,
            np.int64(len(df)),
        ]
        + [str(x).encode() for x in df.columns]
    )


def compute_numpy_digest(features, targets=None) -> str:
    """Computes a digest for the given numpy array.

    Args:
        features: A numpy array containing dataset features.
        targets: A numpy array containing dataset targets. Optional.

    Returns:
        A string digest.
    """
    import numpy as np
    import pandas as pd

    hashable_elements = []

    def hash_array(array):
        flattened_array = array.flatten()
        trimmed_array = flattened_array[0:MAX_ROWS]
        try:
            hashable_elements.append(pd.util.hash_array(trimmed_array))
        except TypeError:
            hashable_elements.append(np.int64(trimmed_array.size))

        # hash full array dimensions
        hashable_elements.extend(np.int64(x) for x in array.shape)

    def hash_dict_of_arrays(array_dict):
        for key in sorted(array_dict.keys()):
            hash_array(array_dict[key])

    for item in [features, targets]:
        if item is None:
            continue
        if isinstance(item, dict):
            hash_dict_of_arrays(item)
        else:
            hash_array(item)

    return get_normalized_md5_digest(hashable_elements)


def get_normalized_md5_digest(elements: list[Any]) -> str:
    """Computes a normalized digest for a list of hashable elements.

    Args:
        elements: A list of hashable elements for inclusion in the md5 digest.

    Returns:
        An 8-character, truncated md5 digest.
    """

    if not elements:
        raise MlflowException(
            "No hashable elements were provided for md5 digest creation",
            INVALID_PARAMETER_VALUE,
        )

    md5 = hashlib.md5(usedforsecurity=False)
    for element in elements:
        md5.update(element)

    return md5.hexdigest()[:8]
```

--------------------------------------------------------------------------------

---[FILE: evaluation_dataset.py]---
Location: mlflow-master/mlflow/data/evaluation_dataset.py

```python
import hashlib
import json
import logging
import math
import struct
import sys

from packaging.version import Version

import mlflow
from mlflow.entities import RunTag
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE
from mlflow.utils.string_utils import generate_feature_name_if_not_string

try:
    # `numpy` and `pandas` are not required for `mlflow-skinny`.
    import numpy as np
    import pandas as pd
except ImportError:
    pass

_logger = logging.getLogger(__name__)


def _hash_uint64_ndarray_as_bytes(array):
    assert len(array.shape) == 1
    # see struct pack format string https://docs.python.org/3/library/struct.html#format-strings
    return struct.pack(f">{array.size}Q", *array)


def _is_empty_list_or_array(data):
    if isinstance(data, list):
        return len(data) == 0
    elif isinstance(data, np.ndarray):
        return data.size == 0
    return False


def _is_array_has_dict(nd_array):
    if _is_empty_list_or_array(nd_array):
        return False

    # It is less likely the array or list contains heterogeneous elements, so just checking the
    # first element to avoid performance overhead.
    elm = nd_array.item(0)
    if isinstance(elm, (list, np.ndarray)):
        return _is_array_has_dict(elm)
    elif isinstance(elm, dict):
        return True

    return False


def _hash_array_of_dict_as_bytes(data):
    # NB: If an array or list contains dictionary element, it can't be hashed with
    # pandas.util.hash_array. Hence we need to manually hash the elements here. This is
    # particularly for the LLM use case where the input can be a list of dictionary
    # (chat/completion payloads), so doesn't handle more complex case like nested lists.
    result = b""
    for elm in data:
        if isinstance(elm, (list, np.ndarray)):
            result += _hash_array_of_dict_as_bytes(elm)
        elif isinstance(elm, dict):
            result += _hash_dict_as_bytes(elm)
        else:
            result += _hash_data_as_bytes(elm)
    return result


def _hash_ndarray_as_bytes(nd_array):
    if not isinstance(nd_array, np.ndarray):
        nd_array = np.array(nd_array)

    if _is_array_has_dict(nd_array):
        return _hash_array_of_dict_as_bytes(nd_array)

    return _hash_uint64_ndarray_as_bytes(
        pd.util.hash_array(nd_array.flatten(order="C"))
    ) + _hash_uint64_ndarray_as_bytes(np.array(nd_array.shape, dtype="uint64"))


def _hash_data_as_bytes(data):
    try:
        if isinstance(data, (list, np.ndarray)):
            return _hash_ndarray_as_bytes(data)
        if isinstance(data, dict):
            return _hash_dict_as_bytes(data)
        if np.isscalar(data):
            return _hash_uint64_ndarray_as_bytes(pd.util.hash_array(np.array([data])))
    except Exception:
        pass
    # Skip unsupported types by returning an empty byte string
    return b""


def _hash_dict_as_bytes(data_dict):
    result = _hash_ndarray_as_bytes(list(data_dict.keys()))
    try:
        result += _hash_ndarray_as_bytes(list(data_dict.values()))
    # If the values containing non-hashable objects, we will hash the values recursively.
    except Exception:
        for value in data_dict.values():
            result += _hash_data_as_bytes(value)
    return result


def _hash_array_like_obj_as_bytes(data):
    """
    Helper method to convert pandas dataframe/numpy array/list into bytes for
    MD5 calculation purpose.
    """
    if isinstance(data, pd.DataFrame):
        # add checking `'pyspark' in sys.modules` to avoid importing pyspark when user
        # run code not related to pyspark.
        if "pyspark" in sys.modules:
            from pyspark.ml.linalg import Vector as spark_vector_type
        else:
            spark_vector_type = None

        def _hash_array_like_element_as_bytes(v):
            if spark_vector_type is not None:
                if isinstance(v, spark_vector_type):
                    return _hash_ndarray_as_bytes(v.toArray())
            if isinstance(v, (dict, list, np.ndarray)):
                return _hash_data_as_bytes(v)

            try:
                # Attempt to hash the value, if it fails, return an empty byte string
                pd.util.hash_array(np.array([v]))
                return v
            except TypeError:
                return b""  # Skip unhashable types by returning an empty byte string

        if Version(pd.__version__) >= Version("2.1.0"):
            data = data.map(_hash_array_like_element_as_bytes)
        else:
            data = data.applymap(_hash_array_like_element_as_bytes)
        return _hash_uint64_ndarray_as_bytes(pd.util.hash_pandas_object(data))
    elif isinstance(data, np.ndarray) and len(data) > 0 and isinstance(data[0], list):
        # convert numpy array of lists into numpy array of the string representation of the lists
        # because lists are not hashable
        hashable = np.array(str(val) for val in data)
        return _hash_ndarray_as_bytes(hashable)
    elif isinstance(data, np.ndarray) and len(data) > 0 and isinstance(data[0], np.ndarray):
        # convert numpy array of numpy arrays into 2d numpy arrays
        # because numpy array of numpy arrays are not hashable
        hashable = np.array(data.tolist())
        return _hash_ndarray_as_bytes(hashable)
    elif isinstance(data, np.ndarray):
        return _hash_ndarray_as_bytes(data)
    elif isinstance(data, list):
        return _hash_ndarray_as_bytes(np.array(data))
    else:
        raise ValueError("Unsupported data type.")


def _gen_md5_for_arraylike_obj(md5_gen, data):
    """
    Helper method to generate MD5 hash array-like object, the MD5 will calculate over:
     - array length
     - first NUM_SAMPLE_ROWS_FOR_HASH rows content
     - last NUM_SAMPLE_ROWS_FOR_HASH rows content
    """
    len_bytes = _hash_uint64_ndarray_as_bytes(np.array([len(data)], dtype="uint64"))
    md5_gen.update(len_bytes)
    if len(data) < EvaluationDataset.NUM_SAMPLE_ROWS_FOR_HASH * 2:
        md5_gen.update(_hash_array_like_obj_as_bytes(data))
    else:
        if isinstance(data, pd.DataFrame):
            # Access rows of pandas Df with iloc
            head_rows = data.iloc[: EvaluationDataset.NUM_SAMPLE_ROWS_FOR_HASH]
            tail_rows = data.iloc[-EvaluationDataset.NUM_SAMPLE_ROWS_FOR_HASH :]
        else:
            head_rows = data[: EvaluationDataset.NUM_SAMPLE_ROWS_FOR_HASH]
            tail_rows = data[-EvaluationDataset.NUM_SAMPLE_ROWS_FOR_HASH :]
        md5_gen.update(_hash_array_like_obj_as_bytes(head_rows))
        md5_gen.update(_hash_array_like_obj_as_bytes(tail_rows))


def convert_data_to_mlflow_dataset(data, targets=None, predictions=None, name=None):
    """Convert input data to mlflow dataset."""
    supported_dataframe_types = [pd.DataFrame]
    if "pyspark" in sys.modules:
        from mlflow.utils.spark_utils import get_spark_dataframe_type

        spark_df_type = get_spark_dataframe_type()
        supported_dataframe_types.append(spark_df_type)

    if predictions is not None:
        _validate_dataset_type_supports_predictions(
            data=data, supported_predictions_dataset_types=supported_dataframe_types
        )

    if isinstance(data, list):
        # If the list is flat, we assume each element is an independent sample.
        if not isinstance(data[0], (list, np.ndarray)):
            data = [[elm] for elm in data]

        return mlflow.data.from_numpy(
            np.array(data), targets=np.array(targets) if targets else None, name=name
        )
    elif isinstance(data, np.ndarray):
        return mlflow.data.from_numpy(data, targets=targets, name=name)
    elif isinstance(data, pd.DataFrame):
        return mlflow.data.from_pandas(df=data, targets=targets, predictions=predictions, name=name)
    elif "pyspark" in sys.modules and isinstance(data, spark_df_type):
        return mlflow.data.from_spark(df=data, targets=targets, predictions=predictions, name=name)
    else:
        # Cannot convert to mlflow dataset, return original data.
        _logger.info(
            "Cannot convert input data to `evaluate()` to an mlflow dataset, input must be a list, "
            f"a numpy array, a panda Dataframe or a spark Dataframe, but received {type(data)}."
        )
        return data


def _validate_dataset_type_supports_predictions(data, supported_predictions_dataset_types):
    """
    Validate that the dataset type supports a user-specified "predictions" column.
    """
    if not any(isinstance(data, sdt) for sdt in supported_predictions_dataset_types):
        raise MlflowException(
            message=(
                "If predictions is specified, data must be one of the following types, or an"
                " MLflow Dataset that represents one of the following types:"
                f" {supported_predictions_dataset_types}."
            ),
            error_code=INVALID_PARAMETER_VALUE,
        )


class EvaluationDataset:
    """
    An input dataset for model evaluation. This is intended for use with the
    :py:func:`mlflow.models.evaluate()`
    API.
    """

    NUM_SAMPLE_ROWS_FOR_HASH = 5
    SPARK_DATAFRAME_LIMIT = 10000

    def __init__(
        self,
        data,
        *,
        targets=None,
        name=None,
        path=None,
        feature_names=None,
        predictions=None,
        digest=None,
    ):
        """
        The values of the constructor arguments comes from the `evaluate` call.
        """
        if name is not None and '"' in name:
            raise MlflowException(
                message=f'Dataset name cannot include a double quote (") but got {name}',
                error_code=INVALID_PARAMETER_VALUE,
            )
        if path is not None and '"' in path:
            raise MlflowException(
                message=f'Dataset path cannot include a double quote (") but got {path}',
                error_code=INVALID_PARAMETER_VALUE,
            )

        self._user_specified_name = name
        self._path = path
        self._hash = None
        self._supported_dataframe_types = (pd.DataFrame,)
        self._spark_df_type = None
        self._labels_data = None
        self._targets_name = None
        self._has_targets = False
        self._predictions_data = None
        self._predictions_name = None
        self._has_predictions = predictions is not None
        self._digest = digest

        try:
            # add checking `'pyspark' in sys.modules` to avoid importing pyspark when user
            # run code not related to pyspark.
            if "pyspark" in sys.modules:
                from mlflow.utils.spark_utils import get_spark_dataframe_type

                spark_df_type = get_spark_dataframe_type()
                self._supported_dataframe_types = (pd.DataFrame, spark_df_type)
                self._spark_df_type = spark_df_type
        except ImportError:
            pass

        if feature_names is not None and len(set(feature_names)) < len(list(feature_names)):
            raise MlflowException(
                message="`feature_names` argument must be a list containing unique feature names.",
                error_code=INVALID_PARAMETER_VALUE,
            )

        if self._has_predictions:
            _validate_dataset_type_supports_predictions(
                data=data,
                supported_predictions_dataset_types=self._supported_dataframe_types,
            )

        has_targets = targets is not None
        if has_targets:
            self._has_targets = True
        if isinstance(data, (np.ndarray, list)):
            if has_targets and not isinstance(targets, (np.ndarray, list)):
                raise MlflowException(
                    message="If data is a numpy array or list of evaluation features, "
                    "`targets` argument must be a numpy array or list of evaluation labels.",
                    error_code=INVALID_PARAMETER_VALUE,
                )

            shape_message = (
                "If the `data` argument is a numpy array, it must be a 2-dimensional "
                "array, with the second dimension representing the number of features. If the "
                "`data` argument is a list, each of its elements must be a feature array of "
                "the numpy array or list, and all elements must have the same length."
            )

            if isinstance(data, list):
                try:
                    data = np.array(data)
                except ValueError as e:
                    raise MlflowException(
                        message=shape_message, error_code=INVALID_PARAMETER_VALUE
                    ) from e

            if len(data.shape) != 2:
                raise MlflowException(
                    message=shape_message,
                    error_code=INVALID_PARAMETER_VALUE,
                )

            self._features_data = data
            if has_targets:
                self._labels_data = (
                    targets if isinstance(targets, np.ndarray) else np.array(targets)
                )

                if len(self._features_data) != len(self._labels_data):
                    raise MlflowException(
                        message="The input features example rows must be the same length "
                        "with labels array.",
                        error_code=INVALID_PARAMETER_VALUE,
                    )

            num_features = data.shape[1]

            if feature_names is not None:
                feature_names = list(feature_names)
                if num_features != len(feature_names):
                    raise MlflowException(
                        message="feature name list must be the same length with feature data.",
                        error_code=INVALID_PARAMETER_VALUE,
                    )
                self._feature_names = feature_names
            else:
                self._feature_names = [
                    f"feature_{str(i + 1).zfill(math.ceil(math.log10(num_features + 1)))}"
                    for i in range(num_features)
                ]
        elif isinstance(data, self._supported_dataframe_types):
            if has_targets and not isinstance(targets, str):
                raise MlflowException(
                    message="If data is a Pandas DataFrame or Spark DataFrame, `targets` argument "
                    "must be the name of the column which contains evaluation labels in the `data` "
                    "dataframe.",
                    error_code=INVALID_PARAMETER_VALUE,
                )
            if self._spark_df_type and isinstance(data, self._spark_df_type):
                if data.count() > EvaluationDataset.SPARK_DATAFRAME_LIMIT:
                    _logger.warning(
                        "Specified Spark DataFrame is too large for model evaluation. Only "
                        f"the first {EvaluationDataset.SPARK_DATAFRAME_LIMIT} rows will be used. "
                        "If you want evaluate on the whole spark dataframe, please manually call "
                        "`spark_dataframe.toPandas()`."
                    )
                data = data.limit(EvaluationDataset.SPARK_DATAFRAME_LIMIT).toPandas()

            if has_targets:
                self._labels_data = data[targets].to_numpy()
                self._targets_name = targets

            if self._has_predictions:
                self._predictions_data = data[predictions].to_numpy()
                self._predictions_name = predictions

            if feature_names is not None:
                self._features_data = data[list(feature_names)]
                self._feature_names = feature_names
            else:
                features_data = data

                if has_targets:
                    features_data = features_data.drop(targets, axis=1, inplace=False)

                if self._has_predictions:
                    features_data = features_data.drop(predictions, axis=1, inplace=False)

                self._features_data = features_data
                self._feature_names = [
                    generate_feature_name_if_not_string(c) for c in self._features_data.columns
                ]
        else:
            raise MlflowException(
                message="The data argument must be a numpy array, a list or a Pandas DataFrame, or "
                "spark DataFrame if pyspark package installed.",
                error_code=INVALID_PARAMETER_VALUE,
            )

        # generate dataset hash
        md5_gen = hashlib.md5(usedforsecurity=False)
        _gen_md5_for_arraylike_obj(md5_gen, self._features_data)
        if self._labels_data is not None:
            _gen_md5_for_arraylike_obj(md5_gen, self._labels_data)
        if self._predictions_data is not None:
            _gen_md5_for_arraylike_obj(md5_gen, self._predictions_data)
        md5_gen.update(",".join(list(map(str, self._feature_names))).encode("UTF-8"))

        self._hash = md5_gen.hexdigest()

    @property
    def feature_names(self):
        return self._feature_names

    @property
    def features_data(self):
        """
        return features data as a numpy array or a pandas DataFrame.
        """
        return self._features_data

    @property
    def labels_data(self):
        """
        return labels data as a numpy array
        """
        return self._labels_data

    @property
    def has_targets(self):
        """
        Returns True if the dataset has targets, False otherwise.
        """
        return self._has_targets

    @property
    def targets_name(self):
        """
        return targets name
        """
        return self._targets_name

    @property
    def predictions_data(self):
        """
        return labels data as a numpy array
        """
        return self._predictions_data

    @property
    def has_predictions(self):
        """
        Returns True if the dataset has targets, False otherwise.
        """
        return self._has_predictions

    @property
    def predictions_name(self):
        """
        return predictions name
        """
        return self._predictions_name

    @property
    def name(self):
        """
        Dataset name, which is specified dataset name or the dataset hash if user don't specify
        name.
        """
        return self._user_specified_name if self._user_specified_name is not None else self.hash

    @property
    def path(self):
        """
        Dataset path
        """
        return self._path

    @property
    def hash(self):
        """
        Dataset hash, includes hash on first 20 rows and last 20 rows.
        """
        return self._hash

    @property
    def _metadata(self):
        """
        Return dataset metadata containing name, hash, and optional path.
        """
        metadata = {
            "name": self.name,
            "hash": self.hash,
        }
        if self.path is not None:
            metadata["path"] = self.path
        return metadata

    @property
    def digest(self):
        """
        Return the digest of the dataset.
        """
        return self._digest

    def _log_dataset_tag(self, client, run_id, model_uuid):
        """
        Log dataset metadata as a tag "mlflow.datasets", if the tag already exists, it will
        append current dataset metadata into existing tag content.
        """
        existing_dataset_metadata_str = client.get_run(run_id).data.tags.get(
            "mlflow.datasets", "[]"
        )
        dataset_metadata_list = json.loads(existing_dataset_metadata_str)

        for metadata in dataset_metadata_list:
            if (
                metadata["hash"] == self.hash
                and metadata["name"] == self.name
                and metadata["model"] == model_uuid
            ):
                break
        else:
            dataset_metadata_list.append({**self._metadata, "model": model_uuid})

        dataset_metadata_str = json.dumps(dataset_metadata_list, separators=(",", ":"))
        client.log_batch(
            run_id,
            tags=[RunTag("mlflow.datasets", dataset_metadata_str)],
        )

    def __hash__(self):
        return hash(self.hash)

    def __eq__(self, other):
        if not isinstance(other, EvaluationDataset):
            return False

        if isinstance(self._features_data, np.ndarray):
            is_features_data_equal = np.array_equal(self._features_data, other._features_data)
        else:
            is_features_data_equal = self._features_data.equals(other._features_data)

        return (
            is_features_data_equal
            and np.array_equal(self._labels_data, other._labels_data)
            and self.name == other.name
            and self.path == other.path
            and self._feature_names == other._feature_names
        )
```

--------------------------------------------------------------------------------

````
