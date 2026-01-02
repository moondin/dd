---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 719
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 719 of 991)

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

---[FILE: registry.py]---
Location: mlflow-master/mlflow/tracking/_tracking_service/registry.py

```python
import threading
from functools import lru_cache

from mlflow.tracking.registry import StoreRegistry

_building_store_lock = threading.Lock()


class TrackingStoreRegistry(StoreRegistry):
    """Scheme-based registry for tracking store implementations

    This class allows the registration of a function or class to provide an
    implementation for a given scheme of `store_uri` through the `register`
    methods. Implementations declared though the entrypoints
    `mlflow.tracking_store` group can be automatically registered through the
    `register_entrypoints` method.

    When instantiating a store through the `get_store` method, the scheme of
    the store URI provided (or inferred from environment) will be used to
    select which implementation to instantiate, which will be called with same
    arguments passed to the `get_store` method.
    """

    def __init__(self):
        super().__init__("mlflow.tracking_store")

    def get_store(self, store_uri=None, artifact_uri=None):
        """Get a store from the registry based on the scheme of store_uri

        Args:
            store_uri: The store URI. If None, it will be inferred from the environment. This URI
                is used to select which tracking store implementation to instantiate and
                is passed to the constructor of the implementation.
            artifact_uri: Artifact repository URI. Passed through to the tracking store
                implementation.

        Returns:
            An instance of `mlflow.store.tracking.AbstractStore` that fulfills the store URI
            requirements.

        """
        from mlflow.tracking._tracking_service import utils

        resolved_store_uri = utils._resolve_tracking_uri(store_uri)
        return self._get_store_with_resolved_uri(resolved_store_uri, artifact_uri)

    @lru_cache(maxsize=100)
    def _get_store_with_resolved_uri(self, resolved_store_uri, artifact_uri=None):
        """
        Retrieve the store associated with a resolved (non-None) store URI and an artifact URI.
        Caching is done on resolved URIs because the meaning of an unresolved (None) URI may change
        depending on external configuration, such as environment variables
        """
        with _building_store_lock:
            builder = self.get_store_builder(resolved_store_uri)
            return builder(store_uri=resolved_store_uri, artifact_uri=artifact_uri)
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: mlflow-master/mlflow/tracking/_tracking_service/utils.py

```python
import logging
import os
from collections import OrderedDict
from contextlib import contextmanager
from functools import lru_cache, partial
from pathlib import Path
from typing import Generator

from mlflow.environment_variables import MLFLOW_TRACKING_URI
from mlflow.store.db.db_types import DATABASE_ENGINES
from mlflow.store.tracking import DEFAULT_LOCAL_FILE_AND_ARTIFACT_PATH, DEFAULT_TRACKING_URI
from mlflow.store.tracking.databricks_rest_store import DatabricksTracingRestStore
from mlflow.store.tracking.rest_store import RestStore
from mlflow.tracing.provider import reset
from mlflow.tracking._tracking_service.registry import TrackingStoreRegistry
from mlflow.utils.credentials import get_default_host_creds
from mlflow.utils.databricks_utils import get_databricks_host_creds
from mlflow.utils.file_utils import path_to_local_file_uri
from mlflow.utils.uri import (
    _DATABRICKS_UNITY_CATALOG_SCHEME,
    _OSS_UNITY_CATALOG_SCHEME,
    get_uri_scheme,
)

_logger = logging.getLogger(__name__)
_tracking_uri = None


def _has_existing_mlruns_data() -> bool:
    """
    Returns True if mlruns contains experiment data (meta.yaml files).

    This check is used to maintain backward compatibility when switching the default
    tracking URI from file-based storage to SQLite. If existing mlruns data is detected,
    the default remains as file-based storage to avoid breaking existing workflows.
    """
    from mlflow.store.tracking.file_store import FileStore

    mlruns_path = Path(DEFAULT_LOCAL_FILE_AND_ARTIFACT_PATH)
    if not mlruns_path.exists():
        return False

    try:
        for item in mlruns_path.iterdir():
            if item.is_dir() and item.name.isdigit():
                for f in item.iterdir():
                    if f.name == FileStore.META_DATA_FILE_NAME:
                        return True
    except (OSError, PermissionError):
        return False

    return False


