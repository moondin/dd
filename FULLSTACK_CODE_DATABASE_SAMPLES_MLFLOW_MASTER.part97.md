---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 97
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 97 of 991)

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

---[FILE: feedback.mdx]---
Location: mlflow-master/docs/docs/genai/concepts/feedback.mdx

```text
import { APILink } from "@site/src/components/APILink";
import ImageBox from "@site/src/components/ImageBox";
import FeatureHighlights from "@site/src/components/FeatureHighlights";
import TilesGrid from "@site/src/components/TilesGrid";
import TileCard from "@site/src/components/TileCard";
import { ClipboardCheck, UserCheck, Bot, UsersRound, MessageSquare, FileText, Target } from "lucide-react";
import FeedbackArchitectureImageUrl from '@site/static/images/llms/tracing/schema/feedback_architecture.png';

# Feedback Concepts

## What is Feedback?

**Feedback** in MLflow represents the result of any quality assessment performed on your GenAI application outputs. It provides a standardized way to capture evaluations, whether they come from automated systems, LLM judges, or human reviewers.

Feedback serves as the bridge between running your application and understanding its quality, enabling you to systematically track performance across different dimensions like correctness, relevance, safety, and adherence to guidelines.

<ImageBox
  src="/images/llms/tracing/genai-human-feedback.png"
  alt="Feedbacks attached to traces"
  width="70%"
  caption="Feedbacks attached to traces"
/>

## Use Cases

<FeatureHighlights features={[
  {
    icon: ClipboardCheck,
    title: "Manual Quality Checks",
    description: "Manual quality checks are important for ensuring the quality of your GenAI application. For example, you can attach a feedback to indicate the hallucination in the response and compare quality between different models."
  },
  {
    icon: UserCheck,
    title: "End-User Feedbacks",
    description: "Feedbacks from end-users are precious for improving the quality of your GenAI application. By storing feedbacks on your traces, you can easily monitor the user satisfaction of your application over time."
  },
  {
    icon: Bot,
    title: "LLM Judge Evaluation",
    description: "LLM judges are powerful tools for systematically running quality checks at scale. When using MLflow's GenAI Evaluation, Feedbacks from LLM judges are attached to the traces, enabling you to track evaluation results in the unified way as manual quality checks."
  },
  {
    icon: UsersRound,
    title: "Collaborative Annotation",
    description: "Quality checks are often performed by multiple annotators to ensure the robustness of the output. MLflow tracks metadata and revision history of the feedbacks and supports aggregation of feedbacks from multiple annotators."
  }
]} />

## Core Structure

<div style={{display: 'flex', justifyContent: 'center'}}>
  <img src={FeedbackArchitectureImageUrl} alt="Feedback Architecture" style={{width: '60%'}} />
</div>

Feedback is often created by different sources, such as human annotators, LLM judges, or real user's feedback in the application. The <APILink fn="mlflow.entities.Feedback">`Feedback`</APILink> object in MLflow is a standard container for storing these signals along with metadata to track
how they are created. Feedbacks are associated with a Trace, or a particular Span in the Trace.

## Feedback Object Schema

| Field                 | Type                        | Description                                                                                                                                                                                                                                                                                                                                                                                             |
| --------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                | `str`                       | A string identifying the specific quality aspect being assessed                                                                                                                                                                                                                                                                                                                                         |
| `value`               | `Any`                       | The actual feedback value, which can be <br/><br/> <ul><li>Numeric scores (e.g., `0.0` to `1.0`, `1` to `5`)</li><li>Boolean values (`True`/`False`)</li><li>Categorical labels (e.g., `"PASS"`, `"FAIL"`, `"EXCELLENT"`)</li><li>Structured data (e.g., `{"score": 0.8, "confidence": 0.9}`)</li></ul>                                                                                                 |
| `rationale`           | `str`                       | A string explaining why the feedback is given to the trace.                                                                                                                                                                                                                                                                                                                                             |
| `source`              | `AssessmentSource`          | The source of the feedback, composed of the type of the source and ID. <br/><br/> <ul><li>`HUMAN`: Represents a human review. ID can be the identifier for the annotator, such as name, account, email, etc.</li><li>`LLM_JUDGE`: Represents an LLM-based evaluation. ID may be the name of the judge model e.g., "openai:/4o-mini".</li><li>`CODE`: Represents any other programmatic check.</li></ul> |
| `error`               | `Optional[AssessmentError]` | An optional error associated with the feedback. This is used to indicate that the feedback was not processed successfully, for example, an exception from the LLM judge execution.                                                                                                                                                                                                                      |
| `metadata`            | `Optional[dict[str, str]]`  | Optional key-value pairs associated with the feedback.                                                                                                                                                                                                                                                                                                                                                  |
| `create_time_ms`      | `int`                       | The timestamp of when the feedback is created, in milliseconds.                                                                                                                                                                                                                                                                                                                                         |
| `last_update_time_ms` | `int`                       | The timestamp of when the feedback is updated, in milliseconds.                                                                                                                                                                                                                                                                                                                                         |
| `trace_id`            | `str`                       | The ID of the trace that the feedback is attached to.                                                                                                                                                                                                                                                                                                                                                   |
| `span_id`             | `Optional[str]`             | The ID of the span that the feedback is attached to, if it is associated with a particular span in the trace. For example, you can give a feedback to the specific retriever output in the RAG application.                                                                                                                                                                                             |

## Feedback Examples

**Human Feedback for Hallucination in the Response**

```json
{
    "name": "hallucination",
    "value": false,
    "rationale": "The response is factual and does not contain any hallucinations.",
    "source": {
        "source_type": "HUMAN",
        "source_id": "john@example.com"
    }
}
```

**LLM Judge Feedback for Factual Accuracy**

```json
{
    "name": "factual_accuracy",
    "value": 0.85,
    "rationale": "The response correctly identifies 3 out of 4 key facts about MLflow, but incorrectly states the founding year.",
    "source": {
        "source_type": "LLM_JUDGE",
        "source_id": "openai:/4o-mini"
    },
    "metadata": {
        # Store link to the prompt used for the judge, registered in MLflow Prompt Registry
        "judge_prompt": "prompts:factual_accuracy_judge/1"
    }
}
```

**Error Feedback from LLM Judge (Rate Limit Exceeded)**

```json
{
    "name": "safety",
    "error": {
        "error_code": "RATE_LIMIT_EXCEEDED",
        "error_message": "Rate limit for the judge exceeded.",
        "stack_trace": "..."
    },
    "source": {
        "source_type": "LLM_JUDGE",
        "source_id": "openai:/4o-mini"
    }
}
```

## Next Steps

<TilesGrid>
  <TileCard
    icon={FileText}
    iconSize={48}
    title="Feedback Guide"
    description="Complete guide for using mlflow.log_feedback with practical examples and code samples"
    href="/genai/assessments/feedback"
    linkText="View the feedback guide →"
    containerHeight={64}
  />
  <TileCard
    icon={MessageSquare}
    iconSize={48}
    title="Expectations Concepts"
    description="Learn how to define ground truth expectations for comprehensive evaluation"
    href="/genai/concepts/expectations"
    linkText="Learn about expectations →"
    containerHeight={64}
  />
  <TileCard
    icon={Target}
    iconSize={48}
    title="Ground Truth Expectations"
    description="Understand how to define expected outputs for comprehensive evaluation"
    href="/genai/assessments/expectations"
    linkText="Learn about expectations →"
    containerHeight={64}
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

---[FILE: scorers.mdx]---
Location: mlflow-master/docs/docs/genai/concepts/scorers.mdx

```text
import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"
import { APILink } from "@site/src/components/APILink";
import TabsWrapper from "@site/src/components/TabsWrapper";
import FeatureHighlights from "@site/src/components/FeatureHighlights";
import ConceptOverview from "@site/src/components/ConceptOverview";
import TilesGrid from "@site/src/components/TilesGrid";
import TileCard from "@site/src/components/TileCard";
import { Brain, Code, Users, Shield, Target, Activity, ChartBar, GitBranch } from "lucide-react";

