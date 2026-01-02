---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 98
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 98 of 991)

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

---[FILE: trace.mdx]---
Location: mlflow-master/docs/docs/genai/concepts/trace.mdx

```text
import { APILink } from "@site/src/components/APILink";
import ImageBox from "@site/src/components/ImageBox";
import FeatureHighlights from "@site/src/components/FeatureHighlights";
import { Search, CheckCircle, Activity, Database } from "lucide-react";
import SpanArchitectureImageUrl from '@site/static/images/llms/tracing/schema/span_architecture.png';

# Trace Concepts

## What is Tracing?

Tracing is an observability technique that captures the complete execution flow of a request through your application. Unlike traditional logging that captures discrete events, tracing creates a detailed map of how data flows through your system, recording every operation, transformation, and decision point.

In the context of GenAI applications, tracing becomes essential because these systems involve complex, multi-step workflows that are difficult to debug and optimize without complete visibility into their execution.

<ImageBox
  src="/images/llms/tracing/genai-trace-debug.png"
  alt="Trace Example"
  width="70%"
  caption="Example of a Trace for a Tool Calling Agent"
/>

## Use Cases

<FeatureHighlights features={[
  {
    icon: Search,
    title: "Debugging",
    description: "Tracing provides deep insights into what happens beneath the abstractions of GenAI libraries, helping you precisely identify where issues occur."
  },
  {
    icon: CheckCircle,
    title: "Quality Checks",
    description: "Traces provides a unified way to track the quality of the output. You can manually review the output recorded on traces and attach feedbacks to your traces to indicate the quality of the output."
  },
  {
    icon: Activity,
    title: "Production Monitoring",
    description: "Traces captures key metrics like latency and token usage at each step, helping you identify bottlenecks, monitor efficiency, and find optimization opportunities."
  },
  {
    icon: Database,
    title: "Dataset Collection",
    description: "Traces from production systems capture perfect data for building high-quality datasets with precise details for internal components like retrievers and tools."
  }
]} />

## Core Structure

At a high level, an MLflow **Trace** is composed of two primary objects:

**<APILink fn="mlflow.entities.TraceInfo">TraceInfo</APILink>**: Metadata that aids in explaining the origination of the trace, the status of the trace, information about the total execution time, etc. This includes tags that provide additional context for the trace, such as the user, session, and developer-provided key:value pairs. Tags can be used for searching or filtering traces.

**<APILink fn="mlflow.entities.TraceData">TraceData</APILink>**: The actual payload, which contains the instrumented <APILink fn="mlflow.entities.Span">Span</APILink> objects that capture your application's step-by-step execution from input to output.

<ImageBox
  src="/images/llms/tracing/schema/trace_architecture.png"
  alt="Trace Architecture"
  width="70%"
  caption="MLflow Trace Architecture Overview"
/>

MLflow Traces are designed to be compatible with **OpenTelemetry** specifications, a widely adopted industry standard for observability. This ensures interoperability and allows MLflow Traces to be exported and used with other OpenTelemetry-compatible systems. MLflow enhances the basic OpenTelemetry Span model by defining specific structures and attributes for Generative AI use cases, providing richer context and deeper insight into quality and performance.

### TraceInfo: Metadata and Context

The <APILink fn="mlflow.entities.TraceInfo">TraceInfo</APILink> within MLflow's tracing feature aims to provide a lightweight snapshot of critical data about the overall trace. In Python SDK, <APILink fn="mlflow.entities.TraceInfo">TraceInfo</APILink> is designed as a dataclass object that contains metadata about the trace.

This metadata includes information about the trace's origin, status, and various other data that aids in retrieving and filtering traces when used with <APILink fn="mlflow.search_traces" /> and for navigation of traces within the MLflow UI.

| Field                | Type                                                                  | Description                                                                                                                                                                                                                                                                                                                                    |
| -------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `trace_id`           | `str`                                                                 | The primary identifier for the trace.                                                                                                                                                                                                                                                                                                          |
| `trace_location`     | <APILink fn="mlflow.entities.TraceLocation">`TraceLocation`</APILink> | The location where the trace is stored, represented as a TraceLocation object. MLflow currently supports MLflow Experiment as a trace location.                                                                                                                                                                                                |
| `request_time`       | `int`                                                                 | Start time of the trace, in milliseconds.                                                                                                                                                                                                                                                                                                      |
| `state`              | <APILink fn="mlflow.entities.TraceState">`TraceState`</APILink>       | State of the trace, represented as a TraceState enum. Can be one of `OK`, `ERROR`, `IN_PROGRESS`, `STATE_UNSPECIFIED`.                                                                                                                                                                                                                         |
| `execution_duration` | `int`                                                                 | Duration of the trace, in milliseconds.                                                                                                                                                                                                                                                                                                        |
| `request_preview`    | `Optional[str]`                                                       | Request to the model/agent, equivalent to the input of the root span but JSON-encoded and can be truncated.                                                                                                                                                                                                                                    |
| `response_preview`   | `Optional[str]`                                                       | Response from the model/agent, equivalent to the output of the root span but JSON-encoded and can be truncated.                                                                                                                                                                                                                                |
| `client_request_id`  | `Optional[str]`                                                       | Client supplied request ID associated with the trace. This could be used to identify the trace/request from an external system that produced the trace, e.g., a session ID in a web application.                                                                                                                                               |
| `trace_metadata`     | `dict[str, str]`                                                      | Key-value pairs associated with the trace. They are designed for immutable values like run ID associated with the trace.                                                                                                                                                                                                                       |
| `tags`               | `dict[str, str]`                                                      | Tags are key-value pairs that can be used to annotate the trace. They are designed for mutable values, that can be updated after the trace is created via MLflow UI or API, and are useful for grouping traces and efficiently querying them. Visit [Setting Trace Tags](/genai/tracing/attach-tags) for more details about the usage of tags. |

### TraceData: Container of Spans

The MLflow <APILink fn="mlflow.entities.TraceData">TraceData</APILink> object, accessible via `trace.data`, is a container of <APILink fn="mlflow.entities.Span">Span</APILink> object. This is where the actual execution details are stored, including the request and response data, latency of each step, input and output messages to LLMs, retrieved documents from vector stores, tool call parameters, etc.

Spans in a trace forms a hierarchy through parent-child connections. Each span details a specific unit of work.

For example, the following picture illustrates a set of spans that are organized in a tree structure in a trace. Each line represents a span, where the tree-structure is formed by the curly edges between lines. For example, the root span is "agent", which links to three children spans: 2 LLm calls and 1 tool handling.

<img src={SpanArchitectureImageUrl} alt="Span Architecture" style={{width: '80%'}} />

To learn more about the span object and its schema, continue to the [Span Concepts](/genai/concepts/span) page.

## Storage Layout

`TraceInfo` is a lightweight metadata object, hence can be stored directly in a relational database. For example, if you are running MLflow Tracking Server on SQL database such as PostgreSQL, `TraceInfo` is stored as a single row in the trace table and support efficient query with indexes. For example, the data that is contained in the `TraceInfo` object is used to populate the trace view page within the MLflow tracking UI.

`TraceData` (Spans) are relatively large objects compared to `TraceInfo`, because it contains rich information about each execution step, such as the full message history input to an LLM call. Therefore, MLflow stores them in artifact storage rather than in the database. This allows you to handle large number of traces with cheaper costs and minimum impact to the performance of typical filtering and grouping operations for traces.
```