def _get_default_tracking_uri() -> str:
    return (
        DEFAULT_LOCAL_FILE_AND_ARTIFACT_PATH
        if _has_existing_mlruns_data()
        else DEFAULT_TRACKING_URI
    )


def is_tracking_uri_set():
    """Returns True if the tracking URI has been set, False otherwise."""
    if _tracking_uri or MLFLOW_TRACKING_URI.get():
        return True
    return False


def set_tracking_uri(uri: str | Path) -> None:
    """
    Set the tracking server URI. This does not affect the
    currently active run (if one exists), but takes effect for successive runs.

    Args:
        uri:

            - An empty string, or a local file path, prefixed with ``file:/``. Data is stored
              locally at the provided file (or ``./mlruns`` if empty).
            - An HTTP URI like ``https://my-tracking-server:5000``.
            - A Databricks workspace, provided as the string "databricks" or, to use a Databricks
              CLI `profile <https://github.com/databricks/databricks-cli#installation>`_,
              "databricks://<profileName>".
            - A :py:class:`pathlib.Path` instance

    .. code-block:: python
        :test:
        :caption: Example

        import mlflow

        mlflow.set_tracking_uri("file:///tmp/my_tracking")
        tracking_uri = mlflow.get_tracking_uri()
        print(f"Current tracking uri: {tracking_uri}")

    .. code-block:: text
        :caption: Output

        Current tracking uri: file:///tmp/my_tracking
    """
    if isinstance(uri, Path):
        # On Windows with Python3.8 (https://bugs.python.org/issue38671)
        # .resolve() doesn't return the absolute path if the directory doesn't exist
        # so we're calling .absolute() first to get the absolute path on Windows,
        # then .resolve() to clean the path
        uri = uri.absolute().resolve().as_uri()
    global _tracking_uri

    if _tracking_uri != uri:
        _tracking_uri = uri
        if _tracking_uri is not None:
            # Set 'MLFLOW_TRACKING_URI' environment variable
            # so that subprocess can inherit it.
            MLFLOW_TRACKING_URI.set(_tracking_uri)
        else:
            MLFLOW_TRACKING_URI.unset()

        # Tracer provider uses tracking URI to determine where to export traces.
        # Tracer provider stores the URI as its state so we need to reset
        # it explicitly when the global tracking URI changes.
        reset()


@contextmanager
def _use_tracking_uri(uri: str) -> Generator[None, None, None]:
    """Temporarily use the specified tracking URI.

    Args:
        uri: The tracking URI to use.

    """
    old_tracking_uri = _tracking_uri
    try:
        set_tracking_uri(uri)
        yield
    finally:
        set_tracking_uri(old_tracking_uri)


def _resolve_tracking_uri(tracking_uri=None):
    return tracking_uri or get_tracking_uri()


def get_tracking_uri() -> str:
    """Get the current tracking URI. This may not correspond to the tracking URI of
    the currently active run, since the tracking URI can be updated via ``set_tracking_uri``.

    Returns:
        The tracking URI.

    .. code-block:: python

        import mlflow

        # Get the current tracking uri
        tracking_uri = mlflow.get_tracking_uri()
        print(f"Current tracking uri: {tracking_uri}")

    .. code-block:: text

        Current tracking uri: sqlite:///mlflow.db
    """
    if _tracking_uri is not None:
        return _tracking_uri
    elif uri := MLFLOW_TRACKING_URI.get():
        return uri
    else:
        default_uri = _get_default_tracking_uri()
        if default_uri == DEFAULT_LOCAL_FILE_AND_ARTIFACT_PATH:
            return path_to_local_file_uri(os.path.abspath(default_uri))
        return default_uri


def _get_file_store(store_uri, **_):
    from mlflow.store.tracking.file_store import FileStore

    return FileStore(store_uri, store_uri)


def _get_sqlalchemy_store(store_uri, artifact_uri):
    from mlflow.store.tracking.sqlalchemy_store import SqlAlchemyStore

    if artifact_uri is None:
        artifact_uri = DEFAULT_LOCAL_FILE_AND_ARTIFACT_PATH
    return SqlAlchemyStore(store_uri, artifact_uri)


def _get_rest_store(store_uri, **_):
    return RestStore(partial(get_default_host_creds, store_uri))


def _get_databricks_rest_store(store_uri, **_):
    return DatabricksTracingRestStore(partial(get_databricks_host_creds, store_uri))


