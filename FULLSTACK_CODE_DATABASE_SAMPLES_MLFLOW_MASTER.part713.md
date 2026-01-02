---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 713
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 713 of 991)

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

---[FILE: metric_value_conversion_utils.py]---
Location: mlflow-master/mlflow/tracking/metric_value_conversion_utils.py

```python
import sys

from mlflow.exceptions import INVALID_PARAMETER_VALUE, MlflowException


def _is_module_imported(module_name: str) -> bool:
    return module_name in sys.modules


def _try_get_item(x):
    try:
        return x.item()
    except Exception as e:
        raise MlflowException(
            f"Failed to convert metric value to float: {e}",
            error_code=INVALID_PARAMETER_VALUE,
        )


def _converter_requires(module_name: str):
    """Wrapper function that checks if specified `module_name` is already imported before
    invoking wrapped function.
    """

    def decorator(func):
        def wrapper(x):
            if not _is_module_imported(module_name):
                return x

            return func(x)

        return wrapper

    return decorator


def convert_metric_value_to_float_if_possible(x) -> float:
    if x is None or type(x) == float:
        return x

    converter_fns_to_try = [
        convert_metric_value_to_float_if_ndarray,
        convert_metric_value_to_float_if_tensorflow_tensor,
        convert_metric_value_to_float_if_torch_tensor,
    ]

    for converter_fn in converter_fns_to_try:
        possible_float = converter_fn(x)
        if type(possible_float) == float:
            return possible_float

    try:
        return float(x)
    except ValueError:
        return x  # let backend handle conversion if possible


@_converter_requires("numpy")
def convert_metric_value_to_float_if_ndarray(x):
    import numpy as np

    if isinstance(x, np.ndarray):
        return float(_try_get_item(x))

    return x


@_converter_requires("torch")
def convert_metric_value_to_float_if_torch_tensor(x):
    import torch

    if isinstance(x, torch.Tensor):
        extracted_tensor_val = x.detach().cpu()

        return float(_try_get_item(extracted_tensor_val))

    return x


@_converter_requires("tensorflow")
def convert_metric_value_to_float_if_tensorflow_tensor(x):
    import tensorflow as tf

    if isinstance(x, tf.Tensor):
        try:
            return float(x)
        except Exception as e:
            raise MlflowException(
                f"Failed to convert metric value to float: {e!r}",
                error_code=INVALID_PARAMETER_VALUE,
            )

    return x
```

--------------------------------------------------------------------------------

---[FILE: multimedia.py]---
Location: mlflow-master/mlflow/tracking/multimedia.py

