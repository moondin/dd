---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 334
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 334 of 991)

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

---[FILE: wheeled_model.py]---
Location: mlflow-master/mlflow/models/wheeled_model.py

```python
import os
import platform
import shutil
import subprocess
import sys

import yaml

import mlflow
from mlflow import MlflowClient
from mlflow.environment_variables import MLFLOW_WHEELED_MODEL_PIP_DOWNLOAD_OPTIONS
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import BAD_REQUEST
from mlflow.pyfunc.model import MLMODEL_FILE_NAME, Model
from mlflow.store.artifact.utils.models import _parse_model_uri, get_model_name_and_version
from mlflow.tracking.artifact_utils import _download_artifact_from_uri
from mlflow.utils.environment import (
    _REQUIREMENTS_FILE_NAME,
    _get_pip_deps,
    _mlflow_additional_pip_env,
    _overwrite_pip_deps,
)
from mlflow.utils.model_utils import _validate_and_prepare_target_save_path
from mlflow.utils.uri import get_databricks_profile_uri_from_artifact_uri

_WHEELS_FOLDER_NAME = "wheels"
_ORIGINAL_REQ_FILE_NAME = "original_requirements.txt"
_PLATFORM = "platform"


class WheeledModel:
    """
    Helper class to create a model with added dependency wheels from an existing registered model.
    The `wheeled` model contains all the model dependencies as wheels stored as model artifacts.
    .. note::
        This utility only operates on a model that has been registered to the Model Registry.
    """

    def __init__(self, model_uri):
        self._model_uri = model_uri
        databricks_profile_uri = (
            get_databricks_profile_uri_from_artifact_uri(model_uri) or mlflow.get_registry_uri()
        )
        client = MlflowClient(registry_uri=databricks_profile_uri)
        self._model_name, _ = get_model_name_and_version(client, model_uri)

    @classmethod
    def log_model(cls, model_uri, registered_model_name=None):
        """
        Logs a registered model as an MLflow artifact for the current run. This only operates on
        a model which has been registered to the Model Registry. Given a registered model_uri (
        e.g. models:/<model_name>/<model_version>), this utility re-logs the model along with all
        the required model libraries back to the Model Registry. The required model libraries are
        stored along with the model as model artifacts. In addition, supporting files to the
        model (e.g. conda.yaml, requirements.txt) are modified to use the added libraries.

        By default, this utility creates a new model version under the same registered model
        specified by ``model_uri``. This behavior can be overridden by specifying the
        ``registered_model_name`` argument.

        Args:
            model_uri: A registered model uri in the Model Registry of the form
                       models:/<model_name>/<model_version/stage/latest>
            registered_model_name: The new model version (model with its libraries) is
                                   registered under the inputted registered_model_name. If None,
                                   a new version is logged to the existing model in the Model
                                   Registry.

        .. code-block:: python
            :caption: Example

            # Given a model uri, log the wheeled model
            with mlflow.start_run():
                WheeledModel.log_model(model_uri)
        """
        parsed_uri = _parse_model_uri(model_uri)
        return Model.log(
            artifact_path=None,
            flavor=WheeledModel(model_uri),
            registered_model_name=registered_model_name or parsed_uri.name,
        )

    def save_model(self, path, mlflow_model=None):
        """
        Given an existing registered model, saves the model along with it's dependencies stored as
        wheels to a path on the local file system.

        This does not modify existing model behavior or existing model flavors. It simply downloads
        the model dependencies as wheels and modifies the requirements.txt and conda.yaml file to
        point to the downloaded wheels.

        The download_command defaults to downloading only binary packages using the
        `--only-binary=:all:` option. This behavior can be overridden using an environment
        variable `MLFLOW_WHEELED_MODEL_PIP_DOWNLOAD_OPTIONS`, which will allows setting
        different options such as `--prefer-binary`, `--no-binary`, etc.

        Args:
            path: Local path where the model is to be saved.
            mlflow_model: The new :py:mod:`mlflow.models.Model` metadata file to store the
                updated model metadata.
        """
        from mlflow.pyfunc import ENV, FLAVOR_NAME, _extract_conda_env

        path = os.path.abspath(path)
        _validate_and_prepare_target_save_path(path)

        local_model_path = _download_artifact_from_uri(self._model_uri, output_path=path)

        wheels_dir = os.path.join(local_model_path, _WHEELS_FOLDER_NAME)
        pip_requirements_path = os.path.join(local_model_path, _REQUIREMENTS_FILE_NAME)
        model_metadata_path = os.path.join(local_model_path, MLMODEL_FILE_NAME)

        model_metadata = Model.load(model_metadata_path)

        # Check if the model file has `wheels` set to True
        if model_metadata.__dict__.get(_WHEELS_FOLDER_NAME, None) is not None:
            raise MlflowException("Model libraries are already added", BAD_REQUEST)

        conda_env = _extract_conda_env(model_metadata.flavors.get(FLAVOR_NAME, {}).get(ENV, None))
        conda_env_path = os.path.join(local_model_path, conda_env)
        if conda_env is None and not os.path.isfile(pip_requirements_path):
            raise MlflowException(
                "Cannot add libraries for model with no logged dependencies.", BAD_REQUEST
            )

        if not os.path.isfile(pip_requirements_path):
            self._create_pip_requirement(conda_env_path, pip_requirements_path)

        WheeledModel._download_wheels(
            pip_requirements_path=pip_requirements_path, dst_path=wheels_dir
        )

        # Keep a copy of the original requirement.txt
        shutil.copy2(pip_requirements_path, os.path.join(local_model_path, _ORIGINAL_REQ_FILE_NAME))

        # Update requirements.txt with wheels
        pip_deps = self._overwrite_pip_requirements_with_wheels(
            pip_requirements_path=pip_requirements_path, wheels_dir=wheels_dir
        )

        # Update conda.yaml with wheels
        self._update_conda_env(pip_deps, conda_env_path)

        # Update MLModel File
        mlflow_model = self._update_mlflow_model(
            original_model_metadata=model_metadata, mlflow_model=mlflow_model
        )
        mlflow_model.save(model_metadata_path)
        return mlflow_model

    def _update_conda_env(self, new_pip_deps, conda_env_path):
        """
        Updates the list pip packages in the conda.yaml file to the list of wheels in the wheels
        directory.
        {
            "name": "env",
            "channels": [...],
            "dependencies": [
                ...,
                "pip",
                {"pip": [...]},  <- Overwrite this with list of wheels
            ],
        }

        Args:
            new_pip_deps: List of pip dependencies as wheels
            conda_env_path: Path to conda.yaml file in the model directory
        """
        with open(conda_env_path) as f:
            conda_env = yaml.safe_load(f)

        new_conda_env = _overwrite_pip_deps(conda_env, new_pip_deps)

        with open(conda_env_path, "w") as out:
            yaml.safe_dump(new_conda_env, stream=out, default_flow_style=False)

    def _update_mlflow_model(self, original_model_metadata, mlflow_model):
        """
        Modifies the MLModel file to reflect updated information such as the run_id,
        utc_time_created. Additionally, this also adds `wheels` to the MLModel file to indicate that
        this is a `wheeled` model.

        Args:
            original_model_metadata: The model metadata stored in the original MLmodel file.
            mlflow_model: :py:mod:`mlflow.models.Model` configuration of the newly created
                          wheeled model
        """

        run_id = mlflow.tracking.fluent._get_or_start_run().info.run_id
        if mlflow_model is None:
            mlflow_model = Model(run_id=run_id)

        original_model_metadata.__dict__.update(
            {k: v for k, v in mlflow_model.__dict__.items() if v}
        )
        mlflow_model.__dict__.update(original_model_metadata.__dict__)
        mlflow_model.artifact_path = WheeledModel.get_wheel_artifact_path(
            mlflow_model.artifact_path
        )

        mlflow_model.wheels = {_PLATFORM: platform.platform()}
        return mlflow_model

    @classmethod
    def _download_wheels(
        cls, pip_requirements_path, dst_path, extra_envs: dict[str, str] | None = None
    ):
        """
        Downloads all the wheels of the dependencies specified in the requirements.txt file.
        The pip wheel download_command defaults to downloading only binary packages using
        the `--only-binary=:all:` option. This behavior can be overridden using an
        environment variable `MLFLOW_WHEELED_MODEL_PIP_DOWNLOAD_OPTIONS`, which will allows
        setting different options such as `--prefer-binary`, `--no-binary`, etc.

        Args:
            pip_requirements_path: Path to requirements.txt in the model directory
            dst_path: Path to the directory where the wheels are to be downloaded
            extra_envs: Extra environment variables to be passed to the subprocess.
        """
        if not os.path.exists(dst_path):
            os.makedirs(dst_path)

        pip_wheel_options = MLFLOW_WHEELED_MODEL_PIP_DOWNLOAD_OPTIONS.get()

        allowed_options = {
            "--only-binary=:all:",
            "--only-binary=:none:",
            "--no-binary=:all:",
            "--no-binary=:none:",
            "--prefer-binary",
            "--no-build-isolation",
            "--use-pep517",
            "--check-build-dependencies",
            "--ignore-requires-python",
            "--no-deps",
            "--no-verify",
            "--pre",
            "--require-hashes",
            "--no-clean",
        }
        all_options = set(pip_wheel_options.split(" "))
        if not all_options.issubset(allowed_options):
            raise MlflowException.invalid_parameter_value(
                "Invalid pip wheel option passed to `MLFLOW_WHEELED_MODEL_PIP_DOWNLOAD_OPTIONS`. "
                f"Allowed options: {', '.join(allowed_options)}. "
                "To use other options, set them as environment variables or use `extra_envs` to "
                "apply them when downloading the wheels. Check "
                "https://pip.pypa.io/en/stable/cli/pip_wheel/#options for corresponding "
                "environment variables.",
            )

        if extra_envs:
            env = os.environ.copy()
            env.update(extra_envs)
        else:
            env = None

        try:
            subprocess.run(
                [
                    sys.executable,
                    "-m",
                    "pip",
                    "wheel",
                    pip_wheel_options,
                    "--wheel-dir",
                    dst_path,
                    "-r",
                    pip_requirements_path,
                    "--no-cache-dir",
                    "--progress-bar=off",
                ],
                check=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                env=env,
            )
        except subprocess.CalledProcessError as e:
            raise MlflowException(
                f"An error occurred while downloading the dependency wheels: {e.stdout}"
            )

    def _overwrite_pip_requirements_with_wheels(self, pip_requirements_path, wheels_dir):
        """
        Overwrites the requirements.txt with the wheels of the required dependencies.

        Args:
            pip_requirements_path: Path to requirements.txt in the model directory.
            wheels_dir: Path to directory where wheels are stored.
        """
        wheels = []
        with open(pip_requirements_path, "w") as wheels_requirements:
            for wheel_file in os.listdir(wheels_dir):
                if wheel_file.endswith(".whl"):
                    complete_wheel_file = os.path.join(_WHEELS_FOLDER_NAME, wheel_file)
                    wheels.append(complete_wheel_file)
                    wheels_requirements.write(complete_wheel_file + "\n")
        return wheels

    def _create_pip_requirement(self, conda_env_path, pip_requirements_path):
        """
        This method creates a requirements.txt file for the model dependencies if the file does not
        already exist. It uses the pip dependencies found in the conda.yaml env file.

        Args:
            conda_env_path: Path to conda.yaml env file which contains the required pip
                dependencies
            pip_requirements_path: Path where the new requirements.txt will be created.
        """
        with open(conda_env_path) as f:
            conda_env = yaml.safe_load(f)
        pip_deps = _get_pip_deps(conda_env)
        _mlflow_additional_pip_env(pip_deps, pip_requirements_path)

    @classmethod
    def get_wheel_artifact_path(cls, original_artifact_path):
        return original_artifact_path + "_" + _WHEELS_FOLDER_NAME
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/models/__init__.py

```python
"""
The ``mlflow.models`` module provides an API for saving machine learning models in
"flavors" that can be understood by different downstream tools.

The built-in flavors are:

- :py:mod:`mlflow.catboost`
- :py:mod:`mlflow.dspy`
- :py:mod:`mlflow.h2o`
- :py:mod:`mlflow.langchain`
- :py:mod:`mlflow.lightgbm`
- :py:mod:`mlflow.llama_index`
- :py:mod:`mlflow.onnx`
- :py:mod:`mlflow.openai`
- :py:mod:`mlflow.paddle`
- :py:mod:`mlflow.pmdarima`
- :py:mod:`mlflow.prophet`
- :py:mod:`mlflow.pyfunc`
- :py:mod:`mlflow.pyspark.ml`
- :py:mod:`mlflow.pytorch`
- :py:mod:`mlflow.sklearn`
- :py:mod:`mlflow.spacy`
- :py:mod:`mlflow.spark`
- :py:mod:`mlflow.statsmodels`
- :py:mod:`mlflow.tensorflow`
- :py:mod:`mlflow.transformers`
- :py:mod:`mlflow.xgboost`

For details, see `MLflow Models guide <https://mlflow.org/docs/latest/ml/model/>`_.
"""

