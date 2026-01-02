---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 105
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 105 of 991)

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

---[FILE: workflow.mdx]---
Location: mlflow-master/docs/docs/genai/eval-monitor/scorers/llm-judge/workflow.mdx

```text
---
title: End-to-End Judge Workflow
sidebar_label: End-to-End Workflow
description: Complete workflow for developing, testing, and deploying custom LLM judges
---

import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"
import ImageBox from "@site/src/components/ImageBox";
import TabsWrapper from "@site/src/components/TabsWrapper";
import FeatureHighlights from "@site/src/components/FeatureHighlights";
import TilesGrid from "@site/src/components/TilesGrid";
import TileCard from "@site/src/components/TileCard";
import DAGLoop from "@site/src/components/DAGLoop";
import { Code, Brain, Target, Shield, ChartBar, FileText, RefreshCw, Users, Activity } from "lucide-react";

# End-to-End Judge Workflow

This guide walks through the complete lifecycle of developing and optimizing custom LLM judges using MLflow's judge APIs.

## Why This Workflow Matters

<FeatureHighlights features={[
  {
    icon: Target,
    title: "Systematic Development",
    description: "Move from subjective evaluation to data-driven judge development with clear metrics and goals."
  },
  {
    icon: Users,
    title: "Human-AI Alignment",
    description: "Ensure your judges reflect human expertise and domain knowledge through structured feedback."
  },
  {
    icon: RefreshCw,
    title: "Continuous Improvement",
    description: "Iterate and improve judge accuracy based on real-world performance and changing requirements."
  },
  {
    icon: Shield,
    title: "Production Ready",
    description: "Deploy judges with confidence knowing they've been tested and aligned with your quality standards."
  }
]} />

## The Development Cycle

<DAGLoop
  steps={[
    {
      icon: Code,
      title: "Create Judge",
      description: "Define evaluation criteria",
      detailedDescription: "Start with clear instructions that capture your domain expertise and evaluation requirements.",
      isFocus: true
    },
    {
      icon: Users,
      title: "Collect Feedback",
      description: "Gather human assessments",
      detailedDescription: "Run the judge on real traces and collect human feedback to establish ground truth."
    },
    {
      icon: Brain,
      title: "Align with Humans",
      description: "Optimize instructions",
      detailedDescription: "Use SIMBA optimizer to refine judge instructions based on human feedback."
    },
    {
      icon: ChartBar,
      title: "Test & Register",
      description: "Validate and deploy",
      detailedDescription: "Test the aligned judge and register it for production use when accuracy meets requirements."
    }
  ]}
  loopBackIcon={Activity}
  loopBackText="Iterate"
  loopBackDescription="Continue refining based on new data and requirements"
  circleSize={400}
/>

## Step 1: Create Initial Judge

Start by defining your evaluation criteria:

```python
from typing import Literal
import mlflow
from mlflow.genai.judges import make_judge
from mlflow.entities import AssessmentSource, AssessmentSourceType

# Create experiment for judge development
experiment_id = mlflow.create_experiment("support-judge-development")
mlflow.set_experiment(experiment_id=experiment_id)

# Create a judge for evaluating customer support responses
support_judge = make_judge(
    name="support_quality",
    instructions="""
    Evaluate the quality of this customer support response.

    Rate as one of: excellent, good, needs_improvement, poor

    Consider:
    - Does it address the customer's issue?
    - Is the tone professional and empathetic?
    - Are next steps clear?

    Focus on {{ outputs }} responding to {{ inputs }}.
    """,
    model="anthropic:/claude-opus-4-1-20250805",
    feedback_value_type=Literal["excellent", "good", "needs_improvement", "poor"],
)
```

## Step 2: Generate Traces and Collect Feedback

Run your application to generate traces, then collect human feedback:

```python
# Generate traces from your application
@mlflow.trace
def customer_support_app(issue):
    # Your application logic here
    return {"response": f"I'll help you with: {issue}"}


# Run application to generate traces
issues = [
    "Password reset not working",
    "Billing discrepancy",
    "Feature request",
    "Technical error",
]

