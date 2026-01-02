---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 949
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 949 of 991)

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

---[FILE: test_tensorflow2_core_model_export.py]---
Location: mlflow-master/tests/tensorflow/test_tensorflow2_core_model_export.py

```python
import os
from typing import Any, NamedTuple
from unittest import mock

import numpy as np
import pytest
import tensorflow as tf

import mlflow.tensorflow
from mlflow.models import Model, infer_signature


class ToyModel(tf.Module):
    def __init__(self, w, b):
        super().__init__()
        self.w = w
        self.b = b

    @tf.function
    def __call__(self, x):
        return tf.reshape(tf.add(tf.matmul(x, self.w), self.b), [-1])


class TF2ModelInfo(NamedTuple):
    model: Any
    inference_data: Any
    expected_results: Any


@pytest.fixture
def tf2_toy_model():
    tf.random.set_seed(1337)
    rand_w = tf.random.uniform(shape=[3, 1], dtype=tf.float32)
    rand_b = tf.random.uniform(shape=[], dtype=tf.float32)

    inference_data = np.array([[2, 3, 4], [5, 6, 7]], dtype=np.float32)
    model = ToyModel(rand_w, rand_b)
    expected_results = model(inference_data)

    return TF2ModelInfo(
        model=model,
        inference_data=inference_data,
        expected_results=expected_results,
    )


def test_save_and_load_tf2_module(tmp_path, tf2_toy_model):
    model_path = os.path.join(tmp_path, "model")
    mlflow.tensorflow.save_model(tf2_toy_model.model, model_path)

    loaded_model = mlflow.tensorflow.load_model(model_path)

    predictions = loaded_model(tf2_toy_model.inference_data).numpy()
    np.testing.assert_allclose(
        predictions,
        tf2_toy_model.expected_results,
    )


def test_log_and_load_tf2_module(tf2_toy_model):
    with mlflow.start_run():
        model_info = mlflow.tensorflow.log_model(tf2_toy_model.model, name="model")

    model_uri = model_info.model_uri
    loaded_model = mlflow.tensorflow.load_model(model_uri)
    predictions = loaded_model(tf2_toy_model.inference_data).numpy()
    np.testing.assert_allclose(
        predictions,
        tf2_toy_model.expected_results,
    )

    loaded_model2 = mlflow.pyfunc.load_model(model_uri)
    predictions2 = loaded_model2.predict(tf2_toy_model.inference_data)
    assert isinstance(predictions2, np.ndarray)
    np.testing.assert_allclose(
        predictions2,
        tf2_toy_model.expected_results,
    )


def test_model_log_with_signature_inference(tf2_toy_model):
    artifact_path = "model"
    example = tf2_toy_model.inference_data

    with mlflow.start_run():
        model_info = mlflow.tensorflow.log_model(
            tf2_toy_model.model, name=artifact_path, input_example=example
        )

    mlflow_model = Model.load(model_info.model_uri)
    assert mlflow_model.signature == infer_signature(
        tf2_toy_model.inference_data, tf2_toy_model.expected_results.numpy()
    )


def test_save_with_options(tmp_path, tf2_toy_model):
    model_path = os.path.join(tmp_path, "model")

    saved_model_kwargs = {
        "signatures": [tf.TensorSpec(shape=None, dtype=tf.float32)],
        "options": tf.saved_model.SaveOptions(save_debug_info=True),
    }

    with mock.patch("tensorflow.saved_model.save") as mock_save:
        mlflow.tensorflow.save_model(
            tf2_toy_model.model, model_path, saved_model_kwargs=saved_model_kwargs
        )
        mock_save.assert_called_once_with(mock.ANY, mock.ANY, **saved_model_kwargs)

        mock_save.reset_mock()

        with mlflow.start_run():
            mlflow.tensorflow.log_model(
                tf2_toy_model.model, name="model", saved_model_kwargs=saved_model_kwargs
            )

        mock_save.assert_called_once_with(mock.ANY, mock.ANY, **saved_model_kwargs)


def test_load_with_options(tmp_path, tf2_toy_model):
    model_path = os.path.join(tmp_path, "model")
    mlflow.tensorflow.save_model(tf2_toy_model.model, model_path)

    saved_model_kwargs = {
        "options": tf.saved_model.LoadOptions(),
    }
    with mock.patch("tensorflow.saved_model.load") as mock_load:
        mlflow.tensorflow.load_model(model_path, saved_model_kwargs=saved_model_kwargs)
        mock_load.assert_called_once_with(mock.ANY, **saved_model_kwargs)
```

