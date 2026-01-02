---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 207
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 207 of 991)

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

---[FILE: sentence_transformer.py]---
Location: mlflow-master/examples/transformers/sentence_transformer.py

```python
import torch
from transformers import BertModel, BertTokenizerFast, pipeline

import mlflow

sentence_transformers_architecture = "sentence-transformers/all-MiniLM-L12-v2"
task = "feature-extraction"

model = BertModel.from_pretrained(sentence_transformers_architecture)
tokenizer = BertTokenizerFast.from_pretrained(sentence_transformers_architecture)

sentence_transformer_pipeline = pipeline(task=task, model=model, tokenizer=tokenizer)

with mlflow.start_run():
    model_info = mlflow.transformers.log_model(
        transformers_model=sentence_transformer_pipeline,
        name="sentence_transformer",
        framework="pt",
        torch_dtype=torch.bfloat16,
    )

loaded = mlflow.transformers.load_model(model_info.model_uri, return_type="components")


def pool_and_normalize_encodings(input_sentences, model, tokenizer, **kwargs):
    def pool(model_output, attention_mask):
        embeddings = model_output[0]
        expanded_mask = attention_mask.unsqueeze(-1).expand(embeddings.size()).float()
        return torch.sum(embeddings * expanded_mask, 1) / torch.clamp(
            expanded_mask.sum(1), min=1e-9
        )

    encoded = tokenizer(
        input_sentences,
        padding=True,
        truncation=True,
        return_tensors="pt",
    )
    with torch.no_grad():
        model_output = model(**encoded)

    pooled = pool(model_output, encoded["attention_mask"])
    return torch.nn.functional.normalize(pooled, p=2, dim=1)


sentences = [
    "He said that he's sinking all of his investment budget into coconuts.",
    "No matter how deep you dig, there's going to be a point when it just gets too hot.",
    "She said that there isn't a noticeable difference between a 10 year and a 15 year whisky.",
]

encoded_sentences = pool_and_normalize_encodings(sentences, **loaded)

print(encoded_sentences)
```

--------------------------------------------------------------------------------

---[FILE: simple.py]---
Location: mlflow-master/examples/transformers/simple.py

```python
import transformers

import mlflow

task = "text2text-generation"

generation_pipeline = transformers.pipeline(
    task=task,
    model="declare-lab/flan-alpaca-base",
)

input_example = ["prompt 1", "prompt 2", "prompt 3"]

parameters = {"max_length": 512, "do_sample": True}

with mlflow.start_run() as run:
    model_info = mlflow.transformers.log_model(
        transformers_model=generation_pipeline,
        name="text_generator",
        input_example=(["prompt 1", "prompt 2", "prompt 3"], parameters),
    )

sentence_generator = mlflow.pyfunc.load_model(model_info.model_uri)

print(
    sentence_generator.predict(
        ["tell me a story about rocks", "Tell me a joke about a dog that likes spaghetti"],
        # pass in additional parameters applied to the pipeline during inference
        params=parameters,
    )
)
```

--------------------------------------------------------------------------------

---[FILE: whisper.py]---
Location: mlflow-master/examples/transformers/whisper.py

```python
import requests
import transformers

import mlflow

# Acquire an audio file
resp = requests.get(
    "https://github.com/mlflow/mlflow/raw/master/tests/datasets/apollo11_launch.wav"
)
resp.raise_for_status()
audio = resp.content

task = "automatic-speech-recognition"
architecture = "openai/whisper-tiny"

model = transformers.WhisperForConditionalGeneration.from_pretrained(architecture)
# workaround for https://github.com/huggingface/transformers/issues/37172
model.generation_config.input_ids = model.generation_config.forced_decoder_ids
model.generation_config.forced_decoder_ids = None

tokenizer = transformers.WhisperTokenizer.from_pretrained(architecture)
feature_extractor = transformers.WhisperFeatureExtractor.from_pretrained(architecture)
model.generation_config.alignment_heads = [[2, 2], [3, 0], [3, 2], [3, 3], [3, 4], [3, 5]]
audio_transcription_pipeline = transformers.pipeline(
    task=task, model=model, tokenizer=tokenizer, feature_extractor=feature_extractor
)

# Note that if the input type is of raw binary audio, the generated signature will match the
# one created here. For other supported types (i.e., numpy array of float32 with the
# correct bitrate extraction), a signature is required to override the default of "binary" input
# type.
signature = mlflow.models.infer_signature(
    audio,
    mlflow.transformers.generate_signature_output(audio_transcription_pipeline, audio),
)

inference_config = {
    "return_timestamps": False,
    "chunk_length_s": 20,
    "stride_length_s": [5, 3],
}

# Log the pipeline
with mlflow.start_run():
    model_info = mlflow.transformers.log_model(
        transformers_model=audio_transcription_pipeline,
        name="whisper_transcriber",
        signature=signature,
        input_example=audio,
        inference_config=inference_config,
    )

# Load the pipeline in its native format
loaded_transcriber = mlflow.transformers.load_model(model_uri=model_info.model_uri)

transcription = loaded_transcriber(audio, **inference_config)

print(f"\nWhisper native output transcription:\n{transcription}")

# Load the pipeline as a pyfunc with the audio file being encoded as base64
pyfunc_transcriber = mlflow.pyfunc.load_model(model_uri=model_info.model_uri)

pyfunc_transcription = pyfunc_transcriber.predict([audio])

# Note: the pyfunc return type if `return_timestamps` is set is a JSON encoded string.
print(f"\nPyfunc output transcription:\n{pyfunc_transcription}")
```

