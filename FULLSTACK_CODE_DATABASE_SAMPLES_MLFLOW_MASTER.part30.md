---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 30
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 30 of 991)

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

---[FILE: test_set_matrix.py]---
Location: mlflow-master/dev/tests/test_set_matrix.py

```python
import functools
import re
import tempfile
from contextlib import contextmanager
from pathlib import Path
from unittest import mock

import pytest

from dev.set_matrix import generate_matrix


class MockResponse:
    def __init__(self, data):
        self.data = data

    def json(self):
        return self.data

    def raise_for_status(self):
        pass

    @classmethod
    def from_versions(cls, versions):
        return cls(
            {
                "releases": {
                    v: [
                        {
                            "filename": v + ".whl",
                            "upload_time": "2023-10-04T16:38:57",
                        }
                    ]
                    for v in versions
                }
            }
        )


def mock_pypi_api(mock_responses):
    def requests_get_patch(url, *args, **kwargs):
        package_name = re.search(r"https://pypi\.org/pypi/(.+)/json", url).group(1)
        return mock_responses[package_name]

    def decorator(test_func):
        @functools.wraps(test_func)
        def wrapper(*args, **kwargs):
            with mock.patch("requests.get", new=requests_get_patch):
                return test_func(*args, **kwargs)

        return wrapper

    return decorator


@contextmanager
def mock_ml_package_versions_yml(src_base, src_ref):
    with tempfile.TemporaryDirectory() as tmp_dir:
        yml_base = Path(tmp_dir).joinpath("base.yml")
        yml_ref = Path(tmp_dir).joinpath("ref.yml")
        yml_base.write_text(src_base)
        yml_ref.write_text(src_ref)
        yield ["--versions-yaml", str(yml_base), "--ref-versions-yaml", str(yml_ref)]


MOCK_YAML_SOURCE = """
foo:
  package_info:
    pip_release: foo
    install_dev: "pip install git+https://github.com/foo/foo.git"

  autologging:
    minimum: "1.0.0"
    maximum: "1.2.0"
    run: pytest tests/foo

bar:
  package_info:
    pip_release: bar
    install_dev: "pip install git+https://github.com/bar/bar.git"

  autologging:
    minimum: "1.3"
    maximum: "1.4"
    run: pytest/tests bar
"""

MOCK_PYPI_API_RESPONSES = {
    "foo": MockResponse.from_versions(["1.0.0", "1.1.0", "1.1.1", "1.2.0"]),
    "bar": MockResponse.from_versions(["1.3", "1.4"]),
}


@pytest.mark.parametrize(
    ("flavors", "expected"),
    [
        ("foo", {"foo"}),
        ("foo,bar", {"foo", "bar"}),
        ("foo, bar", {"foo", "bar"}),  # Contains a space after a comma
        ("", {"foo", "bar"}),
        (None, {"foo", "bar"}),
    ],
)
@mock_pypi_api(MOCK_PYPI_API_RESPONSES)
def test_flavors(flavors, expected):
    with mock_ml_package_versions_yml(MOCK_YAML_SOURCE, "{}") as path_args:
        flavors_args = [] if flavors is None else ["--flavors", flavors]
        matrix = generate_matrix([*path_args, *flavors_args])
        flavors = {x.flavor for x in matrix}
        assert flavors == expected


@pytest.mark.parametrize(
    ("versions", "expected"),
    [
        ("1.0.0", {"1.0.0"}),
        ("1.0.0,1.1.1", {"1.0.0", "1.1.1"}),
        ("1.3, 1.4", {"1.3", "1.4"}),  # Contains a space after a comma
        ("", {"1.0.0", "1.1.1", "1.2.0", "1.3", "1.4", "dev"}),
        (None, {"1.0.0", "1.1.1", "1.2.0", "1.3", "1.4", "dev"}),
    ],
)
@mock_pypi_api(MOCK_PYPI_API_RESPONSES)
def test_versions(versions, expected):
    with mock_ml_package_versions_yml(MOCK_YAML_SOURCE, "{}") as path_args:
        versions_args = [] if versions is None else ["--versions", versions]
        matrix = generate_matrix([*path_args, *versions_args])
        versions = {str(x.version) for x in matrix}
        assert versions == expected


@mock_pypi_api(MOCK_PYPI_API_RESPONSES)
def test_flavors_and_versions():
    with mock_ml_package_versions_yml(MOCK_YAML_SOURCE, "{}") as path_args:
        matrix = generate_matrix([*path_args, "--flavors", "foo,bar", "--versions", "dev"])
        flavors = {x.flavor for x in matrix}
        versions = {str(x.version) for x in matrix}
        assert set(flavors) == {"foo", "bar"}
        assert set(versions) == {"dev"}


@mock_pypi_api(MOCK_PYPI_API_RESPONSES)
def test_no_dev():
    with mock_ml_package_versions_yml(MOCK_YAML_SOURCE, "{}") as path_args:
        matrix = generate_matrix([*path_args, "--no-dev"])
        flavors = {x.flavor for x in matrix}
        versions = {str(x.version) for x in matrix}
        assert set(flavors) == {"foo", "bar"}
        assert set(versions) == {"1.0.0", "1.1.1", "1.2.0", "1.3", "1.4"}


@mock_pypi_api(MOCK_PYPI_API_RESPONSES)
def test_changed_files():
    with mock_ml_package_versions_yml(MOCK_YAML_SOURCE, MOCK_YAML_SOURCE) as path_args:
        matrix = generate_matrix([*path_args, "--changed-files", "mlflow/foo/__init__.py"])
        flavors = {x.flavor for x in matrix}
        versions = {str(x.version) for x in matrix}
        assert set(flavors) == {"foo"}
        assert set(versions) == {"1.0.0", "1.1.1", "1.2.0", "dev"}
```