from mlflow.models.dependencies_schemas import set_retriever_schema
from mlflow.models.evaluation import (
    EvaluationArtifact,
    EvaluationMetric,
    EvaluationResult,
    MetricThreshold,
    evaluate,
    list_evaluators,
    make_metric,
)
from mlflow.models.flavor_backend import FlavorBackend
from mlflow.models.model import Model, get_model_info, set_model, update_model_requirements
from mlflow.models.model_config import ModelConfig
from mlflow.models.python_api import build_docker
from mlflow.models.resources import Resource, ResourceType
from mlflow.utils.environment import infer_pip_requirements

__all__ = [
    "Model",
    "FlavorBackend",
    "infer_pip_requirements",
    "evaluate",
    "make_metric",
    "EvaluationMetric",
    "EvaluationArtifact",
    "EvaluationResult",
    "get_model_info",
    "set_model",
    "set_retriever_schema",
    "list_evaluators",
    "MetricThreshold",
    "build_docker",
    "Resource",
    "ResourceType",
    "ModelConfig",
    "update_model_requirements",
]


# Under skinny-mlflow requirements, the following packages cannot be imported
# because of lack of numpy/pandas library, so wrap them with try...except block
try:
    from mlflow.models.python_api import predict
    from mlflow.models.signature import ModelSignature, infer_signature, set_signature
    from mlflow.models.utils import (
        ModelInputExample,
        add_libraries_to_model,
        convert_input_example_to_serving_input,
        validate_schema,
        validate_serving_input,
    )

    __all__ += [
        "ModelSignature",
        "ModelInputExample",
        "infer_signature",
        "validate_schema",
        "add_libraries_to_model",
        "convert_input_example_to_serving_input",
        "set_signature",
        "predict",
        "validate_serving_input",
    ]
