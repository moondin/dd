---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 385
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 385 of 991)

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

---[FILE: context.py]---
Location: mlflow-master/mlflow/pyfunc/context.py

```python
import contextlib
from contextvars import ContextVar
from dataclasses import dataclass
from typing import Any

# A thread local variable to store the context of the current prediction request.
# This is particularly used to associate logs/traces with a specific prediction request in the
# caller side. The context variable is intended to be set by the called before invoking the
# predict method, using the set_prediction_context context manager.
_PREDICTION_REQUEST_CTX = ContextVar("mlflow_prediction_request_context", default=None)


@dataclass
class Context:
    # A unique identifier for the current prediction request.
    request_id: str | None = None
    # Whether the current prediction request is as a part of MLflow model evaluation.
    is_evaluate: bool = False
    # The schema of the dependencies to be added into the tag of trace info.
    dependencies_schemas: dict[str, Any] | None = None
    # The logged model ID associated with the current prediction request
    model_id: str | None = None
    # The model serving endpoint name where the prediction request is made
    endpoint_name: str | None = None

    def __init__(
        self,
        request_id: str | None = None,
        is_evaluate: bool = False,
        dependencies_schemas: dict[str, Any] | None = None,
        model_id: str | None = None,
        endpoint_name: str | None = None,
        # Accept extra kwargs so we don't need to worry backward compatibility
        # when adding new attributes to the Context class
        **kwargs,
    ):
        self.request_id = request_id
        self.is_evaluate = is_evaluate
        self.dependencies_schemas = dependencies_schemas
        self.model_id = model_id
        self.endpoint_name = endpoint_name

    def update(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
            else:
                raise AttributeError(f"Context has no attribute named '{key}'")


@contextlib.contextmanager
def set_prediction_context(context: Context | None):
    """
    Set the context for the current prediction request. The context will be set as a thread-local
    variable and will be accessible globally within the same thread.

    Args:
        context: The context for the current prediction request.
    """
    if context and not isinstance(context, Context):
        raise TypeError(f"Expected context to be an instance of Context, but got: {context}")

    token = _PREDICTION_REQUEST_CTX.set(context)
    try:
        yield
    finally:
        _PREDICTION_REQUEST_CTX.reset(token)


def get_prediction_context() -> Context | None:
    """
    Get the context for the current prediction request. The context is thread-local and is set
    using the set_prediction_context context manager.

    Returns:
        The context for the current prediction request, or None if no context is set.
    """
    return _PREDICTION_REQUEST_CTX.get()
```

--------------------------------------------------------------------------------

---[FILE: dbconnect_artifact_cache.py]---
Location: mlflow-master/mlflow/pyfunc/dbconnect_artifact_cache.py

