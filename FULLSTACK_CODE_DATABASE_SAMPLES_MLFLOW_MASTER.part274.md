---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 274
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 274 of 991)

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

---[FILE: databricks_serving_endpoint_adapter.py]---
Location: mlflow-master/mlflow/genai/judges/adapters/databricks_serving_endpoint_adapter.py
Signals: Pydantic

```python
from __future__ import annotations

import json
import logging
import time
import traceback
import warnings
from dataclasses import dataclass
from typing import TYPE_CHECKING, Any

import pydantic
import requests

if TYPE_CHECKING:
    from mlflow.types.llm import ChatMessage

from mlflow.entities.assessment import Feedback
from mlflow.entities.assessment_source import AssessmentSource, AssessmentSourceType
from mlflow.exceptions import MlflowException
from mlflow.genai.judges.adapters.base_adapter import (
    AdapterInvocationInput,
    AdapterInvocationOutput,
    BaseJudgeAdapter,
)
from mlflow.genai.judges.constants import _DATABRICKS_DEFAULT_JUDGE_MODEL
from mlflow.genai.judges.utils.parsing_utils import _sanitize_justification
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE
from mlflow.telemetry.utils import _log_error

_logger = logging.getLogger(__name__)


@dataclass
class InvokeDatabricksModelOutput:
    response: str
    request_id: str | None
    num_prompt_tokens: int | None
    num_completion_tokens: int | None


def _parse_databricks_model_response(
    res_json: dict[str, Any], headers: dict[str, Any]
) -> InvokeDatabricksModelOutput:
    """
    Parse and validate the response from a Databricks model invocation.

    Args:
        res_json: The JSON response from the model
        headers: The response headers

    Returns:
        InvokeDatabricksModelOutput with parsed response data

    Raises:
        MlflowException: If the response structure is invalid
    """
    # Validate and extract choices
    choices = res_json.get("choices", [])
    if not choices:
        raise MlflowException(
            "Invalid response from Databricks model: missing 'choices' field",
            error_code=INVALID_PARAMETER_VALUE,
        )

    first_choice = choices[0]
    if "message" not in first_choice:
        raise MlflowException(
            "Invalid response from Databricks model: missing 'message' field",
            error_code=INVALID_PARAMETER_VALUE,
        )

    content = first_choice.get("message", {}).get("content")
    if content is None:
        raise MlflowException(
            "Invalid response from Databricks model: missing 'content' field",
            error_code=INVALID_PARAMETER_VALUE,
        )

    # Handle reasoning response (list of content items)
    if isinstance(content, list):
        text_content = next(
            (
                item.get("text")
                for item in content
                if isinstance(item, dict) and item.get("type") == "text"
            ),
            None,
        )
        if text_content is None:
            raise MlflowException(
                "Invalid reasoning response: no text content found in response list",
                error_code=INVALID_PARAMETER_VALUE,
            )
        content = text_content

    usage = res_json.get("usage", {})

    return InvokeDatabricksModelOutput(
        response=content,
        request_id=headers.get("x-request-id"),
        num_prompt_tokens=usage.get("prompt_tokens"),
        num_completion_tokens=usage.get("completion_tokens"),
    )


def _invoke_databricks_serving_endpoint(
    *,
    model_name: str,
    prompt: str | list["ChatMessage"],
    num_retries: int,
    response_format: type[pydantic.BaseModel] | None = None,
    inference_params: dict[str, Any] | None = None,
) -> InvokeDatabricksModelOutput:
    from mlflow.utils.databricks_utils import get_databricks_host_creds

    # B-Step62: Why not use mlflow deployment client?
    host_creds = get_databricks_host_creds()
    api_url = f"{host_creds.host}/serving-endpoints/{model_name}/invocations"

    # Implement retry logic with exponential backoff
    last_exception = None
    for attempt in range(num_retries + 1):
        try:
            # Build request payload
            if isinstance(prompt, str):
                messages = [{"role": "user", "content": prompt}]
            else:
                from mlflow.types.llm import ChatMessage

                if not isinstance(prompt, list) or (
                    prompt and not all(isinstance(msg, ChatMessage) for msg in prompt)
                ):
                    prompt_type = type(prompt).__name__
                    raise MlflowException(
                        f"Invalid prompt type: expected str or list[ChatMessage], "
                        f"got {prompt_type}",
                        error_code=INVALID_PARAMETER_VALUE,
                    )
                messages = [{"role": msg.role, "content": msg.content} for msg in prompt]

            payload = {"messages": messages}

            # Add response_schema if provided
            if response_format is not None:
                payload["response_schema"] = response_format.model_json_schema()

            # Add inference parameters if provided (e.g., temperature, top_p, max_tokens)
            if inference_params:
                payload.update(inference_params)

            res = requests.post(
                url=api_url,
                headers={"Authorization": f"Bearer {host_creds.token}"},
                json=payload,
            )
        except (requests.RequestException, requests.ConnectionError) as e:
            last_exception = e
            if attempt < num_retries:
                _logger.debug(
                    f"Request attempt {attempt + 1} failed with error: {e}", exc_info=True
                )
                time.sleep(2**attempt)  # Exponential backoff
                continue
            else:
                raise MlflowException(
                    f"Failed to invoke Databricks model after {num_retries + 1} attempts: {e}",
                    error_code=INVALID_PARAMETER_VALUE,
                ) from e

        # Check HTTP status before parsing JSON
        if res.status_code in [400, 401, 403, 404]:
            # Don't retry on bad request, unauthorized, not found, or forbidden
            raise MlflowException(
                f"Databricks model invocation failed with status {res.status_code}: {res.text}",
                error_code=INVALID_PARAMETER_VALUE,
            )

        if res.status_code >= 400:
            # For other errors, raise exception and potentially retry
            error_msg = (
                f"Databricks model invocation failed with status {res.status_code}: {res.text}"
            )
            if attempt < num_retries:
                # Log and retry for transient errors
                _logger.debug(f"Attempt {attempt + 1} failed: {error_msg}", exc_info=True)
                time.sleep(2**attempt)  # Exponential backoff
                continue
            else:
                raise MlflowException(error_msg, error_code=INVALID_PARAMETER_VALUE)

        # Parse JSON response
        try:
            res_json = res.json()
        except json.JSONDecodeError as e:
            raise MlflowException(
                f"Failed to parse JSON response from Databricks model: {e}",
                error_code=INVALID_PARAMETER_VALUE,
            ) from e

        # Parse and validate the response using helper function
        return _parse_databricks_model_response(res_json, res.headers)

    # This should not be reached, but just in case
    if last_exception:
        raise MlflowException(
            f"Failed to invoke Databricks model: {last_exception}",
            error_code=INVALID_PARAMETER_VALUE,
        ) from last_exception


def _record_judge_model_usage_success_databricks_telemetry(
    *,
    request_id: str | None,
    model_provider: str,
    endpoint_name: str,
    num_prompt_tokens: int | None,
    num_completion_tokens: int | None,
) -> None:
    try:
        from databricks.agents.telemetry import record_judge_model_usage_success
    except ImportError:
        _logger.debug(
            "Failed to import databricks.agents.telemetry.record_judge_model_usage_success; "
            "databricks-agents needs to be installed."
        )
        return

    from mlflow.tracking.fluent import _get_experiment_id
    from mlflow.utils.databricks_utils import get_job_id, get_job_run_id, get_workspace_id

    record_judge_model_usage_success(
        request_id=request_id,
        experiment_id=_get_experiment_id(),
        job_id=get_job_id(),
        job_run_id=get_job_run_id(),
        workspace_id=get_workspace_id(),
        model_provider=model_provider,
        endpoint_name=endpoint_name,
        num_prompt_tokens=num_prompt_tokens,
        num_completion_tokens=num_completion_tokens,
    )


def _record_judge_model_usage_failure_databricks_telemetry(
    *,
    model_provider: str,
    endpoint_name: str,
    error_code: str,
    error_message: str,
) -> None:
    try:
        from databricks.agents.telemetry import record_judge_model_usage_failure
    except ImportError:
        _logger.debug(
            "Failed to import databricks.agents.telemetry.record_judge_model_usage_success; "
            "databricks-agents needs to be installed."
        )
        return

    from mlflow.tracking.fluent import _get_experiment_id
    from mlflow.utils.databricks_utils import get_job_id, get_job_run_id, get_workspace_id

    record_judge_model_usage_failure(
        experiment_id=_get_experiment_id(),
        job_id=get_job_id(),
        job_run_id=get_job_run_id(),
        workspace_id=get_workspace_id(),
        model_provider=model_provider,
        endpoint_name=endpoint_name,
        error_code=error_code,
        error_message=error_message,
    )


@dataclass
class InvokeJudgeModelHelperOutput:
    feedback: Feedback
    model_provider: str
    model_name: str
    request_id: str | None
    num_prompt_tokens: int | None
    num_completion_tokens: int | None


def _invoke_databricks_serving_endpoint_judge(
    *,
    model_name: str,
    prompt: str | list["ChatMessage"],
    assessment_name: str,
    num_retries: int = 10,
    response_format: type[pydantic.BaseModel] | None = None,
    inference_params: dict[str, Any] | None = None,
) -> InvokeJudgeModelHelperOutput:
    output = _invoke_databricks_serving_endpoint(
        model_name=model_name,
        prompt=prompt,
        num_retries=num_retries,
        response_format=response_format,
        inference_params=inference_params,
    )
    try:
        response_dict = json.loads(output.response)
        feedback = Feedback(
            name=assessment_name,
            value=response_dict["result"],
            rationale=_sanitize_justification(response_dict.get("rationale", "")),
            source=AssessmentSource(
                source_type=AssessmentSourceType.LLM_JUDGE,
                source_id=f"databricks:/{model_name}",
            ),
        )
    except json.JSONDecodeError as e:
        raise MlflowException(
            f"Failed to parse the response from the judge. Response: {output.response}",
            error_code=INVALID_PARAMETER_VALUE,
        ) from e

    return InvokeJudgeModelHelperOutput(
        feedback=feedback,
        model_provider="databricks",
        model_name=model_name,
        request_id=output.request_id,
        num_prompt_tokens=output.num_prompt_tokens,
        num_completion_tokens=output.num_completion_tokens,
    )


class DatabricksServingEndpointAdapter(BaseJudgeAdapter):
    """Adapter for Databricks serving endpoints using direct REST API invocations."""

    @classmethod
    def is_applicable(
        cls,
        model_uri: str,
        prompt: str | list["ChatMessage"],
    ) -> bool:
        from mlflow.metrics.genai.model_utils import _parse_model_uri

        # Don't handle the default judge (that's handled by DatabricksManagedJudgeAdapter)
        if model_uri == _DATABRICKS_DEFAULT_JUDGE_MODEL:
            return False

        model_provider, _ = _parse_model_uri(model_uri)
        return model_provider in {"databricks", "endpoints"}

    def invoke(self, input_params: AdapterInvocationInput) -> AdapterInvocationOutput:
        # Show deprecation warning for legacy 'endpoints' provider
        model_provider = input_params.model_provider
        if model_provider == "endpoints":
            warnings.warn(
                "The legacy provider 'endpoints' is deprecated and will be removed in a future "
                "release. Please update your code to use the 'databricks' provider instead.",
                FutureWarning,
                stacklevel=4,
            )

        model_name = input_params.model_name

        try:
            output = _invoke_databricks_serving_endpoint_judge(
                model_name=model_name,
                prompt=input_params.prompt,
                assessment_name=input_params.assessment_name,
                num_retries=input_params.num_retries,
                response_format=input_params.response_format,
                inference_params=input_params.inference_params,
            )

            # Set trace_id if trace was provided
            feedback = output.feedback
            if input_params.trace is not None:
                feedback.trace_id = input_params.trace.info.trace_id

            try:
                provider = "databricks" if model_provider == "endpoints" else model_provider
                _record_judge_model_usage_success_databricks_telemetry(
                    request_id=output.request_id,
                    model_provider=provider,
                    endpoint_name=model_name,
                    num_prompt_tokens=output.num_prompt_tokens,
                    num_completion_tokens=output.num_completion_tokens,
                )
            except Exception:
                _log_error("Failed to record judge model usage success telemetry")

            return AdapterInvocationOutput(
                feedback=feedback,
                request_id=output.request_id,
                num_prompt_tokens=output.num_prompt_tokens,
                num_completion_tokens=output.num_completion_tokens,
            )

        except Exception:
            try:
                provider = "databricks" if model_provider == "endpoints" else model_provider
                _record_judge_model_usage_failure_databricks_telemetry(
                    model_provider=provider,
                    endpoint_name=model_name,
                    error_code="UNKNOWN",
                    error_message=traceback.format_exc(),
                )
            except Exception:
                _log_error("Failed to record judge model usage failure telemetry")
            raise
```

