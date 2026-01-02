---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 940
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 940 of 991)

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

---[FILE: test_sqlalchemy_store_schema.py]---
Location: mlflow-master/tests/store/tracking/test_sqlalchemy_store_schema.py
Signals: SQLAlchemy

```python
import os
import sqlite3

import pytest
import sqlalchemy
from alembic import command
from alembic.autogenerate import compare_metadata
from alembic.migration import MigrationContext
from alembic.script import ScriptDirectory

import mlflow.db
from mlflow.exceptions import MlflowException
from mlflow.store.db.base_sql_model import Base
from mlflow.store.db.utils import _get_alembic_config, _verify_schema
from mlflow.store.tracking.dbmodels.initial_models import Base as InitialBase
from mlflow.store.tracking.sqlalchemy_store import SqlAlchemyStore

from tests.integration.utils import invoke_cli_runner
from tests.store.dump_schema import dump_db_schema


def _assert_schema_files_equal(generated_schema_file, expected_schema_file):
    """
    Assert equivalence of two SQL schema dump files consisting of CREATE TABLE statements delimited
    by double-newlines, allowing for the reordering of individual lines within each CREATE TABLE
    statement to account for differences in schema-dumping across platforms & Python versions.
    """
    # Extract "CREATE TABLE" statement chunks from both files, assuming tables are listed in the
    # same order across files
    with open(generated_schema_file) as generated_schema_handle:
        generated_schema_table_chunks = generated_schema_handle.read().split("\n\n")
    with open(expected_schema_file) as expected_schema_handle:
        expected_schema_table_chunks = expected_schema_handle.read().split("\n\n")
    # Compare the two files table-by-table. We assume each CREATE TABLE statement is valid and
    # so sort the lines within the statements before comparing them.
    for generated_schema_table, expected_schema_table in zip(
        generated_schema_table_chunks, expected_schema_table_chunks
    ):
        generated_lines = [x.strip() for x in sorted(generated_schema_table.split("\n"))]
        expected_lines = [x.strip() for x in sorted(expected_schema_table.split("\n"))]
        assert generated_lines == expected_lines, (
            "Generated schema did not match expected schema. Generated schema had table "
            f"definition:\n{generated_schema_table}\nExpected schema had table definition:"
            f"\n{expected_schema_table}\nIf you intended to make schema changes, run "
            f"'python tests/store/dump_schema.py {expected_schema_file}' from your checkout"
            " of MLflow to update the schema snapshot."
        )


@pytest.fixture
def expected_schema_file():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.normpath(
        os.path.join(current_dir, os.pardir, os.pardir, "resources", "db", "latest_schema.sql")
    )


@pytest.fixture
def db_url(tmp_path):
    db_file = tmp_path.joinpath("db_file")
    return f"sqlite:///{db_file}"


def test_sqlalchemystore_idempotently_generates_up_to_date_schema(
    tmp_path, db_url, expected_schema_file
):
    generated_schema_file = tmp_path.joinpath("generated-schema.sql")
    # Repeatedly initialize a SQLAlchemyStore against the same DB URL. Initialization should
    # succeed and the schema should be the same.
    for _ in range(3):
        SqlAlchemyStore(db_url, tmp_path.joinpath("ARTIFACTS").as_uri())
        dump_db_schema(db_url, dst_file=generated_schema_file)
        _assert_schema_files_equal(generated_schema_file, expected_schema_file)


def test_running_migrations_generates_expected_schema(tmp_path, expected_schema_file, db_url):
    engine = sqlalchemy.create_engine(db_url)
    InitialBase.metadata.create_all(engine)
    invoke_cli_runner(mlflow.db.commands, ["upgrade", db_url])
    generated_schema_file = tmp_path.joinpath("generated-schema.sql")
    dump_db_schema(db_url, generated_schema_file)
    _assert_schema_files_equal(generated_schema_file, expected_schema_file)


def test_sqlalchemy_store_detects_schema_mismatch(db_url):
    def _assert_invalid_schema(engine):
        with pytest.raises(MlflowException, match="Detected out-of-date database schema."):
            _verify_schema(engine)

    # Initialize an empty database & verify that we detect a schema mismatch
    engine = sqlalchemy.create_engine(db_url)
    _assert_invalid_schema(engine)
    # Create legacy tables, verify schema is still out of date
    InitialBase.metadata.create_all(engine)
    _assert_invalid_schema(engine)
    # Run each migration. Until the last one, schema should be out of date
    config = _get_alembic_config(db_url)
    script = ScriptDirectory.from_config(config)
    revisions = list(script.walk_revisions())
    revisions.reverse()
    for rev in revisions[:-1]:
        command.upgrade(config, rev.revision)
        _assert_invalid_schema(engine)
    # Run migrations, schema verification should now pass
    invoke_cli_runner(mlflow.db.commands, ["upgrade", db_url])
    _verify_schema(engine)


def test_store_generated_schema_matches_base(tmp_path, db_url):
    # Create a SQLAlchemyStore against tmpfile, directly verify that tmpfile contains a
    # database with a valid schema
    SqlAlchemyStore(db_url, tmp_path.joinpath("ARTIFACTS").as_uri())
    engine = sqlalchemy.create_engine(db_url)
    mc = MigrationContext.configure(engine.connect(), opts={"compare_type": False})
    diff = compare_metadata(mc, Base.metadata)
    # `diff` contains several `remove_index` operations because `Base.metadata` does not contain
    # index metadata but `mc` does. Note this doesn't mean the MLflow database is missing indexes
    # as tested in `test_create_index_on_run_uuid`.
    diff = [d for d in diff if (d[0] not in ["remove_index", "add_index", "add_fk"])]
    assert len(diff) == 0, (
        "if this test is failing after writing a DB migration, please make sure you've "
        "updated the ORM definitions in `mlflow/store/tracking/dbmodels/models.py`."
    )


def test_create_index_on_run_uuid(tmp_path, db_url):
    # Test for mlflow/store/db_migrations/versions/bd07f7e963c5_create_index_on_run_uuid.py
    SqlAlchemyStore(db_url, tmp_path.joinpath("ARTIFACTS").as_uri())
    with sqlite3.connect(db_url[len("sqlite:///") :]) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type = 'index'")
        all_index_names = [r[0] for r in cursor.fetchall()]
        run_uuid_index_names = {
            "index_params_run_uuid",
            "index_metrics_run_uuid",
            "index_latest_metrics_run_uuid",
            "index_tags_run_uuid",
        }
        assert run_uuid_index_names.issubset(all_index_names)


def test_index_for_dataset_tables(tmp_path, db_url):
    # Test for
    # mlflow/store/db_migrations/versions/7f2a7d5fae7d_add_datasets_inputs_input_tags_tables.py
    SqlAlchemyStore(db_url, tmp_path.joinpath("ARTIFACTS").as_uri())
    with sqlite3.connect(db_url[len("sqlite:///") :]) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type = 'index'")
        all_index_names = [r[0] for r in cursor.fetchall()]
        new_index_names = {
            "index_datasets_experiment_id_dataset_source_type",
            "index_inputs_input_uuid",
            "index_inputs_destination_type_destination_id_source_type",
        }
        assert new_index_names.issubset(all_index_names)


def test_secrets_and_endpoints_tables(tmp_path, db_url):
    SqlAlchemyStore(db_url, tmp_path.joinpath("ARTIFACTS").as_uri())
    with sqlite3.connect(db_url[len("sqlite:///") :]) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type = 'table'")
        all_table_names = [r[0] for r in cursor.fetchall()]
        expected_tables = {
            "secrets",
            "endpoints",
            "model_definitions",
            "endpoint_model_mappings",
            "endpoint_bindings",
        }
        assert expected_tables.issubset(all_table_names)
        cursor.execute("SELECT name FROM sqlite_master WHERE type = 'index'")
        all_index_names = [r[0] for r in cursor.fetchall()]
        expected_indexes = {
            "index_model_definitions_secret_id",
            "index_model_definitions_provider",
            "unique_model_definition_name",
            "index_endpoint_model_mappings_endpoint_id",
            "index_endpoint_model_mappings_model_definition_id",
            "unique_endpoint_model_mapping",
            # endpoint_bindings uses composite PK (endpoint_id, resource_type, resource_id)
            # which serves as an implicit index
            "unique_secret_name",
            "unique_endpoint_name",
        }
        assert expected_indexes.issubset(all_index_names)
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/tests/store/tracking/__init__.py

```python
import json

