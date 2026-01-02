---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 186
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 186 of 991)

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

---[FILE: mlflow_qa_dataset.csv]---
Location: mlflow-master/examples/llama_index/workflow/data/mlflow_qa_dataset.csv

```text
query,ground_truth
How to use Amazon S3 for tracking model artifacts with MLflow?,"MLflow by default stores artifacts in the local `./mlruns` directory but also supports remote storage options like Amazon S3. To store artifacts in S3, you can start MLflow Tracking Server with `--artifacts-destination` argument with `serve-artifacts` option enabled.
```
mlflow.server --artifacts-destination s3://bucket --serve-artifacts
```
Also, please do not forget setting up the necessary credentials in the following environment varaibles.
```
export AWS_ACCESS_KEY_ID=""""
export AWS_SECRET_ACCESS_KEY=""""
```"
Logging large LLM with Transformers flavor takes long. How to save large model efficiently?,"To save storage space when logging a Transformers model with MLflow, you can use the 'reference-only' save mode introduced in MLflow 2.11.0. Set `save_pretrained=False` when logging or saving the model, which tells MLflow to save a reference to the HuggingFace Hub repository and version instead of a full copy of the model weights. This method is more storage-efficient and faster."
What is MLflow Run? How is it different from model?,"An MLflow run is an execution of a piece of data science code that records metadata (like metrics and parameters) and artifacts (like model weights). For example, when you train a model, the training execution is Run, and the output model weight, metrics, are artifacts."
How to use MLflow to manage my model versions?,"To manage your model versions in MLflow, you can use MLflow Model Registry feature. Model Registry allows you to register your MLflow model with specific name, version, and attach human readable aliases. The registered model can be loaded with the URI or alias."
I want to register my model to Unity Catalog.,"The MLflow Model Registry is integrated with Databricks Unity Catalog. You can set registry URI to point to Unity Catalog by: 
```
import mlflow
mlflow.set_registry_uri(""databricks-uc"")
```
Then you can register your MLflow Model using MLflow API. Replace the URI and model name with your confiruations.
```
mlflow.register_model(model_uri, ""catalog.schema.model_name"")
```
Alternatively, you can specify the registered model name when logging the model, so MLflow automatically do registeration when logging.
```
mlflow.sklearn.log_model(model, ""model"", registered_model_name=""catalog.schema.model_name"")
```"
How to specify the SQLite DB file stored in the parent directory as tracking URI?,"To set MLflow to use a local SQLite database, you need to set the path `sqlite:///mlruns.db` to  the environment variable `MLFLOW_TRACKING_URI` or call `mlflow.set_tracking_uri()` function. The relative location can be specified like `sqlite:///../mlruns.db` or by an absolute path like `sqlite:////User/me/mlflow.runs.db`."
What Deep Learning libraries are supported in MLflow?,"MLflow has native integrations with deep learning libraries such as PyTorch, Keras, and TensorFlow, SpaCy, Fast AI, and Transformers."
Is MLflow tracking API async?,"Some MLflow Tracking APIs support asynchronous operations, such as log_metric. To use async logging, pass `synchronous=False` to the logging APIs. Data logged with async logging will be batched and queued, then sent to the tracking server by background threads."
What is the benefit of using MLflow with OpenAI?,"MLflow 
1. Prompt management - MLflow tracking support saving your prompt as a part of MLflow model.
2. Autologging - MLflow provides autologging feature for OpenAI, allowing you to keep track of the request and responses, as well as model parameters.
3. Dependency management - MLflow records the OpenAI package and dependency libraries as a part of MLflow model, reducing the risk of breaking change. "
What are stored within MLflow model?,"In MLflow, a model is a comprehensive package that includes the following data:
1. Model weight, or serialized object for some flavor e.g. LangChain)
2. Additional model configurations required for inference, such as prompt template.
3. Versions of dependency libraries.
4. Environment information e.g. Python version

