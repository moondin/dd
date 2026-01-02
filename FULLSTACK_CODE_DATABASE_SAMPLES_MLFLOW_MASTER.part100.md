---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 100
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 100 of 991)

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
Location: mlflow-master/docs/docs/genai/eval-monitor/index.mdx

```text
import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"
import ImageBox from "@site/src/components/ImageBox";
import TabsWrapper from "@site/src/components/TabsWrapper";
import TilesGrid from "@site/src/components/TilesGrid";
import TileCard from "@site/src/components/TileCard";
import { Rocket, Scale } from "lucide-react";
import useBaseUrl from '@docusaurus/useBaseUrl';

# Evaluating LLMs/Agents with MLflow

:::info Modern GenAI Evaluation

This documentation covers MLflow's **GenAI evaluation system** which uses:

- `mlflow.genai.evaluate()` for evaluation
- `Scorer` objects for metrics
- Built-in and custom LLM judges

**Note**: This system is separate from the [classic ML evaluation](/ml/evaluation) system that uses `mlflow.evaluate()` and `EvaluationMetric`. The two systems serve different purposes and are not interoperable.
:::

MLflow's evaluation and monitoring capabilities help you systematically measure, improve, and maintain the quality of your GenAI applications throughout their lifecycle from development through production.

<video src={useBaseUrl("/images/mlflow-3/eval-monitor/evaluation-result-video.mp4")} controls loop autoPlay muted aria-label="Prompt Evaluation" />

A core tenet of MLflow's evaluation capabilities is **Evaluation-Driven Development**. This is an emerging practice to tackle the challenge of building high-quality LLM/Agentic applications. MLflow is an **end-to-end** platform that is designed to support this practice and help you deploy AI applications with confidence.

<ImageBox src="/images/mlflow-3/eval-monitor/evaluation-driven-development.png" alt="Evaluation Driven Development" width="90%"/>

## Key Capabilities

<TabsWrapper>
  <Tabs>
  <TabItem value="dataset" label="Dataset Management">
    <div class="flex-column">
      <div class="flex-row">
        <div class="flex-item">

        #### Create and maintain a High-Quality Dataset

        Before you can evaluate your GenAI application, you need test data. **Evaluation Datasets** provide a centralized repository for managing test cases, ground truth expectations, and evaluation data at scale.

        Think of Evaluation Datasets as your "test database" - a single source of truth for all the data needed to evaluate your AI systems. They transform ad-hoc testing into systematic quality assurance.

        [Learn more →](/genai/datasets)

        </div>

        <div class="flex-item padding-md">
          ![Trace Dataset](/images/llms/tracing/genai-trace-dataset.png)
        </div>
      </div>
    </div>

  </TabItem>
  <TabItem value="feedback" label="Human Feedback">
    <div class="flex-column">
      <div class="flex-row">
        <div class="flex-item">

        #### Track Annotation and Human Feedbacks

        Human feedback is essential for building high-quality GenAI applications that meet user expectations. MLflow supports collecting, managing, and utilizing feedback from end-users and domain experts.

        Feedbacks are attached to traces and recorded with metadata, including user, timestamp, revisions, etc.

        [Learn more →](/genai/assessments/feedback)

        </div>

        <div class="flex-item padding-md">
          ![Trace Feedback](/images/llms/tracing/genai-human-feedback.png)
        </div>
      </div>
    </div>

  </TabItem>
  <TabItem value="llm-judge" label="LLM-as-a-Judge">
    <div class="flex-column">
      <div class="flex-row">
        <div class="flex-item">

        #### Scale Quality Assessment with Automation

        Quality assessment is a critical part of building high-quality GenAI applications, however, it is often time-consuming and requires human expertise. LLMs are powerful tools to automate quality assessment.

        MLflow offers various built-in LLM-as-a-Judge scorers to help automate the process, as well as a flexible toolset to build your own LLM judges with ease.

        [Learn more →](/genai/eval-monitor)

        </div>

        <div class="flex-item padding-md">
          ![Trace Evaluation](/images/llms/tracing/genai-trace-evaluation.png)
        </div>
      </div>
    </div>

  </TabItem>
  <TabItem value="evaluation" label="Systematic Evaluation">
    <div class="flex-column">
      <div class="flex-row">
        <div class="flex-item">

        #### Evaluate and Enhance quality

        Systematically assessing and improving the quality of GenAI applications is a challenge. MLflow provides a comprehensive set of tools to help you evaluate and enhance the quality of your applications.

        Being the industry's most-trusted experiment tracking platform, MLflow provides a strong foundation for tracking your evaluation results and effectively collaborating with your team.

        [Learn more →](/genai/eval-monitor/quickstart)

        </div>

        <div class="flex-item padding-md">
          ![Trace Evaluation](/images/llms/tracing/genai-evaluation-compare.png)
        </div>
      </div>
    </div>

  </TabItem>
  <TabItem value="production-monitoring" label="Production Monitoring">
    <div class="flex-column">
      <div class="flex-row">
        <div class="flex-item">

        #### Monitor Applications in Production

        Understanding and optimizing GenAI application performance is crucial for efficient operations. MLflow Tracing captures key metrics like latency and token usage at each step, as well as various quality metrics, helping you identify bottlenecks, monitor efficiency, and find optimization opportunities.

        [Learn more →](/genai/tracing/prod-tracing)

        </div>

        <div class="flex-item padding-md">
          ![Monitoring](/images/llms/tracing/genai-monitoring.png)
        </div>
      </div>
    </div>

  </TabItem>
  </Tabs>
</TabsWrapper>

## Running an Evaluation

Each evaluation is defined by three components:

<table style={{ width: "100%" }}>
  <thead>
    <tr>
      <th style={{ width: "30%" }}>Component</th>
      <th style={{ width: "70%" }}>Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Dataset</strong><br/><small>Inputs &amp; expectations (and optionally pre-generated outputs and traces)</small></td>
      <td>
        <pre><code>\[<br/>  \{"inputs": \{"question": "2+2"\}, "expectations": \{"answer": "4"\}},<br/>  \{"inputs": \{"question": "2+3"\}, "expectations": \{"answer": "5"\}\}<br/>\]</code></pre>
      </td>
    </tr>
    <tr>
      <td><strong>Scorer</strong><br/><small>Evaluation criteria</small></td>
      <td>
        <pre><code>@scorer<br/>def exact_match(expectations, outputs):<br/>    return expectations == outputs</code></pre>
      </td>
    </tr>
    <tr>
      <td><strong>Predict Function</strong><br/><small>Generates outputs for the dataset</small></td>
      <td>
        <pre><code>def predict_fn(question: str) -> str:<br/>    response = client.chat.completions.create(<br/>        model="gpt-4o-mini",<br/>        messages=\[\{"role": "user", "content": question\}\]<br/>    )<br/>    return response.choices[0].message.content</code></pre>
      </td>
    </tr>
  </tbody>
</table>

The following example shows a simple evaluation of a dataset of questions and expected answers.

```python
import os
import openai
import mlflow
from mlflow.genai.scorers import Correctness, Guidelines

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# 1. Define a simple QA dataset
dataset = [
    {
        "inputs": {"question": "Can MLflow manage prompts?"},
        "expectations": {"expected_response": "Yes!"},
    },
    {
        "inputs": {"question": "Can MLflow create a taco for my lunch?"},
        "expectations": {
            "expected_response": "No, unfortunately, MLflow is not a taco maker."
        },
    },
]