trace_ids = []
for issue in issues:
    with mlflow.start_run(experiment_id=experiment_id):
        result = customer_support_app(issue)
        trace_id = mlflow.get_last_active_trace_id()
        trace_ids.append(trace_id)

        # Judge evaluates the trace
        assessment = support_judge(inputs={"issue": issue}, outputs=result)

        # Log judge's assessment
        mlflow.log_assessment(trace_id=trace_id, assessment=assessment)
```

### Collecting Human Feedback

After running your judge on traces, collect human feedback to establish ground truth:

<TabsWrapper>
<Tabs>
  <TabItem value="ui" label="MLflow UI (Recommended)" default>

**When to use:** You need to collect human feedback for judge alignment.

The MLflow UI provides the most intuitive way to review traces and add feedback:

### How to Collect Feedback

1. **Open the MLflow UI** and navigate to your experiment
2. **Go to the Traces tab** to see all generated traces
3. **Click on individual traces** to review:
   - Input data (customer issues)
   - Output responses
   - Judge's initial assessment
4. **Add your feedback** by clicking "Add Feedback"
5. **Select the assessment name** matching your judge (e.g., "support_quality")
6. **Provide your expert rating** (excellent, good, needs_improvement, or poor)

### Who Should Provide Feedback?

**If you're NOT the domain expert:**

- Ask domain experts or other developers to provide labels through the MLflow UI
- Distribute traces among team members with relevant expertise
- Consider organizing feedback sessions where experts can review batches together

**If you ARE the domain expert:**

- Review traces directly in the MLflow UI and add your expert assessments
- Create a rubric or guidelines document to ensure consistency
- Document your evaluation criteria for future reference

The UI automatically logs feedback in the correct format for alignment.

<ImageBox src="/images/assessments/add_feedback_ui.png" alt="Adding feedback through MLflow UI" width="800px" />

  </TabItem>
  <TabItem value="programmatic" label="Programmatic (Existing Labels)">

**When to use:** You already have ground truth labels from your data.

If you have existing ground truth labels, log them programmatically:

```python
# Example: You have ground truth labels
ground_truth = {
    trace_ids[0]: "excellent",  # Known good response
    trace_ids[1]: "poor",  # Known bad response
    trace_ids[2]: "good",  # Known acceptable response
}

for trace_id, truth_value in ground_truth.items():
    mlflow.log_feedback(
        trace_id=trace_id,
        name="support_quality",  # MUST match judge name
        value=truth_value,
        source=AssessmentSource(
            source_type=AssessmentSourceType.HUMAN, source_id="ground_truth"
        ),
    )
```

  </TabItem>
</Tabs>
</TabsWrapper>

## Step 3: Align Judge with Human Feedback

Use the SIMBA optimizer to improve judge accuracy:

```python
# Retrieve traces with both judge and human assessments
traces = mlflow.search_traces(experiment_ids=[experiment_id], return_type="list")

# Filter for traces with both assessments
aligned_traces = []
for trace in traces:
    assessments = trace.search_assessments(name="support_quality")
    has_judge = any(
        a.source.source_type == AssessmentSourceType.LLM_JUDGE for a in assessments
    )
    has_human = any(
        a.source.source_type == AssessmentSourceType.HUMAN for a in assessments
    )

    if has_judge and has_human:
        aligned_traces.append(trace)

print(f"Found {len(aligned_traces)} traces with both assessments")

# Align the judge (requires at least 10 traces)
if len(aligned_traces) >= 10:
    # Option 1: Use default optimizer (recommended for simplicity)
    aligned_judge = support_judge.align(aligned_traces)

    # Option 2: Explicitly specify optimizer with custom model
    # from mlflow.genai.judges.optimizers import SIMBAAlignmentOptimizer
    # optimizer = SIMBAAlignmentOptimizer(model="anthropic:/claude-opus-4-1-20250805")
    # aligned_judge = support_judge.align(aligned_traces, optimizer)

    print("Judge aligned successfully!")
else:
    print(f"Need at least 10 traces (have {len(aligned_traces)})")
```

## Step 4: Test and Register

Test the aligned judge and register it when ready:

```python
# Test the aligned judge on new data
test_cases = [
    {
        "inputs": {"issue": "Can't log in"},
        "outputs": {"response": "Let me reset your password for you."},
    },
    {
        "inputs": {"issue": "Refund request"},
        "outputs": {"response": "I'll process that refund immediately."},
    },
]

