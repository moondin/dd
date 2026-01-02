---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 134
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 134 of 991)

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

---[FILE: langchain.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/langchain.mdx

```text
---
sidebar_position: 2
sidebar_label: LangChain
toc_max_heading_level: 2
---

import useBaseUrl from '@docusaurus/useBaseUrl';

import { APILink } from "@site/src/components/APILink";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import TabsWrapper from "@site/src/components/TabsWrapper";

# Tracing LangChain🦜⛓️

<video src={useBaseUrl("/images/llms/tracing/tracing-top.mp4")} controls loop autoPlay muted aria-label="MLflow Tracing" />

[LangChain](https://www.langchain.com/) is an open-source framework for building LLM-powered applications.

[MLflow Tracing](/genai/tracing) provides automatic tracing capability for LangChain. You can enable tracing
for LangChain by calling the <APILink fn="mlflow.langchain.autolog" /> function, and nested traces are automatically logged to the active MLflow Experiment upon invocation of chains. In TypeScript, you can pass the MLflow LangChain callback to the `callbacks` option.

<TabsWrapper>
<Tabs>
  <TabItem value="python" label="Python" default>

```python
import mlflow

mlflow.langchain.autolog()
```

  </TabItem>
  <TabItem value="typescript" label="JS / TS">

LangChain.js tracing is supported via the OpenTelemetry ingestion. See the [Getting Started section](#getting-started) below for the full setup.

  </TabItem>
</Tabs>
</TabsWrapper>

## Getting Started

MLflow support tracing for LangChain in both Python and TypeScript/JavaScript. Please select the appropriate tab below to get started.

<TabsWrapper>
<Tabs>
  <TabItem value="python" label="Python" default>

### 1. Start MLflow

Start the MLflow server following the [Self-Hosting Guide](/self-hosting), if you don't have one already.

### 2. Install dependencies

```bash
pip install langchain langchain-openai mlflow
```

### 3. Enable tracing

```python
import mlflow

# Calling autolog for LangChain will enable trace logging.
mlflow.langchain.autolog()

# Optional: Set a tracking URI and an experiment
mlflow.set_experiment("LangChain")
mlflow.set_tracking_uri("http://localhost:5000")
```

### 4. Define the chain and invoke it

```python
import mlflow
import os

from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI


llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7, max_tokens=1000)

prompt_template = PromptTemplate.from_template(
    "Answer the question as if you are {person}, fully embodying their style, wit, personality, and habits of speech. "
    "Emulate their quirks and mannerisms to the best of your ability, embracing their traits—even if they aren't entirely "
    "constructive or inoffensive. The question is: {question}"
)

chain = prompt_template | llm | StrOutputParser()

# Let's test another call
chain.invoke(
    {
        "person": "Linus Torvalds",
        "question": "Can I just set everyone's access to sudo to make things easier?",
    }
)
```

### 5. View the trace in the MLflow UI

Visit `http://localhost:5000` (or your custom MLflow tracking server URL) to view the trace in the MLflow UI.

  </TabItem>
  <TabItem value="typescript-v1" label="JS / TS (v1)">

### 1. Start MLflow

Start the MLflow server following the [Self-Hosting Guide](/self-hosting), if you don't have one already.

### 2. Install the required dependencies:

```bash
npm i langchain @langchain/core @langchain/openai @arizeai/openinference-instrumentation-langchain
```

### 3. Enable OpenTelemetry

Enable OpenTelemetry instrumentation for LangChain in your application:

```typescript
import { NodeTracerProvider, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { LangChainInstrumentation } from "@arizeai/openinference-instrumentation-langchain";
import * as CallbackManagerModule from "@langchain/core/callbacks/manager";

// Set up the OpenTelemetry
const provider = new NodeTracerProvider(
  {
    spanProcessors: [new SimpleSpanProcessor(new OTLPTraceExporter({
      // Set MLflow tracking server URL with `/v1/traces` path. You can also use the OTEL_EXPORTER_OTLP_TRACES_ENDPOINT environment variable instead.
      url: "http://localhost:5000/v1/traces",
      // Set the experiment ID in the header. You can also use the OTEL_EXPORTER_OTLP_TRACES_HEADERS environment variable instead.
      headers: {
        "x-mlflow-experiment-id": "123",
      },
    }))],
  }
);
provider.register();

// Enable LangChain instrumentation
const lcInstrumentation = new LangChainInstrumentation();
lcInstrumentation.manuallyInstrument(CallbackManagerModule);
```

