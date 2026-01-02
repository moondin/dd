---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 678
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 678 of 991)

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

---[FILE: a1b2c3d4e5f6_add_spans_table.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/a1b2c3d4e5f6_add_spans_table.py
Signals: SQLAlchemy

```python
"""add spans table

Create Date: 2025-08-03 12:00:00.000000

"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects.mysql import LONGTEXT

from mlflow.store.tracking.dbmodels.models import SqlSpan

# revision identifiers, used by Alembic.
revision = "a1b2c3d4e5f6"
down_revision = "770bee3ae1dd"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        SqlSpan.__tablename__,
        sa.Column("trace_id", sa.String(length=50), nullable=False),
        sa.Column("experiment_id", sa.Integer(), nullable=False),
        sa.Column("span_id", sa.String(length=50), nullable=False),
        sa.Column("parent_span_id", sa.String(length=50), nullable=True),
        sa.Column("name", sa.Text(), nullable=True),
        # Use String instead of Text for type column to support MSSQL indexes.
        # MSSQL doesn't allow TEXT columns in indexes. Limited to 500 chars
        # to stay within MySQL's max index key length of 3072 bytes.
        sa.Column("type", sa.String(length=500), nullable=True),
        sa.Column("status", sa.String(length=50), nullable=False),
        sa.Column("start_time_unix_nano", sa.BigInteger(), nullable=False),
        sa.Column("end_time_unix_nano", sa.BigInteger(), nullable=True),
        sa.Column(
            "duration_ns",
            sa.BigInteger(),
            sa.Computed("end_time_unix_nano - start_time_unix_nano", persisted=True),
            nullable=True,
        ),
        # Use LONGTEXT for MySQL to support large span content (up to 4GB).
        # Standard TEXT in MySQL is limited to 64KB which is insufficient for
        # spans with extensive attributes, events, or nested data structures.
        sa.Column("content", sa.Text().with_variant(LONGTEXT, "mysql"), nullable=False),
        sa.ForeignKeyConstraint(
            ["trace_id"],
            ["trace_info.request_id"],
            name="fk_spans_trace_id",
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["experiment_id"],
            ["experiments.experiment_id"],
            name="fk_spans_experiment_id",
        ),
        sa.PrimaryKeyConstraint("trace_id", "span_id", name="spans_pk"),
    )

    with op.batch_alter_table(SqlSpan.__tablename__, schema=None) as batch_op:
        batch_op.create_index(
            f"index_{SqlSpan.__tablename__}_experiment_id",
            ["experiment_id"],
            unique=False,
        )
        # Two indexes needed to support both filter patterns efficiently:
        batch_op.create_index(
            f"index_{SqlSpan.__tablename__}_experiment_id_status_type",
            ["experiment_id", "status", "type"],
            unique=False,
        )  # For status-only and status+type filters
        batch_op.create_index(
            f"index_{SqlSpan.__tablename__}_experiment_id_type_status",
            ["experiment_id", "type", "status"],
            unique=False,
        )  # For type-only and type+status filters
        batch_op.create_index(
            f"index_{SqlSpan.__tablename__}_experiment_id_duration",
            ["experiment_id", "duration_ns"],
            unique=False,
        )


def downgrade():
    op.drop_table(SqlSpan.__tablename__)
```

--------------------------------------------------------------------------------

---[FILE: a8c4a736bde6_allow_nulls_for_run_id.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/a8c4a736bde6_allow_nulls_for_run_id.py
Signals: SQLAlchemy

```python
"""allow nulls for run_id

Create Date: 2020-12-02 12:14:35.220815

"""

import sqlalchemy as sa
from alembic import op

from mlflow.store.model_registry.dbmodels.models import SqlModelVersion

# revision identifiers, used by Alembic.
revision = "a8c4a736bde6"
down_revision = "84291f40a231"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table(SqlModelVersion.__tablename__) as batch_op:
        batch_op.alter_column("run_id", nullable=True, existing_type=sa.VARCHAR(32))


def downgrade():
    pass
```

--------------------------------------------------------------------------------

---[FILE: acf3f17fdcc7_add_storage_location_field_to_model_.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/acf3f17fdcc7_add_storage_location_field_to_model_.py
Signals: SQLAlchemy

```python
"""add storage location field to model versions

Create Date: 2023-10-23 15:26:53.062080

"""

import sqlalchemy as sa
from alembic import op

from mlflow.store.model_registry.dbmodels.models import SqlModelVersion

# revision identifiers, used by Alembic.
revision = "acf3f17fdcc7"
down_revision = "2d6e25af4d3e"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        SqlModelVersion.__tablename__,
        sa.Column("storage_location", sa.String(500), nullable=True, default=None),
    )


def downgrade():
    pass
```

--------------------------------------------------------------------------------

---[FILE: b7c8d9e0f1a2_add_trace_metrics_table.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/b7c8d9e0f1a2_add_trace_metrics_table.py
Signals: SQLAlchemy

```python
"""add trace metrics table

Create Date: 2025-12-04 12:00:00.000000

"""

import sqlalchemy as sa
from alembic import op

from mlflow.store.tracking.dbmodels.models import SqlTraceMetrics

# revision identifiers, used by Alembic.
revision = "b7c8d9e0f1a2"
down_revision = "1bd49d398cd23"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        SqlTraceMetrics.__tablename__,
        sa.Column("request_id", sa.String(length=50), nullable=False),
        sa.Column("key", sa.String(length=250), nullable=False),
        sa.Column("value", sa.Float(precision=53), nullable=True),
        sa.ForeignKeyConstraint(
            ["request_id"],
            ["trace_info.request_id"],
            name="fk_trace_metrics_request_id",
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("request_id", "key", name="trace_metrics_pk"),
    )

    # Add index on request_id for faster lookups
    with op.batch_alter_table(SqlTraceMetrics.__tablename__, schema=None) as batch_op:
        batch_op.create_index(
            f"index_{SqlTraceMetrics.__tablename__}_request_id",
            ["request_id"],
            unique=False,
        )


def downgrade():
    op.drop_table(SqlTraceMetrics.__tablename__)
```

--------------------------------------------------------------------------------

---[FILE: bd07f7e963c5_create_index_on_run_uuid.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/bd07f7e963c5_create_index_on_run_uuid.py

```python
"""create index on run_uuid

Create Date: 2022-03-03 10:14:34.037978

"""

from alembic import op

# revision identifiers, used by Alembic.
revision = "bd07f7e963c5"
down_revision = "c48cb773bb87"
branch_labels = None
depends_on = None


def upgrade():
    # As a fix for https://github.com/mlflow/mlflow/issues/3785, create an index on run_uuid columns
    # that have a foreign key constraint to speed up SQL operations.
    for table in ["params", "metrics", "latest_metrics", "tags"]:
        op.create_index(f"index_{table}_run_uuid", table, ["run_uuid"])


def downgrade():
    pass
```

--------------------------------------------------------------------------------

---[FILE: bda7b8c39065_increase_model_version_tag_value_limit.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/bda7b8c39065_increase_model_version_tag_value_limit.py
Signals: SQLAlchemy

```python
"""increase_model_version_tag_value_limit

Create Date: 2025-06-23 11:05:41.676297

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "bda7b8c39065"
down_revision = "6953534de441"
branch_labels = None
depends_on = None


def upgrade():
    # Use batch mode for SQLite compatibility
    with op.batch_alter_table("model_version_tags") as batch_op:
        # Increase value column from VARCHAR(5000) to TEXT (unlimited)
        # We use Text type which maps appropriately for each database:
        # - PostgreSQL: TEXT (up to 1GB)
        # - MySQL: TEXT (up to 65,535 bytes) or LONGTEXT if needed
        # - SQLite: TEXT (no limit)
        # - MSSQL: VARCHAR(MAX) (up to 2GB)
        batch_op.alter_column(
            "value",
            existing_type=sa.String(5000),
            type_=sa.Text(),
            existing_nullable=True,
            existing_server_default=None,
        )


def downgrade():
    pass
```

--------------------------------------------------------------------------------

---[FILE: bf29a5ff90ea_add_jobs_table.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/bf29a5ff90ea_add_jobs_table.py
Signals: SQLAlchemy

```python
"""add jobs table

Create Date: 2025-09-11 17:39:31.569736

"""

import time

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "bf29a5ff90ea"
down_revision = "3da73c924c2f"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "jobs",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column(
            "creation_time",
            sa.BigInteger(),
            default=lambda: int(time.time() * 1000),
            nullable=False,
        ),
        sa.Column("function_fullname", sa.String(length=500), nullable=False),
        sa.Column("params", sa.Text(), nullable=False),
        sa.Column("timeout", sa.Float(precision=53), nullable=True),
        sa.Column("status", sa.Integer(), nullable=False),
        sa.Column("result", sa.Text(), nullable=True),
        sa.Column("retry_count", sa.Integer(), default=0, nullable=False),
        sa.Column(
            "last_update_time",
            sa.BigInteger(),
            default=lambda: int(time.time() * 1000),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id", name="jobs_pk"),
    )
    with op.batch_alter_table("jobs", schema=None) as batch_op:
        batch_op.create_index(
            "index_jobs_function_status_creation_time",
            ["function_fullname", "status", "creation_time"],
            unique=False,
        )


def downgrade():
    op.drop_table("jobs")
```

--------------------------------------------------------------------------------

---[FILE: c48cb773bb87_reset_default_value_for_is_nan_in_metrics_table_for_mysql.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/c48cb773bb87_reset_default_value_for_is_nan_in_metrics_table_for_mysql.py
Signals: SQLAlchemy

```python
"""reset_default_value_for_is_nan_in_metrics_table_for_mysql

Create Date: 2021-04-02 15:43:28.466043

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "c48cb773bb87"
down_revision = "39d1c3be5f05"
branch_labels = None
depends_on = None


def upgrade():
    # This part of the migration is only relevant for MySQL.
    # In 39d1c3be5f05_add_is_nan_constraint_for_metrics_tables_if_necessary.py
    # (added in MLflow 1.15.0), `alter_column` is called on the `is_nan` column in the `metrics`
    # table without specifying `existing_server_default`. This alters the column default value to
    # NULL in MySQL (see the doc below).
    #
    # https://alembic.sqlalchemy.org/en/latest/ops.html#alembic.operations.Operations.alter_column
    #
    # To revert this change, set the default column value to "0" by specifying `server_default`
    bind = op.get_bind()
    if bind.engine.name == "mysql":
        with op.batch_alter_table("metrics") as batch_op:
            batch_op.alter_column(
                "is_nan",
                type_=sa.types.Boolean(create_constraint=True),
                nullable=False,
                server_default="0",
            )


def downgrade():
    pass
```

--------------------------------------------------------------------------------

---[FILE: cbc13b556ace_add_v3_trace_schema_columns.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/cbc13b556ace_add_v3_trace_schema_columns.py
Signals: SQLAlchemy

```python
"""add V3 trace schema columns

Create Date: 2025-06-17 12:00:00.000000

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "cbc13b556ace"
down_revision = "bda7b8c39065"
branch_labels = None
depends_on = None


def upgrade():
    # Add V3 specific columns to trace_info table
    with op.batch_alter_table("trace_info", schema=None) as batch_op:
        batch_op.add_column(sa.Column("client_request_id", sa.String(length=50), nullable=True))
        batch_op.add_column(sa.Column("request_preview", sa.String(length=1000), nullable=True))
        batch_op.add_column(sa.Column("response_preview", sa.String(length=1000), nullable=True))


def downgrade():
    with op.batch_alter_table("trace_info", schema=None) as batch_op:
        batch_op.drop_column("response_preview")
        batch_op.drop_column("request_preview")
        batch_op.drop_column("client_request_id")
```

--------------------------------------------------------------------------------

---[FILE: cc1f77228345_change_param_value_length_to_500.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/cc1f77228345_change_param_value_length_to_500.py
Signals: SQLAlchemy

```python
"""change param value length to 500

Create Date: 2022-08-04 22:40:56.960003

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "cc1f77228345"
down_revision = "0c779009ac13"
branch_labels = None
depends_on = None


def upgrade():
    """
    Enlarge the maximum param value length to 500.
    """
    with op.batch_alter_table("params") as batch_op:
        batch_op.alter_column(
            "value",
            existing_type=sa.String(250),
            type_=sa.String(500),
            existing_nullable=False,
            nullable=False,
        )


def downgrade():
    pass
```

--------------------------------------------------------------------------------

---[FILE: cfd24bdc0731_update_run_status_constraint_with_killed.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/cfd24bdc0731_update_run_status_constraint_with_killed.py
Signals: SQLAlchemy

```python
"""Update run status constraint with killed

Create Date: 2019-10-11 15:55:10.853449

"""

import alembic
from alembic import op
from packaging.version import Version
from sqlalchemy import CheckConstraint, Enum

from mlflow.entities import RunStatus, ViewType
from mlflow.entities.lifecycle_stage import LifecycleStage
from mlflow.store.tracking.dbmodels.models import SourceTypes, SqlRun

# revision identifiers, used by Alembic.
revision = "cfd24bdc0731"
down_revision = "2b4d017a5e9b"
branch_labels = None
depends_on = None

old_run_statuses = [
    RunStatus.to_string(RunStatus.SCHEDULED),
    RunStatus.to_string(RunStatus.FAILED),
    RunStatus.to_string(RunStatus.FINISHED),
    RunStatus.to_string(RunStatus.RUNNING),
]

new_run_statuses = [*old_run_statuses, RunStatus.to_string(RunStatus.KILLED)]

# Certain SQL backends (e.g., SQLite) do not preserve CHECK constraints during migrations.
# For these backends, CHECK constraints must be specified as table arguments. Here, we define
# the collection of CHECK constraints that should be preserved when performing the migration.
# The "status" constraint is excluded from this set because it is explicitly modified
# within the migration's `upgrade()` routine.
check_constraint_table_args = [
    CheckConstraint(SqlRun.source_type.in_(SourceTypes), name="source_type"),
    CheckConstraint(
        SqlRun.lifecycle_stage.in_(LifecycleStage.view_type_to_stages(ViewType.ALL)),
        name="runs_lifecycle_stage",
    ),
]


def upgrade():
    # In alembic >= 1.7.0, `table_args` is unnecessary since CHECK constraints are preserved
    # during migrations.
    table_args = (
        [] if Version(alembic.__version__) >= Version("1.7.0") else check_constraint_table_args
    )
    with op.batch_alter_table("runs", table_args=table_args) as batch_op:
        # Transform the "status" column to an `Enum` and define a new check constraint. Specify
        # `native_enum=False` to create a check constraint rather than a
        # database-backend-dependent enum (see https://docs.sqlalchemy.org/en/13/core/
        # type_basics.html#sqlalchemy.types.Enum.params.native_enum)
        batch_op.alter_column(
            "status",
            type_=Enum(
                *new_run_statuses,
                create_constraint=True,
                native_enum=False,
            ),
            existing_type=Enum(
                *old_run_statuses,
                create_constraint=True,
                native_enum=False,
                name="status",
            ),
        )


def downgrade():
    # Omit downgrade logic for now - we don't currently provide users a command/API for
    # reverting a database migration, instead recommending that they take a database backup
    # before running the migration.
    pass
```

--------------------------------------------------------------------------------

---[FILE: de4033877273_create_entity_associations.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/de4033877273_create_entity_associations.py
Signals: SQLAlchemy

```python
"""create entity_associations table

Create Date: 2025-07-28 13:05:53.982327

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "de4033877273"
down_revision = "a1b2c3d4e5f6"
branch_labels = None
depends_on = None


def upgrade():
    # Create entity_associations table
    op.create_table(
        "entity_associations",
        sa.Column("association_id", sa.String(36), nullable=False),
        sa.Column("source_type", sa.String(36), nullable=False),
        sa.Column("source_id", sa.String(36), nullable=False),
        sa.Column("destination_type", sa.String(36), nullable=False),
        sa.Column("destination_id", sa.String(36), nullable=False),
        sa.Column("created_time", sa.BigInteger(), nullable=True),
        sa.PrimaryKeyConstraint(
            "source_type",
            "source_id",
            "destination_type",
            "destination_id",
            name="entity_associations_pk",
        ),
    )

    # Create indexes on entity_associations
    with op.batch_alter_table("entity_associations", schema=None) as batch_op:
        batch_op.create_index(
            "index_entity_associations_association_id",
            ["association_id"],
            unique=False,
        )
        batch_op.create_index(
            "index_entity_associations_reverse_lookup",
            ["destination_type", "destination_id", "source_type", "source_id"],
            unique=False,
        )


def downgrade():
    # Drop tables in reverse order to respect foreign key constraints
    op.drop_table("entity_associations")
```

--------------------------------------------------------------------------------

---[FILE: df50e92ffc5e_add_experiment_tags_table.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/df50e92ffc5e_add_experiment_tags_table.py
Signals: SQLAlchemy

```python
"""Add Experiment Tags Table

Create Date: 2019-07-15 17:46:42.704214

"""

import sqlalchemy as sa
from alembic import op

from mlflow.store.tracking.dbmodels.models import SqlExperimentTag

# revision identifiers, used by Alembic.
revision = "df50e92ffc5e"
down_revision = "181f10493468"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        SqlExperimentTag.__tablename__,
        sa.Column("key", sa.String(length=250), primary_key=True, nullable=False),
        sa.Column("value", sa.String(length=5000)),
        sa.Column(
            "experiment_id",
            sa.Integer(),
            sa.ForeignKey("experiments.experiment_id"),
            primary_key=True,
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("key", "experiment_id", name="experiment_tag_pk"),
    )


def downgrade():
    pass
```

--------------------------------------------------------------------------------

---[FILE: f5a4f2784254_increase_run_tag_value_limit.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/f5a4f2784254_increase_run_tag_value_limit.py
Signals: SQLAlchemy

```python
"""increase run tag value limit to 8000

Create Date: 2024-09-18 08:53:51.552934

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "f5a4f2784254"
down_revision = "4465047574b1"
branch_labels = None
depends_on = None


def upgrade():
    # Use batch mode so that we can run "ALTER TABLE" statements against SQLite
    # databases (see more info at https://alembic.sqlalchemy.org/en/latest/
    # batch.html#running-batch-migrations-for-sqlite-and-other-databases)
    # We specify existing_type, existing_nullable, existing_server_default
    # because MySQL alter column statements require a full column description.
    with op.batch_alter_table("tags") as batch_op:
        batch_op.alter_column(
            "value",
            existing_type=sa.String(5000),
            type_=sa.String(8000),
            existing_nullable=True,
            existing_server_default=None,
        )


def downgrade():
    pass
```

--------------------------------------------------------------------------------

---[FILE: paged_list.py]---
Location: mlflow-master/mlflow/store/entities/paged_list.py

```python
from typing import TypeVar

T = TypeVar("T")


class PagedList(list[T]):
    """
    Wrapper class around the base Python `List` type. Contains an additional `token`  string
    attribute that can be passed to the pagination API that returned this list to fetch additional
    elements, if any are available
    """

    def __init__(self, items: list[T], token):
        super().__init__(items)
        self.token = token

    def to_list(self):
        return list(self)
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/store/entities/__init__.py

```python
from mlflow.store.entities.paged_list import PagedList

__all__ = ["PagedList"]
```

--------------------------------------------------------------------------------

---[FILE: abstract_store.py]---
Location: mlflow-master/mlflow/store/jobs/abstract_store.py

```python
from abc import ABC, abstractmethod
from typing import Any, Iterator

from mlflow.entities._job import Job
from mlflow.entities._job_status import JobStatus
from mlflow.utils.annotations import developer_stable


@developer_stable
class AbstractJobStore(ABC):
    """
    Abstract class that defines API interfaces for storing Job metadata.
    """

    @abstractmethod
    def create_job(self, job_name: str, params: str, timeout: float | None = None) -> Job:
        """
        Create a new job with the specified function and parameters.

        Args:
            job_name: The static job name that identifies the decorated job function
            params: The job parameters that are serialized as a JSON string
            timeout: The job execution timeout in seconds

        Returns:
            Job entity instance
        """

    @abstractmethod
    def start_job(self, job_id: str) -> None:
        """
        Start a job by setting its status to RUNNING.

        Args:
            job_id: The ID of the job to start
        """

    @abstractmethod
    def reset_job(self, job_id: str) -> None:
        """
        Reset a job by setting its status to PENDING.

        Args:
            job_id: The ID of the job to re-enqueue.
        """

    @abstractmethod
    def finish_job(self, job_id: str, result: str) -> None:
        """
        Finish a job by setting its status to DONE and setting the result.

        Args:
            job_id: The ID of the job to finish
            result: The job result as a string
        """

    @abstractmethod
    def mark_job_timed_out(self, job_id: str) -> None:
        """
        Set a job status to Timeout.

        Args:
            job_id: The ID of the job
        """

    @abstractmethod
    def fail_job(self, job_id: str, error: str) -> None:
        """
        Fail a job by setting its status to FAILED and setting the error message.

        Args:
            job_id: The ID of the job to fail
            error: The error message as a string
        """

    @abstractmethod
    def retry_or_fail_job(self, job_id: str, error: str) -> int | None:
        """
        If the job retry_count is less than maximum allowed retry count,
        increment the retry_count and reset the job to PENDING status,
        otherwise set the job to FAILED status and fill the job's error field.

        Args:
            job_id: The ID of the job to fail
            error: The error message as a string

        Returns:
            If the job is allowed to retry, returns the retry count,
            otherwise returns None.
        """

    @abstractmethod
    def list_jobs(
        self,
        job_name: str | None = None,
        statuses: list[JobStatus] | None = None,
        begin_timestamp: int | None = None,
        end_timestamp: int | None = None,
        params: dict[str, Any] | None = None,
    ) -> Iterator[Job]:
        """
        List jobs based on the provided filters.

        Args:
            job_name: Filter by job name (exact match)
            statuses: Filter by a list of job status (PENDING, RUNNING, DONE, FAILED, TIMEOUT)
            begin_timestamp: Filter jobs created after this timestamp (inclusive)
            end_timestamp: Filter jobs created before this timestamp (inclusive)
            params: Filter jobs by matching job params dict with the provided params dict
                e.g., if `params` is ``{'a': 3, 'b': 4}``, it can match the following job params:
                ``{'a': 3, 'b': 4}``, ``{'a': 3, 'b': 4, 'c': 5}``, but it does not match the
                following job params: ``{'a': 3, 'b': 6}``, ``{'a': 3, 'c': 5}``.

        Returns:
            Iterator of Job entities that match the filters, ordered by creation time (oldest first)
        """

    @abstractmethod
    def get_job(self, job_id: str) -> Job:
        """
        Get a job by its ID.

        Args:
            job_id: The ID of the job to retrieve

        Returns:
            Job entity

        Raises:
            MlflowException: If job with the given ID is not found
        """
```

--------------------------------------------------------------------------------

---[FILE: sqlalchemy_store.py]---
Location: mlflow-master/mlflow/store/jobs/sqlalchemy_store.py
Signals: SQLAlchemy

```python
import json
import threading
import uuid
from typing import Any, Iterator

import sqlalchemy

from mlflow.entities._job import Job
from mlflow.entities._job_status import JobStatus
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import RESOURCE_DOES_NOT_EXIST
from mlflow.store.db.utils import (
    _get_managed_session_maker,
    _safe_initialize_tables,
    create_sqlalchemy_engine_with_retry,
)
from mlflow.store.jobs.abstract_store import AbstractJobStore
from mlflow.store.tracking.dbmodels.models import SqlJob
from mlflow.utils.time import get_current_time_millis
from mlflow.utils.uri import extract_db_type_from_uri

sqlalchemy.orm.configure_mappers()

_LIST_JOB_PAGE_SIZE = 100


class SqlAlchemyJobStore(AbstractJobStore):
    """
    SQLAlchemy compliant backend store for storing Job metadata.
    This store interacts with SQL store using SQLAlchemy abstractions defined
    for MLflow Job entities.
    """

    # Class-level cache for SQLAlchemy engines to prevent connection pool leaks
    # when multiple store instances are created with the same database URI.
    _engine_map: dict[str, sqlalchemy.engine.Engine] = {}
    _engine_map_lock = threading.Lock()

    @classmethod
    def _get_or_create_engine(cls, db_uri: str) -> sqlalchemy.engine.Engine:
        """Get a cached engine or create a new one for the given database URI."""
        if db_uri not in cls._engine_map:
            with cls._engine_map_lock:
                if db_uri not in cls._engine_map:
                    cls._engine_map[db_uri] = create_sqlalchemy_engine_with_retry(db_uri)
        return cls._engine_map[db_uri]

    def __init__(self, db_uri):
        """
        Create a database backed store.

        Args:
            db_uri: The SQLAlchemy database URI string to connect to the database.
        """
        super().__init__()
        self.db_uri = db_uri
        self.db_type = extract_db_type_from_uri(db_uri)
        self.engine = self._get_or_create_engine(db_uri)
        _safe_initialize_tables(self.engine)

        SessionMaker = sqlalchemy.orm.sessionmaker(bind=self.engine)
        self.ManagedSessionMaker = _get_managed_session_maker(SessionMaker, self.db_type)

    def create_job(self, job_name: str, params: str, timeout: float | None = None) -> Job:
        """
        Create a new job with the specified function and parameters.

        Args:
            job_name: The static job name that identifies the decorated job function
            params: The job parameters that are serialized as a JSON string
            timeout: The job execution timeout in seconds

        Returns:
            Job entity instance
        """
        with self.ManagedSessionMaker() as session:
            job_id = str(uuid.uuid4())
            creation_time = get_current_time_millis()

            job = SqlJob(
                id=job_id,
                creation_time=creation_time,
                job_name=job_name,
                params=params,
                timeout=timeout,
                status=JobStatus.PENDING.to_int(),
                result=None,
                last_update_time=creation_time,
            )

            session.add(job)
            session.flush()
            return job.to_mlflow_entity()

    def _update_job(self, job_id: str, new_status: JobStatus, result: str | None = None) -> None:
        with self.ManagedSessionMaker() as session:
            job = self._get_sql_job(session, job_id)

            job.status = new_status.to_int()
            if result is not None:
                job.result = result
            job.last_update_time = get_current_time_millis()

    def start_job(self, job_id: str) -> None:
        """
        Start a job by setting its status to RUNNING.
        Only succeeds if the job is currently in PENDING state.

        Args:
            job_id: The ID of the job to start

        Raises:
            MlflowException: If job is not in PENDING state or doesn't exist
        """
        with self.ManagedSessionMaker() as session:
            # Atomic update: only transition from PENDING to RUNNING
            rows_updated = (
                session.query(SqlJob)
                .filter(SqlJob.id == job_id, SqlJob.status == JobStatus.PENDING.to_int())
                .update(
                    {
                        SqlJob.status: JobStatus.RUNNING.to_int(),
                        SqlJob.last_update_time: get_current_time_millis(),
                    }
                )
            )

            if rows_updated == 0:
                job = session.query(SqlJob).filter(SqlJob.id == job_id).one_or_none()
                if job is None:
                    raise MlflowException(
                        f"Job with ID {job_id} not found", error_code=RESOURCE_DOES_NOT_EXIST
                    )
                raise MlflowException(
                    f"Job {job_id} is in {JobStatus.from_int(job.status)} state, "
                    "cannot start (must be PENDING)"
                )

    def reset_job(self, job_id: str) -> None:
        """
        Reset a job by setting its status to PENDING.

        Args:
            job_id: The ID of the job to re-enqueue.
        """
        self._update_job(job_id, JobStatus.PENDING)

    def finish_job(self, job_id: str, result: str) -> None:
        """
        Finish a job by setting its status to DONE and setting the result.

        Args:
            job_id: The ID of the job to finish
            result: The job result as a string
        """
        self._update_job(job_id, JobStatus.SUCCEEDED, result)

    def fail_job(self, job_id: str, error: str) -> None:
        """
        Fail a job by setting its status to FAILED and setting the error message.

        Args:
            job_id: The ID of the job to fail
            error: The error message as a string
        """
        self._update_job(job_id, JobStatus.FAILED, error)

    def mark_job_timed_out(self, job_id: str) -> None:
        """
        Set a job status to Timeout.

        Args:
            job_id: The ID of the job
        """
        self._update_job(job_id, JobStatus.TIMEOUT)

    def retry_or_fail_job(self, job_id: str, error: str) -> int | None:
        """
        If the job retry_count is less than maximum allowed retry count,
        increment the retry_count and reset the job to PENDING status,
        otherwise set the job to FAILED status and fill the job's error field.

        Args:
            job_id: The ID of the job to fail
            error: The error message as a string

        Returns:
            If the job is allowed to retry, returns the retry count,
            otherwise returns None.
        """
        from mlflow.environment_variables import MLFLOW_SERVER_JOB_TRANSIENT_ERROR_MAX_RETRIES

        max_retries = MLFLOW_SERVER_JOB_TRANSIENT_ERROR_MAX_RETRIES.get()

        with self.ManagedSessionMaker() as session:
            job = self._get_sql_job(session, job_id)

            if job.retry_count >= max_retries:
                job.status = JobStatus.FAILED.to_int()
                job.result = error
                return None
            job.retry_count += 1
            job.status = JobStatus.PENDING.to_int()
            job.last_update_time = get_current_time_millis()
            return job.retry_count

    def list_jobs(
        self,
        job_name: str | None = None,
        statuses: list[JobStatus] | None = None,
        begin_timestamp: int | None = None,
        end_timestamp: int | None = None,
        params: dict[str, Any] | None = None,
    ) -> Iterator[Job]:
        """
        List jobs based on the provided filters.

        Args:
            job_name: Filter by job name (exact match)
            statuses: Filter by a list of job status (PENDING, RUNNING, DONE, FAILED, TIMEOUT)
            begin_timestamp: Filter jobs created after this timestamp (inclusive)
            end_timestamp: Filter jobs created before this timestamp (inclusive)
            params: Filter jobs by matching job params dict with the provided params dict.
                e.g., if `params` is ``{'a': 3, 'b': 4}``, it can match the following job params:
                ``{'a': 3, 'b': 4}``, ``{'a': 3, 'b': 4, 'c': 5}``, but it does not match the
                following job params: ``{'a': 3, 'b': 6}``, ``{'a': 3, 'c': 5}``.

        Returns:
            Iterator of Job entities that match the filters, ordered by creation time (oldest first)
        """
        offset = 0

        def filter_by_params(job_params: dict[str, Any]) -> bool:
            for key in params:
                if key in job_params:
                    if job_params[key] != params[key]:
                        return False
                else:
                    return False
            return True

        while True:
            with self.ManagedSessionMaker() as session:
                # Select all columns needed for Job entity
                query = session.query(SqlJob)

                # Apply filters
                if job_name is not None:
                    query = query.filter(SqlJob.job_name == job_name)

                if statuses:
                    query = query.filter(
                        SqlJob.status.in_([status.to_int() for status in statuses])
                    )

                if begin_timestamp is not None:
                    query = query.filter(SqlJob.creation_time >= begin_timestamp)

                if end_timestamp is not None:
                    query = query.filter(SqlJob.creation_time <= end_timestamp)

                # Order by creation time (oldest first) and apply pagination
                jobs = (
                    query.order_by(SqlJob.creation_time)
                    .offset(offset)
                    .limit(_LIST_JOB_PAGE_SIZE)
                    .all()
                )

                # If no jobs returned, we've reached the end
                if not jobs:
                    break

                # Yield each job
                if params:
                    for job in jobs:
                        if filter_by_params(json.loads(job.params)):
                            yield job.to_mlflow_entity()
                else:
                    for job in jobs:
                        yield job.to_mlflow_entity()

                # If we got fewer jobs than page_size, we've reached the end
                if len(jobs) < _LIST_JOB_PAGE_SIZE:
                    break

                # Move to next page
                offset += _LIST_JOB_PAGE_SIZE

    def _get_sql_job(self, session, job_id) -> SqlJob:
        job = session.query(SqlJob).filter(SqlJob.id == job_id).one_or_none()
        if job is None:
            raise MlflowException(
                f"Job with ID {job_id} not found", error_code=RESOURCE_DOES_NOT_EXIST
            )
        return job

    def get_job(self, job_id: str) -> Job:
        """
        Get a job by its ID.

        Args:
            job_id: The ID of the job to retrieve

        Returns:
            Job entity

        Raises:
            MlflowException: If job with the given ID is not found
        """
        with self.ManagedSessionMaker() as session:
            job = self._get_sql_job(session, job_id)
            if job is None:
                raise MlflowException(
                    f"Job with ID {job_id} not found", error_code=RESOURCE_DOES_NOT_EXIST
                )
            return job.to_mlflow_entity()
```

--------------------------------------------------------------------------------

````
