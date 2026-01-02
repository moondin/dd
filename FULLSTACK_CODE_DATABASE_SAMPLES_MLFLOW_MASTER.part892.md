---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 892
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 892 of 991)

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

---[FILE: test_tensorboard_autolog.py]---
Location: mlflow-master/tests/pytorch/test_tensorboard_autolog.py

```python
import time

import mlflow
import mlflow.pytorch

NUM_EPOCHS = 20
START_STEP = 3


def test_pytorch_autolog_logs_expected_data(tmp_path):
    from torch.utils.tensorboard import SummaryWriter

    mlflow.pytorch.autolog(log_every_n_step=1)
    writer = SummaryWriter(str(tmp_path))

    timestamps = []
    with mlflow.start_run() as run:
        for i in range(NUM_EPOCHS):
            t0 = time.time()
            writer.add_scalar("loss", 42.0 + i + START_STEP, global_step=START_STEP + i)
            t1 = time.time()
            timestamps.append((int(t0 * 1000), int(t1 * 1000)))

        writer.add_hparams({"hparam1": 42, "hparam2": "foo"}, {"final_loss": 8})
        writer.close()

    # Checking if metrics are logged.
    client = mlflow.tracking.MlflowClient()
    metric_history = client.get_metric_history(run.info.run_id, "loss")
    assert len(metric_history) == NUM_EPOCHS
    for i, (m, (t0, t1)) in enumerate(zip(metric_history, timestamps), START_STEP):
        assert m.step == i
        assert m.value == 42.0 + i
        assert t0 <= m.timestamp <= t1

    run = client.get_run(run.info.run_id)
    assert run.data.params == {"hparam1": "42", "hparam2": "foo"}
    assert run.data.metrics == {"loss": 64.0, "final_loss": 8}
```

--------------------------------------------------------------------------------

---[FILE: dataset.py]---
Location: mlflow-master/tests/resources/data/dataset.py

```python
import base64
import hashlib
import json
from typing import Any

import numpy as np
import pandas as pd

from mlflow.data.dataset import Dataset
from mlflow.types import Schema
from mlflow.types.utils import _infer_schema

from tests.resources.data.dataset_source import SampleDatasetSource


class SampleDataset(Dataset):
    def __init__(
        self,
        data_list: list[int],
        source: SampleDatasetSource,
        name: str | None = None,
        digest: str | None = None,
    ):
        self._data_list = data_list
        super().__init__(source=source, name=name, digest=digest)

    def _compute_digest(self) -> str:
        """
        Computes a digest for the dataset. Called if the user doesn't supply
        a digest when constructing the dataset.
        """
        hash_md5 = hashlib.md5(usedforsecurity=False)
        for hash_part in pd.util.hash_array(np.array(self._data_list)):
            hash_md5.update(hash_part)
        return base64.b64encode(hash_md5.digest()).decode("ascii")

    def to_dict(self) -> dict[str, str]:
        """
        Returns:
            A string dictionary containing the following fields: name,
            digest, source, source type, schema (optional), profile
            (optional).
        """
        config = super().to_dict()
        config.update(
            {
                "schema": json.dumps({"mlflow_colspec": self.schema.to_dict()}),
                "profile": json.dumps(self.profile),
            }
        )
        return config

    @property
    def data_list(self) -> list[int]:
        return self._data_list

    @property
    def source(self) -> SampleDatasetSource:
        return self._source

    @property
    def profile(self) -> Any | None:
        return {
            "length": len(self._data_list),
        }

    @property
    def schema(self) -> Schema:
        return _infer_schema(np.array(self._data_list))
```

--------------------------------------------------------------------------------

---[FILE: dataset_source.py]---
Location: mlflow-master/tests/resources/data/dataset_source.py

```python
from typing import Any
from urllib.parse import urlparse

from mlflow.artifacts import download_artifacts
from mlflow.data.dataset_source import DatasetSource
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE


class SampleDatasetSource(DatasetSource):
    def __init__(self, uri):
        self._uri = uri

    @property
    def uri(self):
        return self._uri

    @staticmethod
    def _get_source_type() -> str:
        return "test"

    def load(self) -> str:
        # Ignore the "test" URI scheme and download the local path
        parsed_uri = urlparse(self._uri)
        return download_artifacts(parsed_uri.path)

    @staticmethod
    def _can_resolve(raw_source: Any) -> bool:
        if not isinstance(raw_source, str):
            return False

        try:
            parsed_source = urlparse(raw_source)
            return parsed_source.scheme == "test"
        except Exception:
            return False

    @classmethod
    def _resolve(cls, raw_source: Any) -> DatasetSource:
        return cls(raw_source)

    def to_dict(self) -> dict[Any, Any]:
        return {"uri": self.uri}

    @classmethod
    def from_dict(cls, source_dict: dict[Any, Any]) -> DatasetSource:
        uri = source_dict.get("uri")
        if uri is None:
            raise MlflowException(
                'Failed to parse dummy dataset source. Missing expected key: "uri"',
                INVALID_PARAMETER_VALUE,
            )

        return cls(uri=uri)
```

--------------------------------------------------------------------------------

---[FILE: db_version_7ac759974ad8_with_metrics_expected_values.json]---
Location: mlflow-master/tests/resources/db/db_version_7ac759974ad8_with_metrics_expected_values.json