--------------------------------------------------------------------------------

---[FILE: test_tensorflow2_metric_value_conversion_utils.py]---
Location: mlflow-master/tests/tensorflow/test_tensorflow2_metric_value_conversion_utils.py

```python
import pytest
import tensorflow as tf

import mlflow
from mlflow import tracking
from mlflow.exceptions import INVALID_PARAMETER_VALUE, ErrorCode, MlflowException
from mlflow.tracking.fluent import start_run
from mlflow.tracking.metric_value_conversion_utils import convert_metric_value_to_float_if_possible


def test_reraised_value_errors():
    multi_item_tf_tensor = tf.random.uniform([2, 2], dtype=tf.float32)

    with pytest.raises(MlflowException, match=r"Failed to convert metric value to float") as e:
        convert_metric_value_to_float_if_possible(multi_item_tf_tensor)

    assert e.value.error_code == ErrorCode.Name(INVALID_PARAMETER_VALUE)


def test_convert_metric_value_to_float():
    tf_tensor_val = tf.random.uniform([], dtype=tf.float32)
    assert convert_metric_value_to_float_if_possible(tf_tensor_val) == float(tf_tensor_val.numpy())


def test_log_tf_tensor_as_metric():
    tf_tensor_val = tf.random.uniform([], dtype=tf.float32)
    tf_tensor_float_val = float(tf_tensor_val.numpy())

    with start_run() as run:
        mlflow.log_metric("name_tf", tf_tensor_val)

    finished_run = tracking.MlflowClient().get_run(run.info.run_id)
    assert finished_run.data.metrics == {"name_tf": tf_tensor_float_val}
```

--------------------------------------------------------------------------------

---[FILE: conftest.py]---
Location: mlflow-master/tests/tracing/conftest.py

```python
import random
import subprocess
import tempfile
import time
from unittest import mock

import pytest

import mlflow
from mlflow.environment_variables import (
    MLFLOW_ENABLE_ASYNC_LOGGING,
    MLFLOW_ENABLE_ASYNC_TRACE_LOGGING,
)


@pytest.fixture(autouse=True)
def reset_active_experiment():
    yield
    mlflow.tracking.fluent._active_experiment_id = None


@pytest.fixture(autouse=True)
def reset_tracking_uri():
    # Some API like set_destination("databricks") updates the tracking URI,
    # we should reset it between tests
    original_tracking_uri = mlflow.get_tracking_uri()

    yield

    mlflow.set_tracking_uri(original_tracking_uri)


@pytest.fixture
def databricks_tracking_uri():
    with mock.patch("mlflow.get_tracking_uri", return_value="databricks"):
        yield


# Fixture to run the test case with and without async logging enabled
@pytest.fixture(params=[True, False])
def async_logging_enabled(request, monkeypatch):
    monkeypatch.setenv(MLFLOW_ENABLE_ASYNC_TRACE_LOGGING.name, str(request.param))
    # TODO: V2 Trace depends on this env var rather than MLFLOW_ENABLE_ASYNC_TRACE_LOGGING
    # We should remove this once the backend is fully migrated to V3
    monkeypatch.setenv(MLFLOW_ENABLE_ASYNC_LOGGING.name, str(request.param))
    return request.param


@pytest.fixture
def otel_collector():
    """Start an OpenTelemetry collector in a Docker container."""
    subprocess.check_call(["docker", "pull", "otel/opentelemetry-collector"])

    # Use a random port to avoid conflicts
    port = random.randint(20000, 30000)

    docker_collector_config = """receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317

exporters:
  debug:
    verbosity: detailed
    sampling_initial: 5
    sampling_thereafter: 1

service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [debug]"""

    with tempfile.NamedTemporaryFile() as output_file:
        # Use echo to pipe config to Docker stdin
        docker_cmd = [
            "bash",
            "-c",
            f'echo "{docker_collector_config}" | '
            f"docker run --rm -p 127.0.0.1:{port}:4317 -i "
            f"otel/opentelemetry-collector --config=/dev/stdin",
        ]

        process = subprocess.Popen(
            docker_cmd,
            stdout=output_file,
            stderr=subprocess.STDOUT,
            text=True,
        )

        # Wait for the collector to start
        time.sleep(5)

        yield process, output_file.name, port

        # Stop the collector
        process.terminate()
        try:
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait()
```

--------------------------------------------------------------------------------

---[FILE: helper.py]---
Location: mlflow-master/tests/tracing/helper.py

