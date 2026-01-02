---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 772
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 772 of 991)

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

---[FILE: test_huggingface_dataset_and_source.py]---
Location: mlflow-master/tests/data/test_huggingface_dataset_and_source.py

```python
import json
import os
import time
from unittest import mock

import datasets
import pandas as pd
import pytest

import mlflow.data
import mlflow.data.huggingface_dataset
from mlflow.data.code_dataset_source import CodeDatasetSource
from mlflow.data.dataset_source_registry import get_dataset_source_from_json
from mlflow.data.evaluation_dataset import EvaluationDataset
from mlflow.data.huggingface_dataset import HuggingFaceDataset
from mlflow.data.huggingface_dataset_source import HuggingFaceDatasetSource
from mlflow.exceptions import MlflowException
from mlflow.types.schema import Schema
from mlflow.types.utils import _infer_schema

from tests.helper_functions import skip_if_hf_hub_unhealthy
from tests.resources.data.dataset_source import SampleDatasetSource

pytestmark = skip_if_hf_hub_unhealthy()


@pytest.fixture(scope="module", autouse=True)
def mock_datasets_load_dataset():
    """
    `datasets.load_dataset` is flaky and sometimes fails with a network error.
    This fixture retries the call up to 5 times with exponential backoff.
    """

    original = datasets.load_dataset

    def load_dataset(*args, **kwargs):
        for i in range(5):
            try:
                return original(*args, **kwargs)
            except Exception:
                if i < 4:
                    time.sleep(2**i)
                    continue
                raise

    with mock.patch("datasets.load_dataset", wraps=load_dataset) as mock_load_dataset:
        yield
        mock_load_dataset.assert_called()


def test_from_huggingface_dataset_constructs_expected_dataset():
    ds = datasets.load_dataset("rotten_tomatoes", split="train")
    mlflow_ds = mlflow.data.from_huggingface(ds, path="rotten_tomatoes")

    assert isinstance(mlflow_ds, HuggingFaceDataset)
    assert mlflow_ds.ds == ds
    assert mlflow_ds.schema == _infer_schema(ds.to_pandas())
    assert mlflow_ds.profile == {
        "num_rows": ds.num_rows,
        "dataset_size": ds.dataset_size,
        "size_in_bytes": ds.size_in_bytes,
    }

    assert isinstance(mlflow_ds.source, HuggingFaceDatasetSource)

    with pytest.raises(KeyError, match="Found duplicated arguments*"):
        # Test that we raise an error if the same key is specified in both
        # `HuggingFaceDatasetSource` and `kwargs`.
        mlflow_ds.source.load(path="dummy_path")

    reloaded_ds = mlflow_ds.source.load()
    assert reloaded_ds.builder_name == ds.builder_name
    assert reloaded_ds.config_name == ds.config_name
    assert reloaded_ds.split == ds.split == "train"
    assert reloaded_ds.num_rows == ds.num_rows

    reloaded_mlflow_ds = mlflow.data.from_huggingface(reloaded_ds, path="rotten_tomatoes")
    assert reloaded_mlflow_ds.digest == mlflow_ds.digest


def test_from_huggingface_dataset_constructs_expected_dataset_with_revision():
    # Load this revision:
    # https://huggingface.co/datasets/cornell-movie-review-data/rotten_tomatoes/commit/aa13bc287fa6fcab6daf52f0dfb9994269ffea28
    revision = "aa13bc287fa6fcab6daf52f0dfb9994269ffea28"
    ds = datasets.load_dataset(
        "cornell-movie-review-data/rotten_tomatoes",
        split="train",
        revision=revision,
        trust_remote_code=True,
    )

    mlflow_ds_new = mlflow.data.from_huggingface(
        ds, path="rotten_tomatoes", revision=revision, trust_remote_code=True
    )

    ds = mlflow_ds_new.source.load()
    assert any(revision in cs for cs in ds.info.download_checksums)


def test_from_huggingface_dataset_constructs_expected_dataset_with_data_files():
    data_files = {"train": "prompts.csv"}
    ds = datasets.load_dataset("fka/awesome-chatgpt-prompts", data_files=data_files, split="train")
    mlflow_ds = mlflow.data.from_huggingface(
        ds, path="fka/awesome-chatgpt-prompts", data_files=data_files
    )

    assert isinstance(mlflow_ds, HuggingFaceDataset)
    assert mlflow_ds.ds == ds
    assert mlflow_ds.schema == _infer_schema(ds.to_pandas())
    assert mlflow_ds.profile == {
        "num_rows": ds.num_rows,
        "dataset_size": ds.dataset_size,
        "size_in_bytes": ds.size_in_bytes,
    }

    assert isinstance(mlflow_ds.source, HuggingFaceDatasetSource)
    reloaded_ds = mlflow_ds.source.load()
    assert reloaded_ds.builder_name == ds.builder_name
    assert reloaded_ds.config_name == ds.config_name
    assert reloaded_ds.split == ds.split == "train"
    assert reloaded_ds.num_rows == ds.num_rows

    reloaded_mlflow_ds = mlflow.data.from_huggingface(
        reloaded_ds, path="fka/awesome-chatgpt-prompts", data_files=data_files
    )
    assert reloaded_mlflow_ds.digest == mlflow_ds.digest


def test_from_huggingface_dataset_constructs_expected_dataset_with_data_dir(tmp_path):
    df = pd.DataFrame.from_dict({"a": [1, 2, 3], "b": [4, 5, 6]})
    data_dir = "data"
    os.makedirs(tmp_path / data_dir)
    df.to_csv(tmp_path / data_dir / "my_data.csv")
    ds = datasets.load_dataset(str(tmp_path), data_dir=data_dir, name="default", split="train")
    mlflow_ds = mlflow.data.from_huggingface(ds, path=str(tmp_path), data_dir=data_dir)

    assert mlflow_ds.ds == ds
    assert mlflow_ds.schema == _infer_schema(ds.to_pandas())
    assert mlflow_ds.profile == {
        "num_rows": ds.num_rows,
        "dataset_size": ds.dataset_size,
        "size_in_bytes": ds.size_in_bytes,
    }

    assert isinstance(mlflow_ds.source, HuggingFaceDatasetSource)
    reloaded_ds = mlflow_ds.source.load()
    assert reloaded_ds.builder_name == ds.builder_name
    assert reloaded_ds.config_name == ds.config_name
    assert reloaded_ds.split == ds.split == "train"
    assert reloaded_ds.num_rows == ds.num_rows

    reloaded_mlflow_ds = mlflow.data.from_huggingface(
        reloaded_ds, path=str(tmp_path), data_dir=data_dir
    )
    assert reloaded_mlflow_ds.digest == mlflow_ds.digest


def test_from_huggingface_dataset_respects_user_specified_name_and_digest():
    ds = datasets.load_dataset("rotten_tomatoes", split="train")
    mlflow_ds = mlflow.data.from_huggingface(
        ds, path="rotten_tomatoes", name="myname", digest="mydigest"
    )
    assert mlflow_ds.name == "myname"
    assert mlflow_ds.digest == "mydigest"


def test_from_huggingface_dataset_digest_is_consistent_for_large_ordered_datasets(tmp_path):
    assert (
        mlflow.data.huggingface_dataset._MAX_ROWS_FOR_DIGEST_COMPUTATION_AND_SCHEMA_INFERENCE
        < 200000
    )

    df = pd.DataFrame.from_dict(
        {
            "a": list(range(200000)),
            "b": list(range(200000)),
        }
    )
    data_dir = "data"
    os.makedirs(tmp_path / data_dir)
    df.to_csv(tmp_path / data_dir / "my_data.csv")

    ds = datasets.load_dataset(str(tmp_path), data_dir=data_dir, name="default", split="train")
    mlflow_ds = mlflow.data.from_huggingface(ds, path=str(tmp_path), data_dir=data_dir)
    assert mlflow_ds.digest == "1dda4ce8"


def test_from_huggingface_dataset_throws_for_dataset_dict():
    ds = datasets.load_dataset("rotten_tomatoes")
    assert isinstance(ds, datasets.DatasetDict)

    with pytest.raises(
        MlflowException, match="must be an instance of `datasets.Dataset`.*DatasetDict"
    ):
        mlflow.data.from_huggingface(ds, path="rotten_tomatoes")


def test_from_huggingface_dataset_no_source_specified():
    ds = datasets.load_dataset("rotten_tomatoes", split="train")
    mlflow_ds = mlflow.data.from_huggingface(ds)

    assert isinstance(mlflow_ds, HuggingFaceDataset)

    assert isinstance(mlflow_ds.source, CodeDatasetSource)
    assert "mlflow.source.name" in mlflow_ds.source.to_json()


def test_dataset_conversion_to_json():
    ds = datasets.load_dataset("rotten_tomatoes", split="train")
    mlflow_ds = mlflow.data.from_huggingface(ds, path="rotten_tomatoes")

    dataset_json = mlflow_ds.to_json()
    parsed_json = json.loads(dataset_json)
    assert parsed_json.keys() <= {"name", "digest", "source", "source_type", "schema", "profile"}
    assert parsed_json["name"] == mlflow_ds.name
    assert parsed_json["digest"] == mlflow_ds.digest
    assert parsed_json["source"] == mlflow_ds.source.to_json()
    assert parsed_json["source_type"] == mlflow_ds.source._get_source_type()
    assert parsed_json["profile"] == json.dumps(mlflow_ds.profile)

    schema_json = json.dumps(json.loads(parsed_json["schema"])["mlflow_colspec"])
    assert Schema.from_json(schema_json) == mlflow_ds.schema


def test_dataset_source_conversion_to_json():
    ds = datasets.load_dataset(
        "rotten_tomatoes",
        split="train",
        revision="c33cbf965006dba64f134f7bef69c53d5d0d285d",
    )
    mlflow_ds = mlflow.data.from_huggingface(
        ds,
        path="rotten_tomatoes",
        revision="c33cbf965006dba64f134f7bef69c53d5d0d285d",
    )
    source = mlflow_ds.source

    source_json = source.to_json()
    parsed_source = json.loads(source_json)
    assert parsed_source["revision"] == "c33cbf965006dba64f134f7bef69c53d5d0d285d"
    assert parsed_source["split"] == "train"
    assert parsed_source["config_name"] == "default"
    assert parsed_source["path"] == "rotten_tomatoes"
    assert not parsed_source["data_dir"]
    assert not parsed_source["data_files"]

    reloaded_source = HuggingFaceDatasetSource.from_json(source_json)
    assert json.loads(reloaded_source.to_json()) == parsed_source

    reloaded_source = get_dataset_source_from_json(
        source_json, source_type=source._get_source_type()
    )
    assert isinstance(reloaded_source, HuggingFaceDatasetSource)
    assert type(source) == type(reloaded_source)
    assert reloaded_source.to_json() == source.to_json()


def test_to_evaluation_dataset():
    import numpy as np

    ds = datasets.load_dataset("rotten_tomatoes", split="train")
    dataset = mlflow.data.from_huggingface(ds, path="rotten_tomatoes", targets="label")

    evaluation_dataset = dataset.to_evaluation_dataset()
    assert isinstance(evaluation_dataset, EvaluationDataset)
    assert evaluation_dataset.features_data.equals(dataset.ds.to_pandas().drop("label", axis=1))
    assert np.array_equal(evaluation_dataset.labels_data, dataset.ds.to_pandas()["label"].values)


def test_from_huggingface_dataset_with_sample_source():
    source_uri = "test:/my/test/uri"
    source = SampleDatasetSource._resolve(source_uri)

    data = {"text": ["This is a sample text.", "Another sample text."], "label": [0, 1]}
    dataset = datasets.Dataset.from_dict(data)

    train_dataset = mlflow.data.from_huggingface(
        dataset,
        name="sample-text-dataset",
        source=source,
    )

    assert isinstance(train_dataset, HuggingFaceDataset)
    assert train_dataset.source == source
```

