---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 328
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 328 of 991)

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

---[FILE: cli.py]---
Location: mlflow-master/mlflow/models/cli.py
Signals: Pydantic

```python
import logging

import click

from mlflow.models import python_api
from mlflow.models.flavor_backend_registry import get_flavor_backend
from mlflow.models.model import update_model_requirements
from mlflow.utils import cli_args
from mlflow.utils import env_manager as _EnvManager

_logger = logging.getLogger(__name__)


@click.group("models")
def commands():
    """
    Deploy MLflow models locally.

    To deploy a model associated with a run on a tracking server, set the MLFLOW_TRACKING_URI
    environment variable to the URL of the desired server.
    """


@commands.command("serve")
@cli_args.MODEL_URI
@cli_args.PORT
@cli_args.HOST
@cli_args.TIMEOUT
@cli_args.MODELS_WORKERS
@cli_args.ENV_MANAGER
@cli_args.NO_CONDA
@cli_args.INSTALL_MLFLOW
@cli_args.ENABLE_MLSERVER
def serve(
    model_uri,
    port,
    host,
    timeout,
    workers,
    env_manager=None,
    no_conda=False,
    install_mlflow=False,
    enable_mlserver=False,
):
    """
    Serve a model saved with MLflow by launching a webserver on the specified host and port.
    The command supports models with the ``python_function`` or ``crate`` (R Function) flavor.
    For information about the input data formats accepted by the webserver, see the following
    documentation: https://www.mlflow.org/docs/latest/models.html#built-in-deployment-tools.

    .. warning::

        Models built using MLflow 1.x will require adjustments to the endpoint request payload
        if executed in an environment that has MLflow 2.x installed. In 1.x, a request payload
        was in the format: ``{'columns': [str], 'data': [[...]]}``. 2.x models require
        payloads that are defined by the structural-defining keys of either ``dataframe_split``,
        ``instances``, ``inputs`` or ``dataframe_records``. See the examples below for
        demonstrations of the changes to the invocation API endpoint in 2.0.

    .. note::

        Requests made in pandas DataFrame structures can be made in either `split` or `records`
        oriented formats.
        See https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_json.html for
        detailed information on orientation formats for converting a pandas DataFrame to json.

    Example:

    .. code-block:: bash

        $ mlflow models serve -m runs:/my-run-id/model-path &

        # records orientation input format for serializing a pandas DataFrame
        $ curl http://127.0.0.1:5000/invocations -H 'Content-Type: application/json' -d '{
            "dataframe_records": [{"a":1, "b":2}, {"a":3, "b":4}, {"a":5, "b":6}]
        }'

        # split orientation input format for serializing a pandas DataFrame
        $ curl http://127.0.0.1:5000/invocations -H 'Content-Type: application/json' -d '{
            "dataframe_split": {"columns": ["a", "b"],
                                "index": [0, 1, 2],
                                "data": [[1, 2], [3, 4], [5, 6]]}
        }'

        # inputs format for List submission of array, tensor, or DataFrame data
        $ curl http://127.0.0.1:5000/invocations -H 'Content-Type: application/json' -d '{
            "inputs": [[1, 2], [3, 4], [5, 6]]
        }'

        # instances format for submission of Tensor data
        curl http://127.0.0.1:5000/invocations -H 'Content-Type: application/json' -d '{
            "instances": [
                {"a": "t1", "b": [1, 2, 3]},
                {"a": "t2", "b": [4, 5, 6]},
                {"a": "t3", "b": [7, 8, 9]}
            ]
        }'

    """
    env_manager = _EnvManager.LOCAL if no_conda else env_manager

    return get_flavor_backend(
        model_uri, env_manager=env_manager, workers=workers, install_mlflow=install_mlflow
    ).serve(
        model_uri=model_uri, port=port, host=host, timeout=timeout, enable_mlserver=enable_mlserver
    )


class KeyValueType(click.ParamType):
    name = "key=value"

    def convert(self, value, param, ctx):
        if "=" not in value:
            self.fail(f"{value!r} is not a valid key value pair, expecting `key=value`", param, ctx)
        return value.split("=", 1)


@commands.command("predict")
@cli_args.MODEL_URI
@click.option(
    "--input-path", "-i", default=None, help="CSV containing pandas DataFrame to predict against."
)
@click.option(
    "--output-path",
    "-o",
    default=None,
    help="File to output results to as json file. If not provided, output to stdout.",
)
@click.option(
    "--content-type",
    "-t",
    default="json",
    help="Content type of the input file. Can be one of {'json', 'csv'}.",
)
@cli_args.ENV_MANAGER
@cli_args.INSTALL_MLFLOW
@click.option(
    "--pip-requirements-override",
    "-r",
    default=None,
    help="Specify packages and versions to override the dependencies defined "
    "in the model. Must be a comma-separated string like x==y,z==a.",
)
@click.option(
    "--env",
    default=None,
    type=KeyValueType(),
    multiple=True,
    help="Extra environment variables to set when running the model. Must be "
    "key value pairs, e.g. `--env key=value`.",
)
def predict(
    model_uri,
    input_data=None,
    input_path=None,
    content_type=python_api._CONTENT_TYPE_JSON,
    output_path=None,
    env_manager=_EnvManager.VIRTUALENV,
    install_mlflow=False,
    pip_requirements_override=None,
    env=None,
):
    """
    Generate predictions in json format using a saved MLflow model. For information about the input
    data formats accepted by this function, see the following documentation:
    https://www.mlflow.org/docs/latest/models.html#built-in-deployment-tools.
    """
    return python_api.predict(
        model_uri=model_uri,
        input_data=input_data,
        input_path=input_path,
        content_type=content_type,
        output_path=output_path,
        env_manager=env_manager,
        install_mlflow=install_mlflow,
        pip_requirements_override=pip_requirements_override,
        extra_envs=dict(env),
    )


@commands.command("prepare-env")
@cli_args.MODEL_URI
@cli_args.ENV_MANAGER
@cli_args.INSTALL_MLFLOW
def prepare_env(
    model_uri,
    env_manager,
    install_mlflow,
):
    """
    Performs any preparation necessary to predict or serve the model, for example
    downloading dependencies or initializing a conda environment. After preparation,
    calling predict or serve should be fast.
    """
    return get_flavor_backend(
        model_uri, env_manager=env_manager, install_mlflow=install_mlflow
    ).prepare_env(model_uri=model_uri)


@commands.command("generate-dockerfile")
@cli_args.MODEL_URI_BUILD_DOCKER
@click.option(
    "--output-directory",
    "-d",
    default="mlflow-dockerfile",
    help="Output directory where the generated Dockerfile is stored.",
)
@cli_args.ENV_MANAGER_DOCKERFILE
@cli_args.MLFLOW_HOME
@cli_args.INSTALL_JAVA
@cli_args.INSTALL_MLFLOW
@cli_args.ENABLE_MLSERVER
def generate_dockerfile(
    model_uri,
    output_directory,
    env_manager,
    mlflow_home,
    install_java,
    install_mlflow,
    enable_mlserver,
):
    """
    Generates a directory with Dockerfile whose default entrypoint serves an MLflow model at port
    8080 using the python_function flavor. The generated Dockerfile is written to the specified
    output directory, along with the model (if specified). This Dockerfile defines an image that
    is equivalent to the one produced by ``mlflow models build-docker``.
    """
    if model_uri:
        _logger.info("Generating Dockerfile for model %s", model_uri)
    else:
        _logger.info("Generating Dockerfile")
    backend = get_flavor_backend(model_uri, docker_build=True, env_manager=env_manager)
    if backend.can_build_image():
        backend.generate_dockerfile(
            model_uri,
            output_directory,
            mlflow_home=mlflow_home,
            install_java=install_java,
            install_mlflow=install_mlflow,
            enable_mlserver=enable_mlserver,
        )
        _logger.info("Generated Dockerfile in directory %s", output_directory)
    else:
        _logger.error(
            "Cannot build docker image for selected backend",
            extra={"backend": backend.__class__.__name__},
        )
        raise NotImplementedError("Cannot build docker image for selected backend")


@commands.command("build-docker")
@cli_args.MODEL_URI_BUILD_DOCKER
@click.option("--name", "-n", default="mlflow-pyfunc-servable", help="Name to use for built image")
@cli_args.ENV_MANAGER
@cli_args.MLFLOW_HOME
@cli_args.INSTALL_JAVA
@cli_args.INSTALL_MLFLOW
@cli_args.ENABLE_MLSERVER
def build_docker(**kwargs):
    """
    Builds a Docker image whose default entrypoint serves an MLflow model at port 8080, using the
    python_function flavor. The container serves the model referenced by ``--model-uri``, if
    specified when ``build-docker`` is called. If ``--model-uri`` is not specified when build_docker
    is called, an MLflow Model directory must be mounted as a volume into the /opt/ml/model
    directory in the container.

    Building a Docker image with ``--model-uri``:

    .. code:: bash

        # Build a Docker image named 'my-image-name' that serves the model from run 'some-run-uuid'
        # at run-relative artifact path 'my-model'
        mlflow models build-docker --model-uri "runs:/some-run-uuid/my-model" --name "my-image-name"
        # Serve the model
        docker run -p 5001:8080 "my-image-name"

    Building a Docker image without ``--model-uri``:

    .. code:: bash

        # Build a generic Docker image named 'my-image-name'
        mlflow models build-docker --name "my-image-name"
        # Mount the model stored in '/local/path/to/artifacts/model' and serve it
        docker run --rm -p 5001:8080 -v /local/path/to/artifacts/model:/opt/ml/model "my-image-name"

    .. important::

        Since MLflow 2.10.1, the Docker image built with ``--model-uri`` does **not install Java**
        for improved performance, unless the model flavor is one of ``["johnsnowlabs", "h2o",
        "spark"]``. If you need to install Java for other flavors, e.g. custom Python model
        that uses SparkML, please specify the ``--install-java`` flag to enforce Java installation.

    NB: by default, the container will start nginx and uvicorn processes. If you don't need the
    nginx process to be started (for instance if you deploy your container to Google Cloud Run),
    you can disable it via the DISABLE_NGINX environment variable:

    .. code:: bash

        docker run -p 5001:8080 -e DISABLE_NGINX=true "my-image-name"

    By default, the number of uvicorn workers is set to CPU count. If you want to set a custom
    number of workers, you can set the MLFLOW_MODELS_WORKERS environment variable:

    .. code:: bash

        docker run -p 5001:8080 -e MLFLOW_MODELS_WORKERS=4 "my-image-name"

    See https://www.mlflow.org/docs/latest/python_api/mlflow.pyfunc.html for more information on the
    'python_function' flavor.
    """
    python_api.build_docker(**kwargs)


@commands.command("update-pip-requirements")
@cli_args.MODEL_URI
@click.argument("operation", type=click.Choice(["add", "remove"]))
@click.argument("requirement_strings", type=str, nargs=-1)
def update_pip_requirements(model_uri, operation, requirement_strings):
    """
    Add or remove requirements from a model's conda.yaml and requirements.txt files.
    If using a remote tracking server, please make sure to set the MLFLOW_TRACKING_URI
    environment variable to the URL of the desired server.

    REQUIREMENT_STRINGS is a list of pip requirements specifiers.
    See below for examples.

    Sample usage:

    .. code::

        # Add requirements using the model's "runs:/" URI

        mlflow models update-pip-requirements -m runs:/<run_id>/<model_path> \\
            add "pandas==1.0.0" "scikit-learn" "mlflow >= 2.8, != 2.9.0"

        # Remove requirements from a local model

        mlflow models update-pip-requirements -m /path/to/local/model \\
            remove "torchvision" "pydantic"

    Note that model registry URIs (i.e. URIs in the form ``models:/``) are not
    supported, as artifacts in the model registry are intended to be read-only.
    Editing requirements is read-only artifact repositories is also not supported.

    If adding requirements, the function will overwrite any existing requirements
    that overlap, or else append the new requirements to the existing list.

    If removing requirements, the function will ignore any version specifiers,
    and remove all the specified package names. Any requirements that are not
    found in the existing files will be ignored.
    """
    update_model_requirements(model_uri, operation, requirement_strings)

    _logger.info(f"Successfully updated the requirements for the model at {model_uri}!")
```

