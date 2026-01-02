---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 68
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 68 of 991)

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

---[FILE: quickstart.mdx]---
Location: mlflow-master/docs/docs/classic-ml/getting-started/quickstart.mdx

```text
---
sidebar_position: 2
sidebar_label: "Quickstart"
---

import ImageBox from "@site/src/components/ImageBox";

# MLflow Tracking Quickstart

:::tip

Looking for using MLflow for LLMs/Agent development? Checkout the <ins>[MLflow for GenAI](/genai) documentation</ins> instead. This guide is intended for data scientists who train traditional machine learning models, such as decision trees.

:::

Welcome to MLflow! The purpose of this quickstart is to provide a quick guide to the most essential core APIs of MLflow Tracking. In just a few minutes of following along with this quickstart, you will learn:

- How to **log** parameters, metrics, and a model using the MLflow logging API
- How to navigate to a model in the **MLflow UI**
- How to **load** a logged model for inference

## Step 1 - Set up MLflow

MLflow is available on PyPI. If you don't already have it installed on your system, you can install it with:

```bash
pip install mlflow
```

Then, follow the instructions in the [Set Up MLflow](/ml/getting-started/running-notebooks) guide to set up MLflow.

If you just want to start super quick, run the following code in a notebook cell:

```python
import mlflow

mlflow.set_experiment("MLflow Quickstart")
```

## Step 2 - Prepare training data

Before training our first model, let's prepare the training data and model hyperparameters.

```python
import pandas as pd
from sklearn import datasets
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

# Load the Iris dataset
X, y = datasets.load_iris(return_X_y=True)

# Split the data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Define the model hyperparameters
params = {
    "solver": "lbfgs",
    "max_iter": 1000,
    "multi_class": "auto",
    "random_state": 8888,
}
```

## Step 3 - Train a model with MLflow Autologging

In this step, we train the model on the training data loaded in the previous step, and log the model and its metadata to MLflow. The easiest way to do this is to using MLflow's **Autologging** feature.

```python
import mlflow

# Enable autologging for scikit-learn
mlflow.sklearn.autolog()

# Just train the model normally
lr = LogisticRegression(**params)
lr.fit(X_train, y_train)
```

With just one line of additional code `mlflow.sklearn.autolog()`, now you get the best of both worlds: you can focus on training the model, and MLflow will take care of the rest:

- Saving the trained model.
- Recording the model's performance metrics during training, such as accuracy, precision, AUC curve.
- Logging hyperparameter values used to train the model.
- Track metadata such as input data format, user, timestamp, etc.

To learn more about autologging and supported libraries, see the [Autologging](/ml/tracking/autolog/) documentation.

## Step 4 - View the Run in the MLflow UI

To see the results of training, you can access the MLflow UI by navigating to the URL of the Tracking Server. If you have not started one, open a new terminal and run the following command at the root of the MLflow project and access the UI at http://localhost:5000 (or the port number you specified).

```bash
mlflow server --port 5000
```

When opening the site, you will see a screen similar to the following:

<ImageBox src="/images/tutorials/introductory/quickstart-tracking/quickstart-ui-home.png" alt="MLflow UI Home page" />

The "Experiments" section shows a list of (recently created) experiments. Click on the "MLflow Quickstart" experiment.

<ImageBox src="/images/tutorials/introductory/quickstart-tracking/quickstart-ui-run-list.png" alt="MLflow UI Run list page" />

The training **Run** created by MLflow is listed in the table. Click the run to view the details.

<ImageBox src="/images/tutorials/introductory/quickstart-tracking/quickstart-our-run.png" alt="MLflow UI Run detail page" />

The Run detail page shows an overview of the run, its recorded metrics, hyper-parameters, tags, and more. Play around with the UI to see the different views and features.

Scroll down to the "Model" section and you should see the model that was logged during training. Click on the model to view the details.

<ImageBox src="/images/tutorials/introductory/quickstart-tracking/quickstart-ui-logged-models.png" alt="MLflow UI Model detail page" />

The model page displays similar metadata such as performance metrics and hyper-parameters. It also includes an "Artifacts" section that lists the files that were logged during training. You can also see environment information such as the Python version and dependencies, which are stored for reproducibility.

<ImageBox src="/images/tutorials/introductory/quickstart-tracking/quickstart-our-model.png" alt="MLflow UI Model detail page" />

## Step 5 - Log a model and metadata manually

Now that we have learned how to log a model training run with MLflow autologging, let's step further and learn how to log a model and metadata manually. This is useful when you want to have more control over the logging process.

The steps that we will take are:

- Initiate an MLflow **run** context to start a new run that we will log the model and metadata to.
- Train and test the model.
- **Log** model **parameters** and performance **metrics**.
- **Tag** the run for easy retrieval.

```python
# Start an MLflow run
with mlflow.start_run():
    # Log the hyperparameters
    mlflow.log_params(params)

    # Train the model
    lr = LogisticRegression(**params)
    lr.fit(X_train, y_train)

    # Log the model
    model_info = mlflow.sklearn.log_model(sk_model=lr, name="iris_model")

    # Predict on the test set, compute and log the loss metric
    y_pred = lr.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    mlflow.log_metric("accuracy", accuracy)

    # Optional: Set a tag that we can use to remind ourselves what this run was for
    mlflow.set_tag("Training Info", "Basic LR model for iris data")
