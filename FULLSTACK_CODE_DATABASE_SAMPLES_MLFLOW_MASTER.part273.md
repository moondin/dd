---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 273
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 273 of 991)

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

---[FILE: make_judge.py]---
Location: mlflow-master/mlflow/genai/judges/make_judge.py
Signals: Pydantic

```python
from typing import Any, Literal, get_args, get_origin

from mlflow.genai.judges.base import Judge
from mlflow.genai.judges.instructions_judge import InstructionsJudge
from mlflow.telemetry.events import MakeJudgeEvent
from mlflow.telemetry.track import record_usage_event
from mlflow.utils.annotations import experimental


def _validate_feedback_value_type(feedback_value_type: Any) -> None:
    """
    Validate that feedback_value_type is one of the supported types for serialization.

    Supported types match FeedbackValueType:
    - PbValueType: int, float, str, bool
    - Literal types with PbValueType values
    - dict[str, PbValueType]
    - list[PbValueType]
    """

    from mlflow.entities.assessment import PbValueType

    # Check for basic PbValueType (float, int, str, bool)
    pb_value_types = get_args(PbValueType)
    if feedback_value_type in pb_value_types:
        return

    # Check for Literal type
    origin = get_origin(feedback_value_type)
    if origin is Literal:
        # Validate that all literal values are of PbValueType
        literal_values = get_args(feedback_value_type)
        for value in literal_values:
            if not isinstance(value, pb_value_types):
                from mlflow.exceptions import MlflowException

                raise MlflowException.invalid_parameter_value(
                    "The `feedback_value_type` argument does not support a Literal type"
                    f"with non-primitive types, but got {type(value).__name__}. "
                    f"Literal values must be str, int, float, or bool."
                )
        return

    # Check for dict[str, PbValueType]
    if origin is dict:
        args = get_args(feedback_value_type)
        if len(args) == 2:
            key_type, value_type = args
            # Key must be str
            if key_type != str:
                from mlflow.exceptions import MlflowException

                raise MlflowException.invalid_parameter_value(
                    f"dict key type must be str, got {key_type}"
                )
            # Value must be a PbValueType
            if value_type not in pb_value_types:
                from mlflow.exceptions import MlflowException

                raise MlflowException.invalid_parameter_value(
                    "The `feedback_value_type` argument does not support a dict type"
                    f"with non-primitive values, but got {value_type.__name__}"
                )
            return

    # Check for list[PbValueType]
    if origin is list:
        args = get_args(feedback_value_type)
        if len(args) == 1:
            element_type = args[0]
            # Element must be a PbValueType
            if element_type not in pb_value_types:
                from mlflow.exceptions import MlflowException

                raise MlflowException.invalid_parameter_value(
                    "The `feedback_value_type` argument does not support a list type"
                    f"with non-primitive values, but got {element_type.__name__}"
                )
            return

    # If we get here, it's an unsupported type
    from mlflow.exceptions import MlflowException

    raise MlflowException.invalid_parameter_value(
        f"Unsupported feedback_value_type: {feedback_value_type}. "
        f"Supported types (FeedbackValueType): str, int, float, bool, Literal[...], "
        f"as well as a dict and list of these types. "
        f"Pydantic BaseModel types are not supported."
    )


@experimental(version="3.4.0")
@record_usage_event(MakeJudgeEvent)
def make_judge(
    name: str,
    instructions: str,
    model: str | None = None,
    description: str | None = None,
    feedback_value_type: Any = None,
    inference_params: dict[str, Any] | None = None,
) -> Judge:
    """

    .. note::
        As of MLflow 3.4.0, this function is deprecated in favor of `mlflow.genai.make_judge`
        and may be removed in a future version.

    Create a custom MLflow judge instance.

    Args:
        name: The name of the judge
        instructions: Natural language instructions for evaluation. Must contain at least one
                      template variable: {{ inputs }}, {{ outputs }}, {{ expectations }},
                      {{ conversation }}, or {{ trace }} to reference evaluation data. Custom
                      variables are not supported.
                      Note: {{ conversation }} can only coexist with {{ expectations }}.
                      It cannot be used together with {{ inputs }}, {{ outputs }}, or {{ trace }}.
        model: The model identifier to use for evaluation (e.g., "openai:/gpt-4")
        description: A description of what the judge evaluates
        feedback_value_type: Type specification for the 'value' field in the Feedback
                        object. The judge will use structured outputs to enforce this type.
                        If unspecified, the feedback value type is determined by the judge.
                        It is recommended to explicitly specify the type.

                        Supported types (matching FeedbackValueType):

                        - int: Integer ratings (e.g., 1-5 scale)
                        - float: Floating point scores (e.g., 0.0-1.0)
                        - str: Text responses
                        - bool: Yes/no evaluations
                        - Literal[values]: Enum-like choices (e.g., Literal["good", "bad"])
                        - dict[str, int | float | str | bool]: Dictionary with string keys and
                          int, float, str, or bool values.
                        - list[int | float | str | bool]: List of int, float, str, or bool values

                        Note: Pydantic BaseModel types are not supported.
        inference_params: Optional dictionary of inference parameters to pass to the model
                        (e.g., temperature, top_p, max_tokens). These parameters allow
                        fine-grained control over the model's behavior during evaluation.
                        For example, setting a lower temperature can produce more
                        deterministic and reproducible evaluation results.

    Returns:
        An InstructionsJudge instance configured with the provided parameters

    Example:
        .. code-block:: python

            import mlflow
            from mlflow.genai.judges import make_judge
            from typing import Literal

            # Create a judge that evaluates response quality using template variables
            quality_judge = make_judge(
                name="response_quality",
                instructions=(
                    "Evaluate if the response in {{ outputs }} correctly answers "
                    "the question in {{ inputs }}. The response should be accurate, "
                    "complete, and professional."
                ),
                model="openai:/gpt-4",
                feedback_value_type=Literal["yes", "no"],
            )

            # Evaluate a response
            result = quality_judge(
                inputs={"question": "What is machine learning?"},
                outputs="ML is basically when computers learn stuff on their own",
            )

            # Create a judge that compares against expectations
            correctness_judge = make_judge(
                name="correctness",
                instructions=(
                    "Compare the {{ outputs }} against the {{ expectations }}. "
                    "Rate how well they match on a scale of 1-5."
                ),
                model="openai:/gpt-4",
                feedback_value_type=int,
            )

            # Evaluate with expectations (must be dictionaries)
            result = correctness_judge(
                inputs={"question": "What is the capital of France?"},
                outputs={"answer": "The capital of France is Paris."},
                expectations={"expected_answer": "Paris"},
            )

            # Create a judge that evaluates based on trace context
            trace_judge = make_judge(
                name="trace_quality",
                instructions="Evaluate the overall quality of the {{ trace }} execution.",
                model="openai:/gpt-4",
                feedback_value_type=Literal["good", "needs_improvement"],
            )

            # Use with search_traces() - evaluate each trace
            traces = mlflow.search_traces(experiment_ids=["1"], return_type="list")
            for trace in traces:
                feedback = trace_judge(trace=trace)
                print(f"Trace {trace.info.trace_id}: {feedback.value} - {feedback.rationale}")

            # Create a multi-turn judge that detects user frustration
            frustration_judge = make_judge(
                name="user_frustration",
                instructions=(
                    "Analyze the {{ conversation }} to detect signs of user frustration. "
                    "Look for indicators such as repeated questions, negative language, "
                    "or expressions of dissatisfaction."
                ),
                model="openai:/gpt-4",
                feedback_value_type=Literal["frustrated", "not frustrated"],
            )

            # Evaluate a multi-turn conversation using session traces
            session = mlflow.search_traces(
                experiment_ids=["1"],
                filter_string="metadata.`mlflow.trace.session` = 'session_123'",
                return_type="list",
            )
            result = frustration_judge(session=session)

            # Align a judge with human feedback
            aligned_judge = quality_judge.align(traces)

            # To see detailed optimization output during alignment, enable DEBUG logging:
            # import logging
            # logging.getLogger("mlflow.genai.judges.optimizers.simba").setLevel(logging.DEBUG)
    """
    # Default feedback_value_type to str if not specified (consistent with MLflow <= 3.5.x)
    # TODO: Implement logic to allow the LLM to choose the appropriate value type if not specified
    if feedback_value_type is None:
        feedback_value_type = str

    _validate_feedback_value_type(feedback_value_type)

    return InstructionsJudge(
        name=name,
        instructions=instructions,
        model=model,
        description=description,
        feedback_value_type=feedback_value_type,
        inference_params=inference_params,
    )
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/genai/judges/__init__.py

```python
# Make utils available as an attribute for mocking
from mlflow.genai.judges import utils  # noqa: F401
from mlflow.genai.judges.base import AlignmentOptimizer, Judge
from mlflow.genai.judges.builtin import (
    is_context_relevant,
    is_context_sufficient,
    is_correct,
    is_grounded,
    is_safe,
    is_tool_call_correct,
    is_tool_call_efficient,
    meets_guidelines,
)
from mlflow.genai.judges.custom_prompt_judge import custom_prompt_judge
from mlflow.genai.judges.make_judge import make_judge
from mlflow.genai.judges.utils import CategoricalRating

