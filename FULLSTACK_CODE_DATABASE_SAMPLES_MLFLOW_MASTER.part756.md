---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 756
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 756 of 991)

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

---[FILE: core-requirements.yaml]---
Location: mlflow-master/requirements/core-requirements.yaml
Signals: Docker

```yaml
# These are the core requirements for the complete MLflow platform, which augments
# the skinny client functionality with support for running the MLflow Tracking
# Server & UI. It also adds project backends such as Docker and Kubernetes among
# other capabilities. When we release a new major/minor version, this file is
# automatically updated as a part of the release process.

alembic:
  pip_release: alembic
  max_major_version: 1
  # alembic 1.10.0 contains a regression: https://github.com/sqlalchemy/alembic/issues/1195
  unsupported: ["1.10.0"]

docker:
  pip_release: docker
  minimum: "4.0.0"
  max_major_version: 7

flask:
  pip_release: Flask
  max_major_version: 3

flask-cors:
  pip_release: Flask-CORS
  max_major_version: 6

numpy:
  pip_release: numpy
  max_major_version: 2

scipy:
  pip_release: scipy
  max_major_version: 1

pandas:
  pip_release: pandas
  max_major_version: 2

sqlalchemy:
  pip_release: sqlalchemy
  minimum: "1.4.0"
  max_major_version: 2

cryptography:
  pip_release: cryptography
  minimum: "43.0.0"
  max_major_version: 46

gunicorn:
  pip_release: gunicorn
  max_major_version: 23
  markers: "platform_system != 'Windows'"

waitress:
  pip_release: waitress
  max_major_version: 3
  markers: "platform_system == 'Windows'"

scikit-learn:
  pip_release: scikit-learn
  max_major_version: 1

pyarrow:
  pip_release: pyarrow
  minimum: "4.0.0"
  max_major_version: 22

matplotlib:
  pip_release: matplotlib
  max_major_version: 3

graphene:
  pip_release: graphene
  max_major_version: 3

huey:
  pip_release: huey
  minimum: "2.5.0"
  max_major_version: 2
```

--------------------------------------------------------------------------------

---[FILE: dev-requirements.txt]---
Location: mlflow-master/requirements/dev-requirements.txt

```text
-r extra-ml-requirements.txt
-r test-requirements.txt
-r lint-requirements.txt
-r doc-requirements.txt
```

--------------------------------------------------------------------------------

---[FILE: doc-min-requirements.txt]---
Location: mlflow-master/requirements/doc-min-requirements.txt

```text
# Minimum version that works with Python 3.10
sphinx==4.2.0
jinja2==3.0.3
# to be compatible with jinja2==3.0.3
flask<=2.2.5
sphinx-autobuild
sphinx-click
# to be compatible with docutils==0.16
sphinx-tabs==3.2.0
# redirect handling
sphinx-reredirects==0.1.3
# Pin sphinxcontrib packages. Their newer versions are incompatible with sphinx==4.2.0.
sphinxcontrib-applehelp<1.0.8
sphinxcontrib-devhelp<1.0.6
sphinxcontrib-htmlhelp<2.0.4
sphinxcontrib-serializinghtml<1.1.10
sphinxcontrib-qthelp<1.0.7
```

--------------------------------------------------------------------------------

---[FILE: doc-requirements.txt]---
Location: mlflow-master/requirements/doc-requirements.txt

```text
-r doc-min-requirements.txt
tensorflow-cpu<=2.12.0; platform_system!="Darwin" or platform_machine!="arm64"
tensorflow-macos<=2.12.0; platform_system=="Darwin" and platform_machine=="arm64"
pyspark<4.1.0
datasets
# requried to run `log_figure` examples
plotly
# nbsphinx and ipython are required for jupyter notebook rendering
nbsphinx==0.8.8
# ipython 8.7.0 is an incompatible release
ipython!=8.7.0
keras
torch>=1.11.0
torchvision>=0.12.0
lightning>=1.8.1
scrapy
ipywidgets>=8.1.1
# incremental==24.7.0 requires setuptools>=61.0, which causes https://github.com/mlflow/mlflow/issues/8635
incremental<24.7.0
# this is an extra dependency for the auth app which
# is not included in the core mlflow requirements
Flask-WTF<2
# required for testing polars dataset integration
polars>=1
# required for the genai evaluation example
openai
# required for the haystack
haystack-ai
# required for deepeval scorer documentation
deepeval
```

