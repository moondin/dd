---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 123
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 123 of 991)

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

---[FILE: rewrite-prompts.mdx]---
Location: mlflow-master/docs/docs/genai/prompt-registry/rewrite-prompts.mdx

```text
---
sidebar_position: 6
sidebar_label: Auto-rewrite Prompts for New Models 🆕
---

import { APILink } from "@site/src/components/APILink";
import { CardGroup, Card } from "@site/src/components/Card";

# Auto-rewrite Prompts for New Models (Experimental)

When migrating to a new language model, you often discover that your carefully crafted prompts don't work as well with the new model. MLflow's <APILink fn="mlflow.genai.optimize_prompts" /> API helps you **automatically rewrite prompts** to maintain output quality when switching models, using your existing application's outputs as training data.

:::tip Key Benefits

- **Model Migration**: Seamlessly switch between language models while maintaining output consistency
- **Automatic Optimization**: Automatically rewrites prompts based on your existing data
- **No Ground Truth Requirement**: No human labeling is required if you optimize prompts based on the existing outputs
- **Trace-Aware**: Leverages MLflow tracing to understand prompt usage patterns
- **Flexible**: Works with any function that uses MLflow Prompt Registry

:::

:::note[Version Requirements]
The `optimize_prompts` API requires **MLflow >= 3.5.0**.
:::

![Model Migration Workflow](/images/model_migration_workflow.svg)

### Example: Simple Prompt → Optimized Prompt

<CardGroup cols={2}>
<Card style={{ justifyContent: 'flex-start' }}>

**Before Optimization:**

```text
Classify the sentiment. Answer 'positive'
or 'negative' or 'neutral'.

Text: {{text}}
```

</Card>
<Card style={{ justifyContent: 'flex-start' }}>

**After Optimization:**

```text
Classify the sentiment of the provided text.
Your response must be one of the following:
- 'positive'
- 'negative'
- 'neutral'

Ensure your response is lowercase and contains
only one of these three words.

Text: {{text}}

Guidelines:
- 'positive': The text expresses satisfaction,
  happiness, or approval
- 'negative': The text expresses dissatisfaction,
  anger, or disapproval
- 'neutral': The text is factual or balanced
  without strong emotion

Your response must match this exact format with
no additional explanation.
```

</Card>
</CardGroup>

## When to Use Prompt Rewriting

This approach is ideal when:

- **Downgrading Models**: Moving from `gpt-5` → `gpt-4o-mini` to reduce costs
- **Switching Providers**: Changing from OpenAI to Anthropic or vice versa
- **Performance Optimization**: Moving to faster models while maintaining quality
- **You Have Existing Outputs**: Your current system already produces good results

## Quick Start: Model Migration Workflow

Here's a complete example of migrating from `gpt-5` to `gpt-4o-mini` while maintaining output consistency:

### Step 1: Capture Outputs from Original Model

First, collect outputs from your existing model using MLflow tracing:

```python
import mlflow
import openai
from mlflow.genai.optimize import GepaPromptOptimizer
from mlflow.genai.datasets import create_dataset
from mlflow.genai.scorers import Equivalence

# Register your current prompt
prompt = mlflow.genai.register_prompt(
    name="sentiment",
    template="""Classify the sentiment. Answer 'positive' or 'negative' or 'neutral'.
Text: {{text}}""",
)


# Define your prediction function using the original model and base prompt
@mlflow.trace
def predict_fn_base_model(text: str) -> str:
    completion = openai.OpenAI().chat.completions.create(
        model="gpt-5",  # Original model
        messages=[{"role": "user", "content": prompt.format(text=text)}],
    )
    return completion.choices[0].message.content.lower()


# Example inputs - each record contains an "inputs" dict with the function's input parameters
inputs = [
    {
        "inputs": {
            "text": "This movie was absolutely fantastic! I loved every minute of it."
        }
    },
    {"inputs": {"text": "The service was terrible and the food arrived cold."}},
    {"inputs": {"text": "It was okay, nothing special but not bad either."}},
    {
        "inputs": {
            "text": "I'm so disappointed with this purchase. Complete waste of money."
        }
    },
    {"inputs": {"text": "Best experience ever! Highly recommend to everyone."}},
    {"inputs": {"text": "The product works as described. No complaints."}},
    {"inputs": {"text": "I can't believe how amazing this turned out to be!"}},
    {"inputs": {"text": "Worst customer support I've ever dealt with."}},
    {"inputs": {"text": "It's fine for the price. Gets the job done."}},
    {"inputs": {"text": "This exceeded all my expectations. Truly wonderful!"}},
]

