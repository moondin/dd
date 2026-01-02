---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 279
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 279 of 991)

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

---[FILE: search_traces.py]---
Location: mlflow-master/mlflow/genai/judges/tools/search_traces.py

```python
"""
Search traces tool for MLflow GenAI judges.

This module provides a tool for searching and retrieving traces from an MLflow experiment
based on filter criteria, ordering, and result limits. It enables judges to analyze
traces within the same experiment context.
"""

import logging

import mlflow
from mlflow.entities.assessment import Assessment, Expectation, Feedback
from mlflow.entities.trace import Trace
from mlflow.entities.trace_location import TraceLocationType
from mlflow.exceptions import MlflowException
from mlflow.genai.judges.tools.base import JudgeTool
from mlflow.genai.judges.tools.constants import ToolNames
from mlflow.genai.judges.tools.types import (
    JudgeToolExpectation,
    JudgeToolFeedback,
    JudgeToolTraceInfo,
)
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE
from mlflow.types.llm import (
    FunctionToolDefinition,
    ToolDefinition,
    ToolParamsSchema,
)
from mlflow.utils.annotations import experimental

_logger = logging.getLogger(__name__)


def _convert_assessments_to_tool_types(
    assessments: list[Assessment],
) -> list[JudgeToolExpectation | JudgeToolFeedback]:
    tool_types: list[JudgeToolExpectation | JudgeToolFeedback] = []
    for assessment in assessments:
        if isinstance(assessment, Expectation):
            tool_types.append(
                JudgeToolExpectation(
                    name=assessment.name,
                    source=assessment.source.source_type,
                    rationale=assessment.rationale,
                    span_id=assessment.span_id,
                    assessment_id=assessment.assessment_id,
                    value=assessment.value,
                )
            )
        elif isinstance(assessment, Feedback):
            tool_types.append(
                JudgeToolFeedback(
                    name=assessment.name,
                    source=assessment.source.source_type,
                    rationale=assessment.rationale,
                    span_id=assessment.span_id,
                    assessment_id=assessment.assessment_id,
                    value=assessment.value,
                    error_code=assessment.error.error_code if assessment.error else None,
                    error_message=assessment.error.error_message if assessment.error else None,
                    stack_trace=assessment.error.stack_trace if assessment.error else None,
                    overrides=assessment.overrides,
                    valid=assessment.valid,
                )
            )
    return tool_types


def _get_experiment_id(trace: Trace) -> str:
    """
    Get and validate experiment ID from trace.

    Args:
        trace: The MLflow trace object

    Returns:
        Experiment ID

    Raises:
        MlflowException: If trace is not from MLflow experiment or has no experiment ID
    """
    if not trace.info.trace_location:
        raise MlflowException(
            "Current trace has no trace location. Cannot determine experiment context.",
            error_code=INVALID_PARAMETER_VALUE,
        )

    if trace.info.trace_location.type != TraceLocationType.MLFLOW_EXPERIMENT:
        raise MlflowException(
            f"Current trace is not from an MLflow experiment "
            f"(type: {trace.info.trace_location.type}). "
            "Traces can only be retrieved for traces within MLflow experiments.",
            error_code=INVALID_PARAMETER_VALUE,
        )

    if not (
        trace.info.trace_location.mlflow_experiment
        and trace.info.trace_location.mlflow_experiment.experiment_id
    ):
        raise MlflowException(
            "Current trace has no experiment_id. Cannot search for traces.",
            error_code=INVALID_PARAMETER_VALUE,
        )

    return trace.info.trace_location.mlflow_experiment.experiment_id


@experimental(version="3.5.0")
class SearchTracesTool(JudgeTool):
    """
    Tool for searching and retrieving traces from an MLflow experiment.

    This tool enables judges to search for traces within the same experiment context
    as the current trace being evaluated. It supports filtering, ordering, and
    pagination of results. The tool returns trace metadata including request/response
    data, execution metrics, and assessments for analysis.
    """

    @property
    def name(self) -> str:
        return ToolNames._SEARCH_TRACES

    def get_definition(self) -> ToolDefinition:
        return ToolDefinition(
            function=FunctionToolDefinition(
                name=ToolNames._SEARCH_TRACES,
                description=(
                    "Search for traces within the same MLflow experiment as the current trace. "
                    "Returns trace metadata including trace_id, request_time, state, request, "
                    "response, execution_duration, and assessments. Supports filtering with "
                    "MLflow search syntax (e.g., 'attributes.status = \"OK\"'), custom ordering "
                    "(e.g., ['timestamp DESC']), and result limits. Use this to analyze patterns "
                    "across traces or find specific traces matching criteria."
                ),
                parameters=ToolParamsSchema(
                    type="object",
                    properties={
                        "filter_string": {
                            "type": "string",
                            "description": (
                                "Optional filter string using SQL-like search syntax. "
                                "If not specified, all traces are returned.\n\n"
                                "SUPPORTED FIELDS:\n"
                                "- Attributes: request_id, timestamp_ms, execution_time_ms, "
                                "status, name, run_id\n"
                                "- Tags: Use 'tags.' or 'tag.' prefix "
                                "(e.g., tags.operation_type, tag.model_name)\n"
                                "- Metadata: Use 'metadata.' prefix (e.g., metadata.run_id)\n"
                                "- Use backticks for special characters: tags.`model-name`\n\n"
                                "VALUE SYNTAX:\n"
                                "- String values MUST be quoted: status = 'OK'\n"
                                "- Numeric values don't need quotes: execution_time_ms > 1000\n"
                                "- Tag and metadata values MUST be quoted as strings\n\n"
                                "COMPARATORS:\n"
                                "- Numeric (timestamp_ms, execution_time_ms): "
                                ">, >=, =, !=, <, <=\n"
                                "- String (name, status, request_id): =, !=, IN, NOT IN\n"
                                "- Tags/Metadata: =, !=\n\n"
                                "STATUS VALUES: 'OK', 'ERROR', 'IN_PROGRESS'\n\n"
                                "EXAMPLES:\n"
                                "- status = 'OK'\n"
                                "- execution_time_ms > 1000\n"
                                "- tags.model_name = 'gpt-4'\n"
                                "- tags.`model-version` = 'v2' AND status = 'OK'\n"
                                "- timestamp_ms >= 1234567890000 AND execution_time_ms < 5000\n"
                                "- status IN ('OK', 'ERROR')\n"
                                "- tags.environment = 'production' AND status = 'ERROR' "
                                "AND execution_time_ms > 500\n"
                                "- status = 'OK' AND tag.importance = 'high'"
                            ),
                            "default": None,
                        },
                        "order_by": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": (
                                "Optional list of order by expressions (e.g., ['timestamp DESC']). "
                                "Defaults to ['timestamp ASC'] for chronological order."
                            ),
                            "default": ["timestamp ASC"],
                        },
                        "max_results": {
                            "type": "integer",
                            "description": "Maximum number of traces to return (default: 20)",
                            "default": 20,
                        },
                    },
                    required=[],
                ),
            ),
            type="function",
        )

    def invoke(
        self,
        trace: Trace,
        filter_string: str | None = None,
        order_by: list[str] | None = None,
        max_results: int = 20,
    ) -> list[JudgeToolTraceInfo]:
        """
        Search for traces within the same experiment as the current trace.

        Args:
            trace: The current MLflow trace object (used to determine experiment context)
            filter_string: Optional filter using MLflow search syntax
                (e.g., 'attributes.status = "OK"')
            order_by: Optional list of order by expressions (e.g., ['timestamp DESC'])
            max_results: Maximum number of traces to return (default: 20)

        Returns:
            List of JudgeToolTraceInfo objects containing trace metadata, request/response data,
            and assessments for each matching trace

        Raises:
            MlflowException: If trace has no experiment context or search fails
        """
        # Extract and validate experiment ID from trace
        experiment_id = _get_experiment_id(trace)
        locations = [experiment_id]

        # Default to chronological order
        if order_by is None:
            order_by = ["timestamp ASC"]

        _logger.debug(
            "Searching for traces with properties:\n\n"
            + "\n".join(
                [
                    f"* experiment_id={experiment_id}",
                    f"* filter_string={filter_string}",
                    f"* order_by={order_by}",
                    f"* max_results={max_results}",
                ]
            )
        )

        try:
            trace_objs = mlflow.search_traces(
                locations=locations,
                filter_string=filter_string,
                order_by=order_by,
                max_results=max_results,
                return_type="list",
            )

        except Exception as e:
            raise MlflowException(
                f"Failed to search traces: {e!s}",
                error_code="INTERNAL_ERROR",
            ) from e

        traces = []

        for trace_obj in trace_objs:
            try:
                trace_info = JudgeToolTraceInfo(
                    trace_id=trace_obj.info.trace_id,
                    request_time=trace_obj.info.request_time,
                    state=trace_obj.info.state,
                    request=trace_obj.data.request,
                    response=trace_obj.data.response,
                    execution_duration=trace_obj.info.execution_duration,
                    assessments=_convert_assessments_to_tool_types(trace_obj.info.assessments),
                )
                traces.append(trace_info)
            except Exception as e:
                _logger.warning(f"Failed to process trace {trace_obj.info.trace_id}: {e}")
                continue

        _logger.debug(f"Retrieved {len(traces)} traces")
        return traces
```

