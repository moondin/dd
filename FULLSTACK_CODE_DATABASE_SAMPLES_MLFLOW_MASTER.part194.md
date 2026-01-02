---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 194
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 194 of 991)

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

---[FILE: register_model.py]---
Location: mlflow-master/examples/mlflow-3/register_model.py

```python
import json

from sklearn.linear_model import LinearRegression

import mlflow

client = mlflow.MlflowClient()

with mlflow.start_run():
    model = LinearRegression().fit([[1], [2]], [3, 4])
    model_info = mlflow.sklearn.log_model(
        model,
        name="model",
        params={
            "alpha": 0.5,
            "l1_ratio": 0.5,
        },
    )
    model_info_2 = mlflow.sklearn.log_model(
        model,
        name="model",
        step=2,
        params={
            "alpha": 0.5,
            "l1_ratio": 0.5,
        },
    )

mlflow.register_model(model_info.model_uri, name="model")
m = mlflow.get_logged_model(model_info.model_id)
assert len(json.loads(m.tags["mlflow.modelVersions"])) == 1
print(m.tags)
assert m.model_id == model_info.model_id

mlflow.register_model(model_info.model_uri, name="hello")
m = mlflow.get_logged_model(model_info.model_id)
assert len(json.loads(m.tags["mlflow.modelVersions"])) == 2
print(m.tags)

client = mlflow.MlflowClient()

client.create_registered_model("model_client")
client.create_model_version("model_client", model_info.model_uri, model_id=model_info.model_id)
m = client.get_model_version("model_client", 1)
print(m)
assert m.model_id == model_info.model_id
assert m.params == {
    "alpha": "0.5",
    "l1_ratio": "0.5",
}

# Support backwards compatibility for runs:/... in addition to models:/...
model_uri = f"runs:/{model_info.run_id}/model"
mlflow.register_model(model_uri, name="model_from_runs_path")
mv = client.get_model_version("model_from_runs_path", 1)
assert mv.model_id == model_info_2.model_id  # model at largest step is registered

# Register model in log_model() directly
with mlflow.start_run():
    model_1 = LinearRegression().fit([[1], [2]], [3, 4])
    model_info_1 = mlflow.sklearn.log_model(
        model_1, name="model_1", registered_model_name="model_1"
    )

m = mlflow.get_logged_model(model_info_1.model_id)
assert len(json.loads(m.tags["mlflow.modelVersions"])) == 1
print(m.tags)

mv = client.get_model_version("model_1", 1)
assert mv.model_id == model_info_1.model_id
```

--------------------------------------------------------------------------------

---[FILE: sklearn_autolog.py]---
Location: mlflow-master/examples/mlflow-3/sklearn_autolog.py

```python
"""
python examples/mlflow-3/sklearn_autolog.py
"""

import os

from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GridSearchCV, train_test_split

import mlflow

os.environ["MLFLOW_AUTOLOGGING_TESTING"] = "true"

mlflow.sklearn.autolog()

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=42)

# LogisticRegression
model = LogisticRegression()
with mlflow.start_run() as run:
    model.fit(X_train, y_train)

model = mlflow.last_logged_model()
print(model.params)
print(model.metrics)

# GridSearchCV
model = LogisticRegression()
params = {"C": [0.1, 1.0, 10.0], "max_iter": [100, 200]}
clf = GridSearchCV(model, params)
with mlflow.start_run() as run:
    clf.fit(X_train, y_train)

for model in mlflow.search_logged_models(
    experiment_ids=[run.info.experiment_id], output_format="list"
):
    print(f"----- model_id: {model.model_id} -----")
    print(model)
```

--------------------------------------------------------------------------------

---[FILE: sklearn_example.py]---
Location: mlflow-master/examples/mlflow-3/sklearn_example.py

