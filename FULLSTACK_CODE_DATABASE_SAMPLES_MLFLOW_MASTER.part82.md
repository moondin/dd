---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 82
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 82 of 991)

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
Location: mlflow-master/docs/docs/classic-ml/tracking/tutorials/local-database/index.mdx

```text
# Tracking Experiments with Local Database

In this tutorial, you will learn how to use a local database to track your experiment metadata with MLflow.

By default, MLflow Tracking logs (_writes_) run data to local files,
which may cause some frustration due to fractured small files and the lack of a simple access interface. Also, if you are using Python, you can use SQLite that runs
upon your local file system (e.g. `mlruns.db`) and has a built-in client `sqlite3`, eliminating the effort to install any additional dependencies and setting up database server.

## Step 1. Get MLflow

MLflow is available on PyPI. If you don't already have it installed on your local machine, you can install it with:

```bash
pip install mlflow
```

## Step 2. Configure MLflow to Log to SQLite Database

To point MLflow to your local SQLite database, you need to set the environment variable `MLFLOW_TRACKING_URI` (e.g., `sqlite:///mlruns.db`).
This will create a SQLite database file (`mlruns.db`) in the current directory. Specify a different path if you want to store the database file in a different location.

```bash
export MLFLOW_TRACKING_URI=sqlite:///mlruns.db
```

If you are in a notebook, run the following cell instead:

```
%env MLFLOW_TRACKING_URI=sqlite:///mlruns.db
```

:::note
For using a SQLite database, MLflow automatically creates a new database if it does not exist. If you want to use a different database, you need to create the database first.
:::

## Step 3. Start Logging

Now you are ready to start logging your experiment runs. For example, the following code runs training for a scikit-learn RandomForest model on the diabetes dataset:

```python
import mlflow

from sklearn.model_selection import train_test_split
from sklearn.datasets import load_diabetes
from sklearn.ensemble import RandomForestRegressor

mlflow.sklearn.autolog()

db = load_diabetes()
X_train, X_test, y_train, y_test = train_test_split(db.data, db.target)

# Create and train models.
rf = RandomForestRegressor(n_estimators=100, max_depth=6, max_features=3)
rf.fit(X_train, y_train)

# Use the model to make predictions on the test dataset.
predictions = rf.predict(X_test)
```

## Step 4. View Your Logged Run in Tracking UI

Once your training job finishes, you can run the following command to launch the MLflow UI (You will have to specify the path to SQLite database file with `--backend-store-uri` option):

```bash
mlflow server --port 8080 --backend-store-uri sqlite:///mlruns.db
```

