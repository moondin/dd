---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 410
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 410 of 991)

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

---[FILE: job_api.py]---
Location: mlflow-master/mlflow/server/job_api.py
Signals: FastAPI, Pydantic

```python
"""
Internal job APIs for UI invocation
"""

import json
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from mlflow.entities._job import Job as JobEntity
from mlflow.entities._job_status import JobStatus
from mlflow.exceptions import MlflowException

job_api_router = APIRouter(prefix="/ajax-api/3.0/jobs", tags=["Job"])


class Job(BaseModel):
    """
    Pydantic model for job query response.
    """

    job_id: str
    creation_time: int
    job_name: str
    params: dict[str, Any]
    timeout: float | None
    status: JobStatus
    result: Any
    retry_count: int
    last_update_time: int

    @classmethod
    def from_job_entity(cls, job: JobEntity) -> "Job":
        return cls(
            job_id=job.job_id,
            creation_time=job.creation_time,
            job_name=job.job_name,
            params=json.loads(job.params),
            timeout=job.timeout,
            status=job.status,
            result=job.parsed_result,
            retry_count=job.retry_count,
            last_update_time=job.last_update_time,
        )


@job_api_router.get("/{job_id}", response_model=Job)
def get_job(job_id: str) -> Job:
    from mlflow.server.jobs import get_job

    try:
        job = get_job(job_id)
        return Job.from_job_entity(job)
    except MlflowException as e:
        raise HTTPException(
            status_code=e.get_http_status_code(),
            detail=e.message,
        )


class SubmitJobPayload(BaseModel):
    job_name: str
    params: dict[str, Any]
    timeout: float | None = None


@job_api_router.post("/", response_model=Job)
def submit_job(payload: SubmitJobPayload) -> Job:
    from mlflow.server.jobs import submit_job
    from mlflow.server.jobs.utils import _load_function, get_job_fn_fullname

    job_name = payload.job_name
    try:
        function_fullname = get_job_fn_fullname(job_name)
        function = _load_function(function_fullname)
        job = submit_job(function, payload.params, payload.timeout)
        return Job.from_job_entity(job)
    except MlflowException as e:
        raise HTTPException(
            status_code=e.get_http_status_code(),
            detail=e.message,
        )


class SearchJobPayload(BaseModel):
    job_name: str | None = None
    params: dict[str, Any] | None = None
    statuses: list[JobStatus] | None = None


class SearchJobsResponse(BaseModel):
    """
    Pydantic model for job searching response.
    """

    jobs: list[Job]


@job_api_router.post("/search", response_model=SearchJobsResponse)
def search_jobs(payload: SearchJobPayload) -> SearchJobsResponse:
    from mlflow.server.handlers import _get_job_store

    try:
        store = _get_job_store()
        job_results = [
            Job.from_job_entity(job)
            for job in store.list_jobs(
                job_name=payload.job_name,
                statuses=payload.statuses,
                params=payload.params,
            )
        ]
        return SearchJobsResponse(jobs=job_results)
    except MlflowException as e:
        raise HTTPException(
            status_code=e.get_http_status_code(),
            detail=e.message,
        )
```

--------------------------------------------------------------------------------

---[FILE: otel_api.py]---
Location: mlflow-master/mlflow/server/otel_api.py
Signals: FastAPI