```python
# ruff: noqa
"""
python examples/demo.py
"""

import logging
import tempfile

import numpy as np
import pandas as pd
from sklearn.linear_model import ElasticNet
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

import mlflow


# Read the wine-quality csv file from the URL
csv_url = (
    "https://raw.githubusercontent.com/mlflow/mlflow/master/tests/datasets/winequality-red.csv"
)
logger = logging.getLogger(__name__)
try:
    data = pd.read_csv(csv_url, sep=";")
except Exception as e:
    logger.exception(
        "Unable to download training & test CSV, check your internet connection. Error: %s", e
    )

# Split the data into training and test sets. (0.75, 0.25) split.
train, test = train_test_split(data)


def eval_metrics(actual, pred):
    rmse = np.sqrt(mean_squared_error(actual, pred))
    mae = mean_absolute_error(actual, pred)
    r2 = r2_score(actual, pred)
    return rmse, mae, r2


alpha = 0.5
l1_ratio = 0.5

# Start a run to represent the training job
with mlflow.start_run() as training_run:
    # Load the training dataset with MLflow. We will link training metrics to this dataset.
    train_dataset: mlflow.data.pandas_dataset.PandasDataset = mlflow.data.from_pandas(
        train, name="train_dataset"
    )
    train_x = train_dataset.df.drop(["quality"], axis=1)
    train_y = train_dataset.df[["quality"]]

    # Fit a model to the training dataset
    lr = ElasticNet(alpha=alpha, l1_ratio=l1_ratio, random_state=42)
    lr.fit(train_x, train_y)

    # Evaluate the model on the training dataset and log metrics
    predictions = lr.predict(train_x)
    (rmse, mae, r2) = eval_metrics(train_y, predictions)
    mlflow.log_metrics(
        metrics={
            "rmse": rmse,
            "r2": r2,
            "mae": mae,
        },
        dataset=train_dataset,
    )

    # Log the model, specifying its ElasticNet parameters (alpha, l1_ratio)
    model = mlflow.sklearn.log_model(
        sk_model=lr,
        name="elasticnet",
        params={
            "alpha": alpha,
            "l1_ratio": l1_ratio,
        },
    )

    # Fetch the model ID, and print the model
    model_id = model.model_id
    print("\n")
    print(model)
    print("\n")
    print(model_id)

# Start a run to represent the test dataset evaluation job
with mlflow.start_run() as evaluation_run:
    # Load the test dataset with MLflow. We will link test metrics to this dataset.
    test_dataset: mlflow.data.pandas_dataset.PandasDataset = mlflow.data.from_pandas(
        test, name="test_dataset"
    )
    test_x = test_dataset.df.drop(["quality"], axis=1)
    test_y = test_dataset.df[["quality"]]

    # Load the model
    model = mlflow.sklearn.load_model(f"models:/{model_id}")

    # Evaluate the model on the training dataset and log metrics
    predicted_qualities = lr.predict(test_x)
    (rmse, mae, r2) = eval_metrics(test_y, predicted_qualities)
    mlflow.log_metrics(
        metrics={
            "rmse": rmse,
            "r2": r2,
            "mae": mae,
        },
        dataset=test_dataset,
        # Specify the ID of the model logged above
        model_id=model_id,
    )

model = mlflow.get_logged_model(model_id)

training_run = mlflow.get_run(training_run.info.run_id)
print(training_run)
print("\n")
print(training_run.outputs)

evaluation_run = mlflow.get_run(evaluation_run.info.run_id)
print(evaluation_run)
print("\n")
print(evaluation_run.inputs)

print(f"models:/{model_id}")
mlflow.register_model(model_uri=f"models:/{model_id}", name="registered_elasticnet")
mlflow.MlflowClient().get_model_version("registered_elasticnet", 1)
```

--------------------------------------------------------------------------------

---[FILE: .dockerignore]---
Location: mlflow-master/examples/mlflow_artifacts/.dockerignore

```text
**

!dist/*
```

--------------------------------------------------------------------------------

---[FILE: build.sh]---
Location: mlflow-master/examples/mlflow_artifacts/build.sh

```bash
#!/usr/bin/env bash

rm -rf dist
pip wheel --no-deps --wheel-dir dist ../..
DOCKERFILE=Dockerfile.dev docker compose build
```

--------------------------------------------------------------------------------

---[FILE: docker-compose.yml]---
Location: mlflow-master/examples/mlflow_artifacts/docker-compose.yml
Signals: Docker

```yaml
version: "3"
services:
  minio:
    image: minio/minio
    expose:
      - "9000"
    ports:
      - "9000:9000"
      # MinIO Console is available at http://localhost:9001
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: "user"
      MINIO_ROOT_PASSWORD: "password"
    healthcheck:
      test: timeout 5s bash -c ':> /dev/tcp/127.0.0.1/9000' || exit 1
      interval: 1s
      timeout: 10s
      retries: 5
    # Note there is no bucket by default
    command: server /data --console-address ":9001"

  minio-create-bucket:
    image: minio/mc
    depends_on:
      minio:
        condition: service_healthy
    entrypoint: >
      bash -c "
      mc alias set minio http://minio:9000 user password &&
      if ! mc ls minio/bucket; then
        mc mb minio/bucket
      else
        echo 'bucket already exists'
      fi
      "

  artifacts-server:
    build:
      context: .
      dockerfile: "${DOCKERFILE:-Dockerfile}"
    depends_on:
      - minio-create-bucket
    expose:
      - "5500"
    ports:
      - "5500:5500"
    environment:
      MLFLOW_S3_ENDPOINT_URL: http://minio:9000
      AWS_ACCESS_KEY_ID: "user"
      AWS_SECRET_ACCESS_KEY: "password"
      MLFLOW_SERVER_ENABLE_JOB_EXECUTION: "false"
      MLFLOW_SERVER_DISABLE_SECURITY_MIDDLEWARE: "true"
    command: >
      mlflow server
      --host 0.0.0.0
      --port 5500
      --artifacts-destination s3://bucket
      --gunicorn-opts "--log-level debug"
      --artifacts-only

  postgres:
    image: postgres
    restart: always
    environment:
      POSTGRES_DB: db
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password

  tracking-server:
    build:
      context: .
      dockerfile: "${DOCKERFILE:-Dockerfile}"
    depends_on:
      - postgres
      - artifacts-server
    expose:
      - "5000"
    ports:
      # MLflow UI is available at http://localhost:5000
      - "5000:5000"
    environment:
      MLFLOW_SERVER_ENABLE_JOB_EXECUTION: "false"
      MLFLOW_SERVER_DISABLE_SECURITY_MIDDLEWARE: "true"
    command: >
      mlflow server
      --host 0.0.0.0
      --port 5000
      --backend-store-uri postgresql://user:password@postgres:5432/db
      --default-artifact-root http://artifacts-server:5500/api/2.0/mlflow-artifacts/artifacts/experiments
      --gunicorn-opts "--log-level debug"

  client:
    build:
      context: .
      dockerfile: "${DOCKERFILE:-Dockerfile}"
    depends_on:
      - tracking-server
    environment:
      MLFLOW_TRACKING_URI: http://tracking-server:5000
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile]---
Location: mlflow-master/examples/mlflow_artifacts/Dockerfile

```text
FROM python:3.10

