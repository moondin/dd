---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 170
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 170 of 991)

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

---[FILE: runllm.js]---
Location: mlflow-master/docs/static/js/runllm.js

```javascript
document.addEventListener('DOMContentLoaded', function () {
  var script = document.createElement('script');
  script.type = 'module';
  script.id = 'runllm-widget-script';

  script.src = 'https://widget.runllm.com';

  script.setAttribute('runllm-keyboard-shortcut', 'Mod+j'); // cmd-j or ctrl-j to open the widget.
  script.setAttribute('runllm-name', 'MLflow');
  script.setAttribute('runllm-position', 'BOTTOM_RIGHT');
  script.setAttribute('runllm-assistant-id', '116');
  script.setAttribute('runllm-theme-color', '#008ED9');
  script.setAttribute('runllm-brand-logo', 'https://mlflow.org/img/mlflow-favicon.ico');
  script.setAttribute('runllm-community-type', 'slack');
  script.setAttribute('runllm-community-url', 'https://mlflow.org/slack');
  script.setAttribute('runllm-disable-ask-a-person', 'true');

  script.async = true;
  document.head.appendChild(script);
});
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/README.md

```text
## MLflow examples

### Quick Start example

- `quickstart/mlflow_tracking.py` is a basic example to introduce MLflow concepts.

## Tutorials

Various examples that depict MLflow tracking, project, and serving use cases.

- `h2o` depicts how MLflow can be use to track various random forest architectures to train models
  for predicting wine quality.
