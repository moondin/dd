---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 116
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 116 of 991)

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
Location: mlflow-master/docs/docs/genai/flavors/llama-index/index.mdx

```text
import { APILink } from "@site/src/components/APILink";
import { CardGroup, PageCard } from "@site/src/components/Card";

# MLflow LlamaIndex Flavor

## Introduction

**LlamaIndex** 🦙 is a powerful data-centric framework designed to seamlessly connect custom data sources to large language models (LLMs).
It offers a comprehensive suite of data structures and tools that simplify the process of ingesting, structuring, and
accessing private or domain-specific data for use with LLMs. LlamaIndex excels in enabling context-aware AI applications
by providing efficient indexing and retrieval mechanisms, making it easier to build advanced QA systems, chatbots,
and other AI-driven applications that require integration of external knowledge.

<div className="center-div" style={{ width: "70%" }}>
  ![Overview of LlamaIndex and MLflow integration](/images/llms/llama-index/llama-index-gateway.png)
</div>

## Why use LlamaIndex with MLflow?

The integration of the LlamaIndex library with MLflow provides a seamless experience for managing and deploying LlamaIndex engines. The following are some of the key benefits of using LlamaIndex with MLflow:

- [MLflow Tracking](/ml/tracking) allows you to track your indices within MLflow and manage the many moving parts that comprise your LlamaIndex project, such as prompts, LLMs, workflows, tools, global configurations, and more.
- [MLflow Model](/ml/model) packages your LlamaIndex index/engine/workflows with all its dependency versions, input and output interfaces, and other essential metadata. This allows you to deploy your LlamaIndex models for inference with ease, knowing that the environment is consistent across different stages of the ML lifecycle.
- [MLflow Evaluate](/genai/eval-monitor) provides native capabilities within MLflow to evaluate GenAI applications. This capability facilitates the efficient assessment of inference results from your LlamaIndex models, ensuring robust performance analytics and facilitating quick iterations.
- [MLflow Tracing](/genai/tracing) is a powerful observability tool for monitoring and debugging what happens inside the LlamaIndex models, helping you identify potential bottlenecks or issues quickly. With its powerful automatic logging capability, you can instrument your LlamaIndex application without needing to add any code apart from running a single command.

## Getting Started

In these introductory tutorials, you will learn the most fundamental components of LlamaIndex and how to leverage the integration with MLflow to bring better maintainability and observability to your LlamaIndex applications.

<CardGroup>
  <PageCard
    headerText="LlamaIndex Workflows with MLflow"
    link="/genai/flavors/llama-index/notebooks/llama_index_workflow_tutorial/"
    text="Get started with MLflow and LLamaIndex by building a simple agentic Workflow. Learn how to log and load the Workflow for inference, as well as enable tracing for observability."
  />
  <PageCard
    headerText="Building Index with MLflow"
    link="/genai/flavors/llama-index/notebooks/llama_index_quickstart/"
    text="Get started with MLflow and LlamaIndex by exploring the simplest possible index configuration of a VectorStoreIndex."
  />

</CardGroup>

## Concepts

:::note
Workflow integration is only available in LlamaIndex >= 0.11.0 and MLflow >= 2.17.0.
:::

### `Workflow` 🆕

The `Workflow` is LlamaIndex's event-driven orchestration framework. It is designed
as a flexible and interpretable framework for building arbitrary LLM applications such as an agent, a RAG flow, a data extraction pipeline, etc.
MLflow supports tracking, evaluating, and tracing the `Workflow` objects, which makes them more observable and maintainable.

### `Index`

The `Index` object is a collection of documents that are indexed for fast information retrieval, providing capabilities for applications such as Retrieval-Augmented Generation (RAG) and Agents. The `Index` object can be logged directly to an MLflow run and loaded back for use as an inference engine.

### `Engine`

The `Engine` is a generic interface built on top of the `Index` object, which provides a set of APIs to interact with the index. LlamaIndex provides two types of engines: `QueryEngine` and `ChatEngine`. The `QueryEngine` simply takes a single
query and returns a response based on the index. The `ChatEngine` is designed for conversational agents, which keeps track of the conversation history as well.

### `Settings`

The `Settings` object is a global service context that bundles commonly used resources throughout the
LlamaIndex application. It includes settings such as the LLM model, embedding model, callbacks, and more. When logging a LlamaIndex index/engine/workflow, MLflow tracks
the state of the `Settings` object so that you can easily reproduce the same result when loading the model back for inference (note that some objects like API keys, non-serializable objects, etc., are not tracked).

## Usage

### Saving and Loading Index in MLflow Experiment

#### Creating an Index

The `index` object is the centerpiece of the LlamaIndex and MLflow integration. With LlamaIndex, you can create an index from a collection of documents or external vector stores. The following code creates a sample index from Paul Graham's essay data available within the LlamaIndex repository.

```shell
mkdir -p data
curl -L https://raw.githubusercontent.com/run-llama/llama_index/main/docs/docs/examples/data/paul_graham/paul_graham_essay.txt -o ./data/paul_graham_essay.txt
```

```python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

