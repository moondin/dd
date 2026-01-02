---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 259
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 259 of 991)

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

---[FILE: app.py]---
Location: mlflow-master/mlflow/gateway/app.py
Signals: FastAPI, Pydantic

```python
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException, Request
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.responses import FileResponse, RedirectResponse
from pydantic import BaseModel, ConfigDict
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from mlflow.deployments.server.config import Endpoint
from mlflow.deployments.server.constants import (
    MLFLOW_DEPLOYMENTS_CRUD_ENDPOINT_BASE,
    MLFLOW_DEPLOYMENTS_ENDPOINTS_BASE,
    MLFLOW_DEPLOYMENTS_HEALTH_ENDPOINT,
    MLFLOW_DEPLOYMENTS_LIMITS_BASE,
    MLFLOW_DEPLOYMENTS_LIST_ENDPOINTS_PAGE_SIZE,
    MLFLOW_DEPLOYMENTS_QUERY_SUFFIX,
)
from mlflow.environment_variables import (
    MLFLOW_GATEWAY_CONFIG,
    MLFLOW_GATEWAY_RATE_LIMITS_STORAGE_URI,
)
from mlflow.exceptions import MlflowException
from mlflow.gateway.base_models import SetLimitsModel
from mlflow.gateway.config import (
    EndpointConfig,
    EndpointType,
    GatewayConfig,
    LimitsConfig,
    Provider,
    TrafficRouteConfig,
    _LegacyRoute,
    _load_gateway_config,
)
from mlflow.gateway.constants import (
    MLFLOW_GATEWAY_CRUD_ENDPOINT_V3_BASE,
    MLFLOW_GATEWAY_CRUD_ROUTE_BASE,
    MLFLOW_GATEWAY_CRUD_ROUTE_V3_BASE,
    MLFLOW_GATEWAY_HEALTH_ENDPOINT,
    MLFLOW_GATEWAY_LIMITS_BASE,
    MLFLOW_GATEWAY_ROUTE_BASE,
    MLFLOW_GATEWAY_SEARCH_ROUTES_PAGE_SIZE,
    MLFLOW_QUERY_SUFFIX,
)
from mlflow.gateway.providers import get_provider
from mlflow.gateway.schemas import chat, completions, embeddings
from mlflow.gateway.utils import (
    SearchRoutesToken,
    make_streaming_response,
    translate_http_exception,
)
from mlflow.version import VERSION


class GatewayAPI(FastAPI):
    def __init__(self, config: GatewayConfig, limiter: Limiter, *args: Any, **kwargs: Any):
        super().__init__(*args, **kwargs)
        self.state.limiter = limiter
        self.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
        self.dynamic_endpoints: dict[str, EndpointConfig] = {
            endpoint.name: endpoint for endpoint in config.endpoints
        }
        self.traffic_routes: dict[str, TrafficRouteConfig] = {
            route.name: route for route in (config.routes or [])
        }

        # config API routes
        for name in self.dynamic_endpoints.keys() | self.traffic_routes.keys():
            # TODO: Remove deployments server URLs after deprecation window elapses
            self.add_api_route(
                path=(MLFLOW_DEPLOYMENTS_ENDPOINTS_BASE + name + MLFLOW_DEPLOYMENTS_QUERY_SUFFIX),
                endpoint=_get_endpoint_handler(self, name, limiter, "deployments"),
                methods=["POST"],
            )
            self.add_api_route(
                path=f"{MLFLOW_GATEWAY_ROUTE_BASE}{name}{MLFLOW_QUERY_SUFFIX}",
                endpoint=_get_endpoint_handler(self, name, limiter, "gateway"),
                methods=["POST"],
                include_in_schema=False,
            )

    def _get_provider_by_name(self, name: str) -> tuple[Provider, EndpointType]:
        """
        If the name is an endpoint name, return the endpoint's provider
        If the name is a traffic route name, return a `TrafficRouteProvider`
        """
        from mlflow.gateway.providers.base import TrafficRouteProvider

        if name in self.dynamic_endpoints:
            config = self.dynamic_endpoints[name]
            return get_provider(config.model.provider)(config), config.endpoint_type
        if name in self.traffic_routes:
            route_config = self.traffic_routes[name]
            endpoint_configs = [
                self.dynamic_endpoints[destination.name]
                for destination in route_config.destinations
            ]
            traffic_splits = [
                destination.traffic_percentage for destination in route_config.destinations
            ]
            return TrafficRouteProvider(
                endpoint_configs,
                traffic_splits,
                route_config.routing_strategy,
            ), route_config.task_type
        raise MlflowException.invalid_parameter_value(f"Invalid endpoint / route name: '{name}'")

    def get_dynamic_endpoint(self, endpoint_name: str) -> Endpoint | None:
        return r.to_endpoint() if (r := self.dynamic_endpoints.get(endpoint_name)) else None

    def _get_legacy_dynamic_route(self, route_name: str) -> _LegacyRoute | None:
        return r._to_legacy_route() if (r := self.dynamic_endpoints.get(route_name)) else None


def _create_chat_endpoint(prov: Provider):
    # https://slowapi.readthedocs.io/en/latest/#limitations-and-known-issues
    @translate_http_exception
    async def _chat(
        request: Request, payload: chat.RequestPayload
    ) -> chat.ResponsePayload | chat.StreamResponsePayload:
        if payload.stream:
            return await make_streaming_response(prov.chat_stream(payload))
        else:
            return await prov.chat(payload)

    return _chat


def _create_completions_endpoint(prov: Provider):
    @translate_http_exception
    async def _completions(
        request: Request, payload: completions.RequestPayload
    ) -> completions.ResponsePayload | completions.StreamResponsePayload:
        if payload.stream:
            return await make_streaming_response(prov.completions_stream(payload))
        else:
            return await prov.completions(payload)

    return _completions


def _create_embeddings_endpoint(prov: Provider):
    @translate_http_exception
    async def _embeddings(
        request: Request, payload: embeddings.RequestPayload
    ) -> embeddings.ResponsePayload:
        return await prov.embeddings(payload)

    return _embeddings


async def _custom(request: Request):
    return request.json()


def _get_endpoint_handler(gateway_api: GatewayAPI, name: str, limiter: Limiter, key: str):
    endpoint_type_to_factory = {
        EndpointType.LLM_V1_CHAT: _create_chat_endpoint,
        EndpointType.LLM_V1_COMPLETIONS: _create_completions_endpoint,
        EndpointType.LLM_V1_EMBEDDINGS: _create_embeddings_endpoint,
    }
    provider, endpoint_type = gateway_api._get_provider_by_name(name)

    if factory := endpoint_type_to_factory.get(endpoint_type):
        handler = factory(provider)

        if name in gateway_api.dynamic_endpoints:
            limit = gateway_api.dynamic_endpoints[name].limit
        else:
            limit = None

        if limit:
            limit_value = f"{limit.calls}/{limit.renewal_period}"
            handler.__name__ = f"{handler.__name__}_{name}_{key}"
            return limiter.limit(limit_value)(handler)
        else:
            return handler

    raise HTTPException(
        status_code=404,
        detail=f"Unexpected route type {endpoint_type!r} for route {name!r}.",
    )


class HealthResponse(BaseModel):
    status: str


class ListEndpointsResponse(BaseModel):
    endpoints: list[Endpoint]
    next_page_token: str | None = None

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "endpoints": [
                    {
                        "name": "openai-chat",
                        "endpoint_type": "llm/v1/chat",
                        "model": {
                            "name": "gpt-4o-mini",
                            "provider": "openai",
                        },
                        "limit": {"calls": 1, "key": None, "renewal_period": "minute"},
                    },
                    {
                        "name": "anthropic-completions",
                        "endpoint_type": "llm/v1/completions",
                        "model": {
                            "name": "claude-instant-100k",
                            "provider": "anthropic",
                        },
                    },
                    {
                        "name": "cohere-embeddings",
                        "endpoint_type": "llm/v1/embeddings",
                        "model": {
                            "name": "embed-english-v2.0",
                            "provider": "cohere",
                        },
                    },
                ],
                "next_page_token": "eyJpbmRleCI6IDExfQ==",
            }
        }
    )


class _LegacySearchRoutesResponse(BaseModel):
    routes: list[_LegacyRoute]
    next_page_token: str | None = None

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "endpoints": [
                    {
                        "name": "openai-chat",
                        "route_type": "llm/v1/chat",
                        "model": {
                            "name": "gpt-4o-mini",
                            "provider": "openai",
                        },
                    },
                    {
                        "name": "anthropic-completions",
                        "route_type": "llm/v1/completions",
                        "model": {
                            "name": "claude-instant-100k",
                            "provider": "anthropic",
                        },
                    },
                    {
                        "name": "cohere-embeddings",
                        "route_type": "llm/v1/embeddings",
                        "model": {
                            "name": "embed-english-v2.0",
                            "provider": "cohere",
                        },
                    },
                ],
                "next_page_token": "eyJpbmRleCI6IDExfQ==",
            }
        }
    )


def create_app_from_config(config: GatewayConfig) -> GatewayAPI:
    """
    Create the GatewayAPI app from the gateway configuration.
    """
    limiter = Limiter(
        key_func=get_remote_address, storage_uri=MLFLOW_GATEWAY_RATE_LIMITS_STORAGE_URI.get()
    )
    app = GatewayAPI(
        config=config,
        limiter=limiter,
        title="MLflow AI Gateway",
        description="The core deployments API for reverse proxy interface using remote inference "
        "endpoints within MLflow",
        version=VERSION,
        docs_url=None,
    )

    @app.get("/", include_in_schema=False)
    async def index():
        return RedirectResponse(url="/docs")

    @app.get("/favicon.ico", include_in_schema=False)
    async def favicon():
        for directory in ["build", "public"]:
            favicon_file = Path(__file__).parent.parent.joinpath(
                "server", "js", directory, "favicon.ico"
            )
            if favicon_file.exists():
                return FileResponse(favicon_file)
        raise HTTPException(status_code=404, detail="favicon.ico not found")

    @app.get("/docs", include_in_schema=False)
    async def docs():
        return get_swagger_ui_html(
            openapi_url="/openapi.json",
            title="MLflow AI Gateway",
            swagger_favicon_url="/favicon.ico",
        )

    # TODO: Remove deployments server URLs after deprecation window elapses
    @app.get(MLFLOW_DEPLOYMENTS_HEALTH_ENDPOINT)
    @app.get(MLFLOW_GATEWAY_HEALTH_ENDPOINT, include_in_schema=False)
    async def health() -> HealthResponse:
        return {"status": "OK"}

    # TODO: Remove deployments server URLs after deprecation window elapses
    @app.get(MLFLOW_DEPLOYMENTS_CRUD_ENDPOINT_BASE + "{endpoint_name}")
    async def get_endpoint(endpoint_name: str) -> Endpoint:
        if matched := app.get_dynamic_endpoint(endpoint_name):
            return matched

        raise HTTPException(
            status_code=404,
            detail=f"The endpoint '{endpoint_name}' is not present or active on the server. Please "
            "verify the endpoint name.",
        )

    # TODO: Remove the deprecated endpoint
    @app.get(
        MLFLOW_GATEWAY_CRUD_ROUTE_BASE + "{route_name}", include_in_schema=False, deprecated=True
    )
    async def _legacy_get_route(route_name: str) -> _LegacyRoute:
        if matched := app._get_legacy_dynamic_route(route_name):
            return matched

        raise HTTPException(
            status_code=404,
            detail=f"The route '{route_name}' is not present or active on the server. Please "
            "verify the route name.",
        )

    @app.get(MLFLOW_GATEWAY_CRUD_ENDPOINT_V3_BASE + "{endpoint_name}", include_in_schema=False)
    async def get_endpoint_v3(endpoint_name: str) -> Endpoint:
        if matched := app.dynamic_endpoints.get(endpoint_name):
            return matched.to_endpoint()

        raise HTTPException(
            status_code=404,
            detail=f"The endpoint '{endpoint_name}' is not present or active on the server. "
            f"Please verify the endpoint name.",
        )

    @app.get(MLFLOW_GATEWAY_CRUD_ROUTE_V3_BASE + "{route_name}", include_in_schema=False)
    async def get_route_v3(route_name: str) -> TrafficRouteConfig:
        if matched := app.traffic_routes.get(route_name):
            return matched

        raise HTTPException(
            status_code=404,
            detail=f"The route '{route_name}' is not present or active on the server. "
            f"Please verify the route name.",
        )

    # TODO: Remove deployments server URLs after deprecation window elapses
    @app.get(MLFLOW_DEPLOYMENTS_CRUD_ENDPOINT_BASE)
    async def list_endpoints(page_token: str | None = None) -> ListEndpointsResponse:
        start_idx = SearchRoutesToken.decode(page_token).index if page_token is not None else 0

        end_idx = start_idx + MLFLOW_DEPLOYMENTS_LIST_ENDPOINTS_PAGE_SIZE
        endpoints = list(app.dynamic_endpoints.values())
        result = {
            "endpoints": [endpoint.to_endpoint() for endpoint in endpoints[start_idx:end_idx]]
        }
        if len(endpoints[end_idx:]) > 0:
            next_page_token = SearchRoutesToken(index=end_idx)
            result["next_page_token"] = next_page_token.encode()

        return result

    # TODO: Remove the deprecated endpoint
    @app.get(MLFLOW_GATEWAY_CRUD_ROUTE_BASE, include_in_schema=False, deprecated=True)
    async def _legacy_search_routes(page_token: str | None = None) -> _LegacySearchRoutesResponse:
        start_idx = SearchRoutesToken.decode(page_token).index if page_token is not None else 0

        end_idx = start_idx + MLFLOW_GATEWAY_SEARCH_ROUTES_PAGE_SIZE
        routes = list(app.dynamic_endpoints.values())
        result = {"routes": [r._to_legacy_route() for r in routes[start_idx:end_idx]]}
        if len(routes[end_idx:]) > 0:
            next_page_token = SearchRoutesToken(index=end_idx)
            result["next_page_token"] = next_page_token.encode()

        return result

    # TODO: Remove deployments server URLs after deprecation window elapses
    @app.get(MLFLOW_DEPLOYMENTS_LIMITS_BASE + "{endpoint}")
    @app.get(MLFLOW_GATEWAY_LIMITS_BASE + "{endpoint}", include_in_schema=False)
    async def get_limits(endpoint: str) -> LimitsConfig:
        raise HTTPException(status_code=501, detail="The get_limits API is not available yet.")

    # TODO: Remove deployments server URLs after deprecation window elapses
    @app.post(MLFLOW_DEPLOYMENTS_LIMITS_BASE)
    @app.post(MLFLOW_GATEWAY_LIMITS_BASE, include_in_schema=False)
    async def set_limits(payload: SetLimitsModel) -> LimitsConfig:
        raise HTTPException(status_code=501, detail="The set_limits API is not available yet.")

    @app.post("/v1/chat/completions")
    async def openai_chat_handler(
        request: Request, payload: chat.RequestPayload
    ) -> chat.ResponsePayload:
        name = payload.model
        prov, endpoint_type = app._get_provider_by_name(name)

        if endpoint_type != EndpointType.LLM_V1_CHAT:
            raise HTTPException(
                status_code=400,
                detail=f"Endpoint {name!r} is not a chat endpoint.",
            )

        payload.model = None  # provider rejects a request with model field, must be set to None
        if payload.stream:
            return await make_streaming_response(prov.chat_stream(payload))
        else:
            return await prov.chat(payload)

    @app.post("/v1/completions")
    async def openai_completions_handler(
        request: Request, payload: completions.RequestPayload
    ) -> completions.ResponsePayload:
        name = payload.model
        prov, endpoint_type = app._get_provider_by_name(name)

        if endpoint_type != EndpointType.LLM_V1_COMPLETIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Endpoint {name!r} is not a completions endpoint.",
            )

        payload.model = None  # provider rejects a request with model field, must be set to None
        if payload.stream:
            return await make_streaming_response(prov.completions_stream(payload))
        else:
            return await prov.completions(payload)

    @app.post("/v1/embeddings")
    async def openai_embeddings_handler(
        request: Request, payload: embeddings.RequestPayload
    ) -> embeddings.ResponsePayload:
        name = payload.model
        prov, endpoint_type = app._get_provider_by_name(name)

        if endpoint_type != EndpointType.LLM_V1_EMBEDDINGS:
            raise HTTPException(
                status_code=400,
                detail=f"Endpoint {name!r} is not an embeddings endpoint.",
            )

        payload.model = None  # provider rejects a request with model field, must be set to None
        return await prov.embeddings(payload)

    return app


def create_app_from_path(config_path: str | Path) -> GatewayAPI:
    """
    Load the path and generate the GatewayAPI app instance.
    """
    config = _load_gateway_config(config_path)
    return create_app_from_config(config)


def create_app_from_env() -> GatewayAPI:
    """
    Load the path from the environment variable and generate the GatewayAPI app instance.
    """
    if config_path := MLFLOW_GATEWAY_CONFIG.get():
        return create_app_from_path(config_path)

    raise MlflowException(
        f"Environment variable {MLFLOW_GATEWAY_CONFIG!r} is not set. "
        "Please set it to the path of the gateway configuration file."
    )
```

