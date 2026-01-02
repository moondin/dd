---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 183
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 183 of 991)

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

---[FILE: tracing.py]---
Location: mlflow-master/examples/haystack/tracing.py

```python
import os
from getpass import getpass

from haystack import Pipeline
from haystack.components.builders import ChatPromptBuilder
from haystack.components.generators.chat import OpenAIChatGenerator
from haystack.components.retrievers.in_memory import InMemoryBM25Retriever
from haystack.components.routers import ConditionalRouter
from haystack.components.websearch.serper_dev import SerperDevWebSearch
from haystack.dataclasses import ChatMessage, Document
from haystack.document_stores.in_memory import InMemoryDocumentStore

import mlflow

mlflow.set_experiment("Haystack Tracing")
mlflow.haystack.autolog()

if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = getpass("Enter OpenAI API key:")
if "SERPERDEV_API_KEY" not in os.environ:
    os.environ["SERPERDEV_API_KEY"] = getpass("Enter SerperDev API key:")


document_store = InMemoryDocumentStore()

documents = [
    Document(
        content="""Munich, the vibrant capital of Bavaria in southern Germany, exudes a perfect blend of rich cultural
                                heritage and modern urban sophistication. Nestled along the banks of the Isar River, Munich is renowned
                                for its splendid architecture, including the iconic Neues Rathaus (New Town Hall) at Marienplatz and
                                the grandeur of Nymphenburg Palace. The city is a haven for art enthusiasts, with world-class museums like the
                                Alte Pinakothek housing masterpieces by renowned artists. Munich is also famous for its lively beer gardens, where
                                locals and tourists gather to enjoy the city's famed beers and traditional Bavarian cuisine. The city's annual
                                Oktoberfest celebration, the world's largest beer festival, attracts millions of visitors from around the globe.
                                Beyond its cultural and culinary delights, Munich offers picturesque parks like the English Garden, providing a
                                serene escape within the heart of the bustling metropolis. Visitors are charmed by Munich's warm hospitality,
                                making it a must-visit destination for travelers seeking a taste of both old-world charm and contemporary allure."""
    )
]

document_store.write_documents(documents)

retriever = InMemoryBM25Retriever(document_store)

prompt_template = [
    ChatMessage.from_user(
        """
Answer the following query given the documents.
If the answer is not contained within the documents reply with 'no_answer'

Documents:
{% for document in documents %}
  {{document.content}}
{% endfor %}
Query: {{query}}
"""
    )
]

prompt_builder = ChatPromptBuilder(template=prompt_template, required_variables="*")
llm = OpenAIChatGenerator(model="gpt-4o-mini")

prompt_for_websearch = [
    ChatMessage.from_user(
        """
Answer the following query given the documents retrieved from the web.
Your answer should indicate that your answer was generated from websearch.

Documents:
{% for document in documents %}
  {{document.content}}
{% endfor %}

Query: {{query}}
"""
    )
]

websearch = SerperDevWebSearch()
prompt_builder_for_websearch = ChatPromptBuilder(
    template=prompt_for_websearch, required_variables="*"
)
llm_for_websearch = OpenAIChatGenerator(model="gpt-4o-mini")


routes = [
    {
        "condition": "{{'no_answer' in replies[0].text}}",
        "output": "{{query}}",
        "output_name": "go_to_websearch",
        "output_type": str,
    },
    {
        "condition": "{{'no_answer' not in replies[0].text}}",
        "output": "{{replies[0].text}}",
        "output_name": "answer",
        "output_type": str,
    },
]

router = ConditionalRouter(routes)

agentic_rag_pipe = Pipeline()
agentic_rag_pipe.add_component("retriever", retriever)
agentic_rag_pipe.add_component("prompt_builder", prompt_builder)
agentic_rag_pipe.add_component("llm", llm)
agentic_rag_pipe.add_component("router", router)
agentic_rag_pipe.add_component("websearch", websearch)
agentic_rag_pipe.add_component("prompt_builder_for_websearch", prompt_builder_for_websearch)
agentic_rag_pipe.add_component("llm_for_websearch", llm_for_websearch)

agentic_rag_pipe.connect("retriever", "prompt_builder.documents")
agentic_rag_pipe.connect("prompt_builder.prompt", "llm.messages")
agentic_rag_pipe.connect("llm.replies", "router.replies")
agentic_rag_pipe.connect("router.go_to_websearch", "websearch.query")
agentic_rag_pipe.connect("router.go_to_websearch", "prompt_builder_for_websearch.query")
agentic_rag_pipe.connect("websearch.documents", "prompt_builder_for_websearch.documents")
agentic_rag_pipe.connect("prompt_builder_for_websearch", "llm_for_websearch")


query = "How many people live in Munich?"

result = agentic_rag_pipe.run(
    {"retriever": {"query": query}, "prompt_builder": {"query": query}, "router": {"query": query}}
)

# Print the `replies` generated using the web searched Documents
print(result["llm_for_websearch"]["replies"][0].text)

last_trace_id = mlflow.get_last_active_trace_id()
trace = mlflow.get_trace(trace_id=last_trace_id)

# Print the token usage
total_usage = trace.info.token_usage
print("== Total token usage: ==")
print(f"  Input tokens: {total_usage['input_tokens']}")
print(f"  Output tokens: {total_usage['output_tokens']}")
print(f"  Total tokens: {total_usage['total_tokens']}")

# Print the token usage for each LLM call
print("\n== Detailed usage for each LLM call: ==")
for span in trace.data.spans:
    if usage := span.get_attribute("mlflow.chat.tokenUsage"):
        print(f"{span.name}:")
        print(f"  Input tokens: {usage['input_tokens']}")
        print(f"  Output tokens: {usage['output_tokens']}")
        print(f"  Total tokens: {usage['total_tokens']}")
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/examples/hyperparam/MLproject

```text
name: HyperparameterSearch

