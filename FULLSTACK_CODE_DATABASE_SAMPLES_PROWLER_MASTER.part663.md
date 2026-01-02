---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 663
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 663 of 867)

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

---[FILE: entra_policy_ensure_default_user_cannot_create_apps_test.py]---
Location: prowler-master/tests/providers/azure/services/entra/entra_policy_ensure_default_user_cannot_create_apps/entra_policy_ensure_default_user_cannot_create_apps_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import DOMAIN, set_mocked_azure_provider


class Test_entra_policy_ensure_default_user_cannot_create_apps:
    def test_entra_no_tenants(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_policy_ensure_default_user_cannot_create_apps.entra_policy_ensure_default_user_cannot_create_apps.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_ensure_default_user_cannot_create_apps.entra_policy_ensure_default_user_cannot_create_apps import (
                entra_policy_ensure_default_user_cannot_create_apps,
            )

            entra_client.authorization_policy = {}

            check = entra_policy_ensure_default_user_cannot_create_apps()
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
                "prowler.providers.azure.services.entra.entra_policy_ensure_default_user_cannot_create_apps.entra_policy_ensure_default_user_cannot_create_apps.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_ensure_default_user_cannot_create_apps.entra_policy_ensure_default_user_cannot_create_apps import (
                entra_policy_ensure_default_user_cannot_create_apps,
            )

            entra_client.authorization_policy = {DOMAIN: {}}

            check = entra_policy_ensure_default_user_cannot_create_apps()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Authorization Policy"
            assert result[0].resource_id == "authorizationPolicy"
            assert (
                result[0].status_extended
                == "App creation is not disabled for non-admin users."
            )

    def test_entra_default_user_role_permissions_not_allowed_to_create_apps(self):
        id = str(uuid4())
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_policy_ensure_default_user_cannot_create_apps.entra_policy_ensure_default_user_cannot_create_apps.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_ensure_default_user_cannot_create_apps.entra_policy_ensure_default_user_cannot_create_apps import (
                entra_policy_ensure_default_user_cannot_create_apps,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                AuthorizationPolicy,
                DefaultUserRolePermissions,
            )

            entra_client.authorization_policy = {
                DOMAIN: AuthorizationPolicy(
                    id=id,
                    name="Test",
                    description="Test",
                    default_user_role_permissions=DefaultUserRolePermissions(
                        allowed_to_create_apps=False
                    ),
                    guest_invite_settings="none",
                    guest_user_role_id=uuid4(),
                )
            }

            check = entra_policy_ensure_default_user_cannot_create_apps()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "App creation is disabled for non-admin users."
            )
            assert result[0].resource_name == "Test"
            assert result[0].resource_id == id
            assert result[0].subscription == f"Tenant: {DOMAIN}"

    def test_entra_default_user_role_permissions_allowed_to_create_apps(self):
        id = str(uuid4())
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_policy_ensure_default_user_cannot_create_apps.entra_policy_ensure_default_user_cannot_create_apps.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_ensure_default_user_cannot_create_apps.entra_policy_ensure_default_user_cannot_create_apps import (
                entra_policy_ensure_default_user_cannot_create_apps,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                AuthorizationPolicy,
                DefaultUserRolePermissions,
            )

            entra_client.authorization_policy = {
                DOMAIN: AuthorizationPolicy(
                    id=id,
                    name="Test",
                    description="Test",
                    default_user_role_permissions=DefaultUserRolePermissions(
                        allowed_to_create_apps=True
                    ),
                    guest_invite_settings="none",
                    guest_user_role_id=uuid4(),
                )
            }

            check = entra_policy_ensure_default_user_cannot_create_apps()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "App creation is not disabled for non-admin users."
            )
            assert result[0].resource_name == "Test"
            assert result[0].resource_id == id
            assert result[0].subscription == f"Tenant: {DOMAIN}"
