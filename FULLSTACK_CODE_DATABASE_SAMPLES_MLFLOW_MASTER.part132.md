---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 132
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 132 of 991)

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

---[FILE: autogen.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/autogen.mdx

```text
---
sidebar_position: 6
sidebar_label: AutoGen
---

import { APILink } from "@site/src/components/APILink";

# Tracing AutoGen

![AutoGen tracing via autolog](/images/llms/autogen/autogen-trace.png)

[AutoGen AgentChat](https://microsoft.github.io/autogen/stable/index.html) is an open-source framework for building conversational single and multi-agent applications.

[MLflow Tracing](../../) provides automatic tracing capability for AutoGen AgentChat. By enabling auto tracing
for AutoGen by calling the <APILink fn="mlflow.autogen.autolog" /> function, MLflow will capture nested traces and log them to the active MLflow Experiment upon agents execution.

```python
import mlflow

mlflow.autogen.autolog()
```

:::note

Note that `mlflow.autogen.autolog()` should be called after importing AutoGen classes that are traced.
Subclasses of `ChatCompletionClient` such as `OpenAIChatCompletionClient` or `AnthropicChatCompletionClient` and subclasses of `BaseChatAgent` such as `AssistantAgent` or `CodeExecutorAgent` should be imported before calling `mlflow.autogen.autolog()`.
Also note that this integration is for AutoGen 0.4.9 or above. If you are using AutoGen 0.2, please use the [AG2 integration](../ag2) instead.

:::

MLflow captures the following information about the AutoGen agents:

- Messages passed to agents including images
- Responses from agents
- LLM and tool calls made by each agent
- Latencies
- Any exception if raised

### Supported APIs

MLflow supports automatic tracing for the following AutoGen APIs.
It does not support tracing for asynchronous generators. Asynchronous streaming APIs such as `run_stream` or `on_messages_stream` are not traced.

- `ChatCompletionClient.create`
- `BaseChatAgent.run`
- `BaseChatAgent.on_messages`

### Basic Example

```python
import os

# Imports of autogen classes should happen before calling autolog.
from autogen_agentchat.agents import AssistantAgent
from autogen_ext.models.openai import OpenAIChatCompletionClient

import mlflow

# Turn on auto tracing for AutoGen
mlflow.autogen.autolog()

# Optional: Set a tracking URI and an experiment
mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("AutoGen")

model_client = OpenAIChatCompletionClient(
    model="gpt-4.1-nano",
    # api_key="YOUR_API_KEY",
)

agent = AssistantAgent(
    name="assistant",
    model_client=model_client,
    system_message="You are a helpful assistant.",
)

result = await agent.run(task="Say 'Hello World!'")
print(result)
```

### Tool Agent

```python
import os

# Imports of autogen classes should happen before calling autolog.
from autogen_agentchat.agents import AssistantAgent
from autogen_ext.models.openai import OpenAIChatCompletionClient

import mlflow

# Turn on auto tracing for AutoGen
mlflow.autogen.autolog()

# Optional: Set a tracking URI and an experiment
mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("AutoGen")

model_client = OpenAIChatCompletionClient(
    model="gpt-4.1-nano",
    # api_key="YOUR_API_KEY",
)


def add(a: int, b: int) -> int:
    """add two numbers"""
    return a + b


agent = AssistantAgent(
    name="assistant",
    model_client=model_client,
    system_message="You are a helpful assistant.",
    tools=[add],
)

await agent.run(task="1+1")
```

## Token usage

MLflow >= 3.2.0 supports token usage tracking for AutoGen. The token usage for each LLM call will be logged in the `mlflow.chat.tokenUsage` attribute. The total token usage throughout the trace will be
available in the `token_usage` field of the trace info object.

```python
import json
import mlflow

mlflow.autogen.autolog()

# Run the tool calling agent defined in the previous section
await agent.run(task="1+1")

# Get the trace object just created
last_trace_id = mlflow.get_last_active_trace_id()
trace = mlflow.get_trace(trace_id=last_trace_id)

# Print the token usage
total_usage = trace.info.token_usage
print("== Total token usage: ==")
print(f"  Input tokens: {total_usage['input_tokens']}")
print(f"  Output tokens: {total_usage['output_tokens']}")
print(f"  Total tokens: {total_usage['total_tokens']}")

# Print the token usage for each LLM call
print("\n== Detailed usage for each LLM call: ==")
for span in trace.data.spans:
    if usage := span.get_attribute("mlflow.chat.tokenUsage"):
        print(f"{span.name}:")
        print(f"  Input tokens: {usage['input_tokens']}")
        print(f"  Output tokens: {usage['output_tokens']}")
        print(f"  Total tokens: {usage['total_tokens']}")
```

```bash
== Total token usage: ==
  Input tokens: 65
  Output tokens: 17
  Total tokens: 82

== Detailed usage for each LLM call: ==
create:
  Input tokens: 65
  Output tokens: 17
  Total tokens: 82
```

### Supported APIs

MLflow supports automatic token usage tracking for the following AutoGen APIs.
It does not support token usage tracking for asynchronous generators. Asynchronous streaming APIs such as `run_stream` or `on_messages_stream` are not tracked.

- `ChatCompletionClient.create`
- `BaseChatAgent.run`
- `BaseChatAgent.on_messages`

### Disable auto-tracing

Auto tracing for AutoGen can be disabled globally by calling `mlflow.autogen.autolog(disable=True)` or `mlflow.autolog(disable=True)`.
```

--------------------------------------------------------------------------------

---[FILE: bedrock.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/bedrock.mdx

```text
---
sidebar_position: 4.5
sidebar_label: Bedrock
---

import { APILink } from "@site/src/components/APILink"

# Tracing Amazon Bedrock with MLflow

MLflow supports automatic tracing for Amazon Bedrock, a fully managed service on AWS that provides high-performing
foundations from leading AI providers such as Anthropic, Cohere, Meta, Mistral AI, and more. By enabling auto tracing
for Amazon Bedrock by calling the <APILink fn="mlflow.bedrock.autolog" /> function, MLflow will capture traces for LLM invocation
and log them to the active MLflow Experiment.

![Bedrock DIY Agent Tracing](/images/llms/tracing/bedrock-tracing-agent.png)

```python
import mlflow

mlflow.bedrock.autolog()
```

MLflow trace automatically captures the following information about Amazon Bedrock calls:

- Prompts and completion responses
- Latencies
- Model name
- Additional metadata such as temperature, max_tokens, if specified.
- Function calling if returned in the response
- Any exception if raised

## Supported APIs

MLflow supports automatic tracing for the following Amazon Bedrock APIs:

- [converse](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/bedrock-runtime/client/converse.html)
- [converse_stream](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/bedrock-runtime/client/converse_stream.html)
- [invoke_model](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/bedrock-runtime/client/invoke_model.html)
- [invoke_model_with_response_stream](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/bedrock-runtime/client/invoke_model_with_response_stream.html)

## Basic Example

```python
import boto3
import mlflow

# Enable auto-tracing for Amazon Bedrock
mlflow.bedrock.autolog()
mlflow.set_experiment("Bedrock")
# Create a boto3 client for invoking the Bedrock API
bedrock = boto3.client(
    service_name="bedrock-runtime",
    region_name="<REPLACE_WITH_YOUR_AWS_REGION>",
)
# MLflow will log a trace for Bedrock API call in the "Bedrock" experiment created above
response = bedrock.converse(
    modelId="anthropic.claude-3-5-sonnet-20241022-v2:0",
    messages=[
        {
            "role": "user",
            "content": "Describe the purpose of a 'hello world' program in one line.",
        }
    ],
    inferenceConfig={
        "maxTokens": 512,
        "temperature": 0.1,
        "topP": 0.9,
    },
)
```

The logged trace, associated with the `Bedrock` experiment, can be seen in the MLflow UI.

## Raw Inputs and Outputs

By default, MLflow renders the rich chat-like UI for input and output messages in the `Chat` tab. To view the raw input and output payload, including configuration parameters, click on the `Inputs / Outputs` tab in the UI.

:::note
The `Chat` panel is only supported for the `converse` and `converse_stream` APIs. For the other APIs, MLflow only displays the `Inputs / Outputs` tab.
:::

## Token Usage

MLflow automatically captures token usage statistics for supported Bedrock models and APIs. The token usage for each LLM call will be logged in the `mlflow.chat.tokenUsage` attribute. The total token usage throughout the trace will be available in the `token_usage` field of the trace info object.

Token usage includes:

- **Input tokens** (prompt tokens)
- **Output tokens** (completion/generation tokens)
- **Total tokens** (sum of input and output)

Token usage is extracted from the response for all major Bedrock providers, including:

- Anthropic (Claude)
- AI21 (Jamba)
- Amazon Titan/Nova
- Meta Llama

### Supported APIs

Token usage is logged for:

- `invoke_model`
- `invoke_model_with_response_stream`
- `converse`
- `converse_stream`

```python
import boto3
import mlflow

mlflow.bedrock.autolog()

# Create a boto3 client for invoking the Bedrock API
bedrock = boto3.client(
    service_name="bedrock-runtime",
    region_name="<REPLACE_WITH_YOUR_AWS_REGION>",
)

# Use the converse method to create a new message
response = bedrock.converse(
    modelId="anthropic.claude-3-5-sonnet-20241022-v2:0",
    messages=[
        {
            "role": "user",
            "content": "Explain the importance of low latency LLMs.",
        }
    ],
    inferenceConfig={
        "maxTokens": 512,
        "temperature": 0.1,
        "topP": 0.9,
    },
)

# Get the trace object just created
last_trace_id = mlflow.get_last_active_trace_id()
trace = mlflow.get_trace(trace_id=last_trace_id)

# Print the token usage
total_usage = trace.info.token_usage
print("== Total token usage: ==")
print(f" Input tokens: {total_usage['input_tokens']}")
print(f" Output tokens: {total_usage['output_tokens']}")
print(f" Total tokens: {total_usage['total_tokens']}")

# Print the token usage for each LLM call
print("\n== Detailed usage for each LLM call: ==")
for span in trace.data.spans:
    if usage := span.get_attribute("mlflow.chat.tokenUsage"):
        print(f"{span.name}:")
        print(f" Input tokens: {usage['input_tokens']}")
        print(f" Output tokens: {usage['output_tokens']}")
        print(f" Total tokens: {usage['total_tokens']}")
```

If a provider or model does not return usage information, this attribute will be omitted.

## Streaming

MLflow supports tracing streaming calls to Amazon Bedrock APIs. The generated trace shows the aggregated output message in the `Chat` tab, while the individual chunks are displayed in the `Events` tab.

```python
response = bedrock.converse_stream(
    modelId="anthropic.claude-3-5-sonnet-20241022-v2:0",
    messages=[
        {
            "role": "user",
            "content": [
                {"text": "Describe the purpose of a 'hello world' program in one line."}
            ],
        }
    ],
    inferenceConfig={
        "maxTokens": 300,
        "temperature": 0.1,
        "topP": 0.9,
    },
)

for chunk in response["stream"]:
    print(chunk)
```

![Bedrock Stream Tracing](/images/llms/tracing/bedrock-tracing-stream.png)

:::warning
MLflow does not create a span immediately when the streaming response is returned. Instead, it creates a span when the streaming chunks are **consumed**, for example, the for-loop in the code snippet above.
:::

## Function Calling Agent

MLflow Tracing automatically captures function calling metadata when calling Amazon Bedrock APIs. The function definition and instruction in the response will be highlighted in the `Chat` tab on trace UI.

Combining this with the manual tracing feature, you can define a function-calling agent (ReAct) and trace its execution. The entire agent implementation might look complicated, but the tracing part is pretty straightforward: (1) add the `@mlflow.trace` decorator to functions to trace and (2) enable auto-tracing for Amazon Bedrock with `mlflow.bedrock.autolog()`. MLflow will take care of the complexity such as resolving call chains and recording execution metadata.

```python
import boto3
import mlflow
from mlflow.entities import SpanType

# Enable auto-tracing for Amazon Bedrock
mlflow.bedrock.autolog()
mlflow.set_experiment("Bedrock")
# Create a boto3 client for invoking the Bedrock API
bedrock = boto3.client(
    service_name="bedrock-runtime",
    region_name="<REPLACE_WITH_YOUR_AWS_REGION>",
)
model_id = "anthropic.claude-3-5-sonnet-20241022-v2:0"


# Define the tool function. Decorate it with `@mlflow.trace` to create a span for its execution.
@mlflow.trace(span_type=SpanType.TOOL)
def get_weather(city: str) -> str:
    """ "Get the current weather in a given location"""
    return "sunny" if city == "San Francisco, CA" else "unknown"


# Define the tool configuration passed to Bedrock
tools = [
    {
        "toolSpec": {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "inputSchema": {
                "json": {
                    "type": "object",
                    "properties": {
                        "city": {
                            "type": "string",
                            "description": "The city and state, e.g., San Francisco, CA",
                        },
                    },
                    "required": ["city"],
                }
            },
        }
    }
]
tool_functions = {"get_weather": get_weather}


# Define a simple tool calling agent
@mlflow.trace(span_type=SpanType.AGENT)
def run_tool_agent(question: str) -> str:
    messages = [{"role": "user", "content": [{"text": question}]}]
    # Invoke the model with the given question and available tools
    response = bedrock.converse(
        modelId=model_id,
        messages=messages,
        toolConfig={"tools": tools},
    )
    assistant_message = response["output"]["message"]
    messages.append(assistant_message)
    # If the model requests tool call(s), invoke the function with the specified arguments
    tool_use = next(
        (c["toolUse"] for c in assistant_message["content"] if "toolUse" in c), None
    )
    if tool_use:
        tool_func = tool_functions[tool_use["name"]]
        tool_result = tool_func(**tool_use["input"])
        messages.append(
            {
                "role": "user",
                "content": [
                    {
                        "toolResult": {
                            "toolUseId": tool_use["toolUseId"],
                            "content": [{"text": tool_result}],
                        }
                    }
                ],
            }
        )
        # Send the tool results to the model and get a new response
        response = bedrock.converse(
            modelId=model_id,
            messages=messages,
            toolConfig={"tools": tools},
        )
    return response["output"]["message"]["content"][0]["text"]


# Run the tool calling agent
question = "What's the weather like in San Francisco today?"
answer = run_tool_agent(question)
```

Executing the code above will create a single trace that involves all LLM invocations and the tool calls.

![Bedrock DIY Agent Tracing](/images/llms/tracing/bedrock-tracing-agent.png)

## Disable auto-tracing

Auto tracing for Amazon Bedrock can be disabled globally by calling `mlflow.bedrock.autolog(disable=True)` or `mlflow.autolog(disable=True)`.
```

--------------------------------------------------------------------------------

---[FILE: claude_code.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/claude_code.mdx

```text
---
sidebar_position: 9
sidebar_label: Claude Code
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Tracing Claude Code

![Claude Code Tracing via CLI autolog](/images/llms/anthropic/claude-code-tracing.png)

[MLflow Tracing](/genai/tracing) provides automatic tracing for Claude Code:

1. **CLI tracing**: Automatically trace interactive Claude Code CLI conversations
2. **SDK tracing**: Trace Claude Agent SDK usage in Python applications

After setting up auto tracing, MLflow will automatically capture traces of your Claude Code conversations and log them to the active MLflow experiment. The trace automatically captures information such as:

- User prompts and assistant responses
- Tool usage (file operations, code execution, web searches, etc.)
- Conversation timing and duration
- Tool execution results
- Session metadata including working directory and user

## Setup

Claude Code tracing can be configured using either CLI commands (for interactive use) or Python SDK imports (for programmatic use).

<Tabs>
<TabItem value="cli" label="CLI Tracing" default>

### CLI Tracing Setup

Use CLI tracing to automatically capture your interactive Claude Code CLI conversations.

#### Requirements

- MLflow >= 3.4 (`pip install mlflow>=3.4`)
- [Claude Code CLI](https://claude.com/product/claude-code) installed and configured

#### Basic Setup

```bash
# Set up tracing in current directory
mlflow autolog claude

# Set up tracing in specific directory
mlflow autolog claude ~/my-project

# Check tracing status
mlflow autolog claude --status

# Disable tracing
mlflow autolog claude --disable
```

#### Configuration Examples

```bash
# Set up with custom tracking URI
mlflow autolog claude -u file://./custom-mlruns
mlflow autolog claude -u sqlite:///mlflow.db

# Set up with Databricks backend and a specific experiment ID
mlflow autolog claude -u databricks -e 123456789

# Set up with specific experiment
mlflow autolog claude -n "My AI Project"
```

#### How It Works

1. **Setup Phase**: The `mlflow autolog claude` command configures Claude Code hooks in a `.claude/settings.json` file in your project directory
2. **Automatic Tracing**: When you use the `claude` command in the configured directory, your conversations are automatically traced
3. **View Results**: Use the MLflow UI to explore your traces

#### Basic Example

```bash
# Set up tracing in your project
mlflow autolog claude ~/my-project

# Navigate to project directory
cd ~/my-project

# Use Claude Code normally - tracing happens automatically
claude "help me refactor this Python function to be more efficient"

# View traces in MLflow UI
mlflow server
```

</TabItem>
<TabItem value="sdk" label="SDK Tracing">

### SDK Tracing Setup

Use SDK tracing when building applications that programmatically use the Claude Agent SDK.

#### Requirements

- MLflow >= 3.5 (`pip install mlflow>=3.5`)
- [Claude Agent SDK](https://docs.claude.com/en/api/agent-sdk/overview) >= 0.1.0 (`pip install claude-agent-sdk >= 0.1.0`)

#### Basic Setup

```python
import mlflow.anthropic

# Enable automatic tracing for Claude Agent SDK
mlflow.anthropic.autolog()
```

Once enabled, all Claude Agent SDK interactions will be automatically traced.

:::note
Only `ClaudeSDKClient` supports tracing. Directly calling `query` will not be traced!
:::

#### Complete Example

```python
import asyncio
import mlflow.anthropic
from claude_agent_sdk import ClaudeSDKClient

# Enable autologging
mlflow.anthropic.autolog()

# Optionally configure MLflow experiment
mlflow.set_experiment("my_claude_app")


async def main():
    async with ClaudeSDKClient() as client:
        await client.query("What is the capital of France?")

        async for message in client.receive_response():
            print(message)


if __name__ == "__main__":
    asyncio.run(main())
```

#### Claude Tracing with MLflow GenAI Evaluation

You can also use SDK tracing with MLflow's GenAI evaluation framework:

```python
import asyncio
import pandas as pd
from claude_agent_sdk import ClaudeSDKClient
from typing import Literal

import mlflow.anthropic
from mlflow.genai import evaluate, scorer
from mlflow.genai.judges import make_judge

mlflow.anthropic.autolog()


async def run_agent(query: str) -> str:
    """Run Claude Agent SDK and return response"""
    async with ClaudeSDKClient() as client:
        await client.query(query)

        response_text = ""
        async for message in client.receive_response():
            response_text += str(message) + "\n\n"

        return response_text


def predict_fn(query: str) -> str:
    """Synchronous wrapper for evaluation"""
    return asyncio.run(run_agent(query))


relevance = make_judge(
    name="relevance",
    instructions=(
        "Evaluate if the response in {{ outputs }} is relevant to "
        "the question in {{ inputs }}. Return either 'pass' or 'fail'."
    ),
    feedback_value_type=Literal["pass", "fail"],
    model="openai:/gpt-4o",
)

# Create evaluation dataset
eval_data = pd.DataFrame(
    [
        {"inputs": {"query": "What is machine learning?"}},
        {"inputs": {"query": "Explain neural networks"}},
    ]
)

# Run evaluation with automatic tracing
mlflow.set_experiment("claude_evaluation")
evaluate(data=eval_data, predict_fn=predict_fn, scorers=[relevance])
```

</TabItem>
</Tabs>

## Troubleshooting

<Tabs>
<TabItem value="cli" label="CLI Tracing" default>

### Check CLI Status

```bash
mlflow autolog claude --status
```

This shows:

- Whether tracing is enabled
- Current tracking URI
- Configured experiment
- Any configuration issues

### Common CLI Issues

**Tracing not working:**

- Ensure you're in the configured directory
- Check that `.claude/settings.json` exists
- Review logs in `.claude/mlflow/claude_tracing.log`

**Missing traces:**

- Check if `MLFLOW_CLAUDE_TRACING_ENABLED=true` in your configuration
- Verify the tracking URI is accessible
- Review logs in `.claude/mlflow/claude_tracing.log`

### Disable CLI Tracing

To stop automatic CLI tracing:

```bash
mlflow autolog claude --disable
```

This removes the hooks from `.claude/settings.json` but preserves existing traces.

</TabItem>
<TabItem value="sdk" label="SDK Tracing">

### Common SDK Issues

**No traces appearing:**

- Tracing only works with `ClaudeSDKClient` - direct usage of `query()` is not supported
- Verify `mlflow.anthropic.autolog()` is called before creating the `ClaudeSDKClient`
- Check that the tracking URI and experiment ID are configured correctly

### Disable SDK Tracing

To disable SDK tracing:

```python
mlflow.anthropic.autolog(disable=True)
```

</TabItem>
</Tabs>
```

--------------------------------------------------------------------------------

---[FILE: crewai.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/crewai.mdx

```text
---
sidebar_position: 7
sidebar_label: CrewAI
---

import useBaseUrl from '@docusaurus/useBaseUrl';

import { APILink } from "@site/src/components/APILink";

# Tracing CrewAI

<video src={useBaseUrl("/images/llms/crewai/crewai-tracing.mp4")} controls loop autoPlay muted aria-label="CrewAI Tracing via autolog" />

[CrewAI](https://www.crewai.com/) is an open-source framework for orchestrating role-playing, autonomous AI agent.

[MLflow Tracing](../../) provides automatic tracing capability for [CrewAI](https://www.crewai.com/), an open source framework for building multi-agent applications. By enabling auto tracing
for CrewAI by calling the <APILink fn="mlflow.crewai.autolog" /> function, , MLflow will capture nested traces for CrewAI workflow execution and logged them to the active MLflow Experiment.

```python
import mlflow

mlflow.crewai.autolog()
```

MLflow trace automatically captures the following information about CrewAI agents:

- Tasks and Agent who executes each task
- Every LLM calls with input prompts, completion responses, and various metadata
- Memory load and writes operations
- Latency of each operation
- Any exception if raised

:::note

Currently, MLflow CrewAI integration only support tracing for synchronous task execution. Asynchronous task and kickoff are not supported right now.

:::

### Example Usage

First, enable auto-tracing for CrewAI, and optionally create an MLflow experiment to write traces to. This helps organizing your traces better.

```python
import mlflow

# Turn on auto tracing by calling mlflow.crewai.autolog()
mlflow.crewai.autolog()


# Optional: Set a tracking URI and an experiment
mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("CrewAI")
```

Next, define a multi-agent workflow using CrewAI. The following example defines a trip planner agent that uses web search capability as a tool.

```python
from crewai import Agent, Crew, Task
from crewai.knowledge.source.string_knowledge_source import StringKnowledgeSource
from crewai_tools import SerperDevTool, WebsiteSearchTool

from textwrap import dedent

content = "Users name is John. He is 30 years old and lives in San Francisco."
string_source = StringKnowledgeSource(
    content=content, metadata={"preference": "personal"}
)

search_tool = WebsiteSearchTool()


class TripAgents:
    def city_selection_agent(self):
        return Agent(
            role="City Selection Expert",
            goal="Select the best city based on weather, season, and prices",
            backstory="An expert in analyzing travel data to pick ideal destinations",
            tools=[
                search_tool,
            ],
            verbose=True,
        )

    def local_expert(self):
        return Agent(
            role="Local Expert at this city",
            goal="Provide the BEST insights about the selected city",
            backstory="""A knowledgeable local guide with extensive information
        about the city, it's attractions and customs""",
            tools=[search_tool],
            verbose=True,
        )


class TripTasks:
    def identify_task(self, agent, origin, cities, interests, range):
        return Task(
            description=dedent(
                f"""
                Analyze and select the best city for the trip based
                on specific criteria such as weather patterns, seasonal
                events, and travel costs. This task involves comparing
                multiple cities, considering factors like current weather
                conditions, upcoming cultural or seasonal events, and
                overall travel expenses.
                Your final answer must be a detailed
                report on the chosen city, and everything you found out
                about it, including the actual flight costs, weather
                forecast and attractions.

                Traveling from: {origin}
                City Options: {cities}
                Trip Date: {range}
                Traveler Interests: {interests}
            """
            ),
            agent=agent,
            expected_output="Detailed report on the chosen city including flight costs, weather forecast, and attractions",
        )

    def gather_task(self, agent, origin, interests, range):
        return Task(
            description=dedent(
                f"""
                As a local expert on this city you must compile an
                in-depth guide for someone traveling there and wanting
                to have THE BEST trip ever!
                Gather information about key attractions, local customs,
                special events, and daily activity recommendations.
                Find the best spots to go to, the kind of place only a
                local would know.
                This guide should provide a thorough overview of what
                the city has to offer, including hidden gems, cultural
                hotspots, must-visit landmarks, weather forecasts, and
                high level costs.
                The final answer must be a comprehensive city guide,
                rich in cultural insights and practical tips,
                tailored to enhance the travel experience.

                Trip Date: {range}
                Traveling from: {origin}
                Traveler Interests: {interests}
            """
            ),
            agent=agent,
            expected_output="Comprehensive city guide including hidden gems, cultural hotspots, and practical travel tips",
        )


class TripCrew:
    def __init__(self, origin, cities, date_range, interests):
        self.cities = cities
        self.origin = origin
        self.interests = interests
        self.date_range = date_range

    def run(self):
        agents = TripAgents()
        tasks = TripTasks()

        city_selector_agent = agents.city_selection_agent()
        local_expert_agent = agents.local_expert()

        identify_task = tasks.identify_task(
            city_selector_agent,
            self.origin,
            self.cities,
            self.interests,
            self.date_range,
        )
        gather_task = tasks.gather_task(
            local_expert_agent, self.origin, self.interests, self.date_range
        )

        crew = Crew(
            agents=[city_selector_agent, local_expert_agent],
            tasks=[identify_task, gather_task],
            verbose=True,
            memory=True,
            knowledge={
                "sources": [string_source],
                "metadata": {"preference": "personal"},
            },
        )

        result = crew.kickoff()
        return result


trip_crew = TripCrew("California", "Tokyo", "Dec 12 - Dec 20", "sports")
result = trip_crew.run()
```

## Token usage

MLflow >= 3.5.0 supports token usage tracking for CrewAI. The token usage for each LLM call will be logged in the `mlflow.chat.tokenUsage` attribute. The total token usage throughout the trace will be
available in the `token_usage` field of the trace info object.

```python
import json
import mlflow

mlflow.crewai.autolog()

# Run the tool calling agent defined in the previous section
trip_crew = TripCrew("California", "Tokyo", "Dec 12 - Dec 20", "sports")
result = trip_crew.run()

# Get the trace object just created
last_trace_id = mlflow.get_last_active_trace_id()
trace = mlflow.get_trace(trace_id=last_trace_id)

# Print the token usage
total_usage = trace.info.token_usage
print("== Total token usage: ==")
print(f"  Input tokens: {total_usage['input_tokens']}")
print(f"  Output tokens: {total_usage['output_tokens']}")
print(f"  Total tokens: {total_usage['total_tokens']}")
```

```bash
== Total token usage: ==
  Input tokens: 32870
  Output tokens: 1826
  Total tokens: 34696

== Detailed usage for each LLM call: ==
LLM.call_1:
  Input tokens: 295
  Output tokens: 63
  Total tokens: 358
LLM.call_2:
  Input tokens: 465
  Output tokens: 65
  Total tokens: 530
LLM.call_3:
  Input tokens: 4445
  Output tokens: 76
  Total tokens: 4521

... (other modules)
```

### Disable auto-tracing

Auto tracing for CrewAI can be disabled globally by calling `mlflow.crewai.autolog(disable=True)` or `mlflow.autolog(disable=True)`.
```

--------------------------------------------------------------------------------

---[FILE: deepseek.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/deepseek.mdx

```text
---
sidebar_position: 5
sidebar_label: DeepSeek
---

# Tracing DeepSeek

![Deepseek Tracing via autolog](/images/llms/deepseek/deepseek-tracing-agent.png)

[MLflow Tracing](../../) provides automatic tracing capability for Deepseek models through the OpenAI SDK integration. Since DeepSeek uses an OpenAI-compatible API format, you can use `mlflow.openai.autolog()` to trace interactions with DeepSeek models.

```python
import mlflow

# Enable
mlflow.openai.autolog()
```

MLflow trace automatically captures the following information about DeepSeek calls:

- Prompts and completion responses
- Latencies
- Model name
- Additional metadata such as `temperature`, `max_tokens`, if specified.
- Function calling if returned in the response
- Any exception if raised

## Supported APIs

MLflow supports automatic tracing for the following DeepSeek APIs through the OpenAI integration:

| Chat Completion | Function Calling | Streaming | Async    |
| --------------- | ---------------- | --------- | -------- |
| ✅              | ✅               | ✅ (\*1)  | ✅ (\*2) |

(*1) Streaming support requires MLflow 2.15.0 or later.
(*2) Async support requires MLflow 2.21.0 or later.

To request support for additional APIs, please open a [feature request](https://github.com/mlflow/mlflow/issues/new?assignees=&labels=enhancement&projects=&template=feature_request_template.yaml) on GitHub.

## Basic Example

```python
import openai
import mlflow

# Enable auto-tracing for OpenAI (works with DeepSeek)
mlflow.openai.autolog()

# Optional: Set a tracking URI and an experiment
mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("DeepSeek")

# Initialize the OpenAI client with DeepSeek API endpoint
client = openai.OpenAI(
    base_url="https://api.deepseek.com", api_key="<your_deepseek_api_key>"
)

messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What is the capital of France?"},
]

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=messages,
    temperature=0.1,
    max_tokens=100,
)
```

The above example should generate a trace in the `DeepSeek` experiment in the MLflow UI:

![Deepseek Tracing](/images/llms/deepseek/deepseek-tracing.png)

## Streaming and Async Support

MLflow supports tracing for streaming and async DeepSeek APIs. Visit the [OpenAI Tracing documentation](../openai) for example code snippets for tracing streaming and async calls through OpenAI SDK.

## Advanced Example: Function Calling Agent

MLflow Tracing automatically captures function calling responses from DeepSeek models through the OpenAI SDK. The function instruction in the response will be highlighted in the trace UI. Moreover, you can annotate the tool function with the `@mlflow.trace` decorator to create a span for the tool execution.

The following example implements a simple function calling agent using DeepSeek Function Calling and MLflow Tracing.

```python
import json
from openai import OpenAI
import mlflow
from mlflow.entities import SpanType

# Initialize the OpenAI client with DeepSeek API endpoint
client = OpenAI(base_url="https://api.deepseek.com", api_key="<your_deepseek_api_key>")


# Define the tool function. Decorate it with `@mlflow.trace` to create a span for its execution.
@mlflow.trace(span_type=SpanType.TOOL)
def get_weather(city: str) -> str:
    if city == "Tokyo":
        return "sunny"
    elif city == "Paris":
        return "rainy"
    return "unknown"


tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "parameters": {
                "type": "object",
                "properties": {"city": {"type": "string"}},
            },
        },
    }
]