--------------------------------------------------------------------------------

---[FILE: extra-ml-requirements.txt]---
Location: mlflow-master/requirements/extra-ml-requirements.txt

```text
## This file describes extra ML library dependencies that you, as an end user,
## must install in order to use various MLflow Python modules.
# Required by mlflow.spacy
spacy>=3.3.0
# Required by mlflow.tensorflow
tensorflow>=2.10.0; platform_system!="Darwin" or platform_machine!="arm64"
tensorflow-macos>=2.10.0; platform_system=="Darwin" and platform_machine=="arm64"
# Required by mlflow.pytorch
torch>=1.11.0
torchvision>=0.12.0
lightning>=1.8.1
# Required by mlflow.xgboost
xgboost>=0.82
# Required by mlflow.lightgbm
lightgbm
# Required by mlflow.catboost
catboost
# Required by mlflow.statsmodels
statsmodels
# Required by mlflow.h2o
h2o
# Required by mlflow.onnx
onnx>=1.17.0
onnxruntime
onnxscript
tf2onnx
# Required by mlflow.spark and using Delta with MLflow Tracking datasets
pyspark<4.1.0
# Required by mlflow.paddle
paddlepaddle
# Required by mlflow.prophet
# NOTE: Prophet's whl build process will fail with dependencies not being present.
#   Installation will default to setup.py in order to install correctly.
#   To install in dev environment, ensure that gcc>=8 is installed to allow pystan
#   to compile the model binaries. See: https://gcc.gnu.org/install/
# Avoid 0.25 due to https://github.com/dr-prodigy/python-holidays/issues/1200
holidays!=0.25
prophet
# Required by mlflow.shap
# and shap evaluation functionality
shap>=0.42.1
# Required by mlflow.pmdarima
pmdarima
# Required for using Hugging Face datasets with MLflow Tracking
# Avoid datasets < 2.19.1 due to an incompatibility issue https://github.com/huggingface/datasets/issues/6737
datasets>=2.19.1
# Required by mlflow.transformers
transformers
# transformers doesn't support Keras 3 yet. tf-keras needs to be installed as a workaround
tf-keras
sentencepiece
setfit
librosa
ffmpeg
accelerate
# Required by mlflow.openai
openai
tiktoken
tenacity
# Required by mlflow.llama_index
llama_index
# Required for an agent example of mlflow.llama_index
llama-index-agent-openai
# Required by mlflow.langchain
langchain
langchain-openai
# Required by mlflow.sentence_transformers
sentence-transformers
# Required by mlflow.anthropic
anthropic
# Required by mlflow.ag2
ag2
# Required by mlflow.dspy
# In dspy 2.6.9, `dspy.__name__` is not 'dspy', but 'dspy.__metadata__',
# which causes auto-logging tests to fail.
dspy!=2.6.9
# Required by mlflow.litellm
litellm
# Required by mlflow.gemini
google-genai
# Required by mlflow.groq
groq
# Required by mlflow.mistral
mistralai
# Required by mlflow.autogen
autogen-agentchat
# Required by mlflow.semantic_kernel
semantic-kernel
# Required by mlflow.agno
agno
# Required by mlflow.strands
strands-agents
# Required by mlflow.haystack
haystack-ai
```

--------------------------------------------------------------------------------

---[FILE: gateway-requirements.yaml]---
Location: mlflow-master/requirements/gateway-requirements.yaml

```yaml
# These are the extra requirements for MLflow Gateway, which can be installed
# on top of the core requirements using `pip install mlflow[gateway]`.
# When we release a new major/minor version, this file is automatically updated
# as a part of the release process.

fastapi:
  pip_release: fastapi
  max_major_version: 0

uvicorn:
  pip_release: uvicorn
  extras:
    - standard
  max_major_version: 0

watchfiles:
  pip_release: watchfiles
  max_major_version: 1

aiohttp:
  pip_release: aiohttp
  max_major_version: 3

boto3:
  pip_release: boto3
  minimum: "1.28.56"
  max_major_version: 1

tiktoken:
  pip_release: tiktoken
  max_major_version: 0

slowapi:
  pip_release: slowapi
  max_major_version: 0
  minimum: "0.1.9"
```

--------------------------------------------------------------------------------

