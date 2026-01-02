---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 747
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 747 of 991)

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

---[FILE: _spark_utils.py]---
Location: mlflow-master/mlflow/utils/_spark_utils.py

```python
import contextlib
import multiprocessing
import os
import shutil
import tempfile
import zipfile


def _get_active_spark_session():
    try:
        from pyspark.sql import SparkSession
    except ImportError:
        # Return None if user doesn't have PySpark installed
        return None
    try:
        # getActiveSession() only exists in Spark 3.0 and above
        return SparkSession.getActiveSession()
    except Exception:
        # Fall back to this internal field for Spark 2.x and below.
        return SparkSession._instantiatedSession


# Suppose we have a parent process already initiate a spark session that connected to a spark
# cluster, then the parent process spawns a child process, if child process directly creates
# a local spark session, it does not work correctly, because of PYSPARK_GATEWAY_PORT and
# PYSPARK_GATEWAY_SECRET are inherited from parent process and child process pyspark session
# will try to connect to the port and cause error.
# So the 2 lines here are to clear 'PYSPARK_GATEWAY_PORT' and 'PYSPARK_GATEWAY_SECRET' to
# enforce launching a new pyspark JVM gateway.
def _prepare_subprocess_environ_for_creating_local_spark_session():
    from mlflow.utils.databricks_utils import is_in_databricks_runtime

    if is_in_databricks_runtime():
        os.environ["SPARK_DIST_CLASSPATH"] = "/databricks/jars/*"

    os.environ.pop("PYSPARK_GATEWAY_PORT", None)
    os.environ.pop("PYSPARK_GATEWAY_SECRET", None)


def _get_spark_scala_version_from_spark_session(spark):
    version = spark._jvm.scala.util.Properties.versionNumberString().split(".", 2)
    return f"{version[0]}.{version[1]}"


def _get_spark_scala_version_child_proc_target(result_queue):
    from pyspark.sql import SparkSession

    _prepare_subprocess_environ_for_creating_local_spark_session()
    with SparkSession.builder.master("local[1]").getOrCreate() as spark_session:
        scala_version = _get_spark_scala_version_from_spark_session(spark_session)
        result_queue.put(scala_version)


def _get_spark_scala_version():
    from mlflow.utils.databricks_utils import is_in_databricks_runtime

    if is_in_databricks_runtime() and "SPARK_SCALA_VERSION" in os.environ:
        return os.environ["SPARK_SCALA_VERSION"]

    if spark := _get_active_spark_session():
        return _get_spark_scala_version_from_spark_session(spark)

    result_queue = multiprocessing.Queue()

    # If we need to create a new spark local session for reading scala version,
    # we have to create the temporal spark session in a child process,
    # if we create the temporal spark session in current process,
    # after terminating the temporal spark session, creating another spark session
    # with "spark.jars.packages" configuration doesn't work.
    proc = multiprocessing.Process(
        target=_get_spark_scala_version_child_proc_target, args=(result_queue,)
    )
    proc.start()
    proc.join()
    if proc.exitcode != 0:
        raise RuntimeError("Failed to read scala version.")

    return result_queue.get()


def _create_local_spark_session_for_loading_spark_model():
    from pyspark.sql import SparkSession

    return (
        SparkSession.builder.config("spark.python.worker.reuse", "true")
        # The config is a workaround for avoiding databricks delta cache issue when loading
        # some specific model such as ALSModel.
        .config("spark.databricks.io.cache.enabled", "false")
        # In Spark 3.1 and above, we need to set this conf explicitly to enable creating
        # a SparkSession on the workers
        .config("spark.executor.allowSparkContext", "true")
        # Binding "spark.driver.host" to 127.0.0.1 helps avoiding some local hostname
        # related issues (e.g. https://github.com/mlflow/mlflow/issues/5733).
        # Note that we should set "spark.driver.host" instead of "spark.driver.bindAddress",
        # the latter one only set server binding host, but it doesn't set client side request
        # destination host.
        .config("spark.driver.host", "127.0.0.1")
        .config("spark.executor.allowSparkContext", "true")
        .config(
            "spark.driver.extraJavaOptions",
            "-Dlog4j.configuration=file:/usr/local/spark/conf/log4j.properties",
        )
        .master("local[1]")
        .getOrCreate()
    )


_NFS_PATH_PREFIX = "nfs:"


def _get_spark_distributor_nfs_cache_dir():
    from mlflow.utils.nfs_on_spark import get_nfs_cache_root_dir  # avoid circular import

    if (nfs_root_dir := get_nfs_cache_root_dir()) is not None:
        cache_dir = os.path.join(nfs_root_dir, "mlflow_distributor_cache_dir")
        os.makedirs(cache_dir, exist_ok=True)
        return cache_dir
    return None


class _SparkDirectoryDistributor:
    """Distribute spark directory from driver to executors."""

    _extracted_dir_paths = {}

    def __init__(self):
        pass

    @staticmethod
    def add_dir(spark, dir_path):
        """Given a SparkSession and a model_path which refers to a pyfunc directory locally,
        we will zip the directory up, enable it to be distributed to executors, and return
        the "archive_path", which should be used as the path in get_or_load().
        """
        _, archive_basepath = tempfile.mkstemp()
        # NB: We must archive the directory as Spark.addFile does not support non-DFS
        # directories when recursive=True.
        archive_path = shutil.make_archive(archive_basepath, "zip", dir_path)

        if (nfs_cache_dir := _get_spark_distributor_nfs_cache_dir()) is not None:
            # If NFS directory (shared by all spark nodes) is available, use NFS directory
            # instead of `SparkContext.addFile` to distribute files.
            # Because `SparkContext.addFile` is not secure, so it is not allowed to be called
            # on a shared cluster.
            dest_path = os.path.join(nfs_cache_dir, os.path.basename(archive_path))
            shutil.copy(archive_path, dest_path)
            return _NFS_PATH_PREFIX + dest_path

        spark.sparkContext.addFile(archive_path)
        return archive_path

    @staticmethod
    def get_or_extract(archive_path):
        """Given a path returned by add_local_model(), this method will return a tuple of
        (loaded_model, local_model_path).
        If this Python process ever loaded the model before, we will reuse that copy.
        """
        from pyspark.files import SparkFiles

        if archive_path in _SparkDirectoryDistributor._extracted_dir_paths:
            return _SparkDirectoryDistributor._extracted_dir_paths[archive_path]

        # BUG: Despite the documentation of SparkContext.addFile() and SparkFiles.get() in Scala
        # and Python, it turns out that we actually need to use the basename as the input to
        # SparkFiles.get(), as opposed to the (absolute) path.
        if archive_path.startswith(_NFS_PATH_PREFIX):
            local_path = archive_path[len(_NFS_PATH_PREFIX) :]
        else:
            archive_path_basename = os.path.basename(archive_path)
            local_path = SparkFiles.get(archive_path_basename)
        temp_dir = tempfile.mkdtemp()
        zip_ref = zipfile.ZipFile(local_path, "r")
        zip_ref.extractall(temp_dir)
        zip_ref.close()

        _SparkDirectoryDistributor._extracted_dir_paths[archive_path] = temp_dir
        return _SparkDirectoryDistributor._extracted_dir_paths[archive_path]


@contextlib.contextmanager
def modified_environ(update):
    """Temporarily updates the ``os.environ`` dictionary in-place.

    The ``os.environ`` dictionary is updated in-place so that the modification
    is sure to work in all situations.

    Args:
        update: Dictionary of environment variables and values to add/update.
    """
    update = update or {}
    original_env = {k: os.environ.get(k) for k in update}

    try:
        os.environ.update(update)
        yield
    finally:
        for k, v in original_env.items():
            if v is None:
                os.environ.pop(k, None)
            else:
                os.environ[k] = v
```