- `hyperparam` shows how to do hyperparameter tuning with MLflow and some popular optimization libraries.
- `keras` modifies
  [a Keras classification example](https://github.com/keras-team/keras/blob/ed07472bc5fc985982db355135d37059a1f887a9/examples/reuters_mlp.py)
  and uses MLflow's `mlflow.tensorflow.autolog()` API to automatically log metrics and parameters
  to MLflow during training.
- `multistep_workflow` is an end-to-end of a data ETL and ML training pipeline built as an MLflow
  project. The example shows how parts of the workflow can leverage from previously run steps.
- `pytorch` uses CNN on MNIST dataset for character recognition. The example logs TensorBoard events
  and stores (logs) them as MLflow artifacts.
- `remote_store` has a usage example of REST based backed store for tracking.
- `r_wine` demonstrates how to log parameters, metrics, and models from R.
- `sklearn_elasticnet_diabetes` uses the sklearn diabetes dataset to predict diabetes progression
  using ElasticNet.
- `sklearn_elasticnet_wine_quality` is an example for MLflow projects. This uses the Wine
  Quality dataset and Elastic Net to predict quality. The example uses `MLproject` to set up a
  Conda environment, define parameter types and defaults, entry point for training, etc.
- `sklearn_logistic_regression` is a simple MLflow example with hooks to log training data to MLflow
  tracking server.
- `supply_chain_security` shows how to strengthen the security of ML projects against supply-chain attacks by enforcing hash checks on Python packages.
- `tensorflow` contains end-to-end one run examples from train to predict for TensorFlow 2.8+ It includes usage of MLflow's
  `mlflow.tensorflow.autolog()` API, which captures TensorBoard data and logs to MLflow with no code change.
- `docker` demonstrates how to create and run an MLflow project using docker (rather than conda)
  to manage project dependencies
- `johnsnowlabs` gives you access to [20.000+ state-of-the-art enterprise NLP models in 200+ languages](https://nlp.johnsnowlabs.com/models) for medical, finance, legal and many more domains.

## Demos

- `demos` folder contains notebooks used during MLflow presentations.
```

--------------------------------------------------------------------------------

---[FILE: tracing.py]---
Location: mlflow-master/examples/ag2/tracing.py

```python
"""
This is an example for leveraging MLflow's auto tracing capabilities for AutoGen.

For more information about MLflow Tracing, see: https://mlflow.org/docs/latest/llms/tracing/index.html
"""

import os
from typing import Annotated, Literal

from autogen import ConversableAgent

import mlflow

# Turn on auto tracing for AutoGen by calling mlflow.autogen.autolog()
mlflow.autogen.autolog()


config_list = [
    {
        "model": "gpt-4o-mini",
        # Please set your OpenAI API Key to the OPENAI_API_KEY env var before running this example
        "api_key": os.environ.get("OPENAI_API_KEY"),
    }
]

Operator = Literal["+", "-", "*", "/"]


def calculator(a: int, b: int, operator: Annotated[Operator, "operator"]) -> int:
    if operator == "+":
        return a + b
    elif operator == "-":
        return a - b
    elif operator == "*":
        return a * b
    elif operator == "/":
        return int(a / b)
    else:
        raise ValueError("Invalid operator")


# First define the assistant agent that suggests tool calls.
assistant = ConversableAgent(
    name="Assistant",
    system_message="You are a helpful AI assistant. "
    "You can help with simple calculations. "
    "Return 'TERMINATE' when the task is done.",
    llm_config={"config_list": config_list},
)

# The user proxy agent is used for interacting with the assistant agent
# and executes tool calls.
user_proxy = ConversableAgent(
    name="Tool Agent",
    llm_config=False,
    is_termination_msg=lambda msg: msg.get("content") is not None and "TERMINATE" in msg["content"],
    human_input_mode="NEVER",
)

# Register the tool signature with the assistant agent.
assistant.register_for_llm(name="calculator", description="A simple calculator")(calculator)
user_proxy.register_for_execution(name="calculator")(calculator)
response = user_proxy.initiate_chat(assistant, message="What is (44231 + 13312 / (230 - 20)) * 4?")
```

--------------------------------------------------------------------------------

---[FILE: tracing.py]---
Location: mlflow-master/examples/agno/tracing.py

```python
import mlflow

mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("AGNO Reasoning Finance Team")

mlflow.agno.autolog()
mlflow.anthropic.autolog()
mlflow.openai.autolog()

from agno.agent import Agent
from agno.models.anthropic import Claude
from agno.models.openai import OpenAIChat
from agno.team.team import Team
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.tools.reasoning import ReasoningTools
from agno.tools.yfinance import YFinanceTools

web_agent = Agent(
    name="Web Search Agent",
    role="Handle web search requests and general research",
    model=OpenAIChat(id="gpt-4.1"),
    tools=[DuckDuckGoTools()],
    instructions="Always include sources",
    add_datetime_to_instructions=True,
)

finance_agent = Agent(
    name="Finance Agent",
    role="Handle financial data requests and market analysis",
    model=OpenAIChat(id="gpt-4.1"),
    tools=[
        YFinanceTools(
            stock_price=True,
            stock_fundamentals=True,
            analyst_recommendations=True,
            company_info=True,
        )
    ],
    instructions=[
        "Use tables to display stock prices, fundamentals (P/E, Market Cap), and recommendations.",
        "Clearly state the company name and ticker symbol.",
        "Focus on delivering actionable financial insights.",
    ],
    add_datetime_to_instructions=True,
)

reasoning_finance_team = Team(
    name="Reasoning Finance Team",
    mode="coordinate",
    model=Claude(id="claude-sonnet-4-20250514"),
    members=[web_agent, finance_agent],
    tools=[ReasoningTools(add_instructions=True)],
    instructions=[
        "Collaborate to provide comprehensive financial and investment insights",
        "Consider both fundamental analysis and market sentiment",
        "Use tables and charts to display data clearly and professionally",
        "Present findings in a structured, easy-to-follow format",
        "Only output the final consolidated analysis, not individual agent responses",
    ],
    markdown=True,
    show_members_responses=True,
    enable_agentic_context=True,
    add_datetime_to_instructions=True,
    success_criteria="The team has provided a complete financial analysis with data, visualizations, risk assessment, and actionable investment recommendations supported by quantitative analysis and market research.",
)

if __name__ == "__main__":
    reasoning_finance_team.print_response(
        """Compare the tech sector giants (AAPL, GOOGL, MSFT) performance:
        1. Get financial data for all three companies
        2. Analyze recent news affecting the tech sector
        3. Calculate comparative metrics and correlations
        4. Recommend portfolio allocation weights""",
        stream=False,
        show_full_reasoning=True,
    )
```

--------------------------------------------------------------------------------

---[FILE: tracing.py]---
Location: mlflow-master/examples/anthropic/tracing.py

```python
"""
This is an example for leveraging MLflow's auto tracing capabilities for Anthropic.

For more information about MLflow Tracing, see: https://mlflow.org/docs/latest/llms/tracing/index.html
"""

import os

import anthropic

import mlflow

# Turn on auto tracing for Anthropic by calling mlflow.anthropic.autolog()
mlflow.anthropic.autolog()

# Configure your API key.
client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

# Use the create method to create new message.
message = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello, Claude"},
    ],
)
print(message.content)
```

--------------------------------------------------------------------------------

---[FILE: auth.py]---
Location: mlflow-master/examples/auth/auth.py

```python
import os
import uuid

