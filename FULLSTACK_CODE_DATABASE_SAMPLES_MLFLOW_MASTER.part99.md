---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 99
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 99 of 991)

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

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/genai/datasets/index.mdx

```text
import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"
import TabsWrapper from "@site/src/components/TabsWrapper";
import FeatureHighlights from "@site/src/components/FeatureHighlights";
import ConceptOverview from "@site/src/components/ConceptOverview";
import TilesGrid from "@site/src/components/TilesGrid";
import TileCard from "@site/src/components/TileCard";
import DAGLoop from "@site/src/components/DAGLoop";
import { Database, Layers, TestTube, GitBranch, Users, ChartBar, FileText, Code, Activity, Target, BarChart3, TrendingUp, RefreshCw } from "lucide-react";
import useBaseUrl from '@docusaurus/useBaseUrl';

# Evaluation Datasets

## Transform Your GenAI Testing with Structured Evaluation Data

Evaluation datasets are the foundation of systematic GenAI application testing. They provide a centralized way to manage test data, ground truth expectations, and evaluation results—enabling you to measure and improve the quality of your AI applications with confidence.

:::warning[SQL Backend Required]
Evaluation Datasets require an MLflow Tracking Server with a **[SQL backend](/self-hosting/architecture/backend-store/#types-of-backend-stores)** (PostgreSQL, MySQL, SQLite, or MSSQL).
This feature is **not available** in FileStore (local file system-based tracking). If you need
a simple local configuration for MLflow, use the sqlite option when starting MLflow.
:::

## Quickstart: Build Your First Evaluation Dataset

There are several ways to create evaluation datasets, each suited to different stages of your GenAI development process.

The simplest way to create one is through MLflow's UI. Navigate to an Experiment that you want the evaluation dataset to be associated with and you can directly create a new one by supplying a unique name.
After adding records to it, you can view the dataset's entries in the UI.

<video src={useBaseUrl("/images/eval-datasets.mp4")} controls loop autoPlay muted aria-label="Evaluation Datasets Video" />

At its core, evaluation datasets are comprised of **inputs** and **expectations**. **Outputs** are an optional addition that can be added to an evaluation dataset for
post-hoc evaluation with scorers. Adding these elements can be done either directly from traces, dictionaries, or via a Pandas DataFrame.

<TabsWrapper>
<Tabs>
<TabItem value="from-traces" label="Build from Traces" default>

```python
import mlflow
from mlflow.genai.datasets import create_dataset, set_dataset_tags

# Create your evaluation dataset
dataset = create_dataset(
    name="production_validation_set",
    experiment_id=["0"],  # "0" is the default experiment
    tags={"team": "ml-platform", "stage": "validation"},
)

# Optionally, add additional tags to your dataset.
# Tags can be used to search for datasets with search_datasets API
set_dataset_tags(
    dataset_id=dataset.dataset_id,
    tags={"environment": "dev", "validation_version": "1.3"},
)

# First, retrieve traces that will become the basis of the dataset
traces = mlflow.search_traces(
    experiment_ids=["0"],
    max_results=20,
    filter_string="attributes.name = 'chat_completion'",
    return_type="list",  # Returns list[Trace]
)

# Add expectations to the traces
for trace in traces:
    mlflow.log_expectation(
        trace_id=trace.info.trace_id,
        name="expected_answer",
        value=(
            "The correct answer should include step-by-step instructions "
            "for password reset with email verification"
        ),
    )

# Retrieve the traces with added expectations
annotated_traces = mlflow.search_traces(
    experiment_ids=["0"],
    max_results=20,
    return_type="list",
)

# Merge the list of Trace objects directly into your dataset
dataset.merge_records(annotated_traces)
```

</TabItem>
<TabItem value="from-dicts" label="From Dictionaries">

```python
import mlflow
from mlflow.genai.datasets import create_dataset

# Create dataset with manual test cases
dataset = create_dataset(
    name="regression_test_suite",
    experiment_id=["0", "1"],  # Multiple experiments
    tags={"type": "regression", "priority": "critical"},
)

# Define test cases with expected outputs (ground truth)
test_cases = [
    {
        "inputs": {
            "question": "How do I reset my password?",
            "context": "user_support",
        },
        "expectations": {
            "expected_answer": (
                "To reset your password, click 'Forgot Password' on the login page, "
                "enter your email, and follow the link sent to your inbox"
            ),
            "must_contain_steps": True,
            "expected_tone": "helpful",
        },
    },
    {
        "inputs": {
            "question": "What are your refund policies?",
            "context": "customer_service",
        },
        "expectations": {
            "expected_answer": (
                "We offer full refunds within 30 days of purchase. "
                "Refunds after 30 days are subject to approval."
            ),
            "must_include_timeframe": True,
            "must_mention_exceptions": True,
        },
    },
]

