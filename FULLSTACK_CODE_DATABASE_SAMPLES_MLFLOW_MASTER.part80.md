---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 80
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 80 of 991)

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
Location: mlflow-master/docs/docs/classic-ml/tracking/index.mdx

```text
---
sidebar_label: Overview
sidebar_position: 0
---

import { PageCard, CardGroup } from "@site/src/components/Card";
import { APILink } from "@site/src/components/APILink";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import { Table } from "@site/src/components/Table";

# MLflow Tracking

The MLflow Tracking is an API and UI for logging parameters, code versions, metrics, and output files
when running your machine learning code and for later visualizing the results.
MLflow Tracking provides <APILink fn="mlflow.python" hash="">Python</APILink>
, <APILink fn="mlflow.rest" hash="">REST</APILink>
, <APILink fn="mlflow.r" hash="">R</APILink>,
and <APILink fn="mlflow.java" hash="">Java</APILink> APIs.

<figure>
  ![](/images/tracking/tracking-metrics-ui-temp.png)
  <figcaption>A screenshot of the MLflow Tracking UI, showing a plot of validation loss metrics during model training.</figcaption>
</figure>

## Quickstart

If you haven't used MLflow Tracking before, we strongly recommend going through the following quickstart tutorial.

<CardGroup>
  <PageCard
    headerText="MLflow Tracking Quickstart"
    link="/ml/tracking/quickstart"
    text="A great place to start to learn the fundamentals of MLflow Tracking! Learn in 5 minutes how to log, register, and load a model for inference."
  />
</CardGroup>

## Concepts

### Runs

MLflow Tracking is organized around the concept of **runs**, which are executions of some piece of
data science code, for example, a single `python train.py` execution. Each run records metadata
(various information about your run such as metrics, parameters, start and end times) and artifacts
(output files from the run such as model weights, images, etc).

### Models

Models represent the trained machine learning artifacts that are produced during your runs. Logged Models contain their own metadata and artifacts similar to runs.

### Experiments

An experiment groups together runs and models for a specific task. You can create an experiment using the CLI, API, or UI.
The MLflow API and UI also let you create and search for experiments. See [Organizing Runs into Experiments](/ml/tracking/tracking-api#experiment-organization)
for more details on how to organize your runs into experiments.

## Tracking Runs \{#start-logging}

[MLflow Tracking APIs](/ml/tracking/tracking-api) provide a set of functions to track your runs. For example, you can call <APILink fn="mlflow.start_run" /> to start a new run,
then call [Logging Functions](/ml/tracking/tracking-api) such as <APILink fn="mlflow.log_param" /> and <APILink fn="mlflow.log_metric" /> to log parameters and metrics respectively.
Please visit the [Tracking API documentation](/ml/tracking/tracking-api) for more details about using these APIs.

```python
import mlflow

with mlflow.start_run():
    mlflow.log_param("lr", 0.001)
    # Your ml code
    ...
    mlflow.log_metric("val_loss", val_loss)
```

Alternatively, [Auto-logging](/ml/tracking/autolog) offers an ultra-quick setup for starting MLflow tracking.
This powerful feature allows you to log metrics, parameters, and models without the need for explicit log statements -
all you need to do is call <APILink fn="mlflow.autolog" /> before your training code. Auto-logging supports popular
libraries such as [Scikit-learn](/ml/tracking/autolog#autolog-sklearn), [XGBoost](/ml/tracking/autolog#autolog-xgboost), [PyTorch](/ml/tracking/autolog#autolog-pytorch),
[Keras](/ml/tracking/autolog#autolog-keras), [Spark](/ml/tracking/autolog#autolog-spark), and more. See [Automatic Logging Documentation](/ml/tracking/autolog)
for supported libraries and how to use auto-logging APIs with each of them.

```python
import mlflow

mlflow.autolog()

# Your training code...
```

:::note
By default, without any particular server/database configuration, MLflow Tracking logs data to the local `mlruns` directory.
If you want to log your runs to a different location, such as a remote database and cloud storage, in order to share your results with
your team, follow the instructions in the [Set up MLflow Tracking Environment](#tracking-setup) section.
:::

### Searching Logged Models Programmatically \{#search_logged_models}

MLflow 3 introduces powerful model search capabilities through <APILink fn="mlflow.search_logged_models" />. This API allows you to find specific models across your experiments based on performance metrics, parameters, and model attributes using SQL-like syntax.

```python
import mlflow