The model object can be also represented by source code or notebook, since model-from-code feature was introduced in MLflow 2.14.0"
Does MLflow model support streaming inference?,"Since MLflow 2.12.2, MLflow support streaming inference for Python Models and LangChain flavor. To get stream response, your Python model needs to implement a new `predict_stream` method. For example:
```
def predict_stream(data: Any, params: Optional[Dict[str, Any]] = None) → GeneratorType
        # Yielding elements one at a time
        for element in [""a"", ""b"", ""c"", ""d"", ""e""]:
            yield element
```
For LangChain model, streaming response is only available if the underlying LangChain component implements streaming APIs.
"
What is model signature? Is it mandatory to save a model with a signature?,"A model signature defines the schema for model inputs, outputs, and parameters, ensuring data consistency and type validation between training and deployment. A model signature is not required for saving models. However, it is required to register a model to Databricks Unity Catalog."
How MLflow decides model dependencies to be logged?,"MLflow automatically infers and records the required dependencies for a model by loading and making prediction and inspect libraries used during the process. Each libraries are pinned to the version installed in the development environment. The prediction is only made when an input example is provided to mlflow.log_model() or mlflow.save_model() call, otherwise MLflow only loads the model and capture libraries for that, therefore, it is recommended to specify an input example to increase the coverage of captured libraries. If either model loading or prediction fails, MLflow will fallback to the static list of dependencies defined for each flavor.
"
"What is ""flavor"" in MLflow?","In the MLflow ecosystem, flavors are designated wrappers for specific machine learning libraries, such as scikit-learn, pytorch, langchain, and abstracting the process of saving, loading, and handling models across different frameworks. They enable deployment tools to work with models from any ML library without specific integrations. Each flavor defines the behavior of the model for inference deployment, ensuring consistency."
Is MLflow integrated with Pytorch?,"Yes, MLflow provides built-in support for PyTorch, offering APIs for simplified experiment tracking, model management, and effortless deployment."
is MLflow integrated with DSPy?,"No, MLflow is not natively integrated with DSPy. You can track DSPy models using Custom Python Model feature, instead."
How to start MLflow Deployment Server to proxy OpenAI and Claude APIs?,"To set up the MLflow Deployments Server, first install it with the command `pip install 'mlflow[genai]'`, and set your OpenAI and Anthropic API key as a n environment variable in your console. Then define a configuration YAML file for each endpoint like below:
```config.yaml
endpoints:
    - name: openai-chat
      endpoint_type: llm/v1/chat
      model: 
        provider: openai
        name: gpt-4o
        config:
            openai_api_key: $OPENAI_API_KEY
   - name: anthropic-chat
      endpoint_type: llm/v1/chat
      model:
        provider: anthropic
        name: claude-2.0
        config:
            anthropic_api_key: $ANTHROPIC_API_KEY
```
Once configured, you can start MLflow Deployment Server using the following command:
```
mlflow gateway start --config-path config.yaml --port {port} --host {host} --workers {worker count}
```
The endpoints can be queried via either REST API or MLflow Client API. You can also access the auto-generated API documentation at http://{host}:{port}/docs."
How to set up authentication for MLflow Deployment Server to access Amazon Bedrock models?,"There are two different authentication methods to configure MLflow Deployment Server endpoints with Amazon Bedrock models:
1. Key-based authentication: You can directory specify the aws_access_key_id and aws_secret_access_key to the `aws_config` parameter.
```
aws_config:
    aws_access_key_id: xxx
    aws_secret_access_key: yyy
    aws_session_token: zzz (optional) 
```
2. Role-based authentication [recommended]: By specifying AWS role, MLflow Deployment Server will attempt to assume the role with using the standard credential provider chain and will review the role credentials if they have expired. 
```
aws_config:
    aws_role_arn: xxx
    session_length_seconds: 900 (optional)
```"
What parameters are supported by the chat endpoint in MLflow Deployment Server?,"For chat endpoints (endpoint_type being llm/v1/chat), MLflow defines the following standard paramters:
- messages (required): A list of messages in a conversation. Each message should contain `role` and `content` as keys.
 - n: The integer number of chat completions to generate.