dataset.merge_records(test_cases)
```

</TabItem>
<TabItem value="from-pandas" label="From DataFrame">

```python
import pandas as pd
from mlflow.genai.datasets import create_dataset

# Create dataset
dataset = create_dataset(
    name="benchmark_dataset",
    experiment_id=["0"],
    tags={"source": "benchmark", "version": "2024.1"},
)

# Create DataFrame with inputs and expectations (ground truth)
df = pd.DataFrame(
    [
        {
            "inputs": {
                "question": "What is MLflow?",
                "domain": "general",
            },
            "expectations": {
                "expected_answer": "MLflow is an open-source platform for ML",
                "must_mention": ["tracking", "experiments", "models"],
            },
        },
        {
            "inputs": {
                "question": "How do I track experiments?",
                "domain": "technical",
            },
            "expectations": {
                "expected_answer": "Use mlflow.start_run() and mlflow.log_params()",
                "must_mention": ["log_params", "log_metrics"],
            },
        },
        {
            "inputs": {
                "question": "Explain model versioning",
                "domain": "technical",
            },
            "expectations": {
                "expected_answer": "Model Registry provides versioning",
                "must_mention": ["Model Registry", "versions"],
            },
        },
    ]
)

# Add records from DataFrame
dataset.merge_records(df)
```

</TabItem>
</Tabs>
</TabsWrapper>

## Understanding Source Types

Every record in an evaluation dataset has a **source type** that tracks its provenance. This enables you to analyze model performance by data origin and understand which types of test data are most valuable.

<FeatureHighlights features={[
  {
    icon: Activity,
    title: "TRACE",
    description: "Records from production traces - automatically assigned when adding traces via mlflow.search_traces()"
  },
  {
    icon: Users,
    title: "HUMAN",
    description: "Subject matter expert annotations - automatically inferred for records with expectations (ground truth)"
  },
  {
    icon: Code,
    title: "CODE",
    description: "Programmatically generated test cases - automatically inferred for records without expectations"
  },
  {
    icon: FileText,
    title: "DOCUMENT",
    description: "Test cases extracted from documentation or specs - must be explicitly specified with source metadata"
  }
]} />

Source types are automatically inferred based on record characteristics but can be explicitly overridden when needed. See the [SDK Guide](/genai/datasets/sdk-guide#source-type-inference) for detailed inference rules and examples.

## Why Evaluation Datasets?

<FeatureHighlights features={[
  {
    icon: Database,
    title: "Centralized Test Management",
    description: "Store all your test cases, expected outputs, and evaluation criteria in one place. No more scattered CSV files or hardcoded test data."
  },
  {
    icon: RefreshCw,
    title: "Consistent Evaluation Source",
    description: "Maintain a concrete representation of test data that can be used repeatedly as your project evolves. Eliminate manual testing and avoid repeatedly assembling evaluation data for each iteration."
  },
  {
    icon: TestTube,
    title: "Systematic Testing",
    description: "Move beyond ad-hoc testing to systematic evaluation. Define clear expectations and measure performance consistently across deployments."
  },
  {
    icon: Users,
    title: "Collaborative Improvement",
    description: "Enable your entire team to contribute test cases and expectations. Share evaluation datasets across projects and teams."
  }
]} />

## The Evaluation Loop

Evaluation datasets bridge the critical gap between trace generation and evaluation execution in the GenAI development lifecycle. As you test your application and capture traces with expectations, **evaluation datasets transform these individual test cases into a materialized, reusable evaluation suite**. This creates a consistent and evolving collection of evaluation records that grows with your application—each iteration adds new test cases while preserving the historical test coverage. Rather than losing valuable test scenarios after each development cycle, you build a comprehensive evaluation asset that can immediately assess the quality of changes and improvements to your implementation.

<DAGLoop
  title="The Evaluation Loop"
  steps={[
    {
      icon: Code,
      title: "Iterate on Code",
      description: "Build and improve your GenAI application",
      detailedDescription: "Whether starting fresh or improving existing code, implement changes to your GenAI application. Use MLflow's comprehensive tracing to monitor each iteration, capture execution details, and track how your modifications impact performance and quality."
    },
    {
      icon: TestTube,
      title: "Test App",
      description: "Run initial tests and scenarios",
      detailedDescription: "Execute thorough testing with diverse prompts including edge cases, adversarial inputs, and typical user scenarios. Use MLflow's tracing to capture every interaction, response time, and token consumption for analysis."
    },
    {
      icon: Activity,
      title: "Collect Traces",
      description: "Capture real interactions",
      detailedDescription: "Systematically collect traces from both testing environments and production deployments. Each trace contains the complete request-response cycle, intermediate steps, and metadata that forms the foundation of your evaluation data."
    },
    {
      icon: Target,
      title: "Add Expectations",
      description: "Define ground truth outputs",
      detailedDescription: "Annotate traces with expected outputs and quality criteria. Domain experts define what constitutes correct behavior, creating a gold standard for evaluation. These expectations become the benchmark against which all AI responses are measured."
    },
    {
      icon: Database,
      title: "Create Dataset",
      description: "Organize evaluation data",
      detailedDescription: "Transform your annotated traces into structured evaluation datasets. These datasets become reusable test suites that can be versioned, shared across teams, and used to consistently measure performance across different model versions and configurations.",
      isFocus: true
    },
    {
      icon: BarChart3,
      title: "Run Evaluation",
      description: "Execute systematic evaluation",
      detailedDescription: "Run comprehensive evaluations using MLflow's evaluation framework with automated scorers, LLM judges, and custom metrics. Generate detailed reports comparing actual outputs against expectations to quantify your AI's performance."
    },
    {
      icon: TrendingUp,
      title: "Analyze Results",
      description: "Identify improvements",
      detailedDescription: "Deep dive into evaluation results to identify patterns, failure modes, and improvement opportunities. Use MLflow's visualization tools to compare performance across experiments and track progress over time."
    }
  ]}
  loopBackIcon={RefreshCw}
  loopBackText="Iterate & Improve"
  loopBackDescription="After analyzing results, iterate on your application by refining prompts, adjusting model parameters, or enhancing your evaluation criteria. The cycle continues as you progressively improve quality."
  circleSize={600}
/>

## Key Features

<ConceptOverview concepts={[
  {
    icon: Target,
    title: "Ground Truth Management",
    description: "Define and maintain expected outputs for your test cases. Capture expert knowledge about what constitutes correct behavior for your AI system."
  },
  {
    icon: GitBranch,
    title: "Schema Evolution",
    description: "Automatically track the structure of your test data as it evolves. Add new fields and test dimensions without breaking existing evaluations."
  },
  {
    icon: RefreshCw,
    title: "Incremental Updates",
    description: "Continuously improve your test suite by adding new cases from production. Update expectations as your understanding of correct behavior evolves."
  },
  {
    icon: FileText,
    title: "Flexible Tagging",
    description: "Organize datasets with tags for easy discovery and filtering. Track metadata like data sources, annotation guidelines, and quality levels."
  },
  {
    icon: TrendingUp,
    title: "Performance Tracking",
    description: "Monitor how your application performs against the same test data over time. Identify regressions and improvements across deployments."
  },
  {
    icon: Activity,
    title: "Experiment Integration",
    description: "Link datasets to MLflow experiments for complete traceability. Understand which test data was used for each model evaluation."
  }
]} />

## Next Steps

Ready to improve your GenAI testing? Start with these resources:

<TilesGrid>
  <TileCard
    icon={Layers}
    iconSize={48}
    title="Dataset Structure"
    description="Understand how evaluation datasets organize test inputs, expectations, and metadata"
    href="/genai/concepts/evaluation-datasets"
    linkText="Learn the concepts →"
    containerHeight={64}
  />
  <TileCard
    icon={Code}
    iconSize={48}
    title="SDK Guide"
    description="Complete guide to creating and managing evaluation datasets programmatically"
    href="/genai/datasets/sdk-guide"
    linkText="View SDK guide →"
    containerHeight={64}
  />
  <TileCard
    icon={Target}
    iconSize={48}
    title="Setting Expectations"
    description="Learn how to define ground truth and expected outputs for your AI system"
    href="/genai/assessments/expectations"
    linkText="Define expectations →"
    containerHeight={64}
  />
  <TileCard
    icon={Activity}
    iconSize={48}
    title="Tracing Guide"
    description="Capture detailed execution data from your GenAI applications"
    href="/genai/tracing"
    linkText="Start tracing →"
    containerHeight={64}
  />
  <TileCard
    icon={ChartBar}
    iconSize={48}
    title="Evaluation Framework"
    description="Run systematic evaluations using your datasets with automated scorers"
    href="/genai/eval-monitor"
    linkText="Learn evaluation →"
    containerHeight={64}
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

---[FILE: sdk-guide.mdx]---
Location: mlflow-master/docs/docs/genai/datasets/sdk-guide.mdx

```text
import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"
import { APILink } from "@site/src/components/APILink";
import TabsWrapper from "@site/src/components/TabsWrapper";
import ConceptOverview from "@site/src/components/ConceptOverview";
import TilesGrid from "@site/src/components/TilesGrid";
import TileCard from "@site/src/components/TileCard";
import FeatureHighlights from "@site/src/components/FeatureHighlights";
import { Activity, Users, Code, FileText, HelpCircle, Rocket, BarChart3, Target } from "lucide-react";

