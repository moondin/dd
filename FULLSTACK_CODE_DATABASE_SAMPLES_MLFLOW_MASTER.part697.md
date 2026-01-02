---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 697
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 697 of 991)

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

---[FILE: system_metrics_monitor.py]---
Location: mlflow-master/mlflow/system_metrics/system_metrics_monitor.py

```python
"""Class for monitoring system stats."""

import logging
import threading

from mlflow.environment_variables import (
    MLFLOW_SYSTEM_METRICS_NODE_ID,
    MLFLOW_SYSTEM_METRICS_SAMPLES_BEFORE_LOGGING,
    MLFLOW_SYSTEM_METRICS_SAMPLING_INTERVAL,
)
from mlflow.exceptions import MlflowException
from mlflow.system_metrics.metrics.base_metrics_monitor import BaseMetricsMonitor
from mlflow.system_metrics.metrics.cpu_monitor import CPUMonitor
from mlflow.system_metrics.metrics.disk_monitor import DiskMonitor
from mlflow.system_metrics.metrics.gpu_monitor import GPUMonitor
from mlflow.system_metrics.metrics.network_monitor import NetworkMonitor
from mlflow.system_metrics.metrics.rocm_monitor import ROCMMonitor

_logger = logging.getLogger(__name__)


class SystemMetricsMonitor:
    """Class for monitoring system stats.

    This class is used for pulling system metrics and logging them to MLflow. Calling `start()` will
    spawn a thread that logs system metrics periodically. Calling `finish()` will stop the thread.
    Logging is done on a different frequency from pulling metrics, so that the metrics are
    aggregated over the period. Users can change the logging frequency by setting
    `MLFLOW_SYSTEM_METRICS_SAMPLING_INTERVAL` and `MLFLOW_SYSTEM_METRICS_SAMPLES_BEFORE_LOGGING`
    environment variables, e.g., run `export MLFLOW_SYSTEM_METRICS_SAMPLING_INTERVAL=10` in terminal
    will set the sampling interval to 10 seconds.

    System metrics are logged with a prefix "system/", e.g., "system/cpu_utilization_percentage".

    Args:
        run_id: string, the MLflow run ID.
        sampling_interval: float, default to 10. The interval (in seconds) at which to pull system
            metrics. Will be overridden by `MLFLOW_SYSTEM_METRICS_SAMPLING_INTERVAL` environment
            variable.
        samples_before_logging: int, default to 1. The number of samples to aggregate before
            logging. Will be overridden by `MLFLOW_SYSTEM_METRICS_SAMPLES_BEFORE_LOGGING`
            evnironment variable.
        resume_logging: bool, default to False. If True, we will resume the system metrics logging
            from the `run_id`, and the first step to log will be the last step of `run_id` + 1, if
            False, system metrics logging will start from step 0.
        node_id: string, default to None. The node ID of the machine where the metrics are
            collected. Will be overridden by `MLFLOW_SYSTEM_METRICS_NODE_ID`
            evnironment variable. This is useful in multi-node training to distinguish the metrics
            from different nodes. For example, if you set node_id to "node_0", the system metrics
            getting logged will be of format "system/node_0/cpu_utilization_percentage".
        tracking_uri: string, default to None. The tracking URI of the MLflow server, or `None` to
            use whatever is set via `mlflow.set_tracking_uri()`.
    """

    def __init__(
        self,
        run_id,
        sampling_interval=10,
        samples_before_logging=1,
        resume_logging=False,
        node_id=None,
        tracking_uri=None,
    ):
        from mlflow.tracking import get_tracking_uri
        from mlflow.utils.autologging_utils import BatchMetricsLogger

        # Instantiate default monitors.
        self.monitors = [CPUMonitor(), DiskMonitor(), NetworkMonitor()]

        if gpu_monitor := self._initialize_gpu_monitor():
            self.monitors.append(gpu_monitor)

        self.sampling_interval = MLFLOW_SYSTEM_METRICS_SAMPLING_INTERVAL.get() or sampling_interval
        self.samples_before_logging = (
            MLFLOW_SYSTEM_METRICS_SAMPLES_BEFORE_LOGGING.get() or samples_before_logging
        )

        self._run_id = run_id
        self._shutdown_event = threading.Event()
        self._process = None
        self._metrics_prefix = "system/"
        self.node_id = MLFLOW_SYSTEM_METRICS_NODE_ID.get() or node_id
        self._tracking_uri = tracking_uri or get_tracking_uri()
        self._logging_step = self._get_next_logging_step(run_id) if resume_logging else 0
        self.mlflow_logger = BatchMetricsLogger(self._run_id, tracking_uri=self._tracking_uri)

    def _get_next_logging_step(self, run_id):
        from mlflow.tracking.client import MlflowClient

        client = MlflowClient(self._tracking_uri)
        try:
            run = client.get_run(run_id)
        except MlflowException:
            return 0
        system_metric_name = None
        for metric_name in run.data.metrics.keys():
            if metric_name.startswith(self._metrics_prefix):
                system_metric_name = metric_name
                break
        if system_metric_name is None:
            return 0
        metric_history = client.get_metric_history(run_id, system_metric_name)
        return metric_history[-1].step + 1

    def start(self):
        """Start monitoring system metrics."""
        try:
            self._process = threading.Thread(
                target=self.monitor,
                daemon=True,
                name="SystemMetricsMonitor",
            )
            self._process.start()
            _logger.info("Started monitoring system metrics.")
        except Exception as e:
            _logger.warning(f"Failed to start monitoring system metrics: {e}")
            self._process = None

    def monitor(self):
        """Main monitoring loop, which consistently collect and log system metrics."""
        from mlflow.tracking.client import MlflowClient

        while not self._shutdown_event.is_set():
            for _ in range(self.samples_before_logging):
                self.collect_metrics()
                self._shutdown_event.wait(self.sampling_interval)
                try:
                    # Get the MLflow run to check if the run is not RUNNING.
                    run = MlflowClient(self._tracking_uri).get_run(self._run_id)
                except Exception as e:
                    _logger.warning(f"Failed to get mlflow run: {e}.")
                    return
                if run.info.status != "RUNNING" or self._shutdown_event.is_set():
                    # If the mlflow run is terminated or receives the shutdown signal, stop
                    # monitoring.
                    return
            metrics = self.aggregate_metrics()
            try:
                self.publish_metrics(metrics)
            except Exception as e:
                _logger.warning(
                    f"Failed to log system metrics: {e}, this is expected if the experiment/run is "
                    "already terminated."
                )
                return

    def collect_metrics(self):
        """Collect system metrics."""
        metrics = {}
        for monitor in self.monitors:
            monitor.collect_metrics()
            metrics.update(monitor._metrics)
        return metrics

    def aggregate_metrics(self):
        """Aggregate collected metrics."""
        metrics = {}
        for monitor in self.monitors:
            metrics.update(monitor.aggregate_metrics())
        return metrics

    def publish_metrics(self, metrics):
        """Log collected metrics to MLflow."""
        # Add prefix "system/" to the metrics name for grouping. If `self.node_id` is not None, also
        # add it to the metrics name.
        prefix = self._metrics_prefix + (self.node_id + "/" if self.node_id else "")
        metrics = {prefix + k: v for k, v in metrics.items()}

        self.mlflow_logger.record_metrics(metrics, self._logging_step)
        self._logging_step += 1
        for monitor in self.monitors:
            monitor.clear_metrics()

    def finish(self):
        """Stop monitoring system metrics."""
        if self._process is None:
            return
        _logger.info("Stopping system metrics monitoring...")
        self._shutdown_event.set()
        try:
            self._process.join()
            self.mlflow_logger.flush()
            _logger.info("Successfully terminated system metrics monitoring!")
        except Exception as e:
            _logger.error(f"Error terminating system metrics monitoring process: {e}.")
        self._process = None

    def _initialize_gpu_monitor(self) -> BaseMetricsMonitor | None:
        # NVIDIA GPU
        try:
            return GPUMonitor()
        except Exception:
            _logger.debug("Failed to initialize GPU monitor for NVIDIA GPU.", exc_info=True)

        # Falling back to pyrocml (AMD/HIP GPU)
        try:
            return ROCMMonitor()
        except Exception:
            _logger.debug("Failed to initialize GPU monitor for AMD/HIP GPU.", exc_info=True)

        _logger.info("Skip logging GPU metrics. Set logger level to DEBUG for more details.")
        return None
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/system_metrics/__init__.py

```python
"""System metrics logging module."""

