---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 130
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 130 of 991)

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

---[FILE: manual-tracing.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/app-instrumentation/manual-tracing.mdx

```text
import { APILink } from "@site/src/components/APILink";
import useBaseUrl from '@docusaurus/useBaseUrl';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import TabsWrapper from '@site/src/components/TabsWrapper';

# Manual Tracing

In addition to the [Auto Tracing](/genai/tracing/app-instrumentation/automatic) integrations, you can instrument your GenAI application by using MLflow's manual tracing APIs.

## Decorator

The `mlflow.trace` decorator allows you to create a span for any function. This approach provides a simple yet effective way to add tracing to your code with minimal effort:

- 🔗 **MLflow detects the parent-child relationships** between functions, making it compatible with auto-tracing integrations.
- 🛡️ **Captures exceptions** during function execution and records them as span events.
- 📊 **Automatically logs the function's name, inputs, outputs, and execution time**.
- 🤝 **Can be used alongside auto-tracing** features.

<TabsWrapper>
<Tabs groupId="programming-language">
<TabItem value="python" label="Python" default>

The `@mlflow.trace` decorator currently supports the following types of functions:

| Function Type   | Supported       |
| --------------- | --------------- |
| Sync            | Yes             |
| Async           | Yes (>= 2.16.0) |
| Generator       | Yes (>= 2.20.2) |
| Async Generator | Yes (>= 2.20.2) |

The following code is a minimum example of using the decorator for tracing Python functions.

:::tip Decorator Order
To ensure complete observability, the `@mlflow.trace` decorator should generally be the **outermost** one if using multiple decorators. See [Using @mlflow.trace with Other Decorators](#using-mlflowtrace-with-other-decorators) for a detailed explanation and examples.
:::

```python
import mlflow


@mlflow.trace(span_type="func", attributes={"key": "value"})
def add_1(x):
    return x + 1


@mlflow.trace(span_type="func", attributes={"key1": "value1"})
def minus_1(x):
    return x - 1


@mlflow.trace(name="Trace Test")
def trace_test(x):
    step1 = add_1(x)
    return minus_1(step1)


trace_test(4)
```

</TabItem>

<TabItem value="typescript" label="TypeScript">

The `@mlflow.trace` decorator is useful when you want to trace a class method.

:::note
Decorator requires TypeScript version 5.0+ and it can only be applied to class method.
:::

```typescript
import * as mlflow from "mlflow-tracing";

class MyClass {
    @mlflow.trace({ spanType: mlflow.SpanType.LLM })
    generateText(prompt: string) {
        return "It's sunny in Seattle!";
    }
}
```

</TabItem>

</Tabs>
</TabsWrapper>

![Tracing Decorator](/images/llms/tracing/trace-decorator.png)

:::note
When a trace contains multiple spans with same name, MLflow appends an auto-incrementing suffix to them, such as `_1`, `_2`.
:::

## Function Wrapping

Function wrapping provides a flexible way to add tracing to existing functions without modifying their definitions. This is particularly useful when you want to add tracing to third-party functions or functions defined outside of your control. By wrapping an external function with `mlflow.trace`, you can capture its inputs, outputs, and execution context.

<TabsWrapper>
<Tabs groupId="programming-language">
<TabItem value="python" label="Python" default>

:::note
When wrapping functions dynamically, the concept of "outermost" still applies. The tracing wrapper should be applied at the point where you want to capture the entire call to the wrapped function.
:::

```python
import math
import mlflow


def invocation(x, y, exp=2):
    # Wrap an external function from the math library
    traced_pow = mlflow.trace(math.pow)
    raised = traced_pow(x, exp)

    traced_factorial = mlflow.trace(math.factorial)
    factorial = traced_factorial(int(raised))
    return factorial


invocation(4, 2)
```

</TabItem>

<TabItem value="typescript" label="TypeScript">

**Named Function**:

```typescript
import * as mlflow from "mlflow-tracing";

const getWeather = async (city: string) => {
    return `The weather in ${city} is sunny`;
};

// Wrap the function with mlflow.trace to create a traced function.
const tracedGetWeather = mlflow.trace(
    getWeather,
    { name: 'get-weather' }
);

// Invoke the traced function as usual.
await tracedGetWeather('San Francisco');
```

**Anonymous Function**:

```typescript
import * as mlflow from "mlflow-tracing";

const getWeather = mlflow.trace(
    (city: string) => {
        return `The weather in ${city} is sunny`;
    },
    // When wrapping an anonymous function, you need to specify the span name.
    { name: 'get-weather' }
);

// Invoke the traced function as usual.
getWeather('San Francisco');
```

</TabItem>

</Tabs>
</TabsWrapper>

## Customizing Spans

The `mlflow.trace` decorator accepts following arguments to customize the span to be created:

- 🏷️ **`name` parameter** to override the span name from the default (the name of decorated function)
- 🎯 **`span_type` parameter** to set the type of span. Set either one of built-in [Span Types](/genai/concepts/span#span-types) or a string.
- 🏗️ **`attributes` parameter** to add custom attributes to the span.

<TabsWrapper>
<Tabs groupId="programming-language">
<TabItem value="python" label="Python" default>

```python
from mlflow.entities import SpanType


@mlflow.trace(
    name="call-local-llm", span_type=SpanType.LLM, attributes={"model": "gpt-4o-mini"}
)
def invoke(prompt: str):
    return client.invoke(
        messages=[{"role": "user", "content": prompt}], model="gpt-4o-mini"
    )
```

</TabItem>

<TabItem value="typescript" label="TypeScript">

```typescript
import * as mlflow from "mlflow-tracing";

class MyClass {
    @mlflow.trace({
        name: "call-local-llm",
        spanType: mlflow.SpanType.LLM,
        attributes: {"model": "gpt-4o-mini"}
    })
    generateText(prompt: string) {
        return "It's sunny in Seattle!";
    }
}
```

</TabItem>

</Tabs>
</TabsWrapper>

Alternatively, you can update the span dynamically inside the function.

<TabsWrapper>
<Tabs groupId="programming-language">
<TabItem value="python" label="Python" default>

Use the <APILink fn="mlflow.get_current_active_span" /> API.

```python
from mlflow.entities import SpanType


@mlflow.trace(span_type=SpanType.LLM)
def invoke(prompt: str):
    model_id = "gpt-4o-mini"
    # Get the current span (created by the @mlflow.trace decorator)
    span = mlflow.get_current_active_span()
    # Set the attribute to the span
    span.set_attributes({"model": model_id})
    return client.invoke(messages=[{"role": "user", "content": prompt}], model=model_id)
```

</TabItem>

<TabItem value="typescript" label="TypeScript">

Use the `mlflow.getCurrentActiveSpan` API.

```typescript
import * as mlflow from "mlflow-tracing";

class MyClass {
    @mlflow.trace({ spanType: mlflow.SpanType.LLM })
    generateText(prompt: string) {
        const modelId = "gpt-4o-mini";
        const span = mlflow.getCurrentActiveSpan();
        span?.setAttribute("model", modelId);
        return "It's sunny in Seattle!";
    }
}
```

</TabItem>

</Tabs>
</TabsWrapper>

## Adding Trace Tags

Tags can be added to traces to provide additional metadata at the trace level. There are a few different ways to set tags on a trace. Please refer to the [how-to guide](/genai/tracing/attach-tags) for the other methods.

<TabsWrapper>
<Tabs groupId="programming-language">
<TabItem value="python" label="Python" default>

```python
@mlflow.trace
def my_func(x):
    mlflow.update_current_trace(tags={"fruit": "apple"})
    return x + 1
```

</TabItem>

<TabItem value="typescript" label="TypeScript">

```typescript
import * as mlflow from "mlflow-tracing";

class MyClass {
    @mlflow.trace({ spanType: mlflow.SpanType.LLM })
    generateText(prompt: string) {
        mlflow.updateCurrentTrace({ tags: { fruit: "apple" } });
        return "It's sunny in Seattle!";
    }
}
```

</TabItem>

</Tabs>
</TabsWrapper>

## Customizing Request and Response Previews in the UI

The Traces tab in the MLflow UI displays a list of traces, and the `Request` and `Response` columns show a preview of the end-to-end input and output of each trace. This allows you to quickly understand what each trace represents.

By default, these previews are truncated to a fixed number of characters. However, you can customize what's shown in these columns by using the `request_preview` and `response_preview` parameters. This is particularly useful for complex inputs or outputs where the default truncation might not show the most relevant information.

Below is an example of setting a custom request preview for a trace that processes a long document and user instructions, aiming to render the most relevant information in the UI's `Request` column:

<TabsWrapper>
<Tabs groupId="programming-language">
<TabItem value="python" label="Python" default>

```python
import mlflow


@mlflow.trace(name="Summarization Pipeline")
def summarize_document(document_content: str, user_instructions: str):
    # Construct a custom preview for the request column
    # For example, show beginning of document and user instructions
    request_p = f"Doc: {document_content[:30]}... Instr: {user_instructions[:30]}..."
    mlflow.update_current_trace(request_preview=request_p)

    # Simulate LLM call
    # messages = [
    #     {"role": "system", "content": "Summarize the following document based on user instructions."},
    #     {"role": "user", "content": f"Document: {document_content}\nInstructions: {user_instructions}"}
    # ]
    # completion = client.chat.completions.create(model="gpt-4o-mini", messages=messages)
    # summary = completion.choices[0].message.content
    summary = f"Summary of document starting with '{document_content[:20]}...' based on '{user_instructions}'"

    # Customize the response preview
    response_p = f"Summary: {summary[:50]}..."
    mlflow.update_current_trace(response_preview=response_p)

    return summary


# Example Call
long_document = (
    "This is a very long document that contains many details about various topics..."
    * 10
)
instructions = "Focus on the key takeaways regarding topic X."
summary_result = summarize_document(long_document, instructions)
```

</TabItem>

<TabItem value="typescript" label="TypeScript">

```typescript
import * as mlflow from "mlflow-tracing";

class MyClass {
    @mlflow.trace({ name: "Summarization Pipeline" })
    summarizeDocument(documentContent: string, userInstructions: string) {
        // Construct a custom preview for the request column
        // For example, show beginning of document and user instructions
        const requestPreview = `Doc: ${documentContent.slice(0, 30)}... Instr: ${userInstructions.slice(0, 30)}...`;
        mlflow.updateCurrentTrace({ requestPreview: requestPreview });

        // Simulate LLM call
        // const messages = [
        //   { role: "system", content: "Summarize the following document based on user instructions." },
        //   { role: "user", content: `Document: ${documentContent}\nInstructions: ${userInstructions}` }
        // ];
        // const completion = await client.chat.completions.create({ model: "gpt-4o-mini", messages });
        // const summary = completion.choices[0].message.content;
        const summary = `Summary of document starting with '${documentContent.slice(0, 20)}...' based on '${userInstructions}'`;

        // Customize the response preview
        const responsePreview = `Summary: ${summary.slice(0, 50)}...`;
        mlflow.updateCurrentTrace({ responsePreview: responsePreview });

        return summary;
    }
}
```

</TabItem>

</Tabs>
</TabsWrapper>

By setting `request_preview` and `response_preview` on the trace (typically the root span), you control how the overall interaction is summarized in the main trace list view, making it easier to identify and understand traces at a glance.

## Code Block

In addition to the decorator, MLflow allows for creating a span that can then be accessed within any encapsulated arbitrary code block. It can be useful for capturing complex interactions within your code in finer detail than what is possible by capturing the boundaries of a single function.

Similarly to the decorator, the code block automatically captures parent-child relationship, exceptions, execution time, and works with auto-tracing. However, the name, inputs, and outputs of the span must be provided manually.

<TabsWrapper>
<Tabs groupId="programming-language">
<TabItem value="python" label="Python" default>

Use the <APILink fn="mlflow.start_span" /> context manager.

```python
import mlflow

with mlflow.start_span(name="my_span") as span:
    span.set_inputs({"x": 1, "y": 2})
    z = x + y
    span.set_outputs(z)
```

</TabItem>

<TabItem value="typescript" label="TypeScript">

Use the `mlflow.withSpan` function wrapper.

```typescript
import * as mlflow from "mlflow-tracing";

const result = await mlflow.withSpan(
    async (span: mlflow.Span) => {
        const x = 1;
        const y = 2;
        span.setInputs({ "x": x, "y": y });
        const z = x + y;
        span.setOutputs(z);
    },
    {
        name: "MySpan",
    }
);
```

</TabItem>

</Tabs>
</TabsWrapper>

Below is a slightly more complex example that uses code block in conjunction with both the decorator and auto-tracing for OpenAI.

<TabsWrapper>
<Tabs groupId="programming-language">
<TabItem value="python" label="Python" default>

```python
import mlflow
import openai
from mlflow.entities import SpanType

# Enable auto-tracing for OpenAI
mlflow.openai.autolog()


@mlflow.trace(span_type=SpanType.CHAIN)
def start_session():
    messages = [{"role": "system", "content": "You are a friendly chat bot"}]
    while True:
        with mlflow.start_span(name="User") as span:
            span.set_inputs(messages)
            user_input = input(">> ")
            span.set_outputs(user_input)

        if user_input == "BYE":
            break

        messages.append({"role": "user", "content": user_input})

        response = openai.OpenAI().chat.completions.create(
            model="gpt-4o-mini",
            max_tokens=100,
            messages=messages,
        )
        answer = response.choices[0].message.content
        print(f"🤖: {answer}")

        messages.append({"role": "assistant", "content": answer})


start_session()
```

</TabItem>

<TabItem value="typescript" label="TypeScript">

```typescript
import * as mlflow from "mlflow-tracing";
import { tracedOpenAI } from "mlflow-openai";
import { OpenAI } from "openai";
import * as readline from "readline";

const openai = tracedOpenAI(new OpenAI());

class MyClass {
    @mlflow.trace({ spanType: mlflow.SpanType.CHAIN })
    async startSession() {
        var messages: OpenAI.ChatCompletionMessageParam[] = [{"role": "system", "content": "You are a friendly chat bot"}];
        // Create readline interface for user input
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const getUserInput = (prompt: string): Promise<string> => {
            return new Promise((resolve) => {
                    rl.question(prompt, (answer) => {
                    resolve(answer);
                });
            });
        };

        while (true) {
            let userInput: string = "";

            await mlflow.withSpan(
                async (span) => {
                    span.setInputs({ messages });
                    userInput = await getUserInput(">> ");
                    span.setOutputs({ userInput });
                },
                { name: "User" }
            );

            if (userInput === "BYE") {
                break;
            }

            messages.push({ role: "user", content: userInput });

            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                max_tokens: 100,
                messages: messages
            });

            const answer = response.choices[0].message.content || "";
            console.log(`🤖: ${answer}`);

            messages.push({ role: "assistant", content: answer });
        }

        rl.close();
    }
}