```python
import os
import time
import uuid
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass, field
from typing import Any
from unittest import mock

import opentelemetry.trace as trace_api
import pytest
from opentelemetry.sdk.trace import Event, ReadableSpan

import mlflow
from mlflow.entities import Trace, TraceData, TraceInfo
from mlflow.entities.trace_location import TraceLocation
from mlflow.entities.trace_state import TraceState
from mlflow.ml_package_versions import FLAVOR_TO_MODULE_NAME
from mlflow.tracing.client import TracingClient
from mlflow.tracing.constant import TRACE_SCHEMA_VERSION, TRACE_SCHEMA_VERSION_KEY
from mlflow.tracing.export.inference_table import pop_trace
from mlflow.tracing.processor.mlflow_v3 import MlflowV3SpanProcessor
from mlflow.tracing.provider import _get_tracer
from mlflow.tracking.fluent import _get_experiment_id
from mlflow.utils.autologging_utils import AUTOLOGGING_INTEGRATIONS, get_autolog_function
from mlflow.utils.autologging_utils.safety import revert_patches
from mlflow.version import IS_TRACING_SDK_ONLY


def create_mock_otel_span(
    trace_id: int,
    span_id: int,
    name: str = "test_span",
    parent_id: int | None = None,
    start_time: int | None = None,
    end_time: int | None = None,
):
    """
    Create a mock OpenTelemetry span for testing purposes.

    OpenTelemetry doesn't allow creating a span outside of a tracer. So here we create a mock span
    that extends ReadableSpan (data object) and exposes the necessary attributes for testing.
    """

    @dataclass
    class _MockSpanContext:
        trace_id: str
        span_id: str
        trace_flags: trace_api.TraceFlags = trace_api.TraceFlags(1)
        trace_state: trace_api.TraceState = field(default_factory=trace_api.TraceState)

    class _MockOTelSpan(trace_api.Span, ReadableSpan):
        def __init__(
            self,
            name,
            context,
            parent,
            start_time=None,
            end_time=None,
            status=trace_api.Status(trace_api.StatusCode.UNSET),
        ):
            self._name = name
            self._parent = parent
            self._context = context
            self._start_time = start_time if start_time is not None else int(time.time() * 1e9)
            self._end_time = end_time
            self._status = status
            self._attributes = {}
            self._events = []

        # NB: The following methods are defined as abstract method in the Span class.
        def set_attributes(self, attributes):
            self._attributes.update(attributes)

        def set_attribute(self, key, value):
            self._attributes[key] = value

        def set_status(self, status):
            self._status = status

        def add_event(self, name, attributes=None, timestamp=None):
            self._events.append(Event(name, attributes, timestamp))

        def get_span_context(self):
            return self._context

        def is_recording(self):
            return self._end_time is None

        def update_name(self, name):
            self.name = name

        def end(self, end_time_ns=None):
            pass

        def record_exception():
            pass

    return _MockOTelSpan(
        name=name,
        context=_MockSpanContext(trace_id, span_id),
        parent=_MockSpanContext(trace_id, parent_id) if parent_id else None,
        start_time=start_time,
        end_time=end_time,
    )


def create_trace(request_id) -> Trace:
    return Trace(info=create_test_trace_info(request_id), data=TraceData())


def create_test_trace_info(
    trace_id,
    experiment_id="test",
    request_time=0,
    execution_duration=1,
    state=TraceState.OK,
    trace_metadata=None,
    tags=None,
):
    # Add schema version to metadata if not provided, to match real trace creation behavior
    final_metadata = trace_metadata or {}
    if TRACE_SCHEMA_VERSION_KEY not in final_metadata:
        final_metadata = final_metadata.copy()
        final_metadata[TRACE_SCHEMA_VERSION_KEY] = str(TRACE_SCHEMA_VERSION)

    return TraceInfo(
        trace_id=trace_id,
        trace_location=TraceLocation.from_experiment_id(experiment_id),
        request_time=request_time,
        execution_duration=execution_duration,
        state=state,
        trace_metadata=final_metadata,
        tags=tags or {},
    )


def create_test_trace_info_with_uc_table(
    trace_id: str, catalog_name: str, schema_name: str
) -> TraceInfo:
    return TraceInfo(
        trace_id=trace_id,
        trace_location=TraceLocation.from_databricks_uc_schema(catalog_name, schema_name),
        request_time=0,
        execution_duration=1,
        state=TraceState.OK,
        trace_metadata={TRACE_SCHEMA_VERSION_KEY: str(TRACE_SCHEMA_VERSION)},
        tags={},
    )


def get_traces(experiment_id=None) -> list[Trace]:
    # Get all traces from the backend
    return TracingClient().search_traces(
        locations=[experiment_id or _get_experiment_id()],
    )


def purge_traces(experiment_id=None):
    if len(get_traces(experiment_id)) == 0:
        return

    # Delete all traces from the backend
    TracingClient().delete_traces(
        experiment_id=experiment_id or _get_experiment_id(),
        max_traces=1000,
        max_timestamp_millis=int(time.time() * 1000),
    )


def get_tracer_tracking_uri() -> str | None:
    """Get current tracking URI configured as the trace export destination."""
    from opentelemetry import trace

    tracer = _get_tracer(__name__)
    if isinstance(tracer, trace.ProxyTracer):
        tracer = tracer._tracer
    span_processor = tracer.span_processor._span_processors[0]

    if isinstance(span_processor, MlflowV3SpanProcessor):
        return span_processor.span_exporter._client.tracking_uri


@pytest.fixture
def reset_autolog_state():
    """Reset autologging state to avoid interference between tests"""
    yield

    for flavor in FLAVOR_TO_MODULE_NAME:
        # 1. Remove post-import hooks (registered by global mlflow.autolog() function)
        mlflow.utils.import_hooks._post_import_hooks.pop(flavor, None)

    for flavor in AUTOLOGGING_INTEGRATIONS.keys():
        # 2. Disable autologging for the flavor. This is necessary because some autologging
        #    update global settings (e.g. callbacks) and we need to revert them.
        try:
            if autolog := get_autolog_function(flavor):
                autolog(disable=True)
        except ImportError:
            pass

        # 3. Revert any patches applied by autologging
        revert_patches(flavor)

    AUTOLOGGING_INTEGRATIONS.clear()


def score_in_model_serving(model_uri: str, model_input: dict[str, Any]):
    """
    A helper function to emulate model prediction inside a Databricks model serving environment.

    This is highly simplified version, but captures important aspects for testing tracing:
      1. Setting env vars that users set for enable tracing in model serving
      2. Load the model in a background thread
    """
    from mlflow.pyfunc.context import Context, set_prediction_context

    with mock.patch.dict(
        "os.environ",
        os.environ | {"IS_IN_DB_MODEL_SERVING_ENV": "true", "ENABLE_MLFLOW_TRACING": "true"},
        clear=True,
    ):
        # Reset tracing setup to start fresh w/ model serving environment
        mlflow.tracing.reset()

        def _load_model():
            return mlflow.pyfunc.load_model(model_uri)

        with ThreadPoolExecutor(max_workers=1) as executor:
            model = executor.submit(_load_model).result()

        # Score the model
        request_id = uuid.uuid4().hex
        with set_prediction_context(Context(request_id=request_id)):
            predictions = model.predict(model_input)

        trace = pop_trace(request_id)
        return (request_id, predictions, trace)


def skip_when_testing_trace_sdk(f):
    # Decorator to Skip the test if only mlflow-tracing package is installed and
    # not the full mlflow package.
    msg = "Skipping test because it requires mlflow or mlflow-skinny to be installed."
    skip_decorator = pytest.mark.skipif(IS_TRACING_SDK_ONLY, reason=msg)
    return skip_decorator(f)


def skip_module_when_testing_trace_sdk():
    """Skip the entire module if only mlflow-tracing package is installed"""
    if IS_TRACING_SDK_ONLY:
        pytest.skip(
            "Skipping test because it requires mlflow or mlflow-skinny to be installed.",
            allow_module_level=True,
        )


V2_TRACE_DICT = {
    "info": {
        "request_id": "58f4e27101304034b15c512b603bf1b2",
        "experiment_id": "0",
        "timestamp_ms": 100,
        "execution_time_ms": 200,
        "status": "OK",
        "request_metadata": {
            "mlflow.trace_schema.version": "2",
            "mlflow.traceInputs": '{"x": 2, "y": 5}',
            "mlflow.traceOutputs": "8",
        },
        "tags": {
            "mlflow.source.name": "test",
            "mlflow.source.type": "LOCAL",
            "mlflow.traceName": "predict",
            "mlflow.artifactLocation": "/path/to/artifact",
        },
        "assessments": [],
    },
    "data": {
        "spans": [
            {
                "name": "predict",
                "context": {
                    "span_id": "0d48a6670588966b",
                    "trace_id": "63076d0c1b90f1df0970f897dc428bd6",
                },
                "parent_id": None,
                "start_time": 100,
                "end_time": 200,
                "status_code": "OK",
                "status_message": "",
                "attributes": {
                    "mlflow.traceRequestId": '"58f4e27101304034b15c512b603bf1b2"',
                    "mlflow.spanType": '"UNKNOWN"',
                    "mlflow.spanFunctionName": '"predict"',
                    "mlflow.spanInputs": '{"x": 2, "y": 5}',
                    "mlflow.spanOutputs": "8",
                },
                "events": [],
            },
            {
                "name": "add_one_with_custom_name",
                "context": {
                    "span_id": "6fc32f36ef591f60",
                    "trace_id": "63076d0c1b90f1df0970f897dc428bd6",
                },
                "parent_id": "0d48a6670588966b",
                "start_time": 300,
                "end_time": 400,
                "status_code": "OK",
                "status_message": "",
                "attributes": {
                    "mlflow.traceRequestId": '"58f4e27101304034b15c512b603bf1b2"',
                    "mlflow.spanType": '"LLM"',
                    "delta": "1",
                    "metadata": '{"foo": "bar"}',
                    "datetime": '"2025-04-29 08:37:06.772253"',
                    "mlflow.spanFunctionName": '"add_one"',
                    "mlflow.spanInputs": '{"z": 7}',
                    "mlflow.spanOutputs": "8",
                },
                "events": [],
            },
        ],
        "request": '{"x": 2, "y": 5}',
        "response": "8",
    },
}
```

