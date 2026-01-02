---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 729
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 729 of 991)

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

---[FILE: checkpoint_utils.py]---
Location: mlflow-master/mlflow/utils/checkpoint_utils.py

```python
import logging
import os
import posixpath

import mlflow
from mlflow.exceptions import MlflowException
from mlflow.utils.autologging_utils import (
    ExceptionSafeAbstractClass,
)
from mlflow.utils.file_utils import TempDir
from mlflow.utils.mlflow_tags import LATEST_CHECKPOINT_ARTIFACT_TAG_KEY

_logger = logging.getLogger(__name__)


_CHECKPOINT_DIR = "checkpoints"
_CHECKPOINT_METRIC_FILENAME = "checkpoint_metrics.json"
_CHECKPOINT_MODEL_FILENAME = "checkpoint"
_LATEST_CHECKPOINT_PREFIX = "latest_"
_CHECKPOINT_EPOCH_PREFIX = "epoch_"
_CHECKPOINT_GLOBAL_STEP_PREFIX = "global_step_"
_WEIGHT_ONLY_CHECKPOINT_SUFFIX = ".weights"


class MlflowModelCheckpointCallbackBase(metaclass=ExceptionSafeAbstractClass):
    """Callback base class for automatic model checkpointing to MLflow.

    You must implement "save_checkpoint" method to save the model as the checkpoint file.
    and you must call `check_and_save_checkpoint_if_needed` method in relevant
    callback events to trigger automatic checkpointing.

    Args:
        checkpoint_file_suffix: checkpoint file suffix.
        monitor: In automatic model checkpointing, the metric name to monitor if
            you set `model_checkpoint_save_best_only` to True.
        save_best_only: If True, automatic model checkpointing only saves when
            the model is considered the "best" model according to the quantity
            monitored and previous checkpoint model is overwritten.
        mode: one of {"min", "max"}. In automatic model checkpointing,
            if save_best_only=True, the decision to overwrite the current save file is made
            based on either the maximization or the minimization of the monitored quantity.
        save_weights_only: In automatic model checkpointing, if True, then
            only the model's weights will be saved. Otherwise, the optimizer states,
            lr-scheduler states, etc are added in the checkpoint too.
        save_freq: `"epoch"` or integer. When using `"epoch"`, the callback
            saves the model after each epoch. When using integer, the callback
            saves the model at end of this many batches. Note that if the saving isn't
            aligned to epochs, the monitored metric may potentially be less reliable (it
            could reflect as little as 1 batch, since the metrics get reset
            every epoch). Defaults to `"epoch"`.
    """

    def __init__(
        self,
        checkpoint_file_suffix,
        monitor,
        mode,
        save_best_only,
        save_weights_only,
        save_freq,
    ):
        self.checkpoint_file_suffix = checkpoint_file_suffix
        self.monitor = monitor
        self.mode = mode
        self.save_best_only = save_best_only
        self.save_weights_only = save_weights_only
        self.save_freq = save_freq
        self.last_monitor_value = None

        self.mlflow_tracking_uri = mlflow.get_tracking_uri()

        if self.save_best_only:
            if self.monitor is None:
                raise MlflowException(
                    "If checkpoint 'save_best_only' config is set to True, you need to set "
                    "'monitor' config as well."
                )
            if self.mode not in ["min", "max"]:
                raise MlflowException(
                    "If checkpoint 'save_best_only' config is set to True, you need to set "
                    "'mode' config and available modes includes 'min' and 'max', but you set "
                    f"'mode' to '{self.mode}'."
                )

    def _is_new_checkpoint_better(self, new_monitor_value):
        if self.last_monitor_value is None:
            return True

        if self.mode == "min":
            return new_monitor_value < self.last_monitor_value

        return new_monitor_value > self.last_monitor_value

    def save_checkpoint(self, filepath: str):
        raise NotImplementedError()

    def check_and_save_checkpoint_if_needed(self, current_epoch, global_step, metric_dict):
        # For distributed model training, trainer workers need to use the driver process
        # mlflow_tracking_uri.
        # Note that `self.mlflow_tracking_uri` value is assigned in the driver process
        # then it is pickled to trainer workers.
        mlflow.set_tracking_uri(self.mlflow_tracking_uri)

        if self.save_best_only:
            if self.monitor not in metric_dict:
                _logger.warning(
                    "Checkpoint logging is skipped, because checkpoint 'save_best_only' config is "
                    "True, it requires to compare the monitored metric value, but the provided "
                    "monitored metric value is not available."
                )
                return

            new_monitor_value = metric_dict[self.monitor]
            if not self._is_new_checkpoint_better(new_monitor_value):
                # Current checkpoint is worse than last saved checkpoint,
                # so skip checkpointing.
                return

            self.last_monitor_value = new_monitor_value

        suffix = self.checkpoint_file_suffix

        if self.save_best_only:
            if self.save_weights_only:
                checkpoint_model_filename = (
                    f"{_LATEST_CHECKPOINT_PREFIX}{_CHECKPOINT_MODEL_FILENAME}"
                    f"{_WEIGHT_ONLY_CHECKPOINT_SUFFIX}{suffix}"
                )
            else:
                checkpoint_model_filename = (
                    f"{_LATEST_CHECKPOINT_PREFIX}{_CHECKPOINT_MODEL_FILENAME}{suffix}"
                )
            checkpoint_metrics_filename = (
                f"{_LATEST_CHECKPOINT_PREFIX}{_CHECKPOINT_METRIC_FILENAME}"
            )
            checkpoint_artifact_dir = _CHECKPOINT_DIR
        else:
            if self.save_freq == "epoch":
                sub_dir_name = f"{_CHECKPOINT_EPOCH_PREFIX}{current_epoch}"
            else:
                sub_dir_name = f"{_CHECKPOINT_GLOBAL_STEP_PREFIX}{global_step}"

            if self.save_weights_only:
                checkpoint_model_filename = (
                    f"{_CHECKPOINT_MODEL_FILENAME}{_WEIGHT_ONLY_CHECKPOINT_SUFFIX}{suffix}"
                )
            else:
                checkpoint_model_filename = f"{_CHECKPOINT_MODEL_FILENAME}{suffix}"
            checkpoint_metrics_filename = _CHECKPOINT_METRIC_FILENAME
            checkpoint_artifact_dir = f"{_CHECKPOINT_DIR}/{sub_dir_name}"

        mlflow.set_tag(
            LATEST_CHECKPOINT_ARTIFACT_TAG_KEY,
            f"{checkpoint_artifact_dir}/{checkpoint_model_filename}",
        )

        mlflow.log_dict(
            {**metric_dict, "epoch": current_epoch, "global_step": global_step},
            f"{checkpoint_artifact_dir}/{checkpoint_metrics_filename}",
        )

        with TempDir() as tmp_dir:
            tmp_model_save_path = os.path.join(tmp_dir.path(), checkpoint_model_filename)
            self.save_checkpoint(tmp_model_save_path)
            mlflow.log_artifact(tmp_model_save_path, checkpoint_artifact_dir)


def download_checkpoint_artifact(run_id=None, epoch=None, global_step=None, dst_path=None):
    from mlflow.client import MlflowClient
    from mlflow.utils.mlflow_tags import LATEST_CHECKPOINT_ARTIFACT_TAG_KEY

    client = MlflowClient()

    if run_id is None:
        run = mlflow.active_run()
        if run is None:
            raise MlflowException(
                "There is no active run, please provide the 'run_id' argument for "
                "'load_checkpoint' invocation."
            )
        run_id = run.info.run_id
    else:
        run = client.get_run(run_id)

    latest_checkpoint_artifact_path = run.data.tags.get(LATEST_CHECKPOINT_ARTIFACT_TAG_KEY)
    if latest_checkpoint_artifact_path is None:
        raise MlflowException("There is no logged checkpoint artifact in the current run.")

    checkpoint_filename = posixpath.basename(latest_checkpoint_artifact_path)

    if epoch is not None and global_step is not None:
        raise MlflowException(
            "Only one of 'epoch' and 'global_step' can be set for 'load_checkpoint'."
        )
    elif global_step is not None:
        checkpoint_artifact_path = (
            f"{_CHECKPOINT_DIR}/{_CHECKPOINT_GLOBAL_STEP_PREFIX}{global_step}/{checkpoint_filename}"
        )
    elif epoch is not None:
        checkpoint_artifact_path = (
            f"{_CHECKPOINT_DIR}/{_CHECKPOINT_EPOCH_PREFIX}{epoch}/{checkpoint_filename}"
        )
    else:
        checkpoint_artifact_path = latest_checkpoint_artifact_path

    return client.download_artifacts(run_id, checkpoint_artifact_path, dst_path=dst_path)
```