--------------------------------------------------------------------------------

---[FILE: _unity_catalog_oss_utils.py]---
Location: mlflow-master/mlflow/utils/_unity_catalog_oss_utils.py

```python
import re

from mlflow.entities.model_registry import (
    ModelVersion,
    ModelVersionSearch,
    RegisteredModel,
    RegisteredModelSearch,
)
from mlflow.exceptions import MlflowException
from mlflow.protos.unity_catalog_oss_messages_pb2 import (
    ModelVersionInfo,
    ModelVersionStatus,
    RegisteredModelInfo,
)

_STRING_TO_STATUS = {k: ModelVersionStatus.Value(k) for k in ModelVersionStatus.keys()}
_STATUS_TO_STRING = {value: key for key, value in _STRING_TO_STATUS.items()}


def get_registered_model_from_uc_oss_proto(uc_oss_proto: RegisteredModelInfo) -> RegisteredModel:
    return RegisteredModel(
        name=f"{uc_oss_proto.catalog_name}.{uc_oss_proto.schema_name}.{uc_oss_proto.name}",
        creation_timestamp=uc_oss_proto.created_at,
        last_updated_timestamp=uc_oss_proto.updated_at,
        description=uc_oss_proto.comment,
    )


def get_model_version_from_uc_oss_proto(uc_oss_proto: ModelVersionInfo) -> ModelVersion:
    return ModelVersion(
        name=f"{uc_oss_proto.catalog_name}.{uc_oss_proto.schema_name}.{uc_oss_proto.model_name}",
        version=uc_oss_proto.version,
        creation_timestamp=uc_oss_proto.created_at,
        last_updated_timestamp=uc_oss_proto.updated_at,
        description=uc_oss_proto.comment,
        source=uc_oss_proto.source,
        run_id=uc_oss_proto.run_id,
        status=uc_oss_model_version_status_to_string(uc_oss_proto.status),
    )


def get_registered_model_search_from_uc_oss_proto(
    uc_oss_proto: RegisteredModelInfo,
) -> RegisteredModelSearch:
    return RegisteredModelSearch(
        name=f"{uc_oss_proto.catalog_name}.{uc_oss_proto.schema_name}.{uc_oss_proto.name}",
        creation_timestamp=uc_oss_proto.created_at,
        last_updated_timestamp=uc_oss_proto.updated_at,
        description=uc_oss_proto.comment,
    )


def get_model_version_search_from_uc_oss_proto(
    uc_oss_proto: ModelVersionInfo,
) -> ModelVersionSearch:
    return ModelVersionSearch(
        name=f"{uc_oss_proto.catalog_name}.{uc_oss_proto.schema_name}.{uc_oss_proto.model_name}",
        version=uc_oss_proto.version,
        creation_timestamp=uc_oss_proto.created_at,
        last_updated_timestamp=uc_oss_proto.updated_at,
        description=uc_oss_proto.comment,
        source=uc_oss_proto.source,
        run_id=uc_oss_proto.run_id,
        status=uc_oss_model_version_status_to_string(uc_oss_proto.status),
    )


def uc_oss_model_version_status_to_string(status):
    return _STATUS_TO_STRING[status]


filter_pattern = re.compile(r"^name\s*=\s*'([^']+)'")


def parse_model_name(filter):
    trimmed_filter = filter.strip()
    if match := filter_pattern.match(trimmed_filter):
        model_name_str = match.group(1)
    elif trimmed_filter == "":
        raise MlflowException(
            "Missing filter: please specify a filter parameter in the format `name = 'model_name'`."
        )
    else:
        raise MlflowException(
            f"Unsupported filter query : `{trimmed_filter}`."
            + " Please specify your filter parameter in "
            + "the format `name = 'model_name'`."
        )
    parts = model_name_str.split(".")
    if len(parts) != 3 or not all(parts):
        raise MlflowException(
            "Bad model name: please specify all three levels of the model in the"
            "form `catalog_name.schema_name.model_name`"
        )
    catalog, schema, model = parts
    return f"{catalog}.{schema}.{model}"
```