```

## Step 6 - Load the model back for inference.

After logging the model, we can perform inference by:

- **Loading** the model using MLflow's `pyfunc` flavor.
- Running **Predict** on new data using the loaded model.

:::info
To load the model as a native scikit-learn model, use `mlflow.sklearn.load_model(model_info.model_uri)` instead of the pyfunc flavor.
:::

```python
# Load the model back for predictions as a generic Python Function model
loaded_model = mlflow.pyfunc.load_model(model_info.model_uri)

predictions = loaded_model.predict(X_test)

iris_feature_names = datasets.load_iris().feature_names

result = pd.DataFrame(X_test, columns=iris_feature_names)
result["actual_class"] = y_test
result["predicted_class"] = predictions

result[:4]
```

The output of this code will look something like this:

<table>
  <thead>
    <tr>
      <th>sepal length (cm)</th>
      <th>sepal width (cm)</th>
      <th>petal length (cm)</th>
      <th>petal width (cm)</th>
      <th>actual_class</th>
      <th>predicted_class</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>6.1</td>
      <td>2.8</td>
      <td>4.7</td>
      <td>1.2</td>
      <td>1</td>
      <td>1</td>
    </tr>
    <tr>
      <td>5.7</td>
      <td>3.8</td>
      <td>1.7</td>
      <td>0.3</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <td>7.7</td>
      <td>2.6</td>
      <td>6.9</td>
      <td>2.3</td>
      <td>2</td>
      <td>2</td>
    </tr>
    <tr>
      <td>6.0</td>
      <td>2.9</td>
      <td>4.5</td>
      <td>1.5</td>
      <td>1</td>
      <td>1</td>
    </tr>
  </tbody>
</table>

## Next Steps

Congratulations on working through the MLflow Tracking Quickstart! You should now have a basic understanding of how to use the MLflow Tracking APIs to log models.

- [MLflow for GenAI](/genai): Learn how to use MLflow for GenAI/LLM development.
- [MLflow for Deep Learning](/ml/deep-learning): Learn how to use MLflow for deep learning frameworks such as PyTorch, TensorFlow, etc.
- [MLflow Tracking](/ml/tracking/): Learn more about the MLflow Tracking APIs.
- [Self-hosting Guide](/self-hosting): Learn how to self-host the MLflow Tracking Server and set it up for team collaboration.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/classic-ml/getting-started/hyperparameter-tuning/index.mdx

```text
---
sidebar_position: 3
toc_max_heading_level: 4
sidebar_label: Hyperparameter Tuning
---

