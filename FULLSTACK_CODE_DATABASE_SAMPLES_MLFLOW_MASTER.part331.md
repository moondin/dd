---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 331
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 331 of 991)

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

---[FILE: model_config.py]---
Location: mlflow-master/mlflow/models/model_config.py

```python
import os
from typing import Any

import yaml

from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE

__mlflow_model_config__ = None


class ModelConfig:
    """
    ModelConfig used in code to read a YAML configuration file or a dictionary.

    Args:
        development_config: Path to the YAML configuration file or a dictionary containing the
                        configuration. If the configuration is not provided, an error is raised

    .. code-block:: python
        :caption: Example usage in model code

        from mlflow.models import ModelConfig

        # Load the configuration from a dictionary
        config = ModelConfig(development_config={"key1": "value1"})
        print(config.get("key1"))


    .. code-block:: yaml
        :caption: yaml file for model configuration

        key1: value1
        another_key:
            - value2
            - value3

    .. code-block:: python
        :caption: Example yaml usage in model code

        from mlflow.models import ModelConfig

        # Load the configuration from a file
        config = ModelConfig(development_config="config.yaml")
        print(config.get("key1"))


    When invoking the ModelConfig locally in a model file, development_config can be passed in
    which would be used as configuration for the model.


    .. code-block:: python
        :caption: Example to use ModelConfig when logging model as code: agent.py

        import mlflow
        from mlflow.models import ModelConfig

        config = ModelConfig(development_config={"key1": "value1"})


        class TestModel(mlflow.pyfunc.PythonModel):
            def predict(self, context, model_input, params=None):
                return config.get("key1")


        mlflow.models.set_model(TestModel())


    But this development_config configuration file will be overridden when logging a model.
    When no model_config is passed in while logging the model, an error will be raised when
    trying to load the model using ModelConfig.
    Note: development_config is not used when logging the model.


    .. code-block:: python
        :caption: Example to use agent.py to log the model: deploy.py

        model_config = {"key1": "value2"}
        with mlflow.start_run():
            model_info = mlflow.pyfunc.log_model(
                name="model", python_model="agent.py", model_config=model_config
            )

        loaded_model = mlflow.pyfunc.load_model(model_info.model_uri)

        # This will print "value2" as the model_config passed in while logging the model
        print(loaded_model.predict(None))
    """

    def __init__(self, *, development_config: str | dict[str, Any] | None = None):
        config = globals().get("__mlflow_model_config__", None)
        # Here mlflow_model_config have 3 states:
        # 1. None, this means if the mlflow_model_config is None, use development_config if
        # available
        # 2. "", Empty string, this means the users explicitly didn't set the model config
        # while logging the model so if ModelConfig is used, it should throw an error
        # 3. A valid path, this means the users have set the model config while logging the
        # model so use that path
        if config is not None:
            self.config = config
        else:
            self.config = development_config

        if not self.config:
            raise FileNotFoundError(
                "Config file is not provided which is needed to load the model. "
                "Please provide a valid path."
            )

        if not isinstance(self.config, dict) and not os.path.isfile(self.config):
            raise FileNotFoundError(f"Config file '{self.config}' not found.")

    def _read_config(self):
        """Reads the YAML configuration file and returns its contents.

        Raises:
            FileNotFoundError: If the configuration file does not exist.
            yaml.YAMLError: If there is an error parsing the YAML content.

        Returns:
            dict or None: The content of the YAML file as a dictionary, or None if the
            config path is not set.
        """
        if isinstance(self.config, dict):
            return self.config

        with open(self.config) as file:
            try:
                return yaml.safe_load(file)
            except yaml.YAMLError as e:
                raise MlflowException(
                    f"Error parsing YAML file: {e}", error_code=INVALID_PARAMETER_VALUE
                )

    def to_dict(self):
        """Returns the configuration as a dictionary."""
        return self._read_config()

    def get(self, key):
        """Gets the value of a top-level parameter in the configuration."""
        config_data = self._read_config()

        if config_data and key in config_data:
            return config_data[key]
        else:
            raise KeyError(f"Key '{key}' not found in configuration: {config_data}.")


def _set_model_config(model_config):
    globals()["__mlflow_model_config__"] = model_config
```