const myClass = new MyClass();
myClass.startSession();
```

</TabItem>
</Tabs>
</TabsWrapper>

## Automatic Exception Handling

If an `Exception` is raised during processing of a trace-instrumented operation, an indication will be shown within the UI that the invocation was not successful and a partial capture of data will be available to aid in debugging. Additionally, details about the Exception that was raised will be included within `Events` of the partially completed span, further aiding the identification of where issues are occurring within your code.

<video src={useBaseUrl("/images/llms/tracing/trace-exception.mp4")} controls loop autoPlay muted aria-label="Trace Error" />

---

:::note Python Only Features
The below documentation applies only to the MLflow Python SDK.
:::

## Using `@mlflow.trace` with Other Decorators

When applying multiple decorators to a single function, it's crucial to place `@mlflow.trace` as the **outermost** decorator (the one at the very top). This ensures that MLflow can capture the entire execution of the function, including the behavior of any inner decorators.

If `@mlflow.trace` is not the outermost decorator, its visibility into the function's execution may be limited or incorrect, potentially leading to incomplete traces or misrepresentation of the function's inputs, outputs, and execution time.

Consider the following conceptual example:

<TabsWrapper>
<Tabs groupId="programming-language">
<TabItem value="python" label="Python" default>

```python
import mlflow
import functools
import time