except ImportError:
    pass
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/models/container/__init__.py

```python
"""
Initialize the environment and start model serving in a Docker container.

To be executed only during the model deployment.

"""

import logging
import multiprocessing
import os
import shutil
import signal
import sys
from pathlib import Path
from subprocess import Popen, check_call

import mlflow
import mlflow.version
from mlflow import pyfunc
from mlflow.environment_variables import MLFLOW_DISABLE_ENV_CREATION
from mlflow.models import Model
from mlflow.models.model import MLMODEL_FILE_NAME
from mlflow.pyfunc import _extract_conda_env, mlserver, scoring_server
from mlflow.store.artifact.models_artifact_repo import REGISTERED_MODEL_META_FILE_NAME
from mlflow.utils import env_manager as em
from mlflow.utils.environment import _PythonEnv
from mlflow.utils.virtualenv import _get_or_create_virtualenv
from mlflow.utils.yaml_utils import read_yaml
from mlflow.version import VERSION as MLFLOW_VERSION

MODEL_PATH = "/opt/ml/model"


DEFAULT_SAGEMAKER_SERVER_PORT = 8080
DEFAULT_INFERENCE_SERVER_PORT = 8000
DEFAULT_NGINX_SERVER_PORT = 8080
DEFAULT_MLSERVER_PORT = 8080

SUPPORTED_FLAVORS = [pyfunc.FLAVOR_NAME]

DISABLE_NGINX = "DISABLE_NGINX"
ENABLE_MLSERVER = "ENABLE_MLSERVER"

SERVING_ENVIRONMENT = "SERVING_ENVIRONMENT"


_logger = logging.getLogger(__name__)


def _init(cmd, env_manager):
    """
    Initialize the container and execute command.

    Args:
        cmd: Command param passed by Sagemaker. Can be "serve" or "train" (unimplemented).
    """
    if cmd == "serve":
        _serve(env_manager)
    elif cmd == "train":
        _train()
    else:
        raise Exception(f"Unrecognized command {cmd}, full args = {sys.argv}")


def _serve(env_manager):
    """
    Serve the model.

    Read the MLmodel config, initialize the Conda environment if needed and start python server.
    """
    model_config_path = os.path.join(MODEL_PATH, MLMODEL_FILE_NAME)
    m = Model.load(model_config_path)

    if pyfunc.FLAVOR_NAME in m.flavors:
        _serve_pyfunc(m, env_manager)
    else:
        raise Exception("This container only supports models with the PyFunc flavors.")


def _install_pyfunc_deps(
    model_path=None, install_mlflow=False, enable_mlserver=False, env_manager=em.VIRTUALENV
):
    """
    Creates a conda env for serving the model at the specified path and installs almost all serving
    dependencies into the environment - MLflow is not installed as it's not available via conda.
    """
    activate_cmd = _install_model_dependencies_to_env(model_path, env_manager) if model_path else []

    # NB: install gunicorn[gevent] from pip rather than from conda because gunicorn is already
    # dependency of mlflow on pip and we expect mlflow to be part of the environment.
    server_deps = ["gunicorn[gevent]"]
    if enable_mlserver:
        server_deps = [
            "'mlserver>=1.2.0,!=1.3.1,<2.0.0'",
            "'mlserver-mlflow>=1.2.0,!=1.3.1,<2.0.0'",
            # uvloop >= 0.22 is not compatible with mlserver
            "'uvloop<0.22'",
        ]

    install_server_deps = [f"pip install {' '.join(server_deps)}"]
    if Popen(["bash", "-c", " && ".join(activate_cmd + install_server_deps)]).wait() != 0:
        raise Exception("Failed to install serving dependencies into the model environment.")

    # NB: If we don't use virtualenv or conda env, we don't need to install mlflow here as
    # it's already installed in the container.
    if len(activate_cmd):
        if _container_includes_mlflow_source():
            # If the MLflow source code is copied to the container,
            # we always need to run `pip install /opt/mlflow` otherwise
            # the MLflow dependencies are not installed.
            install_mlflow_cmd = ["pip install /opt/mlflow/."]
        elif install_mlflow:
            install_mlflow_cmd = [f"pip install mlflow=={MLFLOW_VERSION}"]
        else:
            install_mlflow_cmd = []

        if install_mlflow_cmd:
            if Popen(["bash", "-c", " && ".join(activate_cmd + install_mlflow_cmd)]).wait() != 0:
                raise Exception("Failed to install mlflow into the model environment.")
    return activate_cmd


def _install_model_dependencies_to_env(model_path, env_manager) -> list[str]:
    """:
    Installs model dependencies to the specified environment, which can be either a local
    environment, a conda environment, or a virtualenv.

    Returns:
        Empty list if local environment, otherwise a list of bash commands to activate the
        virtualenv or conda environment.
    """
    model_config_path = os.path.join(model_path, MLMODEL_FILE_NAME)
    model = Model.load(model_config_path)

    conf = model.flavors.get(pyfunc.FLAVOR_NAME, {})
    if pyfunc.ENV not in conf:
        return []
    env_conf = conf[mlflow.pyfunc.ENV]

    if env_manager == em.LOCAL:
        # Install pip dependencies directly into the local environment
        python_env_config_path = os.path.join(model_path, env_conf[em.VIRTUALENV])
        python_env = _PythonEnv.from_yaml(python_env_config_path)
        deps = " ".join(python_env.build_dependencies + python_env.dependencies)
        deps = deps.replace("requirements.txt", os.path.join(model_path, "requirements.txt"))
        if Popen(["bash", "-c", f"python -m pip install {deps}"]).wait() != 0:
            raise Exception("Failed to install model dependencies.")
        return []

    _logger.info("creating and activating custom environment")

    env = _extract_conda_env(env_conf)
    env_path_dst = os.path.join("/opt/mlflow/", env)
    env_path_dst_dir = os.path.dirname(env_path_dst)
    if not os.path.exists(env_path_dst_dir):
        os.makedirs(env_path_dst_dir)
    shutil.copy2(os.path.join(MODEL_PATH, env), env_path_dst)

    if env_manager == em.CONDA:
        conda_create_model_env = f"conda env create -n custom_env -f {env_path_dst}"
        if Popen(["bash", "-c", conda_create_model_env]).wait() != 0:
            raise Exception("Failed to create model environment.")
        activate_cmd = ["source /miniconda/bin/activate custom_env"]

    elif env_manager == em.VIRTUALENV:
        env_activate_cmd = _get_or_create_virtualenv(model_path, env_manager=env_manager)
        path = env_activate_cmd.split(" ")[-1]
        os.symlink(path, "/opt/activate")
        activate_cmd = [env_activate_cmd]

    return activate_cmd


def _serve_pyfunc(model, env_manager):
    # option to disable manually nginx. The default behavior is to enable nginx.
    disable_nginx = os.getenv(DISABLE_NGINX, "false").lower() == "true"
    enable_mlserver = os.getenv(ENABLE_MLSERVER, "false").lower() == "true"
    disable_env_creation = MLFLOW_DISABLE_ENV_CREATION.get()

    conf = model.flavors[pyfunc.FLAVOR_NAME]
    bash_cmds = []
    if pyfunc.ENV in conf:
        # NB: MLFLOW_DISABLE_ENV_CREATION is False only for SageMaker deployment, where the model
        # files are loaded into the container at runtime rather than build time. In this case,
        # we need to create a virtual environment and install the model dependencies into it when
        # starting the container.
        if not disable_env_creation:
            _install_pyfunc_deps(
                MODEL_PATH,
                install_mlflow=True,
                enable_mlserver=enable_mlserver,
                env_manager=env_manager,
            )
        if env_manager == em.CONDA:
            bash_cmds.append("source /miniconda/bin/activate custom_env")
        elif env_manager == em.VIRTUALENV:
            bash_cmds.append("source /opt/activate")
    procs = []

    start_nginx = True
    if disable_nginx or enable_mlserver:
        start_nginx = False

    if start_nginx:
        nginx_conf = Path(mlflow.models.__file__).parent.joinpath(
            "container", "scoring_server", "nginx.conf"
        )

        nginx = Popen(["nginx", "-c", nginx_conf]) if start_nginx else None

        # link the log streams to stdout/err so they will be logged to the container logs.
        # Default behavior is to do the redirection unless explicitly specified
        # by environment variable.
        check_call(["ln", "-sf", "/dev/stdout", "/var/log/nginx/access.log"])
        check_call(["ln", "-sf", "/dev/stderr", "/var/log/nginx/error.log"])

        procs.append(nginx)

    cpu_count = multiprocessing.cpu_count()
    inference_server_kwargs = {}
    if enable_mlserver:
        inference_server = mlserver
        # Allows users to choose the number of workers using MLServer var env settings.
        # Default to cpu count
        nworkers = int(os.getenv("MLSERVER_INFER_WORKERS", cpu_count))
        # Since MLServer will run without NGINX, expose the server in the `8080`
        # port, which is the assumed "public" port.
        port = DEFAULT_MLSERVER_PORT

        model_meta = _read_registered_model_meta(MODEL_PATH)
        model_dict = model.to_dict()
        inference_server_kwargs = {
            "model_name": model_meta.get("model_name"),
            "model_version": model_meta.get(
                "model_version", model_dict.get("run_id", model_dict.get("model_uuid"))
            ),
        }
    else:
        inference_server = scoring_server
        nworkers = int(os.getenv("MLFLOW_MODELS_WORKERS", cpu_count))
        port = DEFAULT_INFERENCE_SERVER_PORT

    cmd, cmd_env = inference_server.get_cmd(
        model_uri=MODEL_PATH, nworkers=nworkers, port=port, **inference_server_kwargs
    )

    bash_cmds.append(cmd)
    inference_server_process = Popen(["/bin/bash", "-c", " && ".join(bash_cmds)], env=cmd_env)
    procs.append(inference_server_process)

    signal.signal(signal.SIGTERM, lambda a, b: _sigterm_handler(pids=[p.pid for p in procs]))
    # If either subprocess exits, so do we.
    awaited_pids = _await_subprocess_exit_any(procs=procs)
    _sigterm_handler(awaited_pids)


def _read_registered_model_meta(model_path):
    model_meta = {}
    if os.path.isfile(os.path.join(model_path, REGISTERED_MODEL_META_FILE_NAME)):
        model_meta = read_yaml(model_path, REGISTERED_MODEL_META_FILE_NAME)

    return model_meta


def _container_includes_mlflow_source():
    return os.path.exists("/opt/mlflow/pyproject.toml")


def _train():
    raise Exception("Train is not implemented.")


def _await_subprocess_exit_any(procs):
    pids = [proc.pid for proc in procs]
    while True:
        pid, _ = os.wait()
        if pid in pids:
            break
    return pids


def _sigterm_handler(pids):
    """
    Cleanup when terminating.

    Attempt to kill all launched processes and exit.

    """
    _logger.info("Got sigterm signal, exiting.")
    for pid in pids:
        try:
            os.kill(pid, signal.SIGTERM)
        except OSError:
            pass

    sys.exit(0)
```