--------------------------------------------------------------------------------

---[FILE: gateway_adapter.py]---
Location: mlflow-master/mlflow/genai/judges/adapters/gateway_adapter.py

```python
from __future__ import annotations

import json
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from mlflow.types.llm import ChatMessage

from mlflow.entities.assessment import Feedback
from mlflow.entities.assessment_source import AssessmentSource, AssessmentSourceType
from mlflow.exceptions import MlflowException
from mlflow.genai.judges.adapters.base_adapter import (
    AdapterInvocationInput,
    AdapterInvocationOutput,
    BaseJudgeAdapter,
)
from mlflow.genai.judges.utils.parsing_utils import (
    _sanitize_justification,
    _strip_markdown_code_blocks,
)
from mlflow.protos.databricks_pb2 import BAD_REQUEST

# "endpoints" is a special case for Databricks model serving endpoints.
_NATIVE_PROVIDERS = ["openai", "anthropic", "bedrock", "mistral", "endpoints"]


def _invoke_via_gateway(
    model_uri: str,
    provider: str,
    prompt: str,
    inference_params: dict[str, Any] | None = None,
) -> str:
    """
    Invoke the judge model via native AI Gateway adapters.

    Args:
        model_uri: The full model URI.
        provider: The provider name.
        prompt: The prompt to evaluate.
        inference_params: Optional dictionary of inference parameters to pass to the
            model (e.g., temperature, top_p, max_tokens).

    Returns:
        The JSON response string from the model.

    Raises:
        MlflowException: If the provider is not natively supported or invocation fails.
    """
    from mlflow.metrics.genai.model_utils import get_endpoint_type, score_model_on_payload

    if provider not in _NATIVE_PROVIDERS:
        raise MlflowException(
            f"LiteLLM is required for using '{provider}' LLM. Please install it with "
            "`pip install litellm`.",
            error_code=BAD_REQUEST,
        )

    return score_model_on_payload(
        model_uri=model_uri,
        payload=prompt,
        eval_parameters=inference_params,
        endpoint_type=get_endpoint_type(model_uri) or "llm/v1/chat",
    )


class GatewayAdapter(BaseJudgeAdapter):
    """Adapter for native AI Gateway providers (fallback when LiteLLM is not available)."""

    @classmethod
    def is_applicable(
        cls,
        model_uri: str,
        prompt: str | list["ChatMessage"],
    ) -> bool:
        from mlflow.metrics.genai.model_utils import _parse_model_uri

        model_provider, _ = _parse_model_uri(model_uri)
        return model_provider in _NATIVE_PROVIDERS and isinstance(prompt, str)

    def invoke(self, input_params: AdapterInvocationInput) -> AdapterInvocationOutput:
        if input_params.trace is not None:
            raise MlflowException(
                "LiteLLM is required for using traces with judges. "
                "Please install it with `pip install litellm`.",
            )

        # Validate structured output support
        if input_params.response_format is not None:
            raise MlflowException(
                "Structured output is not supported by native LLM providers. "
                "Please install LiteLLM with `pip install litellm` to use structured output.",
            )

        response = _invoke_via_gateway(
            input_params.model_uri,
            input_params.model_provider,
            input_params.prompt,
            input_params.inference_params,
        )

        cleaned_response = _strip_markdown_code_blocks(response)

        try:
            response_dict = json.loads(cleaned_response)
        except json.JSONDecodeError as e:
            raise MlflowException(
                f"Failed to parse response from judge model. Response: {response}",
                error_code=BAD_REQUEST,
            ) from e

        feedback = Feedback(
            name=input_params.assessment_name,
            value=response_dict["result"],
            rationale=_sanitize_justification(response_dict.get("rationale", "")),
            source=AssessmentSource(
                source_type=AssessmentSourceType.LLM_JUDGE, source_id=input_params.model_uri
            ),
        )

        return AdapterInvocationOutput(feedback=feedback)
```

