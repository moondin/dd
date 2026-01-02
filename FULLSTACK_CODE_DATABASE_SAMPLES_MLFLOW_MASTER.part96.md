---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 96
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 96 of 991)

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
Location: mlflow-master/docs/docs/genai/assessments/feedback.mdx

```text
---
sidebar_label: Feedback Collection
---

import FeatureHighlights from "@site/src/components/FeatureHighlights";
import ConceptOverview from "@site/src/components/ConceptOverview";
import WorkflowSteps from "@site/src/components/WorkflowSteps";
import CollapsibleSection from "@site/src/components/CollapsibleSection";
import TilesGrid from "@site/src/components/TilesGrid";
import TileCard from "@site/src/components/TileCard";
import { APILink } from "@site/src/components/APILink";
import { BarChart3, Bot, Code, Users, TrendingUp, Shield, Eye, Database, Target, Book, MousePointer, Plus, ListCheck, Type, Settings, FileInput, MessageSquare, Search, Edit, Save, MoreVertical } from "lucide-react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import AddFeedbackImageUrl from '@site/static/images/assessments/add_feedback_ui.png';
import EditFeedbackImageUrl from '@site/static/images/assessments/edit_feedback_ui.png';
import AdditionalFeedbackImageUrl from '@site/static/images/assessments/additional_feedback_ui.png';

# Feedback Collection

MLflow Feedback provides a comprehensive system for capturing quality evaluations from multiple sources - whether automated AI judges, programmatic rules, or human reviewers. This systematic approach to feedback collection enables you to understand and improve your GenAI application's performance at scale.

For complete API documentation and implementation details, see the <APILink fn="mlflow.log_feedback" /> reference.

## What is Feedback?

[Feedback](/genai/concepts/feedback) captures evaluations of how well your AI performed. It measures the actual quality of what your AI produced across various dimensions like accuracy, relevance, safety, and helpfulness. Unlike [expectations](/genai/assessments/expectations) that define what should happen, feedback tells you what actually happened and how well it met your quality standards.

## Prerequisites

Before using feedback collection in MLflow, ensure you have:

- MLflow 3.2.0 or later installed
- An active MLflow tracking server or local tracking setup
- Traces that have been logged from your GenAI application to an MLflow Experiment

## Sources of Feedback

MLflow supports three types of feedback sources, each with unique strengths. You can use a single source or combine multiple sources for comprehensive quality coverage.

<ConceptOverview concepts={[
  {
    icon: Bot,
    title: "LLM Judge Evaluation",
    description: "AI-powered evaluation at scale. LLM judges provide consistent quality assessments for nuanced dimensions like relevance, tone, and safety without human intervention."
  },
  {
    icon: Code,
    title: "Programmatic Code Checks",
    description: "Deterministic rule-based evaluation. Perfect for format validation, compliance checks, and business logic rules that need instant, cost-effective assessment."
  },
  {
    icon: Users,
    title: "Human Expert Review",
    description: "Domain expert evaluation for high-stakes content. Human feedback captures nuanced insights that automated systems miss and serves as the gold standard."
  }
]} />

Using the feedback sources within the Python APIs is done as follows:

```python
from mlflow.entities import AssessmentSource, AssessmentSourceType

# Human expert providing evaluation
human_source = AssessmentSource(
    source_type=AssessmentSourceType.HUMAN, source_id="expert@company.com"
)

# Automated rule-based evaluation
code_source = AssessmentSource(
    source_type=AssessmentSourceType.CODE, source_id="accuracy_checker_v1"
)