# A hypothetical additional decorator
def simple_timing_decorator(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(
            f"{func.__name__} executed in {end_time - start_time:.4f} seconds by simple_timing_decorator."
        )
        return result

    return wrapper


# Correct order: @mlflow.trace is outermost
@mlflow.trace(name="my_decorated_function_correct_order")
@simple_timing_decorator
# @another_framework_decorator # e.g., @app.route("/mypath") from Flask
def my_complex_function(x, y):
    # Function logic here
    time.sleep(0.1)  # Simulate work
    return x + y


# Incorrect order: @mlflow.trace is NOT outermost
@simple_timing_decorator
@mlflow.trace(name="my_decorated_function_incorrect_order")
# @another_framework_decorator
def my_other_complex_function(x, y):
    time.sleep(0.1)
    return x * y


# Example calls
if __name__ == "__main__":
    print("Calling function with correct decorator order:")
    my_complex_function(5, 3)

    print("\nCalling function with incorrect decorator order:")
    my_other_complex_function(5, 3)
```

</TabItem>
</Tabs>
</TabsWrapper>

In the `my_complex_function` example (correct order), `@mlflow.trace` will capture the full execution, including the time added by `simple_timing_decorator`. In `my_other_complex_function` (incorrect order), the trace captured by MLflow might not accurately reflect the total execution time or could miss modifications to inputs/outputs made by `simple_timing_decorator` before `@mlflow.trace` sees them.

## Streaming

The `@mlflow.trace` decorator can be used to trace functions that return a generator or an iterator, since MLflow 2.20.2.

<TabsWrapper>
<Tabs groupId="programming-language">
<TabItem value="python" label="Python" default>

```python
@mlflow.trace
def stream_data():
    for i in range(5):
        yield i
```

</TabItem>
</Tabs>
</TabsWrapper>

The above example will generate a trace with a single span for the `stream_data` function. By default, MLflow will capture all elements yielded by the generator as a list in the span's output. In the example above, the output of the span will be `[0, 1, 2, 3, 4]`.

:::note
A span for a stream function will start when the returned iterator starts to be **consumed**, and will end when the iterator is exhausted, or an exception is raised during the iteration.
:::

If you want to aggregate the elements to be a single span output, you can use the `output_reducer` parameter to specify a custom function to aggregate the elements. The custom function should take a list of yielded elements as inputs.

<TabsWrapper>
<Tabs groupId="programming-language">
<TabItem value="python" label="Python" default>

```python
@mlflow.trace(output_reducer=lambda x: ",".join(x))
def stream_data():
    for c in "hello":
        yield c
```

</TabItem>
</Tabs>
</TabsWrapper>

In the example above, the output of the span will be `"h,e,l,l,o"`. The raw chunks can still be found in the `Events` tab of the span.

The following is an advanced example that uses the `output_reducer` to consolidate ChatCompletionChunk output from an OpenAI LLM into a single message object.

:::tip
Of course, we recommend using the [auto-tracing for OpenAI](/genai/tracing/integrations/listing/openai) for examples like this, which does the same job but with one-liner code. The example below is for demonstration purposes.
:::

<TabsWrapper>
<Tabs groupId="programming-language">
<TabItem value="python" label="Python" default>

```python
import mlflow
import openai
from openai.types.chat import *
from typing import Optional


def aggregate_chunks(outputs: list[ChatCompletionChunk]) -> Optional[ChatCompletion]:
    """Consolidate ChatCompletionChunks to a single ChatCompletion"""
    if not outputs:
        return None

    first_chunk = outputs[0]
    delta = first_chunk.choices[0].delta
    message = ChatCompletionMessage(
        role=delta.role, content=delta.content, tool_calls=delta.tool_calls or []
    )
    finish_reason = first_chunk.choices[0].finish_reason
    for chunk in outputs[1:]:
        delta = chunk.choices[0].delta
        message.content += delta.content or ""
        message.tool_calls += delta.tool_calls or []
        finish_reason = finish_reason or chunk.choices[0].finish_reason

    base = ChatCompletion(
        id=first_chunk.id,
        choices=[Choice(index=0, message=message, finish_reason=finish_reason)],
        created=first_chunk.created,
        model=first_chunk.model,
        object="chat.completion",
    )
    return base


@mlflow.trace(output_reducer=aggregate_chunks)
def predict(messages: list[dict]):
    stream = openai.OpenAI().chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        stream=True,
    )
    for chunk in stream:
        yield chunk


