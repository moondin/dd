---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 238
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 238 of 991)

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
Location: mlflow-master/mlflow/crewai/autolog.py

```python
import inspect
import json
import logging
import warnings
from contextlib import contextmanager, nullcontext
from typing import Any

from packaging.version import Version

import mlflow
from mlflow.entities import SpanType
from mlflow.entities.span import LiveSpan
from mlflow.tracing.constant import SpanAttributeKey, TokenUsageKey
from mlflow.tracing.utils import TraceJSONEncoder
from mlflow.utils.autologging_utils.config import AutoLoggingConfig

_logger = logging.getLogger(__name__)


def patched_standalone_call(original, *args, **kwargs):
    config = AutoLoggingConfig.init(flavor_name=mlflow.crewai.FLAVOR_NAME)

    if not config.log_traces:
        return original(*args, **kwargs)

    fullname, span_type = _resolve_standalone_span(original, kwargs)
    if fullname is None or span_type is None:
        _logger.debug(f"Could not resolve span name or type for {original}")
        return original(*args, **kwargs)

    with mlflow.start_span(name=fullname, span_type=span_type) as span:
        inputs = _construct_full_inputs(original, *args, **kwargs)
        span.set_inputs(inputs)

        result = original(*args, **kwargs)

        # Need to convert the response of generate_content for better visualization
        outputs = result.__dict__ if hasattr(result, "__dict__") else result
        span.set_outputs(outputs)

        return result


def patched_class_call(original, self, *args, **kwargs):
    config = AutoLoggingConfig.init(flavor_name=mlflow.crewai.FLAVOR_NAME)

    if not config.log_traces:
        return original(self, *args, **kwargs)

    default_name = f"{self.__class__.__name__}.{original.__name__}"
    fullname = _get_span_name(self) or default_name
    span_type = _get_span_type(self)
    with mlflow.start_span(name=fullname, span_type=span_type) as span:
        inputs = _construct_full_inputs(original, self, *args, **kwargs)
        span.set_inputs(inputs)
        _set_span_attributes(span=span, instance=self)

        # CrewAI reports only crew-level usage totals.
        # This patch hooks LiteLLM's `completion` to capture each response
        # so per-call LLM usage can be logged.
        capture_context = (
            _capture_llm_response(self) if span_type == SpanType.LLM else nullcontext()
        )
        with capture_context:
            result = original(self, *args, **kwargs)

        # Need to convert the response of generate_content for better visualization
        outputs = result.__dict__ if hasattr(result, "__dict__") else result

        if span_type == SpanType.LLM and (usage_dict := _parse_usage(self)):
            span.set_attribute(SpanAttributeKey.CHAT_USAGE, usage_dict)
        span.set_outputs(outputs)

        return result


def _capture_llm_response(instance):
    @contextmanager
    def _patched_completion():
        import litellm

        original_completion = litellm.completion

        def _capture_completion(*args, **kwargs):
            response = original_completion(*args, **kwargs)
            setattr(instance, "_mlflow_last_response", response)
            return response

        litellm.completion = _capture_completion
        try:
            yield
        finally:
            litellm.completion = original_completion

    return _patched_completion()


def _parse_usage(instance: Any) -> dict[str, int] | None:
    usage = instance.__dict__.get("_mlflow_last_response", {}).get("usage", {})
    if not usage:
        return None

    return {
        TokenUsageKey.INPUT_TOKENS: usage.prompt_tokens,
        TokenUsageKey.OUTPUT_TOKENS: usage.completion_tokens,
        TokenUsageKey.TOTAL_TOKENS: usage.total_tokens,
    }


def _resolve_standalone_span(original, kwargs) -> tuple[str, SpanType]:
    name = original.__name__
    if name == "execute_tool_and_check_finality":
        # default_tool_name should not be hit in normal runs; may append if crewai bugs
        default_tool_name = "ToolExecution"
        fullname = kwargs["agent_action"].tool if "agent_action" in kwargs else None
        fullname = fullname or default_tool_name
        return fullname, SpanType.TOOL

    return None, None


def _get_span_type(instance) -> str:
    import crewai
    from crewai import LLM, Agent, Crew, Task
    from crewai.flow.flow import Flow

    try:
        if isinstance(instance, (Flow, Crew, Task)):
            return SpanType.CHAIN
        elif isinstance(instance, Agent):
            return SpanType.AGENT
        elif isinstance(instance, LLM):
            return SpanType.LLM
        elif isinstance(instance, Flow):
            return SpanType.CHAIN
        elif isinstance(
            instance, crewai.agents.agent_builder.base_agent_executor_mixin.CrewAgentExecutorMixin
        ):
            return SpanType.MEMORY

        CREWAI_VERSION = Version(crewai.__version__)
        # Knowledge and Memory are not available before 0.83.0
        if CREWAI_VERSION >= Version("0.83.0"):
            memory_classes = (
                crewai.memory.ShortTermMemory,
                crewai.memory.LongTermMemory,
                crewai.memory.EntityMemory,
            )
            # UserMemory was removed in 0.157.0:
            # https://github.com/crewAIInc/crewAI/pull/3225
            if CREWAI_VERSION < Version("0.157.0"):
                memory_classes = (*memory_classes, crewai.memory.UserMemory)

            if isinstance(instance, memory_classes):
                return SpanType.MEMORY

            if isinstance(instance, crewai.Knowledge):
                return SpanType.RETRIEVER
    except AttributeError as e:
        _logger.warn("An exception happens when resolving the span type. Exception: %s", e)

    return SpanType.UNKNOWN


def _get_span_name(instance) -> str | None:
    try:
        from crewai import LLM, Agent, Crew, Task

        if isinstance(instance, Crew):
            default_name = Crew.model_fields["name"].default
            return instance.name if instance.name != default_name else None
        elif isinstance(instance, Task):
            return instance.name
        elif isinstance(instance, Agent):
            return instance.role
        elif isinstance(instance, LLM):
            return instance.model

    except AttributeError as e:
        _logger.debug("An exception happens when resolving the span name. Exception: %s", e)

    return None


def _is_serializable(value):
    try:
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            # There is type mismatch in some crewai class, suppress warning here
            json.dumps(value, cls=TraceJSONEncoder, ensure_ascii=False)
        return True
    except (TypeError, ValueError):
        return False


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
        if v is not None and _is_serializable(v)
    }


def _set_span_attributes(span: LiveSpan, instance):
    # Crewai is available only python >=3.10, so importing libraries inside methods.
    try:
        import crewai
        from crewai import LLM, Agent, Crew, Task
        from crewai.flow.flow import Flow

        ## Memory class does not have helpful attributes
        if isinstance(instance, Crew):
            for key, value in instance.__dict__.items():
                if value is not None:
                    if key == "tasks":
                        value = _parse_tasks(value)
                    elif key == "agents":
                        value = _parse_agents(value)
                    elif key == "embedder":
                        value = _sanitize_value(value)
                    span.set_attribute(key, str(value) if isinstance(value, list) else value)

        elif isinstance(instance, Agent):
            agent = _get_agent_attributes(instance)
            for key, value in agent.items():
                if value is not None:
                    span.set_attribute(key, str(value) if isinstance(value, list) else value)

        elif isinstance(instance, Task):
            task = _get_task_attributes(instance)
            for key, value in task.items():
                if value is not None:
                    span.set_attribute(key, str(value) if isinstance(value, list) else value)

        elif isinstance(instance, LLM):
            llm = _get_llm_attributes(instance)
            for key, value in llm.items():
                if value is not None:
                    span.set_attribute(key, str(value) if isinstance(value, list) else value)

        elif isinstance(instance, Flow):
            for key, value in instance.__dict__.items():
                if value is not None:
                    span.set_attribute(key, str(value) if isinstance(value, list) else value)

        elif Version(crewai.__version__) >= Version("0.83.0"):
            if isinstance(instance, crewai.Knowledge):
                for key, value in instance.__dict__.items():
                    if value is not None and key != "storage":
                        span.set_attribute(key, str(value) if isinstance(value, list) else value)

    except AttributeError as e:
        _logger.warn("An exception happens when saving span attributes. Exception: %s", e)


def _get_agent_attributes(instance):
    agent = {}
    for key, value in instance.__dict__.items():
        if key == "tools":
            value = _parse_tools(value)
        elif key == "embedder":
            value = _sanitize_value(value)
        if value is None:
            continue
        agent[key] = str(value)

    return agent


def _get_task_attributes(instance):
    task = {}
    for key, value in instance.__dict__.items():
        if value is None:
            continue
        if key == "tools":
            value = _parse_tools(value)
            task[key] = value
        elif key == "agent":
            task[key] = value.role
        else:
            task[key] = str(value)
    return task


def _get_llm_attributes(instance):
    llm = {SpanAttributeKey.MESSAGE_FORMAT: "crewai"}
    for key, value in instance.__dict__.items():
        if value is None:
            continue
        elif key in ["callbacks", "api_key"]:
            # Skip callbacks until how they should be logged are decided
            continue
        else:
            llm[key] = str(value)
    return llm


def _parse_agents(agents):
    attributes = []
    for agent in agents:
        model = None
        if agent.llm is not None:
            if hasattr(agent.llm, "model"):
                model = agent.llm.model
            elif hasattr(agent.llm, "model_name"):
                model = agent.llm.model_name
        attributes.append(
            {
                "id": str(agent.id),
                "role": agent.role,
                "goal": agent.goal,
                "backstory": agent.backstory,
                "cache": agent.cache,
                "config": agent.config,
                "verbose": agent.verbose,
                "allow_delegation": agent.allow_delegation,
                "tools": agent.tools,
                "max_iter": agent.max_iter,
                "llm": str(model if model is not None else ""),
            }
        )
    return attributes


def _parse_tasks(tasks):
    return [
        {
            "agent": task.agent.role,
            "description": task.description,
            "async_execution": task.async_execution,
            "expected_output": task.expected_output,
            "human_input": task.human_input,
            "tools": task.tools,
            "output_file": task.output_file,
        }
        for task in tasks
    ]


def _parse_tools(tools):
    result = []
    for tool in tools:
        res = {}
        if hasattr(tool, "name") and tool.name is not None:
            res["name"] = tool.name
        if hasattr(tool, "description") and tool.description is not None:
            res["description"] = tool.description
        if res:
            result.append(
                {
                    "type": "function",
                    "function": res,
                }
            )
    return result


def _sanitize_value(val):
    """
    Sanitize a value to remove sensitive information.

    Args:
        val: The value to sanitize. Can be None, a dict, a list, or other types.

    Returns:
        The sanitized value.
    """
    if val is None:
        return None

    sensitive_keys = ["api_key", "secret", "password", "token"]

    if isinstance(val, dict):
        sanitized = {}
        for k, v in val.items():
            if any(sensitive in k.lower() for sensitive in sensitive_keys):
                continue
            sanitized[k] = _sanitize_value(v)
        return sanitized

    elif isinstance(val, list):
        return [_sanitize_value(item) for item in val]

    return val
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/crewai/__init__.py

```python
"""
The ``mlflow.crewai`` module provides an API for tracing CrewAI AI agents.
"""

