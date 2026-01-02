---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 103
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 103 of 991)

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

---[FILE: agentic-overview.mdx]---
Location: mlflow-master/docs/docs/genai/eval-monitor/scorers/llm-judge/agentic-overview.mdx

```text
---
title: Agent-based Scorers (Agent-as-a-Judge)
description: Understanding how judges become autonomous agents for deep trace analysis
---

import { APILink } from "@site/src/components/APILink";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import ImageBox from "@site/src/components/ImageBox";
import TabsWrapper from "@site/src/components/TabsWrapper";
import TilesGrid from "@site/src/components/TilesGrid";
import TileCard from "@site/src/components/TileCard";
import { Brain, Wrench, Users } from "lucide-react";

# Agent-based Scorer (aka. Agent-as-a-Judge)

Agent-as-a-Judge represents a paradigm shift in LLM evaluation. Instead of simply assessing inputs and outputs, these judges act as **autonomous agents** equipped with tools to investigate your application's execution in depth.

## How it works

![](/images/mlflow-3/eval-monitor/scorers/llm-judge-vs-agent-judge.png)

Agent-as-a-Judge uses the following tools to investigate traces logged to the MLflow backend. These tools enable the judge to act like an experienced debugger, systematically exploring your application's execution.

| Tool               | Description                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| `GetTraceInfo`     | Retrieves high-level information about a trace including timing, status, and metadata.               |
| `ListSpans`        | Lists all spans in a trace with their hierarchy, timing, and basic attributes.                       |
| `GetSpan`          | Fetches detailed information about a specific span including inputs, outputs, and custom attributes. |
| `SearchTraceRegex` | Searches for patterns across all span data using regular expressions.                                |

:::info Why not directly pass a trace to LLM?

While it works for simple cases, traces from real-world applications are often large and complex. Passing the entire trace to LLM will quickly run into context window limit and degrade the judge accuracy. Agentic-approach uses tools to explore the trace structure and fetch the necessary details without eating up the context window.

:::

## Comparison with LLM-as-a-Judge

Understanding when to use each approach depends on where you are in your development lifecycle:

| **Aspect**             | **Agent-as-a-Judge**                       | **LLM-as-a-Judge**                                 |
| ---------------------- | ------------------------------------------ | -------------------------------------------------- |
| **Ease of setup**      | Simple - just describe what to investigate | Requires careful prompt engineering and refinement |
| **What they evaluate** | Complete execution traces and trajectory   | Specific inputs and outputs fields                 |
| **Performance**        | Slower (explores trace in detail)          | Fast execution                                     |
| **Cost**               | Higher (more context and tool usage)       | Lower (less context)                               |

### When to use Agent-as-a-Judge?

Agent-as-a-Judge is suitable for **bootstrapping** the evaluation flywheel.

- Getting started with a new application
- Revising and refining your agent
- Identifying failure patterns
- Understanding unexpected behavior

### When to use LLM-as-a-Judge?

LLM-as-a-Judge is more efficient for evaluating a particular criteria, therefore suitable for **continuous evaluation** and **production use**.

- Production monitoring
- Regression testing
- Final validation before deployment
- Meeting specific quality expectations

## Quickstart

To create an Agent-as-a-Judge, simply call the `make_judge` API and pass an instruction with the **`{{ trace }}`** template variable:

```python
import mlflow
from mlflow.genai.judges import make_judge
from typing import Literal
import time

performance_judge = make_judge(
    name="performance_analyzer",
    instructions=(
        "Analyze the {{ trace }} for performance issues.\n\n"
        "Check for:\n"
        "- Operations taking longer than 2 seconds\n"
        "- Redundant API calls or database queries\n"
        "- Inefficient data processing patterns\n"
        "- Proper use of caching mechanisms\n\n"
        "Rate as: 'optimal', 'acceptable', or 'needs_improvement'"
    ),
    feedback_value_type=Literal["optimal", "acceptable", "needs_improvement"],
    model="openai:/gpt-5",
    # model="anthropic:/claude-opus-4-1-20250805",
)
```

:::note

The usage of `{{ trace }}` template variable is important. If the template does not contain `{{ trace }}`, MLflow assumes the scorer is a normal LLM-as-a-Judge and does not use MCP tools.

:::

Then, generate a trace from your application and pass it to the scorer:

```python
@mlflow.trace
def slow_data_processor(query: str):
    """Example application with performance bottlenecks."""
    with mlflow.start_span("fetch_data") as span:
        time.sleep(2.5)
        span.set_inputs({"query": query})
        span.set_outputs({"data": ["item1", "item2", "item3"]})

    with mlflow.start_span("process_data") as span:
        for i in range(3):
            with mlflow.start_span(f"redundant_api_call_{i}"):
                time.sleep(0.5)
        span.set_outputs({"processed": "results"})

    return "Processing complete"