--------------------------------------------------------------------------------

---[FILE: dependencies_schemas.py]---
Location: mlflow-master/mlflow/models/dependencies_schemas.py

```python
import json
import logging
import warnings
from abc import ABC, abstractmethod
from contextlib import contextmanager
from dataclasses import dataclass, field
from enum import Enum
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from mlflow.models.model import Model

_logger = logging.getLogger(__name__)


class DependenciesSchemasType(Enum):
    """
    Enum to define the different types of dependencies schemas for the model.
    """

    RETRIEVERS = "retrievers"


def set_retriever_schema(
    *,
    primary_key: str,
    text_column: str,
    doc_uri: str | None = None,
    other_columns: list[str] | None = None,
    name: str | None = "retriever",
):
    """
    Specify the return schema of a retriever span within your agent or generative AI app code.

    .. deprecated:: 3.3.2
        This function is deprecated and will be removed in a future version.

    **Note**: MLflow recommends that your retriever return the default MLflow retriever output
    schema described in https://mlflow.org/docs/latest/genai/data-model/traces/#retriever-spans,
    in which case you do not need to call `set_retriever_schema`. APIs that read MLflow traces
    and look for retriever spans, such as MLflow evaluation, will automatically detect retriever
    spans that match MLflow's default retriever schema.

    If your retriever does not return the default MLflow retriever output schema, call this API to
    specify which fields in each retrieved document correspond to the page content, document
    URI, document ID, etc. This enables downstream features like MLflow evaluation to properly
    identify these fields. Note that `set_retriever_schema` assumes that your retriever span
    returns a list of objects.


    Args:
        primary_key: The primary key of the retriever or vector index.
        text_column: The name of the text column to use for the embeddings.
        doc_uri: The name of the column that contains the document URI.
        other_columns: A list of other columns that are part of the vector index
                          that need to be retrieved during trace logging.
        name: The name of the retriever tool or vector store index.

    .. code-block:: Python
            :caption: Example

            from mlflow.models import set_retriever_schema

            # The following call sets the schema for a custom retriever that retrieves content from
            # MLflow documentation, with an output schema like:
            # [
            #     {
            #         'document_id': '9a8292da3a9d4005a988bf0bfdd0024c',
            #         'chunk_text': 'MLflow is an open-source platform, purpose-built to assist...',
            #         'doc_uri': 'https://mlflow.org/docs/latest/index.html',
            #         'title': 'MLflow: A Tool for Managing the Machine Learning Lifecycle'
            #     },
            #     {
            #         'document_id': '7537fe93c97f4fdb9867412e9c1f9e5b',
            #         'chunk_text': 'A great way to get started with MLflow is...',
            #         'doc_uri': 'https://mlflow.org/docs/latest/getting-started/',
            #         'title': 'Getting Started with MLflow'
            #     },
            # ...
            # ]
            set_retriever_schema(
                primary_key="chunk_id",
                text_column="chunk_text",
                doc_uri="doc_uri",
                other_columns=["title"],
                name="my_custom_retriever",
            )
    """
    warnings.warn(
        "set_retriever_schema is deprecated and will be removed in a future version. "
        "Please migrate to use VectorSearchRetrieverTool in the 'databricks-ai-bridge' package, "
        "or match the default schema so your retriever spans can be detected without requiring "
        "explicit configuration. See "
        "https://mlflow.org/docs/latest/genai/data-model/traces/#retriever-spans "
        "for more information.",
        category=FutureWarning,
        stacklevel=2,
    )

    retriever_schemas = globals().get(DependenciesSchemasType.RETRIEVERS.value, [])

    # Check if a retriever schema with the same name already exists
    existing_schema = next((schema for schema in retriever_schemas if schema["name"] == name), None)

    if existing_schema is not None:
        # Compare all relevant fields
        if (
            existing_schema["primary_key"] == primary_key
            and existing_schema["text_column"] == text_column
            and existing_schema["doc_uri"] == doc_uri
            and existing_schema["other_columns"] == (other_columns or [])
        ):
            # No difference, no need to warn or update
            return
        else:
            # Differences found, issue a warning
            _logger.warning(
                f"A retriever schema with the name '{name}' already exists. "
                "Overriding the existing schema."
            )
            # Override the fields of the existing schema
            existing_schema["primary_key"] = primary_key
            existing_schema["text_column"] = text_column
            existing_schema["doc_uri"] = doc_uri
            existing_schema["other_columns"] = other_columns or []
    else:
        retriever_schemas.append(
            {
                "primary_key": primary_key,
                "text_column": text_column,
                "doc_uri": doc_uri,
                "other_columns": other_columns or [],
                "name": name,
            }
        )

    globals()[DependenciesSchemasType.RETRIEVERS.value] = retriever_schemas


def _get_retriever_schema():
    """
    Get the vector search schema defined by the user.

    Returns:
        VectorSearchIndex: The vector search index schema.
    """
    retriever_schemas = globals().get(DependenciesSchemasType.RETRIEVERS.value, [])
    if not retriever_schemas:
        return []

    return [
        RetrieverSchema(
            name=retriever.get("name"),
            primary_key=retriever.get("primary_key"),
            text_column=retriever.get("text_column"),
            doc_uri=retriever.get("doc_uri"),
            other_columns=retriever.get("other_columns"),
        )
        for retriever in retriever_schemas
    ]


def _clear_retriever_schema():
    """
    Clear the vector search schema defined by the user.
    """
    globals().pop(DependenciesSchemasType.RETRIEVERS.value, None)


def _clear_dependencies_schemas():
    """
    Clear all the dependencies schema defined by the user.
    """
    # Clear the vector search schema
    _clear_retriever_schema()


@contextmanager
def _get_dependencies_schemas():
    dependencies_schemas = DependenciesSchemas(retriever_schemas=_get_retriever_schema())
    try:
        yield dependencies_schemas
    finally:
        _clear_dependencies_schemas()


def _get_dependencies_schema_from_model(model: "Model") -> dict[str, Any] | None:
    """
    Get the dependencies schema from the logged model metadata.

    `dependencies_schemas` is a dictionary that defines the dependencies schemas, such as
    the retriever schemas. This code is now only useful for Databricks integration.
    """
    if model.metadata and "dependencies_schemas" in model.metadata:
        dependencies_schemas = model.metadata["dependencies_schemas"]
        return {
            "dependencies_schemas": {
                dependency: json.dumps(schema)
                for dependency, schema in dependencies_schemas.items()
            }
        }
    return None


@dataclass
class Schema(ABC):
    """
    Base class for defining the resources needed to serve a model.

    Args:
        type (ResourceType): The type of the schema.
    """

    type: DependenciesSchemasType

    @abstractmethod
    def to_dict(self):
        """
        Convert the resource to a dictionary.
        Subclasses must implement this method.
        """

    @classmethod
    @abstractmethod
    def from_dict(cls, data: dict[str, str]):
        """
        Convert the dictionary to a Resource.
        Subclasses must implement this method.
        """


@dataclass
class RetrieverSchema(Schema):
    """
    Define vector search index resource to serve a model.

    Args:
        name (str): The name of the vector search index schema.
        primary_key (str): The primary key for the index.
        text_column (str): The main text column for the index.
        doc_uri (Optional[str]): The document URI for the index.
        other_columns (Optional[List[str]]): Additional columns in the index.
    """

    def __init__(
        self,
        name: str,
        primary_key: str,
        text_column: str,
        doc_uri: str | None = None,
        other_columns: list[str] | None = None,
    ):
        super().__init__(type=DependenciesSchemasType.RETRIEVERS)
        self.name = name
        self.primary_key = primary_key
        self.text_column = text_column
        self.doc_uri = doc_uri
        self.other_columns = other_columns or []

    def to_dict(self):
        return {
            self.type.value: [
                {
                    "name": self.name,
                    "primary_key": self.primary_key,
                    "text_column": self.text_column,
                    "doc_uri": self.doc_uri,
                    "other_columns": self.other_columns,
                }
            ]
        }

    @classmethod
    def from_dict(cls, data: dict[str, str]):
        return cls(
            name=data["name"],
            primary_key=data["primary_key"],
            text_column=data["text_column"],
            doc_uri=data.get("doc_uri"),
            other_columns=data.get("other_columns", []),
        )


@dataclass
class DependenciesSchemas:
    retriever_schemas: list[RetrieverSchema] = field(default_factory=list)

    def to_dict(self) -> dict[str, dict[DependenciesSchemasType, list[dict[str, Any]]]]:
        if not self.retriever_schemas:
            return None

        return {
            "dependencies_schemas": {
                DependenciesSchemasType.RETRIEVERS.value: [
                    index.to_dict()[DependenciesSchemasType.RETRIEVERS.value][0]
                    for index in self.retriever_schemas
                ],
            }
        }
```

