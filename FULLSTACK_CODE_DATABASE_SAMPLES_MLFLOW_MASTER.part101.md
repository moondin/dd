---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 101
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 101 of 991)

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

---[FILE: ai-issue-discovery.mdx]---
Location: mlflow-master/docs/docs/genai/eval-monitor/ai-insights/ai-issue-discovery.mdx

```text
import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"
import TabsWrapper from "@site/src/components/TabsWrapper";
import FeatureHighlights from "@site/src/components/FeatureHighlights";
import DAGLoop from "@site/src/components/DAGLoop";
import ConceptOverview from "@site/src/components/ConceptOverview";
import ImageBox from "@site/src/components/ImageBox";
import { Target, BarChart3, Bot, AlertTriangle, ThumbsUp, LineChart, GitBranch, Search, Lightbulb, FileText } from "lucide-react";

# AI Issue Discovery

Automatically analyze traces in your MLflow experiments to find operational issues, quality problems, and performance patterns. The Analyze Experiment tool uses hypothesis-driven analysis to systematically examine your GenAI application's behavior, identify the most important problems, and create a plan for addressing them in the form of a comprehensive markdown report.

## Overview

The Analyze Experiment command examines traces logged in an MLflow experiment to automatically discover:

<FeatureHighlights features={[
  {
    icon: AlertTriangle,
    title: "Operational Issues",
    description: "Detect errors, timeouts, rate limiting, authentication failures, and performance bottlenecks"
  },
  {
    icon: Target,
    title: "Quality Issues",
    description: "Identify overly verbose responses, inconsistent outputs, repetitive content, and inappropriate response formats"
  },
  {
    icon: ThumbsUp,
    title: "Success Patterns",
    description: "Discover what's working well, effective tool usage, and high-quality interactions"
  },
  {
    icon: LineChart,
    title: "Performance Metrics",
    description: "Analyze latency distributions, success rates, and error patterns"
  }
]} />

The tool generates a detailed markdown report with specific trace examples, quantitative evidence, and actionable recommendations for improvement.

## Usage

The Analyze Experiment functionality is available through two methods:

<TabsWrapper>
<Tabs>
<TabItem value="mcp" label="MCP" default>

### Using MCP

If you have MLflow's MCP server configured, you can simply run:

```
/analyze-experiment
```

### Prerequisites

- MLflow MCP server (see [MCP setup guide](/genai/mcp/))
- A coding agent with MCP support (e.g., Claude Code, Cursor, Windsurf, etc.) configured to connect to MLflow MCP server
- MLflow experiment with logged traces

</TabItem>
<TabItem value="cli" label="CLI">

### Using CLI

Run the analyze experiment command directly:

```bash
mlflow ai-commands run genai/analyze_experiment
```

**Note**: This command must be run inside a coding agent with MCP support. The agent will interactively guide you through the analysis process.

### Prerequisites

- A coding agent with MCP support (e.g., Claude Code, Cursor, Windsurf, etc.)
- MLflow 3.4 or later: `pip install mlflow>=3.4`
- Access to MLflow tracking server with logged traces

</TabItem>
</Tabs>
</TabsWrapper>

## Analysis Workflow

<DAGLoop
  title="Analyze Experiment Workflow"
  circleSize={450}
  steps={[
    {
      icon: GitBranch,
      title: "Setup & Authentication",
      description: "Configure MLflow connection",
      detailedDescription: "Connect to your MLflow tracking server (Databricks, local, or cloud) with appropriate credentials"
    },
    {
      icon: Search,
      title: "Select Experiment",
      description: "Choose experiment to analyze",
      detailedDescription: "Browse and select the experiment containing traces you want to analyze for issues"
    },
    {
      icon: Bot,
      title: "Identify Agent Purpose",
      description: "Understand agent capabilities",
      detailedDescription: "Automatically detect what your agent does, its tools, and data sources from trace patterns"
    },
    {
      icon: Lightbulb,
      title: "Analyze Issues",
      description: "Test hypotheses systematically",
      detailedDescription: "Systematically analyze operational and quality issues through hypothesis-driven testing"
    },
    {
      icon: FileText,
      title: "Generate Report",
      description: "Create actionable insights",
      detailedDescription: "Produce comprehensive markdown report with issues, recommendations, and improvement plans"
    }
  ]}
/>

### 1. Setup and Authentication

The tool will ask you to configure authentication:

- **Databricks**: Provide workspace URL and personal access token, or use a Databricks CLI profile
- **Local MLflow**: Specify tracking URI (SQLite, PostgreSQL, MySQL, or file store)
- **Environment Variables**: Use pre-configured MLflow environment variables like `MLFLOW_TRACKING_URI` (see [environment setup guide](/genai/getting-started/connect-environment))

<ImageBox src="/images/genai/ai-issue-discovery/setup-authentication.png" alt="Setup and Authentication" width="90%"/>

### 2. Experiment Selection

- Browse available experiments or search by name
- Select the experiment containing traces to analyze
- Verify trace availability and data structure

<ImageBox src="/images/genai/ai-issue-discovery/experiment-selection.png" alt="Experiment Selection" width="90%"/>

### 3. Agent Purpose Identification

The tool examines trace inputs and outputs to understand:

- What your agent's job is (e.g., "a customer service agent that helps users with billing questions")
- What data sources and tools the agent has access to
- Common patterns in user interactions

You'll be asked to confirm or correct this understanding before analysis continues.

<ImageBox src="/images/genai/ai-issue-discovery/agent-purpose.png" alt="Agent Purpose Identification" width="90%"/>

### 4. Hypothesis-Driven Analysis

The tool systematically tests hypotheses about potential issues:

**Operational Issues**:

- Error patterns (authentication failures, timeouts, API failures)
- Performance bottlenecks (slow tool calls, sequential vs parallel execution)
- Rate limiting and resource contention

**Quality Issues**:

- Content problems (verbosity, repetition, inconsistency)
- Response appropriateness for query types
- Context handling and conversation flow

<ImageBox src="/images/genai/ai-issue-discovery/hypothesis-analysis.png" alt="Hypothesis-Driven Analysis" width="90%"/>

### 5. Report Generation

The tool generates a comprehensive markdown report containing:

- **Summary Statistics**: Success rates, latency metrics, error distributions
- **Confirmed Issues**: Detailed analysis with specific trace examples and root causes
- **Strengths**: What's working well in your application
- **Recommendations**: Actionable improvements based on findings

<ImageBox src="/images/genai/ai-issue-discovery/report-generation.png" alt="Report Generation" width="90%"/>

## Report Content

Each generated report provides comprehensive insights into your application's behavior:

<ConceptOverview concepts={[
  {
    icon: BarChart3,
    title: "Quantitative Metrics",
    description: "Key performance indicators including total traces analyzed, success rates (OK vs ERROR), latency statistics (average, median, P95), and error rate distributions"
  },
  {
    icon: Target,
    title: "Issue Analysis",
    description: "Detailed breakdown of confirmed issues with problem statements, trace examples with inputs/outputs, root cause analysis, frequency assessment, and specific trace IDs for investigation"
  },
  {
    icon: Lightbulb,
    title: "Actionable Recommendations",
    description: "Prioritized improvement suggestions with implementation guidance and expected impact of changes to help you systematically address identified problems"
  }
]} />
```

