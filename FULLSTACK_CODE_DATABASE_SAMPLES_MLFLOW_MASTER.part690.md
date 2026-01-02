---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 690
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 690 of 991)

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

---[FILE: _secret_cache.py]---
Location: mlflow-master/mlflow/store/tracking/_secret_cache.py

```python
"""
Server-side encrypted cache for secrets management.

Implements time-bucketed ephemeral encryption for cached secrets to provide defense-in-depth
and satisfy CWE-316 (https://cwe.mitre.org/data/definitions/316.html).

Security Model and Limitations:

This cache protects against accidental exposure of secrets in logs, debug output, or error
messages. It also provides forward secrecy for expired cache entries since bucket keys are
randomly generated and deleted after expiration rather than derived from a base key.

This cache does not protect against attackers with real-time memory access to the running
process. During the TTL window (default 60s), both the encrypted secrets and their bucket
keys exist in process memory. A memory dump during this window captures both, allowing
decryption. Root-level attackers who can attach debuggers or read process memory can extract
secrets while they are cached.

The protection is that expired bucket keys are deleted from memory, making historical secrets
permanently unrecoverable even with full memory access. For protection against attackers with
real-time memory access, hardware-backed key management (HSM, Intel SGX, AWS Nitro Enclaves)
is required. Software-only solutions cannot prevent memory inspection by privileged attackers.

Implementation:

Random 256-bit keys are generated per time bucket using os.urandom (NIST SP 800-90A). Keys
are stored in memory and deleted on expiration. Secrets are encrypted with AES-GCM-256
(NIST SP 800-175B). After bucket expiration, keys are purged and old secrets become
permanently unrecoverable.

Performance overhead is approximately 10 microseconds per operation compared to 1-5ms for
database queries. Cache entries have a configurable TTL (default 60s, max 300s) and max
size (default 1000 entries).
"""

import json
import os
import time
from collections import OrderedDict
from threading import RLock, Thread
from typing import Any

from mlflow.utils.crypto import _encrypt_with_aes_gcm, decrypt_with_aes_gcm

_MIN_TTL = 10
_MAX_TTL = 300

_DEFAULT_CACHE_TTL = 60
_DEFAULT_CACHE_MAX_SIZE = 1000

SECRETS_CACHE_TTL_ENV_VAR = "MLFLOW_SERVER_SECRETS_CACHE_TTL"
SECRETS_CACHE_MAX_SIZE_ENV_VAR = "MLFLOW_SERVER_SECRETS_CACHE_MAX_SIZE"


class EphemeralCacheEncryption:
    """
    Time-bucketed ephemeral encryption with forward secrecy.

    Generates random 256-bit keys per time bucket (os.urandom per NIST SP 800-90A). Keys are stored
    in memory only and deleted when expired. Secrets encrypted with AES-GCM-256 + 96-bit nonce
    (NIST SP 800-38D). Expired bucket keys are purged from memory, making decryption of old cached
    secrets impossible even with full memory access (NIST SP 800-57 Section 8.2.3).

    Unlike key derivation schemes, this approach ensures true forward secrecy: once a bucket key
    is deleted, there is no computational path to recover it - the randomness is gone.

    A background daemon thread proactively purges expired keys, ensuring deterministic cleanup
    within TTL seconds of expiration regardless of cache activity.

    Args:
        ttl_seconds: Time-to-live and key rotation interval in seconds. Key rotation always
                    matches TTL to ensure cache entries expire when keys become unreadable.
    """

    def __init__(self, ttl_seconds: int = 60):
        self._key_rotation_seconds = ttl_seconds
        self._active_bucket: int | None = None
        self._active_key: bytes | None = None
        self._previous_bucket: int | None = None
        self._previous_key: bytes | None = None
        self._lock = RLock()
        self._shutdown = False

        # Start background cleanup thread
        self._cleanup_thread = Thread(
            target=self._cleanup_loop,
            daemon=True,
            name="EphemeralCacheEncryption-cleanup",
        )
        self._cleanup_thread.start()

    def _cleanup_loop(self) -> None:
        """Background thread that proactively purges expired bucket keys."""
        while not self._shutdown:
            time.sleep(self._key_rotation_seconds)
            self._purge_expired_keys()

    def _purge_expired_keys(self) -> None:
        """Purge any bucket keys that are more than 1 bucket old."""
        with self._lock:
            current_bucket = self._get_time_bucket()

            # Purge active key if it's now stale
            if self._active_bucket is not None:
                if abs(current_bucket - self._active_bucket) > 1:
                    self._active_bucket = None
                    self._active_key = None

            # Purge previous key if it's now more than 1 bucket old
            if self._previous_bucket is not None:
                if abs(current_bucket - self._previous_bucket) > 1:
                    self._previous_bucket = None
                    self._previous_key = None

    def _get_time_bucket(self) -> int:
        return int(time.time() // self._key_rotation_seconds)

    def _get_bucket_key(self, time_bucket: int) -> bytes | None:
        """
        Get or create bucket key, with lazy cleanup of expired keys.

        Keys are generated randomly per bucket (not derived), so once deleted they are
        permanently unrecoverable. This provides true forward secrecy against memory dumps.
        """
        with self._lock:
            current_bucket = self._get_time_bucket()

            # Rotate keys if we've moved to a new bucket
            if self._active_bucket is not None and self._active_bucket != current_bucket:
                # Keep previous bucket key for 1-bucket tolerance on decryption
                if self._active_bucket == current_bucket - 1:
                    self._previous_bucket = self._active_bucket
                    self._previous_key = self._active_key
                else:
                    # More than 1 bucket old - purge completely
                    self._previous_bucket = None
                    self._previous_key = None
                self._active_bucket = None
                self._active_key = None

            # Purge previous key if it's now more than 1 bucket old
            if self._previous_bucket is not None:
                if abs(current_bucket - self._previous_bucket) > 1:
                    self._previous_bucket = None
                    self._previous_key = None

            # Return existing key if available (for decryption of recent entries)
            if time_bucket == self._active_bucket and self._active_key is not None:
                return self._active_key
            if time_bucket == self._previous_bucket and self._previous_key is not None:
                return self._previous_key

            # Only create new keys for current bucket (not for expired buckets)
            if time_bucket == current_bucket:
                self._active_bucket = current_bucket
                self._active_key = os.urandom(32)
                return self._active_key

            # Bucket key was already purged - decryption impossible
            return None

    def encrypt(self, plaintext: str) -> tuple[bytes, int]:
        bucket = self._get_time_bucket()
        bucket_key = self._get_bucket_key(bucket)

        result = _encrypt_with_aes_gcm(
            plaintext.encode("utf-8"),
            bucket_key,
        )

        blob = result.nonce + result.ciphertext
        return (blob, bucket)

    def decrypt(self, blob: bytes, time_bucket: int) -> str | None:
        current_bucket = self._get_time_bucket()

        # NB: 1-bucket tolerance handles edge cases where encryption/decryption
        # happen across bucket boundary
        if abs(current_bucket - time_bucket) > 1:
            return None

        bucket_key = self._get_bucket_key(time_bucket)
        if bucket_key is None:
            return None

        try:
            plaintext_bytes = decrypt_with_aes_gcm(blob, bucket_key, aad=None)
            return plaintext_bytes.decode("utf-8")
        except Exception:
            return None


class SecretCache:
    """
    Thread-safe LRU cache for encrypted secrets satisfying CWE-316.

    Cache keys follow pattern "{resource_type}:{resource_id}". Entries expire via lazy TTL
    checks and LRU eviction. Full cache clear on mutations for simplicity (mutations rare vs reads).

    Args:
        ttl_seconds: Time-to-live in seconds (10-300s range). Default 60s.
        max_size: Max entries before LRU eviction. Default 1000.
    """

    def __init__(
        self,
        ttl_seconds: int = 60,
        max_size: int = 1000,
    ):
        if ttl_seconds < _MIN_TTL or ttl_seconds > _MAX_TTL:
            raise ValueError(
                f"Cache TTL must be between {_MIN_TTL} and {_MAX_TTL} seconds. "
                f"Got: {ttl_seconds}. "
                f"Lower values (10-30s) are more secure but impact performance. "
                f"Higher values (120-300s) improve performance but increase exposure window."
            )

        self._ttl = ttl_seconds
        self._max_size = max_size
        self._crypto = EphemeralCacheEncryption(ttl_seconds=ttl_seconds)
        self._cache: OrderedDict[str, tuple[bytes, int, float]] = OrderedDict()
        self._lock = RLock()

    def get(self, cache_key: str) -> str | dict[str, Any] | None:
        with self._lock:
            if cache_key not in self._cache:
                return None

            blob, time_bucket, expiry = self._cache[cache_key]

            if time.time() > expiry:
                del self._cache[cache_key]
                return None

            self._cache.move_to_end(cache_key)

            plaintext = self._crypto.decrypt(blob, time_bucket)
            if plaintext is None:
                del self._cache[cache_key]
                return None

            if plaintext.startswith("{") and plaintext.endswith("}"):
                try:
                    return json.loads(plaintext)
                except json.JSONDecodeError:
                    pass
            return plaintext

    def set(self, cache_key: str, value: str | dict[str, Any]) -> None:
        with self._lock:
            plaintext = json.dumps(value) if isinstance(value, dict) else value
            blob, time_bucket = self._crypto.encrypt(plaintext)
            expiry = time.time() + self._ttl

            self._cache[cache_key] = (blob, time_bucket, expiry)
            self._cache.move_to_end(cache_key)

            while len(self._cache) > self._max_size:
                self._cache.popitem(last=False)

    def clear(self) -> None:
        with self._lock:
            self._cache.clear()

    def size(self) -> int:
        with self._lock:
            return len(self._cache)
```