# Collect outputs from original model
with mlflow.start_run() as run:
    for record in inputs:
        predict_fn_base_model(**record["inputs"])
```

### Step 2: Create Training Dataset from Traces

Convert the traced outputs into a training dataset:

```python
# Create dataset
dataset = create_dataset(name="sentiment_migration_dataset")

# Retrieve traces from the run
traces = mlflow.search_traces(return_type="list", run_id=run.info.run_id)

# Merge traces into dataset
dataset.merge_records(traces)
```

This automatically creates a dataset with:

- `inputs`: The input variables (`text` in this case)
- `outputs`: The actual outputs from your original model (`gpt-5`)

You can view the created dataset in the MLflow UI by navigating to:

1. **Experiments** tab → Select your experiment
2. **Evaluations** tab → Select the "Datasets" tab on the left sidebar
3. **Dataset** tab → Inspect the input/output pairs

The dataset view shows all the inputs and outputs collected from your traces, making it easy to verify the training data before optimization.

![](/images/evaluation_dataset_ui.png)

### Step 3: Switch Model

Switch your LM to the target model:

```python
# Define function using target model
@mlflow.trace
def predict_fn(text: str) -> str:
    completion = openai.OpenAI().chat.completions.create(
        model="gpt-4o-mini",  # Target model
        messages=[{"role": "user", "content": prompt.format(text=text)}],
        temperature=0,
    )
    return completion.choices[0].message.content.lower()
```

You might notice the target model doesn't follow the format as consistently as the original model.

### Step 4: Optimize Prompts for Target Model

Use the collected dataset to optimize prompts for the target model:

```python
# Optimize prompts for the target model
result = mlflow.genai.optimize_prompts(
    predict_fn=predict_fn,
    train_data=dataset,
    prompt_uris=[prompt.uri],
    optimizer=GepaPromptOptimizer(reflection_model="openai:/gpt-5"),
    scorers=[Equivalence(model="openai:/gpt-5")],
)

# View the optimized prompt
optimized_prompt = result.optimized_prompts[0]
print(f"Optimized template: {optimized_prompt.template}")
```

The optimized prompt will include additional instructions to help `gpt-4o-mini` match the behavior of `gpt-5`:

```
Optimized template:
Classify the sentiment of the provided text. Your response must be one of the following:
- 'positive'
- 'negative'
- 'neutral'

Ensure your response is lowercase and contains only one of these three words.

Text: {{text}}

Guidelines:
- 'positive': The text expresses satisfaction, happiness, or approval
- 'negative': The text expresses dissatisfaction, anger, or disapproval
- 'neutral': The text is factual or balanced without strong emotion

Your response must match this exact format with no additional explanation.
```

### Step 5: Use Optimized Prompt

Deploy the optimized prompt in your application:

```python
# Load the optimized prompt
optimized = mlflow.genai.load_prompt(optimized_prompt.uri)


# Use in production
@mlflow.trace
def predict_fn_optimized(text: str) -> str:
    completion = openai.OpenAI().chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": optimized.format(text=text)}],
        temperature=0,
    )
    return completion.choices[0].message.content.lower()


# Test with new inputs
test_result = predict_fn_optimized("This product is amazing!")
print(test_result)  # Output: positive
```

## Best Practices

### 1. Collect Sufficient Data

For best results, collect outputs from at least 20-50 diverse examples:

```python
# ✅ Good: Diverse examples
inputs = [
    {"inputs": {"text": "Great product!"}},
    {
        "inputs": {
            "text": "The delivery was delayed by three days and the packaging was damaged. The product itself works fine but the experience was disappointing overall."
        }
    },
    {
        "inputs": {
            "text": "It meets the basic requirements. Nothing more, nothing less."
        }
    },
    # ... more varied examples
]