--------------------------------------------------------------------------------

---[FILE: entrypoint.py]---
Location: mlflow-master/examples/virtualenv/project/entrypoint.py

```python
import argparse
import os
import sys

import numpy as np
import sklearn
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

import mlflow

parser = argparse.ArgumentParser()
parser.add_argument(
    "--test",
    action="store_true",
    help="If specified, check this script is running in a virtual environment created by mlflow "
    "and python and sickit-learn versions are correct.",
)
args = parser.parse_args()
if args.test:
    assert "VIRTUAL_ENV" in os.environ
    assert sys.version_info[:3] == (3, 8, 18), sys.version_info
    assert sklearn.__version__ == "1.0.2", sklearn.__version__

X = np.array([[-1, -1], [-2, -1], [1, 1], [2, 1]])
y = np.array([1, 1, 2, 2])

clf = make_pipeline(StandardScaler(), SVC(gamma="auto"))
clf.fit(X, y)

with mlflow.start_run():
    mlflow.sklearn.log_model(clf, name="model")
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/examples/virtualenv/project/MLproject

```text
name: virtualenv-example
python_env: python_env.yaml
entry_points:
  main:
    command: 'python entrypoint.py'
  test:
    command: 'python entrypoint.py --test'
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/examples/virtualenv/project/python_env.yaml

```yaml
dependencies:
  - -r requirements.txt
```

--------------------------------------------------------------------------------

---[FILE: requirements.txt]---
Location: mlflow-master/examples/virtualenv/project/requirements.txt

```text
mlflow
scikit-learn==1.0.2
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/xgboost/README.md

```text
# Examples for XGBoost Autologging

Two examples are provided to demonstrate XGBoost autologging functionalities. The `xgboost_native` folder contains an example that logs a Booster model trained by `xgboost.train()`. The `xgboost_sklearn` includes another example showing how autologging works for XGBoost scikit-learn models. In fact, there is no difference in turning on autologging for all XGBoost models. That is, `mlflow.xgboost.autolog()` works for all XGBoost models.
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/examples/xgboost/xgboost_native/MLproject

```text
name: xgboost-example
python_env: python_env.yaml
entry_points:
  main:
    parameters:
      learning_rate: {type: float, default: 0.3}
      colsample_bytree: {type: float, default: 1.0}
      subsample: {type: float, default: 1.0}
    command: |
        python train.py \
          --learning-rate={learning_rate} \
          --colsample-bytree={colsample_bytree} \
          --subsample={subsample}
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/examples/xgboost/xgboost_native/python_env.yaml

```yaml
build_dependencies:
  - pip
dependencies:
  - mlflow
  - scikit-learn
  - matplotlib
  - xgboost
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/xgboost/xgboost_native/README.md

```text
# XGBoost Example

This example trains an XGBoost classifier with the iris dataset and logs hyperparameters, metrics, and trained model.

## Running the code

```
python train.py --learning-rate 0.2 --colsample-bytree 0.8 --subsample 0.9
```

You can try experimenting with different parameter values like:

```
python train.py --learning-rate 0.4 --colsample-bytree 0.7 --subsample 0.8
```

Then you can open the MLflow UI to track the experiments and compare your runs via:

```
mlflow server
```

## Running the code as a project

```
mlflow run . -P learning_rate=0.2 -P colsample_bytree=0.8 -P subsample=0.9
```
```

--------------------------------------------------------------------------------

---[FILE: train.py]---
Location: mlflow-master/examples/xgboost/xgboost_native/train.py

