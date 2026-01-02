---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 744
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 744 of 867)

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

---[FILE: microsoft365_entra_policy_guest_invite_only_for_admin_roles_test.py]---
Location: prowler-master/tests/providers/m365/services/entra/entra_policy_guest_invite_only_for_admin_roles/microsoft365_entra_policy_guest_invite_only_for_admin_roles_test.py

```python
import mock

from prowler.providers.m365.services.entra.entra_service import (
    AuthorizationPolicy,
    InvitationsFrom,
)
from tests.providers.m365.m365_fixtures import set_mocked_m365_provider


class Test_entra_policy_guest_invite_only_for_admin_roles:
    def test_no_auth_policy(self):
        """
        Test when there is no authorization policy (auth_policy is None):
        The check should return a report with FAIL status using default resource values.
        """
        entra_client = mock.MagicMock()
        entra_client.authorization_policy = None

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_policy_guest_invite_only_for_admin_roles.entra_policy_guest_invite_only_for_admin_roles.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_policy_guest_invite_only_for_admin_roles.entra_policy_guest_invite_only_for_admin_roles import (
                entra_policy_guest_invite_only_for_admin_roles,
            )

            check = entra_policy_guest_invite_only_for_admin_roles()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "Guest invitations are not restricted to users with specific administrative roles only."
            )
            assert result[0].resource_name == "Authorization Policy"
            assert result[0].resource_id == "authorizationPolicy"
            assert result[0].resource == {}

    def test_auth_policy_fail(self):
        """
        Test when an authorization policy exists but guest_invite_settings is not set to a restricted value:
        The check should FAIL.
        """
        entra_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_policy_guest_invite_only_for_admin_roles.entra_policy_guest_invite_only_for_admin_roles.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_policy_guest_invite_only_for_admin_roles.entra_policy_guest_invite_only_for_admin_roles import (
                entra_policy_guest_invite_only_for_admin_roles,
            )

            entra_client.authorization_policy = AuthorizationPolicy(
                id="policy001",
                name="Auth Policy Test",
                description="Test policy",
                guest_invite_settings=InvitationsFrom.EVERYONE.value,
            )

            check = entra_policy_guest_invite_only_for_admin_roles()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "Guest invitations are not restricted to users with specific administrative roles only."
            )
            assert result[0].resource_id == "policy001"
            assert result[0].resource_name == "Auth Policy Test"
            assert result[0].location == "global"
            assert result[0].resource == entra_client.authorization_policy.dict()

    def test_auth_policy_pass_admins_and_guest_inviters(self):
        """
        Test when the authorization policy exists and guest_invite_settings is set to
        InvitationsFrom.ADMINS_AND_GUEST_INVITERS: the check should PASS.
        """
        entra_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_policy_guest_invite_only_for_admin_roles.entra_policy_guest_invite_only_for_admin_roles.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_policy_guest_invite_only_for_admin_roles.entra_policy_guest_invite_only_for_admin_roles import (
                entra_policy_guest_invite_only_for_admin_roles,
            )

            entra_client.authorization_policy = AuthorizationPolicy(
                id="policy002",
                name="Auth Policy Restricted",
                description="Test policy",
                guest_invite_settings=InvitationsFrom.ADMINS_AND_GUEST_INVITERS.value,
            )

            check = entra_policy_guest_invite_only_for_admin_roles()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                "Guest invitations are restricted to users with specific administrative roles only."
            )
            assert result[0].resource_id == "policy002"
            assert result[0].resource_name == "Auth Policy Restricted"
            assert result[0].location == "global"
            assert result[0].resource == entra_client.authorization_policy.dict()

    def test_auth_policy_pass_none(self):
        """
        Test when the authorization policy exists and guest_invite_settings is set to
        InvitationsFrom.NONE: the check should PASS.
        """
        entra_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_policy_guest_invite_only_for_admin_roles.entra_policy_guest_invite_only_for_admin_roles.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_policy_guest_invite_only_for_admin_roles.entra_policy_guest_invite_only_for_admin_roles import (
                entra_policy_guest_invite_only_for_admin_roles,
            )

            entra_client.authorization_policy = AuthorizationPolicy(
                id="policy003",
                name="Auth Policy Restricted None",
                description="Test policy",
                guest_invite_settings=InvitationsFrom.NONE.value,
            )

            check = entra_policy_guest_invite_only_for_admin_roles()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                "Guest invitations are restricted to users with specific administrative roles only."
            )
            assert result[0].resource_id == "policy003"
            assert result[0].resource_name == "Auth Policy Restricted None"
            assert result[0].location == "global"
            assert result[0].resource == entra_client.authorization_policy.dict()
```

