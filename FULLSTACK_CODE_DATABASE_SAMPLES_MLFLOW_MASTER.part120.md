---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 120
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 120 of 991)

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
Location: mlflow-master/docs/docs/genai/mcp/index.mdx

```text
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# MLflow MCP Server

:::info

- This feature is experimental and may change in future releases.
- MLflow 3.5.1 or newer is required.

:::

The MLflow Model Context Protocol (MCP) server enables AI applications and coding assistants to interact with MLflow traces programmatically. MCP is an open protocol that provides a standardized way for AI tools like Claude, VS Code extensions, and other language models to access external data sources and tools.

The MLflow MCP server exposes all MLflow trace management operations through the MCP protocol, allowing AI assistants to:

- Search and retrieve trace data
- Analyze trace performance and behavior
- Log feedback and assessments
- Manage trace tags and metadata
- Delete traces and assessments

This integration makes it easy to incorporate MLflow tracing capabilities into AI-powered development workflows, enabling more intelligent analysis and management of your GenAI applications.

## Prerequisites

- MLflow version 3.5.1 or newer
- An MCP-compatible client (VS Code, Cursor, Claude, etc.)

## Installation

To use the MLflow MCP server, install MLflow with the `mcp` extra:

```bash
pip install 'mlflow[mcp]>=3.5.1'
```

## Set up

Configure the MLflow MCP server in your MCP client by adding the server configuration to your client's settings file:

<Tabs>
  <TabItem label="VS Code" value="vscode">

Add to your VS Code configuration file (`.vscode/mcp.json`):

```json
{
  "servers": {
    "mlflow-mcp": {
      "command": "uv",
      "args": ["run", "--with", "mlflow[mcp]>=3.5.1", "mlflow", "mcp", "run"],
      "env": {
        "MLFLOW_TRACKING_URI": "<MLFLOW_TRACKING_URI>"
      }
    }
  }
}
```

  </TabItem>
  <TabItem label="Cursor" value="cursor">

Add to your Cursor configuration file (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "mlflow-mcp": {
      "command": "uv",
      "args": ["run", "--with", "mlflow[mcp]>=3.5.1", "mlflow", "mcp", "run"],
      "env": {
        "MLFLOW_TRACKING_URI": "<MLFLOW_TRACKING_URI>"
      }
    }
  }
}
```

  </TabItem>
  <TabItem label="Claude" value="claude">

Add to your Claude `.claude/settings.json`:

```json
{
  "mcpServers": {
    "mlflow-mcp": {
      "command": "uv",
      "args": ["run", "--with", "mlflow[mcp]>=3.5.1", "mlflow", "mcp", "run"],
      "env": {
        "MLFLOW_TRACKING_URI": "<MLFLOW_TRACKING_URI>"
      }
    }
  }
}
```

  </TabItem>
</Tabs>

Replace `<MLFLOW_TRACKING_URI>` with your MLflow tracking server URL:

- **Local server**: `http://localhost:5000`
- **Remote server**: `https://your-mlflow-server.com`
- **Databricks**: Set the tracking URI to `databricks` and configure authentication using environment variables such as `DATABRICKS_HOST` and `DATABRICKS_TOKEN`. For detailed setup instructions, refer to the [Databricks authentication guide](https://docs.databricks.com/aws/en/dev-tools/auth/).

## Available Tools

The MLflow MCP server provides comprehensive trace management capabilities:

| Tool                | Description                             | Key Parameters                                                    |
| ------------------- | --------------------------------------- | ----------------------------------------------------------------- |
| `search_traces`     | Search and filter traces in experiments | `experiment_id`, `filter_string`, `max_results`, `extract_fields` |
| `get_trace`         | Get detailed trace information          | `trace_id`, `extract_fields`                                      |
| `delete_traces`     | Delete traces by ID or timestamp        | `experiment_id`, `trace_ids`, `max_timestamp_millis`              |
| `set_trace_tag`     | Add custom tags to traces               | `trace_id`, `key`, `value`                                        |
| `delete_trace_tag`  | Remove tags from traces                 | `trace_id`, `key`                                                 |
| `log_feedback`      | Log evaluation scores or judgments      | `trace_id`, `name`, `value`, `source_type`, `rationale`           |
| `log_expectation`   | Log ground truth labels                 | `trace_id`, `name`, `value`, `source_type`                        |
| `get_assessment`    | Retrieve assessment details             | `trace_id`, `assessment_id`                                       |
| `update_assessment` | Modify existing assessments             | `trace_id`, `assessment_id`, `value`, `rationale`                 |
| `delete_assessment` | Remove assessments                      | `trace_id`, `assessment_id`                                       |

## Field Selection and Filtering

The MCP server supports sophisticated field selection through the `extract_fields` parameter, available in both `search_traces` and `get_trace` tools. This parameter accepts comma-separated field paths using dot notation, allowing you to retrieve only the data you need, reducing response size and improving performance. The `extract_fields` parameter lets you:

- Select specific fields from trace data instead of retrieving everything
- Use wildcards (`*`) to select all items in arrays or objects
- Combine multiple field paths in a single request
- Use backticks for field names containing dots

Example usage with tools:

```python
# With search_traces
search_traces(
    experiment_id="1",
    extract_fields="info.trace_id,info.state,data.spans.*.name",
)

# With get_trace
get_trace(
    trace_id="tr-abc123",
    extract_fields="info.assessments.*,info.tags.*",
)
```

### Common Field Patterns

**Trace Information:**

- `info.trace_id`: Unique trace identifier
- `info.state`: Trace status
- `info.execution_duration`: Total execution time
- `info.request_preview`: Truncated request preview
- `info.response_preview`: Truncated response preview

**Tags and Metadata:**

- `info.tags.*`: All trace tags
- `info.tags.mlflow.traceName`: Trace name
- `info.trace_metadata.*`: Custom metadata fields

**Assessments:**

- `info.assessments.*`: All assessment data
- `info.assessments.*.feedback.value`: Feedback scores
- `info.assessments.*.source.source_type`: Assessment sources

**Span Data:**

- `data.spans.*`: All span information
- `data.spans.*.name`: Span operation names
- `data.spans.*.attributes.mlflow.spanType`: Span types (AGENT, TOOL, LLM)

### Field Selection Examples

```bash
# Get basic trace info
info.trace_id,info.state,info.execution_duration

# Get all assessments
info.assessments.*

# Get feedback values only
info.assessments.*.feedback.value

# Get span names
data.spans.*.name

# Get trace name (use backticks for dots in field names)
info.tags.`mlflow.traceName`
```

## Use Cases and Examples

### Debugging Production Issues

Use the MCP server to quickly identify problematic traces:

```
User: Find all failed traces in experiment 1 from the last hour
Agent: Uses `search_traces` with `filter_string="status='ERROR' AND timestamp_ms > [recent_timestamp]"`
```

### Performance Analysis

Analyze execution patterns and bottlenecks:

```
User: Show me the slowest traces in experiment 2 with execution times over 5 seconds
Agent: Uses `search_traces` with `filter_string="execution_time_ms > 5000"` and `order_by="execution_time_ms DESC"`
```

### Quality Assessment Workflow

Log and manage trace evaluations:

```
User: Log a relevance score of 0.85 for trace tr-abc123 with rationale about accuracy
Agent: Uses `log_feedback` with appropriate parameters
```

### Data Cleanup

Remove old or test traces:

```
User: Delete traces older than 30 days from experiment 1
Agent: Uses `delete_traces` with timestamp-based filtering
```

## Environment Configuration

The MCP server respects standard MLflow environment variables:

- `MLFLOW_TRACKING_URI`: MLflow tracking server URL
- `MLFLOW_EXPERIMENT_ID`: Default experiment ID
- Authentication variables for cloud providers (AWS, Azure, GCP)

For Databricks environments, ensure you have appropriate authentication configured (personal access tokens, service principals, etc.).

## Related Documentation

- [MLflow Tracing Overview](/genai/tracing/quickstart)
- [Collecting User Feedback](/genai/assessments/feedback)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
```

--------------------------------------------------------------------------------

---[FILE: create-and-edit-prompts.mdx]---
Location: mlflow-master/docs/docs/genai/prompt-registry/create-and-edit-prompts.mdx

```text
---
title: Create and Edit Prompts
description: Learn how to create new prompts and edit existing ones in the MLflow Prompt Registry using both the UI and Python APIs.
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import { APILink } from "@site/src/components/APILink";
import TabsWrapper from "@site/src/components/TabsWrapper";

# Create and Edit Prompts

This guide walks you through the process of creating new prompts and managing their versions within the MLflow Prompt Registry.

## Creating a New Prompt

You can initiate a new prompt in the MLflow Prompt Registry in two primary ways: through the MLflow UI or programmatically using the Python SDK.

<TabsWrapper>
<Tabs>
  <TabItem value="ui" label="UI" default>
    <div class="flex-column">
      1. Navigate to the Prompt Registry section in your MLflow instance.
      2. Click on the "Create Prompt" (or similar) button.
      3. Fill in the prompt details such as name, prompt template text, and commit message (optional)

      ![Registered Prompt in UI](/images/llms/prompt-registry/registered-prompt.png)
    </div>

  </TabItem>
  <TabItem value="python" label="Python">
    <div class="flex-column">
      To create a new prompt programmatically, use the <APILink fn="mlflow.genai.register_prompt" /> function. This is particularly useful for automating prompt creation or managing prompts as part of a larger script.

      ```python
      import mlflow

      # Use double curly braces for variables in the template
      initial_template = """\
      Summarize content you are provided with in {{ num_sentences }} sentences.

      Sentences: {{ sentences }}
      """

      # Chat Style template
      initial_template = [
          {
              "role": "system",
              "content": "Summarize content you are provided with in {{ num_sentences }} sentences.",
          },
          {"role": "user", "content": "Sentences: {{ sentences }}"},
      ]

      # Optional Response Format
      from pydantic import BaseModel, Field


      class ResponseFormat(BaseModel):
          summary: str = Field(..., description="Summary of the content")


      # Register a new prompt
      prompt = mlflow.genai.register_prompt(
          name="summarization-prompt",
          template=initial_template,
          # Optional: Provide Response Format to get structured output
          response_format=ResponseFormat,
          # Optional: Provide a commit message to describe the changes
          commit_message="Initial commit",
          # Optional: Set tags applies to the prompt (across versions)
          tags={
              "author": "author@example.com",
              "task": "summarization",
              "language": "en",
          },
      )

      # The prompt object contains information about the registered prompt
      print(f"Created prompt '{prompt.name}' (version {prompt.version})")
      ```
    </div>

  </TabItem>
</Tabs>
</TabsWrapper>

## Editing an Existing Prompt (Creating New Versions)

Once a prompt version is created, its template and initial metadata are **immutable**. Editing an existing prompt means creating a _new version_ of that prompt with your changes. This Git-like behavior ensures a complete history and allows you to revert to previous versions if needed.

<TabsWrapper>
<Tabs>
  <TabItem value="ui" label="UI" default>
    <div class="flex-column">
      1. Navigate to the specific prompt you wish to edit in the Prompt Registry.
      2. Select the version you want to base your new version on (often the latest).
      3. Look for an "Edit Prompt" or "Create New Version" button.
      4. Modify the template, update metadata, or change tags as needed.
      5. Provide a new **Commit Message** describing the changes you made for this new version.

      ![Update Prompt UI](/images/llms/prompt-registry/update-prompt-ui.png)
    </div>

  </TabItem>
  <TabItem value="python" label="Python">
    <div class="flex-column">
      To create a new version of an existing prompt, you again use the <APILink fn="mlflow.genai.register_prompt" /> function, but this time, you provide the `name` of an existing prompt. MLflow will automatically increment the version number.

      ```python
      import mlflow

      new_template = """\
      You are an expert summarizer. Condense the following content into exactly {{ num_sentences }} clear and informative sentences that capture the key points.

      Sentences: {{ sentences }}

      Your summary should:
      - Contain exactly {{ num_sentences }} sentences
      - Include only the most important information
      - Be written in a neutral, objective tone
      - Maintain the same level of formality as the original text
      """

      # Register a new version of an existing prompt
      updated_prompt = mlflow.genai.register_prompt(
          name="summarization-prompt",  # Specify the existing prompt name
          template=new_template,
          commit_message="Improvement",
          tags={
              "author": "author@example.com",
          },
      )
      ```
    </div>

  </TabItem>
</Tabs>
</TabsWrapper>

## Understanding Immutability

It's crucial to remember that prompt versions in the MLflow Prompt Registry are immutable. Once `mlflow.genai.register_prompt()` is called and a version is created (or a new version of an existing prompt is made), the template, initial commit message, and initial metadata for _that specific version_ cannot be altered. This design choice provides strong guarantees for reproducibility and lineage tracking.

If you need to change a prompt, you always create a new version.

## Comparing Prompt Versions

The MLflow UI provides tools to compare different versions of a prompt. This typically includes a side-by-side diff view, allowing you to easily see what changed in the template text, metadata, or tags between versions.

![Compare Prompt Versions](/images/llms/prompt-registry/compare-prompt-versions.png)
```

--------------------------------------------------------------------------------

---[FILE: evaluate-prompts.mdx]---
Location: mlflow-master/docs/docs/genai/prompt-registry/evaluate-prompts.mdx

```text
import { APILink } from "@site/src/components/APILink";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Evaluating Prompts

Combining [MLflow Prompt Registry](/genai/prompt-registry) with [MLflow LLM Evaluation](/genai/eval-monitor) enables you to evaluate prompt performance across different models and datasets, and track the evaluation results in a centralized registry. You can also inspect model outputs from the **traces** logged during evaluation to understand how the model responds to different prompts.

:::tip Key Benefits of MLflow Prompt Evaluation

- **Effective Evaluation**: `MLflow's LLM Evaluation API provides a simple and consistent way to evaluate prompts across different models and datasets without writing boilerplate code.
- **Compare Results**: Compare evaluation results with ease in the MLflow UI.
- **Tracking Results**: Track evaluation results in MLflow Experiment to maintain the history of prompt performance and different evaluation settings.
- **Tracing**: Inspect model behavior during inference deeply with traces generated during evaluation.

:::

## Quickstart

### 1. Install Required Libraries

First install MLflow and OpenAI SDK. If you use different LLM providers, install the corresponding SDK instead.

```bash
pip install mlflow>=2.21.0 openai -qU
```

Also set OpenAI API key (or any other LLM providers e.g. Anthropic).

```python
import os
from getpass import getpass

os.environ["OPENAI_API_KEY"] = getpass("Enter your OpenAI API key: ")
```

### 1. Create a Prompt

<Tabs>
  <TabItem value="ui" label="UI" default>
    <div class="flex-column">
      <div style={{ width: "70%", margin: "20px" }}>
        ![Create Prompt UI](/images/llms/prompt-registry/create-prompt-ui.png)
      </div>

      1. Run `mlflow server` in your terminal to start the MLflow UI.
      2. Navigate to the **Prompts** tab in the MLflow UI.
      3. Click on the **Create Prompt** button.
      4. Fill in the prompt details such as name, prompt template text, and commit message (optional).
      5. Click **Create** to register the prompt.

    </div>

  </TabItem>
  <TabItem value="python" label="Python" default>
    <div class="flex-column">
      To create a new prompt using the Python API, use <APILink fn="mlflow.register_prompt" /> API:

      ```python
      import mlflow

      # Use double curly braces for variables in the template
      initial_template = """\
      Summarize content you are provided with in {{ num_sentences }} sentences.

      Sentences: {{ sentences }}
      """

      # Register a new prompt
      prompt = mlflow.genai.register_prompt(
          name="summarization-prompt",
          template=initial_template,
          # Optional: Provide a commit message to describe the changes
          commit_message="Initial commit",
      )

      # The prompt object contains information about the registered prompt
      print(f"Created prompt '{prompt.name}' (version {prompt.version})")
      ```
    </div>

  </TabItem>
</Tabs>

### 2. Prepare Evaluation Data

Below, we create a small summarization dataset for demonstration purposes.

```python
import pandas as pd

eval_data = [
    {
        "inputs": {
            "sentences": "Artificial intelligence has transformed how businesses operate in the 21st century. Companies are leveraging AI for everything from customer service to supply chain optimization. The technology enables automation of routine tasks, freeing human workers for more creative endeavors. However, concerns about job displacement and ethical implications remain significant. Many experts argue that AI will ultimately create more jobs than it eliminates, though the transition may be challenging.",
        },
        "expectations": {
            "summary": "AI has revolutionized business operations through automation and optimization, though ethical concerns about job displacement persist alongside predictions that AI will ultimately create more employment opportunities than it eliminates.",
        },
    },
    {
        "inputs": {
            "sentences": "Climate change continues to affect ecosystems worldwide at an alarming rate. Rising global temperatures have led to more frequent extreme weather events including hurricanes, floods, and wildfires. Polar ice caps are melting faster than predicted, contributing to sea level rise that threatens coastal communities. Scientists warn that without immediate and dramatic reductions in greenhouse gas emissions, many of these changes may become irreversible. International cooperation remains essential but politically challenging.",
        },
        "expectations": {
            "summary": "Climate change is causing accelerating environmental damage through extreme weather events and melting ice caps, with scientists warning that without immediate reduction in greenhouse gas emissions, many changes may become irreversible.",
        },
    },
    {
        "inputs": {
            "sentences": "The human genome project was completed in 2003 after 13 years of international collaborative research. It successfully mapped all of the genes of the human genome, approximately 20,000-25,000 genes in total. The project cost nearly $3 billion but has enabled countless medical advances and spawned new fields like pharmacogenomics. The knowledge gained has dramatically improved our understanding of genetic diseases and opened pathways to personalized medicine. Today, a complete human genome can be sequenced in under a day for about $1,000.",
        },
        "expectations": {
            "summary": "The Human Genome Project, completed in 2003, mapped approximately 20,000-25,000 human genes at a cost of $3 billion, enabling medical advances, improving understanding of genetic diseases, and establishing the foundation for personalized medicine.",
        },
    },
    {
        "inputs": {
            "sentences": "Remote work adoption accelerated dramatically during the COVID-19 pandemic. Organizations that had previously resisted flexible work arrangements were forced to implement digital collaboration tools and virtual workflows. Many companies reported surprising productivity gains, though concerns about company culture and collaboration persisted. After the pandemic, a hybrid model emerged as the preferred approach for many businesses, combining in-office and remote work. This shift has profound implications for urban planning, commercial real estate, and work-life balance.",
        },
        "expectations": {
            "summary": "The COVID-19 pandemic forced widespread adoption of remote work, revealing unexpected productivity benefits despite collaboration challenges, and resulting in a hybrid work model that impacts urban planning, real estate, and work-life balance.",
        },
    },
]
```

### 3. Define Prediction Function

Define a function that takes a DataFrame of inputs and returns a list of predictions.

MLflow will pass the input columns (`inputs` only in this example) to the function. The output string will be compared with the `targets` column to evaluate the model.

```python
import mlflow
import openai


def predict_fn(sentences: str) -> str:
    # Load the latest version of the registered prompt
    prompt = mlflow.genai.load_prompt("prompts:/summarization-prompt@latest")
    completion = openai.OpenAI().chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": prompt.format(sentences=sentences, num_sentences=1),
            }
        ],
    )
    return completion.choices[0].message.content
```

### 4. Run Evaluation

Run the <APILink fn="mlflow.genai.evaluate" /> API to evaluate the model with the prepared data and prompt. In this example, we will use the following two built-in metrics.

```python
from typing import Literal
from mlflow.genai.judges import make_judge

answer_similarity = make_judge(
    name="answer_similarity",
    instructions=(
        "Evaluated on the degree of semantic similarity of the provided output to the expected answer.\n\n"
        "Output: {{ outputs }}\n\n"
        "Expected: {{ expectations }}"
        "Return 'yes' if the output is similar to the expected answer, otherwise return 'no'."
    ),
    model="openai:/gpt-5-mini",
    feedback_value_type=Literal["yes", "no"],
)

results = mlflow.genai.evaluate(
    data=eval_data,
    predict_fn=predict_fn,
    scorers=[answer_similarity],
)
```

### 5. View Results

You can view the evaluation results in the MLflow UI. Navigate to the **Experiments** tab, select the **Evaluations** tab, and click on the evaluation run to view the evaluation result.

![Evaluation Results](/images/llms/prompt-registry/prompt-evaluation-result.png)
```

--------------------------------------------------------------------------------

````