from mlflow.environment_variables import (
    MLFLOW_ENABLE_SYSTEM_METRICS_LOGGING,
    MLFLOW_SYSTEM_METRICS_NODE_ID,
    MLFLOW_SYSTEM_METRICS_SAMPLES_BEFORE_LOGGING,
    MLFLOW_SYSTEM_METRICS_SAMPLING_INTERVAL,
)


def disable_system_metrics_logging():
    """Disable system metrics logging globally.

    Calling this function will disable system metrics logging globally, but users can still opt in
    system metrics logging for individual runs by `mlflow.start_run(log_system_metrics=True)`.
    """
    MLFLOW_ENABLE_SYSTEM_METRICS_LOGGING.set(False)


def enable_system_metrics_logging():
    """Enable system metrics logging globally.

    Calling this function will enable system metrics logging globally, but users can still opt out
    system metrics logging for individual runs by `mlflow.start_run(log_system_metrics=False)`.
    """
    MLFLOW_ENABLE_SYSTEM_METRICS_LOGGING.set(True)


def set_system_metrics_sampling_interval(interval):
    """Set the system metrics sampling interval.

    Every `interval` seconds, the system metrics will be collected. By default `interval=10`.
    """
    if interval is None:
        MLFLOW_SYSTEM_METRICS_SAMPLING_INTERVAL.unset()
    else:
        MLFLOW_SYSTEM_METRICS_SAMPLING_INTERVAL.set(interval)


