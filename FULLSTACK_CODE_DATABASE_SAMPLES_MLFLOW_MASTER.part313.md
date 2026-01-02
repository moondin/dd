---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 313
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 313 of 991)

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

---[FILE: api_request_parallel_processor.py]---
Location: mlflow-master/mlflow/langchain/api_request_parallel_processor.py

```python
# Based ons: https://github.com/openai/openai-cookbook/blob/6df6ceff470eeba26a56de131254e775292eac22/examples/api_request_parallel_processor.py
# Several changes were made to make it work with MLflow.
# Currently, only chat completion is supported.

"""
API REQUEST PARALLEL PROCESSOR

Using the LangChain API to process lots of text quickly takes some care.
If you trickle in a million API requests one by one, they'll take days to complete.
This script parallelizes requests using LangChain API.

Features:
- Streams requests from file, to avoid running out of memory for giant jobs
- Makes requests concurrently, to maximize throughput
- Logs errors, to diagnose problems with requests
"""

from __future__ import annotations

import logging
import queue
import threading
import time
import traceback
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from typing import Any

from mlflow.langchain._compat import import_base_callback_handler, try_import_chain

BaseCallbackHandler = import_base_callback_handler()
Chain = try_import_chain()

import mlflow
from mlflow.exceptions import MlflowException
from mlflow.langchain.utils.chat import (
    transform_request_json_for_chat_if_necessary,
    try_transform_response_iter_to_chat_format,
    try_transform_response_to_chat_format,
)
from mlflow.langchain.utils.serialization import convert_to_serializable
from mlflow.pyfunc.context import Context, get_prediction_context
from mlflow.tracing.utils import maybe_set_prediction_context

_logger = logging.getLogger(__name__)


@dataclass
class StatusTracker:
    """
    Stores metadata about the script's progress. Only one instance is created.
    """

    num_tasks_started: int = 0
    num_tasks_in_progress: int = 0  # script ends when this reaches 0
    num_tasks_succeeded: int = 0
    num_tasks_failed: int = 0
    num_api_errors: int = 0  # excluding rate limit errors, counted above
    lock: threading.Lock = threading.Lock()

    def start_task(self):
        with self.lock:
            self.num_tasks_started += 1
            self.num_tasks_in_progress += 1

    def complete_task(self, *, success: bool):
        with self.lock:
            self.num_tasks_in_progress -= 1
            if success:
                self.num_tasks_succeeded += 1
            else:
                self.num_tasks_failed += 1

    def increment_num_api_errors(self):
        with self.lock:
            self.num_api_errors += 1


@dataclass
class APIRequest:
    """
    Stores an API request's inputs, outputs, and other metadata. Contains a method to make an API
    call.

    Args:
        index: The request's index in the tasks list
        lc_model: The LangChain model to call
        request_json: The request's input data
        results: The list to append the request's output data to, it's a list of tuples
            (index, response)
        errors: A dictionary to store any errors that occur
        convert_chat_responses: Whether to convert the model's responses to chat format
        did_perform_chat_conversion: Whether the input data was converted to chat format
            based on the model's type and input data.
        stream: Whether the request is a stream request
        prediction_context: The prediction context to use for the request
    """

    index: int
    lc_model: Any
    request_json: dict[str, Any]
    results: list[tuple[int, str]]
    errors: dict[int, str]
    convert_chat_responses: bool
    did_perform_chat_conversion: bool
    stream: bool
    params: dict[str, Any]
    prediction_context: Context | None = None

    def _predict_single_input(self, single_input, callback_handlers, **kwargs):
        config = kwargs.pop("config", {})
        config["callbacks"] = config.get("callbacks", []) + (callback_handlers or [])
        if self.stream:
            return self.lc_model.stream(single_input, config=config, **kwargs)
        if hasattr(self.lc_model, "invoke"):
            return self.lc_model.invoke(single_input, config=config, **kwargs)
        else:
            # for backwards compatibility, __call__ is deprecated and will be removed in 0.3.0
            # kwargs shouldn't have config field if invoking with __call__
            return self.lc_model(single_input, callbacks=callback_handlers, **kwargs)

    def _try_convert_response(self, response):
        if self.stream:
            return try_transform_response_iter_to_chat_format(response)
        else:
            return try_transform_response_to_chat_format(response)

    def single_call_api(self, callback_handlers: list[BaseCallbackHandler] | None):
        from mlflow.langchain._compat import import_base_retriever
        from mlflow.langchain.utils.logging import langgraph_types, lc_runnables_types

        BaseRetriever = import_base_retriever()

        if isinstance(self.lc_model, BaseRetriever):
            # Retrievers are invoked differently than Chains
            response = self.lc_model.get_relevant_documents(
                **self.request_json, callbacks=callback_handlers, **self.params
            )
        elif isinstance(self.lc_model, lc_runnables_types() + langgraph_types()):
            if isinstance(self.request_json, dict):
                # This is a temporary fix for the case when spark_udf converts
                # input into pandas dataframe with column name, while the model
                # does not accept dictionaries as input, it leads to errors like
                # Expected Scalar value for String field 'query_text'
                try:
                    response = self._predict_single_input(
                        self.request_json, callback_handlers, **self.params
                    )
                except TypeError as e:
                    _logger.debug(
                        f"Failed to invoke {self.lc_model.__class__.__name__} "
                        f"with {self.request_json}. Error: {e!r}. Trying to "
                        "invoke with the first value of the dictionary."
                    )
                    self.request_json = next(iter(self.request_json.values()))
                    (
                        prepared_request_json,
                        did_perform_chat_conversion,
                    ) = transform_request_json_for_chat_if_necessary(
                        self.request_json, self.lc_model
                    )
                    self.did_perform_chat_conversion = did_perform_chat_conversion

                    response = self._predict_single_input(
                        prepared_request_json, callback_handlers, **self.params
                    )
            else:
                response = self._predict_single_input(
                    self.request_json, callback_handlers, **self.params
                )

            if self.did_perform_chat_conversion or self.convert_chat_responses:
                response = self._try_convert_response(response)
        else:
            # return_only_outputs is invalid for stream call
            if Chain and isinstance(self.lc_model, Chain) and not self.stream:
                kwargs = {"return_only_outputs": True}
            else:
                kwargs = {}
            kwargs.update(**self.params)
            response = self._predict_single_input(self.request_json, callback_handlers, **kwargs)

            if self.did_perform_chat_conversion or self.convert_chat_responses:
                response = self._try_convert_response(response)
            elif isinstance(response, dict) and len(response) == 1:
                # to maintain existing code, single output chains will still return
                # only the result
                response = response.popitem()[1]

        return convert_to_serializable(response)

    def call_api(
        self, status_tracker: StatusTracker, callback_handlers: list[BaseCallbackHandler] | None
    ):
        """
        Calls the LangChain API and stores results.
        """
        _logger.debug(f"Request #{self.index} started with payload: {self.request_json}")

        try:
            with maybe_set_prediction_context(self.prediction_context):
                response = self.single_call_api(callback_handlers)
            _logger.debug(f"Request #{self.index} succeeded with response: {response}")
            self.results.append((self.index, response))
            status_tracker.complete_task(success=True)
        except Exception as e:
            self.errors[self.index] = (
                f"error: {e!r} {traceback.format_exc()}\n request payload: {self.request_json}"
            )
            status_tracker.increment_num_api_errors()
            status_tracker.complete_task(success=False)


def process_api_requests(
    lc_model,
    requests: list[Any | dict[str, Any]] | None = None,
    max_workers: int = 10,
    callback_handlers: list[BaseCallbackHandler] | None = None,
    convert_chat_responses: bool = False,
    params: dict[str, Any] | None = None,
    context: Context | None = None,
):
    """
    Processes API requests in parallel.
    """

    # initialize trackers
    retry_queue = queue.Queue()
    status_tracker = StatusTracker()  # single instance to track a collection of variables
    next_request = None  # variable to hold the next request to call
    context = context or get_prediction_context()

    results = []
    errors = {}

    # Note: we should call `transform_request_json_for_chat_if_necessary`
    # for the whole batch data, because the conversion should obey the rule
    # that if any record in the batch can't be converted, then all the record
    # in this batch can't be converted.
    (
        converted_chat_requests,
        did_perform_chat_conversion,
    ) = transform_request_json_for_chat_if_necessary(requests, lc_model)

    requests_iter = enumerate(converted_chat_requests)
    with ThreadPoolExecutor(
        max_workers=max_workers, thread_name_prefix="MlflowLangChainApi"
    ) as executor:
        while True:
            # get next request (if one is not already waiting for capacity)
            if not retry_queue.empty():
                next_request = retry_queue.get_nowait()
                _logger.warning(f"Retrying request {next_request.index}: {next_request}")
            elif req := next(requests_iter, None):
                # get new request
                index, converted_chat_request_json = req
                next_request = APIRequest(
                    index=index,
                    lc_model=lc_model,
                    request_json=converted_chat_request_json,
                    results=results,
                    errors=errors,
                    convert_chat_responses=convert_chat_responses,
                    did_perform_chat_conversion=did_perform_chat_conversion,
                    stream=False,
                    prediction_context=context,
                    params=params,
                )
                status_tracker.start_task()
            else:
                next_request = None

            # if enough capacity available, call API
            if next_request:
                # call API
                executor.submit(
                    next_request.call_api,
                    status_tracker=status_tracker,
                    callback_handlers=callback_handlers,
                )

            # if all tasks are finished, break
            # check next_request to avoid terminating the process
            # before extra requests need to be processed
            if status_tracker.num_tasks_in_progress == 0 and next_request is None:
                break

            time.sleep(0.001)  # avoid busy waiting

        # after finishing, log final status
        if status_tracker.num_tasks_failed > 0:
            raise mlflow.MlflowException(
                f"{status_tracker.num_tasks_failed} tasks failed. Errors: {errors}"
            )

        return [res for _, res in sorted(results)]


def process_stream_request(
    lc_model,
    request_json: Any | dict[str, Any],
    callback_handlers: list[BaseCallbackHandler] | None = None,
    convert_chat_responses: bool = False,
    params: dict[str, Any] | None = None,
):
    """
    Process single stream request.
    """
    if not hasattr(lc_model, "stream"):
        raise MlflowException(
            f"Model {lc_model.__class__.__name__} does not support streaming prediction output. "
            "No `stream` method found."
        )

    (
        converted_chat_requests,
        did_perform_chat_conversion,
    ) = transform_request_json_for_chat_if_necessary(request_json, lc_model)

    api_request = APIRequest(
        index=0,
        lc_model=lc_model,
        request_json=converted_chat_requests,
        results=None,
        errors=None,
        convert_chat_responses=convert_chat_responses,
        did_perform_chat_conversion=did_perform_chat_conversion,
        stream=True,
        prediction_context=get_prediction_context(),
        params=params,
    )
    with maybe_set_prediction_context(api_request.prediction_context):
        return api_request.single_call_api(callback_handlers)
```