import pytest

from mlflow.entities import RunTag
from mlflow.models import Model
from mlflow.utils.mlflow_tags import MLFLOW_LOGGED_MODELS


class AbstractStoreTest:
    def create_test_run(self):
        raise Exception("this should be overridden")

    def get_store(self):
        raise Exception("this should be overridden")

    def test_record_logged_model(self):
        store = self.get_store()
        run_id = self.create_test_run().info.run_id
        m = Model(artifact_path="model/path", run_id=run_id, flavors={"tf": "flavor body"})
        store.record_logged_model(run_id, m)
        self._verify_logged(
            store,
            run_id=run_id,
            params=[],
            metrics=[],
            tags=[RunTag(MLFLOW_LOGGED_MODELS, json.dumps([m.to_dict()]))],
        )
        m2 = Model(
            artifact_path="some/other/path", run_id=run_id, flavors={"R": {"property": "value"}}
        )
        store.record_logged_model(run_id, m2)
        self._verify_logged(
            store,
            run_id,
            params=[],
            metrics=[],
            tags=[RunTag(MLFLOW_LOGGED_MODELS, json.dumps([m.to_dict(), m2.to_dict()]))],
        )
        m3 = Model(
            artifact_path="some/other/path2", run_id=run_id, flavors={"R2": {"property": "value"}}
        )
        store.record_logged_model(run_id, m3)
        self._verify_logged(
            store,
            run_id,
            params=[],
            metrics=[],
            tags=[
                RunTag(MLFLOW_LOGGED_MODELS, json.dumps([m.to_dict(), m2.to_dict(), m3.to_dict()]))
            ],
        )
        with pytest.raises(
            TypeError,
            match="Argument 'mlflow_model' should be mlflow.models.Model, got '<class 'dict'>'",
        ):
            store.record_logged_model(run_id, m.to_dict())

    @staticmethod
    def _verify_logged(store, run_id, metrics, params, tags):
        run = store.get_run(run_id)
        all_metrics = sum((store.get_metric_history(run_id, key) for key in run.data.metrics), [])
        assert len(all_metrics) == len(metrics)
        logged_metrics = [(m.key, m.value, m.timestamp, m.step) for m in all_metrics]
        assert set(logged_metrics) == {(m.key, m.value, m.timestamp, m.step) for m in metrics}
        logged_tags = set(run.data.tags.items())
        assert {(tag.key, tag.value) for tag in tags} <= logged_tags
        assert len(run.data.params) == len(params)
        assert set(run.data.params.items()) == {(param.key, param.value) for param in params}