import importlib
import logging

from packaging.version import Version

from mlflow.crewai.autolog import (
    patched_class_call,
    patched_standalone_call,
)
from mlflow.telemetry.events import AutologgingEvent
from mlflow.telemetry.track import _record_event
from mlflow.utils.autologging_utils import autologging_integration, safe_patch

_logger = logging.getLogger(__name__)

FLAVOR_NAME = "crewai"


@autologging_integration(FLAVOR_NAME)
def autolog(
    log_traces: bool = True,
    disable: bool = False,
    silent: bool = False,
):
    """
    Enables (or disables) and configures autologging from CrewAI to MLflow.
    Note that asynchronous APIs and Tool calling are not recorded now.

    Args:
        log_traces: If ``True``, traces are logged for CrewAI agents.
            If ``False``, no traces are collected during inference. Default to ``True``.
        disable: If ``True``, disables the CrewAI autologging. Default to ``False``.
        silent: If ``True``, suppress all event logs and warnings from MLflow during CrewAI
            autologging. If ``False``, show all events and warnings.
    """
    # TODO: Handle asynchronous tasks and crew executions
    import crewai

    CREWAI_VERSION = Version(crewai.__version__)

    class_method_map = {
        "crewai.Crew": ["kickoff", "kickoff_for_each", "train"],
        "crewai.Agent": ["execute_task"],
        "crewai.Task": ["execute_sync"],
        "crewai.LLM": ["call"],
        "crewai.Flow": ["kickoff"],
        "crewai.agents.agent_builder.base_agent_executor_mixin.CrewAgentExecutorMixin": [
            "_create_long_term_memory"
        ],
    }
    standalone_method_map = {}

    if CREWAI_VERSION >= Version("0.83.0"):
        # knowledge and memory are not available before 0.83.0
        class_method_map.update(
            {
                "crewai.memory.ShortTermMemory": ["save", "search"],
                "crewai.memory.LongTermMemory": ["save", "search"],
                "crewai.memory.EntityMemory": ["save", "search"],
                "crewai.Knowledge": ["query"],
            }
        )
        if CREWAI_VERSION < Version("0.157.0"):
            class_method_map.update({"crewai.memory.UserMemory": ["save", "search"]})

    # Modern Tool calling support for CrewAI >= 0.114.0
    if CREWAI_VERSION >= Version("0.114.0"):
        standalone_method_map.update(
            {"crewai.agents.crew_agent_executor": ["execute_tool_and_check_finality"]}
        )
    try:
        _apply_patches(standalone_method_map, _import_module, patched_standalone_call)
        _apply_patches(class_method_map, _import_class, patched_class_call)
    except (AttributeError, ModuleNotFoundError) as e:
        _logger.error("An exception happens when applying auto-tracing to crewai. Exception: %s", e)

    _record_event(
        AutologgingEvent, {"flavor": FLAVOR_NAME, "log_traces": log_traces, "disable": disable}
    )