```

--------------------------------------------------------------------------------

---[FILE: entra_policy_ensure_default_user_cannot_create_tenants_test.py]---
Location: prowler-master/tests/providers/azure/services/entra/entra_policy_ensure_default_user_cannot_create_tenants/entra_policy_ensure_default_user_cannot_create_tenants_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import DOMAIN, set_mocked_azure_provider


class Test_entra_policy_ensure_default_user_cannot_create_tenants:
    def test_entra_no_tenants(self):
        entra_client = mock.MagicMock
        entra_client.authorization_policy = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_policy_ensure_default_user_cannot_create_tenants.entra_policy_ensure_default_user_cannot_create_tenants.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_ensure_default_user_cannot_create_tenants.entra_policy_ensure_default_user_cannot_create_tenants import (
                entra_policy_ensure_default_user_cannot_create_tenants,
            )

            check = entra_policy_ensure_default_user_cannot_create_tenants()
            result = check.execute()
            assert len(result) == 0

    def test_entra_empty_tenant(self):
        entra_client = mock.MagicMock
        entra_client.authorization_policy = {DOMAIN: {}}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_policy_ensure_default_user_cannot_create_tenants.entra_policy_ensure_default_user_cannot_create_tenants.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_ensure_default_user_cannot_create_tenants.entra_policy_ensure_default_user_cannot_create_tenants import (
                entra_policy_ensure_default_user_cannot_create_tenants,
            )

            check = entra_policy_ensure_default_user_cannot_create_tenants()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Authorization Policy"
            assert result[0].resource_id == "authorizationPolicy"
            assert (
                result[0].status_extended
                == "Tenants creation is not disabled for non-admin users."
            )

    def test_entra_default_user_role_permissions_not_allowed_to_create_tenants(self):
        id = str(uuid4())
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_policy_ensure_default_user_cannot_create_tenants.entra_policy_ensure_default_user_cannot_create_tenants.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_ensure_default_user_cannot_create_tenants.entra_policy_ensure_default_user_cannot_create_tenants import (
                entra_policy_ensure_default_user_cannot_create_tenants,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                AuthorizationPolicy,
                DefaultUserRolePermissions,
            )

            entra_client.authorization_policy = {
                DOMAIN: AuthorizationPolicy(
                    id=id,
                    name="Test",
                    description="Test",
                    default_user_role_permissions=DefaultUserRolePermissions(
                        allowed_to_create_tenants=False
                    ),
                    guest_invite_settings="everyone",
                    guest_user_role_id=uuid4(),
                )
            }

            check = entra_policy_ensure_default_user_cannot_create_tenants()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Tenants creation is disabled for non-admin users."
            )
            assert result[0].resource_name == "Test"
            assert result[0].resource_id == id
            assert result[0].subscription == f"Tenant: {DOMAIN}"

    def test_entra_default_user_role_permissions_allowed_to_create_tenants(self):
        id = str(uuid4())
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_policy_ensure_default_user_cannot_create_tenants.entra_policy_ensure_default_user_cannot_create_tenants.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_ensure_default_user_cannot_create_tenants.entra_policy_ensure_default_user_cannot_create_tenants import (
                entra_policy_ensure_default_user_cannot_create_tenants,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                AuthorizationPolicy,
                DefaultUserRolePermissions,
            )

            entra_client.authorization_policy = {
                DOMAIN: AuthorizationPolicy(
                    id=id,
                    name="Test",
                    description="Test",
                    default_user_role_permissions=DefaultUserRolePermissions(
                        allowed_to_create_tenants=True
                    ),
                    guest_invite_settings="everyone",
                    guest_user_role_id=uuid4(),
                )
            }

            check = entra_policy_ensure_default_user_cannot_create_tenants()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Tenants creation is not disabled for non-admin users."
            )
            assert result[0].resource_name == "Test"
            assert result[0].resource_id == id
            assert result[0].subscription == f"Tenant: {DOMAIN}"
```

--------------------------------------------------------------------------------

---[FILE: entra_policy_guest_invite_only_for_admin_roles_test.py]---
Location: prowler-master/tests/providers/azure/services/entra/entra_policy_guest_invite_only_for_admin_roles/entra_policy_guest_invite_only_for_admin_roles_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import DOMAIN, set_mocked_azure_provider


