---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 267
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 267 of 991)

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

---[FILE: chat.py]---
Location: mlflow-master/mlflow/gemini/chat.py

```python
import json
import logging
from typing import TYPE_CHECKING

from mlflow.types.chat import (
    ChatTool,
    Function,
    FunctionParams,
    FunctionToolDefinition,
    ParamProperty,
    ToolCall,
)

if TYPE_CHECKING:
    from google import genai

_logger = logging.getLogger(__name__)


def convert_gemini_func_to_mlflow_chat_tool(
    function_def: "genai.types.FunctionDeclaration",
) -> ChatTool:
    """
    Convert Gemini function definition into MLflow's standard format (OpenAI compatible).
    Ref: https://ai.google.dev/gemini-api/docs/function-calling

    Args:
        function_def: A genai.types.FunctionDeclaration or genai.protos.FunctionDeclaration object
                      representing a function definition.

    Returns:
        ChatTool: MLflow's standard tool definition object.
    """
    return ChatTool(
        type="function",
        function=FunctionToolDefinition(
            name=function_def.name,
            description=function_def.description,
            parameters=_convert_gemini_function_param_to_mlflow_function_param(
                function_def.parameters
            ),
        ),
    )


def convert_gemini_func_call_to_mlflow_tool_call(
    func_call: "genai.types.FunctionCall",
) -> ToolCall:
    """
    Convert Gemini function call into MLflow's standard format (OpenAI compatible).
    Ref: https://ai.google.dev/gemini-api/docs/function-calling

    Args:
        func_call: A genai.types.FunctionCall or genai.protos.FunctionCall object
                   representing a single func call.

    Returns:
        ToolCall: MLflow's standard tool call object.
    """
    # original args object is not json serializable
    args = func_call.args or {}

    return ToolCall(
        # Gemini does not have func call id
        id=func_call.name,
        type="function",
        function=Function(name=func_call.name, arguments=json.dumps(dict(args))),
    )


def _convert_gemini_param_property_to_mlflow_param_property(param_property) -> ParamProperty:
    """
    Convert Gemini parameter property definition into MLflow's standard format (OpenAI compatible).
    Ref: https://ai.google.dev/gemini-api/docs/function-calling

    Args:
        param_property: A genai.types.Schema or genai.protos.Schema object
                        representing a parameter property.

    Returns:
        ParamProperty: MLflow's standard param property object.
    """
    type_name = param_property.type
    type_name = type_name.name.lower() if hasattr(type_name, "name") else type_name.lower()
    return ParamProperty(
        description=param_property.description,
        enum=param_property.enum,
        type=type_name,
    )


def _convert_gemini_function_param_to_mlflow_function_param(
    function_params: "genai.types.Schema",
) -> FunctionParams:
    """
    Convert Gemini function parameter definition into MLflow's standard format (OpenAI compatible).
    Ref: https://ai.google.dev/gemini-api/docs/function-calling

    Args:
        function_params: A genai.types.Schema or genai.protos.Schema object
                         representing function parameters.

    Returns:
        FunctionParams: MLflow's standard function parameter object.
    """
    return FunctionParams(
        properties={
            k: _convert_gemini_param_property_to_mlflow_param_property(v)
            for k, v in function_params.properties.items()
        },
        required=function_params.required,
    )
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/gemini/__init__.py

```python
"""
The ``mlflow.gemini`` module provides an API for tracing the interaction with Gemini models.
"""

from mlflow.gemini.autolog import (
    async_patched_class_call,
    patched_class_call,
    patched_module_call,
)
from mlflow.telemetry.events import AutologgingEvent
from mlflow.telemetry.track import _record_event
from mlflow.utils.autologging_utils import autologging_integration, safe_patch

FLAVOR_NAME = "gemini"


