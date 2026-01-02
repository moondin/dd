---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 15
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 15 of 867)

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

---[FILE: manage.py]---
Location: prowler-master/api/src/backend/manage.py
Signals: Django

```python
#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""

import os
import sys
import warnings

# Suppress specific warnings from django-rest-auth: https://github.com/iMerica/dj-rest-auth/issues/684
warnings.filterwarnings(
    "ignore", category=UserWarning, module="dj_rest_auth.registration.serializers"
)


def main():
    """Run administrative tasks."""

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.django.production")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: pytest.ini]---
Location: prowler-master/api/src/backend/pytest.ini

```text
[pytest]
DJANGO_SETTINGS_MODULE = config.django.testing
addopts = -rP
```

--------------------------------------------------------------------------------

---[FILE: adapters.py]---
Location: prowler-master/api/src/backend/api/adapters.py
Signals: Django

```python
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.db import transaction

from api.db_router import MainRouter
from api.db_utils import rls_transaction
from api.models import Membership, Role, Tenant, User, UserRoleRelationship


class ProwlerSocialAccountAdapter(DefaultSocialAccountAdapter):
    @staticmethod
    def get_user_by_email(email: str):
        try:
            return User.objects.get(email=email)
        except User.DoesNotExist:
            return None

    def pre_social_login(self, request, sociallogin):
        # Link existing accounts with the same email address
        email = sociallogin.account.extra_data.get("email")
        if sociallogin.provider.id == "saml":
            email = sociallogin.user.email
        if email:
            existing_user = self.get_user_by_email(email)
            if existing_user:
                sociallogin.connect(request, existing_user)

    def save_user(self, request, sociallogin, form=None):
        """
        Called after the user data is fully populated from the provider
        and is about to be saved to the DB for the first time.
        """
        with transaction.atomic(using=MainRouter.admin_db):
            user = super().save_user(request, sociallogin, form)
            provider = sociallogin.provider.id
            extra = sociallogin.account.extra_data

            if provider != "saml":
                # Handle other providers (e.g., GitHub, Google)
                user.save(using=MainRouter.admin_db)
                social_account_name = extra.get("name")
                if social_account_name:
                    user.name = social_account_name
                    user.save(using=MainRouter.admin_db)

                tenant = Tenant.objects.using(MainRouter.admin_db).create(
                    name=f"{user.email.split('@')[0]} default tenant"
                )
                with rls_transaction(str(tenant.id)):
                    Membership.objects.using(MainRouter.admin_db).create(
                        user=user, tenant=tenant, role=Membership.RoleChoices.OWNER
                    )
                    role = Role.objects.using(MainRouter.admin_db).create(
                        name="admin",
                        tenant_id=tenant.id,
                        manage_users=True,
                        manage_account=True,
                        manage_billing=True,
                        manage_providers=True,
                        manage_integrations=True,
                        manage_scans=True,
                        unlimited_visibility=True,
                    )
                    UserRoleRelationship.objects.using(MainRouter.admin_db).create(
                        user=user,
                        role=role,
                        tenant_id=tenant.id,
                    )
            else:
                request.session["saml_user_created"] = str(user.id)

        return user
```

--------------------------------------------------------------------------------

---[FILE: apps.py]---
Location: prowler-master/api/src/backend/api/apps.py
Signals: Django

```python
import logging
import os
import sys
from pathlib import Path

from config.custom_logging import BackendLogger
from config.env import env
from django.apps import AppConfig
from django.conf import settings

logger = logging.getLogger(BackendLogger.API)

SIGNING_KEY_ENV = "DJANGO_TOKEN_SIGNING_KEY"
VERIFYING_KEY_ENV = "DJANGO_TOKEN_VERIFYING_KEY"

PRIVATE_KEY_FILE = "jwt_private.pem"
PUBLIC_KEY_FILE = "jwt_public.pem"

KEYS_DIRECTORY = (
    Path.home() / ".config" / "prowler-api"
)  # `/home/prowler/.config/prowler-api` inside the container

_keys_initialized = False  # Flag to prevent multiple executions within the same process


class ApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api"

    def ready(self):
        from api import schema_extensions  # noqa: F401
        from api import signals  # noqa: F401
        from api.compliance import load_prowler_compliance

        # Generate required cryptographic keys if not present, but only if:
        #   `"manage.py" not in sys.argv`: If an external server (e.g., Gunicorn) is running the app
        #   `os.environ.get("RUN_MAIN")`: If it's not a Django command or using `runserver`,
        #                                 only the main process will do it
        if "manage.py" not in sys.argv or os.environ.get("RUN_MAIN"):
            self._ensure_crypto_keys()

        load_prowler_compliance()

    def _ensure_crypto_keys(self):
        """
        Orchestrator method that ensures all required cryptographic keys are present.
        This method coordinates the generation of:
          - RSA key pairs for JWT token signing and verification
        Note: During development, Django spawns multiple processes (migrations, fixtures, etc.)
        which will each generate their own keys. This is expected behavior and each process
        will have consistent keys for its lifetime. In production, set the keys as environment
        variables to avoid regeneration.
        """
        global _keys_initialized

        # Skip key generation if running tests
        if hasattr(settings, "TESTING") and settings.TESTING:
            return

        # Skip if already initialized in this process
        if _keys_initialized:
            return

        # Check if both JWT keys are set; if not, generate them
        signing_key = env.str(SIGNING_KEY_ENV, default="").strip()
        verifying_key = env.str(VERIFYING_KEY_ENV, default="").strip()

        if not signing_key or not verifying_key:
            logger.info(
                f"Generating JWT RSA key pair. In production, set '{SIGNING_KEY_ENV}' and '{VERIFYING_KEY_ENV}' "
                "environment variables."
            )
            self._ensure_jwt_keys()

        # Mark as initialized to prevent future executions in this process
        _keys_initialized = True

    def _read_key_file(self, file_name):
        """
        Utility method to read the contents of a file.
        """
        file_path = KEYS_DIRECTORY / file_name
        return file_path.read_text().strip() if file_path.is_file() else None

    def _write_key_file(self, file_name, content, private=True):
        """
        Utility method to write content to a file.
        """
        try:
            file_path = KEYS_DIRECTORY / file_name
            file_path.parent.mkdir(parents=True, exist_ok=True)
            file_path.write_text(content)
            file_path.chmod(0o600 if private else 0o644)

        except Exception as e:
            logger.error(
                f"Error writing key file '{file_name}': {e}. "
                f"Please set '{SIGNING_KEY_ENV}' and '{VERIFYING_KEY_ENV}' manually."
            )
            raise e

    def _ensure_jwt_keys(self):
        """
        Generate RSA key pairs for JWT token signing and verification
        if they are not already set in environment variables.
        """
        # Read existing keys from files if they exist
        signing_key = self._read_key_file(PRIVATE_KEY_FILE)
        verifying_key = self._read_key_file(PUBLIC_KEY_FILE)

        if not signing_key or not verifying_key:
            # Generate and store the RSA key pair
            signing_key, verifying_key = self._generate_jwt_keys()
            self._write_key_file(PRIVATE_KEY_FILE, signing_key, private=True)
            self._write_key_file(PUBLIC_KEY_FILE, verifying_key, private=False)
            logger.info("JWT keys generated and stored successfully")

        else:
            logger.info("JWT keys already generated")

        # Set environment variables and Django settings
        os.environ[SIGNING_KEY_ENV] = signing_key
        settings.SIMPLE_JWT["SIGNING_KEY"] = signing_key

        os.environ[VERIFYING_KEY_ENV] = verifying_key
        settings.SIMPLE_JWT["VERIFYING_KEY"] = verifying_key

    def _generate_jwt_keys(self):
        """
        Generate and set RSA key pairs for JWT token operations.
        """
        try:
            from cryptography.hazmat.primitives import serialization
            from cryptography.hazmat.primitives.asymmetric import rsa

            # Generate RSA key pair
            private_key = rsa.generate_private_key(  # Future improvement: we could read the next values from env vars
                public_exponent=65537,
                key_size=2048,
            )

            # Serialize private key (for signing)
            private_pem = private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption(),
            ).decode("utf-8")

            # Serialize public key (for verification)
            public_key = private_key.public_key()
            public_pem = public_key.public_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PublicFormat.SubjectPublicKeyInfo,
            ).decode("utf-8")

            logger.debug("JWT RSA key pair generated successfully.")
            return private_pem, public_pem

        except ImportError as e:
            logger.warning(
                "The 'cryptography' package is required for automatic JWT key generation."
            )
            raise e

        except Exception as e:
            logger.error(
                f"Error generating JWT keys: {e}. Please set '{SIGNING_KEY_ENV}' and '{VERIFYING_KEY_ENV}' manually."
            )
            raise e
