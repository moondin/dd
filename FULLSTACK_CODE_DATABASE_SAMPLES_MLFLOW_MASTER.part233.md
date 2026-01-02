---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 233
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 233 of 991)

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

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/bedrock/__init__.py

```python
import logging

from mlflow.telemetry.events import AutologgingEvent
from mlflow.telemetry.track import _record_event
from mlflow.utils.autologging_utils import autologging_integration, safe_patch

_logger = logging.getLogger(__name__)

FLAVOR_NAME = "bedrock"


@autologging_integration(FLAVOR_NAME)
def autolog(
    log_traces: bool = True,
    disable: bool = False,
    silent: bool = False,
):
    """
    Enables (or disables) and configures autologging from Amazon Bedrock to MLflow.
    Only synchronous calls are supported. Asynchronous APIs and streaming are not recorded.

    Args:
        log_traces: If ``True``, traces are logged for Bedrock models.
            If ``False``, no traces are collected during inference. Default to ``True``.
        disable: If ``True``, disables the Bedrock autologging. Default to ``False``.
        silent: If ``True``, suppress all event logs and warnings from MLflow during Bedrock
            autologging. If ``False``, show all events and warnings.
    """
    from botocore.client import ClientCreator

    from mlflow.bedrock._autolog import patched_create_client

    # NB: In boto3, the client class for each service is dynamically created at
    # runtime via the ClientCreator factory class. Therefore, we cannot patch
    # the service client directly, and instead patch the factory to return
    # a patched client class.
    safe_patch(FLAVOR_NAME, ClientCreator, "create_client", patched_create_client)

    # Since we patch the ClientCreator factory, it only takes effect for new client instances.
    if log_traces:
        _logger.info(
            "Enabled auto-tracing for Bedrock. Note that MLflow can only trace boto3 "
            "service clients that are created after this call. If you have already "
            "created one, please recreate the client by calling `boto3.client`."
        )

    _record_event(
        AutologgingEvent, {"flavor": FLAVOR_NAME, "log_traces": log_traces, "disable": disable}
    )
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/catboost/__init__.py

```python
"""
The ``mlflow.catboost`` module provides an API for logging and loading CatBoost models.
This module exports CatBoost models with the following flavors:

CatBoost (native) format
    This is the main flavor that can be loaded back into CatBoost.
:py:mod:`mlflow.pyfunc`
    Produced for use by generic pyfunc-based deployment tools and batch inference.

.. _CatBoost:
    https://catboost.ai/docs/concepts/python-reference_catboost.html
.. _CatBoost.save_model:
    https://catboost.ai/docs/concepts/python-reference_catboost_save_model.html
.. _CatBoostClassifier:
    https://catboost.ai/docs/concepts/python-reference_catboostclassifier.html
.. _CatBoostRanker:
    https://catboost.ai/docs/concepts/python-reference_catboostranker.html
.. _CatBoostRegressor:
    https://catboost.ai/docs/concepts/python-reference_catboostregressor.html
"""

import contextlib
import logging
import os
from typing import Any

import yaml

import mlflow
from mlflow import pyfunc
from mlflow.models import Model, ModelInputExample, ModelSignature
from mlflow.models.model import MLMODEL_FILE_NAME
from mlflow.models.signature import _infer_signature_from_input_example
from mlflow.models.utils import _save_example
from mlflow.tracking._model_registry import DEFAULT_AWAIT_MAX_SLEEP_SECONDS
from mlflow.tracking.artifact_utils import _download_artifact_from_uri
from mlflow.utils.docstring_utils import LOG_MODEL_PARAM_DOCS, format_docstring
from mlflow.utils.environment import (
    _CONDA_ENV_FILE_NAME,
    _CONSTRAINTS_FILE_NAME,
    _PYTHON_ENV_FILE_NAME,
    _REQUIREMENTS_FILE_NAME,
    _mlflow_conda_env,
    _process_conda_env,
    _process_pip_requirements,
    _PythonEnv,
    _validate_env_arguments,
)
from mlflow.utils.file_utils import get_total_file_size, write_to
from mlflow.utils.model_utils import (
    _add_code_from_conf_to_system_path,
    _get_flavor_configuration,
    _validate_and_copy_code_paths,
    _validate_and_prepare_target_save_path,
)
from mlflow.utils.requirements_utils import _get_pinned_requirement

FLAVOR_NAME = "catboost"
_MODEL_TYPE_KEY = "model_type"
_SAVE_FORMAT_KEY = "save_format"
_MODEL_BINARY_KEY = "data"
_MODEL_BINARY_FILE_NAME = "model.cb"

