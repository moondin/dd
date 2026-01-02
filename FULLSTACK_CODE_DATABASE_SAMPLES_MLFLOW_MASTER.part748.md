---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 748
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 748 of 991)

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

---[FILE: async_artifacts_logging_queue.py]---
Location: mlflow-master/mlflow/utils/async_logging/async_artifacts_logging_queue.py

```python
"""
Defines an AsyncArtifactsLoggingQueue that provides async fashion artifact writes using
queue based approach.
"""

import atexit
import logging
import threading
from concurrent.futures import ThreadPoolExecutor
from queue import Empty, Queue
from typing import TYPE_CHECKING, Callable, Union

from mlflow.utils.async_logging.run_artifact import RunArtifact
from mlflow.utils.async_logging.run_operations import RunOperations

if TYPE_CHECKING:
    import PIL.Image

_logger = logging.getLogger(__name__)


class AsyncArtifactsLoggingQueue:
    """
    This is a queue based run data processor that queue incoming data and process it using a single
    worker thread. This class is used to process artifacts saving in async fashion.

    Args:
        logging_func: A callable function that takes in three arguments:
            - filename: The name of the artifact file.
            - artifact_path: The path to the artifact.
            - artifact: The artifact to be logged.
    """

    def __init__(
        self, artifact_logging_func: Callable[[str, str, Union["PIL.Image.Image"]], None]
    ) -> None:
        self._queue: Queue[RunArtifact] = Queue()
        self._lock = threading.RLock()
        self._artifact_logging_func = artifact_logging_func

        self._stop_data_logging_thread_event = threading.Event()
        self._is_activated = False

    def _at_exit_callback(self) -> None:
        """Callback function to be executed when the program is exiting.

        Stops the data processing thread and waits for the queue to be drained. Finally, shuts down
        the thread pools used for data logging and artifact processing status check.
        """
        try:
            # Stop the data processing thread
            self._stop_data_logging_thread_event.set()
            # Waits till logging queue is drained.
            self._artifact_logging_thread.join()
            self._artifact_logging_worker_threadpool.shutdown(wait=True)
            self._artifact_status_check_threadpool.shutdown(wait=True)
        except Exception as e:
            _logger.error(f"Encountered error while trying to finish logging: {e}")

    def flush(self) -> None:
        """Flush the async logging queue.

        Calling this method will flush the queue to ensure all the data are logged.
        """
        # Stop the data processing thread.
        self._stop_data_logging_thread_event.set()
        # Waits till logging queue is drained.
        self._artifact_logging_thread.join()
        self._artifact_logging_worker_threadpool.shutdown(wait=True)
        self._artifact_status_check_threadpool.shutdown(wait=True)

        # Restart the thread to listen to incoming data after flushing.
        self._stop_data_logging_thread_event.clear()
        self._set_up_logging_thread()

    def _logging_loop(self) -> None:
        """
        Continuously logs run data until `self._continue_to_process_data` is set to False.
        If an exception occurs during logging, a `MlflowException` is raised.
        """
        try:
            while not self._stop_data_logging_thread_event.is_set():
                self._log_artifact()
            # Drain the queue after the stop event is set.
            while not self._queue.empty():
                self._log_artifact()
        except Exception as e:
            from mlflow.exceptions import MlflowException

            raise MlflowException(f"Exception inside the run data logging thread: {e}")

    def _log_artifact(self) -> None:
        """Process the run's artifacts in the running runs queues.

        For each run in the running runs queues, this method retrieves the next artifact of run
        from the queue and processes it by calling the `_artifact_logging_func` method with the run
        ID and artifact. If the artifact is empty, it is skipped. After processing the artifact,
        the processed watermark is updated and the artifact event is set.
        If an exception occurs during processing, the exception is logged and the artifact event
        is set with the exception. If the queue is empty, it is ignored.
        """
        try:
            run_artifact = self._queue.get(timeout=1)
        except Empty:
            # Ignore empty queue exception
            return

        def logging_func(run_artifact):
            try:
                self._artifact_logging_func(
                    filename=run_artifact.filename,
                    artifact_path=run_artifact.artifact_path,
                    artifact=run_artifact.artifact,
                )

                # Signal the artifact processing is done.
                run_artifact.completion_event.set()

            except Exception as e:
                _logger.error(f"Failed to log artifact {run_artifact.filename}. Exception: {e}")
                run_artifact.exception = e
                run_artifact.completion_event.set()

        self._artifact_logging_worker_threadpool.submit(logging_func, run_artifact)

    def _wait_for_artifact(self, artifact: RunArtifact) -> None:
        """Wait for given artifacts to be processed by the logging thread.

        Args:
            artifact: The artifact to wait for.

        Raises:
            Exception: If an exception occurred while processing the artifact.
        """
        artifact.completion_event.wait()
        if artifact.exception:
            raise artifact.exception

    def __getstate__(self):
        """Return the state of the object for pickling.

        This method is called by the `pickle` module when the object is being pickled. It returns a
        dictionary containing the object's state, with non-picklable attributes removed.

        Returns:
            dict: A dictionary containing the object's state.
        """
        state = self.__dict__.copy()
        del state["_queue"]
        del state["_lock"]
        del state["_is_activated"]

        if "_stop_data_logging_thread_event" in state:
            del state["_stop_data_logging_thread_event"]
        if "_artifact_logging_thread" in state:
            del state["_artifact_logging_thread"]
        if "_artifact_logging_worker_threadpool" in state:
            del state["_artifact_logging_worker_threadpool"]
        if "_artifact_status_check_threadpool" in state:
            del state["_artifact_status_check_threadpool"]

        return state

    def __setstate__(self, state):
        """Set the state of the object from a given state dictionary.

        It pops back the removed non-picklable attributes from `self.__getstate__()`.

        Args:
            state (dict): A dictionary containing the state of the object.

        Returns:
            None
        """
        self.__dict__.update(state)
        self._queue = Queue()
        self._lock = threading.RLock()
        self._is_activated = False
        self._artifact_logging_thread = None
        self._artifact_logging_worker_threadpool = None
        self._artifact_status_check_threadpool = None
        self._stop_data_logging_thread_event = threading.Event()

    def log_artifacts_async(self, filename, artifact_path, artifact) -> RunOperations:
        """Asynchronously logs runs artifacts.

        Args:
            filename: Filename of the artifact to be logged.
            artifact_path: Directory within the run's artifact directory in which to log the
                artifact.
            artifact: The artifact to be logged.

        Returns:
            mlflow.utils.async_utils.RunOperations: An object that encapsulates the
                asynchronous operation of logging the artifact of run data.
                The object contains a list of `concurrent.futures.Future` objects that can be used
                to check the status of the operation and retrieve any exceptions
                that occurred during the operation.
        """
        from mlflow import MlflowException

        if not self._is_activated:
            raise MlflowException("AsyncArtifactsLoggingQueue is not activated.")
        artifact = RunArtifact(
            filename=filename,
            artifact_path=artifact_path,
            artifact=artifact,
            completion_event=threading.Event(),
        )
        self._queue.put(artifact)
        operation_future = self._artifact_status_check_threadpool.submit(
            self._wait_for_artifact, artifact
        )
        return RunOperations(operation_futures=[operation_future])

    def is_active(self) -> bool:
        return self._is_activated

    def _set_up_logging_thread(self) -> None:
        """Sets up the logging thread.

        If the logging thread is already set up, this method does nothing.
        """
        with self._lock:
            self._artifact_logging_thread = threading.Thread(
                target=self._logging_loop,
                name="MLflowAsyncArtifactsLoggingLoop",
                daemon=True,
            )
            self._artifact_logging_worker_threadpool = ThreadPoolExecutor(
                max_workers=5,
                thread_name_prefix="MLflowArtifactsLoggingWorkerPool",
            )

            self._artifact_status_check_threadpool = ThreadPoolExecutor(
                max_workers=5,
                thread_name_prefix="MLflowAsyncArtifactsLoggingStatusCheck",
            )
            self._artifact_logging_thread.start()

    def activate(self) -> None:
        """Activates the async logging queue

        1. Initializes queue draining thread.
        2. Initializes threads for checking the status of logged artifact.
        3. Registering an atexit callback to ensure that any remaining log data
            is flushed before the program exits.

        If the queue is already activated, this method does nothing.
        """
        with self._lock:
            if self._is_activated:
                return

            self._set_up_logging_thread()
            atexit.register(self._at_exit_callback)

            self._is_activated = True
```

