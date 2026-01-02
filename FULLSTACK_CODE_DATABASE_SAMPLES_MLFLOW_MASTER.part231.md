---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 231
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 231 of 991)

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

---[FILE: analyze_experiment.md]---
Location: mlflow-master/mlflow/ai_commands/genai/analyze_experiment.md

```text
---
namespace: genai
description: Analyzes the traces logged in an MLflow experiment to find operational and quality issues automatically, generating a markdown report.
---

# Analyze Experiment

Analyzes traces in an MLflow experiment for quality issues, performance problems, and patterns.

# EXECUTION CONTEXT

**MCP**: Skip to Section 1.2 (auth is pre-configured). Use MCP trace tools.
**CLI**: Start with Section 1.1 for auth setup. Use `mlflow traces` commands.

**IMPORTANT**: When you ask the user a question, you MUST WAIT for their response before continuing.

## Step 1: Setup and Configuration

### 1.1 Collect Tracking Server Information (CLI Only)

- **REQUIRED FIRST**: Ask user "How do you want to authenticate to MLflow?"

  **Option 1: Local/Self-hosted MLflow**

  - Ask for tracking URI (one of):
    - SQLite: `sqlite:////path/to/mlflow.db`
    - PostgreSQL: `postgresql://user:password@host:port/database`
    - MySQL: `mysql://user:password@host:port/database`
    - File Store: `file:///path/to/mlruns` or just `/path/to/mlruns`
  - Ask user to create an environment file (e.g., `mlflow.env`) containing:
    ```
    MLFLOW_TRACKING_URI=<provided_uri>
    ```

  **Option 2: Databricks**

  - Ask which authentication method:
    - **PAT Auth**: Request `DATABRICKS_HOST` and `DATABRICKS_TOKEN`
    - **Profile Auth**: Request `DATABRICKS_CONFIG_PROFILE` name
  - Ask user to create an environment file (e.g., `mlflow.env`) containing:

    ```
    # For PAT Auth:
    MLFLOW_TRACKING_URI=databricks
    DATABRICKS_HOST=<provided_host>
    DATABRICKS_TOKEN=<provided_token>

    # OR for Profile Auth:
    MLFLOW_TRACKING_URI=databricks
    DATABRICKS_CONFIG_PROFILE=<provided_profile>
    ```

  **Option 3: Environment Variables Already Set**

  - Ask user "Do you already have MLflow environment variables set in your shell (bashrc/zshrc)?"
  - If yes, test connection directly: `uv run python -m mlflow experiments search --max-results 10`
  - If this works, skip env file creation and use commands without `--env-file` flag
  - If not, fall back to Options 1 or 2

- Ask user for the path to their environment file (if using Options 1-2)
- Test connection: `uv run --env-file <env_file_path> python -m mlflow experiments search --max-results 5`

### 1.2 Select Experiment and Test Trace Retrieval

- If MLFLOW_EXPERIMENT_ID not already set, list available experiments and ask user to select one:

  - **Option to search by name**: Use filter_string parameter for name search
  - Ask user for experiment ID or let them choose from the list
  - **WAIT for user response** - do not continue until they provide the experiment ID
  - For CLI: Add `MLFLOW_EXPERIMENT_ID=<experiment_id>` to environment file

- Search for traces (max_results=5) to verify:
  - Traces exist in the experiment
  - Tools are working properly
  - Connection is valid
- Extract sample trace IDs for testing
- Get one full trace by trace_id that has state OK to understand the data structure (errors might not have the structure)

## Step 2: Analysis Phase

### 2.1 Bulk Trace Collection

- Search for a larger sample (start with 20-50 traces for initial analysis)
- **IMPORTANT**: Limit results for users with hundreds of thousands of experiments/traces
- Extract key fields: trace_id, state, execution_duration_ms, request_preview, response_preview

### 2.1.5 Understand Agent Purpose and Capabilities

- Analyze trace inputs/outputs to understand the agent's task:
  - Extract trace inputs/outputs fields: info.trace_metadata.mlflow.traceInputs, info.trace_metadata.mlflow.traceOutputs
  - Examine these fields to understand:
    - Types of questions users ask
    - Types of responses the agent provides
    - Common patterns in user interactions
  - Identify available tools by examining spans with type "TOOL":
    - What tools are available to the agent?
    - What data sources can the agent access?
    - What capabilities do these tools provide?