```python
"""
Internal module implementing multi-media objects and utilities in MLflow. Multi-media objects are
exposed to users at the top-level :py:mod:`mlflow` module.
"""

import warnings
from typing import TYPE_CHECKING, Any, Union

if TYPE_CHECKING:
    import numpy
    import PIL


COMPRESSED_IMAGE_SIZE = 256


def compress_image_size(
    image: "PIL.Image.Image", max_size: int | None = COMPRESSED_IMAGE_SIZE
) -> "PIL.Image.Image":
    """
    Scale the image to fit within a square with length `max_size` while maintaining
    the aspect ratio.
    """
    # scale the image to max(width, height) <= compressed_file_max_size
    width, height = image.size
    if width > height:
        new_width = max_size
        new_height = int(height * (new_width / width))
    else:
        new_height = max_size
        new_width = int(width * (new_height / height))
    return image.resize((new_width, new_height))


def convert_to_pil_image(image: Union["numpy.ndarray", list[Any]]) -> "PIL.Image.Image":
    """
    Convert a numpy array to a PIL image.
    """
    import numpy as np

    try:
        from PIL import Image
    except ImportError as exc:
        raise ImportError(
            "Pillow is required to serialize a numpy array as an image. "
            "Please install it via: `pip install Pillow`"
        ) from exc

    def _normalize_to_uint8(x):
        is_int = np.issubdtype(x.dtype, np.integer)
        low = 0
        high = 255 if is_int else 1
        if x.min() < low or x.max() > high:
            if is_int:
                raise ValueError(
                    "Integer pixel values out of acceptable range [0, 255]. "
                    f"Found minimum value {x.min()} and maximum value {x.max()}. "
                    "Ensure all pixel values are within the specified range."
                )
            else:
                warnings.warn(
                    "Float pixel values out of acceptable range [0.0, 1.0]. "
                    f"Found minimum value {x.min()} and maximum value {x.max()}. "
                    "Rescaling values to [0.0, 1.0] with min/max scaler.",
                    stacklevel=2,
                )
                # Min-max scaling
                x = (x - x.min()) / (x.max() - x.min())

        # float or bool
        if not is_int:
            x = x * 255

        return x.astype(np.uint8)

    # Ref.: https://numpy.org/doc/stable/reference/generated/numpy.dtype.kind.html#numpy-dtype-kind
    valid_data_types = {
        "b": "bool",
        "i": "signed integer",
        "u": "unsigned integer",
        "f": "floating",
    }

    if image.dtype.kind not in valid_data_types:
        raise TypeError(
            f"Invalid array data type: '{image.dtype}'. "
            f"Must be one of {list(valid_data_types.values())}"
        )

    if image.ndim not in [2, 3]:
        raise ValueError(f"`image` must be a 2D or 3D array but got image shape: {image.shape}")

    if (image.ndim == 3) and (image.shape[2] not in [1, 3, 4]):
        raise ValueError(f"Invalid channel length: {image.shape[2]}. Must be one of [1, 3, 4]")

    # squeeze a 3D grayscale image since `Image.fromarray` doesn't accept it.
    if image.ndim == 3 and image.shape[2] == 1:
        image = image[:, :, 0]

    image = _normalize_to_uint8(image)
    return Image.fromarray(image)


# MLflow media object: Image
class Image:
    """
    `mlflow.Image` is an image media object that provides a lightweight option
    for handling images in MLflow.
    The image can be a numpy array, a PIL image, or a file path to an image. The image is
    stored as a PIL image and can be logged to MLflow using `mlflow.log_image` or
    `mlflow.log_table`.

    Args:
        image: Image can be a numpy array, a PIL image, or a file path to an image.

    .. code-block:: python
        :caption: Example

        import mlflow
        import numpy as np
        from PIL import Image

        # Create an image as a numpy array
        image = np.zeros((100, 100, 3), dtype=np.uint8)
        image[:, :50] = [255, 128, 0]
        # Create an Image object
        image_obj = mlflow.Image(image)
        # Convert the Image object to a list of pixel values
        pixel_values = image_obj.to_list()
    """

    def __init__(self, image: Union["numpy.ndarray", "PIL.Image.Image", str, list[Any]]):
        import numpy as np

        try:
            from PIL import Image
        except ImportError as exc:
            raise ImportError(
                "`mlflow.Image` requires Pillow to serialize a numpy array as an image. "
                "Please install it via: `pip install Pillow`."
            ) from exc

        if isinstance(image, str):
            self.image = Image.open(image)
        elif isinstance(image, (list, np.ndarray)):
            self.image = convert_to_pil_image(np.array(image))
        elif isinstance(image, Image.Image):
            self.image = image
        else:
            raise TypeError(
                f"Unsupported image object type: {type(image)}. "
                "`image` must be one of numpy.ndarray, "
                "PIL.Image.Image, or a filepath to an image."
            )
        self.size = self.image.size

    def to_list(self):
        """
        Convert the image to a list of pixel values.

        Returns:
            List of pixel values.
        """
        return list(self.image.getdata())

    def to_array(self):
        """
        Convert the image to a numpy array.

        Returns:
            Numpy array of pixel values.
        """
        import numpy as np

        return np.array(self.image)

    def to_pil(self):
        """
        Convert the image to a PIL image.

        Returns:
            PIL image.
        """
        return self.image

    def save(self, path: str):
        """
        Save the image to a file.

        Args:
            path: File path to save the image.
        """
        self.image.save(path)

    def resize(self, size: tuple[int, int]):
        """
        Resize the image to the specified size.

        Args:
            size: Size to resize the image to.

        Returns:
            A copy of the resized image object.
        """
        image = self.image.resize(size)
        return Image(image)
```

--------------------------------------------------------------------------------

---[FILE: registry.py]---
Location: mlflow-master/mlflow/tracking/registry.py