for chunk in predict([{"role": "user", "content": "Hello"}]):
    print(chunk)
```

</TabItem>
</Tabs>
</TabsWrapper>

In the example above, the generated `predict` span will have a single chat completion message as the output, which is aggregated by the custom reducer function.

## Multi Threading

MLflow Tracing is thread-safe, traces are isolated by default per thread. But you can also create a trace that spans multiple threads with a few additional steps.

MLflow uses Python's built-in [ContextVar](https://docs.python.org/3/library/contextvars.html) mechanism to ensure thread safety, which is not propagated across threads by default. Therefore, you need to manually copy the context from the main thread to the worker thread, as shown in the example below.

<TabsWrapper>
<Tabs groupId="programming-language">
<TabItem value="python" label="Python" default>

```python
import contextvars
from concurrent.futures import ThreadPoolExecutor, as_completed
import mlflow
from mlflow.entities import SpanType
import openai

client = openai.OpenAI()

# Enable MLflow Tracing for OpenAI
mlflow.openai.autolog()


@mlflow.trace
def worker(question: str) -> str:
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": question},
    ]
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.1,
        max_tokens=100,
    )
    return response.choices[0].message.content


@mlflow.trace
def main(questions: list[str]) -> list[str]:
    results = []
    # Almost same as how you would use ThreadPoolExecutor, but two additional steps
    #  1. Copy the context in the main thread using copy_context()
    #  2. Use ctx.run() to run the worker in the copied context
    with ThreadPoolExecutor(max_workers=2) as executor:
        futures = []
        for question in questions:
            ctx = contextvars.copy_context()
            futures.append(executor.submit(ctx.run, worker, question))
        for future in as_completed(futures):
            results.append(future.result())
    return results


