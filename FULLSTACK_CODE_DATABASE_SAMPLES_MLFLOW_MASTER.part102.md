---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 102
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 102 of 991)

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

---[FILE: traces.mdx]---
Location: mlflow-master/docs/docs/genai/eval-monitor/running-evaluation/traces.mdx

```text
import { APILink } from "@site/src/components/APILink";
import ImageBox from '@site/src/components/ImageBox';
import WorkflowSteps from '@site/src/components/WorkflowSteps';
import TilesGrid from '@site/src/components/TilesGrid';
import TileCard from '@site/src/components/TileCard';
import { Search, BookMarked, Target, Play, Code, Activity, Zap } from 'lucide-react';
import ServerSetup from "@site/src/content/setup_server.mdx";

# Evaluating (Production) Traces

[Traces](/genai/tracing) are the core data of MLflow. They capture the complete execution flow of your LLM applications. Evaluating traces is a powerful way to understand the performance of your LLM applications and get insights for quality improvement.

Evaluating traces is also a useful trick for offline evaluation. Instead of running prediction on every evaluation run, you can generate traces at once and re-use them for multiple evaluation runs, to reduce the computation and LLM costs.

<ImageBox src="/images/mlflow-3/eval-monitor/trace-evaluation-hero.png" alt="Evaluate traces overview" width="95%"/>

## Workflow

<WorkflowSteps
  steps={[
    {
      icon: BookMarked,
      title: "Annotate traces with ground truth (Optional)",
      description: "Add expected outputs and ground truth labels to traces to establish evaluation baselines and correct answers."
    },
    {
      icon: Search,
      title: "Search and retrieve traces",
      description: "Find and collect traces from your MLflow tracking server using filters for time range, experiment, or trace status."
    },
    {
      icon: Target,
      title: "Define scorers",
      description: "Create built-in and custom scorers to measure quality, accuracy, latency, and trace-specific metrics."
    },
    {
      icon: Play,
      title: "Run evaluation",
      description: "Execute the evaluation on your trace collection and analyze results in MLflow UI for insights."
    },
  ]}
/>

## Example: Evaluating Production Traces

### Prerequisites

First, install the required packages by running the following command:

```bash
pip install --upgrade mlflow>=3.3 openai
```

MLflow stores evaluation results in a tracking server. Connect your local environment to the tracking server by one of the following methods.

<ServerSetup />

### Step 0: Simulate Production Traces

First, let's simulate some production traces to use for evaluation. Here we define a simple email automation app that uses a CRM database to generate emails. If you already have traces, you can skip this step.

```python
import mlflow
from mlflow.entities import Document
import openai

client = openai.OpenAI()
mlflow.openai.autolog()  # Enable automatic tracing for OpenAI calls

# Simulated CRM database
CRM_DATA = {
    "Acme Corp": {
        "contact_name": "Alice Chen",
        "recent_meeting": "Product demo on Monday, very interested in enterprise features. They asked about: advanced analytics, real-time dashboards, API integrations, custom reporting, multi-user support, SSO authentication, data export capabilities, and pricing for 500+ users",
        "support_tickets": [
            "Ticket #123: API latency issue (resolved last week)",
            "Ticket #124: Feature request for bulk import",
            "Ticket #125: Question about GDPR compliance",
        ],
    },
    "TechStart": {
        "contact_name": "Bob Martinez",
        "recent_meeting": "Initial sales call last Thursday, requested pricing",
        "support_tickets": [
            "Ticket #456: Login issues (open - critical)",
            "Ticket #457: Performance degradation reported",
            "Ticket #458: Integration failing with their CRM",
        ],
    },
    "Global Retail": {
        "contact_name": "Carol Wang",
        "recent_meeting": "Quarterly review yesterday, happy with platform performance",
        "support_tickets": [],
    },
}


@mlflow.trace(span_type="RETRIEVER")
def retrieve_customer_info(customer_name: str) -> list[Document]:
    """Retrieve customer information from CRM database"""
    if data := CRM_DATA.get(customer_name):
        return [
            Document(
                id=f"{customer_name}_meeting",
                page_content=f"Recent meeting: {data['recent_meeting']}",
            ),
            Document(
                id=f"{customer_name}_tickets",
                page_content=f"Support tickets: {', '.join(data['support_tickets']) if data['support_tickets'] else 'No open tickets'}",
            ),
            Document(
                id=f"{customer_name}_contact",
                page_content=f"Contact: {data['contact_name']}",
            ),
        ]
    return []


