---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:55Z
part: 970
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 970 of 991)

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

---[FILE: test_utils.py]---
Location: mlflow-master/tests/tracking/_model_registry/test_utils.py
Signals: SQLAlchemy

```python
import io
import pickle
from unittest import mock

import pytest

from mlflow.environment_variables import MLFLOW_TRACKING_URI
from mlflow.store._unity_catalog.registry.rest_store import UcModelRegistryStore
from mlflow.store.db.db_types import DATABASE_ENGINES
from mlflow.store.model_registry.rest_store import RestStore
from mlflow.store.model_registry.sqlalchemy_store import SqlAlchemyStore
from mlflow.tracking._model_registry.utils import (
    _get_store,
    _resolve_registry_uri,
    get_registry_uri,
    set_registry_uri,
)
from mlflow.tracking.registry import UnsupportedModelRegistryStoreURIException

# Disable mocking tracking URI here, as we want to test setting the tracking URI via
# environment variable. See
# http://doc.pytest.org/en/latest/skipping.html#skip-all-test-functions-of-a-class-or-module
# and https://github.com/mlflow/mlflow/blob/master/CONTRIBUTING.md#writing-python-tests
# for more information.
pytestmark = pytest.mark.notrackingurimock


@pytest.fixture
def reset_registry_uri():
    yield
    set_registry_uri(None)


def test_set_get_registry_uri():
    with mock.patch(
        "mlflow.tracking._model_registry.utils._resolve_tracking_uri"
    ) as get_tracking_uri_mock:
        get_tracking_uri_mock.return_value = "databricks://tracking_sldkfj"
        uri = "databricks://registry/path"
        set_registry_uri(uri)
        assert get_registry_uri() == uri
        set_registry_uri(None)


def test_set_get_empty_registry_uri():
    with mock.patch(
        "mlflow.tracking._model_registry.utils._resolve_tracking_uri"
    ) as get_tracking_uri_mock:
        get_tracking_uri_mock.return_value = None
        set_registry_uri("")
        assert get_registry_uri() is None
        set_registry_uri(None)


def test_default_get_registry_uri_no_tracking_uri():
    with mock.patch(
        "mlflow.tracking._model_registry.utils._resolve_tracking_uri"
    ) as get_tracking_uri_mock:
        get_tracking_uri_mock.return_value = None
        set_registry_uri(None)
        assert get_registry_uri() is None


def test_default_get_registry_uri_with_databricks_tracking_uri_defaults_to_uc():
    tracking_uri = "databricks://tracking_werohoz"
    with mock.patch(
        "mlflow.tracking._model_registry.utils._resolve_tracking_uri"
    ) as resolve_tracking_uri_mock:
        resolve_tracking_uri_mock.return_value = tracking_uri
        set_registry_uri(None)
        # Should default to Unity Catalog when tracking URI starts with 'databricks'
        # and include the profile when present
        assert get_registry_uri() == "databricks-uc://tracking_werohoz"


@pytest.mark.parametrize(
    "tracking_uri",
    [
        "http://localhost:5000",
        "https://remote-server.com",
        "sqlite:///path/to/db.sqlite",
        "postgresql://user:pass@localhost/db",
        "file:///local/path",
    ],
)
def test_default_registry_uri_non_databricks_tracking_uri(tracking_uri):
    with mock.patch(
        "mlflow.tracking._tracking_service.utils.get_tracking_uri"
    ) as get_tracking_uri_mock:
        get_tracking_uri_mock.return_value = tracking_uri
        set_registry_uri(None)
        # Non-databricks URIs should be used directly as registry URI
        assert get_registry_uri() == tracking_uri


@pytest.mark.parametrize(
    ("tracking_uri", "expected_registry_uri"),
    [
        ("databricks", "databricks-uc"),
        ("databricks://profile", "databricks-uc://profile"),
        ("databricks://profile_name", "databricks-uc://profile_name"),
        ("databricks://workspace_url", "databricks-uc://workspace_url"),
        (
            "databricks://some.databricks.workspace.com",
            "databricks-uc://some.databricks.workspace.com",
        ),
    ],
)
def test_databricks_tracking_uri_variations_default_to_uc(tracking_uri, expected_registry_uri):
    with mock.patch(
        "mlflow.tracking._tracking_service.utils.get_tracking_uri"
    ) as get_tracking_uri_mock:
        get_tracking_uri_mock.return_value = tracking_uri
        set_registry_uri(None)
        # All databricks tracking URIs should default to Unity Catalog
        registry_uri = get_registry_uri()
        assert registry_uri == expected_registry_uri


def test_explicit_registry_uri_overrides_databricks_default():
    tracking_uri = "databricks://workspace"
    explicit_registry_uri = "databricks://different_workspace"

    with mock.patch(
        "mlflow.tracking._tracking_service.utils.get_tracking_uri"
    ) as get_tracking_uri_mock:
        get_tracking_uri_mock.return_value = tracking_uri
        set_registry_uri(explicit_registry_uri)
        # Explicit registry URI should override the databricks-uc default
        assert get_registry_uri() == explicit_registry_uri
        set_registry_uri(None)  # Reset for other tests


def test_registry_uri_from_environment_overrides_databricks_default():
    from mlflow.environment_variables import MLFLOW_REGISTRY_URI

    tracking_uri = "databricks://workspace"
    env_registry_uri = "http://env-registry-server:5000"

    with (
        mock.patch(
            "mlflow.tracking._tracking_service.utils.get_tracking_uri"
        ) as get_tracking_uri_mock,
        mock.patch.object(MLFLOW_REGISTRY_URI, "get", return_value=env_registry_uri),
    ):
        get_tracking_uri_mock.return_value = tracking_uri
        set_registry_uri(None)
        # Environment variable should override the databricks-uc default
        assert get_registry_uri() == env_registry_uri


def test_registry_uri_from_spark_session_overrides_databricks_default():
    tracking_uri = "databricks://workspace"
    spark_registry_uri = "databricks-uc://spark_profile"

    with (
        mock.patch(
            "mlflow.tracking._tracking_service.utils.get_tracking_uri"
        ) as get_tracking_uri_mock,
        mock.patch(
            "mlflow.tracking._model_registry.utils._get_registry_uri_from_spark_session"
        ) as get_spark_uri_mock,
    ):
        get_tracking_uri_mock.return_value = tracking_uri
        get_spark_uri_mock.return_value = spark_registry_uri
        set_registry_uri(None)
        # Spark session URI should override the databricks-uc default
        assert get_registry_uri() == spark_registry_uri


@pytest.mark.parametrize(
    ("tracking_uri", "expected_result"),
    [
        ("mydatabricks://custom", None),  # Should not match partial
        ("databricks", "databricks-uc"),  # Should match exact
        ("", None),  # Empty string should return None
    ],
)
def test_edge_cases_for_databricks_uri_detection(tracking_uri, expected_result):
    with mock.patch(
        "mlflow.tracking._tracking_service.utils.get_tracking_uri"
    ) as get_tracking_uri_mock:
        get_tracking_uri_mock.return_value = tracking_uri
        set_registry_uri(None)
        result = get_registry_uri()
        if expected_result is None:
            assert result == tracking_uri  # Should fallback to tracking URI
        else:
            assert result == expected_result


@pytest.mark.parametrize(
    ("tracking_uri", "registry_uri_param", "expected_result"),
    [
        # (tracking_uri, registry_uri_param, expected_result)
        ("databricks://workspace", None, "databricks-uc://workspace"),
        ("databricks", None, "databricks-uc"),
        ("http://localhost:5000", None, "http://localhost:5000"),
        ("databricks://workspace", "explicit://registry", "explicit://registry"),
        (None, None, None),
        ("", None, ""),
    ],
)
def test_resolve_registry_uri_consistency_with_get_registry_uri(
    tracking_uri, registry_uri_param, expected_result
):
    with mock.patch(
        "mlflow.tracking._model_registry.utils._resolve_tracking_uri"
    ) as mock_resolve_tracking:
        mock_resolve_tracking.return_value = tracking_uri
        set_registry_uri(None)  # Clear context

        result = _resolve_registry_uri(registry_uri_param, tracking_uri)
        assert result == expected_result, (
            f"Failed for tracking_uri={tracking_uri}, registry_uri={registry_uri_param}"
        )


def test_resolve_registry_uri_with_environment_variable():
    from mlflow.environment_variables import MLFLOW_REGISTRY_URI

    env_registry_uri = "http://env-registry:5000"
    tracking_uri = "databricks://workspace"

    with (
        mock.patch(
            "mlflow.tracking._model_registry.utils._resolve_tracking_uri"
        ) as mock_resolve_tracking,
        mock.patch.object(MLFLOW_REGISTRY_URI, "get", return_value=env_registry_uri),
    ):
        mock_resolve_tracking.return_value = tracking_uri
        set_registry_uri(None)  # Clear explicit setting

        # Environment variable should override databricks default
        result = _resolve_registry_uri(None, tracking_uri)
        assert result == env_registry_uri


def test_resolve_registry_uri_with_spark_session():
    spark_registry_uri = "databricks-uc://spark_profile"
    tracking_uri = "databricks://workspace"

    with (
        mock.patch(
            "mlflow.tracking._model_registry.utils._resolve_tracking_uri"
        ) as mock_resolve_tracking,
        mock.patch(
            "mlflow.tracking._model_registry.utils._get_registry_uri_from_spark_session"
        ) as mock_spark_uri,
    ):
        mock_resolve_tracking.return_value = tracking_uri
        mock_spark_uri.return_value = spark_registry_uri
        set_registry_uri(None)  # Clear explicit setting

        # Spark session URI should override databricks default
        result = _resolve_registry_uri(None, tracking_uri)
        assert result == spark_registry_uri


def test_get_store_rest_store_from_arg(monkeypatch):
    monkeypatch.setenv(MLFLOW_TRACKING_URI.name, "https://my-tracking-server:5050")
    store = _get_store("http://some/path")
    assert isinstance(store, RestStore)
    assert store.get_host_creds().host == "http://some/path"


def test_fallback_to_tracking_store(monkeypatch):
    monkeypatch.setenv(MLFLOW_TRACKING_URI.name, "https://my-tracking-server:5050")
    store = _get_store()
    assert isinstance(store, RestStore)
    assert store.get_host_creds().host == "https://my-tracking-server:5050"
    assert store.get_host_creds().token is None


@pytest.mark.parametrize("db_type", DATABASE_ENGINES)
def test_get_store_sqlalchemy_store(db_type, monkeypatch):
    uri = f"{db_type}://hostname/database"
    monkeypatch.setenv(MLFLOW_TRACKING_URI.name, uri)
    monkeypatch.delenv("MLFLOW_SQLALCHEMYSTORE_POOLCLASS", raising=False)
    with (
        mock.patch("sqlalchemy.create_engine") as mock_create_engine,
        mock.patch("sqlalchemy.event.listens_for"),
        mock.patch("mlflow.store.db.utils._initialize_tables"),
        mock.patch("mlflow.store.model_registry.sqlalchemy_store._all_tables_exist"),
        mock.patch(
            "mlflow.store.model_registry.sqlalchemy_store.SqlAlchemyStore."
            "_verify_registry_tables_exist"
        ),
    ):
        store = _get_store()
        assert isinstance(store, SqlAlchemyStore)
        assert store.db_uri == uri

    mock_create_engine.assert_called_once_with(uri, pool_pre_ping=True)


@pytest.mark.parametrize("bad_uri", ["badsql://imfake", "yoursql://hi"])
def test_get_store_bad_uris(bad_uri, monkeypatch):
    monkeypatch.setenv(MLFLOW_TRACKING_URI.name, bad_uri)
    with pytest.raises(
        UnsupportedModelRegistryStoreURIException,
        match="Model registry functionality is unavailable",
    ):
        _get_store()


def test_get_store_caches_on_store_uri(tmp_path):
    store_uri_1 = f"sqlite:///{tmp_path.joinpath('store1.db')}"
    store_uri_2 = f"sqlite:///{tmp_path.joinpath('store2.db')}"

    store1 = _get_store(store_uri_1)
    store2 = _get_store(store_uri_1)
    assert store1 is store2

    store3 = _get_store(store_uri_2)
    store4 = _get_store(store_uri_2)
    assert store3 is store4

    assert store1 is not store3


@pytest.mark.parametrize("store_uri", ["databricks-uc", "databricks-uc://profile"])
def test_get_store_uc_registry_uri(store_uri):
    assert isinstance(_get_store(store_uri), UcModelRegistryStore)


def test_store_object_can_be_serialized_by_pickle():
    """
    This test ensures a store object generated by `_get_store` can be serialized by pickle
    to prevent issues such as https://github.com/mlflow/mlflow/issues/2954
    """
    pickle.dump(_get_store("https://example.com"), io.BytesIO())
    pickle.dump(_get_store("databricks"), io.BytesIO())
    # pickle.dump(_get_store(f"sqlite:///{tmpdir.strpath}/mlflow.db"), io.BytesIO())
    # This throws `AttributeError: Can't pickle local object 'create_engine.<locals>.connect'`
