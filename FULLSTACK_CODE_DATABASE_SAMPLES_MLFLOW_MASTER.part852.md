---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 852
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 852 of 991)

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

---[FILE: test_llama_index_tracer.py]---
Location: mlflow-master/tests/llama_index/test_llama_index_tracer.py

```python
import asyncio
import base64
import inspect
import random
from dataclasses import asdict
from pathlib import Path
from typing import Any
from unittest.mock import ANY

import importlib_metadata
import llama_index.core
import openai
import pytest
from llama_index.core import Settings
from llama_index.core.base.response.schema import StreamingResponse
from llama_index.core.llms import ChatMessage, ChatResponse
from llama_index.core.llms.callbacks import llm_chat_callback
from llama_index.core.retrievers import VectorIndexRetriever
from llama_index.core.tools import FunctionTool
from llama_index.core.workflow import Context
from llama_index.llms.openai import OpenAI
from openai.types.chat import ChatCompletionMessageToolCall
from packaging.version import Version

import mlflow
import mlflow.tracking._tracking_service
from mlflow.entities.span import SpanType
from mlflow.entities.span_status import SpanStatusCode
from mlflow.entities.trace_status import TraceStatus
from mlflow.llama_index.tracer import (
    StreamResolver,
    remove_llama_index_tracer,
    set_llama_index_tracer,
)
from mlflow.tracing.constant import SpanAttributeKey, TokenUsageKey
from mlflow.tracing.provider import _get_tracer
from mlflow.tracking._tracking_service.utils import _use_tracking_uri

from tests.tracing.helper import get_traces, skip_when_testing_trace_sdk

llama_core_version = Version(importlib_metadata.version("llama-index-core"))
llama_oai_version = Version(importlib_metadata.version("llama-index-llms-openai"))

# Detect llama-index-workflows version to handle API changes
try:
    llama_workflows_version = Version(importlib_metadata.version("llama-index-workflows"))
except importlib_metadata.PackageNotFoundError:
    llama_workflows_version = None


@pytest.fixture(autouse=True)
def set_handlers():
    set_llama_index_tracer()
    yield
    # Clean up
    remove_llama_index_tracer()


@pytest.mark.parametrize("is_async", [True, False])
def test_trace_llm_complete(is_async):
    # By default llama-index uses "gpt-3.5-turbo" model that only has chat interface,
    # and llama-index redirects completion call to chat endpoint. We use non-chat
    # model here to test trace for completion.
    model_name = "gpt-3.5-turbo-instruct"
    llm = OpenAI(model=model_name)

    response = asyncio.run(llm.acomplete("Hello")) if is_async else llm.complete("Hello")
    assert response.text == "Hello"

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == TraceStatus.OK

    spans = traces[0].data.spans
    assert len(spans) == 1
    assert spans[0].name == "OpenAI.{}complete".format("a" if is_async else "")
    assert spans[0].span_type == SpanType.LLM
    assert spans[0].inputs == {"args": ["Hello"]}
    assert spans[0].outputs["text"] == "Hello"

    attr = spans[0].attributes
    assert (
        attr["usage"].items()
        >= {
            "prompt_tokens": 5,
            "completion_tokens": 7,
            "total_tokens": 12,
            "completion_tokens_details": None,
            "prompt_tokens_details": None,
        }.items()
    )
    assert attr[SpanAttributeKey.CHAT_USAGE] == {
        TokenUsageKey.INPUT_TOKENS: 5,
        TokenUsageKey.OUTPUT_TOKENS: 7,
        TokenUsageKey.TOTAL_TOKENS: 12,
    }

    assert attr["prompt"] == "Hello"
    assert attr["invocation_params"]["model_name"] == model_name
    assert attr["model_dict"]["model"] == model_name

    assert traces[0].info.token_usage == {
        TokenUsageKey.INPUT_TOKENS: 5,
        TokenUsageKey.OUTPUT_TOKENS: 7,
        TokenUsageKey.TOTAL_TOKENS: 12,
    }


def test_trace_llm_complete_stream():
    model_name = "gpt-3.5-turbo"
    llm = OpenAI(model=model_name)

    response_gen = llm.stream_complete("Hello", stream_options={"include_usage": True})
    # No trace should be created until the generator is consumed
    assert len(get_traces()) == 0
    assert inspect.isgenerator(response_gen)

    response = [r.text for r in response_gen]
    assert response == ["Hello", "Hello world"]

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == TraceStatus.OK

    spans = traces[0].data.spans
    assert len(spans) == 1
    assert spans[0].name == "OpenAI.stream_complete"
    assert spans[0].span_type == SpanType.LLM
    assert spans[0].inputs == {
        "args": ["Hello"],
        "kwargs": {"stream_options": {"include_usage": True}},
    }
    assert spans[0].outputs["text"] == "Hello world"

    attr = spans[0].attributes
    assert (
        attr["usage"].items()
        >= {
            "prompt_tokens": 9,
            "completion_tokens": 12,
            "total_tokens": 21,
            "completion_tokens_details": None,
            "prompt_tokens_details": None,
        }.items()
    )
    assert attr[SpanAttributeKey.CHAT_USAGE] == {
        TokenUsageKey.INPUT_TOKENS: 9,
        TokenUsageKey.OUTPUT_TOKENS: 12,
        TokenUsageKey.TOTAL_TOKENS: 21,
    }
    assert attr["prompt"] == "Hello"
    assert attr["invocation_params"]["model_name"] == model_name
    assert attr["model_dict"]["model"] == model_name
    assert traces[0].info.token_usage == {
        TokenUsageKey.INPUT_TOKENS: 9,
        TokenUsageKey.OUTPUT_TOKENS: 12,
        TokenUsageKey.TOTAL_TOKENS: 21,
    }


def _get_llm_input_content_json(content):
    if Version(llama_index.core.__version__) >= Version("0.12.5"):
        # in llama-index >= 0.12.5, the input content json format is changed to
        # {"blocks": {"block_type": "text", "text": <content>} }
        return {
            "blocks": [
                {
                    "block_type": "text",
                    "text": content,
                }
            ]
        }
    return {"content": content}


@pytest.mark.parametrize("is_async", [True, False])
def test_trace_llm_chat(is_async):
    llm = OpenAI()
    message = ChatMessage(role="system", content="Hello")

    response = asyncio.run(llm.achat([message])) if is_async else llm.chat([message])
    assert isinstance(response.message, ChatMessage)
    assert response.message.content == '[{"role": "system", "content": "Hello"}]'

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == TraceStatus.OK

    spans = traces[0].data.spans
    assert len(spans) == 1
    assert spans[0].name == "OpenAI.achat" if is_async else "OpenAI.chat"
    assert spans[0].span_type == SpanType.CHAT_MODEL

    content_json = _get_llm_input_content_json("Hello")
    assert spans[0].inputs == {
        "messages": [{"role": "system", **content_json, "additional_kwargs": {}}]
    }
    # `additional_kwargs` was broken until 0.1.30 release of llama-index-llms-openai
    expected_kwargs = (
        {"completion_tokens": 12, "prompt_tokens": 9, "total_tokens": 21}
        if llama_oai_version >= Version("0.1.30")
        else {}
    )
    output_content_json = _get_llm_input_content_json('[{"role": "system", "content": "Hello"}]')
    assert spans[0].outputs == {
        "message": {
            "role": "assistant",
            **output_content_json,
            "additional_kwargs": {},
        },
        "raw": ANY,
        "delta": None,
        "logprobs": None,
        "additional_kwargs": expected_kwargs,
    }

    attr = spans[0].attributes
    assert (
        attr["usage"].items()
        >= {
            "prompt_tokens": 9,
            "completion_tokens": 12,
            "total_tokens": 21,
            "completion_tokens_details": None,
            "prompt_tokens_details": None,
        }.items()
    )
    assert attr[SpanAttributeKey.CHAT_USAGE] == {
        TokenUsageKey.INPUT_TOKENS: 9,
        TokenUsageKey.OUTPUT_TOKENS: 12,
        TokenUsageKey.TOTAL_TOKENS: 21,
    }
    assert attr["invocation_params"]["model_name"] == llm.metadata.model_name
    assert attr["model_dict"]["model"] == llm.metadata.model_name
    assert traces[0].info.token_usage == {
        TokenUsageKey.INPUT_TOKENS: 9,
        TokenUsageKey.OUTPUT_TOKENS: 12,
        TokenUsageKey.TOTAL_TOKENS: 21,
    }


def _get_image_content(image_path):
    with open(image_path, "rb") as f:
        content = f.read()
        return base64.b64encode(content).decode("utf-8")


def _multi_modal_test_cases():
    if llama_core_version < Version("0.12.0"):
        return []

    from llama_index.core.base.llms.types import ImageBlock

    image_dir = Path(__file__).parent.parent / "resources" / "images"

    image_base64 = _get_image_content(str(image_dir / "test.png"))
    test_cases = [
        (
            ImageBlock(url="https://example/image.jpg"),
            {"url": "https://example/image.jpg"}
            if llama_core_version < Version("0.12.30")
            else {"url": "https://example/image.jpg", "detail": "auto"},
        ),
        # LlamaIndex support passing local image path
        (
            ImageBlock(path=str(image_dir / "test.png"), image_mimetype="image/png"),
            {
                "url": f"data:image/png;base64,{image_base64}",
                "detail": "low" if llama_core_version < Version("0.12.25") else "auto",
            },
        ),
    ]

    # LlamaIndex < 0.12.3 doesn't support image content in byte format
    if llama_core_version >= Version("0.12.3"):
        image_bytes = _get_image_content(str(image_dir / "test.png"))
        test_cases.append(
            (
                ImageBlock(image=image_bytes, detail="low"),
                {
                    "url": f"data:image/png;base64,{image_bytes}",
                    "detail": "low",
                },
            ),
        )

    return test_cases


@pytest.mark.skipif(llama_core_version < Version("0.12.0"), reason="Multi-modal not supported")
@pytest.mark.parametrize(("image_block", "expected_image_url"), _multi_modal_test_cases())
def test_trace_llm_chat_multi_modal(image_block, expected_image_url):
    from llama_index.core.base.llms.types import TextBlock

    llm = OpenAI()
    message = ChatMessage(
        role="user", blocks=[TextBlock(text="What is in the image?"), image_block]
    )
    llm.chat([message])

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == TraceStatus.OK

    spans = traces[0].data.spans
    assert len(spans) == 1
    assert spans[0].span_type == SpanType.CHAT_MODEL


def test_trace_llm_chat_stream():
    llm = OpenAI()
    message = ChatMessage(role="system", content="Hello")

    response_gen = llm.stream_chat([message], stream_options={"include_usage": True})
    # No trace should be created until the generator is consumed
    assert len(get_traces()) == 0
    assert inspect.isgenerator(response_gen)

    chunks = list(response_gen)
    assert len(chunks) == 2
    assert all(isinstance(c.message, ChatMessage) for c in chunks)
    assert [c.message.content for c in chunks] == ["Hello", "Hello world"]

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == TraceStatus.OK

    spans = traces[0].data.spans
    assert len(spans) == 1
    assert spans[0].name == "OpenAI.stream_chat"
    assert spans[0].span_type == SpanType.CHAT_MODEL

    content_json = _get_llm_input_content_json("Hello")
    assert spans[0].inputs == {
        "messages": [{"role": "system", **content_json, "additional_kwargs": {}}],
        "kwargs": {"stream_options": {"include_usage": True}},
    }
    # `additional_kwargs` was broken until 0.1.30 release of llama-index-llms-openai
    expected_kwargs = (
        {"completion_tokens": 12, "prompt_tokens": 9, "total_tokens": 21}
        if llama_oai_version >= Version("0.1.30")
        else {}
    )
    output_content_json = _get_llm_input_content_json("Hello world")
    assert spans[0].outputs == {
        "message": {
            "role": "assistant",
            **output_content_json,
            "additional_kwargs": {},
        },
        "raw": ANY,
        "delta": " world",
        "logprobs": None,
        "additional_kwargs": expected_kwargs,
    }

    attr = spans[0].attributes
    assert (
        attr["usage"].items()
        >= {
            "prompt_tokens": 9,
            "completion_tokens": 12,
            "total_tokens": 21,
            "completion_tokens_details": None,
            "prompt_tokens_details": None,
        }.items()
    )
    assert attr[SpanAttributeKey.CHAT_USAGE] == {
        TokenUsageKey.INPUT_TOKENS: 9,
        TokenUsageKey.OUTPUT_TOKENS: 12,
        TokenUsageKey.TOTAL_TOKENS: 21,
    }
    assert attr["invocation_params"]["model_name"] == llm.metadata.model_name
    assert attr["model_dict"]["model"] == llm.metadata.model_name
    assert traces[0].info.token_usage == {
        TokenUsageKey.INPUT_TOKENS: 9,
        TokenUsageKey.OUTPUT_TOKENS: 12,
        TokenUsageKey.TOTAL_TOKENS: 21,
    }


@pytest.mark.parametrize("is_stream", [True, False])
def test_trace_llm_error(monkeypatch, is_stream):
    # Disable callback as it doesn't handle error response well
    monkeypatch.setattr(Settings, "callback_manager", None)

    llm = OpenAI(
        api_base="http://localhost:1234/invalid/base",
        timeout=1,
        max_retries=0,
    )
    message = ChatMessage(role="system", content="Hello")

    with pytest.raises(openai.APIConnectionError, match="Connection error."):  # noqa PT012
        if is_stream:
            next(llm.stream_chat([message]))
        else:
            llm.chat([message])

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == TraceStatus.ERROR
    spans = traces[0].data.spans
    assert len(spans) == 1
    assert spans[0].name == "OpenAI.stream_chat" if is_stream else "OpenAI.chat"
    assert spans[0].span_type == SpanType.CHAT_MODEL
    assert spans[0].inputs == {"messages": [message.model_dump()]}
    assert spans[0].outputs is None
    events = traces[0].data.spans[0].events
    assert len(events) == 1
    assert events[0].attributes["exception.message"] == "Connection error."


@pytest.mark.parametrize("is_async", [True, False])
def test_trace_retriever(multi_index, is_async):
    retriever = VectorIndexRetriever(multi_index, similarity_top_k=3)

    if is_async:
        retrieved = asyncio.run(retriever.aretrieve("apple"))
    else:
        retrieved = retriever.retrieve("apple")
    assert len(retrieved) == 1

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == TraceStatus.OK

    spans = traces[0].data.spans
    assert len(spans) == 4
    for i in range(1, 4):
        assert spans[i].parent_id == spans[i - 1].span_id

    assert spans[0].name.endswith("Retriever.aretrieve" if is_async else "Retriever.retrieve")
    assert spans[0].span_type == SpanType.RETRIEVER
    assert spans[0].inputs == {"str_or_query_bundle": "apple"}
    assert len(spans[0].outputs) == 1

    if Version(llama_index.core.__version__) >= Version("0.12.5"):
        retrieved_text = retrieved[0].node.text
    else:
        retrieved_text = retrieved[0].text
    assert spans[0].outputs[0]["page_content"] == retrieved_text

    assert spans[1].name.startswith("VectorIndexRetriever")
    assert spans[1].span_type == SpanType.RETRIEVER
    assert spans[1].inputs["query_bundle"]["query_str"] == "apple"
    assert spans[1].outputs == spans[0].outputs

    assert "Embedding" in spans[2].name
    assert spans[2].span_type == SpanType.EMBEDDING
    assert spans[2].inputs == {"query": "apple"}
    assert len(spans[2].outputs) == 1536  # embedding size
    assert spans[2].attributes["model_name"] == Settings.embed_model.model_name

    assert "Embedding" in spans[3].name
    assert spans[3].span_type == SpanType.EMBEDDING
    assert spans[3].inputs == {"query": "apple"}
    assert len(spans[3].outputs) == 1536  # embedding size
    assert spans[3].attributes["model_name"] == Settings.embed_model.model_name


@pytest.mark.parametrize("is_stream", [False, True])
@pytest.mark.parametrize("is_async", [False, True])
def test_trace_query_engine(multi_index, is_stream, is_async):
    if is_stream and is_async:
        pytest.skip("Async stream is not supported yet")

    engine = multi_index.as_query_engine(streaming=is_stream)

    if is_stream:
        response = engine.query("Hello")
        assert isinstance(response, StreamingResponse)
        response = "".join(response.response_gen)
        assert response == "Hello world"
    else:
        response = asyncio.run(engine.aquery("Hello")) if is_async else engine.query("Hello")
        assert response.response.startswith('[{"role": "system", "content": "You are an')
        response = asdict(response)
        if Version(llama_index.core.__version__) > Version("0.10.68"):
            response["source_nodes"] = [n.dict() for n in response["source_nodes"]]

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == TraceStatus.OK

    # Async methods have "a" prefix
    prefix = "a" if is_async else ""

    # Validate span attributes for some key spans
    spans = traces[0].data.spans
    assert spans[0].name.endswith(f"QueryEngine.{prefix}query")
    assert spans[0].span_type == SpanType.CHAIN
    assert spans[0].inputs == {"str_or_query_bundle": "Hello"}
    assert spans[0].outputs == response


@pytest.mark.skipif(llama_core_version >= Version("0.13.0"), reason="OpenAIAgent is removed")
def test_trace_agent():
    from llama_index.agent.openai import OpenAIAgent

    # Mock LLM to return deterministic responses and let the agent use a tool
    class MockLLMForAgent(OpenAI, extra="allow"):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self._mock_response = iter(
                [
                    ChatResponse(
                        message=ChatMessage(
                            role="assistant",
                            content=None,
                            additional_kwargs={
                                "tool_calls": [
                                    ChatCompletionMessageToolCall(
                                        id="test",
                                        function={
                                            "name": "add",
                                            "arguments": '{"a": 1, "b": 2}',
                                        },
                                        type="function",
                                    )
                                ]
                            },
                        )
                    ),
                    ChatResponse(
                        message=ChatMessage(
                            role="assistant",
                            content="The result is 3",
                        )
                    ),
                ]
            )

        @llm_chat_callback()
        def chat(self, *args, **kwargs):
            return next(self._mock_response)

    def add(a: int, b: int) -> int:
        """Add two integers and returns the result integer"""
        return a + b

    add_tool = FunctionTool.from_defaults(fn=add)

    llm = MockLLMForAgent()
    agent = OpenAIAgent.from_tools([add_tool], llm=llm)
    response = agent.chat("What is 1 + 2?").response

    assert response == "The result is 3"

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == TraceStatus.OK

    spans = traces[0].data.spans
    name_to_span = {span.name: span for span in spans}
    tool_span = name_to_span["FunctionTool.call"]
    assert tool_span.span_type == SpanType.TOOL
    assert tool_span.inputs == {"kwargs": {"a": 1, "b": 2}}
    assert tool_span.outputs.get("raw_output") == 3
    assert tool_span.attributes["name"] == "add"
    assert tool_span.attributes["description"] is not None
    assert tool_span.attributes["parameters"] is not None

    # Validate the chat messages and tool calls are captured in LLM span attributes
    llm_spans = [s for s in spans if s.span_type == SpanType.CHAT_MODEL]
    assert len(llm_spans) == 2
    assert llm_spans[0].get_attribute(SpanAttributeKey.CHAT_TOOLS) == [
        {
            "function": {
                "name": "add",
                "description": (
                    "add(a: int, b: int) -> int\nAdd two integers and returns the result integer"
                ),
                "parameters": {
                    "properties": {
                        "a": {
                            "title": "A",
                            "type": "integer",
                        },
                        "b": {
                            "title": "B",
                            "type": "integer",
                        },
                    },
                    "required": ["a", "b"],
                    "type": "object",
                },
            },
            "type": "function",
        }
    ]


@pytest.mark.parametrize("is_stream", [False, True])
@pytest.mark.parametrize("is_async", [False, True])
def test_trace_chat_engine(multi_index, is_stream, is_async):
    if is_stream:
        if is_async:
            pytest.skip("Async stream is not supported yet")

        # Skip streaming test for llama-index <0.13 due to race condition with OpenAIAgent
        # where child spans are created after root span completes, causing incomplete traces
        if llama_core_version < Version("0.13.0"):
            pytest.skip("Streaming chat engine test is flaky for llama-index <0.13")

    engine = multi_index.as_chat_engine()

    if is_stream:
        response_gen = engine.stream_chat("Hello").response_gen
        response = "".join(response_gen)
        assert response == "Hello world"
    else:
        response = asyncio.run(engine.achat("Hello")) if is_async else engine.chat("Hello")
        # a default prompt is added in llama-index 0.13.0
        # https://github.com/run-llama/llama_index/blob/1e02c7a2324838f7bd5a52c811d35c30dc6a6bd2/llama-index-core/llama_index/core/chat_engine/condense_plus_context.py#L40
        assert '{"role": "user", "content": "Hello"}' in response.response

    # Since chat engine is a complex agent-based system, it is challenging to strictly
    # validate the trace structure and attributes. The detailed validation is done in
    # other tests for individual components.
    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == TraceStatus.OK
    root_span = traces[0].data.spans[0]
    assert root_span.inputs == {"message": "Hello"}


@skip_when_testing_trace_sdk
def test_tracer_handle_tracking_uri_update(tmp_path):
    OpenAI().complete("Hello")
    assert len(get_traces()) == 1

    # Set different tracking URI and initialize the tracer
    with _use_tracking_uri(tmp_path / "dummy"):
        assert len(get_traces()) == 0

        # The new trace will be logged to the updated tracking URI
        OpenAI().complete("Hello")
        assert len(get_traces()) == 1


# Utility functions to set/get a value in the workflow context, handling API differences:
#
# - For llama-index-workflows < 2.0: ctx.set(key, value) and ctx.get(key)
# - For llama-index-workflows >= 2.0: ctx.store.set(key, value) and ctx.store.get(key)
#
# See: https://github.com/run-llama/workflows-py/pull/55
async def context_set(ctx: Context, key: str, value: Any) -> None:
    if llama_workflows_version and llama_workflows_version.major >= 2:
        await ctx.store.set(key, value)
    else:
        await ctx.set(key, value)


async def context_get(ctx: Context, key: str) -> Any:
    if llama_workflows_version and llama_workflows_version.major >= 2:
        return await ctx.store.get(key)
    else:
        return await ctx.get(key)


@pytest.mark.skipif(
    llama_core_version < Version("0.11.0"),
    reason="Workflow was introduced in 0.11.0",
)
@pytest.mark.asyncio
async def test_tracer_simple_workflow():
    from llama_index.core.workflow import StartEvent, StopEvent, Workflow, step

    class MyWorkflow(Workflow):
        @step
        async def my_step(self, ev: StartEvent) -> StopEvent:
            return StopEvent(result="Hi, world!")

    w = MyWorkflow(timeout=10, verbose=False)
    await w.run()

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == TraceStatus.OK
    assert all(s.status.status_code == SpanStatusCode.OK for s in traces[0].data.spans)


@pytest.mark.skipif(
    llama_core_version < Version("0.11.0"),
    reason="Workflow was introduced in 0.11.0",
)
@pytest.mark.asyncio
async def test_tracer_parallel_workflow():
    from llama_index.core.workflow import (
        Context,
        Event,
        StartEvent,
        StopEvent,
        Workflow,
        step,
    )

    class ProcessEvent(Event):
        data: str

    class ResultEvent(Event):
        result: str

    class ParallelWorkflow(Workflow):
        @step
        async def start(self, ctx: Context, ev: StartEvent) -> ProcessEvent:
            await context_set(ctx, "num_to_collect", len(ev.inputs))
            for item in ev.inputs:
                ctx.send_event(ProcessEvent(data=item))
            return None

        @step(num_workers=3)
        async def process_data(self, ev: ProcessEvent) -> ResultEvent:
            # Simulate some time-consuming processing
            await asyncio.sleep(random.randint(1, 2))
            return ResultEvent(result=ev.data)

        @step
        async def combine_results(self, ctx: Context, ev: ResultEvent) -> StopEvent:
            num_to_collect = await context_get(ctx, "num_to_collect")
            results = ctx.collect_events(ev, [ResultEvent] * num_to_collect)
            if results is None:
                return None

            combined_result = ", ".join(sorted([event.result for event in results]))
            return StopEvent(result=combined_result)

    w = ParallelWorkflow()
    result = await w.run(inputs=["apple", "grape", "orange", "banana"])
    assert result == "apple, banana, grape, orange"

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == TraceStatus.OK
    for s in traces[0].data.spans:
        assert s.status.status_code == SpanStatusCode.OK

    root_span = traces[0].data.spans[0]
    assert root_span.inputs == {"kwargs": {"inputs": ["apple", "grape", "orange", "banana"]}}
    assert root_span.outputs == "apple, banana, grape, orange"


@pytest.mark.skipif(
    llama_core_version < Version("0.11.0"),
    reason="Workflow was introduced in 0.11.0",
)
@pytest.mark.asyncio
async def test_tracer_parallel_workflow_with_custom_spans():
    from llama_index.core.workflow import (
        Context,
        Event,
        StartEvent,
        StopEvent,
        Workflow,
        step,
    )

    class ProcessEvent(Event):
        data: str

    class ResultEvent(Event):
        result: str

    class ParallelWorkflow(Workflow):
        @step
        async def start(self, ctx: Context, ev: StartEvent) -> ProcessEvent:
            await context_set(ctx, "num_to_collect", len(ev.inputs))
            for item in ev.inputs:
                ctx.send_event(ProcessEvent(data=item))
            return None

        @step(num_workers=3)
        async def process_data(self, ev: ProcessEvent) -> ResultEvent:
            # Simulate some time-consuming processing
            await asyncio.sleep(random.randint(1, 2))
            with mlflow.start_span(name="custom_inner_span_worker"):
                pass
            return ResultEvent(result=ev.data)

        @step
        async def combine_results(self, ctx: Context, ev: ResultEvent) -> StopEvent:
            num_to_collect = await context_get(ctx, "num_to_collect")
            results = ctx.collect_events(ev, [ResultEvent] * num_to_collect)
            if results is None:
                return None

            with mlflow.start_span(name="custom_inner_result_span") as span:
                span.set_inputs(results)
                combined_result = ", ".join(sorted([event.result for event in results]))
                span.set_outputs(combined_result)
            return StopEvent(result=combined_result)

    w = ParallelWorkflow()
    inputs = ["apple", "grape", "orange", "banana"]

    result = await w.run(inputs=inputs)
    assert result == "apple, banana, grape, orange"

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == TraceStatus.OK

    spans = traces[0].data.spans
    assert all(s.status.status_code == SpanStatusCode.OK for s in spans)

    workflow_span = spans[0]
    assert workflow_span.inputs == {"kwargs": {"inputs": inputs}}
    assert workflow_span.outputs == result

    inner_worker_spans = [s for s in spans if s.name.startswith("custom_inner_span_worker")]
    assert len(inner_worker_spans) == len(inputs)

    inner_result_span = next(s for s in spans if s.name == "custom_inner_result_span")
    assert inner_result_span.inputs is not None
    assert inner_result_span.outputs == result


@pytest.mark.asyncio
@pytest.mark.parametrize("should_close", [True, False])
async def test_stream_resolver_with_async_generator(should_close):
    async def async_generator():
        yield "chunk1"
        yield "chunk2"

    resolver = StreamResolver()
    tracer = _get_tracer(__name__)

    agen = async_generator()
    if should_close:
        async for _ in agen:
            pass

    with tracer.start_as_current_span("test_closed_async") as otel_span:
        from mlflow.entities.span import LiveSpan

        trace_id = f"{otel_span.context.trace_id:032x}"
        span = LiveSpan(otel_span=otel_span, trace_id=trace_id)

        # Should detect that the generator is closed and return False
        result = resolver.register_stream_span(span, agen)
        assert result == (not should_close)
```

