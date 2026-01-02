---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 865
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 865 of 991)

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

---[FILE: mock_openai.py]---
Location: mlflow-master/tests/openai/mock_openai.py
Signals: FastAPI, Pydantic

```python
import argparse
import json
from typing import Any

import fastapi
from pydantic import BaseModel
from starlette.responses import StreamingResponse

from mlflow.types.chat import ChatCompletionRequest

EMPTY_CHOICES = "EMPTY_CHOICES"
LIST_CONTENT = "LIST_CONTENT"

app = fastapi.FastAPI()


@app.get("/health")
def health():
    return {"status": "healthy"}


def chat_response(payload: ChatCompletionRequest):
    dumped_input = json.dumps([m.model_dump(exclude_unset=True) for m in payload.messages])
    return {
        "id": "chatcmpl-123",
        "object": "chat.completion",
        "created": 1677652288,
        "model": "gpt-4o-mini",
        "system_fingerprint": "fp_44709d6fcb",
        "choices": [
            {
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": dumped_input,
                },
                "logprobs": None,
                "finish_reason": "stop",
            }
        ],
        "usage": {
            "prompt_tokens": 9,
            "completion_tokens": 12,
            "total_tokens": 21,
        },
    }


def _make_chat_stream_chunk(content, include_usage: bool = False):
    return {
        "id": "chatcmpl-123",
        "object": "chat.completion.chunk",
        "created": 1677652288,
        "model": "gpt-4o-mini",
        "system_fingerprint": "fp_44709d6fcb",
        "choices": [
            {
                "delta": {
                    "content": content,
                    "function_call": None,
                    "role": None,
                    "tool_calls": None,
                },
                "finish_reason": None,
                "index": 0,
                "logprobs": None,
            }
        ],
        "usage": {
            "prompt_tokens": 9,
            "completion_tokens": 12,
            "total_tokens": 21,
        }
        if include_usage
        else None,
    }


def _make_chat_stream_chunk_empty_choices():
    return {
        "id": "chatcmpl-123",
        "object": "chat.completion.chunk",
        "created": 1677652288,
        "model": "gpt-4o-mini",
        "system_fingerprint": "fp_44709d6fcb",
        "choices": [],
        "usage": None,
    }


def _make_chat_stream_chunk_with_list_content(content_list, include_usage: bool = False):
    # Create a streaming chunk with list content (Databricks format).
    return {
        "id": "chatcmpl-123",
        "object": "chat.completion.chunk",
        "created": 1677652288,
        "model": "gpt-4o-mini",
        "system_fingerprint": "fp_44709d6fcb",
        "choices": [
            {
                "delta": {
                    "content": content_list,
                    "function_call": None,
                    "role": None,
                    "tool_calls": None,
                },
                "finish_reason": None,
                "index": 0,
                "logprobs": None,
            }
        ],
        "usage": {
            "prompt_tokens": 9,
            "completion_tokens": 12,
            "total_tokens": 21,
        }
        if include_usage
        else None,
    }


async def chat_response_stream(include_usage: bool = False):
    # OpenAI Chat Completion stream only includes usage in the last chunk
    # if {"stream_options": {"include_usage": True}} is specified in the request.
    yield _make_chat_stream_chunk("Hello", include_usage=False)
    yield _make_chat_stream_chunk(" world", include_usage=include_usage)


async def chat_response_stream_empty_choices():
    yield _make_chat_stream_chunk_empty_choices()
    yield _make_chat_stream_chunk("Hello")


async def chat_response_stream_with_list_content(include_usage: bool = False):
    # Simulate Databricks streaming format with list content.
    yield _make_chat_stream_chunk_with_list_content(
        [{"type": "text", "text": "Hello"}], include_usage=False
    )
    yield _make_chat_stream_chunk_with_list_content(
        [{"type": "text", "text": " world"}], include_usage=include_usage
    )


@app.post("/chat/completions", response_model_exclude_unset=True)
async def chat(payload: ChatCompletionRequest):
    if payload.stream:
        # SSE stream
        if EMPTY_CHOICES == payload.messages[0].content:
            content = (
                f"data: {json.dumps(d)}\n\n" async for d in chat_response_stream_empty_choices()
            )
        elif LIST_CONTENT == payload.messages[0].content:
            content = (
                f"data: {json.dumps(d)}\n\n"
                async for d in chat_response_stream_with_list_content(
                    include_usage=(payload.stream_options or {}).get("include_usage", False)
                )
            )
        else:
            content = (
                f"data: {json.dumps(d)}\n\n"
                async for d in chat_response_stream(
                    include_usage=(payload.stream_options or {}).get("include_usage", False)
                )
            )

        return StreamingResponse(
            content,
            media_type="text/event-stream",
        )
    else:
        return chat_response(payload)


def _make_responses_payload(outputs, tools=None):
    return {
        "id": "responses-123",
        "object": "response",
        "created": 1589478378,
        "status": "completed",
        "error": None,
        "incomplete_details": None,
        "max_output_tokens": None,
        "model": "gpt-4o",
        "output": outputs,
        "parallel_tool_calls": True,
        "previous_response_id": None,
        "reasoning": {"effort": None, "generate_summary": None},
        "store": True,
        "temperature": 1.0,
        "text": {"format": {"type": "text"}},
        "tool_choice": "auto",
        "tools": tools or [],
        "top_p": 1.0,
        "truncation": "disabled",
        "usage": {
            "input_tokens": 36,
            "input_tokens_details": {"cached_tokens": 0},
            "output_tokens": 87,
            "output_tokens_details": {"reasoning_tokens": 0},
            "total_tokens": 123,
        },
        "user": None,
        "metadata": {},
    }


_DUMMY_TEXT_OUTPUTS = [
    {
        "type": "message",
        "id": "test",
        "status": "completed",
        "role": "assistant",
        "content": [
            {
                "type": "output_text",
                "text": "Dummy output",
            }
        ],
    }
]

_DUMMY_WEB_SEARCH_OUTPUTS = [
    {"type": "web_search_call", "id": "tool_call_1", "status": "completed"},
    {
        "type": "message",
        "id": "msg",
        "status": "completed",
        "role": "assistant",
        "content": [
            {
                "type": "output_text",
                "text": "As of today, March 9, 2025, one notable positive news story...",
                "annotations": [
                    {
                        "type": "url_citation",
                        "start_index": 442,
                        "end_index": 557,
                        "url": "https://.../?utm_source=chatgpt.com",
                        "title": "...",
                    },
                ],
            }
        ],
    },
]

_DUMMY_FILE_SEARCH_OUTPUTS = [
    {
        "type": "file_search_call",
        "id": "file_search_1",
        "status": "completed",
        "queries": ["attributes of an ancient brown dragon"],
        "results": None,
    },
    {
        "type": "message",
        "id": "file_search_1",
        "status": "completed",
        "role": "assistant",
        "content": [
            {
                "type": "output_text",
                "text": "The attributes of an ancient brown dragon include...",
                "annotations": [
                    {
                        "type": "file_citation",
                        "index": 320,
                        "file_id": "file-4wDz5b167pAf72nx1h9eiN",
                        "filename": "dragons.pdf",
                    },
                    {
                        "type": "file_citation",
                        "index": 576,
                        "file_id": "file-4wDz5b167pAf72nx1h9eiN",
                        "filename": "dragons.pdf",
                    },
                ],
            }
        ],
    },
]

_DUMMY_COMPUTER_USE_OUTPUTS = [
    {
        "type": "reasoning",
        "id": "rs_67cc...",
        "summary": [{"type": "summary_text", "text": "Clicking on the browser address bar."}],
    },
    {
        "type": "computer_call",
        "id": "cu_67cc...",
        "call_id": "computer_call_1",
        "action": {"type": "click", "button": "left", "x": 156, "y": 50},
        "pending_safety_checks": [],
        "status": "completed",
    },
]

_DUMMY_FUNCTION_CALL_OUTPUTS = [
    {
        "type": "function_call",
        "id": "fc_67ca09c6bedc8190a7abfec07b1a1332096610f474011cc0",
        "call_id": "function_call_1",
        "name": "get_current_weather",
        "arguments": '{"location":"Boston, MA","unit":"celsius"}',
        "status": "completed",
    }
]

_DUMMY_RESPONSES_STREAM_EVENTS = [
    {
        "type": "response.created",
        "response": _make_responses_payload(outputs=[]),
    },
    {
        "content_index": 0,
        "delta": "Hello ",
        "item_id": 0,
        "output_index": 0,
        "type": "response.output_text.delta",
    },
    {
        "content_index": 0,
        "delta": "World",
        "item_id": 0,
        "output_index": 0,
        "type": "response.output_text.delta",
    },
    {
        "response": _make_responses_payload(outputs=_DUMMY_TEXT_OUTPUTS),
        "type": "response.completed",
    },
]


class ResponsesPayload(BaseModel):
    input: Any
    tools: list[Any] | None = None
    stream: bool = False


@app.post("/responses", response_model_exclude_unset=True)
async def responses(payload: ResponsesPayload):
    if payload.stream:
        content = (
            f"event: {d['type']}\ndata: {json.dumps(d)}\n\n" for d in _DUMMY_RESPONSES_STREAM_EVENTS
        )
        return StreamingResponse(content, media_type="text/event-stream")

    if tools := payload.tools or []:
        if tools[0]["type"] == "web_search_preview":
            outputs = _DUMMY_WEB_SEARCH_OUTPUTS
        elif tools[0]["type"] == "file_search":
            outputs = _DUMMY_FILE_SEARCH_OUTPUTS
        elif tools[0]["type"] == "computer_use_preview":
            outputs = _DUMMY_COMPUTER_USE_OUTPUTS
        elif tools[0]["type"] == "function":
            outputs = _DUMMY_FUNCTION_CALL_OUTPUTS
        else:
            raise fastapi.HTTPException(
                status_code=400,
                detail=f"Unsupported tool type: {tools[0]['type']}",
            )
        return _make_responses_payload(outputs, tools)

    return _make_responses_payload(outputs=_DUMMY_TEXT_OUTPUTS)


class CompletionsPayload(BaseModel):
    prompt: str | list[str]
    stream: bool = False


def completions_response(payload: CompletionsPayload):
    return {
        "id": "cmpl-uqkvlQyYK7bGYrRHQ0eXlWi7",
        "object": "text_completion",
        "created": 1589478378,
        "model": "gpt-4o-mini",
        "choices": [
            {
                "text": text,
                "index": 0,
                "logprobs": None,
                "finish_reason": "length",
            }
            for text in ([payload.prompt] if isinstance(payload.prompt, str) else payload.prompt)
        ],
        "usage": {"prompt_tokens": 5, "completion_tokens": 7, "total_tokens": 12},
    }


def _make_completions_stream_chunk(content):
    return {
        "id": "cmpl-uqkvlQyYK7bGYrRHQ0eXlWi7",
        "object": "text_completion",
        "created": 1589478378,
        "model": "gpt-4o-mini",
        "choices": [{"finish_reason": None, "index": 0, "logprobs": None, "text": content}],
        "system_fingerprint": None,
        "usage": {"prompt_tokens": 5, "completion_tokens": 7, "total_tokens": 12},
    }


def _make_completions_stream_chunk_empty_choices():
    return {
        "id": "cmpl-uqkvlQyYK7bGYrRHQ0eXlWi7",
        "object": "text_completion",
        "created": 1589478378,
        "model": "gpt-4o-mini",
        "choices": [],
        "system_fingerprint": None,
        "usage": None,
    }


async def completions_response_stream():
    yield _make_completions_stream_chunk("Hello")
    yield _make_completions_stream_chunk(" world")


async def completions_response_stream_empty_choices():
    yield _make_completions_stream_chunk_empty_choices()
    yield _make_completions_stream_chunk("Hello")


@app.post("/completions")
def completions(payload: CompletionsPayload):
    if payload.stream:
        if EMPTY_CHOICES == payload.prompt:
            content = (
                f"data: {json.dumps(d)}\n\n"
                async for d in completions_response_stream_empty_choices()
            )
        else:
            content = (f"data: {json.dumps(d)}\n\n" async for d in completions_response_stream())

        return StreamingResponse(
            content,
            media_type="text/event-stream",
        )
    else:
        return completions_response(payload)


class EmbeddingsPayload(BaseModel):
    input: str | list[str]


@app.post("/embeddings")
def embeddings(payload: EmbeddingsPayload):
    return {
        "object": "list",
        "data": [
            {
                "object": "embedding",
                "embedding": list(range(1536)),
                "index": 0,
            }
            for _ in range(1 if isinstance(payload.input, str) else len(payload.input))
        ],
        "model": "text-embedding-ada-002",
        "usage": {"prompt_tokens": 8, "total_tokens": 8},
    }


@app.get("/models/{model}")
def models(model: str):
    return {
        "id": model,
        "object": "model",
        "created": 1686935002,
        "owned_by": "openai",
    }


if __name__ == "__main__":
    import uvicorn

    parser = argparse.ArgumentParser()
    parser.add_argument("--host", type=str)
    parser.add_argument("--port", type=int)
    args = parser.parse_args()

    uvicorn.run(app, host=args.host, port=args.port)
```

