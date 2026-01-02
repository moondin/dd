---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 677
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 677 of 991)

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

---[FILE: 400f98739977_add_logged_model_tables.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/400f98739977_add_logged_model_tables.py
Signals: SQLAlchemy

```python
"""add logged model tables

Create Date: 2025-02-06 22:05:35.542613

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "400f98739977"
down_revision = "0584bdc529eb"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "logged_models",
        sa.Column("model_id", sa.String(length=36), nullable=False),
        sa.Column("experiment_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=500), nullable=False),
        sa.Column("artifact_location", sa.String(length=1000), nullable=False),
        sa.Column("creation_timestamp_ms", sa.BigInteger(), nullable=False),
        sa.Column("last_updated_timestamp_ms", sa.BigInteger(), nullable=False),
        sa.Column("status", sa.Integer(), nullable=False),
        sa.Column("lifecycle_stage", sa.String(length=32), nullable=True),
        sa.Column("model_type", sa.String(length=500), nullable=True),
        sa.Column("source_run_id", sa.String(length=32), nullable=True),
        sa.Column("status_message", sa.String(length=1000), nullable=True),
        sa.CheckConstraint(
            "lifecycle_stage IN ('active', 'deleted')", name="logged_models_lifecycle_stage_check"
        ),
        sa.ForeignKeyConstraint(
            ["experiment_id"],
            ["experiments.experiment_id"],
            name="fk_logged_models_experiment_id",
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("model_id", name="logged_models_pk"),
    )
    op.create_table(
        "logged_model_metrics",
        sa.Column("model_id", sa.String(length=36), nullable=False),
        sa.Column("metric_name", sa.String(length=500), nullable=False),
        sa.Column("metric_timestamp_ms", sa.BigInteger(), nullable=False),
        sa.Column("metric_step", sa.BigInteger(), nullable=False),
        sa.Column("metric_value", sa.Float(precision=53), nullable=True),
        sa.Column("experiment_id", sa.Integer(), nullable=False),
        sa.Column("run_id", sa.String(length=32), nullable=False),
        sa.Column("dataset_uuid", sa.String(length=36), nullable=True),
        sa.Column("dataset_name", sa.String(length=500), nullable=True),
        sa.Column("dataset_digest", sa.String(length=36), nullable=True),
        sa.ForeignKeyConstraint(
            ["experiment_id"],
            ["experiments.experiment_id"],
            name="fk_logged_model_metrics_experiment_id",
        ),
        sa.ForeignKeyConstraint(
            ["model_id"],
            ["logged_models.model_id"],
            name="fk_logged_model_metrics_model_id",
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["run_id"], ["runs.run_uuid"], name="fk_logged_model_metrics_run_id", ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint(
            "model_id",
            "metric_name",
            "metric_timestamp_ms",
            "metric_step",
            "run_id",
            name="logged_model_metrics_pk",
        ),
    )
    with op.batch_alter_table("logged_model_metrics", schema=None) as batch_op:
        batch_op.create_index("index_logged_model_metrics_model_id", ["model_id"], unique=False)

    op.create_table(
        "logged_model_params",
        sa.Column("model_id", sa.String(length=36), nullable=False),
        sa.Column("experiment_id", sa.Integer(), nullable=False),
        sa.Column("param_key", sa.String(length=255), nullable=False),
        sa.Column("param_value", sa.Text(), nullable=False),
        sa.ForeignKeyConstraint(
            ["experiment_id"],
            ["experiments.experiment_id"],
            name="fk_logged_model_params_experiment_id",
        ),
        sa.ForeignKeyConstraint(
            ["model_id"],
            ["logged_models.model_id"],
            name="fk_logged_model_params_model_id",
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("model_id", "param_key", name="logged_model_params_pk"),
    )
    op.create_table(
        "logged_model_tags",
        sa.Column("model_id", sa.String(length=36), nullable=False),
        sa.Column("experiment_id", sa.Integer(), nullable=False),
        sa.Column("tag_key", sa.String(length=255), nullable=False),
        sa.Column("tag_value", sa.Text(), nullable=False),
        sa.ForeignKeyConstraint(
            ["experiment_id"],
            ["experiments.experiment_id"],
            name="fk_logged_model_tags_experiment_id",
        ),
        sa.ForeignKeyConstraint(
            ["model_id"],
            ["logged_models.model_id"],
            name="fk_logged_model_tags_model_id",
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("model_id", "tag_key", name="logged_model_tags_pk"),
    )


def downgrade():
    pass
```

--------------------------------------------------------------------------------

---[FILE: 4465047574b1_increase_max_dataset_schema_size.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/4465047574b1_increase_max_dataset_schema_size.py
Signals: SQLAlchemy

```python
"""increase max dataset schema size

Create Date: 2024-07-09 12:54:33.775087

"""

import logging

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects.mysql import MEDIUMTEXT

_logger = logging.getLogger(__name__)


# revision identifiers, used by Alembic.
revision = "4465047574b1"
down_revision = "5b0e9adcef9c"
branch_labels = None
depends_on = None


def upgrade():
    try:
        # For other database backends, the dataset_schema column already satisfies the new length
        if op.get_bind().engine.name == "mysql":
            op.alter_column("datasets", "dataset_schema", existing_type=sa.TEXT, type_=MEDIUMTEXT)
    except Exception as e:
        _logger.warning(
            "Failed to update dataset_schema column to MEDIUMTEXT type, it may not be supported "
            f"by your SQL database. Exception content: {e}"
        )


def downgrade():
    pass
```

--------------------------------------------------------------------------------

---[FILE: 451aebb31d03_add_metric_step.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/451aebb31d03_add_metric_step.py
Signals: SQLAlchemy

```python
"""add metric step

Create Date: 2019-04-22 15:29:24.921354

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "451aebb31d03"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("metrics", sa.Column("step", sa.BigInteger(), nullable=False, server_default="0"))
    # Use batch mode so that we can run "ALTER TABLE" statements against SQLite
    # databases (see more info at https://alembic.sqlalchemy.org/en/latest/
    # batch.html#running-batch-migrations-for-sqlite-and-other-databases)
    with op.batch_alter_table("metrics") as batch_op:
        batch_op.drop_constraint(constraint_name="metric_pk", type_="primary")
        batch_op.create_primary_key(
            constraint_name="metric_pk", columns=["key", "timestamp", "step", "run_uuid", "value"]
        )


def downgrade():
    # This migration cannot safely be downgraded; once metric data with the same
    # (key, timestamp, run_uuid, value) are inserted (differing only in their `step`), we cannot
    # revert to a schema where (key, timestamp, run_uuid, value) is the metric primary key.
    pass
```

--------------------------------------------------------------------------------

---[FILE: 534353b11cbc_add_scorer_table.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/534353b11cbc_add_scorer_table.py
Signals: SQLAlchemy

```python
"""add scorer tables

Create Date: 2025-01-27 10:00:00.000000

"""

import sqlalchemy as sa
from alembic import op

from mlflow.store.tracking.dbmodels.models import SqlScorer, SqlScorerVersion

# revision identifiers, used by Alembic.
revision = "534353b11cbc"
down_revision = "1a0cddfcaa16"
branch_labels = None
depends_on = None


def upgrade():
    # Create the scorers table (experiment_id, scorer_name, scorer_id)
    op.create_table(
        SqlScorer.__tablename__,
        sa.Column("experiment_id", sa.Integer(), nullable=False),
        sa.Column("scorer_name", sa.String(length=256), nullable=False),
        sa.Column("scorer_id", sa.String(length=36), nullable=False),
        sa.ForeignKeyConstraint(
            ["experiment_id"],
            ["experiments.experiment_id"],
            name="fk_scorers_experiment_id",
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("scorer_id", name="scorer_pk"),
    )

    # Create the scorer_versions table (scorer_id, scorer_version, serialized_scorer, creation_time)
    op.create_table(
        SqlScorerVersion.__tablename__,
        sa.Column("scorer_id", sa.String(length=36), nullable=False),
        sa.Column("scorer_version", sa.Integer(), nullable=False),
        sa.Column("serialized_scorer", sa.Text(), nullable=False),
        sa.Column("creation_time", sa.BigInteger(), nullable=True),
        sa.ForeignKeyConstraint(
            ["scorer_id"],
            ["scorers.scorer_id"],
            name="fk_scorer_versions_scorer_id",
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("scorer_id", "scorer_version", name="scorer_version_pk"),
    )

    # Create indexes
    with op.batch_alter_table(SqlScorer.__tablename__, schema=None) as batch_op:
        batch_op.create_index(
            f"index_{SqlScorer.__tablename__}_experiment_id_scorer_name",
            ["experiment_id", "scorer_name"],
            unique=True,
        )

    with op.batch_alter_table(SqlScorerVersion.__tablename__, schema=None) as batch_op:
        batch_op.create_index(
            f"index_{SqlScorerVersion.__tablename__}_scorer_id",
            ["scorer_id"],
            unique=False,
        )


def downgrade():
    op.drop_table(SqlScorerVersion.__tablename__)
    op.drop_table(SqlScorer.__tablename__)
```

--------------------------------------------------------------------------------

---[FILE: 5b0e9adcef9c_add_cascade_deletion_to_trace_tables_fk.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/5b0e9adcef9c_add_cascade_deletion_to_trace_tables_fk.py

```python
"""add cascade deletion to trace tables foreign keys

Create Date: 2024-05-22 17:44:24.597019

"""

from alembic import op

from mlflow.store.tracking.dbmodels.models import SqlTraceInfo, SqlTraceMetadata, SqlTraceTag

# revision identifiers, used by Alembic.
revision = "5b0e9adcef9c"
down_revision = "867495a8f9d4"
branch_labels = None
depends_on = None


def upgrade():
    tables = [SqlTraceTag.__tablename__, SqlTraceMetadata.__tablename__]
    for table in tables:
        fk_tag_constraint_name = f"fk_{table}_request_id"
        # We have to use batch_alter_table as SQLite does not support
        # ALTER outside of a batch operation.
        with op.batch_alter_table(table, schema=None) as batch_op:
            batch_op.drop_constraint(fk_tag_constraint_name, type_="foreignkey")
            batch_op.create_foreign_key(
                fk_tag_constraint_name,
                SqlTraceInfo.__tablename__,
                ["request_id"],
                ["request_id"],
                # Add cascade deletion to the foreign key constraint.
                # This is the only change in this migration.
                ondelete="CASCADE",
            )


def downgrade():
    pass
```

--------------------------------------------------------------------------------

---[FILE: 5d2d30f0abce_update_job_table.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/5d2d30f0abce_update_job_table.py
Signals: SQLAlchemy

```python
"""update job table

Create Date: 2025-12-16 16:31:47.921120

"""

from alembic import op
from sqlalchemy import String

# revision identifiers, used by Alembic.
revision = "5d2d30f0abce"
down_revision = "b7c8d9e0f1a2"
branch_labels = None
depends_on = None


def upgrade():
    # Rename column `function_fullname` -> `job_name` and update the related index
    with op.batch_alter_table("jobs", schema=None) as batch_op:
        # Drop old index that referenced `function_fullname`
        batch_op.drop_index("index_jobs_function_status_creation_time")
        # Rename the column
        batch_op.alter_column(
            "function_fullname", new_column_name="job_name", existing_type=String(500)
        )

    with op.batch_alter_table("jobs", schema=None) as batch_op:
        # Recreate the index referencing the new column name
        batch_op.create_index(
            "index_jobs_name_status_creation_time",
            ["job_name", "status", "creation_time"],
            unique=False,
        )


def downgrade():
    # Revert column rename `job_name` -> `function_fullname` and restore the original index
    with op.batch_alter_table("jobs", schema=None) as batch_op:
        batch_op.drop_index("index_jobs_name_status_creation_time")
        batch_op.alter_column(
            "job_name", new_column_name="function_fullname", existing_type=String(500)
        )

    with op.batch_alter_table("jobs", schema=None) as batch_op:
        batch_op.create_index(
            "index_jobs_function_status_creation_time",
            ["function_fullname", "status", "creation_time"],
            unique=False,
        )
```

--------------------------------------------------------------------------------

---[FILE: 6953534de441_add_step_to_inputs_table.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/6953534de441_add_step_to_inputs_table.py
Signals: SQLAlchemy

```python
"""add step to inputs table

Create Date: 2025-02-13 11:50:07.098121

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "6953534de441"
down_revision = "400f98739977"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("inputs", schema=None) as batch_op:
        batch_op.add_column(sa.Column("step", sa.BigInteger(), nullable=False, server_default="0"))


def downgrade():
    pass
```

--------------------------------------------------------------------------------

---[FILE: 71994744cf8e_add_evaluation_datasets.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/71994744cf8e_add_evaluation_datasets.py
Signals: SQLAlchemy

```python
"""add evaluation datasets

Revision ID: 71994744cf8e
Revises: 534353b11cbc
Create Date: 2025-08-12 14:30:00.000000

"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import mssql

# revision identifiers, used by Alembic.
revision = "71994744cf8e"
down_revision = "534353b11cbc"
branch_labels = None
depends_on = None


def _get_json_type():
    """Get appropriate JSON type for the current database."""
    dialect_name = op.get_bind().dialect.name
    if dialect_name == "mssql":
        # Use MSSQL-specific JSON type (stored as NVARCHAR(MAX))
        # This is available in SQLAlchemy 1.4+ and works with SQL Server 2016+
        return mssql.JSON
    else:
        # Use standard JSON type for other databases
        return sa.JSON


def upgrade():
    json_type = _get_json_type()

    # Create evaluation_datasets table
    op.create_table(
        "evaluation_datasets",
        sa.Column("dataset_id", sa.String(36), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        # Note: tags are stored in a separate table, not as JSON column
        sa.Column("schema", sa.Text(), nullable=True),
        sa.Column("profile", sa.Text(), nullable=True),
        sa.Column("digest", sa.String(64), nullable=True),
        sa.Column("created_time", sa.BigInteger(), nullable=True),
        sa.Column("last_update_time", sa.BigInteger(), nullable=True),
        sa.Column("created_by", sa.String(255), nullable=True),
        sa.Column("last_updated_by", sa.String(255), nullable=True),
        sa.PrimaryKeyConstraint("dataset_id", name="evaluation_datasets_pk"),
    )

    # Create indexes on evaluation_datasets
    with op.batch_alter_table("evaluation_datasets", schema=None) as batch_op:
        batch_op.create_index(
            "index_evaluation_datasets_name",
            ["name"],
            unique=False,
        )
        batch_op.create_index(
            "index_evaluation_datasets_created_time",
            ["created_time"],
            unique=False,
        )

    # Create evaluation_dataset_tags table
    op.create_table(
        "evaluation_dataset_tags",
        sa.Column("dataset_id", sa.String(36), nullable=False),
        sa.Column("key", sa.String(255), nullable=False),
        sa.Column("value", sa.String(5000), nullable=True),
        sa.PrimaryKeyConstraint("dataset_id", "key", name="evaluation_dataset_tags_pk"),
        sa.ForeignKeyConstraint(
            ["dataset_id"],
            ["evaluation_datasets.dataset_id"],
            name="fk_evaluation_dataset_tags_dataset_id",
            ondelete="CASCADE",
        ),
    )

    # Create indexes on evaluation_dataset_tags
    with op.batch_alter_table("evaluation_dataset_tags", schema=None) as batch_op:
        batch_op.create_index(
            "index_evaluation_dataset_tags_dataset_id",
            ["dataset_id"],
            unique=False,
        )

    # Create evaluation_dataset_records table
    op.create_table(
        "evaluation_dataset_records",
        sa.Column("dataset_record_id", sa.String(36), nullable=False),
        sa.Column("dataset_id", sa.String(36), nullable=False),
        sa.Column("inputs", json_type, nullable=False),
        sa.Column("expectations", json_type, nullable=True),
        sa.Column("tags", json_type, nullable=True),
        sa.Column("source", json_type, nullable=True),
        sa.Column("source_id", sa.String(36), nullable=True),
        sa.Column("source_type", sa.String(255), nullable=True),
        sa.Column("created_time", sa.BigInteger(), nullable=True),
        sa.Column("last_update_time", sa.BigInteger(), nullable=True),
        sa.Column("created_by", sa.String(255), nullable=True),
        sa.Column("last_updated_by", sa.String(255), nullable=True),
        sa.Column("input_hash", sa.String(64), nullable=False),
        sa.PrimaryKeyConstraint("dataset_record_id", name="evaluation_dataset_records_pk"),
        sa.ForeignKeyConstraint(
            ["dataset_id"],
            ["evaluation_datasets.dataset_id"],
            name="fk_evaluation_dataset_records_dataset_id",
            ondelete="CASCADE",
        ),
    )

    # Create indexes and unique constraint on evaluation_dataset_records
    with op.batch_alter_table("evaluation_dataset_records", schema=None) as batch_op:
        batch_op.create_index(
            "index_evaluation_dataset_records_dataset_id",
            ["dataset_id"],
            unique=False,
        )
        batch_op.create_unique_constraint(
            "unique_dataset_input",
            ["dataset_id", "input_hash"],
        )


def downgrade():
    # Drop tables in reverse order to respect foreign key constraints
    op.drop_table("evaluation_dataset_records")
    op.drop_table("evaluation_dataset_tags")
    op.drop_table("evaluation_datasets")
```

--------------------------------------------------------------------------------

---[FILE: 728d730b5ebd_add_registered_model_tags_table.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/728d730b5ebd_add_registered_model_tags_table.py
Signals: SQLAlchemy

```python
"""add registered model tags table

Create Date: 2020-06-26 13:30:00.290154

"""

import sqlalchemy as sa
from alembic import op

from mlflow.store.model_registry.dbmodels.models import SqlRegisteredModelTag

# revision identifiers, used by Alembic.
revision = "728d730b5ebd"
down_revision = "0a8213491aaa"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        SqlRegisteredModelTag.__tablename__,
        sa.Column("key", sa.String(length=250), primary_key=True, nullable=False),
        sa.Column("value", sa.String(length=5000)),
        sa.Column(
            "name",
            sa.String(length=256),
            sa.ForeignKey("registered_models.name", onupdate="cascade"),
            primary_key=True,
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("key", "name", name="registered_model_tag_pk"),
    )


def downgrade():
    pass
```

--------------------------------------------------------------------------------

---[FILE: 770bee3ae1dd_add_assessments_table.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/770bee3ae1dd_add_assessments_table.py
Signals: SQLAlchemy

```python
"""add assessments table

Create Date: 2025-06-23 11:26:19.855639

"""

import sqlalchemy as sa
from alembic import op

from mlflow.store.tracking.dbmodels.models import SqlAssessments

# revision identifiers, used by Alembic.
revision = "770bee3ae1dd"
down_revision = "cbc13b556ace"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        SqlAssessments.__tablename__,
        sa.Column("assessment_id", sa.String(length=50), nullable=False),
        sa.Column("trace_id", sa.String(length=50), nullable=False),
        sa.Column("name", sa.String(length=250), nullable=False),
        sa.Column("assessment_type", sa.String(length=20), nullable=False),
        sa.Column("value", sa.Text(), nullable=False),
        sa.Column("error", sa.Text(), nullable=True),
        sa.Column("created_timestamp", sa.BigInteger(), nullable=False),
        sa.Column("last_updated_timestamp", sa.BigInteger(), nullable=False),
        sa.Column("source_type", sa.String(length=50), nullable=False),
        sa.Column("source_id", sa.String(length=250), nullable=True),
        sa.Column("run_id", sa.String(length=32), nullable=True),
        sa.Column("span_id", sa.String(length=50), nullable=True),
        sa.Column("rationale", sa.Text(), nullable=True),
        sa.Column("overrides", sa.String(length=50), nullable=True),
        sa.Column("valid", sa.Boolean(), nullable=False, default=True),
        sa.Column("assessment_metadata", sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(
            ["trace_id"],
            ["trace_info.request_id"],
            name="fk_assessments_trace_id",
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("assessment_id", name="assessments_pk"),
    )

    with op.batch_alter_table(SqlAssessments.__tablename__, schema=None) as batch_op:
        batch_op.create_index(
            f"index_{SqlAssessments.__tablename__}_trace_id_created_timestamp",
            ["trace_id", "created_timestamp"],
            unique=False,
        )
        batch_op.create_index(
            f"index_{SqlAssessments.__tablename__}_run_id_created_timestamp",
            ["run_id", "created_timestamp"],
            unique=False,
        )
        batch_op.create_index(
            f"index_{SqlAssessments.__tablename__}_last_updated_timestamp",
            ["last_updated_timestamp"],
            unique=False,
        )
        batch_op.create_index(
            f"index_{SqlAssessments.__tablename__}_assessment_type",
            ["assessment_type"],
            unique=False,
        )


def downgrade():
    op.drop_table(SqlAssessments.__tablename__)
```

--------------------------------------------------------------------------------

---[FILE: 7ac759974ad8_update_run_tags_with_larger_limit.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/7ac759974ad8_update_run_tags_with_larger_limit.py
Signals: SQLAlchemy

```python
"""Update run tags with larger limit

Create Date: 2019-07-30 16:36:54.256382

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "7ac759974ad8"
down_revision = "df50e92ffc5e"
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
            existing_type=sa.String(250),
            type_=sa.String(5000),
            existing_nullable=True,
            existing_server_default=None,
        )


def downgrade():
    pass
```

--------------------------------------------------------------------------------

---[FILE: 7f2a7d5fae7d_add_datasets_inputs_input_tags_tables.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/7f2a7d5fae7d_add_datasets_inputs_input_tags_tables.py
Signals: SQLAlchemy

```python
"""add datasets inputs input_tags tables

Create Date: 2023-03-23 09:48:27.775166

"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects.mysql import MEDIUMTEXT

from mlflow.store.tracking.dbmodels.models import SqlDataset, SqlInput, SqlInputTag

# revision identifiers, used by Alembic.
revision = "7f2a7d5fae7d"
down_revision = "3500859a5d39"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        SqlDataset.__tablename__,
        sa.Column("dataset_uuid", sa.String(length=36), nullable=False),
        sa.Column(
            "experiment_id",
            sa.Integer(),
            sa.ForeignKey("experiments.experiment_id"),
            primary_key=True,
            nullable=False,
        ),
        sa.Column("name", sa.String(length=500), primary_key=True, nullable=False),
        sa.Column("digest", sa.String(length=36), primary_key=True, nullable=False),
        sa.Column("dataset_source_type", sa.String(length=36), nullable=False),
        sa.Column("dataset_source", sa.Text(), nullable=False),
        sa.Column("dataset_schema", sa.Text(), nullable=True),
        sa.Column("dataset_profile", sa.Text().with_variant(MEDIUMTEXT, "mysql"), nullable=True),
        sa.PrimaryKeyConstraint("experiment_id", "name", "digest", name="dataset_pk"),
        sa.Index(f"index_{SqlDataset.__tablename__}_dataset_uuid", "dataset_uuid", unique=False),
        sa.Index(
            f"index_{SqlDataset.__tablename__}_experiment_id_dataset_source_type",
            "experiment_id",
            "dataset_source_type",
            unique=False,
        ),
    )
    op.create_table(
        SqlInput.__tablename__,
        sa.Column("input_uuid", sa.String(length=36), nullable=False),
        sa.Column("source_type", sa.String(length=36), primary_key=True, nullable=False),
        sa.Column("source_id", sa.String(length=36), primary_key=True, nullable=False),
        sa.Column("destination_type", sa.String(length=36), primary_key=True, nullable=False),
        sa.Column("destination_id", sa.String(length=36), primary_key=True, nullable=False),
        sa.PrimaryKeyConstraint(
            "source_type", "source_id", "destination_type", "destination_id", name="inputs_pk"
        ),
        sa.Index(f"index_{SqlInput.__tablename__}_input_uuid", "input_uuid", unique=False),
        sa.Index(
            f"index_{SqlInput.__tablename__}_destination_type_destination_id_source_type",
            "destination_type",
            "destination_id",
            "source_type",
            unique=False,
        ),
    )
    op.create_table(
        SqlInputTag.__tablename__,
        sa.Column(
            "input_uuid",
            sa.String(length=36),
            primary_key=True,
            nullable=False,
        ),
        sa.Column("name", sa.String(length=255), primary_key=True, nullable=False),
        sa.Column("value", sa.String(length=500), nullable=False),
        sa.PrimaryKeyConstraint("input_uuid", "name", name="input_tags_pk"),
    )


def downgrade():
    pass
```

--------------------------------------------------------------------------------

---[FILE: 84291f40a231_add_run_link_to_model_version.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/84291f40a231_add_run_link_to_model_version.py
Signals: SQLAlchemy

```python
"""add run_link to model_version

Create Date: 2020-07-16 13:45:56.178092

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "84291f40a231"
down_revision = "27a6a02d2cf1"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "model_versions", sa.Column("run_link", sa.String(500), nullable=True, default=None)
    )


def downgrade():
    pass
```

--------------------------------------------------------------------------------

---[FILE: 867495a8f9d4_add_trace_tables.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/867495a8f9d4_add_trace_tables.py
Signals: SQLAlchemy

```python
"""add trace tables

Create Date: 2024-04-27 12:29:25.178685

"""

import sqlalchemy as sa
from alembic import op

from mlflow.store.tracking.dbmodels.models import SqlTraceInfo, SqlTraceMetadata, SqlTraceTag

# revision identifiers, used by Alembic.
revision = "867495a8f9d4"
down_revision = "acf3f17fdcc7"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        SqlTraceInfo.__tablename__,
        sa.Column("request_id", sa.String(length=50), primary_key=True, nullable=False),
        sa.Column(
            "experiment_id",
            sa.Integer(),
            sa.ForeignKey(
                column="experiments.experiment_id",
                name="fk_trace_info_experiment_id",
            ),
            nullable=False,
        ),
        sa.Column("timestamp_ms", sa.BigInteger(), nullable=False),
        sa.Column("execution_time_ms", sa.BigInteger(), nullable=True),
        sa.Column("status", sa.String(length=50), nullable=False),
        sa.PrimaryKeyConstraint("request_id", name="trace_info_pk"),
        sa.Index(
            f"index_{SqlTraceInfo.__tablename__}_experiment_id_timestamp_ms",
            "experiment_id",
            "timestamp_ms",
            unique=False,
        ),
    )
    op.create_table(
        SqlTraceTag.__tablename__,
        sa.Column("key", sa.String(length=250), primary_key=True, nullable=False),
        sa.Column("value", sa.String(length=8000), nullable=True),
        sa.Column(
            "request_id",
            sa.String(length=50),
            sa.ForeignKey(
                column=SqlTraceInfo.request_id,
                name=f"fk_{SqlTraceTag.__tablename__}_request_id",
            ),
            nullable=False,
            primary_key=True,
        ),
        sa.PrimaryKeyConstraint("key", "request_id", name="trace_tag_pk"),
        sa.Index(
            f"index_{SqlTraceTag.__tablename__}_request_id",
            "request_id",
            unique=False,
        ),
    )
    op.create_table(
        SqlTraceMetadata.__tablename__,
        sa.Column("key", sa.String(length=250), primary_key=True, nullable=False),
        sa.Column("value", sa.String(length=8000), nullable=True),
        sa.Column(
            "request_id",
            sa.String(length=50),
            sa.ForeignKey(
                column=SqlTraceInfo.request_id,
                name=f"fk_{SqlTraceMetadata.__tablename__}_request_id",
            ),
            nullable=False,
            primary_key=True,
        ),
        sa.PrimaryKeyConstraint("key", "request_id", name="trace_request_metadata_pk"),
        sa.Index(
            f"index_{SqlTraceMetadata.__tablename__}_request_id",
            "request_id",
            unique=False,
        ),
    )


def downgrade():
    pass
```

--------------------------------------------------------------------------------

---[FILE: 89d4b8295536_create_latest_metrics_table.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/89d4b8295536_create_latest_metrics_table.py
Signals: SQLAlchemy

```python
"""create latest metrics table

Create Date: 2019-08-20 11:53:28.178479

"""

import logging
import time

from alembic import op
from sqlalchemy import (
    BigInteger,
    Boolean,
    Column,
    Float,
    ForeignKey,
    PrimaryKeyConstraint,
    String,
    and_,
    distinct,
    func,
    orm,
)

from mlflow.store.tracking.dbmodels.models import SqlLatestMetric, SqlMetric

_logger = logging.getLogger(__name__)
_logger.setLevel(logging.INFO)

# revision identifiers, used by Alembic.
revision = "89d4b8295536"
down_revision = "7ac759974ad8"
branch_labels = None
depends_on = None


def _describe_migration_if_necessary(session):
    """
    If the targeted database contains any metric entries, this function emits important,
    database-specific information about the ``create_latest_metrics_table`` migration.
    If the targeted database does *not* contain any metric entries, this output is omitted
    in order to avoid superfluous log output when initializing a new Tracking database.
    """
    num_metric_entries = session.query(SqlMetric).count()
    if num_metric_entries <= 0:
        return

    _logger.warning(
        "**IMPORTANT**: This migration creates a `latest_metrics` table and populates it with the"
        " latest metric entry for each unique (run_id, metric_key) tuple. Latest metric entries are"
        " computed based on step, timestamp, and value. This migration may take a long time for"
        " databases containing a large number of metric entries. Please refer to {readme_link} for"
        " information about this migration, including how to estimate migration size and how to"
        " restore your database to its original state if the migration is unsuccessful. If you"
        " encounter failures while executing this migration, please file a GitHub issue at"
        " {issues_link}.".format(
            readme_link=(
                "https://github.com/mlflow/mlflow/blob/master/mlflow/store/db_migrations/README.md"
                "#89d4b8295536_create_latest_metrics_table"
            ),
            issues_link="https://github.com/mlflow/mlflow/issues",
        )
    )

    num_metric_keys = (
        session.query(SqlMetric.run_uuid, SqlMetric.key)
        .group_by(SqlMetric.run_uuid, SqlMetric.key)
        .count()
    )
    num_runs_containing_metrics = session.query(distinct(SqlMetric.run_uuid)).count()
    _logger.info(
        "This tracking database has {num_metric_entries} total metric entries for {num_metric_keys}"
        " unique metrics across {num_runs} runs.".format(
            num_metric_entries=num_metric_entries,
            num_metric_keys=num_metric_keys,
            num_runs=num_runs_containing_metrics,
        )
    )


def _get_latest_metrics_for_runs(session):
    metrics_with_max_step = (
        session.query(SqlMetric.run_uuid, SqlMetric.key, func.max(SqlMetric.step).label("step"))
        .group_by(SqlMetric.key, SqlMetric.run_uuid)
        .subquery("metrics_with_max_step")
    )
    metrics_with_max_timestamp = (
        session.query(
            SqlMetric.run_uuid,
            SqlMetric.key,
            SqlMetric.step,
            func.max(SqlMetric.timestamp).label("timestamp"),
        )
        .join(
            metrics_with_max_step,
            and_(
                SqlMetric.step == metrics_with_max_step.c.step,
                SqlMetric.run_uuid == metrics_with_max_step.c.run_uuid,
                SqlMetric.key == metrics_with_max_step.c.key,
            ),
        )
        .group_by(SqlMetric.key, SqlMetric.run_uuid, SqlMetric.step)
        .subquery("metrics_with_max_timestamp")
    )
    return (
        session.query(
            SqlMetric.run_uuid,
            SqlMetric.key,
            SqlMetric.step,
            SqlMetric.timestamp,
            func.max(SqlMetric.value).label("value"),
            SqlMetric.is_nan,
        )
        .join(
            metrics_with_max_timestamp,
            and_(
                SqlMetric.timestamp == metrics_with_max_timestamp.c.timestamp,
                SqlMetric.run_uuid == metrics_with_max_timestamp.c.run_uuid,
                SqlMetric.key == metrics_with_max_timestamp.c.key,
                SqlMetric.step == metrics_with_max_timestamp.c.step,
            ),
        )
        .group_by(
            SqlMetric.run_uuid, SqlMetric.key, SqlMetric.step, SqlMetric.timestamp, SqlMetric.is_nan
        )
        .all()
    )


def upgrade():
    bind = op.get_bind()
    session = orm.Session(bind=bind)

    _describe_migration_if_necessary(session)
    all_latest_metrics = _get_latest_metrics_for_runs(session=session)

    op.create_table(
        SqlLatestMetric.__tablename__,
        Column("key", String(length=250)),
        Column("value", Float(precision=53), nullable=False),
        Column("timestamp", BigInteger, default=lambda: int(time.time())),
        Column("step", BigInteger, default=0, nullable=False),
        Column("is_nan", Boolean, default=False, nullable=False),
        Column("run_uuid", String(length=32), ForeignKey("runs.run_uuid"), nullable=False),
        PrimaryKeyConstraint("key", "run_uuid", name="latest_metric_pk"),
    )

    session.add_all(
        [
            SqlLatestMetric(
                run_uuid=run_uuid,
                key=key,
                step=step,
                timestamp=timestamp,
                value=value,
                is_nan=is_nan,
            )
            for run_uuid, key, step, timestamp, value, is_nan in all_latest_metrics
        ]
    )
    session.commit()


def downgrade():
    op.drop_table(SqlLatestMetric.__tablename__)
```

--------------------------------------------------------------------------------

---[FILE: 90e64c465722_migrate_user_column_to_tags.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/90e64c465722_migrate_user_column_to_tags.py
Signals: SQLAlchemy

```python
"""migrate user column to tags

Create Date: 2019-05-29 10:43:52.919427

"""

from alembic import op
from sqlalchemy import Column, ForeignKey, Integer, PrimaryKeyConstraint, String, orm
from sqlalchemy.orm import backref, declarative_base, relationship

from mlflow.utils.mlflow_tags import MLFLOW_USER

# revision identifiers, used by Alembic.
revision = "90e64c465722"
down_revision = "451aebb31d03"
branch_labels = None
depends_on = None


Base = declarative_base()


class SqlRun(Base):
    __tablename__ = "runs"
    run_uuid = Column(String(32), nullable=False)
    user_id = Column(String(256), nullable=True, default=None)
    experiment_id = Column(Integer)

    __table_args__ = (PrimaryKeyConstraint("experiment_id", name="experiment_pk"),)


class SqlTag(Base):
    __tablename__ = "tags"
    key = Column(String(250))
    value = Column(String(250), nullable=True)
    run_uuid = Column(String(32), ForeignKey("runs.run_uuid"))
    run = relationship("SqlRun", backref=backref("tags", cascade="all"))

    __table_args__ = (PrimaryKeyConstraint("key", "run_uuid", name="tag_pk"),)


def upgrade():
    bind = op.get_bind()
    session = orm.Session(bind=bind)
    runs = session.query(SqlRun).all()
    for run in runs:
        if not run.user_id:
            continue

        tag_exists = False
        for tag in run.tags:
            if tag.key == MLFLOW_USER:
                tag_exists = True
        if tag_exists:
            continue

        session.merge(SqlTag(run_uuid=run.run_uuid, key=MLFLOW_USER, value=run.user_id))
    session.commit()


def downgrade():
    pass
```

--------------------------------------------------------------------------------

---[FILE: 97727af70f4d_creation_time_last_update_time_experiments.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/97727af70f4d_creation_time_last_update_time_experiments.py
Signals: SQLAlchemy

```python
"""Add creation_time and last_update_time to experiments table

Create Date: 2022-08-26 21:16:59.164858

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "97727af70f4d"
down_revision = "cc1f77228345"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("experiments", sa.Column("creation_time", sa.BigInteger(), nullable=True))
    op.add_column("experiments", sa.Column("last_update_time", sa.BigInteger(), nullable=True))


def downgrade():
    pass
```

--------------------------------------------------------------------------------

````
