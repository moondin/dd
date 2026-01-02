---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 737
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 737 of 991)

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

---[FILE: lazy_load.py]---
Location: mlflow-master/mlflow/utils/lazy_load.py

```python
"""Utility to lazy load modules."""

import importlib
import sys
import types


class LazyLoader(types.ModuleType):
    """Class for module lazy loading.

    This class helps lazily load modules at package level, which avoids pulling in large
    dependencies like `tensorflow` or `torch`. This class is mirrored from wandb's LazyLoader:
    https://github.com/wandb/wandb/blob/79b2d4b73e3a9e4488e503c3131ff74d151df689/wandb/sdk/lib/lazyloader.py#L9
    """

    def __init__(self, local_name, parent_module_globals, name):
        self._local_name = local_name
        self._parent_module_globals = parent_module_globals

        self._module = None
        super().__init__(str(name))

    def _load(self):
        """Load the module and insert it into the parent's globals."""
        if self._module:
            # If already loaded, return the loaded module.
            return self._module

        # Import the target module and insert it into the parent's namespace
        module = importlib.import_module(self.__name__)
        self._parent_module_globals[self._local_name] = module
        sys.modules[self._local_name] = module

        # Update this object's dict so that if someone keeps a reference to the `LazyLoader`,
        # lookups are efficient (`__getattr__` is only called on lookups that fail).
        self.__dict__.update(module.__dict__)

        return module

    def __getattr__(self, item):
        module = self._load()
        return getattr(module, item)

    def __dir__(self):
        module = self._load()
        return dir(module)

    def __repr__(self):
        if not self._module:
            return f"<module '{self.__name__} (Not loaded yet)'>"
        return repr(self._module)
```

--------------------------------------------------------------------------------

---[FILE: logging_utils.py]---
Location: mlflow-master/mlflow/utils/logging_utils.py
Signals: SQLAlchemy