# AI-powered evaluation at scale
llm_judge_source = AssessmentSource(
    source_type=AssessmentSourceType.LLM_JUDGE, source_id="gpt-4-evaluator"
)
```

## Why Collect Feedback?

Collecting feedback on the quality of GenAI applications is critical to a continuous improvement process, ensuring that your application remains effective and is enhanced over time.

<FeatureHighlights features={[
  {
    icon: TrendingUp,
    title: "Enable Continuous Improvement",
    description: "Create data-driven improvement cycles by systematically collecting quality signals to identify patterns, fix issues, and enhance AI performance over time."
  },
  {
    icon: Shield,
    title: "Scale Quality Assurance",
    description: "Monitor quality at production scale by evaluating every trace instead of small samples, catching issues before they impact users."
  },
  {
    icon: Eye,
    title: "Build Trust Through Transparency",
    description: "Show stakeholders exactly how quality is measured and by whom, building confidence in your AI system's reliability through clear attribution."
  },
  {
    icon: Database,
    title: "Create Training Data",
    description: "Generate high-quality training datasets from feedback, especially human corrections, to improve both AI applications and evaluation systems."
  }
]} />

## How Feedback Works

### Via API

Use the programmatic <APILink fn="mlflow.log_feedback" /> API when you need to automate feedback collection at scale, integrate with existing systems, or build custom evaluation workflows. The API enables you to collect feedback from all three sources programmatically.

## Step-by-Step Guides

### Add Human Evaluation via UI

The MLflow UI provides an intuitive way to add, edit, and manage feedback directly on traces. This approach is ideal for manual review, collaborative evaluation, and situations where domain experts need to provide feedback without writing code.

#### Adding New Feedback

<CollapsibleSection
  title="Show Step-by-Step Instructions (8 steps)"
  defaultExpanded={false}
>
  <WorkflowSteps
    steps={[
      {
        icon: MousePointer,
        title: "Navigate to your experiment",
        description: "Select the trace containing the AI response you want to evaluate"
      },
      {
        icon: Plus,
        title: "Click \"Add Assessment\" button",
        description: "Access the feedback creation form on the trace detail page"
      },
      {
        icon: ListCheck,
        title: "Select \"Feedback\" from the Assessment Type dropdown",
        description: "Choose Assessment Type to evaluate quality rather than define expectations"
      },
      {
        icon: Type,
        title: "Enter a descriptive name",
        description: "Use clear names like \"response_helpfulness\", \"accuracy_rating\", or \"content_safety\""
      },
      {
        icon: Settings,
        title: "Choose the appropriate data type",
        description: "Select Boolean for pass/fail, Number for ratings, String for categories"
      },
      {
        icon: FileInput,
        title: "Enter your evaluation value",
        description: "Provide rating from 1-5, True/False, or descriptive assessment text"
      },
      {
        icon: MessageSquare,
        title: "Add rationale explaining your evaluation reasoning",
        description: "Document why you gave this assessment for future reference and improvement"
      },
      {
        icon: Target,
        title: "Click \"Create\" to record your feedback",
        description: "Save your evaluation to build quality insights over time"
      }
    ]}
    screenshot={{
      src: AddFeedbackImageUrl,
      alt: "Add Feedback"
    }}
  />
</CollapsibleSection>

The feedback will be immediately attached to the trace with your user information as the source.

#### Editing Existing Feedback

To refine evaluations or correct mistakes:

<CollapsibleSection
  title="Show Step-by-Step Instructions (5 steps)"
  defaultExpanded={false}
>
  <WorkflowSteps
    steps={[
      {
        icon: Search,
        title: "Locate the feedback entry you want to modify",
        description: "Find the specific feedback on the trace detail page that needs updating"
      },
      {
        icon: MoreVertical,
        title: "Click the hamburger menu (⋮) next to the feedback entry",
        description: "Access the feedback options dropdown menu"
      },
      {
        icon: Edit,
        title: "Select \"Edit\" from the dropdown menu",
        description: "Choose the edit option to access the feedback modification form"
      },
      {
        icon: Settings,
        title: "Modify the value, rationale, or other fields",
        description: "Update rating, explanation, or other feedback details as needed"
      },
      {
        icon: Save,
        title: "Click \"Save\" to update the feedback",
        description: "Save your changes to preserve the updated evaluation, or click \"Cancel\" to discard changes"
      }
    ]}
    screenshot={{
      src: EditFeedbackImageUrl,
      alt: "Edit Feedback"
    }}
  />
</CollapsibleSection>

#### Adding Additional Feedback to Existing Entries

When multiple reviewers want to provide feedback on the same aspect, or when you want to add corrections to automated evaluations:

<CollapsibleSection
  title="Show Step-by-Step Instructions (4 steps)"
  defaultExpanded={false}
>
  <WorkflowSteps
    steps={[
      {
        icon: Search,
        title: "Find the existing feedback name you want to add to",
        description: "Locate the feedback category where you want to add another perspective"
      },
      {
        icon: Plus,
        title: "Click the plus (+) icon next to the feedback name",
        description: "Access the additional feedback form for the same quality aspect"
      },
      {
        icon: FileInput,
        title: "Enter your additional evaluation with appropriate rationale",
        description: "Provide your assessment and explanation from your perspective"
      },
      {
        icon: Save,
        title: "Click \"Create\" to add your feedback alongside existing entries",
        description: "Your evaluation will be added to the collection of perspectives, or click \"Cancel\" to discard"
      }
    ]}
    screenshot={{
      src: AdditionalFeedbackImageUrl,
      alt: "Additional Feedback"
    }}
  />
</CollapsibleSection>

This collaborative approach enables multiple perspectives on the same trace aspect, creating richer evaluation datasets and helping identify cases where evaluators disagree.

### Log Automated Assessment via API

<Tabs>
  <TabItem value="llm_judge" label="LLM Judge" default>

Implement automated LLM-based evaluation with these steps:

**1. Set up your evaluation environment:**

```python
import json
import mlflow
from mlflow.entities import AssessmentSource, AssessmentError
from mlflow.entities.assessment_source import AssessmentSourceType
import openai  # or your preferred LLM client