result = slow_data_processor("SELECT * FROM users")
trace_id = mlflow.get_last_active_trace_id()
trace = mlflow.get_trace(trace_id)

feedback = performance_judge(trace=trace)

print(f"Performance Rating: {feedback.value}")
print(f"Analysis: {feedback.rationale}")
```

```
Performance Rating: needs_improvement
Analysis: Found critical performance issues:
1. The 'fetch_data' span took 2.5 seconds, exceeding the 2-second threshold
2. Detected 3 redundant API calls (redundant_api_call_0, redundant_api_call_1,
   redundant_api_call_2) that appear to be duplicate operations
3. Total execution time of 4 seconds could be optimized by parallelizing
   the redundant operations or implementing caching
```

<ImageBox src="/images/mlflow-3/eval-monitor/scorers/agentic-judge-result.png" alt="Agent-as-a-Judge Evaluation Results" />

## Running the Judge against Batch Traces

To apply the scorer to a batch of traces, use the <APILink fn="mlflow.genai.evaluate">mlflow.genai.evaluate</APILink> API.

```python
import mlflow

# Retrieve traces from MLflow
traces = mlflow.search_traces(filter_string="timestamp > 1727174400000")

# Run evaluation with Agent-as-a-Judge
results = mlflow.genai.evaluate(
    data=traces,
    scorers=[performance_judge],
)
```

## Advanced Examples

<TabsWrapper>
  <Tabs>
  <TabItem value="tool_usage" label="Tool Usage Analysis">

```python
tool_optimization_judge = make_judge(
    name="tool_optimizer",
    instructions=(
        "Analyze tool usage patterns in {{ trace }}.\n\n"
        "Check for:\n"
        "1. Unnecessary tool calls (could be answered without tools)\n"
        "2. Wrong tool selection (better tool available)\n"
        "3. Inefficient sequencing (could parallelize or reorder)\n"
        "4. Missing tool usage (should have used a tool)\n\n"
        "Provide specific optimization suggestions.\n"
        "Rate efficiency as: 'optimal', 'good', 'suboptimal', or 'poor'"
    ),
    feedback_value_type=Literal["optimal", "good", "suboptimal", "poor"],
    model="anthropic:/claude-opus-4-1-20250805",
)
```

  </TabItem>
  <TabItem value="loop_detection" label="Loop Detection">

```python
loop_detector_judge = make_judge(
    name="loop_detector",
    instructions=(
        "Detect problematic loops in {{ trace }}.\n\n"
        "Identify:\n"
        "1. Infinite loop risks\n"
        "2. Unnecessary iterations\n"
        "3. Circular reasoning patterns\n"
        "4. Recursive calls without proper termination\n\n"
        "Report specific span patterns that indicate issues.\n"
        "Classify as: 'clean', 'warning', or 'critical'"
    ),
    feedback_value_type=Literal["clean", "warning", "critical"],
    model="anthropic:/claude-opus-4-1-20250805",
)
```

  </TabItem>
  <TabItem value="reasoning_chain" label="Reasoning Analysis">

```python
reasoning_judge = make_judge(
    name="reasoning_validator",
    instructions=(
        "Evaluate the reasoning chain in {{ trace }}.\n\n"
        "Analysis criteria:\n"
        "1. Logical Progression: Does each step follow logically from the previous?\n"
        "2. Assumption Validity: Are assumptions reasonable and stated?\n"
        "3. Evidence Usage: Is evidence properly cited and used?\n"
        "4. Conclusion Soundness: Does the conclusion follow from the premises?\n\n"
        "Identify specific reasoning flaws with span IDs.\n"
        "Score 1-100 for reasoning quality."
    ),
    feedback_value_type=int,
    model="anthropic:/claude-opus-4-1-20250805",
)
```

  </TabItem>
  <TabItem value="rag" label="RAG Agent Evaluation">

```python
rag_judge = make_judge(
    name="rag_evaluator",
    instructions=(
        "Evaluate the RAG agent's behavior in {{ trace }}.\n\n"
        "Check for:\n"
        "1. Were the right documents retrieved?\n"
        "2. Is the response grounded in the retrieved context?\n"
        "3. Are sources properly cited?\n\n"
        "Rate as: 'good', 'acceptable', or 'poor'"
    ),
    feedback_value_type=Literal["good", "acceptable", "poor"],
    model="anthropic:/claude-opus-4-1-20250805",
)