```python
import warnings
from abc import ABCMeta

from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE
from mlflow.utils.plugins import get_entry_points
from mlflow.utils.uri import get_uri_scheme


class UnsupportedModelRegistryStoreURIException(MlflowException):
    """Exception thrown when building a model registry store with an unsupported URI"""

    def __init__(self, unsupported_uri, supported_uri_schemes):
        message = (
            " Model registry functionality is unavailable; got unsupported URI"
            f" '{unsupported_uri}' for model registry data storage. Supported URI schemes are:"
            f" {supported_uri_schemes}."
            " See https://www.mlflow.org/docs/latest/tracking.html#storage for how to run"
            " an MLflow server against one of the supported backend storage locations."
        )
        super().__init__(message, error_code=INVALID_PARAMETER_VALUE)
        self.supported_uri_schemes = supported_uri_schemes


class StoreRegistry:
    """
    Abstract class defining a scheme-based registry for store implementations.

    This class allows the registration of a function or class to provide an
    implementation for a given scheme of `store_uri` through the `register`
    methods. Implementations declared though the entrypoints can be automatically
    registered through the `register_entrypoints` method.

    When instantiating a store through the `get_store` method, the scheme of
    the store URI provided (or inferred from environment) will be used to
    select which implementation to instantiate, which will be called with same
    arguments passed to the `get_store` method.
    """

    __metaclass__ = ABCMeta

    def __init__(self, group_name):
        self._registry = {}
        self.group_name = group_name

    def register(self, scheme, store_builder):
        self._registry[scheme] = store_builder

    def register_entrypoints(self):
        """Register tracking stores provided by other packages"""
        for entrypoint in get_entry_points(self.group_name):
            try:
                self.register(entrypoint.name, entrypoint.load())
            except (AttributeError, ImportError) as exc:
                warnings.warn(
                    'Failure attempting to register store for scheme "{}": {}'.format(
                        entrypoint.name, str(exc)
                    ),
                    stacklevel=2,
                )

    def get_store_builder(self, store_uri):
        """Get a store from the registry based on the scheme of store_uri

        Args:
            store_uri: The store URI. If None, it will be inferred from the environment. This
                URI is used to select which tracking store implementation to instantiate
                and is passed to the constructor of the implementation.

        Returns:
            A function that returns an instance of
            ``mlflow.store.{tracking|model_registry}.AbstractStore`` that fulfills the store
            URI requirements.
        """
        scheme = (
            store_uri
            if store_uri in {"databricks", "databricks-uc", "uc"}
            else get_uri_scheme(store_uri)
        )
        try:
            store_builder = self._registry[scheme]
        except KeyError:
            raise UnsupportedModelRegistryStoreURIException(
                unsupported_uri=store_uri, supported_uri_schemes=list(self._registry.keys())
            )
        return store_builder
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/tracking/__init__.py

```python
"""
The ``mlflow.tracking`` module provides a Python CRUD interface to MLflow experiments
and runs. This is a lower level API that directly translates to MLflow
`REST API <../rest-api.html>`_ calls.
For a higher level API for managing an "active run", use the :py:mod:`mlflow` module.
"""

# Minimum APIs required for core tracing functionality of mlflow-tracing package.
from mlflow.tracking._tracking_service.utils import (
    _get_artifact_repo,
    _get_store,
    get_tracking_uri,
    is_tracking_uri_set,
    set_tracking_uri,
)
from mlflow.version import IS_TRACING_SDK_ONLY

__all__ = [
    "get_tracking_uri",
    "set_tracking_uri",
    "is_tracking_uri_set",
    "_get_artifact_repo",
    "_get_store",
]

# Importing the following APIs only if mlflow or mlflow-skinny is installed.
if not IS_TRACING_SDK_ONLY:
    from mlflow.tracking._model_registry.utils import (
        get_registry_uri,
        set_registry_uri,
    )
    from mlflow.tracking._tracking_service.utils import _get_artifact_repo
    from mlflow.tracking.client import MlflowClient

    __all__ += [
        "get_registry_uri",
        "set_registry_uri",
        "MlflowClient",
    ]
```

--------------------------------------------------------------------------------

---[FILE: abstract_context.py]---
Location: mlflow-master/mlflow/tracking/context/abstract_context.py

```python
from abc import ABCMeta, abstractmethod

from mlflow.utils.annotations import developer_stable


@developer_stable
class RunContextProvider:
    """
    Abstract base class for context provider objects specifying custom tags at run-creation time
    (e.g. tags specifying the git repo with which the run is associated).

    When a run is created via the fluent ``mlflow.start_run`` method, MLflow iterates through all
    registered RunContextProviders. For each context provider where ``in_context`` returns ``True``,
    MLflow calls the ``tags`` method on the context provider to compute context tags for the run.
    All context tags are then merged together and set on the newly-created run.
    """

    __metaclass__ = ABCMeta

    @abstractmethod
    def in_context(self):
        """Determine if MLflow is running in this context.

        Returns:
            bool indicating if in this context.

        """

    @abstractmethod
    def tags(self):
        """Generate context-specific tags.

        Returns:
            dict of tags.
        """
```

--------------------------------------------------------------------------------

---[FILE: databricks_cluster_context.py]---
Location: mlflow-master/mlflow/tracking/context/databricks_cluster_context.py

```python
from mlflow.tracking.context.abstract_context import RunContextProvider
from mlflow.utils import databricks_utils
from mlflow.utils.mlflow_tags import MLFLOW_DATABRICKS_CLUSTER_ID