WORKDIR /app

# Install mlflow and packages requied to interact with PostgreSQL and MinIO
RUN pip install mlflow psycopg2 boto3
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile.dev]---
Location: mlflow-master/examples/mlflow_artifacts/Dockerfile.dev

```text
FROM python:3.10

WORKDIR /app

# Install packages requied to interact with PostgreSQL and MinIO
RUN pip install psycopg2 boto3
# Install the dev version of mlflow via wheel
COPY dist ./dist
RUN pip install dist/mlflow-*.whl
```

--------------------------------------------------------------------------------

---[FILE: example.py]---
Location: mlflow-master/examples/mlflow_artifacts/example.py

```python
import os
import tempfile
from pprint import pprint

import mlflow
from mlflow.artifacts import download_artifacts
from mlflow.tracking import MlflowClient


def save_text(path, text):
    with open(path, "w") as f:
        f.write(text)


def log_artifacts():
    # Upload artifacts
    with mlflow.start_run() as run, tempfile.TemporaryDirectory() as tmp_dir:
        tmp_path_a = os.path.join(tmp_dir, "a.txt")
        save_text(tmp_path_a, "0")
        tmp_sub_dir = os.path.join(tmp_dir, "dir")
        os.makedirs(tmp_sub_dir)
        tmp_path_b = os.path.join(tmp_sub_dir, "b.txt")
        save_text(tmp_path_b, "1")
        mlflow.log_artifact(tmp_path_a)
        mlflow.log_artifacts(tmp_sub_dir, artifact_path="dir")
        return run.info.run_id


def main():
    assert "MLFLOW_TRACKING_URI" in os.environ

    # Log artifacts
    run_id1 = log_artifacts()
    # Download artifacts
    client = MlflowClient()
    print("Downloading artifacts")
    pprint(os.listdir(download_artifacts(run_id=run_id1, artifact_path="")))
    pprint(os.listdir(download_artifacts(run_id=run_id1, artifact_path="dir")))

    # List artifacts
    print("Listing artifacts")
    pprint(client.list_artifacts(run_id1))
    pprint(client.list_artifacts(run_id1, "dir"))

    # Log artifacts again
    run_id2 = log_artifacts()
    # Delete the run to test `mlflow gc` command
    client.delete_run(run_id2)
    print(f"Deleted run: {run_id2}")


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/mlflow_artifacts/README.md

```text
# MLflow Artifacts Example

This directory contains a set of files for demonstrating the MLflow Artifacts Service.

## What does the MLflow Artifacts Service do?

The MLflow Artifacts Service serves as a proxy between the client and artifact storage (e.g. S3)
and allows the client to upload, download, and list artifacts via REST API without configuring
a set of credentials required to access resources in the artifact storage (e.g. `AWS_ACCESS_KEY_ID`
and `AWS_SECRET_ACCESS_KEY` for S3).

## Quick start

First, launch the tracking server with the artifacts service via `mlflow server`:

```sh
# Launch a tracking server with the artifacts service
$ mlflow server \
    --backend-store-uri=mlruns \
    --artifacts-destination ./mlartifacts \
    --default-artifact-root http://localhost:5000/api/2.0/mlflow-artifacts/artifacts/experiments \
    --gunicorn-opts "--log-level debug"
```

Notes:

- `--artifacts-destination` specifies the base artifact location from which to resolve artifact upload/download/list requests. In this examples, we're using a local directory `./mlartifacts`, but it can be changed to a s3 bucket or
- `--default-artifact-root` points to the `experiments` directory of the artifacts service. Therefore, the default artifact location of a newly-created experiment is set to `./mlartifacts/experiments/<experiment_id>`.
- `--gunicorn-opts "--log-level debug"` is specified to print out request logs but can be omitted if unnecessary.
- `--artifacts-only` disables all other endpoints for the tracking server apart from those involved in listing, uploading, and downloading artifacts. This makes the MLflow server a single-purpose proxy for artifact handling only.