--------------------------------------------------------------------------------

---[FILE: base_models.py]---
Location: mlflow-master/mlflow/gateway/base_models.py
Signals: Pydantic

```python
from typing import Any

from pydantic import BaseModel


class RequestModel(
    BaseModel,
    # Allow extra fields for pydantic request models, e.g. to support
    # vendor-specific embeddings parameters
    extra="allow",
):
    """
    A pydantic model representing Gateway request data, such as a chat or completions request
    """


class ResponseModel(
    BaseModel,
    # Ignore extra fields for pydantic response models to ensure a consistent response
    # experience for clients across different backends
    extra="ignore",
):
    """
    A pydantic model representing Gateway response data, such as information about a Gateway
    Route returned in response to a GetRoute request
    """


class ConfigModel(
    BaseModel,
    # Ignore extra fields for pydantic config models, since they are unused
    extra="ignore",
):
    """
    A pydantic model representing Gateway configuration data, such as an OpenAI completions
    route definition including route name, model name, API keys, etc.
    """


class LimitModel(
    BaseModel,
    # Ignore extra fields for pydantic limit models, since they are unused
    extra="ignore",
):
    """
    A pydantic model representing Gateway Limit data, such as renewal period, limit
    key, limit value, etc.
    """


class SetLimitsModel(
    BaseModel,
    # Ignore extra fields for pydantic limit models, since they are unused
    extra="ignore",
):
    route: str
    limits: list[dict[str, Any]]
    """
    A pydantic model representing Gateway SetLimits request body, containing route and limits.
    """
```

