---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 778
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 778 of 991)

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

---[FILE: .dockerignore]---
Location: mlflow-master/tests/db/.dockerignore

```text
**

!init-mssql-db.sh
!init-mssql-db.sql
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: mlflow-master/tests/db/.gitignore

```text
snapshots
```

--------------------------------------------------------------------------------

---[FILE: check_migration.py]---
Location: mlflow-master/tests/db/check_migration.py
Signals: SQLAlchemy

```python
"""
Usage
-----
export MLFLOW_TRACKING_URI=sqlite:///mlruns.db

# pre migration
python tests/db/check_migration.py pre-migration

# post migration
python tests/db/check_migration.py post-migration
"""

import os
import uuid
from pathlib import Path

import click
import pandas as pd
import sqlalchemy as sa

import mlflow
from mlflow.store.model_registry.dbmodels.models import (
    SqlModelVersion,
    SqlModelVersionTag,
    SqlRegisteredModel,
    SqlRegisteredModelTag,
)
from mlflow.store.tracking.dbmodels.models import (
    SqlExperiment,
    SqlExperimentTag,
    SqlLatestMetric,
    SqlMetric,
    SqlParam,
    SqlRun,
    SqlTag,
)

TABLES = [
    SqlExperiment.__tablename__,
    SqlRun.__tablename__,
    SqlMetric.__tablename__,
    SqlParam.__tablename__,
    SqlTag.__tablename__,
    SqlExperimentTag.__tablename__,
    SqlLatestMetric.__tablename__,
    SqlRegisteredModel.__tablename__,
    SqlModelVersion.__tablename__,
    SqlRegisteredModelTag.__tablename__,
    SqlModelVersionTag.__tablename__,
]
SNAPSHOTS_DIR = Path(__file__).parent / "snapshots"


class Model(mlflow.pyfunc.PythonModel):
    def predict(self, context, model_input, params=None):
        return [0]


def log_everything():
    exp_id = mlflow.create_experiment(uuid.uuid4().hex, tags={"tag": "experiment"})
    mlflow.set_experiment(experiment_id=exp_id)
    with mlflow.start_run() as run:
        mlflow.log_params({"param": "value"})
        mlflow.log_metrics({"metric": 0.1})
        mlflow.set_tags({"tag": "run"})
        model_info = mlflow.pyfunc.log_model(  # clint: disable=log-model-artifact-path
            "model", python_model=Model()
        )

    client = mlflow.MlflowClient()
    registered_model_name = uuid.uuid4().hex
    client.create_registered_model(
        registered_model_name, tags={"tag": "registered_model"}, description="description"
    )
    client.create_model_version(
        registered_model_name,
        model_info.model_uri,
        run_id=run.info.run_id,
        tags={"tag": "model_version"},
        run_link="run_link",
        description="description",
    )


def connect_to_mlflow_db():
    return sa.create_engine(os.environ["MLFLOW_TRACKING_URI"]).connect()


@click.group()
def cli():
    pass


@cli.command()
@click.option("--verbose", is_flag=True, default=False)
def pre_migration(verbose):
    for _ in range(5):
        log_everything()
    SNAPSHOTS_DIR.mkdir(exist_ok=True)
    with connect_to_mlflow_db() as conn:
        for table in TABLES:
            df = pd.read_sql(sa.text(f"SELECT * FROM {table}"), conn)
            df.to_pickle(SNAPSHOTS_DIR / f"{table}.pkl")
            if verbose:
                click.secho(f"\n{table}\n", fg="blue")
                click.secho(df.head(5).to_markdown(index=False))


@cli.command()
def post_migration():
    with connect_to_mlflow_db() as conn:
        for table in TABLES:
            df_actual = pd.read_sql(sa.text(f"SELECT * FROM {table}"), conn)
            df_expected = pd.read_pickle(SNAPSHOTS_DIR / f"{table}.pkl")
            pd.testing.assert_frame_equal(df_actual[df_expected.columns], df_expected)


if __name__ == "__main__":
    cli()
```

--------------------------------------------------------------------------------

---[FILE: check_migration.sh]---
Location: mlflow-master/tests/db/check_migration.sh

```bash
#!/bin/bash
set -ex

cd tests/db

