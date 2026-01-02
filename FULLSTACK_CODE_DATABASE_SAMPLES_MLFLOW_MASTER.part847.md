---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 847
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 847 of 991)

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

---[FILE: test_langgraph_model_export.py]---
Location: mlflow-master/tests/langgraph/test_langgraph_model_export.py

```python
import json

import mlflow
from mlflow.types.schema import Object, ParamSchema, ParamSpec, Property


def test_langgraph_save_as_code():
    input_example = {"messages": [{"role": "user", "content": "what is the weather in sf?"}]}

    with mlflow.start_run():
        model_info = mlflow.langchain.log_model(
            "tests/langgraph/sample_code/langgraph_prebuilt.py",
            name="langgraph",
            input_example=input_example,
        )

    # (role, content)
    expected_messages = [
        ("human", "what is the weather in sf?"),
        ("agent", ""),  # tool message does not have content
        ("tools", "It's always sunny in sf"),
        ("agent", "The weather in San Francisco is always sunny!"),
    ]

    loaded_graph = mlflow.langchain.load_model(model_info.model_uri)
    response = loaded_graph.invoke(input_example)
    messages = response["messages"]
    assert len(messages) == 4
    for msg, (role, expected_content) in zip(messages, expected_messages):
        assert msg.content == expected_content

    # Need to reload to reset the iterator in FakeOpenAI
    loaded_graph = mlflow.langchain.load_model(model_info.model_uri)
    response = loaded_graph.stream(input_example)
    # .stream() response does not includes the first Human message
    for chunk, (role, expected_content) in zip(response, expected_messages[1:]):
        assert chunk[role]["messages"][0].content == expected_content

    loaded_pyfunc = mlflow.pyfunc.load_model(model_info.model_uri)
    response = loaded_pyfunc.predict(input_example)[0]
    messages = response["messages"]
    assert len(messages) == 4
    for msg, (role, expected_content) in zip(messages, expected_messages):
        assert msg["content"] == expected_content
    # response should be json serializable
    assert json.dumps(response) is not None

    loaded_pyfunc = mlflow.pyfunc.load_model(model_info.model_uri)
    response = loaded_pyfunc.predict_stream(input_example)
    for chunk, (role, expected_content) in zip(response, expected_messages[1:]):
        assert chunk[role]["messages"][0]["content"] == expected_content


def test_langgraph_model_invoke_with_dictionary_params(monkeypatch):
    input_example = {"messages": [{"role": "user", "content": "What's the weather in nyc?"}]}
    params = {"config": {"configurable": {"thread_id": "1"}}}

    monkeypatch.setenv("MLFLOW_CONVERT_MESSAGES_DICT_FOR_LANGCHAIN", "false")
    with mlflow.start_run():
        model_info = mlflow.langchain.log_model(
            "tests/langgraph/sample_code/langgraph_prebuilt.py",
            name="model",
            input_example=(input_example, params),
        )
    assert model_info.signature.params == ParamSchema(
        [
            ParamSpec(
                "config",
                Object([Property("configurable", Object([Property("thread_id", "string")]))]),
                params["config"],
            )
        ]
    )
    langchain_model = mlflow.langchain.load_model(model_info.model_uri)
    result = langchain_model.invoke(input_example, **params)
    pyfunc_model = mlflow.pyfunc.load_model(model_info.model_uri)
    assert len(pyfunc_model.predict(input_example, params)[0]["messages"]) == len(
        result["messages"]
    )
```

--------------------------------------------------------------------------------

---[FILE: langgraph_chat_agent.py]---
Location: mlflow-master/tests/langgraph/sample_code/langgraph_chat_agent.py