--------------------------------------------------------------------------------

---[FILE: test_openai_agent_autolog.py]---
Location: mlflow-master/tests/openai/test_openai_agent_autolog.py

```python
import copy
import json
from unittest import mock

import openai
import pytest

try:
    import agents  # noqa: F401
except ImportError:
    pytest.skip("OpenAI SDK is not installed. Skipping tests.", allow_module_level=True)

from agents import Agent, Runner, function_tool, set_default_openai_client, trace
from agents.tracing import set_trace_processors
from openai.types.responses.function_tool import FunctionTool
from openai.types.responses.response import Response
from openai.types.responses.response_output_item import (
    ResponseFunctionToolCall,
    ResponseOutputMessage,
)
from openai.types.responses.response_output_text import ResponseOutputText

import mlflow
from mlflow.entities import SpanType
from mlflow.tracing.constant import SpanAttributeKey

from tests.tracing.helper import get_traces, purge_traces


def set_dummy_client(expected_responses):
    expected_responses = copy.deepcopy(expected_responses)

    async def _mocked_create(*args, **kwargs):
        return expected_responses.pop(0)

    async_client = openai.AsyncOpenAI(api_key="test")
    async_client.responses = mock.MagicMock()
    async_client.responses.create = _mocked_create

    set_default_openai_client(async_client)


@pytest.fixture(autouse=True)
def disable_default_tracing():
    # Disable default OpenAI tracer
    set_trace_processors([])


@pytest.mark.asyncio
async def test_autolog_agent():
    mlflow.openai.autolog()

    # NB: We have to mock the OpenAI SDK responses to make agent works
    DUMMY_RESPONSES = [
        Response(
            id="123",
            created_at=12345678.0,
            error=None,
            model="gpt-4o-mini",
            object="response",
            instructions="Handoff to the appropriate agent based on the language of the request.",
            output=[
                ResponseFunctionToolCall(
                    id="123",
                    arguments="{}",
                    call_id="123",
                    name="transfer_to_spanish_agent",
                    type="function_call",
                    status="completed",
                )
            ],
            tools=[
                FunctionTool(
                    name="transfer_to_spanish_agent",
                    parameters={"type": "object", "properties": {}, "required": []},
                    type="function",
                    description="Handoff to the Spanish_Agent agent to handle the request.",
                    strict=False,
                ),
            ],
            tool_choice="auto",
            temperature=1,
            parallel_tool_calls=True,
        ),
        Response(
            id="123",
            created_at=12345678.0,
            error=None,
            model="gpt-4o-mini",
            object="response",
            instructions="You only speak Spanish",
            output=[
                ResponseOutputMessage(
                    id="123",
                    content=[
                        ResponseOutputText(
                            annotations=[],
                            text="¡Hola! Estoy bien, gracias. ¿Y tú, cómo estás?",
                            type="output_text",
                        )
                    ],
                    role="assistant",
                    status="completed",
                    type="message",
                )
            ],
            tools=[],
            tool_choice="auto",
            temperature=1,
            parallel_tool_calls=True,
        ),
    ]

    set_dummy_client(DUMMY_RESPONSES)

    english_agent = Agent(name="English Agent", instructions="You only speak English")
    spanish_agent = Agent(name="Spanish Agent", instructions="You only speak Spanish")
    triage_agent = Agent(
        name="Triage Agent",
        instructions="Handoff to the appropriate agent based on the language of the request.",
        handoffs=[spanish_agent, english_agent],
    )

    messages = [{"role": "user", "content": "Hola.  ¿Como estás?"}]
    response = await Runner.run(starting_agent=triage_agent, input=messages)

    assert response.final_output == "¡Hola! Estoy bien, gracias. ¿Y tú, cómo estás?"
    traces = get_traces()
    assert len(traces) == 1
    trace = traces[0]
    assert trace.info.status == "OK"
    assert json.loads(trace.info.request_preview) == messages
    assert json.loads(trace.info.response_preview) == response.final_output
    spans = trace.data.spans
    assert len(spans) == 6  # 1 root + 2 agent + 1 handoff + 2 response
    assert spans[0].name == "AgentRunner.run"
    assert spans[0].span_type == SpanType.AGENT
    assert spans[0].inputs == messages
    assert spans[0].outputs == response.final_output
    assert spans[1].name == "Triage Agent"
    assert spans[1].parent_id == spans[0].span_id
    assert spans[2].name == "Response"
    assert spans[2].parent_id == spans[1].span_id
    assert spans[2].inputs == [{"role": "user", "content": "Hola.  ¿Como estás?"}]
    assert spans[2].outputs == [
        {
            "id": "123",
            "arguments": "{}",
            "call_id": "123",
            "name": "transfer_to_spanish_agent",
            "type": "function_call",
            "status": "completed",
        }
    ]
    assert spans[2].attributes["temperature"] == 1
    assert spans[3].name == "Handoff"
    assert spans[3].span_type == SpanType.CHAIN
    assert spans[3].parent_id == spans[1].span_id
    assert spans[4].name == "Spanish Agent"
    assert spans[4].parent_id == spans[0].span_id
    assert spans[5].name == "Response"
    assert spans[5].parent_id == spans[4].span_id

    # Validate chat attributes
    assert spans[2].attributes[SpanAttributeKey.CHAT_TOOLS] == [
        {
            "function": {
                "description": "Handoff to the Spanish_Agent agent to handle the request.",
                "name": "transfer_to_spanish_agent",
                "parameters": {
                    "additionalProperties": None,
                    "properties": {},
                    "required": [],
                    "type": "object",
                },
                "strict": False,
            },
            "type": "function",
        },
    ]
    assert SpanAttributeKey.CHAT_TOOLS not in spans[5].attributes


@pytest.mark.asyncio
async def test_autolog_agent_tool_exception():
    mlflow.openai.autolog()

    DUMMY_RESPONSES = [
        Response(
            id="123",
            created_at=12345678.0,
            error=None,
            model="gpt-4o-mini",
            object="response",
            instructions="You are an agent.",
            output=[
                ResponseFunctionToolCall(
                    id="123",
                    arguments="{}",
                    call_id="123",
                    name="always_fail",
                    type="function_call",
                    status="completed",
                )
            ],
            tools=[
                FunctionTool(
                    name="always_fail",
                    parameters={"type": "object", "properties": {}, "required": []},
                    type="function",
                    strict=False,
                ),
            ],
            tool_choice="auto",
            temperature=1,
            parallel_tool_calls=True,
        ),
    ]

    @function_tool(failure_error_function=None)  # Set error function None to avoid retry
    def always_fail():
        raise Exception("This function always fails")

    set_dummy_client(DUMMY_RESPONSES * 3)

    agent = Agent(name="Agent", instructions="You are an agent", tools=[always_fail])

    with pytest.raises(Exception, match="This function always fails"):
        await Runner.run(agent, [{"role": "user", "content": "Hi!"}])

    traces = get_traces()
    assert len(traces) == 1
    trace = traces[0]
    assert trace.info.status == "ERROR"
    spans = trace.data.spans
    assert len(spans) == 4  # 1 root + 1 function call + 1 get_chat_completion + 1 Completions
    assert spans[3].span_type == SpanType.TOOL
    assert spans[3].status.status_code == "ERROR"
    assert spans[3].status.description == "Error running tool"
    assert spans[3].events[0].name == "exception"


@pytest.mark.asyncio
async def test_autolog_agent_llm_exception():
    mlflow.openai.autolog()

    agent = Agent(name="Agent", instructions="You are an agent")
    messages = [{"role": "user", "content": "Hi!"}]

    # Mock OpenAI SDK to raise an exception
    async_client = openai.AsyncOpenAI(api_key="test")
    async_client.responses = mock.MagicMock()
    async_client.responses.create.side_effect = RuntimeError("Connection error")
    set_default_openai_client(async_client)

    with pytest.raises(RuntimeError, match="Connection error"):
        await Runner.run(agent, messages)

    traces = get_traces()
    assert len(traces) == 1
    trace = traces[0]
    assert trace.info.status == "ERROR"
    spans = trace.data.spans
    assert len(spans) == 3
    assert spans[0].name == "AgentRunner.run"
    assert spans[2].status.status_code == "ERROR"
    assert spans[2].status.description == "Error getting response"
    assert spans[2].events[0].name == "exception"
    assert spans[2].events[0].attributes["exception.message"] == "Error getting response"
    assert spans[2].events[0].attributes["exception.stacktrace"] == '{"error": "Connection error"}'


@pytest.mark.asyncio
async def test_autolog_agent_with_manual_trace():
    mlflow.openai.autolog()

    # NB: We have to mock the OpenAI SDK responses to make agent works
    DUMMY_RESPONSES = [
        Response(
            id="123",
            created_at=12345678.0,
            error=None,
            model="gpt-4o-mini",
            object="response",
            instructions="Tell funny jokes.",
            output=[
                ResponseOutputMessage(
                    id="123",
                    content=[
                        ResponseOutputText(
                            annotations=[],
                            text="Nice joke",
                            type="output_text",
                        )
                    ],
                    role="assistant",
                    status="completed",
                    type="message",
                )
            ],
            tools=[],
            tool_choice="auto",
            temperature=1,
            parallel_tool_calls=True,
        ),
    ]

    set_dummy_client(DUMMY_RESPONSES)

    agent = Agent(name="Joke agent", instructions="Tell funny jokes.")

    with mlflow.start_span("Parent span"):
        with trace("Joke workflow"):
            response = await Runner.run(agent, "Tell me a joke")

    assert response.final_output == "Nice joke"
    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    spans = traces[0].data.spans
    assert len(spans) == 5
    assert spans[0].name == "Parent span"
    assert spans[1].name == "Joke workflow"
    assert spans[2].name == "AgentRunner.run"
    assert spans[3].name == "Joke agent"
    assert spans[4].name == "Response"


@pytest.mark.asyncio
async def test_disable_enable_autolog():
    # NB: We have to mock the OpenAI SDK responses to make agent works
    DUMMY_RESPONSES = [
        Response(
            id="123",
            created_at=12345678.0,
            error=None,
            model="gpt-4o-mini",
            object="response",
            instructions="You are daddy joke teller.",
            output=[
                ResponseOutputMessage(
                    id="123",
                    content=[
                        ResponseOutputText(
                            annotations=[],
                            text="Why is Peter Pan always flying?",
                            type="output_text",
                        )
                    ],
                    role="assistant",
                    status="completed",
                    type="message",
                )
            ],
            tools=[],
            tool_choice="auto",
            temperature=1,
            parallel_tool_calls=True,
        ),
    ]

    set_dummy_client(DUMMY_RESPONSES * 5)

    agent = Agent(name="Agent", instructions="You are daddy joke teller")
    messages = [{"role": "user", "content": "Tell me a joke"}]

    # Enable tracing
    mlflow.openai.autolog()

    await Runner.run(agent, messages)

    traces = get_traces()
    assert len(traces) == 1
    purge_traces()

    # Enabling autolog again should not cause duplicate traces
    mlflow.openai.autolog()
    mlflow.openai.autolog()

    await Runner.run(agent, messages)

    traces = get_traces()
    assert len(traces) == 1
    purge_traces()

    # Disable tracing
    mlflow.openai.autolog(disable=True)

    await Runner.run(agent, messages)

    assert get_traces() == []
```

--------------------------------------------------------------------------------

````
