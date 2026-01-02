---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 247
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 247 of 991)

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

---[FILE: callback.py]---
Location: mlflow-master/mlflow/dspy/callback.py

```python
import logging
import threading
from collections import defaultdict
from functools import wraps
from typing import Any

import dspy
from dspy.utils.callback import BaseCallback

import mlflow
from mlflow.dspy.constant import FLAVOR_NAME
from mlflow.dspy.util import log_dspy_lm_state, log_dspy_module_params, save_dspy_module_state
from mlflow.entities import SpanStatusCode, SpanType
from mlflow.entities.run_status import RunStatus
from mlflow.entities.span_event import SpanEvent
from mlflow.exceptions import MlflowException
from mlflow.tracing.constant import SpanAttributeKey, TokenUsageKey
from mlflow.tracing.fluent import start_span_no_context
from mlflow.tracing.provider import detach_span_from_context, set_span_in_context
from mlflow.tracing.utils import maybe_set_prediction_context
from mlflow.tracing.utils.token import SpanWithToken
from mlflow.utils import _get_fully_qualified_class_name
from mlflow.utils.autologging_utils import (
    get_autologging_config,
)
from mlflow.version import IS_TRACING_SDK_ONLY

_logger = logging.getLogger(__name__)
_lock = threading.Lock()


def skip_if_trace_disabled(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if get_autologging_config(FLAVOR_NAME, "log_traces"):
            func(*args, **kwargs)

    return wrapper


def _convert_signature(val):
    # serialization of dspy.Signature is quite slow, so we should convert it to string
    if isinstance(val, type) and issubclass(val, dspy.Signature):
        return repr(val)
    return val


class MlflowCallback(BaseCallback):
    """Callback for generating MLflow traces for DSPy components"""

    def __init__(self, dependencies_schema: dict[str, Any] | None = None):
        self._dependencies_schema = dependencies_schema
        # call_id: (LiveSpan, OTel token)
        self._call_id_to_span: dict[str, SpanWithToken] = {}
        self._call_id_to_module: dict[str, Any] = {}

        ###### state management for optimization process ######
        # The current callback logic assumes there is no optimization running in parallel.
        # The state management may not work when multiple optimizations are running in parallel.
        # optimizer_stack_level is used to determine if the callback is called within compile
        # we cannot use boolean flag because the callback can be nested
        self.optimizer_stack_level = 0
        # call_id: (key, step)
        self._call_id_to_metric_key: dict[str, tuple[str, int]] = {}
        self._evaluation_counter = defaultdict(int)
        self._disabled_eval_call_ids = set()
        self._eval_runs_started: set[str] = set()

    def set_dependencies_schema(self, dependencies_schema: dict[str, Any]):
        if self._dependencies_schema:
            raise MlflowException(
                "Dependencies schema should be set only once to the callback.",
                error_code=MlflowException.INVALID_PARAMETER_VALUE,
            )
        self._dependencies_schema = dependencies_schema

    @skip_if_trace_disabled
    def on_module_start(self, call_id: str, instance: Any, inputs: dict[str, Any]):
        span_type = self._get_span_type_for_module(instance)
        attributes = self._get_span_attribute_for_module(instance)

        # The __call__ method of dspy.Module has a signature of (self, *args, **kwargs),
        # while all built-in modules only accepts keyword arguments. To avoid recording
        # empty "args" key in the inputs, we remove it if it's empty.
        if "args" in inputs and not inputs["args"]:
            inputs.pop("args")

        self._start_span(
            call_id,
            name=f"{instance.__class__.__name__}.forward",
            span_type=span_type,
            inputs=self._unpack_kwargs(inputs),
            attributes=attributes,
        )
        self._call_id_to_module[call_id] = instance

    @skip_if_trace_disabled
    def on_module_end(self, call_id: str, outputs: Any | None, exception: Exception | None = None):
        instance = self._call_id_to_module.pop(call_id)
        attributes = {}

        if _get_fully_qualified_class_name(instance) == "dspy.retrieve.databricks_rm.DatabricksRM":
            from mlflow.entities.document import Document

            if isinstance(outputs, dspy.Prediction):
                # Convert outputs to MLflow document format to make it compatible with
                # agent evaluation.
                num_docs = len(outputs.doc_ids)
                doc_uris = outputs.doc_uris if outputs.doc_uris is not None else [None] * num_docs
                outputs = [
                    Document(
                        page_content=doc_content,
                        metadata={
                            "doc_id": doc_id,
                            "doc_uri": doc_uri,
                        }
                        | extra_column_dict,
                        id=doc_id,
                    ).to_dict()
                    for doc_content, doc_id, doc_uri, extra_column_dict in zip(
                        outputs.docs,
                        outputs.doc_ids,
                        doc_uris,
                        outputs.extra_columns,
                    )
                ]
        else:
            # NB: DSPy's Prediction object is a customized dictionary-like object, but its repr
            # is not easy to read on UI. Therefore, we unpack it to a dictionary.
            # https://github.com/stanfordnlp/dspy/blob/6fe693528323c9c10c82d90cb26711a985e18b29/dspy/primitives/prediction.py#L21-L28
            if isinstance(outputs, dspy.Prediction):
                usage_by_model = (
                    outputs.get_lm_usage() if hasattr(outputs, "get_lm_usage") else None
                )
                outputs = outputs.toDict()
                if usage_by_model:
                    usage_data = {
                        TokenUsageKey.INPUT_TOKENS: 0,
                        TokenUsageKey.OUTPUT_TOKENS: 0,
                        TokenUsageKey.TOTAL_TOKENS: 0,
                    }
                    for usage in usage_by_model.values():
                        usage_data[TokenUsageKey.INPUT_TOKENS] += usage.get("prompt_tokens", 0)
                        usage_data[TokenUsageKey.OUTPUT_TOKENS] += usage.get("completion_tokens", 0)
                        usage_data[TokenUsageKey.TOTAL_TOKENS] += usage.get("total_tokens", 0)
                    attributes[SpanAttributeKey.CHAT_USAGE] = usage_data
        self._end_span(call_id, outputs, exception, attributes)

    @skip_if_trace_disabled
    def on_lm_start(self, call_id: str, instance: Any, inputs: dict[str, Any]):
        span_type = (
            SpanType.CHAT_MODEL if getattr(instance, "model_type", None) == "chat" else SpanType.LLM
        )

        filtered_kwargs = {
            key: value
            for key, value in instance.kwargs.items()
            if key not in {"api_key", "api_base"}
        }
        attributes = {
            **filtered_kwargs,
            "model": instance.model,
            "model_type": instance.model_type,
            "cache": instance.cache,
            SpanAttributeKey.MESSAGE_FORMAT: "dspy",
        }

        inputs = self._unpack_kwargs(inputs)

        self._start_span(
            call_id,
            name=f"{instance.__class__.__name__}.__call__",
            span_type=span_type,
            inputs=inputs,
            attributes=attributes,
        )

    @skip_if_trace_disabled
    def on_lm_end(self, call_id: str, outputs: Any | None, exception: Exception | None = None):
        self._end_span(call_id, outputs, exception)

    @skip_if_trace_disabled
    def on_adapter_format_start(self, call_id: str, instance: Any, inputs: dict[str, Any]):
        self._start_span(
            call_id,
            name=f"{instance.__class__.__name__}.format",
            span_type=SpanType.PARSER,
            inputs=self._unpack_kwargs(inputs),
            attributes={},
        )

    @skip_if_trace_disabled
    def on_adapter_format_end(
        self, call_id: str, outputs: Any | None, exception: Exception | None = None
    ):
        self._end_span(call_id, outputs, exception)

    @skip_if_trace_disabled
    def on_adapter_parse_start(self, call_id: str, instance: Any, inputs: dict[str, Any]):
        self._start_span(
            call_id,
            name=f"{instance.__class__.__name__}.parse",
            span_type=SpanType.PARSER,
            inputs=self._unpack_kwargs(inputs),
            attributes={},
        )

    @skip_if_trace_disabled
    def on_adapter_parse_end(
        self, call_id: str, outputs: Any | None, exception: Exception | None = None
    ):
        self._end_span(call_id, outputs, exception)

    @skip_if_trace_disabled
    def on_tool_start(self, call_id: str, instance: Any, inputs: dict[str, Any]):
        # DSPy uses the special "finish" tool to signal the end of the agent.
        if instance.name == "finish":
            return

        inputs = self._unpack_kwargs(inputs)
        # Tools are always called with keyword arguments only.
        inputs.pop("args", None)

        self._start_span(
            call_id,
            name=f"Tool.{instance.name}",
            span_type=SpanType.TOOL,
            inputs=inputs,
            attributes={
                "name": instance.name,
                "description": instance.desc,
                "args": instance.args,
            },
        )

    @skip_if_trace_disabled
    def on_tool_end(self, call_id: str, outputs: Any | None, exception: Exception | None = None):
        if call_id in self._call_id_to_span:
            self._end_span(call_id, outputs, exception)

    def on_evaluate_start(self, call_id: str, instance: Any, inputs: dict[str, Any]):
        """
        Callback handler at the beginning of evaluation call. Available with DSPy>=2.6.9.
        This callback starts a nested run for each evaluation call inside optimization.
        If called outside optimization and no active run exists, it creates a new run.
        """
        if not get_autologging_config(FLAVOR_NAME, "log_evals"):
            return

        key = "eval"
        if callback_metadata := inputs.get("callback_metadata"):
            if "metric_key" in callback_metadata:
                key = callback_metadata["metric_key"]
            if callback_metadata.get("disable_logging"):
                self._disabled_eval_call_ids.add(call_id)
                return
        started_run = False
        if self.optimizer_stack_level > 0:
            with _lock:
                # we may want to include optimizer_stack_level in the key
                # to handle nested optimization
                step = self._evaluation_counter[key]
                self._evaluation_counter[key] += 1
            self._call_id_to_metric_key[call_id] = (key, step)
            mlflow.start_run(run_name=f"{key}_{step}", nested=True)
            started_run = True
        elif mlflow.active_run() is None:
            mlflow.start_run(run_name=key, nested=True)
            started_run = True

        if started_run:
            self._eval_runs_started.add(call_id)
        if program := inputs.get("program"):
            save_dspy_module_state(program, "model.json")
            log_dspy_module_params(program)

        # Log the current DSPy LM state
        log_dspy_lm_state()

    def on_evaluate_end(
        self,
        call_id: str,
        outputs: Any,
        exception: Exception | None = None,
    ):
        """
        Callback handler at the end of evaluation call. Available with DSPy>=2.6.9.
        This callback logs the evaluation score to the individual run
        and add eval metric to the parent run if called inside optimization.
        """
        if not get_autologging_config(FLAVOR_NAME, "log_evals"):
            return
        if call_id in self._disabled_eval_call_ids:
            self._disabled_eval_call_ids.discard(call_id)
            return
        run_started = call_id in self._eval_runs_started
        if exception:
            if run_started:
                mlflow.end_run(status=RunStatus.to_string(RunStatus.FAILED))
                self._eval_runs_started.discard(call_id)
            return
        score = None
        if isinstance(outputs, float):
            score = outputs
        elif isinstance(outputs, tuple):
            score = outputs[0]
        elif isinstance(outputs, dspy.Prediction):
            score = float(outputs)
            try:
                mlflow.log_table(self._generate_result_table(outputs.results), "result_table.json")
            except Exception:
                _logger.debug("Failed to log result table.", exc_info=True)
        if score is not None:
            mlflow.log_metric("eval", score)

        if run_started:
            mlflow.end_run()
            self._eval_runs_started.discard(call_id)
        # Log the evaluation score to the parent run if called inside optimization
        if self.optimizer_stack_level > 0 and mlflow.active_run() is not None:
            if call_id not in self._call_id_to_metric_key:
                return
            key, step = self._call_id_to_metric_key.pop(call_id)
            if score is not None:
                mlflow.log_metric(
                    key,
                    score,
                    step=step,
                )

    def reset(self):
        self._call_id_to_metric_key: dict[str, tuple[str, int]] = {}
        self._evaluation_counter = defaultdict(int)
        self._eval_runs_started = set()

    def _start_span(
        self,
        call_id: str,
        name: str,
        span_type: SpanType,
        inputs: dict[str, Any],
        attributes: dict[str, Any],
    ):
        if not IS_TRACING_SDK_ONLY:
            from mlflow.pyfunc.context import get_prediction_context

            prediction_context = get_prediction_context()
            if prediction_context and self._dependencies_schema:
                prediction_context.update(**self._dependencies_schema)
        else:
            prediction_context = None

        with maybe_set_prediction_context(prediction_context):
            span = start_span_no_context(
                name=name,
                span_type=span_type,
                parent_span=mlflow.get_current_active_span(),
                inputs=inputs,
                attributes=attributes,
            )

        token = set_span_in_context(span)
        self._call_id_to_span[call_id] = SpanWithToken(span, token)

        return span

    def _end_span(
        self,
        call_id: str,
        outputs: Any | None,
        exception: Exception | None = None,
        attributes: dict[str, Any] | None = None,
    ):
        st = self._call_id_to_span.pop(call_id, None)

        if not st.span:
            _logger.warning(f"Failed to end a span. Span not found for call_id: {call_id}")
            return

        status = SpanStatusCode.OK if exception is None else SpanStatusCode.ERROR

        if exception:
            st.span.add_event(SpanEvent.from_exception(exception))

        if attributes:
            st.span.set_attributes(attributes)

        try:
            st.span.end(outputs=outputs, status=status)
        finally:
            detach_span_from_context(st.token)

    def _get_span_type_for_module(self, instance):
        if isinstance(instance, dspy.Retrieve):
            return SpanType.RETRIEVER
        elif isinstance(instance, dspy.ReAct):
            return SpanType.AGENT
        elif isinstance(instance, dspy.Predict):
            return SpanType.LLM
        elif isinstance(instance, dspy.Adapter):
            return SpanType.PARSER
        else:
            return SpanType.CHAIN

    def _get_span_attribute_for_module(self, instance):
        if isinstance(instance, dspy.Predict):
            return {"signature": instance.signature.signature}
        elif isinstance(instance, dspy.ChainOfThought):
            if hasattr(instance, "signature"):
                signature = instance.signature.signature
            else:
                signature = instance.predict.signature.signature

            attributes = {"signature": signature}
            if hasattr(instance, "extended_signature"):
                attributes["extended_signature"] = instance.extended_signature.signature
            return attributes
        return {}

    def _unpack_kwargs(self, inputs: dict[str, Any]) -> dict[str, Any]:
        """Unpacks the kwargs from the inputs dictionary"""
        # NB: Not using pop() to avoid modifying the original inputs dictionary
        kwargs = inputs.get("kwargs", {})
        inputs_wo_kwargs = {k: v for k, v in inputs.items() if k != "kwargs"}
        merged = {**inputs_wo_kwargs, **kwargs}
        return {k: _convert_signature(v) for k, v in merged.items()}

    def _generate_result_table(
        self, outputs: list[tuple[dspy.Example, dspy.Prediction, Any]]
    ) -> dict[str, list[Any]]:
        result = {"score": []}
        for i, (example, prediction, score) in enumerate(outputs):
            for k, v in example.items():
                if f"example_{k}" not in result:
                    result[f"example_{k}"] = [None] * i
                result[f"example_{k}"].append(v)

            for k, v in prediction.items():
                if f"pred_{k}" not in result:
                    result[f"pred_{k}"] = [None] * i
                result[f"pred_{k}"].append(v)

            result["score"].append(score)

            for k, v in result.items():
                if len(v) != i + 1:
                    result[k].append(None)

        return result
```

