---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 846
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 846 of 991)

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

---[FILE: chain.py]---
Location: mlflow-master/tests/langchain/agent_executor/chain.py

```python
from operator import itemgetter
from typing import Any

from langchain.agents import AgentExecutor, tool
from langchain.agents.output_parsers.tools import ToolsAgentOutputParser
from langchain.callbacks.manager import CallbackManagerForLLMRun
from langchain.chat_models.base import SimpleChatModel
from langchain.prompts import PromptTemplate
from langchain.schema.messages import BaseMessage
from langchain.schema.runnable import RunnableLambda

from mlflow.models import ModelConfig, set_model

base_config = ModelConfig(development_config="tests/langchain/agent_executor/config.yml")

prompt_with_history = PromptTemplate(
    input_variables=["chat_history", "question"],
    template=base_config.get("prompt_with_history_str"),
)


def extract_question(input):
    return input[-1]["content"]


def extract_history(input):
    return input[:-1]


@tool
def custom_tool(query: str):
    """
    Mock a tool
    """
    return "Databricks"


class FakeChatModel(SimpleChatModel):
    """Fake Chat Model wrapper for testing purposes."""

    endpoint_name: str = "fake-endpoint"

    def _call(
        self,
        messages: list[BaseMessage],
        stop: list[str] | None = None,
        run_manager: CallbackManagerForLLMRun | None = None,
        **kwargs: Any,
    ) -> str:
        return "Databricks"

    @property
    def _llm_type(self) -> str:
        return "fake chat model"


fake_chat_model = FakeChatModel()
llm_with_tools = fake_chat_model.bind(tools=[custom_tool])
agent = (
    {
        "question": itemgetter("messages") | RunnableLambda(extract_question),
        "chat_history": itemgetter("messages") | RunnableLambda(extract_history),
    }
    | prompt_with_history
    | llm_with_tools
    | ToolsAgentOutputParser()
)

model = AgentExecutor(agent=agent, tools=[custom_tool])
set_model(model)
```

--------------------------------------------------------------------------------

---[FILE: config.yml]---
Location: mlflow-master/tests/langchain/agent_executor/config.yml

```yaml
prompt_with_history_str: "Here is a history between you and a human: {chat_history}\nNow, please answer this question: {question}"
```

--------------------------------------------------------------------------------

---[FILE: chain.py]---
Location: mlflow-master/tests/langchain/sample_code/chain.py

```python
import dbutils

dbutils.library.restartPython()

from typing import Any

from langchain_community.chat_models import ChatDatabricks, ChatMlflow
from langchain_community.document_loaders import TextLoader
from langchain_community.embeddings.fake import FakeEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.callbacks.manager import CallbackManagerForLLMRun
from langchain_core.messages import BaseMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.outputs import ChatResult
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_text_splitters.character import CharacterTextSplitter

import mlflow
from mlflow.models import ModelConfig, set_model, set_retriever_schema

base_config = ModelConfig(development_config="tests/langchain/config.yml")


def get_fake_chat_model(endpoint="fake-endpoint"):
    class FakeChatModel(ChatDatabricks):
        """Fake Chat Model wrapper for testing purposes."""

        endpoint: str = "fake-endpoint"

        def _generate(
            self,
            messages: list[BaseMessage],
            stop: list[str] | None = None,
            run_manager: CallbackManagerForLLMRun | None = None,
            **kwargs: Any,
        ) -> ChatResult:
            response = {
                "choices": [
                    {
                        "index": 0,
                        "message": {
                            "role": "assistant",
                            "content": f"{base_config.get('response')}",
                        },
                        "finish_reason": None,
                    }
                ],
            }
            return ChatMlflow._create_chat_result(response)

        @property
        def _llm_type(self) -> str:
            return "fake chat model"

    return FakeChatModel(endpoint=endpoint)


# No need to define the model, but simulating common practice in dev notebooks
mlflow.langchain.autolog()

text_path = "tests/langchain/state_of_the_union.txt"
loader = TextLoader(text_path)
documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
docs = text_splitter.split_documents(documents)

embeddings = FakeEmbeddings(size=base_config.get("embedding_size"))
vectorstore = FAISS.from_documents(docs, embeddings)
retriever = vectorstore.as_retriever()

prompt = ChatPromptTemplate.from_template(base_config.get("llm_prompt_template"))
retrieval_chain = (
    {
        "context": retriever,
        "question": RunnablePassthrough(),
    }
    | prompt
    | get_fake_chat_model()
    | StrOutputParser()
)

set_model(retrieval_chain)
set_retriever_schema(
    primary_key="primary-key",
    text_column="text-column",
    doc_uri="doc-uri",
    other_columns=["column1", "column2"],
)

retrieval_chain.invoke({"question": "What is the capital of Japan?"})
```