class DatabricksClusterRunContext(RunContextProvider):
    def in_context(self):
        return databricks_utils.is_in_cluster()

    def tags(self):
        cluster_id = databricks_utils.get_cluster_id()
        tags = {}
        if cluster_id is not None:
            tags[MLFLOW_DATABRICKS_CLUSTER_ID] = cluster_id
        return tags
```

--------------------------------------------------------------------------------

---[FILE: databricks_command_context.py]---
Location: mlflow-master/mlflow/tracking/context/databricks_command_context.py

```python
from mlflow.tracking.context.abstract_context import RunContextProvider
from mlflow.utils import databricks_utils
from mlflow.utils.mlflow_tags import MLFLOW_DATABRICKS_NOTEBOOK_COMMAND_ID


class DatabricksCommandRunContext(RunContextProvider):
    def in_context(self):
        return databricks_utils.get_job_group_id() is not None

    def tags(self):
        job_group_id = databricks_utils.get_job_group_id()
        tags = {}
        if job_group_id is not None:
            tags[MLFLOW_DATABRICKS_NOTEBOOK_COMMAND_ID] = job_group_id
        return tags
```

--------------------------------------------------------------------------------

---[FILE: databricks_job_context.py]---
Location: mlflow-master/mlflow/tracking/context/databricks_job_context.py

```python
from mlflow.entities import SourceType
from mlflow.tracking.context.abstract_context import RunContextProvider
from mlflow.utils import databricks_utils
from mlflow.utils.mlflow_tags import (
    MLFLOW_DATABRICKS_JOB_ID,
    MLFLOW_DATABRICKS_JOB_RUN_ID,
    MLFLOW_DATABRICKS_JOB_TYPE,
    MLFLOW_DATABRICKS_WEBAPP_URL,
    MLFLOW_DATABRICKS_WORKSPACE_ID,
    MLFLOW_DATABRICKS_WORKSPACE_URL,
    MLFLOW_SOURCE_NAME,
    MLFLOW_SOURCE_TYPE,
)


class DatabricksJobRunContext(RunContextProvider):
    def in_context(self):
        return databricks_utils.is_in_databricks_job()

    def tags(self):
        job_id = databricks_utils.get_job_id()
        job_run_id = databricks_utils.get_job_run_id()
        job_type = databricks_utils.get_job_type()
        webapp_url = databricks_utils.get_webapp_url()
        workspace_url = databricks_utils.get_workspace_url()
        workspace_id = databricks_utils.get_workspace_id()
        tags = {
            MLFLOW_SOURCE_NAME: (
                f"jobs/{job_id}/run/{job_run_id}"
                if job_id is not None and job_run_id is not None
                else None
            ),
            MLFLOW_SOURCE_TYPE: SourceType.to_string(SourceType.JOB),
        }
        if job_id is not None:
            tags[MLFLOW_DATABRICKS_JOB_ID] = job_id
        if job_run_id is not None:
            tags[MLFLOW_DATABRICKS_JOB_RUN_ID] = job_run_id
        if job_type is not None:
            tags[MLFLOW_DATABRICKS_JOB_TYPE] = job_type
        if webapp_url is not None:
            tags[MLFLOW_DATABRICKS_WEBAPP_URL] = webapp_url
        if workspace_url is not None:
            tags[MLFLOW_DATABRICKS_WORKSPACE_URL] = workspace_url
        else:
            workspace_url_fallback, _ = databricks_utils.get_workspace_info_from_dbutils()
            if workspace_url_fallback is not None:
                tags[MLFLOW_DATABRICKS_WORKSPACE_URL] = workspace_url_fallback
        if workspace_id is not None:
            tags[MLFLOW_DATABRICKS_WORKSPACE_ID] = workspace_id
        return tags
```

--------------------------------------------------------------------------------

---[FILE: databricks_notebook_context.py]---
Location: mlflow-master/mlflow/tracking/context/databricks_notebook_context.py

```python
from mlflow.entities import SourceType
from mlflow.tracking.context.abstract_context import RunContextProvider
from mlflow.utils import databricks_utils
from mlflow.utils.mlflow_tags import (
    MLFLOW_DATABRICKS_NOTEBOOK_ID,
    MLFLOW_DATABRICKS_NOTEBOOK_PATH,
    MLFLOW_DATABRICKS_WEBAPP_URL,
    MLFLOW_DATABRICKS_WORKSPACE_ID,
    MLFLOW_DATABRICKS_WORKSPACE_URL,
    MLFLOW_SOURCE_NAME,
    MLFLOW_SOURCE_TYPE,
)