--------------------------------------------------------------------------------

---[FILE: _unity_catalog_utils.py]---
Location: mlflow-master/mlflow/utils/_unity_catalog_utils.py

```python
import logging
from typing import Callable

from mlflow.entities.logged_model_parameter import LoggedModelParameter as ModelParam
from mlflow.entities.metric import Metric
from mlflow.entities.model_registry import (
    ModelVersion,
    ModelVersionDeploymentJobState,
    ModelVersionTag,
    RegisteredModel,
    RegisteredModelAlias,
    RegisteredModelDeploymentJobState,
    RegisteredModelTag,
)
from mlflow.entities.model_registry.model_version_search import ModelVersionSearch
from mlflow.entities.model_registry.registered_model_search import RegisteredModelSearch
from mlflow.environment_variables import MLFLOW_USE_DATABRICKS_SDK_MODEL_ARTIFACTS_REPO_FOR_UC
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_uc_registry_messages_pb2 import (
    EmitModelVersionLineageRequest,
    EmitModelVersionLineageResponse,
    IsDatabricksSdkModelsArtifactRepositoryEnabledRequest,
    IsDatabricksSdkModelsArtifactRepositoryEnabledResponse,
    ModelVersionLineageInfo,
    SseEncryptionAlgorithm,
    TemporaryCredentials,
)
from mlflow.protos.databricks_uc_registry_messages_pb2 import ModelVersion as ProtoModelVersion
from mlflow.protos.databricks_uc_registry_messages_pb2 import (
    ModelVersionStatus as ProtoModelVersionStatus,
)
from mlflow.protos.databricks_uc_registry_messages_pb2 import (
    ModelVersionTag as ProtoModelVersionTag,
)
from mlflow.protos.databricks_uc_registry_messages_pb2 import (
    RegisteredModel as ProtoRegisteredModel,
)
from mlflow.protos.databricks_uc_registry_messages_pb2 import (
    RegisteredModelTag as ProtoRegisteredModelTag,
)
from mlflow.protos.databricks_uc_registry_service_pb2 import UcModelRegistryService
from mlflow.protos.unity_catalog_oss_messages_pb2 import (
    TemporaryCredentials as TemporaryCredentialsOSS,
)
from mlflow.store.artifact.artifact_repo import ArtifactRepository
from mlflow.utils.proto_json_utils import message_to_json
from mlflow.utils.rest_utils import (
    _REST_API_PATH_PREFIX,
    call_endpoint,
    extract_api_info_for_service,
)

_logger = logging.getLogger(__name__)
_METHOD_TO_INFO = extract_api_info_for_service(UcModelRegistryService, _REST_API_PATH_PREFIX)
_STRING_TO_STATUS = {k: ProtoModelVersionStatus.Value(k) for k in ProtoModelVersionStatus.keys()}
_STATUS_TO_STRING = {value: key for key, value in _STRING_TO_STATUS.items()}
_ACTIVE_CATALOG_QUERY = "SELECT current_catalog() AS catalog"
_ACTIVE_SCHEMA_QUERY = "SELECT current_database() AS schema"


def uc_model_version_status_to_string(status):
    return _STATUS_TO_STRING[status]


def model_version_from_uc_proto(uc_proto: ProtoModelVersion) -> ModelVersion:
    return ModelVersion(
        name=uc_proto.name,
        version=uc_proto.version,
        creation_timestamp=uc_proto.creation_timestamp,
        last_updated_timestamp=uc_proto.last_updated_timestamp,
        description=uc_proto.description,
        user_id=uc_proto.user_id,
        source=uc_proto.source,
        run_id=uc_proto.run_id,
        status=uc_model_version_status_to_string(uc_proto.status),
        status_message=uc_proto.status_message,
        aliases=[alias.alias for alias in (uc_proto.aliases or [])],
        tags=[ModelVersionTag(key=tag.key, value=tag.value) for tag in (uc_proto.tags or [])],
        model_id=uc_proto.model_id,
        params=[
            ModelParam(key=param.name, value=param.value) for param in (uc_proto.model_params or [])
        ],
        metrics=[
            Metric(
                key=metric.key,
                value=metric.value,
                timestamp=metric.timestamp,
                step=metric.step,
                dataset_name=metric.dataset_name,
                dataset_digest=metric.dataset_digest,
                model_id=metric.model_id,
                run_id=metric.run_id,
            )
            for metric in (uc_proto.model_metrics or [])
        ],
        deployment_job_state=ModelVersionDeploymentJobState.from_proto(
            uc_proto.deployment_job_state
        ),
    )


def model_version_search_from_uc_proto(uc_proto: ProtoModelVersion) -> ModelVersionSearch:
    return ModelVersionSearch(
        name=uc_proto.name,
        version=uc_proto.version,
        creation_timestamp=uc_proto.creation_timestamp,
        last_updated_timestamp=uc_proto.last_updated_timestamp,
        description=uc_proto.description,
        user_id=uc_proto.user_id,
        source=uc_proto.source,
        run_id=uc_proto.run_id,
        status=uc_model_version_status_to_string(uc_proto.status),
        status_message=uc_proto.status_message,
        aliases=[],
        tags=[],
        deployment_job_state=ModelVersionDeploymentJobState.from_proto(
            uc_proto.deployment_job_state
        ),
    )


def registered_model_from_uc_proto(uc_proto: ProtoRegisteredModel) -> RegisteredModel:
    return RegisteredModel(
        name=uc_proto.name,
        creation_timestamp=uc_proto.creation_timestamp,
        last_updated_timestamp=uc_proto.last_updated_timestamp,
        description=uc_proto.description,
        aliases=[
            RegisteredModelAlias(alias=alias.alias, version=alias.version)
            for alias in (uc_proto.aliases or [])
        ],
        tags=[RegisteredModelTag(key=tag.key, value=tag.value) for tag in (uc_proto.tags or [])],
        deployment_job_id=uc_proto.deployment_job_id,
        deployment_job_state=RegisteredModelDeploymentJobState.to_string(
            uc_proto.deployment_job_state
        ),
    )


def registered_model_search_from_uc_proto(uc_proto: ProtoRegisteredModel) -> RegisteredModelSearch:
    return RegisteredModelSearch(
        name=uc_proto.name,
        creation_timestamp=uc_proto.creation_timestamp,
        last_updated_timestamp=uc_proto.last_updated_timestamp,
        description=uc_proto.description,
        aliases=[],
        tags=[],
    )


def uc_registered_model_tag_from_mlflow_tags(
    tags: list[RegisteredModelTag] | None,
) -> list[ProtoRegisteredModelTag]:
    if tags is None:
        return []
    return [ProtoRegisteredModelTag(key=t.key, value=t.value) for t in tags]


def uc_model_version_tag_from_mlflow_tags(
    tags: list[ModelVersionTag] | None,
) -> list[ProtoModelVersionTag]:
    if tags is None:
        return []
    return [ProtoModelVersionTag(key=t.key, value=t.value) for t in tags]


def get_artifact_repo_from_storage_info(
    storage_location: str,
    scoped_token: TemporaryCredentials,
    base_credential_refresh_def: Callable[[], TemporaryCredentials],
    is_oss: bool = False,
) -> ArtifactRepository:
    """
    Get an ArtifactRepository instance capable of reading/writing to a UC model version's
    file storage location

    Args:
        storage_location: Storage location of the model version
        scoped_token: Protobuf scoped token to use to authenticate to blob storage
        base_credential_refresh_def: Function that returns temporary credentials for accessing blob
            storage. It is first used to determine the type of blob storage and to access it. It is
            then passed to the relevant ArtifactRepository implementation to refresh credentials as
            needed.
        is_oss: Whether the user is using the OSS version of Unity Catalog
    """
    try:
        if is_oss:
            return _get_artifact_repo_from_storage_info_oss(
                storage_location=storage_location,
                scoped_token=scoped_token,
                base_credential_refresh_def=base_credential_refresh_def,
            )
        else:
            return _get_artifact_repo_from_storage_info(
                storage_location=storage_location,
                scoped_token=scoped_token,
                base_credential_refresh_def=base_credential_refresh_def,
            )
    except ImportError as e:
        raise MlflowException(
            "Unable to import necessary dependencies to access model version files in "
            "Unity Catalog. Please ensure you have the necessary dependencies installed, "
            "e.g. by running 'pip install mlflow[databricks]' or "
            "'pip install mlflow-skinny[databricks]'"
        ) from e


def _get_artifact_repo_from_storage_info(
    storage_location: str,
    scoped_token: TemporaryCredentials,
    base_credential_refresh_def: Callable[[], TemporaryCredentials],
) -> ArtifactRepository:
    credential_type = scoped_token.WhichOneof("credentials")
    if credential_type == "aws_temp_credentials":
        # Verify upfront that boto3 is importable
        import boto3  # noqa: F401

        from mlflow.store.artifact.optimized_s3_artifact_repo import OptimizedS3ArtifactRepository

        aws_creds = scoped_token.aws_temp_credentials
        s3_upload_extra_args = _parse_aws_sse_credential(scoped_token)

        def aws_credential_refresh():
            new_scoped_token = base_credential_refresh_def()
            new_aws_creds = new_scoped_token.aws_temp_credentials
            new_s3_upload_extra_args = _parse_aws_sse_credential(new_scoped_token)
            return {
                "access_key_id": new_aws_creds.access_key_id,
                "secret_access_key": new_aws_creds.secret_access_key,
                "session_token": new_aws_creds.session_token,
                "s3_upload_extra_args": new_s3_upload_extra_args,
            }

        return OptimizedS3ArtifactRepository(
            artifact_uri=storage_location,
            access_key_id=aws_creds.access_key_id,
            secret_access_key=aws_creds.secret_access_key,
            session_token=aws_creds.session_token,
            credential_refresh_def=aws_credential_refresh,
            s3_upload_extra_args=s3_upload_extra_args,
        )
    elif credential_type == "azure_user_delegation_sas":
        from azure.core.credentials import AzureSasCredential

        from mlflow.store.artifact.azure_data_lake_artifact_repo import (
            AzureDataLakeArtifactRepository,
        )

        sas_token = scoped_token.azure_user_delegation_sas.sas_token

        def azure_credential_refresh():
            new_scoped_token = base_credential_refresh_def()
            new_sas_token = new_scoped_token.azure_user_delegation_sas.sas_token
            return {
                "credential": AzureSasCredential(new_sas_token),
            }

        return AzureDataLakeArtifactRepository(
            artifact_uri=storage_location,
            credential=AzureSasCredential(sas_token),
            credential_refresh_def=azure_credential_refresh,
        )

    elif credential_type == "gcp_oauth_token":
        from google.cloud.storage import Client
        from google.oauth2.credentials import Credentials

        from mlflow.store.artifact.gcs_artifact_repo import GCSArtifactRepository

        credentials = Credentials(scoped_token.gcp_oauth_token.oauth_token)

        def gcp_credential_refresh():
            new_scoped_token = base_credential_refresh_def()
            new_gcp_creds = new_scoped_token.gcp_oauth_token
            return {
                "oauth_token": new_gcp_creds.oauth_token,
            }

        client = Client(project="mlflow", credentials=credentials)
        return GCSArtifactRepository(
            artifact_uri=storage_location,
            client=client,
            credential_refresh_def=gcp_credential_refresh,
        )
    elif credential_type == "r2_temp_credentials":
        from mlflow.store.artifact.r2_artifact_repo import R2ArtifactRepository

        r2_creds = scoped_token.r2_temp_credentials

        def r2_credential_refresh():
            new_scoped_token = base_credential_refresh_def()
            new_r2_creds = new_scoped_token.r2_temp_credentials
            return {
                "access_key_id": new_r2_creds.access_key_id,
                "secret_access_key": new_r2_creds.secret_access_key,
                "session_token": new_r2_creds.session_token,
            }

        return R2ArtifactRepository(
            artifact_uri=storage_location,
            access_key_id=r2_creds.access_key_id,
            secret_access_key=r2_creds.secret_access_key,
            session_token=r2_creds.session_token,
            credential_refresh_def=r2_credential_refresh,
        )
    else:
        raise MlflowException(
            f"Got unexpected credential type {credential_type} when attempting to "
            "access model version files in Unity Catalog. Try upgrading to the latest "
            "version of the MLflow Python client."
        )


def _get_artifact_repo_from_storage_info_oss(
    storage_location: str,
    scoped_token: TemporaryCredentialsOSS,
    base_credential_refresh_def: Callable[[], TemporaryCredentialsOSS],
) -> ArtifactRepository:
    # OSS Temp Credential doesn't have a oneof credential field
    # So, we must check for the individual cloud credentials
    if len(scoped_token.aws_temp_credentials.access_key_id) > 0:
        # Verify upfront that boto3 is importable
        import boto3  # noqa: F401

        from mlflow.store.artifact.optimized_s3_artifact_repo import OptimizedS3ArtifactRepository

        aws_creds = scoped_token.aws_temp_credentials

        def aws_credential_refresh():
            new_scoped_token = base_credential_refresh_def()
            new_aws_creds = new_scoped_token.aws_temp_credentials
            return {
                "access_key_id": new_aws_creds.access_key_id,
                "secret_access_key": new_aws_creds.secret_access_key,
                "session_token": new_aws_creds.session_token,
            }

        return OptimizedS3ArtifactRepository(
            artifact_uri=storage_location,
            access_key_id=aws_creds.access_key_id,
            secret_access_key=aws_creds.secret_access_key,
            session_token=aws_creds.session_token,
            credential_refresh_def=aws_credential_refresh,
        )
    elif len(scoped_token.azure_user_delegation_sas.sas_token) > 0:
        from azure.core.credentials import AzureSasCredential

        from mlflow.store.artifact.azure_data_lake_artifact_repo import (
            AzureDataLakeArtifactRepository,
        )

        sas_token = scoped_token.azure_user_delegation_sas.sas_token

        def azure_credential_refresh():
            new_scoped_token = base_credential_refresh_def()
            new_sas_token = new_scoped_token.azure_user_delegation_sas.sas_token
            return {
                "credential": AzureSasCredential(new_sas_token),
            }

        return AzureDataLakeArtifactRepository(
            artifact_uri=storage_location,
            credential=AzureSasCredential(sas_token),
            credential_refresh_def=azure_credential_refresh,
        )

    elif len(scoped_token.gcp_oauth_token.oauth_token) > 0:
        from google.cloud.storage import Client
        from google.oauth2.credentials import Credentials

        from mlflow.store.artifact.gcs_artifact_repo import GCSArtifactRepository

        credentials = Credentials(scoped_token.gcp_oauth_token.oauth_token)
        client = Client(project="mlflow", credentials=credentials)
        return GCSArtifactRepository(artifact_uri=storage_location, client=client)
    else:
        raise MlflowException(
            "Got no credential type when attempting to "
            "access model version files in Unity Catalog. Try upgrading to the latest "
            "version of the MLflow Python client."
        )


def _parse_aws_sse_credential(scoped_token: TemporaryCredentials):
    encryption_details = scoped_token.encryption_details
    if not encryption_details:
        return {}

    if encryption_details.WhichOneof("encryption_details_type") != "sse_encryption_details":
        return {}

    sse_encryption_details = encryption_details.sse_encryption_details

    if sse_encryption_details.algorithm == SseEncryptionAlgorithm.AWS_SSE_S3:
        return {
            "ServerSideEncryption": "AES256",
        }
    if sse_encryption_details.algorithm == SseEncryptionAlgorithm.AWS_SSE_KMS:
        key_id = sse_encryption_details.aws_kms_key_arn.split("/")[-1]
        return {
            "ServerSideEncryption": "aws:kms",
            "SSEKMSKeyId": key_id,
        }
    else:
        return {}


def get_full_name_from_sc(name, spark) -> str:
    """
    Constructs the full name of a registered model using the active catalog and schema in a spark
    session / context.

    Args:
        name: The model name provided by the user.
        spark: The active spark session.
    """
    num_levels = len(name.split("."))
    if num_levels >= 3 or spark is None:
        return name
    catalog = spark.sql(_ACTIVE_CATALOG_QUERY).collect()[0]["catalog"]
    # return the user provided name if the catalog is the hive metastore default
    if catalog in {"spark_catalog", "hive_metastore"}:
        return name
    if num_levels == 2:
        return f"{catalog}.{name}"
    schema = spark.sql(_ACTIVE_SCHEMA_QUERY).collect()[0]["schema"]
    return f"{catalog}.{schema}.{name}"


def is_databricks_sdk_models_artifact_repository_enabled(host_creds):
    # Return early if the environment variable is set to use the SDK models artifact repository
    if MLFLOW_USE_DATABRICKS_SDK_MODEL_ARTIFACTS_REPO_FOR_UC.defined:
        return MLFLOW_USE_DATABRICKS_SDK_MODEL_ARTIFACTS_REPO_FOR_UC.get()

    endpoint, method = _METHOD_TO_INFO[IsDatabricksSdkModelsArtifactRepositoryEnabledRequest]
    req_body = message_to_json(IsDatabricksSdkModelsArtifactRepositoryEnabledRequest())
    response_proto = IsDatabricksSdkModelsArtifactRepositoryEnabledResponse()

    try:
        resp = call_endpoint(
            host_creds=host_creds,
            endpoint=endpoint,
            method=method,
            json_body=req_body,
            response_proto=response_proto,
        )
        return resp.is_databricks_sdk_models_artifact_repository_enabled
    except Exception as e:
        _logger.warning(
            "Failed to confirm if DatabricksSDKModelsArtifactRepository should be used; "
            f"falling back to default. Error: {e}"
        )
    return False


def emit_model_version_lineage(host_creds, name, version, entities, direction):
    endpoint, method = _METHOD_TO_INFO[EmitModelVersionLineageRequest]

    req_body = message_to_json(
        EmitModelVersionLineageRequest(
            name=name,
            version=version,
            model_version_lineage_info=ModelVersionLineageInfo(
                entities=entities,
                direction=direction,
            ),
        )
    )
    response_proto = EmitModelVersionLineageResponse()
    try:
        call_endpoint(
            host_creds=host_creds,
            endpoint=endpoint,
            method=method,
            json_body=req_body,
            response_proto=response_proto,
        )
    except Exception as e:
        _logger.warning(f"Failed to emit best-effort model version lineage. Error: {e}")
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/utils/__init__.py

```python
import inspect
import logging
import socket
import subprocess
import uuid
from contextlib import closing
from itertools import islice
from sys import version_info

