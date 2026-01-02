---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 903
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 903 of 991)

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

---[FILE: test_init.py]---
Location: mlflow-master/tests/server/test_init.py

```python
import os
import shutil
import sys
from unittest import mock

import pytest

from mlflow import server
from mlflow.environment_variables import _MLFLOW_SGI_NAME
from mlflow.exceptions import MlflowException


@pytest.fixture
def mock_exec_cmd():
    with mock.patch("mlflow.server._exec_cmd") as m:
        yield m


def test_find_app_custom_app_plugin():
    assert server._find_app("custom_app") == "mlflow_test_plugin.app:custom_app"


def test_find_app_non_existing_app():
    with pytest.raises(MlflowException, match=r"Failed to find app 'does_not_exist'"):
        server._find_app("does_not_exist")


def test_build_waitress_command():
    assert server._build_waitress_command(
        "", "localhost", "5000", f"{server.__name__}:app", is_factory=True
    ) == [
        sys.executable,
        "-m",
        "waitress",
        "--host=localhost",
        "--port=5000",
        "--ident=mlflow",
        "--call",
        "mlflow.server:app",
    ]
    assert server._build_waitress_command(
        "", "localhost", "5000", f"{server.__name__}:app", is_factory=False
    ) == [
        sys.executable,
        "-m",
        "waitress",
        "--host=localhost",
        "--port=5000",
        "--ident=mlflow",
        "mlflow.server:app",
    ]


def test_build_gunicorn_command():
    assert server._build_gunicorn_command(
        "", "localhost", "5000", "4", f"{server.__name__}:app"
    ) == [
        sys.executable,
        "-m",
        "gunicorn",
        "-b",
        "localhost:5000",
        "-w",
        "4",
        "mlflow.server:app",
    ]


def test_build_uvicorn_command():
    assert server._build_uvicorn_command(
        "", "localhost", "5000", "4", "mlflow.server.fastapi_app:app"
    ) == [
        sys.executable,
        "-m",
        "uvicorn",
        "--host",
        "localhost",
        "--port",
        "5000",
        "--workers",
        "4",
        "mlflow.server.fastapi_app:app",
    ]

    # Test with custom uvicorn options
    assert server._build_uvicorn_command(
        "--reload --log-level debug", "localhost", "5000", "4", "mlflow.server.fastapi_app:app"
    ) == [
        sys.executable,
        "-m",
        "uvicorn",
        "--reload",
        "--log-level",
        "debug",
        "--host",
        "localhost",
        "--port",
        "5000",
        "--workers",
        "4",
        "mlflow.server.fastapi_app:app",
    ]


def test_build_uvicorn_command_with_env_file():
    cmd = server._build_uvicorn_command(
        uvicorn_opts=None,
        host="localhost",
        port=5000,
        workers=4,
        app_name="app:app",
        env_file="/path/to/.env",
    )

    assert "--env-file" in cmd
    assert "/path/to/.env" in cmd
    # Verify the order - env-file should come before the app name
    env_file_idx = cmd.index("--env-file")
    env_file_path_idx = cmd.index("/path/to/.env")
    app_name_idx = cmd.index("app:app")
    assert env_file_idx < app_name_idx
    assert env_file_path_idx == env_file_idx + 1
    assert env_file_path_idx < app_name_idx


def test_run_server(mock_exec_cmd, monkeypatch):
    monkeypatch.setenv("MLFLOW_SERVER_ENABLE_JOB_EXECUTION", "false")
    with mock.patch("sys.platform", return_value="linux"):
        server._run_server(
            file_store_path="",
            registry_store_uri="",
            default_artifact_root="",
            serve_artifacts="",
            artifacts_only="",
            artifacts_destination="",
            host="",
            port="",
        )
    mock_exec_cmd.assert_called_once()


def test_run_server_win32(mock_exec_cmd, monkeypatch):
    monkeypatch.setenv("MLFLOW_SERVER_ENABLE_JOB_EXECUTION", "false")
    with mock.patch("sys.platform", return_value="win32"):
        server._run_server(
            file_store_path="",
            registry_store_uri="",
            default_artifact_root="",
            serve_artifacts="",
            artifacts_only="",
            artifacts_destination="",
            host="",
            port="",
        )
    mock_exec_cmd.assert_called_once()


def test_run_server_with_uvicorn(mock_exec_cmd, monkeypatch):
    monkeypatch.setenv("MLFLOW_SERVER_ENABLE_JOB_EXECUTION", "false")
    with mock.patch("sys.platform", return_value="linux"):
        server._run_server(
            file_store_path="",
            registry_store_uri="",
            default_artifact_root="",
            serve_artifacts="",
            artifacts_only="",
            artifacts_destination="",
            host="localhost",
            port="5000",
            uvicorn_opts="--reload",
        )
    expected_command = [
        sys.executable,
        "-m",
        "uvicorn",
        "--reload",
        "--host",
        "localhost",
        "--port",
        "5000",
        "--workers",
        "4",
        "mlflow.server.fastapi_app:app",
    ]
    mock_exec_cmd.assert_called_once_with(
        expected_command,
        extra_env={_MLFLOW_SGI_NAME.name: "uvicorn"},
        capture_output=False,
        synchronous=False,
    )


@pytest.mark.skipif(os.name == "nt", reason="MLflow job execution is not supported on Windows")
def test_run_server_with_jobs_without_uv(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("MLFLOW_SERVER_ENABLE_JOB_EXECUTION", "true")
    original_which = shutil.which

    def patched_which(cmd):
        if cmd == "uv":
            return None
        return original_which(cmd)

    with (
        mock.patch("shutil.which", side_effect=patched_which) as which_patch,
        pytest.raises(MlflowException, match="MLflow job backend requires 'uv'"),
    ):
        server._run_server(
            file_store_path="",
            registry_store_uri="",
            default_artifact_root="",
            serve_artifacts="",
            artifacts_only="",
            artifacts_destination="",
            host="",
            port="",
        )
    which_patch.assert_called_once_with("uv")
```

