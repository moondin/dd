---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 240
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 240 of 991)

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

---[FILE: evaluation_dataset_source.py]---
Location: mlflow-master/mlflow/data/evaluation_dataset_source.py

```python
from typing import Any

from mlflow.data.dataset_source import DatasetSource


class EvaluationDatasetSource(DatasetSource):
    """
    Represents the source of an evaluation dataset stored in MLflow's tracking store.
    """

    def __init__(self, dataset_id: str):
        """
        Args:
            dataset_id: The ID of the evaluation dataset.
        """
        self._dataset_id = dataset_id

    @staticmethod
    def _get_source_type() -> str:
        return "mlflow_evaluation_dataset"

    def load(self) -> Any:
        """
        Loads the evaluation dataset from the tracking store using current tracking URI.

        Returns:
            The EvaluationDataset entity.
        """
        from mlflow.tracking._tracking_service.utils import _get_store

        store = _get_store()
        return store.get_evaluation_dataset(self._dataset_id)

    @staticmethod
    def _can_resolve(raw_source: Any) -> bool:
        """
        Determines if the raw source is an evaluation dataset ID.
        """
        if isinstance(raw_source, str):
            return raw_source.startswith("d-") and len(raw_source) == 34
        return False

    @classmethod
    def _resolve(cls, raw_source: Any) -> "EvaluationDatasetSource":
        """
        Creates an EvaluationDatasetSource from a dataset ID.
        """
        if not cls._can_resolve(raw_source):
            raise ValueError(f"Cannot resolve {raw_source} as an evaluation dataset ID")

        return cls(dataset_id=raw_source)

    def to_dict(self) -> dict[str, Any]:
        return {
            "dataset_id": self._dataset_id,
        }

    @classmethod
    def from_dict(cls, source_dict: dict[Any, Any]) -> "EvaluationDatasetSource":
        return cls(
            dataset_id=source_dict["dataset_id"],
        )
```

--------------------------------------------------------------------------------

---[FILE: filesystem_dataset_source.py]---
Location: mlflow-master/mlflow/data/filesystem_dataset_source.py

```python
from abc import abstractmethod
from typing import Any

from mlflow.data.dataset_source import DatasetSource


class FileSystemDatasetSource(DatasetSource):
    """
    Represents the source of a dataset stored on a filesystem, e.g. a local UNIX filesystem,
    blob storage services like S3, etc.
    """

    @property
    @abstractmethod
    def uri(self):
        """The URI referring to the dataset source filesystem location.

        Returns:
            The URI referring to the dataset source filesystem location,
            e.g "s3://mybucket/path/to/mydataset", "/tmp/path/to/my/dataset" etc.

        """

    @staticmethod
    @abstractmethod
    def _get_source_type() -> str:
        """
        Returns:
            A string describing the filesystem containing the dataset, e.g. "local", "s3", ...
        """

    @abstractmethod
    def load(self, dst_path=None) -> str:
        """Downloads the dataset source to the local filesystem.

        Args:
            dst_path: Path of the local filesystem destination directory to which to download the
                dataset source. If the directory does not exist, it is created. If
                unspecified, the dataset source is downloaded to a new uniquely-named
                directory on the local filesystem, unless the dataset source already
                exists on the local filesystem, in which case its local path is returned
                directly.

        Returns:
            The path to the downloaded dataset source on the local filesystem.

        """

    @staticmethod
    @abstractmethod
    def _can_resolve(raw_source: Any) -> bool:
        """
        Args:
            raw_source: The raw source, e.g. a string like "s3://mybucket/path/to/iris/data".

        Returns:
            True if this DatasetSource can resolve the raw source, False otherwise.
        """

    @classmethod
    @abstractmethod
    def _resolve(cls, raw_source: Any) -> "FileSystemDatasetSource":
        """
        Args:
            raw_source: The raw source, e.g. a string like "s3://mybucket/path/to/iris/data".
        """

    @abstractmethod
    def to_dict(self) -> dict[Any, Any]:
        """
        Returns:
            A JSON-compatible dictionary representation of the FileSystemDatasetSource.
        """

    @classmethod
    @abstractmethod
    def from_dict(cls, source_dict: dict[Any, Any]) -> "FileSystemDatasetSource":
        """
        Args:
            source_dict: A dictionary representation of the FileSystemDatasetSource.
        """
```

