---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 64
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 64 of 991)

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

---[FILE: prompt-templating.ipynb]---
Location: mlflow-master/docs/docs/classic-ml/deep-learning/transformers/tutorials/prompt-templating/prompt-templating.ipynb

```text
{
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "# Prompt Templating with MLflow and Transformers\n",
    "\n",
    "Welcome to our in-depth tutorial on using prompt templates to conveniently customize the behavior of Transformers pipelines using MLflow. "
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### Learning Objectives\n",
    "\n",
    "In this tutorial, you will:\n",
    "\n",
    "- Set up a text generation pipeline using TinyLlama-1.1B as an example model\n",
    "- Set a prompt template that will be used to format user queries at inference time\n",
    "- Load the model for querying\n",
    "\n",
    "### What is a prompt template, and why use one?\n",
    "\n",
    "When dealing with large language models, the way a query is structured can significantly impact the model's performance. We often need to add some preamble, or format the query in a way that gives us the results that we want. It's not ideal to expect the end-user of our applications to know exactly what this format should be, so we typically have a pre-processing step to format the user input in a way that works best with the underlying model. In other words, we apply a prompt template to the user's input.\n",
    "\n",
    "MLflow provides a convenient way to set this on certain pipeline types using the `transformers` flavor. As of now, the only pipelines that we support are:\n",
    "\n",
    "- [feature-extraction](https://huggingface.co/transformers/main_classes/pipelines.html#transformers.FeatureExtractionPipeline)\n",
    "- [fill-mask](https://huggingface.co/transformers/main_classes/pipelines.html#transformers.FillMaskPipeline)\n",
    "- [summarization](https://huggingface.co/transformers/main_classes/pipelines.html#transformers.SummarizationPipeline)\n",
    "- [text2text-generation](https://huggingface.co/transformers/main_classes/pipelines.html#transformers.Text2TextGenerationPipeline)\n",
    "- [text-generation](https://huggingface.co/transformers/main_classes/pipelines.html#transformers.TextGenerationPipeline)\n",
    "\n",
    "\n",
    "If you need a runthrough of the basics of how to use the `transformers` flavor, check out the [Introductory Guide](https://mlflow.org/docs/latest/ml/deep-learning/transformers/guide/index.html)!\n",
    "\n",
    "Now, let's dive in and see how it's done!"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 1,
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "env: TOKENIZERS_PARALLELISM=false\n"
     ]
    }
   ],
   "source": [
    "# Disable tokenizers warnings when constructing pipelines\n",
    "%env TOKENIZERS_PARALLELISM=false\n",
    "\n",
    "import warnings\n",
    "\n",
    "# Disable a few less-than-useful UserWarnings from setuptools and pydantic\n",
    "warnings.filterwarnings(\"ignore\", category=UserWarning)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### Pipeline setup and inference\n",
    "\n",
    "First, let's configure our Transformers pipeline. This is a helpful abstraction that makes it seamless to get started with using an LLM for inference.\n",
    "\n",
    "For this demonstration, let's say the user's input is the phrase \"Tell me the largest bird\". Let's experiment with a few different prompt templates, and see which one we like best."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 2,
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Response to Template #0:\n",
      "Tell me the largest bird you've ever seen.\n",
      "I've seen a lot of birds\n",
      "\n",
      "Response to Template #1:\n",
      "Q: Tell me the largest bird\n",
      "A: The largest bird is a pigeon.\n",
      "\n",
      "A: The largest\n",
      "\n",
      "Response to Template #2:\n",
      "You are an assistant that is knowledgeable about birds. If asked about the largest bird, you will reply 'Duck'.\n",
      "User: Tell me the largest bird\n",
      "Assistant: Duck\n",
      "User: What is the largest bird?\n",
      "Assistant:\n",
      "\n"
     ]
    }
   ],
   "source": [
    "from transformers import pipeline\n",
    "\n",
    "generator = pipeline(\"text-generation\", model=\"TinyLlama/TinyLlama-1.1B-intermediate-step-1431k-3T\")\n",
    "\n",
    "user_input = \"Tell me the largest bird\"\n",
    "prompt_templates = [\n",
    "    # no template\n",
    "    \"{prompt}\",\n",
    "    # question-answer style template\n",
    "    \"Q: {prompt}\\nA:\",\n",
    "    # dialogue style template with a system prompt\n",
    "    (\n",
    "        \"You are an assistant that is knowledgeable about birds. \"\n",
    "        \"If asked about the largest bird, you will reply 'Duck'.\\n\"\n",
    "        \"User: {prompt}\\n\"\n",
    "        \"Assistant:\"\n",
    "    ),\n",
    "]\n",
    "\n",
    "responses = generator(\n",
    "    [template.format(prompt=user_input) for template in prompt_templates], max_new_tokens=15\n",
    ")\n",
    "for idx, response in enumerate(responses):\n",
    "    print(f\"Response to Template #{idx}:\")\n",
    "    print(response[0][\"generated_text\"] + \"\\n\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## Saving the model and template with MLflow\n",
    "\n",
    "Now that we've experimented with a few prompt templates, let's pick one, and save it together with our pipeline using MLflow. Before we do this, let's take a few minutes to learn about an important component of MLflow models—signatures!\n",
    "\n",
    "### Creating a model signature\n",
    "\n",
    "A model signature codifies a model's expected inputs, outputs, and inference params. MLflow enforces this signature at inference time, and will raise a helpful exception if the user input does not match up with the expected format.\n",
    "\n",
    "Creating a signature can be done simply by calling `mlflow.models.infer_signature()`, and providing a sample input and output value. We can use `mlflow.transformers.generate_signature_output()` to easily generate a sample output. If we want to pass any additional arguments to the pipeline at inference time (e.g. `max_new_tokens` above), we can do so via `params`."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 3,
   "metadata": {},
   "outputs": [
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "2024/01/16 17:28:42 WARNING mlflow.transformers: params provided to the `predict` method will override the inference configuration saved with the model. If the params provided are not valid for the pipeline, MlflowException will be raised.\n"
     ]
    },
    {
     "data": {
      "text/plain": [
       "inputs: \n",
       "  [string (required)]\n",
       "outputs: \n",
       "  [string (required)]\n",
       "params: \n",
       "  ['max_new_tokens': long (default: 15)]"
      ]
     },
     "execution_count": 3,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "import mlflow\n",
    "\n",
    "sample_input = \"Tell me the largest bird\"\n",
    "params = {\"max_new_tokens\": 15}\n",
    "signature = mlflow.models.infer_signature(\n",
    "    sample_input,\n",
    "    mlflow.transformers.generate_signature_output(generator, sample_input, params=params),\n",
    "    params=params,\n",
    ")\n",
    "\n",
    "# visualize the signature\n",
    "signature"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### Starting a new experiment\n",
    "We create a new [MLflow Experiment](https://mlflow.org/docs/latest/ml/tracking.html#experiments) so that the run we're going to log our model to does not log to the default experiment and instead has its own contextually relevant entry.\n",
    "\n",
    "### Logging the model with the prompt template\n",
    "Logging the model using MLflow saves the model and its essential metadata so it can be efficiently tracked and versioned. We'll use `mlflow.transformers.log_model()`, which is tailored to make this process as seamless as possible. To save the prompt template, all we have to do is pass it in using the `prompt_template` keyword argument.\n",
    "\n",
    "Two important thing to take note of:\n",
    "\n",
    "1. A prompt template must be a string with exactly one named placeholder `{prompt}`. MLflow will raise an error if a prompt template is provided that does not conform to this format.\n",
    "\n",
    "2. `text-generation` pipelines with a prompt template will have the [return_full_text pipeline argument](https://huggingface.co/docs/huggingface_hub/main/en/package_reference/inference_client#huggingface_hub.inference._text_generation.TextGenerationParameters.return_full_text) set to `False` by default. This is to prevent the template from being shown to the users, which could potentially cause confusion as it was not part of their original input. To override this behaviour, either set `return_full_text` to `True` via `params`, or by including it in a `model_config` dict in `log_model()`."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 4,
   "metadata": {},
   "outputs": [
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "2024/01/16 17:28:45 INFO mlflow.tracking.fluent: Experiment with name 'prompt-templating' does not exist. Creating a new experiment.\n",
      "2024/01/16 17:28:52 INFO mlflow.transformers: text-generation pipelines saved with prompt templates have the `return_full_text` pipeline kwarg set to False by default. To override this behavior, provide a `model_config` dict with `return_full_text` set to `True` when saving the model.\n",
      "2024/01/16 17:32:57 WARNING mlflow.utils.environment: Encountered an unexpected error while inferring pip requirements (model URI: /var/folders/qd/9rwd0_gd0qs65g4sdqlm51hr0000gp/T/tmpbs0poq1a/model, flavor: transformers), fall back to return ['transformers==4.34.1', 'torch==2.1.1', 'torchvision==0.16.1', 'accelerate==0.25.0']. Set logging level to DEBUG to see the full traceback.\n"
     ]
    }
   ],
   "source": [
    "# If you are running this tutorial in local mode, leave the next line commented out.\n",
    "# Otherwise, uncomment the following line and set your tracking uri to your local or remote tracking server.\n",
    "\n",
    "mlflow.set_tracking_uri(\"http://127.0.0.1:5000\")\n",
    "\n",
    "# Set a name for the experiment that is indicative of what the runs being created within it are in regards to\n",
    "mlflow.set_experiment(\"prompt-templating\")\n",
    "\n",
    "prompt_template = \"Q: {prompt}\\nA:\"\n",
    "with mlflow.start_run():\n",
    "    model_info = mlflow.transformers.log_model(\n",
    "        transformers_model=generator,\n",
    "        name=\"model\",\n",
    "        task=\"text-generation\",\n",
    "        signature=signature,\n",
    "        input_example=\"Tell me the largest bird\",\n",
    "        prompt_template=prompt_template,\n",
    "        # Since MLflow 2.11.0, you can save the model in 'reference-only' mode to reduce storage usage by not saving\n",
    "        # the base model weights but only the reference to the HuggingFace model hub. To enable this, uncomment the\n",
    "        # following line:\n",
    "        # save_pretrained=False,\n",
    "    )"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## Loading the model for inference\n",
    "\n",
    "Next, we can load the model using `mlflow.pyfunc.load_model()`.\n",
    "\n",
    "The `pyfunc` module in MLflow serves as a generic wrapper for Python functions. It gives us a standard interface for loading and querying models as python functions, without having to worry about the specifics of the underlying models.\n",
    "\n",
    "Utilizing [mlflow.pyfunc.load_model](https://www.mlflow.org/docs/latest/python_api/mlflow.pyfunc.html#mlflow.pyfunc.load_model), our previously logged text generation model is loaded using its unique model URI. This URI is a reference to the stored model artifacts. MLflow efficiently handles the model's deserialization, along with any associated dependencies, preparing it for immediate use.\n",
    "\n",
    "Now, when we call the `predict()` method on our loaded model, the user's input should be formatted with our chosen prompt template prior to inference!"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 5,
   "metadata": {},
   "outputs": [
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "709dd14c0bd5433e95fcbb60755f7ed0",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "Downloading artifacts:   0%|          | 0/23 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "2024/01/16 17:33:16 INFO mlflow.store.artifact.artifact_repo: The progress bar can be disabled by setting the environment variable MLFLOW_ENABLE_ARTIFACTS_PROGRESS_BAR to false\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "152e1683f12343b185b392ff7ab4413d",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "Loading checkpoint shards:   0%|          | 0/10 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "2024/01/16 17:33:56 WARNING mlflow.transformers: params provided to the `predict` method will override the inference configuration saved with the model. If the params provided are not valid for the pipeline, MlflowException will be raised.\n"
     ]
    },
    {
     "data": {
      "text/plain": [
       "['The largest bird is a pigeon.\\n\\nA: The largest']"
      ]
     },
     "execution_count": 5,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "loaded_generator = mlflow.pyfunc.load_model(model_uri=model_info.model_uri)\n",
    "\n",
    "loaded_generator.predict(\"Tell me the largest bird\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## Closing Remarks\n",
    "\n",
    "This demonstration showcased a simple way to format user queries using prompt templates. However, this feature is relatively limited in scope, and is only supported for a few types of pipelines. If your use-case is more complex, you might want to check out our [guide for creating a custom PyFunc](https://www.mlflow.org/docs/latest/llms/custom-pyfunc-for-llms/notebooks/custom-pyfunc-advanced-llm.html)!"
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "mlflow-dev",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/x-python",
   "name": "python",
   "nbconvert_exporter": "python",
   "pygments_lexer": "ipython3",
   "version": "3.9.13"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 2
}
```