--------------------------------------------------------------------------------

---[FILE: constant.py]---
Location: mlflow-master/mlflow/dspy/constant.py

```python
FLAVOR_NAME = "dspy"
```

--------------------------------------------------------------------------------

---[FILE: load.py]---
Location: mlflow-master/mlflow/dspy/load.py

```python
import logging
import os

import cloudpickle

from mlflow.models import Model
from mlflow.models.dependencies_schemas import _get_dependencies_schema_from_model
from mlflow.models.model import _update_active_model_id_based_on_mlflow_model
from mlflow.tracing.provider import trace_disabled
from mlflow.tracking.artifact_utils import _download_artifact_from_uri
from mlflow.utils.model_utils import (
    _add_code_from_conf_to_system_path,
    _get_flavor_configuration,
)

_DEFAULT_MODEL_PATH = "data/model.pkl"
_logger = logging.getLogger(__name__)


def _set_dependency_schema_to_tracer(model_path, callbacks):
    """
    Set dependency schemas from the saved model metadata to the tracer
    to propagate it to inference traces.
    """
    from mlflow.dspy.callback import MlflowCallback

    tracer = next((cb for cb in callbacks if isinstance(cb, MlflowCallback)), None)
    if tracer is None:
        return

    model = Model.load(model_path)
    tracer.set_dependencies_schema(_get_dependencies_schema_from_model(model))


def _load_model(model_uri, dst_path=None):
    local_model_path = _download_artifact_from_uri(artifact_uri=model_uri, output_path=dst_path)
    mlflow_model = Model.load(local_model_path)
    flavor_conf = _get_flavor_configuration(model_path=local_model_path, flavor_name="dspy")

    _add_code_from_conf_to_system_path(local_model_path, flavor_conf)
    model_path = flavor_conf.get("model_path", _DEFAULT_MODEL_PATH)
    with open(os.path.join(local_model_path, model_path), "rb") as f:
        loaded_wrapper = cloudpickle.load(f)

    _set_dependency_schema_to_tracer(local_model_path, loaded_wrapper.dspy_settings["callbacks"])
    _update_active_model_id_based_on_mlflow_model(mlflow_model)
    return loaded_wrapper


@trace_disabled  # Suppress traces for internal calls while loading model
def load_model(model_uri, dst_path=None):
    """
    Load a Dspy model from a run.

    This function will also set the global dspy settings `dspy.settings` by the saved settings.

    Args:
        model_uri: The location, in URI format, of the MLflow model. For example:

            - ``/Users/me/path/to/local/model``
            - ``relative/path/to/local/model``
            - ``s3://my_bucket/path/to/model``
            - ``runs:/<mlflow_run_id>/run-relative/path/to/model``
            - ``mlflow-artifacts:/path/to/model``

            For more information about supported URI schemes, see
            `Referencing Artifacts <https://www.mlflow.org/docs/latest/tracking.html#
            artifact-locations>`_.
        dst_path: The local filesystem path to utilize for downloading the model artifact.
            This directory must already exist if provided. If unspecified, a local output
            path will be created.

    Returns:
        An `dspy.module` instance, representing the dspy model.
    """
    import dspy

    wrapper = _load_model(model_uri, dst_path)

    # Set the global dspy settings for reproducing the model's behavior when the model is
    # loaded via `mlflow.dspy.load_model`. Note that for the model to be loaded as pyfunc,
    # settings will be set in the wrapper's `predict` method via local context to avoid the
    # "dspy.settings can only be changed by the thread that initially configured it" error
    # in Databricks model serving.
    dspy.settings.configure(**wrapper.dspy_settings)

    return wrapper.model


def _load_pyfunc(path):
    return _load_model(path)
```