_logger = logging.getLogger(__name__)


def get_default_pip_requirements():
    """
    Returns:
        A list of default pip requirements for MLflow Models produced by this flavor.
        Calls to :func:`save_model()` and :func:`log_model()` produce a pip environment
        that, at minimum, contains these requirements.
    """
    return [_get_pinned_requirement("catboost")]


def get_default_conda_env():
    """
    Returns:
        The default Conda environment for MLflow Models produced by calls to
        :func:`save_model()` and :func:`log_model()`.
    """
    return _mlflow_conda_env(additional_pip_deps=get_default_pip_requirements())


@format_docstring(LOG_MODEL_PARAM_DOCS.format(package_name=FLAVOR_NAME))
def save_model(
    cb_model,
    path,
    conda_env=None,
    code_paths=None,
    mlflow_model=None,
    signature: ModelSignature = None,
    input_example: ModelInputExample = None,
    pip_requirements=None,
    extra_pip_requirements=None,
    metadata=None,
    **kwargs,
):
    """Save a CatBoost model to a path on the local file system.

    Args:
        cb_model: CatBoost model (an instance of `CatBoost`_, `CatBoostClassifier`_,
            `CatBoostRanker`_, or `CatBoostRegressor`_) to be saved.
        path: Local path where the model is to be saved.
        conda_env: {{ conda_env }}
        code_paths: A list of local filesystem paths to Python file dependencies (or directories
            containing file dependencies). These files are *prepended* to the system
            path when the model is loaded.
        mlflow_model: :py:mod:`mlflow.models.Model` this flavor is being added to.
        signature: {{ signature }}
        input_example: {{ input_example }}
        pip_requirements: {{ pip_requirements }}
        extra_pip_requirements: {{ extra_pip_requirements }}
        metadata: {{ metadata }}
        kwargs: kwargs to pass to `CatBoost.save_model`_ method.

    """
    import catboost as cb

    _validate_env_arguments(conda_env, pip_requirements, extra_pip_requirements)

    path = os.path.abspath(path)
    _validate_and_prepare_target_save_path(path)
    code_dir_subpath = _validate_and_copy_code_paths(code_paths, path)

    if mlflow_model is None:
        mlflow_model = Model()
    saved_example = _save_example(mlflow_model, input_example, path)

    if signature is None and saved_example is not None:
        wrapped_model = _CatboostModelWrapper(cb_model)
        signature = _infer_signature_from_input_example(saved_example, wrapped_model)
    elif signature is False:
        signature = None

    if signature is not None:
        mlflow_model.signature = signature
    if metadata is not None:
        mlflow_model.metadata = metadata

    model_data_path = os.path.join(path, _MODEL_BINARY_FILE_NAME)
    cb_model.save_model(model_data_path, **kwargs)

    model_bin_kwargs = {_MODEL_BINARY_KEY: _MODEL_BINARY_FILE_NAME}
    pyfunc.add_to_model(
        mlflow_model,
        loader_module="mlflow.catboost",
        conda_env=_CONDA_ENV_FILE_NAME,
        python_env=_PYTHON_ENV_FILE_NAME,
        code=code_dir_subpath,
        **model_bin_kwargs,
    )

    flavor_conf = {
        _MODEL_TYPE_KEY: cb_model.__class__.__name__,
        _SAVE_FORMAT_KEY: kwargs.get("format", "cbm"),
        **model_bin_kwargs,
    }
    mlflow_model.add_flavor(
        FLAVOR_NAME, catboost_version=cb.__version__, code=code_dir_subpath, **flavor_conf
    )
    if size := get_total_file_size(path):
        mlflow_model.model_size_bytes = size
    mlflow_model.save(os.path.join(path, MLMODEL_FILE_NAME))

    if conda_env is None:
        if pip_requirements is None:
            default_reqs = get_default_pip_requirements()
            # To ensure `_load_pyfunc` can successfully load the model during the dependency
            # inference, `mlflow_model.save` must be called beforehand to save an MLmodel file.
            inferred_reqs = mlflow.models.infer_pip_requirements(
                path,
                FLAVOR_NAME,
                fallback=default_reqs,
            )
            default_reqs = sorted(set(inferred_reqs).union(default_reqs))
        else:
            default_reqs = None
        conda_env, pip_requirements, pip_constraints = _process_pip_requirements(
            default_reqs,
            pip_requirements,
            extra_pip_requirements,
        )
    else:
        conda_env, pip_requirements, pip_constraints = _process_conda_env(conda_env)

    with open(os.path.join(path, _CONDA_ENV_FILE_NAME), "w") as f:
        yaml.safe_dump(conda_env, stream=f, default_flow_style=False)

    # Save `constraints.txt` if necessary
    if pip_constraints:
        write_to(os.path.join(path, _CONSTRAINTS_FILE_NAME), "\n".join(pip_constraints))

    # Save `requirements.txt`
    write_to(os.path.join(path, _REQUIREMENTS_FILE_NAME), "\n".join(pip_requirements))

    _PythonEnv.current().to_yaml(os.path.join(path, _PYTHON_ENV_FILE_NAME))