--------------------------------------------------------------------------------

---[FILE: search_trace_regex.py]---
Location: mlflow-master/mlflow/genai/judges/tools/search_trace_regex.py

```python
"""
Tool for searching traces using regex patterns.

This module provides functionality to search through entire traces (including
spans, metadata, tags, requests, and responses) using regular expressions
with case-insensitive matching.
"""

import re
from dataclasses import dataclass

from mlflow.entities.trace import Trace
from mlflow.genai.judges.tools.base import JudgeTool
from mlflow.genai.judges.tools.constants import ToolNames
from mlflow.types.llm import FunctionToolDefinition, ToolDefinition, ToolParamsSchema
from mlflow.utils.annotations import experimental


@experimental(version="3.4.0")
@dataclass
class RegexMatch:
    """Represents a single regex match found in a trace."""

    span_id: str
    matched_text: str
    surrounding_text: str


@experimental(version="3.4.0")
@dataclass
class SearchTraceRegexResult:
    """Result of searching a trace with a regex pattern."""

    pattern: str
    total_matches: int
    matches: list[RegexMatch]
    error: str | None = None


@experimental(version="3.4.0")
class SearchTraceRegexTool(JudgeTool):
    """
    Tool for searching through entire traces using regex patterns.

    Performs case-insensitive regex search across all trace fields including
    spans, metadata, tags, requests, responses, and other fields. Returns
    matched text with surrounding context to help understand where matches occur.
    """

    @property
    def name(self) -> str:
        """Return the tool name."""
        return ToolNames.SEARCH_TRACE_REGEX

    def get_definition(self) -> ToolDefinition:
        """Get the tool definition for LiteLLM/OpenAI function calling."""
        return ToolDefinition(
            function=FunctionToolDefinition(
                name=ToolNames.SEARCH_TRACE_REGEX,
                description=(
                    "Search through the entire trace using a regular expression pattern. "
                    "Performs case-insensitive matching across all trace fields including spans, "
                    "metadata, tags, requests, and responses. Returns all matches with surrounding "
                    "context. Useful for finding specific patterns, values, or text anywhere in "
                    "the trace."
                ),
                parameters=ToolParamsSchema(
                    type="object",
                    properties={
                        "pattern": {
                            "type": "string",
                            "description": (
                                "Regular expression pattern to search for. The search is "
                                "case-insensitive. Examples: 'error.*timeout', 'user_id:\\s*\\d+', "
                                "'function_name\\(.*\\)'"
                            ),
                        },
                        "max_matches": {
                            "type": "integer",
                            "description": "Maximum number of matches to return (default: 50)",
                            "default": 50,
                        },
                        "surrounding_content_length": {
                            "type": "integer",
                            "description": (
                                "Number of characters to include before and after each match "
                                "for context (default: 100)"
                            ),
                            "default": 100,
                        },
                    },
                    required=["pattern"],
                ),
            ),
            type="function",
        )

    def invoke(
        self,
        trace: Trace,
        pattern: str,
        max_matches: int = 50,
        surrounding_content_length: int = 100,
    ) -> SearchTraceRegexResult:
        """
        Search through the trace using a regex pattern.

        Args:
            trace: The MLflow trace object to search through
            pattern: Regular expression pattern to search for
            max_matches: Maximum number of matches to return
            surrounding_content_length: Number of characters to include before and after each
                match for context

        Returns:
            SearchTraceRegexResult containing the search results
        """
        try:
            regex = re.compile(pattern, re.IGNORECASE)
        except re.error as e:
            return SearchTraceRegexResult(
                pattern=pattern,
                total_matches=0,
                matches=[],
                error=f"Invalid regex pattern: {e}",
            )

        trace_json = trace.to_json()
        matches = []
        total_found = 0
        for match in regex.finditer(trace_json):
            if total_found >= max_matches:
                break
            matches.append(
                self._create_regex_match(
                    match, trace_json, surrounding_content_length=surrounding_content_length
                )
            )
            total_found += 1

        return SearchTraceRegexResult(
            pattern=pattern,
            total_matches=total_found,
            matches=matches,
        )

    def _create_regex_match(
        self,
        match: re.Match[str],
        text: str,
        span_id: str = "trace",
        surrounding_content_length: int = 100,
    ) -> RegexMatch:
        """Create a RegexMatch with surrounding context from a regex match object."""
        matched_text = match.group()
        start, end = match.span()
        context_start = max(0, start - surrounding_content_length)
        context_end = min(len(text), end + surrounding_content_length)
        surrounding = text[context_start:context_end]
        if context_start > 0:
            surrounding = "..." + surrounding
        if context_end < len(text):
            surrounding = surrounding + "..."
        return RegexMatch(
            span_id=span_id,
            matched_text=matched_text,
            surrounding_text=surrounding,
        )
```

