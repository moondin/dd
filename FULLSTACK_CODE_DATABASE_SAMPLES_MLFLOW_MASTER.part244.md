---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 244
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 244 of 991)

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

---[FILE: plugin_manager.py]---
Location: mlflow-master/mlflow/deployments/plugin_manager.py

```python
import abc
import importlib.metadata
import inspect

import importlib_metadata

from mlflow.deployments.base import BaseDeploymentClient
from mlflow.deployments.utils import parse_target_uri
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INTERNAL_ERROR, RESOURCE_DOES_NOT_EXIST
from mlflow.utils.annotations import developer_stable
from mlflow.utils.plugins import get_entry_points

# TODO: refactor to have a common base class for all the plugin implementation in MLflow
#   mlflow/tracking/context/registry.py
#   mlflow/tracking/registry
#   mlflow/store/artifact/artifact_repository_registry.py


@developer_stable
class PluginManager(abc.ABC):
    """
    Abstract class defining a entrypoint based plugin registration.

    This class allows the registration of a function or class to provide an implementation
    for a given key/name. Implementations declared though the entrypoints can be automatically
    registered through the `register_entrypoints` method.
    """

    def __init__(self, group_name):
        self._registry = {}
        self.group_name = group_name
        self._has_registered = None

    @abc.abstractmethod
    def __getitem__(self, item):
        # Letting the child class create this function so that the child
        # can raise custom exceptions if it needs to
        pass

    @property
    def registry(self):
        """
        Registry stores the registered plugin as a key value pair where key is the
        name of the plugin and value is the plugin object
        """
        return self._registry

    @property
    def has_registered(self):
        """
        Returns bool representing whether the "register_entrypoints" has run or not. This
        doesn't return True if `register` method is called outside of `register_entrypoints`
        to register plugins
        """
        return self._has_registered

    def register(self, target_name, plugin_module):
        """Register a deployment client given its target name and module
        Args:
            target_name: The name of the deployment target. This name will be used by
                `get_deploy_client()` to retrieve a deployment client from
                the plugin store.
            plugin_module: The module that implements the deployment plugin interface.
        """
        self.registry[target_name] = importlib.metadata.EntryPoint(
            target_name, plugin_module, self.group_name
        )

    def register_entrypoints(self):
        """
        Runs through all the packages that has the `group_name` defined as the entrypoint
        and register that into the registry
        """
        for entrypoint in get_entry_points(self.group_name):
            self.registry[entrypoint.name] = entrypoint
        self._has_registered = True


@developer_stable
class DeploymentPlugins(PluginManager):
    def __init__(self):
        super().__init__("mlflow.deployments")
        self.register_entrypoints()

    def __getitem__(self, item):
        """Override __getitem__ so that we can directly look up plugins via dict-like syntax"""
        try:
            target_name = parse_target_uri(item)
            plugin_like = self.registry[target_name]
        except KeyError:
            msg = (
                f'No plugin found for managing model deployments to "{item}". '
                f'In order to deploy models to "{item}", find and install an appropriate '
                "plugin from "
                "https://mlflow.org/docs/latest/plugins.html#community-plugins using "
                "your package manager (pip, conda etc)."
            )
            raise MlflowException(msg, error_code=RESOURCE_DOES_NOT_EXIST)

        if isinstance(plugin_like, (importlib_metadata.EntryPoint, importlib.metadata.EntryPoint)):
            try:
                plugin_obj = plugin_like.load()
            except (AttributeError, ImportError) as exc:
                raise RuntimeError(f'Failed to load the plugin "{item}": {exc}')
            self.registry[item] = plugin_obj
        else:
            plugin_obj = plugin_like

        # Testing whether the plugin is valid or not
        expected = {"target_help", "run_local"}
        deployment_classes = []
        for name, obj in inspect.getmembers(plugin_obj):
            if name in expected:
                expected.remove(name)
            elif (
                inspect.isclass(obj)
                and issubclass(obj, BaseDeploymentClient)
                and not obj == BaseDeploymentClient
            ):
                deployment_classes.append(name)
        if len(expected) > 0:
            raise MlflowException(
                f"Plugin registered for the target {item} does not have all "
                "the required interfaces. Raise an issue with the "
                "plugin developers.\n"
                f"Missing interfaces: {expected}",
                error_code=INTERNAL_ERROR,
            )
        if len(deployment_classes) > 1:
            raise MlflowException(
                f"Plugin registered for the target {item} has more than one "
                "child class of BaseDeploymentClient. Raise an issue with"
                " the plugin developers. "
                f"Classes found are {deployment_classes}"
            )
        elif len(deployment_classes) == 0:
            raise MlflowException(
                f"Plugin registered for the target {item} has no child class"
                " of BaseDeploymentClient. Raise an issue with the "
                "plugin developers"
            )
        return plugin_obj
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: mlflow-master/mlflow/deployments/utils.py

```python
import urllib
from urllib.parse import urlparse