# ❌ Poor: Too few, too similar
inputs = [
    {"inputs": {"text": "Good"}},
    {"inputs": {"text": "Bad"}},
]
```

### 2. Use Representative Examples

Include edge cases and challenging inputs:

```python
inputs = [
    {"inputs": {"text": "Absolutely fantastic!"}},  # Clear positive
    {"inputs": {"text": "It's not bad, I guess."}},  # Ambiguous
    {"inputs": {"text": "The food was good but service terrible."}},  # Mixed sentiment
]
```

### 3. Verify Results

Always test optimized prompts using <APILink fn="mlflow.genai.evaluate" /> before production deployment.

```python
# Evaluate optimized prompt
results = mlflow.genai.evaluate(
    data=test_dataset,
    predict_fn=predict_fn_optimized,
    scorers=[accuracy_scorer, format_scorer],
)

print(f"Accuracy: {results.metrics['accuracy']}")
print(f"Format compliance: {results.metrics['format_scorer']}")
```

## See Also

- [Optimize Prompts](/genai/prompt-registry/optimize-prompts): General prompt optimization guide
- [Create and Edit Prompts](/genai/prompt-registry/create-and-edit-prompts): Prompt Registry basics
- [Evaluate Prompts](/genai/eval-monitor/running-evaluation/prompts): Evaluate prompt performance
- [MLflow Tracing](/genai/tracing/): Understanding MLflow tracing
```

--------------------------------------------------------------------------------

---[FILE: structured-output.mdx]---
Location: mlflow-master/docs/docs/genai/prompt-registry/structured-output.mdx

```text
---
title: Structured Output
description: Learn how to define structured output schemas for your prompts to ensure consistent and validated responses from language models.
---

# Structured Output

MLflow Prompt Registry supports defining structured output schemas for your prompts, ensuring that language model responses follow a consistent format and can be validated. This feature is particularly useful for applications that need to parse and process model outputs programmatically.

## Overview

Structured output allows you to:

- **Define expected response formats** using Pydantic models or JSON schemas
- **Validate model responses** against your defined schema
- **Ensure consistency** across different model calls
- **Improve integration** with downstream applications
- **Enable type safety** in your GenAI applications

:::note
**Important**: The `response_format` parameter is used for **tracking and documentation purposes** rather than direct runtime enforcement. MLflow stores this information as metadata to help you understand the expected output structure of your prompts, but it does not automatically validate or enforce the format during model execution. You are responsible for implementing the actual validation and enforcement in your application code.
:::

## Basic Usage

### Using Pydantic Models

The most common way to define structured output is using Pydantic models:

```python
import mlflow
from pydantic import BaseModel
from typing import List


class SummaryResponse(BaseModel):
    summary: str
    key_points: List[str]
    word_count: int


# Register prompt with structured output
prompt = mlflow.genai.register_prompt(
    name="summarization-prompt",
    template="Summarize the following text in {{ num_sentences }} sentences: {{ text }}",
    response_format=SummaryResponse,
    commit_message="Added structured output for summarization",
    tags={"task": "summarization", "structured": "true"},
)
```

### Using JSON Schema

You can also define response formats using JSON schema dictionaries:

```python
import mlflow

# Define response format as JSON schema
response_schema = {
    "type": "object",
    "properties": {
        "answer": {"type": "string", "description": "The main answer"},
        "confidence": {"type": "number", "description": "Confidence score (0-1)"},
        "sources": {
            "type": "array",
            "items": {"type": "string"},
            "description": "List of source references",
        },
    },
    "required": ["answer", "confidence"],
}

# Register prompt with JSON schema
prompt = mlflow.genai.register_prompt(
    name="qa-prompt",
    template="Answer the following question: {{ question }}",
    response_format=response_schema,
    commit_message="Added structured output for Q&A",
    tags={"task": "qa", "structured": "true"},
)
```

## Advanced Examples

### Complex Response Formats

For more complex applications, you can define nested structures:

```python
import mlflow
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class AnalysisResult(BaseModel):
    sentiment: str
    confidence: float
    entities: List[str]
    summary: str


class DocumentAnalysis(BaseModel):
    document_id: str
    analysis: AnalysisResult
    processed_at: datetime
    metadata: Optional[dict] = None


# Register prompt with complex structured output
prompt = mlflow.genai.register_prompt(
    name="document-analyzer",
    template="Analyze the following document: {{ document_text }}",
    response_format=DocumentAnalysis,
    commit_message="Added comprehensive document analysis output",
    tags={"task": "analysis", "complex": "true"},
)
```

### Chat Prompts with Structured Output

Chat prompts can also use structured output formats:

```python
import mlflow
from pydantic import BaseModel


class ChatResponse(BaseModel):
    response: str
    tone: str
    suggestions: List[str]


