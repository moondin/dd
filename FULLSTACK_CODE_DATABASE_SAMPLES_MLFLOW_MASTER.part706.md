---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 706
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 706 of 991)

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

---[FILE: display_handler.py]---
Location: mlflow-master/mlflow/tracing/display/display_handler.py

```python
import html
import json
import logging
from typing import TYPE_CHECKING
from urllib.parse import urlencode, urljoin

import mlflow
from mlflow.environment_variables import MLFLOW_MAX_TRACES_TO_DISPLAY_IN_NOTEBOOK
from mlflow.tracing.constant import TRACE_RENDERER_ASSET_PATH
from mlflow.utils.databricks_utils import is_in_databricks_runtime
from mlflow.utils.uri import is_http_uri

_logger = logging.getLogger(__name__)

if TYPE_CHECKING:
    from mlflow.entities import Trace

IFRAME_HTML = """
<div>
  <style scoped>
  button {{
    border: none;
    border-radius: 4px;
    background-color: rgb(34, 114, 180);
    font-family: -apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial;
    font-size: 13px;
    color: white;
    margin-top: 8px;
    margin-bottom: 8px;
    padding: 8px 16px;
    cursor: pointer;
  }}
  button:hover {{
    background-color: rgb(66, 153, 224);
  }}
  </style>
  <button
    onclick="
        const display = this.nextElementSibling.style.display;
        const isCollapsed = display === 'none';
        this.nextElementSibling.style.display = isCollapsed ? null : 'none';

        const verb = isCollapsed ? 'Collapse' : 'Expand';
        this.innerText = `${{verb}} MLflow Trace`;
    "
  >Collapse MLflow Trace</button>
  <iframe
    id="trace-renderer"
    style="width: 100%; height: 500px; border: none; resize: vertical;"
    src="{src}"
  />
</div>
"""


def get_notebook_iframe_html(traces: list["Trace"]):
    # fetch assets from tracking server
    uri = urljoin(mlflow.get_tracking_uri(), f"{TRACE_RENDERER_ASSET_PATH}/index.html")
    query_string = _get_query_string_for_traces(traces)

    # include mlflow version to invalidate browser cache when mlflow updates
    src = html.escape(f"{uri}?{query_string}&version={mlflow.__version__}")
    return IFRAME_HTML.format(src=src)


def _serialize_trace_list(traces: list["Trace"]):
    return json.dumps(
        # we can't just call trace.to_json() because this
        # will cause the trace to be serialized twice (once
        # by to_json and once by json.dumps)
        [json.loads(trace._serialize_for_mimebundle()) for trace in traces],
        ensure_ascii=False,
    )


def _get_query_string_for_traces(traces: list["Trace"]):
    query_params = []

    for trace in traces:
        query_params.append(("trace_id", trace.info.request_id))
        query_params.append(("experiment_id", trace.info.experiment_id))

    return urlencode(query_params)


def _is_jupyter():
    try:
        from IPython import get_ipython

        return get_ipython() is not None
    except ImportError:
        return False


def is_using_tracking_server():
    return is_http_uri(mlflow.get_tracking_uri())


def is_trace_ui_available():
    # the notebook display feature only works in
    # Databricks notebooks, or in Jupyter notebooks
    # with a tracking server
    return _is_jupyter() and (is_in_databricks_runtime() or is_using_tracking_server())


class IPythonTraceDisplayHandler:
    _instance = None
    disabled = False

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = IPythonTraceDisplayHandler()
        return cls._instance

    @classmethod
    def disable(cls):
        cls.disabled = True

    @classmethod
    def enable(cls):
        cls.disabled = False
        if cls._instance is None:
            cls._instance = IPythonTraceDisplayHandler()

    def __init__(self):
        self.traces_to_display = {}
        if not _is_jupyter():
            return

        try:
            from IPython import get_ipython

            # Register a post-run cell display hook to display traces
            # after the cell has executed. We don't validate that the
            # user is using a tracking server at this step, because
            # the user might set it later using mlflow.set_tracking_uri()
            get_ipython().events.register("post_run_cell", self._display_traces_post_run)
        except Exception:
            # swallow exceptions. this function is called as
            # a side-effect in a few other functions (e.g. log_trace,
            # get_traces, search_traces), and we don't want to block
            # the core functionality if the display fails.
            _logger.debug("Failed to register post-run cell display hook", exc_info=True)

    def _display_traces_post_run(self, result):
        if self.disabled or not is_trace_ui_available():
            self.traces_to_display = {}
            return

        try:
            from IPython.display import display

            MAX_TRACES_TO_DISPLAY = MLFLOW_MAX_TRACES_TO_DISPLAY_IN_NOTEBOOK.get()
            traces_to_display = list(self.traces_to_display.values())[:MAX_TRACES_TO_DISPLAY]
            if len(traces_to_display) == 0:
                self.traces_to_display = {}
                return

            display(self.get_mimebundle(traces_to_display), raw=True)

            # reset state
            self.traces_to_display = {}
        except Exception:
            # swallow exceptions. this function is called as
            # a side-effect in a few other functions (e.g. log_trace,
            # get_traces, search_traces), and we don't want to block
            # the core functionality if the display fails.
            _logger.debug("Failed to display traces", exc_info=True)
            self.traces_to_display = {}

    def get_mimebundle(self, traces: list["Trace"]):
        if len(traces) == 1:
            return traces[0]._repr_mimebundle_()
        else:
            bundle = {"text/plain": repr(traces)}
            if is_in_databricks_runtime():
                bundle["application/databricks.mlflow.trace"] = _serialize_trace_list(traces)
            else:
                bundle["text/html"] = get_notebook_iframe_html(traces)
            return bundle

    def display_traces(self, traces: list["Trace"]):
        if self.disabled or not is_trace_ui_available():
            return

        try:
            if len(traces) == 0:
                return

            traces_dict = {trace.info.request_id: trace for trace in traces}
            self.traces_to_display.update(traces_dict)
        except Exception:
            _logger.debug("Failed to update traces", exc_info=True)
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/tracing/display/__init__.py

```python
from mlflow.tracing.display.display_handler import (
    IPythonTraceDisplayHandler,
    get_notebook_iframe_html,
    is_using_tracking_server,
)

