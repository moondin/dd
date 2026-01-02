---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 234
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 234 of 991)

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

---[FILE: tracing.py]---
Location: mlflow-master/mlflow/claude_code/tracing.py

```python
"""MLflow tracing integration for Claude Code interactions."""

import json
import logging
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

import dateutil.parser

import mlflow
from mlflow.claude_code.config import (
    MLFLOW_TRACING_ENABLED,
    get_env_var,
)
from mlflow.entities import SpanType
from mlflow.environment_variables import (
    MLFLOW_EXPERIMENT_ID,
    MLFLOW_EXPERIMENT_NAME,
    MLFLOW_TRACKING_URI,
)
from mlflow.tracing.constant import TraceMetadataKey
from mlflow.tracing.trace_manager import InMemoryTraceManager
from mlflow.tracking.fluent import _get_trace_exporter

# ============================================================================
# CONSTANTS
# ============================================================================

# Used multiple times across the module
NANOSECONDS_PER_MS = 1e6
NANOSECONDS_PER_S = 1e9
MAX_PREVIEW_LENGTH = 1000

MESSAGE_TYPE_USER = "user"
MESSAGE_TYPE_ASSISTANT = "assistant"
CONTENT_TYPE_TEXT = "text"
CONTENT_TYPE_TOOL_USE = "tool_use"
CONTENT_TYPE_TOOL_RESULT = "tool_result"
MESSAGE_FIELD_CONTENT = "content"
MESSAGE_FIELD_TYPE = "type"
MESSAGE_FIELD_MESSAGE = "message"
MESSAGE_FIELD_TIMESTAMP = "timestamp"

# Custom logging level for Claude tracing
CLAUDE_TRACING_LEVEL = logging.WARNING - 5


# ============================================================================
# LOGGING AND SETUP
# ============================================================================


def setup_logging() -> logging.Logger:
    """Set up logging directory and return configured logger.

    Creates .claude/mlflow directory structure and configures file-based logging
    with INFO level. Prevents log propagation to avoid duplicate messages.
    """
    # Create logging directory structure
    log_dir = Path(os.getcwd()) / ".claude" / "mlflow"
    log_dir.mkdir(parents=True, exist_ok=True)

    logger = logging.getLogger(__name__)
    logger.handlers.clear()  # Remove any existing handlers

    # Configure file handler with timestamp formatting
    log_file = log_dir / "claude_tracing.log"
    file_handler = logging.FileHandler(log_file)
    file_handler.setFormatter(
        logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
    )
    logger.addHandler(file_handler)
    logging.addLevelName(CLAUDE_TRACING_LEVEL, "CLAUDE_TRACING")
    logger.setLevel(CLAUDE_TRACING_LEVEL)
    logger.propagate = False  # Prevent duplicate log messages

    return logger


_MODULE_LOGGER: logging.Logger | None = None


def get_logger() -> logging.Logger:
    """Get the configured module logger."""
    global _MODULE_LOGGER

    if _MODULE_LOGGER is None:
        _MODULE_LOGGER = setup_logging()
    return _MODULE_LOGGER


def setup_mlflow() -> None:
    """Configure MLflow tracking URI and experiment."""
    if not is_tracing_enabled():
        return

    # Get tracking URI from environment/settings
    mlflow.set_tracking_uri(get_env_var(MLFLOW_TRACKING_URI.name))

    # Set experiment if specified via environment variables
    experiment_id = get_env_var(MLFLOW_EXPERIMENT_ID.name)
    experiment_name = get_env_var(MLFLOW_EXPERIMENT_NAME.name)

    try:
        if experiment_id:
            mlflow.set_experiment(experiment_id=experiment_id)
        elif experiment_name:
            mlflow.set_experiment(experiment_name)
    except Exception as e:
        get_logger().warning("Failed to set experiment: %s", e)


def is_tracing_enabled() -> bool:
    """Check if MLflow Claude tracing is enabled via environment variable."""
    return get_env_var(MLFLOW_TRACING_ENABLED).lower() in ("true", "1", "yes")


# ============================================================================
# INPUT/OUTPUT UTILITIES
# ============================================================================


def read_hook_input() -> dict[str, Any]:
    """Read JSON input from stdin for Claude Code hook processing."""
    try:
        input_data = sys.stdin.read()
        return json.loads(input_data)
    except json.JSONDecodeError as e:
        raise json.JSONDecodeError(f"Failed to parse hook input: {e}", input_data, 0) from e


def read_transcript(transcript_path: str) -> list[dict[str, Any]]:
    """Read and parse a Claude Code conversation transcript from JSONL file."""
    with open(transcript_path, encoding="utf-8") as f:
        lines = f.readlines()
        return [json.loads(line) for line in lines if line.strip()]


def get_hook_response(error: str | None = None, **kwargs) -> dict[str, Any]:
    """Build hook response dictionary for Claude Code hook protocol.

    Args:
        error: Error message if hook failed, None if successful
        kwargs: Additional fields to include in response

    Returns:
        Hook response dictionary
    """
    if error is not None:
        return {"continue": False, "stopReason": error, **kwargs}
    return {"continue": True, **kwargs}


# ============================================================================
# TIMESTAMP AND CONTENT PARSING UTILITIES
# ============================================================================


def parse_timestamp_to_ns(timestamp: str | int | float | None) -> int | None:
    """Convert various timestamp formats to nanoseconds since Unix epoch.

    Args:
        timestamp: Can be ISO string, Unix timestamp (seconds/ms), or nanoseconds

    Returns:
        Nanoseconds since Unix epoch, or None if parsing fails
    """
    if not timestamp:
        return None

    if isinstance(timestamp, str):
        try:
            dt = dateutil.parser.parse(timestamp)
            return int(dt.timestamp() * NANOSECONDS_PER_S)
        except Exception:
            get_logger().warning("Could not parse timestamp: %s", timestamp)
            return None
    if isinstance(timestamp, (int, float)):
        if timestamp < 1e10:
            return int(timestamp * NANOSECONDS_PER_S)
        if timestamp < 1e13:
            return int(timestamp * NANOSECONDS_PER_MS)
        return int(timestamp)

    return None


def extract_text_content(content: str | list[dict[str, Any]] | Any) -> str:
    """Extract text content from Claude message content (handles both string and list formats).

    Args:
        content: Either a string or list of content parts from Claude API

    Returns:
        Extracted text content, empty string if none found
    """
    if isinstance(content, list):
        text_parts = [
            part.get(CONTENT_TYPE_TEXT, "")
            for part in content
            if isinstance(part, dict) and part.get(MESSAGE_FIELD_TYPE) == CONTENT_TYPE_TEXT
        ]
        return "\n".join(text_parts)
    if isinstance(content, str):
        return content
    return str(content)


def find_last_user_message_index(transcript: list[dict[str, Any]]) -> int | None:
    """Find the index of the last actual user message (ignoring tool results and empty messages).

    Args:
        transcript: List of conversation entries from Claude Code transcript

    Returns:
        Index of last user message, or None if not found
    """
    for i in range(len(transcript) - 1, -1, -1):
        entry = transcript[i]
        if entry.get(MESSAGE_FIELD_TYPE) == MESSAGE_TYPE_USER and not entry.get("toolUseResult"):
            msg = entry.get(MESSAGE_FIELD_MESSAGE, {})
            content = msg.get(MESSAGE_FIELD_CONTENT, "")

            if isinstance(content, list) and len(content) > 0:
                if (
                    isinstance(content[0], dict)
                    and content[0].get(MESSAGE_FIELD_TYPE) == CONTENT_TYPE_TOOL_RESULT
                ):
                    continue

            if isinstance(content, str) and "<local-command-stdout>" in content:
                continue

            if not content or (isinstance(content, str) and content.strip() == ""):
                continue

            return i
    return None


# ============================================================================
# TRANSCRIPT PROCESSING HELPERS
# ============================================================================


def _get_next_timestamp_ns(transcript: list[dict[str, Any]], current_idx: int) -> int | None:
    """Get the timestamp of the next entry for duration calculation."""
    for i in range(current_idx + 1, len(transcript)):
        if timestamp := transcript[i].get(MESSAGE_FIELD_TIMESTAMP):
            return parse_timestamp_to_ns(timestamp)
    return None


def _extract_content_and_tools(content: list[dict[str, Any]]) -> tuple[str, list[dict[str, Any]]]:
    """Extract text content and tool uses from assistant response content."""
    text_content = ""
    tool_uses = []

    if isinstance(content, list):
        for part in content:
            if isinstance(part, dict):
                if part.get(MESSAGE_FIELD_TYPE) == CONTENT_TYPE_TEXT:
                    text_content += part.get(CONTENT_TYPE_TEXT, "")
                elif part.get(MESSAGE_FIELD_TYPE) == CONTENT_TYPE_TOOL_USE:
                    tool_uses.append(part)

    return text_content, tool_uses


def _find_tool_results(transcript: list[dict[str, Any]], start_idx: int) -> dict[str, Any]:
    """Find tool results following the current assistant response.

    Returns a mapping from tool_use_id to tool result content.
    """
    tool_results = {}

    # Look for tool results in subsequent entries
    for i in range(start_idx + 1, len(transcript)):
        entry = transcript[i]
        if entry.get(MESSAGE_FIELD_TYPE) != MESSAGE_TYPE_USER:
            continue

        msg = entry.get(MESSAGE_FIELD_MESSAGE, {})
        content = msg.get(MESSAGE_FIELD_CONTENT, [])

        if isinstance(content, list):
            for part in content:
                if (
                    isinstance(part, dict)
                    and part.get(MESSAGE_FIELD_TYPE) == CONTENT_TYPE_TOOL_RESULT
                ):
                    tool_use_id = part.get("tool_use_id")
                    result_content = part.get("content", "")
                    if tool_use_id:
                        tool_results[tool_use_id] = result_content

        # Stop looking once we hit the next assistant response
        if entry.get(MESSAGE_FIELD_TYPE) == MESSAGE_TYPE_ASSISTANT:
            break

    return tool_results


def _reconstruct_conversation_messages(
    transcript: list[dict[str, Any]], end_idx: int
) -> list[dict[str, Any]]:
    """Reconstruct conversation messages in OpenAI format for LLM span inputs.

    This function builds the message array that represents what was sent to the LLM.
    It processes the transcript up to (but not including) end_idx to build the context.

    Args:
        transcript: List of conversation entries from Claude Code transcript
        end_idx: Index to stop at (exclusive) - typically the current assistant response

    Returns:
        List of messages in format [{"role": "system"|"user"|"assistant"|"tool", "content": "..."}]
    """
    messages = []

    for i in range(end_idx):
        entry = transcript[i]
        entry_type = entry.get(MESSAGE_FIELD_TYPE)
        msg = entry.get(MESSAGE_FIELD_MESSAGE, {})

        # Check for system role explicitly
        if msg.get("role") == "system":
            _process_system_entry(msg, messages)
        elif entry_type == MESSAGE_TYPE_USER:
            _process_user_entry(msg, messages)
        elif entry_type == MESSAGE_TYPE_ASSISTANT:
            _process_assistant_entry(msg, messages)

    return messages


def _process_system_entry(msg: dict[str, Any], messages: list[dict[str, Any]]) -> None:
    """Process a system entry from the transcript.

    Args:
        msg: The message object from the entry
        messages: The messages list to append to
    """
    if content := msg.get(MESSAGE_FIELD_CONTENT):
        text_content = extract_text_content(content)
        if text_content.strip():
            messages.append({"role": "system", "content": text_content})


def _process_user_entry(msg: dict[str, Any], messages: list[dict[str, Any]]) -> None:
    """Process a user entry from the transcript and add appropriate messages.

    User entries can contain:
    - Regular user messages (text)
    - Tool results from previous tool calls

    Args:
        msg: The message object from the entry
        messages: The messages list to append to
    """
    content = msg.get(MESSAGE_FIELD_CONTENT, [])

    # Handle list content (typical structure)
    if isinstance(content, list):
        # Use a buffer to preserve original message ordering
        message_buffer = []
        current_text_parts = []

        for part in content:
            if not isinstance(part, dict):
                continue

            part_type = part.get(MESSAGE_FIELD_TYPE)

            if part_type == CONTENT_TYPE_TOOL_RESULT:
                # If we have accumulated text, add it as a user message first
                if current_text_parts:
                    if combined_text := "\n".join(current_text_parts).strip():
                        message_buffer.append({"role": "user", "content": combined_text})
                    current_text_parts = []

                # Extract tool result information
                tool_id = part.get("tool_use_id")

                # Add tool results with proper "tool" role
                if result_content := part.get("content"):
                    tool_msg = {
                        "role": "tool",
                        "content": result_content,
                    }
                    if tool_id:
                        tool_msg["tool_use_id"] = tool_id
                    message_buffer.append(tool_msg)

            elif part_type == CONTENT_TYPE_TEXT:
                # Accumulate text content
                if text := part.get(CONTENT_TYPE_TEXT):
                    current_text_parts.append(text)

        # Add any remaining text content as user message
        if current_text_parts:
            if combined_text := "\n".join(current_text_parts).strip():
                message_buffer.append({"role": "user", "content": combined_text})

        # Add all messages in order to preserve sequence
        messages.extend(message_buffer)

    # Handle string content (simpler format)
    elif isinstance(content, str) and content.strip():
        messages.append({"role": "user", "content": content})


def _process_assistant_entry(msg: dict[str, Any], messages: list[dict[str, Any]]) -> None:
    """Process an assistant entry from the transcript and add to messages.

    Assistant entries represent previous LLM responses that are part of the conversation context.

    Args:
        msg: The message object from the entry
        messages: The messages list to append to
    """
    if content := msg.get(MESSAGE_FIELD_CONTENT):
        text_content = extract_text_content(content)
        if text_content.strip():
            messages.append({"role": "assistant", "content": text_content})


def _create_llm_and_tool_spans(
    parent_span, transcript: list[dict[str, Any]], start_idx: int
) -> None:
    """Create LLM and tool spans for assistant responses with proper timing."""
    llm_call_num = 0
    for i in range(start_idx, len(transcript)):
        entry = transcript[i]
        if entry.get(MESSAGE_FIELD_TYPE) != MESSAGE_TYPE_ASSISTANT:
            continue

        timestamp_ns = parse_timestamp_to_ns(entry.get(MESSAGE_FIELD_TIMESTAMP))

        # Calculate duration based on next timestamp or use default
        if next_timestamp_ns := _get_next_timestamp_ns(transcript, i):
            duration_ns = next_timestamp_ns - timestamp_ns
        else:
            duration_ns = int(1000 * NANOSECONDS_PER_MS)  # 1 second default

        msg = entry.get(MESSAGE_FIELD_MESSAGE, {})
        content = msg.get(MESSAGE_FIELD_CONTENT, [])
        usage = msg.get("usage", {})

        # First check if we have meaningful content to create a span for
        text_content, tool_uses = _extract_content_and_tools(content)

        # Only create LLM span if there's text content (no tools)
        llm_span = None
        if text_content and text_content.strip() and not tool_uses:
            llm_call_num += 1
            conversation_messages = _reconstruct_conversation_messages(transcript, i)

            llm_span = mlflow.start_span_no_context(
                name=f"llm_call_{llm_call_num}",
                parent_span=parent_span,
                span_type=SpanType.LLM,
                start_time_ns=timestamp_ns,
                inputs={
                    "model": msg.get("model", "unknown"),
                    "messages": conversation_messages,
                },
                attributes={
                    "model": msg.get("model", "unknown"),
                    "input_tokens": usage.get("input_tokens", 0),
                    "output_tokens": usage.get("output_tokens", 0),
                },
            )

            llm_span.set_outputs({"response": text_content})
            llm_span.end(end_time_ns=timestamp_ns + duration_ns)

        # Create tool spans with proportional timing and actual results
        if tool_uses:
            tool_results = _find_tool_results(transcript, i)
            tool_duration_ns = duration_ns // len(tool_uses)

            for idx, tool_use in enumerate(tool_uses):
                tool_start_ns = timestamp_ns + (idx * tool_duration_ns)
                tool_use_id = tool_use.get("id", "")
                tool_result = tool_results.get(tool_use_id, "No result found")

                tool_span = mlflow.start_span_no_context(
                    name=f"tool_{tool_use.get('name', 'unknown')}",
                    parent_span=parent_span,
                    span_type=SpanType.TOOL,
                    start_time_ns=tool_start_ns,
                    inputs=tool_use.get("input", {}),
                    attributes={
                        "tool_name": tool_use.get("name", "unknown"),
                        "tool_id": tool_use_id,
                    },
                )

                tool_span.set_outputs({"result": tool_result})
                tool_span.end(end_time_ns=tool_start_ns + tool_duration_ns)


def find_final_assistant_response(transcript: list[dict[str, Any]], start_idx: int) -> str | None:
    """Find the final text response from the assistant for trace preview.

    Args:
        transcript: List of conversation entries from Claude Code transcript
        start_idx: Index to start searching from (typically after last user message)

    Returns:
        Final assistant response text or None
    """
    final_response = None

    for i in range(start_idx, len(transcript)):
        entry = transcript[i]
        if entry.get(MESSAGE_FIELD_TYPE) != MESSAGE_TYPE_ASSISTANT:
            continue

        msg = entry.get(MESSAGE_FIELD_MESSAGE, {})
        content = msg.get(MESSAGE_FIELD_CONTENT, [])

        if isinstance(content, list):
            for part in content:
                if isinstance(part, dict) and part.get(MESSAGE_FIELD_TYPE) == CONTENT_TYPE_TEXT:
                    text = part.get(CONTENT_TYPE_TEXT, "")
                    if text.strip():
                        final_response = text

    return final_response


# ============================================================================
# MAIN TRANSCRIPT PROCESSING
# ============================================================================


def process_transcript(
    transcript_path: str, session_id: str | None = None
) -> mlflow.entities.Trace | None:
    """Process a Claude conversation transcript and create an MLflow trace with spans.

    Args:
        transcript_path: Path to the Claude Code transcript.jsonl file
        session_id: Optional session identifier, defaults to timestamp-based ID

    Returns:
        MLflow trace object if successful, None if processing fails
    """
    try:
        transcript = read_transcript(transcript_path)
        if not transcript:
            get_logger().warning("Empty transcript, skipping")
            return None

        last_user_idx = find_last_user_message_index(transcript)
        if last_user_idx is None:
            get_logger().warning("No user message found in transcript")
            return None

        last_user_entry = transcript[last_user_idx]
        last_user_prompt = last_user_entry.get(MESSAGE_FIELD_MESSAGE, {}).get(
            MESSAGE_FIELD_CONTENT, ""
        )

        if not session_id:
            session_id = f"claude-{datetime.now().strftime('%Y%m%d_%H%M%S')}"

        get_logger().log(CLAUDE_TRACING_LEVEL, "Creating MLflow trace for session: %s", session_id)

        conv_start_ns = parse_timestamp_to_ns(last_user_entry.get(MESSAGE_FIELD_TIMESTAMP))

        parent_span = mlflow.start_span_no_context(
            name="claude_code_conversation",
            inputs={"prompt": extract_text_content(last_user_prompt)},
            start_time_ns=conv_start_ns,
            span_type=SpanType.AGENT,
        )

        # Create spans for all assistant responses and tool uses
        _create_llm_and_tool_spans(parent_span, transcript, last_user_idx + 1)

        # Update trace with preview content and end timing
        final_response = find_final_assistant_response(transcript, last_user_idx + 1)
        user_prompt_text = extract_text_content(last_user_prompt)

        # Set trace previews for UI display
        try:
            with InMemoryTraceManager.get_instance().get_trace(
                parent_span.trace_id
            ) as in_memory_trace:
                if user_prompt_text:
                    in_memory_trace.info.request_preview = user_prompt_text[:MAX_PREVIEW_LENGTH]
                if final_response:
                    in_memory_trace.info.response_preview = final_response[:MAX_PREVIEW_LENGTH]
                in_memory_trace.info.trace_metadata = {
                    **in_memory_trace.info.trace_metadata,
                    TraceMetadataKey.TRACE_SESSION: session_id,
                    TraceMetadataKey.TRACE_USER: os.environ.get("USER", ""),
                    "mlflow.trace.working_directory": os.getcwd(),
                }
        except Exception as e:
            get_logger().warning("Failed to update trace metadata and previews: %s", e)

        # Calculate end time based on last entry or use default duration
        last_entry = transcript[-1] if transcript else last_user_entry
        conv_end_ns = parse_timestamp_to_ns(last_entry.get(MESSAGE_FIELD_TIMESTAMP))
        if not conv_end_ns or conv_end_ns <= conv_start_ns:
            conv_end_ns = conv_start_ns + int(10 * NANOSECONDS_PER_S)  # 10 second default

        parent_span.set_outputs(
            {"response": final_response or "Conversation completed", "status": "completed"}
        )
        parent_span.end(end_time_ns=conv_end_ns)

        try:
            # Use this to check if async trace logging is enabled
            if hasattr(_get_trace_exporter(), "_async_queue"):
                mlflow.flush_trace_async_logging()
        except Exception as e:
            # This is not a critical error, so we log it as debug
            get_logger().debug("Failed to flush trace async logging: %s", e)

        get_logger().log(CLAUDE_TRACING_LEVEL, "Created MLflow trace: %s", parent_span.trace_id)

        return mlflow.get_trace(parent_span.trace_id)

    except Exception as e:
        get_logger().error("Error processing transcript: %s", e, exc_info=True)
        return None
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/claude_code/__init__.py

```python
"""Claude Code integration for MLflow.

This module provides automatic tracing of Claude Code conversations to MLflow.

Usage:
    mlflow autolog claude [directory] [options]

After setup, use the regular 'claude' command and traces will be automatically captured.

To enable tracing for the Claude Agent SDK, use `mlflow.anthropic.autolog()`.

Example:

```python
import mlflow.anthropic
from claude_agent_sdk import ClaudeSDKClient

mlflow.anthropic.autolog()

async with ClaudeSDKClient() as client:
    await client.query("What is the capital of France?")

    async for message in client.receive_response():
        print(message)
```
"""
```

--------------------------------------------------------------------------------

---[FILE: crypto.py]---
Location: mlflow-master/mlflow/cli/crypto.py

```python
import os

