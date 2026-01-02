---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 692
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 692 of 991)

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

---[FILE: abstract_mixin.py]---
Location: mlflow-master/mlflow/store/tracking/gateway/abstract_mixin.py

```python
from typing import Any

from mlflow.entities import (
    GatewayEndpoint,
    GatewayEndpointBinding,
    GatewayEndpointModelMapping,
    GatewayEndpointTag,
    GatewayModelDefinition,
    GatewaySecretInfo,
)


class GatewayStoreMixin:
    """Mixin class providing Gateway API interface for tracking stores.

    This mixin adds Gateway functionality to tracking stores, enabling
    management of secrets, model definitions, endpoints, and bindings
    for the MLflow AI Gateway.
    """

    def create_gateway_secret(
        self,
        secret_name: str,
        secret_value: dict[str, str],
        provider: str | None = None,
        auth_config: dict[str, Any] | None = None,
        created_by: str | None = None,
    ) -> GatewaySecretInfo:
        """
        Create a new encrypted secret.

        Args:
            secret_name: Unique user-friendly name for the secret.
            secret_value: The secret value(s) to encrypt as a dict of key-value pairs.
                For simple API keys: {"api_key": "sk-xxx"}
                For compound credentials: {"aws_access_key_id": "...",
                  "aws_secret_access_key": "..."}
            provider: LLM provider (e.g., "openai", "anthropic", "cohere", "bedrock").
            auth_config: Optional provider-specific auth configuration. For providers
                with multiple auth modes, include "auth_mode" key (e.g.,
                {"auth_mode": "access_keys", "aws_region_name": "us-east-1"}).
            created_by: Username of the creator.

        Returns:
            Secret entity with metadata (encrypted value not included).
        """
        raise NotImplementedError(self.__class__.__name__)

    def get_secret_info(
        self, secret_id: str | None = None, secret_name: str | None = None
    ) -> GatewaySecretInfo:
        """
        Retrieve secret metadata by ID or name (does not decrypt the value).

        Args:
            secret_id: ID of the secret to retrieve.
            secret_name: Name of the secret to retrieve.

        Returns:
            Secret entity with metadata (encrypted value not included).
        """
        raise NotImplementedError(self.__class__.__name__)

    def update_gateway_secret(
        self,
        secret_id: str,
        secret_value: dict[str, str] | None = None,
        auth_config: dict[str, Any] | None = None,
        updated_by: str | None = None,
    ) -> GatewaySecretInfo:
        """
        Update an existing secret's configuration.

        Args:
            secret_id: ID of the secret to update.
            secret_value: Optional new secret value(s) to encrypt (key rotation).
                As a dict of key-value pairs, or None to leave unchanged.
                For simple API keys: {"api_key": "sk-xxx"}
                For compound credentials: {"aws_access_key_id": "...",
                  "aws_secret_access_key": "..."}
            auth_config: Optional updated provider-specific auth configuration.
                         If provided, replaces existing auth_config. If None,
                         auth_config is unchanged.
            updated_by: Username of the updater.

        Returns:
            Updated Secret entity.
        """
        raise NotImplementedError(self.__class__.__name__)

    def delete_gateway_secret(self, secret_id: str) -> None:
        """
        Permanently delete a secret.

        Model definitions that reference this secret will become orphaned (their
        secret_id will be set to NULL).

        Args:
            secret_id: ID of the secret to delete.
        """
        raise NotImplementedError(self.__class__.__name__)

    def list_secret_infos(self, provider: str | None = None) -> list[GatewaySecretInfo]:
        """
        List all secret metadata with optional filtering.

        Args:
            provider: Optional filter by LLM provider (e.g., "openai", "anthropic").

        Returns:
            List of Secret entities with metadata (encrypted values not included).
        """
        raise NotImplementedError(self.__class__.__name__)

    def create_gateway_model_definition(
        self,
        name: str,
        secret_id: str,
        provider: str,
        model_name: str,
        created_by: str | None = None,
    ) -> GatewayModelDefinition:
        """
        Create a reusable model definition.

        Model definitions can be shared across multiple endpoints, enabling centralized
        management of model configurations and API credentials.

        Args:
            name: User-friendly name for identification and reuse.
            secret_id: ID of the secret containing authentication credentials.
            provider: LLM provider (e.g., "openai", "anthropic", "cohere", "bedrock").
            model_name: Provider-specific model identifier (e.g., "gpt-4o", "claude-3-5-sonnet").
            created_by: Username of the creator.

        Returns:
            ModelDefinition entity with metadata.
        """
        raise NotImplementedError(self.__class__.__name__)

    def get_gateway_model_definition(
        self, model_definition_id: str | None = None, name: str | None = None
    ) -> GatewayModelDefinition:
        """
        Retrieve a model definition by ID or name.

        Args:
            model_definition_id: ID of the model definition to retrieve.
            name: Name of the model definition to retrieve.

        Returns:
            ModelDefinition entity with metadata.
        """
        raise NotImplementedError(self.__class__.__name__)

    def list_gateway_model_definitions(
        self,
        provider: str | None = None,
        secret_id: str | None = None,
    ) -> list[GatewayModelDefinition]:
        """
        List all model definitions with optional filtering.

        Args:
            provider: Optional filter by LLM provider.
            secret_id: Optional filter by secret ID.

        Returns:
            List of ModelDefinition entities with metadata.
        """
        raise NotImplementedError(self.__class__.__name__)

    def update_gateway_model_definition(
        self,
        model_definition_id: str,
        name: str | None = None,
        secret_id: str | None = None,
        model_name: str | None = None,
        updated_by: str | None = None,
        provider: str | None = None,
    ) -> GatewayModelDefinition:
        """
        Update a model definition.

        Args:
            model_definition_id: ID of the model definition to update.
            name: Optional new name.
            secret_id: Optional new secret ID.
            model_name: Optional new model name.
            updated_by: Username of the updater.
            provider: Optional new provider.

        Returns:
            Updated ModelDefinition entity.
        """
        raise NotImplementedError(self.__class__.__name__)

    def delete_gateway_model_definition(self, model_definition_id: str) -> None:
        """
        Delete a model definition.

        Fails with an error if the model definition is currently attached to any
        endpoints (RESTRICT behavior).

        Args:
            model_definition_id: ID of the model definition to delete.
        """
        raise NotImplementedError(self.__class__.__name__)

    def create_gateway_endpoint(
        self,
        name: str,
        model_definition_ids: list[str],
        created_by: str | None = None,
    ) -> GatewayEndpoint:
        """
        Create a new endpoint with references to existing model definitions.

        Args:
            name: User-friendly name for the endpoint.
            model_definition_ids: List of model definition IDs to attach to the endpoint.
                                  At least one model definition is required.
            created_by: Username of the creator.

        Returns:
            Endpoint entity with model_mappings populated.
        """
        raise NotImplementedError(self.__class__.__name__)

    def get_gateway_endpoint(
        self, endpoint_id: str | None = None, name: str | None = None
    ) -> GatewayEndpoint:
        """
        Retrieve an endpoint by ID or name with its model mappings populated.

        Args:
            endpoint_id: ID of the endpoint to retrieve.
            name: Name of the endpoint to retrieve.

        Returns:
            Endpoint entity with model_mappings list populated.
        """
        raise NotImplementedError(self.__class__.__name__)

    def update_gateway_endpoint(
        self,
        endpoint_id: str,
        name: str,
        updated_by: str | None = None,
    ) -> GatewayEndpoint:
        """
        Update an endpoint's name.

        Args:
            endpoint_id: ID of the endpoint to update.
            name: New name for the endpoint.
            updated_by: Username of the updater.

        Returns:
            Updated Endpoint entity.
        """
        raise NotImplementedError(self.__class__.__name__)

    def delete_gateway_endpoint(self, endpoint_id: str) -> None:
        """
        Delete an endpoint (CASCADE deletes bindings and model mappings).

        Args:
            endpoint_id: ID of the endpoint to delete.
        """
        raise NotImplementedError(self.__class__.__name__)

    def list_gateway_endpoints(
        self,
        provider: str | None = None,
        secret_id: str | None = None,
    ) -> list[GatewayEndpoint]:
        """
        List all endpoints with their model mappings populated.

        Args:
            provider: Optional filter by LLM provider (e.g., "openai", "anthropic").
                      Returns only endpoints that have at least one model from this provider.
            secret_id: Optional filter by secret ID. Returns only endpoints using this secret.
                       Useful for showing which endpoints would be affected by secret deletion.

        Returns:
            List of Endpoint entities with model_mappings.
        """
        raise NotImplementedError(self.__class__.__name__)

    def attach_model_to_endpoint(
        self,
        endpoint_id: str,
        model_definition_id: str,
        weight: float = 1.0,
        created_by: str | None = None,
    ) -> GatewayEndpointModelMapping:
        """
        Attach an existing model definition to an endpoint.

        Args:
            endpoint_id: ID of the endpoint to attach the model to.
            model_definition_id: ID of the model definition to attach.
            weight: Routing weight for traffic distribution (default 1.0).
            created_by: Username of the creator.

        Returns:
            EndpointModelMapping entity.
        """
        raise NotImplementedError(self.__class__.__name__)

    def detach_model_from_endpoint(
        self,
        endpoint_id: str,
        model_definition_id: str,
    ) -> None:
        """
        Detach a model definition from an endpoint.

        This removes the mapping but does not delete the model definition itself.

        Args:
            endpoint_id: ID of the endpoint.
            model_definition_id: ID of the model definition to detach.
        """
        raise NotImplementedError(self.__class__.__name__)

    def create_endpoint_binding(
        self,
        endpoint_id: str,
        resource_type: str,
        resource_id: str,
        created_by: str | None = None,
    ) -> GatewayEndpointBinding:
        """
        Bind an endpoint to an MLflow resource.

        Args:
            endpoint_id: ID of the endpoint to bind.
            resource_type: Type of resource (e.g., "scorer_job").
            resource_id: Unique identifier for the resource instance.
            created_by: Username of the creator.

        Returns:
            EndpointBinding entity.
        """
        raise NotImplementedError(self.__class__.__name__)

    def delete_endpoint_binding(
        self, endpoint_id: str, resource_type: str, resource_id: str
    ) -> None:
        """
        Delete an endpoint binding.

        Args:
            endpoint_id: ID of the endpoint.
            resource_type: Type of resource bound to the endpoint.
            resource_id: ID of the resource.
        """
        raise NotImplementedError(self.__class__.__name__)

    def list_endpoint_bindings(
        self,
        endpoint_id: str | None = None,
        resource_type: str | None = None,
        resource_id: str | None = None,
    ) -> list[GatewayEndpointBinding]:
        """
        List endpoint bindings with optional filtering.

        Args:
            endpoint_id: Optional filter by endpoint ID.
            resource_type: Optional filter by resource type.
            resource_id: Optional filter by resource ID.

        Returns:
            List of EndpointBinding entities (with optional endpoint_name and model_mappings).
        """
        raise NotImplementedError(self.__class__.__name__)

    def set_gateway_endpoint_tag(self, endpoint_id: str, tag: GatewayEndpointTag) -> None:
        """
        Set a tag on an endpoint.

        If a tag with the same key already exists, its value will be updated.

        Args:
            endpoint_id: ID of the endpoint to tag.
            tag: GatewayEndpointTag with key and value to set.
        """
        raise NotImplementedError(self.__class__.__name__)

    def delete_gateway_endpoint_tag(self, endpoint_id: str, key: str) -> None:
        """
        Delete a tag from an endpoint.

        Args:
            endpoint_id: ID of the endpoint.
            key: Tag key to delete.
        """
        raise NotImplementedError(self.__class__.__name__)
```