---[FILE: genai-requirements.yaml]---
Location: mlflow-master/requirements/genai-requirements.yaml

```yaml
# These are the extra requirements for MLflow GenAI features, which can be installed
# on top of the core requirements using `pip install mlflow[genai]`.
# When we release a new major/minor version, this file is automatically updated
# as a part of the release process.

fastapi:
  pip_release: fastapi
  max_major_version: 0

uvicorn:
  pip_release: uvicorn
  extras:
    - standard
  max_major_version: 0

watchfiles:
  pip_release: watchfiles
  max_major_version: 1

aiohttp:
  pip_release: aiohttp
  max_major_version: 3

boto3:
  pip_release: boto3
  minimum: "1.28.56"
  max_major_version: 1

litellm:
  pip_release: litellm
  max_major_version: 1
  minimum: "1.0.0"

slowapi:
  pip_release: slowapi
  max_major_version: 0
  minimum: "0.1.9"

tiktoken:
  pip_release: tiktoken
  max_major_version: 0
```

--------------------------------------------------------------------------------

---[FILE: lint-requirements.txt]---
Location: mlflow-master/requirements/lint-requirements.txt

```text
ruff==0.12.10
black==23.7.0
blacken-docs==1.18.0
pre-commit==4.0.1
toml==0.10.2
mypy==1.17.1
pytest==8.4.0
pydantic==2.11.7
-e ./dev/clint
```

--------------------------------------------------------------------------------

---[FILE: skinny-requirements.yaml]---
Location: mlflow-master/requirements/skinny-requirements.yaml

```yaml
# Minimal requirements for the skinny MLflow client which provides a limited
# subset of functionality such as: RESTful client functionality for Tracking and
# Model Registry, as well as support for Project execution against local backends
# and Databricks. When we release a new major/minor version, this file is automatically
# updated as a part of the release process.

click:
  pip_release: click
  minimum: "7.0"
  max_major_version: 8

cloudpickle:
  pip_release: cloudpickle
  max_major_version: 3

python-dotenv:
  pip_release: python-dotenv
  minimum: "0.19.0"
  max_major_version: 1

gitpython:
  pip_release: gitpython
  minimum: "3.1.9"
  max_major_version: 3

pyyaml:
  pip_release: pyyaml
  minimum: "5.1"
  max_major_version: 6

protobuf:
  pip_release: protobuf
  minimum: "3.12.0"
  max_major_version: 6

requests:
  pip_release: requests
  minimum: "2.17.3"
  max_major_version: 2

packaging:
  pip_release: packaging
  max_major_version: 25

importlib_metadata:
  pip_release: importlib_metadata
  # Automated dependency detection in MLflow Models relies on
  # `importlib_metadata.packages_distributions` to resolve a module name to its package name
  # (e.g. 'sklearn' -> 'scikit-learn'). importlib_metadata 3.7.0 or newer supports this function:
  # https://github.com/python/importlib_metadata/blob/main/CHANGES.rst#v370
  minimum: "3.7.0"
  max_major_version: 8
  unsupported: ["4.7.0"]

sqlparse:
  pip_release: sqlparse
  # Lower bound sqlparse for: https://github.com/andialbrecht/sqlparse/pull/567
  minimum: "0.4.0"
  max_major_version: 0

# Required for tracing
cachetools:
  pip_release: cachetools
  minimum: "5.0.0"
  max_major_version: 6

# 1.9.0 is the minimum supported version as NoOpTracer was introduced in 1.9.0
opentelemetry-api:
  pip_release: opentelemetry-api
  minimum: "1.9.0"
  max_major_version: 2

opentelemetry-sdk:
  pip_release: opentelemetry-sdk
  minimum: "1.9.0"
  max_major_version: 2

opentelemetry-proto:
  pip_release: opentelemetry-proto
  minimum: "1.9.0"
  max_major_version: 2

databricks-sdk:
  pip_release: databricks-sdk
  minimum: "0.20.0"
  max_major_version: 0

pydantic:
  pip_release: pydantic
  minimum: "2.0.0"
  max_major_version: 2

typing-extensions:
  pip_release: typing-extensions
  minimum: "4.0.0"
  max_major_version: 4

fastapi:
  pip_release: fastapi
  max_major_version: 0

uvicorn:
  pip_release: uvicorn
  max_major_version: 0
```