--------------------------------------------------------------------------------

---[FILE: cli.py]---
Location: mlflow-master/mlflow/gateway/cli.py

```python
import click

from mlflow.environment_variables import MLFLOW_GATEWAY_CONFIG
from mlflow.gateway.config import _validate_config
from mlflow.gateway.runner import run_app
from mlflow.utils.os import is_windows


def validate_config_path(_ctx, _param, value):
    try:
        _validate_config(value)
        return value
    except Exception as e:
        raise click.BadParameter(str(e))


@click.group("gateway", help="Manage the MLflow Gateway service")
def commands():
    pass


# TODO: add telemetry decorator
@commands.command("start", help="Start the MLflow Gateway service")
@click.option(
    "--config-path",
    envvar=MLFLOW_GATEWAY_CONFIG.name,
    callback=validate_config_path,
    required=True,
    help="The path to the gateway configuration file.",
)
@click.option(
    "--host",
    default="127.0.0.1",
    help="The network address to listen on (default: 127.0.0.1).",
)
@click.option(
    "--port",
    default=5000,
    help="The port to listen on (default: 5000).",
)
@click.option(
    "--workers",
    default=2,
    help="The number of workers.",
)
def start(config_path: str, host: str, port: str, workers: int):
    if is_windows():
        raise click.ClickException("MLflow AI Gateway does not support Windows.")
    run_app(config_path=config_path, host=host, port=port, workers=workers)
```