--------------------------------------------------------------------------------

---[FILE: http_dataset_source.py]---
Location: mlflow-master/mlflow/data/http_dataset_source.py

```python
import os
import re
from typing import Any
from urllib.parse import urlparse

from mlflow.data.dataset_source import DatasetSource
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE
from mlflow.utils.file_utils import create_tmp_dir
from mlflow.utils.rest_utils import augmented_raise_for_status, cloud_storage_http_request


def _is_path(filename: str) -> bool:
    """
    Return True if `filename` is a path, False otherwise. For example,
    "foo/bar" is a path, but "bar" is not.
    """
    return os.path.basename(filename) != filename


class HTTPDatasetSource(DatasetSource):
    """
    Represents the source of a dataset stored at a web location and referred to
    by an HTTP or HTTPS URL.
    """

    def __init__(self, url):
        self._url = url

    @property
    def url(self):
        """The HTTP/S URL referring to the dataset source location.

        Returns:
            The HTTP/S URL referring to the dataset source location.

        """
        return self._url

    @staticmethod
    def _get_source_type() -> str:
        return "http"

    def _extract_filename(self, response) -> str:
        """
        Extracts a filename from the Content-Disposition header or the URL's path.
        """
        if content_disposition := response.headers.get("Content-Disposition"):
            for match in re.finditer(r"filename=(.+)", content_disposition):
                filename = match[1].strip("'\"")
                if _is_path(filename):
                    raise MlflowException.invalid_parameter_value(
                        f"Invalid filename in Content-Disposition header: {filename}. "
                        "It must be a file name, not a path."
                    )
                return filename

        # Extract basename from URL if no valid filename in Content-Disposition
        return os.path.basename(urlparse(self.url).path)

    def load(self, dst_path=None) -> str:
        """Downloads the dataset source to the local filesystem.

        Args:
            dst_path: Path of the local filesystem destination directory to which to download the
                dataset source. If the directory does not exist, it is created. If
                unspecified, the dataset source is downloaded to a new uniquely-named
                directory on the local filesystem.

        Returns:
            The path to the downloaded dataset source on the local filesystem.

        """
        resp = cloud_storage_http_request(
            method="GET",
            url=self.url,
            stream=True,
        )
        augmented_raise_for_status(resp)

        basename = self._extract_filename(resp)

        if not basename:
            basename = "dataset_source"

        if dst_path is None:
            dst_path = create_tmp_dir()

        dst_path = os.path.join(dst_path, basename)
        with open(dst_path, "wb") as f:
            chunk_size = 1024 * 1024  # 1 MB
            for chunk in resp.iter_content(chunk_size=chunk_size):
                f.write(chunk)

        return dst_path

    @staticmethod
    def _can_resolve(raw_source: Any) -> bool:
        """
        Args:
            raw_source: The raw source, e.g. a string like "http://mysite/mydata.tar.gz".

        Returns:
            True if this DatasetSource can resolve the raw source, False otherwise.
        """
        if not isinstance(raw_source, str):
            return False

        try:
            parsed_source = urlparse(str(raw_source))
            return parsed_source.scheme in ["http", "https"]
        except Exception:
            return False

    @classmethod
    def _resolve(cls, raw_source: Any) -> "HTTPDatasetSource":
        """
        Args:
            raw_source: The raw source, e.g. a string like "http://mysite/mydata.tar.gz".
        """
        return HTTPDatasetSource(raw_source)

    def to_dict(self) -> dict[Any, Any]:
        """
        Returns:
            A JSON-compatible dictionary representation of the HTTPDatasetSource.
        """
        return {
            "url": self.url,
        }

    @classmethod
    def from_dict(cls, source_dict: dict[Any, Any]) -> "HTTPDatasetSource":
        """
        Args:
            source_dict: A dictionary representation of the HTTPDatasetSource.
        """
        url = source_dict.get("url")
        if url is None:
            raise MlflowException(
                'Failed to parse HTTPDatasetSource. Missing expected key: "url"',
                INVALID_PARAMETER_VALUE,
            )

        return cls(url=url)
```

