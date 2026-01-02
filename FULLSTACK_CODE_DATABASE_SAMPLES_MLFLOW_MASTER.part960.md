---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:55Z
part: 960
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 960 of 991)

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

---[FILE: integration_test_utils.py]---
Location: mlflow-master/tests/tracking/integration_test_utils.py
Signals: FastAPI, Flask

```python
import contextlib
import logging
import os
import socket
import sys
import time
from subprocess import Popen
from threading import Thread
from typing import Any, Generator, Literal

import requests
import uvicorn
from fastapi import FastAPI

import mlflow
from mlflow.server import ARTIFACT_ROOT_ENV_VAR, BACKEND_STORE_URI_ENV_VAR

from tests.helper_functions import LOCALHOST, get_safe_port

_logger = logging.getLogger(__name__)


def _await_server_up_or_die(port: int, timeout: int = 30) -> None:
    """Waits until the local flask server is listening on the given port."""
    _logger.info(f"Awaiting server to be up on {LOCALHOST}:{port}")
    start_time = time.time()
    while time.time() - start_time < timeout:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.settimeout(2)
            if sock.connect_ex((LOCALHOST, port)) == 0:
                _logger.info(f"Server is up on {LOCALHOST}:{port}!")
                break
        _logger.info("Server not yet up, waiting...")
        time.sleep(0.5)
    else:
        raise Exception(f"Failed to connect on {LOCALHOST}:{port} within {timeout} seconds")


@contextlib.contextmanager
def _init_server(
    backend_uri: str,
    root_artifact_uri: str,
    extra_env: dict[str, Any] | None = None,
    app: str | None = None,
    server_type: Literal["flask", "fastapi"] = "fastapi",
) -> Generator[str, None, None]:
    """
    Launch a new REST server using the tracking store specified by backend_uri and root artifact
    directory specified by root_artifact_uri.

    Args:
        backend_uri: Backend store URI for the server
        root_artifact_uri: Root artifact URI for the server
        extra_env: Additional environment variables
        app: Application module path (defaults based on server_type if None)
        server_type: Server type to use - "fastapi" (default) or "flask"

    Yields:
        The string URL of the server.
    """
    mlflow.set_tracking_uri(None)
    server_port = get_safe_port()

    if server_type == "fastapi":
        # Use uvicorn for FastAPI
        cmd = [
            sys.executable,
            "-m",
            "uvicorn",
            app or "mlflow.server.fastapi_app:app",
            "--host",
            LOCALHOST,
            "--port",
            str(server_port),
        ]
    else:
        # Default to Flask
        cmd = [
            sys.executable,
            "-m",
            "flask",
            "--app",
            app or "mlflow.server:app",
            "run",
            "--host",
            LOCALHOST,
            "--port",
            str(server_port),
        ]

    with Popen(
        cmd,
        env={
            **os.environ,
            BACKEND_STORE_URI_ENV_VAR: backend_uri,
            ARTIFACT_ROOT_ENV_VAR: root_artifact_uri,
            **(extra_env or {}),
        },
    ) as proc:
        try:
            _await_server_up_or_die(server_port)
            url = f"http://{LOCALHOST}:{server_port}"
            _logger.info(
                f"Launching tracking server on {url} with backend URI {backend_uri} and "
                f"artifact root {root_artifact_uri}"
            )
            yield url
        finally:
            proc.terminate()


def _send_rest_tracking_post_request(tracking_server_uri, api_path, json_payload, auth=None):
    """
    Make a POST request to the specified MLflow Tracking API and retrieve the
    corresponding `requests.Response` object
    """
    import requests

    url = tracking_server_uri + api_path
    return requests.post(url, json=json_payload, auth=auth)


class ServerThread(Thread):
    """Run a FastAPI/uvicorn app in a background thread, usable as a context manager."""

    def __init__(self, app: FastAPI, port: int):
        super().__init__(name="mlflow-tracking-server", daemon=True)
        self.host = "127.0.0.1"
        self.port = port
        self.url = f"http://{self.host}:{port}"
        self.health_url = f"{self.url}/health"
        config = uvicorn.Config(app, host=self.host, port=self.port, log_level="error")
        self.server = uvicorn.Server(config)

    def run(self) -> None:
        """Thread target: let Uvicorn manage its own event loop."""
        self.server.run()

    def shutdown(self) -> None:
        """Ask Uvicorn to exit; the serving loop checks this flag."""
        self.server.should_exit = True

    def __enter__(self) -> str:
        """Use as a context manager for tests or short-lived runs."""
        self.start()

        # Quick readiness wait (poll the health endpoint if available)
        deadline = time.time() + 5.0
        while time.time() < deadline:
            try:
                r = requests.get(self.health_url, timeout=0.2)
                if r.ok:
                    break
            except (requests.ConnectionError, requests.Timeout):
                pass
            time.sleep(0.1)
        return self.url

    def __exit__(self, exc_type, exc, tb) -> bool | None:
        """Clean up resources when exiting context."""
        self.shutdown()
        # Give the server a moment to wind down
        self.join(timeout=5.0)
        return None
```

