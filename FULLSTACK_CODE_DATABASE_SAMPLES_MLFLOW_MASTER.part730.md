---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 730
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 730 of 991)

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

---[FILE: credentials.py]---
Location: mlflow-master/mlflow/utils/credentials.py

```python
import configparser
import getpass
import logging
import os
from typing import NamedTuple

from mlflow.environment_variables import (
    MLFLOW_TRACKING_AUTH,
    MLFLOW_TRACKING_AWS_SIGV4,
    MLFLOW_TRACKING_CLIENT_CERT_PATH,
    MLFLOW_TRACKING_INSECURE_TLS,
    MLFLOW_TRACKING_PASSWORD,
    MLFLOW_TRACKING_SERVER_CERT_PATH,
    MLFLOW_TRACKING_TOKEN,
    MLFLOW_TRACKING_USERNAME,
)
from mlflow.exceptions import MlflowException
from mlflow.utils.rest_utils import MlflowHostCreds

_logger = logging.getLogger(__name__)


class MlflowCreds(NamedTuple):
    username: str | None
    password: str | None


def _get_credentials_path() -> str:
    return os.path.expanduser("~/.mlflow/credentials")


def _read_mlflow_creds_from_file() -> tuple[str | None, str | None]:
    path = _get_credentials_path()
    if not os.path.exists(path):
        return None, None

    config = configparser.ConfigParser()
    config.read(path)
    if "mlflow" not in config:
        return None, None

    mlflow_cfg = config["mlflow"]
    username_key = MLFLOW_TRACKING_USERNAME.name.lower()
    password_key = MLFLOW_TRACKING_PASSWORD.name.lower()
    return mlflow_cfg.get(username_key), mlflow_cfg.get(password_key)


def _read_mlflow_creds_from_env() -> tuple[str | None, str | None]:
    return MLFLOW_TRACKING_USERNAME.get(), MLFLOW_TRACKING_PASSWORD.get()


def read_mlflow_creds() -> MlflowCreds:
    username_file, password_file = _read_mlflow_creds_from_file()
    username_env, password_env = _read_mlflow_creds_from_env()
    return MlflowCreds(
        username=username_env or username_file,
        password=password_env or password_file,
    )


def get_default_host_creds(store_uri):
    creds = read_mlflow_creds()
    return MlflowHostCreds(
        host=store_uri,
        username=creds.username,
        password=creds.password,
        token=MLFLOW_TRACKING_TOKEN.get(),
        aws_sigv4=MLFLOW_TRACKING_AWS_SIGV4.get(),
        auth=MLFLOW_TRACKING_AUTH.get(),
        ignore_tls_verification=MLFLOW_TRACKING_INSECURE_TLS.get(),
        client_cert_path=MLFLOW_TRACKING_CLIENT_CERT_PATH.get(),
        server_cert_path=MLFLOW_TRACKING_SERVER_CERT_PATH.get(),
    )


def login(backend: str = "databricks", interactive: bool = True) -> None:
    """Configure MLflow server authentication and connect MLflow to tracking server.

    This method provides a simple way to connect MLflow to its tracking server. Currently only
    Databricks tracking server is supported. Users will be prompted to enter the credentials if no
    existing Databricks profile is found, and the credentials will be saved to `~/.databrickscfg`.

    Args:
        backend: string, the backend of the tracking server. Currently only "databricks" is
            supported.

        interactive: bool, controls request for user input on missing credentials. If true, user
            input will be requested if no credentials are found, otherwise an exception will be
            raised if no credentials are found.

    .. code-block:: python
        :caption: Example

        import mlflow

        mlflow.login()
        with mlflow.start_run():
            mlflow.log_param("p", 0)
    """
    from mlflow.tracking import set_tracking_uri

    if backend == "databricks":
        _databricks_login(interactive)
        set_tracking_uri("databricks")
    else:
        raise MlflowException(
            f"Currently only 'databricks' backend is supported, received `backend={backend}`."
        )


def _validate_databricks_auth():
    # Check if databricks credentials are valid.
    try:
        from databricks.sdk import WorkspaceClient
    except ImportError:
        raise ImportError(
            "Databricks SDK is not installed. To use `mlflow.login()`, please install "
            "databricks-sdk by `pip install databricks-sdk`."
        )

    try:
        w = WorkspaceClient()
        if "community" in w.config.host:
            # Databricks community edition cannot use `w.current_user.me()` for auth validation.
            w.clusters.list_zones()
        else:
            # If credentials are invalid, `w.current_user.me()` will throw an error.
            w.current_user.me()
        _logger.info(
            f"Successfully connected to MLflow hosted tracking server! Host: {w.config.host}."
        )
    except Exception as e:
        raise MlflowException(f"Failed to validate databricks credentials: {e}")


def _overwrite_or_create_databricks_profile(
    file_name,
    profile,
    profile_name="DEFAULT",
):
    """Overwrite or create a profile in the databricks config file.

    Args:
        file_name: string, the file name of the databricks config file, usually `~/.databrickscfg`.
        profile: dict, contains the authentiacation profile information.
        profile_name: string, the name of the profile to be overwritten or created.
    """
    profile_name = f"[{profile_name}]"
    lines = []
    # Read `file_name` if the file exists, otherwise `lines=[]`.
    if os.path.exists(file_name):
        with open(file_name) as file:
            lines = file.readlines()
    start_index = -1
    end_index = -1
    # Find the start and end indices of the profile to overwrite.
    for i in range(len(lines)):
        if lines[i].strip() == profile_name:
            start_index = i
            break

    if start_index != -1:
        for i in range(start_index + 1, len(lines)):
            # Reach an empty line or a new profile.
            if lines[i].strip() == "" or lines[i].startswith("["):
                end_index = i
                break
        end_index = end_index if end_index != -1 else len(lines)
        del lines[start_index : end_index + 1]

    # Write the new profile to the top of the file.
    new_profile = []
    new_profile.append(profile_name + "\n")
    new_profile.append(f"host = {profile['host']}\n")
    if "token" in profile:
        new_profile.append(f"token = {profile['token']}\n")
    else:
        new_profile.append(f"username = {profile['username']}\n")
        new_profile.append(f"password = {profile['password']}\n")
    new_profile.append("\n")
    lines = new_profile + lines

    # Write back the modified lines to the file.
    with open(file_name, "w") as file:
        file.writelines(lines)


def _databricks_login(interactive):
    """Set up databricks authentication."""
    try:
        # Failed validation will throw an error.
        _validate_databricks_auth()
        return
    except Exception:
        if interactive:
            _logger.info("No valid Databricks credentials found, please enter your credentials...")
        else:
            raise MlflowException(
                "No valid Databricks credentials found while running in non-interactive mode."
            )

    while True:
        host = input("Databricks Host (should begin with https://): ")
        if not host.startswith("https://"):
            _logger.error("Invalid host: {host}, host must begin with https://, please retry.")
        break

    profile = {"host": host}
    if "community" in host:
        # Databricks community edition requires username and password for authentication.
        username = input("Username: ")
        password = getpass.getpass("Password: ")
        profile["username"] = username
        profile["password"] = password
    else:
        # Production or staging Databricks requires personal token for authentication.
        token = getpass.getpass("Token: ")
        profile["token"] = token

    file_name = os.environ.get(
        "DATABRICKS_CONFIG_FILE", f"{os.path.expanduser('~')}/.databrickscfg"
    )
    profile_name = os.environ.get("DATABRICKS_CONFIG_PROFILE", "DEFAULT")
    _overwrite_or_create_databricks_profile(file_name, profile, profile_name)

    try:
        # Failed validation will throw an error.
        _validate_databricks_auth()
    except Exception as e:
        # If user entered invalid auth, we will raise an error and ask users to retry.
        raise MlflowException(f"`mlflow.login()` failed with error: {e}")
```