class DatabricksNotebookRunContext(RunContextProvider):
    def in_context(self):
        return databricks_utils.is_in_databricks_notebook()

    def tags(self):
        notebook_id = databricks_utils.get_notebook_id()
        notebook_path = databricks_utils.get_notebook_path()
        webapp_url = databricks_utils.get_webapp_url()
        workspace_url = databricks_utils.get_workspace_url()
        workspace_id = databricks_utils.get_workspace_id()
        tags = {
            MLFLOW_SOURCE_NAME: notebook_path,
            MLFLOW_SOURCE_TYPE: SourceType.to_string(SourceType.NOTEBOOK),
        }
        if notebook_id is not None:
            tags[MLFLOW_DATABRICKS_NOTEBOOK_ID] = notebook_id
        if notebook_path is not None:
            tags[MLFLOW_DATABRICKS_NOTEBOOK_PATH] = notebook_path
        if webapp_url is not None:
            tags[MLFLOW_DATABRICKS_WEBAPP_URL] = webapp_url
        if workspace_url is not None:
            tags[MLFLOW_DATABRICKS_WORKSPACE_URL] = workspace_url
        else:
            workspace_url_fallback, _ = databricks_utils.get_workspace_info_from_dbutils()
            if workspace_url_fallback is not None:
                tags[MLFLOW_DATABRICKS_WORKSPACE_URL] = workspace_url_fallback
        if workspace_id is not None:
            tags[MLFLOW_DATABRICKS_WORKSPACE_ID] = workspace_id
        return tags
```

--------------------------------------------------------------------------------

---[FILE: databricks_repo_context.py]---
Location: mlflow-master/mlflow/tracking/context/databricks_repo_context.py

```python
from mlflow.tracking.context.abstract_context import RunContextProvider
from mlflow.utils import databricks_utils
from mlflow.utils.mlflow_tags import (
    MLFLOW_DATABRICKS_GIT_REPO_COMMIT,
    MLFLOW_DATABRICKS_GIT_REPO_PROVIDER,
    MLFLOW_DATABRICKS_GIT_REPO_REFERENCE,
    MLFLOW_DATABRICKS_GIT_REPO_REFERENCE_TYPE,
    MLFLOW_DATABRICKS_GIT_REPO_RELATIVE_PATH,
    MLFLOW_DATABRICKS_GIT_REPO_STATUS,
    MLFLOW_DATABRICKS_GIT_REPO_URL,
)


class DatabricksRepoRunContext(RunContextProvider):
    def in_context(self):
        return databricks_utils.is_in_databricks_repo()

    def tags(self):
        tags = {}
        git_repo_url = databricks_utils.get_git_repo_url()
        git_repo_provider = databricks_utils.get_git_repo_provider()
        git_repo_commit = databricks_utils.get_git_repo_commit()
        git_repo_relative_path = databricks_utils.get_git_repo_relative_path()
        git_repo_reference = databricks_utils.get_git_repo_reference()
        git_repo_reference_type = databricks_utils.get_git_repo_reference_type()
        git_repo_status = databricks_utils.get_git_repo_status()

        if git_repo_url is not None:
            tags[MLFLOW_DATABRICKS_GIT_REPO_URL] = git_repo_url
        if git_repo_provider is not None:
            tags[MLFLOW_DATABRICKS_GIT_REPO_PROVIDER] = git_repo_provider
        if git_repo_commit is not None:
            tags[MLFLOW_DATABRICKS_GIT_REPO_COMMIT] = git_repo_commit
        if git_repo_relative_path is not None:
            tags[MLFLOW_DATABRICKS_GIT_REPO_RELATIVE_PATH] = git_repo_relative_path
        if git_repo_reference is not None:
            tags[MLFLOW_DATABRICKS_GIT_REPO_REFERENCE] = git_repo_reference
        if git_repo_reference_type is not None:
            tags[MLFLOW_DATABRICKS_GIT_REPO_REFERENCE_TYPE] = git_repo_reference_type
        if git_repo_status is not None:
            tags[MLFLOW_DATABRICKS_GIT_REPO_STATUS] = git_repo_status

        return tags
```

--------------------------------------------------------------------------------

---[FILE: default_context.py]---
Location: mlflow-master/mlflow/tracking/context/default_context.py

```python
import getpass
import sys

from mlflow.entities import SourceType
from mlflow.tracking.context.abstract_context import RunContextProvider
from mlflow.utils.credentials import read_mlflow_creds
from mlflow.utils.mlflow_tags import (
    MLFLOW_SOURCE_NAME,
    MLFLOW_SOURCE_TYPE,
    MLFLOW_USER,
)

