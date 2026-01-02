---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 893
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 893 of 991)

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

---[FILE: Dockerfile_install_mlflow]---
Location: mlflow-master/tests/resources/dockerfile/Dockerfile_install_mlflow

```text
# Build an image that can serve mlflow models.
FROM python:${{ PYTHON_VERSION }}-slim

RUN apt-get -y update && apt-get install -y --no-install-recommends nginx



WORKDIR /opt/mlflow

# Install MLflow
RUN pip install mlflow==${{ MLFLOW_VERSION }}

# Copy model to image and install dependencies
COPY model_dir/model /opt/ml/model
RUN python -c "from mlflow.models import container as C; C._install_pyfunc_deps('/opt/ml/model', install_mlflow=True, enable_mlserver=False, env_manager='local');"

ENV MLFLOW_DISABLE_ENV_CREATION=True
ENV ENABLE_MLSERVER=False

# granting read/write access and conditional execution authority to all child directories
# and files to allow for deployment to AWS Sagemaker Serverless Endpoints
# (see https://docs.aws.amazon.com/sagemaker/latest/dg/serverless-endpoints.html)
RUN chmod o+rwX /opt/mlflow/

# clean up apt cache to reduce image size
RUN rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["python", "-c", "from mlflow.models import container as C; C._serve('local')"]
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile_install_mlflow_virtualenv]---
Location: mlflow-master/tests/resources/dockerfile/Dockerfile_install_mlflow_virtualenv

```text
# Build an image that can serve mlflow models.
FROM ubuntu:22.04

RUN apt-get -y update && DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt-get install -y --no-install-recommends wget curl nginx ca-certificates bzip2 build-essential cmake git-core

# Setup pyenv
RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt-get -y install tzdata \
    libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm \
    libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev
RUN git clone \
    --depth 1 \
    --branch $(git ls-remote --tags --sort=v:refname https://github.com/pyenv/pyenv.git | grep -o -E 'v[1-9]+(\.[1-9]+)+$' | tail -1) \
    https://github.com/pyenv/pyenv.git /root/.pyenv
ENV PYENV_ROOT="/root/.pyenv"
ENV PATH="$PYENV_ROOT/bin:$PATH"
RUN apt install -y software-properties-common \
    && apt update \
    && add-apt-repository -y ppa:deadsnakes/ppa \
    && apt update \
    && apt install -y python3.10 python3.10-distutils \
    # Remove python3-blinker to avoid pip uninstall conflicts
    && apt remove -y python3-blinker \
    && ln -s -f $(which python3.10) /usr/bin/python \
    && wget https://bootstrap.pypa.io/get-pip.py -O /tmp/get-pip.py \
    && python /tmp/get-pip.py
RUN pip install virtualenv


# Setup Java
RUN apt-get install -y --no-install-recommends openjdk-17-jdk maven
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

WORKDIR /opt/mlflow

# Install MLflow
RUN pip install mlflow==${{ MLFLOW_VERSION }}

# Copy model to image and install dependencies
COPY model_dir/model /opt/ml/model
RUN python -c "from mlflow.models import container as C; C._install_pyfunc_deps('/opt/ml/model', install_mlflow=False, enable_mlserver=False, env_manager='virtualenv');"

ENV MLFLOW_DISABLE_ENV_CREATION=True
ENV ENABLE_MLSERVER=False

# granting read/write access and conditional execution authority to all child directories
# and files to allow for deployment to AWS Sagemaker Serverless Endpoints
# (see https://docs.aws.amazon.com/sagemaker/latest/dg/serverless-endpoints.html)
RUN chmod o+rwX /opt/mlflow/

# clean up apt cache to reduce image size
RUN rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["python", "-c", "from mlflow.models import container as C; C._serve('virtualenv')"]
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile_java_flavor]---
Location: mlflow-master/tests/resources/dockerfile/Dockerfile_java_flavor