```

--------------------------------------------------------------------------------

---[FILE: test_tracking_service_client.py]---
Location: mlflow-master/tests/tracking/_tracking_service/test_tracking_service_client.py

```python
from unittest import mock

import pytest

from mlflow.entities import Metric, Param, Run, RunInfo, RunTag
from mlflow.exceptions import MlflowException
from mlflow.tracking._tracking_service.client import TrackingServiceClient


@pytest.fixture
def mock_store():
    with mock.patch("mlflow.tracking._tracking_service.utils._get_store") as mock_get_store:
        yield mock_get_store.return_value


def newTrackingServiceClient():
    return TrackingServiceClient("databricks://scope:key")


@pytest.mark.parametrize(
    ("artifact_uri", "databricks_uri", "uri_for_repo"),
    [
        ("dbfs:/path", "databricks://profile", "dbfs://profile@databricks/path"),
        ("dbfs:/path", "databricks://scope:key", "dbfs://scope:key@databricks/path"),
        ("runs:/path", "databricks://scope:key", "runs://scope:key@databricks/path"),
        ("models:/path", "databricks://scope:key", "models://scope:key@databricks/path"),
        # unaffected uri cases
        (
            "dbfs://profile@databricks/path",
            "databricks://scope:key",
            "dbfs://profile@databricks/path",
        ),
        (
            "dbfs://profile@databricks/path",
            "databricks://profile2",
            "dbfs://profile@databricks/path",
        ),
        ("s3:/path", "databricks://profile", "s3:/path"),
        ("ftp://user:pass@host/path", "databricks://profile", "ftp://user:pass@host/path"),
    ],
)
def test_get_artifact_repo(artifact_uri, databricks_uri, uri_for_repo):
    with (
        mock.patch(
            "mlflow.tracking._tracking_service.client.TrackingServiceClient.get_run",
            return_value=Run(
                RunInfo(
                    "uuid",
                    "expr_id",
                    "userid",
                    "status",
                    0,
                    10,
                    "active",
                    artifact_uri=artifact_uri,
                ),
                None,
            ),
        ),
        mock.patch(
            "mlflow.tracking._tracking_service.client.get_artifact_repository", return_value=None
        ) as get_repo_mock,
    ):
        client = TrackingServiceClient(databricks_uri)
        client._get_artifact_repo("some-run-id")
        get_repo_mock.assert_called_once_with(uri_for_repo, tracking_uri=databricks_uri)


