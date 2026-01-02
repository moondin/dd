---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 414
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 414 of 991)

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

---[FILE: __main__.py]---
Location: mlflow-master/mlflow/server/auth/__main__.py

```python
from mlflow.server.auth.cli import commands

if __name__ == "__main__":
    commands()
```

--------------------------------------------------------------------------------

---[FILE: cli.py]---
Location: mlflow-master/mlflow/server/auth/db/cli.py
Signals: SQLAlchemy

```python
import click
import sqlalchemy

from mlflow.server.auth.db import utils


@click.group(name="db")
def commands():
    pass


@commands.command()
@click.option("--url", required=True)
@click.option("--revision", default="head")
def upgrade(url: str, revision: str) -> None:
    engine = sqlalchemy.create_engine(url)
    utils.migrate(engine, revision)
    engine.dispose()
```

--------------------------------------------------------------------------------

---[FILE: models.py]---
Location: mlflow-master/mlflow/server/auth/db/models.py
Signals: SQLAlchemy

```python
from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import declarative_base, relationship

from mlflow.server.auth.entities import (
    ExperimentPermission,
    RegisteredModelPermission,
    ScorerPermission,
    User,
)

Base = declarative_base()


class SqlUser(Base):
    __tablename__ = "users"
    id = Column(Integer(), primary_key=True)
    username = Column(String(255), unique=True)
    password_hash = Column(String(255))
    is_admin = Column(Boolean, default=False)
    experiment_permissions = relationship("SqlExperimentPermission", backref="users")
    registered_model_permissions = relationship("SqlRegisteredModelPermission", backref="users")
    scorer_permissions = relationship("SqlScorerPermission", backref="users")

    def to_mlflow_entity(self):
        return User(
            id_=self.id,
            username=self.username,
            password_hash=self.password_hash,
            is_admin=self.is_admin,
            experiment_permissions=[p.to_mlflow_entity() for p in self.experiment_permissions],
            registered_model_permissions=[
                p.to_mlflow_entity() for p in self.registered_model_permissions
            ],
            scorer_permissions=[p.to_mlflow_entity() for p in self.scorer_permissions],
        )


class SqlExperimentPermission(Base):
    __tablename__ = "experiment_permissions"
    id = Column(Integer(), primary_key=True)
    experiment_id = Column(String(255), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    permission = Column(String(255))
    __table_args__ = (UniqueConstraint("experiment_id", "user_id", name="unique_experiment_user"),)

    def to_mlflow_entity(self):
        return ExperimentPermission(
            experiment_id=self.experiment_id,
            user_id=self.user_id,
            permission=self.permission,
        )


class SqlRegisteredModelPermission(Base):
    __tablename__ = "registered_model_permissions"
    id = Column(Integer(), primary_key=True)
    name = Column(String(255), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    permission = Column(String(255))
    __table_args__ = (UniqueConstraint("name", "user_id", name="unique_name_user"),)

    def to_mlflow_entity(self):
        return RegisteredModelPermission(
            name=self.name,
            user_id=self.user_id,
            permission=self.permission,
        )


class SqlScorerPermission(Base):
    __tablename__ = "scorer_permissions"
    id = Column(Integer(), primary_key=True)
    experiment_id = Column(String(255), nullable=False)
    scorer_name = Column(String(256), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    permission = Column(String(255))
    __table_args__ = (
        UniqueConstraint("experiment_id", "scorer_name", "user_id", name="unique_scorer_user"),
    )

    def to_mlflow_entity(self):
        return ScorerPermission(
            experiment_id=self.experiment_id,
            scorer_name=self.scorer_name,
            user_id=self.user_id,
            permission=self.permission,
        )
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: mlflow-master/mlflow/server/auth/db/utils.py
Signals: SQLAlchemy

```python
from pathlib import Path

from alembic.command import stamp, upgrade
from alembic.config import Config
from alembic.migration import MigrationContext
from alembic.script import ScriptDirectory
from sqlalchemy import inspect
from sqlalchemy.engine.base import Engine

INITIAL_REVISION = "8606fa83a998"


def _get_alembic_dir() -> str:
    return Path(__file__).parent / "migrations"