import mlflow.server


class User:
    MLFLOW_TRACKING_USERNAME = "MLFLOW_TRACKING_USERNAME"
    MLFLOW_TRACKING_PASSWORD = "MLFLOW_TRACKING_PASSWORD"

    def __init__(self, username, password) -> None:
        self.username = username
        self.password = password
        self.env = {}

    def _record_env_var(self, key):
        if key := os.getenv(key):
            self.env[key] = key

    def _restore_env_var(self, key):
        if value := self.env.get(key):
            os.environ[key] = value
        else:
            del os.environ[key]

    def __enter__(self):
        self._record_env_var(User.MLFLOW_TRACKING_USERNAME)
        self._record_env_var(User.MLFLOW_TRACKING_PASSWORD)
        os.environ[User.MLFLOW_TRACKING_USERNAME] = self.username
        os.environ[User.MLFLOW_TRACKING_PASSWORD] = self.password
        return self

    def __exit__(self, *_exc):
        self._restore_env_var(User.MLFLOW_TRACKING_USERNAME)
        self._restore_env_var(User.MLFLOW_TRACKING_PASSWORD)
        self.env.clear()


tracking_uri = "http://localhost:5000"
mlflow.set_tracking_uri(tracking_uri)
client = mlflow.server.get_app_client("basic-auth", tracking_uri)
A = User("user_a", "password_a")
B = User("user_b", "password_b")

with A:
    exp_a = mlflow.set_experiment(uuid.uuid4().hex)
    with mlflow.start_run():
        mlflow.log_metric("a", 1)

with B:
    mlflow.set_experiment(exp_a.name)
    try:
        with mlflow.start_run():  # not allowed
            mlflow.log_metric("b", 2)
    except Exception as e:
        print(str(e))

# Grant B permission to edit A's experiment
with A:
    client.create_experiment_permission(str(exp_a.experiment_id), B.username, "EDIT")

# B can edit now, should be able to log a metric
with B:
    mlflow.set_experiment(exp_a.name)
    with mlflow.start_run():
        mlflow.log_metric("b", 2)
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/auth/README.md

```text
# Basic authentication example

This example demonstrates the authentication and authorization feature of MLflow.

To run this example,

1. Start the tracking server
   ```shell
   mlflow server --app-name=basic-auth
   ```
2. Go to `http://localhost:5000/signup` and register two users:
   - `(user_a, password_a)`
   - `(user_b, password_b)`
3. Run the script
   ```shell
   python auth.py
   ```
   Expected output:
   ```
   2023/05/02 14:03:58 INFO mlflow.tracking.fluent: Experiment with name 'experiment_a' does not exist. Creating a new experiment.
   {}
   API request to endpoint /api/2.0/mlflow/runs/create failed with error code 403 != 200. Response body: 'Permission denied'
   ```
```

--------------------------------------------------------------------------------

---[FILE: train.py]---
Location: mlflow-master/examples/catboost/train.py

```python
# Based on the official regression example:
# https://catboost.ai/docs/concepts/python-usages-examples.html#regression

import numpy as np
from catboost import CatBoostRegressor

import mlflow
from mlflow.models import infer_signature

# Initialize data
train_data = np.array([[1, 4, 5, 6], [4, 5, 6, 7], [30, 40, 50, 60]])
train_labels = np.array([10, 20, 30])
eval_data = np.array([[2, 4, 6, 8], [1, 4, 50, 60]])

# Initialize CatBoostRegressor
params = {
    "iterations": 2,
    "learning_rate": 1,
    "depth": 2,
    "allow_writing_files": False,
}
model = CatBoostRegressor(**params)