__all__ = [
    # Core Judge class
    "Judge",
    # Judge factory
    "make_judge",
    "AlignmentOptimizer",
    # Existing builtin judges
    "CategoricalRating",
    "is_grounded",
    "is_safe",
    "is_correct",
    "is_context_relevant",
    "is_context_sufficient",
    "is_tool_call_correct",
    "is_tool_call_efficient",
    "meets_guidelines",
    "custom_prompt_judge",
]
```

--------------------------------------------------------------------------------

---[FILE: base_adapter.py]---
Location: mlflow-master/mlflow/genai/judges/adapters/base_adapter.py
Signals: Pydantic

```python
from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import TYPE_CHECKING, Any

import pydantic

if TYPE_CHECKING:
    from mlflow.entities.trace import Trace
    from mlflow.types.llm import ChatMessage

from mlflow.entities.assessment import Feedback


@dataclass
class AdapterInvocationInput:
    """
    Input parameters for adapter invocation.

    Attributes:
        model_uri: The full model URI (e.g., "openai:/gpt-4").
        prompt: The prompt to evaluate. Can be a string or list of ChatMessage objects.
        assessment_name: The name of the assessment.
        trace: Optional trace object for context with tool calling support.
        num_retries: Number of retries on transient failures.
        response_format: Optional Pydantic model class for structured output format.
        use_case: Optional use case for telemetry tracking. Only used by some adapters.
        inference_params: Optional dictionary of inference parameters to pass to the
            model (e.g., temperature, top_p, max_tokens).
    """

    model_uri: str
    prompt: str | list["ChatMessage"]
    assessment_name: str
    trace: Trace | None = None
    num_retries: int = 10
    response_format: type[pydantic.BaseModel] | None = None
    use_case: str | None = None
    inference_params: dict[str, Any] | None = None

    def __post_init__(self):
        self._model_provider: str | None = None
        self._model_name: str | None = None

    @property
    def model_provider(self) -> str:
        if self._model_provider is None:
            from mlflow.metrics.genai.model_utils import _parse_model_uri

            self._model_provider, self._model_name = _parse_model_uri(self.model_uri)
        return self._model_provider

    @property
    def model_name(self) -> str:
        if self._model_name is None:
            from mlflow.metrics.genai.model_utils import _parse_model_uri

            self._model_provider, self._model_name = _parse_model_uri(self.model_uri)
        return self._model_name