--------------------------------------------------------------------------------

---[FILE: class_utils.py]---
Location: mlflow-master/mlflow/utils/class_utils.py

```python
import importlib


def _get_class_from_string(fully_qualified_class_name):
    module, class_name = fully_qualified_class_name.rsplit(".", maxsplit=1)
    return getattr(importlib.import_module(module), class_name)
```

--------------------------------------------------------------------------------

---[FILE: cli_args.py]---
Location: mlflow-master/mlflow/utils/cli_args.py

```python
"""
Definitions of click options shared by several CLI commands.
"""

import warnings

import click

from mlflow.environment_variables import MLFLOW_DISABLE_ENV_MANAGER_CONDA_WARNING
from mlflow.utils import env_manager as _EnvManager

MODEL_PATH = click.option(
    "--model-path",
    "-m",
    default=None,
    metavar="PATH",
    required=True,
    help="Path to the model. The path is relative to the run with the given "
    "run-id or local filesystem path without run-id.",
)

_model_uri_help_string = (
    "URI to the model. A local path, a 'runs:/' URI, or a"
    " remote storage URI (e.g., an 's3://' URI). For more information"
    " about supported remote URIs for model artifacts, see"
    " https://mlflow.org/docs/latest/tracking.html#artifact-stores"
)

MODEL_URI_BUILD_DOCKER = click.option(
    "--model-uri",
    "-m",
    metavar="URI",
    default=None,
    required=False,
    help="[Optional] " + _model_uri_help_string,
)

MODEL_URI = click.option(
    "--model-uri",
    "-m",
    metavar="URI",
    required=True,
    help=_model_uri_help_string,
)

MLFLOW_HOME = click.option(
    "--mlflow-home",
    default=None,
    metavar="PATH",
    help="Path to local clone of MLflow project. Use for development only.",
)

RUN_ID = click.option(
    "--run-id",
    "-r",
    default=None,
    required=False,
    metavar="ID",
    help="ID of the MLflow run that generated the referenced content.",
)


def _resolve_env_manager(_, __, env_manager):
    if env_manager is not None:
        _EnvManager.validate(env_manager)
        if env_manager == _EnvManager.CONDA and not MLFLOW_DISABLE_ENV_MANAGER_CONDA_WARNING.get():
            warnings.warn(
                (
                    "Use of conda is discouraged. If you use it, please ensure that your use of "
                    "conda complies with Anaconda's terms of service "
                    "(https://legal.anaconda.com/policies/en/?name=terms-of-service). "
                    "virtualenv is the recommended tool for environment reproducibility. "
                    f"To suppress this warning, set the {MLFLOW_DISABLE_ENV_MANAGER_CONDA_WARNING} "
                    "environment variable to 'TRUE'."
                ),
                UserWarning,
                stacklevel=2,
            )
        return env_manager

    return None


def _create_env_manager_option(help_string, default=None):
    return click.option(
        "--env-manager",
        default=default,
        type=click.UNPROCESSED,
        callback=_resolve_env_manager,
        help=help_string,
    )


ENV_MANAGER = _create_env_manager_option(
    default=_EnvManager.VIRTUALENV,
    # '\b' prevents rewrapping text:
    # https://click.palletsprojects.com/en/8.1.x/documentation/#preventing-rewrapping
    help_string="""
If specified, create an environment for MLmodel using the specified
environment manager. The following values are supported:

\b
- local: use the local environment
- virtualenv: use virtualenv (and pyenv for Python version management)
- uv: use uv
- conda: use conda

If unspecified, default to virtualenv.
""",
)

ENV_MANAGER_PROJECTS = _create_env_manager_option(
    help_string="""
If specified, create an environment for MLproject using the specified
environment manager. The following values are supported:

\b
- local: use the local environment
- virtualenv: use virtualenv (and pyenv for Python version management)
- uv: use uv
- conda: use conda

If unspecified, the appropriate environment manager is automatically selected based on
the project configuration. For example, if `MLproject.yaml` contains a `python_env` key,
virtualenv is used.
""",
)

ENV_MANAGER_DOCKERFILE = _create_env_manager_option(
    default=None,
    # '\b' prevents rewrapping text:
    # https://click.palletsprojects.com/en/8.1.x/documentation/#preventing-rewrapping
    help_string="""
If specified, create an environment for MLmodel using the specified
environment manager. The following values are supported:

\b
- local: use the local environment
- virtualenv: use virtualenv (and pyenv for Python version management)
- uv: use uv
- conda: use conda

If unspecified, default to None, then MLflow will automatically pick the env manager
based on the model's flavor configuration.
If model-uri is specified: if python version is specified in the flavor configuration
and no java installation is required, then we use local environment. Otherwise we use virtualenv.
If no model-uri is provided, we use virtualenv.
""",
)


INSTALL_MLFLOW = click.option(
    "--install-mlflow",
    is_flag=True,
    default=False,
    help="If specified and there is a conda, virtualenv, or uv environment to be activated "
    "mlflow will be installed into the environment after it has been "
    "activated. The version of installed mlflow will be the same as "
    "the one used to invoke this command.",
)

HOST = click.option(
    "--host",
    "-h",
    envvar="MLFLOW_HOST",
    metavar="HOST",
    default="127.0.0.1",
    help="The network interface to bind the server to (default: 127.0.0.1). "
    "This controls which network interfaces accept connections. "
    "Use '127.0.0.1' for local-only access, or '0.0.0.0' to allow connections from any network. "
    "NOTE: This is NOT a security setting - it only controls network binding. "
    "To restrict which clients can connect, use --allowed-hosts.",
)

PORT = click.option(
    "--port",
    "-p",
    envvar="MLFLOW_PORT",
    default=5000,
    help="The port to listen on (default: 5000).",
)

TIMEOUT = click.option(
    "--timeout",
    "-t",
    envvar="MLFLOW_SCORING_SERVER_REQUEST_TIMEOUT",
    default=60,
    help="Timeout in seconds to serve a request (default: 60).",
)

# We use None to disambiguate manually selecting "4"
WORKERS = click.option(
    "--workers",
    "-w",
    envvar="MLFLOW_WORKERS",
    default=None,
    help="Number of worker processes to handle requests (default: 4).",
)

MODELS_WORKERS = click.option(
    "--workers",
    "-w",
    envvar="MLFLOW_MODELS_WORKERS",
    default=None,
    help="Number of uvicorn workers to handle requests when serving mlflow models (default: 1).",
)

ENABLE_MLSERVER = click.option(
    "--enable-mlserver",
    is_flag=True,
    default=False,
    help=(
        "Enable serving with MLServer through the v2 inference protocol. "
        "You can use environment variables to configure MLServer. "
        "(See https://mlserver.readthedocs.io/en/latest/reference/settings.html)"
    ),
)

ARTIFACTS_DESTINATION = click.option(
    "--artifacts-destination",
    envvar="MLFLOW_ARTIFACTS_DESTINATION",
    metavar="URI",
    default="./mlartifacts",
    help=(
        "The base artifact location from which to resolve artifact upload/download/list requests "
        "(e.g. 's3://my-bucket'). Defaults to a local './mlartifacts' directory. This option only "
        "applies when the tracking server is configured to stream artifacts and the experiment's "
        "artifact root location is http or mlflow-artifacts URI."
    ),
)

SERVE_ARTIFACTS = click.option(
    "--serve-artifacts/--no-serve-artifacts",
    envvar="MLFLOW_SERVE_ARTIFACTS",
    is_flag=True,
    default=True,
    help="Enables serving of artifact uploads, downloads, and list requests "
    "by routing these requests to the storage location that is specified by "
    "'--artifacts-destination' directly through a proxy. The default location that "
    "these requests are served from is a local './mlartifacts' directory which can be "
    "overridden via the '--artifacts-destination' argument. To disable artifact serving, "
    "specify `--no-serve-artifacts`. Default: True",
)

NO_CONDA = click.option(
    "--no-conda",
    is_flag=True,
    help="If specified, use local environment.",
)

INSTALL_JAVA = click.option(
    "--install-java",
    is_flag=False,
    flag_value=True,
    default=None,
    type=bool,
    help="Installs Java in the image if needed. Default is None, "
    "allowing MLflow to determine installation. Flavors requiring "
    "Java, such as Spark, enable this automatically. "
    "Note: This option only works with the UBUNTU base image; "
    "Python base images do not support Java installation.",
)

# Security-related options for MLflow server
ALLOWED_HOSTS = click.option(
    "--allowed-hosts",
    envvar="MLFLOW_SERVER_ALLOWED_HOSTS",
    default=None,
    help="Comma-separated list of allowed Host headers to prevent DNS rebinding attacks "
    "(default: localhost + private IPs). "
    "DNS rebinding allows attackers to trick your browser into accessing internal services. "
    "Examples: 'mlflow.company.com,10.0.0.100:5000'. "
    "Supports wildcards: 'mlflow.company.com,192.168.*,app-*.internal.com'. "
    "Use '*' to allow ALL hosts (not recommended for production). "
    "Default allows: localhost (all ports), private IPs (10.*, 192.168.*, 172.16-31.*). "
    "Set this when exposing MLflow beyond localhost to prevent host header attacks.",
)

CORS_ALLOWED_ORIGINS = click.option(
    "--cors-allowed-origins",
    envvar="MLFLOW_SERVER_CORS_ALLOWED_ORIGINS",
    default=None,
    help="Comma-separated list of allowed CORS origins to prevent cross-site request attacks "
    "(default: localhost origins on any port). "
    "CORS attacks allow malicious websites to make requests to your MLflow server using your "
    "credentials. Examples: 'https://app.company.com,https://notebook.company.com'. "
    "Default allows: http://localhost:* (any port), http://127.0.0.1:*, http://[::1]:*. "
    "Set this when you have web applications on different domains that need to access MLflow. "
    "Use '*' to allow ALL origins (DANGEROUS - only for development!).",
)

DISABLE_SECURITY_MIDDLEWARE = click.option(
    "--disable-security-middleware",
    envvar="MLFLOW_SERVER_DISABLE_SECURITY_MIDDLEWARE",
    is_flag=True,
    default=False,
    help="DANGEROUS: Disable all security middleware including CORS protection and host "
    "validation. This completely removes security protections and should only be used for "
    "testing. When disabled, your MLflow server is vulnerable to CORS attacks, DNS rebinding, "
    "and clickjacking. Instead, prefer configuring specific security settings with "
    "--cors-allowed-origins and --allowed-hosts.",
)

X_FRAME_OPTIONS = click.option(
    "--x-frame-options",
    envvar="MLFLOW_SERVER_X_FRAME_OPTIONS",
    default="SAMEORIGIN",
    help="X-Frame-Options header value for clickjacking protection. "
    "Options: 'SAMEORIGIN' (default - allows embedding only from same origin), "
    "'DENY' (prevents all embedding), 'NONE' (disables header - allows embedding from anywhere). "
    "Set to 'NONE' if you need to embed MLflow UI in iframes from different origins.",
)
```