- Generate a 1-paragraph agent description covering:
  - **What the agent's job is** (e.g., "a boating agent that answers questions about weather and helps users plan trips")
  - **What data sources it has access to** (APIs, databases, etc.)
- **Present this description to the user** and ask for confirmation/corrections
- **WAIT for user response** - do not proceed until they confirm or provide corrections
- **Ask if they want to focus the analysis on anything specific** (or do a general report)
  - If they provide specific focus areas, use these as additional context for hypothesis formation
  - Don't overfit to their focus - still do comprehensive analysis, but prioritize their areas of interest
  - Their specific concerns should become hypotheses to validate/invalidate during analysis
- **WAIT for user response** before proceeding to section 2.2
- Use agent context + any specific focus areas for all subsequent hypothesis testing in sections 2.2+

### 2.2 Operational Issues Analysis (Hypothesis-Driven Approach)

**NOTE: Use trace exploration tools - DO NOT use inline Python scripts during this phase**

**Show your thinking as you go**: Always explain your hypothesis development process including:

- Current hypothesis being tested
- Evidence found: ALWAYS show BOTH trace input (user request) AND trace output (agent response), plus tools called
- Reasoning for supporting/refuting the hypothesis

Process traces in batches of 10, building and refining hypotheses with each batch:

1. Form initial hypotheses from first batch
2. With each new batch: validate, refute, or expand hypotheses
3. Continue until patterns stabilize

**After confirming ANY hypothesis (operational or quality)**: Track assessments for inclusion in final report:

- **1:1 Correspondence**: Each assessment must correspond to ONE specific issue/hypothesis
- Use snake_case names as assessment keys (e.g., `overly_verbose`, `tool_failure`, `rate_limited`, `slow_response`)
- Track which traces exhibit each issue with detailed rationales
- Document specifics like:

  - For quality issues: exact character counts, repetition counts, unnecessary sections
  - For operational issues: exact durations, error messages, timeout values

- **Error Analysis**

  - Filter for ERROR traces (filter: "info.state = 'ERROR'", max_results=10)
  - **Adjust --max-results as needed**: Start with 10-20, increase if you need more examples to identify patterns
  - **Pattern Analysis Focus**: Identify WHY errors occur by examining:
    - Tool/API failures in spans (look for spans with type "TOOL" that failed)
    - Rate limiting responses from external APIs
    - Authentication/permission errors
    - Timeout patterns (compare execution_duration_ms)
    - Input validation failures
    - Resource unavailability (databases, services down)
  - Example hypotheses to test:
    - Certain types of queries consistently trigger tool failures
    - Errors cluster around specific time ranges (service outages)
    - Fast failures (~2s) indicate input validation vs slower failures (~30s) indicate timeouts
    - Specific tools/APIs are unreliable and cause cascading failures
    - Rate limiting from external services causes batch failures
  - **Note**: You may discover other operational error patterns as you analyze the traces

- **Performance Problems (High Latency Analysis)**
  - Filter for OK traces with high latency (filter: "info.state = 'OK'", max_results=10)
  - **Adjust --max-results as needed**: Start with 10-20, increase if you need more examples to identify patterns
  - **Pattern Analysis Focus**: Identify WHY traces are slow by examining:
    - Tool call duration patterns in spans
    - Number of sequential vs parallel tool calls
    - Specific slow APIs/tools (database queries, web requests, etc.)
    - Cold start vs warm execution patterns
    - Resource contention indicators
  - Example hypotheses to test:
    - Complex queries with multiple sequential tool calls have multiplicative latency
    - Certain tools/APIs are consistent performance bottlenecks (>5s per call)
    - First queries in sessions are slower due to cold start overhead
    - Database queries without proper indexing cause delays
    - Network timeouts or retries inflate execution time
    - Parallel tool execution is not properly implemented
  - **Note**: You may discover other performance patterns as you analyze the traces

### 2.3 Quality Issues Analysis (Hypothesis-Driven Approach)

**NOTE: Use trace exploration tools - DO NOT use inline Python scripts during this phase**

Focus on response quality, not operational performance:

- **Content Quality Issues**
  - Sample both OK and ERROR traces
  - Example hypotheses to test:
    - Agent provides overly verbose responses for simple questions
    - Some text/information is repeated unnecessarily across responses
    - Conversation context carries over inappropriately
    - Agent asks follow-up questions instead of attempting tasks
    - Responses are inconsistent for similar queries
    - Agent provides incorrect or outdated information
    - Response format is inappropriate for the query type
  - **Note**: You may discover other quality issues as you analyze the traces

### 2.4 Strengths and Successes Analysis (Hypothesis-Driven Approach)

**NOTE: Use trace exploration tools - DO NOT use inline Python scripts during this phase**

Process successful traces to identify what's working well:

- **Successful Interactions**

  - Filter for OK traces with good outcomes
  - Example hypotheses to test:
    - Agent provides comprehensive, helpful responses for complex queries
    - Certain types of questions consistently get high-quality answers
    - Tool usage is appropriate and effective for specific scenarios
    - Response format is well-structured for particular use cases

- **Effective Tool Usage**

  - Examine traces where tools are used successfully
  - Example hypotheses to test:
    - Agent selects appropriate tools for different query types
    - Multi-step tool usage produces better outcomes
    - Certain tool combinations work particularly well together

- **Quality Responses**
  - Identify traces with good response quality
  - Example hypotheses to test:
    - Agent provides right level of detail for complex questions
    - Safety/important information is appropriately included
    - Agent successfully handles follow-up questions in context

### 2.5 Generate Final Report

- Ask user where to save the report (markdown file path, e.g., `experiment_analysis.md`)
- **ONLY NOW use Python for statistical calculations** - never compute stats manually
- Python calculations are ONLY for final math/statistics, NOT for trace exploration
- Generate a single comprehensive markdown report with:
  - **Summary statistics** (computed via Python with collected trace data):
    - Total traces analyzed
    - Success rate (OK vs ERROR percentage)
    - Average, median, p95 latency for successful traces
    - Error rate distribution by duration (fast fails vs timeouts)
  - **Operational Issues** (errors, latency, performance):
    - For each confirmed operational hypothesis:
      - Clear statement of the hypothesis
      - Example trace IDs that support the hypothesis
      - BOTH trace input (user request) AND trace output (agent response) excerpts from those traces
      - Tools called (spans of type "TOOL") and their durations/failures
      - Root cause analysis: WHY the issue occurs (rate limiting, API failures, timeouts, etc.)
      - **Trace assessments**: List specific trace IDs that exhibit this issue with detailed rationales explaining why each trace demonstrates the pattern
      - Quantitative evidence (frequency, timing patterns, etc.) - computed via Python
  - **Quality Issues** (content problems, user experience):
    - For each confirmed quality hypothesis:
      - Clear statement of the hypothesis
      - Example trace IDs that support the hypothesis
      - BOTH trace input (user request) AND trace output (agent response) excerpts from those traces
      - **Trace assessments**: List specific trace IDs that exhibit this issue with detailed rationales explaining why each trace demonstrates the pattern
      - Quantitative evidence (frequency, assessment patterns, etc.) - computed via Python
  - **Refuted Hypotheses** (briefly noted)
  - Recommendations for improvement based on confirmed issues
```

--------------------------------------------------------------------------------

---[FILE: autolog.py]---
Location: mlflow-master/mlflow/anthropic/autolog.py

```python
import logging
from typing import Any

import mlflow
import mlflow.anthropic
from mlflow.anthropic.chat import convert_tool_to_mlflow_chat_tool
from mlflow.entities import SpanType
from mlflow.entities.span import LiveSpan
from mlflow.tracing.constant import SpanAttributeKey, TokenUsageKey
from mlflow.tracing.fluent import start_span_no_context
from mlflow.tracing.utils import (
    construct_full_inputs,
    set_span_chat_tools,
)
from mlflow.utils.autologging_utils.config import AutoLoggingConfig

_logger = logging.getLogger(__name__)