```python
import json
import os
from typing import Any, Generator, Sequence

from langchain_core.language_models import LanguageModelLike
from langchain_core.messages import AIMessage, ToolCall
from langchain_core.outputs import ChatGeneration, ChatResult
from langchain_core.runnables import RunnableConfig, RunnableLambda
from langchain_core.tools import BaseTool, tool
from langchain_openai import ChatOpenAI
from langgraph.graph import END, StateGraph
from langgraph.graph.state import CompiledStateGraph
from langgraph.prebuilt import ToolNode

import mlflow
from mlflow.langchain.chat_agent_langgraph import (
    ChatAgentState,
    ChatAgentToolNode,
)
from mlflow.pyfunc import ChatAgent
from mlflow.types.agent import ChatAgentChunk, ChatAgentMessage, ChatAgentResponse, ChatContext

os.environ["OPENAI_API_KEY"] = "test"


class FakeOpenAI(ChatOpenAI, extra="allow"):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self._responses = iter(
            [
                AIMessage(
                    content="",
                    tool_calls=[ToolCall(name="uc_tool_format", args={}, id="123")],
                ),
                AIMessage(
                    content="",
                    tool_calls=[ToolCall(name="lc_tool_format", args={}, id="456")],
                ),
                AIMessage(content="Successfully generated", id="789"),
            ]
        )

    def _generate(self, *args, **kwargs):
        return ChatResult(generations=[ChatGeneration(message=next(self._responses))])


@tool
def uc_tool_format() -> str:
    """Returns uc tool format"""
    return json.dumps(
        {
            "format": "SCALAR",
            "value": '{"content":"hi","attachments":{"a":"b"},"custom_outputs":{"c":"d"}}',
            "truncated": False,
        }
    )


@tool
def lc_tool_format() -> dict[str, Any]:
    """Returns lc tool format"""
    nums = [1, 2]
    return {
        "content": f"Successfully generated array of 2 random ints: {nums}.",
        "attachments": {"key1": "attach1", "key2": "attach2"},
        "custom_outputs": {"random_nums": nums},
    }


tools = [uc_tool_format, lc_tool_format]


def create_tool_calling_agent(
    model: LanguageModelLike,
    tools: ToolNode | Sequence[BaseTool],
    agent_prompt: str | None = None,
) -> CompiledStateGraph:
    model = model.bind_tools(tools)

    def should_continue(state: ChatAgentState):
        messages = state["messages"]
        last_message = messages[-1]
        # If there are function calls, continue. else, end
        if last_message.get("tool_calls"):
            return "continue"
        else:
            return "end"

    preprocessor = RunnableLambda(lambda state: state["messages"])
    model_runnable = preprocessor | model

    def call_model(
        state: ChatAgentState,
        config: RunnableConfig,
    ):
        response = model_runnable.invoke(state, config)

        return {"messages": [response]}

    workflow = StateGraph(ChatAgentState)

    workflow.add_node("agent", RunnableLambda(call_model))
    workflow.add_node("tools", ChatAgentToolNode(tools))

    workflow.set_entry_point("agent")
    workflow.add_conditional_edges(
        "agent",
        should_continue,
        {
            "continue": "tools",
            "end": END,
        },
    )
    workflow.add_edge("tools", "agent")

    return workflow.compile()


class LangGraphChatAgent(ChatAgent):
    def __init__(self, agent: CompiledStateGraph):
        self.agent = agent

    def predict(
        self,
        messages: list[ChatAgentMessage],
        context: ChatContext | None = None,
        custom_inputs: dict[str, Any] | None = None,
    ) -> ChatAgentResponse:
        request = {"messages": self._convert_messages_to_dict(messages)}

        messages = []
        for event in self.agent.stream(request, stream_mode="updates"):
            for node_data in event.values():
                messages.extend(ChatAgentMessage(**msg) for msg in node_data.get("messages", []))
        return ChatAgentResponse(messages=messages)

    def predict_stream(
        self,
        messages: list[ChatAgentMessage],
        context: ChatContext | None = None,
        custom_inputs: dict[str, Any] | None = None,
    ) -> Generator[ChatAgentChunk, None, None]:
        request = {"messages": self._convert_messages_to_dict(messages)}
        for event in self.agent.stream(request, stream_mode="updates"):
            for node_data in event.values():
                yield from (ChatAgentChunk(**{"delta": msg}) for msg in node_data["messages"])


mlflow.langchain.autolog()
llm = FakeOpenAI()
graph = create_tool_calling_agent(llm, tools)
chat_agent = LangGraphChatAgent(graph)

mlflow.models.set_model(chat_agent)
```

