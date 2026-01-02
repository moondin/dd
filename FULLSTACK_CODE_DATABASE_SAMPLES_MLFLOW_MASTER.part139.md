---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 139
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 139 of 991)

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
Location: mlflow-master/docs/docs/prompts/index.mdx

```text
---
sidebar_position: 1
sidebar_label: Overview
---

import { APILink } from "@site/src/components/APILink";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Prompt Management in MLflow

## What is MLflow Prompt Registry?

**MLflow Prompt Registry** is a powerful tool that streamlines prompt engineering and management in your Generative AI (GenAI) applications. It enables you to version, track, and reuse prompts across your organization, helping maintain consistency and improving collaboration in prompt development.

:::tip Key Features

- **Reusability** - Store and manage prompts in a centralized registry and reuse them across multiple applications.
- **Version Control** - Track the evolution of your prompts with Git-inspired commit-based versioning and side-by-side comparison of prompt versions with diff highlighting.
- **Aliasing** - Build robust yet flexible deployment pipelines for prompts using aliases, allowing you to isolate prompt versions from main application code and perform tasks such as A/B testing and roll-backs with ease.
- **Lineage** - Seamlessly integrate with MLflow's existing features such as model tracking and evaluation for end-to-end GenAI lifecycle management.
- **Collaboration** - Share prompts across your organization with a centralized registry, enabling teams to build upon each other's work.

:::

## Getting started

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

      :::note

          Prompt template text can contain variables in `{{variable}}` format. These variables can be filled with dynamic content when using the prompt in your GenAI application. MLflow also provides a [utility method](/prompts/#q-can-i-use-prompt-templates-with-frameworks-like-langchain-or-llamaindex)
          to convert template into single brace format for frameworks like LangChain or LlamaIndex.

      :::

    </div>

  </TabItem>
  <TabItem value="python" label="Python" default>
    <div class="flex-column">
      To create a new prompt using the Python API, use <APILink fn="mlflow.genai.register_prompt" /> API:

      ```python
      import mlflow
      from pydantic import BaseModel

      # Use double curly braces for variables in the template
      initial_template = """\
      Summarize content you are provided with in {{ num_sentences }} sentences.

      Sentences: {{ sentences }}
      """


      # Define response format for structured output
      class SummaryResponse(BaseModel):
          summary: str
          key_points: list[str]
          word_count: int


      # Register a text prompt
      text_prompt = mlflow.genai.register_prompt(
          name="summarization-prompt",
          template=initial_template,
          # Optional: Provide response format
          response_format=SummaryResponse,
          # Optional: Provide a commit message to describe the changes
          commit_message="Initial commit",
          # Optional: Specify any additional metadata about the prompt version
          tags={
              "author": "author@example.com",
          },
          # Optional: Set tags applies to the prompt (across versions)
          tags={
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

This creates a new prompt with the specified template text and metadata. The prompt is now available in the MLflow UI for further management.

<div style={{ width: "90%", margin: "10px" }}>
![Registered Prompt in UI](/images/llms/prompt-registry/registered-prompt.png)
</div>

### 2. Update the Prompt with a New Version

<Tabs>
  <TabItem value="ui" label="UI" default>
    <div class="flex-column">
      <div style={{ width: "70%", margin: "20px" }}>
        ![Update Prompt UI](/images/llms/prompt-registry/update-prompt-ui.png)
      </div>

      1. The previous step leads to the created prompt page. (If you closed the page, navigate to the **Prompts** tab in the MLflow UI and click on the prompt name.)
      2. Click on the **Create prompt Version** button.
      3. The popup dialog is pre-filled with the existing prompt text. Modify the prompt as you wish.
      4. Click **Create** to register the new version.

    </div>

  </TabItem>
  <TabItem value="python" label="Python" default>
    <div class="flex-column">
      To update an existing prompt with a new version, use the <APILink fn="mlflow.genai.register_prompt"/> API with the existing prompt name:

      ```python
      import mlflow
      from pydantic import BaseModel

      new_template = """\
      You are an expert summarizer. Condense the following content into exactly {{ num_sentences }} clear and informative sentences that capture the key points.

      Sentences: {{ sentences }}

      Your summary should:
      - Contain exactly {{ num_sentences }} sentences
      - Include only the most important information
      - Be written in a neutral, objective tone
      - Maintain the same level of formality as the original text
      """


      # Enhanced response format
      class EnhancedSummaryResponse(BaseModel):
          summary: str
          key_points: list[str]
          word_count: int
          confidence_score: float
          reading_level: str


      # Register a new version of an existing prompt
      updated_text_prompt = mlflow.genai.register_prompt(
          name="summarization-prompt",  # Specify the existing prompt name
          template=new_template,
          response_format=EnhancedSummaryResponse,
          commit_message="Improvement",
          tags={
              "author": "author@example.com",
          },
      )
      ```
    </div>

  </TabItem>
</Tabs>

### 3. Compare the Prompt Versions

Once you have multiple versions of a prompt, you can compare them to understand the changes between versions. To compare prompt versions in the MLflow UI, click on the **Compare** tab in the prompt details page:

<div style={{ width: "90%", margin: "10px" }}>
  ![Compare Prompt Versions](/images/llms/prompt-registry/compare-prompt-versions.png)
</div>

### 4. Load and Use the Prompt

To use a prompt in your GenAI application, you can load it with the <APILink fn="mlflow.genai.load_prompt"/> API and fill in the variables using the <APILink fn="mlflow.entities.Prompt.format"/> method of the prompt object:

```python
import mlflow
import openai

target_text = """
MLflow is an open source platform for managing the end-to-end machine learning lifecycle.
It tackles four primary functions in the ML lifecycle: Tracking experiments, packaging ML
code for reuse, managing and deploying models, and providing a central model registry.
MLflow currently offers these functions as four components: MLflow Tracking,
MLflow Projects, MLflow Models, and MLflow Registry.
"""

# Load the prompt (latest version)
prompt = mlflow.genai.load_prompt("prompts:/summarization-prompt@latest")
# Or load a specific version of the prompt
# prompt = mlflow.genai.load_prompt("prompts:/summarization-prompt/2")

# Use the prompt with an LLM
client = openai.OpenAI()
response = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": prompt.format(num_sentences=1, sentences=target_text),
        }
    ],
    model="gpt-4o-mini",
)

print(response.choices[0].message.content)
```

### 5. Search Prompts

You can discover prompts by name, tag or other registry fields:

<Tabs>
  <TabItem value="python" label="Python" default>

{/* prettier-ignore-start */}

```python
import mlflow

# Fluent API: returns a flat list of all matching prompts
prompts = mlflow.genai.search_prompts(filter_string="task='summarization'")
print(f"Found {len(prompts)} prompts")

# For pagination control, use the client API:
from mlflow.tracking import MlflowClient

client = MlflowClient()
all_prompts = []
token = None
while True:
    page = client.search_prompts(
        filter_string="task='summarization'",
        max_results=50,
        page_token=token,
    )
    all_prompts.extend(page)
    token = page.token
    if not token:
        break
print(f"Total prompts across pages: {len(all_prompts)}")
```

{/* prettier-ignore-end */}

</TabItem> </Tabs>

## Prompt Object

The `Prompt` object is the core entity in MLflow Prompt Registry. It represents a versioned template text that can contain variables for dynamic content.

Key attributes of a Prompt object:

- `Name`: A unique identifier for the prompt.
- `Template`: The content of the prompt, which can be either:
  - A string containing text with variables in `{{variable}}` format (text prompts)
  - A list of dictionaries representing chat messages with 'role' and 'content' keys (chat prompts)
- `Version`: A sequential number representing the revision of the prompt.
- `Commit Message`: A description of the changes made in the prompt version, similar to Git commit messages.
- `Version Metadata`: Optional key-value pairs for adding metadata to the prompt version. For example, you may use this for tracking the author of the prompt version.
- `Tags`: Optional key-value pairs assigned at the prompt level (across versions)
  for categorization and filtering. For example, you may add tags for project name, language, etc, which apply to all versions of the prompt.
- `Alias`: An mutable named reference to the prompt. For example, you can create an alias named `production` to refer to the version used in your production system. See [Aliases](/prompts/cm#aliases) for more details.

## FAQ

#### Q: How do I delete a prompt version?

A: You can delete a prompt version using the MLflow UI or Python API:

```python
import mlflow

# Delete a prompt version
client = mlflow.MlflowClient()
client.delete_prompt_version("summarization-prompt", version=2)
```

To avoid accidental deletion, you can only delete one version at a time via API. If you delete the all versions of a prompt, the prompt itself will be deleted.

#### Q: Can I update the prompt template of an existing prompt version?

A: No, prompt versions are immutable once created. To update a prompt, create a new version with the desired changes.

#### Q: Can I use prompt templates with frameworks like LangChain or LlamaIndex?

A: Yes, you can load prompts from MLflow and use them with any framework. For example, the following example demonstrates how to use a prompt registered in MLflow with LangChain. Also refer to [Logging Prompts with LangChain](/prompts/run-and-model#example-1-logging-prompts-with-langchain) for more details.

```python
import mlflow
from langchain.prompts import PromptTemplate

# Load prompt from MLflow
prompt = mlflow.genai.load_prompt("question_answering")

# Convert the prompt to single brace format for LangChain (MLflow uses double braces),
# using the `to_single_brace_format` method.
langchain_prompt = PromptTemplate.from_template(prompt.to_single_brace_format())
print(langchain_prompt.input_variables)
# Output: ['num_sentences', 'sentences']
```

#### Q: Is Prompt Registry integrated with the Prompt Engineering UI?

A. Direct integration between the Prompt Registry and the Prompt Engineering UI is coming soon. In the meantime, you can iterate on prompt template in the Prompt Engineering UI and register the final version in the Prompt Registry by manually copying the prompt template.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/quickstart_drilldown/index.mdx

```text
---
sidebar_custom_props:
  hide: true
displayed_sidebar: docsSidebar
---

import { APILink } from "@site/src/components/APILink";
import { Table } from "@site/src/components/Table";

# Quickstart options and troubleshooting

{/** Eventually, these H2s will probably all be separate articles. For now, I'm
avoiding that so as not to create a bunch of super-skinny pages. **/}

## Customize and troubleshoot MLflow installation \{#quickstart_drilldown_install}

### Python library options

Rather than the default MLflow library, you can install the following variations:

<Table>
  <thead>
    <tr>
      <th>**Name**</th>
      <th>**`pip install` command**</th>
      <th>**Description**</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>mlflow-skinny</td>
      <td>`pip install mlflow-skinny`</td>
      <td>Lightweight MLflow package without SQL storage, server, UI, or data science dependencies.</td>
    </tr>
    <tr>
      <td>mlflow[extras]</td>
      <td>`pip install mlflow[extras]`</td>
      <td>MLflow package with all dependencies needed to run various MLflow flavors. These dependencies are listed in [this document](https://github.com/mlflow/mlflow/blob/master/requirements/extra-ml-requirements.txt).</td>
    </tr>
    <tr>
      <td>In-development version</td>
      <td>`pip install git+https://github.com/mlflow/mlflow.git@master`</td>
      <td>This is the latest version of MLflow, which may be useful for getting hot-fixes or new features.</td>
    </tr>
  </tbody>
</Table>

### Python and Mac OS X

We strongly recommend using a virtual environment manager on Macs. We always recommend
using virtual environments, but they are especially important on Mac OS X because the system
`python` version varies depending on the installation and whether you've installed the Xcode
command line tools. The default environment manager for MLflow is `virtualenv`.
Other popular options are `conda` and `venv`.

### Python

We release MLflow on:

- PyPI (`pip install mlflow`)
- conda-forge (`conda install -c conda-forge mlflow`)

### R and Java

We release MLflow on:

- CRAN (`install.packages("mlflow")`)
- Maven Central (`mlflow-client`, `mlflow-parent`, `mlflow-spark`)

For R, see <APILink fn="mlflow.r" hash="">installing MLflow for R</APILink>.
For Java, see <APILink fn="mlflow.java" hash="">Java API</APILink>.

## Save and serve models \{#quickstart_drilldown_log_and_load_model}

MLflow includes a generic `MLmodel` format for saving **models** from a variety of tools in diverse
**flavors**. For example, many models can be served as Python functions, so an `MLmodel` file can
declare how each model should be interpreted as a Python function in order to let various tools
serve it. MLflow also includes tools for running such models locally and exporting them to Docker
containers or commercial serving platforms.

To illustrate this functionality, the `mlflow.sklearn` flavor can log scikit-learn models as
MLflow artifacts and then load them again for serving. There is an example training application in
[sklearn_logistic_regression/train.py](https://github.com/mlflow/mlflow/tree/master/examples/sklearn_logistic_regression).
To run it, switch to the MLflow repository root and run:

```bash
python examples/sklearn_logistic_regression/train.py
```

When you run the example, it outputs an MLflow run ID for that experiment. If you look at the
`mlflow server`, you will also see that the run saved a **model** folder containing an `MLmodel`
description file and a pickled scikit-learn model. You can pass the run ID and the path of the model
within the artifacts directory (here **model/**) to various tools. For example, MLflow includes a
simple REST server for python-based models:

```bash
mlflow models serve -m --env-manager local runs:/<RUN_ID>/model
```

:::note
By default the server runs on port 5000. If that port is already in use, use the `--port` option to
specify a different port. For example: `mlflow models serve -m runs:/<RUN_ID>/model --port 1234`
:::

Once you have started the server, you can pass it some sample data and see the
predictions.

The following example uses `curl` to send a JSON-serialized pandas DataFrame with the `split`
orientation to the model server. For more information about the input data formats accepted by
the pyfunc model server, see the [MLflow deployment tools documentation](/deployment/deploy-model-locally).

```bash
curl -d '{"dataframe_split": {"columns": ["x"], "data": [[1], [-1]]}}' -H 'Content-Type: application/json' -X POST localhost:5000/invocations
```

which returns:

```bash
[1, 0]
```

For more information, see [MLflow Models](/model).
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/self-hosting/index.mdx

```text
---
title: Self Hosting Overview
sidebar_position: 1
---

# Self-Hosting MLflow

> #### **_The most vendor-neutral MLOps/LLMOps platform in the world._**

MLflow is fully open-source. Thousands of users and organizations run their own MLflow instances to meet their specific needs. Being open-source and trusted by the popular cloud providers, MLflow is the best choice for teams/organizations that worry about vendor lock-in.

:::warning Default Storage Backend Change

As of MLflow 3.7.0, the default tracking backend has changed from file-based storage (`./mlruns`) to SQLite database (`sqlite:///mlflow.db`) for better performance and reliability.

**Existing users:** If you have existing data in `./mlruns`, MLflow will automatically detect and continue using it. No action is required.

**New users:** New MLflow servers will use SQLite by default. To use file-based storage instead, set `MLFLOW_TRACKING_URI=./mlruns` or specify `--backend-store-uri ./mlruns` when starting the server.

For more details and migration guidance, see [GitHub Issue #18534](https://github.com/mlflow/mlflow/issues/18534).

:::

## The Quickest Path: Run `mlflow` Command

The easiest way to start MLflow server is to run the `mlflow` CLI command in your terminal. This is suitable for personal use or small teams.

First, install MLflow with:

```bash
pip install mlflow
```

Then, start the server with:

```bash
mlflow server --port 5000
```

This will start the server and UI at `http://localhost:5000` using SQLite as the backend store (the default). You can connect the client to the server by setting the tracking URI:

```python
import mlflow

mlflow.set_tracking_uri("http://localhost:5000")

# Start tracking!
# Open http://localhost:5000 in your browser to view the UI.
```

Now, you are ready to start your experiment!

- [Tracing QuickStart](/genai/tracing/quickstart/)
- [LLM Evaluation Quickstart](/genai/eval-monitor/quickstart/)
- [Prompt Management Quickstart](/genai/prompt-registry/#getting-started)
- [Model Training Quickstart](/ml/tracking/quickstart/)

:::tip

For production deployments or custom backend configurations, see <ins>[Backend Store](./architecture/backend-store)</ins> documentation.

:::

## Other Deployment Options

### Docker Compose

The MLflow repository includes a ready-to-run Compose project under `docker-compose/` that provisions MLflow, PostgreSQL, and MinIO.

```bash
git clone https://github.com/mlflow/mlflow.git
cd docker-compose
cp .env.dev.example .env
docker compose up -d
```

Read the instructions [here](https://github.com/mlflow/mlflow/tree/master/docker-compose) for more details and configuration options for the docker compose bundle.

### Kubernetes

To deploy on Kubernetes, use the MLflow Helm chart provided by [Bitnami](https://artifacthub.io/packages/helm/bitnami/mlflow) or [Community Helm Charts](https://artifacthub.io/packages/helm/community-charts/mlflow).

### Cloud Services

If you are looking for production-scale deployments without maintenance costs, MLflow is also available as managed services from popular cloud providers.

- [Databricks](https://www.databricks.com/product/managed-mlflow)
- [AWS Sagemaker](https://aws.amazon.com/sagemaker/ai/experiments/)
- [Azure Machine Learning](https://learn.microsoft.com/en-us/azure/machine-learning/concept-mlflow?view=azureml-api-2)
- [Nebius](https://nebius.com/services/managed-mlflow)
- [GCP (GKE)](https://gke-ai-labs.dev/docs/tutorials/frameworks-and-pipelines/mlflow/)

## Architecture

MLflow, at a high level, consists of the following components:

1. **Tracking Server**: The lightweight FastAPI server that serves the MLflow UI and API.
2. **Backend Store**: The Backend Store is relational database (or file system) that stores the metadata of the experiments, runs, traces, etc.
3. **Artifact Store**: The Artifact Store is responsible for storing the large artifacts such as model weights, images, etc.

Each component is designed to be pluggable, so you can customize it to meet your needs. For example, you can start with a single host mode with SQLite backend and local file system for storing artifacts. To scale up, you can switch backend store to PostgreSQL cluster and point artifact store to cloud storage such as S3, GCS, or Azure Blob Storage.

To learn more about the architecture and available backend options, see [Architecture](./architecture/overview).

## Access Control & Security

MLflow support [username/password login](./security/basic-http-auth) via basic HTTP authentication, [SSO (Single Sign-On)](./security/sso), and [custom authentication plugins](./security/custom).

MLflow also provides built-in [network protection](./security/network) middleware to protect your tracking server from network exposure.

:::tip Try Managed MLflow

Need highly secure MLflow server? Check out <ins>[Databricks Managed MLflow](https://www.databricks.com/product/managed-mlflow)</ins> to get fully managed MLflow servers with unified governance and security.

:::

## FAQs

See [Troubleshooting & FAQs](./troubleshooting) for more information.

:::info[ACCESS DENIED?]

When using the remote tracking server, you may hit an access denied error when accessing the MLflow UI
from a browser.

> Invalid Host header - possible DNS rebinding attack detected

This error typically indicates that the tracking server's network security settings need to be configured.
The most common causes are:

- **Host validation**: The `--allowed-hosts` flag restricts which Host headers are accepted
- **CORS restrictions**: The `--cors-allowed-origins` flag controls which origins can make API requests

To resolve this, configure your tracking server with the appropriate flags. For example:

```bash
mlflow server --allowed-hosts "mlflow.company.com,localhost:*" \
              --cors-allowed-origins "https://app.company.com"
```

**Note**: These security options are only available with the default FastAPI-based server (uvicorn). They are
not supported when using Flask directly or with `--gunicorn-opts` or `--waitress-opts`.

Refer to the <ins>[Network Security Guide](/self-hosting/security/network)</ins> for detailed configuration options.

:::
```

--------------------------------------------------------------------------------

---[FILE: migration.mdx]---
Location: mlflow-master/docs/docs/self-hosting/migration.mdx

```text
---
title: Upgrade
---

# How to Upgrade MLflow

MLflow evolves rapidly to provide new features and improve the framework. This document outlines the steps to upgrade self-hosted MLflow servers to the latest version.

## Basic Steps

Upgrading MLflow typically involves the following steps:

1. Stop the server.
2. Upgrade the package version in the environment.
3. Run database migrations (if database backend is used).
4. Restart the server.

:::info

MLflow does not natively support upgrading the server while the server is running. To avoid downtime, upgrade the server in a rolling manner and use load balancer to gradually route traffic from the old servers to the new servers.

:::

## Migrating the database

If you are using a database-backend store, run the following command to apply schema migrations before restarting the server.

```bash
mlflow db upgrade <backend-store-url>
```

The command will update the database schema to the latest version using [Alembic](https://alembic.sqlalchemy.org/).

:::warning important

Schema migrations can be slow and are not guaranteed to be transactional. Always take a backup of the database before running the migration.

:::

## Semantic versioning

MLflow uses [semantic versioning](https://semver.org/) to manage versions and provide clear risk level for users when upgrading MLflow. More specifically, we use the following rules:

The following changes requires a **major version bump**:

- Architecture changes
- Removal of [Public APIs](https://mlflow.org/docs/latest/api_reference/python_api/index.html), except those explicitly declared as experimental.
- Removal/renaming of existing parameters from Public APIs in the breaking manner.

The following changes **do not require a major version bump** and released within a minor version update:

- Database schema changes.
- Adding new APIs.
- Adding new optional parameters to Public APIs.
- Removing experimental APIs or removing/renaming parameters of them.

## Compatibility between MLflow SDK and the Server

MLflow SDK and the server works best if they are in the same version. However, in practice, you may need to deal with a mismatch between the client and server versions. MLflow offers best-effort compatibility between the SDK and the server.

- MLflow tracking server works with the **older** version of the SDK, up to one major version difference (e.g., 2.x to 3.x).
- MLflow tracking server may not work with the **newer** version of the SDK.

For example, you can use MLflow 2.x client SDK to log models to the MLflow 3.x server, because the server is backward compatible. On the other hand, if you upgrade the client SDK to 2.15 to use MLflow Tracing, the server also needs to be newer than 2.15, otherwise the tracing endpoints do not exist.

When making any breaking change, we issue deprecation warning for a few minor versions before the actual change, and announce them in the [release notes](https://github.com/mlflow/mlflow/releases).

## Support

If you are facing any issues during the upgrade, contact to the MLflow team by opening an issue on [GitHub](https://github.com/mlflow/mlflow/issues/new/choose).
```

--------------------------------------------------------------------------------

---[FILE: troubleshooting.mdx]---
Location: mlflow-master/docs/docs/self-hosting/troubleshooting.mdx

```text
---
title: Troubleshooting & FAQs
---

# Troubleshooting & FAQs

This page aggregates common production issues for self-hosted MLflow deployments and how to resolve them.

## MLflow UI/SDK is slow

There are several possible reasons why the your MLflow UI does not perform well, but the most common reason is that the use of default file-based backend store.

When you start the server with `mlflow server` command without any optional configuration, MLflow uses a local file system to store the metadata. This is simple, but severely limits the performance, e.g., no indexing.

We generally recommend using a database-based backend store to get better performance. To get started, run the following command:

```bash
mlflow server --backend-store-uri sqlite:///mlflow.db
```

For connecting to different databases such as PostgreSQL, see [backend store documentation](/self-hosting/architecture/backend-store).

Moreover, if the logging SDK calls are slow (e.g., `mlflow.log_metric`), you can also enable [async logging](https://mlflow.org/docs/latest/api_reference/python_api/mlflow.config.html#mlflow.config.enable_async_logging) to reduce the overhead.

## The database or storage is full. Deleting runs/models does not work.

MLflow uses logical deletion for the Runs and Models to avoid accidental deletion of data. To completely clean up the deleted runs and models, use the [mlflow gc](https://mlflow.org/docs/latest/api_reference/cli.html#mlflow-gc) command.

## Should I use the same MLflow version for the client and the server?

Not necessarily. SDK and the server within the same major version are expected to work together. Also most of APIs are backward compatible between v2 and v3, to make the migration smoother.

That being said, the general recommendation is to keep the client and the server up-to-date to get the latest features and bug fixes. If the backend version is lower than the client version, new features may not be available because of the table definition mismatch.

## Support

If you are facing any issues during the upgrade, contact to the MLflow team by opening an issue on [GitHub](https://github.com/mlflow/mlflow/issues/new/choose).
```

--------------------------------------------------------------------------------

````
