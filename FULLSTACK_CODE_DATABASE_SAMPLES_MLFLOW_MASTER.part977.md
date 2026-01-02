---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:55Z
part: 977
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 977 of 991)

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

---[FILE: test_async_artifacts_logging_queue.py]---
Location: mlflow-master/tests/utils/test_async_artifacts_logging_queue.py

```python
import io
import pickle
import random
import threading
import time

import pytest
from PIL import Image

from mlflow import MlflowException
from mlflow.utils.async_logging.async_artifacts_logging_queue import AsyncArtifactsLoggingQueue

TOTAL_ARTIFACTS = 5


class RunArtifacts:
    def __init__(self, throw_exception_on_artifact_number=None):
        if throw_exception_on_artifact_number is None:
            throw_exception_on_artifact_number = []
        self.received_run_id = ""
        self.received_artifacts = []
        self.received_filenames = []
        self.received_artifact_paths = []
        self.artifact_count = 0
        self.throw_exception_on_artifact_number = throw_exception_on_artifact_number or []

    def consume_queue_data(self, filename, artifact_path, artifact):
        self.artifact_count += 1
        if self.artifact_count in self.throw_exception_on_artifact_number:
            raise MlflowException("Failed to log run data")
        self.received_artifacts.append(artifact)
        self.received_filenames.append(filename)
        self.received_artifact_paths.append(artifact_path)


def _get_run_artifacts(total_artifacts=TOTAL_ARTIFACTS):
    for num in range(0, total_artifacts):
        filename = f"image_{num}.png"
        artifact_path = f"images/artifact_{num}"
        artifact = Image.new("RGB", (100, 100), color="red")
        yield filename, artifact_path, artifact


def _assert_sent_received_artifacts(
    filenames_sent,
    artifact_paths_sent,
    artifacts_sent,
    received_filenames,
    received_artifact_paths,
    received_artifacts,
):
    for num in range(1, len(filenames_sent)):
        assert filenames_sent[num] == received_filenames[num]

    for num in range(1, len(artifact_paths_sent)):
        assert artifact_paths_sent[num] == received_artifact_paths[num]

    for num in range(1, len(artifacts_sent)):
        assert artifacts_sent[num] == received_artifacts[num]


def test_single_thread_publish_consume_queue():
    run_artifacts = RunArtifacts()
    async_logging_queue = AsyncArtifactsLoggingQueue(run_artifacts.consume_queue_data)
    async_logging_queue.activate()
    filenames_sent = []
    artifact_paths_sent = []
    artifacts_sent = []
    for filename, artifact_path, artifact in _get_run_artifacts():
        async_logging_queue.log_artifacts_async(
            filename=filename, artifact_path=artifact_path, artifact=artifact
        )
        filenames_sent.append(filename)
        artifact_paths_sent.append(artifact_path)
        artifacts_sent.append(artifact)
    async_logging_queue.flush()

    _assert_sent_received_artifacts(
        filenames_sent,
        artifact_paths_sent,
        artifacts_sent,
        run_artifacts.received_filenames,
        run_artifacts.received_artifact_paths,
        run_artifacts.received_artifacts,
    )


def test_queue_activation():
    run_artifacts = RunArtifacts()
    async_logging_queue = AsyncArtifactsLoggingQueue(run_artifacts.consume_queue_data)

    assert not async_logging_queue._is_activated

    for filename, artifact_path, artifact in _get_run_artifacts(1):
        with pytest.raises(MlflowException, match="AsyncArtifactsLoggingQueue is not activated."):
            async_logging_queue.log_artifacts_async(
                filename=filename, artifact_path=artifact_path, artifact=artifact
            )

    async_logging_queue.activate()
    assert async_logging_queue._is_activated


def test_partial_logging_failed():
    run_data = RunArtifacts(throw_exception_on_artifact_number=[3, 4])

    async_logging_queue = AsyncArtifactsLoggingQueue(run_data.consume_queue_data)
    async_logging_queue.activate()

    filenames_sent = []
    artifact_paths_sent = []
    artifacts_sent = []

    run_operations = []
    batch_id = 1
    for filename, artifact_path, artifact in _get_run_artifacts():
        if batch_id in [3, 4]:
            with pytest.raises(MlflowException, match="Failed to log run data"):
                async_logging_queue.log_artifacts_async(
                    filename=filename, artifact_path=artifact_path, artifact=artifact
                ).wait()
        else:
            run_operations.append(
                async_logging_queue.log_artifacts_async(
                    filename=filename, artifact_path=artifact_path, artifact=artifact
                )
            )
            filenames_sent.append(filename)
            artifact_paths_sent.append(artifact_path)
            artifacts_sent.append(artifact)

        batch_id += 1

    for run_operation in run_operations:
        run_operation.wait()

    _assert_sent_received_artifacts(
        filenames_sent,
        artifact_paths_sent,
        artifacts_sent,
        run_data.received_filenames,
        run_data.received_artifact_paths,
        run_data.received_artifacts,
    )


def test_publish_multithread_consume_single_thread():
    run_data = RunArtifacts(throw_exception_on_artifact_number=[])

    async_logging_queue = AsyncArtifactsLoggingQueue(run_data.consume_queue_data)
    async_logging_queue.activate()

    def _send_artifact(run_data_queueing_processor, run_operations=None):
        if run_operations is None:
            run_operations = []
        filenames_sent = []
        artifact_paths_sent = []
        artifacts_sent = []

        for filename, artifact_path, artifact in _get_run_artifacts():
            run_operations.append(
                run_data_queueing_processor.log_artifacts_async(
                    filename=filename, artifact_path=artifact_path, artifact=artifact
                )
            )

            time.sleep(random.randint(1, 3))
            filenames_sent.append(filename)
            artifact_paths_sent.append(artifact_path)
            artifacts_sent.append(artifact)

    run_operations = []
    t1 = threading.Thread(target=_send_artifact, args=(async_logging_queue, run_operations))
    t2 = threading.Thread(target=_send_artifact, args=(async_logging_queue, run_operations))

    t1.start()
    t2.start()
    t1.join()
    t2.join()

    for run_operation in run_operations:
        run_operation.wait()

    assert len(run_data.received_filenames) == 2 * TOTAL_ARTIFACTS
    assert len(run_data.received_artifact_paths) == 2 * TOTAL_ARTIFACTS
    assert len(run_data.received_artifacts) == 2 * TOTAL_ARTIFACTS


class Consumer:
    def __init__(self) -> None:
        self.filenames = []
        self.artifact_paths = []
        self.artifacts = []

    def consume_queue_data(self, filename, artifact_path, artifact):
        time.sleep(0.5)
        self.filenames.append(filename)
        self.artifact_paths.append(artifact_path)
        self.artifacts.append(artifact)


def test_async_logging_queue_pickle():
    consumer = Consumer()
    async_logging_queue = AsyncArtifactsLoggingQueue(consumer.consume_queue_data)

    # Pickle the queue without activating it.
    buffer = io.BytesIO()
    pickle.dump(async_logging_queue, buffer)
    deserialized_queue = pickle.loads(buffer.getvalue())  # Type: AsyncArtifactsLoggingQueue

    # activate the queue and then try to pickle it
    async_logging_queue.activate()

    run_operations = [
        async_logging_queue.log_artifacts_async(
            filename=f"image-{val}.png",
            artifact_path="images/image-artifact.png",
            artifact=Image.new("RGB", (100, 100), color="blue"),
        )
        for val in range(0, 10)
    ]

    # Pickle the queue
    buffer = io.BytesIO()
    pickle.dump(async_logging_queue, buffer)

    deserialized_queue = pickle.loads(buffer.getvalue())  # Type: AsyncLoggingQueue
    assert deserialized_queue._queue.empty()
    assert deserialized_queue._lock is not None
    assert deserialized_queue._is_activated is False

    for run_operation in run_operations:
        run_operation.wait()

    assert len(consumer.filenames) == 10

    # try to log using deserialized queue after activating it.
    deserialized_queue.activate()
    assert deserialized_queue._is_activated

    run_operations = []

    for val in range(0, 10):
        run_operations.append(
            deserialized_queue.log_artifacts_async(
                filename=f"image2-{val}.png",
                artifact_path="images/image-artifact2.png",
                artifact=Image.new("RGB", (100, 100), color="green"),
            )
        )

    for run_operation in run_operations:
        run_operation.wait()

    assert len(deserialized_queue._artifact_logging_func.__self__.filenames) == 10
```

