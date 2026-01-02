---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 408
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 408 of 991)

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

---[FILE: AGENTS.md]---
Location: mlflow-master/mlflow/server/AGENTS.md

```text
# MLflow Tracking Server Security Configuration Guide

This document provides a quick reference for AI assistants to understand MLflow tracking server security options and configurations.

## Overview

The MLflow tracking server includes built-in security middleware to protect against common web vulnerabilities:

- **DNS rebinding attacks** - via Host header validation
- **Cross-Origin Resource Sharing (CORS) attacks** - via origin validation
- **Clickjacking** - via X-Frame-Options header

## Starting the Server

```bash
# Basic start (localhost-only, secure by default)
mlflow server

# Allow connections from other machines
mlflow server --host 0.0.0.0

# Custom port
mlflow server --port 8080
```

## Security Configuration Options

### 1. Host Header Validation (`--allowed-hosts`)

Prevents DNS rebinding attacks by validating the Host header in incoming requests.

```bash
# Allow specific hosts
mlflow server --allowed-hosts "mlflow.company.com,10.0.0.100:5000"

# Allow hosts with wildcards
mlflow server --allowed-hosts "mlflow.company.com,192.168.*,app-*.internal.com"

# DANGEROUS: Allow all hosts (not recommended for production)
mlflow server --allowed-hosts "*"
```

**Default behavior**: Allows localhost (all ports) and private IP ranges (10._, 192.168._, 172.16-31.\*).

### 2. CORS Origin Validation (`--cors-allowed-origins`)

Controls which web applications can make requests to your MLflow server.

```bash
# Allow specific origins
mlflow server --cors-allowed-origins "https://app.company.com,https://notebook.company.com"

# DANGEROUS: Allow all origins (only for development)
mlflow server --cors-allowed-origins "*"
```

**Default behavior**: Allows `http://localhost:*, http://127.0.0.1:*, http://[::1]:*` (all ports).

### 3. Clickjacking Protection (`--x-frame-options`)

Controls whether the MLflow UI can be embedded in iframes.

```bash
# Default: Same origin only
mlflow server --x-frame-options SAMEORIGIN

# Deny all iframe embedding
mlflow server --x-frame-options DENY

# Allow iframe embedding from anywhere (not recommended)
mlflow server --x-frame-options NONE
```

### 4. Disable Security Middleware (`--disable-security-middleware`)

**DANGEROUS**: Completely disables all security protections.

```bash
# Only for testing - removes all security protections
mlflow server --disable-security-middleware
```

## Common Configuration Scenarios

### Local Development (Default)

```bash
mlflow server
# Security: Enabled (localhost-only)
# Access: Only from local machine
```

### Team Development Server

```bash
mlflow server \
  --host 0.0.0.0 \
  --allowed-hosts "mlflow.dev.company.com,192.168.*" \
  --cors-allowed-origins "https://notebook.dev.company.com"
```

### Production Server

```bash
mlflow server \
  --host 0.0.0.0 \
  --allowed-hosts "mlflow.prod.company.com" \
  --cors-allowed-origins "https://app.prod.company.com,https://notebook.prod.company.com" \
  --x-frame-options DENY
```

### Docker Container Setup

```bash
# In docker-compose.yml, set environment variables:
environment:
  MLFLOW_SERVER_ALLOWED_HOSTS: "tracking-server:5000,localhost:5000,127.0.0.1:5000"
  MLFLOW_SERVER_CORS_ALLOWED_ORIGINS: "http://frontend:3000"
```

## Environment Variables

All CLI options can be set via environment variables:

- `MLFLOW_SERVER_ALLOWED_HOSTS` - Comma-separated list of allowed hosts
- `MLFLOW_SERVER_CORS_ALLOWED_ORIGINS` - Comma-separated list of allowed CORS origins
- `MLFLOW_SERVER_X_FRAME_OPTIONS` - Clickjacking protection setting
- `MLFLOW_SERVER_DISABLE_SECURITY_MIDDLEWARE` - Set to "true" to disable security

## Security Messages

When starting the server, users see one of these messages:

1. **Default configuration**:

   ```bash
   [MLflow] Security middleware enabled with default settings (localhost-only).
   To allow connections from other hosts, use --host 0.0.0.0 and configure
   --allowed-hosts and --cors-allowed-origins.
   ```

