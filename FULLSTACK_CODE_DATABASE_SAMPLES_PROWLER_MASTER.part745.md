---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 745
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 745 of 867)

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

---[FILE: entra_users_mfa_enabled_test.py]---
Location: prowler-master/tests/providers/m365/services/entra/entra_users_mfa_enabled/entra_users_mfa_enabled_test.py

```python
from unittest import mock
from uuid import uuid4

from prowler.providers.m365.services.entra.entra_service import (
    ApplicationsConditions,
    ConditionalAccessGrantControl,
    ConditionalAccessPolicy,
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


class Test_entra_users_mfa_enabled:
    def test_no_conditional_access_policies(self):
        """No conditional access policies configured: expected FAIL."""
        entra_client = mock.MagicMock
        entra_client.audited_tenant = "audited_tenant"
        entra_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_users_mfa_enabled.entra_users_mfa_enabled.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_users_mfa_enabled.entra_users_mfa_enabled import (
                entra_users_mfa_enabled,
            )

            entra_client.conditional_access_policies = {}

            check = entra_users_mfa_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "No Conditional Access Policy enforces MFA for all users."
            )
            assert result[0].resource == {}
            assert result[0].resource_name == "Conditional Access Policies"
            assert result[0].resource_id == "conditionalAccessPolicies"

    def test_policy_disabled(self):
        """Policy in DISABLED state: expected to be ignored and return FAIL."""
        policy_id = str(uuid4())
        entra_client = mock.MagicMock
        entra_client.audited_tenant = "audited_tenant"
        entra_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_users_mfa_enabled.entra_users_mfa_enabled.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_users_mfa_enabled.entra_users_mfa_enabled import (
                entra_users_mfa_enabled,
            )

            entra_client.conditional_access_policies = {
                policy_id: ConditionalAccessPolicy(
                    id=policy_id,
                    display_name="Disabled Policy",
                    conditions=Conditions(
                        application_conditions=ApplicationsConditions(
                            included_applications=["All"],
                            excluded_applications=[],
                            included_user_actions=[],
                        ),
                        user_conditions=UsersConditions(
                            included_groups=[],
                            excluded_groups=[],
                            included_users=["All"],
                            excluded_users=[],
                            included_roles=[],
                            excluded_roles=[],
                        ),
                    ),
                    grant_controls=GrantControls(
                        built_in_controls=[ConditionalAccessGrantControl.MFA],
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
                    state=ConditionalAccessPolicyState.DISABLED,
                )
            }

            check = entra_users_mfa_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "No Conditional Access Policy enforces MFA for all users."
            )
            assert result[0].resource == {}
            assert result[0].resource_name == "Conditional Access Policies"
            assert result[0].resource_id == "conditionalAccessPolicies"

    def test_policy_mfa_enabled_for_report(self):
        """
        Valid policy:
         - State enabled for reporting only
         - Applies to administrative roles via 'All' in included_users
         - Application conditions include "All"
         - MFA is configured in grant_controls

         Expected FAIL due to is only for reporting.
        """
        policy_id = str(uuid4())
        display_name = "Invalid MFA Policy"
        entra_client = mock.MagicMock
        entra_client.audited_tenant = "audited_tenant"
        entra_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_users_mfa_enabled.entra_users_mfa_enabled.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_users_mfa_enabled.entra_users_mfa_enabled import (
                entra_users_mfa_enabled,
            )

            entra_client.conditional_access_policies = {
                policy_id: ConditionalAccessPolicy(
                    id=policy_id,
                    display_name=display_name,
                    conditions=Conditions(
                        application_conditions=ApplicationsConditions(
                            included_applications=["All"],
                            excluded_applications=[],
                            included_user_actions=[],
                        ),
                        user_conditions=UsersConditions(
                            included_groups=[],
                            excluded_groups=[],
                            included_users=["All"],
                            excluded_users=[],
                            included_roles=[],
                            excluded_roles=[],
                        ),
                    ),
                    grant_controls=GrantControls(
                        built_in_controls=[ConditionalAccessGrantControl.MFA],
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

            check = entra_users_mfa_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            expected_status_extended = f"Conditional Access Policy '{display_name}' reports MFA requirement for all users but does not enforce it."
            assert result[0].status_extended == expected_status_extended
            assert result[0].resource == entra_client.conditional_access_policies
            assert result[0].resource_name == display_name
            assert result[0].resource_id == policy_id

    def test_policy_valid_through_roles(self):
        """
        Valid policy:
         - State enabled (ENABLED)
         - Applies to administrative roles
         - Application conditions include "All"
         - MFA is configured in grant_controls

         Expected PASS.
        """
        policy_id = str(uuid4())
        display_name = "Valid MFA Policy"
        entra_client = mock.MagicMock
        entra_client.audited_tenant = "audited_tenant"
        entra_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.services.entra.entra_users_mfa_enabled.entra_users_mfa_enabled.entra_client",
                new=entra_client,
            ),
        ):
            from prowler.providers.m365.services.entra.entra_users_mfa_enabled.entra_users_mfa_enabled import (
                entra_users_mfa_enabled,
            )

            entra_client.conditional_access_policies = {
                policy_id: ConditionalAccessPolicy(
                    id=policy_id,
                    display_name=display_name,
                    conditions=Conditions(
                        application_conditions=ApplicationsConditions(
                            included_applications=["All"],
                            excluded_applications=[],
                            included_user_actions=[],
                        ),
                        user_conditions=UsersConditions(
                            included_groups=[],
                            excluded_groups=[],
                            included_users=["All"],
                            excluded_users=[],
                            included_roles=[],
                            excluded_roles=[],
                        ),
                    ),
                    grant_controls=GrantControls(
                        built_in_controls=[ConditionalAccessGrantControl.MFA],
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

            check = entra_users_mfa_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            expected_status_extended = f"Conditional Access Policy '{display_name}' enforces MFA for all users."
            assert result[0].status_extended == expected_status_extended
            assert result[0].resource == entra_client.conditional_access_policies
            assert result[0].resource_name == display_name
            assert result[0].resource_id == policy_id
```