@dataclass
class AdapterInvocationOutput:
    """
    Output from adapter invocation.

    Attributes:
        feedback: The feedback object with the judge's assessment.
        request_id: Optional request ID for tracking.
        num_prompt_tokens: Optional number of prompt tokens used.
        num_completion_tokens: Optional number of completion tokens used.
        cost: Optional cost of the invocation.
    """

    feedback: Feedback
    request_id: str | None = None
    num_prompt_tokens: int | None = None
    num_completion_tokens: int | None = None
    cost: float | None = None


class BaseJudgeAdapter(ABC):
    """
    Abstract base class for judge model adapters.
    """

    @classmethod
    @abstractmethod
    def is_applicable(
        cls,
        model_uri: str,
        prompt: str | list["ChatMessage"],
    ) -> bool:
        """
        Determine if this adapter can handle the given model and prompt type.

        Args:
            model_uri: The full model URI (e.g., "openai:/gpt-4").
            prompt: The prompt to evaluate (string or list of ChatMessages).

        Returns:
            True if this adapter can handle the model and prompt type, False otherwise.
        """

    @abstractmethod
    def invoke(self, input_params: AdapterInvocationInput) -> AdapterInvocationOutput:
        """
        Invoke the judge model using this adapter.

        Args:
            input_params: The input parameters for the invocation.

        Returns:
            The output from the invocation including feedback and metadata.

        Raises:
            MlflowException: If the invocation fails.
        """


