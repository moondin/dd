---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 136
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 136 of 991)

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

---[FILE: semantic_kernel.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/semantic_kernel.mdx

```text
---
sidebar_position: 6
sidebar_label: Semantic Kernel
---

import { APILink } from "@site/src/components/APILink";
import ImageBox from "@site/src/components/ImageBox";

# Tracing Semantic Kernel

<ImageBox src="/images/llms/tracing/semantic-kernel-tracing.png" alt="Semantic Kernel Tracing via autolog" />

[Semantic Kernel](https://learn.microsoft.com/en-us/semantic-kernel/overview/) is a lightweight, open-source SDK that functions as AI middleware, enabling you to integrate AI models into your C#, Python, or Java codebase via a uniform API layer. By abstracting model interactions, it lets you swap in new models without rewriting your application logic.

[MLflow Tracing](/genai/tracing) provides automatic tracing capability for Semantic Kernel. By enabling auto tracing for Semantic Kernel via the <APILink fn="mlflow.semantic_kernel.autolog" /> function, MLflow will capture traces for LLM invocations and log them to the active MLflow Experiment.

MLflow trace automatically captures the following information about Semantic Kernel calls:

- Prompts and completion responses
- Chat history and messages
- Latencies
- Model name and provider
- Kernel functions and plugins
- Template variables and arguments
- Token usage information
- Any exceptions if raised

Currently, tracing for streaming is not supported. If you want this feature, please file a [feature request](https://github.com/mlflow/mlflow/issues).

## Getting Started

To get started, let's install the requisite libraries. Note that we will use OpenAI for demonstration purposes, but this tutorial extends to all providers supported by Semantic Kernel.

```bash
pip install 'mlflow>=3.2.0' semantic_kernel openai
```

Then, enable autologging in your Python code:

:::important
You must run `mlflow.semantic_kernel.autolog()` prior to running Semantic Kernel code. If this is not performed, traces may not be logged properly.
:::

```python
import mlflow

mlflow.semantic_kernel.autolog()
```

Finally, for setup, let's establish our OpenAI token:

```python
import os
from getpass import getpass

# Set the OpenAI API key as an environment variable
os.environ["OPENAI_API_KEY"] = getpass("openai_api_key: ")
```

## Example Usage

:::note
Semantic Kernel primarily uses asynchronous programming patterns. The examples below use `async`/`await` syntax. If you're running these in a Jupyter notebook, the code will work as-is. For scripts, you'll need to wrap the async calls appropriately (e.g., using `asyncio.run()`).
:::

The simplest example to show the tracing integration is to instrument a [ChatCompletion Kernel](https://learn.microsoft.com/en-us/semantic-kernel/concepts/ai-services/chat-completion/?tabs=csharp-AzureOpenAI%2Cpython-AzureOpenAI%2Cjava-AzureOpenAI&pivots=programming-language-python).

```python
import openai
from semantic_kernel import Kernel
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion
from semantic_kernel.functions.function_result import FunctionResult

# Create a basic OpenAI client
openai_client = openai.AsyncOpenAI()

# Create a Semantic Kernel instance and register the OpenAI chat completion service
kernel = Kernel()
kernel.add_service(
    OpenAIChatCompletion(
        service_id="chat-gpt",
        ai_model_id="gpt-4o-mini",
        async_client=openai_client,
    )
)

answer = await kernel.invoke_prompt("Is sushi the best food ever?")
print("AI says:", answer)
```

## Token Usage Tracking

MLflow >= 3.2.0 supports token usage tracking for Semantic Kernel. The token usage for each LLM call during a kernel invocation will be logged in the `mlflow.chat.tokenUsage` span attribute, and the total usage in the entire trace will be logged in the `mlflow.trace.tokenUsage` metadata field.

```python
# Generate a trace using the above example
# ...


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

```
== Total token usage: ==
  Input tokens: 14
  Output tokens: 113
  Total tokens: 127
```

## Disable Auto-tracing

Auto tracing for Semantic Kernel can be disabled globally by calling `mlflow.semantic_kernel.autolog(disable=True)` or `mlflow.autolog(disable=True)`.
```

--------------------------------------------------------------------------------

---[FILE: smolagents.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/smolagents.mdx

```text
---
sidebar_position: 11
sidebar_label: Smolagents
---

import { APILink } from "@site/src/components/APILink";

# Tracing Smolagents

![Smolagents tracing via autolog](/images/llms/smolagents/smolagents-tracing.png)

MLflow Tracing provides automatic tracing capability when using Smolagents.
When Smolagents auto-tracing is enabled by calling the <APILink fn="mlflow.smolagents.autolog" /> function,
usage of the Smolagents SDK will automatically record generated traces during interactive development.

Note that only synchronous calls are supported, and that asynchronous API and streaming methods are not traced.

### Example Usage

```python
from smolagents import CodeAgent, LiteLLMModel
import mlflow

# Turn on auto tracing for Smolagents by calling mlflow.smolagents.autolog()
mlflow.smolagents.autolog()

model = LiteLLMModel(model_id="openai/gpt-4o-mini", api_key=API_KEY)
agent = CodeAgent(tools=[], model=model, add_base_tools=True)

result = agent.run(
    "Could you give me the 118th number in the Fibonacci sequence?",
)
```

## Token usage

MLflow >= 3.2.0 supports token usage tracking for Smolagents. The token usage for each LLM call will be logged in the `mlflow.chat.tokenUsage` attribute. The total token usage throughout the trace will be
available in the `token_usage` field of the trace info object.

```python
import json
import mlflow

mlflow.smolagents.autolog()

model = LiteLLMModel(model_id="openai/gpt-4o-mini", api_key=API_KEY)
agent = CodeAgent(tools=[], model=model, add_base_tools=True)

result = agent.run(
    "Could you give me the 118th number in the Fibonacci sequence?",
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
  Input tokens: 4360
  Output tokens: 185
  Total tokens: 4545

== Detailed usage for each LLM call: ==
LiteLLMModel.__call___1:
  Input tokens: 2047
  Output tokens: 124
  Total tokens: 2171
LiteLLMModel.__call___2:
  Input tokens: 2313
  Output tokens: 61
  Total tokens: 2374
```

## Disable auto-tracing

Auto tracing for Smolagents can be disabled globally by calling `mlflow.smolagents.autolog(disable=True)` or `mlflow.autolog(disable=True)`.
```

--------------------------------------------------------------------------------

---[FILE: strands.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/strands.mdx

```text
---
sidebar_position: 8
sidebar_label: Strands Agents SDK
---

import { APILink } from "@site/src/components/APILink";
import ImageBox from "@site/src/components/ImageBox";

# Tracing Strands Agents SDK

<ImageBox src="/images/llms/strands/strands-tracing.png" alt="Agno Tracing via autolog" />

[Strands Agents SDK](https://github.com/strands-agents/sdk-python) is an open‑source, model‑driven SDK developed by AWS that enables developers to create autonomous AI agents
simply by defining a model, a set of tools, and a prompt in just a few lines of code.

[MLflow Tracing](../../) provides automatic tracing capability for Strands Agents SDK. By enabling auto tracing
for Strands Agents SDK by calling the <APILink fn="mlflow.strands.autolog" /> function, MLflow will capture traces for Agent invocation and log them to the active MLflow Experiment.

```python
import mlflow

mlflow.strands.autolog()
```

MLflow trace automatically captures the following information about Agentic calls:

- Prompts and completion responses
- Latencies
- Metadata about the different Agents, such as function names
- Token usages and cost
- Cache hit
- Any exception if raised

### Basic Example

```python
import mlflow

mlflow.strands.autolog()
mlflow.set_experiment("Strand Agent")

from strands import Agent
from strands.models.openai import OpenAIModel
from strands_tools import calculator

model = OpenAIModel(
    client_args={"api_key": "<api-key>"},
    # **model_config
    model_id="gpt-4o",
    params={
        "max_tokens": 2000,
        "temperature": 0.7,
    },
)

agent = Agent(model=model, tools=[calculator])
response = agent("What is 2+2")
print(response)
```

![Strands Agent SDK Tracing via autolog](/images/llms/strands/strands-tracing.png)

## Token usage

MLflow >= 3.4.0 supports token usage tracking for Strand Agent SDK. The token usage for each Agent call will be logged in the `mlflow.chat.tokenUsage` attribute. The total token usage throughout the trace will be
available in the `token_usage` field of the trace info object.

```python
response = agent("What is 2+2")
print(response)

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
  Input tokens: 2629
  Output tokens: 31
  Total tokens: 2660

== Detailed usage for each LLM call: ==
chat_1:
  Input tokens: 1301
  Output tokens: 16
  Total tokens: 1317
chat_2:
  Input tokens: 1328
  Output tokens: 15
  Total tokens: 1343
```

### Disable auto-tracing

Auto tracing for Strands Agent SDK can be disabled globally by calling `mlflow.strands.autolog(disable=True)` or `mlflow.autolog(disable=True)`.
```

--------------------------------------------------------------------------------

---[FILE: txtai.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/txtai.mdx

```text
---
sidebar_position: 13
sidebar_label: Txtai
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Tracing txtai

![txtai Tracing via autolog](/images/llms/tracing/txtai-rag-tracing.png)

[txtai](https://github.com/neuml/txtai?tab=readme-ov-file) is an all-in-one embeddings database for semantic search, LLM orchestration and language model workflows.

[MLflow Tracing](/genai/tracing) provides automatic tracing capability for txtai. Auto tracing for txtai can be enabled by calling the `mlflow.txtai.autolog` function, MLflow will capture traces for LLM invocation, embeddings, vector search, and log them to the active MLflow Experiment.

To get started, install the [MLflow txtai extension](https://github.com/neuml/mlflow-txtai/tree/master):

```bash
pip install mlflow-txtai
```

Then, enable autologging in your Python code:

```python
import mlflow

mlflow.txtai.autolog()
```

### Examples

<Tabs>
  <TabItem value="basic" label="Simple Example" default>

The simplest example to show the tracing integration is to instrument a [Textractor pipeline](https://neuml.github.io/txtai/pipeline/data/textractor/).

```python
import mlflow
from txtai.pipeline import Textractor

# Enable MLflow auto-tracing for txtai
mlflow.txtai.autolog()

# Optional: Set a tracking URI and an experiment
mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("txtai")

# Define and run a simple Textractor pipeline.
textractor = Textractor()
textractor("https://github.com/neuml/txtai")
```

![txtai Textractor Tracing via autolog](/images/llms/tracing/txtai-textractor-tracing.png)

  </TabItem>
  <TabItem value="rag" label="RAG" default>

You can easily trace a [RAG pipeline](https://neuml.github.io/txtai/pipeline/text/rag/).

```python
import mlflow
from txtai import Embeddings, RAG

# Enable MLflow auto-tracing for txtai
mlflow.txtai.autolog()

wiki = Embeddings()
wiki.load(provider="huggingface-hub", container="neuml/txtai-wikipedia-slim")

# Define prompt template
template = """
Answer the following question using only the context below. Only include information
specifically discussed.

question: {question}
context: {context} """

# Create RAG pipeline
rag = RAG(
    wiki,
    "hugging-quants/Meta-Llama-3.1-8B-Instruct-AWQ-INT4",
    system="You are a friendly assistant. You answer questions from users.",
    template=template,
    context=10,
)

rag("Tell me about the Roman Empire", maxlength=2048)
```

![txtai Rag Tracing via autolog](/images/llms/tracing/txtai-rag-tracing.png)

  </TabItem>
  <TabItem value="agent" label="Agent" default>

You can effortlessly trace the internals of a [txtai agent](https://neuml.github.io/txtai/agent/) designed to research questions on astronomy.

```python
import mlflow
from txtai import Agent, Embeddings

# Enable MLflow auto-tracing for txtai
mlflow.txtai.autolog()


def search(query):
    """
    Searches a database of astronomy data.

    Make sure to call this tool only with a string input, never use JSON.

    Args:
        query: concepts to search for using similarity search

    Returns:
        list of search results with for each match
    """

    return embeddings.search(
        "SELECT id, text, distance FROM txtai WHERE similar(:query)",
        10,
        parameters={"query": query},
    )


embeddings = Embeddings()
embeddings.load(provider="huggingface-hub", container="neuml/txtai-astronomy")

agent = Agent(
    tools=[search],
    llm="hugging-quants/Meta-Llama-3.1-8B-Instruct-AWQ-INT4",
    max_iterations=10,
)

researcher = """
{command}

Do the following.
 - Search for results related to the topic.
 - Analyze the results
 - Continue querying until conclusive answers are found
 - Write a Markdown report
"""

agent(
    researcher.format(
        command="""
Write a detailed list with explanations of 10 candidate stars that could potentially be habitable to life.
"""
    ),
    maxlength=16000,
)
```

![txtai Agent Tracing via autolog](/images/llms/tracing/txtai-agent-tracing.png)

  </TabItem>
</Tabs>

### More Information

For more examples and guidance on using txtai with MLflow, please refer to the [MLflow txtai extension documentation](https://github.com/neuml/mlflow-txtai/tree/master)
```

--------------------------------------------------------------------------------

---[FILE: vercelai.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/vercelai.mdx

```text
---
sidebar_position: 3
sidebar_label: Vercel AI SDK
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Tracing Vercel AI SDK

<video src={useBaseUrl("/images/llms/tracing/vercel-ai-tracing.mp4")} controls loop autoPlay muted aria-label="Vercel AI SDK tracing via MLflow" />

[MLflow Tracing](/genai/tracing) provides automatic tracing for applications built with the [Vercel AI SDK](https://ai-sdk.dev/) (the `ai` package) via OpenTelemetry, unlocking powerful observability capabilities for TypeScript and Javascript application developers.

When the integration is enabled, MLflow allows you to record the following information for Vercel AI SDK calls:

- Prompts or messages and generated responses
- Latencies
- Call hierarchy
- Token usage when the provider returns it
- Any exception if raised

## Quickstart (NextJS)

It is fairy straightforward to enable MLflow tracing for Vercel AI SDK if you are using NextJS.

:::tip

If you don't have a handy app to test, you can use the <ins>[demo chatbot app](https://vercel.com/templates/next.js/ai-chatbot-telemetry)</ins> provided by Vercel.

:::

### 1. Start MLflow Tracking Server

Start MLflow Tracking Server if you don't have one already:

```bash
mlflow server --backend-store-uri sqlite:///mlruns.db --port 5000
```

Alternatively, you can use [Docker Compose](/self-hosting/#docker-compose) to start the server without setting up Python environment. See [Self-Hosting Guide](/self-hosting/architecture/backend-store) for more details.

### 2. Configure Environment Variables

Set the following environment variable in your `.env.local` file:

```bash title=".env.local"
OTEL_EXPORTER_OTLP_ENDPOINT=<your-mlflow-tracking-server-endpoint>
OTEL_EXPORTER_OTLP_TRACES_HEADERS=x-mlflow-experiment-id=<your-experiment-id>
OTEL_EXPORTER_OTLP_TRACES_PROTOCOL=http/protobuf
```

For example, `OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:5000`.

### 3. Enable OpenTelemetry

Install the following packages to use Vercel OpenTelemetry integration.

```bash
pnpm i @opentelemetry/api @vercel/otel
```

Create a `instrumentation.ts` file in your NextJS project root and add the following code:

```typescript title="instrumentation.ts"
import { registerOTel } from '@vercel/otel';

export async function register() {
  registerOTel({ serviceName: 'next-app' })
}
```

Then specify `experimental_telemetry: {isEnabled: true}` wherever you are using the Vercel AI SDK in the app.

```typescript title="route.ts"
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export async function POST(req: Request) {
  const { prompt } = await req.json();

const { text } = await generateText({
  model: openai('gpt-4o-mini'),
  maxOutputTokens: 100,
  prompt,
  experimental_telemetry: {isEnabled: true},
});

  return new Response(JSON.stringify({ text }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

See [Vercel OpenTelemetry documentation](https://vercel.com/docs/tracing/instrumentation) for advanced usage such as context propagation.

### 5. Run the Application and View Traces

Run the application and view traces in MLflow UI. The UI is available at the tracking server endpoint you specified in the environment variables, e.g., `http://localhost:5000`.

## Other Node.js Applications

If you are using other Node.js frameworks, set the OpenTelemetry Node SDK and OTLP exporter manually to export traces to MLflow.

```typescript title="main.ts"
import { init } from "mlflow-tracing";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NodeSDK } from '@opentelemetry/sdk-node';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';


const sdk = new NodeSDK({
  spanProcessors: [
    new SimpleSpanProcessor(
      new OTLPTraceExporter({
        url: '<your-mlflow-tracking-server-endpoint>/v1/traces',
        headers: { 'x-mlflow-experiment-id': '<your-experiment-id>' },
      }),
    ),
  ],
});

sdk.start();

// Make an AI SDK call with telemetry enabled
const result = await generateText({
  model: openai('gpt-4o-mini'),
  prompt: 'What is MLflow?',
  // IMPORTANT: enable telemetry is required for tracing
  experimental_telemetry: { isEnabled: true }
});

console.log(result.text);
sdk.shutdown();
```

```bash
npx tsx main.ts
```

## Streaming

Streaming is supported as well. Similarly to the `generateText` function, specify the `experimental_telemetry.isEnabled` option to `true` to enable tracing.

```typescript
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

const stream = await streamText({
  model: openai('gpt-4o-mini'),
  prompt: 'Explain vector databases in one paragraph.',
  experimental_telemetry: { isEnabled: true }
});

for await (const part of stream.textStream) {
  process.stdout.write(part);
}
```

## Token usage

When the underlying provider supplies token usage (e.g., input and output tokens), MLflow aggregates it on the trace.
You can retrieve it from the trace info using the TypeScript SDK:

```typescript
// Flush any pending spans then fetch the most recent trace
await mlflow.flushTraces();
const lastTraceId = mlflow.getLastActiveTraceId();

if (lastTraceId) {
  const client = new mlflow.MlflowClient({ trackingUri: 'http://localhost:5000' });
  const trace = await client.getTrace(lastTraceId);
  console.log('Token usage:', trace.info.tokenUsage);  // { input_tokens, output_tokens, total_tokens }
}
```

## Disable auto-tracing

Disable tracing for Vercel AI SDK, set `experimental_telemetry: { isEnabled: false }` on the AI SDK call
```

--------------------------------------------------------------------------------

---[FILE: voltagent.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/voltagent.mdx

```text
---
sidebar_position: 7
sidebar_label: VoltAgent
---

import ImageBox from "@site/src/components/ImageBox";

# Tracing VoltAgent

<ImageBox src="/images/llms/tracing/voltagent-tracing.png" alt="VoltAgent Tracing" />

[MLflow Tracing](/genai/tracing) provides automatic tracing capability for [VoltAgent](https://github.com/VoltAgent/voltagent), an open-source TypeScript framework for building AI agents. MLflow supports tracing for VoltAgent through the [OpenTelemetry](/genai/tracing/opentelemetry) integration.

:::tip What is VoltAgent?
VoltAgent is an open-source TypeScript framework that simplifies the development of AI agent applications by providing modular building blocks, standardized patterns, and abstractions. Whether you're creating chatbots, virtual assistants, automated workflows, or complex multi-agent systems, VoltAgent handles the underlying complexity, allowing you to focus on defining your agents' capabilities and logic.
:::

## Step 1: Create a VoltAgent Project

Create a new VoltAgent project using the VoltAgent CLI:

```bash
npm create voltagent-app@latest
cd my-voltagent-app
```

For comprehensive installation instructions, refer to the [VoltAgent documentation](https://voltagent.dev).

## Step 2: Start the MLflow Tracking Server

Start the MLflow Tracking Server with a SQL-based backend store:

```bash
mlflow server --backend-store-uri sqlite:///mlflow.db --port 5000
```

This example uses SQLite as the backend store. To use other types of SQL databases such as PostgreSQL, MySQL, and MSSQL, change the store URI as described in the [backend store documentation](/self-hosting/architecture/backend-store). OpenTelemetry ingestion is not supported with file-based backend stores.

## Step 3: Install OpenTelemetry Packages

Install the OpenTelemetry SDK and OTLP protobuf exporter:

```bash
npm install @opentelemetry/sdk-trace-base @opentelemetry/exporter-trace-otlp-proto dotenv
```

:::note MLflow Trace Translation
MLflow automatically translates VoltAgent's semantic conventions for optimal UI visualization:

- **Chat UI**: Converts VoltAgent's message format to standard chat format with `role` and `content` fields for rich message display
- **Token Usage**: Extracts token metrics (`usage.prompt_tokens`, `usage.completion_tokens`) and displays them in the trace summary
- **Span Types**: Maps VoltAgent spans (agent, llm, tool, memory) to MLflow span types for proper iconography and filtering
  :::

## Step 4: Configure OpenTelemetry

Open your main application file (e.g., `src/index.ts`) and add the OpenTelemetry configuration to export traces to MLflow:

```typescript
import "dotenv/config";
import { VoltAgent, Agent, VoltAgentObservability } from "@voltagent/core";
import { openai } from "@ai-sdk/openai";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";

// Configure the OTLP exporter to send traces to MLflow
const mlflowExporter = new OTLPTraceExporter({
  url: `${process.env.MLFLOW_TRACKING_URI}/v1/traces`,
  headers: { "x-mlflow-experiment-id": process.env.MLFLOW_EXPERIMENT_ID ?? "0" },
});

// Create span processor and observability instance
const mlflowSpanProcessor = new BatchSpanProcessor(mlflowExporter);
const observability = new VoltAgentObservability({
  spanProcessors: [mlflowSpanProcessor],
});

const agent = new Agent({
  name: "my-voltagent-app",
  instructions: "A helpful assistant that answers questions",
  model: openai("gpt-4o-mini"),
});

new VoltAgent({
  agents: { agent },
  observability,
});
```

Don't forget to add the required environment variables to your `.env` file:

```bash
OPENAI_API_KEY=your-api-key
MLFLOW_TRACKING_URI=http://localhost:5000
MLFLOW_EXPERIMENT_ID=0
```

Replace the experiment ID with your MLflow experiment ID. You can create an experiment from the MLflow UI.

## Step 5: Run Your VoltAgent Application

Start the VoltAgent development server:

```bash
npm run dev
```

Your agent is now running! To interact with it, open the VoltAgent Console at [https://console.voltagent.dev](https://console.voltagent.dev) and send messages to your agent.

## Step 6: View Traces in MLflow

After chatting with your agent, open the MLflow UI at `http://localhost:5000` and navigate to your experiment to see the traces.

<ImageBox src="/images/llms/tracing/voltagent-tracing.png" alt="VoltAgent trace in MLflow UI" />

## Next Steps

- [Evaluate the Agent](/genai/eval-monitor/running-evaluation/agents): Learn how to evaluate the agent's performance.
- [Manage Prompts](/genai/prompt-registry): Learn how to manage prompts for the agent.
- [Automatic Agent Optimization](/genai/prompt-registry/optimize-prompts): Learn how to automatically optimize the agent end-to-end with state-of-the-art optimization algorithms.
```

--------------------------------------------------------------------------------

---[FILE: delete-traces.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/observe-with-traces/delete-traces.mdx

```text
import { APILink } from "@site/src/components/APILink";
import ImageBox from "@site/src/components/ImageBox";

# Delete Traces

You can delete traces based on specific criteria using the <APILink fn="mlflow.client.MlflowClient.delete_traces" /> method. This method allows you to delete traces by **timestamp** or **trace IDs**.

:::warning Deletion is irreversible
Deleting a trace cannot be undone. Ensure that the parameters provided to the `delete_traces` API meet the intended range for deletion.
:::

## Deleting traces from MLflow UI

<ImageBox src="/images/llms/tracing/delete-traces.png" alt="Delete Traces from MLflow UI" />

## Delete traces older than a specific timestamp:

```python
from datetime import datetime, timedelta

# Calculate timestamp for 7 days ago
seven_days_ago = datetime.now() - timedelta(days=7)
timestamp_ms = int(seven_days_ago.timestamp() * 1000)

deleted_count = client.delete_traces(
    experiment_id="1",
    max_timestamp_millis=timestamp_ms,
)

print(f"Deleted {deleted_count} traces")
```

Delete specific traces by their trace IDs:

```python
from mlflow import MlflowClient

client = MlflowClient()

# Delete specific traces
trace_ids = ["trace_id_1", "trace_id_2", "trace_id_3"]

deleted_count = client.delete_traces(experiment_id="1", trace_ids=trace_ids)

print(f"Deleted {deleted_count} traces")
```
```

--------------------------------------------------------------------------------

---[FILE: masking.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/observe-with-traces/masking.mdx

```text
import { APILink } from "@site/src/components/APILink";

# Redacting Sensitive Data from Traces

Traces capture powerful insights for debugging and monitoring your application, however, they may contain sensitive data, such as **Personal Identifiable Information (PII)**, that you don't want to share with others. MLflow provides a fully configurable way to mask sensitive data from traces before they are saved to the backend.

## How It Works

MLflow allows you to configure a list of post-processing hooks that are applied to each span in a trace. Each span processor is a function that takes a span as input and updates it in place.

1. Define a custom filtering function and call <APILink fn="mlflow.tracing.configure">`mlflow.tracing.configure`</APILink> to register it.
2. Whenever a new span is created, the registered filters are applied to it sequentially.
3. MLflow sends the filtered span to the backend.

Since the filters are applied at **client side** before sending the span to the backend, the sensitive data never goes out of your application.

## Filtering Function

A filtering function must take a single argument, which is a <APILink fn="mlflow.entities.span.Span">`Span`</APILink> object. It can mutate the span in-place. It must not return a value.

```python
def filter_function(span: Span) -> None:
    ...
```

## Example 1: Redacting E-mail Address

In this example, we'll redact the e-mail address from the user inputs using a simple regex.

```python
import re
import mlflow
from mlflow.entities.span import Span


# Your application code (simplified)
@mlflow.trace
def predict(text: str):
    return "Answer"


# Regex pattern to match e-mail addresses
EMAIL_PATTERN = r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"


# Define a filtering function that takes a span as input and mutates it in-place.
def redact_email(span: Span) -> None:
    raw_input = span.inputs.get("text")
    redacted_input = re.sub(EMAIL_PATTERN, "[REDACTED]", raw_input)
    span.set_inputs({"text": redacted_input})


# Register the filter function
mlflow.tracing.configure(span_processors=[redact_email])

# Run the application
predict("My e-mail address is test@example.com")
```

The generated trace will have the e-mail address redacted in the inputs:

![Redacting e-mail address from trace](/images/llms/tracing/masking/pii_masking_simple.png)

## Example 2: Applying a Filter to Particular Spans

The filtering function registered at <APILink fn="mlflow.tracing.configure">`mlflow.tracing.configure`</APILink> is applied to all spans. If your trace contains many nested spans, you may want to apply the filter only to certain spans. Also, the input/output format is typically different for different span types, so you may need to apply different filtering logic.

In the following example, we'll redact the bank account number from the trace, but using different filtering logic depending on the span type.

First, let's define a simple tool calling agent.

```python
import mlflow
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent

# Enabling tracing for LangGraph
mlflow.langchain.autolog()


@tool
def get_bank_account_number(user_name: str):
    """Return the bank account number for the given user name."""
    return "1234567890"


llm = ChatOpenAI(model="o4-mini")
tools = [get_bank_account_number]
graph = create_react_agent(llm, tools)
```

Then, let's define a filtering function. By checking the `span_type` field, we can apply different filtering logic to different span types.

```python
import re
from typing import Union
from mlflow.entities.span import Span, SpanType

ACCOUNT_NUMBER_PATTERN = re.compile(r"\d{10}")


def filter_bank_account_number(span: Span) -> None:
    # Redact the output of the tool call span.
    if span.span_type == SpanType.TOOL:
        span.set_outputs("[REDACTED]")
        return

    # Redact the back account number from other spans.
    if isinstance(span.inputs, dict) and (messages := span.inputs.get("messages")):
        span.set_inputs({"messages": redact_messages(messages)})
    if isinstance(span.outputs, dict) and (messages := span.outputs.get("messages")):
        span.set_outputs({"messages": redact_messages(messages)})


def redact_messages(messages: list[dict]):
    if isinstance(messages, dict):
        messages = messages.get("messages")

    return [
        {**msg, "content": ACCOUNT_NUMBER_PATTERN.sub("[REDACTED]", msg["content"])}
        for msg in messages
    ]
```

Now, let's register the filter function and run the application.

```python
# Register the filter function
mlflow.tracing.configure(span_processors=[filter_bank_account_number])

# Run the application
result = graph.invoke(
    {
        "messages": [
            {"role": "user", "content": "What is the bank account number for John Doe?"}
        ]
    }
)
```

The generated trace will have the bank account number redacted from all messages:

![Redacting bank account number from trace](/images/llms/tracing/masking/pii_masking_langgraph.png)

## Example 3: Redacting PII using Microsoft Presidio

To go beyond the simple Regex-based filtering, you can use a more sophisticated PII anonymizer such as [Microsoft Presidio](https://microsoft.github.io/presidio/anonymizer/).

In this example, we run a dummy custom support agent that takes user request such as "I want to cancel my credit card 4095-2609-9393-4932". The request contains many forms of sensitive data such as credit card number, user name, email address, and covering all of them using regex is not trivial.

```python
import mlflow
from mlflow.entities.span import Span, SpanType


# Dummy application code for custom support agent.
@mlflow.trace(span_type=SpanType.AGENT)
def customer_support_agent(request: str):
    return "Yes"
```

With MLflow, plugging in Presidio for filtering sensitive data from traces is straightforward.

First, install Presidio and download the classifier:

```bash
pip install presidio_analyzer presidio_anonymizer
python -m spacy download en_core_web_lg
```

Then, define a filter function that runs Presidio's analyzer and anonymizer on the span input.

```python
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import RecognizerResult, OperatorConfig

# Initialize the anonymizer and analyzer.
anonymizer = AnonymizerEngine()
analyzer = AnalyzerEngine()


# Define a filter function.
def filter_pii(span: Span) -> None:
    """Filter PII from the span input using Microsoft Presidio."""
    text = span.inputs.get("request")

    results = analyzer.analyze(
        text=text,
        entities=["PERSON", "CREDIT_CARD", "EMAIL_ADDRESS", "LOCATION", "DATE_TIME"],
        language="en",
    )
    anonymized_text = anonymizer.anonymize(text=text, analyzer_results=results)

    span.set_inputs({"request": anonymized_text.text})
```

Finally, let's register the filter function and run the application.

```python
# Register the filter function
mlflow.tracing.configure(span_processors=[filter_pii])

# Run the application
customer_support_agent(
    "Please cancel my credit card effective September 19th. My name is John Doe and my credit "
    "card number is 4095-2609-9393-4932. My email is john.doe@example.com and I live in Amsterdam."
)
```

The generated trace will have the PII redacted:

![Redacting PII from trace](/images/llms/tracing/masking/pii_masking_presidio.png)

## Resetting the Filter

To reset the filter, call <APILink fn="mlflow.tracing.configure">`mlflow.tracing.configure`</APILink> with an empty list of span processors.

```python
mlflow.tracing.configure(span_processors=[])
```

Alternatively, you can call <APILink fn="mlflow.tracing.reset">`mlflow.tracing.reset`</APILink> to reset the entire tracing configuration.

```python
mlflow.tracing.reset()
```
```

--------------------------------------------------------------------------------

---[FILE: ui.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/observe-with-traces/ui.mdx

```text
import { APILink } from "@site/src/components/APILink";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import useBaseUrl from '@docusaurus/useBaseUrl';

# MLflow Tracing UI

## Traces within MLflow Experiments

After logging your traces, you can view them in the [MLflow UI](/genai/tracing/observe-with-traces/ui), under the "Traces" tab in the main experiment page. This tab is also available within the individual run pages, if your trace was logged within a run context.

![MLflow Tracking UI](/images/llms/tracing/trace-experiment-ui.png)

This table includes high-level information about the traces, such as the trace ID, the inputs / outputs of the root span, and more. From this page, you can also perform a few actions to manage your traces:

<Tabs>
  <TabItem value="search" label="Search" default>
    Using the search bar in the UI, you can easily filter your traces based on name, tags, or other metadata. Check out the [search docs](/genai/tracing/search-traces) for details about the query string format.

    <video src={useBaseUrl("/images/llms/tracing/trace-session-id.mp4")} controls loop autoPlay muted aria-label="Searching traces" />

  </TabItem>
  <TabItem value="delete" label="Delete">
    The UI supports bulk deletion of traces. Simply select the traces you want to delete by checking the checkboxes, and then pressing the "Delete" button.

    <video src={useBaseUrl("/images/llms/tracing/trace-delete.mp4")} controls loop autoPlay muted aria-label="Deleting traces" />

  </TabItem>
  <TabItem value="edit-tags" label="Edit Tags">
    You can also edit key-value tags on your traces via the UI.

    <video src={useBaseUrl("/images/llms/tracing/trace-set-tag.mp4")} controls loop autoPlay muted aria-label="Traces tag update" />

  </TabItem>
</Tabs>

## Browsing span data

In order to browse the span data of an individual trace, simply click on the link in the "Trace ID" or "Trace name" columns to open the trace viewer:

<video src={useBaseUrl("/images/llms/tracing/tracing-top.mp4")} controls loop autoPlay muted aria-label="MLflow Tracing" />

## Jupyter Notebook integration

:::note
The MLflow Tracing Jupyter integration is available in **MLflow 2.20 and above**
:::

You can also view the trace UI directly within Jupyter notebooks, allowing
you to debug your applications without having to tab out of your development environment.

![Jupyter Trace UI](/images/llms/tracing/jupyter-trace-ui.png)

This feature requires using an [MLflow Tracking Server](/self-hosting/architecture/tracking-server), as
this is where the UI assets are fetched from. To get started, simply ensure that the MLflow
Tracking URI is set to your tracking server (e.g. `mlflow.set_tracking_uri("http://localhost:5000")`).

By default, the trace UI will automatically be displayed for the following events:

1. When the cell code generates a trace (e.g. via [automatic tracing](/genai/tracing/app-instrumentation/automatic), or by running a manually traced function)
2. When <APILink fn="mlflow.search_traces" /> is called
3. When a <APILink fn="mlflow.entities.Trace" /> object is displayed (e.g. via IPython's `display` function, or when it is the last value returned in a cell)

To disable the display, simply call <APILink fn="mlflow.tracing.disable_notebook_display" />, and rerun the cell
containing the UI. To enable it again, call <APILink fn="mlflow.tracing.enable_notebook_display" />.
```

--------------------------------------------------------------------------------

````