questions = [
    "What is the capital of France?",
    "What is the capital of Germany?",
]

main(questions)
```

</TabItem>
</Tabs>
</TabsWrapper>

![Multi threaded tracing](/images/llms/tracing/tracing-multi-thread.png)

:::tip
In contrast, `ContextVar` is copied to **async** tasks by default. Therefore, you don't need to manually copy the context when using `asyncio`, which might be an easier way to handle concurrent I/O-bound tasks in Python with MLflow Tracing.
:::

## Async Support

The `@mlflow.trace` decorator works seamlessly with async functions:

<TabsWrapper>
<Tabs groupId="programming-language">
<TabItem value="python" label="Python" default>

```python
import asyncio
import mlflow


@mlflow.trace
async def async_operation(data: str) -> str:
    # Simulate async work
    await asyncio.sleep(0.1)
    return f"Processed: {data}"


@mlflow.trace
async def async_pipeline(items: list[str]) -> list[str]:
    results = []
    for item in items:
        result = await async_operation(item)
        results.append(result)
    return results


# Run the async pipeline
asyncio.run(async_pipeline(["item1", "item2", "item3"]))
```

</TabItem>
</Tabs>
</TabsWrapper>

## Next Steps

**[Combining with Auto-Tracing](/genai/tracing/app-instrumentation/automatic#combining-manual-and-automatic-tracing)**: Mix automatic and manual tracing for optimal observability

**[Trace Concepts](/genai/concepts/trace)**: Understand the structure and components of MLflow traces

**[Querying Traces](/genai/tracing/search-traces)**: Programmatically search and analyze your traces
```