def _get_databricks_uc_rest_store(store_uri, **_):
    from mlflow.exceptions import MlflowException
    from mlflow.version import VERSION

    supported_schemes = [
        scheme
        for scheme in _tracking_store_registry._registry
        if scheme not in {_DATABRICKS_UNITY_CATALOG_SCHEME, _OSS_UNITY_CATALOG_SCHEME}
    ]
    raise MlflowException(
        f"Detected Unity Catalog tracking URI '{store_uri}'. "
        "Setting the tracking URI to a Unity Catalog backend is not supported in the current "
        f"version of the MLflow client ({VERSION}). "
        "Please specify a different tracking URI via mlflow.set_tracking_uri, with "
        "one of the supported schemes: "
        f"{supported_schemes}. If you're trying to access models in the Unity "
        "Catalog, please upgrade to the latest version of the MLflow Python "
        "client, then specify a Unity Catalog model registry URI via "
        f"mlflow.set_registry_uri('{_DATABRICKS_UNITY_CATALOG_SCHEME}') or "
        f"mlflow.set_registry_uri('{_DATABRICKS_UNITY_CATALOG_SCHEME}://profile_name') where "
        "'profile_name' is the name of the Databricks CLI profile to use for "
        "authentication. A OSS Unity Catalog model registry URI can also be specified via "
        f"mlflow.set_registry_uri('{_OSS_UNITY_CATALOG_SCHEME}:http://localhost:8080')."
        "Be sure to leave the registry URI configured to use one of the supported"
        "schemes listed above."
    )


_tracking_store_registry = TrackingStoreRegistry()


def _register_tracking_stores():
    _tracking_store_registry.register("", _get_file_store)
    _tracking_store_registry.register("file", _get_file_store)
    _tracking_store_registry.register("databricks", _get_databricks_rest_store)
    _tracking_store_registry.register(
        _DATABRICKS_UNITY_CATALOG_SCHEME, _get_databricks_uc_rest_store
    )
    _tracking_store_registry.register(_OSS_UNITY_CATALOG_SCHEME, _get_databricks_uc_rest_store)

    for scheme in ["http", "https"]:
        _tracking_store_registry.register(scheme, _get_rest_store)

    for scheme in DATABASE_ENGINES:
        _tracking_store_registry.register(scheme, _get_sqlalchemy_store)

    _tracking_store_registry.register_entrypoints()


def _register(scheme, builder):
    _tracking_store_registry.register(scheme, builder)


_register_tracking_stores()


def _get_store(store_uri=None, artifact_uri=None):
    return _tracking_store_registry.get_store(store_uri, artifact_uri)


def _get_tracking_scheme(store_uri=None) -> str:
    resolved_store_uri = _resolve_tracking_uri(store_uri)
    return _get_tracking_scheme_with_resolved_uri(resolved_store_uri)


@lru_cache(maxsize=100)
def _get_tracking_scheme_with_resolved_uri(resolved_store_uri: str) -> str:
    scheme = (
        resolved_store_uri
        if resolved_store_uri in {"databricks", "databricks-uc", "uc"}
        else get_uri_scheme(resolved_store_uri)
    )
    builder = _tracking_store_registry._registry.get(scheme)
    if builder is None:
        return "None"
    if builder.__module__.split(".", 1)[0] != "mlflow":
        return "custom_scheme"
    return scheme


_artifact_repos_cache = OrderedDict()


def _get_artifact_repo(run_id):
    return _artifact_repos_cache.get(run_id)


# TODO(sueann): move to a projects utils module
def _get_git_url_if_present(uri):
    """Return the path git_uri#sub_directory if the URI passed is a local path that's part of
    a Git repo, or returns the original URI otherwise.

    Args:
        uri: The expanded uri.

    Returns:
        The git_uri#sub_directory if the uri is part of a Git repo, otherwise return the original
        uri.
    """
    if "#" in uri:
        # Already a URI in git repo format
        return uri
    try:
        from git import GitCommandNotFound, InvalidGitRepositoryError, NoSuchPathError, Repo
    except ImportError as e:
        _logger.warning(
            "Failed to import Git (the git executable is probably not on your PATH),"
            " so Git SHA is not available. Error: %s",
            e,
        )
        return uri
    try:
        # Check whether this is part of a git repo
        repo = Repo(uri, search_parent_directories=True)

        # Repo url
        repo_url = f"file://{repo.working_tree_dir}"

        # Sub directory
        rlpath = uri.replace(repo.working_tree_dir, "")
        if rlpath == "":
            git_path = repo_url
        elif rlpath[0] == "/":
            git_path = repo_url + "#" + rlpath[1:]
        else:
            git_path = repo_url + "#" + rlpath
        return git_path
    except (InvalidGitRepositoryError, GitCommandNotFound, ValueError, NoSuchPathError):
        return uri