--------------------------------------------------------------------------------

---[FILE: basic_chat_engine.py]---
Location: mlflow-master/tests/llama_index/sample_code/basic_chat_engine.py

```python
"""
Sample code to define a chat engine and save it with model-from-code logging.

Ref: https://qdrant.tech/documentation/quickstart/
"""

from llama_index.core import Document, VectorStoreIndex
from llama_index.core.chat_engine.types import ChatMode

import mlflow

index = VectorStoreIndex.from_documents(documents=[Document.example()])
# Setting SIMPLE chat mode will create a SimpleChatEngine instance
chat_engine = index.as_chat_engine(chat_mode=ChatMode.SIMPLE)

mlflow.models.set_model(chat_engine)
```

--------------------------------------------------------------------------------

---[FILE: basic_retriever.py]---
Location: mlflow-master/tests/llama_index/sample_code/basic_retriever.py

```python
from llama_index.core import Document, VectorStoreIndex

import mlflow

index = VectorStoreIndex.from_documents(documents=[Document.example()])
retriever = index.as_retriever()

mlflow.models.set_model(retriever)
```

--------------------------------------------------------------------------------

---[FILE: basic_vector_store.py]---
Location: mlflow-master/tests/llama_index/sample_code/basic_vector_store.py

```python
from llama_index.core import Document, VectorStoreIndex

import mlflow

index = VectorStoreIndex.from_documents(documents=[Document.example()])

mlflow.models.set_model(index)
```

