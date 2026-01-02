---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 112
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 112 of 991)

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

---[FILE: autologging.mdx]---
Location: mlflow-master/docs/docs/genai/flavors/langchain/autologging.mdx

```text
import { APILink } from "@site/src/components/APILink";
import { Table } from "@site/src/components/Table";
import useBaseUrl from '@docusaurus/useBaseUrl';

# MLflow Langchain Autologging

MLflow LangChain flavor supports autologging, a powerful feature that allows you to log crucial details about the LangChain model and execution without the need for explicit logging statements. MLflow LangChain autologging covers various aspects of the model, including traces, models, signatures and more.

:::note
MLflow LangChain Autologging is verified to be compatible with LangChain versions between 0.1.0 and 0.2.3. Outside of this range, the feature may not work as expected. To install the compatible version of LangChain, please run the following command:
:::

```
pip install mlflow[langchain] --upgrade
```

## Quickstart

To enable autologging for LangChain models, call <APILink fn="mlflow.langchain.autolog" /> at the beginning of your script or notebook. This will automatically log the traces by default as well as other artifacts such as models, input examples, and model signatures if you explicitly enable them. For more information about the configuration, please refer to the [Configure Autologging](#configure-autologging) section.

```python
import mlflow

mlflow.langchain.autolog()

# Enable other optional logging
# mlflow.langchain.autolog(log_models=True, log_input_examples=True)

# Your LangChain model code here
...
```

Once you have invoked the chain, you can view the logged traces and artifacts in the MLflow UI.

<video src={useBaseUrl("/images/llms/tracing/tracing-top.mp4")} controls loop autoPlay muted aria-label="MLflow Tracing" />

## Configure Autologging

MLflow LangChain autologging can log various information about the model and its inference. **By default, only trace logging is enabled**, but you can enable autologging of other information by setting the corresponding parameters when calling <APILink fn="mlflow.langchain.autolog" />. For other configurations, please refer to the API documentation.

<Table>
    <thead>
        <tr>
            <th>Target</th>
            <th>Default</th>
            <th>Parameter</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Traces</td>
            <td>`true`</td>
            <td>`log_traces`</td>
            <td>Whether to generate and log traces for the model. See [MLflow Tracing](/genai/tracing/) for more details about tracing feature.</td>
        </tr>
        <tr>
            <td>Model Artifacts</td>
            <td>`false`</td>
            <td>`log_models`</td>
            <td>If set to `True`, the LangChain model will be logged when it is invoked. Supported models are `Chain`, `AgentExecutor`, `BaseRetriever`, `SimpleChatModel`, `ChatPromptTemplate`, and subset of `Runnable` types. Please refer to the [MLflow repository](https://github.com/mlflow/mlflow/blob/d2955cc90b6c5d7c931a8476b85f66e63990ca96/mlflow/langchain/utils.py#L183) for the full list of supported models.</td>
        </tr>
        <tr>
            <td>Model Signatures</td>
            <td>`false`</td>
            <td>`log_model_signatures`</td>
            <td>If set to `True`, <APILink fn="mlflow.models.ModelSignature">ModelSignatures</APILink> describing model inputs and outputs are collected and logged along with Langchain model artifacts during inference. This option is only available when `log_models` is enabled.</td>
        </tr>
        <tr>
            <td>Input Example</td>
            <td>`false`</td>
            <td>`log_input_examples`</td>
            <td>If set to `True`, input examples from inference data are collected and logged along with LangChain model artifacts during inference. This option is only available when `log_models` is enabled.</td>
        </tr>
    </tbody>
</Table>

For example, to disable logging of traces, and instead enable model logging, run the following code:

```python
import mlflow

mlflow.langchain.autolog(log_traces=False)
```

:::note
MLflow does not support automatic model logging for chains that contain retrievers. Saving retrievers requires additional `loader_fn` and `persist_dir` information for loading the model. If you want to log the model with retrievers, please log the model manually as shown in the [retriever_chain](https://github.com/mlflow/mlflow/blob/master/examples/langchain/retriever_chain.py) example.
:::

## Example Code of LangChain Autologging

```python
import os
from operator import itemgetter