@format_docstring(LOG_MODEL_PARAM_DOCS.format(package_name=FLAVOR_NAME))
def log_model(
    cb_model,
    artifact_path: str | None = None,
    conda_env=None,
    code_paths=None,
    registered_model_name=None,
    signature: ModelSignature = None,
    input_example: ModelInputExample = None,
    await_registration_for=DEFAULT_AWAIT_MAX_SLEEP_SECONDS,
    pip_requirements=None,
    extra_pip_requirements=None,
    metadata=None,
    name: str | None = None,
    params: dict[str, Any] | None = None,
    tags: dict[str, Any] | None = None,
    model_type: str | None = None,
    step: int = 0,
    model_id: str | None = None,
    **kwargs,
):
    """Log a CatBoost model as an MLflow artifact for the current run.

    Args:
        cb_model: CatBoost model (an instance of `CatBoost`_, `CatBoostClassifier`_,
            `CatBoostRanker`_, or `CatBoostRegressor`_) to be saved.
        artifact_path: Deprecated. Use `name` instead.
        conda_env: {{ conda_env }}
        code_paths: A list of local filesystem paths to Python file dependencies (or directories
            containing file dependencies). These files are *prepended* to the system
            path when the model is loaded.
        registered_model_name: If given, create a model
            version under ``registered_model_name``, also creating a
            registered model if one with the given name does not exist.
        signature: {{ signature }}
        input_example: {{ input_example }}
        await_registration_for: Number of seconds to wait for the model version to finish
            being created and is in ``READY`` status. By default, the function
            waits for five minutes. Specify 0 or None to skip waiting.
        pip_requirements: {{ pip_requirements }}
        extra_pip_requirements: {{ extra_pip_requirements }}
        metadata: {{ metadata }}
        name: {{ name }}
        params: {{ params }}
        tags: {{ tags }}
        model_type: {{ model_type }}
        step: {{ step }}
        model_id: {{ model_id }}
        kwargs: kwargs to pass to `CatBoost.save_model`_ method.

    Returns:
        A :py:class:`ModelInfo <mlflow.models.model.ModelInfo>` instance that contains the
        metadata of the logged model.

    """
    return Model.log(
        artifact_path=artifact_path,
        name=name,
        flavor=mlflow.catboost,
        registered_model_name=registered_model_name,
        cb_model=cb_model,
        conda_env=conda_env,
        code_paths=code_paths,
        signature=signature,
        input_example=input_example,
        await_registration_for=await_registration_for,
        pip_requirements=pip_requirements,
        extra_pip_requirements=extra_pip_requirements,
        metadata=metadata,
        params=params,
        tags=tags,
        model_type=model_type,
        step=step,
        model_id=model_id,
        **kwargs,
    )


def _init_model(model_type):
    from catboost import CatBoost, CatBoostClassifier, CatBoostRegressor

    model_types = {c.__name__: c for c in [CatBoost, CatBoostClassifier, CatBoostRegressor]}

    with contextlib.suppress(ImportError):
        from catboost import CatBoostRanker

        model_types[CatBoostRanker.__name__] = CatBoostRanker

    if model_type not in model_types:
        raise TypeError(
            f"Invalid model type: '{model_type}'. Must be one of {list(model_types.keys())}"
        )

    return model_types[model_type]()


def _load_model(path, model_type, save_format):
    model = _init_model(model_type)
    model.load_model(os.path.abspath(path), save_format)
    return model


def _load_pyfunc(path):
    """Load PyFunc implementation. Called by ``pyfunc.load_model``.

    Args:
        path: Local filesystem path to the MLflow Model with the ``catboost`` flavor.
    """
    flavor_conf = _get_flavor_configuration(
        model_path=os.path.dirname(path), flavor_name=FLAVOR_NAME
    )
    return _CatboostModelWrapper(
        _load_model(path, flavor_conf.get(_MODEL_TYPE_KEY), flavor_conf.get(_SAVE_FORMAT_KEY))
    )


