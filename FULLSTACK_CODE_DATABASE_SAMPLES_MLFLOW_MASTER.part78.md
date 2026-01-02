---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 78
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 78 of 991)

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
Location: mlflow-master/docs/docs/classic-ml/projects/index.mdx

```text
# MLflow Projects

MLflow Projects provide a standard format for packaging and sharing reproducible data science code. Based on simple conventions, Projects enable seamless collaboration and automated execution across different environments and platforms.

## Quick Start

### Running Your First Project

Execute any Git repository or local directory as an MLflow Project:

```bash
# Run a project from GitHub
mlflow run https://github.com/mlflow/mlflow-example.git -P alpha=0.5

# Run a local project
mlflow run . -P data_file=data.csv -P regularization=0.1

# Run with specific entry point
mlflow run . -e validate -P data_file=data.csv
```

```python
# Run projects programmatically
import mlflow

# Execute remote project
result = mlflow.run(
    "https://github.com/mlflow/mlflow-example.git",
    parameters={"alpha": 0.5, "l1_ratio": 0.01},
    experiment_name="elasticnet_experiment",
)

# Execute local project
result = mlflow.run(
    ".", entry_point="train", parameters={"epochs": 100}, synchronous=True
)
```

:::tip Project Structure
Any directory with a `MLproject` file or containing `.py`/`.sh` files can be run as an MLflow Project. No complex setup required!
:::

## Core Concepts

### Project Components

Every MLflow Project consists of three key elements:

#### **Project Name**

A human-readable identifier for your project, typically defined in the `MLproject` file.

#### **Entry Points**

Commands that can be executed within the project. Entry points define:

- **Parameters** - Inputs with types and default values
- **Commands** - What gets executed when the entry point runs
- **Environment** - The execution context and dependencies

#### **Environment**

The software environment containing all dependencies needed to run the project. MLflow supports multiple environment types:

| Environment                    | Use Case                         | Dependencies      |
| ------------------------------ | -------------------------------- | ----------------- |
| **Virtualenv** _(Recommended)_ | Python packages from PyPI        | `python_env.yaml` |
| **Conda**                      | Python + native libraries        | `conda.yaml`      |
| **Docker**                     | Complex dependencies, non-Python | Dockerfile        |
| **System**                     | Use current environment          | None              |

## Project Structure & Configuration

### Convention-Based Projects

Projects without an `MLproject` file use these conventions:

```
my-project/
├── train.py              # Executable entry point
├── validate.sh           # Shell script entry point
├── conda.yaml           # Optional: Conda environment
├── python_env.yaml      # Optional: Python environment
└── data/                # Project data and assets
```

**Default Behavior:**

- **Name**: Directory name
- **Entry Points**: Any `.py` or `.sh` file
- **Environment**: Conda environment from `conda.yaml`, or Python-only environment
- **Parameters**: Passed via command line as `--key value`

### MLproject File Configuration

For advanced control, create an `MLproject` file:

```yaml
name: My ML Project

# Environment specification (choose one)
python_env: python_env.yaml
# conda_env: conda.yaml
# docker_env:
#   image: python:3.9

entry_points:
  main:
    parameters:
      data_file: path
      regularization: {type: float, default: 0.1}
      max_epochs: {type: int, default: 100}
    command: "python train.py --reg {regularization} --epochs {max_epochs} {data_file}"

  validate:
    parameters:
      model_path: path
      test_data: path
    command: "python validate.py {model_path} {test_data}"

  hyperparameter_search:
    parameters:
      search_space: uri
      n_trials: {type: int, default: 50}
    command: "python hyperparam_search.py --trials {n_trials} --config {search_space}"
```

### Parameter Types

MLflow supports four parameter types with automatic validation and transformation:

| Type       | Description      | Example                        | Special Handling                     |
| ---------- | ---------------- | ------------------------------ | ------------------------------------ |
| **string** | Text data        | `"hello world"`                | None                                 |
| **float**  | Decimal numbers  | `0.1`, `3.14`                  | Validation                           |
| **int**    | Whole numbers    | `42`, `100`                    | Validation                           |
| **path**   | Local file paths | `data.csv`, `s3://bucket/file` | Downloads remote URIs to local files |
| **uri**    | Any URI          | `s3://bucket/`, `./local/path` | Converts relative paths to absolute  |

:::note Parameter Resolution
`path` parameters automatically download remote files (S3, GCS, etc.) to local storage before execution. Use `uri` for applications that can read directly from remote storage.
:::

## Environment Management

### Python Virtual Environments (Recommended)

Create a `python_env.yaml` file for pure Python dependencies:

```yaml
# python_env.yaml
python: "3.9.16"

# Optional: build dependencies
build_dependencies:
  - pip
  - setuptools
  - wheel==0.37.1

# Runtime dependencies
dependencies:
  - mlflow>=2.0.0
  - scikit-learn==1.2.0
  - pandas>=1.5.0
  - numpy>=1.21.0
```

```yaml
# MLproject
name: Python Project
python_env: python_env.yaml

entry_points:
  main:
    command: "python train.py"
```

### Conda Environments

For projects requiring native libraries or complex dependencies:

```yaml
# conda.yaml
name: ml-project
channels:
  - conda-forge
  - defaults
dependencies:
  - python=3.9
  - cudnn=8.2.1  # CUDA libraries
  - scikit-learn
  - pip
  - pip:
    - mlflow>=2.0.0
    - tensorflow==2.10.0
```

```yaml
# MLproject
name: Deep Learning Project
conda_env: conda.yaml

entry_points:
  train:
    parameters:
      gpu_count: {type: int, default: 1}
    command: "python train_model.py --gpus {gpu_count}"
```

:::warning Conda Terms
By using Conda, you agree to [Anaconda's Terms of Service](https://legal.anaconda.com/policies/en/?name=terms-of-service).
:::

### Docker Environments

For maximum reproducibility and complex system dependencies:

```dockerfile
# Dockerfile
FROM python:3.9-slim

RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install -r requirements.txt

WORKDIR /mlflow/projects/code
```

```yaml
# MLproject
name: Containerized Project
docker_env:
  image: my-ml-image:latest
  volumes: ["/host/data:/container/data"]
  environment:
    - ["CUDA_VISIBLE_DEVICES", "0,1"]
    - "AWS_PROFILE"  # Copy from host

entry_points:
  train:
    command: "python distributed_training.py"
```

**Advanced Docker Options:**

```yaml
docker_env:
  image: 012345678910.dkr.ecr.us-west-2.amazonaws.com/ml-training:v1.0
  volumes:
    - "/local/data:/data"
    - "/tmp:/tmp"
  environment:
    - ["MODEL_REGISTRY", "s3://my-bucket/models"]
    - ["EXPERIMENT_NAME", "production-training"]
    - "MLFLOW_TRACKING_URI"  # Copy from host
```

### Environment Manager Selection

Control which environment manager to use:

```bash
# Force virtualenv (ignores conda.yaml)
mlflow run . --env-manager virtualenv

# Use local environment (no isolation)
mlflow run . --env-manager local

# Use conda (default if conda.yaml present)
mlflow run . --env-manager conda
```

## Execution & Deployment

### Local Execution

```bash
# Basic execution
mlflow run .

# With parameters
mlflow run . -P lr=0.01 -P batch_size=32

# Specific entry point
mlflow run . -e hyperparameter_search -P n_trials=100

# Custom environment
mlflow run . --env-manager virtualenv
```

### Remote Execution

#### Databricks Platform

```bash
# Run on Databricks cluster
mlflow run . --backend databricks --backend-config cluster-config.json
```

```json
// cluster-config.json
{
  "cluster_spec": {
    "new_cluster": {
      "node_type_id": "i3.xlarge",
      "num_workers": 2,
      "spark_version": "11.3.x-scala2.12"
    }
  },
  "run_name": "distributed-training"
}
```

#### Kubernetes Clusters

```bash
# Run on Kubernetes
mlflow run . --backend kubernetes --backend-config k8s-config.json
```

```json
// k8s-config.json
{
  "kube-context": "my-cluster",
  "repository-uri": "gcr.io/my-project/ml-training",
  "kube-job-template-path": "k8s-job-template.yaml"
}
```

```yaml
# k8s-job-template.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: "{replaced-with-project-name}"
  namespace: mlflow
spec:
  ttlSecondsAfterFinished: 3600
  backoffLimit: 2
  template:
    spec:
      containers:
      - name: "{replaced-with-project-name}"
        image: "{replaced-with-image-uri}"
        command: ["{replaced-with-entry-point-command}"]
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        env:
        - name: MLFLOW_TRACKING_URI
          value: "https://my-mlflow-server.com"
      restartPolicy: Never
```

### Python API

```python
import mlflow
from mlflow.projects import run

# Synchronous execution
result = run(
    uri="https://github.com/mlflow/mlflow-example.git",
    entry_point="main",
    parameters={"alpha": 0.5},
    backend="local",
    synchronous=True,
)

# Asynchronous execution
submitted_run = run(
    uri=".",
    entry_point="train",
    parameters={"epochs": 100},
    backend="databricks",
    backend_config="cluster-config.json",
    synchronous=False,
)

# Monitor progress
if submitted_run.wait():
    print("Training completed successfully!")
    run_data = mlflow.get_run(submitted_run.run_id)
    print(f"Final accuracy: {run_data.data.metrics['accuracy']}")
```

## Building Workflows

### Multi-Step Pipelines

Combine multiple projects into sophisticated ML workflows:

```python
import mlflow
from mlflow.tracking import MlflowClient


def ml_pipeline():
    client = MlflowClient()

    # Step 1: Data preprocessing
    prep_run = mlflow.run(
        "./preprocessing", parameters={"input_path": "s3://bucket/raw-data"}
    )

    # Wait for completion and get output
    if prep_run.wait():
        prep_run_data = client.get_run(prep_run.run_id)
        processed_data_path = prep_run_data.data.params["output_path"]

        # Step 2: Feature engineering
        feature_run = mlflow.run(
            "./feature_engineering", parameters={"data_path": processed_data_path}
        )

        if feature_run.wait():
            feature_data = client.get_run(feature_run.run_id)
            features_path = feature_data.data.params["features_output"]

            # Step 3: Parallel model training
            model_runs = []
            algorithms = ["random_forest", "xgboost", "neural_network"]

            for algo in algorithms:
                run = mlflow.run(
                    "./training",
                    entry_point=algo,
                    parameters={"features_path": features_path, "algorithm": algo},
                    synchronous=False,  # Run in parallel
                )
                model_runs.append(run)

            # Wait for all models and select best
            best_model = None
            best_metric = 0

            for run in model_runs:
                if run.wait():
                    run_data = client.get_run(run.run_id)
                    accuracy = run_data.data.metrics.get("accuracy", 0)
                    if accuracy > best_metric:
                        best_metric = accuracy
                        best_model = run.run_id

            # Step 4: Deploy best model
            if best_model:
                mlflow.run(
                    "./deployment",
                    parameters={"model_run_id": best_model, "stage": "production"},
                )


# Execute pipeline
ml_pipeline()
```

### Hyperparameter Optimization

```python
import mlflow
import itertools
from concurrent.futures import ThreadPoolExecutor


def hyperparameter_search():
    # Define parameter grid
    param_grid = {
        "learning_rate": [0.01, 0.1, 0.2],
        "n_estimators": [100, 200, 500],
        "max_depth": [3, 6, 10],
    }

    # Generate all combinations
    param_combinations = [
        dict(zip(param_grid.keys(), values))
        for values in itertools.product(*param_grid.values())
    ]

    def train_model(params):
        return mlflow.run("./training", parameters=params, synchronous=False)

    # Launch parallel training jobs
    with ThreadPoolExecutor(max_workers=5) as executor:
        submitted_runs = list(executor.map(train_model, param_combinations))

    # Collect results
    results = []
    for run in submitted_runs:
        if run.wait():
            run_data = mlflow.get_run(run.run_id)
            results.append(
                {
                    "run_id": run.run_id,
                    "params": run_data.data.params,
                    "metrics": run_data.data.metrics,
                }
            )

    # Find best model
    best_run = max(results, key=lambda x: x["metrics"].get("f1_score", 0))
    print(f"Best model: {best_run['run_id']}")
    print(f"Best F1 score: {best_run['metrics']['f1_score']}")

    return best_run


# Execute hyperparameter search
best_model = hyperparameter_search()
```

## Advanced Features

### Docker Image Building

Build custom images during execution:

```bash
# Build new image based on project's base image
mlflow run . --backend kubernetes --build-image

# Use pre-built image
mlflow run . --backend kubernetes
```

```python
# Programmatic image building
mlflow.run(
    ".",
    backend="kubernetes",
    backend_config="k8s-config.json",
    build_image=True,  # Creates new image with project code
    docker_auth={  # Registry authentication
        "username": "myuser",
        "password": "mytoken",
    },
)
```

### Git Integration

MLflow automatically tracks Git information:

```bash
# Run specific commit
mlflow run https://github.com/mlflow/mlflow-example.git --version <commit hash>

# Run branch
mlflow run https://github.com/mlflow/mlflow-example.git --version feature-branch

# Run from subdirectory
mlflow run https://github.com/my-repo.git#subdirectory/my-project
```

### Environment Variable Propagation

Critical environment variables are automatically passed to execution environments:

```bash
export MLFLOW_TRACKING_URI="https://my-tracking-server.com"
export AWS_PROFILE="ml-experiments"
export CUDA_VISIBLE_DEVICES="0,1"

# These variables are available in the project execution environment
mlflow run .
```

### Custom Backend Development

Create custom execution backends:

```python
# custom_backend.py
from mlflow.projects.backend import AbstractBackend


class MyCustomBackend(AbstractBackend):
    def run(
        self,
        project_uri,
        entry_point,
        parameters,
        version,
        backend_config,
        tracking_uri,
        experiment_id,
    ):
        # Custom execution logic
        # Return SubmittedRun object
        pass
```

Register as plugin:

```python
# setup.py
setup(
    entry_points={
        "mlflow.project_backend": [
            "my-backend=my_package.custom_backend:MyCustomBackend"
        ]
    }
)
```

## Best Practices

### Project Organization

```
ml-project/
├── MLproject              # Project configuration
├── python_env.yaml        # Environment dependencies
├── src/                   # Source code
│   ├── train.py
│   ├── evaluate.py
│   └── utils/
├── data/                  # Sample/test data
├── configs/               # Configuration files
│   ├── model_config.yaml
│   └── hyperparams.json
├── tests/                 # Unit tests
└── README.md             # Project documentation
```

### Environment Management

**Development Tips:**

- Use **virtualenv** for pure Python projects
- Use **conda** when you need system libraries (CUDA, Intel MKL)
- Use **Docker** for complex dependencies or production deployment
- Pin exact versions in production environments

**Performance Optimization:**

```yaml
# Fast iteration during development
python_env: python_env.yaml

entry_points:
  develop:
    command: "python train.py"

  production:
    parameters:
      full_dataset: {type: path}
      epochs: {type: int, default: 100}
    command: "python train.py --data {full_dataset} --epochs {epochs}"
```

### Parameter Management

```yaml
# Good: Typed parameters with defaults
entry_points:
  train:
    parameters:
      learning_rate: {type: float, default: 0.01}
      batch_size: {type: int, default: 32}
      data_path: path
      output_dir: {type: str, default: "./outputs"}
    command: "python train.py --lr {learning_rate} --batch {batch_size} --data {data_path} --output {output_dir}"
```

### Reproducibility

```python
# Include environment info in tracking
import mlflow
import platform
import sys

with mlflow.start_run():
    # Log environment info
    mlflow.log_param("python_version", sys.version)
    mlflow.log_param("platform", platform.platform())

    # Log Git commit if available
    try:
        import git

        repo = git.Repo(".")
        mlflow.log_param("git_commit", repo.head.commit.hexsha)
    except:
        pass
```

## Troubleshooting

### Common Issues

**Docker Permission Denied**

```bash
# Solution: Add user to docker group or use sudo
sudo usermod -aG docker $USER
# Then restart shell/session
```

**Conda Environment Creation Fails**

```bash
# Solution: Clean conda cache and retry
conda clean --all
mlflow run . --env-manager conda
```

**Git Authentication for Private Repos**

```bash
# Solution: Use SSH with key authentication
mlflow run git@github.com:private/repo.git
# Or HTTPS with token
mlflow run https://token:x-oauth-basic@github.com/private/repo.git
```

**Kubernetes Job Fails**

```bash
# Debug: Check job status
kubectl get jobs -n mlflow
kubectl describe job <job-name> -n mlflow
kubectl logs -n mlflow job/<job-name>
```

### Debugging Tips

**Enable Verbose Logging:**

```bash
export MLFLOW_LOGGING_LEVEL=DEBUG
mlflow run . -v
```

**Test Locally First:**

```bash
# Test with local environment before remote deployment
mlflow run . --env-manager local

# Then test with environment isolation
mlflow run . --env-manager virtualenv
```

**Validate Project Structure:**

```python
from mlflow.projects import load_project

# Load and inspect project
project = load_project(".")
print(f"Project name: {project.name}")
print(f"Entry points: {list(project._entry_points.keys())}")
print(f"Environment type: {project.env_type}")
```

---

**Ready to get started?** Check out our [MLflow Projects Examples](https://github.com/mlflow/mlflow/tree/master/examples) for hands-on tutorials and real-world use cases.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/classic-ml/search/search-experiments/index.mdx

```text
import TOCInline from "@theme/TOCInline";
import { APILink } from "@site/src/components/APILink";

# Search Experiments

<APILink fn="mlflow.search_experiments" /> and <APILink fn="mlflow.client.MlflowClient.search_experiments">`MlflowClient.search_experiments()`</APILink>
support the same filter string syntax as <APILink fn="mlflow.search_runs" /> and
<APILink fn="mlflow.client.MlflowClient.search_runs">`MlflowClient.search_runs`</APILink>, but the supported identifiers and comparators are different.

<TOCInline toc={toc} maxHeadingLevel={3} minHeadingLevel={2} />

## Syntax

See [Search Runs Syntax](/ml/search/search-runs#search-runs-syntax) for more information.

### Identifier

The following identifiers are supported:

- `attributes.name`: Experiment name
- `attributes.creation_time`: Experiment creation time
- `attributes.last_update_time`: Experiment last update time

:::note
`attributes` can be omitted. `name` is equivalent to `attributes.name`.
:::

- `tags.<tag key>`: Tag

### Comparator

Comparators for string attributes and tags:

- `=`: Equal
- `!=`: Not equal
- `LIKE`: Case-sensitive pattern match
- `ILIKE`: Case-insensitive pattern match

Comparators for numeric attributes:

- `=`: Equal
- `!=`: Not equal
- `<`: Less than
- `<=`: Less than or equal to
- `>`: Greater than
- `>=`: Greater than or equal to

### Examples

```python
# Matches experiments with name equal to 'x'
"attributes.name = 'x'"  # or "name = 'x'"

# Matches experiments with name starting with 'x'
"attributes.name LIKE 'x%'"

# Matches experiments with 'group' tag value not equal to 'x'
"tags.group != 'x'"

# Matches experiments with 'group' tag value containing 'x' or 'X'
"tags.group ILIKE '%x%'"

# Matches experiments with name starting with 'x' and 'group' tag value equal to 'y'
"attributes.name LIKE 'x%' AND tags.group = 'y'"
```
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: mlflow-master/docs/docs/classic-ml/search/search-models/index.mdx

```text
import { APILink } from "@site/src/components/APILink";

# Search Logged Models

This guide will walk you through how to search for logged models in MLflow using both the MLflow UI and Python API. This resource will be valuable if you're interested in querying specific models based on their metrics, params, tags, or model metadata.

MLflow's model search functionality allows you to leverage SQL-like syntax to filter your logged models based on a variety of conditions. While the `OR` keyword is not supported, the search functionality is powerful enough to handle complex queries for model discovery and comparison.

## Search Logged Models Overview

When working with MLflow in production environments, you'll often have hundreds or thousands of logged models across different experiments. The `search_logged_models` API helps you find specific models based on their performance metrics, parameters, tags, and other attributes - making model selection and comparison much more efficient.

:::tip
Looking for guidance on searching over Runs? See the [Search Runs](/ml/search/search-runs) documentation.
:::

## Create Example Logged Models

First, let's create some example logged models to demonstrate the search functionality. This documentation is based on models created with the below script. If you don't want to interactively explore this on your machine, skip this section.

Before running the script, let's start the MLflow UI on a local host:

```bash
mlflow server
```

Visit `http://localhost:5000/` in your web browser. Let's create some example models:

```python
import mlflow
import mlflow.sklearn
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from mlflow.models import infer_signature
import warnings

# Suppress the MLflow model config warning if present
warnings.filterwarnings("ignore", message=".*Failed to log model config as params.*")

mlflow.set_experiment("model-search-guide")

# Model configurations
model_configs = [
    {"model_type": "RandomForest", "n_estimators": 100, "max_depth": 10},
    {"model_type": "RandomForest", "n_estimators": 200, "max_depth": 20},
    {"model_type": "LogisticRegression", "C": 1.0, "solver": "lbfgs"},
    {"model_type": "LogisticRegression", "C": 0.1, "solver": "saga"},
    {"model_type": "SVM", "kernel": "rbf", "C": 1.0},
    {"model_type": "SVM", "kernel": "linear", "C": 0.5},
]

# Performance metrics (simulated)
accuracy_scores = [0.92, 0.94, 0.88, 0.86, 0.90, 0.87]
precision_scores = [0.91, 0.93, 0.87, 0.85, 0.89, 0.86]
recall_scores = [0.93, 0.95, 0.89, 0.87, 0.91, 0.88]
f1_scores = [0.92, 0.94, 0.88, 0.86, 0.90, 0.87]

# Model metadata
versions = ["v1.0", "v1.1", "v1.0", "v2.0", "v1.0", "v1.1"]
environments = [
    "production",
    "staging",
    "production",
    "development",
    "staging",
    "production",
]
frameworks = ["sklearn", "sklearn", "sklearn", "sklearn", "sklearn", "sklearn"]

# Create dummy training data
X_train = np.random.rand(100, 10)
y_train = np.random.randint(0, 2, 100)

# Create input example for model signature
input_example = pd.DataFrame(X_train[:5], columns=[f"feature_{i}" for i in range(10)])

for i, config in enumerate(model_configs):
    with mlflow.start_run():
        # Create and train model based on type
        if config["model_type"] == "RandomForest":
            model = RandomForestClassifier(
                n_estimators=config["n_estimators"],
                max_depth=config["max_depth"],
                random_state=42,
            )
            mlflow.log_param("n_estimators", config["n_estimators"])
            mlflow.log_param("max_depth", config["max_depth"])
        elif config["model_type"] == "LogisticRegression":
            model = LogisticRegression(
                C=config["C"],
                solver=config["solver"],
                random_state=42,
                max_iter=1000,  # Increase iterations for convergence
            )
            mlflow.log_param("C", config["C"])
            mlflow.log_param("solver", config["solver"])
        else:  # SVM
            model = SVC(
                kernel=config["kernel"],
                C=config["C"],
                random_state=42,
                probability=True,  # Enable probability estimates
            )
            mlflow.log_param("kernel", config["kernel"])
            mlflow.log_param("C", config["C"])

        # Log common parameters
        mlflow.log_param("model_type", config["model_type"])

        # Fit model
        model.fit(X_train, y_train)

        # Get predictions for signature
        predictions = model.predict(X_train[:5])

        # Create model signature
        signature = infer_signature(X_train[:5], predictions)

        # Log metrics
        mlflow.log_metric("accuracy", accuracy_scores[i])
        mlflow.log_metric("precision", precision_scores[i])
        mlflow.log_metric("recall", recall_scores[i])
        mlflow.log_metric("f1_score", f1_scores[i])

        # Log tags
        mlflow.set_tag("version", versions[i])
        mlflow.set_tag("environment", environments[i])
        mlflow.set_tag("framework", frameworks[i])

        # Log the model with signature and input example
        model_name = f"{config['model_type']}_model_{i}"
        mlflow.sklearn.log_model(
            model,
            name=model_name,
            signature=signature,
            input_example=input_example,
            registered_model_name=f"SearchGuide{config['model_type']}",
        )
```

After running this script, you should have 6 different models logged across your experiments, each with different parameters, metrics, and tags.

> **Note**: You may see a warning about "Failed to log model config as params" - this is a known MLflow internal warning that can be safely ignored. The models and their parameters are still logged correctly.

## Search Query Syntax \{#search-logged-models-syntax}

The `search_logged_models` API uses a SQL-like Domain Specific Language (DSL) for querying logged models. While inspired by SQL, it has some specific limitations and features tailored for model search.

### Visual Representation of Search Components:

<div class="center-div" style={{ width: "30%" }}>
  ![search components](/images/search-runs/search_syntax.png)
</div>

### Key Differences from search_runs:

1. **Default Entity**: When no prefix is specified, the field is treated as an attribute (not a metric)
2. **Supported Prefixes**: `metrics.`, `params.`, or no prefix for attributes
3. **Dataset-Aware Metrics**: You can filter metrics based on specific datasets
4. **No Tag Support**: Unlike `search_runs`, the `search_logged_models` API does not support filtering by tags

### Syntax Rules:

**Left Side (Field) Syntax:**

- Fields without special characters can be referenced directly (e.g., `creation_time`)
- Use backticks for fields with special characters (e.g., `` metrics.`f1-score` ``)
- Double quotes are also acceptable (e.g., `metrics."f1 score"`)

**Right Side (Value) Syntax:**

- String values must be enclosed in single quotes (e.g., `params.model_type = 'RandomForest'`)
- Numeric values for metrics don't need quotes (e.g., `metrics.accuracy > 0.9`)
- All non-metric values must be quoted, even if numeric
- For string attributes like `name`, only `=`, `!=`, `IN`, and `NOT IN` comparators are supported (no `LIKE` or `ILIKE`)

## Example Queries

Let's explore different ways to search for logged models using various filter criteria.

### 1 - Searching By Metrics

Metrics represent model performance measurements. When searching by metrics, use the `metrics.` prefix:

```python
import mlflow

# Find high-performing models
high_accuracy_models = mlflow.search_logged_models(
    experiment_ids=["1"],  # Replace with your experiment ID
    filter_string="metrics.accuracy > 0.9",
)

# Multiple metric conditions
balanced_models = mlflow.search_logged_models(
    experiment_ids=["1"],
    filter_string="metrics.precision > 0.88 AND metrics.recall > 0.90",
)
```

### 2 - Searching By Parameters

Parameters capture model configuration. Use the `params.` prefix and remember that all parameter values are stored as strings:

```python
# Find specific model types
rf_models = mlflow.search_logged_models(
    experiment_ids=["1"], filter_string="params.model_type = 'RandomForest'"
)

# Parameter combination search
tuned_rf_models = mlflow.search_logged_models(
    experiment_ids=["1"],
    filter_string="params.model_type = 'RandomForest' AND params.n_estimators = '200'",
)
```

### 3 - Searching By Model Name

Model names are searchable as attributes. Use the `name` field with supported comparators (`=`, `!=`, `IN`, `NOT IN`):

```python
# Exact name match
specific_model = mlflow.search_logged_models(
    experiment_ids=["1"], filter_string="name = 'SVM_model_5'"
)

# Multiple model names
multiple_models = mlflow.search_logged_models(
    experiment_ids=["1"],
    filter_string="name IN ('SVM_model_5', 'RandomForest_model_0')",
)

# Exclude specific model
not_svm = mlflow.search_logged_models(
    experiment_ids=["1"], filter_string="name != 'SVM_model_4'"
)
```

### 4 - Searching By Model Attributes

Attributes include model metadata like creation time. No prefix is needed for attributes:

```python
# Find recently created models (timestamp in milliseconds)
import time

last_week = int((time.time() - 7 * 24 * 60 * 60) * 1000)

recent_models = mlflow.search_logged_models(
    experiment_ids=["1"], filter_string=f"creation_time > {last_week}"
)
```

### 5 - Dataset-Specific Metric Filtering

One powerful feature of `search_logged_models` is the ability to filter metrics based on specific datasets:

```python
# Find models with high accuracy on test dataset
test_accurate_models = mlflow.search_logged_models(
    experiment_ids=["1"],
    filter_string="metrics.accuracy > 0.9",
    datasets=[{"dataset_name": "test_dataset", "dataset_digest": "abc123"}],  # Optional
)

# Multiple dataset conditions
multi_dataset_models = mlflow.search_logged_models(
    experiment_ids=["1"],
    filter_string="metrics.accuracy > 0.85",
    datasets=[{"dataset_name": "test_dataset"}, {"dataset_name": "validation_dataset"}],
)
```

### 6 - Complex Queries

Combine multiple conditions for sophisticated model discovery:

```python
# Production-ready RandomForest models with high performance
production_ready = mlflow.search_logged_models(
    experiment_ids=["1"],
    filter_string="""
        params.model_type = 'RandomForest'
        AND metrics.accuracy > 0.9
        AND metrics.precision > 0.88
    """,
)
```

## Programmatic Search with Python

The Python API provides powerful capabilities for searching logged models programmatically.

### Using the Fluent API

<APILink fn="mlflow.search_logged_models" /> provides a convenient interface for model search:

```python
import mlflow

# Basic search with pandas output (default)
models_df = mlflow.search_logged_models(
    experiment_ids=["1"], filter_string="metrics.accuracy > 0.9"
)

# Check available columns
print("Available columns:", models_df.columns.tolist())
print("\nModel information:")
print(models_df[["name", "source_run_id"]])

# Get results as a list instead of DataFrame
models_list = mlflow.search_logged_models(
    experiment_ids=["1"], filter_string="metrics.accuracy > 0.9", output_format="list"
)

for model in models_list:
    print(f"Model: {model.name}, Run ID: {model.source_run_id}")
```

### Using the Client API

<APILink fn="mlflow.client.MlflowClient.search_logged_models" /> offers more control with pagination support:

```python
from mlflow import MlflowClient

client = MlflowClient()

# Search with pagination
page_token = None
all_models = []

while True:
    result = client.search_logged_models(
        experiment_ids=["1"],
        filter_string="metrics.accuracy > 0.85",
        max_results=10,
        page_token=page_token,
    )

    all_models.extend(result.to_list())

    if not result.token:
        break
    page_token = result.token

print(f"Found {len(all_models)} models")
```

### Advanced Ordering

Control the order of search results using the `order_by` parameter:

:::tip
The `order_by` functionality for results sorting must be supplied as a list of dictionaries that contains `field_name`. The `ascending` key is optional.
:::

```python
# Order by single metric
best_models = mlflow.search_logged_models(
    experiment_ids=["1"],
    filter_string="params.model_type = 'RandomForest'",
    order_by=[
        {"field_name": "metrics.accuracy", "ascending": False}  # Highest accuracy first
    ],
)

# Order by dataset-specific metric
dataset_ordered = mlflow.search_logged_models(
    experiment_ids=["1"],
    filter_string="metrics.f1_score > 0.8",
    order_by=[
        {
            "field_name": "metrics.f1_score",
            "ascending": False,
            "dataset_name": "test_dataset",
            "dataset_digest": "abc123",  # Optional
        }
    ],
)

# Multiple ordering criteria
complex_order = mlflow.search_logged_models(
    experiment_ids=["1"],
    order_by=[
        {"field_name": "metrics.accuracy", "ascending": False},
        {"field_name": "creation_time", "ascending": True},
    ],
)
```

### Getting Top N Models

Combine `max_results` with `order_by` to get the best models:

```python
# Get top 5 models by accuracy
top_5_models = mlflow.search_logged_models(
    experiment_ids=["1"],
    max_results=5,
    order_by=[{"field_name": "metrics.accuracy", "ascending": False}],
)

# Get the single best model
best_model = mlflow.search_logged_models(
    experiment_ids=["1"],
    max_results=1,
    order_by=[{"field_name": "metrics.f1_score", "ascending": False}],
    output_format="list",
)[0]

accuracy_metric = next(
    (metric for metric in best_model.metrics if metric.key == "accuracy"), None
)
print(f"Model ID: {best_model.model_id}, Accuracy: {accuracy_metric.value}")
```

### Searching Across Multiple Experiments

Search for models across different experiments:

:::tip
Do not search over more than 10 experiments when using the `search_logged_models` API. Excessive search space over
experiments will impact the tracking server's performance.
:::

```python
# Search specific experiments
multi_exp_models = mlflow.search_logged_models(
    experiment_ids=["1", "2", "3"], filter_string="metrics.accuracy > 0.9"
)
```

## Common Use Cases

### Model Selection for Deployment

Find the best model that meets production criteria:

```python
deployment_candidates = mlflow.search_logged_models(
    experiment_ids=exp_ids,
    filter_string="""
        metrics.accuracy > 0.95
        AND metrics.precision > 0.93
    """,
    datasets=[{"dataset_name": "production_test_set"}],
    max_results=1,
    order_by=[{"field_name": "metrics.f1_score", "ascending": False}],
)
```

### Model Comparison

Compare different model architectures:

```python
# Get best model of each type
model_types = ["RandomForest", "LogisticRegression", "SVM"]
best_by_type = {}

for model_type in model_types:
    models = mlflow.search_logged_models(
        experiment_ids=["1"],
        filter_string=f"params.model_type = '{model_type}'",
        max_results=1,
        order_by=[{"field_name": "metrics.accuracy", "ascending": False}],
        output_format="list",
    )
    if models:
        best_by_type[model_type] = models[0]

# Compare results
for model_type, model in best_by_type.items():
    # Find accuracy in the metrics list
    accuracy = None
    for metric in model.metrics:
        if metric.key == "accuracy":
            accuracy = metric.value
            break

    accuracy_display = f"{accuracy:.4f}" if accuracy is not None else "N/A"
    print(
        f"{model_type}: Model ID = {model.model_id}, Run ID = {model.source_run_id}, Accuracy = {accuracy_display}"
    )
```

## Important Notes

### Accessing Metrics from LoggedModel

The `LoggedModel` objects returned by `search_logged_models` contain a `metrics` field with a list of `Metric` objects:

```python
# Option 1: Access metrics from LoggedModel objects (list output)
models_list = mlflow.search_logged_models(
    experiment_ids=["1"], filter_string="metrics.accuracy > 0.9", output_format="list"
)

for model in models_list:
    print(f"\nModel: {model.name}")
    # Access metrics as a list of Metric objects
    for metric in model.metrics:
        print(f"  {metric.key}: {metric.value}")

# Option 2: Use the DataFrame output which includes flattened metrics
models_df = mlflow.search_logged_models(
    experiment_ids=["1"], filter_string="metrics.accuracy > 0.9", output_format="pandas"
)

# The DataFrame has a 'metrics' column containing the list of Metric objects
first_model_metrics = models_df.iloc[0].get("metrics", [])
for metric in first_model_metrics:
    print(f"{metric.key}: {metric.value}")
```

## Summary

The `search_logged_models` API provides a powerful way to discover and compare models in MLflow. By combining flexible filtering, dataset-aware metrics, and ordering capabilities, you can efficiently find the best models for your use case from potentially thousands of candidates.

Key takeaways:

- Use SQL-like syntax with `metrics.`, `params.`, and `tags.` prefixes
- Filter metrics by specific datasets for fair comparison
- Combine multiple conditions with AND (OR is not supported)
- Use ordering and max_results to find top performers
- Choose between DataFrame or list output formats based on your needs

Whether you're selecting models for deployment, comparing architectures, or tracking model evolution, mastering the search API will make your MLflow workflow more efficient and powerful.
```

--------------------------------------------------------------------------------

````