__all__ = [
    "IPythonTraceDisplayHandler",
    "get_display_handler",
    "is_using_tracking_server",
    "get_notebook_iframe_html",
]


def get_display_handler() -> IPythonTraceDisplayHandler:
    return IPythonTraceDisplayHandler.get_instance()


def disable_notebook_display():
    """
    Disables displaying the MLflow Trace UI in notebook output cells.
    Call :py:func:`mlflow.tracing.enable_notebook_display()` to re-enable display.
    """
    IPythonTraceDisplayHandler.disable()


def enable_notebook_display():
    """
    Enables the MLflow Trace UI in notebook output cells. The display is on
    by default, and the Trace UI will show up when any of the following operations
    are executed:

    * On trace completion (i.e. whenever a trace is exported)
    * When calling the :py:func:`mlflow.search_traces` fluent API
    * When calling the :py:meth:`mlflow.client.MlflowClient.get_trace`
      or :py:meth:`mlflow.client.MlflowClient.search_traces` client APIs

    To disable, please call :py:func:`mlflow.tracing.disable_notebook_display()`.
    """
    IPythonTraceDisplayHandler.enable()
```

--------------------------------------------------------------------------------

---[FILE: async_export_queue.py]---
Location: mlflow-master/mlflow/tracing/export/async_export_queue.py

```python
import atexit
import logging
import threading
import time
from concurrent.futures import FIRST_COMPLETED, ThreadPoolExecutor, wait
from dataclasses import dataclass
from queue import Empty, Queue
from queue import Full as queue_Full
from typing import Any, Callable, Sequence

from mlflow.environment_variables import (
    MLFLOW_ASYNC_TRACE_LOGGING_MAX_QUEUE_SIZE,
    MLFLOW_ASYNC_TRACE_LOGGING_MAX_WORKERS,
)

_logger = logging.getLogger(__name__)


@dataclass
class Task:
    """A dataclass to represent a simple task."""

    handler: Callable[..., Any]
    args: Sequence[Any]
    error_msg: str = ""

    def handle(self) -> None:
        """Handle the task execution. This method must not raise any exception."""
        try:
            self.handler(*self.args)
        except Exception as e:
            _logger.warning(
                f"{self.error_msg} Error: {e}.",
                exc_info=_logger.isEnabledFor(logging.DEBUG),
            )


