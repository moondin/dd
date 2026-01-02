---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 59
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 59 of 991)

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
Location: mlflow-master/docs/docs/classic-ml/deep-learning/transformers/large-models/index.mdx

```text
import { APILink } from "@site/src/components/APILink";
import { Table } from "@site/src/components/Table";

# Working with Large Models in MLflow Transformers flavor

:::warning
The features described in this guide are intended for advanced users familiar with Transformers and MLflow. Please understand the limitations and potential risks associated with these features before use.
:::

The [MLflow Transformers flavor](/ml/deep-learning/transformers) allows you to track various Transformers models in MLflow. However, logging large models such as Large Language Models (LLMs) can be resource-intensive
due to their size and memory requirements. This guide outlines MLflow's features for reducing memory and disk usage when logging models, enabling you to work with large models in resource-constrained environments.

## Overview

The following table summarizes the different methods for logging models with the Transformers flavor. Please be aware that each method has certain limitations and requirements, as described in the following sections.

<Table>
  <thead>
    <tr>
      <th>Save method</th>
      <th>Description</th>
      <th>Memory Usage</th>
      <th>Disk Usage</th>
      <th>Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Normal pipeline-based logging</td>
      <td>Log a model using a pipeline instance or a dictionary of pipeline components.</td>
      <td>High</td>
      <td>High</td>
      <td>
        ```python
        import mlflow
        import transformers

        pipeline = transformers.pipeline(
            task="text-generation",
            model="meta-llama/Meta-Llama-3.1-70B",
        )

        with mlflow.start_run():
            mlflow.transformers.log_model(
                transformers_model=pipeline,
                name="model",
            )
        ```
      </td>
    </tr>
    <tr>
      <td>[Memory-Efficient Model Logging](#transformers-memory-efficient-logging)</td>
      <td>Log a model by specifying a path to a local checkpoint, avoiding loading the model into memory.</td>
      <td>****Low****</td>
      <td>High</td>
      <td>
        ```python
        import mlflow

        with mlflow.start_run():
            mlflow.transformers.log_model(
                # Pass a path to local checkpoint as a model
                transformers_model="/path/to/local/checkpoint",
                # Task argument is required for this saving mode.
                task="text-generation",
                name="model",
            )
        ```
      </td>
    </tr>
    <tr>
      <td>[Storage-Efficient Model Logging](#transformers-save-pretrained-guide)</td>
      <td>Log a model by saving a reference to the HuggingFace Hub repository instead of the model weights.</td>
      <td>High</td>
      <td>**Low**</td>
      <td>
        ```python
        import mlflow
        import transformers

        pipeline = transformers.pipeline(
            task="text-generation",
            model="meta-llama/Meta-Llama-3.1-70B",
        )

        with mlflow.start_run():
            mlflow.transformers.log_model(
                transformers_model=pipeline,
                name="model",
                # Set save_pretrained to False to save storage space
                save_pretrained=False,
            )
        ```
      </td>
    </tr>

  </tbody>
</Table>

## Memory-Efficient Model Logging \{#transformers-memory-efficient-logging}

Introduced in MLflow 2.16.1, this method allows you to log a model without loading it into memory:

```python
import mlflow

with mlflow.start_run():
    mlflow.transformers.log_model(
        # Pass a path to local checkpoint as a model to avoid loading the model instance
        transformers_model="path/to/local/checkpoint",
        # Task argument is required for this saving mode.
        task="text-generation",
        name="model",
    )