--------------------------------------------------------------------------------

---[FILE: langgraph_chat_agent_custom_inputs.py]---
Location: mlflow-master/tests/langgraph/sample_code/langgraph_chat_agent_custom_inputs.py

```python
import json
import os
from typing import Any, Generator, Sequence
from uuid import uuid4

from langchain_core.language_models import LanguageModelLike
from langchain_core.messages import AIMessage, ToolCall
from langchain_core.outputs import ChatGeneration, ChatResult
from langchain_core.runnables import RunnableConfig, RunnableLambda
from langchain_core.tools import BaseTool, tool
from langchain_openai import ChatOpenAI
from langgraph.graph import END, StateGraph
from langgraph.graph.state import CompiledStateGraph
from langgraph.prebuilt import ToolNode

import mlflow
from mlflow.langchain.chat_agent_langgraph import (
    ChatAgentState,
    ChatAgentToolNode,
)
from mlflow.pyfunc import ChatAgent
from mlflow.types.agent import ChatAgentChunk, ChatAgentMessage, ChatAgentResponse, ChatContext

os.environ["OPENAI_API_KEY"] = "test"


class FakeOpenAI(ChatOpenAI, extra="allow"):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self._responses = iter(
            [
                AIMessage(
                    content="",
                    tool_calls=[ToolCall(name="uc_tool_format", args={}, id="123")],
                ),
                AIMessage(
                    content="",
                    tool_calls=[ToolCall(name="lc_tool_format", args={}, id="456")],
                ),
                AIMessage(content="Successfully generated", id="789"),
            ]
        )

    def _generate(self, *args, **kwargs):
        return ChatResult(generations=[ChatGeneration(message=next(self._responses))])


@tool
def uc_tool_format() -> str:
    """Returns uc tool format"""
    return json.dumps(
        {
            "format": "SCALAR",
            "value": '{"content":"hi","attachments":{"a":"b"},"custom_outputs":{"c":"d"}}',
            "truncated": False,
        }
    )


@tool
def lc_tool_format() -> dict[str, Any]:
    """Returns lc tool format"""
    nums = [1, 2]
    return {
        "content": f"Successfully generated array of 2 random ints: {nums}.",
        "attachments": {"key1": "attach1", "key2": "attach2"},
        "custom_outputs": {"random_nums": nums},
    }


tools = [uc_tool_format, lc_tool_format]


def create_tool_calling_agent(
    model: LanguageModelLike,
    tools: ToolNode | Sequence[BaseTool],
    agent_prompt: str | None = None,
) -> CompiledStateGraph:
    model = model.bind_tools(tools)

    def should_continue(state: ChatAgentState):
        messages = state["messages"]
        last_message = messages[-1]
        # If there are function calls, continue. else, end
        if last_message.get("tool_calls"):
            return "continue"
        else:
            return "end"

    preprocessor = RunnableLambda(lambda state: state["messages"])
    model_runnable = preprocessor | model

    def call_model(
        state: ChatAgentState,
        config: RunnableConfig,
    ):
        response = model_runnable.invoke(state, config)

        return {"messages": [response]}

    def add_custom_outputs(state: ChatAgentState):
        custom_outputs = (state.get("custom_outputs") or {}) | (state.get("custom_inputs") or {})
        return {
            "messages": [
                {"role": "assistant", "content": "adding custom outputs", "id": str(uuid4())}
            ],
            "custom_outputs": custom_outputs,
        }

    workflow = StateGraph(ChatAgentState)

    workflow.add_node("agent", RunnableLambda(call_model))
    workflow.add_node("tools", ChatAgentToolNode(tools))
    workflow.add_node("add_custom_outputs", RunnableLambda(add_custom_outputs))
    workflow.set_entry_point("agent")
    workflow.add_conditional_edges(
        "agent",
        should_continue,
        {
            "continue": "tools",
            "end": "add_custom_outputs",
        },
    )
    workflow.add_edge("tools", "agent")
    workflow.add_edge("add_custom_outputs", END)

    return workflow.compile()


mlflow.langchain.autolog()
llm = FakeOpenAI()
graph = create_tool_calling_agent(llm, tools)


class LangGraphChatAgent(ChatAgent):
    def __init__(self, agent: CompiledStateGraph):
        self.agent = agent

    def predict(
        self,
        messages: list[ChatAgentMessage],
        context: ChatContext | None = None,
        custom_inputs: dict[str, Any] | None = None,
    ) -> ChatAgentResponse:
        request = {
            "messages": self._convert_messages_to_dict(messages),
            **({"custom_inputs": custom_inputs} if custom_inputs else {}),
            **({"context": context.model_dump()} if context else {}),
        }

        response = ChatAgentResponse(messages=[])
        for event in self.agent.stream(request, stream_mode="updates"):
            for node_data in event.values():
                if not node_data:
                    continue
                for msg in node_data.get("messages", []):
                    response.messages.append(ChatAgentMessage(**msg))
                if "custom_outputs" in node_data:
                    response.custom_outputs = node_data["custom_outputs"]
        return response

    def predict_stream(
        self,
        messages: list[ChatAgentMessage],
        context: ChatContext | None = None,
        custom_inputs: dict[str, Any] | None = None,
    ) -> Generator[ChatAgentChunk, None, None]:
        request = {
            "messages": self._convert_messages_to_dict(messages),
            **({"custom_inputs": custom_inputs} if custom_inputs else {}),
            **({"context": context.model_dump()} if context else {}),
        }

        last_message = None
        last_custom_outputs = None

        for event in self.agent.stream(request, stream_mode="updates"):
            for node_data in event.values():
                if not node_data:
                    continue
                messages = node_data.get("messages", [])
                custom_outputs = node_data.get("custom_outputs")

                for message in messages:
                    if last_message:
                        yield ChatAgentChunk(delta=last_message)
                    last_message = message
                if custom_outputs:
                    last_custom_outputs = custom_outputs
        if last_message:
            yield ChatAgentChunk(delta=last_message, custom_outputs=last_custom_outputs)


chat_agent = LangGraphChatAgent(graph)

mlflow.models.set_model(chat_agent)
```

