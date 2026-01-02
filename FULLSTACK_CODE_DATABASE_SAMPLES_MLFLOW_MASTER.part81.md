---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 81
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 81 of 991)

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
Location: mlflow-master/docs/docs/classic-ml/tracking/quickstart/index.mdx

```text
---
sidebar_position: 2
sidebar_label: "Quickstart"
---

import ImageBox from "@site/src/components/ImageBox";

# MLflow Tracking Quickstart

The purpose of this quickstart is to provide a quick guide to the most essential core APIs of MLflow Tracking. In just a few minutes of following along with this quickstart, you will learn:

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

Scroll down to the "Model" section and you will see the model that was logged during training. Click on the model to view the details.

<ImageBox src="/images/tutorials/introductory/quickstart-tracking/quickstart-ui-logged-models.png" alt="MLflow UI Model detail page" />

The model page displays similar metadata such as performance metrics and hyper-parameters. It also includes an "Artifacts" section that lists the files that were logged during training. You can also see environment information such as the Python version and dependencies, which are stored for reproducibility.

<ImageBox src="/images/tutorials/introductory/quickstart-tracking/quickstart-our-model.png" alt="MLflow UI Model detail page" />

## Step 5 - Log a model and metadata manually

Now that we've learned how to log a model training run with MLflow autologging, let's step further and learn how to log a model and metadata manually. This is useful when you want to have more control over the logging process.

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
To load the model as native scikit-learn model, use `mlflow.sklearn.load_model(model_info.model_uri)` instead of the pyfunc flavor.
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

Congratulations on working through the MLflow Tracking Quickstart! You should now have a basic understanding of how to use the MLflow Tracking API to log models.

- [MLflow for GenAI](/genai): Learn how to use MLflow for GenAI/LLM development.
- [MLflow for Deep Learning](/ml/deep-learning): Learn how to use MLflow for deep learning frameworks such as PyTorch, TensorFlow, etc.
- [MLflow Tracking](/ml/tracking/): Learn more about the MLflow Tracking APIs.
- [Self-hosting Guide](/self-hosting): Learn how to self-host the MLflow Tracking Server and set it up for team collaboration.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/classic-ml/tracking/system-metrics/index.mdx

```text
import { APILink } from "@site/src/components/APILink";

# System Metrics

MLflow allows users to log system metrics including CPU stats, GPU stats, memory usage, network traffic, and
disk usage during the execution of an MLflow run. In this guide, we will walk through how to manage system
metrics logging with MLflow.

## Extra Dependencies

To log system metrics in MLflow, please install `psutil`. We explicitly don't include `psutil` in MLflow's
dependencies because `psutil` wheel is not available for linux aarch64, and building from source fails intermittently.
To install `psutil`, run the following command:

```bash
pip install psutil
```

If you want to catch Nvidia GPU metrics, you also need to install `nvidia-ml-py`:

```bash
pip install nvidia-ml-py
```

