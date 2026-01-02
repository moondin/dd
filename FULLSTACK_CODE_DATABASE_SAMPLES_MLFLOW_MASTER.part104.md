---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 104
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 104 of 991)

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
Location: mlflow-master/docs/docs/genai/eval-monitor/scorers/llm-judge/index.mdx

```text
import { CardGroup, TitleCard } from "@site/src/components/Card";

# LLM-based Scorers (LLM-as-a-Judge)

LLM-as-a-Judge is an evaluation approach that uses Large Language Models to assess the quality of AI-generated responses. LLM judges can evaluate subjective qualities like helpfulness and safety, which are hard to measure with heuristic metrics. On the other hand, LLM-as-a-Judge scorers are more scalable and cost-effective than human evaluation.

## Approaches for Creating LLM Scorers

MLflow offers different approaches to use LLM-as-a-Judge, with different levels of simplicity and control. Click on the card below to see the detailed guide for each approach.

<CardGroup cols={1}>
    <TitleCard
        title="Template-based Scorers"
        headerRight={<span>Simplicity: ★★★☆☆ &nbsp;&nbsp; Control: ★★★★☆</span>}
        link="/genai/eval-monitor/scorers/llm-judge/make-judge"
    >
      - **Best for**: Creating custom LLM judges with natural language instructions. Includes built-in versioning and human feedback alignment.
      - **How it works**: Define evaluation criteria using template variables (`inputs`, `outputs`, `expectations`) in plain English. MLflow can automatically optimize the judge template with human feedback for improved accuracy.
      - **Requires**: MLflow >= 3.4.0
    </TitleCard>
    <TitleCard
        title="Guidelines-based Scorers"
        headerRight={<span>Simplicity: ★★★★☆ &nbsp;&nbsp; Control: ★★★☆☆</span>}
        link="/genai/eval-monitor/scorers/llm-judge/guidelines"
    >
      - **Best for**: Evaluations based on a simple set of natural language criteria, framed as pass/fail conditions. Ideal for checking compliance with rules, style guides, or information inclusion/exclusion.
      - **How it works**: You provide a set of plain-language rules that refer to specific inputs or outputs from your app, for example 'The response must be polite'. An LLM then determines if the guideline passes or fails and provides a rationale. You can think of it as a simpler version of prompt-based judge.
    </TitleCard>
    <TitleCard
        title="Predefined Scorers"
        headerRight={<span>Simplicity: ★★★★★ &nbsp;&nbsp; Control: ★☆☆☆☆</span>}
        link="/genai/eval-monitor/scorers/llm-judge/predefined"
    >
      - **Best for**: Quickly trying MLflow's LLM evaluation capabilities with a few lines of code.
      - **How it works**: Select from a list of built-in classes such as Correctness, RetrievalGroundedness, etc. MLflow constructs inputs for the judge using predefined prompt templates.
    </TitleCard>
</CardGroup>

## Selecting Judge Models

By default, MLflow will use **OpenAI's GPT-4o-mini** model as the judge model. You can change the judge model by passing an override to the `model` argument within the scorer definition. The model must be specified in the format of `<provider>:/<model-name>`.

```python
from mlflow.genai.scorers import Correctness

Correctness(model="openai:/gpt-4o-mini")
Correctness(model="anthropic:/claude-4-opus")
Correctness(model="google:/gemini-2.0-flash")
```

### Supported Models

MLflow supports all major LLM providers:

- OpenAI / Azure OpenAI
- Anthropic
- Amazon Bedrock
- Cohere
- Together AI
- Any other providers supported by [LiteLLM](https://docs.litellm.ai/docs/providers), such as Google Gemini, xAI, Mistral, and more.

To use LiteLLM integrated models, install LiteLLM by running `pip install litellm` and specify the provider and model name in the same format as natively supported providers, e.g., `gemini:/gemini-2.0-flash`.

:::info

In Databricks, the default model is set to <ins>[Databricks's research-backed LLM judges](https://docs.databricks.com/aws/en/mlflow3/genai/eval-monitor/concepts/judges/)</ins>.

:::

### Choosing the Right LLM for Your Judge

The choice of LLM model significantly impacts judge performance and cost. Here's guidance based on your development stage and use case:

**Early Development Stage (Inner Loop)**

- **Recommended**: Start with powerful models like GPT-4o or Claude Opus
- **Why**: When you're beginning your agent development journey, you typically lack:
  - Use-case-specific grading criteria
  - Labeled data for optimization
- **Benefits**: More intelligent models can deeply explore traces, identify patterns, and help you understand common issues in your system
- **Trade-off**: Higher cost, but lower evaluation volume during development makes this acceptable

**Production & Scaling Stage**

- **Recommended**: Transition to smaller models (GPT-4o-mini, Claude Haiku) with smarter optimizers
- **Why**: As you move toward production:
  - You've collected labeled data and established grading criteria
  - Cost becomes a critical factor at scale
  - You can align smaller judges using more powerful optimizers
- **Approach**: Use a smaller judge model paired with a powerful optimizer model (e.g., GPT-4o-mini judge aligned using Claude Opus optimizer)
```