# Find high-performing models across experiments
top_models = mlflow.search_logged_models(
    experiment_ids=["1", "2"],
    filter_string="metrics.accuracy > 0.95 AND params.model_type = 'RandomForest'",
    order_by=[{"field_name": "metrics.f1_score", "ascending": False}],
    max_results=5,
)

# Get the best model for deployment
best_model = mlflow.search_logged_models(
    experiment_ids=["1"],
    filter_string="metrics.accuracy > 0.9",
    max_results=1,
    order_by=[{"field_name": "metrics.accuracy", "ascending": False}],
    output_format="list",
)[0]

# Load the best model directly
loaded_model = mlflow.pyfunc.load_model(f"models:/{best_model.model_id}")
```

**Key Features:**

- **SQL-like filtering**: Use `metrics.`, `params.`, and attribute prefixes to build complex queries
- **Dataset-aware search**: Filter metrics based on specific datasets for fair model comparison
- **Flexible ordering**: Sort by multiple criteria to find the best models
- **Direct model loading**: Use the new `models:/<model_id>` URI format for immediate model access

For comprehensive examples and advanced search patterns, see the [Search Logged Models Guide](/ml/search/search-models).

### Querying Runs Programmatically \{#tracking_query_api}

You can also access all of the functions in the Tracking UI programmatically with <APILink fn="mlflow.client.MlflowClient">MlflowClient</APILink>.

For example, the following code snippet search for runs that has the best validation loss among all runs in the experiment.

```python
client = mlflow.tracking.MlflowClient()
experiment_id = "0"
best_run = client.search_runs(
    experiment_id, order_by=["metrics.val_loss ASC"], max_results=1
)[0]
print(best_run.info)
# {'run_id': '...', 'metrics': {'val_loss': 0.123}, ...}
```

## Tracking Models

MLflow 3 introduces enhanced model tracking capabilities that allow you to log multiple model checkpoints within a single run and track their performance against different datasets. This is particularly useful for deep learning workflows where you want to save and compare model checkpoints at different training stages.

### Logging Model Checkpoints

You can log model checkpoints at different steps during training using the `step` parameter in model logging functions. Each logged model gets a unique model ID that you can use to reference it later.

```python
import mlflow
import mlflow.pytorch

with mlflow.start_run() as run:
    for epoch in range(100):
        # Train your model
        train_model(model, epoch)

        # Log model checkpoint every 10 epochs
        if epoch % 10 == 0:
            model_info = mlflow.pytorch.log_model(
                pytorch_model=model,
                name=f"checkpoint-epoch-{epoch}",
                step=epoch,
                input_example=sample_input,
            )

            # Log metrics linked to this specific model checkpoint
            accuracy = evaluate_model(model, validation_data)
            mlflow.log_metric(
                key="accuracy",
                value=accuracy,
                step=epoch,
                model_id=model_info.model_id,  # Link metric to specific model
                dataset=validation_dataset,
            )
```

### Linking Metrics to Models and Datasets

MLflow 3 allows you to link metrics to specific model checkpoints and datasets, providing better traceability of model performance:

```python
# Create a dataset reference
train_dataset = mlflow.data.from_pandas(train_df, name="training_data")

# Log metric with model and dataset links
mlflow.log_metric(
    key="f1_score",
    value=0.95,
    step=epoch,
    model_id=model_info.model_id,  # Links to specific model checkpoint
    dataset=train_dataset,  # Links to specific dataset
)
```

### Searching and Ranking Model Checkpoints

Use <APILink fn="mlflow.search_logged_models" /> to search and rank model checkpoints based on their performance metrics:

```python
# Search for all models in a run, ordered by accuracy
ranked_models = mlflow.search_logged_models(
    filter_string=f"source_run_id='{run.info.run_id}'",
    order_by=[{"field_name": "metrics.accuracy", "ascending": False}],
    output_format="list",
)

# Get the best performing model
best_model = ranked_models[0]
print(f"Best model: {best_model.name}")
print(f"Accuracy: {best_model.metrics[0].value}")

# Load the best model for inference
loaded_model = mlflow.pyfunc.load_model(f"models:/{best_model.model_id}")
```

### Model URIs in MLflow 3

MLflow 3 introduces a new model URI format that uses model IDs instead of run IDs, providing more direct model referencing:

```python
# New MLflow 3 model URI format
model_uri = f"models:/{model_info.model_id}"
loaded_model = mlflow.pyfunc.load_model(model_uri)