--------------------------------------------------------------------------------

---[FILE: test_async_logging_queue.py]---
Location: mlflow-master/tests/utils/test_async_logging_queue.py

```python
import contextlib
import io
import pickle
import random
import threading
import time
import uuid
from unittest.mock import MagicMock, patch

import pytest

import mlflow.utils.async_logging.async_logging_queue
from mlflow import MlflowException
from mlflow.entities.metric import Metric
from mlflow.entities.param import Param
from mlflow.entities.run_tag import RunTag
from mlflow.utils.async_logging.async_logging_queue import AsyncLoggingQueue, QueueStatus

METRIC_PER_BATCH = 250
TAGS_PER_BATCH = 1
PARAMS_PER_BATCH = 1
TOTAL_BATCHES = 5


class RunData:
    def __init__(self, throw_exception_on_batch_number=None) -> None:
        if throw_exception_on_batch_number is None:
            throw_exception_on_batch_number = []
        self.received_run_id = ""
        self.received_metrics = []
        self.received_tags = []
        self.received_params = []
        self.batch_count = 0
        self.throw_exception_on_batch_number = throw_exception_on_batch_number or []

    def consume_queue_data(self, run_id, metrics, tags, params):
        self.batch_count += 1
        if self.batch_count in self.throw_exception_on_batch_number:
            raise MlflowException("Failed to log run data")
        self.received_run_id = run_id
        self.received_metrics.extend(metrics or [])
        self.received_params.extend(params or [])
        self.received_tags.extend(tags or [])


@contextlib.contextmanager
def generate_async_logging_queue(clazz):
    async_logging_queue = AsyncLoggingQueue(clazz.consume_queue_data)
    try:
        yield async_logging_queue
    finally:
        async_logging_queue.shut_down_async_logging()


def test_single_thread_publish_consume_queue(monkeypatch):
    monkeypatch.setenv("MLFLOW_ASYNC_LOGGING_BUFFERING_SECONDS", "3")

    with (
        patch.object(
            AsyncLoggingQueue, "_batch_logging_worker_threadpool", create=True
        ) as mock_worker_threadpool,
        patch.object(
            AsyncLoggingQueue, "_batch_status_check_threadpool", create=True
        ) as mock_check_threadpool,
    ):
        mock_worker_threadpool.submit = MagicMock()
        mock_check_threadpool.submit = MagicMock()
        mock_worker_threadpool.shutdown = MagicMock()
        mock_check_threadpool.shutdown = MagicMock()

        run_id = "test_run_id"
        run_data = RunData()
        with generate_async_logging_queue(run_data) as async_logging_queue:
            async_logging_queue.activate()
            async_logging_queue._batch_logging_worker_threadpool = mock_worker_threadpool
            async_logging_queue._batch_status_check_threadpool = mock_check_threadpool

            for params, tags, metrics in _get_run_data():
                async_logging_queue.log_batch_async(
                    run_id=run_id, metrics=metrics, tags=tags, params=params
                )
            async_logging_queue.flush()
            # 2 batches are sent to the worker thread pool due to grouping, otherwise it would be 5.
            assert mock_worker_threadpool.submit.call_count == 2
            assert async_logging_queue.is_active()
            assert mock_check_threadpool.shutdown.call_count == 1
            assert mock_worker_threadpool.shutdown.call_count == 1


def test_grouping_batch_in_time_window():
    run_id = "test_run_id"
    run_data = RunData()
    with generate_async_logging_queue(run_data) as async_logging_queue:
        async_logging_queue.activate()
        metrics_sent = []
        tags_sent = []
        params_sent = []

        for params, tags, metrics in _get_run_data():
            async_logging_queue.log_batch_async(
                run_id=run_id, metrics=metrics, tags=tags, params=params
            )
            metrics_sent += metrics
            tags_sent += tags
            params_sent += params

        async_logging_queue.flush()

        _assert_sent_received_data(
            metrics_sent,
            params_sent,
            tags_sent,
            run_data.received_metrics,
            run_data.received_params,
            run_data.received_tags,
        )


def test_queue_activation():
    run_id = "test_run_id"
    run_data = RunData()
    with generate_async_logging_queue(run_data) as async_logging_queue:
        assert async_logging_queue.is_idle()

        metrics = [
            Metric(
                key=f"batch metrics async-{val}",
                value=val,
                timestamp=val,
                step=0,
            )
            for val in range(METRIC_PER_BATCH)
        ]
        with pytest.raises(MlflowException, match="AsyncLoggingQueue is not activated."):
            async_logging_queue.log_batch_async(run_id=run_id, metrics=metrics, tags=[], params=[])

        async_logging_queue.activate()
        assert async_logging_queue.is_active()


def test_end_async_logging():
    run_id = "test_run_id"
    run_data = RunData()
    with generate_async_logging_queue(run_data) as async_logging_queue:
        async_logging_queue.activate()

        metrics = [
            Metric(
                key=f"batch metrics async-{val}",
                value=val,
                timestamp=val,
                step=0,
            )
            for val in range(METRIC_PER_BATCH)
        ]
        async_logging_queue.log_batch_async(run_id=run_id, metrics=metrics, tags=[], params=[])
        async_logging_queue.end_async_logging()
        assert async_logging_queue._status == QueueStatus.TEAR_DOWN
        # end_async_logging should not shutdown the threadpool
        assert not async_logging_queue._batch_logging_worker_threadpool._shutdown
        assert not async_logging_queue._batch_status_check_threadpool._shutdown

        async_logging_queue.flush()
        assert async_logging_queue.is_active()


def test_partial_logging_failed():
    run_id = "test_run_id"
    run_data = RunData(throw_exception_on_batch_number=[3, 4])
    with generate_async_logging_queue(run_data) as async_logging_queue:
        async_logging_queue.activate()

        metrics_sent = []
        tags_sent = []
        params_sent = []

        run_operations = []
        batch_id = 1
        for params, tags, metrics in _get_run_data():
            if batch_id in [3, 4]:
                with pytest.raises(MlflowException, match="Failed to log run data"):
                    async_logging_queue.log_batch_async(
                        run_id=run_id, metrics=metrics, tags=tags, params=params
                    ).wait()
            else:
                run_operations.append(
                    async_logging_queue.log_batch_async(
                        run_id=run_id, metrics=metrics, tags=tags, params=params
                    )
                )
                metrics_sent += metrics
                tags_sent += tags
                params_sent += params

            batch_id += 1

        for run_operation in run_operations:
            run_operation.wait()

        _assert_sent_received_data(
            metrics_sent,
            params_sent,
            tags_sent,
            run_data.received_metrics,
            run_data.received_params,
            run_data.received_tags,
        )


def test_publish_multithread_consume_single_thread():
    run_id = "test_run_id"
    run_data = RunData(throw_exception_on_batch_number=[])
    with generate_async_logging_queue(run_data) as async_logging_queue:
        async_logging_queue.activate()

        run_operations = []
        t1 = threading.Thread(
            target=_send_metrics_tags_params, args=(async_logging_queue, run_id, run_operations)
        )
        t2 = threading.Thread(
            target=_send_metrics_tags_params, args=(async_logging_queue, run_id, run_operations)
        )

        t1.start()
        t2.start()
        t1.join()
        t2.join()

        for run_operation in run_operations:
            run_operation.wait()

        assert len(run_data.received_metrics) == 2 * METRIC_PER_BATCH * TOTAL_BATCHES
        assert len(run_data.received_tags) == 2 * TAGS_PER_BATCH * TOTAL_BATCHES
        assert len(run_data.received_params) == 2 * PARAMS_PER_BATCH * TOTAL_BATCHES


class Consumer:
    def __init__(self) -> None:
        self.metrics = []
        self.tags = []
        self.params = []

    def consume_queue_data(self, run_id, metrics, tags, params):
        time.sleep(0.5)
        self.metrics.extend(metrics or [])
        self.params.extend(params or [])
        self.tags.extend(tags or [])


def test_async_logging_queue_pickle():
    run_id = "test_run_id"
    consumer = Consumer()
    with generate_async_logging_queue(consumer) as async_logging_queue:
        # Pickle the queue without activating it.
        buffer = io.BytesIO()
        pickle.dump(async_logging_queue, buffer)
        deserialized_queue = pickle.loads(buffer.getvalue())  # Type: AsyncLoggingQueue

        # activate the queue and then try to pickle it
        async_logging_queue.activate()

        run_operations = [
            async_logging_queue.log_batch_async(
                run_id=run_id,
                metrics=[Metric("metric", val, timestamp=time.time(), step=1)],
                tags=[],
                params=[],
            )
            for val in range(0, 10)
        ]

        # Pickle the queue
        buffer = io.BytesIO()
        pickle.dump(async_logging_queue, buffer)

        deserialized_queue = pickle.loads(buffer.getvalue())  # Type: AsyncLoggingQueue
        assert deserialized_queue._queue.empty()
        assert deserialized_queue._lock is not None
        assert deserialized_queue._status is QueueStatus.IDLE

        for run_operation in run_operations:
            run_operation.wait()

        assert len(consumer.metrics) == 10

        # try to log using deserialized queue after activating it.
        deserialized_queue.activate()
        assert deserialized_queue.is_active()

        run_operations = []

        for val in range(0, 10):
            run_operations.append(
                deserialized_queue.log_batch_async(
                    run_id=run_id,
                    metrics=[Metric("metric", val, timestamp=time.time(), step=1)],
                    tags=[],
                    params=[],
                )
            )

        for run_operation in run_operations:
            run_operation.wait()

        assert len(deserialized_queue._logging_func.__self__.metrics) == 10

        deserialized_queue.shut_down_async_logging()


def _send_metrics_tags_params(run_data_queueing_processor, run_id, run_operations=None):
    if run_operations is None:
        run_operations = []
    metrics_sent = []
    tags_sent = []
    params_sent = []

    for params, tags, metrics in _get_run_data():
        run_operations.append(
            run_data_queueing_processor.log_batch_async(
                run_id=run_id, metrics=metrics, tags=tags, params=params
            )
        )

        time.sleep(random.randint(1, 3))
        metrics_sent += metrics
        tags_sent += tags
        params_sent += params


def _get_run_data(
    total_batches=TOTAL_BATCHES,
    params_per_batch=PARAMS_PER_BATCH,
    tags_per_batch=TAGS_PER_BATCH,
    metrics_per_batch=METRIC_PER_BATCH,
):
    for num in range(0, total_batches):
        guid8 = str(uuid.uuid4())[:8]
        params = [
            Param(f"batch param-{guid8}-{val}", value=str(time.time()))
            for val in range(params_per_batch)
        ]
        tags = [
            RunTag(f"batch tag-{guid8}-{val}", value=str(time.time()))
            for val in range(tags_per_batch)
        ]
        metrics = [
            Metric(
                key=f"batch metrics async-{num}",
                value=val,
                timestamp=int(time.time() * 1000),
                step=0,
            )
            for val in range(metrics_per_batch)
        ]
        yield params, tags, metrics


def _assert_sent_received_data(
    metrics_sent, params_sent, tags_sent, received_metrics, received_params, received_tags
):
    for num in range(1, len(metrics_sent)):
        assert metrics_sent[num].key == received_metrics[num].key
        assert metrics_sent[num].value == received_metrics[num].value
        assert metrics_sent[num].timestamp == received_metrics[num].timestamp
        assert metrics_sent[num].step == received_metrics[num].step

    for num in range(1, len(tags_sent)):
        assert tags_sent[num].key == received_tags[num].key
        assert tags_sent[num].value == received_tags[num].value

    for num in range(1, len(params_sent)):
        assert params_sent[num].key == received_params[num].key
        assert params_sent[num].value == received_params[num].value


def test_batch_split(monkeypatch):
    monkeypatch.setattr(mlflow.utils.async_logging.async_logging_queue, "_MAX_ITEMS_PER_BATCH", 10)
    monkeypatch.setattr(mlflow.utils.async_logging.async_logging_queue, "_MAX_PARAMS_PER_BATCH", 6)
    monkeypatch.setattr(mlflow.utils.async_logging.async_logging_queue, "_MAX_TAGS_PER_BATCH", 8)

    run_data = RunData()
    with generate_async_logging_queue(run_data) as async_logging_queue:
        async_logging_queue.activate()

        run_id = "test_run_id"
        for params, tags, metrics in _get_run_data(2, 3, 3, 3):
            async_logging_queue.log_batch_async(
                run_id=run_id, metrics=metrics, tags=tags, params=params
            )
        async_logging_queue.flush()

        assert run_data.batch_count == 2

    run_data = RunData()
    with generate_async_logging_queue(run_data) as async_logging_queue:
        async_logging_queue.activate()

        run_id = "test_run_id"
        for params, tags, metrics in _get_run_data(2, 4, 0, 0):
            async_logging_queue.log_batch_async(
                run_id=run_id, metrics=metrics, tags=tags, params=params
            )
        async_logging_queue.flush()

        assert run_data.batch_count == 2

    run_data = RunData()
    with generate_async_logging_queue(run_data) as async_logging_queue:
        async_logging_queue.activate()

        run_id = "test_run_id"
        for params, tags, metrics in _get_run_data(2, 0, 5, 0):
            async_logging_queue.log_batch_async(
                run_id=run_id, metrics=metrics, tags=tags, params=params
            )
        async_logging_queue.flush()

        assert run_data.batch_count == 2
```