--------------------------------------------------------------------------------

---[FILE: huggingface_dataset.py]---
Location: mlflow-master/mlflow/data/huggingface_dataset.py

```python
import json
import logging
from functools import cached_property
from typing import TYPE_CHECKING, Any, Mapping, Sequence

from mlflow.data.dataset import Dataset
from mlflow.data.dataset_source import DatasetSource
from mlflow.data.digest_utils import compute_pandas_digest
from mlflow.data.evaluation_dataset import EvaluationDataset
from mlflow.data.huggingface_dataset_source import HuggingFaceDatasetSource
from mlflow.data.pyfunc_dataset_mixin import PyFuncConvertibleDatasetMixin, PyFuncInputsOutputs
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INTERNAL_ERROR, INVALID_PARAMETER_VALUE
from mlflow.types import Schema
from mlflow.types.utils import _infer_schema

_logger = logging.getLogger(__name__)

_MAX_ROWS_FOR_DIGEST_COMPUTATION_AND_SCHEMA_INFERENCE = 10000

if TYPE_CHECKING:
    import datasets


class HuggingFaceDataset(Dataset, PyFuncConvertibleDatasetMixin):
    """
    Represents a HuggingFace dataset for use with MLflow Tracking.
    """

    def __init__(
        self,
        ds: "datasets.Dataset",
        source: HuggingFaceDatasetSource,
        targets: str | None = None,
        name: str | None = None,
        digest: str | None = None,
    ):
        """
        Args:
            ds: A Hugging Face dataset. Must be an instance of `datasets.Dataset`.
                Other types, such as :py:class:`datasets.DatasetDict`, are not supported.
            source: The source of the Hugging Face dataset.
            name: The name of the dataset. E.g. "wiki_train". If unspecified, a name is
                automatically generated.
            digest: The digest (hash, fingerprint) of the dataset. If unspecified, a digest
                is automatically computed.
        """
        if targets is not None and targets not in ds.column_names:
            raise MlflowException(
                f"The specified Hugging Face dataset does not contain the specified targets column"
                f" '{targets}'.",
                INVALID_PARAMETER_VALUE,
            )

        self._ds = ds
        self._targets = targets
        super().__init__(source=source, name=name, digest=digest)

    def _compute_digest(self) -> str:
        """
        Computes a digest for the dataset. Called if the user doesn't supply
        a digest when constructing the dataset.
        """
        df = next(
            self._ds.to_pandas(
                batch_size=_MAX_ROWS_FOR_DIGEST_COMPUTATION_AND_SCHEMA_INFERENCE, batched=True
            )
        )
        return compute_pandas_digest(df)

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
    def ds(self) -> "datasets.Dataset":
        """The Hugging Face ``datasets.Dataset`` instance.

        Returns:
            The Hugging Face ``datasets.Dataset`` instance.

        """
        return self._ds

    @property
    def targets(self) -> str | None:
        """
        The name of the Hugging Face dataset column containing targets (labels) for supervised
        learning.

        Returns:
            The string name of the Hugging Face dataset column containing targets.
        """
        return self._targets

    @property
    def source(self) -> HuggingFaceDatasetSource:
        """Hugging Face dataset source information.

        Returns:
            A :py:class:`mlflow.data.huggingface_dataset_source.HuggingFaceDatasetSource`
        """
        return self._source

    @property
    def profile(self) -> Any | None:
        """
        Summary statistics for the Hugging Face dataset, including the number of rows,
        size, and size in bytes.
        """
        return {
            "num_rows": self._ds.num_rows,
            "dataset_size": self._ds.dataset_size,
            "size_in_bytes": self._ds.size_in_bytes,
        }

    @cached_property
    def schema(self) -> Schema | None:
        """
        The MLflow ColSpec schema of the Hugging Face dataset.
        """
        try:
            df = next(
                self._ds.to_pandas(
                    batch_size=_MAX_ROWS_FOR_DIGEST_COMPUTATION_AND_SCHEMA_INFERENCE, batched=True
                )
            )
            return _infer_schema(df)
        except Exception as e:
            _logger.warning("Failed to infer schema for Hugging Face dataset. Exception: %s", e)
            return None

    def to_pyfunc(self) -> PyFuncInputsOutputs:
        df = self._ds.to_pandas()
        if self._targets is not None:
            if self._targets not in df.columns:
                raise MlflowException(
                    f"Failed to convert Hugging Face dataset to pyfunc inputs and outputs because"
                    f" the pandas representation of the Hugging Face dataset does not contain the"
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
            data=self._ds.to_pandas(),
            targets=self._targets,
            path=path,
            feature_names=feature_names,
            name=self.name,
            digest=self.digest,
        )


def from_huggingface(
    ds,
    path: str | None = None,
    targets: str | None = None,
    data_dir: str | None = None,
    data_files: str | Sequence[str] | Mapping[str, str | Sequence[str]] | None = None,
    revision=None,
    name: str | None = None,
    digest: str | None = None,
    trust_remote_code: bool | None = None,
    source: str | DatasetSource | None = None,
) -> HuggingFaceDataset:
    """
    Create a `mlflow.data.huggingface_dataset.HuggingFaceDataset` from a Hugging Face dataset.

    Args:
        ds:
            A Hugging Face dataset. Must be an instance of `datasets.Dataset`. Other types, such as
            `datasets.DatasetDict`, are not supported.
        path: The path of the Hugging Face dataset used to construct the source. This is the same
            argument as `path` in `datasets.load_dataset()` function. To be able to reload the
            dataset via MLflow, `path` must match the path of the dataset on the hub, e.g.,
            "databricks/databricks-dolly-15k". If no path is specified, a `CodeDatasetSource` is,
            used which will source information from the run context.
        targets: The name of the Hugging Face `dataset.Dataset` column containing targets (labels)
            for supervised learning.
        data_dir: The `data_dir` of the Hugging Face dataset configuration. This is used by the
            `datasets.load_dataset()` function to reload the dataset upon request via
            :py:func:`HuggingFaceDataset.source.load()
            <mlflow.data.huggingface_dataset_source.HuggingFaceDatasetSource.load>`.
        data_files: Paths to source data file(s) for the Hugging Face dataset configuration.
            This is used by the `datasets.load_dataset()` function to reload the
            dataset upon request via :py:func:`HuggingFaceDataset.source.load()
            <mlflow.data.huggingface_dataset_source.HuggingFaceDatasetSource.load>`.
        revision: Version of the dataset script to load. This is used by the
            `datasets.load_dataset()` function to reload the dataset upon request via
            :py:func:`HuggingFaceDataset.source.load()
            <mlflow.data.huggingface_dataset_source.HuggingFaceDatasetSource.load>`.
        name: The name of the dataset. E.g. "wiki_train". If unspecified, a name is automatically
            generated.
        digest: The digest (hash, fingerprint) of the dataset. If unspecified, a digest is
            automatically computed.
        trust_remote_code: Whether to trust remote code from the dataset repo.
        source: The source of the dataset, e.g. a S3 URI, an HTTPS URL etc.
    """
    import datasets

    from mlflow.data.code_dataset_source import CodeDatasetSource
    from mlflow.data.dataset_source_registry import resolve_dataset_source
    from mlflow.tracking.context import registry

    if not isinstance(ds, datasets.Dataset):
        raise MlflowException(
            f"The specified Hugging Face dataset must be an instance of `datasets.Dataset`."
            f" Instead, found an instance of: {type(ds)}",
            INVALID_PARAMETER_VALUE,
        )

    # Set the source to a `HuggingFaceDatasetSource` if a path is specified, otherwise set it to a
    # `CodeDatasetSource`.
    if source is not None and path is not None:
        _logger.warning(
            "Both 'source' and 'path' are provided."
            "'source' will take precedence, and 'path' will be ignored."
        )
    if source is not None:
        source = source if isinstance(source, DatasetSource) else resolve_dataset_source(source)
    elif path is not None:
        source = HuggingFaceDatasetSource(
            path=path,
            config_name=ds.config_name,
            data_dir=data_dir,
            data_files=data_files,
            split=ds.split,
            revision=revision,
            trust_remote_code=trust_remote_code,
        )
    else:
        context_tags = registry.resolve_tags()
        source = CodeDatasetSource(tags=context_tags)
    return HuggingFaceDataset(ds=ds, targets=targets, source=source, name=name, digest=digest)
```