```python
import contextlib
import logging
import logging.config
import re
import sys

from mlflow.environment_variables import MLFLOW_LOGGING_LEVEL
from mlflow.utils.thread_utils import ThreadLocalVariable

# Logging format example:
# 2018/11/20 12:36:37 INFO mlflow.sagemaker: Creating new SageMaker endpoint
LOGGING_LINE_FORMAT = "%(asctime)s %(levelname)s %(name)s: %(message)s"
LOGGING_DATETIME_FORMAT = "%Y/%m/%d %H:%M:%S"


class MlflowLoggingStream:
    """
    A Python stream for use with event logging APIs throughout MLflow (`eprint()`,
    `logger.info()`, etc.). This stream wraps `sys.stderr`, forwarding `write()` and
    `flush()` calls to the stream referred to by `sys.stderr` at the time of the call.
    It also provides capabilities for disabling the stream to silence event logs.
    """

    def __init__(self):
        self._enabled = True

    def write(self, text):
        if self._enabled:
            sys.stderr.write(text)

    def flush(self):
        if self._enabled:
            sys.stderr.flush()

    @property
    def enabled(self):
        return self._enabled

    @enabled.setter
    def enabled(self, value):
        self._enabled = value


MLFLOW_LOGGING_STREAM = MlflowLoggingStream()


def disable_logging():
    """
    Disables the `MlflowLoggingStream` used by event logging APIs throughout MLflow
    (`eprint()`, `logger.info()`, etc), silencing all subsequent event logs.
    """
    MLFLOW_LOGGING_STREAM.enabled = False


def enable_logging():
    """
    Enables the `MlflowLoggingStream` used by event logging APIs throughout MLflow
    (`eprint()`, `logger.info()`, etc), emitting all subsequent event logs. This
    reverses the effects of `disable_logging()`.
    """
    MLFLOW_LOGGING_STREAM.enabled = True


class MlflowFormatter(logging.Formatter):
    """
    Custom Formatter Class to support colored log
    ANSI characters might not work natively on older Windows, so disabling the feature for win32.
    See https://github.com/borntyping/python-colorlog/blob/dfa10f59186d3d716aec4165ee79e58f2265c0eb/colorlog/escape_codes.py#L16C8-L16C31
    """

    # Copied from color log package https://github.com/borntyping/python-colorlog/blob/dfa10f59186d3d716aec4165ee79e58f2265c0eb/colorlog/escape_codes.py#L33-L50
    COLORS = {
        "black": 30,
        "red": 31,
        "green": 32,
        "yellow": 33,
        "blue": 34,
        "purple": 35,
        "cyan": 36,
        "white": 37,
        "light_black": 90,
        "light_red": 91,
        "light_green": 92,
        "light_yellow": 93,
        "light_blue": 94,
        "light_purple": 95,
        "light_cyan": 96,
        "light_white": 97,
    }
    RESET = "\033[0m"

    def format(self, record):
        if color := getattr(record, "color", None):
            if color in self.COLORS and sys.platform != "win32":
                color_code = self._escape(self.COLORS[color])
                return f"{color_code}{super().format(record)}{self.RESET}"
        return super().format(record)

    def _escape(self, code: int) -> str:
        return f"\033[{code}m"


# Thread-local variable to suppress logs in the certain thread, used
# in telemetry client to suppress logs in the consumer thread
should_suppress_logs_in_thread = ThreadLocalVariable(default_factory=lambda: False)


class SuppressLogFilter(logging.Filter):
    def filter(self, record):
        if should_suppress_logs_in_thread.get():
            return False
        return super().filter(record)


def _configure_mlflow_loggers(root_module_name):
    logging.config.dictConfig(
        {
            "version": 1,
            "disable_existing_loggers": False,
            "formatters": {
                "mlflow_formatter": {
                    "()": MlflowFormatter,
                    "format": LOGGING_LINE_FORMAT,
                    "datefmt": LOGGING_DATETIME_FORMAT,
                },
            },
            "handlers": {
                "mlflow_handler": {
                    "formatter": "mlflow_formatter",
                    "class": "logging.StreamHandler",
                    "stream": MLFLOW_LOGGING_STREAM,
                    "filters": ["suppress_in_thread"],
                },
            },
            "loggers": {
                root_module_name: {
                    "handlers": ["mlflow_handler"],
                    "level": (MLFLOW_LOGGING_LEVEL.get() or "INFO").upper(),
                    "propagate": False,
                },
                "sqlalchemy.engine": {
                    "handlers": ["mlflow_handler"],
                    "level": "WARN",
                    "propagate": False,
                },
                "alembic": {
                    "handlers": ["mlflow_handler"],
                    "level": "INFO",
                    "propagate": False,
                },
            },
            "filters": {
                "suppress_in_thread": {
                    "()": SuppressLogFilter,
                }
            },
        }
    )


def eprint(*args, **kwargs):
    print(*args, file=MLFLOW_LOGGING_STREAM, **kwargs)


class LoggerMessageFilter(logging.Filter):
    def __init__(self, module: str, filter_regex: re.Pattern):
        super().__init__()
        self._pattern = filter_regex
        self._module = module

    def filter(self, record):
        if record.name == self._module and self._pattern.search(record.msg):
            return False
        return True


@contextlib.contextmanager
def suppress_logs(module: str, filter_regex: re.Pattern):
    """
    Context manager that suppresses log messages from the specified module that match the specified
    regular expression. This is useful for suppressing expected log messages from third-party
    libraries that are not relevant to the current test.
    """
    logger = logging.getLogger(module)
    filter = LoggerMessageFilter(module=module, filter_regex=filter_regex)
    logger.addFilter(filter)
    try:
        yield
    finally:
        logger.removeFilter(filter)


def _debug(s: str) -> None:
    """
    Debug function to test logging level.
    """
    logging.getLogger(__name__).debug(s)


@contextlib.contextmanager
def suppress_logs_in_thread():
    """
    Context manager to suppress logs in the current thread.
    """
    original_value = should_suppress_logs_in_thread.get()
    try:
        should_suppress_logs_in_thread.set(True)
        yield
    finally:
        should_suppress_logs_in_thread.set(original_value)
```

--------------------------------------------------------------------------------

---[FILE: mime_type_utils.py]---
Location: mlflow-master/mlflow/utils/mime_type_utils.py