--------------------------------------------------------------------------------

---[FILE: nginx.conf]---
Location: mlflow-master/mlflow/models/container/scoring_server/nginx.conf

```text
worker_processes 1;
daemon off; # Prevent forking


pid /tmp/nginx.pid;
error_log /var/log/nginx/error.log;

events {
  # defaults
}

http {
  include /etc/nginx/mime.types;
  default_type application/octet-stream;
  access_log /var/log/nginx/access.log combined;
  
  upstream uvicorn {
    server 127.0.0.1:8000;
  }

  server {
    listen 8080 deferred;
    client_max_body_size 5m;

    keepalive_timeout 75;

    location ~ ^/(ping|invocations) {
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $http_host;
      proxy_redirect off;
      proxy_pass http://uvicorn;
      client_max_body_size 100m;
    }

    location / {
      return 404 "{}";
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: artifacts.py]---
Location: mlflow-master/mlflow/models/evaluation/artifacts.py

```python
import json
import pathlib
import pickle
from json import JSONDecodeError
from typing import NamedTuple

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

from mlflow.exceptions import MlflowException
from mlflow.models.evaluation.base import EvaluationArtifact
from mlflow.utils.annotations import developer_stable
from mlflow.utils.proto_json_utils import NumpyEncoder


@developer_stable
class ImageEvaluationArtifact(EvaluationArtifact):
    def _save(self, output_artifact_path):
        self._content.save(output_artifact_path)

    def _load_content_from_file(self, local_artifact_path):
        from PIL.Image import open as open_image

        self._content = open_image(local_artifact_path)
        self._content.load()  # Load image and close the file descriptor.
        return self._content