```text
# Build an image that can serve mlflow models.
FROM ubuntu:22.04

RUN apt-get -y update && DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt-get install -y --no-install-recommends wget curl nginx ca-certificates bzip2 build-essential cmake git-core

# Setup pyenv
RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt-get -y install tzdata \
    libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm \
    libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev
RUN git clone \
    --depth 1 \
    --branch $(git ls-remote --tags --sort=v:refname https://github.com/pyenv/pyenv.git | grep -o -E 'v[1-9]+(\.[1-9]+)+$' | tail -1) \
    https://github.com/pyenv/pyenv.git /root/.pyenv
ENV PYENV_ROOT="/root/.pyenv"
ENV PATH="$PYENV_ROOT/bin:$PATH"
RUN apt install -y software-properties-common \
    && apt update \
    && add-apt-repository -y ppa:deadsnakes/ppa \
    && apt update \
    && apt install -y python3.10 python3.10-distutils \
    # Remove python3-blinker to avoid pip uninstall conflicts
    && apt remove -y python3-blinker \
    && ln -s -f $(which python3.10) /usr/bin/python \
    && wget https://bootstrap.pypa.io/get-pip.py -O /tmp/get-pip.py \
    && python /tmp/get-pip.py
RUN pip install virtualenv


# Setup Java
RUN apt-get install -y --no-install-recommends openjdk-17-jdk maven
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

WORKDIR /opt/mlflow

# Install MLflow
RUN pip install mlflow==${{ MLFLOW_VERSION }}

# Copy model to image and install dependencies
COPY model_dir/model /opt/ml/model
RUN python -c "from mlflow.models import container as C; C._install_pyfunc_deps('/opt/ml/model', install_mlflow=False, enable_mlserver=False, env_manager='virtualenv');"

ENV MLFLOW_DISABLE_ENV_CREATION=True
ENV ENABLE_MLSERVER=False

# granting read/write access and conditional execution authority to all child directories
# and files to allow for deployment to AWS Sagemaker Serverless Endpoints
# (see https://docs.aws.amazon.com/sagemaker/latest/dg/serverless-endpoints.html)
RUN chmod o+rwX /opt/mlflow/

# clean up apt cache to reduce image size
RUN rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["python", "-c", "from mlflow.models import container as C; C._serve('virtualenv')"]
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile_no_model_uri]---
Location: mlflow-master/tests/resources/dockerfile/Dockerfile_no_model_uri

```text
# Build an image that can serve mlflow models.
FROM ubuntu:22.04

RUN apt-get -y update && DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt-get install -y --no-install-recommends wget curl nginx ca-certificates bzip2 build-essential cmake git-core

# Setup pyenv
RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt-get -y install tzdata \
    libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm \
    libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev
RUN git clone \
    --depth 1 \
    --branch $(git ls-remote --tags --sort=v:refname https://github.com/pyenv/pyenv.git | grep -o -E 'v[1-9]+(\.[1-9]+)+$' | tail -1) \
    https://github.com/pyenv/pyenv.git /root/.pyenv
ENV PYENV_ROOT="/root/.pyenv"
ENV PATH="$PYENV_ROOT/bin:$PATH"
RUN apt install -y software-properties-common \
    && apt update \
    && add-apt-repository -y ppa:deadsnakes/ppa \
    && apt update \
    && apt install -y python3.10 python3.10-distutils \
    # Remove python3-blinker to avoid pip uninstall conflicts
    && apt remove -y python3-blinker \
    && ln -s -f $(which python3.10) /usr/bin/python \
    && wget https://bootstrap.pypa.io/get-pip.py -O /tmp/get-pip.py \
    && python /tmp/get-pip.py
RUN pip install virtualenv


# Setup Java
RUN apt-get install -y --no-install-recommends openjdk-17-jdk maven
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

WORKDIR /opt/mlflow

# Install MLflow
RUN pip install mlflow==${{ MLFLOW_VERSION }}



ENV MLFLOW_DISABLE_ENV_CREATION=True
ENV ENABLE_MLSERVER=False

# granting read/write access and conditional execution authority to all child directories
# and files to allow for deployment to AWS Sagemaker Serverless Endpoints
# (see https://docs.aws.amazon.com/sagemaker/latest/dg/serverless-endpoints.html)
RUN chmod o+rwX /opt/mlflow/

# clean up apt cache to reduce image size
RUN rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["python", "-c", "from mlflow.models import container as C; C._install_pyfunc_deps('/opt/ml/model', install_mlflow=False, enable_mlserver=False, env_manager='virtualenv'); C._serve('virtualenv')"]
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile_sagemaker_conda]---
Location: mlflow-master/tests/resources/dockerfile/Dockerfile_sagemaker_conda

