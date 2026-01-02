---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 771
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 771 of 991)

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

---[FILE: test_artifact_dataset_sources.py]---
Location: mlflow-master/tests/data/test_artifact_dataset_sources.py

```python
import json
import os
from unittest import mock

import pytest

from mlflow.data.dataset_source_registry import get_dataset_source_from_json, resolve_dataset_source
from mlflow.data.filesystem_dataset_source import FileSystemDatasetSource
from mlflow.store.artifact.s3_artifact_repo import S3ArtifactRepository


@pytest.mark.parametrize(
    ("source_uri", "source_type", "source_class_name"),
    [
        ("/tmp/path/to/my/local/file.txt", "local", "LocalArtifactDatasetSource"),
        ("file:///tmp/path/to/my/local/directory", "local", "LocalArtifactDatasetSource"),
        ("s3://mybucket/path/to/my/file.txt", "s3", "S3ArtifactDatasetSource"),
        ("gs://mybucket/path/to/my/dir", "gs", "GCSArtifactDatasetSource"),
        ("wasbs://user@host.blob.core.windows.net/dir", "wasbs", "AzureBlobArtifactDatasetSource"),
        ("ftp://mysite.com/path/to/my/file.txt", "ftp", "FTPArtifactDatasetSource"),
        ("sftp://mysite.com/path/to/my/dir", "sftp", "SFTPArtifactDatasetSource"),
        ("hdfs://host_name:8020/hdfs/path/to/my/file.txt", "hdfs", "HdfsArtifactDatasetSource"),
        ("viewfs://host_name:8020/path/to/my/dir", "viewfs", "HdfsArtifactDatasetSource"),
    ],
)
def test_expected_artifact_dataset_sources_are_registered_and_resolvable(
    source_uri, source_type, source_class_name
):
    dataset_source = resolve_dataset_source(source_uri)
    assert isinstance(dataset_source, FileSystemDatasetSource)
    assert dataset_source._get_source_type() == source_type
    assert type(dataset_source).__name__ == source_class_name
    assert type(dataset_source).__qualname__ == source_class_name
    assert dataset_source.uri == source_uri


@pytest.mark.parametrize(
    ("source_uri", "source_type"),
    [
        ("/tmp/path/to/my/local/file.txt", "local"),
        ("file:///tmp/path/to/my/local/directory", "local"),
        ("s3://mybucket/path/to/my/file.txt", "s3"),
        ("gs://mybucket/path/to/my/dir", "gs"),
        ("wasbs://user@host.blob.core.windows.net/dir", "wasbs"),
        ("ftp://mysite.com/path/to/my/file.txt", "ftp"),
        ("sftp://mysite.com/path/to/my/dir", "sftp"),
        ("hdfs://host_name:8020/hdfs/path/to/my/file.txt", "hdfs"),
        ("viewfs://host_name:8020/path/to/my/dir", "viewfs"),
    ],
)
def test_to_and_from_json(source_uri, source_type):
    dataset_source = resolve_dataset_source(source_uri)
    assert dataset_source._get_source_type() == source_type
    source_json = dataset_source.to_json()

    parsed_source_json = json.loads(source_json)
    assert parsed_source_json["uri"] == source_uri

    reloaded_source = get_dataset_source_from_json(
        source_json, source_type=dataset_source._get_source_type()
    )
    assert isinstance(reloaded_source, FileSystemDatasetSource)
    assert type(dataset_source) == type(reloaded_source)
    assert reloaded_source.uri == dataset_source.uri


@pytest.mark.parametrize(
    ("source_uri", "source_type"),
    [
        ("/tmp/path/to/my/local/file.txt", "local"),
        ("file:///tmp/path/to/my/local/directory", "local"),
        ("s3://mybucket/path/to/my/file.txt", "s3"),
        ("gs://mybucket/path/to/my/dir", "gs"),
        ("wasbs://user@host.blob.core.windows.net/dir", "wasbs"),
        ("ftp://mysite.com/path/to/my/file.txt", "ftp"),
        ("sftp://mysite.com/path/to/my/dir", "sftp"),
        ("hdfs://host_name:8020/hdfs/path/to/my/file.txt", "hdfs"),
        ("viewfs://host_name:8020/path/to/my/dir", "viewfs"),
    ],
)
def test_load_makes_expected_mlflow_artifacts_download_call(source_uri, source_type, tmp_path):
    dataset_source = resolve_dataset_source(source_uri)
    assert dataset_source._get_source_type() == source_type

    with mock.patch("mlflow.artifacts.download_artifacts") as download_imp_mock:
        dataset_source.load()
        download_imp_mock.assert_called_once_with(artifact_uri=source_uri, dst_path=None)

    with mock.patch("mlflow.artifacts.download_artifacts") as download_imp_mock:
        dataset_source.load(dst_path=str(tmp_path))
        download_imp_mock.assert_called_once_with(artifact_uri=source_uri, dst_path=str(tmp_path))


@pytest.mark.parametrize("dst_path", [None, "dst"])
def test_local_load(dst_path, tmp_path):
    if dst_path is not None:
        dst_path = str(tmp_path / dst_path)

    # Test string file paths
    file_path = str(tmp_path / "myfile.txt")
    with open(file_path, "w") as f:
        f.write("text")

    file_dataset_source = resolve_dataset_source(file_path)
    assert file_dataset_source._get_source_type() == "local"
    assert file_dataset_source.load(dst_path=dst_path) == dst_path or file_path
    with open(file_path) as f:
        assert f.read() == "text"

    # Test directory paths with pathlib.Path
    dir_path = tmp_path / "mydir"
    os.makedirs(dir_path)

    dir_dataset_source = resolve_dataset_source(dir_path)
    assert file_dataset_source._get_source_type() == "local"
    assert dir_dataset_source.load() == dst_path or str(dir_path)


@pytest.mark.parametrize("dst_path", [None, "dst"])
def test_s3_load(mock_s3_bucket, dst_path, tmp_path):
    if dst_path is not None:
        dst_path = str(tmp_path / dst_path)

    file_path = str(tmp_path / "myfile.txt")
    with open(file_path, "w") as f:
        f.write("text")

    S3ArtifactRepository(f"s3://{mock_s3_bucket}").log_artifact(file_path)

    s3_source_uri = f"s3://{mock_s3_bucket}/myfile.txt"
    s3_dataset_source = resolve_dataset_source(s3_source_uri)
    assert s3_dataset_source._get_source_type() == "s3"
    downloaded_source = s3_dataset_source.load(dst_path=dst_path)
    if dst_path is not None:
        assert downloaded_source == os.path.join(dst_path, "myfile.txt")
    with open(downloaded_source) as f:
        assert f.read() == "text"
```