--------------------------------------------------------------------------------

---[FILE: display_utils.py]---
Location: mlflow-master/mlflow/models/display_utils.py

```python
import html
from pathlib import Path

from mlflow.models.model import ModelInfo
from mlflow.models.signature import ModelSignature
from mlflow.types import schema
from mlflow.utils import databricks_utils


def _is_input_string(inputs: schema.Schema) -> bool:
    return (
        not inputs.has_input_names()
        and len(inputs.input_types()) == 1
        and inputs.input_types()[0] == schema.DataType.string
    )


def _is_input_agent_compatible(inputs: schema.Schema) -> bool:
    if _is_input_string(inputs):
        return True
    if not inputs.has_input_names():
        return False
    messages = inputs.input_dict().get("messages")
    if not messages:
        return False
    if not isinstance(messages.type, schema.Array):
        return False
    items = messages.type.dtype
    if not isinstance(items, schema.Object):
        return False
    properties = items.properties
    content = next(filter(lambda prop: prop.name == "content", properties), None)
    role = next(filter(lambda prop: prop.name == "role", properties), None)
    return (
        content
        and content.dtype == schema.DataType.string
        and role
        and role.dtype == schema.DataType.string
    )


def _is_output_string_response(outputs: schema.Schema) -> bool:
    if not outputs.has_input_names():
        return False
    content = outputs.input_dict().get("content")
    if not content:
        return False
    return content.type == schema.DataType.string


def _is_output_string(outputs: schema.Schema) -> bool:
    return (
        not outputs.has_input_names()
        and len(outputs.input_types()) == 1
        and outputs.input_types()[0] == schema.DataType.string
    )


def _is_output_chat_completion_response(outputs: schema.Schema) -> bool:
    if not outputs.has_input_names():
        return False
    choices = outputs.input_dict().get("choices")
    if not choices:
        return False
    if not isinstance(choices.type, schema.Array):
        return False
    items = choices.type.dtype
    if not isinstance(items, schema.Object):
        return False
    properties = items.properties
    message = next(filter(lambda prop: prop.name == "message", properties), None)
    if not message:
        return False
    if not isinstance(message.dtype, schema.Object):
        return False
    message_properties = message.dtype.properties
    content = next(filter(lambda prop: prop.name == "content", message_properties), None)
    role = next(filter(lambda prop: prop.name == "role", message_properties), None)
    return (
        content
        and content.dtype == schema.DataType.string
        and role
        and role.dtype == schema.DataType.string
    )


def _is_output_agent_compatible(outputs: schema.Schema) -> bool:
    return (
        _is_output_string_response(outputs)
        or _is_output_string(outputs)
        or _is_output_chat_completion_response(outputs)
    )


def _is_signature_agent_compatible(signature: ModelSignature) -> bool:
    """Determines whether the given signature is compatible with the agent eval schema.

    See https://docs.databricks.com/en/generative-ai/agent-evaluation/evaluation-schema.html.
    The schema accepts the OpenAI spec, as well as simpler formats such as vanilla string response
    and `StringResponse`.
    """
    return _is_input_agent_compatible(signature.inputs) and _is_output_agent_compatible(
        signature.outputs
    )


def _should_render_agent_eval_template(signature: ModelSignature) -> bool:
    if not databricks_utils.is_in_databricks_runtime():
        return False
    from IPython import get_ipython

    if get_ipython() is None:
        return False
    return _is_signature_agent_compatible(signature)


def _generate_agent_eval_recipe(model_uri: str) -> str:
    resources_dir = Path(__file__).parent / "notebook_resources"
    pip_install_command = """%pip install -U databricks-agents
dbutils.library.restartPython()
## Run the above in a separate cell ##"""
    eval_with_synthetic_code = (
        (resources_dir / "eval_with_synthetic_example.py")
        .read_text()
        .replace("{{pipInstall}}", pip_install_command)
        .replace("{{modelUri}}", model_uri)
    )
    eval_with_dataset_code = (
        (resources_dir / "eval_with_dataset_example.py")
        .read_text()
        .replace("{{pipInstall}}", pip_install_command)
        .replace("{{modelUri}}", model_uri)
    )

    # Remove the ruff noqa comments.
    ruff_line = "# ruff: noqa: F821, I001\n"
    eval_with_synthetic_code = eval_with_synthetic_code.replace(ruff_line, "")
    eval_with_dataset_code = eval_with_dataset_code.replace(ruff_line, "")

    return (
        (resources_dir / "agent_evaluation_template.html")
        .read_text()
        .replace("{{eval_with_synthetic_code}}", html.escape(eval_with_synthetic_code))
        .replace("{{eval_with_dataset_code}}", html.escape(eval_with_dataset_code))
    )


def maybe_render_agent_eval_recipe(model_info: ModelInfo) -> None:
    # For safety, we wrap in try/catch to make sure we don't break `mlflow.*.log_model`.
    try:
        if not _should_render_agent_eval_template(model_info.signature):
            return

        from IPython.display import HTML, display

        display(HTML(_generate_agent_eval_recipe(model_info.model_uri)))
    except Exception:
        pass
```