from mlflow.environment_variables import MLFLOW_DEPLOYMENTS_TARGET
from mlflow.exceptions import MlflowException
from mlflow.utils.uri import append_to_uri_path

_deployments_target: str | None = None


def parse_target_uri(target_uri):
    """Parse out the deployment target from the provided target uri"""
    parsed = urllib.parse.urlparse(target_uri)
    if not parsed.scheme:
        if parsed.path:
            # uri = 'target_name' (without :/<path>)
            return parsed.path
        raise MlflowException(
            f"Not a proper deployment URI: {target_uri}. "
            + "Deployment URIs must be of the form 'target' or 'target:/suffix'"
        )
    return parsed.scheme


def _is_valid_uri(uri: str) -> bool:
    """
    Evaluates the basic structure of a provided uri to determine if the scheme and
    netloc are provided
    """
    try:
        parsed = urlparse(uri)
        return bool(parsed.scheme and parsed.netloc)
    except ValueError:
        return False


def resolve_endpoint_url(base_url: str, endpoint: str) -> str:
    """Performs a validation on whether the returned value is a fully qualified url
    or requires the assembly of a fully qualified url by appending `endpoint`.

    Args:
        base_url: The base URL. Should include the scheme and domain, e.g.,
            ``http://127.0.0.1:6000``.
        endpoint: The endpoint to be appended to the base URL, e.g., ``/api/2.0/endpoints/`` or,
            in the case of Databricks, the fully qualified url.

    Returns:
        The complete URL, either directly returned or formed and returned by joining the
        base URL and the endpoint path.

    """
    return endpoint if _is_valid_uri(endpoint) else append_to_uri_path(base_url, endpoint)


def set_deployments_target(target: str):
    """Sets the target deployment client for MLflow deployments

    Args:
        target: The full uri of a running MLflow AI Gateway or, if running on
            Databricks, "databricks".
    """
    if not _is_valid_target(target):
        raise MlflowException.invalid_parameter_value(
            "The target provided is not a valid uri or 'databricks'"
        )

    global _deployments_target
    _deployments_target = target


def get_deployments_target() -> str:
    """
    Returns the currently set MLflow deployments target iff set.
    If the deployments target has not been set by using ``set_deployments_target``, an
    ``MlflowException`` is raised.
    """
    if _deployments_target is not None:
        return _deployments_target
    elif uri := MLFLOW_DEPLOYMENTS_TARGET.get():
        return uri
    else:
        raise MlflowException(
            "No deployments target has been set. Please either set the MLflow deployments target"
            " via `mlflow.deployments.set_deployments_target()` or set the environment variable "
            f"{MLFLOW_DEPLOYMENTS_TARGET} to the running deployment server's uri"
        )


def _is_valid_target(target: str):
    """
    Evaluates the basic structure of a provided target to determine if the scheme and
    netloc are provided
    """
    if target == "databricks":
        return True
    return _is_valid_uri(target)
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/deployments/__init__.py

