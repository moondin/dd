---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 761
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 761 of 991)

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

---[FILE: test_ag2_autolog.py]---
Location: mlflow-master/tests/ag2/test_ag2_autolog.py

```python
import contextlib
import time
from unittest.mock import patch

import pytest
from autogen import ConversableAgent, GroupChat, GroupChatManager, UserProxyAgent, io
from openai import APIConnectionError
from openai.types.chat import ChatCompletion
from openai.types.chat.chat_completion import ChatCompletionMessage, Choice

import mlflow
from mlflow.entities.span import SpanType
from mlflow.tracing.constant import SpanAttributeKey

from tests.helper_functions import start_mock_openai_server
from tests.tracing.helper import get_traces


@pytest.fixture(scope="module", autouse=True)
def mock_openai():
    with start_mock_openai_server() as base_url:
        yield base_url


@pytest.fixture
def llm_config(mock_openai):
    return {
        "config_list": [
            {
                "model": "gpt-4o-mini",
                "base_url": mock_openai,
                "api_key": "test",
                "max_tokens": 100,
            },
        ]
    }


@contextlib.contextmanager
def mock_user_input(messages: list[str]):
    with patch.object(io.IOStream.get_default(), "input", side_effect=messages):
        yield


def get_simple_agent(llm_config):
    assistant = ConversableAgent("agent", llm_config=llm_config)
    user_proxy = UserProxyAgent("user", code_execution_config=False)
    return assistant, user_proxy


def test_enable_disable_autolog(llm_config):
    mlflow.ag2.autolog()
    with mock_user_input(["Hi", "exit"]):
        assistant, user_proxy = get_simple_agent(llm_config)
        assistant.initiate_chat(user_proxy, message="foo")

    traces = get_traces()
    assert len(traces) == 1

    mlflow.ag2.autolog(disable=True)
    with mock_user_input(["Hi", "exit"]):
        assistant, user_proxy = get_simple_agent(llm_config)
        assistant.initiate_chat(user_proxy, message="foo")

    # No new trace should be created
    traces = get_traces()
    assert len(traces) == 1


def test_tracing_agent(llm_config):
    mlflow.ag2.autolog()

    with mock_user_input(
        ["What is the capital of Tokyo?", "How long is it take from San Francisco?", "exit"]
    ):
        assistant, user_proxy = get_simple_agent(llm_config)
        response = assistant.initiate_chat(user_proxy, message="How can I help you today?")

    # Check if the initiate_chat method is patched
    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert traces[0].info.execution_time_ms > 0
    # 7 spans are expected:
    # initiate_chat
    #    |-- user
    #    |-- assistant -- chat_completion
    #    |-- user
    #    |-- assistant -- chat_completion
    assert len(traces[0].data.spans) == 7

    session_span = traces[0].data.spans[0]
    assert session_span.name == "initiate_chat"
    assert session_span.span_type == SpanType.UNKNOWN
    assert session_span.inputs["message"] == "How can I help you today?"
    assert session_span.outputs["chat_history"] == response.chat_history
    user_span = traces[0].data.spans[1]
    assert user_span.name == "user"
    assert user_span.span_type == SpanType.AGENT
    assert user_span.parent_id == session_span.span_id
    assert user_span.inputs["message"] == "How can I help you today?"
    assert user_span.outputs["message"]["content"] == "What is the capital of Tokyo?"
    agent_span = traces[0].data.spans[2]
    assert agent_span.name == "agent"
    assert agent_span.span_type == SpanType.AGENT
    assert agent_span.parent_id == session_span.span_id
    assert agent_span.inputs["message"]["content"] == "What is the capital of Tokyo?"
    assert agent_span.outputs is not None
    llm_span = traces[0].data.spans[3]
    assert llm_span.name == "chat_completion"
    assert llm_span.span_type == SpanType.LLM
    assert llm_span.parent_id == agent_span.span_id
    assert llm_span.inputs["messages"][-1]["content"] == "What is the capital of Tokyo?"
    assert llm_span.outputs is not None
    assert llm_span.attributes["cost"] >= 0
    user_span_2 = traces[0].data.spans[4]
    assert user_span_2.name == "user"
    assert user_span_2.parent_id == session_span.span_id
    agent_span_2 = traces[0].data.spans[5]
    assert agent_span_2.name == "agent"
    assert agent_span_2.parent_id == session_span.span_id
    llm_span_2 = traces[0].data.spans[6]
    assert llm_span_2.name == "chat_completion"
    assert llm_span_2.parent_id == agent_span_2.span_id

    assert llm_span.get_attribute(SpanAttributeKey.CHAT_USAGE) == {
        "input_tokens": 9,
        "output_tokens": 12,
        "total_tokens": 21,
    }
    assert llm_span.get_attribute(SpanAttributeKey.MESSAGE_FORMAT) == "ag2"

    assert llm_span_2.get_attribute(SpanAttributeKey.CHAT_USAGE) == {
        "input_tokens": 9,
        "output_tokens": 12,
        "total_tokens": 21,
    }
    assert llm_span_2.get_attribute(SpanAttributeKey.MESSAGE_FORMAT) == "ag2"

    assert traces[0].info.token_usage == {
        "input_tokens": 18,
        "output_tokens": 24,
        "total_tokens": 42,
    }


def test_tracing_agent_with_error():
    mlflow.ag2.autolog()

    invalid_llm_config = {
        "config_list": [
            {
                "model": "gpt-4o-mini",
                "base_url": "invalid_url",
                "api_key": "invalid",
            }
        ]
    }
    assistant = ConversableAgent("agent", llm_config=invalid_llm_config)
    user_proxy = UserProxyAgent("user", code_execution_config=False)

    with mock_user_input(["What is the capital of Tokyo?", "exit"]):
        with pytest.raises(APIConnectionError, match="Connection error"):
            assistant.initiate_chat(user_proxy, message="How can I help you today?")

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "ERROR"
    assert traces[0].info.execution_time_ms > 0
    assert traces[0].data.spans[0].status.status_code == "ERROR"
    assert traces[0].data.spans[0].status.description == "Connection error."


def test_tracing_agent_multiple_chat_sessions(llm_config):
    mlflow.ag2.autolog()

    with mock_user_input(["Hi", "exit", "Hello", "exit", "Hola", "exit"]):
        assistant, user_proxy = get_simple_agent(llm_config)
        assistant.initiate_chat(user_proxy, message="foo")
        assistant.initiate_chat(user_proxy, message="bar")
        assistant.initiate_chat(user_proxy, message="baz")

    # Traces should be created for each chat session
    traces = get_traces()
    assert len(traces) == 3

    assert traces[0].info.token_usage == {
        "input_tokens": 9,
        "output_tokens": 12,
        "total_tokens": 21,
    }


def test_tracing_agent_with_function_calling(llm_config):
    mlflow.ag2.autolog()

    # Define a simple tool and register it with the assistant agent
    def sum(a: int, b: int) -> int:
        time.sleep(1)
        return a + b

    assistant = ConversableAgent(
        name="assistant",
        system_message="You are a helpful AI assistant. "
        "You can help with simple calculations. "
        "Return 'TERMINATE' when the task is done.",
        llm_config=llm_config,
    )
    user_proxy = ConversableAgent(
        name="tool_agent",
        llm_config=False,
        is_termination_msg=lambda msg: msg.get("content") is not None
        and "TERMINATE" in msg["content"],
        human_input_mode="NEVER",
    )
    assistant.register_for_llm(name="sum", description="A simple sum calculator")(sum)
    user_proxy.register_for_execution(name="sum")(sum)

    # Start a chat session. We mock OpenAI response to simulate function calling response.
    with patch(
        "autogen.oai.client.OpenAIClient.create",
        side_effect=[
            ChatCompletion(
                id="chat_1",
                created=0,
                object="chat.completion",
                model="gpt-4o-mini",
                choices=[
                    Choice(
                        index=1,
                        finish_reason="stop",
                        message=ChatCompletionMessage(
                            role="assistant",
                            tool_calls=[
                                {
                                    "id": "call_1",
                                    "function": {"arguments": '{"a": 1, "b": 1}', "name": "sum"},
                                    "type": "function",
                                },
                            ],
                        ),
                    ),
                ],
            ),
            ChatCompletion(
                id="chat_2",
                created=0,
                object="chat.completion",
                model="gpt-4o-mini",
                choices=[
                    Choice(
                        index=2,
                        finish_reason="stop",
                        message=ChatCompletionMessage(
                            role="assistant",
                            content="The result of the calculation is 2. \n\nTERMINATE",
                        ),
                    ),
                ],
            ),
        ],
    ):
        response = user_proxy.initiate_chat(assistant, message="What is 1 + 1?")

    assert response.summary.startswith("The result of the calculation is 2.")

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assistant_span = traces[0].data.spans[1]
    assert assistant_span.span_type == SpanType.AGENT
    tool_agent_span = traces[0].data.spans[3]
    assert tool_agent_span.span_type == SpanType.AGENT
    tool_span = traces[0].data.spans[4]
    assert tool_span.span_type == SpanType.TOOL
    assert tool_span.parent_id == tool_agent_span.span_id
    assert tool_span.inputs["a"] == 1
    assert tool_span.inputs["b"] == 1
    assert tool_span.outputs == "2"
    assert tool_span.end_time_ns - tool_span.start_time_ns >= 1e9  # 1 second


@pytest.fixture
def tokyo_timezone(monkeypatch):
    # Set the timezone to Tokyo
    monkeypatch.setenv("TZ", "Asia/Tokyo")
    time.tzset()

    yield

    # Reset the timezone
    monkeypatch.delenv("TZ")
    time.tzset()


def test_tracing_llm_completion_duration_timezone(llm_config, tokyo_timezone):
    # Test if the duration calculation for LLM completion is robust to timezone changes.
    mlflow.ag2.autolog()

    with mock_user_input(
        ["What is the capital of Tokyo?", "How long is it take from San Francisco?", "exit"]
    ):
        assistant, user_proxy = get_simple_agent(llm_config)
        assistant.initiate_chat(user_proxy, message="How can I help you today?")

    # Check if the initiate_chat method is patched
    traces = get_traces()
    span_name_to_dict = {span.name: span for span in traces[0].data.spans}
    llm_span = span_name_to_dict["chat_completion"]

    # We mock OpenAI LLM call so it should not take too long e.g. > 10 seconds. If it does,
    # it most likely a bug such as incorrect timezone handling.
    assert 0 < llm_span.end_time_ns - llm_span.start_time_ns <= 10e9

    # Check if the start time is in reasonable range
    root_span = span_name_to_dict["initiate_chat"]
    assert 0 < llm_span.start_time_ns - root_span.start_time_ns <= 1e9

    assert traces[0].info.token_usage == {
        "input_tokens": 18,
        "output_tokens": 24,
        "total_tokens": 42,
    }


def test_tracing_composite_agent(llm_config):
    # Composite agent can call initiate_chat() or generate_reply() method of its sub-agents.
    # This test is to ensure that won't create a new trace for the sub-agent's method call.
    mlflow.ag2.autolog()

    agent_1 = ConversableAgent("agent_1", llm_config=llm_config)
    agent_2 = ConversableAgent("agent_2", llm_config=llm_config)
    group_chat = GroupChat(
        agents=[agent_1, agent_2],
        messages=[],
        max_round=3,
        speaker_selection_method="round_robin",
    )
    group_chat_manager = GroupChatManager(
        groupchat=group_chat,
        llm_config=llm_config,
    )
    agent_1.initiate_chat(group_chat_manager, message="Hello")

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    spans = traces[0].data.spans
    # 1 for the root initiate_chat, 2 for the messages and 2 for the corresponding LLM calls.
    assert len(spans) == 5
    span_names = {span.name for span in spans}
    assert span_names == {
        "initiate_chat",
        "agent_1",
        "agent_2",
        "chat_completion",
    }

    assert traces[0].info.token_usage == {
        "input_tokens": 18,
        "output_tokens": 24,
        "total_tokens": 42,
    }


def test_autogen_logger_catch_exception(llm_config):
    # Error from the logger should not affect the main execution
    mlflow.ag2.autolog()

    with patch(
        "mlflow.tracing.provider.start_detached_span", side_effect=Exception("error")
    ) as mock_start_span:
        with mock_user_input(["Hi", "exit"]):
            assistant, user_proxy = get_simple_agent(llm_config)
            assistant.initiate_chat(user_proxy, message="foo")

    assert mock_start_span.call_count == 1
```