```json
{
  "bd263e2b04b04460a40c1acae72a18ae": {
    "metric_1": -2.5797830282214,
    "metric_0": -2.434975966906267,
    "metric_3": -0.9688077263066934,
    "metric_2": -1.4438003481072212
  },
  "55461e2180fb40338072c04ff86fd0f9": {
    "metric_1": -2.2857451912150792,
    "metric_0": 3.4173603047073176,
    "metric_3": -0.24019895935855473,
    "metric_2": -0.7097425052930393
  },
  "123810810b234e9b8b97fb1e00abd9aa": {
    "metric_1": 0.7308706035999548,
    "metric_0": 3.0994891921059544,
    "metric_3": 1.9819820891007573,
    "metric_2": 0.48569560278784785
  },
  "66fbc3c813944c1a80d2336849c6e72f": {
    "metric_1": -2.672718621393841,
    "metric_0": -1.7902590711838267,
    "metric_3": 2.477982822663786,
    "metric_2": 1.273023064731822
  },
  "83698fafa8714bd3929b9c38bf6cdee8": {
    "metric_1": -2.292131339453693,
    "metric_0": 3.3064205155126096,
    "metric_3": -0.46183104891365634,
    "metric_2": 0.8465206209214458
  },
  "79461e9d7aa24e18a626f61b047315c8": {
    "metric_1": -0.006443567706641673,
    "metric_0": 1.8136489475666746,
    "metric_3": 2.6700440103809013,
    "metric_2": 0.1556304999295106
  },
  "6870761df41f4350adbd37f2a18eb641": {
    "metric_1": -0.24614682477958416,
    "metric_0": -1.5486858485543848,
    "metric_3": -2.742733532695466,
    "metric_2": 3.0344898094132358
  },
  "eb124e3ef9c04109a65372aab4222307": {
    "metric_1": -1.9754772100389224,
    "metric_0": -0.6234240819980461,
    "metric_3": -2.4020972270978844,
    "metric_2": 2.7962318576455436
  },
  "39c152b25fb04c08b3cf4a4c8ebccb7c": {
    "metric_1": -2.149649101035413,
    "metric_0": 0.7310583410679579,
    "metric_3": 1.1244662209560552,
    "metric_2": -2.0257045260054656
  },
  "1b92583de96c4fd88ff5b04e866aff8c": {
    "metric_1": -0.02959618784025775,
    "metric_0": -0.2931365711894838,
    "metric_3": 3.1567281048311546,
    "metric_2": 2.9203148639651495
  },
  "3c28149e5ab44efb8d7f4b3c11ab0cb1": {
    "metric_1": -2.0944626407865288,
    "metric_0": 3.779234079600906,
    "metric_3": -2.9467929849482024,
    "metric_2": -1.4704105222912913
  },
  "1afafa10e69a4083bb88a96b23547b7b": {
    "metric_1": -0.10343236992763893,
    "metric_0": 2.28372065230554,
    "metric_3": 2.0481770225881615,
    "metric_2": -1.1601122975618
  },
  "5f9c5e48ff844c0498199b390ca9c1a4": {
    "metric_1": 2.4422641299267553,
    "metric_0": -1.8107502356154743,
    "metric_3": 3.6679213677343423,
    "metric_2": -1.8061767363300147
  },
  "0ffbde81192e43a48482434219cc4458": {
    "metric_1": -1.5559004670240322,
    "metric_0": 0.8721310864910716,
    "metric_3": 2.5822778193072846,
    "metric_2": 0.6969033758109711
  },
  "f9b1cb0a470e4f9b98bd4d36a51e4d31": {
    "metric_1": 2.9364188950633814,
    "metric_0": -0.2344822065779013,
    "metric_3": 3.8849138907360397,
    "metric_2": -2.524561921321326
  },
  "99d7cdc4d77f4103937bbb9a70c5d4c8": {
    "metric_1": 0.8548586864241012,
    "metric_0": 0.9891059238008051,
    "metric_3": 1.7255056515257134,
    "metric_2": -0.958042549612474
  },
  "f662d9fdd072422899f1a91dca132e45": {
    "metric_eq_ts_step": 4.7
  },
  "8c27fb8d3d734fc988eafc7e130af2c1": {
    "metric_1": 0.2568792149591985,
    "metric_0": -2.9251778063945633,
    "metric_3": 3.5795601350695536,
    "metric_2": 2.2358743640336654
  },
  "46830b05f4914ce980ee960921474308": {
    "metric_1": -2.4512019495254855,
    "metric_0": -1.7363712773941686,
    "metric_3": -0.6764695293332332,
    "metric_2": 0.902757467400038
  },
  "2bf6a4001dda47a89bd0dd1b638900c8": {
    "metric_1": 1.4881757006157033,
    "metric_0": -2.184521948675489,
    "metric_3": 1.5024111371215891,
    "metric_2": -0.9992038125180369
  },
  "bf3f29f1c16741e8b2de46b8af7f26db": {
    "metric_1": -2.856136683397856,
    "metric_0": 1.7351206329209488,
    "metric_3": 3.3574106252540243,
    "metric_2": 1.898369877601997
  },
  "8a56867ed3af4ead84ac5c215c43d2f2": {
    "metric_1": -1.6845465954407057,
    "metric_0": 2.799113454790449,
    "metric_3": -1.9554854183785264,
    "metric_2": 1.2596708758008042
  },
  "0e77b745f78c4985825c66aafb15f45e": {
    "metric_1": -0.5966921249245285,
    "metric_0": 0.38303481722942134,
    "metric_3": 1.4751754578912797,
    "metric_2": -2.935488516752223
  },
  "f8a6361f177a40b291751d743ec0cd52": {
    "metric_1": -2.52066603748033,
    "metric_0": -0.7281695813441598,
    "metric_3": 0.3529736105779344,
    "metric_2": -1.603741841379303
  },
  "8c6d7c99dc014b15b5ccec784110b83f": {
    "metric_1": -1.2231009149094496,
    "metric_0": 1.4079626574511428,
    "metric_3": 2.5892028641452907,
    "metric_2": 3.643033981543657
  },
  "9af4b84d78524c4ab08161e7b5f7f2dc": {
    "metric_1": 0.2702968551842675,
    "metric_0": 0.11248586282952555,
    "metric_3": -1.533809108651962,
    "metric_2": 1.678493181317803
  }
}
```

--------------------------------------------------------------------------------

---[FILE: initial_models.py]---
Location: mlflow-master/tests/resources/db/initial_models.py
Signals: SQLAlchemy

