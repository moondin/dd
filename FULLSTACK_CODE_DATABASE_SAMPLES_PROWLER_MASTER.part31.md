---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 31
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 31 of 867)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - prowler-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/prowler-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: test_adapters.py]---
Location: prowler-master/api/src/backend/api/tests/test_adapters.py
Signals: Django

```python
from unittest.mock import MagicMock, patch

import pytest
from allauth.socialaccount.models import SocialLogin
from django.contrib.auth import get_user_model

from api.adapters import ProwlerSocialAccountAdapter

User = get_user_model()


@pytest.mark.django_db
class TestProwlerSocialAccountAdapter:
    def test_get_user_by_email_returns_user(self, create_test_user):
        adapter = ProwlerSocialAccountAdapter()
        user = adapter.get_user_by_email(create_test_user.email)
        assert user == create_test_user

    def test_get_user_by_email_returns_none_for_unknown_email(self):
        adapter = ProwlerSocialAccountAdapter()
        assert adapter.get_user_by_email("notfound@example.com") is None

    def test_pre_social_login_links_existing_user(self, create_test_user, rf):
        adapter = ProwlerSocialAccountAdapter()

        sociallogin = MagicMock(spec=SocialLogin)
        sociallogin.account = MagicMock()
        sociallogin.provider = MagicMock()
        sociallogin.provider.id = "saml"
        sociallogin.account.extra_data = {}
        sociallogin.user = create_test_user
        sociallogin.connect = MagicMock()

        adapter.pre_social_login(rf.get("/"), sociallogin)

        call_args = sociallogin.connect.call_args
        assert call_args is not None

        called_request, called_user = call_args[0]
        assert called_request.path == "/"
        assert called_user.email == create_test_user.email

    def test_pre_social_login_no_link_if_email_missing(self, rf):
        adapter = ProwlerSocialAccountAdapter()

        sociallogin = MagicMock(spec=SocialLogin)
        sociallogin.account = MagicMock()
        sociallogin.provider = MagicMock()
        sociallogin.user = MagicMock()
        sociallogin.provider.id = "saml"
        sociallogin.account.extra_data = {}
        sociallogin.connect = MagicMock()

        adapter.pre_social_login(rf.get("/"), sociallogin)

        sociallogin.connect.assert_not_called()

    def test_save_user_saml_sets_session_flag(self, rf):
        adapter = ProwlerSocialAccountAdapter()
        request = rf.get("/")
        request.session = {}

        sociallogin = MagicMock(spec=SocialLogin)
        sociallogin.provider = MagicMock()
        sociallogin.provider.id = "saml"
        sociallogin.account = MagicMock()
        sociallogin.account.extra_data = {}

        mock_user = MagicMock()
        mock_user.id = 123

        with patch("api.adapters.super") as mock_super:
            with patch("api.adapters.transaction"):
                with patch("api.adapters.MainRouter"):
                    mock_super.return_value.save_user.return_value = mock_user
                    adapter.save_user(request, sociallogin)
                    assert request.session["saml_user_created"] == "123"
```

--------------------------------------------------------------------------------

---[FILE: test_apps.py]---
Location: prowler-master/api/src/backend/api/tests/test_apps.py
Signals: Django

