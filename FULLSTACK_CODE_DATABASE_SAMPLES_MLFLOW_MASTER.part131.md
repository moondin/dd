---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 131
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 131 of 991)

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

---[FILE: contribute.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/contribute.mdx

```text
---
sidebar_position: 100
sidebar_label: Add New Integration
---

import { APILink } from "@site/src/components/APILink";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Contributing to MLflow Tracing

Welcome to the MLflow Tracing contribution guide! This step-by-step resource will assist you in implementing additional GenAI library integrations for tracing into MLflow.

:::tip
If you have any questions during the process, try the **"Ask AI"** feature in the bottom-right corner. It can provide both reference documentation and quick answers to common questions about MLflow.
:::

## Step 1. Set up Your Environment

Set up a dev environment following the [CONTRIBUTING.md](https://github.com/mlflow/mlflow/blob/master/CONTRIBUTING.md). After setup,
verify the environment is ready for tracing development by running the unit tests with the `pytest tests/tracing` command and ensure that all tests pass.

## Step 2. Familiarize Yourself with MLflow Tracing

First, get a solid understanding of what MLflow Tracing does and how it works. Check out these docs to get up to speed:

- [Tracing Concepts](/genai/concepts/trace) - Understand what tracing is and the specific benefits for MLflow users.
- [MLflow Tracing API Guide](/genai/tracing/app-instrumentation/automatic) - Practical guide to auto-instrumentation and APIs for manually creating traces.

📝 **Quick Quiz**: Before moving on to the next step, let's challenge your understanding with a few questions.
If you are not sure about the answers, revisit the docs for a quick refresh.

<div class="quiz">
    <details>
        <summary>Q. What is the difference between a Trace and a Span?</summary>
        <p>A. Trace is the main object holding multiple Spans, with each Span capturing different parts of an operation. A Trace has metadata (TraceInfo) and a list of Spans (TraceData).\
        <em>Reference:</em> [Tracing Concepts](/genai/concepts/trace)</p>
    </details>

    <details>
        <summary>Q. What is the easiest way to create a span for a function call?</summary>
        <p>A. Use the `@mlflow.trace` decorator to capture inputs, outputs, and execution duration automatically.\
          <em>Reference:</em> [MLflow Tracing API Guide](/genai/tracing/app-instrumentation/manual-tracing)</p>
    </details>

    <details>
        <summary>Q. How do you log input data to a span?</summary>
        <p>A. You can log input data with the `span.set_inputs()` method for a span object returned by the ``mlflow.start_span`` context manager or Client APIs.\
        <em>Reference:</em> [Tracing Concepts](/genai/concepts/trace)</p>
    </details>

    <details>
        <summary>Q. Where is exception information stored in a Trace?</summary>
        <p>A. Exceptions are recorded in the `events` attribute of the span, including details such as exception type, message, and stack trace.\
        <em>Reference:</em> [MLflow Tracing API Guide](/genai/tracing/app-instrumentation/manual-tracing)</p>

  </details>
</div>

## Step 3. Understand the Integration Library

From a tracing perspective, GenAI libraries can be categorized into two types:

**🧠 LLM Providers or Wrappers**

Libraries like **OpenAI**, **Anthropic**, **Ollama**, and **LiteLLM** focus on providing access to LLMs. These libraries often have simple client SDKs, therefore, we often simply use ad-hoc patching to trace those APIs.

For this type of library, start with listing up the core APIs to instrument. For example, in Anthropic auto-tracing, we patch the `create()` method of the `Messages` class.
If the library has multiple APIs (e.g., embeddings, transcription) and you're not sure which ones to support, consult with the maintainers.
Refer to the [Anthropic auto-tracing implementation](https://github.com/mlflow/mlflow/blob/master/mlflow/anthropic/autolog.py) as an example.

**⚙️ Orchestration Frameworks**

Libraries such as **LangChain**, **LlamaIndex**, and **DSPy** offer higher-level workflows, integrating LLMs, embeddings, retrievers, and tools into complex applications.
Since these libraries require trace data from multiple components, we do not want to rely on ad-hoc patching. Therefore, auto-tracing for these libraries often leverage available callbacks
(e.g., [LangChain Callbacks](https://python.langchain.com/docs/how_to#callbacks)) for more reliable integration.

For this type of library, first check if the library provides any callback mechanism you can make use of. If there isn't, consider filing a feature request to the library to have this functionality added by the project maintainers,
providing comprehensive justification for the request. Having a callback mechanism also benefits the other users of the library, by providing flexibility and allowing integration with many other tools.
If there is a certain reason the library cannot provide callbacks, consult with the MLflow maintainers. We will not likely proceed with a design that relies on ad-hoc patching, but we can discuss alternative approaches if there are any to be had.

## Step 4. Write a Design Document

Draft a design document for your integration plan, using the [design template](https://docs.google.com/document/d/1AQGgJk-hTkUo0lTkGqCGQOMelQmz05kQz_OA4bJWaJE/edit#heading=h.4cz970y1mk93). Here are some important considerations:

- **Integration Method**: Describe whether you'll use callbacks, API hooks, or patching. If there are multiple methods, list them as options and explain your choice.
- **Maintainability**: LLM frameworks evolve quickly, so avoid relying on internal methods as much as possible. Prefer public APIs such as callbacks.
- **Standardization**: Ensure consistency with other MLflow integrations for usability and downstream tasks. For example, retrieval spans should follow the [Retriever Schema](/genai/concepts/span#retriever-spans) for UI compatibility.

Include a brief overview of the library's core functionality and use cases to provide context for reviewers. Once the draft is ready, share your design with MLflow maintainers, and if time allows, create a proof of concept to highlight potential challenges early.

## Step 5. Begin Implementation

<Tabs>
  <TabItem value="python" label="Python" default>

With the design approved, start implementation:

1. **Create a New Module**: If the library isn't already integrated with MLflow, create a new directory under `mlflow/` (e.g., `mlflow/llama_index`). Add an `__init__.py` file to initialize the module.
2. **Develop the Tracing Hook**: Implement your chosen method (patch, callback, or decorator) for tracing. If you go with patching approach, use the `safe_patch` function to ensure stable patching (see [example](https://github.com/mlflow/mlflow/blob/master/mlflow/anthropic/__init__.py)).
3. **Define `mlflow.xxx.autolog() function`**: This function will be the main entry point for the integration, which enables tracing when called (e.g., <APILink fn="mlflow.llama_index.autolog" />).
4. **Write Tests**: Cover edge cases like asynchronous calls, custom data types, and streaming outputs if the library supports them.

:::warning attention
There are a few gotchas to watch out for when integrating with MLflow Tracing:

- **Error Handling**: Ensure exceptions are captured and logged to spans with type, message, and stack trace.
- **Streaming Outputs**: For streaming (iterators), hook into the iterator to assemble and log the full output to the span. Directly logging the iterator object is not only unhelpful but also cause unexpected behavior e.g. exhaust the iterator during serialization.
- **Serialization**: MLflow serializes traces to JSON via the custom `TraceJsonEncoder` implementation, which supports common objects and Pydantic models. If your library uses custom objects, consider extending the serializer, as unsupported types are stringified and may lose useful detail.
- **Timestamp Handling**: When using timestamps provided by the library, validate the unit and timezone. MLflow requires timestamps in _nanoseconds since the UNIX epoch_; incorrect timestamps will disrupt span duration.
  :::

</TabItem>
<TabItem value="typescript" label="TypeScript">

The MLflow TypeScript tracing SDK lives under the [`libs/typescript`](https://github.com/mlflow/mlflow/tree/master/libs/typescript) npm workspace. When implementing a new integration:

1. **Create a Workspace Package**: Scaffold `libs/typescript/integrations/<provider>` using the [OpenAI integration](https://github.com/mlflow/mlflow/tree/master/libs/typescript/integrations/openai) as a template, including `package.json`, `tsconfig.json`, and optional docs.
2. **Expose Instrumentation Helpers**: Implement the tracing entry points in `src/`—for example, a `traced<Client>()` wrapper or `register()` function that wires the integration into `mlflow-tracing`.
3. **Document and Test**: Add README snippets or inline docs plus unit/integration tests under `tests/` so reviewers can validate the new instrumentation.
4. **Update Workspace Scripts**: Extend the root [`package.json`](https://github.com/mlflow/mlflow/blob/master/libs/typescript/package.json) `build:integrations` or `test:integrations` commands if the new package needs custom build or test steps.

After coding, build and exercise the workspace locally to make sure artifacts in `dist/` are up to date:

```bash
cd libs/typescript
npm install
npm run build
npm run test
```

:::warning attention

- **Trace Shape**: Align span names, attributes, and metadata with the Python integrations so downstream UI components interpret traces correctly.
- **Streaming & Async Workloads**: Buffer streaming responses or async iterators before logging outputs so they remain consumable by the caller.
- **Serializable Payloads**: Convert complex SDK objects to JSON-serializable structures before handing them to the MLflow client.
  :::

</TabItem>
</Tabs>

## Step 6. Test the Integration

Once implementation is complete, run end-to-end tests in a notebook to verify functionality. Ensure:

◻︎ Traces appear correctly in the MLflow Experiment.

◻︎ Traces are properly rendered in the MLflow UI.

◻︎ Errors from MLflow trace creation should not interrupt the original execution of the library.

◻︎ Edge cases such as asynchronous and streaming calls function as expected.

In addition to the local test, there are a few Databricks services that are integrated with MLflow Tracing. Consult with an MLflow maintainer for guidance on how to test those integrations.

When you are confident that the implementation works correctly, open a PR with the test result pasted in the PR description.

## Step 7. Document the Integration

Documentation is a prerequisite for release. Follow these steps to complete the documentation:

1. Add the integrated library icon and example in the [main Tracing documentation](/genai/tracing/integrations).
2. If the library is already present in an existing MLflow model flavor, add a Tracing section in the flavor documentation.
3. Add a notebook tutorial to demonstrate the integration.

Documentation sources are located in the `docs/` folder. Refer to [Writing Docs](https://github.com/mlflow/mlflow/blob/master/CONTRIBUTING.md#writing-docs) for more details on how to build and preview the documentation.

## Step 8. Release🚀

Congratulations! Now you've completed the journey of adding a new tracing integration to MLflow. The release notes will feature your name, and we will write an SNS or/and a blog post to highlight your contribution.

Thank you so much for helping improve MLflow Tracing, and we look forward to working with you again!😊

## Contact

If you have any questions or need help, feel free to reach out to the maintainers (POC: @B-Step62, @BenWilson2) for further guidance.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/index.mdx

```text
# Auto Tracing Integrations

MLflow Tracing is integrated with 20+ popular Generative AI libraries and frameworks, offering **one-line automatic tracing** experience. This allows you to gain immediate observability into your GenAI applications with minimal setup.

MLflow's automatic tracing provides:

- **Zero code changes** for basic observability
- **Unified traces** across multi-framework apps
- **Rich metadata** including inputs, outputs, and performance
- **Production-ready** scaling and monitoring

Click any integration below to get started with detailed setup instructions.

import TracingIntegrations from "@site/src/components/TracingIntegrations";

<TracingIntegrations cardGroupProps={{ isSmall: true }} categorized={true} />
<br />

:::info Missing an Integration?
Is your favorite library missing? Consider [contributing](/genai/tracing/integrations/contribute) or [submitting a feature request](https://github.com/mlflow/mlflow/issues/new?assignees=&labels=enhancement&projects=&template=feature_request_template.yaml&title=%5BFR%5D).
:::
```

--------------------------------------------------------------------------------

---[FILE: ag2.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/ag2.mdx

```text
---
sidebar_position: 6
sidebar_label: AG2
---

import { APILink } from "@site/src/components/APILink";

# Tracing AG2🤖

![AG2 Tracing via autolog](/images/llms/ag2/ag2-trace.png)

[AG2](https://ag2.ai/) is an open-source framework for building and orchestrating AI agent interactions.

[MLflow Tracing](../../) provides automatic tracing capability for AG2, an open-source multi-agent framework. By enabling auto tracing
for AG2 by calling the <APILink fn="mlflow.ag2.autolog" /> function, MLflow will capture nested traces and logged them to the active MLflow Experiment upon agents execution.
Note that since AG2 is built based on [AutoGen 0.2](https://microsoft.github.io/autogen/0.2/), this integration can be used when you use AutoGen 0.2.

```python
import mlflow

mlflow.ag2.autolog()
```

MLflow captures the following information about the multi-agent execution:

- Which agent is called at different turns
- Messages passed between agents
- LLM and tool calls made by each agent, organized per an agent and a turn
- Latencies
- Any exception if raised

### Basic Example

```python
import os
from typing import Annotated, Literal

from autogen import ConversableAgent

import mlflow

# Turn on auto tracing for AG2
mlflow.ag2.autolog()

# Optional: Set a tracking URI and an experiment
mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("AG2")


# Define a simple multi-agent workflow using AG2
config_list = [
    {
        "model": "gpt-4o-mini",
        # Please set your OpenAI API Key to the OPENAI_API_KEY env var before running this example
        "api_key": os.environ.get("OPENAI_API_KEY"),
    }
]

Operator = Literal["+", "-", "*", "/"]


def calculator(a: int, b: int, operator: Annotated[Operator, "operator"]) -> int:
    if operator == "+":
        return a + b
    elif operator == "-":
        return a - b
    elif operator == "*":
        return a * b
    elif operator == "/":
        return int(a / b)
    else:
        raise ValueError("Invalid operator")


# First define the assistant agent that suggests tool calls.
assistant = ConversableAgent(
    name="Assistant",
    system_message="You are a helpful AI assistant. "
    "You can help with simple calculations. "
    "Return 'TERMINATE' when the task is done.",
    llm_config={"config_list": config_list},
)

# The user proxy agent is used for interacting with the assistant agent
# and executes tool calls.
user_proxy = ConversableAgent(
    name="Tool Agent",
    llm_config=False,
    is_termination_msg=lambda msg: msg.get("content") is not None
    and "TERMINATE" in msg["content"],
    human_input_mode="NEVER",
)

# Register the tool signature with the assistant agent.
assistant.register_for_llm(name="calculator", description="A simple calculator")(
    calculator
)
user_proxy.register_for_execution(name="calculator")(calculator)
response = user_proxy.initiate_chat(
    assistant, message="What is (44231 + 13312 / (230 - 20)) * 4?"
)
```

## Token usage

MLflow >= 3.2.0 supports token usage tracking for AG2. The token usage for each LLM call will be logged in the `mlflow.chat.tokenUsage` attribute. The total token usage throughout the trace will be
available in the `token_usage` field of the trace info object.

```python
import json
import mlflow

mlflow.ag2.autolog()

# Register and run the tool signature with the assistant agent which is defined in above section.
assistant.register_for_llm(name="calculator", description="A simple calculator")(
    calculator
)
user_proxy.register_for_execution(name="calculator")(calculator)
response = user_proxy.initiate_chat(
    assistant, message="What is (44231 + 13312 / (230 - 20)) * 4?"
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
  Input tokens: 1569
  Output tokens: 229
  Total tokens: 1798

== Detailed usage for each LLM call: ==
chat_completion_1:
  Input tokens: 110
  Output tokens: 61
  Total tokens: 171
chat_completion_2:
  Input tokens: 191
  Output tokens: 61
  Total tokens: 252
chat_completion_3:
  Input tokens: 269
  Output tokens: 24
  Total tokens: 293
chat_completion_4:
  Input tokens: 302
  Output tokens: 23
  Total tokens: 325
chat_completion_5:
  Input tokens: 333
  Output tokens: 22
  Total tokens: 355
chat_completion_6:
  Input tokens: 364
  Output tokens: 38
  Total tokens: 402
```

### Disable auto-tracing

Auto tracing for AG2 can be disabled globally by calling `mlflow.ag2.autolog(disable=True)` or `mlflow.autolog(disable=True)`.
```

--------------------------------------------------------------------------------

---[FILE: agno.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/agno.mdx

```text
---
sidebar_position: 8
sidebar_label: Agno
---

import { APILink } from "@site/src/components/APILink";
import ImageBox from "@site/src/components/ImageBox";

# Tracing Agno

<ImageBox src="/images/llms/agno/agno-tracing-basic.png" alt="Agno Tracing via autolog" />

[Agno](https://github.com/agno-agi/agno) is a flexible agent framework for orchestrating LLMs, reasoning steps, tools, and memory into a unified pipeline.

[MLflow Tracing](../../) provides automatic tracing capability for Agno. By enabling auto tracing
for Agno by calling the <APILink fn="mlflow.agno.autolog" /> function, MLflow will capture traces for Agent invocation and log them to the active MLflow Experiment.

```python
import mlflow

mlflow.agno.autolog()
```

MLflow trace automatically captures the following information about Agentic calls:

- Prompts and completion responses
- Latencies
- Metadata about the different Agents, such as function names
- Token usages and cost
- Cache hit
- Any exception if raised

### Basic Example

Install the dependencies for the example:

```bash
pip install 'mlflow>=3.3' agno anthropic yfinance
```

Run a simple agent with `mlflow.agno.autolog()` enabled:

```python
from agno.agent import Agent
from agno.models.anthropic import Claude
from agno.tools.yfinance import YFinanceTools

agent = Agent(
    model=Claude(id="claude-sonnet-4-20250514"),
    tools=[YFinanceTools(stock_price=True)],
    instructions="Use tables to display data. Don't include any other text.",
    markdown=True,
)
agent.print_response("What is the stock price of Apple?", stream=False)
```

## Multi Agentic(Agents to Agents) Interaction

MLflow now makes it easier to track how multiple AI agents work together when using Agno API's non-streaming endpoints. It automatically
records every handoff between agents, the messages they exchange, and details about any functions or tools they use—like what went in, what
came out, and how long it took. This gives you a complete picture of the process, making it simpler to troubleshoot issues, measure performance,
and repeat results.

### Multi-agent Example

```python
import mlflow

from agno.agent import Agent
from agno.models.anthropic import Claude
from agno.models.openai import OpenAIChat
from agno.team.team import Team
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.tools.reasoning import ReasoningTools
from agno.tools.yfinance import YFinanceTools

# Enable auto tracing for Agno
mlflow.agno.autolog()


web_agent = Agent(
    name="Web Search Agent",
    role="Handle web search requests and general research",
    model=OpenAIChat(id="gpt-4.1"),
    tools=[DuckDuckGoTools()],
    instructions="Always include sources",
    add_datetime_to_instructions=True,
)

finance_agent = Agent(
    name="Finance Agent",
    role="Handle financial data requests and market analysis",
    model=OpenAIChat(id="gpt-4.1"),
    tools=[
        YFinanceTools(
            stock_price=True,
            stock_fundamentals=True,
            analyst_recommendations=True,
            company_info=True,
        )
    ],
    instructions=[
        "Use tables to display stock prices, fundamentals (P/E, Market Cap), and recommendations.",
        "Clearly state the company name and ticker symbol.",
        "Focus on delivering actionable financial insights.",
    ],
    add_datetime_to_instructions=True,
)

reasoning_finance_team = Team(
    name="Reasoning Finance Team",
    mode="coordinate",
    model=Claude(id="claude-sonnet-4-20250514"),
    members=[web_agent, finance_agent],
    tools=[ReasoningTools(add_instructions=True)],
    instructions=[
        "Collaborate to provide comprehensive financial and investment insights",
        "Consider both fundamental analysis and market sentiment",
        "Use tables and charts to display data clearly and professionally",
        "Present findings in a structured, easy-to-follow format",
        "Only output the final consolidated analysis, not individual agent responses",
    ],
    markdown=True,
    show_members_responses=True,
    enable_agentic_context=True,
    add_datetime_to_instructions=True,
    success_criteria="The team has provided a complete financial analysis with data, visualizations, risk assessment, and actionable investment recommendations supported by quantitative analysis and market research.",
)

reasoning_finance_team.print_response(
    """Compare the tech sector giants (AAPL, GOOGL, MSFT) performance:
    1. Get financial data for all three companies
    2. Analyze recent news affecting the tech sector
    3. Calculate comparative metrics and correlations
    4. Recommend portfolio allocation weights""",
    show_full_reasoning=True,
)
```

<ImageBox src="/images/llms/agno/agno-tracing.png" alt="Agno Tracing via autolog" />

## Token usage

MLflow >= 3.3.0 supports token usage tracking for Agno. The token usage for each Agent call will be logged in the `mlflow.chat.tokenUsage` attribute. The total token usage throughout the trace will be
available in the `token_usage` field of the trace info object.

```python
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
  Input tokens: 45710
  Output tokens: 3844
  Total tokens: 49554

== Detailed usage for each LLM call: ==
Team.run:
  Input tokens: 45710
  Output tokens: 3844
  Total tokens: 49554

... (other modules)
```

### Disable auto-tracing

Auto tracing for LiteLLM can be disabled globally by calling `mlflow.agno.autolog(disable=True)` or `mlflow.autolog(disable=True)`.
```

--------------------------------------------------------------------------------

---[FILE: anthropic.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/integrations/listing/anthropic.mdx

```text
---
sidebar_position: 8
sidebar_label: Anthropic
---

import { APILink } from "@site/src/components/APILink";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import TabsWrapper from "@site/src/components/TabsWrapper";

# Tracing Anthropic

![Anthropic Tracing via autolog](/images/llms/anthropic/anthropic-tracing.png)

[MLflow Tracing](/genai/tracing) provides automatic tracing capability for Anthropic LLMs. By enabling auto tracing
for Anthropic by calling the <APILink fn="mlflow.anthropic.autolog" /> function, MLflow will capture nested traces and log them to the active MLflow Experiment upon invocation of Anthropic Python SDK. In Typescript, you can instead use the `tracedAnthropic` function to wrap the Anthropic client.

<TabsWrapper>
<Tabs>
  <TabItem value="python" label="Python" default>
    ```python
    import mlflow

    mlflow.anthropic.autolog()
    ```

</TabItem>
<TabItem value="typescript" label="JS / TS">
    ```typescript
    import Anthropic from "@anthropic-ai/sdk";
    import { tracedAnthropic } from "mlflow-anthropic";

    const client = tracedAnthropic(new Anthropic());
    ```

</TabItem>
</Tabs>
</TabsWrapper>

MLflow trace automatically captures the following information about Anthropic calls:

- Prompts and completion responses
- Latencies
- Model name
- Additional metadata such as `temperature`, `max_tokens`, if specified.
- Function calling if returned in the response
- Token usage information
- Any exception if raised

## Supported APIs

MLflow supports automatic tracing for the following Anthropic APIs:

### Python

| Chat Completion | Function Calling | Streaming |  Async   | Image | Batch |
| :-------------: | :--------------: | :-------: | :------: | :---: | :---: |
|       ✅        |        ✅        |     -     | ✅ (\*1) |   -   |   -   |

<div style={{ fontSize: '0.9em', marginTop: '10px' }}>

(\*1) Async support was added in MLflow 2.21.0.

</div>

### TypeScript / JavaScript

| Chat Completion | Function Calling | Streaming | Async |
| :-------------: | :--------------: | :-------: | :---: |
|       ✅        |     ✅ (\*2)     |     -     |  ✅   |

<div style={{ fontSize: '0.9em', marginTop: '10px' }}>

(\*2) Function calls in responses are captured and can be rendered in the MLflow UI. The TypeScript SDK is natively async.

</div>

To request support for additional APIs, please open a [feature request](https://github.com/mlflow/mlflow/issues) on GitHub.

## Basic Example

<Tabs>
  <TabItem value="python" label="Python" default>
    ```python
    import anthropic
    import mlflow

    # Enable auto-tracing for Anthropic
    mlflow.anthropic.autolog()

    # Optional: Set a tracking URI and an experiment
    mlflow.set_tracking_uri("http://localhost:5000")
    mlflow.set_experiment("Anthropic")

    # Configure your API key.
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    # Use the create method to create new message.
    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        messages=[
            {"role": "user", "content": "Hello, Claude"},
        ],
    )
    ```

  </TabItem>
  <TabItem value="typescript" label="JS / TS">
    ```typescript
    import Anthropic from "@anthropic-ai/sdk";
    import { tracedAnthropic } from "mlflow-anthropic";

    // Wrap the Anthropic client with the tracedAnthropic function
    const client = tracedAnthropic(new Anthropic());

    // Invoke the client as usual
    const message = await client.messages.create({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 1024,
        messages: [
            {"role": "user", "content": "Hello, Claude"},
        ],
    });
    ```

  </TabItem>
</Tabs>

## Async

MLflow Tracing has supported the asynchronous API of the Anthropic SDK since MLflow 2.21.0. Its usage is the same as the synchronous API.

<Tabs>
  <TabItem value="python" label="Python" default>
    ```python
    import anthropic

    # Enable trace logging
    mlflow.anthropic.autolog()

    client = anthropic.AsyncAnthropic()

    response = await client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        messages=[
            {"role": "user", "content": "Hello, Claude"},
        ],
    )
    ```

  </TabItem>
  <TabItem value="typescript" label="JS / TS">
    Anthropic Typescript / Javascript SDK is natively async. See the basic example above.
  </TabItem>
</Tabs>

## Advanced Example: Tool Calling Agent

MLflow Tracing automatically captures tool calling response from Anthropic models. The function instruction in the response will be highlighted in the trace UI. Moreover, you can annotate the tool function with the `@mlflow.trace` decorator to create a span for the tool execution.

![Anthropic Tool Calling Trace](/images/llms/anthropic/anthropic-tool-calling.png)

The following example implements a simple function calling agent using Anthropic Tool Calling and MLflow Tracing for Anthropic. The example further uses the asynchronous Anthropic SDK so that the agent can handle concurrent invocations without blocking.

```python
import json
import anthropic
import mlflow
import asyncio
from mlflow.entities import SpanType

client = anthropic.AsyncAnthropic()
model_name = "claude-3-5-sonnet-20241022"


# Define the tool function. Decorate it with `@mlflow.trace` to create a span for its execution.
@mlflow.trace(span_type=SpanType.TOOL)
async def get_weather(city: str) -> str:
    if city == "Tokyo":
        return "sunny"
    elif city == "Paris":
        return "rainy"
    return "unknown"


tools = [
    {
        "name": "get_weather",
        "description": "Returns the weather condition of a given city.",
        "input_schema": {
            "type": "object",
            "properties": {"city": {"type": "string"}},
            "required": ["city"],
        },
    }
]

_tool_functions = {"get_weather": get_weather}


# Define a simple tool calling agent
@mlflow.trace(span_type=SpanType.AGENT)
async def run_tool_agent(question: str):
    messages = [{"role": "user", "content": question}]

    # Invoke the model with the given question and available tools
    ai_msg = await client.messages.create(
        model=model_name,
        messages=messages,
        tools=tools,
        max_tokens=2048,
    )
    messages.append({"role": "assistant", "content": ai_msg.content})

    # If the model requests tool call(s), invoke the function with the specified arguments
    tool_calls = [c for c in ai_msg.content if c.type == "tool_use"]
    for tool_call in tool_calls:
        if tool_func := _tool_functions.get(tool_call.name):
            tool_result = await tool_func(**tool_call.input)
        else:
            raise RuntimeError("An invalid tool is returned from the assistant!")

        messages.append(
            {
                "role": "user",
                "content": [
                    {
                        "type": "tool_result",
                        "tool_use_id": tool_call.id,
                        "content": tool_result,
                    }
                ],
            }
        )

    # Send the tool results to the model and get a new response
    response = await client.messages.create(
        model=model_name,
        messages=messages,
        max_tokens=2048,
    )

    return response.content[-1].text


# Run the tool calling agent
cities = ["Tokyo", "Paris", "Sydney"]
questions = [f"What's the weather like in {city} today?" for city in cities]
answers = await asyncio.gather(*(run_tool_agent(q) for q in questions))

for city, answer in zip(cities, answers):
    print(f"{city}: {answer}")
```

## Token usage

MLflow >= 3.2.0 supports token usage tracking for Anthropic. The token usage for each LLM call will be logged in the `mlflow.chat.tokenUsage` attribute. The total token usage throughout the trace will be
available in the `token_usage` field of the trace info object.

<Tabs>
  <TabItem value="python" label="Python" default>

```python
import json
import mlflow

mlflow.anthropic.autolog()

client = anthropic.Anthropic()
message = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello"}],
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

  </TabItem>
  <TabItem value="typescript" label="JS / TS">

```typescript
import * as mlflow from "mlflow-tracing";

// After your Anthropic call completes, flush and fetch the trace
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
  Input tokens: 8
  Output tokens: 12
  Total tokens: 20

== Detailed usage for each LLM call: ==
Messages.create:
  Input tokens: 8
  Output tokens: 12
  Total tokens: 20
```

### Supported APIs:

Token usage tracking is supported for the following Anthropic APIs:

| Chat Completion | Function Calling | Streaming |  Async   | Image | Batch |
| :-------------: | :--------------: | :-------: | :------: | :---: | :---: |
|       ✅        |        ✅        |     -     | ✅ (\*1) |   -   |   -   |

<div style={{ fontSize: '0.9em', marginTop: '10px' }}>

(\*1) Async support was added in MLflow 2.21.0.

</div>

## Disable auto-tracing

Auto tracing for Anthropic can be disabled globally by calling `mlflow.anthropic.autolog(disable=True)` or `mlflow.autolog(disable=True)`.
```

--------------------------------------------------------------------------------

````