```python
import json
import os
import subprocess
import tarfile

from mlflow.utils.databricks_utils import is_in_databricks_runtime
from mlflow.utils.file_utils import get_or_create_tmp_dir

_CACHE_MAP_FILE_NAME = "db_connect_artifact_cache.json"


class DBConnectArtifactCache:
    """
    Manages Databricks Connect artifacts cache.
    Note it doesn't support OSS Spark Connect.

    This class can be used in the following environment:
     - Databricks shared cluster python notebook REPL
     - Databricks Serverless python notebook REPL
     - Databricks connect client python REPL that connects to remote Databricks Serverless
     - Databricks connect client python REPL that connects to remote Databricks shared cluster

    .. code-block:: python
        :caption: Example

        # client side code
        db_artifact_cache = DBConnectArtifactCache.get_or_create()
        db_artifact_cache.add_artifact_archive("archive1", "/tmp/archive1.tar.gz")


        @pandas_udf(...)
        def my_udf(x):
            # we can get the unpacked archive files in `archive1_unpacked_dir`
            archive1_unpacked_dir = db_artifact_cache.get("archive1")
    """

    _global_cache = None

    @staticmethod
    def get_or_create(spark):
        if (
            DBConnectArtifactCache._global_cache is None
            or spark is not DBConnectArtifactCache._global_cache._spark
        ):
            DBConnectArtifactCache._global_cache = DBConnectArtifactCache(spark)
            cache_file = os.path.join(get_or_create_tmp_dir(), _CACHE_MAP_FILE_NAME)
            if is_in_databricks_runtime() and os.path.exists(cache_file):
                # In databricks runtime (shared cluster or Serverless), when you restart the
                # notebook REPL by %restart_python or dbutils.library.restartPython(), the
                # DBConnect session is still preserved. So in this case, we can reuse the cached
                # artifact files.
                # So that when adding artifact, the cache map is serialized to local disk file
                # `db_connect_artifact_cache.json` and after REPL restarts,
                # `DBConnectArtifactCache` restores the cache map by loading data from the file.
                with open(cache_file) as f:
                    DBConnectArtifactCache._global_cache._cache = json.load(f)
        return DBConnectArtifactCache._global_cache

    def __init__(self, spark):
        self._spark = spark
        self._cache = {}

    def __getstate__(self):
        """
        The `DBConnectArtifactCache` instance is created in Databricks Connect client side,
        and it will be pickled to Databricks Connect UDF sandbox
        (see `get_unpacked_artifact_dir` method), but Spark Connect client object is
        not pickle-able, we need to skip this field.
        """
        state = self.__dict__.copy()
        # Don't pickle `_spark`
        del state["_spark"]
        return state

    def __setstate__(self, state):
        self.__dict__.update(state)
        self._spark = None

    def has_cache_key(self, cache_key):
        return cache_key in self._cache

    def add_artifact_archive(self, cache_key, artifact_archive_path):
        """
        Add an artifact archive file to Databricks connect cache.
        The archive file must be 'tar.gz' format.
        You can only call this method in Databricks Connect client side.
        """
        if not artifact_archive_path.endswith(".tar.gz"):
            raise RuntimeError(
                "'add_artifact_archive' only supports archive file in 'tar.gz' format."
            )

        archive_file_name = os.path.basename(artifact_archive_path)
        if cache_key not in self._cache:
            self._spark.addArtifact(artifact_archive_path, archive=True)
            self._cache[cache_key] = archive_file_name

        if is_in_databricks_runtime():
            with open(os.path.join(get_or_create_tmp_dir(), _CACHE_MAP_FILE_NAME), "w") as f:
                json.dump(self._cache, f)

    def get_unpacked_artifact_dir(self, cache_key):
        """
        Get unpacked artifact directory path, you can only call this method
        inside Databricks Connect spark UDF sandbox.
        """
        if cache_key not in self._cache:
            raise RuntimeError(f"The artifact '{cache_key}' does not exist.")
        archive_file_name = self._cache[cache_key]

        if session_id := os.environ.get("DB_SESSION_UUID"):
            return (
                f"/local_disk0/.ephemeral_nfs/artifacts/{session_id}/archives/{archive_file_name}"
            )

        # If 'DB_SESSION_UUID' environment variable does not exist, it means it is running
        # in a dedicated mode Spark cluster.
        return os.path.join(os.getcwd(), archive_file_name)


def archive_directory(input_dir, archive_file_path):
    """
    Archive the `input_dir` directory, save the archive file to `archive_file_path`,
    the generated archive file is 'tar.gz' format.
    Note: all symlink files in the input directory are kept as it is in the archive file.
    """

    archive_file_path = os.path.abspath(archive_file_path)
    # Note: `shutil.make_archive` doesn't work because it replaces symlink files with
    #  the file symlink pointing to, which is not the expected behavior in our usage.
    #  We need to pack the python and virtualenv environment, which contains a bunch of
    #  symlink files.
    subprocess.check_call(
        ["tar", "-czf", archive_file_path, *os.listdir(input_dir)],
        cwd=input_dir,
    )
    return archive_file_path


def extract_archive_to_dir(archive_path, dest_dir):
    os.makedirs(dest_dir, exist_ok=True)
    with tarfile.open(archive_path, "r") as tar:
        tar.extractall(path=dest_dir)
    return dest_dir
```

--------------------------------------------------------------------------------

---[FILE: mlserver.py]---
Location: mlflow-master/mlflow/pyfunc/mlserver.py

```python
import logging
import os

_logger = logging.getLogger(__name__)

MLServerMLflowRuntime = "mlserver_mlflow.MLflowRuntime"
MLServerDefaultModelName = "mlflow-model"


def get_cmd(
    model_uri: str,
    port: int | None = None,
    host: str | None = None,
    timeout: int | None = None,
    nworkers: int | None = None,
    model_name: str | None = None,
    model_version: str | None = None,
) -> tuple[str, dict[str, str]]:
    cmd = f"mlserver start {model_uri}"

    cmd_env = os.environ.copy()

    if port:
        cmd_env["MLSERVER_HTTP_PORT"] = str(port)

    if host:
        cmd_env["MLSERVER_HOST"] = host

    if timeout:
        _logger.warning("Timeout is not yet supported in MLServer.")

    if nworkers:
        cmd_env["MLSERVER_PARALLEL_WORKERS"] = str(nworkers)

    # give precedence to user env var input
    cmd_env["MLSERVER_MODEL_NAME"] = (
        cmd_env.get("MLSERVER_MODEL_NAME") or model_name or MLServerDefaultModelName
    )
    if model_version and not cmd_env.get("MLSERVER_MODEL_VERSION"):
        cmd_env["MLSERVER_MODEL_VERSION"] = model_version

    cmd_env["MLSERVER_MODEL_IMPLEMENTATION"] = MLServerMLflowRuntime
    cmd_env["MLSERVER_MODEL_URI"] = model_uri

    return cmd, cmd_env
```

--------------------------------------------------------------------------------

````