```python
# Snapshot of MLflow DB models as of the 0.9.1 release, prior to the first database migration.
# This file corresponds to the first database schema that we can reasonably expect users to be
# running and exists to test that the oldest database schema can be brought up-to-date.
# Copied from https://github.com/mlflow/mlflow/blob/v0.9.1/mlflow/store/dbmodels/models.py, with
# modifications to substitute constants from MLflow with hard-coded values (e.g. replacing
# SourceType.to_string(SourceType.NOTEBOOK) with the constant "NOTEBOOK").
import time

from sqlalchemy import (
    BigInteger,
    CheckConstraint,
    Column,
    Float,
    ForeignKey,
    Integer,
    PrimaryKeyConstraint,
    String,
)
from sqlalchemy.orm import backref, declarative_base, relationship

Base = declarative_base()


SourceTypes = [
    "NOTEBOOK",
    "JOB",
    "LOCAL",
    "UNKNOWN",
    "PROJECT",
]

RunStatusTypes = [
    "SCHEDULED",
    "FAILED",
    "FINISHED",
    "RUNNING",
]


class SqlExperiment(Base):
    """
    DB model for :py:class:`mlflow.entities.Experiment`. These are recorded in ``experiment`` table.
    """

    __tablename__ = "experiments"

    experiment_id = Column(Integer, autoincrement=True)
    """
    Experiment ID: `Integer`. *Primary Key* for ``experiment`` table.
    """
    name = Column(String(256), unique=True, nullable=False)
    """
    Experiment name: `String` (limit 256 characters). Defined as *Unique* and *Non null* in
                     table schema.
    """
    artifact_location = Column(String(256), nullable=True)
    """
    Default artifact location for this experiment: `String` (limit 256 characters). Defined as
                                                    *Non null* in table schema.
    """
    lifecycle_stage = Column(String(32), default="active")
    """
    Lifecycle Stage of experiment: `String` (limit 32 characters).
                                    Can be either ``active`` (default) or ``deleted``.
    """

    __table_args__ = (
        CheckConstraint(lifecycle_stage.in_(["active", "deleted"]), name="lifecycle_stage"),
        PrimaryKeyConstraint("experiment_id", name="experiment_pk"),
    )

    def __repr__(self):
        return f"<SqlExperiment ({self.experiment_id}, {self.name})>"


class SqlRun(Base):
    """
    DB model for :py:class:`mlflow.entities.Run`. These are recorded in ``runs`` table.
    """

    __tablename__ = "runs"

    run_uuid = Column(String(32), nullable=False)
    """
    Run UUID: `String` (limit 32 characters). *Primary Key* for ``runs`` table.
    """
    name = Column(String(250))
    """
    Run name: `String` (limit 250 characters).
    """
    source_type = Column(String(20), default="LOCAL")
    """
    Source Type: `String` (limit 20 characters). Can be one of ``NOTEBOOK``, ``JOB``, ``PROJECT``,
                 ``LOCAL`` (default), or ``UNKNOWN``.
    """
    source_name = Column(String(500))
    """
    Name of source recording the run: `String` (limit 500 characters).
    """
    entry_point_name = Column(String(50))
    """
    Entry-point name that launched the run run: `String` (limit 50 characters).
    """
    user_id = Column(String(256), nullable=True, default=None)
    """
    User ID: `String` (limit 256 characters). Defaults to ``null``.
    """
    status = Column(String(20), default="SCHEDULED")
    """
    Run Status: `String` (limit 20 characters). Can be one of ``RUNNING``, ``SCHEDULED`` (default),
                ``FINISHED``, ``FAILED``.
    """
    start_time = Column(BigInteger, default=int(time.time()))
    """
    Run start time: `BigInteger`. Defaults to current system time.
    """
    end_time = Column(BigInteger, nullable=True, default=None)
    """
    Run end time: `BigInteger`.
    """
    deleted_time = Column(BigInteger, nullable=True, default=None)
    """
    Run deleted time: `BigInteger`. Timestamp of when run is deleted, defaults to none.
    """
    source_version = Column(String(50))
    """
    Source version: `String` (limit 50 characters).
    """
    lifecycle_stage = Column(String(20), default="active")
    """
    Lifecycle Stage of run: `String` (limit 32 characters).
                            Can be either ``active`` (default) or ``deleted``.
    """
    artifact_uri = Column(String(200), default=None)
    """
    Default artifact location for this run: `String` (limit 200 characters).
    """
    experiment_id = Column(Integer, ForeignKey("experiments.experiment_id"))
    """
    Experiment ID to which this run belongs to: *Foreign Key* into ``experiment`` table.
    """
    experiment = relationship("SqlExperiment", backref=backref("runs", cascade="all"))
    """
    SQLAlchemy relationship (many:one) with :py:class:`mlflow.store.dbmodels.models.SqlExperiment`.
    """

    __table_args__ = (
        CheckConstraint(source_type.in_(SourceTypes), name="source_type"),
        CheckConstraint(status.in_(RunStatusTypes), name="status"),
        CheckConstraint(lifecycle_stage.in_(["active", "deleted"]), name="lifecycle_stage"),
        PrimaryKeyConstraint("run_uuid", name="run_pk"),
    )


class SqlTag(Base):
    """
    DB model for :py:class:`mlflow.entities.RunTag`. These are recorded in ``tags`` table.
    """

    __tablename__ = "tags"

    key = Column(String(250))
    """
    Tag key: `String` (limit 250 characters). *Primary Key* for ``tags`` table.
    """
    value = Column(String(250), nullable=True)
    """
    Value associated with tag: `String` (limit 250 characters). Could be *null*.
    """
    run_uuid = Column(String(32), ForeignKey("runs.run_uuid"))
    """
    Run UUID to which this tag belongs to: *Foreign Key* into ``runs`` table.
    """
    run = relationship("SqlRun", backref=backref("tags", cascade="all"))
    """
    SQLAlchemy relationship (many:one) with :py:class:`mlflow.store.dbmodels.models.SqlRun`.
    """

    __table_args__ = (PrimaryKeyConstraint("key", "run_uuid", name="tag_pk"),)

    def __repr__(self):
        return f"<SqlRunTag({self.key}, {self.value})>"


class SqlMetric(Base):
    __tablename__ = "metrics"

    key = Column(String(250))
    """
    Metric key: `String` (limit 250 characters). Part of *Primary Key* for ``metrics`` table.
    """
    value = Column(Float, nullable=False)
    """
    Metric value: `Float`. Defined as *Non-null* in schema.
    """
    timestamp = Column(BigInteger, default=lambda: int(time.time()))
    """
    Timestamp recorded for this metric entry: `BigInteger`. Part of *Primary Key* for
                                               ``metrics`` table.
    """
    run_uuid = Column(String(32), ForeignKey("runs.run_uuid"))
    """
    Run UUID to which this metric belongs to: Part of *Primary Key* for ``metrics`` table.
                                              *Foreign Key* into ``runs`` table.
    """
    run = relationship("SqlRun", backref=backref("metrics", cascade="all"))
    """
    SQLAlchemy relationship (many:one) with :py:class:`mlflow.store.dbmodels.models.SqlRun`.
    """

    __table_args__ = (PrimaryKeyConstraint("key", "timestamp", "run_uuid", name="metric_pk"),)

    def __repr__(self):
        return f"<SqlMetric({self.key}, {self.value}, {self.timestamp})>"


class SqlParam(Base):
    __tablename__ = "params"

    key = Column(String(250))
    """
    Param key: `String` (limit 250 characters). Part of *Primary Key* for ``params`` table.
    """
    value = Column(String(250), nullable=False)
    """
    Param value: `String` (limit 250 characters). Defined as *Non-null* in schema.
    """
    run_uuid = Column(String(32), ForeignKey("runs.run_uuid"))
    """
    Run UUID to which this metric belongs to: Part of *Primary Key* for ``params`` table.
                                              *Foreign Key* into ``runs`` table.
    """
    run = relationship("SqlRun", backref=backref("params", cascade="all"))
    """
    SQLAlchemy relationship (many:one) with :py:class:`mlflow.store.dbmodels.models.SqlRun`.
    """

    __table_args__ = (PrimaryKeyConstraint("key", "run_uuid", name="param_pk"),)

    def __repr__(self):
        return f"<SqlParam({self.key}, {self.value})>"
```