__all__ = ["BaseJudgeAdapter", "AdapterInvocationInput", "AdapterInvocationOutput"]
```

--------------------------------------------------------------------------------

---[FILE: databricks_managed_judge_adapter.py]---
Location: mlflow-master/mlflow/genai/judges/adapters/databricks_managed_judge_adapter.py

```python
from __future__ import annotations

import inspect
import json
import logging
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from mlflow.entities.trace import Trace
    from mlflow.types.llm import ChatMessage, ToolDefinition

from mlflow.entities.assessment import Feedback
from mlflow.entities.assessment_source import AssessmentSource, AssessmentSourceType
from mlflow.environment_variables import MLFLOW_JUDGE_MAX_ITERATIONS
from mlflow.exceptions import MlflowException
from mlflow.genai.judges.adapters.base_adapter import (
    AdapterInvocationInput,
    AdapterInvocationOutput,
    BaseJudgeAdapter,
)
from mlflow.genai.judges.constants import (
    _DATABRICKS_AGENTIC_JUDGE_MODEL,
    _DATABRICKS_DEFAULT_JUDGE_MODEL,
)
from mlflow.genai.judges.utils.tool_calling_utils import _process_tool_calls
from mlflow.protos.databricks_pb2 import BAD_REQUEST, REQUEST_LIMIT_EXCEEDED
from mlflow.version import VERSION

_logger = logging.getLogger(__name__)


def _check_databricks_agents_installed() -> None:
    """Check if databricks-agents is installed for databricks judge functionality.

    Raises:
        MlflowException: If databricks-agents is not installed.
    """
    try:
        import databricks.agents.evals  # noqa: F401
    except ImportError:
        raise MlflowException(
            f"To use '{_DATABRICKS_DEFAULT_JUDGE_MODEL}' as the judge model, the Databricks "
            "agents library must be installed. Please install it with: "
            "`pip install databricks-agents`",
            error_code=BAD_REQUEST,
        )


def call_chat_completions(
    user_prompt: str,
    system_prompt: str,
    session_name: str | None = None,
    tools: list[ToolDefinition] | None = None,
    model: str | None = None,
    use_case: str | None = None,
) -> Any:
    """
    Invokes the Databricks chat completions API using the databricks.agents.evals library.

    Args:
        user_prompt: The user prompt.
        system_prompt: The system prompt.
        session_name: The session name for tracking. Defaults to "mlflow-v{VERSION}".
        tools: Optional list of ToolDefinition objects for tool calling.
        model: Optional model to use.
        use_case: The use case for the chat completion. Only used if supported
            by the installed databricks-agents version.

    Returns:
        The chat completions result.

    Raises:
        MlflowException: If databricks-agents is not installed.
    """
    _check_databricks_agents_installed()

    from databricks.rag_eval import context, env_vars

    if session_name is None:
        session_name = f"mlflow-v{VERSION}"

    env_vars.RAG_EVAL_EVAL_SESSION_CLIENT_NAME.set(session_name)

    @context.eval_context
    def _call_chat_completions(
        user_prompt: str,
        system_prompt: str,
        tools: list[ToolDefinition] | None,
        model: str | None,
        use_case: str | None,
    ):
        managed_rag_client = context.get_context().build_managed_rag_client()

        # Build kwargs dict starting with required parameters
        kwargs = {
            "user_prompt": user_prompt,
            "system_prompt": system_prompt,
        }

        # Add optional parameters
        if model is not None:
            kwargs["model"] = model

        if tools is not None:
            kwargs["tools"] = tools

        # Check if use_case parameter is supported by checking the method signature
        if use_case is not None:
            get_chat_completions_sig = inspect.signature(
                managed_rag_client.get_chat_completions_result
            )
            if "use_case" in get_chat_completions_sig.parameters:
                kwargs["use_case"] = use_case

        try:
            return managed_rag_client.get_chat_completions_result(**kwargs)
        except Exception:
            _logger.debug("Failed to call chat completions", exc_info=True)
            raise

    return _call_chat_completions(user_prompt, system_prompt, tools, model, use_case)