# Chat prompt with structured output
chat_template = [
    {"role": "system", "content": "You are a helpful {{ style }} assistant."},
    {"role": "user", "content": "{{ question }}"},
]

prompt = mlflow.genai.register_prompt(
    name="assistant-chat",
    template=chat_template,
    response_format=ChatResponse,
    commit_message="Added structured output for chat responses",
    tags={"type": "chat", "structured": "true"},
)
```

## Loading and Using Structured Prompts

When you load a prompt with structured output, you can access the response format for tracking and documentation purposes:

```python
# Load the prompt
prompt = mlflow.genai.load_prompt("prompts:/summarization-prompt/1")

# Check if it has structured output (for tracking purposes)
if prompt.response_format:
    print(f"Response format: {prompt.response_format}")

# Format the prompt
formatted_text = prompt.format(num_sentences=3, text="Your content here...")

# Use with a language model that supports structured output
# Note: You need to implement validation against your defined schema
```

## Integration with Language Models

### OpenAI Integration

```python
import openai

client = openai.OpenAI()

# Load prompt with structured output
prompt = mlflow.genai.load_prompt("prompts:/summarization-prompt/1")

# Use with OpenAI's response_format parameter
response = client.chat.completions.create(
    model="gpt-4.1",
    messages=[
        {"role": "user", "content": prompt.format(num_sentences=3, text="Your text")}
    ],
    response_format=prompt.response_format,  # OpenAI's structured output
)

# Get structured output
import json

result = json.loads(response.choices[0].message.content)
```

### LangChain Integration

```python
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from pydantic import BaseModel

# Load prompt with structured output
prompt = mlflow.genai.load_prompt("prompts:/qa-prompt/1")

# Create LangChain prompt template
langchain_prompt = PromptTemplate.from_template(prompt.template)

# Use with LangChain's structured output
llm = ChatOpenAI(model="gpt-4")
chain = langchain_prompt | llm.with_structured_output(prompt.response_format)

# Execute the chain
result = chain.invoke({"question": "What is MLflow?"})
# result will be a validated Pydantic model instance
```

## Key Takeaways

- **Structured output** is used for **tracking and documentation purposes** to define expected response formats
- **Pydantic models** provide type safety and validation schemas for your response formats
- **JSON schemas** offer flexibility for complex nested structures
- **Integration** with popular frameworks like OpenAI and LangChain is straightforward
- **Manual validation** is required in your application code - MLflow does not enforce the format at runtime

## Next Steps

- **[Create and Edit Prompts](/genai/prompt-registry/create-and-edit-prompts)** to learn the basics of prompt management
- **[Use Prompts in Apps](/genai/prompt-registry/use-prompts-in-apps)** to see how to integrate prompts into your applications
- **[Evaluate Prompts](/genai/prompt-registry/evaluate-prompts)** to learn how to assess prompt performance

Structured output is a powerful feature that can significantly improve the reliability and maintainability of your GenAI applications by ensuring consistent data formats and enabling better integration with downstream systems.
```

--------------------------------------------------------------------------------

---[FILE: use-prompts-in-apps.mdx]---
Location: mlflow-master/docs/docs/genai/prompt-registry/use-prompts-in-apps.mdx

```text
---
title: Use Prompts in Apps
description: Learn how to integrate prompts from the MLflow Prompt Registry into your applications and link them to MLflow Models for end-to-end lineage.
---

# Use Prompts in Apps

Once you have created and versioned your prompts in the MLflow Prompt Registry, the next crucial step is to integrate them into your GenAI applications. This page guides you on how to load prompts, bind variables, handle versioning, and ensure complete lineage by linking prompt versions to your logged MLflow Models.

## Loading Prompts from the Registry

The primary way to access a registered prompt in your application code is by using the `mlflow.genai.load_prompt()` function. This function retrieves a specific prompt version (or a version pointed to by an alias) from the registry.

It uses a special URI format: `prompts:/<prompt_name>/<version_or_alias>`.

- `<prompt_name>`: The unique name of the prompt in the registry.
- `<version_or_alias>`: Can be a specific version number (e.g., `1`, `2`) or an alias (e.g., `production`, `latest-dev`).

```python
import mlflow

prompt_name = "my-sdk-prompt"

# Load the latest version of the prompt
mlflow.genai.load_prompt(name_or_uri=f"prompts:/{prompt_name}@latest")