Then, run `example.py` that performs upload, download, and list operations for artifacts:

```
$ MLFLOW_TRACKING_URI=http://localhost:5000 python example.py
```

After running the command above, the server should print out request logs for artifact operations:

```diff
...
[2021-11-05 19:13:34 +0900] [92800] [DEBUG] POST /api/2.0/mlflow/runs/create
[2021-11-05 19:13:34 +0900] [92800] [DEBUG] GET /api/2.0/mlflow/runs/get
[2021-11-05 19:13:34 +0900] [92802] [DEBUG] PUT /api/2.0/mlflow-artifacts/artifacts/0/a1b2c3d4/artifacts/a.txt
[2021-11-05 19:13:34 +0900] [92802] [DEBUG] PUT /api/2.0/mlflow-artifacts/artifacts/0/a1b2c3d4/artifacts/dir/b.txt
[2021-11-05 19:13:34 +0900] [92802] [DEBUG] POST /api/2.0/mlflow/runs/update
[2021-11-05 19:13:34 +0900] [92802] [DEBUG] GET /api/2.0/mlflow-artifacts/artifacts
...
```

The contents of the `mlartifacts` directory should look like this:

```sh
$ tree mlartifacts
mlartifacts
└── experiments
    └── 0  # experiment ID
        └── a1b2c3d4  # run ID
            └── artifacts
                ├── a.txt
                └── dir
                    └── b.txt

5 directories, 2 files
```

To delete the logged artifacts, run the following command:

```bash
mlflow gc --backend-store-uri=mlruns --run-ids <run_id>
```

### Clean up

```sh
# Remove experiment and run data
$ rm -rf mlruns

# Remove artifacts
$ rm -rf mlartifacts
```

## Advanced example using `docker-compose`

[`docker-compose.yml`](./docker-compose.yml) provides a more advanced setup than the quick-start example above:

- Tracking service uses PostgreSQL as a backend store.
- Artifact service uses MinIO as a artifact store.
- Tracking and artifacts services are running on different servers.

```sh
# Build services
$ docker-compose build

# Launch tracking and artifacts servers in the background
$ docker-compose up -d

# Run `example.py` in the client container
$ docker-compose run -v ${PWD}/example.py:/app/example.py client python example.py
```

You can view the logged artifacts on MinIO Console served at http://localhost:9001. The login username and password are `user` and `password`.

### Clean up

```sh
# Remove containers, networks, volumes, and images
$ docker-compose down --rmi all --volumes --remove-orphans
```

### Development

```sh
# Build services using the dev version of mlflow
$ ./build.sh
$ docker-compose run -v ${PWD}/example.py:/app/example.py client python example.py
```
```

--------------------------------------------------------------------------------

---[FILE: model.py]---
Location: mlflow-master/examples/model_config/model.py

```python
from mlflow.models import ModelConfig, set_model


def predict(model_input):
    model_config = ModelConfig()
    timeout = model_config.get("timeout")
    return [timeout] * len(model_input)


set_model(predict)
```

--------------------------------------------------------------------------------

---[FILE: simple.py]---
Location: mlflow-master/examples/model_config/simple.py

```python
import mlflow

with mlflow.start_run():
    model_info = mlflow.pyfunc.log_model(
        name="model",
        python_model="model.py",
        model_config={"timeout": 10},
        input_example=["hello"],
    )


# model = mlflow.pyfunc.load_model(model_info.model_uri, model_config={"timeout": 10})
# print(model.predict("hello"))
```

--------------------------------------------------------------------------------

---[FILE: als.py]---
Location: mlflow-master/examples/multistep_workflow/als.py

```python
"""
Trains an Alternating Least Squares (ALS) model for user/movie ratings.
The input is a Parquet ratings dataset (see etl_data.py), and we output
an mlflow artifact called 'als-model'.
"""

import click
import pyspark
from pyspark.ml import Pipeline
from pyspark.ml.evaluation import RegressionEvaluator
from pyspark.ml.recommendation import ALS

import mlflow
import mlflow.spark