### 4. Define the LangChain agent and invoke it

Note that the `createAgent` API is available in LangChain.js v1.0 and later. If you are on LangChain 0.x, see the v0 example instead.

```typescript
import { createAgent, tool } from "langchain";
import * as z from "zod";

const getWeather = tool(
  (input) => `It's always sunny in ${input.city}!`,
  {
    name: "get_weather",
    description: "Get the weather for a given city",
    schema: z.object({
      city: z.string().describe("The city to get the weather for"),
    }),
  }
);

const agent = createAgent({
  model: "gpt-4o-mini",
  tools: [getWeather],
});

await agent.invoke({
    messages: [{ role: "user", content: "What's the weather in Tokyo?" }],
});
```

### 5. View the trace in the MLflow UI

Visit `http://localhost:5000` (or your custom MLflow tracking server URL) to view the trace in the MLflow UI.

  </TabItem>
  <TabItem value="typescript-v0" label="JS / TS (v0)">

### 1. Start MLflow

Start the MLflow server following the [Self-Hosting Guide](https://mlflow.org/docs/latest/self-hosting/index.html), if you don't have one already.

### 2. Install dependencies

Install the required dependencies:

```bash
npm i langchain @langchain/core @langchain/openai @arizeai/openinference-instrumentation-langchain
```

### 3. Enable OpenTelemetry

Enable OpenTelemetry instrumentation for LangChain in your application:

```typescript
import { NodeTracerProvider, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { LangChainInstrumentation } from "@arizeai/openinference-instrumentation-langchain";
import * as CallbackManagerModule from "@langchain/core/callbacks/manager";

// Set up the OpenTelemetry
const provider = new NodeTracerProvider(
  {
    spanProcessors: [new SimpleSpanProcessor(new OTLPTraceExporter({
      // Set MLflow tracking server URL. You can also use the OTEL_EXPORTER_OTLP_TRACES_ENDPOINT environment variable instead.
      url: "http://localhost:5000/v1/traces",
      // Set the experiment ID in the header. You can also use the OTEL_EXPORTER_OTLP_TRACES_HEADERS environment variable instead.
      headers: {
        "x-mlflow-experiment-id": "123",
      },
    }))],
  }
);
provider.register();

// Enable LangChain instrumentation
const lcInstrumentation = new LangChainInstrumentation();
lcInstrumentation.manuallyInstrument(CallbackManagerModule);
```

### 4. Define the LangChain chain and invoke it

```typescript
import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

const model = new OpenAI("gpt-4o-mini");
const prompt = PromptTemplate.fromTemplate("What is a good name for a company that makes {product}?");
const chain = prompt.pipe({ llm: model });

const res = await chain.invoke({ product: "colorful socks" });
console.log({ res });
```

### 5. View the trace in the MLflow UI

Visit `http://localhost:5000` (or your custom MLflow tracking server URL) to view the trace in the MLflow UI.

  </TabItem>
</Tabs>
</TabsWrapper>

:::note
This example above has been confirmed working with the following requirement versions:

```shell
pip install openai==1.30.5 langchain==0.2.1 langchain-openai==0.1.8 langchain-community==0.2.1 mlflow==2.14.0 tiktoken==0.7.0
```

:::

## Supported APIs

The following APIs are supported by auto tracing for LangChain.

- `invoke`
- `batch`
- `stream`
- `ainvoke`
- `abatch`
- `astream`
- `get_relevant_documents` (for retrievers)
- `__call__` (for Chains and AgentExecutors)

## Token Usage Tracking

MLflow >= 3.1.0 supports token usage tracking for LangChain. The token usage for each LLM call during a chain invocation will be logged in the `mlflow.chat.tokenUsage` span attribute, and the total usage in the entire trace will be logged in the `mlflow.trace.tokenUsage` metadata field.

```python
import json
import mlflow

mlflow.langchain.autolog()

# Execute the chain defined in the previous example
chain.invoke(
    {
        "person": "Linus Torvalds",
        "question": "Can I just set everyone's access to sudo to make things easier?",
    }
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
print("\n== Token usage for each LLM call: ==")
for span in trace.data.spans:
    if usage := span.get_attribute("mlflow.chat.tokenUsage"):
        print(f"{span.name}:")
        print(f"  Input tokens: {usage['input_tokens']}")
        print(f"  Output tokens: {usage['output_tokens']}")
        print(f"  Total tokens: {usage['total_tokens']}")
```

```bash
== Total token usage: ==
  Input tokens: 81
  Output tokens: 257
  Total tokens: 338

== Token usage for each LLM call: ==
ChatOpenAI:
  Input tokens: 81
  Output tokens: 257
  Total tokens: 338
```

## Customize Tracing Behavior

Sometimes you may want to customize what information is logged in the traces. You can achieve this by creating a custom callback handler that inherits from <APILink fn="mlflow.langchai.langchain_tracer.MlflowLangchainTracer">`MlflowLangchainTracer`</APILink>. MlflowLangchainTracer is a callback handler that is injected into the langchain model inference process to log traces automatically. It starts a new span upon a set of actions of the chain such as on_chain_start, on_llm_start, and concludes it when the action is finished. Various metadata such as span type, action name, input, output, latency, are automatically recorded to the span.

The following example demonstrates how to record an additional attribute to the span when a chat model starts running.

```python
from mlflow.langchain.langchain_tracer import MlflowLangchainTracer


class CustomLangchainTracer(MlflowLangchainTracer):
    # Override the handler functions to customize the behavior. The method signature is defined by LangChain Callbacks.
    def on_chat_model_start(
        self,
        serialized: Dict[str, Any],
        messages: List[List[BaseMessage]],
        *,
        run_id: UUID,
        tags: Optional[List[str]] = None,
        parent_run_id: Optional[UUID] = None,
        metadata: Optional[Dict[str, Any]] = None,
        name: Optional[str] = None,
        **kwargs: Any,
    ):
        """Run when a chat model starts running."""
        attributes = {
            **kwargs,
            **metadata,
            # Add additional attribute to the span
            "version": "1.0.0",
        }

        # Call the _start_span method at the end of the handler function to start a new span.
        self._start_span(
            span_name=name or self._assign_span_name(serialized, "chat model"),
            parent_run_id=parent_run_id,
            span_type=SpanType.CHAT_MODEL,
            run_id=run_id,
            inputs=messages,
            attributes=kwargs,
        )
```

## Disable auto-tracing

Auto tracing for LangChain can be disabled globally by calling `mlflow.langchain.autolog(disable=True)` or `mlflow.autolog(disable=True)`.
```

--------------------------------------------------------------------------------

---[FILE: langgraph.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/langgraph.mdx

```text
---
sidebar_position: 3
sidebar_label: LangGraph
toc_max_heading_level: 2
---

import useBaseUrl from '@docusaurus/useBaseUrl';

import { APILink } from "@site/src/components/APILink";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import TabsWrapper from "@site/src/components/TabsWrapper";

# Tracing LangGraph🦜🕸️

<video src={useBaseUrl("/images/llms/tracing/langgraph-tracing.mp4")} controls loop autoPlay muted aria-label="LangGraph Tracing via autolog" />

[LangGraph](https://www.langchain.com/langgraph) is an open-source library for building stateful, multi-actor applications with LLMs, used to create agent and multi-agent workflows.

[MLflow Tracing](/genai/tracing) provides automatic tracing capability for LangGraph, as a extension of its LangChain integration. By enabling auto-tracing for LangChain by calling the <APILink fn="mlflow.langchain.autolog" /> function, MLflow will
automatically capture the graph execution into a trace and log it to the active MLflow Experiment.
In TypeScript, you can pass the MLflow LangChain callback to the `callbacks` option.

<TabsWrapper>
<Tabs>
  <TabItem value="python" label="Python" default>

```python
import mlflow

mlflow.langchain.autolog()
```

  </TabItem>
  <TabItem value="typescript" label="JS / TS">

LangGraph.js tracing is supported via the OpenTelemetry ingestion. See the [Getting Started section](#getting-started) below for the full setup.

  </TabItem>
</Tabs>
</TabsWrapper>

## Getting Started

MLflow support tracing for LangGraph in both Python and TypeScript/JavaScript. Please select the appropriate tab below to get started.

<TabsWrapper>
<Tabs>
  <TabItem value="python" label="Python" default>

### 1. Start MLflow

Start the MLflow server following the [Self-Hosting Guide](/self-hosting), if you don't have one already.

### 2. Install dependencies

```bash
pip install langgraph langchain-openai mlflow
```

### 3. Enable tracing

```python
import mlflow

# Calling autolog for LangChain will enable trace logging.
mlflow.langchain.autolog()

# Optional: Set a tracking URI and an experiment
mlflow.set_experiment("LangChain")
mlflow.set_tracking_uri("http://localhost:5000")
```

### 4. Define the LangGraph agent and invoke it

```python
from typing import Literal

import mlflow

from langchain_core.messages import AIMessage, ToolCall
from langchain_core.outputs import ChatGeneration, ChatResult
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent

# Enabling tracing for LangGraph (LangChain)
mlflow.langchain.autolog()

# Optional: Set a tracking URI and an experiment
mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("LangGraph")


@tool
def get_weather(city: Literal["nyc", "sf"]):
    """Use this to get weather information."""
    if city == "nyc":
        return "It might be cloudy in nyc"
    elif city == "sf":
        return "It's always sunny in sf"


llm = ChatOpenAI(model="gpt-4o-mini")
tools = [get_weather]
graph = create_react_agent(llm, tools)

# Invoke the graph
result = graph.invoke(
    {"messages": [{"role": "user", "content": "what is the weather in sf?"}]}
)
```

### 5. View the trace in the MLflow UI

Visit `http://localhost:5000` (or your custom MLflow tracking server URL) to view the trace in the MLflow UI.

  </TabItem>
  <TabItem value="typescript" label="JS / TS">

### 1. Start MLflow

Start the MLflow server following the [Self-Hosting Guide](/self-hosting), if you don't have one already.

### 2. Install the required dependencies:

```bash
npm i @langchain/langgraph @langchain/core @langchain/openai @arizeai/openinference-instrumentation-langchain
```

### 3. Enable OpenTelemetry

Enable OpenTelemetry instrumentation for LangChain in your application:

```typescript
import { NodeTracerProvider, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { LangChainInstrumentation } from "@arizeai/openinference-instrumentation-langchain";
import * as CallbackManagerModule from "@langchain/core/callbacks/manager";

// Set up the OpenTelemetry
const provider = new NodeTracerProvider(
  {
    spanProcessors: [new SimpleSpanProcessor(new OTLPTraceExporter({
      // Set MLflow tracking server URL with `/v1/traces` path. You can also use the OTEL_EXPORTER_OTLP_TRACES_ENDPOINT environment variable instead.
      url: "http://localhost:5000/v1/traces",
      // Set the experiment ID in the header. You can also use the OTEL_EXPORTER_OTLP_TRACES_HEADERS environment variable instead.
      headers: {
        "x-mlflow-experiment-id": "123",
      },
    }))],
  }
);
provider.register();

// Enable LangChain instrumentation
const lcInstrumentation = new LangChainInstrumentation();
lcInstrumentation.manuallyInstrument(CallbackManagerModule);
```

### 4. Define the LangGraph agent and invoke it

Define the LangGraph agent following the [LangGraph example](https://docs.langchain.com/oss/javascript/langgraph/quickstart#full-code-example) and invoke it.

### 5. View the trace in the MLflow UI

Visit `http://localhost:5000` (or your custom MLflow tracking server URL) to view the trace in the MLflow UI.

  </TabItem>
</Tabs>
</TabsWrapper>

## Token Usage Tracking

MLflow >= 3.1.0 supports token usage tracking for LangGraph. The token usage for each LLM call during a graph invocation will be logged in the `mlflow.chat.tokenUsage` span attribute, and the total usage in the entire trace will be logged in the `mlflow.trace.tokenUsage` metadata field.

```python
import json
import mlflow

mlflow.langchain.autolog()

# Execute the agent graph defined in the previous example
graph.invoke({"messages": [{"role": "user", "content": "what is the weather in sf?"}]})

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
print("\n== Token usage for each LLM call: ==")
for span in trace.data.spans:
    if usage := span.get_attribute("mlflow.chat.tokenUsage"):
        print(f"{span.name}:")
        print(f"  Input tokens: {usage['input_tokens']}")
        print(f"  Output tokens: {usage['output_tokens']}")
        print(f"  Total tokens: {usage['total_tokens']}")
```

```bash
== Total token usage: ==
  Input tokens: 149
  Output tokens: 135
  Total tokens: 284

== Token usage for each LLM call: ==
ChatOpenAI_1:
  Input tokens: 58
  Output tokens: 87
  Total tokens: 145
ChatOpenAI_2:
  Input tokens: 91
  Output tokens: 48
  Total tokens: 139
```

## Adding spans within a node or a tool

By combining auto-tracing with the [manual tracing APIs](/genai/tracing/app-instrumentation/manual-tracing), you can add child spans inside a node or tool, to get more detailed insights for the step.

Let's take LangGraph's [Code Assistant](https://langchain-ai.github.io/langgraph/tutorials/code_assistant/langgraph_code_assistant/#graph) tutorial for example. The `check_code` node actually consists of two different validations for the generated code. You may want to add span for each validation to see which validation were executed. To do so, simply create manual spans inside the node function.

```python
def code_check(state: GraphState):
    # State
    messages = state["messages"]
    code_solution = state["generation"]
    iterations = state["iterations"]

    # Get solution components
    imports = code_solution.imports
    code = code_solution.code

    # Check imports
    try:
        # Create a child span manually with mlflow.start_span() API
        with mlflow.start_span(name="import_check", span_type=SpanType.TOOL) as span:
            span.set_inputs(imports)
            exec(imports)
            span.set_outputs("ok")
    except Exception as e:
        error_message = [("user", f"Your solution failed the import test: {e}")]
        messages += error_message
        return {
            "generation": code_solution,
            "messages": messages,
            "iterations": iterations,
            "error": "yes",
        }

    # Check execution
    try:
        code = imports + "\n" + code
        with mlflow.start_span(name="execution_check", span_type=SpanType.TOOL) as span:
            span.set_inputs(code)
            exec(code)
            span.set_outputs("ok")
    except Exception as e:
        error_message = [("user", f"Your solution failed the code execution test: {e}")]
        messages += error_message
        return {
            "generation": code_solution,
            "messages": messages,
            "iterations": iterations,
            "error": "yes",
        }

    # No errors
    return {
        "generation": code_solution,
        "messages": messages,
        "iterations": iterations,
        "error": "no",
    }
```

This way, the span for the `check_code` node will have child spans, which record whether the each validation fails or not, with their exception details.

![LangGraph Child Span](/images/llms/tracing/langgraph-child-span.png)

:::info Async Context Propagation
When using async methods like `ainvoke()` with manual `@mlflow.trace` decorators inside LangGraph nodes or tools, enable inline tracer execution to ensure proper context propagation:

```python
mlflow.langchain.autolog(run_tracer_inline=True)
```

This ensures that manually traced spans are properly nested within the autolog trace hierarchy. Without this setting, manual spans may appear as separate traces in async scenarios.

:::warning
When `run_tracer_inline=True` is enabled, avoid calling multiple graph invocations sequentially within the same async function, as this may cause traces to merge unexpectedly. If you need to make multiple sequential invocations, either:

- Wrap each invocation in a separate async task
- Use the default `run_tracer_inline=False` if you don't need manual tracing integration
  :::

## Thread ID Tracking

Since MLflow 3.6, MLflow will automatically record the thread (session) ID for the trace and let you view a group of traces as a session in the UI. To enable this feature, you need to pass the `thread_id` in the config when invoking the graph.

```python
graph.invoke(inputs, {"configurable": {"thread_id": "1"}})
```

The thread ID will be recorded in the trace metadata and displayed in the MLflow Trace UI.

![LangGraph Thread ID](/images/llms/tracing/langgraph-thread-id.png)

By navigating to the Session tab on the side bar, you can view all the traces in the session.

![LangGraph Session Page](/images/llms/tracing/langgraph-session-page.png)

## Disable auto-tracing

Auto tracing for LangGraph can be disabled globally by calling `mlflow.langchain.autolog(disable=True)` or `mlflow.autolog(disable=True)`.
```

--------------------------------------------------------------------------------

---[FILE: litellm.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/litellm.mdx

```text
---
sidebar_position: 8
sidebar_label: LiteLLM
---

import { APILink } from "@site/src/components/APILink";

# Tracing LiteLLM🚄

![LiteLLM Tracing via autolog](/images/llms/litellm/litellm-tracing.png)

[LiteLLM](https://www.litellm.ai/) is an open-source LLM Gateway that allow accessing 100+ LLMs in the unified interface.

[MLflow Tracing](../../) provides automatic tracing capability for LiteLLM. By enabling auto tracing
for LiteLLM by calling the <APILink fn="mlflow.litellm.autolog" /> function, MLflow will capture traces for LLM invocation and log them to the active MLflow Experiment.

```python
import mlflow

mlflow.litellm.autolog()
```

MLflow trace automatically captures the following information about LiteLLM calls:

- Prompts and completion responses
- Latencies
- Metadata about the LLM provider, such as model name and endpoint URL
- Token usages and cost
- Cache hit
- Any exception if raised

### Basic Example

```python
import mlflow
import litellm

# Enable auto-tracing for LiteLLM
mlflow.litellm.autolog()

# Optional: Set a tracking URI and an experiment
mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("LiteLLM")

# Call Anthropic API via LiteLLM
response = litellm.completion(
    model="claude-3-5-sonnet-20240620",
    messages=[{"role": "user", "content": "Hey! how's it going?"}],
)
```

### Async API

MLflow supports tracing LiteLLM's async APIs:

```python
mlflow.litellm.autolog()

response = await litellm.acompletion(
    model="claude-3-5-sonnet-20240620",
    messages=[{"role": "user", "content": "Hey! how's it going?"}],
)
```

### Streaming

MLflow supports tracing LiteLLM's sync and async streaming APIs:

```python
mlflow.litellm.autolog()

response = litellm.completion(
    model="claude-3-5-sonnet-20240620",
    messages=[{"role": "user", "content": "Hey! how's it going?"}],
    stream=True,
)
for chunk in response:
    print(chunk.choices[0].delta.content, end="|")
```

MLflow will record concatenated outputs from the stream chunks as a span output.

### Disable auto-tracing

Auto tracing for LiteLLM can be disabled globally by calling `mlflow.litellm.autolog(disable=True)` or `mlflow.autolog(disable=True)`.
```

--------------------------------------------------------------------------------

---[FILE: llama_index.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/llama_index.mdx

```text
---
sidebar_position: 4
sidebar_label: LlamaIndex
---

import useBaseUrl from '@docusaurus/useBaseUrl';

import { APILink } from "@site/src/components/APILink";

# Tracing LlamaIndex🦙

<video src={useBaseUrl("/images/llms/tracing/llamaindex-tracing.mp4")} controls loop autoPlay muted aria-label="LlamaIndex Tracing via autolog" />

[LlamaIndex](https://www.llamaindex.ai/) is an open-source framework for building agentic generative AI applications that allow large language models to work with your data in any format.

[MLflow Tracing](/genai/tracing) provides automatic tracing capability for LlamaIndex. You can enable tracing
for LlamaIndex by calling the <APILink fn="mlflow.llama_index.autolog" /> function, and nested traces are automatically logged to the active MLflow Experiment upon invocation of LlamaIndex engines and workflows.

```python
import mlflow

mlflow.llama_index.autolog()
```

:::tip

MLflow LlamaIndex integration is not only about tracing. MLflow offers full tracking experience for LlamaIndex, including model tracking, index management, and evaluation. Please checkout the **[MLflow LlamaIndex Flavor](/genai/flavors/llama-index)** to learn more!

:::

### Example Usage

First, let's download a test data to create a toy index:

```
!mkdir -p data
!curl -L https://raw.githubusercontent.com/run-llama/llama_index/main/docs/docs/examples/data/paul_graham/paul_graham_essay.txt -o ./data/paul_graham_essay.txt
```

Load them into a simple in-memory vector index:

```
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

documents = SimpleDirectoryReader("data").load_data()
index = VectorStoreIndex.from_documents(documents)
```

Now you can enable LlamaIndex auto tracing and start querying the index:

```python
import mlflow

# Enabling tracing for LlamaIndex
mlflow.llama_index.autolog()

# Optional: Set a tracking URI and an experiment
mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("LlamaIndex")

# Query the index
query_engine = index.as_query_engine()
response = query_engine.query("What was the first program the author wrote?")
```

## Token usage

MLflow >= 3.2.0 supports token usage tracking for LlamaIndex. The token usage for each LLM call will be logged in the `mlflow.chat.tokenUsage` attribute. The total token usage throughout the trace will be
available in the `token_usage` field of the trace info object.

```python
import json
import mlflow
from llama_index.llms.openai import OpenAI

mlflow.llama_index.autolog()

# Use the chat complete method to create new chat.
llm = OpenAI(model="gpt-3.5-turbo")
Settings.llm = llm
response = llm.chat(
    [ChatMessage(role="user", content="What is the capital of France?")]
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
  Input tokens: 14
  Output tokens: 7
  Total tokens: 21

== Detailed usage for each LLM call: ==
OpenAI.chat:
  Input tokens: 14
  Output tokens: 7
  Total tokens: 21
```

### LlamaIndex workflow

The `Workflow` is LlamaIndex's next-generation GenAI orchestration framework. It is designed as a flexible and interpretable framework for building arbitrary LLM applications such as an agent, a RAG flow, a data extraction pipeline, etc. MLflow supports tracking, evaluating, and tracing the Workflow objects, which makes them more observable and maintainable.

Automatic tracing for LlamaIndex workflow works off-the-shelf by calling the same `mlflow.llama_index.autolog()`.

To learn more about MLflow's integration with LlamaIndex Workflow, continue to the following tutorials:

- [Building Advanced RAG with MLflow and LlamaIndex Workflow](https://mlflow.org/blog/mlflow-llama-index-workflow)

### Disable auto-tracing

Auto tracing for LlamaIndex can be disabled globally by calling `mlflow.llama_index.autolog(disable=True)` or `mlflow.autolog(disable=True)`.
```

--------------------------------------------------------------------------------

---[FILE: mastra.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/mastra.mdx

```text
---
sidebar_position: 6
sidebar_label: Mastra
---

import ImageBox from "@site/src/components/ImageBox";

# Tracing Mastra

<ImageBox src="/images/llms/tracing/mastra-tracing.png" alt="Mastra Tracing" />

[MLflow Tracing](/genai/tracing) provides automatic tracing capability for [Mastra](https://github.com/mastra-ai/mastra), a flexible and modular AI agents framework developed by Mastra. MLflow supports tracing for Mastra through the [OpenTelemetry](/genai/tracing/opentelemetry) integration.

## Step 1: Create a new Mastra agent

```bash
npm create mastra@latest
npm install @mastra/otel-exporter
```

This will create a new TypeScript project with a simple tool calling agent implementation.

## Step 2: Start the MLflow Tracking Server

Start the MLflow Tracking Server with a SQL-based backend store:

```bash
mlflow server --backend-store-uri sqlite:///mlflow.db --port 5000
```

This example uses SQLite as the backend store. To use other types of SQL databases such as PostgreSQL, MySQL, and MSSQL, change the store URI as described in the [backend store documentation](/self-hosting/architecture/backend-store). OpenTelemetry ingestion is not supported with file-based backend stores.

## Step 3: Configure OpenTelemetry

Configure the OpenTelemetry tracer in your Mastra agent to export traces to the MLflow Tracking Server endpoint.

Open the `src/mastra/index.ts` file and add the `observability` configuration to the `Mastra` agent instantiation.

```typescript
import { OtelExporter } from "@mastra/otel-exporter";

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  ...

  // Add the following observability configuration to enable OpenTelemetry tracing.
  observability: {
    configs: {
      otel: {
        serviceName: "maestra-app",
        exporters: [new OtelExporter({
          provider: {
            custom: {
              // Specify tracking server URI with the `/v1/traces` path.
              endpoint: "http://localhost:5000/v1/traces",
              // Set the MLflow experiment ID in the header.
              headers: { "x-mlflow-experiment-id": "<your-experiment-id>"},
              // MLflow support HTTP/Protobuf protocol.
              protocol: "http/protobuf"
            }
          }
        })]
      }
    }
  },
});
```

## Step 4: Run the Agent

Start the Mastra agent with the `npm run dev` command. The playground URL will be displayed in the console.

<ImageBox src="/images/llms/tracing/mastra-playground.png" alt="Mastra Playground" />

After chatting with the agent, open the MLflow UI at `http://localhost:5000` and navigate to the experiment to see the traces like the screenshot at the top of this page.

## Next Steps

- [Evaluate the Agent](/genai/eval-monitor/running-evaluation/agents): Learn how to evaluate the agent's performance.
- [Manage Prompts](/genai/prompt-registry): Learn how to manage prompts for the agent.
- [Automatic Agent Optimization](/genai/prompt-registry/optimize-prompts): Learn how to automatically optimize the agent end-to-end with state-of-the-art optimization algorithms.
```

--------------------------------------------------------------------------------

---[FILE: microsoft-agent-framework.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/microsoft-agent-framework.mdx

```text
---
sidebar_position: 5
sidebar_label: Microsoft Agent Framework
---

import ImageBox from "@site/src/components/ImageBox";

# Tracing Microsoft Agent Framework

<ImageBox src="/images/llms/tracing/microsoft-agent-framework-tracing.png" alt="Microsoft Agent Framework Tracing" />

[MLflow Tracing](/genai/tracing) provides automatic tracing capability for [Microsoft Agent Framework](https://github.com/microsoft/agent-framework?tab=readme-ov-file), a flexible and modular AI agents framework developed by Microsoft. MLflow supports tracing for Microsoft Agent Framework through the [OpenTelemetry](/genai/tracing/opentelemetry) integration.

## Step 1: Install libraries

```bash
pip install mlflow>=3.6.0 agent-framework opentelemetry-exporter-otlp-proto-http
```

## Step 2: Start the MLflow Tracking Server

Start the MLflow Tracking Server with a SQL-based backend store:

```bash
mlflow server --backend-store-uri sqlite:///mlflow.db --port 5000
```

This example uses SQLite as the backend store. To use other types of SQL databases such as PostgreSQL, MySQL, and MSSQL, change the store URI as described in the [backend store documentation](/self-hosting/architecture/backend-store). OpenTelemetry ingestion is not supported with file-based backend stores.

## Step 3: Configure OpenTelemetry

Configure the OpenTelemetry tracer to export traces to the MLflow Tracking Server endpoint.

- Set the endpoint to the MLflow Tracking Server's `/v1/traces` endpoint (OTLP).
- Set the `x-mlflow-experiment-id` header to the MLflow experiment ID. If you don't have an experiment ID, create it from Python SDK or the MLflow UI.

```python
from agent_framework.observability import setup_observability
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter

# Create the OTLP span exporter with endpoint and headers
MLFLOW_TRACKING_URI = "http://localhost:5000"
MLFLOW_EXPERIMENT_ID = "1234567890"
OTEL_EXPORTER_OTLP_ENDPOINT = f"{MLFLOW_TRACKING_URI}/v1/traces"
OTEL_EXPORTER_OTLP_HEADERS = {"x-mlflow-experiment-id": MLFLOW_EXPERIMENT_ID}

exporter = OTLPSpanExporter(
    endpoint=OTEL_EXPORTER_OTLP_ENDPOINT, headers=OTEL_EXPORTER_OTLP_HEADERS
)
# enable_sensitive_data=True is required for recording LLM inputs and outputs.
setup_observability(enable_sensitive_data=True, exporters=[exporter])
```

## Step 4: Run the Agent

Define and invoke the agent in a Python script like `agent.py` as usual. Microsoft Agent Framework will generate traces for your agent and send them to the MLflow Tracking Server endpoint.

```python
import asyncio
from pydantic import Field
from random import randint
from typing import Annotated

from agent_framework.openai import OpenAIAssistantsClient


def get_weather(
    location: Annotated[str, Field(description="The location to get the weather for.")],
) -> str:
    """Get the weather for a given location."""
    conditions = ["sunny", "cloudy", "rainy", "stormy"]
    return f"The weather in {location} is {conditions[randint(0, 3)]} with a high of {randint(10, 30)}°C."


async def main():
    async with OpenAIAssistantsClient(model_id="gpt-4o-mini").create_agent(
        instructions="You are a helpful weather agent.",
        tools=get_weather,
    ) as agent:
        query = "What's the weather like in Seattle?"
        print(f"User: {query}")
        result = await agent.run(query)
        print(f"Agent: {result}\n")


# Comment this out if you are using notebook.
if __name__ == "__main__":
    asyncio.run(main())
```

Run the script to invoke the agent.

```bash
python agent.py
```

Open the MLflow UI at `http://localhost:5000` and navigate to the experiment to see the traces.

## Next Steps

- [Evaluate the Agent](/genai/eval-monitor/running-evaluation/agents): Learn how to evaluate the agent's performance.
- [Manage Prompts](/genai/prompt-registry): Learn how to manage prompts for the agent.
- [Automatic Agent Optimization](/genai/prompt-registry/optimize-prompts): Learn how to automatically optimize the agent end-to-end with state-of-the-art optimization algorithms.
```

--------------------------------------------------------------------------------

````