```

In the above example, we pass a path to the local model checkpoint/weight as the model argument in
the <APILink fn="mlflow.transformers.log_model" /> API, instead of a pipeline instance.
MLflow will inspect the model metadata of the checkpoint and log the model weights without loading them into memory.
This way, you can log an enormous multi-billion parameter model to MLflow with minimal computational resources.

### Important Notes

Please be aware of the following requirements and limitations when using this feature:

1. The checkpoint directory **must** contain a valid config.json file and the model weight files. If a tokenizer is required, its state file must also be present in the checkpoint directory. You can save the tokenizer state in your checkpoint directory by calling `tokenizer.save_pretrained("path/to/local/checkpoint")` method.
2. You **must** specify the `task` argument with the appropriate task name that the model is designed for.
3. MLflow may not accurately infer model dependencies in this mode. Please refer to [Managing Dependencies in MLflow Models](/ml/model/dependencies) for more information on managing dependencies for your model.

:::warning
Ensure you specify the correct task argument, as an incompatible task will cause the model to **fail at the load time**. You can check the valid task type for your model on the HuggingFace Hub.
:::

## Storage-Efficient Model Logging \{#transformers-save-pretrained-guide}

Typically, when MLflow logs an ML model, it saves a copy of the model weight to the artifact store.
However, this is not optimal when you use a pretrained model from HuggingFace Hub and have no intention of fine-tuning or otherwise manipulating the model or its weights before logging it.
For this very common case, copying the (typically very large) model weights is redundant while developing prompts, testing inference parameters, and otherwise is little more than an unnecessary waste of storage space.

To address this issue, MLflow 2.11.0 introduced a new argument `save_pretrained` in the <APILink fn="mlflow.transformers.save_model" /> and <APILink fn="mlflow.transformers.log_model" /> APIs.
When with argument is set to `False`, MLflow will forego saving the pretrained model weights, opting instead to store a reference to the underlying repository entry on the HuggingFace Hub;
specifically, the repository name and the unique commit hash of the model weights are stored when your components or pipeline are logged. When loading back such a _reference-only_ model,
MLflow will check the repository name and commit hash from the saved metadata, and either download the model weight from the HuggingFace Hub or use the locally cached model from your HuggingFace local cache directory.

Here is the example of using `save_pretrained` argument for logging a model

```python
import transformers

pipeline = transformers.pipeline(
    task="text-generation",
    model="meta-llama/Meta-Llama-3.1-70B",
    torch_dtype="torch.float16",
)

with mlflow.start_run():
    mlflow.transformers.log_model(
        transformers_model=pipeline,
        name="model",
        # Set save_pretrained to False to save storage space
        save_pretrained=False,
    )
```

In the above example, MLflow will not save a copy of the **Llama-3.1-70B** model's weights and will instead log the following metadata as a reference to the HuggingFace Hub model.
This will save roughly 150GB of storage space and reduce the logging latency significantly as well for each run that you initiate during development.

By navigating to the MLflow UI, you can see the model logged with the repository ID and commit hash:

```bash
flavors:
    ...
    transformers:
        source_model_name: meta-llama/Meta-Llama-3.1-70B-Instruct
        source_model_revision: 33101ce6ccc08fa6249c10a543ebfcac65173393
        ...
```

Before production deployments, you may want to persist the model weight instead of the repository reference. To do so, you can use
the <APILink fn="mlflow.transformers.persist_pretrained_model" /> API to download the model weight from the HuggingFace Hub and save
it to the artifact location. Please refer to the [OSS Model Registry or Legacy Workspace Model Registry](#persist-pretrained-guide)
section for more information.

### Registering Reference-Only Models for Production

The models logged with either of the above optimized methods are "reference-only", meaning that the model weight is not saved to
the artifact store and only the reference to the HuggingFace Hub repository is saved. When you load the model back normally,
MLflow will download the model weight from the HuggingFace Hub.

However, this may not be suitable for production use cases, as the model weight may be unavailable or the download may fail due to network issues.
MLflow provides a solution to address this issue when registering reference-models to the Model Registry.

#### Databricks Unity Catalog

Registering reference-only models to [Databricks Unity Catalog Model Registry](https://docs.databricks.com/en/machine-learning/manage-model-lifecycle/index.html)
requires **no additional steps** than the normal model registration process. MLflow automatically downloads and registers the model weights to Unity Catalog along
with the model metadata.

```python
import mlflow

mlflow.set_registry_uri("databricks-uc")