```

--------------------------------------------------------------------------------

---[FILE: authentication.py]---
Location: prowler-master/api/src/backend/api/authentication.py
Signals: Django

```python
from typing import Optional, Tuple
from uuid import UUID

from cryptography.fernet import InvalidToken
from django.utils import timezone
from drf_simple_apikey.backends import APIKeyAuthentication as BaseAPIKeyAuth
from drf_simple_apikey.crypto import get_crypto
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.request import Request
from rest_framework_simplejwt.authentication import JWTAuthentication

from api.db_router import MainRouter
from api.models import TenantAPIKey, TenantAPIKeyManager


class TenantAPIKeyAuthentication(BaseAPIKeyAuth):
    model = TenantAPIKey

    def __init__(self):
        self.key_crypto = get_crypto()

    def _authenticate_credentials(self, request, key):
        """
        Override to use admin connection, bypassing RLS during authentication.
        Delegates to parent after temporarily routing model queries to admin DB.
        """
        # Temporarily point the model's manager to admin database
        original_objects = self.model.objects
        self.model.objects = self.model.objects.using(MainRouter.admin_db)

        try:
            # Call parent method which will now use admin database
            return super()._authenticate_credentials(request, key)
        finally:
            # Restore original manager
            self.model.objects = original_objects

    def authenticate(self, request: Request):
        prefixed_key = self.get_key(request)

        # Split prefix from key (format: pk_xxxxxxxx.encrypted_key)
        try:
            prefix, key = prefixed_key.split(TenantAPIKeyManager.separator, 1)
        except ValueError:
            raise AuthenticationFailed("Invalid API Key.")

        try:
            entity, _ = self._authenticate_credentials(request, key)
        except InvalidToken:
            raise AuthenticationFailed("Invalid API Key.")

        # Get the API key instance to update last_used_at and retrieve tenant info
        # We need to decrypt again to get the pk (already validated by _authenticate_credentials)
        payload = self.key_crypto.decrypt(key)
        api_key_pk = payload["_pk"]

        # Convert string UUID back to UUID object for lookup
        if isinstance(api_key_pk, str):
            api_key_pk = UUID(api_key_pk)

        try:
            api_key_instance = TenantAPIKey.objects.using(MainRouter.admin_db).get(
                id=api_key_pk, prefix=prefix
            )
        except TenantAPIKey.DoesNotExist:
            raise AuthenticationFailed("Invalid API Key.")

        # Update last_used_at
        api_key_instance.last_used_at = timezone.now()
        api_key_instance.save(update_fields=["last_used_at"], using=MainRouter.admin_db)

        return entity, {
            "tenant_id": str(api_key_instance.tenant_id),
            "sub": str(api_key_instance.entity.id),
            "api_key_prefix": prefix,
        }


class CombinedJWTOrAPIKeyAuthentication(BaseAuthentication):
    jwt_auth = JWTAuthentication()
    api_key_auth = TenantAPIKeyAuthentication()

    def authenticate(self, request: Request) -> Optional[Tuple[object, dict]]:
        auth_header = request.headers.get("Authorization", "")

        # Prioritize JWT authentication if both are present
        if auth_header.startswith("Bearer "):
            return self.jwt_auth.authenticate(request)

        if auth_header.startswith("Api-Key "):
            return self.api_key_auth.authenticate(request)

        # Default fallback
        return self.jwt_auth.authenticate(request)
```

--------------------------------------------------------------------------------

---[FILE: base_views.py]---
Location: prowler-master/api/src/backend/api/base_views.py
Signals: Django

```python
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from rest_framework import permissions
from rest_framework.exceptions import NotAuthenticated
from rest_framework.filters import SearchFilter
from rest_framework.permissions import SAFE_METHODS
from rest_framework_json_api import filters
from rest_framework_json_api.views import ModelViewSet