@autologging_integration(FLAVOR_NAME)
def autolog(
    log_traces: bool = True,
    disable: bool = False,
    silent: bool = False,
):
    """
    Enables (or disables) and configures autologging from Gemini to MLflow.
    Currently, both legacy SDK google-generativeai and new SDK google-genai are supported.
    Both synchronous and asynchronous calls are supported for the new SDK.

    Args:
        log_traces: If ``True``, traces are logged for Gemini models.
            If ``False``, no traces are collected during inference. Default to ``True``.
        disable: If ``True``, disables the Gemini autologging. Default to ``False``.
        silent: If ``True``, suppress all event logs and warnings from MLflow during Gemini
            autologging. If ``False``, show all events and warnings.
    """
    try:
        from google import generativeai

        for method in ["generate_content", "count_tokens"]:
            safe_patch(
                FLAVOR_NAME,
                generativeai.GenerativeModel,
                method,
                patched_class_call,
            )

        safe_patch(
            FLAVOR_NAME,
            generativeai.ChatSession,
            "send_message",
            patched_class_call,
        )

        safe_patch(
            FLAVOR_NAME,
            generativeai,
            "embed_content",
            patched_module_call,
        )
    except ImportError:
        pass

    try:
        from google import genai

        # Since the genai SDK calls "_generate_content" iteratively within "generate_content",
        # we need to patch both "generate_content" and "_generate_content".
        for method in ["generate_content", "_generate_content", "count_tokens", "embed_content"]:
            safe_patch(
                FLAVOR_NAME,
                genai.models.Models,
                method,
                patched_class_call,
            )
            safe_patch(
                FLAVOR_NAME,
                genai.models.AsyncModels,
                method,
                async_patched_class_call,
            )

        safe_patch(
            FLAVOR_NAME,
            genai.chats.Chat,
            "send_message",
            patched_class_call,
        )
        safe_patch(
            FLAVOR_NAME,
            genai.chats.AsyncChat,
            "send_message",
            async_patched_class_call,
        )
    except ImportError:
        pass

    _record_event(
        AutologgingEvent, {"flavor": FLAVOR_NAME, "log_traces": log_traces, "disable": disable}
    )
```

--------------------------------------------------------------------------------

---[FILE: scheduled_scorers.py]---
Location: mlflow-master/mlflow/genai/scheduled_scorers.py

```python
from dataclasses import dataclass

from mlflow.genai.scorers.base import Scorer

_ERROR_MSG = (
    "The `databricks-agents` package is required to use `mlflow.genai.scheduled_scorers`. "
    "Please install it with `pip install databricks-agents`."
)


@dataclass()
class ScorerScheduleConfig:
    """
    A scheduled scorer configuration for automated monitoring of generative AI applications.

    Scheduled scorers are used to automatically evaluate traces logged to MLflow experiments
    by production applications. They are part of `Databricks Lakehouse Monitoring for GenAI
    <https://docs.databricks.com/aws/en/generative-ai/agent-evaluation/monitoring>`_,
    which helps track quality metrics like groundedness, safety, and guideline adherence
    alongside operational metrics like volume, latency, and cost.

    When configured, scheduled scorers run automatically in the background to evaluate
    a sample of traces based on the specified sampling rate and filter criteria. The
    Assessments are displayed in the Traces tab of the MLflow experiment and can be used to
    identify quality issues in production.

    Args:
        scorer: The scorer function to run on sampled traces. Must be either a built-in
            scorer (e.g., Safety, Correctness) or a function decorated with @scorer.
            Subclasses of Scorer are not supported.
        scheduled_scorer_name: The name for this scheduled scorer configuration
            within the experiment. This name must be unique among all scheduled scorers
            in the same experiment.
            We recommend using the scorer's name (e.g., scorer.name) for consistency.
        sample_rate: The fraction of traces to evaluate, between 0.0 and 1.0. For example,
            0.1 means 10% of traces will be randomly selected for evaluation.
        filter_string: An optional MLflow search_traces compatible filter string to apply
            before sampling traces. Only traces matching this filter will be considered
            for evaluation. Uses the same syntax as mlflow.search_traces().

    Example:
        .. code-block:: python

            from mlflow.genai.scorers import Safety, scorer
            from mlflow.genai.scheduled_scorers import ScorerScheduleConfig

            # Using a built-in scorer
            safety_config = ScorerScheduleConfig(
                scorer=Safety(),
                scheduled_scorer_name="production_safety",
                sample_rate=0.2,  # Evaluate 20% of traces
                filter_string="trace.status = 'OK'",
            )


            # Using a custom scorer
            @scorer
            def response_length(outputs):
                return len(str(outputs)) > 100


            length_config = ScorerScheduleConfig(
                scorer=response_length,
                scheduled_scorer_name="adequate_length",
                sample_rate=0.1,  # Evaluate 10% of traces
                filter_string="trace.status = 'OK'",
            )

    Note:
        Scheduled scorers are executed automatically by Databricks and do not need to be
        manually triggered. The Assessments appear in the Traces tab of the MLflow
        experiment. Only traces logged directly to the experiment are monitored; traces
        logged to individual runs within the experiment are not evaluated.

    .. warning::
        This API is in Beta and may change or be removed in a future release without warning.
    """

    scorer: Scorer
    scheduled_scorer_name: str
    sample_rate: float
    filter_string: str | None = None
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/genai/__init__.py

