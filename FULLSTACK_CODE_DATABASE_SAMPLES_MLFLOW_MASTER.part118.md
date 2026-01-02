---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 118
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 118 of 991)

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
Location: mlflow-master/docs/docs/genai/getting-started/index.mdx

```text
---
description: "Build, evaluate, and deploy production-ready GenAI applications with MLflow's comprehensive LLMOps platform"
sidebar_position: 1
---

import FeatureHighlights from "@site/src/components/FeatureHighlights";
import ConceptOverview from "@site/src/components/ConceptOverview";
import TilesGrid from "@site/src/components/TilesGrid";
import TileCard from "@site/src/components/TileCard";
import useBaseUrl from '@docusaurus/useBaseUrl';
import { Code2, TestTube, Rocket, Eye, Database, Shield, Zap, PlayCircle, Target } from "lucide-react";

# Getting Started with MLflow for GenAI

## The Complete Open Source LLMOps Platform for Production GenAI

MLflow transforms how software engineers build, evaluate, and deploy GenAI applications. Get complete observability, systematic evaluation, and deployment confidence—all while maintaining the flexibility to use any framework or model provider.

<div style={{margin: '2rem 0', textAlign: 'center'}}>
  <video
    src={useBaseUrl('/images/llms/tracing/tracing-top.mp4')}
    controls
    loop
    autoPlay
    muted
    aria-label="MLflow Tracing UI showing detailed GenAI observability"
    style={{maxWidth: '100%', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'}}
  />
</div>

## The GenAI Development Lifecycle

MLflow provides a complete platform that supports every stage of GenAI application development. From initial prototyping to production monitoring, these integrated capabilities ensure you can build, test, and deploy with confidence.

<ConceptOverview concepts={[
  {
    icon: Code2,
    title: "Develop & Debug",
    description: "Trace every LLM call, prompt interaction, and tool invocation. Debug complex AI workflows with complete visibility into execution paths, token usage, and decision points."
  },
  {
    icon: TestTube,
    title: "Evaluate & Improve",
    description: "Systematically test with LLM judges, human feedback, and custom metrics. Compare versions objectively and catch regressions before they reach production."
  },
  {
    icon: Rocket,
    title: "Deploy & Monitor",
    description: "Serve models with confidence using built-in deployment targets. Monitor production performance and iterate based on real-world usage patterns."
  }
]} />

## Why Open Source MLflow for GenAI?

As the original open source ML platform, MLflow brings battle-tested reliability and community-driven innovation to GenAI development. No vendor lock-in, no proprietary formats—just powerful tools that work with your stack.

<FeatureHighlights features={[
  {
    icon: Eye,
    title: "Production-Grade Observability",
    description: "Automatically instrument 15+ frameworks including OpenAI, LangChain, and LlamaIndex. Get detailed traces showing token usage, latency, and execution paths for every request—no black boxes."
  },
  {
    icon: Database,
    title: "Intelligent Prompt Management",
    description: "Version, compare, and deploy prompts with MLflow's prompt registry. Track performance across prompt variations and maintain audit trails for production systems."
  },
  {
    icon: Shield,
    title: "Automated Quality Assurance",
    description: "Build confidence with LLM judges and automated evaluation. Run systematic tests on every change and track quality metrics over time to prevent regressions."
  },
  {
    icon: Zap,
    title: "Framework-Agnostic Integration",
    description: "Use any LLM framework or provider without vendor lock-in. MLflow works with your existing tools while providing unified tracking, evaluation, and deployment."
  }
]} />

## Start Building Production GenAI Applications

MLflow transforms GenAI development from complex instrumentation to simple, one-line integrations. See how easy it is to add comprehensive observability, evaluation, and deployment to your AI applications. Visit the [Tracing guide](/genai/tracing) for more information.

### Add Complete Observability in One Line

Transform any GenAI application into a fully observable system:

```python
import mlflow

# Enable automatic tracing for your framework
mlflow.openai.autolog()  # For OpenAI
mlflow.langchain.autolog()  # For LangChain
mlflow.llama_index.autolog()  # For LlamaIndex
mlflow.dspy.autolog()  # For DSPy

# Your existing code now generates detailed traces
from openai import OpenAI