--------------------------------------------------------------------------------

---[FILE: external_vector_store.py]---
Location: mlflow-master/tests/llama_index/sample_code/external_vector_store.py

```python
"""
Sample code to define an index using an external vector store (Faiss) for model-from-code logging.

Ref: https://qdrant.tech/documentation/quickstart/
"""

from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, PointStruct, VectorParams

import mlflow

# Run Qdrant with in-memory mode for testing purpose
client = QdrantClient(location=":memory:")
client.create_collection(
    collection_name="test",
    # 1536 is the size of OpenAI embeddings
    vectors_config=VectorParams(size=1536, distance=Distance.DOT),
)
# dummy embeddings
vec = [0.1] * 1536
client.upsert(
    collection_name="test",
    wait=True,
    points=[
        PointStruct(id=1, vector=vec, payload={"text": "hi"}),
        PointStruct(id=1, vector=vec, payload={"text": "hola"}),
    ],
)

vector_store = QdrantVectorStore(client=client, collection_name="test")
index = VectorStoreIndex.from_vector_store(vector_store=vector_store)


mlflow.models.set_model(index)
```

--------------------------------------------------------------------------------

---[FILE: model_config.yaml]---
Location: mlflow-master/tests/llama_index/sample_code/model_config.yaml

```yaml
llm:
  model_name: "gpt-4o-mini"
  temperature: 0.7
```