--------------------------------------------------------------------------------

---[FILE: agents.mdx]---
Location: mlflow-master/docs/docs/genai/eval-monitor/running-evaluation/agents.mdx

```text
import { APILink } from "@site/src/components/APILink";
import ImageBox from '@site/src/components/ImageBox';
import WorkflowSteps from '@site/src/components/WorkflowSteps';
import TilesGrid from '@site/src/components/TilesGrid';
import TileCard from '@site/src/components/TileCard';
import { Bot, Database, Target, Play, Code, Activity, MessageSquare } from 'lucide-react';
import ServerSetup from "@site/src/content/setup_server.mdx";

# Evaluating Agents

AI Agents are an emerging pattern of GenAI applications that can use tools, make decisions, and execute multi-step workflows. However, evaluating the performance of those complex agents is challenging. MLflow provides a powerful toolkit to systematically evaluate the agent behavior precisely using traces and scorers.

<ImageBox src="/images/mlflow-3/eval-monitor/agent-evaluation-hero.png" alt="Agent Evaluation" width="95%"/>

## Workflow

<WorkflowSteps
  steps={[
    {
      icon: Bot,
      title: "Build your agent",
      description: "Create an AI agent with tools, instructions, and capabilities for your specific use case."
    },
    {
      icon: Database,
      title: "Create evaluation dataset",
      description: "Design test cases with inputs and expectations for both outputs and agent behaviors like tool usage."
    },
    {
      icon: Target,
      title: "Define agent-specific scorers",
      description: "Create scorers that evaluate multi-step agent behaviors using traces."
    },
    {
      icon: Play,
      title: "Run evaluation",
      description: "Execute the evaluation and analyze both final outputs and intermediate agent behaviors in MLflow UI."
    }
  ]}
/>

## Example: Evaluating a Tool-Calling Agent

### Prerequisites

First, install the required packages by running the following command:

```bash
pip install --upgrade mlflow>=3.3 openai
```

MLflow stores evaluation results in a tracking server. Connect your local environment to the tracking server by one of the following methods.

<ServerSetup />

### Step 1: Build an agent

Create a math agent that can use tools to answer questions. We use [OpenAI Agents](/genai/tracing/integrations/listing/openai-agent) to build the tool-calling agent in a few lines of code.

```python
from agents import Agent, Runner, function_tool