PYTHON_VERSION = f"{version_info.major}.{version_info.minor}.{version_info.micro}"


_logger = logging.getLogger(__name__)


def get_major_minor_py_version(py_version):
    return ".".join(py_version.split(".")[:2])


def reraise(tp, value, tb=None):
    # Taken from: https://github.com/benjaminp/six/blob/1.15.0/six.py#L694-L700
    try:
        if value is None:
            value = tp()
        if value.__traceback__ is not tb:
            raise value.with_traceback(tb)
        raise value
    finally:
        value = None
        tb = None


def chunk_list(l, chunk_size):
    for i in range(0, len(l), chunk_size):
        yield l[i : i + chunk_size]


def _chunk_dict(d, chunk_size):
    """
    Splits a dictionary into chunks of the specified size.
    Taken from: https://stackoverflow.com/a/22878842
    """
    it = iter(d)
    for _ in range(0, len(d), chunk_size):
        yield {k: d[k] for k in islice(it, chunk_size)}


def _truncate_and_ellipsize(value, max_length):
    """
    Truncates the string representation of the specified value to the specified
    maximum length, if necessary. The end of the string is ellipsized if truncation occurs
    """
    value = str(value)
    if len(value) > max_length:
        return value[: (max_length - 3)] + "..."
    else:
        return value