--------------------------------------------------------------------------------

---[FILE: test_autologging_utils.py]---
Location: mlflow-master/tests/utils/test_autologging_utils.py

```python
import warnings
from threading import Thread

from mlflow import MlflowClient
from mlflow.entities import Metric
from mlflow.utils.autologging_utils.logging_and_warnings import (
    ORIGINAL_SHOWWARNING,
    _WarningsController,
)
from mlflow.utils.autologging_utils.metrics_queue import (
    _metrics_queue,
    _metrics_queue_lock,
    flush_metrics_queue,
)


def test_flush_metrics_queue_is_thread_safe():
    """
    Autologging augments TensorBoard event logging hooks with MLflow `log_metric` API
    calls. To prevent these API calls from blocking TensorBoard event logs, `log_metric`
    API calls are scheduled via `_flush_queue` on a background thread. Accordingly, this test
    verifies that `_flush_queue` is thread safe.
    """

    client = MlflowClient()
    run = client.create_run(experiment_id="0")
    metric_queue_item = (run.info.run_id, Metric("foo", 0.1, 100, 1))
    _metrics_queue.append(metric_queue_item)

    # Verify that, if another thread holds a lock on the metric queue leveraged by
    # _flush_queue, _flush_queue terminates and does not modify the queue
    _metrics_queue_lock.acquire()
    flush_thread1 = Thread(target=flush_metrics_queue)
    flush_thread1.start()
    flush_thread1.join()
    assert len(_metrics_queue) == 1
    assert _metrics_queue[0] == metric_queue_item
    _metrics_queue_lock.release()

    # Verify that, if no other thread holds a lock on the metric queue leveraged by
    # _flush_queue, _flush_queue flushes the queue as expected
    flush_thread2 = Thread(target=flush_metrics_queue)
    flush_thread2.start()
    flush_thread2.join()
    assert len(_metrics_queue) == 0


def test_double_patch_does_not_overwrite(monkeypatch):
    monkeypatch.setattr(warnings, "showwarning", ORIGINAL_SHOWWARNING)

    controller = _WarningsController()

    assert warnings.showwarning == ORIGINAL_SHOWWARNING
    assert not controller._did_patch_showwarning

    controller.set_non_mlflow_warnings_disablement_state_for_current_thread(True)

    assert controller._did_patch_showwarning
    assert warnings.showwarning == controller._patched_showwarning

    patched_func = warnings.showwarning

    controller._modify_patch_state_if_necessary()

    assert warnings.showwarning == patched_func

    controller.set_non_mlflow_warnings_disablement_state_for_current_thread(False)

    assert warnings.showwarning == ORIGINAL_SHOWWARNING
```