# Load by specific version (assuming version 1 exists)
mlflow.genai.load_prompt(name_or_uri=f"prompts:/{prompt_name}/1")

# Load by alias (assuming an alias 'staging' points to a version of a prompt)
mlflow.genai.load_prompt(name_or_uri=f"prompts:/{prompt_name}@staging")
```

## Formatting Prompts with Variables

Once you have loaded a prompt object (which is a `Prompt` instance), you can populate its template variables using the `prompt.format()` method. This method takes keyword arguments where the keys match the variable names in your prompt template (without the `{{ }}` braces).

```python
import mlflow

# define a prompt template
prompt_template = """\
You are an expert AI assistant. Answer the user's question with clarity, accuracy, and conciseness.

## Question:
{{question}}

## Guidelines:
- Keep responses factual and to the point.
- If relevant, provide examples or step-by-step instructions.
- If the question is ambiguous, clarify before answering.

Respond below:
"""
prompt = mlflow.genai.register_prompt(
    name="ai_assistant_prompt",
    template=prompt_template,
    commit_message="Initial version of AI assistant",
)

question = "What is MLflow?"
response = (
    client.chat.completions.create(
        messages=[{"role": "user", "content": prompt.format(question=question)}],
        model="gpt-4o-mini",
        temperature=0.1,
        max_tokens=2000,
    )
    .choices[0]
    .message.content
)
```

## Using Prompts with Other Frameworks (LangChain, LlamaIndex)

MLflow prompts use the `{{variable}}` double-brace syntax for templating. Some other popular frameworks, like LangChain and LlamaIndex, often expect a single-brace syntax (e.g., `{variable}`). To facilitate seamless integration, the MLflow `Prompt` object provides the `prompt.to_single_brace_format()` method. This method returns the prompt template string converted to a single-brace format, ready to be used by these frameworks.

```python
import mlflow
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

# Load registered prompt
prompt = mlflow.genai.load_prompt("prompts:/summarization-prompt/2")

# Create LangChain prompt object
langchain_prompt = ChatPromptTemplate.from_messages(
    [
        (
            # IMPORTANT: Convert prompt template from double to single curly braces format
            "system",
            prompt.to_single_brace_format(),
        ),
        ("placeholder", "{messages}"),
    ]
)

# Define the LangChain chain
llm = ChatOpenAI()
chain = langchain_prompt | llm

# Invoke the chain
response = chain.invoke({"num_sentences": 1, "sentences": "This is a test sentence."})
print(response)
```

## Linking Prompts to Logged Models for Full Lineage

For complete reproducibility and traceability, it is crucial to log which specific prompt versions your application (or model) uses. When you log your GenAI application as an MLflow Model (e.g., using `mlflow.pyfunc.log_model()`, `mlflow.langchain.log_model()`, etc.), you should include information about the prompts from the registry that it utilizes.

MLflow is designed to facilitate this. When a model is logged, and that model's code loads prompts using the `prompts:/` URI via `mlflow.genai.load_prompt()`, MLflow can automatically record these prompt dependencies as part of the logged model's metadata.

**Benefits of this linkage:**

- **Reproducibility**: Knowing the exact prompt versions used by a model version allows you to reproduce its behavior precisely.
- **Debugging**: If a model version starts behaving unexpectedly, you can easily check if a change in an underlying prompt (even if updated via an alias) is the cause.
- **Auditing and Governance**: Maintain a clear record of which prompts were used for any given model version.
- **Impact Analysis**: Understand which models might be affected if a particular prompt version is found to be problematic.
```

--------------------------------------------------------------------------------

---[FILE: langchain-optimization.mdx]---
Location: mlflow-master/docs/docs/genai/prompt-registry/optimize-prompts/langchain-optimization.mdx

```text
---
sidebar_position: 7
sidebar_label: LangChain Optimization
---

import { APILink } from "@site/src/components/APILink";
import useBaseUrl from '@docusaurus/useBaseUrl';

# Optimizing Prompts for LangChain

<p style={{display: 'flex', justifyContent: 'center', margin: '1em 0'}}>
  <img src={useBaseUrl("/images/logos/langchain-logo.png")} alt="LangChain Logo" style={{width: 300, objectFit: 'contain'}} />
</p>

This guide demonstrates how to leverage <APILink fn="mlflow.genai.optimize_prompts" /> alongside [LangChain](https://python.langchain.com/) to enhance your chain's prompts automatically. The <APILink fn="mlflow.genai.optimize_prompts" /> API is framework-agnostic, enabling you to perform end-to-end prompt optimization of your chains from any framework using state-of-the-art techniques. For more information about the API, please visit [Optimize Prompts](/genai/prompt-registry/optimize-prompts).

## Prerequisites

```bash
pip install -U langchain langchain-openai mlflow gepa litellm
```

Set your OpenAI API key:

```bash
export OPENAI_API_KEY="your-api-key"
```

Set tracking server and MLflow experiment:

```python
import mlflow

mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("LangChain Optimization")
```

## Basic Example

Here's a complete example of optimizing a translation chain. The example shows how easy it is to optimize prompts in a LangChain workflow with minimal changes.

```python
import mlflow
from mlflow.genai.scorers import Correctness
from mlflow.genai.optimize.optimizers import GepaPromptOptimizer
from langchain.agents import create_agent

# Step 1: Register your initial prompt
user_prompt = mlflow.genai.register_prompt(
    name="translation-prompt",
    template="Translate the following text from {{input_language}} to {{output_language}}: {{text}}",
)
system_prompt = mlflow.genai.register_prompt(
    name="system-prompt",
    template="You are a helpful assistant",
)


# Step 2: Create a prediction function
def predict_fn(input_language, output_language, text):
    # Load prompt from registry
    user_prompt = mlflow.genai.load_prompt("prompts:/translation-prompt@latest")
    system_prompt = mlflow.genai.load_prompt("prompts:/system-prompt@latest")

    agent = create_agent(
        model="gpt-4o-mini",
        system_prompt=system_prompt.template,
    )

    # Run the agent
    response = agent.invoke(
        {
            "messages": [
                {
                    "role": "user",
                    "content": user_prompt.format(
                        input_language=input_language,
                        output_language=output_language,
                        text=text,
                    ),
                }
            ]
        }
    )

    return response["messages"][-1].content


# Step 3: Prepare training data
dataset = [
    {
        "inputs": {
            "input_language": "English",
            "output_language": "French",
            "text": "Hello, how are you?",
        },
        "expectations": {"expected_response": "Bonjour, comment allez-vous?"},
    },
    {
        "inputs": {
            "input_language": "English",
            "output_language": "Spanish",
            "text": "Good morning",
        },
        "expectations": {"expected_response": "Buenos días"},
    },
    {
        "inputs": {
            "input_language": "English",
            "output_language": "German",
            "text": "Thank you very much",
        },
        "expectations": {"expected_response": "Vielen Dank"},
    },
    # more data...
]

# Step 4: Optimize the prompt
result = mlflow.genai.optimize_prompts(
    predict_fn=predict_fn,
    train_data=dataset,
    prompt_uris=[user_prompt.uri],
    optimizer=GepaPromptOptimizer(reflection_model="openai:/gpt-5"),
    scorers=[Correctness(model="openai:/gpt-5")],
)

# Step 5: Use the optimized prompt
optimized_user_prompt = result.optimized_prompts[0]
print(f"Optimized prompt URI: {optimized_user_prompt.uri}")
print(f"Optimized template: {optimized_user_prompt.template}")

# Since your chain already uses @latest, it will automatically use the optimized prompt
predict_fn(
    input_language="English",
    output_language="Japanese",
    text="Welcome to MLflow",
)
```
```

--------------------------------------------------------------------------------

---[FILE: langgraph-optimization.mdx]---
Location: mlflow-master/docs/docs/genai/prompt-registry/optimize-prompts/langgraph-optimization.mdx

```text
---
sidebar_position: 8
sidebar_label: LangGraph Optimization
---

import { APILink } from "@site/src/components/APILink";
import useBaseUrl from '@docusaurus/useBaseUrl';

# Optimizing Prompts for LangGraph

<p style={{display: 'flex', justifyContent: 'center', margin: '1em 0'}}>
  <img src={useBaseUrl("/images/logos/langgraph-logo.png")} alt="LangGraph Logo" style={{width: 300, objectFit: 'contain'}} />
</p>

This guide demonstrates how to leverage <APILink fn="mlflow.genai.optimize_prompts" /> alongside [LangGraph](https://langchain-ai.github.io/langgraph/) to enhance your agent's prompts automatically. The <APILink fn="mlflow.genai.optimize_prompts" /> API is framework-agnostic, enabling you to perform end-to-end prompt optimization of your graphs from any framework using state-of-the-art techniques. For more information about the API, please visit [Optimize Prompts](/genai/prompt-registry/optimize-prompts).

## Prerequisites

```bash
pip install -U langgraph langchain langchain-openai mlflow gepa litellm
```

Set your OpenAI API key:

```bash
export OPENAI_API_KEY="your-api-key"
```

Set tracking server and MLflow experiment:

```python
import mlflow

mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("LangGraph Optimization")
```

## Basic Example

Here's a complete example of optimizing a customer support agent built with LangGraph. This example demonstrates how to optimize system and user prompts in a stateful graph workflow, showing the minimal code changes needed to integrate prompt optimization into your LangGraph applications.

```python
import mlflow
from mlflow.genai.scorers import Correctness
from mlflow.genai.optimize.optimizers import GepaPromptOptimizer
from langgraph.graph import StateGraph, START, END
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from typing_extensions import TypedDict, Annotated
import operator

# Step 1: Register your initial prompts
system_prompt = mlflow.genai.register_prompt(
    name="customer-support-system",
    template="You are a helpful customer support agent for an e-commerce platform. "
    "Assist customers with their questions about orders, returns, and products.",
)

user_prompt = mlflow.genai.register_prompt(
    name="customer-support-query",
    template="Customer inquiry: {{query}}",
)


# Step 2: Define state schema for LangGraph
class AgentState(TypedDict):
    messages: Annotated[list, operator.add]
    query: str
    llm_calls: int


# Step 3: Create a prediction function that uses LangGraph
def predict_fn(query):
    # Load prompts from registry
    system_prompt = mlflow.genai.load_prompt("prompts:/customer-support-system@latest")
    user_prompt = mlflow.genai.load_prompt("prompts:/customer-support-query@latest")

    # Initialize model
    model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

    # Define the LLM node
    def llm_node(state: AgentState):
        formatted_user_msg = user_prompt.format(query=state["query"])
        messages = [
            SystemMessage(content=system_prompt.template),
            HumanMessage(content=formatted_user_msg),
        ]
        response = model.invoke(messages)
        return {
            "messages": [response],
            "llm_calls": state.get("llm_calls", 0) + 1,
        }

    # Build the graph
    graph_builder = StateGraph(AgentState)
    graph_builder.add_node("llm_call", llm_node)
    graph_builder.add_edge(START, "llm_call")
    graph_builder.add_edge("llm_call", END)

    # Compile and run
    agent = graph_builder.compile()
    result = agent.invoke({"query": query, "messages": [], "llm_calls": 0})

    return result["messages"][-1].content


# Step 4: Prepare training data
dataset = [
    {
        "inputs": {"query": "Where is my order #12345?"},
        "expectations": {
            "expected_response": "I'd be happy to help you track your order #12345. "
            "Please check your email for a tracking link, or I can look it up for you if you provide your email address."
        },
    },
    {
        "inputs": {"query": "How do I return a defective product?"},
        "expectations": {
            "expected_response": "I'm sorry to hear your product is defective. You can initiate a return "
            "through your account's order history within 30 days of purchase. We'll send you a prepaid shipping label."
        },
    },
    {
        "inputs": {"query": "Do you have this item in blue?"},
        "expectations": {
            "expected_response": "I'd be happy to check product availability for you. "
            "Could you please provide the product name or SKU so I can verify if it's available in blue?"
        },
    },
    # more data...
]

# Step 5: Optimize the prompts
result = mlflow.genai.optimize_prompts(
    predict_fn=predict_fn,
    train_data=dataset,
    prompt_uris=[system_prompt.uri, user_prompt.uri],
    optimizer=GepaPromptOptimizer(reflection_model="openai:/gpt-4o"),
    scorers=[Correctness(model="openai:/gpt-4o")],
)

# Step 6: Use the optimized prompts
optimized_system_prompt = result.optimized_prompts[0]
optimized_user_prompt = result.optimized_prompts[1]

print(f"Optimized system prompt URI: {optimized_system_prompt.uri}")
print(f"Optimized system template: {optimized_system_prompt.template}")
print(f"Optimized user prompt URI: {optimized_user_prompt.uri}")
print(f"Optimized user template: {optimized_user_prompt.template}")

# Since your graph already uses @latest, it will automatically use the optimized prompts
predict_fn("Can I get a refund for order #67890?")
```
```

--------------------------------------------------------------------------------