def _apply_patches(target_map, resolver, patch_fn):
    for target_path, methods in target_map.items():
        target = resolver(target_path)
        for method in methods:
            safe_patch(
                FLAVOR_NAME,
                target,
                method,
                patch_fn,
            )


def _import_module(module_path: str):
    return importlib.import_module(module_path)


def _import_class(class_path: str):
    *module_parts, class_name = class_path.rsplit(".", 1)
    module_path = ".".join(module_parts)
    module = importlib.import_module(module_path)
    return getattr(module, class_name)
```

--------------------------------------------------------------------------------

---[FILE: artifact_dataset_sources.py]---
Location: mlflow-master/mlflow/data/artifact_dataset_sources.py

```python
import re
import warnings
from pathlib import Path
from typing import Any, TypeVar
from urllib.parse import urlparse

from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE
from mlflow.store.artifact.artifact_repository_registry import get_registered_artifact_repositories
from mlflow.utils.uri import is_local_uri


def register_artifact_dataset_sources():
    from mlflow.data.dataset_source_registry import register_dataset_source

    registered_source_schemes = set()
    artifact_schemes_to_exclude = [
        "http",
        "https",
        "runs",
        "models",
        "mlflow-artifacts",
        # DBFS supports two access patterns: dbfs:/ (URI) and /dbfs (FUSE).
        # The DBFS artifact repository online supports dbfs:/ (URI). To ensure
        # a consistent dictionary representation of DBFS datasets across the URI and
        # FUSE representations, we exclude dbfs from the set of dataset sources
        # that are autogenerated using artifact repositories and instead define
        # a separate DBFSDatasetSource elsewhere
        "dbfs",
    ]
    schemes_to_artifact_repos = get_registered_artifact_repositories()
    for scheme, artifact_repo in schemes_to_artifact_repos.items():
        if scheme in artifact_schemes_to_exclude or scheme in registered_source_schemes:
            continue

        if "ArtifactRepository" in artifact_repo.__name__:
            # Artifact repository name is something like "LocalArtifactRepository",
            # "S3ArtifactRepository", etc. To preserve capitalization, strip ArtifactRepository
            # and replace it with ArtifactDatasetSource
            dataset_source_name = artifact_repo.__name__.replace(
                "ArtifactRepository", "ArtifactDatasetSource"
            )
        else:
            # Artifact repository name has some other form, e.g. "dbfs_artifact_repo_factory".
            # In this case, generate the name by capitalizing the first letter of the scheme and
            # appending ArtifactRepository
            scheme = str(scheme)

            def camelcase_scheme(scheme):
                parts = re.split(r"[-_]", scheme)
                return "".join([part.capitalize() for part in parts])

            source_name_prefix = camelcase_scheme(scheme)
            dataset_source_name = source_name_prefix + "ArtifactDatasetSource"

        try:
            registered_source_schemes.add(scheme)
            dataset_source = _create_dataset_source_for_artifact_repo(
                scheme=scheme, dataset_source_name=dataset_source_name
            )
            register_dataset_source(dataset_source)
        except Exception as e:
            warnings.warn(
                f"Failed to register a dataset source for URIs with scheme '{scheme}': {e}",
                stacklevel=2,
            )


