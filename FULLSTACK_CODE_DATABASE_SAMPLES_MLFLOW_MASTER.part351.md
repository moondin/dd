---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 351
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 351 of 991)

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

---[FILE: promptlab_model.py]---
Location: mlflow-master/mlflow/prompt/promptlab_model.py

```python
import os
import re

import yaml

from mlflow.exceptions import MlflowException
from mlflow.version import VERSION as __version__


class _PromptlabModel:
    import pandas as pd

    def __init__(self, prompt_template, prompt_parameters, model_parameters, model_route):
        self.prompt_parameters = prompt_parameters
        self.model_parameters = model_parameters
        self.model_route = model_route
        self.prompt_template = prompt_template

    def predict(self, inputs: pd.DataFrame) -> list[str]:
        from mlflow.deployments import MlflowDeploymentClient, get_deploy_client

        client = MlflowDeploymentClient(get_deploy_client())

        results = []
        for idx in inputs.index:
            prompt_parameters_as_dict = {
                param.key: inputs[param.key][idx] for param in self.prompt_parameters
            }

            # copy replacement logic from PromptEngineering.utils.ts for consistency
            prompt = self.prompt_template
            for key, value in prompt_parameters_as_dict.items():
                prompt = re.sub(r"\{\{\s*" + key + r"\s*\}\}", value, prompt)

            model_parameters_as_dict = {param.key: param.value for param in self.model_parameters}
            query_data = self._construct_query_data(prompt)

            response = client.predict(
                endpoint=self.model_route, inputs={**query_data, **model_parameters_as_dict}
            )
            results.append(self._parse_gateway_response(response))

        return results

    def _construct_query_data(self, prompt):
        from mlflow.deployments import MlflowDeploymentClient, get_deploy_client

        client = MlflowDeploymentClient(get_deploy_client())
        route_type = client.get_endpoint(self.model_route).endpoint_type

        if route_type == "llm/v1/completions":
            return {"prompt": prompt}
        elif route_type == "llm/v1/chat":
            return {"messages": [{"content": prompt, "role": "user"}]}
        else:
            raise MlflowException(
                "Error when constructing gateway query: "
                f"Unsupported route type for _PromptlabModel: {route_type}"
            )

    def _parse_gateway_response(self, response):
        from mlflow.deployments import MlflowDeploymentClient, get_deploy_client

        client = MlflowDeploymentClient(get_deploy_client())
        route_type = client.get_endpoint(self.model_route).endpoint_type

        if route_type == "llm/v1/completions":
            return response["choices"][0]["text"]
        elif route_type == "llm/v1/chat":
            return response["choices"][0]["message"]["content"]
        else:
            raise MlflowException(
                "Error when parsing gateway response: "
                f"Unsupported route type for _PromptlabModel: {route_type}"
            )


def _load_pyfunc(path):
    from mlflow import pyfunc
    from mlflow.entities.param import Param
    from mlflow.utils.model_utils import (
        _get_flavor_configuration,
    )

    pyfunc_flavor_conf = _get_flavor_configuration(model_path=path, flavor_name=pyfunc.FLAVOR_NAME)
    parameters_path = os.path.join(path, pyfunc_flavor_conf["parameters_path"])
    with open(parameters_path) as f:
        parameters = yaml.safe_load(f)

        prompt_parameters_as_params = [
            Param(key=key, value=value) for key, value in parameters["prompt_parameters"].items()
        ]
        model_parameters_as_params = [
            Param(key=key, value=value) for key, value in parameters["model_parameters"].items()
        ]

        return _PromptlabModel(
            prompt_template=parameters["prompt_template"],
            prompt_parameters=prompt_parameters_as_params,
            model_parameters=model_parameters_as_params,
            model_route=parameters["model_route"],
        )


def save_model(
    path,
    conda_env=None,
    code_paths=None,
    mlflow_model=None,
    signature=None,
    input_example=None,
    pip_requirements=None,
    prompt_template=None,
    prompt_parameters=None,
    model_parameters=None,
    model_route=None,
):
    from mlflow import pyfunc
    from mlflow.models import Model
    from mlflow.models.model import MLMODEL_FILE_NAME, Model
    from mlflow.models.utils import _save_example
    from mlflow.utils.environment import (
        _CONDA_ENV_FILE_NAME,
        _CONSTRAINTS_FILE_NAME,
        _PYTHON_ENV_FILE_NAME,
        _REQUIREMENTS_FILE_NAME,
        _process_conda_env,
        _process_pip_requirements,
        _PythonEnv,
        _validate_env_arguments,
        infer_pip_requirements,
    )
    from mlflow.utils.file_utils import write_to
    from mlflow.utils.model_utils import (
        _validate_and_copy_code_paths,
        _validate_and_prepare_target_save_path,
    )

    _validate_env_arguments(conda_env, pip_requirements, None)

    _validate_and_prepare_target_save_path(path)
    code_dir_subpath = _validate_and_copy_code_paths(code_paths, path)

    if mlflow_model is None:
        mlflow_model = Model()
    if signature is not None:
        mlflow_model.signature = signature
    if input_example is not None:
        _save_example(mlflow_model, input_example, path)

    parameters_sub_path = "parameters.yaml"
    parameters_path = os.path.join(path, parameters_sub_path)
    # dump prompt_template, prompt_parameters, model_parameters, model_route to parameters_path

    parameters = {
        "prompt_template": prompt_template,
        "prompt_parameters": {param.key: param.value for param in prompt_parameters},
        "model_parameters": {param.key: param.value for param in model_parameters},
        "model_route": model_route,
    }
    with open(parameters_path, "w") as f:
        yaml.safe_dump(parameters, stream=f, default_flow_style=False)

    pyfunc.add_to_model(
        mlflow_model,
        loader_module="mlflow.prompt.promptlab_model",
        parameters_path=parameters_sub_path,
        conda_env=_CONDA_ENV_FILE_NAME,
        python_env=_PYTHON_ENV_FILE_NAME,
        code=code_dir_subpath,
    )

    mlflow_model.save(os.path.join(path, MLMODEL_FILE_NAME))

    if conda_env is None:
        if pip_requirements is None:
            inferred_reqs = infer_pip_requirements(
                path, "mlflow._promptlab", [f"mlflow[gateway]=={__version__}"]
            )
            default_reqs = sorted(inferred_reqs)
        else:
            default_reqs = None
        conda_env, pip_requirements, pip_constraints = _process_pip_requirements(
            default_reqs, pip_requirements, None
        )
    else:
        conda_env, pip_requirements, pip_constraints = _process_conda_env(conda_env)

    with open(os.path.join(path, _CONDA_ENV_FILE_NAME), "w") as f:
        yaml.safe_dump(conda_env, stream=f, default_flow_style=False)

    if pip_constraints:
        write_to(os.path.join(path, _CONSTRAINTS_FILE_NAME), "\n".join(pip_constraints))

    write_to(os.path.join(path, _REQUIREMENTS_FILE_NAME), "\n".join(pip_requirements))

    _PythonEnv.current().to_yaml(os.path.join(path, _PYTHON_ENV_FILE_NAME))
```

