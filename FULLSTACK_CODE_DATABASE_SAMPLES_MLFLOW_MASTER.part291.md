---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 291
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 291 of 991)

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

---[FILE: available_tools_extraction.py]---
Location: mlflow-master/mlflow/genai/utils/prompts/available_tools_extraction.py

```python
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from mlflow.types.llm import ChatMessage

AVAILABLE_TOOLS_EXTRACTION_SYSTEM_PROMPT = """You are an expert in analyzing agent execution traces.
Your task is to examine an MLflow trace and identify all tools or functions that were
available to the LLM, not which tools were actually called.

CRITICAL: You MUST return ONLY valid JSON matching the schema below.
Do NOT return explanations, comments, or natural language. Return ONLY the JSON object.

## How You Should Analyze the Trace
Use the tools available to you to thoroughly inspect the trace:
1. Use list_spans
Retrieve the list of spans in the trace. Each span may contain tool definitions in
attributes or inputs.

2. Use GetSpanTool
For any span returned by list_spans, inspect its content—especially:
- inputs
- attributes
- metadata
These may include tool definitions or schemas given to the LLM.

3. Use SearchTraceRegexTool
Search the trace for keywords commonly associated with tool definitions, such as:
- "definition"
- "schema"
- "tool"
- "parameters"
- "functions"
Use these results to locate spans likely to contain tool schemas.

You must base your findings only on information contained in the trace.
Do not rely on or confuse the tools that you can use (like list_spans or GetSpanTool)
with the tools that were available to the LLM inside the trace. Only identify tools that
the trace itself shows were provided to the LLM.

## What to Look For
Search the trace for tool definitions or schemas that were provided to the LLM,
regardless of where they appear (span attributes, inputs, metadata, etc.).

A "tool definition" includes:
- The tool/function name
- An optional description
- An optional JSON schema for parameters

## Required Output Format
You MUST return a valid JSON object in exactly this format:

{output_example}

For every tool definition found, extract and return:
- type — Always "function"
- function.name — The tool's name (required)
- function.description — A description of the tool (use empty string "" if not available)
- function.parameters — The JSON parameter schema (use empty object {{}} if not available)

## Rules
- Return ONLY valid JSON. No explanations, no markdown, no comments.
- Return only unique tools. Two tool definitions should be treated as duplicates if
  any of the following are true: Their tool names/descriptions/parameter schemas are
  identical or nearly identical.
- If no tool definitions are present in the trace, return: {{"tools": []}}
- Only identify tools that the trace explicitly provides; do not infer or invent tools.
"""

AVAILABLE_TOOLS_EXTRACTION_USER_PROMPT = """
Please analyze the trace with the tools available to you and return the tools that were
available to the LLM in the trace.

Remember: respond with ONLY valid JSON matching the schema provided.
- Use double quotes for all property names and string values.
- Do not include comments, trailing commas, or explanatory text.
- Do not wrap the JSON in markdown (no ``` blocks).
- Do not include any text before or after the JSON.
- The response must be directly parseable by json.loads().