--------------------------------------------------------------------------------

---[FILE: types.py]---
Location: mlflow-master/mlflow/genai/judges/tools/types.py

```python
"""
Shared types for MLflow GenAI judge tools.

This module provides common data structures and types that can be reused
across multiple judge tools for consistent data representation.
"""

from dataclasses import dataclass
from typing import Any

from mlflow.entities.assessment import FeedbackValueType
from mlflow.entities.span_status import SpanStatus
from mlflow.entities.trace_state import TraceState
from mlflow.utils.annotations import experimental


@experimental(version="3.4.0")
@dataclass
class SpanResult:
    """Result from getting span content."""

    span_id: str | None
    content: str | None
    content_size_bytes: int
    page_token: str | None = None
    error: str | None = None


@experimental(version="3.4.0")
@dataclass
class SpanInfo:
    """Information about a single span."""

    span_id: str
    name: str
    span_type: str
    start_time_ms: float
    end_time_ms: float
    duration_ms: float
    parent_id: str | None
    status: SpanStatus
    is_root: bool
    attribute_names: list[str]


@experimental(version="3.5.0")
@dataclass
class JudgeToolExpectation:
    """Expectation for a trace (simplified for judge tools)."""

    name: str
    source: str
    rationale: str | None
    span_id: str | None
    assessment_id: str | None
    value: Any


@experimental(version="3.5.0")
@dataclass
class JudgeToolFeedback:
    """Feedback for a trace (simplified for judge tools)."""

    name: str
    source: str
    rationale: str | None
    span_id: str | None
    assessment_id: str | None
    value: FeedbackValueType | None
    error_code: str | None
    error_message: str | None
    stack_trace: str | None
    overrides: str | None
    valid: bool | None


@experimental(version="3.5.0")
@dataclass
class JudgeToolTraceInfo:
    """Information about a single trace (simplified for judge tools)."""

    trace_id: str
    request_time: int
    state: TraceState
    request: str | None
    response: str | None
    execution_duration: int | None
    assessments: list[JudgeToolExpectation | JudgeToolFeedback]
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: mlflow-master/mlflow/genai/judges/tools/utils.py

```python
"""
Utilities for MLflow GenAI judge tools.

This module contains utility functions and classes used across
different judge tool implementations.
"""