2. **Custom configuration**:

   ```bash
   [MLflow] Security middleware enabled. Allowed hosts: mlflow.company.com, 192.168.*.
   CORS origins: https://app.company.com.
   ```

3. **Security disabled**:

   ```bash
   [MLflow] WARNING: Security middleware is DISABLED. Your MLflow server is vulnerable to various attacks.
   ```

## Implementation Details

- Security middleware is implemented in:
  - Flask: `mlflow/server/security.py`
  - FastAPI: `mlflow/server/fastapi_security.py`
- Configuration messages displayed in: `mlflow/cli/__init__.py` (server function)
- Security is enabled by default unless explicitly disabled

## Testing Security Configuration

```bash
# Test Host header validation
curl -H "Host: evil.com" http://localhost:5000/api/2.0/mlflow/experiments/search
# Should return: 400 Bad Request - Invalid Host header

# Test CORS
curl -H "Origin: https://evil.com" http://localhost:5000/api/2.0/mlflow/experiments/search
# Should not include Access-Control-Allow-Origin header for unauthorized origin
```

## Important Notes

1. **Security by default**: The server is secure by default, only accepting localhost connections
2. **Host validation**: When using `--host 0.0.0.0`, always configure `--allowed-hosts`
3. **CORS in production**: Always specify exact origins, never use "\*" in production
4. **Docker networking**: Container names (e.g., "tracking-server") must be in allowed hosts
5. **Private IPs**: Default configuration allows private IP ranges for development convenience
```

--------------------------------------------------------------------------------

---[FILE: constants.py]---
Location: mlflow-master/mlflow/server/constants.py
Signals: Flask

```python
"""
Constants used for internal server-to-worker communication.

These are internal environment variables (prefixed with _MLFLOW_SERVER_) used for
communication between the MLflow CLI and forked server processes (gunicorn/uvicorn workers).
They are set by the server and read by workers, and should not be set by end users.
"""

# Backend store configuration
# URI for the backend store (e.g., sqlite:///mlflow.db, postgresql://..., mysql://...)
BACKEND_STORE_URI_ENV_VAR = "_MLFLOW_SERVER_FILE_STORE"

# URI for the model registry store (defaults to same as backend store if not specified)
REGISTRY_STORE_URI_ENV_VAR = "_MLFLOW_SERVER_REGISTRY_STORE"

# Default root directory for storing run artifacts when not explicitly specified
ARTIFACT_ROOT_ENV_VAR = "_MLFLOW_SERVER_ARTIFACT_ROOT"

# Destination for proxied artifact storage operations (used with --serve-artifacts)
ARTIFACTS_DESTINATION_ENV_VAR = "_MLFLOW_SERVER_ARTIFACT_DESTINATION"

# Server features
# Whether the server should act as an artifact proxy (enabled via --serve-artifacts)
SERVE_ARTIFACTS_ENV_VAR = "_MLFLOW_SERVER_SERVE_ARTIFACTS"

# Whether to run in artifacts-only mode (no tracking server, only artifact proxy)
ARTIFACTS_ONLY_ENV_VAR = "_MLFLOW_SERVER_ARTIFACTS_ONLY"

# Flask session secret key for signing cookies and sessions
# (user-configurable via MLFLOW_FLASK_SERVER_SECRET_KEY)
FLASK_SERVER_SECRET_KEY_ENV_VAR = "MLFLOW_FLASK_SERVER_SECRET_KEY"

# Monitoring
# Directory for Prometheus multiprocess metrics collection (enabled via --expose-prometheus)
PROMETHEUS_EXPORTER_ENV_VAR = "prometheus_multiproc_dir"

# Job execution
# Directory path for Huey SQLite task queue storage (used by job execution backend)
HUEY_STORAGE_PATH_ENV_VAR = "_MLFLOW_HUEY_STORAGE_PATH"

# Unique key identifying which Huey instance to use (typically the job function fullname)
MLFLOW_HUEY_INSTANCE_KEY = "_MLFLOW_HUEY_INSTANCE_KEY"