```python
import os
from pathlib import Path
from unittest.mock import MagicMock

import pytest
from django.conf import settings

import api.apps as api_apps_module
from api.apps import (
    ApiConfig,
    PRIVATE_KEY_FILE,
    PUBLIC_KEY_FILE,
    SIGNING_KEY_ENV,
    VERIFYING_KEY_ENV,
)


@pytest.fixture(autouse=True)
def reset_keys_initialized(monkeypatch):
    """Ensure per-test clean state for the module-level guard flag."""
    monkeypatch.setattr(api_apps_module, "_keys_initialized", False, raising=False)


def _stub_keys():
    return (
        """-----BEGIN PRIVATE KEY-----\nPRIVATE\n-----END PRIVATE KEY-----\n""",
        """-----BEGIN PUBLIC KEY-----\nPUBLIC\n-----END PUBLIC KEY-----\n""",
    )


def test_generate_jwt_keys_when_missing(monkeypatch, tmp_path):
    # Arrange: isolate FS, env, and settings; force generation path
    monkeypatch.setattr(
        api_apps_module, "KEYS_DIRECTORY", Path(tmp_path), raising=False
    )
    monkeypatch.delenv(SIGNING_KEY_ENV, raising=False)
    monkeypatch.delenv(VERIFYING_KEY_ENV, raising=False)

    # Work on a copy of SIMPLE_JWT to avoid mutating the global settings dict for other tests
    monkeypatch.setattr(
        settings, "SIMPLE_JWT", settings.SIMPLE_JWT.copy(), raising=False
    )
    monkeypatch.setattr(settings, "TESTING", False, raising=False)

    # Avoid dependency on the cryptography package
    monkeypatch.setattr(ApiConfig, "_generate_jwt_keys", staticmethod(_stub_keys))

    config = ApiConfig("api", api_apps_module)

    # Act
    config._ensure_crypto_keys()

    # Assert: files created with expected content
    priv_path = Path(tmp_path) / PRIVATE_KEY_FILE
    pub_path = Path(tmp_path) / PUBLIC_KEY_FILE
    assert priv_path.is_file()
    assert pub_path.is_file()
    assert priv_path.read_text() == _stub_keys()[0]
    assert pub_path.read_text() == _stub_keys()[1]

    # Env vars and Django settings updated
    assert os.environ[SIGNING_KEY_ENV] == _stub_keys()[0]
    assert os.environ[VERIFYING_KEY_ENV] == _stub_keys()[1]
    assert settings.SIMPLE_JWT["SIGNING_KEY"] == _stub_keys()[0]
    assert settings.SIMPLE_JWT["VERIFYING_KEY"] == _stub_keys()[1]


def test_ensure_crypto_keys_are_idempotent_within_process(monkeypatch, tmp_path):
    # Arrange
    monkeypatch.setattr(
        api_apps_module, "KEYS_DIRECTORY", Path(tmp_path), raising=False
    )
    monkeypatch.delenv(SIGNING_KEY_ENV, raising=False)
    monkeypatch.delenv(VERIFYING_KEY_ENV, raising=False)
    monkeypatch.setattr(
        settings, "SIMPLE_JWT", settings.SIMPLE_JWT.copy(), raising=False
    )
    monkeypatch.setattr(settings, "TESTING", False, raising=False)

    mock_generate = MagicMock(side_effect=_stub_keys)
    monkeypatch.setattr(ApiConfig, "_generate_jwt_keys", staticmethod(mock_generate))

    config = ApiConfig("api", api_apps_module)

    # Act: first call should generate, second should be a no-op (guard flag)
    config._ensure_crypto_keys()
    config._ensure_crypto_keys()

    # Assert: generation occurred exactly once
    assert mock_generate.call_count == 1


def test_ensure_jwt_keys_uses_existing_files(monkeypatch, tmp_path):
    # Arrange: pre-create key files
    monkeypatch.setattr(
        api_apps_module, "KEYS_DIRECTORY", Path(tmp_path), raising=False
    )
    monkeypatch.setattr(
        settings, "SIMPLE_JWT", settings.SIMPLE_JWT.copy(), raising=False
    )

    existing_private, existing_public = _stub_keys()

    (Path(tmp_path) / PRIVATE_KEY_FILE).write_text(existing_private)
    (Path(tmp_path) / PUBLIC_KEY_FILE).write_text(existing_public)

    # If generation were called, fail the test
    def _fail_generate():
        raise AssertionError("_generate_jwt_keys should not be called when files exist")

    monkeypatch.setattr(ApiConfig, "_generate_jwt_keys", staticmethod(_fail_generate))

    config = ApiConfig("api", api_apps_module)

    # Act: call the lower-level method directly to set env/settings from files
    config._ensure_jwt_keys()

    # Assert
    # _read_key_file() strips trailing newlines; environment/settings should reflect stripped content
    assert os.environ[SIGNING_KEY_ENV] == existing_private.strip()
    assert os.environ[VERIFYING_KEY_ENV] == existing_public.strip()
    assert settings.SIMPLE_JWT["SIGNING_KEY"] == existing_private.strip()
    assert settings.SIMPLE_JWT["VERIFYING_KEY"] == existing_public.strip()


def test_ensure_crypto_keys_skips_when_env_vars(monkeypatch, tmp_path):
    # Arrange: put values in env so the orchestrator doesn't generate
    monkeypatch.setattr(
        api_apps_module, "KEYS_DIRECTORY", Path(tmp_path), raising=False
    )
    monkeypatch.setenv(SIGNING_KEY_ENV, "ENV-PRIVATE")
    monkeypatch.setenv(VERIFYING_KEY_ENV, "ENV-PUBLIC")
    monkeypatch.setattr(
        settings, "SIMPLE_JWT", settings.SIMPLE_JWT.copy(), raising=False
    )
    monkeypatch.setattr(settings, "TESTING", False, raising=False)

    called = {"ensure": False}

    def _track_call():
        called["ensure"] = True
        return _stub_keys()

    monkeypatch.setattr(ApiConfig, "_generate_jwt_keys", staticmethod(_track_call))

    config = ApiConfig("api", api_apps_module)

    # Act
    config._ensure_crypto_keys()

    # Assert: orchestrator did not trigger generation when env present
    assert called["ensure"] is False
```