from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE
from mlflow.utils.annotations import experimental


@experimental(version="3.4.0")
def create_page_token(offset: int) -> str:
    """
    Create a page token from an offset value.

    Args:
        offset: The byte offset for pagination

    Returns:
        String representation of the offset to use as a page token
    """
    return str(offset)


@experimental(version="3.4.0")
def parse_page_token(page_token: str | None) -> int:
    """
    Parse a page token to extract the offset value.

    Args:
        page_token: The page token string to parse, or None

    Returns:
        The offset value, or 0 if token is None

    Raises:
        MlflowException: If page_token is invalid
    """
    if page_token is None:
        return 0

    try:
        return int(page_token)
    except (ValueError, TypeError) as e:
        raise MlflowException(
            f"Invalid page_token '{page_token}': must be a valid integer",
            error_code=INVALID_PARAMETER_VALUE,
        ) from e
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/genai/judges/tools/__init__.py

```python
from mlflow.genai.judges.tools.base import JudgeTool
from mlflow.genai.judges.tools.get_root_span import GetRootSpanTool
from mlflow.genai.judges.tools.get_span import GetSpanTool
from mlflow.genai.judges.tools.get_span_performance_and_timing_report import (
    GetSpanPerformanceAndTimingReportTool,
)
from mlflow.genai.judges.tools.get_trace_info import GetTraceInfoTool
from mlflow.genai.judges.tools.get_traces_in_session import GetTracesInSession
from mlflow.genai.judges.tools.list_spans import ListSpansResult, ListSpansTool
from mlflow.genai.judges.tools.registry import (
    JudgeToolRegistry,
    invoke_judge_tool,
    list_judge_tools,
    register_judge_tool,
)
from mlflow.genai.judges.tools.search_trace_regex import (
    RegexMatch,
    SearchTraceRegexResult,
    SearchTraceRegexTool,
)
from mlflow.genai.judges.tools.search_traces import SearchTracesTool
from mlflow.genai.judges.tools.types import SpanInfo, SpanResult

__all__ = [
    "JudgeTool",
    "GetTracesInSession",
    "GetRootSpanTool",
    "GetSpanTool",
    "GetSpanPerformanceAndTimingReportTool",
    "SpanResult",
    "GetTraceInfoTool",
    "ListSpansTool",
    "SpanInfo",
    "ListSpansResult",
    "JudgeToolRegistry",
    "RegexMatch",
    "SearchTraceRegexResult",
    "SearchTraceRegexTool",
    "SearchTracesTool",
    "register_judge_tool",
    "invoke_judge_tool",
    "list_judge_tools",
]
```