# Secrets management - KEK (Key Encryption Key) environment variables
# NOTE: These are duplicated in mlflow/utils/crypto.py for skinny client compatibility.
# The canonical definitions are in mlflow/utils/crypto.py to avoid Flask import dependency.
# These are kept here for documentation and backwards compatibility with server-side code.
#
# SECURITY: Server-admin-only credential. NEVER pass via CLI (visible in ps/logs).
# Set via environment variable or .env file. Users do NOT need this - only server admins.
# Must be high-entropy (32+ characters) from a secrets manager.
#
# KEK Rotation Workflow (for changing the passphrase):
#   1. Shut down the MLflow server
#   2. Set MLFLOW_CRYPTO_KEK_PASSPHRASE to the OLD passphrase
#   3. Run: mlflow crypto rotate-kek --new-passphrase "NEW_PASSPHRASE"
#   4. Update MLFLOW_CRYPTO_KEK_PASSPHRASE to NEW passphrase in deployment config
#   5. Restart the MLflow server
#
# The rotation is atomic and idempotent - safe to re-run if it fails.
CRYPTO_KEK_PASSPHRASE_ENV_VAR = "MLFLOW_CRYPTO_KEK_PASSPHRASE"

# KEK version for tracking which KEK encrypted each secret (default 1).
# Automatically tracked during rotation. See `mlflow crypto rotate-kek` for rotation workflow.
CRYPTO_KEK_VERSION_ENV_VAR = "MLFLOW_CRYPTO_KEK_VERSION"

# Secrets cache configuration
# Time-to-live for server-side secrets cache in seconds (10-300s range, default 60s)
SECRETS_CACHE_TTL_ENV_VAR = "MLFLOW_SERVER_SECRETS_CACHE_TTL"

# Maximum number of entries in server-side secrets cache (default 1000 entries)
SECRETS_CACHE_MAX_SIZE_ENV_VAR = "MLFLOW_SERVER_SECRETS_CACHE_MAX_SIZE"
```

--------------------------------------------------------------------------------

---[FILE: fastapi_app.py]---
Location: mlflow-master/mlflow/server/fastapi_app.py
Signals: FastAPI, Flask

```python
"""
FastAPI application wrapper for MLflow server.

This module provides a FastAPI application that wraps the existing Flask application
using WSGIMiddleware to maintain 100% API compatibility while enabling future migration
to FastAPI endpoints.
"""

from fastapi import FastAPI
from fastapi.middleware.wsgi import WSGIMiddleware
from flask import Flask

from mlflow.server import app as flask_app
from mlflow.server.fastapi_security import init_fastapi_security
from mlflow.server.gateway_api import gateway_router
from mlflow.server.job_api import job_api_router
from mlflow.server.otel_api import otel_router
from mlflow.version import VERSION


def create_fastapi_app(flask_app: Flask = flask_app):
    """
    Create a FastAPI application that wraps the existing Flask app.

    Returns:
        FastAPI application instance with the Flask app mounted via WSGIMiddleware.
    """
    # Create FastAPI app with metadata
    fastapi_app = FastAPI(
        title="MLflow Tracking Server",
        description="MLflow Tracking Server API",
        version=VERSION,
        # TODO: Enable API documentation when we have native FastAPI endpoints
        # For now, disable docs since we only have Flask routes via WSGI
        docs_url=None,
        redoc_url=None,
        openapi_url=None,
    )

    # Initialize security middleware BEFORE adding routes
    init_fastapi_security(fastapi_app)

    # Include OpenTelemetry API router BEFORE mounting Flask app
    # This ensures FastAPI routes take precedence over the catch-all Flask mount
    fastapi_app.include_router(otel_router)

    fastapi_app.include_router(job_api_router)

    # Include Gateway API router for database-backed endpoints
    # This provides /gateway/{endpoint_name}/mlflow/invocations routes
    fastapi_app.include_router(gateway_router)

    # Mount the entire Flask application at the root path
    # This ensures compatibility with existing APIs
    # NOTE: This must come AFTER include_router to avoid Flask catching all requests
    fastapi_app.mount("/", WSGIMiddleware(flask_app))

    return fastapi_app


# Create the app instance that can be used by ASGI servers
app = create_fastapi_app()
```

--------------------------------------------------------------------------------

---[FILE: fastapi_security.py]---
Location: mlflow-master/mlflow/server/fastapi_security.py
Signals: FastAPI

```python
import logging
from http import HTTPStatus

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.types import ASGIApp