--------------------------------------------------------------------------------

---[FILE: huggingface_dataset_source.py]---
Location: mlflow-master/mlflow/data/huggingface_dataset_source.py

```python
from typing import TYPE_CHECKING, Any, Mapping, Sequence, Union

from mlflow.data.dataset_source import DatasetSource

if TYPE_CHECKING:
    import datasets


class HuggingFaceDatasetSource(DatasetSource):
    """Represents the source of a Hugging Face dataset used in MLflow Tracking."""

    def __init__(
        self,
        path: str,
        config_name: str | None = None,
        data_dir: str | None = None,
        data_files: str | Sequence[str] | Mapping[str, str | Sequence[str]] | None = None,
        split: Union[str, "datasets.Split"] | None = None,
        revision: Union[str, "datasets.Version"] | None = None,
        trust_remote_code: bool | None = None,
    ):
        """Create a `HuggingFaceDatasetSource` instance.

        Arguments in `__init__` match arguments of the same name in
        `datasets.load_dataset() <https://huggingface.co/docs/datasets/v2.14.5/en/package_reference/loading_methods#datasets.load_dataset>`_.
        The only exception is `config_name` matches `name` in `datasets.load_dataset()`, because
        we need to differentiate from `mlflow.data.Dataset` `name` attribute.

        Args:
            path: The path of the Hugging Face dataset, if it is a dataset from HuggingFace hub,
                `path` must match the hub path, e.g., "databricks/databricks-dolly-15k".
            config_name: The name of of the Hugging Face dataset configuration.
            data_dir: The `data_dir` of the Hugging Face dataset configuration.
            data_files: Paths to source data file(s) for the Hugging Face dataset configuration.
            split: Which split of the data to load.
            revision: Version of the dataset script to load.
            trust_remote_code: Whether to trust remote code from the dataset repo.
        """
        self.path = path
        self.config_name = config_name
        self.data_dir = data_dir
        self.data_files = data_files
        self.split = split
        self.revision = revision
        self.trust_remote_code = trust_remote_code

    @staticmethod
    def _get_source_type() -> str:
        return "hugging_face"

    def load(self, **kwargs):
        """Load the Hugging Face dataset based on `HuggingFaceDatasetSource`.

        Args:
            kwargs: Additional keyword arguments used for loading the dataset with the Hugging Face
                `datasets.load_dataset()` method.

        Returns:
            An instance of `datasets.Dataset`.
        """
        import datasets
        from packaging.version import Version

        load_kwargs = {
            "path": self.path,
            "name": self.config_name,
            "data_dir": self.data_dir,
            "data_files": self.data_files,
            "split": self.split,
            "revision": self.revision,
        }

        # this argument only exists in >= 2.16.0
        if Version(datasets.__version__) >= Version("2.16.0"):
            load_kwargs["trust_remote_code"] = self.trust_remote_code

        if intersecting_keys := set(load_kwargs.keys()) & set(kwargs.keys()):
            raise KeyError(
                f"Found duplicated arguments in `HuggingFaceDatasetSource` and "
                f"`kwargs`: {intersecting_keys}. Please remove them from `kwargs`."
            )
        load_kwargs.update(kwargs)
        return datasets.load_dataset(**load_kwargs)

    @staticmethod
    def _can_resolve(raw_source: Any):
        # NB: Initially, we expect that Hugging Face dataset sources will only be used with
        # Hugging Face datasets constructed by from_huggingface_dataset, which can create
        # an instance of HuggingFaceDatasetSource directly without the need for resolution
        return False

    @classmethod
    def _resolve(cls, raw_source: str) -> "HuggingFaceDatasetSource":
        raise NotImplementedError

    def to_dict(self) -> dict[Any, Any]:
        return {
            "path": self.path,
            "config_name": self.config_name,
            "data_dir": self.data_dir,
            "data_files": self.data_files,
            "split": str(self.split),
            "revision": self.revision,
        }

    @classmethod
    def from_dict(cls, source_dict: dict[Any, Any]) -> "HuggingFaceDatasetSource":
        return cls(
            path=source_dict.get("path"),
            config_name=source_dict.get("config_name"),
            data_dir=source_dict.get("data_dir"),
            data_files=source_dict.get("data_files"),
            split=source_dict.get("split"),
            revision=source_dict.get("revision"),
        )
```

--------------------------------------------------------------------------------

---[FILE: meta_dataset.py]---
Location: mlflow-master/mlflow/data/meta_dataset.py

```python
import hashlib
import json
from typing import Any

from mlflow.data.dataset import Dataset
from mlflow.data.dataset_source import DatasetSource
from mlflow.types import Schema


class MetaDataset(Dataset):
    """Dataset that only contains metadata.

    This class is used to represent a dataset that only contains metadata, which is useful when
    users only want to log metadata to MLflow without logging the actual data. For example, users
    build a custom dataset from a text file publicly hosted in the Internet, and they want to log
    the text file's URL to MLflow for future tracking instead of the dataset itself.

    Args:
        source: dataset source of type `DatasetSource`, indicates where the data is from.
        name: name of the dataset. If not specified, a name is automatically generated.
        digest: digest (hash, fingerprint) of the dataset. If not specified, a digest is
            automatically computed.
        schame: schema of the dataset.

    .. code-block:: python
        :caption: Create a MetaDataset

        import mlflow

        mlflow.set_experiment("/test-mlflow-meta-dataset")

        source = mlflow.data.http_dataset_source.HTTPDatasetSource(
            url="https://ai.stanford.edu/~amaas/data/sentiment/aclImdb_v1.tar.gz"
        )
        ds = mlflow.data.meta_dataset.MetaDataset(source)

        with mlflow.start_run() as run:
            mlflow.log_input(ds)

    .. code-block:: python
        :caption: Create a MetaDataset with schema

        import mlflow

        mlflow.set_experiment("/test-mlflow-meta-dataset")

        source = mlflow.data.http_dataset_source.HTTPDatasetSource(
            url="https://ai.stanford.edu/~amaas/data/sentiment/aclImdb_v1.tar.gz"
        )
        schema = Schema(
            [
                ColSpec(type=mlflow.types.DataType.string, name="text"),
                ColSpec(type=mlflow.types.DataType.integer, name="label"),
            ]
        )
        ds = mlflow.data.meta_dataset.MetaDataset(source, schema=schema)

        with mlflow.start_run() as run:
            mlflow.log_input(ds)
    """

    def __init__(
        self,
        source: DatasetSource,
        name: str | None = None,
        digest: str | None = None,
        schema: Schema | None = None,
    ):
        # Set `self._schema` before calling the superclass constructor because
        # `self._compute_digest` depends on `self._schema`.
        self._schema = schema
        super().__init__(source=source, name=name, digest=digest)

    def _compute_digest(self) -> str:
        """Computes a digest for the dataset.

        The digest computation of `MetaDataset` is based on the dataset's name, source, source type,
        and schema instead of the actual data. Basically we compute the sha256 hash of the config
        dict.
        """
        config = {
            "name": self.name,
            "source": self.source.to_json(),
            "source_type": self.source._get_source_type(),
            "schema": self.schema.to_dict() if self.schema else "",
        }
        return hashlib.sha256(json.dumps(config).encode("utf-8")).hexdigest()[:8]

    @property
    def schema(self) -> Any | None:
        """Returns the schema of the dataset."""
        return self._schema

    def to_dict(self) -> dict[str, str]:
        """Create config dictionary for the MetaDataset.

        Returns a string dictionary containing the following fields: name, digest, source, source
        type, schema, and profile.
        """
        config = super().to_dict()
        if self.schema:
            schema = json.dumps({"mlflow_colspec": self.schema.to_dict()}) if self.schema else None
            config["schema"] = schema
        return config
```

--------------------------------------------------------------------------------

---[FILE: numpy_dataset.py]---
Location: mlflow-master/mlflow/data/numpy_dataset.py

```python
import json
import logging
from functools import cached_property
from typing import Any

import numpy as np

from mlflow.data.dataset import Dataset
from mlflow.data.dataset_source import DatasetSource
from mlflow.data.digest_utils import compute_numpy_digest
from mlflow.data.evaluation_dataset import EvaluationDataset
from mlflow.data.pyfunc_dataset_mixin import PyFuncConvertibleDatasetMixin, PyFuncInputsOutputs
from mlflow.data.schema import TensorDatasetSchema
from mlflow.types.utils import _infer_schema

_logger = logging.getLogger(__name__)


class NumpyDataset(Dataset, PyFuncConvertibleDatasetMixin):
    """
    Represents a NumPy dataset for use with MLflow Tracking.
    """

    def __init__(
        self,
        features: np.ndarray | dict[str, np.ndarray],
        source: DatasetSource,
        targets: np.ndarray | dict[str, np.ndarray] = None,
        name: str | None = None,
        digest: str | None = None,
    ):
        """
        Args:
            features: A numpy array or dictionary of numpy arrays containing dataset features.
            source: The source of the numpy dataset.
            targets: A numpy array or dictionary of numpy arrays containing dataset targets.
                Optional.
            name: The name of the dataset. E.g. "wiki_train". If unspecified, a name is
                automatically generated.
            digest: The digest (hash, fingerprint) of the dataset. If unspecified, a digest
                is automatically computed.
        """
        self._features = features
        self._targets = targets
        super().__init__(source=source, name=name, digest=digest)

    def _compute_digest(self) -> str:
        """
        Computes a digest for the dataset. Called if the user doesn't supply
        a digest when constructing the dataset.
        """
        return compute_numpy_digest(self._features, self._targets)

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
    def source(self) -> DatasetSource:
        """
        The source of the dataset.
        """
        return self._source

    @property
    def features(self) -> np.ndarray | dict[str, np.ndarray]:
        """
        The features of the dataset.
        """
        return self._features

    @property
    def targets(self) -> np.ndarray | dict[str, np.ndarray] | None:
        """
        The targets of the dataset. May be ``None`` if no targets are available.
        """
        return self._targets

    @property
    def profile(self) -> Any | None:
        """
        A profile of the dataset. May be ``None`` if a profile cannot be computed.
        """

        def get_profile_attribute(numpy_data, attr_name):
            if isinstance(numpy_data, dict):
                return {key: getattr(array, attr_name) for key, array in numpy_data.items()}
            else:
                return getattr(numpy_data, attr_name)

        profile = {
            "features_shape": get_profile_attribute(self._features, "shape"),
            "features_size": get_profile_attribute(self._features, "size"),
            "features_nbytes": get_profile_attribute(self._features, "nbytes"),
        }
        if self._targets is not None:
            profile.update(
                {
                    "targets_shape": get_profile_attribute(self._targets, "shape"),
                    "targets_size": get_profile_attribute(self._targets, "size"),
                    "targets_nbytes": get_profile_attribute(self._targets, "nbytes"),
                }
            )

        return profile

    @cached_property
    def schema(self) -> TensorDatasetSchema | None:
        """
        MLflow TensorSpec schema representing the dataset features and targets (optional).
        """
        try:
            features_schema = _infer_schema(self._features)
            targets_schema = None
            if self._targets is not None:
                targets_schema = _infer_schema(self._targets)
            return TensorDatasetSchema(features=features_schema, targets=targets_schema)
        except Exception as e:
            _logger.warning("Failed to infer schema for NumPy dataset. Exception: %s", e)
            return None

    def to_pyfunc(self) -> PyFuncInputsOutputs:
        """
        Converts the dataset to a collection of pyfunc inputs and outputs for model
        evaluation. Required for use with mlflow.evaluate().
        """
        return PyFuncInputsOutputs(self._features, self._targets)

    def to_evaluation_dataset(self, path=None, feature_names=None) -> EvaluationDataset:
        """
        Converts the dataset to an EvaluationDataset for model evaluation. Required
        for use with mlflow.sklearn.evaluate().
        """
        return EvaluationDataset(
            data=self._features,
            targets=self._targets,
            path=path,
            feature_names=feature_names,
            name=self.name,
            digest=self.digest,
        )


def from_numpy(
    features: np.ndarray | dict[str, np.ndarray],
    source: str | DatasetSource = None,
    targets: np.ndarray | dict[str, np.ndarray] = None,
    name: str | None = None,
    digest: str | None = None,
) -> NumpyDataset:
    """
    Constructs a :py:class:`NumpyDataset <mlflow.data.numpy_dataset.NumpyDataset>` object from
    NumPy features, optional targets, and source. If the source is path like, then this will
    construct a DatasetSource object from the source path. Otherwise, the source is assumed to
    be a DatasetSource object.

    Args:
        features: NumPy features, represented as an np.ndarray or dictionary of named np.ndarrays.
        source: The source from which the numpy data was derived, e.g. a filesystem path, an S3 URI,
            an HTTPS URL, a delta table name with version, or spark table etc. ``source`` may be
            specified as a URI, a path-like string, or an instance of
            :py:class:`DatasetSource <mlflow.data.dataset_source.DatasetSource>`. If unspecified,
            the source is assumed to be the code location (e.g. notebook cell, script, etc.) where
            :py:func:`from_numpy <mlflow.data.from_numpy>` is being called.
        targets: Optional NumPy targets, represented as an np.ndarray or dictionary of named
            np.ndarrays.
        name: The name of the dataset. If unspecified, a name is generated.
        digest: The dataset digest (hash). If unspecified, a digest is computed automatically.

    .. code-block:: python
        :test:
        :caption: Basic Example

        import mlflow
        import numpy as np

        x = np.random.uniform(size=[2, 5, 4])
        y = np.random.randint(2, size=[2])
        dataset = mlflow.data.from_numpy(x, targets=y)

    .. code-block:: python
        :test:
        :caption: Dict Example

        import mlflow
        import numpy as np

        x = {
            "feature_1": np.random.uniform(size=[2, 5, 4]),
            "feature_2": np.random.uniform(size=[2, 5, 4]),
        }
        y = np.random.randint(2, size=[2])
        dataset = mlflow.data.from_numpy(x, targets=y)
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
    return NumpyDataset(
        features=features, source=resolved_source, targets=targets, name=name, digest=digest
    )
```

--------------------------------------------------------------------------------

````