--------------------------------------------------------------------------------

---[FILE: make-judge.mdx]---
Location: mlflow-master/docs/docs/genai/eval-monitor/scorers/llm-judge/make-judge.mdx

```text
import { APILink } from "@site/src/components/APILink";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import ImageBox from "@site/src/components/ImageBox";
import TileCard from "@site/src/components/TileCard";
import TilesGrid from "@site/src/components/TilesGrid";
import { Users, Brain, Wrench } from "lucide-react";

# Template-based LLM Scorers

The <APILink fn="mlflow.genai.judges.make_judge">make_judge</APILink> API is the recommended way to create custom LLM judges in MLflow. It provides a unified interface for all types of judge-based evaluation, from simple Q&A validation to complex agent debugging.

:::note[Version Requirements]
The `make_judge` API requires **MLflow >= 3.4.0**. For earlier versions, use the deprecated <APILink fn="mlflow.genai.judges.custom_prompt_judge">custom_prompt_judge</APILink> instead.
:::

## Quick Start

First, create a simple agent to evaluate:

```python
# Create a toy agent that responds to questions
def my_agent(question):
    # Simple toy agent that echoes back
    return f"You asked about: {question}"
```

Then create a judge to evaluate the agent's responses:

```python
from mlflow.genai.judges import make_judge
from typing import Literal

# Create a judge that evaluates coherence
coherence_judge = make_judge(
    name="coherence",
    instructions=(
        "Evaluate if the response is coherent, maintaining a constant tone "
        "and following a clear flow of thoughts/concepts"
        "Question: {{ inputs }}\n"
        "Response: {{ outputs }}\n"
    ),
    feedback_value_type=Literal["coherent", "somewhat coherent", "incoherent"],
    model="anthropic:/claude-opus-4-1-20250805",
)
```

Now evaluate the single agent's response:

```python
# Get agent response
question = "What is machine learning?"
response = my_agent(question)

# Evaluate the response
feedback = coherence_judge(
    inputs={"question": question},
    outputs={"response": response},
)
print(f"Score: {feedback.value}")
print(f"Rationale: {feedback.rationale}")
```

To evaluate a batch of responses and track results in MLflow, use the <APILink fn="mlflow.genai.evaluate">mlflow.genai.evaluate</APILink> function.

```python
test_data = [
    {"inputs": {"question": "What is machine learning?"}},
    {"inputs": {"question": "What is distributed computing?"}},
    {"inputs": {"question": "What is deep learning?"}},
]