```text
# Build an image that can serve mlflow models.
FROM ubuntu:22.04

RUN apt-get -y update && DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt-get install -y --no-install-recommends wget curl nginx ca-certificates bzip2 build-essential cmake git-core

# Setup miniconda
RUN curl --fail -L https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh > miniconda.sh
RUN bash ./miniconda.sh -b -p /miniconda && rm ./miniconda.sh
ENV PATH="/miniconda/bin:$PATH"
# Remove default channels to avoid `CondaToSNonInteractiveError`.
# See https://github.com/mlflow/mlflow/pull/16752 for more details.
RUN conda config --system --remove channels defaults && conda config --system --add channels conda-forge


# Setup Java
RUN apt-get install -y --no-install-recommends openjdk-17-jdk maven
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

WORKDIR /opt/mlflow

# Install MLflow from local source
COPY mlflow-project /opt/mlflow
RUN pip install /opt/mlflow

# Install minimal serving dependencies
RUN python -c "from mlflow.models.container import _install_pyfunc_deps;_install_pyfunc_deps(None, False)"

ENV MLFLOW_DISABLE_ENV_CREATION=False
ENV ENABLE_MLSERVER=False

# granting read/write access and conditional execution authority to all child directories
# and files to allow for deployment to AWS Sagemaker Serverless Endpoints
# (see https://docs.aws.amazon.com/sagemaker/latest/dg/serverless-endpoints.html)
RUN chmod o+rwX /opt/mlflow/

# clean up apt cache to reduce image size
RUN rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["python", "-c", "import sys; from mlflow.models import container as C; C._init(sys.argv[1], 'conda')"]
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile_sagemaker_virtualenv]---
Location: mlflow-master/tests/resources/dockerfile/Dockerfile_sagemaker_virtualenv

```text
# Build an image that can serve mlflow models.
FROM ubuntu:22.04

RUN apt-get -y update && DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt-get install -y --no-install-recommends wget curl nginx ca-certificates bzip2 build-essential cmake git-core

# Setup pyenv
RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt-get -y install tzdata \
    libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm \
    libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev
RUN git clone \
    --depth 1 \
    --branch $(git ls-remote --tags --sort=v:refname https://github.com/pyenv/pyenv.git | grep -o -E 'v[1-9]+(\.[1-9]+)+$' | tail -1) \
    https://github.com/pyenv/pyenv.git /root/.pyenv
ENV PYENV_ROOT="/root/.pyenv"
ENV PATH="$PYENV_ROOT/bin:$PATH"
RUN apt install -y software-properties-common \
    && apt update \
    && add-apt-repository -y ppa:deadsnakes/ppa \
    && apt update \
    && apt install -y python3.10 python3.10-distutils \
    # Remove python3-blinker to avoid pip uninstall conflicts
    && apt remove -y python3-blinker \
    && ln -s -f $(which python3.10) /usr/bin/python \
    && wget https://bootstrap.pypa.io/get-pip.py -O /tmp/get-pip.py \
    && python /tmp/get-pip.py
RUN pip install virtualenv


# Setup Java
RUN apt-get install -y --no-install-recommends openjdk-17-jdk maven
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

WORKDIR /opt/mlflow

# Install MLflow from local source
COPY mlflow-project /opt/mlflow
RUN pip install /opt/mlflow

# Install minimal serving dependencies
RUN python -c "from mlflow.models.container import _install_pyfunc_deps;_install_pyfunc_deps(None, False)"

ENV MLFLOW_DISABLE_ENV_CREATION=False
ENV ENABLE_MLSERVER=False

# granting read/write access and conditional execution authority to all child directories
# and files to allow for deployment to AWS Sagemaker Serverless Endpoints
# (see https://docs.aws.amazon.com/sagemaker/latest/dg/serverless-endpoints.html)
RUN chmod o+rwX /opt/mlflow/

# clean up apt cache to reduce image size
RUN rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["python", "-c", "import sys; from mlflow.models import container as C; C._init(sys.argv[1], 'virtualenv')"]
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile_sagemaker_virtualenv_no_java]---
Location: mlflow-master/tests/resources/dockerfile/Dockerfile_sagemaker_virtualenv_no_java

```text
# Build an image that can serve mlflow models.
FROM ubuntu:22.04

RUN apt-get -y update && DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt-get install -y --no-install-recommends wget curl nginx ca-certificates bzip2 build-essential cmake git-core

# Setup pyenv
RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt-get -y install tzdata \
    libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm \
    libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev
RUN git clone \
    --depth 1 \
    --branch $(git ls-remote --tags --sort=v:refname https://github.com/pyenv/pyenv.git | grep -o -E 'v[1-9]+(\.[1-9]+)+$' | tail -1) \
    https://github.com/pyenv/pyenv.git /root/.pyenv
ENV PYENV_ROOT="/root/.pyenv"
ENV PATH="$PYENV_ROOT/bin:$PATH"
RUN apt install -y software-properties-common \
    && apt update \
    && add-apt-repository -y ppa:deadsnakes/ppa \
    && apt update \
    && apt install -y python3.10 python3.10-distutils \
    # Remove python3-blinker to avoid pip uninstall conflicts
    && apt remove -y python3-blinker \
    && ln -s -f $(which python3.10) /usr/bin/python \
    && wget https://bootstrap.pypa.io/get-pip.py -O /tmp/get-pip.py \
    && python /tmp/get-pip.py
RUN pip install virtualenv




WORKDIR /opt/mlflow

# Install MLflow from local source
COPY mlflow-project /opt/mlflow
RUN pip install /opt/mlflow

# Install minimal serving dependencies
RUN python -c "from mlflow.models.container import _install_pyfunc_deps;_install_pyfunc_deps(None, False)"

ENV MLFLOW_DISABLE_ENV_CREATION=False
ENV ENABLE_MLSERVER=False

# granting read/write access and conditional execution authority to all child directories
# and files to allow for deployment to AWS Sagemaker Serverless Endpoints
# (see https://docs.aws.amazon.com/sagemaker/latest/dg/serverless-endpoints.html)
RUN chmod o+rwX /opt/mlflow/

# clean up apt cache to reduce image size
RUN rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["python", "-c", "import sys; from mlflow.models import container as C; C._init(sys.argv[1], 'virtualenv')"]
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile_with_mlflow_home]---
Location: mlflow-master/tests/resources/dockerfile/Dockerfile_with_mlflow_home

```text
# Build an image that can serve mlflow models.
FROM python:${{ PYTHON_VERSION }}-slim