@developer_stable
class CsvEvaluationArtifact(EvaluationArtifact):
    def _save(self, output_artifact_path):
        self._content.to_csv(output_artifact_path, index=False)

    def _load_content_from_file(self, local_artifact_path):
        self._content = pd.read_csv(local_artifact_path)
        return self._content


@developer_stable
class ParquetEvaluationArtifact(EvaluationArtifact):
    def _save(self, output_artifact_path):
        self._content.to_parquet(output_artifact_path, compression="brotli")

    def _load_content_from_file(self, local_artifact_path):
        self._content = pd.read_parquet(local_artifact_path)
        return self._content


@developer_stable
class NumpyEvaluationArtifact(EvaluationArtifact):
    def _save(self, output_artifact_path):
        np.save(output_artifact_path, self._content, allow_pickle=False)

    def _load_content_from_file(self, local_artifact_path):
        self._content = np.load(local_artifact_path, allow_pickle=False)
        return self._content


@developer_stable
class JsonEvaluationArtifact(EvaluationArtifact):
    def _save(self, output_artifact_path):
        with open(output_artifact_path, "w") as f:
            json.dump(self._content, f)

    def _load_content_from_file(self, local_artifact_path):
        with open(local_artifact_path) as f:
            self._content = json.load(f)
        return self._content