--------------------------------------------------------------------------------

---[FILE: registry_utils.py]---
Location: mlflow-master/mlflow/prompt/registry_utils.py

```python
import functools
import json
import logging
import re
import threading
import time
from textwrap import dedent
from typing import Any, NamedTuple

import mlflow
from mlflow.entities.model_registry.model_version import ModelVersion
from mlflow.entities.model_registry.prompt_version import PromptVersion
from mlflow.entities.model_registry.registered_model_tag import RegisteredModelTag
from mlflow.exceptions import MlflowException
from mlflow.prompt.constants import (
    IS_PROMPT_TAG_KEY,
    PROMPT_NAME_RULE,
    PROMPT_TEXT_TAG_KEY,
    PROMPT_TYPE_CHAT,
    PROMPT_TYPE_TAG_KEY,
    RESPONSE_FORMAT_TAG_KEY,
)
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE, RESOURCE_ALREADY_EXISTS

_logger = logging.getLogger(__name__)


class PromptCacheKey(NamedTuple):
    """Cache key for prompt lookups.

    Attributes:
        name: Prompt name
        version: Prompt version (None for non-version lookups)
        alias: Prompt alias (None for non-alias lookups)
    """

    name: str
    version: int | None
    alias: str | None

    @classmethod
    def from_parts(
        cls,
        name: str,
        version: int | None = None,
        alias: str | None = None,
    ) -> "PromptCacheKey":
        """
        Create a cache key from prompt name and version/alias.

        Args:
            name: Prompt name
            version: Prompt version (mutually exclusive with alias)
            alias: Prompt alias (mutually exclusive with version)

        Returns:
            A PromptCacheKey instance

        Raises:
            ValueError: If both version and alias are provided
        """
        if version is not None and alias is not None:
            raise ValueError("Cannot specify both version and alias")
        return cls(name=name, version=version, alias=alias)

    @classmethod
    def from_uri(cls, prompt_uri: str) -> "PromptCacheKey":
        """
        Create a cache key from a prompt URI.

        Args:
            prompt_uri: URI in format "prompts:/name/version" or "prompts:/name@alias"

        Returns:
            A PromptCacheKey instance
        """
        uri_path = prompt_uri.replace("prompts:/", "")

        if "@" in uri_path:
            # Alias format: "name@alias"
            prompt_name, alias = uri_path.split("@", 1)
            return cls.from_parts(prompt_name, alias=alias)
        else:
            # Version format: "name/version"
            parts = uri_path.split("/")
            prompt_name = parts[0]
            prompt_version = int(parts[1]) if len(parts) > 1 else None
            return cls.from_parts(prompt_name, version=prompt_version)


def model_version_to_prompt_version(
    model_version: ModelVersion, prompt_tags: dict[str, str] | None = None
) -> PromptVersion:
    """
    Create a PromptVersion object from a ModelVersion object.

    Args:
        model_version: The ModelVersion object to convert to a PromptVersion.
        prompt_tags: The prompt-level tags. Optional.

    Returns:
        PromptVersion: The converted PromptVersion object.
    """
    if IS_PROMPT_TAG_KEY not in model_version.tags:
        raise MlflowException.invalid_parameter_value(
            f"Name `{model_version.name}` is registered as a model, not a prompt. MLflow "
            "does not allow registering a prompt with the same name as an existing model.",
        )

    if PROMPT_TEXT_TAG_KEY not in model_version.tags:
        raise MlflowException.invalid_parameter_value(
            f"Prompt `{model_version.name}` does not contain a prompt text"
        )

    if model_version.tags.get(PROMPT_TYPE_TAG_KEY) == PROMPT_TYPE_CHAT:
        template = json.loads(model_version.tags[PROMPT_TEXT_TAG_KEY])
    else:
        template = model_version.tags[PROMPT_TEXT_TAG_KEY]

    if RESPONSE_FORMAT_TAG_KEY in model_version.tags:
        response_format = json.loads(model_version.tags[RESPONSE_FORMAT_TAG_KEY])
    else:
        response_format = None

    return PromptVersion(
        name=model_version.name,
        version=int(model_version.version),
        template=template,
        commit_message=model_version.description,
        creation_timestamp=model_version.creation_timestamp,
        tags=model_version.tags,
        aliases=model_version.aliases,
        last_updated_timestamp=model_version.last_updated_timestamp,
        user_id=model_version.user_id,
        response_format=response_format,
    )


def add_prompt_filter_string(filter_string: str | None, is_prompt: bool = False) -> str | None:
    """
    Additional filter string to include/exclude prompts from the result.
    By default, exclude prompts from the result.
    """
    if IS_PROMPT_TAG_KEY not in (filter_string or ""):
        prompt_filter_query = (
            f"tag.`{IS_PROMPT_TAG_KEY}` = 'true'"
            if is_prompt
            else f"tag.`{IS_PROMPT_TAG_KEY}` != 'true'"
        )
        if filter_string:
            filter_string = f"{filter_string} AND {prompt_filter_query}"
        else:
            filter_string = prompt_filter_query
    return filter_string


def has_prompt_tag(tags: list[RegisteredModelTag] | dict[str, str] | None) -> bool:
    """Check if the given tags contain the prompt tag."""
    if isinstance(tags, dict):
        return IS_PROMPT_TAG_KEY in tags if tags else False
    if not tags:
        return
    return any(tag.key == IS_PROMPT_TAG_KEY for tag in tags)


def is_prompt_supported_registry(registry_uri: str | None = None) -> bool:
    """
    Check if the current registry supports prompts.

    Prompts registration is supported in:
    - OSS MLflow Tracking Server (always)
    - Unity Catalog
    - Not supported in legacy Databricks workspace registry or Unity Catalog OSS
    """
    registry_uri = registry_uri or mlflow.get_registry_uri()

    # Legacy Databricks workspace registry doesn't support prompts
    if registry_uri.startswith("databricks") and not registry_uri.startswith("databricks-uc"):
        return False

    # Unity Catalog OSS doesn't support prompts
    if registry_uri.startswith("uc:"):
        return False

    # UC registries support prompts automatically
    if registry_uri.startswith("databricks-uc"):
        return True

    # OSS MLflow registry always supports prompts
    return True


def require_prompt_registry(func):
    """Ensure that the current registry supports prompts."""

    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        if args and isinstance(args[0], mlflow.MlflowClient):
            registry_uri = args[0]._registry_uri
        else:
            registry_uri = mlflow.get_registry_uri()

        if not is_prompt_supported_registry(registry_uri):
            raise MlflowException(
                f"The '{func.__name__}' API is not supported with the current registry. "
                "Prompts are supported in OSS MLflow and Unity Catalog, but not in the "
                "legacy Databricks workspace registry.",
            )
        return func(*args, **kwargs)

    # Add note about prompt support to the docstring
    func.__doc__ = dedent(f"""\
        {func.__doc__}

        .. note::

            This API is supported in OSS MLflow Model Registry and Unity Catalog. It is
            not supported in the legacy Databricks workspace model registry.
    """)
    return wrapper


def translate_prompt_exception(func):
    """
    Translate MlflowException message related to RegisteredModel / ModelVersion into
    prompt-specific message.
    """
    MODEL_PATTERN = re.compile(r"(registered model|model version)", re.IGNORECASE)

    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except MlflowException as e:
            original_message = e.message
            # Preserve the case of the first letter
            new_message = MODEL_PATTERN.sub(
                lambda m: "Prompt" if m.group(0)[0].isupper() else "prompt", e.message
            )

            if new_message != original_message:
                new_exc = MlflowException(new_message)
                new_exc.error_code = e.error_code  # Preserve original error code
                raise new_exc from e
            else:
                raise e

    return wrapper


def validate_prompt_name(name: Any):
    """Validate the prompt name against the prompt specific rule"""
    if not isinstance(name, str) or not name:
        raise MlflowException.invalid_parameter_value(
            "Prompt name must be a non-empty string.",
        )

    if PROMPT_NAME_RULE.match(name) is None:
        raise MlflowException.invalid_parameter_value(
            "Prompt name can only contain alphanumeric characters, hyphens, underscores, and dots.",
        )


def handle_resource_already_exist_error(
    name: str,
    is_existing_entity_prompt: bool,
    is_new_entity_prompt: bool,
):
    """
    Show a more specific error message for name conflict in Model Registry.

    1. When creating a model with the same name as an existing model, say "model already exists".
    2. When creating a prompt with the same name as an existing prompt, say "prompt already exists".
    3. Otherwise, explain that a prompt and a model cannot have the same name.
    """
    old_entity = "Prompt" if is_existing_entity_prompt else "Registered Model"
    new_entity = "Prompt" if is_new_entity_prompt else "Registered Model"

    if old_entity != new_entity:
        raise MlflowException(
            f"Tried to create a {new_entity.lower()} with name {name!r}, but the name is "
            f"already taken by a {old_entity.lower()}. MLflow does not allow creating a "
            "model and a prompt with the same name.",
            RESOURCE_ALREADY_EXISTS,
        )

    raise MlflowException(
        f"{new_entity} (name={name}) already exists.",
        RESOURCE_ALREADY_EXISTS,
    )


def parse_prompt_name_or_uri(name_or_uri: str, version: str | int | None = None) -> str:
    """
    Parse prompt name or URI into a fully qualified prompt URI.

    Handles two cases:
    1. URI format: "prompts:/name/version" or "prompts:/name@alias"
       - Returns (name, parsed_version)
       - Raises error if version parameter is also provided
    2. Name format: "my_prompt"
       - Returns (name, version)
       - Return the latest version if version is not provided

    Args:
        name_or_uri: The name of the prompt, or the URI in the format "prompts:/name/version".
        version: The version of the prompt (required when using name, not allowed when using URI).

    Returns:
        Fully qualified prompt URI

    Raises:
        MlflowException: If validation fails
    """
    if name_or_uri.startswith("prompts:/"):
        if version is not None:
            raise MlflowException(
                "The `version` argument should not be specified when loading a prompt by URI.",
                INVALID_PARAMETER_VALUE,
            )
        return name_or_uri
    else:
        if version is None:
            _logger.debug(
                "No version provided, returning the latest version of the prompt. "
                "Prompt caching will not be enabled for this mode."
            )
            return f"prompts:/{name_or_uri}@latest"
        return f"prompts:/{name_or_uri}/{version}"


class PromptCache:
    """
    Thread-safe singleton cache for prompts with TTL support.

    This cache stores prompts to avoid repeated API calls when fetching
    prompts by name/version/alias. Items expire after a configurable TTL.

    Usage:
        cache = PromptCache.get_instance()
        key = PromptCacheKey.from_parts("my-prompt", version=1)
        cache.set(key, prompt_value, ttl_seconds=300)
        prompt = cache.get(key)
    """

    _instance_lock = threading.RLock()
    _instance: "PromptCache | None" = None

    @classmethod
    def get_instance(cls) -> "PromptCache":
        """Get the singleton instance of PromptCache."""
        if cls._instance is None:
            with cls._instance_lock:
                if cls._instance is None:
                    cls._instance = cls()
        return cls._instance

    @classmethod
    def _reset_instance(cls) -> None:
        """Reset the singleton instance (for testing purposes only)."""
        with cls._instance_lock:
            if cls._instance is not None:
                cls._instance._cache.clear()
            cls._instance = None

    def __init__(self):
        # key -> (value, expiry_timestamp)
        self._cache: dict[PromptCacheKey, tuple[PromptVersion, float]] = {}
        self._lock = threading.RLock()

    def get(self, key: PromptCacheKey) -> PromptVersion | None:
        """
        Get a prompt from the cache.

        Returns the cached value, or None if not found or expired.
        Expired items are removed on access.
        """
        with self._lock:
            item = self._cache.get(key)
            if item is None:
                return None
            value, expiry = item
            if time.time() > expiry:
                self._cache.pop(key, None)
                return None
            return value

    def set(
        self,
        key: PromptCacheKey,
        value: PromptVersion,
        ttl_seconds: float | None = None,
    ) -> None:
        """
        Store a prompt in the cache.

        Args:
            key: Cache key created by PromptCacheKey.from_parts() or PromptCacheKey.from_uri()
            value: The prompt value to cache
            ttl_seconds: Time-to-live in seconds (default None, no TTL)
        """
        with self._lock:
            expiry = float("inf") if ttl_seconds is None else time.time() + ttl_seconds
            self._cache[key] = (value, expiry)

    def delete(
        self,
        prompt_name: str,
        version: int | None = None,
        alias: str | None = None,
    ) -> None:
        """Delete a prompt from the cache."""
        key = PromptCacheKey.from_parts(prompt_name, version, alias)
        with self._lock:
            self._cache.pop(key, None)

    def clear(self) -> None:
        """Clear all cached prompts."""
        with self._lock:
            self._cache.clear()
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/prophet/__init__.py

```python
"""
The ``mlflow.prophet`` module provides an API for logging and loading Prophet models.
This module exports univariate Prophet models in the following flavors:

Prophet (native) format
    This is the main flavor that can be accessed with Prophet APIs.
:py:mod:`mlflow.pyfunc`
    Produced for use by generic pyfunc-based deployment tools and for batch auditing
    of historical forecasts.

.. _Prophet:
    https://facebook.github.io/prophet/docs/quick_start.html#python-api
"""

