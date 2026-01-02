---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 135
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 135 of 991)

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

---[FILE: mistral.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/mistral.mdx

```text
---
sidebar_position: 10.5
sidebar_label: Mistral
---

import { APILink } from "@site/src/components/APILink";

# Tracing Mistral

![Mistral tracing via autolog](/images/llms/mistral/mistral-tracing.png)

MLflow Tracing ensures observability for your interactions with Mistral AI models.
When Mistral auto-tracing is enabled by calling the <APILink fn="mlflow.mistral.autolog" /> function,
usage of the Mistral SDK will automatically record generated traces during interactive development.

## Supported APIs

MLflow supports automatic tracing for the following Anthropic APIs:

| Chat | Function Calling | Streaming |  Async   | Image | Embeddings | Agents |
| :--: | :--------------: | :-------: | :------: | :---: | :--------: | :----: |
|  ✅  |        ✅        |     -     | ✅ (\*1) |   -   |     -      |   -    |

<div style={{ fontSize: '0.9em', marginTop: '10px' }}>

(\*1) Async support was added in MLflow 3.5.0.

</div>

To request support for additional APIs, please open a [feature request](https://github.com/mlflow/mlflow/issues) on GitHub.

### Example Usage

```python
import os

from mistralai import Mistral

import mlflow

# Turn on auto tracing for Mistral AI by calling mlflow.mistral.autolog()
mlflow.mistral.autolog()

# Configure your API key.
client = Mistral(api_key=os.environ["MISTRAL_API_KEY"])

# Use the chat complete method to create new chat.
chat_response = client.chat.complete(
    model="mistral-small-latest",
    messages=[
        {
            "role": "user",
            "content": "Who is the best French painter? Answer in one short sentence.",
        },
    ],
)
print(chat_response.choices[0].message)
```

## Token usage

MLflow >= 3.2.0 supports token usage tracking for Mistral. The token usage for each LLM call will be logged in the `mlflow.chat.tokenUsage` attribute. The total token usage throughout the trace will be
available in the `token_usage` field of the trace info object.

```python
import json
import mlflow

mlflow.mistral.autolog()

# Configure your API key.
client = Mistral(api_key=os.environ["MISTRAL_API_KEY"])

# Use the chat complete method to create new chat.
chat_response = client.chat.complete(
    model="mistral-small-latest",
    messages=[
        {
            "role": "user",
            "content": "Who is the best French painter? Answer in one short sentence.",
        },
    ],
)

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
  Input tokens: 16
  Output tokens: 25
  Total tokens: 41

== Detailed usage for each LLM call: ==
Chat.complete:
  Input tokens: 16
  Output tokens: 25
  Total tokens: 41
```

## Disable auto-tracing

Auto tracing for Mistral can be disabled globally by calling `mlflow.mistral.autolog(disable=True)` or `mlflow.autolog(disable=True)`.
```

--------------------------------------------------------------------------------

---[FILE: ollama.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/ollama.mdx

```text
---
sidebar_position: 10
sidebar_label: Ollama
---

# Tracing Ollama

![Ollama Tracing via autolog](/images/llms/tracing/ollama-tracing.png)

[Ollama](https://ollama.com/) is an open-source platform that enables users to run large language models (LLMs) locally on their devices, such as Llama 3.2, Gemma 2, Mistral, Code Llama, and more.

Since the local LLM endpoint served by Ollama is compatible with the OpenAI API, you can query it via OpenAI SDK and enable tracing for Ollama with `mlflow.openai.autolog()`. Any LLM interactions via Ollama will be recorded to the active MLflow Experiment.

```python
import mlflow

mlflow.openai.autolog()
```

### Example Usage

1. Run the Ollama server with the desired LLM model.

```bash
ollama run llama3.2:1b
```

2. Enable auto-tracing for OpenAI SDK.

```
import mlflow

# Enable auto-tracing for OpenAI
mlflow.openai.autolog()

# Optional: Set a tracking URI and an experiment
mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("Ollama")
```

3. Query the LLM and see the traces in the MLflow UI.

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",  # The local Ollama REST endpoint
    api_key="dummy",  # Required to instantiate OpenAI client, it can be a random string
)

response = client.chat.completions.create(
    model="llama3.2:1b",
    messages=[
        {"role": "system", "content": "You are a science teacher."},
        {"role": "user", "content": "Why is the sky blue?"},
    ],
)
```

## Token usage

MLflow >= 3.2.0 supports token usage tracking for local LLM endpoint served through OpenAI SDK. The token usage for each LLM call will be logged in the `mlflow.chat.tokenUsage` attribute. The total token usage throughout the trace will be
available in the `token_usage` field of the trace info object.

```python
import json
import mlflow

mlflow.openai.autolog()

from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",  # The local Ollama REST endpoint
    api_key="dummy",  # Required to instantiate OpenAI client, it can be a random string
)

response = client.chat.completions.create(
    model="llama3.2:1b",
    messages=[
        {"role": "system", "content": "You are a science teacher."},
        {"role": "user", "content": "Why is the sky blue?"},
    ],
)

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
  Input tokens: 23
  Output tokens: 194
  Total tokens: 217

== Detailed usage for each LLM call: ==
Completions:
  Input tokens: 23
  Output tokens: 194
  Total tokens: 217
```

### Disable auto-tracing

Auto tracing for Ollama can be disabled globally by calling `mlflow.openai.autolog(disable=True)` or `mlflow.autolog(disable=True)`.
```

--------------------------------------------------------------------------------

---[FILE: openai-agent.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/openai-agent.mdx

```text
---
sidebar_position: 3
sidebar_label: OpenAI Agents SDK
---

import { APILink } from "@site/src/components/APILink";

# Tracing OpenAI Agent🤖

![OpenAI Tracing via autolog](/images/llms/tracing/openai-agent-tracing.png)

[MLflow Tracing](/genai/tracing) provides automatic tracing capability for [OpenAI Agents SDK](https://platform.openai.com/docs/guides/agents-sdk), a multi-agent framework developed by OpenAI. By enabling auto tracing
for OpenAI by calling the <APILink fn="mlflow.openai.autolog" /> function, MLflow will capture traces and log them to the active MLflow Experiment.

<details>
<summary>Show setup code</summary>

```python
import mlflow

mlflow.openai.autolog()
```

</details>

## Basic Example

The following example demonstrates how to use the OpenAI Agents SDK with MLflow tracing for simple multi-language chat agents. The three agents collaborate to determine the language of the input and handoff to the appropriate sub-agent that speaks the language. MLflow captures how the agents interact with each other and make calls to the OpenAI API.

<details>
<summary>Show basic example code</summary>

```python
import mlflow
import asyncio
from agents import Agent, Runner

# Enable auto tracing for OpenAI Agents SDK
mlflow.openai.autolog()

# Optional: Set a tracking URI and an experiment
mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("OpenAI Agent")

# Define a simple multi-agent workflow
spanish_agent = Agent(
    name="Spanish agent",
    instructions="You only speak Spanish.",
)

english_agent = Agent(
    name="English agent",
    instructions="You only speak English",
)

triage_agent = Agent(
    name="Triage agent",
    instructions="Handoff to the appropriate agent based on the language of the request.",
    handoffs=[spanish_agent, english_agent],
)


async def main():
    result = await Runner.run(triage_agent, input="Hola, ¿cómo estás?")
    print(result.final_output)


# If you are running this code in a Jupyter notebook, replace this with `await main()`.
if __name__ == "__main__":
    asyncio.run(main())
```

</details>

## Function Calling

OpenAI Agents SDK support defining functions that can be called by the agent. MLflow captures the function calls and display what functions are available to the agent, which of them are called, and the inputs and outputs of the function calls.

<details>
<summary>Show function calling example code</summary>

```python
import asyncio

from agents import Agent, Runner, function_tool

# Enable auto tracing for OpenAI Agents SDK
mlflow.openai.autolog()


@function_tool
def get_weather(city: str) -> str:
    return f"The weather in {city} is sunny."


agent = Agent(
    name="Hello world",
    instructions="You are a helpful agent.",
    tools=[get_weather],
)


async def main():
    result = await Runner.run(agent, input="What's the weather in Tokyo?")
    print(result.final_output)
    # The weather in Tokyo is sunny.


# If you are running this code in a Jupyter notebook, replace this with `await main()`.
if __name__ == "__main__":
    asyncio.run(main())
```

</details>

![OpenAI Tracing via autolog](/images/llms/tracing/openai-agent-tracing-function-calling.png)

## Guardrails

OpenAI Agents SDK support defining guardrails that can be used to check the input and output of the agent. MLflow captures the guardrail checks and display the reasoning behind the guardrail check and whether the guardrail was tripped.

<details>
<summary>Show guardrails example code</summary>

```python
from pydantic import BaseModel
from agents import (
    Agent,
    GuardrailFunctionOutput,
    InputGuardrailTripwireTriggered,
    RunContextWrapper,
    Runner,
    TResponseInputItem,
    input_guardrail,
)

# Enable auto tracing for OpenAI Agents SDK
mlflow.openai.autolog()


class MathHomeworkOutput(BaseModel):
    is_math_homework: bool
    reasoning: str


guardrail_agent = Agent(
    name="Guardrail check",
    instructions="Check if the user is asking you to do their math homework.",
    output_type=MathHomeworkOutput,
)


@input_guardrail
async def math_guardrail(
    ctx: RunContextWrapper[None], agent: Agent, input
) -> GuardrailFunctionOutput:
    result = await Runner.run(guardrail_agent, input, context=ctx.context)

    return GuardrailFunctionOutput(
        output_info=result.final_output,
        tripwire_triggered=result.final_output.is_math_homework,
    )


agent = Agent(
    name="Customer support agent",
    instructions="You are a customer support agent. You help customers with their questions.",
    input_guardrails=[math_guardrail],
)


async def main():
    # This should trip the guardrail
    try:
        await Runner.run(agent, "Hello, can you help me solve for x: 2x + 3 = 11?")
        print("Guardrail didn't trip - this is unexpected")

    except InputGuardrailTripwireTriggered:
        print("Math homework guardrail tripped")


# If you are running this code in a Jupyter notebook, replace this with `await main()`.
if __name__ == "__main__":
    asyncio.run(main())
```

</details>

![OpenAI Tracing via autolog](/images/llms/tracing/openai-agent-tracing-guardrail.png)

## Disable auto-tracing

Auto tracing for OpenAI Agents SDK can be disabled globally by calling `mlflow.openai.autolog(disable=True)` or `mlflow.autolog(disable=True)`.
```

--------------------------------------------------------------------------------

---[FILE: openai.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/openai.mdx

```text
---
sidebar_position: 1
sidebar_label: OpenAI
---

import useBaseUrl from '@docusaurus/useBaseUrl';

import { APILink } from "@site/src/components/APILink";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import ImageBox from "@site/src/components/ImageBox";
import TabsWrapper from "@site/src/components/TabsWrapper";

# Tracing OpenAI

<video src={useBaseUrl("/images/llms/tracing/openai-tracing.mp4")} controls loop autoPlay muted aria-label="OpenAI Tracing via autolog" />

[MLflow Tracing](/genai/tracing) provides automatic tracing capability for OpenAI. By enabling auto tracing
for OpenAI by calling the <APILink fn="mlflow.openai.autolog" /> function, MLflow will capture traces for LLM invocation and log them to the active MLflow Experiment. In Typescript, you can instead use the `tracedOpenAI` function to wrap the OpenAI client.

<TabsWrapper>
<Tabs>
  <TabItem value="python" label="Python" default>
    ```python
    import mlflow

    mlflow.openai.autolog()
    ```

</TabItem>
<TabItem value="typescript" label="JS / TS">
    ```typescript
    import { OpenAI } from "openai";
    import { tracedOpenAI } from "mlflow-openai";

    const client = tracedOpenAI(new OpenAI());
    ```

</TabItem>
</Tabs>
</TabsWrapper>

MLflow trace automatically captures the following information about OpenAI calls:

- Prompts and completion responses
- Latencies
- Model name
- Additional metadata such as `temperature`, `max_completion_tokens`, if specified.
- Function calling if returned in the response
- Built-in tools such as web search, file search, computer use, etc.
- Any exception if raised

:::

## Supported APIs

MLflow supports automatic tracing for the following OpenAI APIs. To request support for additional APIs, please open a [feature request](https://github.com/mlflow/mlflow/issues) on GitHub.

#### Chat Completion API

| Normal | Function Calling | Structured Outputs |   Streaming   |    Async     | Image | Audio |
| :----: | :--------------: | :----------------: | :-----------: | :----------: | :---: | :---: |
|   ✅   |        ✅        |    ✅(>=2.21.0)    | ✅ (>=2.15.0) | ✅(>=2.21.0) |   -   |   -   |

#### Responses API

| Normal | Function Calling | Structured Outputs | Web Search | File Search | Computer Use | Reasoning | Streaming | Async | Image |
| :----: | :--------------: | :----------------: | :--------: | :---------: | :----------: | :-------: | :-------: | :---: | :---: |
|   ✅   |        ✅        |         ✅         |     ✅     |     ✅      |      ✅      |    ✅     |    ✅     |  ✅   |   -   |

Responses API is supported since MLflow 2.22.0.

#### Agents SDK

See [OpenAI Agents SDK Tracing](/genai/tracing/integrations/listing/openai-agent) for more details.

#### Embedding API

| Normal | Async |
| :----: | :---: |
|   ✅   |  ✅   |

## Basic Example

<Tabs>
  <TabItem value="chat" label="Chat Completion API" default>
    ```python
    import openai
    import mlflow

    # Enable auto-tracing for OpenAI
    mlflow.openai.autolog()

    # Optional: Set a tracking URI and an experiment
    mlflow.set_tracking_uri("http://localhost:5000")
    mlflow.set_experiment("OpenAI")

    openai_client = openai.OpenAI()

    messages = [
        {
            "role": "user",
            "content": "What is the capital of France?",
        }
    ]

    response = openai_client.chat.completions.create(
        model="o4-mini",
        messages=messages,
        max_completion_tokens=100,
    )
    ```

  </TabItem>
  <TabItem value="responses" label="Responses API">
    ```python
    import openai
    import mlflow

    # Enable auto-tracing for OpenAI
    mlflow.openai.autolog()

    # Optional: Set a tracking URI and an experiment
    mlflow.set_tracking_uri("http://localhost:5000")
    mlflow.set_experiment("OpenAI")

    openai_client = openai.OpenAI()

    response = client.responses.create(
        model="o4-mini", input="What is the capital of France?"
    )
    ```

  </TabItem>
  <TabItem value="typescript" label="JS / TS">
    ```typescript
    import { OpenAI } from "openai";
    import { tracedOpenAI } from "mlflow-openai";

    // Wrap the OpenAI client with the tracedOpenAI function
    const client = tracedOpenAI(new OpenAI());

    // Invoke the client as usual
    const response = await client.chat.completions.create({
        model: "o4-mini",
        messages: [
            {"role": "system", "content": "You are a helpful weather assistant."},
            {"role": "user", "content": "What's the weather like in Seattle?"},
        ],
    })
    ```

  </TabItem>
</Tabs>

## Streaming

MLflow Tracing supports streaming API of the OpenAI SDK. With the same set up of auto tracing, MLflow automatically traces the streaming response and render the concatenated output in the span UI. The actual chunks in the response stream can be found in the `Event` tab as well.

<Tabs>
  <TabItem value="chat" label="Chat Completion API" default>
    ```python
    import openai
    import mlflow

    # Enable trace logging
    mlflow.openai.autolog()

    client = openai.OpenAI()

    stream = client.chat.completions.create(
        model="o4-mini",
        messages=[
            {"role": "user", "content": "How fast would a glass of water freeze on Titan?"}
        ],
        stream=True,  # Enable streaming response
    )
    for chunk in stream:
        print(chunk.choices[0].delta.content or "", end="")
    ```

  </TabItem>
  <TabItem value="responses" label="Responses API">
    ```python
    import openai
    import mlflow

    # Enable trace logging
    mlflow.openai.autolog()

    client = openai.OpenAI()

    stream = client.responses.create(
        model="o4-mini",
        input="How fast would a glass of water freeze on Titan?",
        stream=True,  # Enable streaming response
    )
    for event in stream:
        print(event)
    ```

  </TabItem>
  <TabItem value="typescript" label="JS / TS">
    ```typescript
    import { OpenAI } from "openai";
    import { tracedOpenAI } from "mlflow-openai";

    // Wrap the OpenAI client with the tracedOpenAI function
    const client = tracedOpenAI(new OpenAI());

    const stream = await client.chat.completions.create({
        model: "o4-mini",
        messages: [
            {"role": "user", "content": "How fast would a glass of water freeze on Titan?"},
        ],
        stream: true,
    });
    ```

  </TabItem>
</Tabs>

## Async

MLflow Tracing supports asynchronous API of the OpenAI SDK since MLflow 2.21.0. The usage is same as the synchronous API.

<Tabs>
  <TabItem value="chat" label="Chat Completion API" default>

    ```python
    import openai

    # Enable trace logging
    mlflow.openai.autolog()

    client = openai.AsyncOpenAI()

    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": "How fast would a glass of water freeze on Titan?"}
        ],
        # Async streaming is also supported
        # stream=True
    )
    ```

  </TabItem>
  <TabItem value="responses" label="Responses API" default>

    ```python
    import openai

    # Enable trace logging
    mlflow.openai.autolog()

    client = openai.AsyncOpenAI()

    response = await client.responses.create(
        model="gpt-4o-mini", input="How fast would a glass of water freeze on Titan?"
    )
    ```

  </TabItem>
  <TabItem value="typescript" label="JS / TS">
    OpenAI Typescript / Javascript SDK is natively async. See the basic example above.
  </TabItem>
</Tabs>

## Function Calling

MLflow Tracing automatically captures function calling response from OpenAI models. The function instruction in the response will be highlighted in the trace UI. Moreover, you can annotate the tool function with the `@mlflow.trace` decorator to create a span for the tool execution.

<ImageBox src="/images/llms/tracing/openai-function-calling.png" alt="OpenAI Function Calling Trace" />

The following example implements a simple function calling agent using OpenAI Function Calling and MLflow Tracing for OpenAI.

<Tabs>
  <TabItem value="chat" label="Chat Completion API" default>
    ```python
    import json
    from openai import OpenAI
    import mlflow
    from mlflow.entities import SpanType

    client = OpenAI()


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
            model="gpt-4o-mini",
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
                model="gpt-4o-mini", messages=messages
            )

        return response.choices[0].message.content


    # Run the tool calling agent
    question = "What's the weather like in Paris today?"
    answer = run_tool_agent(question)
    ```

  </TabItem>
  <TabItem value="responses" label="Responses API" default>
    ```python
    import json
    import requests
    from openai import OpenAI
    import mlflow
    from mlflow.entities import SpanType

    client = OpenAI()


    # Define the tool function. Decorate it with `@mlflow.trace` to create a span for its execution.
    @mlflow.trace(span_type=SpanType.TOOL)
    def get_weather(latitude, longitude):
        response = requests.get(
            f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m"
        )
        data = response.json()
        return data["current"]["temperature_2m"]


    tools = [
        {
            "type": "function",
            "name": "get_weather",
            "description": "Get current temperature for provided coordinates in celsius.",
            "parameters": {
                "type": "object",
                "properties": {
                    "latitude": {"type": "number"},
                    "longitude": {"type": "number"},
                },
                "required": ["latitude", "longitude"],
                "additionalProperties": False,
            },
            "strict": True,
        }
    ]


    # Define a simple tool calling agent
    @mlflow.trace(span_type=SpanType.AGENT)
    def run_tool_agent(question: str):
        messages = [{"role": "user", "content": question}]

        # Invoke the model with the given question and available tools
        response = client.responses.create(
            model="gpt-4o-mini",
            input=question,
            tools=tools,
        )

        # Invoke the function with the specified arguments
        tool_call = response.output[0]
        args = json.loads(tool_call.arguments)
        result = get_weather(args["latitude"], args["longitude"])

        # Sent the tool results to the model and get a new response
        messages.append(tool_call)
        messages.append(
            {
                "type": "function_call_output",
                "call_id": tool_call.call_id,
                "output": str(result),
            }
        )

        response = client.responses.create(
            model="gpt-4o-mini",
            input=input_messages,
            tools=tools,
        )

        return response.output[0].content[0].text


    # Run the tool calling agent
    question = "What's the weather like in Paris today?"
    answer = run_tool_agent(question)
    ```

  </TabItem>
  <TabItem value="typescript" label="JS / TS">
    Refer to the [Typescript OpenAI Quickstart](/genai/tracing/quickstart) for the example of function calling agent in Typescript SDK.
  </TabItem>
</Tabs>

## Token usage

MLflow >= 3.1.0 supports token usage tracking for OpenAI. The token usage for each LLM call will be logged in the `mlflow.chat.tokenUsage` attribute. The total token usage throughout the trace will be
available in the `token_usage` field of the trace info object.

<Tabs>
  <TabItem value="python" label="Python" default>

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

  </TabItem>
  <TabItem value="typescript" label="JS / TS">

```typescript
import * as mlflow from "mlflow-tracing";

// After your OpenAI call completes, flush and fetch the trace
await mlflow.flushTraces();
const lastTraceId = mlflow.getLastActiveTraceId();

if (lastTraceId) {
  const client = new mlflow.MlflowClient({ trackingUri: "http://localhost:5000" });
  const trace = await client.getTrace(lastTraceId);

  // Total token usage on the trace
  console.log("== Total token usage: ==");
  console.log(trace.info.tokenUsage); // { input_tokens, output_tokens, total_tokens }

  // Per-span usage (if provided by the provider)
  console.log("\n== Detailed usage for each LLM call: ==");
  for (const span of trace.data.spans) {
    const usage = span.attributes?.["mlflow.chat.tokenUsage"];
    if (usage) {
      console.log(`${span.name}:`, usage);
    }
  }
}
```

  </TabItem>
</Tabs>

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

### Supported APIs:

Token usage tracking is supported for the following OpenAI APIs:

|   Mode    | Chat Completion | Responses | JS / TS |
| :-------: | :-------------: | :-------: | :-----: |
|  Normal   |       ✅        |    ✅     |   ✅    |
| Streaming |     ✅(\*1)     |    ✅     |   ✅    |
|   Async   |       ✅        |    ✅     |   ✅    |

(\*1) By default, OpenAI does not return token usage information for Chat Completion API when streaming. To track token usage, you need to specify `stream_options={"include_usage": True}` in the request ([OpenAI API Reference](https://platform.openai.com/docs/api-reference/chat/create)).

## Disable auto-tracing

Auto tracing for OpenAI can be disabled globally by calling `mlflow.openai.autolog(disable=True)` or `mlflow.autolog(disable=True)`.
```

--------------------------------------------------------------------------------

---[FILE: pydantic_ai.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/pydantic_ai.mdx

```text
---
sidebar_position: 7
sidebar_label: PydanticAI
---

import { APILink } from "@site/src/components/APILink";

# Tracing PydanticAI

![PydanticAI Tracing via autolog](/images/llms/pydantic-ai/pydanticai-tracing.png)

[​PydanticAI](https://ai.pydantic.dev/) is a Python framework designed to simplify the development of production-grade generative AI applications. It brings type safety, ergonomic API design, and a developer-friendly experience to GenAI app development.​

[MLflow Tracing](/genai/tracing) provides automatic tracing capability for [​PydanticAI](https://ai.pydantic.dev/), an open source framework for building multi-agent applications. By enabling auto tracing for ​PydanticAI by calling the <APILink fn="mlflow.pydantic_ai.autolog" /> function, , MLflow will capture nested traces for ​PydanticAI workflow execution and logged them to the active MLflow Experiment.

```python
import mlflow

mlflow.pydantic_ai.autolog()
```

MLflow trace automatically captures the following information about ​PydanticAI agents:

- Agent calls with prompts, kwargs & output responses
- LLM requests logging model name, prompt, parameters & response
- Tool runs capturing tool name, arguments & usage metrics
- MCP server calls & listings for tool-invocation tracing
- Span metadata: latency, errors & run-ID linkage

:::note

Currently, MLflow's PydanticAI integration supports tracing for both synchronous and asynchronous executions, but does not yet support streaming operations.

:::

### Example Usage

First, enable auto-tracing for PydanticAI, and optionally create an MLflow experiment to write traces to. This helps organizing your traces better.

```python
import mlflow

# Turn on auto tracing by calling mlflow.pydantic_ai.autolog()
mlflow.pydantic_ai.autolog()


# Optional: Set a tracking URI and an experiment
mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("PydanticAI")
```

Next, let's define a multi-agent workflow using PydanticAI. The example below sets up a weather agent where users can ask for the weather in multiple locations, and the agent will use the get_lat_lng tool to get the latitude and longitude of the locations, then use the get_weather tool to get the weather for those locations.

```python
import os
from dataclasses import dataclass
from typing import Any

from httpx import AsyncClient

from pydantic_ai import Agent, ModelRetry, RunContext


@dataclass
class Deps:
    client: AsyncClient
    weather_api_key: str | None
    geo_api_key: str | None


weather_agent = Agent(
    # Switch to your favorite LLM
    "google-gla:gemini-2.0-flash",
    # 'Be concise, reply with one sentence.' is enough for some models (like openai) to use
    # the below tools appropriately, but others like anthropic and gemini require a bit more direction.
    system_prompt=(
        "Be concise, reply with one sentence."
        "Use the `get_lat_lng` tool to get the latitude and longitude of the locations, "
        "then use the `get_weather` tool to get the weather."
    ),
    deps_type=Deps,
    retries=2,
    instrument=True,
)


@weather_agent.tool
async def get_lat_lng(
    ctx: RunContext[Deps], location_description: str
) -> dict[str, float]:
    """Get the latitude and longitude of a location.

    Args:
        ctx: The context.
        location_description: A description of a location.
    """
    if ctx.deps.geo_api_key is None:
        return {"lat": 51.1, "lng": -0.1}

    params = {
        "q": location_description,
        "api_key": ctx.deps.geo_api_key,
    }
    r = await ctx.deps.client.get("https://geocode.maps.co/search", params=params)
    r.raise_for_status()
    data = r.json()

    if data:
        return {"lat": data[0]["lat"], "lng": data[0]["lon"]}
    else:
        raise ModelRetry("Could not find the location")


@weather_agent.tool
async def get_weather(ctx: RunContext[Deps], lat: float, lng: float) -> dict[str, Any]:
    """Get the weather at a location.

    Args:
        ctx: The context.
        lat: Latitude of the location.
        lng: Longitude of the location.
    """

    if ctx.deps.weather_api_key is None:
        return {"temperature": "21 °C", "description": "Sunny"}

    params = {
        "apikey": ctx.deps.weather_api_key,
        "location": f"{lat},{lng}",
        "units": "metric",
    }
    r = await ctx.deps.client.get(
        "https://api.tomorrow.io/v4/weather/realtime", params=params
    )
    r.raise_for_status()
    data = r.json()

    values = data["data"]["values"]
    # https://docs.tomorrow.io/reference/data-layers-weather-codes
    code_lookup = {
        1000: "Clear, Sunny",
        1100: "Mostly Clear",
        1101: "Partly Cloudy",
        1102: "Mostly Cloudy",
        1001: "Cloudy",
        2000: "Fog",
        2100: "Light Fog",
        4000: "Drizzle",
        4001: "Rain",
        4200: "Light Rain",
        4201: "Heavy Rain",
        5000: "Snow",
        5001: "Flurries",
        5100: "Light Snow",
        5101: "Heavy Snow",
        6000: "Freezing Drizzle",
        6001: "Freezing Rain",
        6200: "Light Freezing Rain",
        6201: "Heavy Freezing Rain",
        7000: "Ice Pellets",
        7101: "Heavy Ice Pellets",
        7102: "Light Ice Pellets",
        8000: "Thunderstorm",
    }
    return {
        "temperature": f'{values["temperatureApparent"]:0.0f}°C',
        "description": code_lookup.get(values["weatherCode"], "Unknown"),
    }


async def main():
    async with AsyncClient() as client:
        weather_api_key = os.getenv("WEATHER_API_KEY")
        geo_api_key = os.getenv("GEO_API_KEY")
        deps = Deps(
            client=client, weather_api_key=weather_api_key, geo_api_key=geo_api_key
        )
        result = await weather_agent.run(
            "What is the weather like in London and in Wiltshire?", deps=deps
        )
        print("Response:", result.output)


# If you are running this on a notebook
await main()

# Uncomment this is you are using an IDE or Python script.
# asyncio.run(main())
```

## Advanced Example: Utilising MCP Server

MLflow Tracing automatically captures tool-related interactions from the MCP server in PydanticAI, including call_tool and list_tools operations. These actions are recorded as individual spans in the trace UI.

![PydanticAI MCP Server tracing via autolog](/images/llms/pydantic-ai/pydanticai-mcp-tracing.png)

The example below demonstrates how to run an MCP server using PydanticAI with MLflow tracing enabled. All tool invocation and listing operations are automatically captured as trace spans in the UI, along with relevant metadata.

```python
import mlflow
import asyncio

mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("MCP Server")
mlflow.pydantic_ai.autolog()

from pydantic_ai import Agent
from pydantic_ai.mcp import MCPServerStdio

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

agent = Agent("openai:gpt-4o", mcp_servers=[server], instrument=True)


async def main():
    async with agent.run_mcp_servers():
        result = await agent.run("How many days between 2000-01-01 and 2025-03-18?")
    print(result.output)
    # > There are 9,208 days between January 1, 2000, and March 18, 2025.


# If you are running this on a notebook
await main()

# Uncomment this is you are using an IDE or Python script.
# asyncio.run(main())
```

## Token usage

MLflow >= 3.1.0 supports token usage tracking for PydanticAI. The token usage for each LLM call will be logged in the `mlflow.chat.tokenUsage` attribute. The total token usage throughout the trace will be
available in the `token_usage` field of the trace info object.

```python
import json
import mlflow

mlflow.pydantic_ai.autolog()

# Run the example given in previous
await main()

# Uncomment this is you are using an IDE or Python script.
# asyncio.run(main())


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
  Input tokens: 432
  Output tokens: 53
  Total tokens: 485

== Detailed usage for each LLM call: ==
InstrumentedModel.request_1:
  Input tokens: 108
  Output tokens: 19
  Total tokens: 127
InstrumentedModel.request_2:
  Input tokens: 145
  Output tokens: 14
  Total tokens: 159
InstrumentedModel.request_3:
  Input tokens: 179
  Output tokens: 20
  Total tokens: 199
```

### Disable auto-tracing

Auto tracing for PydanticAI can be disabled globally by calling `mlflow.pydantic_ai.autolog(disable=True)` or `mlflow.autolog(disable=True)`.
```

--------------------------------------------------------------------------------

````