import click

from mlflow.exceptions import MlflowException
from mlflow.tracking import _get_store
from mlflow.utils.crypto import (
    CRYPTO_KEK_PASSPHRASE_ENV_VAR,
    CRYPTO_KEK_VERSION_ENV_VAR,
    KEKManager,
    rotate_secret_encryption,
)


@click.group("crypto", help="Commands for managing MLflow's cryptographic passphrase.")
def commands():
    """
    MLflow cryptographic management CLI. Allows for the management of the envelope
    encryption KEK passphrase that is used for encryption and decryption with KEK/DEK for the
    secure storage of API Keys and associated authentication sensitive information.
    """


@commands.command(
    "rotate-kek", help="Rotate the KEK passphrase that is used for encryption and decryption."
)
@click.option(
    "--new-passphrase",
    required=True,
    prompt=True,
    hide_input=True,
    confirmation_prompt=True,
    help="New KEK passphrase to use for encrypting and decrypting sensitive data.",
)
@click.option(
    "--backend-store-uri",
    envvar="MLFLOW_BACKEND_STORE_URI",
    default=None,
    help="URI of the backend store. If not specified, uses MLFLOW_TRACKING_URI.",
)
@click.option(
    "--yes",
    "-y",
    is_flag=True,
    default=False,
    help="Skip confirmation prompt.",
)
def rotate_kek(new_passphrase, backend_store_uri, yes):
    """
    Rotate the KEK passphrase for all stored encrypted sensitive information in the database.

    This command re-wraps all DEKs with a new KEK derived from the provided
    passphrase. The secret values themselves are not re-encrypted, making this
    operation efficient even for large numbers of secrets.

    CRITICAL: This CLI cannot set environment variables for your server. You MUST
    manually update BOTH environment variables in your deployment configuration:
    - MLFLOW_CRYPTO_KEK_PASSPHRASE (to new passphrase)
    - MLFLOW_CRYPTO_KEK_VERSION (incremented by 1)

    Failure to update both will cause decryption failures!

    Note that this operation requires the MLflow server to be shut down to ensure
    atomicity and prevent concurrent operations during rotation. The workflow is:

    1. Shut down the MLflow server
    2. Set MLFLOW_CRYPTO_KEK_PASSPHRASE to the OLD passphrase (if not already set)
    3. Set MLFLOW_CRYPTO_KEK_VERSION to the CURRENT version (if not already set)
    4. Run this command with the NEW passphrase
    5. Update your deployment config with BOTH new values:
       - MLFLOW_CRYPTO_KEK_PASSPHRASE='new-passphrase'
       - MLFLOW_CRYPTO_KEK_VERSION='<incremented>'
    6. Restart the MLflow server

    .. code-block:: bash

        # Step 1: Stop server (or ctrl-c if running in foreground)
        $ systemctl stop mlflow-server

        # Step 2-3: Set current env vars (if needed)
        $ export MLFLOW_CRYPTO_KEK_PASSPHRASE="old-passphrase"
        $ export MLFLOW_CRYPTO_KEK_VERSION="1"

        # Step 4: Run rotation
        $ mlflow crypto rotate-kek --new-passphrase "new-passphrase"

        # Step 5: Update deployment config (example for Kubernetes)
        $ kubectl create secret generic mlflow-kek \\
            --from-literal=passphrase='new-passphrase' \\
            --from-literal=version='2' \\
            --dry-run=client -o yaml | kubectl apply -f -

        # Step 6: Restart server
        $ systemctl start mlflow-server
    """
    old_passphrase = os.getenv(CRYPTO_KEK_PASSPHRASE_ENV_VAR)
    if not old_passphrase:
        raise MlflowException(
            "MLFLOW_CRYPTO_KEK_PASSPHRASE environment variable must be set to the "
            "current (old) passphrase before running KEK rotation.\n\n"
            "Example:\n"
            "  export MLFLOW_CRYPTO_KEK_PASSPHRASE='current-passphrase'\n"
            "  export MLFLOW_CRYPTO_KEK_VERSION='1'\n"
            "  mlflow crypto rotate-kek --new-passphrase 'new-passphrase'"
        )

    old_version = int(os.getenv(CRYPTO_KEK_VERSION_ENV_VAR, "1"))
    new_version = old_version + 1

    if not yes:
        click.echo("\n⚠️  WARNING: KEK Rotation Operation\n", err=True)
        click.echo("This operation will:", err=True)
        click.echo("  - Re-wrap all encryption DEKs with a new KEK", err=True)
        click.echo(
            f"  - Update all encrypted data from kek_version {old_version} to {new_version}",
            err=True,
        )
        click.echo("  - Require updating BOTH environment variables after completion:", err=True)
        click.echo("    * MLFLOW_CRYPTO_KEK_PASSPHRASE='<new-passphrase>'", err=True)
        click.echo(f"    * MLFLOW_CRYPTO_KEK_VERSION='{new_version}'\n", err=True)
        click.echo(
            "IMPORTANT: Ensure the MLflow server is shut down before proceeding.\n", err=True
        )

        if not click.confirm("Continue with KEK rotation?"):
            click.echo("KEK rotation cancelled.", err=True)
            return

    click.echo(f"Creating KEK managers (v{old_version} -> v{new_version})...")
    try:
        old_kek_manager = KEKManager(passphrase=old_passphrase, kek_version=old_version)
        new_kek_manager = KEKManager(passphrase=new_passphrase, kek_version=new_version)
    except Exception as e:
        raise MlflowException(f"Failed to create KEK managers: {e}") from e

    click.echo("Connecting to backend store...")
    try:
        store = _get_store(backend_store_uri)
    except Exception as e:
        raise MlflowException(f"Failed to connect to backend store: {e}") from e

    click.echo("Retrieving encrypted keys to rotate...")
    try:
        from mlflow.store.tracking.dbmodels.models import SqlGatewaySecret

        with store.ManagedSessionMaker() as session:
            secrets = (
                session.query(SqlGatewaySecret)
                .filter(SqlGatewaySecret.kek_version == old_version)
                .all()
            )
            total_secrets = len(secrets)

            if total_secrets == 0:
                click.echo(
                    f"✓ No secrets found with kek_version={old_version}. Nothing to rotate.",
                    err=True,
                )
                return

            click.echo(f"Found {total_secrets} secrets to rotate.\n")

            rotated_count = 0

            with click.progressbar(
                secrets, label="Rotating secrets", show_pos=True, show_percent=True
            ) as progress:
                for secret in progress:
                    try:
                        result = rotate_secret_encryption(
                            secret.encrypted_value,
                            secret.wrapped_dek,
                            old_kek_manager,
                            new_kek_manager,
                        )

                        secret.wrapped_dek = result.wrapped_dek
                        secret.kek_version = new_version

                        rotated_count += 1

                    except Exception as e:
                        click.echo(
                            f"\n✗ Failed to rotate encryption key {secret.secret_id}: {e}", err=True
                        )
                        session.rollback()
                        raise MlflowException(
                            f"KEK rotation failed at encrypted entry {secret.secret_id}. "
                            "No changes were made. Fix the issue and re-run the command."
                        ) from e

            session.commit()

            key_word = "key" if rotated_count == 1 else "keys"
            click.echo(
                f"\n✓ Successfully rotated {rotated_count} encryption {key_word} "
                f"from KEK v{old_version} to v{new_version}\n"
            )
            click.echo("=" * 80)
            click.echo("CRITICAL: Update BOTH environment variables in your deployment config:")
            click.echo("=" * 80)
            click.echo("\n  MLFLOW_CRYPTO_KEK_PASSPHRASE='<new-passphrase>'")
            click.echo(f"  MLFLOW_CRYPTO_KEK_VERSION='{new_version}'")
            click.echo("\nFailure to update BOTH variables will cause decryption failures!\n")

    except Exception as e:
        raise MlflowException(f"KEK rotation failed: {e}") from e