def patched_claude_sdk_init(original, self, options=None):
    """Patched __init__ that adds MLflow tracing hook to ClaudeSDKClient.

    The hook handler checks autologging_is_disabled() at runtime, so hooks
    are always injected but become no-ops when autologging is disabled.
    """
    try:
        from claude_agent_sdk import ClaudeAgentOptions, HookMatcher

        from mlflow.claude_code.hooks import sdk_stop_hook_handler

        # Create options if not provided
        if options is None:
            options = ClaudeAgentOptions()

        if options.hooks is None:
            options.hooks = {}
        if "Stop" not in options.hooks:
            options.hooks["Stop"] = []

        options.hooks["Stop"].append(HookMatcher(hooks=[sdk_stop_hook_handler]))

        # Call original init with modified options
        return original(self, options)

    except Exception as e:
        _logger.debug("Error in patched_claude_sdk_init: %s", e, exc_info=True)
        # Fall back to original behavior if patching fails
        return original(self, options)


def patched_class_call(original, self, *args, **kwargs):
    with TracingSession(original, self, args, kwargs) as manager:
        output = original(self, *args, **kwargs)
        manager.output = output
        return output


async def async_patched_class_call(original, self, *args, **kwargs):
    async with TracingSession(original, self, args, kwargs) as manager:
        output = await original(self, *args, **kwargs)
        manager.output = output
        return output


class TracingSession:
    """Context manager for handling MLflow spans in both sync and async contexts."""

    def __init__(self, original, instance, args, kwargs):
        self.original = original
        self.instance = instance
        self.inputs = construct_full_inputs(original, instance, *args, **kwargs)

        # These attributes are set outside the constructor.
        self.span = None
        self.output = None

    def __enter__(self):
        return self._enter_impl()

    def __exit__(self, exc_type, exc_val, exc_tb):
        self._exit_impl(exc_type, exc_val, exc_tb)

    async def __aenter__(self):
        return self._enter_impl()

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        self._exit_impl(exc_type, exc_val, exc_tb)

    def _enter_impl(self):
        config = AutoLoggingConfig.init(flavor_name=mlflow.anthropic.FLAVOR_NAME)

        if config.log_traces:
            self.span = start_span_no_context(
                name=f"{self.instance.__class__.__name__}.{self.original.__name__}",
                span_type=_get_span_type(self.original.__name__),
                inputs=self.inputs,
                attributes={SpanAttributeKey.MESSAGE_FORMAT: "anthropic"},
            )
            _set_tool_attribute(self.span, self.inputs)

        return self

    def _exit_impl(self, exc_type, exc_val, exc_tb) -> None:
        if self.span:
            if exc_val:
                self.span.record_exception(exc_val)

            _set_token_usage_attribute(self.span, self.output)
            self.span.end(outputs=self.output)


def _get_span_type(task_name: str) -> str:
    # Anthropic has a few APIs in beta, e.g., count_tokens.
    # Once they are stable, we can add them to the mapping.
    span_type_mapping = {
        "create": SpanType.CHAT_MODEL,
    }
    return span_type_mapping.get(task_name, SpanType.UNKNOWN)


def _set_tool_attribute(span: LiveSpan, inputs: dict[str, Any]):
    if (tools := inputs.get("tools")) is not None:
        try:
            tools = [convert_tool_to_mlflow_chat_tool(tool) for tool in tools]
            set_span_chat_tools(span, tools)
        except Exception as e:
            _logger.debug(f"Failed to set tools for {span}. Error: {e}")


def _set_token_usage_attribute(span: LiveSpan, output: Any):
    try:
        if usage := _parse_usage(output):
            span.set_attribute(SpanAttributeKey.CHAT_USAGE, usage)
    except Exception as e:
        _logger.debug(f"Failed to set token usage for {span}. Error: {e}")


def _parse_usage(output: Any) -> dict[str, int] | None:
    try:
        if usage := getattr(output, "usage", None):
            return {
                TokenUsageKey.INPUT_TOKENS: usage.input_tokens,
                TokenUsageKey.OUTPUT_TOKENS: usage.output_tokens,
                TokenUsageKey.TOTAL_TOKENS: usage.input_tokens + usage.output_tokens,
            }
    except Exception as e:
        _logger.debug(f"Failed to parse token usage from output: {e}")
    return None
```

--------------------------------------------------------------------------------

---[FILE: chat.py]---
Location: mlflow-master/mlflow/anthropic/chat.py
Signals: Pydantic

```python
import json
from typing import Any

from pydantic import BaseModel