---[FILE: openai-agent-optimization.mdx]---
Location: mlflow-master/docs/docs/genai/prompt-registry/optimize-prompts/openai-agent-optimization.mdx

```text
---
sidebar_position: 6
sidebar_label: OpenAI Agent Optimization
---

import { APILink } from "@site/src/components/APILink";
import useBaseUrl from '@docusaurus/useBaseUrl';

# Optimizing Prompts for OpenAI Agents

<p style={{display: 'flex', justifyContent: 'center', margin: '1em 0'}}>
  <img src={useBaseUrl("/images/logos/openai-agent-logo.png")} alt="OpenAI Agent Logo" style={{width: 300, objectFit: 'contain'}} />
</p>

This guide demonstrates how to leverage <APILink fn="mlflow.genai.optimize_prompts" /> alongside the [OpenAI Agent framework](https://github.com/openai/openai-agents-python) to enhance your agent's prompts automatically. The <APILink fn="mlflow.genai.optimize_prompts" /> API is framework-agnostic, enabling you to perform end-to-end prompt optimization of your agents from any framework using state-of-the-art techniques. For more information about the API, please visit [Optimize Prompts](/genai/prompt-registry/optimize-prompts).

## Prerequisites

```bash
pip install openai-agents mlflow gepa nest_asyncio
```

Set your OpenAI API key:

```bash
export OPENAI_API_KEY="your-api-key"
```

Set tracking server and MLflow experiment:

```python
import mlflow

mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("OpenAI Agents")
```

## Basic Example

Here's a complete example of optimizing a question-answering agent:

```python
import mlflow
from typing import Any
from agents import Agent, Runner
from mlflow.genai.optimize import GepaPromptOptimizer
from mlflow.genai.scorers import scorer

# If you're inside notebooks, please uncomment the following lines.
# import nest_asyncio
# nest_asyncio.apply()

# Step 1: Register your initial prompt
system_prompt = mlflow.genai.register_prompt(
    name="qa-agent-system-prompt",
    template="You're a helpful agent. Follow the user instruction precisely.",
)

user_prompt = mlflow.genai.register_prompt(
    name="qa-agent-user-prompt",
    template="""Answer the question based on the context provided.

Context: {{context}}
Question: {{question}}

Answer:""",
)


# Step 2: Create a prediction function
@mlflow.trace
def predict_fn(context: str, question: str) -> str:
    # Load prompt from registry
    system_prompt = mlflow.genai.load_prompt("prompts:/qa-agent-system-prompt@latest")
    user_prompt = mlflow.genai.load_prompt("prompts:/qa-agent-user-prompt@latest")

    # This is your agent
    agent = Agent(
        name="Question Answerer",
        instructions=system_prompt.template,
        model="gpt-4o-mini",
    )

    # Format the user message
    user_message = user_prompt.format(context=context, question=question)

    # Run the agent
    result = Runner.run_sync(agent, user_message)
    return result.final_output


# Step 3: Prepare training data
train_data = [
    {
        "inputs": {
            "context": "Paris is the capital of France.",
            "question": "What is the capital of France?",
        },
        "expectations": {"expected_response": "Paris"},
    },
    {
        "inputs": {
            "context": "The Eiffel Tower was completed in 1889.",
            "question": "When was the Eiffel Tower completed?",
        },
        "expectations": {"expected_response": "1889"},
    },
    # Add more examples...
]


# Step 4: Prepare scorer
@scorer
def exact_match(outputs: str, expectations: dict[str, Any]) -> bool:
    return outputs == expectations["expected_response"]


# Step 5: Optimize the prompt
result = mlflow.genai.optimize_prompts(
    predict_fn=predict_fn,
    train_data=train_data,
    prompt_uris=[system_prompt.uri, user_prompt.uri],
    optimizer=GepaPromptOptimizer(
        reflection_model="openai:/gpt-5",
        max_metric_calls=100,
    ),
    scorers=[exact_match],
)

# Step 6: Use the optimized prompt
optimized_system_prompt = result.optimized_prompts[0]
print(f"Optimized system prompt URI: {optimized_system_prompt.uri}")

# Since your agent already use @latest, it will automatically use the optimized prompts.
predict_fn(
    context="MLflow is an open-source platform for managing the machine learning lifecycle, providing tools to streamline the development, training, and deployment of models",
    question="What is MLflow",
)
```
```

--------------------------------------------------------------------------------

````
