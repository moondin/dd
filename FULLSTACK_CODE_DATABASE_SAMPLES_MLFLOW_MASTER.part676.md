---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 676
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 676 of 991)

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

---[FILE: env.py]---
Location: mlflow-master/mlflow/store/db_migrations/env.py
Signals: SQLAlchemy

```python
from alembic import context
from sqlalchemy import engine_from_config, pool

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
from mlflow.store.db.base_sql_model import Base

target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline():
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    # Try https://stackoverflow.com/questions/30378233/sqlite-lack-of-alter-support-alembic-migration-failing-because-of-this-solutio
    context.configure(
        url=url, target_metadata=target_metadata, literal_binds=True, render_as_batch=True
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    # If available, use a shared connection for the database upgrade, ensuring that any
    # connection-dependent state (e.g., the state of an in-memory database) is preserved
    # for reference by the upgrade routine. For more information, see
    # https://alembic.sqlalchemy.org/en/latest/cookbook.html#sharing-a-
    # connection-with-a-series-of-migration-commands-and-environments
    connection = config.attributes.get("connection")
    if connection is None:
        engine = engine_from_config(
            config.get_section(config.config_ini_section),
            prefix="sqlalchemy.",
            poolclass=pool.NullPool,
        )
    else:
        engine = connection.engine

    with engine.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata, render_as_batch=True
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/mlflow/store/db_migrations/README.md

```text
# MLflow Tracking database migrations