--------------------------------------------------------------------------------

---[FILE: python_api.py]---
Location: mlflow-master/mlflow/models/python_api.py

```python
import logging
import os
import shutil
from io import StringIO
from typing import ForwardRef, get_args, get_origin

from mlflow.exceptions import MlflowException
from mlflow.models.flavor_backend_registry import get_flavor_backend
from mlflow.utils import env_manager as _EnvManager
from mlflow.utils.databricks_utils import is_databricks_connect
from mlflow.utils.file_utils import TempDir

_logger = logging.getLogger(__name__)
UV_INSTALLATION_INSTRUCTIONS = (
    "Run `pip install uv` to install uv. See "
    "https://docs.astral.sh/uv/getting-started/installation for other installation methods."
)


def build_docker(
    model_uri=None,
    name="mlflow-pyfunc",
    env_manager=_EnvManager.VIRTUALENV,
    mlflow_home=None,
    install_java=False,
    install_mlflow=False,
    enable_mlserver=False,
    base_image=None,
):
    """
    Builds a Docker image whose default entrypoint serves an MLflow model at port 8080, using the
    python_function flavor. The container serves the model referenced by ``model_uri``, if
    specified. If ``model_uri`` is not specified, an MLflow Model directory must be mounted as a
    volume into the /opt/ml/model directory in the container.

    .. important::

        Since MLflow 2.10.1, the Docker image built with ``--model-uri`` does **not install Java**
        for improved performance, unless the model flavor is one of ``["johnsnowlabs", "h2o"
        "spark"]``. If you need to install Java for other flavors, e.g. custom Python model
        that uses SparkML, please specify ``install-java=True`` to enforce Java installation.
        For earlier versions, Java is always installed to the image.


    .. warning::

        If ``model_uri`` is unspecified, the resulting image doesn't support serving models with
        the RFunc server.

    NB: by default, the container will start nginx and uvicorn processes. If you don't need the
    nginx process to be started (for instance if you deploy your container to Google Cloud Run),
    you can disable it via the DISABLE_NGINX environment variable:

    .. code:: bash

        docker run -p 5001:8080 -e DISABLE_NGINX=true "my-image-name"

    See https://www.mlflow.org/docs/latest/python_api/mlflow.pyfunc.html for more information on the
    'python_function' flavor.

    Args:
        model_uri: URI to the model. A local path, a 'runs:/' URI, or a remote storage URI (e.g.,
            an 's3://' URI). For more information about supported remote URIs for model artifacts,
            see https://mlflow.org/docs/latest/tracking.html#artifact-stores
        name: Name of the Docker image to build. Defaults to 'mlflow-pyfunc'.
        env_manager: If specified, create an environment for MLmodel using the specified environment
            manager. The following values are supported: (1) virtualenv (default): use virtualenv
            and pyenv for Python version management (2) conda: use conda (3) local: use the local
            environment without creating a new one.
        mlflow_home: Path to local clone of MLflow project. Use for development only.
        install_java: If specified, install Java in the image. Default is False in order to
            reduce both the image size and the build time. Model flavors requiring Java will enable
            this setting automatically, such as the Spark flavor. (This argument is only available
            in MLflow 2.10.1 and later. In earlier versions, Java is always installed to the image.)
        install_mlflow: If specified and there is a conda or virtualenv environment to be activated
            mlflow will be installed into the environment after it has been activated.
            The version of installed mlflow will be the same as the one used to invoke this command.
        enable_mlserver: If specified, the image will be built with the Seldon MLserver as backend.
        base_image: Base image for the Docker image. If not specified, the default image is either
            UBUNTU_BASE_IMAGE = "ubuntu:22.04" or PYTHON_SLIM_BASE_IMAGE = "python:{version}-slim"
            Note: If custom image is used, there are no guarantees that the image will work. You
            may find greater compatibility by building your image on top of the ubuntu images. In
            addition, you must install Java and virtualenv to have the image work properly.
    """
    get_flavor_backend(model_uri, docker_build=True, env_manager=env_manager).build_image(
        model_uri,
        name,
        mlflow_home=mlflow_home,
        install_java=install_java,
        install_mlflow=install_mlflow,
        enable_mlserver=enable_mlserver,
        base_image=base_image,
    )


_CONTENT_TYPE_CSV = "csv"
_CONTENT_TYPE_JSON = "json"


def predict(
    model_uri,
    input_data=None,
    input_path=None,
    content_type=_CONTENT_TYPE_JSON,
    output_path=None,
    env_manager=_EnvManager.VIRTUALENV,
    install_mlflow=False,
    pip_requirements_override=None,
    extra_envs=None,
    # TODO: add an option to force recreating the env
):
    """
    Generate predictions in json format using a saved MLflow model. For information about the input
    data formats accepted by this function, see the following documentation:
    https://www.mlflow.org/docs/latest/models.html#built-in-deployment-tools.

    .. note::

        To increase verbosity for debugging purposes (in order to inspect the full dependency
        resolver operations when processing transient dependencies), consider setting the following
        environment variables:

        .. code-block:: bash

            # For virtualenv
            export PIP_VERBOSE=1

            # For uv
            export RUST_LOG=uv=debug

        See also:

        - https://pip.pypa.io/en/stable/topics/configuration/#environment-variables
        - https://docs.astral.sh/uv/configuration/environment

    Args:
        model_uri: URI to the model. A local path, a local or remote URI e.g. runs:/, s3://.
        input_data: Input data for prediction. Must be valid input for the PyFunc model. Refer
            to the :py:func:`mlflow.pyfunc.PyFuncModel.predict()` for the supported input types.

            .. note::
                If this API fails due to errors in input_data, use
                `mlflow.models.convert_input_example_to_serving_input` to manually validate
                your input data.
        input_path: Path to a file containing input data. If provided, 'input_data' must be None.
        content_type: Content type of the input data. Can be one of {'json', 'csv'}.
        output_path: File to output results to as json. If not provided, output to stdout.
        env_manager: Specify a way to create an environment for MLmodel inference:

            - "virtualenv" (default): use virtualenv (and pyenv for Python version management)
            - "uv": use uv
            - "local": use the local environment
            - "conda": use conda

        install_mlflow: If specified and there is a conda or virtualenv environment to be activated
            mlflow will be installed into the environment after it has been activated. The version
            of installed mlflow will be the same as the one used to invoke this command.
        pip_requirements_override: If specified, install the specified python dependencies to the
            model inference environment. This is particularly useful when you want to add extra
            dependencies or try different versions of the dependencies defined in the logged model.

            .. tip::
                After validating the pip requirements override works as expected, you can update
                the logged model's dependency using `mlflow.models.update_model_requirements` API
                without re-logging it. Note that a registered model is immutable, so you need to
                register a new model version with the updated model.
        extra_envs: If specified, a dictionary of extra environment variables will be passed to the
            model inference environment. This is useful for testing what environment variables are
            needed for the model to run correctly. By default, environment variables existing in the
            current os.environ are passed, and this parameter can be used to override them.

            .. note::
                If your model dependencies include pre-release versions such as `mlflow==3.2.0rc0`
                and you are using `uv` as the environment manager, set `UV_PRERELEASE` environment
                variable to "allow" in `extra_envs` to allow installing pre-release versions.
                e.g. `extra_envs={"UV_PRERELEASE": "allow"}`.

            .. note::
                This parameter is only supported when `env_manager` is set to "virtualenv",
                "conda" or "uv".

    Code example:

    .. code-block:: python

        import mlflow

        run_id = "..."

        mlflow.models.predict(
            model_uri=f"runs:/{run_id}/model",
            input_data={"x": 1, "y": 2},
            content_type="json",
        )

        # Run prediction with "uv" as the environment manager
        mlflow.models.predict(
            model_uri=f"runs:/{run_id}/model",
            input_data={"x": 1, "y": 2},
            env_manager="uv",
        )

        # Run prediction with additional pip dependencies and extra environment variables
        mlflow.models.predict(
            model_uri=f"runs:/{run_id}/model",
            input_data={"x": 1, "y": 2},
            content_type="json",
            pip_requirements_override=["scikit-learn==0.23.2"],
            extra_envs={"OPENAI_API_KEY": "some_value"},
        )

        # Run prediction with output_path
        mlflow.models.predict(
            model_uri=f"runs:/{run_id}/model",
            input_data={"x": 1, "y": 2},
            env_manager="uv",
            output_path="output.json",
        )

        # Run prediction with pre-release versions
        mlflow.models.predict(
            model_uri=f"runs:/{run_id}/model",
            input_data={"x": 1, "y": 2},
            env_manager="uv",
            extra_envs={"UV_PRERELEASE": "allow"},
        )

    """
    # to avoid circular imports
    from mlflow.pyfunc import _PREBUILD_ENV_ROOT_LOCATION

    if content_type not in [_CONTENT_TYPE_JSON, _CONTENT_TYPE_CSV]:
        raise MlflowException.invalid_parameter_value(
            f"Content type must be one of {_CONTENT_TYPE_JSON} or {_CONTENT_TYPE_CSV}."
        )
    if extra_envs and env_manager not in (
        _EnvManager.VIRTUALENV,
        _EnvManager.CONDA,
        _EnvManager.UV,
    ):
        raise MlflowException.invalid_parameter_value(
            "Extra environment variables are only supported when env_manager is "
            f"set to '{_EnvManager.VIRTUALENV}', '{_EnvManager.CONDA}' or '{_EnvManager.UV}'."
        )
    if env_manager == _EnvManager.UV:
        if not shutil.which("uv"):
            raise MlflowException(
                f"Found '{env_manager}' as env_manager, but the 'uv' command is not found in the "
                f"PATH. {UV_INSTALLATION_INSTRUCTIONS} Alternatively, you can use 'virtualenv' or "
                "'conda' as the environment manager, but note their performances are not "
                "as good as 'uv'."
            )
    else:
        _logger.info(
            f"It is highly recommended to use `{_EnvManager.UV}` as the environment manager for "
            "predicting with MLflow models as its performance is significantly better than other "
            f"environment managers. {UV_INSTALLATION_INSTRUCTIONS}"
        )

    is_dbconnect_mode = is_databricks_connect()
    if is_dbconnect_mode:
        if env_manager not in (_EnvManager.VIRTUALENV, _EnvManager.UV):
            raise MlflowException(
                f"Databricks Connect only supports '{_EnvManager.VIRTUALENV}' or '{_EnvManager.UV}'"
                f" as the environment manager. Got {env_manager}."
            )
        pyfunc_backend_env_root_config = {
            "create_env_root_dir": False,
            "env_root_dir": _PREBUILD_ENV_ROOT_LOCATION,
        }
    else:
        pyfunc_backend_env_root_config = {"create_env_root_dir": True}

    def _predict(_input_path: str):
        return get_flavor_backend(
            model_uri,
            env_manager=env_manager,
            install_mlflow=install_mlflow,
            **pyfunc_backend_env_root_config,
        ).predict(
            model_uri=model_uri,
            input_path=_input_path,
            output_path=output_path,
            content_type=content_type,
            pip_requirements_override=pip_requirements_override,
            extra_envs=extra_envs,
        )

    if input_data is not None and input_path is not None:
        raise MlflowException.invalid_parameter_value(
            "Both input_data and input_path are provided. Only one of them should be specified."
        )
    elif input_data is not None:
        input_data = _serialize_input_data(input_data, content_type)

        # Write input data to a temporary file
        with TempDir() as tmp:
            input_path = os.path.join(tmp.path(), f"input.{content_type}")
            with open(input_path, "w") as f:
                f.write(input_data)

            _predict(input_path)
    else:
        _predict(input_path)


def _get_pyfunc_supported_input_types():
    # Importing here as the util module depends on optional packages not available in mlflow-skinny
    import mlflow.models.utils as base_module

    supported_input_types = []
    for input_type in get_args(base_module.PyFuncInput):
        if isinstance(input_type, type):
            supported_input_types.append(input_type)
        elif isinstance(input_type, ForwardRef):
            name = input_type.__forward_arg__
            if hasattr(base_module, name):
                cls = getattr(base_module, name)
                supported_input_types.append(cls)
        else:
            # typing instances like List, Dict, Tuple, etc.
            supported_input_types.append(get_origin(input_type))
    return tuple(supported_input_types)


def _serialize_input_data(input_data, content_type):
    # build-docker command is available in mlflow-skinny (which doesn't contain pandas)
    # so we shouldn't import pandas at the top level
    import pandas as pd

    # this introduces numpy as dependency, we shouldn't import it at the top level
    # as it is not available in mlflow-skinny
    from mlflow.models.utils import convert_input_example_to_serving_input

    valid_input_types = {
        _CONTENT_TYPE_CSV: (str, list, dict, pd.DataFrame),
        _CONTENT_TYPE_JSON: _get_pyfunc_supported_input_types(),
    }.get(content_type)

    if not isinstance(input_data, valid_input_types):
        raise MlflowException.invalid_parameter_value(
            f"Input data must be one of {valid_input_types} when content type is '{content_type}', "
            f"but got {type(input_data)}."
        )

    if content_type == _CONTENT_TYPE_CSV:
        if isinstance(input_data, str):
            _validate_csv_string(input_data)
            return input_data
        else:
            try:
                return pd.DataFrame(input_data).to_csv(index=False)
            except Exception as e:
                raise MlflowException.invalid_parameter_value(
                    "Failed to serialize input data to CSV format."
                ) from e

    try:
        # rely on convert_input_example_to_serving_input to validate
        # the input_data is valid type for the loaded pyfunc model
        return convert_input_example_to_serving_input(input_data)
    except Exception as e:
        raise MlflowException.invalid_parameter_value(
            "Invalid input data, please make sure the data is acceptable by the "
            "loaded pyfunc model. Use `mlflow.models.convert_input_example_to_serving_input` "
            "to manually validate your input data."
        ) from e


def _validate_csv_string(input_data: str):
    """
    Validate the string must be the path to a CSV file.
    """
    try:
        import pandas as pd

        pd.read_csv(StringIO(input_data))
    except Exception as e:
        raise MlflowException.invalid_parameter_value(
            message="Failed to deserialize input string data to Pandas DataFrame."
        ) from e
```