--------------------------------------------------------------------------------

---[FILE: docker_utils.py]---
Location: mlflow-master/mlflow/models/docker_utils.py

```python
import logging
import os
from subprocess import Popen
from typing import Literal
from urllib.parse import urlparse

from mlflow.environment_variables import MLFLOW_DOCKER_OPENJDK_VERSION
from mlflow.utils import env_manager as em
from mlflow.utils.file_utils import _copy_project
from mlflow.version import VERSION

_logger = logging.getLogger(__name__)

UBUNTU_BASE_IMAGE = "ubuntu:22.04"
PYTHON_SLIM_BASE_IMAGE = "python:{version}-slim"


SETUP_PYENV_AND_VIRTUALENV = r"""# Setup pyenv
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
"""  # noqa: E501

_DOCKERFILE_TEMPLATE = """# Build an image that can serve mlflow models.
FROM {base_image}

{setup_python_venv}

{setup_java}

WORKDIR /opt/mlflow

{install_mlflow}

{install_model_and_deps}

ENV MLFLOW_DISABLE_ENV_CREATION={disable_env_creation}
ENV ENABLE_MLSERVER={enable_mlserver}

# granting read/write access and conditional execution authority to all child directories
# and files to allow for deployment to AWS Sagemaker Serverless Endpoints
# (see https://docs.aws.amazon.com/sagemaker/latest/dg/serverless-endpoints.html)
RUN chmod o+rwX /opt/mlflow/

# clean up apt cache to reduce image size
RUN rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["python", "-c", "{entrypoint}"]
"""


SETUP_MINICONDA = """# Setup miniconda
RUN curl --fail -L https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh > miniconda.sh
RUN bash ./miniconda.sh -b -p /miniconda && rm ./miniconda.sh
ENV PATH="/miniconda/bin:$PATH"
# Remove default channels to avoid `CondaToSNonInteractiveError`.
# See https://github.com/mlflow/mlflow/pull/16752 for more details.
RUN conda config --system --remove channels defaults && conda config --system --add channels conda-forge
"""  # noqa: E501


def generate_dockerfile(
    output_dir: str,
    base_image: str,
    model_install_steps: str | None,
    entrypoint: str,
    env_manager: Literal["conda", "local", "virtualenv"] = em.CONDA,
    mlflow_home: str | None = None,
    enable_mlserver: bool = False,
    disable_env_creation_at_runtime: bool = True,
    install_java: bool | None = None,
):
    """
    Generates a Dockerfile that can be used to build a docker image, that serves ML model
    stored and tracked in MLflow.
    """

    setup_java_steps = ""
    setup_python_venv_steps = ""
    install_mlflow_steps = _pip_mlflow_install_step(output_dir, mlflow_home)

    if base_image.startswith("python:"):
        if install_java:
            _logger.warning(
                "`install_java` option is not supported when using python base image, "
                "switch to UBUNTU_BASE_IMAGE to enable java installation."
            )
        setup_python_venv_steps = (
            "RUN apt-get -y update && apt-get install -y --no-install-recommends nginx"
        )

    elif base_image == UBUNTU_BASE_IMAGE:
        setup_python_venv_steps = (
            "RUN apt-get -y update && DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt-get install -y "
            "--no-install-recommends wget curl nginx ca-certificates bzip2 build-essential cmake "
            "git-core\n\n"
        )
        setup_python_venv_steps += (
            SETUP_MINICONDA if env_manager == em.CONDA else SETUP_PYENV_AND_VIRTUALENV
        )
        if install_java is not False:
            jdk_ver = MLFLOW_DOCKER_OPENJDK_VERSION.get()
            setup_java_steps = (
                "# Setup Java\n"
                f"RUN apt-get install -y --no-install-recommends openjdk-{jdk_ver}-jdk maven\n"
                f"ENV JAVA_HOME=/usr/lib/jvm/java-{jdk_ver}-openjdk-amd64"
            )

    with open(os.path.join(output_dir, "Dockerfile"), "w") as f:
        f.write(
            _DOCKERFILE_TEMPLATE.format(
                base_image=base_image,
                setup_python_venv=setup_python_venv_steps,
                setup_java=setup_java_steps,
                install_mlflow=install_mlflow_steps,
                install_model_and_deps=model_install_steps,
                entrypoint=entrypoint,
                enable_mlserver=enable_mlserver,
                disable_env_creation=disable_env_creation_at_runtime,
            )
        )


def _get_maven_proxy():
    http_proxy = os.getenv("http_proxy")
    https_proxy = os.getenv("https_proxy")
    if not http_proxy or not https_proxy:
        return ""

    # Expects proxies as either PROTOCOL://{USER}:{PASSWORD}@HOSTNAME:PORT
    # or PROTOCOL://HOSTNAME:PORT
    parsed_http_proxy = urlparse(http_proxy)
    assert parsed_http_proxy.hostname is not None, "Invalid `http_proxy` hostname."
    assert parsed_http_proxy.port is not None, f"Invalid proxy port: {parsed_http_proxy.port}"

    parsed_https_proxy = urlparse(https_proxy)
    assert parsed_https_proxy.hostname is not None, "Invalid `https_proxy` hostname."
    assert parsed_https_proxy.port is not None, f"Invalid proxy port: {parsed_https_proxy.port}"

    maven_proxy_options = (
        "-DproxySet=true",
        f"-Dhttp.proxyHost={parsed_http_proxy.hostname}",
        f"-Dhttp.proxyPort={parsed_http_proxy.port}",
        f"-Dhttps.proxyHost={parsed_https_proxy.hostname}",
        f"-Dhttps.proxyPort={parsed_https_proxy.port}",
        "-Dhttps.nonProxyHosts=repo.maven.apache.org",
    )

    if parsed_http_proxy.username is None or parsed_http_proxy.password is None:
        return " ".join(maven_proxy_options)

    return " ".join(
        (
            *maven_proxy_options,
            f"-Dhttp.proxyUser={parsed_http_proxy.username}",
            f"-Dhttp.proxyPassword={parsed_http_proxy.password}",
        )
    )


def _pip_mlflow_install_step(dockerfile_context_dir, mlflow_home):
    """
    Get docker build commands for installing MLflow given a Docker context dir and optional source
    directory
    """
    if mlflow_home:
        mlflow_dir = _copy_project(
            src_path=os.path.abspath(mlflow_home), dst_path=dockerfile_context_dir
        )
        return (
            "# Install MLflow from local source\n"
            f"COPY {mlflow_dir} /opt/mlflow\n"
            "RUN pip install /opt/mlflow"
        )
    else:
        return f"# Install MLflow\nRUN pip install mlflow=={VERSION}"


def build_image_from_context(context_dir: str, image_name: str):
    import docker

    client = docker.from_env()
    # In Docker < 19, `docker build` doesn't support the `--platform` option
    is_platform_supported = int(client.version()["Version"].split(".")[0]) >= 19
    # Enforcing the AMD64 architecture build for Apple M1 users
    platform_option = ["--platform", "linux/amd64"] if is_platform_supported else []
    commands = [
        "docker",
        "build",
        "-t",
        image_name,
        "-f",
        "Dockerfile",
        *platform_option,
        ".",
    ]
    proc = Popen(commands, cwd=context_dir)
    if proc.wait():
        raise RuntimeError("Docker build failed.")
```

