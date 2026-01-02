---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 736
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 736 of 867)

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

---[FILE: microsoft365_entra_service_test.py]---
Location: prowler-master/tests/providers/m365/services/entra/microsoft365_entra_service_test.py

```python
import asyncio
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock, patch

from prowler.providers.m365.models import M365IdentityInfo
from prowler.providers.m365.services.entra.entra_service import (
    AdminConsentPolicy,
    AdminRoles,
    ApplicationsConditions,
    AuthorizationPolicy,
    AuthPolicyRoles,
    ConditionalAccessGrantControl,
    ConditionalAccessPolicy,
    ConditionalAccessPolicyState,
    Conditions,
    DefaultUserRolePermissions,
    Entra,
    GrantControlOperator,
    GrantControls,
    InvitationsFrom,
    Organization,
    PersistentBrowser,
    SessionControls,
    SignInFrequency,
    SignInFrequencyInterval,
    SignInFrequencyType,
    User,
    UserAction,
    UsersConditions,
)
from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


async def mock_entra_get_authorization_policy(_):
    return AuthorizationPolicy(
        id="id-1",
        name="Name 1",
        description="Description 1",
        default_user_role_permissions=DefaultUserRolePermissions(
            allowed_to_create_apps=True,
            allowed_to_create_security_groups=True,
            allowed_to_create_tenants=True,
            allowed_to_read_bitlocker_keys_for_owned_device=True,
            allowed_to_read_other_users=True,
        ),
        guest_invite_settings=InvitationsFrom.ADMINS_AND_GUEST_INVITERS.value,
        guest_user_role_id=AuthPolicyRoles.GUEST_USER_ACCESS_RESTRICTED.value,
    )


async def mock_entra_get_conditional_access_policies(_):
    return {
        "id-1": ConditionalAccessPolicy(
            id="id-1",
            display_name="Name 1",
            conditions=Conditions(
                application_conditions=ApplicationsConditions(
                    included_applications=["app-1", "app-2"],
                    excluded_applications=["app-3", "app-4"],
                    included_user_actions=[UserAction.REGISTER_SECURITY_INFO],
                ),
                user_conditions=UsersConditions(
                    included_groups=["group-1", "group-2"],
                    excluded_groups=["group-3", "group-4"],
                    included_users=["user-1", "user-2"],
                    excluded_users=["user-3", "user-4"],
                    included_roles=["role-1", "role-2"],
                    excluded_roles=["role-3", "role-4"],
                ),
            ),
            grant_controls=GrantControls(
                built_in_controls=[
                    ConditionalAccessGrantControl.BLOCK,
                    ConditionalAccessGrantControl.COMPLIANT_DEVICE,
                ],
                operator=GrantControlOperator.OR,
                authentication_strength="Phishing-resistant MFA",
            ),
            session_controls=SessionControls(
                persistent_browser=PersistentBrowser(
                    is_enabled=True,
                    mode="always",
                ),
                sign_in_frequency=SignInFrequency(
                    is_enabled=True,
                    frequency=24,
                    type=SignInFrequencyType.HOURS,
                    interval=SignInFrequencyInterval.TIME_BASED,
                ),
            ),
            state=ConditionalAccessPolicyState.ENABLED_FOR_REPORTING,
        )
    }


async def mock_entra_get_groups(_):
    group1 = {
        "id": "id-1",
        "name": "group1",
        "groupTypes": ["DynamicMembership"],
        "membershipRule": 'user.userType -eq "Guest"',
    }
    group2 = {
        "id": "id-2",
        "name": "group2",
        "groupTypes": ["Assigned"],
        "membershipRule": "",
    }
    return [group1, group2]


async def mock_entra_get_admin_consent_policy(_):
    return AdminConsentPolicy(
        admin_consent_enabled=True,
        notify_reviewers=True,
        email_reminders_to_reviewers=False,
        duration_in_days=30,
    )


async def mock_entra_get_users(_):
    return {
        "user-1": User(
            id="user-1",
            name="User 1",
            directory_roles_ids=[AdminRoles.GLOBAL_ADMINISTRATOR.value],
            on_premises_sync_enabled=True,
            is_mfa_capable=True,
        ),
        "user-2": User(
            id="user-2",
            name="User 2",
            directory_roles_ids=[AdminRoles.GLOBAL_ADMINISTRATOR.value],
            on_premises_sync_enabled=False,
            is_mfa_capable=False,
        ),
        "user-3": User(
            id="user-3",
            name="User 3",
            directory_roles_ids=[AdminRoles.GLOBAL_ADMINISTRATOR.value],
            on_premises_sync_enabled=True,
            is_mfa_capable=False,
        ),
    }


async def mock_entra_get_organization(_):
    return [
        Organization(
            id="org1",
            name="Organization 1",
            on_premises_sync_enabled=True,
        )
    ]


class Test_Entra_Service:
    def test_get_client(self):
        with patch("prowler.providers.m365.lib.service.service.M365PowerShell"):
            admincenter_client = Entra(
                set_mocked_m365_provider(
                    identity=M365IdentityInfo(tenant_domain=DOMAIN)
                )
            )
            assert admincenter_client.client.__class__.__name__ == "GraphServiceClient"

    @patch(
        "prowler.providers.m365.services.entra.entra_service.Entra._get_authorization_policy",
        new=mock_entra_get_authorization_policy,
    )
    def test_get_authorization_policy(self):
        with patch("prowler.providers.m365.lib.service.service.M365PowerShell"):
            entra_client = Entra(set_mocked_m365_provider())
        assert entra_client.authorization_policy.id == "id-1"
        assert entra_client.authorization_policy.name == "Name 1"
        assert entra_client.authorization_policy.description == "Description 1"
        assert (
            entra_client.authorization_policy.default_user_role_permissions
            == DefaultUserRolePermissions(
                allowed_to_create_apps=True,
                allowed_to_create_security_groups=True,
                allowed_to_create_tenants=True,
                allowed_to_read_bitlocker_keys_for_owned_device=True,
                allowed_to_read_other_users=True,
            )
        )
        assert (
            entra_client.authorization_policy.guest_invite_settings
            == InvitationsFrom.ADMINS_AND_GUEST_INVITERS.value
        )
        assert (
            entra_client.authorization_policy.guest_user_role_id
            == AuthPolicyRoles.GUEST_USER_ACCESS_RESTRICTED.value
        )

    @patch(
        "prowler.providers.m365.services.entra.entra_service.Entra._get_conditional_access_policies",
        new=mock_entra_get_conditional_access_policies,
    )
    def test_get_conditional_access_policies(self):
        with patch("prowler.providers.m365.lib.service.service.M365PowerShell"):
            entra_client = Entra(set_mocked_m365_provider())
        assert entra_client.conditional_access_policies == {
            "id-1": ConditionalAccessPolicy(
                id="id-1",
                display_name="Name 1",
                conditions=Conditions(
                    application_conditions=ApplicationsConditions(
                        included_applications=["app-1", "app-2"],
                        excluded_applications=["app-3", "app-4"],
                        included_user_actions=[UserAction.REGISTER_SECURITY_INFO],
                    ),
                    user_conditions=UsersConditions(
                        included_groups=["group-1", "group-2"],
                        excluded_groups=["group-3", "group-4"],
                        included_users=["user-1", "user-2"],
                        excluded_users=["user-3", "user-4"],
                        included_roles=["role-1", "role-2"],
                        excluded_roles=["role-3", "role-4"],
                    ),
                ),
                grant_controls=GrantControls(
                    built_in_controls=[
                        ConditionalAccessGrantControl.BLOCK,
                        ConditionalAccessGrantControl.COMPLIANT_DEVICE,
                    ],
                    operator=GrantControlOperator.OR,
                    authentication_strength="Phishing-resistant MFA",
                ),
                session_controls=SessionControls(
                    persistent_browser=PersistentBrowser(
                        is_enabled=True,
                        mode="always",
                    ),
                    sign_in_frequency=SignInFrequency(
                        is_enabled=True,
                        frequency=24,
                        type=SignInFrequencyType.HOURS,
                        interval=SignInFrequencyInterval.TIME_BASED,
                    ),
                ),
                state=ConditionalAccessPolicyState.ENABLED_FOR_REPORTING,
            )
        }

    @patch(
        "prowler.providers.m365.services.entra.entra_service.Entra._get_groups",
        new=mock_entra_get_groups,
    )
    def test_get_groups(self):
        with patch("prowler.providers.m365.lib.service.service.M365PowerShell"):
            entra_client = Entra(set_mocked_m365_provider())
        assert len(entra_client.groups) == 2
        assert entra_client.groups[0]["id"] == "id-1"
        assert entra_client.groups[0]["name"] == "group1"
        assert entra_client.groups[0]["groupTypes"] == ["DynamicMembership"]
        assert entra_client.groups[0]["membershipRule"] == 'user.userType -eq "Guest"'
        assert entra_client.groups[1]["id"] == "id-2"
        assert entra_client.groups[1]["name"] == "group2"
        assert entra_client.groups[1]["groupTypes"] == ["Assigned"]
        assert entra_client.groups[1]["membershipRule"] == ""

    @patch(
        "prowler.providers.m365.services.entra.entra_service.Entra._get_admin_consent_policy",
        new=mock_entra_get_admin_consent_policy,
    )
    def test_get_admin_consent_policy(self):
        with patch("prowler.providers.m365.lib.service.service.M365PowerShell"):
            entra_client = Entra(set_mocked_m365_provider())
        assert entra_client.admin_consent_policy.admin_consent_enabled
        assert entra_client.admin_consent_policy.notify_reviewers
        assert entra_client.admin_consent_policy.email_reminders_to_reviewers is False
        assert entra_client.admin_consent_policy.duration_in_days == 30

    @patch(
        "prowler.providers.m365.services.entra.entra_service.Entra._get_organization",
        new=mock_entra_get_organization,
    )
    def test_get_organization(self):
        with patch("prowler.providers.m365.lib.service.service.M365PowerShell"):
            entra_client = Entra(set_mocked_m365_provider())
        assert len(entra_client.organizations) == 1
        assert entra_client.organizations[0].id == "org1"
        assert entra_client.organizations[0].name == "Organization 1"
        assert entra_client.organizations[0].on_premises_sync_enabled

    @patch(
        "prowler.providers.m365.services.entra.entra_service.Entra._get_users",
        new=mock_entra_get_users,
    )
    def test_get_users(self):
        with patch("prowler.providers.m365.lib.service.service.M365PowerShell"):
            entra_client = Entra(set_mocked_m365_provider())
        assert len(entra_client.users) == 3
        assert entra_client.users["user-1"].id == "user-1"
        assert entra_client.users["user-1"].name == "User 1"
        assert entra_client.users["user-1"].directory_roles_ids == [
            AdminRoles.GLOBAL_ADMINISTRATOR.value
        ]
        assert entra_client.users["user-1"].is_mfa_capable
        assert entra_client.users["user-1"].on_premises_sync_enabled
        assert entra_client.users["user-2"].id == "user-2"
        assert entra_client.users["user-2"].name == "User 2"
        assert entra_client.users["user-2"].directory_roles_ids == [
            AdminRoles.GLOBAL_ADMINISTRATOR.value
        ]
        assert not entra_client.users["user-2"].is_mfa_capable
        assert not entra_client.users["user-2"].on_premises_sync_enabled
        assert entra_client.users["user-3"].id == "user-3"
        assert entra_client.users["user-3"].name == "User 3"
        assert entra_client.users["user-3"].directory_roles_ids == [
            AdminRoles.GLOBAL_ADMINISTRATOR.value
        ]
        assert entra_client.users["user-3"].on_premises_sync_enabled
        assert not entra_client.users["user-3"].is_mfa_capable

    def test__get_users_paginates_through_next_links(self):
        entra_service = Entra.__new__(Entra)
        entra_service.user_accounts_status = {"user-6": {"AccountDisabled": True}}

        users_page_one = [
            SimpleNamespace(
                id="user-1",
                display_name="User 1",
                on_premises_sync_enabled=True,
            ),
            SimpleNamespace(
                id="user-2",
                display_name="User 2",
                on_premises_sync_enabled=False,
            ),
            SimpleNamespace(
                id="user-3",
                display_name="User 3",
                on_premises_sync_enabled=None,
            ),
            SimpleNamespace(
                id="user-4",
                display_name="User 4",
                on_premises_sync_enabled=True,
            ),
            SimpleNamespace(
                id="user-5",
                display_name="User 5",
                on_premises_sync_enabled=False,
            ),
        ]
        users_page_two = [
            SimpleNamespace(
                id="user-6",
                display_name="User 6",
                on_premises_sync_enabled=True,
            )
        ]

        users_response_page_one = SimpleNamespace(
            value=users_page_one,
            odata_next_link="next-link",
        )
        users_response_page_two = SimpleNamespace(
            value=users_page_two,
            odata_next_link=None,
        )

        users_with_url_builder = SimpleNamespace(
            get=AsyncMock(return_value=users_response_page_two)
        )
        with_url_mock = MagicMock(return_value=users_with_url_builder)

        users_builder = SimpleNamespace(
            get=AsyncMock(return_value=users_response_page_one),
            with_url=with_url_mock,
        )

        role_members_response = SimpleNamespace(
            value=[
                SimpleNamespace(id="user-1"),
                SimpleNamespace(id="user-6"),
            ]
        )
        members_builder = SimpleNamespace(
            get=AsyncMock(return_value=role_members_response)
        )
        directory_roles_builder = SimpleNamespace(
            get=AsyncMock(
                return_value=SimpleNamespace(
                    value=[
                        SimpleNamespace(
                            id="role-1",
                            role_template_id="role-template-1",
                        )
                    ]
                )
            ),
            by_directory_role_id=MagicMock(
                return_value=SimpleNamespace(members=members_builder)
            ),
        )

        registration_details_response = SimpleNamespace(
            value=[
                SimpleNamespace(id="user-1", is_mfa_capable=True),
                SimpleNamespace(id="user-6", is_mfa_capable=True),
            ]
        )
        registration_details_builder = SimpleNamespace(
            get=AsyncMock(return_value=registration_details_response)
        )
        reports_builder = SimpleNamespace(
            authentication_methods=SimpleNamespace(
                user_registration_details=registration_details_builder
            )
        )

        entra_service.client = SimpleNamespace(
            users=users_builder,
            directory_roles=directory_roles_builder,
            reports=reports_builder,
        )

        users = asyncio.run(entra_service._get_users())

        assert len(users) == 6
        assert users_builder.get.await_count == 1
        assert users_builder.get.await_args.kwargs == {}
        with_url_mock.assert_called_once_with("next-link")
        assert users["user-1"].directory_roles_ids == ["role-template-1"]
        assert users["user-6"].directory_roles_ids == ["role-template-1"]
        assert users["user-6"].account_enabled is False
        assert users["user-1"].is_mfa_capable is True
        assert users["user-2"].is_mfa_capable is False
```

