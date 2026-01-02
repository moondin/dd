---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 138
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 138 of 991)

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

---[FILE: compare-app-versions.mdx]---
Location: mlflow-master/docs/docs/genai/version-tracking/compare-app-versions.mdx

```text
---
title: Compare App Versions
description: Compare different application versions using traces to track improvements and identify the best performing iteration.
---

import FeatureHighlights from "@site/src/components/FeatureHighlights";
import ConceptOverview from "@site/src/components/ConceptOverview";
import TilesGrid from "@site/src/components/TilesGrid";
import TileCard from "@site/src/components/TileCard";
import { TrendingUp, BarChart3, CheckCircle, Eye, Database, Zap, Activity } from "lucide-react";

# Compare Application Versions with Traces

Objective version comparison drives successful GenAI development. MLflow's trace-based comparison enables you to analyze performance differences, validate improvements, and make data-driven deployment decisions across application iterations.

## Why Trace-Based Comparison Works

<FeatureHighlights features={[
  {
    icon: Activity,
    title: "Complete Execution Context",
    description: "Traces capture the full application flow - inputs, outputs, intermediate steps, and performance metrics for comprehensive analysis."
  },
  {
    icon: TrendingUp,
    title: "Objective Performance Metrics",
    description: "Compare latency, token usage, error rates, and quality metrics across versions with precise, measurable data."
  },
  {
    icon: Eye,
    title: "Detect Subtle Regressions",
    description: "Identify performance degradations or behavioral changes that might not be obvious from simple input/output comparison."
  },
  {
    icon: CheckCircle,
    title: "Development Decision Support",
    description: "Make data-driven decisions about when to ship improvements, iterate further, or try different approaches based on trace analysis."
  }
]} />

## Generate Traces for Different Versions

Create traces for multiple application versions to enable systematic comparison:

```python
import mlflow
import openai


@mlflow.trace
def basic_agent(question: str) -> str:
    """Basic customer support agent."""
    client = openai.OpenAI()

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful customer support agent."},
            {"role": "user", "content": question},
        ],
        temperature=0.3,
        max_tokens=100,
    )

    return response.choices[0].message.content


@mlflow.trace
def empathetic_agent(question: str) -> str:
    """Enhanced customer support agent with empathetic prompting."""
    client = openai.OpenAI()

    # Enhanced system prompt
    system_prompt = """You are a caring and empathetic customer support agent.
    Always acknowledge the customer's feelings before providing solutions.
    Use phrases like 'I understand how frustrating this must be'.
    Provide clear, actionable steps with a warm, supportive tone."""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": question},
        ],
        temperature=0.7,
        max_tokens=150,
    )

    return response.choices[0].message.content


print("✅ Agent functions ready for comparison")
```

Generate comparable traces by testing both versions on the same inputs:

```python
# Test scenarios for fair comparison
test_questions = [
    "How can I track my package?",
    "What's your return policy?",
    "I need help with my account login",
    "My order arrived damaged, what should I do?",
    "Can I cancel my subscription?",
]

print("🔄 Generating traces for version comparison...")

# Run both versions on the same inputs
for i, question in enumerate(test_questions):
    print(f"Testing scenario {i+1}: {question[:30]}...")

    # Generate trace for v1
    v1_response = basic_agent(question)

    # Generate trace for v2
    v2_response = empathetic_agent(question)

    print(f"  V1 response: {v1_response[:50]}...")
    print(f"  V2 response: {v2_response[:50]}...")

print(f"\n✅ Generated {len(test_questions) * 2} traces for comparison")
```

## Systematic Trace-Based Version Analysis

<ConceptOverview concepts={[
  {
    icon: Database,
    title: "Trace Collection & Filtering",
    description: "Use MLflow's search_traces API to collect and filter traces by version metadata, enabling precise version-to-version comparisons."
  },
  {
    icon: BarChart3,
    title: "Performance Metric Analysis",
    description: "Extract and compare execution time, token usage, and quality metrics from traces to identify performance improvements or regressions."
  },
  {
    icon: Zap,
    title: "Automated Deployment Logic",
    description: "Build quality gates that automatically analyze trace metrics and determine deployment readiness based on performance thresholds."
  }
]} />

### Collect and Analyze Version Traces

Use `search_traces` to systematically compare version performance:

```python
from datetime import datetime, timedelta
import pandas as pd