def _create_dataset_source_for_artifact_repo(scheme: str, dataset_source_name: str):
    from mlflow.data.filesystem_dataset_source import FileSystemDatasetSource

    if scheme in ["", "file"]:
        source_type = "local"
        class_docstring = "Represents the source of a dataset stored on the local filesystem."
    else:
        source_type = scheme
        class_docstring = (
            f"Represents a filesystem-based or blob-storage-based dataset source identified by a"
            f" URI with scheme '{scheme}'."
        )

    DatasetForArtifactRepoSourceType = TypeVar(dataset_source_name)

    class ArtifactRepoSource(FileSystemDatasetSource):
        def __init__(self, uri: str):
            self._uri = uri

        @property
        def uri(self):
            """
            The URI with scheme '{scheme}' referring to the dataset source filesystem location.

            Returns
                The URI with scheme '{scheme}' referring to the dataset source filesystem
                location.
            """
            return self._uri

        @staticmethod
        def _get_source_type() -> str:
            return source_type

        def load(self, dst_path=None) -> str:
            """
            Downloads the dataset source to the local filesystem.

            Args:
                dst_path: Path of the local filesystem destination directory to which to download
                    the dataset source. If the directory does not exist, it is created. If
                    unspecified, the dataset source is downloaded to a new uniquely-named
                    directory on the local filesystem, unless the dataset source already
                    exists on the local filesystem, in which case its local path is
                    returned directly.

            Returns:
                The path to the downloaded dataset source on the local filesystem.
            """
            from mlflow.artifacts import download_artifacts

            return download_artifacts(artifact_uri=self.uri, dst_path=dst_path)

        @staticmethod
        def _can_resolve(raw_source: Any):
            is_local_source_type = ArtifactRepoSource._get_source_type() == "local"

            if not isinstance(raw_source, str) and (
                not isinstance(raw_source, Path) and is_local_source_type
            ):
                return False

            try:
                if is_local_source_type:
                    return is_local_uri(str(raw_source), is_tracking_or_registry_uri=False)
                else:
                    parsed_source = urlparse(str(raw_source))
                    return parsed_source.scheme == scheme
            except Exception:
                return False

        @classmethod
        def _resolve(cls, raw_source: Any) -> DatasetForArtifactRepoSourceType:
            return cls(str(raw_source))

        def to_dict(self) -> dict[Any, Any]:
            """
            Returns:
                A JSON-compatible dictionary representation of the {dataset_source_name}.
            """
            return {
                "uri": self.uri,
            }

        @classmethod
        def from_dict(cls, source_dict: dict[Any, Any]) -> DatasetForArtifactRepoSourceType:
            uri = source_dict.get("uri")
            if uri is None:
                raise MlflowException(
                    f'Failed to parse {dataset_source_name}. Missing expected key: "uri"',
                    INVALID_PARAMETER_VALUE,
                )

            return cls(uri=uri)

    ArtifactRepoSource.__name__ = dataset_source_name
    ArtifactRepoSource.__qualname__ = dataset_source_name
    ArtifactRepoSource.__doc__ = class_docstring
    ArtifactRepoSource.to_dict.__doc__ = ArtifactRepoSource.to_dict.__doc__.format(
        dataset_source_name=dataset_source_name
    )
    ArtifactRepoSource.uri.__doc__ = ArtifactRepoSource.uri.__doc__.format(scheme=scheme)
    return ArtifactRepoSource
