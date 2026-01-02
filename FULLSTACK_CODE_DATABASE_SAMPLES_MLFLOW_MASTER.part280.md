---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 280
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 280 of 991)

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

---[FILE: tool_calling_utils.py]---
Location: mlflow-master/mlflow/genai/judges/utils/tool_calling_utils.py

```python
"""Tool calling support for judge models."""

from __future__ import annotations

import json
from dataclasses import asdict, is_dataclass
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    import litellm

    from mlflow.entities.trace import Trace
    from mlflow.types.llm import ToolCall


def _process_tool_calls(
    tool_calls: list["litellm.ChatCompletionMessageToolCall"],
    trace: Trace | None,
) -> list["litellm.Message"]:
    """
    Process tool calls and return tool response messages.

    Args:
        tool_calls: List of tool calls from the LLM response.
        trace: Optional trace object for context.

    Returns:
        List of litellm Message objects containing tool responses.
    """
    from mlflow.genai.judges.tools.registry import _judge_tool_registry

    tool_response_messages = []
    for tool_call in tool_calls:
        try:
            mlflow_tool_call = _create_mlflow_tool_call_from_litellm(litellm_tool_call=tool_call)
            result = _judge_tool_registry.invoke(tool_call=mlflow_tool_call, trace=trace)
        except Exception as e:
            tool_response_messages.append(
                _create_litellm_tool_response_message(
                    tool_call_id=tool_call.id,
                    tool_name=tool_call.function.name,
                    content=f"Error: {e!s}",
                )
            )
        else:
            if is_dataclass(result):
                result = asdict(result)
            result_json = json.dumps(result, default=str) if not isinstance(result, str) else result
            tool_response_messages.append(
                _create_litellm_tool_response_message(
                    tool_call_id=tool_call.id,
                    tool_name=tool_call.function.name,
                    content=result_json,
                )
            )
    return tool_response_messages


def _create_mlflow_tool_call_from_litellm(
    litellm_tool_call: "litellm.ChatCompletionMessageToolCall",
) -> "ToolCall":
    """
    Create an MLflow ToolCall from a LiteLLM tool call.

    Args:
        litellm_tool_call: The LiteLLM ChatCompletionMessageToolCall object.

    Returns:
        An MLflow ToolCall object.
    """
    from mlflow.types.llm import ToolCall

    return ToolCall(
        id=litellm_tool_call.id,
        function={
            "name": litellm_tool_call.function.name,
            "arguments": litellm_tool_call.function.arguments,
        },
    )


def _create_litellm_tool_response_message(
    tool_call_id: str, tool_name: str, content: str
) -> "litellm.Message":
    """
    Create a tool response message for LiteLLM.

    Args:
        tool_call_id: The ID of the tool call being responded to.
        tool_name: The name of the tool that was invoked.
        content: The content to include in the response.

    Returns:
        A litellm.Message object representing the tool response message.
    """
    import litellm

    return litellm.Message(
        tool_call_id=tool_call_id,
        role="tool",
        name=tool_name,
        content=content,
    )
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/genai/judges/utils/__init__.py

```python
"""Main utilities module for judges. Maintains backwards compatibility."""

from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from mlflow.genai.judges.base import AlignmentOptimizer

import mlflow
from mlflow.genai.judges.adapters.databricks_managed_judge_adapter import (
    call_chat_completions,
)
from mlflow.genai.judges.adapters.databricks_serving_endpoint_adapter import (
    InvokeDatabricksModelOutput,
    InvokeJudgeModelHelperOutput,
)
from mlflow.genai.judges.adapters.gateway_adapter import _NATIVE_PROVIDERS
from mlflow.genai.judges.adapters.litellm_adapter import _suppress_litellm_nonfatal_errors
from mlflow.genai.judges.constants import _DATABRICKS_DEFAULT_JUDGE_MODEL
from mlflow.genai.judges.utils.invocation_utils import (
    FieldExtraction,
    get_chat_completions_with_structured_output,
    invoke_judge_model,
)
from mlflow.genai.judges.utils.prompt_utils import (
    DatabricksLLMJudgePrompts,
    add_output_format_instructions,
    format_prompt,
)
from mlflow.genai.utils.enum_utils import StrEnum
from mlflow.utils.uri import is_databricks_uri