# Scorer Concepts

## What are Scorers?

**Scorers** in MLflow are evaluation functions that assess the quality of your GenAI application outputs. They provide a systematic way to measure performance across different dimensions like correctness, relevance, safety, and adherence to guidelines.

Scorers transform subjective quality assessments into measurable metrics, enabling you to track performance, compare models, and ensure your applications meet quality standards. They range from simple rule-based checks to sophisticated LLM judges that can evaluate nuanced aspects of language generation.

## Use Cases

<FeatureHighlights features={[
  {
    icon: Brain,
    title: "Automated Quality Assessment",
    description: "Replace manual review processes with automated scoring that can evaluate thousands of outputs consistently and at scale, using either deterministic rules or LLM-based evaluation."
  },
  {
    icon: Shield,
    title: "Safety & Compliance Validation",
    description: "Systematically check for harmful content, bias, PII leakage, and regulatory compliance. Ensure your applications meet organizational and legal standards before deployment."
  },
  {
    icon: GitBranch,
    title: "A/B Testing & Model Comparison",
    description: "Compare different models, prompts, or configurations using consistent evaluation criteria. Make data-driven decisions about which approach performs best for your use case."
  },
  {
    icon: ChartBar,
    title: "Continuous Quality Monitoring",
    description: "Track quality metrics over time in production, detect degradations early, and maintain high standards as your application evolves and scales."
  }
]} />