from api.authentication import CombinedJWTOrAPIKeyAuthentication
from api.db_router import MainRouter, reset_read_db_alias, set_read_db_alias
from api.db_utils import POSTGRES_USER_VAR, rls_transaction
from api.filters import CustomDjangoFilterBackend
from api.models import Role, Tenant
from api.rbac.permissions import HasPermissions


class BaseViewSet(ModelViewSet):
    authentication_classes = [CombinedJWTOrAPIKeyAuthentication]
    required_permissions = []
    permission_classes = [permissions.IsAuthenticated, HasPermissions]
    filter_backends = [
        filters.QueryParameterValidationFilter,
        filters.OrderingFilter,
        CustomDjangoFilterBackend,
        SearchFilter,
    ]

    filterset_fields = []
    search_fields = []

    ordering_fields = "__all__"
    ordering = ["id"]

    def _get_request_db_alias(self, request):
        if request is None:
            return MainRouter.default_db

        read_alias = (
            MainRouter.replica_db
            if request.method in SAFE_METHODS
            and MainRouter.replica_db in settings.DATABASES
            else None
        )
        if read_alias:
            return read_alias
        return MainRouter.default_db

    def initial(self, request, *args, **kwargs):
        """
        Sets required_permissions before permissions are checked.
        """
        self.set_required_permissions()
        super().initial(request, *args, **kwargs)

    def set_required_permissions(self):
        """This is an abstract method that must be implemented by subclasses."""
        NotImplemented

    def get_queryset(self):
        raise NotImplementedError


class BaseRLSViewSet(BaseViewSet):
    def dispatch(self, request, *args, **kwargs):
        self.db_alias = self._get_request_db_alias(request)
        alias_token = None
        try:
            if self.db_alias != MainRouter.default_db:
                alias_token = set_read_db_alias(self.db_alias)

            if request is not None:
                request.db_alias = self.db_alias

            with transaction.atomic(using=self.db_alias):
                return super().dispatch(request, *args, **kwargs)
        finally:
            if alias_token is not None:
                reset_read_db_alias(alias_token)
            self.db_alias = MainRouter.default_db

    def initial(self, request, *args, **kwargs):
        # Ideally, this logic would be in the `.setup()` method but DRF view sets don't call it
        # https://docs.djangoproject.com/en/5.1/ref/class-based-views/base/#django.views.generic.base.View.setup
        if request.auth is None:
            raise NotAuthenticated

        tenant_id = request.auth.get("tenant_id")
        if tenant_id is None:
            raise NotAuthenticated("Tenant ID is not present in token")

        with rls_transaction(
            tenant_id, using=getattr(self, "db_alias", MainRouter.default_db)
        ):
            self.request.tenant_id = tenant_id
            return super().initial(request, *args, **kwargs)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["tenant_id"] = self.request.tenant_id
        return context


class BaseTenantViewset(BaseViewSet):
    def dispatch(self, request, *args, **kwargs):
        self.db_alias = self._get_request_db_alias(request)
        alias_token = None
        try:
            if self.db_alias != MainRouter.default_db:
                alias_token = set_read_db_alias(self.db_alias)

            if request is not None:
                request.db_alias = self.db_alias

            with transaction.atomic(using=self.db_alias):
                tenant = super().dispatch(request, *args, **kwargs)

            try:
                # If the request is a POST, create the admin role
                if request.method == "POST":
                    isinstance(tenant, dict) and self._create_admin_role(
                        tenant.data["id"]
                    )
            except Exception as e:
                self._handle_creation_error(e, tenant)
                raise

            return tenant
        finally:
            if alias_token is not None:
                reset_read_db_alias(alias_token)
            self.db_alias = MainRouter.default_db

    def _create_admin_role(self, tenant_id):
        Role.objects.using(MainRouter.admin_db).create(
            name="admin",
            tenant_id=tenant_id,
            manage_users=True,
            manage_account=True,
            manage_billing=True,
            manage_providers=True,
            manage_integrations=True,
            manage_scans=True,
            unlimited_visibility=True,
        )

    def _handle_creation_error(self, error, tenant):
        if tenant.data.get("id"):
            try:
                Tenant.objects.using(MainRouter.admin_db).filter(
                    id=tenant.data["id"]
                ).delete()
            except ObjectDoesNotExist:
                pass  # Tenant might not exist, handle gracefully

    def initial(self, request, *args, **kwargs):
        if request.auth is None:
            raise NotAuthenticated

        tenant_id = request.auth.get("tenant_id")
        if tenant_id is None:
            raise NotAuthenticated("Tenant ID is not present in token")

        user_id = str(request.user.id)
        with rls_transaction(
            value=user_id,
            parameter=POSTGRES_USER_VAR,
            using=getattr(self, "db_alias", MainRouter.default_db),
        ):
            return super().initial(request, *args, **kwargs)


