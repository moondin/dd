---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 664
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 664 of 991)

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

---[FILE: autolog.py]---
Location: mlflow-master/mlflow/smolagents/autolog.py

```python
import inspect
import logging
from typing import Any

import mlflow
from mlflow.entities import SpanType
from mlflow.entities.span import LiveSpan
from mlflow.tracing.constant import SpanAttributeKey, TokenUsageKey
from mlflow.utils.autologging_utils.config import AutoLoggingConfig

_logger = logging.getLogger(__name__)


def patched_class_call(original, self, *args, **kwargs):
    try:
        config = AutoLoggingConfig.init(flavor_name=mlflow.smolagents.FLAVOR_NAME)

        if config.log_traces:
            fullname = f"{self.__class__.__name__}.{original.__name__}"
            span_type = _get_span_type(self)
            with mlflow.start_span(name=fullname, span_type=span_type) as span:
                inputs = _construct_full_inputs(original, self, *args, **kwargs)
                span.set_inputs(inputs)
                _set_span_attributes(span=span, instance=self)
                result = original(self, *args, **kwargs)

                # Need to convert the response of smolagents API for better visualization
                outputs = result.__dict__ if hasattr(result, "__dict__") else result
                if token_usage := _parse_usage(outputs):
                    span.set_attribute(SpanAttributeKey.CHAT_USAGE, token_usage)
                span.set_outputs(outputs)
                return result
    except Exception as e:
        _logger.error("the error occurred while patching")
        raise e


def _get_span_type(instance) -> str:
    from smolagents import CodeAgent, MultiStepAgent, Tool, ToolCallingAgent, models

    if isinstance(instance, (MultiStepAgent, CodeAgent, ToolCallingAgent)):
        return SpanType.AGENT
    elif isinstance(instance, Tool):
        return SpanType.TOOL
    elif isinstance(instance, models.Model):
        return SpanType.CHAT_MODEL

    return SpanType.UNKNOWN


def _construct_full_inputs(func, *args, **kwargs):
    signature = inspect.signature(func)
    # This does not create copy. So values should not be mutated directly
    arguments = signature.bind_partial(*args, **kwargs).arguments

    if "self" in arguments:
        arguments.pop("self")

    # Avoid non serializable objects and circular references
    return {
        k: v.__dict__ if hasattr(v, "__dict__") else v
        for k, v in arguments.items()
        if v is not None
    }


def _set_span_attributes(span: LiveSpan, instance):
    # Smolagents is available only python >= 3.10, so importing libraries inside methods.
    try:
        from smolagents import CodeAgent, MultiStepAgent, Tool, ToolCallingAgent, models

        if isinstance(instance, (MultiStepAgent, CodeAgent, ToolCallingAgent)):
            agent = _get_agent_attributes(instance)
            for key, value in agent.items():
                if value is not None:
                    span.set_attribute(key, str(value) if isinstance(value, list) else value)

        elif isinstance(instance, Tool):
            tool = _get_tool_attributes(instance)
            for key, value in tool.items():
                if value is not None:
                    span.set_attribute(key, str(value) if isinstance(value, list) else value)

        elif issubclass(type(instance), models.Model):
            model = _get_model_attributes(instance)
            for key, value in model.items():
                if value is not None:
                    span.set_attribute(key, str(value) if isinstance(value, list) else value)

    except Exception as e:
        _logger.warn("An exception happens when saving span attributes. Exception: %s", e)


def _get_agent_attributes(instance):
    agent = {}
    for key, value in instance.__dict__.items():
        if key == "tools":
            value = _parse_tools(value)
        if value is None:
            continue
        agent[key] = str(value)

    return agent


def _inner_get_tool_attributes(tool_dict):
    res = {}
    if hasattr(tool_dict, "name") and tool_dict.name is not None:
        res["name"] = tool_dict.name
    if hasattr(tool_dict, "description") and tool_dict.description is not None:
        res["description"] = tool_dict.description
    result = {}
    if res:
        result["type"] = "function"
        result["function"] = res
    return result


def _get_tool_attributes(instance):
    instance_dict = instance.__dict__
    return _inner_get_tool_attributes(instance_dict)


def _parse_tools(tools):
    return [_inner_get_tool_attributes(tool) for tool in tools]


def _get_model_attributes(instance):
    model = {SpanAttributeKey.MESSAGE_FORMAT: "smolagents"}
    for key, value in instance.__dict__.items():
        if value is None or key == "api_key":
            continue
        model[key] = str(value)
    return model


def _parse_usage(output: Any) -> dict[str, int] | None:
    try:
        if isinstance(output, dict) and "raw" in output:
            output = output["raw"]

        if usage := getattr(output, "usage", None):
            return {
                TokenUsageKey.INPUT_TOKENS: usage.prompt_tokens,
                TokenUsageKey.OUTPUT_TOKENS: usage.completion_tokens,
                TokenUsageKey.TOTAL_TOKENS: usage.total_tokens,
            }
    except Exception as e:
        _logger.debug(f"Failed to parse token usage from output: {e}")
    return None
```

