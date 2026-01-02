---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 675
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 675 of 991)

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

---[FILE: unity_catalog_models_artifact_repo.py]---
Location: mlflow-master/mlflow/store/artifact/unity_catalog_models_artifact_repo.py

```python
import base64

from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE
from mlflow.protos.databricks_uc_registry_messages_pb2 import (
    MODEL_VERSION_OPERATION_READ,
    GenerateTemporaryModelVersionCredentialsRequest,
    GenerateTemporaryModelVersionCredentialsResponse,
    ModelVersionLineageDirection,
    StorageMode,
)
from mlflow.protos.databricks_uc_registry_service_pb2 import UcModelRegistryService
from mlflow.store._unity_catalog.lineage.constants import _DATABRICKS_LINEAGE_ID_HEADER
from mlflow.store.artifact.artifact_repo import ArtifactRepository
from mlflow.store.artifact.databricks_sdk_models_artifact_repo import (
    DatabricksSDKModelsArtifactRepository,
)
from mlflow.store.artifact.presigned_url_artifact_repo import PresignedUrlArtifactRepository
from mlflow.store.artifact.utils.models import (
    get_model_name_and_version,
)
from mlflow.utils._spark_utils import _get_active_spark_session
from mlflow.utils._unity_catalog_utils import (
    emit_model_version_lineage,
    get_artifact_repo_from_storage_info,
    get_full_name_from_sc,
    is_databricks_sdk_models_artifact_repository_enabled,
)
from mlflow.utils.databricks_utils import get_databricks_host_creds
from mlflow.utils.proto_json_utils import message_to_json
from mlflow.utils.rest_utils import (
    _REST_API_PATH_PREFIX,
    call_endpoint,
    extract_api_info_for_service,
)
from mlflow.utils.uri import (
    _DATABRICKS_UNITY_CATALOG_SCHEME,
    get_databricks_profile_uri_from_artifact_uri,
    get_db_info_from_uri,
    is_databricks_unity_catalog_uri,
)

_METHOD_TO_INFO = extract_api_info_for_service(UcModelRegistryService, _REST_API_PATH_PREFIX)


class UnityCatalogModelsArtifactRepository(ArtifactRepository):
    """
    Performs storage operations on artifacts controlled by a Unity Catalog model registry

    Temporary scoped tokens for the appropriate cloud storage locations are fetched from the
    remote backend and used to download model artifacts.

    The artifact_uri is expected to be of the form `models:/<model_name>/<model_version>`

    Note : This artifact repository is meant is to be instantiated by the ModelsArtifactRepository
    when the client is pointing to a Unity Catalog model registry.
    """

    def __init__(self, artifact_uri, registry_uri, tracking_uri: str | None = None):
        if not is_databricks_unity_catalog_uri(registry_uri):
            raise MlflowException(
                message="Attempted to instantiate an artifact repo to access models in the "
                f"Unity Catalog with non-Unity Catalog registry URI '{registry_uri}'. "
                f"Please specify a Unity Catalog registry URI of the "
                f"form '{_DATABRICKS_UNITY_CATALOG_SCHEME}[://profile]', e.g. by calling "
                f"mlflow.set_registry_uri('{_DATABRICKS_UNITY_CATALOG_SCHEME}') if using the "
                f"MLflow Python client",
                error_code=INVALID_PARAMETER_VALUE,
            )
        super().__init__(artifact_uri, tracking_uri, registry_uri)
        from mlflow.tracking.client import MlflowClient

        registry_uri_from_artifact_uri = get_databricks_profile_uri_from_artifact_uri(
            artifact_uri, result_scheme=_DATABRICKS_UNITY_CATALOG_SCHEME
        )
        if registry_uri_from_artifact_uri is not None:
            registry_uri = registry_uri_from_artifact_uri
        _, key_prefix = get_db_info_from_uri(registry_uri)
        if key_prefix is not None:
            raise MlflowException(
                "Remote model registry access via model URIs of the form "
                "'models://<scope>@<prefix>/<model_name>/<version_or_stage>' is unsupported for "
                "models in the Unity Catalog. We recommend that you access the Unity Catalog "
                "from the current Databricks workspace instead."
            )
        self.registry_uri = registry_uri
        self.client = MlflowClient(registry_uri=self.registry_uri)
        try:
            spark = _get_active_spark_session()
        except Exception:
            pass
        model_name, self.model_version = get_model_name_and_version(self.client, artifact_uri)
        self.model_name = get_full_name_from_sc(model_name, spark)

    def _get_blob_storage_path(self):
        return self.client.get_model_version_download_uri(self.model_name, self.model_version)

    def _get_scoped_token(self, lineage_header_info=None):
        extra_headers = {}
        if lineage_header_info:
            header_json = message_to_json(lineage_header_info)
            header_base64 = base64.b64encode(header_json.encode())
            extra_headers[_DATABRICKS_LINEAGE_ID_HEADER] = header_base64

        db_creds = get_databricks_host_creds(self.registry_uri)
        endpoint, method = _METHOD_TO_INFO[GenerateTemporaryModelVersionCredentialsRequest]
        req_body = message_to_json(
            GenerateTemporaryModelVersionCredentialsRequest(
                name=self.model_name,
                version=self.model_version,
                operation=MODEL_VERSION_OPERATION_READ,
            )
        )
        response_proto = GenerateTemporaryModelVersionCredentialsResponse()
        return call_endpoint(
            host_creds=db_creds,
            endpoint=endpoint,
            method=method,
            json_body=req_body,
            response_proto=response_proto,
            extra_headers=extra_headers,
        ).credentials

    def _get_artifact_repo(self, lineage_header_info=None):
        """
        Get underlying ArtifactRepository instance for model version blob
        storage
        """
        host_creds = get_databricks_host_creds(self.registry_uri)
        if is_databricks_sdk_models_artifact_repository_enabled(host_creds):
            entities = lineage_header_info.entities if lineage_header_info else []
            emit_model_version_lineage(
                host_creds,
                self.model_name,
                self.model_version,
                entities,
                ModelVersionLineageDirection.DOWNSTREAM,
            )
            return DatabricksSDKModelsArtifactRepository(self.model_name, self.model_version)
        scoped_token = self._get_scoped_token(lineage_header_info=lineage_header_info)
        if scoped_token.storage_mode == StorageMode.DEFAULT_STORAGE:
            return PresignedUrlArtifactRepository(
                get_databricks_host_creds(self.registry_uri), self.model_name, self.model_version
            )

        blob_storage_path = self._get_blob_storage_path()
        return get_artifact_repo_from_storage_info(
            storage_location=blob_storage_path,
            scoped_token=scoped_token,
            base_credential_refresh_def=self._get_scoped_token,
        )

    def list_artifacts(self, path=None):
        return self._get_artifact_repo().list_artifacts(path=path)

    def download_artifacts(self, artifact_path, dst_path=None, lineage_header_info=None):
        return self._get_artifact_repo(lineage_header_info=lineage_header_info).download_artifacts(
            artifact_path, dst_path
        )

    def log_artifact(self, local_file, artifact_path=None):
        raise MlflowException("This repository does not support logging artifacts.")

    def log_artifacts(self, local_dir, artifact_path=None):
        raise MlflowException("This repository does not support logging artifacts.")

    def delete_artifacts(self, artifact_path=None):
        raise NotImplementedError("This artifact repository does not support deleting artifacts")
```