--------------------------------------------------------------------------------

---[FILE: conftest.py]---
Location: mlflow-master/tests/agno/conftest.py

```python
import pytest

import mlflow


@pytest.fixture(autouse=True)
def _reset_mlflow():
    from mlflow.utils.autologging_utils import AUTOLOGGING_INTEGRATIONS

    for integ in AUTOLOGGING_INTEGRATIONS.values():
        integ.clear()
    mlflow.utils.import_hooks._post_import_hooks = {}


@pytest.fixture(autouse=True)
def mock_creds(monkeypatch):
    monkeypatch.setenv("ANTHROPIC_API_KEY", "test")
```

--------------------------------------------------------------------------------

---[FILE: test_agno_tracing.py]---
Location: mlflow-master/tests/agno/test_agno_tracing.py

```python
import sys
from unittest.mock import MagicMock, patch

import agno
import pytest
from agno.agent import Agent
from agno.exceptions import ModelProviderError
from agno.models.anthropic import Claude
from agno.tools.function import Function, FunctionCall
from anthropic.types import Message, TextBlock, Usage
from packaging.version import Version

import mlflow
import mlflow.agno
from mlflow.entities import SpanType
from mlflow.entities.span_status import SpanStatusCode
from mlflow.tracing.constant import TokenUsageKey

from tests.tracing.helper import get_traces, purge_traces

AGNO_VERSION = Version(getattr(agno, "__version__", "1.0.0"))
IS_AGNO_V2 = AGNO_VERSION >= Version("2.0.0")


def get_v2_autolog_module():
    from mlflow.agno.autolog_v2 import _is_agno_v2  # noqa: F401

    return sys.modules["mlflow.agno.autolog_v2"]


def _create_message(content):
    return Message(
        id="1",
        model="claude-sonnet-4-20250514",
        content=[TextBlock(text=content, type="text")],
        role="assistant",
        stop_reason="end_turn",
        stop_sequence=None,
        type="message",
        usage=Usage(input_tokens=5, output_tokens=7, total_tokens=12),
    )


@pytest.fixture
def simple_agent():
    return Agent(
        model=Claude(id="claude-sonnet-4-20250514"),
        instructions="Be concise.",
        markdown=True,
    )


@pytest.mark.skipif(IS_AGNO_V2, reason="Test uses V1 patching behavior")
def test_run_simple_autolog(simple_agent):
    mlflow.agno.autolog()

    mock_client = MagicMock()
    mock_client.messages.create.return_value = _create_message("Paris")
    with patch.object(Claude, "get_client", return_value=mock_client):
        resp = simple_agent.run("Capital of France?")
    assert resp.content == "Paris"

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert traces[0].info.token_usage == {
        TokenUsageKey.INPUT_TOKENS: 5,
        TokenUsageKey.OUTPUT_TOKENS: 7,
        TokenUsageKey.TOTAL_TOKENS: 12,
    }
    spans = traces[0].data.spans
    assert len(spans) == 2
    assert spans[0].span_type == SpanType.AGENT
    assert spans[0].name == "Agent.run"
    assert spans[0].inputs == {"message": "Capital of France?"}
    assert spans[0].outputs["content"] == "Paris"
    assert spans[1].span_type == SpanType.LLM
    assert spans[1].name == "Claude.invoke"
    assert spans[1].inputs["messages"][-1]["content"] == "Capital of France?"
    assert spans[1].outputs["content"][0]["text"] == "Paris"

    purge_traces()

    mlflow.agno.autolog(disable=True)
    with patch.object(Claude, "get_client", return_value=mock_client):
        simple_agent.run("Again?")
    assert get_traces() == []


@pytest.mark.skipif(IS_AGNO_V2, reason="Test uses V1 patching behavior")
def test_run_failure_tracing(simple_agent):
    mlflow.agno.autolog()

    mock_client = MagicMock()
    mock_client.messages.create.side_effect = RuntimeError("bang")
    with patch.object(Claude, "get_client", return_value=mock_client):
        with pytest.raises(ModelProviderError, match="bang"):
            simple_agent.run("fail")

    trace = get_traces()[0]
    assert trace.info.status == "ERROR"
    assert trace.info.token_usage is None
    spans = trace.data.spans
    assert spans[0].name == "Agent.run"
    assert spans[1].name == "Claude.invoke"
    assert spans[1].status.status_code == SpanStatusCode.ERROR
    assert spans[1].status.description == "ModelProviderError: bang"


@pytest.mark.skipif(IS_AGNO_V2, reason="Test uses V1 patching behavior")
@pytest.mark.asyncio
async def test_arun_simple_autolog(simple_agent):
    mlflow.agno.autolog()

    async def _mock_create(*args, **kwargs):
        return _create_message("Paris")

    mock_client = MagicMock()
    mock_client.messages.create.side_effect = _mock_create
    with patch.object(Claude, "get_async_client", return_value=mock_client):
        resp = await simple_agent.arun("Capital of France?")

    assert resp.content == "Paris"

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert traces[0].info.token_usage == {
        TokenUsageKey.INPUT_TOKENS: 5,
        TokenUsageKey.OUTPUT_TOKENS: 7,
        TokenUsageKey.TOTAL_TOKENS: 12,
    }
    spans = traces[0].data.spans
    assert len(spans) == 2
    assert spans[0].span_type == SpanType.AGENT
    assert spans[0].name == "Agent.arun"
    assert spans[0].inputs == {"message": "Capital of France?"}
    assert spans[0].outputs["content"] == "Paris"
    assert spans[1].span_type == SpanType.LLM
    assert spans[1].name == "Claude.ainvoke"
    assert spans[1].inputs["messages"][-1]["content"] == "Capital of France?"
    assert spans[1].outputs["content"][0]["text"] == "Paris"


@pytest.mark.skipif(IS_AGNO_V2, reason="Test uses V1 patching behavior")
@pytest.mark.asyncio
@pytest.mark.parametrize("is_async", [True, False], ids=["async", "sync"])
async def test_failure_tracing(simple_agent, is_async):
    mlflow.agno.autolog()

    mock_client = MagicMock()
    mock_client.messages.create.side_effect = RuntimeError("bang")
    mock_method = "get_async_client" if is_async else "get_client"
    with patch.object(Claude, mock_method, return_value=mock_client):
        with pytest.raises(ModelProviderError, match="bang"):  # noqa: PT012
            if is_async:
                await simple_agent.arun("fail")
            else:
                simple_agent.run("fail")

    trace = get_traces()[0]
    assert trace.info.status == "ERROR"
    assert trace.info.token_usage is None
    spans = trace.data.spans
    assert spans[0].name == "Agent.run" if not is_async else "Agent.arun"
    assert spans[1].name == "Claude.invoke" if not is_async else "Claude.ainvoke"
    assert spans[1].status.status_code == SpanStatusCode.ERROR
    assert spans[1].status.description == "ModelProviderError: bang"


@pytest.mark.skipif(IS_AGNO_V2, reason="Test uses V1 patching behavior")
def test_function_execute_tracing():
    def dummy(x):
        return x + 1

    fc = FunctionCall(function=Function.from_callable(dummy, name="dummy"), arguments={"x": 1})

    mlflow.agno.autolog(log_traces=True)
    result = fc.execute()
    assert result.result == 2

    spans = get_traces()[0].data.spans
    assert len(spans) == 1
    span = spans[0]
    assert span.span_type == SpanType.TOOL
    assert span.name == "dummy"
    assert span.inputs == {"x": 1}
    assert span.attributes["entrypoint"] is not None
    assert span.outputs["result"] == 2


@pytest.mark.skipif(IS_AGNO_V2, reason="Test uses V1 patching behavior")
@pytest.mark.asyncio
async def test_function_aexecute_tracing():
    async def dummy(x):
        return x + 1

    fc = FunctionCall(function=Function.from_callable(dummy, name="dummy"), arguments={"x": 1})

    mlflow.agno.autolog(log_traces=True)
    result = await fc.aexecute()
    assert result.result == 2

    spans = get_traces()[0].data.spans
    assert len(spans) == 1
    span = spans[0]
    assert span.span_type == SpanType.TOOL
    assert span.name == "dummy"
    assert span.inputs == {"x": 1}
    assert span.attributes["entrypoint"] is not None
    assert span.outputs["result"] == 2


@pytest.mark.skipif(IS_AGNO_V2, reason="Test uses V1 patching behavior")
def test_function_execute_failure_tracing():
    from agno.exceptions import AgentRunException

    def boom(x):
        raise AgentRunException("bad")

    fc = FunctionCall(function=Function.from_callable(boom, name="boom"), arguments={"x": 1})

    mlflow.agno.autolog(log_traces=True)
    with pytest.raises(AgentRunException, match="bad"):
        fc.execute()

    trace = get_traces()[0]
    assert trace.info.status == "ERROR"
    span = trace.data.spans[0]
    assert span.span_type == SpanType.TOOL
    assert span.status.status_code == SpanStatusCode.ERROR
    assert span.inputs == {"x": 1}
    assert span.outputs is None


@pytest.mark.skipif(IS_AGNO_V2, reason="Test uses V1 patching behavior")
@pytest.mark.asyncio
@pytest.mark.parametrize("is_async", [True, False], ids=["async", "sync"])
async def test_agno_and_anthropic_autolog_single_trace(simple_agent, is_async):
    mlflow.agno.autolog()
    mlflow.anthropic.autolog()

    client = "AsyncAPIClient" if is_async else "SyncAPIClient"
    with patch(f"anthropic._base_client.{client}.post", return_value=_create_message("Paris")):
        if is_async:
            await simple_agent.arun("hi")
        else:
            simple_agent.run("hi")

    traces = get_traces()
    assert len(traces) == 1
    spans = traces[0].data.spans
    assert spans[0].span_type == SpanType.AGENT
    assert spans[0].name == "Agent.arun" if is_async else "Agent.run"
    assert spans[1].span_type == SpanType.LLM
    assert spans[1].name == "Claude.ainvoke" if is_async else "Claude.invoke"
    assert spans[2].span_type == SpanType.CHAT_MODEL
    assert spans[2].name == "AsyncMessages.create" if is_async else "Messages.create"


@pytest.mark.skipif(not IS_AGNO_V2, reason="Test requires V2 functionality")
def test_v2_autolog_setup_teardown():
    autolog_module = get_v2_autolog_module()
    original_instrumentor = autolog_module._agno_instrumentor

    try:
        autolog_module._agno_instrumentor = None

        with patch("mlflow.get_tracking_uri", return_value="http://localhost:5000"):
            mlflow.agno.autolog(log_traces=True)
            assert autolog_module._agno_instrumentor is not None

            mlflow.agno.autolog(log_traces=False)
    finally:
        autolog_module._agno_instrumentor = original_instrumentor


@pytest.mark.skipif(not IS_AGNO_V2, reason="Test requires V2 functionality")
@pytest.mark.asyncio
@pytest.mark.parametrize("is_async", [True, False], ids=["async", "sync"])
async def test_v2_creates_otel_spans(simple_agent, is_async):
    from opentelemetry import trace
    from opentelemetry.sdk.trace import TracerProvider
    from opentelemetry.sdk.trace.export import SimpleSpanProcessor
    from opentelemetry.sdk.trace.export.in_memory_span_exporter import InMemorySpanExporter

    memory_exporter = InMemorySpanExporter()
    tracer_provider = TracerProvider()
    tracer_provider.add_span_processor(SimpleSpanProcessor(memory_exporter))
    trace.set_tracer_provider(tracer_provider)

    try:
        with patch("mlflow.get_tracking_uri", return_value="http://localhost:5000"):
            mlflow.agno.autolog(log_traces=True)

            mock_client = MagicMock()
            if is_async:

                async def _mock_create(*args, **kwargs):
                    return _create_message("Paris")

                mock_client.messages.create.side_effect = _mock_create
            else:
                mock_client.messages.create.return_value = _create_message("Paris")

            mock_method = "get_async_client" if is_async else "get_client"
            with patch.object(Claude, mock_method, return_value=mock_client):
                if is_async:
                    resp = await simple_agent.arun("Capital of France?")
                else:
                    resp = simple_agent.run("Capital of France?")

            assert resp.content == "Paris"
            spans = memory_exporter.get_finished_spans()
            assert len(spans) > 0
    finally:
        mlflow.agno.autolog(disable=True)


@pytest.mark.skipif(not IS_AGNO_V2, reason="Test requires V2 functionality")
def test_v2_failure_creates_error_spans(simple_agent):
    from opentelemetry import trace
    from opentelemetry.sdk.trace import TracerProvider
    from opentelemetry.sdk.trace.export import SimpleSpanProcessor
    from opentelemetry.sdk.trace.export.in_memory_span_exporter import InMemorySpanExporter
    from opentelemetry.trace import StatusCode

    memory_exporter = InMemorySpanExporter()
    tracer_provider = TracerProvider()
    tracer_provider.add_span_processor(SimpleSpanProcessor(memory_exporter))
    trace.set_tracer_provider(tracer_provider)

    try:
        with patch("mlflow.get_tracking_uri", return_value="http://localhost:5000"):
            mlflow.agno.autolog(log_traces=True)

            mock_client = MagicMock()
            mock_client.messages.create.side_effect = RuntimeError("bang")
            with patch.object(Claude, "get_client", return_value=mock_client):
                with pytest.raises(ModelProviderError, match="bang"):
                    simple_agent.run("fail")

            spans = memory_exporter.get_finished_spans()
            assert len(spans) > 0
            error_spans = [s for s in spans if s.status.status_code == StatusCode.ERROR]
            assert len(error_spans) > 0
    finally:
        mlflow.agno.autolog(disable=True)
```

