---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 875
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 875 of 991)

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

---[FILE: test_pydanticai_fluent_tracing.py]---
Location: mlflow-master/tests/pydantic_ai/test_pydanticai_fluent_tracing.py

```python
import importlib.metadata
from unittest.mock import patch

import pytest
from packaging.version import Version
from pydantic_ai import Agent, RunContext
from pydantic_ai.messages import ModelResponse, TextPart, ToolCallPart
from pydantic_ai.models.instrumented import InstrumentedModel
from pydantic_ai.usage import Usage

import mlflow
import mlflow.pydantic_ai  # ensure the integration module is importable
from mlflow.entities import SpanType

from tests.tracing.helper import get_traces

_FINAL_ANSWER_WITHOUT_TOOL = "Paris"
_FINAL_ANSWER_WITH_TOOL = "winner"

PYDANTIC_AI_VERSION = Version(importlib.metadata.version("pydantic_ai"))
# Usage was deprecated in favor of RequestUsage in 0.7.3
IS_USAGE_DEPRECATED = PYDANTIC_AI_VERSION >= Version("0.7.3")


def _make_dummy_response_without_tool():
    if IS_USAGE_DEPRECATED:
        from pydantic_ai.usage import RequestUsage

    parts = [TextPart(content=_FINAL_ANSWER_WITHOUT_TOOL)]
    resp = ModelResponse(parts=parts)
    if IS_USAGE_DEPRECATED:
        usage = RequestUsage(input_tokens=1, output_tokens=1)
    else:
        usage = Usage(requests=1, request_tokens=1, response_tokens=1, total_tokens=2)

    if PYDANTIC_AI_VERSION >= Version("0.2.0"):
        return ModelResponse(parts=parts, usage=usage)
    else:
        return resp, usage


def _make_dummy_response_with_tool():
    if IS_USAGE_DEPRECATED:
        from pydantic_ai.usage import RequestUsage

    call_parts = [ToolCallPart(tool_name="roulette_wheel", args={"square": 18})]
    final_parts = [TextPart(content=_FINAL_ANSWER_WITH_TOOL)]

    if IS_USAGE_DEPRECATED:
        usage_call = RequestUsage(input_tokens=10, output_tokens=20)
        usage_final = RequestUsage(input_tokens=100, output_tokens=200)
    else:
        usage_call = Usage(requests=0, request_tokens=10, response_tokens=20, total_tokens=30)
        usage_final = Usage(requests=1, request_tokens=100, response_tokens=200, total_tokens=300)

    if PYDANTIC_AI_VERSION >= Version("0.2.0"):
        call_resp = ModelResponse(parts=call_parts, usage=usage_call)
        final_resp = ModelResponse(parts=final_parts, usage=usage_final)
        yield call_resp
        yield final_resp

    else:
        call_resp = ModelResponse(parts=call_parts)
        final_resp = ModelResponse(parts=final_parts)
        yield call_resp, usage_call
        yield final_resp, usage_final


@pytest.fixture(autouse=True)
def clear_autolog_state():
    from mlflow.utils.autologging_utils import AUTOLOGGING_INTEGRATIONS

    for key in AUTOLOGGING_INTEGRATIONS.keys():
        AUTOLOGGING_INTEGRATIONS[key].clear()
    mlflow.utils.import_hooks._post_import_hooks = {}


@pytest.fixture
def simple_agent():
    return Agent(
        "openai:gpt-4o",
        system_prompt="Tell me the capital of {{input}}.",
        instrument=True,
    )


@pytest.fixture
def agent_with_tool():
    roulette_agent = Agent(
        "openai:gpt-4o",
        system_prompt=(
            "Use the roulette_wheel function to see if the "
            "customer has won based on the number they provide."
        ),
        instrument=True,
        deps_type=int,
        output_type=str,
    )

    @roulette_agent.tool
    async def roulette_wheel(ctx: RunContext[int], square: int) -> str:
        """check if the square is a winner"""
        return "winner" if square == ctx.deps else "loser"

    return roulette_agent


def test_agent_run_sync_enable_fluent_disable_autolog(simple_agent):
    dummy = _make_dummy_response_without_tool()

    async def request(self, *args, **kwargs):
        return dummy

    with patch.object(InstrumentedModel, "request", new=request):
        mlflow.pydantic_ai.autolog(log_traces=True)

        result = simple_agent.run_sync("France")
        assert result.output == _FINAL_ANSWER_WITHOUT_TOOL

    traces = get_traces()
    assert len(traces) == 1
    spans = traces[0].data.spans

    assert spans[0].name == "Agent.run_sync"
    assert spans[0].span_type == SpanType.AGENT

    assert spans[1].name == "Agent.run"
    assert spans[1].span_type == SpanType.AGENT

    span2 = spans[2]
    assert span2.name == "InstrumentedModel.request"
    assert span2.span_type == SpanType.LLM
    assert span2.parent_id == spans[1].span_id

    with patch.object(InstrumentedModel, "request", new=request):
        mlflow.pydantic_ai.autolog(disable=True)
        simple_agent.run_sync("France")
    assert len(get_traces()) == 1


@pytest.mark.asyncio
async def test_agent_run_enable_fluent_disable_autolog(simple_agent):
    dummy = _make_dummy_response_without_tool()

    async def request(self, *args, **kwargs):
        return dummy

    with patch.object(InstrumentedModel, "request", new=request):
        mlflow.pydantic_ai.autolog(log_traces=True)

        result = await simple_agent.run("France")
        assert result.output == _FINAL_ANSWER_WITHOUT_TOOL

    traces = get_traces()
    assert len(traces) == 1
    spans = traces[0].data.spans

    assert spans[0].name == "Agent.run"
    assert spans[0].span_type == SpanType.AGENT

    span1 = spans[1]
    assert span1.name == "InstrumentedModel.request"
    assert span1.span_type == SpanType.LLM
    assert span1.parent_id == spans[0].span_id


def test_agent_run_sync_enable_disable_fluent_autolog_with_tool(agent_with_tool):
    sequence = _make_dummy_response_with_tool()

    async def request(self, *args, **kwargs):
        return next(sequence)

    with patch.object(InstrumentedModel, "request", new=request):
        mlflow.pydantic_ai.autolog(log_traces=True)

        result = agent_with_tool.run_sync("Put my money on square eighteen", deps=18)
        assert result.output == _FINAL_ANSWER_WITH_TOOL

    traces = get_traces()
    assert len(traces) == 1
    spans = traces[0].data.spans

    assert len(spans) == 5

    assert spans[0].name == "Agent.run_sync"
    assert spans[0].span_type == SpanType.AGENT

    assert spans[1].name == "Agent.run"
    assert spans[1].span_type == SpanType.AGENT

    span2 = spans[2]
    assert span2.name == "InstrumentedModel.request"
    assert span2.span_type == SpanType.LLM
    assert span2.parent_id == spans[1].span_id

    span3 = spans[3]
    assert span3.span_type == SpanType.TOOL
    assert span3.parent_id == spans[1].span_id

    span4 = spans[4]
    assert span4.name == "InstrumentedModel.request"
    assert span4.span_type == SpanType.LLM
    assert span4.parent_id == spans[1].span_id


@pytest.mark.asyncio
async def test_agent_run_enable_disable_fluent_autolog_with_tool(agent_with_tool):
    sequence = _make_dummy_response_with_tool()

    async def request(self, *args, **kwargs):
        return next(sequence)

    with patch.object(InstrumentedModel, "request", new=request):
        mlflow.pydantic_ai.autolog(log_traces=True)

        result = await agent_with_tool.run("Put my money on square eighteen", deps=18)
        assert result.output == _FINAL_ANSWER_WITH_TOOL

    traces = get_traces()
    assert len(traces) == 1
    spans = traces[0].data.spans

    assert len(spans) == 4

    assert spans[0].name == "Agent.run"
    assert spans[0].span_type == SpanType.AGENT

    span1 = spans[1]
    assert span1.name == "InstrumentedModel.request"
    assert span1.span_type == SpanType.LLM
    assert span1.parent_id == spans[0].span_id

    span2 = spans[2]
    assert span2.span_type == SpanType.TOOL
    assert span2.parent_id == spans[0].span_id

    span3 = spans[3]
    assert span3.name == "InstrumentedModel.request"
    assert span3.span_type == SpanType.LLM
    assert span3.parent_id == spans[0].span_id
```

