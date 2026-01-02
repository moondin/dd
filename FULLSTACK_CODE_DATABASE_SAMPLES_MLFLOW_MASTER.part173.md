---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 173
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 173 of 991)

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

---[FILE: ml.py]---
Location: mlflow-master/examples/demos/mlflow-3/ml.py

```python
# MLflow 3 Traditional ML Example
# In this example, we will first run a model training job, which is tracked as
# an MLflow Run, to produce a trained model, which is tracked as an MLflow Logged Model.
import pandas as pd
from sklearn.datasets import load_iris
from sklearn.linear_model import ElasticNet
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

import mlflow
import mlflow.sklearn
from mlflow.entities import Dataset


# Helper function to compute metrics
def compute_metrics(actual, predicted):
    rmse = mean_squared_error(actual, predicted)
    mae = mean_absolute_error(actual, predicted)
    r2 = r2_score(actual, predicted)
    return rmse, mae, r2


# Load Iris dataset and prepare the DataFrame
iris = load_iris()
iris_df = pd.DataFrame(data=iris.data, columns=iris.feature_names)
iris_df["quality"] = (iris.target == 2).astype(int)  # Create a binary target for simplicity

# Split into training and testing datasets
train_df, test_df = train_test_split(iris_df, test_size=0.2, random_state=42)

# Start a run to represent the training job
with mlflow.start_run() as training_run:
    # Load the training dataset with MLflow. We will link training metrics to this dataset.
    train_dataset: Dataset = mlflow.data.from_pandas(train_df, name="train")
    train_x = train_dataset.df.drop(["quality"], axis=1)
    train_y = train_dataset.df[["quality"]]

    # Fit a model to the training dataset
    lr = ElasticNet(alpha=0.5, l1_ratio=0.5, random_state=42)
    lr.fit(train_x, train_y)

    # Log the model, specifying its ElasticNet parameters (alpha, l1_ratio)
    # As a new feature, the LoggedModel entity is linked to its name and params
    logged_model = mlflow.sklearn.log_model(
        sk_model=lr,
        name="elasticnet",
        params={
            "alpha": 0.5,
            "l1_ratio": 0.5,
        },
        input_example=train_x,
    )

    # Inspect the LoggedModel and its properties
    print(logged_model.model_id, logged_model.params)
    # m-fa4e1bca8cb64971bce2322a8fd427d3, {'alpha': '0.5', 'l1_ratio': '0.5'}

    # Evaluate the model on the training dataset and log metrics
    # These metrics are now linked to the LoggedModel entity
    predictions = lr.predict(train_x)
    (rmse, mae, r2) = compute_metrics(train_y, predictions)
    mlflow.log_metrics(
        metrics={
            "rmse": rmse,
            "r2": r2,
            "mae": mae,
        },
        model_id=logged_model.model_id,
        dataset=train_dataset,
    )

    # Inspect the LoggedModel, now with metrics
    logged_model = mlflow.get_logged_model(logged_model.model_id)
    print(logged_model.model_id, logged_model.metrics)
    # m-fa4e1bca8cb64971bce2322a8fd427d3, [<Metric: dataset_name='train', key='rmse', model_id='m-fa4e1bca8cb64971bce2322a8fd427d3, value=0.7538635773139717, ...>, ...]


# Some time later, when we get a new evaluation dataset based on the latest production data,
# we will run a new model evaluation job, which is tracked as a new MLflow Run,
# to measure the performance of the model on this new dataset.
# This example will produced two MLflow Runs (training_run and evaluation_run) and
# one MLflow Logged Model (elasticnet). From the resulting Logged Model,
# we can see all of the parameters and metadata. We can also see all of the metrics linked
# from the training and evaluation runs.

# Start a run to represent the test dataset evaluation job
with mlflow.start_run() as evaluation_run:
    # Load the test dataset with MLflow. We will link test metrics to this dataset.
    test_dataset: mlflow.entities.Dataset = mlflow.data.from_pandas(test_df, name="test")
    test_x = test_dataset.df.drop(["quality"], axis=1)
    test_y = test_dataset.df[["quality"]]

    # Load the model
    model = mlflow.sklearn.load_model(f"models:/{logged_model.model_id}")

    # Evaluate the model on the training dataset and log metrics, linking to model
    predictions = model.predict(test_x)
    (rmse, mae, r2) = compute_metrics(test_y, predictions)
    mlflow.log_metrics(
        metrics={
            "rmse": rmse,
            "r2": r2,
            "mae": mae,
        },
        dataset=test_dataset,
        model_id=logged_model.model_id,
    )


print(mlflow.get_logged_model(logged_model.model_id).to_dictionary())

# Now register the model.
mlflow.register_model(logged_model.model_uri, name="my_ml_model")
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/demos/mlflow-3/README.md

```text
# MLflow 3 Examples

## Pre-requisites

Before running the examples, run the following command to install mlflow 3.0:

```sh
pip install git+https://github.com/mlflow/mlflow.git@mlflow-3
```
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/deployments/README.md