class BaseUserViewset(BaseViewSet):
    def dispatch(self, request, *args, **kwargs):
        self.db_alias = self._get_request_db_alias(request)
        alias_token = None
        try:
            if self.db_alias != MainRouter.default_db:
                alias_token = set_read_db_alias(self.db_alias)

            if request is not None:
                request.db_alias = self.db_alias

            with transaction.atomic(using=self.db_alias):
                return super().dispatch(request, *args, **kwargs)
        finally:
            if alias_token is not None:
                reset_read_db_alias(alias_token)
            self.db_alias = MainRouter.default_db

    def initial(self, request, *args, **kwargs):
        # TODO refactor after improving RLS on users
        if request.stream is not None and request.stream.method == "POST":
            return super().initial(request, *args, **kwargs)
        if request.auth is None:
            raise NotAuthenticated

        tenant_id = request.auth.get("tenant_id")
        if tenant_id is None:
            raise NotAuthenticated("Tenant ID is not present in token")

        with rls_transaction(
            tenant_id, using=getattr(self, "db_alias", MainRouter.default_db)
        ):
            self.request.tenant_id = tenant_id
            return super().initial(request, *args, **kwargs)
```

--------------------------------------------------------------------------------

---[FILE: compliance.py]---
Location: prowler-master/api/src/backend/api/compliance.py

```python
from types import MappingProxyType

from api.models import Provider
from prowler.config.config import get_available_compliance_frameworks
from prowler.lib.check.compliance_models import Compliance
from prowler.lib.check.models import CheckMetadata

PROWLER_COMPLIANCE_OVERVIEW_TEMPLATE = {}
PROWLER_CHECKS = {}
AVAILABLE_COMPLIANCE_FRAMEWORKS = {}


def get_compliance_frameworks(provider_type: Provider.ProviderChoices) -> list[str]:
    """
    Retrieve and cache the list of available compliance frameworks for a specific cloud provider.

    This function lazily loads and caches the available compliance frameworks (e.g., CIS, MITRE, ISO)
    for each provider type (AWS, Azure, GCP, etc.) on first access. Subsequent calls for the same
    provider will return the cached result.

    Args:
        provider_type (Provider.ProviderChoices): The cloud provider type for which to retrieve
            available compliance frameworks (e.g., "aws", "azure", "gcp", "m365").

    Returns:
        list[str]: A list of framework identifiers (e.g., "cis_1.4_aws", "mitre_attack_azure") available
        for the given provider.
    """
    global AVAILABLE_COMPLIANCE_FRAMEWORKS
    if provider_type not in AVAILABLE_COMPLIANCE_FRAMEWORKS:
        AVAILABLE_COMPLIANCE_FRAMEWORKS[provider_type] = (
            get_available_compliance_frameworks(provider_type)
        )

    return AVAILABLE_COMPLIANCE_FRAMEWORKS[provider_type]


def get_prowler_provider_checks(provider_type: Provider.ProviderChoices):
    """
    Retrieve all check IDs for the specified provider type.

    This function fetches the check metadata for the given cloud provider
    and returns an iterable of check IDs.

    Args:
        provider_type (Provider.ProviderChoices): The provider type
            (e.g., 'aws', 'azure') for which to retrieve check IDs.

    Returns:
        Iterable[str]: An iterable of check IDs associated with the specified provider type.
    """
    return CheckMetadata.get_bulk(provider_type).keys()


