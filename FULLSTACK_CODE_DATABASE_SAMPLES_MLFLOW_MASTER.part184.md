---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 184
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 184 of 991)

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

---[FILE: chain_autolog.py]---
Location: mlflow-master/examples/langchain/chain_autolog.py

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

assert "OPENAI_API_KEY" in os.environ, "Please set the OPENAI_API_KEY environment variable."

# Enable mlflow langchain autologging
# Note: We only support auto-logging models that do not contain retrievers
mlflow.langchain.autolog(
    log_input_examples=True,
    log_model_signatures=True,
    log_models=True,
    registered_model_name="lc_model",
)

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

--------------------------------------------------------------------------------

---[FILE: chain_stream_output.py]---
Location: mlflow-master/examples/langchain/chain_stream_output.py

```python
import os

from langchain.llms import OpenAI
from langchain_core.output_parsers import StrOutputParser

import mlflow

# Ensure the OpenAI API key is set in the environment
assert "OPENAI_API_KEY" in os.environ, "Please set the OPENAI_API_KEY environment variable."

# Initialize the OpenAI model and the prompt template
llm = OpenAI()

# Create the LLMChain with the specified model and prompt
chain = llm | StrOutputParser()

with mlflow.start_run() as run:
    model_info = mlflow.langchain.log_model(chain, name="model")

loaded_model = mlflow.pyfunc.load_model(model_info.model_uri)

for chunk in loaded_model.predict_stream("Count to 10. E.g., 1, 2, 3, ..."):
    print(chunk, end="|")
```

--------------------------------------------------------------------------------

---[FILE: retrieval_qa_chain.py]---
Location: mlflow-master/examples/langchain/retrieval_qa_chain.py

```python
import os
import tempfile

from langchain.chains import RetrievalQA
from langchain.document_loaders import TextLoader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.llms import OpenAI
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import FAISS

import mlflow

assert "OPENAI_API_KEY" in os.environ, "Please set the OPENAI_API_KEY environment variable."

with tempfile.TemporaryDirectory() as temp_dir:
    persist_dir = os.path.join(temp_dir, "faiss_index")

    # Create the vector db, persist the db to a local fs folder
    loader = TextLoader("tests/langchain/state_of_the_union.txt")
    documents = loader.load()
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    docs = text_splitter.split_documents(documents)
    embeddings = OpenAIEmbeddings()
    db = FAISS.from_documents(docs, embeddings)
    db.save_local(persist_dir)

    # Create the RetrievalQA chain
    retrievalQA = RetrievalQA.from_llm(llm=OpenAI(), retriever=db.as_retriever())

    # Log the retrievalQA chain
    def load_retriever(persist_directory):
        embeddings = OpenAIEmbeddings()
        vectorstore = FAISS.load_local(persist_directory, embeddings)
        return vectorstore.as_retriever()

    with mlflow.start_run() as run:
        logged_model = mlflow.langchain.log_model(
            retrievalQA,
            name="retrieval_qa",
            loader_fn=load_retriever,
            persist_dir=persist_dir,
        )

# Load the retrievalQA chain
loaded_model = mlflow.pyfunc.load_model(logged_model.model_uri)
print(loaded_model.predict([{"query": "What did the president say about Ketanji Brown Jackson"}]))
```

--------------------------------------------------------------------------------

---[FILE: retrieval_qa_chain_azure_openai.py]---
Location: mlflow-master/examples/langchain/retrieval_qa_chain_azure_openai.py