- temperature: The sampling temperature to use, between 0 to 1. Higher value will make the output more random.
- max_tokens: The maximum completion length, between 1 and infinity (unlimited)
- stop: Sequence(s) where the model should stop generating tokens.
In addition to these standard parameters, you can also pass additional parameters supported by the model providers. Please refer to the corresponding provider section in the MLflow Deployment Server documentation for more details."
How MLflow records model evaluation results? Where I can see and compare those results?,"The result of model evaluation will be recorded to the MLflow Run which was active when the `mlflow.evaluate()` function is called. You can check the evaluation result either from the `EvaluationResult` object returned from the function, or by navigating to the MLflow UI.

1. EvaluateionResult object contains the evaluation results either as a dictionary of metrics (accessible via `metrics` attribute), or a table format (`tables` attribute with ""eval_results_table"" key).
```
with mlflow.start_run() as run:
    results = mlflow.evaluate(...)
print(results.metrics)
results.table[""eval_results_table""]
```
2. Alternatively, navigate to the MLflow UI and your experiment. Select the list of evaluation runs and select ""Chart"" tab. It will display the graphs for evaluation metrics. In order to assess the result for each sample data, open ""Evaluation"" tab with the same runs selected."
How to define custom LLM-as-a-judge metrics for evaluating my RAG models?,"To define custom LLM-as-a-judge metrics, use `mlflow.metrics.genai.make_genai_metric()` function. You can pass the prompt and LLM model to score the output, as well as additional reference input (e.g. documentation), parameters, aggregation configurations."
What kind of evaluator models we can use for LLM-as-a-judge metrics in MLflow?,The `mlflow.metrics.genai.make_genai_metric` accepts either of two types of models as a judge (1) OpenAI model specified with an URI with `openai` schema e.g. `openai:/gpt-3.5-turbo` (2) MLflow Deployments Server endpoint e.g. `endopints:/my-chat-endpoint`.
What kind models can I evaluate with MLflow Evaluation?,"MLflow supports evaluating various types of models as follows:
1. MLflow models (with Python Model interface). Either an model instance itself or an URI pointing to the logged or registered model can be used.
2. A Python function that takes in string inputs and outputs a single string The callable interface must match the signature of mlflow.pyfunc.PythonModel.predict(). Briefly it should has `data` as the only argument, which can be one of pandas DataFrame, numpy array, python list, dictionary, or scipy matrix, and returns one of a list, pandas DataFrame, Series, or numpy Array.
3. An MLflow Deployments endpoint URI pointing to a local MLflow Deployment Server, Databricks Foundation Model APIs, or External Models in Databricks Model Serving.