def _get_alembic_config(url: str) -> Config:
    alembic_dir = _get_alembic_dir()
    alembic_ini_path = alembic_dir / "alembic.ini"
    alembic_cfg = Config(alembic_ini_path)
    alembic_cfg.set_main_option("script_location", str(alembic_dir))
    url = url.replace("%", "%%")  # Same as here: https://github.com/mlflow/mlflow/issues/1487
    alembic_cfg.set_main_option("sqlalchemy.url", url)
    return alembic_cfg


def _is_legacy_database(engine: Engine) -> bool:
    """Check if this is a pre-3.6.0 auth database that needs version table migration.

    Returns True if:
    - Auth tables (users, experiment_permissions, etc.) exist
    - alembic_version_auth table does NOT exist

    This indicates a database from MLflow < 3.6.0 that was using the old
    initialization method without Alembic version tracking.
    """
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()

    has_auth_tables = "users" in existing_tables
    has_version_table = "alembic_version_auth" in existing_tables

    return has_auth_tables and not has_version_table


def _stamp_legacy_database(engine: Engine, revision: str) -> None:
    """Stamp a legacy database with the initial Alembic revision.

    This creates the alembic_version_auth table and marks the database
    as being at the specified revision, avoiding the need to re-run
    the initial migration on databases that already have the tables.
    """
    alembic_cfg = _get_alembic_config(engine.url.render_as_string(hide_password=False))
    with engine.begin() as conn:
        alembic_cfg.attributes["connection"] = conn
        stamp(alembic_cfg, revision)


def migrate(engine: Engine, revision: str) -> None:
    if _is_legacy_database(engine):
        _stamp_legacy_database(engine, INITIAL_REVISION)
        return

    alembic_cfg = _get_alembic_config(engine.url.render_as_string(hide_password=False))
    with engine.begin() as conn:
        alembic_cfg.attributes["connection"] = conn
        upgrade(alembic_cfg, revision)


def migrate_if_needed(engine: Engine, revision: str) -> None:
    if _is_legacy_database(engine):
        _stamp_legacy_database(engine, INITIAL_REVISION)
        return

    alembic_cfg = _get_alembic_config(engine.url.render_as_string(hide_password=False))
    script_dir = ScriptDirectory.from_config(alembic_cfg)
    with engine.begin() as conn:
        context = MigrationContext.configure(conn, opts={"version_table": "alembic_version_auth"})
        if context.get_current_revision() != script_dir.get_current_head():
            upgrade(alembic_cfg, revision)
```

--------------------------------------------------------------------------------

---[FILE: alembic.ini]---
Location: mlflow-master/mlflow/server/auth/db/migrations/alembic.ini

```text
# A generic, single database configuration.

[alembic]
# path to migration scripts
script_location = .

# template used to generate migration file names; The default value is %%(rev)s_%%(slug)s
# Uncomment the line below if you want the files to be prepended with date and time
# see https://alembic.sqlalchemy.org/en/latest/tutorial.html#editing-the-ini-file
# for all available tokens
# file_template = %%(year)d_%%(month).2d_%%(day).2d_%%(hour).2d%%(minute).2d-%%(rev)s_%%(slug)s

# sys.path path, will be prepended to sys.path if present.
# defaults to the current working directory.
prepend_sys_path = .

# timezone to use when rendering the date within the migration file
# as well as the filename.
# If specified, requires the python-dateutil library that can be
# installed by adding `alembic[tz]` to the pip requirements
# string value is passed to dateutil.tz.gettz()
# leave blank for localtime
# timezone =

# max length of characters to apply to the
# "slug" field
# truncate_slug_length = 40

# set to 'true' to run the environment during
# the 'revision' command, regardless of autogenerate
# revision_environment = false

# set to 'true' to allow .pyc and .pyo files without
# a source .py file to be detected as revisions in the
# versions/ directory
# sourceless = false

# version location specification; This defaults
# to migration/versions.  When using multiple version
# directories, initial revisions must be specified with --version-path.
# The path separator used here should be the separator specified by "version_path_separator" below.
# version_locations = %(here)s/bar:%(here)s/bat:migration/versions