from mlflow.environment_variables import (
    MLFLOW_SERVER_DISABLE_SECURITY_MIDDLEWARE,
    MLFLOW_SERVER_X_FRAME_OPTIONS,
)
from mlflow.server.security_utils import (
    CORS_BLOCKED_MSG,
    HEALTH_ENDPOINTS,
    INVALID_HOST_MSG,
    get_allowed_hosts_from_env,
    get_allowed_origins_from_env,
    get_default_allowed_hosts,
    is_allowed_host_header,
    is_api_endpoint,
    should_block_cors_request,
)
from mlflow.tracing.constant import TRACE_RENDERER_ASSET_PATH

_logger = logging.getLogger(__name__)


class HostValidationMiddleware:
    """Middleware to validate Host headers using fnmatch patterns."""

    def __init__(self, app: ASGIApp, allowed_hosts: list[str]):
        self.app = app
        self.allowed_hosts = allowed_hosts

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            return await self.app(scope, receive, send)

        if scope["path"] in HEALTH_ENDPOINTS:
            return await self.app(scope, receive, send)

        headers = dict(scope.get("headers", []))
        host = headers.get(b"host", b"").decode("utf-8")

        if not is_allowed_host_header(self.allowed_hosts, host):
            _logger.warning(f"Rejected request with invalid Host header: {host}")

            async def send_403(message):
                if message["type"] == "http.response.start":
                    message["status"] = 403
                    message["headers"] = [(b"content-type", b"text/plain")]
                await send(message)

            await send_403({"type": "http.response.start", "status": 403, "headers": []})
            await send({"type": "http.response.body", "body": INVALID_HOST_MSG.encode()})
            return

        return await self.app(scope, receive, send)


class SecurityHeadersMiddleware:
    """Middleware to add security headers to all responses."""

    def __init__(self, app: ASGIApp):
        self.app = app
        self.x_frame_options = MLFLOW_SERVER_X_FRAME_OPTIONS.get()

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            return await self.app(scope, receive, send)

        async def send_wrapper(message):
            if message["type"] == "http.response.start":
                headers = dict(message.get("headers", []))
                headers[b"x-content-type-options"] = b"nosniff"

                # Skip X-Frame-Options for notebook renderer to allow iframe embedding in notebooks
                path = scope.get("path", "")
                is_notebook_renderer = path.startswith(TRACE_RENDERER_ASSET_PATH)

                if (
                    self.x_frame_options
                    and self.x_frame_options.upper() != "NONE"
                    and not is_notebook_renderer
                ):
                    headers[b"x-frame-options"] = self.x_frame_options.upper().encode()

                if (
                    scope["method"] == "OPTIONS"
                    and message.get("status") == 200
                    and is_api_endpoint(scope["path"])
                ):
                    message["status"] = HTTPStatus.NO_CONTENT

                message["headers"] = list(headers.items())
            await send(message)

        await self.app(scope, receive, send_wrapper)


class CORSBlockingMiddleware:
    """Middleware to actively block cross-origin state-changing requests."""

    def __init__(self, app: ASGIApp, allowed_origins: list[str]):
        self.app = app
        self.allowed_origins = allowed_origins

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            return await self.app(scope, receive, send)

        if not is_api_endpoint(scope["path"]):
            return await self.app(scope, receive, send)

        method = scope["method"]
        headers = dict(scope["headers"])
        origin = headers.get(b"origin", b"").decode("utf-8")

        if should_block_cors_request(origin, method, self.allowed_origins):
            _logger.warning(f"Blocked cross-origin request from {origin}")
            await send(
                {
                    "type": "http.response.start",
                    "status": HTTPStatus.FORBIDDEN,
                    "headers": [[b"content-type", b"text/plain"]],
                }
            )
            await send(
                {
                    "type": "http.response.body",
                    "body": CORS_BLOCKED_MSG.encode(),
                }
            )
            return

        await self.app(scope, receive, send)


def get_allowed_hosts() -> list[str]:
    """Get list of allowed hosts from environment or defaults."""
    return get_allowed_hosts_from_env() or get_default_allowed_hosts()


def get_allowed_origins() -> list[str]:
    """Get list of allowed CORS origins from environment or defaults."""
    return get_allowed_origins_from_env() or []