# Fit model
model.fit(train_data, train_labels)

# Log parameters and fitted model
with mlflow.start_run() as run:
    signature = infer_signature(eval_data, model.predict(eval_data))
    mlflow.log_params(params)
    model_info = mlflow.catboost.log_model(model, name="model", signature=signature)

# Load model
loaded_model = mlflow.catboost.load_model(model_info.model_uri)

# Get predictions
preds = loaded_model.predict(eval_data)
print("predictions:", preds)
```

--------------------------------------------------------------------------------

---[FILE: tracing.py]---
Location: mlflow-master/examples/crewai/tracing.py

```python
"""
This is an example for leveraging MLflow's auto tracing capabilities for CrewAI.
Most codes are from https://github.com/crewAIInc/crewAI-examples/tree/main/trip_planner.

For more information about MLflow Tracing, see: https://mlflow.org/docs/latest/llms/tracing/index.html
Note that the following example works with crewai>=0.83.0.
"""

from textwrap import dedent

from crewai import Agent, Crew, Task
from crewai.knowledge.source.string_knowledge_source import StringKnowledgeSource
from crewai_tools import SerperDevTool, WebsiteSearchTool

import mlflow

mlflow.set_experiment("CrewAI")

# Turn on auto tracing by calling mlflow.crewai.autolog()
mlflow.crewai.autolog()

content = "Users name is John. He is 30 years old and lives in San Francisco."
string_source = StringKnowledgeSource(content=content, metadata={"preference": "personal"})

search_tool = SerperDevTool()
web_rag_tool = WebsiteSearchTool()


class TripAgents:
    def city_selection_agent(self):
        return Agent(
            role="City Selection Expert",
            goal="Select the best city based on weather, season, and prices",
            backstory="An expert in analyzing travel data to pick ideal destinations",
            tools=[search_tool, web_rag_tool],
            verbose=True,
        )

    def local_expert(self):
        return Agent(
            role="Local Expert at this city",
            goal="Provide the BEST insights about the selected city",
            backstory="""A knowledgeable local guide with extensive information
        about the city, it's attractions and customs""",
            tools=[search_tool, web_rag_tool],
            verbose=True,
        )


class TripTasks:
    def identify_task(self, agent, origin, cities, interests, range):
        return Task(
            description=dedent(f"""
                Analyze and select the best city for the trip based
                on specific criteria such as weather patterns, seasonal
                events, and travel costs. This task involves comparing
                multiple cities, considering factors like current weather
                conditions, upcoming cultural or seasonal events, and
                overall travel expenses.
                Your final answer must be a detailed
                report on the chosen city, and everything you found out
                about it, including the actual flight costs, weather
                forecast and attractions.

                Traveling from: {origin}
                City Options: {cities}
                Trip Date: {range}
                Traveler Interests: {interests}
            """),
            agent=agent,
            expected_output="Detailed report on the chosen city including flight costs, weather forecast, and attractions",
        )

    def gather_task(self, agent, origin, interests, range):
        return Task(
            description=dedent(f"""
                As a local expert on this city you must compile an
                in-depth guide for someone traveling there and wanting
                to have THE BEST trip ever!
                Gather information about key attractions, local customs,
                special events, and daily activity recommendations.
                Find the best spots to go to, the kind of place only a
                local would know.
                This guide should provide a thorough overview of what
                the city has to offer, including hidden gems, cultural
                hotspots, must-visit landmarks, weather forecasts, and
                high level costs.
                The final answer must be a comprehensive city guide,
                rich in cultural insights and practical tips,
                tailored to enhance the travel experience.

                Trip Date: {range}
                Traveling from: {origin}
                Traveler Interests: {interests}
            """),
            agent=agent,
            expected_output="Comprehensive city guide including hidden gems, cultural hotspots, and practical travel tips",
        )