--------------------------------------------------------------------------------

---[FILE: feedback.mdx]---
Location: mlflow-master/docs/docs/genai/concepts/trace/feedback.mdx

```text
import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"

# Feedback Concepts

This guide introduces the core concepts of feedback and assessment in MLflow's GenAI evaluation framework. Understanding these concepts is essential for effectively measuring and improving the quality of your GenAI applications.

## What is Feedback?

**Feedback** in MLflow represents the result of any quality assessment performed on your GenAI application outputs. It provides a standardized way to capture evaluations, whether they come from automated systems, LLM judges, or human reviewers.

Feedback serves as the bridge between running your application and understanding its quality, enabling you to systematically track performance across different dimensions like correctness, relevance, safety, and adherence to guidelines.

## Core Concepts

### Feedback Object

The **Feedback object** (also referred to as an **Assessment** in some contexts) is the fundamental building block of MLflow's evaluation system. It serves as a standardized container for the result of any quality check, providing a common language for assessment across different evaluation methods.

<Tabs>
  <TabItem value="structure" label="Feedback Structure" default>
    Every Feedback object contains three core components:

    **Name**: A string identifying the specific quality aspect being assessed

    Examples: `"correctness"`, `"relevance_to_query"`, `"is_safe"`, `"guideline_adherence_politeness"`

    **Value**: The actual result of the assessment, which can be:
    - Numeric scores (e.g., `0.0` to `1.0`, `1` to `5`)
    - Boolean values (`True`/`False`)
    - Categorical labels (e.g., `"PASS"`, `"FAIL"`, `"EXCELLENT"`)
    - Structured data (e.g., `{"score": 0.8, "confidence": 0.9}`)

    **Rationale**: A string explaining why the assessment resulted in the given value

    This explanation is crucial for transparency, debugging, and understanding evaluation behavior, especially for LLM-based assessments.

  </TabItem>
  <TabItem value="sources" label="Feedback Sources">
    Feedback can originate from multiple sources, each with different characteristics:

    **LLM-based Evaluations**: Automated assessments using language models as judges
    - Fast and scalable
    - Can evaluate complex, subjective criteria
    - Provide detailed reasoning in rationale

    **Programmatic Checks**: Rule-based or algorithmic evaluations
    - Deterministic and consistent
    - Fast execution
    - Good for objective, measurable criteria

    **Human Reviews**: Manual assessments from human evaluators
    - Highest quality for subjective evaluations
    - Slower and more expensive
    - Essential for establishing ground truth

    All feedback types are treated equally in MLflow and can be combined to provide comprehensive quality assessment.

  </TabItem>
  <TabItem value="attachment" label="Trace Attachment">
    Feedback objects are attached to **MLflow Traces**, creating a direct connection between application execution and quality assessment:

    **Execution + Assessment**: Each trace captures how your application processed a request, while feedback captures how well it performed

    **Multi-dimensional Quality**: A single trace can have multiple feedback objects assessing different quality dimensions

    **Historical Analysis**: Attached feedback enables tracking quality trends over time and across different application versions

    **Debugging Context**: When quality issues arise, you can examine both the execution trace and the assessment rationale

  </TabItem>
</Tabs>

### Assessment Dimensions

Feedback can evaluate various aspects of your GenAI application's performance:

<Tabs>
  <TabItem value="correctness" label="Correctness & Accuracy" default>
    **Factual Accuracy**: Whether the generated content contains correct information

    **Answer Completeness**: How thoroughly the response addresses the user's question

    **Logical Consistency**: Whether the reasoning and conclusions are sound

    Example feedback:
    ```json
    {
      "name": "factual_accuracy",
      "value": 0.85,
      "rationale": "The response correctly identifies 3 out of 4 key facts about MLflow, but incorrectly states the founding year."
    }
    ```

  </TabItem>
  <TabItem value="relevance" label="Relevance & Context">
    **Query Relevance**: How well the response addresses the specific user question

    **Context Utilization**: Whether retrieved documents or provided context were used effectively

    **Topic Adherence**: Staying on-topic and avoiding irrelevant tangents

    Example feedback:
    ```json
    {
      "name": "relevance_to_query",
      "value": "HIGH",
      "rationale": "Response directly answers the user's question about MLflow features and provides relevant examples."
    }
    ```

  </TabItem>
  <TabItem value="safety" label="Safety & Guidelines">
    **Content Safety**: Detecting harmful, inappropriate, or toxic content

    **Guideline Adherence**: Following specific organizational or ethical guidelines

    **Bias Detection**: Identifying unfair bias or discrimination in responses

    Example feedback:
    ```json
    {
      "name": "is_safe",
      "value": true,
      "rationale": "Content contains no harmful, toxic, or inappropriate material."
    }
    ```

  </TabItem>
  <TabItem value="quality" label="Quality & Style">
    **Writing Quality**: Grammar, clarity, and coherence of the response

    **Tone Appropriateness**: Whether the tone matches the intended context

    **Helpfulness**: How useful the response is to the user

    Example feedback:
    ```json
    {
      "name": "helpfulness",
      "value": 4,
      "rationale": "Response provides clear, actionable information but could include more specific examples."
    }
    ```

  </TabItem>
</Tabs>

## Feedback Lifecycle

Understanding how feedback flows through your evaluation process:

<Tabs>
  <TabItem value="generation" label="Generation" default>
    **During Application Execution**: Traces are created as your GenAI application processes requests

    **Post-Execution Evaluation**: Feedback is generated by evaluating the trace data (inputs, outputs, intermediate steps)

    **Multiple Evaluators**: Different evaluation methods can assess the same trace, creating multiple feedback objects

    **Batch or Real-time**: Feedback can be generated immediately or in batch processes

  </TabItem>
  <TabItem value="attachment" label="Attachment">
    **Trace Association**: Each feedback object is linked to a specific trace using trace IDs

    **Persistent Storage**: Feedback is stored alongside trace data in MLflow's backend

    **Metadata Preservation**: All context about the evaluation method and timing is maintained

    **Version Tracking**: Changes to feedback or re-evaluations are tracked over time

  </TabItem>
  <TabItem value="aggregation" label="Aggregation">
    **Quality Metrics**: Individual feedback objects can be aggregated into overall quality scores

    **Trend Analysis**: Historical feedback enables tracking quality changes over time

    **Comparative Analysis**: Compare feedback across different model versions, prompts, or configurations

    **Reporting**: Generate quality reports and dashboards from aggregated feedback data

  </TabItem>
</Tabs>

## Types of Feedback

MLflow supports different types of feedback to accommodate various evaluation needs:

### Scalar Feedback

**Numeric Scores**: Continuous values representing quality on a scale

- Range: Often 0.0 to 1.0 or 1 to 5
- Use case: Measuring degrees of quality like relevance or accuracy
- Example: `{"name": "relevance", "value": 0.87}`

**Boolean Values**: Binary assessments for pass/fail criteria

- Values: `true` or `false`
- Use case: Safety checks, guideline compliance
- Example: `{"name": "contains_pii", "value": false}`

### Categorical Feedback

**Labels**: Discrete categories representing quality levels

- Values: Predefined labels like "EXCELLENT", "GOOD", "POOR"
- Use case: Human-like quality ratings
- Example: `{"name": "overall_quality", "value": "GOOD"}`

**Classification**: Specific category assignments

- Values: Domain-specific categories
- Use case: Content classification, intent recognition
- Example: `{"name": "response_type", "value": "INFORMATIONAL"}`

### Structured Feedback

**Complex Objects**: Rich data structures containing multiple assessment aspects

- Format: JSON objects with nested properties
- Use case: Comprehensive evaluations with multiple dimensions
- Example:

```json
{
  "name": "comprehensive_quality",
  "value": {
    "overall_score": 0.85,
    "accuracy": 0.9,
    "fluency": 0.8,
    "confidence": 0.75
  }
}
```

## Evaluation Methods

Different approaches for generating feedback:

<Tabs>
  <TabItem value="llm-judges" label="LLM Judges" default>
    **Automated LLM Evaluation**: Using language models to assess quality

    **Advantages**:
    - Scale to large volumes of data
    - Evaluate subjective criteria
    - Provide detailed reasoning
    - Consistent evaluation criteria

    **Use Cases**:
    - Content quality assessment
    - Relevance evaluation
    - Style and tone analysis
    - Complex reasoning evaluation

    **Example**: An LLM judge evaluating response helpfulness with detailed rationale explaining specific strengths and weaknesses.

  </TabItem>
  <TabItem value="programmatic" label="Programmatic Checks">
    **Rule-Based Evaluation**: Algorithmic assessment using predefined logic

    **Advantages**:
    - Deterministic and consistent
    - Fast execution
    - Objective measurement
    - Easy to understand and debug

    **Use Cases**:
    - Format validation
    - Length constraints
    - Keyword presence/absence
    - Quantitative metrics

    **Example**: Checking if a response contains required elements or meets length requirements.

  </TabItem>
  <TabItem value="human-review" label="Human Review">
    **Manual Assessment**: Human evaluators providing direct feedback

    **Advantages**:
    - Highest quality for subjective criteria
    - Nuanced understanding
    - Ground truth establishment
    - Complex context evaluation

    **Use Cases**:
    - Quality benchmarking
    - Edge case evaluation
    - Sensitive content review
    - Final quality validation

    **Example**: Human reviewers assessing response quality using standardized rubrics and providing detailed feedback.

  </TabItem>
</Tabs>

## Integration with MLflow

Feedback integrates seamlessly with MLflow's ecosystem:

### Trace Connection

**Direct Association**: Feedback objects are linked to specific traces, providing context about what was evaluated

**Execution Context**: Access to complete application execution data when performing evaluations

**Multi-Step Evaluation**: Ability to evaluate individual spans within a trace or the overall trace result

### Evaluation Framework

**Scorer Functions**: Automated functions that generate feedback based on trace data

**Judge Functions**: LLM-based evaluators that provide intelligent assessment

**Custom Metrics**: Ability to define domain-specific evaluation criteria

### Analysis and Monitoring

**Quality Dashboards**: Visualize feedback trends and patterns over time

**Performance Tracking**: Monitor how changes to your application affect quality metrics

**Alerting**: Set up notifications when quality metrics fall below thresholds

## Best Practices

### Feedback Design

**Clear Names**: Use descriptive, consistent names for feedback dimensions

**Appropriate Scales**: Choose value types and ranges that match your evaluation needs

**Meaningful Rationale**: Provide clear explanations that help with debugging and improvement

### Evaluation Strategy

**Multiple Dimensions**: Assess various aspects of quality, not just a single metric

**Balanced Approach**: Combine automated and human evaluation methods

**Regular Review**: Periodically review and update evaluation criteria

### Quality Monitoring

**Baseline Establishment**: Set quality baselines for comparison

**Trend Monitoring**: Track quality changes over time and across versions

**Root Cause Analysis**: Use feedback and trace data together to understand quality issues

## Getting Started

To begin using feedback in your GenAI evaluation workflow:

**[LLM Evaluation Guide](/genai/eval-monitor)**: Learn how to evaluate your GenAI applications

**[Custom Metrics](/genai/eval-monitor)**: Create domain-specific evaluation functions

**[Trace Analysis](/genai/tracing/search-traces)**: Explore how to query and analyze trace data with feedback

**[Quality Monitoring](/genai/tracing/prod-tracing)**: Set up ongoing quality assessment

---

_Feedback concepts form the foundation for systematic quality assessment in MLflow. By understanding how feedback objects work and integrate with traces, you can build comprehensive evaluation strategies that improve your GenAI applications over time._
```

