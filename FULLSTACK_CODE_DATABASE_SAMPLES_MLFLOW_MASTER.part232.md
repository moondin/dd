---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 232
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 232 of 991)

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

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/autogen/__init__.py
Signals: Pydantic

```python
import logging
from typing import Any

from pydantic import BaseModel

import mlflow
from mlflow.autogen.chat import log_tools
from mlflow.entities import SpanType
from mlflow.telemetry.events import AutologgingEvent
from mlflow.telemetry.track import _record_event
from mlflow.tracing.constant import SpanAttributeKey, TokenUsageKey
from mlflow.tracing.utils import construct_full_inputs
from mlflow.utils.autologging_utils import (
    autologging_integration,
    get_autologging_config,
    safe_patch,
)

_logger = logging.getLogger(__name__)
FLAVOR_NAME = "autogen"


@autologging_integration(FLAVOR_NAME)
def autolog(
    log_traces: bool = True,
    disable: bool = False,
    silent: bool = False,
):
    """
    Enables (or disables) and configures autologging for AutoGen flavor.
    Due to its patch design, this method needs to be called after importing AutoGen classes.

    Args:
        log_traces: If ``True``, traces are logged for AutoGen models.
            If ``False``, no traces are collected during inference. Default to ``True``.
        disable: If ``True``, disables the AutoGen autologging. Default to ``False``.
        silent: If ``True``, suppress all event logs and warnings from MLflow during AutoGen
            autologging. If ``False``, show all events and warnings.

    Example:

    .. code-block:: python
        :caption: Example

        import mlflow
        from autogen_agentchat.agents import AssistantAgent
        from autogen_ext.models.openai import OpenAIChatCompletionClient

        mlflow.autogen.autolog()
        agent = AssistantAgent("assistant", OpenAIChatCompletionClient(model="gpt-4o-mini"))
        result = await agent.run(task="Say 'Hello World!'")
        print(result)
    """
    from autogen_agentchat.agents import BaseChatAgent
    from autogen_core.models import ChatCompletionClient

    async def patched_completion(original, self, *args, **kwargs):
        if not get_autologging_config(FLAVOR_NAME, "log_traces"):
            return await original(self, *args, **kwargs)
        else:
            name = f"{self.__class__.__name__}.{original.__name__}"
            with mlflow.start_span(name, span_type=SpanType.LLM) as span:
                inputs = construct_full_inputs(original, self, *args, **kwargs)
                span.set_inputs(
                    {key: _convert_value_to_dict(value) for key, value in inputs.items()}
                )
                span.set_attribute(SpanAttributeKey.MESSAGE_FORMAT, "autogen")

                if tools := inputs.get("tools"):
                    log_tools(span, tools)

                outputs = await original(self, *args, **kwargs)

                if usage := _parse_usage(outputs):
                    span.set_attribute(SpanAttributeKey.CHAT_USAGE, usage)

                span.set_outputs(_convert_value_to_dict(outputs))

                return outputs

    async def patched_agent(original, self, *args, **kwargs):
        if not get_autologging_config(FLAVOR_NAME, "log_traces"):
            return await original(self, *args, **kwargs)
        else:
            agent_name = getattr(self, "name", self.__class__.__name__)
            name = f"{agent_name}.{original.__name__}"
            with mlflow.start_span(name, span_type=SpanType.AGENT) as span:
                inputs = construct_full_inputs(original, self, *args, **kwargs)
                span.set_inputs(
                    {key: _convert_value_to_dict(value) for key, value in inputs.items()}
                )

                if tools := getattr(self, "_tools", None):
                    log_tools(span, tools)

                outputs = await original(self, *args, **kwargs)

                span.set_outputs(_convert_value_to_dict(outputs))

                return outputs

    for cls in BaseChatAgent.__subclasses__():
        safe_patch(FLAVOR_NAME, cls, "run", patched_agent)
        safe_patch(FLAVOR_NAME, cls, "on_messages", patched_agent)

    for cls in _get_all_subclasses(ChatCompletionClient):
        safe_patch(FLAVOR_NAME, cls, "create", patched_completion)

    _record_event(
        AutologgingEvent, {"flavor": FLAVOR_NAME, "log_traces": log_traces, "disable": disable}
    )


def _convert_value_to_dict(value):
    # BaseChatMessage does not contain content and type attributes
    return value.model_dump(serialize_as_any=True) if isinstance(value, BaseModel) else value


def _get_all_subclasses(cls):
    """Get all subclasses recursively"""
    all_subclasses = []

    for subclass in cls.__subclasses__():
        all_subclasses.append(subclass)
        all_subclasses.extend(_get_all_subclasses(subclass))

    return all_subclasses


def _parse_usage(output: Any) -> dict[str, int] | None:
    try:
        if usage := getattr(output, "usage", None):
            return {
                TokenUsageKey.INPUT_TOKENS: usage.prompt_tokens,
                TokenUsageKey.OUTPUT_TOKENS: usage.completion_tokens,
                TokenUsageKey.TOTAL_TOKENS: usage.prompt_tokens + usage.completion_tokens,
            }
    except Exception as e:
        _logger.debug(f"Failed to parse token usage from output: {e}")
    return None
```