--------------------------------------------------------------------------------

---[FILE: config_resolver.py]---
Location: mlflow-master/mlflow/store/tracking/gateway/config_resolver.py

```python
"""
Server-side only configuration resolver for Gateway endpoints.

This module provides functions to retrieve decrypted endpoint configurations
for resources. These functions are privileged operations that should only be
called server-side and never exposed to clients via MlflowClient.
"""

import json

from mlflow.exceptions import MlflowException
from mlflow.store.tracking.dbmodels.models import (
    SqlGatewayEndpoint,
    SqlGatewayEndpointBinding,
    SqlGatewayModelDefinition,
    SqlGatewaySecret,
)
from mlflow.store.tracking.gateway.entities import GatewayEndpointConfig, GatewayModelConfig
from mlflow.store.tracking.sqlalchemy_store import SqlAlchemyStore
from mlflow.tracking._tracking_service.utils import _get_store
from mlflow.utils.crypto import KEKManager, _decrypt_secret


def get_resource_endpoint_configs(
    resource_type: str,
    resource_id: str,
    store: SqlAlchemyStore | None = None,
) -> list[GatewayEndpointConfig]:
    """
    Get complete endpoint configurations for a resource (server-side only).

    A resource can be bound to multiple endpoints. This returns everything
    needed to make LLM API calls: endpoint details, models, and resolved
    LiteLLM parameters. This is a privileged operation that should only be
    called server-side and never exposed to clients.

    If no store is provided, this function automatically retrieves the tracking
    store from the current MLflow configuration. It only works with SqlAlchemyStore
    backends.

    Args:
        resource_type: Type of resource (e.g., "scorer_job").
        resource_id: Unique identifier for the resource instance.
        store: Optional SqlAlchemyStore instance. If not provided, the current
            tracking store is used.

    Returns:
        List of GatewayEndpointConfig entities, each containing endpoint_id,
        endpoint_name, and list of GatewayModelConfig with resolved litellm_params
        ready to pass to litellm.completion().

    Raises:
        MlflowException: If the tracking store is not a SqlAlchemyStore,
            or if an endpoint, model definition, or secret is not found.
    """
    if store is None:
        store = _get_store()
    if not isinstance(store, SqlAlchemyStore):
        raise MlflowException(
            "Gateway endpoint configuration is only supported with SqlAlchemyStore backends. "
            f"Current store type: {type(store).__name__}"
        )

    with store.ManagedSessionMaker() as session:
        sql_bindings = (
            session.query(SqlGatewayEndpointBinding)
            .filter(
                SqlGatewayEndpointBinding.resource_type == resource_type,
                SqlGatewayEndpointBinding.resource_id == resource_id,
            )
            .all()
        )

        kek_manager = KEKManager()
        endpoint_configs = []

        for sql_binding in sql_bindings:
            sql_endpoint = store._get_entity_or_raise(
                session,
                SqlGatewayEndpoint,
                {"endpoint_id": sql_binding.endpoint_id},
                "GatewayEndpoint",
            )

            model_configs = []

            for sql_mapping in sql_endpoint.model_mappings:
                sql_model_def = store._get_entity_or_raise(
                    session,
                    SqlGatewayModelDefinition,
                    {"model_definition_id": sql_mapping.model_definition_id},
                    "GatewayModelDefinition",
                )

                if sql_model_def.secret_id is None:
                    continue

                sql_secret = store._get_entity_or_raise(
                    session,
                    SqlGatewaySecret,
                    {"secret_id": sql_model_def.secret_id},
                    "GatewaySecret",
                )

                # Decrypt secret (returns dict since we always store as JSON)
                secret_value = _decrypt_secret(
                    encrypted_value=sql_secret.encrypted_value,
                    wrapped_dek=sql_secret.wrapped_dek,
                    kek_manager=kek_manager,
                    secret_id=sql_secret.secret_id,
                    secret_name=sql_secret.secret_name,
                )

                # Parse auth_config
                auth_config = json.loads(sql_secret.auth_config) if sql_secret.auth_config else None

                model_configs.append(
                    GatewayModelConfig(
                        model_definition_id=sql_model_def.model_definition_id,
                        provider=sql_model_def.provider,
                        model_name=sql_model_def.model_name,
                        secret_value=secret_value,
                        auth_config=auth_config,
                    )
                )

            endpoint_configs.append(
                GatewayEndpointConfig(
                    endpoint_id=sql_endpoint.endpoint_id,
                    endpoint_name=sql_endpoint.name,
                    models=model_configs,
                )
            )

        return endpoint_configs


def get_endpoint_config(
    endpoint_name: str,
    store: SqlAlchemyStore | None = None,
) -> GatewayEndpointConfig:
    """
    Get complete endpoint configuration for a specific endpoint (server-side only).

    This returns everything needed to make LLM API calls for a specific endpoint:
    endpoint details, models, and decrypted secrets. This is a privileged operation
    that should only be called server-side and never exposed to clients.

    If no store is provided, this function automatically retrieves the tracking
    store from the current MLflow configuration. It only works with SqlAlchemyStore
    backends.

    Args:
        endpoint_name: Unique identifier for the endpoint.
        store: Optional SqlAlchemyStore instance. If not provided, the current
            tracking store is used.

    Returns:
        GatewayEndpointConfig entity containing endpoint_id, endpoint_name, and
        list of GatewayModelConfig with decrypted secret_value and auth_config.

    Raises:
        MlflowException: If the tracking store is not a SqlAlchemyStore,
            or if the endpoint, model definition, or secret is not found.
    """
    if store is None:
        store = _get_store()
    if not isinstance(store, SqlAlchemyStore):
        raise MlflowException(
            "Gateway endpoint configuration is only supported with SqlAlchemyStore backends. "
            f"Current store type: {type(store).__name__}"
        )

    with store.ManagedSessionMaker() as session:
        sql_endpoint = store._get_entity_or_raise(
            session,
            SqlGatewayEndpoint,
            {"name": endpoint_name},
            "GatewayEndpoint",
        )

        kek_manager = KEKManager()
        model_configs = []

        for sql_mapping in sql_endpoint.model_mappings:
            sql_model_def = store._get_entity_or_raise(
                session,
                SqlGatewayModelDefinition,
                {"model_definition_id": sql_mapping.model_definition_id},
                "GatewayModelDefinition",
            )

            if sql_model_def.secret_id is None:
                continue

            sql_secret = store._get_entity_or_raise(
                session,
                SqlGatewaySecret,
                {"secret_id": sql_model_def.secret_id},
                "GatewaySecret",
            )

            decrypted_value = _decrypt_secret(
                encrypted_value=sql_secret.encrypted_value,
                wrapped_dek=sql_secret.wrapped_dek,
                kek_manager=kek_manager,
                secret_id=sql_secret.secret_id,
                secret_name=sql_secret.secret_name,
            )

            model_configs.append(
                GatewayModelConfig(
                    model_definition_id=sql_model_def.model_definition_id,
                    provider=sql_model_def.provider,
                    model_name=sql_model_def.model_name,
                    secret_value=decrypted_value,
                    auth_config=json.loads(sql_secret.auth_config)
                    if sql_secret.auth_config
                    else None,
                )
            )

        return GatewayEndpointConfig(
            endpoint_id=sql_endpoint.endpoint_id,
            endpoint_name=sql_endpoint.name,
            models=model_configs,
        )
```