@click.command()
@click.option("--ratings-data")
@click.option("--split-prop", default=0.8, type=float)
@click.option("--max-iter", default=10, type=int)
@click.option("--reg-param", default=0.1, type=float)
@click.option("--rank", default=12, type=int)
@click.option("--cold-start-strategy", default="drop")
def train_als(ratings_data, split_prop, max_iter, reg_param, rank, cold_start_strategy):
    seed = 42

    with pyspark.sql.SparkSession.builder.getOrCreate() as spark:
        ratings_df = spark.read.parquet(ratings_data)
        (training_df, test_df) = ratings_df.randomSplit([split_prop, 1 - split_prop], seed=seed)
        training_df.cache()
        test_df.cache()

        mlflow.log_metric("training_nrows", training_df.count())
        mlflow.log_metric("test_nrows", test_df.count())

        print(f"Training: {training_df.count()}, test: {test_df.count()}")

        als = (
            ALS()
            .setUserCol("userId")
            .setItemCol("movieId")
            .setRatingCol("rating")
            .setPredictionCol("predictions")
            .setMaxIter(max_iter)
            .setSeed(seed)
            .setRegParam(reg_param)
            .setColdStartStrategy(cold_start_strategy)
            .setRank(rank)
        )

        als_model = Pipeline(stages=[als]).fit(training_df)

        reg_eval = RegressionEvaluator(
            predictionCol="predictions", labelCol="rating", metricName="mse"
        )

        predicted_test_dF = als_model.transform(test_df)

        test_mse = reg_eval.evaluate(predicted_test_dF)
        train_mse = reg_eval.evaluate(als_model.transform(training_df))

        print(f"The model had a MSE on the test set of {test_mse}")
        print(f"The model had a MSE on the (train) set of {train_mse}")
        mlflow.log_metric("test_mse", test_mse)
        mlflow.log_metric("train_mse", train_mse)
        mlflow.spark.log_model(als_model, artifact_path="als-model")


if __name__ == "__main__":
    train_als()
```

--------------------------------------------------------------------------------

---[FILE: etl_data.py]---
Location: mlflow-master/examples/multistep_workflow/etl_data.py

```python
"""
Converts the raw CSV form to a Parquet form with just the columns we want
"""

import os
import tempfile

import click
import pyspark

import mlflow


@click.command(
    help="Given a CSV file (see load_raw_data), transforms it into Parquet "
    "in an mlflow artifact called 'ratings-parquet-dir'"
)
@click.option("--ratings-csv")
@click.option(
    "--max-row-limit", default=10000, help="Limit the data size to run comfortably on a laptop."
)
def etl_data(ratings_csv, max_row_limit):
    with mlflow.start_run():
        tmpdir = tempfile.mkdtemp()
        ratings_parquet_dir = os.path.join(tmpdir, "ratings-parquet")
        print(f"Converting ratings CSV {ratings_csv} to Parquet {ratings_parquet_dir}")
        with pyspark.sql.SparkSession.builder.getOrCreate() as spark:
            ratings_df = (
                spark.read.option("header", "true")
                .option("inferSchema", "true")
                .csv(ratings_csv)
                .drop("timestamp")
            )  # Drop unused column
            ratings_df.show()
            if max_row_limit != -1:
                ratings_df = ratings_df.limit(max_row_limit)
            ratings_df.write.parquet(ratings_parquet_dir)
            print(f"Uploading Parquet ratings: {ratings_parquet_dir}")
            mlflow.log_artifacts(ratings_parquet_dir, "ratings-parquet-dir")


if __name__ == "__main__":
    etl_data()
```

--------------------------------------------------------------------------------

---[FILE: load_raw_data.py]---
Location: mlflow-master/examples/multistep_workflow/load_raw_data.py

```python
"""
Downloads the MovieLens dataset and saves it as an artifact
"""

import os
import tempfile
import zipfile

import click
import requests

import mlflow


@click.command(
    help="Downloads the MovieLens dataset and saves it as an mlflow artifact "
    "called 'ratings-csv-dir'."
)
@click.option("--url", default="http://files.grouplens.org/datasets/movielens/ml-20m.zip")
def load_raw_data(url):
    with mlflow.start_run():
        local_dir = tempfile.mkdtemp()
        local_filename = os.path.join(local_dir, "ml-20m.zip")
        print(f"Downloading {url} to {local_filename}")
        r = requests.get(url, stream=True)
        with open(local_filename, "wb") as f:
            for chunk in r.iter_content(chunk_size=1024):
                if chunk:  # filter out keep-alive new chunks
                    f.write(chunk)

        extracted_dir = os.path.join(local_dir, "ml-20m")
        print(f"Extracting {local_filename} into {extracted_dir}")
        with zipfile.ZipFile(local_filename, "r") as zip_ref:
            zip_ref.extractall(local_dir)

        ratings_file = os.path.join(extracted_dir, "ratings.csv")

        print(f"Uploading ratings: {ratings_file}")
        mlflow.log_artifact(ratings_file, "ratings-csv-dir")


if __name__ == "__main__":
    load_raw_data()
```

--------------------------------------------------------------------------------

---[FILE: main.py]---
Location: mlflow-master/examples/multistep_workflow/main.py

```python
"""
Downloads the MovieLens dataset, ETLs it into Parquet, trains an
ALS model, and uses the ALS model to train a Keras neural network.

See README.md for more details.
"""

import os

import click