--------------------------------------------------------------------------------

---[FILE: microsoft365_entra_policy_guest_users_access_restrictions_test.py]---
Location: prowler-master/tests/providers/m365/services/entra/entra_policy_guest_users_access_restrictions/microsoft365_entra_policy_guest_users_access_restrictions_test.py

```python
from unittest import mock

from prowler.providers.m365.services.entra.entra_service import (
    AuthorizationPolicy,
    AuthPolicyRoles,
)
from tests.providers.m365.m365_fixtures import set_mocked_m365_provider


class Test_entra_policy_guest_users_access_restrictions:
    def test_no_auth_policy(self):
        """
        Test when there is no authorization policy (auth_policy is None):
        The check should return a report with FAIL status using default resource values.
        """
        entra_client = mock.MagicMock()
        entra_client.authorization_policy = None

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_policy_guest_users_access_restrictions.entra_policy_guest_users_access_restrictions.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_policy_guest_users_access_restrictions.entra_policy_guest_users_access_restrictions import (
                entra_policy_guest_users_access_restrictions,
            )

            check = entra_policy_guest_users_access_restrictions()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "Guest user access is not restricted to properties and memberships of their own directory objects"
            )
            assert result[0].resource_name == "Authorization Policy"
            assert result[0].resource_id == "authorizationPolicy"
            assert result[0].location == "global"

    def test_auth_policy_fail(self):
        """
        Test when an authorization policy exists but guest_user_role_id does not match
        any of the restricted roles: the check should FAIL.
        """
        entra_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_policy_guest_users_access_restrictions.entra_policy_guest_users_access_restrictions.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_policy_guest_users_access_restrictions.entra_policy_guest_users_access_restrictions import (
                entra_policy_guest_users_access_restrictions,
            )

            entra_client.authorization_policy = AuthorizationPolicy(
                id="policy123",
                name="Auth Policy Test",
                description="Test policy",
                guest_user_role_id=AuthPolicyRoles.USER.value,
            )

            check = entra_policy_guest_users_access_restrictions()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].resource_id == "policy123"
            assert result[0].resource_name == "Auth Policy Test"
            assert result[0].location == "global"
            assert result[0].status_extended == (
                "Guest user access is not restricted to properties and memberships of their own directory objects"
            )
            assert result[0].resource == entra_client.authorization_policy

    def test_auth_policy_pass_restricted(self):
        """
        Test when the authorization policy exists and guest_user_role_id is set to
        AuthPolicyRoles.GUEST_USER_ACCESS_RESTRICTED: the check should PASS.
        """
        entra_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_policy_guest_users_access_restrictions.entra_policy_guest_users_access_restrictions.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_policy_guest_users_access_restrictions.entra_policy_guest_users_access_restrictions import (
                entra_policy_guest_users_access_restrictions,
            )

            entra_client.authorization_policy = AuthorizationPolicy(
                id="policy456",
                name="Auth Policy Restricted",
                description="Test policy",
                guest_user_role_id=AuthPolicyRoles.GUEST_USER_ACCESS_RESTRICTED.value,
            )

            check = entra_policy_guest_users_access_restrictions()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].resource_id == "policy456"
            assert result[0].resource_name == "Auth Policy Restricted"
            assert result[0].location == "global"
            assert result[0].status_extended == (
                "Guest user access is restricted to properties and memberships of their own directory objects"
            )
            assert result[0].resource == entra_client.authorization_policy

    def test_auth_policy_pass_guest_user(self):
        """
        Test when the authorization policy exists and guest_user_role_id is set to
        AuthPolicyRoles.GUEST_USER: the check should PASS.
        """
        entra_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_policy_guest_users_access_restrictions.entra_policy_guest_users_access_restrictions.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_policy_guest_users_access_restrictions.entra_policy_guest_users_access_restrictions import (
                entra_policy_guest_users_access_restrictions,
            )

            entra_client.authorization_policy = AuthorizationPolicy(
                id="policy789",
                name="Auth Policy Guest",
                description="Test policy",
                guest_user_role_id=AuthPolicyRoles.GUEST_USER.value,
            )

            check = entra_policy_guest_users_access_restrictions()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].resource_id == "policy789"
            assert result[0].resource_name == "Auth Policy Guest"
            assert result[0].location == "global"
            assert result[0].status_extended == (
                "Guest user access is restricted to properties and memberships of their own directory objects"
            )
            assert result[0].resource == entra_client.authorization_policy
```