python_env: python_env.yaml

entry_points:
  # train Keras DL model
  train:
    parameters:
      training_data: {type: string, default: "https://raw.githubusercontent.com/mlflow/mlflow/master/tests/datasets/winequality-white.csv"}
      epochs: {type: int, default: 32}
      batch_size: {type: int, default: 16}
      learning_rate: {type: float, default: 1e-1}
      momentum: {type: float, default: .0}
      seed: {type: int, default: 97531}
    command: "python train.py {training_data}
                                    --batch-size {batch_size}
                                    --epochs {epochs}
                                    --learning-rate {learning_rate}
                                    --momentum {momentum}"

  # Use random search to optimize hyperparams of the train entry_point.
  random:
    parameters:
      training_data: {type: string, default: "https://raw.githubusercontent.com/mlflow/mlflow/master/tests/datasets/winequality-white.csv"}
      max_runs: {type: int, default: 8}
      max_p: {type: int, default: 2}
      epochs: {type: int, default: 32}
      metric: {type: string, default: "rmse"}
      seed: {type: int, default: 97531}
    command: "python search_random.py  {training_data}
                                             --max-runs {max_runs}
                                             --max-p {max_p}
                                             --epochs {epochs}
                                             --metric {metric}
                                             --seed {seed}"

  # Use Hyperopt to optimize hyperparams of the train entry_point.
  hyperopt:
    parameters:
      training_data: {type: string, default: "https://raw.githubusercontent.com/mlflow/mlflow/master/tests/datasets/winequality-white.csv"}
      max_runs: {type: int, default: 12}
      epochs: {type: int, default: 32}
      metric: {type: string, default: "rmse"}
      algo: {type: string, default: "tpe.suggest"}
      seed: {type: int, default: 97531}
    command: "python -O search_hyperopt.py {training_data}
                                                 --max-runs {max_runs}
                                                 --epochs {epochs}
                                                 --metric {metric}
                                                 --algo {algo}
                                                 --seed {seed}"

  main:
    parameters:
      training_data: {type: string, default: "https://raw.githubusercontent.com/mlflow/mlflow/master/tests/datasets/winequality-white.csv"}
    command: "python search_random.py {training_data}"
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/examples/hyperparam/python_env.yaml

```yaml
build_dependencies:
  - pip
dependencies:
  - numpy
  - click
  - pandas
  - scipy
  - scikit-learn
  - tensorflow==2.10.0
  - matplotlib
  - mlflow>=1.6
  - hyperopt
  - protobuf<4.0.0
```

--------------------------------------------------------------------------------

---[FILE: README.rst]---
Location: mlflow-master/examples/hyperparam/README.rst