# version path separator; As mentioned above, this is the character used to split
# version_locations. The default within new alembic.ini files is "os", which uses os.pathsep.
# If this key is omitted entirely, it falls back to the legacy behavior of splitting on spaces and/or commas.
# Valid values for version_path_separator are:
#
# version_path_separator = :
# version_path_separator = ;
# version_path_separator = space
version_path_separator = os  # Use os.pathsep. Default configuration used for new projects.

# set to 'true' to search source files recursively
# in each "version_locations" directory
# new in Alembic version 1.10
# recursive_version_locations = false

# the output encoding used when revision files
# are written from script.py.mako
# output_encoding = utf-8

sqlalchemy.url =


[post_write_hooks]
# post_write_hooks defines scripts or Python functions that are run
# on newly generated revision scripts.  See the documentation for further
# detail and examples

# format using "black" - use the console_scripts runner, against the "black" entrypoint
# hooks = black
# black.type = console_scripts
# black.entrypoint = black
# black.options = -l 79 REVISION_SCRIPT_FILENAME
```

--------------------------------------------------------------------------------

---[FILE: env.py]---
Location: mlflow-master/mlflow/server/auth/db/migrations/env.py
Signals: SQLAlchemy

```python
from alembic import context
from sqlalchemy import engine_from_config, pool

from mlflow.server.auth.db.models import Base

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        version_table="alembic_version_auth",
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            version_table="alembic_version_auth",
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
```

--------------------------------------------------------------------------------

---[FILE: script.py.mako]---
Location: mlflow-master/mlflow/server/auth/db/migrations/script.py.mako

```text
"""${message}

Revision ID: ${up_revision}
Revises: ${down_revision | comma,n}
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


def upgrade() -> None:
    ${upgrades if upgrades else "pass"}


def downgrade() -> None:
    ${downgrades if downgrades else "pass"}
```

--------------------------------------------------------------------------------

---[FILE: 0965eb92f5f0_add_scorer_permissions.py]---
Location: mlflow-master/mlflow/server/auth/db/migrations/versions/0965eb92f5f0_add_scorer_permissions.py
Signals: SQLAlchemy

```python
"""add_scorer_permissions

Revision ID: 0965eb92f5f0
Revises: 8606fa83a998
Create Date: 2025-11-03 12:00:00.000000

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "0965eb92f5f0"
down_revision = "8606fa83a998"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "scorer_permissions",
        sa.Column("id", sa.Integer(), nullable=False, primary_key=True),
        sa.Column("experiment_id", sa.String(length=255), nullable=False),
        sa.Column("scorer_name", sa.String(length=256), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("permission", sa.String(length=255), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], name="fk_scorer_perm_user_id"),
        sa.UniqueConstraint("experiment_id", "scorer_name", "user_id", name="unique_scorer_user"),
    )


def downgrade() -> None:
    op.drop_table("scorer_permissions")