```python
"""
OpenTelemetry REST API endpoints for MLflow FastAPI server.

This module implements the OpenTelemetry Protocol (OTLP) REST API for ingesting spans
according to the OTel specification:
https://opentelemetry.io/docs/specs/otlp/#otlphttp

Note: This is a minimal implementation that serves as a placeholder for the OTel endpoint.
The actual span ingestion logic would need to properly convert incoming OTel format spans
to MLflow spans, which requires more complex conversion logic.
"""

from collections import defaultdict

from fastapi import APIRouter, Header, HTTPException, Request, Response, status
from google.protobuf.message import DecodeError
from opentelemetry.proto.collector.trace.v1.trace_service_pb2 import (
    ExportTraceServiceRequest,
    ExportTraceServiceResponse,
)

from mlflow.entities.span import Span
from mlflow.server.handlers import _get_tracking_store
from mlflow.telemetry.events import TraceSource, TracesReceivedByServerEvent
from mlflow.telemetry.track import _record_event
from mlflow.tracing.utils.otlp import (
    MLFLOW_EXPERIMENT_ID_HEADER,
    OTLP_TRACES_PATH,
    decompress_otlp_body,
)
from mlflow.tracking.request_header.default_request_header_provider import (
    _MLFLOW_PYTHON_CLIENT_USER_AGENT_PREFIX,
    _USER_AGENT,
)

# Create FastAPI router for OTel endpoints
otel_router = APIRouter(prefix=OTLP_TRACES_PATH, tags=["OpenTelemetry"])


@otel_router.post("", status_code=200)
async def export_traces(
    request: Request,
    x_mlflow_experiment_id: str = Header(..., alias=MLFLOW_EXPERIMENT_ID_HEADER),
    content_type: str | None = Header(default=None),
    content_encoding: str | None = Header(default=None),
    user_agent: str | None = Header(None, alias=_USER_AGENT),
) -> Response:
    """
    Export trace spans to MLflow via the OpenTelemetry protocol.

    This endpoint accepts OTLP/HTTP protobuf trace export requests.
    Protobuf format reference: https://opentelemetry.io/docs/specs/otlp/#binary-protobuf-encoding

    Args:
        request: OTel ExportTraceServiceRequest in protobuf format
        x_mlflow_experiment_id: Required header containing the experiment ID
        content_type: Content-Type header from the request
        content_encoding: Content-Encoding header from the request
        user_agent: User-Agent header (used to identify MLflow Python client)

    Returns:
        FastAPI Response with ExportTraceServiceResponse in protobuf format

    Raises:
        HTTPException: If the request is invalid or span logging fails
    """
    # Validate Content-Type header
    if content_type != "application/x-protobuf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid Content-Type: {content_type}. Expected: application/x-protobuf",
        )

    # Read & decompress request body
    body = await request.body()
    if content_encoding:
        body = decompress_otlp_body(body, content_encoding.lower())

    # Parse protobuf payload
    parsed_request = ExportTraceServiceRequest()

    try:
        # In Python protobuf library 5.x, ParseFromString may not raise DecodeError on invalid data
        parsed_request.ParseFromString(body)

        # Check if we actually parsed any data
        # If no resource_spans were parsed, the data was likely invalid
        if not parsed_request.resource_spans:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid OpenTelemetry protobuf format - no spans found",
            )

    except DecodeError:
        # This will catch errors in Python protobuf library 3.x
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OpenTelemetry protobuf format",
        )

    # Group spans by trace_id to support BatchSpanProcessor
    # log_spans requires all spans in a batch to have the same trace_id
    spans_by_trace_id = defaultdict(list)
    for resource_span in parsed_request.resource_spans:
        for scope_span in resource_span.scope_spans:
            for otel_proto_span in scope_span.spans:
                try:
                    mlflow_span = Span.from_otel_proto(otel_proto_span)
                    spans_by_trace_id[mlflow_span.trace_id].append(mlflow_span)
                except Exception:
                    raise HTTPException(
                        status_code=422,
                        detail="Cannot convert OpenTelemetry span to MLflow span",
                    )

    if spans_by_trace_id:
        store = _get_tracking_store()

        # Note: Benchmarking shows that ThreadPoolExecutor does not improve performance
        # for SQLite backends and can actually degrade performance due to write contention.
        # Sequential logging is simpler and faster for typical use cases.
        errors = {}
        completed_trace_ids = set()
        for trace_id, trace_spans in spans_by_trace_id.items():
            try:
                store.log_spans(x_mlflow_experiment_id, trace_spans)
                for span in trace_spans:
                    if span.parent_id is None:
                        # Only count traces with a root span as completed
                        # (logging of the root span indicates a completed trace)
                        completed_trace_ids.add(trace_id)
                        break
            except NotImplementedError:
                store_name = store.__class__.__name__
                raise HTTPException(
                    status_code=status.HTTP_501_NOT_IMPLEMENTED,
                    # NB: this error message must be the same as the one used in span exporter
                    # to avoid emitting warnings for unsupported stores
                    detail=f"REST OTLP span logging is not supported by {store_name}",
                )
            except Exception as e:
                errors[trace_id] = e

        if errors:
            error_msg = "\n".join(
                [f"Trace {trace_id}: {error}" for trace_id, error in errors.items()]
            )
            raise HTTPException(
                status_code=422,
                detail=f"Failed to log OpenTelemetry spans: {error_msg}",
            )

        if completed_trace_ids:
            trace_source = (
                TraceSource.MLFLOW_PYTHON_CLIENT
                if user_agent and user_agent.startswith(_MLFLOW_PYTHON_CLIENT_USER_AGENT_PREFIX)
                else TraceSource.UNKNOWN
            )

            _record_event(
                TracesReceivedByServerEvent,
                {
                    "source": trace_source,
                    "count": len(completed_trace_ids),
                },
            )

    # Return protobuf response as per OTLP specification
    response_message = ExportTraceServiceResponse()
    response_bytes = response_message.SerializeToString()
    return Response(
        content=response_bytes,
        media_type="application/x-protobuf",
        status_code=200,
    )
```