--------------------------------------------------------------------------------

---[FILE: test_prometheus_exporter.py]---
Location: mlflow-master/tests/server/test_prometheus_exporter.py

```python
import pytest

from mlflow.server.prometheus_exporter import activate_prometheus_exporter


@pytest.fixture(autouse=True)
def mock_settings_env_vars(tmp_path, monkeypatch):
    monkeypatch.setenv("PROMETHEUS_MULTIPROC_DIR", str(tmp_path))


@pytest.fixture
def app():
    from mlflow.server import app

    with app.app_context():
        yield app


@pytest.fixture
def test_client(app):
    with app.test_client() as c:
        yield c


def test_metrics(app, test_client):
    metrics = activate_prometheus_exporter(app)

    # test metrics for successful responses
    success_labels = {"method": "GET", "status": "200"}
    assert (
        metrics.registry.get_sample_value("mlflow_http_request_total", labels=success_labels)
        is None
    )
    resp = test_client.get("/")
    assert resp.status_code == 200
    assert (
        metrics.registry.get_sample_value("mlflow_http_request_total", labels=success_labels) == 1
    )

    # calling the metrics endpoint should not increment the counter
    resp = test_client.get("/metrics")
    assert resp.status_code == 200
    assert (
        metrics.registry.get_sample_value("mlflow_http_request_total", labels=success_labels) == 1
    )

    # calling the health endpoint should not increment the counter
    resp = test_client.get("/health")
    assert resp.status_code == 200
    assert (
        metrics.registry.get_sample_value("mlflow_http_request_total", labels=success_labels) == 1
    )

    # calling the version endpoint should not increment the counter
    resp = test_client.get("/version")
    assert resp.status_code == 200
    assert (
        metrics.registry.get_sample_value("mlflow_http_request_total", labels=success_labels) == 1
    )

    # test metrics for failed responses
    failure_labels = {"method": "GET", "status": "404"}
    assert (
        metrics.registry.get_sample_value("mlflow_http_request_total", labels=failure_labels)
        is None
    )
    resp = test_client.get("/non-existent-endpoint")
    assert resp.status_code == 404
    assert (
        metrics.registry.get_sample_value("mlflow_http_request_total", labels=failure_labels) == 1
    )
```

--------------------------------------------------------------------------------

---[FILE: test_security.py]---
Location: mlflow-master/tests/server/test_security.py
Signals: Flask