```text
Hyperparameter Tuning Example
------------------------------

Example of how to do hyperparameter tuning with MLflow and some popular optimization libraries.

This example tries to optimize the RMSE metric of a Keras deep learning model on a wine quality
dataset. The Keras model is fitted by the ``train`` entry point and has two hyperparameters that we
try to optimize: ``learning-rate`` and ``momentum``. The input dataset is split into three parts: training,
validation, and test. The training dataset is used to fit the model and the validation dataset is used to
select the best hyperparameter values, and the test set is used to evaluate expected performance and
to verify that we did not overfit on the particular training and validation combination. All three
metrics are logged with MLflow and you can use the MLflow UI to inspect how they vary between different
hyperparameter values.

examples/hyperparam/MLproject has 4 targets:
  * train:
    train a simple deep learning model on the wine-quality dataset from our tutorial.
    It has 2 tunable hyperparameters: ``learning-rate`` and ``momentum``.
    Contains examples of how Keras callbacks can be used for MLflow integration.
  * random:
    perform simple random search over the parameter space.
  * hyperopt:
    use `Hyperopt <https://github.com/hyperopt/hyperopt>`_ to optimize hyperparameters.


Running this Example
^^^^^^^^^^^^^^^^^^^^

You can run any of the targets as a standard MLflow run.

.. code-block:: bash

    mlflow experiments create -n individual_runs

Creates experiment for individual runs and return its experiment ID.

.. code-block:: bash

    mlflow experiments create -n hyper_param_runs

Creates an experiment for hyperparam runs and return its experiment ID.

.. code-block:: bash

    mlflow run -e train --experiment-id <individual_runs_experiment_id> examples/hyperparam

Runs the Keras deep learning training with default parameters and log it in experiment 1.

.. code-block:: bash

    mlflow run -e random --experiment-id <hyperparam_experiment_id> examples/hyperparam

.. code-block:: bash

    mlflow run -e hyperopt --experiment-id <hyperparam_experiment_id> examples/hyperparam

Runs the hyperparameter tuning with either random search or Hyperopt and log the
results under ``hyperparam_experiment_id``.

You can compare these results by using ``mlflow server``.
```

--------------------------------------------------------------------------------

---[FILE: search_hyperopt.py]---
Location: mlflow-master/examples/hyperparam/search_hyperopt.py

```python
"""
Example of hyperparameter search in MLflow using Hyperopt.

The run method will instantiate and run Hyperopt optimizer. Each parameter configuration is
evaluated in a new MLflow run invoking main entry point with selected parameters.

The runs are evaluated based on validation set loss. Test set score is calculated to verify the
results.


This example currently does not support parallel execution.
"""

import click
import numpy as np
from hyperopt import fmin, hp, rand, tpe

import mlflow.projects
from mlflow.tracking import MlflowClient

_inf = np.finfo(np.float64).max