--------------------------------------------------------------------------------

---[FILE: query_engine_with_reranker.py]---
Location: mlflow-master/tests/llama_index/sample_code/query_engine_with_reranker.py

```python
"""
Sample code to define a query engine with post processors and save it with model-from-code logging.

Ref: https://qdrant.tech/documentation/quickstart/
"""

from llama_index.core import Document, QueryBundle, VectorStoreIndex
from llama_index.core.postprocessor import LLMRerank
from llama_index.core.postprocessor.types import BaseNodePostprocessor
from llama_index.core.schema import NodeWithScore

import mlflow

index = VectorStoreIndex.from_documents(documents=[Document.example()])

# Postprocessor 1: Reranker
reranker = LLMRerank(
    choice_batch_size=5,
    top_n=2,
)


# Postprocessor 2: custom postprocessor
class CustomNodePostprocessor(BaseNodePostprocessor):
    call_count: int = 0

    def _postprocess_nodes(
        self, nodes: list[NodeWithScore], query_bundle: QueryBundle | None
    ) -> list[NodeWithScore]:
        # subtracts 1 from the score
        self.call_count += 1
        return nodes


query_engine = index.as_query_engine(
    similarity_top_k=5,
    node_postprocessors=[reranker, CustomNodePostprocessor()],
)


mlflow.models.set_model(query_engine)
```