RUN apt-get -y update && apt-get install -y --no-install-recommends nginx



WORKDIR /opt/mlflow

# Install MLflow from local source
COPY mlflow-project /opt/mlflow
RUN pip install /opt/mlflow

# Copy model to image and install dependencies
COPY model_dir/model /opt/ml/model
RUN python -c "from mlflow.models import container as C; C._install_pyfunc_deps('/opt/ml/model', install_mlflow=False, enable_mlserver=False, env_manager='local');"

ENV MLFLOW_DISABLE_ENV_CREATION=True
ENV ENABLE_MLSERVER=False

# granting read/write access and conditional execution authority to all child directories
# and files to allow for deployment to AWS Sagemaker Serverless Endpoints
# (see https://docs.aws.amazon.com/sagemaker/latest/dg/serverless-endpoints.html)
RUN chmod o+rwX /opt/mlflow/

# clean up apt cache to reduce image size
RUN rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["python", "-c", "from mlflow.models import container as C; C._serve('local')"]
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile]---
Location: mlflow-master/tests/resources/example_docker_project/Dockerfile

```text
FROM python:3.10

RUN apt-get update -y && apt-get install build-essential -y
RUN pip install mlflow
```

--------------------------------------------------------------------------------

---[FILE: kubernetes_config.json]---
Location: mlflow-master/tests/resources/example_docker_project/kubernetes_config.json
Signals: Docker

```json
{
  "kube-context": "docker-for-desktop",
  "kube-job-template-path": "examples/docker/kubernetes_job_template.yaml",
  "repository-uri": "username/mlflow-kubernetes-example"
}
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/tests/resources/example_docker_project/MLproject

```text
name: docker-example

docker_env:
  image:  mlflow-docker-example

entry_points:
  main:
    command: "echo 'Main entry point'"
  test_tracking:
    parameters:
      use_start_run: bool
    command: "python scripts/docker_tracking_test.py {use_start_run}"
```

--------------------------------------------------------------------------------

---[FILE: docker_tracking_test.py]---
Location: mlflow-master/tests/resources/example_docker_project/scripts/docker_tracking_test.py

```python
import sys
import tempfile

import mlflow


def call_tracking_apis():
    mlflow.log_metric("some_key", 3)
    with tempfile.NamedTemporaryFile("w") as temp_file:
        temp_file.write("Temporary content.")
        mlflow.log_artifact(temp_file.name)


def main(use_start_run):
    if use_start_run:
        with mlflow.start_run():
            call_tracking_apis()
    else:
        call_tracking_apis()


if __name__ == "__main__":
    main(use_start_run=int(sys.argv[1]))
```

--------------------------------------------------------------------------------

---[FILE: conda.yaml]---
Location: mlflow-master/tests/resources/example_mlflow_1x_sklearn_model/conda.yaml

```yaml
channels:
  - conda-forge
dependencies:
  - python=3.10.19
  - pip<=23.0.1
  - pip:
      - mlflow
      - cloudpickle==2.2.1
      - scikit-learn==1.5.2
name: mlflow-env
```

--------------------------------------------------------------------------------

---[FILE: MLmodel]---
Location: mlflow-master/tests/resources/example_mlflow_1x_sklearn_model/MLmodel

```text
flavors:
  python_function:
    env: conda.yaml
    loader_module: mlflow.sklearn
    model_path: model.pkl
    predict_fn: predict
    python_version: 3.10.19
  sklearn:
    code: null
    pickled_model: model.pkl
    serialization_format: cloudpickle
    sklearn_version: 1.5.2
mlflow_version: 1.30.1
model_uuid: 4d622e7b02614d1eb71f44eeb927be4f
utc_time_created: '2024-10-29 07:39:02.032550'
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/tests/resources/example_mlflow_1x_sklearn_model/python_env.yaml