```python
import argparse

import matplotlib as mpl
import xgboost as xgb
from sklearn import datasets
from sklearn.metrics import accuracy_score, log_loss
from sklearn.model_selection import train_test_split

import mlflow
import mlflow.xgboost

mpl.use("Agg")


def parse_args():
    parser = argparse.ArgumentParser(description="XGBoost example")
    parser.add_argument(
        "--learning-rate",
        type=float,
        default=0.3,
        help="learning rate to update step size at each boosting step (default: 0.3)",
    )
    parser.add_argument(
        "--colsample-bytree",
        type=float,
        default=1.0,
        help="subsample ratio of columns when constructing each tree (default: 1.0)",
    )
    parser.add_argument(
        "--subsample",
        type=float,
        default=1.0,
        help="subsample ratio of the training instances (default: 1.0)",
    )
    return parser.parse_args()


def main():
    # parse command-line arguments
    args = parse_args()

    # prepare train and test data
    iris = datasets.load_iris()
    X = iris.data
    y = iris.target
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # enable auto logging
    mlflow.xgboost.autolog()

    dtrain = xgb.DMatrix(X_train, label=y_train)
    dtest = xgb.DMatrix(X_test, label=y_test)

    with mlflow.start_run():
        # train model
        params = {
            "objective": "multi:softprob",
            "num_class": 3,
            "learning_rate": args.learning_rate,
            "eval_metric": "mlogloss",
            "colsample_bytree": args.colsample_bytree,
            "subsample": args.subsample,
            "seed": 42,
        }
        model = xgb.train(params, dtrain, evals=[(dtrain, "train")])

        # evaluate model
        y_proba = model.predict(dtest)
        y_pred = y_proba.argmax(axis=1)
        loss = log_loss(y_test, y_proba)
        acc = accuracy_score(y_test, y_pred)

        # log metrics
        mlflow.log_metrics({"log_loss": loss, "accuracy": acc})


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/examples/xgboost/xgboost_sklearn/MLproject

```text
name: xgboost_sklearn_example

python_env: python_env.yaml

entry_points:
  main:
    command: "python train.py"
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/examples/xgboost/xgboost_sklearn/python_env.yaml

```yaml
build_dependencies:
  - pip
dependencies:
  - mlflow
  - pandas
  - scikit-learn
  - xgboost
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/examples/xgboost/xgboost_sklearn/README.md

```text
# XGBoost Scikit-learn Model Example