--------------------------------------------------------------------------------

---[FILE: latest_schema.sql]---
Location: mlflow-master/tests/resources/db/latest_schema.sql

```sql

CREATE TABLE alembic_version (
	version_num VARCHAR(32) NOT NULL,
	CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
)


CREATE TABLE endpoints (
	endpoint_id VARCHAR(36) NOT NULL,
	name VARCHAR(255),
	created_by VARCHAR(255),
	created_at BIGINT NOT NULL,
	last_updated_by VARCHAR(255),
	last_updated_at BIGINT NOT NULL,
	CONSTRAINT endpoints_pk PRIMARY KEY (endpoint_id)
)


CREATE TABLE entity_associations (
	association_id VARCHAR(36) NOT NULL,
	source_type VARCHAR(36) NOT NULL,
	source_id VARCHAR(36) NOT NULL,
	destination_type VARCHAR(36) NOT NULL,
	destination_id VARCHAR(36) NOT NULL,
	created_time BIGINT,
	CONSTRAINT entity_associations_pk PRIMARY KEY (source_type, source_id, destination_type, destination_id)
)


CREATE TABLE evaluation_datasets (
	dataset_id VARCHAR(36) NOT NULL,
	name VARCHAR(255) NOT NULL,
	schema TEXT,
	profile TEXT,
	digest VARCHAR(64),
	created_time BIGINT,
	last_update_time BIGINT,
	created_by VARCHAR(255),
	last_updated_by VARCHAR(255),
	CONSTRAINT evaluation_datasets_pk PRIMARY KEY (dataset_id)
)


CREATE TABLE experiments (
	experiment_id INTEGER NOT NULL,
	name VARCHAR(256) NOT NULL,
	artifact_location VARCHAR(256),
	lifecycle_stage VARCHAR(32),
	creation_time BIGINT,
	last_update_time BIGINT,
	CONSTRAINT experiment_pk PRIMARY KEY (experiment_id),
	UNIQUE (name),
	CONSTRAINT experiments_lifecycle_stage CHECK (lifecycle_stage IN ('active', 'deleted'))
)


CREATE TABLE input_tags (
	input_uuid VARCHAR(36) NOT NULL,
	name VARCHAR(255) NOT NULL,
	value VARCHAR(500) NOT NULL,
	CONSTRAINT input_tags_pk PRIMARY KEY (input_uuid, name)
)


CREATE TABLE inputs (
	input_uuid VARCHAR(36) NOT NULL,
	source_type VARCHAR(36) NOT NULL,
	source_id VARCHAR(36) NOT NULL,
	destination_type VARCHAR(36) NOT NULL,
	destination_id VARCHAR(36) NOT NULL,
	step BIGINT DEFAULT '0' NOT NULL,
	CONSTRAINT inputs_pk PRIMARY KEY (source_type, source_id, destination_type, destination_id)
)


CREATE TABLE jobs (
	id VARCHAR(36) NOT NULL,
	creation_time BIGINT NOT NULL,
	job_name VARCHAR(500) NOT NULL,
	params TEXT NOT NULL,
	timeout FLOAT,
	status INTEGER NOT NULL,
	result TEXT,
	retry_count INTEGER NOT NULL,
	last_update_time BIGINT NOT NULL,
	CONSTRAINT jobs_pk PRIMARY KEY (id)
)


CREATE TABLE registered_models (
	name VARCHAR(256) NOT NULL,
	creation_time BIGINT,
	last_updated_time BIGINT,
	description VARCHAR(5000),
	CONSTRAINT registered_model_pk PRIMARY KEY (name),
	UNIQUE (name)
)


CREATE TABLE secrets (
	secret_id VARCHAR(36) NOT NULL,
	secret_name VARCHAR(255) NOT NULL,
	encrypted_value BLOB NOT NULL,
	wrapped_dek BLOB NOT NULL,
	kek_version INTEGER NOT NULL,
	masked_value VARCHAR(100) NOT NULL,
	provider VARCHAR(64),
	auth_config TEXT,
	description TEXT,
	created_by VARCHAR(255),
	created_at BIGINT NOT NULL,
	last_updated_by VARCHAR(255),
	last_updated_at BIGINT NOT NULL,
	CONSTRAINT secrets_pk PRIMARY KEY (secret_id)
)


CREATE TABLE webhooks (
	webhook_id VARCHAR(256) NOT NULL,
	name VARCHAR(256) NOT NULL,
	description VARCHAR(1000),
	url VARCHAR(500) NOT NULL,
	status VARCHAR(20) DEFAULT 'ACTIVE' NOT NULL,
	secret VARCHAR(1000),
	creation_timestamp BIGINT,
	last_updated_timestamp BIGINT,
	deleted_timestamp BIGINT,
	CONSTRAINT webhook_pk PRIMARY KEY (webhook_id)
)


CREATE TABLE datasets (
	dataset_uuid VARCHAR(36) NOT NULL,
	experiment_id INTEGER NOT NULL,
	name VARCHAR(500) NOT NULL,
	digest VARCHAR(36) NOT NULL,
	dataset_source_type VARCHAR(36) NOT NULL,
	dataset_source TEXT NOT NULL,
	dataset_schema TEXT,
	dataset_profile TEXT,
	CONSTRAINT dataset_pk PRIMARY KEY (experiment_id, name, digest),
	CONSTRAINT fk_datasets_experiment_id_experiments FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id) ON DELETE CASCADE
)


CREATE TABLE endpoint_bindings (
	endpoint_id VARCHAR(36) NOT NULL,
	resource_type VARCHAR(50) NOT NULL,
	resource_id VARCHAR(255) NOT NULL,
	created_at BIGINT NOT NULL,
	created_by VARCHAR(255),
	last_updated_at BIGINT NOT NULL,
	last_updated_by VARCHAR(255),
	CONSTRAINT endpoint_bindings_pk PRIMARY KEY (endpoint_id, resource_type, resource_id),
	CONSTRAINT fk_endpoint_bindings_endpoint_id FOREIGN KEY(endpoint_id) REFERENCES endpoints (endpoint_id) ON DELETE CASCADE
)


CREATE TABLE endpoint_tags (
	key VARCHAR(250) NOT NULL,
	value VARCHAR(5000),
	endpoint_id VARCHAR(36) NOT NULL,
	CONSTRAINT endpoint_tag_pk PRIMARY KEY (key, endpoint_id),
	CONSTRAINT fk_endpoint_tags_endpoint_id FOREIGN KEY(endpoint_id) REFERENCES endpoints (endpoint_id) ON DELETE CASCADE
)


CREATE TABLE evaluation_dataset_records (
	dataset_record_id VARCHAR(36) NOT NULL,
	dataset_id VARCHAR(36) NOT NULL,
	inputs JSON NOT NULL,
	expectations JSON,
	tags JSON,
	source JSON,
	source_id VARCHAR(36),
	source_type VARCHAR(255),
	created_time BIGINT,
	last_update_time BIGINT,
	created_by VARCHAR(255),
	last_updated_by VARCHAR(255),
	input_hash VARCHAR(64) NOT NULL,
	outputs JSON,
	CONSTRAINT evaluation_dataset_records_pk PRIMARY KEY (dataset_record_id),
	CONSTRAINT fk_evaluation_dataset_records_dataset_id FOREIGN KEY(dataset_id) REFERENCES evaluation_datasets (dataset_id) ON DELETE CASCADE,
	CONSTRAINT unique_dataset_input UNIQUE (dataset_id, input_hash)
)


CREATE TABLE evaluation_dataset_tags (
	dataset_id VARCHAR(36) NOT NULL,
	key VARCHAR(255) NOT NULL,
	value VARCHAR(5000),
	CONSTRAINT evaluation_dataset_tags_pk PRIMARY KEY (dataset_id, key),
	CONSTRAINT fk_evaluation_dataset_tags_dataset_id FOREIGN KEY(dataset_id) REFERENCES evaluation_datasets (dataset_id) ON DELETE CASCADE
)


CREATE TABLE experiment_tags (
	key VARCHAR(250) NOT NULL,
	value VARCHAR(5000),
	experiment_id INTEGER NOT NULL,
	CONSTRAINT experiment_tag_pk PRIMARY KEY (key, experiment_id),
	FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id)
)


CREATE TABLE logged_models (
	model_id VARCHAR(36) NOT NULL,
	experiment_id INTEGER NOT NULL,
	name VARCHAR(500) NOT NULL,
	artifact_location VARCHAR(1000) NOT NULL,
	creation_timestamp_ms BIGINT NOT NULL,
	last_updated_timestamp_ms BIGINT NOT NULL,
	status INTEGER NOT NULL,
	lifecycle_stage VARCHAR(32),
	model_type VARCHAR(500),
	source_run_id VARCHAR(32),
	status_message VARCHAR(1000),
	CONSTRAINT logged_models_pk PRIMARY KEY (model_id),
	CONSTRAINT fk_logged_models_experiment_id FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id) ON DELETE CASCADE,
	CONSTRAINT logged_models_lifecycle_stage_check CHECK (lifecycle_stage IN ('active', 'deleted'))
)


CREATE TABLE model_definitions (
	model_definition_id VARCHAR(36) NOT NULL,
	name VARCHAR(255) NOT NULL,
	secret_id VARCHAR(36),
	provider VARCHAR(64) NOT NULL,
	model_name VARCHAR(256) NOT NULL,
	created_by VARCHAR(255),
	created_at BIGINT NOT NULL,
	last_updated_by VARCHAR(255),
	last_updated_at BIGINT NOT NULL,
	CONSTRAINT model_definitions_pk PRIMARY KEY (model_definition_id),
	CONSTRAINT fk_model_definitions_secret_id FOREIGN KEY(secret_id) REFERENCES secrets (secret_id) ON DELETE SET NULL
)


CREATE TABLE model_versions (
	name VARCHAR(256) NOT NULL,
	version INTEGER NOT NULL,
	creation_time BIGINT,
	last_updated_time BIGINT,
	description VARCHAR(5000),
	user_id VARCHAR(256),
	current_stage VARCHAR(20),
	source VARCHAR(500),
	run_id VARCHAR(32),
	status VARCHAR(20),
	status_message VARCHAR(500),
	run_link VARCHAR(500),
	storage_location VARCHAR(500),
	CONSTRAINT model_version_pk PRIMARY KEY (name, version),
	FOREIGN KEY(name) REFERENCES registered_models (name) ON UPDATE CASCADE
)


CREATE TABLE registered_model_aliases (
	alias VARCHAR(256) NOT NULL,
	version INTEGER NOT NULL,
	name VARCHAR(256) NOT NULL,
	CONSTRAINT registered_model_alias_pk PRIMARY KEY (name, alias),
	CONSTRAINT registered_model_alias_name_fkey FOREIGN KEY(name) REFERENCES registered_models (name) ON DELETE CASCADE ON UPDATE CASCADE
)


CREATE TABLE registered_model_tags (
	key VARCHAR(250) NOT NULL,
	value VARCHAR(5000),
	name VARCHAR(256) NOT NULL,
	CONSTRAINT registered_model_tag_pk PRIMARY KEY (key, name),
	FOREIGN KEY(name) REFERENCES registered_models (name) ON UPDATE CASCADE
)


CREATE TABLE runs (
	run_uuid VARCHAR(32) NOT NULL,
	name VARCHAR(250),
	source_type VARCHAR(20),
	source_name VARCHAR(500),
	entry_point_name VARCHAR(50),
	user_id VARCHAR(256),
	status VARCHAR(9),
	start_time BIGINT,
	end_time BIGINT,
	source_version VARCHAR(50),
	lifecycle_stage VARCHAR(20),
	artifact_uri VARCHAR(200),
	experiment_id INTEGER,
	deleted_time BIGINT,
	CONSTRAINT run_pk PRIMARY KEY (run_uuid),
	FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id),
	CONSTRAINT runs_lifecycle_stage CHECK (lifecycle_stage IN ('active', 'deleted')),
	CONSTRAINT source_type CHECK (source_type IN ('NOTEBOOK', 'JOB', 'LOCAL', 'UNKNOWN', 'PROJECT')),
	CHECK (status IN ('SCHEDULED', 'FAILED', 'FINISHED', 'RUNNING', 'KILLED'))
)


CREATE TABLE scorers (
	experiment_id INTEGER NOT NULL,
	scorer_name VARCHAR(256) NOT NULL,
	scorer_id VARCHAR(36) NOT NULL,
	CONSTRAINT scorer_pk PRIMARY KEY (scorer_id),
	CONSTRAINT fk_scorers_experiment_id FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id) ON DELETE CASCADE
)


CREATE TABLE trace_info (
	request_id VARCHAR(50) NOT NULL,
	experiment_id INTEGER NOT NULL,
	timestamp_ms BIGINT NOT NULL,
	execution_time_ms BIGINT,
	status VARCHAR(50) NOT NULL,
	client_request_id VARCHAR(50),
	request_preview VARCHAR(1000),
	response_preview VARCHAR(1000),
	CONSTRAINT trace_info_pk PRIMARY KEY (request_id),
	CONSTRAINT fk_trace_info_experiment_id FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id)
)


CREATE TABLE webhook_events (
	webhook_id VARCHAR(256) NOT NULL,
	entity VARCHAR(50) NOT NULL,
	action VARCHAR(50) NOT NULL,
	CONSTRAINT webhook_event_pk PRIMARY KEY (webhook_id, entity, action),
	FOREIGN KEY(webhook_id) REFERENCES webhooks (webhook_id) ON DELETE CASCADE
)


CREATE TABLE assessments (
	assessment_id VARCHAR(50) NOT NULL,
	trace_id VARCHAR(50) NOT NULL,
	name VARCHAR(250) NOT NULL,
	assessment_type VARCHAR(20) NOT NULL,
	value TEXT NOT NULL,
	error TEXT,
	created_timestamp BIGINT NOT NULL,
	last_updated_timestamp BIGINT NOT NULL,
	source_type VARCHAR(50) NOT NULL,
	source_id VARCHAR(250),
	run_id VARCHAR(32),
	span_id VARCHAR(50),
	rationale TEXT,
	overrides VARCHAR(50),
	valid BOOLEAN NOT NULL,
	assessment_metadata TEXT,
	CONSTRAINT assessments_pk PRIMARY KEY (assessment_id),
	CONSTRAINT fk_assessments_trace_id FOREIGN KEY(trace_id) REFERENCES trace_info (request_id) ON DELETE CASCADE
)


CREATE TABLE endpoint_model_mappings (
	mapping_id VARCHAR(36) NOT NULL,
	endpoint_id VARCHAR(36) NOT NULL,
	model_definition_id VARCHAR(36) NOT NULL,
	weight FLOAT NOT NULL,
	created_by VARCHAR(255),
	created_at BIGINT NOT NULL,
	CONSTRAINT endpoint_model_mappings_pk PRIMARY KEY (mapping_id),
	CONSTRAINT fk_endpoint_model_mappings_endpoint_id FOREIGN KEY(endpoint_id) REFERENCES endpoints (endpoint_id) ON DELETE CASCADE,
	CONSTRAINT fk_endpoint_model_mappings_model_definition_id FOREIGN KEY(model_definition_id) REFERENCES model_definitions (model_definition_id)
)


CREATE TABLE latest_metrics (
	key VARCHAR(250) NOT NULL,
	value FLOAT NOT NULL,
	timestamp BIGINT,
	step BIGINT NOT NULL,
	is_nan BOOLEAN NOT NULL,
	run_uuid VARCHAR(32) NOT NULL,
	CONSTRAINT latest_metric_pk PRIMARY KEY (key, run_uuid),
	FOREIGN KEY(run_uuid) REFERENCES runs (run_uuid),
	CHECK (is_nan IN (0, 1))
)


CREATE TABLE logged_model_metrics (
	model_id VARCHAR(36) NOT NULL,
	metric_name VARCHAR(500) NOT NULL,
	metric_timestamp_ms BIGINT NOT NULL,
	metric_step BIGINT NOT NULL,
	metric_value FLOAT,
	experiment_id INTEGER NOT NULL,
	run_id VARCHAR(32) NOT NULL,
	dataset_uuid VARCHAR(36),
	dataset_name VARCHAR(500),
	dataset_digest VARCHAR(36),
	CONSTRAINT logged_model_metrics_pk PRIMARY KEY (model_id, metric_name, metric_timestamp_ms, metric_step, run_id),
	CONSTRAINT fk_logged_model_metrics_experiment_id FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id),
	CONSTRAINT fk_logged_model_metrics_model_id FOREIGN KEY(model_id) REFERENCES logged_models (model_id) ON DELETE CASCADE,
	CONSTRAINT fk_logged_model_metrics_run_id FOREIGN KEY(run_id) REFERENCES runs (run_uuid) ON DELETE CASCADE
)


CREATE TABLE logged_model_params (
	model_id VARCHAR(36) NOT NULL,
	experiment_id INTEGER NOT NULL,
	param_key VARCHAR(255) NOT NULL,
	param_value TEXT NOT NULL,
	CONSTRAINT logged_model_params_pk PRIMARY KEY (model_id, param_key),
	CONSTRAINT fk_logged_model_params_experiment_id FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id),
	CONSTRAINT fk_logged_model_params_model_id FOREIGN KEY(model_id) REFERENCES logged_models (model_id) ON DELETE CASCADE
)


CREATE TABLE logged_model_tags (
	model_id VARCHAR(36) NOT NULL,
	experiment_id INTEGER NOT NULL,
	tag_key VARCHAR(255) NOT NULL,
	tag_value TEXT NOT NULL,
	CONSTRAINT logged_model_tags_pk PRIMARY KEY (model_id, tag_key),
	CONSTRAINT fk_logged_model_tags_experiment_id FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id),
	CONSTRAINT fk_logged_model_tags_model_id FOREIGN KEY(model_id) REFERENCES logged_models (model_id) ON DELETE CASCADE
)


CREATE TABLE metrics (
	key VARCHAR(250) NOT NULL,
	value FLOAT NOT NULL,
	timestamp BIGINT NOT NULL,
	run_uuid VARCHAR(32) NOT NULL,
	step BIGINT DEFAULT '0' NOT NULL,
	is_nan BOOLEAN DEFAULT '0' NOT NULL,
	CONSTRAINT metric_pk PRIMARY KEY (key, timestamp, step, run_uuid, value, is_nan),
	FOREIGN KEY(run_uuid) REFERENCES runs (run_uuid),
	CHECK (is_nan IN (0, 1))
)


CREATE TABLE model_version_tags (
	key VARCHAR(250) NOT NULL,
	value TEXT,
	name VARCHAR(256) NOT NULL,
	version INTEGER NOT NULL,
	CONSTRAINT model_version_tag_pk PRIMARY KEY (key, name, version),
	FOREIGN KEY(name, version) REFERENCES model_versions (name, version) ON UPDATE CASCADE
)


CREATE TABLE params (
	key VARCHAR(250) NOT NULL,
	value VARCHAR(8000) NOT NULL,
	run_uuid VARCHAR(32) NOT NULL,
	CONSTRAINT param_pk PRIMARY KEY (key, run_uuid),
	FOREIGN KEY(run_uuid) REFERENCES runs (run_uuid)
)


CREATE TABLE scorer_versions (
	scorer_id VARCHAR(36) NOT NULL,
	scorer_version INTEGER NOT NULL,
	serialized_scorer TEXT NOT NULL,
	creation_time BIGINT,
	CONSTRAINT scorer_version_pk PRIMARY KEY (scorer_id, scorer_version),
	CONSTRAINT fk_scorer_versions_scorer_id FOREIGN KEY(scorer_id) REFERENCES scorers (scorer_id) ON DELETE CASCADE
)


CREATE TABLE spans (
	trace_id VARCHAR(50) NOT NULL,
	experiment_id INTEGER NOT NULL,
	span_id VARCHAR(50) NOT NULL,
	parent_span_id VARCHAR(50),
	name TEXT,
	type VARCHAR(500),
	status VARCHAR(50) NOT NULL,
	start_time_unix_nano BIGINT NOT NULL,
	end_time_unix_nano BIGINT,
	duration_ns BIGINT GENERATED ALWAYS AS (end_time_unix_nano - start_time_unix_nano) STORED,
	content TEXT NOT NULL,
	CONSTRAINT spans_pk PRIMARY KEY (trace_id, span_id),
	CONSTRAINT fk_spans_trace_id FOREIGN KEY(trace_id) REFERENCES trace_info (request_id) ON DELETE CASCADE,
	CONSTRAINT fk_spans_experiment_id FOREIGN KEY(experiment_id) REFERENCES experiments (experiment_id)
)


CREATE TABLE tags (
	key VARCHAR(250) NOT NULL,
	value VARCHAR(8000),
	run_uuid VARCHAR(32) NOT NULL,
	CONSTRAINT tag_pk PRIMARY KEY (key, run_uuid),
	FOREIGN KEY(run_uuid) REFERENCES runs (run_uuid)
)


CREATE TABLE trace_metrics (
	request_id VARCHAR(50) NOT NULL,
	key VARCHAR(250) NOT NULL,
	value FLOAT,
	CONSTRAINT trace_metrics_pk PRIMARY KEY (request_id, key),
	CONSTRAINT fk_trace_metrics_request_id FOREIGN KEY(request_id) REFERENCES trace_info (request_id) ON DELETE CASCADE
)


CREATE TABLE trace_request_metadata (
	key VARCHAR(250) NOT NULL,
	value VARCHAR(8000),
	request_id VARCHAR(50) NOT NULL,
	CONSTRAINT trace_request_metadata_pk PRIMARY KEY (key, request_id),
	CONSTRAINT fk_trace_request_metadata_request_id FOREIGN KEY(request_id) REFERENCES trace_info (request_id) ON DELETE CASCADE
)


CREATE TABLE trace_tags (
	key VARCHAR(250) NOT NULL,
	value VARCHAR(8000),
	request_id VARCHAR(50) NOT NULL,
	CONSTRAINT trace_tag_pk PRIMARY KEY (key, request_id),
	CONSTRAINT fk_trace_tags_request_id FOREIGN KEY(request_id) REFERENCES trace_info (request_id) ON DELETE CASCADE
)
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile_conda]---
Location: mlflow-master/tests/resources/dockerfile/Dockerfile_conda

```text
# Build an image that can serve mlflow models.
FROM ubuntu:22.04