import json
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

FLAVOR_NAME = "prophet"
_MODEL_BINARY_KEY = "data"
_MODEL_BINARY_FILE_NAME = "model.pr"
_MODEL_TYPE_KEY = "model_type"

_logger = logging.getLogger(__name__)


def get_default_pip_requirements():
    """
    Returns:
        A list of default pip requirements for MLflow Models produced by this flavor.
        Calls to :func:`save_model()` and :func:`log_model()` produce a pip environment
        that, at a minimum, contains these requirements.
    """
    # Note: Prophet's whl build process will fail due to missing dependencies, defaulting
    # to setup.py installation process.
    # If a pystan installation error occurs, ensure gcc>=8 is installed in your environment.
    # See: https://gcc.gnu.org/install/
    import prophet
    from packaging.version import Version

    pip_deps = [_get_pinned_requirement("prophet")]

    # cmdstanpy>=1.3.0 is not compatible with prophet<=1.2.0
    # https://github.com/facebook/prophet/issues/2697
    if Version(prophet.__version__) <= Version("1.2.0"):
        pip_deps.append("cmdstanpy<1.3.0")

    return pip_deps


def get_default_conda_env():
    """
    Returns:
        The default Conda environment for MLflow Models produced by calls to
        :func:`save_model()` and :func:`log_model()`.
    """
    return _mlflow_conda_env(additional_pip_deps=get_default_pip_requirements())