--------------------------------------------------------------------------------

---[FILE: client.py]---
Location: mlflow-master/mlflow/azure/client.py

```python
"""
This module provides utilities for performing Azure Blob Storage operations without requiring
the heavyweight azure-storage-blob library dependency
"""

import logging
import urllib
from copy import deepcopy

from mlflow.utils import rest_utils
from mlflow.utils.file_utils import read_chunk

_logger = logging.getLogger(__name__)
_PUT_BLOCK_HEADERS = {
    "x-ms-blob-type": "BlockBlob",
}


def put_adls_file_creation(sas_url, headers):
    """Performs an ADLS Azure file create `Put` operation
    (https://docs.microsoft.com/en-us/rest/api/storageservices/datalakestoragegen2/path/create)

    Args:
        sas_url: A shared access signature URL referring to the Azure ADLS server
            to which the file creation command should be issued.
        headers: Additional headers to include in the Put request body.
    """
    request_url = _append_query_parameters(sas_url, {"resource": "file"})

    request_headers = {}
    for name, value in headers.items():
        if _is_valid_adls_put_header(name):
            request_headers[name] = value
        else:
            _logger.debug("Removed unsupported '%s' header for ADLS Gen2 Put operation", name)

    with rest_utils.cloud_storage_http_request(
        "put", request_url, headers=request_headers
    ) as response:
        rest_utils.augmented_raise_for_status(response)


def patch_adls_file_upload(sas_url, local_file, start_byte, size, position, headers, is_single):
    """
    Performs an ADLS Azure file create `Patch` operation
    (https://docs.microsoft.com/en-us/rest/api/storageservices/datalakestoragegen2/path/update)

    Args:
        sas_url: A shared access signature URL referring to the Azure ADLS server
            to which the file update command should be issued.
        local_file: The local file to upload
        start_byte: The starting byte of the local file to upload
        size: The number of bytes to upload
        position: Positional offset of the data in the Patch request
        headers: Additional headers to include in the Patch request body
        is_single: Whether this is the only patch operation for this file
    """
    new_params = {"action": "append", "position": str(position)}
    if is_single:
        new_params["flush"] = "true"
    request_url = _append_query_parameters(sas_url, new_params)

    request_headers = {}
    for name, value in headers.items():
        if _is_valid_adls_patch_header(name):
            request_headers[name] = value
        else:
            _logger.debug("Removed unsupported '%s' header for ADLS Gen2 Patch operation", name)

    data = read_chunk(local_file, size, start_byte)
    with rest_utils.cloud_storage_http_request(
        "patch", request_url, data=data, headers=request_headers
    ) as response:
        rest_utils.augmented_raise_for_status(response)


def patch_adls_flush(sas_url, position, headers):
    """Performs an ADLS Azure file flush `Patch` operation
    (https://docs.microsoft.com/en-us/rest/api/storageservices/datalakestoragegen2/path/update)

    Args:
        sas_url: A shared access signature URL referring to the Azure ADLS server
            to which the file update command should be issued.
        position: The final size of the file to flush.
        headers: Additional headers to include in the Patch request body.

    """
    request_url = _append_query_parameters(sas_url, {"action": "flush", "position": str(position)})

    request_headers = {}
    for name, value in headers.items():
        if _is_valid_adls_put_header(name):
            request_headers[name] = value
        else:
            _logger.debug("Removed unsupported '%s' header for ADLS Gen2 Patch operation", name)

    with rest_utils.cloud_storage_http_request(
        "patch", request_url, headers=request_headers
    ) as response:
        rest_utils.augmented_raise_for_status(response)


def put_block(sas_url, block_id, data, headers):
    """
    Performs an Azure `Put Block` operation
    (https://docs.microsoft.com/en-us/rest/api/storageservices/put-block)

    Args:
        sas_url: A shared access signature URL referring to the Azure Block Blob
            to which the specified data should be staged.
        block_id: A base64-encoded string identifying the block.
        data: Data to include in the Put Block request body.
        headers: Additional headers to include in the Put Block request body
            (the `x-ms-blob-type` header is always included automatically).
    """
    request_url = _append_query_parameters(sas_url, {"comp": "block", "blockid": block_id})

    request_headers = deepcopy(_PUT_BLOCK_HEADERS)
    for name, value in headers.items():
        if _is_valid_put_block_header(name):
            request_headers[name] = value
        else:
            _logger.debug("Removed unsupported '%s' header for Put Block operation", name)

    with rest_utils.cloud_storage_http_request(
        "put", request_url, data=data, headers=request_headers
    ) as response:
        rest_utils.augmented_raise_for_status(response)


def put_block_list(sas_url, block_list, headers):
    """Performs an Azure `Put Block List` operation
    (https://docs.microsoft.com/en-us/rest/api/storageservices/put-block-list)

    Args:
        sas_url: A shared access signature URL referring to the Azure Block Blob
            to which the specified data should be staged.
        block_list: A list of uncommitted base64-encoded string block IDs to commit. For
            more information, see
            https://docs.microsoft.com/en-us/rest/api/storageservices/put-block-list.
        headers: Headers to include in the Put Block request body.

    """
    request_url = _append_query_parameters(sas_url, {"comp": "blocklist"})
    data = _build_block_list_xml(block_list)

    request_headers = {}
    for name, value in headers.items():
        if _is_valid_put_block_list_header(name):
            request_headers[name] = value
        else:
            _logger.debug("Removed unsupported '%s' header for Put Block List operation", name)

    with rest_utils.cloud_storage_http_request(
        "put", request_url, data=data, headers=request_headers
    ) as response:
        rest_utils.augmented_raise_for_status(response)


def _append_query_parameters(url, parameters):
    parsed_url = urllib.parse.urlparse(url)
    query_dict = dict(urllib.parse.parse_qsl(parsed_url.query))
    query_dict.update(parameters)
    new_query = urllib.parse.urlencode(query_dict)
    new_url_components = parsed_url._replace(query=new_query)
    return urllib.parse.urlunparse(new_url_components)


def _build_block_list_xml(block_list):
    xml = '<?xml version="1.0" encoding="utf-8"?>\n<BlockList>\n'
    for block_id in block_list:
        # Because block IDs are base64-encoded and base64 strings do not contain
        # XML special characters, we can safely insert the block ID directly into
        # the XML document
        xml += f"<Uncommitted>{block_id}</Uncommitted>\n"
    xml += "</BlockList>"
    return xml


def _is_valid_put_block_list_header(header_name):
    """
    Returns:
        True if the specified header name is a valid header for the Put Block List operation,
        False otherwise. For a list of valid headers, see https://docs.microsoft.com/en-us/
        rest/api/storageservices/put-block-list#request-headers and https://docs.microsoft.com/
        en-us/rest/api/storageservices/
        specifying-conditional-headers-for-blob-service-operations#Subheading1.
    """
    return header_name.startswith("x-ms-meta-") or header_name in {
        "Authorization",
        "Date",
        "x-ms-date",
        "x-ms-version",
        "Content-Length",
        "Content-MD5",
        "x-ms-content-crc64",
        "x-ms-blob-cache-control",
        "x-ms-blob-content-type",
        "x-ms-blob-content-encoding",
        "x-ms-blob-content-language",
        "x-ms-blob-content-md5",
        "x-ms-encryption-scope",
        "x-ms-tags",
        "x-ms-lease-id",
        "x-ms-client-request-id",
        "x-ms-blob-content-disposition",
        "x-ms-access-tier",
        "If-Modified-Since",
        "If-Unmodified-Since",
        "If-Match",
        "If-None-Match",
    }


def _is_valid_put_block_header(header_name):
    """
    Returns:
        True if the specified header name is a valid header for the Put Block operation, False
        otherwise. For a list of valid headers, see
        https://docs.microsoft.com/en-us/rest/api/storageservices/put-block#request-headers and
        https://docs.microsoft.com/en-us/rest/api/storageservices/put-block#
        request-headers-customer-provided-encryption-keys.
    """
    return header_name in {
        "Authorization",
        "x-ms-date",
        "x-ms-version",
        "Content-Length",
        "Content-MD5",
        "x-ms-content-crc64",
        "x-ms-encryption-scope",
        "x-ms-lease-id",
        "x-ms-client-request-id",
        "x-ms-encryption-key",
        "x-ms-encryption-key-sha256",
        "x-ms-encryption-algorithm",
    }


def _is_valid_adls_put_header(header_name):
    """
    Returns:
        True if the specified header name is a valid header for the ADLS Put operation, False
        otherwise. For a list of valid headers, see
        https://docs.microsoft.com/en-us/rest/api/storageservices/datalakestoragegen2/path/create
    """
    return header_name in {
        "Cache-Control",
        "Content-Encoding",
        "Content-Language",
        "Content-Disposition",
        "x-ms-cache-control",
        "x-ms-content-type",
        "x-ms-content-encoding",
        "x-ms-content-language",
        "x-ms-content-disposition",
        "x-ms-rename-source",
        "x-ms-lease-id",
        "x-ms-properties",
        "x-ms-permissions",
        "x-ms-umask",
        "x-ms-owner",
        "x-ms-group",
        "x-ms-acl",
        "x-ms-proposed-lease-id",
        "x-ms-expiry-option",
        "x-ms-expiry-time",
        "If-Match",
        "If-None-Match",
        "If-Modified-Since",
        "If-Unmodified-Since",
        "x-ms-source-if-match",
        "x-ms-source-if-none-match",
        "x-ms-source-if-modified-since",
        "x-ms-source-if-unmodified-since",
        "x-ms-encryption-key",
        "x-ms-encryption-key-sha256",
        "x-ms-encryption-algorithm",
        "x-ms-encryption-context",
        "x-ms-client-request-id",
        "x-ms-date",
        "x-ms-version",
    }


def _is_valid_adls_patch_header(header_name):
    """
    Returns:
        True if the specified header name is a valid header for the ADLS Patch operation, False
        otherwise. For a list of valid headers, see
        https://docs.microsoft.com/en-us/rest/api/storageservices/datalakestoragegen2/path/update
    """
    return header_name in {
        "Content-Length",
        "Content-MD5",
        "x-ms-lease-id",
        "x-ms-cache-control",
        "x-ms-content-type",
        "x-ms-content-disposition",
        "x-ms-content-encoding",
        "x-ms-content-language",
        "x-ms-content-md5",
        "x-ms-properties",
        "x-ms-owner",
        "x-ms-group",
        "x-ms-permissions",
        "x-ms-acl",
        "If-Match",
        "If-None-Match",
        "If-Modified-Since",
        "If-Unmodified-Since",
        "x-ms-encryption-key",
        "x-ms-encryption-key-sha256",
        "x-ms-encryption-algorithm",
        "x-ms-encryption-context",
        "x-ms-client-request-id",
        "x-ms-date",
        "x-ms-version",
    }
```