This example trains an [`XGBoost.XGBRegressor`](https://xgboost.readthedocs.io/en/stable/python/python_api.html#xgboost.XGBRegressor) with the diabetes dataset and logs hyperparameters, metrics, and trained model.

Like the other XGBoost example, we enable autologging for XGBoost scikit-learn models via `mlflow.xgboost.autolog()`. Saving / loading models also supports XGBoost scikit-learn models.

You can run this example using the following command:

```
python train.py
```
```

--------------------------------------------------------------------------------

---[FILE: train.py]---
Location: mlflow-master/examples/xgboost/xgboost_sklearn/train.py

```python
from pprint import pprint

import xgboost as xgb
from sklearn.datasets import load_diabetes
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split
from utils import fetch_logged_data

import mlflow
import mlflow.xgboost


def main():
    # prepare example dataset
    X, y = load_diabetes(return_X_y=True, as_frame=True)
    X_train, X_test, y_train, y_test = train_test_split(X, y)

    # enable auto logging
    # this includes xgboost.sklearn estimators
    mlflow.xgboost.autolog()

    regressor = xgb.XGBRegressor(n_estimators=20, reg_lambda=1, gamma=0, max_depth=3)
    regressor.fit(X_train, y_train, eval_set=[(X_test, y_test)])
    y_pred = regressor.predict(X_test)
    mean_squared_error(y_test, y_pred)
    run_id = mlflow.last_active_run().info.run_id
    print(f"Logged data and model in run {run_id}")

    # show logged data
    for key, data in fetch_logged_data(run_id).items():
        print(f"\n---------- logged {key} ----------")
        pprint(data)


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: mlflow-master/examples/xgboost/xgboost_sklearn/utils.py

```python
from mlflow.tracking import MlflowClient


def yield_artifacts(run_id, path=None):
    """Yield all artifacts in the specified run"""
    client = MlflowClient()
    for item in client.list_artifacts(run_id, path):
        if item.is_dir:
            yield from yield_artifacts(run_id, item.path)
        else:
            yield item.path


def fetch_logged_data(run_id):
    """Fetch params, metrics, tags, and artifacts in the specified run"""
    client = MlflowClient()
    data = client.get_run(run_id).data
    # Exclude system tags: https://www.mlflow.org/docs/latest/tracking.html#system-tags
    tags = {k: v for k, v in data.tags.items() if not k.startswith("mlflow.")}
    artifacts = list(yield_artifacts(run_id))
    return {
        "params": data.params,
        "metrics": data.metrics,
        "tags": tags,
        "artifacts": artifacts,
    }
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.txt]---
Location: mlflow-master/libs/skinny/LICENSE.txt

```text
../../LICENSE.txt
```

--------------------------------------------------------------------------------

---[FILE: MANIFEST.in]---
Location: mlflow-master/libs/skinny/MANIFEST.in

```text
../../MANIFEST.in
```

--------------------------------------------------------------------------------

---[FILE: mlflow]---
Location: mlflow-master/libs/skinny/mlflow

```text
../../mlflow
```

--------------------------------------------------------------------------------

---[FILE: pyproject.toml]---
Location: mlflow-master/libs/skinny/pyproject.toml

```toml
# Auto-generated by dev/pyproject.py. Do not edit manually.
# This file defines the package metadata of `mlflow-skinny`.

[build-system]
requires = ["setuptools"]
build-backend = "setuptools.build_meta"

[project]
name = "mlflow-skinny"
version = "3.8.1.dev0"
description = "MLflow is an open source platform for the complete machine learning lifecycle"
readme = "README_SKINNY.md"
keywords = ["mlflow", "ai", "databricks"]
classifiers = [
  "Development Status :: 5 - Production/Stable",
  "Intended Audience :: Developers",
  "Intended Audience :: End Users/Desktop",
  "Intended Audience :: Science/Research",
  "Intended Audience :: Information Technology",
  "Topic :: Scientific/Engineering :: Artificial Intelligence",
  "Topic :: Software Development :: Libraries :: Python Modules",
  "License :: OSI Approved :: Apache Software License",
  "Operating System :: OS Independent",
  "Programming Language :: Python :: 3.10",
]
requires-python = ">=3.10"
dependencies = [
  "cachetools<7,>=5.0.0",
  "click<9,>=7.0",
  "cloudpickle<4",
  "databricks-sdk<1,>=0.20.0",
  "fastapi<1",
  "gitpython<4,>=3.1.9",
  "importlib_metadata<9,>=3.7.0,!=4.7.0",
  "opentelemetry-api<3,>=1.9.0",
  "opentelemetry-proto<3,>=1.9.0",
  "opentelemetry-sdk<3,>=1.9.0",
  "packaging<26",
  "protobuf<7,>=3.12.0",
  "pydantic<3,>=2.0.0",
  "python-dotenv<2,>=0.19.0",
  "pyyaml<7,>=5.1",
  "requests<3,>=2.17.3",
  "sqlparse<1,>=0.4.0",
  "typing-extensions<5,>=4.0.0",
  "uvicorn<1",
]
[[project.maintainers]]
name = "Databricks"
email = "mlflow-oss-maintainers@googlegroups.com"

[project.license]
file = "LICENSE.txt"

[project.optional-dependencies]
extras = [
  "pyarrow",
  "requests-auth-aws-sigv4",
  "boto3",
  "botocore",
  "google-cloud-storage>=1.30.0",
  "azureml-core>=1.2.0",
  "pysftp",
  "kubernetes",
  "virtualenv",
  "prometheus-flask-exporter",
]
databricks = [
  "azure-storage-file-datalake>12",
  "google-cloud-storage>=1.30.0",
  "boto3>1",
  "botocore",
  "databricks-agents>=1.2.0,<2.0",
]
mlserver = [
  "mlserver>=1.2.0,!=1.3.1,<2.0.0",
  "mlserver-mlflow>=1.2.0,!=1.3.1,<2.0.0",
]
gateway = [
  "aiohttp<4",
  "boto3<2,>=1.28.56",
  "fastapi<1",
  "slowapi<1,>=0.1.9",
  "tiktoken<1",
  "uvicorn[standard]<1",
  "watchfiles<2",
]
genai = [
  "aiohttp<4",
  "boto3<2,>=1.28.56",
  "fastapi<1",
  "litellm<2,>=1.0.0",
  "slowapi<1,>=0.1.9",
  "tiktoken<1",
  "uvicorn[standard]<1",
  "watchfiles<2",
]
mcp = ["fastmcp<3,>=2.0.0", "click!=8.3.0"]
sqlserver = ["mlflow-dbstore"]
aliyun-oss = ["aliyunstoreplugin"]
jfrog = ["mlflow-jfrog-plugin"]
langchain = ["langchain>=0.3.12,<=1.1.3"]
auth = ["Flask-WTF<2"]

[project.urls]
homepage = "https://mlflow.org"
issues = "https://github.com/mlflow/mlflow/issues"
documentation = "https://mlflow.org/docs/latest"
repository = "https://github.com/mlflow/mlflow"

[project.scripts]
mlflow = "mlflow.cli:cli"

[project.entry-points."mlflow.app"]
basic-auth = "mlflow.server.auth:create_app"

[project.entry-points."mlflow.app.client"]
basic-auth = "mlflow.server.auth.client:AuthServiceClient"

[project.entry-points."mlflow.deployments"]
databricks = "mlflow.deployments.databricks"
http = "mlflow.deployments.mlflow"
https = "mlflow.deployments.mlflow"
openai = "mlflow.deployments.openai"

[tool.setuptools.package-data]
mlflow = [
  "store/db_migrations/alembic.ini",
  "temporary_db_migrations_for_pre_1_users/alembic.ini",
  "pyspark/ml/log_model_allowlist.txt",
  "server/auth/basic_auth.ini",
  "server/auth/db/migrations/alembic.ini",
  "models/notebook_resources/**/*",
  "ai_commands/**/*.md",
]

[tool.setuptools.packages.find]
where = ["."]
include = ["mlflow", "mlflow.*"]
exclude = ["tests", "tests.*"]
namespaces = false
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/libs/skinny/README.md

```text
# MLflow Skinny

`mlflow-skinny` a lightweight version of MLflow that is designed to be used in environments where you want to minimize the size of the package.

## Core Files

| File               | Description                                                                     |
| ------------------ | ------------------------------------------------------------------------------- |
| `mlflow`           | A symlink that points to the `mlflow` directory in the root of the repository.  |
| `pyproject.toml`   | The package metadata. Autogenerate by [`dev/pyproject.py`](../dev/pyproject.py) |
| `README_SKINNY.md` | The package description. Autogenerate by [`dev/skinny.py`](../dev/pyproject.py) |

## Installation

```sh
# If you have a local clone of the repository
pip install ./libs/skinny

# If you want to install the latest version from GitHub
pip install git+https://github.com/mlflow/mlflow.git#subdirectory=libs/skinny
```
```

--------------------------------------------------------------------------------

---[FILE: README_SKINNY.md]---
Location: mlflow-master/libs/skinny/README_SKINNY.md

```text
<!--  Autogenerated by dev/pyproject.py. Do not edit manually.  -->

📣 This is the `mlflow-skinny` package, a lightweight MLflow package without SQL storage, server, UI, or data science dependencies.
Additional dependencies can be installed to leverage the full feature set of MLflow. For example:

- To use the `mlflow.sklearn` component of MLflow Models, install `scikit-learn`, `numpy` and `pandas`.
- To use SQL-based metadata storage, install `sqlalchemy`, `alembic`, and `sqlparse`.
- To use serving-based features, install `flask` and `pandas`.

---

<br>
<br>

<h1 align="center" style="border-bottom: none">
    <a href="https://mlflow.org/">
        <img alt="MLflow logo" src="https://raw.githubusercontent.com/mlflow/mlflow/refs/heads/master/assets/logo.svg" width="200" />
    </a>
</h1>
<h2 align="center" style="border-bottom: none">Open-Source Platform for Productionizing AI</h2>

MLflow is an open-source developer platform to build AI/LLM applications and models with confidence. Enhance your AI applications with end-to-end **experiment tracking**, **observability**, and **evaluations**, all in one integrated platform.

<div align="center">

[![Python SDK](https://img.shields.io/pypi/v/mlflow)](https://pypi.org/project/mlflow/)
[![PyPI Downloads](https://img.shields.io/pypi/dm/mlflow)](https://pepy.tech/projects/mlflow)
[![License](https://img.shields.io/github/license/mlflow/mlflow)](https://github.com/mlflow/mlflow/blob/main/LICENSE)
<a href="https://twitter.com/intent/follow?screen_name=mlflow" target="_blank">
<img src="https://img.shields.io/twitter/follow/mlflow?logo=X&color=%20%23f5f5f5"
      alt="follow on X(Twitter)"></a>
<a href="https://www.linkedin.com/company/mlflow-org/" target="_blank">
<img src="https://custom-icon-badges.demolab.com/badge/LinkedIn-0A66C2?logo=linkedin-white&logoColor=fff"
      alt="follow on LinkedIn"></a>
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/mlflow/mlflow)

</div>

<div align="center">
   <div>
      <a href="https://mlflow.org/"><strong>Website</strong></a> ·
      <a href="https://mlflow.org/docs/latest"><strong>Docs</strong></a> ·
      <a href="https://github.com/mlflow/mlflow/issues/new/choose"><strong>Feature Request</strong></a> ·
      <a href="https://mlflow.org/blog"><strong>News</strong></a> ·
      <a href="https://www.youtube.com/@mlflowoss"><strong>YouTube</strong></a> ·
      <a href="https://lu.ma/mlflow?k=c"><strong>Events</strong></a>
   </div>
</div>

<br>

## 🚀 Installation

To install the MLflow Python package, run the following command:

```
pip install mlflow
```

## 📦 Core Components

MLflow is **the only platform that provides a unified solution for all your AI/ML needs**, including LLMs, Agents, Deep Learning, and traditional machine learning.

### 💡 For LLM / GenAI Developers

<table>
  <tr>
    <td>
    <img src="https://raw.githubusercontent.com/mlflow/mlflow/refs/heads/master/assets/readme-tracing.png" alt="Tracing" width=100%>
    <div align="center">
        <br>
        <a href="https://mlflow.org/docs/latest/llms/tracing/index.html"><strong>🔍 Tracing / Observability</strong></a>
        <br><br>
        <div>Trace the internal states of your LLM/agentic applications for debugging quality issues and monitoring performance with ease.</div><br>
        <a href="https://mlflow.org/docs/latest/genai/tracing/quickstart/">Getting Started →</a>
        <br><br>
    </div>
    </td>
    <td>
    <img src="https://raw.githubusercontent.com/mlflow/mlflow/refs/heads/master/assets/readme-llm-eval.png" alt="LLM Evaluation" width=100%>
    <div align="center">
        <br>
        <a href="https://mlflow.org/docs/latest/genai/eval-monitor/"><strong>📊 LLM Evaluation</strong></a>
        <br><br>
        <div>A suite of automated model evaluation tools, seamlessly integrated with experiment tracking to compare across multiple versions.</div><br>
        <a href="https://mlflow.org/docs/latest/genai/eval-monitor/">Getting Started →</a>
        <br><br>
    </div>
    </td>
  </tr>
  <tr>
    <td>
      <img src="https://raw.githubusercontent.com/mlflow/mlflow/refs/heads/master/assets/readme-prompt.png" alt="Prompt Management">
    <div align="center">
        <br>
        <a href="https://mlflow.org/docs/latest/genai/prompt-version-mgmt/prompt-registry/"><strong>🤖 Prompt Management</strong></a>
        <br><br>
        <div>Version, track, and reuse prompts across your organization, helping maintain consistency and improve collaboration in prompt development.</div><br>
        <a href="https://mlflow.org/docs/latest/genai/prompt-registry/create-and-edit-prompts/">Getting Started →</a>
        <br><br>
    </div>
    </td>
    <td>
      <img src="https://raw.githubusercontent.com/mlflow/mlflow/refs/heads/master/assets/readme-logged-model.png" alt="MLflow Hero">
    <div align="center">
        <br>
        <a href="https://mlflow.org/docs/latest/genai/prompt-version-mgmt/version-tracking/"><strong>📦 App Version Tracking</strong></a>
        <br><br>
        <div>MLflow keeps track of many moving parts in your AI applications, such as models, prompts, tools, and code, with end-to-end lineage.</div><br>
        <a href="https://mlflow.org/docs/latest/genai/version-tracking/quickstart/">Getting Started →</a>
        <br><br>
    </div>
    </td>
  </tr>
</table>

### 🎓 For Data Scientists

<table>
  <tr>
    <td colspan="2" align="center" >
      <img src="https://raw.githubusercontent.com/mlflow/mlflow/refs/heads/master/assets/readme-experiment.png" alt="Tracking" width=50%>
    <div align="center">
        <br>
        <a href="https://mlflow.org/docs/latest/ml/tracking/"><strong>📝 Experiment Tracking</strong></a>
        <br><br>
        <div>Track your models, parameters, metrics, and evaluation results in ML experiments and compare them using an interactive UI.</div><br>
        <a href="https://mlflow.org/docs/latest/ml/tracking/quickstart/">Getting Started →</a>
        <br><br>
    </div>
    </td>
  </tr>
  <tr>
    <td>
      <img src="https://raw.githubusercontent.com/mlflow/mlflow/refs/heads/master/assets/readme-model-registry.png" alt="Model Registry" width=100%>
    <div align="center">
        <br>
        <a href="https://mlflow.org/docs/latest/ml/model-registry/"><strong>💾 Model Registry</strong></a>
        <br><br>
        <div> A centralized model store designed to collaboratively manage the full lifecycle and deployment of machine learning models.</div><br>
        <a href="https://mlflow.org/docs/latest/ml/model-registry/tutorial/">Getting Started →</a>
        <br><br>
    </div>
    </td>
    <td>
      <img src="https://raw.githubusercontent.com/mlflow/mlflow/refs/heads/master/assets/readme-deployment.png" alt="Deployment" width=100%>
    <div align="center">
        <br>
        <a href="https://mlflow.org/docs/latest/ml/deployment/"><strong>🚀 Deployment</strong></a>
        <br><br>
        <div> Tools for seamless model deployment to batch and real-time scoring on platforms like Docker, Kubernetes, Azure ML, and AWS SageMaker.</div><br>
        <a href="https://mlflow.org/docs/latest/ml/deployment/">Getting Started →</a>
        <br><br>
    </div>
    </td>
  </tr>
</table>

## 🌐 Hosting MLflow Anywhere

<div align="center" >
  <img src="https://raw.githubusercontent.com/mlflow/mlflow/refs/heads/master/assets/readme-providers.png" alt="Providers" width=100%>
</div>

You can run MLflow in many different environments, including local machines, on-premise servers, and cloud infrastructure.

Trusted by thousands of organizations, MLflow is now offered as a managed service by most major cloud providers:

- [Amazon SageMaker](https://aws.amazon.com/sagemaker-ai/experiments/)
- [Azure ML](https://learn.microsoft.com/en-us/azure/machine-learning/concept-mlflow?view=azureml-api-2)
- [Databricks](https://www.databricks.com/product/managed-mlflow)
- [Nebius](https://nebius.com/services/managed-mlflow)

For hosting MLflow on your own infrastructure, please refer to [this guidance](https://mlflow.org/docs/latest/ml/tracking/#tracking-setup).

## 🗣️ Supported Programming Languages

- [Python](https://pypi.org/project/mlflow/)
- [TypeScript / JavaScript](https://www.npmjs.com/package/mlflow-tracing)
- [Java](https://mvnrepository.com/artifact/org.mlflow/mlflow-client)
- [R](https://cran.r-project.org/web/packages/mlflow/readme/README.html)

## 🔗 Integrations

MLflow is natively integrated with many popular machine learning frameworks and GenAI libraries.

![Integrations](https://raw.githubusercontent.com/mlflow/mlflow/refs/heads/master/assets/readme-integrations.png)

## Usage Examples

### Tracing (Observability) ([Doc](https://mlflow.org/docs/latest/llms/tracing/index.html))

MLflow Tracing provides LLM observability for various GenAI libraries such as OpenAI, LangChain, LlamaIndex, DSPy, AutoGen, and more. To enable auto-tracing, call `mlflow.xyz.autolog()` before running your models. Refer to the documentation for customization and manual instrumentation.

```python
import mlflow
from openai import OpenAI

# Enable tracing for OpenAI
mlflow.openai.autolog()

# Query OpenAI LLM normally
response = OpenAI().chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Hi!"}],
    temperature=0.1,
)
```

Then navigate to the "Traces" tab in the MLflow UI to find the trace records for the OpenAI query.

### Evaluating LLMs, Prompts, and Agents ([Doc](https://mlflow.org/docs/latest/genai/eval-monitor/index.html))

The following example runs automatic evaluation for question-answering tasks with several built-in metrics.

```python
import os
import openai
import mlflow
from mlflow.genai.scorers import Correctness, Guidelines

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# 1. Define a simple QA dataset
dataset = [
    {
        "inputs": {"question": "Can MLflow manage prompts?"},
        "expectations": {"expected_response": "Yes!"},
    },
    {
        "inputs": {"question": "Can MLflow create a taco for my lunch?"},
        "expectations": {
            "expected_response": "No, unfortunately, MLflow is not a taco maker."
        },
    },
]