## Types of Scorers

MLflow provides several types of scorers to address different evaluation needs:

<ConceptOverview concepts={[
  {
    icon: Activity,
    title: "Agent-as-a-Judge",
    description: "Autonomous agents that analyze execution traces to evaluate not just outputs, but the entire process. They can assess tool usage, reasoning chains, and error handling."
  },
  {
    icon: Users,
    title: "Human-Aligned Judges",
    description: "LLM judges that have been aligned with human feedback using the built-in align() method to match your specific quality standards. These provide the consistency of automation with the nuance of human judgment."
  },
  {
    icon: Brain,
    title: "LLM-based Scorers (LLM-as-a-Judge)",
    description: "Use large language models to evaluate subjective qualities like helpfulness, coherence, and style. These scorers can understand context and nuance that rule-based systems miss."
  },
  {
    icon: Code,
    title: "Code-based Scorers",
    description: "Custom Python functions for deterministic evaluation. Perfect for metrics that can be calculated algorithmically like ROUGE scores, exact match, or custom business logic."
  }
]} />

## Scorer Output Structure

All scorers in MLflow produce standardized output that integrates seamlessly with the evaluation framework. Scorers return a <APILink fn="mlflow.entities.Feedback" /> object containing:

| Field       | Type             | Description                                                                |
| ----------- | ---------------- | -------------------------------------------------------------------------- |
| `name`      | `str`            | Unique identifier for the scorer (e.g., "correctness", "safety")           |
| `value`     | `Any`            | The evaluation result - can be numeric, boolean, or categorical            |
| `rationale` | `Optional[str]`  | Explanation of why this score was given (especially useful for LLM judges) |
| `metadata`  | `Optional[dict]` | Additional information about the evaluation (confidence, sub-scores, etc.) |
| `error`     | `Optional[str]`  | Error message if the scorer failed to evaluate                             |

## Common Scorer Patterns

MLflow's scorer system is highly flexible, supporting everything from simple rule-based checks to sophisticated AI agents that analyze entire execution traces. The examples below demonstrate the breadth of evaluation capabilities available - from detecting inefficiencies in multi-step workflows to assessing text readability, measuring response latency, and ensuring output quality. Each pattern can be customized to your specific use case and combined with others for comprehensive evaluation.