```

--------------------------------------------------------------------------------

---[FILE: code_dataset_source.py]---
Location: mlflow-master/mlflow/data/code_dataset_source.py

```python
from typing import Any

from typing_extensions import Self

from mlflow.data.dataset_source import DatasetSource


class CodeDatasetSource(DatasetSource):
    def __init__(
        self,
        tags: dict[Any, Any],
    ):
        self._tags = tags

    @staticmethod
    def _get_source_type() -> str:
        return "code"

    def load(self, **kwargs):
        """
        Load is not implemented for Code Dataset Source.
        """
        raise NotImplementedError

    @staticmethod
    def _can_resolve(raw_source: Any):
        return False

    @classmethod
    def _resolve(cls, raw_source: str) -> Self:
        raise NotImplementedError

    def to_dict(self) -> dict[Any, Any]:
        return {"tags": self._tags}

    @classmethod
    def from_dict(cls, source_dict: dict[Any, Any]) -> Self:
        return cls(
            tags=source_dict.get("tags"),
        )
```

--------------------------------------------------------------------------------

---[FILE: dataset.py]---
Location: mlflow-master/mlflow/data/dataset.py

```python
import json
from abc import abstractmethod
from typing import Any

from mlflow.data.dataset_source import DatasetSource
from mlflow.entities import Dataset as DatasetEntity