Additionally, you can also pass the prediction output data instead of model instance."
How to organize hundreds of Runs from my hyperparameter turning experiment?,"To organize many Runs from hyperparameter turning, you can use the Parent and Child Runs feature in MLflow. Conceptually, it is a hierarchy of runs where you can create many chid runs under a parent to organize them as a single bundle. Child runs can be created by setting `nested=True`, as shown in the example below:
```
with mlflow.start_run() as parent_run:
    with mlflow.start_run(nested=True) as child_run:
       ...
```"
How can I start MLflow Model Registry locally?,"In order to use the MLflow Model Registry capability, you must start a MLflow Tracking Server with the databset-backend mode. To do so, specify tracking URI points to your local database like this:
```
mlflow server --backend-store-uri sqlite:///mlruns.db
```"
How to set an alias to the model in MLflow Model Registry?,"You can use either MLflow UI or programmatically with MLflow Client APIs. 
1. UI - Navigate to the registered model, click the ""Add"" link next to the Aliases text. Enter the alias in the text box and submit.
2. MLflow Client - Use `set_registered_model_alias()` API of MLflow client, specifying the model name and version."
Does MLflow support authentication for accessing models?,"MLflow supports basic HTTP authentication for access control over experiments and registered models. Permissions can be granted on individual resources (e.g. run, experiment, model) for each user, with four different access levels (1) NO_PERMISSIONS (2) READ (3) EDIT (4) MANAGE.  MLflow also allows for custom authentication, including third-party plugins or custom plugins for more advanced authentication logic."
Does MLflow support authentication method that is more advanced then username and password?,"No, MLflow does not natively support other authentication method than using username and password. However, you can utilize advanced authentication logic, such as token-based authentication, through third-party plugins or custom plugins."
How to search Runs based on tag?,"To search for runs by filtering on tags in MLflow, you can use the search box in the MLflow UI, or Python search API `mlflow.search_runs()`.  The search query  is similar to SQL with a few exceptions. To performa a search with tags, you can use the following query string like `tags.model = gpt-4`."
I got a syntax error when running a search with query `tags.my-tag = foo`. How to solve this problem?,"The search query syntax of MLflow is similar to SQL, therefore, fields include some special characters such as hyphen cannot be used as they are. To workaround this, you can wrap the tag name with backticks like `tags.`my-tag` = foo`.
"
```

--------------------------------------------------------------------------------

---[FILE: urls.txt]---
Location: mlflow-master/examples/llama_index/workflow/data/urls.txt

```text
https://mlflow.org/docs/latest/auth/index.html
https://mlflow.org/docs/latest/auth/python-api.html
https://mlflow.org/docs/latest/cli.html
https://mlflow.org/docs/latest/deep-learning/keras/quickstart/quickstart_keras.html
https://mlflow.org/docs/latest/deep-learning/pytorch/guide/index.html
https://mlflow.org/docs/latest/deep-learning/tensorflow/guide/index.html
https://mlflow.org/docs/latest/deployment/index.html
https://mlflow.org/docs/latest/getting-started/intro-quickstart/index.html
https://mlflow.org/docs/latest/index.html
https://mlflow.org/docs/latest/introduction/index.html
https://mlflow.org/docs/latest/llms/custom-pyfunc-for-llms/index.html
https://mlflow.org/docs/latest/llms/custom-pyfunc-for-llms/notebooks/custom-pyfunc-advanced-llm.html
https://mlflow.org/docs/latest/llms/custom-pyfunc-for-llms/notebooks/index.html
https://mlflow.org/docs/latest/llms/deployments/guides/index.html
https://mlflow.org/docs/latest/llms/deployments/guides/step1-create-deployments.html
https://mlflow.org/docs/latest/llms/deployments/guides/step2-query-deployments.html
https://mlflow.org/docs/latest/llms/deployments/index.html
https://mlflow.org/docs/latest/llms/deployments/uc_integration.html
https://mlflow.org/docs/latest/llms/index.html
https://mlflow.org/docs/latest/llms/langchain/autologging.html
https://mlflow.org/docs/latest/llms/langchain/guide/index.html
https://mlflow.org/docs/latest/llms/langchain/index.html
https://mlflow.org/docs/latest/llms/langchain/notebooks/langchain-quickstart.html
https://mlflow.org/docs/latest/llms/llama-index/index.html
https://mlflow.org/docs/latest/llms/llm-evaluate/index.html
https://mlflow.org/docs/latest/llms/openai/guide/index.html
https://mlflow.org/docs/latest/llms/openai/index.html
https://mlflow.org/docs/latest/llms/sentence-transformers/guide/index.html
https://mlflow.org/docs/latest/llms/sentence-transformers/index.html
https://mlflow.org/docs/latest/llms/tracing/index.html
https://mlflow.org/docs/latest/llms/tracing/overview.html
https://mlflow.org/docs/latest/llms/transformers/index.html
https://mlflow.org/docs/latest/model-evaluation/index.html
https://mlflow.org/docs/latest/model-registry.html
https://mlflow.org/docs/latest/model/dependencies.html
https://mlflow.org/docs/latest/model/notebooks/signature_examples.html
https://mlflow.org/docs/latest/model/signatures.html
https://mlflow.org/docs/latest/models.html
https://mlflow.org/docs/latest/python_api/index.html
https://mlflow.org/docs/latest/rest-api.html
https://mlflow.org/docs/latest/system-metrics/index.html
https://mlflow.org/docs/latest/tracking.html
https://mlflow.org/docs/latest/tracking/artifacts-stores.html
https://mlflow.org/docs/latest/tracking/autolog.html
https://mlflow.org/docs/latest/tracking/backend-stores.html
https://mlflow.org/docs/latest/tracking/data-api.html
https://mlflow.org/docs/latest/tracking/server.html
https://mlflow.org/docs/latest/tracking/tracking-api.html
https://mlflow.org/docs/latest/tracking/tutorials/local-database.html
https://mlflow.org/docs/latest/tracking/tutorials/remote-server.html
```

--------------------------------------------------------------------------------

---[FILE: events.py]---
Location: mlflow-master/examples/llama_index/workflow/workflow/events.py

```python
from typing import Literal