# Configure your LLM client
client = openai.OpenAI(api_key="your-api-key")
```

**2. Create your evaluation prompt:**

```python
def create_evaluation_prompt(user_input, ai_response):
    return f"""
    Evaluate the AI response for helpfulness and accuracy.

    User Input: {user_input}
    AI Response: {ai_response}

    Rate the response on a scale of 0.0 to 1.0 for:
    1. Helpfulness: How well does it address the user's needs?
    2. Accuracy: Is the information factually correct?

    Respond with only a JSON object:
    {{"helpfulness": 0.0-1.0, "accuracy": 0.0-1.0, "rationale": "explanation"}}
    """
```

**3. Implement the evaluation function:**

```python
def evaluate_with_llm_judge(trace_id, user_input, ai_response):
    try:
        # Get LLM evaluation
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "user",
                    "content": create_evaluation_prompt(user_input, ai_response),
                }
            ],
            temperature=0.0,
        )

        # Parse the evaluation

        evaluation = json.loads(response.choices[0].message.content)

        # Log feedback to MLflow
        mlflow.log_feedback(
            trace_id=trace_id,
            name="llm_judge_evaluation",
            value=evaluation,
            rationale=evaluation.get("rationale", ""),
            source=AssessmentSource(
                source_type=AssessmentSourceType.LLM_JUDGE, source_id="gpt-4-evaluator"
            ),
        )

    except Exception as e:
        # Log evaluation failure
        mlflow.log_feedback(
            trace_id=trace_id,
            name="llm_judge_evaluation",
            error=AssessmentError(error_code="EVALUATION_FAILED", error_message=str(e)),
            source=AssessmentSource(
                source_type=AssessmentSourceType.LLM_JUDGE, source_id="gpt-4-evaluator"
            ),
        )
```

**4. Use the evaluation function:**

```python
# Example usage
trace_id = "your-trace-id"
user_question = "What is the capital of France?"
ai_answer = "The capital of France is Paris."

evaluate_with_llm_judge(trace_id, user_question, ai_answer)
```

  </TabItem>
  <TabItem value="code_based" label="Heuristics Metrics">

Implement programmatic rule-based evaluation:

**1. Define your evaluation rules:**

```python
def evaluate_response_compliance(response_text):
    """Evaluate response against business rules."""
    results = {
        "has_disclaimer": False,
        "appropriate_length": False,
        "contains_prohibited_terms": False,
        "rationale": [],
    }

    # Check for required disclaimer
    if "This is not financial advice" in response_text:
        results["has_disclaimer"] = True
    else:
        results["rationale"].append("Missing required disclaimer")

    # Check response length
    if 50 <= len(response_text) <= 500:
        results["appropriate_length"] = True
    else:
        results["rationale"].append(
            f"Response length {len(response_text)} outside acceptable range"
        )

    # Check for prohibited terms
    prohibited_terms = ["guaranteed returns", "risk-free", "get rich quick"]
    found_terms = [
        term for term in prohibited_terms if term.lower() in response_text.lower()
    ]
    if found_terms:
        results["contains_prohibited_terms"] = True
        results["rationale"].append(f"Contains prohibited terms: {found_terms}")

    return results