--------------------------------------------------------------------------------

---[FILE: test_code_dataset_source.py]---
Location: mlflow-master/tests/data/test_code_dataset_source.py

```python
from mlflow.data.code_dataset_source import CodeDatasetSource


def test_code_dataset_source_from_path():
    tags = {
        "mlflow_source_type": "NOTEBOOK",
        "mlflow_source_name": "some_random_notebook_path",
    }
    code_datasource = CodeDatasetSource(tags)
    assert code_datasource.to_dict() == {
        "tags": tags,
    }


def test_code_datasource_type():
    assert CodeDatasetSource._get_source_type() == "code"
```

--------------------------------------------------------------------------------

---[FILE: test_dataset.py]---
Location: mlflow-master/tests/data/test_dataset.py

```python
import json

from mlflow.types.schema import Schema

from tests.resources.data.dataset import SampleDataset
from tests.resources.data.dataset_source import SampleDatasetSource


def test_conversion_to_json():
    source_uri = "test:/my/test/uri"
    source = SampleDatasetSource._resolve(source_uri)
    dataset = SampleDataset(data_list=[1, 2, 3], source=source, name="testname")

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
    dataset = SampleDataset(data_list=[1, 2, 3], source=source, name="testname")
    assert dataset.digest == dataset._compute_digest()


def test_expected_name_is_used():
    source_uri = "test:/my/test/uri"
    source = SampleDatasetSource._resolve(source_uri)

    dataset_without_name = SampleDataset(data_list=[1, 2, 3], source=source)
    assert dataset_without_name.name == "dataset"

    dataset_with_name = SampleDataset(data_list=[1, 2, 3], source=source, name="testname")
    assert dataset_with_name.name == "testname"
```

--------------------------------------------------------------------------------

---[FILE: test_dataset_registry.py]---
Location: mlflow-master/tests/data/test_dataset_registry.py