def get_default_model() -> str:
    if is_databricks_uri(mlflow.get_tracking_uri()):
        return _DATABRICKS_DEFAULT_JUDGE_MODEL
    else:
        return "openai:/gpt-4.1-mini"


def get_default_optimizer() -> AlignmentOptimizer:
    """
    Get the default alignment optimizer.

    Returns:
        A SIMBA alignment optimizer with no model specified (uses default model).
    """
    from mlflow.genai.judges.optimizers.simba import SIMBAAlignmentOptimizer

    return SIMBAAlignmentOptimizer()


def _is_litellm_available() -> bool:
    """Check if LiteLLM is available for import."""
    try:
        import litellm  # noqa: F401

        return True
    except ImportError:
        return False


def validate_judge_model(model_uri: str) -> None:
    """
    Validate that a judge model URI is valid and has required dependencies.

    This function performs early validation at judge construction time to provide
    fast feedback about configuration issues.

    Args:
        model_uri: The model URI to validate (e.g., "databricks", "openai:/gpt-4")

    Raises:
        MlflowException: If the model URI is invalid or required dependencies are missing.
    """
    from mlflow.exceptions import MlflowException
    from mlflow.genai.judges.adapters.databricks_managed_judge_adapter import (
        _check_databricks_agents_installed,
    )
    from mlflow.metrics.genai.model_utils import _parse_model_uri
    from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE

    # Special handling for Databricks default model
    if model_uri == _DATABRICKS_DEFAULT_JUDGE_MODEL:
        # Check if databricks-agents is available
        _check_databricks_agents_installed()
        return

    # Validate the URI format and extract provider
    provider, model_name = _parse_model_uri(model_uri)

    # Check if LiteLLM is required and available for non-native providers
    if provider not in _NATIVE_PROVIDERS:
        if not _is_litellm_available():
            raise MlflowException(
                f"LiteLLM is required for using '{provider}' as a provider. "
                "Please install it with: `pip install litellm`",
                error_code=INVALID_PARAMETER_VALUE,
            )


class CategoricalRating(StrEnum):
    """
    A categorical rating for an assessment.

    Example:
        .. code-block:: python

            from mlflow.genai.judges import CategoricalRating
            from mlflow.entities import Feedback

            # Create feedback with categorical rating
            feedback = Feedback(
                name="my_metric", value=CategoricalRating.YES, rationale="The metric is passing."
            )
    """

    YES = "yes"
    NO = "no"
    UNKNOWN = "unknown"

    @classmethod
    def _missing_(cls, value: str):
        value = value.lower()
        for member in cls:
            if member == value:
                return member
        return cls.UNKNOWN


__all__ = [
    # Local functions
    "get_default_model",
    "get_default_optimizer",
    "validate_judge_model",
    "CategoricalRating",
    # Databricks adapter
    "call_chat_completions",
    "InvokeDatabricksModelOutput",
    "InvokeJudgeModelHelperOutput",
    # Gateway adapter
    "_NATIVE_PROVIDERS",
    # LiteLLM adapter
    "_suppress_litellm_nonfatal_errors",
    # Invocation utils
    "FieldExtraction",
    "invoke_judge_model",
    "get_chat_completions_with_structured_output",
    # Prompt utils
    "DatabricksLLMJudgePrompts",
    "format_prompt",
    "add_output_format_instructions",
]
```

--------------------------------------------------------------------------------

---[FILE: databricks_utils.py]---
Location: mlflow-master/mlflow/genai/labeling/databricks_utils.py

```python
"""
Databricks utilities for MLflow GenAI labeling functionality.
"""

_ERROR_MSG = (
    "The `databricks-agents` package is required to use labeling functionality. "
    "Please install it with `pip install databricks-agents`."
)


def get_databricks_review_app(experiment_id: str | None = None):
    """Import databricks.agents.review_app and return a review app instance."""
    try:
        from databricks.agents import review_app
    except ImportError as e:
        raise ImportError(_ERROR_MSG) from e

    return review_app.get_review_app(experiment_id)