--------------------------------------------------------------------------------

---[FILE: chat.py]---
Location: mlflow-master/mlflow/bedrock/chat.py

```python
from typing import Any

from mlflow.types.chat import ChatTool, FunctionToolDefinition


def convert_tool_to_mlflow_chat_tool(tool: dict[str, Any]) -> ChatTool:
    """
    Convert Bedrock tool definition into MLflow's standard format (OpenAI compatible).

    Ref: https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Tool.html

    Args:
        tool: A dictionary represents a single tool definition in the input request.

    Returns:
        ChatTool: MLflow's standard tool definition object.
    """
    tool_spec = tool["toolSpec"]
    return ChatTool(
        type="function",
        function=FunctionToolDefinition(
            name=tool_spec["name"],
            description=tool_spec.get("description"),
            parameters=tool_spec["inputSchema"].get("json"),
        ),
    )
```

--------------------------------------------------------------------------------

---[FILE: stream.py]---
Location: mlflow-master/mlflow/bedrock/stream.py

```python
import json
import logging
from typing import Any

from botocore.eventstream import EventStream

from mlflow.bedrock.utils import (
    capture_exception,
    parse_complete_token_usage_from_response,
    parse_partial_token_usage_from_response,
)
from mlflow.entities.span import LiveSpan
from mlflow.entities.span_event import SpanEvent
from mlflow.tracing.constant import SpanAttributeKey

_logger = logging.getLogger(__name__)


class BaseEventStreamWrapper:
    """
    A wrapper class for a event stream to record events and accumulated response
    in an MLflow span if possible.

    A span should be ended when the stream is exhausted rather than when it is created.

    Args:
        stream: The original event stream to wrap.
        span: The span to record events and response in.
        inputs: The inputs to the converse API.
    """

    def __init__(
        self,
        stream: EventStream,
        span: LiveSpan,
        inputs: dict[str, Any] | None = None,
    ):
        self._stream = stream
        self._span = span
        self._inputs = inputs

    def __iter__(self):
        for event in self._stream:
            self._handle_event(self._span, event)
            yield event

        # End the span when the stream is exhausted
        self._close()

    def __getattr__(self, attr):
        """Delegate all other attributes to the original stream."""
        return getattr(self._stream, attr)

    def _handle_event(self, span, event):
        """Process a single event from the stream."""
        raise NotImplementedError

    def _close(self):
        """End the span and run any finalization logic."""
        raise NotImplementedError

    @capture_exception("Failed to handle event for the stream")
    def _end_span(self):
        """End the span."""
        self._span.end()


def _extract_token_usage_from_chunk(chunk: dict[str, Any]) -> dict[str, int] | None:
    """Extract partial token usage from streaming chunk.

    Args:
        chunk: A single streaming chunk from Bedrock API.

    Returns:
        Token usage dictionary with standardized keys, or None if no usage found.
    """
    try:
        usage = (
            chunk.get("message", {}).get("usage")
            if chunk.get("type") == "message_start"
            else chunk.get("usage")
        )
        if isinstance(usage, dict):
            return parse_partial_token_usage_from_response(usage)
        return None
    except (KeyError, TypeError, AttributeError) as e:
        _logger.debug(f"Failed to extract token usage from chunk: {e}")
        return None


class InvokeModelStreamWrapper(BaseEventStreamWrapper):
    """A wrapper class for a event stream returned by the InvokeModelWithResponseStream API.

    This wrapper intercepts streaming events from Bedrock's invoke_model_with_response_stream
    API and accumulates token usage information across multiple chunks. It buffers partial
    token usage data as it arrives and sets the final aggregated usage on the span when
    the stream is exhausted.

    Attributes:
        _usage_buffer (dict): Internal buffer to accumulate token usage data from
            streaming chunks. Uses TokenUsageKey constants as keys.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._usage_buffer = {}

    def _buffer_token_usage_from_chunk(self, chunk: dict[str, Any]):
        """Buffer token usage from streaming chunk."""
        if usage_data := _extract_token_usage_from_chunk(chunk):
            for token_key, token_value in usage_data.items():
                self._usage_buffer[token_key] = token_value

    @capture_exception("Failed to handle event for the stream")
    def _handle_event(self, span, event):
        """Process streaming event and buffer token usage."""
        chunk = json.loads(event["chunk"]["bytes"])
        self._span.add_event(SpanEvent(name=chunk["type"], attributes={"json": json.dumps(chunk)}))

        # Buffer usage information from streaming chunks
        self._buffer_token_usage_from_chunk(chunk)

    def _close(self):
        """Set accumulated token usage on span and end it."""
        # Build a standardized usage dict from buffered data using the utility function
        if usage_data := parse_complete_token_usage_from_response(self._usage_buffer):
            self._span.set_attribute(SpanAttributeKey.CHAT_USAGE, usage_data)

        self._end_span()


class ConverseStreamWrapper(BaseEventStreamWrapper):
    """A wrapper class for a event stream returned by the ConverseStream API."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._response_builder = _ConverseMessageBuilder()

    def __getattr__(self, attr):
        """Delegate all other attributes to the original stream."""
        return getattr(self._stream, attr)

    @capture_exception("Failed to handle event for the stream")
    def _handle_event(self, span, event):
        """
        Process a single event from the stream.

        Refer to the following documentation for the event format:
        https://boto3.amazonaws.com/v1/documentation/api/1.35.8/reference/services/bedrock-runtime/client/converse_stream.html
        """
        event_name = list(event.keys())[0]
        self._response_builder.process_event(event_name, event[event_name])
        # Record raw event as a span event
        self._span.add_event(
            SpanEvent(name=event_name, attributes={"json": json.dumps(event[event_name])})
        )

    @capture_exception("Failed to record the accumulated response in the span")
    def _close(self):
        """Set final response and token usage on span and end it."""
        # Build a standardized usage dict and set it on the span if valid
        converse_response = self._response_builder.build()
        self._span.set_outputs(converse_response)

        raw_usage_data = converse_response.get("usage")
        if isinstance(raw_usage_data, dict):
            if usage_data := parse_complete_token_usage_from_response(raw_usage_data):
                self._span.set_attribute(SpanAttributeKey.CHAT_USAGE, usage_data)

        self._end_span()


class _ConverseMessageBuilder:
    """A helper class to accumulate the chunks of a streaming Converse API response."""

    def __init__(self):
        self._role = "assistant"
        self._text_content_buffer = ""
        self._tool_use = {}
        self._response = {}

    def process_event(self, event_name: str, event_attr: dict[str, Any]):
        if event_name == "messageStart":
            self._role = event_attr["role"]
        elif event_name == "contentBlockStart":
            # ContentBlockStart event is only used for tool usage. It carries the tool id
            # and the name, but not the input arguments.
            self._tool_use = {
                # In streaming, input is always string
                "input": "",
                **event_attr["start"]["toolUse"],
            }
        elif event_name == "contentBlockDelta":
            delta = event_attr["delta"]
            if text := delta.get("text"):
                self._text_content_buffer += text
            if tool_use := delta.get("toolUse"):
                self._tool_use["input"] += tool_use["input"]
        elif event_name == "contentBlockStop":
            pass
        elif event_name in {"messageStop", "metadata"}:
            self._response.update(event_attr)
        else:
            _logger.debug(f"Unknown event, skipping: {event_name}")

    def build(self) -> dict[str, Any]:
        message = {
            "role": self._role,
            "content": [{"text": self._text_content_buffer}],
        }
        if self._tool_use:
            message["content"].append({"toolUse": self._tool_use})

        self._response.update({"output": {"message": message}})

        return self._response
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: mlflow-master/mlflow/bedrock/utils.py

```python
import logging
from typing import Any, Callable, Sequence