--------------------------------------------------------------------------------

---[FILE: chat.py]---
Location: mlflow-master/mlflow/smolagents/chat.py

```python
import logging

_logger = logging.getLogger(__name__)
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/smolagents/__init__.py

```python
"""
The ``mlflow.smolagents`` module provides an API for tracing Smolagents AI agents.
"""

import logging

from mlflow.smolagents.autolog import (
    patched_class_call,
)
from mlflow.telemetry.events import AutologgingEvent
from mlflow.telemetry.track import _record_event
from mlflow.utils.autologging_utils import autologging_integration, safe_patch

_logger = logging.getLogger(__name__)

FLAVOR_NAME = "smolagents"


@autologging_integration(FLAVOR_NAME)
def autolog(
    log_traces: bool = True,
    disable: bool = False,
    silent: bool = False,
):
    """
    Enables (or disables) and configures autologging from Smolagents to MLflow.
    Note that asynchronous APIs and Tool calling are not recorded now.

    Args:
        log_traces: If ``True``, traces are logged for Smolagents agents.
            If ``False``, no traces are collected during inference. Default to ``True``.
        disable: If ``True``, disables the Smolagents autologging. Default to ``False``.
        silent: If ``True``, suppress all event logs and warnings from MLflow during Smolagents
            autologging. If ``False``, show all events and warnings.
    """
    import smolagents
    from smolagents import models

    class_method_map = {
        "MultiStepAgent": ["run"],
        "CodeAgent": ["step"],
        "ToolCallingAgent": ["step"],
        "Tool": ["__call__"],
    }

    try:
        for _, attr in vars(smolagents).items():
            if isinstance(attr, type) and issubclass(attr, models.Model):
                class_method_map.setdefault(attr.__name__, []).append("__call__")
    except Exception as e:
        _logger.warn("the error happens while registering models to class_method_map: %s", e)

    try:
        for class_name, methods in class_method_map.items():
            cls = getattr(smolagents, class_name)
            for method in methods:
                safe_patch(
                    FLAVOR_NAME,
                    cls,
                    method,
                    patched_class_call,
                )
    except (AttributeError, ModuleNotFoundError) as e:
        _logger.error(
            "An exception happens when applying auto-tracing to smolagents. Exception: %s", e
        )

    _record_event(
        AutologgingEvent, {"flavor": FLAVOR_NAME, "log_traces": log_traces, "disable": disable}
    )
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/spacy/__init__.py

```python
"""
The ``mlflow.spacy`` module provides an API for logging and loading spaCy models.
This module exports spacy models with the following flavors:

spaCy (native) format
    This is the main flavor that can be loaded back into spaCy.
:py:mod:`mlflow.pyfunc`
    Produced for use by generic pyfunc-based deployment tools and batch inference, this
    flavor is created only if spaCy's model pipeline has at least one
    `TextCategorizer <https://spacy.io/api/textcategorizer>`_.