```

--------------------------------------------------------------------------------

---[FILE: labeling.py]---
Location: mlflow-master/mlflow/genai/labeling/labeling.py

```python
from typing import TYPE_CHECKING, Any, Iterable, Union

from mlflow.entities import Trace
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE

if TYPE_CHECKING:
    import pandas as pd
    from databricks.agents.review_app import (
        LabelSchema as _LabelSchema,
    )
    from databricks.agents.review_app import (
        ReviewApp as _ReviewApp,
    )
    from databricks.agents.review_app.labeling import Agent as _Agent


class Agent:
    """The agent configuration, used for generating responses in the review app.

    .. note::
        This functionality is only available in Databricks. Please run
        `pip install mlflow[databricks]` to use it.
    """

    def __init__(self, agent: "_Agent"):
        self._agent = agent

    @property
    def agent_name(self) -> str:
        """The name of the agent."""
        return self._agent.agent_name

    @property
    def model_serving_endpoint(self) -> str:
        """The model serving endpoint used by the agent."""
        return self._agent.model_serving_endpoint


class LabelingSession:
    """A session for labeling items in the review app.

    .. note::
        This functionality is only available in Databricks. Please run
        `pip install mlflow[databricks]` to use it.
    """

    def __init__(
        self,
        *,
        name: str,
        assigned_users: list[str],
        agent: str | None,
        label_schemas: list[str],
        labeling_session_id: str,
        mlflow_run_id: str,
        review_app_id: str,
        experiment_id: str,
        url: str,
        enable_multi_turn_chat: bool,
        custom_inputs: dict[str, Any] | None,
    ):
        self._name = name
        self._assigned_users = assigned_users
        self._agent = agent
        self._label_schemas = label_schemas
        self._labeling_session_id = labeling_session_id
        self._mlflow_run_id = mlflow_run_id
        self._review_app_id = review_app_id
        self._experiment_id = experiment_id
        self._url = url
        self._enable_multi_turn_chat = enable_multi_turn_chat
        self._custom_inputs = custom_inputs

    @property
    def name(self) -> str:
        """The name of the labeling session."""
        return self._name

    @property
    def assigned_users(self) -> list[str]:
        """The users assigned to label items in the session."""
        return self._assigned_users

    @property
    def agent(self) -> str | None:
        """The agent used to generate responses for the items in the session."""
        return self._agent

    @property
    def label_schemas(self) -> list[str]:
        """The label schemas used in the session."""
        return self._label_schemas

    @property
    def labeling_session_id(self) -> str:
        """The unique identifier of the labeling session."""
        return self._labeling_session_id

    @property
    def mlflow_run_id(self) -> str:
        """The MLflow run ID associated with the session."""
        return self._mlflow_run_id

    @property
    def review_app_id(self) -> str:
        """The review app ID associated with the session."""
        return self._review_app_id

    @property
    def experiment_id(self) -> str:
        """The experiment ID associated with the session."""
        return self._experiment_id

    @property
    def url(self) -> str:
        """The URL of the labeling session in the review app."""
        return self._url

    @property
    def enable_multi_turn_chat(self) -> bool:
        """Whether multi-turn chat is enabled for the session."""
        return self._enable_multi_turn_chat

    @property
    def custom_inputs(self) -> dict[str, Any] | None:
        """Custom inputs used in the session."""
        return self._custom_inputs

    def _get_store(self):
        """
        Get a labeling store instance.

        This method is defined in order to avoid circular imports.
        """
        from mlflow.genai.labeling.stores import _get_labeling_store

        return _get_labeling_store()

    def add_dataset(
        self, dataset_name: str, record_ids: list[str] | None = None
    ) -> "LabelingSession":
        """Add a dataset to the labeling session.

        .. note::
            This functionality is only available in Databricks. Please run
            `pip install mlflow[databricks]` to use it.

        Args:
            dataset_name: The name of the dataset.
            record_ids: Optional. The individual record ids to be added to the session. If not
                provided, all records in the dataset will be added.

        Returns:
            LabelingSession: The updated labeling session.
        """
        store = self._get_store()
        return store.add_dataset_to_session(self, dataset_name, record_ids)

    def add_traces(
        self,
        traces: Union[Iterable[Trace], Iterable[str], "pd.DataFrame"],
    ) -> "LabelingSession":
        """Add traces to the labeling session.

        .. note::
            This functionality is only available in Databricks. Please run
            `pip install mlflow[databricks]` to use it.

        Args:
            traces: Can be either:
                a) a pandas DataFrame with a 'trace' column. The 'trace' column should contain
                either `mlflow.entities.Trace` objects or their json string representations.
                b) an iterable of `mlflow.entities.Trace` objects.
                c) an iterable of json string representations of `mlflow.entities.Trace` objects.

        Returns:
            LabelingSession: The updated labeling session.
        """
        import pandas as pd

        if isinstance(traces, pd.DataFrame):
            if "trace" not in traces.columns:
                raise MlflowException(
                    "traces must have a 'trace' column like the result of mlflow.search_traces()",
                    error_code=INVALID_PARAMETER_VALUE,
                )
            traces = traces["trace"].to_list()

        trace_list: list[Trace] = []
        for trace in traces:
            if isinstance(trace, str):
                trace_list.append(Trace.from_json(trace))
            elif isinstance(trace, Trace):
                trace_list.append(trace)
            elif trace is None:
                raise MlflowException(
                    "trace cannot be None. Must be mlflow.entities.Trace or its json string "
                    "representation.",
                    error_code=INVALID_PARAMETER_VALUE,
                )
            else:
                raise MlflowException(
                    f"Expected mlflow.entities.Trace or json string, got {type(trace).__name__}",
                    error_code=INVALID_PARAMETER_VALUE,
                )

        store = self._get_store()
        return store.add_traces_to_session(self, trace_list)

    def sync(self, to_dataset: str) -> None:
        """Sync the traces and expectations from the labeling session to a dataset.

        .. note::
            This functionality is only available in Databricks. Please run
            `pip install mlflow[databricks]` to use it.

        Args:
            to_dataset: The name of the dataset to sync traces and expectations to.
        """
        store = self._get_store()
        return store.sync_session_expectations(self, to_dataset)

    def set_assigned_users(self, assigned_users: list[str]) -> "LabelingSession":
        """Set the assigned users for the labeling session.

        .. note::
            This functionality is only available in Databricks. Please run
            `pip install mlflow[databricks]` to use it.

        Args:
            assigned_users: The list of users to assign to the session.

        Returns:
            LabelingSession: The updated labeling session.
        """
        store = self._get_store()
        return store.set_session_assigned_users(self, assigned_users)