--------------------------------------------------------------------------------

---[FILE: async_logging_queue.py]---
Location: mlflow-master/mlflow/utils/async_logging/async_logging_queue.py

```python
"""
Defines an AsyncLoggingQueue that provides async fashion logging of metrics/tags/params using
queue based approach.
"""

import atexit
import enum
import logging
import threading
from concurrent.futures import ThreadPoolExecutor
from queue import Empty, Queue
from typing import Callable

from mlflow.entities.metric import Metric
from mlflow.entities.param import Param
from mlflow.entities.run_tag import RunTag
from mlflow.environment_variables import (
    MLFLOW_ASYNC_LOGGING_BUFFERING_SECONDS,
    MLFLOW_ASYNC_LOGGING_THREADPOOL_SIZE,
)
from mlflow.utils.async_logging.run_batch import RunBatch
from mlflow.utils.async_logging.run_operations import RunOperations

_logger = logging.getLogger(__name__)


ASYNC_LOGGING_WORKER_THREAD_PREFIX = "MLflowBatchLoggingWorkerPool"
ASYNC_LOGGING_STATUS_CHECK_THREAD_PREFIX = "MLflowAsyncLoggingStatusCheck"


class QueueStatus(enum.Enum):
    """Status of the async queue"""

    # The queue is listening to new data and logging enqueued data to MLflow.
    ACTIVE = 1
    # The queue is not listening to new data, but still logging enqueued data to MLflow.
    TEAR_DOWN = 2
    # The queue is neither listening to new data or logging enqueued data to MLflow.
    IDLE = 3


_MAX_ITEMS_PER_BATCH = 1000
_MAX_PARAMS_PER_BATCH = 100
_MAX_TAGS_PER_BATCH = 100


class AsyncLoggingQueue:
    """
    This is a queue based run data processor that queues incoming batches and processes them using
    single worker thread.
    """

    def __init__(
        self, logging_func: Callable[[str, list[Metric], list[Param], list[RunTag]], None]
    ) -> None:
        """Initializes an AsyncLoggingQueue object.

        Args:
            logging_func: A callable function that takes in four arguments: a string
                representing the run_id, a list of Metric objects,
                a list of Param objects, and a list of RunTag objects.
        """
        self._queue = Queue()
        self._lock = threading.RLock()
        self._logging_func = logging_func

        self._stop_data_logging_thread_event = threading.Event()
        self._status = QueueStatus.IDLE

    def _at_exit_callback(self) -> None:
        """Callback function to be executed when the program is exiting.

        Stops the data processing thread and waits for the queue to be drained. Finally, shuts down
        the thread pools used for data logging and batch processing status check.
        """
        try:
            # Stop the data processing thread
            self._stop_data_logging_thread_event.set()
            # Waits till logging queue is drained.
            self._batch_logging_thread.join()
            self._batch_logging_worker_threadpool.shutdown(wait=True)
            self._batch_status_check_threadpool.shutdown(wait=True)
        except Exception as e:
            _logger.error(f"Encountered error while trying to finish logging: {e}")

    def end_async_logging(self) -> None:
        with self._lock:
            # Stop the data processing thread.
            self._stop_data_logging_thread_event.set()
            # Waits till logging queue is drained.
            self._batch_logging_thread.join()
            # Set the status to tear down. The worker threads will still process
            # the remaining data.
            self._status = QueueStatus.TEAR_DOWN
            # Clear the status to avoid blocking next logging.
            self._stop_data_logging_thread_event.clear()

    def shut_down_async_logging(self) -> None:
        """
        Shut down the async logging queue and wait for the queue to be drained.
        Use this method if the async logging should be terminated.
        """
        self.end_async_logging()
        self._batch_logging_worker_threadpool.shutdown(wait=True)
        self._batch_status_check_threadpool.shutdown(wait=True)
        self._status = QueueStatus.IDLE

    def flush(self) -> None:
        """
        Flush the async logging queue and restart thread to listen
        to incoming data after flushing.

        Calling this method will flush the queue to ensure all the data are logged.
        """
        self.shut_down_async_logging()
        # Reinitialize the logging thread and set the status to active.
        self.activate()

    def _logging_loop(self) -> None:
        """
        Continuously logs run data until `self._continue_to_process_data` is set to False.
        If an exception occurs during logging, a `MlflowException` is raised.
        """
        try:
            while not self._stop_data_logging_thread_event.is_set():
                self._log_run_data()
            # Drain the queue after the stop event is set.
            while not self._queue.empty():
                self._log_run_data()
        except Exception as e:
            from mlflow.exceptions import MlflowException

            raise MlflowException(f"Exception inside the run data logging thread: {e}")

    def _fetch_batch_from_queue(self) -> list[RunBatch]:
        """Fetches a batch of run data from the queue.

        Returns:
            RunBatch: A batch of run data.
        """
        batches = []
        if self._queue.empty():
            return batches
        queue_size = self._queue.qsize()  # Estimate the queue's size.
        merged_batch = self._queue.get()
        for i in range(queue_size - 1):
            if self._queue.empty():
                # `queue_size` is an estimate, so we need to check if the queue is empty.
                break
            batch = self._queue.get()

            if (
                merged_batch.run_id != batch.run_id
                or (
                    len(merged_batch.metrics + merged_batch.params + merged_batch.tags)
                    + len(batch.metrics + batch.params + batch.tags)
                )
                >= _MAX_ITEMS_PER_BATCH
                or len(merged_batch.params) + len(batch.params) >= _MAX_PARAMS_PER_BATCH
                or len(merged_batch.tags) + len(batch.tags) >= _MAX_TAGS_PER_BATCH
            ):
                # Make a new batch if the run_id is different or the batch is full.
                batches.append(merged_batch)
                merged_batch = batch
            else:
                merged_batch.add_child_batch(batch)
                merged_batch.params.extend(batch.params)
                merged_batch.tags.extend(batch.tags)
                merged_batch.metrics.extend(batch.metrics)

        batches.append(merged_batch)
        return batches

    def _log_run_data(self) -> None:
        """Process the run data in the running runs queues.

        For each run in the running runs queues, this method retrieves the next batch of run data
        from the queue and processes it by calling the `_processing_func` method with the run ID,
        metrics, parameters, and tags in the batch. If the batch is empty, it is skipped. After
        processing the batch, the processed watermark is updated and the batch event is set.
        If an exception occurs during processing, the exception is logged and the batch event is set
        with the exception. If the queue is empty, it is ignored.

        Returns: None
        """
        async_logging_buffer_seconds = MLFLOW_ASYNC_LOGGING_BUFFERING_SECONDS.get()
        try:
            if async_logging_buffer_seconds:
                self._stop_data_logging_thread_event.wait(async_logging_buffer_seconds)
                run_batches = self._fetch_batch_from_queue()
            else:
                run_batches = [self._queue.get(timeout=1)]
        except Empty:
            # Ignore empty queue exception
            return

        def logging_func(run_batch):
            try:
                self._logging_func(
                    run_id=run_batch.run_id,
                    metrics=run_batch.metrics,
                    params=run_batch.params,
                    tags=run_batch.tags,
                )
            except Exception as e:
                _logger.error(f"Run Id {run_batch.run_id}: Failed to log run data: Exception: {e}")
                run_batch.exception = e
            finally:
                run_batch.complete()

        for run_batch in run_batches:
            try:
                self._batch_logging_worker_threadpool.submit(logging_func, run_batch)
            except Exception as e:
                _logger.error(
                    f"Failed to submit batch for logging: {e}. Usually this means you are not "
                    "shutting down MLflow properly before exiting. Please make sure you are using "
                    "context manager, e.g., `with mlflow.start_run():` or call `mlflow.end_run()`"
                    "explicitly to terminate MLflow logging before exiting."
                )
                run_batch.exception = e
                run_batch.complete()

    def _wait_for_batch(self, batch: RunBatch) -> None:
        """Wait for the given batch to be processed by the logging thread.

        Args:
            batch: The batch to wait for.

        Raises:
            Exception: If an exception occurred while processing the batch.
        """
        batch.completion_event.wait()
        if batch.exception:
            raise batch.exception

    def __getstate__(self):
        """Return the state of the object for pickling.

        This method is called by the `pickle` module when the object is being pickled. It returns a
        dictionary containing the object's state, with non-picklable attributes removed.

        Returns:
            dict: A dictionary containing the object's state.
        """
        state = self.__dict__.copy()
        del state["_queue"]
        del state["_lock"]
        del state["_status"]

        if "_run_data_logging_thread" in state:
            del state["_run_data_logging_thread"]
        if "_stop_data_logging_thread_event" in state:
            del state["_stop_data_logging_thread_event"]
        if "_batch_logging_thread" in state:
            del state["_batch_logging_thread"]
        if "_batch_logging_worker_threadpool" in state:
            del state["_batch_logging_worker_threadpool"]
        if "_batch_status_check_threadpool" in state:
            del state["_batch_status_check_threadpool"]

        return state

    def __setstate__(self, state):
        """Set the state of the object from a given state dictionary.

        It pops back the removed non-picklable attributes from `self.__getstate__()`.

        Args:
            state (dict): A dictionary containing the state of the object.

        Returns:
            None
        """
        self.__dict__.update(state)
        self._queue = Queue()
        self._lock = threading.RLock()
        self._status = QueueStatus.IDLE
        self._batch_logging_thread = None
        self._batch_logging_worker_threadpool = None
        self._batch_status_check_threadpool = None
        self._stop_data_logging_thread_event = threading.Event()

    def log_batch_async(
        self, run_id: str, params: list[Param], tags: list[RunTag], metrics: list[Metric]
    ) -> RunOperations:
        """Asynchronously logs a batch of run data (parameters, tags, and metrics).

        Args:
            run_id (str): The ID of the run to log data for.
            params (list[mlflow.entities.Param]): A list of parameters to log for the run.
            tags (list[mlflow.entities.RunTag]): A list of tags to log for the run.
            metrics (list[mlflow.entities.Metric]): A list of metrics to log for the run.

        Returns:
            mlflow.utils.async_utils.RunOperations: An object that encapsulates the
                asynchronous operation of logging the batch of run data.
                The object contains a list of `concurrent.futures.Future` objects that can be used
                to check the status of the operation and retrieve any exceptions
                that occurred during the operation.
        """
        from mlflow import MlflowException

        if not self.is_active():
            raise MlflowException("AsyncLoggingQueue is not activated.")
        batch = RunBatch(
            run_id=run_id,
            params=params,
            tags=tags,
            metrics=metrics,
            completion_event=threading.Event(),
        )
        self._queue.put(batch)
        operation_future = self._batch_status_check_threadpool.submit(self._wait_for_batch, batch)
        return RunOperations(operation_futures=[operation_future])

    def is_active(self) -> bool:
        return self._status == QueueStatus.ACTIVE

    def is_idle(self) -> bool:
        return self._status == QueueStatus.IDLE

    def _set_up_logging_thread(self) -> None:
        """
        Sets up the logging thread.

        This method shouldn't be called directly without shutting down the async
        logging first if an existing async logging exists, otherwise it might
        hang the program.
        """
        with self._lock:
            self._batch_logging_thread = threading.Thread(
                target=self._logging_loop,
                name="MLflowAsyncLoggingLoop",
                daemon=True,
            )
            self._batch_logging_worker_threadpool = ThreadPoolExecutor(
                max_workers=MLFLOW_ASYNC_LOGGING_THREADPOOL_SIZE.get() or 10,
                thread_name_prefix=ASYNC_LOGGING_WORKER_THREAD_PREFIX,
            )

            self._batch_status_check_threadpool = ThreadPoolExecutor(
                max_workers=MLFLOW_ASYNC_LOGGING_THREADPOOL_SIZE.get() or 10,
                thread_name_prefix=ASYNC_LOGGING_STATUS_CHECK_THREAD_PREFIX,
            )

            self._batch_logging_thread.start()

    def activate(self) -> None:
        """Activates the async logging queue

        1. Initializes queue draining thread.
        2. Initializes threads for checking the status of logged batch.
        3. Registering an atexit callback to ensure that any remaining log data
            is flushed before the program exits.

        If the queue is already activated, this method does nothing.
        """
        with self._lock:
            if self.is_active():
                return

            self._set_up_logging_thread()
            atexit.register(self._at_exit_callback)

            self._status = QueueStatus.ACTIVE
```

