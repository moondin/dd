---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 227
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 227 of 991)

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

---[FILE: exceptions.py]---
Location: mlflow-master/mlflow/exceptions.py

```python
import json
import logging

from mlflow.protos.databricks_pb2 import (
    ABORTED,
    ALREADY_EXISTS,
    BAD_REQUEST,
    CANCELLED,
    CUSTOMER_UNAUTHORIZED,
    DATA_LOSS,
    DEADLINE_EXCEEDED,
    ENDPOINT_NOT_FOUND,
    INTERNAL_ERROR,
    INVALID_PARAMETER_VALUE,
    INVALID_STATE,
    NOT_FOUND,
    NOT_IMPLEMENTED,
    PERMISSION_DENIED,
    REQUEST_LIMIT_EXCEEDED,
    RESOURCE_ALREADY_EXISTS,
    RESOURCE_CONFLICT,
    RESOURCE_DOES_NOT_EXIST,
    RESOURCE_EXHAUSTED,
    TEMPORARILY_UNAVAILABLE,
    UNAUTHENTICATED,
    ErrorCode,
)

ERROR_CODE_TO_HTTP_STATUS = {
    ErrorCode.Name(INTERNAL_ERROR): 500,
    ErrorCode.Name(INVALID_STATE): 500,
    ErrorCode.Name(DATA_LOSS): 500,
    ErrorCode.Name(NOT_IMPLEMENTED): 501,
    ErrorCode.Name(TEMPORARILY_UNAVAILABLE): 503,
    ErrorCode.Name(DEADLINE_EXCEEDED): 504,
    ErrorCode.Name(REQUEST_LIMIT_EXCEEDED): 429,
    ErrorCode.Name(CANCELLED): 499,
    ErrorCode.Name(RESOURCE_EXHAUSTED): 429,
    ErrorCode.Name(ABORTED): 409,
    ErrorCode.Name(RESOURCE_CONFLICT): 409,
    ErrorCode.Name(ALREADY_EXISTS): 409,
    ErrorCode.Name(NOT_FOUND): 404,
    ErrorCode.Name(ENDPOINT_NOT_FOUND): 404,
    ErrorCode.Name(RESOURCE_DOES_NOT_EXIST): 404,
    ErrorCode.Name(PERMISSION_DENIED): 403,
    ErrorCode.Name(CUSTOMER_UNAUTHORIZED): 401,
    ErrorCode.Name(UNAUTHENTICATED): 401,
    ErrorCode.Name(BAD_REQUEST): 400,
    ErrorCode.Name(RESOURCE_ALREADY_EXISTS): 400,
    ErrorCode.Name(INVALID_PARAMETER_VALUE): 400,
}

HTTP_STATUS_TO_ERROR_CODE = {v: k for k, v in ERROR_CODE_TO_HTTP_STATUS.items()}
HTTP_STATUS_TO_ERROR_CODE[400] = ErrorCode.Name(BAD_REQUEST)
HTTP_STATUS_TO_ERROR_CODE[404] = ErrorCode.Name(ENDPOINT_NOT_FOUND)
HTTP_STATUS_TO_ERROR_CODE[500] = ErrorCode.Name(INTERNAL_ERROR)

_logger = logging.getLogger(__name__)


def get_error_code(http_status):
    return ErrorCode.Value(
        HTTP_STATUS_TO_ERROR_CODE.get(http_status, ErrorCode.Name(INTERNAL_ERROR))
    )


class MlflowException(Exception):
    """
    Generic exception thrown to surface failure information about external-facing operations.
    The error message associated with this exception may be exposed to clients in HTTP responses
    for debugging purposes. If the error text is sensitive, raise a generic `Exception` object
    instead.
    """

    def __init__(self, message, error_code=INTERNAL_ERROR, **kwargs):
        """
        Args:
            message: The message or exception describing the error that occurred. This will be
                included in the exception's serialized JSON representation.
            error_code: An appropriate error code for the error that occurred; it will be
                included in the exception's serialized JSON representation. This should
                be one of the codes listed in the `mlflow.protos.databricks_pb2` proto.
            kwargs: Additional key-value pairs to include in the serialized JSON representation
                of the MlflowException.
        """
        try:
            self.error_code = ErrorCode.Name(error_code)
        except (ValueError, TypeError):
            self.error_code = ErrorCode.Name(INTERNAL_ERROR)
        message = str(message)
        self.message = message
        self.json_kwargs = kwargs
        super().__init__(message)

    def serialize_as_json(self):
        exception_dict = {"error_code": self.error_code, "message": self.message}
        exception_dict.update(self.json_kwargs)
        return json.dumps(exception_dict)

    def get_http_status_code(self):
        return ERROR_CODE_TO_HTTP_STATUS.get(self.error_code, 500)

    @classmethod
    def invalid_parameter_value(cls, message, **kwargs):
        """Constructs an `MlflowException` object with the `INVALID_PARAMETER_VALUE` error code.

        Args:
            message: The message describing the error that occurred. This will be included in the
                exception's serialized JSON representation.
            kwargs: Additional key-value pairs to include in the serialized JSON representation
                of the MlflowException.
        """
        return cls(message, error_code=INVALID_PARAMETER_VALUE, **kwargs)


class RestException(MlflowException):
    """Exception thrown on non 200-level responses from the REST API"""

    def __init__(self, json):
        self.json = json

        error_code = json.get("error_code", ErrorCode.Name(INTERNAL_ERROR))
        message = "{}: {}".format(
            error_code,
            json["message"] if "message" in json else "Response: " + str(json),
        )

        try:
            super().__init__(message, error_code=ErrorCode.Value(error_code))
        except ValueError:
            try:
                # The `error_code` can be an http error code, in which case we convert it to the
                # corresponding `ErrorCode`.
                error_code = HTTP_STATUS_TO_ERROR_CODE[int(error_code)]
                super().__init__(message, error_code=ErrorCode.Value(error_code))
            except ValueError or KeyError:
                _logger.warning(
                    f"Received error code not recognized by MLflow: {error_code}, this may "
                    "indicate your request encountered an error before reaching MLflow server, "
                    "e.g., within a proxy server or authentication / authorization service."
                )
                super().__init__(message)

    def __reduce__(self):
        """
        Overriding `__reduce__` to make `RestException` instance pickle-able.
        """
        return RestException, (self.json,)


class ExecutionException(MlflowException):
    """Exception thrown when executing a project fails"""


class MissingConfigException(MlflowException):
    """Exception thrown when expected configuration file/directory not found"""


class InvalidUrlException(MlflowException):
    """Exception thrown when a http request fails to send due to an invalid URL"""


class _UnsupportedMultipartUploadException(MlflowException):
    """Exception thrown when multipart upload is unsupported by an artifact repository"""

    MESSAGE = "Multipart upload is not supported for the current artifact repository"

    def __init__(self):
        super().__init__(self.MESSAGE, error_code=NOT_IMPLEMENTED)


class MlflowTracingException(MlflowException):
    """
    Exception thrown from tracing logic

    Tracing logic should not block the main execution flow in general, hence this exception
    is used to distinguish tracing related errors and handle them properly.
    """

    def __init__(self, message, error_code=INTERNAL_ERROR):
        super().__init__(message, error_code=error_code)


class MlflowTraceDataException(MlflowTracingException):
    """Exception thrown for trace data related error"""

    def __init__(
        self, error_code: str, request_id: str | None = None, artifact_path: str | None = None
    ):
        if request_id:
            self.ctx = f"request_id={request_id}"
        elif artifact_path:
            self.ctx = f"path={artifact_path}"

        if error_code == NOT_FOUND:
            super().__init__(f"Trace data not found for {self.ctx}", error_code=error_code)
        elif error_code == INVALID_STATE:
            super().__init__(f"Trace data is corrupted for {self.ctx}", error_code=error_code)


class MlflowTraceDataNotFound(MlflowTraceDataException):
    """Exception thrown when trace data is not found"""

    def __init__(self, request_id: str | None = None, artifact_path: str | None = None):
        super().__init__(NOT_FOUND, request_id, artifact_path)


class MlflowTraceDataCorrupted(MlflowTraceDataException):
    """Exception thrown when trace data is corrupted"""

    def __init__(self, request_id: str | None = None, artifact_path: str | None = None):
        super().__init__(INVALID_STATE, request_id, artifact_path)


class MlflowNotImplementedException(MlflowException):
    """Exception thrown when a feature is not implemented"""

    def __init__(self, message=""):
        super().__init__(message, error_code=NOT_IMPLEMENTED)
```