def set_system_metrics_samples_before_logging(samples):
    """Set the number of samples before logging system metrics.

    Every time `samples` samples have been collected, the system metrics will be logged to mlflow.
    By default `samples=1`.
    """
    if samples is None:
        MLFLOW_SYSTEM_METRICS_SAMPLES_BEFORE_LOGGING.unset()
    else:
        MLFLOW_SYSTEM_METRICS_SAMPLES_BEFORE_LOGGING.set(samples)


def set_system_metrics_node_id(node_id):
    """Set the system metrics node id.

    node_id is the identifier of the machine where the metrics are collected. This is useful in
    multi-node (distributed training) setup.
    """
    if node_id is None:
        MLFLOW_SYSTEM_METRICS_NODE_ID.unset()
    else:
        MLFLOW_SYSTEM_METRICS_NODE_ID.set(node_id)
```

--------------------------------------------------------------------------------

---[FILE: base_metrics_monitor.py]---
Location: mlflow-master/mlflow/system_metrics/metrics/base_metrics_monitor.py

```python
"""Base class of system metrics monitor."""

import abc
from collections import defaultdict


class BaseMetricsMonitor(abc.ABC):
    """Base class of system metrics monitor."""

    def __init__(self):
        self._metrics = defaultdict(list)

    @abc.abstractmethod
    def collect_metrics(self):
        """Method to collect metrics.

        Subclass should implement this method to collect metrics and store in `self._metrics`.
        """

    @abc.abstractmethod
    def aggregate_metrics(self):
        """Method to aggregate metrics.

        Subclass should implement this method to aggregate the metrics and return it in a dict.
        """

    @property
    def metrics(self):
        return self._metrics

    def clear_metrics(self):
        self._metrics.clear()
```

--------------------------------------------------------------------------------

---[FILE: cpu_monitor.py]---
Location: mlflow-master/mlflow/system_metrics/metrics/cpu_monitor.py

```python
"""Class for monitoring CPU stats."""

import psutil

from mlflow.system_metrics.metrics.base_metrics_monitor import BaseMetricsMonitor


class CPUMonitor(BaseMetricsMonitor):
    """Class for monitoring CPU stats."""

    def collect_metrics(self):
        # Get CPU metrics.
        cpu_percent = psutil.cpu_percent()
        self._metrics["cpu_utilization_percentage"].append(cpu_percent)

        system_memory = psutil.virtual_memory()
        self._metrics["system_memory_usage_megabytes"].append(system_memory.used / 1e6)
        self._metrics["system_memory_usage_percentage"].append(
            system_memory.used / system_memory.total * 100
        )

    def aggregate_metrics(self):
        return {k: round(sum(v) / len(v), 1) for k, v in self._metrics.items()}
```

--------------------------------------------------------------------------------

---[FILE: disk_monitor.py]---
Location: mlflow-master/mlflow/system_metrics/metrics/disk_monitor.py

```python
"""Class for monitoring disk stats."""

import os

import psutil

from mlflow.system_metrics.metrics.base_metrics_monitor import BaseMetricsMonitor


class DiskMonitor(BaseMetricsMonitor):
    """Class for monitoring disk stats."""

    def collect_metrics(self):
        # Get disk usage metrics.
        disk_usage = psutil.disk_usage(os.sep)
        self._metrics["disk_usage_percentage"].append(disk_usage.percent)
        self._metrics["disk_usage_megabytes"].append(disk_usage.used / 1e6)
        self._metrics["disk_available_megabytes"].append(disk_usage.free / 1e6)

    def aggregate_metrics(self):
        return {k: round(sum(v) / len(v), 1) for k, v in self._metrics.items()}
```

--------------------------------------------------------------------------------

---[FILE: gpu_monitor.py]---
Location: mlflow-master/mlflow/system_metrics/metrics/gpu_monitor.py

```python
"""Class for monitoring GPU stats."""

