---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 720
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 720 of 991)

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

---[FILE: llm_inference_utils.py]---
Location: mlflow-master/mlflow/transformers/llm_inference_utils.py

```python
from __future__ import annotations

import time
import uuid
from typing import TYPE_CHECKING, Any

import numpy as np
import pandas as pd

from mlflow.exceptions import MlflowException
from mlflow.models import ModelSignature
from mlflow.protos.databricks_pb2 import BAD_REQUEST, INVALID_PARAMETER_VALUE
from mlflow.transformers.flavor_config import FlavorKey
from mlflow.types.llm import (
    CHAT_MODEL_INPUT_SCHEMA,
    CHAT_MODEL_OUTPUT_SCHEMA,
    COMPLETIONS_MODEL_INPUT_SCHEMA,
    COMPLETIONS_MODEL_OUTPUT_SCHEMA,
    EMBEDDING_MODEL_INPUT_SCHEMA,
    EMBEDDING_MODEL_OUTPUT_SCHEMA,
)

if TYPE_CHECKING:
    import torch

_LLM_INFERENCE_TASK_KEY = "inference_task"
# The LLM inference task is saved as "task" in the metadata for forward compatibility with
# future Databricks Provisioned Throughput support of more model architectures for inference.
_METADATA_LLM_INFERENCE_TASK_KEY = "task"

_LLM_INFERENCE_TASK_PREFIX = "llm/v1"
_LLM_INFERENCE_TASK_COMPLETIONS = f"{_LLM_INFERENCE_TASK_PREFIX}/completions"
_LLM_INFERENCE_TASK_CHAT = f"{_LLM_INFERENCE_TASK_PREFIX}/chat"
_LLM_INFERENCE_TASK_EMBEDDING = f"{_LLM_INFERENCE_TASK_PREFIX}/embeddings"

_LLM_V1_EMBEDDING_INPUT_KEY = "input"


_LLM_INFERENCE_OBJECT_NAME = {
    _LLM_INFERENCE_TASK_COMPLETIONS: "text_completion",
    _LLM_INFERENCE_TASK_CHAT: "chat.completion",
}

_SUPPORTED_LLM_INFERENCE_TASK_TYPES_BY_PIPELINE_TASK = {
    "text-generation": [_LLM_INFERENCE_TASK_COMPLETIONS, _LLM_INFERENCE_TASK_CHAT],
    "feature-extraction": [_LLM_INFERENCE_TASK_EMBEDDING],
}

_SIGNATURE_FOR_LLM_INFERENCE_TASK = {
    _LLM_INFERENCE_TASK_CHAT: ModelSignature(
        inputs=CHAT_MODEL_INPUT_SCHEMA, outputs=CHAT_MODEL_OUTPUT_SCHEMA
    ),
    _LLM_INFERENCE_TASK_COMPLETIONS: ModelSignature(
        inputs=COMPLETIONS_MODEL_INPUT_SCHEMA, outputs=COMPLETIONS_MODEL_OUTPUT_SCHEMA
    ),
    _LLM_INFERENCE_TASK_EMBEDDING: ModelSignature(
        inputs=EMBEDDING_MODEL_INPUT_SCHEMA, outputs=EMBEDDING_MODEL_OUTPUT_SCHEMA
    ),
}

_LLM_INFERENCE_TASK_TO_DATA_FIELD = {
    _LLM_INFERENCE_TASK_CHAT: "messages",
    _LLM_INFERENCE_TASK_COMPLETIONS: "prompt",
}


def infer_signature_from_llm_inference_task(
    inference_task: str, signature: ModelSignature | None = None
) -> ModelSignature:
    """
    Infers the signature according to the MLflow inference task.
    Raises exception if a signature is given.
    """
    inferred_signature = _SIGNATURE_FOR_LLM_INFERENCE_TASK[inference_task]

    if signature is not None and signature != inferred_signature:
        raise MlflowException(
            f"When `task` is specified as `{inference_task}`, the signature would "
            "be set by MLflow. Please do not set the signature."
        )
    return inferred_signature


def convert_messages_to_prompt(messages: list[dict[str, Any]], tokenizer) -> str:
    """For the Chat inference task, apply chat template to messages to create prompt.

    Args:
        messages: List of message e.g. [{"role": user, "content": xxx}, ...]
        tokenizer: The tokenizer object used for inference.

    Returns:
        The prompt string contains the messages.
    """
    if not (isinstance(messages, list) and all(isinstance(msg, dict) for msg in messages)):
        raise MlflowException(
            f"Input messages should be list of dictionaries, but got: {type(messages)}.",
            error_code=INVALID_PARAMETER_VALUE,
        )

    try:
        return tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    except Exception as e:
        raise MlflowException(f"Failed to apply chat template: {e}")


def preprocess_llm_inference_input(
    data: pd.DataFrame | dict[str, Any],
    params: dict[str, Any] | None = None,
    flavor_config: dict[str, Any] | None = None,
) -> tuple[list[Any], dict[str, Any]]:
    """
    When a MLflow inference task is given, return updated `data` and `params` that
    - Extract the parameters from the input data (from the first row if passed multiple rows)
    - Replace OpenAI specific parameters with Hugging Face specific parameters, in particular
      - `max_tokens` with `max_new_tokens`
      - `stop` with `stopping_criteria`

    Args:
        data: Input data for the LLM inference task. Either a pandas DataFrame (after signature
            enforcement) or a raw dictionary payload.
        params: Optional dictionary of parameters.
        flavor_config: Optional dictionary of flavor configuration.
    """
    if isinstance(data, pd.DataFrame):
        # Pandas convert None to np.nan internally, which is not preferred
        data = data.replace(np.nan, None).to_dict(orient="list")
    elif isinstance(data, dict):
        # Convert single value to list for consistency with DataFrame
        data = {k: [v] for k, v in data.items()}
    else:
        raise MlflowException(
            "Input data for a Transformer model logged with `llm/v1/chat` or `llm/v1/completions`"
            f"task is expected to be a pandas DataFrame or a dictionary, but got: {type(data)}.",
            error_code=BAD_REQUEST,
        )

    flavor_config = flavor_config or {}
    params = params or {}

    # Extract list of input data (prompt, messages) to LLM
    task = flavor_config[_LLM_INFERENCE_TASK_KEY]
    input_col = _LLM_INFERENCE_TASK_TO_DATA_FIELD.get(task)
    if input_col not in data:
        raise MlflowException(
            f"Transformer model saved with `{task}` task excepts `{input_col}`"
            "to be passed as input data.",
            error_code=BAD_REQUEST,
        )
    update_data = data.pop(input_col)

    # The rest of fields in input payload should goes to params and override default ones
    params_in_data = {k: v[0] for k, v in data.items() if v[0] is not None}
    params = {**params, **params_in_data}

    if max_tokens := params.pop("max_tokens", None):
        params["max_new_tokens"] = max_tokens
    if stop := params.pop("stop", None):
        params["stopping_criteria"] = _get_stopping_criteria(
            stop,
            flavor_config.get(FlavorKey.MODEL_NAME),
        )
    return update_data, params


def _get_stopping_criteria(stop: str | list[str] | None, model_name: str | None = None):
    """Return a list of Hugging Face stopping criteria objects for the given stop sequences."""
    from transformers import AutoTokenizer, StoppingCriteria

    if stop is None or model_name is None:
        return None

    if isinstance(stop, str):
        stop = [stop]

    # To tokenize the stop sequences for stopping criteria, we need to use the slow tokenizer
    # for matching the actual tokens, according to https://github.com/huggingface/transformers/issues/27704
    tokenizer = AutoTokenizer.from_pretrained(model_name, use_fast=False)

    def _get_slow_token_ids(seq: str):
        return tokenizer.convert_tokens_to_ids(tokenizer._tokenize(seq))

    # NB: We need to define this as an inner class to avoid importing
    # transformers in the global scope that confuses autologging
    class _StopSequenceMatchCriteria(StoppingCriteria):
        def __init__(self, stop_sequence_ids):
            self.stop_sequence_ids = stop_sequence_ids

        def __call__(
            self, input_ids: torch.LongTensor, scores: torch.FloatTensor, **kwargs
        ) -> bool:
            last_ids = input_ids[:, -len(self.stop_sequence_ids) :].tolist()
            return self.stop_sequence_ids in last_ids

    stopping_criteria = []
    for stop_sequence in stop:
        # Add stopping criteria for both with and without space, such as "stopword" and " stopword"
        token_ids = _get_slow_token_ids(stop_sequence)
        token_ids_with_space = _get_slow_token_ids(" " + stop_sequence)
        stopping_criteria += [
            _StopSequenceMatchCriteria(token_ids),
            _StopSequenceMatchCriteria(token_ids_with_space),
        ]

    return stopping_criteria


def postprocess_output_for_llm_inference_task(
    data: list[str],
    output_tensors: list[list[int]],
    pipeline,
    flavor_config,
    model_config,
    inference_task,
):
    """
    Wrap output data with usage information according to the MLflow inference task.

    Example:
        .. code-block:: python
            data = ["How to learn Python in 3 weeks?"]
            output_tensors = [
                [
                    1128,
                    304,
                    ...,
                    29879,
                ]
            ]
            output_dicts = postprocess_output_for_llm_inference_task(data, output_tensors, **kwargs)

            assert output_dicts == [
                {
                    "id": "e4f3b3e3-3b3e-4b3e-8b3e-3b3e4b3e8b3e",
                    "object": "text_completion",
                    "created": 1707466970,
                    "model": "loaded_model_name",
                    "choices": [
                        {
                            "index": 0,
                            "finish_reason": "length",
                            "text": "1. Start with a beginner's",
                        }
                    ],
                    "usage": {"prompt_tokens": 9, "completion_tokens": 10, "total_tokens": 19},
                }
            ]

    Args:
        data: List of text input prompts.
        output_tensors: List of output tensors that contain the generated tokens (including
            the prompt tokens) corresponding to each input prompt.
        pipeline: The pipeline object used for inference.
        flavor_config: The flavor configuration dictionary for the model.
        model_config: The model configuration dictionary used for inference.
        inference_task: The MLflow inference task.

    Returns:
        List of dictionaries containing the output text and usage information for each input prompt.
    """
    return [
        _get_output_and_usage_from_tensor(
            input_data, output_tensor, pipeline, flavor_config, model_config, inference_task
        )
        for input_data, output_tensor in zip(data, output_tensors)
    ]


def _get_output_and_usage_from_tensor(
    prompt: str, output_tensor: list[int], pipeline, flavor_config, model_config, inference_task
):
    """
    Decode the output tensor and return the output text and usage information as a dictionary
    to make the output in OpenAI compatible format.
    """
    usage = _get_token_usage(prompt, output_tensor, pipeline, model_config)
    completions_text = _get_completions_text(prompt, output_tensor, pipeline)
    finish_reason = _get_finish_reason(
        usage["total_tokens"], usage["completion_tokens"], model_config
    )

    output_dict = {
        "id": str(uuid.uuid4()),
        "object": _LLM_INFERENCE_OBJECT_NAME[inference_task],
        "created": int(time.time()),
        "model": flavor_config.get("source_model_name", ""),
        "usage": usage,
    }

    completion_choice = {
        "index": 0,
        "finish_reason": finish_reason,
    }

    if inference_task == _LLM_INFERENCE_TASK_COMPLETIONS:
        completion_choice["text"] = completions_text
    elif inference_task == _LLM_INFERENCE_TASK_CHAT:
        completion_choice["message"] = {"role": "assistant", "content": completions_text}

    output_dict["choices"] = [completion_choice]

    return output_dict


def _get_completions_text(prompt: str, output_tensor: list[int], pipeline):
    """Decode generated text from output tensor and remove the input prompt."""
    generated_text = pipeline.tokenizer.decode(
        output_tensor,
        skip_special_tokens=True,
        clean_up_tokenization_spaces=True,
    )

    # In order to correctly remove the prompt tokens from the decoded tokens,
    # we need to acquire the length of the prompt without special tokens
    prompt_ids_without_special_tokens = pipeline.tokenizer(
        prompt, return_tensors=pipeline.framework, add_special_tokens=False
    )["input_ids"][0]

    prompt_length = len(
        pipeline.tokenizer.decode(
            prompt_ids_without_special_tokens,
            skip_special_tokens=True,
            clean_up_tokenization_spaces=True,
        )
    )

    return generated_text[prompt_length:].lstrip()


def _get_token_usage(prompt: str, output_tensor: list[int], pipeline, model_config):
    """Return the prompt tokens, completion tokens, and the total tokens as dict."""
    inputs = pipeline.tokenizer(
        prompt,
        return_tensors=pipeline.framework,
        max_length=model_config.get("max_length", None),
        add_special_tokens=False,
    )

    prompt_tokens = inputs["input_ids"].shape[-1]
    total_tokens = len(output_tensor)
    completions_tokens = total_tokens - prompt_tokens

    return {
        "prompt_tokens": prompt_tokens,
        "completion_tokens": completions_tokens,
        "total_tokens": total_tokens,
    }


def _get_finish_reason(total_tokens: int, completion_tokens: int, model_config):
    """Determine the reason that the text generation finished."""
    finish_reason = "stop"

    if total_tokens > model_config.get(
        "max_length", float("inf")
    ) or completion_tokens == model_config.get("max_new_tokens", float("inf")):
        finish_reason = "length"

    return finish_reason


def _get_default_task_for_llm_inference_task(llm_inference_task: str | None) -> str | None:
    """
    Get corresponding original Transformers task for the given LLM inference task.

    NB: This assumes there is only one original Transformers task for each LLM inference
      task, which might not be true in the future.
    """
    for task, llm_tasks in _SUPPORTED_LLM_INFERENCE_TASK_TYPES_BY_PIPELINE_TASK.items():
        if llm_inference_task in llm_tasks:
            return task
    return None


def preprocess_llm_embedding_params(
    data: pd.DataFrame | dict[str, Any],
) -> tuple[list[str], dict[str, Any]]:
    """
    When `llm/v1/embeddings` task is given, extract the input data (with "input" key) and
    parameters, and format the input data into the unified format for easier downstream handling.

    The handling is more complicated than other LLM inference tasks because the embedding endpoint
    accepts heterogeneous input - both string and list of strings as input. Also we don't enforce
    the input schema always, so there are 4 possible input types:
      (1)  Pandas DataFrame with string column
      (2)  Pandas DataFrame with list of strings column
      (3)  Dictionary with string value
      (4)  Dictionary with list of strings value
    In all cases, the returned input data will be a list of strings.

    Args:
        data: Input data for the embedding task.

    Returns:
        Tuple of input data and parameters dictionary.
    """
    if isinstance(data, pd.DataFrame):
        params = {}
        for col in data.columns:
            if col == _LLM_V1_EMBEDDING_INPUT_KEY:
                input_data = data[col].to_list()
                if isinstance(input_data[0], list):
                    input_data = input_data[0]
            else:
                params[col] = data[col].tolist()[0]
    else:
        # NB: Input schema is not enforced for the embedding task because of the heterogeneous
        # input type, so we have to cast the input data into unified format here.
        input_data = data.get(_LLM_V1_EMBEDDING_INPUT_KEY)
        if isinstance(input, str):
            input_data = [input_data]
        params = {k: v for k, v in data.items() if k != _LLM_V1_EMBEDDING_INPUT_KEY}

    return input_data, params


def postprocess_output_for_llm_v1_embedding_task(
    input_prompts: list[str],
    output_tensors: list[list[float]],
    tokenizer,
):
    """
    Wrap output data with usage information.

    Examples:
        .. code-block:: python
            input_prompt = ["hello world and hello mlflow"]
            output_embedding = [0.47137904, 0.4669448, ..., 0.69726706]
            output_dicts = postprocess_output_for_llm_v1_embedding_task(
                input_prompt, output_embedding
            )
            assert output_dicts == [
                {
                    "object": "list",
                    "data": [
                        {
                            "object": "embedding",
                            "index": 0,
                            "embedding": [0.47137904, 0.4669448, ..., 0.69726706],
                        }
                    ],
                    "usage": {"prompt_tokens": 8, "total_tokens": 8},
                }
            ]

    Args:
        input_prompts: text input prompts
        output_tensors: List of output tensors that contain the generated embeddings
        tokenizer: The tokenizer object used for inference.

    Returns:
            Dictionaries containing the output embedding and usage information for each
            input prompt.
    """
    prompt_tokens = sum(len(tokenizer(prompt)["input_ids"]) for prompt in input_prompts)
    return {
        "object": "list",
        "data": [
            {
                "object": "embedding",
                "index": i,
                "embedding": tensor,
            }
            for i, tensor in enumerate(output_tensors)
        ],
        "usage": {"prompt_tokens": prompt_tokens, "total_tokens": prompt_tokens},
    }
```