```yaml
python: 3.10.19
build_dependencies:
  - pip==23.0.1
  - setuptools==58.1.0
  - wheel==0.42.0
dependencies:
  - -r requirements.txt
```

--------------------------------------------------------------------------------

---[FILE: requirements.txt]---
Location: mlflow-master/tests/resources/example_mlflow_1x_sklearn_model/requirements.txt

```text
mlflow
cloudpickle==2.2.1
scikit-learn==1.5.2
```

--------------------------------------------------------------------------------

---[FILE: conda.yaml]---
Location: mlflow-master/tests/resources/example_mlflow_2.12_langchain_model/conda.yaml

```yaml
channels:
  - conda-forge
dependencies:
  - python=3.10.12
  - pip<=22.3.1
  - pip:
      - bcrypt==3.2.0
      - cloudpickle==2.0.0
      - configparser==5.2.0
      - cryptography==39.0.1
      - databricks-feature-engineering==0.2.1
      - entrypoints==0.4
      - google-cloud-storage==2.11.0
      - grpcio-status==1.48.1
      - langchain==0.1.20
      - mlflow[gateway]==2.12.2
      - numpy==1.23.5
      - packaging==23.2
      - pandas==1.5.3
      - protobuf==4.24.0
      - psutil==5.9.0
      - pyarrow==8.0.0
      - pydantic==1.10.6
      - pyyaml==6.0
      - requests==2.28.1
      - tornado==6.1
name: mlflow-env
```

--------------------------------------------------------------------------------

---[FILE: config.yml]---
Location: mlflow-master/tests/resources/example_mlflow_2.12_langchain_model/config.yml

```yaml
llm_prompt_template: "Answer the following question based on the context: {context}\nQuestion: {question}"
embedding_size: 5
response: "Databricks"
```

--------------------------------------------------------------------------------

---[FILE: input_example.json]---
Location: mlflow-master/tests/resources/example_mlflow_2.12_langchain_model/input_example.json

```json
{ "messages": [{ "role": "user", "content": "What is Retrieval-augmented Generation?" }] }
```

--------------------------------------------------------------------------------

---[FILE: lc_model.py]---
Location: mlflow-master/tests/resources/example_mlflow_2.12_langchain_model/lc_model.py

```python
from typing import Any

from langchain.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser
from langchain.schema.runnable import RunnablePassthrough
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.chat_models import ChatDatabricks, ChatMlflow
from langchain_community.document_loaders import TextLoader
from langchain_community.embeddings import FakeEmbeddings
from langchain_community.vectorstores import FAISS

from mlflow.models import ModelConfig, set_model

base_config = ModelConfig(development_config="config.yml")


def get_fake_chat_model(endpoint="fake-endpoint"):
    from langchain.callbacks.manager import CallbackManagerForLLMRun
    from langchain.schema.messages import BaseMessage
    from langchain_core.outputs import ChatResult

    class FakeChatModel(ChatDatabricks):
        """Fake Chat Model wrapper for testing purposes."""

        endpoint: str = "fake-endpoint"

        def _generate(
            self,
            messages: list[BaseMessage],
            stop: list[str] | None = None,
            run_manager: CallbackManagerForLLMRun | None = None,
            **kwargs: Any,
        ) -> ChatResult:
            response = {
                "choices": [
                    {
                        "index": 0,
                        "message": {
                            "role": "assistant",
                            "content": f"{base_config.get('response')}",
                        },
                        "finish_reason": None,
                    }
                ],
            }
            return ChatMlflow._create_chat_result(response)

        @property
        def _llm_type(self) -> str:
            return "fake chat model"

    return FakeChatModel(endpoint=endpoint)


text_path = "tests/langchain/state_of_the_union.txt"
loader = TextLoader(text_path)
documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
docs = text_splitter.split_documents(documents)

embeddings = FakeEmbeddings(size=base_config.get("embedding_size"))
vectorstore = FAISS.from_documents(docs, embeddings)
retriever = vectorstore.as_retriever()

prompt = ChatPromptTemplate.from_template(base_config.get("llm_prompt_template"))
retrieval_chain = (
    {
        "context": retriever,
        "question": RunnablePassthrough(),
    }
    | prompt
    | get_fake_chat_model()
    | StrOutputParser()
)

set_model(retrieval_chain)
```

--------------------------------------------------------------------------------

---[FILE: MLmodel]---
Location: mlflow-master/tests/resources/example_mlflow_2.12_langchain_model/MLmodel