```text
# MLflow Deployments

The examples provided within this directory show how to get started with MLflow Deployments using:

- Databricks (see the `databricks` subdirectory)
```

--------------------------------------------------------------------------------

---[FILE: databricks.py]---
Location: mlflow-master/examples/deployments/databricks/databricks.py

```python
"""
Usage
-----
databricks secrets create-scope <scope>
databricks secrets put-secret <scope> openai-api-key --string-value $OPENAI_API_KEY
python examples/deployments/databricks.py --secret <scope>/openai-api-key
-----
"""

import argparse
import uuid

from mlflow.deployments import get_deploy_client


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--secret", type=str, help="Secret (e.g. secrets/scope/key)")
    return parser.parse_args()


def main():
    args = parse_args()
    client = get_deploy_client("databricks")
    name = f"test-endpoint-{uuid.uuid4()}"
    client.create_endpoint(
        name=name,
        config={
            "served_entities": [
                {
                    "name": "test",
                    "external_model": {
                        "name": "gpt-4",
                        "provider": "openai",
                        "task": "llm/v1/chat",
                        "openai_config": {
                            "openai_api_key": "{{" + args.secret + "}}",
                        },
                    },
                }
            ],
            "tags": [
                {
                    "key": "foo",
                    "value": "bar",
                }
            ],
            "rate_limits": [
                {
                    "key": "user",
                    "renewal_period": "minute",
                    "calls": 5,
                }
            ],
        },
    )
    try:
        # Update served_entities
        print(
            client.update_endpoint(
                endpoint=name,
                config={
                    "served_entities": [
                        {
                            "name": "test",
                            "external_model": {
                                "name": "gpt-4",
                                "provider": "openai",
                                "task": "llm/v1/chat",
                                "openai_config": {
                                    "openai_api_key": "{{" + args.secret + "}}",
                                },
                            },
                        }
                    ],
                },
            )
        )
        # Update rate_limits
        print(
            client.update_endpoint(
                endpoint=name,
                config={
                    "rate_limits": [
                        {
                            "key": "user",
                            "renewal_period": "minute",
                            "calls": 10,
                        }
                    ],
                },
            )
        )
        print(client.list_endpoints()[:3])
        print(client.get_endpoint(endpoint=name))
        print(
            client.predict(
                endpoint=name,
                inputs={
                    "messages": [
                        {"role": "user", "content": "Hello!"},
                    ],
                    "max_tokens": 128,
                },
            ),
        )
    finally:
        client.delete_endpoint(endpoint=name)


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile]---
Location: mlflow-master/examples/docker/Dockerfile

```text
FROM python:3.8

RUN pip install mlflow azure-storage-blob numpy scipy pandas scikit-learn cloudpickle

COPY train.py .
COPY wine-quality.csv .
```

--------------------------------------------------------------------------------

---[FILE: kubernetes_config.json]---
Location: mlflow-master/examples/docker/kubernetes_config.json
Signals: Docker

```json
{
  "kube-context": "docker-for-desktop",
  "kube-job-template-path": "examples/docker/kubernetes_job_template.yaml",
  "repository-uri": "username/mlflow-kubernetes-example"
}
```

--------------------------------------------------------------------------------

---[FILE: kubernetes_job_template.yaml]---
Location: mlflow-master/examples/docker/kubernetes_job_template.yaml
Signals: Docker

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: "{replaced with MLflow Project name}"
  namespace: mlflow
spec:
  ttlSecondsAfterFinished: 100
  backoffLimit: 0
  template:
    spec:
      containers:
        - name: "{replaced with MLflow Project name}"
          image: "{replaced with URI of Docker image created during Project execution}"
          command: ["{replaced with MLflow Project entry point command}"]
          resources:
            limits:
              memory: 512Mi
            requests:
              memory: 256Mi
      restartPolicy: Never
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/examples/docker/MLproject

```text
name: docker-example

docker_env:
  image:  mlflow-docker-example

entry_points:
  main:
    parameters:
      alpha: float
      l1_ratio: {type: float, default: 0.1}
    command: "python train.py --alpha {alpha} --l1-ratio {l1_ratio}"
```

--------------------------------------------------------------------------------

---[FILE: README.rst]---
Location: mlflow-master/examples/docker/README.rst

```text
Dockerized Model Training with MLflow
-------------------------------------
This directory contains an MLflow project that trains a linear regression model on the UC Irvine
Wine Quality Dataset. The project uses a Docker image to capture the dependencies needed to run
training code. Running a project in a Docker environment (as opposed to Conda) allows for capturing
non-Python dependencies, e.g. Java libraries. In the future, we also hope to add tools to MLflow
for running Dockerized projects e.g. on a Kubernetes cluster for scale out.

Structure of this MLflow Project
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

This MLflow project contains a ``train.py`` file that trains a scikit-learn model and uses
MLflow Tracking APIs to log the model and its metadata (e.g., hyperparameters and metrics)
for later use and reference. ``train.py`` operates on the Wine Quality Dataset, which is included
in ``wine-quality.csv``.