class Dataset:
    """
    Represents a dataset for use with MLflow Tracking, including the name, digest (hash),
    schema, and profile of the dataset as well as source information (e.g. the S3 bucket or
    managed Delta table from which the dataset was derived). Most datasets expose features
    and targets for training and evaluation as well.
    """

    def __init__(self, source: DatasetSource, name: str | None = None, digest: str | None = None):
        """
        Base constructor for a dataset. All subclasses must call this constructor.
        """
        self._name = name
        self._source = source
        # Note: Subclasses should call super() once they've initialized all of
        # the class attributes necessary for digest computation
        self._digest = digest or self._compute_digest()

    @abstractmethod
    def _compute_digest(self) -> str:
        """Computes a digest for the dataset. Called if the user doesn't supply
        a digest when constructing the dataset.

        Returns:
            A string digest for the dataset. We recommend a maximum digest length
            of 10 characters with an ideal length of 8 characters.

        """

    def to_dict(self) -> dict[str, str]:
        """Create config dictionary for the dataset.

        Subclasses should override this method to provide additional fields in the config dict,
        e.g., schema, profile, etc.

        Returns a string dictionary containing the following fields: name, digest, source, source
        type.
        """
        return {
            "name": self.name,
            "digest": self.digest,
            "source": self.source.to_json(),
            "source_type": self.source._get_source_type(),
        }

    def to_json(self) -> str:
        """
        Obtains a JSON string representation of the :py:class:`Dataset
        <mlflow.data.dataset.Dataset>`.

        Returns:
            A JSON string representation of the :py:class:`Dataset <mlflow.data.dataset.Dataset>`.
        """

        return json.dumps(self.to_dict())

    def _get_source_type(self) -> str:
        """Returns the type of the dataset's underlying source."""

        return self.source._get_source_type()

    @property
    def name(self) -> str:
        """
        The name of the dataset, e.g. ``"iris_data"``, ``"myschema.mycatalog.mytable@v1"``, etc.
        """
        if self._name is not None:
            return self._name
        else:
            return "dataset"

    @property
    def digest(self) -> str:
        """
        A unique hash or fingerprint of the dataset, e.g. ``"498c7496"``.
        """
        return self._digest

    @property
    def source(self) -> DatasetSource:
        """
        Information about the dataset's source, represented as an instance of
        :py:class:`DatasetSource <mlflow.data.dataset_source.DatasetSource>`. For example, this
        may be the S3 location or the name of the managed Delta Table from which the dataset
        was derived.
        """
        return self._source

    @property
    @abstractmethod
    def profile(self) -> Any | None:
        """
        Optional summary statistics for the dataset, such as the number of rows in a table, the
        mean / median / std of each table column, etc.
        """

    @property
    @abstractmethod
    def schema(self) -> Any | None:
        """
        Optional dataset schema, such as an instance of :py:class:`mlflow.types.Schema` representing
        the features and targets of the dataset.
        """

    def _to_mlflow_entity(self) -> DatasetEntity:
        """
        Returns:
            A `mlflow.entities.Dataset` instance representing the dataset.
        """
        dataset_dict = self.to_dict()
        return DatasetEntity(
            name=dataset_dict["name"],
            digest=dataset_dict["digest"],
            source_type=dataset_dict["source_type"],
            source=dataset_dict["source"],
            schema=dataset_dict.get("schema"),
            profile=dataset_dict.get("profile"),
        )
```

--------------------------------------------------------------------------------

---[FILE: dataset_registry.py]---
Location: mlflow-master/mlflow/data/dataset_registry.py

```python
import inspect
import warnings
from contextlib import suppress
from typing import Callable

import mlflow.data
from mlflow.data.dataset import Dataset
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE
from mlflow.utils.plugins import get_entry_points