RUN apt-get -y update && DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt-get install -y --no-install-recommends wget curl nginx ca-certificates bzip2 build-essential cmake git-core

# Setup miniconda
RUN curl --fail -L https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh > miniconda.sh
RUN bash ./miniconda.sh -b -p /miniconda && rm ./miniconda.sh
ENV PATH="/miniconda/bin:$PATH"
# Remove default channels to avoid `CondaToSNonInteractiveError`.
# See https://github.com/mlflow/mlflow/pull/16752 for more details.
RUN conda config --system --remove channels defaults && conda config --system --add channels conda-forge


# Setup Java
RUN apt-get install -y --no-install-recommends openjdk-17-jdk maven
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

WORKDIR /opt/mlflow

# Install MLflow
RUN pip install mlflow==${{ MLFLOW_VERSION }}

# Copy model to image and install dependencies
COPY model_dir/model /opt/ml/model
RUN python -c "from mlflow.models import container as C; C._install_pyfunc_deps('/opt/ml/model', install_mlflow=False, enable_mlserver=False, env_manager='conda');"

ENV MLFLOW_DISABLE_ENV_CREATION=True
ENV ENABLE_MLSERVER=False

# granting read/write access and conditional execution authority to all child directories
# and files to allow for deployment to AWS Sagemaker Serverless Endpoints
# (see https://docs.aws.amazon.com/sagemaker/latest/dg/serverless-endpoints.html)
RUN chmod o+rwX /opt/mlflow/

