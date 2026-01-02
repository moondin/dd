---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 199
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 199 of 991)

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

---[FILE: train_simple.py]---
Location: mlflow-master/examples/rapids/mlflow_project/src/rf_test/train_simple.py

```python
"""Simple example integrating cuML with MLflow"""

import argparse

from cuml.ensemble import RandomForestClassifier
from cuml.metrics.accuracy import accuracy_score
from cuml.preprocessing.model_selection import train_test_split

import mlflow
import mlflow.sklearn
from mlflow.models import infer_signature


def load_data(fpath):
    """
    Simple helper function for loading data to be used by CPU/GPU models.

    Args:
        fpath: Path to the data to be ingested

    Returns:
        DataFrame wrapping the data at [fpath]. Data will be in either a Pandas or RAPIDS (cuDF) DataFrame
    """
    import cudf

    df = cudf.read_csv(fpath)
    X = df.drop(["target"], axis=1)
    y = df["target"].astype("int32")

    return train_test_split(X, y, test_size=0.2)


def train(fpath, max_depth, max_features, n_estimators):
    """
    Train a Random Forest classifier with the specified hyperparameters.

    Args:
        fpath: Path or URL for the training data used with the model.
        max_depth: Maximum depth of the trees in the Random Forest.
        max_features: Number of features to consider when looking for the best split.
        n_estimators: Number of trees in the Random Forest.

    Returns:
        A tuple containing the trained Random Forest model and the inferred model signature.
    """
    X_train, X_test, y_train, y_test = load_data(fpath)

    mod = RandomForestClassifier(
        max_depth=max_depth, max_features=max_features, n_estimators=n_estimators
    )

    mod.fit(X_train, y_train)
    preds = mod.predict(X_test)
    acc = accuracy_score(y_test, preds)

    mlparams = {
        "max_depth": str(max_depth),
        "max_features": str(max_features),
        "n_estimators": str(n_estimators),
    }
    mlflow.log_params(mlparams)

    mlflow.log_metric("accuracy", acc)

    predictions = mod.predict(X_train)
    sig = infer_signature(X_train, predictions)

    mlflow.sklearn.log_model(mod, name="saved_models", signature=sig)

    return mod, sig


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--algo", default="tpe", choices=["tpe"], type=str)
    parser.add_argument("--conda-env", required=True, type=str)
    parser.add_argument("--fpath", required=True, type=str)
    parser.add_argument("--n_estimators", type=int, default=100)
    parser.add_argument("--max_features", type=float, default=1.0)
    parser.add_argument("--max_depth", type=int, default=12)

    args = parser.parse_args()

    experid = 0

    artifact_path = "Airline-Demo"
    artifact_uri = None
    experiment_name = "RAPIDS-CLI"
    experiment_id = None

    mlflow.set_tracking_uri(uri="sqlite:////tmp/mlflow-db.sqlite")
    with mlflow.start_run(run_name="RAPIDS-MLflow"):
        model, signature = train(args.fpath, args.max_depth, args.max_features, args.n_estimators)

        mlflow.sklearn.log_model(
            model,
            name=artifact_path,
            registered_model_name="rapids_mlflow_cli",
            conda_env="conda.yaml",
            signature=signature,
        )
        artifact_uri = mlflow.get_artifact_uri(artifact_path=artifact_path)

    print(f"Model uri: {artifact_uri}")
```

--------------------------------------------------------------------------------

---[FILE: input.json]---
Location: mlflow-master/examples/ray_serve/input.json

```json
[[4.6, 3.1, 1.5, 0.2]]
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/ray_serve/README.md

```text
# MLflow-Ray-Serve deployment plugin

In this example, we will first train a model to classify the Iris dataset using `sklearn`. Next, we will deploy our model on Ray Serve and then scale it up, all using the MLflow Ray Serve plugin.

The plugin supports both a command line interface and a Python API. Below we will use the command line interface. For the full API documentation, see https://www.mlflow.org/docs/latest/cli.html#mlflow-deployments and https://www.mlflow.org/docs/latest/python_api/mlflow.deployments.html.

## Plugin Installation

Please follow the installation instructions for the Ray Serve deployment plugin: https://github.com/ray-project/mlflow-ray-serve

## Instructions