This directory contains configuration scripts and database migration logic for MLflow tracking
databases, using the Alembic migration library (https://alembic.sqlalchemy.org). To run database
migrations, use the `mlflow db upgrade` CLI command. To add and modify database migration logic,
see the contributor guide at https://github.com/mlflow/mlflow/blob/master/CONTRIBUTING.md.

If you encounter failures while executing migrations, please file a GitHub issue at
https://github.com/mlflow/mlflow/issues.

## Migration descriptions

### 89d4b8295536_create_latest_metrics_table

This migration creates a `latest_metrics` table and populates it with the latest metric entry for
each unique `(run_id, metric_key)` tuple. Latest metric entries are computed based on `step`,
`timestamp`, and `value`.

This migration may take a long time for databases containing a large number of metric entries. You
can determine the total number of metric entries using the following query:

```sql
SELECT count(*) FROM metrics GROUP BY metrics.key, run_uuid;
```

Additionally, query join latency during the migration increases with the number of unique
`(run_id, metric_key)` tuples. You can determine the total number of unique tuples using
the following query:

```sql
SELECT count(*) FROM (
   SELECT metrics.key, run_uuid FROM metrics GROUP BY run_uuid, metrics.key
) unique_metrics;
```

For reference, migrating a Tracking database with the following attributes takes roughly
**three seconds** on MySQL 5.7:

- `3702` unique metrics
- `466860` total metric entries
- `186` runs
- An average of `125` entries per unique metric

#### Recovering from a failed migration

If the **create_latest_metrics_table** migration fails, simply delete the `latest_metrics`
table from your Tracking database as follows:

```sql
DROP TABLE latest_metrics;
```

Alembic does not stamp the database with an updated version unless the corresponding migration
completes successfully. Therefore, when this migration fails, the database remains on the
previous version, and deleting the `latest_metrics` table is sufficient to restore the database
to its prior state.

If the migration fails to complete due to excessive latency, please try executing the
`mlflow db upgrade` command on the same host machine where the database is running. This will
reduce the overhead of the migration's queries and batch insert operation.
```

--------------------------------------------------------------------------------

---[FILE: script.py.mako]---
Location: mlflow-master/mlflow/store/db_migrations/script.py.mako

```text
"""${message}

Create Date: ${create_date}

"""
from alembic import op
import sqlalchemy as sa
${imports if imports else ""}

# revision identifiers, used by Alembic.
revision = ${repr(up_revision)}
down_revision = ${repr(down_revision)}
branch_labels = ${repr(branch_labels)}
depends_on = ${repr(depends_on)}


def upgrade():
    ${upgrades if upgrades else "pass"}


def downgrade():
    ${downgrades if downgrades else "pass"}
```

--------------------------------------------------------------------------------

---[FILE: 0584bdc529eb_add_cascading_deletion_to_datasets_from_experiments.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/0584bdc529eb_add_cascading_deletion_to_datasets_from_experiments.py
Signals: SQLAlchemy

```python
"""add cascading deletion to datasets from experiments

Create Date: 2024-11-11 15:27:53.189685

"""

import sqlalchemy as sa
from alembic import op

from mlflow.exceptions import MlflowException
from mlflow.store.tracking.dbmodels.models import SqlDataset, SqlExperiment

# revision identifiers, used by Alembic.
revision = "0584bdc529eb"
down_revision = "f5a4f2784254"
branch_labels = None
depends_on = None


def get_datasets_experiment_fk_name():
    conn = op.get_bind()
    metadata = sa.MetaData()
    metadata.bind = conn
    datasets_table = sa.Table(
        SqlDataset.__tablename__,
        metadata,
        autoload_with=conn,
    )

    for constraint in datasets_table.foreign_key_constraints:
        if (
            constraint.referred_table.name == SqlExperiment.__tablename__
            and constraint.column_keys[0] == "experiment_id"
        ):
            return constraint.name

    raise MlflowException(
        "Unable to find the foreign key constraint name from datasets to experiments. "
        "All foreign key constraints in datasets table: \n"
        f"{datasets_table.foreign_key_constraints}"
    )


def upgrade():
    dialect_name = op.get_context().dialect.name

    # standardize the constraint to sqlite naming convention
    new_fk_constraint_name = (
        f"fk_{SqlDataset.__tablename__}_experiment_id_{SqlExperiment.__tablename__}"
    )

    if dialect_name == "sqlite":
        # Only way to drop unnamed fk constraint in sqllite
        # See https://alembic.sqlalchemy.org/en/latest/batch.html#dropping-unnamed-or-named-foreign-key-constraints
        with op.batch_alter_table(
            SqlDataset.__tablename__,
            schema=None,
            naming_convention={
                "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
            },
        ) as batch_op:
            # in SQLite, constraint.name is None, so we have to hardcode it
            batch_op.drop_constraint(new_fk_constraint_name, type_="foreignkey")
            # Need to explicitly name the fk constraint with batch alter table
            batch_op.create_foreign_key(
                new_fk_constraint_name,
                SqlExperiment.__tablename__,
                ["experiment_id"],
                ["experiment_id"],
                ondelete="CASCADE",
            )
    else:
        old_fk_constraint_name = get_datasets_experiment_fk_name()
        op.drop_constraint(old_fk_constraint_name, SqlDataset.__tablename__, type_="foreignkey")
        op.create_foreign_key(
            new_fk_constraint_name,
            SqlDataset.__tablename__,
            SqlExperiment.__tablename__,
            ["experiment_id"],
            ["experiment_id"],
            ondelete="CASCADE",
        )


def downgrade():
    pass
```

--------------------------------------------------------------------------------

---[FILE: 0a8213491aaa_drop_duplicate_killed_constraint.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/0a8213491aaa_drop_duplicate_killed_constraint.py

```python
"""drop_duplicate_killed_constraint

Create Date: 2020-01-28 15:26:14.757445

This migration drops a duplicate constraint on the `runs.status` column that was left as a byproduct
of an erroneous implementation of the `cfd24bdc0731_update_run_status_constraint_with_killed`
migration in MLflow 1.5. The implementation of this migration has since been fixed.
"""

import logging

from alembic import op

_logger = logging.getLogger(__name__)

# revision identifiers, used by Alembic.
revision = "0a8213491aaa"
down_revision = "cfd24bdc0731"
branch_labels = None
depends_on = None


def upgrade():
    # Attempt to drop any existing `status` constraints on the `runs` table. This operation
    # may fail against certain backends with different classes of Exception. For example,
    # in MySQL <= 8.0.15, dropping constraints produces an invalid `ALTER TABLE` expression.
    # Further, in certain versions of sqlite, `ALTER` (which is invoked by `drop_constraint`)
    # is unsupported on `CHECK` constraints. Accordingly, we catch the generic `Exception`
    # object because the failure modes are not well-enumerated or consistent across database
    # backends. Because failures automatically stop batch operations and the `drop_constraint()`
    # operation is expected to fail under certain circumstances, we execute `drop_constraint()`
    # outside of the batch operation context.
    try:
        # For other database backends, the status check constraint is dropped by
        # cfd24bdc0731_update_run_status_constraint_with_killed.py
        if op.get_bind().engine.name == "mysql":
            op.drop_constraint(constraint_name="status", table_name="runs", type_="check")
    except Exception as e:
        _logger.warning(
            "Failed to drop check constraint. Dropping check constraints may not be supported"
            " by your SQL database. Exception content: %s",
            e,
        )


def downgrade():
    pass
```

--------------------------------------------------------------------------------

---[FILE: 0c779009ac13_add_deleted_time_field_to_runs_table.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/0c779009ac13_add_deleted_time_field_to_runs_table.py
Signals: SQLAlchemy

```python
"""add deleted_time field to runs table

Create Date: 2022-07-27 14:13:36.162861

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "0c779009ac13"
down_revision = "bd07f7e963c5"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("runs", sa.Column("deleted_time", sa.BigInteger, nullable=True, default=None))


def downgrade():
    pass
```

--------------------------------------------------------------------------------

---[FILE: 181f10493468_allow_nulls_for_metric_values.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/181f10493468_allow_nulls_for_metric_values.py
Signals: SQLAlchemy

```python
"""allow nulls for metric values

Create Date: 2019-07-10 22:40:18.787993

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "181f10493468"
down_revision = "90e64c465722"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("metrics") as batch_op:
        batch_op.alter_column("value", type_=sa.types.Float(precision=53), nullable=False)
        batch_op.add_column(
            sa.Column(
                "is_nan", sa.Boolean(create_constraint=False), nullable=False, server_default="0"
            )
        )
        batch_op.drop_constraint(constraint_name="metric_pk", type_="primary")
        batch_op.create_primary_key(
            constraint_name="metric_pk",
            columns=["key", "timestamp", "step", "run_uuid", "value", "is_nan"],
        )


def downgrade():
    pass
```

--------------------------------------------------------------------------------

---[FILE: 1a0cddfcaa16_add_webhooks_and_webhook_events_tables.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/1a0cddfcaa16_add_webhooks_and_webhook_events_tables.py
Signals: SQLAlchemy

```python
"""Add webhooks and webhook_events tables

Create Date: 2025-07-07 23:00:00.000000

"""

import sqlalchemy as sa
from alembic import op

from mlflow.store.model_registry.dbmodels.models import SqlWebhook, SqlWebhookEvent

# revision identifiers, used by Alembic.
revision = "1a0cddfcaa16"
down_revision = "de4033877273"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        SqlWebhook.__tablename__,
        sa.Column("webhook_id", sa.String(length=256), nullable=False),
        sa.Column("name", sa.String(length=256), nullable=False),
        sa.Column("description", sa.String(length=1000), nullable=True),
        sa.Column("url", sa.String(length=500), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="ACTIVE"),
        sa.Column("secret", sa.String(length=1000), nullable=True),  # Stored as encrypted text
        sa.Column("creation_timestamp", sa.BigInteger(), nullable=True),
        sa.Column("last_updated_timestamp", sa.BigInteger(), nullable=True),
        sa.Column("deleted_timestamp", sa.BigInteger(), nullable=True),  # For soft deletes
        sa.PrimaryKeyConstraint("webhook_id", name="webhook_pk"),
    )

    # Create indexes for webhooks table
    op.create_index("idx_webhooks_status", SqlWebhook.__tablename__, ["status"])
    op.create_index("idx_webhooks_name", SqlWebhook.__tablename__, ["name"])

    op.create_table(
        SqlWebhookEvent.__tablename__,
        sa.Column("webhook_id", sa.String(length=256), nullable=False),
        sa.Column("entity", sa.String(length=50), nullable=False),
        sa.Column("action", sa.String(length=50), nullable=False),
        sa.ForeignKeyConstraint(
            ["webhook_id"], [f"{SqlWebhook.__tablename__}.webhook_id"], ondelete="cascade"
        ),
        sa.PrimaryKeyConstraint("webhook_id", "entity", "action", name="webhook_event_pk"),
    )

    # Create indexes for webhook_events table
    op.create_index("idx_webhook_events_entity", SqlWebhookEvent.__tablename__, ["entity"])
    op.create_index("idx_webhook_events_action", SqlWebhookEvent.__tablename__, ["action"])
    op.create_index(
        "idx_webhook_events_entity_action", SqlWebhookEvent.__tablename__, ["entity", "action"]
    )