from mlflow.exceptions import MlflowException
from mlflow.types.chat import (
    ChatMessage,
    ChatTool,
    Function,
    FunctionToolDefinition,
    ImageContentPart,
    ImageUrl,
    TextContentPart,
    ToolCall,
)


def convert_message_to_mlflow_chat(message: BaseModel | dict[str, Any]) -> ChatMessage:
    """
    Convert Anthropic message object into MLflow's standard format (OpenAI compatible).
    Ref: https://docs.anthropic.com/en/api/messages#body-messages
    Args:
        message: Anthropic message object or a dictionary representing the message.

    Returns:
        ChatMessage: MLflow's standard chat message object.
    """
    if isinstance(message, dict):
        content = message.get("content")
        role = message.get("role")
    elif isinstance(message, BaseModel):
        content = message.content
        role = message.role
    else:
        raise MlflowException.invalid_parameter_value(
            f"Message must be either a dict or a Message object, but got: {type(message)}."
        )

    if isinstance(content, str):
        return ChatMessage(role=role, content=content)

    elif isinstance(content, list):
        contents = []
        tool_calls = []
        tool_call_id = None
        for content_block in content:
            if isinstance(content_block, BaseModel):
                content_block = content_block.model_dump()
            content_type = content_block.get("type")
            if content_type == "tool_use":
                # Anthropic response contains tool calls in the content block
                # Ref: https://docs.anthropic.com/en/docs/build-with-claude/tool-use#example-api-response-with-a-tool-use-content-block
                tool_calls.append(
                    ToolCall(
                        id=content_block["id"],
                        function=Function(
                            name=content_block["name"], arguments=json.dumps(content_block["input"])
                        ),
                        type="function",
                    )
                )
            elif content_type == "tool_result":
                # In Anthropic, the result of tool execution is returned as a special content type
                # "tool_result" with "user" role, which corresponds to the "tool" role in OpenAI.
                role = "tool"
                tool_call_id = content_block["tool_use_id"]
                if result_content := content_block.get("content"):
                    contents.append(_parse_content(result_content))
                else:
                    contents.append(TextContentPart(text="", type="text"))
            else:
                contents.append(_parse_content(content_block))

        message = ChatMessage(role=role, content=contents)
        # Only set tool_calls field when it is present
        if tool_calls:
            message.tool_calls = tool_calls
        if tool_call_id:
            message.tool_call_id = tool_call_id
        return message

    else:
        raise MlflowException.invalid_parameter_value(
            f"Invalid content type. Must be either a string or a list, but got: {type(content)}."
        )


def _parse_content(content: str | dict[str, Any]) -> TextContentPart | ImageContentPart:
    if isinstance(content, str):
        return TextContentPart(text=content, type="text")

    content_type = content.get("type")
    if content_type == "text":
        return TextContentPart(text=content["text"], type="text")
    elif content_type == "image":
        source = content["source"]
        return ImageContentPart(
            image_url=ImageUrl(
                url=f"data:{source['media_type']};{source['type']},{source['data']}"
            ),
            type="image_url",
        )
    # Claude 3.7 added new "thinking" content block, which is essentially a text block as of now.
    # TODO: We should consider adding a new ContentPart type if more providers support this.
    # https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking
    elif content_type == "thinking":
        return TextContentPart(text=content["thinking"], type="text")
    else:
        raise MlflowException.invalid_parameter_value(
            f"Unknown content type: {content_type['type']}. Please make sure the message "
            "is a valid Anthropic message object. If it is a valid type, contact to the "
            "MLflow maintainer via https://github.com/mlflow/mlflow/issues/new/choose for "
            "requesting support for a new message type."
        )


def convert_tool_to_mlflow_chat_tool(tool: dict[str, Any]) -> ChatTool:
    """
    Convert Anthropic tool definition into MLflow's standard format (OpenAI compatible).

    Ref: https://docs.anthropic.com/en/docs/build-with-claude/tool-use

    Args:
        tool: A dictionary represents a single tool definition in the input request.

    Returns:
        ChatTool: MLflow's standard tool definition object.
    """
    return ChatTool(
        type="function",
        function=FunctionToolDefinition(
            name=tool.get("name"),
            description=tool.get("description"),
            parameters=tool.get("input_schema"),
        ),
    )
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/anthropic/__init__.py