--------------------------------------------------------------------------------

---[FILE: _sql_backend_utils.py]---
Location: mlflow-master/mlflow/store/tracking/_sql_backend_utils.py

```python
from functools import wraps
from typing import Any, Callable, TypeVar, cast

from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import FEATURE_DISABLED

F = TypeVar("F", bound=Callable[..., Any])


def filestore_not_supported(func: F) -> F:
    """
    Decorator for FileStore methods that are not supported.

    This decorator wraps methods to raise a helpful error message when
    SQL-backend-only features are called on a FileStore instance.

    Returns:
        A wrapped function that raises MlflowException when called.
    """

    @wraps(func)
    def wrapper(self, *args, **kwargs):
        raise MlflowException(
            f"{func.__name__} is not supported with FileStore. "
            f"This feature requires a SQL-based tracking backend "
            f"(e.g., SQLite, PostgreSQL, MySQL). Please configure MLflow "
            f"with a SQL backend using --backend-store-uri. "
            f"For SQLite setup instructions, see: "
            f"https://mlflow.org/docs/latest/self-hosting/architecture/tracking-server/#configure-server",
            error_code=FEATURE_DISABLED,
        )

    return cast(F, wrapper)
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/store/tracking/__init__.py

```python
"""
An MLflow tracking server has two properties related to how data is stored: *backend store* to
record ML experiments, runs, parameters, metrics, etc., and *artifact store* to store run
artifacts like models, plots, images, etc.

Several constants are used by multiple backend store implementations.
"""