def load_model(model_uri, dst_path=None):
    """Load a CatBoost model from a local file or a run.

    Args:
        model_uri: The location, in URI format, of the MLflow model. For example:

            - ``/Users/me/path/to/local/model``
            - ``relative/path/to/local/model``
            - ``s3://my_bucket/path/to/model``
            - ``runs:/<mlflow_run_id>/run-relative/path/to/model``

            For more information about supported URI schemes, see
            `Referencing Artifacts <https://www.mlflow.org/docs/latest/tracking.html#
            artifact-locations>`_.
        dst_path: The local filesystem path to which to download the model artifact.
            This directory must already exist. If unspecified, a local output
            path will be created.

    Returns:
        A CatBoost model (an instance of `CatBoost`_, `CatBoostClassifier`_, `CatBoostRanker`_,
        or `CatBoostRegressor`_)

    """
    local_model_path = _download_artifact_from_uri(artifact_uri=model_uri, output_path=dst_path)
    flavor_conf = _get_flavor_configuration(model_path=local_model_path, flavor_name=FLAVOR_NAME)
    _add_code_from_conf_to_system_path(local_model_path, flavor_conf)
    cb_model_file_path = os.path.join(
        local_model_path, flavor_conf.get(_MODEL_BINARY_KEY, _MODEL_BINARY_FILE_NAME)
    )
    return _load_model(
        cb_model_file_path, flavor_conf.get(_MODEL_TYPE_KEY), flavor_conf.get(_SAVE_FORMAT_KEY)
    )


class _CatboostModelWrapper:
    def __init__(self, cb_model):
        self.cb_model = cb_model

    def get_raw_model(self):
        """
        Returns the underlying model.
        """
        return self.cb_model

    def predict(self, dataframe, params: dict[str, Any] | None = None):
        """
        Args:
            dataframe: Model input data.
            params: Additional parameters to pass to the model for inference.

        Returns:
            Model predictions.
        """
        return self.cb_model.predict(dataframe)


# TODO: Support autologging
```

--------------------------------------------------------------------------------

---[FILE: cli.py]---
Location: mlflow-master/mlflow/claude_code/cli.py

```python
"""MLflow CLI commands for Claude Code integration."""

from pathlib import Path

import click

from mlflow.claude_code.config import get_tracing_status, setup_environment_config
from mlflow.claude_code.hooks import disable_tracing_hooks, setup_hooks_config


@click.group("autolog")
def commands():
    """Commands for autologging with MLflow."""


@commands.command("claude")
@click.argument("directory", default=".", type=click.Path(file_okay=False, dir_okay=True))
@click.option(
    "--tracking-uri", "-u", help="MLflow tracking URI (e.g., 'databricks' or 'file://mlruns')"
)
@click.option("--experiment-id", "-e", help="MLflow experiment ID")
@click.option("--experiment-name", "-n", help="MLflow experiment name")
@click.option("--disable", is_flag=True, help="Disable Claude tracing in the specified directory")
@click.option("--status", is_flag=True, help="Show current tracing status")
def claude(
    directory: str,
    tracking_uri: str | None,
    experiment_id: str | None,
    experiment_name: str | None,
    disable: bool,
    status: bool,
) -> None:
    """Set up Claude Code tracing in a directory.

    This command configures Claude Code hooks to automatically trace conversations
    to MLflow. After setup, use the regular 'claude' command and traces will be
    automatically created.

    DIRECTORY: Directory to set up tracing in (default: current directory)

    Examples:

      # Set up tracing in current directory with local storage
      mlflow autolog claude

      # Set up tracing in a specific project directory
      mlflow autolog claude ~/my-project

      # Set up tracing with Databricks
      mlflow autolog claude -u databricks -e 123456789

      # Set up tracing with custom tracking URI
      mlflow autolog claude -u file://./custom-mlruns

      # Disable tracing in current directory
      mlflow autolog claude --disable
    """
    target_dir = Path(directory).resolve()
    claude_dir = target_dir / ".claude"
    settings_file = claude_dir / "settings.json"

    if status:
        _show_status(target_dir, settings_file)
        return

    if disable:
        _handle_disable(settings_file)
        return

    click.echo(f"Configuring Claude tracing in: {target_dir}")

    # Create .claude directory and set up hooks
    claude_dir.mkdir(parents=True, exist_ok=True)
    setup_hooks_config(settings_file)
    click.echo("✅ Claude Code hooks configured")

    # Set up environment variables
    setup_environment_config(settings_file, tracking_uri, experiment_id, experiment_name)

    # Show final status
    _show_setup_status(target_dir, tracking_uri, experiment_id, experiment_name)