--------------------------------------------------------------------------------

---[FILE: chain_with_mlflow_prompt.py]---
Location: mlflow-master/tests/langchain/sample_code/chain_with_mlflow_prompt.py

```python
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

import mlflow
from mlflow.models import set_model

prompt = ChatPromptTemplate.from_template(
    mlflow.load_prompt("prompts:/qa_prompt@production").to_single_brace_format()
)
chain = prompt | ChatOpenAI(temperature=0) | StrOutputParser()

set_model(chain)
```

--------------------------------------------------------------------------------

---[FILE: config.yml]---
Location: mlflow-master/tests/langchain/sample_code/config.yml

```yaml
llm_prompt_template: "Answer the following question based on the context: {context}\nQuestion: {question}"
embedding_size: 5
response: "Databricks"
not_used_array:
  - 1
  - 2
  - 3
```

--------------------------------------------------------------------------------

---[FILE: langchain_chat_agent.py]---
Location: mlflow-master/tests/langchain/sample_code/langchain_chat_agent.py

```python
from operator import itemgetter
from typing import Any, Generator

from langchain_core.messages import AIMessage, AIMessageChunk
from langchain_core.outputs import ChatGeneration, ChatGenerationChunk, ChatResult
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableLambda
from langchain_core.runnables.base import Runnable
from langchain_openai import ChatOpenAI

import mlflow
from mlflow.langchain.output_parsers import ChatAgentOutputParser
from mlflow.pyfunc.model import ChatAgent
from mlflow.types.agent import ChatAgentChunk, ChatAgentMessage, ChatAgentResponse, ChatContext


class FakeOpenAI(ChatOpenAI, extra="allow"):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self._responses = iter([AIMessage(content="1")])
        self._stream_responses = iter(
            [
                AIMessageChunk(content="1"),
                AIMessageChunk(content="2"),
                AIMessageChunk(content="3"),
            ]
        )

    def _generate(self, *args, **kwargs):
        return ChatResult(generations=[ChatGeneration(message=next(self._responses))])

    def _stream(self, *args, **kwargs):
        for r in self._stream_responses:
            yield ChatGenerationChunk(message=r)


mlflow.langchain.autolog()


# Helper functions
def extract_user_query_string(messages):
    return messages[-1]["content"]


def extract_chat_history(messages):
    return messages[:-1]


# Define components
prompt = ChatPromptTemplate.from_template(
    """Previous conversation:
{chat_history}

User's question:
{question}"""
)

model = FakeOpenAI()
output_parser = ChatAgentOutputParser()

# Chain definition
chain = (
    {
        "question": itemgetter("messages") | RunnableLambda(extract_user_query_string),
        "chat_history": itemgetter("messages") | RunnableLambda(extract_chat_history),
    }
    | prompt
    | model
    | output_parser
)


class LangChainChatAgent(ChatAgent):
    """
    Helper class to wrap a LangChain runnable as a :py:class:`ChatAgent <mlflow.pyfunc.ChatAgent>`.
    Use this class with
    :py:class:`ChatAgentOutputParser <mlflow.langchain.output_parsers.ChatAgentOutputParser>`.
    """

    def __init__(self, agent: Runnable):
        self.agent = agent

    def predict(
        self,
        messages: list[ChatAgentMessage],
        context: ChatContext | None = None,
        custom_inputs: dict[str, Any] | None = None,
    ) -> ChatAgentResponse:
        response = self.agent.invoke({"messages": self._convert_messages_to_dict(messages)})
        return ChatAgentResponse(**response)

    def predict_stream(
        self,
        messages: list[ChatAgentMessage],
        context: ChatContext | None = None,
        custom_inputs: dict[str, Any] | None = None,
    ) -> Generator[ChatAgentChunk, None, None]:
        for event in self.agent.stream({"messages": self._convert_messages_to_dict(messages)}):
            yield ChatAgentChunk(**event)


chat_agent = LangChainChatAgent(chain)

mlflow.models.set_model(chat_agent)
```