class AsyncTraceExportQueue:
    """A queue-based asynchronous tracing export processor."""

    def __init__(self):
        self._queue: Queue[Task] = Queue(maxsize=MLFLOW_ASYNC_TRACE_LOGGING_MAX_QUEUE_SIZE.get())
        self._lock = threading.RLock()
        self._max_workers = MLFLOW_ASYNC_TRACE_LOGGING_MAX_WORKERS.get()

        # Thread event that indicates the queue should stop processing tasks
        self._stop_event = threading.Event()
        self._is_active = False
        self._active_tasks = set()
        self._last_full_queue_warning_time = None

        atexit.register(self._at_exit_callback)

    def put(self, task: Task):
        """Put a new task to the queue for processing."""
        if not self.is_active():
            self.activate()

        # If stop event is set, wait for the queue to be drained before putting the task
        if self._stop_event.is_set():
            self._stop_event.wait()

        try:
            # Do not block if the queue is full, it will block the main application
            self._queue.put(task, block=False)
        except queue_Full:
            if self._last_full_queue_warning_time is None or (
                time.time() - self._last_full_queue_warning_time > 30
            ):
                _logger.warning(
                    "Trace export queue is full, trace will be discarded. "
                    "Consider increasing the queue size through "
                    "`MLFLOW_ASYNC_TRACE_LOGGING_MAX_QUEUE_SIZE` environment variable or "
                    "number of workers through `MLFLOW_ASYNC_TRACE_LOGGING_MAX_WORKERS`"
                    " environment variable."
                )
                self._last_full_queue_warning_time = time.time()

    def _consumer_loop(self) -> None:
        while not self._stop_event.is_set():
            self._dispatch_task()

        # Drain remaining tasks when stopping
        while not self._queue.empty():
            self._dispatch_task()

    def _dispatch_task(self) -> None:
        """Dispatch a task from the queue to the worker thread pool."""
        # NB: Monitor number of active tasks being processed by the workers. If the all
        #   workers are busy, wait for one of them to finish before draining a new task
        #   from the queue. This is because ThreadPoolExecutor does not have a built-in
        #   mechanism to limit the number of pending tasks in the internal queue.
        #   This ruins the purpose of having a size bound for self._queue, because the
        #   TPE's internal queue can grow indefinitely and potentially run out of memory.
        #   Therefore, we should only dispatch a new task when there is a worker available,
        #   and pend the new tasks in the self._queue which has a size bound.
        if len(self._active_tasks) >= self._max_workers:
            _, self._active_tasks = wait(self._active_tasks, return_when=FIRST_COMPLETED)

        try:
            task = self._queue.get(timeout=1)
        except Empty:
            return

        def _handle(task):
            task.handle()
            self._queue.task_done()

        try:
            future = self._worker_threadpool.submit(_handle, task)
            self._active_tasks.add(future)
        except Exception as e:
            # In case it fails to submit the task to the worker thread pool
            # such as interpreter shutdown, handle the task in this thread
            _logger.debug(
                f"Failed to submit task to worker thread pool. Error: {e}",
                exc_info=True,
            )
            _handle(task)

    def activate(self) -> None:
        """Activate the async queue to accept and handle incoming tasks."""
        with self._lock:
            if self._is_active:
                return

            self._set_up_threads()
            self._is_active = True

    def is_active(self) -> bool:
        return self._is_active

    def _set_up_threads(self) -> None:
        """Set up the consumer and worker threads."""
        with self._lock:
            self._worker_threadpool = ThreadPoolExecutor(
                max_workers=self._max_workers,
                thread_name_prefix="MlflowTraceLoggingWorker",
            )
            self._consumer_thread = threading.Thread(
                target=self._consumer_loop,
                name="MLflowTraceLoggingConsumer",
                daemon=True,
            )
            self._consumer_thread.start()

    def _at_exit_callback(self) -> None:
        """Callback function executed when the program is exiting."""
        if not self.is_active():
            return

        try:
            _logger.info(
                "Flushing the async trace logging queue before program exit. "
                "This may take a while..."
            )
            self.flush(terminate=True)
        except Exception as e:
            _logger.error(f"Error while finishing trace export requests: {e}")

    def flush(self, terminate=False) -> None:
        """
        Flush the async logging queue.

        Args:
            terminate: If True, shut down the logging threads after flushing.
        """
        if not self.is_active():
            return

        self._stop_event.set()
        self._consumer_thread.join()

        # Wait for all tasks to be processed
        self._queue.join()

        self._worker_threadpool.shutdown(wait=True)
        self._is_active = False
        # Restart threads to listen to incoming requests after flushing, if not terminating
        if not terminate:
            self._stop_event.clear()
            self.activate()