# 2. Define a prediction function to generate responses
def predict_fn(question: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o-mini", messages=[{"role": "user", "content": question}]
    )
    return response.choices[0].message.content


# 3. Run the evaluation
results = mlflow.genai.evaluate(
    data=dataset,
    predict_fn=predict_fn,
    scorers=[
        # Built-in LLM judge
        Correctness(),
        # Custom criteria using LLM judge
        Guidelines(name="is_english", guidelines="The answer must be in English"),
    ],
)
```

Navigate to the "Evaluations" tab in the MLflow UI to find the evaluation results.

### Tracking Model Training ([Doc](https://mlflow.org/docs/latest/ml/tracking/))

The following example trains a simple regression model with scikit-learn, while enabling MLflow's [autologging](https://mlflow.org/docs/latest/tracking/autolog.html) feature for experiment tracking.

```python
import mlflow

from sklearn.model_selection import train_test_split
from sklearn.datasets import load_diabetes
from sklearn.ensemble import RandomForestRegressor

# Enable MLflow's automatic experiment tracking for scikit-learn
mlflow.sklearn.autolog()

# Load the training dataset
db = load_diabetes()
X_train, X_test, y_train, y_test = train_test_split(db.data, db.target)

rf = RandomForestRegressor(n_estimators=100, max_depth=6, max_features=3)
# MLflow triggers logging automatically upon model fitting
rf.fit(X_train, y_train)
```

Once the above code finishes, run the following command in a separate terminal and access the MLflow UI via the printed URL. An MLflow **Run** should be automatically created, which tracks the training dataset, hyperparameters, performance metrics, the trained model, dependencies, and even more.

```
mlflow server
```

## 💭 Support

- For help or questions about MLflow usage (e.g. "how do I do X?") visit the [documentation](https://mlflow.org/docs/latest).
- In the documentation, you can ask the question to our AI-powered chat bot. Click on the **"Ask AI"** button at the right bottom.
- Join the [virtual events](https://lu.ma/mlflow?k=c) like office hours and meetups.
- To report a bug, file a documentation issue, or submit a feature request, please [open a GitHub issue](https://github.com/mlflow/mlflow/issues/new/choose).
- For release announcements and other discussions, please subscribe to our mailing list (mlflow-users@googlegroups.com)
  or join us on [Slack](https://mlflow.org/slack).

## 🤝 Contributing

We happily welcome contributions to MLflow!

- Submit [bug reports](https://github.com/mlflow/mlflow/issues/new?template=bug_report_template.yaml) and [feature requests](https://github.com/mlflow/mlflow/issues/new?template=feature_request_template.yaml)
- Contribute for [good-first-issues](https://github.com/mlflow/mlflow/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) and [help-wanted](https://github.com/mlflow/mlflow/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)
- Writing about MLflow and sharing your experience

Please see our [contribution guide](CONTRIBUTING.md) to learn more about contributing to MLflow.

## ⭐️ Star History

<a href="https://star-history.com/#mlflow/mlflow&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=mlflow/mlflow&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=mlflow/mlflow&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=mlflow/mlflow&type=Date" />
 </picture>
</a>

## ✏️ Citation

If you use MLflow in your research, please cite it using the "Cite this repository" button at the top of the [GitHub repository page](https://github.com/mlflow/mlflow), which will provide you with citation formats including APA and BibTeX.

## 👥 Core Members

MLflow is currently maintained by the following core members with significant contributions from hundreds of exceptionally talented community members.

- [Ben Wilson](https://github.com/BenWilson2)
- [Corey Zumar](https://github.com/dbczumar)
- [Daniel Lok](https://github.com/daniellok-db)
- [Gabriel Fu](https://github.com/gabrielfu)
- [Harutaka Kawamura](https://github.com/harupy)
- [Joel Robin P](https://github.com/joelrobin18)
- [Serena Ruan](https://github.com/serena-ruan)
- [Tomu Hirata](https://github.com/TomeHirata)
- [Weichen Xu](https://github.com/WeichenXu123)
- [Yuki Watanabe](https://github.com/B-Step62)
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.txt]---
Location: mlflow-master/libs/tracing/LICENSE.txt

```text
../../LICENSE.txt
```

--------------------------------------------------------------------------------

---[FILE: MANIFEST.in]---
Location: mlflow-master/libs/tracing/MANIFEST.in

```text
../../MANIFEST.in
```

--------------------------------------------------------------------------------

---[FILE: mlflow]---
Location: mlflow-master/libs/tracing/mlflow

```text
../../mlflow
```

--------------------------------------------------------------------------------

---[FILE: pyproject.toml]---
Location: mlflow-master/libs/tracing/pyproject.toml

```toml
# Auto-generated by dev/pyproject.py. Do not edit manually.
# This file defines the package metadata of `mlflow-tracing`.