_DEFAULT_USER = "unknown"


def _get_user():
    """Get the current computer username."""
    try:
        return getpass.getuser()
    except ImportError:
        return _DEFAULT_USER


def _get_main_file():
    if len(sys.argv) > 0:
        return sys.argv[0]
    return None


def _get_source_name():
    main_file = _get_main_file()
    if main_file is not None:
        return main_file
    return "<console>"


def _get_source_type():
    return SourceType.LOCAL


class DefaultRunContext(RunContextProvider):
    def in_context(self):
        return True

    def tags(self):
        creds = read_mlflow_creds()
        return {
            MLFLOW_USER: creds.username or _get_user(),
            MLFLOW_SOURCE_NAME: _get_source_name(),
            MLFLOW_SOURCE_TYPE: SourceType.to_string(_get_source_type()),
        }
```

--------------------------------------------------------------------------------

---[FILE: git_context.py]---
Location: mlflow-master/mlflow/tracking/context/git_context.py

```python
import logging

from mlflow.tracking.context.abstract_context import RunContextProvider
from mlflow.tracking.context.default_context import _get_main_file
from mlflow.utils.git_utils import get_git_commit
from mlflow.utils.mlflow_tags import MLFLOW_GIT_COMMIT

_logger = logging.getLogger(__name__)


def _get_source_version():
    main_file = _get_main_file()
    if main_file is not None:
        return get_git_commit(main_file)
    return None


class GitRunContext(RunContextProvider):
    def __init__(self):
        self._cache = {}

    @property
    def _source_version(self):
        if "source_version" not in self._cache:
            self._cache["source_version"] = _get_source_version()
        return self._cache["source_version"]

    def in_context(self):
        return self._source_version is not None

    def tags(self):
        return {MLFLOW_GIT_COMMIT: self._source_version}
```

--------------------------------------------------------------------------------

---[FILE: registry.py]---
Location: mlflow-master/mlflow/tracking/context/registry.py

```python
import logging
import warnings

from mlflow.tracking.context.abstract_context import RunContextProvider
from mlflow.tracking.context.databricks_cluster_context import DatabricksClusterRunContext
from mlflow.tracking.context.databricks_command_context import DatabricksCommandRunContext
from mlflow.tracking.context.databricks_job_context import DatabricksJobRunContext
from mlflow.tracking.context.databricks_notebook_context import DatabricksNotebookRunContext
from mlflow.tracking.context.databricks_repo_context import DatabricksRepoRunContext
from mlflow.tracking.context.default_context import DefaultRunContext
from mlflow.tracking.context.git_context import GitRunContext
from mlflow.tracking.context.system_environment_context import SystemEnvironmentContext
from mlflow.utils.plugins import get_entry_points

_logger = logging.getLogger(__name__)


class RunContextProviderRegistry:
    """Registry for run context provider implementations

    This class allows the registration of a run context provider which can be used to infer meta
    information about the context of an MLflow experiment run. Implementations declared though the
    entrypoints `mlflow.run_context_provider` group can be automatically registered through the
    `register_entrypoints` method.

    Registered run context providers can return tags that override those implemented in the core
    library, however the order in which plugins are resolved is undefined.
    """

    def __init__(self):
        self._registry = []

    def register(self, run_context_provider_cls):
        self._registry.append(run_context_provider_cls())

    def register_entrypoints(self):
        """Register tracking stores provided by other packages"""
        for entrypoint in get_entry_points("mlflow.run_context_provider"):
            try:
                self.register(entrypoint.load())
            except (AttributeError, ImportError) as exc:
                warnings.warn(
                    'Failure attempting to register context provider "{}": {}'.format(
                        entrypoint.name, str(exc)
                    ),
                    stacklevel=2,
                )

    def __iter__(self):
        return iter(self._registry)


_run_context_provider_registry = RunContextProviderRegistry()
_run_context_provider_registry.register(DefaultRunContext)
_run_context_provider_registry.register(GitRunContext)
_run_context_provider_registry.register(DatabricksNotebookRunContext)
_run_context_provider_registry.register(DatabricksJobRunContext)
_run_context_provider_registry.register(DatabricksClusterRunContext)
_run_context_provider_registry.register(DatabricksCommandRunContext)
_run_context_provider_registry.register(DatabricksRepoRunContext)
_run_context_provider_registry.register(SystemEnvironmentContext)

_run_context_provider_registry.register_entrypoints()