# Log the repository ID as a model. The model weight will not be saved to the artifact store
with mlflow.start_run():
    model_info = mlflow.transformers.log_model(
        transformers_model="meta-llama/Meta-Llama-3.1-70B-Instruct",
        name="model",
    )

# When registering the model to Unity Catalog Model Registry, MLflow will automatically
# persist the model weight files. This may take a several minutes for large models.
mlflow.register_model(model_info.model_uri, "your.model.name")
```

### OSS Model Registry or Legacy Workspace Model Registry \{#persist-pretrained-guide}

For OSS Model Registry or the legacy Workspace Model Registry in Databricks, you need to manually persist the
model weight to the artifact store before registering the model. You can use the <APILink fn="mlflow.transformers.persist_pretrained_model" />
API to download the model weight from the HuggingFace Hub and save it to the artifact location. The process **does NOT require re-logging a model**
but efficiently update the existing model and metadata in-place.

```python
import mlflow

# Log the repository ID as a model. The model weight will not be saved to the artifact store
with mlflow.start_run():
    model_info = mlflow.transformers.log_model(
        transformers_model="meta-llama/Meta-Llama-3.1-70B-Instruct",
        name="model",
    )

# Before registering the model to the non-UC model registry, persist the model weight
# from the HuggingFace Hub to the artifact location.
mlflow.transformers.persist_pretrained_model(model_info.model_uri)

# Register the model
mlflow.register_model(model_info.model_uri, "your.model.name")
```

### Caveats for Skipping Saving of Pretrained Model Weights \{#caveats-of-save-pretrained}

While these features are useful for saving computational resources and storage space for logging large models, there are some caveats to be aware of:

- **Change in Model Availability**: If you are using a model from other users' repository, the model may be deleted or become private in the HuggingFace Hub.
  In such cases, MLflow cannot load the model back. For production use cases, it is recommended to save a copy of the model weights to the artifact store prior
  to moving from development or staging to production for your model.
- **HuggingFace Hub Access**: Downloading a model from the HuggingFace Hub might be slow or unstable due to the network latency or the HuggingFace Hub service status.
  MLflow doesn't provide any retry mechanism or robust error handling for model downloading from the HuggingFace Hub. As such, you should not rely on this
  functionality for your final production-candidate run.

By understanding these methods and their limitations, you can effectively work with large Transformers models in MLflow while optimizing resource usage.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/classic-ml/deep-learning/transformers/task/index.mdx

```text
import TOCInline from "@theme/TOCInline";
import { APILink } from "@site/src/components/APILink";
import { Table } from "@site/src/components/Table";

# Tasks in MLflow Transformers Flavor

This page provides an overview of how to use the `task` parameter in the MLflow Transformers flavor to control
the inference interface of the model.

<TOCInline toc={toc} />

## Overview

In the MLflow Transformers flavor, `task` plays a crucial role in determining the input and output format of the model.
The `task` is a fundamental concept in the Transformers library, which describe the structure of each model's API
(inputs and outputs) and are used to determine which Inference API and widget we want to display for any given model.