--------------------------------------------------------------------------------

---[FILE: model_with_config.py]---
Location: mlflow-master/tests/langchain/sample_code/model_with_config.py

```python
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import ConfigurableField
from langchain_openai import ChatOpenAI

from mlflow.models import set_model

model = ChatOpenAI(temperature=0).configurable_fields(
    temperature=ConfigurableField(
        id="temperature",
        name="LLM temperature",
        description="The temperature of the LLM",
    )
)

prompt = PromptTemplate.from_template("Pick a random number above {x}")
chain = prompt | model

set_model(chain)
```

--------------------------------------------------------------------------------

---[FILE: openai_agent.py]---
Location: mlflow-master/tests/langchain/sample_code/openai_agent.py

```python
import itertools

from langchain.agents import create_agent
from langchain.tools import tool
from langchain_core.messages import AIMessageChunk, ToolCall
from langchain_core.outputs import ChatGeneration, ChatGenerationChunk, ChatResult
from langchain_openai import ChatOpenAI

import mlflow


class FakeOpenAI(ChatOpenAI, extra="allow"):
    # In normal LangChain tests, we use the fake OpenAI server to mock the OpenAI REST API.
    # The fake server returns the input payload as it is. However, for agent tests, the
    # response should be a specific format so that the agent can parse it correctly.
    # Also, mocking with mock.patch does not work for testing model serving (as the server
    # will run in a separate process).
    # Therefore, we mock the OpenAI client in the model definition here.
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Using itertools.cycle to create an infinite iterator
        self._responses = itertools.cycle(
            [
                AIMessageChunk(
                    content="",
                    tool_calls=[ToolCall(name="multiply", args={"a": 2, "b": 3}, id="123")],
                ),
                AIMessageChunk(content="The result of 2 * 3 is 6."),
            ]
        )

    def _generate(self, *args, **kwargs):
        return ChatResult(generations=[ChatGeneration(message=next(self._responses))])

    def _stream(self, *args, **kwargs):
        yield ChatGenerationChunk(message=next(self._responses))


@tool
def add(a: int, b: int) -> int:
    """Add two numbers."""
    return a + b


@tool
def multiply(a: int, b: int) -> int:
    """Multiply two numbers."""
    return a * b


llm = FakeOpenAI()
agent = create_agent(llm, [add, multiply], system_prompt="You are a helpful assistant")
mlflow.models.set_model(agent)
```

--------------------------------------------------------------------------------

---[FILE: simple_runnable.py]---
Location: mlflow-master/tests/langchain/sample_code/simple_runnable.py

```python
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI

import mlflow

prompt = PromptTemplate(
    input_variables=["product"],
    template="What is {product}?",
)
llm = ChatOpenAI(temperature=0.1, stream_usage=True)
chain = prompt | llm | StrOutputParser()

mlflow.models.set_model(chain)
```

--------------------------------------------------------------------------------

---[FILE: workflow.py]---
Location: mlflow-master/tests/langchain/sample_code/workflow.py

```python
import json
import os
from typing import Any, Sequence

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

    @mlflow.trace
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


mlflow.langchain.autolog()
llm = FakeOpenAI()
graph = create_tool_calling_agent(llm, tools)

mlflow.models.set_model(graph)
```