# Install the lastest version of mlflow from PyPI
pip install mlflow
python check_migration.py pre-migration
# Install mlflow from the repository
pip install -e ../..
mlflow db upgrade $MLFLOW_TRACKING_URI
python check_migration.py post-migration
```

--------------------------------------------------------------------------------

---[FILE: compose.sh]---
Location: mlflow-master/tests/db/compose.sh

```bash
#!/bin/bash
set -ex

docker compose --project-directory tests/db down --volumes --remove-orphans > /dev/null 2>&1
docker compose --project-directory tests/db "$@"
```

--------------------------------------------------------------------------------

---[FILE: compose.yml]---
Location: mlflow-master/tests/db/compose.yml
Signals: Docker

```yaml
services:
  base:
    image: mlflow-base
    build:
      context: .
    volumes:
      - ${PWD}:/mlflow/home
    working_dir: /mlflow/home
    entrypoint: /mlflow/home/tests/db/entrypoint.sh
    command: pytest tests/db
    environment:
      DISABLE_RESET_MLFLOW_URI_FIXTURE: "true"

  postgresql:
    image: postgres@sha256:c1f0abd909b477d6088c72e4cd6eb01ea525344caca1b58689ae884204369502
    restart: always
    environment:
      POSTGRES_DB: mlflowdb
      POSTGRES_USER: mlflowuser
      POSTGRES_PASSWORD: mlflowpassword

  mlflow-postgresql:
    depends_on:
      - postgresql
    extends:
      service: base
    environment:
      MLFLOW_TRACKING_URI: postgresql://mlflowuser:mlflowpassword@postgresql:5432/mlflowdb
      INSTALL_MLFLOW_FROM_REPO: true

  migration-postgresql:
    depends_on:
      - postgresql
    extends:
      service: base
    environment:
      MLFLOW_TRACKING_URI: postgresql://mlflowuser:mlflowpassword@postgresql:5432/mlflowdb
    command: tests/db/check_migration.sh

  mysql:
    image: mysql@sha256:569c4128dfa625ac2ac62cdd8af588a3a6a60a049d1a8d8f0fac95880ecdbbe5
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root-password
      MYSQL_DATABASE: mlflowdb
      MYSQL_USER: mlflowuser
      MYSQL_PASSWORD: mlflowpassword
    command: --log-bin-trust-function-creators=1

  mlflow-mysql:
    extends:
      service: base
    depends_on:
      - mysql
    environment:
      MLFLOW_TRACKING_URI: mysql://mlflowuser:mlflowpassword@mysql:3306/mlflowdb?charset=utf8mb4
      INSTALL_MLFLOW_FROM_REPO: true

  migration-mysql:
    extends:
      service: base
    depends_on:
      - mysql
    environment:
      MLFLOW_TRACKING_URI: mysql://mlflowuser:mlflowpassword@mysql:3306/mlflowdb?charset=utf8mb4
    command: tests/db/check_migration.sh

  mssql:
    image: mcr.microsoft.com/mssql/server@sha256:54b23ca766287dab5f6f55162923325f07cdec6ccb42108f37c55c87e7688ebd
    restart: always
    environment:
      ACCEPT_EULA: Y
      SA_PASSWORD: "1Secure*Password1"

  mlflow-mssql:
    depends_on:
      - mssql
    extends:
      service: base
    platform: linux/amd64
    image: mlflow-mssql
    build:
      context: .
      dockerfile: Dockerfile.mssql
    environment:
      MLFLOW_TRACKING_URI: mssql+pyodbc://mlflowuser:Mlfl*wpassword1@mssql/mlflowdb?driver=ODBC+Driver+17+for+SQL+Server
      INSTALL_MLFLOW_FROM_REPO: true

  migration-mssql:
    depends_on:
      - mssql
    extends:
      service: base
    platform: linux/amd64
    image: mlflow-mssql
    build:
      context: .
      dockerfile: Dockerfile.mssql
    environment:
      # We could try using ODBC Driver 18 and append `LongAsMax=Yes` to fix error for sqlalchemy<2.0:
      # [ODBC Driver 17 for SQL Server][SQL Server]The data types varchar and ntext are incompatible in the equal to operator
      # https://docs.sqlalchemy.org/en/20/dialects/mssql.html#avoiding-sending-large-string-parameters-as-text-ntext
      MLFLOW_TRACKING_URI: mssql+pyodbc://mlflowuser:Mlfl*wpassword1@mssql/mlflowdb?driver=ODBC+Driver+17+for+SQL+Server
    command: tests/db/check_migration.sh

  mlflow-sqlite:
    extends:
      service: base
    environment:
      MLFLOW_TRACKING_URI: "sqlite:////tmp/mlflowdb"
      INSTALL_MLFLOW_FROM_REPO: true

  migration-sqlite:
    extends:
      service: base
    environment:
      MLFLOW_TRACKING_URI: "sqlite:////tmp/mlflowdb"
    command: tests/db/check_migration.sh