MLflow utilizes this concept to determine the input and output format of the model, persists the correct
[Model Signature](/ml/model#model-signatures-and-input-examples), and provides a consistent <APILink fn="mlflow.pyfunc" hash="inference-api">Pyfunc Inference API</APILink>
for serving different types of models. Additionally, on top of the native Transformers task types, MLflow defines a few additional task types to support more complex use cases, such as chat-style applications.

## Native Transformers Task Types

For native Transformers tasks, MLflow will automatically infer the task type from the pipeline when you save a pipeline
with <APILink fn="mlflow.transformers.log_model" />. You can also specify the task type explicitly by passing the
`task` parameter. The full list of supported task types is available in the [Transformers documentation](https://huggingface.co/tasks),
but note that **not all task types are supported in MLflow**.

```python
import mlflow
import transformers

pipeline = transformers.pipeline("text-generation", model="gpt2")

with mlflow.start_run():
    model_info = mlflow.transformers.save_model(
        transformers_model=pipeline,
        artifact_path="model",
        save_pretrained=False,
    )

print(f"Inferred task: {model_info.flavors['transformers']['task']}")
# >> Inferred task: text-generation
```

## Advanced Tasks for OpenAI-Compatible Inference

In addition to the native Transformers task types, MLflow defines a few additional task types. Those advanced task types allows you to extend the Transformers pipeline with OpenAI-compatible inference interface, to serve models for specific use cases.

For example, the Transformers `text-generation` pipeline inputs and outputs a single string or a list of strings. However, when serving a model, it is often necessary to have a more structured input and output format. For instance, in a chat-style application, the input may be a list of messages.

To support these use cases, MLflow defines a set of advanced task types prefixed with `llm/v1`:

- `"llm/v1/chat"` for chat-style applications
- `"llm/v1/completions"` for generic completions
- `"llm/v1/embeddings"` for text embeddings generation

The required step to use these advanced task types is just to specify the `task` parameter as an `llm/v1` task when logging the models.

```python
import mlflow

with mlflow.start_run():
    mlflow.transformers.log_model(
        transformers_model=pipeline,
        name="model",
        task="llm/v1/chat",  # <= Specify the llm/v1 task type
        # Optional, recommended for large models to avoid creating a local copy of the model weights
        save_pretrained=False,
    )
```

:::note
This feature is only available in MLflow 2.11.0 and above. Also, the `llm/v1/chat` task type is only available for models saved with `transformers >= 4.34.0`.
:::

### Input and Output Formats

<Table>
  <thead>
    <tr>
      <th>Task</th>
      <th>Supported pipeline</th>
      <th>Input</th>
      <th>Output</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>`llm/v1/chat`</td>
      <td>`text-generation`</td>
      <td>[Chat API spec](/genai/serving)</td>
      <td>Returns a [Chat Completion](https://platform.openai.com/docs/api-reference/chat/object) object in the json format.</td>
    </tr>
    <tr>
      <td>`llm/v1/completions`</td>
      <td>`text-generation`</td>
      <td>[Completions API spec](/genai/serving)</td>
      <td>Returns a [Completion](https://platform.openai.com/docs/guides/text-generation/completions-api) object in the json format.</td>
    </tr>
    <tr>
      <td>`llm/v1/embeddings`</td>
      <td>`feature-extraction`</td>
      <td>[Embeddings API spec](/genai/serving)</td>
      <td>Returns a list of [Embedding](https://platform.openai.com/docs/api-reference/embeddings/object) object. Additionally, the model returns `usage` field, which contains the number of tokens used for the embeddings generation.</td>
    </tr>
  </tbody>
</Table>

:::note
The Completion API is considered as legacy, but it is still supported in MLflow for backward compatibility. We recommend using the Chat API for compatibility with the latest APIs from OpenAI and other model providers.
:::

### Code Example of Using `llm/v1` Tasks

The following code snippet demonstrates how to log a Transformers pipeline with the `llm/v1/chat` task type, and use the model for chat-style inference. Check out the
[notebook tutorial](/ml/deep-learning/transformers/tutorials/conversational/pyfunc-chat-model/) to see more examples in action!

```python
import mlflow
import transformers

pipeline = transformers.pipeline("text-generation", "gpt2")

with mlflow.start_run():
    model_info = mlflow.transformers.log_model(
        transformers_model=pipeline,
        name="model",
        task="llm/v1/chat",
        input_example={
            "messages": [
                {"role": "system", "content": "You are a bot."},
                {"role": "user", "content": "Hello, how are you?"},
            ]
        },
        save_pretrained=False,
    )

# Model metadata logs additional field "inference_task"
print(model_info.flavors["transformers"]["inference_task"])
# >> llm/v1/chat

# The original native task type is also saved
print(model_info.flavors["transformers"]["task"])
# >> text-generation

# Model signature is set to the chat API spec
print(model_info.signature)
# >> inputs:
# >>   ['messages': Array({content: string (required), name: string (optional), role: string (required)}) (required), 'temperature': double (optional), 'max_tokens': long (optional), 'stop': Array(string) (optional), 'n': long (optional), 'stream': boolean (optional)]
# >> outputs:
# >>   ['id': string (required), 'object': string (required), 'created': long (required), 'model': string (required), 'choices': Array({finish_reason: string (required), index: long (required), message: {content: string (required), name: string (optional), role: string (required)} (required)}) (required), 'usage': {completion_tokens: long (required), prompt_tokens: long (required), total_tokens: long (required)} (required)]
# >> params:
# >>     None

# The model can be served with the OpenAI-compatible inference API
pyfunc_model = mlflow.pyfunc.load_model(model_info.model_uri)
prediction = pyfunc_model.predict(
    {
        "messages": [
            {"role": "system", "content": "You are a bot."},
            {"role": "user", "content": "Hello, how are you?"},
        ],
        "temperature": 0.5,
        "max_tokens": 200,
    }
)
print(prediction)
# >> [{'choices': [{'finish_reason': 'stop',
# >>               'index': 0,
# >>               'message': {'content': 'I'm doing well, thank you for asking.', 'role': 'assistant'}}],
# >>   'created': 1719875820,
# >>   'id': '355c4e9e-040b-46b0-bf22-00e93486100c',
# >>   'model': 'gpt2',
# >>   'object': 'chat.completion',
# >>   'usage': {'completion_tokens': 7, 'prompt_tokens': 13, 'total_tokens': 20}}]
```

Note that the input and output modifications only apply when the model is loaded with <APILink fn="mlflow.pyfunc.load_model" /> (e.g. when
serving the model with the `mlflow models serve` CLI tool). If you want to load just the raw pipeline, you can
use <APILink fn="mlflow.transformers.load_model" />.

## Provisioned Throughput on Databricks Model Serving

[Provisioned Throughput](https://docs.databricks.com/en/machine-learning/foundation-models/deploy-prov-throughput-foundation-model-apis.html)
on Databricks Model Serving is a capability that optimizes inference performance for foundation models with performance guarantees.
To serve Transformers models with provisioned throughput, specify `llm/v1/xxx` task type when logging the model. MLflow logs the required metadata
to enable provisioned throughput on Databricks Model Serving.

:::tip
When logging large models, you can use `save_pretrained=False` to avoid creating a local copy of the model weights for saving time and disk space.
Please refer to the [documentation](/ml/deep-learning/transformers/large-models#transformers-save-pretrained-guide) for more details.
:::

## FAQ

### How to override the default query parameters for the OpenAI-compatible inference?

When serving the model saved with the `llm/v1` task type, MLflow uses the same default value as OpenAI APIs for the parameters like `temperature` and `stop`.
You can override them by either passing the values at inference time, or by setting different default values when logging the model.

1. At inference time: You can pass the parameters as part of the input dictionary when calling the `predict()` method, just like how you pass the input messages.
2. When logging the model: You can override the default values for the parameters by saving a `model_config` parameter when logging the model.

```python
with mlflow.start_run():
    model_info = mlflow.transformers.log_model(
        transformers_model=pipeline,
        name="model",
        task="llm/v1/chat",
        model_config={
            "temperature": 0.5,  # <= Set the default temperature
            "stop": ["foo", "bar"],  # <= Set the default stop sequence
        },
        save_pretrained=False,
    )
```

:::warning attention
The `stop` parameter can be used to specify the stop sequence for the `llm/v1/chat` and `llm/v1/completions` tasks.
We emulate the behavior of the `stop` parameter in the OpenAI APIs by passing the
[stopping_criteria](https://huggingface.co/docs/transformers/main_classes/text_generation#transformers.GenerationMixin.generate.stopping_criteria)
to the Transformers pipeline, with the token IDs of the given stop sequence. However, the behavior may not be stable because
the tokenizer does not always generate the same token IDs for the same sequence in different sentences, especially for `sentence-piece` based tokenizers.
:::
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/classic-ml/deep-learning/transformers/tutorials/index.mdx

```text
---
sidebar_position: 1
sidebar_label: Tutorials
---

import { CardGroup, PageCard } from "@site/src/components/Card";

# MLflow Transformers Flavor - Tutorials and Guides

Below, you will find a number of guides that focus on different use cases using _transformers_ that leverage MLflow's
APIs for tracking and inference capabilities.

### Introductory Quickstart to using Transformers with MLflow

If this is your first exposure to transformers or use transformers extensively but are new to MLflow, this is a great place to start.

<CardGroup>
  <PageCard
    headerText="Quickstart: Text Generation with Transformers"
    link="/ml/deep-learning/transformers/tutorials/text-generation/text-generation/"
    text={
      <>
        Learn how to leverage the transformers integration with MLflow in this <strong>introductory quickstart</strong>.
      </>
    }
  />
</CardGroup>

### Transformers Fine-Tuning Tutorials with MLflow \{#transformers-finetuning-tutorials}

Fine-tuning a model is a common task in machine learning workflows. These tutorials are designed to showcase how to fine-tune a model using the transformers library with harnessing MLflow's APIs for tracking experiment configurations and results.

<CardGroup>
  <PageCard
    headerText="Fine tuning a transformers Foundation Model"
    link="/ml/deep-learning/transformers/tutorials/fine-tuning/transformers-fine-tuning/"
    text={
      <>
        Learn how to fine-tune a transformers model using MLflow to keep track of the training process and to log a use-case-specific tuned pipeline.
      </>
    }
  />
  <PageCard
    headerText="Fine tuning LLMs efficiently using PEFT and MLflow"
    link="/ml/deep-learning/transformers/tutorials/fine-tuning/transformers-peft/"
    text={
      <>
        Learn how to fine-tune a large foundational models with significantly reduced memory usage using PEFT (QLoRA) and MLflow.
      </>
    }
  />

</CardGroup>

### Use Case Tutorials for Transformers with MLflow

Interested in learning about how to leverage transformers for tasks other than basic text generation?
Want to learn more about the breadth of problems that you can solve with transformers and MLflow?

These more advanced tutorials are designed to showcase different applications of the transformers model architecture and how to leverage MLflow to track and deploy these models.

<CardGroup>
  <PageCard
    headerText="Audio Transcription with Transformers"
    link="/ml/deep-learning/transformers/tutorials/audio-transcription/whisper/"
    text={
      <>
        Learn how to leverage the Whisper Model with MLflow to generate accurate audio transcriptions.
      </>
    }
  />
  <PageCard
    headerText="Translation with Transformers"
    link="/ml/deep-learning/transformers/tutorials/translation/component-translation/"
    text={
      <>
        Learn about the options for saving and loading transformers models in MLflow for customization of your workflows with a fun translation example!
      </>
    }
  />
  <PageCard
    headerText="Chat with Transformers"
    link="/ml/deep-learning/transformers/tutorials/conversational/conversational-model/"
    text={
      <>
        Learn the basics of stateful chat Conversational Pipelines with Transformers and MLflow.
      </>
    }
  />
  <PageCard
    headerText="Building and Serving an OpenAI-Compatible Chatbot"
    link="/ml/deep-learning/transformers/tutorials/conversational/pyfunc-chat-model/"
    text={
      <>
        Learn how to build an OpenAI-compatible chatbot using a local Transformers model and MLflow, and serve it with minimal configuration.
      </>
    }
  />
  <PageCard
    headerText="Prompt templating with Transformers Pipelines"
    link="/ml/deep-learning/transformers/tutorials/prompt-templating/prompt-templating/"
    text={
      <>
        Learn how to set prompt templates on Transformers Pipelines to optimize your LLM's outputs, and simplify the end-user experience.
      </>
    }
  />
</CardGroup>
```

--------------------------------------------------------------------------------

````