--------------------------------------------------------------------------------

---[FILE: save.py]---
Location: mlflow-master/mlflow/dspy/save.py

```python
"""Functions for saving DSPY models to MLflow."""

import os
from pathlib import Path
from typing import Any

import cloudpickle
import yaml

import mlflow
from mlflow import pyfunc
from mlflow.dspy.constant import FLAVOR_NAME
from mlflow.dspy.wrapper import DspyChatModelWrapper, DspyModelWrapper
from mlflow.entities.model_registry.prompt import Prompt
from mlflow.exceptions import INVALID_PARAMETER_VALUE, MlflowException
from mlflow.models import (
    Model,
    ModelInputExample,
    ModelSignature,
    infer_pip_requirements,
)
from mlflow.models.dependencies_schemas import _get_dependencies_schemas
from mlflow.models.model import MLMODEL_FILE_NAME
from mlflow.models.rag_signatures import SIGNATURE_FOR_LLM_INFERENCE_TASK
from mlflow.models.resources import Resource, _ResourceBuilder
from mlflow.models.signature import _infer_signature_from_input_example
from mlflow.models.utils import _save_example
from mlflow.tracing.provider import trace_disabled
from mlflow.tracking._model_registry import DEFAULT_AWAIT_MAX_SLEEP_SECONDS
from mlflow.types.schema import DataType
from mlflow.utils.docstring_utils import LOG_MODEL_PARAM_DOCS, format_docstring
from mlflow.utils.environment import (
    _CONDA_ENV_FILE_NAME,
    _CONSTRAINTS_FILE_NAME,
    _PYTHON_ENV_FILE_NAME,
    _REQUIREMENTS_FILE_NAME,
    _mlflow_conda_env,
    _process_conda_env,
    _process_pip_requirements,
    _PythonEnv,
)
from mlflow.utils.file_utils import get_total_file_size, write_to
from mlflow.utils.model_utils import (
    _validate_and_copy_code_paths,
    _validate_and_prepare_target_save_path,
)
from mlflow.utils.requirements_utils import _get_pinned_requirement

_MODEL_SAVE_PATH = "model"
_MODEL_DATA_PATH = "data"


def get_default_pip_requirements():
    """
    Returns:
        A list of default pip requirements for MLflow Models produced by Dspy flavor. Calls to
        `save_model()` and `log_model()` produce a pip environment that, at minimum, contains these
        requirements.
    """
    return [_get_pinned_requirement("dspy")]


def get_default_conda_env():
    """
    Returns:
        The default Conda environment for MLflow Models produced by calls to `save_model()` and
        `log_model()`.
    """
    return _mlflow_conda_env(additional_pip_deps=get_default_pip_requirements())


@format_docstring(LOG_MODEL_PARAM_DOCS.format(package_name=FLAVOR_NAME))
@trace_disabled  # Suppress traces for internal predict calls while logging model
def save_model(
    model,
    path: str,
    task: str | None = None,
    model_config: dict[str, Any] | None = None,
    code_paths: list[str] | None = None,
    mlflow_model: Model | None = None,
    conda_env: list[str] | str | None = None,
    signature: ModelSignature | None = None,
    input_example: ModelInputExample | None = None,
    pip_requirements: list[str] | str | None = None,
    extra_pip_requirements: list[str] | str | None = None,
    metadata: dict[str, Any] | None = None,
    resources: str | Path | list[Resource] | None = None,
):
    """
    Save a Dspy model.

    This method saves a Dspy model along with metadata such as model signature and conda
    environments to local file system. This method is called inside `mlflow.dspy.log_model()`.

    Args:
        model: an instance of `dspy.Module`. The Dspy model/module to be saved.
        path: local path where the MLflow model is to be saved.
        task: defaults to None. The task type of the model. Can only be `llm/v1/chat` or None for
            now.
        model_config: keyword arguments to be passed to the Dspy Module at instantiation.
        code_paths: {{ code_paths }}
        mlflow_model: an instance of `mlflow.models.Model`, defaults to None. MLflow model
            configuration to which to add the Dspy model metadata. If None, a blank instance will
            be created.
        conda_env: {{ conda_env }}
        signature: {{ signature }}
        input_example: {{ input_example }}
        pip_requirements: {{ pip_requirements }}
        extra_pip_requirements: {{ extra_pip_requirements }}
        metadata: {{ metadata }}
        resources: A list of model resources or a resources.yaml file containing a list of
            resources required to serve the model.
    """

    import dspy

    from mlflow.transformers.llm_inference_utils import (
        _LLM_INFERENCE_TASK_KEY,
        _METADATA_LLM_INFERENCE_TASK_KEY,
    )

    if signature:
        num_inputs = len(signature.inputs.inputs)
        if num_inputs == 0:
            raise MlflowException(
                "The model signature's input schema must contain at least one field.",
                error_code=INVALID_PARAMETER_VALUE,
            )
    if task and task not in SIGNATURE_FOR_LLM_INFERENCE_TASK:
        raise MlflowException(
            "Invalid task: {task} at `mlflow.dspy.save_model()` call. The task must be None or one "
            f"of: {list(SIGNATURE_FOR_LLM_INFERENCE_TASK.keys())}",
            error_code=INVALID_PARAMETER_VALUE,
        )

    if mlflow_model is None:
        mlflow_model = Model()
    if signature is not None:
        mlflow_model.signature = signature
    saved_example = None
    if input_example is not None:
        path = os.path.abspath(path)
        _validate_and_prepare_target_save_path(path)
        saved_example = _save_example(mlflow_model, input_example, path)
    if metadata is not None:
        mlflow_model.metadata = metadata

    with _get_dependencies_schemas() as dependencies_schemas:
        schema = dependencies_schemas.to_dict()
        if schema is not None:
            if mlflow_model.metadata is None:
                mlflow_model.metadata = {}
            mlflow_model.metadata.update(schema)

    model_data_subpath = _MODEL_DATA_PATH
    # Construct new data folder in existing path.
    data_path = os.path.join(path, model_data_subpath)
    os.makedirs(data_path, exist_ok=True)
    # Set the model path to end with ".pkl" as we use cloudpickle for serialization.
    model_subpath = os.path.join(model_data_subpath, _MODEL_SAVE_PATH) + ".pkl"
    model_path = os.path.join(path, model_subpath)
    # Dspy has a global context `dspy.settings`, and we need to save it along with the model.
    dspy_settings = dict(dspy.settings.config)

    # Don't save the trace in the model, which is only useful during the training phase.
    dspy_settings.pop("trace", None)

    # Store both dspy model and settings in `DspyChatModelWrapper` or `DspyModelWrapper` for
    # serialization.
    if task == "llm/v1/chat":
        wrapped_dspy_model = DspyChatModelWrapper(model, dspy_settings, model_config)
    else:
        wrapped_dspy_model = DspyModelWrapper(model, dspy_settings, model_config)

    flavor_options = {
        "model_path": model_subpath,
    }

    if task:
        if mlflow_model.signature is None:
            mlflow_model.signature = SIGNATURE_FOR_LLM_INFERENCE_TASK[task]
        flavor_options.update({_LLM_INFERENCE_TASK_KEY: task})
        if mlflow_model.metadata:
            mlflow_model.metadata[_METADATA_LLM_INFERENCE_TASK_KEY] = task
        else:
            mlflow_model.metadata = {_METADATA_LLM_INFERENCE_TASK_KEY: task}

    if saved_example and mlflow_model.signature is None:
        signature = _infer_signature_from_input_example(saved_example, wrapped_dspy_model)
        mlflow_model.signature = signature

    streamable = False
    # Set the output schema to the model wrapper to use it for streaming
    if mlflow_model.signature and mlflow_model.signature.outputs:
        wrapped_dspy_model.output_schema = mlflow_model.signature.outputs
        # DSPy streaming only supports string outputs.
        if all(spec.type == DataType.string for spec in mlflow_model.signature.outputs):
            streamable = True

    with open(model_path, "wb") as f:
        cloudpickle.dump(wrapped_dspy_model, f)

    code_dir_subpath = _validate_and_copy_code_paths(code_paths, path)

    # Add flavor info to `mlflow_model`.
    mlflow_model.add_flavor(FLAVOR_NAME, code=code_dir_subpath, **flavor_options)
    # Add loader_module, data and env data to `mlflow_model`.
    pyfunc.add_to_model(
        mlflow_model,
        loader_module="mlflow.dspy",
        code=code_dir_subpath,
        conda_env=_CONDA_ENV_FILE_NAME,
        python_env=_PYTHON_ENV_FILE_NAME,
        streamable=streamable,
    )

    # Add model file size to `mlflow_model`.
    if size := get_total_file_size(path):
        mlflow_model.model_size_bytes = size

    # Add resources if specified.
    if resources is not None:
        if isinstance(resources, (Path, str)):
            serialized_resource = _ResourceBuilder.from_yaml_file(resources)
        else:
            serialized_resource = _ResourceBuilder.from_resources(resources)

        mlflow_model.resources = serialized_resource

    # Save mlflow_model to path/MLmodel.
    mlflow_model.save(os.path.join(path, MLMODEL_FILE_NAME))

    if conda_env is None:
        if pip_requirements is None:
            default_reqs = get_default_pip_requirements()
            # To ensure `_load_pyfunc` can successfully load the model during the dependency
            # inference, `mlflow_model.save` must be called beforehand to save an MLmodel file.
            inferred_reqs = infer_pip_requirements(path, FLAVOR_NAME, fallback=default_reqs)
            default_reqs = sorted(set(inferred_reqs).union(default_reqs))
        else:
            default_reqs = None
        conda_env, pip_requirements, pip_constraints = _process_pip_requirements(
            default_reqs,
            pip_requirements,
            extra_pip_requirements,
        )
    else:
        conda_env, pip_requirements, pip_constraints = _process_conda_env(conda_env)

    with open(os.path.join(path, _CONDA_ENV_FILE_NAME), "w") as f:
        yaml.safe_dump(conda_env, stream=f, default_flow_style=False)

    # Save `constraints.txt` if necessary.
    if pip_constraints:
        write_to(os.path.join(path, _CONSTRAINTS_FILE_NAME), "\n".join(pip_constraints))

    # Save `requirements.txt`.
    write_to(os.path.join(path, _REQUIREMENTS_FILE_NAME), "\n".join(pip_requirements))

    _PythonEnv.current().to_yaml(os.path.join(path, _PYTHON_ENV_FILE_NAME))


@format_docstring(LOG_MODEL_PARAM_DOCS.format(package_name=FLAVOR_NAME))
@trace_disabled  # Suppress traces for internal predict calls while logging model
def log_model(
    dspy_model,
    artifact_path: str | None = None,
    task: str | None = None,
    model_config: dict[str, Any] | None = None,
    code_paths: list[str] | None = None,
    conda_env: list[str] | str | None = None,
    signature: ModelSignature | None = None,
    input_example: ModelInputExample | None = None,
    registered_model_name: str | None = None,
    await_registration_for: int = DEFAULT_AWAIT_MAX_SLEEP_SECONDS,
    pip_requirements: list[str] | str | None = None,
    extra_pip_requirements: list[str] | str | None = None,
    metadata: dict[str, Any] | None = None,
    resources: str | Path | list[Resource] | None = None,
    prompts: list[str | Prompt] | None = None,
    name: str | None = None,
    params: dict[str, Any] | None = None,
    tags: dict[str, Any] | None = None,
    model_type: str | None = None,
    step: int = 0,
    model_id: str | None = None,
):
    """
    Log a Dspy model along with metadata to MLflow.

    This method saves a Dspy model along with metadata such as model signature and conda
    environments to MLflow.

    Args:
        dspy_model: an instance of `dspy.Module`. The Dspy model to be saved.
        artifact_path: Deprecated. Use `name` instead.
        task: defaults to None. The task type of the model. Can only be `llm/v1/chat` or None for
            now.
        model_config: keyword arguments to be passed to the Dspy Module at instantiation.
        code_paths: {{ code_paths }}
        conda_env: {{ conda_env }}
        signature: {{ signature }}
        input_example: {{ input_example }}
        registered_model_name: defaults to None. If set, create a model version under
            `registered_model_name`, also create a registered model if one with the given name does
            not exist.
        await_registration_for: defaults to
            `mlflow.tracking._model_registry.DEFAULT_AWAIT_MAX_SLEEP_SECONDS`. Number of
            seconds to wait for the model version to finish being created and is in ``READY``
            status. By default, the function waits for five minutes. Specify 0 or None to skip
            waiting.
        pip_requirements: {{ pip_requirements }}
        extra_pip_requirements: {{ extra_pip_requirements }}
        metadata: Custom metadata dictionary passed to the model and stored in the MLmodel
            file.
        resources: A list of model resources or a resources.yaml file containing a list of
            resources required to serve the model.
        prompts: {{ prompts }}
        name: {{ name }}
        params: {{ params }}
        tags: {{ tags }}
        model_type: {{ model_type }}
        step: {{ step }}
        model_id: {{ model_id }}

    .. code-block:: python
        :caption: Example

        import dspy
        import mlflow
        from mlflow.models import ModelSignature
        from mlflow.types.schema import ColSpec, Schema

        # Set up the LM.
        lm = dspy.LM(model="openai/gpt-4o-mini", max_tokens=250)
        dspy.settings.configure(lm=lm)


        class CoT(dspy.Module):
            def __init__(self):
                super().__init__()
                self.prog = dspy.ChainOfThought("question -> answer")

            def forward(self, question):
                return self.prog(question=question)


        dspy_model = CoT()

        mlflow.set_tracking_uri("http://127.0.0.1:5000")
        mlflow.set_experiment("test-dspy-logging")

        from mlflow.dspy import log_model

        input_schema = Schema([ColSpec("string")])
        output_schema = Schema([ColSpec("string")])
        signature = ModelSignature(inputs=input_schema, outputs=output_schema)

        with mlflow.start_run():
            log_model(
                dspy_model,
                "model",
                input_example="what is 2 + 2?",
                signature=signature,
            )
    """
    return Model.log(
        artifact_path=artifact_path,
        name=name,
        flavor=mlflow.dspy,
        model=dspy_model,
        task=task,
        model_config=model_config,
        code_paths=code_paths,
        conda_env=conda_env,
        registered_model_name=registered_model_name,
        signature=signature,
        input_example=input_example,
        await_registration_for=await_registration_for,
        pip_requirements=pip_requirements,
        extra_pip_requirements=extra_pip_requirements,
        metadata=metadata,
        resources=resources,
        prompts=prompts,
        params=params,
        tags=tags,
        model_type=model_type,
        step=step,
        model_id=model_id,
    )
```

--------------------------------------------------------------------------------

````