from llama_index.core.schema import NodeWithScore
from llama_index.core.workflow import Event


class VectorSearchRetrieveEvent(Event):
    """Event for triggering VectorStore index retrieval step."""

    query: str


class BM25RetrieveEvent(Event):
    """Event for triggering BM25 retrieval step."""

    query: str


class TransformQueryEvent(Event):
    """Event for transforming user query into a search query."""

    query: str


class WebsearchEvent(Event):
    """Event for triggering web search tool step."""

    search_query: str


class RetrievalResultEvent(Event):
    """Event to send retrieval result from each retriever to the gather step."""

    nodes: list[NodeWithScore]
    retriever: Literal["vector_search", "bm25", "web_search"]


class RerankEvent(Event):
    """Event to send retrieval result to reranking step."""

    nodes: list[NodeWithScore]


class QueryEvent(Event):
    """Event for triggering the final query step"""

    context: str
```

--------------------------------------------------------------------------------

---[FILE: model.py]---
Location: mlflow-master/examples/llama_index/workflow/workflow/model.py

```python
from workflow.workflow import HybridRAGWorkflow

import mlflow

# Get model config from ModelConfig singleton (specified via `model_config` parameter when logging the model)
model_config = mlflow.models.ModelConfig()
retrievers = model_config.get("retrievers")

# Create the workflow instance.
workflow = HybridRAGWorkflow(retrievers=retrievers, timeout=300)

# Set the model instance logging. This is mandatory for using model-from-code logging method.
# Refer to https://mlflow.org/docs/latest/models.html#models-from-code for more details.
mlflow.models.set_model(workflow)
```

--------------------------------------------------------------------------------

---[FILE: prompts.py]---
Location: mlflow-master/examples/llama_index/workflow/workflow/prompts.py

```python
# Prompt to transform user query to the web search query format
TRANSFORM_QUERY_TEMPLATE = """\
Your task is to refine a query to ensure it is highly effective for retrieving relevant search results.
Analyze the given input to grasp the core semantic intent or meaning.

Original Query:
-------------------
{query}

Your goal is to rephrase or enhance this query to improve its search performance. Ensure the revised query is concise and directly aligned with the intended search objective.
Respond with the optimized query only"""


# Prompt for the final LLM query
FINAL_QUERY_TEMPLATE = """\
Your task is to answer the user query as a professional and very helpful assistant. You must use the given context for answering the question and not prior knowledge. Context information is below.

Context:
-------------------
{context}

User Question:
--------------
{query}

Respond with the answer to the question only:"""
```

--------------------------------------------------------------------------------

---[FILE: workflow.py]---
Location: mlflow-master/examples/llama_index/workflow/workflow/workflow.py

```python
import os