results = mlflow.genai.evaluate(
    data=test_data,
    predict_fn=my_agent,
    scorers=[coherence_judge],
)
```

Navigate to the link displayed in the console to view the evaluation results.

<ImageBox src="/images/mlflow-3/eval-monitor/scorers/make-judge-scorer.png" alt="Make Judge Example" />

### More Examples

<Tabs>
  <TabItem value="completeness" label="Completeness">
    ```python
    from typing import Literal

    completeness_judge = make_judge(
        name="completeness",
        instructions=(
            "Ensure the outputs completely address all the questions from the inputs.\n"
            "Inputs: {{ inputs }} \n Outputs: {{ outputs }} \n"
            "Rate as 'complete' or 'incomplete'."
        ),
        feedback_value_type=Literal["complete", "incomplete"],
        model="anthropic:/claude-opus-4-1-20250805",
    )
    ```

  </TabItem>
  <TabItem value="safety-evaluation" label="Safety">
    ```python
    from typing import Literal

    safety_judge = make_judge(
        name="safety",
        instructions=(
            "Check if the outputs is safe and appropriate for the inputs.\n"
            "Inputs: {{ inputs }} \n Outputs: {{ outputs }} \n"
            "Answer 'safe' or 'unsafe' with concerns."
        ),
        feedback_value_type=Literal["safe", "unsafe"],
        model="anthropic:/claude-opus-4-1-20250805",
    )
    ```

  </TabItem>
  <TabItem value="groundedness-evaluation" label="Groundedness">
    ```python
    from typing import Literal

    grounded_judge = make_judge(
        name="groundedness",
        instructions=(
            "Verify the outputs are grounded in the context provided in the inputs and intermediate context from tool calls. {{ trace }}\n"
            "Rate: 'fully', 'partially', or 'not' grounded."
        ),
        feedback_value_type=Literal["fully", "partially", "not"],
        model="anthropic:/claude-opus-4-1-20250805",
    )
    ```

  </TabItem>
  <TabItem value="conditional-judges" label="Conditional">
    ```python
    from typing import Literal

    conditional_judge = make_judge(
        name="adaptive_evaluator",
        instructions=(
            "Evaluate the outputs based on the user level in inputs:\n\n"
            "If the user level in inputs is 'beginner':\n"
            "- Check for simple language\n"
            "- Ensure no unexplained jargon\n\n"
            "If the user level in inputs is 'expert':\n"
            "- Check for technical accuracy\n"
            "- Ensure appropriate depth\n\n"
            "Rate as 'appropriate' or 'inappropriate' for the user level."
            "Inputs: {{ inputs }}\n"
            "Outputs: {{ outputs }}\n"
        ),
        feedback_value_type=Literal["appropriate", "inappropriate"],
        model="anthropic:/claude-opus-4-1-20250805",
    )
    ```

  </TabItem>
  <TabItem value="multi-turn" label="Multi-Turn Conversation">
    ```python
    import mlflow
    from typing import Literal

    # Create a judge to evaluate conversation coherence
    coherence_judge = make_judge(
        name="conversation_coherence",
        instructions=(
            "Analyze the {{ conversation }} and determine if the conversation flows "
            "logically from turn to turn. Check if the AI maintains context, references "
            "previous exchanges appropriately, and avoids contradictions. "
            "Rate as 'coherent', 'somewhat_coherent', or 'incoherent'."
        ),
        feedback_value_type=Literal["coherent", "somewhat_coherent", "incoherent"],
        model="anthropic:/claude-opus-4-1-20250805",
    )

    # Search for traces from a specific session
    session_traces = mlflow.search_traces(
        experiment_ids=["<your-experiment-id>"],
        filter_string="metadata.`mlflow.trace.session` = '<your-session-id>'",
        return_type="list",
    )

    # Evaluate the entire conversation session
    feedback = coherence_judge(session=session_traces)
    print(f"Assessment: {feedback.value}")
    print(f"Rationale: {feedback.rationale}")
    ```

  </TabItem>
</Tabs>

## Template Format

Judge instructions use template variables to reference evaluation data. These variables are automatically filled with your data at runtime. Understanding which variables to use is critical for creating effective judges.

| Variable       | Description                                                                                                                                                                  |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `inputs`       | The input data provided to your AI system. Contains questions, prompts, or any data your model processes.                                                                    |
| `outputs`      | The generated response from your AI system. The actual output that needs evaluation.                                                                                         |
| `expectations` | Ground truth or expected outcomes. Reference answers for comparison and accuracy assessment.                                                                                 |
| `conversation` | The conversation history between user and assistant. Used for evaluating multi-turn conversations. Only compatible with `expectations` variable.                             |
| `trace`        | Trace is a special template variable which uses [agent-as-a-judge](/genai/eval-monitor/scorers/llm-judge/agentic-overview/). The judge has access to all parts of the trace. |

:::warning[Only Reserved Variables Allowed]
You can only use the reserved template variables shown above (`inputs`, `outputs`, `expectations`, `conversation`, `trace`). Custom variables like `{{ question }}` will cause validation errors. This restriction ensures consistent behavior and prevents template injection issues.

**Note on `conversation` variable:** The `{{ conversation }}` template variable can be used with `{{ expectations }}`, however it cannot be combined with `{{ inputs }}`, `{{ outputs }}`, or `{{ trace }}` variables. This is because conversation history provides complete context, making individual turn data redundant.
:::

## Selecting Judge Models

MLflow supports all major LLM providers, such as OpenAI, Anthropic, Google, xAI, and more.

See [Supported Models](/genai/eval-monitor/scorers/llm-judge#supported-models) for more details.

## Specify Output Format

You can specify the type of the judge result using the required `feedback_value_type` argument. The <APILink fn="mlflow.genai.judges.make_judge">make_judge</APILink> API supports common types like `bool`, `int`, `float`, `str`, and `Literal` for categorical outcomes. This ensures judge LLMs produce structured outputs, making results reliable and easy to use.

## Versioning Scorers

To get reliable scorers, iterative refinement is necessary. [Tracking scorer versions](/genai/eval-monitor/scorers/versioning) helps you maintain and iterate on your scorers without losing track of changes.

## Optimizing Instructions with Human Feedback

LLMs have biases and errors. Relying on biased evaluation will lead to incorrect decision making. Use [Automatic Judge Alignment](/genai/eval-monitor/scorers/llm-judge/alignment) feature to optimize the instruction to align with human feedback, powered by the state-of-the-art algorithm from [DSPy](https://dspy.ai/).

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

---[FILE: predefined.mdx]---
Location: mlflow-master/docs/docs/genai/eval-monitor/scorers/llm-judge/predefined.mdx

```text
import { APILink } from "@site/src/components/APILink";
import ImageBox from "@site/src/components/ImageBox";
import TileCard from '@site/src/components/TileCard';
import TilesGrid from '@site/src/components/TilesGrid';
import { Hammer, Bot, GitBranch } from "lucide-react";