```

**2. Implement the logging function:**

```python
def log_compliance_check(trace_id, response_text):
    # Run compliance evaluation
    evaluation = evaluate_response_compliance(response_text)

    # Calculate overall compliance score
    compliance_score = (
        sum(
            [
                evaluation["has_disclaimer"],
                evaluation["appropriate_length"],
                not evaluation["contains_prohibited_terms"],
            ]
        )
        / 3
    )

    # Log the feedback
    mlflow.log_feedback(
        trace_id=trace_id,
        name="compliance_check",
        value={"overall_score": compliance_score, "details": evaluation},
        rationale="; ".join(evaluation["rationale"]) or "All compliance checks passed",
        source=AssessmentSource(
            source_type=AssessmentSourceType.CODE, source_id="compliance_validator_v2.1"
        ),
    )
```

**3. Use in your application:**

```python
# Example usage after your AI generates a response
with mlflow.start_span(name="financial_advice") as span:
    ai_response = your_ai_model.generate(user_question)
    trace_id = span.trace_id

    # Run automated compliance check
    log_compliance_check(trace_id, ai_response)
```

  </TabItem>
</Tabs>

## Managing Feedback

Once you've collected feedback on your traces, you'll need to retrieve, update, and sometimes delete it. These operations are essential for maintaining accurate evaluation data.

### Retrieving Feedback

Retrieve specific feedback to analyze evaluation results:

```python
# Get a specific feedback by ID
feedback = mlflow.get_assessment(
    trace_id="tr-1234567890abcdef", assessment_id="a-0987654321abcdef"
)

# Access feedback details
name = feedback.name
value = feedback.value
source_type = feedback.source.source_type
rationale = feedback.rationale if hasattr(feedback, "rationale") else None
```

### Updating Feedback

Update existing feedback when you need to correct or refine evaluations:

```python
from mlflow.entities import Feedback

# Update feedback with new information
updated_feedback = Feedback(
    name="response_quality",
    value=0.9,
    rationale="Updated after additional review - response is more comprehensive than initially evaluated",
)

mlflow.update_assessment(
    trace_id="tr-1234567890abcdef",
    assessment_id="a-0987654321abcdef",
    assessment=updated_feedback,
)
```

### Deleting Feedback

Remove feedback that was logged incorrectly:

```python
# Delete specific feedback
mlflow.delete_assessment(
    trace_id="tr-1234567890abcdef", assessment_id="a-5555666677778888"
)
```

:::note
If deleting feedback that has been marked as a replacement using the `override_feedback` API, the original feedback will return to a valid state.
:::

## Overriding Automated Feedback

The `override_feedback` function allows human experts to correct automated evaluations while preserving the original for audit trails and learning.

### When to Override vs Update

- **Override**: Use when correcting automated feedback - preserves original for analysis
- **Update**: Use when fixing mistakes in existing feedback - modifies in place

### Override Example

```python
# Step 1: Original automated feedback (logged earlier)
llm_feedback = mlflow.log_feedback(
    trace_id="tr-1234567890abcdef",
    name="relevance",
    value=0.6,
    rationale="Response partially addresses the question",
    source=AssessmentSource(
        source_type=AssessmentSourceType.LLM_JUDGE, source_id="gpt-4-evaluator"
    ),
)

