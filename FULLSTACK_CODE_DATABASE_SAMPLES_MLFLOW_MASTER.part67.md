---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 67
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 67 of 991)

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
Location: mlflow-master/docs/docs/classic-ml/deployment/deploy-model-to-sagemaker/index.mdx

```text
---
sidebar_position: 2
---

import { APILink } from "@site/src/components/APILink";

# Deploy MLflow Model to Amazon SageMaker

Amazon SageMaker is a fully managed service designed for scaling ML inference containers.
MLflow simplifies the deployment process by offering easy-to-use commands without the need
for writing container definitions.

If you are new to MLflow model deployment, please read [MLflow Deployment](/ml/deployment)
first to understand the basic concepts of MLflow models and deployments.

## How it works

SageMaker features a capability called [Bring Your Own Container (BYOC)](https://docs.aws.amazon.com/sagemaker/latest/dg/model-monitor-byoc-containers.html),
which allows you to run custom Docker containers on the inference endpoint. These containers must meet specific requirements, such as running a web server
that exposes certain REST endpoints, having a designated container entrypoint, setting environment variables, etc. Writing a Dockerfile and serving script
that meets these requirements can be a tedious task.

MLflow automates the process by building a Docker image from the MLflow Model on your behalf. Subsequently, it pushed the image to Elastic Container Registry (ECR)
and creates a SageMaker endpoint using this image. It also uploads the model artifact to an S3 bucket and configures the endpoint to download the model from there.

The container provides the same REST endpoints as a local inference server. For instance, the `/invocations` endpoint accepts CSV and JSON input data and returns
prediction results. For more details on the endpoints, refer to [Local Inference Server](/ml/deployment/deploy-model-locally#local-inference-server-spec).

## Deploying Model to SageMaker Endpoint

This section outlines the process of deploying a model to SageMaker using the MLflow CLI. For Python API references and tutorials,
see the [Useful links](#deployment-sagemaker-references) section.

### Step 0: Preparation

#### Install Tools

Ensure the installation of the following tools if not already done:

- [mlflow](https://pypi.org/project/mlflow)
- [awscli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- [docker](https://docs.docker.com/get-docker)

#### Permissions Setup

Set up AWS accounts and permissions correctly. You need an IAM role with permissions to create a SageMaker endpoint, access an S3 bucket, and use the ECR repository.
This role should also be assumable by the user performing the deployment. Learn more about this setup at
[Use an IAM role in the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-role.html).

#### Create an MLflow Model

Before deploying, you must have an MLflow Model. If you don't have one, you can create a sample scikit-learn model by following the [MLflow Tracking Quickstart](/ml/getting-started).
Remember to note down the model URI, such as `models:/<model_id>` (or `models:/<model_name>/<model_version>` if you registered the model in the
[MLflow Model Registry](/ml/model-registry)).

### Step 1: Test your model locally

It's recommended to test your model locally before deploying it to a production environment.
The <APILink fn="mlflow.sagemaker.run_local">`mlflow deployments run-local`</APILink> command deploys
the model in a Docker container with an identical image and environment configuration, making it ideal
for pre-deployment testing.

```bash
mlflow deployments run-local -t sagemaker -m models:/<model_id> -p 5000
```

You can then test the model by sending a POST request to the endpoint:

```bash
curl -X POST -H "Content-Type:application/json; format=pandas-split" --data '{"columns":["a","b"],"data":[[1,2]]}' http://localhost:5000/invocations
```

### Step 2: Build a Docker Image and Push to ECR

The <APILink fn="mlflow.server.cli.html" hash="mlflow-sagemaker-build-and-push-container">mlflow sagemaker build-and-push-container</APILink>
command builds a Docker image compatible with SageMaker and uploads it to ECR.

```bash
$ mlflow sagemaker build-and-push-container  -m models:/<model_id>
```

Alternatively, you can create a custom Docker image using the
[official MLflow Docker image](/ml/docker) and manually push it to ECR.

### Step 3: Deploy to SageMaker Endpoint

The <APILink fn="mlflow.sagemaker.SageMakerDeploymentClient.create_deployment">`mlflow deployments create`</APILink>
command deploys the model to an Amazon SageMaker endpoint. MLflow uploads the Python Function model to S3 and automatically
initiates an Amazon SageMaker endpoint serving the model.

Various command-line options are available to customize the deployment, such as instance type, count, IAM role, etc.
Refer to the <APILink fn="mlflow.server.cli" hash="mlflow-sagemaker">CLI reference</APILink> for a complete list of options.

```bash
$ mlflow deployments create -t sagemaker -m runs:/<run_id>/model \
    -C region_name=<your-region> \
    -C instance-type=ml.m4.xlarge \
    -C instance-count=1 \
    -C env='{"DISABLE_NGINX": "true"}''