--------------------------------------------------------------------------------

---[FILE: formatting_utils.py]---
Location: mlflow-master/mlflow/genai/judges/utils/formatting_utils.py

```python
import logging
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from mlflow.genai.utils.type import FunctionCall
    from mlflow.types.chat import ChatTool

_logger = logging.getLogger(__name__)


def format_available_tools(available_tools: list["ChatTool"]) -> str:
    """Format available tools with descriptions and parameters.

    Args:
        available_tools: The set of available tools

    Returns:
        Formatted string representation of available tools

    Example:
        >>> # Output format:
        >>> # - search: Search for information on the web
        >>> #     - query (required): string - The search query to execute
        >>> #     - max_results (optional): integer - Maximum number of results
        >>> # - translate: Translate text to another language
        >>> #     - text (required): string - The text to translate
        >>> #     - target (required): string - Target language code
    """
    available_tools_parts = []
    for tool in available_tools:
        if not tool.function:
            _logger.warning(f"Skipping tool with missing function definition: {tool}")
            continue

        tool_str = f"- {tool.function.name}"
        if tool.function.description:
            tool_str += f": {tool.function.description}"

        if tool.function.parameters and tool.function.parameters.properties:
            params = tool.function.parameters
            required_params = set(params.required or [])
            param_lines = []

            for param_name, param_prop in params.properties.items():
                is_required = param_name in required_params
                required_marker = " (required)" if is_required else " (optional)"
                param_line = f"    - {param_name}{required_marker}"

                if hasattr(param_prop, "type") and param_prop.type:
                    param_line += f": {param_prop.type}"

                if param_prop.description:
                    param_line += f" - {param_prop.description}"

                param_lines.append(param_line)

            if param_lines:
                tool_str += "\n" + "\n".join(param_lines)

        available_tools_parts.append(tool_str)
    return "\n\n".join(available_tools_parts) if available_tools_parts else "No tools available"


def format_tools_called(tools_called: list["FunctionCall"]) -> str:
    """Format tools called with step numbers, arguments, and outputs.

    Args:
        tools_called: The sequence of tools that were called by the agent.
            Each element should be a FunctionCall object.

    Returns:
        Formatted string representation of tools called

    Example:
        >>> # Output format:
        >>> # Tool Call 1: search
        >>> #   Input Arguments: {"query": "capital of France"}
        >>> #   Output: Paris
        >>> #
        >>> # Tool Call 2: translate
        >>> #   Input Arguments: {"text": "Paris", "target": "es"}
        >>> #   Output: París
    """
    tools_called_parts = []
    for idx, tool in enumerate(tools_called, start=1):
        tool_name = tool.name
        tool_args = tool.arguments or {}
        tool_output = tool.outputs or "(no output)"

        tool_str = f"Tool Call {idx}: {tool_name}\n"
        tool_str += f"  Input Arguments: {tool_args}\n"
        tool_str += f"  Output: {tool_output}"
        if tool.exception:
            tool_str += f"\n  Exception: {tool.exception}"
        tools_called_parts.append(tool_str)
    return "\n\n".join(tools_called_parts) if tools_called_parts else "No tools called"
```