--------------------------------------------------------------------------------

---[FILE: run_artifact.py]---
Location: mlflow-master/mlflow/utils/async_logging/run_artifact.py

```python
import threading
from typing import TYPE_CHECKING, Union

if TYPE_CHECKING:
    import PIL


class RunArtifact:
    def __init__(
        self,
        filename: str,
        artifact_path: str,
        artifact: Union["PIL.Image.Image"],
        completion_event: threading.Event,
    ) -> None:
        """Initializes an instance of `RunArtifacts`.

        Args:
            filename: Filename of the artifact to be logged
            artifact_path: Directory within the run's artifact directory in which to log the
                artifact.
            artifact: The artifact to be logged.
            completion_event: A threading.Event object.
        """
        self.filename = filename
        self.artifact_path = artifact_path
        self.artifact = artifact
        self.completion_event = completion_event
        self._exception = None

    @property
    def exception(self):
        """Exception raised during logging the batch."""
        return self._exception

    @exception.setter
    def exception(self, exception):
        self._exception = exception
```

--------------------------------------------------------------------------------

---[FILE: run_batch.py]---
Location: mlflow-master/mlflow/utils/async_logging/run_batch.py

```python
import threading

from mlflow.entities.metric import Metric
from mlflow.entities.param import Param
from mlflow.entities.run_tag import RunTag


class RunBatch:
    def __init__(
        self,
        run_id: str,
        params: list["Param"] | None = None,
        tags: list["RunTag"] | None = None,
        metrics: list["Metric"] | None = None,
        completion_event: threading.Event | None = None,
    ):
        """Initializes an instance of `RunBatch`.

        Args:
            run_id: The ID of the run.
            params: A list of parameters. Default is None.
            tags: A list of tags. Default is None.
            metrics: A list of metrics. Default is None.
            completion_event: A threading.Event object. Default is None.
        """
        self.run_id = run_id
        self.params = params or []
        self.tags = tags or []
        self.metrics = metrics or []
        self.completion_event = completion_event
        self._exception = None
        self.child_batches = []

    @property
    def exception(self):
        """Exception raised during logging the batch."""
        return self._exception

    @exception.setter
    def exception(self, exception):
        self._exception = exception

    def add_child_batch(self, child_batch):
        """Add a child batch to the current batch.

        This is useful when merging child batches into a parent batch. Child batches are kept so
        that we can properly notify the system when child batches have been processed.
        """
        self.child_batches.append(child_batch)

    def complete(self):
        """Mark the batch as completed."""
        if self.completion_event:
            self.completion_event.set()

        for child_batch in self.child_batches:
            child_batch.complete()
```