def resolve_tags(tags=None, ignore: list[RunContextProvider] | None = None):
    """Generate a set of tags for the current run context. Tags are resolved in the order,
    contexts are registered. Argument tags are applied last.

    This function iterates through all run context providers in the registry. Additional context
    providers can be registered as described in
    :py:class:`mlflow.tracking.context.RunContextProvider`.

    Args:
        tags: A dictionary of tags to override. If specified, tags passed in this argument will
            override those inferred from the context.
        ignore: A list of RunContextProvider classes to exclude from the resolution.

    Returns:
        A dictionary of resolved tags.
    """
    ignore = ignore or []
    all_tags = {}
    for provider in _run_context_provider_registry:
        if any(isinstance(provider, ig) for ig in ignore):
            continue

        try:
            if provider.in_context():
                all_tags.update(provider.tags())
        except Exception as e:
            _logger.warning("Encountered unexpected error during resolving tags: %s", e)

    if tags is not None:
        all_tags.update(tags)

    return all_tags
```

--------------------------------------------------------------------------------

---[FILE: system_environment_context.py]---
Location: mlflow-master/mlflow/tracking/context/system_environment_context.py

```python
import json

from mlflow.environment_variables import MLFLOW_RUN_CONTEXT
from mlflow.tracking.context.abstract_context import RunContextProvider

# The constant MLFLOW_RUN_CONTEXT_ENV_VAR is marked as @developer_stable
MLFLOW_RUN_CONTEXT_ENV_VAR = MLFLOW_RUN_CONTEXT.name


class SystemEnvironmentContext(RunContextProvider):
    def in_context(self):
        return MLFLOW_RUN_CONTEXT.defined

    def tags(self):
        return json.loads(MLFLOW_RUN_CONTEXT.get())
```

--------------------------------------------------------------------------------

---[FILE: abstract_context.py]---
Location: mlflow-master/mlflow/tracking/default_experiment/abstract_context.py

```python
from abc import ABCMeta, abstractmethod

from mlflow.utils.annotations import developer_stable


@developer_stable
class DefaultExperimentProvider:
    """
    Abstract base class for objects that provide the ID of an MLflow Experiment based on the
    current client context. For example, when the MLflow client is running in a Databricks Job,
    a provider is used to obtain the ID of the MLflow Experiment associated with the Job.

    Usually the experiment_id is set explicitly by the user, but if the experiment is not set,
    MLflow computes a default experiment id based on different contexts.
    When an experiment is created via the fluent ``mlflow.start_run`` method, MLflow iterates
    through the registered ``DefaultExperimentProvider``s until it finds one whose
    ``in_context()`` method returns ``True``; MLflow then calls the provider's
    ``get_experiment_id()`` method and uses the resulting experiment ID for Tracking operations.
    """

    __metaclass__ = ABCMeta

    @abstractmethod
    def in_context(self):
        """Determine if the MLflow client is running in a context where this provider can
        identify an associated MLflow Experiment ID.

        Returns:
            True if the MLflow client is running in a context where the provider
            can identify an associated MLflow Experiment ID. False otherwise.

        """

    @abstractmethod
    def get_experiment_id(self):
        """Provide the MLflow Experiment ID for the current MLflow client context.

        Assumes that ``in_context()`` is ``True``.

        Returns:
            The ID of the MLflow Experiment associated with the current context.

        """
```

--------------------------------------------------------------------------------

---[FILE: databricks_notebook_experiment_provider.py]---
Location: mlflow-master/mlflow/tracking/default_experiment/databricks_notebook_experiment_provider.py

```python
from functools import lru_cache

from mlflow.exceptions import MlflowException
from mlflow.protos import databricks_pb2
from mlflow.tracking.client import MlflowClient
from mlflow.tracking.default_experiment.abstract_context import DefaultExperimentProvider
from mlflow.utils import databricks_utils
from mlflow.utils.mlflow_tags import MLFLOW_EXPERIMENT_SOURCE_ID, MLFLOW_EXPERIMENT_SOURCE_TYPE


class DatabricksNotebookExperimentProvider(DefaultExperimentProvider):
    def in_context(self):
        return databricks_utils.is_in_databricks_notebook()

    @lru_cache(maxsize=1)
    @staticmethod
    def _resolve_notebook_experiment_id():
        source_notebook_id = databricks_utils.get_notebook_id()
        source_notebook_name = databricks_utils.get_notebook_path()
        tags = {
            MLFLOW_EXPERIMENT_SOURCE_ID: source_notebook_id,
        }

        if databricks_utils.is_in_databricks_repo_notebook():
            tags[MLFLOW_EXPERIMENT_SOURCE_TYPE] = "REPO_NOTEBOOK"

        # With the presence of the source id, the following is a get or create in which it will
        # return the corresponding experiment if one exists for the repo notebook.
        # For non-repo notebooks, it will raise an exception and we will use source_notebook_id
        try:
            experiment_id = MlflowClient().create_experiment(source_notebook_name, None, tags)
        except MlflowException as e:
            if e.error_code == databricks_pb2.ErrorCode.Name(
                databricks_pb2.INVALID_PARAMETER_VALUE
            ):
                # If determined that it is not a repo notebook
                experiment_id = source_notebook_id
            else:
                raise e

        return experiment_id

    def get_experiment_id(self):
        return DatabricksNotebookExperimentProvider._resolve_notebook_experiment_id()