def _truncate_dict(d, max_key_length=None, max_value_length=None):
    """
    Truncates keys and/or values in a dictionary to the specified maximum length.
    Truncated items will be converted to strings and ellipsized.
    """
    key_is_none = max_key_length is None
    val_is_none = max_value_length is None

    if key_is_none and val_is_none:
        raise ValueError("Must specify at least either `max_key_length` or `max_value_length`")

    truncated = {}
    for k, v in d.items():
        should_truncate_key = (not key_is_none) and (len(str(k)) > max_key_length)
        should_truncate_val = (not val_is_none) and (len(str(v)) > max_value_length)

        new_k = _truncate_and_ellipsize(k, max_key_length) if should_truncate_key else k
        if should_truncate_key:
            # Use the truncated key for warning logs to avoid noisy printing to stdout
            msg = f"Truncated the key `{new_k}`"
            _logger.warning(msg)

        new_v = _truncate_and_ellipsize(v, max_value_length) if should_truncate_val else v
        if should_truncate_val:
            # Use the truncated key and value for warning logs to avoid noisy printing to stdout
            msg = f"Truncated the value of the key `{new_k}`. Truncated value: `{new_v}`"
            _logger.warning(msg)

        truncated[new_k] = new_v

    return truncated


def merge_dicts(dict_a, dict_b, raise_on_duplicates=True):
    """This function takes two dictionaries and returns one singular merged dictionary.

    Args:
        dict_a: The first dictionary.
        dict_b: The second dictionary.
        raise_on_duplicates: If True, the function raises ValueError if there are duplicate keys.
            Otherwise, duplicate keys in `dict_b` will override the ones in `dict_a`.

    Returns:
        A merged dictionary.

    """
    duplicate_keys = dict_a.keys() & dict_b.keys()
    if raise_on_duplicates and len(duplicate_keys) > 0:
        raise ValueError(f"The two merging dictionaries contains duplicate keys: {duplicate_keys}.")
    return {**dict_a, **dict_b}