```python
from unittest import mock

import pytest

import mlflow.data
from mlflow.data.dataset import Dataset
from mlflow.data.dataset_registry import DatasetRegistry, register_constructor
from mlflow.data.dataset_source_registry import DatasetSourceRegistry, resolve_dataset_source
from mlflow.exceptions import MlflowException

from tests.resources.data.dataset import SampleDataset
from tests.resources.data.dataset_source import SampleDatasetSource


@pytest.fixture
def dataset_source_registry():
    registry = DatasetSourceRegistry()
    with mock.patch("mlflow.data.dataset_source_registry._dataset_source_registry", wraps=registry):
        yield registry


@pytest.fixture
def dataset_registry():
    registry = DatasetRegistry()
    with mock.patch("mlflow.data.dataset_registry._dataset_registry", wraps=registry):
        yield registry


def test_register_constructor_function_performs_validation():
    registry = DatasetRegistry()

    def from_good_function(
        path: str,
        name: str | None = None,
        digest: str | None = None,
    ) -> Dataset:
        pass

    registry.register_constructor(from_good_function)

    def bad_name_fn(
        name: str | None = None,
        digest: str | None = None,
    ) -> Dataset:
        pass

    with pytest.raises(MlflowException, match="Constructor name must start with"):
        registry.register_constructor(bad_name_fn)

    with pytest.raises(MlflowException, match="Constructor name must start with"):
        registry.register_constructor(
            constructor_fn=from_good_function, constructor_name="bad_name"
        )

    def from_no_name_fn(
        digest: str | None = None,
    ) -> Dataset:
        pass

    with pytest.raises(MlflowException, match="must define an optional parameter named 'name'"):
        registry.register_constructor(from_no_name_fn)

    def from_no_digest_fn(
        name: str | None = None,
    ) -> Dataset:
        pass

    with pytest.raises(MlflowException, match="must define an optional parameter named 'digest'"):
        registry.register_constructor(from_no_digest_fn)

    def from_bad_return_type_fn(
        path: str,
        name: str | None = None,
        digest: str | None = None,
    ) -> str:
        pass

    with pytest.raises(MlflowException, match="must have a return type annotation.*Dataset"):
        registry.register_constructor(from_bad_return_type_fn)

    def from_no_return_type_fn(
        path: str,
        name: str | None = None,
        digest: str | None = None,
    ):
        pass

    with pytest.raises(MlflowException, match="must have a return type annotation.*Dataset"):
        registry.register_constructor(from_no_return_type_fn)


def test_register_constructor_from_entrypoints_and_call(dataset_registry, tmp_path):
    from mlflow_test_plugin.dummy_dataset import DummyDataset

    dataset_registry.register_entrypoints()

    dataset = mlflow.data.from_dummy(
        data_list=[1, 2, 3],
        # Use a DummyDatasetSource URI from mlflow_test_plugin.dummy_dataset_source, which
        # is registered as an entrypoint whenever mlflow-test-plugin is installed
        source="dummy:" + str(tmp_path),
        name="dataset_name",
        digest="foo",
    )
    assert isinstance(dataset, DummyDataset)
    assert dataset.data_list == [1, 2, 3]
    assert dataset.name == "dataset_name"
    assert dataset.digest == "foo"


def test_register_constructor_and_call(dataset_registry, dataset_source_registry, tmp_path):
    dataset_source_registry.register(SampleDatasetSource)

    def from_test(data_list, source, name=None, digest=None) -> SampleDataset:
        resolved_source: SampleDatasetSource = resolve_dataset_source(
            source, candidate_sources=[SampleDatasetSource]
        )
        return SampleDataset(data_list=data_list, source=resolved_source, name=name, digest=digest)

    register_constructor(constructor_fn=from_test)
    register_constructor(constructor_name="from_test_2", constructor_fn=from_test)

    dataset1 = mlflow.data.from_test(
        data_list=[1, 2, 3],
        # Use a SampleDatasetSourceURI
        source="test:" + str(tmp_path),
        name="name1",
        digest="digest1",
    )
    assert isinstance(dataset1, SampleDataset)
    assert dataset1.data_list == [1, 2, 3]
    assert dataset1.name == "name1"
    assert dataset1.digest == "digest1"

    dataset2 = mlflow.data.from_test_2(
        data_list=[4, 5, 6],
        # Use a SampleDatasetSourceURI
        source="test:" + str(tmp_path),
        name="name2",
        digest="digest2",
    )
    assert isinstance(dataset2, SampleDataset)
    assert dataset2.data_list == [4, 5, 6]
    assert dataset2.name == "name2"
    assert dataset2.digest == "digest2"


def test_dataset_source_registration_failure(dataset_source_registry):
    with mock.patch.object(dataset_source_registry, "register", side_effect=ImportError("Error")):
        with pytest.warns(UserWarning, match="Failure attempting to register dataset constructor"):
            dataset_source_registry.register_entrypoints()
```

--------------------------------------------------------------------------------

---[FILE: test_dataset_source.py]---
Location: mlflow-master/tests/data/test_dataset_source.py

```python
import json

import pandas as pd
import pytest

import mlflow.data
from mlflow.exceptions import MlflowException

from tests.resources.data.dataset_source import SampleDatasetSource


def test_load(tmp_path):
    assert SampleDatasetSource("test:" + str(tmp_path)).load() == str(tmp_path)


def test_conversion_to_json_and_back():
    uri = "test:/my/test/uri"
    source = SampleDatasetSource._resolve(uri)
    source_json = source.to_json()
    assert json.loads(source_json)["uri"] == uri
    reloaded_source = SampleDatasetSource.from_json(source_json)
    assert reloaded_source.uri == source.uri


def test_get_source_obtains_expected_file_source(tmp_path):
    df = pd.DataFrame([[1, 2, 3], [1, 2, 3]], columns=["a", "b", "c"])
    path = tmp_path / "temp.csv"
    df.to_csv(path)
    pandas_ds = mlflow.data.from_pandas(df, source=path)

    source1 = mlflow.data.get_source(pandas_ds)
    assert json.loads(source1.to_json()) == json.loads(pandas_ds.source.to_json())

    with mlflow.start_run() as r:
        mlflow.log_input(pandas_ds)

    run = mlflow.get_run(r.info.run_id)

    ds_input = run.inputs.dataset_inputs[0]
    source2 = mlflow.data.get_source(ds_input)
    assert json.loads(source2.to_json()) == json.loads(pandas_ds.source.to_json())

    ds_entity = run.inputs.dataset_inputs[0].dataset
    source3 = mlflow.data.get_source(ds_entity)
    assert json.loads(source3.to_json()) == json.loads(pandas_ds.source.to_json())

    assert source1.load() == source2.load() == source3.load() == str(path)


def test_get_source_obtains_expected_code_source():
    df = pd.DataFrame([[1, 2, 3], [1, 2, 3]], columns=["a", "b", "c"])
    pandas_ds = mlflow.data.from_pandas(df)

    source1 = mlflow.data.get_source(pandas_ds)
    assert json.loads(source1.to_json()) == json.loads(pandas_ds.source.to_json())

    with mlflow.start_run() as r:
        mlflow.log_input(pandas_ds)

    run = mlflow.get_run(r.info.run_id)

    ds_input = run.inputs.dataset_inputs[0]
    source2 = mlflow.data.get_source(ds_input)
    assert json.loads(source2.to_json()) == json.loads(pandas_ds.source.to_json())

    ds_entity = run.inputs.dataset_inputs[0].dataset
    source3 = mlflow.data.get_source(ds_entity)
    assert json.loads(source3.to_json()) == json.loads(pandas_ds.source.to_json())


def test_get_source_throws_for_invalid_input(tmp_path):
    with pytest.raises(MlflowException, match="Unrecognized dataset type.*str"):
        mlflow.data.get_source(str(tmp_path))
```