@function_tool
def add(a: float, b: float) -> float:
    """Adds two numbers."""
    return a + b


@function_tool
def multiply(a: float, b: float) -> float:
    """Multiply two numbers."""
    return a * b


@function_tool
def modular(a: int, b: int) -> int:
    """Modular arithmetic"""
    return a % b


agent = Agent(
    name="Math Agent",
    instructions=(
        "You will be given a math question. Calculate the answer using the given calculator tools. "
        "Return the final number only as an integer."
    ),
    tools=[add, multiply, modular],
)
```

Make sure you can run the agent locally.

```python
from agents import Runner

result = await Runner.run(agent, "What is 15% of 240?")
print(result.final_output)
# 36
```

Lastly, let's wrap it in a function that MLflow can call. Note that MLflow runs each prediction in a threadpool,
so using a synchronous function does not slow down the evaluation.

```python
from openai import OpenAI

# If you are using Jupyter Notebook, you need to apply nest_asyncio.
# import nest_asyncio
# nest_asyncio.apply()


def predict_fn(question: str) -> str:
    return Runner.run_sync(agent, question).final_output
```

:::tip

**Async Functions are Supported!**

If your agent library provides an async API, you can use it directly without converting to sync. MLflow automatically detects and handles async functions:

```python
async def predict_fn(question: str) -> str:
    result = await Runner.run(agent, question)
    return result.final_output


mlflow.genai.evaluate(
    data=eval_dataset, predict_fn=predict_fn, scorers=[exact_match, uses_correct_tools]
)
```

By default, async functions have a 5-minute timeout. Configure this using the `MLFLOW_GENAI_EVAL_ASYNC_TIMEOUT` environment variable:

```bash
export MLFLOW_GENAI_EVAL_ASYNC_TIMEOUT=600  # 10 minutes
```

:::

### Step 2: Create evaluation dataset

Design test cases as a list of dictionaries, each with an `inputs`, `expectations`, and an optional `tags` field. We would like to evaluate the correctness of the output, but also the tool calls used by the agent.

```python
eval_dataset = [
    {
        "inputs": {"task": "What is 15% of 240?"},
        "expectations": {"answer": 36, "tool_calls": ["multiply"]},
        "tags": {"topic": "math"},
    },
    {
        "inputs": {
            "task": "I have 8 cookies and 3 friends. How many more cookies should I buy to share equally?"
        },
        "expectations": {"answer": 1, "tool_calls": ["modular", "add"]},
        "tags": {"topic": "math"},
    },
    {
        "inputs": {
            "task": "I bought 2 shares of stock at $100 each. It's now worth $150. How much profit did I make?"
        },
        "expectations": {"answer": 100, "tool_calls": ["add", "multiply"]},
        "tags": {"topic": "math"},
    },
]
```

### Step 3: Define agent-specific scorers

Create scorers that evaluate agent-specific behaviors.

:::tip

MLflow's scorer can take the **Trace** from the agent execution. Trace is a powerful way to evaluate the agent's behavior precisely, not only the final output. For example, here we use the <APILink fn="mlflow.entities.Trace.search_spans">`Trace.search_spans`</APILink> method to extract the order of tool calls and compare it with the expected tool calls.

For more details, see the <ins>[Evaluate Traces](/genai/eval-monitor/running-evaluation/traces)</ins> guide.

:::

```python
from mlflow.entities import Feedback, SpanType, Trace
from mlflow.genai import scorer