[build-system]
requires = ["setuptools"]
build-backend = "setuptools.build_meta"

[project]
name = "mlflow-tracing"
version = "3.8.1.dev0"
description = "MLflow Tracing SDK is an open-source, lightweight Python package that only includes the minimum set of dependencies and functionality to instrument your code/models/agents with MLflow Tracing."
readme = "README.md"
keywords = ["mlflow", "ai", "databricks"]
classifiers = [
  "Development Status :: 5 - Production/Stable",
  "Intended Audience :: Developers",
  "Intended Audience :: End Users/Desktop",
  "Intended Audience :: Science/Research",
  "Intended Audience :: Information Technology",
  "Topic :: Scientific/Engineering :: Artificial Intelligence",
  "Topic :: Software Development :: Libraries :: Python Modules",
  "License :: OSI Approved :: Apache Software License",
  "Operating System :: OS Independent",
  "Programming Language :: Python :: 3.10",
]
requires-python = ">=3.10"
dependencies = [
  "cachetools<7,>=5.0.0",
  "databricks-sdk<1,>=0.20.0",
  "opentelemetry-api<3,>=1.9.0",
  "opentelemetry-proto<3,>=1.9.0",
  "opentelemetry-sdk<3,>=1.9.0",
  "packaging<26",
  "protobuf<7,>=3.12.0",
  "pydantic<3,>=2.0.0",
]
[[project.maintainers]]
name = "Databricks"
email = "mlflow-oss-maintainers@googlegroups.com"