client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Explain quantum computing"}],
)
# ✅ Automatically traced: tokens, latency, cost, full request/response
```

No code changes required. Every LLM call, tool interaction, and prompt execution is automatically captured with detailed metrics.

### Manage and Optimize Prompts Systematically

Register prompts and automatically optimize them with data-driven techniques. See the [Prompt Registry](/genai/prompt-registry/create-and-edit-prompts) guide for comprehensive prompt management:

```python
import mlflow
import openai
from mlflow.genai.optimize import GepaPromptOptimizer
from mlflow.genai.scorers import Correctness

# Register an initial prompt
prompt = mlflow.genai.register_prompt(
    name="math_tutor",
    template="Answer this math question: {{question}}. Provide a clear explanation.",
)


# Define prediction function that includes prompt.format() call for your target prompt(s)
def predict_fn(question: str) -> str:
    prompt = mlflow.genai.load_prompt("prompts:/math_tutor@latest")
    completion = openai.OpenAI().chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt.format(question=question)}],
    )
    return completion.choices[0].message.content


# Prepare training data with inputs and expectations
train_data = [
    {
        "inputs": {"question": "What is 15 + 27?"},
        "expectations": {"expected_response": "42"},
    },
    {
        "inputs": {"question": "Calculate 8 × 9"},
        "expectations": {"expected_response": "72"},
    },
    {
        "inputs": {"question": "What is 100 - 37?"},
        "expectations": {"expected_response": "63"},
    },
    # ... more examples
]

# Automatically optimize the prompt using MLflow + GEPA
result = mlflow.genai.optimize_prompts(
    predict_fn=predict_fn,
    train_data=train_data,
    prompt_uris=[prompt.uri],
    optimizer=GepaPromptOptimizer(reflection_model="openai:/gpt-4o-mini"),
    scorers=[Correctness(model="openai:/gpt-4o-mini")],
)