class ReviewApp:
    """A review app is used to collect feedback from stakeholders for a given experiment.

    .. note::
        This functionality is only available in Databricks. Please run
        `pip install mlflow[databricks]` to use it.
    """

    def __init__(self, app: "_ReviewApp"):
        self._app = app

    @property
    def review_app_id(self) -> str:
        """The ID of the review app."""
        return self._app.review_app_id

    @property
    def experiment_id(self) -> str:
        """The ID of the experiment."""
        return self._app.experiment_id

    @property
    def url(self) -> str:
        """The URL of the review app for stakeholders to provide feedback."""
        return self._app.url

    @property
    def agents(self) -> list[Agent]:
        """The agents to be used to generate responses."""
        return [Agent(agent) for agent in self._app.agents]

    @property
    def label_schemas(self) -> list["_LabelSchema"]:
        """The label schemas to be used in the review app."""
        return self._app.label_schemas

    def add_agent(
        self, *, agent_name: str, model_serving_endpoint: str, overwrite: bool = False
    ) -> "ReviewApp":
        """Add an agent to the review app to be used to generate responses.

        .. note::
            This functionality is only available in Databricks. Please run
            `pip install mlflow[databricks]` to use it.

        Args:
            agent_name: The name of the agent.
            model_serving_endpoint: The model serving endpoint to be used by the agent.
            overwrite: Whether to overwrite an existing agent with the same name.

        Returns:
            ReviewApp: The updated review app.
        """
        return ReviewApp(
            self._app.add_agent(
                agent_name=agent_name,
                model_serving_endpoint=model_serving_endpoint,
                overwrite=overwrite,
            )
        )

    def remove_agent(self, agent_name: str) -> "ReviewApp":
        """Remove an agent from the review app.

        .. note::
            This functionality is only available in Databricks. Please run
            `pip install mlflow[databricks]` to use it.

        Args:
            agent_name: The name of the agent to remove.

        Returns:
            ReviewApp: The updated review app.
        """
        return ReviewApp(self._app.remove_agent(agent_name))
