---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 122
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 122 of 991)

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

---[FILE: optimize-prompts.mdx]---
Location: mlflow-master/docs/docs/genai/prompt-registry/optimize-prompts.mdx

```text
---
sidebar_position: 5
sidebar_label: Optimize Prompts
---

import { APILink } from "@site/src/components/APILink";
import { CardGroup, Card, SmallLogoCard } from "@site/src/components/Card";

# Optimize Prompts (Experimental)

**The simple way to continuously improve your AI agents and prompts.**

MLflow's prompt optimization lets you systematically enhance your AI applications with minimal code changes. Whether you're building with LangChain, OpenAI Agent, CrewAI, or your own custom implementation, MLflow provides a universal path from initial prototyping to steady improvement.

**Minimum rewrites, no lock-in, just better prompts.**

Currently, MLflow supports the [GEPA](https://arxiv.org/abs/2507.19457) optimization algorithm through the <APILink fn="mlflow.genai.optimize.GepaPromptOptimizer" >`GepaPromptOptimizer`</APILink>. GEPA iteratively refines prompts using LLM-driven reflection and automated feedback, leading to systematic and data-driven improvements.

:::tip Why Use MLflow Prompt Optimization?

- **Zero Framework Lock-in**: Works with ANY agent framework—LangChain, OpenAI Agent, CrewAI, or custom solutions
- **Minimal Code Changes**: Add a few lines to start optimizing; no architectural rewrites needed
- **Data-Driven Improvement**: Automatically learn from your evaluation data and custom metrics
- **Multi-Prompt Optimization**: Jointly optimize multiple prompts for complex agent workflows
- **Granular Control**: Optimize single prompts or entire multi-prompt workflows—you decide what to improve
- **Production-Ready**: Built-in version control and registry for seamless deployment
- **Extensible**: Bring your own optimization algorithms with simple base class extension

:::

:::note[Version Requirements]
The `optimize_prompts` API requires **MLflow >= 3.5.0**.
:::

## Quick Start

Here's a realistic example of optimizing a prompt for medical paper section classification:

```python
import mlflow
import openai
from mlflow.genai.optimize import GepaPromptOptimizer
from mlflow.genai.scorers import Correctness

# Register initial prompt for classifying medical paper sections
prompt = mlflow.genai.register_prompt(
    name="medical_section_classifier",
    template="Classify this medical research paper sentence into one of these sections: CONCLUSIONS, RESULTS, METHODS, OBJECTIVE, BACKGROUND.\n\nSentence: {{sentence}}",
)


# Define your prediction function
def predict_fn(sentence: str) -> str:
    prompt = mlflow.genai.load_prompt("prompts:/medical_section_classifier/1")
    completion = openai.OpenAI().chat.completions.create(
        model="gpt-5-nano",
        # load prompt template using PromptVersion.format()
        messages=[{"role": "user", "content": prompt.format(sentence=sentence)}],
    )
    return completion.choices[0].message.content


# Training data with medical paper sentences and ground truth labels
# fmt: off
raw_data = [
    ("The emergence of HIV as a chronic condition means that people living with HIV are required to take more responsibility for the self-management of their condition , including making physical , emotional and social adjustments .", "BACKGROUND"),
    ("This paper describes the design and evaluation of Positive Outlook , an online program aiming to enhance the self-management skills of gay men living with HIV .", "BACKGROUND"),
    ("This study is designed as a randomised controlled trial in which men living with HIV in Australia will be assigned to either an intervention group or usual care control group .", "METHODS"),
    ("The intervention group will participate in the online group program ` Positive Outlook ' .", "METHODS"),
    ("The program is based on self-efficacy theory and uses a self-management approach to enhance skills , confidence and abilities to manage the psychosocial issues associated with HIV in daily life .", "METHODS"),
    ("Participants will access the program for a minimum of 90 minutes per week over seven weeks .", "METHODS"),
    ("Primary outcomes are domain specific self-efficacy , HIV related quality of life , and outcomes of health education .", "METHODS"),
    ("Secondary outcomes include : depression , anxiety and stress ; general health and quality of life ; adjustment to HIV ; and social support .", "METHODS"),
    ("Data collection will take place at baseline , completion of the intervention ( or eight weeks post randomisation ) and at 12 week follow-up .", "METHODS"),
    ("Results of the Positive Outlook study will provide information regarding the effectiveness of online group programs improving health related outcomes for men living with HIV .", "CONCLUSIONS"),
    ("The aim of this study was to evaluate the efficacy , safety and complications of orbital steroid injection versus oral steroid therapy in the management of thyroid-related ophthalmopathy .", "OBJECTIVE"),
    ("A total of 29 patients suffering from thyroid ophthalmopathy were included in this study .", "METHODS"),
    ("Patients were randomized into two groups : group I included 15 patients treated with oral prednisolone and group II included 14 patients treated with peribulbar triamcinolone orbital injection .", "METHODS"),
    ("Both groups showed improvement in symptoms and in clinical evidence of inflammation with improvement of eye movement and proptosis in most cases .", "RESULTS"),
    ("Mean exophthalmometry value before treatment was 22.6 1.98 mm that decreased to 18.6 0.996 mm in group I , compared with 23 1.86 mm that decreased to 19.08 1.16 mm in group II .", "RESULTS"),
    ("There was no change in the best-corrected visual acuity in both groups .", "RESULTS"),
    ("There was an increase in body weight , blood sugar , blood pressure and gastritis in group I in 66.7 % , 33.3 % , 50 % and 75 % , respectively , compared with 0 % , 0 % , 8.3 % and 8.3 % in group II .", "RESULTS"),
    ("Orbital steroid injection for thyroid-related ophthalmopathy is effective and safe .", "CONCLUSIONS"),
    ("It eliminates the adverse reactions associated with oral corticosteroid use .", "CONCLUSIONS"),
    ("The aim of this prospective randomized study was to examine whether active counseling and more liberal oral fluid intake decrease postoperative pain , nausea and vomiting in pediatric ambulatory tonsillectomy .", "OBJECTIVE"),
]
# fmt: on