def init_fastapi_security(app: FastAPI) -> None:
    """
    Initialize security middleware for FastAPI application.

    This configures:
    - Host header validation (DNS rebinding protection) via TrustedHostMiddleware
    - CORS protection via CORSMiddleware
    - Security headers via custom middleware

    Args:
        app: FastAPI application instance.
    """
    if MLFLOW_SERVER_DISABLE_SECURITY_MIDDLEWARE.get() == "true":
        return

    app.add_middleware(SecurityHeadersMiddleware)

    allowed_origins = get_allowed_origins()

    if allowed_origins and "*" in allowed_origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
            expose_headers=["*"],
        )
    else:
        app.add_middleware(CORSBlockingMiddleware, allowed_origins=allowed_origins)
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
            allow_headers=["*"],
            expose_headers=["*"],
        )

    allowed_hosts = get_allowed_hosts()

    if allowed_hosts and "*" not in allowed_hosts:
        app.add_middleware(HostValidationMiddleware, allowed_hosts=allowed_hosts)
```

--------------------------------------------------------------------------------

---[FILE: gateway_api.py]---
Location: mlflow-master/mlflow/server/gateway_api.py
Signals: FastAPI, SQLAlchemy

```python
"""
Database-backed Gateway API endpoints for MLflow Server.

This module provides dynamic gateway endpoints that are configured from the database
rather than from a static YAML configuration file. It integrates the AI Gateway
functionality directly into the MLflow tracking server.
"""

import logging
from typing import Any

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse

from mlflow.exceptions import MlflowException
from mlflow.gateway.config import (
    AmazonBedrockConfig,
    AnthropicConfig,
    AWSBaseConfig,
    AWSIdAndKey,
    AWSRole,
    EndpointConfig,
    EndpointType,
    GeminiConfig,
    LiteLLMConfig,
    MistralConfig,
    OpenAIConfig,
    Provider,
)
from mlflow.gateway.providers import get_provider
from mlflow.gateway.providers.base import PASSTHROUGH_ROUTES, BaseProvider, PassthroughAction
from mlflow.gateway.schemas import chat, embeddings
from mlflow.gateway.utils import make_streaming_response, translate_http_exception
from mlflow.protos.databricks_pb2 import RESOURCE_DOES_NOT_EXIST
from mlflow.store.tracking.abstract_store import AbstractStore
from mlflow.store.tracking.gateway.config_resolver import get_endpoint_config
from mlflow.store.tracking.sqlalchemy_store import SqlAlchemyStore
from mlflow.tracking._tracking_service.utils import _get_store

_logger = logging.getLogger(__name__)

gateway_router = APIRouter(prefix="/gateway", tags=["gateway"])