# The optimized prompt is automatically registered as a new version
optimized_prompt = result.optimized_prompts[0]
print(f"Optimized prompt registered as version {optimized_prompt.version}")
print(f"Template: {optimized_prompt.template}")
print(f"Score: {result.final_eval_score}")
```

Transform manual prompt engineering into systematic, data-driven optimization with automatic performance tracking. Learn more in the [Optimize Prompts](/genai/prompt-registry/optimize-prompts) guide.

### Prerequisites

Ready to get started? You'll need:

- Python 3.10+ installed
- MLflow 3.5+ (`pip install --upgrade mlflow`)
- API access to an LLM provider (OpenAI, Anthropic, etc.)

---

## Essential Learning Path

Master these core capabilities to build robust GenAI applications with MLflow. Start with observability, then add systematic evaluation and deployment.

<TilesGrid>
  <TileCard
    icon={PlayCircle}
    iconSize={48}
    title="Environment Setup"
    description="Configure MLflow tracking, connect to registries, and set up your development environment for GenAI workflows"
    href="/genai/getting-started/connect-environment"
    linkText="Start setup →"
    containerHeight={64}
  />
  <TileCard
    icon={Eye}
    iconSize={48}
    title="Observability with Tracing"
    description="Auto-instrument your GenAI application to capture every LLM call, prompt, and tool interaction for complete visibility"
    href="/genai/tracing/quickstart"
    linkText="Learn tracing →"
    containerHeight={64}
  />
  <TileCard
    icon={TestTube}
    iconSize={48}
    title="Systematic Evaluation"
    description="Build confidence with LLM judges and automated testing to catch quality issues before production"
    href="/genai/eval-monitor"
    linkText="Start evaluating →"
    containerHeight={64}
  />
</TilesGrid>

These three foundations will give you the observability and quality confidence needed for production GenAI development. Each tutorial includes real code examples and best practices from production deployments.

---

## Advanced GenAI Capabilities

Once you've mastered the essentials, explore these advanced features to build sophisticated GenAI applications with enterprise-grade reliability.

<TilesGrid>
  <TileCard
    icon={Database}
    iconSize={48}
    title="Prompt Registry & Management"
    description="Version prompts, A/B test variations, and maintain audit trails for production prompt management"
    href="/genai/prompt-registry/prompt-engineering"
    linkText="Manage prompts →"
    containerHeight={64}
  />
  <TileCard
    icon={Target}
    iconSize={48}
    title="Automated Prompt Optimization"
    description="Automatically improve prompts using DSPy's MIPROv2 algorithm with data-driven optimization and performance tracking"
    href="/genai/prompt-registry/optimize-prompts"
    linkText="Optimize prompts →"
    containerHeight={64}
  />
  <TileCard
    icon={Rocket}
    iconSize={48}
    title="Model Deployment"
    description="Deploy GenAI models to production with built-in serving, scaling, and monitoring capabilities"
    href="/genai/serving"
    linkText="Deploy models →"
    containerHeight={64}
  />
</TilesGrid>

These capabilities enable you to build production-ready GenAI applications with systematic quality management and robust deployment infrastructure.

---

## Framework-Specific Integration Guides

MLflow provides deep integrations with popular GenAI frameworks. Choose your framework to get started with optimized instrumentation and best practices.

<TilesGrid>
  <TileCard
    image="/images/logos/langchain-logo.png"
    iconSize={48}
    title="LangChain Integration"
    description="Auto-trace chains, agents, and tools with comprehensive LangChain instrumentation"
    href="/genai/flavors/langchain"
    linkText="Use LangChain →"
    containerHeight={64}
  />
  <TileCard
    image="/images/logos/llamaindex-logo.svg"
    iconSize={48}
    title="LlamaIndex Integration"
    description="Instrument RAG pipelines and document processing workflows with LlamaIndex support"
    href="/genai/flavors/llama-index"
    linkText="Use LlamaIndex →"
    containerHeight={64}
  />
  <TileCard
    icon={Code2}
    iconSize={48}
    title="DSPy Integration"
    description="Build systematic prompt optimization workflows with DSPy modules and MLflow prompt registry"
    href="/genai/flavors/dspy"
    linkText="Use DSPy →"
    containerHeight={64}
  />
  <TileCard
    icon={Code2}
    iconSize={48}
    title="Custom Framework Support"
    description="Instrument any LLM framework or build custom integrations with MLflow's flexible APIs"
    href="/genai/flavors/chat-model-intro"
    linkText="Build custom →"
    containerHeight={64}
  />
</TilesGrid>

Each integration guide includes framework-specific examples, best practices, and optimization techniques for production deployments.

---

## Start Your GenAI Journey with MLflow

Ready to build production-ready GenAI applications? Start with the Environment Setup guide above, then explore tracing for complete observability into your AI systems. Join thousands of engineers who trust MLflow's open source platform for their GenAI development.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/genai/getting-started/databricks-trial/index.mdx

```text
---
sidebar_position: 2
---

import { APILink } from "@site/src/components/APILink";

# Try Managed MLflow