from mlflow.bedrock import FLAVOR_NAME
from mlflow.environment_variables import _MLFLOW_TESTING
from mlflow.tracing.constant import TokenUsageKey
from mlflow.utils.autologging_utils.config import AutoLoggingConfig

_logger = logging.getLogger(__name__)

# Token key constants for different provider formats
INPUT_TOKEN_KEYS: Sequence[str] = [
    "input_tokens",
    "inputTokens",
    "prompt_tokens",
    "promptTokens",
    "prompt_token_count",
]

OUTPUT_TOKEN_KEYS: Sequence[str] = [
    "output_tokens",
    "outputTokens",
    "completion_tokens",
    "completionTokens",
    "generation_token_count",
]

TOTAL_TOKEN_KEYS: Sequence[str] = [
    "total_tokens",
    "totalTokens",
]

# Common documentation for token key mappings used by parsing functions
_USAGE_DOCS = """The provider-specific usage dictionary. This function will attempt to
            extract token usage values using a variety of possible key names, including:
                - input_tokens / inputTokens: Input token count
                - prompt_tokens / promptTokens: Also mapped as input token count
                - output_tokens / outputTokens: Output token count
                - completion_tokens / completionTokens: Also mapped as output token count
                - total_tokens / totalTokens: Total token count (input + output)"""