```

## API Reference

You have two options for deploying a model to SageMaker: using the CLI or the Python API.

- <APILink fn="mlflow.server.cli" hash="mlflow-sagemaker">CLI Reference</APILink>
- <APILink fn="mlflow.sagemaker">Python API Documentation</APILink>

## Useful Links \{#deployment-sagemaker-references}

- [MLflow Quickstart Part 2: Serving Models Using Amazon SageMaker](https://docs.databricks.com/en/_extras/notebooks/source/mlflow/mlflow-quick-start-deployment-aws.html) -
  This step-by-step tutorial demonstrates how to deploy a model to SageMaker using MLflow Python APIs from a Databricks notebook.
- [Managing Your Machine Learning Lifecycle with MLflow and Amazon SageMaker](https://aws.amazon.com/blogs/machine-learning/managing-your-machine-learning-lifecycle-with-mlflow-and-amazon-sagemaker) -
  This comprehensive tutorial covers integrating the entire MLflow lifecycle with SageMaker, from model training to deployment.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/classic-ml/docker/index.mdx

```text
# Official MLflow Docker image

The official MLflow Docker image is available on GitHub Container Registry at https://ghcr.io/mlflow/mlflow.

```shell
export CR_PAT=YOUR_TOKEN
echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin
# Pull the latest version
docker pull ghcr.io/mlflow/mlflow
# Pull 2.0.1
docker pull ghcr.io/mlflow/mlflow:v2.0.1
```
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/classic-ml/evaluation/index.mdx

```text
---
title: Model Evaluation
---

import FeatureHighlights from "@site/src/components/FeatureHighlights";
import { Zap, BarChart, Wrench, Users } from "lucide-react";
import { APILink } from "@site/src/components/APILink";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Model Evaluation

:::warning Classic ML Evaluation System

This documentation covers MLflow's **classic evaluation system** (`mlflow.models.evaluate`) which uses `EvaluationMetric` and `make_metric` for custom metrics.

**For GenAI/LLM evaluation**, please use the system at [GenAI Evaluation](/genai/eval-monitor) which uses:

- `mlflow.genai.evaluate()` instead of `mlflow.models.evaluate()`
- `Scorer` objects instead of `EvaluationMetric`
- Built-in LLM judges and scorers

**Important**: These two systems are **not interoperable**. `EvaluationMetric` objects cannot be used with `mlflow.genai.evaluate()`, and `Scorer` objects cannot be used with `mlflow.models.evaluate()`.
:::

## Introduction

MLflow's evaluation framework provides automated model assessment for classification and regression tasks. It generates performance metrics, visualizations, and diagnostic information through a unified API.

<FeatureHighlights
  features={[
    {
      icon: Zap,
      title: "Unified Evaluation API",
      description: "Evaluate models, Python functions, or static datasets with mlflow.models.evaluate() using a consistent interface across different evaluation modes.",
    },
    {
      icon: BarChart,
      title: "Automated Metrics & Visualizations",
      description: "Generate task-specific metrics and plots automatically, including confusion matrices, ROC curves, and feature importance with SHAP integration.",
    },
    {
      icon: Wrench,
      title: "Custom Metrics",
      description: "Define domain-specific evaluation criteria with make_metric() for business-specific performance measures beyond standard ML metrics.",
    },
    {
      icon: Users,
      title: "Plugin Architecture",
      description: "Extend evaluation with specialized frameworks like Giskard and Trubrics for advanced validation and vulnerability scanning.",
    },
  ]}
/>

## Model Evaluation

Evaluate classification and regression models with automated metrics and visualizations.

### Quick Start

```python
import mlflow
import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.datasets import load_breast_cancer
from mlflow.models import infer_signature