--------------------------------------------------------------------------------

---[FILE: unity_catalog_oss_models_artifact_repo.py]---
Location: mlflow-master/mlflow/store/artifact/unity_catalog_oss_models_artifact_repo.py

```python
import base64

from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE
from mlflow.protos.databricks_uc_registry_service_pb2 import UcModelRegistryService
from mlflow.protos.unity_catalog_oss_messages_pb2 import (
    READ_MODEL_VERSION as MODEL_VERSION_OPERATION_READ_OSS,
)
from mlflow.protos.unity_catalog_oss_messages_pb2 import (
    GenerateTemporaryModelVersionCredential as GenerateTemporaryModelVersionCredentialsOSS,
)
from mlflow.protos.unity_catalog_oss_messages_pb2 import (
    TemporaryCredentials,
)
from mlflow.protos.unity_catalog_oss_service_pb2 import UnityCatalogService
from mlflow.store._unity_catalog.lineage.constants import _DATABRICKS_LINEAGE_ID_HEADER
from mlflow.store.artifact.artifact_repo import ArtifactRepository
from mlflow.store.artifact.utils.models import (
    get_model_name_and_version,
)
from mlflow.utils._spark_utils import _get_active_spark_session
from mlflow.utils._unity_catalog_utils import (
    get_artifact_repo_from_storage_info,
    get_full_name_from_sc,
)
from mlflow.utils.oss_registry_utils import get_oss_host_creds
from mlflow.utils.proto_json_utils import message_to_json
from mlflow.utils.rest_utils import (
    _REST_API_PATH_PREFIX,
    _UC_OSS_REST_API_PATH_PREFIX,
    call_endpoint,
    extract_api_info_for_service,
)
from mlflow.utils.uri import (
    _OSS_UNITY_CATALOG_SCHEME,
    get_databricks_profile_uri_from_artifact_uri,
    get_db_info_from_uri,
    is_oss_unity_catalog_uri,
)

_METHOD_TO_INFO = extract_api_info_for_service(UcModelRegistryService, _REST_API_PATH_PREFIX)
_METHOD_TO_INFO_OSS = extract_api_info_for_service(
    UnityCatalogService, _UC_OSS_REST_API_PATH_PREFIX
)

import urllib.parse

from mlflow.store.artifact.local_artifact_repo import LocalArtifactRepository
from mlflow.utils.uri import is_file_uri


class UnityCatalogOSSModelsArtifactRepository(ArtifactRepository):
    """
    Performs storage operations on artifacts controlled by a Unity Catalog model registry

    Temporary scoped tokens for the appropriate cloud storage locations are fetched from the
    remote backend and used to download model artifacts.

    The artifact_uri is expected to be of the form `models:/<model_name>/<model_version>`

    Note : This artifact repository is meant is to be instantiated by the ModelsArtifactRepository
    when the client is pointing to a Unity Catalog model registry.
    """

    def __init__(self, artifact_uri, registry_uri, tracking_uri: str | None = None):
        if not is_oss_unity_catalog_uri(registry_uri):
            raise MlflowException(
                message="Attempted to instantiate an artifact repo to access models in the "
                f"OSS Unity Catalog with non-Unity Catalog registry URI '{registry_uri}'. "
                f"Please specify a Unity Catalog registry URI of the "
                f"form '{_OSS_UNITY_CATALOG_SCHEME}[://profile]', e.g. by calling "
                f"mlflow.set_registry_uri('{_OSS_UNITY_CATALOG_SCHEME}') if using the "
                f"MLflow Python client",
                error_code=INVALID_PARAMETER_VALUE,
            )
        super().__init__(artifact_uri, tracking_uri, registry_uri)
        from mlflow.tracking.client import MlflowClient

        registry_uri_from_artifact_uri = get_databricks_profile_uri_from_artifact_uri(
            artifact_uri, result_scheme=_OSS_UNITY_CATALOG_SCHEME
        )
        if registry_uri_from_artifact_uri is not None:
            registry_uri = registry_uri_from_artifact_uri

        _, key_prefix = get_db_info_from_uri(urllib.parse.urlparse(registry_uri).path)
        if key_prefix is not None:
            raise MlflowException(
                "Remote model registry access via model URIs of the form "
                "'models://<scope>@<prefix>/<model_name>/<version_or_stage>' is unsupported for "
                "models in the Unity Catalog. We recommend that you access the Unity Catalog "
                "from the current Databricks workspace instead."
            )
        self.registry_uri = registry_uri
        self.client = MlflowClient(registry_uri=self.registry_uri)
        try:
            spark = _get_active_spark_session()
        except Exception:
            pass
        model_name, self.model_version = get_model_name_and_version(self.client, artifact_uri)
        self.model_name = get_full_name_from_sc(model_name, spark)

    def _get_blob_storage_path(self):
        return self.client.get_model_version_download_uri(self.model_name, self.model_version)

    def _get_scoped_token(self, lineage_header_info=None):
        extra_headers = {}
        if lineage_header_info:
            header_json = message_to_json(lineage_header_info)
            header_base64 = base64.b64encode(header_json.encode())
            extra_headers[_DATABRICKS_LINEAGE_ID_HEADER] = header_base64
        oss_creds = get_oss_host_creds(
            self.registry_uri
        )  # Implement ENV variable the same way the databricks user/token is specified
        oss_endpoint, oss_method = _METHOD_TO_INFO_OSS[GenerateTemporaryModelVersionCredentialsOSS]
        [catalog_name, schema_name, model_name] = self.model_name.split(
            "."
        )  # self.model_name is actually the full name
        oss_req_body = message_to_json(
            GenerateTemporaryModelVersionCredentialsOSS(
                catalog_name=catalog_name,
                schema_name=schema_name,
                model_name=model_name,
                version=int(self.model_version),
                operation=MODEL_VERSION_OPERATION_READ_OSS,
            )
        )
        oss_response_proto = TemporaryCredentials()
        return call_endpoint(
            host_creds=oss_creds,
            endpoint=oss_endpoint,
            method=oss_method,
            json_body=oss_req_body,
            response_proto=oss_response_proto,
            extra_headers=extra_headers,
        )

    def _get_artifact_repo(self, lineage_header_info=None):
        """
        Get underlying ArtifactRepository instance for model version blob
        storage
        """
        blob_storage_path = self._get_blob_storage_path()
        if is_file_uri(blob_storage_path):
            return LocalArtifactRepository(artifact_uri=blob_storage_path)
        scoped_token = self._get_scoped_token(lineage_header_info=lineage_header_info)
        return get_artifact_repo_from_storage_info(
            storage_location=blob_storage_path,
            scoped_token=scoped_token,
            base_credential_refresh_def=self._get_scoped_token,
            is_oss=True,
        )

    def list_artifacts(self, path=None):
        return self._get_artifact_repo().list_artifacts(path=path)

    def download_artifacts(self, artifact_path, dst_path=None, lineage_header_info=None):
        return self._get_artifact_repo(lineage_header_info=lineage_header_info).download_artifacts(
            artifact_path, dst_path
        )

    def log_artifact(self, local_file, artifact_path=None):
        raise MlflowException("This repository does not support logging artifacts.")

    def log_artifacts(self, local_dir, artifact_path=None):
        raise MlflowException("This repository does not support logging artifacts.")

    def delete_artifacts(self, artifact_path=None):
        raise NotImplementedError("This artifact repository does not support deleting artifacts")
```