--------------------------------------------------------------------------------

---[FILE: model_io.py]---
Location: mlflow-master/mlflow/transformers/model_io.py

```python
import logging
import shutil

from mlflow.environment_variables import (
    MLFLOW_HUGGINGFACE_DISABLE_ACCELERATE_FEATURES,
    MLFLOW_HUGGINGFACE_MODEL_MAX_SHARD_SIZE,
)
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_STATE
from mlflow.transformers.flavor_config import FlavorKey, get_peft_base_model, is_peft_model

_logger = logging.getLogger(__name__)

# File/directory names for saved artifacts
_MODEL_BINARY_FILE_NAME = "model"
_COMPONENTS_BINARY_DIR_NAME = "components"
_PROCESSOR_BINARY_DIR_NAME = "processor"


def save_pipeline_pretrained_weights(path, pipeline, flavor_conf, processor=None):
    """
    Save the binary artifacts of the pipeline to the specified local path.

    Args:
        path: The local path to save the pipeline
        pipeline: Transformers pipeline instance
        flavor_conf: The flavor configuration constructed for the pipeline
        processor: Optional processor instance to save alongside the pipeline
    """
    model = get_peft_base_model(pipeline.model) if is_peft_model(pipeline.model) else pipeline.model

    model.save_pretrained(
        save_directory=path.joinpath(_MODEL_BINARY_FILE_NAME),
        max_shard_size=MLFLOW_HUGGINGFACE_MODEL_MAX_SHARD_SIZE.get(),
    )

    component_dir = path.joinpath(_COMPONENTS_BINARY_DIR_NAME)
    for name in flavor_conf.get(FlavorKey.COMPONENTS, []):
        getattr(pipeline, name).save_pretrained(component_dir.joinpath(name))

    if processor:
        processor.save_pretrained(component_dir.joinpath(_PROCESSOR_BINARY_DIR_NAME))


def save_local_checkpoint(path, checkpoint_dir, flavor_conf, processor=None):
    """
    Save the local checkpoint of the model and other components to the specified local path.

    Args:
        path: The local path to save the pipeline
        checkpoint_dir: The local path to the checkpoint directory
        flavor_conf: The flavor configuration constructed for the pipeline
        processor: Optional processor instance to save alongside the pipeline
    """
    # Copy files within checkpoint dir to the model path
    shutil.copytree(checkpoint_dir, path.joinpath(_MODEL_BINARY_FILE_NAME))

    for name in flavor_conf.get(FlavorKey.COMPONENTS, []):
        # Other pipeline components such as tokenizer may not saved in the checkpoint.
        # We first try to load the component instance from the checkpoint directory,
        # if it fails, we load the component from the HuggingFace Hub.
        try:
            component = _load_component(flavor_conf, name, local_path=checkpoint_dir)
        except Exception:
            repo_id = flavor_conf[FlavorKey.MODEL_NAME]
            _logger.info(
                f"The {name} state file is not found ins the local checkpoint directory. MLflow "
                f"will use the default component state from the base HF repository {repo_id}."
            )
            component = _load_component(flavor_conf, name, repo_id=repo_id)

        component.save_pretrained(path.joinpath(_COMPONENTS_BINARY_DIR_NAME, name))

    if processor:
        processor.save_pretrained(
            path.joinpath(_COMPONENTS_BINARY_DIR_NAME, _PROCESSOR_BINARY_DIR_NAME)
        )


def load_model_and_components_from_local(path, flavor_conf, accelerate_conf, device=None):
    """
    Load the model and components of a Transformer pipeline from the specified local path.

    Args:
        path: The local path contains MLflow model artifacts
        flavor_conf: The flavor configuration
        accelerate_conf: The configuration for the accelerate library
        device: The device to load the model onto
    """
    loaded = {}

    # NB: Path resolution for models that were saved prior to 2.4.1 release when the patching for
    #     the saved pipeline or component artifacts was handled by duplicate entries for components
    #     (artifacts/pipeline/* and artifacts/components/*) and pipelines were saved via the
    #     "artifacts/pipeline/*" path. In order to load the older formats after the change, the
    #     presence of the new path key is checked.
    model_path = path.joinpath(flavor_conf.get(FlavorKey.MODEL_BINARY, "pipeline"))
    loaded[FlavorKey.MODEL] = _load_model(model_path, flavor_conf, accelerate_conf, device)

    components = flavor_conf.get(FlavorKey.COMPONENTS, [])
    if FlavorKey.PROCESSOR_TYPE in flavor_conf:
        components.append("processor")

    for component_key in components:
        component_path = path.joinpath(_COMPONENTS_BINARY_DIR_NAME, component_key)
        loaded[component_key] = _load_component(
            flavor_conf, component_key, local_path=component_path
        )

    return loaded


def load_model_and_components_from_huggingface_hub(flavor_conf, accelerate_conf, device=None):
    """
    Load the model and components of a Transformer pipeline from HuggingFace Hub.

    Args:
        flavor_conf: The flavor configuration
        accelerate_conf: The configuration for the accelerate library
        device: The device to load the model onto
    """
    loaded = {}

    model_repo = flavor_conf[FlavorKey.MODEL_NAME]
    model_revision = flavor_conf.get(FlavorKey.MODEL_REVISION)

    if not model_revision:
        raise MlflowException(
            "The model was saved with 'save_pretrained' set to False, but the commit hash is not "
            "found in the saved metadata. Loading the model with the different version may cause "
            "inconsistency issue and security risk.",
            error_code=INVALID_STATE,
        )

    loaded[FlavorKey.MODEL] = _load_model(
        model_repo, flavor_conf, accelerate_conf, device, revision=model_revision
    )

    components = flavor_conf.get(FlavorKey.COMPONENTS, [])
    if FlavorKey.PROCESSOR_TYPE in flavor_conf:
        components.append("processor")

    for name in components:
        loaded[name] = _load_component(flavor_conf, name)

    return loaded


def _load_component(flavor_conf, name, local_path=None, repo_id=None):
    import transformers

    _COMPONENT_TO_AUTOCLASS_MAP = {
        FlavorKey.TOKENIZER: transformers.AutoTokenizer,
        FlavorKey.FEATURE_EXTRACTOR: transformers.AutoFeatureExtractor,
        FlavorKey.PROCESSOR: transformers.AutoProcessor,
        FlavorKey.IMAGE_PROCESSOR: transformers.AutoImageProcessor,
    }

    component_name = flavor_conf[FlavorKey.COMPONENT_TYPE.format(name)]
    if hasattr(transformers, component_name):
        cls = getattr(transformers, component_name)
        trust_remote = False
    else:
        if local_path is None:
            raise MlflowException(
                f"A custom component `{component_name}` was specified, "
                "but no local config file was found to retrieve the "
                "definition. Make sure your model was saved with "
                "save_pretrained=True."
            )
        cls = _COMPONENT_TO_AUTOCLASS_MAP[name]
        trust_remote = True

    if local_path is not None:
        # Load component from local file
        return cls.from_pretrained(str(local_path), trust_remote_code=trust_remote)
    else:
        # Load component from HuggingFace Hub
        repo = repo_id or flavor_conf[FlavorKey.COMPONENT_NAME.format(name)]
        revision = flavor_conf.get(FlavorKey.COMPONENT_REVISION.format(name))
        return cls.from_pretrained(repo, revision=revision, trust_remote_code=trust_remote)


def _load_class_from_transformers_config(model_name_or_path, revision=None):
    """
    This method retrieves the Transformers AutoClass from the transformers config.
    Using the correct AutoClass allows us to leverage Transformers' model loading
    machinery, which is necessary for supporting models using custom code.
    """
    import transformers
    from transformers import AutoConfig

    config = AutoConfig.from_pretrained(
        model_name_or_path,
        revision=revision,
        # trust_remote_code is set to True in order to
        # make sure the config gets loaded as the correct
        # class. if this is not set for custom models, the
        # base class will be loaded instead of the custom one.
        trust_remote_code=True,
    )

    # the model's class name (e.g. "MPTForCausalLM")
    # is stored in the `architectures` field. it
    # seems to usually just have one element.
    class_name = config.architectures[0]

    # if the class is available in transformers natively,
    # then we don't need to execute any custom code.
    if hasattr(transformers, class_name):
        cls = getattr(transformers, class_name)
        return cls, False
    else:
        # else, we need to fetch the correct AutoClass.
        # this is defined in the `auto_map` field. there
        # should only be one AutoClass that maps to the
        # model's class name.
        auto_classes = [
            auto_class
            for auto_class, module in config.auto_map.items()
            if module.split(".")[-1] == class_name
        ]

        if len(auto_classes) == 0:
            raise MlflowException(f"Couldn't find a loader class for {class_name}")

        auto_class = auto_classes[0]
        cls = getattr(transformers, auto_class)

        # we will need to trust remote code when loading the model
        return cls, True


def _load_model(model_name_or_path, flavor_conf, accelerate_conf, device, revision=None):
    """
    Try to load a model with various loading strategies.
      1. Try to load the model with accelerate
      2. Try to load the model with the specified device
      3. Load the model without the device
    """
    import transformers

    if hasattr(transformers, flavor_conf[FlavorKey.MODEL_TYPE]):
        cls = getattr(transformers, flavor_conf[FlavorKey.MODEL_TYPE])
        trust_remote = False
    else:
        cls, trust_remote = _load_class_from_transformers_config(
            model_name_or_path, revision=revision
        )

    load_kwargs = {"revision": revision} if revision else {}
    if trust_remote:
        load_kwargs.update({"trust_remote_code": True})

    if model := _try_load_model_with_accelerate(
        cls, model_name_or_path, {**accelerate_conf, **load_kwargs}
    ):
        return model

    load_kwargs["device"] = device
    if torch_dtype := flavor_conf.get(FlavorKey.TORCH_DTYPE):
        load_kwargs[FlavorKey.TORCH_DTYPE] = torch_dtype

    if model := _try_load_model_with_device(cls, model_name_or_path, load_kwargs):
        return model
    _logger.warning(
        "Could not specify device parameter for this pipeline type."
        "Falling back to loading the model with the default device."
    )

    load_kwargs.pop("device", None)
    return cls.from_pretrained(model_name_or_path, **load_kwargs)


def _try_load_model_with_accelerate(model_class, model_name_or_path, load_kwargs):
    if MLFLOW_HUGGINGFACE_DISABLE_ACCELERATE_FEATURES.get():
        return None

    try:
        return model_class.from_pretrained(model_name_or_path, **load_kwargs)
    except (ValueError, TypeError, NotImplementedError, ImportError):
        # NB: ImportError is caught here in the event that `accelerate` is not installed
        # on the system, which will raise if `low_cpu_mem_usage` is set or the argument
        # `device_map` is set and accelerate is not installed.
        pass


def _try_load_model_with_device(model_class, model_name_or_path, load_kwargs):
    try:
        return model_class.from_pretrained(model_name_or_path, **load_kwargs)
    except OSError as e:
        revision = load_kwargs.get("revision")
        if f"{revision} is not a valid git identifier" in str(e):
            raise MlflowException(
                f"The model was saved with a HuggingFace Hub repository name '{model_name_or_path}'"
                f"and a commit hash '{revision}', but the commit is not found in the repository. "
            )
        else:
            raise e
    except (ValueError, TypeError, NotImplementedError):
        pass
```