# Search for traces from the last hour (adjust timeframe as needed)
recent_time = datetime.now() - timedelta(hours=1)

# Get traces for both versions
all_traces = mlflow.search_traces(
    filter_string=f"timestamp >= '{recent_time.isoformat()}'", max_results=100
)

print(f"Found {len(all_traces)} recent traces\n")

# Separate traces by version using trace metadata
v1_traces = []
v2_traces = []

for trace in all_traces:
    # Parse trace data to get metadata
    trace_data = trace if isinstance(trace, dict) else trace.to_dict()

    if "customer_support_v1" in trace_data.get("info", {}).get("name", ""):
        v1_traces.append(trace_data)
    elif "customer_support_v2" in trace_data.get("info", {}).get("name", ""):
        v2_traces.append(trace_data)

print(f"Version 1 traces: {len(v1_traces)}")
print(f"Version 2 traces: {len(v2_traces)}")


# Calculate performance metrics for each version
def analyze_traces(traces, version_name):
    """Extract key metrics from a list of traces."""
    if not traces:
        return {}

    execution_times = []
    response_lengths = []

    for trace in traces:
        # Extract execution time (in milliseconds)
        exec_time = trace.get("info", {}).get("execution_time_ms", 0)
        execution_times.append(exec_time)

        # Extract response length from spans
        spans = trace.get("data", {}).get("spans", [])
        if spans:
            # Get the root span's output
            root_span = spans[0]
            output = root_span.get("outputs", "")
            response_lengths.append(len(str(output)) if output else 0)

    return {
        "version": version_name,
        "trace_count": len(traces),
        "avg_execution_time_ms": sum(execution_times) / len(execution_times)
        if execution_times
        else 0,
        "avg_response_length": sum(response_lengths) / len(response_lengths)
        if response_lengths
        else 0,
        "min_execution_time_ms": min(execution_times) if execution_times else 0,
        "max_execution_time_ms": max(execution_times) if execution_times else 0,
    }


# Analyze both versions
v1_metrics = analyze_traces(v1_traces, "v1.0")
v2_metrics = analyze_traces(v2_traces, "v2.0")

print("\n📊 Version Performance Comparison:")
print(
    f"V1 - Avg Execution: {v1_metrics['avg_execution_time_ms']:.1f}ms, Avg Response: {v1_metrics['avg_response_length']:.0f} chars"
)
print(
    f"V2 - Avg Execution: {v2_metrics['avg_execution_time_ms']:.1f}ms, Avg Response: {v2_metrics['avg_response_length']:.0f} chars"
)
```

This gives you a clear, data-driven view of how your application versions compare in terms of performance and reliability. You can use these metrics to make informed decisions about which version to deploy or iterate on further.

## Next Steps

<TilesGrid>
  <TileCard
    href="/genai/version-tracking"
    title="Version Tracking"
    description="Learn more about tracking application versions with MLflow"
    icon={Database}
  />
  <TileCard
    href="/genai/tracing"
    title="MLflow Tracing"
    description="Explore MLflow's comprehensive tracing capabilities for GenAI applications"
    icon={Activity}
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/genai/version-tracking/index.mdx

```text
---
title: Version Tracking for GenAI Applications
description: Understand how MLflow enables version tracking for your complete GenAI applications using LoggedModels, linking code, configurations, evaluations, and traces.
last_update:
  date: 2025-05-23
---

import FeatureHighlights from "@site/src/components/FeatureHighlights";
import ConceptOverview from "@site/src/components/ConceptOverview";
import TilesGrid from "@site/src/components/TilesGrid";
import TileCard from "@site/src/components/TileCard";
import { APILink } from "@site/src/components/APILink";
import useBaseUrl from '@docusaurus/useBaseUrl';
import { GitBranch, Database, Shield, TrendingUp, Eye, Code2, Settings, BookOpen, Target } from "lucide-react";

# Version Tracking for GenAI Applications

MLflow's **<APILink fn="mlflow.entities.LoggedModel">LoggedModel</APILink>** provides systematic version control for your entire GenAI application—code, configurations, evaluations, and traces. Stop losing track of what works and start building with confidence through complete application lifecycle management.