--------------------------------------------------------------------------------

---[FILE: entra_admin_consent_workflow_enabled_test.py]---
Location: prowler-master/tests/providers/m365/services/entra/entra_admin_consent_workflow_enabled/entra_admin_consent_workflow_enabled_test.py

```python
from unittest import mock

from prowler.providers.m365.services.entra.entra_service import AdminConsentPolicy
from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_entra_admin_consent_workflow_enabled:
    def test_admin_consent_enabled(self):
        """
        Test when admin_consent_enabled is True:
        The check should PASS because the admin consent workflow is enabled.
        """
        entra_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_admin_consent_workflow_enabled.entra_admin_consent_workflow_enabled.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_admin_consent_workflow_enabled.entra_admin_consent_workflow_enabled import (
                entra_admin_consent_workflow_enabled,
            )

            entra_client.admin_consent_policy = AdminConsentPolicy(
                admin_consent_enabled=True,
                notify_reviewers=True,
                email_reminders_to_reviewers=False,
                duration_in_days=30,
            )
            entra_client.tenant_domain = DOMAIN

            check = entra_admin_consent_workflow_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                "The admin consent workflow is enabled in Microsoft Entra, allowing users to request admin approval for applications. Reviewers will be notified."
            )
            assert result[0].resource_id == DOMAIN
            assert result[0].location == "global"
            assert result[0].resource_name == "Admin Consent Policy"
            assert result[0].resource == entra_client.admin_consent_policy.dict()

    def test_admin_consent_enabled_without_notifications(self):
        """
        Test when admin_consent_enabled is True:
        The check should PASS because the admin consent workflow is enabled.
        """
        entra_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_admin_consent_workflow_enabled.entra_admin_consent_workflow_enabled.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_admin_consent_workflow_enabled.entra_admin_consent_workflow_enabled import (
                entra_admin_consent_workflow_enabled,
            )

            entra_client.admin_consent_policy = AdminConsentPolicy(
                admin_consent_enabled=True,
                notify_reviewers=False,
                email_reminders_to_reviewers=False,
                duration_in_days=30,
            )
            entra_client.tenant_domain = DOMAIN

            check = entra_admin_consent_workflow_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == (
                "The admin consent workflow is enabled in Microsoft Entra, allowing users to request admin approval for applications. Reviewers will not be notified, we recommend notifying them."
            )
            assert result[0].resource_id == DOMAIN
            assert result[0].location == "global"
            assert result[0].resource_name == "Admin Consent Policy"
            assert result[0].resource == entra_client.admin_consent_policy.dict()

    def test_admin_consent_disabled(self):
        """
        Test when admin_consent_enabled is False:
        The check should FAIL because the admin consent workflow is not enabled.
        """
        entra_client = mock.MagicMock()

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_admin_consent_workflow_enabled.entra_admin_consent_workflow_enabled.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_admin_consent_workflow_enabled.entra_admin_consent_workflow_enabled import (
                entra_admin_consent_workflow_enabled,
            )

            entra_client.admin_consent_policy = AdminConsentPolicy(
                admin_consent_enabled=False,
                notify_reviewers=True,
                email_reminders_to_reviewers=False,
                duration_in_days=30,
            )
            entra_client.tenant_domain = DOMAIN

            check = entra_admin_consent_workflow_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == (
                "The admin consent workflow is not enabled in Microsoft Entra; users may be blocked from accessing applications that require admin consent."
            )
            assert result[0].resource_id == DOMAIN
            assert result[0].location == "global"
            assert result[0].resource_name == "Admin Consent Policy"
            assert result[0].resource == entra_client.admin_consent_policy.dict()

    def test_no_policy(self):
        """
        Test when entra_client.admin_consent_policy is None:
        The check should return an empty list of findings.
        """
        entra_client = mock.MagicMock()
        entra_client.admin_consent_policy = None
        entra_client.tenant_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_admin_consent_workflow_enabled.entra_admin_consent_workflow_enabled.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_admin_consent_workflow_enabled.entra_admin_consent_workflow_enabled import (
                entra_admin_consent_workflow_enabled,
            )

            check = entra_admin_consent_workflow_enabled()
            result = check.execute()

            assert len(result) == 0
            assert result == []
```

