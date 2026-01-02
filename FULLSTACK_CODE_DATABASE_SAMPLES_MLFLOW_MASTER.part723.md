---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 723
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 723 of 991)

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

---[FILE: agent.py]---
Location: mlflow-master/mlflow/types/agent.py
Signals: Pydantic

```python
from typing import Any

from pydantic import ConfigDict, model_validator

from mlflow.types.chat import BaseModel, ChatUsage, ToolCall
from mlflow.types.llm import (
    _custom_inputs_col_spec,
    _custom_outputs_col_spec,
    _token_usage_stats_col_spec,
)
from mlflow.types.schema import (
    Array,
    ColSpec,
    DataType,
    Map,
    Object,
    Property,
    Schema,
)


class ChatAgentMessage(BaseModel):
    """
    A message in a ChatAgent model request or response.

    Args:
        role (str): The role of the entity that sent the message (e.g. ``"user"``, ``"system"``,
            ``"assistant"``, ``"tool"``).
        content (str): The content of the message.
            **Optional** Can be ``None`` if tool_calls is provided.
        name (str): The name of the entity that sent the message. **Optional** defaults to ``None``
        id (str): The ID of the message. Required when it is either part of a
            :py:class:`ChatAgentResponse` or :py:class:`ChatAgentChunk`.
        tool_calls (List[:py:class:`mlflow.types.chat.ToolCall`]): A list of tool calls made by the
            model. **Optional** defaults to ``None``
        tool_call_id (str): The ID of the tool call that this message is a response to.
            **Optional** defaults to ``None``
        attachments (Dict[str, str]): A dictionary of attachments. **Optional** defaults to ``None``
    """

    role: str
    content: str | None = None
    name: str | None = None
    id: str | None = None
    tool_calls: list[ToolCall] | None = None
    tool_call_id: str | None = None
    # TODO make this a pydantic class with subtypes once we have more details on usage
    attachments: dict[str, str] | None = None

    @model_validator(mode="after")
    def check_content_and_tool_calls(self):
        """
        Ensure at least one of 'content' or 'tool_calls' is set.
        """
        if self.content is None and self.tool_calls is None:
            raise ValueError("Either 'content' or 'tool_calls' must be provided.")
        return self

    @model_validator(mode="after")
    def check_tool_messages(self):
        """
        Ensure that the 'name' and 'tool_call_id' fields are set for tool messages.
        """
        if self.role == "tool" and (not self.name or not self.tool_call_id):
            raise ValueError("Both 'name' and 'tool_call_id' must be provided for tool messages.")
        return self


class ChatContext(BaseModel):
    """
    Context to be used in a ChatAgent endpoint.

    Args:
        conversation_id (str): The ID of the conversation. **Optional** defaults to ``None``
        user_id (str): The ID of the user. **Optional** defaults to ``None``
    """

    conversation_id: str | None = None
    user_id: str | None = None


class ChatAgentRequest(BaseModel):
    """
    Format of a ChatAgent interface request.

    Args:
        messages: A list of :py:class:`ChatAgentMessage` that will be passed to the model.
        context (:py:class:`ChatContext`): The context to be used in the chat endpoint. Includes
            conversation_id and user_id. **Optional** defaults to ``None``
        custom_inputs (Dict[str, Any]): An optional param to provide arbitrary additional context
            to the model. The dictionary values must be JSON-serializable.
            **Optional** defaults to ``None``
        stream (bool): Whether to stream back responses as they are generated.
            **Optional**, defaults to ``False``
    """

    messages: list[ChatAgentMessage]
    context: ChatContext | None = None
    custom_inputs: dict[str, Any] | None = None
    stream: bool | None = False


class ChatAgentResponse(BaseModel):
    """
    Represents the response of a ChatAgent.

    Args:
        messages: A list of :py:class:`ChatAgentMessage` that are returned from the model.
        finish_reason (str): The reason why generation stopped. **Optional** defaults to ``None``
        custom_outputs (Dict[str, Any]): An optional param to provide arbitrary additional context
            from the model. The dictionary values must be JSON-serializable. **Optional**, defaults
            to ``None``
        usage (:py:class:`mlflow.types.chat.ChatUsage`): The token usage of the request
            **Optional**, defaults to None
    """

    model_config = ConfigDict(validate_assignment=True)
    messages: list[ChatAgentMessage]
    finish_reason: str | None = None
    # TODO: add finish_reason_metadata once we have a plan for usage
    custom_outputs: dict[str, Any] | None = None
    usage: ChatUsage | None = None

    @model_validator(mode="after")
    def check_message_ids(self):
        """
        Ensure that all messages have an ID and it is unique.
        """
        message_ids = [msg.id for msg in self.messages]
        if any(msg_id is None for msg_id in message_ids):
            raise ValueError(
                "All ChatAgentMessage objects in field `messages` must have an ID. You can use "
                "`str(uuid.uuid4())` to generate a unique ID."
            )
        if len(message_ids) != len(set(message_ids)):
            raise ValueError(
                "All ChatAgentMessage objects in field `messages` must have unique IDs. "
                "You can use `str(uuid.uuid4())` to generate a unique ID."
            )
        return self


class ChatAgentChunk(BaseModel):
    """
    Represents a single chunk within the streaming response of a ChatAgent.

    Args:
        delta: A :py:class:`ChatAgentMessage` representing a single chunk within the list of
            messages comprising agent output. In particular, clients should assume the `content`
            field within this `ChatAgentMessage` contains only part of the message content, and
            aggregate message content by ID across chunks. More info can be found in the docstring
            of :py:func:`ChatAgent.predict_stream <mlflow.pyfunc.ChatAgent.predict_stream>`.
        finish_reason (str): The reason why generation stopped. **Optional** defaults to ``None``
        custom_outputs (Dict[str, Any]): An optional param to provide arbitrary additional context
            from the model. The dictionary values must be JSON-serializable. **Optional**, defaults
            to ``None``
        usage (:py:class:`mlflow.types.chat.ChatUsage`): The token usage of the request
            **Optional**, defaults to None
    """

    model_config = ConfigDict(validate_assignment=True)
    delta: ChatAgentMessage
    finish_reason: str | None = None
    # TODO: add finish_reason_metadata once we have a plan for usage
    custom_outputs: dict[str, Any] | None = None
    usage: ChatUsage | None = None

    @model_validator(mode="after")
    def check_message_id(self):
        """
        Ensure that the message ID is unique.
        """
        if self.delta.id is None:
            raise ValueError(
                "The field `delta` of ChatAgentChunk must contain a ChatAgentMessage object with an"
                " ID. If this chunk contains partial content, it should have the same ID as other "
                " chunks in the same message. See "
                "https://mlflow.org/docs/latest/api_reference/python_api/mlflow.pyfunc.html#mlflow.pyfunc.ChatAgent.predict_stream"
                " for more details. You can use `str(uuid.uuid4())` to generate a unique ID."
            )
        return self


# fmt: off
_chat_agent_messages_col_spec = ColSpec(
    name="messages",
    type=Array(
        Object(
            [
                Property("role", DataType.string),
                Property("content", DataType.string, False),
                Property("name", DataType.string, False),
                Property("id", DataType.string, False),
                Property("tool_calls", Array(Object([
                    Property("id", DataType.string),
                    Property("function", Object([
                        Property("name", DataType.string),
                        Property("arguments", DataType.string),
                    ])),
                    Property("type", DataType.string),
                ])), False),
                Property("tool_call_id", DataType.string, False),
                Property("attachments", Map(DataType.string), False),
            ]
        )
    ),
)

# TODO: move out all params to a ParamSchema when Map(AnyType()) is supported by ParamSpec
CHAT_AGENT_INPUT_SCHEMA = Schema(
    [
        _chat_agent_messages_col_spec,
        ColSpec(name="context", type=Object([
            Property("conversation_id", DataType.string, False),
            Property("user_id", DataType.string, False),
        ]), required=False),
        _custom_inputs_col_spec,
        ColSpec(name="stream", type=DataType.boolean, required=False),
    ]
)

CHAT_AGENT_OUTPUT_SCHEMA = Schema(
    [
        _chat_agent_messages_col_spec,
        ColSpec(name="finish_reason", type=DataType.string, required=False),
        _custom_outputs_col_spec,
        _token_usage_stats_col_spec,
    ]
)

CHAT_AGENT_INPUT_EXAMPLE = {
    "messages": [
        {"role": "user", "content": "Hello!"},
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: chat.py]---
Location: mlflow-master/mlflow/types/chat.py
Signals: Pydantic

```python
from __future__ import annotations