<div style={{margin: '2rem 0', textAlign: 'center'}}>
  <img
    src={useBaseUrl('/images/mlflow-3/genai/logged_model_autolog_traces.png')}
    alt="MLflow UI showing LoggedModel with linked traces for version tracking"
    style={{maxWidth: '100%', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'}}
  />
</div>

## Why Version Control Matters for GenAI

GenAI applications are complex systems with interdependent components. Without systematic versioning, development becomes chaotic and deployments risky.

<FeatureHighlights features={[
  {
    icon: Shield,
    title: "Eliminate 'It Worked Yesterday' Syndrome",
    description: "Know exactly which combination of code, prompts, and configurations produced any result. Reproduce successes and debug failures with complete context."
  },
  {
    icon: TrendingUp,
    title: "Deploy with Data-Driven Confidence",
    description: "Compare application versions objectively using metrics like quality scores, cost, and latency. Choose the best performer based on evidence, not intuition."
  },
  {
    icon: Eye,
    title: "Track Every Change's Impact",
    description: "Link code commits, configuration changes, and evaluation results. When quality drops, pinpoint exactly what changed and when."
  },
  {
    icon: Database,
    title: "Maintain Production Auditability",
    description: "Know exactly what version was deployed when. Essential for compliance, incident response, and regulatory requirements."
  }
]} />

## How LoggedModel Powers GenAI Version Control

MLflow's LoggedModel adapts traditional ML model versioning for GenAI applications. Instead of just tracking model weights, it becomes a comprehensive metadata hub that coordinates all the moving parts of your AI system.

<ConceptOverview concepts={[
  {
    icon: GitBranch,
    title: "Application State Snapshots",
    description: "Each LoggedModel version captures a complete application state—code references, configurations, dependencies, and performance data in one versioned entity."
  },
  {
    icon: Code2,
    title: "Flexible Code Management",
    description: "Link to external git commits for lightweight versioning, or bundle code directly for deployment. Choose the approach that fits your workflow."
  },
  {
    icon: Settings,
    title: "Automatic Trace Association",
    description: "When you set an active model context, all subsequent traces automatically link to that version. No manual bookkeeping required."
  }
]} />

## Start Version Tracking in 5 Minutes

Transform chaotic GenAI development into systematic version control with just a few lines of code.

### Automatic Version Tracking with Git Integration

Link your application versions to git commits for complete traceability:

```python
import mlflow
import openai
import os

# Fix: Added missing import
os.environ["OPENAI_API_KEY"] = "your-api-key-here"

# Configure MLflow experiment
mlflow.set_experiment("customer-support-agent")

# Get current git commit using MLflow's built-in utilities
from mlflow.utils.git_utils import get_git_commit

git_commit = get_git_commit(".")
if git_commit:
    git_commit = git_commit[:8]  # Use short hash
else:
    git_commit = "local-dev"  # Fallback if not in git repo

# Create version identifier
app_name = "customer_support_agent"
version_name = f"{app_name}-{git_commit}"

# Set active model context - all traces will link to this version
mlflow.set_active_model(name=version_name)

# Enable automatic tracing
mlflow.openai.autolog()

# Your application code - now automatically versioned and traced
client = openai.OpenAI()
test_questions = [
    "How do I reset my password?",
    "What are your business hours?",
    "Can I get a refund for my order?",
]

for question in test_questions:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": question}],
        temperature=0.7,
        max_tokens=1000,
    )
    # ✅ Automatically: traced, versioned, and linked to git commit
```

**What happens automatically:**

- Every LLM call generates a detailed trace
- All traces link to your specific application version
- Git commit provides exact code reproducibility
- Version performance can be compared objectively

### Version Management Made Simple

```python
# Create a new version for experimentation
with mlflow.set_active_model(name=f"agent-v2-{new_commit}"):
    # Test new prompt engineering approach
    improved_response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful customer support agent. Be concise and actionable.",
            },
            {"role": "user", "content": question},
        ],
        temperature=0.3,  # Lower temperature for consistency
        max_tokens=500,  # More focused responses
    )
    # ✅ New version automatically tracked with different configurations
```

Context manager automatically handles version switching—clean, explicit, and error-free.

### Compare Versions Systematically

```python
import pandas as pd

# Evaluate multiple versions against the same test set
eval_data = pd.DataFrame(
    {
        "inputs": test_questions,
        "expected_categories": ["account", "business_info", "billing"],
    }
)

# Version A: Original configuration
results_v1 = mlflow.evaluate(
    model_uri=f"models:/{app_name}-{commit_v1}",
    data=eval_data,
    extra_metrics=[
        mlflow.metrics.toxicity(),
        mlflow.metrics.latency(),
        mlflow.metrics.flesch_kincaid_grade_level(),
    ],
)

# Version B: Improved prompts
results_v2 = mlflow.evaluate(
    model_uri=f"models:/{app_name}-{commit_v2}",
    data=eval_data,
    extra_metrics=[
        mlflow.metrics.toxicity(),
        mlflow.metrics.latency(),
        mlflow.metrics.flesch_kincaid_grade_level(),
    ],
)

# ✅ Side-by-side comparison shows which version performs better
```

Objective metrics remove guesswork from version selection.

## Prerequisites

Ready to implement systematic version tracking? You'll need:

- **MLflow 3.0+** (`pip install --upgrade "mlflow>=3.1"`)
- **Git repository** for your application code
- **Python 3.10+**
- **LLM API access** (OpenAI, Anthropic, etc.)

:::tip
For Databricks-hosted MLflow Tracking: `pip install --upgrade "mlflow[databricks]>=3.1"`
:::

---

## Advanced Version Tracking Capabilities

Once you've mastered basic version tracking, explore these advanced patterns for production GenAI applications.

<TilesGrid>
  <TileCard
    icon={Target}
    iconSize={48}
    title="Track Application Versions"
    description="Learn comprehensive patterns for versioning complex GenAI applications with external code management"
    href="/genai/version-tracking/track-application-versions-with-mlflow"
    linkText="Master versioning →"
    containerHeight={64}
  />
  <TileCard
    icon={BookOpen}
    iconSize={48}
    title="Deployment Strategies"
    description="Deploy versioned applications with confidence using MLflow's serving capabilities"
    href="/genai/serving"
    linkText="Deploy versions →"
    containerHeight={64}
  />
</TilesGrid>

Start with the code examples above, then explore the advanced capabilities as your application grows in complexity.
```

--------------------------------------------------------------------------------

---[FILE: quickstart.mdx]---
Location: mlflow-master/docs/docs/genai/version-tracking/quickstart.mdx

```text
---
sidebar_position: 2
---

import ConceptOverview from "@site/src/components/ConceptOverview";
import TilesGrid from "@site/src/components/TilesGrid";
import TileCard from "@site/src/components/TileCard";
import ImageBox from "@site/src/components/ImageBox";
import { Code2, BarChart3, Rocket, BookOpen, Target, Eye, GitBranch, Settings } from "lucide-react";

# Version Tracking Quickstart

Build and track a LangChain-based chatbot with MLflow's version management capabilities. This quickstart demonstrates prompt versioning, application tracking, trace generation, and performance evaluation using MLflow's GenAI features.

## Prerequisites

### Install Required Packages

:::note MLflow 3 Required
This quickstart requires MLflow version 3.0 or higher for full GenAI functionality.
:::

```bash
pip install --upgrade mlflow
pip install langchain-openai
```

### Set OpenAI API Key

Configure your OpenAI API key to authenticate with OpenAI services:

```bash
export OPENAI_API_KEY=your_api_key_here
```

## What You'll Learn

This quickstart covers the essential concepts for building trackable GenAI applications with MLflow's version management system.

<ConceptOverview concepts={[
  {
    icon: GitBranch,
    title: "Version Control Prompts",
    description: "Register and track prompt templates with full version history for reproducible experiments"
  },
  {
    icon: Settings,
    title: "Build LangChain Agents",
    description: "Create conversational agents with automatic MLflow integration and observability"
  },
  {
    icon: Eye,
    title: "Trace Everything",
    description: "Enable comprehensive trace logging to monitor and debug your model's behavior"
  },
  {
    icon: Target,
    title: "Evaluate Performance",
    description: "Assess model quality with built-in metrics and custom evaluation frameworks"
  }
]} />

Let's build a simple IT support chatbot and track its development lifecycle with MLflow.

## Step 1: Register a Prompt Template

Start by creating a versioned prompt template. This enables you to track prompt evolution and ensure reproducibility across experiments.

```python
import mlflow

system_prompt = mlflow.genai.register_prompt(
    name="chatbot_prompt",
    template="You are a chatbot that can answer questions about IT. Answer this question: {{question}}",
    commit_message="Initial version of chatbot",
)
```

### View Your Prompt in MLflow UI

Navigate to the **Prompts** tab to see your registered prompt:

<ImageBox
  src="/images/mlflow-3/genai/chatbot_prompt.png"
  alt="The MLflow UI showing a prompt version"
  width="90%"
/>

## Step 2: Build a LangChain Conversational Chain

Create a simple chain that combines your prompt template with OpenAI's chat model:

```python
from langchain.schema.output_parser import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

# Convert MLflow prompt to LangChain format
prompt = ChatPromptTemplate.from_template(system_prompt.to_single_brace_format())

# Build the chain: prompt → LLM → output parser
chain = prompt | ChatOpenAI(temperature=0.7) | StrOutputParser()

# Test the chain
question = "What is MLflow?"
print(chain.invoke({"question": question}))
# MLflow is an open-source platform for managing the end-to-end machine learning lifecycle...
```

## Step 3: Enable Trace Observability

Set up automatic trace logging to monitor your model's behavior during development. This creates a linked history of all model interactions.

### Configure Active Model and Autologging

```python
# Set the active model for linking traces
mlflow.set_active_model(name="langchain_model")

# Enable autologging - all traces will be automatically linked to the active model
mlflow.langchain.autolog()
```

### Generate Test Traces

Run multiple queries to generate traces for analysis:

```python
questions = [
    {"question": "What is MLflow Tracking and how does it work?"},
    {"question": "What is Unity Catalog?"},
    {"question": "What are user-defined functions (UDFs)?"},
]
outputs = []

for question in questions:
    outputs.append(chain.invoke(question))

# Verify traces are linked to the active model
active_model_id = mlflow.get_active_model_id()
mlflow.search_traces(model_id=active_model_id)
```

### Explore Traces in the UI

1. **View the Logged Model**: Check the **Models** tab in your experiment:

<ImageBox
  src="/images/mlflow-3/genai/logged_models_tab.png"
  alt="The MLflow UI showing the logged models in an experiment"
  width="90%"
/>

2. **Access Model Details**: Click on your model to view its unique `model_id`:

<ImageBox
  src="/images/mlflow-3/genai/logged_model_page.png"
  alt="The MLflow UI showing the logged model details page"
  width="90%"
/>

3. **Analyze Generated Traces**: Navigate to the **Traces** tab to examine individual interactions:

<ImageBox
  src="/images/mlflow-3/genai/logged_model_autolog_traces.png"
  alt="The MLflow UI showing the logged model autolog traces lineage"
  width="90%"
/>

## Step 4: Evaluate Model Performance

Evaluation is crucial for understanding how well your chatbot performs and ensuring quality improvements over time. MLflow provides the foundation for systematic evaluation tracking.

Key evaluation capabilities:

- **Quality Assessment**: Systematically evaluate response quality using keyword coverage and content analysis to ensure your chatbot meets expectations
- **Performance Metrics**: Track quantitative measures like response length and keyword matching to monitor improvement over time
- **Continuous Monitoring**: Log evaluation results to MLflow for ongoing performance tracking and comparison across model iterations

Use MLflow's tracking capabilities to assess your chatbot's accuracy and relevance against expected responses.

### Analyze Outputs Manually

Evaluate your model outputs by comparing them to expected responses:

```python
import pandas as pd

# Create evaluation dataset
eval_data = [
    {
        "question": "What is MLflow Tracking and how does it work?",
        "expected_keywords": [
            "experiment tracking",
            "parameters",
            "metrics",
            "artifacts",
            "UI",
        ],
    },
    {
        "question": "What is Unity Catalog?",
        "expected_keywords": [
            "data assets",
            "centralized",
            "collaboration",
            "governance",
        ],
    },
    {
        "question": "What are user-defined functions (UDFs)?",
        "expected_keywords": [
            "custom functions",
            "data transformations",
            "Spark",
            "SQL",
        ],
    },
]


# Simple evaluation metrics
def evaluate_response(response, expected_keywords):
    """Simple keyword-based evaluation."""
    response_lower = response.lower()
    keyword_matches = sum(
        1 for keyword in expected_keywords if keyword.lower() in response_lower
    )
    coverage_score = keyword_matches / len(expected_keywords)
    response_length = len(response.split())

    return {
        "keyword_coverage": coverage_score,
        "response_length": response_length,
        "keyword_matches": keyword_matches,
    }


# Evaluate each response
evaluation_results = []
for i, (output, eval_item) in enumerate(zip(outputs, eval_data)):
    metrics = evaluate_response(output, eval_item["expected_keywords"])
    evaluation_results.append(
        {
            "question": eval_item["question"],
            "response": output,
            "keyword_coverage": metrics["keyword_coverage"],
            "response_length": metrics["response_length"],
            "keyword_matches": metrics["keyword_matches"],
        }
    )

    print(
        f"Question {i+1}: {metrics['keyword_matches']}/{len(eval_item['expected_keywords'])} keywords found"
    )
    print(f"Coverage: {metrics['keyword_coverage']:.1%}")
    print(f"Response length: {metrics['response_length']} words\n")

# Log evaluation metrics
with mlflow.start_run():
    avg_coverage = sum(r["keyword_coverage"] for r in evaluation_results) / len(
        evaluation_results
    )
    avg_length = sum(r["response_length"] for r in evaluation_results) / len(
        evaluation_results
    )

    mlflow.log_metric("avg_keyword_coverage", avg_coverage)
    mlflow.log_metric("avg_response_length", avg_length)

    print(f"📊 Average keyword coverage: {avg_coverage:.1%}")
    print(f"📊 Average response length: {avg_length:.0f} words")
```

### View Results in MLflow UI

The evaluation metrics are logged to MLflow for tracking and comparison. Navigate to the **Experiments** tab to view your evaluation run and compare results across different iterations.

## What You've Built

You now have a complete version-tracked GenAI application with comprehensive observability and evaluation capabilities.

What you've accomplished:

- **Versioned Prompt Templates**: Your prompts are now registered in MLflow with full version history, enabling reproducible experiments and systematic improvements
- **Integrated LangChain Agent**: Built a conversational agent with automatic MLflow integration that captures every interaction for analysis and debugging
- **Complete Trace Observability**: Enabled comprehensive trace logging that links all model interactions to your versioned application for full visibility
- **Systematic Evaluation**: Implemented performance tracking with keyword-based metrics that log results to MLflow for ongoing quality monitoring

## Next Steps

<TilesGrid>
  <TileCard
    href="/genai/version-tracking/track-application-versions-with-mlflow"
    title="Track Application Versions"
    description="Learn advanced version tracking patterns for production GenAI applications"
    icon={Code2}
  />
  <TileCard
    href="/genai/version-tracking/compare-app-versions"
    title="Compare App Versions"
    description="Analyze performance differences between versions using trace-based comparison"
    icon={BarChart3}
  />
  <TileCard
    href="/genai/prompt-registry"
    title="Prompt Registry"
    description="Manage prompts at scale with MLflow's centralized prompt registry"
    icon={BookOpen}
  />
  <TileCard
    href="/genai/eval-monitor"
    title="Evaluation & Monitoring"
    description="Build comprehensive evaluation pipelines for production GenAI applications"
    icon={Rocket}
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

---[FILE: track-application-versions-with-mlflow.mdx]---
Location: mlflow-master/docs/docs/genai/version-tracking/track-application-versions-with-mlflow.mdx

```text
---
title: Track versions of Git-based applications with MLflow
description: Learn how to track versions of your GenAI application when your app's code resides in Git, using MLflow's automatic Git versioning capabilities.
---

import FeatureHighlights from "@site/src/components/FeatureHighlights";
import ConceptOverview from "@site/src/components/ConceptOverview";
import TilesGrid from "@site/src/components/TilesGrid";
import TileCard from "@site/src/components/TileCard";
import { APILink } from "@site/src/components/APILink";
import { GitBranch, GitCommit, Shield, Code2, Database, Settings, BarChart3, PlayCircle } from "lucide-react";
import ImageBox from '@site/src/components/ImageBox';
import GitVersioningImage from '@site/static/images/git-versioning.png';

# Track versions of Git-based applications with MLflow

:::warning

- This feature is experimental and may change in future releases.
- This feature is not supported in [Databricks Git Folders](https://docs.databricks.com/aws/en/repos/) yet due to limitations in accessing Git metadata.
- MLflow >= 3.4 is required for this feature.

:::

This guide demonstrates how to track versions of your GenAI application when your app's code resides in Git or a similar version control system. MLflow provides automatic Git-based versioning through the <APILink fn="mlflow.genai.enable_git_model_versioning" /> API, which seamlessly tracks your application versions based on Git state.

When enabled, MLflow automatically:

- Creates or reuses a LoggedModel based on your current [git state](.#git-state-tracked-by-mlflow)
- Links all traces to this `LoggedModel` version
- Captures Git metadata including diffs for uncommitted changes
- Manages version transitions as your code evolves

### Git State Tracked by MLflow

MLflow tracks three key components of your Git state:

- **Branch**: The Git branch name (e.g., `main`, `feature-xyz`)
- **Commit**: The Git commit hash uniquely identifying the code version
- **Dirty State**: Whether your working directory has uncommitted changes. A "dirty" repository means there are modifications that haven't been committed yet. MLflow captures these changes as a diff to ensure complete reproducibility

## Why Git-Based Versioning Works for GenAI

Git-based versioning transforms your version control system into a powerful application lifecycle management tool. Every commit becomes a potential application version, with complete code history and change tracking built-in.

<FeatureHighlights features={[
  {
    icon: GitCommit,
    title: "Commit-Based Versioning",
    description: "Use Git commit hashes as unique version identifiers. Each commit represents a complete application state with full reproducibility."
  },
  {
    icon: GitBranch,
    title: "Branch-Based Development",
    description: "Leverage Git branches for parallel development. Feature branches become isolated version streams that can be merged systematically."
  },
  {
    icon: Shield,
    title: "Automatic Metadata Capture",
    description: "MLflow automatically captures Git commit, branch, and repository URL during runs. No manual version tracking required."
  },
  {
    icon: Database,
    title: "Seamless Integration",
    description: "Works naturally with your existing Git workflow. No changes to development process or additional tooling required."
  }
]} />

## How MLflow Captures Git Context

With <APILink fn="mlflow.genai.enable_git_model_versioning" />, MLflow automatically manages version tracking based on your Git state. Each unique combination of branch, commit, and dirty state creates or reuses a LoggedModel version.

<ConceptOverview concepts={[
  {
    icon: Code2,
    title: "Automatic Git Detection",
    description: "MLflow detects Git repositories and automatically captures commit hash, branch name, repository URL, and uncommitted changes."
  },
  {
    icon: Settings,
    title: "Zero-Configuration Versioning",
    description: "Simply call enable_git_model_versioning() once—MLflow handles all version management and trace linking automatically."
  },
  {
    icon: Database,
    title: "Smart Version Deduplication",
    description: "MLflow intelligently reuses existing LoggedModels when Git state matches, avoiding version proliferation."
  }
]} />

## Prerequisites

Install MLflow and required packages:

```bash
pip install "mlflow>=3.4" openai
```

Set your OpenAI API key:

```bash
export OPENAI_API_KEY="your-api-key-here"
```

Create an MLflow experiment by following the [getting started guide](/ml/getting-started).

## Step 1: Enable Git-based version tracking

The simplest way to enable Git-based version tracking is to call <APILink fn="mlflow.genai.enable_git_model_versioning" /> at the start of your application:

```python
import mlflow

# Enable Git-based version tracking
# This automatically creates/reuses a LoggedModel based on your Git state
context = mlflow.genai.enable_git_model_versioning()

# Check which version is active
print(
    f"Active version - Branch: {context.info.branch}, Commit: {context.info.commit[:8]}"
)
print(f"Repository dirty: {context.info.dirty}")
```

You can also use it as a context manager for scoped versioning:

```python
with mlflow.genai.enable_git_model_versioning() as context:
    # All traces within this block are linked to the Git-based version
    # Your application code here
    ...

# Version tracking is automatically disabled when exiting the context
```

## Step 2: Create your application

Now let's create a simple application that will be automatically versioned:

```python
import mlflow
import openai

# Enable Git-based version tracking
context = mlflow.genai.enable_git_model_versioning()

# Enable MLflow's autologging to instrument your application with Tracing
mlflow.openai.autolog()

# Set up OpenAI client
client = openai.OpenAI()


# Use the trace decorator to capture the application's entry point
@mlflow.trace
def my_app(input: str) -> str:
    """Customer support agent application"""
    # This call is automatically instrumented by `mlflow.openai.autolog()`
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful customer support agent."},
            {"role": "user", "content": input},
        ],
        temperature=0.7,
        max_tokens=150,
    )
    return response.choices[0].message.content