--------------------------------------------------------------------------------

---[FILE: models.py]---
Location: mlflow-master/mlflow/store/artifact/utils/models.py

```python
import urllib.parse
from pathlib import Path
from typing import NamedTuple

import mlflow.tracking
from mlflow.exceptions import MlflowException
from mlflow.utils.uri import (
    get_databricks_profile_uri_from_artifact_uri,
    is_databricks_uri,
    is_models_uri,
)

_MODELS_URI_SUFFIX_LATEST = "latest"


def is_using_databricks_registry(uri, registry_uri: str | None = None):
    profile_uri = (
        get_databricks_profile_uri_from_artifact_uri(uri)
        or registry_uri
        or mlflow.get_registry_uri()
    )
    return is_databricks_uri(profile_uri)


def _improper_model_uri_msg(uri, scheme: str = "models"):
    if scheme not in ("models", "prompts"):
        raise ValueError(f"Unsupported scheme for model/prompt URI: {scheme!r}")
    entity_type = "Models" if scheme == "models" else "Prompts"
    return (
        f"Not a proper {scheme}:/ URI: {uri}. "
        + f"{entity_type} URIs must be of the form '{scheme}:/name/suffix' "
        + f"or '{scheme}:/name@alias' where suffix is a version"
        + (f", stage, or the string {_MODELS_URI_SUFFIX_LATEST!r}" if scheme == "models" else "")
        + f" and where alias is a registered {scheme[:-1]} alias. "
        + "Only one of suffix or alias can be defined at a time."
    )


def _get_latest_model_version(client, name, stage):
    """
    Returns the latest version of the stage if stage is not None. Otherwise return the latest of all
    versions.
    """
    latest = client.get_latest_versions(name, None if stage is None else [stage])
    if len(latest) == 0:
        stage_str = "" if stage is None else f" and stage '{stage}'"
        raise MlflowException(f"No versions of model with name '{name}'{stage_str} found")
    return max(int(x.version) for x in latest)


class ParsedModelUri(NamedTuple):
    model_id: str | None = None
    name: str | None = None
    version: str | None = None
    stage: str | None = None
    alias: str | None = None


def _parse_model_uri(uri, scheme: str = "models") -> ParsedModelUri:
    """
    Returns a ParsedModelUri tuple. Since a models:/ or prompts:/ URI can only have one of
    {version, stage, 'latest', alias}, it will return
        - (id, None, None, None) to look for a specific model by ID,
        - (name, version, None, None) to look for a specific version,
        - (name, None, stage, None) to look for the latest version of a stage,
        - (name, None, None, None) to look for the latest of all versions.
        - (name, None, None, alias) to look for a registered model alias.

    Args:
        uri: The URI to parse (e.g., "models:/name/version" or "prompts:/name@alias")
        scheme: The expected URI scheme (default: "models", can be "prompts")
    """
    parsed = urllib.parse.urlparse(uri, allow_fragments=False)
    if parsed.scheme != scheme:
        raise MlflowException(_improper_model_uri_msg(uri, scheme))
    path = parsed.path
    if not path.startswith("/") or len(path) <= 1:
        raise MlflowException(_improper_model_uri_msg(uri, scheme))

    parts = path.lstrip("/").split("/")
    if len(parts) > 2 or parts[0].strip() == "":
        raise MlflowException(_improper_model_uri_msg(uri, scheme))

    if len(parts) == 2:
        name, suffix = parts
        if suffix.strip() == "":
            raise MlflowException(_improper_model_uri_msg(uri, scheme))
        # The URI is in the suffix format
        if suffix.isdigit():
            # The suffix is a specific version, e.g. "models:/AdsModel1/123"
            return ParsedModelUri(name=name, version=suffix)
        elif suffix.lower() == _MODELS_URI_SUFFIX_LATEST.lower() and scheme == "models":
            # The suffix is the 'latest' string (case insensitive), e.g. "models:/AdsModel1/latest"
            # Only supported for models, not prompts
            return ParsedModelUri(name=name)
        elif scheme == "models":
            # The suffix is a specific stage (case insensitive), e.g. "models:/AdsModel1/Production"
            # Only supported for models, not prompts
            return ParsedModelUri(name=name, stage=suffix)
        else:
            # For prompts, only version numbers are supported, not stages or 'latest'
            raise MlflowException(_improper_model_uri_msg(uri, scheme))
    elif "@" in path:
        # The URI is an alias URI, e.g. "models:/AdsModel1@Champion"
        alias_parts = parts[0].rsplit("@", 1)
        if len(alias_parts) != 2 or alias_parts[1].strip() == "":
            raise MlflowException(_improper_model_uri_msg(uri, scheme))
        return ParsedModelUri(name=alias_parts[0], alias=alias_parts[1])
    else:
        # The URI is of the form "models:/<model_id>"
        return ParsedModelUri(parts[0])


def _parse_model_id_if_present(possible_model_uri: str | Path) -> str | None:
    """
    Parses the model ID from the given string. If the string represents a UC model URI, we get the
    model version to extract the model ID. If the string is not a models:/ URI, returns None.

    Args:
        possible_model_uri: The string that may be a models:/ URI.

    Returns:
        The model ID if the string is a models:/ URI, otherwise None.
    """
    uri = str(possible_model_uri)
    if is_models_uri(uri):
        parsed_model_uri = _parse_model_uri(uri)
        if parsed_model_uri.model_id is not None:
            return parsed_model_uri.model_id
        elif parsed_model_uri.name is not None and parsed_model_uri.version is not None:
            client = mlflow.tracking.MlflowClient()
            return client.get_model_version(
                parsed_model_uri.name, parsed_model_uri.version
            ).model_id
    return None


def get_model_name_and_version(client, models_uri):
    (model_id, model_name, model_version, model_stage, model_alias) = _parse_model_uri(models_uri)
    if model_id is not None:
        return (model_id,)
    if model_version is not None:
        return model_name, model_version

    # NB: Call get_model_version_by_alias of registry client directly to bypass prompt check
    if isinstance(client, mlflow.MlflowClient):
        client = client._get_registry_client()

    if model_alias is not None:
        mv = client.get_model_version_by_alias(model_name, model_alias)
        return model_name, mv.version
    return model_name, str(_get_latest_model_version(client, model_name, model_stage))
```