# This replaces the older run-based URI format:
# model_uri = f"runs:/{run_id}/model_path"
```

This new approach provides several advantages:

- **Direct model reference**: No need to know the run ID and artifact path
- **Better model lifecycle management**: Each model checkpoint has its own unique identifier
- **Improved model comparison**: Easily compare different checkpoints within the same run
- **Enhanced traceability**: Clear links between models, metrics, and datasets

## Tracking Datasets

MLflow offers the ability to track datasets that are associated with model training events. These metadata associated with the Dataset can be stored through the use of the <APILink fn="mlflow.log_input" /> API.
To learn more, please visit the [MLflow data documentation](/ml/dataset/) to see the features available in this API.

## Explore Runs, Models, and Results

### Tracking UI \{#tracking_ui}

The Tracking UI lets you visually explore your experiments, runs, and models, as shown on top of this page.

- Experiment-based run listing and comparison (including run comparison across multiple experiments)
- Searching for runs by parameter or metric value
- Visualizing run metrics
- Downloading run results (artifacts and metadata)

These features are available for models as well, as shown below.

<figure>
  ![MLflow UI Experiment view page models tab](/images/tracking/tracking-models-ui.png)
  <figcaption>A screenshot of the MLflow Tracking UI on the models tab, showing a list of models under the experiment.</figcaption>
</figure>

If you log runs to a local `mlruns` directory, run the following command in the directory above it,
then access http://127.0.0.1:5000 in your browser.

```bash
mlflow server --port 5000
```

Alternatively, the [MLflow Tracking Server](#tracking_server) serves the same UI and enables remote
storage of run artifacts. In that case, you can view the UI at `http://<IP address of your MLflow tracking server>:5000`
from any machine that can connect to your tracking server.

## Set up the MLflow Tracking Environment \{#tracking-setup}

:::note
If you just want to log your experiment data and models to local files, you can skip this section.
:::

MLflow Tracking supports many different scenarios for your development workflow. This section will guide you through how to set up the MLflow Tracking environment for your particular use case.
From a bird's-eye view, the MLflow Tracking environment consists of the following components.

### Components

#### [MLflow Tracking APIs](/ml/tracking/tracking-api)

You can call MLflow Tracking APIs in your ML code to log runs and communicate with the MLflow Tracking Server if necessary.

#### [Backend Store](/self-hosting/architecture/backend-store)