import qdrant_client
from llama_index.core import Settings, VectorStoreIndex
from llama_index.core.schema import NodeWithScore
from llama_index.core.workflow import Context, StartEvent, StopEvent, Workflow, step
from llama_index.postprocessor.rankgpt_rerank import RankGPTRerank
from llama_index.retrievers.bm25 import BM25Retriever
from llama_index.tools.tavily_research.base import TavilyToolSpec
from llama_index.vector_stores.qdrant import QdrantVectorStore
from workflow.events import *
from workflow.prompts import *

_BM25_PERSIST_DIR = ".bm25_retriever"

_QDRANT_HOST = os.environ.get("QDRANT_HOST", "localhost")
_QDRANT_PORT = int(os.environ.get("QDRANT_PORT", 6333))
_QDRANT_COLLECTION_NAME = os.environ.get("QDRANT_COLLECTION_NAME", "mlflow_doc")


class HybridRAGWorkflow(Workflow):
    VALID_RETRIEVERS = {"vector_search", "bm25", "web_search"}

    def __init__(self, retrievers=None, **kwargs):
        super().__init__(**kwargs)
        self.llm = Settings.llm
        self.retrievers = retrievers or []

        if invalid_retrievers := set(self.retrievers) - self.VALID_RETRIEVERS:
            raise ValueError(f"Invalid retrievers specified: {invalid_retrievers}")

        self._use_vs_retriever = "vector_search" in self.retrievers
        self._use_bm25_retriever = "bm25" in self.retrievers
        self._use_web_search = "web_search" in self.retrievers

        if self._use_vs_retriever:
            qd_client = qdrant_client.QdrantClient(host=_QDRANT_HOST, port=_QDRANT_PORT)
            vector_store = QdrantVectorStore(
                client=qd_client, collection_name=_QDRANT_COLLECTION_NAME
            )
            index = VectorStoreIndex.from_vector_store(vector_store=vector_store)
            self.vs_retriever = index.as_retriever()

        if self._use_bm25_retriever:
            self.bm25_retriever = BM25Retriever.from_persist_dir(_BM25_PERSIST_DIR)

        if self._use_web_search:
            self.tavily_tool = TavilyToolSpec(api_key=os.environ.get("TAVILY_AI_API_KEY"))

    @step
    async def route_retrieval(
        self, ctx: Context, ev: StartEvent
    ) -> VectorSearchRetrieveEvent | BM25RetrieveEvent | TransformQueryEvent | QueryEvent | None:
        """Route query to the retrieval steps based on the model config."""
        query = ev.get("query")

        if query is None:
            return None

        # Setting the query in the Context object to access it globally
        await ctx.set("query", query)

        # If not retriever is specified, direct to the final query step with an empty context
        if len(self.retrievers) == 0:
            return QueryEvent(context="")

        # Trigger the retrieval steps based on the model config
        if self._use_vs_retriever:
            ctx.send_event(VectorSearchRetrieveEvent(query=query))
        if self._use_bm25_retriever:
            ctx.send_event(BM25RetrieveEvent(query=query))
        if self._use_web_search:
            ctx.send_event(TransformQueryEvent(query=query))

    @step
    async def query_vector_store(self, ev: VectorSearchRetrieveEvent) -> RetrievalResultEvent:
        """Perform retrieval using the vector store."""
        nodes = self.vs_retriever.retrieve(ev.query)
        return RetrievalResultEvent(nodes=nodes, retriever="vector_search")

    @step
    async def query_bm25(self, ev: BM25RetrieveEvent) -> RetrievalResultEvent:
        """Perform retrieval using the BM25 retriever."""
        nodes = self.bm25_retriever.retrieve(ev.query)
        return RetrievalResultEvent(nodes=nodes, retriever="bm25")

    @step
    async def transform_query(self, ev: TransformQueryEvent) -> WebsearchEvent:
        """Transform the user query into a search query."""
        prompt = TRANSFORM_QUERY_TEMPLATE.format(query=ev.query)
        transformed_query = self.llm.complete(prompt).text
        return WebsearchEvent(search_query=transformed_query)

    @step
    async def query_web_search(self, ev: WebsearchEvent) -> RetrievalResultEvent:
        """Perform web search with the transformed query string"""
        search_results = self.tavily_tool.search(ev.search_query, max_results=5)
        nodes = [NodeWithScore(node=document, score=None) for document in search_results]
        return RetrievalResultEvent(nodes=nodes, retriever="web_search")

    @step
    async def gather_retrieval_results(
        self, ctx: Context, ev: RetrievalResultEvent
    ) -> RerankEvent | QueryEvent | None:
        """Gather the retrieved texts and send them to the reranking step."""
        # Wait for results from all retrievers
        results = ctx.collect_events(ev, [RetrievalResultEvent] * len(self.retrievers))

        # Llama Index workflow polls for results until all retrievers have responded.
        # If any retriever has not responded, collect_events will return None and we
        # should return None to wait for the next poll.
        if results is None:
            return None

        # If only one retriever is used, we can skip reranking
        if len(results) == 1:
            context = "\n".join(node.text for node in results[0].nodes)
            return QueryEvent(context=context)

        # Combine the nodes from all retrievers for reranking
        all_nodes = []
        for result in results:
            # Record the source of the retrieved nodes
            for node in result.nodes:
                node.node.metadata["retriever"] = result.retriever
            all_nodes.extend(result.nodes)

        return RerankEvent(nodes=all_nodes)

    @step
    async def rerank(self, ctx: Context, ev: RerankEvent) -> QueryEvent:
        """Evaluate relevancy of retrieved documents with the query."""
        query = await ctx.get("query")

        # Rerank the nodes using LLM (RankGPT based)
        reranker = RankGPTRerank(llm=self.llm, top_n=5)
        reranked_nodes = reranker.postprocess_nodes(ev.nodes, query_str=query)
        reranked_context = "\n".join(node.text for node in reranked_nodes)
        return QueryEvent(context=reranked_context)

    @step
    async def query_result(self, ctx: Context, ev: QueryEvent) -> StopEvent:
        """Get result with relevant text."""
        query = await ctx.get("query")

        prompt = FINAL_QUERY_TEMPLATE.format(context=ev.context, query=query)
        response = self.llm.complete(prompt).text
        return StopEvent(result=response)
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/llms/README.md