--------------------------------------------------------------------------------

---[FILE: base_sql_model.py]---
Location: mlflow-master/mlflow/store/db/base_sql_model.py
Signals: SQLAlchemy

```python
from sqlalchemy.orm import declarative_base

Base = declarative_base()
```

--------------------------------------------------------------------------------

---[FILE: db_types.py]---
Location: mlflow-master/mlflow/store/db/db_types.py
Signals: SQLAlchemy

```python
"""
Set of SQLAlchemy database schemas supported in MLflow for tracking server backends.
"""

POSTGRES = "postgresql"
MYSQL = "mysql"
SQLITE = "sqlite"
MSSQL = "mssql"

DATABASE_ENGINES = [POSTGRES, MYSQL, SQLITE, MSSQL]
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: mlflow-master/mlflow/store/db/utils.py
Signals: SQLAlchemy

```python
import hashlib
import logging
import os
import re
import sqlite3
import tempfile
import time
from contextlib import contextmanager
from pathlib import Path

import sqlalchemy
from alembic.migration import MigrationContext
from alembic.script import ScriptDirectory
from packaging.version import Version
from sqlalchemy import event, sql

# We need to import sqlalchemy.pool to convert poolclass string to class object
from sqlalchemy.pool import (
    AssertionPool,
    AsyncAdaptedQueuePool,
    FallbackAsyncAdaptedQueuePool,
    NullPool,
    QueuePool,
    SingletonThreadPool,
    StaticPool,
)