```text
artifact_path: chain
databricks_runtime: '14.3'
flavors:
  langchain:
    code: null
    config: /Workspace/Users/sunish.sheth@databricks.com/Managed RAG/config.yml
    databricks_dependency:
      databricks_chat_endpoint_name:
      - databricks-dbrx-instruct
      databricks_embeddings_endpoint_name:
      - databricks-bge-large-en
      databricks_vector_search_endpoint_name:
      - dbdemos_vs_endpoint
      databricks_vector_search_index_name:
      - monitoring.rag.databricks_docs_index__86cecd7f519449e494e8083f8c68741a
    langchain_version: 0.1.20
    model_code_path: /tmp/lc_model.py
    streamable: true
  python_function:
    env:
      conda: conda.yaml
      virtualenv: python_env.yaml
    loader_module: mlflow.langchain
    model_code_path: /tmp/lc_model.py
    predict_stream_fn: predict_stream
    python_version: 3.10.12
    streamable: true
mlflow_version: 2.12.2
model_size_bytes: 6875
model_uuid: bbdda59aafe84e11b2fc25a95e46aee1
resources:
  api_version: '1'
  databricks:
    serving_endpoint:
    - name: databricks-dbrx-instruct
    - name: databricks-bge-large-en
    vector_search_index:
    - name: monitoring.rag.databricks_docs_index__86cecd7f519449e494e8083f8c68741a
run_id: 84552a129bfb45faa87f5fb3f05eb9cf
saved_input_example_info:
  artifact_path: input_example.json
  type: json_object
signature:
  inputs: '[{"type": "array", "items": {"type": "object", "properties": {"content":
    {"type": "string", "required": true}, "role": {"type": "string", "required": true}}},
    "name": "messages", "required": true}]'
  outputs: '[{"type": "string", "required": true}]'
  params: null
utc_time_created: '2024-05-17 23:15:28.764394'
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/tests/resources/example_mlflow_2.12_langchain_model/python_env.yaml

```yaml
python: 3.10.12
build_dependencies:
  - pip==22.3.1
  - setuptools==65.6.3
  - wheel==0.38.4
dependencies:
  - -r requirements.txt
```

--------------------------------------------------------------------------------

---[FILE: registered_model_meta]---
Location: mlflow-master/tests/resources/example_mlflow_2.12_langchain_model/registered_model_meta

```text
model_name: rag.sunish.test_mflow
model_version: '1'
```

--------------------------------------------------------------------------------

---[FILE: requirements.txt]---
Location: mlflow-master/tests/resources/example_mlflow_2.12_langchain_model/requirements.txt

```text
bcrypt==3.2.0
cloudpickle==2.0.0
configparser==5.2.0
cryptography==39.0.1
databricks-feature-engineering==0.2.1
databricks-rag-studio==0.2.0.dev0
entrypoints==0.4
google-cloud-storage==2.11.0
grpcio-status==1.48.1
langchain==0.1.20
mlflow[gateway]==2.12.2
numpy==1.23.5
packaging==23.2
pandas==1.5.3
protobuf==4.24.0
psutil==5.9.0
pyarrow==8.0.0
pydantic==1.10.6
pyyaml==6.0
requests==2.28.1
tornado==6.1
```

--------------------------------------------------------------------------------

---[FILE: conda.yaml]---
Location: mlflow-master/tests/resources/example_mlflow_2.12_langchain_model/metadata/conda.yaml

```yaml
channels:
  - conda-forge
dependencies:
  - python=3.10.12
  - pip<=22.3.1
  - pip:
      - bcrypt==3.2.0
      - cloudpickle==2.0.0
      - configparser==5.2.0
      - cryptography==39.0.1
      - databricks-feature-engineering==0.2.1
      - entrypoints==0.4
      - google-cloud-storage==2.11.0
      - grpcio-status==1.48.1
      - langchain==0.1.20
      - mlflow[gateway]==2.12.2
      - numpy==1.23.5
      - packaging==23.2
      - pandas==1.5.3
      - protobuf==4.24.0
      - psutil==5.9.0
      - pyarrow==8.0.0
      - pydantic==1.10.6
      - pyyaml==6.0
      - requests==2.28.1
      - tornado==6.1
name: mlflow-env
```

--------------------------------------------------------------------------------

---[FILE: MLmodel]---
Location: mlflow-master/tests/resources/example_mlflow_2.12_langchain_model/metadata/MLmodel

```text
artifact_path: chain
databricks_runtime: '14.3'
flavors:
  langchain:
    code: null
    config: /Workspace/Users/sunish.sheth@databricks.com/Managed RAG/config.yml
    databricks_dependency:
      databricks_chat_endpoint_name:
      - databricks-dbrx-instruct
      databricks_embeddings_endpoint_name:
      - databricks-bge-large-en
      databricks_vector_search_endpoint_name:
      - dbdemos_vs_endpoint
      databricks_vector_search_index_name:
      - monitoring.rag.databricks_docs_index__86cecd7f519449e494e8083f8c68741a
    langchain_version: 0.1.20
    model_code_path: /tmp/lc_model.py
    streamable: true
  python_function:
    env:
      conda: conda.yaml
      virtualenv: python_env.yaml
    loader_module: mlflow.langchain
    model_code_path: /tmp/lc_model.py
    predict_stream_fn: predict_stream
    python_version: 3.10.12
    streamable: true
