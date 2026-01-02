---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:55Z
part: 978
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 978 of 991)

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

---[FILE: test_crypto.py]---
Location: mlflow-master/tests/utils/test_crypto.py

```python
import json
import os

import pytest

from mlflow.exceptions import MlflowException
from mlflow.utils.crypto import (
    AES_256_KEY_LENGTH,
    GCM_NONCE_LENGTH,
    KEKManager,
    _create_aad,
    _decrypt_secret,
    _encrypt_secret,
    _encrypt_with_aes_gcm,
    _generate_dek,
    _mask_secret_value,
    decrypt_with_aes_gcm,
    rotate_secret_encryption,
    unwrap_dek,
    wrap_dek,
)

TEST_PASSPHRASE = "test-passphrase-for-kek-derivation"


@pytest.fixture
def kek_manager():
    return KEKManager(passphrase=TEST_PASSPHRASE)


def test_kek_manager_from_env_var(monkeypatch):
    monkeypatch.setenv("MLFLOW_CRYPTO_KEK_PASSPHRASE", "env-passphrase")
    kek_manager = KEKManager()
    kek = kek_manager.get_kek()
    assert len(kek) == AES_256_KEY_LENGTH
    assert isinstance(kek, bytes)


def test_kek_manager_from_parameter():
    kek_manager = KEKManager(passphrase=TEST_PASSPHRASE)
    kek = kek_manager.get_kek()
    assert len(kek) == AES_256_KEY_LENGTH
    assert isinstance(kek, bytes)


def test_kek_manager_deterministic():
    kek1 = KEKManager(passphrase=TEST_PASSPHRASE).get_kek()
    kek2 = KEKManager(passphrase=TEST_PASSPHRASE).get_kek()
    assert kek1 == kek2


@pytest.mark.parametrize(
    ("passphrase1", "passphrase2"),
    [
        ("passphrase-one", "passphrase-two"),
        ("short", "very-long-passphrase-with-many-characters"),
        ("pass123", "pass456"),
    ],
)
def test_kek_manager_different_passphrases(passphrase1, passphrase2):
    kek1 = KEKManager(passphrase=passphrase1).get_kek()
    kek2 = KEKManager(passphrase=passphrase2).get_kek()
    assert kek1 != kek2


def test_kek_manager_no_passphrase_uses_default(monkeypatch):
    monkeypatch.delenv("MLFLOW_CRYPTO_KEK_PASSPHRASE", raising=False)
    kek_manager = KEKManager()
    assert kek_manager.using_default_passphrase is True
    assert kek_manager.get_kek() is not None


def test_kek_manager_empty_passphrase_uses_default(monkeypatch):
    monkeypatch.setenv("MLFLOW_CRYPTO_KEK_PASSPHRASE", "")
    kek_manager = KEKManager()
    assert kek_manager.using_default_passphrase is True
    assert kek_manager.get_kek() is not None


def test_kek_manager_custom_passphrase_not_default():
    kek_manager = KEKManager(passphrase=TEST_PASSPHRASE)
    assert kek_manager.using_default_passphrase is False


def test_kek_manager_version_defaults_to_1():
    kek_manager = KEKManager(passphrase=TEST_PASSPHRASE)
    assert kek_manager.kek_version == 1


def test_kek_manager_version_from_parameter():
    kek_manager = KEKManager(passphrase=TEST_PASSPHRASE, kek_version=2)
    assert kek_manager.kek_version == 2


def test_kek_manager_version_from_env_var(monkeypatch):
    monkeypatch.setenv("MLFLOW_CRYPTO_KEK_PASSPHRASE", "env-passphrase")
    monkeypatch.setenv("MLFLOW_CRYPTO_KEK_VERSION", "3")
    kek_manager = KEKManager()
    assert kek_manager.kek_version == 3


def test_kek_manager_version_parameter_overrides_env(monkeypatch):
    monkeypatch.setenv("MLFLOW_CRYPTO_KEK_PASSPHRASE", "env-passphrase")
    monkeypatch.setenv("MLFLOW_CRYPTO_KEK_VERSION", "3")
    kek_manager = KEKManager(kek_version=5)
    assert kek_manager.kek_version == 5


def test_kek_manager_same_passphrase_different_versions_produces_different_keks():
    passphrase = "same-passphrase-for-both"
    kek_v1 = KEKManager(passphrase=passphrase, kek_version=1).get_kek()
    kek_v2 = KEKManager(passphrase=passphrase, kek_version=2).get_kek()
    assert kek_v1 != kek_v2


def test_encrypt_secret_includes_kek_version():
    kek_manager = KEKManager(passphrase=TEST_PASSPHRASE, kek_version=2)
    secret_value = "test-secret"
    secret_id = "test-id"
    secret_name = "test-name"

    result = _encrypt_secret(secret_value, kek_manager, secret_id, secret_name)

    assert result.kek_version == 2


def test_generate_dek_length():
    dek = _generate_dek()
    assert len(dek) == AES_256_KEY_LENGTH
    assert isinstance(dek, bytes)


def test_generate_dek_random():
    dek1 = _generate_dek()
    dek2 = _generate_dek()
    assert dek1 != dek2


def test_encrypt_decrypt_roundtrip():
    dek = _generate_dek()
    plaintext = b"Hello, World!"

    result = _encrypt_with_aes_gcm(plaintext, dek)

    assert len(result.nonce) == GCM_NONCE_LENGTH
    assert len(result.ciphertext) > len(plaintext)

    combined = result.nonce + result.ciphertext
    decrypted = decrypt_with_aes_gcm(combined, dek)
    assert decrypted == plaintext


def test_encrypt_with_custom_nonce():
    dek = _generate_dek()
    plaintext = b"Test data"
    custom_nonce = os.urandom(GCM_NONCE_LENGTH)

    result = _encrypt_with_aes_gcm(plaintext, dek, _nonce_for_testing=custom_nonce)
    assert result.nonce == custom_nonce


def test_encrypt_decrypt_with_aad():
    dek = _generate_dek()
    plaintext = b"Secret message"
    aad = b"metadata"

    result = _encrypt_with_aes_gcm(plaintext, dek, aad=aad)
    combined = result.nonce + result.ciphertext

    decrypted = decrypt_with_aes_gcm(combined, dek, aad=aad)
    assert decrypted == plaintext


def test_decrypt_with_wrong_aad_fails():
    dek = _generate_dek()
    plaintext = b"Secret message"
    aad = b"correct-metadata"

    result = _encrypt_with_aes_gcm(plaintext, dek, aad=aad)
    combined = result.nonce + result.ciphertext

    with pytest.raises(MlflowException, match="AES-GCM decryption failed"):
        decrypt_with_aes_gcm(combined, dek, aad=b"wrong-metadata")


def test_decrypt_with_missing_aad_fails():
    dek = _generate_dek()
    plaintext = b"Secret message"
    aad = b"metadata"

    result = _encrypt_with_aes_gcm(plaintext, dek, aad=aad)
    combined = result.nonce + result.ciphertext

    with pytest.raises(MlflowException, match="AES-GCM decryption failed"):
        decrypt_with_aes_gcm(combined, dek, aad=None)


@pytest.mark.parametrize("bad_key", [b"short", b"", b"a" * 16])
def test_encrypt_with_wrong_key_length_raises(bad_key):
    plaintext = b"Test"
    with pytest.raises(ValueError, match="Key must be 32 bytes"):
        _encrypt_with_aes_gcm(plaintext, bad_key)


@pytest.mark.parametrize("bad_key", [b"short", b"", b"a" * 16])
def test_decrypt_with_wrong_key_length_raises(bad_key):
    ciphertext = os.urandom(100)
    with pytest.raises(ValueError, match="Key must be 32 bytes"):
        decrypt_with_aes_gcm(ciphertext, bad_key)


@pytest.mark.parametrize("bad_nonce", [b"short", b"", b"a" * 5])
def test_encrypt_with_wrong_nonce_length_raises(bad_nonce):
    dek = _generate_dek()
    plaintext = b"Test"
    with pytest.raises(ValueError, match="Nonce must be between"):
        _encrypt_with_aes_gcm(plaintext, dek, _nonce_for_testing=bad_nonce)


def test_decrypt_with_wrong_key_fails():
    key1 = _generate_dek()
    key2 = _generate_dek()
    plaintext = b"Secret"

    result = _encrypt_with_aes_gcm(plaintext, key1)
    combined = result.nonce + result.ciphertext

    with pytest.raises(MlflowException, match="AES-GCM decryption failed"):
        decrypt_with_aes_gcm(combined, key2)


def test_decrypt_with_tampered_ciphertext_fails():
    dek = _generate_dek()
    plaintext = b"Secret"

    result = _encrypt_with_aes_gcm(plaintext, dek)
    combined = result.nonce + result.ciphertext

    tampered = combined[:-1] + bytes([combined[-1] ^ 0xFF])

    with pytest.raises(MlflowException, match="AES-GCM decryption failed"):
        decrypt_with_aes_gcm(tampered, dek)


def test_decrypt_with_short_ciphertext_raises():
    dek = _generate_dek()
    short_ciphertext = os.urandom(5)

    with pytest.raises(ValueError, match="Ciphertext too short"):
        decrypt_with_aes_gcm(short_ciphertext, dek)


def test_wrap_unwrap_dek_roundtrip():
    dek = _generate_dek()
    kek = _generate_dek()

    wrapped_dek = wrap_dek(dek, kek)
    unwrapped_dek = unwrap_dek(wrapped_dek, kek)

    assert unwrapped_dek == dek


def test_unwrap_with_wrong_kek_fails():
    dek = _generate_dek()
    kek1 = _generate_dek()
    kek2 = _generate_dek()

    wrapped_dek = wrap_dek(dek, kek1)

    with pytest.raises(MlflowException, match="Failed to unwrap DEK"):
        unwrap_dek(wrapped_dek, kek2)


def test__create_aad():
    secret_id = "123e4567-e89b-12d3-a456-426614174000"
    secret_name = "my-api-key"

    aad = _create_aad(secret_id, secret_name)

    assert isinstance(aad, bytes)
    assert secret_id.encode() in aad
    assert secret_name.encode() in aad
    assert b"|" in aad


def test_create_aad_deterministic():
    secret_id = "test-id"
    secret_name = "test-name"

    aad1 = _create_aad(secret_id, secret_name)
    aad2 = _create_aad(secret_id, secret_name)

    assert aad1 == aad2


@pytest.mark.parametrize(
    ("id1", "name1", "id2", "name2"),
    [
        ("id1", "name1", "id2", "name2"),
        ("same", "name1", "same", "name2"),
        ("id1", "same", "id2", "same"),
    ],
)
def test_create_aad_different_inputs(id1, name1, id2, name2):
    aad1 = _create_aad(id1, name1)
    aad2 = _create_aad(id2, name2)
    assert aad1 != aad2


@pytest.mark.parametrize(
    ("secret", "expected_mask"),
    [
        ("sk-proj-1234567890abcdef", "sk-...cdef"),
        ("pk-test-1234567890abcdef", "pk-...cdef"),
        ("ghp_1234567890abcdef1234567890abcdef", "ghp_...cdef"),
        ("gho_1234567890abcdef1234567890abcdef", "gho_...cdef"),
        ("ghu_1234567890abcdef1234567890abcdef", "ghu_...cdef"),
        ("api-key-abc123def456", "api...f456"),
        ("12345678", "123...5678"),
    ],
)
def test__mask_secret_value(secret, expected_mask):
    masked = _mask_secret_value(secret)
    assert masked == expected_mask


@pytest.mark.parametrize("short_secret", ["short", "1234567", "abc", ""])
def test_mask_secret_value_short(short_secret):
    if short_secret:
        masked = _mask_secret_value(short_secret)
        assert masked == "***"


@pytest.mark.parametrize(
    ("secret_dict", "expected_masked"),
    [
        ({"api_key": "sk-proj-1234567890abcdef"}, "<dict: 1 key (api_key)>"),
        (
            {"username": "admin-user", "password": "secret123"},
            "<dict: 2 keys (username, password)>",
        ),
        ({"token": "ghp_1234567890abcdef"}, "<dict: 1 key (token)>"),
        (
            {"config": {"host": "localhost", "port": 8080}},
            "<dict: 1 key (config)>",
        ),
        ({"short": "abc"}, "<dict: 1 key (short)>"),
        ({}, "<dict: empty>"),
        (
            {"key1": "val1", "key2": "val2", "key3": "val3", "key4": "val4"},
            "<dict: 4 keys (key1, key2, key3, +1 more)>",
        ),
    ],
)
def test_mask_secret_value_dict(secret_dict, expected_masked):
    masked = _mask_secret_value(secret_dict)
    assert masked == expected_masked


def test_mask_secret_value_nested_dict():
    secret = {"outer": {"inner": {"api_key": "sk-abc123xyz", "enabled": True}}}
    masked = _mask_secret_value(secret)
    assert masked == "<dict: 1 key (outer)>"


def test_mask_secret_value_dict_with_very_long_key_names():
    long_key = "a" * 200
    secret = {long_key: "value"}
    masked = _mask_secret_value(secret)

    assert len(masked) <= 100
    assert masked.endswith("...>")
    assert masked.startswith("<dict: 1 key (")

    secret_multiple = {
        "key1_" + "a" * 100: "val1",
        "key2_" + "b" * 100: "val2",
        "key3_" + "c" * 100: "val3",
    }
    masked_multiple = _mask_secret_value(secret_multiple)
    assert len(masked_multiple) <= 100
    assert masked_multiple.endswith("...>")


@pytest.mark.parametrize(
    "secret_value",
    [
        "sk-abc123",
        "my-api-key-value",
        "password123",
    ],
)
def test_encrypt_decrypt_secret_roundtrip_string(kek_manager, secret_value):
    secret_id = "test-uuid-123"
    secret_name = "test-secret"

    result = _encrypt_secret(secret_value, kek_manager, secret_id, secret_name)

    decrypted_value = _decrypt_secret(
        result.encrypted_value,
        result.wrapped_dek,
        kek_manager,
        secret_id,
        secret_name,
    )

    assert decrypted_value == secret_value
    assert isinstance(decrypted_value, str)


@pytest.mark.parametrize(
    "secret_value",
    [
        {"api_key": "sk-abc123"},
        {"username": "admin", "password": "secret"},
        {"config": {"host": "localhost", "port": 8080}},
        {"value": "simple-string"},
    ],
)
def test_encrypt_decrypt_secret_roundtrip_dict(kek_manager, secret_value):
    secret_id = "test-uuid-123"
    secret_name = "test-secret"

    result = _encrypt_secret(secret_value, kek_manager, secret_id, secret_name)

    decrypted_value = _decrypt_secret(
        result.encrypted_value,
        result.wrapped_dek,
        kek_manager,
        secret_id,
        secret_name,
    )

    assert decrypted_value == secret_value
    assert isinstance(decrypted_value, dict)


def test_encrypt_secret_dict_is_json_serialized(kek_manager):
    secret_dict = {"key1": "value1", "key2": "value2"}
    secret_id = "test-uuid-123"
    secret_name = "test-secret"

    result = _encrypt_secret(secret_dict, kek_manager, secret_id, secret_name)

    kek = kek_manager.get_kek()
    dek = unwrap_dek(result.wrapped_dek, kek)
    aad = _create_aad(secret_id, secret_name)
    decrypted_bytes = decrypt_with_aes_gcm(result.encrypted_value, dek, aad=aad)

    decrypted_json = decrypted_bytes.decode("utf-8")
    parsed = json.loads(decrypted_json)

    assert parsed == secret_dict


def test_decrypt_with_wrong_secret_id_fails(kek_manager):
    secret_value = "my-secret-key"

    result = _encrypt_secret(secret_value, kek_manager, secret_id="id1", secret_name="name1")

    with pytest.raises(MlflowException, match="Failed to decrypt secret"):
        _decrypt_secret(
            result.encrypted_value,
            result.wrapped_dek,
            kek_manager,
            secret_id="id2",
            secret_name="name1",
        )


def test_decrypt_with_wrong_secret_name_fails(kek_manager):
    secret_value = "my-secret-key"

    result = _encrypt_secret(secret_value, kek_manager, secret_id="id1", secret_name="name1")

    with pytest.raises(MlflowException, match="Failed to decrypt secret"):
        _decrypt_secret(
            result.encrypted_value,
            result.wrapped_dek,
            kek_manager,
            secret_id="id1",
            secret_name="name2",
        )


def test_decrypt_with_wrong_passphrase_fails():
    kek_manager1 = KEKManager(passphrase="passphrase1")
    kek_manager2 = KEKManager(passphrase="passphrase2")
    secret_value = "my-secret-key"

    result = _encrypt_secret(secret_value, kek_manager1, secret_id="id1", secret_name="name1")

    with pytest.raises(MlflowException, match="Failed to decrypt secret"):
        _decrypt_secret(
            result.encrypted_value,
            result.wrapped_dek,
            kek_manager2,
            secret_id="id1",
            secret_name="name1",
        )


def test_encrypt_secret_unicode(kek_manager):
    secret_value = "🔐 Secret with emoji 密钥"
    secret_id = "id1"
    secret_name = "unicode-secret"

    result = _encrypt_secret(secret_value, kek_manager, secret_id, secret_name)

    decrypted_value = _decrypt_secret(
        result.encrypted_value, result.wrapped_dek, kek_manager, secret_id, secret_name
    )

    assert decrypted_value == secret_value


def test_rotate_secret_encryption():
    old_kek_manager = KEKManager(passphrase="old-passphrase")
    new_kek_manager = KEKManager(passphrase="new-passphrase")
    secret_value = "my-secret-key"
    secret_id = "id1"
    secret_name = "name1"

    encrypt_result = _encrypt_secret(secret_value, old_kek_manager, secret_id, secret_name)

    rotate_result = rotate_secret_encryption(
        encrypt_result.encrypted_value,
        encrypt_result.wrapped_dek,
        old_kek_manager,
        new_kek_manager,
    )

    assert rotate_result.encrypted_value == encrypt_result.encrypted_value
    assert rotate_result.wrapped_dek != encrypt_result.wrapped_dek

    decrypted_value = _decrypt_secret(
        rotate_result.encrypted_value,
        rotate_result.wrapped_dek,
        new_kek_manager,
        secret_id,
        secret_name,
    )

    assert decrypted_value == secret_value


def test_rotate_cannot_decrypt_with_old_kek():
    old_kek_manager = KEKManager(passphrase="old-passphrase")
    new_kek_manager = KEKManager(passphrase="new-passphrase")
    secret_value = "my-secret-key"
    secret_id = "id1"
    secret_name = "name1"

    encrypt_result = _encrypt_secret(secret_value, old_kek_manager, secret_id, secret_name)

    rotate_result = rotate_secret_encryption(
        encrypt_result.encrypted_value,
        encrypt_result.wrapped_dek,
        old_kek_manager,
        new_kek_manager,
    )

    with pytest.raises(MlflowException, match="Failed to decrypt secret"):
        _decrypt_secret(
            encrypt_result.encrypted_value,
            rotate_result.wrapped_dek,
            old_kek_manager,
            secret_id,
            secret_name,
        )


def test_rotate_with_wrong_old_kek_fails():
    wrong_kek_manager = KEKManager(passphrase="wrong-passphrase")
    new_kek_manager = KEKManager(passphrase="new-passphrase")
    correct_kek_manager = KEKManager(passphrase="correct-passphrase")
    secret_value = "my-secret-key"
    secret_id = "id1"
    secret_name = "name1"

    result = _encrypt_secret(secret_value, correct_kek_manager, secret_id, secret_name)

    with pytest.raises(MlflowException, match="Failed to rotate secret encryption"):
        rotate_secret_encryption(
            result.encrypted_value, result.wrapped_dek, wrong_kek_manager, new_kek_manager
        )


@pytest.mark.parametrize(
    "secrets",
    [
        [("secret1", "id1", "name1"), ("secret2", "id2", "name2"), ("secret3", "id3", "name3")],
        [("value1", "uuid-1", "api-key"), ("value2", "uuid-2", "password")],
    ],
)
def test_rotate_multiple_secrets(secrets):
    old_kek_manager = KEKManager(passphrase="old-passphrase")
    new_kek_manager = KEKManager(passphrase="new-passphrase")

    encrypted_secrets = []
    for secret_value, secret_id, secret_name in secrets:
        result = _encrypt_secret(secret_value, old_kek_manager, secret_id, secret_name)
        encrypted_secrets.append(
            (result.encrypted_value, result.wrapped_dek, secret_id, secret_name)
        )

    for encrypted_value, old_wrapped_dek, secret_id, secret_name in encrypted_secrets:
        rotate_result = rotate_secret_encryption(
            encrypted_value, old_wrapped_dek, old_kek_manager, new_kek_manager
        )

        original_value = next(s[0] for s in secrets if s[1] == secret_id and s[2] == secret_name)
        decrypted_value = _decrypt_secret(
            encrypted_value,
            rotate_result.wrapped_dek,
            new_kek_manager,
            secret_id,
            secret_name,
        )
        assert decrypted_value == original_value
```