--------------------------------------------------------------------------------

---[FILE: microsoft365_entra_policy_restricts_user_consent_for_apps_test.py]---
Location: prowler-master/tests/providers/m365/services/entra/entra_policy_restricts_user_consent_for_apps/microsoft365_entra_policy_restricts_user_consent_for_apps_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.m365.services.entra.entra_service import (
    AuthorizationPolicy,
    DefaultUserRolePermissions,
)
from tests.providers.m365.m365_fixtures import set_mocked_m365_provider


class Test_entra_policy_restricts_user_consent_for_apps:
    def test_entra_empty_policy(self):
        """
        Test that the check fails when no authorization policy exists.

        This test mocks the 'entra_client.authorization_policy' as an empty dictionary.
        Expected result: The check returns FAIL with the extended message indicating that
        Entra allows users to consent apps accessing company data on their behalf.
        """
        entra_client = mock.MagicMock
        entra_client.authorization_policy = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_policy_restricts_user_consent_for_apps.entra_policy_restricts_user_consent_for_apps.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_policy_restricts_user_consent_for_apps.entra_policy_restricts_user_consent_for_apps import (
                entra_policy_restricts_user_consent_for_apps,
            )

            check = entra_policy_restricts_user_consent_for_apps()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Entra allows users to consent apps accessing company data on their behalf."
            )
            assert result[0].resource == {}
            assert result[0].resource_name == "Authorization Policy"
            assert result[0].resource_id == "authorizationPolicy"
            assert result[0].location == "global"

    def test_entra_policy_allows_user_consent(self):
        """
        Test that the check fails when the authorization policy allows user consent.

        This test mocks the 'entra_client.authorization_policy' with a policy that includes
        a permission grant policy (e.g., "ManagePermissionGrantsForSelf.microsoft-user-default-legacy")
        that allows users to consent apps.
        Expected result: The check returns FAIL with the extended message indicating that
        Entra allows users to consent apps accessing company data on their behalf.
        """
        id = str(uuid4())
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_policy_restricts_user_consent_for_apps.entra_policy_restricts_user_consent_for_apps.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_policy_restricts_user_consent_for_apps.entra_policy_restricts_user_consent_for_apps import (
                entra_policy_restricts_user_consent_for_apps,
            )

            entra_client.authorization_policy = AuthorizationPolicy(
                id=id,
                name="Test Policy",
                description="Test Policy Description",
                default_user_role_permissions=DefaultUserRolePermissions(
                    permission_grant_policies_assigned=[
                        "ManagePermissionGrantsForSelf.microsoft-user-default-legacy"
                    ]
                ),
            )

            check = entra_policy_restricts_user_consent_for_apps()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Entra allows users to consent apps accessing company data on their behalf."
            )
            assert result[0].resource == entra_client.authorization_policy.dict()
            assert result[0].resource_name == "Test Policy"
            assert result[0].resource_id == id
            assert result[0].location == "global"

    def test_entra_policy_restricts_user_consent(self):
        """
        Test that the check passes when the authorization policy restricts user consent.

        This test mocks the 'entra_client.authorization_policy' with a policy that does not include
        any permission grant policy allowing user consent (i.e., it lacks policies containing
        "ManagePermissionGrantsForSelf").
        Expected result: The check returns PASS with the extended message indicating that
        Entra does not allow users to consent apps accessing company data on their behalf.
        """
        id = str(uuid4())
        entra_client = mock.MagicMock

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_policy_restricts_user_consent_for_apps.entra_policy_restricts_user_consent_for_apps.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_policy_restricts_user_consent_for_apps.entra_policy_restricts_user_consent_for_apps import (
                entra_policy_restricts_user_consent_for_apps,
            )

            entra_client.authorization_policy = AuthorizationPolicy(
                id=id,
                name="Test Policy",
                description="Test Policy Description",
                default_user_role_permissions=DefaultUserRolePermissions(
                    permission_grant_policies_assigned=["SomeOtherPolicy"]
                ),
            )

            check = entra_policy_restricts_user_consent_for_apps()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Entra does not allow users to consent apps accessing company data on their behalf."
            )
            assert result[0].resource == entra_client.authorization_policy.dict()
            assert result[0].resource_name == "Test Policy"
            assert result[0].resource_id == id
            assert result[0].location == "global"