# Format dataset for optimization
dataset = [
    {
        "inputs": {"sentence": sentence},
        "expectations": {"expected_response": label},
    }
    for sentence, label in raw_data
]

# Optimize the prompt
result = mlflow.genai.optimize_prompts(
    predict_fn=predict_fn,
    train_data=dataset,
    prompt_uris=[prompt.uri],
    optimizer=GepaPromptOptimizer(
        reflection_model="openai:/gpt-5", max_metric_calls=300
    ),
    scorers=[Correctness(model="openai:/gpt-5-mini")],
)

# Use the optimized prompt
optimized_prompt = result.optimized_prompts[0]
print(f"Optimized template: {optimized_prompt.template}")
```

The API will automatically improve the prompt to better classify medical paper sections by learning from the training examples.

### Example: Simple Prompt → Optimized Prompt

<CardGroup cols={2}>
<Card style={{ justifyContent: 'flex-start' }}>

**Before Optimization:**

<div style={{ maxWidth: '100%' }}>

```text
Classify this medical research paper sentence
into one of these sections: CONCLUSIONS, RESULTS,
METHODS, OBJECTIVE, BACKGROUND.

Sentence: {{sentence}}
```

</div>

</Card>
<Card>

**After Optimization:**

<div style={{ maxWidth: '100%' }}>

```text
You are a single-sentence classifier for medical research abstracts. For each input sentence, decide which abstract section it belongs to and output exactly one label in UPPERCASE with no extra words, punctuation, or explanation.

Allowed labels: CONCLUSIONS, RESULTS, METHODS, OBJECTIVE, BACKGROUND

Input format:
- The prompt will be:
  "Classify this medical research paper sentence into one of these sections: CONCLUSIONS, RESULTS, METHODS, OBJECTIVE, BACKGROUND.

  Sentence: {{sentence}}"

Core rules:
- Use only the information in the single sentence.
- Classify by the sentence's function: context-setting vs aim vs procedure vs findings vs interpretation.
- Return exactly one uppercase label from the allowed set.

Decision guide and lexical cues:

1) RESULTS
- Reports observed findings/outcomes tied to data.
- Common cues: past-tense result verbs and outcome terms: "showed," "was/were associated with," "increased/decreased," "improved," "reduced," "significant," "p < …," "odds ratio," "risk ratio," "95% CI," percentages, rates, counts or numbers tied to effects/adverse events.
- If it explicitly states changes, associations, statistical significance, or quantified outcomes, choose RESULTS.

2) CONCLUSIONS
- Interpretation, implications, recommendations, or high-level takeaways.
- Common cues: "In conclusion," "These findings suggest/indicate," "We conclude," statements about practice/policy/clinical implications, benefit–risk judgments, feasibility statements.
- Sentences that forecast the significance/utility of the study's results ("Results will provide insight/information," "Findings will inform/guide practice") are CONCLUSIONS.
- Tie-break with RESULTS: If a sentence describes an outcome as a general claim without specific observed data/statistics, prefer CONCLUSIONS over RESULTS.

3) METHODS
- How the study was conducted: design, participants, interventions/programs, measurements/outcomes lists, timelines, procedures, or analyses.
- Common cues: design terms ("randomized," "double-blind," "cross-sectional," "cohort," "case-control"), "participants," "n =," inclusion/exclusion criteria, instruments/scales, dosing/protocols, schedules/timelines, statistical tests/analysis plans ("multivariate regression," "Kaplan–Meier," "ANOVA," "we will compare"), trial registration, ethics approval.
- Measurement/outcome lists are METHODS (e.g., "Secondary outcomes include: …"; "Primary outcome was …").
- Numbers specifying sample size (e.g., "n = 200") → METHODS; numbers tied to effects → RESULTS.
- Program/intervention descriptions, components, theoretical basis, and mechanisms are METHODS, even if written in present tense and even if they contain purpose phrases. Examples: "The program is based on self-efficacy theory…," "The intervention uses a self-management approach to enhance skills…," "The device is designed to…"
  - Important: An infinitive "to [verb] …" inside a program/intervention description (e.g., "uses X to improve Y") is METHODS, not OBJECTIVE, because it describes how the intervention works, not the study's aim.