--------------------------------------------------------------------------------

---[FILE: peft.py]---
Location: mlflow-master/mlflow/transformers/peft.py

```python
"""
PEFT (Parameter-Efficient Fine-Tuning) is a library for efficiently adapting large pretrained
models without fine-tuning all of model parameters but only a small number of (extra) parameters.
Users can define a PEFT model that wraps a Transformer model to apply a thin adapter layer on
top of the base model. The PEFT model provides almost the same APIs as the original model such
as from_pretrained(), save_pretrained().
"""

_PEFT_ADAPTOR_DIR_NAME = "peft"


def is_peft_model(model) -> bool:
    try:
        from peft import PeftModel
    except ImportError:
        return False

    return isinstance(model, PeftModel)


def get_peft_base_model(model):
    """Extract the base model from a PEFT model."""
    peft_config = model.peft_config.get(model.active_adapter) if model.peft_config else None

    # PEFT usually wraps the base model with two additional classes, one is PeftModel class
    # and the other is the adaptor specific class, like LoraModel class, so the class hierarchy
    # looks like PeftModel -> LoraModel -> BaseModel
    # However, when the PEFT config is the one for "prompt learning", there is not adaptor class
    # and the PeftModel class directly wraps the base model.
    if peft_config and not peft_config.is_prompt_learning:
        return model.base_model.model

    return model.base_model


def get_model_with_peft_adapter(base_model, peft_adapter_path):
    """
    Apply the PEFT adapter to the base model to create a PEFT model.

    NB: The alternative way to load PEFT adapter is to use load_adapter API like
    `base_model.load_adapter(peft_adapter_path)`, as it injects the adapter weights
    into the model in-place hence reducing the memory footprint. However, doing so
    returns the base model class and not the PEFT model, losing some properties
    such as peft_config. This is not preferable because load_model API should
    return the exact same object that was saved. Hence we construct the PEFT model
    instead of in-place injection, for consistency over the memory saving which
    should be small in most cases.
    """
    from peft import PeftModel

    return PeftModel.from_pretrained(base_model, peft_adapter_path)
```