--------------------------------------------------------------------------------

---[FILE: end-to-end-workflow.mdx]---
Location: mlflow-master/docs/docs/genai/datasets/end-to-end-workflow.mdx

```text
import { APILink } from "@site/src/components/APILink";
import ImageBox from "@site/src/components/ImageBox";
import TilesGrid from "@site/src/components/TilesGrid";
import TileCard from "@site/src/components/TileCard";
import { Code, Rocket, FileText } from "lucide-react";

# End-to-End Workflow: Evaluation-Driven Development

This guide demonstrates the complete workflow for building and evaluating GenAI applications using MLflow's evaluation-driven development approach.

:::note
**Databricks Users**: To use Evaluation Datasets with Databricks Unity Catalog, MLflow requires the additional installation of the `databricks-agents` package. This package uses Unity Catalog to store datasets. Install it with: `pip install databricks-agents`
:::

:::warning[SQL Backend Required]
Evaluation Datasets require an MLflow Tracking Server with a **[SQL backend](/self-hosting/architecture/backend-store/#types-of-backend-stores)** (PostgreSQL, MySQL, SQLite, or MSSQL).
This feature is **not available** with FileStore (local file system-based tracking).
:::

## Prerequisites

```bash
pip install --upgrade mlflow>=3.4 openai
```

## Step 1: Build & Trace Your Application

Start with a traced GenAI application. This example shows a customer support bot, but the pattern applies to any LLM application. You can use the <APILink fn="mlflow.trace">mlflow.trace decorator</APILink> for manual instrumentation or <APILink fn="mlflow.openai.autolog">enable automatic tracing for OpenAI</APILink> as shown below.

```python
import mlflow
import openai
import os