@developer_stable
class TextEvaluationArtifact(EvaluationArtifact):
    def _save(self, output_artifact_path):
        with open(output_artifact_path, "w") as f:
            f.write(self._content)

    def _load_content_from_file(self, local_artifact_path):
        with open(local_artifact_path) as f:
            self._content = f.read()
        return self._content


@developer_stable
class PickleEvaluationArtifact(EvaluationArtifact):
    def _save(self, output_artifact_path):
        with open(output_artifact_path, "wb") as f:
            pickle.dump(self._content, f)

    def _load_content_from_file(self, local_artifact_path):
        with open(local_artifact_path, "rb") as f:
            self._content = pickle.load(f)
        return self._content


_EXT_TO_ARTIFACT_MAP = {
    ".png": ImageEvaluationArtifact,
    ".jpg": ImageEvaluationArtifact,
    ".jpeg": ImageEvaluationArtifact,
    ".json": JsonEvaluationArtifact,
    ".npy": NumpyEvaluationArtifact,
    ".csv": CsvEvaluationArtifact,
    ".parquet": ParquetEvaluationArtifact,
    ".txt": TextEvaluationArtifact,
}

_TYPE_TO_EXT_MAP = {
    pd.DataFrame: ".csv",
    np.ndarray: ".npy",
    plt.Figure: ".png",
}