import logging
import sys

from mlflow.system_metrics.metrics.base_metrics_monitor import BaseMetricsMonitor

_logger = logging.getLogger(__name__)

try:
    import pynvml
except ImportError:
    # If `pynvml` is not installed, a warning will be logged at monitor instantiation.
    # We don't log a warning here to avoid spamming warning at every import.
    pass


class GPUMonitor(BaseMetricsMonitor):
    """Class for monitoring GPU stats."""

    def __init__(self):
        if "pynvml" not in sys.modules:
            # Only instantiate if `pynvml` is installed.
            raise ImportError(
                "`nvidia-ml-py` is not installed, to log GPU metrics please run "
                "`pip install nvidia-ml-py` to install it."
            )
        try:
            # `nvmlInit()` will fail if no GPU is found.
            pynvml.nvmlInit()
        except pynvml.NVMLError as e:
            raise RuntimeError(f"Failed to initialize NVML, skip logging GPU metrics: {e}")

        super().__init__()
        self.num_gpus = pynvml.nvmlDeviceGetCount()
        self.gpu_handles = [pynvml.nvmlDeviceGetHandleByIndex(i) for i in range(self.num_gpus)]

    def collect_metrics(self):
        # Get GPU metrics.
        for i, handle in enumerate(self.gpu_handles):
            try:
                memory = pynvml.nvmlDeviceGetMemoryInfo(handle)
                self._metrics[f"gpu_{i}_memory_usage_percentage"].append(
                    round(memory.used / memory.total * 100, 1)
                )
                self._metrics[f"gpu_{i}_memory_usage_megabytes"].append(memory.used / 1e6)
            except pynvml.NVMLError as e:
                _logger.warning(f"Encountered error {e} when trying to collect GPU memory metrics.")

            try:
                device_utilization = pynvml.nvmlDeviceGetUtilizationRates(handle)
                self._metrics[f"gpu_{i}_utilization_percentage"].append(device_utilization.gpu)
            except pynvml.NVMLError as e:
                _logger.warning(
                    f"Encountered error {e} when trying to collect GPU utilization metrics."
                )

            try:
                power_milliwatts = pynvml.nvmlDeviceGetPowerUsage(handle)
                power_capacity_milliwatts = pynvml.nvmlDeviceGetEnforcedPowerLimit(handle)
                self._metrics[f"gpu_{i}_power_usage_watts"].append(power_milliwatts / 1000)
                self._metrics[f"gpu_{i}_power_usage_percentage"].append(
                    (power_milliwatts / power_capacity_milliwatts) * 100
                )
            except pynvml.NVMLError as e:
                _logger.warning(
                    f"Encountered error {e} when trying to collect GPU power usage metrics."
                )

    def aggregate_metrics(self):
        return {k: round(sum(v) / len(v), 1) for k, v in self._metrics.items()}
```

--------------------------------------------------------------------------------

---[FILE: network_monitor.py]---
Location: mlflow-master/mlflow/system_metrics/metrics/network_monitor.py

```python
"""Class for monitoring network stats."""

import psutil

from mlflow.system_metrics.metrics.base_metrics_monitor import BaseMetricsMonitor


class NetworkMonitor(BaseMetricsMonitor):
    def __init__(self):
        super().__init__()
        self._set_initial_metrics()

    def _set_initial_metrics(self):
        # Set initial network usage metrics. `psutil.net_io_counters()` counts the stats since the
        # system boot, so to set network usage metrics as 0 when we start logging, we need to keep
        # the initial network usage metrics.
        network_usage = psutil.net_io_counters()
        self._initial_receive_megabytes = network_usage.bytes_recv / 1e6
        self._initial_transmit_megabytes = network_usage.bytes_sent / 1e6

    def collect_metrics(self):
        # Get network usage metrics.
        network_usage = psutil.net_io_counters()
        # Usage metrics will be the diff between current and initial metrics.
        self._metrics["network_receive_megabytes"] = (
            network_usage.bytes_recv / 1e6 - self._initial_receive_megabytes
        )
        self._metrics["network_transmit_megabytes"] = (
            network_usage.bytes_sent / 1e6 - self._initial_transmit_megabytes
        )

    def aggregate_metrics(self):
        # Network metrics don't need to be averaged.
        return dict(self._metrics)
```

--------------------------------------------------------------------------------

---[FILE: rocm_monitor.py]---
Location: mlflow-master/mlflow/system_metrics/metrics/rocm_monitor.py

```python
"""Class for monitoring GPU stats on HIP devices.
Inspired by GPUMonitor, but with the pynvml method
named replaced by pyrsmi method names
"""