--------------------------------------------------------------------------------

---[FILE: test_ai_command_utils.py]---
Location: mlflow-master/tests/ai_commands/test_ai_command_utils.py

```python
import platform
from unittest import mock

import pytest

from mlflow.ai_commands import get_command, get_command_body, list_commands, parse_frontmatter


def test_parse_frontmatter_with_metadata():
    content = """---
namespace: genai
description: Test command
---

# Command content
This is the body."""

    metadata, body = parse_frontmatter(content)

    assert metadata["namespace"] == "genai"
    assert metadata["description"] == "Test command"
    assert "# Command content" in body
    assert "This is the body." in body


def test_parse_frontmatter_without_metadata():
    content = "# Just a regular markdown file\nNo frontmatter here."

    metadata, body = parse_frontmatter(content)

    assert metadata == {}
    assert body == content


def test_parse_frontmatter_malformed():
    content = """---
invalid: yaml: [
---
Body content"""

    # Should not raise, but return empty metadata
    metadata, body = parse_frontmatter(content)
    assert metadata == {}
    assert body == content


def test_parse_frontmatter_empty_metadata():
    content = """---
---
Body content"""

    metadata, body = parse_frontmatter(content)
    # Empty YAML returns None, which becomes {}
    assert metadata == {} or metadata is None
    assert "Body content" in body


def test_list_commands_all(tmp_path):
    # Create test command structure
    genai_dir = tmp_path / "commands" / "genai"
    genai_dir.mkdir(parents=True)

    test_cmd = genai_dir / "test.md"
    test_cmd.write_text("""---
namespace: genai
description: Test command
---
Content""")

    another_dir = tmp_path / "commands" / "ml"
    another_dir.mkdir(parents=True)

    another_cmd = another_dir / "train.md"
    another_cmd.write_text("""---
namespace: ml
description: Training command
---
Content""")

    with mock.patch("mlflow.ai_commands.ai_command_utils.Path") as mock_path:
        # Mock Path(__file__).parent to return tmp_path/commands
        mock_path.return_value.parent = tmp_path / "commands"

        commands = list_commands()

    assert len(commands) == 2
    # Use forward slashes consistently in assertions
    assert any(cmd["key"] == "genai/test" for cmd in commands)
    assert any(cmd["key"] == "ml/train" for cmd in commands)


def test_list_commands_with_namespace_filter(tmp_path):
    # Setup test commands
    genai_dir = tmp_path / "commands" / "genai"
    genai_dir.mkdir(parents=True)

    cmd1 = genai_dir / "analyze.md"
    cmd1.write_text("""---
namespace: genai
description: Analyze command
---
Content""")

    cmd2 = genai_dir / "evaluate.md"
    cmd2.write_text("""---
namespace: genai
description: Evaluate command
---
Content""")

    ml_dir = tmp_path / "commands" / "ml"
    ml_dir.mkdir(parents=True)

    cmd3 = ml_dir / "train.md"
    cmd3.write_text("""---
namespace: ml
description: Training command
---
Content""")

    with mock.patch("mlflow.ai_commands.ai_command_utils.Path") as mock_path:
        mock_path.return_value.parent = tmp_path / "commands"

        # Filter by genai namespace
        genai_commands = list_commands(namespace="genai")

    assert len(genai_commands) == 2
    assert all(cmd["key"].startswith("genai/") for cmd in genai_commands)


def test_get_command_success(tmp_path):
    genai_dir = tmp_path / "commands" / "genai"
    genai_dir.mkdir(parents=True)

    test_content = """---
namespace: genai
description: Test command
---

# Test Command
This is the full content."""

    test_cmd = genai_dir / "analyze.md"
    test_cmd.write_text(test_content)

    with mock.patch("mlflow.ai_commands.ai_command_utils.Path") as mock_path:
        mock_path.return_value.parent = tmp_path / "commands"

        content = get_command("genai/analyze")

    assert content == test_content


def test_get_command_not_found(tmp_path):
    commands_dir = tmp_path / "commands"
    commands_dir.mkdir()

    with mock.patch("mlflow.ai_commands.ai_command_utils.Path") as mock_path:
        mock_path.return_value.parent = commands_dir

        with pytest.raises(FileNotFoundError, match="Command 'nonexistent/command' not found"):
            get_command("nonexistent/command")


def test_list_commands_empty_directory(tmp_path):
    # Create empty commands directory
    commands_dir = tmp_path / "commands"
    commands_dir.mkdir()

    with mock.patch("mlflow.ai_commands.ai_command_utils.Path") as mock_path:
        mock_path.return_value.parent = tmp_path

        commands = list_commands()

    assert commands == []


def test_list_commands_nonexistent_directory(tmp_path):
    with mock.patch("mlflow.ai_commands.ai_command_utils.Path") as mock_path:
        mock_path.return_value.parent = tmp_path

        commands = list_commands()

    assert commands == []


def test_list_commands_with_invalid_files(tmp_path):
    genai_dir = tmp_path / "commands" / "genai"
    genai_dir.mkdir(parents=True)

    # Valid command
    valid_cmd = genai_dir / "valid.md"
    valid_cmd.write_text("""---
namespace: genai
description: Valid command
---
Content""")

    # Create a file with invalid YAML to trigger parsing error
    invalid_cmd = genai_dir / "invalid.md"
    invalid_cmd.write_text("Invalid content that will cause parsing error")

    # On Unix-like systems, remove read permissions
    if platform.system() != "Windows":
        invalid_cmd.chmod(0o000)

    with mock.patch("mlflow.ai_commands.ai_command_utils.Path") as mock_path:
        mock_path.return_value.parent = tmp_path / "commands"

        commands = list_commands()

    # Restore permissions for cleanup
    if platform.system() != "Windows":
        invalid_cmd.chmod(0o644)

    # Should include both commands (invalid one gets parsed but with empty metadata)
    assert len(commands) >= 1
    # Ensure we have at least the valid command
    valid_commands = [cmd for cmd in commands if cmd["key"] == "genai/valid"]
    assert len(valid_commands) == 1
    assert valid_commands[0]["description"] == "Valid command"


def test_list_commands_sorted():
    # Use the real implementation with actual files
    commands = list_commands()

    # If there are any commands, verify they're sorted
    if len(commands) > 1:
        keys = [cmd["key"] for cmd in commands]
        assert keys == sorted(keys)


def test_get_command_body(tmp_path):
    genai_dir = tmp_path / "commands" / "genai"
    genai_dir.mkdir(parents=True)

    # Test with frontmatter
    content_with_frontmatter = """---
namespace: genai
description: Test command
---

# Test Command
This is the body content."""

    test_cmd = genai_dir / "analyze.md"
    test_cmd.write_text(content_with_frontmatter)

    # Test without frontmatter - should return entire content
    content_no_frontmatter = """# Simple Command
This is just markdown content."""

    simple_cmd = genai_dir / "simple.md"
    simple_cmd.write_text(content_no_frontmatter)

    with mock.patch("mlflow.ai_commands.ai_command_utils.Path") as mock_path:
        mock_path.return_value.parent = tmp_path / "commands"

        # Test with frontmatter
        body = get_command_body("genai/analyze")

        # Should strip frontmatter and return only body
        assert "namespace: genai" not in body
        assert "description: Test command" not in body
        assert "# Test Command" in body
        assert "This is the body content." in body

        # Test without frontmatter
        body_no_frontmatter = get_command_body("genai/simple")
        assert body_no_frontmatter == content_no_frontmatter


def test_get_command_body_not_found(tmp_path):
    commands_dir = tmp_path / "commands"
    commands_dir.mkdir()

    with mock.patch("mlflow.ai_commands.ai_command_utils.Path") as mock_path:
        mock_path.return_value.parent = commands_dir

        with pytest.raises(FileNotFoundError, match="Command 'nonexistent/command' not found"):
            get_command_body("nonexistent/command")
```

--------------------------------------------------------------------------------

````