--------------------------------------------------------------------------------

---[FILE: experiments.py]---
Location: mlflow-master/mlflow/experiments.py

```python
import json
import os

import click

import mlflow
from mlflow.entities import ViewType
from mlflow.tracking import _get_store, fluent
from mlflow.utils.data_utils import is_uri
from mlflow.utils.string_utils import _create_table

EXPERIMENT_ID = click.option("--experiment-id", "-x", type=click.STRING, required=True)


def _validate_max_results(ctx, param, value):
    """Validate that max_results is non-negative."""
    if value is not None and value < 0:
        raise click.BadParameter("max-results must be a non-negative integer")
    return value


@click.group("experiments")
def commands():
    """
    Manage experiments. To manage experiments associated with a tracking server, set the
    MLFLOW_TRACKING_URI environment variable to the URL of the desired server.
    """


@commands.command()
@click.option("--experiment-name", "-n", type=click.STRING, required=True)
@click.option(
    "--artifact-location",
    "-l",
    help="Base location for runs to store artifact results. Artifacts will be stored "
    "at $artifact_location/$run_id/artifacts. See "
    "https://mlflow.org/docs/latest/tracking.html#where-runs-are-recorded for "
    "more info on the properties of artifact location. "
    "If no location is provided, the tracking server will pick a default.",
)
def create(experiment_name, artifact_location):
    """
    Create an experiment.

    All artifacts generated by runs related to this experiment will be stored under artifact
    location, organized under specific run_id sub-directories.

    Implementation of experiment and metadata store is dependent on backend storage. ``FileStore``
    creates a folder for each experiment ID and stores metadata in ``meta.yaml``. Runs are stored
    as subfolders.
    """
    store = _get_store()
    exp_id = store.create_experiment(experiment_name, artifact_location)
    click.echo(f"Created experiment '{experiment_name}' with id {exp_id}")


@commands.command("search")
@click.option(
    "--view",
    "-v",
    default="active_only",
    help="Select view type for experiments. Valid view types are "
    "'active_only' (default), 'deleted_only', and 'all'.",
)
@click.option(
    "--max-results",
    type=click.INT,
    default=None,
    callback=_validate_max_results,
    help="Maximum number of experiments to return. If not provided, returns all experiments.",
)
def search_experiments(view, max_results):
    """
    Search for experiments in the configured tracking server.
    """
    view_type = ViewType.from_string(view) if view else ViewType.ACTIVE_ONLY
    experiments = mlflow.search_experiments(view_type=view_type, max_results=max_results)
    table = [
        [
            exp.experiment_id,
            exp.name,
            exp.artifact_location
            if is_uri(exp.artifact_location)
            else os.path.abspath(exp.artifact_location),
        ]
        for exp in experiments
    ]
    click.echo(_create_table(sorted(table), headers=["Experiment Id", "Name", "Artifact Location"]))


@commands.command("get")
@EXPERIMENT_ID
@click.option(
    "--output",
    type=click.Choice(["json", "table"]),
    default="table",
    help="Output format: 'table' (default) or 'json'.",
)
def get_experiment(experiment_id, output):
    """
    Get details of an experiment by ID.

    Displays experiment information including name, artifact location, lifecycle stage,
    tags, creation time, and last update time.

    \b
    Examples:

    .. code-block:: bash

        # Get experiment in table format (default)
        mlflow experiments get --experiment-id 1

        # Get experiment in JSON format
        mlflow experiments get --experiment-id 1 --output json

        # Using short option
        mlflow experiments get -x 0
    """
    store = _get_store()
    experiment = store.get_experiment(experiment_id)

    if output == "json":
        experiment_dict = dict(experiment)
        click.echo(json.dumps(experiment_dict, indent=2))
    elif output == "table":
        table_data = [
            ["Experiment ID", experiment.experiment_id],
            ["Name", experiment.name],
            ["Artifact Location", experiment.artifact_location],
            ["Lifecycle Stage", experiment.lifecycle_stage],
            ["Creation Time", experiment.creation_time or "N/A"],
            ["Last Update Time", experiment.last_update_time or "N/A"],
        ]

        if experiment.tags:
            tags_str = ", ".join([f"{k}={v}" for k, v in experiment.tags.items()])
            table_data.append(["Tags", tags_str])
        else:
            table_data.append(["Tags", ""])

        max_field_width = max(len(row[0]) for row in table_data)
        for field, value in table_data:
            click.echo(f"{field.ljust(max_field_width + 2)}: {value}")


@commands.command("delete")
@EXPERIMENT_ID
def delete_experiment(experiment_id):
    """
    Mark an active experiment for deletion. This also applies to experiment's metadata, runs and
    associated data, and artifacts if they are store in default location. Use ``list`` command to
    view artifact location. Command will throw an error if experiment is not found or already
    marked for deletion.

    Experiments marked for deletion can be restored using ``restore`` command, unless they are
    permanently deleted.

    Specific implementation of deletion is dependent on backend stores. ``FileStore`` moves
    experiments marked for deletion under a ``.trash`` folder under the main folder used to
    instantiate ``FileStore``. Experiments marked for deletion can be permanently deleted by
    clearing the ``.trash`` folder. It is recommended to use a ``cron`` job or an alternate
    workflow mechanism to clear ``.trash`` folder.
    """
    store = _get_store()
    store.delete_experiment(experiment_id)
    click.echo(f"Experiment with ID {experiment_id} has been deleted.")


@commands.command("restore")
@EXPERIMENT_ID
def restore_experiment(experiment_id):
    """
    Restore a deleted experiment. This also applies to experiment's metadata, runs and associated
    data. The command throws an error if the experiment is already active, cannot be found, or
    permanently deleted.
    """
    store = _get_store()
    store.restore_experiment(experiment_id)
    click.echo(f"Experiment with id {experiment_id} has been restored.")


@commands.command("rename")
@EXPERIMENT_ID
@click.option("--new-name", type=click.STRING, required=True)
def rename_experiment(experiment_id, new_name):
    """
    Renames an active experiment.
    Returns an error if the experiment is inactive.
    """
    store = _get_store()
    store.rename_experiment(experiment_id, new_name)
    click.echo(f"Experiment with id {experiment_id} has been renamed to '{new_name}'.")


@commands.command("csv")
@EXPERIMENT_ID
@click.option("--filename", "-o", type=click.STRING)
def generate_csv_with_runs(experiment_id, filename):
    # type: (str, str) -> None
    """
    Generate CSV with all runs for an experiment
    """
    runs = fluent.search_runs(experiment_ids=experiment_id)
    if filename:
        runs.to_csv(filename, index=False)
        click.echo(
            f"Experiment with ID {experiment_id} has been exported as a CSV to file: {filename}."
        )
    else:
        click.echo(runs.to_csv(index=False))
```