_TYPE_TO_ARTIFACT_MAP = {
    pd.DataFrame: CsvEvaluationArtifact,
    np.ndarray: NumpyEvaluationArtifact,
    plt.Figure: ImageEvaluationArtifact,
}


class _InferredArtifactProperties(NamedTuple):
    from_path: bool
    type: type[EvaluationArtifact]
    ext: str


def _infer_artifact_type_and_ext(artifact_name, raw_artifact, custom_metric_tuple):
    """
    This function performs type and file extension inference on the provided artifact

    Args:
        artifact_name: The name of the provided artifact
        raw_artifact: The artifact object
        custom_metric_tuple: Containing a user provided function and its index in the
            ``custom_metrics`` parameter of ``mlflow.evaluate``

    Returns:
        InferredArtifactProperties namedtuple
    """

    exception_header = (
        f"Custom metric function '{custom_metric_tuple.name}' at index "
        f"{custom_metric_tuple.index} in the `custom_metrics` parameter produced an "
        f"artifact '{artifact_name}'"
    )

    # Given a string, first see if it is a path. Otherwise, check if it is a JsonEvaluationArtifact
    if isinstance(raw_artifact, str):
        potential_path = pathlib.Path(raw_artifact)
        if potential_path.exists():
            raw_artifact = potential_path
        else:
            try:
                json.loads(raw_artifact)
                return _InferredArtifactProperties(
                    from_path=False, type=JsonEvaluationArtifact, ext=".json"
                )
            except JSONDecodeError:
                raise MlflowException(
                    f"{exception_header} with string representation '{raw_artifact}' that is "
                    f"neither a valid path to a file nor a JSON string."
                )

    # Type inference based on the file extension
    if isinstance(raw_artifact, pathlib.Path):
        if not raw_artifact.exists():
            raise MlflowException(f"{exception_header} with path '{raw_artifact}' does not exist.")
        if not raw_artifact.is_file():
            raise MlflowException(f"{exception_header} with path '{raw_artifact}' is not a file.")
        if raw_artifact.suffix not in _EXT_TO_ARTIFACT_MAP:
            raise MlflowException(
                f"{exception_header} with path '{raw_artifact}' does not match any of the supported"
                f" file extensions: {', '.join(_EXT_TO_ARTIFACT_MAP.keys())}."
            )
        return _InferredArtifactProperties(
            from_path=True, type=_EXT_TO_ARTIFACT_MAP[raw_artifact.suffix], ext=raw_artifact.suffix
        )

    # Type inference based on object type
    if type(raw_artifact) in _TYPE_TO_ARTIFACT_MAP:
        return _InferredArtifactProperties(
            from_path=False,
            type=_TYPE_TO_ARTIFACT_MAP[type(raw_artifact)],
            ext=_TYPE_TO_EXT_MAP[type(raw_artifact)],
        )

    # Given as other python object, we first attempt to infer as JsonEvaluationArtifact. If that
    # fails, we store it as PickleEvaluationArtifact
    try:
        json.dumps(raw_artifact, cls=NumpyEncoder)
        return _InferredArtifactProperties(
            from_path=False, type=JsonEvaluationArtifact, ext=".json"
        )
    except TypeError:
        return _InferredArtifactProperties(
            from_path=False, type=PickleEvaluationArtifact, ext=".pickle"
        )
```

--------------------------------------------------------------------------------

````