```

--------------------------------------------------------------------------------

---[FILE: conftest.py]---
Location: mlflow-master/tests/db/conftest.py

```python
import pytest

from mlflow.environment_variables import MLFLOW_TRACKING_URI


@pytest.fixture(autouse=True)
def use_sqlite_if_tracking_uri_env_var_is_not_set(tmp_path, monkeypatch):
    if not MLFLOW_TRACKING_URI.defined:
        sqlite_file = tmp_path / "mlruns.sqlite"
        monkeypatch.setenv(MLFLOW_TRACKING_URI.name, f"sqlite:///{sqlite_file}")
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile]---
Location: mlflow-master/tests/db/Dockerfile

```text
FROM python:3.10

ARG DEPENDENCIES

RUN pip install psycopg2 pymysql mysqlclient pytest pytest-cov pytest-asyncio
RUN echo "${DEPENDENCIES}" > /tmp/requirements.txt && pip install -r /tmp/requirements.txt
RUN pip list
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile.mssql]---
Location: mlflow-master/tests/db/Dockerfile.mssql

```text
# MSSQL tools are only available for amd64 architecture
# GitHub Actions runners use amd64, but local development might use ARM (Apple Silicon)
# The --platform flag ensures consistent behavior across environments
FROM --platform=linux/amd64 python:3.10

ARG DEPENDENCIES