documents = SimpleDirectoryReader("data").load_data()
index = VectorStoreIndex.from_documents(documents)
```

#### Logging the Index to MLflow

You can log the `index` object to the MLflow experiment using the <APILink fn="mlflow.llama_index.log_model" /> function.

One key step here is to specify the `engine_type` parameter. The choice of engine type does not affect the index itself,
but dictates the interface of how you query the index when you load it back for inference.

1. QueryEngine (`engine_type="query"`) is designed for a simple query-response system that takes a single query string and returns a response.
2. ChatEngine (`engine_type="chat"`) is designed for a conversational agent that keeps track of the conversation history and responds to a user message.
3. Retriever (`engine_type="retriever"`) is a lower-level component that returns the top-k relevant documents matching the query.

The following code is an example of logging an index to MLflow with the `chat` engine type.

```python
import mlflow

mlflow.set_experiment("llama-index-demo")

with mlflow.start_run():
    model_info = mlflow.llama_index.log_model(
        index,
        name="index",
        engine_type="chat",
        input_example="What did the author do growing up?",
    )
```

:::note
The above code snippet passes the index object directly to the `log_model` function.
This method only works with the default `SimpleVectorStore` vector store, which
simply keeps the embedded documents in memory. If your index uses **external vector stores** such as `QdrantVectorStore` or `DatabricksVectorSearch`, you can use the Model-from-Code
logging method. See the [How to log an index with external vector stores](#how-to-log-and-load-an-index-with-external-vector-stores) for more details.
:::

<div className="center-div" style={{ width: "80%" }}>
  ![MLflow artifacts for the LlamaIndex index](/images/llms/llama-index/llama-index-artifacts.png)
</div>

:::tip
Under the hood, MLflow calls `as_query_engine()` / `as_chat_engine()` / `as_retriever()` method on the index object to convert it to the respective engine instance.
:::

#### Loading the Index Back for inference

The saved index can be loaded back for inference using the <APILink fn="mlflow.pyfunc.load_model" /> function. This function
gives an MLflow Python Model backed by the LlamaIndex engine, with the engine type specified during logging.

```python
import mlflow

model = mlflow.pyfunc.load_model(model_info.model_uri)

response = model.predict("What was the first program the author wrote?")
print(response)
# >> The first program the author wrote was on the IBM 1401 ...

# The chat engine keeps track of the conversation history
response = model.predict("How did the author feel about it?")
print(response)
# >> The author felt puzzled by the first program ...
```

:::tip
To load the index itself back instead of the engine, use the <APILink fn="mlflow.llama_index.load_model" /> function.

```python
index = mlflow.llama_index.load_model("runs:/<run_id>/index")
```

:::

### Enable Tracing

You can enable tracing for your LlamaIndex code by calling the <APILink fn="mlflow.llama_index.autolog" /> function. MLflow automatically logs the input and output of the LlamaIndex execution to the active MLflow experiment, providing you with a detailed view of the model's behavior.

```python
import mlflow

mlflow.llama_index.autolog()