--------------------------------------------------------------------------------

---[FILE: test_update_ml_package_versions.py]---
Location: mlflow-master/dev/tests/test_update_ml_package_versions.py

```python
import json
import re
from datetime import datetime, timedelta
from pathlib import Path
from unittest import mock

import pytest

from dev import update_ml_package_versions
from dev.update_ml_package_versions import VersionInfo


class MockResponse:
    def __init__(self, body):
        self.body = json.dumps(body).encode("utf-8")

    def read(self):
        return self.body

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        pass

    @classmethod
    def from_versions(cls, versions):
        return cls(
            {
                "releases": {
                    v: [
                        {
                            "filename": v + ".whl",
                            "upload_time": "2023-10-04T16:38:57",
                        }
                    ]
                    for v in versions
                }
            }
        )

    @classmethod
    def from_version_infos(cls, version_infos: list[VersionInfo]) -> "MockResponse":
        return cls(
            {
                "releases": {
                    v.version: [
                        {
                            "filename": v.version + ".whl",
                            "upload_time": v.upload_time.isoformat(),
                        }
                    ]
                    for v in version_infos
                }
            }
        )


@pytest.fixture(autouse=True)
def change_working_directory(tmp_path, monkeypatch):
    """
    Changes the current working directory to a temporary directory to avoid modifying files in the
    repository.
    """
    monkeypatch.chdir(tmp_path)


def run_test(src, src_expected, mock_responses):
    def patch_urlopen(url):
        package_name = re.search(r"https://pypi.python.org/pypi/(.+)/json", url).group(1)
        return mock_responses[package_name]

    versions_yaml = Path("mlflow/ml-package-versions.yml")
    versions_yaml.parent.mkdir()
    versions_yaml.write_text(src)

    with mock.patch("urllib.request.urlopen", new=patch_urlopen):
        update_ml_package_versions.update()

    assert versions_yaml.read_text() == src_expected


def test_multiple_flavors_are_correctly_updated():
    src = """
sklearn:
  package_info:
    pip_release: sklearn
  autologging:
    maximum: "0.0.1"
xgboost:
  package_info:
    pip_release: xgboost
  autologging:
    maximum: "0.1.1"
"""
    mock_responses = {
        "sklearn": MockResponse.from_versions(["0.0.2"]),
        "xgboost": MockResponse.from_versions(["0.1.2"]),
    }
    src_expected = """
sklearn:
  package_info:
    pip_release: sklearn
  autologging:
    maximum: "0.0.2"
xgboost:
  package_info:
    pip_release: xgboost
  autologging:
    maximum: "0.1.2"
"""
    run_test(src, src_expected, mock_responses)


def test_both_models_and_autologging_are_updated():
    src = """
sklearn:
  package_info:
    pip_release: sklearn
  models:
    maximum: "0.0.1"
  autologging:
    maximum: "0.0.1"
"""
    mock_responses = {
        "sklearn": MockResponse.from_versions(["0.0.2"]),
    }
    src_expected = """
sklearn:
  package_info:
    pip_release: sklearn
  models:
    maximum: "0.0.2"
  autologging:
    maximum: "0.0.2"
"""
    run_test(src, src_expected, mock_responses)


def test_pre_and_dev_versions_are_ignored():
    src = """
sklearn:
  package_info:
    pip_release: sklearn
  autologging:
    maximum: "0.0.1"
"""
    mock_responses = {
        "sklearn": MockResponse.from_versions(
            [
                # pre-release and dev-release should be filtered out
                "0.0.3.rc1",  # pre-release
                "0.0.3.dev1",  # dev-release
                "0.0.2.post",  # post-release
                "0.0.2",  # final release
            ]
        ),
    }
    src_expected = """
sklearn:
  package_info:
    pip_release: sklearn
  autologging:
    maximum: "0.0.2.post"
"""
    run_test(src, src_expected, mock_responses)


def test_unsupported_versions_are_ignored():
    src = """
sklearn:
  package_info:
    pip_release: sklearn
  autologging:
    unsupported: ["0.0.3"]
    maximum: "0.0.1"
"""
    mock_responses = {"sklearn": MockResponse.from_versions(["0.0.2", "0.0.3"])}
    src_expected = """
sklearn:
  package_info:
    pip_release: sklearn
  autologging:
    unsupported: ["0.0.3"]
    maximum: "0.0.2"
"""
    run_test(src, src_expected, mock_responses)


def test_freeze_field_prevents_updating_maximum_version():
    src = """
sklearn:
  package_info:
    pip_release: sklearn
  autologging:
    pin_maximum: True
    maximum: "0.0.1"
"""
    mock_responses = {"sklearn": MockResponse.from_versions(["0.0.2"])}
    src_expected = """
sklearn:
  package_info:
    pip_release: sklearn
  autologging:
    pin_maximum: True
    maximum: "0.0.1"
"""
    run_test(src, src_expected, mock_responses)


def test_update_min_supported_version():
    src = """
sklearn:
  package_info:
    pip_release: sklearn
  autologging:
    minimum: "0.0.1"
    maximum: "0.0.8"
"""
    mock_responses = {
        "sklearn": MockResponse.from_version_infos(
            [
                VersionInfo("0.0.2", datetime.now() - timedelta(days=1000)),
                VersionInfo("0.0.3", datetime.now() - timedelta(days=365)),
                VersionInfo("0.0.8", datetime.now() - timedelta(days=180)),
            ]
        )
    }
    src_expected = """
sklearn:
  package_info:
    pip_release: sklearn
  autologging:
    minimum: "0.0.3"
    maximum: "0.0.8"
"""
    run_test(src, src_expected, mock_responses)


def test_update_min_supported_version_for_dead_package():
    src = """
sklearn:
  package_info:
    pip_release: sklearn
  autologging:
    minimum: "0.0.7"
    maximum: "0.0.8"
"""
    mock_responses = {
        "sklearn": MockResponse.from_version_infos(
            [
                VersionInfo("0.0.7", datetime.now() - timedelta(days=1000)),
                VersionInfo("0.0.8", datetime.now() - timedelta(days=800)),
            ]
        )
    }
    src_expected = """
sklearn:
  package_info:
    pip_release: sklearn
  autologging:
    minimum: "0.0.8"
    maximum: "0.0.8"
"""
    run_test(src, src_expected, mock_responses)
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile]---
Location: mlflow-master/docker/Dockerfile

```text
FROM python:3.10-slim-bullseye
ARG VERSION
RUN pip install --no-cache mlflow==$VERSION
```

--------------------------------------------------------------------------------

---[FILE: .env.dev.example]---
Location: mlflow-master/docker-compose/.env.dev.example

```text
# Postgres
POSTGRES_USER=mlflow
POSTGRES_PASSWORD=mlflow
POSTGRES_DB=mlflow