def test_artifact_repo_is_cached_per_run_id(tmp_path):
    uri = "ftp://user:pass@host/path"
    with mock.patch(
        "mlflow.tracking._tracking_service.client.TrackingServiceClient.get_run",
        return_value=Run(
            RunInfo("uuid", "expr_id", "userid", "status", 0, 10, "active", artifact_uri=uri),
            None,
        ),
    ):
        tracking_uri = tmp_path.as_uri()
        artifact_repo = TrackingServiceClient(tracking_uri)._get_artifact_repo("some_run_id")
        another_artifact_repo = TrackingServiceClient(tracking_uri)._get_artifact_repo(
            "some_run_id"
        )
        assert artifact_repo is another_artifact_repo


@pytest.fixture
def tracking_client_log_batch(tmp_path):
    client = TrackingServiceClient(tmp_path.as_uri())
    exp_id = client.create_experiment("test_log_batch")
    run = client.create_run(exp_id)
    return client, run.info.run_id


def test_log_batch(tracking_client_log_batch):
    client, run_id = tracking_client_log_batch

    metrics = [
        Metric(key="metric1", value=1.0, timestamp=12345, step=0),
        Metric(key="metric2", value=2.0, timestamp=23456, step=1),
    ]

    params = [Param(key="param1", value="value1"), Param(key="param2", value="value2")]

    tags = [RunTag(key="tag1", value="value1"), RunTag(key="tag2", value="value2")]

    client.log_batch(run_id=run_id, metrics=metrics, params=params, tags=tags)
    run_data = client.get_run(run_id).data

    expected_tags = {tag.key: tag.value for tag in tags}
    expected_tags["mlflow.runName"] = run_data.tags["mlflow.runName"]

    assert run_data.metrics == {metric.key: metric.value for metric in metrics}
    assert run_data.params == {param.key: param.value for param in params}
    assert run_data.tags == expected_tags