```python
import os
import pathlib
from mimetypes import guess_type

from mlflow.version import IS_TRACING_SDK_ONLY


# TODO: Create a module to define constants to avoid circular imports
#  and move MLMODEL_FILE_NAME and MLPROJECT_FILE_NAME in the module.
def get_text_extensions():
    exts = [
        "txt",
        "log",
        "err",
        "cfg",
        "conf",
        "cnf",
        "cf",
        "ini",
        "properties",
        "prop",
        "hocon",
        "toml",
        "yaml",
        "yml",
        "xml",
        "json",
        "js",
        "py",
        "py3",
        "csv",
        "tsv",
        "md",
        "rst",
    ]

    if not IS_TRACING_SDK_ONLY:
        from mlflow.models.model import MLMODEL_FILE_NAME
        from mlflow.projects._project_spec import MLPROJECT_FILE_NAME

        exts.extend([MLMODEL_FILE_NAME, MLPROJECT_FILE_NAME])

    return exts


def _guess_mime_type(file_path):
    filename = pathlib.Path(file_path).name
    extension = os.path.splitext(filename)[-1].replace(".", "")
    # for MLmodel/mlproject with no extensions
    if extension == "":
        extension = filename
    if extension in get_text_extensions():
        return "text/plain"
    mime_type, _ = guess_type(filename)
    if not mime_type:
        # As a fallback, if mime type is not detected, treat it as a binary file
        return "application/octet-stream"
    return mime_type
```

--------------------------------------------------------------------------------

---[FILE: mlflow_tags.py]---
Location: mlflow-master/mlflow/utils/mlflow_tags.py