```python
import pytest
from flask import Flask
from werkzeug.test import Client

from mlflow.server import security
from mlflow.server.security_utils import is_allowed_host_header


def test_default_allowed_hosts():
    hosts = security.get_allowed_hosts()
    assert "localhost" in hosts
    assert "127.0.0.1" in hosts
    assert "[::1]" in hosts
    assert "localhost:*" in hosts
    assert "127.0.0.1:*" in hosts
    assert "[[]::1]:*" in hosts
    assert "192.168.*" in hosts
    assert "10.*" in hosts


def test_custom_allowed_hosts(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("MLFLOW_SERVER_ALLOWED_HOSTS", "example.com,app.example.com")
    hosts = security.get_allowed_hosts()
    assert "example.com" in hosts
    assert "app.example.com" in hosts


@pytest.mark.parametrize(
    ("host_header", "expected_status", "expected_error"),
    [
        ("localhost", 200, None),
        ("127.0.0.1", 200, None),
        ("evil.attacker.com", 403, b"Invalid Host header"),
    ],
)
def test_dns_rebinding_protection(
    test_app, host_header, expected_status, expected_error, monkeypatch: pytest.MonkeyPatch
):
    monkeypatch.setenv("MLFLOW_SERVER_ALLOWED_HOSTS", "localhost,127.0.0.1")
    security.init_security_middleware(test_app)
    client = Client(test_app)

    response = client.get("/test", headers={"Host": host_header})
    assert response.status_code == expected_status
    if expected_error:
        assert expected_error in response.data


@pytest.mark.parametrize(
    ("method", "origin", "expected_cors_header"),
    [
        ("POST", "http://localhost:3000", "http://localhost:3000"),
        ("POST", "http://evil.com", None),
        ("POST", None, None),
        ("GET", "http://evil.com", None),
    ],
)
def test_cors_protection(
    test_app, method, origin, expected_cors_header, monkeypatch: pytest.MonkeyPatch
):
    monkeypatch.setenv(
        "MLFLOW_SERVER_CORS_ALLOWED_ORIGINS", "http://localhost:3000,https://app.example.com"
    )
    security.init_security_middleware(test_app)
    client = Client(test_app)

    headers = {"Origin": origin} if origin else {}
    response = getattr(client, method.lower())("/api/test", headers=headers)
    assert response.status_code == 200

    if expected_cors_header:
        assert response.headers.get("Access-Control-Allow-Origin") == expected_cors_header


def test_insecure_cors_mode(test_app, monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("MLFLOW_SERVER_CORS_ALLOWED_ORIGINS", "*")
    security.init_security_middleware(test_app)
    client = Client(test_app)

    response = client.post("/api/test", headers={"Origin": "http://evil.com"})
    assert response.status_code == 200
    assert response.headers.get("Access-Control-Allow-Origin") == "http://evil.com"


@pytest.mark.parametrize(
    ("origin", "expected_cors_header"),
    [
        ("http://localhost:3000", "http://localhost:3000"),
        ("http://evil.com", None),
    ],
)
def test_preflight_options_request(
    test_app, origin, expected_cors_header, monkeypatch: pytest.MonkeyPatch
):
    monkeypatch.setenv("MLFLOW_SERVER_CORS_ALLOWED_ORIGINS", "http://localhost:3000")
    security.init_security_middleware(test_app)
    client = Client(test_app)

    response = client.options(
        "/api/test",
        headers={
            "Origin": origin,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type",
        },
    )
    assert response.status_code == 200

    if expected_cors_header:
        assert response.headers.get("Access-Control-Allow-Origin") == expected_cors_header


def test_security_headers(test_app):
    security.init_security_middleware(test_app)
    client = Client(test_app)

    response = client.get("/test")
    assert response.headers.get("X-Content-Type-Options") == "nosniff"
    assert response.headers.get("X-Frame-Options") == "SAMEORIGIN"


def test_disable_security_middleware(test_app, monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("MLFLOW_SERVER_DISABLE_SECURITY_MIDDLEWARE", "true")
    security.init_security_middleware(test_app)
    client = Client(test_app)

    response = client.get("/test")
    assert "X-Content-Type-Options" not in response.headers
    assert "X-Frame-Options" not in response.headers

    response = client.get("/test", headers={"Host": "evil.com"})
    assert response.status_code == 200


def test_x_frame_options_configuration(monkeypatch: pytest.MonkeyPatch):
    app = Flask(__name__)

    @app.route("/test")
    def test():
        return "OK"

    monkeypatch.setenv("MLFLOW_SERVER_X_FRAME_OPTIONS", "DENY")
    security.init_security_middleware(app)
    client = Client(app)
    response = client.get("/test")
    assert response.headers.get("X-Frame-Options") == "DENY"

    app2 = Flask(__name__)

    @app2.route("/test")
    def test2():
        return "OK"

    # Reset for the second app
    monkeypatch.setenv("MLFLOW_SERVER_X_FRAME_OPTIONS", "NONE")
    security.init_security_middleware(app2)
    client = Client(app2)
    response = client.get("/test")
    assert "X-Frame-Options" not in response.headers


def test_notebook_trace_renderer_skips_x_frame_options(monkeypatch: pytest.MonkeyPatch):
    from mlflow.tracing.constant import TRACE_RENDERER_ASSET_PATH

    app = Flask(__name__)

    @app.route(f"{TRACE_RENDERER_ASSET_PATH}/index.html")
    def notebook_renderer():
        return "<html>trace renderer</html>"

    @app.route(f"{TRACE_RENDERER_ASSET_PATH}/js/main.js")
    def notebook_renderer_js():
        return "console.log('trace renderer');"

    @app.route("/static-files/other-page.html")
    def other_page():
        return "<html>other page</html>"

    # Set X-Frame-Options to DENY to test that it's skipped for notebook renderer
    monkeypatch.setenv("MLFLOW_SERVER_X_FRAME_OPTIONS", "DENY")
    security.init_security_middleware(app)
    client = Client(app)

    response = client.get(f"{TRACE_RENDERER_ASSET_PATH}/index.html")
    assert response.status_code == 200
    assert "X-Frame-Options" not in response.headers

    response = client.get(f"{TRACE_RENDERER_ASSET_PATH}/js/main.js")
    assert response.status_code == 200
    assert "X-Frame-Options" not in response.headers

    response = client.get("/static-files/other-page.html")
    assert response.status_code == 200
    assert response.headers.get("X-Frame-Options") == "DENY"


def test_wildcard_hosts(test_app, monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("MLFLOW_SERVER_ALLOWED_HOSTS", "*")
    security.init_security_middleware(test_app)
    client = Client(test_app)

    response = client.get("/test", headers={"Host": "any.domain.com"})
    assert response.status_code == 200


@pytest.mark.parametrize(
    ("endpoint", "host_header", "expected_status"),
    [
        ("/health", "evil.com", 200),
        ("/test", "evil.com", 403),
    ],
)
def test_endpoint_security_bypass(
    test_app, endpoint, host_header, expected_status, monkeypatch: pytest.MonkeyPatch
):
    monkeypatch.setenv("MLFLOW_SERVER_ALLOWED_HOSTS", "localhost")
    security.init_security_middleware(test_app)
    client = Client(test_app)

    response = client.get(endpoint, headers={"Host": host_header})
    assert response.status_code == expected_status


@pytest.mark.parametrize(
    ("hostname", "expected_valid"),
    [
        ("192.168.1.1", True),
        ("10.0.0.1", True),
        ("172.16.0.1", True),
        ("127.0.0.1", True),
        ("localhost", True),
        ("[::1]", True),
        ("192.168.1.1:8080", True),
        ("[::1]:8080", True),
        ("evil.com", False),
    ],
)
def test_host_validation(hostname, expected_valid):
    hosts = security.get_allowed_hosts()
    assert is_allowed_host_header(hosts, hostname) == expected_valid


@pytest.mark.parametrize(
    ("env_var", "env_value", "expected_result"),
    [
        (
            "MLFLOW_SERVER_CORS_ALLOWED_ORIGINS",
            "http://app1.com,http://app2.com",
            ["http://app1.com", "http://app2.com"],
        ),
        ("MLFLOW_SERVER_ALLOWED_HOSTS", "app1.com,app2.com:8080", ["app1.com", "app2.com:8080"]),
    ],
)
def test_environment_variable_configuration(
    env_var, env_value, expected_result, monkeypatch: pytest.MonkeyPatch
):
    monkeypatch.setenv(env_var, env_value)
    if "ORIGINS" in env_var:
        result = security.get_allowed_origins()
        for expected in expected_result:
            assert expected in result
    else:
        result = security.get_allowed_hosts()
        for expected in expected_result:
            assert expected in result
```