# 2. Define a prediction function to generate responses
def predict_fn(question: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o-mini", messages=[{"role": "user", "content": question}]
    )
    return response.choices[0].message.content


# 3.Run the evaluation
results = mlflow.genai.evaluate(
    data=dataset,
    predict_fn=predict_fn,
    scorers=[
        # Built-in LLM judge
        Correctness(),
        # Custom criteria using LLM judge
        Guidelines(name="is_english", guidelines="The answer must be in English"),
    ],
)
```

## Review the results

Open the MLflow UI to review the evaluation results. If you are using OSS MLflow, you can use the following command to start the UI:

```bash
mlflow server --port 5000
```

If you are using cloud-based MLflow, open the experiment page in the platform. You should see a new evaluation run is created under the "Runs" tab. Click on the run name to view the evaluation results.

<ImageBox src="/images/mlflow-3/eval-monitor/quickstart-eval-hero.png" alt="Evaluation Results" />

## Next Steps

<TilesGrid>
  <TileCard
    icon={Rocket}
    iconSize={48}
    title="Quickstart"
    description="Learn MLflow's evaluation workflow in action."
    href="/genai/eval-monitor/quickstart"
    linkText="Start evaluating →"
    containerHeight={64}
  />
  <TileCard
    icon={Scale}
    iconSize={48}
    title="Evaluate Agents"
    description="Evaluate AI agents with specialized techniques and custom scorers."
    href="/genai/eval-monitor/running-evaluation/agents"
    linkText="Evaluate agents →"
    containerHeight={64}
  />
  <TileCard
    icon={Scale}
    iconSize={48}
    title="Building Scorers"
    description="Get started with MLflow's powerful scorers for evaluating qualities."
    href="/genai/eval-monitor/scorers"
    linkText="Learn about scorers →"
    containerHeight={64}
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

---[FILE: legacy-llm-evaluation.mdx]---
Location: mlflow-master/docs/docs/genai/eval-monitor/legacy-llm-evaluation.mdx

```text
---
description: LLM evaluation involves assessing how well a model performs on a task. MLflow provides a simple API to evaluate your LLMs with popular metrics.
---