--------------------------------------------------------------------------------

---[FILE: autolog.py]---
Location: mlflow-master/mlflow/langchain/autolog.py

```python
import logging

from mlflow.langchain.constant import FLAVOR_NAME
from mlflow.telemetry.events import AutologgingEvent
from mlflow.telemetry.track import _record_event
from mlflow.utils.autologging_utils import autologging_integration
from mlflow.utils.autologging_utils.config import AutoLoggingConfig
from mlflow.utils.autologging_utils.safety import safe_patch

logger = logging.getLogger(__name__)


@autologging_integration(FLAVOR_NAME)
def autolog(
    disable=False,
    exclusive=False,
    disable_for_unsupported_versions=False,
    silent=False,
    log_traces=True,
    run_tracer_inline=False,
):
    """
    Enables (or disables) and configures autologging from Langchain to MLflow.

    Args:
        disable: If ``True``, disables the Langchain autologging integration. If ``False``,
            enables the Langchain autologging integration.
        exclusive: If ``True``, autologged content is not logged to user-created fluent runs.
            If ``False``, autologged content is logged to the active fluent run,
            which may be user-created.
        disable_for_unsupported_versions: If ``True``, disable autologging for versions of
            langchain that have not been tested against this version of the MLflow
            client or are incompatible.
        silent: If ``True``, suppress all event logs and warnings from MLflow during Langchain
            autologging. If ``False``, show all events and warnings during Langchain
            autologging.
        log_traces: If ``True``, traces are logged for Langchain models by using
            MlflowLangchainTracer as a callback during inference. If ``False``, no traces are
            collected during inference. Default to ``True``.
        run_tracer_inline: If ``True``, the MLflow tracer callback runs in the main async task
            rather than being offloaded to a thread pool. This ensures proper context propagation
            when combining autolog traces with manual ``@mlflow.trace`` decorators in async
            scenarios (e.g., LangGraph's ``ainvoke``). Default is ``False`` for backward
            compatibility. Set to ``True`` if you use manual ``@mlflow.trace`` decorators within
            LangGraph nodes or tools and need them properly nested in the autolog trace.
    """
    try:
        from langchain_core.callbacks import BaseCallbackManager

        safe_patch(
            FLAVOR_NAME,
            BaseCallbackManager,
            "__init__",
            _patched_callback_manager_init,
        )
    except Exception as e:
        logger.warning(f"Failed to enable tracing for LangChain. Error: {e}")

    # Special handlings for edge cases.
    try:
        from langchain_core.callbacks import BaseCallbackManager
        from langchain_core.runnables import RunnableSequence

        safe_patch(
            FLAVOR_NAME,
            RunnableSequence,
            "batch",
            _patched_runnable_sequence_batch,
        )

        safe_patch(
            FLAVOR_NAME,
            BaseCallbackManager,
            "merge",
            _patched_callback_manager_merge,
        )
    except Exception:
        logger.debug("Failed to patch RunnableSequence or BaseCallbackManager.", exc_info=True)

    _record_event(
        AutologgingEvent, {"flavor": FLAVOR_NAME, "log_traces": log_traces, "disable": disable}
    )


def _patched_callback_manager_init(original, self, *args, **kwargs):
    from mlflow.langchain.langchain_tracer import MlflowLangchainTracer
    from mlflow.utils.autologging_utils import get_autologging_config

    original(self, *args, **kwargs)

    if not AutoLoggingConfig.init(FLAVOR_NAME).log_traces:
        return

    for handler in self.inheritable_handlers:
        if isinstance(handler, MlflowLangchainTracer):
            return

    run_tracer_inline = get_autologging_config(FLAVOR_NAME, "run_tracer_inline", True)
    _handler = MlflowLangchainTracer(run_inline=run_tracer_inline)
    self.add_handler(_handler, inherit=True)


def _patched_callback_manager_merge(original, self, *args, **kwargs):
    """
    Patch BaseCallbackManager.merge to avoid a duplicated callback issue.

    In the above patched __init__, we check `inheritable_handlers` to see if the MLflow tracer
    is already propagated. This works when the `inheritable_handlers` is specified as constructor
    arguments. However, in the `merge` method, LangChain does not use constructor but set
    callbacks via the setter method. This causes duplicated callbacks injection.
    https://github.com/langchain-ai/langchain/blob/d9a069c414a321e7a3f3638a32ecf8a37ec2d188/libs/core/langchain_core/callbacks/base.py#L962-L982
    """
    from mlflow.langchain.langchain_tracer import MlflowLangchainTracer

    # Get the MLflow callback inherited from parent
    inherited = self.inheritable_handlers + args[0].inheritable_handlers
    inherited_mlflow_cb = next(
        (cb for cb in inherited if isinstance(cb, MlflowLangchainTracer)), None
    )

    if not inherited_mlflow_cb:
        return original(self, *args, **kwargs)

    merged = original(self, *args, **kwargs)
    # If a new MLflow callback is generated inside __init__, remove it
    duplicate_mlflow_cbs = [
        cb
        for cb in merged.inheritable_handlers
        if isinstance(cb, MlflowLangchainTracer) and cb != inherited_mlflow_cb
    ]
    for cb in duplicate_mlflow_cbs:
        merged.remove_handler(cb)

    return merged


def _patched_runnable_sequence_batch(original, self, *args, **kwargs):
    """
    Patch to terminate span context attachment during batch execution.

    RunnableSequence's batch() methods are implemented in a peculiar way
    that iterates on steps->items sequentially within the same thread. For example, if a
    sequence has 2 steps and the batch size is 3, the execution flow will be:
      - Step 1 for item 1
      - Step 1 for item 2
      - Step 1 for item 3
      - Step 2 for item 1
      - Step 2 for item 2
      - Step 2 for item 3
    Due to this behavior, we cannot attach the span to the context for this particular
    API, otherwise spans for different inputs will be mixed up.
    """
    from mlflow.langchain.langchain_tracer import _should_attach_span_to_context

    original_state = _should_attach_span_to_context.get()
    _should_attach_span_to_context.set(False)
    try:
        return original(self, *args, **kwargs)
    finally:
        _should_attach_span_to_context.set(original_state)
```