```

--------------------------------------------------------------------------------

---[FILE: stores.py]---
Location: mlflow-master/mlflow/genai/labeling/stores.py

```python
"""
Labeling store functionality for MLflow GenAI.

This module provides store implementations to manage labeling sessions and schemas
"""

import warnings
from abc import ABCMeta, abstractmethod
from typing import TYPE_CHECKING, Any, Callable

from mlflow.entities import Trace
from mlflow.exceptions import MlflowException
from mlflow.genai.label_schemas.label_schemas import LabelSchema
from mlflow.genai.labeling.databricks_utils import get_databricks_review_app
from mlflow.genai.labeling.labeling import LabelingSession
from mlflow.protos.databricks_pb2 import RESOURCE_DOES_NOT_EXIST
from mlflow.tracking._tracking_service import utils as tracking_utils
from mlflow.utils.plugins import get_entry_points
from mlflow.utils.uri import get_uri_scheme

if TYPE_CHECKING:
    from databricks.agents.review_app.labeling import LabelingSession as _DatabricksLabelingSession


class UnsupportedLabelingStoreURIException(MlflowException):
    """Exception thrown when building a labeling store with an unsupported URI"""

    def __init__(self, unsupported_uri: str, supported_uri_schemes: list[str]) -> None:
        message = (
            f"Labeling functionality is unavailable; got unsupported URI"
            f" '{unsupported_uri}' for labeling data storage. Supported URI schemes are:"
            f" {supported_uri_schemes}."
        )
        super().__init__(message)
        self.supported_uri_schemes = supported_uri_schemes