--------------------------------------------------------------------------------

---[FILE: invocation_utils.py]---
Location: mlflow-master/mlflow/genai/judges/utils/invocation_utils.py
Signals: Pydantic

```python
"""Main invocation utilities for judge models."""

from __future__ import annotations

import json
import logging
from typing import TYPE_CHECKING, Any

import pydantic

if TYPE_CHECKING:
    from mlflow.entities.trace import Trace
    from mlflow.types.llm import ChatMessage

from mlflow.entities.assessment import Feedback
from mlflow.genai.judges.adapters.base_adapter import AdapterInvocationInput
from mlflow.genai.judges.adapters.litellm_adapter import _invoke_litellm_and_handle_tools
from mlflow.genai.judges.adapters.utils import get_adapter
from mlflow.genai.judges.utils.parsing_utils import _strip_markdown_code_blocks
from mlflow.telemetry.events import InvokeCustomJudgeModelEvent
from mlflow.telemetry.track import record_usage_event

_logger = logging.getLogger(__name__)


class FieldExtraction(pydantic.BaseModel):
    """Schema for extracting inputs and outputs from traces using LLM."""

    inputs: str = pydantic.Field(description="The user's original request or question")
    outputs: str = pydantic.Field(description="The system's final response")


@record_usage_event(InvokeCustomJudgeModelEvent)
def invoke_judge_model(
    model_uri: str,
    prompt: str | list["ChatMessage"],
    assessment_name: str,
    trace: Trace | None = None,
    num_retries: int = 10,
    response_format: type[pydantic.BaseModel] | None = None,
    use_case: str | None = None,
    inference_params: dict[str, Any] | None = None,
) -> Feedback:
    """
    Invoke the judge model.

    Routes to the appropriate adapter based on the model URI and configuration.
    Uses a factory pattern to select the correct adapter:
    - DatabricksManagedJudgeAdapter: For the default Databricks judge
    - DatabricksServingEndpointAdapter: For Databricks serving endpoints
    - LiteLLMAdapter: For LiteLLM-supported providers
    - GatewayAdapter: Fallback for native providers

    Args:
        model_uri: The model URI.
        prompt: The prompt to evaluate. Can be a string (single prompt) or
                a list of ChatMessage objects.
        assessment_name: The name of the assessment.
        trace: Optional trace object for context.
        num_retries: Number of retries on transient failures when using litellm.
        response_format: Optional Pydantic model class for structured output format.
        use_case: The use case for the chat completion. Only applicable when using the
            Databricks default judge and only used if supported by the installed
            databricks-agents version.
        inference_params: Optional dictionary of inference parameters to pass to the
            model (e.g., temperature, top_p, max_tokens). These parameters allow
            fine-grained control over the model's behavior during evaluation.

    Returns:
        Feedback object with the judge's assessment.

    Raises:
        MlflowException: If the model cannot be invoked or dependencies are missing.
    """
    adapter = get_adapter(model_uri=model_uri, prompt=prompt)

    input_params = AdapterInvocationInput(
        model_uri=model_uri,
        prompt=prompt,
        assessment_name=assessment_name,
        trace=trace,
        num_retries=num_retries,
        response_format=response_format,
        use_case=use_case,
        inference_params=inference_params,
    )

    output = adapter.invoke(input_params)
    return output.feedback


def get_chat_completions_with_structured_output(
    model_uri: str,
    messages: list["ChatMessage"],
    output_schema: type[pydantic.BaseModel],
    trace: Trace | None = None,
    num_retries: int = 10,
    inference_params: dict[str, Any] | None = None,
) -> pydantic.BaseModel:
    """
    Get chat completions from an LLM with structured output conforming to a Pydantic schema.

    This function invokes an LLM and ensures the response matches the provided Pydantic schema.
    When a trace is provided, the LLM can use tool calling to examine trace spans.

    Args:
        model_uri: The model URI (e.g., "openai:/gpt-4", "anthropic:/claude-3").
        messages: List of ChatMessage objects for the conversation with the LLM.
        output_schema: Pydantic model class defining the expected output structure.
                       The LLM will be instructed to return data matching this schema.
        trace: Optional trace object for context. When provided, enables tool
               calling to examine trace spans.
        num_retries: Number of retries on transient failures. Defaults to 10 with
                     exponential backoff.
        inference_params: Optional dictionary of inference parameters to pass to the
                       model (e.g., temperature, top_p, max_tokens).

    Returns:
        Instance of output_schema with the structured data from the LLM.

    Raises:
        ImportError: If LiteLLM is not installed.
        JSONDecodeError: If the LLM response cannot be parsed as JSON.
        ValidationError: If the LLM response does not match the output schema.

    Example:
        .. code-block:: python

            from pydantic import BaseModel, Field
            from mlflow.genai.judges.utils import get_chat_completions_with_structured_output
            from mlflow.types.llm import ChatMessage


            class FieldExtraction(BaseModel):
                inputs: str = Field(description="The user's original request")
                outputs: str = Field(description="The system's final response")


            # Extract fields from a trace where root span lacks input/output
            # but nested spans contain the actual data
            result = get_chat_completions_with_structured_output(
                model_uri="openai:/gpt-4",
                messages=[
                    ChatMessage(role="system", content="Extract fields from the trace"),
                    ChatMessage(role="user", content="Find the inputs and outputs"),
                ],
                output_schema=FieldExtraction,
                trace=trace,  # Trace with nested spans containing actual data
            )
            print(result.inputs)  # Extracted from inner span
            print(result.outputs)  # Extracted from inner span
    """
    from mlflow.metrics.genai.model_utils import _parse_model_uri

    model_provider, model_name = _parse_model_uri(model_uri)

    # TODO: The cost measurement is discarded here from the parsing of the
    # tool handling response. We should eventually pass this cost estimation through
    # so that the total cost of the usage of the scorer incorporates tool call usage.
    # Deferring for initial implementation due to complexity.
    response, _ = _invoke_litellm_and_handle_tools(
        provider=model_provider,
        model_name=model_name,
        messages=messages,
        trace=trace,
        num_retries=num_retries,
        response_format=output_schema,
        inference_params=inference_params,
    )

    cleaned_response = _strip_markdown_code_blocks(response)
    response_dict = json.loads(cleaned_response)
    return output_schema(**response_dict)
```

