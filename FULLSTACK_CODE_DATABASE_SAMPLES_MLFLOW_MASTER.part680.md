---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 680
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 680 of 991)

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

---[FILE: base_rest_store.py]---
Location: mlflow-master/mlflow/store/model_registry/base_rest_store.py

```python
from abc import ABCMeta, abstractmethod

from mlflow.store.model_registry.abstract_store import AbstractStore
from mlflow.utils.rest_utils import (
    call_endpoint,
    call_endpoints,
)


class BaseRestStore(AbstractStore):
    """
    Base class client for a remote model registry server accessed via REST API calls
    """

    __metaclass__ = ABCMeta

    def __init__(self, get_host_creds):
        super().__init__()
        self.get_host_creds = get_host_creds

    @abstractmethod
    def _get_all_endpoints_from_method(self, method):
        pass

    @abstractmethod
    def _get_endpoint_from_method(self, method):
        pass

    @abstractmethod
    def _get_response_from_method(self, method):
        pass

    def _call_endpoint(self, api, json_body, call_all_endpoints=False, extra_headers=None):
        response_proto = self._get_response_from_method(api)
        if call_all_endpoints:
            endpoints = self._get_all_endpoints_from_method(api)
            return call_endpoints(
                self.get_host_creds(), endpoints, json_body, response_proto, extra_headers
            )
        else:
            endpoint, method = self._get_endpoint_from_method(api)
            return call_endpoint(
                self.get_host_creds(), endpoint, method, json_body, response_proto, extra_headers
            )
```

--------------------------------------------------------------------------------

---[FILE: databricks_workspace_model_registry_rest_store.py]---
Location: mlflow-master/mlflow/store/model_registry/databricks_workspace_model_registry_rest_store.py