--------------------------------------------------------------------------------

---[FILE: test_pydanticai_mcp_tracing.py]---
Location: mlflow-master/tests/pydantic_ai/test_pydanticai_mcp_tracing.py
Signals: Pydantic

```python
from unittest.mock import patch

import pytest
from pydantic_ai.mcp import MCPServerStdio

import mlflow
from mlflow.entities.trace import SpanType

from tests.tracing.helper import get_traces


@pytest.mark.asyncio
async def test_mcp_server_list_tools_autolog():
    tools_list = [
        {"name": "tool1", "description": "Tool 1 description"},
        {"name": "tool2", "description": "Tool 2 description"},
    ]

    async def list_tools(self, *args, **kwargs):
        return tools_list

    with patch("pydantic_ai.mcp.MCPServer.list_tools", new=list_tools):
        mlflow.pydantic_ai.autolog(log_traces=True)

        server = MCPServerStdio(
            "deno",
            args=[
                "run",
                "-N",
                "-R=node_modules",
                "-W=node_modules",
                "--node-modules-dir=auto",
                "jsr:@pydantic/mcp-run-python",
                "stdio",
            ],
        )

        result = await server.list_tools()
        assert result == tools_list

    traces = get_traces()
    assert len(traces) == 1
    spans = traces[0].data.spans
    assert len(spans) == 1
    span = spans[0]

    assert span.name == "MCPServerStdio.list_tools"
    assert span.span_type == SpanType.TOOL

    outputs = span.outputs
    assert len(outputs) == 2
    assert outputs == tools_list

    with patch("pydantic_ai.mcp.MCPServer.list_tools", new=list_tools):
        mlflow.pydantic_ai.autolog(disable=True)
        await server.list_tools()

    assert len(get_traces()) == 1


@pytest.mark.asyncio
async def test_mcp_server_call_tool_autolog():
    tool_name = "calculator"
    tool_args = {"operation": "add", "a": 5, "b": 7}
    tool_result = {"result": 12}

    async def call_tool(self, name, args, *remaining_args, **kwargs):
        assert name == tool_name
        assert args == tool_args
        return tool_result

    with patch("pydantic_ai.mcp.MCPServer.call_tool", new=call_tool):
        mlflow.pydantic_ai.autolog(log_traces=True)

        server = MCPServerStdio(
            "deno",
            args=[
                "run",
                "-N",
                "-R=node_modules",
                "-W=node_modules",
                "--node-modules-dir=auto",
                "jsr:@pydantic/mcp-run-python",
                "stdio",
            ],
        )

        result = await server.call_tool(tool_name, tool_args)

        assert result == tool_result

    traces = get_traces()
    assert len(traces) == 1
    spans = traces[0].data.spans
    assert len(spans) == 1

    call_tool_span = spans[0]
    assert call_tool_span is not None
    assert call_tool_span.name == "MCPServerStdio.call_tool"
    assert call_tool_span.span_type == SpanType.TOOL

    inputs = call_tool_span.inputs
    assert len(inputs) == 2
    assert inputs["name"] == tool_name
    assert inputs["args"] == tool_args

    outputs = call_tool_span.outputs
    assert len(outputs) == 1
    assert outputs == tool_result

    with patch("pydantic_ai.mcp.MCPServer.call_tool", new=call_tool):
        mlflow.pydantic_ai.autolog(disable=True)
        await server.call_tool(tool_name, tool_args)

    assert len(get_traces()) == 1
```