def _parse_databricks_judge_response(
    llm_output: str | None,
    assessment_name: str,
    trace: "Trace | None" = None,
) -> Feedback:
    """
    Parse the response from Databricks judge into a Feedback object.

    Args:
        llm_output: Raw output from the LLM, or None if no response.
        assessment_name: Name of the assessment.
        trace: Optional trace object to associate with the feedback.

    Returns:
        Feedback object with parsed results or error.
    """
    source = AssessmentSource(
        source_type=AssessmentSourceType.LLM_JUDGE, source_id=_DATABRICKS_DEFAULT_JUDGE_MODEL
    )
    trace_id = trace.info.trace_id if trace else None

    if not llm_output:
        return Feedback(
            name=assessment_name,
            error="Empty response from Databricks judge",
            source=source,
            trace_id=trace_id,
        )

    try:
        response_data = json.loads(llm_output)
    except json.JSONDecodeError as e:
        _logger.debug(f"Invalid JSON response from Databricks judge: {e}", exc_info=True)
        return Feedback(
            name=assessment_name,
            error=f"Invalid JSON response from Databricks judge: {e}\n\nLLM output: {llm_output}",
            source=source,
            trace_id=trace_id,
        )

    if "result" not in response_data:
        return Feedback(
            name=assessment_name,
            error=f"Response missing 'result' field: {response_data}",
            source=source,
            trace_id=trace_id,
        )

    return Feedback(
        name=assessment_name,
        value=response_data["result"],
        rationale=response_data.get("rationale", ""),
        source=source,
        trace_id=trace_id,
    )


def _create_litellm_message_from_databricks_response(
    response_data: dict[str, Any],
) -> Any:
    """
    Convert Databricks OpenAI-style response to litellm Message.

    Handles both string content and reasoning model outputs.

    Args:
        response_data: Parsed JSON response from Databricks.

    Returns:
        litellm.Message object.

    Raises:
        ValueError: If response format is invalid.
    """
    import litellm

    choices = response_data.get("choices", [])
    if not choices:
        raise ValueError("Invalid response format: missing 'choices' field")

    message_data = choices[0].get("message", {})

    # Create litellm Message with tool calls if present
    tool_calls_data = message_data.get("tool_calls")
    tool_calls = None
    if tool_calls_data:
        tool_calls = [
            litellm.ChatCompletionMessageToolCall(
                id=tc["id"],
                type=tc.get("type", "function"),
                function=litellm.Function(
                    name=tc["function"]["name"],
                    arguments=tc["function"]["arguments"],
                ),
            )
            for tc in tool_calls_data
        ]

    content = message_data.get("content")
    if isinstance(content, list):
        content_parts = [
            block["text"] for block in content if isinstance(block, dict) and "text" in block
        ]
        content = "\n".join(content_parts) if content_parts else None

    return litellm.Message(
        role=message_data.get("role", "assistant"),
        content=content,
        tool_calls=tool_calls,
    )


def _serialize_messages_to_databricks_prompts(
    messages: list[Any],
) -> tuple[str, str | None]:
    """
    Serialize litellm Messages to user_prompt and system_prompt for Databricks.

    This is needed because call_chat_completions only accepts string prompts.

    Args:
        messages: List of litellm Message objects.

    Returns:
        Tuple of (user_prompt, system_prompt).
    """
    system_prompt = None
    user_parts = []

    for msg in messages:
        if msg.role == "system":
            system_prompt = msg.content
        elif msg.role == "user":
            user_parts.append(msg.content)
        elif msg.role == "assistant":
            if msg.tool_calls:
                user_parts.append("Assistant: [Called tools]")
            elif msg.content:
                user_parts.append(f"Assistant: {msg.content}")
        elif msg.role == "tool":
            user_parts.append(f"Tool {msg.name}: {msg.content}")

    user_prompt = "\n\n".join(user_parts)
    return user_prompt, system_prompt