First, navigate to the directory for this example, `mlflow/examples/ray_serve/`.

Second, run `python train_model.py`. This trains and saves our classifier to the MLflow Model Registry and sets up automatic logging to MLflow. It also prints the mean squared error and the target names, which are species of iris:

```
MSE: 1.04
Target names:  ['setosa' 'versicolor' 'virginica']
```

Next, set the MLflow Tracking URI environment variable to the location where the Model Registry resides:

`export MLFLOW_TRACKING_URI=sqlite:///mlruns.db`

Now start a Ray cluster with the following command:

`ray start --head`

Next, start a long-running Ray Serve instance on your Ray cluster:

`serve start`

Ray Serve is now running and ready to deploy MLflow models. The MLflow Ray Serve plugin features both a Python API as well as a command-line interface. For this example, we'll use the command line interface.

Finally, we can deploy our model by creating an instance using the following command:

`mlflow deployments create -t ray-serve -m models:/RayMLflowIntegration/1 --name iris:v1`

The `-t` parameter here is the deployment target, which in our case is Ray Serve. The `-m` parameter is the Model URI, which consists of the registered model name and version in the Model Registry.

We can now run a prediction on our deployed model as follows. The file `input.json` contains a sample input containing the sepal length, sepal width, petal length, petal width of a sample flower. Now we can get the prediction using the following command:

`mlflow deployments predict -t ray-serve --name iris:v1 --input-path input.json`

This will output `[0]`, `[1]`, or `[2]`, corresponding to the species listed above in the target names.

We can scale our deployed model up to use several replicas, improving throughput:

`mlflow deployments update -t ray-serve --name iris:v1 --config num_replicas=2`

Here we only used 2 replicas, but you can use as many as you like, depending on how many CPU cores are available in your Ray cluster.

The deployed model instance can be deleted as follows:

`mlflow deployments delete -t ray-serve --name iris:v1`

To tear down the Ray cluster, run the following command:

`ray stop`
```

--------------------------------------------------------------------------------

---[FILE: train_model.py]---
Location: mlflow-master/examples/ray_serve/train_model.py

```python
from sklearn.datasets import load_iris
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import mean_squared_error
from sklearn.utils import shuffle

import mlflow

if __name__ == "__main__":
    # Enable auto-logging
    mlflow.set_tracking_uri("sqlite:///mlruns.db")
    mlflow.sklearn.autolog()

    # Load data
    iris_dataset = load_iris()
    data = iris_dataset["data"]
    target = iris_dataset["target"]
    target_names = iris_dataset["target_names"]

    # Instantiate model
    model = GradientBoostingClassifier()

    # Split training and validation data
    data, target = shuffle(data, target)
    train_x = data[:100]
    train_y = target[:100]
    val_x = data[100:]
    val_y = target[100:]

    # Train and evaluate model
    model.fit(train_x, train_y)
    run_id = mlflow.last_active_run().info.run_id
    print("MSE:", mean_squared_error(model.predict(val_x), val_y))
    print("Target names: ", target_names)
    print(f"run_id: {run_id}")

    # Register the auto-logged model
    model_uri = f"runs:/{run_id}/model"
    registered_model_name = "RayMLflowIntegration"
    mv = mlflow.register_model(model_uri, registered_model_name)
    print(f"Name: {mv.name}")
    print(f"Version: {mv.version}")
```

--------------------------------------------------------------------------------

---[FILE: remote_server.py]---
Location: mlflow-master/examples/remote_store/remote_server.py

```python
import os
import random
import shutil
import sys
import tempfile

from mlflow import (
    MlflowClient,
    active_run,
    get_artifact_uri,
    get_tracking_uri,
    log_artifact,
    log_artifacts,
    log_metric,
    log_param,
)