def downgrade():
    # Drop indexes for webhook_events table
    op.drop_index("idx_webhook_events_entity_action", SqlWebhookEvent.__tablename__)
    op.drop_index("idx_webhook_events_action", SqlWebhookEvent.__tablename__)
    op.drop_index("idx_webhook_events_entity", SqlWebhookEvent.__tablename__)

    # Drop webhook_events table first due to foreign key constraint
    op.drop_table(SqlWebhookEvent.__tablename__)

    # Drop indexes for webhooks table
    op.drop_index("idx_webhooks_name", SqlWebhook.__tablename__)
    op.drop_index("idx_webhooks_status", SqlWebhook.__tablename__)

    # Drop webhooks table
    op.drop_table(SqlWebhook.__tablename__)
```

--------------------------------------------------------------------------------

---[FILE: 1bd49d398cd23_add_secrets_tables.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/1bd49d398cd23_add_secrets_tables.py
Signals: SQLAlchemy

```python
"""add secrets tables

Create Date: 2025-11-20 12:22:19.451124

"""

import time

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "1bd49d398cd23"
down_revision = "bf29a5ff90ea"
branch_labels = None
depends_on = None


# Trigger SQL for each database dialect to enforce immutability of secret_id and secret_name.
# These fields are used as AAD (Additional Authenticated Data) in AES-GCM encryption.
# If modified, decryption will fail. This is enforced at the database level to prevent
# any code path from accidentally allowing mutation.