--------------------------------------------------------------------------------

---[FILE: text-generation.ipynb]---
Location: mlflow-master/docs/docs/classic-ml/deep-learning/transformers/tutorials/text-generation/text-generation.ipynb

```text
{
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "# Introduction to MLflow and Transformers\n",
    "\n",
    "Welcome to our tutorial on leveraging the power of **Transformers** with **MLflow**. This guide is designed for beginners, focusing on machine learning workflows and model management.\n"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### What Will You Learn?\n",
    "\n",
    "In this tutorial, you will learn how to:\n",
    "\n",
    "- Set up a simple text generation pipeline using the Transformers library.\n",
    "- Log the model and its parameters using MLflow.\n",
    "- Infer the input and output signature of the model automatically.\n",
    "- Simulate serving the model using MLflow and make predictions with it.\n",
    "   \n",
    "#### Introduction to Transformers\n",
    "Transformers are a type of deep learning model that have revolutionized natural language processing (NLP). Developed by [🤗 Hugging Face](https://huggingface.co/docs/transformers/index), the Transformers library offers a variety of state-of-the-art pre-trained models for NLP tasks.\n",
    "\n",
    "#### Why Combine MLflow with Transformers?\n",
    "Integrating MLflow with Transformers offers numerous benefits:\n",
    "\n",
    "- **Experiment Tracking**: Log and compare model parameters and metrics.\n",
    "- **Model Management**: Track different model versions and their performance.\n",
    "- **Reproducibility**: Document all aspects needed to reproduce predictions.\n",
    "- **Deployment**: Simplify deploying Transformers models to production.\n",
    "\n",
    "Now, let's dive into the world of MLflow and Transformers!"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 1,
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "env: TOKENIZERS_PARALLELISM=false\n"
     ]
    }
   ],
   "source": [
    "# Disable tokenizers warnings when constructing pipelines\n",
    "%env TOKENIZERS_PARALLELISM=false\n",
    "\n",
    "import warnings\n",
    "\n",
    "# Disable a few less-than-useful UserWarnings from setuptools and pydantic\n",
    "warnings.filterwarnings(\"ignore\", category=UserWarning)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### Imports and Pipeline configuration\n",
    "\n",
    "In this first section, we are setting up our environment and configuring aspects of the transformers pipeline that we'll be using to generate a text response from the LLM. \n",
    "\n",
    "#### Setting up our Pipeline\n",
    "\n",
    "- **Import**: We import the necessary libraries: transformers for building our NLP model and mlflow for model tracking and management.\n",
    "- **Task Definition**: We then define the task for our pipeline, which in this case is `text2text-generation`` This task involves generating new text based on the input text.\n",
    "- **Pipeline Declaration**: Next, we create a generation_pipeline using the `pipeline` function from the Transformers library. This pipeline is configured to use the `declare-lab/flan-alpaca-large model`, which is a pre-trained model suitable for text generation.\n",
    "- **Input Example**: For the purposes of generating a signature later on, as well as having a visual indicator of the expected input data to our model when loading as a `pyfunc`, we next set up an input_example that contains sample prompts.\n",
    "- **Inference Parameters**: Finally, we define parameters that will be used to control the behavior of the model during inference, such as the maximum length of the generated text and whether to sample multiple times.\n",
    "\n",
    "#### Understanding Pipelines\n",
    "Pipelines are a high-level abstraction provided by the Transformers library that simplifies the process of using models for inference. They encapsulate the complexity of the underlying code, offering a straightforward API for a variety of tasks, such as text classification, question answering, and in our case, text generation.\n",
    "\n",
    "##### The `pipeline()` function\n",
    "The pipeline() function is a versatile tool that can be used to create a pipeline for any supported task. When you specify a task, the function returns a pipeline object tailored for that task, constructing the required calls to sub-components (a tokenizer, encoder, generative model, etc.) in the order needed to fulfill the needs of the specified task. This abstraction dramatically simplifies the code required to use these models and their respective components.\n",
    "\n",
    "##### Task-Specific Pipelines\n",
    "In addition to the general pipeline() function, there are task-specific pipelines for different domains like audio, computer vision, and natural language processing. These specialized pipelines are optimized for their respective tasks and can provide additional convenience and functionality.\n",
    "\n",
    "##### Benefits of Using Pipelines\n",
    "Using pipelines has several advantages:\n",
    "\n",
    "- **Simplicity**: You can perform complex tasks with a minimal amount of code.\n",
    "- **Flexibility**: You can specify different models and configurations to customize the pipeline for your needs.\n",
    "- **Efficiency**: Pipelines handle batching and dataset iteration internally, which can lead to performance improvements.\n",
    "\n",
    "Due to the utility and simple, high-level API, MLflow's `transformers` implementation uses the `pipeline` abstraction by default (although it can support component-only mode as well)."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 2,
   "metadata": {},
   "outputs": [],
   "source": [
    "import transformers\n",
    "\n",
    "import mlflow\n",
    "\n",
    "# Define the task that we want to use (required for proper pipeline construction)\n",
    "task = \"text2text-generation\"\n",
    "\n",
    "# Define the pipeline, using the task and a model instance that is applicable for our task.\n",
    "generation_pipeline = transformers.pipeline(\n",
    "    task=task,\n",
    "    model=\"declare-lab/flan-alpaca-large\",\n",
    ")\n",
    "\n",
    "# Define a simple input example that will be recorded with the model in MLflow, giving\n",
    "# users of the model an indication of the expected input format.\n",
    "input_example = [\"prompt 1\", \"prompt 2\", \"prompt 3\"]\n",
    "\n",
    "# Define the parameters (and their defaults) for optional overrides at inference time.\n",
    "parameters = {\"max_length\": 512, \"do_sample\": True, \"temperature\": 0.4}"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### Introduction to Model Signatures in MLflow\n",
    "\n",
    "In the realm of machine learning, model signatures play a crucial role in ensuring that models receive and produce the expected data types and structures. MLflow includes a feature for defining model signatures, helping to standardize and enforce correct model usage.\n",
    "\n",
    "#### Quick Learning Points\n",
    "\n",
    "- **Model Signature Purpose**: Ensures consistent data types and structures for model inputs and outputs.\n",
    "- **Visibility and Validation**: Visible in MLflow's UI and validated by MLflow's deployment tools.\n",
    "- **Signature Types**: Column-based for tabular data, tensor-based for tensor inputs/outputs, and with params for models requiring additional inference parameters.\n",
    "\n",
    "#### Understanding Model Signatures\n",
    "A model signature in MLflow describes the schema for inputs, outputs, and parameters of an ML model. It is a blueprint that details the expected data types and shapes, facilitating a clear interface for model usage. Signatures are particularly useful as they are:\n",
    "\n",
    "- Displayed in MLflow's UI for easy reference.\n",
    "- Employed by MLflow's deployment tools to validate inputs during inference.\n",
    "- Stored in a standardized JSON format alongside the model's metadata.\n",
    "\n",
    "#### The Role of Signatures in Code\n",
    "In the following section, we are using MLflow to infer the signature of a machine learning model. This involves specifying an input example, generating a model output example, and defining any additional inference parameters. The resulting signature is used to validate future inputs and document the expected data formats.\n",
    "\n",
    "#### Types of Model Signatures\n",
    "Model signatures can be:\n",
    "\n",
    "- **Column-based**: Suitable for models that operate on tabular data, with each column having a specified data type and optional name.\n",
    "- **Tensor-based**: Designed for models that take tensors as inputs and outputs, with each tensor having a specified data type, shape, and optional name.\n",
    "- **With Params**: Some models require additional parameters for inference, which can also be included in the signature.\n",
    "\n",
    "For the transformers flavor, all input types are of the Column-based type (referred to within MLflow as `ColSpec` types).\n",
    "\n",
    "#### Signature Enforcement\n",
    "MLflow enforces the signature at the time of model inference, ensuring that the provided input and parameters match the expected schema. If there's a mismatch, MLflow will raise an exception or issue a warning, depending on the nature of the mismatch."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 3,
   "metadata": {},
   "outputs": [
    {
     "data": {
      "text/plain": [
       "inputs: \n",
       "  [string]\n",
       "outputs: \n",
       "  [string]\n",
       "params: \n",
       "  ['max_length': long (default: 512), 'do_sample': boolean (default: True), 'temperature': double (default: 0.4)]"
      ]
     },
     "execution_count": 3,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "# Generate the signature for the model that will be used for inference validation and type checking (as well as validation of parameters being submitted during inference)\n",
    "signature = mlflow.models.infer_signature(\n",
    "    input_example,\n",
    "    mlflow.transformers.generate_signature_output(generation_pipeline, input_example),\n",
    "    parameters,\n",
    ")\n",
    "\n",
    "# Visualize the signature\n",
    "signature"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### Creating an experiment\n",
    "\n",
    "We create a new MLflow Experiment so that the run we're going to log our model to does not log to the default experiment and instead has its own contextually relevant entry."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 4,
   "metadata": {},
   "outputs": [
    {
     "data": {
      "text/plain": [
       "<Experiment: artifact_location='file:///Users/benjamin.wilson/repos/mlflow-fork/mlflow/docs/source/llms/transformers/tutorials/text-generation/mlruns/528654983476503755', creation_time=1701288466448, experiment_id='528654983476503755', last_update_time=1701288466448, lifecycle_stage='active', name='Transformers Introduction', tags={}>"
      ]
     },
     "execution_count": 4,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "# If you are running this tutorial in local mode, leave the next line commented out.\n",
    "# Otherwise, uncomment the following line and set your tracking uri to your local or remote tracking server.\n",
    "\n",
    "# mlflow.set_tracking_uri(\"http://127.0.0.1:8080\")\n",
    "\n",
    "mlflow.set_experiment(\"Transformers Introduction\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### Logging the Transformers Model with MLflow\n",
    "\n",
    "We log our model with MLflow to manage its lifecycle efficiently and keep track of its versions and configurations.\n",
    "   \n",
    "Logging a model in MLflow is a crucial step in the model lifecycle management, enabling efficient tracking, versioning, and management. The process involves registering the model along with its essential metadata within the MLflow tracking system.\n",
    "\n",
    "Utilizing the [mlflow.transformers.log_model](https://www.mlflow.org/docs/latest/python_api/mlflow.transformers.html#mlflow.transformers.log_model) function, specifically tailored for models and components from the `transformers` library, simplifies this task. This function is adept at handling various aspects of the models from this library, including their complex pipelines and configurations.\n",
    "\n",
    "When logging the model, crucial metadata such as the model's signature, which was previously established, is included. This metadata plays a significant role in the subsequent stages of the model's lifecycle, from tracking its evolution to facilitating its deployment in different environments. The signature, in particular, ensures the model's compatibility and consistent performance across various platforms, thereby enhancing its utility and reliability in practical applications.\n",
    "\n",
    "By logging our model in this way, we ensure that it is not only well-documented but also primed for future use, whether it be for further development, comparative analysis, or deployment.\n",
    "\n",
    "\n",
    "#### A Tip for Saving Storage Cost\n",
    "\n",
    "When you call [mlflow.transformers.log_model](https://www.mlflow.org/docs/latest/python_api/mlflow.transformers.html#mlflow.transformers.log_model), MLflow saves a full copy of the Transformers model weight. However, this could take large storage space (3GB for `flan-alpaca-large` model), but might be redundant when you don't modify the model weight, because it is exactly same as the one you can download from the HuggingFace model hub.\n",
    "\n",
    "To avoid the unnecessary copy, you can use 'reference-only' save mode which is introduced in MLflow 2.11.0, by setting ``save_pretrained=False`` when logging or saving the Transformer model. This tells MLflow not to save the copy of the base model weight, but just a reference to the HuggingFace Hub repository and version, hence more storage-efficient and faster in time. For more details about this feature, please refer to [Storage-Efficient Model Logging](https://www.mlflow.org/docs/latest/ml/deep-learning/transformers/guide/index.html#storage-efficient-model-logging-with-save-pretrained-option)."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 5,
   "metadata": {},
   "outputs": [],
   "source": [
    "with mlflow.start_run():\n",
    "    model_info = mlflow.transformers.log_model(\n",
    "        transformers_model=generation_pipeline,\n",
    "        name=\"text_generator\",\n",
    "        input_example=input_example,\n",
    "        signature=signature,\n",
    "        # Uncomment the following line to save the model in 'reference-only' mode:\n",
    "        # save_pretrained=False,\n",
    "    )"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### Loading the Text Generation Model\n",
    "\n",
    "We initialize our text generation model using MLflow's pyfunc module for seamless model loading and interaction.\n",
    "\n",
    "The `pyfunc` module in MLflow serves as a generic wrapper for Python functions. Its application in MLflow facilitates the loading of machine learning models as standard Python functions. This approach is especially advantageous for models logged or registered via MLflow, streamlining the interaction with the model regardless of its training or serialization specifics.\n",
    "\n",
    "Utilizing [mlflow.pyfunc.load_model](https://www.mlflow.org/docs/latest/python_api/mlflow.pyfunc.html#mlflow.pyfunc.load_model), our previously logged text generation model is loaded using its unique model URI. This URI is a reference to the stored model artifacts. MLflow efficiently handles the model's deserialization, along with any associated dependencies, preparing it for immediate use.\n",
    "\n",
    "Once the model, referred to as `sentence_generator`, is loaded, it operates as a conventional Python function. This functionality allows for the generation of text based on given prompts. The model encompasses the complete process of inference, eliminating the need for manual input preprocessing or output postprocessing. This encapsulation not only simplifies model interaction but also ensures the model's adaptability for deployment across various platforms."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 6,
   "metadata": {},
   "outputs": [
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "60ad7546d18a44789207819b8f0889ad",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "Loading checkpoint shards:   0%|          | 0/7 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    }
   ],
   "source": [
    "# Load our pipeline as a generic python function\n",
    "sentence_generator = mlflow.pyfunc.load_model(model_info.model_uri)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "#### Formatting Predictions for Tutorial Readability\n",
    "Please note that the following function, `format_predictions`, is used only for enhancing the readability of model predictions within this Jupyter Notebook environment. It **is not a standard component** of the model's inference pipeline."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 7,
   "metadata": {},
   "outputs": [],
   "source": [
    "def format_predictions(predictions):\n",
    "    \"\"\"\n",
    "    Function for formatting the output for readability in a Jupyter Notebook\n",
    "    \"\"\"\n",
    "    formatted_predictions = []\n",
    "\n",
    "    for prediction in predictions:\n",
    "        # Split the output into sentences, ensuring we don't split on abbreviations or initials\n",
    "        sentences = [\n",
    "            sentence.strip() + (\".\" if not sentence.endswith(\".\") else \"\")\n",
    "            for sentence in prediction.split(\". \")\n",
    "            if sentence\n",
    "        ]\n",
    "\n",
    "        # Join the sentences with a newline character\n",
    "        formatted_text = \"\\n\".join(sentences)\n",
    "\n",
    "        # Add the formatted text to the list\n",
    "        formatted_predictions.append(formatted_text)\n",
    "\n",
    "    return formatted_predictions"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### Generating Predictions with Custom Parameters\n",
    "\n",
    "In this section, we demonstrate generating predictions using a sentence generator model with custom parameters. This includes prompts for selecting weekend activities and requesting a joke.\n",
    "\n",
    "#### Quick Overview\n",
    "\n",
    "- **Scenario**: Generating text for different prompts.\n",
    "- **Custom Parameter**: Overriding the `temperature` parameter to control text randomness.\n",
    "- **Default Values**: Other parameters use their defaults unless explicitly overridden.\n",
    "    \n",
    "#### Prediction Process Explained\n",
    "We use the `predict` method on the `sentence_generator` pyfunc model with a list of string prompts, including:\n",
    "\n",
    "- A request for help in choosing between hiking and kayaking for a weekend activity.\n",
    "- A prompt asking for a joke related to hiking.\n",
    "\n",
    "To influence the generation process, we override the `temperature` parameter. This parameter impacts the randomness of the generated text:\n",
    "\n",
    "- **Lower Temperature**: Leads to more predictable and conservative outputs.\n",
    "- **Higher Temperature**: Fosters varied and creative responses.\n",
    "\n",
    "#### Utilizing Custom Parameters\n",
    "In this example, the `temperature` parameter is explicitly set for the prediction call. Other parameters set during model logging will use their default values, unless also overridden in the `params` argument of the prediction call.\n",
    "\n",
    "#### Output Formatting\n",
    "The `predictions` variable captures the model's output for each input prompt. We can format these outputs for enhanced readability in the following steps, presenting the generated text in a clear and accessible manner."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 8,
   "metadata": {},
   "outputs": [
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "2023/11/30 14:24:08 WARNING mlflow.transformers: params provided to the `predict` method will override the inference configuration saved with the model. If the params provided are not valid for the pipeline, MlflowException will be raised.\n"
     ]
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Response to prompt 1:\n",
      "Going hiking can be a great way to explore the outdoors and have fun, while kayaking can be an exciting way to take in the scenery and have a great experience.\n",
      "\n",
      "Response to prompt 2:\n",
      "Q: What did the bird say when he was walking in the woods? a: \"Hey, I'm going to get some food!\".\n",
      "\n"
     ]
    }
   ],
   "source": [
    "# Validate that our loaded pipeline, as a generic pyfunc, can produce an output that makes sense\n",
    "predictions = sentence_generator.predict(\n",
    "    data=[\n",
    "        \"I can't decide whether to go hiking or kayaking this weekend. Can you help me decide?\",\n",
    "        \"Please tell me a joke about hiking.\",\n",
    "    ],\n",
    "    params={\"temperature\": 0.7},\n",
    ")\n",
    "\n",
    "# Format each prediction for notebook readability\n",
    "formatted_predictions = format_predictions(predictions)\n",
    "\n",
    "for i, formatted_text in enumerate(formatted_predictions):\n",
    "    print(f\"Response to prompt {i + 1}:\\n{formatted_text}\\n\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### Closing Remarks\n",
    "\n",
    "This demonstration showcases the flexibility and power of the model in generating contextually relevant and creative text responses. By formatting the outputs, we ensure that the results are not only accurate but also presented in a manner that is easy to read and understand, enhancing the overall user experience within this Jupyter Notebook environment."
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "mlflow-dev-env",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/x-python",
   "name": "python",
   "nbconvert_exporter": "python",
   "pygments_lexer": "ipython3",
   "version": "3.8.13"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 2
}
```

--------------------------------------------------------------------------------

````