--------------------------------------------------------------------------------

---[FILE: test_security_integration.py]---
Location: mlflow-master/tests/server/test_security_integration.py
Signals: Flask

```python
import json

import pytest
from werkzeug.test import Client


@pytest.mark.parametrize(
    ("host", "origin", "expected_status", "should_block"),
    [
        ("evil.attacker.com:5000", "http://evil.attacker.com:5000", 403, True),
        ("localhost:5000", None, None, False),
    ],
)
def test_dns_rebinding_and_cors_protection(
    mlflow_app_client, host, origin, expected_status, should_block
):
    headers = {"Host": host, "Content-Type": "application/json"}
    if origin:
        headers["Origin"] = origin

    response = mlflow_app_client.post(
        "/api/2.0/mlflow/experiments/search",
        headers=headers,
        data=json.dumps({"order_by": ["creation_time DESC", "name ASC"], "max_results": 50}),
    )

    if should_block:
        assert response.status_code == expected_status
        assert (
            b"Invalid Host header" in response.data
            or b"Cross-origin request blocked" in response.data
        )
    else:
        assert response.status_code != 403


@pytest.mark.parametrize(
    ("origin", "endpoint", "expected_blocked"),
    [
        ("http://malicious-site.com", "/api/2.0/mlflow/experiments/create", True),
        ("http://localhost:3000", "/api/2.0/mlflow/experiments/search", False),
    ],
)
def test_cors_for_state_changing_requests(mlflow_app_client, origin, endpoint, expected_blocked):
    response = mlflow_app_client.post(
        endpoint,
        headers={"Origin": origin, "Content-Type": "application/json"},
        data=json.dumps({"name": "test-experiment"} if "create" in endpoint else {}),
    )

    if expected_blocked:
        assert response.status_code == 403
        assert b"Cross-origin request blocked" in response.data
    else:
        assert response.status_code != 403


def test_cors_with_configured_origins(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("MLFLOW_SERVER_CORS_ALLOWED_ORIGINS", "https://trusted-app.com")

    from flask import Flask

    from mlflow.server import handlers, security

    app = Flask(__name__)
    for http_path, handler, methods in handlers.get_endpoints():
        app.add_url_rule(http_path, handler.__name__, handler, methods=methods)

    security.init_security_middleware(app)
    client = Client(app)

    test_cases = [
        ("https://trusted-app.com", False),
        ("http://evil.com", True),
    ]

    for origin, should_block in test_cases:
        response = client.post(
            "/api/2.0/mlflow/experiments/search",
            headers={"Origin": origin, "Content-Type": "application/json"},
            data=json.dumps({}),
        )

        if should_block:
            assert response.status_code == 403
        else:
            assert response.status_code != 403


def test_security_headers_on_responses(mlflow_app_client):
    response = mlflow_app_client.get("/health")
    assert response.headers.get("X-Content-Type-Options") == "nosniff"
    assert response.headers.get("X-Frame-Options") == "SAMEORIGIN"


@pytest.mark.parametrize(
    ("origin", "expected_status", "should_have_cors"),
    [
        ("http://localhost:3000", 204, True),
        ("http://evil.com", None, False),
    ],
)
def test_preflight_options_requests(mlflow_app_client, origin, expected_status, should_have_cors):
    response = mlflow_app_client.options(
        "/api/2.0/mlflow/experiments/search",
        headers={
            "Origin": origin,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type",
        },
    )

    if expected_status:
        assert response.status_code == expected_status

    if should_have_cors:
        assert response.headers.get("Access-Control-Allow-Origin") == origin
        assert "POST" in response.headers.get("Access-Control-Allow-Methods", "")
    else:
        assert (
            "Access-Control-Allow-Origin" not in response.headers
            or response.headers.get("Access-Control-Allow-Origin") != origin
        )
```