_tool_functions = {"get_weather": get_weather}


# Define a simple tool calling agent
@mlflow.trace(span_type=SpanType.AGENT)
def run_tool_agent(question: str):
    messages = [{"role": "user", "content": question}]

    # Invoke the model with the given question and available tools
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=messages,
        tools=tools,
    )

    ai_msg = response.choices[0].message
    messages.append(ai_msg)

    # If the model request tool call(s), invoke the function with the specified arguments
    if tool_calls := ai_msg.tool_calls:
        for tool_call in tool_calls:
            function_name = tool_call.function.name
            if tool_func := _tool_functions.get(function_name):
                args = json.loads(tool_call.function.arguments)
                tool_result = tool_func(**args)
            else:
                raise RuntimeError("An invalid tool is returned from the assistant!")

            messages.append(
                {
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": tool_result,
                }
            )

        # Sent the tool results to the model and get a new response
        response = client.chat.completions.create(
            model="deepseek-chat", messages=messages
        )

    return response.choices[0].message.content


# Run the tool calling agent
question = "What's the weather like in Paris today?"
answer = run_tool_agent(question)
```

## Token usage

MLflow >= 3.2.0 supports token usage tracking for Deepseek models through the OpenAI SDK integration. The token usage for each LLM call will be logged in the `mlflow.chat.tokenUsage` attribute. The total token usage throughout the trace will be
available in the `token_usage` field of the trace info object.

```python
import json
import mlflow