```

--------------------------------------------------------------------------------

---[FILE: conftest.py]---
Location: mlflow-master/tests/store/_unity_catalog/conftest.py

```python
from unittest import mock

import pytest

import mlflow
from mlflow.utils.rest_utils import MlflowHostCreds

_DATABRICKS_UC_REGISTRY_URI = "databricks-uc"
_DATABRICKS_TRACKING_URI = "databricks"
_DATABRICKS_UC_OSS_REGISTRY_URI = "uc"
_REGISTRY_HOST_CREDS = MlflowHostCreds("https://hello-registry")
_TRACKING_HOST_CREDS = MlflowHostCreds("https://hello-tracking")


def mock_host_creds(uri):
    if uri == _DATABRICKS_TRACKING_URI:
        return _TRACKING_HOST_CREDS
    elif uri in (_DATABRICKS_UC_REGISTRY_URI, _DATABRICKS_UC_OSS_REGISTRY_URI):
        return _REGISTRY_HOST_CREDS
    raise Exception(f"Got unexpected store URI {uri}")


@pytest.fixture
def mock_databricks_uc_host_creds():
    with mock.patch(
        "mlflow.store._unity_catalog.registry.rest_store.get_databricks_host_creds",
        side_effect=mock_host_creds,
    ):
        yield


@pytest.fixture
def mock_databricks_uc_oss_host_creds():
    with mock.patch(
        "mlflow.store._unity_catalog.registry.uc_oss_rest_store.get_oss_host_creds",
        side_effect=mock_host_creds,
    ):
        yield


@pytest.fixture
def configure_client_for_uc(mock_databricks_uc_host_creds):
    """
    Configure MLflow client to register models to UC
    """
    with mock.patch("mlflow.utils.databricks_utils.get_databricks_host_creds"):
        orig_registry_uri = mlflow.get_registry_uri()
        mlflow.set_registry_uri("databricks-uc")
        yield
        mlflow.set_registry_uri(orig_registry_uri)