```python
import logging

from mlflow.anthropic.autolog import (
    async_patched_class_call,
    patched_class_call,
    patched_claude_sdk_init,
)
from mlflow.telemetry.events import AutologgingEvent
from mlflow.telemetry.track import _record_event
from mlflow.utils.autologging_utils import autologging_integration, safe_patch

FLAVOR_NAME = "anthropic"
_logger = logging.getLogger(__name__)


@autologging_integration(FLAVOR_NAME)
def autolog(
    log_traces: bool = True,
    disable: bool = False,
    silent: bool = False,
):
    """
    Enables (or disables) and configures autologging from Anthropic to MLflow.
    Only synchronous calls and asynchronous APIs are supported. Streaming is not recorded.

    This also enables tracing for Claude Code SDK if available.

    Args:
        log_traces: If ``True``, traces are logged for Anthropic models.
            If ``False``, no traces are collected during inference. Default to ``True``.
        disable: If ``True``, disables the Anthropic autologging. Default to ``False``.
        silent: If ``True``, suppress all event logs and warnings from MLflow during Anthropic
            autologging. If ``False``, show all events and warnings.
    """
    from anthropic.resources import AsyncMessages, Messages

    safe_patch(
        FLAVOR_NAME,
        Messages,
        "create",
        patched_class_call,
    )

    safe_patch(
        FLAVOR_NAME,
        AsyncMessages,
        "create",
        async_patched_class_call,
    )

    # Patch Claude Code SDK if available
    try:
        from claude_agent_sdk import ClaudeSDKClient

        safe_patch(
            FLAVOR_NAME,
            ClaudeSDKClient,
            "__init__",
            patched_claude_sdk_init,
        )
    except ImportError:
        _logger.debug("Claude Agent SDK not installed, skipping Claude Code SDK patching")
    _record_event(
        AutologgingEvent, {"flavor": FLAVOR_NAME, "log_traces": log_traces, "disable": disable}
    )
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/artifacts/__init__.py

```python
"""
APIs for interacting with artifacts in MLflow
"""

import json
import pathlib
import posixpath
import tempfile
from typing import Any

from mlflow.entities.file_info import FileInfo
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import BAD_REQUEST, INVALID_PARAMETER_VALUE
from mlflow.tracking import _get_store
from mlflow.tracking.artifact_utils import (
    _download_artifact_from_uri,
    _get_root_uri_and_artifact_path,
    add_databricks_profile_info_to_artifact_uri,
    get_artifact_repository,
)