```python
import os
import tempfile

from langchain.chains import RetrievalQA
from langchain.document_loaders import TextLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain_openai import AzureOpenAI, AzureOpenAIEmbeddings

import mlflow

# Set this to `azure`
os.environ["OPENAI_API_TYPE"] = "azure"
# The API version you want to use: set this to `2023-05-15` for the released version.
os.environ["OPENAI_API_VERSION"] = "2023-05-15"
assert "AZURE_OPENAI_ENDPOINT" in os.environ, (
    "Please set the AZURE_OPENAI_ENDPOINT environment variable. It is the base URL for your Azure OpenAI resource. You can find this in the Azure portal under your Azure OpenAI resource."
)
assert "OPENAI_API_KEY" in os.environ, (
    "Please set the OPENAI_API_KEY environment variable. It is the API key for your Azure OpenAI resource. You can find this in the Azure portal under your Azure OpenAI resource."
)


with tempfile.TemporaryDirectory() as temp_dir:
    persist_dir = os.path.join(temp_dir, "faiss_index")

    # Create the vector db, persist the db to a local fs folder
    loader = TextLoader("tests/langchain/state_of_the_union.txt")
    documents = loader.load()
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    docs = text_splitter.split_documents(documents)
    embeddings = AzureOpenAIEmbeddings(
        azure_deployment="<your-deployment-name>",
    )
    db = FAISS.from_documents(docs, embeddings)
    db.save_local(persist_dir)

    llm = AzureOpenAI(
        deployment_name="<your-deployment-name>",
        model_name="gpt-4o-mini",
    )
    # Create the RetrievalQA chain
    retrievalQA = RetrievalQA.from_llm(llm=llm, retriever=db.as_retriever())

    # Log the retrievalQA chain
    def load_retriever(persist_directory):
        embeddings = AzureOpenAIEmbeddings(
            azure_deployment="<your-deployment-name>",
        )
        vectorstore = FAISS.load_local(persist_directory, embeddings)
        return vectorstore.as_retriever()

    with mlflow.start_run() as run:
        logged_model = mlflow.langchain.log_model(
            retrievalQA,
            name="retrieval_qa",
            loader_fn=load_retriever,
            persist_dir=persist_dir,
        )

# Load the retrievalQA chain
loaded_model = mlflow.pyfunc.load_model(logged_model.model_uri)
print(loaded_model.predict([{"query": "What did the president say about Ketanji Brown Jackson"}]))
```

--------------------------------------------------------------------------------

---[FILE: retriever_chain.py]---
Location: mlflow-master/examples/langchain/retriever_chain.py

```python
import os
import tempfile

from langchain.document_loaders import TextLoader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import FAISS

import mlflow

assert "OPENAI_API_KEY" in os.environ, "Please set the OPENAI_API_KEY environment variable."

with tempfile.TemporaryDirectory() as temp_dir:
    persist_dir = os.path.join(temp_dir, "faiss_index")

    # Create the vector database and persist it to a local filesystem folder
    loader = TextLoader("tests/langchain/state_of_the_union.txt")
    documents = loader.load()
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    docs = text_splitter.split_documents(documents)
    embeddings = OpenAIEmbeddings()
    db = FAISS.from_documents(docs, embeddings)
    db.save_local(persist_dir)

    # Define a loader function to recall the retriever from the persisted vectorstore
    def load_retriever(persist_directory):
        embeddings = OpenAIEmbeddings()
        vectorstore = FAISS.load_local(persist_directory, embeddings)
        return vectorstore.as_retriever()

    # Log the retriever with the loader function
    with mlflow.start_run() as run:
        logged_model = mlflow.langchain.log_model(
            db.as_retriever(),
            name="retriever",
            loader_fn=load_retriever,
            persist_dir=persist_dir,
        )

# Load the retriever chain
loaded_model = mlflow.pyfunc.load_model(logged_model.model_uri)
print(loaded_model.predict([{"query": "What did the president say about Ketanji Brown Jackson"}]))
```

--------------------------------------------------------------------------------

---[FILE: simple_agent.py]---
Location: mlflow-master/examples/langchain/simple_agent.py

```python
import os

from langchain.agents import AgentType, initialize_agent, load_tools
from langchain.llms import OpenAI

import mlflow

# Note: Ensure that the package 'google-search-results' is installed via pypi to run this example
# and that you have a accounts with SerpAPI and OpenAI to use their APIs.

# Ensuring necessary API keys are set
assert "OPENAI_API_KEY" in os.environ, "Please set the OPENAI_API_KEY environment variable."
assert "SERPAPI_API_KEY" in os.environ, "Please set the SERPAPI_API_KEY environment variable."

# Load the language model for agent control
llm = OpenAI(temperature=0)

# Next, let's load some tools to use. Note that the `llm-math` tool uses an LLM, so we need to pass that in.
tools = load_tools(["serpapi", "llm-math"], llm=llm)

# Finally, let's initialize an agent with the tools, the language model, and the type of agent we want to use.
agent = initialize_agent(tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True)

# Log the agent in an MLflow run
with mlflow.start_run():
    logged_model = mlflow.langchain.log_model(agent, name="langchain_model")

# Load the logged agent model for prediction
loaded_model = mlflow.pyfunc.load_model(logged_model.model_uri)

# Generate an inference result using the loaded model
question = "What was the high temperature in SF yesterday in Fahrenheit? What is that number raised to the .023 power?"

answer = loaded_model.predict([{"input": question}])

print(answer)
```

