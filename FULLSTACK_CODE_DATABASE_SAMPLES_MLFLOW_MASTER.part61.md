---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 61
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 61 of 991)

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

---[FILE: conversational-model.ipynb]---
Location: mlflow-master/docs/docs/classic-ml/deep-learning/transformers/tutorials/conversational/conversational-model.ipynb

```text
{
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "# Introduction to Conversational AI with MLflow and DialoGPT\n",
    "\n",
    "Welcome to our tutorial on integrating [Microsoft's DialoGPT](https://huggingface.co/microsoft/DialoGPT-medium) with MLflow's transformers flavor to explore conversational AI."
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "\n",
    "### Learning Objectives\n",
    "\n",
    "In this tutorial, you will:\n",
    "\n",
    "- Set up a conversational AI **pipeline** using DialoGPT from the Transformers library.\n",
    "- **Log** the DialoGPT model along with its configurations using MLflow.\n",
    "- Infer the input and output **signature** of the DialoGPT model.\n",
    "- **Load** a stored DialoGPT model from MLflow for interactive usage.\n",
    "- Interact with the chatbot model and understand the nuances of conversational AI.\n",
    "\n",
    "By the end of this tutorial, you will have a solid understanding of managing and deploying conversational AI models with MLflow, enhancing your capabilities in natural language processing.\n",
    "\n",
    "#### What is DialoGPT?\n",
    "DialoGPT is a conversational model developed by Microsoft, fine-tuned on a large dataset of dialogues to generate human-like responses. Part of the GPT family, DialoGPT excels in natural language understanding and generation, making it ideal for chatbots.\n",
    "\n",
    "#### Why MLflow with DialoGPT?\n",
    "Integrating MLflow with DialoGPT enhances conversational AI model development:\n",
    "\n",
    "- **Experiment Tracking**: Tracks configurations and metrics across experiments.\n",
    "- **Model Management**: Manages different versions and configurations of chatbot models.\n",
    "- **Reproducibility**: Ensures the reproducibility of the model's behavior.\n",
    "- **Deployment**: Simplifies deploying conversational models in production."
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
    "### Setting Up the Conversational Pipeline\n",
    "\n",
    "We begin by setting up a conversational pipeline with DialoGPT using `transformers` and managing it with MLflow.\n",
    "\n",
    "We start by importing essential libraries. The `transformers` library from Hugging Face offers a rich collection of pre-trained models, including DialoGPT, for various NLP tasks. MLflow, a comprehensive tool for the ML lifecycle, aids in experiment tracking, reproducibility, and deployment.\n",
    "\n",
    "#### Initializing the Conversational Pipeline\n",
    "Using the `transformers.pipeline` function, we set up a conversational pipeline. We choose the \"`microsoft/DialoGPT-medium`\" model, balancing performance and resource efficiency, ideal for conversational AI. This step is pivotal for ensuring the model is ready for interaction and integration into various applications.\n",
    "\n",
    "#### Inferring the Model Signature with MLflow\n",
    "Model signature is key in defining how the model interacts with input data. To infer it, we use a sample input (\"`Hi there, chatbot!`\") and leverage `mlflow.transformers.generate_signature_output` to understand the model's input-output schema. This process ensures clarity in the model's data requirements and prediction format, crucial for seamless deployment and usage.\n",
    "\n",
    "This configuration phase sets the stage for a robust conversational AI system, leveraging the strengths of DialoGPT and MLflow for efficient and effective conversational interactions."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 2,
   "metadata": {},
   "outputs": [
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "The attention mask and the pad token id were not set. As a consequence, you may observe unexpected behavior. Please pass your input's `attention_mask` to obtain reliable results.\n",
      "Setting `pad_token_id` to `eos_token_id`:50256 for open-end generation.\n",
      "A decoder-only architecture is being used, but right-padding was detected! For correct generation results, please set `padding_side='left'` when initializing the tokenizer.\n"
     ]
    }
   ],
   "source": [
    "import transformers\n",
    "\n",
    "import mlflow\n",
    "\n",
    "# Define our pipeline, using the default configuration specified in the model card for DialoGPT-medium\n",
    "conversational_pipeline = transformers.pipeline(model=\"microsoft/DialoGPT-medium\")\n",
    "\n",
    "# Infer the signature by providing a representnative input and the output from the pipeline inference abstraction in the transformers flavor in MLflow\n",
    "signature = mlflow.models.infer_signature(\n",
    "    \"Hi there, chatbot!\",\n",
    "    mlflow.transformers.generate_signature_output(conversational_pipeline, \"Hi there, chatbot!\"),\n",
    ")"
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
   "execution_count": 3,
   "metadata": {},
   "outputs": [
    {
     "data": {
      "text/plain": [
       "<Experiment: artifact_location='file:///Users/benjamin.wilson/repos/mlflow-fork/mlflow/docs/source/llms/transformers/tutorials/conversational/mlruns/370178017237207703', creation_time=1701292102618, experiment_id='370178017237207703', last_update_time=1701292102618, lifecycle_stage='active', name='Conversational', tags={}>"
      ]
     },
     "execution_count": 3,
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
    "# Set a name for the experiment that is indicative of what the runs being created within it are in regards to\n",
    "mlflow.set_experiment(\"Conversational\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### Logging the Model with MLflow\n",
    "\n",
    "We'll now use MLflow to log our conversational AI model, ensuring systematic versioning, tracking, and management.\n",
    "\n",
    "#### Initiating an MLflow Run\n",
    "Our first step is to start an MLflow run with `mlflow.start_run()`. This action initiates a new tracking environment, capturing all model-related data under a unique run ID. It's a crucial step to segregate and organize different modeling experiments.\n",
    "\n",
    "#### Logging the Conversational Model\n",
    "We log our DialoGPT conversational model using `mlflow.transformers.log_model`. This specialized function efficiently logs Transformer models and requires several key parameters:\n",
    "\n",
    "- **transformers_model**: We pass our DialoGPT conversational pipeline.\n",
    "- **artifact_path**: The storage location within the MLflow run, aptly named `\"chatbot\"`.\n",
    "- **task**: Set to `\"conversational\"` to reflect the model's purpose.\n",
    "- **signature**: The inferred model signature, dictating expected inputs and outputs.\n",
    "- **input_example**: A sample prompt, like `\"A clever and witty question\"`, to demonstrate expected usage.\n",
    "\n",
    "Through this process, MLflow not only tracks our model but also organizes its metadata, facilitating future retrieval, understanding, and deployment."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 4,
   "metadata": {},
   "outputs": [],
   "source": [
    "with mlflow.start_run():\n",
    "    model_info = mlflow.transformers.log_model(\n",
    "        transformers_model=conversational_pipeline,\n",
    "        name=\"chatbot\",\n",
    "        task=\"conversational\",\n",
    "        signature=signature,\n",
    "        input_example=\"A clever and witty question\",\n",
    "    )"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### Loading and Interacting with the Chatbot Model\n",
    "\n",
    "Next, we'll load the MLflow-logged chatbot model and interact with it to see it in action.\n",
    "\n",
    "#### Loading the Model with MLflow\n",
    "We use `mlflow.pyfunc.load_model` to load our conversational AI model. This function is a crucial aspect of MLflow's Python function flavor, offering a versatile way to interact with Python models. By specifying `model_uri=model_info.model_uri`, we precisely target the stored location of our DialoGPT model within MLflow's tracking system.\n",
    "\n",
    "#### Interacting with the Chatbot\n",
    "Once loaded, the model, referenced as `chatbot`, is ready for interaction. We demonstrate its conversational capabilities by:\n",
    "\n",
    "- **Asking Questions**: Posing a question like \"What is the best way to get to Antarctica?\" to the chatbot.\n",
    "- **Capturing Responses**: The chatbot's response, generated through the `predict` method, provides a practical example of its conversational skills. For instance, it might respond with suggestions about reaching Antarctica by boat.\n",
    "\n",
    "This demonstration highlights the practicality and convenience of deploying and using models logged with MLflow, especially in dynamic and interactive scenarios like conversational AI."
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
       "model_id": "f46b4d8422cd4fac874bc5b87e85e474",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "Loading checkpoint shards:   0%|          | 0/3 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "The attention mask and the pad token id were not set. As a consequence, you may observe unexpected behavior. Please pass your input's `attention_mask` to obtain reliable results.\n",
      "Setting `pad_token_id` to `eos_token_id`:50256 for open-end generation.\n",
      "A decoder-only architecture is being used, but right-padding was detected! For correct generation results, please set `padding_side='left'` when initializing the tokenizer.\n"
     ]
    }
   ],
   "source": [
    "# Load the model as a generic python function in order to leverage the integrated Conversational Context\n",
    "# Note that loading a conversational model with the native flavor (i.e., `mlflow.transformers.load_model()`) will not include anything apart from the\n",
    "# pipeline itself; if choosing to load in this way, you will need to manage your own Conversational Context instance to maintain state on the\n",
    "# conversation history.\n",
    "chatbot = mlflow.pyfunc.load_model(model_uri=model_info.model_uri)\n",
    "\n",
    "# Validate that the model is capable of responding to a question\n",
    "first = chatbot.predict(\"What is the best way to get to Antarctica?\")"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 6,
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Response: I think you can get there by boat.\n"
     ]
    }
   ],
   "source": [
    "print(f\"Response: {first}\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### Continuing the Conversation with the Chatbot\n",
    "\n",
    "We further explore the MLflow `pyfunc` implementation's conversational contextual statefulness with the DialoGPT chatbot model.\n",
    "\n",
    "#### Testing Contextual Memory\n",
    "We pose a follow-up question, \"What sort of boat should I use?\" to test the chatbot's contextual understanding. The response we get, \"A boat that can go to Antarctica,\" while straightforward, showcases the MLflow pyfunc model's ability to retain and utilize conversation history for coherent responses with `ConversationalPipeline` types of models.\n",
    "\n",
    "#### Understanding the Response Style\n",
    "The response's style – witty and slightly facetious – reflects the training data's nature, primarily conversational exchanges from Reddit. This training source significantly influences the model's tone and style, leading to responses that can be humorous and diverse.\n",
    "\n",
    "#### Implications of Training Data\n",
    "This interaction underlines the importance of the training data's source in shaping the model's responses. When deploying such models in real-world applications, it's essential to understand and consider the training data's influence on the model's conversational style and knowledge base."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 7,
   "metadata": {},
   "outputs": [
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "The attention mask and the pad token id were not set. As a consequence, you may observe unexpected behavior. Please pass your input's `attention_mask` to obtain reliable results.\n",
      "Setting `pad_token_id` to `eos_token_id`:50256 for open-end generation.\n",
      "A decoder-only architecture is being used, but right-padding was detected! For correct generation results, please set `padding_side='left'` when initializing the tokenizer.\n"
     ]
    }
   ],
   "source": [
    "# Verify that the PyFunc implementation has maintained state on the conversation history by asking a vague follow-up question that requires context\n",
    "# in order to answer properly\n",
    "second = chatbot.predict(\"What sort of boat should I use?\")"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 8,
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Response: A boat that can go to Antarctica.\n"
     ]
    }
   ],
   "source": [
    "print(f\"Response: {second}\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### Conclusion and Key Takeaways\n",
    "\n",
    "In this tutorial, we've explored the integration of MLflow with a conversational AI model, specifically using the DialoGPT model from Microsoft. We've covered several important aspects and techniques that are crucial for anyone looking to work with advanced machine learning models in a practical, real-world setting.\n",
    "\n",
    "#### Key Takeaways\n",
    "\n",
    "1. **MLflow for Model Management**: We demonstrated how MLflow can be effectively used for managing and deploying machine learning models. The ability to log models, track experiments, and manage different versions of models is invaluable in a machine learning workflow.\n",
    "\n",
    "2. **Conversational AI**: By using the DialoGPT model, we delved into the world of conversational AI, showcasing how to set up and interact with a conversational model. This included understanding the nuances of maintaining conversational context and the impact of training data on the model's responses.\n",
    "\n",
    "3. **Practical Implementation**: Through practical examples, we showed how to log a model in MLflow, infer a model signature, and use the `pyfunc` model flavor for easy deployment and interaction. This hands-on approach is designed to provide you with the skills needed to implement these techniques in your own projects.\n",
    "\n",
    "4. **Understanding Model Responses**: We emphasized the importance of understanding the nature of the model's training data. This understanding is crucial for interpreting the model's responses and for tailoring the model to specific use cases.\n",
    "\n",
    "5. **Contextual History**: MLflow's `transformers` `pyfunc` implementation for `ConversationalPipelines` maintains a `Conversation` context without the need for managing state yourself. This enables chat bots to be created with minimal effort, since statefulness is maintained for you.\n",
    "\n",
    "### Wrapping Up\n",
    "\n",
    "As we conclude this tutorial, we hope that you have gained a deeper understanding of how to integrate MLflow with conversational AI models and the practical considerations involved in deploying these models. The skills and knowledge acquired here are not only applicable to conversational AI but also to a broader range of machine learning applications.\n",
    "\n",
    "Remember, the field of machine learning is vast and constantly evolving. Continuous learning and experimentation are key to staying updated and making the most out of these exciting technologies.\n",
    "\n",
    "Thank you for joining us in this journey through the world of MLflow and conversational AI. We encourage you to take these learnings and apply them to your own unique challenges and projects. Happy coding!\n"
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

---[FILE: pyfunc-chat-model.ipynb]---
Location: mlflow-master/docs/docs/classic-ml/deep-learning/transformers/tutorials/conversational/pyfunc-chat-model.ipynb

```text
{
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "# Deploying a Transformer model as an OpenAI-compatible Chatbot\n",
    "\n",
    "Welcome to our tutorial on using Transformers and MLflow to create an OpenAI-compatible chat model. In MLflow 2.11 and up, MLflow's Transformers flavors support special task type `llm/v1/chat`, which turns thousands of [text-generation](https://huggingface.co/models?pipeline_tag=text-generation) models on Hugging Face into conversational chat bots that are interoperable with OpenAI models. This enables you to seamlessly swap out your chat app's backing LLM or to easily evaluate different models without having to edit your client-side code.\n",
    "\n",
    "If you haven't already seen it, you may find it helpful to go through our [introductory notebook on chat and Transformers](https://mlflow.org/docs/latest/ml/deep-learning/transformers/tutorials/conversational/conversational-model.html) before proceeding with this one, as this notebook is slightly higher-level and does not delve too deeply into the inner workings of Transformers or MLflow Tracking.\n",
    "\n",
    "\n",
    "**Note**: This page covers how to deploy a **Transformers** models as a chatbot. If you are using a different framework or a custom python model, use [ChatModel](https://mlflow.org/docs/latest/genai/flavors/chat-model-intro/index.html) instead to build an OpenAI-compatible chat bot.\n",
    "\n",
    "### Learning objectives\n",
    "\n",
    "In this tutorial, you will:\n",
    "\n",
    "- Create an OpenAI-compatible chat model using TinyLLama-1.1B-Chat\n",
    "- Log the model to MLflow and load it back for local inference.\n",
    "- Serve the model with MLflow Model Serving"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "%pip install mlflow>=2.11.0 -q -U\n",
    "# OpenAI-compatible chat model support is available for Transformers 4.34.0 and above\n",
    "%pip install transformers>=4.34.0 -q -U"
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
    "### Building a Chat Model\n",
    "\n",
    "MLflow's native Transformers integration allows you to specify the `task` param when saving or logging your pipelines. Originally, this param accepts any of the [Transformers pipeline task types](https://huggingface.co/tasks), but the `mlflow.transformers` flavor adds a few more MLflow-specific keys for `text-generation` pipeline types.\n",
    "\n",
    "For `text-generation` pipelines, instead of specifying `text-generation` as the task type, you can provide one of two string literals conforming to the [MLflow AI Gateway's endpoint_type specification](https://mlflow.org/docs/latest/genai/governance/ai-gateway/#deployments-configuration-details) (\"llm/v1/embeddings\" can be specified as a task on models saved with `mlflow.sentence_transformers`):\n",
    "\n",
    "- \"llm/v1/chat\" for chat-style applications\n",
    "- \"llm/v1/completions\" for generic completions\n",
    "\n",
    "When one of these keys is specified, MLflow will automatically handle everything required to serve a chat or completions model. This includes:\n",
    "\n",
    "- Setting a chat/completions compatible signature on the model\n",
    "- Performing data pre- and post-processing to ensure the inputs and outputs conform to the [Chat/Completions API spec](https://mlflow.org/docs/latest/genai/serving/responses-agent#openai-api-compatibility), which is compatible with OpenAI's API spec.\n",
    "\n",
    "Note that these modifications only apply when the model is loaded with `mlflow.pyfunc.load_model()` (e.g. when serving the model with the `mlflow models serve` CLI tool). If you want to load just the base pipeline, you can always do so via `mlflow.transformers.load_model()`.\n",
    "\n",
    "In the next few cells, we'll learn how serve a chat model with a local Transformers pipeline and MLflow, using TinyLlama-1.1B-Chat as an example. \n",
    "\n",
    "To begin, let's go through the original flow of saving a text generation pipeline:"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 27,
   "metadata": {},
   "outputs": [
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "/var/folders/qd/9rwd0_gd0qs65g4sdqlm51hr0000gp/T/ipykernel_55429/4268198845.py:11: FutureWarning: The 'transformers' MLflow Models integration is known to be compatible with the following package version ranges: ``4.25.1`` -  ``4.37.1``. MLflow Models integrations with transformers may not succeed when used with package versions outside of this range.\n",
      "  mlflow.transformers.save_model(\n"
     ]
    }
   ],
   "source": [
    "from transformers import pipeline\n",
    "\n",
    "import mlflow\n",
    "\n",
    "generator = pipeline(\n",
    "    \"text-generation\",\n",
    "    model=\"TinyLlama/TinyLlama-1.1B-Chat-v1.0\",\n",
    ")\n",
    "\n",
    "# save the model using the vanilla `text-generation` task type\n",
    "mlflow.transformers.save_model(\n",
    "    path=\"tinyllama-text-generation\", transformers_model=generator, task=\"text-generation\"\n",
    ")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "Now, let's load the model and use it for inference. Our loaded model is a `text-generation` pipeline, and let's take a look at its signature to see its expected inputs and outputs."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 28,
   "metadata": {},
   "outputs": [
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "5b41063f67ce4e2cac11e68b7d838f55",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "Loading checkpoint shards:   0%|          | 0/5 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "2024/02/26 21:06:51 WARNING mlflow.transformers: Could not specify device parameter for this pipeline type\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "d1e4fe7d982748e0b81204261de839ab",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "Loading checkpoint shards:   0%|          | 0/5 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "data": {
      "text/plain": [
       "inputs: \n",
       "  [string (required)]\n",
       "outputs: \n",
       "  [string (required)]\n",
       "params: \n",
       "  None"
      ]
     },
     "execution_count": 28,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "# load the model for inference\n",
    "model = mlflow.pyfunc.load_model(\"tinyllama-text-generation\")\n",
    "\n",
    "model.metadata.signature"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "Unfortunately, it only accepts `string` as input, which isn't directly compatible with a chat interface. When interacting with OpenAI's API, for example, we expect to simply be able to input a list of messages. In order to do this with our current model, we'll have to write some additional boilerplate:"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 29,
   "metadata": {},
   "outputs": [
    {
     "data": {
      "text/plain": [
       "['<|user|>\\nWrite me a hello world program in python</s>\\n<|assistant|>\\nHere\\'s a simple hello world program in Python:\\n\\n```python\\nprint(\"Hello, world!\")\\n```\\n\\nThis program prints the string \"Hello, world!\" to the console. You can run this program by typing it into the Python interpreter or by running the command `python hello_world.py` in your terminal.']"
      ]
     },
     "execution_count": 29,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "# first, apply the tokenizer's chat template, since the\n",
    "# model is tuned to accept prompts in a chat format. this\n",
    "# also converts the list of messages to a string.\n",
    "messages = [{\"role\": \"user\", \"content\": \"Write me a hello world program in python\"}]\n",
    "prompt = generator.tokenizer.apply_chat_template(\n",
    "    messages, tokenize=False, add_generation_prompt=True\n",
    ")\n",
    "\n",
    "model.predict(prompt)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "Now we're getting somewhere, but formatting our messages prior to inference is cumbersome. \n",
    "\n",
    "Additionally, the output format isn't compatible with the OpenAI API spec either--it's just a list of strings. If we were looking to evaluate different model backends for our chat app, we'd have to rewrite some of our client-side code to both format the input, and to parse this new response.\n",
    "\n",
    "To simplify all this, let's just pass in `\"llm/v1/chat\"` as the task param when saving the model."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 30,
   "metadata": {},
   "outputs": [
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "/var/folders/qd/9rwd0_gd0qs65g4sdqlm51hr0000gp/T/ipykernel_55429/609241782.py:3: FutureWarning: The 'transformers' MLflow Models integration is known to be compatible with the following package version ranges: ``4.25.1`` -  ``4.37.1``. MLflow Models integrations with transformers may not succeed when used with package versions outside of this range.\n",
      "  mlflow.transformers.save_model(\n"
     ]
    }
   ],
   "source": [
    "# save the model using the `\"llm/v1/chat\"`\n",
    "# task type instead of `text-generation`\n",
    "mlflow.transformers.save_model(\n",
    "    path=\"tinyllama-chat\", transformers_model=generator, task=\"llm/v1/chat\"\n",
    ")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "Once again, let's load the model and inspect the signature:"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 31,
   "metadata": {},
   "outputs": [
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "e74df03331624bbdb7527cb813ae70bb",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "Loading checkpoint shards:   0%|          | 0/5 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "2024/02/26 21:10:04 WARNING mlflow.transformers: Could not specify device parameter for this pipeline type\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "d147b02249f5430dbb8780d207ba3bc1",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "Loading checkpoint shards:   0%|          | 0/5 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "data": {
      "text/plain": [
       "inputs: \n",
       "  ['messages': Array({content: string (required), name: string (optional), role: string (required)}) (required), 'temperature': double (optional), 'max_tokens': long (optional), 'stop': Array(string) (optional), 'n': long (optional), 'stream': boolean (optional)]\n",
       "outputs: \n",
       "  ['id': string (required), 'object': string (required), 'created': long (required), 'model': string (required), 'choices': Array({finish_reason: string (required), index: long (required), message: {content: string (required), name: string (optional), role: string (required)} (required)}) (required), 'usage': {completion_tokens: long (required), prompt_tokens: long (required), total_tokens: long (required)} (required)]\n",
       "params: \n",
       "  None"
      ]
     },
     "execution_count": 31,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "model = mlflow.pyfunc.load_model(\"tinyllama-chat\")\n",
    "\n",
    "model.metadata.signature"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "Now when performing inference, we can pass our messages in a dict as we'd expect to do when interacting with the OpenAI API. Furthermore, the response we receive back from the model also conforms to the spec."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 32,
   "metadata": {},
   "outputs": [
    {
     "data": {
      "text/plain": [
       "[{'id': '8435a57d-9895-485e-98d3-95b1cbe007c0',\n",
       "  'object': 'chat.completion',\n",
       "  'created': 1708949437,\n",
       "  'model': 'TinyLlama/TinyLlama-1.1B-Chat-v1.0',\n",
       "  'usage': {'prompt_tokens': 24, 'completion_tokens': 71, 'total_tokens': 95},\n",
       "  'choices': [{'index': 0,\n",
       "    'finish_reason': 'stop',\n",
       "    'message': {'role': 'assistant',\n",
       "     'content': 'Here\\'s a simple hello world program in Python:\\n\\n```python\\nprint(\"Hello, world!\")\\n```\\n\\nThis program prints the string \"Hello, world!\" to the console. You can run this program by typing it into the Python interpreter or by running the command `python hello_world.py` in your terminal.'}}]}]"
      ]
     },
     "execution_count": 32,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "messages = [{\"role\": \"user\", \"content\": \"Write me a hello world program in python\"}]\n",
    "\n",
    "model.predict({\"messages\": messages})"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### Serving the Chat Model\n",
    "\n",
    "To take this example further, let's use MLflow to serve our chat model, so we can interact with it like a web API. To do this, we can use the `mlflow models serve` CLI tool. \n",
    "\n",
    "In a terminal shell, run:\n",
    "```\n",
    "$ mlflow models serve -m tinyllama-chat\n",
    "```\n",
    "\n",
    "When the server has finished initializing, you should be able to interact with the model via HTTP requests. The input format is almost identical to the format described in the [MLflow Deployments Server docs](https://mlflow.org/docs/latest/ml/deployment/index.html#chat), with the exception that `temperature` defaults to `1.0` instead of `0.0`.\n",
    "\n",
    "Here's a quick example:"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 33,
   "metadata": {},
   "outputs": [
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current\n",
      "                                 Dload  Upload   Total   Spent    Left  Speed\n",
      "100   706  100   617  100    89     25      3  0:00:29  0:00:23  0:00:06   160\n"
     ]
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "[\n",
      "  {\n",
      "    \"id\": \"fc3d08c3-d37d-420d-a754-50f77eb32a92\",\n",
      "    \"object\": \"chat.completion\",\n",
      "    \"created\": 1708949465,\n",
      "    \"model\": \"TinyLlama/TinyLlama-1.1B-Chat-v1.0\",\n",
      "    \"usage\": {\n",
      "      \"prompt_tokens\": 24,\n",
      "      \"completion_tokens\": 71,\n",
      "      \"total_tokens\": 95\n",
      "    },\n",
      "    \"choices\": [\n",
      "      {\n",
      "        \"index\": 0,\n",
      "        \"finish_reason\": \"stop\",\n",
      "        \"message\": {\n",
      "          \"role\": \"assistant\",\n",
      "          \"content\": \"Here's a simple hello world program in Python:\\n\\n```python\\nprint(\\\"Hello, world!\\\")\\n```\\n\\nThis program prints the string \\\"Hello, world!\\\" to the console. You can run this program by typing it into the Python interpreter or by running the command `python hello_world.py` in your terminal.\"\n",
      "        }\n",
      "      }\n",
      "    ]\n",
      "  }\n",
      "]\n"
     ]
    }
   ],
   "source": [
    "%%sh\n",
    "curl http://127.0.0.1:5000/invocations \\\n",
    "    -H 'Content-Type: application/json' \\\n",
    "    -d '{ \"messages\": [{\"role\": \"user\", \"content\": \"Write me a hello world program in python\"}] }' \\\n",
    "    | jq"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "It's that easy!\n",
    "\n",
    "You can also call the API with a few optional inference params to adjust the model's responses. These map to Transformers pipeline params, and are passed in directly at inference time.\n",
    "\n",
    "- `max_tokens` (maps to `max_new_tokens`): The maximum number of new tokens the model should generate.\n",
    "- `temperature` (maps to `temperature`): Controls the creativity of the model's response. Note that this is not guaranteed to be supported by all models, and in order for this param to have an effect, the pipeline must have been created with `do_sample=True`.\n",
    "- `stop` (maps to `stopping_criteria`): A list of tokens at which to stop generation.\n",
    "\n",
    "Note: `n` does not have an equivalent Transformers pipeline param, and is not supported in queries. However, you can implement a model that consumes the `n` param using Custom Pyfunc (details below)."
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## Conclusion\n",
    "\n",
    "In this tutorial, you learned how to create an OpenAI-compatible chat model by specifying \"llm/v1/chat\" as the task when saving Transformers pipelines.\n",
    "\n",
    "### What's next?\n",
    "\n",
    "- [Learn about custom ChatModel](https://mlflow.org/docs/latest/llms/chat-model-intro/index.html). If you're looking for futrher customization or models outside Transformers, the linked page provides a hand-on guidance for how to build a chat bot with MLflow's ``ChatModel`` class.\n",
    "- [More on MLflow AI Gateway](https://mlflow.org/docs/latest/ml/deployment/index.html). In this tutorial, we saw how to deploy a model using a local server, but MLflow provides many other ways to deploy your models to production. Check out this page to learn more about the different options.\n",
    "- [More on MLflow's Transformers Integration](https://mlflow.org/docs/latest/ml/deep-learning/transformers/index.html). This page provides a comprehensive overview on MLflow's Transformers integrations, along with lots of hands-on guides and notebooks. Learn how to fine-tune models, use prompt templates, and more!\n",
    "- [Other LLM Integrations](https://mlflow.org/docs/latest/genai/index.html). Aside from Transformers, MLflow has integrations with many other popular LLM libraries, such as Langchain and OpenAI."
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": []
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

````