# Evaluation Datasets SDK Reference

Complete API reference for creating, managing, and querying evaluation datasets programmatically.

:::warning[SQL Backend Required]
Evaluation Datasets require an MLflow Tracking Server with a **[SQL backend](/self-hosting/architecture/backend-store/#types-of-backend-stores)** (PostgreSQL, MySQL, SQLite, or MSSQL).
This feature is **not available** with FileStore (local file system-based tracking).
:::

## Creating a Dataset

Use <APILink fn="mlflow.genai.datasets.create_dataset" text="create_dataset()" /> to create a new evaluation dataset:

```python
from mlflow.genai.datasets import create_dataset

# Create a new dataset
dataset = create_dataset(
    name="customer_support_qa",
    experiment_id=["0"],  # Link to experiments
    tags={"version": "1.0", "team": "ml-platform", "status": "active"},
)

print(f"Created dataset: {dataset.dataset_id}")
```

You can also use the <APILink fn="mlflow.tracking.MlflowClient" text="MlflowClient" /> API:

```python
from mlflow import MlflowClient

client = MlflowClient()
dataset = client.create_dataset(
    name="customer_support_qa",
    experiment_id=["0"],
    tags={"version": "1.0"},
)
```

## Adding Records to a Dataset

Use the <APILink fn="mlflow.entities.EvaluationDataset.merge_records" text="merge_records()" /> method to add new records to your dataset. Records can be added from dictionaries, DataFrames, or traces:

<TabsWrapper>
  <Tabs>
    <TabItem value="from-dicts" label="From Dictionaries" default>

Add records directly from Python dictionaries:

```python
# Add records with inputs and expectations (ground truth)
new_records = [
    {
        "inputs": {"question": "What are your business hours?"},
        "expectations": {
            "expected_answer": "We're open Monday-Friday 9am-5pm EST",
            "must_mention_hours": True,
            "must_include_timezone": True,
        },
    },
    {
        "inputs": {"question": "How do I reset my password?"},
        "expectations": {
            "expected_answer": (
                "Click 'Forgot Password' and follow the email instructions"
            ),
            "must_include_steps": True,
        },
    },
]

dataset.merge_records(new_records)
print(f"Dataset now has {len(dataset.records)} records")
```

    </TabItem>
    <TabItem value="from-traces" label="From Traces">

Add records from MLflow traces:

```python
import mlflow

# Search for traces to add to the dataset
traces = mlflow.search_traces(
    experiment_ids=["0"],
    filter_string="attributes.name = 'chat_completion'",
    max_results=50,
    return_type="list",
)

# Add traces directly to the dataset
dataset.merge_records(traces)
```

    </TabItem>
    <TabItem value="from-dataframe" label="From DataFrame">

Add records from a pandas DataFrame:

```python
import pandas as pd

# Create DataFrame with structured data (ground truth expectations)
df = pd.DataFrame(
    [
        {
            "inputs": {
                "question": "What is MLflow?",
                "context": "general",
            },
            "expectations": {
                "expected_answer": "MLflow is an open-source platform for ML lifecycle",
                "must_mention": ["tracking", "experiments"],
            },
            "tags": {"priority": "high"},
        },
        {
            "inputs": {
                "question": "How to track experiments?",
                "context": "technical",
            },
            "expectations": {
                "expected_answer": "Use mlflow.start_run() and mlflow.log_params()",
                "must_mention": ["log_params", "start_run"],
            },
            "tags": {"priority": "medium"},
        },
    ]
)

dataset.merge_records(df)
```

    </TabItem>

  </Tabs>
</TabsWrapper>

## Updating Existing Records

The <APILink fn="mlflow.entities.EvaluationDataset.merge_records" text="merge_records()" /> method intelligently handles updates. **Records are matched based on a hash of their inputs** - if a record with identical inputs already exists, its expectations and tags are merged rather than creating a duplicate:

```python
# Initial record
dataset.merge_records(
    [
        {
            "inputs": {"question": "What is MLflow?"},
            "expectations": {
                "expected_answer": "MLflow is a platform for ML",
                "must_mention_tracking": True,
            },
        }
    ]
)

# Update with same inputs but enhanced expectations
dataset.merge_records(
    [
        {
            "inputs": {"question": "What is MLflow?"},  # Same inputs = update
            "expectations": {
                # Updates existing value
                "expected_answer": (
                    "MLflow is an open-source platform for managing the ML lifecycle"
                ),
                "must_mention_models": True,  # Adds new expectation
                # Note: "must_mention_tracking": True is preserved
            },
        }
    ]
)

# Result: One record with merged expectations
```

## Retrieving Datasets

Retrieve existing datasets by ID or search for them:

<TabsWrapper>
  <Tabs>
    <TabItem value="get-by-id" label="Get by ID" default>

```python
from mlflow.genai.datasets import get_dataset

# Get a specific dataset by ID
dataset = get_dataset(dataset_id="d-7f2e3a9b8c1d4e5f")

# Access dataset properties
print(f"Name: {dataset.name}")
print(f"Records: {len(dataset.records)}")
print(f"Schema: {dataset.schema}")
print(f"Tags: {dataset.tags}")
```

    </TabItem>
    <TabItem value="search" label="Search Datasets">

```python
from mlflow.genai.datasets import search_datasets

# Search for datasets with filters
datasets = search_datasets(
    experiment_ids=["0"],
    filter_string="tags.status = 'active' AND name LIKE '%support%'",
    order_by=["last_update_time DESC"],
    max_results=10,
)

for ds in datasets:
    print(f"{ds.name} ({ds.dataset_id}): {len(ds.records)} records")
```

See [Search Filter Reference](#search-filter-reference) for filter syntax details.

    </TabItem>

  </Tabs>
</TabsWrapper>

## Managing Tags

Add, update, or remove tags from datasets:

```python
from mlflow.genai.datasets import set_dataset_tags, delete_dataset_tag

# Set or update tags
set_dataset_tags(
    dataset_id=dataset.dataset_id,
    tags={"status": "production", "validated": "true", "version": "2.0"},
)

# Delete a specific tag
delete_dataset_tag(dataset_id=dataset.dataset_id, key="deprecated")
```

## Deleting a Dataset

Permanently delete a dataset and all its records:

```python
from mlflow.genai.datasets import delete_dataset

# Delete the entire dataset
delete_dataset(dataset_id="d-1a2b3c4d5e6f7890")
```

:::warning
Dataset deletion is permanent and cannot be undone. All records will be deleted.
:::

## Working with Dataset Records

The <APILink fn="mlflow.entities.EvaluationDataset" text="EvaluationDataset" /> object provides several ways to access and analyze records:

```python
# Access all records
all_records = dataset.records

# Convert to DataFrame for analysis
df = dataset.to_df()
print(df.head())

# View dataset schema (auto-computed from records)
print(dataset.schema)

# View dataset profile (statistics)
print(dataset.profile)

# Get record count
print(f"Total records: {len(dataset.records)}")
```

---

## Advanced Topics

### Understanding Input Uniqueness

Records are considered unique based on their **entire inputs dictionary**. Even small differences create separate records:

```python
# These are treated as different records due to different inputs
record_a = {
    "inputs": {"question": "What is MLflow?", "temperature": 0.7},
    "expectations": {"expected_answer": "MLflow is an ML platform"},
}

record_b = {
    "inputs": {
        "question": "What is MLflow?",
        "temperature": 0.8,
    },  # Different temperature
    "expectations": {"expected_answer": "MLflow is an ML platform"},
}

dataset.merge_records([record_a, record_b])
# Results in 2 separate records due to different temperature values
```

### Source Type Inference

MLflow automatically assigns source types before sending records to the backend using these rules:

<ConceptOverview
  concepts={[
    {
      title: "Automatic Inference",
      description: "MLflow automatically infers source types based on record characteristics when no explicit source is provided."
    },
    {
      title: "Client-Side Processing",
      description: "Source type inference happens in merge_records() before records are sent to the tracking backend."
    },
    {
      title: "Manual Override",
      description: "You can always specify explicit source information to override automatic inference."
    }
  ]}
/>

#### Inference Rules

<TabsWrapper>
  <Tabs>
    <TabItem value="trace" label="TRACE Source" default>

Records from MLflow traces are automatically assigned the `TRACE` source type:

```python
# When adding traces directly (automatic TRACE source)
traces = mlflow.search_traces(experiment_ids=["0"], return_type="list")
dataset.merge_records(traces)

# Or when using DataFrame from search_traces
traces_df = mlflow.search_traces(experiment_ids=["0"])  # Returns DataFrame
# Automatically detects traces and assigns TRACE source
dataset.merge_records(traces_df)
```

    </TabItem>
    <TabItem value="human" label="HUMAN Source">

Records with expectations are inferred as `HUMAN` source:

```python
# Records with expectations indicate human review/annotation
human_curated = [
    {
        "inputs": {"question": "What is MLflow?"},
        "expectations": {
            "expected_answer": "MLflow is an open-source ML platform",
            "must_mention": ["tracking", "models", "deployment"],
        }
        # Automatically inferred as HUMAN source
    }
]
dataset.merge_records(human_curated)
```

    </TabItem>
    <TabItem value="code" label="CODE Source">

Records with only inputs (no expectations) are inferred as `CODE` source:

```python
# Records without expectations are inferred as CODE source
generated_tests = [{"inputs": {"question": f"Test question {i}"}} for i in range(100)]
dataset.merge_records(generated_tests)
```

    </TabItem>

  </Tabs>
</TabsWrapper>

#### Manual Source Override

You can explicitly specify the source type and metadata for any record:

```python
# Specify HUMAN source with metadata
human_curated = {
    "inputs": {"question": "What are your business hours?"},
    "expectations": {
        "expected_answer": "We're open Monday-Friday 9am-5pm EST",
        "must_include_timezone": True,
    },
    "source": {
        "source_type": "HUMAN",
        "source_data": {"curator": "support_team", "date": "2024-11-01"},
    },
}

# Specify DOCUMENT source
from_docs = {
    "inputs": {"question": "How to install MLflow?"},
    "expectations": {
        "expected_answer": "pip install mlflow",
        "must_mention_pip": True,
    },
    "source": {
        "source_type": "DOCUMENT",
        "source_data": {"document_id": "install_guide", "page": 1},
    },
}

dataset.merge_records([human_curated, from_docs])
```

#### Available Source Types

<FeatureHighlights features={[
  {
    icon: Activity,
    title: "TRACE",
    description: "Production data captured via MLflow tracing - automatically assigned when adding traces"
  },
  {
    icon: Users,
    title: "HUMAN",
    description: "Subject matter expert annotations - inferred for records with expectations"
  },
  {
    icon: Code,
    title: "CODE",
    description: "Programmatically generated tests - inferred for records without expectations"
  },
  {
    icon: FileText,
    title: "DOCUMENT",
    description: "Test cases from documentation or specs - must be explicitly specified"
  },
  {
    icon: HelpCircle,
    title: "UNSPECIFIED",
    description: "Source unknown or not provided - for legacy or imported data"
  }
]} />

### Search Filter Reference

#### Searchable Fields

| Field              | Type      | Example                               |
| ------------------ | --------- | ------------------------------------- |
| `name`             | string    | `name = 'production_tests'`           |
| `tags.<key>`       | string    | `tags.status = 'validated'`           |
| `created_by`       | string    | `created_by = 'alice@company.com'`    |
| `last_updated_by`  | string    | `last_updated_by = 'bob@company.com'` |
| `created_time`     | timestamp | `created_time > 1698800000000`        |
| `last_update_time` | timestamp | `last_update_time > 1698800000000`    |

#### Filter Operators

- `=`, `!=`: Exact match
- `LIKE`, `ILIKE`: Pattern matching with `%` wildcard (ILIKE is case-insensitive)
- `>`, `<`, `>=`, `<=`: Numeric/timestamp comparison
- `AND`: Combine conditions (OR is not currently supported)

#### Common Filter Examples

<table style={{ width: "100%" }}>
  <thead>
    <tr>
      <th style={{ width: "40%" }}>Filter Expression</th>
      <th style={{ width: "30%" }}>Description</th>
      <th style={{ width: "30%" }}>Use Case</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>`name = 'production_qa'`</strong></td>
      <td>Exact name match</td>
      <td>Find a specific dataset</td>
    </tr>
    <tr>
      <td><strong>`name LIKE '%test%'`</strong></td>
      <td>Pattern matching</td>
      <td>Find all test datasets</td>
    </tr>
    <tr>
      <td><strong>`tags.status = 'validated'`</strong></td>
      <td>Tag equality</td>
      <td>Find production-ready datasets</td>
    </tr>
    <tr>
      <td><strong>`tags.version = '2.0' AND tags.team = 'ml'`</strong></td>
      <td>Multiple tag conditions</td>
      <td>Find team-specific versions</td>
    </tr>
    <tr>
      <td><strong>`created_by = 'alice@company.com'`</strong></td>
      <td>Creator filter</td>
      <td>Find datasets by author</td>
    </tr>
    <tr>
      <td><strong>`created_time > 1698800000000`</strong></td>
      <td>Time-based filter</td>
      <td>Find recent datasets</td>
    </tr>
  </tbody>
</table>

```python
# Complex filter example
datasets = search_datasets(
    filter_string="""
        tags.status = 'production'
        AND name LIKE '%customer%'
        AND created_time > 1698800000000
    """,
    order_by=["last_update_time DESC"],
)
```

---

## Next Steps

<TilesGrid>
  <TileCard
    icon={Rocket}
    iconSize={48}
    title="End-to-End Workflow"
    description="Learn the complete evaluation-driven development workflow from app building to production"
    href="/genai/datasets/end-to-end-workflow"
    linkText="View complete workflow →"
    containerHeight={64}
  />
  <TileCard
    icon={BarChart3}
    iconSize={48}
    title="Run Evaluations"
    description="Use your datasets to systematically evaluate and improve your GenAI applications"
    href="/genai/eval-monitor"
    linkText="Start evaluating →"
    containerHeight={64}
  />
  <TileCard
    icon={Target}
    iconSize={48}
    title="Define Expectations"
    description="Learn how to add ground truth expectations to your test data for quality validation"
    href="/genai/assessments/expectations"
    linkText="Set expectations →"
    containerHeight={64}
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

---[FILE: faq.mdx]---
Location: mlflow-master/docs/docs/genai/eval-monitor/faq.mdx

```text
import { APILink } from "@site/src/components/APILink";
import ImageBox from '@site/src/components/ImageBox';

# Evaluate & Monitor FAQ

This page addresses frequently asked questions about MLflow's GenAI evaluation.

## Where can I find the evaluation results in MLflow UI?

After an evaluation completes, you can find the resulting runs on the experiment page. Click the run name to view aggregated metrics and metadata in the overview pane.

To inspect per-row evaluation results, open the **Traces** tab on the run overview page.

<ImageBox src="/images/mlflow-3/eval-monitor/quickstart-eval-result.png" alt="Detailed Evaluation Results" width="90%" />

## How to change the concurrency of the evaluation?

MLflow uses thread pools to run the predict function and scorers in parallel. You can configure concurrency at two levels:

**1. Data-level concurrency:** Controls how many data items are evaluated in parallel.

```bash
# Limit concurrent data items being evaluated (default: 10)
export MLFLOW_GENAI_EVAL_MAX_WORKERS=5
```

**2. Scorer-level concurrency:** Controls how many scorers run in parallel for each data item. The actual number of scorer workers will not exceed the number of scorers being used.

```bash
# Limit concurrent scorer execution (default: 10)
export MLFLOW_GENAI_EVAL_MAX_SCORER_WORKERS=2

# For strict rate limiting, run scorers sequentially
export MLFLOW_GENAI_EVAL_MAX_SCORER_WORKERS=1
```

The total maximum concurrent API calls is approximately `MLFLOW_GENAI_EVAL_MAX_WORKERS × min(MLFLOW_GENAI_EVAL_MAX_SCORER_WORKERS, num_scorers)`. Adjust these values based on your LLM provider's rate limits, especially when using free tiers.

## Can I use async functions as predict_fn?

Yes! MLflow automatically detects and wraps async functions. The async function will be executed with a timeout to prevent indefinite hangs.

Configure the timeout (in seconds) using the `MLFLOW_GENAI_EVAL_ASYNC_TIMEOUT` environment variable (default: `300` seconds):

```bash
export MLFLOW_GENAI_EVAL_ASYNC_TIMEOUT=600  # 10 minutes
```

**For Jupyter Notebooks:** Install `nest_asyncio` to use async functions in notebook environments:

```bash
pip install nest_asyncio
```

Example with an async predict function:

```python
import asyncio
from openai import AsyncOpenAI

client = AsyncOpenAI()


async def async_predict_fn(question: str) -> str:
    """Async prediction function using OpenAI"""
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": question}],
    )
    return response.choices[0].message.content


mlflow.genai.evaluate(
    data=eval_dataset,
    predict_fn=async_predict_fn,  # Async function automatically supported
    scorers=[Correctness()],
)
```

## Why does MLflow make N+1 predictions during evaluation?

MLflow requires the predict function passed through the `predict_fn` parameter to emit a single trace per call. To ensure the function produces a trace, MLflow first runs one additional prediction on a single input.

If you are confident the predict function already generates traces, skip this validation by setting the `MLFLOW_GENAI_EVAL_SKIP_TRACE_VALIDATION` environment variable to `true`.

```bash
export MLFLOW_GENAI_EVAL_SKIP_TRACE_VALIDATION=true
```

## How do I change the name of the evaluation run?

By default, `mlflow.genai.evaluate` generates a random run name. Set a custom name by wrapping the call with `mlflow.start_run`.

```python
with mlflow.start_run(run_name="My Evaluation Run") as run:
    mlflow.genai.evaluate(...)
```

## How do I use Databricks Model Serving endpoints as the predict function?

MLflow provides <APILink fn="mlflow.genai.to_predict_fn" />, which wraps a Databricks Model Serving endpoint so it behaves like a predict function compatible with GenAI evaluation.

The wrapper:

- Translates each input sample into the request payload expected by the endpoint.
- Injects `{"databricks_options": {"return_trace": True}}` so the endpoint returns a model-generated trace.
- Copies the trace into the current experiment so it appears in the MLflow UI.

```python
import mlflow
from mlflow.genai.scorers import Correctness

mlflow.genai.evaluate(
    # The {"messages": ...} part must be compatible with the request schema of the endpoint
    data=[{"inputs": {"messages": [{"role": "user", "content": "What is MLflow?"}]}}],
    # Your Databricks Model Serving endpoint URI
    predict_fn=mlflow.genai.to_predict_fn("endpoints:/chat"),
    scorers=[Correctness()],
)
```

## How to migrate from MLflow 2 LLM Evaluation?

See the [Migrating from MLflow 2 LLM Evaluation](/genai/eval-monitor/legacy-llm-evaluation) guide.

## How do I track the cost of LLM judges?

MLflow visualizes the cost of LLM judges in the assessment pane of the trace details page.
When you open an assessment logged by an LLM judge, you can see the cost incurred for running the judge model.
This feature is available only when you have the [LiteLLM](https://github.com/BerriAI/litellm) library installed.

<ImageBox src="/images/mlflow-3/eval-monitor/tracking-judge-cost.png" alt="LLM Judge Cost" width="90%" />

Managing the balance between cost and accuracy is important.
To use a more cost-effective LLM model while maintaining accuracy, you can leverage the [LLM Judge Alignment](/genai/eval-monitor/scorers/llm-judge/alignment) feature.

## How do I pass additional inference parameters to judge LLMs?

LLM-as-a-Judge scorers like `Correctness` and `Guidelines` accept an `inference_params` argument to customize the judge model's behavior. This allows you to control parameters such as `temperature`, `max_tokens`, and other model-specific settings.

```python
from mlflow.genai.scorers import Correctness, Guidelines

# Pass inference parameters to control judge behavior
correctness_scorer = Correctness(
    inference_params={
        "temperature": 0.0,  # More deterministic responses
        "max_tokens": 500,
    }
)

guidelines_scorer = Guidelines(
    name="tone_check",
    guidelines="The response should be professional and helpful.",
    inference_params={
        "temperature": 0.0,
    },
)

mlflow.genai.evaluate(
    data=eval_dataset,
    predict_fn=my_predict_fn,
    scorers=[correctness_scorer, guidelines_scorer],
)
```

The available inference parameters depend on the model provider being used. Common parameters include:

- `temperature`: Controls randomness (0.0 = deterministic, higher = more random)
- `max_tokens`: Maximum tokens in the response
- `top_p`: Nucleus sampling parameter

## How do I debug my scorers?

To debug your scorers, you can enable tracing for the scorer functions by setting the `MLFLOW_GENAI_EVAL_ENABLE_SCORER_TRACING` environment variable to `true`.

```bash
export MLFLOW_GENAI_EVAL_ENABLE_SCORER_TRACING=true
```

When this is set to `true`, MLflow will trace scorer executions during the evaluation and allow
you to inspect the input, output, and internal steps during the scorer execution.

To view the scorer trace, you can open the assessment pane of the trace details page and click the
"View trace" link.
```

--------------------------------------------------------------------------------

````