--------------------------------------------------------------------------------

---[FILE: chain.py]---
Location: mlflow-master/tests/langchain/sample_code/no_config/chain.py

```python
from typing import Any

from langchain_community.chat_models import ChatDatabricks, ChatMlflow
from langchain_community.document_loaders import TextLoader
from langchain_community.embeddings import FakeEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.callbacks.manager import CallbackManagerForLLMRun
from langchain_core.messages import BaseMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.outputs import ChatResult
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_text_splitters.character import CharacterTextSplitter

from mlflow.models import set_model


def get_fake_chat_model(endpoint="fake-endpoint"):
    class FakeChatModel(ChatDatabricks):
        """Fake Chat Model wrapper for testing purposes."""

        endpoint: str = "fake-endpoint"

        def _generate(
            self,
            messages: list[BaseMessage],
            stop: list[str] | None = None,
            run_manager: CallbackManagerForLLMRun | None = None,
            **kwargs: Any,
        ) -> ChatResult:
            response = {
                "choices": [
                    {
                        "index": 0,
                        "message": {
                            "role": "assistant",
                            "content": "Databricks",
                        },
                        "finish_reason": None,
                    }
                ],
            }
            return ChatMlflow._create_chat_result(response)

        @property
        def _llm_type(self) -> str:
            return "fake chat model"

    return FakeChatModel(endpoint=endpoint)


text_path = "tests/langchain/state_of_the_union.txt"
loader = TextLoader(text_path)
documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
docs = text_splitter.split_documents(documents)
embeddings = FakeEmbeddings(size=5)
vectorstore = FAISS.from_documents(docs, embeddings)
retriever = vectorstore.as_retriever()

prompt = ChatPromptTemplate.from_template(
    "Answer the following question based on the context: {context}\nQuestion: {question}"
)
retrieval_chain = (
    {
        "context": retriever,
        "question": RunnablePassthrough(),
    }
    | prompt
    | get_fake_chat_model()
    | StrOutputParser()
)

set_model(retrieval_chain)
```

--------------------------------------------------------------------------------

---[FILE: conftest.py]---
Location: mlflow-master/tests/langgraph/conftest.py

```python
import importlib

import openai
import pytest

from tests.helper_functions import start_mock_openai_server
from tests.tracing.helper import reset_autolog_state  # noqa: F401


@pytest.fixture(autouse=True)
def set_envs(monkeypatch, mock_openai):
    monkeypatch.setenv("OPENAI_API_KEY", "test")
    monkeypatch.setenv("OPENAI_API_BASE", mock_openai)
    monkeypatch.setenv("SERPAPI_API_KEY", "test")
    importlib.reload(openai)


@pytest.fixture(scope="module", autouse=True)
def mock_openai():
    with start_mock_openai_server() as base_url:
        yield base_url


@pytest.fixture(autouse=True)
def reset_autolog(reset_autolog_state):
    # Apply the reset_autolog_state fixture to all tests for LangChain
    return
```

--------------------------------------------------------------------------------

---[FILE: test_chat_agent_langgraph.py]---
Location: mlflow-master/tests/langgraph/test_chat_agent_langgraph.py