@scorer
def exact_match(outputs, expectations) -> bool:
    return int(outputs) == expectations["answer"]


@scorer
def uses_correct_tools(trace: Trace, expectations: dict) -> Feedback:
    """Evaluate if agent used tools appropriately"""
    expected_tools = expectations["tool_calls"]

    # Parse the trace to get the actual tool calls
    tool_spans = trace.search_spans(span_type=SpanType.TOOL)
    tool_names = [span.name for span in tool_spans]

    score = "yes" if tool_names == expected_tools else "no"
    rationale = (
        "The agent used the correct tools."
        if tool_names == expected_tools
        else f"The agent used the incorrect tools: {tool_names}"
    )
    # Return a Feedback object with the score and rationale
    return Feedback(value=score, rationale=rationale)
```

### Step 4: Run the evaluation

Now we are ready to run the evaluation!

```python
results = mlflow.genai.evaluate(
    data=eval_dataset, predict_fn=predict_fn, scorers=[exact_match, uses_correct_tools]
)
```

Once the evaluation is done, open the MLflow UI in your browser and navigate to the experiment page. You should see MLflow creates a new Run and logs the evaluation results.

<ImageBox src="/images/mlflow-3/eval-monitor/agent-evaluation-result.png" alt="Agent Evaluation" width="95%"/>

It seems the agent does not call tools in the correct order for the second test case. Let's click on the row to **open the trace and inspect what happened under the hood**.

<ImageBox src="/images/mlflow-3/eval-monitor/agent-evaluation-trace.png" alt="Agent Evaluation" width="95%"/>

By looking at the trace, we can figure out the agent computes the answer in three steps (1) compute 100 _ 2 (2) compute 150 _ 2 (3) subtract the two results. However, the more effective way is (1) subtract 100 from 150 (2) multiply the result by 2. In the next version, we can update the system instruction to use tools in a more effective way.

## Configure parallelization

Running a complex agent can take a long time. MLflow by default uses background threadpool to speed up the evaluation process. You can configure the number of workers to use by setting the `MLFLOW_GENAI_EVAL_MAX_WORKERS` environment variable.

```bash
export MLFLOW_GENAI_EVAL_MAX_WORKERS=10
```

## Evaluating MLflow Models

In MLflow 2.x, you can pass the model URI directly to the `model` argument of the legacy <APILink fn="mlflow.evaluate" /> API (deprecated). The new GenAI evaluation API in MLflow **3.x** still support evaluating MLflow Models, but the workflow is slightly different.

```python
import mlflow

# Load the model **outside** the prediction function.
model = mlflow.pyfunc.load_model("models:/math_agent/1")


# Wrap the model in a function that MLflow can call.
def predict_fn(question: str) -> str:
    return model.predict(question)


# Run the evaluation as usual.
mlflow.genai.evaluate(
    data=eval_dataset, predict_fn=predict_fn, scorers=[exact_match, uses_correct_tools]
)
```

## Next steps

<TilesGrid>
  <TileCard
    icon={Code}
    iconSize={48}
    title="Customize Scorers"
    description="Build advanced evaluation criteria and metrics specifically designed for agent behaviors and tool usage patterns."
    href="/genai/eval-monitor/scorers"
    linkText="Create custom scorers →"
    containerHeight={64}
  />
  <TileCard
    icon={Activity}
    iconSize={48}
    title="Evaluate Production Traces"
    description="Analyze real agent executions in production environments to understand performance and identify improvement opportunities."
    href="/genai/eval-monitor/running-evaluation/traces"
    linkText="Analyze traces →"
    containerHeight={64}
  />
  <TileCard
    icon={MessageSquare}
    iconSize={48}
    title="Collect User Feedback"
    description="Gather human feedback on agent performance to create training data and improve evaluation accuracy."
    href="/genai/assessments/feedback"
    linkText="Start collecting →"
    containerHeight={64}
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

---[FILE: multi-turn.mdx]---
Location: mlflow-master/docs/docs/genai/eval-monitor/running-evaluation/multi-turn.mdx

```text
import { APILink } from "@site/src/components/APILink";
import ImageBox from '@site/src/components/ImageBox';
import WorkflowSteps from '@site/src/components/WorkflowSteps';
import TilesGrid from '@site/src/components/TilesGrid';
import TileCard from '@site/src/components/TileCard';
import { MessageSquare, Users, Target, Play, Code, Activity, BookOpen } from 'lucide-react';
import ServerSetup from "@site/src/content/setup_server.mdx";