--------------------------------------------------------------------------------

---[FILE: prometheus_exporter.py]---
Location: mlflow-master/mlflow/server/prometheus_exporter.py
Signals: Flask

```python
from flask import request
from prometheus_flask_exporter.multiprocess import GunicornInternalPrometheusMetrics

from mlflow.version import VERSION


def activate_prometheus_exporter(app):
    def mlflow_version(_: request):
        return VERSION

    return GunicornInternalPrometheusMetrics(
        app,
        export_defaults=True,
        defaults_prefix="mlflow",
        excluded_paths=["/health", "/version"],
        group_by=mlflow_version,
    )
```

--------------------------------------------------------------------------------

---[FILE: security.py]---
Location: mlflow-master/mlflow/server/security.py
Signals: Flask

```python
import logging
from http import HTTPStatus

from flask import Flask, Response, request
from flask_cors import CORS

from mlflow.environment_variables import (
    MLFLOW_SERVER_DISABLE_SECURITY_MIDDLEWARE,
    MLFLOW_SERVER_X_FRAME_OPTIONS,
)
from mlflow.server.security_utils import (
    CORS_BLOCKED_MSG,
    HEALTH_ENDPOINTS,
    INVALID_HOST_MSG,
    LOCALHOST_ORIGIN_PATTERNS,
    get_allowed_hosts_from_env,
    get_allowed_origins_from_env,
    get_default_allowed_hosts,
    is_allowed_host_header,
    is_api_endpoint,
    should_block_cors_request,
)
from mlflow.tracing.constant import TRACE_RENDERER_ASSET_PATH

_logger = logging.getLogger(__name__)


def get_allowed_hosts() -> list[str]:
    """Get list of allowed hosts from environment or defaults."""
    return get_allowed_hosts_from_env() or get_default_allowed_hosts()


def get_allowed_origins() -> list[str]:
    """Get list of allowed CORS origins from environment or defaults."""
    return get_allowed_origins_from_env() or []


def init_security_middleware(app: Flask) -> None:
    """
    Initialize security middleware for Flask application.

    This configures:
    - Host header validation (DNS rebinding protection)
    - CORS protection via Flask-CORS
    - Security headers

    Args:
        app: Flask application instance.
    """
    if MLFLOW_SERVER_DISABLE_SECURITY_MIDDLEWARE.get() == "true":
        return

    allowed_origins = get_allowed_origins()
    allowed_hosts = get_allowed_hosts()
    x_frame_options = MLFLOW_SERVER_X_FRAME_OPTIONS.get()

    if allowed_origins and "*" in allowed_origins:
        CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
    else:
        cors_origins = (allowed_origins or []) + LOCALHOST_ORIGIN_PATTERNS
        CORS(
            app,
            resources={r"/*": {"origins": cors_origins}},
            supports_credentials=True,
            methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        )

    if allowed_hosts and "*" not in allowed_hosts:

        @app.before_request
        def validate_host():
            if request.path in HEALTH_ENDPOINTS:
                return None

            if not is_allowed_host_header(allowed_hosts, host := request.headers.get("Host")):
                _logger.warning(f"Rejected request with invalid Host header: {host}")
                return Response(
                    INVALID_HOST_MSG, status=HTTPStatus.FORBIDDEN, mimetype="text/plain"
                )
            return None

    if not (allowed_origins and "*" in allowed_origins):

        @app.before_request
        def block_cross_origin_state_changes():
            if not is_api_endpoint(request.path):
                return None

            origin = request.headers.get("Origin")
            if should_block_cors_request(origin, request.method, allowed_origins):
                _logger.warning(f"Blocked cross-origin request from {origin}")
                return Response(
                    CORS_BLOCKED_MSG, status=HTTPStatus.FORBIDDEN, mimetype="text/plain"
                )
            return None

    @app.after_request
    def add_security_headers(response: Response) -> Response:
        response.headers["X-Content-Type-Options"] = "nosniff"

        # Skip X-Frame-Options for notebook-trace-renderer to allow iframe embedding in Jupyter
        is_notebook_renderer = request.path.startswith(TRACE_RENDERER_ASSET_PATH)

        if x_frame_options and x_frame_options.upper() != "NONE" and not is_notebook_renderer:
            response.headers["X-Frame-Options"] = x_frame_options.upper()

        if (
            request.method == "OPTIONS"
            and response.status_code == 200
            and is_api_endpoint(request.path)
        ):
            response.status_code = HTTPStatus.NO_CONTENT
            response.data = b""

        return response
```

--------------------------------------------------------------------------------

---[FILE: security_utils.py]---
Location: mlflow-master/mlflow/server/security_utils.py
Signals: FastAPI, Flask