[project.license]
file = "LICENSE.txt"

[project.urls]
homepage = "https://mlflow.org"
issues = "https://github.com/mlflow/mlflow/issues"
documentation = "https://mlflow.org/docs/latest"
repository = "https://github.com/mlflow/mlflow"

[tool.setuptools.packages.find]
where = ["."]
include = [
  "mlflow",
  "mlflow.agno*",
  "mlflow.anthropic*",
  "mlflow.autogen*",
  "mlflow.bedrock*",
  "mlflow.crewai*",
  "mlflow.dspy*",
  "mlflow.gemini*",
  "mlflow.groq*",
  "mlflow.langchain*",
  "mlflow.litellm*",
  "mlflow.llama_index*",
  "mlflow.mistral*",
  "mlflow.openai*",
  "mlflow.strands*",
  "mlflow.haystack*",
  "mlflow.azure*",
  "mlflow.entities*",
  "mlflow.environment_variables",
  "mlflow.exceptions",
  "mlflow.legacy_databricks_cli*",
  "mlflow.prompt*",
  "mlflow.protos*",
  "mlflow.pydantic_ai*",
  "mlflow.smolagents*",
  "mlflow.store*",
  "mlflow.telemetry*",
  "mlflow.tracing*",
  "mlflow.tracking*",
  "mlflow.types*",
  "mlflow.utils*",
  "mlflow.version",
]
exclude = [
  "mlflow/protos/databricks_artifacts_pb2.py",
  "mlflow/protos/databricks_filesystem_service_pb2.py",
  "mlflow/protos/databricks_uc_registry_messages_pb2.py",
  "mlflow/protos/databricks_uc_registry_service_pb2.py",
  "mlflow/protos/model_registry_pb2.py",
  "mlflow/protos/unity_catalog_oss_messages_pb2.py",
  "mlflow/protos/unity_catalog_oss_service_pb2.py",
  "tests",
  "tests.*",
]
namespaces = false
```

--------------------------------------------------------------------------------

````