# apt-get and system utilities
RUN apt-get update && apt-get install -y \
    curl apt-transport-https debconf-utils gnupg \
    && rm -rf /var/lib/apt/lists/*

# adding custom MS repository
# https://learn.microsoft.com/en-us/sql/linux/quickstart-install-connect-ubuntu?view=sql-server-ver17&tabs=ubuntu2004#install-the-sql-server-command-line-tools
RUN curl https://packages.microsoft.com/keys/microsoft.asc > /etc/apt/trusted.gpg.d/microsoft.asc
RUN curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list > /etc/apt/sources.list.d/mssql-release.list

# install SQL Server drivers and tools
RUN apt-get update && ACCEPT_EULA=Y apt-get install -y mssql-tools unixodbc-dev

RUN pip install pyodbc pytest pytest-cov pytest-asyncio
RUN echo "${DEPENDENCIES}" > /tmp/requirements.txt && pip install -r /tmp/requirements.txt
RUN pip list
```

--------------------------------------------------------------------------------

---[FILE: entrypoint.sh]---
Location: mlflow-master/tests/db/entrypoint.sh

```bash
#!/bin/bash
set -ex

# Install mlflow (assuming the repository root is mounted to the working directory)
if [ "$INSTALL_MLFLOW_FROM_REPO" = "true" ]; then
  pip install --no-deps -e .
fi

# For Microsoft SQL server, wait until the database is up and running
if [[ $MLFLOW_TRACKING_URI == mssql* ]]; then
  ./tests/db/init-mssql-db.sh
fi

# Execute the command
exec "$@"
```

--------------------------------------------------------------------------------

---[FILE: init-mssql-db.sh]---
Location: mlflow-master/tests/db/init-mssql-db.sh

```bash
#!/bin/bash
for BACKOFF in 0 1 2 4 8 16; do
    if [ "$BACKOFF" -ne "0" ]; then
        echo "Could not connect to SQL Server"
        echo "Trying again in ${BACKOFF} seconds"
        sleep $BACKOFF
    fi
    if /opt/mssql-tools/bin/sqlcmd -S mssql -U sa -P 1Secure*Password1 -d master -i $(dirname "$0")/init-mssql-db.sql; then
        exit 0
    fi
done
exit 1
```

--------------------------------------------------------------------------------

---[FILE: init-mssql-db.sql]---
Location: mlflow-master/tests/db/init-mssql-db.sql

```sql
CREATE DATABASE mlflowdb;
GO

USE mlflowdb;

CREATE LOGIN mlflowuser
    WITH PASSWORD = 'Mlfl*wpassword1';
GO

CREATE USER mlflowuser FOR LOGIN mlflowuser;
GO

ALTER ROLE db_owner
    ADD MEMBER mlflowuser;
GO
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/tests/db/README.md

```text
# Instructions

This directory contains files to test MLflow tracking operations using the following databases:

- PostgreSQL
- MySQL
- Microsoft SQL Server
- SQLite

## Prerequisites

- Docker
- Docker Compose V2

## Build Services

```bash
# Build a service
service=mlflow-sqlite
./tests/db/compose.sh build --build-arg DEPENDENCIES="$(python dev/extract_deps.py)" $service

# Build all services
./tests/db/compose.sh build --build-arg DEPENDENCIES="$(python dev/extract_deps.py)"
```

## Run Services

```bash
# Run a service (`pytest tests/db` is executed by default)
./tests/db/compose.sh run --rm $service

# Run all services
for service in $(./tests/db/compose.sh config --services | grep '^mlflow-')
do
  ./tests/db/compose.sh run --rm "$service"
done

# Run tests
./tests/db/compose.sh run --rm $service pytest /path/to/directory/or/script

# Run a python script
./tests/db/compose.sh run --rm $service python /path/to/script
```

## Clean Up Services

```bash
# Clean up containers, networks, and volumes
./tests/db/compose.sh down --volumes --remove-orphans

# Clean up containers, networks, volumes, and images
./tests/db/compose.sh down --volumes --remove-orphans --rmi all
```

## Other Useful Commands

```bash
# View database logs
./tests/db/compose.sh logs --follow <database service>
```
```

--------------------------------------------------------------------------------

---[FILE: test_schema.py]---
Location: mlflow-master/tests/db/test_schema.py
Signals: SQLAlchemy

```python
import difflib
import re
from pathlib import Path
from typing import NamedTuple

import pytest
from sqlalchemy import create_engine
from sqlalchemy.schema import CreateTable, MetaData

import mlflow
from mlflow.environment_variables import MLFLOW_TRACKING_URI

pytestmark = pytest.mark.notrackingurimock


def get_database_dialect(uri):
    return create_engine(uri).dialect.name


def get_tracking_uri():
    return MLFLOW_TRACKING_URI.get()


def dump_schema(db_uri):
    engine = create_engine(db_uri)
    created_tables_metadata = MetaData()
    created_tables_metadata.reflect(bind=engine)
    # Write out table schema as described in
    # https://docs.sqlalchemy.org/en/13/faq/metadata_schema.html#how-can-i-get-the-create-table-drop-table-output-as-a-string
    lines = []
    for table in created_tables_metadata.sorted_tables:
        # Apply `str.rstrip` to remove trailing whitespaces
        lines += map(str.rstrip, str(CreateTable(table)).splitlines())
    return "\n".join(lines)


class _CreateTable(NamedTuple):
    table: str
    columns: str


_CREATE_TABLE_REGEX = re.compile(
    r"""
CREATE TABLE (?P<table>\S+?) \(
(?P<columns>.+?)
\)
""".strip(),
    flags=re.DOTALL,
)


def parse_create_tables(schema):
    return [
        _CreateTable(
            table=m.group("table"),
            columns=set(m.group("columns").splitlines()),
        )
        for m in _CREATE_TABLE_REGEX.finditer(schema)
    ]


def schema_equal(schema_a, schema_b):
    create_tables_a = parse_create_tables(schema_a)
    create_tables_b = parse_create_tables(schema_b)
    assert create_tables_a != []
    assert create_tables_b != []
    return create_tables_a == create_tables_b


def get_schema_path(db_uri):
    return Path(__file__).parent / "schemas" / (get_database_dialect(db_uri) + ".sql")


def iter_parameter_sets():
    a = """
CREATE TABLE table (
    col VARCHAR(10)
)
"""
    b = """
CREATE TABLE table (
    col VARCHAR(10)
)
"""
    yield pytest.param(a, b, True, id="identical schemas")

    a = """
CREATE TABLE table1 (
    col VARCHAR(10)
)
"""
    b = """
CREATE TABLE table2 (
    col VARCHAR(10)
)
"""
    yield pytest.param(a, b, False, id="different table names")

    a = """
CREATE TABLE table (
    col1 VARCHAR(10)
)
"""
    b = """
CREATE TABLE table (
    col2 VARCHAR(10)
)
"""
    yield pytest.param(a, b, False, id="different column names")


@pytest.mark.parametrize(("a", "b", "expected"), iter_parameter_sets())
def test_schema_equal(a, b, expected):
    assert schema_equal(a, b) is expected


def initialize_database():
    with mlflow.start_run():
        pass


def get_schema_update_command(dialect):
    this_script = Path(__file__).relative_to(Path.cwd())
    docker_compose_yml = this_script.parent / "compose.yml"
    return f"docker compose -f {docker_compose_yml} run --rm mlflow-{dialect} python {this_script}"


def test_schema_is_up_to_date():
    initialize_database()
    tracking_uri = get_tracking_uri()
    schema_path = get_schema_path(tracking_uri)
    existing_schema = schema_path.read_text()
    latest_schema = dump_schema(tracking_uri)
    dialect = get_database_dialect(tracking_uri)
    update_command = get_schema_update_command(dialect)
    message = (
        f"{schema_path.relative_to(Path.cwd())} is not up-to-date. "
        f"Please run this command to update it: {update_command}"
    )
    diff = "".join(
        difflib.ndiff(
            existing_schema.splitlines(keepends=True), latest_schema.splitlines(keepends=True)
        )
    )
    rel_path = schema_path.relative_to(Path.cwd())
    message = f"""
=================================== EXPECTED ===================================
{latest_schema}
==================================== ACTUAL ====================================
{existing_schema}
===================================== DIFF =====================================
{diff}
================================== HOW TO FIX ==================================
Manually copy & paste the expected schema in {rel_path} or run the following command:
{update_command}
"""
    assert schema_equal(existing_schema, latest_schema), message


def main():
    tracking_uri = get_tracking_uri()
    assert tracking_uri, f"Environment variable {MLFLOW_TRACKING_URI} must be set"
    get_database_dialect(tracking_uri)  # Ensure `tracking_uri` is a database URI
    mlflow.set_tracking_uri(tracking_uri)
    initialize_database()
    schema_path = get_schema_path(tracking_uri)
    existing_schema = schema_path.read_text()
    latest_schema = dump_schema(tracking_uri)
    if not schema_equal(existing_schema, latest_schema):
        schema_path.write_text(latest_schema)


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: test_tracking_operations.py]---
Location: mlflow-master/tests/db/test_tracking_operations.py
Signals: SQLAlchemy

```python
import sqlite3
import uuid
from unittest import mock

import pytest
import sqlalchemy.dialects.sqlite.pysqlite

import mlflow
from mlflow import MlflowClient
from mlflow.environment_variables import MLFLOW_TRACKING_URI

pytestmark = pytest.mark.notrackingurimock


class Model(mlflow.pyfunc.PythonModel):
    def load_context(self, context):
        pass

    def predict(self, context, model_input, params=None):
        pass


def start_run_and_log_data():
    with mlflow.start_run():
        mlflow.log_param("p", "param")
        mlflow.log_metric("m", 1.0)
        mlflow.set_tag("t", "tag")
        mlflow.pyfunc.log_model(name="model", python_model=Model(), registered_model_name="model")


def test_search_runs():
    start_run_and_log_data()
    runs = mlflow.search_runs(experiment_ids=["0"], order_by=["param.start_time DESC"])
    mlflow.get_run(runs["run_id"][0])


def test_set_run_status_to_killed():
    """
    This test ensures the following migration scripts work correctly:
    - cfd24bdc0731_update_run_status_constraint_with_killed.py
    - 0a8213491aaa_drop_duplicate_killed_constraint.py
    """
    with mlflow.start_run() as run:
        pass
    client = MlflowClient()
    client.set_terminated(run_id=run.info.run_id, status="KILLED")


def test_database_operational_error(monkeypatch):
    # This test is specifically designed to force errors with SQLite. Skip it if
    # using a non-SQLite backend.
    if not MLFLOW_TRACKING_URI.get().startswith("sqlite"):
        pytest.skip("Only works on SQLite")

    # This test patches parts of SQLAlchemy and sqlite3.dbapi to simulate a
    # SQLAlchemy OperationalError. PEP 249 describes OperationalError as:
    #
    # > Exception raised for errors that are related to the database's operation
    # > and not necessarily under the control of the programmer, e.g. an
    # > unexpected disconnect occurs, the data source name is not found, a
    # > transaction could not be processed, a memory allocation error occurred
    # > during processing, etc.
    #
    # These errors are typically transient and can be resolved by retrying the
    # operation, hence MLflow has different handling for them as compared to
    # the more generic exception type, SQLAlchemyError.
    #
    # This is particularly important for REST clients, where
    # TEMPORARILY_UNAVAILABLE triggers MLflow REST clients to retry the request,
    # whereas BAD_REQUEST does not.
    api_module = None
    old_connect = None

    # Depending on the version of SQLAlchemy, the function we need to patch is
    # either called "dbapi" (sqlalchemy<2.0) or "import_dbapi"
    # (sqlalchemy>=2.0).
    for dialect_attr in ["dbapi", "import_dbapi"]:
        if hasattr(sqlalchemy.dialects.sqlite.pysqlite.SQLiteDialect_pysqlite, dialect_attr):
            break
    else:
        raise AssertionError("Could not find dbapi attribute on SQLiteDialect_pysqlite")

    old_dbapi = getattr(sqlalchemy.dialects.sqlite.pysqlite.SQLiteDialect_pysqlite, dialect_attr)

    class ConnectionWrapper:
        """Wraps a sqlite3.Connection object."""

        def __init__(self, conn):
            self.conn = conn

        def __getattr__(self, name):
            return getattr(self.conn, name)

        def cursor(self):
            """Return a wrapped SQLite cursor."""
            return CursorWrapper(self.conn.cursor())

    class CursorWrapper:
        """Wraps a sqlite3.Cursor object."""

        def __init__(self, cursor):
            self.cursor = cursor

        def __getattr__(self, name):
            return getattr(self.cursor, name)

        def execute(self, *args, **kwargs):
            """Wraps execute(), simulating sporadic OperationalErrors."""
            if (
                len(args) >= 2
                and "test_database_operational_error_1667938883_param" in args[1]
                and "test_database_operational_error_1667938883_value" in args[1]
            ):
                # Simulate a database error
                raise sqlite3.OperationalError("test")
            return self.cursor.execute(*args, **kwargs)

    def connect(*args, **kwargs):
        """Wraps sqlite3.dbapi.connect(), returning a wrapped connection."""
        conn = old_connect(*args, **kwargs)
        return ConnectionWrapper(conn)

    def dbapi(*args, **kwargs):
        """Wraps SQLiteDialect_pysqlite.dbapi(), returning patched dbapi."""
        nonlocal api_module, old_connect
        if api_module is None:
            # Only patch the first time dbapi() is called, to avoid recursion.
            api_module = old_dbapi(*args, **kwargs)
            old_connect = api_module.connect
            monkeypatch.setattr(api_module, "connect", connect)
        return api_module

    monkeypatch.setattr(
        sqlalchemy.dialects.sqlite.pysqlite.SQLiteDialect_pysqlite, dialect_attr, dbapi
    )

    # Create and use a unique tracking URI for this test. This avoids an issue
    # where an earlier test has already created and cached a SQLAlchemy engine
    # (i.e. database connections), preventing our error-throwing monkeypatches
    # from being called.
    monkeypatch.setenv(MLFLOW_TRACKING_URI.name, f"{MLFLOW_TRACKING_URI.get()}-{uuid.uuid4().hex}")
    with mock.patch("mlflow.store.db.utils._logger.exception") as exception:
        with pytest.raises(mlflow.MlflowException, match=r"sqlite3\.OperationalError"):
            with mlflow.start_run():
                # This statement will fail with an OperationalError.
                mlflow.log_param(
                    "test_database_operational_error_1667938883_param",
                    "test_database_operational_error_1667938883_value",
                )
        # Verify that the error handling was executed.
        assert any(
            "SQLAlchemy database error" in str(call) and "sqlite3.OperationalError" in str(call)
            for call in exception.mock_calls
        )
```

--------------------------------------------------------------------------------

---[FILE: update_schemas.sh]---
Location: mlflow-master/tests/db/update_schemas.sh

```bash
#!/bin/bash
set -ex

uv run tests/store/dump_schema.py tests/resources/db/latest_schema.sql

./tests/db/compose.sh down --volumes --remove-orphans
./tests/db/compose.sh build --build-arg DEPENDENCIES="$(uv run dev/extract_deps.py)"
for service in $(./tests/db/compose.sh config --services | grep '^mlflow-')
do
  ./tests/db/compose.sh run --rm $service python tests/db/test_schema.py
done
```

--------------------------------------------------------------------------------

````