<TabsWrapper>
<Tabs>
  <TabItem value="agent-judge" label="Agent-as-a-Judge (Trace Analysis)" default>

```python
from mlflow.genai.judges import make_judge
import mlflow

# Create an Agent-as-a-Judge that analyzes execution patterns
from typing import Literal

efficiency_judge = make_judge(
    name="efficiency_analyzer",
    instructions=(
        "Analyze the {{ trace }} for inefficiencies.\n\n"
        "Check for:\n"
        "- Redundant API calls or database queries\n"
        "- Sequential operations that could be parallelized\n"
        "- Unnecessary data processing\n\n"
        "Rate as: 'efficient', 'acceptable', or 'inefficient'"
    ),
    feedback_value_type=Literal["efficient", "acceptable", "inefficient"],
    model="anthropic:/claude-opus-4-1-20250805",
)

# Example: RAG application with retrieval and generation
from mlflow.entities import SpanType
import time


@mlflow.trace(span_type=SpanType.RETRIEVER)
def retrieve_context(query: str):
    # Simulate vector database retrieval
    time.sleep(0.5)  # Retrieval latency
    return [
        {"doc": "MLflow is an open-source platform", "score": 0.95},
        {"doc": "It manages the ML lifecycle", "score": 0.89},
        {"doc": "Includes tracking and deployment", "score": 0.87},
    ]


@mlflow.trace(span_type=SpanType.RETRIEVER)
def retrieve_user_history(user_id: str):
    # Another retrieval that could be parallelized
    time.sleep(0.5)  # Could run parallel with above
    return {"previous_queries": ["What is MLflow?", "How to log models?"]}


@mlflow.trace(span_type=SpanType.LLM)
def generate_response(query: str, context: list, history: dict):
    # Simulate LLM generation
    return f"Based on context about '{query}': MLflow is a platform for ML lifecycle management."


@mlflow.trace(span_type=SpanType.AGENT)
def rag_agent(query: str, user_id: str):
    # Sequential operations that could be optimized
    context = retrieve_context(query)
    history = retrieve_user_history(user_id)  # Could be parallel with above
    response = generate_response(query, context, history)
    return response


# Run the RAG agent
result = rag_agent("What is MLflow?", "user123")
trace_id = mlflow.get_last_active_trace_id()
trace = mlflow.get_trace(trace_id)

# Judge analyzes the trace to identify inefficiencies
feedback = efficiency_judge(trace=trace)
print(f"Efficiency: {feedback.value}")
print(f"Analysis: {feedback.rationale}")
```

  </TabItem>
  <TabItem value="llm-judge" label="LLM Judge (Field-Based)">

```python
from mlflow.genai.judges import make_judge

correctness_judge = make_judge(
    name="correctness",
    instructions=(
        "Evaluate if the response in {{ outputs }} "
        "correctly answers the question in {{ inputs }}."
    ),
    feedback_value_type=bool,
    model="anthropic:/claude-opus-4-1-20250805",
)

# Example usage
feedback = correctness_judge(
    inputs={"question": "What is MLflow?"},
    outputs={
        "response": "MLflow is an open-source platform for ML lifecycle management."
    },
)
print(f"Correctness: {feedback.value}")
```

  </TabItem>
  <TabItem value="reading-level" label="Reading Level Assessment">

```python
import textstat
from mlflow.genai.scorers import scorer
from mlflow.entities import Feedback


@scorer
def reading_level(outputs: str) -> Feedback:
    """Evaluate text complexity using Flesch Reading Ease."""
    score = textstat.flesch_reading_ease(outputs)

    if score >= 60:
        level = "easy"
        rationale = f"Reading ease score of {score:.1f} - accessible to most readers"
    elif score >= 30:
        level = "moderate"
        rationale = f"Reading ease score of {score:.1f} - college level complexity"
    else:
        level = "difficult"
        rationale = f"Reading ease score of {score:.1f} - expert level required"

    return Feedback(value=level, rationale=rationale, metadata={"score": score})
```

  </TabItem>
  <TabItem value="perplexity" label="Language Perplexity Scoring">

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
from mlflow.genai.scorers import scorer