import contextlib
import io
import logging
import sys

from mlflow.system_metrics.metrics.base_metrics_monitor import BaseMetricsMonitor

_logger = logging.getLogger(__name__)

is_rocml_available = False
try:
    from pyrsmi import rocml

    is_rocml_available = True
except ImportError:
    # If `pyrsmi` is not installed, a warning will be logged at monitor instantiation.
    # We don't log a warning here to avoid spamming warning at every import.
    pass


class ROCMMonitor(BaseMetricsMonitor):
    """
    Class for monitoring AMD GPU stats. This is
    class has been modified and has been inspired by
    the original GPUMonitor class written by MLflow.
    This class uses the package pyrsmi which is an
    official ROCM python package which tracks and monitor
    AMD GPU's, has been tested on AMD MI250x 128GB GPUs

    For more information see:
    https://github.com/ROCm/pyrsmi

    PyPi package:
    https://pypi.org/project/pyrsmi/


    """

    def __init__(self):
        if "pyrsmi" not in sys.modules:
            # Only instantiate if `pyrsmi` is installed.
            raise ImportError(
                "`pyrsmi` is not installed, to log GPU metrics please run `pip install pyrsmi` "
                "to install it."
            )

        try:
            rocml.smi_initialize()
        except RuntimeError:
            raise RuntimeError("Failed to initialize RSMI, skip logging GPU metrics")

        super().__init__()

        # Check if GPU is virtual. If so, collect power information from physical GPU
        self.physical_idx = []
        for i in range(rocml.smi_get_device_count()):
            try:
                self.raise_error(rocml.smi_get_device_average_power, i)
                # physical GPU if no error is raised
                self.physical_idx.append(i)
            except SystemError:
                # virtual if error is raised
                # all virtual GPUs must share physical GPU with previous virtual/physical GPU
                assert i >= 1
                self.physical_idx.append(self.physical_idx[-1])

    @staticmethod
    def raise_error(func, *args, **kwargs):
        """Raise error if message containing 'error' is printed out to stdout or stderr."""
        stdout = io.StringIO()
        stderr = io.StringIO()

        with contextlib.redirect_stdout(stdout), contextlib.redirect_stderr(stderr):
            func(*args, **kwargs)

        out = stdout.getvalue()
        err = stderr.getvalue()

        # Check if there is an error message in either stdout or stderr
        if "error" in out.lower():
            raise SystemError(out)
        if "error" in err.lower():
            raise SystemError(err)

    def collect_metrics(self):
        # Get GPU metrics.
        self.num_gpus = rocml.smi_get_device_count()

        for i in range(self.num_gpus):
            memory_used = rocml.smi_get_device_memory_used(i)
            memory_total = rocml.smi_get_device_memory_total(i)
            self._metrics[f"gpu_{i}_memory_usage_percentage"].append(
                round(memory_used / memory_total * 100, 1)
            )
            self._metrics[f"gpu_{i}_memory_usage_gigabytes"].append(memory_used / 1e9)

            device_utilization = rocml.smi_get_device_utilization(i)
            self._metrics[f"gpu_{i}_utilization_percentage"].append(device_utilization)

            power_watts = rocml.smi_get_device_average_power(self.physical_idx[i])
            power_capacity_watts = 500  # hard coded for now, should get this from rocm-smi
            self._metrics[f"gpu_{i}_power_usage_watts"].append(power_watts)
            self._metrics[f"gpu_{i}_power_usage_percentage"].append(
                (power_watts / power_capacity_watts) * 100
            )

            # TODO:
            # memory_busy (and other useful metrics) are available in pyrsmi>1.1.0.
            # We are currently on pyrsmi==1.0.1, so these are not available
            # memory_busy  = rocml.smi_get_device_memory_busy(i)
            # self._metrics[f"gpu_{i}_memory_busy_time_percent"].append(memory_busy)

    def aggregate_metrics(self):
        return {k: round(sum(v) / len(v), 1) for k, v in self._metrics.items()}

    def __del__(self):
        if is_rocml_available:
            rocml.smi_shutdown()
```

--------------------------------------------------------------------------------

---[FILE: client.py]---
Location: mlflow-master/mlflow/telemetry/client.py

```python
import atexit
import random
import sys
import threading
import time
import uuid
import warnings
from dataclasses import asdict
from queue import Empty, Full, Queue

import requests