--------------------------------------------------------------------------------

---[FILE: skinny-test-requirements.txt]---
Location: mlflow-master/requirements/skinny-test-requirements.txt

```text
## Test-only dependencies
pytest
pytest-cov
```

--------------------------------------------------------------------------------

---[FILE: test-requirements.txt]---
Location: mlflow-master/requirements/test-requirements.txt

```text
## Dependencies required to run tests
## Test-only dependencies
pytest
pytest-asyncio
pytest-repeat
pytest-cov
pytest-timeout
moto>=4.2.0,<5,!=4.2.5
azure-storage-blob>=12.0.0
azure-storage-file-datalake>=12.9.1
azure-identity>=1.6.1
pillow
plotly
kaleido
# Required by evaluator tests
shap
# Required to evaluate language models in `mlflow.evaluate`
evaluate
nltk
rouge_score
textstat
tiktoken
# Required by progress bar tests
tqdm[notebook]
# Required for LLM eval in `mlflow.evaluate`
openai
# Required for showing pytest stats
psutil
pyspark<4.1.0
# Required for testing the opentelemetry exporter of tracing
opentelemetry-exporter-otlp-proto-grpc
opentelemetry-exporter-otlp-proto-http
# Required for testing mlflow.server.auth
Flask-WTF<2
# required for testing polars dataset integration
polars>=1
# required for testing mlflow.genai.optimize_prompt
dspy
# required for testing mlflow.genai.optimize.optimizers
gepa
```

--------------------------------------------------------------------------------

---[FILE: tracing-requirements.yaml]---
Location: mlflow-master/requirements/tracing-requirements.yaml

```yaml
# Minimal requirements for the MLflow Tracing package. It is a lightweight
# package that only includes the minimum set of dependencies and functionality
# to instrument code/models/agents with MLflow Tracing.
# When we release a new major/minor version, this file is automatically
# updated as a part of the release process.

protobuf:
  pip_release: protobuf
  minimum: "3.12.0"
  max_major_version: 6

packaging:
  pip_release: packaging
  max_major_version: 25

# Required for tracing
cachetools:
  pip_release: cachetools
  minimum: "5.0.0"
  max_major_version: 6

# 1.9.0 is the minimum supported version as NoOpTracer was introduced in 1.9.0
opentelemetry-api:
  pip_release: opentelemetry-api
  minimum: "1.9.0"
  max_major_version: 2

opentelemetry-sdk:
  pip_release: opentelemetry-sdk
  minimum: "1.9.0"
  max_major_version: 2

opentelemetry-proto:
  pip_release: opentelemetry-proto
  minimum: "1.9.0"
  max_major_version: 2

databricks-sdk:
  pip_release: databricks-sdk
  minimum: "0.20.0"
  max_major_version: 0

pydantic:
  pip_release: pydantic
  minimum: "2.0.0"
  max_major_version: 2
```

--------------------------------------------------------------------------------

---[FILE: check_mlflow_lazily_imports_ml_packages.py]---
Location: mlflow-master/tests/check_mlflow_lazily_imports_ml_packages.py

```python
"""
Tests that `import mlflow` and `mlflow.autolog()` do not import ML packages.
"""

import importlib
import logging
import sys

import mlflow

logger = logging.getLogger()


def main():
    ml_packages = {
        "catboost",
        "h2o",
        "lightgbm",
        "onnx",
        "pytorch_lightning",
        "pyspark.ml",
        "shap",
        "sklearn",
        "spacy",
        "statsmodels",
        "tensorflow",
        "torch",
        "xgboost",
        "pmdarima",
        "transformers",
        "sentence_transformers",
    }
    imported = ml_packages.intersection(set(sys.modules))
    assert imported == set(), f"mlflow imports {imported} when it's imported but it should not"

    mlflow.autolog()
    imported = ml_packages.intersection(set(sys.modules))
    assert imported == set(), f"`mlflow.autolog` imports {imported} but it should not"

    # Ensure that the ML packages are importable
    failed_to_import = []
    for package in sorted(ml_packages):
        try:
            importlib.import_module(package)
        except ImportError:
            logger.exception(f"Failed to import {package}")
            failed_to_import.append(package)

    message = (
        f"Failed to import {failed_to_import}. Please install packages that provide these modules."
    )
    assert failed_to_import == [], message


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

````