@scorer
def perplexity_score(outputs: str) -> float:
    """Calculate perplexity to measure text quality and coherence."""
    model = AutoModelForCausalLM.from_pretrained("gpt2")
    tokenizer = AutoTokenizer.from_pretrained("gpt2")

    inputs = tokenizer(outputs, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs, labels=inputs["input_ids"])

    perplexity = torch.exp(outputs.loss).item()
    return perplexity  # Lower is better - indicates more natural text
```

  </TabItem>
  <TabItem value="latency" label="Response Latency Tracking">

```python
from mlflow.genai.scorers import scorer
from mlflow.entities import Feedback, Trace


@scorer
def response_time(trace: Trace) -> Feedback:
    """Evaluate response time from trace spans."""
    root_span = trace.data.spans[0]
    latency_ms = (root_span.end_time - root_span.start_time) / 1e6

    if latency_ms < 100:
        value = "fast"
    elif latency_ms < 500:
        value = "acceptable"
    else:
        value = "slow"

    return Feedback(
        value=value,
        rationale=f"Response took {latency_ms:.0f}ms",
        metadata={"latency_ms": latency_ms},
    )
```

  </TabItem>
</Tabs>
</TabsWrapper>

## Judge Alignment

One of the most powerful features of MLflow scorers is the ability to **align LLM judges with human preferences**. This transforms generic evaluation models into domain-specific experts that understand your unique quality standards.

### How Alignment Works

Judge alignment uses human feedback to improve the accuracy and consistency of LLM-based scorers:

```python
from mlflow.genai.judges import make_judge
import mlflow

# Create an initial judge
quality_judge = make_judge(
    name="quality",
    instructions="Evaluate if {{ outputs }} meets quality standards for {{ inputs }}.",
    feedback_value_type=bool,
    model="anthropic:/claude-opus-4-1-20250805",
)

# Collect traces with both judge assessments and human feedback
traces_with_feedback = mlflow.search_traces(
    experiment_ids=[experiment_id], max_results=20  # Minimum 10 required for alignment
)

# Align the judge with human preferences (uses default DSPy-SIMBA optimizer)
aligned_judge = quality_judge.align(traces_with_feedback)

# The aligned judge now better matches your team's quality standards
feedback = aligned_judge(inputs={"query": "..."}, outputs={"response": "..."})
```

### Key Benefits of Alignment

- **Domain Expertise**: Judges learn your specific quality criteria from expert feedback
- **Consistency**: Aligned judges apply standards uniformly across evaluations
- **Cost Efficiency**: Once aligned, smaller/cheaper models can match expert judgment
- **Continuous Improvement**: Re-align as your standards evolve

### The Plugin Architecture

MLflow's alignment system uses a plugin architecture, allowing you to create custom optimizers by extending the <APILink fn="mlflow.genai.judges.base.AlignmentOptimizer">AlignmentOptimizer</APILink> base class:

```python
from mlflow.genai.judges.base import AlignmentOptimizer


class CustomOptimizer(AlignmentOptimizer):
    def align(self, judge, traces):
        # Your custom alignment logic
        return improved_judge


# Use your custom optimizer
aligned_judge = quality_judge.align(traces, CustomOptimizer())
```

## Integration with MLflow Evaluation

Scorers are the building blocks of MLflow's evaluation framework. They integrate seamlessly with `mlflow.genai.evaluate()`:

```python
import mlflow
import pandas as pd