def _create_provider_from_endpoint_name(
    store: SqlAlchemyStore, endpoint_name: str, endpoint_type: EndpointType
) -> BaseProvider:
    """
    Create a provider instance from database endpoint configuration.

    Args:
        store: The SQLAlchemy store instance.
        endpoint_name: The endpoint name to retrieve configuration for.
        endpoint_type: Endpoint type (chat or embeddings).

    Returns:
        Provider instance

    Raises:
        MlflowException: If endpoint not found or configuration is invalid.
    """
    # Get endpoint config with decrypted secrets
    endpoint_config = get_endpoint_config(endpoint_name=endpoint_name, store=store)

    if not endpoint_config.models:
        raise MlflowException(
            f"Endpoint '{endpoint_name}' has no models configured",
            error_code=RESOURCE_DOES_NOT_EXIST,
        )

    # For now, use the first model (TODO: Support traffic routing)
    model_config = endpoint_config.models[0]

    if model_config.provider == Provider.OPENAI:
        auth_config = model_config.auth_config or {}
        openai_config = {
            "openai_api_key": model_config.secret_value.get("api_key"),
        }

        # Check if this is Azure OpenAI (requires api_type, deployment_name, api_base, api_version)
        if "api_type" in auth_config and auth_config["api_type"] in ("azure", "azuread"):
            openai_config["openai_api_type"] = auth_config["api_type"]
            openai_config["openai_api_base"] = auth_config.get("api_base")
            openai_config["openai_deployment_name"] = auth_config.get("deployment_name")
            openai_config["openai_api_version"] = auth_config.get("api_version")
        else:
            # Standard OpenAI
            if "api_base" in auth_config:
                openai_config["openai_api_base"] = auth_config["api_base"]
            if "organization" in auth_config:
                openai_config["openai_organization"] = auth_config["organization"]

        provider_config = OpenAIConfig(**openai_config)
    elif model_config.provider == Provider.ANTHROPIC:
        anthropic_config = {
            "anthropic_api_key": model_config.secret_value.get("api_key"),
        }
        if model_config.auth_config and "version" in model_config.auth_config:
            anthropic_config["anthropic_version"] = model_config.auth_config["version"]
        provider_config = AnthropicConfig(**anthropic_config)
    elif model_config.provider in (Provider.BEDROCK, Provider.AMAZON_BEDROCK):
        # Bedrock supports multiple auth modes
        auth_config = model_config.auth_config or {}
        secret_value = model_config.secret_value or {}

        # Check for role-based auth (aws_role_arn in auth_config)
        if "aws_role_arn" in auth_config:
            aws_config = AWSRole(
                aws_role_arn=auth_config["aws_role_arn"],
                session_length_seconds=auth_config.get("session_length_seconds", 15 * 60),
                aws_region=auth_config.get("aws_region"),
            )
        # Check for access key auth (credentials in secret_value)
        elif "aws_access_key_id" in secret_value:
            aws_config = AWSIdAndKey(
                aws_access_key_id=secret_value["aws_access_key_id"],
                aws_secret_access_key=secret_value["aws_secret_access_key"],
                aws_session_token=secret_value.get("aws_session_token"),
                aws_region=auth_config.get("aws_region"),
            )
        else:
            aws_config = AWSBaseConfig(
                aws_region=auth_config.get("aws_region"),
            )

        provider_config = AmazonBedrockConfig(aws_config=aws_config)
    elif model_config.provider == Provider.MISTRAL:
        provider_config = MistralConfig(
            mistral_api_key=model_config.secret_value.get("api_key"),
        )
    elif model_config.provider == Provider.GEMINI:
        provider_config = GeminiConfig(
            gemini_api_key=model_config.secret_value.get("api_key"),
        )
    else:
        # Use LiteLLM as fallback for unsupported providers
        # Store the original provider name for LiteLLM's provider/model format
        original_provider = model_config.provider
        litellm_config = {
            "litellm_provider": original_provider,
            "litellm_api_key": model_config.secret_value.get("api_key"),
        }
        auth_config = model_config.auth_config or {}
        if "api_base" in auth_config:
            litellm_config["litellm_api_base"] = auth_config["api_base"]
        provider_config = LiteLLMConfig(**litellm_config)
        model_config.provider = Provider.LITELLM

    # Create an EndpointConfig for the provider
    gateway_endpoint_config = EndpointConfig(
        name=endpoint_config.endpoint_name,
        endpoint_type=endpoint_type,
        model={
            "name": model_config.model_name,
            "provider": model_config.provider,
            "config": provider_config.model_dump(),
        },
    )

    provider_class = get_provider(model_config.provider)

    return provider_class(gateway_endpoint_config)


def _validate_store(store: AbstractStore):
    if not isinstance(store, SqlAlchemyStore):
        raise HTTPException(
            status_code=500,
            detail="Gateway endpoints are only available with SqlAlchemyStore, "
            f"got {type(store).__name__}.",
        )


def _extract_endpoint_name_from_model(body: dict[str, Any]) -> str:
    """
    Extract and validate the endpoint name from the 'model' parameter in the request body.

    Args:
        body: The request body dictionary

    Returns:
        The endpoint name extracted from the 'model' parameter

    Raises:
        HTTPException: If the 'model' parameter is missing
    """
    endpoint_name = body.get("model")
    if not endpoint_name:
        raise HTTPException(
            status_code=400,
            detail="Missing required 'model' parameter in request body",
        )
    return endpoint_name


@gateway_router.post("/{endpoint_name}/mlflow/invocations")
@translate_http_exception
async def invocations(endpoint_name: str, request: Request):
    """
    Create a unified invocations endpoint handler that supports both chat and embeddings.

    The handler automatically detects the request type based on the payload structure:
    - If payload has "messages" field -> chat endpoint
    - If payload has "input" field -> embeddings endpoint
    """
    try:
        body = await request.json()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON payload: {e!s}")

    store = _get_store()

    _validate_store(store)

    # Detect request type based on payload structure
    if "messages" in body:
        # Chat request
        endpoint_type = EndpointType.LLM_V1_CHAT
        try:
            payload = chat.RequestPayload(**body)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid chat payload: {e!s}")

        provider = _create_provider_from_endpoint_name(store, endpoint_name, endpoint_type)

        if payload.stream:
            return await make_streaming_response(provider.chat_stream(payload))
        else:
            return await provider.chat(payload)

    elif "input" in body:
        # Embeddings request
        endpoint_type = EndpointType.LLM_V1_EMBEDDINGS
        try:
            payload = embeddings.RequestPayload(**body)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid embeddings payload: {e!s}")

        provider = _create_provider_from_endpoint_name(store, endpoint_name, endpoint_type)

        return await provider.embeddings(payload)

    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid request: payload format must be either chat or embeddings",
        )