--------------------------------------------------------------------------------

---[FILE: parsing_utils.py]---
Location: mlflow-master/mlflow/genai/judges/utils/parsing_utils.py

```python
"""Response parsing utilities for judge models."""


def _strip_markdown_code_blocks(response: str) -> str:
    """
    Strip markdown code blocks from LLM responses.

    Some legacy models wrap JSON responses in markdown code blocks (```json...```).
    This function removes those wrappers to extract the raw JSON content.

    Args:
        response: The raw response from the LLM

    Returns:
        The response with markdown code blocks removed
    """
    cleaned = response.strip()
    if not cleaned.startswith("```"):
        return cleaned

    lines = cleaned.split("\n")
    start_idx = 0
    end_idx = len(lines)

    for i, line in enumerate(lines):
        if i == 0 and line.startswith("```"):
            start_idx = 1
        elif line.strip() == "```" and i > 0:
            end_idx = i
            break

    return "\n".join(lines[start_idx:end_idx])


def _sanitize_justification(justification: str) -> str:
    return justification.replace("Let's think step by step. ", "")
```

--------------------------------------------------------------------------------

---[FILE: prompt_utils.py]---
Location: mlflow-master/mlflow/genai/judges/utils/prompt_utils.py

```python
"""Prompt formatting and manipulation utilities for judge models."""