--------------------------------------------------------------------------------

---[FILE: simple_workflow.py]---
Location: mlflow-master/tests/llama_index/sample_code/simple_workflow.py

```python
from llama_index.core.workflow import (
    Event,
    StartEvent,
    StopEvent,
    Workflow,
    step,
)
from llama_index.llms.openai import OpenAI

import mlflow


class JokeEvent(Event):
    joke: str


class JokeFlow(Workflow):
    llm = OpenAI()

    @step
    async def generate_joke(self, ev: StartEvent) -> JokeEvent:
        topic = ev.topic
        prompt = f"Write your best joke about {topic}."
        response = await self.llm.acomplete(prompt)
        return JokeEvent(joke=str(response))

    @step
    async def critique_joke(self, ev: JokeEvent) -> StopEvent:
        joke = ev.joke

        prompt = f"Give a thorough analysis and critique of the following joke: {joke}"
        response = await self.llm.acomplete(prompt)
        return StopEvent(result=str(response))


w = JokeFlow(timeout=10, verbose=False)
mlflow.models.set_model(w)
```

--------------------------------------------------------------------------------

---[FILE: with_model_config.py]---
Location: mlflow-master/tests/llama_index/sample_code/with_model_config.py

```python
"""
Sample code to define a chat engine and save it with model config (dictionary).
"""

from llama_index.core import Document, VectorStoreIndex
from llama_index.core.chat_engine.types import ChatMode
from llama_index.llms.openai import OpenAI

import mlflow

model_config = mlflow.models.ModelConfig()
model_name = model_config.get("model_name")
temperature = model_config.get("temperature")
llm = OpenAI(model=model_name, temperature=temperature)

index = VectorStoreIndex.from_documents(documents=[Document.example()])
# Setting SIMPLE chat mode will create a SimpleChatEngine instance
chat_engine = index.as_chat_engine(llm=llm, chat_mode=ChatMode.SIMPLE)

mlflow.models.set_model(chat_engine)
```