class Test_entra_policy_guest_invite_only_for_admin_roles:
    def test_entra_no_tenants(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_policy_guest_invite_only_for_admin_roles.entra_policy_guest_invite_only_for_admin_roles.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_guest_invite_only_for_admin_roles.entra_policy_guest_invite_only_for_admin_roles import (
                entra_policy_guest_invite_only_for_admin_roles,
            )

            entra_client.authorization_policy = {}

            check = entra_policy_guest_invite_only_for_admin_roles()
            result = check.execute()
            assert len(result) == 0

    def test_entra_empty_tenant(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_policy_guest_invite_only_for_admin_roles.entra_policy_guest_invite_only_for_admin_roles.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_guest_invite_only_for_admin_roles.entra_policy_guest_invite_only_for_admin_roles import (
                entra_policy_guest_invite_only_for_admin_roles,
            )

            entra_client.authorization_policy = {DOMAIN: {}}

            check = entra_policy_guest_invite_only_for_admin_roles()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Authorization Policy"
            assert result[0].resource_id == "authorizationPolicy"
            assert (
                result[0].status_extended
                == "Guest invitations are not restricted to users with specific administrative roles only."
            )

    def test_entra_tenant_policy_allow_invites_from_everyone(self):
        entra_client = mock.MagicMock
        id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_policy_guest_invite_only_for_admin_roles.entra_policy_guest_invite_only_for_admin_roles.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_guest_invite_only_for_admin_roles.entra_policy_guest_invite_only_for_admin_roles import (
                entra_policy_guest_invite_only_for_admin_roles,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                AuthorizationPolicy,
                DefaultUserRolePermissions,
            )

            entra_client.authorization_policy = {
                DOMAIN: AuthorizationPolicy(
                    id=id,
                    name="TestPolicy",
                    description="TestPolicyDescription",
                    default_user_role_permissions=DefaultUserRolePermissions(),
                    guest_invite_settings="everyone",
                    guest_user_role_id=uuid4(),
                )
            }

            check = entra_policy_guest_invite_only_for_admin_roles()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "Guest invitations are not restricted to users with specific administrative roles only."
            )
            assert result[0].resource_name == "TestPolicy"
            assert result[0].resource_id == id
            assert result[0].subscription == f"Tenant: {DOMAIN}"

    def test_entra_tenant_policy_allow_invites_from_admins(self):
        entra_client = mock.MagicMock
        id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_policy_guest_invite_only_for_admin_roles.entra_policy_guest_invite_only_for_admin_roles.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_guest_invite_only_for_admin_roles.entra_policy_guest_invite_only_for_admin_roles import (
                entra_policy_guest_invite_only_for_admin_roles,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                AuthorizationPolicy,
                DefaultUserRolePermissions,
            )

            entra_client.authorization_policy = {
                DOMAIN: AuthorizationPolicy(
                    id=id,
                    name="TestPolicy",
                    description="TestPolicyDescription",
                    default_user_role_permissions=DefaultUserRolePermissions(),
                    guest_invite_settings="adminsAndGuestInviters",
                    guest_user_role_id=uuid4(),
                )
            }

            check = entra_policy_guest_invite_only_for_admin_roles()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                "Guest invitations are restricted to users with specific administrative roles only."
            )
            assert result[0].resource_name == "TestPolicy"
            assert result[0].resource_id == id
            assert result[0].subscription == f"Tenant: {DOMAIN}"

    def test_entra_tenant_policy_allow_invites_from_none(self):
        entra_client = mock.MagicMock
        id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_policy_guest_invite_only_for_admin_roles.entra_policy_guest_invite_only_for_admin_roles.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_guest_invite_only_for_admin_roles.entra_policy_guest_invite_only_for_admin_roles import (
                entra_policy_guest_invite_only_for_admin_roles,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                AuthorizationPolicy,
                DefaultUserRolePermissions,
            )

            entra_client.authorization_policy = {
                DOMAIN: AuthorizationPolicy(
                    id=id,
                    name="TestPolicy",
                    description="TestPolicyDescription",
                    default_user_role_permissions=DefaultUserRolePermissions(),
                    guest_invite_settings="none",
                    guest_user_role_id=uuid4(),
                )
            }

            check = entra_policy_guest_invite_only_for_admin_roles()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                "Guest invitations are restricted to users with specific administrative roles only."
            )
            assert result[0].resource_name == "TestPolicy"
            assert result[0].resource_id == id
            assert result[0].subscription == f"Tenant: {DOMAIN}"