```python
"""
Exposes functionality for deploying MLflow models to custom serving tools.

Note: model deployment to AWS Sagemaker can currently be performed via the
:py:mod:`mlflow.sagemaker` module. Model deployment to Azure can be performed by using the
`azureml library <https://pypi.org/project/azureml-mlflow/>`_.

MLflow does not currently provide built-in support for any other deployment targets, but support
for custom targets can be installed via third-party plugins. See a list of known plugins
`here <https://mlflow.org/docs/latest/plugins.html#deployment-plugins>`_.

This page largely focuses on the user-facing deployment APIs. For instructions on implementing
your own plugin for deployment to a custom serving tool, see
`plugin docs <http://mlflow.org/docs/latest/plugins.html#writing-your-own-mlflow-plugins>`_.
"""

import contextlib
import json

from mlflow.deployments.base import BaseDeploymentClient
from mlflow.deployments.databricks import DatabricksDeploymentClient, DatabricksEndpoint
from mlflow.deployments.interface import get_deploy_client, run_local
from mlflow.deployments.openai import OpenAIDeploymentClient
from mlflow.deployments.utils import get_deployments_target, set_deployments_target
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE

with contextlib.suppress(Exception):
    # MlflowDeploymentClient depends on optional dependencies and can't be imported
    # if they are not installed.
    from mlflow.deployments.mlflow import MlflowDeploymentClient


class PredictionsResponse(dict):
    """
    Represents the predictions and metadata returned in response to a scoring request, such as a
    REST API request sent to the ``/invocations`` endpoint of an MLflow Model Server.
    """

    def get_predictions(self, predictions_format="dataframe", dtype=None):
        """Get the predictions returned from the MLflow Model Server in the specified format.

        Args:
            predictions_format: The format in which to return the predictions. Either
                ``"dataframe"`` or ``"ndarray"``.
            dtype: The NumPy datatype to which to coerce the predictions. Only used when
                the "ndarray" predictions_format is specified.

        Raises:
            Exception: If the predictions cannot be represented in the specified format.

        Returns:
            The predictions, represented in the specified format.

        """
        import numpy as np
        import pandas as pd
        from pandas.core.dtypes.common import is_list_like

        if predictions_format == "dataframe":
            predictions = self["predictions"]
            if isinstance(predictions, str):
                return pd.DataFrame(data=[predictions])
            if isinstance(predictions, dict) and not any(
                is_list_like(p) and getattr(p, "ndim", 1) == 1 for p in predictions.values()
            ):
                return pd.DataFrame(data=predictions, index=[0])
            return pd.DataFrame(data=predictions)
        elif predictions_format == "ndarray":
            return np.array(self["predictions"], dtype)
        else:
            raise MlflowException(
                f"Unrecognized predictions format: '{predictions_format}'",
                INVALID_PARAMETER_VALUE,
            )

    def to_json(self, path=None):
        """Get the JSON representation of the MLflow Predictions Response.

        Args:
            path: If specified, the JSON representation is written to this file path.

        Returns:
            If ``path`` is unspecified, the JSON representation of the MLflow Predictions
            Response. Else, None.

        """
        if path is not None:
            with open(path, "w") as f:
                json.dump(dict(self), f)
        else:
            return json.dumps(dict(self))

    @classmethod
    def from_json(cls, json_str):
        try:
            parsed_response = json.loads(json_str)
        except Exception as e:
            raise MlflowException("Predictions response contents are not valid JSON") from e
        if not isinstance(parsed_response, dict) or "predictions" not in parsed_response:
            raise MlflowException(
                f"Invalid response. Predictions response contents must be a dictionary"
                f" containing a 'predictions' field. Instead, received: {parsed_response}"
            )
        return PredictionsResponse(parsed_response)


__all__ = [
    "get_deploy_client",
    "run_local",
    "BaseDeploymentClient",
    "DatabricksDeploymentClient",
    "OpenAIDeploymentClient",
    "DatabricksEndpoint",
    "MlflowDeploymentClient",
    "PredictionsResponse",
    "get_deployments_target",
    "set_deployments_target",
]
```

--------------------------------------------------------------------------------

````