```python
"""
Shared security utilities for MLflow server middleware.

This module contains common functions used by both Flask and FastAPI
security implementations.
"""

import fnmatch
from urllib.parse import urlparse

from mlflow.environment_variables import (
    MLFLOW_SERVER_ALLOWED_HOSTS,
    MLFLOW_SERVER_CORS_ALLOWED_ORIGINS,
)

# Security response messages
INVALID_HOST_MSG = "Invalid Host header - possible DNS rebinding attack detected"
CORS_BLOCKED_MSG = "Cross-origin request blocked"

# HTTP methods that modify state
STATE_CHANGING_METHODS = ["POST", "PUT", "DELETE", "PATCH"]

# Paths exempt from host validation
HEALTH_ENDPOINTS = ["/health", "/version"]

# API path prefix for MLflow endpoints
API_PATH_PREFIX = "/api/"

# Test-only endpoints that should not have CORS blocking
TEST_ENDPOINTS = ["/test", "/api/test"]

# Localhost addresses
LOCALHOST_VARIANTS = ["localhost", "127.0.0.1", "[::1]", "0.0.0.0"]
CORS_LOCALHOST_HOSTS = ["localhost", "127.0.0.1", "[::1]", "::1"]

# Private IP range start values for 172.16.0.0/12
PRIVATE_172_RANGE_START = 16
PRIVATE_172_RANGE_END = 32

# Regex patterns for localhost origins
LOCALHOST_ORIGIN_PATTERNS = [
    r"^http://localhost(:[0-9]+)?$",
    r"^http://127\.0\.0\.1(:[0-9]+)?$",
    r"^http://\[::1\](:[0-9]+)?$",
]


def get_localhost_addresses() -> list[str]:
    """Get localhost/loopback addresses."""
    return LOCALHOST_VARIANTS


def get_private_ip_patterns() -> list[str]:
    """
    Generate wildcard patterns for private IP ranges.

    These are the standard RFC-defined private address ranges:
    - RFC 1918 (IPv4): 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
      https://datatracker.ietf.org/doc/html/rfc1918
    - RFC 4193 (IPv6): fc00::/7
      https://datatracker.ietf.org/doc/html/rfc4193

    Additional references:
    - IANA IPv4 Special-Purpose Address Registry:
      https://www.iana.org/assignments/iana-ipv4-special-registry/
    - IANA IPv6 Special-Purpose Address Registry:
      https://www.iana.org/assignments/iana-ipv6-special-registry/
    """
    return [
        "192.168.*",
        "10.*",
        *[f"172.{i}.*" for i in range(PRIVATE_172_RANGE_START, PRIVATE_172_RANGE_END)],
        "fc00:*",
        "fd00:*",
    ]


def get_allowed_hosts_from_env() -> list[str] | None:
    """Get allowed hosts from environment variable."""
    if allowed_hosts_env := MLFLOW_SERVER_ALLOWED_HOSTS.get():
        return [host.strip() for host in allowed_hosts_env.split(",")]
    return None


def get_allowed_origins_from_env() -> list[str] | None:
    """Get allowed CORS origins from environment variable."""
    if allowed_origins_env := MLFLOW_SERVER_CORS_ALLOWED_ORIGINS.get():
        return [origin.strip() for origin in allowed_origins_env.split(",")]
    return None


def is_localhost_origin(origin: str) -> bool:
    """Check if an origin is from localhost."""
    if not origin:
        return False

    try:
        parsed = urlparse(origin)
        hostname = parsed.hostname
        return hostname in CORS_LOCALHOST_HOSTS
    except Exception:
        return False


def should_block_cors_request(origin: str, method: str, allowed_origins: list[str] | None) -> bool:
    """Determine if a CORS request should be blocked."""
    if not origin or method not in STATE_CHANGING_METHODS:
        return False

    if is_localhost_origin(origin):
        return False

    if allowed_origins:
        # If wildcard "*" is in the list, allow all origins
        if "*" in allowed_origins:
            return False
        if origin in allowed_origins:
            return False

    return True


def is_api_endpoint(path: str) -> bool:
    """Check if a path is an API endpoint that should have CORS/OPTIONS handling."""
    return path.startswith(API_PATH_PREFIX) and path not in TEST_ENDPOINTS


def is_allowed_host_header(allowed_hosts: list[str], host: str) -> bool:
    """Validate if the host header matches allowed patterns."""
    if not host:
        return False

    # If wildcard "*" is in the list, allow all hosts
    if "*" in allowed_hosts:
        return True

    return any(
        fnmatch.fnmatch(host, allowed) if "*" in allowed else host == allowed
        for allowed in allowed_hosts
    )


def get_default_allowed_hosts() -> list[str]:
    """Get default allowed hosts patterns."""
    wildcard_hosts = []
    for host in get_localhost_addresses():
        if host.startswith("["):
            # IPv6: escape opening bracket for fnmatch
            escaped = host.replace("[", "[[]", 1)
            wildcard_hosts.append(f"{escaped}:*")
        else:
            wildcard_hosts.append(f"{host}:*")

    return get_localhost_addresses() + wildcard_hosts + get_private_ip_patterns()
```