mlflow.openai.autolog()

# Run the tool calling agent defined in the previous section
question = "What's the weather like in Paris today?"
answer = run_tool_agent(question)

# Get the trace object just created
last_trace_id = mlflow.get_last_active_trace_id()
trace = mlflow.get_trace(trace_id=last_trace_id)

# Print the token usage
total_usage = trace.info.token_usage
print("== Total token usage: ==")
print(f"  Input tokens: {total_usage['input_tokens']}")
print(f"  Output tokens: {total_usage['output_tokens']}")
print(f"  Total tokens: {total_usage['total_tokens']}")

# Print the token usage for each LLM call
print("\n== Detailed usage for each LLM call: ==")
for span in trace.data.spans:
    if usage := span.get_attribute("mlflow.chat.tokenUsage"):
        print(f"{span.name}:")
        print(f"  Input tokens: {usage['input_tokens']}")
        print(f"  Output tokens: {usage['output_tokens']}")
        print(f"  Total tokens: {usage['total_tokens']}")
```

```bash
== Total token usage: ==
  Input tokens: 84
  Output tokens: 22
  Total tokens: 106

== Detailed usage for each LLM call: ==
Completions_1:
  Input tokens: 45
  Output tokens: 14
  Total tokens: 59
Completions_2:
  Input tokens: 39
  Output tokens: 8
  Total tokens: 47
```

## Disable auto-tracing

Auto tracing for DeepSeek (through OpenAI SDK) can be disabled globally by calling `mlflow.openai.autolog(disable=True)` or `mlflow.autolog(disable=True)`.
```

--------------------------------------------------------------------------------

````