4) OBJECTIVE
- The aim/purpose/hypothesis of the study.
- Common cues: "Objective(s):" "Aim/Purpose was," "We aimed/sought/intended to," "We hypothesized that …"
- Infinitive purpose phrases indicating the study's aim without procedures or results: "To determine/evaluate/assess/investigate whether …" → OBJECTIVE.
- Phrases like "The aim of this study was to evaluate the efficacy/safety of X vs Y …" → OBJECTIVE.
- If "We evaluated/assessed …" is clearly used as a purpose statement (not describing methods or results), label OBJECTIVE.

5) BACKGROUND
- Context, rationale, prior knowledge, unmet need; introduces topic without specific aims, procedures, or results.
- Common cues: burden/prevalence statements, "X is common," "X remains poorly understood," prior work summaries, general descriptions.
- If a sentence merely states that a paper describes/reports a program/design/evaluation without concrete procedures/analyses, label as BACKGROUND.

Important tie-break rules:
- RESULTS vs CONCLUSIONS: Observed data/findings → RESULTS; interpretation/generalization/recommendation → CONCLUSIONS.
- OBJECTIVE vs METHODS: Purpose/aim of the study → OBJECTIVE; concrete design/intervention details/measurements/analysis steps → METHODS.
- BACKGROUND vs OBJECTIVE: Context/motivation without an explicit study aim → BACKGROUND.
- BACKGROUND vs METHODS: General description without concrete procedures/analyses → BACKGROUND.
- The word "Results" at the start does not guarantee RESULTS; e.g., "Results will provide information …" → CONCLUSIONS.

Output constraint:
- Return exactly one uppercase label: CONCLUSIONS, RESULTS, METHODS, OBJECTIVE, or BACKGROUND. No extra text or punctuation.
```

</div>

</Card>
</CardGroup>

## Components

The <APILink fn="mlflow.genai.optimize_prompts" /> API requires the following components:

<table style={{ width: "100%" }}>
  <thead>
    <tr>
      <th style={{ width: "30%" }}>Component</th>
      <th style={{ width: "70%" }}>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Target Prompt URIs</strong></td>
      <td>List of prompt URIs to optimize (e.g., <code>["prompts:/qa/1"]</code>)</td>
    </tr>
    <tr>
      <td><strong>Predict Function</strong></td>
      <td>A callable that takes inputs as keyword arguments and returns outputs. Must load templates from MLflow prompt versions (e.g., call <APILink fn="mlflow.entities.model_registry.PromptVersion.format">`PromptVersion.format()`</APILink>).</td>
    </tr>
    <tr>
      <td><strong>Training Data</strong></td>
      <td>Dataset with <code>inputs</code> (dict) and <code>expectations</code> (expected results). Supports pandas DataFrame, list of dicts, or MLflow EvaluationDataset.</td>
    </tr>
    <tr>
      <td><strong>Optimizer</strong></td>
      <td>Prompt optimizer instance (e.g., <APILink fn="mlflow.genai.optimize.GepaPromptOptimizer" >`GepaPromptOptimizer`</APILink>)</td>
    </tr>
  </tbody>
</table>

### 1. Target Prompt URIs

Specify which prompts to optimize using their URIs from MLflow Prompt Registry:

```python
prompt_uris = [
    "prompts:/qa/1",  # Specific version
    "prompts:/instruction@latest",  # Latest version
]
```

You can reference prompts by:

- **Specific version**: `"prompts:/qa/1"` - Optimize a particular version
- **Latest version**: `"prompts:/qa@latest"` - Optimize the most recent version
- **Alias**: `"prompts:/qa@champion"` - Optimize a version with a specific alias

### 2. Predict Function

Your `predict_fn` must:

- Accept inputs as keyword arguments matching the inputs field of the dataset
- Load the template from MLflow prompt versions using one of the following methods:
  - <APILink fn="mlflow.entities.model_registry.PromptVersion.format">`PromptVersion.format()`</APILink>
  - <APILink fn="mlflow.entities.model_registry.PromptVersion.template">`PromptVersion.template`</APILink>
  - <APILink fn="mlflow.entities.model_registry.PromptVersion.to_single_brace_format" >`PromptVersion.to_single_brace_format()`</APILink>
- Return outputs in the same format as your training data (e.g., outputs = `{"answer": "xxx"}` if expectations = `{"expected_response": {"answer": "xxx"}}`)

```python
def predict_fn(question: str) -> str:
    # Load prompt from registry
    prompt = mlflow.genai.load_prompt("prompts:/qa/1")

    # Format the prompt with input variables
    formatted_prompt = prompt.format(question=question)

    # Call your LLM
    response = your_llm_call(formatted_prompt)

    return response