--------------------------------------------------------------------------------

---[FILE: rag_signatures.py]---
Location: mlflow-master/mlflow/models/rag_signatures.py

```python
from dataclasses import dataclass, field

from mlflow.models import ModelSignature
from mlflow.types.schema import (
    Array,
    ColSpec,
    DataType,
    Object,
    Property,
    Schema,
)
from mlflow.utils.annotations import deprecated


@deprecated("mlflow.types.llm.ChatMessage")
@dataclass
class Message:
    role: str = "user"  # "system", "user", or "assistant"
    content: str = "What is mlflow?"


@deprecated("mlflow.types.llm.ChatCompletionRequest")
@dataclass
class ChatCompletionRequest:
    messages: list[Message] = field(default_factory=lambda: [Message()])


@deprecated("mlflow.types.llm.ChatCompletionRequest")
@dataclass
class SplitChatMessagesRequest:
    query: str = "What is mlflow?"
    history: list[Message] | None = field(default_factory=list)


@deprecated("mlflow.types.llm.ChatCompletionRequest")
@dataclass
class MultiturnChatRequest:
    query: str = "What is mlflow?"
    history: list[Message] | None = field(default_factory=list)


@deprecated("mlflow.types.llm.ChatChoice")
@dataclass
class ChainCompletionChoice:
    index: int = 0
    message: Message = field(
        default_factory=lambda: Message(
            role="assistant",
            content="MLflow is an open source platform for the machine learning lifecycle.",
        )
    )
    finish_reason: str = "stop"


@deprecated("mlflow.types.llm.ChatCompletionChunk")
@dataclass
class ChainCompletionChunk:
    index: int = 0
    delta: Message = field(
        default_factory=lambda: Message(
            role="assistant",
            content="MLflow is an open source platform for the machine learning lifecycle.",
        )
    )
    finish_reason: str = "stop"


@deprecated("mlflow.types.llm.ChatCompletionResponse")
@dataclass
class ChatCompletionResponse:
    choices: list[ChainCompletionChoice] = field(default_factory=lambda: [ChainCompletionChoice()])
    object: str = "chat.completion"
    # TODO: support ChainCompletionChunk in the future


@deprecated("mlflow.types.llm.ChatCompletionResponse")
@dataclass
class StringResponse:
    content: str = "MLflow is an open source platform for the machine learning lifecycle."


CHAT_COMPLETION_REQUEST_SCHEMA = Schema(
    [
        ColSpec(
            name="messages",
            type=Array(
                Object(
                    [
                        Property("role", DataType.string),
                        Property("content", DataType.string),
                    ]
                )
            ),
        ),
    ]
)

CHAT_COMPLETION_RESPONSE_SCHEMA = Schema(
    [
        ColSpec(
            name="choices",
            type=Array(
                Object(
                    [
                        Property("index", DataType.long),
                        Property(
                            "message",
                            Object(
                                [
                                    Property("role", DataType.string),
                                    Property("content", DataType.string),
                                ]
                            ),
                        ),
                        Property("finish_reason", DataType.string),
                    ]
                )
            ),
        ),
    ]
)

SIGNATURE_FOR_LLM_INFERENCE_TASK = {
    "llm/v1/chat": ModelSignature(
        inputs=CHAT_COMPLETION_REQUEST_SCHEMA, outputs=CHAT_COMPLETION_RESPONSE_SCHEMA
    ),
}
```