--------------------------------------------------------------------------------

---[FILE: simple_chain.py]---
Location: mlflow-master/examples/langchain/simple_chain.py

```python
import os

from langchain.chains import LLMChain
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate

import mlflow

# Ensure the OpenAI API key is set in the environment
assert "OPENAI_API_KEY" in os.environ, "Please set the OPENAI_API_KEY environment variable."

# Initialize the OpenAI model and the prompt template
llm = OpenAI(temperature=0.9)
prompt = PromptTemplate(
    input_variables=["product"],
    template="What is a good name for a company that makes {product}?",
)

# Create the LLMChain with the specified model and prompt
chain = LLMChain(llm=llm, prompt=prompt)

# Log the LangChain LLMChain in an MLflow run
with mlflow.start_run():
    logged_model = mlflow.langchain.log_model(chain, name="langchain_model")

# Load the logged model using MLflow's Python function flavor
loaded_model = mlflow.pyfunc.load_model(logged_model.model_uri)

# Predict using the loaded model
print(loaded_model.predict([{"product": "colorful socks"}]))
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/lightgbm/README.md

```text
# Examples for LightGBM Autologging

LightGBM autologging functionalities are demonstrated through two examples. The first example in the `lightgbm_native` folder logs a Booster model trained by `lightgbm.train()`. The second example in the `lightgbm_sklearn` folder shows how autologging works for LightGBM scikit-learn models. The autologging for all LightGBM models is enabled via `mlflow.lightgbm.autolog()`.
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/examples/lightgbm/lightgbm_native/MLproject

```text
name: lightgbm-example
python_env: python_env.yaml
entry_points:
  main:
    parameters:
      learning_rate: {type: float, default: 0.1}
      colsample_bytree: {type: float, default: 1.0}
      subsample: {type: float, default: 1.0}
    command: |
        python train.py \
          --learning-rate={learning_rate} \
          --colsample-bytree={colsample_bytree} \
          --subsample={subsample}
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/examples/lightgbm/lightgbm_native/python_env.yaml

```yaml
build_dependencies:
  - pip
dependencies:
  - mlflow>=1.6.0
  - matplotlib
  - lightgbm
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/lightgbm/lightgbm_native/README.md

```text
# LightGBM Example

This example trains a LightGBM classifier with the iris dataset and logs hyperparameters, metrics, and trained model.

## Running the code

```
python train.py --colsample-bytree 0.8 --subsample 0.9
```

You can try experimenting with different parameter values like:

```
python train.py --learning-rate 0.4 --colsample-bytree 0.7 --subsample 0.8
```

Then you can open the MLflow UI to track the experiments and compare your runs via:

```
mlflow server
```

## Running the code as a project

```
mlflow run . -P learning_rate=0.2 -P colsample_bytree=0.8 -P subsample=0.9
```
```

--------------------------------------------------------------------------------

---[FILE: train.py]---
Location: mlflow-master/examples/lightgbm/lightgbm_native/train.py

```python
import argparse

import lightgbm as lgb
import matplotlib as mpl
from sklearn import datasets
from sklearn.metrics import accuracy_score, log_loss
from sklearn.model_selection import train_test_split

import mlflow
import mlflow.lightgbm

mpl.use("Agg")


def parse_args():
    parser = argparse.ArgumentParser(description="LightGBM example")
    parser.add_argument(
        "--learning-rate",
        type=float,
        default=0.1,
        help="learning rate to update step size at each boosting step (default: 0.3)",
    )
    parser.add_argument(
        "--colsample-bytree",
        type=float,
        default=1.0,
        help="subsample ratio of columns when constructing each tree (default: 1.0)",
    )
    parser.add_argument(
        "--subsample",
        type=float,
        default=1.0,
        help="subsample ratio of the training instances (default: 1.0)",
    )
    return parser.parse_args()


def main():
    # parse command-line arguments
    args = parse_args()

    # prepare train and test data
    iris = datasets.load_iris()
    X = iris.data
    y = iris.target
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # enable auto logging
    mlflow.lightgbm.autolog()

    train_set = lgb.Dataset(X_train, label=y_train)

    with mlflow.start_run():
        # train model
        params = {
            "objective": "multiclass",
            "num_class": 3,
            "learning_rate": args.learning_rate,
            "metric": "multi_logloss",
            "colsample_bytree": args.colsample_bytree,
            "subsample": args.subsample,
            "seed": 42,
        }
        model = lgb.train(
            params, train_set, num_boost_round=10, valid_sets=[train_set], valid_names=["train"]
        )

        # evaluate model
        y_proba = model.predict(X_test)
        y_pred = y_proba.argmax(axis=1)
        loss = log_loss(y_test, y_proba)
        acc = accuracy_score(y_test, y_pred)

        # log metrics
        mlflow.log_metrics({"log_loss": loss, "accuracy": acc})


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/examples/lightgbm/lightgbm_sklearn/MLproject

```text
name: lightgbm-sklearn-example
python_env: python_env.yaml
entry_points:
    main:
        command: python train.py
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/examples/lightgbm/lightgbm_sklearn/python_env.yaml