def _validate_usage_input(usage_data: Any) -> bool:
    """Validate that usage_data is a dictionary suitable for token extraction."""
    return isinstance(usage_data, dict)


def _extract_token_value_by_keys(d: dict[str, Any], names: Sequence[str]) -> int | None:
    """Extract first integer value from dict using sequence of key names.

    Args:
        d: The dictionary to search for token values.
        names: A sequence of key names to try in order.

    Returns:
        The first integer value found for any of the provided keys, or None if none exist.
    """
    return next((d[name] for name in names if name in d and isinstance(d[name], int)), None)


def capture_exception(logging_message: str):
    """
    A decorator to capture exceptions during a function execution.
    """

    def decorator(func):
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except Exception:
                _logger.debug(logging_message)
                if _MLFLOW_TESTING:
                    raise

        return wrapper

    return decorator


def skip_if_trace_disabled(func: Callable[..., Any]) -> Callable[..., Any]:
    """
    A decorator to apply the function only if trace autologging is enabled.
    This decorator is used to skip the test if the trace autologging is disabled.
    """

    def wrapper(original, self, *args, **kwargs):
        config = AutoLoggingConfig.init(flavor_name=FLAVOR_NAME)
        if not config.log_traces:
            return original(self, *args, **kwargs)

        return func(original, self, *args, **kwargs)

    return wrapper