class TripCrew:
    def __init__(self, origin, cities, date_range, interests):
        self.cities = cities
        self.origin = origin
        self.interests = interests
        self.date_range = date_range

    def run(self):
        agents = TripAgents()
        tasks = TripTasks()

        city_selector_agent = agents.city_selection_agent()
        local_expert_agent = agents.local_expert()

        identify_task = tasks.identify_task(
            city_selector_agent, self.origin, self.cities, self.interests, self.date_range
        )
        gather_task = tasks.gather_task(
            local_expert_agent, self.origin, self.interests, self.date_range
        )

        crew = Crew(
            agents=[city_selector_agent, local_expert_agent],
            tasks=[identify_task, gather_task],
            verbose=True,
            memory=True,
            knowledge={"sources": [string_source], "metadata": {"preference": "personal"}},
        )

        result = crew.kickoff()
        return result


trip_crew = TripCrew("California", "Tokyo", "Dec 12 - Dec 20", "sports")
result = trip_crew.run()
print("\n\n########################")
print("## Here is you Trip Plan")
print("########################\n")
print(result)
```

--------------------------------------------------------------------------------

---[FILE: dbconnect.py]---
Location: mlflow-master/examples/databricks/dbconnect.py

```python
"""
python examples/databricks/dbconnect.py --cluster-id <cluster-id>
"""

import argparse

from databricks.connect import DatabricksSession
from databricks.sdk import WorkspaceClient
from pyspark.sql.types import DoubleType
from sklearn import datasets
from sklearn.neighbors import KNeighborsClassifier

import mlflow
from mlflow.models import infer_signature


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--cluster-id", required=True)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    wc = WorkspaceClient()

    # Train a model
    X, y = datasets.load_iris(as_frame=True, return_X_y=True)
    model = KNeighborsClassifier().fit(X, y)
    predictions = model.predict(X)
    signature = infer_signature(X, predictions)

    # Log the model
    mlflow.set_tracking_uri("databricks")
    mlflow.set_experiment(f"/Users/{wc.current_user.me().user_name}/dbconnect")
    with mlflow.start_run():
        model_info = mlflow.sklearn.log_model(model, name="model", signature=signature)

    spark = DatabricksSession.builder.remote(
        host=wc.config.host,
        token=wc.config.token,
        cluster_id=args.cluster_id,
    ).getOrCreate()
    sdf = spark.createDataFrame(X.head(5))
    pyfunc_udf = mlflow.pyfunc.spark_udf(
        spark,
        model_info.model_uri,
        env_manager="local",
        result_type=DoubleType(),
    )
    preds = sdf.select(pyfunc_udf(*X.columns).alias("preds"))
    preds.show()


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: log_runs.py]---
Location: mlflow-master/examples/databricks/log_runs.py

```python
"""
Logs MLflow runs in Databricks from an external host.

How to run:
$ python examples/databricks/log_runs.py --host <host> --token <token> --user <user> [--experiment-id 123]

See also:
https://docs.databricks.com/dev-tools/api/latest/authentication.html#generate-a-personal-access-token
"""

import argparse
import os
import uuid

from sklearn import datasets, svm
from sklearn.model_selection import GridSearchCV, ParameterGrid

import mlflow


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", help="Databricks workspace URL")
    parser.add_argument("--token", help="Databricks personal access token")
    parser.add_argument("--user", help="Databricks username")
    parser.add_argument(
        "--experiment-id",
        default=None,
        help="ID of the experiment to log runs in. If unspecified, a new experiment will be created.",
    )
    args = parser.parse_args()

    os.environ["DATABRICKS_HOST"] = args.host
    os.environ["DATABRICKS_TOKEN"] = args.token

    mlflow.set_tracking_uri("databricks")
    if args.experiment_id:
        experiment = mlflow.set_experiment(experiment_id=args.experiment_id)
    else:
        experiment = mlflow.set_experiment(f"/Users/{args.user}/{uuid.uuid4().hex}")

    print(f"Logging runs in {args.host}#/mlflow/experiments/{experiment.experiment_id}")
    mlflow.sklearn.autolog(max_tuning_runs=None)
    iris = datasets.load_iris()
    parameters = {"kernel": ("linear", "rbf"), "C": [1, 5, 10]}
    clf = GridSearchCV(svm.SVC(), parameters)
    clf.fit(iris.data, iris.target)

    # Log unnested runs
    for params in ParameterGrid(parameters):
        clf = svm.SVC(**params)
        clf.fit(iris.data, iris.target)


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: multipart.py]---
Location: mlflow-master/examples/databricks/multipart.py

```python
"""
Benchmark for multi-part upload and download of artifacts.
"""

