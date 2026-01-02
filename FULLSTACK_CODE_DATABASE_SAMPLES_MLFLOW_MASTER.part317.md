---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 317
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 317 of 991)

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

---[FILE: output_parsers.py]---
Location: mlflow-master/mlflow/langchain/output_parsers.py

```python
from dataclasses import asdict
from typing import Any, AsyncIterator, Iterator
from uuid import uuid4

from langchain_core.messages.base import BaseMessage
from langchain_core.output_parsers.transform import BaseTransformOutputParser

from mlflow.models.rag_signatures import (
    ChainCompletionChoice,
    Message,
    StringResponse,
)
from mlflow.models.rag_signatures import (
    ChatCompletionResponse as RagChatCompletionResponse,
)
from mlflow.types.agent import ChatAgentChunk, ChatAgentMessage, ChatAgentResponse
from mlflow.types.llm import (
    ChatChoice,
    ChatChoiceDelta,
    ChatChunkChoice,
    ChatCompletionChunk,
    ChatCompletionResponse,
    ChatMessage,
)
from mlflow.utils.annotations import deprecated


@deprecated("mlflow.langchain.output_parser.ChatCompletionOutputParser")
class ChatCompletionsOutputParser(BaseTransformOutputParser[dict[str, Any]]):
    """
    OutputParser that wraps the string output into a dictionary representation of a
    :py:class:`ChatCompletionResponse`
    """

    @classmethod
    def is_lc_serializable(cls) -> bool:
        """Return whether this class is serializable."""
        return True

    @property
    def _type(self) -> str:
        """Return the output parser type for serialization."""
        return "mlflow_simplified_chat_completions"

    def parse(self, text: str) -> dict[str, Any]:
        return asdict(
            RagChatCompletionResponse(
                choices=[ChainCompletionChoice(message=Message(role="assistant", content=text))],
                object="chat.completion",
            )
        )


class ChatCompletionOutputParser(BaseTransformOutputParser[str]):
    """
    OutputParser that wraps the string output into a dictionary representation of a
    :py:class:`ChatCompletionResponse` or :py:class:`ChatCompletionChunk`
    when streaming
    """

    @classmethod
    def is_lc_serializable(cls) -> bool:
        """Return whether this class is serializable."""
        return True

    @property
    def _type(self) -> str:
        """Return the output parser type for serialization."""
        return "mlflow_chat_completion"

    def parse(self, text: str) -> dict[str, Any]:
        """Returns the input text as a ChatCompletionResponse with no changes."""
        return ChatCompletionResponse(
            choices=[ChatChoice(message=ChatMessage(role="assistant", content=text))]
        ).to_dict()

    def transform(self, input: Iterator[BaseMessage], config, **kwargs) -> Iterator[dict[str, Any]]:
        """Returns a generator of ChatCompletionChunk objects"""
        for chunk in input:
            yield ChatCompletionChunk(
                choices=[ChatChunkChoice(delta=ChatChoiceDelta(content=chunk.content))]
            ).to_dict()

    async def atransform(
        self,
        input: AsyncIterator[BaseMessage],
        config: Any,
        **kwargs: Any,
    ) -> AsyncIterator[ChatCompletionChunk]:
        async for chunk in input:
            yield ChatCompletionChunk(
                choices=[ChatChunkChoice(delta=ChatChoiceDelta(content=chunk.content))]
            ).to_dict()


@deprecated("mlflow.langchain.output_parser.ChatCompletionOutputParser")
class StringResponseOutputParser(BaseTransformOutputParser[dict[str, Any]]):
    """
    OutputParser that wraps the string output into an dictionary representation of a
    :py:class:`StringResponse`
    """

    @classmethod
    def is_lc_serializable(cls) -> bool:
        """Return whether this class is serializable."""
        return True

    @property
    def _type(self) -> str:
        """Return the output parser type for serialization."""
        return "mlflow_simplified_str_object"

    def parse(self, text: str) -> dict[str, Any]:
        return asdict(StringResponse(content=text))


class ChatAgentOutputParser(BaseTransformOutputParser[str]):
    """
    OutputParser that wraps the string output into a dictionary representation of a
    :py:class:`ChatAgentResponse <mlflow.types.agent.ChatAgentResponse>` or a
    :py:class:`ChatAgentChunk <mlflow.types.agent.ChatAgentChunk>` for easy interoperability.
    """

    @classmethod
    def is_lc_serializable(cls) -> bool:
        """Return whether this class is serializable."""
        return True

    @property
    def _type(self) -> str:
        """Return the output parser type for serialization."""
        return "mlflow_chat_agent"

    def parse(self, text: str) -> dict[str, Any]:
        """
        Returns the output text as a dictionary representation of a
        :py:class:`ChatAgentResponse <mlflow.types.agent.ChatAgentResponse>`.
        """
        return ChatAgentResponse(
            messages=[ChatAgentMessage(content=text, role="assistant", id=str(uuid4()))]
        ).model_dump(exclude_none=True)

    def transform(self, input: Iterator[BaseMessage], config, **kwargs) -> Iterator[dict[str, Any]]:
        """
        Returns a generator of
        :py:class:`ChatAgentChunk <mlflow.types.agent.ChatAgentChunk>` objects
        """
        for chunk in input:
            if chunk.content:
                yield ChatAgentChunk(
                    delta=ChatAgentMessage(content=chunk.content, role="assistant", id=chunk.id)
                ).model_dump(exclude_none=True)
```