@format_docstring(LOG_MODEL_PARAM_DOCS.format(package_name=FLAVOR_NAME))
def save_model(
    pr_model,
    path,
    conda_env=None,
    code_paths=None,
    mlflow_model=None,
    signature: ModelSignature = None,
    input_example: ModelInputExample = None,
    pip_requirements=None,
    extra_pip_requirements=None,
    metadata=None,
):
    """
    Save a Prophet model to a path on the local file system.

    Args:
        pr_model: Prophet model (an instance of Prophet() forecaster that has been fit
            on a temporal series.
        path: Local path where the serialized model (as JSON) is to be saved.
        conda_env: {{ conda_env }}
        code_paths: {{ code_paths }}
        mlflow_model: :py:mod:`mlflow.models.Model` this flavor is being added to.
        signature: an instance of the :py:class:`ModelSignature <mlflow.models.ModelSignature>`
            class that describes the model's inputs and outputs. If not specified but an
            ``input_example`` is supplied, a signature will be automatically inferred
            based on the supplied input example and model. To disable automatic signature
            inference when providing an input example, set ``signature`` to ``False``.
            To manually infer a model signature, call
            :py:func:`infer_signature() <mlflow.models.infer_signature>` on datasets
            with valid model inputs, such as a training dataset with the target column
            omitted, and valid model outputs, like model predictions made on the training
            dataset, for example:

            .. code-block:: python

                from mlflow.models import infer_signature

                model = Prophet().fit(df)
                train = model.history
                predictions = model.predict(model.make_future_dataframe(30))
                signature = infer_signature(train, predictions)
        input_example: {{ input_example }}
        pip_requirements: {{ pip_requirements }}
        extra_pip_requirements: {{ extra_pip_requirements }}
        metadata: {{ metadata }}
    """
    import prophet

    _validate_env_arguments(conda_env, pip_requirements, extra_pip_requirements)

    path = os.path.abspath(path)
    _validate_and_prepare_target_save_path(path)
    code_dir_subpath = _validate_and_copy_code_paths(code_paths, path)

    if mlflow_model is None:
        mlflow_model = Model()
    saved_example = _save_example(mlflow_model, input_example, path)

    if signature is None and saved_example is not None:
        wrapped_model = _ProphetModelWrapper(pr_model)
        signature = _infer_signature_from_input_example(saved_example, wrapped_model)
    elif signature is False:
        signature = None

    if signature is not None:
        mlflow_model.signature = signature
    if metadata is not None:
        mlflow_model.metadata = metadata

    model_data_path = os.path.join(path, _MODEL_BINARY_FILE_NAME)
    _save_model(pr_model, model_data_path)

    model_bin_kwargs = {_MODEL_BINARY_KEY: _MODEL_BINARY_FILE_NAME}
    pyfunc.add_to_model(
        mlflow_model,
        loader_module="mlflow.prophet",
        conda_env=_CONDA_ENV_FILE_NAME,
        python_env=_PYTHON_ENV_FILE_NAME,
        code=code_dir_subpath,
        **model_bin_kwargs,
    )
    flavor_conf = {
        _MODEL_TYPE_KEY: pr_model.__class__.__name__,
        **model_bin_kwargs,
    }
    mlflow_model.add_flavor(
        FLAVOR_NAME,
        prophet_version=prophet.__version__,
        code=code_dir_subpath,
        **flavor_conf,
    )
    if size := get_total_file_size(path):
        mlflow_model.model_size_bytes = size
    mlflow_model.save(os.path.join(path, MLMODEL_FILE_NAME))

    if conda_env is None:
        default_reqs = None
        if pip_requirements is None:
            # cannot use inferred requirements due to prophet's build process
            # as the package installation of pystan requires Cython to be present
            # in the path. Prophet's installation itself requires imports of
            # existing libraries, preventing the execution of a batched pip install
            # and instead using a a strictly defined list of dependencies.
            # NOTE: if Prophet .whl build architecture is changed, this should be
            # modified to a standard inferred approach.
            default_reqs = get_default_pip_requirements()
        conda_env, pip_requirements, pip_constraints = _process_pip_requirements(
            default_reqs,
            pip_requirements,
            extra_pip_requirements,
        )
    else:
        conda_env, pip_requirements, pip_constraints = _process_conda_env(conda_env)

    with open(os.path.join(path, _CONDA_ENV_FILE_NAME), "w") as f:
        yaml.safe_dump(conda_env, stream=f, default_flow_style=False)

    if pip_constraints:
        write_to(os.path.join(path, _CONSTRAINTS_FILE_NAME), "\n".join(pip_constraints))

    write_to(os.path.join(path, _REQUIREMENTS_FILE_NAME), "\n".join(pip_requirements))

    _PythonEnv.current().to_yaml(os.path.join(path, _PYTHON_ENV_FILE_NAME))