```

--------------------------------------------------------------------------------

---[FILE: inference_table.py]---
Location: mlflow-master/mlflow/tracing/export/inference_table.py

```python
import logging
from typing import Any, Sequence

from cachetools import TTLCache
from opentelemetry.sdk.trace import ReadableSpan
from opentelemetry.sdk.trace.export import SpanExporter

from mlflow.entities.model_registry import PromptVersion
from mlflow.entities.trace import Trace
from mlflow.environment_variables import (
    MLFLOW_EXPERIMENT_ID,
    MLFLOW_TRACE_BUFFER_MAX_SIZE,
    MLFLOW_TRACE_BUFFER_TTL_SECONDS,
)
from mlflow.tracing.client import TracingClient
from mlflow.tracing.export.async_export_queue import AsyncTraceExportQueue, Task
from mlflow.tracing.export.utils import try_link_prompts_to_trace
from mlflow.tracing.fluent import _set_last_active_trace_id
from mlflow.tracing.trace_manager import InMemoryTraceManager
from mlflow.tracing.utils import add_size_stats_to_trace_metadata

_logger = logging.getLogger(__name__)


def pop_trace(request_id: str) -> dict[str, Any] | None:
    """
    Pop the completed trace data from the buffer. This method is used in
    the Databricks model serving so please be careful when modifying it.
    """
    return _TRACE_BUFFER.pop(request_id, None)


# For Inference Table, we use special TTLCache to store the finished traces
# so that they can be retrieved by Databricks model serving. The values
# in the buffer are not Trace dataclass, but rather a dictionary with the schema
# that is used within Databricks model serving.
def _initialize_trace_buffer():  # Define as a function for testing purposes
    return TTLCache(
        maxsize=MLFLOW_TRACE_BUFFER_MAX_SIZE.get(),
        ttl=MLFLOW_TRACE_BUFFER_TTL_SECONDS.get(),
    )


_TRACE_BUFFER = _initialize_trace_buffer()


class InferenceTableSpanExporter(SpanExporter):
    """
    An exporter implementation that logs the traces to Inference Table.

    Currently the Inference Table does not use collector to receive the traces,
    but rather actively fetches the trace during the prediction process. In the
    future, we may consider using collector-based approach and this exporter should
    send the traces instead of storing them in the buffer.
    """

    def __init__(self):
        self._trace_manager = InMemoryTraceManager.get_instance()
        if MLFLOW_EXPERIMENT_ID.get():
            self._client = TracingClient("databricks")
            self._async_queue = AsyncTraceExportQueue()

    def export(self, spans: Sequence[ReadableSpan]):
        """
        Export the spans to Inference Table via the TTLCache buffer.

        Args:
            spans: A sequence of OpenTelemetry ReadableSpan objects passed from
                a span processor. Only root spans for each trace should be exported.
        """
        for span in spans:
            if span._parent is not None:
                _logger.debug("Received a non-root span. Skipping export.")
                continue

            manager_trace = self._trace_manager.pop_trace(span.context.trace_id)
            if manager_trace is None:
                _logger.debug(f"Trace for span {span} not found. Skipping export.")
                continue

            trace = manager_trace.trace
            _set_last_active_trace_id(trace.info.trace_id)

            # Add the trace to the in-memory buffer so it can be retrieved by upstream
            # The key is Databricks request ID.
            _TRACE_BUFFER[trace.info.client_request_id] = trace.to_dict()

            # Export to MLflow backend if experiment ID is set
            if MLFLOW_EXPERIMENT_ID.get():
                if trace.info.experiment_id is None:
                    _logger.debug(
                        f"{MLFLOW_EXPERIMENT_ID.name} is set, but trace {trace.info.trace_id} "
                        "has no experiment ID. Skipping export."
                    )
                    continue

                try:
                    # Log the trace to the MLflow backend asynchronously
                    self._async_queue.put(
                        task=Task(
                            handler=self._log_trace_to_mlflow_backend,
                            args=(trace, manager_trace.prompts),
                            error_msg=f"Failed to log trace {trace.info.trace_id}.",
                        )
                    )
                except Exception as e:
                    _logger.warning(
                        f"Failed to export trace to MLflow backend. Error: {e}",
                        stack_info=_logger.isEnabledFor(logging.DEBUG),
                    )

    def _log_trace_to_mlflow_backend(self, trace: Trace, prompts: Sequence[PromptVersion]):
        add_size_stats_to_trace_metadata(trace)

        returned_trace_info = self._client.start_trace(trace.info)
        self._client._upload_trace_data(returned_trace_info, trace.data)

        # Link prompt versions to the trace. Prompt linking is not critical for trace export
        # (if the prompt fails to link, the user's workflow is minorly affected), so we handle
        # errors gracefully without failing the entire trace export
        try_link_prompts_to_trace(
            client=self._client,
            trace_id=returned_trace_info.trace_id,
            prompts=prompts,
            synchronous=True,  # Run synchronously since we're already in an async task
        )
        _logger.debug(
            f"Finished logging trace to MLflow backend. TraceInfo: {returned_trace_info.to_dict()} "
        )