from mlflow.environment_variables import _MLFLOW_TELEMETRY_SESSION_ID
from mlflow.telemetry.constant import (
    BATCH_SIZE,
    BATCH_TIME_INTERVAL_SECONDS,
    MAX_QUEUE_SIZE,
    MAX_WORKERS,
    RETRYABLE_ERRORS,
    UNRECOVERABLE_ERRORS,
)
from mlflow.telemetry.installation_id import get_or_create_installation_id
from mlflow.telemetry.schemas import Record, TelemetryConfig, TelemetryInfo, get_source_sdk
from mlflow.telemetry.utils import _get_config_url, _log_error, is_telemetry_disabled
from mlflow.utils.logging_utils import should_suppress_logs_in_thread, suppress_logs_in_thread


class TelemetryClient:
    def __init__(self):
        self.info = asdict(
            TelemetryInfo(
                session_id=_MLFLOW_TELEMETRY_SESSION_ID.get() or uuid.uuid4().hex,
                installation_id=get_or_create_installation_id(),
            )
        )
        self._queue: Queue[list[Record]] = Queue(maxsize=MAX_QUEUE_SIZE)
        self._lock = threading.RLock()
        self._max_workers = MAX_WORKERS

        self._is_stopped = False
        self._is_active = False
        self._atexit_callback_registered = False

        self._batch_size = BATCH_SIZE
        self._batch_time_interval = BATCH_TIME_INTERVAL_SECONDS
        self._pending_records: list[Record] = []
        self._last_batch_time = time.time()
        self._batch_lock = threading.Lock()

        # consumer threads for sending records
        self._consumer_threads = []
        self._is_config_fetched = False
        self.config = None

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self._clean_up()

    def _fetch_config(self):
        def _fetch():
            try:
                self._get_config()
                if self.config is None:
                    self._is_stopped = True
                    _set_telemetry_client(None)
                self._is_config_fetched = True
            except Exception:
                self._is_stopped = True
                self._is_config_fetched = True
                _set_telemetry_client(None)

        self._config_thread = threading.Thread(
            target=_fetch,
            name="GetTelemetryConfig",
            daemon=True,
        )
        self._config_thread.start()

    def _get_config(self):
        """
        Get the config for the given MLflow version.
        """
        mlflow_version = self.info["mlflow_version"]
        if config_url := _get_config_url(mlflow_version):
            try:
                response = requests.get(config_url, timeout=1)
                if response.status_code != 200:
                    return
                config = response.json()
                if (
                    config.get("mlflow_version") != mlflow_version
                    or config.get("disable_telemetry") is True
                    or config.get("ingestion_url") is None
                ):
                    return

                if get_source_sdk().value in config.get("disable_sdks", []):
                    return

                if sys.platform in config.get("disable_os", []):
                    return

                rollout_percentage = config.get("rollout_percentage", 100)
                if random.randint(0, 100) > rollout_percentage:
                    return

                self.config = TelemetryConfig(
                    ingestion_url=config["ingestion_url"],
                    disable_events=set(config.get("disable_events", [])),
                )
            except Exception as e:
                _log_error(f"Failed to get telemetry config: {e}")
                return

    def add_record(self, record: Record):
        """
        Add a record to be batched and sent to the telemetry server.
        """
        if not self.is_active:
            self.activate()

        if self._is_stopped:
            return

        with self._batch_lock:
            self._pending_records.append(record)

            # Only send if we've reached the batch size;
            # time-based sending is handled by the consumer thread.
            if len(self._pending_records) >= self._batch_size:
                self._send_batch()

    def add_records(self, records: list[Record]):
        if not self.is_active:
            self.activate()

        if self._is_stopped:
            return

        with self._batch_lock:
            # Add records in chunks to ensure we never exceed batch_size
            offset = 0
            while offset < len(records):
                # Calculate how many records we can add to reach batch_size
                space_left = self._batch_size - len(self._pending_records)
                chunk_size = min(space_left, len(records) - offset)

                # Add only enough records to reach batch_size
                self._pending_records.extend(records[offset : offset + chunk_size])
                offset += chunk_size

                # Send batch if we've reached the limit
                if len(self._pending_records) >= self._batch_size:
                    self._send_batch()

    def _send_batch(self):
        """Send the current batch of records."""
        if not self._pending_records:
            return

        self._last_batch_time = time.time()

        try:
            self._queue.put(self._pending_records, block=False)
            self._pending_records = []
        except Full:
            _log_error("Failed to add record to the queue, queue is full")

    def _process_records(self, records: list[Record], request_timeout: float = 1):
        """Process a batch of telemetry records."""
        try:
            self._update_backend_store()
            if self.info["tracking_uri_scheme"] in ["databricks", "databricks-uc", "uc"]:
                self._is_stopped = True
                # set config to None to allow consumer thread drop records in the queue
                self.config = None
                self.is_active = False
                _set_telemetry_client(None)
                return

            records = [
                {
                    "data": self.info | record.to_dict(),
                    # use random uuid as partition key to make sure records are
                    # distributed evenly across shards
                    "partition-key": uuid.uuid4().hex,
                }
                for record in records
            ]
            # changing this value can affect total time for processing records
            # the total time = request_timeout * max_attempts + sleep_time * (max_attempts - 1)
            max_attempts = 3
            sleep_time = 1
            for i in range(max_attempts):
                should_retry = False
                response = None
                try:
                    response = requests.post(
                        self.config.ingestion_url,
                        json={"records": records},
                        headers={"Content-Type": "application/json"},
                        timeout=request_timeout,
                    )
                    should_retry = response.status_code in RETRYABLE_ERRORS
                except (ConnectionError, TimeoutError):
                    should_retry = True
                # NB: DO NOT retry when terminating
                # otherwise this increases shutdown overhead significantly
                if self._is_stopped:
                    return
                if i < max_attempts - 1 and should_retry:
                    # we do not use exponential backoff to avoid increasing
                    # the processing time significantly
                    time.sleep(sleep_time)
                elif response and response.status_code in UNRECOVERABLE_ERRORS:
                    self._is_stopped = True
                    self.is_active = False
                    # this is executed in the consumer thread, so
                    # we cannot join the thread here, but this should
                    # be enough to stop the telemetry collection
                    return
                else:
                    return
        except Exception as e:
            _log_error(f"Failed to send telemetry records: {e}")

    def _consumer(self) -> None:
        """Individual consumer that processes records from the queue."""
        # suppress logs in the consumer thread to avoid emitting any irrelevant
        # logs during telemetry collection.
        should_suppress_logs_in_thread.set(True)

        while not self._is_config_fetched:
            time.sleep(0.1)

        while self.config and not self._is_stopped:
            try:
                records = self._queue.get(timeout=1)
            except Empty:
                # check if batch time interval has passed and send data if needed
                if time.time() - self._last_batch_time >= self._batch_time_interval:
                    self._last_batch_time = time.time()
                    with self._batch_lock:
                        if self._pending_records:
                            self._send_batch()
                continue

            self._process_records(records)
            self._queue.task_done()

        # clear the queue if config is None
        while self.config is None and not self._queue.empty():
            try:
                self._queue.get_nowait()
                self._queue.task_done()
            except Empty:
                break
        # drop remaining records when terminating to avoid
        # causing any overhead

    def activate(self) -> None:
        """Activate the async queue to accept and handle incoming tasks."""
        with self._lock:
            if self.is_active:
                return

            self._set_up_threads()

            # only fetch config when activating to avoid fetching when
            # no records are added
            self._fetch_config()

            # Callback to ensure remaining tasks are processed before program exit
            if not self._atexit_callback_registered:
                # This works in jupyter notebook
                atexit.register(self._at_exit_callback)
                self._atexit_callback_registered = True

            self.is_active = True

    @property
    def is_active(self) -> bool:
        return self._is_active

    @is_active.setter
    def is_active(self, value: bool) -> None:
        self._is_active = value

    def _set_up_threads(self) -> None:
        """Set up multiple consumer threads."""
        with self._lock:
            # Start multiple consumer threads
            for i in range(self._max_workers):
                consumer_thread = threading.Thread(
                    target=self._consumer,
                    name=f"MLflowTelemetryConsumer-{i}",
                    daemon=True,
                )
                consumer_thread.start()
                self._consumer_threads.append(consumer_thread)

    def _at_exit_callback(self) -> None:
        """Callback function executed when the program is exiting."""
        try:
            # Suppress logs/warnings during shutdown
            # NB: this doesn't suppress log not emitted by mlflow
            with suppress_logs_in_thread(), warnings.catch_warnings():
                warnings.simplefilter("ignore")
                self.flush(terminate=True)
        except Exception as e:
            _log_error(f"Failed to flush telemetry during termination: {e}")

    def flush(self, terminate=False) -> None:
        """
        Flush the async telemetry queue.

        Args:
            terminate: If True, shut down the telemetry threads after flushing.
        """
        if not self.is_active:
            return

        if terminate:
            # Full shutdown for termination - signal stop and exit immediately
            self._is_stopped = True
            self.is_active = False

        # non-terminating flush is only used in tests
        else:
            self._config_thread.join(timeout=1)

            # Send any pending records before flushing
            with self._batch_lock:
                if self._pending_records and self.config and not self._is_stopped:
                    self._send_batch()
            # For non-terminating flush, just wait for queue to empty
            try:
                self._queue.join()
            except Exception as e:
                _log_error(f"Failed to flush telemetry: {e}")

    def _update_backend_store(self):
        """
        Backend store might be changed after mlflow is imported, we should use this
        method to update the backend store info at sending telemetry step.
        """
        try:
            # import here to avoid circular import
            from mlflow.tracking._tracking_service.utils import _get_tracking_scheme

            self.info["tracking_uri_scheme"] = _get_tracking_scheme()
        except Exception as e:
            _log_error(f"Failed to update backend store: {e}")

    def _clean_up(self):
        """Join all threads"""
        self.flush(terminate=True)
        for thread in self._consumer_threads:
            if thread.is_alive():
                thread.join(timeout=1)