@mlflow.trace(span_type="AGENT")
def generate_sales_email(customer_name: str, user_instructions: str) -> dict[str, str]:
    """Generate personalized sales email based on customer data & given objective."""
    # Retrieve customer information
    customer_docs = retrieve_customer_info(customer_name)
    context = "\n".join([doc.page_content for doc in customer_docs])

    # Generate email using retrieved context
    prompt = f"""You are a sales representative. Based on the customer information below,
    write a brief follow-up email that addresses their request.

    Customer Information: {context}

    User instructions: {user_instructions}"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2000,
    )
    return {"email": response.choices[0].message.content}
```

Let's run the app and generate some traces.

```python
test_requests = [
    {"customer_name": "Acme Corp", "user_instructions": "Follow up after product demo"},
    {
        "customer_name": "TechStart",
        "user_instructions": "Check on support ticket status",
    },
    {
        "customer_name": "Global Retail",
        "user_instructions": "Send quarterly review summary",
    },
    {
        "customer_name": "Acme Corp",
        "user_instructions": "Write a very detailed email explaining all our product features, pricing tiers, implementation timeline, and support options",
    },
    {
        "customer_name": "TechStart",
        "user_instructions": "Send an enthusiastic thank you for their business!",
    },
    {"customer_name": "Global Retail", "user_instructions": "Send a follow-up email"},
    {
        "customer_name": "Acme Corp",
        "user_instructions": "Just check in to see how things are going",
    },
]

# Run requests and capture traces
print("Simulating production traffic...")
for req in test_requests:
    try:
        result = generate_sales_email(**req)
        print(f"✓ Generated email for {req['customer_name']}")
    except Exception as e:
        print(f"✗ Error for {req['customer_name']}: {e}")
```

This generates a list of traces as follows:

<ImageBox src="/images/mlflow-3/eval-monitor/trace-evaluation-list.png" alt="Simulated traces" width="95%"/>

### Step 1: Search and retrieve traces

Traces stored in the MLflow backend can be retrieved using the <APILink fn="mlflow.search_traces" /> API.
The following code retrieves all traces from the last 24 hours. See [Searching for traces](/genai/tracing/search-traces/) for the full supported syntax.

```python
import mlflow
from datetime import datetime, timedelta

# Get traces from the last 24 hours
yesterday = datetime.now() - timedelta(days=1)
traces = mlflow.search_traces(
    filter_string=f"timestamp > {int(yesterday.timestamp() * 1000)}"
)
```

The API returns a set of traces as a pandas DataFrame, where various data in the trace is expanded into columns. The dataframe can be directly passed into the <APILink fn="mlflow.genai.evaluate" /> function for evaluation.

### Step 2: Define application-specific scorers

[Scorer](/genai/eval-monitor/scorers) is the core component of evaluation, which defines the criteria for evaluating the quality of the traces. MLflow provides a set of built-in scorers for common evaluation criteria, and you can also define your own custom scorers for application-specific criteria.

In this example, we use three different types of scorers:

- <APILink fn="mlflow.genai.scorers.RetrievalGroundedness">RetrievalGroundedness</APILink>: Built-in scorer checks if the output is grounded in the retrieved data.
- <APILink fn="mlflow.genai.scorers.RelevanceToQuery">RelevanceToQuery</APILink>: Built-in scorer checks if the output is relevant to the user's request.
- <APILink fn="mlflow.genai.scorers.Guidelines">Guidelines</APILink>: Built-in scorer that allows you to judge the output against custom guidelines using LLMs.

These scorers uses LLM for judging the criteria. The default model is `openai:/gpt-4.1-mini`. You can also specify a different model by passing the `model` parameter to the scorer constructor.

```python
email_scorers = [
    RetrievalGroundedness(),
    RelevanceToQuery(),  # Checks if email addresses the user's request
    Guidelines(
        name="follows_objective",
        guidelines="The generated email must follow the objective in the request.",
    ),
    Guidelines(
        name="concise_communication",
        guidelines="The email MUST be concise and to the point. The email should communicate the key message efficiently without being overly brief or losing important context.",
    ),
    Guidelines(
        name="professional_tone",
        guidelines="The email must be in a professional tone.",
    ),
]
```

:::tip Scoring Intermediate Information in Traces

Scorers have access to the complete MLflow traces, including spans, attributes, and outputs. This allows you to evaluate the agent's behavior precisely, not only the final output, such as the **tool call trajectory**, the **sub-agents routing**, the **retrieved document recall**, etc. See <ins>[Parsing Traces for Scoring](/genai/eval-monitor/scorers/custom#parsing-traces-for-scoring)</ins> for more details.

:::

### Step 3: Evaluate trace quality

Now we are ready to run the evaluation. One notable difference from other examples is that we don't need to specify a `predict_fn` function. The <APILink fn="mlflow.genai.evaluate" /> function will automatically extract the inputs, outputs, and other intermediate information from the trace object and use them for scoring.

```python
results = mlflow.genai.evaluate(
    data=traces,
    scorers=email_scorers,
)
```

Once the evaluation is done, open the MLflow UI in your browser and navigate to the experiment page. You should see MLflow creates a new Run and logs the evaluation results.

<ImageBox src="/images/mlflow-3/eval-monitor/trace-evaluation-result.png" alt="Evaluate traces result" width="95%"/>

By clicking on the each row in the result, you can open the trace and see the detailed score and rationale.

## Annotate Traces with Ground Truth and Manual Feedbacks

Some evaluation criteria require ground truths to be defined. MLflow allows you to directly annotate traces with ground truths and any other human feedbacks.

To annotate a trace with ground truth or manual feedback, open the trace in the MLflow UI and click the **Assessments** button to add expectations or feedback directly through the web interface.

<ImageBox src="/images/mlflow-3/eval-monitor/trace-evaluation-assessments.png" alt="Annotate traces with ground truth" width="80%"/>

Alternatively, you can also annotate traces with ground truth or manual feedbacks using the <APILink fn="mlflow.log_expectation" /> and the <APILink fn="mlflow.log_feedback" /> APIs respectively.

## Recording End-user Feedbacks from Production

Using the <APILink fn="mlflow.log_feedback" /> API, you can record end-user feedbacks from your production application directly and monitor them in MLflow.

<ImageBox src="/images/mlflow-3/eval-monitor/trace-evaluation-user-feedback.png" alt="Annotate traces with feedback" width="95%"/>

```python
# Decorate the endpoint with MLflow tracing
@mlflow.trace(span_type="LLM")
@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat endpoint that answers user questions and returns response with MLflow trace ID.
    """
    try:
        response = await openai.AsyncOpenAI().chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": request.prompt}],
        )

        # Get the active trace ID for the request
        trace_id = mlflow.get_current_active_span().trace_id

        return ChatResponse(
            response=response.choices[0].message.content,
            trace_id=trace_id,
            timestamp=time.time(),
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing chat request: {str(e)}"
        )