# Configure environment
os.environ["OPENAI_API_KEY"] = "your-api-key-here"
mlflow.set_experiment("Customer Support Bot")

# Enable automatic tracing for OpenAI
mlflow.openai.autolog()


class CustomerSupportBot:
    def __init__(self):
        self.client = openai.OpenAI()
        self.knowledge_base = {
            "refund": "Full refunds within 30 days with receipt.",
            "shipping": "Standard: 5-7 days. Express available.",
            "warranty": "1-year manufacturer warranty included.",
        }

    @mlflow.trace
    def answer(self, question: str) -> str:
        # Retrieve relevant context
        context = self._get_context(question)

        # Generate response
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful support assistant."},
                {
                    "role": "user",
                    "content": f"Context: {context}\n\nQuestion: {question}",
                },
            ],
            temperature=0.3,
        )
        return response.choices[0].message.content

    def _get_context(self, question: str) -> str:
        # Simple keyword matching for demo
        for key, value in self.knowledge_base.items():
            if key in question.lower():
                return value
        return "General customer support information."


bot = CustomerSupportBot()
```

## Step 2: Capture Production Traces

Run your application with real or test scenarios to capture traces. Later, you'll use <APILink fn="mlflow.search_traces">mlflow.search_traces()</APILink> to retrieve these traces for annotation and dataset creation.

```python
# Test scenarios
test_questions = [
    "What is your refund policy?",
    "How long does shipping take?",
    "Is my product under warranty?",
    "Can I get express shipping?",
]