```

--------------------------------------------------------------------------------

---[FILE: eval.py]---
Location: mlflow-master/mlflow/cli/eval.py

```python
"""
CLI commands for evaluating traces with scorers.
"""

import json
from typing import Literal

import click
import pandas as pd

import mlflow
from mlflow.cli.genai_eval_utils import (
    extract_assessments_from_results,
    format_table_output,
    resolve_scorers,
)
from mlflow.entities import Trace
from mlflow.genai.evaluation import evaluate
from mlflow.tracking import MlflowClient
from mlflow.utils.string_utils import _create_table


def _gather_traces(trace_ids: str, experiment_id: str) -> list[Trace]:
    """
    Gather and validate traces from the tracking store.

    Args:
        trace_ids: Comma-separated list of trace IDs to gather
        experiment_id: Expected experiment ID for all traces

    Returns:
        List of Trace objects

    Raises:
        click.UsageError: If any trace is not found or belongs to wrong experiment
    """
    trace_id_list = [tid.strip() for tid in trace_ids.split(",")]
    client = MlflowClient()
    traces = []

    for trace_id in trace_id_list:
        try:
            trace = client.get_trace(trace_id, display=False)
        except Exception as e:
            raise click.UsageError(f"Failed to get trace '{trace_id}': {e}")

        if trace is None:
            raise click.UsageError(f"Trace with ID '{trace_id}' not found")

        if trace.info.experiment_id != experiment_id:
            raise click.UsageError(
                f"Trace '{trace_id}' belongs to experiment '{trace.info.experiment_id}', "
                f"not the specified experiment '{experiment_id}'"
            )

        traces.append(trace)

    return traces