def download_artifacts(
    artifact_uri: str | None = None,
    run_id: str | None = None,
    artifact_path: str | None = None,
    dst_path: str | None = None,
    tracking_uri: str | None = None,
    registry_uri: str | None = None,
) -> str:
    """Download an artifact file or directory to a local directory.

    Args:
        artifact_uri: URI pointing to the artifacts. Supported formats include:

            * ``runs:/<run_id>/<artifact_path>``
              Example: ``runs:/500cf58bee2b40a4a82861cc31a617b1/my_model.pkl``

            * ``models:/<model_name>/<stage>``
              Example: ``models:/my_model/Production``

            * ``models:/<model_name>/<version>/path/to/model``
              Example: ``models:/my_model/2/path/to/model``

            * ``models:/<model_name>@<alias>/path/to/model``
              Example: ``models:/my_model@staging/path/to/model``

            * Cloud storage URIs: ``s3://<bucket>/<path>`` or ``gs://<bucket>/<path>``

            * Tracking server artifact URIs: ``http://<host>/mlartifacts`` or
              ``mlflow-artifacts://<host>/mlartifacts``

            Exactly one of ``artifact_uri`` or ``run_id`` must be specified.
        run_id: ID of the MLflow Run containing the artifacts. Exactly one of ``run_id`` or
            ``artifact_uri`` must be specified.
        artifact_path: (For use with ``run_id``) If specified, a path relative to the MLflow
            Run's root directory containing the artifacts to download.
        dst_path: Path of the local filesystem destination directory to which to download the
            specified artifacts. If the directory does not exist, it is created. If
            unspecified, the artifacts are downloaded to a new uniquely-named directory on
            the local filesystem, unless the artifacts already exist on the local
            filesystem, in which case their local path is returned directly.
        tracking_uri: The tracking URI to be used when downloading artifacts.
        registry_uri: The registry URI to be used when downloading artifacts.

    Returns:
        The location of the artifact file or directory on the local filesystem.
    """
    if (run_id, artifact_uri).count(None) != 1:
        raise MlflowException(
            message="Exactly one of `run_id` or `artifact_uri` must be specified",
            error_code=INVALID_PARAMETER_VALUE,
        )
    elif artifact_uri is not None and artifact_path is not None:
        raise MlflowException(
            message="`artifact_path` cannot be specified if `artifact_uri` is specified",
            error_code=INVALID_PARAMETER_VALUE,
        )

    if dst_path is not None:
        pathlib.Path(dst_path).mkdir(exist_ok=True, parents=True)

    if artifact_uri is not None:
        return _download_artifact_from_uri(
            artifact_uri, output_path=dst_path, tracking_uri=tracking_uri, registry_uri=registry_uri
        )

    # Use `runs:/<run_id>/<artifact_path>` to download both run and model (if exists) artifacts
    if run_id and artifact_path:
        return _download_artifact_from_uri(
            f"runs:/{posixpath.join(run_id, artifact_path)}",
            output_path=dst_path,
            tracking_uri=tracking_uri,
            registry_uri=registry_uri,
        )

    artifact_path = artifact_path if artifact_path is not None else ""

    store = _get_store(store_uri=tracking_uri)
    artifact_uri = store.get_run(run_id).info.artifact_uri
    artifact_repo = get_artifact_repository(
        add_databricks_profile_info_to_artifact_uri(artifact_uri, tracking_uri),
        tracking_uri=tracking_uri,
        registry_uri=registry_uri,
    )
    return artifact_repo.download_artifacts(artifact_path, dst_path=dst_path)


def list_artifacts(
    artifact_uri: str | None = None,
    run_id: str | None = None,
    artifact_path: str | None = None,
    tracking_uri: str | None = None,
) -> list[FileInfo]:
    """List artifacts at the specified URI.

    Args:
        artifact_uri: URI pointing to the artifacts, such as
            ``"runs:/500cf58bee2b40a4a82861cc31a617b1/my_model.pkl"``,
            ``"models:/my_model/Production"``, or ``"s3://my_bucket/my/file.txt"``.
            Exactly one of ``artifact_uri`` or ``run_id`` must be specified.
        run_id: ID of the MLflow Run containing the artifacts. Exactly one of ``run_id`` or
            ``artifact_uri`` must be specified.
        artifact_path: (For use with ``run_id``) If specified, a path relative to the MLflow
            Run's root directory containing the artifacts to list.
        tracking_uri: The tracking URI to be used when list artifacts.

    Returns:
        List of artifacts as FileInfo listed directly under path.
    """
    if (run_id, artifact_uri).count(None) != 1:
        raise MlflowException.invalid_parameter_value(
            message="Exactly one of `run_id` or `artifact_uri` must be specified",
        )
    elif artifact_uri is not None and artifact_path is not None:
        raise MlflowException.invalid_parameter_value(
            message="`artifact_path` cannot be specified if `artifact_uri` is specified",
        )

    if artifact_uri is not None:
        root_uri, artifact_path = _get_root_uri_and_artifact_path(artifact_uri)
        return get_artifact_repository(
            artifact_uri=root_uri, tracking_uri=tracking_uri
        ).list_artifacts(artifact_path)

    # Use `runs:/<run_id>/<artifact_path>` to list both run and model (if exists) artifacts
    if run_id and artifact_path:
        return get_artifact_repository(
            artifact_uri=f"runs:/{run_id}", tracking_uri=tracking_uri
        ).list_artifacts(artifact_path)

    store = _get_store(store_uri=tracking_uri)
    artifact_uri = store.get_run(run_id).info.artifact_uri
    artifact_repo = get_artifact_repository(
        add_databricks_profile_info_to_artifact_uri(artifact_uri, tracking_uri),
        tracking_uri=tracking_uri,
    )
    return artifact_repo.list_artifacts(artifact_path)