chat_engine = index.as_chat_engine()
response = chat_engine.chat("What was the first program the author wrote?")
```

Then you can navigate to the MLflow UI, select the experiment, and open the "Traces" tab to find the logged trace for the prediction made by the engine. It is impressive to see how the chat engine coordinates and executes a number of tasks to answer your question!

<div className="center-div" style={{ width: "80%" }}>
  ![Trace view in MLflow UI](/images/llms/llama-index/llama-index-trace.png)
</div>

You can disable tracing by running the same function with the `disable` parameter set to `True`:

```python
mlflow.llama_index.autolog(disable=True)
```

:::note
The tracing supports async prediction and streaming response, however, it does not
support the combination of async and streaming, such as the `astream_chat` method.
:::

## FAQ

### How to log and load an index with external vector stores?

If your index uses the default `SimpleVectorStore`, you can log the index directly to MLflow using the <APILink fn="mlflow.llama_index.log_model" /> function. MLflow persists the in-memory index data (embedded documents) to MLflow artifact store, which allows loading the index back with the same data without re-indexing the documents.

However, when the index uses external vector stores like `DatabricksVectorSearch` and `QdrantVectorStore`, the index data is stored remotely and they do not support local serialization. Thereby, you cannot log the index with these stores directly. For such cases, you can use the [Model-from-Code](/ml/model/models-from-code) logging that provides more control over the index saving process and allow you to use the external vector store.

To use model-from-code logging, you first need to create a separate Python file that defines the index. If you are on Jupyter notebook, you can use the `%%writefile` magic command to save the cell code to a Python file.

```python
# %%writefile index.py

# Create Qdrant client with your own settings.
client = qdrant_client.QdrantClient(
    host="localhost",
    port=6333,
)

# Here we simply load vector store from the existing collection to avoid
# re-indexing documents, because this Python file is executed every time
# when the model is loaded. If you don't have an existing collection, create
# a new one by following the official tutorial:
# https://docs.llamaindex.ai/en/stable/examples/vector_stores/QdrantIndexDemo/
vector_store = QdrantVectorStore(client=client, collection_name="my_collection")
index = VectorStoreIndex.from_vector_store(vector_store=vector_store)

# IMPORTANT: call set_model() method to tell MLflow to log this index
mlflow.models.set_model(index)
```

Then you can log the index by passing the Python file path to the <APILink fn="mlflow.llama_index.log_model" /> function. The global [Settings](https://docs.llamaindex.ai/en/stable/module_guides/supporting_modules/settings) object is saved normally as part of the model.

```python
import mlflow

with mlflow.start_run():
    model_info = mlflow.llama_index.log_model(
        "index.py",
        name="index",
        engine_type="query",
    )
```

The logged index can be loaded back using the <APILink fn="mlflow.llama_index.load_model" /> or <APILink fn="mlflow.pyfunc.load_model" /> function, in the same way as with the local index.

```python
index = mlflow.llama_index.load_model(model_info.model_uri)
index.as_query_engine().query("What is MLflow?")
```

:::note
The object that is passed to the `set_model()` method must be a LlamaIndex index that is compatible with the engine type specified during logging. More
objects support will be added in the future releases.
:::

### How to log and load a LlamaIndex Workflow?

Mlflow supports logging and loading a LlamaIndex Workflow via the [Model-from-Code](/ml/model/models-from-code) feature. For a detailed example of logging and loading a LlamaIndex Workflow, see the [LlamaIndex Workflows with MLflow](/genai/flavors/llama-index/notebooks/llama_index_workflow_tutorial/) notebook.

```python
import mlflow

with mlflow.start_run():
    model_info = mlflow.llama_index.log_model(
        "/path/to/workflow.py",
        name="model",
        input_example={"input": "What is MLflow?"},
    )
```

The logged workflow can be loaded back using the <APILink fn="mlflow.llama_index.load_model" /> or <APILink fn="mlflow.pyfunc.load_model" /> function.

```python
# Use mlflow.llama_index.load_model to load the workflow object as is
workflow = mlflow.llama_index.load_model(model_info.model_uri)
await workflow.run(input="What is MLflow?")