@format_docstring(LOG_MODEL_PARAM_DOCS.format(package_name=FLAVOR_NAME))
def log_model(
    pr_model,
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
):
    """
    Logs a Prophet model as an MLflow artifact for the current run.

    Args:
        pr_model: Prophet model to be saved.
        artifact_path: Deprecated. Use `name` instead.
        conda_env: {{ conda_env }}
        code_paths: {{ code_paths }}
        registered_model_name: If given, create a model
            version under ``registered_model_name``, also creating a
            registered model if one with the given name does not exist.
        signature: An instance of the :py:class:`ModelSignature <mlflow.models.ModelSignature>`
            class that describes the model's inputs and outputs. If not specified but an
            ``input_example`` is supplied, a signature will be automatically inferred
            based on the supplied input example and model. To disable automatic signature
            inference when providing an input example, set ``signature`` to ``False``.
            To manually infer a model signature, call
            :py:func:`infer_signature() <mlflow.models.infer_signature>` on datasets
            with valid model inputs, such as a training dataset with the target column
            omitted, and valid model outputs, like model predictions made on the training
            dataset, for example:

            .. code-block:: python

                from mlflow.models import infer_signature

                model = Prophet().fit(df)
                train = model.history
                predictions = model.predict(model.make_future_dataframe(30))
                signature = infer_signature(train, predictions)

        input_example: {{ input_example }}
        await_registration_for: Number of seconds to wait for the model version
            to finish being created and is in ``READY`` status.
            By default, the function waits for five minutes.
            Specify 0 or None to skip waiting.
        pip_requirements: {{ pip_requirements }}
        extra_pip_requirements: {{ extra_pip_requirements }}
        metadata: {{ metadata }}
        name: {{ name }}
        params: {{ params }}
        tags: {{ tags }}
        model_type: {{ model_type }}
        step: {{ step }}
        model_id: {{ model_id }}

    Returns:
        A :py:class:`ModelInfo <mlflow.models.model.ModelInfo>` instance that contains the
        metadata of the logged model.
    """
    return Model.log(
        artifact_path=artifact_path,
        name=name,
        flavor=mlflow.prophet,
        registered_model_name=registered_model_name,
        pr_model=pr_model,
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
    )