from typing import Annotated, Any, Literal
from uuid import uuid4

from pydantic import BaseModel, Field


class TextContentPart(BaseModel):
    type: Literal["text"]
    text: str


class ImageUrl(BaseModel):
    """
    Represents an image URL.

    Attributes:
        url: Either a URL of an image or base64 encoded data.
            https://platform.openai.com/docs/guides/vision?lang=curl#uploading-base64-encoded-images
        detail: The level of resolution for the image when the model receives it.
            For example, when set to "low", the model will see a image resized to
            512x512 pixels, which consumes fewer tokens. In OpenAI, this is optional
            and defaults to "auto".
            https://platform.openai.com/docs/guides/vision?lang=curl#low-or-high-fidelity-image-understanding
    """

    url: str
    detail: Literal["auto", "low", "high"] | None = None


class ImageContentPart(BaseModel):
    type: Literal["image_url"]
    image_url: ImageUrl


class InputAudio(BaseModel):
    data: str  # base64 encoded data
    format: Literal["wav", "mp3"]


class AudioContentPart(BaseModel):
    type: Literal["input_audio"]
    input_audio: InputAudio


ContentPartsList = list[
    Annotated[TextContentPart | ImageContentPart | AudioContentPart, Field(discriminator="type")]
]


ContentType = Annotated[str | ContentPartsList, Field(union_mode="left_to_right")]