--------------------------------------------------------------------------------

---[FILE: test_meta_dataset.py]---
Location: mlflow-master/tests/data/test_meta_dataset.py

```python
import json
from unittest.mock import patch

import pytest

pd = pytest.importorskip("pandas")

from mlflow.data.delta_dataset_source import DeltaDatasetSource
from mlflow.data.http_dataset_source import HTTPDatasetSource
from mlflow.data.huggingface_dataset_source import HuggingFaceDatasetSource
from mlflow.data.meta_dataset import MetaDataset
from mlflow.data.pandas_dataset import from_pandas
from mlflow.data.uc_volume_dataset_source import UCVolumeDatasetSource
from mlflow.exceptions import MlflowException
from mlflow.types import DataType
from mlflow.types.schema import ColSpec, Schema


@pytest.mark.parametrize(
    ("dataset_source_class", "path"),
    [
        (HTTPDatasetSource, "test:/my/test/uri"),
        (DeltaDatasetSource, "fake/path/to/delta"),
        (HuggingFaceDatasetSource, "databricks/databricks-dolly-15k"),
    ],
)
def test_create_meta_dataset_from_source(dataset_source_class, path):
    source = dataset_source_class(path)
    dataset = MetaDataset(source=source)

    json_str = dataset.to_json()
    parsed_json = json.loads(json_str)

    assert parsed_json["digest"] is not None
    assert path in parsed_json["source"]
    assert parsed_json["source_type"] == dataset_source_class._get_source_type()


@pytest.mark.parametrize(
    ("dataset_source_class", "path"),
    [
        (HTTPDatasetSource, "test:/my/test/uri"),
        (DeltaDatasetSource, "fake/path/to/delta"),
        (HuggingFaceDatasetSource, "databricks/databricks-dolly-15k"),
    ],
)
def test_create_meta_dataset_from_source_with_schema(dataset_source_class, path):
    source = dataset_source_class(path)
    schema = Schema(
        [
            ColSpec(type=DataType.long, name="foo"),
            ColSpec(type=DataType.integer, name="bar"),
        ]
    )
    dataset = MetaDataset(source=source, schema=schema)

    json_str = dataset.to_json()
    parsed_json = json.loads(json_str)

    assert parsed_json["digest"] is not None
    assert path in parsed_json["source"]
    assert parsed_json["source_type"] == dataset_source_class._get_source_type()
    assert json.loads(parsed_json["schema"])["mlflow_colspec"] == schema.to_dict()


def test_meta_dataset_digest():
    http_source = HTTPDatasetSource("test:/my/test/uri")
    dataset1 = MetaDataset(source=http_source)
    schema = Schema(
        [
            ColSpec(type=DataType.long, name="foo"),
            ColSpec(type=DataType.integer, name="bar"),
        ]
    )
    dataset2 = MetaDataset(source=http_source, schema=schema)

    assert dataset1.digest != dataset2.digest

    delta_source = DeltaDatasetSource("fake/path/to/delta")
    dataset3 = MetaDataset(source=delta_source)
    assert dataset1.digest != dataset3.digest


def test_meta_dataset_with_uc_source():
    path = "/Volumes/dummy_catalog/dummy_schema/dummy_volume/tmp.yaml"

    with (
        patch(
            "mlflow.data.uc_volume_dataset_source.UCVolumeDatasetSource._verify_uc_path_is_valid",
            side_effect=MlflowException(f"{path} does not exist in Databricks Unified Catalog."),
        ),
        pytest.raises(
            MlflowException, match=f"{path} does not exist in Databricks Unified Catalog."
        ),
    ):
        uc_volume_source = UCVolumeDatasetSource(path)

    with patch(
        "mlflow.data.uc_volume_dataset_source.UCVolumeDatasetSource._verify_uc_path_is_valid",
    ):
        uc_volume_source = UCVolumeDatasetSource(path)
        dataset = MetaDataset(source=uc_volume_source)
        json_str = dataset.to_json()
        parsed_json = json.loads(json_str)

        assert parsed_json["digest"] is not None
        assert path in parsed_json["source"]
        assert parsed_json["source_type"] == "uc_volume"


def test_create_meta_dataset_from_dataset():
    pandas_dataset = from_pandas(
        df=pd.DataFrame({"a": [1, 2, 3]}),
        source="/tmp/test.csv",
    )

    meta_dataset = MetaDataset(source=pandas_dataset)

    parsed_json = json.loads(meta_dataset.to_json())

    assert parsed_json["source_type"] == pandas_dataset._get_source_type()
    dataset_json = json.loads(parsed_json["source"])
    assert dataset_json["source_type"] == pandas_dataset.source._get_source_type()
```