# Test the application - traces are automatically linked to the Git version
result = my_app(input="What is MLflow?")
print(result)
```

:::note

When you run this code, MLflow automatically:

1. Detects your Git repository state (branch, commit, dirty status)
2. Creates or reuses a LoggedModel matching this state
3. Links all traces to this version
4. Captures uncommitted changes as diffs if the repository is dirty

:::

## Step 3: Test version tracking with code changes

Run your application and observe how versions are tracked:

```python
# Initial run - creates a LoggedModel for current Git state
result = my_app(input="What is MLflow?")
print(result)

result = my_app(input="What is Databricks?")
print(result)
# Both traces are linked to the same version since Git state hasn't changed
```

To see how MLflow tracks changes, modify your code (without committing) and run again:

```python
# Make a change to your application code (e.g., modify temperature)
# The repository is now "dirty" with uncommitted changes

# Re-enable versioning - MLflow will detect the dirty state
context = mlflow.genai.enable_git_model_versioning()
print(f"Repository dirty: {context.info.dirty}")  # Will show True

# This trace will be linked to a different version (same commit but dirty=True)
result = my_app(input="What is GenAI?")
print(result)
```

:::tip
MLflow creates distinct versions for:

- Different Git branches
- Different commits
- Clean vs. dirty repository states

This ensures complete reproducibility of your application versions.
:::

## Step 5: View traces linked to the LoggedModel

### Use the UI

Go to the MLflow Experiment UI. In the **Traces** tab, you can see the version of the app that generated each trace. In the **Models** tab, you can see each LoggedModel alongside its parameters and linked traces.

<ImageBox src={GitVersioningImage} altText="Git Versioning" width="80%" />

### Use the SDK

You can use <APILink fn="mlflow.search_traces" /> to query for traces from a LoggedModel:

```python
import mlflow