# Step 2: Human expert reviews and disagrees
corrected_feedback = mlflow.override_feedback(
    trace_id="tr-1234567890abcdef",
    assessment_id=llm_feedback.assessment_id,
    value=0.9,
    rationale="Response fully addresses the question with comprehensive examples",
    source=AssessmentSource(
        source_type=AssessmentSourceType.HUMAN, source_id="expert_reviewer@company.com"
    ),
    metadata={"override_reason": "LLM underestimated relevance", "confidence": "high"},
)
```

The override process marks the original feedback as invalid but preserves it for historical analysis and model improvement.

## Best Practices

### Consistent Naming Conventions

Use clear, descriptive names that make feedback data easy to analyze:

```python
# Good: Descriptive, specific names
mlflow.log_feedback(trace_id=trace_id, name="response_accuracy", value=0.95)
mlflow.log_feedback(trace_id=trace_id, name="sql_syntax_valid", value=True)
mlflow.log_feedback(trace_id=trace_id, name="execution_time_ms", value=245)

# Poor: Vague, inconsistent names
mlflow.log_feedback(trace_id=trace_id, name="good", value=True)
mlflow.log_feedback(trace_id=trace_id, name="score", value=0.95)
```

### Traceable Source Attribution

Provide specific source information for audit trails:

```python
# Excellent: Version-specific, environment-aware
source = AssessmentSource(
    source_type=AssessmentSourceType.CODE, source_id="response_validator_v2.1_prod"
)

# Good: Individual attribution
source = AssessmentSource(
    source_type=AssessmentSourceType.HUMAN, source_id="expert@company.com"
)

# Poor: Generic, untraceable
source = AssessmentSource(source_type=AssessmentSourceType.CODE, source_id="validator")
```

### Rich Metadata

Include context that helps with analysis:

```python
mlflow.log_feedback(
    trace_id=trace_id,
    name="response_quality",
    value=0.85,
    source=human_source,
    metadata={
        "reviewer_expertise": "domain_expert",
        "review_duration_seconds": 45,
        "confidence": "high",
        "criteria_version": "v2.3",
        "evaluation_context": "production_review",
    },
)
```

## Next Steps

<TilesGrid>
  <TileCard
    icon={Book}
    iconSize={48}
    title="Feedback Concepts"
    description="Deep dive into feedback architecture and schema"
    href="/genai/concepts/feedback"
    linkText="Learn concepts →"
    containerHeight={64}
  />
  <TileCard
    icon={Target}
    iconSize={48}
    title="Ground Truth Expectations"
    description="Learn how to define expected outputs for evaluation"
    href="/genai/assessments/expectations"
    linkText="Start annotating →"
    containerHeight={64}
  />
  <TileCard
    icon={BarChart3}
    iconSize={48}
    title="LLM Evaluation"
    description="Learn how to systematically evaluate and improve your GenAI applications"
    href="/genai/eval-monitor"
    linkText="Start evaluating →"
    containerHeight={64}
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

---[FILE: evaluation-datasets.mdx]---
Location: mlflow-master/docs/docs/genai/concepts/evaluation-datasets.mdx

```text
import { APILink } from "@site/src/components/APILink";
import ConceptOverview from "@site/src/components/ConceptOverview";
import TilesGrid from "@site/src/components/TilesGrid";
import TileCard from "@site/src/components/TileCard";
import { Database, ChartBar, FileText, Target, Activity, Code } from "lucide-react";
import useBaseUrl from '@docusaurus/useBaseUrl';

# Evaluation Dataset Concepts