def test_log_batch_with_empty_data(tracking_client_log_batch):
    client, run_id = tracking_client_log_batch

    client.log_batch(run_id=run_id, metrics=[], params=[], tags=[])
    run_data = client.get_run(run_id).data

    assert run_data.metrics == {}
    assert run_data.params == {}
    assert run_data.tags == {"mlflow.runName": run_data.tags["mlflow.runName"]}


def test_log_batch_with_numpy_array(tracking_client_log_batch):
    import numpy as np

    client, run_id = tracking_client_log_batch

    metrics = [Metric(key="metric1", value=np.array(1.0), timestamp=12345, step=0)]
    params = [Param(key="param1", value="value1")]
    tags = [RunTag(key="tag1", value="value1")]

    client.log_batch(run_id=run_id, metrics=metrics, params=params, tags=tags)
    run_data = client.get_run(run_id).data

    expected_tags = {tag.key: tag.value for tag in tags}
    expected_tags["mlflow.runName"] = run_data.tags["mlflow.runName"]

    assert run_data.metrics == {metric.key: metric.value for metric in metrics}
    assert run_data.params == {param.key: param.value for param in params}
    assert run_data.tags == expected_tags


def test_link_traces_to_run_validation():
    client = newTrackingServiceClient()

    with pytest.raises(MlflowException, match="run_id cannot be empty"):
        client.link_traces_to_run(["trace1", "trace2"], "")

    with pytest.raises(MlflowException, match="run_id cannot be empty"):
        client.link_traces_to_run(["trace1", "trace2"], None)

    trace_ids = [f"trace_{i}" for i in range(101)]
    with pytest.raises(MlflowException, match="Cannot link more than 100 traces to a run"):
        client.link_traces_to_run(trace_ids, "run_id")
```

--------------------------------------------------------------------------------

---[FILE: test_utils.py]---
Location: mlflow-master/tests/tracking/_tracking_service/test_utils.py
Signals: SQLAlchemy

```python
import io
import itertools
import os
import pickle
import uuid
from importlib import reload
from pathlib import Path
from unittest import mock

import pytest

import mlflow
from mlflow.environment_variables import (
    MLFLOW_TRACKING_INSECURE_TLS,
    MLFLOW_TRACKING_PASSWORD,
    MLFLOW_TRACKING_TOKEN,
    MLFLOW_TRACKING_URI,
    MLFLOW_TRACKING_USERNAME,
)
from mlflow.exceptions import MlflowException
from mlflow.store.db.db_types import DATABASE_ENGINES
from mlflow.store.tracking.databricks_rest_store import DatabricksTracingRestStore
from mlflow.store.tracking.file_store import FileStore
from mlflow.store.tracking.rest_store import RestStore
from mlflow.store.tracking.sqlalchemy_store import SqlAlchemyStore
from mlflow.tracking._tracking_service.registry import TrackingStoreRegistry
from mlflow.tracking._tracking_service.utils import (
    _get_store,
    _get_tracking_scheme,
    _resolve_tracking_uri,
    get_tracking_uri,
    set_tracking_uri,
)
from mlflow.tracking.registry import UnsupportedModelRegistryStoreURIException
from mlflow.utils.file_utils import path_to_local_file_uri
from mlflow.utils.os import is_windows