```python
from mlflow.genai import (
    datasets,
    judges,
    scorers,
)
from mlflow.genai.datasets import (
    create_dataset,
    delete_dataset,
    delete_dataset_tag,
    get_dataset,
    search_datasets,
    set_dataset_tags,
)
from mlflow.genai.evaluation import evaluate, to_predict_fn
from mlflow.genai.git_versioning import disable_git_model_versioning, enable_git_model_versioning
from mlflow.genai.judges import make_judge
from mlflow.genai.labeling import (
    Agent,
    LabelingSession,
    ReviewApp,
    create_labeling_session,
    delete_labeling_session,
    get_labeling_session,
    get_labeling_sessions,
    get_review_app,
)
from mlflow.genai.optimize import optimize_prompt, optimize_prompts
from mlflow.genai.prompts import (
    delete_prompt_alias,
    delete_prompt_model_config,
    delete_prompt_tag,
    delete_prompt_version_tag,
    get_prompt_tags,
    load_prompt,
    register_prompt,
    search_prompts,
    set_prompt_alias,
    set_prompt_model_config,
    set_prompt_tag,
    set_prompt_version_tag,
)
from mlflow.genai.scheduled_scorers import (
    ScorerScheduleConfig,
)
from mlflow.genai.scorers import Scorer, scorer

__all__ = [
    "datasets",
    "evaluate",
    "to_predict_fn",
    "Scorer",
    "scorer",
    "judges",
    "make_judge",
    "scorers",
    "create_dataset",
    "delete_dataset",
    "delete_dataset_tag",
    "get_dataset",
    "search_datasets",
    "set_dataset_tags",
    "load_prompt",
    "register_prompt",
    "search_prompts",
    "delete_prompt_alias",
    "set_prompt_alias",
    "optimize_prompts",
    "optimize_prompt",
    "get_prompt_tags",
    "set_prompt_tag",
    "set_prompt_version_tag",
    "delete_prompt_tag",
    "delete_prompt_version_tag",
    "set_prompt_model_config",
    "delete_prompt_model_config",
    "ScorerScheduleConfig",
    "Agent",
    "LabelingSession",
    "ReviewApp",
    "get_review_app",
    "create_labeling_session",
    "get_labeling_sessions",
    "get_labeling_session",
    "delete_labeling_session",
    # git model versioning
    "disable_git_model_versioning",
    "enable_git_model_versioning",
]
```

--------------------------------------------------------------------------------

---[FILE: server.py]---
Location: mlflow-master/mlflow/genai/agent_server/server.py
Signals: FastAPI