@click.command(
    help="Perform hyperparameter search with Hyperopt library. Optimize dl_train target."
)
@click.option("--max-runs", type=click.INT, default=10, help="Maximum number of runs to evaluate.")
@click.option("--epochs", type=click.INT, default=500, help="Number of epochs")
@click.option("--metric", type=click.STRING, default="rmse", help="Metric to optimize on.")
@click.option("--algo", type=click.STRING, default="tpe.suggest", help="Optimizer algorithm.")
@click.option("--seed", type=click.INT, default=97531, help="Seed for the random generator")
@click.argument("training_data")
def train(training_data, max_runs, epochs, metric, algo, seed):
    """
    Run hyperparameter optimization.
    """
    # create random file to store run ids of the training tasks
    tracking_client = MlflowClient()

    def new_eval(
        nepochs, experiment_id, null_train_loss, null_valid_loss, null_test_loss, return_all=False
    ):
        """
        Create a new eval function

        Args:
            nepochs: Number of epochs to train the model.
            experiment_id: Experiment id for the training run.
            null_train_loss: Loss of a null model on the training dataset.
            null_valid_loss: Loss of a null model on the validation dataset.
            null_test_loss Loss of a null model on the test dataset.
            return_all: If True, return train, validation, and test loss.
                Otherwise, return only the validation loss.
                Default is False.

        Returns:
            An evaluation function that trains the model and logs metrics to MLflow.
        """

        def eval(params):
            """
            Train Keras model with given parameters by invoking MLflow run.

            Notice we store runUuid and resulting metric in a file. We will later use these to pick
            the best run and to log the runUuids of the child runs as an artifact. This is a
            temporary workaround until MLflow offers better mechanism of linking runs together.

            Args:
                params: Parameters to the train_keras script we optimize over:
                    learning_rate, drop_out_1

            Returns:
                The metric value evaluated on the validation data.
            """
            import mlflow.tracking

            lr, momentum = params
            with mlflow.start_run(nested=True) as child_run:
                p = mlflow.projects.run(
                    uri=".",
                    entry_point="train",
                    run_id=child_run.info.run_id,
                    parameters={
                        "training_data": training_data,
                        "epochs": str(nepochs),
                        "learning_rate": str(lr),
                        "momentum": str(momentum),
                        "seed": seed,
                    },
                    experiment_id=experiment_id,
                    synchronous=False,  # Allow the run to fail if a model is not properly created
                )
                succeeded = p.wait()
                mlflow.log_params({"lr": lr, "momentum": momentum})

            if succeeded:
                training_run = tracking_client.get_run(p.run_id)
                metrics = training_run.data.metrics
                # cap the loss at the loss of the null model
                train_loss = min(null_train_loss, metrics[f"train_{metric}"])
                valid_loss = min(null_valid_loss, metrics[f"val_{metric}"])
                test_loss = min(null_test_loss, metrics[f"test_{metric}"])
            else:
                # run failed => return null loss
                tracking_client.set_terminated(p.run_id, "FAILED")
                train_loss = null_train_loss
                valid_loss = null_valid_loss
                test_loss = null_test_loss

            mlflow.log_metrics(
                {
                    f"train_{metric}": train_loss,
                    f"val_{metric}": valid_loss,
                    f"test_{metric}": test_loss,
                }
            )

            if return_all:
                return train_loss, valid_loss, test_loss
            else:
                return valid_loss

        return eval

    space = [
        hp.uniform("lr", 1e-5, 1e-1),
        hp.uniform("momentum", 0.0, 1.0),
    ]

    with mlflow.start_run() as run:
        experiment_id = run.info.experiment_id
        # Evaluate null model first.
        train_null_loss, valid_null_loss, test_null_loss = new_eval(
            0, experiment_id, _inf, _inf, _inf, True
        )(params=[0, 0])
        best = fmin(
            fn=new_eval(epochs, experiment_id, train_null_loss, valid_null_loss, test_null_loss),
            space=space,
            algo=tpe.suggest if algo == "tpe.suggest" else rand.suggest,
            max_evals=max_runs,
        )
        mlflow.set_tag("best params", str(best))
        # find the best run, log its metrics as the final metrics of this run.
        client = MlflowClient()
        runs = client.search_runs(
            [experiment_id], f"tags.mlflow.parentRunId = '{run.info.run_id}' "
        )
        best_val_train = _inf
        best_val_valid = _inf
        best_val_test = _inf
        best_run = None
        for r in runs:
            if r.data.metrics["val_rmse"] < best_val_valid:
                best_run = r
                best_val_train = r.data.metrics["train_rmse"]
                best_val_valid = r.data.metrics["val_rmse"]
                best_val_test = r.data.metrics["test_rmse"]
        mlflow.set_tag("best_run", best_run.info.run_id)
        mlflow.log_metrics(
            {
                f"train_{metric}": best_val_train,
                f"val_{metric}": best_val_valid,
                f"test_{metric}": best_val_test,
            }
        )


if __name__ == "__main__":
    train()
```

--------------------------------------------------------------------------------

---[FILE: search_random.py]---
Location: mlflow-master/examples/hyperparam/search_random.py

```python
"""
Example of hyperparameter search in MLflow using simple random search.

The run method will evaluate random combinations of parameters in a new MLflow run.

The runs are evaluated based on validation set loss. Test set score is calculated to verify the
results.

Several runs can be run in parallel.
"""

from concurrent.futures import ThreadPoolExecutor

import click
import numpy as np

import mlflow
import mlflow.projects
import mlflow.sklearn
import mlflow.tracking
from mlflow.tracking import MlflowClient

_inf = np.finfo(np.float64).max