# Use with your RAG pipeline
@mlflow.trace
def rag_pipeline(query):
    docs = retrieve_documents(query)
    response = generate_with_context(query, docs)
    return response


result = rag_pipeline("What is MLflow?")
trace = mlflow.get_last_active_trace()
evaluation = rag_judge(trace=trace)
```

  </TabItem>
  <TabItem value="error_handling" label="Error Handling Assessment">
```python
error_handling_judge = make_judge(
    name="error_handler_checker",
    instructions=(
        "Analyze error handling in the {{ trace }}.\n\n"
        "Look for:\n"
        "1. Spans with error status or exceptions\n"
        "2. Retry attempts and their patterns\n"
        "3. Fallback mechanisms\n"
        "4. Error propagation and recovery\n\n"
        "Identify specific error scenarios and how they were handled.\n"
        "Rate as: 'robust', 'adequate', or 'fragile'"
    ),
    feedback_value_type=Literal["robust", "adequate", "fragile"],
    model="anthropic:/claude-opus-4-1-20250805",
)
```
  </TabItem>
</Tabs>
</TabsWrapper>

## Debugging Agent Judges

To see the actual MCP tool calls that the Agent-as-a-Judge makes while analyzing your trace, enable debug logging:

```python
import logging

# Enable debug logging to see agent tool calls
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("mlflow.genai.judges")
logger.setLevel(logging.DEBUG)

# Now when you run the judge, you'll see detailed tool usage
feedback = performance_judge(trace=trace)
```

With debug logging enabled, you'll see output like:

```
DEBUG:mlflow.genai.judges:Calling tool: GetTraceInfo
DEBUG:mlflow.genai.judges:Tool response: {"trace_id": "abc123", "duration_ms": 4000, ...}
DEBUG:mlflow.genai.judges:Calling tool: ListSpans
DEBUG:mlflow.genai.judges:Tool response: [{"span_id": "def456", "name": "fetch_data", ...}]
DEBUG:mlflow.genai.judges:Calling tool: GetSpan with span_id=def456
DEBUG:mlflow.genai.judges:Tool response: {"duration_ms": 2500, "inputs": {"query": "SELECT * FROM users"}, ...}
```

## Next Steps

<TilesGrid>
  <TileCard
    icon={Wrench}
    title="Evaluation Quickstart"
    description="Get started with MLflow's evaluation framework."
    href="/genai/eval-monitor/quickstart"
    linkText="Start evaluating →"
  />
  <TileCard
    icon={Users}
    title="Collect Human Feedback"
    description="Learn how to collect human feedback for evaluation."
    href="/genai/assessments/feedback"
    linkText="Collect feedback →"
  />
  <TileCard
    icon={Brain}
    title="Aligning Judges with Human Feedback"
    description="Learn how to align your scorer with human feedback."
    href="/genai/eval-monitor/scorers/llm-judge/alignment"
    linkText="Learn alignment →"
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

---[FILE: alignment.mdx]---
Location: mlflow-master/docs/docs/genai/eval-monitor/scorers/llm-judge/alignment.mdx

```text
import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"
import { APILink } from "@site/src/components/APILink"
import TabsWrapper from "@site/src/components/TabsWrapper"
import FeatureHighlights from "@site/src/components/FeatureHighlights"
import ConceptOverview from "@site/src/components/ConceptOverview"
import TilesGrid from "@site/src/components/TilesGrid"
import TileCard from "@site/src/components/TileCard"
import DAGLoop from "@site/src/components/DAGLoop"
import { Brain, RefreshCw, Target, Users, ChartBar, GitBranch, Shield, Database, Settings } from "lucide-react"
import ImageBox from "@site/src/components/ImageBox"