# Evaluate Conversations

Conversation evaluation enables you to assess entire conversation sessions rather than individual turns. This is essential for evaluating conversational AI systems where quality emerges over multiple interactions, such as user frustration patterns, conversation completeness, or overall dialogue coherence.

:::info[Experimental Feature]
Multi-turn evaluation is experimental in MLflow 3.7.0. The API and behavior may change in future releases.
:::

## Workflow

<WorkflowSteps
  steps={[
    {
      icon: MessageSquare,
      title: "Tag traces with session IDs",
      description: "Add session metadata to your traces to group related conversation turns together."
    },
    {
      icon: Users,
      title: "Search and retrieve session traces",
      description: "Collect traces from your tracking server and MLflow will automatically group them by session."
    },
    {
      icon: Target,
      title: "Define conversation scorers",
      description: "Use built-in multi-turn scorers or create custom ones to evaluate full conversations."
    },
    {
      icon: Play,
      title: "Run evaluation",
      description: "Execute evaluation and analyze session-level metrics alongside individual turn metrics in MLflow UI."
    }
  ]}
/>

## Overview

Traditional single-turn evaluation assesses each agent response independently. However, many important qualities can only be evaluated by examining the full conversation:

- **User Frustration**: Did the user become frustrated? Was it resolved?
- **Conversation Completeness**: Were all user questions answered by the end of the conversation?
- **Dialogue Coherence**: Does the conversation flow naturally?

Multi-turn evaluation addresses these needs by grouping traces into conversation sessions and applying scorers that analyze the entire conversation history.

## Prerequisites

First, install the required packages by running the following command:

```bash
pip install --upgrade mlflow>=3.7
```

MLflow stores evaluation results in a tracking server. Connect your local environment to the tracking server by one of the following methods.

<ServerSetup />

## Quick Start

Multi-turn evaluation works by grouping traces into conversation sessions using the `mlflow.trace.session` metadata. When building your agent, you can set session IDs on traces to group them into conversations:

```python
import mlflow


@mlflow.trace
def my_chatbot(question, session_id):
    mlflow.update_current_trace(metadata={"mlflow.trace.session": session_id})
    return generate_response(question)
```

<ImageBox src="/images/genai/sessions-view-ui.png" alt="Sessions View UI" width="95%"/>

To evaluate conversations, [get traces from your experiment](/genai/tracing/search-traces/) and pass them to `mlflow.genai.evaluate`:

```python
from mlflow.genai.scorers import ConversationCompleteness, UserFrustration

# Get all traces
traces = mlflow.search_traces(
    experiment_ids=["<your-experiment-id>"],
    return_type="list",
)

# Evaluate all sessions - MLflow automatically groups by session ID
results = mlflow.genai.evaluate(
    data=traces,
    scorers=[
        ConversationCompleteness(),
        UserFrustration(),
    ],
)
```

**How it works:** MLflow automatically groups traces by their `mlflow.trace.session` metadata and sorts them chronologically by timestamp within each session. Multi-turn scorers run once per session and analyze the complete conversation history. Multi-turn assessments are logged to the first trace (chronologically) in each session. You can use the Sessions tab to view session-level metrics for the entire conversation as well as trace-level metrics for individual turns.

## Multi-Turn Scorers

### Built-in Scorers

MLflow provides built-in scorers for evaluating conversations:

- **<APILink fn="mlflow.genai.scorers.ConversationCompleteness">ConversationCompleteness</APILink>**: Evaluates whether the agent addressed all user questions throughout the conversation (returns "complete" or "incomplete")
- **<APILink fn="mlflow.genai.scorers.KnowledgeRetention">KnowledgeRetention</APILink>**: Evaluates whether the assistant correctly retains information from earlier user inputs without contradiction or distortion (returns "yes" or "no")
- **<APILink fn="mlflow.genai.scorers.UserFrustration">UserFrustration</APILink>**: Detects and tracks user frustration patterns (returns "none", "resolved", or "unresolved")