@click.command(help="Perform grid search over train (main entry point).")
@click.option("--max-runs", type=click.INT, default=32, help="Maximum number of runs to evaluate.")
@click.option("--max-p", type=click.INT, default=1, help="Maximum number of parallel runs.")
@click.option("--epochs", type=click.INT, default=32, help="Number of epochs")
@click.option("--metric", type=click.STRING, default="rmse", help="Metric to optimize on.")
@click.option("--seed", type=click.INT, default=97531, help="Seed for the random generator")
@click.argument("training_data")
def run(training_data, max_runs, max_p, epochs, metric, seed):
    train_metric = f"train_{metric}"
    val_metric = f"val_{metric}"
    test_metric = f"test_{metric}"
    np.random.seed(seed)
    tracking_client = MlflowClient()

    def new_eval(
        nepochs, experiment_id, null_train_loss=_inf, null_val_loss=_inf, null_test_loss=_inf
    ):
        def eval(params):
            lr, momentum = params
            with mlflow.start_run(nested=True) as child_run:
                p = mlflow.projects.run(
                    run_id=child_run.info.run_id,
                    uri=".",
                    entry_point="train",
                    parameters={
                        "training_data": training_data,
                        "epochs": str(nepochs),
                        "learning_rate": str(lr),
                        "momentum": str(momentum),
                        "seed": str(seed),
                    },
                    experiment_id=experiment_id,
                    synchronous=False,
                )
                succeeded = p.wait()
                mlflow.log_params({"lr": lr, "momentum": momentum})
            if succeeded:
                training_run = tracking_client.get_run(p.run_id)
                metrics = training_run.data.metrics
                # cap the loss at the loss of the null model
                train_loss = min(null_train_loss, metrics[train_metric])
                val_loss = min(null_val_loss, metrics[val_metric])
                test_loss = min(null_test_loss, metrics[test_metric])
            else:
                # run failed => return null loss
                tracking_client.set_terminated(p.run_id, "FAILED")
                train_loss = null_train_loss
                val_loss = null_val_loss
                test_loss = null_test_loss
            mlflow.log_metrics(
                {
                    f"train_{metric}": train_loss,
                    f"val_{metric}": val_loss,
                    f"test_{metric}": test_loss,
                }
            )
            return p.run_id, train_loss, val_loss, test_loss

        return eval

    with mlflow.start_run() as run:
        experiment_id = run.info.experiment_id
        _, null_train_loss, null_val_loss, null_test_loss = new_eval(0, experiment_id)((0, 0))
        runs = [(np.random.uniform(1e-5, 1e-1), np.random.uniform(0, 1.0)) for _ in range(max_runs)]
        with ThreadPoolExecutor(max_workers=max_p) as executor:
            _ = executor.map(
                new_eval(epochs, experiment_id, null_train_loss, null_val_loss, null_test_loss),
                runs,
            )

        # find the best run, log its metrics as the final metrics of this run.
        client = MlflowClient()
        runs = client.search_runs(
            [experiment_id], f"tags.mlflow.parentRunId = '{run.info.run_id}' "
        )
        best_val_train = _inf
        best_val_valid = _inf
        best_val_test = _inf
        best_run = None
        for r in runs:
            if r.data.metrics["val_rmse"] < best_val_valid:
                best_run = r
                best_val_train = r.data.metrics["train_rmse"]
                best_val_valid = r.data.metrics["val_rmse"]
                best_val_test = r.data.metrics["test_rmse"]
        mlflow.set_tag("best_run", best_run.info.run_id)
        mlflow.log_metrics(
            {
                f"train_{metric}": best_val_train,
                f"val_{metric}": best_val_valid,
                f"test_{metric}": best_val_test,
            }
        )


if __name__ == "__main__":
    run()
```

--------------------------------------------------------------------------------

---[FILE: train.py]---
Location: mlflow-master/examples/hyperparam/train.py

```python
"""
Train a simple Keras DL model on the dataset used in MLflow tutorial (wine-quality.csv).

Dataset is split into train (~ 0.56), validation(~ 0.19) and test (0.25).
Validation data is used to select the best hyperparameters, test set performance is evaluated only
at epochs which improved performance on the validation dataset. The model with best validation set
performance is logged with MLflow.
"""

import math
import warnings

import click
import numpy as np
import pandas as pd
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split
from tensorflow import keras
from tensorflow.keras.callbacks import Callback
from tensorflow.keras.layers import Dense, Lambda
from tensorflow.keras.models import Sequential
from tensorflow.keras.optimizers import SGD

import mlflow
from mlflow.models import infer_signature


def eval_and_log_metrics(prefix, actual, pred, epoch):
    rmse = np.sqrt(mean_squared_error(actual, pred))
    mlflow.log_metric(f"{prefix}_rmse", rmse, step=epoch)
    return rmse


def get_standardize_f(train):
    mu = np.mean(train, axis=0)
    std = np.std(train, axis=0)
    return lambda x: (x - mu) / std