```text
# MLflow examples for LLM use cases

This directory includes several examples for tracking, evaluating, and scoring models with LLMs.

## Summarization

The `summarization/summarization.py` script uses prompt engineering to build two summarization models for news articles with LangChain. It leverages the `mlflow.langchain` flavor to package and log the models to MLflow, `mlflow.evaluate()` to evaluate each model's performance on a small example dataset, and `mlflow.pyfunc.load_model()` to load and score the best packaged model on a new example article.

To run the example as an MLflow Project, simply execute the following command from this directory:

```
$ cd summarization && mlflow run .
```

To run the example as a Python script, simply execute the following command from this directory:

```
$ cd summarization && python summarization.py
```

Note that this example requires MLflow 2.4.0 or greater to run. Additionally, you must have [LangChain](https://python.langchain.com/en/latest/index.html) and the [OpenAI Python client](https://pypi.org/project/openai/) installed in order to run the example. We also recommend installing the [Hugging Face Evaluate library](https://huggingface.co/docs/evaluate/index) to compute [ROUGE metrics](<https://en.wikipedia.org/wiki/ROUGE_(metric)>) for summary quality. Finally, you must specify a valid OpenAI API key in the `OPENAI_API_KEY` environment variable.

## Question answering

The `question_answering/question_answering.py` script uses prompt engineering to build two models that answer questions about MLflow.

It leverages the `mlflow.openai` flavor to package and log the models to MLflow, `mlflow.evaluate()` to evaluate each model's performance on some example questions, and `mlflow.pyfunc.load_model()` to load and score the best packaged model on a new example question.

To run the example as an MLflow Project, simply execute the following command from this directory:

```
$ cd question_answering && mlflow run .
```

To run the example as a Python script, simply execute the following command from this directory:

```
$ cd question_answering && python question_answering.py
```

Note that this example requires MLflow 2.4.0 or greater to run. Additionally, you must have the [OpenAI Python client](https://pypi.org/project/openai/), [tiktoken](https://pypi.org/project/tiktoken/), and [tenacity](https://pypi.org/project/tenacity/) installed in order to run the example. Finally, you must specify a valid OpenAI API key in the `OPENAI_API_KEY` environment variable.
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/examples/llms/question_answering/MLproject

```text
name: llm_question_answering