If no tools are found, return {"tools": []}.
"""


def get_available_tools_extraction_prompts(
    output_example: str,
) -> list["ChatMessage"]:
    """
    Generate system and user prompts for extracting available tools from a trace.

    Args:
        output_example: JSON string example of the expected output format.

    Returns:
        A list of chat messages [system_message, user_message] for tool extraction.
    """
    from mlflow.types.llm import ChatMessage

    system_prompt = AVAILABLE_TOOLS_EXTRACTION_SYSTEM_PROMPT.format(output_example=output_example)
    user_prompt = AVAILABLE_TOOLS_EXTRACTION_USER_PROMPT

    system_message = ChatMessage(role="system", content=system_prompt)
    user_message = ChatMessage(role="user", content=user_prompt)

    return [system_message, user_message]
```

--------------------------------------------------------------------------------

---[FILE: _groq_autolog.py]---
Location: mlflow-master/mlflow/groq/_groq_autolog.py

```python
import logging
from typing import Any

import mlflow
from mlflow.entities import SpanType
from mlflow.tracing.constant import SpanAttributeKey, TokenUsageKey
from mlflow.tracing.utils import set_span_chat_tools
from mlflow.utils.autologging_utils.config import AutoLoggingConfig

_logger = logging.getLogger(__name__)


def _get_span_type(resource: type) -> str:
    from groq.resources.audio.transcriptions import Transcriptions
    from groq.resources.audio.translations import Translations
    from groq.resources.chat.completions import Completions
    from groq.resources.embeddings import Embeddings

    span_type_mapping = {
        Completions: SpanType.CHAT_MODEL,
        Transcriptions: SpanType.LLM,
        Translations: SpanType.LLM,
        Embeddings: SpanType.EMBEDDING,
    }
    return span_type_mapping.get(resource, SpanType.UNKNOWN)


def patched_call(original, self, *args, **kwargs):
    config = AutoLoggingConfig.init(flavor_name=mlflow.groq.FLAVOR_NAME)

    if config.log_traces:
        with mlflow.start_span(
            name=f"{self.__class__.__name__}",
            span_type=_get_span_type(self.__class__),
        ) as span:
            span.set_inputs(kwargs)
            span.set_attribute(SpanAttributeKey.MESSAGE_FORMAT, "groq")

            if tools := kwargs.get("tools"):
                try:
                    set_span_chat_tools(span, tools)
                except Exception:
                    _logger.debug(f"Failed to set tools for {span}.", exc_info=True)

            outputs = original(self, *args, **kwargs)
            span.set_outputs(outputs)

            if usage := _parse_usage(outputs):
                span.set_attribute(SpanAttributeKey.CHAT_USAGE, usage)

            return outputs


def _parse_usage(output: Any) -> dict[str, int] | None:
    try:
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

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/groq/__init__.py

```python
"""
The ``mlflow.groq`` module provides an API for logging and loading Groq models.
"""

from mlflow.groq._groq_autolog import patched_call
from mlflow.telemetry.events import AutologgingEvent
from mlflow.telemetry.track import _record_event
from mlflow.utils.autologging_utils import autologging_integration, safe_patch

FLAVOR_NAME = "groq"


@autologging_integration(FLAVOR_NAME)
def autolog(
    log_traces: bool = True,
    disable: bool = False,
    silent: bool = False,
):
    """
    Enables (or disables) and configures autologging from Groq to MLflow.
    Only synchronous calls are supported. Asynchronous APIs and streaming are not recorded.

    Args:
        log_traces: If ``True``, traces are logged for Groq models. If ``False``, no traces are
            collected during inference. Default to ``True``.
        disable: If ``True``, disables the Groq autologging. Default to ``False``.
        silent: If ``True``, suppress all event logs and warnings from MLflow during Groq
            autologging. If ``False``, show all events and warnings.
    """

    from groq.resources.audio.transcriptions import Transcriptions
    from groq.resources.audio.translations import Translations
    from groq.resources.chat.completions import Completions as ChatCompletions
    from groq.resources.embeddings import Embeddings

    for task in (ChatCompletions, Translations, Transcriptions, Embeddings):
        safe_patch(
            FLAVOR_NAME,
            task,
            "create",
            patched_call,
        )

    _record_event(
        AutologgingEvent, {"flavor": FLAVOR_NAME, "log_traces": log_traces, "disable": disable}
    )
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/h2o/__init__.py

```python
"""
The ``mlflow.h2o`` module provides an API for logging and loading H2O models. This module exports
H2O models with the following flavors:

H20 (native) format
    This is the main flavor that can be loaded back into H2O.
:py:mod:`mlflow.pyfunc`
    Produced for use by generic pyfunc-based deployment tools and batch inference.
