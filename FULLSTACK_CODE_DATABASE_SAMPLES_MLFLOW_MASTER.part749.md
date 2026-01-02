---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 749
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 749 of 991)

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

---[FILE: client.py]---
Location: mlflow-master/mlflow/utils/autologging_utils/client.py

```python
"""
Defines an MlflowAutologgingQueueingClient developer API that provides batching, queueing, and
asynchronous execution capabilities for a subset of MLflow Tracking logging operations used most
frequently by autologging operations.

TODO(dbczumar): Migrate request batching, queueing, and async execution support from
MlflowAutologgingQueueingClient to MlflowClient in order to provide broader benefits to end users.
Remove this developer API.
"""

import logging
import os
from concurrent.futures import ThreadPoolExecutor
from itertools import zip_longest
from typing import TYPE_CHECKING, Any, NamedTuple, Optional

from mlflow.entities import Metric, Param, RunTag
from mlflow.entities.dataset_input import DatasetInput
from mlflow.exceptions import MlflowException
from mlflow.utils import _truncate_dict, chunk_list
from mlflow.utils.time import get_current_time_millis
from mlflow.utils.validation import (
    MAX_DATASETS_PER_BATCH,
    MAX_ENTITIES_PER_BATCH,
    MAX_ENTITY_KEY_LENGTH,
    MAX_METRICS_PER_BATCH,
    MAX_PARAM_VAL_LENGTH,
    MAX_PARAMS_TAGS_PER_BATCH,
    MAX_TAG_VAL_LENGTH,
)

if TYPE_CHECKING:
    from mlflow.data.dataset import Dataset

_logger = logging.getLogger(__name__)


class _PendingCreateRun(NamedTuple):
    experiment_id: str
    start_time: int | None
    tags: list[RunTag]
    run_name: str | None


class _PendingSetTerminated(NamedTuple):
    status: str | None
    end_time: int | None


class PendingRunId:
    """
    Serves as a placeholder for the ID of a run that does not yet exist, enabling additional
    metadata (e.g. metrics, params, ...) to be enqueued for the run prior to its creation.
    """


class RunOperations:
    """
    Represents a collection of operations on one or more MLflow Runs, such as run creation
    or metric logging.
    """

    def __init__(self, operation_futures):
        self._operation_futures = operation_futures

    def await_completion(self):
        """
        Blocks on completion of the MLflow Run operations.
        """
        failed_operations = []
        for future in self._operation_futures:
            try:
                future.result()
            except Exception as e:
                failed_operations.append(e)

        if len(failed_operations) > 0:
            raise MlflowException(
                message=(
                    "The following failures occurred while performing one or more logging"
                    f" operations: {failed_operations}"
                )
            )


# Define a threadpool for use across `MlflowAutologgingQueueingClient` instances to ensure that
# `MlflowAutologgingQueueingClient` instances can be pickled (ThreadPoolExecutor objects are not
# pickleable and therefore cannot be assigned as instance attributes).
#
# We limit the number of threads used for run operations, using at most 8 threads or 2 * the number
# of CPU cores available on the system (whichever is smaller)
num_cpus = os.cpu_count() or 4
num_logging_workers = min(num_cpus * 2, 8)
_AUTOLOGGING_QUEUEING_CLIENT_THREAD_POOL = ThreadPoolExecutor(
    max_workers=num_logging_workers,
    thread_name_prefix="MlflowAutologgingQueueingClient",
)


class MlflowAutologgingQueueingClient:
    """
    Efficiently implements a subset of MLflow Tracking's  `MlflowClient` and fluent APIs to provide
    automatic batching and async execution of run operations by way of queueing, as well as
    parameter / tag truncation for autologging use cases. Run operations defined by this client,
    such as `create_run` and `log_metrics`, enqueue data for future persistence to MLflow
    Tracking. Data is not persisted until the queue is flushed via the `flush()` method, which
    supports synchronous and asynchronous execution.

    MlflowAutologgingQueueingClient is not threadsafe; none of its APIs should be called
    concurrently.
    """

    def __init__(self, tracking_uri=None):
        from mlflow.tracking.client import MlflowClient

        self._client = MlflowClient(tracking_uri)
        self._pending_ops_by_run_id = {}

    def __enter__(self):
        """
        Enables `MlflowAutologgingQueueingClient` to be used as a context manager with
        synchronous flushing upon exit, removing the need to call `flush()` for use cases
        where logging completion can be waited upon synchronously.

        Run content is only flushed if the context exited without an exception.
        """
        return self

    def __exit__(self, exc_type, exc, traceback):
        """
        Enables `MlflowAutologgingQueueingClient` to be used as a context manager with
        synchronous flushing upon exit, removing the need to call `flush()` for use cases
        where logging completion can be waited upon synchronously.

        Run content is only flushed if the context exited without an exception.
        """
        # NB: Run content is only flushed upon context exit to ensure that we don't elide the
        # original exception thrown by the context (because `flush()` itself may throw). This
        # is consistent with the behavior of a routine that calls `flush()` explicitly: content
        # is not logged if an exception preempts the call to `flush()`
        if exc is None and exc_type is None and traceback is None:
            self.flush(synchronous=True)
        else:
            _logger.debug(
                "Skipping run content logging upon MlflowAutologgingQueueingClient context because"
                " an exception was raised within the context: %s",
                exc,
            )

    def create_run(
        self,
        experiment_id: str,
        start_time: int | None = None,
        tags: dict[str, Any] | None = None,
        run_name: str | None = None,
    ) -> PendingRunId:
        """
        Enqueues a CreateRun operation with the specified attributes, returning a `PendingRunId`
        instance that can be used as input to other client logging APIs (e.g. `log_metrics`,
        `log_params`, ...).

        Returns:
            A `PendingRunId` that can be passed as the `run_id` parameter to other client
            logging APIs, such as `log_params` and `log_metrics`.
        """
        tags = tags or {}
        tags = _truncate_dict(
            tags, max_key_length=MAX_ENTITY_KEY_LENGTH, max_value_length=MAX_TAG_VAL_LENGTH
        )
        run_id = PendingRunId()
        self._get_pending_operations(run_id).enqueue(
            create_run=_PendingCreateRun(
                experiment_id=experiment_id,
                start_time=start_time,
                tags=[RunTag(key, str(value)) for key, value in tags.items()],
                run_name=run_name,
            )
        )
        return run_id

    def set_terminated(
        self,
        run_id: str | PendingRunId,
        status: str | None = None,
        end_time: int | None = None,
    ) -> None:
        """
        Enqueues an UpdateRun operation with the specified `status` and `end_time` attributes
        for the specified `run_id`.
        """
        self._get_pending_operations(run_id).enqueue(
            set_terminated=_PendingSetTerminated(status=status, end_time=end_time)
        )

    def log_params(self, run_id: str | PendingRunId, params: dict[str, Any]) -> None:
        """
        Enqueues a collection of Parameters to be logged to the run specified by `run_id`.
        """
        params = _truncate_dict(
            params, max_key_length=MAX_ENTITY_KEY_LENGTH, max_value_length=MAX_PARAM_VAL_LENGTH
        )
        params_arr = [Param(key, str(value)) for key, value in params.items()]
        self._get_pending_operations(run_id).enqueue(params=params_arr)

    def log_inputs(self, run_id: str | PendingRunId, datasets: list[DatasetInput] | None) -> None:
        """
        Enqueues a collection of Dataset to be logged to the run specified by `run_id`.
        """
        if datasets is None or len(datasets) == 0:
            return
        self._get_pending_operations(run_id).enqueue(datasets=datasets)

    def log_metrics(
        self,
        run_id: str | PendingRunId,
        metrics: dict[str, float],
        step: int | None = None,
        dataset: Optional["Dataset"] = None,
        model_id: str | None = None,
    ) -> None:
        """
        Enqueues a collection of Metrics to be logged to the run specified by `run_id` at the
        step specified by `step`.
        """
        metrics = _truncate_dict(metrics, max_key_length=MAX_ENTITY_KEY_LENGTH)
        timestamp_ms = get_current_time_millis()
        metrics_arr = [
            Metric(
                key,
                value,
                timestamp_ms,
                step or 0,
                model_id=model_id,
                dataset_name=dataset and dataset.name,
                dataset_digest=dataset and dataset.digest,
            )
            for key, value in metrics.items()
        ]
        self._get_pending_operations(run_id).enqueue(metrics=metrics_arr)

    def set_tags(self, run_id: str | PendingRunId, tags: dict[str, Any]) -> None:
        """
        Enqueues a collection of Tags to be logged to the run specified by `run_id`.
        """
        tags = _truncate_dict(
            tags, max_key_length=MAX_ENTITY_KEY_LENGTH, max_value_length=MAX_TAG_VAL_LENGTH
        )
        tags_arr = [RunTag(key, str(value)) for key, value in tags.items()]
        self._get_pending_operations(run_id).enqueue(tags=tags_arr)

    def flush(self, synchronous=True):
        """
        Flushes all queued run operations, resulting in the creation or mutation of runs
        and run data.

        Args:
            synchronous: If `True`, run operations are performed synchronously, and a
                `RunOperations` result object is only returned once all operations
                are complete. If `False`, run operations are performed asynchronously,
                and an `RunOperations` object is returned that represents the ongoing
                run operations.

        Returns:
            A `RunOperations` instance representing the flushed operations. These operations
            are already complete if `synchronous` is `True`. If `synchronous` is `False`, these
            operations may still be inflight. Operation completion can be synchronously waited
            on via `RunOperations.await_completion()`.
        """
        logging_futures = [
            _AUTOLOGGING_QUEUEING_CLIENT_THREAD_POOL.submit(
                self._flush_pending_operations,
                pending_operations=pending_operations,
            )
            for pending_operations in self._pending_ops_by_run_id.values()
        ]
        self._pending_ops_by_run_id = {}

        logging_operations = RunOperations(logging_futures)
        if synchronous:
            logging_operations.await_completion()
        return logging_operations

    def _get_pending_operations(self, run_id):
        """
        Returns:
            A `_PendingRunOperations` containing all pending operations for the
            specified `run_id`.
        """
        if run_id not in self._pending_ops_by_run_id:
            self._pending_ops_by_run_id[run_id] = _PendingRunOperations(run_id=run_id)
        return self._pending_ops_by_run_id[run_id]

    def _try_operation(self, fn, *args, **kwargs):
        """
        Attempt to evaluate the specified function, `fn`, on the specified `*args` and `**kwargs`,
        returning either the result of the function evaluation (if evaluation was successful) or
        the exception raised by the function evaluation (if evaluation was unsuccessful).
        """
        try:
            return fn(*args, **kwargs)
        except Exception as e:
            return e

    def _flush_pending_operations(self, pending_operations):
        """
        Synchronously and sequentially flushes the specified list of pending run operations.

        NB: Operations are not parallelized on a per-run basis because MLflow's File Store, which
        is frequently used for local ML development, does not support threadsafe metadata logging
        within a given run.
        """
        if pending_operations.create_run:
            create_run_tags = pending_operations.create_run.tags
            num_additional_tags_to_include_during_creation = MAX_ENTITIES_PER_BATCH - len(
                create_run_tags
            )
            if num_additional_tags_to_include_during_creation > 0:
                create_run_tags.extend(
                    pending_operations.tags_queue[:num_additional_tags_to_include_during_creation]
                )
                pending_operations.tags_queue = pending_operations.tags_queue[
                    num_additional_tags_to_include_during_creation:
                ]

            new_run = self._client.create_run(
                experiment_id=pending_operations.create_run.experiment_id,
                start_time=pending_operations.create_run.start_time,
                tags={tag.key: tag.value for tag in create_run_tags},
            )
            pending_operations.run_id = new_run.info.run_id

        run_id = pending_operations.run_id
        assert not isinstance(run_id, PendingRunId), "Run ID cannot be pending for logging"

        operation_results = []

        param_batches_to_log = chunk_list(
            pending_operations.params_queue,
            chunk_size=MAX_PARAMS_TAGS_PER_BATCH,
        )
        tag_batches_to_log = chunk_list(
            pending_operations.tags_queue,
            chunk_size=MAX_PARAMS_TAGS_PER_BATCH,
        )
        for params_batch, tags_batch in zip_longest(
            param_batches_to_log, tag_batches_to_log, fillvalue=[]
        ):
            metrics_batch_size = min(
                MAX_ENTITIES_PER_BATCH - len(params_batch) - len(tags_batch),
                MAX_METRICS_PER_BATCH,
            )
            metrics_batch_size = max(metrics_batch_size, 0)
            metrics_batch = pending_operations.metrics_queue[:metrics_batch_size]
            pending_operations.metrics_queue = pending_operations.metrics_queue[metrics_batch_size:]

            operation_results.append(
                self._try_operation(
                    self._client.log_batch,
                    run_id=run_id,
                    metrics=metrics_batch,
                    params=params_batch,
                    tags=tags_batch,
                )
            )

        operation_results.extend(
            self._try_operation(self._client.log_batch, run_id=run_id, metrics=metrics_batch)
            for metrics_batch in chunk_list(
                pending_operations.metrics_queue, chunk_size=MAX_METRICS_PER_BATCH
            )
        )

        operation_results.extend(
            self._try_operation(self._client.log_inputs, run_id=run_id, datasets=datasets_batch)
            for datasets_batch in chunk_list(
                pending_operations.datasets_queue, chunk_size=MAX_DATASETS_PER_BATCH
            )
        )

        if pending_operations.set_terminated:
            operation_results.append(
                self._try_operation(
                    self._client.set_terminated,
                    run_id=run_id,
                    status=pending_operations.set_terminated.status,
                    end_time=pending_operations.set_terminated.end_time,
                )
            )

        failures = [result for result in operation_results if isinstance(result, Exception)]
        if len(failures) > 0:
            raise MlflowException(
                message=(
                    f"Failed to perform one or more operations on the run with ID {run_id}."
                    f" Failed operations: {failures}"
                )
            )


class _PendingRunOperations:
    """
    Represents a collection of queued / pending MLflow Run operations.
    """

    def __init__(self, run_id):
        self.run_id = run_id
        self.create_run = None
        self.set_terminated = None
        self.params_queue = []
        self.tags_queue = []
        self.metrics_queue = []
        self.datasets_queue = []

    def enqueue(
        self,
        params=None,
        tags=None,
        metrics=None,
        datasets=None,
        create_run=None,
        set_terminated=None,
    ):
        """
        Enqueues a new pending logging operation for the associated MLflow Run.
        """
        if create_run:
            assert not self.create_run, "Attempted to create the same run multiple times"
            self.create_run = create_run
        if set_terminated:
            assert not self.set_terminated, "Attempted to terminate the same run multiple times"
            self.set_terminated = set_terminated

        self.params_queue += params or []
        self.tags_queue += tags or []
        self.metrics_queue += metrics or []
        self.datasets_queue += datasets or []
```