--------------------------------------------------------------------------------

---[FILE: signature.py]---
Location: mlflow-master/mlflow/transformers/signature.py

```python
import json
import logging

import numpy as np

from mlflow.environment_variables import MLFLOW_INPUT_EXAMPLE_INFERENCE_TIMEOUT
from mlflow.models.signature import ModelSignature, infer_signature
from mlflow.models.utils import _contains_params
from mlflow.types.schema import ColSpec, DataType, Schema, TensorSpec
from mlflow.utils.os import is_windows
from mlflow.utils.timeout import MlflowTimeoutError, run_with_timeout

_logger = logging.getLogger(__name__)


_TEXT2TEXT_SIGNATURE = ModelSignature(
    inputs=Schema([ColSpec("string")]),
    outputs=Schema([ColSpec("string")]),
)
_CLASSIFICATION_SIGNATURE = ModelSignature(
    inputs=Schema([ColSpec("string")]),
    outputs=Schema([ColSpec("string", name="label"), ColSpec("double", name="score")]),
)

# Order is important here, the first matching task type will be used
_DEFAULT_SIGNATURE_FOR_TASK = {
    "token-classification": _TEXT2TEXT_SIGNATURE,
    "translation": _TEXT2TEXT_SIGNATURE,
    "text-generation": _TEXT2TEXT_SIGNATURE,
    "text2text-generation": _TEXT2TEXT_SIGNATURE,
    "text-classification": _CLASSIFICATION_SIGNATURE,
    "conversational": _TEXT2TEXT_SIGNATURE,
    "fill-mask": _TEXT2TEXT_SIGNATURE,
    "summarization": _TEXT2TEXT_SIGNATURE,
    "image-classification": _CLASSIFICATION_SIGNATURE,
    "zero-shot-classification": ModelSignature(
        inputs=Schema(
            [
                ColSpec(DataType.string, name="sequences"),
                ColSpec(DataType.string, name="candidate_labels"),
                ColSpec(DataType.string, name="hypothesis_template"),
            ]
        ),
        outputs=Schema(
            [
                ColSpec(DataType.string, name="sequence"),
                ColSpec(DataType.string, name="labels"),
                ColSpec(DataType.double, name="scores"),
            ]
        ),
    ),
    "automatic-speech-recognition": ModelSignature(
        inputs=Schema([ColSpec(DataType.binary)]),
        outputs=Schema([ColSpec(DataType.string)]),
    ),
    "audio-classification": ModelSignature(
        inputs=Schema([ColSpec(DataType.binary)]),
        outputs=Schema(
            [ColSpec(DataType.double, name="score"), ColSpec(DataType.string, name="label")]
        ),
    ),
    "table-question-answering": ModelSignature(
        inputs=Schema(
            [ColSpec(DataType.string, name="query"), ColSpec(DataType.string, name="table")]
        ),
        outputs=Schema([ColSpec(DataType.string)]),
    ),
    "question-answering": ModelSignature(
        inputs=Schema(
            [ColSpec(DataType.string, name="question"), ColSpec(DataType.string, name="context")]
        ),
        outputs=Schema([ColSpec(DataType.string)]),
    ),
    "feature-extraction": ModelSignature(
        inputs=Schema([ColSpec(DataType.string)]),
        outputs=Schema([TensorSpec(np.dtype("float64"), [-1], "double")]),
    ),
}


def infer_or_get_default_signature(
    pipeline, example=None, model_config=None, flavor_config=None
) -> ModelSignature:
    """
    Assigns a default ModelSignature for a given Pipeline type that has pyfunc support. These
    default signatures should only be generated and assigned when saving a model iff the user
    has not supplied a signature.
    For signature inference in some Pipelines that support complex input types, an input example
    is needed.
    """
    import transformers

    if example is not None and isinstance(pipeline, transformers.Pipeline):
        try:
            timeout = MLFLOW_INPUT_EXAMPLE_INFERENCE_TIMEOUT.get()
            if timeout and is_windows():
                timeout = None
                _logger.warning(
                    "On Windows, timeout is not supported for model signature inference. "
                    "Therefore, the operation is not bound by a timeout and may hang indefinitely. "
                    "If it hangs, please consider specifying the signature manually."
                )
            return _infer_signature_with_example(
                pipeline, example, model_config, flavor_config, timeout
            )
        except Exception as e:
            if isinstance(e, MlflowTimeoutError):
                msg = (
                    "Attempted to generate a signature for the saved pipeline but prediction timed "
                    f"out after {timeout} seconds. Falling back to the default signature for the "
                    "pipeline. You can specify a signature manually or increase the timeout "
                    f"by setting the environment variable {MLFLOW_INPUT_EXAMPLE_INFERENCE_TIMEOUT}"
                )
            else:
                msg = (
                    "Attempted to generate a signature for the saved pipeline but encountered an "
                    f"error. Fall back to the default signature for the pipeline type. Error: {e}"
                )
            _logger.warning(msg)

    task = getattr(pipeline, "task", None)
    if task.startswith("translation_"):
        task = "translation"
    if signature := _DEFAULT_SIGNATURE_FOR_TASK.get(task):
        return signature

    _logger.warning(
        "An unsupported task type was supplied for signature inference. Either provide an "
        "`input_example` or generate a signature manually via `infer_signature` to have a "
        "signature recorded in the MLmodel file."
    )


def _infer_signature_with_example(
    pipeline, example, model_config=None, flavor_config=None, timeout=None
) -> ModelSignature:
    params = None
    if _contains_params(example):
        example, params = example
    example = format_input_example_for_special_cases(example, pipeline)

    if timeout:
        _logger.info(
            "Running model prediction to infer the model output signature with a timeout "
            f"of {timeout} seconds. You can specify a different timeout by setting the "
            f"environment variable {MLFLOW_INPUT_EXAMPLE_INFERENCE_TIMEOUT}."
        )
        with run_with_timeout(timeout):
            prediction = generate_signature_output(
                pipeline, example, model_config, flavor_config, params
            )
    else:
        prediction = generate_signature_output(
            pipeline, example, model_config, flavor_config, params
        )
    return infer_signature(example, prediction, params)


def format_input_example_for_special_cases(input_example, pipeline):
    """
    Handles special formatting for specific types of Pipelines so that the displayed example
    reflects the correct example input structure that mirrors the behavior of the input parsing
    for pyfunc.
    """
    input_data = input_example[0] if isinstance(input_example, tuple) else input_example

    if (
        pipeline.task == "zero-shot-classification"
        and isinstance(input_data, dict)
        and isinstance(input_data["candidate_labels"], list)
    ):
        input_data["candidate_labels"] = json.dumps(input_data["candidate_labels"])
    return input_data if not isinstance(input_example, tuple) else (input_data, input_example[1])


def generate_signature_output(pipeline, data, model_config=None, flavor_config=None, params=None):
    # Lazy import to avoid circular dependencies. Ideally we should move _TransformersWrapper
    # out from __init__.py to avoid this.
    from mlflow.transformers import _TransformersWrapper

    return _TransformersWrapper(
        pipeline=pipeline, model_config=model_config, flavor_config=flavor_config
    ).predict(data, params=params)
```

--------------------------------------------------------------------------------

````