if __name__ == "__main__":
    print(f"Running {sys.argv[0]} with tracking URI {get_tracking_uri()}")
    log_param("param1", 5)
    log_metric("foo", 5)
    log_metric("foo", 6)
    log_metric("foo", 7)
    log_metric("random_int", random.randint(0, 100))
    run_id = active_run().info.run_id
    # Get run metadata & data from the tracking server
    service = MlflowClient()
    run = service.get_run(run_id)
    print(f"Metadata & data for run with UUID {run_id}: {run}")
    local_dir = tempfile.mkdtemp()
    message = "test artifact written during run {} within artifact URI {}\n".format(
        active_run().info.run_id,
        get_artifact_uri(),
    )
    try:
        file_path = os.path.join(local_dir, "some_output_file.txt")
        with open(file_path, "w") as handle:
            handle.write(message)
        log_artifacts(local_dir, "some_subdir")
        log_artifact(file_path, "another_dir")
    finally:
        shutil.rmtree(local_dir)
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/restore_model_dependencies/README.md

```text
### MLflow restore model dependencies examples

The example "restore_model_dependencies_example.ipynb" in this directory illustrates
how you can use the `mlflow.pyfunc.get_model_dependencies` API to get the dependencies from a model URI
and install them, restoring the exact python environment that was used to build the model.

#### Prerequisites

```
pip install scikit-learn
```

#### How to run the example

Use jupyter to load the notebook "restore_model_dependencies_example.ipynb" and run the notebook.
```

--------------------------------------------------------------------------------

---[FILE: restore_model_dependencies_example.ipynb]---
Location: mlflow-master/examples/restore_model_dependencies/restore_model_dependencies_example.ipynb

```text
{
 "cells": [
  {
   "cell_type": "markdown",
   "id": "ec6a8805",
   "metadata": {},
   "source": [
    "# Restore model dependencies with mlflow.pyfunc.get_model_dependencies()"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "70a2b95e",
   "metadata": {},
   "outputs": [],
   "source": [
    "from pathlib import Path\n",
    "\n",
    "from sklearn import datasets\n",
    "from sklearn.neighbors import KNeighborsClassifier\n",
    "\n",
    "import mlflow\n",
    "\n",
    "X, y = datasets.load_iris(as_frame=True, return_X_y=True)\n",
    "model = KNeighborsClassifier()\n",
    "model.fit(X, y)\n",
    "\n",
    "model_path = \"/tmp/sk_model_01\"\n",
    "\n",
    "mlflow.sklearn.save_model(model, model_path)\n",
    "\n",
    "model_requirements_file_path = mlflow.pyfunc.get_model_dependencies(model_path)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "238d6445",
   "metadata": {},
   "outputs": [],
   "source": [
    "print(Path(model_requirements_file_path).read_text())"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "1f9b51b9",
   "metadata": {},
   "outputs": [],
   "source": [
    "%pip install -r $model_requirements_file_path"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "9b0a183b",
   "metadata": {},
   "outputs": [],
   "source": [
    "# In order to enable the environment restored by %pip command above,\n",
    "# you need to manually click the kernel restart button."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "1262da7f",
   "metadata": {},
   "outputs": [],
   "source": [
    "import mlflow\n",
    "\n",
    "model = mlflow.pyfunc.load_model(\"/tmp/sk_model_01\")\n",
    "\n",
    "from sklearn import datasets\n",
    "\n",
    "X, y = datasets.load_iris(as_frame=True, return_X_y=True)\n",
    "result = model.predict(X)\n",
    "\n",
    "print(result)"
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3 (ipykernel)",
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
   "version": "3.8.12"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 5
}
```

--------------------------------------------------------------------------------

---[FILE: mlflow_tracking_rest_api.py]---
Location: mlflow-master/examples/rest_api/mlflow_tracking_rest_api.py