class AbstractLabelingStore(metaclass=ABCMeta):
    """
    Abstract class defining the interface for labeling store implementations.

    This class defines the API interface for labeling operations that can be implemented
    by different backend stores (e.g., MLflow tracking store, Databricks API).
    """

    def __init__(self, tracking_uri: str | None = None) -> None:
        """
        Initialize the labeling store.

        Args:
            tracking_uri: The tracking URI for the store.
        """

    @abstractmethod
    def get_labeling_session(self, run_id: str) -> LabelingSession:
        """
        Get a labeling session by MLflow run ID.

        Args:
            run_id: The MLflow run ID of the labeling session.

        Returns:
            LabelingSession: The labeling session.

        Raises:
            mlflow.MlflowException: If labeling session is not found.
        """

    @abstractmethod
    def get_labeling_sessions(self, experiment_id: str | None = None) -> list[LabelingSession]:
        """
        Get all labeling sessions for an experiment.

        Args:
            experiment_id: The experiment ID. If None, uses the currently active experiment.

        Returns:
            list[LabelingSession]: List of labeling sessions.
        """

    @abstractmethod
    def create_labeling_session(
        self,
        name: str,
        *,
        assigned_users: list[str] | None = None,
        agent: str | None = None,
        label_schemas: list[str] | None = None,
        enable_multi_turn_chat: bool = False,
        custom_inputs: dict[str, Any] | None = None,
        experiment_id: str | None = None,
    ) -> LabelingSession:
        """
        Create a new labeling session.

        Args:
            name: The name of the labeling session.
            assigned_users: The users that will be assigned to label items in the session.
            agent: The agent to be used to generate responses for the items in the session.
            label_schemas: The label schemas to be used in the session.
            enable_multi_turn_chat: Whether to enable multi-turn chat labeling for the session.
            custom_inputs: Optional. Custom inputs to be used in the session.
            experiment_id: The experiment ID. If None, uses the currently active experiment.

        Returns:
            LabelingSession: The created labeling session.
        """

    @abstractmethod
    def delete_labeling_session(self, labeling_session: LabelingSession) -> None:
        """
        Delete a labeling session.

        Args:
            labeling_session: The labeling session to delete.
        """

    @abstractmethod
    def get_label_schema(self, name: str) -> LabelSchema:
        """
        Get a label schema by name.

        Args:
            name: The name of the label schema.

        Returns:
            LabelSchema: The label schema.

        Raises:
            mlflow.MlflowException: If label schema is not found.
        """

    @abstractmethod
    def create_label_schema(
        self,
        name: str,
        *,
        type: str,
        title: str,
        input: Any,
        instruction: str | None = None,
        enable_comment: bool = False,
        overwrite: bool = False,
    ) -> LabelSchema:
        """
        Create a new label schema.

        Args:
            name: The name of the label schema. Must be unique across the review app.
            type: The type of the label schema. Either "feedback" or "expectation".
            title: The title of the label schema shown to stakeholders.
            input: The input type of the label schema.
            instruction: Optional. The instruction shown to stakeholders.
            enable_comment: Optional. Whether to enable comments for the label schema.
            overwrite: Optional. Whether to overwrite the existing label schema with the same name.

        Returns:
            LabelSchema: The created label schema.
        """

    @abstractmethod
    def delete_label_schema(self, name: str) -> None:
        """
        Delete a label schema.

        Args:
            name: The name of the label schema to delete.
        """

    @abstractmethod
    def add_dataset_to_session(
        self,
        labeling_session: LabelingSession,
        dataset_name: str,
        record_ids: list[str] | None = None,
    ) -> LabelingSession:
        """
        Add a dataset to a labeling session.

        Args:
            labeling_session: The labeling session to add the dataset to.
            dataset_name: The name of the dataset.
            record_ids: Optional. The individual record ids to be added to the session.

        Returns:
            LabelingSession: The updated labeling session.
        """

    @abstractmethod
    def add_traces_to_session(
        self,
        labeling_session: LabelingSession,
        traces: list[Trace],
    ) -> LabelingSession:
        """
        Add traces to a labeling session.

        Args:
            labeling_session: The labeling session to add traces to.
            traces: List of Trace objects to add.

        Returns:
            LabelingSession: The updated labeling session.
        """

    @abstractmethod
    def sync_session_expectations(self, labeling_session: LabelingSession, dataset: str) -> None:
        """
        Sync traces and expectations from a labeling session to a dataset.

        Args:
            labeling_session: The labeling session to sync.
            dataset: The name of the dataset to sync traces and expectations to.
        """

    @abstractmethod
    def set_session_assigned_users(
        self, labeling_session: LabelingSession, assigned_users: list[str]
    ) -> LabelingSession:
        """
        Set the assigned users for a labeling session.

        Args:
            labeling_session: The labeling session to update.
            assigned_users: The list of users to assign to the session.

        Returns:
            LabelingSession: The updated labeling session.
        """