# Capture traces - automatically logged to the active experiment
for question in test_questions:
    response = bot.answer(question)
```

## Step 3: Add Ground Truth Expectations

Add expectations to your traces to define what you expect as a response coming from your application. Use <APILink fn="mlflow.log_expectation">mlflow.log_expectation()</APILink> to annotate traces with ground truth values that will serve as your evaluation baseline. You can also directly apply expectations within the UI.

<ImageBox src="/images/add-expectation-ui.png" alt="Adding Expectations in UI" />

```python
# Search for recent traces (uses current active experiment by default)
traces = mlflow.search_traces(
    max_results=10, return_type="list"  # Return list of Trace objects for iteration
)

# Add expectations to specific traces
for trace in traces:
    # Get the question from the root span inputs
    root_span = trace.data._get_root_span()
    question = (
        root_span.inputs.get("question", "") if root_span and root_span.inputs else ""
    )

    if "refund" in question.lower():
        mlflow.log_expectation(
            trace_id=trace.info.trace_id,
            name="key_information",
            value={"must_mention": ["30 days", "receipt"], "tone": "helpful"},
        )
    elif "shipping" in question.lower():
        mlflow.log_expectation(
            trace_id=trace.info.trace_id,
            name="key_information",
            value={"must_mention": ["5-7 days"], "offers_express": True},
        )