```python
"""
File containing all of the run tags in the mlflow. namespace.

See the System Tags section in the MLflow Tracking documentation for information on the
meaning of these tags.
"""

MLFLOW_EXPERIMENT_SOURCE_ID = "mlflow.experiment.sourceId"
MLFLOW_EXPERIMENT_SOURCE_TYPE = "mlflow.experiment.sourceType"
MLFLOW_RUN_NAME = "mlflow.runName"
MLFLOW_RUN_NOTE = "mlflow.note.content"
MLFLOW_PARENT_RUN_ID = "mlflow.parentRunId"
MLFLOW_ARTIFACT_LOCATION = "mlflow.artifactLocation"
MLFLOW_USER = "mlflow.user"
MLFLOW_SOURCE_TYPE = "mlflow.source.type"
MLFLOW_SOURCE_NAME = "mlflow.source.name"
MLFLOW_GIT_COMMIT = "mlflow.source.git.commit"
MLFLOW_GIT_BRANCH = "mlflow.source.git.branch"
MLFLOW_GIT_DIRTY = "mlflow.source.git.dirty"
MLFLOW_GIT_REPO_URL = "mlflow.source.git.repoURL"
MLFLOW_GIT_DIFF = "mlflow.source.git.diff"
MLFLOW_LOGGED_MODELS = "mlflow.log-model.history"
MLFLOW_MODEL_IS_EXTERNAL = "mlflow.model.isExternal"
MLFLOW_MODEL_VERSIONS = "mlflow.modelVersions"
MLFLOW_PROJECT_ENV = "mlflow.project.env"
MLFLOW_PROJECT_ENTRY_POINT = "mlflow.project.entryPoint"
MLFLOW_DOCKER_IMAGE_URI = "mlflow.docker.image.uri"
MLFLOW_DOCKER_IMAGE_ID = "mlflow.docker.image.id"
# Indicates that an MLflow run was created by an autologging integration
MLFLOW_AUTOLOGGING = "mlflow.autologging"
# Indicates the artifacts type and path that are logged
MLFLOW_LOGGED_ARTIFACTS = "mlflow.loggedArtifacts"
MLFLOW_LOGGED_IMAGES = "mlflow.loggedImages"
MLFLOW_RUN_SOURCE_TYPE = "mlflow.runSourceType"

# Indicates that an MLflow run was created by an evaluation
MLFLOW_RUN_IS_EVALUATION = "mlflow.run.isEval"

MLFLOW_DATABRICKS_NOTEBOOK_ID = "mlflow.databricks.notebookID"
MLFLOW_DATABRICKS_NOTEBOOK_PATH = "mlflow.databricks.notebookPath"
MLFLOW_DATABRICKS_WEBAPP_URL = "mlflow.databricks.webappURL"
MLFLOW_DATABRICKS_RUN_URL = "mlflow.databricks.runURL"
MLFLOW_DATABRICKS_CLUSTER_ID = "mlflow.databricks.cluster.id"
MLFLOW_DATABRICKS_WORKSPACE_URL = "mlflow.databricks.workspaceURL"
MLFLOW_DATABRICKS_WORKSPACE_ID = "mlflow.databricks.workspaceID"
# The unique ID of a command execution in a Databricks notebook
MLFLOW_DATABRICKS_NOTEBOOK_COMMAND_ID = "mlflow.databricks.notebook.commandID"
# The SHELL_JOB_ID and SHELL_JOB_RUN_ID tags are used for tracking the
# Databricks Job ID and Databricks Job Run ID associated with an MLflow Project run
MLFLOW_DATABRICKS_SHELL_JOB_ID = "mlflow.databricks.shellJobID"
MLFLOW_DATABRICKS_SHELL_JOB_RUN_ID = "mlflow.databricks.shellJobRunID"
# The JOB_ID, JOB_RUN_ID, and JOB_TYPE tags are used for automatically recording Job information
# when MLflow Tracking APIs are used within a Databricks Job
MLFLOW_DATABRICKS_JOB_ID = "mlflow.databricks.jobID"
MLFLOW_DATABRICKS_JOB_RUN_ID = "mlflow.databricks.jobRunID"
# Here MLFLOW_DATABRICKS_JOB_TYPE means the job task type and MLFLOW_DATABRICKS_JOB_TYPE_INFO
# implies the job type which could be normal, ephemeral, etc.
MLFLOW_DATABRICKS_JOB_TYPE = "mlflow.databricks.jobType"
MLFLOW_DATABRICKS_JOB_TYPE_INFO = "mlflow.databricks.jobTypeInfo"
# For MLflow Repo Lineage tracking
MLFLOW_DATABRICKS_GIT_REPO_URL = "mlflow.databricks.gitRepoUrl"
MLFLOW_DATABRICKS_GIT_REPO_COMMIT = "mlflow.databricks.gitRepoCommit"
MLFLOW_DATABRICKS_GIT_REPO_PROVIDER = "mlflow.databricks.gitRepoProvider"
MLFLOW_DATABRICKS_GIT_REPO_RELATIVE_PATH = "mlflow.databricks.gitRepoRelativePath"
MLFLOW_DATABRICKS_GIT_REPO_REFERENCE = "mlflow.databricks.gitRepoReference"
MLFLOW_DATABRICKS_GIT_REPO_REFERENCE_TYPE = "mlflow.databricks.gitRepoReferenceType"
MLFLOW_DATABRICKS_GIT_REPO_STATUS = "mlflow.databricks.gitRepoStatus"

# Databricks model serving endpoint information
MLFLOW_DATABRICKS_MODEL_SERVING_ENDPOINT_NAME = "mlflow.databricks.modelServingEndpointName"

# For Serverless GPU Compute (SGC) run resumption
# Experiment tag prefix that maps SGC job run IDs to MLflow run IDs for automatic resumption
# Format: mlflow.databricks.sgc.resumeRun.jobRunId.{job_run_id} -> {mlflow_run_id}
MLFLOW_DATABRICKS_SGC_RESUME_RUN_JOB_RUN_ID_PREFIX = "mlflow.databricks.sgc.resumeRun.jobRunId"

# For MLflow Dataset tracking
MLFLOW_DATASET_CONTEXT = "mlflow.data.context"

MLFLOW_PROJECT_BACKEND = "mlflow.project.backend"

MLFLOW_EXPERIMENT_PRIMARY_METRIC_NAME = "mlflow.experiment.primaryMetric.name"
MLFLOW_EXPERIMENT_PRIMARY_METRIC_GREATER_IS_BETTER = (
    "mlflow.experiment.primaryMetric.greaterIsBetter"
)

# For automatic model checkpointing
LATEST_CHECKPOINT_ARTIFACT_TAG_KEY = "mlflow.latest_checkpoint_artifact"


# A set of tags that cannot be updated by the user
IMMUTABLE_TAGS = {MLFLOW_USER, MLFLOW_ARTIFACT_LOCATION}

# The list of tags generated from resolve_tags() that are required for tracing UI
TRACE_RESOLVE_TAGS_ALLOWLIST = (
    MLFLOW_DATABRICKS_NOTEBOOK_COMMAND_ID,
    MLFLOW_DATABRICKS_NOTEBOOK_ID,
    MLFLOW_DATABRICKS_NOTEBOOK_PATH,
    MLFLOW_DATABRICKS_WEBAPP_URL,
    MLFLOW_DATABRICKS_WORKSPACE_ID,
    MLFLOW_DATABRICKS_WORKSPACE_URL,
    MLFLOW_SOURCE_NAME,
    MLFLOW_SOURCE_TYPE,
    MLFLOW_USER,
    MLFLOW_GIT_COMMIT,
    MLFLOW_GIT_BRANCH,
    MLFLOW_GIT_REPO_URL,
    MLFLOW_GIT_DIRTY,
)


def _get_run_name_from_tags(tags):
    for tag in tags:
        if tag.key == MLFLOW_RUN_NAME:
            return tag.value
```