```

--------------------------------------------------------------------------------

---[FILE: mlflow_v3.py]---
Location: mlflow-master/mlflow/tracing/export/mlflow_v3.py

```python
import logging
from collections import defaultdict
from typing import Sequence

from opentelemetry.sdk.trace import ReadableSpan
from opentelemetry.sdk.trace.export import SpanExporter

from mlflow.entities.model_registry import PromptVersion
from mlflow.entities.span import Span
from mlflow.entities.trace import Trace
from mlflow.entities.trace_info import TraceInfo
from mlflow.environment_variables import MLFLOW_ENABLE_ASYNC_TRACE_LOGGING
from mlflow.exceptions import RestException
from mlflow.tracing.client import TracingClient
from mlflow.tracing.constant import SpansLocation, TraceTagKey
from mlflow.tracing.display import get_display_handler
from mlflow.tracing.export.async_export_queue import AsyncTraceExportQueue, Task
from mlflow.tracing.export.utils import try_link_prompts_to_trace
from mlflow.tracing.fluent import _EVAL_REQUEST_ID_TO_TRACE_ID, _set_last_active_trace_id
from mlflow.tracing.trace_manager import InMemoryTraceManager
from mlflow.tracing.utils import (
    add_size_stats_to_trace_metadata,
    encode_span_id,
    get_experiment_id_for_trace,
    maybe_get_request_id,
)
from mlflow.utils.databricks_utils import is_in_databricks_notebook
from mlflow.utils.uri import is_databricks_uri

_logger = logging.getLogger(__name__)