@gateway_router.post("/mlflow/v1/chat/completions")
@translate_http_exception
async def chat_completions(request: Request):
    """
    OpenAI-compatible chat completions endpoint.

    This endpoint follows the OpenAI API format where the endpoint name is specified
    via the "model" parameter in the request body, allowing clients to use the
    standard OpenAI SDK.

    Example:
        POST /gateway/mlflow/v1/chat/completions
        {
            "model": "my-endpoint-name",
            "messages": [{"role": "user", "content": "Hello"}]
        }
    """
    try:
        body = await request.json()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON payload: {e!s}")

    # Extract endpoint name from "model" parameter
    endpoint_name = _extract_endpoint_name_from_model(body)
    body.pop("model")

    store = _get_store()

    _validate_store(store)

    endpoint_type = EndpointType.LLM_V1_CHAT
    try:
        payload = chat.RequestPayload(**body)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid chat payload: {e!s}")

    provider = _create_provider_from_endpoint_name(store, endpoint_name, endpoint_type)

    if payload.stream:
        return await make_streaming_response(provider.chat_stream(payload))
    else:
        return await provider.chat(payload)


@gateway_router.post(PASSTHROUGH_ROUTES[PassthroughAction.OPENAI_CHAT])
@translate_http_exception
async def openai_passthrough_chat(request: Request):
    """
    OpenAI passthrough endpoint for chat completions.

    This endpoint accepts raw OpenAI API format and passes it through to the
    OpenAI provider with the configured API key and model. The 'model' parameter
    in the request specifies which MLflow endpoint to use.

    Supports streaming responses when the 'stream' parameter is set to true.

    Example:
        POST /gateway/openai/v1/chat/completions
        {
            "model": "my-openai-endpoint",
            "messages": [{"role": "user", "content": "Hello"}],
            "temperature": 0.7,
            "stream": true
        }
    """
    try:
        body = await request.json()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON payload: {e!s}")

    endpoint_name = _extract_endpoint_name_from_model(body)
    body.pop("model")
    store = _get_store()
    _validate_store(store)

    provider = _create_provider_from_endpoint_name(store, endpoint_name, EndpointType.LLM_V1_CHAT)
    response = await provider.passthrough(PassthroughAction.OPENAI_CHAT, body)

    if body.get("stream"):
        return StreamingResponse(response, media_type="text/event-stream")
    return response


@gateway_router.post(PASSTHROUGH_ROUTES[PassthroughAction.OPENAI_EMBEDDINGS])
@translate_http_exception
async def openai_passthrough_embeddings(request: Request):
    """
    OpenAI passthrough endpoint for embeddings.

    This endpoint accepts raw OpenAI API format and passes it through to the
    OpenAI provider with the configured API key and model. The 'model' parameter
    in the request specifies which MLflow endpoint to use.

    Example:
        POST /gateway/openai/v1/embeddings
        {
            "model": "my-openai-endpoint",
            "input": "The food was delicious and the waiter..."
        }
    """
    try:
        body = await request.json()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON payload: {e!s}")

    endpoint_name = _extract_endpoint_name_from_model(body)
    body.pop("model")
    store = _get_store()
    _validate_store(store)

    provider = _create_provider_from_endpoint_name(
        store, endpoint_name, EndpointType.LLM_V1_EMBEDDINGS
    )
    return await provider.passthrough(PassthroughAction.OPENAI_EMBEDDINGS, body)