--------------------------------------------------------------------------------

---[FILE: config.py]---
Location: mlflow-master/mlflow/gateway/config.py
Signals: Pydantic

```python
import json
import logging
import os
import pathlib
from enum import Enum
from pathlib import Path
from typing import TYPE_CHECKING, Any, Literal

import pydantic
import yaml
from pydantic import ConfigDict, ValidationError, field_validator, model_validator
from pydantic.json import pydantic_encoder

from mlflow.exceptions import MlflowException
from mlflow.gateway.base_models import ConfigModel, LimitModel, ResponseModel
from mlflow.gateway.constants import (
    MLFLOW_AI_GATEWAY_MOSAICML_CHAT_SUPPORTED_MODEL_PREFIXES,
    MLFLOW_GATEWAY_ROUTE_BASE,
    MLFLOW_QUERY_SUFFIX,
)
from mlflow.gateway.utils import (
    check_configuration_deprecated_fields,
    check_configuration_route_name_collisions,
    is_valid_ai21labs_model,
    is_valid_endpoint_name,
    is_valid_mosiacml_chat_model,
)

_logger = logging.getLogger(__name__)

from pydantic import SerializeAsAny

if TYPE_CHECKING:
    from mlflow.deployments.server.config import Endpoint


class Provider(str, Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    COHERE = "cohere"
    AI21LABS = "ai21labs"
    MLFLOW_MODEL_SERVING = "mlflow-model-serving"
    MOSAICML = "mosaicml"
    HUGGINGFACE_TEXT_GENERATION_INFERENCE = "huggingface-text-generation-inference"
    PALM = "palm"
    GEMINI = "gemini"
    BEDROCK = "bedrock"
    AMAZON_BEDROCK = "amazon-bedrock"  # an alias for bedrock
    # Note: The following providers are only supported on Databricks
    DATABRICKS_MODEL_SERVING = "databricks-model-serving"
    DATABRICKS = "databricks"
    MISTRAL = "mistral"
    TOGETHERAI = "togetherai"
    LITELLM = "litellm"

    @classmethod
    def values(cls):
        return {p.value for p in cls}


class TogetherAIConfig(ConfigModel):
    togetherai_api_key: str

    @field_validator("togetherai_api_key", mode="before")
    def validate_togetherai_api_key(cls, value):
        return _resolve_api_key_from_input(value)


class EndpointType(str, Enum):
    LLM_V1_COMPLETIONS = "llm/v1/completions"
    LLM_V1_CHAT = "llm/v1/chat"
    LLM_V1_EMBEDDINGS = "llm/v1/embeddings"


class CohereConfig(ConfigModel):
    cohere_api_key: str

    @field_validator("cohere_api_key", mode="before")
    def validate_cohere_api_key(cls, value):
        return _resolve_api_key_from_input(value)


class AI21LabsConfig(ConfigModel):
    ai21labs_api_key: str

    @field_validator("ai21labs_api_key", mode="before")
    def validate_ai21labs_api_key(cls, value):
        return _resolve_api_key_from_input(value)


class MosaicMLConfig(ConfigModel):
    mosaicml_api_key: str
    mosaicml_api_base: str | None = None

    @field_validator("mosaicml_api_key", mode="before")
    def validate_mosaicml_api_key(cls, value):
        return _resolve_api_key_from_input(value)


class OpenAIAPIType(str, Enum):
    OPENAI = "openai"
    AZURE = "azure"
    AZUREAD = "azuread"

    @classmethod
    def _missing_(cls, value):
        """
        Implements case-insensitive matching of API type strings
        """
        for api_type in cls:
            if api_type.value == value.lower():
                return api_type

        raise MlflowException.invalid_parameter_value(f"Invalid OpenAI API type '{value}'")


class OpenAIConfig(ConfigModel):
    openai_api_key: str
    openai_api_type: OpenAIAPIType = OpenAIAPIType.OPENAI
    openai_api_base: str | None = None
    openai_api_version: str | None = None
    openai_deployment_name: str | None = None
    openai_organization: str | None = None

    @field_validator("openai_api_key", mode="before")
    def validate_openai_api_key(cls, value):
        return _resolve_api_key_from_input(value)

    @classmethod
    def _validate_field_compatibility(cls, info: dict[str, Any]):
        if not isinstance(info, dict):
            return info
        api_type = (info.get("openai_api_type") or OpenAIAPIType.OPENAI).lower()
        if api_type == OpenAIAPIType.OPENAI:
            if info.get("openai_deployment_name") is not None:
                raise MlflowException.invalid_parameter_value(
                    f"OpenAI route configuration can only specify a value for "
                    f"'openai_deployment_name' if 'openai_api_type' is '{OpenAIAPIType.AZURE}' "
                    f"or '{OpenAIAPIType.AZUREAD}'. Found type: '{api_type}'"
                )
            if info.get("openai_api_base") is None:
                info["openai_api_base"] = "https://api.openai.com/v1"
        elif api_type in (OpenAIAPIType.AZURE, OpenAIAPIType.AZUREAD):
            if info.get("openai_organization") is not None:
                raise MlflowException.invalid_parameter_value(
                    f"OpenAI route configuration can only specify a value for "
                    f"'openai_organization' if 'openai_api_type' is '{OpenAIAPIType.OPENAI}'"
                )
            base_url = info.get("openai_api_base")
            deployment_name = info.get("openai_deployment_name")
            api_version = info.get("openai_api_version")
            if (base_url, deployment_name, api_version).count(None) > 0:
                raise MlflowException.invalid_parameter_value(
                    f"OpenAI route configuration must specify 'openai_api_base', "
                    f"'openai_deployment_name', and 'openai_api_version' if 'openai_api_type' is "
                    f"'{OpenAIAPIType.AZURE}' or '{OpenAIAPIType.AZUREAD}'."
                )
        else:
            raise MlflowException.invalid_parameter_value(f"Invalid OpenAI API type '{api_type}'")

        return info

    @model_validator(mode="before")
    def validate_field_compatibility(cls, info: dict[str, Any]):
        return cls._validate_field_compatibility(info)


class AnthropicConfig(ConfigModel):
    anthropic_api_key: str
    anthropic_version: str = "2023-06-01"

    @field_validator("anthropic_api_key", mode="before")
    def validate_anthropic_api_key(cls, value):
        return _resolve_api_key_from_input(value)


class PaLMConfig(ConfigModel):
    palm_api_key: str

    @field_validator("palm_api_key", mode="before")
    def validate_palm_api_key(cls, value):
        return _resolve_api_key_from_input(value)


class GeminiConfig(ConfigModel):
    gemini_api_key: str

    @field_validator("gemini_api_key", mode="before")
    def validate_gemini_api_key(cls, value):
        return _resolve_api_key_from_input(value)


class MlflowModelServingConfig(ConfigModel):
    model_server_url: str

    # Workaround to suppress warning that Pydantic raises when a field name starts with "model_".
    # https://github.com/mlflow/mlflow/issues/10335
    model_config = pydantic.ConfigDict(protected_namespaces=())


class HuggingFaceTextGenerationInferenceConfig(ConfigModel):
    hf_server_url: str


class AWSBaseConfig(pydantic.BaseModel):
    aws_region: str | None = None


class AWSRole(AWSBaseConfig):
    aws_role_arn: str
    session_length_seconds: int = 15 * 60


class AWSIdAndKey(AWSBaseConfig):
    aws_access_key_id: str
    aws_secret_access_key: str
    aws_session_token: str | None = None


class AmazonBedrockConfig(ConfigModel):
    # order here is important, at least for pydantic<2
    aws_config: AWSRole | AWSIdAndKey | AWSBaseConfig


class MistralConfig(ConfigModel):
    mistral_api_key: str

    @field_validator("mistral_api_key", mode="before")
    def validate_mistral_api_key(cls, value):
        return _resolve_api_key_from_input(value)


class LiteLLMConfig(ConfigModel):
    litellm_provider: str | None = None
    litellm_api_key: str | None = None
    litellm_api_base: str | None = None

    @field_validator("litellm_api_key", mode="before")
    def validate_litellm_api_key(cls, value):
        if value is None:
            return None
        return _resolve_api_key_from_input(value)


class ModelInfo(ResponseModel):
    name: str | None = None
    provider: Provider


def _resolve_api_key_from_input(api_key_input):
    """
    Resolves the provided API key.

    Input formats accepted:

    - Path to a file as a string which will have the key loaded from it
    - environment variable name that stores the api key
    - the api key itself
    """

    if not isinstance(api_key_input, str):
        raise MlflowException.invalid_parameter_value(
            "The api key provided is not a string. Please provide either an environment "
            "variable key, a path to a file containing the api key, or the api key itself"
        )

    # try reading as an environment variable
    if api_key_input.startswith("$"):
        env_var_name = api_key_input[1:]
        if env_var := os.getenv(env_var_name):
            return env_var
        else:
            raise MlflowException.invalid_parameter_value(
                f"Environment variable {env_var_name!r} is not set"
            )

    # try reading from a local path
    file = pathlib.Path(api_key_input)
    try:
        if file.is_file():
            return file.read_text()
    except OSError:
        # `is_file` throws an OSError if `api_key_input` exceeds the maximum filename length
        # (e.g., 255 characters on Unix).
        pass

    # if the key itself is passed, return
    return api_key_input


class Model(ConfigModel):
    name: str | None = None
    provider: str | Provider
    config: SerializeAsAny[ConfigModel] | None = None

    @field_validator("provider", mode="before")
    def validate_provider(cls, value):
        from mlflow.gateway.provider_registry import provider_registry

        if isinstance(value, Provider):
            return value
        formatted_value = value.replace("-", "_").upper()
        if formatted_value in Provider.__members__:
            return Provider[formatted_value]
        if value in provider_registry.keys():
            return value
        raise MlflowException.invalid_parameter_value(f"The provider '{value}' is not supported.")

    @classmethod
    def _validate_config(cls, val, context):
        from mlflow.gateway.provider_registry import provider_registry

        # For Pydantic v2: 'context' is a ValidationInfo object with a 'data' attribute.
        # For Pydantic v1: 'context' is dict-like 'values'.
        if provider := context.data.get("provider"):
            config_type = provider_registry.get(provider).CONFIG_TYPE
            return config_type(**val) if isinstance(val, dict) else val
        raise MlflowException.invalid_parameter_value(
            "A provider must be provided for each gateway route."
        )

    @field_validator("config", mode="before")
    def validate_config(cls, info, values):
        return cls._validate_config(info, values)


class AliasedConfigModel(ConfigModel):
    """
    Enables use of field aliases in a configuration model for backwards compatibility
    """

    model_config = ConfigDict(populate_by_name=True)


class Limit(LimitModel):
    calls: int
    key: str | None = None
    renewal_period: str


class LimitsConfig(ConfigModel):
    limits: list[Limit] | None = []


class EndpointConfig(AliasedConfigModel):
    name: str
    endpoint_type: EndpointType
    model: Model
    limit: Limit | None = None

    @field_validator("name")
    def validate_endpoint_name(cls, route_name):
        if not is_valid_endpoint_name(route_name):
            raise MlflowException.invalid_parameter_value(
                "The route name provided contains disallowed characters for a url endpoint. "
                f"'{route_name}' is invalid. Names cannot contain spaces or any non "
                "alphanumeric characters other than hyphen and underscore."
            )
        return route_name

    @field_validator("model", mode="before")
    def validate_model(cls, model):
        if model:
            model_instance = Model(**model)
            if model_instance.provider in Provider.values() and model_instance.config is None:
                raise MlflowException.invalid_parameter_value(
                    "A config must be supplied when setting a provider. The provider entry for "
                    f"{model_instance.provider} is incorrect."
                )
        return model

    @model_validator(mode="after")
    def validate_route_type_and_model_name(self):
        if (
            self.model
            and self.model.provider == "mosaicml"
            and self.endpoint_type == EndpointType.LLM_V1_CHAT
            and not is_valid_mosiacml_chat_model(self.model.name)
        ):
            raise MlflowException.invalid_parameter_value(
                f"An invalid model has been specified for the chat route. '{self.model.name}'. "
                f"Ensure the model selected starts with one of: "
                f"{MLFLOW_AI_GATEWAY_MOSAICML_CHAT_SUPPORTED_MODEL_PREFIXES}"
            )
        if (
            self.model
            and self.model.provider == "ai21labs"
            and not is_valid_ai21labs_model(self.model.name)
        ):
            raise MlflowException.invalid_parameter_value(
                f"An Unsupported AI21Labs model has been specified: '{self.model.name}'. "
                f"Please see documentation for supported models."
            )
        return self

    @field_validator("endpoint_type", mode="before")
    def validate_route_type(cls, value):
        if value in EndpointType._value2member_map_:
            return value
        raise MlflowException.invalid_parameter_value(f"The route_type '{value}' is not supported.")

    @field_validator("limit", mode="before")
    def validate_limit(cls, value):
        from limits import parse

        if value:
            limit = Limit(**value)
            try:
                parse(f"{limit.calls}/{limit.renewal_period}")
            except ValueError:
                raise MlflowException.invalid_parameter_value(
                    "Failed to parse the rate limit configuration."
                    "Please make sure limit.calls is a positive number and"
                    "limit.renewal_period is a right granularity"
                )

        return value

    def _to_legacy_route(self) -> "_LegacyRoute":
        return _LegacyRoute(
            name=self.name,
            route_type=self.endpoint_type,
            model=EndpointModelInfo(
                name=self.model.name,
                provider=self.model.provider,
            ),
            route_url=f"{MLFLOW_GATEWAY_ROUTE_BASE}{self.name}{MLFLOW_QUERY_SUFFIX}",
            limit=self.limit,
        )

    def to_endpoint(self) -> "Endpoint":
        from mlflow.deployments.server.config import Endpoint

        return Endpoint(
            name=self.name,
            endpoint_type=self.endpoint_type,
            model=EndpointModelInfo(
                name=self.model.name,
                provider=self.model.provider,
            ),
            endpoint_url=f"{MLFLOW_GATEWAY_ROUTE_BASE}{self.name}{MLFLOW_QUERY_SUFFIX}",
            limit=self.limit,
        )


class RouteDestinationConfig(ConfigModel):
    name: str
    traffic_percentage: int


class TrafficRouteConfig(ConfigModel):
    name: str
    task_type: EndpointType
    destinations: list[RouteDestinationConfig]
    routing_strategy: Literal["TRAFFIC_SPLIT"] = "TRAFFIC_SPLIT"


class EndpointModelInfo(ResponseModel):
    name: str | None = None
    # Use `str` instead of `Provider` enum to allow gateway backends such as Databricks to
    # support new providers without breaking the gateway client.
    provider: str


_ROUTE_EXTRA_SCHEMA = {
    "example": {
        "name": "openai-completions",
        "route_type": "llm/v1/completions",
        "model": {
            "name": "gpt-4o-mini",
            "provider": "openai",
        },
        "route_url": "/gateway/routes/completions/invocations",
    }
}


class _LegacyRoute(ConfigModel):
    name: str
    route_type: str
    model: EndpointModelInfo
    route_url: str
    limit: Limit | None = None

    model_config = ConfigDict(json_schema_extra=_ROUTE_EXTRA_SCHEMA)

    def to_endpoint(self):
        from mlflow.deployments.server.config import Endpoint

        return Endpoint(
            name=self.name,
            endpoint_type=self.route_type,
            model=self.model,
            endpoint_url=self.route_url,
            limit=self.limit,
        )


class GatewayConfig(AliasedConfigModel):
    endpoints: list[EndpointConfig]
    routes: list[TrafficRouteConfig] | None = None


def _load_gateway_config(path: str | Path) -> GatewayConfig:
    """
    Reads the gateway configuration yaml file from the storage location and returns an instance
    of the configuration RouteConfig class
    """
    if isinstance(path, str):
        path = Path(path)
    try:
        configuration = yaml.safe_load(path.read_text())
    except Exception as e:
        raise MlflowException.invalid_parameter_value(
            f"The file at {path} is not a valid yaml file"
        ) from e
    check_configuration_deprecated_fields(configuration)
    check_configuration_route_name_collisions(configuration)
    try:
        return GatewayConfig(**configuration)
    except ValidationError as e:
        raise MlflowException.invalid_parameter_value(
            f"The gateway configuration is invalid: {e}"
        ) from e


def _save_route_config(config: GatewayConfig, path: str | Path) -> None:
    if isinstance(path, str):
        path = Path(path)
    path.write_text(
        yaml.safe_dump(json.loads(json.dumps(config.model_dump(), default=pydantic_encoder)))
    )


def _validate_config(config_path: str) -> GatewayConfig:
    if not os.path.exists(config_path):
        raise MlflowException.invalid_parameter_value(f"{config_path} does not exist")

    try:
        return _load_gateway_config(config_path)
    except Exception as e:
        raise MlflowException.invalid_parameter_value(f"Invalid gateway configuration: {e}") from e
```

--------------------------------------------------------------------------------

````