def _save_model(model, path):
    from prophet.serialize import model_to_json

    model_ser = model_to_json(model)
    with open(path, "w") as f:
        json.dump(model_ser, f)


def _load_model(path):
    from prophet.serialize import model_from_json

    with open(path) as f:
        model = json.load(f)
    return model_from_json(model)


def _load_pyfunc(path):
    """
    Loads PyFunc implementation for Prophet. Called by ``pyfunc.load_model``.

    Args:
        path: Local filesystem path to the MLflow Model with the ``prophet`` flavor.
    """
    return _ProphetModelWrapper(_load_model(path))


def load_model(model_uri, dst_path=None):
    """
    Load a Prophet model from a local file or a run.

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
        A Prophet model instance
    """
    local_model_path = _download_artifact_from_uri(artifact_uri=model_uri, output_path=dst_path)
    flavor_conf = _get_flavor_configuration(model_path=local_model_path, flavor_name=FLAVOR_NAME)
    _add_code_from_conf_to_system_path(local_model_path, flavor_conf)
    pr_model_path = os.path.join(
        local_model_path, flavor_conf.get(_MODEL_BINARY_KEY, _MODEL_BINARY_FILE_NAME)
    )

    return _load_model(pr_model_path)


class _ProphetModelWrapper:
    def __init__(self, pr_model):
        self.pr_model = pr_model

    def get_raw_model(self):
        """
        Returns the underlying model.
        """
        return self.pr_model

    def predict(self, dataframe, params: dict[str, Any] | None = None):
        """
        Args:
            dataframe: Model input data.
            params: Additional parameters to pass to the model for inference.

        Returns:
            Model predictions.
        """
        return self.pr_model.predict(dataframe)
```

--------------------------------------------------------------------------------

````