# Load dataset
X, y = load_breast_cancer(return_X_y=True, as_frame=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# Train model
model = xgb.XGBClassifier().fit(X_train, y_train)

# Create evaluation dataset
eval_data = X_test.copy()
eval_data["label"] = y_test

with mlflow.start_run():
    # Log model
    signature = infer_signature(X_test, model.predict(X_test))
    model_info = mlflow.sklearn.log_model(model, name="model", signature=signature)

    # Evaluate
    result = mlflow.models.evaluate(
        model_info.model_uri,
        eval_data,
        targets="label",
        model_type="classifier",
    )

    print(f"Accuracy: {result.metrics['accuracy_score']:.3f}")
    print(f"F1 Score: {result.metrics['f1_score']:.3f}")
    print(f"ROC AUC: {result.metrics['roc_auc']:.3f}")
```

This automatically generates performance metrics (accuracy, precision, recall, F1-score, ROC-AUC), visualizations (confusion matrix, ROC curve, precision-recall curve), and saves all artifacts to MLflow.

### Model Types

<Tabs>
  <TabItem value="classification" label="Classification" default>

For classification tasks:

```python
result = mlflow.models.evaluate(
    model_uri,
    eval_data,
    targets="label",
    model_type="classifier",
)

# Access metrics
print(f"Precision: {result.metrics['precision_score']:.3f}")
print(f"Recall: {result.metrics['recall_score']:.3f}")
print(f"F1 Score: {result.metrics['f1_score']:.3f}")
print(f"ROC AUC: {result.metrics['roc_auc']:.3f}")
```

Automatically generates: accuracy, precision, recall, F1-score, ROC-AUC, precision-recall AUC, log loss, brier score, confusion matrix, and classification report.

  </TabItem>
  <TabItem value="regression" label="Regression">

For regression tasks:

```python
from sklearn.datasets import fetch_california_housing
from sklearn.linear_model import LinearRegression

# Load regression dataset
housing = fetch_california_housing(as_frame=True)
X_train, X_test, y_train, y_test = train_test_split(
    housing.data, housing.target, test_size=0.2, random_state=42
)

# Train model
model = LinearRegression().fit(X_train, y_train)

# Create evaluation dataset
eval_data = X_test.copy()
eval_data["target"] = y_test

with mlflow.start_run():
    signature = infer_signature(X_train, model.predict(X_train))
    model_info = mlflow.sklearn.log_model(model, name="model", signature=signature)

    result = mlflow.models.evaluate(
        model_info.model_uri,
        eval_data,
        targets="target",
        model_type="regressor",
    )

    print(f"MAE: {result.metrics['mean_absolute_error']:.3f}")
    print(f"RMSE: {result.metrics['root_mean_squared_error']:.3f}")
    print(f"R² Score: {result.metrics['r2_score']:.3f}")
```

Automatically generates: MAE, MSE, RMSE, R² score, adjusted R², MAPE, residual plots, and distribution analysis.

  </TabItem>
</Tabs>

### Evaluator Configuration

Control evaluator behavior with the `evaluator_config` parameter:

```python
# Include SHAP explainer for feature importance
result = mlflow.models.evaluate(
    model_uri,
    eval_data,
    targets="label",
    model_type="classifier",
    evaluator_config={
        "log_explainer": True,
        "explainer_type": "exact",
    },
)
```

Common options: `log_explainer` (log SHAP explainer), `explainer_type` (SHAP type: "exact", "permutation", "partition"), `pos_label` (positive class label for binary classification), `average` (averaging strategy for multiclass: "macro", "micro", "weighted").

### Evaluation Results

Access metrics, artifacts, and evaluation data:

```python
# Run evaluation
result = mlflow.models.evaluate(
    model_uri, eval_data, targets="label", model_type="classifier"
)

# Access metrics
for metric_name, value in result.metrics.items():
    print(f"{metric_name}: {value}")

# Access artifacts (plots, tables)
for artifact_name, path in result.artifacts.items():
    print(f"{artifact_name}: {path}")

# Access evaluation table
eval_table = result.tables["eval_results_table"]
```

### Model Validation

:::warning

MLflow 2.18.0 moved model validation from <APILink fn="mlflow.models.evaluate" /> to <APILink fn="mlflow.validate_evaluation_results" />.
:::

Validate evaluation metrics against thresholds:

```python
from mlflow.models import MetricThreshold

# Evaluate model
result = mlflow.models.evaluate(
    model_uri, eval_data, targets="label", model_type="classifier"
)

# Define thresholds
thresholds = {
    "accuracy_score": MetricThreshold(threshold=0.85, greater_is_better=True),
    "precision_score": MetricThreshold(threshold=0.80, greater_is_better=True),
}

# Validate
try:
    mlflow.validate_evaluation_results(
        candidate_result=result,
        validation_thresholds=thresholds,
    )
    print("Model meets all thresholds")
except mlflow.exceptions.ModelValidationFailedException as e:
    print(f"Validation failed: {e}")
```

## Dataset Evaluation

Evaluate pre-computed predictions without re-running the model.

### Usage

```python
import mlflow
import pandas as pd
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Generate sample data and train a model
X, y = make_classification(n_samples=1000, n_features=20, n_classes=2, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Generate predictions
predictions = model.predict(X_test)
prediction_probabilities = model.predict_proba(X_test)[:, 1]

# Create evaluation dataset with predictions
eval_dataset = pd.DataFrame(
    {
        "prediction": predictions,
        "target": y_test,
    }
)

with mlflow.start_run():
    result = mlflow.models.evaluate(
        data=eval_dataset,
        predictions="prediction",
        targets="target",
        model_type="classifier",
    )

    print(f"Accuracy: {result.metrics['accuracy_score']:.3f}")
    print(f"F1 Score: {result.metrics['f1_score']:.3f}")
```

### Parameters

- `data`: DataFrame containing predictions and targets
- `predictions`: Column name containing model predictions
- `targets`: Column name containing ground truth labels
- `model_type`: Task type (`"classifier"` or `"regressor"`)

When evaluating classification models with probability scores, include a column with probabilities for metrics like ROC-AUC:

```python
eval_dataset = pd.DataFrame(
    {
        "prediction": predictions,
        "prediction_proba": prediction_probabilities,  # For ROC-AUC
        "target": y_test,
    }
)
```

## Function Evaluation

Evaluate Python functions directly without logging models to MLflow.

### Usage

```python
import mlflow
import pandas as pd
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Generate sample data
X, y = make_classification(n_samples=1000, n_features=20, n_classes=2, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# Train a model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)


# Define a prediction function
def predict_function(input_data):
    return model.predict(input_data)


# Create evaluation dataset
eval_data = pd.DataFrame(X_test)
eval_data["target"] = y_test

with mlflow.start_run():
    result = mlflow.models.evaluate(
        predict_function,
        eval_data,
        targets="target",
        model_type="classifier",
    )

    print(f"Accuracy: {result.metrics['accuracy_score']:.3f}")
    print(f"F1 Score: {result.metrics['f1_score']:.3f}")
```

### Function Requirements

The function must:

- Accept input data as its first parameter (DataFrame, numpy array, or compatible format)
- Return predictions in a format compatible with the specified `model_type`
- Be callable without additional arguments beyond the input data

For classification tasks, the function should return class predictions. For regression tasks, it should return continuous values.

## Custom Metrics & Visualizations

Define custom evaluation metrics and create specialized visualizations.

### Custom Metrics

:::note Classic System Only

The `make_metric` function is part of MLflow's classic evaluation system.

For GenAI/LLM custom metrics, use the [@scorer decorator](/genai/eval-monitor/scorers/custom) instead.
:::

Create custom metrics with `make_metric`:

```python
import mlflow
import numpy as np
from mlflow.models import make_metric
from mlflow.metrics.base import MetricValue


# Define custom metric
def custom_metric_fn(predictions, targets, metrics):
    """Custom metric function."""
    tp = np.sum((predictions == 1) & (targets == 1))
    fp = np.sum((predictions == 1) & (targets == 0))

    # Calculate custom value
    custom_value = (tp * 100) - (fp * 20)

    return MetricValue(
        aggregate_results={
            "custom_value": custom_value,
            "value_per_prediction": custom_value / len(predictions),
        },
    )


# Create metric
custom_metric = make_metric(
    eval_fn=custom_metric_fn, greater_is_better=True, name="custom_metric"
)

with mlflow.start_run():
    result = mlflow.models.evaluate(
        model_uri,
        eval_data,
        targets="target",
        model_type="classifier",
        extra_metrics=[custom_metric],
    )

    print(f"Custom Value: {result.metrics['custom_metric/custom_value']:.2f}")
```

Custom metric functions receive three parameters:

- `predictions`: Model predictions (numpy array)
- `targets`: Ground truth labels (numpy array)
- `metrics`: Dictionary of built-in metrics already computed

Return a `MetricValue` object with `aggregate_results` dict containing your custom metric values.

### Custom Visualizations

Create custom visualization artifacts:

```python
import matplotlib.pyplot as plt
import os


def create_custom_plot(eval_df, builtin_metrics, artifacts_dir):
    """Create custom visualization."""
    plt.figure(figsize=(10, 6))
    plt.scatter(eval_df["prediction"], eval_df["target"], alpha=0.5)
    plt.xlabel("Predictions")
    plt.ylabel("Targets")
    plt.title("Custom Prediction Analysis")

    # Save plot
    plot_path = os.path.join(artifacts_dir, "custom_plot.png")
    plt.savefig(plot_path)
    plt.close()

    return {"custom_plot": plot_path}


# Use custom artifact
with mlflow.start_run():
    result = mlflow.models.evaluate(
        model_uri,
        eval_data,
        targets="target",
        model_type="classifier",
        custom_artifacts=[create_custom_plot],
    )
```

Custom artifact functions receive three parameters:

- `eval_df`: DataFrame with predictions, targets, and input features
- `builtin_metrics`: Dictionary of computed metrics
- `artifacts_dir`: Directory path to save artifact files

Return a dictionary mapping artifact names to file paths.

## SHAP Integration

MLflow's built-in SHAP integration provides automatic model explanations and feature importance analysis.

### Usage

Enable SHAP explanations by setting `log_explainer: True` in the evaluator config:

```python
import mlflow
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.datasets import load_breast_cancer
from mlflow.models import infer_signature

# Load dataset
X, y = load_breast_cancer(return_X_y=True, as_frame=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# Train model
model = xgb.XGBClassifier().fit(X_train, y_train)

# Create evaluation dataset
eval_data = X_test.copy()
eval_data["label"] = y_test

with mlflow.start_run():
    signature = infer_signature(X_test, model.predict(X_test))
    model_info = mlflow.sklearn.log_model(model, name="model", signature=signature)

    # Evaluate with SHAP enabled
    result = mlflow.models.evaluate(
        model_info.model_uri,
        eval_data,
        targets="label",
        model_type="classifier",
        evaluator_config={"log_explainer": True},
    )

    # Check generated SHAP artifacts
    for artifact_name in result.artifacts:
        if "shap" in artifact_name.lower():
            print(f"Generated: {artifact_name}")
```

This generates feature importance plots, SHAP summary plots, and saves a SHAP explainer model.

### Configuration

Control SHAP behavior with evaluator config options:

```python
result = mlflow.models.evaluate(
    model_uri,
    eval_data,
    targets="label",
    model_type="classifier",
    evaluator_config={
        "log_explainer": True,
        "explainer_type": "exact",
        "max_error_examples": 100,
        "log_model_explanations": True,
    },
)
```

**Configuration Options:**

- `log_explainer`: Whether to save the SHAP explainer as a model (default: False)
- `explainer_type`: SHAP algorithm type - "exact", "permutation", or "partition"
- `max_error_examples`: Number of misclassified examples to explain in detail
- `log_model_explanations`: Whether to log individual prediction explanations

### Using Saved Explainers

Load and use saved SHAP explainers on new data:

```python
# Load the saved explainer
explainer_uri = f"runs:/{run_id}/explainer"
explainer = mlflow.pyfunc.load_model(explainer_uri)

# Generate explanations for new data
new_data = X_test[:10]
explanations = explainer.predict(new_data)

# explanations contains SHAP values for each feature and prediction
print(f"Explanations shape: {explanations.shape}")
```

## Plugin Evaluators

MLflow's evaluation framework supports plugin evaluators that extend evaluation with specialized validation capabilities.

### Giskard Plugin

The [Giskard](https://docs.giskard.ai/en/latest/integrations/mlflow/index.html) plugin scans models for vulnerabilities including performance bias, robustness issues, overconfidence, underconfidence, ethical bias, data leakage, stochasticity, and spurious correlations.

**Examples:**

- [Tabular ML Models](https://docs.giskard.ai/en/latest/integrations/mlflow/mlflow-tabular-example.html)
- [Text ML Models (LLMs)](https://docs.giskard.ai/en/latest/integrations/mlflow/mlflow-llm-example.html)

**Documentation:** [Giskard-MLflow integration docs](https://docs.giskard.ai/en/latest/integrations/mlflow/index.html)

### Trubrics Plugin

The [Trubrics](https://github.com/trubrics/trubrics-sdk) plugin provides a validation framework with pre-built validation checks and support for custom Python validation functions.

**Example:** [Official example notebook](https://github.com/trubrics/trubrics-python/blob/v1.3.4/examples/mlflow/mlflow-trubrics.ipynb)

**Documentation:** [Trubrics-MLflow integration docs](https://trubrics.github.io/trubrics-sdk/mlflow/) {/* <!-- markdown-link-check-disable-line --> */}

## API Reference

- <APILink fn="mlflow.models.evaluate" /> - Main evaluation API
- <APILink fn="mlflow.validate_evaluation_results" /> - Validate evaluation results
- <APILink fn="mlflow.models.make_metric" /> - Create custom metrics
- <APILink fn="mlflow.metrics.base.MetricValue" /> - Metric return value
```

--------------------------------------------------------------------------------

---[FILE: deep-learning.mdx]---
Location: mlflow-master/docs/docs/classic-ml/getting-started/deep-learning.mdx

```text
---
sidebar_position: 2
toc_max_heading_level: 4
sidebar_label: Deep Learning
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import ImageBox from "@site/src/components/ImageBox";

# Deep Learning Quickstart

<ImageBox src="/images/tutorials/introductory/deep-learning/ui-system-metrics.png" alt="MLflow UI System metrics page" width="80%" />

In this tutorial, we demonstrate how to use MLflow to track deep learning experiments with Pytorch. By combining MLflow

- Save **checkpoints** with metrics.
- Visualize the **loss curve** during training.
- Monitor **system metrics** such as GPU utilization, memory footprint, disk usage, network, etc.
- Record **hyperparameters** and optimizer settings.
- Snapshot **library versions** for reproducibility.

## Prerequisites: Set up MLflow and Pytorch

MLflow is available on PyPI. Install MLflow and Pytorch with:

```bash
pip install mlflow torch torchvision
```

Then, follow the instructions in the [Set Up MLflow](/ml/getting-started/running-notebooks) guide to set up MLflow.

## Step 1: Create a new experiment

Create a new MLflow experiment for the tutorial and enable system metrics monitoring. Here we set the monitoring interval to 1 second because the training will be quick, but for longer training runs, you can set it to a larger value.

```python
import mlflow

# The set_experiment API creates a new experiment if it doesn't exist.
mlflow.set_experiment("Deep Learning Experiment")

# IMPORTANT: Enable system metrics monitoring
mlflow.config.enable_system_metrics_logging()
mlflow.config.set_system_metrics_sampling_interval(1)
```

## Step 2: Prepare the dataset

In this example, we will use the FashionMNIST dataset, which is a collection of 28x28 grayscale images of 10 different types of clothing.

```python
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

# Define device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load and prepare data
transform = transforms.Compose(
    [transforms.ToTensor(), transforms.Normalize((0.1307,), (0.3081,))]
)
train_dataset = datasets.FashionMNIST(
    "data", train=True, download=True, transform=transform
)
test_dataset = datasets.FashionMNIST("data", train=False, transform=transform)
train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=1000)
```

## Step 3: Define the model and optimizer

Define a simple MLP model with 2 hidden layers.

```python
import torch.nn as nn


class NeuralNetwork(nn.Module):
    def __init__(self):
        super().__init__()
        self.flatten = nn.Flatten()
        self.linear_relu_stack = nn.Sequential(
            nn.Linear(28 * 28, 512),
            nn.ReLU(),
            nn.Linear(512, 512),
            nn.ReLU(),
            nn.Linear(512, 10),
        )

    def forward(self, x):
        x = self.flatten(x)
        logits = self.linear_relu_stack(x)
        return logits


model = NeuralNetwork().to(device)
```

Then, define the training parameters and optimizer.

```python
# Training parameters
params = {
    "epochs": 5,
    "learning_rate": 1e-3,
    "batch_size": 64,
    "optimizer": "SGD",
    "model_type": "MLP",
    "hidden_units": [512, 512],
}

# Define optimizer and loss function
loss_fn = nn.CrossEntropyLoss()
optimizer = optim.SGD(model.parameters(), lr=params["learning_rate"])
```

## Step 4: Train the model

Now we are ready to train the model. Inside the training loop, we log the metrics and checkpoints to MLflow. The key points in this code are:

- Initiate an MLflow **run** context to start a new run that we will log the model and metadata to.
- Log training parameters using `mlflow.log_params`.
- Log various metrics using `mlflow.log_metrics`.
- Save checkpoints for each epoch using `mlflow.pytorch.log_model`.

```python
with mlflow.start_run() as run:
    # Log training parameters
    mlflow.log_params(params)

    for epoch in range(params["epochs"]):
        model.train()
        train_loss, correct, total = 0, 0, 0

        for batch_idx, (data, target) in enumerate(train_loader):
            data, target = data.to(device), target.to(device)

            # Forward pass
            optimizer.zero_grad()
            output = model(data)
            loss = loss_fn(output, target)

            # Backward pass
            loss.backward()
            optimizer.step()

            # Calculate metrics
            train_loss += loss.item()
            _, predicted = output.max(1)
            total += target.size(0)
            correct += predicted.eq(target).sum().item()

            # Log batch metrics (every 100 batches)
            if batch_idx % 100 == 0:
                batch_loss = train_loss / (batch_idx + 1)
                batch_acc = 100.0 * correct / total
                mlflow.log_metrics(
                    {"batch_loss": batch_loss, "batch_accuracy": batch_acc},
                    step=epoch * len(train_loader) + batch_idx,
                )

        # Calculate epoch metrics
        epoch_loss = train_loss / len(train_loader)
        epoch_acc = 100.0 * correct / total

        # Validation
        model.eval()
        val_loss, val_correct, val_total = 0, 0, 0
        with torch.no_grad():
            for data, target in test_loader:
                data, target = data.to(device), target.to(device)
                output = model(data)
                loss = loss_fn(output, target)

                val_loss += loss.item()
                _, predicted = output.max(1)
                val_total += target.size(0)
                val_correct += predicted.eq(target).sum().item()

        # Calculate and log epoch validation metrics
        val_loss = val_loss / len(test_loader)
        val_acc = 100.0 * val_correct / val_total

        # Log epoch metrics
        mlflow.log_metrics(
            {
                "train_loss": epoch_loss,
                "train_accuracy": epoch_acc,
                "val_loss": val_loss,
                "val_accuracy": val_acc,
            },
            step=epoch,
        )
        # Log checkpoint at the end of each epoch
        mlflow.pytorch.log_model(model, name=f"checkpoint_{epoch}")

        print(
            f"Epoch {epoch+1}/{params['epochs']}, "
            f"Train Loss: {epoch_loss:.4f}, Train Acc: {epoch_acc:.2f}%, "
            f"Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.2f}%"
        )

    # Log the final trained model
    model_info = mlflow.pytorch.log_model(model, name="final_model")
```

## Step 5: View the training results in the MLflow UI

To see the results of training, you can access the MLflow UI by navigating to the URL of the Tracking Server. If you have not started one, open a new terminal and run the following command at the root of the MLflow project and access the UI at http://localhost:5000 (or the port number you specified).

```bash
mlflow server --port 5000
```

When opening the site, you will see a screen similar to the following:

<ImageBox src="/images/tutorials/introductory/deep-learning/ui-home.png" alt="MLflow UI Home page" />

The "Experiments" section shows a list of (recently created) experiments. Click on the "Deep Learning Experiment" experiment we've created for this tutorial.

<ImageBox src="/images/tutorials/introductory/hyperparameter-tuning/ui-run-list.png" alt="MLflow UI Run list page" />

Click the Run in the table to view the details of the run. The overview page shows metadata such as the run duration, start time, training parameters, tags, etc. Navigate to the **Model metrics** and **System metrics** tabs to view the performance and system metrics logged during training.

<Tabs>
  <TabItem value="overview" label="Overview">
    <ImageBox src="/images/tutorials/introductory/deep-learning/ui-run-overview.png" alt="MLflow UI Overview page" />
  </TabItem>
  <TabItem value="model-metrics" label="Model Metrics" default>
    <ImageBox src="/images/tutorials/introductory/deep-learning/ui-model-metrics.png" alt="MLflow UI Model metrics page" />
  </TabItem>
  <TabItem value="system-metrics" label="System Metrics">
    <ImageBox src="/images/tutorials/introductory/deep-learning/ui-system-metrics.png" alt="MLflow UI System metrics page" />
  </TabItem>
</Tabs>

## Step 6: Load back the model and run inference

You can load the final model or checkpoint from MLflow using the `mlflow.pytorch.load_model` function. Let's run the loaded model on the test set and evaluate the performance.

```python
# Load the final model
model = mlflow.pytorch.load_model("runs:/<run_id>/final_model")
# or load a checkpoint
# model = mlflow.pytorch.load_model("runs:/<run_id>/checkpoint_<epoch>")
model.to(device)
model.eval()

# Resume the previous run to log test metrics
with mlflow.start_run(run_id=run.info.run_id) as run:
    # Evaluate the model on the test set
    test_loss, test_correct, test_total = 0, 0, 0
    with torch.no_grad():
        for data, target in test_loader:
            data, target = data.to(device), target.to(device)
        output = model(data)
        loss = loss_fn(output, target)

        test_loss += loss.item()
        _, predicted = output.max(1)
        test_total += target.size(0)
        test_correct += predicted.eq(target).sum().item()

    # Calculate and log final test metrics
    test_loss = test_loss / len(test_loader)
    test_acc = 100.0 * test_correct / test_total

    mlflow.log_metrics({"test_loss": test_loss, "test_accuracy": test_acc})
    print(f"Final Test Accuracy: {test_acc:.2f}%")
```

## Next Steps

Congratulations on working through the MLflow Deep Learning Quickstart! You should now have a basic understanding of how to combine MLflow with deep learning frameworks such as PyTorch to track your experiments and models.

- [MLflow for Deep Learning](/ml/deep-learning): Learn more about MLflow integration with deep learning frameworks.
- [MLflow for GenAI](/genai): Learn how to use MLflow for GenAI/LLM development.
- [MLflow Tracking](/ml/tracking/): Learn more about the MLflow Tracking APIs.
- [Self-hosting Guide](/self-hosting): Learn how to self-host the MLflow Tracking Server and set it up for team collaboration.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/classic-ml/getting-started/index.mdx

```text
---
sidebar_position: 3
---

import Link from "@docusaurus/Link";
import useBaseUrl from '@docusaurus/useBaseUrl';
import ImageBox from "@site/src/components/ImageBox";

# Getting Started with MLflow

If you're new to MLflow or seeking a refresher on its core functionalities, these
quickstart tutorials here are the perfect starting point. Jump into the tutorial that best suits your needs and get started with MLflow.

## Experiment Tracking Quickstart

This tutorial walk through the basic experiment tracking capabilities of MLflow by training a simple scikit-learn model. If you are new to MLflow, this is a great place to start.

[→ Getting Started with MLflow](/ml/getting-started/quickstart)

<Link href="/ml/getting-started/quickstart">
<ImageBox src="/images/tutorials/introductory/quickstart-tracking/quickstart-ui-home.png" alt="MLflow UI Home page" width="80%"/>
</Link>

## LLMOps and GenAI Quickstart

This tutorial walk through the basic LLMOps and GenAI capabilities of MLflow, such as tracing (observability), evaluation, and prompt management. If you are AI practitioner looking to build production-ready GenAI applications, start here.

[→ Getting Started with MLflow for GenAI](/genai/getting-started)

<Link href="/genai/getting-started">
<video src={useBaseUrl("/images/llms/tracing/tracing-top.mp4")} controls loop autoPlay muted aria-label="MLflow Tracing" />
</Link>

## Hyperparameter Tuning Tutorial

MLflow's experiment tracking capabilities have a strong synergy with large-scale hyperparameter tuning. This tutorial guides you through the process of running hyperparameter tuning jobs with MLflow and Optuna, and effectively compare and select the best model.

[→ Getting Started with Hyperparameter Tuning](/ml/getting-started/hyperparameter-tuning)

<Link href="/ml/getting-started/hyperparameter-tuning">
  <ImageBox src="/images/tutorials/introductory/hyperparameter-tuning/ui-compare-metrics.png" alt="MLflow UI Comparison page" width="80%" />
</Link>

## Deep Learning Tutorial

MLflow offers smooth integration with popular deep learning frameworks, such as PyTorch and TensorFlow. In this tutorial, we train a simple deep learning model with PyTorch, and demonstrate how MLflow can help you track training process and system metrics such as GPU utilization.

[→ Deep Learning Tutorial](/ml/getting-started/deep-learning)

<Link href="/ml/getting-started/deep-learning">
  <ImageBox src="/images/tutorials/introductory/deep-learning/ui-model-metrics.png" alt="MLflow UI Model metrics page" width="80%" />
</Link>
>
```

--------------------------------------------------------------------------------

````