def _get_fully_qualified_class_name(obj):
    """
    Obtains the fully qualified class name of the given object.
    """
    return obj.__class__.__module__ + "." + obj.__class__.__name__


def _inspect_original_var_name(var, fallback_name):
    """
    Inspect variable name, will search above frames and fetch the same instance variable name
    in the most outer frame.
    If inspect failed, return fallback_name
    """
    if var is None:
        return fallback_name
    try:
        original_var_name = fallback_name

        frame = inspect.currentframe().f_back
        while frame is not None:
            arg_info = inspect.getargvalues(frame)

            fixed_args = [arg_info.locals[arg_name] for arg_name in arg_info.args]
            varlen_args = list(arg_info.locals[arg_info.varargs]) if arg_info.varargs else []
            keyword_args = (
                list(arg_info.locals[arg_info.keywords].values()) if arg_info.keywords else []
            )

            all_args = fixed_args + varlen_args + keyword_args

            # check whether `var` is in arg list first. If yes, go to check parent frame.
            if any(var is arg for arg in all_args):
                # the var is passed in from caller, check parent frame.
                frame = frame.f_back
                continue

            for var_name, var_val in frame.f_locals.items():
                if var_val is var:
                    original_var_name = var_name
                    break

            break

        return original_var_name

    except Exception:
        return fallback_name