SQLITE_TRIGGER = """
CREATE TRIGGER prevent_secrets_aad_mutation
BEFORE UPDATE ON secrets
FOR EACH ROW
WHEN OLD.secret_id != NEW.secret_id OR OLD.secret_name != NEW.secret_name
BEGIN
    SELECT RAISE(ABORT, 'secret_id and secret_name are immutable (used as AAD in encryption)');
END;
"""

POSTGRESQL_FUNCTION = """
CREATE OR REPLACE FUNCTION prevent_secrets_aad_mutation()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.secret_id != NEW.secret_id OR OLD.secret_name != NEW.secret_name THEN
        RAISE EXCEPTION 'secret_id and secret_name are immutable (used as AAD in encryption)';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
"""

POSTGRESQL_TRIGGER = """
CREATE TRIGGER prevent_secrets_aad_mutation
BEFORE UPDATE ON secrets
FOR EACH ROW
EXECUTE FUNCTION prevent_secrets_aad_mutation();
"""

MYSQL_TRIGGER = """
CREATE TRIGGER prevent_secrets_aad_mutation
BEFORE UPDATE ON secrets
FOR EACH ROW
BEGIN
    IF OLD.secret_id != NEW.secret_id OR OLD.secret_name != NEW.secret_name THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'secret_id and secret_name are immutable (used as AAD in encryption)';
    END IF;
END;
"""

MSSQL_TRIGGER = """
CREATE TRIGGER prevent_secrets_aad_mutation
ON secrets
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (
        SELECT 1 FROM inserted i
        INNER JOIN deleted d ON i.secret_id = d.secret_id
        WHERE i.secret_id != d.secret_id OR i.secret_name != d.secret_name
    )
    BEGIN
        RAISERROR('secret_id and secret_name are immutable (used as AAD in encryption)', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
"""