--------------------------------------------------------------------------------

---[FILE: validation.py]---
Location: mlflow-master/mlflow/server/validation.py
Signals: Flask

```python
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE


def _validate_content_type(flask_request, allowed_content_types: list[str]):
    """
    Validates that the request content type is one of the allowed content types.

    Args:
        flask_request: Flask request object (flask.request)
        allowed_content_types: A list of allowed content types
    """
    if flask_request.method not in ["POST", "PUT"]:
        return

    if flask_request.content_type is None:
        raise MlflowException(
            message="Bad Request. Content-Type header is missing.",
            error_code=INVALID_PARAMETER_VALUE,
        )

    # Remove any parameters e.g. "application/json; charset=utf-8" -> "application/json"
    content_type = flask_request.content_type.split(";")[0]
    if content_type not in allowed_content_types:
        message = f"Bad Request. Content-Type must be one of {allowed_content_types}."

        raise MlflowException(
            message=message,
            error_code=INVALID_PARAMETER_VALUE,
        )
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/server/__init__.py
Signals: FastAPI, Flask

```python
import importlib
import importlib.metadata
import logging
import os
import shlex
import sys
import tempfile
import textwrap
import types
import warnings

_logger = logging.getLogger("mlflow.server")

from flask import Flask, Response, send_from_directory
from packaging.version import Version

from mlflow.environment_variables import (
    _MLFLOW_SGI_NAME,
    MLFLOW_FLASK_SERVER_SECRET_KEY,
    MLFLOW_SERVER_ENABLE_JOB_EXECUTION,
)
from mlflow.exceptions import MlflowException
from mlflow.server import handlers
from mlflow.server.constants import (
    ARTIFACT_ROOT_ENV_VAR,
    ARTIFACTS_DESTINATION_ENV_VAR,
    ARTIFACTS_ONLY_ENV_VAR,
    BACKEND_STORE_URI_ENV_VAR,
    HUEY_STORAGE_PATH_ENV_VAR,
    PROMETHEUS_EXPORTER_ENV_VAR,
    REGISTRY_STORE_URI_ENV_VAR,
    SECRETS_CACHE_MAX_SIZE_ENV_VAR,
    SECRETS_CACHE_TTL_ENV_VAR,
    SERVE_ARTIFACTS_ENV_VAR,
)
from mlflow.server.handlers import (
    STATIC_PREFIX_ENV_VAR,
    _add_static_prefix,
    _search_datasets_handler,
    create_promptlab_run_handler,
    gateway_proxy_handler,
    get_artifact_handler,
    get_logged_model_artifact_handler,
    get_metric_history_bulk_handler,
    get_metric_history_bulk_interval_handler,
    get_model_version_artifact_handler,
    get_trace_artifact_handler,
    get_ui_telemetry_handler,
    post_ui_telemetry_handler,
    upload_artifact_handler,
)
from mlflow.utils.os import is_windows
from mlflow.utils.plugins import get_entry_points
from mlflow.utils.process import _exec_cmd
from mlflow.version import VERSION

REL_STATIC_DIR = "js/build"

app = Flask(__name__, static_folder=REL_STATIC_DIR)
IS_FLASK_V1 = Version(importlib.metadata.version("flask")) < Version("2.0")

is_running_as_server = (
    "gunicorn" in sys.modules
    or "uvicorn" in sys.modules
    or "waitress" in sys.modules
    or os.getenv(BACKEND_STORE_URI_ENV_VAR)
    or os.getenv(SERVE_ARTIFACTS_ENV_VAR)
)

if is_running_as_server:
    from mlflow.server import security

    security.init_security_middleware(app)

for http_path, handler, methods in handlers.get_endpoints():
    app.add_url_rule(http_path, handler.__name__, handler, methods=methods)

if os.getenv(PROMETHEUS_EXPORTER_ENV_VAR):
    from mlflow.server.prometheus_exporter import activate_prometheus_exporter

    prometheus_metrics_path = os.getenv(PROMETHEUS_EXPORTER_ENV_VAR)
    if not os.path.exists(prometheus_metrics_path):
        os.makedirs(prometheus_metrics_path)
    activate_prometheus_exporter(app)