--------------------------------------------------------------------------------

---[FILE: resources.py]---
Location: mlflow-master/mlflow/models/resources.py

```python
import os
from abc import ABC, abstractmethod
from enum import Enum
from typing import Any

import yaml

DEFAULT_API_VERSION = "1"


class ResourceType(Enum):
    """
    Enum to define the different types of resources needed to serve a model.
    """

    UC_CONNECTION = "uc_connection"
    VECTOR_SEARCH_INDEX = "vector_search_index"
    SERVING_ENDPOINT = "serving_endpoint"
    SQL_WAREHOUSE = "sql_warehouse"
    FUNCTION = "function"
    GENIE_SPACE = "genie_space"
    TABLE = "table"
    APP = "app"
    LAKEBASE = "lakebase"


class Resource(ABC):
    """
    Base class for defining the resources needed to serve a model.

    Args:
        type (ResourceType): The resource type.
        target_uri (str): The target URI where these resources are hosted.
    """

    @property
    @abstractmethod
    def type(self) -> ResourceType:
        """
        The resource type (must be defined by subclasses).
        """

    @property
    @abstractmethod
    def target_uri(self) -> str:
        """
        The target URI where the resource is hosted (must be defined by subclasses).
        """

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

    def __eq__(self, other: Any):
        if not isinstance(other, Resource):
            return False
        return self.to_dict() == other.to_dict()


class DatabricksResource(Resource, ABC):
    """
    Base class to define all the Databricks resources to serve a model.

    Example usage: https://docs.databricks.com/en/generative-ai/log-agent.html#specify-resources-for-pyfunc-or-langchain-agent
    """

    @property
    def target_uri(self) -> str:
        return "databricks"

    @property
    def type(self) -> ResourceType:
        raise NotImplementedError("Subclasses must implement the 'type' property.")

    def __init__(self, name: str, on_behalf_of_user: bool | None = None):
        self.name = name
        self.on_behalf_of_user = on_behalf_of_user

    def to_dict(self):
        result = {self.type.value: [{"name": self.name}]}
        if self.on_behalf_of_user is not None:
            result[self.type.value][0]["on_behalf_of_user"] = self.on_behalf_of_user
        return result

    @classmethod
    def from_dict(cls, data: dict[str, str]):
        return cls(data["name"], data.get("on_behalf_of_user"))


class DatabricksUCConnection(DatabricksResource):
    """
    Define a Databricks UC Connection used to serve a model.

    Args:
        connection_name (str): The name of the databricks UC connection
        used to create the tool which was used to build the model.
        on_behalf_of_user (Optional[bool]): If True, the resource is accessed with
        with the permission of the invoker of the model in the serving endpoint. If set to
        None or False, the resource is accessed with the permissions of the creator
    """

    @property
    def type(self) -> ResourceType:
        return ResourceType.UC_CONNECTION

    def __init__(self, connection_name: str, on_behalf_of_user: bool | None = None):
        super().__init__(connection_name, on_behalf_of_user)


class DatabricksServingEndpoint(DatabricksResource):
    """
    Define Databricks LLM endpoint resource to serve a model.

    Args:
        endpoint_name (str): The name of all the databricks endpoints used by the model.
        on_behalf_of_user (Optional[bool]): If True, the resource is accessed with
        with the permission of the invoker of the model in the serving endpoint. If set to
        None or False, the resource is accessed with the permissions of the creator
    """

    @property
    def type(self) -> ResourceType:
        return ResourceType.SERVING_ENDPOINT

    def __init__(self, endpoint_name: str, on_behalf_of_user: bool | None = None):
        super().__init__(endpoint_name, on_behalf_of_user)


class DatabricksVectorSearchIndex(DatabricksResource):
    """
    Define Databricks vector search index name resource to serve a model.

    Args:
        index_name (str): The name of the databricks vector search index
        used by the model
        on_behalf_of_user (Optional[bool]): If True, the resource is accessed with
        with the permission of the invoker of the model in the serving endpoint. If set to
        None or False, the resource is accessed with the permissions of the creator
    """

    @property
    def type(self) -> ResourceType:
        return ResourceType.VECTOR_SEARCH_INDEX

    def __init__(self, index_name: str, on_behalf_of_user: bool | None = None):
        super().__init__(index_name, on_behalf_of_user)


class DatabricksSQLWarehouse(DatabricksResource):
    """
    Define Databricks sql warehouse resource to serve a model.

    Args:
        warehouse_id (str): The id of the sql warehouse used by the model
        on_behalf_of_user (Optional[bool]): If True, the resource is accessed with
        with the permission of the invoker of the model in the serving endpoint. If set to
        None or False, the resource is accessed with the permissions of the creator
    """

    @property
    def type(self) -> ResourceType:
        return ResourceType.SQL_WAREHOUSE

    def __init__(self, warehouse_id: str, on_behalf_of_user: bool | None = None):
        super().__init__(warehouse_id, on_behalf_of_user)


class DatabricksFunction(DatabricksResource):
    """
    Define Databricks UC Function to serve a model.

    Args:
        function_name (str): The name of the function used by the model
        on_behalf_of_user (Optional[bool]): If True, the resource is accessed with
        with the permission of the invoker of the model in the serving endpoint. If set to
        None or False, the resource is accessed with the permissions of the creator
    """

    @property
    def type(self) -> ResourceType:
        return ResourceType.FUNCTION

    def __init__(self, function_name: str, on_behalf_of_user: bool | None = None):
        super().__init__(function_name, on_behalf_of_user)


class DatabricksGenieSpace(DatabricksResource):
    """
    Define a Databricks Genie Space to serve a model.

    Args:
        genie_space_id (str): The genie space id
        on_behalf_of_user (Optional[bool]): If True, the resource is accessed with
        with the permission of the invoker of the model in the serving endpoint. If set to
        None or False, the resource is accessed with the permissions of the creator
    """

    @property
    def type(self) -> ResourceType:
        return ResourceType.GENIE_SPACE

    def __init__(self, genie_space_id: str, on_behalf_of_user: bool | None = None):
        super().__init__(genie_space_id, on_behalf_of_user)


class DatabricksTable(DatabricksResource):
    """
    Defines a Databricks Unity Catalog (UC) Table, which establishes table dependencies
    for Model Serving. This table will be referenced in Agent Model Serving endpoints,
    where an agent queries a SQL table via either Genie or UC Functions.

     Args:
         table_name (str): The name of the table used by the model
         on_behalf_of_user (Optional[bool]): If True, the resource is accessed with
        with the permission of the invoker of the model in the serving endpoint. If set to
        None or False, the resource is accessed with the permissions of the creator
    """

    @property
    def type(self) -> ResourceType:
        return ResourceType.TABLE

    def __init__(self, table_name: str, on_behalf_of_user: bool | None = None):
        super().__init__(table_name, on_behalf_of_user)


class DatabricksApp(DatabricksResource):
    """
    Defines a Databricks Unity Catalog (UC) Table, which establishes table dependencies
    for Model Serving. This table will be referenced in Agent Model Serving endpoints,
    where an agent queries a SQL table via either Genie or UC Functions.

     Args:
         table_name (str): The name of the table used by the model
         on_behalf_of_user (Optional[bool]): If True, the resource is accessed with
        with the permission of the invoker of the model in the serving endpoint. If set to
        None or False, the resource is accessed with the permissions of the creator
    """

    @property
    def type(self) -> ResourceType:
        return ResourceType.APP

    def __init__(self, app_name: str, on_behalf_of_user: bool | None = None):
        super().__init__(app_name, on_behalf_of_user)


class DatabricksLakebase(DatabricksResource):
    """
    Defines a Databricks Lakebase Database Instance dependency for Model Serving

     Args:
         database_instance_name (str): The name of the lakebase/database instance used by the model
         on_behalf_of_user (Optional[bool]): If True, the resource is accessed with
        with the permission of the invoker of the model in the serving endpoint. If set to
        None or False, the resource is accessed with the permissions of the creator
    """

    @property
    def type(self) -> ResourceType:
        return ResourceType.LAKEBASE

    def __init__(self, database_instance_name: str, on_behalf_of_user: bool | None = None):
        super().__init__(database_instance_name, on_behalf_of_user)


def _get_resource_class_by_type(target_uri: str, resource_type: ResourceType):
    resource_classes = {
        "databricks": {
            ResourceType.UC_CONNECTION.value: DatabricksUCConnection,
            ResourceType.SERVING_ENDPOINT.value: DatabricksServingEndpoint,
            ResourceType.VECTOR_SEARCH_INDEX.value: DatabricksVectorSearchIndex,
            ResourceType.SQL_WAREHOUSE.value: DatabricksSQLWarehouse,
            ResourceType.FUNCTION.value: DatabricksFunction,
            ResourceType.GENIE_SPACE.value: DatabricksGenieSpace,
            ResourceType.TABLE.value: DatabricksTable,
            ResourceType.APP.value: DatabricksApp,
            ResourceType.LAKEBASE.value: DatabricksLakebase,
        }
    }
    resource = resource_classes.get(target_uri)
    if resource is None:
        raise ValueError(f"Unsupported target URI: {target_uri}")
    return resource.get(resource_type)


class _ResourceBuilder:
    """
    Private builder class to build the resources dictionary.
    """

    @staticmethod
    def from_resources(
        resources: list[Resource], api_version: str = DEFAULT_API_VERSION
    ) -> dict[str, dict[ResourceType, list[dict[str, Any]]]]:
        resource_dict = {}
        for resource in resources:
            resource_data = resource.to_dict()
            for resource_type, values in resource_data.items():
                target_dict = resource_dict.setdefault(resource.target_uri, {})
                target_list = target_dict.setdefault(resource_type, [])
                target_list.extend(values)

        resource_dict["api_version"] = api_version
        return resource_dict

    @staticmethod
    def from_dict(data) -> dict[str, dict[ResourceType, list[dict[str, Any]]]]:
        resources = []
        api_version = data.pop("api_version")
        if api_version == "1":
            for target_uri, config in data.items():
                for resource_type, values in config.items():
                    if resource_class := _get_resource_class_by_type(target_uri, resource_type):
                        resources.extend(resource_class.from_dict(value) for value in values)
                    else:
                        raise ValueError(f"Unsupported resource type: {resource_type}")
        else:
            raise ValueError(f"Unsupported API version: {api_version}")

        return _ResourceBuilder.from_resources(resources, api_version)

    @staticmethod
    def from_yaml_file(path: str) -> dict[str, dict[ResourceType, list[dict[str, Any]]]]:
        if not os.path.exists(path):
            raise OSError(f"No such file or directory: '{path}'")
        path = os.path.abspath(path)
        with open(path) as file:
            data = yaml.safe_load(file)
            return _ResourceBuilder.from_dict(data)
```

--------------------------------------------------------------------------------

````