from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.schema.output_parser import StrOutputParser
from langchain.schema.runnable import RunnableLambda

import mlflow

# Uncomment the following to use the full abilities of langchain autologgin
# %pip install `langchain_community>=0.0.16`
# These two libraries enable autologging to log text analysis related artifacts
# %pip install textstat spacy

assert (
    "OPENAI_API_KEY" in os.environ
), "Please set the OPENAI_API_KEY environment variable."

# Enable mlflow langchain autologging
mlflow.langchain.autolog()

prompt_with_history_str = """
Here is a history between you and a human: {chat_history}
Now, please answer this question: {question}
"""
prompt_with_history = PromptTemplate(
    input_variables=["chat_history", "question"], template=prompt_with_history_str
)


def extract_question(input):
    return input[-1]["content"]


def extract_history(input):
    return input[:-1]


llm = OpenAI(temperature=0.9)

# Build a chain with LCEL
chain_with_history = (
    {
        "question": itemgetter("messages") | RunnableLambda(extract_question),
        "chat_history": itemgetter("messages") | RunnableLambda(extract_history),
    }
    | prompt_with_history
    | llm
    | StrOutputParser()
)

inputs = {"messages": [{"role": "user", "content": "Who owns MLflow?"}]}

print(chain_with_history.invoke(inputs))
# sample output:
# "1. Databricks\n2. Microsoft\n3. Google\n4. Amazon\n\nEnter your answer: 1\n\n
# Correct! MLflow is an open source project developed by Databricks. ...

# We automatically log the model and trace related artifacts
# A model with name `lc_model` is registered, we can load it back as a PyFunc model
model_name = "lc_model"
model_version = 1
loaded_model = mlflow.pyfunc.load_model(f"models:/{model_name}/{model_version}")
print(loaded_model.predict(inputs))
```

## Tracing LangGraph

MLflow support automatic tracing for LangGraph, an open-source library from LangChain for building stateful, multi-actor applications with LLMs, used to create agent and multi-agent workflows. To enable auto-tracing for LangGraph, use the same <APILink fn="mlflow.langchain.autolog" /> function.

```python
from typing import Literal

import mlflow

from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent

# Enabling tracing for LangGraph (LangChain)
mlflow.langchain.autolog()

# Optional: Set a tracking URI and an experiment
mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("LangGraph")


@tool
def get_weather(city: Literal["nyc", "sf"]):
    """Use this to get weather information."""
    if city == "nyc":
        return "It might be cloudy in nyc"
    elif city == "sf":
        return "It's always sunny in sf"


llm = ChatOpenAI(model="gpt-4o-mini")
tools = [get_weather]
graph = create_react_agent(llm, tools)

# Invoke the graph
result = graph.invoke(
    {"messages": [{"role": "user", "content": "what is the weather in sf?"}]}
)
```

:::note
MLflow does not support other auto-logging features for LangGraph, such as automatic model logging. Only traces are logged for LangGraph.
:::

## How It Works

MLflow LangChain Autologging uses two ways to log traces and other artifacts. Tracing is made possible via the [Callbacks](https://python.langchain.com/v0.1/docs/modules/callbacks/) framework of LangChain. Other artifacts are recorded by patching the invocation functions of the supported models. In typical scenarios, you don't need to care about the internal implementation details, but this section provides a brief overview of how it works under the hood.

### MLflow Tracing Callbacks

[MlflowLangchainTracer](https://github.com/mlflow/mlflow/blob/master/mlflow/langchain/langchain_tracer.py) is a callback handler that is injected into the langchain model inference process to log traces automatically. It starts a new span upon a set of actions of the chain such as `on_chain_start`, `on_llm_start`, and concludes it when the action is finished. Various metadata such as span type, action name, input, output, latency, are automatically recorded to the span.

### Customize Callback

Sometimes you may want to customize what information is logged in the traces. You can achieve this by creating a custom callback handler that inherits from [MlflowLangchainTracer](https://github.com/mlflow/mlflow/blob/master/mlflow/langchain/langchain_tracer.py). The following example demonstrates how to record an additional attribute to the span when a chat model starts running.

```python
from mlflow.langchain.langchain_tracer import MlflowLangchainTracer