# MinIO
MINIO_ROOT_USER=minio
MINIO_ROOT_PASSWORD=minio123
MINIO_HOST=minio
MINIO_PORT=9000
MINIO_BUCKET=mlflow

# MLflow Server
MLFLOW_BACKEND_STORE_URI=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
MLFLOW_ARTIFACTS_DESTINATION=s3://${MINIO_BUCKET}/
MLFLOW_S3_ENDPOINT_URL=http://${MINIO_HOST}:${MINIO_PORT}

# AWS region (for Boto3)
AWS_DEFAULT_REGION=us-east-1

# MLflow listen settings
MLFLOW_HOST=0.0.0.0
MLFLOW_PORT=5000

# MLflow version (e.g., v3.3.0)
MLFLOW_VERSION=latest
```

--------------------------------------------------------------------------------

---[FILE: docker-compose.yml]---
Location: mlflow-master/docker-compose/docker-compose.yml

```yaml
volumes:
  pgdata:
  minio-data:

services:
  postgres:
    image: postgres:15
    container_name: mlflow-postgres
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 5s
      timeout: 3s
      retries: 10

  minio:
    image: minio/minio:latest
    container_name: mlflow-minio
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
    volumes:
      - minio-data:/data
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000"
      - "9001:9001"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:${MINIO_PORT}/minio/health/live"]
      interval: 5s
      timeout: 3s
      retries: 20

  create-bucket:
    image: minio/mc:latest
    container_name: mlflow-create-bucket
    depends_on:
      minio:
        condition: service_healthy
    entrypoint:
      - /bin/sh
      - -c
      - |
        mc alias set myminio "http://${MINIO_HOST}:${MINIO_PORT}" \
          "${MINIO_ROOT_USER}" "${MINIO_ROOT_PASSWORD}"
        mc mb --ignore-existing "myminio/${MINIO_BUCKET:-mlflow}"
    restart: "no"

  mlflow:
    image: ghcr.io/mlflow/mlflow:${MLFLOW_VERSION}
    container_name: mlflow-server
    depends_on:
      postgres:
        condition: service_healthy
      minio:
        condition: service_healthy
      create-bucket:
        condition: service_completed_successfully
    environment:
      # Backend store URI built from vars
      MLFLOW_BACKEND_STORE_URI: ${MLFLOW_BACKEND_STORE_URI}

      # S3/MinIO settings
      MLFLOW_S3_ENDPOINT_URL: ${MLFLOW_S3_ENDPOINT_URL}
      MLFLOW_ARTIFACTS_DESTINATION: ${MLFLOW_ARTIFACTS_DESTINATION}
      AWS_ACCESS_KEY_ID: ${MINIO_ROOT_USER}
      AWS_SECRET_ACCESS_KEY: ${MINIO_ROOT_PASSWORD}
      AWS_DEFAULT_REGION: ${AWS_DEFAULT_REGION}
      MLFLOW_S3_IGNORE_TLS: "true"

      # Server host/port
      MLFLOW_HOST: ${MLFLOW_HOST}
      MLFLOW_PORT: ${MLFLOW_PORT}

    command:
      - /bin/bash
      - -c
      - |
        pip install --no-cache-dir psycopg2-binary boto3
        mlflow server \
          --backend-store-uri "${MLFLOW_BACKEND_STORE_URI}" \
          --artifacts-destination "${MLFLOW_ARTIFACTS_DESTINATION}" \
          --host "${MLFLOW_HOST}" \
          --port "${MLFLOW_PORT}"
    ports:
      - "${MLFLOW_PORT}:${MLFLOW_PORT}"
    healthcheck:
      test:
        [
          "CMD",
          "python",
          "-c",
          "import urllib.request; urllib.request.urlopen('http://localhost:${MLFLOW_PORT}/health')",
        ]
      interval: 10s
      timeout: 5s
      retries: 30

