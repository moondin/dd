---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 714
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 714 of 991)

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
Location: mlflow-master/mlflow/tracking/request_auth/registry.py

```python
import warnings

from mlflow.utils.plugins import get_entry_points

REQUEST_AUTH_PROVIDER_ENTRYPOINT = "mlflow.request_auth_provider"


class RequestAuthProviderRegistry:
    def __init__(self):
        self._registry = []

    def register(self, request_auth_provider):
        self._registry.append(request_auth_provider())

    def register_entrypoints(self):
        for entrypoint in get_entry_points(REQUEST_AUTH_PROVIDER_ENTRYPOINT):
            try:
                self.register(entrypoint.load())
            except (AttributeError, ImportError) as exc:
                warnings.warn(
                    'Failure attempting to register request auth provider "{}": {}'.format(
                        entrypoint.name, str(exc)
                    ),
                    stacklevel=2,
                )

    def __iter__(self):
        return iter(self._registry)


_request_auth_provider_registry = RequestAuthProviderRegistry()
_request_auth_provider_registry.register_entrypoints()


def fetch_auth(request_auth):
    """
    Find the request auth from registered providers based on the auth provider's name.
    The auth provider's name can be provided through environment variable `MLFLOW_TRACKING_AUTH`.

    This function iterates through all request auth providers in the registry. Additional context
    providers can be registered as described in
    :py:class:`mlflow.tracking.request_auth.RequestAuthProvider`.

    Args:
        request_auth: The name of request auth provider.

    Returns:
        The auth object.
    """

    for auth_provider in _request_auth_provider_registry:
        if auth_provider.get_name() == request_auth:
            return auth_provider.get_auth()

    warnings.warn(
        f"Could not find any registered plugin for {request_auth}. "
        "No authentication header will be added. Please check your "
        "provider documentation for installing the right plugin or "
        "correct provider name."
    )
```

--------------------------------------------------------------------------------

---[FILE: abstract_request_header_provider.py]---
Location: mlflow-master/mlflow/tracking/request_header/abstract_request_header_provider.py

```python
from abc import ABCMeta, abstractmethod

from mlflow.utils.annotations import developer_stable


@developer_stable
class RequestHeaderProvider:
    """
    Abstract base class for specifying custom request headers to add to outgoing requests
    (e.g. request headers specifying the environment from which mlflow is running).

    When a request is sent, MLflow will iterate through all registered RequestHeaderProviders.
    For each provider where ``in_context`` returns ``True``, MLflow calls the ``request_headers``
    method on the provider to compute request headers.

    All resulting request headers will then be merged together and sent with the request.
    """

    __metaclass__ = ABCMeta

    @abstractmethod
    def in_context(self):
        """Determine if MLflow is running in this context.

        Returns:
            bool indicating if in this context.

        """

    @abstractmethod
    def request_headers(self):
        """Generate context-specific request headers.

        Returns:
            dict of request headers.
        """
```

--------------------------------------------------------------------------------

---[FILE: databricks_request_header_provider.py]---
Location: mlflow-master/mlflow/tracking/request_header/databricks_request_header_provider.py

```python
from mlflow.tracking.request_header.abstract_request_header_provider import RequestHeaderProvider
from mlflow.utils import databricks_utils


class DatabricksRequestHeaderProvider(RequestHeaderProvider):
    """
    Provides request headers indicating the type of Databricks environment from which a request
    was made.
    """

    def in_context(self):
        return (
            databricks_utils.is_in_cluster()
            or databricks_utils.is_in_databricks_notebook()
            or databricks_utils.is_in_databricks_job()
        )

    def request_headers(self):
        request_headers = {}
        if databricks_utils.is_in_databricks_notebook():
            request_headers["notebook_id"] = databricks_utils.get_notebook_id()
        if databricks_utils.is_in_databricks_job():
            request_headers["job_id"] = databricks_utils.get_job_id()
            request_headers["job_run_id"] = databricks_utils.get_job_run_id()
            request_headers["job_type"] = databricks_utils.get_job_type()
        if databricks_utils.is_in_cluster():
            request_headers["cluster_id"] = databricks_utils.get_cluster_id()
        command_run_id = databricks_utils.get_command_run_id()
        if command_run_id is not None:
            request_headers["command_run_id"] = command_run_id
        workload_id = databricks_utils.get_workload_id()
        workload_class = databricks_utils.get_workload_class()
        if workload_id is not None:
            request_headers["workload_id"] = workload_id
        if workload_class is not None:
            request_headers["workload_class"] = workload_class

        return request_headers
```