class CustomLangchainTracer(MlflowLangchainTracer):
    # Override the handler functions to customize the behavior. The method signature is defined by LangChain Callbacks.
    def on_chat_model_start(
        self,
        serialized: Dict[str, Any],
        messages: List[List[BaseMessage]],
        *,
        run_id: UUID,
        tags: Optional[List[str]] = None,
        parent_run_id: Optional[UUID] = None,
        metadata: Optional[Dict[str, Any]] = None,
        name: Optional[str] = None,
        **kwargs: Any,
    ):
        """Run when a chat model starts running."""
        attributes = {
            **kwargs,
            **metadata,
            # Add additional attribute to the span
            "version": "1.0.0",
        }

        # Call the _start_span method at the end of the handler function to start a new span.
        self._start_span(
            span_name=name or self._assign_span_name(serialized, "chat model"),
            parent_run_id=parent_run_id,
            span_type=SpanType.CHAT_MODEL,
            run_id=run_id,
            inputs=messages,
            attributes=kwargs,
        )
```

### Patch Functions for Logging Artifacts

Other artifacts such as models are logged by patching the invocation functions of the supported models to insert the logging call. MLflow patches the following functions:

- `invoke`
- `batch`
- `stream`
- `get_relevant_documents` (for retrievers)
- `__call__` (for Chains and AgentExecutors)
- `ainvoke`
- `abatch`
- `astream`

:::warning
MLflow supports autologging for async functions (e.g., `ainvoke`, `abatch`, `astream`), however, the logging operation is not
asynchronous and may block the main thread. The invocation function itself is still not blocking and returns a coroutine object, but
the logging overhead may slow down the model inference process. Please be aware of this side effect when using async functions with autologging.
:::

## FAQ

If you encounter any issues with MLflow LangChain flavor, please also refer to [FAQ](/genai/flavors/langchain/#faq). If you still have questions, please feel free to open an issue in [MLflow Github repo](https://github.com/mlflow/mlflow/issues).

### How to suppress the warning messages during autologging?

MLflow Langchain Autologging calls various logging functions and LangChain utilities under the hood. Some of them may
generate warning messages that are not critical to the autologging process. If you want to suppress these warning messages, pass `silent=True` to the <APILink fn="mlflow.langchain.autolog" /> function.

```python
import mlflow

mlflow.langchain.autolog(silent=True)

# No warning messages will be emitted from autologging
```

### I can't load the model logged by mlflow langchain autologging

There are a few type of models that MLflow LangChain autologging does not support native saving or loading.

- **Model contains langchain retrievers**

  LangChain retrievers are not supported by MLflow autologging. If your model contains a retriever, you will need to manually log the model using the `mlflow.langchain.log_model` API.
  As loading those models requires specifying `loader_fn` and `persist_dir` parameters, please check examples in
  [retriever_chain](https://github.com/mlflow/mlflow/blob/master/examples/langchain/retriever_chain.py).

- **Can't pickle certain objects**

  For certain models that LangChain does not support native saving or loading, we will pickle the object when saving it. Due to this functionality, your cloudpickle version must be
  consistent between the saving and loading environments to ensure that object references resolve properly. For further guarantees of correct object representation, you should ensure that your
  environment has `pydantic` installed with at least version 2.

### How to customize span names in the traces?

By default, MLflow creates span names based on the class name in LangChain, such as `ChatOpenAI`, `RunnableLambda`, etc. If you want to customize the span names, you can do the following:

1. Pass `name` parameter to the constructor of the LangChain class. This is useful when you want to set a specific name for a single component.
2. Use `with_config` method to set the name for the runnables. You can pass the `"run_name"` key to the config dictionary to set a name for a sub chain that contains multiple components.

```python
import mlflow
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

# Enable auto-tracing for LangChain
mlflow.langchain.autolog()

# Method 1: Pass `name` parameter to the constructor
model = ChatOpenAI(name="custom-llm", model="gpt-4o-mini")
# Method 2: Use `with_config` method to set the name for the runnables
runnable = (model | StrOutputParser()).with_config({"run_name": "custom-chain"})