class MlflowV3SpanExporter(SpanExporter):
    """
    An exporter implementation that logs the traces to MLflow Tracking Server
    using the V3 trace schema and API.
    """

    def __init__(self, tracking_uri: str | None = None) -> None:
        self._client = TracingClient(tracking_uri)
        self._is_async_enabled = self._should_enable_async_logging()
        if self._is_async_enabled:
            self._async_queue = AsyncTraceExportQueue()

        # Display handler is no-op when running outside of notebooks.
        self._display_handler = get_display_handler()

        # A flag to cache the failure of exporting spans so that the client will not try to export
        # spans again and trigger excessive server side errors. Default to True (optimistically
        # assume the store supports span-level logging).
        self._should_export_spans_incrementally = True

    def export(self, spans: Sequence[ReadableSpan]) -> None:
        """
        Export the spans to the destination.

        Args:
            spans: A sequence of OpenTelemetry ReadableSpan objects passed from
                a span processor. All spans (root and non-root) are exported.
        """
        if self._should_export_spans_incrementally:
            self._export_spans_incrementally(spans)

        self._export_traces(spans)

    def _export_spans_incrementally(self, spans: Sequence[ReadableSpan]) -> None:
        """
        Export spans incrementally as they complete.

        Args:
            spans: Sequence of ReadableSpan objects to export.
            manager: The trace manager instance.
        """
        if is_databricks_uri(self._client.tracking_uri):
            _logger.debug(
                "Databricks tracking server only supports logging spans to UC table, "
                "skipping span exporting."
            )
            return

        mlflow_spans_by_experiment = self._collect_mlflow_spans_for_export(spans)
        for experiment_id, spans_to_log in mlflow_spans_by_experiment.items():
            if self._should_log_async():
                self._async_queue.put(
                    task=Task(
                        handler=self._log_spans,
                        args=(experiment_id, spans_to_log),
                        error_msg="Failed to log spans to the trace server.",
                    )
                )
            else:
                self._log_spans(experiment_id, spans_to_log)

    def _collect_mlflow_spans_for_export(
        self, spans: Sequence[ReadableSpan]
    ) -> dict[str, list[Span]]:
        """
        Collect MLflow spans from ReadableSpans for export, grouped by experiment ID.

        Args:
            spans: Sequence of ReadableSpan objects.

        Returns:
            Dictionary mapping experiment_id to list of MLflow Span objects.
        """
        manager = InMemoryTraceManager.get_instance()
        spans_by_experiment = defaultdict(list)

        for span in spans:
            mlflow_trace_id = manager.get_mlflow_trace_id_from_otel_id(span.context.trace_id)
            experiment_id = get_experiment_id_for_trace(span)
            span_id = encode_span_id(span.context.span_id)
            # we need to fetch the mlflow span from the trace manager because the span
            # may be updated in processor before exporting (e.g. deduplication).
            if mlflow_span := manager.get_span_from_id(mlflow_trace_id, span_id):
                spans_by_experiment[experiment_id].append(mlflow_span)

        return spans_by_experiment

    def _export_traces(self, spans: Sequence[ReadableSpan]) -> None:
        """
        Export full traces for root spans.

        Args:
            spans: Sequence of ReadableSpan objects.
        """
        manager = InMemoryTraceManager.get_instance()
        for span in spans:
            if span._parent is not None:
                continue

            manager_trace = manager.pop_trace(span.context.trace_id)
            if manager_trace is None:
                _logger.debug(f"Trace for root span {span} not found. Skipping full export.")
                continue

            trace = manager_trace.trace
            _set_last_active_trace_id(trace.info.request_id)

            # Store mapping from eval request ID to trace ID so that the evaluation
            # harness can access to the trace using mlflow.get_trace(eval_request_id)
            if eval_request_id := trace.info.tags.get(TraceTagKey.EVAL_REQUEST_ID):
                _EVAL_REQUEST_ID_TO_TRACE_ID[eval_request_id] = trace.info.trace_id

            if not maybe_get_request_id(is_evaluate=True):
                self._display_handler.display_traces([trace])

            if self._should_log_async():
                self._async_queue.put(
                    task=Task(
                        handler=self._log_trace,
                        args=(trace, manager_trace.prompts),
                        error_msg="Failed to log trace to the trace server.",
                    )
                )
            else:
                self._log_trace(trace, prompts=manager_trace.prompts)

    def _log_spans(self, experiment_id: str, spans: list[Span]) -> None:
        """
        Helper method to log spans with error handling.

        Args:
            experiment_id: The experiment ID to log spans to.
            spans: List of spans to log.
        """
        try:
            self._client.log_spans(experiment_id, spans)
        except NotImplementedError:
            # Silently skip if the store doesn't support log_spans. This is expected for stores that
            # don't implement span-level logging, and we don't want to spam warnings for every span.
            self._should_export_spans_incrementally = False
        except RestException as e:
            # When the FileStore is behind the tracking server, it returns 501 exception.
            # However, the OTLP endpoint returns general HTTP error, not MlflowException, which does
            # not include error_code in the body and handled as a general server side error. Hence,
            # we need to check the message to handle this case.
            if "REST OTLP span logging is not supported" in e.message:
                self._should_export_spans_incrementally = False
            else:
                _logger.debug(f"Failed to log span to MLflow backend: {e}")
        except Exception as e:
            _logger.debug(f"Failed to log span to MLflow backend: {e}")

    def _log_trace(self, trace: Trace, prompts: Sequence[PromptVersion]) -> None:
        """
        Handles exporting a trace to MLflow using the V3 API and blob storage.
        Steps:
        1. Create the trace in MLflow
        2. Upload the trace data to blob storage using the returned trace info.
        """
        try:
            if trace:
                add_size_stats_to_trace_metadata(trace)
                returned_trace_info = self._client.start_trace(trace.info)
                if self._should_log_spans_to_artifacts(returned_trace_info):
                    self._client._upload_trace_data(returned_trace_info, trace.data)
            else:
                _logger.warning("No trace or trace info provided, unable to export")
        except Exception as e:
            _logger.warning(f"Failed to send trace to MLflow backend: {e}")

        try:
            # Always run prompt linking asynchronously since (1) prompt linking API calls
            # would otherwise add latency to the export procedure and (2) prompt linking is not
            # critical for trace export (if the prompt fails to link, the user's workflow is
            # minorly affected), so we don't have to await successful linking
            try_link_prompts_to_trace(
                client=self._client,
                trace_id=trace.info.trace_id,
                prompts=prompts,
                synchronous=False,
            )
        except Exception as e:
            _logger.warning(f"Failed to link prompts to trace: {e}")

    def _should_enable_async_logging(self) -> bool:
        if (
            is_in_databricks_notebook()
            # NB: Not defaulting OSS backend to async logging for now to reduce blast radius.
            or not is_databricks_uri(self._client.tracking_uri)
        ):
            # NB: We don't turn on async logging in Databricks notebook by default
            # until we are confident that the async logging is working on the
            # offline workload on Databricks, to derisk the inclusion to the
            # standard image. When it is enabled explicitly via the env var, we
            # will respect that.
            return (
                MLFLOW_ENABLE_ASYNC_TRACE_LOGGING.get()
                if MLFLOW_ENABLE_ASYNC_TRACE_LOGGING.is_set()
                else False
            )

        return MLFLOW_ENABLE_ASYNC_TRACE_LOGGING.get()

    def _should_log_async(self) -> bool:
        # During evaluate, the eval harness relies on the generated trace objects,
        # so we should not log traces asynchronously.
        if maybe_get_request_id(is_evaluate=True):
            return False

        return self._is_async_enabled

    def _should_log_spans_to_artifacts(self, trace_info: TraceInfo) -> bool:
        """
        Whether to log spans to artifacts. Overridden by UC table exporter to False.
        """
        # We only log traces to artifacts when the tracking store doesn't support span logging
        return trace_info.tags.get(TraceTagKey.SPANS_LOCATION) != SpansLocation.TRACKING_STORE.value