mlflow_version: 2.12.2
model_size_bytes: 6875
model_uuid: bbdda59aafe84e11b2fc25a95e46aee1
resources:
  api_version: '1'
  databricks:
    serving_endpoint:
    - name: databricks-dbrx-instruct
    - name: databricks-bge-large-en
    vector_search_index:
    - name: monitoring.rag.databricks_docs_index__86cecd7f519449e494e8083f8c68741a
run_id: 84552a129bfb45faa87f5fb3f05eb9cf
saved_input_example_info:
  artifact_path: input_example.json
  type: json_object
signature:
  inputs: '[{"type": "array", "items": {"type": "object", "properties": {"content":
    {"type": "string", "required": true}, "role": {"type": "string", "required": true}}},
    "name": "messages", "required": true}]'
  outputs: '[{"type": "string", "required": true}]'
  params: null
utc_time_created: '2024-05-17 23:15:28.764394'
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/tests/resources/example_mlflow_2.12_langchain_model/metadata/python_env.yaml

```yaml
python: 3.10.12
build_dependencies:
  - pip==22.3.1
  - setuptools==65.6.3
  - wheel==0.38.4
dependencies:
  - -r requirements.txt
```

--------------------------------------------------------------------------------

---[FILE: requirements.txt]---
Location: mlflow-master/tests/resources/example_mlflow_2.12_langchain_model/metadata/requirements.txt

```text
bcrypt==3.2.0
cloudpickle==2.0.0
configparser==5.2.0
cryptography==39.0.1
databricks-feature-engineering==0.2.1
entrypoints==0.4
google-cloud-storage==2.11.0
grpcio-status==1.48.1
langchain==0.1.20
mlflow[gateway]==2.12.2
numpy==1.23.5
packaging==23.2
pandas==1.5.3
protobuf==4.24.0
psutil==5.9.0
pyarrow==8.0.0
pydantic==1.10.6
pyyaml==6.0
requests==2.28.1
tornado==6.1
```

--------------------------------------------------------------------------------

---[FILE: check_conda_env.py]---
Location: mlflow-master/tests/resources/example_project/check_conda_env.py

```python
# Import a dependency in MLflow's setup.py that's in our conda.yaml but not included with MLflow
# by default, verify that we can use it.

import os
import sys

import psutil

import mlflow


def main(expected_env_name):
    actual_conda_env = os.environ.get("CONDA_DEFAULT_ENV", None)
    assert actual_conda_env == expected_env_name, (
        f"Script expected to be run from conda env {expected_env_name} but was actually run "
        f" from env {actual_conda_env}"
    )
    mlflow.log_metric("CPU usage", psutil.cpu_percent())


if __name__ == "__main__":
    main(sys.argv[1])
```

--------------------------------------------------------------------------------

---[FILE: conda.yaml]---
Location: mlflow-master/tests/resources/example_project/conda.yaml

```yaml
# Adding a comment here to distinguish the hash of this conda.yaml from the hashes of existing
# conda.yaml files in the test environment.
name: tutorial
channels:
  - defaults
dependencies:
  - python=3.10
  - pip:
      - -e ../../../
      - psutil
```

--------------------------------------------------------------------------------

---[FILE: greeter.py]---
Location: mlflow-master/tests/resources/example_project/greeter.py

```python
"""
Example program helping verify functionality for passing parameters other than those required in
the MLproject file.
"""

import argparse

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("greeting", help="Greeting to use", type=str)
    parser.add_argument("name", help="Name of person to greet", type=str)
    parser.add_argument("--excitement", help="Excitement level (int) of greeting", type=int)
    args = parser.parse_args()
    greeting = [args.greeting, args.name]
    if args.excitement is not None:
        greeting.append("!" * args.excitement)
    print(" ".join(greeting))  # noqa: T201
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/tests/resources/example_project/MLproject

```text
conda_env: conda.yaml

entry_points:
  main:
    command: "echo 'Main entry point'"
  greeter:
    parameters:
      greeting: {type: string, default: "hi"}
      name: string
    command: "python greeter.py {greeting} {name}"
  line_count:
    parameters:
      path: path
    command: "cat {path} | wc -l"
  download_uri:
    parameters:
      uri: uri
    command: "curl {uri} | wc -l"
  sleep:
    parameters:
      duration: int
    command: "sleep {duration}"
  test_tracking:
    parameters:
      use_start_run: bool
    command: "python tracking_test.py {use_start_run}"
  check_conda_env:
    parameters:
      conda_env_name: string
    command: "python check_conda_env.py {conda_env_name}"
  test_artifact_path:
    parameters:
      model: {type: path}
    command: "echo success"