--------------------------------------------------------------------------------

---[FILE: chat_agent_langgraph.py]---
Location: mlflow-master/mlflow/langchain/chat_agent_langgraph.py

```python
from __future__ import annotations

import importlib.metadata
import json
from typing import Annotated, Any, TypedDict
from uuid import uuid4

from packaging.version import Version

try:
    from langchain_core.messages import AnyMessage, BaseMessage, convert_to_messages
    from langchain_core.runnables import RunnableConfig
    from langchain_core.runnables.utils import Input

    try:
        # LangGraph >= 0.3
        from langgraph.prebuilt import ToolNode
    except ImportError as e:
        # If LangGraph 0.3.x is installed but langgraph_prebuilt is not,
        # show a friendlier error message
        if Version(importlib.metadata.version("langgraph")) >= Version("0.3.0"):
            raise ImportError(
                "Please install `langgraph-prebuilt>=0.1.2` to use MLflow LangGraph ChatAgent "
                "helpers with LangGraph 0.3.x.\n"
                "If you already have the proper versions installed, please try running "
                "`pip install --force-reinstall langgraph`. This is a known issue. See: "
                "https://github.com/langchain-ai/langgraph/issues/3662"
            ) from e

        # LangGraph < 0.3
        from langgraph.prebuilt.tool_node import ToolNode

except ImportError as e:
    raise ImportError(
        "Please install `langchain>=0.2.17` and `langgraph>=0.2.0` to use LangGraph ChatAgent"
        "helpers."
    ) from e


from mlflow.langchain.utils.chat import convert_lc_message_to_chat_message
from mlflow.types.agent import ChatAgentMessage


def _add_agent_messages(
    left: dict[str, Any] | list[dict[str, Any]],
    right: dict[str, Any] | list[dict[str, Any]],
):
    if not isinstance(left, list):
        left = [left]
    if not isinstance(right, list):
        right = [right]
    # assign missing ids
    for i, m in enumerate(left):
        if isinstance(m, BaseMessage):
            left[i] = parse_message(m)
        if left[i].get("id") is None:
            left[i]["id"] = str(uuid4())

    for i, m in enumerate(right):
        if isinstance(m, BaseMessage):
            right[i] = parse_message(m)
        if right[i].get("id") is None:
            right[i]["id"] = str(uuid4())

    # merge
    left_idx_by_id = {m.get("id"): i for i, m in enumerate(left)}
    merged = left.copy()
    for m in right:
        if (existing_idx := left_idx_by_id.get(m.get("id"))) is not None:
            merged[existing_idx] = m
        else:
            merged.append(m)
    return merged


class ChatAgentState(TypedDict):
    """
    Helper class that enables building a LangGraph agent that produces ChatAgent-compatible
    messages as state is updated. Other ChatAgent request fields (custom_inputs, context) and
    response fields (custom_outputs) are also exposed within the state so they can be used and
    updated over the course of agent execution. Use this class with
    :py:class:`ChatAgentToolNode <mlflow.langchain.chat_agent_langgraph.ChatAgentToolNode>`.

    **LangGraph ChatAgent Example**

    This example has been tested to work with LangGraph 0.2.70.

    Step 1: Create the LangGraph Agent

    This example is adapted from LangGraph's
    `create_react_agent <https://langchain-ai.github.io/langgraph/how-tos/create-react-agent/>`__
    documentation. The notable differences are changes to be ChatAgent compatible. They include:

    - We use :py:class:`ChatAgentState <mlflow.langchain.chat_agent_langgraph.ChatAgentState>`,
      which has an internal state of
      :py:class:`ChatAgentMessage <mlflow.types.agent.ChatAgentMessage>`
      objects and a ``custom_outputs`` attribute under the hood
    - We use :py:class:`ChatAgentToolNode <mlflow.langchain.chat_agent_langgraph.ChatAgentToolNode>`
      instead of LangGraph's ToolNode to enable returning attachments and custom_outputs from
      LangChain and UnityCatalog Tools

    .. code-block:: python

        from typing import Optional, Sequence, Union

        from langchain_core.language_models import LanguageModelLike
        from langchain_core.runnables import RunnableConfig, RunnableLambda
        from langchain_core.tools import BaseTool
        from langgraph.graph import END, StateGraph
        from langgraph.graph.state import CompiledStateGraph
        from langgraph.prebuilt import ToolNode
        from mlflow.langchain.chat_agent_langgraph import ChatAgentState, ChatAgentToolNode


        def create_tool_calling_agent(
            model: LanguageModelLike,
            tools: Union[ToolNode, Sequence[BaseTool]],
            agent_prompt: Optional[str] = None,
        ) -> CompiledStateGraph:
            model = model.bind_tools(tools)

            def routing_logic(state: ChatAgentState):
                last_message = state["messages"][-1]
                if last_message.get("tool_calls"):
                    return "continue"
                else:
                    return "end"

            if agent_prompt:
                system_message = {"role": "system", "content": agent_prompt}
                preprocessor = RunnableLambda(
                    lambda state: [system_message] + state["messages"]
                )
            else:
                preprocessor = RunnableLambda(lambda state: state["messages"])
            model_runnable = preprocessor | model

            def call_model(
                state: ChatAgentState,
                config: RunnableConfig,
            ):
                response = model_runnable.invoke(state, config)

                return {"messages": [response]}

            workflow = StateGraph(ChatAgentState)

            workflow.add_node("agent", RunnableLambda(call_model))
            workflow.add_node("tools", ChatAgentToolNode(tools))

            workflow.set_entry_point("agent")
            workflow.add_conditional_edges(
                "agent",
                routing_logic,
                {
                    "continue": "tools",
                    "end": END,
                },
            )
            workflow.add_edge("tools", "agent")

            return workflow.compile()

    Step 2: Define the LLM and your tools

    If you want to return attachments and custom_outputs from your tool, you can return a
    dictionary with keys "content", "attachments", and "custom_outputs". This dictionary will be
    parsed out by the ChatAgentToolNode and properly stored in your LangGraph's state.


    .. code-block:: python

        from random import randint
        from typing import Any

        from databricks_langchain import ChatDatabricks
        from langchain_core.tools import tool


        @tool
        def generate_random_ints(min: int, max: int, size: int) -> dict[str, Any]:
            \"""Generate size random ints in the range [min, max].\"""
            attachments = {"min": min, "max": max}
            custom_outputs = [randint(min, max) for _ in range(size)]
            content = f"Successfully generated array of {size} random ints in [{min}, {max}]."
            return {
                "content": content,
                "attachments": attachments,
                "custom_outputs": {"random_nums": custom_outputs},
            }


        mlflow.langchain.autolog()
        tools = [generate_random_ints]
        llm = ChatDatabricks(endpoint="databricks-meta-llama-3-3-70b-instruct")
        langgraph_agent = create_tool_calling_agent(llm, tools)


    Step 3: Wrap your LangGraph agent with ChatAgent

    This makes your agent easily loggable and deployable with the PyFunc flavor in serving.

    .. code-block:: python

        from typing import Any, Generator, Optional

        from langgraph.graph.state import CompiledStateGraph
        from mlflow.pyfunc import ChatAgent
        from mlflow.types.agent import (
            ChatAgentChunk,
            ChatAgentMessage,
            ChatAgentResponse,
            ChatContext,
        )


        class LangGraphChatAgent(ChatAgent):
            def __init__(self, agent: CompiledStateGraph):
                self.agent = agent

            def predict(
                self,
                messages: list[ChatAgentMessage],
                context: Optional[ChatContext] = None,
                custom_inputs: Optional[dict[str, Any]] = None,
            ) -> ChatAgentResponse:
                request = {"messages": self._convert_messages_to_dict(messages)}

                messages = []
                for event in self.agent.stream(request, stream_mode="updates"):
                    for node_data in event.values():
                        messages.extend(
                            ChatAgentMessage(**msg) for msg in node_data.get("messages", [])
                        )
                return ChatAgentResponse(messages=messages)

            def predict_stream(
                self,
                messages: list[ChatAgentMessage],
                context: Optional[ChatContext] = None,
                custom_inputs: Optional[dict[str, Any]] = None,
            ) -> Generator[ChatAgentChunk, None, None]:
                request = {"messages": self._convert_messages_to_dict(messages)}
                for event in self.agent.stream(request, stream_mode="updates"):
                    for node_data in event.values():
                        yield from (
                            ChatAgentChunk(**{"delta": msg}) for msg in node_data["messages"]
                        )


        chat_agent = LangGraphChatAgent(langgraph_agent)

    Step 4: Test out your model

    Call ``.predict()`` and ``.predict_stream`` with dictionaries with the ChatAgentRequest schema.

    .. code-block:: python

        chat_agent.predict({"messages": [{"role": "user", "content": "What is 10 + 10?"}]})

        for event in chat_agent.predict_stream(
            {"messages": [{"role": "user", "content": "Generate me a few random nums"}]}
        ):
            print(event)

    This LangGraph ChatAgent can be logged with the logging code described in the "Logging a
    ChatAgent" section of the docstring of :py:class:`ChatAgent <mlflow.pyfunc.ChatAgent>`.
    """

    messages: Annotated[list[dict[str, Any]], _add_agent_messages]
    context: dict[str, Any] | None
    custom_inputs: dict[str, Any] | None
    custom_outputs: dict[str, Any] | None