import { APILink } from "@site/src/components/APILink";
import useBaseUrl from '@docusaurus/useBaseUrl';
import ImageBox from "@site/src/components/ImageBox";
import WorkflowSteps from '@site/src/components/WorkflowSteps';
import { Bot, Database, Target, Play } from 'lucide-react';

# Migrating from Legacy LLM Evaluation

:::info

This is a migration guide for users who are using the legacy LLM evaluation capability through `mlflow.evaluate` API and see the following warning while migrating to MLflow 3.

> The mlflow.evaluate API has been deprecated as of MLflow 3.0.0.

If you are new to MLflow or its evaluation capabilities, start from the <ins>[MLflow 3 GenAI Evaluation](https://mlflow.org/docs/latest/genai/eval-monitor/index.html)</ins> guide instead.

:::

## Why Migrate?

MLflow 3 introduces a [new evaluation suite](/genai/eval-monitor) that are optimized for evaluating LLMs and GenAI applications. Compared to the legacy evaluation through the `mlflow.evaluate` API, the new suite offers the following benefits:

##### 1. Richer evaluation results

MLflow 3 displays the evaluation results with intuitive visualizations. Each prediction is recorded with a trace, which allows you to further investigate the result in details and identify the root cause of low quality predictions.

<table>
  <tr>
    <th>Old Results</th>
    <td><ImageBox src="/images/mlflow-3/eval-monitor/legacy-eval-result.png" alt="Legacy Evaluation" width="80%"/></td>
  </tr>
  <tr>
    <th>New Results</th>
    <td><ImageBox src="/images/mlflow-3/eval-monitor/prompt-evaluation-compare.png" alt="New Evaluation" width="80%"/></td>
  </tr>
</table>

##### 2. More powerful and flexible LLM-as-a-Judge

A rich set of built-in [LLM-as-a-Judge](/genai/eval-monitor/scorers/llm-judge) scorers and a flexible toolset to build your own LLM-as-a-Judge supports you to evaluate various aspects of your LLM applications. Furthermore, the new [Agents-as-a-Judge](/genai/eval-monitor/scorers/llm-judge/agentic-overview) capability evaluates complex trace with minimum context window consumption and boilerplate code.

##### 3. Integration with other MLflow GenAI capabilities

The new evaluation suite is tightly integrated with other MLflow GenAI capabilities, such as [tracing](/genai/tracing), [prompt management](/genai/prompt-registry), [prompt optimization](/genai/prompt-registry/optimize-prompts), making it an end-to-end solution for building high-quality LLM applications.

##### 4. Better future support

MLflow is rapidly evolving ([changelog](https://github.com/mlflow/mlflow/releases)) and will continue strengthening its evaluation capabilities with the north star of **Deliver production-ready AI**. Migrating your workload to the new evaluation suite will ensure you have instant access to the latest and greatest features.

## Migration Steps

<WorkflowSteps
  width="wide"
  steps={[
    {
      icon: Bot,
      title: "Wrap your model in a function",
      description: "If you are evaluating an MLflow Model, wrap the model in a function and pass it to the new evaluation API."
    },
    {
      icon: Database,
      title: "Update dataset format",
      description: "Update the inputs and ground truth format to match the new evaluation dataset format."
    },
    {
      icon: Target,
      title: "Migrate metrics",
      description: "Update the metrics to use the new built-in or custom scorers offered by MLflow 3."
    },
    {
      icon: Play,
      title: "Run evaluation",
      description: "Execute the evaluation and make sure the results are as expected."
    }
  ]}
/>

:::tip Before you start the migration

Before starting the migration, we highly recommend you to visit the <ins>[GenAI Evaluation Guide](/genai/eval-monitor)</ins> and go through the <ins>[Quickstart](/genai/eval-monitor/quickstart)</ins> to get a sense of the new evaluation suite. Basic understanding of the concepts will help you to migrate your existing workload smoothly.

:::

### 1. Wrap Your Model in a Function

The old evaluation API accepts MLflow model URI as an evaluation target. The new evaluation API accepts a callable function as `predict_fn` argument instead, to provide more flexibility and control. This also eliminates the need of logging the model in MLflow before evaluation.

<table style={{ tableLayout: 'fixed', width: '100%' }}>
  <tr>
    <th>Old Format</th>
    <th>New Format</th>
  </tr>
  <tr>
    <td style={{ maxWidth: '50%', verticalAlign: 'top' }}>
      <pre style={{ whiteSpace: 'pre', overflowX: 'auto', margin: 0 }}>
        <code className="language-python">{`# Log the model first before evaluation
with mlflow.start_run() as run:
      logged_model_info = mlflow.openai.log_model(
          model="gpt-5-mini",
          task=openai.chat.completions,
          artifact_path="model",
          messages=[
              {"role": "system", "content": "Answer the following question in two sentences"},
              {"role": "user", "content": "{question}"},
          ],
      )

# Pass the model URI to the evaluation API.
mlflow.evaluate(model=logged_model_info.model_uri, ...)
`}</code>
      </pre>
    </td>
    <td style={{ maxWidth: '50%', verticalAlign: 'top' }}>
      <pre style={{ whiteSpace: 'pre', overflowX: 'auto', margin: 0 }}>
        <code className="language-python">{`# Define a function that runs predictions.
def predict_fn(question: str) -> str:
    response = openai.OpenAI().chat.completions.create(
        model="gpt-5-mini",
        messages=[
            {"role": "system", "content": "Answer the following question in two sentences"},
            {"role": "user", "content": question},
        ],
    )
    return response.choices[0].message.content

mlflow.genai.evaluate(predict_fn=predict_fn, ...)
`}</code>

</pre>
</td>

  </tr>
</table>

If you want to evaluate a pre-logged model with the new evaluation API, simply call the loaded model in the function.

```python
# IMPORTANT: Load the model outside the predict_fn function. Otherwise the model will be loaded
# for each input in the dataset and significantly slow down the evaluation.
model = mlflow.pyfunc.load_model(model_uri)


def predict_fn(question: str) -> str:
    return model.predict([question])[0]
```

### 2. Update the Dataset Format

The dataset format has been changed to be more flexible and consistent. The new format requirements are:

- `inputs`: The input to the predict_fn function. The key(s) must match the parameter name of the predict_fn function.
- `expectations`: The expected output from the predict_fn function, namely, ground truth for the answer.
- Optionally, you can pass `outputs` column or `trace` column to evaluate pre-generated outputs and traces.

<table style={{ tableLayout: 'fixed', width: '100%' }}>
  <tr>
    <th>Old Format</th>
    <th>New Format</th>
  </tr>
  <tr>
    <td style={{ maxWidth: '50%', verticalAlign: 'top' }}>
      <pre style={{ whiteSpace: 'pre', overflowX: 'auto', margin: 0 }}>
        <code className="language-python">{`eval_data = pd.DataFrame(
    {
        "inputs": [
            "What is MLflow?",
            "What is Spark?",
        ],
        "ground_truth": [
            "MLflow is an open-source platform for managing the end-to-end machine learning (ML) lifecycle.",
            "Apache Spark is an open-source, distributed computing system designed for big data processing and analytics.",
        ],
        "predictions": [
          "MLflow is an open-source MLOps platform",
          "Apache Spark is an open-source distributed computing engine.",
        ]
    }
)

mlflow.evaluate(
    data=eval_data, # Needed to specify the ground truth and prediction # columns name, otherwise MLflow does not recognize them.
    targets="ground_truth",
    predictions="predictions",
    ...
)
`}</code>
      </pre>
    </td>
    <td style={{ maxWidth: '50%', verticalAlign: 'top' }}>
      <pre style={{ whiteSpace: 'pre', overflowX: 'auto', margin: 0 }}>
        <code className="language-python">{`eval_data = [
    {
        "inputs": {"question": "What is MLflow?"},
        "outputs": "MLflow is an open-source MLOps platform",
        "expectations": {"answer": "MLflow is an open-source platform for managing the end-to-end machine learning (ML) lifecycle."},
    },
    {
        "inputs": {"question": "What is Spark?"},
        "outputs": "Apache Spark is an open-source distributed computing engine.",
        "expectations": {"answer": "Apache Spark is an open-source, distributed computing system designed for big data processing and analytics."},
    },
]

mlflow.genai.evaluate(
    data=eval_data,
    ...
)
`}</code>

</pre>
</td>

  </tr>
</table>

### 3. Migrate Metrics

The new evaluation API supports a rich set of built-in and custom LLM-as-a-Judge metrics. The table below shows the mapping between the legacy metrics and the new metrics.

<table>
  <tr>
    <th>Metric</th>
    <th>Before</th>
    <th>After</th>
  </tr>
  <tr>
    <td>Latency</td>
    <td><APILink fn="mlflow.metrics.latency">`latency`</APILink></td>
    <td>Traces record latency and also span-level break down. You don't need to specify a metric to evaluate latency when running the new <APILink fn="mlflow.genai.evaluate" /> API.</td>
  </tr>
  <tr>
    <td>Token Count</td>
    <td><APILink fn="mlflow.metrics.token_count">`token_count`</APILink></td>
    <td>Traces record token count for LLM calls for most of popular LLM providers. For other cases, you can use a [custom scorer](/genai/eval-monitor/scorers/custom) to calculate the token count.</td>
  </tr>
  <tr>
    <td>Heuristic NLP metrics</td>
    <td><APILink fn="mlflow.metrics.toxicity">`toxicity`</APILink>, <APILink fn="mlflow.metrics.flesch_kincaid_grade_level">`flesch_kincaid_grade_level`</APILink>, <APILink fn="mlflow.metrics.ari_grade_level">`ari_grade_level`</APILink>, <APILink fn="mlflow.metrics.exact_match">`exact_match`</APILink>, <APILink fn="mlflow.metrics.rouge1">`rouge1`</APILink>, <APILink fn="mlflow.metrics.rouge2">`rouge2`</APILink>, <APILink fn="mlflow.metrics.rougeL">`rougeL`</APILink>, <APILink fn="mlflow.metrics.rougeLsum">`rougeLsum`</APILink></td>
    <td>Use a [Code-based Scorer](/genai/eval-monitor/scorers/custom) to implement the equivalent metrics. See the example below for reference.</td>
  </tr>
  <tr>
    <td>Retrieval metrics</td>
    <td><APILink fn="mlflow.metrics.precision_at_k">`precision_at_k`</APILink>, <APILink fn="mlflow.metrics.recall_at_k">`recall_at_k`</APILink>, <APILink fn="mlflow.metrics.ndcg_at_k">`ndcg_at_k`</APILink></td>
    <td>Use the new [built-in retrieval metrics](/genai/eval-monitor/scorers/llm-judge/predefined/#available-scorers) or define a custom code-based scorer.</td>
  </tr>
  <tr>
    <td>Built-in LLM-as-a-Judge metrics</td>
    <td><APILink fn="mlflow.metrics.genai.answer_similarity">`answer_similarity`</APILink>, <APILink fn="mlflow.metrics.genai.answer_correctness">`answer_correctness`</APILink>, <APILink fn="mlflow.metrics.genai.answer_relevance">`answer_relevance`</APILink>, <APILink fn="mlflow.metrics.genai.relevance">`relevance`</APILink>, <APILink fn="mlflow.metrics.genai.faithfulness">`faithfulness`</APILink></td>
    <td>Use the new [built-in LLM scorers](http://localhost:3000/genai/eval-monitor/scorers/llm-judge/predefined/#available-scorers). If the metric is not supported out of the box, define a custom LLM-as-a-Judge scorer using the <APILink fn="mlflow.genai.judges.make_judge">`make_judge`</APILink> API, following the example below.</td>
  </tr>
  <tr>
    <td>Custom LLM-as-a-Judge metrics</td>
    <td><APILink fn="mlflow.metrics.genai.make_genai_metric">`make_genai_metric`</APILink>, <APILink fn="mlflow.metrics.genai.make_genai_metric_from_prompt">`make_genai_metric_from_prompt`</APILink></td>
    <td>Use the <APILink fn="mlflow.genai.judges.make_judge">`make_judge`</APILink> API to define a custom LLM-as-a-Judge scorer, following the example below.</td>
  </tr>
</table>

#### Example of custom LLM-as-a-Judge metrics

The new evaluation API supports defining custom LLM-as-a-Judge metrics from a custom prompt template. This eliminates a lot of complexity and over-abstractions from the previous `make_genai_metric` and `make_genai_metric_from_prompt` APIs.

```python
from mlflow.genai import make_judge

answer_similarity = make_judge(
    name="answer_similarity",
    instructions=(
        "Evaluated on the degree of semantic similarity of the provided output to the expected answer.\n\n"
        "Output: {{ outputs }}\n\n"
        "Expected: {{ expectations }}"
    ),
    feedback_value_type=int,
)

# Pass the scorer to the evaluation API.
mlflow.genai.evaluate(scorers=[answer_similarity, ...])
```

See the [LLM-as-a-Judge Scorers](/genai/eval-monitor/scorers/llm-judge) guide for more details.

#### Example of custom heuristic metrics

Implementing a custom scorer for heuristic metrics is straightforward. You just need to define a function and decorate it with the <APILink fn="mlflow.genai.scorers.scorer">`@scorer`</APILink> decorator. The example below shows how to implement the `exact_match` metric.

```python
@scorer
def exact_match(outputs: dict, expectations: dict) -> bool:
    return outputs == expectations["expected_response"]


# Pass the scorer to the evaluation API.
mlflow.genai.evaluate(scorers=[exact_match, ...])
```

See the [Code-based Scorers](/genai/eval-monitor/scorers/custom) guide for more details.

### 4. Run Evaluation

Now you have migrated all components of the legacy evaluation API and are ready to run the evaluation!

```python
mlflow.genai.evaluate(
    data=eval_data,
    predict_fn=predict_fn,
    scorers=[answer_similarity, exact_match, ...],
)
```

To view the evaluation results, click the link in the console output, or navigate to the **Evaluations** tab in the MLflow UI.

<video src={useBaseUrl("/images/mlflow-3/eval-monitor/evaluation-result-video.mp4")} controls loop autoPlay muted aria-label="Prompt Evaluation" />

## Other Changes

- When using Databricks Model Serving endpoint as a LLM-judge model, use `databricks:/<endpoint-name>` as model provider, rather than `endpoints:/<endpoint-name>`
- The evaluation results are shown in the `Evaluations` tab in the MLflow UI.
- Lots of configuration knobs such as `model_type`, `targets`, `feature_names`, `env_manager`, are removed in the new evaluation API.

## FAQ

### Q: The feature I want is not supported in the new evaluation suite.

Please open an feature request in [GitHub](https://github.com/mlflow/mlflow/issues/new?template=feature_request_template.yaml).

### Q: Where can I find the documentation for the legacy evaluation API?

See [MLflow 2 documentation](https://mlflow.org/docs/2.22.1/llms/llm-evaluate) for the legacy evaluation API.

### Q: When will the legacy evaluation API be removed?

It will likely be removed in MLflow 3.7.0 or a few releases after that.

### Q: Should I migrate non-GenAI workloads to the new evaluation suite?

No. The new evaluation suite is only for GenAI workloads. If you are not using GenAI, you should use the <APILink fn="mlflow.models.evaluate" /> API, which offers perfect compatibility with `mlflow.evaluate` API but drops the GenAI-specific features.
```

--------------------------------------------------------------------------------

---[FILE: quickstart.mdx]---
Location: mlflow-master/docs/docs/genai/eval-monitor/quickstart.mdx

```text
import { APILink } from "@site/src/components/APILink";
import ImageBox from '@site/src/components/ImageBox';
import ServerSetup from "@site/src/content/setup_server.mdx";

# GenAI Evaluation Quickstart

This quickstart guide will walk you through evaluating your GenAI applications with MLflow's comprehensive evaluation framework. In less than 5 minutes, you'll learn how to evaluate LLM outputs, use built-in and custom evaluation criteria, and analyze results in the MLflow UI.

<ImageBox src="/images/mlflow-3/eval-monitor/quickstart-eval-hero.png" alt="Simple Evaluation Results" />

## Prerequisites

Install the required packages by running the following command:

```bash
pip install openai
```

:::info

The code examples in this guide use the OpenAI SDK; however, MLflow's evaluation framework works with any LLM provider, including Anthropic, Google, Bedrock, and more.

:::

## Step 1: Set up your environment

### Connect to MLflow

MLflow stores evaluation results in a tracking server. Connect your local environment to the tracking server by one of the following methods.

<ServerSetup />

## Step 2: Create an evaluation script

Create a file named `quickstart_eval.py`. This script will contain your mock agent, evaluation dataset, scorers, and the evaluation execution. Alternatively, you may run this in a notebook.

Start with the environment setup:

```python
# quickstart_eval.py
import os
import mlflow

# Configure environment
os.environ["OPENAI_API_KEY"] = "your-api-key-here"  # Replace with your API key
mlflow.set_experiment("GenAI Evaluation Quickstart")
```

## Step 3: Define your mock agent's prediction function

First, we need to create a prediction function that takes a question and returns an answer. Here we use OpenAI's gpt-4o-mini model to generate the answer, but you can use any other LLM provider if you prefer.

Add your mock agent implementation to `quickstart_eval.py`:

```python
from openai import OpenAI

client = OpenAI()


def my_agent(question: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant. Answer questions concisely.",
            },
            {"role": "user", "content": question},
        ],
    )
    return response.choices[0].message.content


# Wrapper function for evaluation
def qa_predict_fn(question: str) -> str:
    return my_agent(question)
```

## Step 4: Prepare an evaluation dataset

The evaluation dataset is a list of samples, each with an `inputs` and `expectations` field.

- `inputs`: The input to the `predict_fn` function above. **The key(s) must match the parameter name of the `predict_fn` function**.
- `expectations`: The expected output from the `predict_fn` function, namely, ground truth for the answer.

The dataset can be a list of dictionaries, a pandas DataFrame, a spark DataFrame. Here we use a list of dictionaries for simplicity.

```python
# Define a simple Q&A dataset with questions and expected answers
eval_dataset = [
    {
        "inputs": {"question": "What is the capital of France?"},
        "expectations": {"expected_response": "Paris"},
    },
    {
        "inputs": {"question": "Who was the first person to build an airplane?"},
        "expectations": {"expected_response": "Wright Brothers"},
    },
    {
        "inputs": {"question": "Who wrote Romeo and Juliet?"},
        "expectations": {"expected_response": "William Shakespeare"},
    },
]
```

## Step 5: Define evaluation criteria using Scorers

**Scorer** is a function that computes a score for a given input-output pair against various evaluation criteria.
You can use built-in scorers provided by MLflow for common evaluation criteria, as well as create your own custom scorers.

```python
from mlflow.genai import scorer
from mlflow.genai.scorers import Correctness, Guidelines


@scorer
def is_concise(outputs: str) -> bool:
    """Evaluate if the answer is concise (less than 5 words)"""
    return len(outputs.split()) <= 5


scorers = [
    Correctness(),
    Guidelines(name="is_english", guidelines="The answer must be in English"),
    is_concise,
]
```

Here we use three scorers:

- <APILink fn="mlflow.genai.scorers.Correctness">Correctness</APILink>: Evaluates if the answer is factually correct, using the "expected_response" field in the dataset.
- <APILink fn="mlflow.genai.scorers.Guidelines">Guidelines</APILink>: Evaluates if the answer meets the given guidelines.
- `is_concise`: A custom scorer defined using the <APILink fn="mlflow.genai.scorers.scorer">scorer</APILink> decorator to judge if the answer is concise (less than 5 words).

The first two scorers use LLMs to evaluate the response, so-called **LLM-as-a-Judge**. This is a powerful technique to assess the quality of the response, because it provides a human-like evaluation for complex language tasks while being more scalable and cost-effective than human evaluation.

The Scorer interface allows you to define various types of quality metrics for your application in a simple way. From a simple natural language guideline to a code function with the full control of the evaluation logic.

:::tip

The default model used for LLM-as-a-Judge scorers such as Correctness and Guidelines is OpenAI `gpt-4o-mini`. MLflow supports all major LLM providers, such as Anthropic, Bedrock, Google, xAI, and more, through the built-in adopters and LiteLLM.

<details>
<summary>Example of using different model providers for the judge model</summary>

```python
# Anthropic
Correctness(model="anthropic:/claude-sonnet-4-20250514")

# Bedrock
Correctness(model="bedrock:/anthropic.claude-sonnet-4-20250514")

# Google
# Run `pip install litellm` to use Google as the judge model
Correctness(model="gemini/gemini-2.5-flash")

# xAI
# Run `pip install litellm` to use xAI as the judge model
Correctness(model="xai/grok-2-latest")
```

</details>

:::

## Step 6: Run the evaluation

Now we have all three components of the evaluation: dataset, prediction function, and scorers. Let's run the evaluation!

```python
# Run evaluation
if __name__ == "__main__":
    results = mlflow.genai.evaluate(
        data=eval_dataset,
        predict_fn=qa_predict_fn,
        scorers=scorers,
    )
```

Now run your evaluation script:

```bash
python quickstart_eval.py
```

## Complete Script

Here's the complete `quickstart_eval.py` for reference:

<details>
<summary>View complete script</summary>

```python
# quickstart_eval.py
import os
import mlflow
from openai import OpenAI
from mlflow.genai import scorer
from mlflow.genai.scorers import Correctness, Guidelines

# Use different env variable when using a different LLM provider
os.environ["OPENAI_API_KEY"] = "your-api-key-here"
mlflow.set_experiment("GenAI Evaluation Quickstart")

# Your agent implementation
client = OpenAI()


def my_agent(question: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant. Answer questions concisely.",
            },
            {"role": "user", "content": question},
        ],
    )
    return response.choices[0].message.content


# Wrapper function for evaluation
def qa_predict_fn(question: str) -> str:
    return my_agent(question)


# Evaluation dataset
eval_dataset = [
    {
        "inputs": {"question": "What is the capital of France?"},
        "expectations": {"expected_response": "Paris"},
    },
    {
        "inputs": {"question": "Who was the first person to build an airplane?"},
        "expectations": {"expected_response": "Wright Brothers"},
    },
    {
        "inputs": {"question": "Who wrote Romeo and Juliet?"},
        "expectations": {"expected_response": "William Shakespeare"},
    },
]


# Scorers
@scorer
def is_concise(outputs: str) -> bool:
    return len(outputs.split()) <= 5


scorers = [
    Correctness(),
    Guidelines(name="is_english", guidelines="The answer must be in English"),
    is_concise,
]

# Run evaluation
if __name__ == "__main__":
    results = mlflow.genai.evaluate(
        data=eval_dataset,
        predict_fn=qa_predict_fn,
        scorers=scorers,
    )
```

</details>

After running the code above, go to the MLflow UI and navigate to your experiment. You'll see the evaluation results with detailed metrics for each scorer.

<ImageBox src="/images/mlflow-3/eval-monitor/quickstart-eval-result.png" alt="Detailed Evaluation Results" width="90%" />

By clicking on the each row in the table, you can see the detailed rationale behind the score and the trace of the prediction.

<ImageBox src="/images/mlflow-3/eval-monitor/quickstart-eval-trace.png" alt="Detailed Evaluation Results" width="90%" />

## Summary

Congratulations! You've successfully:

- ✅ Set up MLflow GenAI Evaluation for your applications
- ✅ Evaluated a Q&A application with built-in scorers
- ✅ Created custom evaluation guidelines
- ✅ Learned to analyze results in the MLflow UI

MLflow's evaluation framework provides comprehensive tools for assessing GenAI application quality, helping you build more reliable and effective AI systems.
```

--------------------------------------------------------------------------------

````