```

--------------------------------------------------------------------------------

---[FILE: flavor_config.py]---
Location: mlflow-master/mlflow/transformers/flavor_config.py

```python
from __future__ import annotations

import json
import os
from typing import TYPE_CHECKING, Any

from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import ALREADY_EXISTS, INVALID_PARAMETER_VALUE
from mlflow.transformers.hub_utils import get_latest_commit_for_repo
from mlflow.transformers.peft import _PEFT_ADAPTOR_DIR_NAME, get_peft_base_model, is_peft_model
from mlflow.transformers.torch_utils import _extract_torch_dtype_if_set

if TYPE_CHECKING:
    import transformers


# Flavor configuration keys
class FlavorKey:
    TASK = "task"
    INSTANCE_TYPE = "instance_type"
    TORCH_DTYPE = "torch_dtype"
    FRAMEWORK = "framework"

    MODEL = "model"
    MODEL_TYPE = "pipeline_model_type"
    MODEL_BINARY = "model_binary"
    MODEL_NAME = "source_model_name"
    MODEL_REVISION = "source_model_revision"

    PEFT = "peft_adaptor"

    COMPONENTS = "components"
    COMPONENT_NAME = "{}_name"  # e.g. tokenizer_name
    COMPONENT_REVISION = "{}_revision"
    COMPONENT_TYPE = "{}_type"
    TOKENIZER = "tokenizer"
    FEATURE_EXTRACTOR = "feature_extractor"
    IMAGE_PROCESSOR = "image_processor"
    PROCESSOR = "processor"
    PROCESSOR_TYPE = "processor_type"

    PROMPT_TEMPLATE = "prompt_template"


def build_flavor_config(
    pipeline: transformers.Pipeline, processor=None, torch_dtype=None, save_pretrained=True
) -> dict[str, Any]:
    """
    Generates the base flavor metadata needed for reconstructing a pipeline from saved
    components. This is important because the ``Pipeline`` class does not have a loader
    functionality. The serialization of a Pipeline saves the model, configurations, and
    metadata for ``FeatureExtractor``s, ``Processor``s, and ``Tokenizer``s exclusively.
    This function extracts key information from the submitted model object so that the precise
    instance types can be loaded correctly.

    Args:
        pipeline: Transformer pipeline to generate the flavor configuration for.
        processor: Optional processor instance to save alongside the pipeline.
        torch_dtype: Torch tensor data type.
        save_pretrained: Whether to save the pipeline and components weights to local disk.

    Returns:
        A dictionary containing the flavor configuration for the pipeline and its components,
        i.e. the configurations stored in "transformers" key in the MLModel YAML file.
    """
    flavor_conf = _generate_base_config(pipeline, torch_dtype=torch_dtype)

    if is_peft_model(pipeline.model):
        flavor_conf[FlavorKey.PEFT] = _PEFT_ADAPTOR_DIR_NAME
        model = get_peft_base_model(pipeline.model)
    else:
        model = pipeline.model

    flavor_conf.update(_get_model_config(model, save_pretrained))

    components = _get_components_from_pipeline(pipeline, processor)
    for key, instance in components.items():
        # Some components don't have name_or_path, then we fallback to the one from the model.
        flavor_conf.update(
            _get_component_config(instance, key, save_pretrained, default_repo=model.name_or_path)
        )

    # "components" field doesn't include processor
    components.pop(FlavorKey.PROCESSOR, None)
    flavor_conf[FlavorKey.COMPONENTS] = list(components.keys())

    return flavor_conf


def _generate_base_config(pipeline, torch_dtype=None):
    flavor_conf = {
        FlavorKey.TASK: pipeline.task,
        FlavorKey.INSTANCE_TYPE: _get_instance_type(pipeline),
    }

    if framework := getattr(pipeline, "framework", None):
        flavor_conf[FlavorKey.FRAMEWORK] = framework

    # User-provided torch_dtype takes precedence
    if torch_dtype := (torch_dtype or _extract_torch_dtype_if_set(pipeline)):
        flavor_conf[FlavorKey.TORCH_DTYPE] = str(torch_dtype)

    return flavor_conf