"""

import logging
import os
from typing import Any

import pandas as pd
import yaml

import mlflow
from mlflow import pyfunc
from mlflow.exceptions import MlflowException
from mlflow.models import Model, ModelSignature
from mlflow.models.model import MLMODEL_FILE_NAME
from mlflow.models.signature import _infer_signature_from_input_example
from mlflow.models.utils import ModelInputExample, _save_example
from mlflow.tracking.artifact_utils import _download_artifact_from_uri
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
    _validate_env_arguments,
)
from mlflow.utils.file_utils import get_total_file_size, write_to
from mlflow.utils.model_utils import (
    _add_code_from_conf_to_system_path,
    _get_flavor_configuration,
    _validate_and_copy_code_paths,
    _validate_and_prepare_target_save_path,
)
from mlflow.utils.requirements_utils import _get_pinned_requirement

FLAVOR_NAME = "spacy"

_MODEL_DATA_SUBPATH = "model.spacy"

_logger = logging.getLogger(__name__)


def get_default_pip_requirements():
    """
    Returns:
        A list of default pip requirements for MLflow Models produced by this flavor.
        Calls to :func:`save_model()` and :func:`log_model()` produce a pip environment
        that, at minimum, contains these requirements.
    """
    return [_get_pinned_requirement("spacy")]


def get_default_conda_env():
    """
    Returns:
        The default Conda environment for MLflow Models produced by calls to
        :func:`save_model()` and :func:`log_model()`.
    """
    return _mlflow_conda_env(additional_pip_deps=get_default_pip_requirements())


@format_docstring(LOG_MODEL_PARAM_DOCS.format(package_name=FLAVOR_NAME))
def save_model(
    spacy_model,
    path,
    conda_env=None,
    code_paths=None,
    mlflow_model=None,
    signature: ModelSignature = None,
    input_example: ModelInputExample = None,
    pip_requirements=None,
    extra_pip_requirements=None,
    metadata=None,
):
    """Save a spaCy model to a path on the local file system.

    Args:
        spacy_model: spaCy model to be saved.
        path: Local path where the model is to be saved.
        conda_env: {{ conda_env }}
        code_paths: {{ code_paths }}
        mlflow_model: :py:mod:`mlflow.models.Model` this flavor is being added to.

        signature: :py:class:`ModelSignature <mlflow.models.ModelSignature>`
                   describes model input and output :py:class:`Schema <mlflow.types.Schema>`.
                   The model signature can be :py:func:`inferred <mlflow.models.infer_signature>`
                   from datasets with valid model input (e.g. the training dataset with target
                   column omitted) and valid model output (e.g. model predictions generated on
                   the training dataset), for example:

                   .. code-block:: python

                      from mlflow.models import infer_signature

                      train = df.drop_column("target_label")
                      predictions = ...  # compute model predictions
                      signature = infer_signature(train, predictions)
        input_example: {{ input_example }}
        pip_requirements: {{ pip_requirements }}
        extra_pip_requirements: {{ extra_pip_requirements }}
        metadata: {{ metadata }}
    """
    import spacy

    _validate_env_arguments(conda_env, pip_requirements, extra_pip_requirements)

    path = os.path.abspath(path)
    _validate_and_prepare_target_save_path(path)

    model_data_subpath = _MODEL_DATA_SUBPATH
    model_data_path = os.path.join(path, model_data_subpath)
    os.makedirs(model_data_path)
    code_dir_subpath = _validate_and_copy_code_paths(code_paths, path)

    if mlflow_model is None:
        mlflow_model = Model()
    saved_example = _save_example(mlflow_model, input_example, path)
    if signature is None and saved_example is not None:
        wrapped_model = _SpacyModelWrapper(spacy_model)
        signature = _infer_signature_from_input_example(saved_example, wrapped_model)

    if signature is not None:
        mlflow_model.signature = signature
    if metadata is not None:
        mlflow_model.metadata = metadata

    # Save spacy-model
    spacy_model.to_disk(path=model_data_path)
    # Save the pyfunc flavor if at least one text categorizer in spaCy pipeline
    if any(
        isinstance(pipe_component[1], spacy.pipeline.TextCategorizer)
        for pipe_component in spacy_model.pipeline
    ):
        pyfunc.add_to_model(
            mlflow_model,
            loader_module="mlflow.spacy",
            data=model_data_subpath,
            conda_env=_CONDA_ENV_FILE_NAME,
            python_env=_PYTHON_ENV_FILE_NAME,
            code=code_dir_subpath,
        )
    else:
        _logger.warning(
            "Generating only the spacy flavor for the provided spacy model. This means the model "
            "can be loaded back via `mlflow.spacy.load_model`, but cannot be loaded back using "
            "pyfunc APIs like `mlflow.pyfunc.load_model` or via the `mlflow models` CLI commands. "
            "MLflow will only generate the pyfunc flavor for spacy models containing a pipeline "
            "component that is an instance of spacy.pipeline.TextCategorizer."
        )

    mlflow_model.add_flavor(
        FLAVOR_NAME, spacy_version=spacy.__version__, data=model_data_subpath, code=code_dir_subpath
    )
    if size := get_total_file_size(path):
        mlflow_model.model_size_bytes = size
    mlflow_model.save(os.path.join(path, MLMODEL_FILE_NAME))

    if conda_env is None:
        if pip_requirements is None:
            default_reqs = get_default_pip_requirements()
            # To ensure `_load_pyfunc` can successfully load the model during the dependency
            # inference, `mlflow_model.save` must be called beforehand to save an MLmodel file.
            inferred_reqs = mlflow.models.infer_pip_requirements(
                model_data_path,
                FLAVOR_NAME,
                fallback=default_reqs,
            )
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

    # Save `constraints.txt` if necessary
    if pip_constraints:
        write_to(os.path.join(path, _CONSTRAINTS_FILE_NAME), "\n".join(pip_constraints))

    # Save `requirements.txt`
    write_to(os.path.join(path, _REQUIREMENTS_FILE_NAME), "\n".join(pip_requirements))

    _PythonEnv.current().to_yaml(os.path.join(path, _PYTHON_ENV_FILE_NAME))


@format_docstring(LOG_MODEL_PARAM_DOCS.format(package_name=FLAVOR_NAME))
def log_model(
    spacy_model,
    artifact_path: str | None = None,
    conda_env=None,
    code_paths=None,
    registered_model_name=None,
    signature: ModelSignature = None,
    input_example: ModelInputExample = None,
    pip_requirements=None,
    extra_pip_requirements=None,
    metadata=None,
    name: str | None = None,
    params: dict[str, Any] | None = None,
    tags: dict[str, Any] | None = None,
    model_type: str | None = None,
    step: int = 0,
    model_id: str | None = None,
    **kwargs,
):
    """Log a spaCy model as an MLflow artifact for the current run.

    Args:
        spacy_model: spaCy model to be saved.
        artifact_path: Deprecated. Use `name` instead.
        conda_env: {{ conda_env }}
        code_paths: {{ code_paths }}
        registered_model_name: If given, create a model version under
                               ``registered_model_name``, also creating a registered model if one
                               with the given name does not exist.

        signature: :py:class:`ModelSignature <mlflow.models.ModelSignature>`
                   describes model input and output :py:class:`Schema <mlflow.types.Schema>`.
                   The model signature can be :py:func:`inferred <mlflow.models.infer_signature>`
                   from datasets with valid model input (e.g. the training dataset with target
                   column omitted) and valid model output (e.g. model predictions generated on
                   the training dataset), for example:

                   .. code-block:: python

                      from mlflow.models import infer_signature

                      train = df.drop_column("target_label")
                      predictions = ...  # compute model predictions
                      signature = infer_signature(train, predictions)
        input_example: {{ input_example }}
        pip_requirements: {{ pip_requirements }}
        extra_pip_requirements: {{ extra_pip_requirements }}
        metadata: {{ metadata }}
        name: {{ name }}
        params: {{ params }}
        tags: {{ tags }}
        model_type: {{ model_type }}
        step: {{ step }}
        model_id: {{ model_id }}
        kwargs: kwargs to pass to ``spacy.save_model`` method.

    Returns:
        A :py:class:`ModelInfo <mlflow.models.model.ModelInfo>` instance that contains the
        metadata of the logged model.
    """
    return Model.log(
        artifact_path=artifact_path,
        name=name,
        flavor=mlflow.spacy,
        registered_model_name=registered_model_name,
        spacy_model=spacy_model,
        conda_env=conda_env,
        code_paths=code_paths,
        signature=signature,
        input_example=input_example,
        pip_requirements=pip_requirements,
        extra_pip_requirements=extra_pip_requirements,
        metadata=metadata,
        params=params,
        tags=tags,
        model_type=model_type,
        step=step,
        model_id=model_id,
        **kwargs,
    )


def _load_model(path):
    import spacy

    path = os.path.abspath(path)
    return spacy.load(path)


class _SpacyModelWrapper:
    def __init__(self, spacy_model):
        self.spacy_model = spacy_model

    def get_raw_model(self):
        """
        Returns the underlying model.
        """
        return self.spacy_model

    def predict(
        self,
        dataframe,
        params: dict[str, Any] | None = None,
    ):
        """Only works for predicting using text categorizer.
        Not suitable for other pipeline components (e.g: parser)

        Args:
            dataframe: pandas dataframe containing texts to be categorized
                       expected shape is (n_rows,1 column)
            params: Additional parameters to pass to the model for inference.

        Returns:
            dataframe with predictions
        """
        if len(dataframe.columns) != 1:
            raise MlflowException("Shape of input dataframe must be (n_rows, 1column)")

        return pd.DataFrame(
            {"predictions": dataframe.iloc[:, 0].apply(lambda text: self.spacy_model(text).cats)}
        )


def _load_pyfunc(path):
    """Load PyFunc implementation. Called by ``pyfunc.load_model``.

    Args:
        path: Local filesystem path to the MLflow Model with the ``spacy`` flavor.
    """
    return _SpacyModelWrapper(_load_model(path))


def load_model(model_uri, dst_path=None):
    """Load a spaCy model from a local file (if ``run_id`` is ``None``) or a run.

    Args:
        model_uri: The location, in URI format, of the MLflow model. For example:

                      - ``/Users/me/path/to/local/model``
                      - ``relative/path/to/local/model``
                      - ``s3://my_bucket/path/to/model``
                      - ``runs:/<mlflow_run_id>/run-relative/path/to/model``
                      - ``models:/<model_name>/<model_version>``
                      - ``models:/<model_name>/<stage>``

                      For more information about supported URI schemes, see
                      `Referencing Artifacts <https://www.mlflow.org/docs/latest/concepts.html#
                      artifact-locations>`_.
        dst_path: The local filesystem path to which to download the model artifact.
                  This directory must already exist. If unspecified, a local output
                  path will be created.

    Returns:
        A spaCy loaded model
    """
    local_model_path = _download_artifact_from_uri(artifact_uri=model_uri, output_path=dst_path)
    flavor_conf = _get_flavor_configuration(model_path=local_model_path, flavor_name=FLAVOR_NAME)
    _add_code_from_conf_to_system_path(local_model_path, flavor_conf)
    # Flavor configurations for models saved in MLflow version <= 0.8.0 may not contain a
    # `data` key; in this case, we assume the model artifact path to be `model.spacy`
    spacy_model_file_path = os.path.join(local_model_path, flavor_conf.get("data", "model.spacy"))
    return _load_model(path=spacy_model_file_path)
```

--------------------------------------------------------------------------------

---[FILE: autologging.py]---
Location: mlflow-master/mlflow/spark/autologging.py

```python
import concurrent.futures
import logging
import sys
import threading
import uuid

from py4j.java_gateway import CallbackServerParameters

from mlflow import MlflowClient
from mlflow.exceptions import MlflowException
from mlflow.spark import FLAVOR_NAME
from mlflow.tracking.context.abstract_context import RunContextProvider
from mlflow.tracking.fluent import _get_latest_active_run
from mlflow.utils import _truncate_and_ellipsize
from mlflow.utils.autologging_utils import (
    ExceptionSafeClass,
    autologging_is_disabled,
)
from mlflow.utils.databricks_utils import get_repl_id as get_databricks_repl_id
from mlflow.utils.validation import MAX_TAG_VAL_LENGTH

_JAVA_PACKAGE = "org.mlflow.spark.autologging"
_SPARK_TABLE_INFO_TAG_NAME = "sparkDatasourceInfo"

_logger = logging.getLogger(__name__)
_lock = threading.Lock()
_table_infos = []
_spark_table_info_listener = None

# Queue & singleton consumer thread for logging Spark datasource info asynchronously
_metric_queue = []
_thread_pool = concurrent.futures.ThreadPoolExecutor(
    max_workers=1, thread_name_prefix="MlflowSparkAutologging"
)


# Exposed for testing
def _get_current_listener():
    return _spark_table_info_listener


def _get_table_info_string(path, version, data_format):
    if data_format == "delta":
        return f"path={path},version={version},format={data_format}"
    return f"path={path},format={data_format}"


def _merge_tag_lines(existing_tag, new_table_info):
    if existing_tag is None:
        return new_table_info
    if new_table_info in existing_tag:
        return existing_tag
    return "\n".join([existing_tag, new_table_info])


def add_table_info_to_context_provider(path, version, data_format):
    with _lock:
        _table_infos.append((path, version, data_format))


def clear_table_infos():
    """Clear the table info accumulated SparkAutologgingContext.

    This is currently only used in unit tests.
    """
    with _lock:
        global _table_infos
        _table_infos = []


def _get_spark_major_version(sc):
    spark_version_parts = sc.version.split(".")
    spark_major_version = None
    if len(spark_version_parts) > 0:
        spark_major_version = int(spark_version_parts[0])
    return spark_major_version


def _get_jvm_event_publisher(spark_context):
    """
    Get JVM-side object implementing the following methods:
    - init() for initializing JVM state needed for autologging (e.g. attaching a SparkListener
      to watch for datasource reads)
    - register(subscriber) for registering subscribers to receive datasource events
    """
    jvm = spark_context._gateway.jvm
    qualified_classname = "{}.{}".format(_JAVA_PACKAGE, "MlflowAutologEventPublisher")
    return getattr(jvm, qualified_classname)


def _generate_datasource_tag_value(table_info_string):
    return _truncate_and_ellipsize(table_info_string, MAX_TAG_VAL_LENGTH)


def _set_run_tag_async(run_id, path, version, data_format):
    _thread_pool.submit(
        _set_run_tag, run_id=run_id, path=path, version=version, data_format=data_format
    )


def _set_run_tag(run_id, path, version, data_format):
    client = MlflowClient()
    table_info_string = _get_table_info_string(path, version, data_format)
    existing_run = client.get_run(run_id)
    existing_tag = existing_run.data.tags.get(_SPARK_TABLE_INFO_TAG_NAME)
    new_table_info = _merge_tag_lines(existing_tag, table_info_string)
    new_tag_value = _generate_datasource_tag_value(new_table_info)
    client.set_tag(run_id, _SPARK_TABLE_INFO_TAG_NAME, new_tag_value)


def _stop_listen_for_spark_activity(spark_context):
    gw = spark_context._gateway
    try:
        gw.shutdown_callback_server()
    except Exception as e:
        _logger.warning("Failed to shut down Spark callback server for autologging: %s", e)


def _listen_for_spark_activity(spark_context):
    global _spark_table_info_listener
    if _get_current_listener() is not None:
        return

    if _get_spark_major_version(spark_context) < 3:
        raise MlflowException("Spark autologging unsupported for Spark versions < 3")

    gw = spark_context._gateway
    params = gw.callback_server_parameters
    callback_server_params = CallbackServerParameters(
        address=params.address,
        port=params.port,
        daemonize=True,
        daemonize_connections=True,
        eager_load=params.eager_load,
        ssl_context=params.ssl_context,
        accept_timeout=params.accept_timeout,
        read_timeout=params.read_timeout,
        auth_token=params.auth_token,
    )
    callback_server_started = gw.start_callback_server(callback_server_params)

    try:
        event_publisher = _get_jvm_event_publisher(spark_context)
        event_publisher.init(1)
        _spark_table_info_listener = PythonSubscriber()
        event_publisher.register(_spark_table_info_listener)
    except Exception as e:
        if callback_server_started:
            try:
                gw.shutdown_callback_server()
            except Exception as e:
                _logger.warning(
                    "Failed to shut down Spark callback server for autologging: %s", str(e)
                )
        _spark_table_info_listener = None
        raise MlflowException(
            "Exception while attempting to initialize JVM-side state for Spark datasource "
            "autologging. Note that Spark datasource autologging only works with Spark 3.0 "
            "and above. Please create a new Spark session with required Spark version and "
            "ensure you have the mlflow-spark JAR attached to your Spark session as described "
            f"in https://mlflow.org/docs/latest/tracking/autolog.html#spark Exception:\n{e}"
        )

    # Register context provider for Spark autologging
    from mlflow.tracking.context.registry import _run_context_provider_registry

    _run_context_provider_registry.register(SparkAutologgingContext)

    _logger.info("Autologging successfully enabled for spark.")


def _get_repl_id():
    """
    Get a unique REPL ID for a PythonSubscriber instance. This is used to distinguish between
    REPLs in multitenant, REPL-aware environments where multiple Python processes may share the
    same Spark JVM (e.g. in Databricks). In such environments, we pull the REPL ID from Spark
    local properties, and expect that the PythonSubscriber for the current Python process only
    receives events for datasource reads triggered by the current process.
    """
    if repl_id := get_databricks_repl_id():
        return repl_id
    main_file = sys.argv[0] if len(sys.argv) > 0 else "<console>"
    return f"PythonSubscriber[{main_file}][{uuid.uuid4().hex}]"


class PythonSubscriber(metaclass=ExceptionSafeClass):
    """
    Subscriber, intended to be instantiated once per Python process, that logs Spark table
    information propagated from Java to the current MLflow run, starting a run if necessary.
    class implements a Java interface (org.mlflow.spark.autologging.MlflowAutologEventSubscriber,
    defined in the mlflow-spark package) that's called-into by autologging logic in the JVM in order
    to propagate Spark datasource read events to Python.

    This class leverages the Py4j callback mechanism to receive callbacks from the JVM, see
    https://www.py4j.org/advanced_topics.html#implementing-java-interfaces-from-python-callback for
    more information.
    """

    def __init__(self):
        self._repl_id = _get_repl_id()

    def toString(self):
        # For debugging
        return f"PythonSubscriber<replId={self.replId()}>"

    def ping(self):
        return None

    def notify(self, path, version, data_format):
        try:
            self._notify(path, version, data_format)
        except Exception as e:
            _logger.error(
                "Unexpected exception %s while attempting to log Spark datasource "
                "info. Exception:\n",
                e,
            )

    def _notify(self, path, version, data_format):
        """
        Method called by Scala SparkListener to propagate datasource read events to the current
        Python process
        """
        if autologging_is_disabled(FLAVOR_NAME):
            return
        # If there are active runs, simply set the tag on the latest active run
        # Note that there's a TOCTOU race condition here - active_run() here can actually throw
        # if the main thread happens to end the run & pop from the active run stack after we check
        # the stack size but before we peek

        # Note Spark datasource autologging is hard to support thread-local behavior,
        # because the spark event listener callback (jvm side) does not have the python caller
        # thread information, therefore the tag is set to the latest active run, ignoring threading
        # information. This way, consistent behavior is kept with existing functionality for
        # Spark in MLflow.
        if latest_active_run := _get_latest_active_run():
            _set_run_tag_async(latest_active_run.info.run_id, path, version, data_format)
        else:
            add_table_info_to_context_provider(path, version, data_format)

    def replId(self):
        return self._repl_id

    class Java:
        implements = [f"{_JAVA_PACKAGE}.MlflowAutologEventSubscriber"]


class SparkAutologgingContext(RunContextProvider):
    """
    Context provider used when there's no active run. Accumulates datasource read information,
    then logs that information to the next-created run. Note that this doesn't clear the accumulated
    info when logging them to the next run, so it will be logged to any successive runs as well.
    """

    def in_context(self):
        return True

    def tags(self):
        # if autologging is disabled, then short circuit `tags()` and return empty dict.
        if autologging_is_disabled(FLAVOR_NAME):
            return {}
        with _lock:
            seen = set()
            unique_infos = []
            for info in _table_infos:
                if info not in seen:
                    unique_infos.append(info)
                    seen.add(info)
            if len(unique_infos) > 0:
                tags = {
                    _SPARK_TABLE_INFO_TAG_NAME: _generate_datasource_tag_value(
                        "\n".join([_get_table_info_string(*info) for info in unique_infos])
                    )
                }
            else:
                tags = {}
            return tags
```

--------------------------------------------------------------------------------

````