```

### 3. Training Data

Provide a dataset with `inputs` and `expectations`. Both columns should have dictionary values. `inputs` values will be passed to the predict function as keyword arguments. Please refer to [Predefined LLM Scorers](/genai/eval-monitor/scorers/llm-judge/predefined/) for the expected format of each built in scorers.

```python
# List of dictionaries - Example: Medical paper classification
dataset = [
    {
        "inputs": {
            "sentence": "The emergence of HIV as a chronic condition means that people living with HIV are required to take more responsibility..."
        },
        "expectations": {"expected_response": "BACKGROUND"},
    },
    {
        "inputs": {
            "sentence": "This study is designed as a randomised controlled trial in which men living with HIV..."
        },
        "expectations": {"expected_response": "METHODS"},
    },
    {
        "inputs": {
            "sentence": "Both groups showed improvement in symptoms and in clinical evidence of inflammation..."
        },
        "expectations": {"expected_response": "RESULTS"},
    },
    {
        "inputs": {
            "sentence": "Orbital steroid injection for thyroid-related ophthalmopathy is effective and safe."
        },
        "expectations": {"expected_response": "CONCLUSIONS"},
    },
    {
        "inputs": {
            "sentence": "The aim of this study was to evaluate the efficacy, safety and complications..."
        },
        "expectations": {"expected_response": "OBJECTIVE"},
    },
]

# Or pandas DataFrame
import pandas as pd

dataset = pd.DataFrame(
    {
        "inputs": [
            {"sentence": "The emergence of HIV as a chronic condition..."},
            {"sentence": "This study is designed as a randomised controlled trial..."},
            {"sentence": "Both groups showed improvement in symptoms..."},
        ],
        "expectations": [
            {"expected_response": "BACKGROUND"},
            {"expected_response": "METHODS"},
            {"expected_response": "RESULTS"},
        ],
    }
)
```

### 4. Optimizer

Create an optimizer instance for the optimization algorithm. Currently only <APILink fn="mlflow.genai.optimize.GepaPromptOptimizer">`GepaPromptOptimizer`</APILink> is supported natively.

```python
from mlflow.genai.optimize import GepaPromptOptimizer

optimizer = GepaPromptOptimizer(
    reflection_model="openai:/gpt-5",  # Powerful model for optimization
    max_metric_calls=100,
    display_progress_bar=False,
)
```

## Advanced Usage

### Works with Any Agent Framework

MLflow's optimization is **framework-agnostic**—it works seamlessly with LangChain, LangGraph, OpenAI Agent, Pydantic AI, CrewAI, AutoGen, or any custom framework. No need to rewrite your existing agents or switch frameworks.

See these framework-specific guides for detailed examples:

<CardGroup isSmall>
  <SmallLogoCard link="/genai/prompt-registry/optimize-prompts/langchain-optimization">
    <span>![LangChain Logo](/images/logos/langchain-logo.png)</span>
  </SmallLogoCard>
  <SmallLogoCard link="/genai/prompt-registry/optimize-prompts/langgraph-optimization">
    <span>![LangGraph Logo](/images/logos/langgraph-logo.png)</span>
  </SmallLogoCard>
  <SmallLogoCard link="/genai/prompt-registry/optimize-prompts/openai-agent-optimization">
    <span>![OpenAI Agent Logo](/images/logos/openai-agent-logo.png)</span>
  </SmallLogoCard>
  <SmallLogoCard link="/genai/prompt-registry/optimize-prompts/pydantic-ai-optimization">
    <span>![Pydantic AI Logo](/images/logos/pydanticai-logo.png)</span>
  </SmallLogoCard>
</CardGroup>

### Using Custom Scorers

Define custom evaluation metrics to guide optimization:

```python
from typing import Any
from mlflow.genai.scorers import scorer


@scorer
def accuracy_scorer(outputs: Any, expectations: dict[str, Any]):
    """Check if output matches expected value."""
    return 1.0 if outputs.lower() == expectations.lower() else 0.0


@scorer
def brevity_scorer(outputs: Any):
    """Prefer shorter outputs (max 50 chars)."""
    return min(1.0, 50 / max(len(outputs), 1))


# Combine scorers with a weighted objective
def weighted_objective(scores: dict[str, Any]):
    return 0.7 * scores["accuracy_scorer"] + 0.3 * scores["brevity_scorer"]