# Provide a health check endpoint to ensure the application is responsive
@app.route(_add_static_prefix("/health"))
def health():
    return "OK", 200


# Provide an endpoint to query the version of mlflow running on the server
@app.route(_add_static_prefix("/version"))
def version():
    return VERSION, 200


# Serve the "get-artifact" route.
@app.route(_add_static_prefix("/get-artifact"))
def serve_artifacts():
    return get_artifact_handler()


# Serve the "model-versions/get-artifact" route.
@app.route(_add_static_prefix("/model-versions/get-artifact"))
def serve_model_version_artifact():
    return get_model_version_artifact_handler()


# Serve the "metrics/get-history-bulk" route.
@app.route(_add_static_prefix("/ajax-api/2.0/mlflow/metrics/get-history-bulk"))
def serve_get_metric_history_bulk():
    return get_metric_history_bulk_handler()


# Serve the "metrics/get-history-bulk-interval" route.
@app.route(_add_static_prefix("/ajax-api/2.0/mlflow/metrics/get-history-bulk-interval"))
def serve_get_metric_history_bulk_interval():
    return get_metric_history_bulk_interval_handler()


# Serve the "experiments/search-datasets" route.
@app.route(_add_static_prefix("/ajax-api/2.0/mlflow/experiments/search-datasets"), methods=["POST"])
def serve_search_datasets():
    return _search_datasets_handler()


# Serve the "runs/create-promptlab-run" route.
@app.route(_add_static_prefix("/ajax-api/2.0/mlflow/runs/create-promptlab-run"), methods=["POST"])
def serve_create_promptlab_run():
    return create_promptlab_run_handler()


@app.route(_add_static_prefix("/ajax-api/2.0/mlflow/gateway-proxy"), methods=["POST", "GET"])
def serve_gateway_proxy():
    return gateway_proxy_handler()


@app.route(_add_static_prefix("/ajax-api/2.0/mlflow/upload-artifact"), methods=["POST"])
def serve_upload_artifact():
    return upload_artifact_handler()


# Serve the "/get-trace-artifact" route to allow frontend to fetch trace artifacts
# and render them in the Trace UI. The request body should contain the request_id
# of the trace.
@app.route(_add_static_prefix("/ajax-api/2.0/mlflow/get-trace-artifact"), methods=["GET"])
def serve_get_trace_artifact():
    return get_trace_artifact_handler()


@app.route(
    _add_static_prefix("/ajax-api/2.0/mlflow/logged-models/<model_id>/artifacts/files"),
    methods=["GET"],
)
def serve_get_logged_model_artifact(model_id: str):
    return get_logged_model_artifact_handler(model_id)


@app.route(_add_static_prefix("/ajax-api/3.0/mlflow/ui-telemetry"), methods=["GET"])
def serve_get_ui_telemetry():
    return get_ui_telemetry_handler()


@app.route(_add_static_prefix("/ajax-api/3.0/mlflow/ui-telemetry"), methods=["POST"])
def serve_post_ui_telemetry():
    return post_ui_telemetry_handler()


# We expect the react app to be built assuming it is hosted at /static-files, so that requests for
# CSS/JS resources will be made to e.g. /static-files/main.css and we can handle them here.
# The files are hashed based on source code, so ok to send Cache-Control headers via max_age.
@app.route(_add_static_prefix("/static-files/<path:path>"))
def serve_static_file(path):
    if IS_FLASK_V1:
        return send_from_directory(app.static_folder, path, cache_timeout=2419200)
    else:
        return send_from_directory(app.static_folder, path, max_age=2419200)


# Serve the index.html for the React App for all other routes.
@app.route(_add_static_prefix("/"))
def serve():
    if os.path.exists(os.path.join(app.static_folder, "index.html")):
        return send_from_directory(app.static_folder, "index.html")

    text = textwrap.dedent(
        """
    Unable to display MLflow UI - landing page (index.html) not found.

    You are very likely running the MLflow server using a source installation of the Python MLflow
    package.

    If you are a developer making MLflow source code changes and intentionally running a source
    installation of MLflow, you can view the UI by running the Javascript dev server:
    https://github.com/mlflow/mlflow/blob/master/CONTRIBUTING.md#running-the-javascript-dev-server

    Otherwise, uninstall MLflow via 'pip uninstall mlflow', reinstall an official MLflow release
    from PyPI via 'pip install mlflow', and rerun the MLflow server.
    """
    )
    return Response(text, mimetype="text/plain")


def _find_app(app_name: str) -> str:
    apps = get_entry_points("mlflow.app")
    for app in apps:
        if app.name == app_name:
            return app.value

    raise MlflowException(
        f"Failed to find app '{app_name}'. Available apps: {[a.name for a in apps]}"
    )