See the [Predefined Scorers](/genai/eval-monitor/scorers/llm-judge/predefined#multi-turn-scorers) page for detailed usage examples and API documentation.

### Custom Scorers

You can create custom multi-turn scorers using <APILink fn="mlflow.genai.judges.make_judge">make_judge</APILink> with the `{{ conversation }}` template variable:

```python
from mlflow.genai.judges import make_judge
from typing import Literal

# Create a custom multi-turn judge
politeness_judge = make_judge(
    name="conversation_politeness",
    instructions=(
        "Analyze the {{ conversation }} and determine if the agent maintains "
        "a polite and professional tone throughout all interactions. "
        "Rate as 'consistently_polite', 'mostly_polite', or 'impolite'."
    ),
    feedback_value_type=Literal["consistently_polite", "mostly_polite", "impolite"],
    model="openai:/gpt-4o",
)

# Use in evaluation
results = mlflow.genai.evaluate(
    data=traces,
    scorers=[politeness_judge],
)
```

:::note[Conversation Template Variable]
The `{{ conversation }}` variable injects the complete conversation history in a structured format.

The variable can only be used with `{{ expectations }}`, not with `{{ inputs }}`, `{{ outputs }}`, or `{{ trace }}`.
:::

### Combining Single-Turn and Multi-Turn Scorers

You can use both single-turn and multi-turn scorers in the same evaluation:

```python
from mlflow.genai.scorers import (
    ConversationCompleteness,
    UserFrustration,
    RelevanceToQuery,  # Single-turn scorer
)

results = mlflow.genai.evaluate(
    data=traces,
    scorers=[
        # Single-turn: evaluates each trace individually
        RelevanceToQuery(),
        # Multi-turn: evaluates entire sessions
        ConversationCompleteness(),
        UserFrustration(),
    ],
)
```

Single-turn scorers run on every trace individually, while multi-turn scorers run once per session and analyze the complete conversation history.

## Working with Specific Sessions

If you need to evaluate specific sessions or filter traces, you can extract session IDs and retrieve traces for each:

```python
import mlflow

# Get all traces from your experiment
all_traces = mlflow.search_traces(
    experiment_ids=["<your-experiment-id>"],
    return_type="list",
)

# Extract unique session IDs
session_ids = set()
for trace in all_traces:
    session_id = trace.info.trace_metadata.get("mlflow.trace.session")
    if session_id:
        session_ids.add(session_id)

# Get traces for each session and combine
all_session_traces = []
for session_id in session_ids:
    session_traces = mlflow.search_traces(
        experiment_ids=["<your-experiment-id>"],
        filter_string=f"metadata.`mlflow.trace.session` = '{session_id}'",
        return_type="list",
    )
    all_session_traces.extend(session_traces)

# Evaluate all sessions
results = mlflow.genai.evaluate(
    data=all_session_traces,
    scorers=[ConversationCompleteness(), UserFrustration()],
)
```

## Limitations

- **No `predict_fn` support**: Multi-turn scorers currently work only with pre-collected traces. You cannot use them with `predict_fn` in `mlflow.genai.evaluate`.

## Next Steps

<TilesGrid>
  <TileCard
    icon={BookOpen}
    iconSize={48}
    title="Session Tracing Guide"
    description="Learn how to track users and sessions in your conversational AI applications for better evaluation."
    href="/genai/tracing/track-users-sessions/"
    linkText="Learn about sessions →"
    containerHeight={64}
  />
  <TileCard
    icon={Activity}
    iconSize={48}
    title="Built-in Multi-Turn Scorers"
    description="Explore predefined scorers for conversation completeness, user frustration, and other multi-turn metrics."
    href="/genai/eval-monitor/scorers/llm-judge/predefined#multi-turn-scorers"
    linkText="View scorers →"
    containerHeight={64}
  />
  <TileCard
    icon={Code}
    iconSize={48}
    title="Create Custom Multi-Turn Judges"
    description="Build custom LLM judges using make_judge to evaluate conversation-specific criteria and patterns."
    href="/genai/eval-monitor/scorers/llm-judge/make-judge"
    linkText="Create custom judges →"
    containerHeight={64}
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

---[FILE: prompts.mdx]---
Location: mlflow-master/docs/docs/genai/eval-monitor/running-evaluation/prompts.mdx

```text
import ImageBox from '@site/src/components/ImageBox';
import TilesGrid from '@site/src/components/TilesGrid';
import TileCard from '@site/src/components/TileCard';
import WorkflowSteps from '@site/src/components/WorkflowSteps';
import { Target, Bot, Zap, FileText, Database, Code, CheckCircle, Play } from 'lucide-react';
import ServerSetup from "@site/src/content/setup_server.mdx";

# Evaluating Prompts

Prompts are the core components of GenAI applications. However, iterating over prompts can be challenging because it is hard to know if the new prompt is better than the old one. MLflow provides a framework to systematically evaluate prompt templates and track performance over time.

<ImageBox src="/images/mlflow-3/eval-monitor/prompt-evaluation-hero.png" alt="Prompt Evaluation" width="95%"/>

## Workflow

<WorkflowSteps
  steps={[
    {
    icon: FileText,
    title: "Create prompt template(s)",
    description: "Define and register your prompt templates in MLflow Prompt Registry for version control and easy access."
    },
    {
    icon: Database,
    title: "Prepare evaluation dataset",
    description: "Create test cases with inputs and expected outcomes to systematically evaluate prompt performance."
    },
    {
    icon: Code,
    title: "Define a wrapper function to generate responses",
    description: "Wrap your prompt in a function that takes dataset inputs and generates responses using your model."
    },
    {
    icon: CheckCircle,
    title: "Define evaluation scorers",
    description: "Set up built-in and custom scorers to measure quality, accuracy, and task-specific criteria."
    },
    {
    icon: Play,
    title: "Run evaluation",
    description: "Execute the evaluation and review results in MLflow UI to analyze performance and iterate."
    }
]}
/>

## Example: Evaluating a Prompt Template

### Prerequisites

First, install the required packages by running the following command:

```bash
pip install --upgrade mlflow>=3.3 openai
```

MLflow stores evaluation results in a tracking server. Connect your local environment to the tracking server by one of the following methods.

<ServerSetup />

### Step 1: Create prompt templates

Let's define a simple prompt template to evaluate. We use [MLflow Prompt Registry](/genai/prompt-registry) to save the prompt and version control it, but it is optional for evaluation.

```python
import mlflow

# Define prompt templates. MLflow supports both text and chat format prompt templates.
PROMPT_V1 = [
    {
        "role": "system",
        "content": "You are a helpful assistant. Answer the following question.",
    },
    {
        "role": "user",
        # Use double curly braces to indicate variables.
        "content": "Question: {{question}}",
    },
]

# Register the prompt template to the MLflow Prompt Registry for version control
# and convenience of loading the prompt template. This is optional.
mlflow.genai.register_prompt(
    name="qa_prompt",
    template=PROMPT_V1,
    commit_message="Initial prompt",
)
```

### Step 2: Create evaluation dataset

The evaluation dataset is defined as a list of dictionaries, each with an `inputs`, `expectations`, and an optional `tags` field.

```python
eval_dataset = [
    {
        "inputs": {"question": "What causes rain?"},
        "expectations": {
            "key_concepts": ["evaporation", "condensation", "precipitation"]
        },
        "tags": {"topic": "weather"},
    },
    {
        "inputs": {"question": "Explain the difference between AI and ML"},
        "expectations": {
            "key_concepts": ["artificial intelligence", "machine learning", "subset"]
        },
        "tags": {"topic": "technology"},
    },
    {
        "inputs": {"question": "How do vaccines work?"},
        "expectations": {"key_concepts": ["immune", "antibodies", "protection"]},
        "tags": {"topic": "medicine"},
    },
]
```

### Step 3: Create prediction function

Now wrap the prompt template in a simple function that takes a question to generate responses using the prompt template. **IMPORTANT: The function must take the keyword arguments used in the `inputs` field of the dataset.** Therefore, we use `question` as the argument of the function here.

```python
from openai import OpenAI

client = OpenAI()


@mlflow.trace
def predict_fn(question: str) -> str:
    prompt = mlflow.genai.load_prompt("prompts:/qa_prompt@latest")
    rendered_prompt = prompt.format(question=question)

    response = client.chat.completions.create(
        model="gpt-4.1-mini", messages=rendered_prompt
    )
    return response.choices[0].message.content
```

### Step 4: Define task-specific scorers

Finally, let's define a few [scorers](/genai/eval-monitor/scorers) that decide the evaluation criteria. Here we use two types of scorers:

- Built-in LLM scorers for evaluating the qualitative aspects of the response.
- Custom heuristic scorer for evaluating the coverage of the key concepts.

```python
from mlflow.entities import Feedback
from mlflow.genai import scorer
from mlflow.genai.scorers import Guidelines

# Define LLM scorers
is_concise = Guidelines(
    name="is_concise", guidelines="The response should be concise and to the point."
)
is_professional = Guidelines(
    name="is_professional", guidelines="The response should be in professional tone."
)


# Evaluate the coverage of the key concepts using custom scorer
@scorer
def concept_coverage(outputs: str, expectations: dict) -> Feedback:
    concepts = set(expectations.get("key_concepts", []))
    included = {c for c in concepts if c.lower() in outputs.lower()}
    return Feedback(
        value=len(included) / len(concepts),
        rationale=(
            f"Included {len(included)} out of {len(concepts)} concepts. Missing: {concepts - included}"
        ),
    )
```

:::tip

LLM scorers use OpenAI's GPT 4.1-mini by default. You can use different models by passing the `model` parameter to the scorer constructor.

:::

### Step 5: Run evaluation

Now we are ready to run the evaluation!

```python
mlflow.genai.evaluate(
    data=eval_dataset,
    predict_fn=predict_fn,
    scorers=[is_concise, is_professional, concept_coverage],
)
```

Once the evaluation is done, open the MLflow UI in your browser and navigate to the experiment page. You should see MLflow creates a new Run and logs the evaluation results.

<ImageBox src="/images/mlflow-3/eval-monitor/prompt-evaluation-results.png" alt="Prompt Evaluation" width="95%"/>

By clicking on the each row in the result, you can open the trace and see the detailed score and rationale.

<ImageBox src="/images/mlflow-3/eval-monitor/prompt-evaluation-trace.png" alt="Prompt Evaluation" width="95%"/>

## Iterating on Prompts

The prompt evaluation is an iterative process. You can register a new prompt version, run the same eval again, and compare the evaluation results. The prompt registry keep track of the version changes and lineage between the prompt versions and evaluation results.

```python
# Define V2 prompt template
PROMPT_V2 = [
    {
        "role": "system",
        "content": "You are a helpful assistant. Answer the following question in three sentences.",
    },
    {"role": "user", "content": "Question: {{question}}"},
]

mlflow.genai.register_prompt(name="qa_prompt", template=PROMPT_V2)

# Run the same evaluation again.
# MLflow automatically loads the latest prompt template via the `@latest` alias.
mlflow.genai.evaluate(
    data=eval_dataset,
    predict_fn=predict_fn,
    scorers=[is_concise, is_professional, concept_coverage],
)
```

## Compare Evaluation Results

Once you have multiple evaluation runs, you can compare the result side-by-side to analyze the performance changes. To see the comparison view, open the evaluation result page for one of the runs, and pick another run to compare from the dropdown on the top.

To see the comparison view, open the evaluation result page for one of the runs, and pick another run to compare from the dropdown on the top.

<ImageBox src="/images/mlflow-3/eval-monitor/prompt-evaluation-dropdown.png" alt="Prompt Evaluation" />

MLflow will load the evaluation results for the two runs and display the comparison view. In this example, you can see the overall concise scorer is improved 33%, but the concept coverage is dropped 11%. The little arrow ↗️/↘️ in each row indicates where the change is coming from.

<ImageBox src="/images/mlflow-3/eval-monitor/prompt-evaluation-compare.png" alt="Prompt Evaluation" width="95%"/>

## Next steps

<TilesGrid>
  <TileCard
    icon={Target}
    iconSize={48}
    title="Customize Scorers"
    description="Build specialized evaluation metrics for your specific use cases and requirements."
    href="/genai/eval-monitor/scorers"
    linkText="Learn about custom scorers →"
    containerHeight={64}
  />
  <TileCard
    icon={Bot}
    iconSize={48}
    title="Evaluate Agents"
    description="Evaluate complex AI agents with tool calling and multi-step workflows."
    href="/genai/eval-monitor/running-evaluation/agents"
    linkText="Evaluate agents →"
    containerHeight={64}
  />
  <TileCard
    icon={Zap}
    iconSize={48}
    title="Optimize Prompts"
    description="Use automated optimization techniques to systematically improve your prompts."
    href="/genai/prompt-registry/optimize-prompts"
    linkText="Optimize prompts →"
    containerHeight={64}
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

````
