---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 133
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 133 of 991)

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

---[FILE: dspy.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/dspy.mdx

```text
---
sidebar_position: 5
sidebar_label: DSPy
---

import useBaseUrl from '@docusaurus/useBaseUrl';

import { APILink } from "@site/src/components/APILink";

# Tracing DSPy🧩

<video src={useBaseUrl("/images/llms/tracing/dspy-tracing.mp4")} controls loop autoPlay muted aria-label="DSPy Tracing via autolog" />

[DSPy](https://dspy.ai/) is an open-source framework for building modular AI systems and offers algorithms for optimizing their prompts and weights.

[MLflow Tracing](../../) provides automatic tracing capability for DSPy. You can enable tracing
for DSPy by calling the <APILink fn="mlflow.dspy.autolog" /> function, and nested traces are automatically logged to the active MLflow Experiment upon invocation of DSPy modules.

```python
import mlflow

mlflow.dspy.autolog()
```

:::tip

MLflow DSPy integration is not only about tracing. MLflow offers full tracking experience for DSPy, including model tracking, index management, and evaluation. Please see the **[MLflow DSPy Flavor](/genai/flavors/dspy)** to learn more!

:::

### Example Usage

```python
import dspy
import mlflow

# Enabling tracing for DSPy
mlflow.dspy.autolog()

# Optional: Set a tracking URI and an experiment
mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("DSPy")

# Define a simple ChainOfThought model and run it
lm = dspy.LM("openai/gpt-4o-mini")
dspy.configure(lm=lm)


# Define a simple summarizer model and run it
class SummarizeSignature(dspy.Signature):
    """Given a passage, generate a summary."""

    passage: str = dspy.InputField(desc="a passage to summarize")
    summary: str = dspy.OutputField(desc="a one-line summary of the passage")


class Summarize(dspy.Module):
    def __init__(self):
        self.summarize = dspy.ChainOfThought(SummarizeSignature)

    def forward(self, passage: str):
        return self.summarize(passage=passage)


summarizer = Summarize()
summarizer(
    passage=(
        "MLflow Tracing is a feature that enhances LLM observability in your Generative AI (GenAI) applications "
        "by capturing detailed information about the execution of your application's services. Tracing provides "
        "a way to record the inputs, outputs, and metadata associated with each intermediate step of a request, "
        "enabling you to easily pinpoint the source of bugs and unexpected behaviors."
    )
)
```

### Tracing during Evaluation

Evaluating DSPy models is an important step in the development of AI systems. MLflow Tracing can help you track the performance of your programs after the evaluation, by providing detailed information about the execution of your programs for each input.

When MLflow auto-tracing is enabled for DSPy, traces will be automatically generated when you execute DSPy's [built-in evaluation suites](https://dspy.ai/learn/evaluation/overview/). The following example demonstrates how to run evaluation and review traces in MLflow:

```python
import dspy
from dspy.evaluate.metrics import answer_exact_match

import mlflow

# Enabling tracing for DSPy evaluation
mlflow.dspy.autolog(log_traces_from_eval=True)

# Define a simple evaluation set
eval_set = [
    dspy.Example(
        question="How many 'r's are in the word 'strawberry'?", answer="3"
    ).with_inputs("question"),
    dspy.Example(
        question="How many 'a's are in the word 'banana'?", answer="3"
    ).with_inputs("question"),
    dspy.Example(
        question="How many 'e's are in the word 'elephant'?", answer="2"
    ).with_inputs("question"),
]


# Define a program
class Counter(dspy.Signature):
    question: str = dspy.InputField()
    answer: str = dspy.OutputField(
        desc="Should only contain a single number as an answer"
    )


cot = dspy.ChainOfThought(Counter)

# Evaluate the programs
with mlflow.start_run(run_name="CoT Evaluation"):
    evaluator = dspy.evaluate.Evaluate(
        devset=eval_set,
        return_all_scores=True,
        return_outputs=True,
        show_progress=True,
    )
    aggregated_score, outputs, all_scores = evaluator(cot, metric=answer_exact_match)

    # Log the aggregated score
    mlflow.log_metric("exact_match", aggregated_score)
    # Log the detailed evaluation results as a table
    mlflow.log_table(
        {
            "question": [example.question for example in eval_set],
            "answer": [example.answer for example in eval_set],
            "output": outputs,
            "exact_match": all_scores,
        },
        artifact_file="eval_results.json",
    )
```

If you open the MLflow UI and go to the "CoT Evaluation" run, you will see the evaluation result, and the list of traces generated during the evaluation on the `Traces` tab.

:::note

You can disable tracing for these steps by calling the <APILink fn="mlflow.dspy.autolog" /> function with the `log_traces_from_eval` parameters set to `False`.

:::

### Tracing during Compilation (Optimization)

[Compilation (optimization)](https://dspy.ai/learn/optimization/overview/) is the core concept of DSPy. Through compilation, DSPy automatically optimizes the prompts and weights of your DSPy program to achieve the best performance.

By default, MLflow does **NOT** generate traces during complication, because complication can trigger hundreds or thousands of invocations of DSPy modules. To enable tracing for compilation, you can call the <APILink fn="mlflow.dspy.autolog" /> function with the `log_traces_from_compile` parameter set to `True`.

```python
import dspy
import mlflow

# Enable auto-tracing for compilation
mlflow.dspy.autolog(log_traces_from_compile=True)

# Optimize the DSPy program as usual
tp = dspy.MIPROv2(metric=metric, auto="medium", num_threads=24)
optimized = tp.compile(cot, trainset=trainset)
```

### Token usage

MLflow >= 3.5.0 supports token usage tracking for dspy. The token usage call will be logged in the `mlflow.chat.tokenUsage` attribute. The total token usage throughout the trace will be
available in the `token_usage` field of the trace info object.

```python
import dspy
import mlflow

mlflow.dspy.autolog()

dspy.settings.configure(lm=dspy.LM("openai/gpt-4o-mini"))

task = dspy.Predict("instruction -> response")
result = task(instruction="Translate 'hello' to French.")

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
  Input tokens: 143
  Output tokens: 12
  Total tokens: 155

== Detailed usage for each LLM call: ==
LM.__call__:
  Input tokens: 143
  Output tokens: 12
  Total tokens: 155
```

### Disable auto-tracing

Auto tracing for DSPy can be disabled globally by calling `mlflow.dspy.autolog(disable=True)` or `mlflow.autolog(disable=True)`.
```

--------------------------------------------------------------------------------

---[FILE: fireworksai.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/fireworksai.mdx

```text
---
sidebar_position: 12
sidebar_label: FireworksAI
---

import { APILink } from "@site/src/components/APILink";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import ImageBox from "@site/src/components/ImageBox";
import TabsWrapper from "@site/src/components/TabsWrapper";

# Tracing FireworksAI

<ImageBox src="/images/llms/tracing/fireworks-ai-tracing.png" alt="FireworksAI Tracing via autolog" />

[FireworksAI](https://fireworks.ai) is an inference and customization engine for open source AI. It provides day zero access to the latest SOTA OSS models and allows developers to build lightning AI applications.

[MLflow Tracing](/genai/tracing) provides automatic tracing capability for FireworksAI through the OpenAI SDK compatibility. FireworksAI is [OpenAI SDK compatible](https://fireworks.ai/docs/tools-sdks/openai-compatibility#openai-compatibility), you can use the <APILink fn="mlflow.openai.autolog" /> function to enable automatic tracing. MLflow will capture traces for LLM invocations and log them to the active MLflow Experiment.

MLflow automatically captures the following information about FireworksAI calls:

- Prompts and completion responses
- Latencies
- Model name
- Additional metadata such as `temperature`, `max_completion_tokens`, if specified
- Tool Use if returned in the response
- Any exception if raised

## Supported APIs

Since FireworksAI is OpenAI SDK compatible, all APIs supported by MLflow's OpenAI integration work seamlessly with FireworksAI. See [the model library](https://fireworks.ai/models) for a list of available models on FireworksAI.

| Normal | Tool Use | Structured Outputs | Streaming | Async |
| :----: | :------: | :----------------: | :-------: | :---: |
|   ✅   |    ✅    |         ✅         |    ✅     |  ✅   |

## Quick Start

```python
import mlflow
import openai
import os

# Enable auto-tracing
mlflow.openai.autolog()

# Optional: Set a tracking URI and an experiment
mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("FireworksAI")

# Create an OpenAI client configured for FireworksAI
openai_client = openai.OpenAI(
    base_url="https://api.fireworks.ai/inference/v1",
    api_key=os.getenv("FIREWORKS_API_KEY"),
)

# Use the client as usual - traces will be automatically captured
response = openai_client.chat.completions.create(
    model="accounts/fireworks/models/deepseek-v3-0324",  # For other models see: https://fireworks.ai/models
    messages=[
        {"role": "user", "content": "Why is open source better than closed source?"}
    ],
)
```

## Chat Completion API Examples

<TabsWrapper>
<Tabs>
  <TabItem value="basic" label="Basic Example" default>
    ```python
    import openai
    import mlflow
    import os

    # Enable auto-tracing
    mlflow.openai.autolog()

    # Optional: Set a tracking URI and an experiment
    # If running locally you can start a server with:  `mlflow server --host 127.0.0.1 --port 5000`
    mlflow.set_tracking_uri("http://127.0.0.1:5000")
    mlflow.set_experiment("FireworksAI")

    # Configure OpenAI client for FireworksAI
    openai_client = openai.OpenAI(
        base_url="https://api.fireworks.ai/inference/v1",
        api_key=os.getenv("FIREWORKS_API_KEY"),
    )

    messages = [
        {
            "role": "user",
            "content": "What is the capital of France?",
        }
    ]

    # To use different models check out the model library at: https://fireworks.ai/models
    response = openai_client.chat.completions.create(
        model="accounts/fireworks/models/deepseek-v3-0324",
        messages=messages,
        max_completion_tokens=100,
    )
    ```

  </TabItem>
  <TabItem value="streaming" label="Streaming">
    MLflow Tracing supports streaming API outputs of FireworksAI endpoints through the OpenAI SDK. With the same setup of auto tracing, MLflow automatically traces the streaming response and renders the concatenated output in the span UI. The actual chunks in the response stream can be found in the `Event` tab as well.

    ```python
    import openai
    import mlflow
    import os

    # Enable trace logging
    mlflow.openai.autolog()

    client = openai.OpenAI(
        base_url="https://api.fireworks.ai/inference/v1",
        api_key=os.getenv("FIREWORKS_API_KEY"),
    )

    stream = client.chat.completions.create(
        model="accounts/fireworks/models/deepseek-v3-0324",
        messages=[
            {"role": "user", "content": "How fast would a glass of water freeze on Titan?"}
        ],
        stream=True,  # Enable streaming response
    )
    for chunk in stream:
        print(chunk.choices[0].delta.content or "", end="")
    ```

  </TabItem>
  <TabItem value="async" label="Async">
    MLflow Tracing supports asynchronous API returns of FireworksAI through the OpenAI SDK. The usage is the same as the synchronous API.

    ```python
    import openai
    import mlflow
    import os

    # Enable trace logging
    mlflow.openai.autolog()

    client = openai.AsyncOpenAI(
        base_url="https://api.fireworks.ai/inference/v1",
        api_key=os.getenv("FIREWORKS_API_KEY"),
    )

    response = await client.chat.completions.create(
        model="accounts/fireworks/models/deepseek-v3-0324",
        messages=[{"role": "user", "content": "What is the best open source LLM?"}],
        # Async streaming is also supported
        # stream=True
    )
    ```

  </TabItem>
  <TabItem value="tool-use" label="Tool Use">
    MLflow Tracing automatically captures tool use responses from FireworksAI models. The function instruction in the response will be highlighted in the trace UI. Moreover, you can annotate the tool function with the `@mlflow.trace` decorator to create a span for the tool execution.

    The following example implements a simple tool use agent using FireworksAI and MLflow Tracing:

    ```python
    import json
    from openai import OpenAI
    import mlflow
    from mlflow.entities import SpanType
    import os

    client = OpenAI(
        base_url="https://api.fireworks.ai/inference/v1",
        api_key=os.getenv("FIREWORKS_API_KEY"),
    )


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
            model="accounts/fireworks/models/gpt-oss-20b",
            messages=messages,
            tools=tools,
        )
        ai_msg = response.choices[0].message
        messages.append(ai_msg)

        # If the model requests tool call(s), invoke the function with the specified arguments
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

            # Send the tool results to the model and get a new response
            response = client.chat.completions.create(
                model="accounts/fireworks/models/llama-v3p1-8b-instruct", messages=messages
            )

        return response.choices[0].message.content


    # Run the tool calling agent
    question = "What's the weather like in Paris today?"
    answer = run_tool_agent(question)
    ```

  </TabItem>
</Tabs>
</TabsWrapper>

## Token Usage

MLflow supports token usage tracking for FireworksAI. The token usage for each LLM call will be logged in the `mlflow.chat.tokenUsage` attribute. The total token usage throughout the trace will be available in the `token_usage` field of the trace info object.

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
  Input tokens: 20
  Output tokens: 283
  Total tokens: 303

== Detailed usage for each LLM call: ==
Completions:
  Input tokens: 20
  Output tokens: 283
  Total tokens: 303
```

## Disable auto-tracing

Auto tracing for FireworksAI can be disabled globally by calling `mlflow.openai.autolog(disable=True)` or `mlflow.autolog(disable=True)`.
```

--------------------------------------------------------------------------------

---[FILE: gemini.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/gemini.mdx

```text
---
sidebar_position: 9
sidebar_label: Gemini
---

import { APILink } from "@site/src/components/APILink";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import TabsWrapper from "@site/src/components/TabsWrapper";

# Tracing Gemini

![OpenAI Tracing via autolog](/images/llms/gemini/gemini-tracing.png)

[MLflow Tracing](../../) provides automatic tracing capability for Google Gemini. By enabling auto tracing
for Gemini by calling the <APILink fn="mlflow.gemini.autolog" /> function, MLflow will capture nested traces and log them to the active MLflow Experiment upon invocation of Gemini Python SDK. In Typescript, you can instead use the `tracedGemini` function to wrap the Gemini client.

<TabsWrapper>
<Tabs>
  <TabItem value="python" label="Python" default>
    ```python
    import mlflow

    mlflow.gemini.autolog()
    ```

</TabItem>
<TabItem value="typescript" label="JS / TS">
    ```typescript
    import { GoogleGenAI } from "@google/genai";
    import { tracedGemini } from "mlflow-gemini";

    const client = tracedGemini(new GoogleGenAI());
    ```

</TabItem>
</Tabs>
</TabsWrapper>

:::note

Current MLflow tracing integration supports both new [Google GenAI SDK](https://github.com/googleapis/python-genai) and legacy [Google AI Python SDK](https://github.com/google-gemini/generative-ai-python).
However, it may drop support for the legacy package without notice, and it is highly recommended to migrate your use cases to the new Google GenAI SDK.

:::

MLflow trace automatically captures the following information about Gemini calls:

- Prompts and completion responses
- Latencies
- Model name
- Additional metadata such as `temperature`, `max_tokens`, if specified.
- Token usage (input, output, and total tokens)
- Function calling if returned in the response
- Any exception if raised

## Supported APIs

MLflow supports automatic tracing for the following Gemini APIs:

### Python

| Text Generation | Chat | Function Calling | Streaming |  Async   | Image | Video |
| :-------------: | :--: | :--------------: | :-------: | :------: | :---: | :---: |
|       ✅        |  ✅  |        ✅        |     -     | ✅ (\*1) |   -   |   -   |

<div style={{ fontSize: '0.9em', marginTop: '10px' }}>

(\*1) Async support was added in MLflow 3.2.0.

</div>

### TypeScript / JavaScript

| Content Generation | Chat | Function Calling | Streaming | Async |
| :----------------: | :--: | :--------------: | :-------: | :---: |
|         ✅         |  -   |     ✅ (\*2)     |     -     |  ✅   |

<div style={{ fontSize: '0.9em', marginTop: '10px' }}>

(\*2) Only `models.generateContent()` is supported. Function calls in responses are captured and can be rendered in the MLflow UI. The TypeScript SDK is natively async.

</div>

To request support for additional APIs, please open a [feature request](https://github.com/mlflow/mlflow/issues) on GitHub.

## Basic Example

<Tabs>
  <TabItem value="python" label="Python" default>
    ```python
    import mlflow
    import google.genai as genai
    import os

    # Turn on auto tracing for Gemini
    mlflow.gemini.autolog()

    # Optional: Set a tracking URI and an experiment
    mlflow.set_tracking_uri("http://localhost:5000")
    mlflow.set_experiment("Gemini")


    # Configure the SDK with your API key.
    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

    # Use the generate_content method to generate responses to your prompts.
    response = client.models.generate_content(
        model="gemini-1.5-flash", contents="The opposite of hot is"
    )
    ```

  </TabItem>
  <TabItem value="typescript" label="JS / TS">
    ```typescript
    import { GoogleGenAI } from "@google/genai";
    import { tracedGemini } from "mlflow-gemini";

    const client = tracedGemini(new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }));

    const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "What is the capital of France?"
    });
    ```

  </TabItem>
</Tabs>

## Multi-turn chat interactions

MLflow support tracing multi-turn conversations with Gemini:

```python
import mlflow

mlflow.gemini.autolog()

chat = client.chats.create(model="gemini-1.5-flash")
response = chat.send_message(
    "In one sentence, explain how a computer works to a young child."
)
print(response.text)
response = chat.send_message(
    "Okay, how about a more detailed explanation to a high schooler?"
)
print(response.text)
```

## Async

MLflow Tracing supports asynchronous API of the Gemini SDK since MLflow 3.2.0. The usage is same as the synchronous API.

<Tabs>
  <TabItem value="python" label="Python" default>
    ```python
    # Configure the SDK with your API key.
    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

    # Async API is invoked through the `aio` namespace.
    response = await client.aio.models.generate_content(
        model="gemini-1.5-flash", contents="The opposite of hot is"
    )
    ```

  </TabItem>
  <TabItem value="typescript" label="JS / TS">
    Gemini Typescript / Javascript SDK is natively async. See the basic example above.
  </TabItem>
</Tabs>

## Embeddings

MLflow Tracing for Gemini SDK supports embeddings API (Python only):

```python
result = client.models.embed_content(model="text-embedding-004", contents="Hello world")
```

## Token usage

MLflow >= 3.4.0 supports token usage tracking for Gemini. The token usage for each LLM call will be logged in the `mlflow.chat.tokenUsage` attribute. The total token usage throughout the trace will be
available in the `token_usage` field of the trace info object.

<Tabs>
  <TabItem value="python" label="Python" default>

```python
import json
import mlflow

mlflow.gemini.autolog()

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

# Use the generate_content method to generate responses to your prompts.
response = client.models.generate_content(
    model="gemini-1.5-flash", contents="The opposite of hot is"
)

# Get the trace object just created
trace = mlflow.get_trace(mlflow.get_last_active_trace_id())

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

// After your Gemini call completes, flush and fetch the trace
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
  Input tokens: 5
  Output tokens: 2
  Total tokens: 7

== Detailed usage for each LLM call: ==
Models.generate_content:
  Input tokens: 5
  Output tokens: 2
  Total tokens: 7
Models._generate_content:
  Input tokens: 5
  Output tokens: 2
  Total tokens: 7
```

Token usage tracking is supported for both Python and TypeScript/JavaScript implementations.

### Disable auto-tracing

Auto tracing for Gemini can be disabled globally by calling `mlflow.gemini.autolog(disable=True)` or `mlflow.autolog(disable=True)`.
```

--------------------------------------------------------------------------------

---[FILE: google-adk.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/google-adk.mdx

```text
---
sidebar_position: 5
sidebar_label: Google ADK
---

import ImageBox from "@site/src/components/ImageBox";

# Tracing Google Agent Development Kit (ADK)

<ImageBox src="/images/llms/tracing/google-adk-tracing.png" alt="Google ADK Tracing" />

[MLflow Tracing](/genai/tracing) provides automatic tracing capability for [Google ADK](https://google.github.io/adk-docs/), a flexible and modular AI agents framework developed by Google. MLflow supports tracing for Google ADK through the [OpenTelemetry](/genai/tracing/opentelemetry) integration.

## Step 1: Install libraries

```bash
pip install mlflow>=3.6.0 google-adk opentelemetry-exporter-otlp-proto-http
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

```bash
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:5000
export OTEL_EXPORTER_OTLP_HEADERS=x-mlflow-experiment-id=123
```

## Step 4: Run the Agent

Define and invoke the agent in a Python script like `my_agent/agent.py` as usual. Google ADK will generate traces for your agent and send them to the MLflow Tracking Server endpoint.
To enable tracing for Google ADK and send traces to MLflow, set up the OpenTelemetry tracer provider with the `OTLPSpanExporter` before running the agent.

```python
# my_agent/agent.py
from google.adk.agents import LlmAgent
from google.adk.tools import FunctionTool

from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import SimpleSpanProcessor

# Configure the tracer provider and add the exporter
tracer_provider = TracerProvider()
tracer_provider.add_span_processor(SimpleSpanProcessor(OTLPSpanExporter()))
trace.set_tracer_provider(tracer_provider)


def calculator(a: float, b: float) -> str:
    """Add two numbers and return the result.

    Args:
        a: First number
        b: Second number

    Returns:
        The sum of a and b
    """
    return str(a + b)


calculator_tool = FunctionTool(func=calculator)

root_agent = LlmAgent(
    name="MathAgent",
    model="gemini-2.0-flash-exp",
    instruction=(
        "You are a helpful assistant that can do math. "
        "When asked a math problem, use the calculator tool to solve it."
    ),
    tools=[calculator_tool],
)
```

Run the agent with the `adk run` command or the web UI.

```bash
adk run my_agent
```

Open the MLflow UI at `http://localhost:5000` and navigate to the experiment to see the traces.

## Next Steps

- [Evaluate the Agent](/genai/eval-monitor/running-evaluation/agents): Learn how to evaluate the agent's performance.
- [Manage Prompts](/genai/prompt-registry): Learn how to manage prompts for the agent.
- [Automatic Agent Optimization](/genai/prompt-registry/optimize-prompts): Learn how to automatically optimize the agent end-to-end with state-of-the-art optimization algorithms.
```

--------------------------------------------------------------------------------

---[FILE: groq.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/groq.mdx

```text
---
sidebar_position: 11
sidebar_label: Groq
---

import { APILink } from "@site/src/components/APILink";

# Tracing Groq

![Groq tracing via autolog](/images/llms/groq/groq-tracing.png)

MLflow Tracing provides automatic tracing capability when using Groq.
When Groq auto-tracing is enabled by calling the <APILink fn="mlflow.groq.autolog" /> function,
usage of the Groq SDK will automatically record generated traces during interactive development.

Note that only synchronous calls are supported, and that asynchronous API and streaming methods are not traced.

### Example Usage

```python
import groq

import mlflow

# Turn on auto tracing for Groq by calling mlflow.groq.autolog()
mlflow.groq.autolog()

client = groq.Groq()

# Use the create method to create new message
message = client.chat.completions.create(
    model="llama3-8b-8192",
    messages=[
        {
            "role": "user",
            "content": "Explain the importance of low latency LLMs.",
        }
    ],
)

print(message.choices[0].message.content)
```

## Token usage

MLflow >= 3.2.0 supports token usage tracking for Groq. The token usage for each LLM call will be logged in the `mlflow.chat.tokenUsage` attribute. The total token usage throughout the trace will be
available in the `token_usage` field of the trace info object.

```python
import json
import mlflow

mlflow.groq.autolog()

client = groq.Groq()

# Use the create method to create new message
message = client.chat.completions.create(
    model="llama3-8b-8192",
    messages=[
        {
            "role": "user",
            "content": "Explain the importance of low latency LLMs.",
        }
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
  Input tokens: 21
  Output tokens: 628
  Total tokens: 649

== Detailed usage for each LLM call: ==
Completions:
  Input tokens: 21
  Output tokens: 628
```

Currently, groq token usage doesn't support token usage tracking for Audio transcription and Audio translation.

## Disable auto-tracing

Auto tracing for Groq can be disabled globally by calling `mlflow.groq.autolog(disable=True)` or `mlflow.autolog(disable=True)`.
```

--------------------------------------------------------------------------------

---[FILE: haystack.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/haystack.mdx

```text
---
sidebar_position: 8
sidebar_label: Haystack
---

import { APILink } from "@site/src/components/APILink";
import ImageBox from "@site/src/components/ImageBox";

# Tracing Haystack

<ImageBox src="/images/llms/haystack/haystack-tracing.png" alt="Haystack Tracing via autolog" />

[Haystack](https://github.com/deepset-ai/haystack) is an open-source AI orchestration framework developed by deepset, designed to help Python developers build production-ready LLM-powered applications.
It features a modular architecture - built around components and pipelines for building everything from retrieval-augmented generation (RAG) workflows to autonomous agentic systems and scalable search engines.

[MLflow Tracing](../../) provides automatic tracing capability when using Haystack pipelines and components.
When Haystack auto-tracing is enabled by calling the <APILink fn="mlflow.haystack.autolog" /> function,
usage of Haystack pipelines and components will automatically record generated traces during interactive development.

```python
import mlflow

mlflow.haystack.autolog()
```

MLflow trace automatically captures the following information:

- Pipelines and Components
- Latencies
- Metadata about the different components added, such as tool names
- Token usages and cost
- Cache hit
- Any exception if raised

### Basic Example

```python
import mlflow

from haystack import Document, Pipeline
from haystack.components.builders.chat_prompt_builder import ChatPromptBuilder
from haystack.components.generators.chat import OpenAIChatGenerator
from haystack.components.retrievers.in_memory import InMemoryBM25Retriever
from haystack.dataclasses import ChatMessage
from haystack.document_stores.in_memory import InMemoryDocumentStore
from haystack.utils import Secret

mlflow.haystack.autolog()
mlflow.set_experiment("Haystack Tracing")

# Write documents to InMemoryDocumentStore
document_store = InMemoryDocumentStore()
document_store.write_documents(
    [
        Document(content="My name is Jean and I live in Paris."),
        Document(content="My name is Mark and I live in Berlin."),
        Document(content="My name is Giorgio and I live in Rome."),
    ]
)

# Build a RAG pipeline
prompt_template = [
    ChatMessage.from_system("You are a helpful assistant."),
    ChatMessage.from_user(
        "Given these documents, answer the question.\n"
        "Documents:\n{% for doc in documents %}{{ doc.content }}{% endfor %}\n"
        "Question: {{question}}\n"
        "Answer:"
    ),
]

# Define required variables explicitly
prompt_builder = ChatPromptBuilder(
    template=prompt_template, required_variables={"question", "documents"}
)

retriever = InMemoryBM25Retriever(document_store=document_store)
llm = OpenAIChatGenerator(api_key=Secret.from_env_var("OPENAI_API_KEY"))

rag_pipeline = Pipeline()
rag_pipeline.add_component("retriever", retriever)
rag_pipeline.add_component("prompt_builder", prompt_builder)
rag_pipeline.add_component("llm", llm)
rag_pipeline.connect("retriever", "prompt_builder.documents")
rag_pipeline.connect("prompt_builder", "llm.messages")

# Ask a question
question = "Who lives in Paris?"
results = rag_pipeline.run(
    {
        "retriever": {"query": question},
        "prompt_builder": {"question": question},
    }
)

print(results["llm"]["replies"])
```

![Haystack Tracing via autolog](/images/llms/haystack/haystack-basic-tracing.png)

## Token usage

MLflow >= 3.4.0 supports token usage tracking for Haystack. The token usage for each LLM call will be logged in the `mlflow.chat.tokenUsage` attribute. The total token usage throughout the trace will be
available in the `token_usage` field of the trace info object.

```python
question = "Who lives in Paris?"
results = rag_pipeline.run(
    {
        "retriever": {"query": question},
        "prompt_builder": {"question": question},
    }
)

print(results["llm"]["replies"])

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
  Input tokens: 64
  Output tokens: 5
  Total tokens: 69

== Detailed usage for each LLM call: ==
OpenAIChatGenerator:
  Input tokens: 64
  Output tokens: 5
```

### Disable auto-tracing

Auto tracing for Haystack can be disabled globally by calling `mlflow.haystack.autolog(disable=True)` or `mlflow.autolog(disable=True)`.
```

--------------------------------------------------------------------------------

---[FILE: instructor.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/instructor.mdx

```text
---
sidebar_position: 12
sidebar_label: Instructor
---

# Tracing Instructor

![Instructor Tracing via autolog](/images/llms/tracing/instructor-tracing.png)

[Instructor](https://python.useinstructor.com/) is an open-source Python library built on top of Pydantic, simplifying structured LLM outputs with validation, retries, and streaming.

[MLflow Tracing](/genai/tracing) works with Instructor by enabling auto-tracing for the underlying LLM libraries. For example, if you use Instructor for OpenAI LLMs, you can enable tracing with `mlflow.openai.autolog()` and the generated traces will capture the structured outputs from Instructor.

Similarly, you can also trace Instructor with other LLM providers, such as Anthropic, Gemini, and LiteLLM, by enabling the corresponding autologging in MLflow.

### Example Usage

The following example shows how to trace Instructor call that wraps an OpenAI API.

```python
import instructor
from pydantic import BaseModel
from openai import OpenAI

# Use other autologging function e.g., mlflow.anthropic.autolog() if you are using Instructor with different LLM providers
mlflow.openai.autolog()

# Optional, create an experiment to store traces
mlflow.set_experiment("Instructor")


# Use Instructor as usual
class ExtractUser(BaseModel):
    name: str
    age: int


client = instructor.from_openai(OpenAI())

res = client.chat.completions.create(
    model="gpt-4o-mini",
    response_model=ExtractUser,
    messages=[{"role": "user", "content": "John Doe is 30 years old."}],
)
print(f"Name: {res.name}, Age:{res.age}")
```
```

--------------------------------------------------------------------------------

````