# Using the context from enable_git_model_versioning()
context = mlflow.genai.enable_git_model_versioning()

traces = mlflow.search_traces(model_id=context.active_model.model_id)
print(traces)
```

You can use <APILink fn="mlflow.get_logged_model" /> to get details of the LoggedModel including Git metadata:

```python
import mlflow
import datetime

# Get the active Git-based version
context = mlflow.genai.enable_git_model_versioning()

# Get LoggedModel metadata
logged_model = mlflow.get_logged_model(model_id=context.active_model.model_id)

# Inspect basic properties
print(f"\n=== LoggedModel Information ===")
print(logged_model)

# Access Git metadata from tags
print(f"\n=== Git Information ===")
git_tags = {k: v for k, v in logged_model.tags.items() if k.startswith("mlflow.git")}
for tag_key, tag_value in git_tags.items():
    if tag_key == "mlflow.git.diff" and len(tag_value) > 100:
        print(f"{tag_key}: <diff with {len(tag_value)} characters>")
    else:
        print(f"{tag_key}: {tag_value}")
```

## Next Steps

Now that you understand the basics of Git-based application versioning with MLflow, you can explore these related topics:

<TilesGrid>
  <TileCard
    href="/genai/version-tracking/compare-app-versions"
    title="Compare App Versions"
    description="Learn systematic approaches to evaluate different versions using trace-based comparison"
    icon={BarChart3}
  />
  <TileCard
    href="/genai/version-tracking/quickstart"
    title="Version Tracking Quickstart"
    description="Get started quickly with a hands-on guide to version tracking in MLflow"
    icon={PlayCircle}
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

````