```python
import json

import pytest
from langchain_core.messages import AIMessage, ToolMessage

import mlflow
from mlflow.langchain.chat_agent_langgraph import parse_message
from mlflow.types.agent import ChatAgentMessage

LC_TOOL_CALL_MSG = AIMessage(
    **{
        "content": "",
        "additional_kwargs": {
            "tool_calls": [
                {
                    "id": "call_a9b9afd5-d23a-4973-8417-ac283b1413d5",
                    "type": "function",
                    "function": {
                        "name": "system__ai__python_exec",
                        "arguments": '{ "code": "print(5+5)" }',
                    },
                }
            ]
        },
        "response_metadata": {"prompt_tokens": 2658, "completion_tokens": 24, "total_tokens": 2682},
        "type": "ai",
        "name": None,
        "id": "run-3a2ad83b-a5cf-4d51-97c8-9f68205df787-0",
        "example": False,
        "tool_calls": [
            {
                "name": "system__ai__python_exec",
                "args": {"code": "print(5+5)"},
                "id": "call_a9b9afd5-d23a-4973-8417-ac283b1413d5",
                "type": "tool_call",
            }
        ],
        "invalid_tool_calls": [],
        "usage_metadata": None,
    }
)
CHAT_AGENT_TOOL_CALL_MSG = ChatAgentMessage(
    **{
        "role": "assistant",
        "content": "",
        "name": "llm",
        "id": "run-3a2ad83b-a5cf-4d51-97c8-9f68205df787-0",
        "tool_calls": [
            {
                "id": "call_a9b9afd5-d23a-4973-8417-ac283b1413d5",
                "type": "function",
                "function": {
                    "name": "system__ai__python_exec",
                    "arguments": '{"code": "print(5+5)"}',
                },
            }
        ],
    }
).model_dump(exclude_none=True)
LC_TOOL_MSG = ToolMessage(
    **{
        "content": '{"content": "Successfully generated array of 5 random ints in [1, 100].", "attachments": {"key1": "attach1", "key2": "attach2"}, "custom_outputs": {"random_nums": [1, 82, 9, 12, 22]}}',  # noqa: E501
        "additional_kwargs": {},
        "response_metadata": {},
        "type": "tool",
        "name": "generate_random_ints",
        "id": None,
        "tool_call_id": "call_ee823299-62d7-4407-95e8-168412904471",
        "artifact": None,
        "status": "success",
    }
)
CHAT_AGENT_TOOL_MSG = ChatAgentMessage(
    role="tool",
    content='{"content": "Successfully generated array of 5 random ints in [1, 100].", "attachments": {"key1": "attach1", "key2": "attach2"}, "custom_outputs": {"random_nums": [1, 82, 9, 12, 22]}}',  # noqa: E501
    name="generate_random_ints",
    tool_calls=None,
    tool_call_id="call_ee823299-62d7-4407-95e8-168412904471",
    attachments={"key1": "attach1", "key2": "attach2"},
    finish_reason=None,
).model_dump(exclude_none=True)  # id will be a generated UUID
TOOL_MSG_ATTACHMENTS = {"key1": "attach1", "key2": "attach2"}
LC_ASSISTANT_MSG = AIMessage(
    **{
        "content": "The generated random numbers are 1, 82, 9, 12, and 22.",
        "additional_kwargs": {},
        "response_metadata": {"prompt_tokens": 2763, "completion_tokens": 22, "total_tokens": 2785},
        "type": "ai",
        "name": None,
        "id": "run-4972ab0f-8b90-4650-8a84-a689fbd912f1-0",
        "example": False,
        "tool_calls": [],
        "invalid_tool_calls": [],
        "usage_metadata": None,
    }
)
CHAT_AGENT_ASSISTANT_MSG = ChatAgentMessage(
    role="assistant",
    content="The generated random numbers are 1, 82, 9, 12, and 22.",
    name="llm",
    id="run-4972ab0f-8b90-4650-8a84-a689fbd912f1-0",
    tool_calls=None,
    tool_call_id=None,
    attachments=None,
    finish_reason=None,
).model_dump(exclude_none=True)


@pytest.mark.parametrize(
    ("lc_msg", "chat_agent_msg", "name", "attachments"),
    [
        (LC_TOOL_CALL_MSG, CHAT_AGENT_TOOL_CALL_MSG, "llm", None),
        (LC_TOOL_MSG, CHAT_AGENT_TOOL_MSG, None, TOOL_MSG_ATTACHMENTS),
        (LC_ASSISTANT_MSG, CHAT_AGENT_ASSISTANT_MSG, "llm", None),
    ],
)
def test_parse_message(lc_msg, chat_agent_msg, name, attachments):
    # id is autogenerated
    if lc_msg.id is None:
        lc_msg.id = chat_agent_msg.get("id")
    assert parse_message(lc_msg, name, attachments) == chat_agent_msg


def test_langgraph_chat_agent_save_as_code():
    # (role, content)
    expected_messages = [
        ("assistant", ""),  # tool message does not have content
        (
            "tool",
            json.dumps(
                {
                    "format": "SCALAR",
                    "value": '{"content":"hi","attachments":{"a":"b"},"custom_outputs":{"c":"d"}}',
                    "truncated": False,
                }
            ),
        ),
        ("assistant", ""),
        (
            "tool",
            json.dumps(
                {
                    "content": f"Successfully generated array of 2 random ints: {[1, 2]}.",
                    "attachments": {"key1": "attach1", "key2": "attach2"},
                    "custom_outputs": {"random_nums": [1, 2]},
                }
            ),
        ),
        ("assistant", "Successfully generated"),
    ]

    with mlflow.start_run():
        model_info = mlflow.pyfunc.log_model(
            name="agent",
            python_model="tests/langgraph/sample_code/langgraph_chat_agent.py",
        )
    loaded_model = mlflow.pyfunc.load_model(model_info.model_uri)
    response = loaded_model.predict({"messages": [{"role": "user", "content": "hi"}]})
    messages = response["messages"]
    assert len(messages) == len(expected_messages)
    for msg, (role, expected_content) in zip(messages, expected_messages):
        assert msg["role"] == role
        assert msg["content"] == expected_content

    loaded_model = mlflow.pyfunc.load_model(model_info.model_uri)
    response = loaded_model.predict_stream({"messages": [{"role": "user", "content": "hi"}]})
    for event, (role, expected_content) in zip(response, expected_messages):
        assert event["delta"]["content"] == expected_content
        assert event["delta"]["role"] == role


def test_langgraph_chat_agent_custom_inputs():
    # (role, content)
    expected_messages = [
        ("assistant", ""),  # tool message does not have content
        (
            "tool",
            json.dumps(
                {
                    "format": "SCALAR",
                    "value": '{"content":"hi","attachments":{"a":"b"},"custom_outputs":{"c":"d"}}',
                    "truncated": False,
                }
            ),
        ),
        ("assistant", ""),
        (
            "tool",
            json.dumps(
                {
                    "content": f"Successfully generated array of 2 random ints: {[1, 2]}.",
                    "attachments": {"key1": "attach1", "key2": "attach2"},
                    "custom_outputs": {"random_nums": [1, 2]},
                }
            ),
        ),
        ("assistant", "Successfully generated"),
        ("assistant", "adding custom outputs"),
    ]

    with mlflow.start_run():
        model_info = mlflow.pyfunc.log_model(
            name="agent",
            python_model="tests/langgraph/sample_code/langgraph_chat_agent_custom_inputs.py",
        )
    loaded_model = mlflow.pyfunc.load_model(model_info.model_uri)
    response = loaded_model.predict(
        {"messages": [{"role": "user", "content": "hi"}], "custom_inputs": {"asdf": "jkl;"}}
    )
    assert response["custom_outputs"]["asdf"] == "jkl;"
    messages = response["messages"]
    assert len(messages) == len(expected_messages)
    for msg, (role, expected_content) in zip(messages, expected_messages):
        assert msg["role"] == role
        assert msg["content"] == expected_content
    loaded_model = mlflow.pyfunc.load_model(model_info.model_uri)
    response = loaded_model.predict_stream(
        {"messages": [{"role": "user", "content": "hi"}], "custom_inputs": {"asdf": "jkl;"}}
    )
    counter = 0
    for chunk, (role, expected_content) in zip(response, expected_messages):
        assert chunk["delta"]["content"] == expected_content
        assert chunk["delta"]["role"] == role
        if "custom_outputs" in chunk:
            assert chunk["custom_outputs"]["asdf"] == "jkl;"
            counter += 1
    assert counter == 1
```