class Function(BaseModel):
    name: str | None = None
    arguments: str | None = None

    def to_tool_call(self, id=None) -> ToolCall:
        if id is None:
            id = str(uuid4())
        return ToolCall(id=id, type="function", function=self)


class ToolCall(BaseModel):
    id: str
    type: str = Field(default="function")
    function: Function


class ChatMessage(BaseModel):
    """
    A chat request. ``content`` can be a string, or an array of content parts.

    A content part is one of the following:

    - :py:class:`TextContentPart <mlflow.types.chat.TextContentPart>`
    - :py:class:`ImageContentPart <mlflow.types.chat.ImageContentPart>`
    - :py:class:`AudioContentPart <mlflow.types.chat.AudioContentPart>`
    """

    role: str
    content: ContentType | None = None
    # NB: In the actual OpenAI chat completion API spec, these fields only
    #   present in either the request or response message (tool_call_id is only in
    #   the request, while the other two are only in the response).
    #   Strictly speaking, we should separate the request and response message types
    #   to match OpenAI's API spec. However, we don't want to do that because we the
    #   request and response message types are not distinguished in many parts of the
    #   codebase, and also we don't want to ask users to use two different classes.
    #   Therefore, we include all fields in this class, while marking them as optional.
    # TODO: Define a sub classes for different type of messages (request/response, and
    #   system/user/assistant/tool, etc), and create a factory function to allow users
    #   to create them without worrying about the details.
    tool_calls: list[ToolCall] | None = None
    refusal: str | None = None
    tool_call_id: str | None = None


AllowedType = Literal["string", "number", "integer", "object", "array", "boolean", "null"]


class ParamType(BaseModel):
    type: AllowedType | list[AllowedType] | None = None


class ParamProperty(ParamType):
    """
    OpenAI uses JSON Schema (https://json-schema.org/) for function parameters.
    See OpenAI function calling reference:
    https://platform.openai.com/docs/guides/function-calling?&api-mode=responses#defining-functions

    JSON Schema enum supports any JSON type (str, int, float, bool, null, arrays, objects),
    but we restrict to basic scalar types for practical use cases and API safety.
    """

    description: str | None = None
    enum: list[str | int | float | bool] | None = None
    items: ParamType | None = None


class FunctionParams(BaseModel):
    properties: dict[str, ParamProperty]
    type: Literal["object"] = "object"
    required: list[str] | None = None
    additionalProperties: bool | None = None


class FunctionToolDefinition(BaseModel):
    name: str
    description: str | None = None
    parameters: FunctionParams | None = None
    strict: bool | None = None


class ChatTool(BaseModel):
    """
    A tool definition passed to the chat completion API.

    Ref: https://platform.openai.com/docs/guides/function-calling
    """

    type: Literal["function"]
    function: FunctionToolDefinition | None = None


class BaseRequestPayload(BaseModel):
    """Common parameters used for chat completions and completion endpoints."""

    temperature: float = Field(0.0, ge=0, le=2)
    n: int = Field(1, ge=1)
    stop: list[str] | None = Field(None, min_length=1)
    max_tokens: int | None = Field(None, ge=1)
    stream: bool | None = None
    stream_options: dict[str, Any] | None = None
    model: str | None = None


# NB: For interface constructs that rely on other BaseModel implementations, in
# pydantic 1 the **order** in which classes are defined in this module is absolutely
# critical to prevent ForwardRef errors. Pydantic 2 does not have this limitation.
# To maintain compatibility with Pydantic 1, ensure that all classes that are defined in
# this file have dependencies defined higher than the line of usage.


class ChatChoice(BaseModel):
    index: int
    message: ChatMessage
    finish_reason: str | None = None


class ChatUsage(BaseModel):
    prompt_tokens: int | None = None
    completion_tokens: int | None = None
    total_tokens: int | None = None


class ToolCallDelta(BaseModel):
    index: int
    id: str | None = None
    type: str | None = None
    function: Function


class ChatChoiceDelta(BaseModel):
    role: str | None = None
    content: str | None = None
    tool_calls: list[ToolCallDelta] | None = None


class ChatChunkChoice(BaseModel):
    index: int
    finish_reason: str | None = None
    delta: ChatChoiceDelta


class ChatCompletionChunk(BaseModel):
    """A chunk of a chat completion stream response."""

    id: str | None = None
    object: str = "chat.completion.chunk"
    created: int
    model: str
    choices: list[ChatChunkChoice]


class ChatCompletionRequest(BaseRequestPayload):
    """
    A request to the chat completion API.

    Must be compatible with OpenAI's Chat Completion API.
    https://platform.openai.com/docs/api-reference/chat
    """

    messages: list[ChatMessage] = Field(..., min_length=1)
    tools: list[ChatTool] | None = Field(None, min_length=1)


class ChatCompletionResponse(BaseModel):
    """
    A response from the chat completion API.

    Must be compatible with OpenAI's Chat Completion API.
    https://platform.openai.com/docs/api-reference/chat
    """

    id: str | None = None
    object: str = "chat.completion"
    created: int
    model: str
    choices: list[ChatChoice]
    usage: ChatUsage
```

--------------------------------------------------------------------------------

````