```

--------------------------------------------------------------------------------

---[FILE: entra_thirdparty_integrated_apps_not_allowed_test.py]---
Location: prowler-master/tests/providers/m365/services/entra/entra_thirdparty_integrated_apps_not_allowed/entra_thirdparty_integrated_apps_not_allowed_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.m365.services.entra.entra_service import (
    DefaultUserRolePermissions,
)
from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_entra_thirdparty_integrated_apps_not_allowed:
    def test_entra_no_authorization_policy(self):
        entra_client = mock.MagicMock
        entra_client.audited_tenant = "audited_tenant"
        entra_client.audited_domain = DOMAIN
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_thirdparty_integrated_apps_not_allowed.entra_thirdparty_integrated_apps_not_allowed.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_thirdparty_integrated_apps_not_allowed.entra_thirdparty_integrated_apps_not_allowed import (
                entra_thirdparty_integrated_apps_not_allowed,
            )

            entra_client.authorization_policy = None

            check = entra_thirdparty_integrated_apps_not_allowed()
            result = check.execute()
            assert len(result) == 0

    def test_entra_default_user_role_permissions_not_allowed_to_create_apps(self):
        id = str(uuid4())
        entra_client = mock.MagicMock
        entra_client.audited_tenant = "audited_tenant"
        entra_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_thirdparty_integrated_apps_not_allowed.entra_thirdparty_integrated_apps_not_allowed.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_service import (
                AuthorizationPolicy,
            )
            from prowler.providers.m365.services.entra.entra_thirdparty_integrated_apps_not_allowed.entra_thirdparty_integrated_apps_not_allowed import (
                entra_thirdparty_integrated_apps_not_allowed,
            )

            role_permissions = DefaultUserRolePermissions(allowed_to_create_apps=False)
            entra_client.authorization_policy = AuthorizationPolicy(
                id=id,
                name="Test",
                description="Test",
                default_user_role_permissions=role_permissions,
            )

            check = entra_thirdparty_integrated_apps_not_allowed()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "App creation is disabled for non-admin users."
            )
            assert result[0].resource == entra_client.authorization_policy.dict()
            assert result[0].resource_name == "Test"
            assert result[0].resource_id == id
            assert result[0].location == "global"

    def test_entra_default_user_role_permissions_allowed_to_create_apps(self):
        id = str(uuid4())
        entra_client = mock.MagicMock
        entra_client.audited_tenant = "audited_tenant"
        entra_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_thirdparty_integrated_apps_not_allowed.entra_thirdparty_integrated_apps_not_allowed.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_service import (
                AuthorizationPolicy,
            )
            from prowler.providers.m365.services.entra.entra_thirdparty_integrated_apps_not_allowed.entra_thirdparty_integrated_apps_not_allowed import (
                entra_thirdparty_integrated_apps_not_allowed,
            )

            role_permissions = DefaultUserRolePermissions(allowed_to_create_apps=True)
            entra_client.authorization_policy = AuthorizationPolicy(
                id=id,
                name="Test",
                description="Test",
                default_user_role_permissions=role_permissions,
            )

            check = entra_thirdparty_integrated_apps_not_allowed()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "App creation is not disabled for non-admin users."
            )
            assert result[0].resource == entra_client.authorization_policy.dict()
            assert result[0].resource_name == "Test"
            assert result[0].resource_id == id
            assert result[0].location == "global"
```

--------------------------------------------------------------------------------