def _invoke_databricks_default_judge(
    prompt: str | list["ChatMessage"],
    assessment_name: str,
    trace: "Trace | None" = None,
    use_case: str | None = None,
) -> Feedback:
    """
    Invoke the Databricks default judge with agentic tool calling support.

    When a trace is provided, enables an agentic loop where the judge can iteratively
    call tools to analyze the trace data before producing a final assessment.

    Args:
        prompt: The formatted prompt with template variables filled in.
        assessment_name: The name of the assessment.
        trace: Optional trace object for tool-based analysis.
        use_case: The use case for the chat completion. Only used if supported by the
            installed databricks-agents version.

    Returns:
        Feedback object from the Databricks judge.

    Raises:
        MlflowException: If databricks-agents is not installed or max iterations exceeded.
    """
    import litellm

    try:
        # Convert initial prompt to litellm Messages (same pattern as litellm adapter)
        if isinstance(prompt, str):
            messages = [litellm.Message(role="user", content=prompt)]
        else:
            messages = [litellm.Message(role=msg.role, content=msg.content) for msg in prompt]

        # Enable tool calling if trace is provided
        tools = None
        model = None
        if trace is not None:
            from mlflow.genai.judges.tools import list_judge_tools

            tools = [tool.get_definition() for tool in list_judge_tools()]
            model = _DATABRICKS_AGENTIC_JUDGE_MODEL

        # Agentic loop: iteratively call LLM and execute tools until final answer
        max_iterations = MLFLOW_JUDGE_MAX_ITERATIONS.get()
        iteration_count = 0

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
                # Serialize messages to Databricks format
                user_prompt, system_prompt = _serialize_messages_to_databricks_prompts(messages)

                llm_result = call_chat_completions(
                    user_prompt, system_prompt, tools=tools, model=model, use_case=use_case
                )

                # Parse response
                output_json = llm_result.output_json
                if not output_json:
                    return Feedback(
                        name=assessment_name,
                        error="Empty response from Databricks judge",
                        source=AssessmentSource(
                            source_type=AssessmentSourceType.LLM_JUDGE,
                            source_id=_DATABRICKS_DEFAULT_JUDGE_MODEL,
                        ),
                        trace_id=trace.info.trace_id if trace else None,
                    )

                parsed_json = (
                    json.loads(output_json) if isinstance(output_json, str) else output_json
                )

                # Convert response to litellm Message
                try:
                    message = _create_litellm_message_from_databricks_response(parsed_json)
                except ValueError as e:
                    return Feedback(
                        name=assessment_name,
                        error=f"Invalid response format from Databricks judge: {e}",
                        source=AssessmentSource(
                            source_type=AssessmentSourceType.LLM_JUDGE,
                            source_id=_DATABRICKS_DEFAULT_JUDGE_MODEL,
                        ),
                        trace_id=trace.info.trace_id if trace else None,
                    )

                # No tool calls means final answer - parse and return
                if not message.tool_calls:
                    return _parse_databricks_judge_response(message.content, assessment_name, trace)

                # Append assistant message and process tool calls (same pattern as litellm)
                messages.append(message)
                tool_response_messages = _process_tool_calls(
                    tool_calls=message.tool_calls,
                    trace=trace,
                )
                messages.extend(tool_response_messages)

            except Exception as e:
                _logger.debug(
                    f"Failed in agentic loop iteration {iteration_count}: {e}", exc_info=True
                )
                raise

    except Exception as e:
        _logger.debug(f"Failed to invoke Databricks judge: {e}", exc_info=True)
        return Feedback(
            name=assessment_name,
            error=f"Failed to invoke Databricks judge: {e}",
            source=AssessmentSource(
                source_type=AssessmentSourceType.LLM_JUDGE,
                source_id=_DATABRICKS_DEFAULT_JUDGE_MODEL,
            ),
            trace_id=trace.info.trace_id if trace else None,
        )


class DatabricksManagedJudgeAdapter(BaseJudgeAdapter):
    """Adapter for Databricks managed judge using databricks.agents.evals library."""

    @classmethod
    def is_applicable(
        cls,
        model_uri: str,
        prompt: str | list["ChatMessage"],
    ) -> bool:
        return model_uri == _DATABRICKS_DEFAULT_JUDGE_MODEL

    def invoke(self, input_params: AdapterInvocationInput) -> AdapterInvocationOutput:
        feedback = _invoke_databricks_default_judge(
            prompt=input_params.prompt,
            assessment_name=input_params.assessment_name,
            trace=input_params.trace,
            use_case=input_params.use_case,
        )
        return AdapterInvocationOutput(feedback=feedback)
```

--------------------------------------------------------------------------------

````