--------------------------------------------------------------------------------

---[FILE: litellm_adapter.py]---
Location: mlflow-master/mlflow/genai/judges/adapters/litellm_adapter.py
Signals: Pydantic

```python
from __future__ import annotations

import json
import logging
import threading
from contextlib import ContextDecorator
from typing import TYPE_CHECKING, Any

import pydantic

if TYPE_CHECKING:
    import litellm

    from mlflow.entities.trace import Trace
    from mlflow.types.llm import ChatMessage

from mlflow.entities.assessment import Feedback
from mlflow.entities.assessment_source import AssessmentSource, AssessmentSourceType
from mlflow.environment_variables import MLFLOW_JUDGE_MAX_ITERATIONS
from mlflow.exceptions import MlflowException
from mlflow.genai.judges.adapters.base_adapter import (
    AdapterInvocationInput,
    AdapterInvocationOutput,
    BaseJudgeAdapter,
)
from mlflow.genai.judges.utils.parsing_utils import (
    _sanitize_justification,
    _strip_markdown_code_blocks,
)
from mlflow.genai.judges.utils.tool_calling_utils import _process_tool_calls
from mlflow.protos.databricks_pb2 import REQUEST_LIMIT_EXCEEDED
from mlflow.tracing.constant import AssessmentMetadataKey
from mlflow.tracking import get_tracking_uri
from mlflow.utils.uri import append_to_uri_path, is_http_uri

_logger = logging.getLogger(__name__)

# Global cache to track model capabilities across function calls
# Key: model URI (e.g., "openai/gpt-4"), Value: boolean indicating response_format support
_MODEL_RESPONSE_FORMAT_CAPABILITIES: dict[str, bool] = {}


class _SuppressLiteLLMNonfatalErrors(ContextDecorator):
    """
    Thread-safe context manager and decorator to suppress LiteLLM's "Give Feedback" and
    "Provider List" messages. These messages indicate nonfatal bugs in the LiteLLM library;
    they are often noisy and can be safely ignored.

    Uses reference counting to ensure suppression remains active while any thread is running,
    preventing race conditions in parallel execution.
    """

    def __init__(self):
        self.lock = threading.RLock()
        self.count = 0
        self.original_litellm_settings = {}

    def __enter__(self) -> "_SuppressLiteLLMNonfatalErrors":
        try:
            import litellm
        except ImportError:
            return self

        with self.lock:
            if self.count == 0:
                # First caller - store original settings and enable suppression
                self.original_litellm_settings = {
                    "set_verbose": getattr(litellm, "set_verbose", None),
                    "suppress_debug_info": getattr(litellm, "suppress_debug_info", None),
                }
                litellm.set_verbose = False
                litellm.suppress_debug_info = True
            self.count += 1

        return self

    def __exit__(
        self,
        _exc_type: type[BaseException] | None,
        _exc_val: BaseException | None,
        _exc_tb: Any | None,
    ) -> bool:
        try:
            import litellm
        except ImportError:
            return False

        with self.lock:
            self.count -= 1
            if self.count == 0:
                # Last caller - restore original settings
                if (
                    original_verbose := self.original_litellm_settings.get("set_verbose")
                ) is not None:
                    litellm.set_verbose = original_verbose
                if (
                    original_suppress := self.original_litellm_settings.get("suppress_debug_info")
                ) is not None:
                    litellm.suppress_debug_info = original_suppress
                self.original_litellm_settings.clear()

        return False


# Global instance for use as threadsafe decorator
_suppress_litellm_nonfatal_errors = _SuppressLiteLLMNonfatalErrors()


def _invoke_litellm(
    litellm_model: str,
    messages: list["litellm.Message"],
    tools: list[dict[str, Any]],
    num_retries: int,
    response_format: type[pydantic.BaseModel] | None,
    include_response_format: bool,
    inference_params: dict[str, Any] | None = None,
    api_base: str | None = None,
    api_key: str | None = None,
) -> "litellm.ModelResponse":
    """
    Invoke litellm completion with retry support.

    Args:
        litellm_model: The LiteLLM model identifier
            (e.g., "openai/gpt-4" or endpoint name for gateway).
        messages: List of litellm Message objects.
        tools: List of tool definitions (empty list if no tools).
        num_retries: Number of retries with exponential backoff.
        response_format: Optional Pydantic model class for structured output.
        include_response_format: Whether to include response_format in the request.
        inference_params: Optional dictionary of additional inference parameters to pass
            to the model (e.g., temperature, top_p, max_tokens).
        api_base: Optional API base URL (used for gateway routing).
        api_key: Optional API key (used for gateway routing).

    Returns:
        The litellm ModelResponse object.

    Raises:
        Various litellm exceptions on failure.
    """
    import litellm

    kwargs = {
        "model": litellm_model,
        "messages": messages,
        "tools": tools or None,
        "tool_choice": "auto" if tools else None,
        "retry_policy": _get_litellm_retry_policy(num_retries),
        "retry_strategy": "exponential_backoff_retry",
        # In LiteLLM version 1.55.3+, max_retries is stacked on top of retry_policy.
        # To avoid double-retry, we set max_retries=0
        "max_retries": 0,
        # Drop any parameters that are known to be unsupported by the LLM.
        # This is important for compatibility with certain models that don't support
        # certain call parameters (e.g. GPT-4 doesn't support 'response_format')
        "drop_params": True,
    }

    if api_base is not None:
        kwargs["api_base"] = api_base
    if api_key is not None:
        kwargs["api_key"] = api_key

    if include_response_format:
        # LiteLLM supports passing Pydantic models directly for response_format
        kwargs["response_format"] = response_format or _get_default_judge_response_schema()

    # Apply any additional inference parameters (e.g., temperature, top_p, max_tokens)
    if inference_params:
        kwargs.update(inference_params)

    return litellm.completion(**kwargs)


@_suppress_litellm_nonfatal_errors
def _invoke_litellm_and_handle_tools(
    provider: str,
    model_name: str,
    messages: list["ChatMessage"],
    trace: Trace | None,
    num_retries: int,
    response_format: type[pydantic.BaseModel] | None = None,
    inference_params: dict[str, Any] | None = None,
) -> tuple[str, float | None]:
    """
    Invoke litellm with retry support and handle tool calling loop.

    Args:
        provider: The provider name (e.g., 'openai', 'anthropic', 'gateway').
        model_name: The model name (or endpoint name for gateway provider).
        messages: List of ChatMessage objects.
        trace: Optional trace object for context with tool calling support.
        num_retries: Number of retries with exponential backoff on transient failures.
        response_format: Optional Pydantic model class for structured output format.
                       Used by get_chat_completions_with_structured_output for
                       schema-based extraction.
        inference_params: Optional dictionary of additional inference parameters to pass
                       to the model (e.g., temperature, top_p, max_tokens).

    Returns:
        Tuple of the model's response content and the total cost.

    Raises:
        MlflowException: If the request fails after all retries.
    """
    import litellm

    from mlflow.genai.judges.tools import list_judge_tools

    messages = [litellm.Message(role=msg.role, content=msg.content) for msg in messages]

    # Construct model URI and gateway params
    if provider == "gateway":
        tracking_uri = get_tracking_uri()

        # Validate that tracking URI is a valid HTTP(S) URL for gateway
        if not is_http_uri(tracking_uri):
            raise MlflowException(
                f"Gateway provider requires an HTTP(S) tracking URI, but got: '{tracking_uri}'. "
                "The gateway provider routes requests through the MLflow tracking server. "
                "Please set MLFLOW_TRACKING_URI to a valid HTTP(S) URL "
                "(e.g., 'http://localhost:5000' or 'https://your-mlflow-server.com')."
            )

        api_base = append_to_uri_path(tracking_uri, "gateway/mlflow/v1/")

        # Use openai/ prefix for LiteLLM to use OpenAI-compatible format.
        # LiteLLM strips the prefix, so gateway receives model_name as the endpoint.
        model = f"openai/{model_name}"
        # LiteLLM requires api_key to be set when using custom api_base, otherwise it
        # raises AuthenticationError looking for OPENAI_API_KEY env var. Gateway handles
        # auth in the server layer, so we pass a dummy value to satisfy LiteLLM.
        api_key = "mlflow-gateway-auth"
    else:
        model = f"{provider}/{model_name}"
        api_base = None
        api_key = None

    tools = []
    if trace is not None:
        judge_tools = list_judge_tools()
        tools = [tool.get_definition().to_dict() for tool in judge_tools]

    def _prune_messages_for_context_window() -> list[litellm.Message] | None:
        if provider == "gateway":
            # For gateway provider, we don't know the underlying model,
            # so simply remove the oldest tool call pair.
            return _prune_messages_exceeding_context_window_length(messages)

        # For direct providers, use token-counting based pruning.
        try:
            max_context_length = litellm.get_max_tokens(model)
        except Exception:
            max_context_length = None

        return _prune_messages_exceeding_context_window_length(
            messages, model=model, max_tokens=max_context_length or 100000
        )

    include_response_format = _MODEL_RESPONSE_FORMAT_CAPABILITIES.get(model, True)

    max_iterations = MLFLOW_JUDGE_MAX_ITERATIONS.get()
    iteration_count = 0
    total_cost = None

    while True:
        iteration_count += 1
        if iteration_count > max_iterations:
            raise MlflowException(
                f"Completion iteration limit of {max_iterations} exceeded. "
                f"This usually indicates the model is not powerful enough to effectively "
                f"analyze the trace. Consider using a more intelligent/powerful model. "
                f"In rare cases, for very complex traces where a large number of completion "
                f"iterations might be required, you can increase the number of iterations by "
                f"modifying the {MLFLOW_JUDGE_MAX_ITERATIONS.name} environment variable.",
                error_code=REQUEST_LIMIT_EXCEEDED,
            )
        try:
            try:
                response = _invoke_litellm(
                    litellm_model=model,
                    messages=messages,
                    tools=tools,
                    num_retries=num_retries,
                    response_format=response_format,
                    include_response_format=include_response_format,
                    inference_params=inference_params,
                    api_base=api_base,
                    api_key=api_key,
                )
            except (litellm.BadRequestError, litellm.UnsupportedParamsError) as e:
                error_str = str(e).lower()
                is_context_window_error = (
                    isinstance(e, litellm.ContextWindowExceededError)
                    or "context length" in error_str
                    or "too many tokens" in error_str
                )
                if is_context_window_error:
                    pruned = _prune_messages_for_context_window()
                    if pruned is None:
                        raise MlflowException(
                            "Context window exceeded and there are no tool calls to truncate. "
                            "The initial prompt may be too long for the model's context window."
                        ) from e
                    messages = pruned
                    continue
                # Check whether the request attempted to use structured outputs, rather than
                # checking whether the model supports structured outputs in the capabilities cache,
                # since the capabilities cache may have been updated between the time that
                # include_response_format was set and the request was made
                if include_response_format:
                    # Retry without response_format if the request failed due to unsupported params.
                    # Some models don't support structured outputs (response_format) at all,
                    # and some models don't support both tool calling and structured outputs.
                    _logger.debug(
                        f"Model {model} may not support structured outputs "
                        f"or combined tool calling + structured outputs. Error: {e}. "
                        f"Falling back to unstructured response.",
                        exc_info=True,
                    )
                    _MODEL_RESPONSE_FORMAT_CAPABILITIES[model] = False
                    include_response_format = False
                    continue
                else:
                    raise

            if cost := _extract_response_cost(response):
                if total_cost is None:
                    total_cost = 0
                total_cost += cost

            message = response.choices[0].message
            if not message.tool_calls:
                return message.content, total_cost

            messages.append(message)
            tool_response_messages = _process_tool_calls(tool_calls=message.tool_calls, trace=trace)
            messages.extend(tool_response_messages)

        except MlflowException:
            raise
        except Exception as e:
            raise MlflowException(f"Failed to invoke the judge via litellm: {e}") from e


def _extract_response_cost(response: "litellm.Completion") -> float | None:
    if hidden_params := getattr(response, "_hidden_params", None):
        return hidden_params.get("response_cost")


def _remove_oldest_tool_call_pair(
    messages: list["litellm.Message"],
) -> list["litellm.Message"] | None:
    """
    Remove the oldest assistant message with tool calls and its corresponding tool responses.

    Args:
        messages: List of LiteLLM message objects.

    Returns:
        Modified messages with oldest tool call pair removed, or None if no tool calls to remove.
    """
    result = next(
        ((i, msg) for i, msg in enumerate(messages) if msg.role == "assistant" and msg.tool_calls),
        None,
    )
    if result is None:
        return None

    assistant_idx, assistant_msg = result
    modified = messages[:]
    modified.pop(assistant_idx)

    tool_call_ids = {tc.id if hasattr(tc, "id") else tc["id"] for tc in assistant_msg.tool_calls}
    return [
        msg for msg in modified if not (msg.role == "tool" and msg.tool_call_id in tool_call_ids)
    ]


def _get_default_judge_response_schema() -> type[pydantic.BaseModel]:
    """
    Get the default Pydantic schema for judge evaluations.

    Returns:
        A Pydantic BaseModel class defining the standard judge output format.
    """
    # Import here to avoid circular imports
    from mlflow.genai.judges.base import Judge

    output_fields = Judge.get_output_fields()

    field_definitions = {}
    for field in output_fields:
        field_definitions[field.name] = (str, pydantic.Field(description=field.description))

    return pydantic.create_model("JudgeEvaluation", **field_definitions)


def _prune_messages_exceeding_context_window_length(
    messages: list["litellm.Message"],
    model: str | None = None,
    max_tokens: int | None = None,
) -> list["litellm.Message"] | None:
    """
    Prune messages from history to stay under token limit.

    When max_tokens is provided and model supports token counting, uses proactive
    token-counting based pruning. Otherwise, uses reactive truncation by removing
    a single tool call pair (useful when the underlying model is unknown).

    Args:
        messages: List of LiteLLM message objects.
        model: Model name for token counting. Required for token-based pruning.
        max_tokens: Maximum token limit. If None, removes the oldest tool call pair.

    Returns:
        Pruned list of LiteLLM message objects, or None if no tool calls to remove.
    """
    import litellm

    if max_tokens is None or model is None:
        return _remove_oldest_tool_call_pair(messages)

    initial_tokens = litellm.token_counter(model=model, messages=messages)
    if initial_tokens <= max_tokens:
        return messages

    pruned_messages = messages[:]
    # Remove tool call pairs until we're under limit
    while litellm.token_counter(model=model, messages=pruned_messages) > max_tokens:
        result = _remove_oldest_tool_call_pair(pruned_messages)
        if result is None:
            break
        pruned_messages = result

    final_tokens = litellm.token_counter(model=model, messages=pruned_messages)
    _logger.info(f"Pruned message history from {initial_tokens} to {final_tokens} tokens")
    return pruned_messages


def _get_litellm_retry_policy(num_retries: int) -> "litellm.RetryPolicy":
    """
    Get a LiteLLM retry policy for retrying requests when transient API errors occur.

    Args:
        num_retries: The number of times to retry a request if it fails transiently due to
                     network error, rate limiting, etc. Requests are retried with exponential
                     backoff.

    Returns:
        A LiteLLM RetryPolicy instance.
    """
    from litellm import RetryPolicy

    return RetryPolicy(
        TimeoutErrorRetries=num_retries,
        RateLimitErrorRetries=num_retries,
        InternalServerErrorRetries=num_retries,
        ContentPolicyViolationErrorRetries=num_retries,
        # We don't retry on errors that are unlikely to be transient
        # (e.g. bad request, invalid auth credentials)
        BadRequestErrorRetries=0,
        AuthenticationErrorRetries=0,
    )


def _is_litellm_available() -> bool:
    try:
        import litellm  # noqa: F401

        return True
    except ImportError:
        return False


class LiteLLMAdapter(BaseJudgeAdapter):
    """Adapter for LiteLLM-supported providers."""

    @classmethod
    def is_applicable(
        cls,
        model_uri: str,
        prompt: str | list["ChatMessage"],
    ) -> bool:
        return _is_litellm_available()

    def invoke(self, input_params: AdapterInvocationInput) -> AdapterInvocationOutput:
        from mlflow.types.llm import ChatMessage

        messages = (
            [ChatMessage(role="user", content=input_params.prompt)]
            if isinstance(input_params.prompt, str)
            else input_params.prompt
        )

        response, total_cost = _invoke_litellm_and_handle_tools(
            provider=input_params.model_provider,
            model_name=input_params.model_name,
            messages=messages,
            trace=input_params.trace,
            num_retries=input_params.num_retries,
            response_format=input_params.response_format,
            inference_params=input_params.inference_params,
        )

        cleaned_response = _strip_markdown_code_blocks(response)

        try:
            response_dict = json.loads(cleaned_response)
        except json.JSONDecodeError as e:
            raise MlflowException(
                f"Failed to parse response from judge model. Response: {response}"
            ) from e

        metadata = {AssessmentMetadataKey.JUDGE_COST: total_cost} if total_cost else None

        if "error" in response_dict:
            raise MlflowException(f"Judge evaluation failed with error: {response_dict['error']}")

        feedback = Feedback(
            name=input_params.assessment_name,
            value=response_dict["result"],
            rationale=_sanitize_justification(response_dict.get("rationale", "")),
            source=AssessmentSource(
                source_type=AssessmentSourceType.LLM_JUDGE, source_id=input_params.model_uri
            ),
            trace_id=input_params.trace.info.trace_id if input_params.trace is not None else None,
            metadata=metadata,
        )

        return AdapterInvocationOutput(feedback=feedback, cost=total_cost)
```

--------------------------------------------------------------------------------

````