```yaml
build_dependencies:
  - pip
dependencies:
  - mlflow>=1.6.0
  - matplotlib
  - lightgbm
  - cloudpickle>=2.0.0
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/lightgbm/lightgbm_sklearn/README.md

```text
# XGBoost Scikit-learn Model Example

This example trains an [`LightGBM.LGBMClassifier`](https://lightgbm.readthedocs.io/en/latest/pythonapi/lightgbm.LGBMClassifier.html) with the diabetes dataset and logs hyperparameters, metrics, and trained model.

Like the other LightGBM example, we enable autologging for LightGBM scikit-learn models via `mlflow.lightgbm.autolog()`. Saving / loading models also supports LightGBM scikit-learn models.

You can run this example using the following command:

```shell
python train.py
```
```

--------------------------------------------------------------------------------

---[FILE: train.py]---
Location: mlflow-master/examples/lightgbm/lightgbm_sklearn/train.py

```python
from pprint import pprint

import lightgbm as lgb
from sklearn.datasets import load_iris
from sklearn.metrics import f1_score
from sklearn.model_selection import train_test_split
from utils import fetch_logged_data

import mlflow
import mlflow.lightgbm


def main():
    # prepare example dataset
    X, y = load_iris(return_X_y=True, as_frame=True)
    X_train, X_test, y_train, y_test = train_test_split(X, y)

    # enable auto logging
    # this includes lightgbm.sklearn estimators
    mlflow.lightgbm.autolog()

    regressor = lgb.LGBMClassifier(n_estimators=20, reg_lambda=1.0)
    regressor.fit(X_train, y_train, eval_set=[(X_test, y_test)])
    y_pred = regressor.predict(X_test)
    f1_score(y_test, y_pred, average="micro")
    run_id = mlflow.last_active_run().info.run_id
    print(f"Logged data and model in run {run_id}")

    # show logged data
    for key, data in fetch_logged_data(run_id).items():
        print(f"\n---------- logged {key} ----------")
        pprint(data)


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: mlflow-master/examples/lightgbm/lightgbm_sklearn/utils.py

```python
from mlflow.tracking import MlflowClient


def yield_artifacts(run_id, path=None):
    """Yield all artifacts in the specified run"""
    client = MlflowClient()
    for item in client.list_artifacts(run_id, path):
        if item.is_dir:
            yield from yield_artifacts(run_id, item.path)
        else:
            yield item.path


def fetch_logged_data(run_id):
    """Fetch params, metrics, tags, and artifacts in the specified run"""
    client = MlflowClient()
    data = client.get_run(run_id).data
    # Exclude system tags: https://www.mlflow.org/docs/latest/tracking.html#system-tags
    tags = {k: v for k, v in data.tags.items() if not k.startswith("mlflow.")}
    artifacts = list(yield_artifacts(run_id))
    return {
        "params": data.params,
        "metrics": data.metrics,
        "tags": tags,
        "artifacts": artifacts,
    }
```

--------------------------------------------------------------------------------

---[FILE: autolog.py]---
Location: mlflow-master/examples/llama_index/autolog.py

```python
"""
This is an example for leveraging MLflow's autologging capabilities for LlamaIndex.

For more information about MLflow LlamaIndex integration, see:
https://mlflow.org/docs/latest/llms/llama-index/index.html
"""

import os

from llama_index.agent.openai import OpenAIAgent
from llama_index.core import Document, Settings, VectorStoreIndex
from llama_index.core.tools import FunctionTool
from llama_index.llms.openai import OpenAI

import mlflow

assert "OPENAI_API_KEY" in os.environ, "Please set the OPENAI_API_KEY environment variable"

experiment_id = mlflow.set_experiment("llama_index").experiment_id

# Configure LLM
Settings.llm = OpenAI(model="gpt-4o", temperature=0)

# Create a sample LlamaIndex index
documents = [Document.example() for _ in range(10)]
index = VectorStoreIndex.from_documents(documents)

# Turn on autologging
mlflow.llama_index.autolog()

# Query the index
query_engine = index.as_query_engine()
response = query_engine.query("What is the capital of France?")
print("\033\n[94m-------")
print("Running Query Engine:\n")
print(" User > What is the capital of France?")
print(f"  🔍  > {response}")

# Interact with the index as a chat engine with streaming API
chat_engine = index.as_chat_engine()
response1 = chat_engine.stream_chat("Hi")
response2 = chat_engine.stream_chat("How are you?")

print("\033\n[94m-------")
print("Running Chat engine:\n")
print(" User > Hi")
print("  🤖  > ", end="")
response1.print_response_stream()
print("\n User > How are you?")
print("  🤖  > ", end="")
response2.print_response_stream()
print("\033[0m")


# Create OpenAI agent
def multiply(a: int, b: int) -> int:
    """Multiple two integers and returns the result integer"""
    return a * b


def add(a: int, b: int) -> int:
    """Add two integers and returns the result integer"""
    return a + b


add_tool = FunctionTool.from_defaults(fn=add)
multiply_tool = FunctionTool.from_defaults(fn=multiply)
agent = OpenAIAgent.from_tools([multiply_tool, add_tool])
response = agent.chat("What is 2 times 3?")
print("\033\n[94m-------")
print("Running Agent:\n")
print(" User > What is 2 times 3?")
print(f"  🦙  > {response}")
print("\n-------\n\n\033[0m")

print(
    "\033[92m🚀 Now run `mlflow server --port 5000` open MLflow UI to see the trace visualization!"
)
print(f"   - Experiment URL: http://127.0.0.1:5000/#/experiments/{experiment_id}\033[0m")
```

--------------------------------------------------------------------------------

---[FILE: simple_index.py]---
Location: mlflow-master/examples/llama_index/simple_index.py

```python
"""
This is an example for logging a LlamaIndex index to MLflow and loading it back for querying
via specific engine types - query engine, chat engine, and retriever.

For more information about MLflow LlamaIndex integration, see:
https://mlflow.org/docs/latest/llms/llama-index/index.html
"""

import os

from llama_index.core import Document, Settings, VectorStoreIndex
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAI

import mlflow

assert "OPENAI_API_KEY" in os.environ, "Please set the OPENAI_API_KEY environment variable"

# Configure LLM and Embedding models
Settings.llm = OpenAI(model="gpt-4o", temperature=0)
Settings.embeddings = OpenAIEmbedding(model="text-embedding-3-large")

# Get sample documents. In practice, you would load documents from various sources, such as local files.
# https://docs.llamaindex.ai/en/stable/module_guides/loading/documents_and_nodes/usage_documents/
documents = [Document.example() for _ in range(10)]

# Create a LlamaIndex index.
index = VectorStoreIndex.from_documents(documents)

# Log the index to MLflow.
mlflow.set_experiment("llama_index")

with mlflow.start_run() as run:
    model_info = mlflow.llama_index.log_model(
        llama_index_model=index,
        name="chat_index",
        # Log the index with chat engine type. This lets you load the index back as a chat engine
        # using `mlflow.pyfunc.load_model()`` API for querying and deploying.
        engine_type="chat",
        # Passing an input example is optional but highly recommended. This allows MLflow to
        # infer the schema of the input and output data.
        input_example="Hi",
    )
    experiment_id = run.info.experiment_id
    run_id = run.info.run_id