```python
import argparse
import functools
import inspect
import json
import logging
import os
from typing import Any, AsyncGenerator, Callable, Literal, ParamSpec, TypeVar

import httpx
import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import Response, StreamingResponse

import mlflow
from mlflow.genai.agent_server.utils import set_request_headers
from mlflow.genai.agent_server.validator import BaseAgentValidator, ResponsesAgentValidator
from mlflow.pyfunc import ResponsesAgent
from mlflow.tracing.constant import SpanAttributeKey
from mlflow.utils.annotations import experimental

logger = logging.getLogger(__name__)
STREAM_KEY = "stream"

AgentType = Literal["ResponsesAgent"]

_P = ParamSpec("_P")
_R = TypeVar("_R")

_invoke_function: Callable[..., Any] | None = None
_stream_function: Callable[..., Any] | None = None


@experimental(version="3.6.0")
def get_invoke_function():
    return _invoke_function


@experimental(version="3.6.0")
def get_stream_function():
    return _stream_function


@experimental(version="3.6.0")
def invoke() -> Callable[[Callable[_P, _R]], Callable[_P, _R]]:
    """Decorator to register a function as an invoke endpoint. Can only be used once."""

    def decorator(func: Callable[_P, _R]) -> Callable[_P, _R]:
        global _invoke_function
        if _invoke_function is not None:
            raise ValueError("invoke decorator can only be used once")
        _invoke_function = func

        @functools.wraps(func)
        def wrapper(*args: _P.args, **kwargs: _P.kwargs) -> _R:
            return func(*args, **kwargs)

        return wrapper

    return decorator


@experimental(version="3.6.0")
def stream() -> Callable[[Callable[_P, _R]], Callable[_P, _R]]:
    """Decorator to register a function as a stream endpoint. Can only be used once."""

    def decorator(func: Callable[_P, _R]) -> Callable[_P, _R]:
        global _stream_function
        if _stream_function is not None:
            raise ValueError("stream decorator can only be used once")
        _stream_function = func

        @functools.wraps(func)
        def wrapper(*args: _P.args, **kwargs: _P.kwargs) -> _R:
            return func(*args, **kwargs)

        return wrapper

    return decorator


@experimental(version="3.6.0")
class AgentServer:
    """FastAPI-based server for hosting agents.

    Args:
        agent_type: An optional parameter to specify the type of agent to serve. If provided,
        input/output validation and streaming tracing aggregation will be done automatically.

        Currently only "ResponsesAgent" is supported.

        If ``None``, no input/output validation and streaming tracing aggregation will be done.
        Default to ``None``.

        enable_chat_proxy: If ``True``, enables a proxy middleware that forwards unmatched requests
        to a chat app running on the port specified by the CHAT_APP_PORT environment variable
        (defaults to 3000) with a timeout specified by the CHAT_PROXY_TIMEOUT_SECONDS environment
        variable, (defaults to 300 seconds). ``enable_chat_proxy`` defaults to ``False``.

    See https://mlflow.org/docs/latest/genai/serving/agent-server for more information.
    """

    def __init__(self, agent_type: AgentType | None = None, enable_chat_proxy: bool = False):
        self.agent_type = agent_type
        if agent_type == "ResponsesAgent":
            self.validator = ResponsesAgentValidator()
        else:
            self.validator = BaseAgentValidator()

        self.app = FastAPI(title="Agent Server")

        if enable_chat_proxy:
            self._setup_chat_proxy_middleware()

        self._setup_routes()

    def _setup_chat_proxy_middleware(self) -> None:
        """Set up middleware to proxy unmatched requests to the chat app."""
        self.chat_app_port = os.getenv("CHAT_APP_PORT", "3000")
        self.chat_proxy_timeout = float(os.getenv("CHAT_PROXY_TIMEOUT_SECONDS", "300.0"))
        self.proxy_client = httpx.AsyncClient(timeout=self.chat_proxy_timeout)

        @self.app.middleware("http")
        async def chat_proxy_middleware(request: Request, call_next):
            """
            Forward unmatched requests to the chat app on the port specified by the CHAT_APP_PORT
            environment variable (defaults to 3000).

            The timeout for the proxy request is specified by the CHAT_PROXY_TIMEOUT_SECONDS
            environment variable (defaults to 300.0 seconds).
            """
            for route in self.app.routes:
                if hasattr(route, "path_regex") and route.path_regex.match(request.url.path):
                    return await call_next(request)

            path = request.url.path.lstrip("/")
            try:
                body = await request.body() if request.method in ["POST", "PUT", "PATCH"] else None
                target_url = f"http://localhost:{self.chat_app_port}/{path}"
                proxy_response = await self.proxy_client.request(
                    method=request.method,
                    url=target_url,
                    params=dict(request.query_params),
                    headers={k: v for k, v in request.headers.items() if k.lower() != "host"},
                    content=body,
                )
                return Response(
                    proxy_response.content,
                    proxy_response.status_code,
                    headers=dict(proxy_response.headers),
                )
            except httpx.ConnectError:
                return Response("Service unavailable", status_code=503, media_type="text/plain")
            except Exception as e:
                return Response(f"Proxy error: {e!s}", status_code=502, media_type="text/plain")

    def _setup_routes(self) -> None:
        @self.app.post("/invocations")
        async def invocations_endpoint(request: Request):
            # Capture headers such as x-forwarded-access-token
            # https://docs.databricks.com/aws/en/dev-tools/databricks-apps/auth?language=Streamlit#retrieve-user-authorization-credentials
            set_request_headers(dict(request.headers))

            try:
                data = await request.json()
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Invalid JSON in request body: {e!s}")

            logger.debug(
                "Request received",
                extra={
                    "agent_type": self.agent_type,
                    "request_size": len(json.dumps(data)),
                    "stream_requested": data.get(STREAM_KEY, False),
                },
            )

            is_streaming = data.pop(STREAM_KEY, False)

            try:
                request_data = self.validator.validate_and_convert_request(data)
            except ValueError as e:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid parameters for {self.agent_type}: {e}",
                )

            if is_streaming:
                return await self._handle_stream_request(request_data)
            else:
                return await self._handle_invoke_request(request_data)

        @self.app.get("/health")
        async def health_check() -> dict[str, str]:
            return {"status": "healthy"}

    async def _handle_invoke_request(self, request: dict[str, Any]) -> dict[str, Any]:
        if _invoke_function is None:
            raise HTTPException(status_code=500, detail="No invoke function registered")

        func = _invoke_function
        func_name = func.__name__

        try:
            with mlflow.start_span(name=f"{func_name}") as span:
                span.set_inputs(request)
                if inspect.iscoroutinefunction(func):
                    result = await func(request)
                else:
                    result = func(request)

                result = self.validator.validate_and_convert_result(result)
                if self.agent_type == "ResponsesAgent":
                    span.set_attribute(SpanAttributeKey.MESSAGE_FORMAT, "openai")
                span.set_outputs(result)

            logger.debug(
                "Response sent",
                extra={
                    "endpoint": "invoke",
                    "response_size": len(json.dumps(result)),
                    "function_name": func_name,
                },
            )

            return result

        except Exception as e:
            logger.debug(
                "Error response sent",
                extra={
                    "endpoint": "invoke",
                    "error": str(e),
                    "function_name": func_name,
                },
            )

            raise HTTPException(status_code=500, detail=str(e))

    async def _generate(
        self,
        func: Callable[..., Any],
        request: dict[str, Any],
    ) -> AsyncGenerator[str, None]:
        func_name = func.__name__
        all_chunks: list[dict[str, Any]] = []
        try:
            with mlflow.start_span(name=f"{func_name}") as span:
                span.set_inputs(request)
                if inspect.iscoroutinefunction(func) or inspect.isasyncgenfunction(func):
                    async for chunk in func(request):
                        chunk = self.validator.validate_and_convert_result(chunk, stream=True)
                        all_chunks.append(chunk)
                        yield f"data: {json.dumps(chunk)}\n\n"
                else:
                    for chunk in func(request):
                        chunk = self.validator.validate_and_convert_result(chunk, stream=True)
                        all_chunks.append(chunk)
                        yield f"data: {json.dumps(chunk)}\n\n"

                if self.agent_type == "ResponsesAgent":
                    span.set_attribute(SpanAttributeKey.MESSAGE_FORMAT, "openai")
                    span.set_outputs(ResponsesAgent.responses_agent_output_reducer(all_chunks))
                else:
                    span.set_outputs(all_chunks)

                yield "data: [DONE]\n\n"

            logger.debug(
                "Streaming response completed",
                extra={
                    "endpoint": "stream",
                    "total_chunks": len(all_chunks),
                    "function_name": func_name,
                },
            )

        except Exception as e:
            logger.debug(
                "Streaming response error",
                extra={
                    "endpoint": "stream",
                    "error": str(e),
                    "function_name": func_name,
                    "chunks_sent": len(all_chunks),
                },
            )

            yield f"data: {json.dumps({'error': str(e)})}\n\n"
            yield "data: [DONE]\n\n"

    async def _handle_stream_request(self, request: dict[str, Any]) -> StreamingResponse:
        if _stream_function is None:
            raise HTTPException(status_code=500, detail="No stream function registered")
        return StreamingResponse(
            self._generate(_stream_function, request), media_type="text/event-stream"
        )

    @staticmethod
    def _parse_server_args():
        """Parse command line arguments for the agent server"""
        parser = argparse.ArgumentParser(description="Start the agent server")
        parser.add_argument(
            "--port", type=int, default=8000, help="Port to run the server on (default: 8000)"
        )
        parser.add_argument(
            "--workers",
            type=int,
            default=1,
            help="Number of workers to run the server on (default: 1)",
        )
        parser.add_argument(
            "--reload",
            action="store_true",
            help="Reload the server on code changes (default: False)",
        )
        return parser.parse_args()

    def run(
        self,
        app_import_string: str,
        host: str = "0.0.0.0",
    ) -> None:
        """Run the agent server with command line argument parsing."""
        args = self._parse_server_args()
        uvicorn.run(
            app_import_string, host=host, port=args.port, workers=args.workers, reload=args.reload
        )
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: mlflow-master/mlflow/genai/agent_server/utils.py

```python
import logging
import os
import subprocess
from contextvars import ContextVar