--------------------------------------------------------------------------------

---[FILE: test_class_utils.py]---
Location: mlflow-master/tests/utils/test_class_utils.py

```python
import mlflow
from mlflow.utils.class_utils import _get_class_from_string


def test_get_class_from_string():
    assert _get_class_from_string("mlflow.MlflowClient") == mlflow.MlflowClient
```

--------------------------------------------------------------------------------

---[FILE: test_credentials.py]---
Location: mlflow-master/tests/utils/test_credentials.py

```python
from unittest import mock
from unittest.mock import patch

import pytest

from mlflow import get_tracking_uri
from mlflow.environment_variables import MLFLOW_TRACKING_PASSWORD, MLFLOW_TRACKING_USERNAME
from mlflow.exceptions import MlflowException
from mlflow.utils.credentials import login, read_mlflow_creds


def test_read_mlflow_creds_file(tmp_path, monkeypatch):
    monkeypatch.delenv(MLFLOW_TRACKING_USERNAME.name, raising=False)
    monkeypatch.delenv(MLFLOW_TRACKING_PASSWORD.name, raising=False)

    creds_file = tmp_path.joinpath("credentials")
    with mock.patch("mlflow.utils.credentials._get_credentials_path", return_value=str(creds_file)):
        # credentials file does not exist
        creds = read_mlflow_creds()
        assert creds.username is None
        assert creds.password is None

        # credentials file is empty
        creds = read_mlflow_creds()
        assert creds.username is None
        assert creds.password is None

        # password is missing
        creds_file.write_text(
            """
[mlflow]
mlflow_tracking_username = username
"""
        )
        creds = read_mlflow_creds()
        assert creds.username == "username"
        assert creds.password is None

        # username is missing
        creds_file.write_text(
            """
[mlflow]
mlflow_tracking_password = password
"""
        )
        creds = read_mlflow_creds()
        assert creds.username is None
        assert creds.password == "password"

        # valid credentials
        creds_file.write_text(
            """
[mlflow]
mlflow_tracking_username = username
mlflow_tracking_password = password
"""
        )
        creds = read_mlflow_creds()
        assert creds is not None
        assert creds.username == "username"
        assert creds.password == "password"


@pytest.mark.parametrize(
    ("username", "password"),
    [
        ("username", "password"),
        ("username", None),
        (None, "password"),
        (None, None),
    ],
)
def test_read_mlflow_creds_env(username, password, monkeypatch):
    if username is None:
        monkeypatch.delenv(MLFLOW_TRACKING_USERNAME.name, raising=False)
    else:
        monkeypatch.setenv(MLFLOW_TRACKING_USERNAME.name, username)

    if password is None:
        monkeypatch.delenv(MLFLOW_TRACKING_PASSWORD.name, raising=False)
    else:
        monkeypatch.setenv(MLFLOW_TRACKING_PASSWORD.name, password)

    creds = read_mlflow_creds()
    assert creds.username == username
    assert creds.password == password


def test_read_mlflow_creds_env_takes_precedence_over_file(tmp_path, monkeypatch):
    monkeypatch.setenv(MLFLOW_TRACKING_USERNAME.name, "username_env")
    monkeypatch.setenv(MLFLOW_TRACKING_PASSWORD.name, "password_env")
    creds_file = tmp_path.joinpath("credentials")
    with mock.patch("mlflow.utils.credentials._get_credentials_path", return_value=str(creds_file)):
        creds_file.write_text(
            """
[mlflow]
mlflow_tracking_username = username_file
mlflow_tracking_password = password_file
"""
        )
        creds = read_mlflow_creds()
        assert creds.username == "username_env"
        assert creds.password == "password_env"


def test_mlflow_login(tmp_path, monkeypatch):
    # Mock `input()` and `getpass()` to return host, username and password in order.
    with (
        patch(
            "builtins.input",
            side_effect=["https://community.cloud.databricks.com/", "dummyusername"],
        ),
        patch("getpass.getpass", side_effect=["dummypassword"]),
    ):
        file_name = f"{tmp_path}/.databrickscfg"
        profile = "TEST"
        monkeypatch.setenv("DATABRICKS_CONFIG_FILE", file_name)
        monkeypatch.setenv("DATABRICKS_CONFIG_PROFILE", profile)

        def success():
            return

        with patch(
            "mlflow.utils.credentials._validate_databricks_auth",
            side_effect=[MlflowException("Invalid databricks credentials."), success()],
        ):
            login("databricks")

    with open(file_name) as f:
        lines = f.readlines()
        assert lines[0] == "[TEST]\n"
        assert lines[1] == "host = https://community.cloud.databricks.com/\n"
        assert lines[2] == "username = dummyusername\n"
        assert lines[3] == "password = dummypassword\n"

    # Assert that the tracking URI is set to the databricks.
    assert get_tracking_uri() == "databricks"


def test_mlflow_login_noninteractive():
    # Forces mlflow.utils.credentials._validate_databricks_auth to raise `MlflowException()`
    with patch(
        "mlflow.utils.credentials._validate_databricks_auth",
        side_effect=MlflowException("Failed to validate databricks credentials."),
    ):
        with pytest.raises(
            MlflowException,
            match="No valid Databricks credentials found while running in non-interactive mode",
        ):
            login(backend="databricks", interactive=False)
```

--------------------------------------------------------------------------------

````