# Use custom scorers
result = mlflow.genai.optimize_prompts(
    predict_fn=predict_fn,
    train_data=dataset,
    prompt_uris=[prompt.uri],
    optimizer=GepaPromptOptimizer(reflection_model="openai:/gpt-5"),
    scorers=[accuracy_scorer, brevity_scorer],
    aggregation=weighted_objective,
)
```

### Custom Optimization Algorithm

Implement your own optimizer by extending <APILink fn="mlflow.genai.optimize.BasePromptOptimizer" >`BasePromptOptimizer`</APILink>:

```python
from mlflow.genai.optimize import BasePromptOptimizer, PromptOptimizerOutput
from mlflow.genai.scorers import Correctness


class MyCustomOptimizer(BasePromptOptimizer):
    def __init__(self, model_name: str):
        self.model_name = model_name

    def optimize(self, eval_fn, train_data, target_prompts, enable_tracking):
        # Your custom optimization logic
        optimized_prompts = {}
        for prompt_name, prompt_template in target_prompts.items():
            # Implement your algorithm
            optimized_prompts[prompt_name] = your_optimization_algorithm(
                prompt_template, train_data, self.model_name
            )

        return PromptOptimizerOutput(optimized_prompts=optimized_prompts)


# Use custom optimizer
result = mlflow.genai.optimize_prompts(
    predict_fn=predict_fn,
    train_data=dataset,
    prompt_uris=[prompt.uri],
    optimizer=MyCustomOptimizer(model_name="openai:/gpt-5"),
    scorers=[Correctness(model="openai:/gpt-5")],
)
```

### Multi-Prompt Optimization

Optimize multiple prompts together:

```python
import mlflow
from mlflow.genai.scorers import Correctness

# Register multiple prompts
plan_prompt = mlflow.genai.register_prompt(
    name="plan",
    template="Make a plan to answer {{question}}.",
)
answer_prompt = mlflow.genai.register_prompt(
    name="answer",
    template="Answer {{question}} following the plan: {{plan}}",
)


def predict_fn(question: str) -> str:
    plan_prompt = mlflow.genai.load_prompt("prompts:/plan/1")
    completion = openai.OpenAI().chat.completions.create(
        model="gpt-5",  # strong model
        messages=[{"role": "user", "content": plan_prompt.format(question=question)}],
    )
    plan = completion.choices[0].message.content

    answer_prompt = mlflow.genai.load_prompt("prompts:/answer/1")
    completion = openai.OpenAI().chat.completions.create(
        model="gpt-5-mini",  # cost efficient model
        messages=[
            {
                "role": "user",
                "content": answer_prompt.format(question=question, plan=plan),
            }
        ],
    )
    return completion.choices[0].message.content


# Optimize both
result = mlflow.genai.optimize_prompts(
    predict_fn=predict_fn,
    train_data=dataset,
    prompt_uris=[plan_prompt.uri, answer_prompt.uri],
    optimizer=GepaPromptOptimizer(reflection_model="openai:/gpt-5"),
    scorers=[Correctness(model="openai:/gpt-5")],
)

# Access optimized prompts
optimized_plan = result.optimized_prompts[0]
optimized_answer = result.optimized_prompts[1]
```

## Result Object

The API returns a <APILink fn="mlflow.genai.optimize.PromptOptimizationResult" >`PromptOptimizationResult`</APILink> object:

```python
result = mlflow.genai.optimize_prompts(...)

# Access optimized prompts
for prompt in result.optimized_prompts:
    print(f"Name: {prompt.name}")
    print(f"Version: {prompt.version}")
    print(f"Template: {prompt.template}")
    print(f"URI: {prompt.uri}")

# Check optimizer used
print(f"Optimizer: {result.optimizer_name}")

# View evaluation scores (if available)
print(f"Initial score: {result.initial_eval_score}")
print(f"Final score: {result.final_eval_score}")
```

## Common Use Cases

### Improving Accuracy

Optimize prompts to produce more accurate outputs:

```python
from mlflow.genai.scorers import Correctness


result = mlflow.genai.optimize_prompts(
    predict_fn=predict_fn,
    train_data=dataset,
    prompt_uris=[prompt.uri],
    optimizer=GepaPromptOptimizer(reflection_model="openai:/gpt-5"),
    scorers=[Correctness(model="openai:/gpt-5")],
)
```

### Optimizing for Safeness

Ensure outputs are safe:

```python
from mlflow.genai.scorers import Safety


result = mlflow.genai.optimize_prompts(
    predict_fn=predict_fn,
    train_data=dataset,
    prompt_uris=[prompt.uri],
    optimizer=GepaPromptOptimizer(reflection_model="openai:/gpt-5"),
    scorers=[Safety(model="openai:/gpt-5")],
)
```

### Model Switching and Migration

When switching between different language models (e.g., migrating from `gpt-5` to `gpt-5-mini` for cost reduction), you may need to rewrite your prompts to maintain output quality with the new model. The <APILink fn="mlflow.genai.optimize_prompts" /> API can help adapt prompts automatically using your existing application outputs as training data.

See the [Auto-rewrite Prompts for New Models](/genai/prompt-registry/rewrite-prompts) guide for a complete model migration workflow.

## Troubleshooting

### Issue: Optimization Takes Too Long

**Solution**: Reduce dataset size or reduce the optimizer budget:

```python
# Use fewer examples
small_dataset = dataset[:20]