--------------------------------------------------------------------------------

---[FILE: conda.py]---
Location: mlflow-master/mlflow/utils/conda.py

```python
import hashlib
import json
import logging
import os

import yaml

from mlflow.environment_variables import MLFLOW_CONDA_CREATE_ENV_CMD, MLFLOW_CONDA_HOME
from mlflow.exceptions import ExecutionException
from mlflow.utils import process
from mlflow.utils.environment import Environment
from mlflow.utils.os import is_windows

_logger = logging.getLogger(__name__)

CONDA_EXE = "CONDA_EXE"


def get_conda_command(conda_env_name):
    #  Checking for newer conda versions
    if not is_windows() and (CONDA_EXE in os.environ or MLFLOW_CONDA_HOME.defined):
        conda_path = get_conda_bin_executable("conda")
        activate_conda_env = [f"source {os.path.dirname(conda_path)}/../etc/profile.d/conda.sh"]
        activate_conda_env += [f"conda activate {conda_env_name} 1>&2"]
    else:
        activate_path = get_conda_bin_executable("activate")
        # in case os name is not 'nt', we are not running on windows. It introduces
        # bash command otherwise.
        if not is_windows():
            return [f"source {activate_path} {conda_env_name} 1>&2"]
        else:
            return [f"conda activate {conda_env_name}"]
    return activate_conda_env


def get_conda_bin_executable(executable_name):
    """
    Return path to the specified executable, assumed to be discoverable within the 'bin'
    subdirectory of a conda installation.

    The conda home directory (expected to contain a 'bin' subdirectory) is configurable via the
    ``mlflow.projects.MLFLOW_CONDA_HOME`` environment variable. If
    ``mlflow.projects.MLFLOW_CONDA_HOME`` is unspecified, this method simply returns the passed-in
    executable name.
    """
    if conda_home := MLFLOW_CONDA_HOME.get():
        return os.path.join(conda_home, f"bin/{executable_name}")
    # Use CONDA_EXE as per https://github.com/conda/conda/issues/7126
    if conda_exe := os.getenv(CONDA_EXE):
        conda_bin_dir = os.path.dirname(conda_exe)
        return os.path.join(conda_bin_dir, executable_name)
    return executable_name


def _get_conda_env_name(conda_env_path, env_id=None, env_root_dir=None):
    if conda_env_path:
        with open(conda_env_path) as f:
            conda_env_contents = f.read()
    else:
        conda_env_contents = ""

    if env_id:
        conda_env_contents += env_id

    env_name = "mlflow-{}".format(
        hashlib.sha1(conda_env_contents.encode("utf-8"), usedforsecurity=False).hexdigest()
    )
    if env_root_dir:
        env_root_dir = os.path.normpath(env_root_dir)
        # Generate env name with format "mlflow-{conda_env_contents_hash}-{env_root_dir_hash}"
        # hashing `conda_env_contents` and `env_root_dir` separately helps debugging
        env_name += "-{}".format(
            hashlib.sha1(env_root_dir.encode("utf-8"), usedforsecurity=False).hexdigest()
        )

    return env_name


def _get_conda_executable_for_create_env():
    """
    Returns the executable that should be used to create environments. This is "conda"
    by default, but it can be set to something else by setting the environment variable

    """

    return get_conda_bin_executable(MLFLOW_CONDA_CREATE_ENV_CMD.get())


def _list_conda_environments(extra_env=None):
    """Return a list of names of conda environments.

    Args:
        extra_env: Extra environment variables for running "conda env list" command.

    """
    prc = process._exec_cmd(
        [get_conda_bin_executable("conda"), "env", "list", "--json"], extra_env=extra_env
    )
    return list(map(os.path.basename, json.loads(prc.stdout).get("envs", [])))


_CONDA_ENVS_DIR = "conda_envs"
_CONDA_CACHE_PKGS_DIR = "conda_cache_pkgs"
_PIP_CACHE_DIR = "pip_cache_pkgs"


def _create_conda_env(
    conda_env_path,
    conda_env_create_path,
    project_env_name,
    conda_extra_env_vars,
    capture_output,
):
    if conda_env_path:
        process._exec_cmd(
            [
                conda_env_create_path,
                "env",
                "create",
                "-n",
                project_env_name,
                "--file",
                conda_env_path,
            ],
            extra_env=conda_extra_env_vars,
            capture_output=capture_output,
        )
    else:
        process._exec_cmd(
            [
                conda_env_create_path,
                "create",
                "--channel",
                "conda-forge",
                "--yes",
                "--override-channels",
                "-n",
                project_env_name,
                "python",
            ],
            extra_env=conda_extra_env_vars,
            capture_output=capture_output,
        )

    return Environment(get_conda_command(project_env_name), conda_extra_env_vars)


def _create_conda_env_retry(
    conda_env_path, conda_env_create_path, project_env_name, conda_extra_env_vars, _capture_output
):
    """
    `conda env create` command can fail due to network issues such as `ConnectionResetError`
    while collecting package metadata. This function retries the command up to 3 times.
    """
    num_attempts = 3
    retryable_errors = (
        "ConnectionResetError",
        "ChunkedEncodingError",
        "CONNECTION FAILED",
        "CondaHTTPError",
    )
    for attempt in range(num_attempts):
        try:
            return _create_conda_env(
                conda_env_path,
                conda_env_create_path,
                project_env_name,
                conda_extra_env_vars,
                capture_output=True,
            )
        except process.ShellCommandException as e:
            if attempt < num_attempts - 1 and any(err in str(e) for err in retryable_errors):
                _logger.warning("Conda env creation failed due to network issue. Retrying...")
                continue
            raise


def _get_conda_extra_env_vars(env_root_dir=None):
    """
    Given the `env_root_dir` (See doc of PyFuncBackend constructor argument `env_root_dir`),
    return a dict of environment variables which are used to config conda to generate envs
    under the expected `env_root_dir`.
    """
    if env_root_dir is None:
        return None

    # Create isolated conda package cache dir "conda_pkgs" under the env_root_dir
    # for each python process.
    # Note: shared conda package cache dir causes race condition issues:
    # See https://github.com/conda/conda/issues/8870
    # See https://docs.conda.io/projects/conda/en/latest/user-guide/configuration/use-condarc.html#specify-environment-directories-envs-dirs
    # and https://docs.conda.io/projects/conda/en/latest/user-guide/configuration/use-condarc.html#specify-package-directories-pkgs-dirs

    conda_envs_path = os.path.join(env_root_dir, _CONDA_ENVS_DIR)
    conda_pkgs_path = os.path.join(env_root_dir, _CONDA_CACHE_PKGS_DIR)
    pip_cache_dir = os.path.join(env_root_dir, _PIP_CACHE_DIR)

    os.makedirs(conda_envs_path, exist_ok=True)
    os.makedirs(conda_pkgs_path, exist_ok=True)
    os.makedirs(pip_cache_dir, exist_ok=True)

    return {
        "CONDA_ENVS_PATH": conda_envs_path,
        "CONDA_PKGS_DIRS": conda_pkgs_path,
        "PIP_CACHE_DIR": pip_cache_dir,
        # PIP_NO_INPUT=1 makes pip run in non-interactive mode,
        # otherwise pip might prompt "yes or no" and ask stdin input
        "PIP_NO_INPUT": "1",
    }


def get_or_create_conda_env(
    conda_env_path,
    env_id=None,
    capture_output=False,
    env_root_dir=None,
    pip_requirements_override=None,
    extra_envs=None,
):
    """Given a `Project`, creates a conda environment containing the project's dependencies if such
    a conda environment doesn't already exist. Returns the name of the conda environment.

    Args:
        conda_env_path: Path to a conda yaml file.
        env_id: Optional string that is added to the contents of the yaml file before
            calculating the hash. It can be used to distinguish environments that have the
            same conda dependencies but are supposed to be different based on the context.
            For example, when serving the model we may install additional dependencies to the
            environment after the environment has been activated.
        capture_output: Specify the capture_output argument while executing the
            "conda env create" command.
        env_root_dir: See doc of PyFuncBackend constructor argument `env_root_dir`.
        pip_requirements_override: If specified, install the specified python dependencies to
            the environment (upgrade if already installed).
        extra_envs: If specified, a dictionary of extra environment variables will be passed to the
            model inference environment.

    Returns:
        The name of the conda environment.

    """

    conda_path = get_conda_bin_executable("conda")
    conda_env_create_path = _get_conda_executable_for_create_env()

    try:
        # Checks if Conda executable exists
        process._exec_cmd([conda_path, "--help"], throw_on_error=False, extra_env=extra_envs)
    except OSError:
        raise ExecutionException(
            f"Could not find Conda executable at {conda_path}. "
            "Ensure Conda is installed as per the instructions at "
            "https://conda.io/projects/conda/en/latest/"
            "user-guide/install/index.html. "
            "You can also configure MLflow to look for a specific "
            f"Conda executable by setting the {MLFLOW_CONDA_HOME} environment variable "
            "to the path of the Conda executable"
        )

    try:
        # Checks if executable for environment creation exists
        process._exec_cmd(
            [conda_env_create_path, "--help"], throw_on_error=False, extra_env=extra_envs
        )
    except OSError:
        raise ExecutionException(
            f"You have set the env variable {MLFLOW_CONDA_CREATE_ENV_CMD}, but "
            f"{conda_env_create_path} does not exist or it is not working properly. "
            f"Note that {conda_env_create_path} and the conda executable need to be "
            "in the same conda environment. You can change the search path by"
            f"modifying the env variable {MLFLOW_CONDA_HOME}"
        )

    conda_extra_env_vars = _get_conda_extra_env_vars(env_root_dir)
    if extra_envs:
        conda_extra_env_vars.update(extra_envs)

    # Include the env_root_dir hash in the project_env_name,
    # this is for avoid conda env name conflicts between different CONDA_ENVS_PATH.
    project_env_name = _get_conda_env_name(conda_env_path, env_id=env_id, env_root_dir=env_root_dir)
    if env_root_dir is not None:
        project_env_path = os.path.join(env_root_dir, _CONDA_ENVS_DIR, project_env_name)
    else:
        project_env_path = project_env_name

    if project_env_name in _list_conda_environments(conda_extra_env_vars):
        _logger.info("Conda environment %s already exists.", project_env_path)
        return Environment(get_conda_command(project_env_name), conda_extra_env_vars)

    _logger.info("=== Creating conda environment %s ===", project_env_path)
    try:
        _create_conda_env_func = (
            # Retry conda env creation in a pytest session to avoid flaky test failures
            _create_conda_env_retry if "PYTEST_CURRENT_TEST" in os.environ else _create_conda_env
        )
        conda_env = _create_conda_env_func(
            conda_env_path,
            conda_env_create_path,
            project_env_name,
            conda_extra_env_vars,
            capture_output,
        )

        if pip_requirements_override:
            _logger.info(
                "Installing additional dependencies specified"
                f"by pip_requirements_override: {pip_requirements_override}"
            )
            cmd = [
                conda_path,
                "install",
                "-n",
                project_env_name,
                "--yes",
                *pip_requirements_override,
            ]
            process._exec_cmd(cmd, extra_env=conda_extra_env_vars, capture_output=capture_output)

        return conda_env

    except Exception:
        try:
            if project_env_name in _list_conda_environments(conda_extra_env_vars):
                _logger.warning(
                    "Encountered unexpected error while creating conda environment. Removing %s.",
                    project_env_path,
                )
                process._exec_cmd(
                    [
                        conda_path,
                        "remove",
                        "--yes",
                        "--name",
                        project_env_name,
                        "--all",
                    ],
                    extra_env=conda_extra_env_vars,
                    capture_output=False,
                )
        except Exception as e:
            _logger.warning(
                "Removing conda environment %s failed (error: %s)",
                project_env_path,
                repr(e),
            )
        raise


def _get_conda_dependencies(conda_yaml_path):
    """Extracts conda dependencies from a conda yaml file.

    Args:
        conda_yaml_path: Conda yaml file path.
    """
    with open(conda_yaml_path) as f:
        conda_yaml = yaml.safe_load(f)
        return [d for d in conda_yaml.get("dependencies", []) if isinstance(d, str)]
```

--------------------------------------------------------------------------------

````