```

--------------------------------------------------------------------------------

---[FILE: entra_policy_guest_users_access_restrictions_test.py]---
Location: prowler-master/tests/providers/azure/services/entra/entra_policy_guest_users_access_restrictions/entra_policy_guest_users_access_restrictions_test.py

```python
from unittest import mock
from uuid import UUID, uuid4

from tests.providers.azure.azure_fixtures import DOMAIN, set_mocked_azure_provider


class Test_entra_policy_guest_users_access_restrictions:
    def test_entra_no_tenants(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_policy_guest_users_access_restrictions.entra_policy_guest_users_access_restrictions.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_guest_users_access_restrictions.entra_policy_guest_users_access_restrictions import (
                entra_policy_guest_users_access_restrictions,
            )

            entra_client.authorization_policy = {}

            check = entra_policy_guest_users_access_restrictions()
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
                "prowler.providers.azure.services.entra.entra_policy_guest_users_access_restrictions.entra_policy_guest_users_access_restrictions.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_guest_users_access_restrictions.entra_policy_guest_users_access_restrictions import (
                entra_policy_guest_users_access_restrictions,
            )

            entra_client.authorization_policy = {DOMAIN: {}}

            check = entra_policy_guest_users_access_restrictions()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Authorization Policy"
            assert result[0].resource_id == "authorizationPolicy"
            assert (
                result[0].status_extended
                == "Guest user access is not restricted to properties and memberships of their own directory objects"
            )

    def test_entra_tenant_policy_access_same_as_member(self):
        entra_client = mock.MagicMock
        id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_policy_guest_users_access_restrictions.entra_policy_guest_users_access_restrictions.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_guest_users_access_restrictions.entra_policy_guest_users_access_restrictions import (
                entra_policy_guest_users_access_restrictions,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                AuthorizationPolicy,
            )

            entra_client.authorization_policy = {
                DOMAIN: AuthorizationPolicy(
                    id=id,
                    name="Authorization Policy",
                    description="",
                    guest_invite_settings="none",
                    guest_user_role_id=UUID("a0b1b346-4d3e-4e8b-98f8-753987be4970"),
                )
            }

            check = entra_policy_guest_users_access_restrictions()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Authorization Policy"
            assert result[0].resource_id == id
            assert (
                result[0].status_extended
                == "Guest user access is not restricted to properties and memberships of their own directory objects"
            )

    def test_entra_tenant_policy_limited_access(self):
        entra_client = mock.MagicMock
        id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_policy_guest_users_access_restrictions.entra_policy_guest_users_access_restrictions.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_guest_users_access_restrictions.entra_policy_guest_users_access_restrictions import (
                entra_policy_guest_users_access_restrictions,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                AuthorizationPolicy,
            )

            entra_client.authorization_policy = {
                DOMAIN: AuthorizationPolicy(
                    id=id,
                    name="Authorization Policy",
                    description="",
                    guest_invite_settings="none",
                    guest_user_role_id=UUID("10dae51f-b6af-4016-8d66-8c2a99b929b3"),
                )
            }

            check = entra_policy_guest_users_access_restrictions()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Authorization Policy"
            assert result[0].resource_id == id
            assert (
                result[0].status_extended
                == "Guest user access is not restricted to properties and memberships of their own directory objects"
            )

    def test_entra_tenant_policy_access_restricted(self):
        entra_client = mock.MagicMock
        id = str(uuid4())

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_policy_guest_users_access_restrictions.entra_policy_guest_users_access_restrictions.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_guest_users_access_restrictions.entra_policy_guest_users_access_restrictions import (
                entra_policy_guest_users_access_restrictions,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                AuthorizationPolicy,
            )

            entra_client.authorization_policy = {
                DOMAIN: AuthorizationPolicy(
                    id=id,
                    name="Authorization Policy",
                    description="",
                    guest_invite_settings="none",
                    guest_user_role_id=UUID("2af84b1e-32c8-42b7-82bc-daa82404023b"),
                )
            }

            check = entra_policy_guest_users_access_restrictions()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Authorization Policy"
            assert result[0].resource_id == id
            assert (
                result[0].status_extended
                == "Guest user access is restricted to properties and memberships of their own directory objects"
            )