def find_free_port():
    """
    Find free socket port on local machine.
    """
    with closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as s:
        s.bind(("", 0))
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        return s.getsockname()[1]


def check_port_connectivity():
    port = find_free_port()
    try:
        with subprocess.Popen(
            ["nc", "-l", "-p", str(port)],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        ) as server:
            with subprocess.Popen(
                ["nc", "-zv", "localhost", str(port)],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            ) as client:
                client.wait()
                server.terminate()
                return client.returncode == 0
    except Exception as e:
        _logger.warning("Failed to check port connectivity: %s", e)
        return False


def is_iterator(obj):
    """
    Args:
        obj: Any object.

    Returns:
        Boolean representing whether or not 'obj' is an iterator.
    """
    return (hasattr(obj, "__next__") or hasattr(obj, "next")) and hasattr(obj, "__iter__")


def _is_in_ipython_notebook():
    try:
        from IPython import get_ipython

        return get_ipython() is not None
    except Exception:
        return False


def get_results_from_paginated_fn(paginated_fn, max_results_per_page, max_results=None):
    """Gets results by calling the ``paginated_fn`` until either no more results remain or
    the specified ``max_results`` threshold has been reached.

    Args:
        paginated_fn: This function is expected to take in the number of results to retrieve
            per page and a pagination token, and return a PagedList object.
        max_results_per_page: The maximum number of results to retrieve per page.
        max_results: The maximum number of results to retrieve overall. If unspecified,
            all results will be retrieved.

    Returns:
        Returns a list of entities, as determined by the paginated_fn parameter, with no more
        entities than specified by max_results.

    """
    all_results = []
    next_page_token = None
    returns_all = max_results is None
    while returns_all or len(all_results) < max_results:
        num_to_get = max_results_per_page if returns_all else max_results - len(all_results)
        if num_to_get < max_results_per_page:
            page_results = paginated_fn(num_to_get, next_page_token)
        else:
            page_results = paginated_fn(max_results_per_page, next_page_token)
        all_results.extend(page_results)
        if hasattr(page_results, "token") and page_results.token:
            next_page_token = page_results.token
        else:
            break
    return all_results


class AttrDict(dict):
    """
    Dict-like object that exposes its keys as attributes.

    Examples
    --------
    >>> d = AttrDict({"a": 1, "b": 2})
    >>> d.a
    1
    >>> d = AttrDict({"a": 1, "b": {"c": 3, "d": 4}})
    >>> d.b.c
    3
    >>> d.c = 5
    >>> d.c
    5
    """

    def __getattr__(self, attr):
        try:
            value = self[attr]
        except KeyError:
            raise AttributeError(f"'{self.__class__.__name__}' object has no attribute '{attr}'")
        if isinstance(value, dict):
            return AttrDict(value)
        return value

    def __setattr__(self, attr, value):
        self[attr] = value

    def __delattr__(self, key):
        del self[key]


def get_parent_module(module):
    return module[0 : module.rindex(".")]


def is_uuid(s: str) -> bool:
    """
    Returns True if the specified string is a UUID, False otherwise.
    """
    try:
        uuid.UUID(s)
        return True
    except ValueError:
        return False
```

--------------------------------------------------------------------------------

````