# Use faster model for optimization
optimizer = GepaPromptOptimizer(
    reflection_model="openai:/gpt-5-mini", max_metric_calls=100
)
```

### Issue: No Improvement Observed

**Solution**: Check your evaluation metrics and increase dataset diversity:

- Ensure scorers accurately measure what you care about
- Increase training data size and diversity
- Try to modify optimizer configurations
- Verify outputs format matches expectations

### Issue: Prompts Not Being Used

**Solution**: Ensure `predict_fn` calls <APILink fn="mlflow.entities.model_registry.PromptVersion.format" >`PromptVersion.format()`</APILink> during execution:

```python
# ✅ Correct - loads from registry
def predict_fn(question: str):
    prompt = mlflow.genai.load_prompt("prompts:/qa@latest")
    return llm_call(prompt.format(question=question))


# ❌ Incorrect - hardcoded prompt
def predict_fn(question: str):
    return llm_call(f"Answer: {question}")
```

## See Also

- [Auto-rewrite Prompts for New Models](/genai/prompt-registry/rewrite-prompts): Adapt prompts when switching between language models
- [Create and Edit Prompts](/genai/prompt-registry/create-and-edit-prompts): Basic Prompt Registry usage
- [Evaluate Prompts](/genai/eval-monitor/running-evaluation/prompts): Evaluate prompt performance
```

--------------------------------------------------------------------------------

---[FILE: prompt-engineering.mdx]---
Location: mlflow-master/docs/docs/genai/prompt-registry/prompt-engineering.mdx

```text
import { APILink } from "@site/src/components/APILink";

# Prompt Engineering UI (Experimental)

Starting in MLflow 2.7, the MLflow Tracking UI provides a best-in-class experience for prompt
engineering. With no code required, you can try out multiple LLMs from the
[MLflow AI Gateway](/genai/governance/ai-gateway), parameter configurations, and prompts to build a variety of models for
question answering, document summarization, and beyond. Using the embedded Evaluation UI, you can
also evaluate multiple models on a set of inputs and compare the responses to select the best one.
Every model created with the prompt engineering UI is stored in the [MLflow Model](/ml/model)
format and can be deployed for batch or real time inference. All configurations (prompt templates,
choice of LLM, parameters, etc.) are tracked as [MLflow Runs](/ml/tracking).

## Quickstart \{#prompt-engineering-quickstart}

The following guide will get you started with MLflow's UI for prompt engineering.

### Step 1: Create an MLflow AI Gateway Completions or Chat Endpoint

To use the prompt engineering UI, you need to create one or more [MLflow AI Gateway](/genai/governance/ai-gateway)
completions or chat endpoints. Follow the
[MLflow AI Gateway Quickstart guide](/genai/governance/ai-gateway/setup) to easily create an endpoint in less than five
minutes. If you already have access to an MLflow AI Gateway endpoint of type `llm/v1/completions`
or `llm/v1/chat`, you can skip this step.

```bash
mlflow gateway start --config-path config.yaml --port 7000
```

### Step 2: Connect the MLflow AI Gateway to your MLflow Tracking Server

The prompt engineering UI also requires a connection between the MLflow AI Gateway and the MLflow
Tracking Server. To connect the MLflow AI Gateway with the MLflow Tracking Server, simply set the
`MLFLOW_DEPLOYMENTS_TARGET` environment variable in the environment where the server is running and
restart the server. For example, if the MLflow AI Gateway is running at `http://localhost:7000`, you
can start an MLflow Tracking Server in a shell on your local machine and connect it to the
MLflow AI Gateway using the <APILink fn="mlflow.server.cli" hash="mlflow-server">mlflow server</APILink> command as follows:

```bash
export MLFLOW_DEPLOYMENTS_TARGET="http://127.0.0.1:7000"
mlflow server --port 5000
```

### Step 3: Create or find an MLflow Experiment

Next, open an existing MLflow Experiment in the MLflow UI, or create a new experiment.

<div className="center-div" style={{ maxWidth: 650, width: "100%" }}>
  ![](/images/experiment_page.png)
</div>

### Step 4: Create a run with prompt engineering

Once you have opened the Experiment, click the **New Run** button and select
_using Prompt Engineering_. This will open the prompt engineering playground where you can try
out different LLMs, parameters, and prompts.

<div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
  <div style={{ width: "25%" }}>![](/images/new_run.png)</div>
  <div style={{ width: "70%" }}>![](/images/prompt_modal_1.png)</div>