def get_prowler_provider_compliance(provider_type: Provider.ProviderChoices) -> dict:
    """
    Retrieve the Prowler compliance data for a specified provider type.

    This function fetches the compliance frameworks and their associated
    requirements for the given cloud provider.

    Args:
        provider_type (Provider.ProviderChoices): The provider type
            (e.g., 'aws', 'azure') for which to retrieve compliance data.

    Returns:
        dict: A dictionary mapping compliance framework names to their respective
            Compliance objects for the specified provider.
    """
    return Compliance.get_bulk(provider_type)


def load_prowler_compliance():
    """
    Load and initialize the Prowler compliance data and checks for all provider types.

    This function retrieves compliance data for all supported provider types,
    generates a compliance overview template, and populates the global variables
    `PROWLER_COMPLIANCE_OVERVIEW_TEMPLATE` and `PROWLER_CHECKS` with read-only mappings
    of the compliance templates and checks, respectively.
    """
    global PROWLER_COMPLIANCE_OVERVIEW_TEMPLATE
    global PROWLER_CHECKS

    prowler_compliance = {
        provider_type: get_prowler_provider_compliance(provider_type)
        for provider_type in Provider.ProviderChoices.values
    }
    template = generate_compliance_overview_template(prowler_compliance)
    PROWLER_COMPLIANCE_OVERVIEW_TEMPLATE = MappingProxyType(template)
    PROWLER_CHECKS = MappingProxyType(load_prowler_checks(prowler_compliance))


def load_prowler_checks(prowler_compliance):
    """
    Generate a mapping of checks to the compliance frameworks that include them.

    This function processes the provided compliance data and creates a dictionary
    mapping each provider type to a dictionary where each check ID maps to a set
    of compliance names that include that check.

    Args:
        prowler_compliance (dict): The compliance data for all provider types,
            as returned by `get_prowler_provider_compliance`.

    Returns:
        dict: A nested dictionary where the first-level keys are provider types,
            and the values are dictionaries mapping check IDs to sets of compliance names.
    """
    checks = {}
    for provider_type in Provider.ProviderChoices.values:
        checks[provider_type] = {
            check_id: set() for check_id in get_prowler_provider_checks(provider_type)
        }
        for compliance_name, compliance_data in prowler_compliance[
            provider_type
        ].items():
            for requirement in compliance_data.Requirements:
                for check in requirement.Checks:
                    try:
                        checks[provider_type][check].add(compliance_name)
                    except KeyError:
                        continue
    return checks


def generate_scan_compliance(
    compliance_overview, provider_type: str, check_id: str, status: str
):
    """
    Update the compliance overview with the status of a specific check.

    This function updates the compliance overview by setting the status of the given check
    within all compliance frameworks and requirements that include it. It then updates the
    requirement status to 'FAIL' if any of its checks have failed, and adjusts the counts
    of passed and failed requirements in the compliance overview.

    Args:
        compliance_overview (dict): The compliance overview data structure to update.
        provider_type (str): The provider type (e.g., 'aws', 'azure') associated with the check.
        check_id (str): The identifier of the check whose status is being updated.
        status (str): The status of the check (e.g., 'PASS', 'FAIL', 'MUTED').

    Returns:
        None: This function modifies the compliance_overview in place.
    """

    for compliance_id in PROWLER_CHECKS[provider_type][check_id]:
        for requirement in compliance_overview[compliance_id]["requirements"].values():
            if check_id in requirement["checks"]:
                requirement["checks"][check_id] = status
                requirement["checks_status"][status.lower()] += 1

                if requirement["status"] != "FAIL" and any(
                    value == "FAIL" for value in requirement["checks"].values()
                ):
                    requirement["status"] = "FAIL"
                    compliance_overview[compliance_id]["requirements_status"][
                        "passed"
                    ] -= 1
                    compliance_overview[compliance_id]["requirements_status"][
                        "failed"
                    ] += 1