--------------------------------------------------------------------------------

---[FILE: config.py]---
Location: mlflow-master/mlflow/utils/autologging_utils/config.py

```python
import logging
from dataclasses import dataclass
from typing import Any

from mlflow.utils.autologging_utils import AUTOLOGGING_INTEGRATIONS

_logger = logging.getLogger(__name__)


@dataclass
class AutoLoggingConfig:
    """
    A dataclass to hold common autologging configuration options.
    """

    log_input_examples: bool
    log_model_signatures: bool
    log_traces: bool
    extra_tags: dict[str, Any] | None = None
    log_models: bool = True

    @classmethod
    def init(cls, flavor_name: str):
        config_dict = AUTOLOGGING_INTEGRATIONS.get(flavor_name, {})
        # NB: These defaults are only used when the autolog() function for the
        # flavor does not specify the corresponding configuration option
        return cls(
            log_models=config_dict.get("log_models", False),
            log_input_examples=config_dict.get("log_input_examples", False),
            log_model_signatures=config_dict.get("log_model_signatures", False),
            log_traces=config_dict.get("log_traces", True),
            extra_tags=config_dict.get("extra_tags", None),
        )
```

--------------------------------------------------------------------------------

---[FILE: events.py]---
Location: mlflow-master/mlflow/utils/autologging_utils/events.py