class LabelingStoreRegistry:
    """
    Scheme-based registry for labeling store implementations.

    This class allows the registration of a function or class to provide an
    implementation for a given scheme of `store_uri` through the `register`
    methods. Implementations declared though the entrypoints
    `mlflow.labeling_store` group can be automatically registered through the
    `register_entrypoints` method.

    When instantiating a store through the `get_store` method, the scheme of
    the store URI provided (or inferred from environment) will be used to
    select which implementation to instantiate, which will be called with same
    arguments passed to the `get_store` method.
    """

    def __init__(self) -> None:
        self._registry: dict[str, Callable[..., AbstractLabelingStore]] = {}
        self.group_name = "mlflow.labeling_store"

    def register(self, scheme: str, store_builder: Callable[..., AbstractLabelingStore]) -> None:
        self._registry[scheme] = store_builder

    def register_entrypoints(self) -> None:
        """Register labeling stores provided by other packages"""
        for entrypoint in get_entry_points(self.group_name):
            try:
                self.register(entrypoint.name, entrypoint.load())
            except (AttributeError, ImportError) as exc:
                warnings.warn(
                    'Failure attempting to register labeling store for scheme "{}": {}'.format(
                        entrypoint.name, str(exc)
                    ),
                    stacklevel=2,
                )

    def get_store_builder(self, store_uri: str) -> Callable[..., AbstractLabelingStore]:
        """Get a store from the registry based on the scheme of store_uri

        Args:
            store_uri: The store URI. If None, it will be inferred from the environment. This
                URI is used to select which labeling store implementation to instantiate
                and is passed to the constructor of the implementation.

        Returns:
            A function that returns an instance of
            ``mlflow.genai.labeling.stores.AbstractLabelingStore`` that fulfills the store
            URI requirements.
        """
        scheme = store_uri if store_uri == "databricks" else get_uri_scheme(store_uri)
        try:
            store_builder = self._registry[scheme]
        except KeyError:
            raise UnsupportedLabelingStoreURIException(
                unsupported_uri=store_uri, supported_uri_schemes=list(self._registry.keys())
            )
        return store_builder

    def get_store(self, tracking_uri: str | None = None) -> AbstractLabelingStore:
        resolved_store_uri = tracking_utils._resolve_tracking_uri(tracking_uri)
        builder = self.get_store_builder(resolved_store_uri)
        return builder(tracking_uri=resolved_store_uri)