```

--------------------------------------------------------------------------------

---[FILE: 8606fa83a998_initial_migration.py]---
Location: mlflow-master/mlflow/server/auth/db/migrations/versions/8606fa83a998_initial_migration.py
Signals: SQLAlchemy

```python
"""initial_migration

Revision ID: 8606fa83a998
Revises:
Create Date: 2023-07-07 23:30:50.921970

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "8606fa83a998"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False, primary_key=True),
        sa.Column("username", sa.String(length=255), nullable=True),
        sa.Column("password_hash", sa.String(length=255), nullable=True),
        sa.Column("is_admin", sa.Boolean(), nullable=True),
        sa.UniqueConstraint("username"),
    )
    op.create_table(
        "experiment_permissions",
        sa.Column("id", sa.Integer(), nullable=False, primary_key=True),
        sa.Column("experiment_id", sa.String(length=255), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("permission", sa.String(length=255), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], name="fk_user_id"),
        sa.UniqueConstraint("experiment_id", "user_id", name="unique_experiment_user"),
    )
    op.create_table(
        "registered_model_permissions",
        sa.Column("id", sa.Integer(), nullable=False, primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("permission", sa.String(length=255), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], name="fk_user_id"),
        sa.UniqueConstraint("name", "user_id", name="unique_name_user"),
    )


def downgrade() -> None:
    op.drop_table("registered_model_permissions")
    op.drop_table("experiment_permissions")
    op.drop_table("users")
```

--------------------------------------------------------------------------------

---[FILE: autogenerated_graphql_schema.py]---
Location: mlflow-master/mlflow/server/graphql/autogenerated_graphql_schema.py

```python
# GENERATED FILE. PLEASE DON'T MODIFY.
# Run uv run ./dev/proto_to_graphql/code_generator.py to regenerate.
import graphene
import mlflow
from mlflow.server.graphql.graphql_custom_scalars import LongString
from mlflow.server.graphql.graphql_errors import ApiError
from mlflow.utils.proto_json_utils import parse_dict


class MlflowDeploymentJobConnectionState(graphene.Enum):
    DEPLOYMENT_JOB_CONNECTION_STATE_UNSPECIFIED = 1
    NOT_SET_UP = 2
    CONNECTED = 3
    NOT_FOUND = 4
    REQUIRED_PARAMETERS_CHANGED = 5


class MlflowModelVersionDeploymentJobStateDeploymentJobRunState(graphene.Enum):
    DEPLOYMENT_JOB_RUN_STATE_UNSPECIFIED = 1
    NO_VALID_DEPLOYMENT_JOB_FOUND = 2
    RUNNING = 3
    SUCCEEDED = 4
    FAILED = 5
    PENDING = 6
    APPROVAL = 7


class MlflowModelVersionStatus(graphene.Enum):
    PENDING_REGISTRATION = 1
    FAILED_REGISTRATION = 2
    READY = 3


class MlflowRunStatus(graphene.Enum):
    RUNNING = 1
    SCHEDULED = 2
    FINISHED = 3
    FAILED = 4
    KILLED = 5


class MlflowViewType(graphene.Enum):
    ACTIVE_ONLY = 1
    DELETED_ONLY = 2
    ALL = 3


class MlflowModelVersionDeploymentJobState(graphene.ObjectType):
    job_id = graphene.String()
    run_id = graphene.String()
    job_state = graphene.Field(MlflowDeploymentJobConnectionState)
    run_state = graphene.Field(MlflowModelVersionDeploymentJobStateDeploymentJobRunState)
    current_task_name = graphene.String()


class MlflowModelMetric(graphene.ObjectType):
    key = graphene.String()
    value = graphene.Float()
    timestamp = LongString()
    step = LongString()
    dataset_name = graphene.String()
    dataset_digest = graphene.String()
    model_id = graphene.String()
    run_id = graphene.String()


class MlflowModelParam(graphene.ObjectType):
    name = graphene.String()
    value = graphene.String()


class MlflowModelVersionTag(graphene.ObjectType):
    key = graphene.String()
    value = graphene.String()


class MlflowModelVersion(graphene.ObjectType):
    name = graphene.String()
    version = graphene.String()
    creation_timestamp = LongString()
    last_updated_timestamp = LongString()
    user_id = graphene.String()
    current_stage = graphene.String()
    description = graphene.String()
    source = graphene.String()
    run_id = graphene.String()
    status = graphene.Field(MlflowModelVersionStatus)
    status_message = graphene.String()
    tags = graphene.List(graphene.NonNull(MlflowModelVersionTag))
    run_link = graphene.String()
    aliases = graphene.List(graphene.String)
    model_id = graphene.String()
    model_params = graphene.List(graphene.NonNull(MlflowModelParam))
    model_metrics = graphene.List(graphene.NonNull(MlflowModelMetric))
    deployment_job_state = graphene.Field(MlflowModelVersionDeploymentJobState)


class MlflowSearchModelVersionsResponse(graphene.ObjectType):
    model_versions = graphene.List(graphene.NonNull(MlflowModelVersion))
    next_page_token = graphene.String()
    apiError = graphene.Field(ApiError)


class MlflowDatasetSummary(graphene.ObjectType):
    experiment_id = graphene.String()
    name = graphene.String()
    digest = graphene.String()
    context = graphene.String()


class MlflowSearchDatasetsResponse(graphene.ObjectType):
    dataset_summaries = graphene.List(graphene.NonNull(MlflowDatasetSummary))
    apiError = graphene.Field(ApiError)


class MlflowMetricWithRunId(graphene.ObjectType):
    key = graphene.String()
    value = graphene.Float()
    timestamp = LongString()
    step = LongString()
    run_id = graphene.String()


class MlflowGetMetricHistoryBulkIntervalResponse(graphene.ObjectType):
    metrics = graphene.List(graphene.NonNull(MlflowMetricWithRunId))
    apiError = graphene.Field(ApiError)


class MlflowFileInfo(graphene.ObjectType):
    path = graphene.String()
    is_dir = graphene.Boolean()
    file_size = LongString()


class MlflowListArtifactsResponse(graphene.ObjectType):
    root_uri = graphene.String()
    files = graphene.List(graphene.NonNull(MlflowFileInfo))
    next_page_token = graphene.String()
    apiError = graphene.Field(ApiError)


class MlflowModelOutput(graphene.ObjectType):
    model_id = graphene.String()
    step = LongString()


class MlflowRunOutputs(graphene.ObjectType):
    model_outputs = graphene.List(graphene.NonNull(MlflowModelOutput))


class MlflowModelInput(graphene.ObjectType):
    model_id = graphene.String()


class MlflowDataset(graphene.ObjectType):
    name = graphene.String()
    digest = graphene.String()
    source_type = graphene.String()
    source = graphene.String()
    schema = graphene.String()
    profile = graphene.String()


class MlflowInputTag(graphene.ObjectType):
    key = graphene.String()
    value = graphene.String()


class MlflowDatasetInput(graphene.ObjectType):
    tags = graphene.List(graphene.NonNull(MlflowInputTag))
    dataset = graphene.Field(MlflowDataset)


class MlflowRunInputs(graphene.ObjectType):
    dataset_inputs = graphene.List(graphene.NonNull(MlflowDatasetInput))
    model_inputs = graphene.List(graphene.NonNull(MlflowModelInput))


class MlflowRunTag(graphene.ObjectType):
    key = graphene.String()
    value = graphene.String()


class MlflowParam(graphene.ObjectType):
    key = graphene.String()
    value = graphene.String()


class MlflowMetric(graphene.ObjectType):
    key = graphene.String()
    value = graphene.Float()
    timestamp = LongString()
    step = LongString()
    dataset_name = graphene.String()
    dataset_digest = graphene.String()
    model_id = graphene.String()
    run_id = graphene.String()


class MlflowRunData(graphene.ObjectType):
    metrics = graphene.List(graphene.NonNull('mlflow.server.graphql.graphql_schema_extensions.MlflowMetricExtension'))
    params = graphene.List(graphene.NonNull(MlflowParam))
    tags = graphene.List(graphene.NonNull(MlflowRunTag))


class MlflowRunInfo(graphene.ObjectType):
    run_id = graphene.String()
    run_uuid = graphene.String()
    run_name = graphene.String()
    experiment_id = graphene.String()
    user_id = graphene.String()
    status = graphene.Field(MlflowRunStatus)
    start_time = LongString()
    end_time = LongString()
    artifact_uri = graphene.String()
    lifecycle_stage = graphene.String()


class MlflowRun(graphene.ObjectType):
    info = graphene.Field(MlflowRunInfo)
    data = graphene.Field(MlflowRunData)
    inputs = graphene.Field(MlflowRunInputs)
    outputs = graphene.Field(MlflowRunOutputs)


class MlflowSearchRunsResponse(graphene.ObjectType):
    runs = graphene.List(graphene.NonNull('mlflow.server.graphql.graphql_schema_extensions.MlflowRunExtension'))
    next_page_token = graphene.String()
    apiError = graphene.Field(ApiError)


class MlflowGetRunResponse(graphene.ObjectType):
    run = graphene.Field('mlflow.server.graphql.graphql_schema_extensions.MlflowRunExtension')
    apiError = graphene.Field(ApiError)


class MlflowExperimentTag(graphene.ObjectType):
    key = graphene.String()
    value = graphene.String()


class MlflowExperiment(graphene.ObjectType):
    experiment_id = graphene.String()
    name = graphene.String()
    artifact_location = graphene.String()
    lifecycle_stage = graphene.String()
    last_update_time = LongString()
    creation_time = LongString()
    tags = graphene.List(graphene.NonNull(MlflowExperimentTag))


class MlflowGetExperimentResponse(graphene.ObjectType):
    experiment = graphene.Field(MlflowExperiment)
    apiError = graphene.Field(ApiError)


class MlflowSearchModelVersionsInput(graphene.InputObjectType):
    filter = graphene.String()
    max_results = LongString()
    order_by = graphene.List(graphene.String)
    page_token = graphene.String()


class MlflowSearchDatasetsInput(graphene.InputObjectType):
    experiment_ids = graphene.List(graphene.String)


class MlflowGetMetricHistoryBulkIntervalInput(graphene.InputObjectType):
    run_ids = graphene.List(graphene.String)
    metric_key = graphene.String()
    start_step = graphene.Int()
    end_step = graphene.Int()
    max_results = graphene.Int()


class MlflowListArtifactsInput(graphene.InputObjectType):
    run_id = graphene.String()
    run_uuid = graphene.String()
    path = graphene.String()
    page_token = graphene.String()


class MlflowSearchRunsInput(graphene.InputObjectType):
    experiment_ids = graphene.List(graphene.String)
    filter = graphene.String()
    run_view_type = graphene.Field(MlflowViewType)
    max_results = graphene.Int()
    order_by = graphene.List(graphene.String)
    page_token = graphene.String()


class MlflowGetRunInput(graphene.InputObjectType):
    run_id = graphene.String()
    run_uuid = graphene.String()


class MlflowGetExperimentInput(graphene.InputObjectType):
    experiment_id = graphene.String()


class QueryType(graphene.ObjectType):
    mlflow_get_experiment = graphene.Field(MlflowGetExperimentResponse, input=MlflowGetExperimentInput())
    mlflow_get_metric_history_bulk_interval = graphene.Field(MlflowGetMetricHistoryBulkIntervalResponse, input=MlflowGetMetricHistoryBulkIntervalInput())
    mlflow_get_run = graphene.Field(MlflowGetRunResponse, input=MlflowGetRunInput())
    mlflow_list_artifacts = graphene.Field(MlflowListArtifactsResponse, input=MlflowListArtifactsInput())
    mlflow_search_model_versions = graphene.Field(MlflowSearchModelVersionsResponse, input=MlflowSearchModelVersionsInput())

    def resolve_mlflow_get_experiment(self, info, input):
        input_dict = vars(input)
        request_message = mlflow.protos.service_pb2.GetExperiment()
        parse_dict(input_dict, request_message)
        return mlflow.server.handlers.get_experiment_impl(request_message)

    def resolve_mlflow_get_metric_history_bulk_interval(self, info, input):
        input_dict = vars(input)
        request_message = mlflow.protos.service_pb2.GetMetricHistoryBulkInterval()
        parse_dict(input_dict, request_message)
        return mlflow.server.handlers.get_metric_history_bulk_interval_impl(request_message)

    def resolve_mlflow_get_run(self, info, input):
        input_dict = vars(input)
        request_message = mlflow.protos.service_pb2.GetRun()
        parse_dict(input_dict, request_message)
        return mlflow.server.handlers.get_run_impl(request_message)

    def resolve_mlflow_list_artifacts(self, info, input):
        input_dict = vars(input)
        request_message = mlflow.protos.service_pb2.ListArtifacts()
        parse_dict(input_dict, request_message)
        return mlflow.server.handlers.list_artifacts_impl(request_message)

    def resolve_mlflow_search_model_versions(self, info, input):
        input_dict = vars(input)
        request_message = mlflow.protos.model_registry_pb2.SearchModelVersions()
        parse_dict(input_dict, request_message)
        return mlflow.server.handlers.search_model_versions_impl(request_message)


class MutationType(graphene.ObjectType):
    mlflow_search_datasets = graphene.Field(MlflowSearchDatasetsResponse, input=MlflowSearchDatasetsInput())
    mlflow_search_runs = graphene.Field(MlflowSearchRunsResponse, input=MlflowSearchRunsInput())

    def resolve_mlflow_search_datasets(self, info, input):
        input_dict = vars(input)
        request_message = mlflow.protos.service_pb2.SearchDatasets()
        parse_dict(input_dict, request_message)
        return mlflow.server.handlers.search_datasets_impl(request_message)

    def resolve_mlflow_search_runs(self, info, input):
        input_dict = vars(input)
        request_message = mlflow.protos.service_pb2.SearchRuns()
        parse_dict(input_dict, request_message)
        return mlflow.server.handlers.search_runs_impl(request_message)
```

--------------------------------------------------------------------------------

---[FILE: graphql_custom_scalars.py]---
Location: mlflow-master/mlflow/server/graphql/graphql_custom_scalars.py

```python
import graphene
from graphql.language.ast import IntValueNode


class LongString(graphene.Scalar):
    """
    LongString Scalar type to prevent truncation to max integer in JavaScript.
    """

    description = "Long converted to string to prevent truncation to max integer in JavaScript"

    @staticmethod
    def serialize(long):
        return str(long)

    @staticmethod
    def parse_literal(node):
        if isinstance(node, IntValueNode):
            return int(node.value)
        return None

    @staticmethod
    def parse_value(value):
        return int(value)
```

--------------------------------------------------------------------------------

---[FILE: graphql_errors.py]---
Location: mlflow-master/mlflow/server/graphql/graphql_errors.py

```python
import graphene


class ErrorDetail(graphene.ObjectType):
    # NOTE: This is not an exhaustive list, might need to add more things in the future if needed.
    field = graphene.String()
    message = graphene.String()


class ApiError(graphene.ObjectType):
    code = graphene.String()
    message = graphene.String()
    help_url = graphene.String()
    trace_id = graphene.String()
    error_details = graphene.List(ErrorDetail)
```

--------------------------------------------------------------------------------

---[FILE: graphql_no_batching.py]---
Location: mlflow-master/mlflow/server/graphql/graphql_no_batching.py

```python
from typing import NamedTuple

from graphql.error import GraphQLError
from graphql.execution import ExecutionResult
from graphql.language.ast import DocumentNode, FieldNode

from mlflow.environment_variables import (
    MLFLOW_SERVER_GRAPHQL_MAX_ALIASES,
    MLFLOW_SERVER_GRAPHQL_MAX_ROOT_FIELDS,
)

_MAX_DEPTH = 10
_MAX_SELECTIONS = 1000


class QueryInfo(NamedTuple):
    root_fields: int
    max_aliases: int


def scan_query(ast_node: DocumentNode) -> QueryInfo:
    """
    Scan a GraphQL query and return its information.
    """
    root_fields = 0
    max_aliases = 0
    total_selections = 0

    for definition in ast_node.definitions:
        if selection_set := getattr(definition, "selection_set", None):
            stack = [(selection_set, 1)]
            while stack:
                selection_set, depth = stack.pop()

                # check current level depth
                if depth > _MAX_DEPTH:
                    raise GraphQLError(f"Query exceeds maximum depth of {_MAX_DEPTH}")

                selections = getattr(selection_set, "selections", [])

                # check current level aliases
                current_aliases = 0
                for selection in selections:
                    if isinstance(selection, FieldNode):
                        if depth == 1:
                            root_fields += 1
                        if selection.alias:
                            current_aliases += 1
                        if selection.selection_set:
                            stack.append((selection.selection_set, depth + 1))
                        total_selections += 1
                        if total_selections > _MAX_SELECTIONS:
                            raise GraphQLError(
                                f"Query exceeds maximum total selections of {_MAX_SELECTIONS}"
                            )
                max_aliases = max(max_aliases, current_aliases)

    return QueryInfo(root_fields, max_aliases)


def check_query_safety(ast_node: DocumentNode) -> ExecutionResult | None:
    try:
        query_info = scan_query(ast_node)
    except GraphQLError as e:
        return ExecutionResult(
            data=None,
            errors=[e],
        )

    if query_info.root_fields > MLFLOW_SERVER_GRAPHQL_MAX_ROOT_FIELDS.get():
        msg = "root fields"
        env_var = MLFLOW_SERVER_GRAPHQL_MAX_ROOT_FIELDS
        value = query_info.root_fields
    elif query_info.max_aliases > MLFLOW_SERVER_GRAPHQL_MAX_ALIASES.get():
        msg = "aliases"
        env_var = MLFLOW_SERVER_GRAPHQL_MAX_ALIASES
        value = query_info.max_aliases
    else:
        return None
    return ExecutionResult(
        data=None,
        errors=[
            GraphQLError(
                f"GraphQL queries should have at most {env_var.get()} {msg}, "
                f"got {value} {msg}. To increase the limit, set the "
                f"{env_var.name} environment variable."
            )
        ],
    )
```

--------------------------------------------------------------------------------

---[FILE: graphql_schema_extensions.py]---
Location: mlflow-master/mlflow/server/graphql/graphql_schema_extensions.py

```python
import math

import graphene
from graphql import (
    DirectiveLocation,
    GraphQLArgument,
    GraphQLDirective,
    GraphQLNonNull,
    GraphQLString,
)

import mlflow
from mlflow.server.graphql.autogenerated_graphql_schema import (
    MlflowExperiment,
    MlflowMetric,
    MlflowModelVersion,
    MlflowRun,
    MlflowSearchRunsInput,
    MlflowSearchRunsResponse,
    MutationType,
    QueryType,
)
from mlflow.utils.proto_json_utils import parse_dict

# Component identifier, to keep compatible with Databricks in-house implementations.
ComponentDirective = GraphQLDirective(
    name="component",
    locations=[
        DirectiveLocation.QUERY,
        DirectiveLocation.MUTATION,
    ],
    args={"name": GraphQLArgument(GraphQLNonNull(GraphQLString))},
)


class Test(graphene.ObjectType):
    output = graphene.String(description="Echoes the input string")


class TestMutation(graphene.ObjectType):
    output = graphene.String(description="Echoes the input string")


class MlflowRunExtension(MlflowRun):
    experiment = graphene.Field(MlflowExperiment)
    model_versions = graphene.List(graphene.NonNull(MlflowModelVersion))

    def resolve_experiment(self, info):
        experiment_id = self.info.experiment_id
        input_dict = {"experiment_id": experiment_id}
        request_message = mlflow.protos.service_pb2.GetExperiment()
        parse_dict(input_dict, request_message)
        return mlflow.server.handlers.get_experiment_impl(request_message).experiment

    def resolve_model_versions(self, info):
        run_id = self.info.run_id
        input_dict = {"filter": f"run_id='{run_id}'"}
        request_message = mlflow.protos.model_registry_pb2.SearchModelVersions()
        parse_dict(input_dict, request_message)
        return mlflow.server.handlers.search_model_versions_impl(request_message).model_versions


class MlflowMetricExtension(MlflowMetric):
    value = graphene.Float()

    # metric values that are NaN will cause an error in graphQL validation as
    # the type is Float. as a workaround, we return None if the value is NaN.
    def resolve_value(self, info):
        return None if math.isnan(self.value) else self.value


class Query(QueryType):
    test = graphene.Field(Test, input_string=graphene.String(), description="Simple echoing field")
    mlflow_search_runs = graphene.Field(MlflowSearchRunsResponse, input=MlflowSearchRunsInput())

    def resolve_test(self, info, input_string):
        return {"output": input_string}

    def resolve_mlflow_search_runs(self, info, input):
        input_dict = vars(input)
        request_message = mlflow.protos.service_pb2.SearchRuns()
        parse_dict(input_dict, request_message)
        return mlflow.server.handlers.search_runs_impl(request_message)


class Mutation(MutationType):
    testMutation = graphene.Field(
        TestMutation, input_string=graphene.String(), description="Simple echoing field"
    )

    def resolve_test_mutation(self, info, input_string):
        return {"output": input_string}


schema = graphene.Schema(query=Query, mutation=Mutation, directives=[ComponentDirective])
```

--------------------------------------------------------------------------------

````