--------------------------------------------------------------------------------

---[FILE: langgraph_diy.py]---
Location: mlflow-master/tests/langgraph/sample_code/langgraph_diy.py

```python
# Sample code that contains custom python nodes
from typing import Annotated, Sequence, TypedDict

from langchain_core.messages import BaseMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import END, START, StateGraph
from langgraph.graph.message import add_messages

import mlflow


def generate(state):
    messages = state["messages"]
    llm = ChatOpenAI()
    response = llm.invoke(messages[-1].content)
    return {"messages": response}


def should_continue(state):
    if len(state["messages"]) > 3:
        return "no"
    else:
        return "yes"


class AgentState(TypedDict):
    # The add_messages function defines how an update should be processed
    # Default is to replace. add_messages says "append"
    messages: Annotated[Sequence[BaseMessage], add_messages]


workflow = StateGraph(AgentState)
workflow.add_node("generate", generate)
workflow.add_edge(START, "generate")
workflow.add_conditional_edges(
    "generate",
    should_continue,
    {
        "yes": "generate",
        "no": END,
    },
)

graph = workflow.compile()

mlflow.models.set_model(graph)
```

--------------------------------------------------------------------------------

---[FILE: langgraph_prebuilt.py]---
Location: mlflow-master/tests/langgraph/sample_code/langgraph_prebuilt.py