from tests.tracing.helper import get_tracer_tracking_uri

# Disable mocking tracking URI here, as we want to test setting the tracking URI via
# environment variable. See
# http://doc.pytest.org/en/latest/skipping.html#skip-all-test-functions-of-a-class-or-module
# and https://github.com/mlflow/mlflow/blob/master/CONTRIBUTING.md#writing-python-tests
# for more information.
pytestmark = pytest.mark.notrackingurimock


def test_tracking_scheme_with_existing_mlruns(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    mlruns_dir = tmp_path / "mlruns"
    mlruns_dir.mkdir()
    exp_dir = mlruns_dir / "0"
    exp_dir.mkdir()
    (exp_dir / "meta.yaml").touch()
    store = _get_store()
    assert isinstance(store, FileStore)


def test_tracking_scheme_without_existing_mlruns(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    store = _get_store()
    assert isinstance(store, SqlAlchemyStore)


def test_get_store_with_existing_mlruns_data(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    mlruns_dir = tmp_path / "mlruns"
    mlruns_dir.mkdir()
    exp_dir = mlruns_dir / "0"
    exp_dir.mkdir()
    (exp_dir / "meta.yaml").touch()

    store = _get_store()
    assert isinstance(store, FileStore)
    assert os.path.abspath(store.root_directory) == os.path.abspath("mlruns")


def test_get_store_with_empty_mlruns(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    mlruns_dir = tmp_path / "mlruns"
    mlruns_dir.mkdir()

    store = _get_store()
    assert isinstance(store, SqlAlchemyStore)


def test_get_store_with_mlruns_dir_but_no_meta_yaml(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    mlruns_dir = tmp_path / "mlruns"
    mlruns_dir.mkdir()
    (mlruns_dir / "0").mkdir()

    store = _get_store()
    assert isinstance(store, SqlAlchemyStore)


def test_get_store_file_store_from_arg(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    store = _get_store("other/path")
    assert isinstance(store, FileStore)
    assert os.path.abspath(store.root_directory) == os.path.abspath("other/path")


@pytest.mark.parametrize("uri", ["other/path", "file:other/path"])
def test_get_store_file_store_from_env(tmp_path, monkeypatch, uri):
    monkeypatch.chdir(tmp_path)
    monkeypatch.setenv(MLFLOW_TRACKING_URI.name, uri)
    store = _get_store()
    assert isinstance(store, FileStore)
    assert os.path.abspath(store.root_directory) == os.path.abspath("other/path")


def test_get_store_basic_rest_store(monkeypatch):
    monkeypatch.setenv(MLFLOW_TRACKING_URI.name, "https://my-tracking-server:5050")
    store = _get_store()
    assert isinstance(store, RestStore)
    assert store.get_host_creds().host == "https://my-tracking-server:5050"
    assert store.get_host_creds().token is None
    assert _get_tracking_scheme() == "https"


def test_get_store_rest_store_with_password(monkeypatch):
    for k, v in {
        MLFLOW_TRACKING_URI.name: "https://my-tracking-server:5050",
        MLFLOW_TRACKING_USERNAME.name: "Bob",
        MLFLOW_TRACKING_PASSWORD.name: "Ross",
    }.items():
        monkeypatch.setenv(k, v)

    store = _get_store()
    assert isinstance(store, RestStore)
    assert store.get_host_creds().host == "https://my-tracking-server:5050"
    assert store.get_host_creds().username == "Bob"
    assert store.get_host_creds().password == "Ross"


def test_get_store_rest_store_with_token(monkeypatch):
    for k, v in {
        MLFLOW_TRACKING_URI.name: "https://my-tracking-server:5050",
        MLFLOW_TRACKING_TOKEN.name: "my-token",
    }.items():
        monkeypatch.setenv(k, v)

    store = _get_store()
    assert isinstance(store, RestStore)
    assert store.get_host_creds().token == "my-token"


def test_get_store_rest_store_with_insecure(monkeypatch):
    for k, v in {
        MLFLOW_TRACKING_URI.name: "https://my-tracking-server:5050",
        MLFLOW_TRACKING_INSECURE_TLS.name: "true",
    }.items():
        monkeypatch.setenv(k, v)
    store = _get_store()
    assert isinstance(store, RestStore)
    assert store.get_host_creds().ignore_tls_verification


def test_get_store_rest_store_with_no_insecure(monkeypatch):
    with monkeypatch.context() as m:
        for k, v in {
            MLFLOW_TRACKING_URI.name: "https://my-tracking-server:5050",
            MLFLOW_TRACKING_INSECURE_TLS.name: "false",
        }.items():
            m.setenv(k, v)
        store = _get_store()
        assert isinstance(store, RestStore)
        assert not store.get_host_creds().ignore_tls_verification

    # By default, should not ignore verification.
    with monkeypatch.context() as m:
        monkeypatch.setenv(MLFLOW_TRACKING_URI.name, "https://my-tracking-server:5050")
        store = _get_store()
        assert isinstance(store, RestStore)
        assert not store.get_host_creds().ignore_tls_verification


@pytest.mark.parametrize("db_type", DATABASE_ENGINES)
def test_get_store_sqlalchemy_store(tmp_path, monkeypatch, db_type):
    monkeypatch.chdir(tmp_path)
    uri = f"{db_type}://hostname/database-{uuid.uuid4().hex}"
    monkeypatch.setenv(MLFLOW_TRACKING_URI.name, uri)
    monkeypatch.delenv("MLFLOW_SQLALCHEMYSTORE_POOLCLASS", raising=False)
    with (
        mock.patch("sqlalchemy.create_engine") as mock_create_engine,
        mock.patch("sqlalchemy.event.listens_for"),
        mock.patch("mlflow.store.db.utils._verify_schema"),
        mock.patch("mlflow.store.db.utils._initialize_tables"),
        mock.patch(
            # In sqlalchemy 1.4.0, `SqlAlchemyStore.search_experiments`, which is called when
            # fetching the store, results in an error when called with a mocked sqlalchemy engine.
            # Accordingly, we mock `SqlAlchemyStore.search_experiments`
            "mlflow.store.tracking.sqlalchemy_store.SqlAlchemyStore.search_experiments",
            return_value=[],
        ),
    ):
        store = _get_store()
        assert isinstance(store, SqlAlchemyStore)
        assert store.db_uri == uri
        # Create another store to ensure the engine is cached
        another_store = _get_store()
        assert store.engine is another_store.engine
        if is_windows():
            assert store.artifact_root_uri == Path.cwd().joinpath("mlruns").as_uri()
        else:
            assert store.artifact_root_uri == Path.cwd().joinpath("mlruns").as_posix()
        assert _get_tracking_scheme() == db_type

    mock_create_engine.assert_called_once_with(uri, pool_pre_ping=True)


@pytest.mark.parametrize("db_type", DATABASE_ENGINES)
def test_get_store_sqlalchemy_store_with_artifact_uri(tmp_path, monkeypatch, db_type):
    monkeypatch.chdir(tmp_path)
    uri = f"{db_type}://hostname/database-{uuid.uuid4().hex}"
    artifact_uri = "file:artifact/path"
    monkeypatch.setenv(MLFLOW_TRACKING_URI.name, uri)
    monkeypatch.delenv("MLFLOW_SQLALCHEMYSTORE_POOLCLASS", raising=False)
    with (
        mock.patch("sqlalchemy.create_engine") as mock_create_engine,
        mock.patch("sqlalchemy.event.listens_for"),
        mock.patch("mlflow.store.db.utils._verify_schema"),
        mock.patch("mlflow.store.db.utils._initialize_tables"),
        mock.patch(
            "mlflow.store.tracking.sqlalchemy_store.SqlAlchemyStore.search_experiments",
            return_value=[],
        ),
    ):
        store = _get_store(artifact_uri=artifact_uri)
        assert isinstance(store, SqlAlchemyStore)
        assert store.db_uri == uri
        if is_windows():
            assert store.artifact_root_uri == Path.cwd().joinpath("artifact", "path").as_uri()
        else:
            assert store.artifact_root_uri == path_to_local_file_uri(
                Path.cwd().joinpath("artifact", "path")
            )

    mock_create_engine.assert_called_once_with(uri, pool_pre_ping=True)


def test_get_store_databricks(monkeypatch):
    for k, v in {
        MLFLOW_TRACKING_URI.name: "databricks",
        "DATABRICKS_HOST": "https://my-tracking-server",
        "DATABRICKS_TOKEN": "abcdef",
    }.items():
        monkeypatch.setenv(k, v)
    store = _get_store()
    assert isinstance(store, DatabricksTracingRestStore)
    assert store.get_host_creds().use_databricks_sdk
    assert _get_tracking_scheme() == "databricks"


def test_get_store_databricks_profile(monkeypatch):
    monkeypatch.setenv(MLFLOW_TRACKING_URI.name, "databricks://mycoolprofile")
    # It's kind of annoying to setup a profile, and we're not really trying to test
    # that anyway, so just check if we raise a relevant exception.
    store = _get_store()
    assert isinstance(store, DatabricksTracingRestStore)
    with pytest.raises(MlflowException, match="mycoolprofile"):
        store.get_host_creds()


def test_get_store_caches_on_store_uri_and_artifact_uri(tmp_path):
    registry = mlflow.tracking._tracking_service.utils._tracking_store_registry

    store_uri_1 = f"sqlite:///{tmp_path.joinpath('backend_store_1.db')}"
    store_uri_2 = f"sqlite:///{tmp_path.joinpath('backend_store_2.db')}"
    stores_uris = [store_uri_1, store_uri_2]
    artifact_uris = [
        None,
        str(tmp_path.joinpath("artifact_root_1")),
        str(tmp_path.joinpath("artifact_root_2")),
    ]

    stores = []
    for args in itertools.product(stores_uris, artifact_uris):
        store1 = registry.get_store(*args)
        store2 = registry.get_store(*args)
        assert store1 is store2
        stores.append(store1)

    assert all(s1 is not s2 for s1, s2 in itertools.combinations(stores, 2))


def test_standard_store_registry_with_mocked_entrypoint():
    mock_entrypoint = mock.Mock()
    mock_entrypoint.name = "mock-scheme"

    with mock.patch("mlflow.utils.plugins._get_entry_points", return_value=[mock_entrypoint]):
        # Entrypoints are registered at import time, so we need to reload the
        # module to register the entrypoint given by the mocked
        # entrypoints.get_group_all
        reload(mlflow.tracking._tracking_service.utils)

        expected_standard_registry = {
            "",
            "file",
            "http",
            "https",
            "postgresql",
            "mysql",
            "sqlite",
            "mssql",
            "databricks",
            "mock-scheme",
        }
        assert expected_standard_registry.issubset(
            mlflow.tracking._tracking_service.utils._tracking_store_registry._registry.keys()
        )


def test_standard_store_registry_with_installed_plugin(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    reload(mlflow.tracking._tracking_service.utils)
    assert (
        "file-plugin" in mlflow.tracking._tracking_service.utils._tracking_store_registry._registry
    )

    from mlflow_test_plugin.file_store import PluginFileStore

    monkeypatch.setenv(MLFLOW_TRACKING_URI.name, "file-plugin:test-path")
    plugin_file_store = mlflow.tracking._tracking_service.utils._get_store()
    assert isinstance(plugin_file_store, PluginFileStore)
    assert plugin_file_store.is_plugin
    assert _get_tracking_scheme() == "custom_scheme"


def test_plugin_registration():
    tracking_store = TrackingStoreRegistry()

    test_uri = "mock-scheme://fake-host/fake-path"
    test_scheme = "mock-scheme"

    mock_plugin = mock.Mock()
    tracking_store.register(test_scheme, mock_plugin)
    assert test_scheme in tracking_store._registry
    assert tracking_store.get_store(test_uri) == mock_plugin.return_value
    mock_plugin.assert_called_once_with(store_uri=test_uri, artifact_uri=None)


def test_plugin_registration_via_entrypoints():
    mock_plugin_function = mock.Mock()
    mock_entrypoint = mock.Mock(load=mock.Mock(return_value=mock_plugin_function))
    mock_entrypoint.name = "mock-scheme"

    with mock.patch(
        "mlflow.utils.plugins._get_entry_points", return_value=[mock_entrypoint]
    ) as mock_get_group_all:
        tracking_store = TrackingStoreRegistry()
        tracking_store.register_entrypoints()

    assert tracking_store.get_store("mock-scheme://") == mock_plugin_function.return_value

    mock_plugin_function.assert_called_once_with(store_uri="mock-scheme://", artifact_uri=None)
    mock_get_group_all.assert_called_once_with("mlflow.tracking_store")


@pytest.mark.parametrize(
    "exception", [AttributeError("test exception"), ImportError("test exception")]
)
def test_handle_plugin_registration_failure_via_entrypoints(exception):
    mock_entrypoint = mock.Mock(load=mock.Mock(side_effect=exception))
    mock_entrypoint.name = "mock-scheme"

    with mock.patch(
        "mlflow.utils.plugins._get_entry_points", return_value=[mock_entrypoint]
    ) as mock_get_group_all:
        tracking_store = TrackingStoreRegistry()

        # Check that the raised warning contains the message from the original exception
        with pytest.warns(UserWarning, match="test exception"):
            tracking_store.register_entrypoints()

    mock_entrypoint.load.assert_called_once()
    mock_get_group_all.assert_called_once_with("mlflow.tracking_store")


def test_get_store_for_unregistered_scheme():
    tracking_store = TrackingStoreRegistry()

    with pytest.raises(
        UnsupportedModelRegistryStoreURIException,
        match="Model registry functionality is unavailable",
    ):
        tracking_store.get_store("unknown-scheme://")


def test_resolve_tracking_uri_with_param():
    with mock.patch(
        "mlflow.tracking._tracking_service.utils.get_tracking_uri",
        return_value="databricks://tracking_qoeirj",
    ):
        overriding_uri = "databricks://tracking_poiwerow"
        assert _resolve_tracking_uri(overriding_uri) == overriding_uri


def test_resolve_tracking_uri_with_no_param():
    with mock.patch(
        "mlflow.tracking._tracking_service.utils.get_tracking_uri",
        return_value="databricks://tracking_zlkjdas",
    ):
        assert _resolve_tracking_uri() == "databricks://tracking_zlkjdas"


def test_store_object_can_be_serialized_by_pickle(tmp_path):
    """
    This test ensures a store object generated by `_get_store` can be serialized by pickle
    to prevent issues such as https://github.com/mlflow/mlflow/issues/2954
    """
    pickle.dump(_get_store(f"file:///{tmp_path.joinpath('mlflow')}"), io.BytesIO())
    pickle.dump(_get_store("databricks"), io.BytesIO())
    pickle.dump(_get_store("https://example.com"), io.BytesIO())
    # pickle.dump(_get_store(f"sqlite:///{tmpdir.strpath}/mlflow.db"), io.BytesIO())
    # This throws `AttributeError: Can't pickle local object 'create_engine.<locals>.connect'`


@pytest.mark.parametrize("absolute", [True, False], ids=["absolute", "relative"])
def test_set_tracking_uri_with_path(tmp_path, monkeypatch, absolute):
    monkeypatch.chdir(tmp_path)
    path = Path("foo/bar")
    if absolute:
        path = tmp_path / path
    with mock.patch("mlflow.tracking._tracking_service.utils._tracking_uri", None):
        set_tracking_uri(path)
        assert get_tracking_uri() == path.absolute().resolve().as_uri()


def test_set_tracking_uri_update_trace_provider():
    default_uri = mlflow.get_tracking_uri()
    try:
        assert get_tracer_tracking_uri() != "file:///tmp"

        set_tracking_uri("file:///tmp")
        assert get_tracer_tracking_uri() == "file:///tmp"

        set_tracking_uri("https://foo")
        assert get_tracer_tracking_uri() == "https://foo"
    finally:
        # clean up
        set_tracking_uri(default_uri)


@pytest.mark.parametrize("store_uri", ["databricks-uc", "databricks-uc://profile"])
def test_get_store_raises_on_uc_uri(store_uri):
    set_tracking_uri(store_uri)
    with pytest.raises(
        MlflowException,
        match="Setting the tracking URI to a Unity Catalog backend is not "
        "supported in the current version of the MLflow client",
    ):
        mlflow.tracking.MlflowClient()
    assert _get_tracking_scheme() == "databricks-uc"


@pytest.mark.parametrize("tracking_uri", ["file:///tmp/mlruns", "sqlite:///tmp/mlruns.db", ""])
def test_set_get_tracking_uri_consistency(tracking_uri):
    mlflow.set_tracking_uri(tracking_uri)
    assert mlflow.get_tracking_uri() == tracking_uri


def test_get_tracking_scheme():
    assert _get_tracking_scheme("uc://profile@databricks") == "uc"
    # no builder registered for custom scheme
    assert _get_tracking_scheme("custom-scheme://") == "None"
```

--------------------------------------------------------------------------------

---[FILE: conftest.py]---
Location: mlflow-master/tests/transformers/conftest.py

```python
import pytest
from packaging.version import Version

from tests.transformers.helper import (
    load_audio_classification_pipeline,
    load_component_multi_modal,
    load_conversational_pipeline,
    load_custom_code_pipeline,
    load_custom_components_pipeline,
    load_feature_extraction_pipeline,
    load_fill_mask_pipeline,
    load_ner_pipeline,
    load_ner_pipeline_aggregation,
    load_peft_pipeline,
    load_small_conversational_model,
    load_small_multi_modal_pipeline,
    load_small_qa_pipeline,
    load_small_vision_model,
    load_summarizer_pipeline,
    load_table_question_answering_pipeline,
    load_text2text_generation_pipeline,
    load_text_classification_pipeline,
    load_text_generation_pipeline,
    load_translation_pipeline,
    load_whisper_pipeline,
    load_zero_shot_pipeline,
)


@pytest.fixture
def small_qa_pipeline():
    return load_small_qa_pipeline()


@pytest.fixture
def small_vision_model():
    return load_small_vision_model()


@pytest.fixture
def small_multi_modal_pipeline():
    return load_small_multi_modal_pipeline()


@pytest.fixture
def component_multi_modal():
    return load_component_multi_modal()


@pytest.fixture
def custom_code_pipeline():
    return load_custom_code_pipeline()


@pytest.fixture
def custom_components_pipeline():
    return load_custom_components_pipeline()


@pytest.fixture
def small_conversational_model():
    return load_small_conversational_model()


@pytest.fixture
def fill_mask_pipeline():
    return load_fill_mask_pipeline()


@pytest.fixture
def text2text_generation_pipeline():
    return load_text2text_generation_pipeline()


@pytest.fixture
def text_generation_pipeline():
    return load_text_generation_pipeline()


@pytest.fixture
def translation_pipeline():
    import transformers

    if Version(transformers.__version__) > Version("4.44.2"):
        pytest.skip(
            reason="This multi-task pipeline has a loading issue with Transformers 4.45.x. "
            "See https://github.com/huggingface/transformers/issues/33398 for more details."
        )

    return load_translation_pipeline()


@pytest.fixture
def text_classification_pipeline():
    return load_text_classification_pipeline()


@pytest.fixture
def summarizer_pipeline():
    import transformers

    if Version(transformers.__version__) > Version("4.44.2"):
        pytest.skip(
            reason="This multi-task pipeline has a loading issue with Transformers 4.45.x. "
            "See https://github.com/huggingface/transformers/issues/33398 for more details."
        )

    return load_summarizer_pipeline()


@pytest.fixture
def zero_shot_pipeline():
    return load_zero_shot_pipeline()


@pytest.fixture
def table_question_answering_pipeline():
    return load_table_question_answering_pipeline()


@pytest.fixture
def ner_pipeline():
    return load_ner_pipeline()


@pytest.fixture
def ner_pipeline_aggregation():
    return load_ner_pipeline_aggregation()


@pytest.fixture
def conversational_pipeline():
    return load_conversational_pipeline()


@pytest.fixture
def whisper_pipeline():
    return load_whisper_pipeline()


@pytest.fixture
def audio_classification_pipeline():
    return load_audio_classification_pipeline()


@pytest.fixture
def feature_extraction_pipeline():
    return load_feature_extraction_pipeline()


@pytest.fixture
def peft_pipeline():
    return load_peft_pipeline()
```

--------------------------------------------------------------------------------

````