# Judge Alignment: Teaching AI to Match Human Preferences

## Transform Generic Judges into Domain Experts

Judge alignment is the process of refining LLM judges to match human evaluation standards. Through systematic learning from human feedback, judges evolve from generic evaluators to domain-specific experts that understand your unique quality criteria.

## Why Alignment Matters

Even the most sophisticated LLMs need calibration to match your specific evaluation standards. What constitutes "good" customer service varies by industry. Medical accuracy requirements differ from general health advice. Alignment bridges this gap, teaching judges your specific quality standards through example.

<FeatureHighlights features={[
  {
    icon: Brain,
    title: "Learn from Expert Feedback",
    description: "Judges improve by learning from your domain experts' assessments, capturing nuanced quality criteria that generic prompts miss."
  },
  {
    icon: Target,
    title: "Consistent Standards at Scale",
    description: "Once aligned, judges apply your exact quality standards consistently across millions of evaluations."
  },
  {
    icon: RefreshCw,
    title: "Continuous Improvement",
    description: "As your standards evolve, judges can be re-aligned with new feedback, maintaining relevance over time."
  },
  {
    icon: Shield,
    title: "Reduced Evaluation Errors",
    description: "Aligned judges show 30-50% reduction in false positives/negatives compared to generic evaluation prompts."
  }
]} />

## How Judge Alignment Works

<DAGLoop
  title="Alignment Lifecycle"
  steps={[
    {
      icon: Settings,
      title: "Create Initial Judge",
      description: "Define basic criteria",
      detailedDescription: "Start with a judge that has basic evaluation instructions. This will be refined through the alignment process."
    },
    {
      icon: Users,
      title: "Collect Human Feedback",
      description: "Experts assess outputs",
      detailedDescription: "Domain experts review judge outputs and provide ground truth assessments that capture your specific quality standards."
    },
    {
      icon: Brain,
      title: "Run Alignment",
      description: "Learn from patterns",
      detailedDescription: "The SIMBA optimizer analyzes feedback patterns and automatically refines judge instructions to match human preferences.",
      isFocus: true
    },
    {
      icon: Target,
      title: "Validate Accuracy",
      description: "Test improvements",
      detailedDescription: "Compare aligned judge against baseline on held-out test data to verify genuine accuracy improvements."
    },
    {
      icon: ChartBar,
      title: "Monitor & Iterate",
      description: "Track performance",
      detailedDescription: "Monitor judge accuracy in production and collect new feedback for continuous improvement."
    },
  ]}
  loopBackIcon={RefreshCw}
  loopBackText="Continuous Refinement"
  loopBackDescription="As standards evolve, continue collecting feedback and re-aligning"
  circleSize={500}
/>

## Quick Start: Align Your First Judge

:::warning[Critical Requirement for Alignment]
For alignment to work, each trace must have BOTH judge assessments AND human feedback **with the same assessment name**. The alignment process learns by comparing judge assessments with human feedback on the same traces.

**The assessment name must exactly match the judge name** - if your judge is named "product_quality", both the judge's assessments and human feedback must use the name "product_quality".

The order doesn't matter - humans can provide feedback before or after the judge evaluates.
:::

### Step 1: Setup and Generate Traces

First, create your judge and generate traces with initial assessments:

```python
from mlflow.genai.judges import make_judge
from mlflow.genai.judges.optimizers import SIMBAAlignmentOptimizer
from mlflow.entities import AssessmentSource, AssessmentSourceType
from typing import Literal
import mlflow

# Create experiment and initial judge
experiment_id = mlflow.create_experiment("product-quality-alignment")
mlflow.set_experiment(experiment_id=experiment_id)

initial_judge = make_judge(
    name="product_quality",
    instructions=(
        "Evaluate if the product description in {{ outputs }} "
        "is accurate and helpful for the query in {{ inputs }}. "
        "Rate as: excellent, good, fair, or poor"
    ),
    feedback_value_type=Literal["excellent", "good", "fair", "poor"],
    model="anthropic:/claude-opus-4-1-20250805",
)

# Generate traces from your application (minimum 10 required)
traces = []
for i in range(15):  # Generate 15 traces (more than minimum of 10)
    with mlflow.start_span(f"product_description_{i}") as span:
        # Your application logic
        query = f"Product query {i}"
        description = f"Product description for query {i}"
        span.set_inputs({"query": query})
        span.set_outputs({"description": description})
        traces.append(span.trace_id)

# Run the judge on these traces to get initial assessments
for trace_id in traces:
    trace = mlflow.get_trace(trace_id)

    # Extract inputs and outputs from the trace for field-based evaluation
    inputs = trace.data.spans[0].inputs  # Get inputs from trace
    outputs = trace.data.spans[0].outputs  # Get outputs from trace

    # Judge evaluates using field-based approach (inputs/outputs)
    judge_result = initial_judge(inputs=inputs, outputs=outputs)
    # Judge's assessment is automatically logged when called
```

### Step 2: Collect Human Feedback

After running your judge on traces, you need to collect human feedback. You can either:

- **Use the MLflow UI** (recommended): Review traces and add feedback through the intuitive interface
- **Log programmatically**: If you already have ground truth labels