--------------------------------------------------------------------------------

---[FILE: default_request_header_provider.py]---
Location: mlflow-master/mlflow/tracking/request_header/default_request_header_provider.py

```python
from mlflow import __version__
from mlflow.tracking.request_header.abstract_request_header_provider import RequestHeaderProvider

_USER_AGENT = "User-Agent"
_CLIENT_VERSION = "X-MLflow-Client-Version"
_MLFLOW_PYTHON_CLIENT_USER_AGENT_PREFIX = "mlflow-python-client/"
# We need to specify client version in separate header as user agent is overwritten in SDK call path
_DEFAULT_HEADERS = {
    _USER_AGENT: f"{_MLFLOW_PYTHON_CLIENT_USER_AGENT_PREFIX}{__version__}",
    _CLIENT_VERSION: f"{__version__}",
}


class DefaultRequestHeaderProvider(RequestHeaderProvider):
    """
    Provides default request headers for outgoing request.
    """

    def in_context(self):
        return True

    def request_headers(self):
        return dict(**_DEFAULT_HEADERS)
```

--------------------------------------------------------------------------------

---[FILE: registry.py]---
Location: mlflow-master/mlflow/tracking/request_header/registry.py

```python
import logging
import warnings

from mlflow.tracking.request_header.databricks_request_header_provider import (
    DatabricksRequestHeaderProvider,
)
from mlflow.tracking.request_header.default_request_header_provider import (
    DefaultRequestHeaderProvider,
)
from mlflow.utils.plugins import get_entry_points

_logger = logging.getLogger(__name__)


class RequestHeaderProviderRegistry:
    def __init__(self):
        self._registry = []

    def register(self, request_header_provider):
        self._registry.append(request_header_provider())

    def register_entrypoints(self):
        """Register tracking stores provided by other packages"""
        for entrypoint in get_entry_points("mlflow.request_header_provider"):
            try:
                self.register(entrypoint.load())
            except (AttributeError, ImportError) as exc:
                warnings.warn(
                    'Failure attempting to register request header provider "{}": {}'.format(
                        entrypoint.name, str(exc)
                    ),
                    stacklevel=2,
                )

    def __iter__(self):
        return iter(self._registry)


_request_header_provider_registry = RequestHeaderProviderRegistry()
_request_header_provider_registry.register(DatabricksRequestHeaderProvider)
_request_header_provider_registry.register(DefaultRequestHeaderProvider)

_request_header_provider_registry.register_entrypoints()


def resolve_request_headers(request_headers=None):
    """Generate a set of request headers from registered providers.

    Request headers are resolved in the order that providers are registered. Argument headers are
    applied last. This function iterates through all request header providers in the registry.
    Additional context providers can be registered as described in
    :py:class:`mlflow.tracking.request_header.RequestHeaderProvider`.

    Args:
        request_headers: A dictionary of request headers to override. If specified, headers passed
            in this argument will override those inferred from the context.

    Returns:
        A dictionary of resolved headers.
    """

    all_request_headers = {}
    for provider in _request_header_provider_registry:
        try:
            if provider.in_context():
                # all_request_headers.update(provider.request_headers())
                for header, value in provider.request_headers().items():
                    all_request_headers[header] = (
                        f"{all_request_headers[header]} {value}"
                        if header in all_request_headers
                        else value
                    )
        except Exception as e:
            _logger.warning("Encountered unexpected error during resolving request headers: %s", e)

    if request_headers is not None:
        all_request_headers.update(request_headers)

    return all_request_headers
```

--------------------------------------------------------------------------------

````