class MlflowCheckpoint(Callback):
    """
    Example of Keras MLflow logger.
    Logs training metrics and final model with MLflow.

    We log metrics provided by Keras during training and keep track of the best model (best loss
    on validation dataset). Every improvement of the best model is also evaluated on the test set.

    At the end of the training, log the best model with MLflow.
    """

    def __init__(self, test_x, test_y, loss="rmse"):
        self._test_x = test_x
        self._test_y = test_y
        self.train_loss = f"train_{loss}"
        self.val_loss = f"val_{loss}"
        self.test_loss = f"test_{loss}"
        self._best_train_loss = math.inf
        self._best_val_loss = math.inf
        self._best_model = None
        self._next_step = 0

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """
        Log the best model at the end of the training run.
        """
        if not self._best_model:
            raise Exception("Failed to build any model")
        mlflow.log_metric(self.train_loss, self._best_train_loss, step=self._next_step)
        mlflow.log_metric(self.val_loss, self._best_val_loss, step=self._next_step)
        predictions = self._best_model.predict(self._test_x)
        signature = infer_signature(self._test_x, predictions)
        mlflow.tensorflow.log_model(self._best_model, name="model", signature=signature)

    def on_epoch_end(self, epoch, logs=None):
        """
        Log Keras metrics with MLflow. If model improved on the validation data, evaluate it on
        a test set and store it as the best model.
        """
        if not logs:
            return
        self._next_step = epoch + 1
        train_loss = logs["loss"]
        val_loss = logs["val_loss"]
        mlflow.log_metrics({self.train_loss: train_loss, self.val_loss: val_loss}, step=epoch)

        if val_loss < self._best_val_loss:
            # The result improved in the validation set.
            # Log the model with mlflow and also evaluate and log on test set.
            self._best_train_loss = train_loss
            self._best_val_loss = val_loss
            self._best_model = keras.models.clone_model(self.model)
            self._best_model.set_weights([x.copy() for x in self.model.get_weights()])
            preds = self._best_model.predict(self._test_x)
            eval_and_log_metrics("test", self._test_y, preds, epoch)


@click.command(
    help="Trains an Keras model on wine-quality dataset. "
    "The input is expected in csv format. "
    "The model and its metrics are logged with mlflow."
)
@click.option("--epochs", type=click.INT, default=100, help="Maximum number of epochs to evaluate.")
@click.option(
    "--batch-size", type=click.INT, default=16, help="Batch size passed to the learning algo."
)
@click.option("--learning-rate", type=click.FLOAT, default=1e-2, help="Learning rate.")
@click.option("--momentum", type=click.FLOAT, default=0.9, help="SGD momentum.")
@click.option("--seed", type=click.INT, default=97531, help="Seed for the random generator.")
@click.argument("training_data")
def run(training_data, epochs, batch_size, learning_rate, momentum, seed):
    warnings.filterwarnings("ignore")
    data = pd.read_csv(training_data, sep=";")
    # Split the data into training and test sets. (0.75, 0.25) split.
    train, test = train_test_split(data, random_state=seed)
    train, valid = train_test_split(train, random_state=seed)
    # The predicted column is "quality" which is a scalar from [3, 9]
    train_x = train.drop(["quality"], axis=1).astype("float32").values
    train_y = train[["quality"]].astype("float32").values
    valid_x = valid.drop(["quality"], axis=1).astype("float32").values

    valid_y = valid[["quality"]].astype("float32").values

    test_x = test.drop(["quality"], axis=1).astype("float32").values
    test_y = test[["quality"]].astype("float32").values

    with mlflow.start_run():
        if epochs == 0:  # score null model
            eval_and_log_metrics(
                "train", train_y, np.ones(len(train_y)) * np.mean(train_y), epoch=-1
            )
            eval_and_log_metrics("val", valid_y, np.ones(len(valid_y)) * np.mean(valid_y), epoch=-1)
            eval_and_log_metrics("test", test_y, np.ones(len(test_y)) * np.mean(test_y), epoch=-1)
        else:
            with MlflowCheckpoint(test_x, test_y) as mlflow_logger:
                model = Sequential()
                model.add(Lambda(get_standardize_f(train_x)))
                model.add(
                    Dense(
                        train_x.shape[1],
                        activation="relu",
                        kernel_initializer="normal",
                        input_shape=(train_x.shape[1],),
                    )
                )
                model.add(Dense(16, activation="relu", kernel_initializer="normal"))
                model.add(Dense(16, activation="relu", kernel_initializer="normal"))
                model.add(Dense(1, kernel_initializer="normal", activation="linear"))
                model.compile(
                    loss="mean_squared_error",
                    optimizer=SGD(lr=learning_rate, momentum=momentum),
                    metrics=[],
                )

                model.fit(
                    train_x,
                    train_y,
                    batch_size=batch_size,
                    epochs=epochs,
                    verbose=1,
                    validation_data=(valid_x, valid_y),
                    callbacks=[mlflow_logger],
                )


if __name__ == "__main__":
    run()
```

--------------------------------------------------------------------------------

---[FILE: export.py]---
Location: mlflow-master/examples/johnsnowlabs/export.py

```python
import json
import os