```python
import warnings
from typing import Any

from mlflow.utils.autologging_utils import _logger


def _catch_exception(fn):
    """A decorator that catches exceptions thrown by the wrapped function and logs them."""

    def wrapper(*args):
        try:
            fn(*args)
        except Exception as e:
            _logger.debug(f"Failed to log autologging event via '{fn}'. Exception: {e}")

    return wrapper


class AutologgingEventLoggerWrapper:
    """
    A wrapper around AutologgingEventLogger for DRY:
      - Store common arguments to avoid passing them to each logger method
      - Catches exceptions thrown by the logger and logs them

    NB: We could not modify the AutologgingEventLogger class directly because
        it is used in Databricks code base as well.
    """

    def __init__(self, session, destination: Any, function_name: str):
        self._session = session
        self._destination = destination
        self._function_name = function_name
        self._logger = AutologgingEventLogger.get_logger()

    @_catch_exception
    def log_patch_function_start(self, args, kwargs):
        self._logger.log_patch_function_start(
            self._session, self._destination, self._function_name, args, kwargs
        )

    @_catch_exception
    def log_patch_function_success(self, args, kwargs):
        self._logger.log_patch_function_success(
            self._session, self._destination, self._function_name, args, kwargs
        )

    @_catch_exception
    def log_patch_function_error(self, args, kwargs, exception):
        self._logger.log_patch_function_error(
            self._session, self._destination, self._function_name, args, kwargs, exception
        )

    @_catch_exception
    def log_original_function_start(self, args, kwargs):
        self._logger.log_original_function_start(
            self._session, self._destination, self._function_name, args, kwargs
        )

    @_catch_exception
    def log_original_function_success(self, args, kwargs):
        self._logger.log_original_function_success(
            self._session, self._destination, self._function_name, args, kwargs
        )

    @_catch_exception
    def log_original_function_error(self, args, kwargs, exception):
        self._logger.log_original_function_error(
            self._session, self._destination, self._function_name, args, kwargs, exception
        )


class AutologgingEventLogger:
    """
    Provides instrumentation hooks for important autologging lifecycle events, including:

        - Calls to `mlflow.autolog()` APIs
        - Calls to patched APIs with associated termination states
          ("success" and "failure due to error")
        - Calls to original / underlying APIs made by patched function code with
          associated termination states ("success" and "failure due to error")

    Default implementations are included for each of these hooks, which emit corresponding
    DEBUG-level logging statements. Developers can provide their own hook implementations
    by subclassing `AutologgingEventLogger` and calling the static
    `AutologgingEventLogger.set_logger()` method to supply a new event logger instance.

    Callers fetch the configured logger via `AutologgingEventLogger.get_logger()`
    and invoke one or more hooks (e.g., `AutologgingEventLogger.get_logger().log_autolog_called()`).
    """

    _event_logger = None

    @staticmethod
    def get_logger():
        """Fetches the configured `AutologgingEventLogger` instance for logging.

        Returns:
            The instance of `AutologgingEventLogger` specified via `set_logger`
            (if configured) or the default implementation of `AutologgingEventLogger`
            (if a logger was not configured via `set_logger`).

        """
        return AutologgingEventLogger._event_logger or AutologgingEventLogger()

    @staticmethod
    def set_logger(logger):
        """Configures the `AutologgingEventLogger` instance for logging. This instance
        is exposed via `AutologgingEventLogger.get_logger()` and callers use it to invoke
        logging hooks (e.g., AutologgingEventLogger.get_logger().log_autolog_called()).

        Args:
            logger: The instance of `AutologgingEventLogger` to use when invoking logging hooks.

        """
        AutologgingEventLogger._event_logger = logger

    def log_autolog_called(self, integration, call_args, call_kwargs):
        """Called when the `autolog()` method for an autologging integration
        is invoked (e.g., when a user invokes `mlflow.sklearn.autolog()`)

        Args:
            integration: The autologging integration for which `autolog()` was called.
            call_args: **DEPRECATED** The positional arguments passed to the `autolog()` call.
                This field is empty in MLflow > 1.13.1; all arguments are passed in
                keyword form via `call_kwargs`.
            call_kwargs: The arguments passed to the `autolog()` call in keyword form.
                Any positional arguments should also be converted to keyword form
                and passed via `call_kwargs`.
        """
        if len(call_args) > 0:
            warnings.warn(
                f"Received {len(call_args)} positional arguments via `call_args`. `call_args` is"
                " deprecated in MLflow > 1.13.1, and all arguments should be passed"
                " in keyword form via `call_kwargs`.",
                category=DeprecationWarning,  # clint: disable=forbidden-deprecation-warning
                stacklevel=2,
            )
        _logger.debug(
            "Called autolog() method for %s autologging with args '%s' and kwargs '%s'",
            integration,
            call_args,
            call_kwargs,
        )

    def log_patch_function_start(self, session, patch_obj, function_name, call_args, call_kwargs):
        """Called upon invocation of a patched API associated with an autologging integration
        (e.g., `sklearn.linear_model.LogisticRegression.fit()`).

        Args:
            session: The `AutologgingSession` associated with the patched API call.
            patch_obj: The object (class, module, etc) on which the patched API was called.
            function_name: The name of the patched API that was called.
            call_args: The positional arguments passed to the patched API call.
            call_kwargs: The keyword arguments passed to the patched API call.

        """
        _logger.debug(
            "Invoked patched API '%s.%s' for %s autologging with args '%s' and kwargs '%s'",
            patch_obj,
            function_name,
            session.integration,
            call_args,
            call_kwargs,
        )

    def log_patch_function_success(self, session, patch_obj, function_name, call_args, call_kwargs):
        """
        Called upon successful termination of a patched API associated with an autologging
        integration (e.g., `sklearn.linear_model.LogisticRegression.fit()`).

        Args:
            session: The `AutologgingSession` associated with the patched API call.
            patch_obj: The object (class, module, etc) on which the patched API was called.
            function_name: The name of the patched API that was called.
            call_args: The positional arguments passed to the patched API call.
            call_kwargs: The keyword arguments passed to the patched API call.
        """
        _logger.debug(
            "Patched API call '%s.%s' for %s autologging completed successfully. Patched ML"
            " API was called with args '%s' and kwargs '%s'",
            patch_obj,
            function_name,
            session.integration,
            call_args,
            call_kwargs,
        )

    def log_patch_function_error(
        self, session, patch_obj, function_name, call_args, call_kwargs, exception
    ):
        """Called when execution of a patched API associated with an autologging integration
        (e.g., `sklearn.linear_model.LogisticRegression.fit()`) terminates with an exception.

        Args:
            session: The `AutologgingSession` associated with the patched API call.
            patch_obj: The object (class, module, etc) on which the patched API was called.
            function_name: The name of the patched API that was called.
            call_args: The positional arguments passed to the patched API call.
            call_kwargs: The keyword arguments passed to the patched API call.
            exception: The exception that caused the patched API call to terminate.
        """
        _logger.debug(
            "Patched API call '%s.%s' for %s autologging threw exception. Patched API was"
            " called with args '%s' and kwargs '%s'. Exception: %s",
            patch_obj,
            function_name,
            session.integration,
            call_args,
            call_kwargs,
            exception,
        )

    def log_original_function_start(
        self, session, patch_obj, function_name, call_args, call_kwargs
    ):
        """
        Called during the execution of a patched API associated with an autologging integration
        when the original / underlying API is invoked. For example, this is called when
        a patched implementation of `sklearn.linear_model.LogisticRegression.fit()` invokes
        the original implementation of `sklearn.linear_model.LogisticRegression.fit()`.

        Args:
            session: The `AutologgingSession` associated with the patched API call.
            patch_obj: The object (class, module, etc) on which the original API was called.
            function_name: The name of the original API that was called.
            call_args: The positional arguments passed to the original API call.
            call_kwargs: The keyword arguments passed to the original API call.
        """
        _logger.debug(
            "Original function invoked during execution of patched API '%s.%s' for %s"
            " autologging. Original function was invoked with args '%s' and kwargs '%s'",
            patch_obj,
            function_name,
            session.integration,
            call_args,
            call_kwargs,
        )

    def log_original_function_success(
        self, session, patch_obj, function_name, call_args, call_kwargs
    ):
        """Called during the execution of a patched API associated with an autologging integration
        when the original / underlying API invocation terminates successfully. For example,
        when a patched implementation of `sklearn.linear_model.LogisticRegression.fit()` invokes the
        original / underlying implementation of `LogisticRegression.fit()`, then this function is
        called if the original / underlying implementation successfully completes.

        Args:
            session: The `AutologgingSession` associated with the patched API call.
            patch_obj: The object (class, module, etc) on which the original API was called.
            function_name: The name of the original API that was called.
            call_args: The positional arguments passed to the original API call.
            call_kwargs: The keyword arguments passed to the original API call.

        """
        _logger.debug(
            "Original function invocation completed successfully during execution of patched API"
            " call '%s.%s' for %s autologging. Original function was invoked with with"
            " args '%s' and kwargs '%s'",
            patch_obj,
            function_name,
            session.integration,
            call_args,
            call_kwargs,
        )

    def log_original_function_error(
        self, session, patch_obj, function_name, call_args, call_kwargs, exception
    ):
        """Called during the execution of a patched API associated with an autologging integration
        when the original / underlying API invocation terminates with an error. For example,
        when a patched implementation of `sklearn.linear_model.LogisticRegression.fit()` invokes the
        original / underlying implementation of `LogisticRegression.fit()`, then this function is
        called if the original / underlying implementation terminates with an exception.

        Args:
            session: The `AutologgingSession` associated with the patched API call.
            patch_obj: The object (class, module, etc) on which the original API was called.
            function_name: The name of the original API that was called.
            call_args: The positional arguments passed to the original API call.
            call_kwargs: The keyword arguments passed to the original API call.
            exception: The exception that caused the original API call to terminate.
        """
        _logger.debug(
            "Original function invocation threw exception during execution of patched"
            " API call '%s.%s' for %s autologging. Original function was invoked with"
            " args '%s' and kwargs '%s'. Exception: %s",
            patch_obj,
            function_name,
            session.integration,
            call_args,
            call_kwargs,
            exception,
        )
```

--------------------------------------------------------------------------------

````