```python
import itertools
from typing import Literal

from langchain_core.messages import AIMessage, ToolCall
from langchain_core.outputs import ChatGeneration, ChatResult
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent

import mlflow


class FakeOpenAI(ChatOpenAI, extra="allow"):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self._responses = itertools.cycle(
            [
                AIMessage(
                    content="",
                    tool_calls=[ToolCall(name="get_weather", args={"city": "sf"}, id="123")],
                    usage_metadata={"input_tokens": 5, "output_tokens": 10, "total_tokens": 15},
                ),
                AIMessage(
                    content="The weather in San Francisco is always sunny!",
                    usage_metadata={"input_tokens": 10, "output_tokens": 20, "total_tokens": 30},
                ),
            ]
        )

    def _generate(self, *args, **kwargs):
        return ChatResult(generations=[ChatGeneration(message=next(self._responses))])

    async def _agenerate(self, *args, **kwargs):
        return ChatResult(generations=[ChatGeneration(message=next(self._responses))])


@tool
def get_weather(city: Literal["nyc", "sf"]):
    """Use this to get weather information."""
    if city == "nyc":
        return "It might be cloudy in nyc"
    elif city == "sf":
        return "It's always sunny in sf"


llm = FakeOpenAI()
tools = [get_weather]
graph = create_react_agent(llm, tools)

mlflow.models.set_model(graph)
```

--------------------------------------------------------------------------------

---[FILE: langgraph_with_autolog.py]---
Location: mlflow-master/tests/langgraph/sample_code/langgraph_with_autolog.py

```python
from dataclasses import dataclass

from langchain.tools import tool
from langgraph.graph import END, StateGraph

import mlflow

mlflow.langchain.autolog()


@dataclass
class OverallState:
    name: str = "LangChain"  # add whatever fields you need


@tool
def my_tool():
    """
    Called as the very first node.
    Side-effect: add an MLflow tag to the *current* trace.
    Must return a dict of state-field updates.
    """
    mlflow.update_current_trace(tags={"order_total": "hello"})
    return {"status": "done"}


builder = StateGraph(dict)
builder.add_node("test_tool", my_tool)  # ← calls your tool
builder.set_entry_point("test_tool")  # start here
builder.add_edge("test_tool", END)  # nothing else to do

graph = builder.compile()
mlflow.models.set_model(graph)
```

--------------------------------------------------------------------------------

---[FILE: langgraph_with_custom_span.py]---
Location: mlflow-master/tests/langgraph/sample_code/langgraph_with_custom_span.py

```python
from typing import Literal

from langchain_core.messages import AIMessage, ToolCall
from langchain_core.output_parsers import StrOutputParser
from langchain_core.outputs import ChatGeneration, ChatResult
from langchain_core.prompts import PromptTemplate
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent

import mlflow
from mlflow.entities.span import SpanType


class FakeOpenAI(ChatOpenAI, extra="allow"):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self._responses = iter(
            [
                AIMessage(
                    content="",
                    tool_calls=[ToolCall(name="get_weather", args={"city": "sf"}, id="123")],
                ),
                AIMessage(content="The weather in San Francisco is always sunny!"),
            ]
        )

    def _generate(self, *args, **kwargs):
        return ChatResult(generations=[ChatGeneration(message=next(self._responses))])


def get_inner_runnable():
    llm = ChatOpenAI()
    prompt = PromptTemplate.from_template("what is the weather in {city}?")
    return prompt | llm | StrOutputParser()


@tool
def get_weather(city: Literal["nyc", "sf"]):
    """Use this to get weather information."""
    with mlflow.start_span(name="get_weather_inner", span_type=SpanType.CHAIN) as span:
        span.set_inputs(city)

        # Call another LangChain module
        inner_runnable = get_inner_runnable()
        inner_runnable.invoke({"city": city})

        if city == "nyc":
            output = "It might be cloudy in nyc"
        elif city == "sf":
            output = "It's always sunny in sf"
        span.set_outputs(output)
    return output


llm = FakeOpenAI()
tools = [get_weather]
graph = create_react_agent(llm, tools)

mlflow.models.set_model(graph)
```

--------------------------------------------------------------------------------

````