```

--------------------------------------------------------------------------------

---[FILE: span_batcher.py]---
Location: mlflow-master/mlflow/tracing/export/span_batcher.py

```python
import atexit
import logging
import threading
from collections import defaultdict
from queue import Queue
from typing import Callable

from mlflow.entities.span import Span
from mlflow.environment_variables import (
    MLFLOW_ASYNC_TRACE_LOGGING_MAX_INTERVAL_MILLIS,
    MLFLOW_ASYNC_TRACE_LOGGING_MAX_SPAN_BATCH_SIZE,
)
from mlflow.tracing.export.async_export_queue import AsyncTraceExportQueue, Task

_logger = logging.getLogger(__name__)


class SpanBatcher:
    """
    Queue based batching processor for span export to Databricks Unity Catalog table.

    Exposes two configuration knobs
    - Max span batch size: The maximum number of spans to export in a single batch.
    - Max interval: The maximum interval in milliseconds between two batches.
    When one of two conditions is met, the batch is exported.
    """

    def __init__(
        self, async_task_queue: AsyncTraceExportQueue, log_spans_func: Callable[[list[Span]], None]
    ):
        self._max_span_batch_size = MLFLOW_ASYNC_TRACE_LOGGING_MAX_SPAN_BATCH_SIZE.get()
        self._max_interval_ms = MLFLOW_ASYNC_TRACE_LOGGING_MAX_INTERVAL_MILLIS.get()

        self._span_queue = Queue()
        self._async_task_handler = async_task_queue
        self._log_spans_func = log_spans_func
        self._lock = threading.RLock()
        self._stop_event = threading.Event()

        # Batch size = 1 means no batching, so we don't need to setup the worker thread.
        if self._max_span_batch_size >= 1:
            self._worker = threading.Thread(
                name="MLflowSpanBatcherWorker",
                daemon=True,
                target=self._worker_loop,
            )
            self._worker_awaken = threading.Event()
            self._worker.start()
            atexit.register(self.shutdown)

        _logger.debug(
            "Async trace logging is configured with batch size "
            f"{self._max_span_batch_size} and max interval {self._max_interval_ms}ms"
        )

    def add_span(self, location: str, span: Span):
        if self._max_span_batch_size <= 1:
            self._export(location, [span])
            return

        if self._stop_event.is_set():
            return

        self._span_queue.put((location, span))
        if self._span_queue.qsize() >= self._max_span_batch_size:
            # Trigger the immediate export when the batch is full
            self._worker_awaken.set()

    def _worker_loop(self):
        while not self._stop_event.is_set():
            # sleep_interrupted is True when the export is triggered by the batch size limit.
            # If this is False, the interval has expired so we should export the current batch
            # even if the batch size is not reached.
            sleep_interrupted = self._worker_awaken.wait(self._max_interval_ms / 1000)
            if self._stop_event.is_set():
                break
            self._consume_batch(flush_all=not sleep_interrupted)
            self._worker_awaken.clear()

        self._consume_batch(flush_all=True)

    def _consume_batch(self, flush_all: bool = False):
        with self._lock:
            while (
                self._span_queue.qsize() >= self._max_span_batch_size
                # Export all remaining spans in the queue if necessary
                or (flush_all and not self._span_queue.empty())
            ):
                # Spans in the queue can have multiple locations. Since the backend API only support
                # logging spans to a single location, we need to group spans by location and export
                # them separately.
                location_to_spans = defaultdict(list)
                for location, span in [
                    self._span_queue.get()
                    for _ in range(min(self._max_span_batch_size, self._span_queue.qsize()))
                ]:
                    location_to_spans[location].append(span)

                for location, spans in location_to_spans.items():
                    self._export(location, spans)

    def _export(self, location: str, spans: list[Span]):
        _logger.debug(f"Exporting a span batch with {len(spans)} spans to {location}")

        self._async_task_handler.put(
            Task(
                handler=self._log_spans_func,
                args=(location, spans),
                error_msg="Failed to export batch of spans.",
            )
        )

    def shutdown(self):
        if self._stop_event.is_set():
            return

        try:
            self._stop_event.set()
            self._worker_awaken.set()
            self._worker.join()
        except Exception as e:
            _logger.debug(f"Error while shutting down span batcher: {e}")