</div>

### Step 5: Select your endpoint and evaluate the example prompt

Next, click the _Select endpoint_ dropdown and select the MLflow AI Gateway completions endpoint you created in
Step 1. Then, click the **Evaluate** button to test out an example prompt engineering use case
for generating product advertisements.

MLflow will embed the specified _stock_type_ input
variable value - `"books"` - into the specified _prompt template_ and send it to the LLM
associated with the MLflow AI Gateway endpoint with the configured _temperature_ (currently `0.01`)
and _max_tokens_ (currently 1000). The LLM response will appear in the _Output_ section.

![](/images/prompt_modal_2.png)

### Step 6: Try a prompt of your choosing

Replace the prompt template from the previous step with a prompt template of your choosing.
Prompts can define multiple variables. For example, you can use the following prompt template
to instruct the LLM to answer questions about the MLflow documentation:

 ````
Read the following article from the MLflow documentation that appears between triple
backticks. Then, answer the question about the documentation that appears between triple quotes.
Include relevant links and code examples in your answer.

```{{article}}```

"""
{{question}}
"""
 ````

Then, fill in the input variables. For example, in the MLflow documentation
use case, the _article_ input variable can be set to the contents of
https://mlflow.org/docs/latest/tracking.html#logging-data-to-runs and the _question_ input variable
can be set to `"How do I create a new MLflow Run using the Python API?"`.

Finally, click the **Evaluate** button to see the new output. You can also try choosing a larger
value of _temperature_ to observe how the LLM's output changes.

<div className="center-div" style={{ maxWidth: 820, width: "100%" }}>
  ![](/images/prompt_modal_3.png)
</div>

### Step 7: Capture your choice of LLM, prompt template, and parameters as an MLflow Run

Once you're satisfied with your chosen prompt template and parameters, click the **Create Run**
button to store this information, along with your choice of LLM, as an MLflow Run. This will
create a new Run with the prompt template, parameters, and choice of LLM stored as Run params.
It will also automatically create an MLflow Model with this information that can be used for batch
or real-time inference.

1.  To view this information, click the Run name to open the **Run** page:

    <div className="center-div" style={{ maxWidth: 750, width: "100%" }}>![](/images/prompt_eng_run_page.png)</div>

2.  You can also see the parameters and compare them with other configurations by opening the **Table**
    view tab:

          <div className="center-div" style={{ maxWidth: 750, width: "100%" }}>

    ![](/images/prompt_eng_table_view.png)

    </div>

3.  After your Run is created, MLflow will open the **Evaluation** tab where you can see your latest
    playground input & output and try out additional inputs:

          <div className="center-div" style={{ maxWidth: 750, width: "100%" }}>

    ![](/images/eval_view_1.png)

    </div>

### Step 8: Try new inputs

To test the behavior of your chosen LLM, prompt template, and parameters on a new inputs:

1. Click the _Add Row_ button and fill in a value(s) your prompt template's input variable(s).
   For example, in the MLflow documentation use case, you can try asking a question
   unrelated to MLflow to see how the LLM responds. This is important to ensure that the application
   is robust to irrelevant inputs.

<div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
  <div style={{ width: "10%" }}>![](/images/add_row.png)</div>
  <div style={{ width: "50%" }}>![](/images/add_row_modal.png)</div>
</div>

2.  Then, click the **Evaluate** button to see the output.

          <div className="center-div" style={{ maxWidth: 650, width: "100%" }}>

    ![](/images/evaluate_new_input.png)

    </div>

3.  Finally, click the **Save** button to store the new inputs and output.

          <div className="center-div" style={{ maxWidth: 650, width: "100%" }}>

    ![](/images/save_new_input.png)

    </div>

### Step 9: Adjust your prompt template and create a new Run

As you try additional inputs, you might discover scenarios where your choice of LLM, prompt
template, and parameters doesn't perform as well as you would like. For example, in the
MLflow documentation use case, the LLM still attempts to answer irrelevant
questions about [MLflow Projects](/ml/projects) even if the answer does not appear in the
specified article.

1.  To improve performance, create a new Run by selecting the _Duplicate run_ option from the context
    menu. For example, in the MLflow documentation use case, adding the following text to
    the prompt template helps improve robustness to irrelevant questions:

    ```
    If the question does not relate to the article, respond exactly with the phrase
    "I do not know how to answer that question." Do not include any additional text in your
    response.
    ```

          <div className="center-div" style={{ maxWidth: 500, width: "100%" }}>

    ![](/images/duplicate_run.png)

    </div>

2.  Then, from the prompt engineering playground, adjust the prompt template (and / or choice of
    LLM and parameters), evaluate an input, and click the **Create Run** button to create a new Run.

    ![](/images/prompt_modal_4.png)

### Step 10: Evaluate the new prompt template on previous inputs