--------------------------------------------------------------------------------

---[FILE: run_operations.py]---
Location: mlflow-master/mlflow/utils/async_logging/run_operations.py

```python
class RunOperations:
    """Class that helps manage the futures of MLflow async logging."""

    def __init__(self, operation_futures):
        self._operation_futures = operation_futures or []

    def wait(self):
        """Blocks on completion of all futures."""
        from mlflow.exceptions import MlflowException

        failed_operations = []
        for future in self._operation_futures:
            try:
                future.result()
            except Exception as e:
                failed_operations.append(e)

        if len(failed_operations) > 0:
            raise MlflowException(
                "The following failures occurred while performing one or more async logging "
                f"operations: {failed_operations}"
            )


def get_combined_run_operations(run_operations_list: list[RunOperations]) -> RunOperations:
    """Combine a list of RunOperations objects into a single RunOperations object.

    Given a list of `RunOperations`, returns a single `RunOperations` object that represents the
    combined set of operations. If the input list is empty, returns None. If the input list
    contains only one element, returns that element. Otherwise, creates a new `RunOperations`
    object that combines the operation futures from each input RunOperations object.

    Args:
        run_operations_list: A list of `RunOperations` objects to combine.

    Returns:
        A single `RunOperations` object that represents the combined set of operations.
    """
    if not run_operations_list:
        return None
    if len(run_operations_list) == 1:
        return run_operations_list[0]

    if len(run_operations_list) > 1:
        operation_futures = []
        for run_operations in run_operations_list:
            if run_operations and run_operations._operation_futures:
                operation_futures.extend(run_operations._operation_futures)
        return RunOperations(operation_futures)
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/utils/async_logging/__init__.py

```python
from mlflow.utils.async_logging import run_operations  # noqa: F401
```

--------------------------------------------------------------------------------

````