--------------------------------------------------------------------------------

---[FILE: crypto.py]---
Location: mlflow-master/mlflow/utils/crypto.py
Signals: Flask

```python
import json
import logging
import os
from dataclasses import dataclass
from typing import Any

from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE

# KEK (Key Encryption Key) environment variables for envelope encryption
# These are defined here to avoid importing mlflow.server.constants (which triggers Flask import)
# and to keep this crypto module self-contained for the skinny client.
#
# SECURITY: Server-admin-only credentials. NEVER pass via CLI (visible in ps/logs).
# Set via environment variable or .env file. Users do NOT need this - only server admins.
# Must be high-entropy (32+ characters) from a secrets manager.
CRYPTO_KEK_PASSPHRASE_ENV_VAR = "MLFLOW_CRYPTO_KEK_PASSPHRASE"
CRYPTO_KEK_VERSION_ENV_VAR = "MLFLOW_CRYPTO_KEK_VERSION"

# Default passphrase used when MLFLOW_CRYPTO_KEK_PASSPHRASE is not set.
# This enables the gateway to work out-of-the-box for development and testing.
#
# SECURITY WARNING: Using the default passphrase means all MLflow installations share
# the same encryption key. This is acceptable for development/testing but NOT for production.
# For production deployments, always set MLFLOW_CRYPTO_KEK_PASSPHRASE to a unique,
# high-entropy value from your secrets manager.
#
# If secrets were encrypted with one passphrase and the server is restarted with a different
# passphrase (or the default), decryption will fail. The error message will indicate this.
DEFAULT_KEK_PASSPHRASE = "mlflow-default-kek-passphrase-for-development-only"

_logger = logging.getLogger(__name__)


# Application-level salt for KEK derivation (intentionally fixed, not per-password)
#
# NB: We use a fixed salt because our use case is KEY DERIVATION, not password storage.
# The passphrase is a server-side admin credential (not user passwords), which is in control
# by the server admin.
# Another reason for a fixed salt is because we need a fixed and reliable, deterministic KEK
# derivation (same passphrase always produces same KEK) across server restarts.
# Storing a per-deployment random salt would add complexity without significant security benefit
# because the passphrase is not user-chosen and is not stored in a database.
# This changes the threat model to server compromise, rather than encrypted secrets decryption
# brute-force attacks.
#
# This is acceptable because:
# 1. The passphrase is stored server-side in environment variables (not transmitted to users)
# 2. We use 600,000 PBKDF2 iterations to prevent brute-force attacks (see below for links)
# 3. Admins should use high-entropy passphrases (32+ characters from secrets manager)
# 4. The salt prevents pre-computation attacks across different algorithms/purposes
#
# For comparison, this is similar to how TLS derives keys from master secrets (used in HTTPS)
#
# NB: For password storage use cases (which this is NOT), see OWASP guidance on random salts:
# https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
# For PBKDF2 salt requirements, see:
# https://cryptography.io/en/latest/hazmat/primitives/key-derivation-functions/#cryptography.hazmat.primitives.kdf.pbkdf2.PBKDF2HMAC
MLFLOW_KEK_SALT = b"mlflow-secrets-kek-v1-2025"

# OWASP 2023 recommendation for PBKDF2-HMAC-SHA256 is 600,000 iterations
# This provides strong protection against brute-force attacks on the KEK passphrase
#
# NB: See OWASP Password Storage Cheat Sheet for iteration count recommendations:
# https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
# "PBKDF2-HMAC-SHA256: 600,000 iterations"
PBKDF2_ITERATIONS = 600_000

# AES-256 key length in bytes
#
# NB: NIST FIPS 197 specifies AES-256 uses 32-byte (256-bit) keys:
# https://csrc.nist.gov/pubs/fips/197/final
AES_256_KEY_LENGTH = 32

# AES-GCM nonce length in bytes (96 bits recommended from NIST)
#
# NB: NIST SP 800-38D recommends 96-bit (12-byte) nonces for GCM:
# https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf
# "The performance of GCM can be optimized by using IVs of length 96 bits"
#
# Also see cryptography.io AESGCM documentation:
# https://cryptography.io/en/latest/hazmat/primitives/aead/#cryptography.hazmat.primitives.ciphers.aead.AESGCM
GCM_NONCE_LENGTH = 12


@dataclass(frozen=True)
class AESGCMResult:
    """
    Result of AES-GCM encryption operation.

    Attributes:
        nonce: 12-byte random nonce used for encryption
        ciphertext: Encrypted data with 16-byte authentication tag appended
    """

    nonce: bytes
    ciphertext: bytes


@dataclass(frozen=True)
class EncryptedSecret:
    """
    Result of secret encryption using envelope encryption.

    Attributes:
        encrypted_value: Full encrypted secret (nonce + ciphertext + tag)
        wrapped_dek: Encrypted DEK wrapped with KEK (nonce + ciphertext + tag)
        kek_version: Version of the KEK used to wrap the DEK

    Both encrypted_value and wrapped_dek are ready for database storage as bytes.
    """

    encrypted_value: bytes
    wrapped_dek: bytes
    kek_version: int


@dataclass(frozen=True)
class RotatedSecret:
    """
    Result of KEK rotation for a secret.

    Attributes:
        encrypted_value: Unchanged encrypted secret (same DEK, same ciphertext)
        wrapped_dek: DEK re-wrapped with new KEK

    During KEK rotation, only the wrapped_dek changes. The encrypted_value
    remains the same because we reuse the same DEK.
    """

    encrypted_value: bytes
    wrapped_dek: bytes


class KEKManager:
    """
    Manages Key Encryption Keys (KEK) for MLflow encrypted data (API Keys, etc.).

    KEK is derived from a passphrase using PBKDF2-HMAC-SHA256. The same passphrase
    always produces the same KEK (deterministic derivation).

    The passphrase can be provided either via the constructor (which is used for rotating KEKs
    and updating DEKs in the database) or via the MLFLOW_CRYPTO_KEK_PASSPHRASE environment
    variable (which is used during normal server operation).

    If no passphrase is provided and MLFLOW_CRYPTO_KEK_PASSPHRASE is not set, a default
    passphrase is used. This enables the gateway to work out-of-the-box for development,
    but is NOT recommended for production use.

    Args:
        passphrase: Optional passphrase. If None, reads from MLFLOW_CRYPTO_KEK_PASSPHRASE env var.
            If env var is also not set, uses DEFAULT_KEK_PASSPHRASE.
        kek_version: Optional version identifier for this KEK. If None, reads from
            MLFLOW_CRYPTO_KEK_VERSION env var (default 1). Used to track which KEK version
            was used to wrap each DEK, enabling KEK rotation.
    """

    def __init__(self, passphrase: str | None = None, kek_version: int | None = None):
        if passphrase is None:
            passphrase = os.getenv(CRYPTO_KEK_PASSPHRASE_ENV_VAR)

        if kek_version is None:
            kek_version = int(os.getenv(CRYPTO_KEK_VERSION_ENV_VAR, "1"))

        # Use default passphrase if none provided
        self._using_default_passphrase = not passphrase
        if not passphrase:
            passphrase = DEFAULT_KEK_PASSPHRASE
            _logger.warning(
                "MLFLOW_CRYPTO_KEK_PASSPHRASE not set. Using default passphrase for "
                "secrets encryption. This is acceptable for local development (localhost) "
                "but is a SECURITY RISK for remote or shared tracking servers. Anyone with "
                "database access can decrypt secrets when using the default passphrase. "
                "Set MLFLOW_CRYPTO_KEK_PASSPHRASE to a unique, high-entropy value for any "
                "server accessible by multiple users or over a network."
            )

        self._kek_version = kek_version
        self._kek = self._derive_kek(passphrase, kek_version)
        _logger.debug("KEK derived from passphrase (version %d)", kek_version)

    def _derive_kek(self, passphrase: str, kek_version: int) -> bytes:
        """
        Derive a 256-bit KEK from passphrase using PBKDF2-HMAC-SHA256.

        Args:
            passphrase: Admin-provided passphrase
            kek_version: KEK version number to fold into salt

        Returns:
            32-byte (256-bit) KEK

        NB: We fold kek_version into the salt to ensure that different KEK versions
        produce different KEKs even if the same passphrase is accidentally reused.
        This provides defense-in-depth against passphrase reuse during KEK rotation.
        The version is encoded as 4 big-endian bytes appended to the base salt.
        """
        from cryptography.hazmat.primitives import hashes
        from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

        # NB: Folding kek_version into salt ensures unique KEK per version even with same passphrase
        versioned_salt = MLFLOW_KEK_SALT + kek_version.to_bytes(4, "big")

        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=AES_256_KEY_LENGTH,
            salt=versioned_salt,
            iterations=PBKDF2_ITERATIONS,
        )
        return kdf.derive(passphrase.encode("utf-8"))

    def get_kek(self) -> bytes:
        """
        Get the derived KEK.

        Returns:
            32-byte (256-bit) KEK
        """
        return self._kek

    @property
    def kek_version(self) -> int:
        """
        Get the KEK version.

        Returns:
            KEK version number
        """
        return self._kek_version

    @property
    def using_default_passphrase(self) -> bool:
        """
        Check if using the default passphrase.

        Returns:
            True if using the default passphrase (MLFLOW_CRYPTO_KEK_PASSPHRASE not set)
        """
        return self._using_default_passphrase


def _generate_dek() -> bytes:
    """
    Generate a random 256-bit Data Encryption Key (DEK).

    Each secret gets its own unique DEK, which is then wrapped (encrypted)
    with the KEK for storage.

    Uses AESGCM's built-in key generation which ensures cryptographically
    secure random bytes from the OS.

    Returns:
        32-byte (256-bit) random DEK

    NB: See cryptography.io documentation for key generation best practices:
    https://cryptography.io/en/latest/hazmat/primitives/aead/#cryptography.hazmat.primitives.ciphers.aead.AESGCM.generate_key
    https://cryptography.io/en/latest/random-numbers/
    """
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM

    return AESGCM.generate_key(bit_length=256)


def _encrypt_with_aes_gcm(
    plaintext: bytes,
    key: bytes,
    *,
    aad: bytes | None = None,
    _nonce_for_testing: bytes | None = None,
) -> AESGCMResult:
    """
    Encrypt plaintext using AES-256-GCM. INTERNAL FUNCTION.

    AES-GCM provides authenticated encryption with associated data (AEAD),
    which means tampering is detected automatically during decryption.

    CRITICAL: Never reuse a nonce with the same key. Nonce reuse completely compromises
    AES-GCM security, allowing attackers to recover plaintext and forge messages.

    Args:
        plaintext: Data to encrypt
        key: 32-byte AES-256 key
        aad: Optional Additional Authenticated Data. If provided, this data is
             authenticated but not encrypted. Useful for binding encryption to
             metadata (e.g., secret_id + secret_name) to prevent substitution attacks.
        _nonce_for_testing: FOR TESTING ONLY. 12-byte nonce for deterministic encryption
            in tests. In production, leave as None to generate a cryptographically secure
            random nonce. DO NOT use this parameter in production code.

    Returns:
        AESGCMResult with nonce and ciphertext

    Raises:
        ValueError: If key length is not 32 bytes or nonce length is not 12 bytes

    NB: See cryptography.io AESGCM documentation for security warnings:
    https://cryptography.io/en/latest/hazmat/primitives/aead/#cryptography.hazmat.primitives.ciphers.aead.AESGCM
    "Reuse of a nonce with a given key compromises the security of any message with that
    nonce and key pair."
    """

    if len(key) != AES_256_KEY_LENGTH:
        raise ValueError(f"Key must be {AES_256_KEY_LENGTH} bytes (256 bits), got {len(key)}")

    nonce = os.urandom(GCM_NONCE_LENGTH) if _nonce_for_testing is None else _nonce_for_testing

    from cryptography.hazmat.primitives.ciphers.aead import AESGCM

    aesgcm = AESGCM(key)
    ciphertext = aesgcm.encrypt(nonce, plaintext, aad)

    return AESGCMResult(nonce=nonce, ciphertext=ciphertext)


def decrypt_with_aes_gcm(ciphertext: bytes, key: bytes, aad: bytes | None = None) -> bytes:
    """
    Decrypt ciphertext using AES-256-GCM.

    Automatically verifies authentication tag to detect tampering.

    Args:
        ciphertext: Encrypted data with nonce prepended
        key: 32-byte AES-256 key
        aad: Optional Additional Authenticated Data. Must match the AAD used during
             encryption. If AAD was used during encryption but not provided here,
             decryption will fail.

    Returns:
        Decrypted plaintext

    Raises:
        ValueError: If key length is not 32 bytes or ciphertext is too short
        MlflowException: If authentication fails (tampering detected or AAD mismatch)
    """

    if len(key) != AES_256_KEY_LENGTH:
        raise ValueError(f"Key must be {AES_256_KEY_LENGTH} bytes (256 bits), got {len(key)}")

    if len(ciphertext) < GCM_NONCE_LENGTH:
        raise ValueError(f"Ciphertext too short (must be at least {GCM_NONCE_LENGTH} bytes)")

    nonce = ciphertext[:GCM_NONCE_LENGTH]
    encrypted_data = ciphertext[GCM_NONCE_LENGTH:]

    try:
        from cryptography.exceptions import InvalidTag
        from cryptography.hazmat.primitives.ciphers.aead import AESGCM

        aesgcm = AESGCM(key)
        return aesgcm.decrypt(nonce, encrypted_data, aad)
    except InvalidTag as e:
        raise MlflowException(
            "AES-GCM decryption failed: authentication tag verification failed. "
            "This indicates wrong key, AAD mismatch, or data tampering.",
            error_code=INVALID_PARAMETER_VALUE,
        ) from e


def wrap_dek(dek: bytes, kek: bytes) -> bytes:
    """
    Wrap (encrypt) a DEK with the KEK using AES-256-GCM.

    This is how we protect the DEK for storage in the database.

    Args:
        dek: Data Encryption Key to wrap
        kek: Key Encryption Key

    Returns:
        Wrapped (encrypted) DEK with nonce prepended
    """
    result = _encrypt_with_aes_gcm(dek, kek)
    return result.nonce + result.ciphertext


def unwrap_dek(wrapped_dek: bytes, kek: bytes) -> bytes:
    """
    Unwrap (decrypt) a DEK using the KEK.

    Args:
        wrapped_dek: Encrypted DEK
        kek: Key Encryption Key

    Returns:
        Unwrapped (decrypted) DEK

    Raises:
        MlflowException: If KEK is wrong or data tampered
    """
    try:
        return decrypt_with_aes_gcm(wrapped_dek, kek)
    except MlflowException as e:
        raise MlflowException(
            "Failed to unwrap DEK: incorrect KEK or corrupted wrapped DEK.",
            error_code=INVALID_PARAMETER_VALUE,
        ) from e


def _create_aad(secret_id: str, secret_name: str) -> bytes:
    """
    Create Additional Authenticated Data (AAD) from secret metadata.

    AAD binds the encryption to specific metadata, preventing ciphertext
    substitution attacks where an attacker swaps encrypted values between
    different secrets.

    Args:
        secret_id: Unique secret identifier (UUID)
        secret_name: Human-readable secret name

    Note that AAD is authenticated but not encrypted. See AESGCM documentation:
    https://cryptography.io/en/latest/hazmat/primitives/aead/#cryptography.hazmat.primitives.ciphers.aead.AESGCM
    "Associated data that should be authenticated with the key, but does not need
    to be encrypted."

    Returns:
        AAD bytes combining secret_id and secret_name
    """
    aad_str = f"{secret_id}|{secret_name}"
    return aad_str.encode("utf-8")


def _mask_secret_value(secret_value: str | dict[str, Any]) -> str:
    """
    Generate a masked version of a secret for display purposes.

    For strings, shows the first 3-4 characters and last 4 characters with "..." in between.
    For dicts, returns a summary of the structure to avoid exceeding database column limits.
    This allows users to identify secrets without exposing the full value.

    Args:
        secret_value: The plaintext secret value to mask (string or dict)

    Note that for strings shorter than 8 characters, this function returns "***" to avoid
    information leakage. For API keys with common prefixes (sk-, ghp_, etc.), it shows the
    prefix. The function always shows the last 4 characters to help with key identification.
    For dicts, returns a summary like "<dict: 3 keys (api_key, username, password)>" that
    fits within database VARCHAR(100) limits. Masked values are stored as plaintext
    and are NOT reversible.

    Returns:
        Masked string suitable for display (always returns str, even for dict inputs)
    """
    if isinstance(secret_value, dict):
        keys = list(secret_value.keys())
        num_keys = len(keys)

        if num_keys == 0:
            return "<dict: empty>"
        elif num_keys <= 3:
            key_names = ", ".join(keys)
        else:
            key_names = ", ".join(keys[:3]) + f", +{num_keys - 3} more"

        result = f"<dict: {num_keys} key{'s' if num_keys != 1 else ''} ({key_names})>"

        if len(result) > 95:
            result = result[:92] + "...>"

        return result

    if not isinstance(secret_value, str):
        return "***"

    if len(secret_value) < 8:
        return "***"

    prefix_len = 4 if secret_value.startswith(("ghp_", "gho_", "ghu_")) else 3

    prefix = secret_value[:prefix_len]
    suffix = secret_value[-4:]

    return f"{prefix}...{suffix}"


def _encrypt_secret(
    secret_value: str | dict[str, Any],
    kek_manager: KEKManager,
    secret_id: str,
    secret_name: str,
) -> EncryptedSecret:
    """
    Encrypt a secret value using envelope encryption with AAD.

    This function is the main entry point for encrypting secrets before storing
    them in the database. It uses a randomly generated DEK for each secret,
    encrypts the secret with AES-256-GCM using AAD, and then wraps the DEK with
    the KEK derived from the passphrase.

    Note that AAD protection is critical for security. The
    AAD (Additional Authenticated Data) binds the encryption to the specific
    secret metadata, preventing ciphertext substitution attacks where an attacker
    swaps encrypted values between different secrets.

    Args:
        secret_value: Plaintext secret to encrypt (string or dict). Dicts are JSON-serialized.
        kek_manager: KEK manager instance
        secret_id: Secret ID for AAD (required for security)
        secret_name: Secret name for AAD (required for security)

    Returns:
        EncryptedSecret with encrypted_value and wrapped_dek. The encrypted_value is
        comprised of the nonce + ciphertext + tag, and the wrapped_dek is comprised of
        nonce + encrypted DEK + tag.

    """
    if isinstance(secret_value, dict):
        secret_bytes = json.dumps(secret_value, sort_keys=True).encode("utf-8")
    else:
        secret_bytes = secret_value.encode("utf-8")
    dek = _generate_dek()
    aad = _create_aad(secret_id, secret_name)

    result = _encrypt_with_aes_gcm(secret_bytes, dek, aad=aad)
    encrypted_value = result.nonce + result.ciphertext

    kek = kek_manager.get_kek()
    wrapped_dek = wrap_dek(dek, kek)

    return EncryptedSecret(
        encrypted_value=encrypted_value,
        wrapped_dek=wrapped_dek,
        kek_version=kek_manager.kek_version,
    )


def _decrypt_secret(
    encrypted_value: bytes,
    wrapped_dek: bytes,
    kek_manager: KEKManager,
    secret_id: str,
    secret_name: str,
) -> str | dict[str, Any]:
    """
    Decrypt a secret value using envelope encryption with AAD verification.

    This function is the main entry point for decrypting secrets retrieved
    from the database. It unwraps the DEK with the KEK, then decrypts the secret
    value with AES-256-GCM using AAD verification. If the AAD does not match, decryption
    will fail, indicating potential tampering or substitution attacks.

    Args:
        encrypted_value: Encrypted secret from database
        wrapped_dek: Wrapped DEK from database
        kek_manager: KEK manager instance
        secret_id: Secret ID for AAD verification (must match encryption)
        secret_name: Secret name for AAD verification (must match encryption)

    Note that the AAD must exactly match the values used during encryption. If secret_id or
    secret_name have changed in the database, decryption will fail with an InvalidTag Exception.
    This protects against ciphertext substitution attacks. If the secret was encrypted as a dict,
    it will be returned as a dict. If it was encrypted as a string, it will be returned as a string.

    Returns:
        Plaintext secret value (string or dict)

    Raises:
        MlflowException: If decryption fails (wrong KEK, AAD mismatch, or tampered data)

    """
    try:
        kek = kek_manager.get_kek()
        dek = unwrap_dek(wrapped_dek, kek)

        aad = _create_aad(secret_id, secret_name)

        secret_bytes = decrypt_with_aes_gcm(encrypted_value, dek, aad=aad)

        plaintext = secret_bytes.decode("utf-8")

        try:
            return json.loads(plaintext)
        except json.JSONDecodeError:
            return plaintext

    except Exception as e:
        # Provide helpful error message if using default passphrase
        if kek_manager.using_default_passphrase:
            raise MlflowException(
                "Failed to decrypt secret. The server is using the default KEK passphrase, "
                "but the secret was likely encrypted with a custom passphrase.\n\n"
                "This typically happens when:\n"
                "1. Secrets were created with MLFLOW_CRYPTO_KEK_PASSPHRASE set\n"
                "2. The server was restarted without MLFLOW_CRYPTO_KEK_PASSPHRASE\n\n"
                "To fix this, set MLFLOW_CRYPTO_KEK_PASSPHRASE to the same value that was "
                "used when the secrets were created:\n"
                "  export MLFLOW_CRYPTO_KEK_PASSPHRASE='your-original-passphrase'\n\n"
                "If you've lost the original passphrase, the encrypted secrets cannot be "
                "recovered and must be recreated.",
                error_code=INVALID_PARAMETER_VALUE,
            ) from e
        else:
            raise MlflowException(
                "Failed to decrypt secret. Check KEK passphrase, secret metadata, "
                "or database integrity.",
                error_code=INVALID_PARAMETER_VALUE,
            ) from e


def rotate_secret_encryption(
    encrypted_value: bytes,
    wrapped_dek: bytes,
    old_kek_manager: KEKManager,
    new_kek_manager: KEKManager,
) -> RotatedSecret:
    """
    Rotate a secret's encryption from old KEK to new KEK.

    This is used during KEK rotation to re-encrypt secrets without changing their
    plaintext values. The DEK is unwrapped with the old KEK and re-wrapped with
    the new KEK. The secret value itself is not re-encrypted (same DEK is used).

    Args:
        encrypted_value: Current encrypted secret value
        wrapped_dek: Current wrapped DEK (encrypted with old KEK)
        old_kek_manager: KEK manager with old passphrase
        new_kek_manager: KEK manager with new passphrase

    Note that KEK rotation requires shutting down the MLflow server to ensure atomicity.
    The rotation is atomic (single database transaction) and idempotent. If rotation fails,
    nothing is changed and you can safely re-run the command. The admin workflow is:

    1. Shut down the MLflow server
    2. Set MLFLOW_CRYPTO_KEK_PASSPHRASE to the OLD passphrase
    3. Run the rotation CLI command with the NEW passphrase
    4. Update MLFLOW_CRYPTO_KEK_PASSPHRASE to the NEW passphrase in deployment config
    5. Restart the MLflow server

    Returns:
        RotatedSecret with unchanged encrypted_value and new wrapped_dek. The encrypted_value
        remains unchanged (same DEK, so same ciphertext), while the wrapped_dek contains the
        DEK re-wrapped with the new KEK.

    Raises:
        MlflowException: If decryption with old KEK fails
    """
    try:
        old_kek = old_kek_manager.get_kek()
        dek = unwrap_dek(wrapped_dek, old_kek)

        new_kek = new_kek_manager.get_kek()
        new_wrapped_dek = wrap_dek(dek, new_kek)

        return RotatedSecret(encrypted_value=encrypted_value, wrapped_dek=new_wrapped_dek)

    except Exception as e:
        raise MlflowException(
            "Failed to rotate secret encryption. Check old KEK passphrase or database integrity.",
            error_code=INVALID_PARAMETER_VALUE,
        ) from e
```

--------------------------------------------------------------------------------

````