--------------------------------------------------------------------------------

---[FILE: test_data.py]---
Location: mlflow-master/tests/utils/test_data.py

```python
import os

from mlflow.projects import _project_spec
from mlflow.utils.data_utils import is_uri

TEST_DIR = "tests"
TEST_PROJECT_DIR = os.path.join(TEST_DIR, "resources", "example_project")


def load_project():
    return _project_spec.load_project(directory=TEST_PROJECT_DIR)


def test_is_uri():
    assert is_uri("s3://some/s3/path")
    assert is_uri("gs://some/gs/path")
    assert is_uri("dbfs:/some/dbfs/path")
    assert is_uri("file://some/local/path")
    assert not is_uri("/tmp/some/local/path")
```

--------------------------------------------------------------------------------

---[FILE: test_databricks_tracing_utils.py]---
Location: mlflow-master/tests/utils/test_databricks_tracing_utils.py

```python
import json

from google.protobuf.timestamp_pb2 import Timestamp

import mlflow
from mlflow.entities import (
    AssessmentSource,
    Expectation,
    Feedback,
    Trace,
    TraceData,
    TraceInfo,
    TraceState,
)
from mlflow.entities.trace_location import (
    InferenceTableLocation,
    MlflowExperimentLocation,
    TraceLocation,
    TraceLocationType,
    UCSchemaLocation,
)
from mlflow.protos import assessments_pb2
from mlflow.protos import databricks_tracing_pb2 as pb
from mlflow.protos.assessments_pb2 import AssessmentSource as ProtoAssessmentSource
from mlflow.tracing.constant import (
    TRACE_ID_V4_PREFIX,
    TRACE_SCHEMA_VERSION,
    TRACE_SCHEMA_VERSION_KEY,
    SpanAttributeKey,
)
from mlflow.tracing.utils import TraceMetadataKey, add_size_stats_to_trace_metadata
from mlflow.utils.databricks_tracing_utils import (
    assessment_to_proto,
    get_trace_id_from_assessment_proto,
    inference_table_location_to_proto,
    mlflow_experiment_location_to_proto,
    trace_from_proto,
    trace_location_from_proto,
    trace_location_to_proto,
    trace_to_proto,
    uc_schema_location_from_proto,
    uc_schema_location_to_proto,
)


def test_trace_location_to_proto_uc_schema():
    trace_location = TraceLocation.from_databricks_uc_schema(
        catalog_name="test_catalog", schema_name="test_schema"
    )
    proto = trace_location_to_proto(trace_location)
    assert proto.type == pb.TraceLocation.TraceLocationType.UC_SCHEMA
    assert proto.uc_schema.catalog_name == "test_catalog"
    assert proto.uc_schema.schema_name == "test_schema"


def test_trace_location_to_proto_mlflow_experiment():
    trace_location = TraceLocation.from_experiment_id(experiment_id="1234")
    proto = trace_location_to_proto(trace_location)
    assert proto.type == pb.TraceLocation.TraceLocationType.MLFLOW_EXPERIMENT
    assert proto.mlflow_experiment.experiment_id == "1234"


def test_trace_location_to_proto_inference_table():
    trace_location = TraceLocation(
        type=TraceLocationType.INFERENCE_TABLE,
        inference_table=InferenceTableLocation(
            full_table_name="test_catalog.test_schema.test_table"
        ),
    )
    proto = trace_location_to_proto(trace_location)
    assert proto.type == pb.TraceLocation.TraceLocationType.INFERENCE_TABLE
    assert proto.inference_table.full_table_name == "test_catalog.test_schema.test_table"


def test_uc_schema_location_to_proto():
    schema_location = UCSchemaLocation(catalog_name="test_catalog", schema_name="test_schema")
    proto = uc_schema_location_to_proto(schema_location)
    assert proto.catalog_name == "test_catalog"
    assert proto.schema_name == "test_schema"


def test_uc_schema_location_from_proto():
    proto = pb.UCSchemaLocation(
        catalog_name="test_catalog",
        schema_name="test_schema",
        otel_spans_table_name="test_spans",
        otel_logs_table_name="test_logs",
    )
    schema_location = uc_schema_location_from_proto(proto)
    assert schema_location.catalog_name == "test_catalog"
    assert schema_location.schema_name == "test_schema"
    assert schema_location.full_otel_spans_table_name == "test_catalog.test_schema.test_spans"
    assert schema_location.full_otel_logs_table_name == "test_catalog.test_schema.test_logs"


def test_inference_table_location_to_proto():
    table_location = InferenceTableLocation(full_table_name="test_catalog.test_schema.test_table")
    proto = inference_table_location_to_proto(table_location)
    assert proto.full_table_name == "test_catalog.test_schema.test_table"


def test_mlflow_experiment_location_to_proto():
    experiment_location = MlflowExperimentLocation(experiment_id="1234")
    proto = mlflow_experiment_location_to_proto(experiment_location)
    assert proto.experiment_id == "1234"


def test_schema_location_to_proto():
    schema_location = UCSchemaLocation(
        catalog_name="test_catalog",
        schema_name="test_schema",
    )
    schema_location._otel_spans_table_name = "test_spans"
    schema_location._otel_logs_table_name = "test_logs"
    proto = uc_schema_location_to_proto(schema_location)
    assert proto.catalog_name == "test_catalog"
    assert proto.schema_name == "test_schema"
    assert proto.otel_spans_table_name == "test_spans"
    assert proto.otel_logs_table_name == "test_logs"


def test_trace_location_from_proto_uc_schema():
    proto = pb.TraceLocation(
        type=pb.TraceLocation.TraceLocationType.UC_SCHEMA,
        uc_schema=pb.UCSchemaLocation(
            catalog_name="catalog",
            schema_name="schema",
            otel_spans_table_name="spans",
            otel_logs_table_name="logs",
        ),
    )
    trace_location = trace_location_from_proto(proto)
    assert trace_location.uc_schema.catalog_name == "catalog"
    assert trace_location.uc_schema.schema_name == "schema"
    assert trace_location.uc_schema.full_otel_spans_table_name == "catalog.schema.spans"
    assert trace_location.uc_schema.full_otel_logs_table_name == "catalog.schema.logs"


def test_trace_location_from_proto_mlflow_experiment():
    proto = pb.TraceLocation(
        type=pb.TraceLocation.TraceLocationType.MLFLOW_EXPERIMENT,
        mlflow_experiment=mlflow_experiment_location_to_proto(
            MlflowExperimentLocation(experiment_id="1234")
        ),
    )
    trace_location = trace_location_from_proto(proto)
    assert trace_location.type == TraceLocationType.MLFLOW_EXPERIMENT
    assert trace_location.mlflow_experiment.experiment_id == "1234"


def test_trace_location_from_proto_inference_table():
    proto = pb.TraceLocation(
        type=pb.TraceLocation.TraceLocationType.INFERENCE_TABLE,
        inference_table=inference_table_location_to_proto(
            InferenceTableLocation(full_table_name="test_catalog.test_schema.test_table")
        ),
    )
    trace_location = trace_location_from_proto(proto)
    assert trace_location.type == TraceLocationType.INFERENCE_TABLE
    assert trace_location.inference_table.full_table_name == "test_catalog.test_schema.test_table"


def test_trace_info_to_v4_proto():
    otel_trace_id = "2efb31387ff19263f92b2c0a61b0a8bc"
    trace_id = f"trace:/catalog.schema/{otel_trace_id}"
    trace_info = TraceInfo(
        trace_id=trace_id,
        trace_location=TraceLocation.from_databricks_uc_schema(
            catalog_name="catalog", schema_name="schema"
        ),
        request_time=0,
        state=TraceState.OK,
        request_preview="request",
        response_preview="response",
        client_request_id="client_request_id",
        tags={"key": "value"},
    )
    proto_trace_info = trace_info.to_proto()
    assert proto_trace_info.trace_id == otel_trace_id
    assert proto_trace_info.trace_location.uc_schema.catalog_name == "catalog"
    assert proto_trace_info.trace_location.uc_schema.schema_name == "schema"
    assert proto_trace_info.state == 1
    assert proto_trace_info.request_preview == "request"
    assert proto_trace_info.response_preview == "response"
    assert proto_trace_info.client_request_id == "client_request_id"
    assert proto_trace_info.tags == {"key": "value"}
    assert len(proto_trace_info.assessments) == 0

    trace_info_from_proto = TraceInfo.from_proto(proto_trace_info)
    assert trace_info_from_proto == trace_info


def test_trace_to_proto_and_from_proto():
    with mlflow.start_span() as span:
        otel_trace_id = span.trace_id.removeprefix("tr-")
        uc_schema = "catalog.schema"
        trace_id = f"trace:/{uc_schema}/{otel_trace_id}"
        span.set_attribute(SpanAttributeKey.REQUEST_ID, trace_id)
        mlflow_span = span.to_immutable_span()

    assert mlflow_span.trace_id == trace_id
    trace = Trace(
        info=TraceInfo(
            trace_id=trace_id,
            trace_location=TraceLocation.from_databricks_uc_schema(
                catalog_name="catalog", schema_name="schema"
            ),
            request_time=0,
            state=TraceState.OK,
            request_preview="request",
            response_preview="response",
            client_request_id="client_request_id",
            tags={"key": "value"},
        ),
        data=TraceData(spans=[mlflow_span]),
    )

    proto_trace_v4 = trace_to_proto(trace)

    assert proto_trace_v4.trace_info.trace_id == otel_trace_id
    assert proto_trace_v4.trace_info.trace_location.uc_schema.catalog_name == "catalog"
    assert proto_trace_v4.trace_info.trace_location.uc_schema.schema_name == "schema"
    assert len(proto_trace_v4.spans) == len(trace.data.spans)

    reconstructed_trace = trace_from_proto(proto_trace_v4, location_id="catalog.schema")

    assert reconstructed_trace.info.trace_id == trace_id
    assert reconstructed_trace.info.trace_location.uc_schema.catalog_name == "catalog"
    assert reconstructed_trace.info.trace_location.uc_schema.schema_name == "schema"
    assert len(reconstructed_trace.data.spans) == len(trace.data.spans)

    original_span = trace.data.spans[0]
    reconstructed_span = reconstructed_trace.data.spans[0]

    assert reconstructed_span.name == original_span.name
    assert reconstructed_span.span_id == original_span.span_id
    assert reconstructed_span.trace_id == original_span.trace_id
    assert reconstructed_span.inputs == original_span.inputs
    assert reconstructed_span.outputs == original_span.outputs
    assert reconstructed_span.get_attribute("custom") == original_span.get_attribute("custom")


def test_trace_from_proto_with_location_preserves_v4_trace_id():
    with mlflow.start_span() as span:
        otel_trace_id = span.trace_id.removeprefix("tr-")
        uc_schema = "catalog.schema"
        trace_id_v4 = f"{TRACE_ID_V4_PREFIX}{uc_schema}/{otel_trace_id}"
        span.set_attribute(SpanAttributeKey.REQUEST_ID, trace_id_v4)
        mlflow_span = span.to_immutable_span()

    # Create trace with v4 trace ID
    trace = Trace(
        info=TraceInfo(
            trace_id=trace_id_v4,
            trace_location=TraceLocation.from_databricks_uc_schema(
                catalog_name="catalog", schema_name="schema"
            ),
            request_time=0,
            state=TraceState.OK,
        ),
        data=TraceData(spans=[mlflow_span]),
    )

    # Convert to proto
    proto_trace = trace_to_proto(trace)

    # Reconstruct with location parameter
    reconstructed_trace = trace_from_proto(proto_trace, location_id=uc_schema)

    # Verify that all spans have the correct v4 trace_id format
    for reconstructed_span in reconstructed_trace.data.spans:
        assert reconstructed_span.trace_id == trace_id_v4
        assert reconstructed_span.trace_id.startswith(TRACE_ID_V4_PREFIX)
        # Verify the REQUEST_ID attribute is also in v4 format
        request_id = reconstructed_span.get_attribute("mlflow.traceRequestId")
        assert request_id == trace_id_v4


def test_trace_info_from_proto_handles_uc_schema_location():
    request_time = Timestamp()
    request_time.FromMilliseconds(1234567890)
    proto = pb.TraceInfo(
        trace_id="test_trace_id",
        trace_location=trace_location_to_proto(
            TraceLocation.from_databricks_uc_schema(catalog_name="catalog", schema_name="schema")
        ),
        request_preview="test request",
        response_preview="test response",
        request_time=request_time,
        state=TraceState.OK.to_proto(),
        trace_metadata={
            TRACE_SCHEMA_VERSION_KEY: str(TRACE_SCHEMA_VERSION),
            "other_key": "other_value",
        },
        tags={"test_tag": "test_value"},
    )
    trace_info = TraceInfo.from_proto(proto)
    assert trace_info.trace_location.uc_schema.catalog_name == "catalog"
    assert trace_info.trace_location.uc_schema.schema_name == "schema"
    assert trace_info.trace_metadata[TRACE_SCHEMA_VERSION_KEY] == str(TRACE_SCHEMA_VERSION)
    assert trace_info.trace_metadata["other_key"] == "other_value"
    assert trace_info.tags == {"test_tag": "test_value"}


def test_add_size_stats_to_trace_metadata_for_v4_trace():
    with mlflow.start_span() as span:
        otel_trace_id = span.trace_id.removeprefix("tr-")
        uc_schema = "catalog.schema"
        trace_id = f"trace:/{uc_schema}/{otel_trace_id}"
        span.set_attribute(SpanAttributeKey.REQUEST_ID, trace_id)
        mlflow_span = span.to_immutable_span()

    trace = Trace(
        info=TraceInfo(
            trace_id="test_trace_id",
            trace_location=TraceLocation.from_databricks_uc_schema(
                catalog_name="catalog", schema_name="schema"
            ),
            request_time=0,
            state=TraceState.OK,
            request_preview="request",
            response_preview="response",
            client_request_id="client_request_id",
            tags={"key": "value"},
        ),
        data=TraceData(spans=[mlflow_span]),
    )
    add_size_stats_to_trace_metadata(trace)
    assert TraceMetadataKey.SIZE_STATS in trace.info.trace_metadata


def test_assessment_to_proto():
    # Test with Feedback assessment
    feedback = Feedback(
        name="correctness",
        value=0.95,
        source=AssessmentSource(source_type="LLM_JUDGE", source_id="gpt-4"),
        trace_id="trace:/catalog.schema/trace123",
        metadata={"model": "gpt-4", "temperature": "0.7"},
        span_id="span456",
        rationale="The response is accurate and complete",
        overrides="old_assessment_id",
        valid=False,
    )
    feedback.assessment_id = "assessment789"

    proto_v4 = assessment_to_proto(feedback)

    # Validate proto structure
    assert isinstance(proto_v4, pb.Assessment)
    assert proto_v4.assessment_name == "correctness"
    assert proto_v4.assessment_id == "assessment789"
    assert proto_v4.span_id == "span456"
    assert proto_v4.rationale == "The response is accurate and complete"
    assert proto_v4.overrides == "old_assessment_id"
    assert proto_v4.valid is False

    # Check TraceIdentifier
    assert proto_v4.trace_id == "trace123"
    assert proto_v4.trace_location.uc_schema.catalog_name == "catalog"
    assert proto_v4.trace_location.uc_schema.schema_name == "schema"

    # Check source
    assert proto_v4.source.source_type == ProtoAssessmentSource.SourceType.Value("LLM_JUDGE")
    assert proto_v4.source.source_id == "gpt-4"

    # Check metadata
    assert proto_v4.metadata["model"] == "gpt-4"
    assert proto_v4.metadata["temperature"] == "0.7"

    # Check feedback value
    assert proto_v4.HasField("feedback")
    assert proto_v4.feedback.value.number_value == 0.95

    # Test with Expectation assessment
    expectation = Expectation(
        name="expected_answer",
        value={"answer": "Paris", "confidence": 0.99},
        source=AssessmentSource(source_type="HUMAN", source_id="user@example.com"),
        trace_id="trace:/main.default/trace789",
        metadata={"question": "What is the capital of France?"},
        span_id="span111",
    )
    expectation.assessment_id = "exp_assessment123"

    proto_v4_exp = assessment_to_proto(expectation)

    assert isinstance(proto_v4_exp, pb.Assessment)
    assert proto_v4_exp.assessment_name == "expected_answer"
    assert proto_v4_exp.assessment_id == "exp_assessment123"
    assert proto_v4_exp.span_id == "span111"

    # Check TraceIdentifier for expectation
    assert proto_v4_exp.trace_id == "trace789"
    assert proto_v4_exp.trace_location.uc_schema.catalog_name == "main"
    assert proto_v4_exp.trace_location.uc_schema.schema_name == "default"

    # Check expectation value
    assert proto_v4_exp.HasField("expectation")
    assert proto_v4_exp.expectation.HasField("serialized_value")
    assert json.loads(proto_v4_exp.expectation.serialized_value.value) == {
        "answer": "Paris",
        "confidence": 0.99,
    }


def test_get_trace_id_from_assessment_proto():
    proto = pb.Assessment(
        trace_id="1234",
        trace_location=trace_location_to_proto(
            TraceLocation.from_databricks_uc_schema(catalog_name="catalog", schema_name="schema")
        ),
    )
    assert get_trace_id_from_assessment_proto(proto) == "trace:/catalog.schema/1234"

    proto = assessments_pb2.Assessment(
        trace_id="tr-123",
    )
    assert get_trace_id_from_assessment_proto(proto) == "tr-123"
```

--------------------------------------------------------------------------------

````