from mlflow.environment_variables import (
    MLFLOW_MYSQL_SSL_CA,
    MLFLOW_MYSQL_SSL_CERT,
    MLFLOW_MYSQL_SSL_KEY,
    MLFLOW_SQLALCHEMYSTORE_ECHO,
    MLFLOW_SQLALCHEMYSTORE_MAX_OVERFLOW,
    MLFLOW_SQLALCHEMYSTORE_POOL_RECYCLE,
    MLFLOW_SQLALCHEMYSTORE_POOL_SIZE,
    MLFLOW_SQLALCHEMYSTORE_POOLCLASS,
)
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import (
    BAD_REQUEST,
    INTERNAL_ERROR,
    TEMPORARILY_UNAVAILABLE,
)
from mlflow.store.db.db_types import SQLITE
from mlflow.store.model_registry.dbmodels.models import (
    SqlModelVersion,
    SqlModelVersionTag,
    SqlRegisteredModel,
    SqlRegisteredModelAlias,
    SqlRegisteredModelTag,
)
from mlflow.store.tracking.dbmodels.initial_models import Base as InitialBase
from mlflow.store.tracking.dbmodels.models import (
    SqlDataset,
    SqlExperiment,
    SqlExperimentTag,
    SqlInput,
    SqlInputTag,
    SqlJob,
    SqlLatestMetric,
    SqlMetric,
    SqlParam,
    SqlRun,
    SqlScorer,
    SqlScorerVersion,
    SqlTag,
    SqlTraceInfo,
    SqlTraceMetadata,
    SqlTraceTag,
)