```python
import logging
from functools import partial
from urllib.parse import parse_qs, urlparse

import mlflow
from mlflow.environment_variables import MLFLOW_SKIP_SIGNATURE_CHECK_FOR_UC_REGISTRY_MIGRATION
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import (
    RESOURCE_ALREADY_EXISTS,
    ErrorCode,
)
from mlflow.store._unity_catalog.registry.rest_store import UcModelRegistryStore
from mlflow.store.model_registry.rest_store import RestStore
from mlflow.utils.databricks_utils import get_databricks_host_creds
from mlflow.utils.logging_utils import eprint
from mlflow.utils.uri import _DATABRICKS_UNITY_CATALOG_SCHEME

_logger = logging.getLogger(__name__)


def _extract_workspace_id_from_run_link(run_link: str | None) -> str | None:
    """
    Extract workspace ID from a Databricks run link URL.

    Args:
        run_link: URL like "https://workspace.databricks.com/?o=10002#mlflow/experiments/test-exp-id/runs/runid"
            The workspace ID is the part after the ?o= in the URL, and before the #,
            e.g. 10002 in the example above.
            The run_link is only present if the run was logged in a Databricks Workspace
            different from the registry workspace.

    Returns:
        The workspace ID as a string, or None if not found or invalid
    """
    if not run_link:
        return None

    warning_msg = (
        "Unable to get model version source run's workspace ID from source run link. "
        "The source workspace ID on the destination model version will be set to the "
        "registry workspace ID."
    )

    try:
        parsed_url = urlparse(run_link)
        query_params = parse_qs(parsed_url.query)
        workspace_id_params = query_params.get("o")
        if not workspace_id_params:
            _logger.warning(warning_msg)
            return None
        workspace_id = workspace_id_params[0]
        if int(workspace_id) < 0:
            _logger.warning(warning_msg)
            return None
        return workspace_id
    except ValueError:
        _logger.warning(warning_msg)
        return None


def _raise_unsupported_method(method, message=None):
    messages = [
        f"Method '{method}' is unsupported for models in the Workspace Model Registry. "
        f"Upgrade to Models in Unity Catalog to access the latest features. You can configure "
        f"the MLflow Python client to access models in Unity Catalog by running "
        f"mlflow.set_registry_uri('databricks-uc') before accessing models.",
    ]
    if message is not None:
        messages.append(message)
    raise MlflowException(" ".join(messages))


class DatabricksWorkspaceModelRegistryRestStore(RestStore):
    def __init__(self, store_uri, tracking_uri):
        super().__init__(get_host_creds=partial(get_databricks_host_creds, store_uri))
        self.tracking_uri = tracking_uri

    def set_registered_model_alias(self, name, alias, version):
        _raise_unsupported_method(method="set_registered_model_alias")

    def delete_registered_model_alias(self, name, alias):
        _raise_unsupported_method(method="delete_registered_model_alias")

    def get_model_version_by_alias(self, name, alias):
        _raise_unsupported_method(
            method="get_model_version_by_alias",
            message="If attempting to load a model version by alias via a URI of the form "
            "'models:/model_name@alias_name', configure the MLflow client to target Unity Catalog "
            "and try again.",
        )

    def _await_model_version_creation(self, mv, await_creation_for):
        uc_hint = (
            " For faster model version creation, use Models in Unity Catalog "
            "(https://docs.databricks.com/en/machine-learning/manage-model-lifecycle/index.html)."
        )
        self._await_model_version_creation_impl(mv, await_creation_for, hint=uc_hint)

    def copy_model_version(self, src_mv, dst_name):
        """
        Copy a model version from one registered model to another as a new model version.
        This method can be used within the Databricks workspace registry to copy model versions
        between registered models, or to migrate model versions from the Databricks workspace
        registry to Unity Catalog. During the migration, signature validation can be bypassed
        by setting the `MLFLOW_SKIP_SIGNATURE_CHECK_FOR_UC_REGISTRY_MIGRATION`environment variable
        to `True`.

        Args:
            src_mv: A :py:class:`mlflow.entities.model_registry.ModelVersion` object representing
                the source model version.
            dst_name: The name of the registered model to copy the model version to. If a
                registered model with this name does not exist, it will be created.

        Returns:
            Single :py:class:`mlflow.entities.model_registry.ModelVersion` object representing
            the cloned model version.
        """
        if dst_name.count(".") == 2:
            source_uri = f"models:/{src_mv.name}/{src_mv.version}"
            try:
                local_model_dir = mlflow.artifacts.download_artifacts(
                    artifact_uri=source_uri,
                    tracking_uri=self.tracking_uri,
                    registry_uri="databricks",
                )
            except Exception as e:
                raise MlflowException(
                    f"Unable to download model {src_mv.name} version {src_mv.version} "
                    f"artifacts from Databricks workspace registry in order to migrate "
                    f"them to Unity Catalog. Please ensure the model version artifacts "
                    f"exist and that you can download them via "
                    f"mlflow.artifacts.download_artifacts()"
                ) from e
            uc_store = UcModelRegistryStore(
                store_uri=_DATABRICKS_UNITY_CATALOG_SCHEME,
                tracking_uri=self.tracking_uri,
            )
            try:
                create_model_response = uc_store.create_registered_model(dst_name)
                eprint(f"Successfully registered model '{create_model_response.name}'.")
            except MlflowException as e:
                if e.error_code != ErrorCode.Name(RESOURCE_ALREADY_EXISTS):
                    raise
                eprint(
                    f"Registered model '{dst_name}' already exists."
                    f" Creating a new version of this model..."
                )
            skip_signature = MLFLOW_SKIP_SIGNATURE_CHECK_FOR_UC_REGISTRY_MIGRATION.get()
            source_workspace_id = _extract_workspace_id_from_run_link(src_mv.run_link)
            return uc_store._create_model_version_with_optional_signature_validation(
                name=dst_name,
                source=source_uri,
                run_id=src_mv.run_id,
                local_model_path=local_model_dir,
                model_id=src_mv.model_id,
                bypass_signature_validation=skip_signature,
                source_workspace_id=source_workspace_id,
            )
        else:
            return super().copy_model_version(src_mv, dst_name)
```

--------------------------------------------------------------------------------

````