def _create_immutability_trigger():
    bind = op.get_bind()
    dialect = bind.engine.dialect.name

    if dialect == "sqlite":
        op.execute(SQLITE_TRIGGER)
    elif dialect == "postgresql":
        op.execute(POSTGRESQL_FUNCTION)
        op.execute(POSTGRESQL_TRIGGER)
    elif dialect == "mysql":
        op.execute(MYSQL_TRIGGER)
    elif dialect == "mssql":
        op.execute(MSSQL_TRIGGER)


def _drop_immutability_trigger():
    bind = op.get_bind()
    dialect = bind.engine.dialect.name

    if dialect == "sqlite":
        op.execute("DROP TRIGGER IF EXISTS prevent_secrets_aad_mutation;")
    elif dialect == "postgresql":
        op.execute("DROP TRIGGER IF EXISTS prevent_secrets_aad_mutation ON secrets;")
        op.execute("DROP FUNCTION IF EXISTS prevent_secrets_aad_mutation();")
    elif dialect == "mysql":
        op.execute("DROP TRIGGER IF EXISTS prevent_secrets_aad_mutation;")
    elif dialect == "mssql":
        op.execute(
            "IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'prevent_secrets_aad_mutation') "
            "DROP TRIGGER prevent_secrets_aad_mutation;"
        )