```

--------------------------------------------------------------------------------

---[FILE: uc_table.py]---
Location: mlflow-master/mlflow/tracing/export/uc_table.py

```python
import logging
from typing import Sequence

from opentelemetry.sdk.trace import ReadableSpan

from mlflow.entities.span import Span
from mlflow.entities.trace_info import TraceInfo
from mlflow.environment_variables import MLFLOW_ENABLE_ASYNC_TRACE_LOGGING
from mlflow.tracing.export.mlflow_v3 import MlflowV3SpanExporter
from mlflow.tracing.export.span_batcher import SpanBatcher
from mlflow.tracing.utils import get_active_spans_table_name

_logger = logging.getLogger(__name__)


class DatabricksUCTableSpanExporter(MlflowV3SpanExporter):
    """
    An exporter implementation that logs the traces to Databricks Unity Catalog table.
    """

    def __init__(self, tracking_uri: str | None = None) -> None:
        super().__init__(tracking_uri)

        # Track if we've raised an error for span export to avoid raising it multiple times.
        self._has_raised_span_export_error = False

        if hasattr(self, "_async_queue"):
            self._span_batcher = SpanBatcher(
                async_task_queue=self._async_queue,
                log_spans_func=self._log_spans,
            )

    def _export_spans_incrementally(self, spans: Sequence[ReadableSpan]) -> None:
        """
        Export spans incrementally as they complete.

        Args:
            spans: Sequence of ReadableSpan objects to export.
        """
        location = get_active_spans_table_name()

        if not location:
            # this should not happen since this exporter is only used when a destination
            # is set to UCSchemaLocation
            _logger.debug("No active spans table name found. Skipping span export.")
            return

        # Wrapping with MLflow span interface for easier downstream handling
        spans = [Span(span) for span in spans]
        if self._should_log_async():
            for span in spans:
                self._span_batcher.add_span(location=location, span=span)
        else:
            self._log_spans(location, spans)

    def _log_spans(self, location: str, spans: list[Span]) -> None:
        try:
            self._client.log_spans(location, spans)
        except Exception as e:
            if self._has_raised_span_export_error:
                _logger.debug(f"Failed to log spans to the trace server: {e}", exc_info=True)
            else:
                _logger.warning(f"Failed to log spans to the trace server: {e}")
                self._has_raised_span_export_error = True

    def _should_enable_async_logging(self) -> bool:
        return MLFLOW_ENABLE_ASYNC_TRACE_LOGGING.get()

    # Override this to False since spans are logged to UC table instead of artifacts.
    def _should_log_spans_to_artifacts(self, trace_info: TraceInfo) -> bool:
        return False

    def flush(self) -> None:
        self._span_batcher.shutdown()
        self._async_queue.flush(terminate=True)
```

--------------------------------------------------------------------------------

````