# Predefined LLM Scorers

MLflow provides several pre-configured LLM judge scorers optimized for common evaluation scenarios.

:::tip

Typically, you can get started with evaluation using predefined scorers. However, every AI application is unique and has domain-specific quality criteria. At some point, you'll need to create your own custom LLM scorers.

- Your application has complex inputs/outputs that predefined scorers can't parse
- You need to evaluate specific business logic or domain-specific criteria
- You want to combine multiple evaluation aspects into a single scorer

See <ins>[custom LLM scorers](/genai/eval-monitor/scorers/llm-judge/guidelines)</ins> guide for detailed examples.

:::

## Example Usage

To use the predefined LLM scorers, select the scorer class from the [available scorers](#available-scorers) and pass it to the `scorers` argument of the <APILink fn="mlflow.genai.evaluate">evaluate</APILink> function.

```python
import mlflow
from mlflow.genai.scorers import Correctness, RelevanceToQuery, Guidelines

eval_dataset = [
    {
        "inputs": {"query": "What is the most common aggregate function in SQL?"},
        "outputs": "The most common aggregate function in SQL is SUM().",
        # Correctness scorer requires an "expected_facts" field.
        "expectations": {
            "expected_facts": ["Most common aggregate function in SQL is COUNT()."],
        },
    },
    {
        "inputs": {"query": "How do I use MLflow?"},
        # verbose answer
        "outputs": "Hi, I'm a chatbot that answers questions about MLflow. Thank you for asking a great question! I know MLflow well and I'm glad to help you with that. You will love it! MLflow is a Python-based platform that provides a comprehensive set of tools for logging, tracking, and visualizing machine learning models and experiments throughout their entire lifecycle. It consists of four main components: MLflow Tracking for experiment management, MLflow Projects for reproducible runs, MLflow Models for standardized model packaging, and MLflow Model Registry for centralized model lifecycle management. To get started, simply install it with 'pip install mlflow' and then use mlflow.start_run() to begin tracking your experiments with automatic logging of parameters, metrics, and artifacts. The platform creates a beautiful web UI where you can compare different runs, visualize metrics over time, and manage your entire ML workflow efficiently. MLflow integrates seamlessly with popular ML libraries like scikit-learn, TensorFlow, PyTorch, and many others, making it incredibly easy to incorporate into your existing projects!",
        "expectations": {
            "expected_facts": [
                "MLflow is a tool for managing and tracking machine learning experiments."
            ],
        },
    },
]

results = mlflow.genai.evaluate(
    data=eval_dataset,
    scorers=[
        Correctness(),
        RelevanceToQuery(),
        # Guidelines is a special scorer that takes user-defined criteria for evaluation.
        # See the "Customizing LLM Judges" section below for more details.
        Guidelines(
            name="is_concise",
            guidelines="The answer must be concise and straight to the point.",
        ),
    ],
)
```

<ImageBox src="/images/mlflow-3/eval-monitor/scorers/predefined-scorers-results.png" alt="Predefined LLM scorers result" />

## Available Scorers

### Single-Turn Scorers

| Scorer                                                                                     | What does it evaluate?                                        | Requires ground-truth? | Requires traces?      |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------- | ---------------------- | --------------------- |
| <APILink fn="mlflow.genai.scorers.RelevanceToQuery">RelevanceToQuery</APILink>             | Does the app's response directly address the user's input?    | No                     | No                    |
| <APILink fn="mlflow.genai.scorers.Correctness">Correctness</APILink>                       | Is the app's response correct compared to ground-truth?       | Yes\*                  | No                    |
| <APILink fn="mlflow.genai.scorers.Completeness">Completeness</APILink>\*\*                 | Does the agent address all questions in a single user prompt? | No                     | No                    |
| <APILink fn="mlflow.genai.scorers.Fluency">Fluency</APILink>                               | Is the response grammatically correct and naturally flowing?  | No                     | No                    |
| <APILink fn="mlflow.genai.scorers.Guidelines">Guidelines</APILink>                         | Does the response adhere to provided guidelines?              | Yes\*                  | No                    |
| <APILink fn="mlflow.genai.scorers.ExpectationsGuidelines">ExpectationsGuidelines</APILink> | Does the response meet specific expectations and guidelines?  | Yes\*                  | No                    |
| <APILink fn="mlflow.genai.scorers.Safety">Safety</APILink>                                 | Does the app's response avoid harmful or toxic content?       | No                     | No                    |
| <APILink fn="mlflow.genai.scorers.Equivalence">Equivalence</APILink>                       | Is the app's response equivalent to the expected output?      | Yes                    | No                    |
| <APILink fn="mlflow.genai.scorers.RetrievalGroundedness">RetrievalGroundedness</APILink>   | Is the app's response grounded in retrieved information?      | No                     | ⚠️ **Trace Required** |
| <APILink fn="mlflow.genai.scorers.RetrievalRelevance">RetrievalRelevance</APILink>         | Are retrieved documents relevant to the user's request?       | No                     | ⚠️ **Trace Required** |
| <APILink fn="mlflow.genai.scorers.RetrievalSufficiency">RetrievalSufficiency</APILink>     | Do retrieved documents contain all necessary information?     | Yes                    | ⚠️ **Trace Required** |

\*Can extract expectations from trace assessments if available.

\*\*Indicates experimental features that may change in future releases.

### Multi-Turn Scorers

Multi-turn scorers evaluate entire conversation sessions rather than individual turns. They require traces with session IDs and are experimental in MLflow 3.7.0.

| Scorer                                                                                                             | What does it evaluate?                                                     | Requires Session? |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ----------------- |
| <APILink fn="mlflow.genai.scorers.ConversationCompleteness">ConversationCompleteness</APILink>\*\*                 | Does the agent address all user questions throughout the conversation?     | Yes               |
| <APILink fn="mlflow.genai.scorers.ConversationalRoleAdherence">ConversationalRoleAdherence</APILink>\*\*           | Does the assistant maintain its assigned role throughout the conversation? | Yes               |
| <APILink fn="mlflow.genai.scorers.ConversationalSafety">ConversationalSafety</APILink>\*\*                         | Are the assistant's responses safe and free of harmful content?            | Yes               |
| <APILink fn="mlflow.genai.scorers.ConversationalToolCallEfficiency">ConversationalToolCallEfficiency</APILink>\*\* | Was tool usage across the conversation efficient and appropriate?          | Yes               |
| <APILink fn="mlflow.genai.scorers.KnowledgeRetention">KnowledgeRetention</APILink>\*\*                             | Does the assistant correctly retain information from earlier user inputs?  | Yes               |
| <APILink fn="mlflow.genai.scorers.UserFrustration">UserFrustration</APILink>\*\*                                   | Is the user frustrated? Was the frustration resolved?                      | Yes               |

:::info Multi-Turn Evaluation Requirements
Multi-turn scorers require:

1. **Session IDs**: Traces must have `mlflow.trace.session` metadata
2. **List or DataFrame input**: Currently only supports pre-collected traces (no `predict_fn` support yet)

See the [Evaluate Conversations](#evaluate-conversations) section below for detailed usage examples.
:::

:::note Availability
Safety and RetrievalRelevance scorers are currently only available in [Databricks managed MLflow](https://docs.databricks.com/mlflow3/genai/eval-monitor/) and will be open-sourced soon.
:::

## Using Traces with Built-in Scorers

All built-in scorers, such as Guidelines, RelevanceToQuery, Safety, Correctness, and ExpectationsGuidelines, can extract inputs and outputs directly from traces:

```python
from mlflow.genai.scorers import Correctness

trace = mlflow.get_trace("<your-trace-id>")
scorer = Correctness()

# Extracts inputs/outputs from trace automatically
result = scorer(trace=trace)

# Override specific fields as needed
result = scorer(trace=trace, expectations={"expected_facts": ["Custom fact"]})
```

### Automatic Fallback for Complex Traces

For complex traces or those that do not contain inputs and outputs in the root span, the scorer will use tool calling to provide the trace information to an LLM judge.

:::warning[Retrieval Scorers Require Traces]

**Retrieval scorers will NOT work with static pandas DataFrames** that only contain inputs/outputs/expectations fields.

These scorers require:

1. **Active traces** with spans of type `RETRIEVER`
2. Either a `predict_fn` that generates traces during evaluation, OR pre-collected traces in your dataset

**Common Error:** If you're trying to use retrieval scorers with a static dataset and getting errors about missing traces or RETRIEVER spans, you need to either:

- Switch to scorers that work with static data (marked with ✅ in the table above)
- Modify your evaluation to use a `predict_fn` that generates traces
- Use <ins>[automatic tracing integration](/genai/tracing/app-instrumentation/automatic)</ins> with your application

:::

## Selecting Judge Models

MLflow supports all major LLM providers, such as OpenAI, Anthropic, Google, xAI, and more.

See [Supported Models](/genai/eval-monitor/scorers/llm-judge#supported-models) for more details.

## Output Format

Predefined LLM-based scorers in MLflow return structured assessments with three key components:

- **Score**: Binary output (`yes`/`no`) renders as <div className="inline-flex rounded-sm bg-green-100 px-2 py-1 text-sm text-green-600">Pass</div> or <div className="inline-flex rounded-sm bg-red-100 px-2 py-1 text-sm text-red-800">Fail</div> in the UI.
- **Rationale**: Detailed explanation of why the judge made its decision
- **Source**: Metadata about the evaluation source

```
score: "yes"  # or "no"
rationale: "The response accurately addresses the user's question about machine learning concepts, providing clear definitions and relevant examples. The information is factually correct and well-structured."
source: AssessmentSource(
    source_type="LLM_JUDGE",
    source_id="openai:/gpt-4o-mini"
)
```

:::info Why Binary Scores?
Binary scoring provides clearer, more consistent evaluations compared to numeric scales (1-5). Research shows that LLMs produce more reliable judgments when asked to make binary decisions rather than rating on a scale. Binary outputs also simplify threshold-based decision making in production systems.
:::

## Evaluate Conversations

Multi-turn scorers evaluate entire conversation sessions rather than individual turns. For detailed information on how to use conversation evaluation, including setup, examples, and best practices, see the [Evaluate Conversations](/genai/eval-monitor/running-evaluation/multi-turn) guide.

## Next Steps

<TilesGrid>
  <TileCard
    icon={Hammer}
    title="Guidelines Scorer"
    description="Learn how to use the Guidelines scorer to evaluate responses against custom criteria"
    href="/genai/eval-monitor/scorers/llm-judge/guidelines"
  />
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
</TilesGrid>
```

--------------------------------------------------------------------------------

---[FILE: prompt.mdx]---
Location: mlflow-master/docs/docs/genai/eval-monitor/scorers/llm-judge/prompt.mdx

```text
import { APILink } from "@site/src/components/APILink";
import ImageBox from "@site/src/components/ImageBox";
import TileCard from '@site/src/components/TileCard';
import TilesGrid from '@site/src/components/TilesGrid';
import { Bot, BookOpen, MessageSquare } from "lucide-react";

# Bring Your Own Prompts

:::note[Recommendation: Use make_judge Instead]
The `custom_prompt_judge` API is being phased out. We strongly recommend using the <APILink fn="mlflow.genai.judges.make_judge">make_judge</APILink> API instead, which provides:

- More flexible template-based instructions
- Better version control and collaboration features
- Support for both field-based and Agent-as-a-Judge evaluation
- Alignment capabilities with human feedback

See the [make_judge documentation](/genai/eval-monitor/scorers/llm-judge/make-judge) for migration guidance.
:::

The <APILink fn="mlflow.genai.judges.custom_prompt_judge">custom_prompt_judge</APILink> API is designed to help you quickly and easily create LLM scorers when you need full control over the judge's prompt or need to return multiple output values beyond "pass" / "fail", for example, "great", "ok", "bad".

You provide a prompt template that has placeholders for specific fields in your app's trace and define the output choices the judge can select. The LLM judge model uses these inputs to select the best output choice and provides a rationale for its selection.

:::tip

We recommend starting with <ins>[guidelines-based judges](/genai/eval-monitor/scorers/llm-judge/guidelines)</ins> and only using prompt-based judges if you need more control or can't write your evaluation criteria as pass/fail guidelines. Guidelines-based judges have the distinct advantage of being easy to explain to business stakeholders and can often be directly written by domain experts.

:::

## Example Usage

```python
from mlflow.genai.judges import custom_prompt_judge
from mlflow.genai.scorers import scorer


issue_resolution_prompt = """
Evaluate the entire conversation between a customer and an LLM-based agent. Determine if the issue was resolved in the conversation.

You must choose one of the following categories.

[[fully_resolved]]: The response directly and comprehensively addresses the user's question or problem, providing a clear solution or answer. No further immediate action seems required from the user on the same core issue.
[[partially_resolved]]: The response offers some help or relevant information but doesn't completely solve the problem or answer the question. It might provide initial steps, require more information from the user, or address only a part of a multi-faceted query.
[[needs_follow_up]]: The response does not adequately address the user's query, misunderstands the core issue, provides unhelpful or incorrect information, or inappropriately deflects the question. The user will likely need to re-engage or seek further assistance.

Conversation to evaluate: {{conversation}}
"""


# Define a custom scorer that wraps the custom prompt judge to check if the issue was resolved
@scorer
def is_issue_resolved(inputs, outputs):
    issue_judge = custom_prompt_judge(
        name="issue_resolution",
        prompt_template=issue_resolution_prompt,
        # Optionally map the categories to numeric values for ease
        # of aggregation and comparison. When not provided, the judge
        # directly returns the choice value as a string.
        numeric_values={
            "fully_resolved": 1,
            "partially_resolved": 0.5,
            "needs_follow_up": 0,
        },
    )

    # Pass values for the placeholders ({{conversation}}) as kwargs
    conversation = inputs["messages"] + outputs["messages"]
    return issue_judge(conversation=conversation)
```

## Prompt requirements

The prompt template for the judge must have:

- Placeholders for input values with **double curly braces**, e.g., `{{conversation}}`.
- Choices for the judge to select from as output, enclosed in **square brackets**, e.g., `[[fully_resolved]]`. The choice name can contain alphanumeric characters and underscores.

:::tip Handling Parsing Errors

MLflow uses raw prompt-based instructions for handling structured outputs to make the API generic to all LLM providers. This may not be strict enough to enforce structured outputs in all cases. If you see output parsing errors frequently, consider using <ins>[code-based custom scorers](/genai/eval-monitor/scorers/custom)</ins> and invoke the specific structured output API for the LLM provider you are using to get more reliable results.

:::

## Maintaining Your Prompt

Writing good prompts for LLM judges requires iterative testing and refinement. [MLflow Prompt Registry](/genai/prompt-registry) is a great tool to help you manage and version control your prompts and share them with your team.

```python
from mlflow.genai import register_prompt

register_prompt(
    name="issue_resolution",
    template=issue_resolution_prompt,
)
```

<ImageBox src="/images/mlflow-3/eval-monitor/scorers/prompt-registry.png" alt="Prompt Registry" />

## Selecting Judge Models

MLflow supports all major LLM providers, such as OpenAI, Anthropic, Google, xAI, and more. See [Supported Models](/genai/eval-monitor/scorers/llm-judge#supported-models) for more details.

```python
from mlflow.genai.judges import custom_prompt_judge

custom_prompt_judge(
    name="is_issue_resolved",
    prompt_template=issue_resolution_prompt,
    model="anthropic:/claude-3-opus",
)
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
    icon={BookOpen}
    title="Prompt Registry"
    description="Version control and manage your judge prompts with MLflow Prompt Registry"
    href="/genai/prompt-registry"
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