import pandas as pd
from johnsnowlabs import nlp

import mlflow
from mlflow.pyfunc import spark_udf

# 1) Write your raw license.json string into the 'JOHNSNOWLABS_LICENSE_JSON' env variable for MLflow
creds = {
    "AWS_ACCESS_KEY_ID": "...",
    "AWS_SECRET_ACCESS_KEY": "...",
    "SPARK_NLP_LICENSE": "...",
    "SECRET": "...",
}
os.environ["JOHNSNOWLABS_LICENSE_JSON"] = json.dumps(creds)

# 2) Install enterprise libraries
nlp.install()
# 3) Start a Spark session with enterprise libraries
spark = nlp.start()

# 4) Load a model and test it
nlu_model = "en.classify.bert_sequence.covid_sentiment"
model_save_path = "my_model"
johnsnowlabs_model = nlp.load(nlu_model)
johnsnowlabs_model.predict(["I hate COVID,", "I love COVID"])

# 5) Export model with pyfunc and johnsnowlabs flavors
with mlflow.start_run():
    model_info = mlflow.johnsnowlabs.log_model(johnsnowlabs_model, name=model_save_path)

# 6) Load model with johnsnowlabs flavor
mlflow.johnsnowlabs.load_model(model_info.model_uri)

# 7) Load model with pyfunc flavor
mlflow.pyfunc.load_model(model_save_path)

pandas_df = pd.DataFrame({"text": ["Hello World"]})
spark_df = spark.createDataFrame(pandas_df).coalesce(1)
pyfunc_udf = spark_udf(
    spark=spark,
    model_uri=model_save_path,
    env_manager="virtualenv",
    result_type="string",
)
new_df = spark_df.withColumn("prediction", pyfunc_udf(*pandas_df.columns))

# 9) You can now use the mlflow models serve command to serve the model see next section

# 10)  You can also use x command to deploy model inside of a container see next section
```

--------------------------------------------------------------------------------

---[FILE: jwt_auth.py]---
Location: mlflow-master/examples/jwt_auth/jwt_auth.py
Signals: Flask

```python
"""Sample JWT authentication module for testing purposes.

NOT SUITABLE FOR PRODUCTION USE.
"""

import logging

import jwt
from flask import Response, make_response, request
from werkzeug.datastructures import Authorization

BEARER_PREFIX = "bearer "

_logger = logging.getLogger(__name__)


def authenticate_request() -> Authorization | Response:
    _logger.debug("Getting token")
    error_response = make_response()
    error_response.status_code = 401
    error_response.set_data(
        "You are not authenticated. Please provide a valid JWT Bearer token with the request."
    )
    error_response.headers["WWW-Authenticate"] = 'Bearer error="invalid_token"'

    token = request.headers.get("Authorization")
    if token is not None and token.lower().startswith(BEARER_PREFIX):
        token = token[len(BEARER_PREFIX) :]  # Remove prefix
        try:
            # NOTE:
            # - This is a sample implementation for testing purposes only.
            # - Here we're using a hardcoded key, which is not secure.
            # - We also aren't validating that the user exists.
            token_info = jwt.decode(token, "secret", algorithms=["HS256"])
            if not token_info:  # pragma: no cover
                _logger.warning("No token_info returned")
                return error_response

            return Authorization(auth_type="jwt", data=token_info)
        except jwt.exceptions.InvalidTokenError:
            pass

    _logger.warning("Missing or invalid authorization token")
    return error_response
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/examples/jwt_auth/__init__.py

```python
"""The jwt_auth.py example in this module directory is also used by
tests/server/auth/test_auth.py.
"""
```

--------------------------------------------------------------------------------

---[FILE: train.py]---
Location: mlflow-master/examples/keras/train.py