```

--------------------------------------------------------------------------------

---[FILE: test_unity_catalog_oss_rest_store.py]---
Location: mlflow-master/tests/store/_unity_catalog/model_registry/test_unity_catalog_oss_rest_store.py

```python
import json
from unittest import mock

import pytest

from mlflow.protos.unity_catalog_oss_messages_pb2 import (
    AwsCredentials,
    CreateRegisteredModel,
    DeleteModelVersion,
    DeleteRegisteredModel,
    FinalizeModelVersion,
    GetModelVersion,
    GetRegisteredModel,
    ListModelVersions,
    ListRegisteredModels,
    ModelVersionInfo,
    TemporaryCredentials,
    UpdateModelVersion,
    UpdateRegisteredModel,
)
from mlflow.store._unity_catalog.registry.uc_oss_rest_store import UnityCatalogOssStore
from mlflow.store.artifact.local_artifact_repo import LocalArtifactRepository
from mlflow.store.artifact.optimized_s3_artifact_repo import OptimizedS3ArtifactRepository
from mlflow.utils.proto_json_utils import message_to_json

from tests.helper_functions import mock_http_200
from tests.store._unity_catalog.conftest import _REGISTRY_HOST_CREDS


@pytest.fixture
def store(mock_databricks_uc_oss_host_creds):
    with mock.patch("mlflow.utils.oss_registry_utils.get_oss_host_creds"):
        yield UnityCatalogOssStore(store_uri="uc")


@pytest.fixture
def creds():
    with mock.patch(
        "mlflow.store._unity_catalog.registry.uc_oss_rest_store.get_oss_host_creds",
        return_value=_REGISTRY_HOST_CREDS,
    ):
        yield


def _args(endpoint, method, json_body, host_creds, extra_headers):
    res = {
        "host_creds": host_creds,
        "endpoint": f"/api/2.1/unity-catalog/{endpoint}",
        "method": method,
        "extra_headers": extra_headers,
    }
    if extra_headers is None:
        del res["extra_headers"]
    if method == "GET":
        res["params"] = json.loads(json_body)
    else:
        res["json"] = json.loads(json_body)
    return res


def _verify_requests(
    http_request,
    endpoint,
    method,
    proto_message,
    host_creds=_REGISTRY_HOST_CREDS,
    extra_headers=None,
):
    json_body = message_to_json(proto_message)
    call_args = _args(endpoint, method, json_body, host_creds, extra_headers)
    http_request.assert_any_call(**call_args)


@mock_http_200
def test_create_registered_model(mock_http, store):
    description = "best model ever"
    store.create_registered_model(name="catalog_1.schema_1.model_1", description=description)
    _verify_requests(
        mock_http,
        "models",
        "POST",
        CreateRegisteredModel(
            name="model_1",
            catalog_name="catalog_1",
            schema_name="schema_1",
            comment=description,
        ),
    )


@mock_http_200
def test_update_registered_model(mock_http, store, creds):
    description = "best model ever"
    store.update_registered_model(name="catalog_1.schema_1.model_1", description=description)
    _verify_requests(
        mock_http,
        "models/catalog_1.schema_1.model_1",
        "PATCH",
        UpdateRegisteredModel(
            full_name="catalog_1.schema_1.model_1",
            comment=description,
        ),
    )


@mock_http_200
def test_get_registered_model(mock_http, store, creds):
    model_name = "catalog_1.schema_1.model_1"
    store.get_registered_model(name=model_name)
    _verify_requests(
        mock_http,
        "models/catalog_1.schema_1.model_1",
        "GET",
        GetRegisteredModel(full_name="catalog_1.schema_1.model_1"),
    )


@mock_http_200
def test_delete_registered_model(mock_http, store, creds):
    model_name = "catalog_1.schema_1.model_1"
    store.delete_registered_model(name=model_name)
    _verify_requests(
        mock_http,
        "models/catalog_1.schema_1.model_1",
        "DELETE",
        DeleteRegisteredModel(
            full_name="catalog_1.schema_1.model_1",
        ),
    )