class DatabricksLabelingStore(AbstractLabelingStore):
    """
    Databricks store that provides labeling functionality through the Databricks API.
    This store delegates all labeling operations to the Databricks agents API.
    """

    def _get_backend_session(
        self, labeling_session: LabelingSession
    ) -> "_DatabricksLabelingSession":
        """
        Get the backend session for a labeling session.

        Note: We have to list all sessions and match by ID because the Databricks
        agents API doesn't provide a direct get/fetch API for individual labeling sessions.
        """
        app = get_databricks_review_app(labeling_session.experiment_id)
        backend_sessions = app.get_labeling_sessions()
        backend_session = next(
            (
                session
                for session in backend_sessions
                if session.labeling_session_id == labeling_session.labeling_session_id
            ),
            None,
        )
        if backend_session is None:
            raise MlflowException(
                f"Labeling session {labeling_session.labeling_session_id} not found",
                error_code=RESOURCE_DOES_NOT_EXIST,
            )
        return backend_session

    def _databricks_session_to_labeling_session(
        self, databricks_session: "_DatabricksLabelingSession"
    ) -> LabelingSession:
        """Create a LabelingSession from a Databricks backend session object."""
        return LabelingSession(
            name=databricks_session.name,
            assigned_users=databricks_session.assigned_users,
            agent=databricks_session.agent,
            label_schemas=databricks_session.label_schemas,
            labeling_session_id=databricks_session.labeling_session_id,
            mlflow_run_id=databricks_session.mlflow_run_id,
            review_app_id=databricks_session.review_app_id,
            experiment_id=databricks_session.experiment_id,
            url=databricks_session.url,
            enable_multi_turn_chat=databricks_session.enable_multi_turn_chat,
            custom_inputs=databricks_session.custom_inputs,
        )

    def get_labeling_session(self, run_id: str) -> LabelingSession:
        """Get a labeling session by MLflow run ID."""
        labeling_sessions = self.get_labeling_sessions()
        labeling_session = next(
            (
                labeling_session
                for labeling_session in labeling_sessions
                if labeling_session.mlflow_run_id == run_id
            ),
            None,
        )
        if labeling_session is None:
            raise MlflowException(f"Labeling session with run_id `{run_id}` not found")
        return labeling_session

    def get_labeling_sessions(self, experiment_id: str | None = None) -> list[LabelingSession]:
        """Get all labeling sessions for an experiment."""
        app = get_databricks_review_app(experiment_id)
        sessions = app.get_labeling_sessions()
        return [self._databricks_session_to_labeling_session(session) for session in sessions]

    def create_labeling_session(
        self,
        name: str,
        *,
        assigned_users: list[str] | None = None,
        agent: str | None = None,
        label_schemas: list[str] | None = None,
        enable_multi_turn_chat: bool = False,
        custom_inputs: dict[str, Any] | None = None,
        experiment_id: str | None = None,
    ) -> LabelingSession:
        """Create a new labeling session."""
        app = get_databricks_review_app(experiment_id)
        backend_session = app.create_labeling_session(
            name=name,
            assigned_users=assigned_users or [],
            agent=agent,
            label_schemas=label_schemas or [],
            enable_multi_turn_chat=enable_multi_turn_chat,
            custom_inputs=custom_inputs,
        )
        return self._databricks_session_to_labeling_session(backend_session)

    def delete_labeling_session(self, labeling_session: LabelingSession) -> None:
        """Delete a labeling session."""
        backend_session = self._get_backend_session(labeling_session)
        app = get_databricks_review_app(labeling_session.experiment_id)
        app.delete_labeling_session(backend_session)

    def get_label_schema(self, name: str) -> LabelSchema:
        """Get a label schema by name."""
        app = get_databricks_review_app()
        label_schema = next(
            (label_schema for label_schema in app.label_schemas if label_schema.name == name),
            None,
        )
        if label_schema is None:
            raise MlflowException(f"Label schema with name `{name}` not found")
        return LabelSchema._from_databricks_label_schema(label_schema)

    def create_label_schema(
        self,
        name: str,
        *,
        type: str,
        title: str,
        input: Any,
        instruction: str | None = None,
        enable_comment: bool = False,
        overwrite: bool = False,
    ) -> LabelSchema:
        """Create a new label schema."""
        app = get_databricks_review_app()
        return app.create_label_schema(
            name=name,
            type=type,
            title=title,
            input=input._to_databricks_input(),
            instruction=instruction,
            enable_comment=enable_comment,
            overwrite=overwrite,
        )

    def delete_label_schema(self, name: str) -> None:
        """Delete a label schema."""
        app = get_databricks_review_app()
        app.delete_label_schema(name)

    def add_dataset_to_session(
        self,
        labeling_session: LabelingSession,
        dataset_name: str,
        record_ids: list[str] | None = None,
    ) -> LabelingSession:
        """Add a dataset to a labeling session."""
        backend_session = self._get_backend_session(labeling_session)
        updated_session = backend_session.add_dataset(dataset_name, record_ids)
        return self._databricks_session_to_labeling_session(updated_session)

    def add_traces_to_session(
        self,
        labeling_session: LabelingSession,
        traces: list[Trace],
    ) -> LabelingSession:
        """Add traces to a labeling session."""
        backend_session = self._get_backend_session(labeling_session)
        updated_session = backend_session.add_traces(traces)
        return self._databricks_session_to_labeling_session(updated_session)

    def sync_session_expectations(self, labeling_session: LabelingSession, dataset: str) -> None:
        """Sync traces and expectations from a labeling session to a dataset."""
        backend_session = self._get_backend_session(labeling_session)
        backend_session.sync_expectations(dataset)

    def set_session_assigned_users(
        self, labeling_session: LabelingSession, assigned_users: list[str]
    ) -> LabelingSession:
        """Set the assigned users for a labeling session."""
        backend_session = self._get_backend_session(labeling_session)
        updated_session = backend_session.set_assigned_users(assigned_users)
        return self._databricks_session_to_labeling_session(updated_session)


# Create the global labeling store registry instance
_labeling_store_registry = LabelingStoreRegistry()


def _register_labeling_stores() -> None:
    """Register the default labeling store implementations"""
    # Register Databricks store
    _labeling_store_registry.register("databricks", DatabricksLabelingStore)

    # Register entrypoints for custom implementations
    _labeling_store_registry.register_entrypoints()


# Register the default stores
_register_labeling_stores()


def _get_labeling_store(tracking_uri: str | None = None) -> AbstractLabelingStore:
    """Get a labeling store from the registry"""
    return _labeling_store_registry.get_store(tracking_uri)
```

--------------------------------------------------------------------------------

````