def _get_model_config(model, save_pretrained=True):
    conf = {
        FlavorKey.MODEL_TYPE: _get_instance_type(model),
        FlavorKey.MODEL_NAME: model.name_or_path,
    }

    if save_pretrained:
        # log local path to model binary file
        from mlflow.transformers.model_io import _MODEL_BINARY_FILE_NAME

        conf[FlavorKey.MODEL_BINARY] = _MODEL_BINARY_FILE_NAME
    else:
        # log HuggingFace repo name and commit hash
        conf[FlavorKey.MODEL_REVISION] = get_latest_commit_for_repo(model.name_or_path)

    return conf


def _get_component_config(
    component: Any,
    key: str,
    save_pretrained: bool = True,
    default_repo: str | None = None,
    commit_sha: str | None = None,
):
    conf = {FlavorKey.COMPONENT_TYPE.format(key): _get_instance_type(component)}

    # Log source repo name and commit sha for the component
    if not save_pretrained:
        repo = getattr(component, "name_or_path", default_repo)
        revision = commit_sha or get_latest_commit_for_repo(repo)
        conf[FlavorKey.COMPONENT_NAME.format(key)] = repo
        conf[FlavorKey.COMPONENT_REVISION.format(key)] = revision

    return conf


def _get_components_from_pipeline(pipeline, processor=None):
    supported_component_names = [
        FlavorKey.FEATURE_EXTRACTOR,
        FlavorKey.TOKENIZER,
        FlavorKey.IMAGE_PROCESSOR,
    ]

    components = {}
    for name in supported_component_names:
        if instance := getattr(pipeline, name, None):
            components[name] = instance

    if processor:
        components[FlavorKey.PROCESSOR] = processor

    return components


def _get_instance_type(obj):
    """
    Utility for extracting the saved object type or, if the `base` argument is set to `True`,
    the base ABC type of the model.
    """
    return obj.__class__.__name__


def build_flavor_config_from_local_checkpoint(
    local_checkpoint_dir: str,
    task: str,
    processor=None,
    torch_dtype=None,
) -> dict[str, Any]:
    """
    Generates the flavor metadata from a Hugging Face model repository ID
    e.g. "meta-llama/Meta-Llama-3.1-405B, instead of the pipeline instance in-memory.
    """
    from transformers import AutoTokenizer, pipelines
    from transformers.utils import is_torch_available

    from mlflow.transformers.model_io import _MODEL_BINARY_FILE_NAME

    config_path = os.path.join(local_checkpoint_dir, "config.json")
    if not os.path.exists(config_path):
        raise MlflowException(
            f"The provided directory {local_checkpoint_dir} does not contain a config.json file."
            "Please ensure that the directory contains a valid transformers model checkpoint.",
            error_code=INVALID_PARAMETER_VALUE,
        )

    with open(config_path) as f:
        config = json.load(f)

    task_metadata = pipelines.check_task(task)
    pipeline_class = task_metadata[1]["impl"].__name__
    flavor_conf = {
        FlavorKey.TASK: task,
        FlavorKey.INSTANCE_TYPE: pipeline_class,
        FlavorKey.FRAMEWORK: "pt" if is_torch_available() else "tf",
        FlavorKey.TORCH_DTYPE: str(torch_dtype) if torch_dtype else None,
        FlavorKey.MODEL_TYPE: config["architectures"][0],
        FlavorKey.MODEL_NAME: local_checkpoint_dir,
        FlavorKey.MODEL_BINARY: _MODEL_BINARY_FILE_NAME,
    }

    components = {FlavorKey.TOKENIZER}
    try:
        tokenizer = AutoTokenizer.from_pretrained(local_checkpoint_dir)
    except OSError as e:
        raise MlflowException(
            f"Error loading tokenizer from {local_checkpoint_dir}. When logging a "
            "Transformers model from a local checkpoint, please make sure that the "
            "checkpoint directory contains a valid tokenizer configuration as well.",
            error_code=INVALID_PARAMETER_VALUE,
        ) from e

    tokenizer_conf = _get_component_config(tokenizer, FlavorKey.TOKENIZER)
    flavor_conf.update(tokenizer_conf)

    if processor:
        flavor_conf.update(_get_component_config(processor, FlavorKey.PROCESSOR))

    flavor_conf[FlavorKey.COMPONENTS] = list(components)
    return flavor_conf