# Path to default location for backend when using local FileStore or ArtifactStore.
# Also used as default location for artifacts, when not provided, in non local file based backends
# (eg MySQL)
DEFAULT_LOCAL_FILE_AND_ARTIFACT_PATH = "./mlruns"
DEFAULT_TRACKING_URI = "sqlite:///mlflow.db"
# Used for defining the artifacts uri (`--default-artifact-root`) for the tracking server when
# configuring the server to use the option `--serve-artifacts` mode. This default can be
# overridden by specifying an override to `--default-artifact-root` for the MLflow tracking server.
# When the server is not operating in `--serve-artifacts` configuration, the default artifact
# storage location will be `DEFAULT_LOCAL_FILE_AND_ARTIFACT_PATH`.
DEFAULT_ARTIFACTS_URI = "mlflow-artifacts:/"
SEARCH_MAX_RESULTS_DEFAULT = 1000
SEARCH_MAX_RESULTS_THRESHOLD = 50000
GET_METRIC_HISTORY_MAX_RESULTS = 25000
SEARCH_TRACES_DEFAULT_MAX_RESULTS = 100
SEARCH_LOGGED_MODEL_MAX_RESULTS_DEFAULT = 100
SEARCH_EVALUATION_DATASETS_MAX_RESULTS = 50
LOAD_DATASET_RECORDS_MAX_RESULTS = 1000
MAX_RESULTS_GET_METRIC_HISTORY = 25000
```

--------------------------------------------------------------------------------

---[FILE: initial_models.py]---
Location: mlflow-master/mlflow/store/tracking/dbmodels/initial_models.py
Signals: SQLAlchemy

```python
# Snapshot of MLflow DB models as of the 0.9.1 release, prior to the first database migration.
# Used to standardize initial database state.
# Copied with modifications from
# https://github.com/mlflow/mlflow/blob/v0.9.1/mlflow/store/dbmodels/models.py, which
# is the first database schema that users could be running. In particular, modifications have
# been made to substitute constants from MLflow with hard-coded values (e.g. replacing
# SourceType.to_string(SourceType.NOTEBOOK) with the constant "NOTEBOOK") and ensure
# that all constraint names are unique. Note that pre-1.0 database schemas did not have unique
# constraint names - we provided a one-time migration script for pre-1.0 users so that their
# database schema matched the schema in this file.
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
        CheckConstraint(
            lifecycle_stage.in_(["active", "deleted"]), name="experiments_lifecycle_stage"
        ),
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
        CheckConstraint(lifecycle_stage.in_(["active", "deleted"]), name="runs_lifecycle_stage"),
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

````