import mlflow
from mlflow.entities import RunStatus
from mlflow.tracking import MlflowClient
from mlflow.tracking.fluent import _get_experiment_id
from mlflow.utils import mlflow_tags
from mlflow.utils.logging_utils import eprint


def _already_ran(entry_point_name, parameters, git_commit, experiment_id=None):
    """Best-effort detection of if a run with the given entrypoint name,
    parameters, and experiment id already ran. The run must have completed
    successfully and have at least the parameters provided.
    """
    experiment_id = experiment_id if experiment_id is not None else _get_experiment_id()
    client = MlflowClient()
    all_runs = reversed(client.search_runs([experiment_id]))
    for run in all_runs:
        tags = run.data.tags
        if tags.get(mlflow_tags.MLFLOW_PROJECT_ENTRY_POINT, None) != entry_point_name:
            continue
        match_failed = False
        for param_key, param_value in parameters.items():
            run_value = run.data.params.get(param_key)
            if run_value != param_value:
                match_failed = True
                break
        if match_failed:
            continue

        if run.info.to_proto().status != RunStatus.FINISHED:
            eprint(
                ("Run matched, but is not FINISHED, so skipping (run_id={}, status={})").format(
                    run.info.run_id, run.info.status
                )
            )
            continue

        previous_version = tags.get(mlflow_tags.MLFLOW_GIT_COMMIT, None)
        if git_commit != previous_version:
            eprint(
                "Run matched, but has a different source version, so skipping "
                f"(found={previous_version}, expected={git_commit})"
            )
            continue
        return client.get_run(run.info.run_id)
    eprint("No matching run has been found.")
    return None


# TODO(aaron): This is not great because it doesn't account for:
# - changes in code
# - changes in dependent steps
def _get_or_run(entrypoint, parameters, git_commit, use_cache=True):
    existing_run = _already_ran(entrypoint, parameters, git_commit)
    if use_cache and existing_run:
        print(f"Found existing run for entrypoint={entrypoint} and parameters={parameters}")
        return existing_run
    print(f"Launching new run for entrypoint={entrypoint} and parameters={parameters}")
    submitted_run = mlflow.run(".", entrypoint, parameters=parameters, env_manager="local")
    return MlflowClient().get_run(submitted_run.run_id)


@click.command()
@click.option("--als-max-iter", default=10, type=int)
@click.option("--keras-hidden-units", default=20, type=int)
@click.option("--max-row-limit", default=100000, type=int)
def workflow(als_max_iter, keras_hidden_units, max_row_limit):
    # Note: The entrypoint names are defined in MLproject. The artifact directories
    # are documented by each step's .py file.
    with mlflow.start_run() as active_run:
        os.environ["SPARK_CONF_DIR"] = os.path.abspath(".")
        git_commit = active_run.data.tags.get(mlflow_tags.MLFLOW_GIT_COMMIT)
        load_raw_data_run = _get_or_run("load_raw_data", {}, git_commit)
        ratings_csv_uri = os.path.join(load_raw_data_run.info.artifact_uri, "ratings-csv-dir")
        etl_data_run = _get_or_run(
            "etl_data", {"ratings_csv": ratings_csv_uri, "max_row_limit": max_row_limit}, git_commit
        )
        ratings_parquet_uri = os.path.join(etl_data_run.info.artifact_uri, "ratings-parquet-dir")

        # We specify a spark-defaults.conf to override the default driver memory. ALS requires
        # significant memory. The driver memory property cannot be set by the application itself.
        als_run = _get_or_run(
            "als", {"ratings_data": ratings_parquet_uri, "max_iter": str(als_max_iter)}, git_commit
        )
        als_model_uri = os.path.join(als_run.info.artifact_uri, "als-model")

        keras_params = {
            "ratings_data": ratings_parquet_uri,
            "als_model_uri": als_model_uri,
            "hidden_units": keras_hidden_units,
        }
        _get_or_run("train_keras", keras_params, git_commit, use_cache=False)


if __name__ == "__main__":
    workflow()
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/examples/multistep_workflow/MLproject

```text
name: multistep_example

python_env: python_env.yaml

entry_points:
  load_raw_data:
    command: "python load_raw_data.py"

  etl_data:
    parameters:
      ratings_csv: path
      max_row_limit: {type: int, default: 100000}
    command: "python etl_data.py --ratings-csv {ratings_csv} --max-row-limit {max_row_limit}"

  als:
    parameters:
      ratings_data: path
      max_iter: {type: int, default: 10}
      reg_param: {type: float, default: 0.1}
      rank: {type: int, default: 12}
    command: "python als.py --ratings-data {ratings_data} --max-iter {max_iter} --reg-param {reg_param} --rank {rank}"

  train_keras:
    parameters:
      ratings_data: path
      als_model_uri: string
      hidden_units: {type: int, default: 20}
    command: "python train_keras.py --ratings-data {ratings_data} --als-model-uri {als_model_uri} --hidden-units {hidden_units}"

  main:
    parameters:
      als_max_iter: {type: int, default: 10}
      keras_hidden_units: {type: int, default: 20}
      max_row_limit: {type: int, default: 100000}
    command: "python main.py --als-max-iter {als_max_iter} --keras-hidden-units {keras_hidden_units}
                             --max-row-limit {max_row_limit}"
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/examples/multistep_workflow/python_env.yaml

```yaml
build_dependencies:
  - pip