# Use mlflow.pyfunc.load_model to load the workflow as a MLflow Pyfunc Model
# with standard inference APIs for deployment and evaluation.
pyfunc = mlflow.pyfunc.load_model(model_info.model_uri)
pyfunc.predict({"input": "What is MLflow?"})
```

:::warning
The MLflow PyFunc Model does not support async inference. When you load the workflow with <APILink fn="mlflow.pyfunc.load_model" />, the `predict` method becomes **synchronous** and will block until the workflow execution is completed.
This also applies when deploying the logged LlamaIndex workflow to a production endpoint using [MLflow Deployment](/genai/serving) or Databricks [Model Serving](https://docs.databricks.com/en/machine-learning/model-serving/index.html).
:::

### I have an index logged with `query` engine type. Can I load it back a `chat` engine?

While it is not possible to update the engine type of the logged model in-place,
you can always load the index back and re-log it with the desired engine type. This process
does **not require re-creating the index**, so it is an efficient way to switch between
different engine types.

```python
import mlflow

# Log the index with the query engine type first
with mlflow.start_run():
    model_info = mlflow.llama_index.log_model(
        index,
        name="index-query",
        engine_type="query",
    )

# Load the index back and re-log it with the chat engine type
index = mlflow.llama_index.load_model(model_info.model_uri)
with mlflow.start_run():
    model_info = mlflow.llama_index.log_model(
        index,
        name="index-chat",
        # Specify the chat engine type this time
        engine_type="chat",
    )
```

Alternatively, you can leverage their standard inference APIs on the loaded LlamaIndex native index object, specifically:

- `index.as_chat_engine().chat("hi")`
- `index.as_query_engine().query("hi")`
- `index.as_retriever().retrieve("hi")`

### How to use different LLMs for inference with the loaded engine?

When saving the index to MLflow, it persists the global [Settings](https://docs.llamaindex.ai/en/stable/module_guides/supporting_modules/settings/) object as a part of the model.
This object contains settings such as LLM and embedding models to be used by engines.

```python
import mlflow
from llama_index.core import Settings
from llama_index.llms.openai import OpenAI

Settings.llm = OpenAI("gpt-4o-mini")

# MLflow saves GPT-4o-Mini as the LLM to use for inference
with mlflow.start_run():
    model_info = mlflow.llama_index.log_model(index, name="index", engine_type="chat")
```

Then later when you load the index back, the persisted settings are also applied globally. This means that the loaded engine will use the same LLM as when it was logged.

However, sometimes you may want to use a different LLM for inference. In such cases, you can update the global `Settings` object directly after loading the index.

```python
import mlflow

# Load the index back
loaded_index = mlflow.llama_index.load_model(model_info.model_uri)

assert Settings.llm.model == "gpt-4o-mini"


# Update the settings to use GPT-4 instead
Settings.llm = OpenAI("gpt-4")
query_engine = loaded_index.as_query_engine()
response = query_engine.query("What is the capital of France?")
```
```

--------------------------------------------------------------------------------

---[FILE: llama_index_quickstart.ipynb]---
Location: mlflow-master/docs/docs/genai/flavors/llama-index/notebooks/llama_index_quickstart.ipynb