# Your test data
test_data = pd.DataFrame(
    [
        {
            "inputs": {"question": "What is MLflow?"},
            "outputs": {
                "response": "MLflow is an open-source platform for ML lifecycle management."
            },
            "expectations": {
                "ground_truth": "MLflow is an open-source platform for managing the ML lifecycle"
            },
        },
        {
            "inputs": {"question": "How do I track experiments?"},
            "outputs": {
                "response": "Use mlflow.start_run() to track experiments in MLflow."
            },
            "expectations": {
                "ground_truth": "Use mlflow.start_run() to track experiments"
            },
        },
    ]
)


# Your application (optional if data already has outputs)
def my_app(inputs):
    # Your model logic here
    return {"response": f"Answer to: {inputs['question']}"}


# Evaluate with multiple scorers
results = mlflow.genai.evaluate(
    data=test_data,
    # predict_fn is optional if data already has outputs
    scorers=[
        correctness_judge,  # LLM judge from above
        reading_level,  # Custom scorer from above
    ],
)

# Access evaluation metrics
print(f"Correctness: {results.metrics.get('correctness/mean', 'N/A')}")
print(f"Reading Level: {results.metrics.get('reading_level/mode', 'N/A')}")
```

## Best Practices

1. **Choose the Right Scorer Type**
   - Use code-based scorers for objective, deterministic metrics
   - Use LLM judges for subjective qualities requiring understanding
   - Use Agent-as-a-Judge for evaluating complex multi-step processes

2. **Combine Multiple Scorers**
   - No single metric captures all aspects of quality
   - Use a portfolio of scorers to get comprehensive evaluation
   - Balance efficiency (fast code-based) with depth (LLM and Agent judges)

3. **Align with Human Judgment**
   - Validate that your scorers correlate with human quality assessments
   - Use human feedback to improve LLM and Agent judge instructions
   - Consider using human-aligned judges for critical evaluations

4. **Monitor Scorer Performance**
   - Track scorer execution time and costs
   - Monitor for scorer failures and handle gracefully
   - Regularly review scorer outputs for consistency

## Next Steps

<TilesGrid>
  <TileCard
    icon={Brain}
    iconSize={48}
    title="LLM-based Scorers"
    description="Learn about using LLMs as judges for evaluation"
    href="/genai/eval-monitor/scorers/llm-judge/"
    linkText="Explore LLM judges →"
    containerHeight={64}
  />
  <TileCard
    icon={Users}
    iconSize={48}
    title="Judge Alignment"
    description="Align judges with human feedback for domain expertise"
    href="/genai/eval-monitor/scorers/llm-judge/alignment"
    linkText="Learn alignment →"
    containerHeight={64}
  />
  <TileCard
    icon={Code}
    iconSize={48}
    title="Code-based Scorers"
    description="Create custom Python functions for evaluation"
    href="/genai/eval-monitor/scorers/custom"
    linkText="Build custom scorers →"
    containerHeight={64}
  />
  <TileCard
    icon={Target}
    iconSize={48}
    title="Evaluation Guide"
    description="Learn how to run comprehensive evaluations"
    href="/genai/eval-monitor/quickstart"
    linkText="Start evaluating →"
    containerHeight={64}
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

---[FILE: span.mdx]---
Location: mlflow-master/docs/docs/genai/concepts/span.mdx

```text
import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"
import ImageBox from "@site/src/components/ImageBox";
import TabsWrapper from "@site/src/components/TabsWrapper";
import { APILink } from "@site/src/components/APILink";

# Spans

## What is a Span?

The Span object is a fundamental building block in the [Trace](/genai/concepts/trace) data model. It is a container for the information about the individual steps of the trace, such as LLM calls, tool execution, retrieval, etc. Spans form a hierarchical tree structure within a single trace, which represents the execution flow of the trace.

<ImageBox
  src="/images/llms/tracing/schema/span_architecture.png"
  alt="Example of a Span for a Tool Calling Agent"
  width="80%"
  caption="Example of a Span for a Tool Calling Agent"
/>