# Evaluate with aligned judge
for case in test_cases:
    assessment = aligned_judge(**case)
    print(f"Issue: {case['inputs']['issue']}")
    print(f"Judge rating: {assessment.value}")
    print(f"Rationale: {assessment.rationale}\n")

# Register the aligned judge for production use
aligned_judge.register(experiment_id=experiment_id)
print("Judge registered and ready for deployment!")
```

## Step 5: Use the Registered Judge in Production

Retrieve and use your registered judge with `mlflow.genai.evaluate()`:

```python
from mlflow.genai.scorers import get_scorer
import pandas as pd

# Retrieve the registered judge
production_judge = get_scorer(name="support_quality", experiment_id=experiment_id)

# Prepare evaluation data
eval_data = pd.DataFrame(
    [
        {
            "inputs": {"issue": "Can't access my account"},
            "outputs": {"response": "I'll help you regain access immediately."},
        },
        {
            "inputs": {"issue": "Slow website performance"},
            "outputs": {"response": "Let me investigate the performance issues."},
        },
    ]
)

# Run evaluation with the aligned judge
results = mlflow.genai.evaluate(data=eval_data, scorers=[production_judge])

# View results and metrics
print("Evaluation metrics:", results.metrics)
print("\nDetailed results:")
print(results.tables["eval_results_table"])

# Assessments are automatically logged to the traces
# You can view them in the MLflow UI Traces tab
```

## Best Practices

<FeatureHighlights features={[
  {
    icon: Target,
    title: "Clear Instructions",
    description: "Start with specific, unambiguous evaluation criteria that reflect your domain requirements."
  },
  {
    icon: Users,
    title: "Quality Feedback",
    description: "Ensure human feedback comes from domain experts who understand your evaluation standards."
  },
  {
    icon: ChartBar,
    title: "Sufficient Data",
    description: "Collect at least 10-15 traces with both assessments for effective alignment."
  },
  {
    icon: RefreshCw,
    title: "Iterate Often",
    description: "Regularly re-align judges as your application evolves and new edge cases emerge."
  }
]} />

## Next Steps

<TilesGrid>
  <TileCard
    icon={Brain}
    iconSize={48}
    title="Judge Alignment"
    description="Deep dive into alignment techniques and optimization"
    link="/genai/eval-monitor/scorers/llm-judge/alignment"
    linkText="Learn alignment →"
    containerHeight={64}
  />
  <TileCard
    icon={FileText}
    iconSize={48}
    title="Dataset Integration"
    description="Use judges with evaluation datasets for systematic testing"
    link="/genai/eval-monitor/scorers/llm-judge/datasets"
    linkText="Explore datasets →"
    containerHeight={64}
  />
  <TileCard
    icon={Code}
    iconSize={48}
    title="Main Documentation"
    description="Return to the custom judges overview"
    link="/genai/eval-monitor/scorers/llm-judge/"
    linkText="Back to overview →"
    containerHeight={64}
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

---[FILE: deepeval.mdx]---
Location: mlflow-master/docs/docs/genai/eval-monitor/scorers/third-party/deepeval.mdx

```text
import { APILink } from "@site/src/components/APILink";
import TileCard from '@site/src/components/TileCard';
import TilesGrid from '@site/src/components/TilesGrid';
import { Bot, GitBranch, Shield } from "lucide-react";

# DeepEval