def parse_complete_token_usage_from_response(
    usage_data: dict[str, Any],
) -> dict[str, int] | None:
    """Parse token usage from response, requiring both input and output tokens.

    Args:
        usage_data: {_USAGE_DOCS}

    Returns:
        A dictionary with standardized token usage keys (from TokenUsageKey), or None if
        either input or output tokens are missing. The total_tokens will be calculated
        if not provided.
    """.format(_USAGE_DOCS=_USAGE_DOCS)
    # Input validation using shared validation function
    if not _validate_usage_input(usage_data):
        return None

    # Extract token values directly, only adding them if found
    token_usage_data = {}

    # Extract input tokens - required for complete usage
    if (input_tokens := _extract_token_value_by_keys(usage_data, INPUT_TOKEN_KEYS)) is not None:
        token_usage_data[TokenUsageKey.INPUT_TOKENS] = input_tokens
    else:
        return None  # Incomplete usage without input tokens

    # Extract output tokens - required for complete usage
    if (output_tokens := _extract_token_value_by_keys(usage_data, OUTPUT_TOKEN_KEYS)) is not None:
        token_usage_data[TokenUsageKey.OUTPUT_TOKENS] = output_tokens
    else:
        return None  # Incomplete usage without output tokens

    # Extract or calculate total tokens
    if (total_tokens := _extract_token_value_by_keys(usage_data, TOTAL_TOKEN_KEYS)) is not None:
        token_usage_data[TokenUsageKey.TOTAL_TOKENS] = total_tokens
    else:
        # Calculate total as input + output
        token_usage_data[TokenUsageKey.TOTAL_TOKENS] = input_tokens + output_tokens

    return token_usage_data