```python
"""Trains and evaluate a simple MLP
on the Reuters newswire topic classification task.
"""

import numpy as np
from tensorflow import keras
from tensorflow.keras.datasets import reuters
from tensorflow.keras.layers import Activation, Dense, Dropout
from tensorflow.keras.models import Sequential
from tensorflow.keras.preprocessing.text import Tokenizer

# The following import and function call are the only additions to code required
# to automatically log metrics and parameters to MLflow.
import mlflow

mlflow.tensorflow.autolog()

max_words = 1000
batch_size = 32
epochs = 5

print("Loading data...")
(x_train, y_train), (x_test, y_test) = reuters.load_data(num_words=max_words, test_split=0.2)

print(len(x_train), "train sequences")
print(len(x_test), "test sequences")

num_classes = np.max(y_train) + 1
print(num_classes, "classes")

print("Vectorizing sequence data...")
tokenizer = Tokenizer(num_words=max_words)
x_train = tokenizer.sequences_to_matrix(x_train, mode="binary")
x_test = tokenizer.sequences_to_matrix(x_test, mode="binary")
print("x_train shape:", x_train.shape)
print("x_test shape:", x_test.shape)

print("Convert class vector to binary class matrix (for use with categorical_crossentropy)")
y_train = keras.utils.to_categorical(y_train, num_classes)
y_test = keras.utils.to_categorical(y_test, num_classes)
print("y_train shape:", y_train.shape)
print("y_test shape:", y_test.shape)

print("Building model...")
model = Sequential()
model.add(Dense(512, input_shape=(max_words,)))
model.add(Activation("relu"))
model.add(Dropout(0.5))
model.add(Dense(num_classes))
model.add(Activation("softmax"))

model.compile(loss="categorical_crossentropy", optimizer="adam", metrics=["accuracy"])

history = model.fit(
    x_train, y_train, batch_size=batch_size, epochs=epochs, verbose=1, validation_split=0.1
)
score = model.evaluate(x_test, y_test, batch_size=batch_size, verbose=1)
print("Test score:", score[0])
print("Test accuracy:", score[1])
```

--------------------------------------------------------------------------------

---[FILE: chain_as_code.py]---
Location: mlflow-master/examples/langchain/chain_as_code.py

```python
# This example demonstrates defining a model directly from code.
# This feature allows for defining model logic within a python script, module, or notebook that is stored
# directly as serialized code, as opposed to object serialization that would otherwise occur when saving
# or logging a model object.
# This script defines the model's logic and specifies which class within the file contains the model code.
# The companion example to this, chain_as_code_driver.py, is the driver code that performs the  logging and
# loading of this model definition.

import os
from operator import itemgetter

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableLambda
from langchain_openai import OpenAI

import mlflow

mlflow.langchain.autolog()

assert "OPENAI_API_KEY" in os.environ, "Please set the OPENAI_API_KEY environment variable."


# Return the string contents of the most recent message from the user
def extract_user_query_string(chat_messages_array):
    return chat_messages_array[-1]["content"]


# Return the chat history, which is is everything before the last question
def extract_chat_history(chat_messages_array):
    return chat_messages_array[:-1]


prompt = PromptTemplate(
    template="You are a hello world bot.  Respond with a reply to the user's question that is fun and interesting to the user.  User's question: {question}",
    input_variables=["question"],
)

model = OpenAI(temperature=0.9)

chain = (
    {
        "question": itemgetter("messages") | RunnableLambda(extract_user_query_string),
        "chat_history": itemgetter("messages") | RunnableLambda(extract_chat_history),
    }
    | prompt
    | model
    | StrOutputParser()
)

question = {
    "messages": [
        {
            "role": "user",
            "content": "what is rag?",
        },
    ]
}

chain.invoke(question)

# IMPORTANT: The model code needs to call `mlflow.models.set_model()` to set the model,
# which will be loaded back using `mlflow.langchain.load_model` for inference.
mlflow.models.set_model(model=chain)
```

--------------------------------------------------------------------------------

---[FILE: chain_as_code_driver.py]---
Location: mlflow-master/examples/langchain/chain_as_code_driver.py

```python
# This is an example for logging a Langchain model from code using the
# mlflow.langchain.log_model API. When a path to a valid Python script is submitted to the
# lc_model argument, the model code itself is serialized instead of the model object.
# Within the targeted script, the model implementation must be defined and set by
# using the mlflow.models.set_model API.

import mlflow

input_example = {
    "messages": [
        {
            "role": "user",
            "content": "What is Retrieval-augmented Generation?",
        }
    ]
}

# Specify the path to the chain notebook
chain_path = "chain_as_code.py"

print(f"Chain path: {chain_path}")

print("Logging model as code using Langchain log model API")
with mlflow.start_run():
    logged_chain_info = mlflow.langchain.log_model(
        lc_model=chain_path,
        name="chain",
        input_example=input_example,
    )

print("Loading model using Langchain load model API")
model = mlflow.langchain.load_model(logged_chain_info.model_uri)
output = model.invoke(input_example)
print(f"Output: {output}")

print("Loading model using Pyfunc load model API")
pyfunc_model = mlflow.pyfunc.load_model(logged_chain_info.model_uri)
output = pyfunc_model.predict([input_example])
print(f"Output: {output}")
```

--------------------------------------------------------------------------------

````