def generate_compliance_overview_template(prowler_compliance: dict):
    """
    Generate a compliance overview template for all provider types.

    This function creates a nested dictionary structure representing the compliance
    overview template for each provider type, compliance framework, and requirement.
    It initializes the status of all checks and requirements, and calculates initial
    counts for requirements status.

    Args:
        prowler_compliance (dict): The compliance data for all provider types,
            as returned by `get_prowler_provider_compliance`.

    Returns:
        dict: A nested dictionary representing the compliance overview template,
            structured by provider type and compliance framework.
    """
    template = {}
    for provider_type in Provider.ProviderChoices.values:
        provider_compliance = template.setdefault(provider_type, {})
        compliance_data_dict = prowler_compliance[provider_type]

        for compliance_name, compliance_data in compliance_data_dict.items():
            compliance_requirements = {}
            requirements_status = {"passed": 0, "failed": 0, "manual": 0}
            total_requirements = 0

            for requirement in compliance_data.Requirements:
                total_requirements += 1
                total_checks = len(requirement.Checks)
                checks_dict = {check: None for check in requirement.Checks}

                req_status_val = "MANUAL" if total_checks == 0 else "PASS"

                # Build requirement dictionary
                requirement_dict = {
                    "name": requirement.Name or requirement.Id,
                    "description": requirement.Description,
                    "tactics": getattr(requirement, "Tactics", []),
                    "subtechniques": getattr(requirement, "SubTechniques", []),
                    "platforms": getattr(requirement, "Platforms", []),
                    "technique_url": getattr(requirement, "TechniqueURL", ""),
                    "attributes": [
                        dict(attribute) for attribute in requirement.Attributes
                    ],
                    "checks": checks_dict,
                    "checks_status": {
                        "pass": 0,
                        "fail": 0,
                        "manual": 0,
                        "total": total_checks,
                    },
                    "status": req_status_val,
                }

                # Update requirements status counts for the framework
                if req_status_val == "MANUAL":
                    requirements_status["manual"] += 1
                elif req_status_val == "PASS":
                    requirements_status["passed"] += 1

                # Add requirement to compliance requirements
                compliance_requirements[requirement.Id] = requirement_dict

            # Build compliance dictionary
            compliance_dict = {
                "framework": compliance_data.Framework,
                "name": compliance_data.Name,
                "version": compliance_data.Version,
                "provider": provider_type,
                "description": compliance_data.Description,
                "requirements": compliance_requirements,
                "requirements_status": requirements_status,
                "total_requirements": total_requirements,
            }

            # Add compliance to provider compliance
            provider_compliance[compliance_name] = compliance_dict

    return template
```

--------------------------------------------------------------------------------

---[FILE: db_router.py]---
Location: prowler-master/api/src/backend/api/db_router.py
Signals: Django

```python
from contextvars import ContextVar

from django.conf import settings

ALLOWED_APPS = ("django", "socialaccount", "account", "authtoken", "silk")

_read_db_alias = ContextVar("read_db_alias", default=None)


def set_read_db_alias(alias: str | None):
    if not alias:
        return None
    return _read_db_alias.set(alias)


def get_read_db_alias() -> str | None:
    return _read_db_alias.get()


def reset_read_db_alias(token) -> None:
    if token is not None:
        _read_db_alias.reset(token)


class MainRouter:
    default_db = "default"
    admin_db = "admin"
    replica_db = "replica"
    admin_replica_db = "admin_replica"

    def db_for_read(self, model, **hints):  # noqa: F841
        model_table_name = model._meta.db_table
        if model_table_name.startswith("django_") or any(
            model_table_name.startswith(f"{app}_") for app in ALLOWED_APPS
        ):
            return self.admin_db
        read_alias = get_read_db_alias()
        if read_alias:
            return read_alias
        return None

    def db_for_write(self, model, **hints):  # noqa: F841
        model_table_name = model._meta.db_table
        if any(model_table_name.startswith(f"{app}_") for app in ALLOWED_APPS):
            return self.admin_db
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):  # noqa: F841
        return db == self.admin_db

    def allow_relation(self, obj1, obj2, **hints):  # noqa: F841
        # Allow relations when both objects originate from allowed connectors
        allowed_dbs = {
            self.default_db,
            self.admin_db,
            self.replica_db,
            self.admin_replica_db,
        }
        if {obj1._state.db, obj2._state.db} <= allowed_dbs:
            return True
        return None


READ_REPLICA_ALIAS = (
    MainRouter.replica_db if MainRouter.replica_db in settings.DATABASES else None
)
```

--------------------------------------------------------------------------------

````
