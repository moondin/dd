---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 725
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 725 of 991)

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

---[FILE: responses.py]---
Location: mlflow-master/mlflow/types/responses.py
Signals: Pydantic

```python
import json
from itertools import tee
from typing import Any, Generator, Iterator
from uuid import uuid4

from pydantic import BaseModel, ConfigDict, model_validator

from mlflow.types.agent import ChatContext
from mlflow.types.responses_helpers import (
    BaseRequestPayload,
    Message,
    OutputItem,
    Response,
    ResponseCompletedEvent,
    ResponseErrorEvent,
    ResponseOutputItemDoneEvent,
    ResponseTextAnnotationDeltaEvent,
    ResponseTextDeltaEvent,
)

__all__ = [
    "ResponsesAgentRequest",
    "ResponsesAgentResponse",
    "ResponsesAgentStreamEvent",
]

from mlflow.types.schema import Schema
from mlflow.types.type_hints import _infer_schema_from_type_hint
from mlflow.utils.autologging_utils.logging_and_warnings import (
    MlflowEventsAndWarningsBehaviorGlobally,
)


class ResponsesAgentRequest(BaseRequestPayload):
    """Request object for ResponsesAgent.

    Args:
        input: List of simple `role` and `content` messages or output items. See examples at
            https://mlflow.org/docs/latest/genai/flavors/responses-agent-intro#testing-out-your-agent
            and
            https://mlflow.org/docs/latest/genai/flavors/responses-agent-intro#creating-agent-output.
        custom_inputs (Dict[str, Any]): An optional param to provide arbitrary additional context
            to the model. The dictionary values must be JSON-serializable.
            **Optional** defaults to ``None``
        context (:py:class:`mlflow.types.agent.ChatContext`): The context to be used in the chat
            endpoint. Includes conversation_id and user_id. **Optional** defaults to ``None``
    """

    input: list[Message | OutputItem]
    custom_inputs: dict[str, Any] | None = None
    context: ChatContext | None = None


class ResponsesAgentResponse(Response):
    """Response object for ResponsesAgent.

    Args:
        output: List of output items. See examples at
            https://mlflow.org/docs/latest/genai/flavors/responses-agent-intro#creating-agent-output.
        reasoning: Reasoning parameters
        usage: Usage information
        custom_outputs (Dict[str, Any]): An optional param to provide arbitrary additional context
            from the model. The dictionary values must be JSON-serializable. **Optional**, defaults
            to ``None``
    """

    custom_outputs: dict[str, Any] | None = None


class ResponsesAgentStreamEvent(BaseModel):
    """Stream event for ResponsesAgent.
    See examples at https://mlflow.org/docs/latest/genai/flavors/responses-agent-intro#streaming-agent-output

    Args:
        type (str): Type of the stream event
        custom_outputs (Dict[str, Any]): An optional param to provide arbitrary additional context
            from the model. The dictionary values must be JSON-serializable. **Optional**, defaults
            to ``None``
    """

    model_config = ConfigDict(extra="allow")
    type: str
    custom_outputs: dict[str, Any] | None = None

    @model_validator(mode="after")
    def check_type(self) -> "ResponsesAgentStreamEvent":
        type = self.type
        if type == "response.output_item.done":
            ResponseOutputItemDoneEvent(**self.model_dump())
        elif type == "response.output_text.delta":
            ResponseTextDeltaEvent(**self.model_dump())
        elif type == "response.output_text.annotation.added":
            ResponseTextAnnotationDeltaEvent(**self.model_dump())
        elif type == "error":
            ResponseErrorEvent(**self.model_dump())
        elif type == "response.completed":
            ResponseCompletedEvent(**self.model_dump())
        """
        unvalidated types: {
            "response.created",
            "response.in_progress",
            "response.completed",
            "response.failed",
            "response.incomplete",
            "response.content_part.added",
            "response.content_part.done",
            "response.output_text.done",
            "response.output_item.added",
            "response.refusal.delta",
            "response.refusal.done",
            "response.function_call_arguments.delta",
            "response.function_call_arguments.done",
            "response.file_search_call.in_progress",
            "response.file_search_call.searching",
            "response.file_search_call.completed",
            "response.web_search_call.in_progress",
            "response.web_search_call.searching",
            "response.web_search_call.completed",
            "response.error",
        }
        """
        return self


with MlflowEventsAndWarningsBehaviorGlobally(
    reroute_warnings=False,
    disable_event_logs=True,
    disable_warnings=True,
):
    properties = _infer_schema_from_type_hint(ResponsesAgentRequest).to_dict()[0]["properties"]
    formatted_properties = [{**prop, "name": name} for name, prop in properties.items()]
    RESPONSES_AGENT_INPUT_SCHEMA = Schema.from_json(json.dumps(formatted_properties))
    RESPONSES_AGENT_OUTPUT_SCHEMA = _infer_schema_from_type_hint(ResponsesAgentResponse)
RESPONSES_AGENT_INPUT_EXAMPLE = {"input": [{"role": "user", "content": "Hello!"}]}

try:
    from langchain_core.messages import BaseMessage

    _HAS_LANGCHAIN_BASE_MESSAGE = True
except ImportError:
    _HAS_LANGCHAIN_BASE_MESSAGE = False


def responses_agent_output_reducer(
    chunks: list[ResponsesAgentStreamEvent | dict[str, Any]],
):
    """Output reducer for ResponsesAgent streaming."""
    output_items = []
    for chunk in chunks:
        # Handle both dict and pydantic object formats
        if isinstance(chunk, dict):
            chunk_type = chunk.get("type")
            if chunk_type == "response.output_item.done":
                output_items.append(chunk.get("item"))
        else:
            # Pydantic object (ResponsesAgentStreamEvent)
            if hasattr(chunk, "type") and chunk.type == "response.output_item.done":
                output_items.append(chunk.item)

    return ResponsesAgentResponse(output=output_items).model_dump(exclude_none=True)


def create_text_delta(delta: str, item_id: str) -> dict[str, Any]:
    """Helper method to create a dictionary conforming to the text delta schema for
    streaming.

    Read more at https://mlflow.org/docs/latest/genai/flavors/responses-agent-intro#streaming-agent-output.
    """
    return {
        "type": "response.output_text.delta",
        "item_id": item_id,
        "delta": delta,
    }


def create_annotation_added(
    item_id: str, annotation: dict[str, Any], annotation_index: int | None = 0
) -> dict[str, Any]:
    """Helper method to create annotation added event."""
    return {
        "type": "response.output_text.annotation.added",
        "item_id": item_id,
        "annotation_index": annotation_index,
        "annotation": annotation,
    }


def create_text_output_item(
    text: str, id: str, annotations: list[dict[str, Any]] | None = None
) -> dict[str, Any]:
    """Helper method to create a dictionary conforming to the text output item schema.

    Read more at https://mlflow.org/docs/latest/genai/flavors/responses-agent-intro#creating-agent-output.

    Args:
        text (str): The text to be outputted.
        id (str): The id of the output item.
        annotations (Optional[list[dict]]): The annotations of the output item.
    """
    content_item = {
        "text": text,
        "type": "output_text",
    }
    if annotations is not None:
        content_item["annotations"] = annotations
    return {
        "id": id,
        "content": [content_item],
        "role": "assistant",
        "type": "message",
    }


def create_reasoning_item(id: str, reasoning_text: str) -> dict[str, Any]:
    """Helper method to create a dictionary conforming to the reasoning item schema.

    Read more at https://www.mlflow.org/docs/latest/llms/responses-agent-intro/#creating-agent-output.
    """
    return {
        "type": "reasoning",
        "summary": [
            {
                "type": "summary_text",
                "text": reasoning_text,
            }
        ],
        "id": id,
    }


def create_function_call_item(id: str, call_id: str, name: str, arguments: str) -> dict[str, Any]:
    """Helper method to create a dictionary conforming to the function call item schema.

    Read more at https://mlflow.org/docs/latest/genai/flavors/responses-agent-intro#creating-agent-output.

    Args:
        id (str): The id of the output item.
        call_id (str): The id of the function call.
        name (str): The name of the function to be called.
        arguments (str): The arguments to be passed to the function.
    """
    return {
        "type": "function_call",
        "id": id,
        "call_id": call_id,
        "name": name,
        "arguments": arguments,
    }


def create_function_call_output_item(call_id: str, output: str) -> dict[str, Any]:
    """Helper method to create a dictionary conforming to the function call output item
    schema.

    Read more at https://mlflow.org/docs/latest/genai/flavors/responses-agent-intro#creating-agent-output.

    Args:
        call_id (str): The id of the function call.
        output (str): The output of the function call.
    """
    return {
        "type": "function_call_output",
        "call_id": call_id,
        "output": output,
    }


def create_mcp_approval_request_item(
    id: str, arguments: str, name: str, server_label: str
) -> dict[str, Any]:
    """Helper method to create a dictionary conforming to the MCP approval request item schema.

    Read more at https://mlflow.org/docs/latest/genai/flavors/responses-agent-intro#creating-agent-output.

    Args:
        id (str): The unique id of the approval request.
        arguments (str): A JSON string of arguments for the tool.
        name (str): The name of the tool to run.
        server_label (str): The label of the MCP server making the request.
    """
    return {
        "type": "mcp_approval_request",
        "id": id,
        "arguments": arguments,
        "name": name,
        "server_label": server_label,
    }


def create_mcp_approval_response_item(
    id: str,
    approval_request_id: str,
    approve: bool,
    reason: str | None = None,
) -> dict[str, Any]:
    """Helper method to create a dictionary conforming to the MCP approval response item schema.

    Read more at https://mlflow.org/docs/latest/genai/flavors/responses-agent-intro#creating-agent-output.

    Args:
        id (str): The unique id of the approval response.
        approval_request_id (str): The id of the approval request being answered.
        approve (bool): Whether the request was approved.
        reason (Optional[str]): The reason for the approval.
    """
    return {
        "type": "mcp_approval_response",
        "id": id,
        "approval_request_id": approval_request_id,
        "approve": approve,
        "reason": reason,
    }


def responses_to_cc(message: dict[str, Any]) -> list[dict[str, Any]]:
    """Convert from a Responses API output item to a list of ChatCompletion messages."""
    msg_type = message.get("type")
    if msg_type == "function_call":
        return [
            {
                "role": "assistant",
                "content": "tool call",  # empty content is not supported by claude models
                "tool_calls": [
                    {
                        "id": message["call_id"],
                        "type": "function",
                        "function": {
                            "arguments": message.get("arguments") or "{}",
                            "name": message["name"],
                        },
                    }
                ],
            }
        ]
    elif msg_type == "message" and isinstance(message.get("content"), list):
        return [
            {"role": message["role"], "content": content["text"]} for content in message["content"]
        ]
    elif msg_type == "reasoning":
        return [{"role": "assistant", "content": json.dumps(message["summary"])}]
    elif msg_type == "function_call_output":
        return [
            {
                "role": "tool",
                "content": message["output"],
                "tool_call_id": message["call_id"],
            }
        ]
    elif msg_type == "mcp_approval_request":
        return [
            {
                "role": "assistant",
                "content": "mcp approval request",
                "tool_calls": [
                    {
                        "id": message["id"],
                        "type": "function",
                        "function": {
                            "arguments": message.get("arguments") or "{}",
                            "name": message["name"],
                        },
                    }
                ],
            }
        ]
    elif msg_type == "mcp_approval_response":
        return [
            {
                "role": "tool",
                "content": str(message["approve"]),
                "tool_call_id": message["approval_request_id"],
            }
        ]
    compatible_keys = ["role", "content", "name", "tool_calls", "tool_call_id"]
    filtered = {k: v for k, v in message.items() if k in compatible_keys}
    return [filtered] if filtered else []


def to_chat_completions_input(
    responses_input: list[dict[str, Any] | Message | OutputItem],
) -> list[dict[str, Any]]:
    """Convert from Responses input items to ChatCompletion dictionaries."""
    cc_msgs = []
    for msg in responses_input:
        if isinstance(msg, BaseModel):
            cc_msgs.extend(responses_to_cc(msg.model_dump()))
        else:
            cc_msgs.extend(responses_to_cc(msg))
    return cc_msgs


def output_to_responses_items_stream(
    chunks: Iterator[dict[str, Any]],
    aggregator: list[dict[str, Any]] | None = None,
) -> Generator[ResponsesAgentStreamEvent, None, None]:
    """
    For streaming, convert from various message format dicts to Responses output items,
    returning a generator of ResponsesAgentStreamEvent objects.

    If `aggregator` is provided, it will be extended with the aggregated output item dicts.

    Handles an iterator of ChatCompletion chunks or LangChain BaseMessage objects.
    """
    peeking_iter, chunks = tee(chunks)
    first_chunk = next(peeking_iter)
    if _HAS_LANGCHAIN_BASE_MESSAGE and isinstance(first_chunk, BaseMessage):
        yield from _langchain_message_stream_to_responses_stream(chunks, aggregator)
    else:
        yield from _cc_stream_to_responses_stream(chunks, aggregator)


if _HAS_LANGCHAIN_BASE_MESSAGE:

    def _langchain_message_stream_to_responses_stream(
        chunks: Iterator[BaseMessage],
        aggregator: list[dict[str, Any]] | None = None,
    ) -> Generator[ResponsesAgentStreamEvent, None, None]:
        """Convert from a stream of LangChain BaseMessage objects to a stream of
        ResponsesAgentStreamEvent objects. Skips user or human messages.
        """
        for chunk in chunks:
            message = chunk.model_dump()
            role = message["type"]
            if role == "ai":
                if message.get("content"):
                    text_output_item = create_text_output_item(
                        text=message["content"],
                        id=message.get("id") or str(uuid4()),
                    )
                    if aggregator is not None:
                        aggregator.append(text_output_item)
                    yield ResponsesAgentStreamEvent(
                        type="response.output_item.done", item=text_output_item
                    )
                if tool_calls := message.get("tool_calls"):
                    for tool_call in tool_calls:
                        function_call_item = create_function_call_item(
                            id=message.get("id") or str(uuid4()),
                            call_id=tool_call["id"],
                            name=tool_call["name"],
                            arguments=json.dumps(tool_call["args"]),
                        )
                        if aggregator is not None:
                            aggregator.append(function_call_item)
                        yield ResponsesAgentStreamEvent(
                            type="response.output_item.done", item=function_call_item
                        )

            elif role == "tool":
                function_call_output_item = create_function_call_output_item(
                    call_id=message["tool_call_id"],
                    output=message["content"],
                )
                if aggregator is not None:
                    aggregator.append(function_call_output_item)
                yield ResponsesAgentStreamEvent(
                    type="response.output_item.done", item=function_call_output_item
                )
            elif role == "user" or "human":
                continue


def _cc_stream_to_responses_stream(
    chunks: Iterator[dict[str, Any]],
    aggregator: list[dict[str, Any]] | None = None,
) -> Generator[ResponsesAgentStreamEvent, None, None]:
    """
    Convert from stream of ChatCompletion chunks to a stream of
    ResponsesAgentStreamEvent objects.
    """
    llm_content = ""
    reasoning_content = ""
    tool_calls = []
    msg_id = None
    for chunk in chunks:
        if chunk.get("choices") is None or len(chunk["choices"]) == 0:
            continue
        delta = chunk["choices"][0]["delta"]
        msg_id = chunk.get("id", None)
        content = delta.get("content", None)
        if tc := delta.get("tool_calls"):
            if not tool_calls:  # only accommodate for single tool call right now
                tool_calls = tc
            else:
                tool_calls[0]["function"]["arguments"] += tc[0]["function"]["arguments"]
        elif content is not None:
            # logic for content item format
            # https://docs.databricks.com/aws/en/machine-learning/foundation-model-apis/api-reference#contentitem
            if isinstance(content, list):
                for item in content:
                    if isinstance(item, dict):
                        if item.get("type") == "reasoning":
                            reasoning_content += item.get("summary", [])[0].get("text", "")
                        if item.get("type") == "text" and item.get("text"):
                            llm_content += item["text"]
                            yield ResponsesAgentStreamEvent(
                                **create_text_delta(item["text"], item_id=msg_id)
                            )
            elif reasoning_content != "":
                # reasoning content is done streaming
                reasoning_item = create_reasoning_item(msg_id, reasoning_content)
                if aggregator is not None:
                    aggregator.append(reasoning_item)
                yield ResponsesAgentStreamEvent(
                    type="response.output_item.done",
                    item=reasoning_item,
                )
                reasoning_content = ""

            if isinstance(content, str):
                llm_content += content
                yield ResponsesAgentStreamEvent(**create_text_delta(content, item_id=msg_id))

    # yield an `output_item.done` `output_text` event that aggregates the stream
    # this enables tracing and payload logging
    if llm_content:
        text_output_item = create_text_output_item(llm_content, msg_id)
        if aggregator is not None:
            aggregator.append(text_output_item)
        yield ResponsesAgentStreamEvent(
            type="response.output_item.done",
            item=text_output_item,
        )

    for tool_call in tool_calls:
        function_call_output_item = create_function_call_item(
            msg_id,
            tool_call["id"],
            tool_call["function"]["name"],
            tool_call["function"]["arguments"],
        )
        if aggregator is not None:
            aggregator.append(function_call_output_item)
        yield ResponsesAgentStreamEvent(
            type="response.output_item.done",
            item=function_call_output_item,
        )
```