def _is_factory(app: str) -> bool:
    """
    Returns True if the given app is a factory function, False otherwise.

    Args:
        app: The app to check, e.g. "mlflow.server.app:app
    """
    module, obj_name = app.rsplit(":", 1)
    mod = importlib.import_module(module)
    obj = getattr(mod, obj_name)
    return isinstance(obj, types.FunctionType)


def get_app_client(app_name: str, *args, **kwargs):
    """
    Instantiate a client provided by an app.

    Args:
        app_name: The app name defined in `setup.py`, e.g., "basic-auth".
        args: Additional arguments passed to the app client constructor.
        kwargs: Additional keyword arguments passed to the app client constructor.

    Returns:
        An app client instance.
    """
    clients = get_entry_points("mlflow.app.client")
    for client in clients:
        if client.name == app_name:
            cls = client.load()
            return cls(*args, **kwargs)

    raise MlflowException(
        f"Failed to find client for '{app_name}'. Available clients: {[c.name for c in clients]}"
    )


def _build_waitress_command(waitress_opts, host, port, app_name, is_factory):
    opts = shlex.split(waitress_opts) if waitress_opts else []
    return [
        sys.executable,
        "-m",
        "waitress",
        *opts,
        f"--host={host}",
        f"--port={port}",
        "--ident=mlflow",
        *(["--call"] if is_factory else []),
        app_name,
    ]


def _build_gunicorn_command(gunicorn_opts, host, port, workers, app_name):
    bind_address = f"{host}:{port}"
    opts = shlex.split(gunicorn_opts) if gunicorn_opts else []
    return [
        sys.executable,
        "-m",
        "gunicorn",
        *opts,
        "-b",
        bind_address,
        "-w",
        str(workers),
        app_name,
    ]


def _build_uvicorn_command(uvicorn_opts, host, port, workers, app_name, env_file=None):
    """Build command to run uvicorn server."""
    opts = shlex.split(uvicorn_opts) if uvicorn_opts else []
    cmd = [
        sys.executable,
        "-m",
        "uvicorn",
        *opts,
        "--host",
        host,
        "--port",
        str(port),
        "--workers",
        str(workers),
    ]
    if env_file:
        cmd.extend(["--env-file", env_file])
    cmd.append(app_name)
    return cmd