--------------------------------------------------------------------------------

---[FILE: with_model_config_yaml_file.py]---
Location: mlflow-master/tests/llama_index/sample_code/with_model_config_yaml_file.py

```python
"""
Sample code to define a chat engine and save it with model config (YAML file).
"""

from llama_index.core import Document, VectorStoreIndex
from llama_index.core.chat_engine.types import ChatMode
from llama_index.llms.openai import OpenAI

import mlflow

model_config = mlflow.models.ModelConfig(development_config="model_config.yaml")
llm_config = model_config.get("llm")
model_name = llm_config.get("model_name")
temperature = llm_config.get("temperature")
llm = OpenAI(model=model_name, temperature=temperature)

index = VectorStoreIndex.from_documents(documents=[Document.example()])
# Setting SIMPLE chat mode will create a SimpleChatEngine instance
chat_engine = index.as_chat_engine(llm=llm, chat_mode=ChatMode.SIMPLE)

mlflow.models.set_model(chat_engine)
```

--------------------------------------------------------------------------------

---[FILE: test_cli.py]---
Location: mlflow-master/tests/mcp/test_cli.py

```python
import sys

import pytest
from fastmcp import Client
from fastmcp.client.transports import StdioTransport

import mlflow


@pytest.mark.asyncio
async def test_cli():
    transport = StdioTransport(
        command=sys.executable,
        args=[
            "-m",
            "mlflow",
            "mcp",
            "run",
        ],
        env={"MLFLOW_TRACKING_URI": mlflow.get_tracking_uri()},
    )
    async with Client(transport) as client:
        tools = await client.list_tools()
        assert len(tools) > 0
```

--------------------------------------------------------------------------------

````