```text
{
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "# Introduction to Using LlamaIndex with MLflow\n",
    "\n",
    "Welcome to this interactive tutorial designed to introduce you to [LlamaIndex](https://www.llamaindex.ai/) and its integration with MLflow. This tutorial is structured as a notebook to provide a hands-on, practical learning experience with the simplest and most core features of LlamaIndex."
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### What you will learn\n",
    "By the end of this tutorial you will have:\n",
    "\n",
    "* Created an MVP VectorStoreIndex in LlamaIndex.\n",
    "* Logged that index to the MLflow tracking server.\n",
    "* Registered that index to the MLflow model registry.\n",
    "* Loaded the model and performed inference.\n",
    "* Explored the MLflow UI to learn about logged artifacts.\n",
    "\n",
    "These basics will familiarize you with the LlamaIndex user journey in MLlfow."
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### Setup\n",
    "\n",
    "First, we must ensure we have the required dependecies and environment variables. By default, LlamaIndex uses OpenAI as the source for LLMs and embeding models, so we'll do the same. Let's start by installing the requisite libraries and providing an OpenAI API key.\n"
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
      "Note: you may need to restart the kernel to use updated packages.\n"
     ]
    }
   ],
   "source": [
    "%pip install mlflow>=2.15 llama-index>=0.10.44 -q"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 2,
   "metadata": {},
   "outputs": [],
   "source": [
    "import os\n",
    "from getpass import getpass\n",
    "\n",
    "from llama_index.core import Document, VectorStoreIndex\n",
    "from llama_index.core.llms import ChatMessage\n",
    "\n",
    "import mlflow\n",
    "\n",
    "os.environ[\"OPENAI_API_KEY\"] = getpass(\"Enter your OpenAI API key: \")"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 21,
   "metadata": {},
   "outputs": [],
   "source": [
    "assert \"OPENAI_API_KEY\" in os.environ, \"Please set the OPENAI_API_KEY environment variable.\""
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### Create a Index \n",
    "\n",
    "[Vector store indexes](https://docs.llamaindex.ai/en/stable/module_guides/storing/vector_stores/) are one of the core components in LlamaIndex. They contain embedding vectors of ingested document chunks (and sometimes the document chunks as well). These vectors enable various types of inference, such as query engines, chat engines, and retrievers, each serving different purposes in LlamaIndex.\n",
    "\n",
    "1. **Query Engine:**\n",
    "   - **Usage:** Perform straightforward queries to retrieve relevant information based on a user's question.\n",
    "   - **Scenario:** Ideal for fetching concise answers or documents matching specific queries, similar to a search engine.\n",
    "\n",
    "2. **Chat Engine:**\n",
    "   - **Usage:** Engage in conversational AI tasks that require maintaining context and history over multiple interactions.\n",
    "   - **Scenario:** Suitable for interactive applications like customer support bots or virtual assistants, where conversation context is important.\n",
    "\n",
    "3. **Retriever:**\n",
    "   - **Usage:** Retrieve documents or text segments that are semantically similar to a given input.\n",
    "   - **Scenario:** Useful in retrieval-augmented generation (RAG) systems to fetch relevant context or background information, enhancing the quality of generated responses in tasks like summarization or question answering.\n",
    "\n",
    "By leveraging these different types of inference, LlamaIndex allows you to build robust AI applications tailored to various use cases, enhancing interaction between users and large language models.\n",
    "\n",
    "\n",
    "\n",
    "\n",
    "\n",
    "\n",
    "\n",
    "\n",
    "\n"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 4,
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "------------- Example Document used to Enrich LLM Context -------------\n",
      "Doc ID: e4c638ce-6757-482e-baed-096574550602\n",
      "Text: Context LLMs are a phenomenal piece of technology for knowledge\n",
      "generation and reasoning. They are pre-trained on large amounts of\n",
      "publicly available data. How do we best augment LLMs with our own\n",
      "private data? We need a comprehensive toolkit to help perform this\n",
      "data augmentation for LLMs.  Proposed Solution That's where LlamaIndex\n",
      "comes in. Ll...\n",
      "\n",
      "------------- Example Query Engine -------------\n",
      "LlamaIndex is a \"data framework\" designed to assist in building LLM apps by offering tools such as data connectors for various data sources, ways to structure data for easy use with LLMs, an advanced retrieval/query interface, and integrations with different application frameworks. It caters to both beginner and advanced users, providing a high-level API for simple data ingestion and querying, as well as lower-level APIs for customization and extension of different modules to suit individual needs.\n",
      "\n",
      "------------- Example Chat Engine  -------------\n",
      "LlamaIndex is a data framework designed to assist in building LLM apps by providing tools such as data connectors for various data sources, ways to structure data for easy use with LLMs, an advanced retrieval/query interface, and integrations with different application frameworks. It caters to both beginner and advanced users with a high-level API for easy data ingestion and querying, as well as lower-level APIs for customization and extension of different modules to suit specific needs.\n",
      "\n",
      "------------- Example Retriever   -------------\n",
      "[NodeWithScore(node=TextNode(id_='d18bb1f1-466a-443d-98d9-6217bf71ee5a', embedding=None, metadata={'filename': 'README.md', 'category': 'codebase'}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={<NodeRelationship.SOURCE: '1'>: RelatedNodeInfo(node_id='e4c638ce-6757-482e-baed-096574550602', node_type=<ObjectType.DOCUMENT: '4'>, metadata={'filename': 'README.md', 'category': 'codebase'}, hash='3183371414f6a23e9a61e11b45ec45f808b148f9973166cfed62226e3505eb05')}, text='Context\\nLLMs are a phenomenal piece of technology for knowledge generation and reasoning.\\nThey are pre-trained on large amounts of publicly available data.\\nHow do we best augment LLMs with our own private data?\\nWe need a comprehensive toolkit to help perform this data augmentation for LLMs.\\n\\nProposed Solution\\nThat\\'s where LlamaIndex comes in. LlamaIndex is a \"data framework\" to help\\nyou build LLM  apps. It provides the following tools:\\n\\nOffers data connectors to ingest your existing data sources and data formats\\n(APIs, PDFs, docs, SQL, etc.)\\nProvides ways to structure your data (indices, graphs) so that this data can be\\neasily used with LLMs.\\nProvides an advanced retrieval/query interface over your data:\\nFeed in any LLM input prompt, get back retrieved context and knowledge-augmented output.\\nAllows easy integrations with your outer application framework\\n(e.g. with LangChain, Flask, Docker, ChatGPT, anything else).\\nLlamaIndex provides tools for both beginner users and advanced users.\\nOur high-level API allows beginner users to use LlamaIndex to ingest and\\nquery their data in 5 lines of code. Our lower-level APIs allow advanced users to\\ncustomize and extend any module (data connectors, indices, retrievers, query engines,\\nreranking modules), to fit their needs.', mimetype='text/plain', start_char_idx=1, end_char_idx=1279, text_template='{metadata_str}\\n\\n{content}', metadata_template='{key}: {value}', metadata_seperator='\\n'), score=0.850998849877966)]\n"
     ]
    }
   ],
   "source": [
    "print(\"------------- Example Document used to Enrich LLM Context -------------\")\n",
    "llama_index_example_document = Document.example()\n",
    "print(llama_index_example_document)\n",
    "\n",
    "index = VectorStoreIndex.from_documents([llama_index_example_document])\n",
    "\n",
    "print(\"\\n------------- Example Query Engine -------------\")\n",
    "query_response = index.as_query_engine().query(\"What is llama_index?\")\n",
    "print(query_response)\n",
    "\n",
    "print(\"\\n------------- Example Chat Engine  -------------\")\n",
    "chat_response = index.as_chat_engine().chat(\n",
    "    \"What is llama_index?\",\n",
    "    chat_history=[ChatMessage(role=\"system\", content=\"You are an expert on RAG!\")],\n",
    ")\n",
    "print(chat_response)\n",
    "\n",
    "\n",
    "print(\"\\n------------- Example Retriever   -------------\")\n",
    "retriever_response = index.as_retriever().retrieve(\"What is llama_index?\")\n",
    "print(retriever_response)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### Log the Index with MLflow\n",
    "\n",
    "The below code logs a LlamaIndex model with MLflow, allowing you to persist and manage it across different environments. By using MLflow, you can track, version, and reproduce your model reliably. The script logs parameters, an example input, and registers the model under a specific name. The `model_uri` provides a unique identifier for retrieving the model later. This persistence is essential for ensuring consistency and reproducibility in development, testing, and production. Managing the model with MLflow simplifies loading, deployment, and sharing, maintaining an organized workflow.\n",
    "\n",
    "Key Parameters\n",
    "\n",
    "* ``engine_type``: defines the pyfunc and spark_udf inference type\n",
    "* ``input_example``: defines the the input signature and infers the output signature via a prediction\n",
    "* ``registered_model_name``: defines the name of the model in the MLflow model registry"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 5,
   "metadata": {},
   "outputs": [
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "2024/07/24 17:58:27 INFO mlflow.llama_index.serialize_objects: API key(s) will be removed from the global Settings object during serialization to protect against key leakage. At inference time, the key(s) must be passed as environment variables.\n",
      "/Users/michael.berk/opt/anaconda3/envs/mlflow-dev/lib/python3.8/site-packages/_distutils_hack/__init__.py:26: UserWarning: Setuptools is replacing distutils.\n",
      "  warnings.warn(\"Setuptools is replacing distutils.\")\n",
      "Successfully registered model 'my_llama_index_vector_store'.\n",
      "Created version '1' of model 'my_llama_index_vector_store'.\n"
     ]
    },
    {
     "data": {
      "application/vnd.jupyter.widget-view+json": {
       "model_id": "643e7b6936674e469f98d94004f3424a",
       "version_major": 2,
       "version_minor": 0
      },
      "text/plain": [
       "Downloading artifacts:   0%|          | 0/12 [00:00<?, ?it/s]"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Unique identifier for the model location for loading: runs:/036936a7ac964f0cb6ab99fa908d6421/llama_index\n"
     ]
    }
   ],
   "source": [
    "mlflow.llama_index.autolog()  # This is for enabling tracing\n",
    "\n",
    "with mlflow.start_run() as run:\n",
    "    mlflow.llama_index.log_model(\n",
    "        index,\n",
    "        name=\"llama_index\",\n",
    "        engine_type=\"query\",  # Defines the pyfunc and spark_udf inference type\n",
    "        input_example=\"hi\",  # Infers signature\n",
    "        registered_model_name=\"my_llama_index_vector_store\",  # Stores an instance in the model registry\n",
    "    )\n",
    "\n",
    "    run_id = run.info.run_id\n",
    "    model_uri = f\"runs:/{run_id}/llama_index\"\n",
    "    print(f\"Unique identifier for the model location for loading: {model_uri}\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### Load the Index and Perform Inference\n",
    "\n",
    "The below code demonstrates three core types of inference that can be done with the loaded model.\n",
    "\n",
    "1. **Load and Perform Inference via LlamaIndex:** This method loads the model using `mlflow.llama_index.load_model` and performs direct querying, chat, or retrieval. It is ideal when you want to leverage the full capabilities of the underlying llama index object.\n",
    "2. **Load and Perform Inference via MLflow PyFunc:** This method loads the model using `mlflow.pyfunc.load_model`, enabling model predictions in a generic PyFunc format, with the engine type specified at logging time. It is useful for evaluating the model with `mlflow.genai.evaluate` or deploying the model for serving. \n",
    "3. **Load and Perform Inference via MLflow Spark UDF:** This method uses `mlflow.pyfunc.spark_udf` to load the model as a Spark UDF, facilitating distributed inference across large datasets in a Spark DataFrame. It is ideal for handling large-scale data processing and, like with PyFunc inference, only supports the engine type defined when logging.\n"
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
      "2024/07/24 18:02:21 WARNING mlflow.tracing.processor.mlflow: Creating a trace within the default experiment with id '0'. It is strongly recommended to not use the default experiment to log traces due to ambiguous search results and probable performance issues over time due to directory table listing performance degradation with high volumes of directories within a specific path. To avoid performance and disambiguation issues, set the experiment for your environment using `mlflow.set_experiment()` API.\n"
     ]
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "\n",
      "------------- Inference via Llama Index   -------------\n"
     ]
    },
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "2024/07/24 18:02:22 WARNING mlflow.tracing.processor.mlflow: Creating a trace within the default experiment with id '0'. It is strongly recommended to not use the default experiment to log traces due to ambiguous search results and probable performance issues over time due to directory table listing performance degradation with high volumes of directories within a specific path. To avoid performance and disambiguation issues, set the experiment for your environment using `mlflow.set_experiment()` API.\n"
     ]
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Hello! How can I assist you today?\n",
      "\n",
      "------------- Inference via MLflow PyFunc -------------\n",
      "Hello! How can I assist you today?\n"
     ]
    }
   ],
   "source": [
    "print(\"\\n------------- Inference via Llama Index   -------------\")\n",
    "index = mlflow.llama_index.load_model(model_uri)\n",
    "query_response = index.as_query_engine().query(\"hi\")\n",
    "print(query_response)\n",
    "\n",
    "print(\"\\n------------- Inference via MLflow PyFunc -------------\")\n",
    "index = mlflow.pyfunc.load_model(model_uri)\n",
    "query_response = index.predict(\"hi\")\n",
    "print(query_response)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 6,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Optional: Spark UDF inference\n",
    "show_spark_udf_inference = False\n",
    "if show_spark_udf_inference:\n",
    "    print(\"\\n------------- Inference via MLflow Spark UDF -------------\")\n",
    "    from pyspark.sql import SparkSession\n",
    "\n",
    "    spark = SparkSession.builder.getOrCreate()\n",
    "\n",
    "    udf = mlflow.pyfunc.spark_udf(spark, model_uri, result_type=\"string\")\n",
    "    df = spark.createDataFrame([(\"hi\",), (\"hello\",)], [\"text\"])\n",
    "    df.withColumn(\"response\", udf(\"text\")).toPandas()"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### Explore the MLflow UI\n",
    "\n",
    "Finally, let's explore what's happening under the hood. To open the MLflow UI, run the following\n",
    "cell. Note that you can also run this in a new CLI window at the same directory that contains\n",
    "your `mlruns` folder, which by default will be this notebook's directory."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 7,
   "metadata": {},
   "outputs": [
    {
     "data": {
      "text/plain": [
       "<subprocess.Popen at 0x7fbe09399ee0>"
      ]
     },
     "execution_count": 7,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "import os\n",
    "import subprocess\n",
    "\n",
    "from IPython.display import IFrame\n",
    "\n",
    "# Start the MLflow UI in a background process\n",
    "mlflow_ui_command = [\"mlflow\", \"ui\", \"--port\", \"5000\"]\n",
    "subprocess.Popen(\n",
    "    mlflow_ui_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, preexec_fn=os.setsid\n",
    ")"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Wait for the MLflow server to start then run the following command\n",
    "# Note that cached results don't render, so you need to run this to see the UI\n",
    "IFrame(src=\"http://localhost:5000\", width=1000, height=600)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "Let's navigate to the experiments tab in the top left of the screen and click on our most recent\n",
    "run, as shown in the image below.\n",
    "\n",
    "MLflow logs artifacts associated with your model and its environment during the MLflow run. \n",
    "Most of the logged files, such as the `conda.yaml`, `python_env.yml`, and \n",
    "`requirements.txt` are standard to all MLflow logging and facilitate reproducibility between\n",
    "environments. However, there are two sets of artifacts that are specific to LlamaIndex:\n",
    "\n",
    "* `index`: a directory that stores the serialized vector store. For more details, visit [LlamaIndex's serialization docs](https://docs.llamaindex.ai/en/stable/module_guides/storing/save_load/).\n",
    "* `settings.json`: the serialized `llama_index.core.Settings` service context. For more details, visit [LlamaIndex's Settings docs](https://docs.llamaindex.ai/en/stable/module_guides/supporting_modules/settings/)\n",
    "\n",
    "By storing these objects, MLflow is able to recreate the environment in which you logged your model.\n",
    "\n",
    "![llama_index_mlflow_ui_run](/images/llms/llama-index/llama_index_mlflow_ui_run.png)\n",
    "\n",
    "**Important:** MLflow will not serialize API keys. Those must be present in your model loading \n",
    "environment as environment variables. \n"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "We also created a record of the model in the model registry. By simply specifying \n",
    "`registered_model_name` and `input_example` when logging the model, we get robust signature\n",
    "inference and an instance in the model registry, as shown below.\n",
    "\n",
    "![llama_index_mlflow_ui_registered_model](/images/llms/llama-index/llama_index_mlflow_ui_registered_model.png)\n"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "Finally, let's explore the traces we logged. In the `Experiments` tab we can click on `Tracing` to \n",
    "view the logged traces for our two inference calls. Tracing effectively shows a callback-based\n",
    "stacktrace for what ocurred in our inference system. \n",
    "\n",
    "![llama_index_tracing_quickstart](/images/llms/llama-index/llama_index_tracing_quickstart.png)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "If we click on our first trace, we can see some really cool details about our inputs, outputs,\n",
    "and the duration of each step in the chain.\n",
    "\n",
    "![llama_index_single_trace_quickstart](/images/llms/llama-index/llama_index_single_trace_quickstart.png)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## Customization and Next Steps\n",
    "\n",
    "When working with production systems, typically users leverage a customized service context, which can be done via LlamaIndex's [Settings](https://docs.llamaindex.ai/en/stable/module_guides/supporting_modules/settings/) object. "
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
   "version": "3.8.19"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 2
}
```

--------------------------------------------------------------------------------

````