@mock_http_200
def test_create_model_version(mock_http, store, creds):
    # Mock the context manager for _local_model_dir
    mock_local_model_dir = mock.Mock()
    mock_local_model_dir.__enter__ = mock.Mock(return_value="/mock/local/model/dir")
    mock_local_model_dir.__exit__ = mock.Mock(return_value=None)

    with (
        mock.patch.object(store, "_local_model_dir", return_value=mock_local_model_dir),
        mock.patch.object(
            store, "_get_artifact_repo", return_value=mock.Mock()
        ) as mock_artifact_repo,
    ):
        mock_artifact_repo.log_artifacts.return_value = None

        model_name = "catalog_1.schema_1.model_1"
        store.create_model_version(
            name=model_name, source="source", run_id="run_id", description="description"
        )
        _verify_requests(
            mock_http,
            "models/catalog_1.schema_1.model_1/versions/0/finalize",
            "PATCH",
            FinalizeModelVersion(full_name=model_name, version=0),
        )


@pytest.mark.parametrize("version", [0, "0"])
@mock_http_200
def test_get_model_version(mock_http, store, creds, version):
    model_name = "catalog_1.schema_1.model_1"
    store.get_model_version(name=model_name, version=version)
    _verify_requests(
        mock_http,
        "models/catalog_1.schema_1.model_1/versions/0",
        "GET",
        GetModelVersion(full_name=model_name, version=int(version)),
    )


@pytest.mark.parametrize("version", [0, "0"])
@mock_http_200
def test_update_model_version(mock_http, store, creds, version):
    model_name = "catalog_1.schema_1.model_1"
    store.update_model_version(name=model_name, version=version, description="new description")
    _verify_requests(
        mock_http,
        "models/catalog_1.schema_1.model_1/versions/0",
        "PATCH",
        UpdateModelVersion(
            full_name=model_name,
            version=int(version),
            comment="new description",
        ),
    )


@pytest.mark.parametrize("version", [0, "0"])
@mock_http_200
def test_delete_model_version(mock_http, store, creds, version):
    model_name = "catalog_1.schema_1.model_1"
    store.delete_model_version(name=model_name, version=version)
    _verify_requests(
        mock_http,
        "models/catalog_1.schema_1.model_1/versions/0",
        "DELETE",
        DeleteModelVersion(full_name=model_name, version=int(version)),
    )


@mock_http_200
def test_search_registered_models(mock_http, store, creds):
    max_results = 10
    page_token = "page_token"
    store.search_registered_models(
        max_results=max_results,
        page_token=page_token,
    )
    _verify_requests(
        mock_http,
        "models",
        "GET",
        ListRegisteredModels(
            max_results=max_results,
            page_token=page_token,
        ),
    )


@mock_http_200
def test_search_model_versions(mock_http, store, creds):
    filter_string = "name = 'catalog_1.schema_1.model_1'"
    max_results = 10
    page_token = "page_token"

    store.search_model_versions(
        filter_string=filter_string,
        max_results=max_results,
        page_token=page_token,
    )

    _verify_requests(
        mock_http,
        "models/catalog_1.schema_1.model_1/versions",
        "GET",
        ListModelVersions(
            full_name="catalog_1.schema_1.model_1", page_token=page_token, max_results=max_results
        ),
    )


def test_get_artifact_repo_file_uri(store, creds):
    model_version_response = ModelVersionInfo(
        model_name="model_1",
        catalog_name="catalog_1",
        schema_name="schema_1",
        version=0,
        source="models:/catalog_1.schema_1.model_1/0",
        storage_location="file:/mock/local/model/dir",
    )
    result = store._get_artifact_repo(model_version_response)
    assert isinstance(result, LocalArtifactRepository)


def test_get_artifact_repo_s3(store, creds):
    model_version_response = ModelVersionInfo(
        model_name="model_1",
        catalog_name="catalog_1",
        schema_name="schema_1",
        version=0,
        source="models:/catalog_1.schema_1.model_1/0",
        storage_location="s3://my_bucket/my/file.txt",
    )
    temporary_creds = TemporaryCredentials(
        aws_temp_credentials=AwsCredentials(
            access_key_id="fake_key_id",
            secret_access_key="fake_secret_access_key",
            session_token="fake_session_token",
        )
    )
    with mock.patch.object(
        store, "_get_temporary_model_version_write_credentials_oss", return_value=temporary_creds
    ):
        result = store._get_artifact_repo(model_version_response)
        assert isinstance(result, OptimizedS3ArtifactRepository)
```

--------------------------------------------------------------------------------

````