--------------------------------------------------------------------------------

---[FILE: test_langgraph_autolog.py]---
Location: mlflow-master/tests/langgraph/test_langgraph_autolog.py

```python
import json

import pytest

import mlflow
from mlflow.entities.span import SpanType
from mlflow.entities.span_status import SpanStatusCode
from mlflow.tracing.constant import TokenUsageKey, TraceMetadataKey

from tests.tracing.helper import get_traces, skip_when_testing_trace_sdk


@skip_when_testing_trace_sdk
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


@skip_when_testing_trace_sdk
@pytest.mark.asyncio
@pytest.mark.parametrize("is_async", [True, False], ids=["async", "sync"])
async def test_langgraph_tracing_prebuilt(is_async):
    from tests.langgraph.sample_code.langgraph_prebuilt import graph

    mlflow.langchain.autolog()

    input_example = {"messages": [{"role": "user", "content": "what is the weather in sf?"}]}
    config = {"configurable": {"thread_id": "1"}}

    if is_async:
        await graph.ainvoke(input_example, config)
    else:
        graph.invoke(input_example, config)

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert traces[0].data.spans[0].name == "LangGraph"
    assert traces[0].data.spans[0].inputs == input_example

    # (type, content)
    expected_messages = [
        ("human", "what is the weather in sf?"),
        ("ai", ""),  # tool message does not have content
        ("tool", "It's always sunny in sf"),
        ("ai", "The weather in San Francisco is always sunny!"),
    ]

    messages = traces[0].data.spans[0].outputs["messages"]
    assert len(messages) == 4
    for msg, (type, expected_content) in zip(messages, expected_messages):
        assert msg["type"] == type
        assert msg["content"] == expected_content

    # Validate tool span
    tool_span = next(span for span in traces[0].data.spans if span.span_type == SpanType.TOOL)
    assert tool_span.name == "get_weather"
    assert tool_span.inputs == {"city": "sf"}
    assert tool_span.outputs["content"] == "It's always sunny in sf"
    assert tool_span.outputs["status"] == "success"
    assert tool_span.status.status_code == SpanStatusCode.OK

    # Validate token usage
    token_usage = json.loads(traces[0].info.trace_metadata[TraceMetadataKey.TOKEN_USAGE])
    assert token_usage == {
        TokenUsageKey.INPUT_TOKENS: 15,
        TokenUsageKey.OUTPUT_TOKENS: 30,
        TokenUsageKey.TOTAL_TOKENS: 45,
    }

    # Thread ID should be recoded in the trace metadata
    assert traces[0].info.trace_metadata[TraceMetadataKey.TRACE_SESSION] == "1"


@skip_when_testing_trace_sdk
def test_langgraph_tracing_diy_graph():
    mlflow.langchain.autolog()

    input_example = {"messages": [{"role": "user", "content": "hi"}]}

    with mlflow.start_run():
        model_info = mlflow.langchain.log_model(
            "tests/langgraph/sample_code/langgraph_diy.py",
            name="langgraph",
        )

    loaded_graph = mlflow.langchain.load_model(model_info.model_uri)
    loaded_graph.invoke(input_example)

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert traces[0].data.spans[0].name == "LangGraph"
    assert traces[0].data.spans[0].inputs == input_example

    chat_spans = [span for span in traces[0].data.spans if span.name.startswith("ChatOpenAI")]
    assert len(chat_spans) == 3


@skip_when_testing_trace_sdk
def test_langgraph_tracing_with_custom_span():
    mlflow.langchain.autolog()

    input_example = {"messages": [{"role": "user", "content": "what is the weather in sf?"}]}

    with mlflow.start_run():
        model_info = mlflow.langchain.log_model(
            "tests/langgraph/sample_code/langgraph_with_custom_span.py",
            name="langgraph",
            input_example=input_example,
        )

    loaded_graph = mlflow.langchain.load_model(model_info.model_uri)

    # No trace should be created for the first call
    assert mlflow.get_trace(mlflow.get_last_active_trace_id()) is None

    loaded_graph.invoke(input_example)

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert traces[0].data.spans[0].name == "LangGraph"
    assert traces[0].data.spans[0].inputs == input_example

    spans = traces[0].data.spans

    # Validate chat model spans
    chat_spans = [s for s in spans if s.span_type == SpanType.CHAT_MODEL]
    assert len(chat_spans) == 3

    # Validate tool span
    tool_span = next(s for s in spans if s.span_type == SpanType.TOOL)
    assert tool_span.name == "get_weather"
    assert tool_span.inputs == {"city": "sf"}
    assert tool_span.outputs["content"] == "It's always sunny in sf"
    assert tool_span.outputs["status"] == "success"
    assert tool_span.status.status_code == SpanStatusCode.OK

    # Validate inner span
    inner_span = next(s for s in spans if s.name == "get_weather_inner")
    assert inner_span.parent_id == tool_span.span_id
    assert inner_span.inputs == "sf"
    assert inner_span.outputs == "It's always sunny in sf"

    inner_runnable_span = next(s for s in spans if s.parent_id == inner_span.span_id)
    assert inner_runnable_span.name == "RunnableSequence"


@skip_when_testing_trace_sdk
@pytest.mark.asyncio
@pytest.mark.parametrize("is_async", [True, False], ids=["async", "sync"])
async def test_langgraph_tracing_with_parent_span(is_async):
    from tests.langgraph.sample_code.langgraph_prebuilt import graph

    mlflow.langchain.autolog()

    input_example = {"messages": [{"role": "user", "content": "what is the weather in sf?"}]}

    with mlflow.start_span("parent"):
        if is_async:
            await graph.ainvoke(input_example)
        else:
            graph.invoke(input_example)

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"

    # Validate structure
    span_id_to_span = {span.span_id: span for span in traces[0].data.spans}
    tool_span = next(span for span in traces[0].data.spans if span.span_type == SpanType.TOOL)
    assert tool_span.name == "get_weather"

    tool_parent_span = span_id_to_span[tool_span.parent_id]
    assert tool_parent_span.name == "tools"
    assert tool_parent_span.span_type == SpanType.CHAIN

    graph_span = span_id_to_span[tool_parent_span.parent_id]
    assert graph_span.name == "LangGraph"
    assert graph_span.span_type == SpanType.CHAIN

    root_span = span_id_to_span[graph_span.parent_id]
    assert root_span.name == "parent"
    assert root_span.span_type == SpanType.UNKNOWN


@skip_when_testing_trace_sdk
def test_langgraph_chat_agent_trace():
    input_example = {"messages": [{"role": "user", "content": "hi"}]}

    with mlflow.start_run():
        model_info = mlflow.pyfunc.log_model(
            name="agent",
            python_model="tests/langgraph/sample_code/langgraph_chat_agent.py",
        )
    loaded_model = mlflow.pyfunc.load_model(model_info.model_uri)
    # No trace should be created for loading it in
    assert mlflow.get_trace(mlflow.get_last_active_trace_id()) is None

    loaded_model.predict(input_example)
    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert traces[0].info.request_metadata[TraceMetadataKey.MODEL_ID] == model_info.model_id
    assert traces[0].data.spans[0].name == "LangGraph"
    assert traces[0].data.spans[0].inputs == input_example

    loaded_model = mlflow.pyfunc.load_model(model_info.model_uri)
    list(loaded_model.predict_stream(input_example))
    traces = get_traces()
    assert len(traces) == 2
    assert traces[0].info.status == "OK"
    assert traces[0].info.request_metadata[TraceMetadataKey.MODEL_ID] == model_info.model_id
    assert traces[0].data.spans[0].name == "LangGraph"
    assert traces[0].data.spans[0].inputs == input_example


@skip_when_testing_trace_sdk
def test_langgraph_autolog_with_update_current_span():
    model_info = mlflow.langchain.log_model(
        lc_model="tests/langgraph/sample_code/langgraph_with_autolog.py",
        input_example={"status": "done"},
    )
    assert model_info.signature is not None
    assert model_info.signature.inputs is not None
    assert model_info.signature.outputs is not None
```

--------------------------------------------------------------------------------

````