For example, the above picture illustrates a set of spans that are organized in a tree structure in a trace. Each line represents a span, where the tree-structure is formed by the curly edges between lines.

## Span Object Schema

MLflow's Span object is designed to be compatible with the [OpenTelemetry Span spec](https://opentelemetry.io/docs/concepts/signals/traces#spans). It is a dataclass object that is mostly same as the OpenTelemetry span object, but with some additional convenience accessors and methods to support GenAI use cases. When exported to OpenTelemetry-compatible backend, the Span object is serialized into the strict OpenTelemetry export format (OTLP).

| Field           | Type              | Description                                                                                                                                                                                                                                                   |
| --------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `span_id`       | `str`             | A unique identifier that is generated for each span within a trace.                                                                                                                                                                                           |
| `trace_id`      | `str`             | The unique identifier that links this span to its parent trace.                                                                                                                                                                                               |
| `parent_id`     | `Optional[str]`   | The identifier that establishes the hierarchical association of a given span with its parent span. If the span is the root span, this field is `None`.                                                                                                        |
| `name`          | `str`             | The name of the span, either user-defined or automatically generated based on the function or method being instrumented.                                                                                                                                      |
| `start_time_ns` | `int`             | The unix timestamp (in nanoseconds) when the span was started.                                                                                                                                                                                                |
| `end_time_ns`   | `int`             | The unix timestamp (in nanoseconds) when the span was ended.                                                                                                                                                                                                  |
| `status`        | `SpanStatus`      | The status of a span with values of OK, UNSET, or ERROR. The span status object contains an optional description if the status_code is reflecting an error that occurred.                                                                                     |
| `inputs`        | `Optional[Any]`   | The input data that is passed into the particular stage of your application.                                                                                                                                                                                  |
| `outputs`       | `Optional[Any]`   | The output data that is passed out of the particular stage of your application.                                                                                                                                                                               |
| `attributes`    | `Dict[str, Any]`  | Attributes are metadata that are associated with a given step within your application. These are key-value pairs that provide insight into behavioral modifications for function and method calls.                                                            |
| `events`        | `List[SpanEvent]` | Events are a system-level property that is optionally applied to a span only if there was an issue during the execution of the span. These events contain information about exceptions that were thrown in the instrumented call, as well as the stack trace. |

## Span Attributes

Span attributes are key-value pairs that provide insight into behavioral modifications for function and method calls.

```python
span.set_attributes(
    {
        "ai.model.name": "o3-mini",
        "ai.model.version": "2024-01-01",
        "ai.model.provider": "openai",
        "ai.model.temperature": 0.7,
        "ai.model.max_tokens": 1000,
        "infrastructure.gpu.type": "A100",
        "infrastructure.memory.used_mb": 2048,
    }
)
```

## Span Types

Span types are a way to categorize spans within a trace. MLflow provides a set of predefined span types for common use cases, while also allowing you to set custom span types.