import hashlib
import json
import os
import pathlib
import tempfile
from concurrent.futures import ThreadPoolExecutor, as_completed

import pandas as pd
import psutil
from tqdm.auto import tqdm

import mlflow
from mlflow.environment_variables import (
    MLFLOW_ENABLE_MULTIPART_DOWNLOAD,
    MLFLOW_ENABLE_MULTIPART_UPLOAD,
)
from mlflow.utils.time import Timer

GiB = 1024**3


def show_system_info():
    svmem = psutil.virtual_memory()
    info = json.dumps(
        {
            "MLflow version": mlflow.__version__,
            "MPU enabled": MLFLOW_ENABLE_MULTIPART_DOWNLOAD.get(),
            "MPD enabled": MLFLOW_ENABLE_MULTIPART_UPLOAD.get(),
            "CPU count": psutil.cpu_count(),
            "Memory usage (total) [GiB]": svmem.total // GiB,
            "Memory used [GiB]": svmem.used // GiB,
            "Memory available [GiB]": svmem.available // GiB,
        },
        indent=2,
    )
    max_len = max(map(len, info.splitlines()))
    print("=" * max_len)
    print(info)
    print("=" * max_len)


def md5_checksum(path):
    file_hash = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(1024**2):
            file_hash.update(chunk)
    return file_hash.hexdigest()


def assert_checksum_equal(path1, path2):
    assert md5_checksum(path1) == md5_checksum(path2), f"Checksum mismatch for {path1} and {path2}"


def yield_random_bytes(num_bytes):
    while num_bytes > 0:
        chunk_size = min(num_bytes, 1024**2)
        yield os.urandom(chunk_size)
        num_bytes -= chunk_size


def generate_random_file(path, num_bytes):
    with open(path, "wb") as f:
        for chunk in yield_random_bytes(num_bytes):
            f.write(chunk)


def upload_and_download(file_size, num_files):
    with tempfile.TemporaryDirectory() as tmpdir:
        tmpdir = pathlib.Path(tmpdir)

        # Prepare files
        src_dir = tmpdir / "src"
        src_dir.mkdir()
        files = {}
        with ThreadPoolExecutor() as pool:
            futures = []
            for i in range(num_files):
                f = src_dir / str(i)
                futures.append(pool.submit(generate_random_file, f, file_size))
                files[f.name] = f

            for fut in tqdm(
                as_completed(futures),
                total=len(futures),
                desc="Generating files",
                colour="#FFA500",
            ):
                fut.result()

        # Upload
        with mlflow.start_run() as run:
            with Timer() as t_upload:
                mlflow.log_artifacts(str(src_dir))

        # Download
        dst_dir = tmpdir / "dst"
        dst_dir.mkdir()
        with Timer() as t_download:
            mlflow.artifacts.download_artifacts(
                artifact_uri=f"{run.info.artifact_uri}/", dst_path=dst_dir
            )

        # Verify checksums
        with ThreadPoolExecutor() as pool:
            futures = []
            for f in dst_dir.rglob("*"):
                if f.is_dir():
                    continue
                futures.append(pool.submit(assert_checksum_equal, f, files[f.name]))

            for fut in tqdm(
                as_completed(futures),
                total=len(futures),
                desc="Verifying checksums",
                colour="#FFA500",
            ):
                fut.result()

        return t_upload.elapsed, t_download.elapsed


def main():
    # Uncomment the following lines if you're running this script outside of Databricks
    # using a personal access token:
    # mlflow.set_tracking_uri("databricks")
    # mlflow.set_experiment("/Users/<username>/benchmark")

    FILE_SIZE = 1 * GiB
    NUM_FILES = 2
    NUM_ATTEMPTS = 3

    show_system_info()
    stats = []
    for i in range(NUM_ATTEMPTS):
        print(f"Attempt {i + 1} / {NUM_ATTEMPTS}")
        stats.append(upload_and_download(FILE_SIZE, NUM_FILES))

    df = pd.DataFrame(stats, columns=["upload [s]", "download [s]"])
    # show mean, min, max in markdown table
    print(df.aggregate(["count", "mean", "min", "max"]).to_markdown())


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

````
