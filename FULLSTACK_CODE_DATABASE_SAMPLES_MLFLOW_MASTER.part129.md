---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 129
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 129 of 991)

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

---[FILE: search-traces.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/search-traces.mdx

```text
import { APILink } from "@site/src/components/APILink";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Search Traces

This guide will walk you through how to search for traces in MLflow using both the MLflow UI and Python API. This resource will be valuable if you're interested in querying specific traces based on their metadata, tags, execution time, status, or other trace attributes.

MLflow's trace search functionality allows you to leverage SQL-like syntax to filter your traces based on a variety of conditions. While the `OR` keyword is not supported, the search functionality is powerful enough to handle complex queries for trace discovery and analysis.

:::important
**Local File Store offers only limited search capabilities and can become slow as data volume grows.** As of MLflow 3.6.0, the FileStore is deprecated. We recommend migrating to a SQL-backed store or Databricks for improved performance and more robust search functionality.
:::

## Search Traces Overview

When working with MLflow tracing in production environments, you'll often have thousands of traces across different experiments representing various model inferences, LLM calls, or ML pipeline executions. The `search_traces` API helps you find specific traces based on their execution characteristics, metadata, tags, and other attributes - making trace analysis and debugging much more efficient.

## Filtering Traces in the UI

The UI search supports all the same filter syntax as the API, allowing you to search by:

- Trace inputs
- Trace attributes: trace name, status, end time, execution time, run_id
- Trace tags and metadata
- Trace assessments: feedback or expectations

Use the filters dropdown in the MLflow Trace UI to filter traces by various criteria:

<div class="center-div" style={{ width: "100%" }}>
  ![search components](/images/tracing_search_traces.png)
</div>

For example, searching for traces that with ERROR state:

![Search Traces UI](/images/llms/tracing/search-traces-on-ui.png)

Search for trace inputs:

![Search Traces Inputs UI](/images/llms/tracing/search-traces-inputs-on-ui.png)

Search for trace assessments by key and value:

![Search Traces By Assessments UI](/images/llms/tracing/search-traces-assessments-on-ui.png)

## Search Query Syntax

The `search_traces` API uses a SQL-like Domain Specific Language (DSL) for querying traces.

### Visual Representation of Search Components:

<div class="center-div" style={{ width: "30%" }}>
  ![search components](/images/search-runs/search_syntax.png)
</div>

### Supported Filters and Comparators

| Field Type           | Fields                                                               | Operators                           | Examples                           |
| -------------------- | -------------------------------------------------------------------- | ----------------------------------- | ---------------------------------- |
| **Trace Status**     | `trace.status`                                                       | `=`, `!=`                           | trace.status = "OK"                |
| **Trace Timestamps** | `trace.timestamp_ms`, `trace.execution_time_ms`, `trace.end_time_ms` | `=`, `!=`, `>`, `<`, `>=`, `<=`     | trace.end_time_ms > 1762408895531  |
| **Trace IDs**        | `trace.run_id`                                                       | `=`                                 | trace.run_id = "run_id"            |
| **String Fields**    | `trace.client_request_id`, `trace.name`                              | `=`, `!=`, `LIKE`, `ILIKE`, `RLIKE` | trace.name LIKE "%Generate%"       |
| **Linked Prompts**   | `prompt`                                                             | `=` (format: `"name/version"`)      | prompt = "qa-system-prompt/4"      |
| **Span Name/Type**   | `span.name`, `span.type`                                             | `=`, `!=`, `LIKE`, `ILIKE`, `RLIKE` | span.type RLIKE "^LLM"             |
| **Span Attributes**  | `span.attributes.<key>`                                              | `LIKE`, `ILIKE`                     | span.attributes.model RLIKE "^gpt" |
| **Tags**             | `tag.<key>`                                                          | `=`, `!=`, `LIKE`, `ILIKE`, `RLIKE` | tag.key = "value"                  |
| **Metadata**         | `metadata.<key>`                                                     | `=`, `!=`, `LIKE`, `ILIKE`, `RLIKE` | metadata.user_id LIKE "user%"      |
| **Feedback**         | `feedback.<name>`                                                    | `=`, `!=`, `LIKE`, `ILIKE`, `RLIKE` | feedback.rating = "excellent"      |
| **Expectations**     | `expectation.<name>`                                                 | `=`, `!=`, `LIKE`, `ILIKE`, `RLIKE` | expectation.result = "pass"        |
| **Full Text**        | `trace.text`                                                         | `LIKE` (with `%` wildcards)         | trace.text LIKE "%tell me a story" |

**Value Syntax:**

- String values must be quoted: `status = 'OK'`
- Numeric values don't need quotes: `execution_time_ms > 1000`
- Tag and metadata values must be quoted as strings
- Full text search must use `LIKE` with `%` wildcards

**Pattern Matching Operators:**

- `LIKE`: Case-sensitive pattern matching (use `%` for wildcards)
- `ILIKE`: Case-insensitive pattern matching (use `%` for wildcards)
- `RLIKE`: Regular expression matching

### Example Queries

#### Full Text Search

Search for any contents existing in your trace.

```python
# Search for traces containing specific text
mlflow.search_traces(filter_string="trace.text LIKE '%authentication error%'")

# Search for multiple terms
mlflow.search_traces(filter_string="trace.text LIKE '%timeout%'")
```

#### Filter by Name

```python
# Exact match
mlflow.search_traces(filter_string="trace.name = 'predict'")

# Pattern matching with LIKE
mlflow.search_traces(filter_string="trace.name LIKE '%inference%'")

# Case-insensitive pattern matching with ILIKE
mlflow.search_traces(filter_string="trace.name ILIKE '%PREDICT%'")

# Regular expression matching with RLIKE
mlflow.search_traces(filter_string="trace.name RLIKE '^(predict|inference)_[0-9]+'")
```

#### Filter by Status

```python
# Get successful traces
mlflow.search_traces(filter_string="trace.status = 'OK'")

# Get failed traces
mlflow.search_traces(filter_string="trace.status = 'ERROR'")

# Get in-progress traces
mlflow.search_traces(filter_string="trace.status != 'OK'")
```

#### Filter by Execution Time

```python
# Find slow traces (> 1 second)
mlflow.search_traces(filter_string="trace.execution_time_ms > 1000")

# Performance range
mlflow.search_traces(
    filter_string="trace.execution_time_ms >= 200 AND trace.execution_time_ms <= 800"
)

# Equal to specific duration
mlflow.search_traces(filter_string="trace.execution_time_ms = 500")
```

#### Filter by Timestamp

```python
import time

# Get traces from last hour
timestamp = int(time.time() * 1000)
mlflow.search_traces(filter_string=f"trace.timestamp_ms > {timestamp - 3600000}")

# Exact timestamp match
mlflow.search_traces(filter_string=f"trace.timestamp_ms = {timestamp}")

# Timestamp range
mlflow.search_traces(
    filter_string=f"trace.timestamp_ms >= {timestamp - 7200000} AND trace.timestamp_ms <= {timestamp - 3600000}"
)
```

#### Filter by Tags

```python
# Exact match
mlflow.search_traces(filter_string="tag.model_name = 'gpt-4'")

# Pattern matching with LIKE (case-sensitive)
mlflow.search_traces(filter_string="tag.model_name LIKE 'gpt-%'")

# Case-insensitive pattern matching with ILIKE
mlflow.search_traces(filter_string="tag.environment ILIKE '%prod%'")

# Regular expression matching with RLIKE
mlflow.search_traces(filter_string="tag.version RLIKE '^v[0-9]+\\.[0-9]+'")
```

#### Filter by Run Association

```python
# Find traces associated with a specific run
mlflow.search_traces(filter_string="trace.run_id = 'run_id_123456'")
```

#### Filter by Linked Prompts

```python
# Find traces using a specific prompt version
mlflow.search_traces(filter_string='prompt = "qa-agent-system-prompt/4"')
```

:::note
The `prompt` filter only supports exact match (`=`) operator with the format `"name/version"`.
:::

#### Filter by Span Attributes

```python
# Filter by span name
mlflow.search_traces(filter_string="span.name = 'llm_call'")

# Pattern matching on span name
mlflow.search_traces(filter_string="span.name LIKE '%embedding%'")

# Filter by span type
mlflow.search_traces(filter_string="span.type = 'LLM'")

# Filter by custom span attributes (requires wildcards with LIKE/ILIKE)
mlflow.search_traces(filter_string="span.attributes.model_version LIKE '%v2%'")
mlflow.search_traces(filter_string="span.attributes.temperature LIKE '%0.7%'")
mlflow.search_traces(filter_string="span.attributes.model_version ILIKE '%V2%'")
```

#### Filter by Feedback

```python
# Filter by feedback ratings
mlflow.search_traces(filter_string="feedback.rating = 'positive'")

# Pattern matching on feedback
mlflow.search_traces(filter_string="feedback.user_comment LIKE '%helpful%'")
```

#### Filter by Expectations

```python
# Filter by expectation values
mlflow.search_traces(filter_string="expectation.accuracy = 'high'")

# Pattern matching on expectations
mlflow.search_traces(filter_string="expectation.label ILIKE '%success%'")
```

#### Filter by End Time

```python
import time

# Get traces that completed in the last hour
end_time = int(time.time() * 1000)
mlflow.search_traces(filter_string=f"trace.end_time_ms > {end_time - 3600000}")

# Find traces that ended within a specific time range
mlflow.search_traces(
    filter_string=f"trace.end_time_ms >= {end_time - 7200000} AND trace.end_time_ms <= {end_time - 3600000}"
)
```

#### Combine Multiple Conditions

```python
# Complex query with tags and status
mlflow.search_traces(filter_string="trace.status = 'OK' AND tag.importance = 'high'")

# Production error analysis with execution time
mlflow.search_traces(
    filter_string="""
        tag.environment = 'production'
        AND trace.status = 'ERROR'
        AND trace.execution_time_ms > 500
    """
)

# Advanced query with span attributes and feedback
mlflow.search_traces(
    filter_string="""
        span.name LIKE '%llm%'
        AND feedback.rating = 'positive'
        AND trace.execution_time_ms < 1000
    """
)

# Search with pattern matching and time range
mlflow.search_traces(
    filter_string="""
        trace.name ILIKE '%inference%'
        AND trace.timestamp_ms > 1700000000000
        AND span.attributes.model_version LIKE '%v2%'
    """
)
```

## Programmatic Search with Python

<APILink fn="mlflow.search_traces" /> provides convenient trace search functionality:

```python
import mlflow

# Basic search with default DataFrame output
traces_df = mlflow.search_traces(filter_string="trace.status = 'OK'")

# Return as list of Trace objects
traces_list = mlflow.search_traces(
    filter_string="trace.status = 'OK'", return_type="list"
)
```

:::note
The `return_type` parameter is available in MLflow 2.21.1+. For older versions, use <APILink fn="mlflow.client.MlflowClient.search_traces" /> for list output.
:::

### Return Format

#### 1. DataFrame

The `search_traces` API returns a pandas DataFrame by default with the following columns:

<Tabs>
<TabItem value="mlflow-3" label="MLflow 3.x">
- `trace_id` - Primary identifier
- `trace` - Trace object
- `client_request_id` - Client request ID
- `state` - Trace state (OK, ERROR, IN_PROGRESS, STATE_UNSPECIFIED)
- `request_time` - Start time in milliseconds
- `execution_duration` - Duration in milliseconds
- `inputs` - Input to traced logic
- `outputs` - Output of traced logic
- `expectations` - A dictionary of ground truth labels annotated on the trace
- `trace_metadata` - Key-value metadata
- `tags` - Associated tags
- `assessments` - List of assessment objects attached on the trace

</TabItem>
<TabItem value="mlflow-2" label="MLflow 2.x">
- `request_id` - Primary identifier
- `trace` - Trace object
- `timestamp_ms` - Start time in milliseconds
- `status` - Trace status
- `execution_time_ms` - Duration in milliseconds
- `request` - Input to traced logic
- `response` - Output of traced logic
- `request_metadata` - Key-value metadata
- `spans` - Spans in trace
- `tags` - Associated tags
</TabItem>
</Tabs>

#### 2. List of Trace Objects

Alternatively, you can specify `return_type="list"` to get a list of <APILink fn="mlflow.entities.Trace" /> objects instead of a DataFrame.

```python
traces = mlflow.search_traces(filter_string="trace.status = 'OK'", return_type="list")
# list[mlflow.entities.Trace]
```

### Ordering Results

MLflow supports ordering results by the following keys:

- `timestamp_ms` (default: DESC) - Trace start time
- `execution_time_ms` - Trace duration
- `status` - Trace execution status
- `request_id` - Trace identifier

```python
# Order by timestamp (most recent first)
traces = mlflow.search_traces(order_by=["timestamp_ms DESC"])

# Multiple ordering criteria
traces = mlflow.search_traces(order_by=["timestamp_ms DESC", "status ASC"])
```

### Pagination

<APILink fn="mlflow.client.MlflowClient.search_traces" /> supports pagination:

```python
from mlflow import MlflowClient

client = MlflowClient()
page_token = None
all_traces = []

while True:
    results = client.search_traces(
        experiment_ids=["1"],
        filter_string="status = 'OK'",
        max_results=100,
        page_token=page_token,
    )

    all_traces.extend(results)

    if not results.token:
        break
    page_token = results.token

print(f"Found {len(all_traces)} total traces")
```

## Important Notes

### MLflow Version Compatibility

:::note Schema Changes in MLflow 3
**DataFrame Schema**: The format depends on the MLflow version used to **call** the `search_traces` API, not the version used to log the traces. MLflow 3.x uses different column names than 2.x.
:::

### Performance Tips

1. **Use timestamp filters** to limit search space
2. **Limit max_results** for faster queries when ordering
3. **Use pagination** for large result sets

### Backend Considerations

- **SQL Store Backend**: Supports the full search syntax documented above, including:
  - All trace, span, metadata, tag, feedback, and expectation filters
  - Pattern matching operators (LIKE, ILIKE, RLIKE)
  - Full text search with `trace.text`
  - Optimized performance with proper indexing on timestamp
- **Local File Store**: Limited search capabilities. May be slower with large datasets. Not recommended, only suitable for storing small number of traces.
```

--------------------------------------------------------------------------------

---[FILE: automatic.mdx]---
Location: mlflow-master/docs/docs/genai/tracing/app-instrumentation/automatic.mdx

```text
import { APILink } from "@site/src/components/APILink";
import TracingIntegrations from "@site/src/components/TracingIntegrations";
import useBaseUrl from '@docusaurus/useBaseUrl';

# Automatic Tracing

MLflow Tracing is integrated with various GenAI libraries and provides **one-line automatic tracing** experience for each library (and the combination of them!). This page shows detailed examples to integrate MLflow with popular GenAI libraries.

<video src={useBaseUrl("/images/llms/tracing/tracing-top.mp4")} controls loop autoPlay muted aria-label="MLflow Tracing" />

## Supported Integrations

Each integration automatically captures your application's logic and intermediate steps based on your implementation of the authoring framework / SDK. Click on the logo of your library to see the detailed integration guide.

<TracingIntegrations cardGroupProps={{ isSmall: true }} />
<br />

:::info Missing your favorite library?
Is your favorite library missing from the list? Consider <ins>[contributing to MLflow Tracing](/genai/tracing/integrations/contribute)</ins> or <ins>[submitting a feature request](https://github.com/mlflow/mlflow/issues/new?assignees=&labels=enhancement&projects=&template=feature_request_template.yaml&title=%5BFR%5D)</ins> to our Github repository.
:::

## Advanced Usage

### Combining Manual and Automatic Tracing

The `@mlflow.trace` decorator can be used in conjunction with auto tracing to create powerful, integrated traces. This is particularly useful for:

1. 🔄 **Complex workflows** that involve multiple LLM calls
2. 🤖 **Multi-agent systems** where different agents use different LLM providers
3. 🔗 **Chaining multiple LLM calls** together with custom logic in between

Here's a simple example that combines OpenAI auto-tracing with manually defined spans:

```python
import mlflow
import openai
from mlflow.entities import SpanType

mlflow.openai.autolog()


@mlflow.trace(span_type=SpanType.CHAIN)
def run(question):
    messages = build_messages(question)
    # MLflow automatically generates a span for OpenAI invocation
    response = openai.OpenAI().chat.completions.create(
        model="gpt-4o-mini",
        max_tokens=100,
        messages=messages,
    )
    return parse_response(response)


@mlflow.trace
def build_messages(question):
    return [
        {"role": "system", "content": "You are a helpful chatbot."},
        {"role": "user", "content": question},
    ]


@mlflow.trace
def parse_response(response):
    return response.choices[0].message.content


run("What is MLflow?")
```

Running this code generates a single trace that combines the manual spans with the automatic OpenAI tracing.

### Multi-Framework Example

You can also combine different LLM providers in a single trace. For example:

:::note
This example requires installing LangChain in addition to the base requirements:

```bash
pip install --upgrade langchain langchain-openai
```

:::

```python
import mlflow
import openai
from mlflow.entities import SpanType
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

# Enable auto-tracing for both OpenAI and LangChain
mlflow.openai.autolog()
mlflow.langchain.autolog()


@mlflow.trace(span_type=SpanType.CHAIN)
def multi_provider_workflow(query: str):
    # First, use OpenAI directly for initial processing
    analysis = openai.OpenAI().chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Analyze the query and extract key topics."},
            {"role": "user", "content": query},
        ],
    )
    topics = analysis.choices[0].message.content

    # Then use LangChain for structured processing
    llm = ChatOpenAI(model="gpt-4o-mini")
    prompt = ChatPromptTemplate.from_template(
        "Based on these topics: {topics}\nGenerate a detailed response to: {query}"
    )
    chain = prompt | llm
    response = chain.invoke({"topics": topics, "query": query})

    return response


# Run the function
result = multi_provider_workflow("Explain quantum computing")
```

## Disabling Tracing

To **disable** tracing, the <APILink fn="mlflow.tracing.disable" /> API will cease the collection of trace data from within MLflow and will not log
any data to the MLflow Tracking service regarding traces.

To **enable** tracing (if it had been temporarily disabled), the <APILink fn="mlflow.tracing.enable" /> API will re-enable tracing functionality for instrumented models
that are invoked.

## Next Steps

**[Manual Tracing](/genai/tracing/app-instrumentation/manual-tracing)**: Learn how to add custom tracing to your application logic

**[Integration Guides](/genai/tracing/integrations)**: Explore detailed guides for specific libraries and frameworks

**[Viewing Traces](/genai/tracing/observe-with-traces/ui)**: Learn how to explore and analyze your traces in the MLflow UI

**[Querying Traces](/genai/tracing/search-traces)**: Programmatically search and retrieve trace data for analysis
```

--------------------------------------------------------------------------------

````