# clean up apt cache to reduce image size
RUN rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["python", "-c", "from mlflow.models import container as C; C._serve('conda')"]
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile_custom_scipy]---
Location: mlflow-master/tests/resources/dockerfile/Dockerfile_custom_scipy

```text
# Build an image that can serve mlflow models.
FROM quay.io/jupyter/scipy-notebook:latest





WORKDIR /opt/mlflow

# Install MLflow
RUN pip install mlflow==${{ MLFLOW_VERSION }}

# Copy model to image and install dependencies
COPY model_dir/model /opt/ml/model
RUN python -c "from mlflow.models import container as C; C._install_pyfunc_deps('/opt/ml/model', install_mlflow=False, enable_mlserver=False, env_manager='local');"

ENV MLFLOW_DISABLE_ENV_CREATION=True
ENV ENABLE_MLSERVER=False

# granting read/write access and conditional execution authority to all child directories
# and files to allow for deployment to AWS Sagemaker Serverless Endpoints
# (see https://docs.aws.amazon.com/sagemaker/latest/dg/serverless-endpoints.html)
RUN chmod o+rwX /opt/mlflow/

# clean up apt cache to reduce image size
RUN rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["python", "-c", "from mlflow.models import container as C; C._serve('local')"]
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile_default]---
Location: mlflow-master/tests/resources/dockerfile/Dockerfile_default

```text
# Build an image that can serve mlflow models.
FROM python:${{ PYTHON_VERSION }}-slim