---[FILE: entra_users_mfa_capable_test.py]---
Location: prowler-master/tests/providers/m365/services/entra/entra_users_mfa_capable/entra_users_mfa_capable_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.m365.services.entra.entra_service import User
from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_entra_users_mfa_capable:
    def test_user_not_mfa_capable(self):
        """User is not MFA capable: expected FAIL."""
        entra_client = mock.MagicMock
        entra_client.audited_tenant = "audited_tenant"
        entra_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_users_mfa_capable.entra_users_mfa_capable.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_users_mfa_capable.entra_users_mfa_capable import (
                entra_users_mfa_capable,
            )

            user_id = str(uuid4())
            entra_client.users = {
                user_id: User(
                    id=user_id,
                    name="Test User",
                    on_premises_sync_enabled=False,
                    directory_roles_ids=[],
                    is_mfa_capable=False,
                    account_enabled=True,
                )
            }

            check = entra_users_mfa_capable()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == "User Test User is not MFA capable."
            assert result[0].resource == entra_client.users[user_id]
            assert result[0].resource_name == "Test User"
            assert result[0].resource_id == user_id

    def test_user_mfa_capable(self):
        """User is MFA capable: expected PASS."""
        entra_client = mock.MagicMock
        entra_client.audited_tenant = "audited_tenant"
        entra_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_users_mfa_capable.entra_users_mfa_capable.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_users_mfa_capable.entra_users_mfa_capable import (
                entra_users_mfa_capable,
            )

            user_id = str(uuid4())
            entra_client.users = {
                user_id: User(
                    id=user_id,
                    name="Test User",
                    on_premises_sync_enabled=False,
                    directory_roles_ids=[],
                    is_mfa_capable=True,
                    account_enabled=True,
                )
            }

            check = entra_users_mfa_capable()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == "User Test User is MFA capable."
            assert result[0].resource == entra_client.users[user_id]
            assert result[0].resource_name == "Test User"
            assert result[0].resource_id == user_id

    def test_multiple_users(self):
        """Multiple users with different MFA capabilities: expected mixed results."""
        entra_client = mock.MagicMock
        entra_client.audited_tenant = "audited_tenant"
        entra_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_users_mfa_capable.entra_users_mfa_capable.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_users_mfa_capable.entra_users_mfa_capable import (
                entra_users_mfa_capable,
            )

            user1_id = str(uuid4())
            user2_id = str(uuid4())
            entra_client.users = {
                user1_id: User(
                    id=user1_id,
                    name="Test User 1",
                    on_premises_sync_enabled=False,
                    directory_roles_ids=[],
                    is_mfa_capable=True,
                    account_enabled=True,
                ),
                user2_id: User(
                    id=user2_id,
                    name="Test User 2",
                    on_premises_sync_enabled=False,
                    directory_roles_ids=[],
                    is_mfa_capable=False,
                    account_enabled=True,
                ),
            }

            check = entra_users_mfa_capable()
            result = check.execute()

            assert len(result) == 2
            # First user (MFA capable)
            assert result[0].status == "PASS"
            assert result[0].status_extended == "User Test User 1 is MFA capable."
            assert result[0].resource == entra_client.users[user1_id]
            assert result[0].resource_name == "Test User 1"
            assert result[0].resource_id == user1_id
            # Second user (not MFA capable)
            assert result[1].status == "FAIL"
            assert result[1].status_extended == "User Test User 2 is not MFA capable."
            assert result[1].resource == entra_client.users[user2_id]
            assert result[1].resource_name == "Test User 2"
            assert result[1].resource_id == user2_id

    def test_disabled_user_not_checked(self):
        """Disabled user should not be checked: expected no results."""
        entra_client = mock.MagicMock
        entra_client.audited_tenant = "audited_tenant"
        entra_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_users_mfa_capable.entra_users_mfa_capable.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_users_mfa_capable.entra_users_mfa_capable import (
                entra_users_mfa_capable,
            )

            user_id = str(uuid4())
            entra_client.users = {
                user_id: User(
                    id=user_id,
                    name="Disabled User",
                    on_premises_sync_enabled=False,
                    directory_roles_ids=[],
                    is_mfa_capable=False,
                    account_enabled=False,  # Disabled user
                )
            }

            check = entra_users_mfa_capable()
            result = check.execute()

            # No results should be returned for disabled users
            assert len(result) == 0

    def test_mixed_enabled_disabled_users(self):
        """Mix of enabled and disabled users: only enabled users should be checked."""
        entra_client = mock.MagicMock
        entra_client.audited_tenant = "audited_tenant"
        entra_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_users_mfa_capable.entra_users_mfa_capable.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_users_mfa_capable.entra_users_mfa_capable import (
                entra_users_mfa_capable,
            )

            enabled_user_id = str(uuid4())
            disabled_user_id = str(uuid4())
            entra_client.users = {
                enabled_user_id: User(
                    id=enabled_user_id,
                    name="Enabled User",
                    on_premises_sync_enabled=False,
                    directory_roles_ids=[],
                    is_mfa_capable=True,
                    account_enabled=True,  # Enabled user
                ),
                disabled_user_id: User(
                    id=disabled_user_id,
                    name="Disabled User",
                    on_premises_sync_enabled=False,
                    directory_roles_ids=[],
                    is_mfa_capable=False,
                    account_enabled=False,  # Disabled user
                ),
            }

            check = entra_users_mfa_capable()
            result = check.execute()

            # Only the enabled user should be checked
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == "User Enabled User is MFA capable."
            assert result[0].resource == entra_client.users[enabled_user_id]
            assert result[0].resource_name == "Enabled User"
            assert result[0].resource_id == enabled_user_id
```

--------------------------------------------------------------------------------

````