```

--------------------------------------------------------------------------------

---[FILE: entra_policy_restricts_user_consent_for_apps_test.py]---
Location: prowler-master/tests/providers/azure/services/entra/entra_policy_restricts_user_consent_for_apps/entra_policy_restricts_user_consent_for_apps_test.py

```python
from unittest import mock
from uuid import uuid4

from tests.providers.azure.azure_fixtures import DOMAIN, set_mocked_azure_provider


class Test_entra_policy_restricts_user_consent_for_apps:
    def test_entra_no_tenants(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_policy_restricts_user_consent_for_apps.entra_policy_restricts_user_consent_for_apps.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_restricts_user_consent_for_apps.entra_policy_restricts_user_consent_for_apps import (
                entra_policy_restricts_user_consent_for_apps,
            )

            entra_client.authorization_policy = {}

            check = entra_policy_restricts_user_consent_for_apps()
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
                "prowler.providers.azure.services.entra.entra_policy_restricts_user_consent_for_apps.entra_policy_restricts_user_consent_for_apps.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_restricts_user_consent_for_apps.entra_policy_restricts_user_consent_for_apps import (
                entra_policy_restricts_user_consent_for_apps,
            )

            entra_client.authorization_policy = {DOMAIN: {}}

            check = entra_policy_restricts_user_consent_for_apps()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Authorization Policy"
            assert result[0].resource_id == "authorizationPolicy"
            assert (
                result[0].status_extended
                == "Entra allows users to consent apps accessing company data on their behalf"
            )

    def test_entra_tenant_no_default_user_role_permissions(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_policy_restricts_user_consent_for_apps.entra_policy_restricts_user_consent_for_apps.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_restricts_user_consent_for_apps.entra_policy_restricts_user_consent_for_apps import (
                entra_policy_restricts_user_consent_for_apps,
            )
            from prowler.providers.azure.services.entra.entra_service import (
                AuthorizationPolicy,
            )

            auth_policy = AuthorizationPolicy(
                id=str(uuid4()),
                name="Authorization Policy",
                description="Authorization Policy Description",
                guest_invite_settings="none",
                guest_user_role_id=uuid4(),
            )

            entra_client.authorization_policy = {DOMAIN: auth_policy}

            check = entra_policy_restricts_user_consent_for_apps()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Authorization Policy"
            assert result[0].resource_id == auth_policy.id
            assert (
                result[0].status_extended
                == "Entra allows users to consent apps accessing company data on their behalf"
            )

    def test_entra_tenant_no_consent(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_policy_restricts_user_consent_for_apps.entra_policy_restricts_user_consent_for_apps.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_restricts_user_consent_for_apps.entra_policy_restricts_user_consent_for_apps import (
                entra_policy_restricts_user_consent_for_apps,
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

            check = entra_policy_restricts_user_consent_for_apps()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Authorization Policy"
            assert result[0].resource_id == auth_policy.id
            assert (
                result[0].status_extended
                == "Entra does not allow users to consent apps accessing company data on their behalf"
            )

    def test_entra_tenant_legacy_consent(self):
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_azure_provider(),
            ),
            mock.patch(
                "prowler.providers.azure.services.entra.entra_policy_restricts_user_consent_for_apps.entra_policy_restricts_user_consent_for_apps.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.azure.services.entra.entra_policy_restricts_user_consent_for_apps.entra_policy_restricts_user_consent_for_apps import (
                entra_policy_restricts_user_consent_for_apps,
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

            check = entra_policy_restricts_user_consent_for_apps()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].subscription == f"Tenant: {DOMAIN}"
            assert result[0].resource_name == "Authorization Policy"
            assert result[0].resource_id == auth_policy.id
            assert (
                result[0].status_extended
                == "Entra allows users to consent apps accessing company data on their behalf"
            )
```

--------------------------------------------------------------------------------

````