```

## Step 4: Create an Evaluation Dataset

Transform your annotated traces into a reusable evaluation dataset. Use <APILink fn="mlflow.genai.datasets.create_dataset">create_dataset()</APILink> to initialize your dataset and <APILink fn="mlflow.entities.EvaluationDataset.merge_records">merge_records()</APILink> to add test cases from multiple sources.

```python
from mlflow.genai.datasets import create_dataset

# Create dataset from current experiment
dataset = create_dataset(
    name="customer_support_qa_v1",
    experiment_id=mlflow.get_experiment_by_name("Customer Support Bot").experiment_id,
    tags={"stage": "validation", "domain": "customer_support"},
)

# Re-fetch traces to get the attached expectations
# The expectations are now part of the trace data
annotated_traces = mlflow.search_traces(
    max_results=100,
    return_type="list",  # Need list for merge_records
)

# Add traces to dataset
dataset.merge_records(annotated_traces)

# Optionally add manual test cases
manual_tests = [
    {
        "inputs": {"question": "Can I return an item after 45 days?"},
        "expectations": {"should_clarify": "30-day policy", "tone": "apologetic"},
    },
    {
        "inputs": {"question": "Do you ship internationally?"},
        "expectations": {"provides_alternatives": True},
    },
]
dataset.merge_records(manual_tests)
```

## Step 5: Run Systematic Evaluation

Evaluate your application against the dataset using built-in and custom scorers. Use <APILink fn="mlflow.genai.evaluate">mlflow.genai.evaluate()</APILink> to run comprehensive evaluations with scorers like <APILink fn="mlflow.genai.scorers.Correctness">Correctness</APILink> for factual accuracy assessment. You can also create custom scorers using the <APILink fn="mlflow.genai.scorers.scorer">@scorer decorator</APILink> to evaluate domain-specific criteria.

```python
from mlflow.genai import evaluate
from mlflow.genai.scorers import Correctness, Guidelines, scorer