"""

import logging
import os
import warnings
from typing import Any

import yaml

import mlflow
from mlflow import pyfunc
from mlflow.models import Model, ModelInputExample, ModelSignature
from mlflow.models.model import MLMODEL_FILE_NAME
from mlflow.models.signature import _infer_signature_from_input_example
from mlflow.models.utils import _save_example
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
from mlflow.utils.file_utils import (
    get_total_file_size,
    write_to,
)
from mlflow.utils.model_utils import (
    _add_code_from_conf_to_system_path,
    _get_flavor_configuration,
    _validate_and_copy_code_paths,
    _validate_and_prepare_target_save_path,
)
from mlflow.utils.requirements_utils import _get_pinned_requirement

FLAVOR_NAME = "h2o"

_MODEL_DATA_SUBPATH = "model.h2o"

_logger = logging.getLogger(__name__)


def get_default_pip_requirements():
    """
    Returns:
        A list of default pip requirements for MLflow Models produced by this flavor.
        Calls to :func:`save_model()` and :func:`log_model()` produce a pip environment
        that, at minimum, contains these requirements.
    """
    return [_get_pinned_requirement("h2o")]


def get_default_conda_env():
    """
    Returns:
        The default Conda environment for MLflow Models produced by calls to
        :func:`save_model()` and :func:`log_model()`.
    """
    return _mlflow_conda_env(additional_pip_deps=get_default_pip_requirements())


@format_docstring(LOG_MODEL_PARAM_DOCS.format(package_name=FLAVOR_NAME))
def save_model(
    h2o_model,
    path,
    conda_env=None,
    code_paths=None,
    mlflow_model=None,
    settings=None,
    signature: ModelSignature = None,
    input_example: ModelInputExample = None,
    pip_requirements=None,
    extra_pip_requirements=None,
    metadata=None,
):
    """Save an H2O model to a path on the local file system.

    Args:
        h2o_model: H2O model to be saved.
        path: Local path where the model is to be saved.
        conda_env: {{ conda_env }}
        code_paths: {{ code_paths }}
        mlflow_model: :py:mod:`mlflow.models.Model` this flavor is being added to.
        settings: Settings to pass to ``h2o.init()`` when loading the model.
        signature: {{ signature }}
        input_example: {{ input_example }}
        pip_requirements: {{ pip_requirements }}
        extra_pip_requirements: {{ extra_pip_requirements }}
        metadata:  {{ metadata }}
    """
    import h2o

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
        wrapped_model = _H2OModelWrapper(h2o_model)
        signature = _infer_signature_from_input_example(saved_example, wrapped_model)
    elif signature is False:
        signature = None

    if signature is not None:
        mlflow_model.signature = signature
    if metadata is not None:
        mlflow_model.metadata = metadata

    # Save h2o-model
    if hasattr(h2o, "download_model"):
        h2o_save_location = h2o.download_model(model=h2o_model, path=model_data_path)
    else:
        warnings.warn(
            "If your cluster is remote, H2O may not store the model correctly. "
            "Please upgrade H2O version to a newer version"
        )
        h2o_save_location = h2o.save_model(model=h2o_model, path=model_data_path, force=True)
    model_file = os.path.basename(h2o_save_location)

    # Save h2o-settings
    if settings is None:
        settings = {}
    settings["full_file"] = h2o_save_location
    settings["model_file"] = model_file
    settings["model_dir"] = model_data_path
    with open(os.path.join(model_data_path, "h2o.yaml"), "w") as settings_file:
        yaml.safe_dump(settings, stream=settings_file)

    pyfunc.add_to_model(
        mlflow_model,
        loader_module="mlflow.h2o",
        data=model_data_subpath,
        conda_env=_CONDA_ENV_FILE_NAME,
        python_env=_PYTHON_ENV_FILE_NAME,
        code=code_dir_subpath,
    )
    mlflow_model.add_flavor(
        FLAVOR_NAME, h2o_version=h2o.__version__, data=model_data_subpath, code=code_dir_subpath
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
                path,
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
    h2o_model,
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
    """Log an H2O model as an MLflow artifact for the current run.

    Args:
        h2o_model: H2O model to be saved.
        artifact_path: Deprecated. Use `name` instead.
        conda_env: {{ conda_env }}
        code_paths: {{ code_paths }}
        registered_model_name: If given, create a model version under
            ``registered_model_name``, also creating a registered model if one
            with the given name does not exist.
        signature: {{ signature }}
        input_example: {{ input_example }}
        pip_requirements: {{ pip_requirements }}
        extra_pip_requirements: {{ extra_pip_requirements }}
        metadata:  {{ metadata }}
        name: {{ name }}
        params: {{ params }}
        tags: {{ tags }}
        model_type: {{ model_type }}
        step: {{ step }}
        model_id: {{ model_id }}
        kwargs: kwargs to pass to ``h2o.save_model`` method.

    Returns:
        A :py:class:`ModelInfo <mlflow.models.model.ModelInfo>` instance that contains the
        metadata of the logged model.

    """
    return Model.log(
        artifact_path=artifact_path,
        name=name,
        flavor=mlflow.h2o,
        registered_model_name=registered_model_name,
        h2o_model=h2o_model,
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


def _load_model(path, init=False):
    import h2o

    path = os.path.abspath(path)
    with open(os.path.join(path, "h2o.yaml")) as f:
        params = yaml.safe_load(f.read())
    if init:
        h2o.init(**(params["init"] if "init" in params else {}))
        h2o.no_progress()

    model_path = os.path.join(path, params["model_file"])
    if hasattr(h2o, "upload_model"):
        model = h2o.upload_model(model_path)
    else:
        warnings.warn(
            "If your cluster is remote, H2O may not load the model correctly. "
            "Please upgrade H2O version to a newer version"
        )
        model = h2o.load_model(model_path)

    return model


class _H2OModelWrapper:
    def __init__(self, h2o_model):
        self.h2o_model = h2o_model

    def get_raw_model(self):
        """
        Returns the underlying model.
        """
        return self.h2o_model

    def predict(self, dataframe, params: dict[str, Any] | None = None):
        """
        Args:
            dataframe: Model input data.
            params: Additional parameters to pass to the model for inference.

        Returns:
            Model predictions.
        """
        import h2o

        predicted = self.h2o_model.predict(h2o.H2OFrame(dataframe)).as_data_frame()
        predicted.index = dataframe.index
        return predicted


def _load_pyfunc(path):
    """Load PyFunc implementation. Called by ``pyfunc.load_model``.

    Args:
        path: Local filesystem path to the MLflow Model with the ``h2o`` flavor.

    """
    return _H2OModelWrapper(_load_model(path, init=True))


def load_model(model_uri, dst_path=None):
    """Load an H2O model from a local file (if ``run_id`` is ``None``) or a run.

    This function expects there is an H2O instance initialised with ``h2o.init``.

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
        An `H2OEstimator model object
        <http://docs.h2o.ai/h2o/latest-stable/h2o-py/docs/intro.html#models>`_.

    """
    local_model_path = _download_artifact_from_uri(artifact_uri=model_uri, output_path=dst_path)
    flavor_conf = _get_flavor_configuration(model_path=local_model_path, flavor_name=FLAVOR_NAME)
    _add_code_from_conf_to_system_path(local_model_path, flavor_conf)
    # Flavor configurations for models saved in MLflow version <= 0.8.0 may not contain a
    # `data` key; in this case, we assume the model artifact path to be `model.h2o`
    h2o_model_file_path = os.path.join(local_model_path, flavor_conf.get("data", "model.h2o"))
    return _load_model(path=h2o_model_file_path)
```

--------------------------------------------------------------------------------

---[FILE: autolog.py]---
Location: mlflow-master/mlflow/haystack/autolog.py

```python
import json
import logging
from typing import Any

from haystack.tracing import OpenTelemetryTracer, enable_tracing
from opentelemetry import trace
from opentelemetry.context import Context
from opentelemetry.sdk.trace import ReadableSpan as OTelReadableSpan
from opentelemetry.sdk.trace import Span as OTelSpan
from opentelemetry.sdk.trace import TracerProvider as SDKTracerProvider
from opentelemetry.sdk.trace.export import SimpleSpanProcessor, SpanExporter
from opentelemetry.trace import (
    NoOpTracerProvider,
    ProxyTracerProvider,
    get_tracer_provider,
    set_tracer_provider,
)

from mlflow.entities import LiveSpan, SpanType
from mlflow.entities.span import create_mlflow_span
from mlflow.tracing.constant import SpanAttributeKey, TokenUsageKey
from mlflow.tracing.provider import _get_tracer
from mlflow.tracing.trace_manager import InMemoryTraceManager
from mlflow.tracing.utils import (
    _bypass_attribute_guard,
    generate_trace_id_v3,
    get_mlflow_span_for_otel_span,
)

_logger = logging.getLogger(__name__)


def setup_haystack_tracing():
    from haystack import tracing as hs_tracing

    hs_tracing.tracer.is_content_tracing_enabled = True

    provider = get_tracer_provider()
    hs_processor = HaystackSpanProcessor()
    if isinstance(provider, (NoOpTracerProvider, ProxyTracerProvider)):
        new_provider = SDKTracerProvider()
        new_provider.add_span_processor(hs_processor)
        set_tracer_provider(new_provider)
    else:
        if not any(
            isinstance(p, HaystackSpanProcessor)
            for p in provider._active_span_processor._span_processors
        ):
            provider.add_span_processor(hs_processor)

    tracer = trace.get_tracer(__name__)
    enable_tracing(OpenTelemetryTracer(tracer))


def _infer_span_type_from_haystack(
    comp_type: str | None,
    comp_alias: str | None,
    span: OTelReadableSpan,
) -> SpanType:
    s = (comp_type or comp_alias or span.name or "").lower()

    if any(
        k in s
        for k in (
            "llm",
            "chat",
            "generator",
            "completion",
            "textgen",
            "chatgenerator",
            "openai",
            "anthropic",
            "mistral",
            "cohere",
            "gemini",
        )
    ):
        return SpanType.LLM

    if "embedder" in s:
        return SpanType.EMBEDDING

    if "retriever" in s:
        return SpanType.RETRIEVER

    if "ranker" in s:
        return SpanType.RERANKER

    if "agent" in s:
        return SpanType.AGENT

    return SpanType.TOOL


class HaystackSpanProcessor(SimpleSpanProcessor):
    def __init__(self):
        self.span_exporter = SpanExporter()
        self._pipeline_io: dict[str, tuple[dict[str, Any], dict[str, Any]]] = {}

    def on_start(self, span: OTelSpan, parent_context: Context | None = None):
        tracer = _get_tracer(__name__)
        tracer.span_processor.on_start(span, parent_context)

        trace_id = generate_trace_id_v3(span)
        mlflow_span = create_mlflow_span(span, trace_id)
        InMemoryTraceManager.get_instance().register_span(mlflow_span)

    def on_end(self, span: OTelReadableSpan) -> None:
        mlflow_span = get_mlflow_span_for_otel_span(span)
        if mlflow_span is None:
            _logger.debug("Span not found in the map. Skipping end.")
            return

        with _bypass_attribute_guard(mlflow_span._span):
            if span.name in ("haystack.pipeline.run", "haystack.async_pipeline.run"):
                self.set_pipeline_info(mlflow_span, span)
            elif span.name in ("haystack.component.run"):
                self.set_component_info(mlflow_span, span)

        tracer = _get_tracer(__name__)
        tracer.span_processor.on_end(span)

    def set_component_info(self, mlflow_span: LiveSpan, span: OTelReadableSpan) -> None:
        comp_alias = span.attributes.get("haystack.component.name")
        comp_type = span.attributes.get("haystack.component.type")
        mlflow_span.set_span_type(_infer_span_type_from_haystack(comp_type, comp_alias, span))

        # Haystack spans originally have name='haystack.component.run'. We need to update both the
        #  _name field of the Otel span and the _original_name field of the MLflow span to
        # customize the span name here, as otherwise it would be overwritten in the
        # deduplication process
        span_name = comp_type or comp_alias or span.name
        mlflow_span._span._name = span_name
        mlflow_span._original_name = span_name

        if (inputs := span.attributes.get("haystack.component.input")) is not None:
            try:
                mlflow_span.set_inputs(json.loads(inputs))
            except Exception:
                mlflow_span.set_inputs(inputs)
        if (outputs := span.attributes.get("haystack.component.output")) is not None:
            try:
                mlflow_span.set_outputs(json.loads(outputs))
            except Exception:
                mlflow_span.set_outputs(outputs)

        if usage := _parse_token_usage(mlflow_span.outputs):
            mlflow_span.set_attribute(SpanAttributeKey.CHAT_USAGE, usage)

        if parent_id := mlflow_span.parent_id:
            key = comp_alias or comp_type or mlflow_span.name
            inputs_agg, outputs_agg = self._pipeline_io.setdefault(parent_id, ({}, {}))
            if mlflow_span.inputs is not None:
                inputs_agg[key] = mlflow_span.inputs
            if mlflow_span.outputs is not None:
                outputs_agg[key] = mlflow_span.outputs

    def set_pipeline_info(self, mlflow_span: LiveSpan, span: OTelReadableSpan) -> None:
        # Pipelines are CHAINs
        mlflow_span.set_span_type(SpanType.CHAIN)

        if pipe_name := span.attributes.get("haystack.pipeline.name"):
            mlflow_span._span._name = pipe_name

        if (inputs := span.attributes.get("haystack.pipeline.input")) is not None:
            try:
                mlflow_span.set_inputs(json.loads(inputs))
            except Exception:
                mlflow_span.set_inputs(inputs)
        if (outputs := span.attributes.get("haystack.pipeline.output")) is not None:
            try:
                mlflow_span.set_outputs(json.loads(outputs))
            except Exception:
                mlflow_span.set_outputs(outputs)

        if mlflow_span.span_id in self._pipeline_io:
            inputs_agg, outputs_agg = self._pipeline_io.pop(mlflow_span.span_id)
            if mlflow_span.inputs is None and inputs_agg:
                mlflow_span.set_inputs(inputs_agg)
            if mlflow_span.outputs is None and outputs_agg:
                mlflow_span.set_outputs(outputs_agg)


def _parse_token_usage(outputs: Any) -> dict[str, int] | None:
    try:
        if not isinstance(outputs, dict):
            return None

        replies = outputs.get("replies")
        if isinstance(replies, list) and len(replies) > 0:
            usage = (
                replies[0].get("meta", {}).get("usage", {}) if isinstance(replies[0], dict) else {}
            )

        meta = outputs.get("meta")
        if isinstance(meta, list) and len(meta) > 0:
            usage = meta[0].get("usage", {}) if isinstance(meta[0], dict) else {}

        if isinstance(usage, dict):
            in_tok = usage.get("prompt_tokens", 0)
            out_tok = usage.get("completion_tokens", 0)
            tot_tok = usage.get("total_tokens", 0)
            return {
                TokenUsageKey.INPUT_TOKENS: in_tok,
                TokenUsageKey.OUTPUT_TOKENS: out_tok,
                TokenUsageKey.TOTAL_TOKENS: tot_tok,
            }
    except Exception:
        _logger.debug("Failed to parse token usage from outputs.", exc_info=True)


def teardown_haystack_tracing():
    provider = get_tracer_provider()
    if isinstance(provider, SDKTracerProvider):
        span_processors = getattr(provider._active_span_processor, "_span_processors", ())
        provider._active_span_processor._span_processors = tuple(
            p for p in span_processors if not isinstance(p, HaystackSpanProcessor)
        )
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/haystack/__init__.py

```python
from mlflow.haystack.autolog import setup_haystack_tracing, teardown_haystack_tracing
from mlflow.utils.annotations import experimental
from mlflow.utils.autologging_utils import autologging_integration

FLAVOR_NAME = "haystack"


@experimental(version="3.4.0")
def autolog(
    log_traces: bool = True,
    disable: bool = False,
    silent: bool = False,
):
    """
    Enables (or disables) and configures autologging from Haystack to MLflow.

    Args:
        log_traces: If ``True``, traces are logged for Haystack. If ``False``, no traces
            are collected.
        disable: If ``True``, disables the Haystack autologging integration.
        silent: If ``True``, suppress all event logs and warnings from MLflow during
            Haystack autologging. If ``False``, show all events and warnings.
    """
    if disable or not log_traces:
        teardown_haystack_tracing()
        return

    setup_haystack_tracing()


# This is required by mlflow.autolog()
autolog.integration_name = FLAVOR_NAME


@autologging_integration(FLAVOR_NAME)
def _autolog(log_traces: bool = True, disable: bool = False, silent: bool = False):
    """
    This function exists solely to attach the autologging_integration decorator without
    preventing cleanup logic from running when disable=True. Do not add implementation here.
    """
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: mlflow-master/mlflow/java/.gitignore

```text
dependency-reduced-pom.xml
```

--------------------------------------------------------------------------------

````