def parse_message(
    msg: AnyMessage, name: str | None = None, attachments: dict[str, Any] | None = None
) -> dict[str, Any]:
    """
    Parse different LangChain message types into their ChatAgentMessage schema dict equivalents
    """
    chat_message_dict = convert_lc_message_to_chat_message(msg).model_dump()
    chat_message_dict["attachments"] = attachments
    chat_message_dict["name"] = msg.name or name
    chat_message_dict["id"] = msg.id
    # _convert_to_message from langchain_core.messages.utils expects an empty string instead of None
    if not chat_message_dict.get("content"):
        chat_message_dict["content"] = ""

    chat_agent_msg = ChatAgentMessage(**chat_message_dict)
    return chat_agent_msg.model_dump(exclude_none=True)


class ChatAgentToolNode(ToolNode):
    """
    Helper class to make ToolNodes be compatible with
    :py:class:`ChatAgentState <mlflow.langchain.chat_agent_langgraph.ChatAgentState>`.
    Parse ``attachments`` and ``custom_outputs`` keys from the string output of a
    LangGraph tool.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def invoke(self, input: Input, config: RunnableConfig | None = None, **kwargs: Any) -> Any:
        """
        Wraps the standard ToolNode invoke method to:
        - Parse ChatAgentState into LangChain messages
        - Parse dictionary string outputs from both UC function and standard LangChain python tools
          that include keys ``content``, ``attachments``, and ``custom_outputs``.
        """
        messages = input["messages"]
        for msg in messages:
            for tool_call in msg.get("tool_calls", []):
                tool_call["name"] = tool_call["function"]["name"]
                tool_call["args"] = json.loads(tool_call["function"]["arguments"])
        input["messages"] = convert_to_messages(messages)

        result = super().invoke(input, config, **kwargs)

        messages = []
        custom_outputs = None
        for m in result["messages"]:
            try:
                return_obj = json.loads(m.content)
                if all(key in return_obj for key in ("format", "value", "truncated")):
                    # Dictionary output with custom_outputs and attachments from a UC function
                    try:
                        return_obj = json.loads(return_obj["value"])
                    except Exception:
                        pass
                if "custom_outputs" in return_obj:
                    custom_outputs = return_obj["custom_outputs"]
                if m.id is None:
                    m.id = str(uuid4())
                messages.append(parse_message(m, attachments=return_obj.get("attachments")))
            except Exception:
                messages.append(parse_message(m))
        return {"messages": messages, "custom_outputs": custom_outputs}
```

--------------------------------------------------------------------------------

---[FILE: constant.py]---
Location: mlflow-master/mlflow/langchain/constant.py

```python
FLAVOR_NAME = "langchain"
```

--------------------------------------------------------------------------------

---[FILE: constants.py]---
Location: mlflow-master/mlflow/langchain/constants.py

```python
FLAVOR_NAME = "langchain"
```

--------------------------------------------------------------------------------

````