--------------------------------------------------------------------------------

---[FILE: auth_test_utils.py]---
Location: mlflow-master/tests/server/auth/auth_test_utils.py

```python
from mlflow.environment_variables import MLFLOW_TRACKING_PASSWORD, MLFLOW_TRACKING_USERNAME
from mlflow.server.auth import auth_config

from tests.helper_functions import random_str
from tests.tracking.integration_test_utils import _send_rest_tracking_post_request

PERMISSION = "READ"
NEW_PERMISSION = "EDIT"
ADMIN_USERNAME = auth_config.admin_username
ADMIN_PASSWORD = auth_config.admin_password


def create_user(tracking_uri: str, username: str | None = None, password: str | None = None):
    username = random_str() if username is None else username
    password = random_str() if password is None else password
    response = _send_rest_tracking_post_request(
        tracking_uri,
        "/api/2.0/mlflow/users/create",
        {
            "username": username,
            "password": password,
        },
        auth=(ADMIN_USERNAME, ADMIN_PASSWORD),
    )
    response.raise_for_status()
    return username, password


class User:
    def __init__(self, username, password, monkeypatch):
        self.username = username
        self.password = password
        self.monkeypatch = monkeypatch

    def __enter__(self):
        self.monkeypatch.setenv(MLFLOW_TRACKING_USERNAME.name, self.username)
        self.monkeypatch.setenv(MLFLOW_TRACKING_PASSWORD.name, self.password)

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.monkeypatch.delenv(MLFLOW_TRACKING_USERNAME.name, raising=False)
        self.monkeypatch.delenv(MLFLOW_TRACKING_PASSWORD.name, raising=False)
```

--------------------------------------------------------------------------------

````