For detailed instructions on collecting feedback, see [Collecting Feedback for Alignment](#collecting-feedback-for-alignment) below.

### Step 3: Align and Register

After collecting feedback, align your judge and register it:

<TabsWrapper>
<Tabs>
  <TabItem value="default" label="Default Optimizer (Recommended)" default>

```python
# Retrieve traces with both judge and human assessments
traces_for_alignment = mlflow.search_traces(
    experiment_ids=[experiment_id], max_results=15, return_type="list"
)

# Align the judge using human corrections (minimum 10 traces recommended)
if len(traces_for_alignment) >= 10:
    optimizer = SIMBAAlignmentOptimizer(model="anthropic:/claude-opus-4-1-20250805")

    # Run alignment - shows minimal progress by default:
    # INFO: Starting SIMBA optimization with 15 examples (set logging to DEBUG for detailed output)
    # INFO: SIMBA optimization completed
    aligned_judge = initial_judge.align(optimizer, traces_for_alignment)

    # Register the aligned judge
    aligned_judge.register(experiment_id=experiment_id)
    print("Judge aligned successfully with human feedback")
else:
    print(f"Need at least 10 traces for alignment, have {len(traces_for_alignment)}")
```

  </TabItem>
  <TabItem value="explicit" label="Explicit Optimizer">

```python
from mlflow.genai.judges.optimizers import SIMBAAlignmentOptimizer

# Retrieve traces with both judge and human assessments
traces_for_alignment = mlflow.search_traces(
    experiment_ids=[experiment_id], max_results=15, return_type="list"
)

# Align the judge using human corrections (minimum 10 traces recommended)
if len(traces_for_alignment) >= 10:
    # Explicitly specify SIMBA with custom model configuration
    optimizer = SIMBAAlignmentOptimizer(model="anthropic:/claude-opus-4-1-20250805")
    aligned_judge = initial_judge.align(traces_for_alignment, optimizer)

    # Register the aligned judge
    aligned_judge.register(experiment_id=experiment_id)
    print("Judge aligned successfully with human feedback")
else:
    print(f"Need at least 10 traces for alignment, have {len(traces_for_alignment)}")
```

  </TabItem>
</Tabs>
</TabsWrapper>

## The SIMBA Alignment Optimizer

MLflow provides the **default alignment optimizer** using [DSPy's implementation of SIMBA](https://dspy.ai/api/optimizers/SIMBA/) (Simplified Multi-Bootstrap Aggregation). When you call `align()` without specifying an optimizer, the SIMBA optimizer is used automatically:

```python
# Default: Uses SIMBA optimizer automatically
aligned_judge = initial_judge.align(traces_with_feedback)

# Explicit: Same as above but with custom model specification
from mlflow.genai.judges.optimizers import SIMBAAlignmentOptimizer

optimizer = SIMBAAlignmentOptimizer(
    model="anthropic:/claude-opus-4-1-20250805"  # Model used for optimization
)
aligned_judge = initial_judge.align(traces_with_feedback, optimizer)

# Requirements for alignment:
# - Minimum 10 traces with BOTH judge assessments and human feedback
# - Both assessments must use the same name (matching the judge name)
# - Order doesn't matter - humans can assess before or after judge
# - Mix of agreements and disagreements between judge and human recommended
```

:::tip[Default Optimizer Behavior]
When using `align()` without an optimizer parameter, MLflow automatically uses the SIMBA optimizer. This simplifies the alignment process while still allowing customization when needed.
:::

### Controlling Optimization Output

By default, alignment shows minimal progress information to keep logs clean. If you need to debug the optimization process or see detailed iteration progress, enable DEBUG logging:

```python
import logging

# Enable detailed optimization output
logging.getLogger("mlflow.genai.judges.optimizers.simba").setLevel(logging.DEBUG)

# Now alignment will show:
# - Detailed iteration-by-iteration progress
# - Score improvements at each step
# - Strategy selection details
# - Full DSPy optimization output

aligned_judge = initial_judge.align(optimizer, traces_with_feedback)

# Reset to default (minimal output) after debugging
logging.getLogger("mlflow.genai.judges.optimizers.simba").setLevel(logging.INFO)
```

:::tip[When to Use Detailed Logging]
Enable DEBUG logging when:

- Optimization seems stuck or is taking too long
- You want to understand how the optimizer is improving instructions
- Debugging alignment failures or unexpected results
- Learning how SIMBA optimization works internally

Keep it at INFO (default) for production use to avoid verbose output.

:::

## Collecting Feedback for Alignment

The quality of alignment depends on the quality and quantity of feedback. Choose the approach that best fits your situation:

### Feedback Collection Approaches

<TabsWrapper>
<Tabs>
  <TabItem value="ui" label="MLflow UI (Recommended)" default>

**When to use:** You don't have existing ground truth labels and need to collect human feedback.

The MLflow UI provides an intuitive interface for reviewing traces and adding feedback:

1. **Navigate to the Traces tab** in your experiment
2. **Click on individual traces** to review inputs, outputs, and any existing judge assessments
3. **Add feedback** by clicking the "Add Feedback" button
4. **Select the assessment name** that matches your judge name (e.g., "product_quality")
5. **Provide your rating** according to your evaluation criteria

**Tips for effective feedback collection:**

- If you're **not a domain expert**: Distribute traces among team members or domain experts for review
- If you **are the domain expert**: Create a rubric or guidelines document to ensure consistency
- For **multiple reviewers**: Organize feedback sessions where reviewers can work through batches together
- For **consistency**: Document your evaluation criteria clearly before starting

The UI automatically logs feedback in the correct format for alignment.

<ImageBox src="/images/assessments/add_feedback_ui.png" alt="MLflow UI Feedback Interface" width="800px" />

  </TabItem>
  <TabItem value="programmatic" label="Programmatic (Ground Truth)">

**When to use:** You have existing ground truth labels from your data.

If you already have labeled data, you can programmatically log it as feedback:

```python
import mlflow
from mlflow.entities import AssessmentSource, AssessmentSourceType

# Your existing ground truth dataset
ground_truth_data = [
    {"trace_id": "trace1", "label": "excellent", "query": "What is MLflow?"},
    {"trace_id": "trace2", "label": "poor", "query": "How to use tracking?"},
    {"trace_id": "trace3", "label": "good", "query": "How to log models?"},
]

# Log ground truth as feedback for alignment
for item in ground_truth_data:
    mlflow.log_feedback(
        trace_id=item["trace_id"],
        name="product_quality",  # Must match your judge name
        value=item["label"],
        source=AssessmentSource(
            source_type=AssessmentSourceType.HUMAN, source_id="ground_truth_dataset"
        ),
    )

print(f"Logged {len(ground_truth_data)} ground truth labels for alignment")
```

This approach is efficient when you have pre-labeled data from:

• Previous manual labeling efforts
• Expert annotations
• Production feedback systems
• Test datasets with known correct answers

  </TabItem>
</Tabs>
</TabsWrapper>

<ConceptOverview concepts={[
  {
    icon: Users,
    title: "Diverse Reviewers",
    description: "Include feedback from multiple experts to capture different perspectives and reduce individual bias."
  },
  {
    icon: ChartBar,
    title: "Balanced Examples",
    description: "Include both positive and negative examples. Aim for at least 30% of each to help the judge learn boundaries."
  },
  {
    icon: Database,
    title: "Sufficient Volume",
    description: "Collect at least 10 feedback examples (minimum for SIMBA), but 50-100 examples typically yield better results."
  },
  {
    icon: Target,
    title: "Consistent Standards",
    description: "Ensure reviewers use consistent criteria. Provide guidelines or rubrics to standardize assessments."
  }
]} />

## Custom Alignment Optimizers

MLflow's alignment system is designed as a **plugin architecture**, allowing you to create custom optimizers for different alignment strategies. This extensibility enables you to implement domain-specific optimization approaches while leveraging MLflow's judge infrastructure.

### Creating a Custom Optimizer

To create a custom alignment optimizer, extend the <APILink fn="mlflow.genai.judges.base.AlignmentOptimizer">AlignmentOptimizer</APILink> abstract base class:

```python
from mlflow.genai.judges.base import AlignmentOptimizer, Judge
from mlflow.entities.trace import Trace


class MyCustomOptimizer(AlignmentOptimizer):
    """Custom optimizer implementation for judge alignment."""

    def __init__(self, model: str = None, **kwargs):
        """Initialize your optimizer with custom parameters."""
        self.model = model
        # Add any custom initialization logic

    def align(self, judge: Judge, traces: list[Trace]) -> Judge:
        """
        Implement your alignment algorithm.

        Args:
            judge: The judge to be optimized
            traces: List of traces containing human feedback

        Returns:
            A new Judge instance with improved alignment
        """
        # Your custom alignment logic here
        # 1. Extract feedback from traces
        # 2. Analyze disagreements between judge and human
        # 3. Generate improved instructions
        # 4. Return new judge with better alignment

        # Example: Return judge with modified instructions
        from mlflow.genai.judges import make_judge

        improved_instructions = self._optimize_instructions(judge.instructions, traces)

        return make_judge(
            name=judge.name,
            instructions=improved_instructions,
            feedback_value_type=str,
            model=judge.model,
        )

    def _optimize_instructions(self, instructions: str, traces: list[Trace]) -> str:
        """Your custom optimization logic."""
        # Implement your optimization strategy
        pass
```

### Using Custom Optimizers

Once implemented, use your custom optimizer just like the built-in ones:

```python
# Create your custom optimizer
custom_optimizer = MyCustomOptimizer(model="your-model")

# Use it for alignment
aligned_judge = initial_judge.align(traces_with_feedback, custom_optimizer)
```

### Available Optimizers

MLflow currently provides:

- **SIMBAAlignmentOptimizer** (default): Uses [DSPy's Simplified Multi-Bootstrap Aggregation](https://dspy.ai/api/optimizers/SIMBA/) for robust alignment
- **Custom optimizers**: Extend `AlignmentOptimizer` to implement your own strategies

The plugin architecture ensures that new optimization strategies can be added without modifying the core judge system, promoting extensibility and experimentation with different alignment approaches.

## Testing Alignment Effectiveness

Validate that alignment improved your judge:

```python
def test_alignment_improvement(
    original_judge, aligned_judge, test_traces: list
) -> dict:
    """Compare judge performance before and after alignment."""

    original_correct = 0
    aligned_correct = 0

    for trace in test_traces:
        # Get human ground truth from trace assessments
        feedbacks = trace.search_assessments(type="feedback")
        human_feedback = next(
            (f for f in feedbacks if f.source.source_type == "HUMAN"), None
        )

        if not human_feedback:
            continue

        # Get judge evaluations
        original_eval = original_judge(trace=trace)
        aligned_eval = aligned_judge(trace=trace)

        # Check agreement with human
        if original_eval.value == human_feedback.value:
            original_correct += 1
        if aligned_eval.value == human_feedback.value:
            aligned_correct += 1

    total = len(test_traces)
    return {
        "original_accuracy": original_correct / total,
        "aligned_accuracy": aligned_correct / total,
        "improvement": (aligned_correct - original_correct) / total,
    }
```

## Next Steps

<TilesGrid>
  <TileCard
    icon={Brain}
    iconSize={48}
    title="Create Custom Judges"
    description="Learn to create domain-specific judges with make_judge."
    href="/genai/eval-monitor/scorers/llm-judge/make-judge"
    linkText="Create judges →"
    containerHeight={64}
  />
  <TileCard
    icon={GitBranch}
    iconSize={48}
    title="Development Workflow"
    description="See complete workflow from creation to aligned production judge."
    href="/genai/eval-monitor/scorers/llm-judge/workflow"
    linkText="View workflow →"
    containerHeight={64}
  />
  <TileCard
    icon={Database}
    iconSize={48}
    title="Dataset Integration"
    description="Use judges with evaluation datasets for systematic testing."
    href="/genai/datasets"
    linkText="Learn integration →"
    containerHeight={64}
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

---[FILE: guidelines.mdx]---
Location: mlflow-master/docs/docs/genai/eval-monitor/scorers/llm-judge/guidelines.mdx

```text
import { APILink } from "@site/src/components/APILink";
import ImageBox from "@site/src/components/ImageBox";
import TileCard from '@site/src/components/TileCard';
import TilesGrid from '@site/src/components/TilesGrid';
import { Bot, GitBranch, MessageSquare } from "lucide-react";

# Guidelines-based LLM Scorers

<APILink fn="mlflow.genai.scorers.Guidelines">Guidelines</APILink> is a powerful scorer class designed to let you quickly and easily customize evaluation by defining natural language criteria that are framed as pass/fail conditions. It is ideal for checking compliance with rules, style guides, or information inclusion/exclusion.

Guidelines have the distinct advantage of being easy to explain to business stakeholders ("we are evaluating if the app delivers upon this set of rules") and, as such, can often be directly written by domain experts.

### Example usage

First, define the guidelines as a simple string:

```python
tone = "The response must maintain a courteous, respectful tone throughout.  It must show empathy for customer concerns."
easy_to_understand = "The response must use clear, concise language and structure responses logically. It must avoid jargon or explain technical terms when used."
banned_topics = "If the request is a question about product pricing, the response must politely decline to answer and refer the user to the pricing page."
```

Then pass each guideline to the `Guidelines` class to create a scorer and run evaluation:

```python
import mlflow

eval_dataset = [
    {
        "inputs": {"question": "I'm having trouble with my account.  I can't log in."},
        "outputs": "I'm sorry to hear that you're having trouble logging in. Please provide me with your username and the specific issue you're experiencing, and I'll be happy to help you resolve it.",
    },
    {
        "inputs": {"question": "How much does a microwave cost?"},
        "outputs": "The microwave costs $100.",
    },
    {
        "inputs": {"question": "How does a refrigerator work?"},
        "outputs": "A refrigerator operates via thermodynamic vapor-compression cycles utilizing refrigerant phase transitions. The compressor pressurizes vapor which condenses externally, then expands through evaporator coils to absorb internal heat through endothermic vaporization.",
    },
]

mlflow.genai.evaluate(
    data=eval_dataset,
    scorers=[
        # Create a scorer for each guideline
        Guidelines(name="tone", guidelines=tone),
        Guidelines(name="easy_to_understand", guidelines=easy_to_understand),
        Guidelines(name="banned_topics", guidelines=banned_topics),
    ],
)
```

<ImageBox src="/images/mlflow-3/eval-monitor/scorers/guideline-scorers-results.png" alt="Guidelines scorers result" />

## Selecting Judge Models

MLflow supports all major LLM providers, such as OpenAI, Anthropic, Google, xAI, and more.

See [Supported Models](/genai/eval-monitor/scorers/llm-judge#supported-models) for more details.

## Next Steps

<TilesGrid>
  <TileCard
    icon={Bot}
    title="Evaluate Agents"
    description="Learn how to evaluate AI agents with specialized techniques and scorers"
    href="/genai/eval-monitor/running-evaluation/agents"
  />
  <TileCard
    icon={GitBranch}
    title="Evaluate Traces"
    description="Evaluate production traces to understand and improve your AI application's behavior"
    href="/genai/eval-monitor/running-evaluation/traces"
  />
  <TileCard
    icon={MessageSquare}
    title="Collect User Feedback"
    description="Integrate user feedback to continuously improve your evaluation criteria and model performance"
    href="/genai/assessments/feedback/"
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

````