--------------------------------------------------------------------------------

---[FILE: test_authentication.py]---
Location: prowler-master/api/src/backend/api/tests/test_authentication.py
Signals: Django

```python
import time
from datetime import datetime, timedelta, timezone
from unittest.mock import patch
from uuid import uuid4

import pytest
from django.test import RequestFactory
from rest_framework.exceptions import AuthenticationFailed

from api.authentication import TenantAPIKeyAuthentication
from api.db_router import MainRouter
from api.models import TenantAPIKey


@pytest.mark.django_db
class TestTenantAPIKeyAuthentication:
    @pytest.fixture
    def auth_backend(self):
        """Create an instance of TenantAPIKeyAuthentication."""
        return TenantAPIKeyAuthentication()

    @pytest.fixture
    def request_factory(self):
        """Create a Django request factory."""
        return RequestFactory()

    def test_authenticate_credentials_uses_admin_database(
        self, auth_backend, api_keys_fixture, request_factory
    ):
        """Test that _authenticate_credentials routes queries to admin database."""
        api_key = api_keys_fixture[0]
        raw_key = api_key._raw_key

        # Extract the encrypted key part (after the prefix and separator)
        _, encrypted_key = raw_key.split(TenantAPIKey.objects.separator, 1)

        # Create a mock request
        request = request_factory.get("/")

        # Call the method
        entity, auth_dict = auth_backend._authenticate_credentials(
            request, encrypted_key
        )

        # Verify that the entity is the user associated with the API key
        assert entity == api_key.entity
        assert entity.id == api_key.entity.id

    def test_authenticate_credentials_restores_manager_on_success(
        self, auth_backend, api_keys_fixture, request_factory
    ):
        """Test that the manager is restored after successful authentication."""
        api_key = api_keys_fixture[0]
        raw_key = api_key._raw_key
        _, encrypted_key = raw_key.split(TenantAPIKey.objects.separator, 1)

        # Store the original manager
        original_manager = TenantAPIKey.objects

        request = request_factory.get("/")

        # Call the method
        auth_backend._authenticate_credentials(request, encrypted_key)

        # Verify the manager was restored
        assert TenantAPIKey.objects == original_manager

    def test_authenticate_credentials_restores_manager_on_exception(
        self, auth_backend, request_factory
    ):
        """Test that the manager is restored even when an exception occurs."""
        # Store the original manager
        original_manager = TenantAPIKey.objects

        request = request_factory.get("/")

        # Try to authenticate with an invalid key that will raise an exception
        with pytest.raises(Exception):
            auth_backend._authenticate_credentials(request, "invalid_encrypted_key")

        # Verify the manager was restored despite the exception
        assert TenantAPIKey.objects == original_manager

    def test_authenticate_valid_api_key(
        self, auth_backend, api_keys_fixture, request_factory
    ):
        """Test successful authentication with a valid API key."""
        api_key = api_keys_fixture[0]
        raw_key = api_key._raw_key

        # Create a request with the API key in the Authorization header
        request = request_factory.get("/")
        request.META["HTTP_AUTHORIZATION"] = f"Api-Key {raw_key}"

        # Authenticate
        entity, auth_dict = auth_backend.authenticate(request)

        # Verify the entity and auth dict
        assert entity == api_key.entity
        assert auth_dict["tenant_id"] == str(api_key.tenant_id)
        assert auth_dict["sub"] == str(api_key.entity.id)
        assert auth_dict["api_key_prefix"] == api_key.prefix

        # Verify that last_used_at was updated
        api_key.refresh_from_db()
        assert api_key.last_used_at is not None
        assert (datetime.now(timezone.utc) - api_key.last_used_at).seconds < 5

    def test_authenticate_valid_api_key_uses_admin_database(
        self, auth_backend, api_keys_fixture, request_factory
    ):
        """Test that authenticate uses admin database for API key lookup."""
        api_key = api_keys_fixture[0]
        raw_key = api_key._raw_key

        request = request_factory.get("/")
        request.META["HTTP_AUTHORIZATION"] = f"Api-Key {raw_key}"

        # Mock the manager's using method to verify it's called with admin_db
        with patch.object(
            TenantAPIKey.objects, "using", wraps=TenantAPIKey.objects.using
        ) as mock_using:
            auth_backend.authenticate(request)

            # Verify that .using('admin') was called
            mock_using.assert_called_with(MainRouter.admin_db)

    def test_authenticate_invalid_key_format_missing_separator(
        self, auth_backend, request_factory
    ):
        """Test authentication fails with invalid API key format (no separator)."""
        request = request_factory.get("/")
        request.META["HTTP_AUTHORIZATION"] = "Api-Key invalid_key_no_separator"

        with pytest.raises(AuthenticationFailed) as exc_info:
            auth_backend.authenticate(request)

        assert str(exc_info.value.detail) == "Invalid API Key."

    def test_authenticate_invalid_key_format_empty_prefix(
        self, auth_backend, request_factory
    ):
        """Test authentication fails with empty prefix."""
        request = request_factory.get("/")
        request.META["HTTP_AUTHORIZATION"] = "Api-Key .encrypted_part"

        with pytest.raises(AuthenticationFailed) as exc_info:
            auth_backend.authenticate(request)

        assert str(exc_info.value.detail) == "Invalid API Key."

    def test_authenticate_invalid_encrypted_key(
        self, auth_backend, api_keys_fixture, request_factory
    ):
        """Test authentication fails with invalid encrypted key."""
        api_key = api_keys_fixture[0]

        # Create an invalid key with valid prefix but invalid encryption
        invalid_key = f"{api_key.prefix}.invalid_encrypted_data"

        request = request_factory.get("/")
        request.META["HTTP_AUTHORIZATION"] = f"Api-Key {invalid_key}"

        with pytest.raises(AuthenticationFailed) as exc_info:
            auth_backend.authenticate(request)

        assert str(exc_info.value.detail) == "Invalid API Key."

    def test_authenticate_revoked_api_key(
        self, auth_backend, api_keys_fixture, request_factory
    ):
        """Test authentication fails with a revoked API key."""
        # Use the revoked API key (index 2 from fixture)
        api_key = api_keys_fixture[2]
        raw_key = api_key._raw_key

        request = request_factory.get("/")
        request.META["HTTP_AUTHORIZATION"] = f"Api-Key {raw_key}"

        # The revoked key should fail during credential validation
        with pytest.raises(AuthenticationFailed) as exc_info:
            auth_backend.authenticate(request)

        assert str(exc_info.value.detail) == "This API Key has been revoked."

    def test_authenticate_expired_api_key(
        self, auth_backend, create_test_user, tenants_fixture, request_factory
    ):
        """Test authentication fails with an expired API key."""
        tenant = tenants_fixture[0]
        user = create_test_user

        # Create an expired API key
        api_key, raw_key = TenantAPIKey.objects.create_api_key(
            name="Expired API Key",
            tenant_id=tenant.id,
            entity=user,
            expiry_date=datetime.now(timezone.utc) - timedelta(days=1),
        )

        request = request_factory.get("/")
        request.META["HTTP_AUTHORIZATION"] = f"Api-Key {raw_key}"

        with pytest.raises(AuthenticationFailed) as exc_info:
            auth_backend.authenticate(request)

        assert str(exc_info.value.detail) == "API Key has already expired."

    def test_authenticate_nonexistent_api_key(
        self, auth_backend, api_keys_fixture, request_factory
    ):
        """Test authentication fails when API key doesn't exist in database."""
        # Create a valid-looking encrypted key with a non-existent UUID
        api_key = api_keys_fixture[0]
        non_existent_uuid = str(uuid4())

        # Manually create an encrypted key with a non-existent ID
        payload = {
            "_pk": non_existent_uuid,
            "_exp": (datetime.now(timezone.utc) + timedelta(days=30)).timestamp(),
        }
        encrypted_key = auth_backend.key_crypto.generate(payload)
        fake_key = f"{api_key.prefix}.{encrypted_key}"

        request = request_factory.get("/")
        request.META["HTTP_AUTHORIZATION"] = f"Api-Key {fake_key}"

        with pytest.raises(AuthenticationFailed) as exc_info:
            auth_backend.authenticate(request)

        assert str(exc_info.value.detail) == "No entity matching this api key."

    def test_authenticate_updates_last_used_at(
        self, auth_backend, api_keys_fixture, request_factory
    ):
        """Test that last_used_at is updated on successful authentication."""
        api_key = api_keys_fixture[0]
        raw_key = api_key._raw_key

        # Store the original last_used_at
        original_last_used = api_key.last_used_at

        request = request_factory.get("/")
        request.META["HTTP_AUTHORIZATION"] = f"Api-Key {raw_key}"

        # Authenticate
        auth_backend.authenticate(request)

        # Refresh from database
        api_key.refresh_from_db()

        # Verify last_used_at was updated
        assert api_key.last_used_at is not None
        if original_last_used:
            assert api_key.last_used_at > original_last_used

    def test_authenticate_saves_to_admin_database(
        self, auth_backend, api_keys_fixture, request_factory
    ):
        """Test that the API key save operation uses admin database."""
        api_key = api_keys_fixture[0]
        raw_key = api_key._raw_key

        request = request_factory.get("/")
        request.META["HTTP_AUTHORIZATION"] = f"Api-Key {raw_key}"

        # Mock the save method to verify it's called with using='admin'
        with patch.object(TenantAPIKey, "save") as mock_save:
            auth_backend.authenticate(request)

            # Verify save was called with using=admin_db
            mock_save.assert_called_once_with(
                update_fields=["last_used_at"], using=MainRouter.admin_db
            )

    def test_authenticate_returns_correct_auth_dict(
        self, auth_backend, api_keys_fixture, request_factory
    ):
        """Test that the auth dict contains all required fields."""
        api_key = api_keys_fixture[0]
        raw_key = api_key._raw_key

        request = request_factory.get("/")
        request.META["HTTP_AUTHORIZATION"] = f"Api-Key {raw_key}"

        entity, auth_dict = auth_backend.authenticate(request)

        # Verify all required fields are present
        assert "tenant_id" in auth_dict
        assert "sub" in auth_dict
        assert "api_key_prefix" in auth_dict

        # Verify values are correct
        assert auth_dict["tenant_id"] == str(api_key.tenant_id)
        assert auth_dict["sub"] == str(api_key.entity.id)
        assert auth_dict["api_key_prefix"] == api_key.prefix

    def test_authenticate_with_multiple_api_keys_same_tenant(
        self, auth_backend, api_keys_fixture, request_factory
    ):
        """Test that authentication works correctly with multiple API keys for the same tenant."""
        # Test with first API key
        api_key1 = api_keys_fixture[0]
        raw_key1 = api_key1._raw_key

        request1 = request_factory.get("/")
        request1.META["HTTP_AUTHORIZATION"] = f"Api-Key {raw_key1}"

        entity1, auth_dict1 = auth_backend.authenticate(request1)

        assert entity1 == api_key1.entity
        assert auth_dict1["api_key_prefix"] == api_key1.prefix

        # Test with second API key
        api_key2 = api_keys_fixture[1]
        raw_key2 = api_key2._raw_key

        request2 = request_factory.get("/")
        request2.META["HTTP_AUTHORIZATION"] = f"Api-Key {raw_key2}"

        entity2, auth_dict2 = auth_backend.authenticate(request2)

        assert entity2 == api_key2.entity
        assert auth_dict2["api_key_prefix"] == api_key2.prefix

        # Verify they're different keys but same tenant
        assert auth_dict1["api_key_prefix"] != auth_dict2["api_key_prefix"]
        assert auth_dict1["tenant_id"] == auth_dict2["tenant_id"]

    def test_authenticate_with_wrong_prefix_in_db(
        self, auth_backend, api_keys_fixture, request_factory
    ):
        """Test authentication fails when prefix doesn't match database."""
        api_key = api_keys_fixture[0]
        raw_key = api_key._raw_key

        # Extract the encrypted part and combine with wrong prefix
        _, encrypted_part = raw_key.split(TenantAPIKey.objects.separator, 1)
        wrong_key = f"pk_wrong123.{encrypted_part}"

        request = request_factory.get("/")
        request.META["HTTP_AUTHORIZATION"] = f"Api-Key {wrong_key}"

        with pytest.raises(AuthenticationFailed) as exc_info:
            auth_backend.authenticate(request)

        assert str(exc_info.value.detail) == "Invalid API Key."

    def test_authenticate_credentials_exception_handling(
        self, auth_backend, request_factory
    ):
        """Test that exceptions in _authenticate_credentials are properly handled."""
        request = request_factory.get("/")

        # Test with completely invalid data that will cause InvalidToken
        with pytest.raises(Exception):
            auth_backend._authenticate_credentials(request, "completely_invalid")

    def test_authenticate_with_expired_timestamp(
        self, auth_backend, create_test_user, tenants_fixture, request_factory
    ):
        """Test that expired timestamp in encrypted key causes authentication failure."""
        tenant = tenants_fixture[0]
        user = create_test_user

        # Create an API key with a very short expiry
        api_key, raw_key = TenantAPIKey.objects.create_api_key(
            name="Short-lived API Key",
            tenant_id=tenant.id,
            entity=user,
            expiry_date=datetime.now(timezone.utc) + timedelta(seconds=1),
        )

        # Wait for the key to expire
        time.sleep(2)

        request = request_factory.get("/")
        request.META["HTTP_AUTHORIZATION"] = f"Api-Key {raw_key}"

        # Should fail with expired key
        with pytest.raises(AuthenticationFailed) as exc_info:
            auth_backend.authenticate(request)

        assert str(exc_info.value.detail) == "API Key has already expired."
```