_logger = logging.getLogger(__name__)

MAX_RETRY_COUNT = 10


def _get_package_dir():
    """Returns directory containing MLflow python package."""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.normpath(os.path.join(current_dir, os.pardir, os.pardir))


def _all_tables_exist(engine):
    # Check if the core initial tables exist in the database.
    # Using issubset() instead of equality so that additional tables added by migrations
    # don't cause this check to fail. This prevents unnecessary calls to _initialize_tables
    # which can cause migration errors like "Can't locate revision identified by 'xxx'".
    expected_tables = {
        SqlExperiment.__tablename__,
        SqlRun.__tablename__,
        SqlMetric.__tablename__,
        SqlParam.__tablename__,
        SqlTag.__tablename__,
        SqlExperimentTag.__tablename__,
        SqlLatestMetric.__tablename__,
        SqlRegisteredModel.__tablename__,
        SqlModelVersion.__tablename__,
        SqlRegisteredModelTag.__tablename__,
        SqlModelVersionTag.__tablename__,
        SqlRegisteredModelAlias.__tablename__,
        SqlDataset.__tablename__,
        SqlInput.__tablename__,
        SqlInputTag.__tablename__,
        SqlTraceInfo.__tablename__,
        SqlTraceTag.__tablename__,
        SqlTraceMetadata.__tablename__,
        SqlScorer.__tablename__,
        SqlScorerVersion.__tablename__,
        SqlJob.__tablename__,
    }
    actual_tables = {
        t for t in sqlalchemy.inspect(engine).get_table_names() if not t.startswith("alembic_")
    }
    return expected_tables.issubset(actual_tables)


def _initialize_tables(engine):
    _logger.info("Creating initial MLflow database tables...")
    InitialBase.metadata.create_all(engine)
    _upgrade_db(engine)


def _safe_initialize_tables(engine: sqlalchemy.engine.Engine) -> None:
    from mlflow.utils.file_utils import ExclusiveFileLock

    if os.name == "nt":
        if not _all_tables_exist(engine):
            _initialize_tables(engine)
        return

    url_hash = hashlib.md5(
        str(engine.url).encode("utf-8"),
        usedforsecurity=False,
    ).hexdigest()
    with ExclusiveFileLock(f"{tempfile.gettempdir()}/db_init_lock-{url_hash}"):
        if not _all_tables_exist(engine):
            _initialize_tables(engine)


def _get_latest_schema_revision():
    """Get latest schema revision as a string."""
    # We aren't executing any commands against a DB, so we leave the DB URL unspecified
    config = _get_alembic_config(db_url="")
    script = ScriptDirectory.from_config(config)
    heads = script.get_heads()
    if len(heads) != 1:
        raise MlflowException(
            f"Migration script directory was in unexpected state. Got {len(heads)} head "
            f"database versions but expected only 1. Found versions: {heads}"
        )
    return heads[0]


def _verify_schema(engine):
    head_revision = _get_latest_schema_revision()
    current_rev = _get_schema_version(engine)
    if current_rev != head_revision:
        raise MlflowException(
            f"Detected out-of-date database schema (found version {current_rev}, "
            f"but expected {head_revision}). Take a backup of your database, then run "
            "'mlflow db upgrade <database_uri>' "
            "to migrate your database to the latest schema. NOTE: schema migration may "
            "result in database downtime - please consult your database's documentation for "
            "more detail."
        )