def parse_partial_token_usage_from_response(usage_data: dict[str, Any]) -> dict[str, int] | None:
    """Parse partial token usage from response, returning whatever is available.

    Args:
        usage_data: {_USAGE_DOCS}

    Returns:
        A dictionary with standardized token usage keys (from TokenUsageKey) containing
        whatever token data is available, or None if no token usage data is found.
    """.format(_USAGE_DOCS=_USAGE_DOCS)
    # Input validation using shared validation function
    if not _validate_usage_input(usage_data):
        return None

    token_usage_data = {}

    # Try to extract input token count (prompt tokens).
    if (input_tokens := _extract_token_value_by_keys(usage_data, INPUT_TOKEN_KEYS)) is not None:
        token_usage_data[TokenUsageKey.INPUT_TOKENS] = input_tokens

    # Try to extract output token count (completion tokens).
    if (output_tokens := _extract_token_value_by_keys(usage_data, OUTPUT_TOKEN_KEYS)) is not None:
        token_usage_data[TokenUsageKey.OUTPUT_TOKENS] = output_tokens

    # Try to extract total token count.
    if (total_tokens := _extract_token_value_by_keys(usage_data, TOTAL_TOKEN_KEYS)) is not None:
        token_usage_data[TokenUsageKey.TOTAL_TOKENS] = total_tokens

    # If no token usage data was found, return None. Otherwise, return the partial dictionary.
    return token_usage_data or None
```

--------------------------------------------------------------------------------

---[FILE: _autolog.py]---
Location: mlflow-master/mlflow/bedrock/_autolog.py

```python
import io
import json
import logging
from typing import Any

from botocore.client import BaseClient
from botocore.response import StreamingBody

import mlflow
from mlflow.bedrock import FLAVOR_NAME
from mlflow.bedrock.chat import convert_tool_to_mlflow_chat_tool
from mlflow.bedrock.stream import ConverseStreamWrapper, InvokeModelStreamWrapper
from mlflow.bedrock.utils import parse_complete_token_usage_from_response, skip_if_trace_disabled
from mlflow.entities import SpanType
from mlflow.tracing.constant import SpanAttributeKey
from mlflow.tracing.fluent import start_span_no_context
from mlflow.tracing.utils import set_span_chat_tools
from mlflow.utils.autologging_utils import safe_patch

_BEDROCK_RUNTIME_SERVICE_NAME = "bedrock-runtime"
_BEDROCK_SPAN_PREFIX = "BedrockRuntime."

_logger = logging.getLogger(__name__)


def patched_create_client(original, self, *args, **kwargs):
    """
    Patched version of the boto3 ClientCreator.create_client method that returns
    a patched client class.
    """
    if kwargs.get("service_name") != _BEDROCK_RUNTIME_SERVICE_NAME:
        return original(self, *args, **kwargs)

    client = original(self, *args, **kwargs)
    patch_bedrock_runtime_client(client.__class__)

    return client


def patch_bedrock_runtime_client(client_class: type[BaseClient]):
    """
    Patch the BedrockRuntime client to log traces and models.
    """
    # The most basic model invocation API
    safe_patch(FLAVOR_NAME, client_class, "invoke_model", _patched_invoke_model)
    safe_patch(
        FLAVOR_NAME,
        client_class,
        "invoke_model_with_response_stream",
        _patched_invoke_model_with_response_stream,
    )

    if hasattr(client_class, "converse"):
        # The new "converse" API was introduced in boto3 1.35 to access all models
        # with the consistent chat format.
        # https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/bedrock-runtime/client/converse.html
        safe_patch(FLAVOR_NAME, client_class, "converse", _patched_converse)

    if hasattr(client_class, "converse_stream"):
        safe_patch(FLAVOR_NAME, client_class, "converse_stream", _patched_converse_stream)


def _parse_usage_from_response(
    response_data: dict[str, Any] | str,
) -> dict[str, int] | None:
    """Parse token usage from Bedrock API response body.

    Args:
        response_data: The response body from Bedrock API, either as dict or string.

    Returns:
        Standardized token usage dictionary, or None if parsing fails or no usage found.
    """
    try:
        if isinstance(response_data, dict):
            if usage_data := response_data.get("usage"):
                return parse_complete_token_usage_from_response(usage_data)

            # If no "usage" field, check if the response itself contains token fields
            # (e.g., Meta Llama responses have prompt_token_count, generation_token_count)
            return parse_complete_token_usage_from_response(response_data)
        return None
    except (KeyError, TypeError, ValueError) as e:
        _logger.debug(f"Failed to parse token usage from response: {e}")
        return None