def _handle_disable(settings_file: Path) -> None:
    """Handle disable command."""
    if disable_tracing_hooks(settings_file):
        click.echo("✅ Claude tracing disabled")
    else:
        click.echo("❌ No Claude configuration found - tracing was not enabled")


def _show_status(target_dir: Path, settings_file: Path) -> None:
    """Show current tracing status."""
    click.echo(f"📍 Claude tracing status in: {target_dir}")

    status = get_tracing_status(settings_file)

    if not status.enabled:
        click.echo("❌ Claude tracing is not enabled")
        if status.reason:
            click.echo(f"   Reason: {status.reason}")
        return

    click.echo("✅ Claude tracing is ENABLED")
    click.echo(f"📊 Tracking URI: {status.tracking_uri}")

    if status.experiment_id:
        click.echo(f"🔬 Experiment ID: {status.experiment_id}")
    elif status.experiment_name:
        click.echo(f"🔬 Experiment Name: {status.experiment_name}")
    else:
        click.echo("🔬 Experiment: Default (experiment 0)")


def _show_setup_status(
    target_dir: Path,
    tracking_uri: str | None,
    experiment_id: str | None,
    experiment_name: str | None,
) -> None:
    """Show setup completion status."""
    current_dir = Path.cwd().resolve()

    click.echo("\n" + "=" * 50)
    click.echo("🎯 Claude Tracing Setup Complete!")
    click.echo("=" * 50)

    click.echo(f"📁 Directory: {target_dir}")

    # Show tracking configuration
    if tracking_uri:
        click.echo(f"📊 Tracking URI: {tracking_uri}")

    if experiment_id:
        click.echo(f"🔬 Experiment ID: {experiment_id}")
    elif experiment_name:
        click.echo(f"🔬 Experiment Name: {experiment_name}")
    else:
        click.echo("🔬 Experiment: Default (experiment 0)")

    # Show next steps
    click.echo("\n" + "=" * 30)
    click.echo("🚀 Next Steps:")
    click.echo("=" * 30)

    # Only show cd if it's a different directory
    if target_dir != current_dir:
        click.echo(f"cd {target_dir}")

    click.echo("claude -p 'your prompt here'")

    if tracking_uri and tracking_uri.startswith("file://"):
        click.echo("\n💡 View your traces:")
        click.echo(f"   mlflow server --backend-store-uri {tracking_uri}")
    elif not tracking_uri:
        click.echo("\n💡 View your traces:")
        click.echo("   mlflow server")
    elif tracking_uri == "databricks":
        click.echo("\n💡 View your traces in your Databricks workspace")

    click.echo("\n🔧 To disable tracing later:")
    click.echo("   mlflow autolog claude --disable")
```

--------------------------------------------------------------------------------

---[FILE: config.py]---
Location: mlflow-master/mlflow/claude_code/config.py

```python
"""Configuration management for Claude Code integration with MLflow."""

import json
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from mlflow.environment_variables import (
    MLFLOW_EXPERIMENT_ID,
    MLFLOW_EXPERIMENT_NAME,
    MLFLOW_TRACKING_URI,
)

# Configuration field constants
HOOK_FIELD_HOOKS = "hooks"
HOOK_FIELD_COMMAND = "command"
ENVIRONMENT_FIELD = "environment"

# MLflow environment variable constants
MLFLOW_HOOK_IDENTIFIER = "mlflow.claude_code.hooks"
MLFLOW_TRACING_ENABLED = "MLFLOW_CLAUDE_TRACING_ENABLED"


@dataclass
class TracingStatus:
    """Dataclass for tracing status information."""

    enabled: bool
    tracking_uri: str | None = None
    experiment_id: str | None = None
    experiment_name: str | None = None
    reason: str | None = None