If you are using AMD/HIP GPUs, install [pyrsmi](https://github.com/ROCm/pyrsmi) instead of `nvidia-ml-py`:

```bash
pip install pyrsmi
```

## Turn on/off System Metrics Logging

There are three ways to enable or disable system metrics logging:

- Set the environment variable `MLFLOW_ENABLE_SYSTEM_METRICS_LOGGING` to `false` to turn off system metrics logging,
  or `true` to enable it for all MLflow runs.
- Use <APILink fn="mlflow.enable_system_metrics_logging" /> to enable and
  <APILink fn="mlflow.disable_system_metrics_logging" /> to disable system metrics logging for all MLflow runs.
- Use `log_system_metrics` parameter in <APILink fn="mlflow.start_run" /> to control system metrics logging for
  the current MLflow run, i.e., `mlflow.start_run(log_system_metrics=True)` will enable system metrics logging.

### Using the Environment Variable to Control System Metrics Logging

You can set the environment variable `MLFLOW_ENABLE_SYSTEM_METRICS_LOGGING` to `true` to turn on system metrics
logging globally, as shown below:

```bash
export MLFLOW_ENABLE_SYSTEM_METRICS_LOGGING=true
```

However, if you are executing the command above from within Ipython notebook (Jupyter, Databricks notebook,
Google Colab), the `export` command will not work due to the segregated state of the ephemeral shell.
Instead you can use the following code:

```python
import os

os.environ["MLFLOW_ENABLE_SYSTEM_METRICS_LOGGING"] = "true"
```

After setting the environment variable, you will see that starting an MLflow run will automatically collect
and log the default system metrics. Try running the following code in your favorite environment and you
should see system metrics existing in the logged run data. Please note that you don't necessarilty need to
start an MLflow server, as the metrics are logged locally.

```python
import mlflow
import time

with mlflow.start_run() as run:
    time.sleep(15)

print(mlflow.MlflowClient().get_run(run.info.run_id).data)
```

Your output should look like this:

```
<RunData: metrics={'system/cpu_utilization_percentage': 12.4,
'system/disk_available_megabytes': 213744.0,
'system/disk_usage_megabytes': 28725.3,
'system/disk_usage_percentage': 11.8,
'system/network_receive_megabytes': 0.0,
'system/network_transmit_megabytes': 0.0,
'system/system_memory_usage_megabytes': 771.1,
'system/system_memory_usage_percentage': 5.7}, params={}, tags={'mlflow.runName': 'nimble-auk-61',
'mlflow.source.name': '/usr/local/lib/python3.10/dist-packages/colab_kernel_launcher.py',
'mlflow.source.type': 'LOCAL',
'mlflow.user': 'root'}>
```

To disable system metrics logging, you can use either of the following commands:

```bash
export MLFLOW_ENABLE_SYSTEM_METRICS_LOGGING="false"
```

```python
import os

del os.environ["MLFLOW_ENABLE_SYSTEM_METRICS_LOGGING"]
```

Rerunning the MLflow code above will not log system metrics.

### Using `mlflow.enable_system_metrics_logging()`

We also provide a pair of APIs `mlflow.enable_system_metrics_logging()` and
`mlflow.disable_system_metrics_logging()` to turn on/off system metrics logging globally for
environments in which you do not have the appropriate access to set an environment variable.
Running the following code will have the same effect as setting
`MLFLOW_ENABLE_SYSTEM_METRICS_LOGGING` environment variable to `true`:

```python
import mlflow

mlflow.enable_system_metrics_logging()

with mlflow.start_run() as run:
    time.sleep(15)

print(mlflow.MlflowClient().get_run(run.info.run_id).data)
```

### Enabling System Metrics Logging for a Single Run

In addition to controlling system metrics logging globally, you can also control it for a
single run. To do so, set `log_system_metrics` as `True` or `False` accordingly in <APILink fn="mlflow.start_run" />:

```python
with mlflow.start_run(log_system_metrics=True) as run:
    time.sleep(15)

print(mlflow.MlflowClient().get_run(run.info.run_id).data)
```

Please also note that using `log_system_metrics` will ignore the global status of system metrics logging.
In other words, the above code will log system metrics for the specific run even if you have disabled
system metrics logging by setting `MLFLOW_ENABLE_SYSTEM_METRICS_LOGGING` to `false` or calling
`mlflow.disable_system_metrics_logging()`.

## Types of System Metrics

By default, MLflow logs the following system metrics:

- cpu_utilization_percentage
- system_memory_usage_megabytes
- system_memory_usage_percentage
- gpu_utilization_percentage
- gpu_memory_usage_megabytes
- gpu_memory_usage_percentage
- gpu_power_usage_watts
- gpu_power_usage_percentage
- network_receive_megabytes
- network_transmit_megabytes
- disk_usage_megabytes
- disk_available_megabytes

GPU metrics are only logged when a GPU is available and `nvidia-ml-py` is installed.

Every system metric has a prefix `system/` when logged for grouping purpose. So the actual metric name
that is logged will have `system/` prepended, e.g, `system/cpu_utilization_percentage`,
`system/system_memory_usage_megabytes`, etc.

## Viewing System Metrics within the MLflow UI

System metrics are available within the MLflow UI under the metrics section. In order to view
them, let's start our MLflow UI server, and log some system metrics to it:

```bash
mlflow server
```

```python
import mlflow
import time

mlflow.set_tracking_uri("http://127.0.0.1:5000")
with mlflow.start_run() as run:
    time.sleep(15)
```

Navigate to `http://127.0.0.1:5000` in your browser and open your run. You should see system metrics
under the metrics section, similar as shown by the screenshot below:

<div className="center-div" style={{ width: 800, maxWidth: "100%" }}>
  ![system metrics on MLflow UI](/images/system-metrics/system-metrics-view.png)
</div>

## Customizing System Metrics Logging

### Customizing Logging Frequency

By default, system metrics are sampled every 10 seconds and are directly logged after sampling. You can customize
the sampling frequency by setting environment variable `MLFLOW_SYSTEM_METRICS_SAMPLING_INTERVAL` to an integer
representing the logging frequency in seconds or by using <APILink fn="mlflow.set_system_metrics_sampling_interval" />
to set the interval, as shown below. In addition to setting the frequency of system metrics logging, you can
also customize the number of samples to aggregate. You can also customize the number of samples to aggregate
before logging by setting environment variable `MLFLOW_SYSTEM_METRICS_SAMPLES_BEFORE_LOGGING` or
using <APILink fn="mlflow.set_system_metrics_samples_before_logging" />. The actual logging time window is the
product of `MLFLOW_SYSTEM_METRICS_SAMPLING_INTERVAL` and `MLFLOW_SYSTEM_METRICS_SAMPLES_BEFORE_LOGGING`.
For example, if you set sample interval to 2 seconds and samples before logging to 3, then system metrics will be
collected every 2 seconds, then after 3 samples are collected (2 \* 3 = 6s), we aggregate the metrics and log to MLflow
server. The aggregation logic depends on different system metrics. For example, for `cpu_utilization_percentage` it's
the average of the samples.

```python
import mlflow

mlflow.set_system_metrics_sampling_interval(1)
mlflow.set_system_metrics_samples_before_logging(3)

with mlflow.start_run(log_system_metrics=True) as run:
    time.sleep(15)

metric_history = mlflow.MlflowClient().get_metric_history(
    run.info.run_id,
    "system/cpu_utilization_percentage",
)
print(metric_history)
```

You will see `system/cpu_utilization_percentage` logged a few times.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/classic-ml/tracking/tracking-api/index.mdx

```text
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import { APILink } from "@site/src/components/APILink";
import { Table } from "@site/src/components/Table";

# MLflow Tracking APIs

[MLflow Tracking](/ml/tracking) provides comprehensive APIs across multiple programming languages to capture your machine learning experiments. Whether you prefer automatic instrumentation or granular control, MLflow adapts to your workflow.

## Choose Your Approach

MLflow offers two primary methods for experiment tracking, each optimized for different use cases:

### **🤖 Automatic Logging** - Zero Setup, Maximum Coverage

Perfect for getting started quickly or when using supported ML libraries. Just add one line and MLflow captures everything automatically.

```python
import mlflow

mlflow.autolog()  # That's it!

# Your existing training code works unchanged
model.fit(X_train, y_train)
```

**What gets logged automatically:**

- Model parameters and hyperparameters
- Training and validation metrics
- Model artifacts and checkpoints
- Training plots and visualizations
- Framework-specific metadata

**Supported libraries:** Scikit-learn, XGBoost, LightGBM, PyTorch, Keras/TensorFlow, Spark, and more.

[**→ Explore Auto Logging**](/ml/tracking/autolog)

### **🛠️ Manual Logging** - Complete Control, Custom Workflows

Ideal for custom training loops, advanced experimentation, or when you need precise control over what gets tracked.

<Tabs>
  <TabItem default label="Python" value="python">
    ```python
    import mlflow

    with mlflow.start_run():
        # Log parameters
        mlflow.log_param("learning_rate", 0.01)
        mlflow.log_param("batch_size", 32)

        # Your training logic here
        for epoch in range(num_epochs):
            train_loss = train_model()
            val_loss = validate_model()

            # Log metrics with step tracking
            mlflow.log_metrics({"train_loss": train_loss, "val_loss": val_loss}, step=epoch)

        # Log final model
        mlflow.sklearn.log_model(model, name="model")
    ```

  </TabItem>
  <TabItem label="Java" value="java">
    ```java
    MlflowClient client = new MlflowClient();
    RunInfo run = client.createRun();

    // Log parameters
    client.logParam(run.getRunId(), "learning_rate", "0.01");
    client.logParam(run.getRunId(), "batch_size", "32");

    // Log metrics with timesteps
    for (int epoch = 0; epoch < numEpochs; epoch++) {
        double trainLoss = trainModel();
        client.logMetric(run.getRunId(), "train_loss", trainLoss,
                        System.currentTimeMillis(), epoch);
    }
    ```

  </TabItem>
  <TabItem label="R" value="r">
    ```r
    library(mlflow)

    with(mlflow_start_run(), {
      # Log parameters
      mlflow_log_param("learning_rate", 0.01)
      mlflow_log_param("batch_size", 32)

      # Training loop
      for (epoch in 1:num_epochs) {
        train_loss <- train_model()
        mlflow_log_metric("train_loss", train_loss, step = epoch)
      }
    })
    ```

  </TabItem>
</Tabs>

## Core Logging Functions

### Setup & Configuration

| Function                                  | Purpose                                | Example                                              |
| ----------------------------------------- | -------------------------------------- | ---------------------------------------------------- |
| <APILink fn="mlflow.set_tracking_uri" />  | Connect to tracking server or database | `mlflow.set_tracking_uri("http://localhost:5000")`   |
| <APILink fn="mlflow.get_tracking_uri" />  | Get current tracking URI               | `uri = mlflow.get_tracking_uri()`                    |
| <APILink fn="mlflow.create_experiment" /> | Create new experiment                  | `exp_id = mlflow.create_experiment("my-experiment")` |
| <APILink fn="mlflow.set_experiment" />    | Set active experiment                  | `mlflow.set_experiment("fraud-detection")`           |

### Run Management

| Function                                | Purpose                              | Example                               |
| --------------------------------------- | ------------------------------------ | ------------------------------------- |
| <APILink fn="mlflow.start_run" />       | Start new run (with context manager) | `with mlflow.start_run(): ...`        |
| <APILink fn="mlflow.end_run" />         | End current run                      | `mlflow.end_run(status="FINISHED")`   |
| <APILink fn="mlflow.active_run" />      | Get currently active run             | `run = mlflow.active_run()`           |
| <APILink fn="mlflow.last_active_run" /> | Get last completed run               | `last_run = mlflow.last_active_run()` |

### Data Logging

| Function                                                                 | Purpose                 | Example                                        |
| ------------------------------------------------------------------------ | ----------------------- | ---------------------------------------------- |
| <APILink fn="mlflow.log_param" /> / <APILink fn="mlflow.log_params" />   | Log hyperparameters     | `mlflow.log_param("lr", 0.01)`                 |
| <APILink fn="mlflow.log_metric" /> / <APILink fn="mlflow.log_metrics" /> | Log performance metrics | `mlflow.log_metric("accuracy", 0.95, step=10)` |
| <APILink fn="mlflow.log_input" />                                        | Log dataset information | `mlflow.log_input(dataset)`                    |
| <APILink fn="mlflow.set_tag" /> / <APILink fn="mlflow.set_tags" />       | Add metadata tags       | `mlflow.set_tag("model_type", "CNN")`          |

### Artifact Management

| Function                                 | Purpose                       | Example                            |
| ---------------------------------------- | ----------------------------- | ---------------------------------- |
| <APILink fn="mlflow.log_artifact" />     | Log single file/directory     | `mlflow.log_artifact("model.pkl")` |
| <APILink fn="mlflow.log_artifacts" />    | Log entire directory          | `mlflow.log_artifacts("./plots/")` |
| <APILink fn="mlflow.get_artifact_uri" /> | Get artifact storage location | `uri = mlflow.get_artifact_uri()`  |

### Model Management (New in MLflow 3)

| Function                                        | Purpose                                                 | Example                                                                 |
| ----------------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------- |
| <APILink fn="mlflow.initialize_logged_model" /> | Initialize a logged model in PENDING state              | `model = mlflow.initialize_logged_model(name="my_model")`               |
| <APILink fn="mlflow.create_external_model" />   | Create external model (artifacts stored outside MLflow) | `model = mlflow.create_external_model(name="agent")`                    |
| <APILink fn="mlflow.finalize_logged_model" />   | Update model status to READY or FAILED                  | `mlflow.finalize_logged_model(model_id, "READY")`                       |
| <APILink fn="mlflow.get_logged_model" />        | Retrieve logged model by ID                             | `model = mlflow.get_logged_model(model_id)`                             |
| <APILink fn="mlflow.last_logged_model" />       | Get most recently logged model                          | `model = mlflow.last_logged_model()`                                    |
| <APILink fn="mlflow.search_logged_models" />    | Search for logged models                                | `models = mlflow.search_logged_models(filter_string="name='my_model'")` |
| <APILink fn="mlflow.log_model_params" />        | Log parameters to a specific model                      | `mlflow.log_model_params({"param": "value"}, model_id)`                 |
| <APILink fn="mlflow.set_logged_model_tags" />   | Set tags on a logged model                              | `mlflow.set_logged_model_tags(model_id, {"key": "value"})`              |
| <APILink fn="mlflow.delete_logged_model_tag" /> | Delete tag from a logged model                          | `mlflow.delete_logged_model_tag(model_id, "key")`                       |

### Active Model Management (New in MLflow 3)

| Function                                    | Purpose                            | Example                                    |
| ------------------------------------------- | ---------------------------------- | ------------------------------------------ |
| <APILink fn="mlflow.set_active_model" />    | Set active model for trace linking | `mlflow.set_active_model(name="my_model")` |
| <APILink fn="mlflow.get_active_model_id" /> | Get current active model ID        | `model_id = mlflow.get_active_model_id()`  |
| <APILink fn="mlflow.clear_active_model" />  | Clear active model                 | `mlflow.clear_active_model()`              |

### Language-Specific API Coverage

<Table>
  <thead>
    <tr>
      <th>Capability</th>
      <th>Python</th>
      <th>Java</th>
      <th>R</th>
      <th>REST API</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>**Basic Logging**</td>
      <td>✅ Full</td>
      <td>✅ Full</td>
      <td>✅ Full</td>
      <td>✅ Full</td>
    </tr>
    <tr>
      <td>**Auto Logging**</td>
      <td>✅ 15+ Libraries</td>
      <td>❌ Not Available</td>
      <td>✅ Limited</td>
      <td>❌ Not Available</td>
    </tr>
    <tr>
      <td>**Model Logging**</td>
      <td>✅ 20+ Flavors</td>
      <td>✅ Basic Support</td>
      <td>✅ Basic Support</td>
      <td>✅ Via Artifacts</td>
    </tr>
    <tr>
      <td>**Logged Model Management**</td>
      <td>✅ Full (MLflow 3)</td>
      <td>❌ Not Available</td>
      <td>❌ Not Available</td>
      <td>✅ Basic</td>
    </tr>
    <tr>
      <td>**Dataset Tracking**</td>
      <td>✅ Full</td>
      <td>✅ Basic</td>
      <td>✅ Basic</td>
      <td>✅ Basic</td>
    </tr>
    <tr>
      <td>**Search & Query**</td>
      <td>✅ Advanced</td>
      <td>✅ Basic</td>
      <td>✅ Basic</td>
      <td>✅ Full</td>
    </tr>
  </tbody>
</Table>

:::note api-parity
The Python API provides the most comprehensive feature set. Java and R APIs offer core functionality with ongoing feature additions in each release.
:::

## Advanced Tracking Patterns

### Working with Logged Models (New in MLflow 3)

MLflow 3 introduces powerful logged model management capabilities for tracking models independently of runs:

#### Creating and Managing External Models

For models stored outside MLflow (like deployed agents or external model artifacts):

```python
import mlflow

# Create an external model for tracking without storing artifacts in MLflow
model = mlflow.create_external_model(
    name="chatbot_agent",
    model_type="agent",
    tags={"version": "v1.0", "environment": "production"},
)

# Log parameters specific to this model
mlflow.log_model_params(
    {"temperature": "0.7", "max_tokens": "1000"}, model_id=model.model_id
)

# Set as active model for automatic trace linking
mlflow.set_active_model(model_id=model.model_id)


@mlflow.trace
def chat_with_agent(message):
    # This trace will be automatically linked to the active model
    return agent.chat(message)


# Traces are now linked to your external model
traces = mlflow.search_traces(model_id=model.model_id)
```

#### Advanced Model Lifecycle Management

For models that require custom preparation or validation:

```python
import mlflow
from mlflow.entities import LoggedModelStatus

# Initialize model in PENDING state
model = mlflow.initialize_logged_model(
    name="custom_neural_network",
    model_type="neural_network",
    tags={"architecture": "transformer", "dataset": "custom"},
)

try:
    # Custom model preparation logic
    train_model()
    validate_model()

    # Save model artifacts using standard MLflow model logging
    mlflow.pytorch.log_model(
        pytorch_model=model_instance,
        name="model",
        model_id=model.model_id,  # Link to the logged model
    )

    # Finalize model as READY
    mlflow.finalize_logged_model(model.model_id, LoggedModelStatus.READY)

except Exception as e:
    # Mark model as FAILED if issues occur
    mlflow.finalize_logged_model(model.model_id, LoggedModelStatus.FAILED)
    raise

# Retrieve and work with the logged model
final_model = mlflow.get_logged_model(model.model_id)
print(f"Model {final_model.name} is {final_model.status}")
```

#### Searching and Querying Logged Models

```python
# Find all production-ready transformer models
production_models = mlflow.search_logged_models(
    filter_string="tags.environment = 'production' AND model_type = 'transformer'",
    order_by=[{"field_name": "creation_time", "ascending": False}],
    output_format="pandas",
)

# Search for models with specific performance metrics
high_accuracy_models = mlflow.search_logged_models(
    filter_string="metrics.accuracy > 0.95",
    datasets=[{"dataset_name": "test_set"}],  # Only consider test set metrics
    max_results=10,
)

# Get the most recently logged model in current session
latest_model = mlflow.last_logged_model()
if latest_model:
    print(f"Latest model: {latest_model.name} (ID: {latest_model.model_id})")
```

### Precise Metric Tracking

Control exactly when and how metrics are recorded with custom timestamps and steps:

```python
import time
from datetime import datetime

# Log with custom step (training iteration/epoch)
for epoch in range(100):
    loss = train_epoch()
    mlflow.log_metric("train_loss", loss, step=epoch)

# Log with custom timestamp
now = int(time.time() * 1000)  # MLflow expects milliseconds
mlflow.log_metric("inference_latency", latency, timestamp=now)

# Log with both step and timestamp
mlflow.log_metric("gpu_utilization", gpu_usage, step=epoch, timestamp=now)
```

**Step Requirements:**

- Must be a valid 64-bit integer
- Can be negative or out of order
- Supports gaps in sequences (e.g., 1, 5, 75, -20)

### Experiment Organization

Structure your experiments for easy comparison and analysis:

```python
# Method 1: Environment variables
import os

os.environ["MLFLOW_EXPERIMENT_NAME"] = "fraud-detection-v2"

# Method 2: Explicit experiment setting
mlflow.set_experiment("hyperparameter-tuning")

# Method 3: Create with custom configuration
experiment_id = mlflow.create_experiment(
    "production-models",
    artifact_location="s3://my-bucket/experiments/",
    tags={"team": "data-science", "environment": "prod"},
)
```

### Hierarchical Runs with Parent-Child Relationships

Organize complex experiments like hyperparameter sweeps or cross-validation:

```python
# Parent run for the entire experiment
with mlflow.start_run(run_name="hyperparameter_sweep") as parent_run:
    mlflow.log_param("search_strategy", "random")

    best_score = 0
    best_params = {}

    # Child runs for each parameter combination
    for lr in [0.001, 0.01, 0.1]:
        for batch_size in [16, 32, 64]:
            with mlflow.start_run(
                nested=True, run_name=f"lr_{lr}_bs_{batch_size}"
            ) as child_run:
                mlflow.log_params({"learning_rate": lr, "batch_size": batch_size})

                # Train and evaluate
                model = train_model(lr, batch_size)
                score = evaluate_model(model)
                mlflow.log_metric("accuracy", score)

                # Track best configuration in parent
                if score > best_score:
                    best_score = score
                    best_params = {"learning_rate": lr, "batch_size": batch_size}

    # Log best results to parent run
    mlflow.log_params(best_params)
    mlflow.log_metric("best_accuracy", best_score)

# Query child runs
child_runs = mlflow.search_runs(
    filter_string=f"tags.mlflow.parentRunId = '{parent_run.info.run_id}'"
)
print("Child run results:")
print(child_runs[["run_id", "params.learning_rate", "metrics.accuracy"]])
```

### Parallel Execution Strategies

Handle multiple runs efficiently with different parallelization approaches:

<Tabs>
  <TabItem default label="Sequential Runs" value="sequential">
    Perfect for simple hyperparameter sweeps or A/B testing:

    ```python
    configs = [
        {"model": "RandomForest", "n_estimators": 100},
        {"model": "XGBoost", "max_depth": 6},
        {"model": "LogisticRegression", "C": 1.0},
    ]

    for config in configs:
        with mlflow.start_run(run_name=config["model"]):
            mlflow.log_params(config)
            model = train_model(config)
            score = evaluate_model(model)
            mlflow.log_metric("f1_score", score)
    ```

  </TabItem>
  <TabItem label="Multiprocessing" value="multiprocessing">
    Scale training across multiple CPU cores:

    ```python
    import multiprocessing as mp


    def train_with_config(config):
        # Set tracking URI in each process (required for spawn method)
        mlflow.set_tracking_uri("http://localhost:5000")
        mlflow.set_experiment("parallel-training")

        with mlflow.start_run():
            mlflow.log_params(config)
            model = train_model(config)
            score = evaluate_model(model)
            mlflow.log_metric("accuracy", score)
            return score


    if __name__ == "__main__":
        configs = [{"lr": lr, "bs": bs} for lr in [0.01, 0.1] for bs in [16, 32]]

        with mp.Pool(processes=4) as pool:
            results = pool.map(train_with_config, configs)

        print(f"Completed {len(results)} experiments")
    ```

  </TabItem>
  <TabItem label="Multithreading" value="multithreading">
    Use child runs for thread-safe parallel execution:

    ```python
    import threading
    from concurrent.futures import ThreadPoolExecutor


    def train_worker(config):
        with mlflow.start_run(nested=True):
            mlflow.log_params(config)
            model = train_model(config)
            score = evaluate_model(model)
            mlflow.log_metric("accuracy", score)
            return score


    # Start parent run
    with mlflow.start_run(run_name="threaded_experiment"):
        configs = [{"lr": 0.01, "epochs": e} for e in range(10, 101, 10)]

        with ThreadPoolExecutor(max_workers=4) as executor:
            futures = [executor.submit(train_worker, config) for config in configs]
            results = [future.result() for future in futures]

        # Log summary to parent run
        mlflow.log_metric("avg_accuracy", sum(results) / len(results))
        mlflow.log_metric("max_accuracy", max(results))
    ```

  </TabItem>
</Tabs>

### Smart Tagging for Organization

Use tags strategically to organize and filter experiments:

```python
with mlflow.start_run():
    # Descriptive tags for filtering
    mlflow.set_tags(
        {
            "model_family": "transformer",
            "dataset_version": "v2.1",
            "environment": "production",
            "team": "nlp-research",
            "gpu_type": "V100",
            "experiment_phase": "hyperparameter_tuning",
        }
    )

    # Special notes tag for documentation
    mlflow.set_tag(
        "mlflow.note.content",
        "Baseline transformer model with attention dropout. "
        "Testing different learning rate schedules.",
    )

    # Training code here...
```

**Search experiments by tags:**

```python
# Find all transformer experiments
transformer_runs = mlflow.search_runs(filter_string="tags.model_family = 'transformer'")

# Find production-ready models
prod_models = mlflow.search_runs(
    filter_string="tags.environment = 'production' AND metrics.accuracy > 0.95"
)
```

### System Tags Reference

MLflow automatically sets several system tags to capture execution context:

| Tag                        | Description                              | When Set               |
| -------------------------- | ---------------------------------------- | ---------------------- |
| `mlflow.source.name`       | Source file or notebook name             | Always                 |
| `mlflow.source.type`       | Source type (NOTEBOOK, JOB, LOCAL, etc.) | Always                 |
| `mlflow.user`              | User who created the run                 | Always                 |
| `mlflow.source.git.commit` | Git commit hash                          | When run from git repo |
| `mlflow.source.git.branch` | Git branch name                          | MLflow Projects only   |
| `mlflow.parentRunId`       | Parent run ID for nested runs            | Child runs only        |
| `mlflow.docker.image.name` | Docker image used                        | Docker environments    |
| `mlflow.note.content`      | **User-editable** description            | Manual only            |

:::tip pro-tip
Use `mlflow.note.content` to document experiment insights, hypotheses, or results directly in the MLflow UI. This tag appears in a dedicated Notes section on the run page.
:::

### Integration with Auto Logging

Combine auto logging with manual tracking for the best of both worlds:

```python
import mlflow
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# Enable auto logging
mlflow.autolog()

with mlflow.start_run():
    # Auto logging captures model training automatically
    model = RandomForestClassifier(n_estimators=100)
    model.fit(X_train, y_train)

    # Add custom metrics and artifacts
    predictions = model.predict(X_test)

    # Log custom evaluation metrics
    report = classification_report(y_test, predictions, output_dict=True)
    mlflow.log_metrics(
        {
            "precision_macro": report["macro avg"]["precision"],
            "recall_macro": report["macro avg"]["recall"],
            "f1_macro": report["macro avg"]["f1-score"],
        }
    )

    # Log custom artifacts
    feature_importance = pd.DataFrame(
        {"feature": feature_names, "importance": model.feature_importances_}
    )
    feature_importance.to_csv("feature_importance.csv")
    mlflow.log_artifact("feature_importance.csv")

    # Access the auto-logged run for additional processing
    current_run = mlflow.active_run()
    print(f"Auto-logged run ID: {current_run.info.run_id}")

# Access the completed run
last_run = mlflow.last_active_run()
print(f"Final run status: {last_run.info.status}")
```

## Language-Specific Guides

- **Python**: <APILink fn="mlflow.python" hash="">Complete Python API Reference</APILink>
- **Java**: <APILink fn="mlflow.java" hash="">Java API Documentation</APILink>
- **R**: <APILink fn="mlflow.r" hash="">R API Documentation</APILink>
- **REST**: <APILink fn="mlflow.rest" hash="">REST API Reference</APILink>

---

**Next Steps:**

- [Set up MLflow Tracking Server](/self-hosting) for team collaboration
- [Explore Auto Logging](/ml/tracking/autolog) for supported frameworks
- [Learn advanced search patterns](/ml/search/search-runs) for experiment analysis
```

--------------------------------------------------------------------------------

````