--------------------------------------------------------------------------------

---[FILE: test_numpy_dataset.py]---
Location: mlflow-master/tests/data/test_numpy_dataset.py

```python
import json

import numpy as np
import pandas as pd
import pytest

import mlflow.data
from mlflow.data.code_dataset_source import CodeDatasetSource
from mlflow.data.evaluation_dataset import EvaluationDataset
from mlflow.data.filesystem_dataset_source import FileSystemDatasetSource
from mlflow.data.numpy_dataset import NumpyDataset
from mlflow.data.pyfunc_dataset_mixin import PyFuncInputsOutputs
from mlflow.data.schema import TensorDatasetSchema
from mlflow.types.utils import _infer_schema

from tests.resources.data.dataset_source import SampleDatasetSource


def test_conversion_to_json():
    source_uri = "test:/my/test/uri"
    source = SampleDatasetSource._resolve(source_uri)
    dataset = NumpyDataset(features=np.array([1, 2, 3]), source=source, name="testname")

    dataset_json = dataset.to_json()
    parsed_json = json.loads(dataset_json)
    assert parsed_json.keys() <= {"name", "digest", "source", "source_type", "schema", "profile"}
    assert parsed_json["name"] == dataset.name
    assert parsed_json["digest"] == dataset.digest
    assert parsed_json["source"] == dataset.source.to_json()
    assert parsed_json["source_type"] == dataset.source._get_source_type()
    assert parsed_json["profile"] == json.dumps(dataset.profile)

    parsed_schema = json.loads(parsed_json["schema"])
    assert TensorDatasetSchema.from_dict(parsed_schema) == dataset.schema


@pytest.mark.parametrize(
    ("features", "targets"),
    [
        (
            {
                "a": np.array([1, 2, 3]),
                "b": np.array([[4, 5]]),
            },
            {
                "c": np.array([1]),
                "d": np.array([[[2]]]),
            },
        ),
        (
            np.array([1, 2, 3]),
            {
                "c": np.array([1]),
                "d": np.array([[[2]]]),
            },
        ),
        (
            {
                "a": np.array([1, 2, 3]),
                "b": np.array([[4, 5]]),
            },
            np.array([1, 2, 3]),
        ),
    ],
)
def test_conversion_to_json_with_multi_tensor_features_and_targets(features, targets):
    source_uri = "test:/my/test/uri"
    source = SampleDatasetSource._resolve(source_uri)
    dataset = NumpyDataset(features=features, targets=targets, source=source)

    dataset_json = dataset.to_json()
    parsed_json = json.loads(dataset_json)
    assert parsed_json.keys() <= {"name", "digest", "source", "source_type", "schema", "profile"}
    assert parsed_json["name"] == dataset.name
    assert parsed_json["digest"] == dataset.digest
    assert parsed_json["source"] == dataset.source.to_json()
    assert parsed_json["source_type"] == dataset.source._get_source_type()
    assert parsed_json["profile"] == json.dumps(dataset.profile)
    parsed_schema = json.loads(parsed_json["schema"])
    assert TensorDatasetSchema.from_dict(parsed_schema) == dataset.schema


@pytest.mark.parametrize(
    ("features", "targets"),
    [
        (
            {
                "a": np.array([1, 2, 3]),
                "b": np.array([[4, 5]]),
            },
            {
                "c": np.array([1]),
                "d": np.array([[[2]]]),
            },
        ),
        (
            np.array([1, 2, 3]),
            {
                "c": np.array([1]),
                "d": np.array([[[2]]]),
            },
        ),
        (
            {
                "a": np.array([1, 2, 3]),
                "b": np.array([[4, 5]]),
            },
            np.array([1, 2, 3]),
        ),
    ],
)
def test_schema_and_profile_with_multi_tensor_features_and_targets(features, targets):
    source_uri = "test:/my/test/uri"
    source = SampleDatasetSource._resolve(source_uri)
    dataset = NumpyDataset(features=features, targets=targets, source=source)

    assert isinstance(dataset.schema, TensorDatasetSchema)
    assert dataset.schema.features == _infer_schema(features)
    assert dataset.schema.targets == _infer_schema(targets)

    if isinstance(features, dict):
        assert {
            "features_shape": {key: array.shape for key, array in features.items()},
            "features_size": {key: array.size for key, array in features.items()},
            "features_nbytes": {key: array.nbytes for key, array in features.items()},
        }.items() <= dataset.profile.items()
    else:
        assert {
            "features_shape": features.shape,
            "features_size": features.size,
            "features_nbytes": features.nbytes,
        }.items() <= dataset.profile.items()

    if isinstance(targets, dict):
        assert {
            "targets_shape": {key: array.shape for key, array in targets.items()},
            "targets_size": {key: array.size for key, array in targets.items()},
            "targets_nbytes": {key: array.nbytes for key, array in targets.items()},
        }.items() <= dataset.profile.items()
    else:
        assert {
            "targets_shape": targets.shape,
            "targets_size": targets.size,
            "targets_nbytes": targets.nbytes,
        }.items() <= dataset.profile.items()


def test_digest_property_has_expected_value():
    source_uri = "test:/my/test/uri"
    source = SampleDatasetSource._resolve(source_uri)
    features = np.array([1, 2, 3])
    targets = np.array([4, 5, 6])
    dataset_with_features = NumpyDataset(features=features, source=source, name="testname")
    assert dataset_with_features.digest == dataset_with_features._compute_digest()
    assert dataset_with_features.digest == "fdf1765f"
    dataset_with_features_and_targets = NumpyDataset(
        features=features, targets=targets, source=source, name="testname"
    )
    assert (
        dataset_with_features_and_targets.digest
        == dataset_with_features_and_targets._compute_digest()
    )
    assert dataset_with_features_and_targets.digest == "1387de76"


def test_features_property():
    source_uri = "test:/my/test/uri"
    source = SampleDatasetSource._resolve(source_uri)
    features = np.array([1, 2, 3])
    dataset = NumpyDataset(features=features, source=source, name="testname")
    assert np.array_equal(dataset.features, features)


def test_targets_property():
    source_uri = "test:/my/test/uri"
    source = SampleDatasetSource._resolve(source_uri)
    features = np.array([1, 2, 3])
    targets = np.array([4, 5, 6])
    dataset_with_targets = NumpyDataset(
        features=features, targets=targets, source=source, name="testname"
    )
    assert np.array_equal(dataset_with_targets.targets, targets)
    dataset_without_targets = NumpyDataset(features=features, source=source, name="testname")
    assert dataset_without_targets.targets is None


def test_to_pyfunc():
    source_uri = "test:/my/test/uri"
    source = SampleDatasetSource._resolve(source_uri)
    features = np.array([1, 2, 3])
    dataset = NumpyDataset(features=features, source=source, name="testname")
    assert isinstance(dataset.to_pyfunc(), PyFuncInputsOutputs)


def test_to_evaluation_dataset():
    source_uri = "test:/my/test/uri"
    source = SampleDatasetSource._resolve(source_uri)
    features = np.array([[1, 2], [3, 4]])
    targets = np.array([0, 1])
    dataset = NumpyDataset(features=features, targets=targets, source=source, name="testname")
    evaluation_dataset = dataset.to_evaluation_dataset()
    assert isinstance(evaluation_dataset, EvaluationDataset)
    assert np.array_equal(evaluation_dataset.features_data, features)
    assert np.array_equal(evaluation_dataset.labels_data, targets)


def test_from_numpy_features_only(tmp_path):
    features = np.array([1, 2, 3])
    path = tmp_path / "temp.csv"
    pd.DataFrame(features).to_csv(path)
    mlflow_features = mlflow.data.from_numpy(features, source=path)

    assert isinstance(mlflow_features, NumpyDataset)
    assert np.array_equal(mlflow_features.features, features)
    assert mlflow_features.schema == TensorDatasetSchema(features=_infer_schema(features))
    assert mlflow_features.profile == {
        "features_shape": features.shape,
        "features_size": features.size,
        "features_nbytes": features.nbytes,
    }

    assert isinstance(mlflow_features.source, FileSystemDatasetSource)


def test_from_numpy_features_and_targets(tmp_path):
    features = np.array([[1, 2, 3], [3, 2, 1], [2, 3, 1]])
    targets = np.array([4, 5, 6])
    path = tmp_path / "temp.csv"
    pd.DataFrame(features).to_csv(path)
    mlflow_ds = mlflow.data.from_numpy(features, targets=targets, source=path)

    assert isinstance(mlflow_ds, NumpyDataset)
    assert np.array_equal(mlflow_ds.features, features)
    assert np.array_equal(mlflow_ds.targets, targets)
    assert mlflow_ds.schema == TensorDatasetSchema(
        features=_infer_schema(features), targets=_infer_schema(targets)
    )
    assert mlflow_ds.profile == {
        "features_shape": features.shape,
        "features_size": features.size,
        "features_nbytes": features.nbytes,
        "targets_shape": targets.shape,
        "targets_size": targets.size,
        "targets_nbytes": targets.nbytes,
    }

    assert isinstance(mlflow_ds.source, FileSystemDatasetSource)


def test_from_numpy_no_source_specified():
    features = np.array([1, 2, 3])
    mlflow_features = mlflow.data.from_numpy(features)

    assert isinstance(mlflow_features, NumpyDataset)

    assert isinstance(mlflow_features.source, CodeDatasetSource)
    assert "mlflow.source.name" in mlflow_features.source.to_json()
```