--------------------------------------------------------------------------------

---[FILE: model_utils.py]---
Location: mlflow-master/mlflow/utils/model_utils.py

```python
import contextlib
import json
import logging
import os
import shutil
import sys
from pathlib import Path
from typing import Any

import yaml

from mlflow.exceptions import MlflowException
from mlflow.models import Model
from mlflow.models.model import MLMODEL_FILE_NAME
from mlflow.protos.databricks_pb2 import (
    INVALID_PARAMETER_VALUE,
    RESOURCE_ALREADY_EXISTS,
    RESOURCE_DOES_NOT_EXIST,
)
from mlflow.store.artifact.artifact_repository_registry import get_artifact_repository
from mlflow.store.artifact.models_artifact_repo import ModelsArtifactRepository
from mlflow.store.artifact.runs_artifact_repo import RunsArtifactRepository
from mlflow.tracking.artifact_utils import _download_artifact_from_uri
from mlflow.utils import get_parent_module
from mlflow.utils.databricks_utils import is_in_databricks_runtime
from mlflow.utils.file_utils import _copy_file_or_tree
from mlflow.utils.requirements_utils import _capture_imported_modules
from mlflow.utils.uri import append_to_uri_path

FLAVOR_CONFIG_CODE = "code"

_logger = logging.getLogger(__name__)


def _get_all_flavor_configurations(model_path):
    """Obtains all the flavor configurations from the specified MLflow model path.

    Args:
        model_path: The path to the root directory of the MLflow model for which to load
            the specified flavor configuration.

    Returns:
        The dictionary contains all flavor configurations with flavor name as key.

    """

    return Model.load(model_path).flavors


def _get_flavor_configuration(model_path, flavor_name):
    """Obtains the configuration for the specified flavor from the specified
    MLflow model path. If the model does not contain the specified flavor,
    an exception will be thrown.

    Args:
        model_path: The path to the root directory of the MLflow model for which to load
            the specified flavor configuration.
        flavor_name: The name of the flavor configuration to load.

    Returns:
        The flavor configuration as a dictionary.

    """
    try:
        return Model.load(model_path).flavors[flavor_name]
    except KeyError as ex:
        raise MlflowException(
            f'Model does not have the "{flavor_name}" flavor', RESOURCE_DOES_NOT_EXIST
        ) from ex


def _get_flavor_configuration_from_uri(model_uri, flavor_name, logger):
    """Obtains the configuration for the specified flavor from the specified
    MLflow model uri. If the model does not contain the specified flavor,
    an exception will be thrown.

    Args:
        model_uri: The path to the root directory of the MLflow model for which to load
            the specified flavor configuration.
        flavor_name: The name of the flavor configuration to load.
        logger: The local flavor's logger to report the resolved path of the model uri.

    Returns:
        The flavor configuration as a dictionary.
    """
    try:
        resolved_uri = model_uri
        if RunsArtifactRepository.is_runs_uri(model_uri):
            resolved_uri = RunsArtifactRepository.get_underlying_uri(model_uri)
            logger.info("'%s' resolved as '%s'", model_uri, resolved_uri)
        elif ModelsArtifactRepository.is_models_uri(model_uri):
            resolved_uri = ModelsArtifactRepository.get_underlying_uri(model_uri)
            logger.info("'%s' resolved as '%s'", model_uri, resolved_uri)

        try:
            ml_model_file = _download_artifact_from_uri(
                artifact_uri=append_to_uri_path(resolved_uri, MLMODEL_FILE_NAME)
            )
        except Exception:
            logger.debug(
                f'Failed to download an "{MLMODEL_FILE_NAME}" model file from '
                f"resolved URI {resolved_uri}. "
                f"Falling back to downloading from original model URI {model_uri}",
                exc_info=True,
            )
            ml_model_file = get_artifact_repository(artifact_uri=model_uri).download_artifacts(
                artifact_path=MLMODEL_FILE_NAME
            )
    except Exception as ex:
        raise MlflowException(
            f'Failed to download an "{MLMODEL_FILE_NAME}" model file from "{model_uri}"',
            RESOURCE_DOES_NOT_EXIST,
        ) from ex
    return _get_flavor_configuration_from_ml_model_file(ml_model_file, flavor_name)


def _get_flavor_configuration_from_ml_model_file(ml_model_file, flavor_name):
    model_conf = Model.load(ml_model_file)
    if flavor_name not in model_conf.flavors:
        raise MlflowException(
            f'Model does not have the "{flavor_name}" flavor',
            RESOURCE_DOES_NOT_EXIST,
        )
    return model_conf.flavors[flavor_name]


def _validate_code_paths(code_paths):
    if code_paths is not None:
        if not isinstance(code_paths, list):
            raise TypeError(f"Argument code_paths should be a list, not {type(code_paths)}")


def _validate_and_copy_code_paths(code_paths, path, default_subpath="code"):
    """Validates that a code path is a valid list and copies the code paths to a directory. This
    can later be used to log custom code as an artifact.

    Args:
        code_paths: A list of files or directories containing code that should be logged
            as artifacts.
        path: The local model path.
        default_subpath: The default directory name used to store code artifacts.
    """
    _validate_code_paths(code_paths)
    if code_paths is not None:
        code_dir_subpath = default_subpath
        for code_path in code_paths:
            try:
                _copy_file_or_tree(src=code_path, dst=path, dst_dir=code_dir_subpath)
            except OSError as e:
                # A common error is code-paths includes Databricks Notebook. We include it in error
                # message when running in Databricks, but not in other envs tp avoid confusion.
                example = ", such as Databricks Notebooks" if is_in_databricks_runtime() else ""
                raise MlflowException(
                    message=(
                        f"Failed to copy the specified code path '{code_path}' into the model "
                        "artifacts. It appears that your code path includes file(s) that cannot "
                        f"be copied{example}. Please specify a code path that does not include "
                        "such files and try again.",
                    ),
                    error_code=INVALID_PARAMETER_VALUE,
                ) from e
    else:
        code_dir_subpath = None
    return code_dir_subpath


def _infer_and_copy_code_paths(flavor, path, default_subpath="code"):
    # Capture all imported modules with full module name during loading model.
    modules = _capture_imported_modules(path, flavor, record_full_module=True)

    all_modules = set(modules)

    for module in modules:
        parent_module = module
        while "." in parent_module:
            parent_module = get_parent_module(parent_module)
            all_modules.add(parent_module)

    # Generate code_paths set from the imported modules full name list.
    # It only picks necessary files, because:
    #  1. Reduce risk of logging files containing user credentials to MLflow
    #     artifact repository.
    #  2. In databricks runtime, notebook files might exist under a code_paths directory,
    #     if logging the whole directory to MLflow artifact repository, these
    #     notebook files are not accessible and trigger exceptions. On the other
    #     hand, these notebook files are not used as code_paths modules because
    #     code in notebook files are loaded into python `__main__` module.
    code_paths = set()
    for full_module_name in all_modules:
        relative_path_str = full_module_name.replace(".", os.sep)
        relative_path = Path(relative_path_str)
        if relative_path.is_dir():
            init_file_path = relative_path / "__init__.py"
            if init_file_path.exists():
                code_paths.add(init_file_path)

        py_module_path = Path(relative_path_str + ".py")
        if py_module_path.is_file():
            code_paths.add(py_module_path)

    if code_paths:
        for code_path in code_paths:
            src_dir_path = code_path.parent
            src_file_name = code_path.name
            dest_dir_path = Path(path) / default_subpath / src_dir_path
            dest_file_path = dest_dir_path / src_file_name
            dest_dir_path.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(code_path, dest_file_path)
        return default_subpath

    return None


def _validate_infer_and_copy_code_paths(
    code_paths, path, infer_code_paths, flavor, default_subpath="code"
):
    if infer_code_paths:
        if code_paths:
            raise MlflowException(
                "If 'infer_code_path' is set to True, 'code_paths' param cannot be set."
            )
        return _infer_and_copy_code_paths(flavor, path, default_subpath)
    else:
        return _validate_and_copy_code_paths(code_paths, path, default_subpath)


def _validate_path_exists(path, name):
    if path and not os.path.exists(path):
        raise MlflowException(
            message=(
                f"Failed to copy the specified {name} path '{path}' into the model "
                f"artifacts. The specified {name}path does not exist. Please specify a valid "
                f"{name} path and try again."
            ),
            error_code=INVALID_PARAMETER_VALUE,
        )


def _validate_and_copy_file_to_directory(file_path: str, dir_path: str, name: str):
    """Copies the file at file_path to the directory at dir_path.

    Args:
        file_path: A file that should be logged as an artifact.
        dir_path: The path of the directory to save the file to.
        name: The name for the kind of file being copied.
    """
    _validate_path_exists(file_path, name)
    try:
        _copy_file_or_tree(src=file_path, dst=dir_path)
    except OSError as e:
        # A common error is code-paths includes Databricks Notebook. We include it in error
        # message when running in Databricks, but not in other envs tp avoid confusion.
        example = ", such as Databricks Notebooks" if is_in_databricks_runtime() else ""
        raise MlflowException(
            message=(
                f"Failed to copy the specified code path '{file_path}' into the model "
                "artifacts. It appears that your code path includes file(s) that cannot "
                f"be copied{example}. Please specify a code path that does not include "
                "such files and try again.",
            ),
            error_code=INVALID_PARAMETER_VALUE,
        ) from e


def _add_code_to_system_path(code_path):
    sys.path = [code_path] + sys.path


def _validate_and_prepare_target_save_path(path):
    if os.path.exists(path) and any(os.scandir(path)):
        raise MlflowException(
            message=f"Path '{path}' already exists and is not empty",
            error_code=RESOURCE_ALREADY_EXISTS,
        )

    os.makedirs(path, exist_ok=True)


def _add_code_from_conf_to_system_path(local_path, conf, code_key=FLAVOR_CONFIG_CODE):
    """Checks if any code_paths were logged with the model in the flavor conf and prepends
    the directory to the system path.

    Args:
        local_path: The local path containing model artifacts.
        conf: The flavor-specific conf that should contain the FLAVOR_CONFIG_CODE
            key, which specifies the directory containing custom code logged as artifacts.
        code_key: The key used by the flavor to indicate custom code artifacts.
            By default this is FLAVOR_CONFIG_CODE.
    """
    assert isinstance(conf, dict), "`conf` argument must be a dict."

    if code_key in conf and conf[code_key]:
        code_path = os.path.join(local_path, conf[code_key])
        _add_code_to_system_path(code_path)


def _validate_onnx_session_options(onnx_session_options):
    """Validates that the specified onnx_session_options dict is valid.

    Args:
        onnx_session_options: The onnx_session_options dict to validate.
    """
    import onnxruntime as ort

    if onnx_session_options is not None:
        if not isinstance(onnx_session_options, dict):
            raise TypeError(
                f"Argument onnx_session_options should be a dict, not {type(onnx_session_options)}"
            )
        for key, value in onnx_session_options.items():
            if key != "extra_session_config" and not hasattr(ort.SessionOptions, key):
                raise ValueError(
                    f"Key {key} in onnx_session_options is not a valid "
                    "ONNX Runtime session options key"
                )
            elif key == "extra_session_config" and not isinstance(value, dict):
                raise TypeError(
                    f"Value for key {key} in onnx_session_options should be a dict, "
                    "not {type(value)}"
                )
            elif key == "execution_mode" and value.upper() not in [
                "PARALLEL",
                "SEQUENTIAL",
            ]:
                raise ValueError(
                    f"Value for key {key} in onnx_session_options should be "
                    f"'parallel' or 'sequential', not {value}"
                )
            elif key == "graph_optimization_level" and value not in [0, 1, 2, 99]:
                raise ValueError(
                    f"Value for key {key} in onnx_session_options should be 0, 1, 2, or 99, "
                    f"not {value}"
                )
            elif key in ["intra_op_num_threads", "intra_op_num_threads"] and value < 0:
                raise ValueError(
                    f"Value for key {key} in onnx_session_options should be >= 0, not {value}"
                )


def _get_overridden_pyfunc_model_config(
    pyfunc_config: dict[str, Any], load_config: dict[str, Any], logger
) -> dict[str, Any]:
    """
    Updates the inference configuration according to the model's configuration and the overrides.
    Only arguments already present in the inference configuration can be updated. The environment
    variable ``MLFLOW_PYFUNC_INFERENCE_CONFIG`` can also be used to provide additional inference
    configuration.
    """

    overrides = {}
    if env_overrides := os.getenv("MLFLOW_PYFUNC_INFERENCE_CONFIG"):
        logger.debug(
            "Inference configuration is being loaded from ``MLFLOW_PYFUNC_INFERENCE_CONFIG``"
            " environ."
        )
        overrides.update(dict(json.loads(env_overrides)))

    if load_config:
        overrides.update(load_config)

    if not overrides:
        return pyfunc_config

    if not pyfunc_config:
        logger.warning(
            f"Argument(s) {', '.join(overrides.keys())} were ignored since the model's ``pyfunc``"
            " flavor doesn't accept model configuration. Use ``model_config`` when logging"
            " the model to allow it."
        )

        return None

    valid_keys = set(pyfunc_config.keys()) & set(overrides.keys())
    ignored_keys = set(overrides.keys()) - valid_keys
    allowed_config = {key: overrides[key] for key in valid_keys}
    if ignored_keys:
        logger.warning(
            f"Argument(s) {', '.join(ignored_keys)} were ignored since they are not valid keys in"
            " the corresponding section of the ``pyfunc`` flavor. Use ``model_config`` when"
            " logging the model to include the keys you plan to indicate. Current allowed"
            f" configuration includes {', '.join(pyfunc_config.keys())}"
        )
    pyfunc_config.update(allowed_config)
    return pyfunc_config


def _validate_and_get_model_config_from_file(model_config):
    model_config = os.path.abspath(model_config)
    if os.path.exists(model_config):
        with open(model_config) as file:
            try:
                return yaml.safe_load(file)
            except yaml.YAMLError as e:
                raise MlflowException(
                    f"The provided `model_config` file '{model_config}' is not a valid YAML "
                    f"file: {e}",
                    error_code=INVALID_PARAMETER_VALUE,
                )
    else:
        raise MlflowException(
            "An invalid `model_config` file was passed. The provided `model_config` "
            f"file '{model_config}'is not a valid file path.",
            error_code=INVALID_PARAMETER_VALUE,
        )


def _validate_pyfunc_model_config(model_config):
    """
    Validates the values passes in the model_config section. There are no typing
    restrictions but we require them being JSON-serializable.
    """

    if not model_config:
        return

    if isinstance(model_config, Path):
        _validate_and_get_model_config_from_file(os.fspath(model_config))
    elif isinstance(model_config, str):
        _validate_and_get_model_config_from_file(model_config)
    elif isinstance(model_config, dict) and all(isinstance(key, str) for key in model_config):
        try:
            json.dumps(model_config)
        except (TypeError, OverflowError):
            raise MlflowException(
                "Values in the provided ``model_config`` are of an unsupported type. Only "
                "JSON-serializable data types can be provided as values.",
                error_code=INVALID_PARAMETER_VALUE,
            )
    else:
        raise MlflowException(
            "An invalid ``model_config`` structure was passed. ``model_config`` must be a "
            "valid file path or of type ``dict`` with string keys.",
            error_code=INVALID_PARAMETER_VALUE,
        )


RECORD_ENV_VAR_ALLOWLIST = {
    # api key related
    "API_KEY",
    "API_TOKEN",
    # databricks auth related
    "DATABRICKS_HOST",
    "DATABRICKS_USERNAME",
    "DATABRICKS_PASSWORD",
    "DATABRICKS_TOKEN",
    "DATABRICKS_INSECURE",
    "DATABRICKS_CLIENT_ID",
    "DATABRICKS_CLIENT_SECRET",
    "_DATABRICKS_WORKSPACE_HOST",
    "_DATABRICKS_WORKSPACE_ID",
}


@contextlib.contextmanager
def env_var_tracker():
    """
    Context manager for temporarily tracking environment variables accessed.
    It tracks environment variables accessed during the context manager's lifetime.
    """
    from mlflow.environment_variables import MLFLOW_RECORD_ENV_VARS_IN_MODEL_LOGGING

    tracked_env_names = set()

    if MLFLOW_RECORD_ENV_VARS_IN_MODEL_LOGGING.get():
        original_getitem = os._Environ.__getitem__
        original_get = os._Environ.get

        def updated_get_item(self, key):
            result = original_getitem(self, key)
            tracked_env_names.add(key)
            return result

        def updated_get(self, key, *args, **kwargs):
            if key in self:
                tracked_env_names.add(key)
            return original_get(self, key, *args, **kwargs)

        try:
            os._Environ.__getitem__ = updated_get_item
            os._Environ.get = updated_get
            yield tracked_env_names
        finally:
            os._Environ.__getitem__ = original_getitem
            os._Environ.get = original_get
    else:
        yield tracked_env_names
```

--------------------------------------------------------------------------------

````