def update_flavor_conf_to_persist_pretrained_model(
    original_flavor_conf: dict[str, Any],
) -> dict[str, Any]:
    """
    Updates the flavor configuration that was saved with save_pretrained=False to the one that
    includes the local path to the model binary file.
    """
    flavor_conf = original_flavor_conf.copy()

    # Replace model commit path with local path
    if FlavorKey.MODEL_BINARY in original_flavor_conf:
        raise MlflowException(
            "It appears that the pretrained model weight is already saved to the artifact path.",
            error_code=ALREADY_EXISTS,
        )

    from mlflow.transformers.model_io import _MODEL_BINARY_FILE_NAME

    flavor_conf[FlavorKey.MODEL_BINARY] = _MODEL_BINARY_FILE_NAME
    flavor_conf.pop(FlavorKey.MODEL_REVISION, None)

    # Remove component repo name and commit hash
    components = original_flavor_conf.get(FlavorKey.COMPONENTS, [])
    if FlavorKey.PROCESSOR_TYPE in original_flavor_conf:
        components.append(FlavorKey.PROCESSOR)

    for component in components:
        flavor_conf.pop(FlavorKey.COMPONENT_NAME.format(component), None)
        flavor_conf.pop(FlavorKey.COMPONENT_REVISION.format(component), None)

    return flavor_conf
```

--------------------------------------------------------------------------------

---[FILE: hub_utils.py]---
Location: mlflow-master/mlflow/transformers/hub_utils.py

```python
import functools
import logging
import os
import time

from mlflow.environment_variables import _MLFLOW_TESTING
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import RESOURCE_DOES_NOT_EXIST

_logger = logging.getLogger(__name__)


# NB: The maxsize=1 is added for encouraging the cache refresh so the user doesn't get stale
#    commit hash from the cache. This doesn't work perfectly because it only updates cache
#    when the user calls it with a different repo name, but it's better than nothing.
@functools.lru_cache(maxsize=1)
def get_latest_commit_for_repo(repo: str) -> str:
    """
    Fetches the latest commit hash for a repository from the HuggingFace model hub.
    """
    try:
        import huggingface_hub as hub
    except ImportError:
        raise MlflowException(
            "Unable to fetch model commit hash from the HuggingFace model hub. "
            "This is required for saving Transformer model without base model "
            "weights, while ensuring the version consistency of the model. "
            "Please install the `huggingface-hub` package and retry.",
            error_code=RESOURCE_DOES_NOT_EXIST,
        )

    from huggingface_hub.errors import HfHubHTTPError

    api = hub.HfApi()
    for i in range(7):
        try:
            return api.model_info(repo).sha
        except HfHubHTTPError as e:
            if not _MLFLOW_TESTING.get():
                raise

            # Retry on rate limit error
            if e.response.status_code == 429:
                _logger.warning(
                    f"Rate limit exceeded while fetching commit hash for repo {repo}. "
                    f"Retrying in {2**i} seconds. Error: {e}",
                )
                time.sleep(2**i)
                continue
            raise

    raise MlflowException(
        "Unable to fetch model commit hash from the HuggingFace model hub. "
        "This is required for saving Transformer model without base model "
        "weights, while ensuring the version consistency of the model. ",
        error_code=RESOURCE_DOES_NOT_EXIST,
    )


def is_valid_hf_repo_id(maybe_repo_id: str | None) -> bool:
    """
    Check if the given string is a valid HuggingFace repo identifier e.g. "username/repo_id".
    """

    if not maybe_repo_id or os.path.isdir(maybe_repo_id):
        return False

    try:
        from huggingface_hub.utils import HFValidationError, validate_repo_id
    except ImportError:
        raise MlflowException(
            "Unable to validate the repository identifier for the HuggingFace model hub "
            "because the `huggingface-hub` package is not installed. Please install the "
            "package with `pip install huggingface-hub` command and retry."
        )

    try:
        validate_repo_id(maybe_repo_id)
        return True
    except HFValidationError as e:
        _logger.warning(f"The repository identified {maybe_repo_id} is invalid: {e}")
        return False
```

--------------------------------------------------------------------------------

````