```python
"""
This simple example shows how you could use MLflow REST API to create new
runs inside an experiment to log parameters/metrics.  Using MLflow REST API
instead of MLflow library might be useful to embed in an application where
you don't want to depend on the whole MLflow library, or to make
your own HTTP requests in another programming language (not Python).
For more details on MLflow REST API endpoints check the following page:

https://www.mlflow.org/docs/latest/rest-api.html
"""

import argparse
import os
import pwd

import requests

from mlflow.utils.time import get_current_time_millis

_DEFAULT_USER_ID = "unknown"


class MlflowTrackingRestApi:
    def __init__(self, hostname, port, experiment_id):
        self.base_url = "http://" + hostname + ":" + str(port) + "/api/2.0/mlflow"
        self.experiment_id = experiment_id
        self.run_id = self.create_run()

    def create_run(self):
        """Create a new run for tracking."""
        url = self.base_url + "/runs/create"
        # user_id is deprecated and will be removed from the API in a future release
        payload = {
            "experiment_id": self.experiment_id,
            "start_time": get_current_time_millis(),
            "user_id": _get_user_id(),
        }
        r = requests.post(url, json=payload)
        run_id = None
        if r.status_code == 200:
            run_id = r.json()["run"]["info"]["run_uuid"]
        else:
            print("Creating run failed!")
        return run_id

    def search_experiments(self):
        """Get all experiments."""
        url = self.base_url + "/experiments/search"
        r = requests.get(url)
        experiments = None
        if r.status_code == 200:
            experiments = r.json()["experiments"]
        return experiments

    def log_param(self, param):
        """Log a parameter dict for the given run."""
        url = self.base_url + "/runs/log-parameter"
        payload = {"run_id": self.run_id, "key": param["key"], "value": param["value"]}
        r = requests.post(url, json=payload)
        return r.status_code

    def log_metric(self, metric):
        """Log a metric dict for the given run."""
        url = self.base_url + "/runs/log-metric"
        payload = {
            "run_id": self.run_id,
            "key": metric["key"],
            "value": metric["value"],
            "timestamp": metric["timestamp"],
            "step": metric["step"],
        }
        r = requests.post(url, json=payload)
        return r.status_code


def _get_user_id():
    """Get the ID of the user for the current run."""
    try:
        return pwd.getpwuid(os.getuid())[0]
    except ImportError:
        return _DEFAULT_USER_ID


if __name__ == "__main__":
    # Command-line arguments
    parser = argparse.ArgumentParser(description="MLflow REST API Example")

    parser.add_argument(
        "--hostname",
        type=str,
        default="localhost",
        dest="hostname",
        help="MLflow server hostname/ip (default: localhost)",
    )

    parser.add_argument(
        "--port",
        type=int,
        default=5000,
        dest="port",
        help="MLflow server port number (default: 5000)",
    )

    parser.add_argument(
        "--experiment-id",
        type=int,
        default=0,
        dest="experiment_id",
        help="Experiment ID (default: 0)",
    )

    print("Running mlflow_tracking_rest_api.py")

    args = parser.parse_args()

    mlflow_rest = MlflowTrackingRestApi(args.hostname, args.port, args.experiment_id)
    # Parameter is a key/val pair (str types)
    param = {"key": "alpha", "value": "0.1980"}
    status_code = mlflow_rest.log_param(param)
    if status_code == 200:
        print(
            "Successfully logged parameter: {} with value: {}".format(param["key"], param["value"])
        )
    else:
        print("Logging parameter failed!")
    # Metric is a key/val pair (key/val have str/float types)
    metric = {
        "key": "precision",
        "value": 0.769,
        "timestamp": get_current_time_millis(),
        "step": 1,
    }
    status_code = mlflow_rest.log_metric(metric)
    if status_code == 200:
        print(
            "Successfully logged parameter: {} with value: {}".format(
                metric["key"], metric["value"]
            )
        )
    else:
        print("Logging metric failed!")
```

--------------------------------------------------------------------------------

---[FILE: README.rst]---
Location: mlflow-master/examples/rest_api/README.rst

```text
mlflow REST API Example
-----------------------
This simple example shows how you could use MLflow REST API to create new
runs inside an experiment to log parameters/metrics.

To run this example code do the following:

Open a terminal and navigate to the ``/tmp`` directory and start the mlflow tracking server::

  mlflow server

In another terminal window navigate to the ``mlflow/examples/rest_api`` directory.  Run the example code
with this command::

  python mlflow_tracking_rest_api.py

Program options::

  usage: mlflow_tracking_rest_api.py [-h] [--hostname HOSTNAME] [--port PORT]
                                   [--experiment-id EXPERIMENT_ID]

  MLflow REST API Example

  optional arguments:
    -h, --help            show this help message and exit
    --hostname HOSTNAME   MLflow server hostname/ip (default: localhost)
    --port PORT           MLflow server port number (default: 5000)
    --experiment-id EXPERIMENT_ID
                            Experiment ID (default: 0)
```

--------------------------------------------------------------------------------

---[FILE: train.R]---
Location: mlflow-master/examples/r_wine/train.R