dependencies:
  - tensorflow==1.15.2
  - keras==2.2.4
  - mlflow>=1.0
  - pyspark
  - requests
  - click
```

--------------------------------------------------------------------------------

---[FILE: README.rst]---
Location: mlflow-master/examples/multistep_workflow/README.rst

```text
Multistep Workflow Example
--------------------------
This MLproject aims to be a fully self-contained example of how to
chain together multiple different MLflow runs which each encapsulate
a transformation or training step, allowing a clear definition of the
interface between the steps, as well as allowing for caching and reuse
of the intermediate results.

At a high level, our goal is to predict users' ratings of movie given
a history of their ratings for other movies. This example is based
on `this webinar <https://databricks.com/blog/2018/07/13/scalable-end-to-end-deep-learning-using-tensorflow-and-databricks-on-demand-webinar-and-faq-now-available.html>`_
by @brookewenig and @smurching.

.. image:: ../../docs/source/_static/images/tutorial-multistep-workflow.png?raw=true

There are four steps to this workflow:

- **load_raw_data.py**: Downloads the MovieLens dataset
  (a set of triples of user id, movie id, and rating) as a CSV and puts
  it into the artifact store.

- **etl_data.py**: Converts the MovieLens CSV from the
  previous step into Parquet, dropping unnecessary columns along the way.
  This reduces the input size from 500 MB to 49 MB, and allows columnar
  access of the data.

- **als.py**: Runs Alternating Least Squares for collaborative
  filtering on the Parquet version of MovieLens to estimate the
  movieFactors and userFactors. This produces a relatively accurate estimator.

- **train_keras.py**: Trains a neural network on the
  original data, supplemented by the ALS movie/userFactors -- we hope
  this can improve upon the ALS estimations.

While we can run each of these steps manually, here we have a driver
run, defined as **main** (main.py). This run will run
the steps in order, passing the results of one to the next.
Additionally, this run will attempt to determine if a sub-run has
already been executed successfully with the same parameters and, if so,
reuse the cached results.

Running this Example
^^^^^^^^^^^^^^^^^^^^
In order for the multistep workflow to find the other steps, you must
execute ``mlflow run`` from this directory. So, in order to find out if
the Keras model does in fact improve upon the ALS model, you can simply
run:

.. code-block:: bash

    cd examples/multistep_workflow
    mlflow run .


This downloads and transforms the MovieLens dataset, trains an ALS
model, and then trains a Keras model -- you can compare the results by
using ``mlflow server``.

You can also try changing the number of ALS iterations or Keras hidden
units:

.. code-block:: bash

    mlflow run . -P als_max_iter=20 -P keras_hidden_units=50
```

--------------------------------------------------------------------------------

---[FILE: spark-defaults.conf]---
Location: mlflow-master/examples/multistep_workflow/spark-defaults.conf

```text
spark.driver.memory 8g
```

--------------------------------------------------------------------------------

---[FILE: train_keras.py]---
Location: mlflow-master/examples/multistep_workflow/train_keras.py

```python
"""
Trains a Keras model for user/movie ratings. The input is a Parquet
ratings dataset (see etl_data.py) and an ALS model (see als.py), which we
will use to supplement our input and train using.
"""

from itertools import chain

import click
import numpy as np
import pandas as pd
import pyspark
import tensorflow as tf
from pyspark.sql.functions import col, udf
from pyspark.sql.types import ArrayType, FloatType
from tensorflow import keras
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.layers import Dense
from tensorflow.keras.models import Sequential

import mlflow
import mlflow.spark