<TabsWrapper>
<Tabs>
  <TabItem value="built-in" label="Built-in Types" default>
    | **Span Type**  | **Description**                                                                        |
    | -------------- | -------------------------------------------------------------------------------------- |
    | `"CHAT_MODEL"` | Represents a query to a chat model. This is a special case of an LLM interaction.      |
    | `"CHAIN"`      | Represents a chain of operations.                                                      |
    | `"AGENT"`      | Represents an autonomous agent operation.                                              |
    | `"TOOL"`       | Represents a tool execution (typically by an agent), such as querying a search engine. |
    | `"EMBEDDING"`  | Represents a text embedding operation.                                                 |
    | `"RETRIEVER"`  | Represents a context retrieval operation, such as querying a vector database.          |
    | `"PARSER"`     | Represents a parsing operation, transforming text into a structured format.            |
    | `"RERANKER"`   | Represents a re-ranking operation, ordering the retrieved contexts based on relevance. |
    | `"MEMORY"`     | Represents a memory operation, such as persisting context in a long-term memory db.    |
    | `"UNKNOWN"`    | A default span type that is used when no other span type is specified.                 |
  </TabItem>
  <TabItem value="usage" label="Setting Span Types">
    When you are using [automatic tracing](/genai/tracing/app-instrumentation/automatic), the span type is automatically set by MLflow.
    To set a span type for manually created spans, you can pass the `span_type` parameter to the <APILink fn="mlflow.trace" /> decorator or <APILink fn="mlflow.start_span" /> context manager. When you are using [automatic tracing](/genai/tracing/app-instrumentation/automatic), the span type is automatically set by MLflow.

    ```python
    import mlflow
    from mlflow.entities import SpanType


    # Setting a span type with the decorator
    @mlflow.trace(span_type=SpanType.RETRIEVER)
    def retrieve_documents(query: str):
        ...


    # Setting a span type with the context manager
    with mlflow.start_span(name="add", span_type=SpanType.TOOL) as span:
        span.set_inputs({"x": x, "y": y})
        z = x + y
        span.set_outputs({"z": z})


    # You can also define a custom span type string
    @mlflow.trace(span_type="ROUTER")
    def route_request(request):
        ...
    ```

  </TabItem>
  <TabItem value="search" label="Search Spans by Type">
    Span type is useful for searching and filtering particular spans in a large trace. MLflow supports both UI and programmatic span search by span type.

    **Searching spans by SDK:**

    ```python
    import mlflow
    from mlflow.entities import SpanType

    trace = mlflow.get_trace("<trace_id>")
    retriever_spans = trace.search_spans(span_type=SpanType.RETRIEVER)
    ```

    **Searching spans on UI:**

    ![Search Spans by Type](/images/llms/tracing/schema/search_spans_by_type.png)

  </TabItem>
</Tabs>
</TabsWrapper>

## Specialized Span Schemas

MLflow has predefined types of spans, and certain span types have properties that are required in order to enable additional functionality within the UI and downstream tasks such as evaluation.

### Retriever Spans

The `RETRIEVER` span type is used for operations involving retrieving data from a data store (for example, querying documents from a vector store). The output of a `RETRIEVER` span is expected to be a list of documents.

Each document in the list should be a dictionary with the following structure:

**`page_content`** (str): The text content of the retrieved document chunk.

**`metadata`** (Optional[Dict[str, Any]]): A dictionary of additional metadata associated with the document. MLflow UI and evaluation metrics may specifically look for:

- `doc_uri` (str): A string URI for the document source
- `chunk_id` (str): A string identifier if the document is part of a larger chunked document

**`id`** (Optional[str]): An optional unique identifier for the document chunk itself.

#### Example Usage

```python
import mlflow
from mlflow.entities import SpanType, Document


def search_store(query: str) -> list[tuple[str, str]]:
    # Simulate retrieving documents (e.g., from a vector database)
    return [
        (
            "MLflow Tracing helps debug GenAI applications...",
            "docs/mlflow/tracing_intro.md",
        ),
        (
            "Key components of a trace include spans...",
            "docs/mlflow/tracing_datamodel.md",
        ),
        ("MLflow provides automatic instrumentation...", "docs/mlflow/auto_trace.md"),
    ]


@mlflow.trace(span_type=SpanType.RETRIEVER)
def retrieve_relevant_documents(query: str):
    # Get documents from the search store
    docs = search_store(query)

    # Get the current active span (created by @mlflow.trace)
    span = mlflow.get_current_active_span()

    # Set the outputs of the span in accordance with the tracing schema
    outputs = [
        Document(page_content=doc, metadata={"doc_uri": uri}) for doc, uri in docs
    ]
    span.set_outputs(outputs)

    # Return the original format for downstream usage
    return docs


# Example usage
user_query = "MLflow Tracing benefits"
retrieved_docs = retrieve_relevant_documents(user_query)
```
```

--------------------------------------------------------------------------------

````