--------------------------------------------------------------------------------

---[FILE: opentelemetry.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/app-instrumentation/opentelemetry.mdx

```text
---
sidebar_position: 4
---

import ImageBox from '@site/src/components/ImageBox';

# Tracing with OpenTelemetry

[OpenTelemetry](https://opentelemetry.io/) is a CNCF-backed project that provides vendor-neutral observability APIs and SDKs to collect telemetry data from your applications. MLflow Tracing is fully compatible with OpenTelemetry, making it free from vendor lock-in.

## Using the MLflow Tracing SDK

The MLflow Tracing SDK is built on top of the OpenTelemetry SDK. If you want to instrument your AI applications with minimal effort, use the [MLflow Tracing SDK](/genai/tracing/quickstart).

```python
import mlflow
from openai import OpenAI

mlflow.openai.autolog()

client = OpenAI()
response = client.responses.create(model="gpt-4o-mini", input="Hello, world!")
```

## Using Other OpenTelemetry Libraries

You may want to trace LLMs or frameworks that are not [supported](/genai/tracing/integrations) by the MLflow Tracing SDK, or instrument applications written in languages other than Python and TypeScript/JavaScript.

MLflow Server exposes an OTLP endpoint at `/v1/traces` ([OTLP](https://opentelemetry.io/docs/specs/otlp/)) that accepts traces from any OpenTelemetry instrumentation, allowing you to trace applications written in other languages such as Java, Go, Rust, etc. To export traces to MLflow, set `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` to the MLflow server endpoint and set the `x-mlflow-experiment-id` header to the MLflow experiment ID.

```bash
export OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://localhost:5000/v1/traces
export OTEL_EXPORTER_OTLP_TRACES_HEADERS=x-mlflow-experiment-id=123
```

For more details about the MLflow OpenTelemetry integration, see [Collect OpenTelemetry Traces into MLflow](/genai/tracing/opentelemetry/ingest).

## Combining the OpenTelemetry SDK and the MLflow Tracing SDK

Since the MLflow Tracing SDK is built on top of the OpenTelemetry SDK, you can combine them to get the best of both worlds. To use both SDKs in a single application, set the `MLFLOW_USE_DEFAULT_TRACER_PROVIDER` environment variable to `false`.

The following example shows how to combine MLflow's OpenAI auto-tracing with OpenTelemetry's native FastAPI instrumentation.

```python
import os
import mlflow
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response
from openai import OpenAI
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

# Use the OpenTelemetry tracer provider instead of MLflow's default tracer provider.
os.environ["MLFLOW_USE_DEFAULT_TRACER_PROVIDER"] = "false"


# Enable MLflow OpenAI auto-tracing at application startup.
@asynccontextmanager
async def lifespan(app: FastAPI):
    mlflow.set_tracking_uri("http://localhost:5000")
    mlflow.set_experiment("FastAPI")
    mlflow.openai.autolog()
    yield


app = FastAPI(lifespan=lifespan)
# Enable FastAPI auto-instrumentation, which creates an OpenTelemetry span for each endpoint call.
FastAPIInstrumentor.instrument_app(app)


@app.post("/rag/v1/answer")
@mlflow.trace
async def answer_question(query: Request) -> Response:
    return ...
```

Spans generated from both SDKs will be merged into a single trace.

<ImageBox
  src="/images/llms/tracing/opentelemetry/mlflow-otel-combined.png"
  alt="The MLflow UI showing the MLflow and OpenTelemetry combined spans"
  width="100%"
/>
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/attach-tags/index.mdx

```text
import { APILink } from "@site/src/components/APILink";
import useBaseUrl from '@docusaurus/useBaseUrl';

# Setting Trace Tags

Tags are mutable key-value pairs that you can attach to traces to add valuable labels and context for grouping and filtering traces. For example, you can tag traces based on the topic of the user's input or the type of request being processed and group them together for analysis and quality evaluation.

## Setting Tags via the MLflow UI

<video src={useBaseUrl("/images/llms/tracing/trace-set-tag.mp4")} controls loop autoPlay muted aria-label="Traces tag update" />

## Setting Tags on Ongoing Traces

Use <APILink fn="mlflow.update_current_trace" /> to add tags during trace execution.

```python
import mlflow


@mlflow.trace
def my_func(x):
    mlflow.update_current_trace(tags={"fruit": "apple"})
    return x + 1


result = my_func(5)
```

:::note
If the key is already present, the <APILink fn="mlflow.update_current_trace" /> function will update the key with the new value.
:::

## Setting Tags on Completed Traces

Add or modify tags on traces that have already been completed and logged.

```python
import mlflow

mlflow.set_trace_tag(trace_id="your-trace-id", key="tag_key", value="tag_value")
```

## Retrieving Tags

Tags are stored on the `info.tags` attribute of the trace object.

```python
import mlflow

trace = mlflow.get_trace(trace_id="your-trace-id")
print(trace.info.tags)
# Output: {'tag_key': 'tag_value'}
```

## Searching and Filtering with Tags

Use tags to find specific traces quickly and efficiently.

```python
# Search for traces with tag 'environment' set to 'production'
traces = mlflow.search_traces(filter_string="tags.environment = 'production'")
```

You can also use pattern matching to find traces by tag value.

```python
# Search for traces with tag that contains the word 'mlflow'
traces = mlflow.search_traces(filter_string="tags.topic LIKE '%mlflow%'")
```

View the full list of supported filter syntax in the [Search Traces](/genai/tracing/search-traces) guide.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/collect-user-feedback/index.mdx

```text
import { APILink } from "@site/src/components/APILink";
import TilesGrid from "@site/src/components/TilesGrid";
import TileCard from "@site/src/components/TileCard";
import { BarChart3, Target, Search } from "lucide-react";
import useBaseUrl from '@docusaurus/useBaseUrl';

# Collect User Feedback

Capturing user feedback is critical for understanding the real-world quality of your GenAI application. MLflow's Feedback API provides a structured, standardized approach to collecting, storing, and analyzing user feedback directly within your traces.

## Adding Feedback with MLflow UI

<video src={useBaseUrl("/images/llms/tracing/logging-feedback.mp4")} controls loop autoPlay muted aria-label="Add Feedback" />

## Adding Feedback with API

To annotate traces with feedback programmatically, use the <APILink fn="mlflow.log_feedback" /> API.

```python
import mlflow
from mlflow.entities import AssessmentSource, AssessmentSourceType

mlflow.log_feedback(
    trace_id="<your trace id>",
    name="user_satisfaction",
    value=True,
    rationale="User indicated response was helpful",
    source=AssessmentSource(
        source_type=AssessmentSourceType.HUMAN, source_id="user_123"
    ),
)
```

If you have a `Feedback` object already (e.g., a response from LLM-as-a-Judge), you can log it
directly using the <APILink fn="mlflow.log_assessment" /> API. This is equivalent to using the

<APILink fn="mlflow.log_feedback" /> API with unpacked fields.

```python
import mlflow
from mlflow.genai.judges import make_judge
from typing import Literal

coherence_judge = make_judge(
    name="coherence",
    instructions=(
        "Evaluate if the response is coherent, maintaining a constant tone "
        "and following a clear flow of thoughts/concepts"
        "Trace: {{ trace }}\n"
    ),
    feedback_value_type=Literal["coherent", "somewhat coherent", "incoherent"],
    model="anthropic:/claude-opus-4-1-20250805",
)

trace = mlflow.get_trace("<your trace id>")
feedback = coherence_judge(trace=trace)

mlflow.log_assessment(trace_id="<your trace id>", assessment=feedback)
# Equivalent to log_feedback(trace_id="<trace_id>", name=feedback.name, value=feedback.value, ...)"
```

## Supported Value Types

MLflow feedback supports various formats to match your application's needs:

| Feedback Type | Description                    | Example Use Cases                   |
| ------------- | ------------------------------ | ----------------------------------- |
| **Boolean**   | Simple `True`/`False` feedback | Thumbs up/down, correct/incorrect   |
| **Numeric**   | Integer or float ratings       | 1-5 star ratings, confidence scores |
| **Text**      | Free-form text feedback        | Detailed quality breakdowns         |

## Supported Feedback Sources

The `source` field of the feedback provides information about where the feedback came from.

| Source Type   | Description           | Example Use Cases                        |
| ------------- | --------------------- | ---------------------------------------- |
| **HUMAN**     | Human feedback        | User thumbs up/down, correct/incorrect   |
| **LLM_JUDGE** | LLM-based feedback    | Score traces with an LLM-based judge     |
| **CODE**      | Programmatic feedback | Score traces with a programmatic checker |

## Next Steps

<TilesGrid>
  <TileCard
    icon={Target}
    iconSize={48}
    title="Feedback Concepts"
    description="Deep dive into feedback architecture, schema, and best practices"
    href="/genai/concepts/feedback"
    linkText="Learn concepts →"
    containerHeight={64}
  />
  <TileCard
    icon={Search}
    iconSize={48}
    title="Search and Analyze Traces"
    description="Query traces with feedback data and analyze patterns for quality insights"
    href="/genai/tracing/search-traces"
    linkText="Start analyzing →"
    containerHeight={64}
  />
  <TileCard
    icon={BarChart3}
    iconSize={48}
    title="Evaluate Traces"
    description="Learn how to evaluate traces with feedback data and analyze patterns for quality insights"
    href="/genai/eval-monitor"
    linkText="Start evaluating →"
    containerHeight={64}
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

````