@gateway_router.post(PASSTHROUGH_ROUTES[PassthroughAction.OPENAI_RESPONSES])
@translate_http_exception
async def openai_passthrough_responses(request: Request):
    """
    OpenAI passthrough endpoint for the Responses API.

    This endpoint accepts raw OpenAI Responses API format and passes it through to the
    OpenAI provider with the configured API key and model. The 'model' parameter
    in the request specifies which MLflow endpoint to use.

    Supports streaming responses when the 'stream' parameter is set to true.

    Example:
        POST /gateway/openai/v1/responses
        {
            "model": "my-openai-endpoint",
            "input": [{"type": "text", "text": "Hello"}],
            "instructions": "You are a helpful assistant",
            "stream": true
        }
    """
    try:
        body = await request.json()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON payload: {e!s}")

    endpoint_name = _extract_endpoint_name_from_model(body)
    body.pop("model")
    store = _get_store()
    _validate_store(store)

    provider = _create_provider_from_endpoint_name(store, endpoint_name, EndpointType.LLM_V1_CHAT)
    response = await provider.passthrough(PassthroughAction.OPENAI_RESPONSES, body)

    if body.get("stream"):
        return StreamingResponse(response, media_type="text/event-stream")
    return response


@gateway_router.post(PASSTHROUGH_ROUTES[PassthroughAction.ANTHROPIC_MESSAGES])
@translate_http_exception
async def anthropic_passthrough_messages(request: Request):
    """
    Anthropic passthrough endpoint for the Messages API.

    This endpoint accepts raw Anthropic API format and passes it through to the
    Anthropic provider with the configured API key and model. The 'model' parameter
    in the request specifies which MLflow endpoint to use.

    Supports streaming responses when the 'stream' parameter is set to true.

    Example:
        POST /gateway/anthropic/v1/messages
        {
            "model": "my-anthropic-endpoint",
            "messages": [{"role": "user", "content": "Hello"}],
            "max_tokens": 1024,
            "stream": true
        }
    """
    try:
        body = await request.json()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON payload: {e!s}")

    endpoint_name = _extract_endpoint_name_from_model(body)
    body.pop("model")
    store = _get_store()
    _validate_store(store)

    provider = _create_provider_from_endpoint_name(store, endpoint_name, EndpointType.LLM_V1_CHAT)
    response = await provider.passthrough(PassthroughAction.ANTHROPIC_MESSAGES, body)

    if body.get("stream"):
        return StreamingResponse(response, media_type="text/event-stream")
    return response


@gateway_router.post(PASSTHROUGH_ROUTES[PassthroughAction.GEMINI_GENERATE_CONTENT])
@translate_http_exception
async def gemini_passthrough_generate_content(endpoint_name: str, request: Request):
    """
    Gemini passthrough endpoint for generateContent API (non-streaming).

    This endpoint accepts raw Gemini API format and passes it through to the
    Gemini provider with the configured API key. The endpoint_name in the URL path
    specifies which MLflow endpoint to use.

    Example:
        POST /gateway/gemini/v1beta/models/my-gemini-endpoint:generateContent
        {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": "Hello"}]
                }
            ]
        }
    """
    try:
        body = await request.json()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON payload: {e!s}")

    store = _get_store()
    _validate_store(store)

    provider = _create_provider_from_endpoint_name(store, endpoint_name, EndpointType.LLM_V1_CHAT)
    return await provider.passthrough(PassthroughAction.GEMINI_GENERATE_CONTENT, body)


@gateway_router.post(PASSTHROUGH_ROUTES[PassthroughAction.GEMINI_STREAM_GENERATE_CONTENT])
@translate_http_exception
async def gemini_passthrough_stream_generate_content(endpoint_name: str, request: Request):
    """
    Gemini passthrough endpoint for streamGenerateContent API (streaming).

    This endpoint accepts raw Gemini API format and passes it through to the
    Gemini provider with the configured API key. The endpoint_name in the URL path
    specifies which MLflow endpoint to use.

    Example:
        POST /gateway/gemini/v1beta/models/my-gemini-endpoint:streamGenerateContent
        {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": "Hello"}]
                }
            ]
        }
    """
    try:
        body = await request.json()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON payload: {e!s}")

    store = _get_store()
    _validate_store(store)

    provider = _create_provider_from_endpoint_name(store, endpoint_name, EndpointType.LLM_V1_CHAT)
    response = await provider.passthrough(PassthroughAction.GEMINI_STREAM_GENERATE_CONTENT, body)
    return StreamingResponse(response, media_type="text/event-stream")
```

--------------------------------------------------------------------------------

````
