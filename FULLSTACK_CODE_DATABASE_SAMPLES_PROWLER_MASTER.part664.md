---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 664
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 664 of 867)

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

---[FILE: entra_policy_user_consent_for_verified_apps_test.py]---
Location: prowler-master/tests/providers/azure/services/entra/entra_policy_user_consent_for_verified_apps/entra_policy_user_consent_for_verified_apps_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import DOMAIN, set_mocked_azure_provider


class Test_entra_policy_user_consent_for_verified_apps:
    def test_entra_no_subscriptions(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_policy_user_consent_for_verified_apps.entra_policy_user_consent_for_verified_apps.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_user_consent_for_verified_apps.entra_policy_user_consent_for_verified_apps import (
                entra_policy_user_consent_for_verified_apps,
            )

            entra_client.authorization_policy = {}

            check = entra_policy_user_consent_for_verified_apps()
            result = check.execute()
            assert len(result) == 0

    def test_entra_tenant_no_consent(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_policy_user_consent_for_verified_apps.entra_policy_user_consent_for_verified_apps.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_user_consent_for_verified_apps.entra_policy_user_consent_for_verified_apps import (
                entra_policy_user_consent_for_verified_apps,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                AuthorizationPolicy,
                DefaultUserRolePermissions,
            )

            auth_policy = AuthorizationPolicy(
                id=str(uuid4()),
                name="Authorization Policy",
                description="Authorization Policy Description",
                default_user_role_permissions=DefaultUserRolePermissions(
                    permission_grant_policies_assigned=[]
                ),
                guest_invite_settings="none",
                guest_user_role_id=uuid4(),
            )

            entra_client.authorization_policy = {DOMAIN: auth_policy}

            check = entra_policy_user_consent_for_verified_apps()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Authorization Policy"
            assert result[0].resource_id == auth_policy.id
            assert (
                result[0].status_extended
                == "Entra does not allow users to consent non-verified apps accessing company data on their behalf."
            )

    def test_entra_tenant_legacy_consent(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_policy_user_consent_for_verified_apps.entra_policy_user_consent_for_verified_apps.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_user_consent_for_verified_apps.entra_policy_user_consent_for_verified_apps import (
                entra_policy_user_consent_for_verified_apps,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                AuthorizationPolicy,
                DefaultUserRolePermissions,
            )

            auth_policy = AuthorizationPolicy(
                id=str(uuid4()),
                name="Authorization Policy",
                description="Authorization Policy Description",
                default_user_role_permissions=DefaultUserRolePermissions(
                    permission_grant_policies_assigned=[
                        "ManagePermissionGrantsForSelf.microsoft-user-default-legacy"
                    ]
                ),
                guest_invite_settings="none",
                guest_user_role_id=uuid4(),
            )

            entra_client.authorization_policy = {DOMAIN: auth_policy}

            check = entra_policy_user_consent_for_verified_apps()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Authorization Policy"
            assert result[0].resource_id == auth_policy.id
            assert (
                result[0].status_extended
                == "Entra allows users to consent apps accessing company data on their behalf."
            )
```

--------------------------------------------------------------------------------

---[FILE: entra_privileged_user_has_mfa_test.py]---
Location: prowler-master/tests/providers/azure/services/entra/entra_privileged_user_has_mfa/entra_privileged_user_has_mfa_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import DOMAIN, set_mocked_azure_provider


class Test_entra_privileged_user_has_mfa:
    def test_entra_no_tenants(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_privileged_user_has_mfa.entra_privileged_user_has_mfa.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_privileged_user_has_mfa.entra_privileged_user_has_mfa import (
                entra_privileged_user_has_mfa,
            )

            entra_client.users = {}

            check = entra_privileged_user_has_mfa()
            result = check.execute()
            assert len(result) == 0

    def test_entra_tenant_no_users(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_privileged_user_has_mfa.entra_privileged_user_has_mfa.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_privileged_user_has_mfa.entra_privileged_user_has_mfa import (
                entra_privileged_user_has_mfa,
            )

            entra_client.users = {DOMAIN: {}}

            check = entra_privileged_user_has_mfa()
            result = check.execute()
            assert len(result) == 0

    def test_entra_user_no_privileged_no_mfa(self):
        entra_client = mock.MagicMock
        user_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_privileged_user_has_mfa.entra_privileged_user_has_mfa.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_privileged_user_has_mfa.entra_privileged_user_has_mfa import (
                entra_privileged_user_has_mfa,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                AuthMethod,
                DirectoryRole,
                User,
            )

            user = User(
                id=user_id,
                name="foo",
                authentication_methods=[AuthMethod(id=str(uuid4()), type="foo")],
            )

            entra_client.users = {DOMAIN: {f"foo@{DOMAIN}": user}}
            entra_client.directory_roles = {
                DOMAIN: {
                    "Global Administrator": DirectoryRole(id=str(uuid4()), members=[])
                }
            }

            check = entra_privileged_user_has_mfa()
            result = check.execute()
            assert len(result) == 0

    def test_entra_user_no_privileged_mfa(self):
        entra_client = mock.MagicMock
        user_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_privileged_user_has_mfa.entra_privileged_user_has_mfa.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_privileged_user_has_mfa.entra_privileged_user_has_mfa import (
                entra_privileged_user_has_mfa,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                AuthMethod,
                DirectoryRole,
                User,
            )

            user = User(
                id=user_id,
                name="foo",
                authentication_methods=[
                    AuthMethod(id=str(uuid4()), type="foo"),
                    AuthMethod(id=str(uuid4()), type="bar"),
                ],
            )

            entra_client.users = {DOMAIN: {f"foo@{DOMAIN}": user}}
            entra_client.directory_roles = {
                DOMAIN: {
                    "Global Administrator": DirectoryRole(id=str(uuid4()), members=[])
                }
            }

            check = entra_privileged_user_has_mfa()
            result = check.execute()
            assert len(result) == 0

    def test_entra_user_privileged_no_mfa(self):
        entra_client = mock.MagicMock
        user_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_privileged_user_has_mfa.entra_privileged_user_has_mfa.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_privileged_user_has_mfa.entra_privileged_user_has_mfa import (
                entra_privileged_user_has_mfa,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                AuthMethod,
                DirectoryRole,
                User,
            )

            user = User(
                id=user_id,
                name="foo",
                authentication_methods=[AuthMethod(id=str(uuid4()), type="foo")],
            )

            entra_client.users = {DOMAIN: {f"foo@{DOMAIN}": user}}
            entra_client.directory_roles = {
                DOMAIN: {
                    "Global Administrator": DirectoryRole(
                        id=str(uuid4()), members=[user]
                    )
                }
            }

            check = entra_privileged_user_has_mfa()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == "Privileged user foo does not have MFA."
            assert result[0].resource_name == "foo"
            assert result[0].resource_id == user_id
            assert result[0].subscription == f"Tenant: {DOMAIN}"

    def test_entra_user_privileged_mfa(self):
        entra_client = mock.MagicMock
        user_id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_privileged_user_has_mfa.entra_privileged_user_has_mfa.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_privileged_user_has_mfa.entra_privileged_user_has_mfa import (
                entra_privileged_user_has_mfa,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                AuthMethod,
                DirectoryRole,
                User,
            )

            user = User(
                id=user_id,
                name="foo",
                authentication_methods=[
                    AuthMethod(id=str(uuid4()), type="foo"),
                    AuthMethod(id=str(uuid4()), type="bar"),
                ],
            )

            entra_client.users = {DOMAIN: {f"foo@{DOMAIN}": user}}
            entra_client.directory_roles = {
                DOMAIN: {
                    "Global Administrator": DirectoryRole(
                        id=str(uuid4()), members=[user]
                    )
                }
            }

            check = entra_privileged_user_has_mfa()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == "Privileged user foo has MFA."
            assert result[0].resource_name == "foo"
            assert result[0].resource_id == user_id
            assert result[0].subscription == f"Tenant: {DOMAIN}"
```

--------------------------------------------------------------------------------

---[FILE: entra_security_defaults_enabled_test.py]---
Location: prowler-master/tests/providers/azure/services/entra/entra_security_defaults_enabled/entra_security_defaults_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import DOMAIN, set_mocked_azure_provider


class Test_entra_security_defaults_enabled:
    def test_entra_no_tenants(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_security_defaults_enabled.entra_security_defaults_enabled.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_security_defaults_enabled.entra_security_defaults_enabled import (
                entra_security_defaults_enabled,
            )

            entra_client.security_default = {}

            check = entra_security_defaults_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_entra_tenant_empty(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_security_defaults_enabled.entra_security_defaults_enabled.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_security_defaults_enabled.entra_security_defaults_enabled import (
                entra_security_defaults_enabled,
            )

            entra_client.security_default = {DOMAIN: {}}

            check = entra_security_defaults_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == "Entra security defaults is disabled."
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == ""
            assert result[0].resource_id == ""

    def test_entra_security_default_enabled(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_security_defaults_enabled.entra_security_defaults_enabled.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_security_defaults_enabled.entra_security_defaults_enabled import (
                entra_security_defaults_enabled,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                SecurityDefault,
            )

            id = str(uuid4())

            entra_client.security_default = {
                DOMAIN: SecurityDefault(id=id, name="Sec Default", is_enabled=True)
            }

            check = entra_security_defaults_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == "Entra security defaults is enabled."
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Sec Default"
            assert result[0].resource_id == id

    def test_entra_security_default_disabled(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_security_defaults_enabled.entra_security_defaults_enabled.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_security_defaults_enabled.entra_security_defaults_enabled import (
                entra_security_defaults_enabled,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                SecurityDefault,
            )

            id = str(uuid4())

            entra_client.security_default = {
                DOMAIN: SecurityDefault(id=id, name="Sec Default", is_enabled=False)
            }

            check = entra_security_defaults_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == "Entra security defaults is disabled."
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Sec Default"
            assert result[0].resource_id == id
```

--------------------------------------------------------------------------------

---[FILE: entra_trusted_named_locations_exists_test.py]---
Location: prowler-master/tests/providers/azure/services/entra/entra_trusted_named_locations_exists/entra_trusted_named_locations_exists_test.py

```python
from unittest import mock

from tests.providers.azure.azure_fixtures import DOMAIN, set_mocked_azure_provider


class Test_entra_trusted_named_locations_exists:
    def test_entra_no_tenants(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_trusted_named_locations_exists.entra_trusted_named_locations_exists.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_trusted_named_locations_exists.entra_trusted_named_locations_exists import (
                entra_trusted_named_locations_exists,
            )

            entra_client.named_locations = {}

            check = entra_trusted_named_locations_exists()
            result = check.execute()
            assert len(result) == 0

    def test_entra_tenant_empty(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_trusted_named_locations_exists.entra_trusted_named_locations_exists.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_trusted_named_locations_exists.entra_trusted_named_locations_exists import (
                entra_trusted_named_locations_exists,
            )

            entra_client.named_locations = {DOMAIN: {}}

            check = entra_trusted_named_locations_exists()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "There is no trusted location with IP ranges defined."
            )
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Named Locations"
            assert result[0].resource_id == "Named Locations"

    def test_entra_named_location_with_ip_ranges(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_trusted_named_locations_exists.entra_trusted_named_locations_exists.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_service import (
                NamedLocation,
            )
            from prowler.providers.azure.services.entra.entra_trusted_named_locations_exists.entra_trusted_named_locations_exists import (
                entra_trusted_named_locations_exists,
            )

            entra_client.named_locations = {
                DOMAIN: {
                    "location_id": NamedLocation(
                        id="location_id",
                        name="Test Location",
                        ip_ranges_addresses=["192.168.0.1/24"],
                        is_trusted=True,
                    )
                }
            }

            check = entra_trusted_named_locations_exists()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Exits trusted location with trusted IP ranges, this IPs ranges are: ['192.168.0.1/24']"
            )
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Test Location"
            assert result[0].resource_id == "location_id"

    def test_entra_named_location_without_ip_ranges(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_trusted_named_locations_exists.entra_trusted_named_locations_exists.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_service import (
                NamedLocation,
            )
            from prowler.providers.azure.services.entra.entra_trusted_named_locations_exists.entra_trusted_named_locations_exists import (
                entra_trusted_named_locations_exists,
            )

            entra_client.named_locations = {
                DOMAIN: {
                    "location_id": NamedLocation(
                        id="location_id",
                        name="Test Location",
                        ip_ranges_addresses=[],
                        is_trusted=True,
                    )
                }
            }

            check = entra_trusted_named_locations_exists()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "There is no trusted location with IP ranges defined."
            )
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Named Locations"
            assert result[0].resource_id == "Named Locations"

    def test_entra_new_named_location_with_ip_ranges_not_trusted(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_trusted_named_locations_exists.entra_trusted_named_locations_exists.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_service import (
                NamedLocation,
            )
            from prowler.providers.azure.services.entra.entra_trusted_named_locations_exists.entra_trusted_named_locations_exists import (
                entra_trusted_named_locations_exists,
            )

            entra_client.named_locations = {
                DOMAIN: {
                    "location_id": NamedLocation(
                        id="location_id",
                        name="Test Location",
                        ip_ranges_addresses=["192.168.0.1/24"],
                        is_trusted=False,
                    )
                }
            }

            check = entra_trusted_named_locations_exists()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "There is no trusted location with IP ranges defined."
            )
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Named Locations"
            assert result[0].resource_id == "Named Locations"
```

--------------------------------------------------------------------------------

---[FILE: entra_users_cannot_create_microsoft_365_groups_test.py]---
Location: prowler-master/tests/providers/azure/services/entra/entra_users_cannot_create_microsoft_365_groups/entra_users_cannot_create_microsoft_365_groups_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import DOMAIN, set_mocked_azure_provider


class Test_entra_users_cannot_create_microsoft_365_groups:
    def test_entra_no_tenant(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_users_cannot_create_microsoft_365_groups.entra_users_cannot_create_microsoft_365_groups.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_users_cannot_create_microsoft_365_groups.entra_users_cannot_create_microsoft_365_groups import (
                entra_users_cannot_create_microsoft_365_groups,
            )

            entra_client.group_settings = {}

            check = entra_users_cannot_create_microsoft_365_groups()
            result = check.execute()
            assert len(result) == 0

    def test_entra_tenant_empty(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_users_cannot_create_microsoft_365_groups.entra_users_cannot_create_microsoft_365_groups.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_users_cannot_create_microsoft_365_groups.entra_users_cannot_create_microsoft_365_groups import (
                entra_users_cannot_create_microsoft_365_groups,
            )

            entra_client.group_settings = {DOMAIN: {}}

            check = entra_users_cannot_create_microsoft_365_groups()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == "Users can create Microsoft 365 groups."
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Microsoft365 Groups"
            assert result[0].resource_id == "Microsoft365 Groups"

    def test_entra_users_cannot_create_microsoft_365_groups(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_users_cannot_create_microsoft_365_groups.entra_users_cannot_create_microsoft_365_groups.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_service import (
                GroupSetting,
                SettingValue,
            )
            from prowler.providers.azure.services.entra.entra_users_cannot_create_microsoft_365_groups.entra_users_cannot_create_microsoft_365_groups import (
                entra_users_cannot_create_microsoft_365_groups,
            )

            id = str(uuid4())
            template_id = str(uuid4())

            setting = SettingValue(name="EnableGroupCreation", value="false")

            entra_client.group_settings = {
                DOMAIN: {
                    id: GroupSetting(
                        name="Group.Unified",
                        template_id=template_id,
                        settings=[setting],
                    )
                }
            }

            check = entra_users_cannot_create_microsoft_365_groups()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended == "Users cannot create Microsoft 365 groups."
            )
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Microsoft365 Groups"
            assert result[0].resource_id == "Microsoft365 Groups"

    def test_entra_users_can_create_microsoft_365_groups(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_users_cannot_create_microsoft_365_groups.entra_users_cannot_create_microsoft_365_groups.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_service import (
                GroupSetting,
                SettingValue,
            )
            from prowler.providers.azure.services.entra.entra_users_cannot_create_microsoft_365_groups.entra_users_cannot_create_microsoft_365_groups import (
                entra_users_cannot_create_microsoft_365_groups,
            )

            id = str(uuid4())
            template_id = str(uuid4())

            setting = SettingValue(name="EnableGroupCreation", value="true")

            entra_client.group_settings = {
                DOMAIN: {
                    id: GroupSetting(
                        name="Group.Unified",
                        template_id=template_id,
                        settings=[setting],
                    )
                }
            }

            check = entra_users_cannot_create_microsoft_365_groups()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == "Users can create Microsoft 365 groups."
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Microsoft365 Groups"
            assert result[0].resource_id == "Microsoft365 Groups"

    def test_entra_users_can_create_microsoft_365_groups_no_setting(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_users_cannot_create_microsoft_365_groups.entra_users_cannot_create_microsoft_365_groups.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_service import (
                GroupSetting,
            )
            from prowler.providers.azure.services.entra.entra_users_cannot_create_microsoft_365_groups.entra_users_cannot_create_microsoft_365_groups import (
                entra_users_cannot_create_microsoft_365_groups,
            )

            id = str(uuid4())
            template_id = str(uuid4())

            entra_client.group_settings = {
                DOMAIN: {
                    id: GroupSetting(
                        name="Group.Unified",
                        template_id=template_id,
                        settings=[],
                    )
                }
            }

            check = entra_users_cannot_create_microsoft_365_groups()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == "Users can create Microsoft 365 groups."
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Microsoft365 Groups"
            assert result[0].resource_id == "Microsoft365 Groups"
```

--------------------------------------------------------------------------------

````