def upgrade():
    op.create_table(
        "secrets",
        sa.Column("secret_id", sa.String(length=36), nullable=False),
        sa.Column("secret_name", sa.String(length=255), nullable=False),
        sa.Column("encrypted_value", sa.LargeBinary(), nullable=False),
        sa.Column("wrapped_dek", sa.LargeBinary(), nullable=False),
        sa.Column("kek_version", sa.Integer(), nullable=False, default=1),
        sa.Column("masked_value", sa.String(length=100), nullable=False),
        sa.Column("provider", sa.String(length=64), nullable=True),
        sa.Column("auth_config", sa.Text(), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("created_by", sa.String(length=255), nullable=True),
        sa.Column(
            "created_at",
            sa.BigInteger(),
            default=lambda: int(time.time() * 1000),
            nullable=False,
        ),
        sa.Column("last_updated_by", sa.String(length=255), nullable=True),
        sa.Column(
            "last_updated_at",
            sa.BigInteger(),
            default=lambda: int(time.time() * 1000),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("secret_id", name="secrets_pk"),
    )
    with op.batch_alter_table("secrets", schema=None) as batch_op:
        batch_op.create_index("unique_secret_name", ["secret_name"], unique=True)

    op.create_table(
        "endpoints",
        sa.Column("endpoint_id", sa.String(length=36), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=True),
        sa.Column("created_by", sa.String(length=255), nullable=True),
        sa.Column(
            "created_at",
            sa.BigInteger(),
            default=lambda: int(time.time() * 1000),
            nullable=False,
        ),
        sa.Column("last_updated_by", sa.String(length=255), nullable=True),
        sa.Column(
            "last_updated_at",
            sa.BigInteger(),
            default=lambda: int(time.time() * 1000),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("endpoint_id", name="endpoints_pk"),
    )
    with op.batch_alter_table("endpoints", schema=None) as batch_op:
        batch_op.create_index("unique_endpoint_name", ["name"], unique=True)

    op.create_table(
        "model_definitions",
        sa.Column("model_definition_id", sa.String(length=36), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("secret_id", sa.String(length=36), nullable=True),
        sa.Column("provider", sa.String(length=64), nullable=False),
        sa.Column("model_name", sa.String(length=256), nullable=False),
        sa.Column("created_by", sa.String(length=255), nullable=True),
        sa.Column(
            "created_at",
            sa.BigInteger(),
            default=lambda: int(time.time() * 1000),
            nullable=False,
        ),
        sa.Column("last_updated_by", sa.String(length=255), nullable=True),
        sa.Column(
            "last_updated_at",
            sa.BigInteger(),
            default=lambda: int(time.time() * 1000),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["secret_id"],
            ["secrets.secret_id"],
            name="fk_model_definitions_secret_id",
            ondelete="SET NULL",
        ),
        sa.PrimaryKeyConstraint("model_definition_id", name="model_definitions_pk"),
    )
    with op.batch_alter_table("model_definitions", schema=None) as batch_op:
        batch_op.create_index("unique_model_definition_name", ["name"], unique=True)
        batch_op.create_index("index_model_definitions_secret_id", ["secret_id"], unique=False)
        batch_op.create_index("index_model_definitions_provider", ["provider"], unique=False)

    op.create_table(
        "endpoint_model_mappings",
        sa.Column("mapping_id", sa.String(length=36), nullable=False),
        sa.Column("endpoint_id", sa.String(length=36), nullable=False),
        sa.Column("model_definition_id", sa.String(length=36), nullable=False),
        sa.Column("weight", sa.Float(), nullable=False, default=1.0),
        sa.Column("created_by", sa.String(length=255), nullable=True),
        sa.Column(
            "created_at",
            sa.BigInteger(),
            default=lambda: int(time.time() * 1000),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["endpoint_id"],
            ["endpoints.endpoint_id"],
            name="fk_endpoint_model_mappings_endpoint_id",
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["model_definition_id"],
            ["model_definitions.model_definition_id"],
            name="fk_endpoint_model_mappings_model_definition_id",
        ),
        sa.PrimaryKeyConstraint("mapping_id", name="endpoint_model_mappings_pk"),
    )
    with op.batch_alter_table("endpoint_model_mappings", schema=None) as batch_op:
        batch_op.create_index(
            "index_endpoint_model_mappings_endpoint_id", ["endpoint_id"], unique=False
        )
        batch_op.create_index(
            "index_endpoint_model_mappings_model_definition_id",
            ["model_definition_id"],
            unique=False,
        )
        batch_op.create_index(
            "unique_endpoint_model_mapping",
            ["endpoint_id", "model_definition_id"],
            unique=True,
        )

    op.create_table(
        "endpoint_bindings",
        sa.Column("endpoint_id", sa.String(length=36), nullable=False),
        sa.Column("resource_type", sa.String(length=50), nullable=False),
        sa.Column("resource_id", sa.String(length=255), nullable=False),
        sa.Column(
            "created_at",
            sa.BigInteger(),
            default=lambda: int(time.time() * 1000),
            nullable=False,
        ),
        sa.Column("created_by", sa.String(length=255), nullable=True),
        sa.Column(
            "last_updated_at",
            sa.BigInteger(),
            default=lambda: int(time.time() * 1000),
            nullable=False,
        ),
        sa.Column("last_updated_by", sa.String(length=255), nullable=True),
        sa.ForeignKeyConstraint(
            ["endpoint_id"],
            ["endpoints.endpoint_id"],
            name="fk_endpoint_bindings_endpoint_id",
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint(
            "endpoint_id", "resource_type", "resource_id", name="endpoint_bindings_pk"
        ),
    )

    op.create_table(
        "endpoint_tags",
        sa.Column("key", sa.String(length=250), nullable=False),
        sa.Column("value", sa.String(length=5000), nullable=True),
        sa.Column("endpoint_id", sa.String(length=36), nullable=False),
        sa.ForeignKeyConstraint(
            ["endpoint_id"],
            ["endpoints.endpoint_id"],
            name="fk_endpoint_tags_endpoint_id",
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("key", "endpoint_id", name="endpoint_tag_pk"),
    )
    with op.batch_alter_table("endpoint_tags", schema=None) as batch_op:
        batch_op.create_index("index_endpoint_tags_endpoint_id", ["endpoint_id"], unique=False)

    _create_immutability_trigger()


def downgrade():
    _drop_immutability_trigger()
    op.drop_table("endpoint_tags")
    op.drop_table("endpoint_bindings")
    op.drop_table("endpoint_model_mappings")
    op.drop_table("model_definitions")
    op.drop_table("endpoints")
    op.drop_table("secrets")
```

--------------------------------------------------------------------------------

---[FILE: 27a6a02d2cf1_add_model_version_tags_table.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/27a6a02d2cf1_add_model_version_tags_table.py
Signals: SQLAlchemy

```python
"""add model version tags table

Create Date: 2020-06-26 13:30:27.611086

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
from mlflow.store.model_registry.dbmodels.models import SqlModelVersionTag

revision = "27a6a02d2cf1"
down_revision = "728d730b5ebd"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        SqlModelVersionTag.__tablename__,
        sa.Column("key", sa.String(length=250), primary_key=True, nullable=False),
        sa.Column("value", sa.String(length=5000)),
        sa.Column("name", sa.String(length=256), primary_key=True, nullable=False),
        sa.Column("version", sa.Integer(), primary_key=True, nullable=False),
        sa.ForeignKeyConstraint(
            ("name", "version"),
            ("model_versions.name", "model_versions.version"),
            onupdate="cascade",
        ),
        sa.PrimaryKeyConstraint("key", "name", "version", name="model_version_tag_pk"),
    )


def downgrade():
    pass
```

--------------------------------------------------------------------------------

---[FILE: 2b4d017a5e9b_add_model_registry_tables_to_db.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/2b4d017a5e9b_add_model_registry_tables_to_db.py
Signals: SQLAlchemy

```python
"""add model registry tables to db

Create Date: 2019-10-14 12:20:12.874424

"""

import time

from alembic import op
from sqlalchemy import (
    BigInteger,
    Column,
    ForeignKey,
    Integer,
    PrimaryKeyConstraint,
    String,
    orm,
)

from mlflow.entities.model_registry.model_version_stages import STAGE_NONE
from mlflow.entities.model_registry.model_version_status import ModelVersionStatus
from mlflow.store.model_registry.dbmodels.models import SqlModelVersion, SqlRegisteredModel

# revision identifiers, used by Alembic.
revision = "2b4d017a5e9b"
down_revision = "89d4b8295536"
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    session = orm.Session(bind=bind)

    op.create_table(
        SqlRegisteredModel.__tablename__,
        Column("name", String(256), unique=True, nullable=False),
        Column("creation_time", BigInteger, default=lambda: int(time.time() * 1000)),
        Column("last_updated_time", BigInteger, nullable=True, default=None),
        Column("description", String(5000), nullable=True),
        PrimaryKeyConstraint("name", name="registered_model_pk"),
    )

    op.create_table(
        SqlModelVersion.__tablename__,
        Column("name", String(256), ForeignKey("registered_models.name", onupdate="cascade")),
        Column("version", Integer, nullable=False),
        Column("creation_time", BigInteger, default=lambda: int(time.time() * 1000)),
        Column("last_updated_time", BigInteger, nullable=True, default=None),
        Column("description", String(5000), nullable=True),
        Column("user_id", String(256), nullable=True, default=None),
        Column("current_stage", String(20), default=STAGE_NONE),
        Column("source", String(500), nullable=True, default=None),
        Column("run_id", String(32), nullable=False),
        Column(
            "status", String(20), default=ModelVersionStatus.to_string(ModelVersionStatus.READY)
        ),
        Column("status_message", String(500), nullable=True, default=None),
        PrimaryKeyConstraint("name", "version", name="model_version_pk"),
    )

    session.commit()


def downgrade():
    op.drop_table(SqlRegisteredModel.__tablename__)
    op.drop_table(SqlModelVersion.__tablename__)
```

--------------------------------------------------------------------------------

---[FILE: 2d6e25af4d3e_increase_max_param_val_length.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/2d6e25af4d3e_increase_max_param_val_length.py
Signals: SQLAlchemy

```python
"""increase max param val length from 500 to 8000

Create Date: 2023-09-25 13:59:04.231744

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "2d6e25af4d3e"
down_revision = "7f2a7d5fae7d"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("params") as batch_op:
        batch_op.alter_column(
            "value",
            existing_type=sa.String(500),
            # We choose 8000 because it's the minimum max_length for
            # a VARCHAR column in all supported database types.
            type_=sa.String(8000),
            existing_nullable=False,
            existing_server_default=None,
        )


def downgrade():
    pass
```

--------------------------------------------------------------------------------

---[FILE: 3500859a5d39_add_model_aliases_table.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/3500859a5d39_add_model_aliases_table.py
Signals: SQLAlchemy

```python
"""Add Model Aliases table

Create Date: 2023-03-09 15:33:54.951736

"""

import sqlalchemy as sa
from alembic import op

from mlflow.store.model_registry.dbmodels.models import SqlRegisteredModelAlias

# revision identifiers, used by Alembic.
revision = "3500859a5d39"
down_revision = "97727af70f4d"
branch_labels = None
depends_on = None


def get_existing_tables():
    connection = op.get_bind()
    inspector = sa.inspect(connection)
    return inspector.get_table_names()


def upgrade():
    if SqlRegisteredModelAlias.__tablename__ not in get_existing_tables():
        op.create_table(
            SqlRegisteredModelAlias.__tablename__,
            sa.Column("alias", sa.String(length=256), primary_key=True, nullable=False),
            sa.Column("version", sa.Integer(), nullable=False),
            sa.Column(
                "name",
                sa.String(length=256),
                sa.ForeignKey(
                    "registered_models.name",
                    onupdate="cascade",
                    ondelete="cascade",
                    name="registered_model_alias_name_fkey",
                ),
                primary_key=True,
                nullable=False,
            ),
            sa.PrimaryKeyConstraint("name", "alias", name="registered_model_alias_pk"),
        )


def downgrade():
    pass
```

--------------------------------------------------------------------------------

---[FILE: 39d1c3be5f05_add_is_nan_constraint_for_metrics_tables_if_necessary.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/39d1c3be5f05_add_is_nan_constraint_for_metrics_tables_if_necessary.py
Signals: SQLAlchemy

```python
"""add_is_nan_constraint_for_metrics_tables_if_necessary

Create Date: 2021-03-16 20:40:24.214667

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "39d1c3be5f05"
down_revision = "a8c4a736bde6"
branch_labels = None
depends_on = None


def upgrade():
    # This part of the migration is only relevant for users who installed sqlalchemy 1.4.0 with
    # MLflow <= 1.14.1. In sqlalchemy 1.4.0, the default value of `create_constraint` for
    # `sqlalchemy.Boolean` was changed to `False` from `True`:
    # https://github.com/sqlalchemy/sqlalchemy/blob/e769ba4b00859ac8c95610ed149da4d940eac9d0/lib/sqlalchemy/sql/sqltypes.py#L1841
    # To ensure that a check constraint is always present on the `is_nan` column in the
    # `latest_metrics` table, we perform an `alter_column` and explicitly set `create_constraint`
    # to `True`
    with op.batch_alter_table("latest_metrics") as batch_op:
        batch_op.alter_column(
            "is_nan", type_=sa.types.Boolean(create_constraint=True), nullable=False
        )

    # Introduce a check constraint on the `is_nan` column from the `metrics` table, which was
    # missing prior to this migration
    with op.batch_alter_table("metrics") as batch_op:
        batch_op.alter_column(
            "is_nan", type_=sa.types.Boolean(create_constraint=True), nullable=False
        )


def downgrade():
    pass
```

--------------------------------------------------------------------------------

---[FILE: 3da73c924c2f_add_outputs_to_dataset_record.py]---
Location: mlflow-master/mlflow/store/db_migrations/versions/3da73c924c2f_add_outputs_to_dataset_record.py
Signals: SQLAlchemy

```python
"""add outputs to dataset record

Create Date: 2025-01-16 12:00:00.000000

"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import mssql

# revision identifiers, used by Alembic.
revision = "3da73c924c2f"
down_revision = "71994744cf8e"
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
    """Add outputs column to evaluation_dataset_records table."""
    json_type = _get_json_type()

    # Add outputs column to evaluation_dataset_records table
    op.add_column("evaluation_dataset_records", sa.Column("outputs", json_type, nullable=True))


def downgrade():
    """Remove outputs column from evaluation_dataset_records table."""
    op.drop_column("evaluation_dataset_records", "outputs")
```

--------------------------------------------------------------------------------

````