The [Databricks Free Trial](https://docs.databricks.com/en/getting-started/free-trial.html) offers an opportunity to experience the Databricks platform without prior cloud provider access.
Most Databricks features, including full MLflow functionality are available during the trial period, allowing you to explore the platform with trial credits.
You create account with your email only and won't get charged unless you decide to upgrade to a paid plan and register your payment information.

## Start your trial

To get started with Databricks Free Trial, visit the [Databricks Trial Signup Page](https://signup.databricks.com/?destination_url=/ml/experiments-signup?source=OSS_DOCS&dbx_source=TRY_MLFLOW&signup_experience_step=EXPRESS&provider=MLFLOW&utm_source=OSS_DOCS)
and follow the instructions outlined there. It takes about 5 minutes to set up, after which you'll have access to a nearly fully-functional Databricks Workspace for logging your tutorial experiments, traces, models, and artifacts.

:::tip
Do you already have a Databricks trial account? [Click here](https://login.databricks.com/?destination_url=/ml/experiments&dbx_source=MLFLOW_DOCS&source=MLFLOW_DOCS) if you'd like to login and get back to the MLflow UI.
:::

## First Steps

When you login for the first time, you will be directed to the MLflow Tracing tutorial, giving you an opportunity to try out one of the most powerful GenAI features that MLflow has to offer.

Simply click on either of the two tutorials and you will be able to test out MLflow's instrumentation capabilities within minutes.

<figure>
  ![MLflow Tracing Tutorial](/images/tutorials/introductory/lighthouse/tracing-tutorial.png)
  <figcaption style={{ textAlign: "center" }}>Learn Tracing within Databricks MLflow UI</figcaption>
</figure>

## Navigating the Databricks UI

Otherwise, once you log in to the Databricks Workspace on subsequent visits, you will see a landing page like this:

<figure>
  ![Databricks Trial Landing Page](/images/tutorials/introductory/lighthouse/landing-page.png)
  <figcaption style={{ textAlign: "center" }}>Databricks Landing Page</figcaption>
</figure>

In order to get to the MLflow UI, you can navigate to it by clicking on the "Experiments" link on the left-hand side (denoted by the laboratory beaker icon).
When you get to the MLflow UI on Databricks for the first time, you'll see this:

<figure>
  ![Databricks Trial MLflow UI](/images/tutorials/introductory/lighthouse/experiments-page.png)
    <figcaption style={{ textAlign: "center" }}>Databricks MLflow UI</figcaption>
</figure>

## Decisions about where to run your Notebook

With a Databricks managed instance of MLflow, you have two options for running the tutorial notebooks: importing notebooks directly into Databricks Workspace or running notebooks locally and using Databricks Workspace as a remote tracking server.

### Importing Notebooks directly into Databricks Workspace

Once you're at the main page of the Databricks Workspace, you can import any of the notebooks within this tutorial.
Firstly, click "Download this Notebook" button in a tutorial page to download the tutorial notebook.
Then navigate to the "Workspace" tab on the left and click that link to open the workspace page.
From there, navigate to `Home` and you can right click to bring up the "Import" option.
The below image shows what the import dialog should look like if you're going to directly import a notebook from the MLflow documentation website:

![Databricks Workspace import Notebook from MLflow docs website](/images/tutorials/introductory/lighthouse/import-notebook.png)

At this point, you can simply just run the tutorial.
Any calls to MLflow for creating experiments, initiating runs, logging metadata, and saving artifacts will be fully managed for you and your logging history will appear within the MLflow UI.

:::note
On the Databricks platform, an MLflow experiment is automatically created for each notebook and you can skip `mlflow.set_tracking_uri()` and `mlflow.set_experiment()` calls in tutorials.
:::

### Running Notebooks locally and using Databricks Workspace as a remote tracking server

In order to stay within the comfortable confines of your local machine and still have the use of the managed MLflow Tracking Server, you need to:

- Generate a Personal Access Token (PAT)
- Set up Databricks workspace authentication in your dev environment.
- Connect to your Databricks Workspace in your MLflow experiment session.

#### Generate a PAT

If you are following along in the Tracing Tutorial, these steps are handled for you in both tutorials within the product. You can generate a remote access token directly within the tutorial.

Otherwise, follow the steps in [this guide](https://docs.databricks.com/aws/en/dev-tools/auth/pat) to create a PAT for remotely accessing your Databricks Workspace.

#### Install Dependencies

Run the following command in your dev environment to install dependencies.

```bash
%pip install -q mlflow
```

#### Set Up Authentication to a Databricks Workspace

To set up Databricks Workspace authentication, we can use the API <APILink fn="mlflow.login" />, which will prompt you for required information:

- **Databricks Host**: Use "https://\<your workspace host\>.cloud.databricks.com/
- **Token**: Your personal access token for your Databricks Workspace.

If the authentication succeeds, you should see a message "Successfully signed in to Databricks!".

```python
import mlflow

mlflow.login()
```

```
2025/02/19 12:25:04 INFO mlflow.utils.credentials: No valid Databricks credentials found, please enter your credentials...
Databricks Host (should begin with https://):  https://<your workspace host>.cloud.databricks.com/
Token:  ········
2025/02/19 12:26:24 INFO mlflow.utils.credentials: Successfully connected to MLflow hosted tracking server! Host: https://<your workspace host>.cloud.databricks.com.
```

#### Connect MLflow Session to Databricks Workspace

We have set up the credentials, now we need to tell MLflow to send the data into Databricks Workspace.
To do so, we will use `mlflow.set_tracking_uri("databricks")` to port MLflow to Databricks Workspace. Basically
it is the command below. Please note that you need to always use _"databricks"_ as the keyword.

```python
mlflow.set_tracking_uri("databricks")
```

Now you are ready to go! Let's try starting an MLflow experiment and log some dummy metrics and view it in the UI.

#### Log Artifacts to Unity Catalog (Optional)

In order to keep all of your artifacts within a single place, you can opt to use Unity Catalog's Volumes feature.
Firstly, you need to create a Unity Catalog Volume `test.mlflow.check-databricks-connection` by following [this guide](https://docs.databricks.com/aws/en/volumes/utility-commands#create-a-volume).
Then, you can run the following code to start an experiment with the Unity Catalog Volume and log metrics to it.
Note that your experiment name must follow the `/Users/<your email>/<experiment_name>` format when using a Databricks Workspace.

```python
mlflow.create_experiment(
    "/Users/<your email>/check-databricks-connection",
    artifact_location="dbfs:/Volumes/test/mlflow/check-databricks-connection",
)
mlflow.set_experiment("/Users/<your email>/check-databricks-connection")

with mlflow.start_run():
    mlflow.log_metric("foo", 1)
    mlflow.log_metric("bar", 2)
```

```
2025/02/19 12:26:33 INFO mlflow.tracking.fluent: Experiment with name '/Users/<your email>/check-databricks-connection' does not exist. Creating a new experiment.
```

#### View Your Experiment on your Databricks Workspace

Now let's navigate to your Databricks Workspace to view the experiment result. Log in to your
Databricks Workspace, and click on top left to select machine learning
in the drop down list. Then click on the experiment icon. See the screenshot below:

<div className="center-div" style={{ width: 800, maxWidth: "100%" }}>
  ![Landing page of Databricks MLflow server](/images/quickstart/tracking-server-overview/databricks-lighthouse-landing-page.png)
</div>

In the "Experiments" view, you should be able to find the experiment "check-databricks-connection", similar to

<div className="center-div" style={{ width: 800, maxWidth: "100%" }}>
  ![Experiment view of Databricks MLflow server](/images/quickstart/tracking-server-overview/databricks-lighthouse-experiment-view.png)
</div>

Clicking on the run name, in our example it is "skillful-jay-111" (it's a randomly generated name, you will see
a different name in your Databricks console), will bring you to the run view, similar to

<div className="center-div" style={{ width: 800, maxWidth: "100%" }}>
  ![Run view of Databricks MLflow server](/images/quickstart/tracking-server-overview/databricks-lighthouse-run-view.png)
</div>

In the run view, you will see your dummy metrics _"foo"_ and _"bar"_ are logged successfully.

At this point, you're ready to go! You can run any of the tutorials locally and they will log to the managed MLflow Tracking Server.
```

--------------------------------------------------------------------------------

---[FILE: unity-catalog.mdx]---
Location: mlflow-master/docs/docs/genai/governance/unity-catalog.mdx

```text
# Unity Catalog Integration

:::warning Deprecated

Unity Catalog function integration via the MLflow AI Gateway is deprecated and will be removed in a future release.

:::

This example illustrates the use of the [Unity Catalog (UC)](https://docs.databricks.com/en/data-governance/unity-catalog/index.html) integration with the MLflow AI Gateway.
This integration enables you to leverage functions registered in Unity Catalog as tools for enhancing your chat application.

## Pre-requisites

1. Clone the MLflow repository:

To download the files required for this example, clone the MLflow repository:

```bash
git clone --depth=1 https://github.com/mlflow/mlflow.git
cd mlflow
```

If you don't have `git`, you can download the repository as a zip file from https://github.com/mlflow/mlflow/archive/refs/heads/master.zip.

2. Install the required packages:

```bash
pip install mlflow>=2.14.0 openai databricks-sdk
```

3. Create the UC function used in [the example script](https://github.com/mlflow/mlflow/blob/master/examples/gateway/uc_functions/run.py) in your Databricks workspace by running the following SQL command:

```sql
CREATE OR REPLACE FUNCTION
my.uc_func.add (
  x INTEGER COMMENT 'The first number to add.',
  y INTEGER COMMENT 'The second number to add.'
)
RETURNS INTEGER
LANGUAGE SQL
RETURN x + y
```

To define your own function, see https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-create-sql-function.html#create-function-sql-and-python.

4. Create a SQL warehouse by following the instructions at https://docs.databricks.com/en/compute/sql-warehouse/create.html.

## Running the gateway server

Once you have completed the pre-requisites, you can start the gateway server:

```bash
# Required to authenticate with Databricks. See https://docs.databricks.com/en/dev-tools/auth/index.html#supported-authentication-types-by-databricks-tool-or-sdk for other authentication methods.
export DATABRICKS_HOST="..."
export DATABRICKS_TOKEN="..."

# Required to execute UC functions. See https://docs.databricks.com/en/integrations/compute-details.html#get-connection-details-for-a-databricks-compute-resource for how to get the http path of your warehouse.
# The last part of the http path is the warehouse ID.
#
# /sql/1.0/warehouses/1234567890123456
#                     ^^^^^^^^^^^^^^^^
export DATABRICKS_WAREHOUSE_ID="..."

# Required to authenticate with OpenAI.
# See https://platform.openai.com/docs/guides/authentication for how to get your API key.
export OPENAI_API_KEY="..."

# Enable Unity Catalog integration
export MLFLOW_ENABLE_UC_FUNCTIONS=true

# Run the server
mlflow gateway start --config-path examples/gateway/deployments_server/openai/config.yaml --port 7000
```

## Query the Endpoint with UC Function

Once the server is running, you can run the example script:

```bash
# `run.py` uses the `openai.OpenAI` client to query the gateway server,
# but it throws an error if the `OPENAI_API_KEY` environment variable is not set.
# To avoid this error, use a dummy API key.
export OPENAI_API_KEY="test"

# Replace `my.uc_func.add` if your UC function has a different name
python examples/gateway/uc_functions/run.py  --uc-function-name my.uc_func.add
```

## What's happening under the hood?

When MLflow AI Gateway receives a request with `tools` containing `uc_function`, it automatically fetches the UC function metadata to construct the function schema,
query the chat API to figure out the parameters required to call the function, and then call the function with the provided parameters.

```python
uc_function = {
    "type": "uc_function",
    "uc_function": {
        "name": args.uc_function_name,
    },
}

resp = client.chat.completions.create(
    model="chat",
    messages=[
        {
            "role": "user",
            "content": "What is the result of 1 + 2?",
        }
    ],
    tools=[uc_function],
)

print(resp.choices[0].message.content)  # -> The result of 1 + 2 is 3
```

The code above is equivalent to the following:

```python
# Function tool schema:
# https://platform.openai.com/docs/api-reference/chat/create#chat-create-tools
function = {
    "type": "function",
    "function": {
        "description": None,
        "name": "my.uc_func.add",
        "parameters": {
            "type": "object",
            "properties": {
                "x": {
                    "type": "integer",
                    "name": "x",
                    "description": "The first number to add.",
                },
                "y": {
                    "type": "integer",
                    "name": "y",
                    "description": "The second number to add.",
                },
            },
            "required": ["x", "y"],
        },
    },
}

messages = [
    {
        "role": "user",
        "content": "What is the result of 1 + 2?",
    }
]

resp = client.chat.completions.create(
    model="chat",
    tools=[function],
)

resp_message = resp.choices[0].message
messages.append(resp_message)
tool_call = tool_calls[0]
arguments = json.loads(tool_call.function.arguments)
result = arguments["x"] + arguments["y"]
messages.append(
    {
        "tool_call_id": tool_call.id,
        "role": "tool",
        "name": "my.uc_func.add",
        "content": str(result),
    }
)

final_resp = client.chat.messages.create(
    model="chat",
    messages=messages,
)

print(final_resp.choices[0].message.content)  # -> The result of 1 + 2 is 3
```
```

--------------------------------------------------------------------------------

---[FILE: configuration.mdx]---
Location: mlflow-master/docs/docs/genai/governance/ai-gateway/configuration.mdx

```text
# AI Gateway Configuration

import TabsWrapper from "@site/src/components/TabsWrapper";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import TilesGrid from "@site/src/components/TilesGrid";
import TileCard from "@site/src/components/TileCard";
import { Play, Book, Wrench } from "lucide-react";

Configure providers, endpoints, and advanced settings for your MLflow AI Gateway.

## Provider Configurations

Configure endpoints for different LLM providers using these YAML examples:

<TabsWrapper>
<Tabs>
<TabItem value="openai" label="OpenAI" default>

```yaml
endpoints:
  - name: gpt4-chat
    endpoint_type: llm/v1/chat
    model:
      provider: openai
      name: gpt-4
      config:
        openai_api_key: $OPENAI_API_KEY
        openai_api_base: https://api.openai.com/v1  # Optional
        openai_organization: your_org_id  # Optional
```

</TabItem>
<TabItem value="azure" label="Azure OpenAI">

```yaml
endpoints:
  - name: azure-chat
    endpoint_type: llm/v1/chat
    model:
      provider: azuread
      name: gpt-35-turbo
      config:
        openai_api_key: $AZURE_OPENAI_API_KEY
        openai_api_base: https://your-resource.openai.azure.com/
        openai_api_version: "2023-05-15"
        openai_deployment_name: your-deployment-name
```

</TabItem>
<TabItem value="anthropic" label="Anthropic">

```yaml
endpoints:
  - name: claude-chat
    endpoint_type: llm/v1/chat
    model:
      provider: anthropic
      name: claude-2
      config:
        anthropic_api_key: $ANTHROPIC_API_KEY
```

</TabItem>
<TabItem value="gemini" label="Gemini">

```yaml
endpoints:
  - name: gemini-chat
    endpoint_type: llm/v1/chat
    model:
      provider: gemini
      name: gemini-2.5-flash
      config:
        gemini_api_key: $GEMINI_API_KEY
```

</TabItem>
<TabItem value="bedrock" label="AWS Bedrock">

```yaml
endpoints:
  - name: bedrock-chat
    endpoint_type: llm/v1/chat
    model:
      provider: bedrock
      name: anthropic.claude-instant-v1
      config:
        aws_config:
          aws_access_key_id: $AWS_ACCESS_KEY_ID
          aws_secret_access_key: $AWS_SECRET_ACCESS_KEY
          aws_region: us-east-1
```

</TabItem>
<TabItem value="cohere" label="Cohere">

```yaml
endpoints:
  - name: cohere-completions
    endpoint_type: llm/v1/completions
    model:
      provider: cohere
      name: command
      config:
        cohere_api_key: $COHERE_API_KEY

  - name: cohere-embeddings
    endpoint_type: llm/v1/embeddings
    model:
      provider: cohere
      name: embed-english-v2.0
      config:
        cohere_api_key: $COHERE_API_KEY
```

</TabItem>
<TabItem value="mosaicai" label="MosaicAI">

```yaml
endpoints:
  - name: mosaicai-chat
    endpoint_type: llm/v1/chat
    model:
      provider: mosaicai
      name: llama2-70b-chat
      config:
        mosaicai_api_key: $MOSAICAI_API_KEY
```

</TabItem>
<TabItem value="databricks" label="Databricks">

Databricks [Foundation Models APIs](https://docs.databricks.com/aws/en/machine-learning/foundation-model-apis/) are compatible with the OpenAI Chat Completions API, so you can use them with `openai` provider in the AI Gateway. Specify the endpoint name (e.g., `databricks-claude-sonnet-4`) in the `name` field and set the host and token as OpenAI API key and base URL respectively.

```yaml
endpoints:
  - name: databricks-chat
    endpoint_type: llm/v1/chat
    model:
      provider: openai
      name: databricks-claude-sonnet-4
      config:
        openai_api_key: $DATABRICKS_TOKEN
        openai_api_base: https://your-workspace.cloud.databricks.com/serving-endpoints/  # Replace with your Databricks workspace URL
```

</TabItem>
<TabItem value="mlflow" label="MLflow Models">

```yaml
endpoints:
  - name: custom-model
    endpoint_type: llm/v1/chat
    model:
      provider: mlflow-model-serving
      name: my-model
      config:
        model_server_url: http://localhost:5001
```

</TabItem>
</Tabs>
</TabsWrapper>

:::note
MosaicML PaLM, and Cohere providers are deprecated, will be removed in a future MLflow version.
:::

## Environment Variables

Store API keys as environment variables for security:

```bash
# OpenAI
export OPENAI_API_KEY=sk-...

# Azure OpenAI
export AZURE_OPENAI_API_KEY=your-azure-key
export AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/

# Anthropic
export ANTHROPIC_API_KEY=sk-ant-...

# AWS Bedrock
export AWS_ACCESS_KEY_ID=AKIA...
export AWS_SECRET_ACCESS_KEY=...
export AWS_REGION=us-east-1

# Cohere
export COHERE_API_KEY=...
```

## Advanced Configuration

### Rate Limiting

Configure rate limits per endpoint:

```yaml
endpoints:
  - name: rate-limited-chat
    endpoint_type: llm/v1/chat
    model:
      provider: openai
      name: gpt-3.5-turbo
      config:
        openai_api_key: $OPENAI_API_KEY
    limit:
      renewal_period: minute
      calls: 100  # max calls per renewal period
```

### Model Parameters

Set default model parameters:

```yaml
endpoints:
  - name: configured-chat
    endpoint_type: llm/v1/chat
    model:
      provider: openai
      name: gpt-3.5-turbo
      config:
        openai_api_key: $OPENAI_API_KEY
        temperature: 0.7
        max_tokens: 1000
        top_p: 0.9
```

### Multiple Endpoints

Configure multiple endpoints for different use cases:

```yaml
endpoints:
  # Fast, cost-effective endpoint
  - name: fast-chat
    endpoint_type: llm/v1/chat
    model:
      provider: openai
      name: gpt-3.5-turbo
      config:
        openai_api_key: $OPENAI_API_KEY

  # High-quality endpoint
  - name: quality-chat
    endpoint_type: llm/v1/chat
    model:
      provider: openai
      name: gpt-4
      config:
        openai_api_key: $OPENAI_API_KEY

  # Embeddings endpoint
  - name: embeddings
    endpoint_type: llm/v1/embeddings
    model:
      provider: openai
      name: text-embedding-ada-002
      config:
        openai_api_key: $OPENAI_API_KEY
```

### Traffic route

Add the `routes` configuration to split incoming traffic to multiple endpoints:

```yaml
endpoints:
  - name: chat1
    endpoint_type: llm/v1/chat
    model:
      provider: openai
      name: gpt-5
      config:
        openai_api_key: $OPENAI_API_KEY

  - name: chat2
    endpoint_type: llm/v1/chat
    model:
      provider: openai
      name: gpt-4.1
      config:
        openai_api_key: $OPENAI_API_KEY

routes:
  - name: chat-route
    task_type: llm/v1/chat
    destinations:
      - name: chat1
        traffic_percentage: 80
      - name: chat2
        traffic_percentage: 20
    routing_strategy: TRAFFIC_SPLIT
```

Currently, MLflow only support the `TRAFFIC_SPLIT` strategy which randomly route incoming requests based on the configured percentage.

## Dynamic Configuration Updates

The AI Gateway supports hot-reloading of configurations without server restart. Simply update your config.yaml file and changes are detected automatically.

## Security Best Practices

### API Key Management

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive credentials
3. **Rotate keys regularly** and update environment variables
4. **Use separate keys** for development and production

### Network Security

1. **Use HTTPS** in production with proper TLS certificates
2. **Implement authentication** and authorization layers
3. **Configure firewalls** to restrict access to the gateway
4. **Monitor and log** all gateway requests for audit trails

### Configuration Security

```yaml
# Secure configuration example
endpoints:
  - name: production-chat
    endpoint_type: llm/v1/chat
    model:
      provider: openai
      name: gpt-4
      config:
        openai_api_key: $OPENAI_API_KEY  # From environment
    limit:
      renewal_period: minute
      calls: 1000
```

## Next Steps

Now that your providers are configured, learn how to use and integrate your gateway:

<TilesGrid>
  <TileCard
    icon={Play}
    title="Usage Guide"
    description="Query endpoints with Python client and REST APIs"
    href="/genai/governance/ai-gateway/usage"
    linkText="Start using →"
  />
  <TileCard
    icon={Wrench}
    title="Integration Guide"
    description="Integrate with applications, frameworks, and production systems"
    href="/genai/governance/ai-gateway/integration"
    linkText="Learn integrations →"
  />
  <TileCard
    icon={Book}
    title="Tutorial"
    description="Step-by-step walkthrough with examples"
    href="/genai/governance/ai-gateway"
    linkText="Follow tutorial →"
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

````