def load_claude_config(settings_path: Path) -> dict[str, Any]:
    """Load existing Claude configuration from settings file.

    Args:
        settings_path: Path to Claude settings.json file

    Returns:
        Configuration dictionary, empty dict if file doesn't exist or is invalid
    """
    if settings_path.exists():
        try:
            with open(settings_path, encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return {}
    return {}


def save_claude_config(settings_path: Path, config: dict[str, Any]) -> None:
    """Save Claude configuration to settings file.

    Args:
        settings_path: Path to Claude settings.json file
        config: Configuration dictionary to save
    """
    settings_path.parent.mkdir(parents=True, exist_ok=True)
    with open(settings_path, "w", encoding="utf-8") as f:
        json.dump(config, f, indent=2)


def get_tracing_status(settings_path: Path) -> TracingStatus:
    """Get current tracing status from Claude settings.

    Args:
        settings_path: Path to Claude settings file

    Returns:
        TracingStatus with tracing status information
    """
    if not settings_path.exists():
        return TracingStatus(enabled=False, reason="No configuration found")

    config = load_claude_config(settings_path)
    env_vars = config.get(ENVIRONMENT_FIELD, {})
    enabled = env_vars.get(MLFLOW_TRACING_ENABLED) == "true"

    return TracingStatus(
        enabled=enabled,
        tracking_uri=env_vars.get(MLFLOW_TRACKING_URI.name),
        experiment_id=env_vars.get(MLFLOW_EXPERIMENT_ID.name),
        experiment_name=env_vars.get(MLFLOW_EXPERIMENT_NAME.name),
    )


def get_env_var(var_name: str, default: str = "") -> str:
    """Get environment variable from OS or Claude settings as fallback.

    Args:
        var_name: Environment variable name
        default: Default value if not found anywhere

    Returns:
        Environment variable value
    """
    # First check OS environment
    value = os.getenv(var_name)
    if value is not None:
        return value

    # Fallback to Claude settings
    try:
        settings_path = Path(".claude/settings.json")
        if settings_path.exists():
            config = load_claude_config(settings_path)
            env_vars = config.get(ENVIRONMENT_FIELD, {})
            return env_vars.get(var_name, default)
    except Exception:
        pass

    return default


def setup_environment_config(
    settings_path: Path,
    tracking_uri: str | None = None,
    experiment_id: str | None = None,
    experiment_name: str | None = None,
) -> None:
    """Set up MLflow environment variables in Claude settings.

    Args:
        settings_path: Path to Claude settings file
        tracking_uri: MLflow tracking URI, defaults to local file storage
        experiment_id: MLflow experiment ID (takes precedence over name)
        experiment_name: MLflow experiment name
    """
    config = load_claude_config(settings_path)

    if ENVIRONMENT_FIELD not in config:
        config[ENVIRONMENT_FIELD] = {}

    # Always enable tracing
    config[ENVIRONMENT_FIELD][MLFLOW_TRACING_ENABLED] = "true"

    # Set tracking URI
    if tracking_uri:
        config[ENVIRONMENT_FIELD][MLFLOW_TRACKING_URI.name] = tracking_uri

    # Set experiment configuration (ID takes precedence over name)
    if experiment_id:
        config[ENVIRONMENT_FIELD][MLFLOW_EXPERIMENT_ID.name] = experiment_id
        config[ENVIRONMENT_FIELD].pop(MLFLOW_EXPERIMENT_NAME.name, None)
    elif experiment_name:
        config[ENVIRONMENT_FIELD][MLFLOW_EXPERIMENT_NAME.name] = experiment_name
        config[ENVIRONMENT_FIELD].pop(MLFLOW_EXPERIMENT_ID.name, None)

    save_claude_config(settings_path, config)
```

--------------------------------------------------------------------------------

---[FILE: hooks.py]---
Location: mlflow-master/mlflow/claude_code/hooks.py

```python
"""Hook management for Claude Code integration with MLflow."""

import json
import sys
from pathlib import Path
from typing import Any

from mlflow.claude_code.config import (
    ENVIRONMENT_FIELD,
    HOOK_FIELD_COMMAND,
    HOOK_FIELD_HOOKS,
    MLFLOW_EXPERIMENT_ID,
    MLFLOW_EXPERIMENT_NAME,
    MLFLOW_HOOK_IDENTIFIER,
    MLFLOW_TRACING_ENABLED,
    MLFLOW_TRACKING_URI,
    load_claude_config,
    save_claude_config,
)
from mlflow.claude_code.tracing import (
    CLAUDE_TRACING_LEVEL,
    get_hook_response,
    get_logger,
    is_tracing_enabled,
    process_transcript,
    read_hook_input,
    setup_mlflow,
)

# ============================================================================
# HOOK CONFIGURATION UTILITIES
# ============================================================================


def upsert_hook(config: dict[str, Any], hook_type: str, handler_name: str) -> None:
    """Insert or update a single MLflow hook in the configuration.

    Args:
        config: The hooks configuration dictionary to modify
        hook_type: The hook type (e.g., 'PostToolUse', 'Stop')
        handler_name: The handler function name (e.g., 'post_tool_use_handler')
    """
    if hook_type not in config[HOOK_FIELD_HOOKS]:
        config[HOOK_FIELD_HOOKS][hook_type] = []

    hook_command = (
        f'python -c "from mlflow.claude_code.hooks import {handler_name}; {handler_name}()"'
    )

    mlflow_hook = {"type": "command", HOOK_FIELD_COMMAND: hook_command}

    # Check if MLflow hook already exists and update it
    hook_exists = False
    for hook_group in config[HOOK_FIELD_HOOKS][hook_type]:
        if HOOK_FIELD_HOOKS in hook_group:
            for hook in hook_group[HOOK_FIELD_HOOKS]:
                if MLFLOW_HOOK_IDENTIFIER in hook.get(HOOK_FIELD_COMMAND, ""):
                    hook.update(mlflow_hook)
                    hook_exists = True
                    break

    # Add new hook if it doesn't exist
    if not hook_exists:
        config[HOOK_FIELD_HOOKS][hook_type].append({HOOK_FIELD_HOOKS: [mlflow_hook]})


def setup_hooks_config(settings_path: Path) -> None:
    """Set up Claude Code hooks for MLflow tracing.

    Creates or updates Stop hook that calls MLflow tracing handler.
    Updates existing MLflow hooks if found, otherwise adds new ones.

    Args:
        settings_path: Path to Claude settings.json file
    """
    config = load_claude_config(settings_path)

    if HOOK_FIELD_HOOKS not in config:
        config[HOOK_FIELD_HOOKS] = {}

    upsert_hook(config, "Stop", "stop_hook_handler")

    save_claude_config(settings_path, config)


# ============================================================================
# HOOK REMOVAL AND CLEANUP
# ============================================================================


def disable_tracing_hooks(settings_path: Path) -> bool:
    """Remove MLflow hooks and environment variables from Claude settings.

    Args:
        settings_path: Path to Claude settings file

    Returns:
        True if hooks/config were removed, False if no configuration was found
    """
    if not settings_path.exists():
        return False

    config = load_claude_config(settings_path)
    hooks_removed = False
    env_removed = False

    # Remove MLflow hooks
    if "Stop" in config.get(HOOK_FIELD_HOOKS, {}):
        hook_groups = config[HOOK_FIELD_HOOKS]["Stop"]
        filtered_groups = []

        for group in hook_groups:
            if HOOK_FIELD_HOOKS in group:
                filtered_hooks = [
                    hook
                    for hook in group[HOOK_FIELD_HOOKS]
                    if MLFLOW_HOOK_IDENTIFIER not in hook.get(HOOK_FIELD_COMMAND, "")
                ]

                if filtered_hooks:
                    filtered_groups.append({HOOK_FIELD_HOOKS: filtered_hooks})
                else:
                    hooks_removed = True
            else:
                filtered_groups.append(group)

        if filtered_groups:
            config[HOOK_FIELD_HOOKS]["Stop"] = filtered_groups
        else:
            del config[HOOK_FIELD_HOOKS]["Stop"]
            hooks_removed = True

    # Remove config variables
    if ENVIRONMENT_FIELD in config:
        mlflow_vars = [
            MLFLOW_TRACING_ENABLED,
            MLFLOW_TRACKING_URI,
            MLFLOW_EXPERIMENT_ID,
            MLFLOW_EXPERIMENT_NAME,
        ]
        for var in mlflow_vars:
            if var in config[ENVIRONMENT_FIELD]:
                del config[ENVIRONMENT_FIELD][var]
                env_removed = True

        if not config[ENVIRONMENT_FIELD]:
            del config[ENVIRONMENT_FIELD]

    # Clean up empty hooks section
    if HOOK_FIELD_HOOKS in config and not config[HOOK_FIELD_HOOKS]:
        del config[HOOK_FIELD_HOOKS]

    # Save updated config or remove file if empty
    if config:
        save_claude_config(settings_path, config)
    else:
        settings_path.unlink()

    return hooks_removed or env_removed


# ============================================================================
# CLAUDE CODE HOOK HANDLERS
# ============================================================================


def _process_stop_hook(session_id: str | None, transcript_path: str | None) -> dict[str, Any]:
    """Common logic for processing stop hooks.

    Args:
        session_id: Session identifier
        transcript_path: Path to transcript file

    Returns:
        Hook response dictionary
    """
    get_logger().log(
        CLAUDE_TRACING_LEVEL, "Stop hook: session=%s, transcript=%s", session_id, transcript_path
    )

    # Process the transcript and create MLflow trace
    trace = process_transcript(transcript_path, session_id)

    if trace is not None:
        return get_hook_response()
    return get_hook_response(
        error=(
            "Failed to process transcript, please check .claude/mlflow/claude_tracing.log"
            " for more details"
        ),
    )


def stop_hook_handler() -> None:
    """CLI hook handler for conversation end - processes transcript and creates trace."""
    if not is_tracing_enabled():
        response = get_hook_response()
        print(json.dumps(response))  # noqa: T201
        return

    try:
        hook_data = read_hook_input()
        session_id = hook_data.get("session_id")
        transcript_path = hook_data.get("transcript_path")

        setup_mlflow()
        response = _process_stop_hook(session_id, transcript_path)
        print(json.dumps(response))  # noqa: T201

    except Exception as e:
        get_logger().error("Error in Stop hook: %s", e, exc_info=True)
        response = get_hook_response(error=str(e))
        print(json.dumps(response))  # noqa: T201
        sys.exit(1)


async def sdk_stop_hook_handler(
    input_data: dict[str, Any],
    tool_use_id: str | None,
    context: Any,
) -> dict[str, Any]:
    """SDK hook handler for Stop event - processes transcript and creates trace.

    Args:
        input_data: Dictionary containing session_id and transcript_path
        tool_use_id: Tool use identifier
        context: HookContext from the SDK
    """
    from mlflow.utils.autologging_utils import autologging_is_disabled

    # Check if autologging is disabled
    if autologging_is_disabled("anthropic"):
        return get_hook_response()

    try:
        session_id = input_data.get("session_id")
        transcript_path = input_data.get("transcript_path")

        return _process_stop_hook(session_id, transcript_path)

    except Exception as e:
        get_logger().error("Error in SDK Stop hook: %s", e, exc_info=True)
        return get_hook_response(error=str(e))
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/mlflow/claude_code/README.md

```text
# MLflow Claude Code Integration

This module provides automatic tracing integration between Claude Code and MLflow.

## Module Structure

- **`config.py`** - Configuration management (settings files, environment variables)
- **`hooks.py`** - Claude Code hook setup and management
- **`cli.py`** - MLflow CLI commands (`mlflow autolog claude`)
- **`tracing.py`** - Core tracing logic and processors
- **`hooks/`** - Hook implementation handlers

## Installation

```bash
pip install mlflow
```

## Usage

Set up Claude Code tracing in any project directory:

```bash
# Set up tracing in current directory
mlflow autolog claude

# Set up tracing in specific directory
mlflow autolog claude ~/my-project

# Set up with custom tracking URI
mlflow autolog claude -u file://./custom-mlruns
mlflow autolog claude -u sqlite:///mlflow.db

# Set up with Databricks
mlflow autolog claude -u databricks -e 123456789

# Check status
mlflow autolog claude --status

# Disable tracing
mlflow autolog claude --disable
```

## How it Works

1. **Setup**: The `mlflow autolog claude` command configures Claude Code hooks in a `.claude/settings.json` file
2. **Automatic Tracing**: When you use the `claude` command in the configured directory, your conversations are automatically traced to MLflow
3. **View Traces**: Use `mlflow server` to view your conversation traces

## Configuration

The setup creates two types of configuration:

### Claude Code Hooks

- **PostToolUse**: Captures tool usage during conversations
- **Stop**: Processes complete conversations into MLflow traces

### Environment Variables

- `MLFLOW_CLAUDE_TRACING_ENABLED=true`: Enables tracing
- `MLFLOW_TRACKING_URI`: Where to store traces (defaults to local `.claude/mlflow/runs`)
- `MLFLOW_EXPERIMENT_ID` or `MLFLOW_EXPERIMENT_NAME`: Which experiment to use

## Examples

### Basic Local Setup

```bash
mlflow autolog claude
cd .
claude "help me write a function"
mlflow server --backend-store-uri sqlite:///mlflow.db
```

### Databricks Integration

```bash
mlflow autolog claude -u databricks -e 123456789
claude "analyze this data"
# View traces in Databricks
```

### Custom Project Setup

```bash
mlflow autolog claude ~/my-ai-project -u sqlite:///mlflow.db -n "My AI Project"
cd ~/my-ai-project
claude "refactor this code"
mlflow server --backend-store-uri sqlite:///mlflow.db
```

## Troubleshooting

### Check Status

```bash
mlflow autolog claude --status
```

### Disable Tracing

```bash
mlflow autolog claude --disable
```

### View Raw Configuration

The configuration is stored in `.claude/settings.json`:

```bash
cat .claude/settings.json
```

## Requirements

- Python 3.10+ (required by MLflow)
- MLflow installed (`pip install mlflow`)
- Claude Code CLI installed
```

--------------------------------------------------------------------------------

````