--------------------------------------------------------------------------------

---[FILE: test_pydanticai_tracing.py]---
Location: mlflow-master/tests/pydantic_ai/test_pydanticai_tracing.py

```python
import importlib.metadata
from unittest.mock import patch

import pytest
from packaging.version import Version
from pydantic_ai import Agent, RunContext
from pydantic_ai.messages import ModelResponse, TextPart, ToolCallPart
from pydantic_ai.usage import Usage

import mlflow
import mlflow.pydantic_ai  # ensure the integration module is importable
from mlflow.entities import SpanType
from mlflow.pydantic_ai.autolog import (
    _get_agent_attributes,
    _get_mcp_server_attributes,
    _get_model_attributes,
    _get_tool_attributes,
)
from mlflow.tracing.constant import SpanAttributeKey, TokenUsageKey

from tests.tracing.helper import get_traces

PYDANTIC_AI_VERSION = Version(importlib.metadata.version("pydantic_ai"))
# Usage was deprecated in favor of RequestUsage in 0.7.3
IS_USAGE_DEPRECATED = PYDANTIC_AI_VERSION >= Version("0.7.3")

_FINAL_ANSWER_WITHOUT_TOOL = "Paris"
_FINAL_ANSWER_WITH_TOOL = "winner"


def _make_dummy_response_without_tool():
    # Usage was deprecated in favor of RequestUsage in 0.7.3
    if IS_USAGE_DEPRECATED:
        from pydantic_ai.usage import RequestUsage

    parts = [TextPart(content=_FINAL_ANSWER_WITHOUT_TOOL)]
    if IS_USAGE_DEPRECATED:
        usage = RequestUsage(input_tokens=1, output_tokens=1)
    else:
        usage = Usage(requests=1, request_tokens=1, response_tokens=1, total_tokens=2)
    if PYDANTIC_AI_VERSION >= Version("0.2.0"):
        return ModelResponse(parts=parts, usage=usage)
    else:
        resp = ModelResponse(parts=parts)
        return resp, usage


def _make_dummy_response_with_tool():
    # Usage was deprecated in favor of RequestUsage in 0.7.3
    if IS_USAGE_DEPRECATED:
        from pydantic_ai.usage import RequestUsage

    call_parts = [ToolCallPart(tool_name="roulette_wheel", args={"square": 18})]
    final_parts = [TextPart(content=_FINAL_ANSWER_WITH_TOOL)]
    if IS_USAGE_DEPRECATED:
        usage_call = RequestUsage(input_tokens=10, output_tokens=20)
        usage_final = RequestUsage(input_tokens=100, output_tokens=200)
    else:
        usage_call = Usage(requests=0, request_tokens=10, response_tokens=20, total_tokens=30)
        usage_final = Usage(requests=1, request_tokens=100, response_tokens=200, total_tokens=300)

    if PYDANTIC_AI_VERSION >= Version("0.2.0"):
        call_resp = ModelResponse(parts=call_parts, usage=usage_call)
        final_resp = ModelResponse(parts=final_parts, usage=usage_final)
        sequence = [
            call_resp,
            final_resp,
        ]
        return sequence, final_resp

    else:
        call_resp = ModelResponse(parts=call_parts)
        final_resp = ModelResponse(parts=final_parts)
        sequence = [
            (call_resp, usage_call),
            (final_resp, usage_final),
        ]

        return sequence, (final_resp, usage_final)


@pytest.fixture(autouse=True)
def clear_autolog_state():
    from mlflow.utils.autologging_utils import AUTOLOGGING_INTEGRATIONS

    for key in AUTOLOGGING_INTEGRATIONS.keys():
        AUTOLOGGING_INTEGRATIONS[key].clear()
    mlflow.utils.import_hooks._post_import_hooks = {}


@pytest.fixture
def simple_agent():
    return Agent(
        "openai:gpt-4o",
        system_prompt="Tell me the capital of {{input}}.",
        instrument=True,
    )


@pytest.fixture
def agent_with_tool():
    roulette_agent = Agent(
        "openai:gpt-4o",
        system_prompt=(
            "Use the roulette_wheel function to see if the "
            "customer has won based on the number they provide."
        ),
        instrument=True,
        deps_type=int,
        output_type=str,
    )

    @roulette_agent.tool
    async def roulette_wheel(ctx: RunContext[int], square: int) -> str:
        """check if the square is a winner"""
        return "winner" if square == ctx.deps else "loser"

    return roulette_agent


def test_agent_run_sync_enable_disable_autolog(simple_agent):
    dummy = _make_dummy_response_without_tool()

    async def request(self, *args, **kwargs):
        return dummy

    with patch("pydantic_ai.models.instrumented.InstrumentedModel.request", new=request):
        mlflow.pydantic_ai.autolog(log_traces=True)

        result = simple_agent.run_sync("France")
        assert result.output == _FINAL_ANSWER_WITHOUT_TOOL

    traces = get_traces()
    assert len(traces) == 1
    spans = traces[0].data.spans

    assert spans[0].name == "Agent.run_sync"
    assert spans[0].span_type == SpanType.AGENT
    assert spans[0].get_attribute(SpanAttributeKey.MESSAGE_FORMAT) == "pydantic_ai"
    outputs_0 = spans[0].get_attribute(SpanAttributeKey.OUTPUTS)
    assert outputs_0 is not None
    assert "_new_messages_serialized" in outputs_0
    assert len(outputs_0["_new_messages_serialized"]) > 0

    assert spans[1].name == "Agent.run"
    assert spans[1].span_type == SpanType.AGENT
    assert spans[1].get_attribute(SpanAttributeKey.MESSAGE_FORMAT) == "pydantic_ai"
    outputs_1 = spans[1].get_attribute(SpanAttributeKey.OUTPUTS)
    assert outputs_1 is not None
    assert "_new_messages_serialized" in outputs_1
    assert len(outputs_1["_new_messages_serialized"]) > 0

    span2 = spans[2]
    assert span2.name == "InstrumentedModel.request"
    assert span2.span_type == SpanType.LLM
    assert span2.parent_id == spans[1].span_id
    assert span2.get_attribute(SpanAttributeKey.MESSAGE_FORMAT) == "pydantic_ai"

    assert span2.get_attribute(SpanAttributeKey.CHAT_USAGE) == {
        TokenUsageKey.INPUT_TOKENS: 1,
        TokenUsageKey.OUTPUT_TOKENS: 1,
        TokenUsageKey.TOTAL_TOKENS: 2,
    }

    assert traces[0].info.token_usage == {
        "input_tokens": 1,
        "output_tokens": 1,
        "total_tokens": 2,
    }

    with patch("pydantic_ai.models.instrumented.InstrumentedModel.request", new=request):
        mlflow.pydantic_ai.autolog(disable=True)
        simple_agent.run_sync("France")
    assert len(get_traces()) == 1


@pytest.mark.asyncio
async def test_agent_run_enable_disable_autolog(simple_agent):
    dummy = _make_dummy_response_without_tool()

    async def request(self, *args, **kwargs):
        return dummy

    with patch("pydantic_ai.models.instrumented.InstrumentedModel.request", new=request):
        mlflow.pydantic_ai.autolog(log_traces=True)

        result = await simple_agent.run("France")
        assert result.output == _FINAL_ANSWER_WITHOUT_TOOL

    traces = get_traces()
    assert len(traces) == 1
    spans = traces[0].data.spans

    assert spans[0].name == "Agent.run"
    assert spans[0].span_type == SpanType.AGENT

    span1 = spans[1]
    assert span1.name == "InstrumentedModel.request"
    assert span1.span_type == SpanType.LLM
    assert span1.parent_id == spans[0].span_id

    assert span1.get_attribute(SpanAttributeKey.CHAT_USAGE) == {
        TokenUsageKey.INPUT_TOKENS: 1,
        TokenUsageKey.OUTPUT_TOKENS: 1,
        TokenUsageKey.TOTAL_TOKENS: 2,
    }

    assert traces[0].info.token_usage == {
        "input_tokens": 1,
        "output_tokens": 1,
        "total_tokens": 2,
    }


def test_agent_run_sync_enable_disable_autolog_with_tool(agent_with_tool):
    sequence, resp = _make_dummy_response_with_tool()

    async def request(self, *args, **kwargs):
        if sequence:
            return sequence.pop(0)
        return resp

    with patch("pydantic_ai.models.instrumented.InstrumentedModel.request", new=request):
        mlflow.pydantic_ai.autolog(log_traces=True)

        result = agent_with_tool.run_sync("Put my money on square eighteen", deps=18)
        assert result.output == _FINAL_ANSWER_WITH_TOOL

    traces = get_traces()
    assert len(traces) == 1
    spans = traces[0].data.spans

    assert len(spans) == 5

    assert spans[0].name == "Agent.run_sync"
    assert spans[0].span_type == SpanType.AGENT

    assert spans[1].name == "Agent.run"
    assert spans[1].span_type == SpanType.AGENT

    span2 = spans[2]
    assert span2.name == "InstrumentedModel.request"
    assert span2.span_type == SpanType.LLM
    assert span2.parent_id == spans[1].span_id

    span3 = spans[3]
    assert span3.span_type == SpanType.TOOL
    assert span3.parent_id == spans[1].span_id

    span4 = spans[4]
    assert span4.name == "InstrumentedModel.request"
    assert span4.span_type == SpanType.LLM
    assert span4.parent_id == spans[1].span_id

    assert span2.get_attribute(SpanAttributeKey.CHAT_USAGE) == {
        TokenUsageKey.INPUT_TOKENS: 10,
        TokenUsageKey.OUTPUT_TOKENS: 20,
        TokenUsageKey.TOTAL_TOKENS: 30,
    }

    assert span4.get_attribute(SpanAttributeKey.CHAT_USAGE) == {
        TokenUsageKey.INPUT_TOKENS: 100,
        TokenUsageKey.OUTPUT_TOKENS: 200,
        TokenUsageKey.TOTAL_TOKENS: 300,
    }

    assert traces[0].info.token_usage == {
        "input_tokens": 110,
        "output_tokens": 220,
        "total_tokens": 330,
    }


@pytest.mark.asyncio
async def test_agent_run_enable_disable_autolog_with_tool(agent_with_tool):
    sequence, resp = _make_dummy_response_with_tool()

    async def request(self, *args, **kwargs):
        if sequence:
            return sequence.pop(0)
        return resp

    with patch("pydantic_ai.models.instrumented.InstrumentedModel.request", new=request):
        mlflow.pydantic_ai.autolog(log_traces=True)

        result = await agent_with_tool.run("Put my money on square eighteen", deps=18)
        assert result.output == _FINAL_ANSWER_WITH_TOOL

    traces = get_traces()
    assert len(traces) == 1
    spans = traces[0].data.spans

    assert len(spans) == 4

    assert spans[0].name == "Agent.run"
    assert spans[0].span_type == SpanType.AGENT

    span1 = spans[1]
    assert span1.name == "InstrumentedModel.request"
    assert span1.span_type == SpanType.LLM
    assert span1.parent_id == spans[0].span_id

    span2 = spans[2]
    assert span2.span_type == SpanType.TOOL
    assert span2.parent_id == spans[0].span_id

    span3 = spans[3]
    assert span3.name == "InstrumentedModel.request"
    assert span3.span_type == SpanType.LLM
    assert span3.parent_id == spans[0].span_id

    assert span1.get_attribute(SpanAttributeKey.CHAT_USAGE) == {
        TokenUsageKey.INPUT_TOKENS: 10,
        TokenUsageKey.OUTPUT_TOKENS: 20,
        TokenUsageKey.TOTAL_TOKENS: 30,
    }

    assert span3.get_attribute(SpanAttributeKey.CHAT_USAGE) == {
        TokenUsageKey.INPUT_TOKENS: 100,
        TokenUsageKey.OUTPUT_TOKENS: 200,
        TokenUsageKey.TOTAL_TOKENS: 300,
    }

    assert traces[0].info.token_usage == {
        "input_tokens": 110,
        "output_tokens": 220,
        "total_tokens": 330,
    }


def test_agent_run_sync_failure(simple_agent):
    with patch(
        "pydantic_ai.models.instrumented.InstrumentedModel.request",
        side_effect=ValueError("test error"),
    ):
        mlflow.pydantic_ai.autolog(log_traces=True)

        with pytest.raises(ValueError, match="test error"):
            simple_agent.run_sync("France")

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "ERROR"
    spans = traces[0].data.spans

    assert len(spans) == 3
    assert spans[0].name == "Agent.run_sync"
    assert spans[0].span_type == SpanType.AGENT
    assert spans[1].name == "Agent.run"
    assert spans[1].span_type == SpanType.AGENT
    assert spans[2].name.startswith("InstrumentedModel.")
    assert spans[2].span_type == SpanType.LLM

    with patch(
        "pydantic_ai.models.instrumented.InstrumentedModel.request",
        side_effect=ValueError("test error"),
    ):
        mlflow.pydantic_ai.autolog(disable=True)

        with pytest.raises(ValueError, match="test error"):
            simple_agent.run_sync("France")

    traces = get_traces()
    assert len(traces) == 1


class _MockUnsafeClient:
    _state = "open"

    def __del__(self):
        if self._state == "open":
            pass


@pytest.mark.parametrize(
    ("getter_func", "mock_attrs", "expected_attrs", "excluded_attrs"),
    [
        (
            _get_agent_attributes,
            {"name": "test-agent", "system_prompt": "helpful", "retries": 3, "output_type": str},
            {"name": "test-agent", "system_prompt": "helpful", "retries": 3, "output_type": "str"},
            ["_client", "provider", "_internal_state"],
        ),
        (
            _get_model_attributes,
            {"model_name": "gpt-4", "name": "test-model"},
            {"model_name": "gpt-4", "name": "test-model"},
            ["client", "_client", "provider", "api_key", "callbacks"],
        ),
        (
            _get_tool_attributes,
            {"name": "my_tool", "description": "helpful", "max_retries": 2},
            {"name": "my_tool", "description": "helpful", "max_retries": 2},
            ["_internal", "func"],
        ),
        (
            _get_mcp_server_attributes,
            {"name": "my_server", "url": "http://localhost:8080"},
            {"name": "my_server", "url": "http://localhost:8080"},
            ["_client", "_session", "_internal"],
        ),
    ],
)
def test_attribute_getter_excludes_private_attrs(
    getter_func, mock_attrs, expected_attrs, excluded_attrs
):
    class MockInstance:
        pass

    instance = MockInstance()
    for key, value in mock_attrs.items():
        setattr(instance, key, value)
    for key in excluded_attrs:
        setattr(instance, key, _MockUnsafeClient())

    attrs = getter_func(instance)

    for key, value in expected_attrs.items():
        assert attrs[key] == value
    for key in excluded_attrs:
        assert key not in attrs


def test_autolog_does_not_capture_client_references(simple_agent):
    dummy = _make_dummy_response_without_tool()

    async def request(self, *args, **kwargs):
        return dummy

    with patch("pydantic_ai.models.instrumented.InstrumentedModel.request", new=request):
        mlflow.pydantic_ai.autolog(log_traces=True)
        simple_agent.run_sync("France")

    traces = get_traces()
    assert len(traces) == 1
    spans = traces[0].data.spans

    for span in spans:
        attrs = span.attributes or {}
        for key in attrs:
            assert "client" not in key.lower() or key == "openai_client"
            assert "provider" not in key.lower()
            assert "_state" not in key.lower()
            assert "httpx" not in key.lower()
```

--------------------------------------------------------------------------------

---[FILE: test_backward_compatibility.py]---
Location: mlflow-master/tests/pyfunc/test_backward_compatibility.py

```python
import pytest

import mlflow


@pytest.mark.parametrize("version", ["2.7.1", "2.8.1"])
def test_backward_compatibility(version):
    model = mlflow.pyfunc.load_model(f"tests/resources/pyfunc_models/{version}")
    assert model.predict("MLflow is great!") == "MLflow is great!"
```

--------------------------------------------------------------------------------

````