Then, navigate to [`http://localhost:8080`](http://localhost:8080) in your browser to view the results.

## What's Next?

You've now learned how to connect MLflow Tracking with a remote storage and a database.

There are a couple of more advanced topics you can explore:

- **Remote environment setup for team development**: While storing runs and experiments data in local machine is perfectly fine for solo development, you should
  consider using [MLflow Tracking Server](/ml/tracking#tracking_server) when you set up a team collaboration environment with MLflow Tracking. Read the
  [Remote Experiment Tracking with MLflow Tracking Server](/ml/tracking/tutorials/remote-server) tutorial to learn more.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/classic-ml/tracking/tutorials/remote-server/index.mdx

```text
import { APILink } from "@site/src/components/APILink";

# Remote Experiment Tracking with MLflow Tracking Server

In this tutorial, you will learn how to set up MLflow Tracking environment for team development using the [MLflow Tracking Server](/ml/tracking#tracking_server).

There are many benefits to utilize MLflow Tracking Server for remote experiment tracking:

- **Collaboration**: Multiple users can log runs to the same endpoint, and query runs and models logged by other users.
- **Sharing Results**: The tracking server also serves a [Tracking UI](/ml/tracking#tracking_ui) endpoint, where team members can easily explore each other's results.
- **Centralized Access**: The tracking server can be run as a proxy for the remote access for metadata and artifacts, making it easier to secure and audit access to data.

## How does it work?

The following picture depicts the architecture of using a remote MLflow Tracking Server with PostgreSQL and S3

<figure className="center-div" style={{ width: 900, maxWidth: "100%", textAlign: "center" }}>
  ![](/images/tracking/scenario_5.png)
  <figcaption>Artifacture diagram of MLflow Tracking Server with PostgreSQL and S3</figcaption>
</figure>

:::note
You can find the list of supported data stores in the [artifact stores](/self-hosting/architecture/artifact-store) and [backend stores](/self-hosting/architecture/backend-store) documentation guides.
:::

When you start logging runs to the MLflow Tracking Server, the following happens:

- **Part 1a and b**:
  - The MLflow client creates an instance of a _RestStore_ and sends REST API requests to log MLflow entities
  - The Tracking Server creates an instance of an _SQLAlchemyStore_ and connects to the remote host for inserting
    tracking information in the database (i.e., metrics, parameters, tags, etc.)

- **Part 1c and d**:
  - Retrieval requests by the client return information from the configured _SQLAlchemyStore_ table

- **Part 2a and b**:
  - Logging events for artifacts are made by the client using the `HttpArtifactRepository` to write files to MLflow Tracking Server
  - The Tracking Server then writes these files to the configured object store location with assumed role authentication

- **Part 2c and d**:
  - Retrieving artifacts from the configured backend store for a user request is done with the same authorized authentication that was configured at server start
  - Artifacts are passed to the end user through the Tracking Server through the interface of the `HttpArtifactRepository`

## Getting Started

### Preface

In an actual production deployment environment, you will have multiple remote hosts to run both the tracking server and databases, as shown in the diagram above. However, for the purposes of this tutorial,
we will just use a single machine with multiple Docker containers running on different ports, mimicking the remote environment with a far easier evaluation tutorial setup. We will also use [MinIO](https://min.io/),
an S3-compatible object storage, as an artifact store so that you don't need to have AWS account to run this tutorial.

### Step 1 - Get MLflow and additional dependencies

MLflow is available on PyPI. Also [pyscopg2](https://pypi.org/project/psycopg2/) and [boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) are required for accessing PostgreSQL and S3 with Python.
If you don't already have them installed on your system, you can install them with:

```bash
pip install mlflow psycopg2 boto3
```

### Step 2 - Set up remote data stores

MLflow Tracking Server can interact with a variety of data stores to store experiment and run data as well as artifacts.
In this tutorial, we will use **Docker Compose** to start two containers, each of them simulating remote servers in an actual environment.

1. [PostgreSQL](https://www.postgresql.org/) database as a backend store.
2. [MinIO](https://min.io/) server as an artifact store.

#### Install docker and docker-compose

:::note
These docker steps are only required for the tutorial purpose. MLflow itself doesn't depend on Docker at all.
:::

Follow the official instructions for installing [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/compose/install/). Then, run `docker --version` and `docker-compose --version` to make sure they are installed correctly.

#### Create `compose.yaml`

Create a file named `compose.yaml` with the following content:

```yaml title="compose.yaml"
version: "3.7"
services:
  # PostgreSQL database
  postgres:
    image: postgres:latest
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mlflowdb
    ports:
      - 5432:5432
    volumes:
      - ./postgres-data:/var/lib/postgresql

  # MinIO server
  minio:
    image: minio/minio
    expose:
      - "9000"
    ports:
      - "9000:9000"
      # MinIO Console is available at http://localhost:9001
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: "minio_user"
      MINIO_ROOT_PASSWORD: "minio_password"
    healthcheck:
      test: timeout 5s bash -c ':> /dev/tcp/127.0.0.1/9000' || exit 1
      interval: 1s
      timeout: 10s
      retries: 5
    command: server /data --console-address ":9001"
  # Create a bucket named "bucket" if it doesn't exist
  minio-create-bucket:
    image: minio/mc
    depends_on:
      minio:
        condition: service_healthy
    entrypoint: >
      bash -c "
      mc alias set minio http://minio:9000 minio_user minio_password &&
      if ! mc ls minio/bucket; then
        mc mb minio/bucket
      else
        echo 'bucket already exists'
      fi
      "
```

#### Start the containers

Run the following command from the same directory `compose.yaml` file resides to start the containers.
This will start the containers for PostgreSQL and Minio server in the background, as well as create a
new bucket named "bucket" in Minio.

```bash
docker compose up -d
```

### Step 3 - Start the Tracking Server

:::note
In actual environment, you will have a remote host that will run the tracking server, but in this tutorial we will just use our local machine as a simulated surrogate for a remote machine.
:::

#### Configure access

For the tracking server to access remote storage, it needs to be configured with the necessary credentials.

```bash
export MLFLOW_S3_ENDPOINT_URL=http://localhost:9000 # Replace this with remote storage endpoint e.g. s3://my-bucket in real use cases
export AWS_ACCESS_KEY_ID=minio_user
export AWS_SECRET_ACCESS_KEY=minio_password
```

You can find the instructions for how to configure credentials for other storages in [Supported Storage](/self-hosting/architecture/artifact-store#artifacts-store-supported-storages).

#### Launch the tracking server

To specify the backend store and artifact store, you can use the `--backend-store-uri` and `--artifacts-store-uri` options respectively.

```bash
mlflow server \
  --backend-store-uri postgresql://user:password@localhost:5432/mlflowdb \
  --artifacts-destination s3://bucket \
  --host 0.0.0.0 \
  --port 5000
```

Replace `localhost` with the remote host name or IP address for your database server in actual environment.

### Step 4: Logging to the Tracking Server

Once the tracking server is running, you can log runs to it by setting the MLflow Tracking URI to the tracking server's URI. Alternatively, you can use the <APILink fn="mlflow.set_tracking_uri" /> API to set the tracking URI.

```bash
export MLFLOW_TRACKING_URI=http://127.0.0.1:5000  # Replace with remote host name or IP address in an actual environment
```

Then run your code with MLflow tracking APIs as usual. The following code runs training for a scikit-learn RandomForest model on the diabetes dataset:

```python
import mlflow

from sklearn.model_selection import train_test_split
from sklearn.datasets import load_diabetes
from sklearn.ensemble import RandomForestRegressor

mlflow.autolog()

db = load_diabetes()
X_train, X_test, y_train, y_test = train_test_split(db.data, db.target)

# Create and train models.
rf = RandomForestRegressor(n_estimators=100, max_depth=6, max_features=3)
rf.fit(X_train, y_train)

# Use the model to make predictions on the test dataset.
predictions = rf.predict(X_test)
```

### Step 5: View logged Run in Tracking UI

Our pseudo-remote MLflow Tracking Server also hosts the Tracking UI on the same endpoint. In an actual deployment environment with a remote tracking server, this is also the case.
You can access the UI by navigating to [`http://127.0.0.1:5000`](http://127.0.0.1:5000) (replace with remote host name or IP address in actual environment) in your browser.

### Step 6: Download artifacts

MLflow Tracking Server also serves as a proxy host for artifact access. Artifact access is enabled through the proxy URIs such as `models:/`, `mlflow-artifacts:/`,
giving users access to this location without having to manage credentials or permissions of direct access.

```python
import mlflow

model_id = "YOUR_MODEL_ID"  # You can find model ID in the Tracking UI

# Download artifact via the tracking server
mlflow_artifact_uri = f"models:/{model_id}"
local_path = mlflow.artifacts.download_artifacts(mlflow_artifact_uri)

# Load the model
model = mlflow.sklearn.load_model(local_path)
```

## What's Next?

Now you have learned how to set up MLflow Tracking Server for remote experiment tracking!
There are a couple of more advanced topics you can explore:

- **Other configurations for the Tracking Server**: By default, MLflow Tracking Server serves both backend store and artifact store.
  You can also configure the Tracking Server to serve only backend store or artifact store, to handle different use cases such as large
  traffic or security concerns. See [other use cases](/ml/tracking#other-tracking-setup) for how to customize the Tracking Server for these use cases.
- **Secure the Tracking Server**: The `--host` option exposes the service on all interfaces. If running a server in production, we
  would recommend not exposing the built-in server broadly (as it is unauthenticated and unencrypted). Read [Secure Tracking Server](/self-hosting/security/network)
  for the best practices to secure the Tracking Server in production.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/classic-ml/traditional-ml/index.mdx

```text
---
sidebar_position: 0
sidebar_label: Overview
---

import useBaseUrl from '@docusaurus/useBaseUrl';

import TilesGrid from "@site/src/components/TilesGrid";
import TileCard from "@site/src/components/TileCard";
import { CardGroup, SmallLogoCard } from "@site/src/components/Card";
import FeatureHighlights from "@site/src/components/FeatureHighlights";
import { Zap, GitBranch, Gauge, Rocket, BookOpen, BarChart3, Settings, Play } from "lucide-react";

# MLflow for Traditional Machine Learning

MLflow provides comprehensive experiment tracking, model management, and deployment capabilities for traditional machine learning workflows. From scikit-learn pipelines to gradient boosting models, MLflow streamlines your path from experimentation to production.

## Get Started

<TilesGrid>
  <TileCard
    icon={Play}
    iconSize={48}
    title="Scikit-learn Guide"
    description="Start with scikit-learn autologging, model management, and deployment patterns."
    href="/ml/traditional-ml/sklearn"
    linkText="View guide →"
    containerHeight={64}
  />
  <TileCard
    icon={Zap}
    iconSize={48}
    title="XGBoost Guide"
    description="Learn gradient boosting with automatic parameter and feature importance tracking."
    href="/ml/traditional-ml/xgboost"
    linkText="View guide →"
    containerHeight={64}
  />
  <TileCard
    icon={BookOpen}
    iconSize={48}
    title="Spark MLlib Guide"
    description="Scale traditional ML to big data with distributed computing."
    href="/ml/traditional-ml/sparkml"
    linkText="View guide →"
    containerHeight={64}
  />
  <TileCard
    icon={Settings}
    iconSize={48}
    title="Hyperparameter Tuning"
    description="Optimize models with GridSearchCV, RandomizedSearchCV, and Optuna integration."
    href="/ml/getting-started/hyperparameter-tuning"
    linkText="Start tuning →"
    containerHeight={64}
  />
  <TileCard
    icon={BarChart3}
    iconSize={48}
    title="Model Evaluation"
    description="Evaluate models with built-in metrics, visualizations, and custom evaluators."
    href="/ml/evaluation"
    linkText="Learn evaluation →"
    containerHeight={64}
  />
  <TileCard
    icon={Rocket}
    iconSize={48}
    title="Model Deployment"
    description="Deploy models to production with MLflow serving and cloud platforms."
    href="/ml/deployment"
    linkText="Deploy models →"
    containerHeight={64}
  />
</TilesGrid>

## Why MLflow for Traditional ML?

<video src={useBaseUrl("/images/traditional-ml-ui.mp4")} controls loop autoPlay muted aria-label="Hyper Parameter Optimization with scikit-learn" />

<FeatureHighlights features={[
  {
    icon: Zap,
    title: "Automatic Logging",
    description: "Single line of code (mlflow.autolog()) captures parameters, metrics, models, and artifacts for scikit-learn, XGBoost, LightGBM, and more."
  },
  {
    icon: GitBranch,
    title: "Experiment Organization",
    description: "Track hyperparameter searches with parent-child runs. Compare models across algorithms with visual charts and sortable tables."
  },
  {
    icon: Gauge,
    title: "Pipeline Tracking",
    description: "Automatically log scikit-learn Pipeline components, preprocessing steps, and feature transformations with full reproducibility."
  },
  {
    icon: Rocket,
    title: "Flexible Deployment",
    description: "Deploy models for real-time inference, batch processing, or edge deployment with Docker, Kubernetes, and cloud platform support."
  }
]} />

## Supported Libraries

<CardGroup>
  <SmallLogoCard link="/ml/traditional-ml/sklearn">![scikit learn](/images/logos/scikit-learn-logo.svg)</SmallLogoCard>
  <SmallLogoCard link="/ml/traditional-ml/xgboost">![XGBoost Logo](/images/logos/xgboost-logo.svg)</SmallLogoCard>
  <SmallLogoCard link="/ml/traditional-ml/sparkml">![Spark Logo](/images/logos/spark-logo.svg)</SmallLogoCard>
  <SmallLogoCard link="/ml/model#lightgbm-lightgbm">![LightGBM Logo](/images/logos/lightgbm-logo.png)</SmallLogoCard>
  <SmallLogoCard link="/ml/model#catboost-catboost">![CatBoost Logo](/images/logos/catboost-logo.png)</SmallLogoCard>
  <SmallLogoCard link="/ml/model#statsmodels-statsmodels">![Statsmodels Logo](/images/logos/statsmodels-logo.svg)</SmallLogoCard>
  <SmallLogoCard link="/ml/traditional-ml/prophet">![Prophet Logo](/images/logos/prophet-logo.png)</SmallLogoCard>
</CardGroup>

## Learn More

<TilesGrid>
  <TileCard
    icon={BookOpen}
    iconSize={48}
    title="Model Registry"
    description="Manage model versions, aliases, and deployment lifecycle with centralized governance."
    href="/ml/model-registry"
    linkText="View registry docs →"
    containerHeight={64}
  />
  <TileCard
    icon={BarChart3}
    iconSize={48}
    title="MLflow Tracking"
    description="Track experiments, parameters, metrics, and artifacts across all ML workflows."
    href="/ml/tracking"
    linkText="View tracking docs →"
    containerHeight={64}
  />
  <TileCard
    icon={Rocket}
    iconSize={48}
    title="Custom PyFunc Models"
    description="Create standardized, reproducible model interfaces with MLflow's PyFunc framework."
    href="/ml/traditional-ml/tutorials/creating-custom-pyfunc"
    linkText="View tutorial →"
    containerHeight={64}
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/classic-ml/traditional-ml/prophet/index.mdx

```text
import FeatureHighlights from "@site/src/components/FeatureHighlights";
import TilesGrid from "@site/src/components/TilesGrid";
import TileCard from "@site/src/components/TileCard";
import { TrendingUp, GitBranch, CheckCircle, Package } from "lucide-react";

# MLflow Prophet Integration

## Introduction

**Prophet** is Meta's open-source time series forecasting library designed for business forecasting tasks. It decomposes time series into trend, seasonality, and holiday effects, handling missing data and outliers while producing interpretable forecasts.

MLflow's Prophet integration provides experiment tracking, model versioning, and deployment capabilities for time series forecasting workflows.

:::note No Autologging for Prophet

Prophet does not support autologging to prevent overwhelming the tracking server. Time series forecasting often involves training hundreds or thousands of models (e.g., one per product or location), which would create excessive load on the tracking server if autologging were enabled. Use manual logging with bulk APIs for large-scale forecasting workflows.

:::

## Why MLflow + Prophet?

<FeatureHighlights
  features={[
    {
      icon: TrendingUp,
      title: "Model Tracking",
      description: "Log Prophet models with parameters, cross-validation metrics, and forecast components for comprehensive experiment tracking.",
    },
    {
      icon: GitBranch,
      title: "Experiment Comparison",
      description: "Compare different seasonality configurations, holiday effects, and hyperparameter combinations across forecasting experiments.",
    },
    {
      icon: CheckCircle,
      title: "Forecast Validation",
      description: "Integrate Prophet's cross-validation metrics directly into MLflow tracking for reproducible model evaluation.",
    },
    {
      icon: Package,
      title: "Model Registry",
      description: "Version and deploy Prophet forecasting models with MLflow's model registry and serving infrastructure.",
    },
  ]}
/>

## Basic Model Logging

Log Prophet models with MLflow to track forecasting experiments:

```python
import mlflow
import mlflow.prophet
import pandas as pd
from prophet import Prophet
from prophet.diagnostics import cross_validation, performance_metrics

# Load time series data (Prophet requires 'ds' and 'y' columns)
url = "https://raw.githubusercontent.com/facebook/prophet/main/examples/example_wp_log_peyton_manning.csv"
df = pd.read_csv(url)

with mlflow.start_run():
    # Create and fit Prophet model
    model = Prophet(
        changepoint_prior_scale=0.05,
        seasonality_prior_scale=10,
        yearly_seasonality=True,
        weekly_seasonality=True,
    )
    model.fit(df)

    # Log model parameters
    mlflow.log_params(
        {
            "changepoint_prior_scale": 0.05,
            "seasonality_prior_scale": 10,
            "yearly_seasonality": True,
            "weekly_seasonality": True,
        }
    )

    # Cross-validation
    cv_results = cross_validation(
        model,
        initial="730 days",
        period="180 days",
        horizon="365 days",
    )

    # Log performance metrics
    metrics = performance_metrics(cv_results)
    mlflow.log_metrics(metrics[["mse", "rmse", "mae", "mape"]].mean().to_dict())

    # Log model
    mlflow.prophet.log_model(
        pr_model=model, name="prophet_model", input_example=df[["ds"]].head()
    )
```

## Cross-Validation Tracking

Prophet's cross-validation results integrate with MLflow for comprehensive forecast evaluation:

```python
def validate_prophet_model(model, df):
    """Track cross-validation across multiple forecast horizons."""

    with mlflow.start_run():
        # Multiple validation configurations
        cv_configs = [
            {
                "name": "short",
                "initial": "365 days",
                "period": "90 days",
                "horizon": "90 days",
            },
            {
                "name": "medium",
                "initial": "730 days",
                "period": "180 days",
                "horizon": "180 days",
            },
            {
                "name": "long",
                "initial": "1095 days",
                "period": "180 days",
                "horizon": "365 days",
            },
        ]

        for config in cv_configs:
            cv_results = cross_validation(
                model,
                initial=config["initial"],
                period=config["period"],
                horizon=config["horizon"],
            )

            metrics = performance_metrics(cv_results)
            avg_metrics = metrics[["mse", "rmse", "mae", "mape"]].mean()

            # Log with horizon prefix
            for metric, value in avg_metrics.items():
                mlflow.log_metric(f"{config['name']}_{metric}", value)
```

## Hyperparameter Optimization

Track Prophet hyperparameter tuning experiments with MLflow:

```python
import optuna


def objective(trial, df):
    """Optuna objective for Prophet hyperparameter tuning."""

    with mlflow.start_run(nested=True):
        # Define hyperparameter search space
        params = {
            "changepoint_prior_scale": trial.suggest_float(
                "changepoint_prior_scale", 0.001, 0.5
            ),
            "seasonality_prior_scale": trial.suggest_float(
                "seasonality_prior_scale", 0.01, 10
            ),
            "holidays_prior_scale": trial.suggest_float(
                "holidays_prior_scale", 0.01, 10
            ),
            "seasonality_mode": trial.suggest_categorical(
                "seasonality_mode", ["additive", "multiplicative"]
            ),
        }

        # Train model
        model = Prophet(**params)
        model.fit(df)

        # Cross-validation
        cv_results = cross_validation(
            model, initial="730 days", period="180 days", horizon="365 days"
        )
        metrics = performance_metrics(cv_results)
        mape = metrics["mape"].mean()

        # Log parameters and metrics
        mlflow.log_params(params)
        mlflow.log_metric("mape", mape)

        return mape


# Run optimization
with mlflow.start_run(run_name="Prophet HPO"):
    study = optuna.create_study(direction="minimize")
    study.optimize(lambda trial: objective(trial, df), n_trials=50)

    # Log best parameters
    mlflow.log_params({f"best_{k}": v for k, v in study.best_params.items()})
    mlflow.log_metric("best_mape", study.best_value)
```

## Model Registry Integration

Register Prophet models for version control and deployment:

```python
from mlflow import MlflowClient

client = MlflowClient()

with mlflow.start_run():
    # Train and log model
    model = Prophet()
    model.fit(df)

    model_info = mlflow.prophet.log_model(
        pr_model=model,
        name="prophet_model",
        registered_model_name="sales_forecast_model",
    )

    # Tag for deployment tracking
    mlflow.set_tags(
        {
            "model_type": "prophet",
            "forecast_horizon": "365_days",
            "data_frequency": "daily",
        }
    )

# Transition to production
client.transition_model_version_stage(
    name="sales_forecast_model",
    version=model_info.registered_model_version,
    stage="Production",
)
```

## Model Loading and Inference

Load and use logged Prophet models:

```python
# Load as native Prophet model
model_uri = "runs:/<run_id>/prophet_model"
loaded_model = mlflow.prophet.load_model(model_uri)

# Generate forecast
future = loaded_model.make_future_dataframe(periods=365)
forecast = loaded_model.predict(future)

# Load as PyFunc for generic inference
pyfunc_model = mlflow.pyfunc.load_model(model_uri)
predictions = pyfunc_model.predict(pd.DataFrame({"ds": future_dates}))
```

## Batch Forecasting Workflow

Track multiple Prophet models for hierarchical forecasting:

```python
def train_hierarchical_forecasts(data_dict):
    """Train separate Prophet models for multiple series."""

    with mlflow.start_run(run_name="Hierarchical Forecasting"):
        for series_name, series_data in data_dict.items():
            with mlflow.start_run(run_name=f"Series_{series_name}", nested=True):
                model = Prophet()
                model.fit(series_data)

                # Log series-specific info
                mlflow.log_param("series_name", series_name)
                mlflow.log_param("data_points", len(series_data))

                # Cross-validation
                cv_results = cross_validation(
                    model, initial="365 days", period="90 days", horizon="180 days"
                )
                metrics = performance_metrics(cv_results)
                mlflow.log_metrics(metrics[["mape", "rmse"]].mean().to_dict())

                # Log model
                mlflow.prophet.log_model(pr_model=model, name=f"model_{series_name}")
```

:::tip High-Volume Model Training

When training many Prophet models (e.g., for thousands of products), use bulk logging to reduce tracking server load:

```python
# Collect metrics in batch
metrics_batch = {}
params_batch = {}

for series_name, series_data in data_dict.items():
    model = Prophet()
    model.fit(series_data)

    # Collect metrics
    cv_results = cross_validation(
        model, initial="365 days", period="45 days", horizon="90 days"
    )
    perf_metrics = performance_metrics(cv_results)

    metrics_batch[f"{series_name}_mape"] = perf_metrics["mape"].mean()
    params_batch[f"{series_name}_n_points"] = len(series_data)

# Bulk log after collection
with mlflow.start_run():
    mlflow.log_metrics(metrics_batch)
    mlflow.log_params(params_batch)
```

:::

## Forecast Component Logging

Log Prophet forecast components as artifacts:

```python
with mlflow.start_run():
    model = Prophet()
    model.fit(df)

    # Generate forecast
    future = model.make_future_dataframe(periods=365)
    forecast = model.predict(future)

    # Log component plots
    fig_components = model.plot_components(forecast)
    mlflow.log_figure(fig_components, "forecast_components.png")

    # Log forecast plot
    fig_forecast = model.plot(forecast)
    mlflow.log_figure(fig_forecast, "forecast_plot.png")

    # Log model
    mlflow.prophet.log_model(pr_model=model, name="prophet_model")
```

## Learn More

<TilesGrid>
  <TileCard
    icon={Package}
    title="Model Registry"
    description="Version and deploy Prophet models"
    href="/ml/model-registry"
  />
  <TileCard
    icon={GitBranch}
    title="MLflow Tracking"
    description="Track experiments and metrics"
    href="/ml/tracking"
  />
  <TileCard
    icon={TrendingUp}
    title="Model Evaluation"
    description="Evaluate forecasting performance"
    href="/ml/evaluation"
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/classic-ml/traditional-ml/sklearn/index.mdx

```text
---
sidebar_position: 1
sidebar_label: Scikit-learn
---

import FeatureHighlights from "@site/src/components/FeatureHighlights";
import TilesGrid from "@site/src/components/TilesGrid";
import TileCard from "@site/src/components/TileCard";
import { Zap, Package, TrendingUp, GitBranch, BarChart3, Rocket, Database } from "lucide-react";

# MLflow Scikit-learn Integration

## Introduction

Scikit-learn is a comprehensive machine learning library for Python, providing tools for classification, regression, clustering, and preprocessing. Built on NumPy, SciPy, and matplotlib, scikit-learn offers a consistent API across all estimators with unified `fit()`, `predict()`, and `transform()` methods.

MLflow's integration with scikit-learn provides automatic experiment tracking, model management, and deployment capabilities for traditional machine learning workflows.

## Why MLflow + Scikit-learn?

<FeatureHighlights features={[
  {
    icon: Zap,
    title: "Automatic Logging",
    description: "Single line of code (mlflow.sklearn.autolog()) captures all parameters, metrics, cross-validation results, and models without manual instrumentation."
  },
  {
    icon: Package,
    title: "Complete Model Recording",
    description: "Logs trained models with serialization format, input/output signatures, model dependencies, and Python environment for reproducible deployments."
  },
  {
    icon: TrendingUp,
    title: "Hyperparameter Tuning",
    description: "Built-in support for GridSearchCV and RandomizedSearchCV with automatic child run creation for each parameter combination."
  },
  {
    icon: GitBranch,
    title: "Post-Training Metrics",
    description: "Automatically captures evaluation metrics computed after training, including sklearn.metrics function calls and model.score() evaluations."
  }
]} />

## Getting Started

Get started with scikit-learn and MLflow in just a few lines of code:

```python
import mlflow
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split

# Enable autologging
mlflow.sklearn.autolog()

# Load and prepare data
wine = load_wine()
X_train, X_test, y_train, y_test = train_test_split(
    wine.data, wine.target, test_size=0.2, random_state=42
)

# Train model - MLflow automatically logs everything!
with mlflow.start_run():
    model = RandomForestClassifier(n_estimators=100, max_depth=3, random_state=42)
    model.fit(X_train, y_train)

    # Evaluation metrics are automatically captured
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)

    print(f"Train accuracy: {train_score:.3f}, Test accuracy: {test_score:.3f}")
```

Autologging captures all model parameters, training metrics, the trained model, and model signatures.

:::tip Tracking Server Setup
Running locally? MLflow stores experiments in the current directory by default. For team collaboration or remote tracking, **[set up a tracking server](/ml/tracking/tutorials/remote-server)**.
:::

## Autologging

Enable autologging to automatically track scikit-learn experiments:

```python
import mlflow
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split

# Load data
cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, test_size=0.2, random_state=42
)

# Enable autologging
mlflow.sklearn.autolog()

with mlflow.start_run():
    model = GradientBoostingClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Model scoring is automatically captured
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
```

### What Gets Logged

When autologging is enabled, MLflow automatically captures:

- **Parameters**: All model parameters from `estimator.get_params(deep=True)`
- **Metrics**: Training scores, classification/regression metrics, cross-validation results
- **Models**: Serialized models with signatures and input examples
- **Artifacts**: Cross-validation results, metric information, model metadata

For GridSearchCV and RandomizedSearchCV, MLflow creates child runs for parameter combinations and logs the best estimator separately.

## Hyperparameter Tuning

### Grid Search

MLflow automatically creates child runs for hyperparameter tuning:

```python
import mlflow
from sklearn.datasets import load_digits
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV, train_test_split

# Load data
digits = load_digits()
X_train, X_test, y_train, y_test = train_test_split(
    digits.data, digits.target, test_size=0.2, random_state=42
)

# Enable autologging
mlflow.sklearn.autolog(max_tuning_runs=10)

# Define parameter grid
param_grid = {
    "n_estimators": [50, 100, 200],
    "max_depth": [5, 10, 15, None],
    "min_samples_split": [2, 5, 10],
}

with mlflow.start_run(run_name="RF Hyperparameter Tuning"):
    rf = RandomForestClassifier(random_state=42)
    grid_search = GridSearchCV(rf, param_grid, cv=5, scoring="accuracy", n_jobs=-1)
    grid_search.fit(X_train, y_train)

    best_score = grid_search.score(X_test, y_test)
    print(f"Best params: {grid_search.best_params_}")
    print(f"Best CV score: {grid_search.best_score_:.3f}")
    print(f"Test score: {best_score:.3f}")
```

### Optuna Integration

For advanced hyperparameter optimization:

```python
import mlflow
import optuna
from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split

# Load data
cancer = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    cancer.data, cancer.target, test_size=0.2, random_state=42
)