class DatasetRegistry:
    def __init__(self):
        self.constructors = {}

    def register_constructor(
        self,
        constructor_fn: Callable[[str | None, str | None], Dataset],
        constructor_name: str | None = None,
    ) -> str:
        """Registers a dataset constructor.

        Args:
            constructor_fn: A function that accepts at least the following
                inputs and returns an instance of a subclass of
                :py:class:`mlflow.data.dataset.Dataset`:

                - name: Optional. A string dataset name
                - digest: Optional. A string dataset digest.

            constructor_name: The name of the constructor, e.g.
                "from_spark". The name must begin with the
                string "from_" or "load_". If unspecified, the `__name__`
                attribute of the `constructor_fn` is used instead and must
                begin with the string "from_" or "load_".

        Returns:
            The name of the registered constructor, e.g. "from_pandas" or "load_delta".
        """
        if constructor_name is None:
            constructor_name = constructor_fn.__name__
        DatasetRegistry._validate_constructor(constructor_fn, constructor_name)
        self.constructors[constructor_name] = constructor_fn
        return constructor_name

    def register_entrypoints(self):
        """
        Registers dataset sources defined as Python entrypoints. For reference, see
        https://mlflow.org/docs/latest/plugins.html#defining-a-plugin.
        """
        for entrypoint in get_entry_points("mlflow.dataset_constructor"):
            try:
                self.register_constructor(
                    constructor_fn=entrypoint.load(), constructor_name=entrypoint.name
                )
            except Exception as exc:
                warnings.warn(
                    f"Failure attempting to register dataset constructor"
                    f' "{entrypoint.name}": {exc}.',
                    stacklevel=2,
                )

    @staticmethod
    def _validate_constructor(
        constructor_fn: Callable[[str | None, str | None], Dataset],
        constructor_name: str,
    ):
        if not constructor_name.startswith("load_") and not constructor_name.startswith("from_"):
            raise MlflowException(
                f"Invalid dataset constructor name: {constructor_name}."
                f" Constructor name must start with 'load_' or 'from_'.",
                INVALID_PARAMETER_VALUE,
            )

        signature = inspect.signature(constructor_fn)
        parameters = signature.parameters
        for expected_kwarg in ["name", "digest"]:
            if expected_kwarg not in parameters or parameters[expected_kwarg].kind not in [
                inspect.Parameter.KEYWORD_ONLY,
                inspect.Parameter.POSITIONAL_OR_KEYWORD,
            ]:
                raise MlflowException(
                    f"Invalid dataset constructor function: {constructor_fn.__name__}. Function"
                    f" must define an optional parameter named '{expected_kwarg}'.",
                    INVALID_PARAMETER_VALUE,
                )

        if not issubclass(signature.return_annotation, Dataset):
            raise MlflowException(
                f"Invalid dataset constructor function: {constructor_fn.__name__}. Function must"
                f" have a return type annotation that is a subclass of"
                f" :py:class:`mlflow.data.dataset.Dataset`.",
                INVALID_PARAMETER_VALUE,
            )


def register_constructor(
    constructor_fn: Callable[[str | None, str | None], Dataset],
    constructor_name: str | None = None,
) -> str:
    """Registers a dataset constructor.

    Args:
        constructor_fn: A function that accepts at least the following
            inputs and returns an instance of a subclass of
            :py:class:`mlflow.data.dataset.Dataset`:

            - name: Optional. A string dataset name
            - digest: Optional. A string dataset digest.

        constructor_name: The name of the constructor, e.g.
            "from_spark". The name must begin with the
            string "from_" or "load_". If unspecified, the `__name__`
            attribute of the `constructor_fn` is used instead and must
            begin with the string "from_" or "load_".

    Returns:
        The name of the registered constructor, e.g. "from_pandas" or "load_delta".

    """
    registered_constructor_name = _dataset_registry.register_constructor(
        constructor_fn=constructor_fn, constructor_name=constructor_name
    )
    setattr(mlflow.data, registered_constructor_name, constructor_fn)
    mlflow.data.__all__.append(registered_constructor_name)
    return registered_constructor_name


def get_registered_constructors() -> dict[str, Callable[[str | None, str | None], Dataset]]:
    """Obtains the registered dataset constructors.

    Returns:
        A dictionary mapping constructor names to constructor functions.

    """
    return _dataset_registry.constructors


_dataset_registry = DatasetRegistry()
_dataset_registry.register_entrypoints()