def load_text(artifact_uri: str) -> str:
    """Loads the artifact contents as a string.

    Args:
        artifact_uri: Artifact location.

    Returns:
        The contents of the artifact as a string.

    .. code-block:: python
        :caption: Example

        import mlflow

        with mlflow.start_run() as run:
            artifact_uri = run.info.artifact_uri
            mlflow.log_text("This is a sentence", "file.txt")
            file_content = mlflow.artifacts.load_text(artifact_uri + "/file.txt")
            print(file_content)

    .. code-block:: text
        :caption: Output

        This is a sentence
    """
    with tempfile.TemporaryDirectory() as tmpdir:
        local_artifact = download_artifacts(artifact_uri, dst_path=tmpdir)
        with open(local_artifact) as local_artifact_fd:
            try:
                return str(local_artifact_fd.read())
            except Exception:
                raise MlflowException("Unable to form a str object from file content", BAD_REQUEST)


def load_dict(artifact_uri: str) -> dict[str, Any]:
    """Loads the artifact contents as a dictionary.

    Args:
        artifact_uri: artifact location.

    Returns:
        A dictionary.

    .. code-block:: python
      :caption: Example

      import mlflow

      with mlflow.start_run() as run:
          artifact_uri = run.info.artifact_uri
          mlflow.log_dict({"mlflow-version": "0.28", "n_cores": "10"}, "config.json")
          config_json = mlflow.artifacts.load_dict(artifact_uri + "/config.json")
          print(config_json)

    .. code-block:: text
      :caption: Output

      {'mlflow-version': '0.28', 'n_cores': '10'}
    """
    with tempfile.TemporaryDirectory() as tmpdir:
        local_artifact = download_artifacts(artifact_uri, dst_path=tmpdir)
        with open(local_artifact) as local_artifact_fd:
            try:
                return json.load(local_artifact_fd)
            except json.JSONDecodeError:
                raise MlflowException("Unable to form a JSON object from file content", BAD_REQUEST)


def load_image(artifact_uri: str):
    """Loads artifact contents as a ``PIL.Image.Image`` object

    Args:
        artifact_uri: Artifact location.

    Returns:
        A PIL.Image object.

    .. code-block:: python
        :caption: Example

        import mlflow
        from PIL import Image

        with mlflow.start_run() as run:
            image = Image.new("RGB", (100, 100))
            artifact_uri = run.info.artifact_uri
            mlflow.log_image(image, "image.png")
            image = mlflow.artifacts.load_image(artifact_uri + "/image.png")
            print(image)

    .. code-block:: text
        :caption: Output

        <PIL.PngImagePlugin.PngImageFile image mode=RGB size=100x100 at 0x11D2FA3D0>
    """
    try:
        from PIL import Image
    except ImportError as exc:
        raise ImportError(
            "`load_image` requires Pillow. Please install it via: pip install Pillow"
        ) from exc

    with tempfile.TemporaryDirectory() as tmpdir:
        local_artifact = download_artifacts(artifact_uri, dst_path=tmpdir)
        try:
            image_obj = Image.open(local_artifact)
            image_obj.load()
            return image_obj
        except Exception:
            raise MlflowException(
                "Unable to form a PIL Image object from file content", BAD_REQUEST
            )
```

--------------------------------------------------------------------------------

---[FILE: chat.py]---
Location: mlflow-master/mlflow/autogen/chat.py

```python
import logging
from typing import TYPE_CHECKING, Union

from opentelemetry.sdk.trace import Span

from mlflow.tracing.utils import set_span_chat_tools
from mlflow.types.chat import ChatTool

if TYPE_CHECKING:
    from autogen_core.tools import BaseTool, ToolSchema

_logger = logging.getLogger(__name__)


def log_tools(span: Span, tools: list[Union["BaseTool", "ToolSchema"]]):
    """
    Log Autogen tool definitions into the passed in span.

    Ref: https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/components/tools.html

    Args:
        span: The span to log the tools into.
        tools: A list of Autogen BaseTool.
    """
    from autogen_core.tools import BaseTool

    try:
        tools = [
            ChatTool(
                type="function",
                function=tool.schema if isinstance(tool, BaseTool) else tool,
            )
            for tool in tools
        ]
        set_span_chat_tools(span, tools)
    except Exception:
        _logger.debug(f"Failed to log tools to Span {span}.", exc_info=True)
```

--------------------------------------------------------------------------------

````