--------------------------------------------------------------------------------

---[FILE: test_artifact_utils.py]---
Location: mlflow-master/tests/tracking/test_artifact_utils.py

```python
import os
from unittest import mock
from unittest.mock import ANY
from uuid import UUID

import pytest

import mlflow
from mlflow.exceptions import MlflowException
from mlflow.tracking.artifact_utils import (
    _download_artifact_from_uri,
    _upload_artifact_to_uri,
    _upload_artifacts_to_databricks,
)


def test_artifact_can_be_downloaded_from_absolute_uri_successfully(tmp_path):
    artifact_file_name = "artifact.txt"
    artifact_text = "Sample artifact text"
    local_artifact_path = tmp_path.joinpath(artifact_file_name)
    local_artifact_path.write_text(artifact_text)

    logged_artifact_path = "artifact"
    with mlflow.start_run():
        mlflow.log_artifact(local_path=local_artifact_path, artifact_path=logged_artifact_path)
        artifact_uri = mlflow.get_artifact_uri(artifact_path=logged_artifact_path)

    downloaded_artifact_path = os.path.join(
        _download_artifact_from_uri(artifact_uri), artifact_file_name
    )
    assert downloaded_artifact_path != local_artifact_path
    assert downloaded_artifact_path != logged_artifact_path
    with open(downloaded_artifact_path) as f:
        assert f.read() == artifact_text


def test_download_artifact_from_absolute_uri_persists_data_to_specified_output_directory(tmp_path):
    artifact_file_name = "artifact.txt"
    artifact_text = "Sample artifact text"
    local_artifact_path = tmp_path.joinpath(artifact_file_name)
    local_artifact_path.write_text(artifact_text)

    logged_artifact_subdir = "logged_artifact"
    with mlflow.start_run():
        mlflow.log_artifact(local_path=local_artifact_path, artifact_path=logged_artifact_subdir)
        artifact_uri = mlflow.get_artifact_uri(artifact_path=logged_artifact_subdir)

    artifact_output_path = tmp_path.joinpath("artifact_output")
    artifact_output_path.mkdir()
    _download_artifact_from_uri(artifact_uri=artifact_uri, output_path=artifact_output_path)
    assert logged_artifact_subdir in os.listdir(artifact_output_path)
    assert artifact_file_name in os.listdir(
        os.path.join(artifact_output_path, logged_artifact_subdir)
    )
    with open(os.path.join(artifact_output_path, logged_artifact_subdir, artifact_file_name)) as f:
        assert f.read() == artifact_text


def test_download_artifact_with_special_characters_in_file_name_and_path(tmp_path):
    artifact_file_name = " artifact_ with! special  characters.txt"
    artifact_sub_dir = " path with ! special  characters"
    artifact_text = "Sample artifact text"
    local_sub_path = tmp_path.joinpath(artifact_sub_dir)
    local_sub_path.mkdir()

    local_artifact_path = os.path.join(local_sub_path, artifact_file_name)
    with open(local_artifact_path, "w") as out:
        out.write(artifact_text)

    logged_artifact_subdir = "logged_artifact"
    with mlflow.start_run():
        mlflow.log_artifact(local_path=local_artifact_path, artifact_path=logged_artifact_subdir)
        artifact_uri = mlflow.get_artifact_uri(artifact_path=logged_artifact_subdir)

    artifact_output_path = tmp_path.joinpath("artifact output path!")
    artifact_output_path.mkdir()
    _download_artifact_from_uri(artifact_uri=artifact_uri, output_path=artifact_output_path)
    assert logged_artifact_subdir in os.listdir(artifact_output_path)
    assert artifact_file_name in os.listdir(
        os.path.join(artifact_output_path, logged_artifact_subdir)
    )
    with open(os.path.join(artifact_output_path, logged_artifact_subdir, artifact_file_name)) as f:
        assert f.read() == artifact_text


def test_download_artifact_invalid_uri_model_id():
    with pytest.raises(
        MlflowException,
        match="Invalid uri `m-dummy` is passed. Maybe you meant 'models:/m-dummy'?",
    ):
        _download_artifact_from_uri("m-dummy")


def test_upload_artifacts_to_databricks():
    import_root = "mlflow.tracking.artifact_utils"
    with (
        mock.patch(import_root + "._download_artifact_from_uri") as download_mock,
        mock.patch(import_root + ".DbfsRestArtifactRepository") as repo_mock,
    ):
        new_source = _upload_artifacts_to_databricks(
            "dbfs:/original/sourcedir/",
            "runid12345",
            "databricks://tracking",
            "databricks://registry:ws",
        )
        download_mock.assert_called_once_with("dbfs://tracking@databricks/original/sourcedir/", ANY)
        repo_mock.assert_called_once_with(
            "dbfs://registry:ws@databricks/databricks/mlflow/tmp-external-source/"
        )
        assert new_source == "dbfs:/databricks/mlflow/tmp-external-source/runid12345/sourcedir"


def test_upload_artifacts_to_databricks_no_run_id():
    import_root = "mlflow.tracking.artifact_utils"
    with (
        mock.patch(import_root + "._download_artifact_from_uri") as download_mock,
        mock.patch(import_root + ".DbfsRestArtifactRepository") as repo_mock,
        mock.patch("uuid.uuid4", return_value=UUID("4f746cdcc0374da2808917e81bb53323")),
    ):
        new_source = _upload_artifacts_to_databricks(
            "dbfs:/original/sourcedir/", None, "databricks://tracking:ws", "databricks://registry"
        )
        download_mock.assert_called_once_with(
            "dbfs://tracking:ws@databricks/original/sourcedir/", ANY
        )
        repo_mock.assert_called_once_with(
            "dbfs://registry@databricks/databricks/mlflow/tmp-external-source/"
        )
        assert (
            new_source == "dbfs:/databricks/mlflow/tmp-external-source/"
            "4f746cdcc0374da2808917e81bb53323/sourcedir"
        )


def test_upload_artifacts_to_uri(tmp_path):
    artifact_file_name = "artifact.txt"
    artifact_text = "Sample artifact text"
    local_artifact_path = tmp_path.joinpath(artifact_file_name)
    local_artifact_path.write_text(artifact_text)

    with mlflow.start_run() as run:
        mlflow.log_metric("coolness", 1)

    artifact_uri = f"runs:/{run.info.run_id}/"
    _upload_artifact_to_uri(local_artifact_path, artifact_uri)
    downloaded_artifact_path = os.path.join(
        _download_artifact_from_uri(artifact_uri), artifact_file_name
    )
    with open(downloaded_artifact_path) as f:
        assert f.read() == artifact_text
```

--------------------------------------------------------------------------------

````