```text
# The data set used in this example is from http://archive.ics.uci.edu/ml/datasets/Wine+Quality
# P. Cortez, A. Cerdeira, F. Almeida, T. Matos and J. Reis.
# Modeling wine preferences by data mining from physicochemical properties. In Decision Support Systems, Elsevier, 47(4):547-553, 2009.

library(mlflow)
library(glmnet)
library(carrier)

set.seed(40)

# Read the wine-quality csv file
data <- read.csv("wine-quality.csv")

# Split the data into training and test sets. (0.75, 0.25) split.
sampled <- sample(1:nrow(data), 0.75 * nrow(data))
train <- data[sampled, ]
test <- data[-sampled, ]

# The predicted column is "quality" which is a scalar from [3, 9]
train_x <- as.matrix(train[, !(names(train) == "quality")])
test_x <- as.matrix(test[, !(names(train) == "quality")])
train_y <- train[, "quality"]
test_y <- test[, "quality"]

alpha <- mlflow_param("alpha", 0.5, "numeric")
lambda <- mlflow_param("lambda", 0.5, "numeric")

with(mlflow_start_run(), {
    model <- glmnet(train_x, train_y, alpha = alpha, lambda = lambda, family= "gaussian", standardize = FALSE)
    predictor <- crate(~ glmnet::predict.glmnet(!!model, as.matrix(.x)), !!model)
    predicted <- predictor(test_x)

    rmse <- sqrt(mean((predicted - test_y) ^ 2))
    mae <- mean(abs(predicted - test_y))
    r2 <- as.numeric(cor(predicted, test_y) ^ 2)

    message("Elasticnet model (alpha=", alpha, ", lambda=", lambda, "):")
    message("  RMSE: ", rmse)
    message("  MAE: ", mae)
    message("  R2: ", r2)

    mlflow_log_param("alpha", alpha)
    mlflow_log_param("lambda", lambda)
    mlflow_log_metric("rmse", rmse)
    mlflow_log_metric("r2", r2)
    mlflow_log_metric("mae", mae)

    mlflow_log_model(predictor, "model")
})
```

--------------------------------------------------------------------------------

---[FILE: train.Rmd]---
Location: mlflow-master/examples/r_wine/train.Rmd

```text
---
title: "R Notebook"
output: html_notebook
---

This notebook complements `train.R` by enabling the same functionality from the MLflow tutorial using an R notebook.

```{r}
library(mlflow)
library(glmnet)

set.seed(40)
```

Read the wine-quality csv file
 
```{r}
data <- read.csv("wine-quality.csv")
```

Split the data into training and test sets. (0.75, 0.25) split.

```{r}
sampled <- sample(1:nrow(data), 0.75 * nrow(data))
train <- data[sampled, ]
test <- data[-sampled, ]
```

The predicted column is "quality" which is a scalar from [3, 9]

```{r}
train_x <- as.matrix(train[, !(names(train) == "quality")])
test_x <- as.matrix(test[, !(names(train) == "quality")])
train_y <- train[, "quality"]
test_y <- test[, "quality"]
```

```{r}
alpha <- mlflow_param("alpha", 0.5, "numeric")
lambda <- mlflow_param("lambda", 0.5, "numeric")
```

```{r}
with(mlflow_start_run(), {
    model <- glmnet(train_x, train_y, alpha = alpha, lambda = lambda, family = "gaussian")
    predictor <- crate(~ glmnet::predict.glmnet(model, as.matrix(.x)), model)
    predicted <- predictor(test_x)

    rmse <- sqrt(mean((predicted - test_y) ^ 2))
    mae <- mean(abs(predicted - test_y))
    r2 <- as.numeric(cor(predicted, test_y) ^ 2)

    message("Elasticnet model (alpha=", alpha, ", lambda=", lambda, "):")
    message("  RMSE: ", rmse)
    message("  MAE: ", mae)
    message("  R2: ", r2)

    mlflow_log_param("alpha", alpha)
    mlflow_log_param("lambda", lambda)
    mlflow_log_metric("rmse", rmse)
    mlflow_log_metric("r2", r2)
    mlflow_log_metric("mae", mae)

    mlflow_log_model(predictor, "model")
})
```
```

--------------------------------------------------------------------------------

````