@click.command()
@click.option("--ratings-data", help="Path readable by Spark to the ratings Parquet file")
@click.option("--als-model-uri", help="Path readable by load_model to ALS MLmodel")
@click.option("--hidden-units", default=20, type=int)
def train_keras(ratings_data, als_model_uri, hidden_units):
    np.random.seed(0)
    tf.set_random_seed(42)  # For reproducibility

    with pyspark.sql.SparkSession.builder.getOrCreate() as spark:
        als_model = mlflow.spark.load_model(als_model_uri).stages[0]
        ratings_df = spark.read.parquet(ratings_data)
        (training_df, test_df) = ratings_df.randomSplit([0.8, 0.2], seed=42)
        training_df.cache()
        test_df.cache()

        mlflow.log_metric("training_nrows", training_df.count())
        mlflow.log_metric("test_nrows", test_df.count())

        print(f"Training: {training_df.count()}, test: {test_df.count()}")

        user_factors = als_model.userFactors.selectExpr("id as userId", "features as uFeatures")
        item_factors = als_model.itemFactors.selectExpr("id as movieId", "features as iFeatures")
        joined_train_df = training_df.join(item_factors, on="movieId").join(
            user_factors, on="userId"
        )
        joined_test_df = test_df.join(item_factors, on="movieId").join(user_factors, on="userId")

        # We'll combine the movies and ratings vectors into a single vector of length 24.
        # We will then explode this features vector into a set of columns.
        def concat_arrays(*args):
            return list(chain(*args))

        concat_arrays_udf = udf(concat_arrays, ArrayType(FloatType()))

        concat_train_df = joined_train_df.select(
            "userId",
            "movieId",
            concat_arrays_udf(col("iFeatures"), col("uFeatures")).alias("features"),
            col("rating").cast("float"),
        )
        concat_test_df = joined_test_df.select(
            "userId",
            "movieId",
            concat_arrays_udf(col("iFeatures"), col("uFeatures")).alias("features"),
            col("rating").cast("float"),
        )

        pandas_df = concat_train_df.toPandas()
        pandas_test_df = concat_test_df.toPandas()

        # This syntax will create a new DataFrame where elements of the 'features' vector
        # are each in their own column. This is what we'll train our neural network on.
        x_test = pd.DataFrame(pandas_test_df.features.values.tolist(), index=pandas_test_df.index)
        x_train = pd.DataFrame(pandas_df.features.values.tolist(), index=pandas_df.index)

        # Show matrix for example.
        print("Training matrix:")
        print(x_train)

        # Create our Keras model with two fully connected hidden layers.
        model = Sequential()
        model.add(Dense(30, input_dim=24, activation="relu"))
        model.add(Dense(hidden_units, activation="relu"))
        model.add(Dense(1, activation="linear"))

        model.compile(loss="mse", optimizer=keras.optimizers.Adam(lr=0.0001))

        early_stopping = EarlyStopping(
            monitor="val_loss", min_delta=0.0001, patience=2, mode="auto"
        )

        model.fit(
            x_train,
            pandas_df["rating"],
            validation_split=0.2,
            verbose=2,
            epochs=3,
            batch_size=128,
            shuffle=False,
            callbacks=[early_stopping],
        )

        train_mse = model.evaluate(x_train, pandas_df["rating"], verbose=2)
        test_mse = model.evaluate(x_test, pandas_test_df["rating"], verbose=2)
        mlflow.log_metric("test_mse", test_mse)
        mlflow.log_metric("train_mse", train_mse)

        print(f"The model had a MSE on the test set of {test_mse}")
        mlflow.tensorflow.log_model(model, name="keras-model")


if __name__ == "__main__":
    train_keras()
```

--------------------------------------------------------------------------------

---[FILE: azure_openai.py]---
Location: mlflow-master/examples/openai/azure_openai.py

```python
import openai
import pandas as pd

import mlflow

"""
Set environment variables for Azure OpenAI service
export OPENAI_API_KEY="<AZURE OPENAI KEY>"
# OPENAI_API_BASE should be the endpoint of your Azure OpenAI resource
# e.g. https://<service-name>.openai.azure.com/
export OPENAI_API_BASE="<AZURE OPENAI BASE>"
# OPENAI_API_VERSION e.g. 2023-05-15
export OPENAI_API_VERSION="<AZURE OPENAI API VERSION>"
export OPENAI_API_TYPE="azure"
export OPENAI_DEPLOYMENT_NAME="<AZURE OPENAI DEPLOYMENT ID OR NAME>"
"""

with mlflow.start_run():
    model_info = mlflow.openai.log_model(
        # Your Azure OpenAI model e.g. gpt-4o-mini
        model="<YOUR AZURE OPENAI MODEL>",
        task=openai.chat.completions,
        name="model",
        messages=[{"role": "user", "content": "Tell me a joke about {animal}."}],
    )

# Load native OpenAI model
native_model = mlflow.openai.load_model(model_info.model_uri)
completion = openai.chat.completions.create(
    deployment_id=native_model["deployment_id"],
    messages=native_model["messages"],
)
print(completion["choices"][0]["message"]["content"])


# Load as Pyfunc model
model = mlflow.pyfunc.load_model(model_info.model_uri)
df = pd.DataFrame(
    {
        "animal": [
            "cats",
            "dogs",
        ]
    }
)
print(model.predict(df))

list_of_dicts = [
    {"animal": "cats"},
    {"animal": "dogs"},
]
print(model.predict(list_of_dicts))

list_of_strings = [
    "cats",
    "dogs",
]
print(model.predict(list_of_strings))

list_of_strings = [
    "Let me hear your thoughts on AI",
    "Let me hear your thoughts on ML",
]
model = mlflow.pyfunc.load_model(model_info.model_uri)
print(model.predict(list_of_strings))
```

--------------------------------------------------------------------------------

````