--------------------------------------------------------------------------------

---[FILE: responses_helpers.py]---
Location: mlflow-master/mlflow/types/responses_helpers.py
Signals: Pydantic

```python
import warnings
from typing import Any

from pydantic import BaseModel, ConfigDict, model_validator

"""
Classes are inspired by classes for Response and ResponseStreamEvent in openai-python

https://github.com/openai/openai-python/blob/ed53107e10e6c86754866b48f8bd862659134ca8/src/openai/types/responses/response.py#L31
https://github.com/openai/openai-python/blob/ed53107e10e6c86754866b48f8bd862659134ca8/src/openai/types/responses/response_stream_event.py#L42
"""


#########################
# Response helper classes
#########################
class Status(BaseModel):
    status: str | None = None

    @model_validator(mode="after")
    def check_status(self) -> "Status":
        if self.status is not None and self.status not in {
            "in_progress",
            "completed",
            "incomplete",
        }:
            raise ValueError(
                f"Invalid status: {self.status} for {self.__class__.__name__}. "
                "Must be 'in_progress', 'completed', or 'incomplete'."
            )
        return self


class ResponseError(BaseModel):
    code: str | None = None
    message: str


class AnnotationFileCitation(BaseModel):
    file_id: str
    index: int
    type: str = "file_citation"


class AnnotationURLCitation(BaseModel):
    end_index: int | None = None
    start_index: int | None = None
    title: str
    type: str = "url_citation"
    url: str


class AnnotationFilePath(BaseModel):
    file_id: str
    index: int
    type: str = "file_path"


class Annotation(BaseModel):
    model_config = ConfigDict(extra="allow")
    type: str

    @model_validator(mode="after")
    def check_type(self) -> "Annotation":
        if self.type == "file_citation":
            AnnotationFileCitation(**self.model_dump())
        elif self.type == "url_citation":
            AnnotationURLCitation(**self.model_dump())
        elif self.type == "file_path":
            AnnotationFilePath(**self.model_dump())
        else:
            raise ValueError(f"Invalid annotation type: {self.type}")
        return self


class ResponseOutputText(BaseModel):
    annotations: list[Annotation] | None = None
    text: str
    type: str = "output_text"


class ResponseOutputRefusal(BaseModel):
    refusal: str
    type: str = "refusal"


class Content(BaseModel):
    model_config = ConfigDict(extra="allow")
    type: str

    @model_validator(mode="after")
    def check_type(self) -> "Content":
        if self.type == "output_text":
            ResponseOutputText(**self.model_dump())
        elif self.type == "refusal":
            ResponseOutputRefusal(**self.model_dump())
        else:
            raise ValueError(f"Invalid content type: {self.type} for {self.__class__.__name__}")
        return self


class ResponseOutputMessage(Status):
    id: str
    content: list[Content]
    role: str = "assistant"
    type: str = "message"

    @model_validator(mode="after")
    def check_role(self) -> "ResponseOutputMessage":
        if self.role != "assistant":
            raise ValueError(f"Invalid role: {self.role}. Must be 'assistant'.")
        return self

    @model_validator(mode="after")
    def check_content(self) -> "ResponseOutputMessage":
        if self.content is None:
            raise ValueError(f"content must not be None for {self.__class__.__name__}")
        if isinstance(self.content, list) and len(self.content) == 0:
            raise ValueError("content must not be an empty list")
        return self


class ResponseFunctionToolCall(Status):
    arguments: str
    call_id: str
    name: str
    type: str = "function_call"
    id: str | None = None


class Summary(BaseModel):
    text: str
    type: str = "summary_text"


class ResponseReasoningItem(Status):
    id: str
    summary: list[Summary]
    type: str = "reasoning"


class McpApprovalRequest(Status):
    id: str
    arguments: str
    name: str
    server_label: str
    type: str = "mcp_approval_request"


class McpApprovalResponse(Status):
    approval_request_id: str
    approve: bool
    type: str = "mcp_approval_response"
    id: str | None = None
    reason: str | None = None


class OutputItem(BaseModel):
    model_config = ConfigDict(extra="allow")
    type: str

    @model_validator(mode="after")
    def check_type(self) -> "OutputItem":
        if self.type == "message":
            ResponseOutputMessage(**self.model_dump())
        elif self.type == "function_call":
            ResponseFunctionToolCall(**self.model_dump())
        elif self.type == "reasoning":
            ResponseReasoningItem(**self.model_dump())
        elif self.type == "function_call_output":
            FunctionCallOutput(**self.model_dump())
        elif self.type == "mcp_approval_request":
            McpApprovalRequest(**self.model_dump())
        elif self.type == "mcp_approval_response":
            McpApprovalResponse(**self.model_dump())
        elif self.type not in {
            "file_search_call",
            "computer_call",
            "web_search_call",
        }:
            raise ValueError(f"Invalid type: {self.type} for {self.__class__.__name__}")
        return self


class IncompleteDetails(BaseModel):
    reason: str | None = None

    @model_validator(mode="after")
    def check_reason(self) -> "IncompleteDetails":
        if self.reason and self.reason not in {"max_output_tokens", "content_filter"}:
            warnings.warn(f"Invalid reason: {self.reason}")
        return self


class ToolChoiceFunction(BaseModel):
    name: str
    type: str = "function"


class FunctionTool(BaseModel):
    name: str
    parameters: dict[str, Any]
    strict: bool | None = None
    type: str = "function"
    description: str | None = None


class Tool(BaseModel):
    model_config = ConfigDict(extra="allow")
    type: str

    @model_validator(mode="after")
    def check_type(self) -> "Tool":
        if self.type == "function":
            FunctionTool(**self.model_dump())
        elif self.type not in {"file_search", "computer_use", "web_search"}:
            warnings.warn(f"Invalid tool type: {self.type}")
        return self


class ToolChoice(BaseModel):
    tool_choice: str | ToolChoiceFunction | None = None

    @model_validator(mode="after")
    def check_tool_choice(self) -> "ToolChoice":
        if (
            self.tool_choice
            and isinstance(self.tool_choice, str)
            and self.tool_choice not in {"none", "auto", "required"}
        ):
            warnings.warn(f"Invalid tool choice: {self.tool_choice}")
        return self


class ReasoningParams(BaseModel):
    effort: str | None = None
    generate_summary: str | None = None

    @model_validator(mode="after")
    def check_generate_summary(self) -> "ReasoningParams":
        if self.generate_summary and self.generate_summary not in {"concise", "detailed"}:
            warnings.warn(f"Invalid generate_summary: {self.generate_summary}")
        return self

    @model_validator(mode="after")
    def check_effort(self) -> "ReasoningParams":
        if self.effort and self.effort not in {"low", "medium", "high"}:
            warnings.warn(f"Invalid effort: {self.effort}")
        return self


class InputTokensDetails(BaseModel):
    cached_tokens: int


class OutputTokensDetails(BaseModel):
    reasoning_tokens: int


class ResponseUsage(BaseModel):
    input_tokens: int
    input_tokens_details: InputTokensDetails
    output_tokens: int
    output_tokens_details: OutputTokensDetails
    total_tokens: int


class Truncation(BaseModel):
    truncation: str | None = None

    @model_validator(mode="after")
    def check_truncation(self) -> "Truncation":
        if self.truncation and self.truncation not in {"auto", "disabled"}:
            warnings.warn(f"Invalid truncation: {self.truncation}. Must be 'auto' or 'disabled'.")
        return self


class Response(Truncation, ToolChoice):
    id: str | None = None
    created_at: float | None = None
    error: ResponseError | None = None
    incomplete_details: IncompleteDetails | None = None
    instructions: str | None = None
    metadata: dict[str, str] | None = None
    model: str | None = None
    object: str = "response"
    output: list[OutputItem]
    parallel_tool_calls: bool | None = None
    temperature: float | None = None
    tools: list[Tool] | None = None
    top_p: float | None = None
    max_output_tokens: int | None = None
    previous_response_id: str | None = None
    reasoning: ReasoningParams | None = None
    status: str | None = None
    text: Any | None = None
    usage: ResponseUsage | None = None
    user: str | None = None

    @property
    def output_text(self) -> str:
        """Convenience property that aggregates all `output_text` items from the `output`
        list.

        If no `output_text` content blocks exist, then an empty string is returned.
        """
        texts: list[str] = []
        for output in self.output:
            if output.type == "message":
                texts.extend(
                    content.text for content in output.content if content.type == "output_text"
                )

        return "".join(texts)

    @model_validator(mode="after")
    def check_status(self) -> "Response":
        if self.status and self.status not in {
            "completed",
            "failed",
            "in_progress",
            "incomplete",
        }:
            warnings.warn(
                f"Invalid status: {self.status}. Must be 'completed', 'failed', "
                "'in_progress', or 'incomplete'."
            )
        return self


#################################
# ResponsesRequest helper classes
#################################
class ResponseInputTextParam(BaseModel):
    text: str
    type: str = "input_text"


class Message(Status):
    content: str | list[ResponseInputTextParam | dict[str, Any]]
    role: str
    status: str | None = None
    type: str = "message"

    @model_validator(mode="after")
    def check_content(self) -> "Message":
        if self.content is None:
            raise ValueError("content must not be None")
        if isinstance(self.content, list):
            for item in self.content:
                if isinstance(item, dict):
                    if "type" not in item:
                        raise ValueError(
                            "dictionary type content field values must have key 'type'"
                        )
                    if item["type"] == "input_text":
                        ResponseInputTextParam(**item)
                    elif item["type"] not in {"input_image", "input_file"}:
                        raise ValueError(f"Invalid type: {item['type']}.")
        return self

    @model_validator(mode="after")
    def check_role(self) -> "Message":
        if self.role not in {"user", "assistant", "system", "developer"}:
            raise ValueError(
                f"Invalid role: {self.role}. Must be 'user', 'assistant', 'system', or 'developer'."
            )
        return self


class FunctionCallOutput(Status):
    call_id: str
    output: str
    type: str = "function_call_output"


class BaseRequestPayload(Truncation, ToolChoice):
    max_output_tokens: int | None = None
    metadata: dict[str, str] | None = None
    parallel_tool_calls: bool | None = None
    tools: list[Tool] | None = None
    reasoning: ReasoningParams | None = None
    store: bool | None = None
    stream: bool | None = None
    temperature: float | None = None
    text: Any | None = None
    top_p: float | None = None
    user: str | None = None


#####################################
# ResponsesStreamEvent helper classes
#####################################


class ResponseTextDeltaEvent(BaseModel):
    content_index: int | None = None
    delta: str
    item_id: str
    output_index: int | None = None
    type: str = "response.output_text.delta"


class ResponseTextAnnotationDeltaEvent(BaseModel):
    annotation: Annotation
    annotation_index: int
    content_index: int | None = None
    item_id: str
    output_index: int | None = None
    type: str = "response.output_text.annotation.added"


class ResponseOutputItemDoneEvent(BaseModel):
    item: OutputItem
    output_index: int | None = None
    type: str = "response.output_item.done"


class ResponseErrorEvent(BaseModel):
    code: str | None = None
    message: str
    param: str | None = None
    type: str = "error"


class ResponseCompletedEvent(BaseModel):
    response: Response
    type: str = "response.completed"
```

--------------------------------------------------------------------------------

````