--------------------------------------------------------------------------------

---[FILE: mismatch.py]---
Location: mlflow-master/mlflow/mismatch.py

```python
from __future__ import annotations

import importlib.metadata
import warnings


def _get_version(package_name: str) -> str | None:
    try:
        return importlib.metadata.version(package_name)
    except importlib.metadata.PackageNotFoundError:
        return None


def _check_version_mismatch() -> None:
    """
    Warns if both mlflow and child packages are installed but their versions are different.

    Reference: https://github.com/pypa/pip/issues/4625
    """
    mlflow_ver = _get_version("mlflow")
    # Skip if mlflow is installed from source.
    if mlflow_ver is None or "dev" in mlflow_ver:
        return

    child_packages = ["mlflow-skinny", "mlflow-tracing"]
    child_versions = [(p, _get_version(p)) for p in child_packages]

    mismatched = [
        (p, v) for p, v in child_versions if v is not None and "dev" not in v and v != mlflow_ver
    ]

    if mismatched:
        mismatched_str = ", ".join(f"{name} ({ver})" for name, ver in mismatched)
        warnings.warn(
            (
                f"Versions of mlflow ({mlflow_ver}) and child packages {mismatched_str} "
                "are different. This may lead to unexpected behavior. "
                "Please install the same version of all MLflow packages."
            ),
            stacklevel=2,
            category=UserWarning,
        )
```

--------------------------------------------------------------------------------

````
