---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 735
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 735 of 867)

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

---[FILE: defender_malware_policy_comprehensive_attachments_filter_applied_test.py]---
Location: prowler-master/tests/providers/m365/services/defender/defender_malware_policy_comprehensive_attachments_filter_applied/defender_malware_policy_comprehensive_attachments_filter_applied_test.py

```python
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_defender_malware_policy_comprehensive_attachments_filter_applied:
    def test_case_1_default_policy_properly_configured(self):
        defender_client = mock.MagicMock()
        defender_client.audited_tenant = "audited_tenant"
        defender_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.defender.defender_malware_policy_comprehensive_attachments_filter_applied.defender_malware_policy_comprehensive_attachments_filter_applied.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.m365.services.defender.defender_malware_policy_comprehensive_attachments_filter_applied.defender_malware_policy_comprehensive_attachments_filter_applied import (
                defender_malware_policy_comprehensive_attachments_filter_applied,
            )
            from prowler.providers.m365.services.defender.defender_service import (
                MalwarePolicy,
            )

            defender_client.audit_config = {
                "recommended_blocked_file_types": ["exe", "bat", "js"]
            }
            defender_client.malware_policies = [
                MalwarePolicy(
                    identity="Default",
                    enable_file_filter=True,
                    enable_internal_sender_admin_notifications=True,
                    internal_sender_admin_address="admin@example.com",
                    file_types=["exe", "bat", "js"],
                    is_default=True,
                )
            ]
            defender_client.malware_rules = {}

            check = defender_malware_policy_comprehensive_attachments_filter_applied()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Default is the only policy and Common Attachment Types Filter is properly configured."
            )
            assert result[0].resource_name == "Default"
            assert result[0].resource_id == "Default"
            assert result[0].resource == defender_client.malware_policies[0].dict()

    def test_case_2_all_policies_properly_configured(self):
        defender_client = mock.MagicMock()
        defender_client.audited_tenant = "audited_tenant"
        defender_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.defender.defender_malware_policy_comprehensive_attachments_filter_applied.defender_malware_policy_comprehensive_attachments_filter_applied.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.m365.services.defender.defender_malware_policy_comprehensive_attachments_filter_applied.defender_malware_policy_comprehensive_attachments_filter_applied import (
                defender_malware_policy_comprehensive_attachments_filter_applied,
            )
            from prowler.providers.m365.services.defender.defender_service import (
                MalwarePolicy,
                MalwareRule,
            )

            defender_client.audit_config = {
                "recommended_blocked_file_types": ["exe", "bat"]
            }
            defender_client.malware_policies = [
                MalwarePolicy(
                    identity="Default",
                    enable_file_filter=True,
                    enable_internal_sender_admin_notifications=True,
                    internal_sender_admin_address="admin@example.com",
                    file_types=["exe", "bat"],
                    is_default=True,
                ),
                MalwarePolicy(
                    identity="Custom1",
                    enable_file_filter=True,
                    enable_internal_sender_admin_notifications=True,
                    internal_sender_admin_address="admin@example.com",
                    file_types=["exe", "bat"],
                    is_default=False,
                ),
            ]
            defender_client.malware_rules = {
                "Custom1": MalwareRule(
                    state="Enabled",
                    priority=1,
                    users=["user1@example.com"],
                    groups=["group1"],
                    domains=["example.com"],
                )
            }

            check = defender_malware_policy_comprehensive_attachments_filter_applied()
            result = check.execute()
            assert len(result) == 2
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Default is the default policy and Common Attachment Types Filter is properly configured, but it could be overridden by another misconfigured Custom Policy."
            )
            assert result[0].resource_name == "Default"
            assert result[0].resource_id == "Default"
            assert result[0].resource == defender_client.malware_policies[0].dict()

            assert result[1].status == "PASS"
            assert (
                result[1].status_extended
                == "Custom Malware policy Custom1 is properly configured and includes users: user1@example.com; groups: group1; domains: example.com, "
                "with priority 1 (0 is the highest). Also, the default policy is properly configured, so entities not included by this custom policy could still be correctly protected."
            )
            assert result[1].resource_name == "Custom1"
            assert result[1].resource_id == "Custom1"
            assert result[1].resource == defender_client.malware_policies[1].dict()

    def test_case_3_default_ok_custom_not(self):
        defender_client = mock.MagicMock()
        defender_client.audited_tenant = "audited_tenant"
        defender_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.defender.defender_malware_policy_comprehensive_attachments_filter_applied.defender_malware_policy_comprehensive_attachments_filter_applied.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.m365.services.defender.defender_malware_policy_comprehensive_attachments_filter_applied.defender_malware_policy_comprehensive_attachments_filter_applied import (
                defender_malware_policy_comprehensive_attachments_filter_applied,
            )
            from prowler.providers.m365.services.defender.defender_service import (
                MalwarePolicy,
                MalwareRule,
            )

            defender_client.audit_config = {
                "recommended_blocked_file_types": ["exe", "bat"]
            }
            defender_client.malware_policies = [
                MalwarePolicy(
                    identity="Default",
                    enable_file_filter=True,
                    enable_internal_sender_admin_notifications=True,
                    internal_sender_admin_address="admin@example.com",
                    file_types=["exe", "bat"],
                    is_default=True,
                ),
                MalwarePolicy(
                    identity="Custom1",
                    enable_file_filter=True,
                    enable_internal_sender_admin_notifications=True,
                    internal_sender_admin_address="admin@example.com",
                    file_types=["exe"],  # missing bat
                    is_default=False,
                ),
            ]
            defender_client.malware_rules = {
                "Custom1": MalwareRule(
                    state="Enabled",
                    priority=1,
                    users=["user1@example.com"],
                    groups=["group1"],
                    domains=["example.com"],
                )
            }

            check = defender_malware_policy_comprehensive_attachments_filter_applied()
            result = check.execute()
            assert len(result) == 2
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Default is the default policy and Common Attachment Types Filter is properly configured, but it could be overridden by another misconfigured Custom Policy."
            )
            assert result[0].resource_name == "Default"
            assert result[0].resource_id == "Default"
            assert result[0].resource == defender_client.malware_policies[0].dict()

            assert result[1].status == "FAIL"
            assert (
                result[1].status_extended
                == "Custom Malware policy Custom1 is not properly configured and includes users: user1@example.com; groups: group1; domains: example.com, "
                "with priority 1 (0 is the highest). Missing recommended file types: bat. However, the default policy is properly configured, so entities not included by this custom policy could be correctly protected."
            )
            assert result[1].resource_name == "Custom1"
            assert result[1].resource_id == "Custom1"
            assert result[1].resource == defender_client.malware_policies[1].dict()

    def test_case_4_default_not_ok_custom_ok(self):
        defender_client = mock.MagicMock()
        defender_client.audited_tenant = "audited_tenant"
        defender_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.defender.defender_malware_policy_comprehensive_attachments_filter_applied.defender_malware_policy_comprehensive_attachments_filter_applied.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.m365.services.defender.defender_malware_policy_comprehensive_attachments_filter_applied.defender_malware_policy_comprehensive_attachments_filter_applied import (
                defender_malware_policy_comprehensive_attachments_filter_applied,
            )
            from prowler.providers.m365.services.defender.defender_service import (
                MalwarePolicy,
                MalwareRule,
            )

            defender_client.audit_config = {
                "recommended_blocked_file_types": ["exe", "bat"]
            }
            defender_client.malware_policies = [
                MalwarePolicy(
                    identity="Default",
                    enable_file_filter=False,
                    enable_internal_sender_admin_notifications=True,
                    internal_sender_admin_address="admin@example.com",
                    file_types=[],
                    is_default=True,
                ),
                MalwarePolicy(
                    identity="Custom1",
                    enable_file_filter=True,
                    enable_internal_sender_admin_notifications=True,
                    internal_sender_admin_address="admin@example.com",
                    file_types=["exe", "bat"],
                    is_default=False,
                ),
            ]
            defender_client.malware_rules = {
                "Custom1": MalwareRule(
                    state="Enabled",
                    priority=0,
                    users=["user1@example.com"],
                    groups=["group1"],
                    domains=["domain.com"],
                )
            }

            check = defender_malware_policy_comprehensive_attachments_filter_applied()
            result = check.execute()
            assert len(result) == 2
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Default is the default policy and Common Attachment Types Filter is not properly configured, but it could be overridden by another well-configured Custom Policy. Missing recommended file types: exe, bat."
            )
            assert result[0].resource_name == "Default"
            assert result[0].resource_id == "Default"
            assert result[0].resource == defender_client.malware_policies[0].dict()

            assert result[1].status == "PASS"
            assert (
                result[1].status_extended
                == "Custom Malware policy Custom1 is properly configured and includes users: user1@example.com; groups: group1; domains: domain.com, "
                "with priority 0 (0 is the highest). However, the default policy is not properly configured, so entities not included by this custom policy could not be correctly protected."
            )
            assert result[1].resource_name == "Custom1"
            assert result[1].resource_id == "Custom1"
            assert result[1].resource == defender_client.malware_policies[1].dict()

    def test_case_5_only_default_not_ok(self):
        defender_client = mock.MagicMock()
        defender_client.audited_tenant = "audited_tenant"
        defender_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.defender.defender_malware_policy_comprehensive_attachments_filter_applied.defender_malware_policy_comprehensive_attachments_filter_applied.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.m365.services.defender.defender_malware_policy_comprehensive_attachments_filter_applied.defender_malware_policy_comprehensive_attachments_filter_applied import (
                defender_malware_policy_comprehensive_attachments_filter_applied,
            )
            from prowler.providers.m365.services.defender.defender_service import (
                MalwarePolicy,
            )

            defender_client.audit_config = {
                "recommended_blocked_file_types": ["exe", "bat"]
            }
            defender_client.malware_policies = [
                MalwarePolicy(
                    identity="Default",
                    enable_file_filter=False,
                    enable_internal_sender_admin_notifications=True,
                    internal_sender_admin_address="admin@example.com",
                    file_types=[],
                    is_default=True,
                )
            ]
            defender_client.malware_rules = {}

            check = defender_malware_policy_comprehensive_attachments_filter_applied()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Default is the only policy and Common Attachment Types Filter is not properly configured. Missing recommended file types: exe, bat."
            )
            assert result[0].resource_name == "Default"
            assert result[0].resource_id == "Default"
            assert result[0].resource == defender_client.malware_policies[0].dict()

    def test_case_6_default_and_custom_not_ok(self):
        defender_client = mock.MagicMock()
        defender_client.audited_tenant = "audited_tenant"
        defender_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.defender.defender_malware_policy_comprehensive_attachments_filter_applied.defender_malware_policy_comprehensive_attachments_filter_applied.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.m365.services.defender.defender_malware_policy_comprehensive_attachments_filter_applied.defender_malware_policy_comprehensive_attachments_filter_applied import (
                defender_malware_policy_comprehensive_attachments_filter_applied,
            )
            from prowler.providers.m365.services.defender.defender_service import (
                MalwarePolicy,
                MalwareRule,
            )

            defender_client.audit_config = {
                "recommended_blocked_file_types": ["exe", "bat"]
            }
            defender_client.malware_policies = [
                MalwarePolicy(
                    identity="Default",
                    enable_file_filter=False,
                    enable_internal_sender_admin_notifications=True,
                    internal_sender_admin_address="admin@example.com",
                    file_types=[],
                    is_default=True,
                ),
                MalwarePolicy(
                    identity="Custom1",
                    enable_file_filter=True,
                    enable_internal_sender_admin_notifications=True,
                    internal_sender_admin_address="admin@example.com",
                    file_types=["exe"],  # missing bat
                    is_default=False,
                ),
            ]
            defender_client.malware_rules = {
                "Custom1": MalwareRule(
                    state="Enabled",
                    priority=2,
                    users=["user@example.com"],
                    groups=["group1"],
                    domains=["example.com"],
                )
            }

            check = defender_malware_policy_comprehensive_attachments_filter_applied()
            result = check.execute()
            assert len(result) == 2
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Default is the default policy and Common Attachment Types Filter is not properly configured, but it could be overridden by another well-configured Custom Policy. Missing recommended file types: exe, bat."
            )
            assert result[0].resource_name == "Default"
            assert result[0].resource_id == "Default"
            assert result[0].resource == defender_client.malware_policies[0].dict()

            assert result[1].status == "FAIL"
            assert (
                result[1].status_extended
                == "Custom Malware policy Custom1 is not properly configured and includes users: user@example.com; groups: group1; domains: example.com, "
                "with priority 2 (0 is the highest). Missing recommended file types: bat. Also, the default policy is not properly configured, so entities not included by this custom policy could not be correctly protected."
            )
            assert result[1].resource_name == "Custom1"
            assert result[1].resource_id == "Custom1"
            assert result[1].resource == defender_client.malware_policies[1].dict()

    def test_no_malware_policies(self):
        defender_client = mock.MagicMock()
        defender_client.audited_tenant = "audited_tenant"
        defender_client.audited_domain = DOMAIN
        defender_client.malware_policies = []
        defender_client.malware_rules = {}
        defender_client.audit_config = {}

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.defender.defender_malware_policy_comprehensive_attachments_filter_applied.defender_malware_policy_comprehensive_attachments_filter_applied.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.m365.services.defender.defender_malware_policy_comprehensive_attachments_filter_applied.defender_malware_policy_comprehensive_attachments_filter_applied import (
                defender_malware_policy_comprehensive_attachments_filter_applied,
            )

            check = defender_malware_policy_comprehensive_attachments_filter_applied()
            result = check.execute()
            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: defender_report_policy_configured_test.py]---
Location: prowler-master/tests/providers/m365/services/defender/defender_report_policy_configured/defender_report_policy_configured_test.py

```python
from unittest import mock