import ImageBox from "@site/src/components/ImageBox";

# Tracking Hyperparameter Tuning with MLflow

<ImageBox src="/images/tutorials/introductory/hyperparameter-tuning/ui-compare-metrics.png" alt="MLflow UI Chart page" width="80%" />

Hyperparameter tuning is an important process for improving the performance of a machine learning model, however, it can be cumbersome to manually track and compare the different trials. MLflow provides a powerful framework for hyperparameter tuning that allows you to systematically explore the hyperparameter space and find the best model.

By the end of this tutorial, you'll know how to:

- Set up your environment with MLflow tracking.
- Define a partial function that fits a machine learning model that can be used with a hyperparameter tuning library.
- Use Optuna for hyperparameter tuning.
- Leverage child runs within MLflow to keep track of each iteration during the hyperparameter tuning process.

## Prerequisites: Set up MLflow and Optuna

MLflow is available on PyPI. Install MLflow and Optuna (Hyperparameter tuning library) with:

```bash
pip install mlflow optuna
```

Then, follow the instructions in the [Set Up MLflow](/ml/getting-started/running-notebooks) guide to set up MLflow.

:::tip Team Collaboration and Managed Setup
For production environments or team collaboration, consider hosting a shared <ins>[MLflow Tracking Server](/self-hosting)</ins>. For a fully-managed solution, get started with Databricks Free Trial by visiting the <ins>[Databricks Trial Signup Page](https://signup.databricks.com/?destination_url=/ml/experiments-signup?source=OSS_DOCS&dbx_source=TRY_MLFLOW&signup_experience_step=EXPRESS&provider=MLFLOW&utm_source=OSS_DOCS)</ins> and follow the instructions outlined there.
:::

## Step 1: Create a new experiment

```python
import mlflow

# The set_experiment API creates a new experiment if it doesn't exist.
mlflow.set_experiment("Hyperparameter Tuning Experiment")
```

## Step 2: Prepare Your Data

First, let's load a sample dataset and split it into training and validation sets:

```python
from sklearn.model_selection import train_test_split
from sklearn.datasets import fetch_california_housing

X, y = fetch_california_housing(return_X_y=True)
X_train, X_val, y_train, y_val = train_test_split(X, y, random_state=0)
```

## Step 3: Define the objective function

In Optuna, a **study** is a single optimization task, representing the entire hyperparameter tuning
session consisting of multiple **trials**. A trial is a single execution of the objective function,
namely, training a model with a single combination of hyperparameters.

In MLflow, this structure is represented by a **parent run** and **child runs**. A parent run is a
run that contains all the child runs for different trials. The parent-child relationship allows us
to keep track of each trial during the hyperparameter tuning process and group them nicely in the
MLflow UI.

First, let's define the objective function that is executed for each trial. To log the parameters,
metrics, and model file, we use MLflow's API inside the objective function. An MLflow run is created
with the `nested=True` flag to indicate it is a child run.

```python
import mlflow
import optuna
import sklearn


def objective(trial):
    # Setting nested=True will create a child run under the parent run.
    with mlflow.start_run(nested=True, run_name=f"trial_{trial.number}") as child_run:
        rf_max_depth = trial.suggest_int("rf_max_depth", 2, 32)
        rf_n_estimators = trial.suggest_int("rf_n_estimators", 50, 300, step=10)
        rf_max_features = trial.suggest_float("rf_max_features", 0.2, 1.0)
        params = {
            "max_depth": rf_max_depth,
            "n_estimators": rf_n_estimators,
            "max_features": rf_max_features,
        }
        # Log current trial's parameters
        mlflow.log_params(params)

        regressor_obj = sklearn.ensemble.RandomForestRegressor(**params)
        regressor_obj.fit(X_train, y_train)

        y_pred = regressor_obj.predict(X_val)
        error = sklearn.metrics.mean_squared_error(y_val, y_pred)
        # Log current trial's error metric
        mlflow.log_metrics({"error": error})

        # Log the model file
        mlflow.sklearn.log_model(regressor_obj, name="model")
        # Make it easy to retrieve the best-performing child run later
        trial.set_user_attr("run_id", child_run.info.run_id)
        return error
```

## Step 3: Run the hyperparameter tuning study

Now, let's run the hyperparameter tuning study using Optuna. We create a parent run named
"study" and log the best trial's parameters and metrics there.

```python
# Create a parent run that contains all child runs for different trials
with mlflow.start_run(run_name="study") as run:
    # Log the experiment settings
    n_trials = 30
    mlflow.log_param("n_trials", n_trials)

    study = optuna.create_study(direction="minimize")
    study.optimize(objective, n_trials=n_trials)

    # Log the best trial and its run ID
    mlflow.log_params(study.best_trial.params)
    mlflow.log_metrics({"best_error": study.best_value})
    if best_run_id := study.best_trial.user_attrs.get("run_id"):
        mlflow.log_param("best_child_run_id", best_run_id)
```

## Step 4: View the results in the MLflow UI

To see the results of training, you can access the MLflow UI by navigating to the URL of the Tracking Server. If you have not started one, open a new terminal and run the following command at the root of the MLflow project and access the UI at http://localhost:5000 (or the port number you specified).

```bash
mlflow server --port 5000
```

When opening the site, you will see a screen similar to the following:

<ImageBox src="/images/tutorials/introductory/hyperparameter-tuning/ui-home.png" alt="MLflow UI Home page" />

The "Experiments" section shows a list of (recently created) experiments. Click on the "Hyperparameter Tuning Experiment" experiment we've created for this tutorial.

<ImageBox src="/images/tutorials/introductory/hyperparameter-tuning/ui-run-list.png" alt="MLflow UI Run list page" />

Click the chart icon on the top left corner to view a visual representation of the tuning result. You can further click each child run to see the detailed metrics and parameters for each trial.

<ImageBox src="/images/tutorials/introductory/hyperparameter-tuning/ui-compare-metrics.png" alt="MLflow UI Chart page" />

## Step 5: Register Your Best Model

Once you identified the best trial, you can register the model into [MLflow Model Registry](/ml/model-registry) for promoting it to production.

```python
# Register the best model using the model URI
mlflow.register_model(
    model_uri="runs:/d0210c58afff4737a306a2fbc5f1ff8d/model",
    name="housing-price-predictor",
)

# > Successfully registered model 'housing-price-predictor'.
# > Created version '1' of model 'housing-price-predictor'.
```

## Next Steps

- [MLflow Tracking](/ml/tracking/): Learn more about the MLflow Tracking APIs.
- [MLflow Model Registry](/ml/model-registry): Learn how to register and manage model lifecycle in the MLflow Model Registry.
- [MLflow for Deep Learning](/ml/deep-learning): Learn how to use MLflow for deep learning frameworks such as PyTorch, TensorFlow, etc.
- [Self-hosting Guide](/self-hosting): Learn how to self-host the MLflow Tracking Server and set it up for team collaboration.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/classic-ml/getting-started/running-notebooks/index.mdx

```text
---
description: "Learn how to connect your development environment to MLflow, whether using OSS MLflow or a managed offering."
last_update:
  date: 2025-05-18
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import TabsWrapper from "@site/src/components/TabsWrapper";

# Connect Your Development Environment to MLflow

This guide shows you how to connect your development environment to an MLflow Experiment. You can run MLflow on your local machine, self-host the open source MLflow service, or use a managed offering, such as Databricks Managed MLflow.

## Prerequisites

<Tabs>
  <TabItem value="oss" label="OSS MLflow">

    - **Python Environment**: Python 3.9+ with pip installed

  </TabItem>
  <TabItem value="managed" label="Databricks">

    - **Databricks Workspace**: Access to a Databricks workspace

    :::note[Authentication Methods]
    This guide describes using a Databricks Personal Access Token. MLflow also works with the other <ins>[Databricks-supported authentication methods](https://docs.databricks.com/aws/en/dev-tools/auth)</ins>.
    :::

  </TabItem>
</Tabs>

## Setup Instructions

<TabsWrapper>
<Tabs>
  <TabItem value="oss" label="OSS MLflow">

        #### Step 1: Install MLflow

        ```bash
        pip install --upgrade "mlflow>=3.1"
        ```

        <br/>

        #### Step 2: Configure Tracking

        MLflow supports different backends for tracking your experiment data. Choose one of the following options to get started. Refer to the [Self Hosting Guide](/self-hosting) for detailed setup and configurations.

        **Option A: Database (Recommended)**

        Set the tracking URI to a local database URI (e.g., `sqlite:///mlflow.db`). This is recommended option for quickstart and local development.

        ```python
        import mlflow

        mlflow.set_tracking_uri("sqlite:///mlflow.db")
        mlflow.set_experiment("my-first-experiment")
        ```

        **Option B: File System**

        MLflow will automatically use local file storage if no tracking URI is specified:

        ```python
        import mlflow

        # Creates local mlruns directory for experiments
        mlflow.set_experiment("my-first-experiment")
        ```

        :::warning[TO BE DEPRECATED SOON]

          File system backend is in Keep-the-Light-On (KTLO) mode and will not receive most of the new features in MLflow.
          We recommend using the database backend instead. Database backend will also be the default option soon.

        :::

        **Option C: Remote Tracking Server**

        Start a remote MLflow tracking server following the [Self Hosting Guide](/self-hosting).
        Then configure your client to use the remote server:

        ```python
        import mlflow

        # Connect to remote MLflow server
        mlflow.set_tracking_uri("http://localhost:5000")
        mlflow.set_experiment("my-first-experiment")
        ```

        Alternatively, you can configure the tracking URI and experiment using environment variables:

        ```bash
        export MLFLOW_TRACKING_URI="http://localhost:5000"
        export MLFLOW_EXPERIMENT_NAME="my-first-experiment"
        ```

        <br/>

        #### Step 3: Verify Your Connection

        Create a test file and run this code:

        ```python
        import mlflow

        # Print connection information
        print(f"MLflow Tracking URI: {mlflow.get_tracking_uri()}")
        print(f"Active Experiment: {mlflow.get_experiment_by_name('my-first-experiment')}")

        # Test logging
        with mlflow.start_run():
            mlflow.log_param("test_param", "test_value")
            print("✓ Successfully connected to MLflow!")
        ```

        <br/>

        #### Step 4: Access MLflow UI

        If you are using local tracking (option A or B), run the following command and access the MLflow UI at `http://localhost:5000`.

        ```bash
        # For Option A
        mlflow server --backend-store-uri sqlite:///mlflow.db --port 5000
        # For Option B
        mlflow server --port 5000
        ```

        If you have the remote tracking server running (option C), access the MLflow UI at the same URI.


        :::info[ACCESS DENIED?]

          When using the remote tracking server, you may hit an access denied error when accessing the MLflow UI
          from a browser.

          > Invalid Host header - possible DNS rebinding attack detected

          The common cause for this error is the tracking server does not allow requests from your origin to
          prevent clickjacking attacks. You need to set up an allowlist of CORS origins in the tracking server
          configuration in this case.
          Refer to the <ins>[Network Security Guide](/self-hosting/security/network#cors-origins)</ins> for more details.

        :::

      </TabItem>

  <TabItem value="databricks-ide" label="Databricks - Local IDE">

    #### Step 1: Install MLflow

    Install MLflow with Databricks connectivity:

    ```bash
    pip install --upgrade "mlflow[databricks]>=3.1"
    ```

    <br/>

    #### Step 2: Create an MLflow Experiment

    1. Open your Databricks workspace
    2. Go to **Experiments** in the left sidebar under **Machine Learning**
    3. At the top of the Experiments page, click on **New Experiment**

    <br/>

    #### Step 3: Configure Authentication

    Choose one of the following authentication methods:

    **Option A: Environment Variables**

    1. In your MLflow Experiment, click **Generate API Key**
    2. Copy and run the generated code in your terminal:

    ```bash
    export DATABRICKS_TOKEN=<databricks-personal-access-token>
    export DATABRICKS_HOST=https://<workspace-name>.cloud.databricks.com
    export MLFLOW_TRACKING_URI=databricks
    export MLFLOW_EXPERIMENT_ID=<experiment-id>
    ```

    **Option B: .env File**

    1. In your MLflow Experiment, click **Generate API Key**
    2. Copy the generated code to a `.env` file in your project root:

    ```bash
    DATABRICKS_TOKEN=<databricks-personal-access-token>
    DATABRICKS_HOST=https://<workspace-name>.cloud.databricks.com
    MLFLOW_TRACKING_URI=databricks
    MLFLOW_EXPERIMENT_ID=<experiment-id>
    ```

    3. Install the `python-dotenv` package:

    ```bash
    pip install python-dotenv
    ```

    4. Load environment variables in your code:

    ```python
    # At the beginning of your Python script
    from dotenv import load_dotenv

    # Load environment variables from .env file
    load_dotenv()
    ```

    #### Step 4: Verify Your Connection

    Create a test file and run this code to verify your connection:

    ```python
    import mlflow

    # Test logging to verify connection
    print(f"MLflow Tracking URI: {mlflow.get_tracking_uri()}")
    with mlflow.start_run():
        print("✓ Successfully connected to MLflow!")
    ```

  </TabItem>
  <TabItem value="databricks-notebook" label="Databricks - Notebook">
    #### Step 1: Install MLflow

    Databricks runtimes include MLflow, but for the best experience, update to the latest version:

    ```bash
    %pip install --upgrade "mlflow[databricks]>=3.1"
    dbutils.library.restartPython()
    ```
    <br/>

    #### Step 2: Create a Notebook

    Creating a Databricks Notebook will create an MLflow Experiment that is the container for your ML projects. Learn more about Experiments in the [MLflow documentation](/ml/tracking).

    1. Open your Databricks workspace
    2. Go to **New** at the top of the left sidebar
    3. Click **Notebook**

    <br/>

    #### Step 3: Configure Authentication

    No additional authentication configuration is needed when working within a Databricks Notebook. The notebook automatically has access to your workspace and the associated MLflow Experiment.

    <br/>

    #### Step 4: Verify Your Connection

    Run this code in a notebook cell to verify your connection:

    ```python
    import mlflow

    # Test logging to verify connection
    print(f"MLflow Tracking URI: {mlflow.get_tracking_uri()}")
    with mlflow.start_run():
        print("✓ Successfully connected to MLflow!")
    ```

  </TabItem>
</Tabs>
</TabsWrapper>
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/classic-ml/mlflow-3/index.mdx

```text
---
sidebar_label: MLflow 3 Migration Guide
sidebar_position: 1
title: MLflow 3 Migration Guide
description: Guide for migrating from MLflow 2.x to MLflow 3.x
---

import { APILink } from "@site/src/components/APILink";

# MLflow 3 Migration Guide

This guide covers breaking changes and API updates when migrating from MLflow 2.x to MLflow 3.x.

## Installation

Install MLflow 3 by running:

```bash
pip install "mlflow>=3.1"
```

Resources: [Website](https://mlflow.org/) | [Documentation](https://mlflow.org/docs/latest/index.html) | [Release Notes](https://mlflow.org/releases/3)

## Key Changes from MLflow 2.x

### Model Logging API Changes

**MLflow 2.x:**

```python
with mlflow.start_run():
    mlflow.pyfunc.log_model(
        artifact_path="model",
        python_model=python_model,
    )
```

**MLflow 3:**

```python
# No longer requires starting a Run before logging models
mlflow.pyfunc.log_model(
    name="model",  # Use 'name' instead of 'artifact_path'
    python_model=python_model,
)
```

:::note
Models are now first-class entities in MLflow 3. You can call `log_model` directly without the `mlflow.start_run()` context manager. Use the `name` parameter to enable searching for LoggedModels.
:::

### Model Artifacts Storage Location

**MLflow 2.x:**

```shell
experiments/
  └── <experiment_id>/
    └── <run_id>/
      └── artifacts/
        └── ... # model artifacts stored here
```

**MLflow 3:**

```shell
experiments/
  └── <experiment_id>/
    └── models/
      └── <model_id>/
        └── artifacts/
          └── ... # model artifacts stored here
```

:::warning
This change impacts the behavior of <APILink fn="mlflow.client.MlflowClient.list_artifacts" />. Model artifacts are no longer stored as run artifacts.
:::

### UI Changes

**Artifacts Tab**

In MLflow 3.x, the **Artifacts** tab in the run page no longer displays model artifacts. Model artifacts are now accessed through the **Logged Models** page, which provides a dedicated view for model-specific information and artifacts.

## Breaking Changes

### Removed Features

- **MLflow Recipes**: Completely removed ([#15250](https://github.com/mlflow/mlflow/pull/15250)). Migrate to standard MLflow tracking and model registry functionality or consider MLflow Projects.

- **Model Flavors**: The following flavors are no longer supported:
  - `fastai` ([#15255](https://github.com/mlflow/mlflow/pull/15255)) - Use `mlflow.pyfunc` with custom wrapper
  - `mleap` ([#15259](https://github.com/mlflow/mlflow/pull/15259)) - Use `mlflow.onnx` or `mlflow.pyfunc`
  - `diviner` - Use `mlflow.pyfunc` with custom wrapper
  - `gluon` - Use `mlflow.pytorch` or `mlflow.onnx`

- **AI Gateway**: The 'routes' and 'route_type' config keys removed ([#15331](https://github.com/mlflow/mlflow/pull/15331)). Use the new configuration format.

- **Deployment Server**: The deployment server and `start-server` CLI command removed ([#15327](https://github.com/mlflow/mlflow/pull/15327)). Use `mlflow models serve` or containerized deployments.

### Tracking API Changes

#### `run_uuid` Attribute Removed

Replace `run_uuid` with `run_id`:

```python
# MLflow 2.x
run_info.run_uuid

# MLflow 3
run_info.run_id
```

#### Git Tags Removed

The following run tags have been removed ([#15366](https://github.com/mlflow/mlflow/pull/15366)):

- `mlflow.gitBranchName`
- `mlflow.gitRepoURL`

#### TensorFlow Autologging

The `every_n_iter` parameter removed from TensorFlow autologging ([#15412](https://github.com/mlflow/mlflow/pull/15412)). Implement custom logging callbacks for fine-tuned logging frequency.

### Model API Changes

#### Removed Parameters

The following parameters have been removed from model logging/saving APIs:

- `example_no_conversion` ([#15322](https://github.com/mlflow/mlflow/pull/15322))
- `code_path` ([#15368](https://github.com/mlflow/mlflow/pull/15368)) - Use default code directory structure
- `requirements_file` from PyTorch flavor ([#15369](https://github.com/mlflow/mlflow/pull/15369)) - Use `pip_requirements` or `extra_pip_requirements`
- `inference_config` from Transformers flavor ([#15415](https://github.com/mlflow/mlflow/pull/15415)) - Set configuration before logging

#### ModelInfo Changes

The `signature_dict` property removed from `ModelInfo` ([#15367](https://github.com/mlflow/mlflow/pull/15367)). Use the `signature` property instead.

### Evaluation API Changes

#### Baseline Model Comparison

The `baseline_model` parameter removed ([#15362](https://github.com/mlflow/mlflow/pull/15362)). Use `mlflow.validate_evaluation_results` API to compare models:

```python
# For classical ML models, use mlflow.models.evaluate
result_1 = mlflow.models.evaluate(
    model_1, data, targets="label", model_type="classifier"
)
result_2 = mlflow.models.evaluate(
    model_2, data, targets="label", model_type="classifier"
)

# Compare results
mlflow.validate_evaluation_results(result_1, result_2)
```

:::note
For GenAI evaluation, use `mlflow.genai.evaluate` with the new evaluation framework. See the **[GenAI Evaluation Migration Guide](https://mlflow.org/docs/latest/genai/eval-monitor/legacy-llm-evaluation/)** for details on migrating from the legacy LLM evaluation approach.
:::

#### MetricThreshold Changes

Use `greater_is_better` instead of `higher_is_better`:

```python
# MLflow 2.x
threshold = MetricThreshold(higher_is_better=True)

# MLflow 3
threshold = MetricThreshold(greater_is_better=True)
```

#### Custom Metrics

The `custom_metrics` parameter removed ([#15361](https://github.com/mlflow/mlflow/pull/15361)). Use the newer custom metrics approach in the evaluation API.

#### Explainer Logging

`mlflow.models.evaluate` no longer logs an explainer as a model by default. To enable:

```python
mlflow.models.evaluate(
    ...,
    evaluator_config={
        "log_model_explainability": True,
        "log_explainer": True,
    },
)
```

### Environment Variables

`MLFLOW_GCS_DEFAULT_TIMEOUT` removed ([#15365](https://github.com/mlflow/mlflow/pull/15365)). Configure timeouts using standard GCS client library approaches.

## Migration FAQs

### Can MLflow 3.x load resources created with MLflow 2.x?

Yes, MLflow 3.x can load resources (runs, models, traces, etc.) created with MLflow 2.x. However, the reverse is not true.

:::warning
When testing MLflow 3.x, use **a separate environment** to avoid conflicts with MLflow 2.x.
:::

### `load_model` throws `ResourceNotFound` error. What's wrong?

In MLflow 3.x, model artifacts are stored in a different location. Use the model URI returned by `log_model`:

```python
# ❌ Don't use mlflow.get_artifact_uri("model")
with mlflow.start_run() as run:
    mlflow.sklearn.log_model(my_model, name="model")
    mlflow.sklearn.load_model(mlflow.get_artifact_uri("model"))  # Fails!

# ✅ Use the model URI from log_model
with mlflow.start_run() as run:
    info = mlflow.sklearn.log_model(my_model, name="model")

    # Recommended: use model_uri from result
    mlflow.sklearn.load_model(info.model_uri)

    # Alternative: use model_id
    mlflow.sklearn.load_model(f"models:/{info.model_id}")

    # Deprecated: use run_id (will be removed in future)
    mlflow.sklearn.load_model(f"runs:/{run.info.run_id}/model")
```

### How do I modify model requirements?

Use <APILink fn="mlflow.models.update_model_requirements" />:

```python
import mlflow


class DummyModel(mlflow.pyfunc.PythonModel):
    def predict(self, context, model_input: list[str]) -> list[str]:
        return model_input


model_info = mlflow.pyfunc.log_model(name="model", python_model=DummyModel())
mlflow.models.update_model_requirements(
    model_uri=model_info.model_uri,
    operation="add",
    requirement_list=["scikit-learn"],
)
```

### How do I stay on MLflow 2.x?

Pin MLflow to the latest 2.x version:

```bash
pip install 'mlflow<3'
```

## Compatibility

We strongly recommend upgrading **both client and server** to MLflow 3.x for the best experience. A mismatch between client and server versions may lead to unexpected behavior.

## Getting Help

For detailed guidance on migrating specific code, please consult:

- [MLflow Documentation](https://mlflow.org/docs/latest)
- [MLflow Community Forum](https://github.com/mlflow/mlflow/discussions)
- [MLflow Slack](https://mlflow.org/slack)
- [Release Notes](https://mlflow.org/releases/3)
```

--------------------------------------------------------------------------------

````