@skip_if_trace_disabled
def _patched_invoke_model(original, self, *args, **kwargs):
    with mlflow.start_span(name=f"{_BEDROCK_SPAN_PREFIX}{original.__name__}") as span:
        # NB: Bedrock client doesn't accept any positional arguments
        span.set_inputs(kwargs)

        result = original(self, *args, **kwargs)

        result["body"] = _buffer_stream(result["body"])
        parsed_response_body = _parse_invoke_model_response_body(result["body"])

        # Determine the span type based on the key in the response body.
        # As of 2024 Dec 9th, all supported embedding models in Bedrock returns the response body
        # with the key "embedding". This might change in the future.
        span_type = SpanType.EMBEDDING if "embedding" in parsed_response_body else SpanType.LLM
        span.set_span_type(span_type)
        span.set_outputs({**result, "body": parsed_response_body})

        # Parse and set token usage information if available
        if usage_data := _parse_usage_from_response(parsed_response_body):
            span.set_attribute(SpanAttributeKey.CHAT_USAGE, usage_data)

        return result


@skip_if_trace_disabled
def _patched_invoke_model_with_response_stream(original, self, *args, **kwargs):
    span = start_span_no_context(
        name=f"{_BEDROCK_SPAN_PREFIX}{original.__name__}",
        # NB: Since we don't inspect the response body for this method, the span type is unknown.
        # We assume it is LLM as using streaming for embedding is not common.
        span_type=SpanType.LLM,
        inputs=kwargs,
    )

    result = original(self, *args, **kwargs)

    # To avoid consuming the stream during serialization, set dummy outputs for the span.
    span.set_outputs({**result, "body": "EventStream"})

    result["body"] = InvokeModelStreamWrapper(stream=result["body"], span=span)
    return result


def _buffer_stream(raw_stream: StreamingBody) -> StreamingBody:
    """
    Create a buffered stream from the raw byte stream.

    The boto3's invoke_model() API returns the LLM response as a byte stream.
    We need to read the stream data to set the span outputs, however, the stream
    can only be read once and not seekable (https://github.com/boto/boto3/issues/564).
    To work around this, we create a buffered stream that can be read multiple times.
    """
    buffered_response = io.BytesIO(raw_stream.read())
    buffered_response.seek(0)
    return StreamingBody(buffered_response, raw_stream._content_length)


def _parse_invoke_model_response_body(response_body: StreamingBody) -> dict[str, Any] | str:
    content = response_body.read()
    try:
        return json.loads(content)
    except Exception:
        # When failed to parse the response body as JSON, return the raw response
        return content
    finally:
        # Reset the stream position to the beginning
        response_body._raw_stream.seek(0)
        # Boto3 uses this attribute to validate the amount of data read from the stream matches
        # the content length, so we need to reset it as well.
        # https://github.com/boto/botocore/blob/f88e981cb1a6cd0c64bc89da262ab76f9bfa9b7d/botocore/response.py#L164C17-L164C32
        response_body._amount_read = 0


@skip_if_trace_disabled
def _patched_converse(original, self, *args, **kwargs):
    with mlflow.start_span(
        name=f"{_BEDROCK_SPAN_PREFIX}{original.__name__}",
        span_type=SpanType.CHAT_MODEL,
    ) as span:
        # NB: Bedrock client doesn't accept any positional arguments
        span.set_inputs(kwargs)
        span.set_attribute(SpanAttributeKey.MESSAGE_FORMAT, "bedrock")
        _set_tool_attributes(span, kwargs)

        result = original(self, *args, **kwargs)
        span.set_outputs(result)

        # Parse and set token usage information if available
        if usage_data := _parse_usage_from_response(result):
            span.set_attribute(SpanAttributeKey.CHAT_USAGE, usage_data)

        return result


@skip_if_trace_disabled
def _patched_converse_stream(original, self, *args, **kwargs):
    # NB: Do not use fluent API to create a span for streaming response. If we do so,
    # the span context will remain active until the stream is fully exhausted, which
    # can lead to super hard-to-debug issues.
    span = start_span_no_context(
        name=f"{_BEDROCK_SPAN_PREFIX}{original.__name__}",
        span_type=SpanType.CHAT_MODEL,
        inputs=kwargs,
        attributes={SpanAttributeKey.MESSAGE_FORMAT: "bedrock"},
    )
    _set_tool_attributes(span, kwargs)

    result = original(self, *args, **kwargs)

    if span:
        result["stream"] = ConverseStreamWrapper(
            stream=result["stream"],
            span=span,
            inputs=kwargs,
        )

    return result


def _set_tool_attributes(span, kwargs):
    """Extract tool attributes for the Bedrock Converse API call."""
    if tool_config := kwargs.get("toolConfig"):
        try:
            tools = [convert_tool_to_mlflow_chat_tool(tool) for tool in tool_config["tools"]]
            set_span_chat_tools(span, tools)
        except Exception as e:
            _logger.debug(f"Failed to set tools for {span}. Error: {e}")
```

--------------------------------------------------------------------------------

````