print(f"\033[94mIndex is logged to MLflow Run {run_id}\033[0m")

# Load the index back as a chat engine
chat_model = mlflow.pyfunc.load_model(model_info.model_uri)
response1 = chat_model.predict("Hi")
response2 = chat_model.predict("How are you?")

print("\033[94m-------")
print("Loaded the model back as a chat engine:\n")
print(" User > Hi")
print(f"  🤖  > {response1}")
print(" User > How are you?")
print(f"  🤖  > {response2}")
print("\033[0m")

# You can also load the raw index object back using the `mlflow.llama_index.load_model()` API,
# which allows you to create a different engine on top of the index.
loaded_index = mlflow.llama_index.load_model(model_info.model_uri)
query_engine = loaded_index.as_query_engine()
response = query_engine.query("What is the capital of France?")

print("\033[94m-------")
print("Loaded the model back as a query engine:\n")
print(" User > What is the capital of France?")
print(f"  🔍  > {response}")
print("-------\n\033[0m")

print(
    "\033[92m"
    "🚀 Now run `mlflow server --port 5000` and open MLflow UI to see the logged information, such as "
    "serialized index, global Settings, model signature, dependencies, and more."
)
print(f" - Run URL: http://127.0.0.1:5000/#/experiments/{experiment_id}/runs/{run_id}")
print("\033[0m")
```

--------------------------------------------------------------------------------

---[FILE: install.sh]---
Location: mlflow-master/examples/llama_index/workflow/install.sh

```bash
#!/bin/bash