mlflow.sklearn.autolog()


def objective(trial):
    params = {
        "n_estimators": trial.suggest_int("n_estimators", 50, 200),
        "max_depth": trial.suggest_int("max_depth", 3, 10),
        "learning_rate": trial.suggest_float("learning_rate", 0.01, 0.3),
    }

    with mlflow.start_run(nested=True):
        model = GradientBoostingClassifier(**params, random_state=42)
        model.fit(X_train, y_train)
        accuracy = model.score(X_test, y_test)
        return accuracy


with mlflow.start_run():
    study = optuna.create_study(direction="maximize")
    study.optimize(objective, n_trials=20)

    mlflow.log_params({f"best_{k}": v for k, v in study.best_params.items()})
    mlflow.log_metric("best_accuracy", study.best_value)
```

:::note Nested Runs
The `nested=True` parameter creates child runs for each trial under the parent run, enabling hierarchical organization of hyperparameter tuning experiments. Learn more about **[hierarchical runs](/ml/tracking/tracking-api#hierarchical-runs-with-parent-child-relationships)**.
:::

## Learn More

<TilesGrid>
  <TileCard
    icon={Database}
    title="Model Registry"
    description="Register and manage scikit-learn model versions with aliases for deployment workflows."
    href="/ml/model-registry"
  />
  <TileCard
    icon={Rocket}
    title="Model Deployment"
    description="Deploy scikit-learn models to production using MLflow's serving capabilities and cloud integrations."
    href="/ml/deployment"
  />
  <TileCard
    icon={BarChart3}
    title="Model Evaluation"
    description="Evaluate scikit-learn models using MLflow's comprehensive evaluation framework with built-in metrics."
    href="/ml/evaluation"
  />
</TilesGrid>
```

--------------------------------------------------------------------------------

````