--------------------------------------------------------------------------------

---[FILE: entities.py]---
Location: mlflow-master/mlflow/store/tracking/gateway/entities.py

```python
from dataclasses import dataclass, field
from typing import Any


@dataclass
class GatewayModelConfig:
    """
    Model configuration with decrypted credentials for runtime use.

    This entity contains everything needed to make LLM API calls, including
    the decrypted secrets and auth configuration. This is only used
    server-side and should never be exposed to clients.

    Args:
        model_definition_id: Unique identifier for the model definition.
        provider: LLM provider (e.g., "openai", "anthropic", "cohere", "bedrock").
        model_name: Provider-specific model identifier (e.g., "gpt-4o").
        secret_value: Decrypted secrets as a dict. For providers with multiple
            auth modes, contains all secret fields (e.g., {"aws_access_key_id": "...",
            "aws_secret_access_key": "..."}). For simple providers, contains
            {"api_key": "..."}.
        auth_config: Non-secret configuration including auth_mode (e.g.,
            {"auth_mode": "access_keys", "aws_region_name": "us-east-1"}).
    """

    model_definition_id: str
    provider: str
    model_name: str
    secret_value: dict[str, Any]
    auth_config: dict[str, Any] | None = None


@dataclass
class GatewayEndpointConfig:
    """
    Complete endpoint configuration for resource runtime use.

    This entity contains all information needed for a resource to make LLM API calls,
    including decrypted secrets. This is only used server-side and should never be
    exposed to clients.

    Args:
        endpoint_id: Unique identifier for the endpoint.
        endpoint_name: User-friendly name for the endpoint.
        models: List of model configurations with decrypted credentials.
    """

    endpoint_id: str
    endpoint_name: str
    models: list[GatewayModelConfig] = field(default_factory=list)
```

--------------------------------------------------------------------------------

````