def evaluate_traces(
    experiment_id: str,
    trace_ids: str,
    scorers: str,
    output_format: Literal["table", "json"] = "table",
) -> None:
    """
    Evaluate traces with specified scorers and output results.

    Args:
        experiment_id: The experiment ID to use for evaluation
        trace_ids: Comma-separated list of trace IDs to evaluate
        scorers: Comma-separated list of scorer names
        output_format: Output format ('table' or 'json')
    """
    mlflow.set_experiment(experiment_id=experiment_id)

    traces = _gather_traces(trace_ids, experiment_id)
    traces_df = pd.DataFrame([{"trace_id": t.info.trace_id, "trace": t} for t in traces])

    scorer_names = [name.strip() for name in scorers.split(",")]
    resolved_scorers = resolve_scorers(scorer_names, experiment_id)

    trace_count = len(traces)
    scorers_list = ", ".join(scorer_names)
    if trace_count == 1:
        trace_id = traces[0].info.trace_id
        click.echo(f"Evaluating trace {trace_id} with scorers: {scorers_list}...")
    else:
        click.echo(f"Evaluating {trace_count} traces with scorers: {scorers_list}...")

    try:
        results = evaluate(data=traces_df, scorers=resolved_scorers)
        evaluation_run_id = results.run_id
    except Exception as e:
        raise click.UsageError(f"Evaluation failed: {e}")

    results_df = results.result_df
    output_data = extract_assessments_from_results(results_df, evaluation_run_id)

    if output_format == "json":
        # Convert EvalResult objects to dicts for JSON serialization
        json_data = [
            {
                "trace_id": result.trace_id,
                "assessments": [
                    {
                        "name": assessment.name,
                        "result": assessment.result,
                        "rationale": assessment.rationale,
                        "error": assessment.error,
                    }
                    for assessment in result.assessments
                ],
            }
            for result in output_data
        ]
        if len(json_data) == 1:
            click.echo(json.dumps(json_data[0], indent=2))
        else:
            click.echo(json.dumps(json_data, indent=2))
    else:
        table_output = format_table_output(output_data)
        # Extract string values from Cell objects for table display
        table_data = [[cell.value for cell in row] for row in table_output.rows]
        # Add new line in the output before the final result.
        click.echo("")
        click.echo(_create_table(table_data, headers=table_output.headers))
```

--------------------------------------------------------------------------------

````