from __future__ import annotations

import re
from typing import TYPE_CHECKING, NamedTuple

from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import BAD_REQUEST

if TYPE_CHECKING:
    from mlflow.genai.judges.base import JudgeField
    from mlflow.types.llm import ChatMessage


class DatabricksLLMJudgePrompts(NamedTuple):
    """Result of splitting ChatMessage list for Databricks API."""

    system_prompt: str | None
    user_prompt: str


def format_prompt(prompt: str, **values) -> str:
    """Format double-curly variables in the prompt template."""
    for key, value in values.items():
        # Escape backslashes in the replacement string to prevent re.sub from interpreting
        # them as escape sequences (e.g. \u being treated as Unicode escape)
        replacement = str(value).replace("\\", "\\\\")
        prompt = re.sub(r"\{\{\s*" + key + r"\s*\}\}", replacement, prompt)
    return prompt


def add_output_format_instructions(prompt: str, output_fields: list["JudgeField"]) -> str:
    """
    Add structured output format instructions to a judge prompt.

    This ensures the LLM returns a JSON response with the expected fields,
    matching the expected format for the invoke_judge_model function.

    Args:
        prompt: The formatted prompt with template variables filled in
        output_fields: List of JudgeField objects defining output fields.

    Returns:
        The prompt with output format instructions appended
    """
    json_format_lines = [f'    "{field.name}": "{field.description}"' for field in output_fields]

    json_format = "{\n" + ",\n".join(json_format_lines) + "\n}"

    output_format_instructions = f"""

Please provide your assessment in the following JSON format only (no markdown):

{json_format}"""
    return prompt + output_format_instructions


def _split_messages_for_databricks(messages: list["ChatMessage"]) -> DatabricksLLMJudgePrompts:
    """
    Split a list of ChatMessage objects into system and user prompts for Databricks API.

    Args:
        messages: List of ChatMessage objects to split.

    Returns:
        DatabricksLLMJudgePrompts namedtuple with system_prompt and user_prompt fields.
        The system_prompt may be None.

    Raises:
        MlflowException: If the messages list is empty or invalid.
    """
    from mlflow.types.llm import ChatMessage

    if not messages:
        raise MlflowException(
            "Invalid prompt format: expected non-empty list of ChatMessage",
            error_code=BAD_REQUEST,
        )

    system_prompt = None
    user_parts = []

    for msg in messages:
        if isinstance(msg, ChatMessage):
            if msg.role == "system":
                # Use the first system message as the actual system prompt for the API.
                # Any subsequent system messages are appended to the user prompt to preserve
                # their content and maintain the order in which they appear in the submitted
                # evaluation payload.
                if system_prompt is None:
                    system_prompt = msg.content
                else:
                    user_parts.append(f"System: {msg.content}")
            elif msg.role == "user":
                user_parts.append(msg.content)
            elif msg.role == "assistant":
                user_parts.append(f"Assistant: {msg.content}")

    user_prompt = "\n\n".join(user_parts) if user_parts else ""

    return DatabricksLLMJudgePrompts(system_prompt=system_prompt, user_prompt=user_prompt)
```

--------------------------------------------------------------------------------

````