networks:
  default:
    name: mlflow-network
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/docker-compose/README.md

```text
# MLflow with Docker Compose (PostgreSQL + MinIO)

This directory provides a **Docker Compose** setup for running **MLflow** locally with a **PostgreSQL** backend store and **MinIO** (S3-compatible) artifact storage. It's intended for quick evaluation and local development.

---

## Overview

- **MLflow Tracking Server** — exposed on your host (default `http://localhost:5000`).
- **PostgreSQL** — persists MLflow's metadata (experiments, runs, params, metrics).
- **MinIO** — stores run artifacts via an S3-compatible API.

Compose automatically reads configuration from a local `.env` file in this directory.

---

## Prerequisites

- **Git**
- **Docker** and **Docker Compose**
  - Windows/macOS: [Docker Desktop](https://www.docker.com/products/docker-desktop/)
  - Linux: Docker Engine + the `docker compose` plugin

Verify your setup:

```bash
docker --version
docker compose version
```

---

## 1. Clone the Repository

```bash
git clone https://github.com/mlflow/mlflow.git
cd docker-compose
```

---

## 2. Configure Environment

Copy the example environment file and modify as needed:

```bash
cp .env.dev.example .env
```

The `.env` file defines container image tags, ports, credentials, and storage configuration. Open it and review values before starting the stack.

**Common variables** :

- **MLflow**
  - `MLFLOW_PORT=5000` — host port for the MLflow UI/API
  - `MLFLOW_ARTIFACTS_DESTINATION=s3://mlflow/` — artifact store URI
  - `MLFLOW_S3_ENDPOINT_URL=http://minio:9000` — S3 endpoint (inside the Compose network)
- **PostgreSQL**
  - `POSTGRES_USER=mlflow`
  - `POSTGRES_PASSWORD=mlflow`
  - `POSTGRES_DB=mlflow`
- **MinIO (S3-compatible)**
  - `MINIO_ROOT_USER=minio`
  - `MINIO_ROOT_PASSWORD=minio123`
  - `MINIO_HOST=minio`
  - `MINIO_PORT=9000`
  - `MINIO_BUCKET=mlflow`

---

## 3. Launch the Stack

```bash
docker compose up -d
```

This:

- Builds/pulls images as needed
- Creates a user-defined network
- Starts **postgres**, **minio**, and **mlflow** containers

Check status:

```bash
docker compose ps
```

View logs (useful on first run):

```bash
docker compose logs -f
```

---

## 4. Access MLflow

Open the MLflow UI:

- **URL**: `http://localhost:5000` (or the port set in `.env`)

You can now create experiments, run training scripts, and log metrics, parameters, and artifacts to this local MLflow instance.

---

## 5. Shutdown

To stop and remove the containers and network:

```bash
docker compose down
```

> Data is preserved in Docker **volumes**. To remove volumes as well (irreversible), run:
>
> ```bash
> docker compose down -v
> ```

---

## Tips & Troubleshooting

- **Verify connectivity**  
  If MLflow can't write artifacts, confirm your S3 settings:

  - `MLFLOW_DEFAULT_ARTIFACT_ROOT` points to your MinIO bucket (e.g., `s3://mlflow/`)
  - `MLFLOW_S3_ENDPOINT_URL` is reachable from the MLflow container (often `http://minio:9000`)

- **Resetting the environment**  
  If you want a clean slate, stop the stack and remove volumes:

  ```bash
  docker compose down -v
  docker compose up -d
  ```

- **Logs**

  - MLflow server: `docker compose logs -f mlflow`
  - PostgreSQL: `docker compose logs -f postgres`
  - MinIO: `docker compose logs -f minio`

- **Port conflicts**  
  If `5000` (or any other port) is in use, change it in `.env` and restart:
  ```bash
  docker compose down
  docker compose up -d
  ```

---

## How It Works (at a Glance)

- MLflow uses **PostgreSQL** as the _backend store_ for experiment/run metadata.
- MLflow uses **MinIO** as the _artifact store_ via S3 APIs.
- Docker Compose wires services on a shared network; MLflow talks to PostgreSQL and MinIO by container name (e.g., `postgres`, `minio`).

---

## Next Steps

- Point your training scripts to this server:
  ```bash
  export MLFLOW_TRACKING_URI=http://localhost:5000
  ```
- Start logging runs with `mlflow.start_run()` (Python) or the MLflow CLI.
- Customize the `.env` and `docker-compose.yml` to fit your local workflow (e.g., change image tags, add volumes, etc.).

---

**You now have a fully local MLflow stack with persistent metadata and artifact storage—ideal for development and experimentation.**
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: mlflow-master/docs/.prettierignore

```text
# Exclude vendor/theme CSS files in api_reference directory
api_reference/**/*.css
# Exclude JS files in api_reference directory
api_reference/**/*.js

# Exclude to preserve indentation in the code blocks in the table
docs/genai/eval-monitor/legacy-llm-evaluation.mdx
```

--------------------------------------------------------------------------------

---[FILE: communitySidebar.ts]---
Location: mlflow-master/docs/communitySidebar.ts

```typescript
import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const communitySidebar: SidebarsConfig = {
  communitySidebar: [
    {
      type: 'doc',
      id: 'index',
      label: 'Community',
    },
    {
      type: 'doc',
      id: 'usage-tracking',
      label: 'Usage Tracking',
    },
  ],
};

export default communitySidebar;
```

--------------------------------------------------------------------------------

````