--------------------------------------------------------------------------------

---[FILE: exchange_service_test.py]---
Location: prowler-master/tests/providers/m365/services/exchange/exchange_service_test.py

```python
from unittest import mock
from unittest.mock import patch

from prowler.providers.m365.models import M365IdentityInfo
from prowler.providers.m365.services.exchange.exchange_service import (
    Exchange,
    ExternalMailConfig,
    MailboxAuditConfig,
    MailboxAuditProperties,
    Organization,
    RoleAssignmentPolicy,
    TransportConfig,
    TransportRule,
)
from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


def mock_exchange_get_organization_config(_):
    return Organization(
        audit_disabled=True,
        name="test",
        guid="test",
        oauth_enabled=True,
        mailtips_enabled=True,
        mailtips_external_recipient_enabled=False,
        mailtips_group_metrics_enabled=True,
        mailtips_large_audience_threshold=25,
    )


def mock_exchange_get_mailbox_audit_config(_):
    return [
        MailboxAuditConfig(name="test", id="test", audit_bypass_enabled=False),
        MailboxAuditConfig(name="test2", id="test2", audit_bypass_enabled=True),
    ]


def mock_exchange_get_external_mail_config(_):
    return [
        ExternalMailConfig(
            identity="test",
            external_mail_tag_enabled=True,
        ),
        ExternalMailConfig(
            identity="test2",
            external_mail_tag_enabled=False,
        ),
    ]


def mock_exchange_get_transport_rules(_):
    return [
        TransportRule(
            name="test",
            scl=-1,
            sender_domain_is=["example.com"],
            redirect_message_to=None,
        ),
        TransportRule(
            name="test2",
            scl=0,
            sender_domain_is=["example.com"],
            redirect_message_to=["test@example.com"],
        ),
    ]


def mock_exchange_get_transport_config(_):
    return TransportConfig(
        smtp_auth_disabled=True,
    )


def mock_exchange_get_role_assignment_policies(_):
    return [
        RoleAssignmentPolicy(
            name="Default Role Assignment Policy",
            id="12345678-1234-1234-1234",
            assigned_roles=[
                "MyProfileInformation",
                "MyDistributionGroupMembership",
                "MyRetentionPolicies",
                "MyDistributionGroups",
                "MyVoiceMail",
            ],
        ),
        RoleAssignmentPolicy(
            name="Test Policy",
            id="12345678-1234-1234",
            assigned_roles=[],
        ),
    ]


def mock_exchange_get_mailbox_audit_properties(_):
    return [
        MailboxAuditProperties(
            name="User1",
            audit_enabled=False,
            audit_admin=[
                "Update",
                "MoveToDeletedItems",
                "SoftDelete",
                "HardDelete",
                "SendAs",
                "SendOnBehalf",
                "Create",
                "UpdateFolderPermissions",
                "UpdateInboxRules",
                "UpdateCalendarDelegation",
                "ApplyRecord",
                "MailItemsAccessed",
                "Send",
            ],
            audit_delegate=[
                "Update",
                "MoveToDeletedItems",
                "SoftDelete",
                "HardDelete",
                "SendAs",
                "SendOnBehalf",
                "Create",
                "UpdateFolderPermissions",
                "UpdateInboxRules",
                "ApplyRecord",
                "MailItemsAccessed",
            ],
            audit_owner=[
                "Update",
                "MoveToDeletedItems",
                "SoftDelete",
                "HardDelete",
                "UpdateFolderPermissions",
                "UpdateInboxRules",
                "UpdateCalendarDelegation",
                "ApplyRecord",
                "MailItemsAccessed",
                "Send",
            ],
            audit_log_age=90,
            identity="test",
        )
    ]


class Test_Exchange_Service:
    def test_get_client(self):
        with (
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
        ):
            exchange_client = Exchange(
                set_mocked_m365_provider(
                    identity=M365IdentityInfo(tenant_domain=DOMAIN)
                )
            )
            assert exchange_client.client.__class__.__name__ == "GraphServiceClient"
            assert exchange_client.powershell.__class__.__name__ == "M365PowerShell"
            exchange_client.powershell.close()

    @patch(
        "prowler.providers.m365.services.exchange.exchange_service.Exchange._get_organization_config",
        new=mock_exchange_get_organization_config,
    )
    def test_get_organization_config(self):
        with (
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
        ):
            exchange_client = Exchange(
                set_mocked_m365_provider(
                    identity=M365IdentityInfo(tenant_domain=DOMAIN)
                )
            )
            organization_config = exchange_client.organization_config
            assert organization_config.name == "test"
            assert organization_config.guid == "test"
            assert organization_config.audit_disabled is True
            assert organization_config.oauth_enabled is True
            assert organization_config.mailtips_enabled is True
            assert organization_config.mailtips_external_recipient_enabled is False
            assert organization_config.mailtips_group_metrics_enabled is True
            assert organization_config.mailtips_large_audience_threshold == 25

            exchange_client.powershell.close()

    @patch(
        "prowler.providers.m365.services.exchange.exchange_service.Exchange._get_mailbox_audit_config",
        new=mock_exchange_get_mailbox_audit_config,
    )
    def test_get_mailbox_audit_config(self):
        with (
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
        ):
            exchange_client = Exchange(
                set_mocked_m365_provider(
                    identity=M365IdentityInfo(tenant_domain=DOMAIN)
                )
            )
            mailbox_audit_config = exchange_client.mailboxes_config
            assert len(mailbox_audit_config) == 2
            assert mailbox_audit_config[0].name == "test"
            assert mailbox_audit_config[0].id == "test"
            assert mailbox_audit_config[0].audit_bypass_enabled is False
            assert mailbox_audit_config[1].name == "test2"
            assert mailbox_audit_config[1].id == "test2"
            assert mailbox_audit_config[1].audit_bypass_enabled is True

            exchange_client.powershell.close()

    @patch(
        "prowler.providers.m365.services.exchange.exchange_service.Exchange._get_external_mail_config",
        new=mock_exchange_get_external_mail_config,
    )
    def test_get_external_mail_config(self):
        with (
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
        ):
            exchange_client = Exchange(
                set_mocked_m365_provider(
                    identity=M365IdentityInfo(tenant_domain=DOMAIN)
                )
            )
            external_mail_config = exchange_client.external_mail_config
            assert len(external_mail_config) == 2
            assert external_mail_config[0].identity == "test"
            assert external_mail_config[0].external_mail_tag_enabled is True
            assert external_mail_config[1].identity == "test2"
            assert external_mail_config[1].external_mail_tag_enabled is False
            exchange_client.powershell.close()

    @patch(
        "prowler.providers.m365.services.exchange.exchange_service.Exchange._get_transport_rules",
        new=mock_exchange_get_transport_rules,
    )
    def test_get_transport_rules(self):
        with (
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
        ):
            exchange_client = Exchange(
                set_mocked_m365_provider(
                    identity=M365IdentityInfo(tenant_domain=DOMAIN)
                )
            )
            transport_rules = exchange_client.transport_rules
            assert len(transport_rules) == 2
            assert transport_rules[0].name == "test"
            assert transport_rules[0].scl == -1
            assert transport_rules[0].sender_domain_is == ["example.com"]
            assert transport_rules[0].redirect_message_to is None
            assert transport_rules[1].name == "test2"
            assert transport_rules[1].scl == 0
            assert transport_rules[1].sender_domain_is == ["example.com"]
            assert transport_rules[1].redirect_message_to == ["test@example.com"]

            exchange_client.powershell.close()

    @patch(
        "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.get_mailbox_policy",
        return_value=[
            {
                "Id": "test",
                "AdditionalStorageProvidersAvailable": True,
            }
        ],
    )
    def test_get_mailbox_policy(self, _mock_get_mailbox_policy):
        with (
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online",
                return_value=True,
            ),
        ):
            exchange_client = Exchange(
                set_mocked_m365_provider(
                    identity=M365IdentityInfo(tenant_domain=DOMAIN)
                )
            )
            mailbox_policies = exchange_client.mailbox_policies
            assert len(mailbox_policies) == 1
            assert mailbox_policies[0].id == "test"
            assert mailbox_policies[0].additional_storage_enabled is True
            exchange_client.powershell.close()

    @patch(
        "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.get_mailbox_policy",
        return_value={
            "Id": "test_single",
            "AdditionalStorageProvidersAvailable": False,
        },
    )
    def test_get_mailbox_policy_single_dict(self, _mock_get_mailbox_policy):
        with (
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online",
                return_value=True,
            ),
        ):
            exchange_client = Exchange(
                set_mocked_m365_provider(
                    identity=M365IdentityInfo(tenant_domain=DOMAIN)
                )
            )
            mailbox_policies = exchange_client.mailbox_policies
            assert len(mailbox_policies) == 1
            assert mailbox_policies[0].id == "test_single"
            assert mailbox_policies[0].additional_storage_enabled is False
            exchange_client.powershell.close()

    @patch(
        "prowler.providers.m365.services.exchange.exchange_service.Exchange._get_transport_config",
        new=mock_exchange_get_transport_config,
    )
    def test_get_transport_config(self):
        with (
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
        ):
            exchange_client = Exchange(
                set_mocked_m365_provider(
                    identity=M365IdentityInfo(tenant_domain=DOMAIN)
                )
            )
            transport_config = exchange_client.transport_config
            assert transport_config.smtp_auth_disabled is True

            exchange_client.powershell.close()

    @patch(
        "prowler.providers.m365.services.exchange.exchange_service.Exchange._get_mailbox_audit_properties",
        new=mock_exchange_get_mailbox_audit_properties,
    )
    def test_get_mailbox_audit_properties(self):
        with (
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
        ):
            exchange_client = Exchange(
                set_mocked_m365_provider(
                    identity=M365IdentityInfo(tenant_domain=DOMAIN)
                )
            )
            mailbox_audit_properties = exchange_client.mailbox_audit_properties
            assert len(mailbox_audit_properties) == 1
            assert mailbox_audit_properties[0].name == "User1"
            assert mailbox_audit_properties[0].audit_enabled is False
            assert mailbox_audit_properties[0].audit_admin == [
                "Update",
                "MoveToDeletedItems",
                "SoftDelete",
                "HardDelete",
                "SendAs",
                "SendOnBehalf",
                "Create",
                "UpdateFolderPermissions",
                "UpdateInboxRules",
                "UpdateCalendarDelegation",
                "ApplyRecord",
                "MailItemsAccessed",
                "Send",
            ]
            assert mailbox_audit_properties[0].audit_delegate == [
                "Update",
                "MoveToDeletedItems",
                "SoftDelete",
                "HardDelete",
                "SendAs",
                "SendOnBehalf",
                "Create",
                "UpdateFolderPermissions",
                "UpdateInboxRules",
                "ApplyRecord",
                "MailItemsAccessed",
            ]
            assert mailbox_audit_properties[0].audit_owner == [
                "Update",
                "MoveToDeletedItems",
                "SoftDelete",
                "HardDelete",
                "UpdateFolderPermissions",
                "UpdateInboxRules",
                "UpdateCalendarDelegation",
                "ApplyRecord",
                "MailItemsAccessed",
                "Send",
            ]
            assert mailbox_audit_properties[0].audit_log_age == 90
            assert mailbox_audit_properties[0].identity == "test"
            exchange_client.powershell.close()

    @patch(
        "prowler.providers.m365.services.exchange.exchange_service.Exchange._get_role_assignment_policies",
        new=mock_exchange_get_role_assignment_policies,
    )
    def test_get_role_assignment_policies(self):
        with (
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
        ):
            exchange_client = Exchange(
                set_mocked_m365_provider(
                    identity=M365IdentityInfo(tenant_domain=DOMAIN)
                )
            )
            role_assignment_policies = exchange_client.role_assignment_policies
            assert len(role_assignment_policies) == 2
            assert role_assignment_policies[0].name == "Default Role Assignment Policy"
            assert role_assignment_policies[0].id == "12345678-1234-1234-1234"
            assert role_assignment_policies[0].assigned_roles == [
                "MyProfileInformation",
                "MyDistributionGroupMembership",
                "MyRetentionPolicies",
                "MyDistributionGroups",
                "MyVoiceMail",
            ]
            assert role_assignment_policies[1].name == "Test Policy"
            assert role_assignment_policies[1].id == "12345678-1234-1234"
            assert role_assignment_policies[1].assigned_roles == []

            exchange_client.powershell.close()
```