The backend store persists various metadata for each [Run](#runs), such as run ID, start and end times, parameters, metrics, etc.
MLflow supports two types of storage for the backend: **file-system-based** like local files and **database-based** like PostgreSQL.

Additionally, if you are interfacing with a managed service (such as Databricks or Azure Machine Learning), you will be interfacing with a
REST-based backend store that is externally managed and not directly accessible.

#### [Artifact Store](/self-hosting/architecture/artifact-store) \{#artifact-stores}

Artifact store persists (typically large) artifacts for each run, such as model weights (e.g. a pickled scikit-learn model),
images (e.g. PNGs), model and data files (e.g. [Parquet](https://parquet.apache.org) file). MLflow stores artifacts ina a
local file (`mlruns`) by default, but also supports different storage options such as Amazon S3 and Azure Blob Storage.

For models which are logged as MLflow artifacts, you can refer the model through a model URI of format: `models:/<model_id>`,
where 'model_id' is the unique identifier assigned to the logged model. This replaces the older `runs:/<run_id>/<artifact_path>` format
and provides more direct model referencing.

If the model is registered in the [MLflow Model Registry](/ml/model-registry),
you can also refer the the model through a model URI of format: `models:/<model-name>/<model-version>`,
see [MLflow Model Registry](/ml/model-registry) for details.

#### [MLflow Tracking Server](/self-hosting/architecture/tracking-server) (Optional) \{#tracking_server}

MLflow Tracking Server is a stand-alone HTTP server that provides REST APIs for accessing backend and/or artifact store.
Tracking server also offers flexibility to configure what data to server, govern access control, versioning, and etc. Read
[MLflow Tracking Server documentation](/self-hosting) for more details.

### Common Setups \{#tracking_setup}

By configuring these components properly, you can create an MLflow Tracking environment suitable for your team's development workflow.
The following diagram and table show a few common setups for the MLflow Tracking environment.

![](/images/tracking/tracking-setup-overview.png)

<Table>
  <thead>
    <tr>
      <th></th>
      <th>1. Localhost (default)</th>
      <th>2. Local Tracking with Local Database</th>
      <th>3. Remote Tracking with [MLflow Tracking Server](#tracking_server)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Scenario</th>
      <td>Solo development</td>
      <td>Solo development</td>
      <td>Team development</td>
    </tr>
    <tr>
      <th>Use Case</th>
      <td>By default, MLflow records metadata and artifacts for each run to a local directory, `mlruns`. This is the simplest way to get started with MLflow Tracking, without setting up any external server, database, and storage.</td>
      <td>The MLflow client can interface with a SQLAlchemy-compatible database (e.g., SQLite, PostgreSQL, MySQL) for the [backend](/self-hosting/architecture/backend-store). Saving metadata to a database allows you cleaner management of your experiment data while skipping the effort of setting up a server.</td>
      <td>MLflow Tracking Server can be configured with an artifacts HTTP proxy, passing artifact requests through the tracking server to store and retrieve artifacts without having to interact with underlying object store services. This is particularly useful for team development scenarios where you want to store artifacts and experiment metadata in a shared location with proper access control.</td>
    </tr>
    <tr>
      <th>Tutorial</th>
      <td>[QuickStart](/ml/tracking/quickstart)</td>
      <td>[Tracking Experiments using a Local Database](/ml/tracking/tutorials/local-database)</td>
      <td>[Remote Experiment Tracking with MLflow Tracking Server](/ml/tracking/tutorials/remote-server)</td>
    </tr>
  </tbody>
</Table>

## Other Configuration with [MLflow Tracking Server](#tracking_server) \{#other-tracking-setup}

MLflow Tracking Server provides customizability for other special use cases. Please follow
[Remote Experiment Tracking with MLflow Tracking Server](/ml/tracking/tutorials/remote-server) for learning
the basic setup and continue to the following materials for advanced configurations to meet your needs.

<Tabs>
  <TabItem label="Local Tracking Server" value="local-tracking-server" default>
    #### Using MLflow Tracking Server Locally

    You can of course run MLflow Tracking Server locally. While this doesn't provide much additional benefit over directly using
    the local files or database, might useful for testing your team development workflow locally or running your machine learning
    code on a container environment.

    <div class="center-div" style={{ width: "50%" }}>
      ![](/images/tracking/tracking-setup-local-server.png)
    </div>

  </TabItem>
  <TabItem label="Artifacts-only Mode" value="artifacts-only-mode">
    #### Running MLflow Tracking Server in Artifacts-only Mode

    MLflow Tracking Server has an `--artifacts-only` option which allows the server to handle (proxy) exclusively artifacts, without permitting
    the processing of metadata. This is particularly useful when you are in a large organization or are training extremely large models. In these scenarios, you might have high artifact
    transfer volumes and can benefit from splitting out the traffic for serving artifacts to not impact tracking functionality. Please read
    [Optionally using a Tracking Server instance exclusively for artifact handling](/self-hosting/architecture/tracking-server#tracking-server-artifacts-only)
    for more details on how to use this mode.

    <div class="center-div" style={{ width: "50%" }}>
      ![](/images/tracking/tracking-setup-artifacts-only.png)
    </div>

  </TabItem>
  <TabItem label="Direct Access to Artifacts" value="direct-access-to-artifacts">
    #### Disable Artifact Proxying to Allow Direct Access to Artifacts

    MLflow Tracking Server, by default, serves both artifacts and only metadata. However, in some cases, you may want
    to allow direct access to the remote artifacts storage to avoid the overhead of a proxy while preserving the functionality
    of metadata tracking. This can be done by disabling artifact proxying by starting server with `--no-serve-artifacts` option.
    Refer to [Use Tracking Server without Proxying Artifacts Access](/self-hosting/architecture/tracking-server#tracking-server-no-proxy)
    for how to set this up.

    <div class="center-div" style={{ width: "50%" }}>
      ![](/images/tracking/tracking-setup-no-serve-artifacts.png)
    </div>

  </TabItem>
</Tabs>

## FAQ

### Can I launch multiple runs in parallel?

Yes, MLflow supports launching multiple runs in parallel e.g. multi processing / threading.
See [Launching Multiple Runs in One Program](/ml/tracking/tracking-api#parallel-execution-strategies) for more details.

### How can I organize many MLflow Runs neatly?

MLflow provides a few ways to organize your runs:

- [Organize runs into experiments](/ml/tracking/tracking-api#experiment-organization) - Experiments are logical containers for your runs. You can create an experiment using the CLI, API, or UI.
- [Create child runs](/ml/tracking/tracking-api#hierarchical-runs-with-parent-child-relationships) - You can create child runs under a single parent run to group them together. For example, you can create a child run for each fold in a cross-validation experiment.
- [Add tags to runs](/ml/tracking/tracking-api#smart-tagging-for-organization) - You can associate arbitrary tags with each run, which allows you to filter and search runs based on tags.

### Can I directly access remote storage without running the Tracking Server?

Yes, while it is best practice to have the MLflow Tracking Server as a proxy for artifacts access for team development workflows, you may not need that
if you are using it for personal projects or testing. You can achieve this by following the workaround below:

1. Set up artifacts configuration such as credentials and endpoints, just like you would for the MLflow Tracking Server.
   See [configure artifact storage](/self-hosting/architecture/artifact-store#artifacts-store-supported-storages) for more details.
2. Create an experiment with an explicit artifact location,

```python
experiment_name = "your_experiment_name"
mlflow.create_experiment(experiment_name, artifact_location="s3://your-bucket")
mlflow.set_experiment(experiment_name)
```

Your runs under this experiment will log artifacts to the remote storage directly.

#### How to integrate MLflow Tracking with [Model Registry](/ml/model-registry)? \{#tracking-with-model-registry}

To use the Model Registry functionality with MLflow tracking, you **must use database backed store** such as PostgresQL and log a model using the `log_model` methods of the corresponding model flavors.
Once a model has been logged, you can add, modify, update, or delete the model in the Model Registry through the UI or the API.
See [Backend Stores](/self-hosting/architecture/backend-store) and [Common Setups](/self-hosting/architecture/overview/#common-setups) for how to configures backend store properly for your workflow.

#### How to include additional description texts about the run?

A system tag `mlflow.note.content` can be used to add descriptive note about this run. While the other [system tags](/ml/tracking/tracking-api#system-tags-reference) are set automatically,
this tag is **not set by default** and users can override it to include additional information about the run. The content will be displayed on the run's page under
the Notes section.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/classic-ml/tracking/autolog/index.mdx

```text
---
sidebar_position: 1
---

import TOCInline from "@theme/TOCInline";
import { APILink } from "@site/src/components/APILink";
import { Table } from "@site/src/components/Table";

# Automatic Logging with MLflow Tracking

Auto logging is a powerful feature that allows you to log metrics, parameters, and models without the need for explicit log statements. All you need to do is to
call <APILink fn="mlflow.autolog" /> before your training code.

```python
import mlflow

mlflow.autolog()

with mlflow.start_run():
    # your training code goes here
    ...
```

This will enable MLflow to automatically log various information about your run, including:

- **Metrics** - MLflow pre-selects a set of metrics to log, based on what model and library you use
- **Parameters** - hyper params specified for the training, plus default values provided by the library if not explicitly set
- **Model Signature** - logs [Model signature](/ml/model/signatures) instance, which describes input and output schema of the model
- **Artifacts** - e.g. model checkpoints
- **Dataset** - dataset object used for training (if applicable), such as _tensorflow.data.Dataset_

## How to Get started

### Step 1 - Get MLflow

MLflow is available on PyPI. If you don't already have it installed on your system, you can install it with:

```bash
pip install mlflow
```

### Step 2 - Insert `mlflow.autolog` in Your Code

For example, following code snippet shows how to enable autologging for a scikit-learn model:

```python
import mlflow

from sklearn.model_selection import train_test_split
from sklearn.datasets import load_diabetes
from sklearn.ensemble import RandomForestRegressor

mlflow.autolog()

db = load_diabetes()
X_train, X_test, y_train, y_test = train_test_split(db.data, db.target)

rf = RandomForestRegressor(n_estimators=100, max_depth=6, max_features=3)
# MLflow triggers logging automatically upon model fitting
rf.fit(X_train, y_train)
```

### Step 3 - Execute Your Code

```bash
python YOUR_ML_CODE.py
```

### Step 4 - View Your Results in the MLflow UI

Once your training job finishes, you can run following command to launch the MLflow UI:

```bash
mlflow server --port 8080
```

Then, navigate to [`http://localhost:8080`](http://localhost:8080) in your browser to view the results.

## Customize Autologging Behavior

You can also control the behavior of autologging by passing arguments to <APILink fn="mlflow.autolog" /> function.
For example, you can disable logging of model checkpoints and associate tags with your run as follows:

```python
import mlflow

mlflow.autolog(
    log_model_signatures=False,
    extra_tags={"YOUR_TAG": "VALUE"},
)
```

See <APILink fn="mlflow.autolog" /> for the full set of arguments you can use.

## Enable / Disable Autologging for Specific Libraries

One common use case is to enable/disable autologging for a specific library. For example, if you train your model on PyTorch but use scikit-learn
for data preprocessing, you may want to disable autologging for scikit-learn while keeping it enabled for PyTorch. You can achieve this by either
(1) enable autologging only for PyTorch using PyTorch flavor (2) disable autologging for scikit-learn using its flavor with `disable=True`.

```python
import mlflow

# Option 1: Enable autologging only for PyTorch
mlflow.pytorch.autolog()

# Option 2: Disable autologging for scikit-learn, but enable it for other libraries
mlflow.sklearn.autolog(disable=True)
mlflow.autolog()
```

## Supported Libraries

:::note
The generic autolog function <APILink fn="mlflow.autolog" /> enables autologging for each supported library you have installed as soon as you import it.
Alternatively, you can use library-specific autolog calls such as <APILink fn="mlflow.pytorch.autolog" /> to explicitly enable (or disable) autologging for a particular library.
:::

The following list covers the most popular libraries that support autologging within MLflow:

<TOCInline toc={toc.slice(toc.findIndex((l) => l.id === "supported-libraries") + 1)} />

:::note
There are many more integrations that support autologging and the list of supported libraries is constantly growing. See the dedicated pages
for further guidance on whether autologging support is available for a given library.
:::

For flavors that automatically save models as an artifact, [additional files](/ml/model#storage-format) for dependency management are logged.

### Keras/TensorFlow \{#autolog-keras}

Call the generic autolog function or <APILink fn="mlflow.tensorflow.autolog" /> before your training code to enable automatic logging of metrics and parameters. As an example, try running the [Keras/Tensorflow example](https://github.com/mlflow/mlflow/blob/master/examples/keras/train.py).

Note that only versions of `tensorflow>=2.3` are supported.
The respective metrics associated with `tf.estimator` and `EarlyStopping` are automatically logged.
As an example, try running the [Keras/TensorFlow example](https://github.com/mlflow/mlflow/blob/master/examples/keras/train.py).

Autologging captures the following information:

<Table>
  <thead>
    <tr>
      <th>Framework</th>
      <th>Metrics</th>
      <th>Parameters</th>
      <th>Tags</th>
      <th>Artifacts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>`tf.keras`</td>
      <td>Training loss; validation loss; user-specified metrics</td>
      <td>`fit()` parameters; optimizer name; learning rate; epsilon</td>
      <td>--</td>
      <td>Model summary on training start; [MLflow Model](/ml/model) (Keras model); TensorBoard logs on training end</td>
    </tr>
    <tr>
      <td>`tf.keras.callbacks.EarlyStopping`</td>
      <td>Metrics from the `EarlyStopping` callbacks. For example, `stopped_epoch`, `restored_epoch`, `restore_best_weight`, etc</td>
      <td>`fit()` parameters from `EarlyStopping`. For example, `min_delta`, `patience`, `baseline`, `restore_best_weights`, etc</td>
      <td>--</td>
      <td>--</td>
    </tr>
  </tbody>
</Table>

If no active run exists when `autolog()` captures data, MLflow will automatically create a run to log information to.
Also, MLflow will then automatically end the run once training ends via calls to `tf.keras.fit()`.

If a run already exists when `autolog()` captures data, MLflow will log to that run but not automatically end that run after training. You will have to manually stop the run if you wish to start a new run context for logging to a new run.

### LightGBM \{#autolog-lightgbm}

Call the generic autolog function <APILink fn="mlflow.lightgbm.autolog" /> before your training code to enable automatic logging of metrics and parameters.

Autologging captures the following information:

<Table>
  <thead>
    <tr>
      <th>Framework</th>
      <th>Metrics</th>
      <th>Parameters</th>
      <th>Tags</th>
      <th>Artifacts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>LightGBM</td>
      <td>user-specified metrics</td>
      <td>[lightgbm.train](https://lightgbm.readthedocs.io/en/latest/pythonapi/lightgbm.train.html#lightgbm-train) parameters</td>
      <td>--</td>
      <td>[MLflow Model](/ml/model) (LightGBM model) with model signature on training end; feature importance; input example;</td>
    </tr>
  </tbody>
</Table>

If early stopping is activated, metrics at the best iteration will be logged as an extra step/iteration.

### Paddle \{#autolog-paddle}

Call the generic autolog function <APILink fn="mlflow.paddle.autolog" /> before your training code to enable automatic logging of metrics and parameters.

Autologging captures the following information:

<Table>
  <thead>
    <tr>
      <th>Framework</th>
      <th>Metrics</th>
      <th>Parameters</th>
      <th>Tags</th>
      <th>Artifacts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Paddle</td>
      <td>user-specified metrics</td>
      <td>[paddle.Model.fit](https://www.paddlepaddle.org.cn/documentation/docs/en/api/paddle/Model_en.html) parameters</td>
      <td>--</td>
      <td>[MLflow Model](/ml/model) (Paddle model) with model signature on training end</td>
    </tr>
  </tbody>
</Table>

### PySpark \{#autolog-pyspark}

Call <APILink fn="mlflow.pyspark.ml.autolog" /> before your training code to enable automatic logging of metrics, params, and models.
See example usage with [PySpark](https://github.com/mlflow/mlflow/tree/master/examples/pyspark_ml_autologging).

Autologging for pyspark ml estimators captures the following information:

<Table>
  <thead>
    <tr>
      <th>Metrics</th>
      <th>Parameters</th>
      <th>Tags</th>
      <th>Artifacts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Post training metrics obtained by `Evaluator.evaluate`</td>
      <td>Parameters obtained by `Estimator.fit`</td>
      <td>
        - Class name
        - Fully qualified class name

      </td>
      <td>
        - [MLflow Model](/ml/model) containing a fitted estimator
        - `metric_info.json` for post training metrics

      </td>
    </tr>

  </tbody>
</Table>

### PyTorch \{#autolog-pytorch}

Call the generic autolog function <APILink fn="mlflow.pytorch.autolog" /> before your PyTorch Lightning training code to enable automatic logging of metrics, parameters, and models. See example usages [here](https://github.com/chauhang/mlflow/tree/master/examples/pytorch/MNIST).
Note that currently, PyTorch autologging supports only models trained using PyTorch Lightning.

Autologging is triggered on calls to `pytorch_lightning.trainer.Trainer.fit` and captures the following information:

<Table>
  <thead>
    <tr>
      <th>Framework/module</th>
      <th>Metrics</th>
      <th>Parameters</th>
      <th>Tags</th>
      <th>Artifacts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>`pytorch_lightning.trainer.Trainer`</td>
      <td>Training loss; validation loss; average_test_accuracy; user-defined-metrics</td>
      <td>`fit()` parameters; optimizer name; learning rate; epsilon.</td>
      <td>--</td>
      <td>Model summary on training start, [MLflow Model](/ml/model) (PyTorch model) on training end;</td>
    </tr>
    <tr>
      <td>`pytorch_lightning.callbacks.earlystopping`</td>
      <td>Training loss; validation loss; average_test_accuracy; user-defined-metrics. Metrics from the `EarlyStopping` callbacks. For example, `spotted_epoch`, `restored_epoch`, `restore_best_weight`, etc</td>
      <td>`fit()` parameters; optimizer name; learning rate; epsilon. Parameters from the `EarlyStopping` callbacks. For example, `min_delta`, `patience`, `baseline`, `restore_best_weights`, etc</td>
      <td>--</td>
      <td>Model summary on training start; [MLflow Model](/ml/model) (PyTorch model) on training end; Best PyTorch model checkpoint, if training stops due to early stopping callback.</td>
    </tr>
  </tbody>
</Table>

If no active run exists when `autolog()` captures data, MLflow will automatically create a run to log information, ending the run once
the call to `pytorch_lightning.trainer.Trainer.fit()` completes.

If a run already exists when `autolog()` captures data, MLflow will log to that run but not automatically end that run after training.

:::note

- Parameters not explicitly passed by users (parameters that use default values) while using `pytorch_lightning.trainer.Trainer.fit()` are not currently automatically logged
- In case of a multi-optimizer scenario (such as usage of autoencoder), only the parameters for the first optimizer are logged

:::

### Scikit-learn \{#autolog-sklearn}

Call <APILink fn="mlflow.sklearn.autolog" /> before your training code to enable automatic logging of sklearn metrics, params, and models.
See example usage [here](https://github.com/mlflow/mlflow/tree/master/examples/sklearn_autolog).

Autologging for estimators (e.g. [LinearRegression](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html)) and meta estimators (e.g. [Pipeline](https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html)) creates a single run and logs:

<Table>
  <thead>
    <tr>
      <th>Metrics</th>
      <th>Parameters</th>
      <th>Tags</th>
      <th>Artifacts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Training score obtained by `estimator.score`</td>
      <td>Parameters obtained by `estimator.get_params`</td>
      <td>
        - Class name
        - Fully qualified class name

      </td>
      <td>Fitted estimator</td>
    </tr>

  </tbody>
</Table>

Autologging for parameter search estimators (e.g. [GridSearchCV](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GridSearchCV.html)) creates a single parent run and nested child runs

```
- Parent run
  - Child run 1
  - Child run 2
  - ...
```

containing the following data:

<Table>
  <thead>
    <tr>
      <th>Run type</th>
      <th>Metrics</th>
      <th>Parameters</th>
      <th>Tags</th>
      <th>Artifacts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Parent</td>
      <td>Training score</td>
      <td>
        - Parameter search estimator's parameters
        - Best parameter combination

      </td>
      <td>
        - Class name
        - Fully qualified class name

      </td>
      <td>
        - Fitted parameter search estimator
        - Fitted best estimator
        - Search results csv file

      </td>
    </tr>
    <tr>
      <td>Child</td>
      <td>CV test score for each parameter combination</td>
      <td>Each parameter combination</td>
      <td>
        - Class name
        - Fully qualified class name

      </td>
      <td>--</td>
    </tr>

  </tbody>
</Table>

### Spark \{#autolog-spark}

Initialize a SparkSession with the mlflow-spark JAR attached (e.g.
`SparkSession.builder.config("spark.jars.packages", "org.mlflow.mlflow-spark")`) and then
call the generic autolog function <APILink fn="mlflow.spark.autolog" /> to enable automatic logging of Spark datasource
information at read-time, without the need for explicit
log statements. Note that autologging of Spark ML (MLlib) models is not yet supported.

Autologging captures the following information:

<Table>
  <thead>
    <tr>
      <th>Framework</th>
      <th>Metrics</th>
      <th>Parameters</th>
      <th>Tags</th>
      <th>Artifacts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Spark</td>
      <td>--</td>
      <td>--</td>
      <td>Single tag containing source path, version, format. The tag contains one line per datasource</td>
      <td>--</td>
    </tr>
  </tbody>
</Table>

:::note

- Moreover, Spark datasource autologging occurs asynchronously - as such, it's possible (though unlikely) to see race conditions when launching short-lived MLflow runs that result in datasource information not being logged.

:::

:::warning important
With Pyspark 3.2.0 or above, Spark datasource autologging requires `PYSPARK_PIN_THREAD` environment variable to be set to `false`.
:::

### Statsmodels \{#autolog-statsmodels}

Call the generic autolog function <APILink fn="mlflow.statsmodels.autolog" /> before your training code to enable automatic logging of metrics and parameters.

Autologging captures the following information:

<Table>
  <thead>
    <tr>
      <th>Framework</th>
      <th>Metrics</th>
      <th>Parameters</th>
      <th>Tags</th>
      <th>Artifacts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Statsmodels</td>
      <td>user-specified metrics</td>
      <td>[statsmodels.base.model.Model.fit](https://www.statsmodels.org/dev/dev/generated/statsmodels.base.model.Model.html) parameters</td>
      <td>--</td>
      <td>[MLflow Model](/ml/model) (statsmodels.base.wrapper.ResultsWrapper) on training end</td>
    </tr>
  </tbody>
</Table>

:::note

- Each model subclass that overrides _fit_ expects and logs its own parameters.

:::

### XGBoost \{#autolog-xgboost}

Call the generic autolog function <APILink fn="mlflow.xgboost.autolog" /> before your training code to enable automatic logging of metrics and parameters.

Autologging captures the following information:

<Table>
  <thead>
    <tr>
      <th>Framework</th>
      <th>Metrics</th>
      <th>Parameters</th>
      <th>Tags</th>
      <th>Artifacts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>XGBoost</td>
      <td>user-specified metrics</td>
      <td>[xgboost.train](https://xgboost.readthedocs.io/en/latest/python/python_api.html#xgboost.train) parameters</td>
      <td>--</td>
      <td>[MLflow Model](/ml/model) (XGBoost model) with model signature on training end; feature importance; input example</td>
    </tr>
  </tbody>
</Table>

If early stopping is activated, metrics at the best iteration will be logged as an extra step/iteration.
```

--------------------------------------------------------------------------------

````