[DeepEval](https://docs.confident-ai.com/) is a comprehensive evaluation framework for LLM applications that provides metrics for RAG systems, agents, conversational AI, and safety evaluation. MLflow's DeepEval integration allows you to use most DeepEval metrics as MLflow scorers.

## Prerequisites

DeepEval scorers require the `deepeval` package:

```bash
pip install deepeval
```

## Quick Start

You can call DeepEval scorers directly:

```python
from mlflow.genai.scorers.deepeval import AnswerRelevancy

scorer = AnswerRelevancy(threshold=0.7, model="openai:/gpt-4")
feedback = scorer(
    inputs="What is MLflow?",
    outputs="MLflow is an open-source platform for managing machine learning workflows.",
)

print(feedback.value)  # "yes" or "no"
print(feedback.metadata["score"])  # 0.85
```

Or use them in <APILink fn="mlflow.genai.evaluate">mlflow.genai.evaluate</APILink>:

```python
import mlflow
from mlflow.genai.scorers.deepeval import AnswerRelevancy, Faithfulness

eval_dataset = [
    {
        "inputs": {"query": "What is MLflow?"},
        "outputs": "MLflow is an open-source platform for managing machine learning workflows.",
    },
    {
        "inputs": {"query": "How do I track experiments?"},
        "outputs": "You can use mlflow.start_run() to begin tracking experiments.",
    },
]

results = mlflow.genai.evaluate(
    data=eval_dataset,
    scorers=[
        AnswerRelevancy(threshold=0.7, model="openai:/gpt-4"),
        Faithfulness(threshold=0.8, model="openai:/gpt-4"),
    ],
)
```

## Available DeepEval Scorers

DeepEval scorers are organized into categories based on their evaluation focus:

### RAG (Retrieval-Augmented Generation) Metrics

Evaluate retrieval quality and answer generation in RAG systems:

| Scorer                                                                                        | What does it evaluate?                                     | DeepEval Docs                                                  |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------- |
| <APILink fn="mlflow.genai.scorers.deepeval.AnswerRelevancy">AnswerRelevancy</APILink>         | Is the output relevant to the input query?                 | [Link](https://deepeval.com/docs/metrics-answer-relevancy)     |
| <APILink fn="mlflow.genai.scorers.deepeval.Faithfulness">Faithfulness</APILink>               | Is the output factually consistent with retrieval context? | [Link](https://deepeval.com/docs/metrics-faithfulness)         |
| <APILink fn="mlflow.genai.scorers.deepeval.ContextualRecall">ContextualRecall</APILink>       | Does retrieval context contain all necessary information?  | [Link](https://deepeval.com/docs/metrics-contextual-recall)    |
| <APILink fn="mlflow.genai.scorers.deepeval.ContextualPrecision">ContextualPrecision</APILink> | Are relevant nodes ranked higher than irrelevant ones?     | [Link](https://deepeval.com/docs/metrics-contextual-precision) |
| <APILink fn="mlflow.genai.scorers.deepeval.ContextualRelevancy">ContextualRelevancy</APILink> | Is the retrieval context relevant to the query?            | [Link](https://deepeval.com/docs/metrics-contextual-relevancy) |

### Agentic Metrics

Evaluate AI agent performance and behavior:

| Scorer                                                                                        | What does it evaluate?                                  | DeepEval Docs                                                  |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------- |
| <APILink fn="mlflow.genai.scorers.deepeval.TaskCompletion">TaskCompletion</APILink>           | Does the agent successfully complete its assigned task? | [Link](https://deepeval.com/docs/metrics-task-completion)      |
| <APILink fn="mlflow.genai.scorers.deepeval.ToolCorrectness">ToolCorrectness</APILink>         | Does the agent use the correct tools?                   | [Link](https://deepeval.com/docs/metrics-tool-correctness)     |
| <APILink fn="mlflow.genai.scorers.deepeval.ArgumentCorrectness">ArgumentCorrectness</APILink> | Are tool arguments correct?                             | [Link](https://deepeval.com/docs/metrics-argument-correctness) |
| <APILink fn="mlflow.genai.scorers.deepeval.StepEfficiency">StepEfficiency</APILink>           | Does the agent take an optimal path?                    | [Link](https://deepeval.com/docs/metrics-step-efficiency)      |
| <APILink fn="mlflow.genai.scorers.deepeval.PlanAdherence">PlanAdherence</APILink>             | Does the agent follow its plan?                         | [Link](https://deepeval.com/docs/metrics-plan-adherence)       |
| <APILink fn="mlflow.genai.scorers.deepeval.PlanQuality">PlanQuality</APILink>                 | Is the agent's plan well-structured?                    | [Link](https://deepeval.com/docs/metrics-plan-quality)         |

### Conversational Metrics

Evaluate multi-turn conversations and dialogue systems:

| Scorer                                                                                                  | What does it evaluate?                                  | DeepEval Docs                                                       |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------- |
| <APILink fn="mlflow.genai.scorers.deepeval.TurnRelevancy">TurnRelevancy</APILink>                       | Is each turn relevant to the conversation?              | [Link](https://deepeval.com/docs/metrics-turn-relevancy)            |
| <APILink fn="mlflow.genai.scorers.deepeval.RoleAdherence">RoleAdherence</APILink>                       | Does the assistant maintain its assigned role?          | [Link](https://deepeval.com/docs/metrics-role-adherence)            |
| <APILink fn="mlflow.genai.scorers.deepeval.KnowledgeRetention">KnowledgeRetention</APILink>             | Does the agent retain information across turns?         | [Link](https://deepeval.com/docs/metrics-knowledge-retention)       |
| <APILink fn="mlflow.genai.scorers.deepeval.ConversationCompleteness">ConversationCompleteness</APILink> | Are all user questions addressed?                       | [Link](https://deepeval.com/docs/metrics-conversation-completeness) |
| <APILink fn="mlflow.genai.scorers.deepeval.GoalAccuracy">GoalAccuracy</APILink>                         | Does the conversation achieve its goal?                 | [Link](https://deepeval.com/docs/metrics-goal-accuracy)             |
| <APILink fn="mlflow.genai.scorers.deepeval.ToolUse">ToolUse</APILink>                                   | Does the agent use tools appropriately in conversation? | [Link](https://deepeval.com/docs/metrics-tool-use)                  |
| <APILink fn="mlflow.genai.scorers.deepeval.TopicAdherence">TopicAdherence</APILink>                     | Does the conversation stay on topic?                    | [Link](https://deepeval.com/docs/metrics-topic-adherence)           |

### Safety Metrics

Detect harmful content, bias, and policy violations:

| Scorer                                                                            | What does it evaluate?                                               | DeepEval Docs                                            |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------- |
| <APILink fn="mlflow.genai.scorers.deepeval.Bias">Bias</APILink>                   | Does the output contain biased content?                              | [Link](https://deepeval.com/docs/metrics-bias)           |
| <APILink fn="mlflow.genai.scorers.deepeval.Toxicity">Toxicity</APILink>           | Does the output contain toxic language?                              | [Link](https://deepeval.com/docs/metrics-toxicity)       |
| <APILink fn="mlflow.genai.scorers.deepeval.NonAdvice">NonAdvice</APILink>         | Does the model inappropriately provide advice in restricted domains? | [Link](https://deepeval.com/docs/metrics-non-advice)     |
| <APILink fn="mlflow.genai.scorers.deepeval.Misuse">Misuse</APILink>               | Could the output be used for harmful purposes?                       | [Link](https://deepeval.com/docs/metrics-misuse)         |
| <APILink fn="mlflow.genai.scorers.deepeval.PIILeakage">PIILeakage</APILink>       | Does the output leak personally identifiable information?            | [Link](https://deepeval.com/docs/metrics-pii-leakage)    |
| <APILink fn="mlflow.genai.scorers.deepeval.RoleViolation">RoleViolation</APILink> | Does the assistant break out of its assigned role?                   | [Link](https://deepeval.com/docs/metrics-role-violation) |

### Other

Additional evaluation metrics for common use cases:

| Scorer                                                                                | What does it evaluate?                                 | DeepEval Docs                                              |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------- |
| <APILink fn="mlflow.genai.scorers.deepeval.Hallucination">Hallucination</APILink>     | Does the LLM fabricate information not in the context? | [Link](https://deepeval.com/docs/metrics-hallucination)    |
| <APILink fn="mlflow.genai.scorers.deepeval.Summarization">Summarization</APILink>     | Is the summary accurate and complete?                  | [Link](https://deepeval.com/docs/metrics-summarization)    |
| <APILink fn="mlflow.genai.scorers.deepeval.JsonCorrectness">JsonCorrectness</APILink> | Does JSON output match the expected schema?            | [Link](https://deepeval.com/docs/metrics-json-correctness) |
| <APILink fn="mlflow.genai.scorers.deepeval.PromptAlignment">PromptAlignment</APILink> | Does the output align with prompt instructions?        | [Link](https://deepeval.com/docs/metrics-prompt-alignment) |

### Non-LLM

Fast, rule-based metrics that don't require LLM calls:

| Scorer                                                                          | What does it evaluate?                     | DeepEval Docs                                           |
| ------------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------- |
| <APILink fn="mlflow.genai.scorers.deepeval.ExactMatch">ExactMatch</APILink>     | Does output exactly match expected output? | [Link](https://deepeval.com/docs/metrics-exact-match)   |
| <APILink fn="mlflow.genai.scorers.deepeval.PatternMatch">PatternMatch</APILink> | Does output match a regex pattern?         | [Link](https://deepeval.com/docs/metrics-pattern-match) |

## Creating Scorers by Name

If a particular DeepEval metric is not listed above, you can create it dynamically using <APILink fn="mlflow.genai.scorers.deepeval.get_scorer">get_scorer</APILink>:

```python
from mlflow.genai.scorers.deepeval import get_scorer

# Create scorer by name
scorer = get_scorer(
    metric_name="AnswerRelevancy",
    threshold=0.7,
    model="openai:/gpt-4",
)

feedback = scorer(
    inputs="What is MLflow?",
    outputs="MLflow is a platform for ML workflows.",
)
```

## Configuration

DeepEval scorers accept all parameters supported by the underlying DeepEval metrics. Any additional keyword arguments are passed directly to the DeepEval metric constructor:

```python
from mlflow.genai.scorers.deepeval import AnswerRelevancy, TurnRelevancy

# Common parameters
scorer = AnswerRelevancy(
    model="openai:/gpt-4",  # Model URI (also supports "databricks", "databricks:/endpoint", etc.)
    threshold=0.7,  # Pass/fail threshold (0.0-1.0, scorer passes if score >= threshold)
    include_reason=True,  # Include detailed rationale in feedback
)

# Metric-specific parameters are passed through to DeepEval
conversational_scorer = TurnRelevancy(
    model="openai:/gpt-4o",
    threshold=0.8,
    window_size=3,  # DeepEval-specific: number of conversation turns to consider
    strict_mode=True,  # DeepEval-specific: enforce stricter evaluation criteria
)
```

Refer to the [DeepEval documentation](https://docs.confident-ai.com/) for metric-specific parameters.

## Next Steps

<TilesGrid>
  <TileCard
    icon={Bot}
    title="Evaluate Agents"
    description="Learn specialized techniques for evaluating AI agents with tool usage"
    href="/genai/eval-monitor/running-evaluation/agents"
  />
  <TileCard
    icon={GitBranch}
    title="Evaluate Traces"
    description="Evaluate production traces to understand application behavior"
    href="/genai/eval-monitor/running-evaluation/traces"
  />
  <TileCard
    icon={Shield}
    title="Predefined Scorers"
    description="Explore MLflow's built-in evaluation scorers"
    href="/genai/eval-monitor/scorers/llm-judge/predefined"
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/genai/eval-monitor/scorers/third-party/index.mdx

```text
# Third-party Scorers

MLflow integrates with popular third-party evaluation frameworks, allowing you to leverage their specialized metrics within MLflow's evaluation workflow. This provides access to third party library's evaluation metrics while maintaining a consistent MLflow interface.

MLflow's third-party scorer integrations provide:

- **Consistent MLflow API** for all evaluation frameworks
- **Unified evaluation** across multiple metric sources
- **Seamless integration** with `mlflow.genai.evaluate()`

Click an integration below to get started with detailed setup instructions.

## Available Integrations

import TileCard from '@site/src/components/TileCard';
import TilesGrid from '@site/src/components/TilesGrid';

<TilesGrid>
  <TileCard
    image="/images/logos/deepeval-logo.png"
    imageHeight={40}
    title="DeepEval"
    href="/genai/eval-monitor/scorers/third-party/deepeval"
  />
</TilesGrid>

:::info Missing an Integration?
Is your favorite evaluation framework missing? Consider [submitting a feature request](https://github.com/mlflow/mlflow/issues/new?assignees=&labels=enhancement&projects=&template=feature_request_template.yaml&title=%5BFR%5D).
:::
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/genai/flavors/index.mdx

```text
import { CardGroup, SmallLogoCard } from "@site/src/components/Card";

# MLflow GenAI Packaging Integrations

MLflow 3 delivers built-in support for packaging and deploying applications written with the GenAI frameworks you depend on. Whether you're orchestrating chains with LangChain or LangGraph, indexing documents in LlamaIndex, wiring up agent patterns via ChatModel and ResponseAgent, or rolling your own with a PythonModel, MLflow provides native packaging and deployment APIs ("flavors") to streamline your path to production.

:::note OpenAI Model Logging Deprecated
The `mlflow.openai.log_model()` API has been deprecated. If you were using it to save prompts, please migrate to the [MLflow Prompt Registry](/genai/prompt-registry), which provides superior versioning, aliasing, lineage tracking, and collaboration features for managing prompts separately from models.
:::

## Why MLflow Integrations?

By choosing MLflow's native flavors, you gain end-to-end visibility and control without swapping tools:

- **Unified Tracking & Models**: All calls, parameters, artifacts, and prompt templates become tracked entities within MLflow Experiments. Serialized GenAI application code becomes a LoggedModel—viewable and referenceable within the MLflow UI and APIs.
- **Zero-Boilerplate Setup**: A single `mlflow.<flavor>.log_model(...)` call (or one line of auto-instrumentation) wires into your existing code.
- **Reproducibility by Default**: MLflow freezes your prompt template, application parameters, framework versions, and dependencies so you can reproduce any result, anytime.
- **Seamless Transition to Serving**: Each integration produces a standardized MLflow Model you can deploy for batch scoring or real-time inference with `mlflow models serve`.

---

## Start Integrating in Minutes

Before you begin, make sure you have:

- Python 3.9+ and MLflow 3.x installed (`pip install --upgrade mlflow`)
- Credentials or API keys for your chosen provider (e.g., `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`)
- An MLflow Tracking Server (local or remote)

:::tip Ready to dive in?
Pick your integration from the list below and follow the concise guide—each one gets you up and running in under 10 minutes.
:::

---

## Integration Guides

MLflow supports first-party flavors for these GenAI frameworks and patterns. Click to explore:

<CardGroup isSmall>
  <SmallLogoCard link="/genai/flavors/langchain">
    <span>![LangChain Logo](/images/logos/langchain-logo.png)</span>
  </SmallLogoCard>
  <SmallLogoCard link="/genai/flavors/llama-index">
    <span>![LlamaIndex Logo](/images/logos/llamaindex-logo.svg)</span>
  </SmallLogoCard>
  <SmallLogoCard link="/genai/flavors/dspy">
    <span>![DSPy Logo](/images/logos/dspy-logo.png)</span>
  </SmallLogoCard>
  <SmallLogoCard link="/ml/deep-learning/transformers">
    <span>![HuggingFace Logo](/images/logos/huggingface-logo.svg)</span>
  </SmallLogoCard>
  <SmallLogoCard link="/ml/deep-learning/sentence-transformers">
    <span>![SentenceTransformers Logo](/images/logos/sentence-transformers-logo.png)</span>
  </SmallLogoCard>
  <SmallLogoCard link="/genai/flavors/chat-model-intro">
    <b>Custom Packaging with ChatModel</b>
  </SmallLogoCard>
  <SmallLogoCard link="/genai/flavors/custom-pyfunc-for-llms">
    <b>Custom Packaging with PythonModel</b>
  </SmallLogoCard>
</CardGroup>
---

## Continue Your Journey

Once your integration is in place, take advantage of MLflow's full LLMOps platform:

### 🔍 Observability & Debugging

- [Tracing & Observability](/genai/tracing)

### 🧪 Evaluation & QA

- [LLM Evaluation Framework](https://docs.databricks.com/aws/en/mlflow3/genai/getting-started/eval.html)

### 🚀 Deployment & Monitoring

- [Prompt Engineering UI](/genai/prompt-registry/prompt-engineering)
- [Application Serving](/genai/serving)
```

--------------------------------------------------------------------------------

````