def _get_managed_session_maker(SessionMaker, db_type):
    """
    Creates a factory for producing exception-safe SQLAlchemy sessions that are made available
    using a context manager. Any session produced by this factory is automatically committed
    if no exceptions are encountered within its associated context. If an exception is
    encountered, the session is rolled back. Finally, any session produced by this factory is
    automatically closed when the session's associated context is exited.
    """

    @contextmanager
    def make_managed_session():
        """Provide a transactional scope around a series of operations."""
        with SessionMaker() as session:
            try:
                if db_type == SQLITE:
                    session.execute(sql.text("PRAGMA foreign_keys = ON;"))
                    session.execute(sql.text("PRAGMA busy_timeout = 20000;"))
                    session.execute(sql.text("PRAGMA case_sensitive_like = true;"))
                yield session
                session.commit()
            except MlflowException:
                session.rollback()
                raise
            except sqlalchemy.exc.OperationalError as e:
                session.rollback()
                _logger.exception(
                    "SQLAlchemy database error. The following exception is caught.\n%s",
                    e,
                )
                raise MlflowException(message=e, error_code=TEMPORARILY_UNAVAILABLE) from e
            except sqlalchemy.exc.SQLAlchemyError as e:
                session.rollback()
                raise MlflowException(message=e, error_code=BAD_REQUEST) from e
            except Exception as e:
                session.rollback()
                raise MlflowException(message=e, error_code=INTERNAL_ERROR) from e

    return make_managed_session


def _get_alembic_config(db_url, alembic_dir=None):
    """
    Constructs an alembic Config object referencing the specified database and migration script
    directory.

    Args:
        db_url: Database URL, like sqlite:///<absolute-path-to-local-db-file>. See
            https://docs.sqlalchemy.org/en/13/core/engines.html#database-urls for a full list of
            valid database URLs.
        alembic_dir: Path to migration script directory. Uses canonical migration script
            directory under mlflow/alembic if unspecified. TODO: remove this argument in MLflow 1.1,
            as it's only used to run special migrations for pre-1.0 users to remove duplicate
            constraint names.
    """
    from alembic.config import Config

    final_alembic_dir = (
        os.path.join(_get_package_dir(), "store", "db_migrations")
        if alembic_dir is None
        else alembic_dir
    )
    # Escape any '%' that appears in a db_url. This could be in a password,
    # url, or anything that is part of a potentially complex database url
    db_url = db_url.replace("%", "%%")
    config = Config(os.path.join(final_alembic_dir, "alembic.ini"))
    config.set_main_option("script_location", final_alembic_dir)
    config.set_main_option("sqlalchemy.url", db_url)
    return config


def _check_sqlite_version(db_url: str) -> None:
    """
    Check if SQLite version supports required features.

    MLflow requires SQLite 3.31.0 or higher for computed columns support.
    Raises MlflowException if the version is too old.
    """
    if not db_url.startswith("sqlite:"):
        return

    version_str = sqlite3.sqlite_version
    try:
        sqlite_version = Version(version_str)
    except Exception:
        return
    min_version_str = "3.31.0"
    if sqlite_version < Version(min_version_str):
        raise MlflowException(
            f"MLflow requires SQLite >= {min_version_str} for SQL based "
            f"store, but found {version_str}. Please upgrade your SQLite. "
            f"See https://www.sqlite.org/download.html for installation options."
        )


def _upgrade_db(engine):
    """
    Upgrade the schema of an MLflow tracking database to the latest supported version.
    Note that schema migrations can be slow and are not guaranteed to be transactional -
    we recommend taking a backup of your database before running migrations.

    Args:
        url: Database URL, like sqlite:///<absolute-path-to-local-db-file>. See
            https://docs.sqlalchemy.org/en/13/core/engines.html#database-urls for a full list of
            valid database URLs.
    """
    # alembic adds significant import time, so we import it lazily
    from alembic import command

    db_url = str(engine.url)
    # Check SQLite version before running migrations
    _check_sqlite_version(db_url)
    _logger.info("Updating database tables")
    config = _get_alembic_config(db_url)
    # Initialize a shared connection to be used for the database upgrade, ensuring that
    # any connection-dependent state (e.g., the state of an in-memory database) is preserved
    # for reference by the upgrade routine. For more information, see
    # https://alembic.sqlalchemy.org/en/latest/cookbook.html#sharing-a-
    # connection-with-a-series-of-migration-commands-and-environments
    with engine.begin() as connection:
        config.attributes["connection"] = connection
        command.upgrade(config, "heads")


def _get_schema_version(engine):
    with engine.connect() as connection:
        mc = MigrationContext.configure(connection)
        return mc.get_current_revision()


def _make_parent_dirs_if_sqlite(db_uri: str) -> None:
    """Create parent directories for SQLite database file if they don't exist."""
    if not db_uri.startswith("sqlite:///"):
        return
    # SQLite URI format: sqlite:///path/to/file.db (relative) or sqlite:////abs/path (Unix)
    # Remove the 'sqlite:///' prefix to get the path
    # Skip in-memory databases (:memory: or empty path)
    db_path = db_uri.removeprefix("sqlite:///")
    if db_path and db_path != ":memory:":
        Path(db_path).parent.mkdir(parents=True, exist_ok=True)