--------------------------------------------------------------------------------

---[FILE: test_archival.py]---
Location: mlflow-master/tests/tracing/test_archival.py

```python
from unittest import mock

import pytest

from mlflow.tracing.archival import (
    disable_databricks_trace_archival,
    enable_databricks_trace_archival,
)
from mlflow.version import IS_TRACING_SDK_ONLY

if IS_TRACING_SDK_ONLY:
    pytest.skip("Databricks archival enablement requires skinny", allow_module_level=True)


def test_enable_databricks_trace_archival_import_error():
    with mock.patch.dict("sys.modules", {"databricks.agents.archive": None}):
        with pytest.raises(ImportError, match="databricks-agents"):
            enable_databricks_trace_archival(
                experiment_id="123", delta_table_fullname="catalog.schema.table"
            )


def test_disable_databricks_trace_archival_import_error():
    with mock.patch.dict("sys.modules", {"databricks.agents.archive": None}):
        with pytest.raises(ImportError, match="databricks-agents"):
            disable_databricks_trace_archival(experiment_id="123")


def test_enable_databricks_trace_archival_with_explicit_experiment_id():
    mock_enable = mock.MagicMock()
    with mock.patch.dict(
        "sys.modules",
        {"databricks.agents.archive": mock.MagicMock(enable_trace_archival=mock_enable)},
    ):
        enable_databricks_trace_archival(
            experiment_id="123", delta_table_fullname="catalog.schema.table"
        )
        mock_enable.assert_called_once_with(
            experiment_id="123", table_fullname="catalog.schema.table"
        )


def test_enable_databricks_trace_archival_with_default_experiment_id():
    mock_enable = mock.MagicMock()
    with (
        mock.patch.dict(
            "sys.modules",
            {"databricks.agents.archive": mock.MagicMock(enable_trace_archival=mock_enable)},
        ),
        mock.patch("mlflow.tracking.fluent._get_experiment_id", return_value="default_exp"),
    ):
        enable_databricks_trace_archival(delta_table_fullname="catalog.schema.table")
        mock_enable.assert_called_once_with(
            experiment_id="default_exp", table_fullname="catalog.schema.table"
        )


def test_disable_databricks_trace_archival_with_explicit_experiment_id():
    mock_disable = mock.MagicMock()
    with mock.patch.dict(
        "sys.modules",
        {"databricks.agents.archive": mock.MagicMock(disable_trace_archival=mock_disable)},
    ):
        disable_databricks_trace_archival(experiment_id="123")
        mock_disable.assert_called_once_with(experiment_id="123")


def test_disable_databricks_trace_archival_with_default_experiment_id():
    mock_disable = mock.MagicMock()
    with (
        mock.patch.dict(
            "sys.modules",
            {"databricks.agents.archive": mock.MagicMock(disable_trace_archival=mock_disable)},
        ),
        mock.patch("mlflow.tracking.fluent._get_experiment_id", return_value="default_exp"),
    ):
        disable_databricks_trace_archival()
        mock_disable.assert_called_once_with(experiment_id="default_exp")
```

--------------------------------------------------------------------------------

````