--------------------------------------------------------------------------------

---[FILE: test_compliance.py]---
Location: prowler-master/api/src/backend/api/tests/test_compliance.py

```python
from unittest.mock import MagicMock, patch

from api.compliance import (
    generate_compliance_overview_template,
    generate_scan_compliance,
    get_prowler_provider_checks,
    get_prowler_provider_compliance,
    load_prowler_checks,
    load_prowler_compliance,
)
from api.models import Provider


class TestCompliance:
    @patch("api.compliance.CheckMetadata")
    def test_get_prowler_provider_checks(self, mock_check_metadata):
        provider_type = Provider.ProviderChoices.AWS
        mock_check_metadata.get_bulk.return_value = {
            "check1": MagicMock(),
            "check2": MagicMock(),
            "check3": MagicMock(),
        }
        checks = get_prowler_provider_checks(provider_type)
        assert set(checks) == {"check1", "check2", "check3"}
        mock_check_metadata.get_bulk.assert_called_once_with(provider_type)

    @patch("api.compliance.Compliance")
    def test_get_prowler_provider_compliance(self, mock_compliance):
        provider_type = Provider.ProviderChoices.AWS
        mock_compliance.get_bulk.return_value = {
            "compliance1": MagicMock(),
            "compliance2": MagicMock(),
        }
        compliance_data = get_prowler_provider_compliance(provider_type)
        assert compliance_data == mock_compliance.get_bulk.return_value
        mock_compliance.get_bulk.assert_called_once_with(provider_type)

    @patch("api.models.Provider.ProviderChoices")
    @patch("api.compliance.get_prowler_provider_compliance")
    @patch("api.compliance.generate_compliance_overview_template")
    @patch("api.compliance.load_prowler_checks")
    def test_load_prowler_compliance(
        self,
        mock_load_prowler_checks,
        mock_generate_compliance_overview_template,
        mock_get_prowler_provider_compliance,
        mock_provider_choices,
    ):
        mock_provider_choices.values = ["aws", "azure"]

        compliance_data_aws = {"compliance_aws": MagicMock()}
        compliance_data_azure = {"compliance_azure": MagicMock()}

        compliance_data_dict = {
            "aws": compliance_data_aws,
            "azure": compliance_data_azure,
        }

        def mock_get_compliance(provider_type):
            return compliance_data_dict[provider_type]

        mock_get_prowler_provider_compliance.side_effect = mock_get_compliance

        mock_generate_compliance_overview_template.return_value = {
            "template_key": "template_value"
        }

        mock_load_prowler_checks.return_value = {"checks_key": "checks_value"}

        load_prowler_compliance()

        from api.compliance import PROWLER_CHECKS, PROWLER_COMPLIANCE_OVERVIEW_TEMPLATE

        assert PROWLER_COMPLIANCE_OVERVIEW_TEMPLATE == {
            "template_key": "template_value"
        }
        assert PROWLER_CHECKS == {"checks_key": "checks_value"}

        expected_prowler_compliance = compliance_data_dict
        mock_get_prowler_provider_compliance.assert_any_call("aws")
        mock_get_prowler_provider_compliance.assert_any_call("azure")
        mock_generate_compliance_overview_template.assert_called_once_with(
            expected_prowler_compliance
        )
        mock_load_prowler_checks.assert_called_once_with(expected_prowler_compliance)

    @patch("api.compliance.get_prowler_provider_checks")
    @patch("api.models.Provider.ProviderChoices")
    def test_load_prowler_checks(
        self, mock_provider_choices, mock_get_prowler_provider_checks
    ):
        mock_provider_choices.values = ["aws"]

        mock_get_prowler_provider_checks.return_value = ["check1", "check2", "check3"]

        prowler_compliance = {
            "aws": {
                "compliance1": MagicMock(
                    Requirements=[
                        MagicMock(
                            Checks=["check1", "check2"],
                        ),
                    ],
                ),
            },
        }

        expected_checks = {
            "aws": {
                "check1": {"compliance1"},
                "check2": {"compliance1"},
                "check3": set(),
            }
        }

        checks = load_prowler_checks(prowler_compliance)
        assert checks == expected_checks
        mock_get_prowler_provider_checks.assert_called_once_with("aws")

    @patch("api.compliance.PROWLER_CHECKS", new_callable=dict)
    def test_generate_scan_compliance(self, mock_prowler_checks):
        mock_prowler_checks["aws"] = {
            "check1": {"compliance1"},
            "check2": {"compliance1", "compliance2"},
        }

        compliance_overview = {
            "compliance1": {
                "requirements": {
                    "requirement1": {
                        "checks": {"check1": None, "check2": None},
                        "checks_status": {
                            "pass": 0,
                            "fail": 0,
                            "manual": 0,
                            "total": 2,
                        },
                        "status": "PASS",
                    }
                },
                "requirements_status": {"passed": 1, "failed": 0, "manual": 0},
            },
            "compliance2": {
                "requirements": {
                    "requirement2": {
                        "checks": {"check2": None},
                        "checks_status": {
                            "pass": 0,
                            "fail": 0,
                            "manual": 0,
                            "total": 1,
                        },
                        "status": "PASS",
                    }
                },
                "requirements_status": {"passed": 1, "failed": 0, "manual": 0},
            },
        }

        provider_type = "aws"
        check_id = "check2"
        status = "FAIL"

        generate_scan_compliance(compliance_overview, provider_type, check_id, status)

        assert (
            compliance_overview["compliance1"]["requirements"]["requirement1"][
                "checks"
            ]["check2"]
            == "FAIL"
        )
        assert (
            compliance_overview["compliance1"]["requirements"]["requirement1"][
                "checks_status"
            ]["fail"]
            == 1
        )
        assert (
            compliance_overview["compliance1"]["requirements"]["requirement1"]["status"]
            == "FAIL"
        )
        assert compliance_overview["compliance1"]["requirements_status"]["passed"] == 0
        assert compliance_overview["compliance1"]["requirements_status"]["failed"] == 1

        assert (
            compliance_overview["compliance2"]["requirements"]["requirement2"][
                "checks"
            ]["check2"]
            == "FAIL"
        )
        assert (
            compliance_overview["compliance2"]["requirements"]["requirement2"][
                "checks_status"
            ]["fail"]
            == 1
        )
        assert (
            compliance_overview["compliance2"]["requirements"]["requirement2"]["status"]
            == "FAIL"
        )
        assert compliance_overview["compliance2"]["requirements_status"]["passed"] == 0
        assert compliance_overview["compliance2"]["requirements_status"]["failed"] == 1

        assert (
            compliance_overview["compliance1"]["requirements"]["requirement1"][
                "checks"
            ]["check1"]
            is None
        )

    @patch("api.models.Provider.ProviderChoices")
    def test_generate_compliance_overview_template(self, mock_provider_choices):
        mock_provider_choices.values = ["aws"]

        requirement1 = MagicMock(
            Id="requirement1",
            Name="Requirement 1",
            Description="Description of requirement 1",
            Attributes=[],
            Checks=["check1", "check2"],
            Tactics=["tactic1"],
            SubTechniques=["subtechnique1"],
            Platforms=["platform1"],
            TechniqueURL="https://example.com",
        )
        requirement2 = MagicMock(
            Id="requirement2",
            Name="Requirement 2",
            Description="Description of requirement 2",
            Attributes=[],
            Checks=[],
            Tactics=[],
            SubTechniques=[],
            Platforms=[],
            TechniqueURL="",
        )
        compliance1 = MagicMock(
            Requirements=[requirement1, requirement2],
            Framework="Framework 1",
            Version="1.0",
            Description="Description of compliance1",
            Name="Compliance 1",
        )
        prowler_compliance = {"aws": {"compliance1": compliance1}}

        template = generate_compliance_overview_template(prowler_compliance)

        expected_template = {
            "aws": {
                "compliance1": {
                    "framework": "Framework 1",
                    "name": "Compliance 1",
                    "version": "1.0",
                    "provider": "aws",
                    "description": "Description of compliance1",
                    "requirements": {
                        "requirement1": {
                            "name": "Requirement 1",
                            "description": "Description of requirement 1",
                            "tactics": ["tactic1"],
                            "subtechniques": ["subtechnique1"],
                            "platforms": ["platform1"],
                            "technique_url": "https://example.com",
                            "attributes": [],
                            "checks": {"check1": None, "check2": None},
                            "checks_status": {
                                "pass": 0,
                                "fail": 0,
                                "manual": 0,
                                "total": 2,
                            },
                            "status": "PASS",
                        },
                        "requirement2": {
                            "name": "Requirement 2",
                            "description": "Description of requirement 2",
                            "tactics": [],
                            "subtechniques": [],
                            "platforms": [],
                            "technique_url": "",
                            "attributes": [],
                            "checks": {},
                            "checks_status": {
                                "pass": 0,
                                "fail": 0,
                                "manual": 0,
                                "total": 0,
                            },
                            "status": "MANUAL",
                        },
                    },
                    "requirements_status": {
                        "passed": 1,  # total_requirements - manual
                        "failed": 0,
                        "manual": 1,  # requirement2 has 0 checks
                    },
                    "total_requirements": 2,
                }
            }
        }

        assert template == expected_template
```