# Define custom scorer for your specific needs
@scorer
def contains_required_info(outputs: str, expectations: dict) -> float:
    """Check if response contains required information."""
    if "must_mention" not in expectations:
        return 1.0

    output_lower = outputs.lower()
    mentioned = [term for term in expectations["must_mention"] if term in output_lower]
    return len(mentioned) / len(expectations["must_mention"])


# Configure evaluation
scorers = [
    Correctness(name="factual_accuracy"),
    Guidelines(
        name="support_quality",
        guidelines="Response must be helpful, accurate, and professional",
    ),
    contains_required_info,
]

# Run evaluation
results = evaluate(
    data=dataset,
    predict_fn=bot.answer,
    scorers=scorers,
    model_id="customer-support-bot-v1",
)

# Access results
metrics = results.metrics
detailed_results = results.tables["eval_results_table"]
```

## Step 6: Iterate and Improve

Use evaluation results to improve your application, then re-evaluate using the same dataset.

```python
# Analyze results
low_scores = detailed_results[detailed_results["factual_accuracy/score"] < 0.8]
if not low_scores.empty:
    # Identify patterns in failures
    failed_questions = low_scores["inputs.question"].tolist()

    # Example improvements based on failure analysis
    bot.knowledge_base[
        "refund"
    ] = "Full refunds available within 30 days with original receipt. Store credit offered after 30 days."
    bot.client.temperature = 0.2  # Reduce temperature for more consistent responses

    # Re-evaluate with same dataset for comparison
    improved_results = evaluate(
        data=dataset,
        predict_fn=bot.answer,  # Updated bot
        scorers=scorers,
        model_id="customer-support-bot-v2",
    )

    # Compare versions
    improvement = (
        improved_results.metrics["factual_accuracy/score"]
        - metrics["factual_accuracy/score"]
    )
```

## Next Steps

<TilesGrid>
  <TileCard
    icon={Code}
    iconSize={48}
    title="Custom Scorers"
    description="Build sophisticated scorers for complex evaluation criteria"
    href="/genai/eval-monitor/scorers"
    linkText="Learn more →"
    containerHeight={64}
  />
  <TileCard
    icon={FileText}
    iconSize={48}
    title="SDK Reference"
    description="Deep dive into dataset management APIs"
    href="/genai/datasets/sdk-guide"
    linkText="View guide →"
    containerHeight={64}
  />
  <TileCard
    icon={Rocket}
    iconSize={48}
    title="Production Monitoring"
    description="Set up continuous evaluation for production"
    href="/genai/tracing/prod-tracing"
    linkText="Learn more →"
    containerHeight={64}
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

````