def create_sqlalchemy_engine_with_retry(db_uri):
    _make_parent_dirs_if_sqlite(db_uri)
    attempts = 0
    while True:
        attempts += 1
        engine = create_sqlalchemy_engine(db_uri)
        try:
            sqlalchemy.inspect(engine)
            return engine
        except Exception as e:
            if attempts < MAX_RETRY_COUNT:
                sleep_duration = 0.1 * ((2**attempts) - 1)
                _logger.warning(
                    "SQLAlchemy engine could not be created. The following exception is caught.\n"
                    "%s\nOperation will be retried in %.1f seconds",
                    e,
                    sleep_duration,
                )
                time.sleep(sleep_duration)
                continue
            raise


def create_sqlalchemy_engine(db_uri):
    pool_size = MLFLOW_SQLALCHEMYSTORE_POOL_SIZE.get()
    pool_max_overflow = MLFLOW_SQLALCHEMYSTORE_MAX_OVERFLOW.get()
    pool_recycle = MLFLOW_SQLALCHEMYSTORE_POOL_RECYCLE.get()
    echo = MLFLOW_SQLALCHEMYSTORE_ECHO.get()
    poolclass = MLFLOW_SQLALCHEMYSTORE_POOLCLASS.get()
    kwargs = {}
    # Send argument only if they have been injected.
    # Some engine does not support them (for example sqllite)
    if pool_size:
        kwargs["pool_size"] = pool_size
    if pool_max_overflow:
        kwargs["max_overflow"] = pool_max_overflow
    if pool_recycle:
        kwargs["pool_recycle"] = pool_recycle
    if echo:
        kwargs["echo"] = echo
    if poolclass:
        pool_class_map = {
            "AssertionPool": AssertionPool,
            "AsyncAdaptedQueuePool": AsyncAdaptedQueuePool,
            "FallbackAsyncAdaptedQueuePool": FallbackAsyncAdaptedQueuePool,
            "NullPool": NullPool,
            "QueuePool": QueuePool,
            "SingletonThreadPool": SingletonThreadPool,
            "StaticPool": StaticPool,
        }
        if poolclass not in pool_class_map:
            list_str = " ".join(pool_class_map.keys())
            err_str = (
                f"Invalid poolclass parameter: {poolclass}. Set environment variable "
                f"poolclass to empty or one of the following values: {list_str}"
            )
            _logger.warning(err_str)
            raise ValueError(err_str)
        kwargs["poolclass"] = pool_class_map[poolclass]
    if kwargs:
        _logger.info("Create SQLAlchemy engine with pool options %s", kwargs)

    # Handle MySQL SSL certificates via connect_args
    if db_uri.startswith("mysql"):
        connect_args = {
            k: v
            for k, v in {
                "ssl_ca": MLFLOW_MYSQL_SSL_CA.get(),
                "ssl_cert": MLFLOW_MYSQL_SSL_CERT.get(),
                "ssl_key": MLFLOW_MYSQL_SSL_KEY.get(),
            }.items()
            if v
        }
        if connect_args:
            kwargs["connect_args"] = connect_args

    engine = sqlalchemy.create_engine(db_uri, pool_pre_ping=True, **kwargs)

    # Register REGEXP function for SQLite to enable RLIKE operator support
    if db_uri.startswith("sqlite"):

        @event.listens_for(engine, "connect")
        def _set_sqlite_regexp(dbapi_conn, connection_record):
            def regexp(pattern, string):
                """Custom REGEXP function for SQLite that uses Python's re module."""
                if string is None or pattern is None:
                    return False
                try:
                    return re.search(pattern, string) is not None
                except re.error:
                    return False

            dbapi_conn.create_function("regexp", 2, regexp)

    return engine
```

--------------------------------------------------------------------------------

---[FILE: alembic.ini]---
Location: mlflow-master/mlflow/store/db_migrations/alembic.ini

```text
# A generic, single database configuration.

[alembic]
# path to migration scripts
script_location = mlflow/store/db_migrations

# template used to generate migration files
# file_template = %%(rev)s_%%(slug)s

# timezone to use when rendering the date
# within the migration file as well as the filename.
# string value is passed to dateutil.tz.gettz()
# leave blank for localtime
# timezone =

# max length of characters to apply to the
# "slug" field
# truncate_slug_length = 40

# set to 'true' to run the environment during
# the 'revision' command, regardless of autogenerate
# revision_environment = false

# set to 'true' to allow .pyc and .pyo files without
# a source .py file to be detected as revisions in the
# versions/ directory
# sourceless = false

# version location specification; this defaults
# to alembic/versions.  When using multiple version
# directories, initial revisions must be specified with --version-path
# version_locations = %(here)s/bar %(here)s/bat alembic/versions

# the output encoding used when revision files
# are written from script.py.mako
# output_encoding = utf-8

sqlalchemy.url = ""
```

--------------------------------------------------------------------------------

````