from mlflow.tracking.fluent import _set_active_model
from mlflow.utils.annotations import experimental

# Context-isolated storage for request headers
# ensuring thread-safe access across async execution contexts
_request_headers: ContextVar[dict[str, str]] = ContextVar[dict[str, str]](
    "request_headers", default={}
)

logger = logging.getLogger(__name__)


@experimental(version="3.6.0")
def set_request_headers(headers: dict[str, str]) -> None:
    """Set request headers in the current context (called by server)"""
    _request_headers.set(headers)


@experimental(version="3.6.0")
def get_request_headers() -> dict[str, str]:
    """Get all request headers from the current context"""
    return _request_headers.get()


@experimental(version="3.6.0")
def setup_mlflow_git_based_version_tracking() -> None:
    """Initialize MLflow tracking and set active model with git-based version tracking."""
    # in a Databricks App, the app name is set in the environment variable DATABRICKS_APP_NAME
    # in local development, we use a fallback app name
    app_name = os.getenv("DATABRICKS_APP_NAME", "local")

    # Get current git commit hash for versioning
    try:
        git_commit = (
            subprocess.check_output(["git", "rev-parse", "HEAD"]).decode("ascii").strip()[:8]
        )
        version_identifier = f"git-{git_commit}"
    except subprocess.CalledProcessError:
        version_identifier = "no-git"
    logged_model_name = f"{app_name}-{version_identifier}"

    # Set the active model context
    active_model_info = _set_active_model(name=logged_model_name)
    logger.info(
        f"Active LoggedModel: '{active_model_info.name}', Model ID: '{active_model_info.model_id}'"
    )