--------------------------------------------------------------------------------

---[FILE: exchange_external_email_tagging_enabled_test.py]---
Location: prowler-master/tests/providers/m365/services/exchange/exchange_external_email_tagging_enabled/exchange_external_email_tagging_enabled_test.py

```python
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_exchange_external_email_tagging_enabled:
    def test_external_tagging_enabled(self):
        exchange_client = mock.MagicMock()
        exchange_client.audited_tenant = "audited_tenant"
        exchange_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.exchange.exchange_external_email_tagging_enabled.exchange_external_email_tagging_enabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_external_email_tagging_enabled.exchange_external_email_tagging_enabled import (
                exchange_external_email_tagging_enabled,
            )
            from prowler.providers.m365.services.exchange.exchange_service import (
                ExternalMailConfig,
            )

            exchange_client.external_mail_config = [
                ExternalMailConfig(identity="Org1", external_mail_tag_enabled=True)
            ]

            check = exchange_external_email_tagging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "External sender tagging is enabled for Exchange identity Org1."
            )
            assert result[0].resource == exchange_client.external_mail_config[0].dict()
            assert result[0].resource_name == "Org1"
            assert result[0].resource_id == "Org1"
            assert result[0].location == "global"

    def test_external_tagging_disabled(self):
        exchange_client = mock.MagicMock()
        exchange_client.audited_tenant = "audited_tenant"
        exchange_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.exchange.exchange_external_email_tagging_enabled.exchange_external_email_tagging_enabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_external_email_tagging_enabled.exchange_external_email_tagging_enabled import (
                exchange_external_email_tagging_enabled,
            )
            from prowler.providers.m365.services.exchange.exchange_service import (
                ExternalMailConfig,
            )

            exchange_client.external_mail_config = [
                ExternalMailConfig(identity="Org2", external_mail_tag_enabled=False)
            ]

            check = exchange_external_email_tagging_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "External sender tagging is disabled for Exchange identity Org2."
            )
            assert result[0].resource == exchange_client.external_mail_config[0].dict()
            assert result[0].resource_name == "Org2"
            assert result[0].resource_id == "Org2"
            assert result[0].location == "global"

    def test_multiple_configs_mixed_status(self):
        exchange_client = mock.MagicMock()
        exchange_client.audited_tenant = "audited_tenant"
        exchange_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.exchange.exchange_external_email_tagging_enabled.exchange_external_email_tagging_enabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_external_email_tagging_enabled.exchange_external_email_tagging_enabled import (
                exchange_external_email_tagging_enabled,
            )
            from prowler.providers.m365.services.exchange.exchange_service import (
                ExternalMailConfig,
            )

            exchange_client.external_mail_config = [
                ExternalMailConfig(
                    identity="OrgEnabled", external_mail_tag_enabled=True
                ),
                ExternalMailConfig(
                    identity="OrgDisabled", external_mail_tag_enabled=False
                ),
            ]

            check = exchange_external_email_tagging_enabled()
            result = check.execute()

            assert len(result) == 2

            assert result[0].status == "PASS"
            assert result[0].resource_name == "OrgEnabled"
            assert (
                result[0].status_extended
                == "External sender tagging is enabled for Exchange identity OrgEnabled."
            )

            assert result[1].status == "FAIL"
            assert result[1].resource_name == "OrgDisabled"
            assert (
                result[1].status_extended
                == "External sender tagging is disabled for Exchange identity OrgDisabled."
            )

    def test_no_mail_configs(self):
        exchange_client = mock.MagicMock()
        exchange_client.audited_tenant = "audited_tenant"
        exchange_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.exchange.exchange_external_email_tagging_enabled.exchange_external_email_tagging_enabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_external_email_tagging_enabled.exchange_external_email_tagging_enabled import (
                exchange_external_email_tagging_enabled,
            )

            exchange_client.external_mail_config = []

            check = exchange_external_email_tagging_enabled()
            result = check.execute()

            assert len(result) == 0
```

--------------------------------------------------------------------------------

````