from prowler.providers.m365.services.defender.defender_service import (
    ReportSubmissionPolicy,
)
from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_defender_chat_report_policy_configured:
    def test_report_policy_configured_pass(self):
        defender_client = mock.MagicMock()
        defender_client.audited_tenant = "audited_tenant"
        defender_client.audited_domain = DOMAIN
        defender_client.report_submission_policy = ReportSubmissionPolicy(
            report_junk_to_customized_address=True,
            report_not_junk_to_customized_address=True,
            report_phish_to_customized_address=True,
            report_junk_addresses=["address1"],
            report_not_junk_addresses=["address2"],
            report_phish_addresses=["address3"],
            report_chat_message_enabled=False,
            report_chat_message_to_customized_address_enabled=True,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.defender.defender_chat_report_policy_configured.defender_chat_report_policy_configured.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.m365.services.defender.defender_chat_report_policy_configured.defender_chat_report_policy_configured import (
                defender_chat_report_policy_configured,
            )

            check = defender_chat_report_policy_configured()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Defender report submission policy is properly configured for Teams security reporting."
            )
            assert result[0].resource == defender_client.report_submission_policy.dict()
            assert result[0].resource_name == "Defender Security Reporting Policy"
            assert result[0].resource_id == "defenderSecurityReportingPolicy"
            assert result[0].location == "global"

    def test_report_policy_configured_fail(self):
        defender_client = mock.MagicMock()
        defender_client.audited_tenant = "audited_tenant"
        defender_client.audited_domain = DOMAIN
        defender_client.report_submission_policy = ReportSubmissionPolicy(
            report_junk_to_customized_address=False,
            report_not_junk_to_customized_address=True,
            report_phish_to_customized_address=True,
            report_junk_addresses=[],
            report_not_junk_addresses=[],
            report_phish_addresses=[],
            report_chat_message_enabled=True,
            report_chat_message_to_customized_address_enabled=False,
        )

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.defender.defender_chat_report_policy_configured.defender_chat_report_policy_configured.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.m365.services.defender.defender_chat_report_policy_configured.defender_chat_report_policy_configured import (
                defender_chat_report_policy_configured,
            )

            check = defender_chat_report_policy_configured()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Defender report submission policy is not properly configured for Teams security reporting."
            )
            assert result[0].resource == defender_client.report_submission_policy.dict()
            assert result[0].resource_name == "Defender Security Reporting Policy"
            assert result[0].resource_id == "defenderSecurityReportingPolicy"
            assert result[0].location == "global"

    def test_report_policy_configured_none(self):
        defender_client = mock.MagicMock()
        defender_client.audited_tenant = "audited_tenant"
        defender_client.audited_domain = DOMAIN
        defender_client.report_submission_policy = None

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.defender.defender_chat_report_policy_configured.defender_chat_report_policy_configured.defender_client",
                new=defender_client,
            ),
        ):
            from prowler.providers.m365.services.defender.defender_chat_report_policy_configured.defender_chat_report_policy_configured import (
                defender_chat_report_policy_configured,
            )

            check = defender_chat_report_policy_configured()
            result = check.execute()
            assert len(result) == 0
```

--------------------------------------------------------------------------------

````