RUN apt-get -y update && apt-get install -y --no-install-recommends nginx



WORKDIR /opt/mlflow

# Install MLflow
RUN pip install mlflow==${{ MLFLOW_VERSION }}

# Copy model to image and install dependencies
COPY model_dir/model /opt/ml/model
RUN python -c "from mlflow.models import container as C; C._install_pyfunc_deps('/opt/ml/model', install_mlflow=False, enable_mlserver=False, env_manager='local');"

ENV MLFLOW_DISABLE_ENV_CREATION=True
ENV ENABLE_MLSERVER=False

# granting read/write access and conditional execution authority to all child directories
# and files to allow for deployment to AWS Sagemaker Serverless Endpoints
# (see https://docs.aws.amazon.com/sagemaker/latest/dg/serverless-endpoints.html)
RUN chmod o+rwX /opt/mlflow/

# clean up apt cache to reduce image size
RUN rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["python", "-c", "from mlflow.models import container as C; C._serve('local')"]
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile_enable_mlserver]---
Location: mlflow-master/tests/resources/dockerfile/Dockerfile_enable_mlserver

```text
# Build an image that can serve mlflow models.
FROM python:${{ PYTHON_VERSION }}-slim

RUN apt-get -y update && apt-get install -y --no-install-recommends nginx



WORKDIR /opt/mlflow

# Install MLflow
RUN pip install mlflow==${{ MLFLOW_VERSION }}

# Copy model to image and install dependencies
COPY model_dir/model /opt/ml/model
RUN python -c "from mlflow.models import container as C; C._install_pyfunc_deps('/opt/ml/model', install_mlflow=False, enable_mlserver=True, env_manager='local');"

ENV MLFLOW_DISABLE_ENV_CREATION=True
ENV ENABLE_MLSERVER=True

# granting read/write access and conditional execution authority to all child directories
# and files to allow for deployment to AWS Sagemaker Serverless Endpoints
# (see https://docs.aws.amazon.com/sagemaker/latest/dg/serverless-endpoints.html)
RUN chmod o+rwX /opt/mlflow/

# clean up apt cache to reduce image size
RUN rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["python", "-c", "from mlflow.models import container as C; C._serve('local')"]
```

--------------------------------------------------------------------------------

````