--------------------------------------------------------------------------------

---[FILE: test_dataset_source_registry.py]---
Location: mlflow-master/tests/data/test_dataset_source_registry.py

```python
from typing import Any
from unittest import mock

import pytest

from mlflow.data.dataset_source_registry import DatasetSourceRegistry
from mlflow.exceptions import MlflowException

from tests.resources.data.dataset_source import SampleDatasetSource


def test_register_entrypoints_and_resolve(tmp_path):
    from mlflow_test_plugin.dummy_dataset_source import DummyDatasetSource

    registry = DatasetSourceRegistry()
    registry.register_entrypoints()

    uri = "dummy:" + str(tmp_path)
    resolved_source = registry.resolve(uri)
    assert isinstance(resolved_source, DummyDatasetSource)
    # Verify that the DummyDatasetSource is constructed with the correct URI
    assert resolved_source.uri == uri


def test_register_dataset_source_and_resolve(tmp_path):
    registry = DatasetSourceRegistry()
    registry.register(SampleDatasetSource)

    uri = "test:" + str(tmp_path)
    resolved_source = registry.resolve(uri)
    assert isinstance(resolved_source, SampleDatasetSource)
    # Verify that the SampleDatasetSource is constructed with the correct URI
    assert resolved_source.uri == uri


def test_register_dataset_source_and_load_from_json(tmp_path):
    registry = DatasetSourceRegistry()
    registry.register(SampleDatasetSource)
    resolved_source = registry.resolve("test:" + str(tmp_path))
    resolved_source_json = resolved_source.to_json()
    source_from_json = registry.get_source_from_json(
        source_json=resolved_source_json, source_type="test"
    )
    assert source_from_json.uri == resolved_source.uri


def test_load_from_json_throws_for_unrecognized_source_type(tmp_path):
    registry = DatasetSourceRegistry()
    registry.register(SampleDatasetSource)

    with pytest.raises(MlflowException, match="unrecognized source type: foo"):
        registry.get_source_from_json(source_json='{"bar": "123"}', source_type="foo")

    class CandidateDatasetSource1(SampleDatasetSource):
        @staticmethod
        def _get_source_type() -> str:
            return "candidate1"

        @staticmethod
        def _can_resolve(raw_source: Any) -> bool:
            return raw_source.startswith("candidate1")

    class CandidateDatasetSource2(CandidateDatasetSource1):
        @staticmethod
        def _get_source_type() -> str:
            return "candidate2"

        @staticmethod
        def _can_resolve(raw_source: Any) -> bool:
            return raw_source.startswith("candidate2")

    registry = DatasetSourceRegistry()
    registry.register(SampleDatasetSource)
    registry.register(CandidateDatasetSource1)
    registry.register(CandidateDatasetSource2)

    registry.resolve("test:" + str(tmp_path))
    registry.resolve("test:" + str(tmp_path), candidate_sources=[SampleDatasetSource])
    with pytest.raises(MlflowException, match="Could not find a source information resolver"):
        # SampleDatasetSource is the only source that can resolve raw sources with scheme "test",
        # and SampleDatasetSource is not a subclass of CandidateDatasetSource1
        registry.resolve("test:" + str(tmp_path), candidate_sources=[CandidateDatasetSource1])

    registry.resolve("candidate1:" + str(tmp_path))
    registry.resolve("candidate1:" + str(tmp_path), candidate_sources=[CandidateDatasetSource1])
    # CandidateDatasetSource1 is a subclass of SampleDatasetSource and is therefore considered
    # as a candidate for resolution
    registry.resolve("candidate1:" + str(tmp_path), candidate_sources=[SampleDatasetSource])
    with pytest.raises(MlflowException, match="Could not find a source information resolver"):
        # CandidateDatasetSource2 is not a superclass of CandidateDatasetSource1 or
        # SampleDatasetSource and cannot resolve raw sources with scheme "candidate1"
        registry.resolve("candidate1:" + str(tmp_path), candidate_sources=[CandidateDatasetSource2])


def test_resolve_dataset_source_maintains_consistent_order_and_uses_last_registered_match(tmp_path):
    from mlflow_test_plugin.dummy_dataset_source import DummyDatasetSource

    class SampleDatasetSourceCopy1(SampleDatasetSource):
        pass

    class SampleDatasetSourceCopy2(SampleDatasetSource):
        pass

    registry1 = DatasetSourceRegistry()
    registry1.register(SampleDatasetSource)
    registry1.register(SampleDatasetSourceCopy1)
    registry1.register(SampleDatasetSourceCopy2)
    source1 = registry1.resolve("test:/" + str(tmp_path))
    assert isinstance(source1, SampleDatasetSourceCopy2)

    registry2 = DatasetSourceRegistry()
    registry2.register(SampleDatasetSource)
    registry2.register(SampleDatasetSourceCopy2)
    registry2.register(SampleDatasetSourceCopy1)
    source2 = registry2.resolve("test:/" + str(tmp_path))
    assert isinstance(source2, SampleDatasetSourceCopy1)

    # Verify that a different matching dataset source can still be resolved via `candidates`
    source3 = registry2.resolve(
        "test:/" + str(tmp_path), candidate_sources=[SampleDatasetSourceCopy2]
    )
    assert isinstance(source3, SampleDatasetSourceCopy2)

    # Verify that last registered order applies to entrypoints too
    class DummyDatasetSourceCopy(DummyDatasetSource):
        pass

    registry3 = DatasetSourceRegistry()
    registry3.register(DummyDatasetSourceCopy)
    source4 = registry3.resolve("dummy:/" + str(tmp_path))
    assert isinstance(source4, DummyDatasetSourceCopy)
    registry3.register_entrypoints()
    source5 = registry3.resolve("dummy:/" + str(tmp_path))
    assert isinstance(source5, DummyDatasetSource)


def test_resolve_dataset_source_warns_when_multiple_matching_sources_found(tmp_path):
    class SampleDatasetSourceCopy1(SampleDatasetSource):
        pass

    class SampleDatasetSourceCopy2(SampleDatasetSource):
        pass

    registry1 = DatasetSourceRegistry()
    registry1.register(SampleDatasetSource)
    registry1.register(SampleDatasetSourceCopy1)
    registry1.register(SampleDatasetSourceCopy2)

    with mock.patch("mlflow.data.dataset_source_registry.warnings.warn") as mock_warn:
        registry1.resolve("test:/" + str(tmp_path))
        mock_warn.assert_called_once()
        call_args, _ = mock_warn.call_args
        multiple_match_msg = call_args[0]
        assert (
            "The specified dataset source can be interpreted in multiple ways" in multiple_match_msg
        )
        assert (
            "SampleDatasetSource, SampleDatasetSourceCopy1, SampleDatasetSourceCopy2"
            in multiple_match_msg
        )
        assert (
            "MLflow will assume that this is a SampleDatasetSourceCopy2 source"
            in multiple_match_msg
        )


def test_dataset_sources_are_importable_from_sources_module(tmp_path):
    from mlflow.data.sources import LocalArtifactDatasetSource

    src = LocalArtifactDatasetSource(tmp_path)
    assert src._get_source_type() == "local"
    assert src.uri == tmp_path

    from mlflow.data.sources import DeltaDatasetSource

    src = DeltaDatasetSource(path=tmp_path)
    assert src._get_source_type() == "delta_table"
    assert src.path == tmp_path
```