Now that you've made an adjustment to your prompt template, it's important to make sure that
the new template performs well on the previous inputs and compare the outputs with older
configurations.

1.  From the **Evaluation** tab, click the **Evaluate all** button next to the new Run to evaluate
    all of the previous inputs.

          <div className="center-div" style={{ maxWidth: 300, width: "100%" }}>

    ![](/images/evaluate_all.png)

    </div>

2.  Click the **Save** button to store the results.

    ![](/images/evaluate_all_results.png)

### Step 11: Load evaluation data programmatically

All of the inputs and outputs produced by the MLflow prompt engineering UI and Evaluation UI are stored
as artifacts in MLflow Runs. They can be accessed programmatically using the <APILink fn="mlflow.load_table" /> API
as follows:

```python
import mlflow

mlflow.set_experiment("/Path/to/your/prompt/engineering/experiment")

# Load input and output data across all Runs (configurations) as a Pandas DataFrame
inputs_outputs_pdf = mlflow.load_table(
    # All inputs and outputs created from the MLflow UI are stored in an artifact called
    # "eval_results_table.json"
    artifact_file="eval_results_table.json",
    # Include the run ID as a column in the table to distinguish inputs and outputs
    # produced by different runs
    extra_columns=["run_id"],
)
# Optionally convert the Pandas DataFrame to Spark where it can be stored as a Delta
# table or joined with existing Delta tables
inputs_outputs_sdf = spark.createDataFrame(inputs_outputs_pdf)
```

### Step 12: Generate predictions programmatically \{#quickstart-score}

Once you have found a configuration of LLM, prompt template, and parameters that performs well, you
can generate predictions using the corresponding MLflow Model in a Python environment of your choosing,
or you can [deploy it for real-time serving](#deploy-prompt-serving).

1. To load the MLflow Model in a notebook for batch inference, click on the Run's name to open the
   **Run Page** and select the _model_ directory in the **Artifact Viewer**. Then, copy the first
   few lines of code from the _Predict on a Pandas DataFrame_ section and run them in a Python
   environment of your choosing, for example:

   ![](/images/load_model.png)

   ```python
   import mlflow

   logged_model = "runs:/8451075c46964f82b85fe16c3d2b7ea0/model"

   # Load model as a PyFuncModel.
   loaded_model = mlflow.pyfunc.load_model(logged_model)
   ```

2. Then, to generate predictions, call the <APILink fn="mlflow.pyfunc.PyFuncModel.predict">`predict()`</APILink> method
   and pass in a dictionary of input variables. For example:

   ```python
   article_text = """
   An MLflow Project is a format for packaging data science code in a reusable and reproducible way.
   The MLflow Projects component includes an API and command-line tools for running projects, which
   also integrate with the Tracking component to automatically record the parameters and git commit
   of your source code for reproducibility.

   This article describes the format of an MLflow Project and how to run an MLflow project remotely
   using the MLflow CLI, which makes it easy to vertically scale your data science code.
   """
   question = "What is an MLflow project?"

   loaded_model.predict({"article": article_text, "question": question})
   ```

   For more information about deployment for real-time serving with MLflow,
   see the [instructions below](#deploy-prompt-serving).

## Deployment for real-time serving \{#deploy-prompt-serving}

Once you have found a configuration of LLM, prompt template, and parameters that performs well, you
can deploy the corresponding MLflow Model for real-time serving as follows:

1. Register your model with the MLflow Model Registry. The following example registers
   an MLflow Model created from the [Quickstart](#quickstart-score) as Version 1 of the
   Registered Model named `"mlflow_docs_qa_model"`.

   ```python
   mlflow.register_model(
       model_uri="runs:/8451075c46964f82b85fe16c3d2b7ea0/model",
       name="mlflow_docs_qa_model",
   )
   ```

2. Define the following environment variables in the environment where you will run your
   MLflow Model Server, such as a shell on your local machine:
   - `MLFLOW_DEPLOYMENTS_TARGET`: The URL of the MLflow AI Gateway

3. Use the <APILink fn="mlflow.server.cli" hash="mlflow-models-serve">mlflow models serve</APILink> command to start the MLflow Model Server. For example,
   running the following command from a shell on your local machine will serve the model
   on port 8000:

   ```bash
   mlflow models serve --model-uri models:/mlflow_docs_qa_model/1 --port 8000
   ```

4. Once the server has been started, it can be queried via REST API call. For example:

   ```bash
   input='
   {
       "dataframe_records": [
           {
               "article": "An MLflow Project is a format for packaging data science code...",
               "question": "What is an MLflow Project?"
           }
       ]
   }'

   echo $input | curl \
     -s \
     -X POST \
     https://localhost:8000/invocations
     -H 'Content-Type: application/json' \
     -d @-
   ```

   where `article` and `question` are replaced with the input variable(s) from your
   prompt template.
```

--------------------------------------------------------------------------------

````