_MLFLOW_TELEMETRY_CLIENT = None
_client_lock = threading.Lock()


def set_telemetry_client():
    if is_telemetry_disabled():
        # set to None again so this function can be used to
        # re-initialize the telemetry client
        _set_telemetry_client(None)
    else:
        try:
            _set_telemetry_client(TelemetryClient())
        except Exception as e:
            _log_error(f"Failed to set telemetry client: {e}")
            _set_telemetry_client(None)


def _set_telemetry_client(value: TelemetryClient | None):
    global _MLFLOW_TELEMETRY_CLIENT
    with _client_lock:
        _MLFLOW_TELEMETRY_CLIENT = value
        if value:
            _MLFLOW_TELEMETRY_SESSION_ID.set(value.info["session_id"])
        else:
            _MLFLOW_TELEMETRY_SESSION_ID.unset()


def get_telemetry_client() -> TelemetryClient | None:
    with _client_lock:
        return _MLFLOW_TELEMETRY_CLIENT
```

--------------------------------------------------------------------------------

---[FILE: constant.py]---
Location: mlflow-master/mlflow/telemetry/constant.py

```python
from mlflow.ml_package_versions import GENAI_FLAVOR_TO_MODULE_NAME, NON_GENAI_FLAVOR_TO_MODULE_NAME