python_env: python_env.yaml

entry_points:
  main:
    command: python question_answering.py
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/examples/llms/question_answering/python_env.yaml

```yaml
python: "3.10"
build_dependencies:
  - pip
dependencies:
  - openai>=0.27.2
  - tiktoken>=0.4.0
  - tenacity>=8.2.2
  - mlflow>=2.4.0
```

--------------------------------------------------------------------------------

---[FILE: question_answering.py]---
Location: mlflow-master/examples/llms/question_answering/question_answering.py

```python
import os

import openai
import pandas as pd

import mlflow

assert "OPENAI_API_KEY" in os.environ, (
    "Please set the OPENAI_API_KEY environment variable to run this example."
)


def build_and_evaluate_model_with_prompt(system_prompt):
    mlflow.start_run()
    mlflow.log_param("system_prompt", system_prompt)

    # Create a question answering model using prompt engineering with OpenAI. Log the model
    # to MLflow Tracking
    logged_model = mlflow.openai.log_model(
        model="gpt-4o-mini",
        task=openai.chat.completions,
        name="model",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": "{question}"},
        ],
    )

    # Evaluate the model on some example questions
    questions = pd.DataFrame(
        {
            "question": [
                "How do you create a run with MLflow?",
                "How do you log a model with MLflow?",
                "What is the capital of France?",
            ]
        }
    )
    mlflow.evaluate(
        model=logged_model.model_uri,
        model_type="question-answering",
        data=questions,
    )
    mlflow.end_run()


system_prompt_1 = "Your job is to answer questions about MLflow."
print(f"Building and evaluating model with prompt: '{system_prompt_1}'")
build_and_evaluate_model_with_prompt(system_prompt_1)

system_prompt_2 = (
    "Your job is to answer questions about MLflow. When you are asked a question about MLflow,"
    " respond to it. Make sure to include code examples. If the question is not related to"
    " MLflow, refuse to answer and say that the question is unrelated."
)
print(f"Building and evaluating model with prompt: '{system_prompt_2}'")
build_and_evaluate_model_with_prompt(system_prompt_2)

# Load and inspect the evaluation results
results: pd.DataFrame = mlflow.load_table(
    "eval_results_table.json", extra_columns=["run_id", "params.system_prompt"]
)
results_grouped_by_question = results.sort_values(by="question")
print("Evaluation results:")
print(results_grouped_by_question[["run_id", "params.system_prompt", "question", "outputs"]])

# Score the best model on a new question
new_question = "How do you create a model version with the MLflow Model Registry?"
print(f"Scoring the model with prompt '{system_prompt_2}' on the question '{new_question}'")
best_model = mlflow.pyfunc.load_model(f"runs:/{mlflow.last_active_run().info.run_id}/model")
response = best_model.predict(new_question)
print(f"Response: {response}")
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: mlflow-master/examples/llms/RAG/.gitignore

```text
_embeddings_cache.json
```

--------------------------------------------------------------------------------

````