runnable.invoke("Hi")
```

The above code will create a trace like the following:

![Customize Span Names in LangChain Traces](/images/llms/tracing/langchain-name-customize.png)

### How to add extra metadata to a span?

You can record extra metadata to the span by passing the `metadata` parameter of the LangChain's `RunnableConfig` dictionary, either to the constructor or at runtime.

```python
import mlflow
from langchain_openai import ChatOpenAI

# Enable auto-tracing for LangChain
mlflow.langchain.autolog()

# Pass metadata to the constructor using `with_config` method
model = ChatOpenAI(model="gpt-4o-mini").with_config({"metadata": {"key1": "value1"}})

# Pass metadata at runtime using the `config` parameter
model.invoke("Hi", config={"metadata": {"key2": "value2"}})
```

The metadata can be accessed in the `Attributes` tab in the MLflow UI.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/genai/flavors/langchain/index.mdx

```text
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import { PageCard, CardGroup } from "@site/src/components/Card";
import { APILink } from "@site/src/components/APILink";
import Link from "@docusaurus/Link";

# MLflow LangChain Flavor

:::info
The `langchain` flavor is under active development and is marked as Experimental. Public APIs are
subject to change, and new features may be added as the flavor evolves.
:::

Welcome to the developer guide for the integration of [LangChain](https://www.langchain.com/) with MLflow. This guide serves as a comprehensive
resource for understanding and leveraging the combined capabilities of LangChain and MLflow in developing advanced language model applications.

[LangChain](https://www.langchain.com/) is a versatile framework designed for building applications powered by language models. It excels in creating context-aware applications
that utilize language models for reasoning and generating responses, enabling the development of sophisticated NLP applications.

[LangGraph](https://langchain-ai.github.io/langgraph/) is a complementary agent-based framework from the creators of Langchain, supporting the creation of
stateful agent and multi-agent GenAI applications. LangGraph utilizes LangChain in order to interface with GenAI agent components.

## Why use MLflow with LangChain?

Aside from the benefits of using MLflow for managing and deploying machine learning models, the integration of LangChain with MLflow provides a number of
benefits that are associated with using LangChain within the broader MLflow ecosystem.

### Experiment Tracking

LangChain's flexibility in experimenting with various agents, tools, and retrievers becomes even more powerful when paired with [MLflow Tracking](/ml/tracking). This combination allows for rapid experimentation and iteration. You can effortlessly compare runs, making it easier to refine models and accelerate the journey from development to production deployment.

### Dependency Management

Deploy your LangChain application with confidence, leveraging MLflow's ability to [manage and record code and environment dependencies](/ml/model/dependencies) automatically.
You can also explicitly declare external resource dependencies, like the LLM serving endpoint or vector search index queried by your LangChain application.
These dependencies are tracked by MLflow as model metadata, so that downstream serving systems can ensure authentication from your
deployed LangChain application to these dependent resources just works.

These features ensure consistency between development and production environments, reducing deployment risks with less manual intervention.

### MLflow Evaluate

[MLflow Evaluate](/genai/eval-monitor) provides native capabilities within MLflow to evaluate language models. With this feature you can easily utilize automated evaluation algorithms on the results of your LangChain application's inference results. This capability facilitates the efficient assessment of inference results from your LangChain application, ensuring robust performance analytics.

### Observability

[MLflow Tracing](/genai/tracing) is a new feature of MLflow that allows you to trace how data flows through your LangChain chain/agents/etc. This feature provides a visual representation of the data flow, making it easier to understand the behavior of your LangChain application and identify potential bottlenecks or issues. With its powerful [Automatic Tracing](/genai/tracing/app-instrumentation/automatic) capability, you can instrument your LangChain application without any code change but just running `mlflow.langchain.autolog()` command once.

## Automatic Logging

Autologging is a powerful one stop solution to achieve all the above benefits with just one line of code `mlflow.langchain.autolog()`. By enabling autologging, you can automatically log all the components of your LangChain application, including chains, agents, and retrievers, with minimal effort. This feature simplifies the process of tracking and managing your LangChain application, allowing you to focus on developing and improving your models. For more information on how to use this feature, refer to the [MLflow LangChain Autologging Documentation](/genai/flavors/langchain/autologging).

## Supported Elements in MLflow LangChain Integration

- [Agents](https://python.langchain.com/docs/how_to/#agents)
- [Retrievers](https://python.langchain.com/docs/how_to/#retrievers)
- [Runnables](https://python.langchain.com/v0.1/docs/expression_language/interface/)
- [LangGraph Complied Graph](https://langchain-ai.github.io/langgraph/reference/graphs/) (only supported via [Model-from-Code](#logging-models-from-code))
- [LLMChain](https://python.langchain.com/docs/versions/v0_2/deprecations/#llmchain) (deprecated, only support for `langchain<0.3.0`)
- [RetrievalQA](https://js.langchain.com/docs/modules/chains/popular/vector_db_qa) (deprecated, only support for `langchain<0.3.0`) {/* <!-- markdown-link-check-disable-line --> */}

:::warning
There is a known deserialization issue when logging chains or agents dependent upon LangChain components from [the partner packages](https://python.langchain.com/v0.1/docs/integrations/platforms/#partner-packages) such as `langchain-openai`. If you log such models using the legacy serialization based logging, some components may be loaded from the respective `langchain-community` package instead of the partner package library, which can lead to unexpected behavior or import errors when executing your code.
To avoid this issue, we strongly recommend using the [Model-from-Code](#logging-models-from-code) method for logging such models. This method allows you to bypass the model serialization and robustly save the model definition.
:::

:::info
Logging chains/agents that include [ChatOpenAI](https://python.langchain.com/docs/integrations/chat/openai) and [AzureChatOpenAI](https://python.langchain.com/docs/integrations/chat/azure_chat_openai) requires `MLflow>=2.12.0` and `LangChain>=0.0.307`.
:::

## Overview of Chains, Agents, and Retrievers

<Tabs>
    <TabItem label="Chain" value="chain" default>
        Sequences of actions or steps hardcoded in code. Chains in LangChain combine various components like prompts, models, and output parsers to create a flow of processing steps.

        The figure below shows an example of interfacing directly with a SaaS LLM via API calls with no context to the history of the conversation in the top portion. The
        bottom portion shows the same queries being submitted to a LangChain chain that incorporates a conversation history state such that the entire conversation's history
        is included with each subsequent input. Preserving conversational context in this manner is key to creating a "chat bot".

        <div style={{ width: "80%", margin: "auto" }}>
            ![The importance of stateful storage of conversation history for chat applications](/images/tutorials/llms/stateful-chains.png)
        </div>
    </TabItem>
    <TabItem label="Agents" value="agents">
        Dynamic constructs that use language models to choose a sequence of actions. Unlike chains, agents decide the order of actions based on inputs, tools available, and intermediate outcomes.

        <div style={{ width: "80%", margin: "auto" }}>
            ![Complex LLM queries with LangChain agents](/images/tutorials/llms/langchain-agents.png)
        </div>
    </TabItem>
    <TabItem label="Retrievers" value="retrievers">
        Components in RetrievalQA chains responsible for sourcing relevant documents or data. Retrievers are key in applications where LLMs need to reference specific external information for accurate responses.

        <div style={{ width: "80%", margin: "auto" }}>
            ![MLflow LangChain RetrievalQA architecture](/images/tutorials/llms/langchain-retrievalqa.png)
        </div>
    </TabItem>

</Tabs>

## Getting Started with the MLflow LangChain Flavor - Tutorials and Guides

### Introductory Tutorial

In this introductory tutorial, you will learn the most fundamental components of LangChain and how to leverage the integration with MLflow to store, retrieve, and
use a chain.

<CardGroup>
  <PageCard
    link="/genai/flavors/langchain/notebooks/langchain-quickstart"
    headerText="LangChain Quickstart"
    text={[
      "Get started with MLflow and LangChain by exploring the simplest possible chain configuration of a prompt and model chained to create a single-purpose utility application.",
    ]}
  />
</CardGroup>

### Advanced Tutorials

In these tutorials, you can learn about more complex usages of LangChain with MLflow. It is highly advised to read through the introductory tutorial prior to
exploring these more advanced use cases.

<CardGroup>
  <PageCard
    link="/genai/flavors/langchain/notebooks/langchain-retriever"
    headerText="RAG tutorial with LangChain"
    text={[
      "Learn how to build a LangChain RAG with MLflow integration to answer highly specific questions about the legality of business ventures.",
    ]}
  />
</CardGroup>

### Logging models from Code

Since MLflow 2.12.2, MLflow introduced the ability to log LangChain models directly from a code definition.

The feature provides several benefits to manage LangChain models:

1. **Avoid Serialization Complication**: File handles, sockets, external connections, dynamic references, lambda functions and system resources are unpicklable. Some LangChain components do not support native serialization, e.g. `RunnableLambda`.

2. **No Pickling**: Loading a pickle or cloudpickle file in a Python version that was different than the one used to serialize the object does not guarantee compatibility.

3. **Readability**: The serialized objects are often hardly readable by humans. Model-from-code allows you to review your model definition via code.

Refer to the [Models From Code feature documentation](/ml/model/models-from-code) for more information about this feature.

In order to use this feature, you will utilize the <APILink fn="mlflow.models.set_model" /> API to define the chain that you would like to log as an MLflow model.
After having this set within your code that defines your chain, when logging your model, you will specify the **path** to the file that defines your chain.

The following example demonstrates how to log a simple chain with this method:

1. Define the chain in a separate Python file

   :::tip
   If you are using Jupyter Notebook, you can use the `%%writefile` magic command to write the code cell directly to a file, without leaving the notebook to create it manually.
   :::

   ```python
   # %%writefile chain.py

   import os
   from operator import itemgetter

   from langchain_core.output_parsers import StrOutputParser
   from langchain_core.prompts import PromptTemplate
   from langchain_core.runnables import RunnableLambda
   from langchain_openai import OpenAI

   import mlflow

   mlflow.set_experiment("Homework Helper")

   mlflow.langchain.autolog()

   prompt = PromptTemplate(
       template="You are a helpful tutor that evaluates my homework assignments and provides suggestions on areas for me to study further."
       " Here is the question: {question} and my answer which I got wrong: {answer}",
       input_variables=["question", "answer"],
   )


   def get_question(input):
       default = "What is your name?"
       if isinstance(input_data[0], dict):
           return input_data[0].get("content").get("question", default)
       return default


   def get_answer(input):
       default = "My name is Bobo"
       if isinstance(input_data[0], dict):
           return input_data[0].get("content").get("answer", default)
       return default


   model = OpenAI(temperature=0.95)

   chain = (
       {
           "question": itemgetter("messages") | RunnableLambda(get_question),
           "answer": itemgetter("messages") | RunnableLambda(get_answer),
       }
       | prompt
       | model
       | StrOutputParser()
   )

   mlflow.models.set_model(chain)
   ```

2. Then from the main notebook, log the model via supplying the path to the file that defines the chain:

   ```python
   from pprint import pprint

   import mlflow

   chain_path = "chain.py"

   with mlflow.start_run():
       info = mlflow.langchain.log_model(lc_model=chain_path, name="chain")
   ```

3. The model defined in `chain.py` is now logged to MLflow. You can load the model back and run inference:

   ```python
   # Load the model and run inference
   homework_chain = mlflow.langchain.load_model(model_uri=info.model_uri)

   exam_question = {
       "messages": [
           {
               "role": "user",
               "content": {
                   "question": "What is the primary function of control rods in a nuclear reactor?",
                   "answer": "To stir the primary coolant so that the neutrons are mixed well.",
               },
           },
       ]
   }

   response = homework_chain.invoke(exam_question)

   pprint(response)
   ```

   You can see the model is logged as a code on MLflow UI:

   ![Logging a LangChain model from a code script file](/images/tutorials/llms/langchain-code-model.png)

:::warning
When logging models from code, make sure that your code does not contain any sensitive information, such as API keys, passwords, or other confidential data. The code will be stored in plain text in the MLflow model artifact, and anyone with access to the artifact will be able to view the code.
:::

## [Detailed Documentation](/genai/flavors/langchain/guide/)

To learn more about the details of the MLflow LangChain flavor, read the detailed guide below.

<Link to="/genai/flavors/langchain/guide/">
  <button className="button button--primary">View the Comprehensive Guide</button>
</Link>

## FAQ

### I can't load my chain!

- **Allowing for Dangerous Deserialization**: Pickle opt-in logic in LangChain will prevent components from being loaded via MLflow. You might see an error like this:

  ```
  ValueError: This code relies on the pickle module. You will need to set allow_dangerous_deserialization=True if you want to opt-in to
  allow deserialization of data using pickle. Data can be compromised by a malicious actor if not handled properly to include a malicious
  payload that when deserialized with pickle can execute arbitrary code on your machine.
  ```

  A change within LangChain that [forces users to opt-in to pickle deserialization](https://github.com/langchain-ai/langchain/pull/18696) can create
  some issues with loading chains, vector stores, retrievers, and agents that have been logged using MLflow. Because the option is not exposed per component
  to set this argument on the loader function, you will need to ensure that you are setting this option directly within the defined loader function when
  logging the model. LangChain components that do not set this value will be saved without issue, but a `ValueError` will be raised when loading if unset.

  To fix this, simply re-log your model, specifying the option `allow_dangerous_deserialization=True` in your defined loader function. See the tutorial
  [for LangChain retrievers](/genai/flavors/langchain/notebooks/langchain-retriever/#establishing-retrievalqa-chain-and-logging-with-mlflow) for an example of specifying this
  option when logging a `FAISS` vector store instance within a `loader_fn` declaration.

### I can't save my chain, agent, or retriever with MLflow.

:::tip
If you're encountering issues with logging or saving LangChain components with MLflow, see the [models from code](/ml/model/models-from-code)
feature documentation to determine if logging your model from a script file provides a simpler and more robust logging solution!
:::

- **Serialization Challenges with Cloudpickle**: Serialization with cloudpickle can encounter limitations depending on the complexity of the objects.

  Some objects, especially those with intricate internal states or dependencies on external system resources, are not inherently pickleable. This limitation
  arises because serialization essentially requires converting an object to a byte stream, which can be complex for objects tightly coupled with system states
  or those having external I/O operations. Try upgrading PyDantic to 2.x version to resolve this issue.

- **Verifying Native Serialization Support**: Ensure that the langchain object (chain, agent, or retriever) is serializable natively using langchain APIs if saving or logging with MLflow doesn't work.

  Due to their complex structures, not all langchain components are readily serializable. If native serialization
  is not supported and MLflow doesn't support saving the model, you can file an issue [in the LangChain repository](https://github.com/langchain-ai/langchain/issues) or
  ask for guidance in the [LangChain Discussions board](https://github.com/langchain-ai/langchain/discussions).

- **Keeping Up with New Features in MLflow**: MLflow might not immediately support the latest LangChain features immediately.

  If a new feature is not supported in MLflow, consider [filing a feature request on the MLflow GitHub issues page](https://github.com/mlflow/mlflow/issues).
  With the rapid pace of changes in libraries that are in heavy active development (such as [LangChain's release velocity](https://pypi.org/project/langchain/#history)),
  breaking changes, API refactoring, and fundamental functionality support for even existing features can cause integration issues. If there is a chain, agent,
  retriever, or any future structure within LangChain that you'd like to see supported, please let us know!

### I'm getting an AttributeError when saving my model

- **Handling Dependency Installation in LangChain and MLflow**: LangChain and MLflow do not automatically install all dependencies.

  Other packages that might be required for specific agents, retrievers, or tools may need to be explicitly defined when saving or logging your model.
  If your model relies on these external component libraries (particularly for tools) that not included in the standard LangChain package, these dependencies
  will not be automatically logged as part of the model at all times (see below for guidance on how to include them).

- **Declaring Extra Dependencies**: Use the `extra_pip_requirements` parameter when saving and logging.

  When saving or logging your model that contains external dependencies that are not part of the core langchain installation, you will need these additional
  dependencies. The model flavor contains two options for declaring these dependencies: `extra_pip_requirements` and `pip_requirements`. While specifying
  `pip_requirements` is entirely valid, we recommend using `extra_pip_requirements` as it does not rely on defining all of the core dependent packages that
  are required to use the langchain model for inference (the other core dependencies will be inferred automatically).

### How can I use a streaming API with LangChain?

- **Streaming with LangChain Models**: Ensure that the LangChain model supports a streaming response and use an MLflow version >= 2.12.2.

  As of the MLflow 2.12.2 release, LangChain models that support streaming responses that have been saved using MLflow 2.12.2 (or higher) can be loaded and used for
  streamable inference using the `predict_stream` API. Ensure that you are consuming the return type correctly, as the return from these models is a `Generator` object.
  To learn more, refer to the [predict_stream guide](https://mlflow.org/docs/latest/models.html#how-to-load-and-score-python-function-models).

### How can I log an agent built with LangGraph to MLflow?

The LangGraph integration with MLflow is designed to utilize the [Models From Code feature](/ml/model/models-from-code)
in MLflow to broaden and simplify the support of agent serialization.

To log a LangGraph agent, you can define your agent code within a script, as shown below, saved to a file `langgraph.py`:

```python
from typing import Literal

from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent

import mlflow


@tool
def get_weather(city: Literal["seattle", "sf"]):
    """Use this to get weather information."""
    if city == "seattle":
        return "It's probably raining. Again."
    elif city == "sf":
        return "It's always sunny in sf"


llm = ChatOpenAI()
tools = [get_weather]
graph = create_react_agent(llm, tools)

# specify the Agent as the model interface to be loaded when executing the script
mlflow.models.set_model(graph)
```

When you're ready to log this agent script definition to MLflow, you can refer to
this saved script directly when defining the model:

```python
import mlflow

input_example = {
    "messages": [{"role": "user", "content": "what is the weather in seattle today?"}]
}

with mlflow.start_run():
    model_info = mlflow.langchain.log_model(
        lc_model="./langgraph.py",  # specify the path to the LangGraph agent script definition
        name="langgraph",
        input_example=input_example,
    )
```

When the agent is loaded from MLflow, the script will be executed and the defined agent will be
made available for use for invocation.

The agent can be loaded and used for inference as follows:

```python
agent = mlflow.langchain.load_model(model_info.model_uri)
query = {
    "messages": [
        {
            "role": "user",
            "content": "Should I bring an umbrella today when I go to work in San Francisco?",
        }
    ]
}
agent.invoke(query)
```

### How to control whether my input is converted to List[langchain.schema.BaseMessage] in PyFunc predict?

By default, MLflow converts chat request format input `{"messages": [{"role": "user", "content": "some_question"}]}` to
List[langchain.schema.BaseMessage] like `[HumanMessage(content="some_question")]` for certain model types.
To force the conversion, set the environment variable `MLFLOW_CONVERT_MESSAGES_DICT_FOR_LANGCHAIN` to `True`.
To disable this behavior, set the environment variable `MLFLOW_CONVERT_MESSAGES_DICT_FOR_LANGCHAIN` to `False` as demonstrated below:

```python
import json
import mlflow
import os
from operator import itemgetter
from langchain.schema.runnable import RunnablePassthrough

model = RunnablePassthrough.assign(
    problem=lambda x: x["messages"][-1]["content"]
) | itemgetter("problem")

input_example = {
    "messages": [
        {
            "role": "user",
            "content": "Hello",
        }
    ]
}
# this model accepts the input_example
assert model.invoke(input_example) == "Hello"

# set this environment variable to avoid input conversion
os.environ["MLFLOW_CONVERT_MESSAGES_DICT_FOR_LANGCHAIN"] = "false"
with mlflow.start_run():
    model_info = mlflow.langchain.log_model(
        model, name="model", input_example=input_example
    )

pyfunc_model = mlflow.pyfunc.load_model(model_info.model_uri)
assert pyfunc_model.predict(input_example) == ["Hello"]
```
```

--------------------------------------------------------------------------------

````