```

--------------------------------------------------------------------------------

---[FILE: tracking_test.py]---
Location: mlflow-master/tests/resources/example_project/tracking_test.py

```python
import sys

import mlflow


def call_tracking_apis():
    mlflow.log_metric("some_key", 3)


def main(use_start_run):
    if use_start_run:
        with mlflow.start_run():
            call_tracking_apis()
    else:
        call_tracking_apis()


if __name__ == "__main__":
    main(use_start_run=int(sys.argv[1]))
```

--------------------------------------------------------------------------------

---[FILE: conda.yaml]---
Location: mlflow-master/tests/resources/example_virtualenv_conda_project/conda.yaml

```yaml
name: virtualenv-conda
channels:
  - conda-forge
dependencies:
  - python=3.10.19
  - numpy
  - pip
  - pip:
      - mlflow
      - scikit-learn==1.4.2
```

--------------------------------------------------------------------------------

---[FILE: entrypoint.py]---
Location: mlflow-master/tests/resources/example_virtualenv_conda_project/entrypoint.py

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
    assert ".".join(map(str, sys.version_info[:3])) == "3.10.19", sys.version_info
    assert sklearn.__version__ == "1.4.2", sklearn.__version__

X = np.array([[-1, -1], [-2, -1], [1, 1], [2, 1]])
y = np.array([1, 1, 2, 2])

clf = make_pipeline(StandardScaler(), SVC(gamma="auto"))
clf.fit(X, y)

with mlflow.start_run():
    mlflow.sklearn.log_model(clf, name="model")
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/tests/resources/example_virtualenv_conda_project/MLproject

```text
conda_env: conda.yaml
entry_points:
  main:
    command: 'python entrypoint.py'
  test:
    command: 'python entrypoint.py --test'
```

--------------------------------------------------------------------------------

---[FILE: entrypoint.py]---
Location: mlflow-master/tests/resources/example_virtualenv_no_python_env/entrypoint.py

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
    assert ".".join(map(str, sys.version_info[:3])) == "3.10.19", sys.version_info
    assert sklearn.__version__ == "1.4.2", sklearn.__version__

X = np.array([[-1, -1], [-2, -1], [1, 1], [2, 1]])
y = np.array([1, 1, 2, 2])

clf = make_pipeline(StandardScaler(), SVC(gamma="auto"))
clf.fit(X, y)

with mlflow.start_run():
    mlflow.sklearn.log_model(clf, name="model")
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/tests/resources/example_virtualenv_no_python_env/MLproject

```text
name: virtualenv-example
entry_points:
  main:
    command: 'python entrypoint.py'
  test:
    command: 'python entrypoint.py --test'
```

--------------------------------------------------------------------------------

---[FILE: python_env.yaml]---
Location: mlflow-master/tests/resources/example_virtualenv_no_python_env/python_env.yaml

```yaml
python: "3.10.19"
build_dependencies:
  - pip
dependencies:
  - -r requirements.txt
```

--------------------------------------------------------------------------------

---[FILE: requirements.txt]---
Location: mlflow-master/tests/resources/example_virtualenv_no_python_env/requirements.txt

```text
mlflow
scikit-learn==1.4.2
```

--------------------------------------------------------------------------------

---[FILE: entrypoint.py]---
Location: mlflow-master/tests/resources/example_virtualenv_project/entrypoint.py

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
    assert ".".join(map(str, sys.version_info[:3])) == "3.10.19", sys.version_info
    assert sklearn.__version__ == "1.4.2", sklearn.__version__

X = np.array([[-1, -1], [-2, -1], [1, 1], [2, 1]])
y = np.array([1, 1, 2, 2])

clf = make_pipeline(StandardScaler(), SVC(gamma="auto"))
clf.fit(X, y)

with mlflow.start_run():
    mlflow.sklearn.log_model(clf, name="model")
```

--------------------------------------------------------------------------------

---[FILE: MLproject]---
Location: mlflow-master/tests/resources/example_virtualenv_project/MLproject

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
Location: mlflow-master/tests/resources/example_virtualenv_project/python_env.yaml

```yaml
python: "3.10.19"
build_dependencies:
  - pip
dependencies:
  - -r requirements.txt
```

--------------------------------------------------------------------------------

---[FILE: requirements.txt]---
Location: mlflow-master/tests/resources/example_virtualenv_project/requirements.txt

```text
mlflow
scikit-learn==1.4.2
```

--------------------------------------------------------------------------------

````