--------------------------------------------------------------------------------

---[FILE: retriever_chain.py]---
Location: mlflow-master/mlflow/langchain/retriever_chain.py
Signals: Pydantic

```python
"""Chain for wrapping a retriever."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import yaml
from pydantic import ConfigDict, Field

from mlflow.langchain._compat import (
    import_async_callback_manager_for_chain_run,
    import_base_retriever,
    import_callback_manager_for_chain_run,
    import_document,
    try_import_chain,
)

AsyncCallbackManagerForChainRun = import_async_callback_manager_for_chain_run()
CallbackManagerForChainRun = import_callback_manager_for_chain_run()
BaseRetriever = import_base_retriever()
Document = import_document()
Chain = try_import_chain()

if Chain is None:
    raise ImportError(
        "Chain class not found. MLflow's retriever_chain functionality requires langchain<1.0.0. "
        "For langchain 1.0.0+, please use LangGraph instead."
    )


class _RetrieverChain(Chain):
    """
    Chain that wraps a retriever for use with MLflow.

    The MLflow ``langchain`` flavor provides the functionality to log a retriever object and
    evaluate it individually. This is useful if you want to evaluate the quality of the
    relevant documents returned by a retriever object without directing these documents
    through a large language model (LLM) to yield a summarized response.

    In order to log the retriever object in the ``langchain`` flavor, the retriever object
    needs to be wrapped within a ``_RetrieverChain``.

    See ``examples/langchain/retriever_chain.py`` for how to log the ``_RetrieverChain``.

    Args:
        retriever: The retriever to wrap.
    """

    input_key: str = "query"
    output_key: str = "source_documents"
    retriever: BaseRetriever = Field(exclude=True)

    model_config = ConfigDict(extra="forbid", arbitrary_types_allowed=True)

    @property
    def input_keys(self) -> list[str]:
        """Return the input keys."""
        return [self.input_key]

    @property
    def output_keys(self) -> list[str]:
        """Return the output keys."""
        return [self.output_key]

    def _get_docs(self, question: str) -> list[Document]:
        """Get documents from the retriever."""
        return self.retriever.get_relevant_documents(question)

    def _call(
        self,
        inputs: dict[str, Any],
        run_manager: CallbackManagerForChainRun | None = None,
    ) -> dict[str, Any]:
        """Run _get_docs on input query.
        Returns the retrieved documents under the key 'source_documents'.

        Example:

        .. code-block:: python

            chain = _RetrieverChain(retriever=...)
            res = chain({"query": "This is my query"})
            docs = res["source_documents"]
        """
        question = inputs[self.input_key]
        docs = self._get_docs(question)
        list_of_str_page_content = [doc.page_content for doc in docs]
        return {self.output_key: json.dumps(list_of_str_page_content)}

    async def _aget_docs(self, question: str) -> list[Document]:
        """Get documents from the retriever."""
        return await self.retriever.aget_relevant_documents(question)

    async def _acall(
        self,
        inputs: dict[str, Any],
        run_manager: AsyncCallbackManagerForChainRun | None = None,
    ) -> dict[str, Any]:
        """Run _get_docs on input query.
        Returns the retrieved documents under the key 'source_documents'.

        Example:

        .. code-block:: python

            chain = _RetrieverChain(retriever=...)
            res = chain({"query": "This is my query"})
            docs = res["source_documents"]
        """
        question = inputs[self.input_key]
        docs = await self._aget_docs(question)
        list_of_str_page_content = [doc.page_content for doc in docs]
        return {self.output_key: json.dumps(list_of_str_page_content)}

    @property
    def _chain_type(self) -> str:
        """Return the chain type."""
        return "retriever_chain"

    @classmethod
    def load(cls, file: str | Path, **kwargs: Any) -> _RetrieverChain:
        """Load a _RetrieverChain from a file."""
        # Convert file to Path object.
        file_path = Path(file) if isinstance(file, str) else file
        # Load from either json or yaml.
        if file_path.suffix == ".json":
            with open(file_path) as f:
                config = json.load(f)
        elif file_path.suffix in (".yaml", ".yml"):
            with open(file_path) as f:
                # This is to ignore certain tags that are not supported
                # with pydantic >= 2.0
                yaml.add_multi_constructor(
                    "tag:yaml.org,2002:python/object",
                    lambda loader, suffix, node: None,
                    Loader=yaml.SafeLoader,
                )
                config = yaml.load(f, yaml.SafeLoader)
        else:
            raise ValueError("File type must be json or yaml")

        # Override default 'verbose' and 'memory' for the chain
        if verbose := kwargs.pop("verbose", None):
            config["verbose"] = verbose
        if memory := kwargs.pop("memory", None):
            config["memory"] = memory

        if "_type" not in config:
            raise ValueError("Must specify a chain Type in config")
        config_type = config.pop("_type")

        if config_type != "retriever_chain":
            raise ValueError(f"Loading {config_type} chain not supported")

        retriever = kwargs.pop("retriever", None)
        if retriever is None:
            raise ValueError("`retriever` must be present.")

        config.pop("retriever", None)

        return cls(
            retriever=retriever,
            **config,
        )
```