:::warning[SQL Backend Required]
Evaluation Datasets require an MLflow Tracking Server with a **[SQL backend](/self-hosting/architecture/backend-store/#types-of-backend-stores)** (PostgreSQL, MySQL, SQLite, or MSSQL).
This feature is **not available** in FileStore (local mode) due to the relational data requirements
for managing dataset records, associations, and schema evolution.
:::

## What are Evaluation Datasets?

**Evaluation Datasets** in MLflow provide a structured way to organize and manage test data for GenAI applications. They serve as centralized repositories for test inputs, optional test outputs, expected outputs (expectations), and evaluation results, enabling systematic quality assessment across your AI development lifecycle.

Unlike static test files, evaluation datasets are **living validation collections** designed to grow and evolve with your application. Records can be continuously added from production traces, manual curation, or programmatic generation.

They can be viewed directly within the MLflow UI.

<video src={useBaseUrl("/images/eval-datasets.mp4")} controls loop autoPlay muted aria-label="Evaluation Datasets Video" />

## Core Components

Evaluation datasets are composed of several key elements that work together to provide comprehensive test management:

<ConceptOverview concepts={[
  {
    icon: Database,
    title: "Dataset Records",
    description: "Individual test cases containing inputs (what goes into your model), expectations (what should come out), optional outputs (what your application returned), and metadata about the source and tags for organization."
  },
  {
    icon: ChartBar,
    title: "Schema & Profile",
    description: "Automatically computed structure and statistics of your dataset. Schema tracks field names and types across records, while profile provides statistical summaries."
  },
  {
    icon: Target,
    title: "Expectations",
    description: "Ground truth values and quality criteria that define correct behavior. These are the set of standards against which your model outputs are evaluated."
  },
  {
    icon: Activity,
    title: "Experiment Association",
    description: "Links to MLflow experiments enable tracking which datasets were used for which model evaluations, providing full lineage and organizational control."
  }
]} />

## Dataset Object Schema

The <APILink fn="mlflow.entities.EvaluationDataset" text="EvaluationDataset" /> object contains the following fields:

| Field              | Type                  | Description                                                              |
| ------------------ | --------------------- | ------------------------------------------------------------------------ |
| `dataset_id`       | `str`                 | Unique identifier for the dataset (format: `d-{32 hex chars}`)           |
| `name`             | `str`                 | Human-readable name for the dataset                                      |
| `digest`           | `str`                 | Content hash for data integrity verification                             |
| `records`          | `list[DatasetRecord]` | The actual test data records containing inputs and expectations          |
| `schema`           | `Optional[str]`       | JSON string describing the structure of records (automatically computed) |
| `profile`          | `Optional[str]`       | JSON string containing statistical information about the dataset         |
| `tags`             | `dict[str, str]`      | Key-value pairs for organizing and categorizing datasets                 |
| `experiment_ids`   | `list[str]`           | List of MLflow experiment IDs this dataset is associated with            |
| `created_time`     | `int`                 | Timestamp when the dataset was created (milliseconds)                    |
| `last_update_time` | `int`                 | Timestamp of the last modification (milliseconds)                        |
| `created_by`       | `Optional[str]`       | User who created the dataset (auto-detected from tags)                   |
| `last_updated_by`  | `Optional[str]`       | User who last modified the dataset                                       |

## Record Structure

Each record in an evaluation dataset represents a single test case with the following structure:

```json
{
    "inputs": {
        "question": "What is the capital of France?",
        "context": "France is a country in Western Europe",
        "temperature": 0.7
    },
    "outputs": {
        "answer": "The capital of France is Paris."
    },
    "expectations": {
        "name": "expected_answer",
        "value": "Paris",
    },
    "source": {
        "source_type": "HUMAN",
        "source_data": {
            "annotator": "geography_expert@company.com",
            "annotation_date": "2024-08-07"
        }
    },
    "tags": {
        "category": "geography",
        "difficulty": "easy",
        "validated": "true"
    }
}
```

### Record Fields

- **inputs** (required): The test input data that will be passed to your model or application
- **outputs** (optional): The actual outputs generated by your model (typically used for post-hoc evaluation)
- **expectations** (optional): The expected outputs or quality criteria that define correct behavior
- **source** (optional): Provenance information about how this record was created (automatically inferred if not provided)
- **tags** (optional): Metadata specific to this individual record for organization and filtering

### Record Identity and Deduplication

Records are uniquely identified by a **hash of their inputs**. When merging records with <APILink fn="mlflow.entities.EvaluationDataset.merge_records" text="merge_records()" />, if a record with identical inputs already exists, its expectations and tags are merged rather than creating a duplicate. This enables iterative refinement of test cases without data duplication.

## Schema Evolution

Dataset schemas automatically evolve as you add records with new fields. The `schema` property tracks all field names and types encountered across records, while `profile` maintains statistical summaries. This automatic adaptation means you can start with simple test cases and progressively add complexity without manual schema migrations.

When new fields are introduced in subsequent records, they're automatically incorporated into the schema. Existing records without those fields are handled gracefully during evaluation and analysis.

## Next Steps

<TilesGrid>
  <TileCard
    icon={FileText}
    iconSize={48}
    title="SDK Guide"
    description="Complete reference for creating and managing evaluation datasets via the MLflow SDK"
    href="/genai/datasets/sdk-guide"
    linkText="View SDK guide →"
    containerHeight={64}
  />
  <TileCard
    icon={Code}
    iconSize={48}
    title="End-to-End Workflow"
    description="Learn the complete evaluation-driven development workflow from building to production"
    href="/genai/datasets/end-to-end-workflow"
    linkText="See workflow →"
    containerHeight={64}
  />
  <TileCard
    icon={Target}
    iconSize={48}
    title="Expectations"
    description="Learn how to define ground truth and quality criteria for your test cases"
    href="/genai/assessments/expectations"
    linkText="Understand expectations →"
    containerHeight={64}
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

---[FILE: expectations.mdx]---
Location: mlflow-master/docs/docs/genai/concepts/expectations.mdx

```text
import { APILink } from "@site/src/components/APILink";
import FeatureHighlights from "@site/src/components/FeatureHighlights";
import TilesGrid from "@site/src/components/TilesGrid";
import TileCard from "@site/src/components/TileCard";
import { Target, Users, Shield, GitCompare, MessageSquare, FileText } from "lucide-react";

# Expectation Concepts

## What are Expectations?

**Expectations** in MLflow represent the ground truth or desired outputs for your GenAI application. They provide a standardized way to capture what your AI system should produce for a given input, establishing the reference point against which actual performance is measured.

Expectations serve as the foundation for systematic evaluation, enabling you to define clear quality standards and measure how well your application meets them across different scenarios and use cases.

![Expectations in UI](/images/assessments/add_expectation_ui.png)

## Use Cases

<FeatureHighlights features={[
  {
    icon: Target,
    title: "Ground Truth Definition",
    description: "Establish clear, measurable standards for what your GenAI application should produce. For example, define expected answers for factual questions or desired formats for structured outputs."
  },
  {
    icon: Users,
    title: "Expert Knowledge Capture",
    description: "Capture domain expertise by having subject matter experts define the correct outputs for complex scenarios, creating a knowledge base that can guide both development and evaluation."
  },
  {
    icon: Shield,
    title: "Quality Standards",
    description: "Set explicit quality benchmarks for safety, accuracy, and compliance requirements. Expectations help ensure your AI meets organizational and regulatory standards."
  },
  {
    icon: GitCompare,
    title: "Model Comparison",
    description: "Use expectations as a consistent baseline to compare different models, prompts, or configurations. This enables objective evaluation of which approach best meets your requirements."
  }
]} />

## Core Structure

Expectations are always created by human experts who understand the correct behavior for your AI system. The <APILink fn="mlflow.entities.Expectation">`Expectation`</APILink> object in MLflow provides a standard container for storing these ground truth values along with metadata about their creation. Expectations are associated with a Trace, or a particular Span in the Trace, allowing you to define expected behavior at any level of granularity.

## Expectation Object Schema

| Field                 | Type                       | Description                                                                                                                                                                                                                                                                                                                                               |
| --------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                | `str`                      | A string identifying the specific aspect being defined as ground truth                                                                                                                                                                                                                                                                                    |
| `value`               | `Any`                      | The expected value, which can be <br/><br/> <ul><li>Text responses (e.g., `"The capital of France is Paris"`)</li><li>Structured data (e.g., `{"category": "complaint", "priority": "high"}`)</li><li>Lists (e.g., `["doc_123", "doc_456"]` for expected retrieval results)</li><li>Any JSON-serializable value representing the desired output</li></ul> |
| `source`              | `AssessmentSource`         | The source of the expectation, always of type `HUMAN` for expectations. The ID typically identifies the expert who defined the ground truth (e.g., email, username, or team identifier).                                                                                                                                                                  |
| `metadata`            | `Optional[dict[str, str]]` | Optional key-value pairs providing context about the expectation, such as confidence level, annotation guidelines used, or version information.                                                                                                                                                                                                           |
| `create_time_ms`      | `int`                      | The timestamp of when the expectation was created, in milliseconds.                                                                                                                                                                                                                                                                                       |
| `last_update_time_ms` | `int`                      | The timestamp of when the expectation was last updated, in milliseconds.                                                                                                                                                                                                                                                                                  |
| `trace_id`            | `str`                      | The ID of the trace that the expectation is attached to.                                                                                                                                                                                                                                                                                                  |
| `span_id`             | `Optional[str]`            | The ID of the span that the expectation is attached to, if it targets a specific operation within the trace. For example, you can set expectations for what documents should be retrieved in a RAG application.                                                                                                                                           |

## Expectation Examples

**Expected Answer for Factual Question**

```json
{
    "name": "expected_answer",
    "value": "The capital of France is Paris. It has been the capital since 987 AD and is home to over 2 million people.",
    "source": {
        "source_type": "HUMAN",
        "source_id": "geography_expert@company.com"
    },
    "metadata": {
        "confidence": "high",
        "reference": "Company knowledge base v2.1"
    }
}
```

**Expected Classification Output**

```json
{
    "name": "expected_classification",
    "value": {
        "category": "customer_complaint",
        "sentiment": "negative",
        "priority": "high",
        "department": "billing"
    },
    "source": {
        "source_type": "HUMAN",
        "source_id": "support_team_lead@company.com"
    },
    "metadata": {
        "classification_version": "v3.2",
        "based_on": "Historical ticket analysis"
    }
}
```

**Expected Document Retrieval for RAG System**

```json
{
    "name": "expected_documents",
    "value": ["policy_doc_2024_v3", "faq_billing_section", "terms_of_service_5.1"],
    "source": {
        "source_type": "HUMAN",
        "source_id": "rag_specialist@company.com"
    },
    "metadata": {
        "relevance_threshold": "0.85",
        "expected_order": "by_relevance"
    }
}
```

## Key Differences from Feedback

While both Expectations and Feedback are types of assessments in MLflow, they serve distinct purposes:

| Aspect      | Expectations                      | Feedback                                |
| ----------- | --------------------------------- | --------------------------------------- |
| **Purpose** | Define what the AI should produce | Evaluate how well the AI performed      |
| **Timing**  | Set before or during development  | Applied after AI generates output       |
| **Source**  | Always from human experts         | Can be from humans, LLM judges, or code |
| **Content** | Ground truth values               | Quality scores, pass/fail judgments     |
| **Usage**   | Reference point for evaluation    | Actual evaluation results               |

## Best Practices

1. **Be Specific**: Define expectations that are clear and unambiguous. Avoid vague expectations that could be interpreted multiple ways.

2. **Consider Edge Cases**: Include expectations for edge cases and error scenarios, not just happy path examples.

3. **Version Your Standards**: Use metadata to track which version of guidelines or standards was used to create expectations.

4. **Target Appropriate Granularity**: Use span-level expectations when you need to validate specific operations (like retrieval or parsing) within a larger workflow.

5. **Maintain Consistency**: Ensure multiple experts use the same criteria when defining expectations for similar scenarios.

## Integration with Evaluation

Expectations work hand-in-hand with MLflow's evaluation capabilities:

- **Automated Comparison**: Use expectations as the ground truth for automated evaluation metrics
- **Human Review**: Compare actual outputs against expectations during manual review
- **LLM Judge Evaluation**: Provide expectations as context to LLM judges for more accurate assessment
- **Performance Tracking**: Monitor how well your system meets expectations over time

## Next Steps

<TilesGrid>
  <TileCard
    icon={Target}
    iconSize={48}
    title="Annotating Expectations"
    description="Learn how to annotate ground truth expectations for your GenAI applications"
    href="/genai/assessments/expectations"
    linkText="Start annotating →"
    containerHeight={64}
  />
  <TileCard
    icon={FileText}
    iconSize={48}
    title="Expectations API Guide"
    description="Complete reference for the expectations API with practical examples"
    href="/genai/assessments/expectations"
    linkText="View API docs →"
    containerHeight={64}
  />
  <TileCard
    icon={MessageSquare}
    iconSize={48}
    title="Feedback Integration"
    description="Understand how expectations work with feedback for comprehensive evaluation"
    href="/genai/concepts/feedback"
    linkText="Learn about feedback →"
    containerHeight={64}
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

````