--------------------------------------------------------------------------------

---[FILE: flavor_backend.py]---
Location: mlflow-master/mlflow/models/flavor_backend.py

```python
from abc import ABCMeta, abstractmethod

from mlflow.utils.annotations import developer_stable


@developer_stable
class FlavorBackend:
    """
    Abstract class for Flavor Backend.
    This class defines the API interface for local model deployment of MLflow model flavors.
    """

    __metaclass__ = ABCMeta

    def __init__(self, config, **kwargs):
        self._config = config

    @abstractmethod
    def predict(self, model_uri, input_path, output_path, content_type):
        """
        Generate predictions using a saved MLflow model referenced by the given URI.
        Input and output are read from and written to a file or stdin / stdout.

        Args:
            model_uri: URI pointing to the MLflow model to be used for scoring.
            input_path: Path to the file with input data. If not specified, data is read from
                        stdin.
            output_path: Path to the file with output predictions. If not specified, data is
                         written to stdout.
            content_type: Specifies the input format. Can be one of {``json``, ``csv``}
        """

    @abstractmethod
    def serve(
        self,
        model_uri,
        port,
        host,
        timeout,
        enable_mlserver,
        synchronous=True,
        stdout=None,
        stderr=None,
    ):
        """
        Serve the specified MLflow model locally.

        Args:
            model_uri: URI pointing to the MLflow model to be used for scoring.
            port: Port to use for the model deployment.
            host: Host to use for the model deployment. Defaults to ``localhost``.
            timeout: Timeout in seconds to serve a request. Defaults to 60.
            enable_mlserver: Whether to use MLServer or the local scoring server.
            synchronous: If True, wait until server process exit and return 0, if process exit
                with non-zero return code, raise exception.
                If False, return the server process `Popen` instance immediately.
            stdout: Redirect server stdout
            stderr: Redirect server stderr
        """

    def prepare_env(self, model_uri, capture_output=False):
        """
        Performs any preparation necessary to predict or serve the model, for example
        downloading dependencies or initializing a conda environment. After preparation,
        calling predict or serve should be fast.
        """

    @abstractmethod
    def build_image(
        self,
        model_uri,
        image_name,
        install_java=False,
        install_mlflow=False,
        mlflow_home=None,
        enable_mlserver=False,
        base_image=None,
    ): ...

    @abstractmethod
    def generate_dockerfile(
        self,
        model_uri,
        output_dir,
        install_java=False,
        install_mlflow=False,
        mlflow_home=None,
        enable_mlserver=False,
        base_image=None,
    ): ...

    @abstractmethod
    def can_score_model(self):
        """
        Check whether this flavor backend can be deployed in the current environment.

        Returns:
            True if this flavor backend can be applied in the current environment.
        """

    def can_build_image(self):
        """
        Returns:
            True if this flavor has a `build_image` method defined for building a docker
            container capable of serving the model, False otherwise.
        """
        return callable(getattr(self.__class__, "build_image", None))
```

--------------------------------------------------------------------------------

````