```

--------------------------------------------------------------------------------

---[FILE: validator.py]---
Location: mlflow-master/mlflow/genai/agent_server/validator.py
Signals: Pydantic

```python
from dataclasses import asdict, is_dataclass
from typing import Any

from pydantic import BaseModel

from mlflow.types.responses import (
    ResponsesAgentRequest,
    ResponsesAgentResponse,
    ResponsesAgentStreamEvent,
)
from mlflow.utils.annotations import experimental


@experimental(version="3.6.0")
class BaseAgentValidator:
    """Base validator class with common validation methods"""

    def validate_pydantic(self, pydantic_class: type[BaseModel], data: Any) -> None:
        """Generic pydantic validator that throws an error if the data is invalid"""
        if isinstance(data, pydantic_class):
            return
        try:
            if isinstance(data, BaseModel):
                pydantic_class(**data.model_dump())
                return
            pydantic_class(**data)
        except Exception as e:
            raise ValueError(f"Invalid data for {pydantic_class.__name__}: {e}")

    def validate_dataclass(self, dataclass_class: Any, data: Any) -> None:
        """Generic dataclass validator that throws an error if the data is invalid"""
        if isinstance(data, dataclass_class):
            return
        try:
            dataclass_class(**data)
        except Exception as e:
            raise ValueError(f"Invalid data for {dataclass_class.__name__}: {e}")

    def validate_and_convert_request(self, data: dict[str, Any]) -> dict[str, Any]:
        return data

    def validate_and_convert_result(self, result: Any, stream: bool = False) -> dict[str, Any]:
        # Base implementation doesn't use stream parameter, but subclasses do
        if isinstance(result, BaseModel):
            return result.model_dump(exclude_none=True)
        elif is_dataclass(result):
            return asdict(result)
        elif isinstance(result, dict):
            return result
        else:
            raise ValueError(
                f"Result needs to be a pydantic model, dataclass, or dict. "
                f"Unsupported result type: {type(result)}, result: {result}"
            )