--------------------------------------------------------------------------------

---[FILE: test_delta_dataset_source.py]---
Location: mlflow-master/tests/data/test_delta_dataset_source.py

```python
import json
from unittest import mock

import pandas as pd
import pytest

from mlflow.data.dataset_source_registry import get_dataset_source_from_json
from mlflow.data.delta_dataset_source import DeltaDatasetSource
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_managed_catalog_messages_pb2 import GetTable, GetTableResponse
from mlflow.utils.proto_json_utils import message_to_json


@pytest.fixture(scope="module")
def spark_session():
    from pyspark.sql import SparkSession

    with (
        SparkSession.builder.master("local[*]")
        .config("spark.jars.packages", "io.delta:delta-spark_2.13:4.0.0")
        .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
        .config(
            "spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog"
        )
        .getOrCreate()
    ) as session:
        yield session


def test_delta_dataset_source_from_path(spark_session, tmp_path):
    df = pd.DataFrame([[1, 2, 3], [1, 2, 3]], columns=["a", "b", "c"])
    df_spark = spark_session.createDataFrame(df)
    path = str(tmp_path / "temp.delta")
    df_spark.write.format("delta").mode("overwrite").save(path)

    delta_datasource = DeltaDatasetSource(path=path)
    loaded_df_spark = delta_datasource.load()
    assert loaded_df_spark.count() == df_spark.count()
    assert delta_datasource.to_dict()["path"] == path

    reloaded_source = get_dataset_source_from_json(
        delta_datasource.to_json(), source_type=delta_datasource._get_source_type()
    )
    assert isinstance(reloaded_source, DeltaDatasetSource)
    assert type(delta_datasource) == type(reloaded_source)
    assert reloaded_source.to_json() == delta_datasource.to_json()


def test_delta_dataset_source_from_table(spark_session, tmp_path):
    df = pd.DataFrame([[1, 2, 3], [1, 2, 3]], columns=["a", "b", "c"])
    df_spark = spark_session.createDataFrame(df)
    df_spark.write.format("delta").mode("overwrite").saveAsTable(
        "default.temp_delta", path=tmp_path
    )

    delta_datasource = DeltaDatasetSource(delta_table_name="temp_delta")
    loaded_df_spark = delta_datasource.load()
    assert loaded_df_spark.count() == df_spark.count()
    assert delta_datasource.to_dict()["delta_table_name"] == "temp_delta"

    reloaded_source = get_dataset_source_from_json(
        delta_datasource.to_json(), source_type=delta_datasource._get_source_type()
    )
    assert isinstance(reloaded_source, DeltaDatasetSource)
    assert type(delta_datasource) == type(reloaded_source)
    assert reloaded_source.to_json() == delta_datasource.to_json()


def test_delta_dataset_source_from_table_versioned(spark_session, tmp_path):
    df = pd.DataFrame([[1, 2, 3], [1, 2, 3]], columns=["a", "b", "c"])
    df_spark = spark_session.createDataFrame(df)
    df_spark.write.format("delta").mode("overwrite").saveAsTable(
        "default.temp_delta_versioned", path=tmp_path
    )

    df2 = pd.DataFrame([[1, 2, 3]], columns=["a", "b", "c"])
    df2_spark = spark_session.createDataFrame(df2)
    df2_spark.write.format("delta").mode("overwrite").saveAsTable(
        "default.temp_delta_versioned", path=tmp_path
    )

    delta_datasource = DeltaDatasetSource(
        delta_table_name="temp_delta_versioned", delta_table_version=1
    )
    loaded_df_spark = delta_datasource.load()
    assert loaded_df_spark.count() == df2_spark.count()
    config = delta_datasource.to_dict()
    assert config["delta_table_name"] == "temp_delta_versioned"
    assert config["delta_table_version"] == 1

    reloaded_source = get_dataset_source_from_json(
        delta_datasource.to_json(), source_type=delta_datasource._get_source_type()
    )
    assert isinstance(reloaded_source, DeltaDatasetSource)
    assert type(delta_datasource) == type(reloaded_source)
    assert reloaded_source.to_json() == delta_datasource.to_json()


def test_delta_dataset_source_too_many_inputs(spark_session, tmp_path):
    df = pd.DataFrame([[1, 2, 3], [1, 2, 3]], columns=["a", "b", "c"])
    df_spark = spark_session.createDataFrame(df)
    df_spark.write.format("delta").mode("overwrite").saveAsTable(
        "default.temp_delta_too_many_inputs", path=tmp_path
    )

    with pytest.raises(MlflowException, match='Must specify exactly one of "path" or "table_name"'):
        DeltaDatasetSource(path=tmp_path, delta_table_name="temp_delta_too_many_inputs")


def test_uc_table_id_retrieval_works(spark_session, tmp_path):
    def mock_resolve_table_name(table_name, spark):
        if table_name == "temp_delta_versioned_with_id":
            return "default.temp_delta_versioned_with_id"
        return table_name

    def mock_lookup_table_id(table_name):
        if table_name == "default.temp_delta_versioned_with_id":
            return "uc_table_id_1"
        return None

    with (
        mock.patch(
            "mlflow.data.delta_dataset_source.get_full_name_from_sc",
            side_effect=mock_resolve_table_name,
        ),
        mock.patch(
            "mlflow.data.delta_dataset_source.DeltaDatasetSource._lookup_table_id",
            side_effect=mock_lookup_table_id,
        ),
        mock.patch(
            "mlflow.data.delta_dataset_source._get_active_spark_session",
            return_value=None,
        ),
        mock.patch(
            "mlflow.data.delta_dataset_source.DeltaDatasetSource._is_databricks_uc_table",
            return_value=True,
        ),
    ):
        df = pd.DataFrame([[1, 2, 3], [1, 2, 3]], columns=["a", "b", "c"])
        df_spark = spark_session.createDataFrame(df)
        df_spark.write.format("delta").mode("overwrite").saveAsTable(
            "default.temp_delta_versioned_with_id", path=tmp_path
        )

        df2 = pd.DataFrame([[1, 2, 3]], columns=["a", "b", "c"])
        df2_spark = spark_session.createDataFrame(df2)
        df2_spark.write.format("delta").mode("overwrite").saveAsTable(
            "default.temp_delta_versioned_with_id", path=tmp_path
        )

        delta_datasource = DeltaDatasetSource(
            delta_table_name="temp_delta_versioned_with_id", delta_table_version=1
        )
        loaded_df_spark = delta_datasource.load()
        assert loaded_df_spark.count() == df2_spark.count()
        assert delta_datasource.to_json() == json.dumps(
            {
                "delta_table_name": "default.temp_delta_versioned_with_id",
                "delta_table_version": 1,
                "is_databricks_uc_table": True,
                "delta_table_id": "uc_table_id_1",
            }
        )


def _args(endpoint, json_body):
    return {
        "host_creds": None,
        "endpoint": f"/api/2.0/unity-catalog/tables/{endpoint}",
        "method": "GET",
        "json_body": json_body,
        "response_proto": GetTableResponse,
    }


@pytest.mark.parametrize(
    ("call_endpoint_response", "expected_lookup_response", "test_table_name"),
    [
        (None, None, "delta_table_1"),
        (Exception("Exception from call_endpoint"), None, "delta_table_2"),
        (GetTableResponse(table_id="uc_table_id_1"), "uc_table_id_1", "delta_table_3"),
    ],
)
def test_lookup_table_id(
    call_endpoint_response, expected_lookup_response, test_table_name, tmp_path
):
    def mock_resolve_table_name(table_name, spark):
        if table_name == test_table_name:
            return f"default.{test_table_name}"
        return table_name

    def mock_call_endpoint(host_creds, endpoint, method, json_body, response_proto):
        if isinstance(call_endpoint_response, Exception):
            raise call_endpoint_response
        return call_endpoint_response

    with (
        mock.patch(
            "mlflow.data.delta_dataset_source.get_full_name_from_sc",
            side_effect=mock_resolve_table_name,
        ),
        mock.patch(
            "mlflow.data.delta_dataset_source._get_active_spark_session",
            return_value=None,
        ),
        mock.patch(
            "mlflow.data.delta_dataset_source.get_databricks_host_creds",
            return_value=None,
        ),
        mock.patch(
            "mlflow.data.delta_dataset_source.DeltaDatasetSource._is_databricks_uc_table",
            return_value=True,
        ),
        mock.patch(
            "mlflow.data.delta_dataset_source.call_endpoint",
            side_effect=mock_call_endpoint,
        ) as mock_endpoint,
    ):
        delta_datasource = DeltaDatasetSource(
            delta_table_name=test_table_name, delta_table_version=1
        )
        assert delta_datasource._lookup_table_id(test_table_name) == expected_lookup_response
        req_body = message_to_json(GetTable(full_name_arg=test_table_name))
        call_args = _args(test_table_name, req_body)
        mock_endpoint.assert_any_call(**call_args)


@pytest.mark.parametrize(
    ("table_name", "expected_result"),
    [
        ("default.test", True),
        ("hive_metastore.test", False),
        ("spark_catalog.test", False),
        ("samples.test", False),
    ],
)
def test_is_databricks_uc_table(table_name, expected_result):
    with (
        mock.patch(
            "mlflow.data.delta_dataset_source.get_full_name_from_sc",
            return_value=table_name,
        ),
        mock.patch(
            "mlflow.data.delta_dataset_source._get_active_spark_session",
            return_value=None,
        ),
    ):
        delta_datasource = DeltaDatasetSource(delta_table_name=table_name, delta_table_version=1)
        assert delta_datasource._is_databricks_uc_table() == expected_result
```