# Define color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No color

# Ensure that poetry is in PATH
export PATH="$HOME/.local/bin:$PATH"

# Install poetry if it's not installed
if ! command -v poetry &> /dev/null
then
    echo -e "${YELLOW}Poetry not found, installing...${NC}"
    curl -sSL https://install.python-poetry.org | python3 -
    export PATH="$HOME/.local/bin:$PATH"
else
    echo -e "${GREEN}Poetry is already installed.${NC}"
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null
then
    echo -e "${RED}Docker not found.${NC} ${CYAN}Please install Docker to use Qdrant, or use the '--no-qdrant' flag if you don't need Qdrant.${NC}"
else
    echo -e "${GREEN}Docker is already installed.${NC}"
fi

# Check for --no-qdrant flag
if [[ "$*" == *"--no-qdrant"* ]]; then
    echo -e "${CYAN}Skipping Docker check because --no-qdrant flag was used.${NC}"
fi

# Install Jupyter Notebook
echo -e "${CYAN}Installing Jupyter Notebook...${NC}"
poetry run pip install jupyter

# Install dependencies from pyproject.toml
echo -e "${CYAN}Installing dependencies from pyproject.toml...${NC}"
poetry install

echo -e "${GREEN}All dependencies installed successfully.${NC}"
```

--------------------------------------------------------------------------------

---[FILE: pyproject.toml]---
Location: mlflow-master/examples/llama_index/workflow/pyproject.toml

```toml
[tool.poetry]
package-mode = false

[tool.poetry.dependencies]
python = ">=3.10,<3.13"
mlflow = ">=2.17.0"
llama-index = ">=0.11.0"
llama-index-postprocessor-rankgpt-rerank = "*"
llama-index-readers-web = "*"
llama-index-retrievers-bm25 = "*"
llama-index-tools-tavily-research = "*"
llama-index-utils-workflow = "*"
llama-index-vector-stores-qdrant = "*"

[build-system]
requires = ["poetry-core>=1.0.0"]
build-backend = "poetry.core.masonry.api"
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/llama_index/workflow/README.md

```text
# MLflow LlamaIndex Workflow Example

This example demonstrates how to build and optimize a Retrieval-Augmented Generation (RAG) workflow using [LlamaIndex](https://www.llamaindex.ai/) integrated with [MLflow](https://mlflow.org/docs/latest/llms/llama-index/index.html). The example covers various retrieval strategies such as vector search, BM25, and web search, along with logging, model tracking, and performance evaluation in MLflow.

![Hybrid RAG Concept](static/images/llama_index_workflow_hybrid_rag_concept.png)

![Evaluation Result](static/images/llama_index_workflow_result_chart.png)

## Set Up

This repository contains a complete workflow definition, a hands-on notebook, and a sample dataset for running experiments. To clone it to your working environment, use the following command:

```shell
git clone https://github.com/mlflow/mlflow.git
```

After cloning the repository, set up the virtual environment by running:

```
cd mlflow/examples/llama_index/workflow
chmod +x install.sh
./install.sh
```

Once the installation is complete, start Jupyter Notebook within the Poetry environment using:

```
poetry run jupyter notebook
```
```

--------------------------------------------------------------------------------

````