Most importantly, the project also includes an ``MLproject`` file, which specifies the Docker
container environment in which to run the project using the ``docker_env`` field:

.. code-block:: yaml

  docker_env:
    image:  mlflow-docker-example

Here, ``image`` can be any valid argument to ``docker run``, such as the tag, ID or URL of a Docker
image (see `Docker docs <https://docs.docker.com/engine/reference/run/#general-form>`_). The above
example references a locally-stored image (``mlflow-docker-example``) by tag.

Finally, the project includes a ``Dockerfile`` that is used to build the image referenced by the
``MLproject`` file. The ``Dockerfile`` specifies library dependencies required by the project, such
as ``mlflow`` and ``scikit-learn``.

Running this Example
^^^^^^^^^^^^^^^^^^^^

First, install MLflow (via ``pip install mlflow``) and install
`Docker <https://www.docker.com/get-started>`_.

Then, build the image for the project's Docker container environment. You must use the same image
name that is given by the ``docker_env.image`` field of the MLproject file. In this example, the
image name is ``mlflow-docker-example``. Issue the following command to build an image with this
name:

.. code-block:: bash

  docker build -t mlflow-docker-example -f Dockerfile .

Note that the name if the image used in the ``docker build`` command, ``mlflow-docker-example``,
matches the name of the image referenced in the ``MLproject`` file.

Finally, run the example project using ``mlflow run examples/docker -P alpha=0.5``.

.. note::
    If running this example on a Mac with Apple silicon, ensure that Docker Desktop is running and
    that you are logged in to the Docker Desktop service.
    If you are modifying the example ``DockerFile`` to specify older versions of ``scikit-learn``,
    you should enable `Rosetta compatibility <https://docs.docker.com/desktop/settings/mac/#features-in-development>`_
    in the Docker Desktop configuration settings to ensure that the appropriate ``cython`` compiler is used.

What happens when the project is run?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Running ``mlflow run examples/docker`` builds a new Docker image based on ``mlflow-docker-example``
that also contains our project code. The resulting image is tagged as
``mlflow-docker-example-<git-version>`` where ``<git-version>`` is the git commit ID. After the image is
built, MLflow executes the default (main) project entry point within the container using ``docker run``.

Environment variables, such as ``MLFLOW_TRACKING_URI``, are propagated inside the container during
project execution. When running against a local tracking URI, MLflow mounts the host system's
tracking directory (e.g., a local ``mlruns`` directory) inside the container so that metrics and
params logged during project execution are accessible afterwards.
```

--------------------------------------------------------------------------------

---[FILE: train.py]---
Location: mlflow-master/examples/docker/train.py

```python
# The data set used in this example is from http://archive.ics.uci.edu/ml/datasets/Wine+Quality
# P. Cortez, A. Cerdeira, F. Almeida, T. Matos and J. Reis.
# Modeling wine preferences by data mining from physicochemical properties. In Decision Support Systems, Elsevier, 47(4):547-553, 2009.

import argparse
import os
import warnings

import numpy as np
import pandas as pd
from sklearn.linear_model import ElasticNet
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

import mlflow
import mlflow.sklearn


def eval_metrics(actual, pred):
    rmse = np.sqrt(mean_squared_error(actual, pred))
    mae = mean_absolute_error(actual, pred)
    r2 = r2_score(actual, pred)
    return rmse, mae, r2


if __name__ == "__main__":
    warnings.filterwarnings("ignore")
    np.random.seed(40)

    parser = argparse.ArgumentParser()
    parser.add_argument("--alpha")
    parser.add_argument("--l1-ratio")
    args = parser.parse_args()

    # Read the wine-quality csv file (make sure you're running this from the root of MLflow!)
    wine_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "wine-quality.csv")
    data = pd.read_csv(wine_path)

    # Split the data into training and test sets. (0.75, 0.25) split.
    train, test = train_test_split(data)

    # The predicted column is "quality" which is a scalar from [3, 9]
    train_x = train.drop(["quality"], axis=1)
    test_x = test.drop(["quality"], axis=1)
    train_y = train[["quality"]]
    test_y = test[["quality"]]

    alpha = float(args.alpha)
    l1_ratio = float(args.l1_ratio)

    with mlflow.start_run():
        lr = ElasticNet(alpha=alpha, l1_ratio=l1_ratio, random_state=42)
        lr.fit(train_x, train_y)

        predicted_qualities = lr.predict(test_x)

        (rmse, mae, r2) = eval_metrics(test_y, predicted_qualities)

        print(f"Elasticnet model (alpha={alpha:f}, l1_ratio={l1_ratio:f}):")
        print(f"  RMSE: {rmse}")
        print(f"  MAE: {mae}")
        print(f"  R2: {r2}")

        mlflow.log_param("alpha", alpha)
        mlflow.log_param("l1_ratio", l1_ratio)
        mlflow.log_metric("rmse", rmse)
        mlflow.log_metric("r2", r2)
        mlflow.log_metric("mae", mae)

        mlflow.sklearn.log_model(lr, name="model")
```

--------------------------------------------------------------------------------

````