--------------------------------------------------------------------------------

---[FILE: test_pandas_dataset.py]---
Location: mlflow-master/tests/data/test_pandas_dataset.py

```python
import json

import pandas as pd
import pytest

import mlflow.data
from mlflow.data.code_dataset_source import CodeDatasetSource
from mlflow.data.delta_dataset_source import DeltaDatasetSource
from mlflow.data.evaluation_dataset import EvaluationDataset
from mlflow.data.filesystem_dataset_source import FileSystemDatasetSource
from mlflow.data.pandas_dataset import PandasDataset
from mlflow.data.pyfunc_dataset_mixin import PyFuncInputsOutputs
from mlflow.data.spark_dataset_source import SparkDatasetSource
from mlflow.exceptions import MlflowException
from mlflow.types.schema import Schema
from mlflow.types.utils import _infer_schema

from tests.resources.data.dataset_source import SampleDatasetSource


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


def test_conversion_to_json():
    source_uri = "test:/my/test/uri"
    source = SampleDatasetSource._resolve(source_uri)

    dataset = PandasDataset(
        df=pd.DataFrame([1, 2, 3], columns=["Numbers"]),
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
    assert parsed_json["profile"] == json.dumps(dataset.profile)

    schema_json = json.dumps(json.loads(parsed_json["schema"])["mlflow_colspec"])
    assert Schema.from_json(schema_json) == dataset.schema


def test_digest_property_has_expected_value():
    source_uri = "test:/my/test/uri"
    source = SampleDatasetSource._resolve(source_uri)
    dataset = PandasDataset(
        df=pd.DataFrame([1, 2, 3], columns=["Numbers"]),
        source=source,
        name="testname",
    )
    assert dataset.digest == dataset._compute_digest()
    assert dataset.digest == "31ccce44"


def test_df_property():
    source_uri = "test:/my/test/uri"
    source = SampleDatasetSource._resolve(source_uri)
    df = pd.DataFrame([1, 2, 3], columns=["Numbers"])
    dataset = PandasDataset(
        df=df,
        source=source,
        name="testname",
    )
    assert dataset.df.equals(df)


def test_targets_property():
    source_uri = "test:/my/test/uri"
    source = SampleDatasetSource._resolve(source_uri)
    df_no_targets = pd.DataFrame([1, 2, 3], columns=["Numbers"])
    dataset_no_targets = PandasDataset(
        df=df_no_targets,
        source=source,
        name="testname",
    )
    assert dataset_no_targets._targets is None
    df_with_targets = pd.DataFrame([[1, 2, 3], [1, 2, 3]], columns=["a", "b", "c"])
    dataset_with_targets = PandasDataset(
        df=df_with_targets,
        source=source,
        targets="c",
        name="testname",
    )
    assert dataset_with_targets._targets == "c"


def test_with_invalid_targets():
    source_uri = "test:/my/test/uri"
    source = SampleDatasetSource._resolve(source_uri)
    df = pd.DataFrame([[1, 2, 3], [1, 2, 3]], columns=["a", "b", "c"])
    with pytest.raises(
        MlflowException,
        match="The specified pandas DataFrame does not contain the specified targets column 'd'.",
    ):
        PandasDataset(
            df=df,
            source=source,
            targets="d",
            name="testname",
        )


def test_to_pyfunc():
    source_uri = "test:/my/test/uri"
    source = SampleDatasetSource._resolve(source_uri)
    df = pd.DataFrame([1, 2, 3], columns=["Numbers"])
    dataset = PandasDataset(
        df=df,
        source=source,
        name="testname",
    )
    assert isinstance(dataset.to_pyfunc(), PyFuncInputsOutputs)


def test_to_pyfunc_with_outputs():
    source_uri = "test:/my/test/uri"
    source = SampleDatasetSource._resolve(source_uri)
    df = pd.DataFrame([[1, 2, 3], [1, 2, 3]], columns=["a", "b", "c"])
    dataset = PandasDataset(
        df=df,
        source=source,
        targets="c",
        name="testname",
    )
    input_outputs = dataset.to_pyfunc()
    assert isinstance(input_outputs, PyFuncInputsOutputs)
    assert input_outputs.inputs.equals(pd.DataFrame([[1, 2], [1, 2]], columns=["a", "b"]))
    assert input_outputs.outputs.equals(pd.Series([3, 3], name="c"))


def test_from_pandas_with_targets(tmp_path):
    df = pd.DataFrame([[1, 2, 3], [1, 2, 3]], columns=["a", "b", "c"])
    path = tmp_path / "temp.csv"
    df.to_csv(path)
    dataset = mlflow.data.from_pandas(df, targets="c", source=path)
    input_outputs = dataset.to_pyfunc()
    assert isinstance(input_outputs, PyFuncInputsOutputs)
    assert input_outputs.inputs.equals(pd.DataFrame([[1, 2], [1, 2]], columns=["a", "b"]))
    assert input_outputs.outputs.equals(pd.Series([3, 3], name="c"))


def test_from_pandas_file_system_datasource(tmp_path):
    df = pd.DataFrame([[1, 2, 3], [1, 2, 3]], columns=["a", "b", "c"])
    path = tmp_path / "temp.csv"
    df.to_csv(path)
    mlflow_df = mlflow.data.from_pandas(df, source=path)

    assert isinstance(mlflow_df, PandasDataset)
    assert mlflow_df.df.equals(df)
    assert mlflow_df.schema == _infer_schema(df)
    assert mlflow_df.profile == {
        "num_rows": len(df),
        "num_elements": df.size,
    }

    assert isinstance(mlflow_df.source, FileSystemDatasetSource)


def test_from_pandas_spark_datasource(spark_session, tmp_path):
    df = pd.DataFrame([[1, 2, 3], [1, 2, 3]], columns=["a", "b", "c"])
    df_spark = spark_session.createDataFrame(df)
    path = str(tmp_path / "temp.parquet")
    df_spark.write.parquet(path)

    spark_datasource = SparkDatasetSource(path=path)
    mlflow_df = mlflow.data.from_pandas(df, source=spark_datasource)

    assert isinstance(mlflow_df, PandasDataset)
    assert mlflow_df.df.equals(df)
    assert mlflow_df.schema == _infer_schema(df)
    assert mlflow_df.profile == {
        "num_rows": len(df),
        "num_elements": df.size,
    }

    assert isinstance(mlflow_df.source, SparkDatasetSource)


def test_from_pandas_delta_datasource(spark_session, tmp_path):
    df = pd.DataFrame([[1, 2, 3], [1, 2, 3]], columns=["a", "b", "c"])
    df_spark = spark_session.createDataFrame(df)
    path = str(tmp_path / "temp.delta")
    df_spark.write.format("delta").mode("overwrite").save(path)

    delta_datasource = DeltaDatasetSource(path=path)
    mlflow_df = mlflow.data.from_pandas(df, source=delta_datasource)

    assert isinstance(mlflow_df, PandasDataset)
    assert mlflow_df.df.equals(df)
    assert mlflow_df.schema == _infer_schema(df)
    assert mlflow_df.profile == {
        "num_rows": len(df),
        "num_elements": df.size,
    }

    assert isinstance(mlflow_df.source, DeltaDatasetSource)


def test_from_pandas_no_source_specified():
    df = pd.DataFrame([[1, 2, 3], [1, 2, 3]], columns=["a", "b", "c"])
    mlflow_df = mlflow.data.from_pandas(df)

    assert isinstance(mlflow_df, PandasDataset)

    assert isinstance(mlflow_df.source, CodeDatasetSource)
    assert "mlflow.source.name" in mlflow_df.source.to_json()


def test_to_evaluation_dataset():
    import numpy as np

    source_uri = "test:/my/test/uri"
    source = SampleDatasetSource._resolve(source_uri)
    df = pd.DataFrame([[1, 2, 3], [1, 2, 3]], columns=["a", "b", "c"])
    dataset = PandasDataset(
        df=df,
        source=source,
        targets="c",
        name="testname",
    )
    evaluation_dataset = dataset.to_evaluation_dataset()

    assert evaluation_dataset.name is not None
    assert evaluation_dataset.digest is not None
    assert isinstance(evaluation_dataset, EvaluationDataset)
    assert evaluation_dataset.features_data.equals(df.drop("c", axis=1))
    assert np.array_equal(evaluation_dataset.labels_data, df["c"].to_numpy())


def test_df_hashing_with_strings():
    source_uri = "test:/my/test/uri"
    source = SampleDatasetSource._resolve(source_uri)

    dataset1 = PandasDataset(
        df=pd.DataFrame([["a", 2, 3], ["a", 2, 3]], columns=["text_column", "b", "c"]),
        source=source,
        name="testname",
    )

    dataset2 = PandasDataset(
        df=pd.DataFrame([["b", 2, 3], ["b", 2, 3]], columns=["text_column", "b", "c"]),
        source=source,
        name="testname",
    )

    assert dataset1.digest != dataset2.digest


def test_df_hashing_with_dicts():
    source_uri = "test:/my/test/uri"
    source = SampleDatasetSource._resolve(source_uri)

    df = pd.DataFrame(
        [
            {"a": [1, 2, 3], "b": {"b": "b", "c": {"c": "c"}}, "c": 3, "d": "d"},
            {"a": [2, 3], "b": {"b": "b"}, "c": 3, "d": "d"},
        ]
    )
    dataset1 = PandasDataset(df=df, source=source, name="testname")
    dataset2 = PandasDataset(df=df, source=source, name="testname")
    assert dataset1.digest == dataset2.digest

    evaluation_dataset = dataset1.to_evaluation_dataset()
    assert isinstance(evaluation_dataset, EvaluationDataset)
    assert evaluation_dataset.features_data.equals(df)
    evaluation_dataset2 = dataset2.to_evaluation_dataset()
    assert evaluation_dataset.hash == evaluation_dataset2.hash
```

--------------------------------------------------------------------------------

````