def _run_server(
    *,
    file_store_path,
    registry_store_uri,
    default_artifact_root,
    serve_artifacts,
    artifacts_only,
    artifacts_destination,
    host,
    port,
    static_prefix=None,
    workers=None,
    gunicorn_opts=None,
    waitress_opts=None,
    expose_prometheus=None,
    app_name=None,
    uvicorn_opts=None,
    env_file=None,
    secrets_cache_ttl=None,
    secrets_cache_max_size=None,
):
    """
    Run the MLflow server, wrapping it in gunicorn, uvicorn, or waitress on windows

    Args:
        static_prefix: If set, the index.html asset will be served from the path static_prefix.
                       If left None, the index.html asset will be served from the root path.
        uvicorn_opts: Additional options for uvicorn server.

    Returns:
        None
    """
    env_map = {}
    if file_store_path:
        env_map[BACKEND_STORE_URI_ENV_VAR] = file_store_path
    if registry_store_uri:
        env_map[REGISTRY_STORE_URI_ENV_VAR] = registry_store_uri
    if default_artifact_root:
        env_map[ARTIFACT_ROOT_ENV_VAR] = default_artifact_root
    if serve_artifacts:
        env_map[SERVE_ARTIFACTS_ENV_VAR] = "true"
    if artifacts_only:
        env_map[ARTIFACTS_ONLY_ENV_VAR] = "true"
    if artifacts_destination:
        env_map[ARTIFACTS_DESTINATION_ENV_VAR] = artifacts_destination
    if static_prefix:
        env_map[STATIC_PREFIX_ENV_VAR] = static_prefix

    if expose_prometheus:
        env_map[PROMETHEUS_EXPORTER_ENV_VAR] = expose_prometheus

    if secrets_cache_ttl is not None:
        env_map[SECRETS_CACHE_TTL_ENV_VAR] = str(secrets_cache_ttl)
    if secrets_cache_max_size is not None:
        env_map[SECRETS_CACHE_MAX_SIZE_ENV_VAR] = str(secrets_cache_max_size)

    if secret_key := MLFLOW_FLASK_SERVER_SECRET_KEY.get():
        env_map[MLFLOW_FLASK_SERVER_SECRET_KEY.name] = secret_key

    # Determine which server we're using (only one should be true)
    using_gunicorn = gunicorn_opts is not None
    using_waitress = waitress_opts is not None
    using_uvicorn = not using_gunicorn and not using_waitress

    if using_uvicorn:
        env_map[_MLFLOW_SGI_NAME.name] = "uvicorn"
    elif using_waitress:
        env_map[_MLFLOW_SGI_NAME.name] = "waitress"
    elif using_gunicorn:
        env_map[_MLFLOW_SGI_NAME.name] = "gunicorn"

    if app_name is None:
        is_factory = False
        # For uvicorn, use the FastAPI app; for gunicorn/waitress, use the Flask app
        app = "mlflow.server.fastapi_app:app" if using_uvicorn else f"{__name__}:app"
    else:
        app = _find_app(app_name)
        is_factory = _is_factory(app)
        # `waitress` doesn't support `()` syntax for factory functions.
        # Instead, we need to use the `--call` flag.
        # Don't use () syntax if we're using uvicorn
        use_factory_syntax = not is_windows() and is_factory and not using_uvicorn
        app = f"{app}()" if use_factory_syntax else app

    # Determine which server to use
    if using_uvicorn:
        # Use uvicorn (default when no specific server options are provided)
        full_command = _build_uvicorn_command(uvicorn_opts, host, port, workers or 4, app, env_file)
    elif using_waitress:
        # Use waitress if explicitly requested
        warnings.warn(
            "We recommend using uvicorn for improved performance. "
            "Please use uvicorn by default or specify '--uvicorn-opts' "
            "instead of '--waitress-opts'.",
            FutureWarning,
            stacklevel=2,
        )
        full_command = _build_waitress_command(waitress_opts, host, port, app, is_factory)
    elif using_gunicorn:
        # Use gunicorn if explicitly requested
        if sys.platform == "win32":
            raise MlflowException(
                "Gunicorn is not supported on Windows. "
                "Please use uvicorn (default) or specify '--waitress-opts'."
            )
        warnings.warn(
            "We recommend using uvicorn for improved performance. "
            "Please use uvicorn by default or specify '--uvicorn-opts' "
            "instead of '--gunicorn-opts'.",
            FutureWarning,
            stacklevel=2,
        )
        full_command = _build_gunicorn_command(gunicorn_opts, host, port, workers or 4, app)
    else:
        # This shouldn't happen given the logic in CLI, but handle it just in case
        raise MlflowException("No server configuration specified.")

    if MLFLOW_SERVER_ENABLE_JOB_EXECUTION.get():
        # The `HUEY_STORAGE_PATH_ENV_VAR` is used by both MLflow server handler workers and
        # huey job runner (huey_consumer).
        env_map[HUEY_STORAGE_PATH_ENV_VAR] = (
            tempfile.mkdtemp(dir="/dev/shm")  # Use in-memory file system if possible
            if os.path.exists("/dev/shm")
            else tempfile.mkdtemp()
        )

    if MLFLOW_SERVER_ENABLE_JOB_EXECUTION.get():
        from mlflow.server.jobs.utils import _check_requirements

        try:
            _check_requirements(file_store_path)
        except Exception as e:
            raise MlflowException(
                f"MLflow job runner requirements checking failed (root error: {e!s}). "
                "If you don't need MLflow job runner, you can disable it by setting "
                "environment variable 'MLFLOW_SERVER_ENABLE_JOB_EXECUTION' to 'false'."
            )

    server_proc = _exec_cmd(
        full_command, extra_env=env_map, capture_output=False, synchronous=False
    )

    if MLFLOW_SERVER_ENABLE_JOB_EXECUTION.get():
        from mlflow.environment_variables import MLFLOW_TRACKING_URI
        from mlflow.server.jobs.utils import _launch_job_runner

        _launch_job_runner(
            {
                **env_map,
                # Set tracking URI environment variable for job runner
                # so that all job processes inherits it.
                MLFLOW_TRACKING_URI.name: f"http://{host}:{port}",
            },
            server_proc.pid,
        )

    server_proc.wait()
```

--------------------------------------------------------------------------------

---[FILE: basic_auth.ini]---
Location: mlflow-master/mlflow/server/auth/basic_auth.ini

```text
[mlflow]
default_permission = READ
database_uri = sqlite:///basic_auth.db
admin_username = admin
admin_password = password1234
authorization_function = mlflow.server.auth:authenticate_request_basic_auth
```

--------------------------------------------------------------------------------

---[FILE: cli.py]---
Location: mlflow-master/mlflow/server/auth/cli.py

```python
import click

from mlflow.server.auth.db import cli as db_cli


@click.group()
def commands():
    pass


commands.add_command(db_cli.commands)
```

--------------------------------------------------------------------------------

````