--------------------------------------------------------------------------------

---[FILE: test_database.py]---
Location: prowler-master/api/src/backend/api/tests/test_database.py
Signals: Django

```python
import pytest
from django.conf import settings
from django.db.migrations.recorder import MigrationRecorder
from django.db.utils import ConnectionRouter

from api.db_router import MainRouter
from api.rls import Tenant
from config.django.base import DATABASE_ROUTERS as PROD_DATABASE_ROUTERS
from unittest.mock import patch


@patch("api.db_router.MainRouter.admin_db", new="admin")
class TestMainDatabaseRouter:
    @pytest.fixture(scope="module")
    def router(self):
        testing_routers = settings.DATABASE_ROUTERS.copy()
        settings.DATABASE_ROUTERS = PROD_DATABASE_ROUTERS
        yield ConnectionRouter()
        settings.DATABASE_ROUTERS = testing_routers

    @pytest.mark.parametrize("api_model", [Tenant])
    def test_router_api_models(self, api_model, router):
        assert router.db_for_read(api_model) == "default"
        assert router.db_for_write(api_model) == "default"

        assert router.allow_migrate_model(MainRouter.admin_db, api_model)
        assert not router.allow_migrate_model("default", api_model)

    def test_router_django_models(self, router):
        assert router.db_for_read(MigrationRecorder.Migration) == MainRouter.admin_db
        assert not router.db_for_read(MigrationRecorder.Migration) == "default"
```

--------------------------------------------------------------------------------

````