--------------------------------------------------------------------------------

---[FILE: runnables.py]---
Location: mlflow-master/mlflow/langchain/runnables.py

```python
from __future__ import annotations

import os
import re
import warnings
from pathlib import Path
from typing import TYPE_CHECKING

import cloudpickle
import yaml

from mlflow.exceptions import MlflowException
from mlflow.langchain.utils.logging import (
    _BASE_LOAD_KEY,
    _CONFIG_LOAD_KEY,
    _MODEL_DATA_FOLDER_NAME,
    _MODEL_DATA_KEY,
    _MODEL_DATA_PKL_FILE_NAME,
    _MODEL_DATA_YAML_FILE_NAME,
    _MODEL_LOAD_KEY,
    _MODEL_TYPE_KEY,
    _PICKLE_LOAD_KEY,
    _RUNNABLE_LOAD_KEY,
    _load_base_lcs,
    _load_from_json,
    _load_from_pickle,
    _load_from_yaml,
    _patch_loader,
    _save_base_lcs,
    _validate_and_prepare_lc_model_or_path,
    base_lc_types,
    custom_type_to_loader_dict,
    get_unsupported_model_message,
    lc_runnable_assign_types,
    lc_runnable_binding_types,
    lc_runnable_branch_types,
    lc_runnable_with_steps_types,
    lc_runnables_types,
    patch_langchain_type_to_cls_dict,
    picklable_runnable_types,
)

if TYPE_CHECKING:
    try:
        from langchain.schema.runnable import Runnable
    except ImportError:
        from langchain_core.runnables import Runnable

_STEPS_FOLDER_NAME = "steps"
_RUNNABLE_STEPS_FILE_NAME = "steps.yaml"
_BRANCHES_FOLDER_NAME = "branches"
_MAPPER_FOLDER_NAME = "mapper"
_RUNNABLE_BRANCHES_FILE_NAME = "branches.yaml"
_DEFAULT_BRANCH_NAME = "default"
_RUNNABLE_BINDING_CONF_FILE_NAME = "binding_conf.yaml"


@patch_langchain_type_to_cls_dict
def _load_model_from_config(path, model_config):
    from langchain.chains.loading import type_to_loader_dict as chains_type_to_loader_dict
    from langchain.llms import get_type_to_cls_dict as llms_get_type_to_cls_dict

    try:
        from langchain.prompts.loading import type_to_loader_dict as prompts_types
    except ImportError:
        prompts_types = {"prompt", "few_shot_prompt"}

    config_path = os.path.join(path, model_config.get(_MODEL_DATA_KEY, _MODEL_DATA_YAML_FILE_NAME))
    # Load runnables from config file
    if config_path.endswith(".yaml"):
        config = _load_from_yaml(config_path)
    elif config_path.endswith(".json"):
        config = _load_from_json(config_path)
    else:
        raise MlflowException(
            f"Cannot load runnable without a config file. Got path {config_path}."
        )
    _type = config.get("_type")
    if _type in chains_type_to_loader_dict:
        from langchain.chains.loading import load_chain

        return _patch_loader(load_chain)(config_path)
    elif _type in prompts_types:
        from langchain.prompts.loading import load_prompt

        return load_prompt(config_path)
    elif _type in llms_get_type_to_cls_dict():
        from langchain_community.llms.loading import load_llm

        return _patch_loader(load_llm)(config_path)
    elif _type in custom_type_to_loader_dict():
        return custom_type_to_loader_dict()[_type](config)
    raise MlflowException(f"Unsupported type {_type} for loading.")


def _load_model_from_path(path: str, model_config=None):
    model_load_fn = model_config.get(_MODEL_LOAD_KEY)
    if model_load_fn == _RUNNABLE_LOAD_KEY:
        return _load_runnables(path, model_config)
    if model_load_fn == _BASE_LOAD_KEY:
        return _load_base_lcs(path, model_config)
    if model_load_fn == _CONFIG_LOAD_KEY:
        return _load_model_from_config(path, model_config)
    if model_load_fn == _PICKLE_LOAD_KEY:
        return _load_from_pickle(os.path.join(path, model_config.get(_MODEL_DATA_KEY)))
    raise MlflowException(f"Unsupported model load key {model_load_fn}")


def _validate_path(file_path: str | Path):
    load_path = Path(file_path)
    if not load_path.exists() or not load_path.is_dir():
        raise MlflowException(
            f"Path {load_path} must be an existing directory in order to load model."
        )
    return load_path


def _load_runnable_with_steps(file_path: Path | str, model_type: str):
    """Load the model

    Args:
        file_path: Path to file to load the model from.
        model_type: Type of the model to load.
    """
    from mlflow.langchain._compat import import_runnable_parallel, import_runnable_sequence

    RunnableParallel = import_runnable_parallel()
    RunnableSequence = import_runnable_sequence()

    load_path = _validate_path(file_path)

    steps_conf_file = load_path / _RUNNABLE_STEPS_FILE_NAME
    if not steps_conf_file.exists():
        raise MlflowException(
            f"File {steps_conf_file} must exist in order to load runnable with steps."
        )
    steps_conf = _load_from_yaml(steps_conf_file)
    steps_path = load_path / _STEPS_FOLDER_NAME
    _validate_path(steps_path)

    steps = {}
    # ignore hidden files
    for step in (f for f in os.listdir(steps_path) if not f.startswith(".")):
        config = steps_conf.get(step)
        # load model from the folder of the step
        runnable = _load_model_from_path(os.path.join(steps_path, step), config)
        steps[step] = runnable

    if model_type == RunnableSequence.__name__:
        steps = [value for _, value in sorted(steps.items(), key=lambda item: int(item[0]))]
        return runnable_sequence_from_steps(steps)
    if model_type == RunnableParallel.__name__:
        return RunnableParallel(steps)


def runnable_sequence_from_steps(steps):
    """Construct a RunnableSequence from steps.

    Args:
        steps: List of steps to construct the RunnableSequence from.
    """
    from mlflow.langchain._compat import import_runnable_sequence

    RunnableSequence = import_runnable_sequence()

    if len(steps) < 2:
        raise ValueError(f"RunnableSequence must have at least 2 steps, got {len(steps)}.")

    first, *middle, last = steps
    return RunnableSequence(first=first, middle=middle, last=last)


def _load_runnable_branch(file_path: Path | str):
    """Load the model

    Args:
        file_path: Path to file to load the model from.
    """
    from mlflow.langchain._compat import import_runnable_branch

    RunnableBranch = import_runnable_branch()

    load_path = _validate_path(file_path)

    branches_conf_file = load_path / _RUNNABLE_BRANCHES_FILE_NAME
    if not branches_conf_file.exists():
        raise MlflowException(
            f"File {branches_conf_file} must exist in order to load runnable with steps."
        )
    branches_conf = _load_from_yaml(branches_conf_file)
    branches_path = load_path / _BRANCHES_FOLDER_NAME
    _validate_path(branches_path)

    branches = []
    for branch in os.listdir(branches_path):
        # load model from the folder of the branch
        if branch == _DEFAULT_BRANCH_NAME:
            default_branch_path = branches_path / _DEFAULT_BRANCH_NAME
            default = _load_model_from_path(
                default_branch_path, branches_conf.get(_DEFAULT_BRANCH_NAME)
            )
        else:
            branch_tuple = []
            for i in range(2):
                config = branches_conf.get(f"{branch}-{i}")
                runnable = _load_model_from_path(
                    os.path.join(branches_path, branch, str(i)), config
                )
                branch_tuple.append(runnable)
            branches.append(tuple(branch_tuple))

    # default branch must be the last branch
    branches.append(default)

    return RunnableBranch(*branches)


def _load_runnable_assign(file_path: Path | str):
    """Load the model

    Args:
        file_path: Path to file to load the model from.
    """
    from mlflow.langchain._compat import import_runnable_assign

    RunnableAssign = import_runnable_assign()

    load_path = _validate_path(file_path)

    mapper_file = load_path / _MAPPER_FOLDER_NAME
    _validate_path(mapper_file)
    mapper = _load_runnable_with_steps(mapper_file, "RunnableParallel")
    return RunnableAssign(mapper)


def _load_runnable_binding(file_path: Path | str):
    """
    Load runnable binding model from the path
    """
    from mlflow.langchain._compat import import_runnable_binding

    RunnableBinding = import_runnable_binding()

    load_path = _validate_path(file_path)

    model_conf = _load_from_yaml(load_path / _RUNNABLE_BINDING_CONF_FILE_NAME)
    for field, value in model_conf.items():
        if _is_json_primitive(value):
            model_conf[field] = value
        # value is dictionary
        else:
            model_conf[field] = _load_model_from_path(load_path, value)
    return RunnableBinding(**model_conf)


def _save_internal_runnables(runnable, path, loader_fn, persist_dir):
    conf = {}
    if isinstance(runnable, lc_runnables_types()):
        conf[_MODEL_TYPE_KEY] = runnable.__class__.__name__
        conf.update(_save_runnables(runnable, path, loader_fn, persist_dir))
    elif isinstance(runnable, base_lc_types()):
        lc_model = _validate_and_prepare_lc_model_or_path(runnable, loader_fn)
        conf[_MODEL_TYPE_KEY] = lc_model.__class__.__name__
        conf.update(_save_base_lcs(lc_model, path, loader_fn, persist_dir))
    else:
        conf = {
            _MODEL_TYPE_KEY: runnable.__class__.__name__,
            _MODEL_DATA_KEY: _MODEL_DATA_YAML_FILE_NAME,
            _MODEL_LOAD_KEY: _CONFIG_LOAD_KEY,
        }
        model_path = path / _MODEL_DATA_YAML_FILE_NAME

        _warning_if_imported_from_lc_partner_pkg(runnable)

        # Save some simple runnables that langchain natively supports.
        if hasattr(runnable, "save"):
            runnable.save(model_path)
        elif hasattr(runnable, "dict"):
            runnable_dict = runnable.dict()
            with open(model_path, "w") as f:
                yaml.dump(runnable_dict, f, default_flow_style=False)
            # if the model cannot be loaded back, then `dict` is not enough for saving.
            _load_model_from_config(path, conf)
        else:
            raise Exception("Cannot save runnable without `save` or `dict` methods.")
    return conf


_LC_PARTNER_MODULE_PATTERN = re.compile(
    r"langchain_(?!core|community|experimental|cli|text-splitters)([a-z0-9-]+)$"
)


def _warning_if_imported_from_lc_partner_pkg(runnable):
    """
    Issues a warning if the model contains LangChain partner packages in its requirements.

    Popular integrations like OpenAI have been migrated from the central langchain-community
    package to their own partner packages (e.g. langchain-openai). However, the class loading
    mechanism in MLflow does not handle partner packages and always loads the community version.
    This can lead to unexpected behavior because the community version is no longer maintained.
    """
    module = runnable.__module__
    root_module = module.split(".")[0]
    if m := _LC_PARTNER_MODULE_PATTERN.match(root_module):
        warnings.warn(
            "Your model contains a class imported from the LangChain partner package "
            f"`langchain-{m.group(1)}`. When loading the model back, MLflow will use the "
            "community version of the classes instead of the partner packages, which may "
            "lead to unexpected behavior. To ensure that the model is loaded correctly, "
            "it is recommended to save the model with the 'model-from-code' method "
            "instead: https://mlflow.org/docs/latest/models.html#models-from-code"
        )


def _save_runnable_with_steps(model, file_path: Path | str, loader_fn=None, persist_dir=None):
    """Save the model with steps. Currently it supports saving RunnableSequence and
    RunnableParallel.

    If saving a RunnableSequence, steps is a list of Runnable objects. We save each step to the
    subfolder named by the step index.
    e.g.  - model
            - steps
              - 0
                - model.yaml
              - 1
                - model.pkl
            - steps.yaml
    If saving a RunnableParallel, steps is a dictionary of key-Runnable pairs. We save each step to
    the subfolder named by the key.
    e.g.  - model
            - steps
              - context
                - model.yaml
              - question
                - model.pkl
            - steps.yaml

    We save steps.yaml file to the model folder. It contains each step's model's configuration.

    Args:
        model: Runnable to be saved.
        file_path: Path to file to save the model to.
    """
    # Convert file to Path object.
    save_path = Path(file_path)
    save_path.mkdir(parents=True, exist_ok=True)

    # Save steps into a folder
    steps_path = save_path / _STEPS_FOLDER_NAME
    steps_path.mkdir()

    steps = get_runnable_steps(model)
    if isinstance(steps, list):
        generator = enumerate(steps)
    elif isinstance(steps, dict):
        generator = steps.items()
    else:
        raise MlflowException(
            f"Runnable {model} steps attribute must be either a list or a dictionary. "
            f"Got {type(steps).__name__}."
        )
    unsaved_runnables = {}
    steps_conf = {}
    for key, runnable in generator:
        step = str(key)
        # Save each step into a subfolder named by step
        save_runnable_path = steps_path / step
        save_runnable_path.mkdir()
        try:
            steps_conf[step] = _save_internal_runnables(
                runnable, save_runnable_path, loader_fn, persist_dir
            )
        except Exception as e:
            unsaved_runnables[step] = f"{runnable.get_name()} -- {e}"

    if unsaved_runnables:
        raise MlflowException(f"Failed to save runnable sequence: {unsaved_runnables}.")

    # save steps configs
    with save_path.joinpath(_RUNNABLE_STEPS_FILE_NAME).open("w") as f:
        yaml.dump(steps_conf, f, default_flow_style=False)


def _save_runnable_branch(model, file_path, loader_fn, persist_dir):
    """
    Save runnable branch in to path.
    """
    save_path = Path(file_path)
    save_path.mkdir(parents=True, exist_ok=True)
    # save branches into a folder
    branches_path = save_path / _BRANCHES_FOLDER_NAME
    branches_path.mkdir()

    unsaved_runnables = {}
    branches_conf = {}
    for index, branch_tuple in enumerate(model.branches):
        # Save each branch into a subfolder named by index
        # and save condition and runnable into subfolder
        for i, runnable in enumerate(branch_tuple):
            save_runnable_path = branches_path / str(index) / str(i)
            save_runnable_path.mkdir(parents=True)
            branches_conf[f"{index}-{i}"] = {}

            try:
                branches_conf[f"{index}-{i}"] = _save_internal_runnables(
                    runnable, save_runnable_path, loader_fn, persist_dir
                )
            except Exception as e:
                unsaved_runnables[f"{index}-{i}"] = f"{runnable.get_name()} -- {e}"

    # save default branch
    default_branch_path = branches_path / _DEFAULT_BRANCH_NAME
    default_branch_path.mkdir()
    try:
        branches_conf[_DEFAULT_BRANCH_NAME] = _save_internal_runnables(
            model.default, default_branch_path, loader_fn, persist_dir
        )
    except Exception as e:
        unsaved_runnables[_DEFAULT_BRANCH_NAME] = f"{model.default.get_name()} -- {e}"
    if unsaved_runnables:
        raise MlflowException(f"Failed to save runnable branch: {unsaved_runnables}.")

    # save branches configs
    with save_path.joinpath(_RUNNABLE_BRANCHES_FILE_NAME).open("w") as f:
        yaml.dump(branches_conf, f, default_flow_style=False)


def _save_runnable_assign(model, file_path, loader_fn=None, persist_dir=None):
    from mlflow.langchain._compat import import_runnable_parallel

    RunnableParallel = import_runnable_parallel()

    save_path = Path(file_path)
    save_path.mkdir(parents=True, exist_ok=True)
    # save mapper into a folder
    mapper_path = save_path / _MAPPER_FOLDER_NAME
    mapper_path.mkdir()

    if not isinstance(model.mapper, RunnableParallel):
        raise MlflowException(
            f"Failed to save model {model} with type {model.__class__.__name__}. "
            "RunnableAssign's mapper must be a RunnableParallel."
        )
    _save_runnable_with_steps(model.mapper, mapper_path, loader_fn, persist_dir)


def _is_json_primitive(value):
    return (
        value is None
        or isinstance(value, (str, int, float, bool))
        or (isinstance(value, list) and all(_is_json_primitive(v) for v in value))
    )


def _save_runnable_binding(model, file_path, loader_fn=None, persist_dir=None):
    save_path = Path(file_path)
    save_path.mkdir(parents=True, exist_ok=True)
    model_config = {}

    # runnableBinding bound is the real runnable to be invoked
    model_config["bound"] = _save_internal_runnables(model.bound, save_path, loader_fn, persist_dir)

    # save other fields
    for field, value in model.model_dump().items():
        if _is_json_primitive(value):
            model_config[field] = value
        elif field != "bound":
            model_config[field] = {
                _MODEL_LOAD_KEY: _PICKLE_LOAD_KEY,
                _MODEL_DATA_KEY: f"{field}.pkl",
            }
            _pickle_object(value, os.path.join(save_path, f"{field}.pkl"))

    # save fields configs
    with save_path.joinpath(_RUNNABLE_BINDING_CONF_FILE_NAME).open("w") as f:
        yaml.dump(model_config, f, default_flow_style=False)


def _pickle_object(model, path: str):
    if not path.endswith(".pkl"):
        raise ValueError(f"File path must end with .pkl, got {path}.")
    with open(path, "wb") as f:
        cloudpickle.dump(model, f)


def _save_runnables(model, path, loader_fn=None, persist_dir=None):
    model_data_kwargs = {
        _MODEL_LOAD_KEY: _RUNNABLE_LOAD_KEY,
        _MODEL_TYPE_KEY: model.__class__.__name__,
    }
    if isinstance(model, lc_runnable_with_steps_types()):
        model_data_path = _MODEL_DATA_FOLDER_NAME
        _save_runnable_with_steps(
            model, os.path.join(path, model_data_path), loader_fn, persist_dir
        )
    elif isinstance(model, picklable_runnable_types()):
        model_data_path = _MODEL_DATA_PKL_FILE_NAME
        _pickle_object(model, os.path.join(path, model_data_path))
    elif isinstance(model, lc_runnable_branch_types()):
        model_data_path = _MODEL_DATA_FOLDER_NAME
        _save_runnable_branch(model, os.path.join(path, model_data_path), loader_fn, persist_dir)
    elif isinstance(model, lc_runnable_assign_types()):
        model_data_path = _MODEL_DATA_FOLDER_NAME
        _save_runnable_assign(model, os.path.join(path, model_data_path), loader_fn, persist_dir)
    elif isinstance(model, lc_runnable_binding_types()):
        model_data_path = _MODEL_DATA_FOLDER_NAME
        _save_runnable_binding(model, os.path.join(path, model_data_path), loader_fn, persist_dir)
    else:
        raise MlflowException.invalid_parameter_value(
            get_unsupported_model_message(type(model).__name__)
        )
    model_data_kwargs[_MODEL_DATA_KEY] = model_data_path
    return model_data_kwargs


def _load_runnables(path, conf):
    model_type = conf.get(_MODEL_TYPE_KEY)
    model_data = conf.get(_MODEL_DATA_KEY, _MODEL_DATA_YAML_FILE_NAME)
    if model_type in (x.__name__ for x in lc_runnable_with_steps_types()):
        return _load_runnable_with_steps(os.path.join(path, model_data), model_type)
    if (
        model_type in (x.__name__ for x in picklable_runnable_types())
        or model_data == _MODEL_DATA_PKL_FILE_NAME
    ):
        return _load_from_pickle(os.path.join(path, model_data))
    if model_type in (x.__name__ for x in lc_runnable_branch_types()):
        return _load_runnable_branch(os.path.join(path, model_data))
    if model_type in (x.__name__ for x in lc_runnable_assign_types()):
        return _load_runnable_assign(os.path.join(path, model_data))
    if model_type in (x.__name__ for x in lc_runnable_binding_types()):
        return _load_runnable_binding(os.path.join(path, model_data))
    raise MlflowException.invalid_parameter_value(get_unsupported_model_message(model_type))


def get_runnable_steps(model: Runnable):
    try:
        return model.steps
    except AttributeError:
        # RunnableParallel stores steps as `steps__` attribute since version 0.16.0, while it was
        # stored as `steps` attribute before that and other runnables like RunnableSequence still
        # has `steps` property.
        return model.steps__
```