@experimental(version="3.6.0")
class ResponsesAgentValidator(BaseAgentValidator):
    def validate_and_convert_request(self, data: dict[str, Any]) -> ResponsesAgentRequest:
        self.validate_pydantic(ResponsesAgentRequest, data)
        return ResponsesAgentRequest(**data)

    def validate_and_convert_result(self, result: Any, stream: bool = False) -> dict[str, Any]:
        if stream:
            self.validate_pydantic(ResponsesAgentStreamEvent, result)
        else:
            self.validate_pydantic(ResponsesAgentResponse, result)

        return super().validate_and_convert_result(result, stream)
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/genai/agent_server/__init__.py

```python
from mlflow.genai.agent_server.server import (
    AgentServer,
    get_invoke_function,
    get_stream_function,
    invoke,
    stream,
)
from mlflow.genai.agent_server.utils import (
    get_request_headers,
    set_request_headers,
    setup_mlflow_git_based_version_tracking,
)

__all__ = [
    "set_request_headers",
    "get_request_headers",
    "AgentServer",
    "invoke",
    "stream",
    "get_invoke_function",
    "get_stream_function",
    "setup_mlflow_git_based_version_tracking",
]
```

--------------------------------------------------------------------------------

---[FILE: databricks_evaluation_dataset_source.py]---
Location: mlflow-master/mlflow/genai/datasets/databricks_evaluation_dataset_source.py

```python
from typing import Any

from mlflow.data.dataset_source import DatasetSource


class DatabricksEvaluationDatasetSource(DatasetSource):
    """
    Represents a Databricks Evaluation Dataset source.

    This source is used for datasets managed by the Databricks agents SDK.
    """

    def __init__(self, table_name: str, dataset_id: str):
        """
        Args:
            table_name: The three-level UC table name of the dataset
            dataset_id: The unique identifier of the dataset
        """
        self._table_name = table_name
        self._dataset_id = dataset_id

    @property
    def table_name(self) -> str:
        """The UC table name of the dataset."""
        return self._table_name

    @property
    def dataset_id(self) -> str:
        """The unique identifier of the dataset."""
        return self._dataset_id

    @staticmethod
    def _get_source_type() -> str:
        return "databricks_evaluation_dataset"

    def load(self, **kwargs) -> Any:
        """
        Loads the dataset from the source.

        This method is not implemented as the dataset should be loaded through
        the databricks.agents.datasets API.
        """
        raise NotImplementedError(
            "Loading a Databricks Evaluation Dataset from source is not supported"
        )

    @staticmethod
    def _can_resolve(raw_source: dict[str, Any]) -> bool:
        """
        Determines whether the source can be resolved from a dictionary representation.
        """
        # Resolution from a dictionary representation is not supported for Databricks Evaluation
        # Datasets
        return False

    @classmethod
    def _resolve(cls, raw_source: dict[str, Any]):
        """
        Resolves the source from a dictionary representation.
        """
        raise NotImplementedError("Resolution from a source dictionary is not supported")

    def to_dict(self) -> dict[str, Any]:
        """
        Returns a dictionary representation of the source.
        """
        return {
            "table_name": self._table_name,
            "dataset_id": self._dataset_id,
        }

    @classmethod
    def from_dict(cls, source_dict: dict[str, Any]) -> "DatabricksEvaluationDatasetSource":
        """
        Creates an instance from a dictionary representation.
        """
        return cls(table_name=source_dict["table_name"], dataset_id=source_dict["dataset_id"])


class DatabricksUCTableDatasetSource(DatabricksEvaluationDatasetSource):
    @staticmethod
    def _get_source_type() -> str:
        return "databricks-uc-table"
```

--------------------------------------------------------------------------------

````