@app.post("/feedback", response_model=FeedbackResponse)
async def feedback(request: FeedbackRequest):
    """
    Feedback endpoint that annotates MLflow traces with user feedback.
    """
    try:
        # Record the given user feedback to the Trace
        mlflow.log_feedback(
            trace_id=request.trace_id,
            name="user_satisfaction",
            value=request.thumbs_up,
            source=AssessmentSource(
                source_type=AssessmentSourceType.HUMAN, source_id=request.user_id
            ),
            rationale=request.rationale,
        )
        return FeedbackResponse(
            message="Feedback recorded successfully", trace_id=request.trace_id
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing feedback: {str(e)}"
        )
```

## Next steps

<TilesGrid>
  <TileCard
    icon={Code}
    iconSize={48}
    title="Custom Scorers"
    description="Build advanced evaluation criteria and metrics tailored to your specific trace analysis needs."
    href="/genai/eval-monitor/scorers"
    linkText="Create custom scorers →"
    containerHeight={64}
  />
  <TileCard
    icon={Activity}
    iconSize={48}
    title="Production Monitoring"
    description="Optimize trace collection in production environments for efficient monitoring and analysis."
    href="/genai/tracing/prod-tracing"
    linkText="Set up monitoring →"
    containerHeight={64}
  />
  <TileCard
    icon={Zap}
    iconSize={48}
    title="Tracing Integrations"
    description="Use MLflow Tracing with other LLM providers and frameworks, such as LangGraph, Pydantic AI."
    href="/genai/tracing/integrations"
    linkText="Explore integrations →"
    containerHeight={64}
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

---[FILE: custom.mdx]---
Location: mlflow-master/docs/docs/genai/eval-monitor/scorers/custom.mdx

```text
import { APILink } from "@site/src/components/APILink";
import ImageBox from "@site/src/components/ImageBox";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import TabsWrapper from "@site/src/components/TabsWrapper";
import TileCard from '@site/src/components/TileCard';
import TilesGrid from '@site/src/components/TilesGrid';
import { Bot, GitBranch, Target } from "lucide-react";