--------------------------------------------------------------------------------

---[FILE: _compat.py]---
Location: mlflow-master/mlflow/langchain/_compat.py

```python
def import_base_retriever():
    try:
        from langchain.schema import BaseRetriever

        return BaseRetriever
    except ImportError:
        from langchain_core.retrievers import BaseRetriever

        return BaseRetriever


def import_document():
    try:
        from langchain.schema import Document

        return Document
    except ImportError:
        from langchain_core.documents import Document

        return Document


def import_runnable():
    try:
        from langchain.schema.runnable import Runnable

        return Runnable
    except ImportError:
        from langchain_core.runnables import Runnable

        return Runnable


def import_runnable_parallel():
    try:
        from langchain.schema.runnable import RunnableParallel

        return RunnableParallel
    except ImportError:
        from langchain_core.runnables import RunnableParallel

        return RunnableParallel


def import_runnable_sequence():
    try:
        from langchain.schema.runnable import RunnableSequence

        return RunnableSequence
    except ImportError:
        from langchain_core.runnables import RunnableSequence

        return RunnableSequence


def import_runnable_branch():
    try:
        from langchain.schema.runnable import RunnableBranch

        return RunnableBranch
    except ImportError:
        from langchain_core.runnables import RunnableBranch

        return RunnableBranch


def import_runnable_binding():
    try:
        from langchain.schema.runnable import RunnableBinding

        return RunnableBinding
    except ImportError:
        from langchain_core.runnables import RunnableBinding

        return RunnableBinding


def import_runnable_lambda():
    try:
        from langchain.schema.runnable import RunnableLambda

        return RunnableLambda
    except ImportError:
        from langchain_core.runnables import RunnableLambda

        return RunnableLambda


def import_runnable_passthrough():
    try:
        from langchain.schema.runnable import RunnablePassthrough

        return RunnablePassthrough
    except ImportError:
        from langchain_core.runnables import RunnablePassthrough

        return RunnablePassthrough


def import_runnable_assign():
    try:
        from langchain.schema.runnable.passthrough import RunnableAssign

        return RunnableAssign
    except ImportError:
        from langchain_core.runnables import RunnableAssign

        return RunnableAssign


def import_str_output_parser():
    try:
        from langchain.schema.output_parser import StrOutputParser

        return StrOutputParser
    except ImportError:
        from langchain_core.output_parsers import StrOutputParser

        return StrOutputParser


def try_import_agent_executor():
    try:
        from langchain.agents.agent import AgentExecutor

        return AgentExecutor
    except ImportError:
        return None


def try_import_chain():
    try:
        from langchain.chains.base import Chain

        return Chain
    except ImportError:
        return None


def try_import_simple_chat_model():
    try:
        from langchain.chat_models.base import SimpleChatModel

        return SimpleChatModel
    except ImportError:
        pass

    try:
        from langchain_core.language_models import SimpleChatModel

        return SimpleChatModel
    except ImportError:
        return None


def import_chat_prompt_template():
    try:
        from langchain.prompts import ChatPromptTemplate

        return ChatPromptTemplate
    except ImportError:
        from langchain_core.prompts import ChatPromptTemplate

        return ChatPromptTemplate


def import_base_callback_handler():
    try:
        from langchain.callbacks.base import BaseCallbackHandler

        return BaseCallbackHandler
    except ImportError:
        from langchain_core.callbacks.base import BaseCallbackHandler

        return BaseCallbackHandler


def import_callback_manager_for_chain_run():
    try:
        from langchain.callbacks.manager import CallbackManagerForChainRun

        return CallbackManagerForChainRun
    except ImportError:
        from langchain_core.callbacks.manager import CallbackManagerForChainRun

        return CallbackManagerForChainRun


def import_async_callback_manager_for_chain_run():
    try:
        from langchain.callbacks.manager import AsyncCallbackManagerForChainRun

        return AsyncCallbackManagerForChainRun
    except ImportError:
        from langchain_core.callbacks.manager import AsyncCallbackManagerForChainRun

        return AsyncCallbackManagerForChainRun


def try_import_llm_chain():
    try:
        from langchain.chains.llm import LLMChain

        return LLMChain
    except ImportError:
        return None


def try_import_base_chat_model():
    try:
        from langchain.chat_models.base import BaseChatModel

        return BaseChatModel
    except ImportError:
        pass

    try:
        from langchain_core.language_models.chat_models import BaseChatModel

        return BaseChatModel
    except ImportError:
        return None
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/langchain/__init__.py

```python
from mlflow.langchain.autolog import autolog
from mlflow.langchain.constants import FLAVOR_NAME
from mlflow.version import IS_TRACING_SDK_ONLY

__all__ = ["autolog", "FLAVOR_NAME"]

# Import model logging APIs only if mlflow skinny or full package is installed,
# i.e., skip if only mlflow-tracing package is installed.
if not IS_TRACING_SDK_ONLY:
    from mlflow.langchain.model import (
        _LangChainModelWrapper,
        _load_pyfunc,
        load_model,
        log_model,
        save_model,
    )

    __all__ += [
        "_LangChainModelWrapper",
        "_load_pyfunc",
        "load_model",
        "log_model",
        "save_model",
    ]
```

--------------------------------------------------------------------------------

````