```

--------------------------------------------------------------------------------

---[FILE: registry.py]---
Location: mlflow-master/mlflow/tracking/default_experiment/registry.py

```python
import logging
import warnings

from mlflow.tracking import get_tracking_uri
from mlflow.tracking.default_experiment import DEFAULT_EXPERIMENT_ID
from mlflow.tracking.default_experiment.databricks_notebook_experiment_provider import (
    DatabricksNotebookExperimentProvider,
)
from mlflow.utils.plugins import get_entry_points
from mlflow.utils.uri import is_databricks_uri

_logger = logging.getLogger(__name__)
# Listed below are the list of providers, which are used to provide MLflow Experiment IDs based on
# the current context where the MLflow client is running when the user has not explicitly set
# an experiment. The order below is the order in which the these providers are registered.
_EXPERIMENT_PROVIDERS = (DatabricksNotebookExperimentProvider,)


class DefaultExperimentProviderRegistry:
    """Registry for default experiment provider implementations

    This class allows the registration of default experiment providers, which are used to provide
    MLflow Experiment IDs based on the current context where the MLflow client is running when
    the user has not explicitly set an experiment. Implementations declared though the entrypoints
    `mlflow.default_experiment_provider` group can be automatically registered through the
    `register_entrypoints` method.
    """

    def __init__(self):
        self._registry = []

    def register(self, default_experiment_provider_cls):
        self._registry.append(default_experiment_provider_cls())

    def register_entrypoints(self):
        """Register tracking stores provided by other packages"""
        for entrypoint in get_entry_points("mlflow.default_experiment_provider"):
            try:
                self.register(entrypoint.load())
            except (AttributeError, ImportError) as exc:
                warnings.warn(
                    "Failure attempting to register default experiment"
                    + f'context provider "{entrypoint.name}": {exc}',
                    stacklevel=2,
                )

    def __iter__(self):
        return iter(self._registry)


_default_experiment_provider_registry = DefaultExperimentProviderRegistry()
for exp_provider in _EXPERIMENT_PROVIDERS:
    _default_experiment_provider_registry.register(exp_provider)

_default_experiment_provider_registry.register_entrypoints()


def get_experiment_id() -> str | None:
    """Get an experiment ID for the current context.

    The experiment ID is fetched by querying providers, in the order that they were registered.
    This function iterates through all default experiment context providers in the registry.

    Returns:
        An experiment_id.
    """
    for provider in _default_experiment_provider_registry:
        try:
            if provider.in_context():
                return provider.get_experiment_id()
        except Exception as e:
            _logger.warning("Encountered unexpected error while getting experiment_id: %s", e)

    return DEFAULT_EXPERIMENT_ID if not is_databricks_uri(get_tracking_uri()) else None
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/tracking/default_experiment/__init__.py

```python
DEFAULT_EXPERIMENT_ID = "0"
```

--------------------------------------------------------------------------------

---[FILE: abstract_request_auth_provider.py]---
Location: mlflow-master/mlflow/tracking/request_auth/abstract_request_auth_provider.py

```python
from abc import ABC, abstractmethod

from mlflow.utils.annotations import developer_stable


@developer_stable
class RequestAuthProvider(ABC):
    """
    Abstract base class for specifying custom request auth to add to outgoing requests

    When a request is sent, MLflow will iterate through all registered RequestAuthProviders.
    For each provider where ``get_name`` matches auth provider name, MLflow calls the ``get_auth``
    method on the provider to compute request auth.

    The resulting request auth will then be added and sent with the request.
    """

    @abstractmethod
    def get_name(self):
        """Get the name of the request auth provider.

        Returns:
            str of request auth provider name.
        """

    @abstractmethod
    def get_auth(self):
        """
        Generate request auth object (e.g., `requests.auth import HTTPBasicAuth`). See
        https://requests.readthedocs.io/en/latest/user/authentication/ for more details.

        Returns:
            request auth object.
        """
```

--------------------------------------------------------------------------------

````