# NB: Kinesis PutRecords API has a limit of 500 records per request
BATCH_SIZE = 500
BATCH_TIME_INTERVAL_SECONDS = 10
MAX_QUEUE_SIZE = 1000
MAX_WORKERS = 1
CONFIG_STAGING_URL = "https://config-staging.mlflow-telemetry.io"
CONFIG_URL = "https://config.mlflow-telemetry.io"
UI_CONFIG_STAGING_URL = "https://d34z9x6fp23d2z.cloudfront.net"
UI_CONFIG_URL = "https://d139nb52glx00z.cloudfront.net"
RETRYABLE_ERRORS = [
    429,  # Throttled
    500,  # Interval Server Error
]
UNRECOVERABLE_ERRORS = [
    400,  # Bad Request
    401,  # Unauthorized
    403,  # Forbidden
    404,  # Not Found
]

GENAI_MODULES = {
    "agno",
    "anthropic",
    "autogen",
    "chromadb",
    "crewai",
    "dspy",
    "faiss",
    "google.genai",  # gemini
    "groq",
    "haystack",
    "langchain",
    "langgraph",
    "langsmith",
    "litellm",
    "llama_cpp",
    "llama_index.core",
    "milvus",
    "mistralai",
    "openai",
    "pinecone",
    "pydantic_ai",
    "qdrant",
    "ragas",
    "semantic_kernel",
    "smolagents",
    "vllm",
    "weaviate",
} | set(GENAI_FLAVOR_TO_MODULE_NAME.values())

NON_GENAI_MODULES = {
    # Classic ML
    "catboost",
    "h2o",
    "lightgbm",
    "optuna",
    "prophet",
    "pyspark.ml",
    "sklearn",
    "spacy",
    "statsmodels",
    "xgboost",
    # Deep Learning
    "accelerate",
    "bitsandbytes",
    "deepspeed",
    "diffusers",
    "fastai",
    "flash_attn",
    "flax",
    "jax",
    "keras",
    "lightning",
    "mxnet",
    "paddle",
    "peft",
    "sentence_transformers",
    "tensorflow",
    "timm",
    "torch",
    "transformers",
} | set(NON_GENAI_FLAVOR_TO_MODULE_NAME.values()) - {"pyspark"}

MODULES_TO_CHECK_IMPORT = GENAI_MODULES | NON_GENAI_MODULES

# fallback config to use for UI telemetry in case fetch fails
FALLBACK_UI_CONFIG = {
    "disable_ui_telemetry": True,
    "disable_ui_events": [],
    "ui_rollout_percentage": 0,
}
```

--------------------------------------------------------------------------------

````