--------------------------------------------------------------------------------

---[FILE: entra_admin_portals_access_restriction_test.py]---
Location: prowler-master/tests/providers/m365/services/entra/entra_admin_portals_access_restriction/entra_admin_portals_access_restriction_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.m365.services.entra.entra_service import (
    ApplicationsConditions,
    ConditionalAccessGrantControl,
    ConditionalAccessPolicyState,
    Conditions,
    GrantControlOperator,
    GrantControls,
    PersistentBrowser,
    SessionControls,
    SignInFrequency,
    SignInFrequencyInterval,
    UsersConditions,
)
from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_entra_admin_portals_access_restriction:
    def test_entra_no_conditional_access_policies(self):
        entra_client = mock.MagicMock
        entra_client.audited_tenant = "audited_tenant"
        entra_client.audited_domain = DOMAIN
        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_admin_portals_access_restriction.entra_admin_portals_access_restriction.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_admin_portals_access_restriction.entra_admin_portals_access_restriction import (
                entra_admin_portals_access_restriction,
            )

            entra_client.conditional_access_policies = {}

            check = entra_admin_portals_access_restriction()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "No Conditional Access Policy limits Entra Admin Center access to administrative roles."
            )
            assert result[0].resource == {}
            assert result[0].resource_name == "Conditional Access Policies"
            assert result[0].resource_id == "conditionalAccessPolicies"
            assert result[0].location == "global"

    def test_entra_admin_center_limited_access_disabled(self):
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
                "prowler.providers.m365.services.entra.entra_admin_portals_access_restriction.entra_admin_portals_access_restriction.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_admin_portals_access_restriction.entra_admin_portals_access_restriction import (
                entra_admin_portals_access_restriction,
            )
            from prowler.providers.m365.services.entra.entra_service import (
                ConditionalAccessPolicy,
            )

            entra_client.conditional_access_policies = {
                id: ConditionalAccessPolicy(
                    id=id,
                    display_name="Test",
                    conditions=Conditions(
                        application_conditions=ApplicationsConditions(
                            included_applications=[],
                            excluded_applications=[],
                            included_user_actions=[],
                        ),
                        user_conditions=UsersConditions(
                            included_groups=[],
                            excluded_groups=[],
                            included_users=[],
                            excluded_users=[],
                            included_roles=[],
                            excluded_roles=[],
                        ),
                    ),
                    grant_controls=GrantControls(
                        built_in_controls=[], operator=GrantControlOperator.AND
                    ),
                    session_controls=SessionControls(
                        persistent_browser=PersistentBrowser(
                            is_enabled=False, mode="always"
                        ),
                        sign_in_frequency=SignInFrequency(
                            is_enabled=False,
                            frequency=None,
                            type=None,
                            interval=SignInFrequencyInterval.EVERY_TIME,
                        ),
                    ),
                    state=ConditionalAccessPolicyState.DISABLED,
                )
            }

            check = entra_admin_portals_access_restriction()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "No Conditional Access Policy limits Entra Admin Center access to administrative roles."
            )
            assert result[0].resource == {}
            assert result[0].resource_name == "Conditional Access Policies"
            assert result[0].resource_id == "conditionalAccessPolicies"
            assert result[0].location == "global"

    def test_entra_admin_center_limited_access_enabled_for_reporting(self):
        id = str(uuid4())
        display_name = "Test"
        entra_client = mock.MagicMock
        entra_client.audited_tenant = "audited_tenant"
        entra_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_admin_portals_access_restriction.entra_admin_portals_access_restriction.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_admin_portals_access_restriction.entra_admin_portals_access_restriction import (
                entra_admin_portals_access_restriction,
            )
            from prowler.providers.m365.services.entra.entra_service import (
                ConditionalAccessPolicy,
            )

            entra_client.conditional_access_policies = {
                id: ConditionalAccessPolicy(
                    id=id,
                    display_name=display_name,
                    conditions=Conditions(
                        application_conditions=ApplicationsConditions(
                            included_applications=["MicrosoftAdminPortals"],
                            excluded_applications=[],
                            included_user_actions=[],
                        ),
                        user_conditions=UsersConditions(
                            included_groups=[],
                            excluded_groups=[],
                            included_users=["All"],
                            excluded_users=[],
                            included_roles=[],
                            excluded_roles=["9b895d92-2cd3-44c7-9d02-a6ac2d5ea5c3"],
                        ),
                    ),
                    grant_controls=GrantControls(
                        built_in_controls=[ConditionalAccessGrantControl.BLOCK],
                        operator=GrantControlOperator.AND,
                    ),
                    session_controls=SessionControls(
                        persistent_browser=PersistentBrowser(
                            is_enabled=False, mode="always"
                        ),
                        sign_in_frequency=SignInFrequency(
                            is_enabled=False,
                            frequency=None,
                            type=None,
                            interval=SignInFrequencyInterval.EVERY_TIME,
                        ),
                    ),
                    state=ConditionalAccessPolicyState.ENABLED_FOR_REPORTING,
                )
            }

            check = entra_admin_portals_access_restriction()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == f"Conditional Access Policy '{display_name}' reports Entra Admin Center access to administrative roles but does not limit it."
            )
            assert (
                result[0].resource
                == entra_client.conditional_access_policies[id].dict()
            )
            assert result[0].resource_name == display_name
            assert result[0].resource_id == id
            assert result[0].location == "global"

    def test_entra_admin_center_limited_access_enabled(self):
        id = str(uuid4())
        display_name = "Test"
        entra_client = mock.MagicMock
        entra_client.audited_tenant = "audited_tenant"
        entra_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_admin_portals_access_restriction.entra_admin_portals_access_restriction.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_admin_portals_access_restriction.entra_admin_portals_access_restriction import (
                entra_admin_portals_access_restriction,
            )
            from prowler.providers.m365.services.entra.entra_service import (
                ConditionalAccessPolicy,
            )

            entra_client.conditional_access_policies = {
                id: ConditionalAccessPolicy(
                    id=id,
                    display_name=display_name,
                    conditions=Conditions(
                        application_conditions=ApplicationsConditions(
                            included_applications=["MicrosoftAdminPortals"],
                            excluded_applications=[],
                            included_user_actions=[],
                        ),
                        user_conditions=UsersConditions(
                            included_groups=[],
                            excluded_groups=[],
                            included_users=["All"],
                            excluded_users=[],
                            included_roles=[],
                            excluded_roles=["9b895d92-2cd3-44c7-9d02-a6ac2d5ea5c3"],
                        ),
                    ),
                    grant_controls=GrantControls(
                        built_in_controls=[ConditionalAccessGrantControl.BLOCK],
                        operator=GrantControlOperator.AND,
                    ),
                    session_controls=SessionControls(
                        persistent_browser=PersistentBrowser(
                            is_enabled=False, mode="always"
                        ),
                        sign_in_frequency=SignInFrequency(
                            is_enabled=False,
                            frequency=None,
                            type=None,
                            interval=SignInFrequencyInterval.EVERY_TIME,
                        ),
                    ),
                    state=ConditionalAccessPolicyState.ENABLED,
                )
            }

            check = entra_admin_portals_access_restriction()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == f"Conditional Access Policy '{display_name}' limits Entra Admin Center access to administrative roles."
            )
            assert (
                result[0].resource
                == entra_client.conditional_access_policies[id].dict()
            )
            assert result[0].resource_name == display_name
            assert result[0].resource_id == id
            assert result[0].location == "global"
```

--------------------------------------------------------------------------------

````