--------------------------------------------------------------------------------

---[FILE: test_http_dataset_source.py]---
Location: mlflow-master/tests/data/test_http_dataset_source.py

```python
import json
import os
from unittest import mock

import pandas as pd
import pytest

from mlflow.data.dataset_source_registry import get_dataset_source_from_json, resolve_dataset_source
from mlflow.data.http_dataset_source import HTTPDatasetSource
from mlflow.exceptions import MlflowException
from mlflow.utils.os import is_windows
from mlflow.utils.rest_utils import cloud_storage_http_request


def test_source_to_and_from_json():
    url = "http://mywebsite.com/path/to/my/dataset.txt"
    source = HTTPDatasetSource(url)
    assert source.to_json() == json.dumps({"url": url})

    reloaded_source = get_dataset_source_from_json(
        source.to_json(), source_type=source._get_source_type()
    )
    assert isinstance(reloaded_source, HTTPDatasetSource)
    assert type(source) == type(reloaded_source)
    assert source.url == reloaded_source.url == url


def test_http_dataset_source_is_registered_and_resolvable():
    source1 = resolve_dataset_source(
        "http://mywebsite.com/path/to/my/dataset.txt", candidate_sources=[HTTPDatasetSource]
    )
    assert isinstance(source1, HTTPDatasetSource)
    assert source1.url == "http://mywebsite.com/path/to/my/dataset.txt"

    source2 = resolve_dataset_source(
        "https://otherwebsite.net", candidate_sources=[HTTPDatasetSource]
    )
    assert isinstance(source2, HTTPDatasetSource)
    assert source2.url == "https://otherwebsite.net"

    with pytest.raises(MlflowException, match="Could not find a source information resolver"):
        resolve_dataset_source("s3://mybucket", candidate_sources=[HTTPDatasetSource])

    with pytest.raises(MlflowException, match="Could not find a source information resolver"):
        resolve_dataset_source("otherscheme://mybucket", candidate_sources=[HTTPDatasetSource])

    with pytest.raises(MlflowException, match="Could not find a source information resolver"):
        resolve_dataset_source("htp://mybucket", candidate_sources=[HTTPDatasetSource])


def test_source_load(tmp_path):
    source1 = HTTPDatasetSource(
        "https://raw.githubusercontent.com/mlflow/mlflow/master/tests/datasets/winequality-red.csv"
    )

    loaded1 = source1.load()
    parsed1 = pd.read_csv(loaded1, sep=";")
    # Verify that the expected data was downloaded by checking for an expected column and asserting
    # that several rows are present
    assert "fixed acidity" in parsed1.columns
    assert len(parsed1) > 10

    loaded2 = source1.load(dst_path=tmp_path)
    assert loaded2 == str(tmp_path / "winequality-red.csv")
    parsed2 = pd.read_csv(loaded2, sep=";")
    # Verify that the expected data was downloaded by checking for an expected column and asserting
    # that several rows are present
    assert "fixed acidity" in parsed2.columns
    assert len(parsed1) > 10

    source2 = HTTPDatasetSource(
        "https://raw.githubusercontent.com/mlflow/mlflow/master/tests/datasets/winequality-red.csv#foo?query=param"
    )
    loaded3 = source2.load(dst_path=tmp_path)
    assert loaded3 == str(tmp_path / "winequality-red.csv")
    parsed3 = pd.read_csv(loaded3, sep=";")
    assert "fixed acidity" in parsed3.columns
    assert len(parsed1) > 10

    source3 = HTTPDatasetSource("https://github.com/")
    loaded4 = source3.load()
    assert os.path.exists(loaded4)
    assert os.path.basename(loaded4) == "dataset_source"

    source4 = HTTPDatasetSource("https://github.com")
    loaded5 = source4.load()
    assert os.path.exists(loaded5)
    assert os.path.basename(loaded5) == "dataset_source"

    def cloud_storage_http_request_with_fast_fail(*args, **kwargs):
        kwargs["max_retries"] = 1
        kwargs["timeout"] = 5
        return cloud_storage_http_request(*args, **kwargs)

    source5 = HTTPDatasetSource("https://nonexistentwebsitebuiltbythemlflowteam112312.com")
    with (
        mock.patch(
            "mlflow.data.http_dataset_source.cloud_storage_http_request",
            side_effect=cloud_storage_http_request_with_fast_fail,
        ),
        pytest.raises(Exception, match="Max retries exceeded with url"),
    ):
        source5.load()


@pytest.mark.parametrize(
    ("attachment_filename", "expected_filename"),
    [
        ("testfile.txt", "testfile.txt"),
        ('"testfile.txt"', "testfile.txt"),
        ("'testfile.txt'", "testfile.txt"),
        (None, "winequality-red.csv"),
    ],
)
def test_source_load_with_content_disposition_header(attachment_filename, expected_filename):
    def download_with_mock_content_disposition_headers(*args, **kwargs):
        response = cloud_storage_http_request(*args, **kwargs)
        if attachment_filename is not None:
            response.headers["Content-Disposition"] = f"attachment; filename={attachment_filename}"
        else:
            response.headers["Content-Disposition"] = "attachment"
        return response

    with mock.patch(
        "mlflow.data.http_dataset_source.cloud_storage_http_request",
        side_effect=download_with_mock_content_disposition_headers,
    ):
        source = HTTPDatasetSource(
            "https://raw.githubusercontent.com/mlflow/mlflow/master/tests/datasets/winequality-red.csv"
        )
        source.load()
        loaded = source.load()
        assert os.path.exists(loaded)
        assert os.path.basename(loaded) == expected_filename


@pytest.mark.parametrize(
    "filename",
    [
        "/foo/bar.txt",
        "./foo/bar.txt",
        "../foo/bar.txt",
        "foo/bar.txt",
    ],
)
def test_source_load_with_content_disposition_header_invalid_filename(filename):
    def download_with_mock_content_disposition_headers(*args, **kwargs):
        response = cloud_storage_http_request(*args, **kwargs)
        response.headers["Content-Disposition"] = f"attachment; filename={filename}"
        return response

    with mock.patch(
        "mlflow.data.http_dataset_source.cloud_storage_http_request",
        side_effect=download_with_mock_content_disposition_headers,
    ):
        source = HTTPDatasetSource(
            "https://raw.githubusercontent.com/mlflow/mlflow/master/tests/datasets/winequality-red.csv"
        )

        with pytest.raises(MlflowException, match="Invalid filename in Content-Disposition header"):
            source.load()


@pytest.mark.skipif(not is_windows(), reason="This test only passes on Windows")
@pytest.mark.parametrize(
    "filename",
    [
        r"..\..\poc.txt",
        r"Users\User\poc.txt",
    ],
)
def test_source_load_with_content_disposition_header_invalid_filename_windows(filename):
    def download_with_mock_content_disposition_headers(*args, **kwargs):
        response = cloud_storage_http_request(*args, **kwargs)
        response.headers = {"Content-Disposition": f"attachment; filename={filename}"}
        return response

    with mock.patch(
        "mlflow.data.http_dataset_source.cloud_storage_http_request",
        side_effect=download_with_mock_content_disposition_headers,
    ):
        source = HTTPDatasetSource(
            "https://raw.githubusercontent.com/mlflow/mlflow/master/tests/datasets/winequality-red.csv"
        )

        # Expect an MlflowException for invalid filenames
        with pytest.raises(MlflowException, match="Invalid filename in Content-Disposition header"):
            source.load()
```

--------------------------------------------------------------------------------

````