# Custom Code-based Scorers

Custom scorers offer the ultimate flexibility to define precisely how your GenAI application's quality is measured. They provide the flexibility to define evaluation metrics tailored to your specific business use case, whether based on simple heuristics, advanced logic, or programmatic evaluations.

## Example Usage

To define a custom scorer, you can define a function that takes in the [input arguments](#input-format) and add the <APILink fn="mlflow.genai.scorers.scorer">@scorer</APILink> decorator to the function.

```python
from mlflow.genai import scorer


@scorer
def exact_match(outputs: dict, expectations: dict) -> bool:
    return outputs == expectations["expected_response"]
```

To return richer information beyond primitive values, you can return a <APILink fn="mlflow.entities.Feedback">Feedback</APILink> object.

```python
from mlflow.entities import Feedback


@scorer
def is_short(outputs: dict) -> Feedback:
    score = len(outputs.split()) <= 5
    rationale = (
        "The response is short enough."
        if score
        else f"The response is not short enough because it has ({len(outputs.split())} words)."
    )
    return Feedback(value=score, rationale=rationale)
```

Then you can pass the functions directly to the <APILink fn="mlflow.genai.evaluate">mlflow.genai.evaluate</APILink> function, just like other predefined or LLM-based scorers.

```python
import mlflow

eval_dataset = [
    {
        "inputs": {"question": "How many countries are there in the world?"},
        "outputs": "195",
        "expectations": {"expected_response": "195"},
    },
    {
        "inputs": {"question": "What is the capital of France?"},
        "outputs": "The capital of France is Paris.",
        "expectations": {"expected_response": "Paris"},
    },
]

mlflow.genai.evaluate(
    data=eval_dataset,
    scorers=[exact_match, is_short],
)
```

<ImageBox src="/images/mlflow-3/eval-monitor/scorers/code-scorers-results.png" alt="Code-based Scorers" />

## Input Format

As input, custom scorers have access to:

- The `inputs` dictionary, derived from either the input dataset or MLflow post-processing from your trace.
- The `outputs` value, derived from either the input dataset or trace. If `predict_fn` is provided, the `outputs` value will be the return value of the `predict_fn`.
- The `expectations` dictionary, derived from the `expectations` field in the input dataset, or associated with the trace.
- The complete [MLflow trace](/genai/concepts/trace), including spans, attributes, and outputs.

```python
@scorer
def my_scorer(
    *,
    inputs: dict[str, Any],
    outputs: Any,
    expectations: dict[str, Any],
    trace: Trace,
) -> float | bool | str | Feedback | list[Feedback]:
    # Your evaluation logic here
    ...
```

All parameters are **optional**; declare only what your scorer needs:

```
# ✔️ All of these signatures are valid for scorers
def my_scorer(inputs, outputs, expectations, trace) -> bool:
def my_scorer(inputs, outputs) -> str:
def my_scorer(outputs, expectations) -> Feedback:
def my_scorer(trace) -> list[Feedback]:

# 🔴 Additional parameters are not allowed
def my_scorer(inputs, outputs, expectations, trace, additional_param) -> float
```

:::info Where do these values come from?

When running `mlflow.genai.evaluate()`, the inputs, outputs, and expectations parameters can be specified in the data argument, or parsed from the trace. See <ins>[How Scorers Work](/genai/eval-monitor/scorers#how-scorers-work)</ins> for more details.

:::

## Return Types

Scorers can return different types depending on your evaluation needs:

### Simple values

Return primitive values for straightforward pass/fail or numeric assessments.

- Pass/fail strings: `"yes"` or `"no"` render as <div className="inline-flex rounded-sm bg-green-100 px-2 py-1 text-sm text-green-600">Pass</div> or <div className="inline-flex rounded-sm bg-red-100 px-2 py-1 text-sm text-red-800">Fail</div> in the UI
- Boolean values: `True` or `False` for binary evaluations
- Numeric values: Integers or floats for scores, counts, or measurements

### Rich feedback

Return <APILink fn="mlflow.entities.Feedback">Feedback</APILink> objects for detailed assessments with additional metadata such as explanation, source info, and error summary.

```python
from mlflow.entities import Feedback, AssessmentSource


@scorer
def content_quality(outputs):
    return Feedback(
        value=0.85,  # Can be numeric, boolean, or string
        rationale="Clear and accurate, minor grammar issues",
        # Optional: source of the assessment. Several source types are supported,
        # such as "HUMAN", "CODE", "LLM_JUDGE".
        source=AssessmentSource(source_type="CODE", source_id="grammar_checker_v1"),
        # Optional: additional metadata about the assessment.
        metadata={
            "annotator": "me@example.com",
        },
    )
```

Multiple feedback objects can be returned as a list. Each feedback object will be displayed as a separate metric in the evaluation results.

```
@scorer
def comprehensive_check(inputs, outputs):
    return [
        Feedback(name="relevance", value=True, rationale="Directly addresses query"),
        Feedback(name="tone", value="professional", rationale="Appropriate for audience"),
        Feedback(name="length", value=150, rationale="Word count within limits")
    ]
```

## Parsing Traces for Scoring

:::warning[Important: Agent-as-a-Judge Scorers Require Active Traces]

Scorers that accept a `trace` parameter **cannot be used with pandas DataFrames**. They require actual execution traces from your application.

If you need to evaluate static data (e.g., a CSV file with pre-generated responses), use field-based scorers that work with `inputs`, `outputs`, and `expectations` parameters only.

:::

Scorers have access to the complete MLflow traces, including spans, attributes, and outputs, allowing you to evaluate the agent's behavior precisely, not just the final output.
The <APILink fn="mlflow.entities.Trace.search_spans">`Trace.search_spans`</APILink> API is a powerful way to retrieve such intermediate information from the trace.

Open the tabs below to see examples of custom scorers that evaluate the detailed behavior of agents by parsing the trace.

<TabsWrapper>
  <Tabs>
    <TabItem value="retrieved_document_recall" label="Retrieved Document Recall">

    ### Example 1: Evaluating Retrieved Documents Recall

    ```python
    from mlflow.entities import SpanType, Trace
    from mlflow.genai import scorer


    @scorer
    def retrieved_document_recall(trace: Trace, expectations: dict) -> Feedback:
        # Search for retriever spans in the trace
        retriever_spans = trace.search_spans(span_type=SpanType.RETRIEVER)

        # If there are no retriever spans
        if not retriever_spans:
            return Feedback(
                value=0,
                rationale="No retriever span found in the trace.",
            )

        # Gather all retrieved document URLs from the retriever spans
        all_document_urls = []
        for span in retriever_spans:
            all_document_urls.extend([document["doc_uri"] for document in span.outputs])

        # Compute the recall
        true_positives = len(
            set(all_document_urls) & set(expectations["relevant_document_urls"])
        )
        expected_positives = len(expectations["relevant_document_urls"])
        recall = true_positives / expected_positives
        return Feedback(
            value=recall,
            rationale=f"Retrieved {true_positives} relevant documents out of {expected_positives} expected.",
        )
    ```
    </TabItem>
    <TabItem value="tool_call_trajectory" label="Tool Call Trajectory">

    ### Example 2: Evaluating Tool Call Trajectory

    ```python
    from mlflow.entities import SpanType, Trace
    from mlflow.genai import scorer


    @scorer
    def tool_call_trajectory(trace: Trace, expectations: dict) -> Feedback:
        # Search for tool call spans in the trace
        tool_call_spans = trace.search_spans(span_type=SpanType.TOOL)

        # Compare the tool trajectory with expectations
        actual_trajectory = [span.name for span in tool_call_spans]
        expected_trajectory = expectations["tool_call_trajectory"]

        if actual_trajectory == expected_trajectory:
            return Feedback(value=1, rationale="The tool call trajectory is correct.")
        else:
            return Feedback(
                value=0,
                rationale=(
                    "The tool call trajectory is incorrect.\n"
                    f"Expected: {expected_trajectory}.\n"
                    f"Actual: {actual_trajectory}."
                ),
            )
    ```
    </TabItem>
    <TabItem value="sub_agents_routing" label="Sub-Agents Routing">

    ### Example 3: Evaluating Sub-Agents Routing

    ```python
    from mlflow.entities import SpanType, Trace
    from mlflow.genai import scorer


    @scorer
    def is_routing_correct(trace: Trace, expectations: dict) -> Feedback:
        # Search for sub-agent spans in the trace
        sub_agent_spans = trace.search_spans(span_type=SpanType.AGENT)

        invoked_agents = [span.name for span in sub_agent_spans]
        expected_agents = expectations["expected_agents"]

        if invoked_agents == expected_agents:
            return Feedback(value=True, rationale="The sub-agents routing is correct.")
        else:
            return Feedback(
                value=False,
                rationale=(
                    "The sub-agents routing is incorrect.\n"
                    f"Expected: {expected_agents}.\n"
                    f"Actual: {invoked_agents}."
                ),
            )
    ```
    </TabItem>

  </Tabs>
</TabsWrapper>

## Error handling

When a scorer encounters an error, MLflow provides two approaches:

### Let exceptions propagate (recommended)

The simplest approach is to let exceptions throw naturally. MLflow automatically captures the exception and creates a Feedback object with the error details:

```python
import json
import mlflow
from mlflow.entities import Feedback
from mlflow.genai.scorers import scorer


@scorer
def is_valid_response(outputs: str) -> Feedback:
    # Let json.JSONDecodeError propagate if response isn't valid JSON
    data = json.loads(outputs)

    # Let KeyError propagate if required fields are missing
    summary = data["summary"]
    confidence = data["confidence"]

    return Feedback(value=True, rationale=f"Valid JSON with confidence: {confidence}")


# Run the scorer on invalid data that triggers exceptions
invalid_data = [
    {
        # Valid JSON
        "outputs": '{"summary": "this is a summary", "confidence": 0.95}'
    },
    {
        # Invalid JSON
        "outputs": "invalid json",
    },
    {
        # Missing required fields
        "outputs": '{"summary": "this is a summary"}'
    },
]

mlflow.genai.evaluate(
    data=invalid_data,
    scorers=[is_valid_response],
)
```

When an exception occurs, MLflow creates a <APILink fn="mlflow.entities.Feedback">Feedback</APILink> with:

- `value`: None
- `error`: The exception details, such as exception object, error message, and stack trace

The error information will be displayed in the evaluation results. Open the corresponding row to see the error details.

<ImageBox src="/images/mlflow-3/eval-monitor/scorers/scorer-error.png" alt="Scorer Error" />

### Handle exceptions explicitly

For custom error handling or to provide specific error messages, catch exceptions and return a <APILink fn="mlflow.entities.Feedback">Feedback</APILink> with None value and error details:

```python
import json
from mlflow.entities import AssessmentError, Feedback


@scorer
def is_valid_response(outputs):
    try:
        data = json.loads(outputs)
        required_fields = ["summary", "confidence", "sources"]
        missing = [f for f in required_fields if f not in data]

        if missing:
            # Specify the AssessmentError object explicitly
            return Feedback(
                error=AssessmentError(
                    error_code="MISSING_REQUIRED_FIELDS",
                    error_message=f"Missing required fields: {missing}",
                ),
            )

        return Feedback(value=True, rationale="Valid JSON with all required fields")

    except json.JSONDecodeError as e:
        # Can pass exception object directly to the error parameter as well
        return Feedback(error=e)
```

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
    icon={Target}
    title="Ground Truth Expectations"
    description="Learn how to define and manage ground truth data for accurate evaluations"
    href="/genai/assessments/expectations"
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/genai/eval-monitor/scorers/index.mdx

```text
import Link from "@docusaurus/Link";
import TileCard from '@site/src/components/TileCard';
import TilesGrid from '@site/src/components/TilesGrid';
import { Bot, Target, Scale } from "lucide-react";
import WorkflowSteps from '@site/src/components/WorkflowSteps';

# What are Scorers?

**Scorers** are key components of the MLflow GenAI evaluation framework. They provide a unified interface to define evaluation criteria for your models, agents, and applications.

Scorers can be considered as **metrics** in the traditional ML sense. However, they are more flexible and can return more structured quality feedback, not only the scalar values that are typically represented by metrics.

## How Scorers Work

Scorers analyze inputs, outputs, and traces from your GenAI application and produce quality assessments. Here's the flow:

1. You provide a dataset of <div className="inline-flex rounded-sm bg-green-100 px-2 py-1 text-sm text-green-900">inputs</div> (and optionally other columns such as <div className="inline-flex rounded-sm bg-yellow-100 px-2 py-1 text-sm text-yellow-900">expectations</div>)
2. MLflow runs your `predict_fn` to generate <div className="inline-flex rounded-sm bg-orange-100 px-2 py-1 text-sm text-orange-900">outputs</div> and <div className="inline-flex rounded-sm bg-cyan-100 px-2 py-1 text-sm text-cyan-900">traces</div> for each row in the dataset. Alternatively, you can provide outputs and traces directly in the dataset and omit the predict function.
3. Scorers receive the <div className="inline-flex rounded-sm bg-green-100 px-2 py-1 text-sm text-green-900">inputs</div>, <div className="inline-flex rounded-sm bg-orange-100 px-2 py-1 text-sm text-orange-900">outputs</div>, <div className="inline-flex rounded-sm bg-yellow-100 px-2 py-1 text-sm text-yellow-900">expectations</div>, and <div className="inline-flex rounded-sm bg-cyan-100 px-2 py-1 text-sm text-cyan-900">traces</div> (or a subset of them) and produce scores and metadata such as explanations and source information.
4. MLflow aggregates the scorer results and saves them. You can analyze the results in the UI.

## What Scorers you should use?

MLflow provides different types of scorers to address different evaluation needs:

> _I want to try evaluation quickly and get some results fast._

&emsp;→ Use [Predefined Scorers](/genai/eval-monitor/scorers/llm-judge/predefined) to get started.

> _I want to evaluate my application with a simple natural language criteria, such as "The response must be polite"._

&emsp;→ Use [Guidelines-based Scorers](/genai/eval-monitor/scorers/llm-judge/guidelines).

> _I want to use more advanced prompt for evaluating my application._

&emsp;→ Use [Prompt-based Scorers](/genai/eval-monitor/scorers/llm-judge/make-judge).

> _I want to dump the entire trace to the scorer and get detailed insights from it._

&emsp;→ Use [Agent-as-a-Judge Scorers](/genai/eval-monitor/scorers/llm-judge/agentic-overview).

> _I want to write my own code for evaluating my application. Other scorers don't fit my advanced needs._

&emsp;→ Use [Code-based Scorers](/genai/eval-monitor/scorers/custom) to implement your own evaluation logic with Python.

If you are still not sure about which scorer to use, you can ask to the Ask AI (add image) widget in the right below.

## How to Write a Good Scorer?

The general metrics such as 'Hallucination' or 'Toxicity' rarely work in practice. Successful practitioners
analyze real data to uncover domain-specific failure modes and then define custom evaluation criteria from the ground up. Here is the general workflow of how to define a good scorer and iterate on it with MLflow.

<WorkflowSteps
  width="wide"
  steps={[
    {
      title: "Generate traces or collect them from production",
      description: <div>Start with generating <Link href="/genai/tracing">traces</Link> from a set of realistic input samples. If you already have production traces, that is even better.</div>
    },
    {
      title: "Gather human feedback",
      description: <div>Collect feedback from domain experts or users. MLflow provides <Link href="/genai/assessments/feedback">a UI and SDK</Link> for collecting feedback on traces.</div>
    },
    {
      title: "Error analysis",
      description: <div>Analyze the common failure modes (error categories) from the feedback.<br/>To organize traces into error categories, use <Link href="/genai/tracing/attach-tags">Trace Tag</Link> to label and filter traces.</div>
    },
    {
      title: "Translate failure modes into Scorers",
      description: <div>Define scorers that check for the common failure modes.For example, if the answer is in an incorrect format, you may define an <Link href="/genai/eval-monitor/scorers/llm-judge">LLM-as-a-Judge scorer</Link> that checks if the format is correct. We recommend starting with a simple instruction and then iteratively refine it.</div>
    },
    {
      title: "Align scorers with human feedback.",
      description: <div>LLM-as-a-Judge has natural biases. Relying on biased evaluation will lead to incorrect decision making. Therefore, it is important to refine the scorer to align with human feedback. You can manually iterate on prompts or instructions, or use the <Link href='/genai/eval-monitor/scorers/llm-judge/alignment'>Automatic Judge Alignment</Link> feature of MLflow to optimize the instruction with a state-of-the-art algorithm powered by <Link href='https://dspy.ai/'>DSPy</Link>.</div>
    }
  ]}
/>

:::tip Pro tip: Version Control Scorers

As you iterate on the scorer, version control becomes important. MLflow can track <ins>[Scorer Versions](/genai/eval-monitor/scorers/versioning)</ins> to help you maintain changes and share the improved scorers with your team.

:::

## Next Steps

<TilesGrid>
  <TileCard
    icon={Scale}
    title="LLM-based Scorers"
    description="Get started with LLM judges for evaluating qualities."
    href="/genai/eval-monitor/scorers/llm-judge"
  />
  <TileCard
    icon={Bot}
    title="Evaluate Agents"
    description="Evaluate AI agents with specialized techniques and custom scorers"
    href="/genai/eval-monitor/running-evaluation/agents"
  />
  <TileCard
    icon={Target}
    title="Collect Human Feedback"
    description="Gather and manage human feedback to improve your evaluation accuracy"
    href="/genai/assessments/feedback"
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

---[FILE: versioning.mdx]---
Location: mlflow-master/docs/docs/genai/eval-monitor/scorers/versioning.mdx

```text
# Registering and Versioning Scorers

Scorers can be registered to MLflow experiments for version control and team collaboration.

## Supported Scorers

| Scorer Type                                                                      | Supported                                                         |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [Agent-as-a-Judge](/genai/eval-monitor/scorers/llm-judge/agentic-overview)       | ✅                                                                |
| [Template-based LLM Scorers](/genai/eval-monitor/scorers/llm-judge/make-judge)   | ✅                                                                |
| [Code-based Scorers](/genai/eval-monitor/scorers/custom)                         | ✅                                                                |
| [Guidelines-based LLM Scorers](/genai/eval-monitor/scorers/llm-judge/guidelines) | ❌ (Use [MLflow Prompt Registry](/genai/prompt-registry) instead) |
| [Predefined Scorers](/genai/eval-monitor/scorers/llm-judge/predefined)           | ❌ (Prompts are hard-coded in MLflow)                             |

## Usage

### Prerequisite

Judges are registered to an **MLflow Experiment** (not Run-level).

```python
import mlflow

mlflow.set_tracking_uri("your-tracking-uri")
mlflow.create_experiment("evaluation-judges")
```

Define a sample template-based LLM scorer:

```python
from mlflow.genai.judges import make_judge

quality_judge = make_judge(
    name="response_quality",
    instructions=("Evaluate if {{ outputs }} is high quality for {{ inputs }}."),
    model="anthropic:/claude-opus-4-1-20250805",
    feedback_value_type=str,
)
```

### Registering a Scorer

To register a judge to the experiment, call the `register` method on the judge instance.

```python
# Register the judge
registered = quality_judge.register()
# You can pass experiment_id to register the judge to a specific experiment
# registered = quality_judge.register(experiment_id=experiment_id)
```

### Updating a Scorer

Registering a new scorer with the same name will create a new version.

```python
# Update and register a new version of the judge
quality_judge_v2 = make_judge(
    name="response_quality",  # Same name
    instructions=(
        "Evaluate if {{ outputs }} is high quality, accurate, and complete "
        "for the question in {{ inputs }}."
    ),
    model="anthropic:/claude-3.5-sonnet-20241022",  # Updated model
    feedback_value_type=str,
)

# Register the updated judge
registered_v2 = quality_judge_v2.register(experiment_id=experiment_id)
```

### Loading a Scorer

To load a registered scorer, use the `get_scorer` function.

```python
from mlflow.genai.scorers import get_scorer

# Get the latest version
latest_judge = get_scorer(name="response_quality")
# or specify experiment_id to get a scorer from a specific experiment
# latest_judge = get_scorer(name="response_quality", experiment_id=experiment_id)
```

### Listing Scorers

The `list_scorers` function returns a list of the scorers registered in the experiment.

```python
from mlflow.genai.scorers import list_scorers

all_scorers = list_scorers(experiment_id=experiment_id)
for scorer in all_scorers:
    print(f"Scorer: {scorer.name}, Model: {scorer.model}")
```

## UI Support

Coming soon!
```

--------------------------------------------------------------------------------

````