# use contextlib suppress to ignore import errors
with suppress(ImportError):
    from mlflow.data.pandas_dataset import from_pandas

    _dataset_registry.register_constructor(from_pandas)
with suppress(ImportError):
    from mlflow.data.numpy_dataset import from_numpy

    _dataset_registry.register_constructor(from_numpy)
with suppress(ImportError):
    from mlflow.data.huggingface_dataset import from_huggingface

    _dataset_registry.register_constructor(from_huggingface)
with suppress(ImportError):
    from mlflow.data.tensorflow_dataset import from_tensorflow

    _dataset_registry.register_constructor(from_tensorflow)
with suppress(ImportError):
    from mlflow.data.spark_dataset import from_spark, load_delta

    _dataset_registry.register_constructor(load_delta)
    _dataset_registry.register_constructor(from_spark)
with suppress(ImportError):
    from mlflow.data.polars_dataset import from_polars

    _dataset_registry.register_constructor(from_polars)
```

--------------------------------------------------------------------------------

---[FILE: dataset_source.py]---
Location: mlflow-master/mlflow/data/dataset_source.py

```python
import json
from abc import abstractmethod
from typing import Any


class DatasetSource:
    """
    Represents the source of a dataset used in MLflow Tracking, providing information such as
    cloud storage location, delta table name / version, etc.
    """

    @staticmethod
    @abstractmethod
    def _get_source_type() -> str:
        """Obtains a string representing the source type of the dataset.

        Returns:
            A string representing the source type of the dataset, e.g. "s3", "delta_table", ...

        """

    @abstractmethod
    def load(self) -> Any:
        """
        Loads files / objects referred to by the DatasetSource. For example, depending on the type
        of :py:class:`DatasetSource <mlflow.data.dataset_source.DatasetSource>`, this may download
        source CSV files from S3 to the local filesystem, load a source Delta Table as a Spark
        DataFrame, etc.

        Returns:
            The downloaded source, e.g. a local filesystem path, a Spark DataFrame, etc.

        """

    @staticmethod
    @abstractmethod
    def _can_resolve(raw_source: Any) -> bool:
        """Determines whether this type of DatasetSource can be resolved from a specified raw source
        object. For example, an S3DatasetSource can be resolved from an S3 URI like
        "s3://mybucket/path/to/iris/data" but not from an Azure Blob Storage URI like
        "wasbs:/account@host.blob.core.windows.net".

        Args:
            raw_source: The raw source, e.g. a string like "s3://mybucket/path/to/iris/data".

        Returns:
            True if this DatasetSource can resolve the raw source, False otherwise.

        """

    @classmethod
    @abstractmethod
    def _resolve(cls, raw_source: Any) -> "DatasetSource":
        """Constructs an instance of the DatasetSource from a raw source object, such as a
        string URI like "s3://mybucket/path/to/iris/data" or a delta table identifier
        like "my.delta.table@2".

        Args:
            raw_source: The raw source, e.g. a string like "s3://mybucket/path/to/iris/data".

        Returns:
            A DatasetSource instance derived from the raw_source.

        """

    @abstractmethod
    def to_dict(self) -> dict[str, Any]:
        """Obtains a JSON-compatible dictionary representation of the DatasetSource.

        Returns:
            A JSON-compatible dictionary representation of the DatasetSource.

        """

    def to_json(self) -> str:
        """
        Obtains a JSON string representation of the
        :py:class:`DatasetSource <mlflow.data.dataset_source.DatasetSource>`.

        Returns:
            A JSON string representation of the
            :py:class:`DatasetSource <mlflow.data.dataset_source.DatasetSource>`.
        """
        return json.dumps(self.to_dict())

    @classmethod
    @abstractmethod
    def from_dict(cls, source_dict: dict[Any, Any]) -> "DatasetSource":
        """Constructs an instance of the DatasetSource from a dictionary representation.

        Args:
            source_dict: A dictionary representation of the DatasetSource.

        Returns:
            A DatasetSource instance.

        """

    @classmethod
    def from_json(cls, source_json: str) -> "DatasetSource":
        """Constructs an instance of the DatasetSource from a JSON string representation.

        Args:
            source_json: A JSON string representation of the DatasetSource.

        Returns:
            A DatasetSource instance.

        """
        return cls.from_dict(json.loads(source_json))
```

--------------------------------------------------------------------------------

````
