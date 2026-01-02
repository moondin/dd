---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 746
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 746 of 867)

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

---[FILE: exchange_mailbox_audit_bypass_disabled_test.py]---
Location: prowler-master/tests/providers/m365/services/exchange/exchange_mailbox_audit_bypass_disabled/exchange_mailbox_audit_bypass_disabled_test.py

```python
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_exchange_mailbox_audit_bypass_disabled:
    def test_no_mailboxes(self):
        exchange_client = mock.MagicMock()
        exchange_client.audited_tenant = "audited_tenant"
        exchange_client.audited_domain = DOMAIN
        exchange_client.mailboxes_config = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.exchange.exchange_mailbox_audit_bypass_disabled.exchange_mailbox_audit_bypass_disabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_mailbox_audit_bypass_disabled.exchange_mailbox_audit_bypass_disabled import (
                exchange_mailbox_audit_bypass_disabled,
            )

            check = exchange_mailbox_audit_bypass_disabled()
            result = check.execute()
            assert len(result) == 0

    def test_audit_bypass_disabled_and_enabled(self):
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
                "prowler.providers.m365.services.exchange.exchange_mailbox_audit_bypass_disabled.exchange_mailbox_audit_bypass_disabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_mailbox_audit_bypass_disabled.exchange_mailbox_audit_bypass_disabled import (
                exchange_mailbox_audit_bypass_disabled,
            )
            from prowler.providers.m365.services.exchange.exchange_service import (
                MailboxAuditConfig,
            )

            exchange_client.mailboxes_config = [
                MailboxAuditConfig(name="test", id="test", audit_bypass_enabled=True),
                MailboxAuditConfig(
                    name="test2", id="test2", audit_bypass_enabled=False
                ),
            ]

            check = exchange_mailbox_audit_bypass_disabled()
            result = check.execute()

            assert len(result) == 2

            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Exchange mailbox auditing is bypassed and not enabled for mailbox: test."
            )
            assert result[0].resource == exchange_client.mailboxes_config[0].dict()
            assert result[0].resource_name == "test"
            assert result[0].resource_id == "test"
            assert result[0].location == "global"

            assert result[1].status == "PASS"
            assert (
                result[1].status_extended
                == "Exchange mailbox auditing is enabled for mailbox: test2."
            )
            assert result[1].resource == exchange_client.mailboxes_config[1].dict()
            assert result[1].resource_name == "test2"
            assert result[1].resource_id == "test2"
            assert result[1].location == "global"

    def test_audit_bypass_enabled(self):
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
                "prowler.providers.m365.services.exchange.exchange_mailbox_audit_bypass_disabled.exchange_mailbox_audit_bypass_disabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_mailbox_audit_bypass_disabled.exchange_mailbox_audit_bypass_disabled import (
                exchange_mailbox_audit_bypass_disabled,
            )
            from prowler.providers.m365.services.exchange.exchange_service import (
                MailboxAuditConfig,
            )

            exchange_client.mailboxes_config = [
                MailboxAuditConfig(name="test", id="test", audit_bypass_enabled=True),
            ]

            check = exchange_mailbox_audit_bypass_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Exchange mailbox auditing is bypassed and not enabled for mailbox: test."
            )
            assert result[0].resource == exchange_client.mailboxes_config[0].dict()
            assert result[0].resource_name == "test"
            assert result[0].resource_id == "test"
            assert result[0].location == "global"

    def test_audit_bypass_disabled(self):
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
                "prowler.providers.m365.services.exchange.exchange_mailbox_audit_bypass_disabled.exchange_mailbox_audit_bypass_disabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_mailbox_audit_bypass_disabled.exchange_mailbox_audit_bypass_disabled import (
                exchange_mailbox_audit_bypass_disabled,
            )
            from prowler.providers.m365.services.exchange.exchange_service import (
                MailboxAuditConfig,
            )

            exchange_client.mailboxes_config = [
                MailboxAuditConfig(name="test", id="test", audit_bypass_enabled=False),
            ]

            check = exchange_mailbox_audit_bypass_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Exchange mailbox auditing is enabled for mailbox: test."
            )
            assert result[0].resource == exchange_client.mailboxes_config[0].dict()
            assert result[0].resource_name == "test"
            assert result[0].resource_id == "test"
            assert result[0].location == "global"
```

--------------------------------------------------------------------------------

---[FILE: exchange_mailbox_policy_additional_storage_restricted_test.py]---
Location: prowler-master/tests/providers/m365/services/exchange/exchange_mailbox_policy_additional_storage_restricted/exchange_mailbox_policy_additional_storage_restricted_test.py

```python
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_exchange_mailbox_policy_additional_storage_restricted:
    def test_mailbox_policy_restricts_additional_storage(self):
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
                "prowler.providers.m365.services.exchange.exchange_mailbox_policy_additional_storage_restricted.exchange_mailbox_policy_additional_storage_restricted.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_mailbox_policy_additional_storage_restricted.exchange_mailbox_policy_additional_storage_restricted import (
                exchange_mailbox_policy_additional_storage_restricted,
            )
            from prowler.providers.m365.services.exchange.exchange_service import (
                MailboxPolicy,
            )

            exchange_client.mailbox_policies = [
                MailboxPolicy(
                    id="OwaMailboxPolicy-Default", additional_storage_enabled=False
                )
            ]

            check = exchange_mailbox_policy_additional_storage_restricted()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Exchange mailbox policy 'OwaMailboxPolicy-Default' restricts additional storage providers."
            )
            assert result[0].resource == exchange_client.mailbox_policies[0].dict()
            assert (
                result[0].resource_name
                == "Exchange Mailbox Policy - OwaMailboxPolicy-Default"
            )
            assert result[0].resource_id == "OwaMailboxPolicy-Default"
            assert result[0].location == "global"

    def test_mailbox_policy_allows_additional_storage(self):
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
                "prowler.providers.m365.services.exchange.exchange_mailbox_policy_additional_storage_restricted.exchange_mailbox_policy_additional_storage_restricted.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_mailbox_policy_additional_storage_restricted.exchange_mailbox_policy_additional_storage_restricted import (
                exchange_mailbox_policy_additional_storage_restricted,
            )
            from prowler.providers.m365.services.exchange.exchange_service import (
                MailboxPolicy,
            )

            exchange_client.mailbox_policies = [
                MailboxPolicy(
                    id="OwaMailboxPolicy-Default", additional_storage_enabled=True
                )
            ]

            check = exchange_mailbox_policy_additional_storage_restricted()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Exchange mailbox policy 'OwaMailboxPolicy-Default' allows additional storage providers."
            )
            assert result[0].resource == exchange_client.mailbox_policies[0].dict()
            assert (
                result[0].resource_name
                == "Exchange Mailbox Policy - OwaMailboxPolicy-Default"
            )
            assert result[0].resource_id == "OwaMailboxPolicy-Default"
            assert result[0].location == "global"

    def test_no_mailbox_policy(self):
        exchange_client = mock.MagicMock()
        exchange_client.audited_tenant = "audited_tenant"
        exchange_client.audited_domain = DOMAIN
        exchange_client.mailbox_policies = []

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.exchange.exchange_mailbox_policy_additional_storage_restricted.exchange_mailbox_policy_additional_storage_restricted.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_mailbox_policy_additional_storage_restricted.exchange_mailbox_policy_additional_storage_restricted import (
                exchange_mailbox_policy_additional_storage_restricted,
            )

            check = exchange_mailbox_policy_additional_storage_restricted()
            result = check.execute()
            assert len(result) == 0

    def test_multiple_mailbox_policies_mixed_results(self):
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
                "prowler.providers.m365.services.exchange.exchange_mailbox_policy_additional_storage_restricted.exchange_mailbox_policy_additional_storage_restricted.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_mailbox_policy_additional_storage_restricted.exchange_mailbox_policy_additional_storage_restricted import (
                exchange_mailbox_policy_additional_storage_restricted,
            )
            from prowler.providers.m365.services.exchange.exchange_service import (
                MailboxPolicy,
            )

            exchange_client.mailbox_policies = [
                MailboxPolicy(
                    id="OwaMailboxPolicy-Default", additional_storage_enabled=False
                ),
                MailboxPolicy(id="OWA-Policy-2", additional_storage_enabled=True),
                MailboxPolicy(id="OWA-Policy-3", additional_storage_enabled=False),
            ]

            check = exchange_mailbox_policy_additional_storage_restricted()
            result = check.execute()

            # Should have 3 results, one for each policy
            assert len(result) == 3

            # First policy (Default) should PASS
            assert result[0].status == "PASS"
            assert result[0].resource_id == "OwaMailboxPolicy-Default"
            assert "restricts additional storage providers" in result[0].status_extended

            # Second policy should FAIL
            assert result[1].status == "FAIL"
            assert result[1].resource_id == "OWA-Policy-2"
            assert "allows additional storage providers" in result[1].status_extended

            # Third policy should PASS
            assert result[2].status == "PASS"
            assert result[2].resource_id == "OWA-Policy-3"
            assert "restricts additional storage providers" in result[2].status_extended
```

--------------------------------------------------------------------------------

---[FILE: exchange_organization_mailbox_auditing_enabled_test.py]---
Location: prowler-master/tests/providers/m365/services/exchange/exchange_organization_mailbox_auditing_enabled/exchange_organization_mailbox_auditing_enabled_test.py

```python
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_exchange_organization_mailbox_auditing_enabled:
    def test_no_organization(self):
        exchange_client = mock.MagicMock()
        exchange_client.audited_tenant = "audited_tenant"
        exchange_client.audited_domain = DOMAIN
        exchange_client.organization_config = None

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.exchange.exchange_organization_mailbox_auditing_enabled.exchange_organization_mailbox_auditing_enabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_organization_mailbox_auditing_enabled.exchange_organization_mailbox_auditing_enabled import (
                exchange_organization_mailbox_auditing_enabled,
            )

            check = exchange_organization_mailbox_auditing_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_audit_log_search_disabled(self):
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
                "prowler.providers.m365.services.exchange.exchange_organization_mailbox_auditing_enabled.exchange_organization_mailbox_auditing_enabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_organization_mailbox_auditing_enabled.exchange_organization_mailbox_auditing_enabled import (
                exchange_organization_mailbox_auditing_enabled,
            )
            from prowler.providers.m365.services.exchange.exchange_service import (
                Organization,
            )

            exchange_client.organization_config = Organization(
                audit_disabled=True,
                name="test",
                guid="test",
                oauth_enabled=True,
                mailtips_enabled=True,
                mailtips_external_recipient_enabled=True,
                mailtips_group_metrics_enabled=True,
                mailtips_large_audience_threshold=25,
            )

            check = exchange_organization_mailbox_auditing_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Exchange mailbox auditing is not enabled on your organization."
            )
            assert result[0].resource == exchange_client.organization_config.dict()
            assert result[0].resource_name == "test"
            assert result[0].resource_id == "test"
            assert result[0].location == "global"

    def test_audit_log_search_enabled(self):
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
                "prowler.providers.m365.services.exchange.exchange_organization_mailbox_auditing_enabled.exchange_organization_mailbox_auditing_enabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_organization_mailbox_auditing_enabled.exchange_organization_mailbox_auditing_enabled import (
                exchange_organization_mailbox_auditing_enabled,
            )
            from prowler.providers.m365.services.exchange.exchange_service import (
                Organization,
            )

            exchange_client.organization_config = Organization(
                audit_disabled=False,
                name="test",
                guid="test",
                oauth_enabled=True,
                mailtips_enabled=True,
                mailtips_external_recipient_enabled=True,
                mailtips_group_metrics_enabled=True,
                mailtips_large_audience_threshold=25,
            )

            check = exchange_organization_mailbox_auditing_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Exchange mailbox auditing is enabled on your organization."
            )
            assert result[0].resource == exchange_client.organization_config.dict()
            assert result[0].resource_name == "test"
            assert result[0].resource_id == "test"
            assert result[0].location == "global"
```

--------------------------------------------------------------------------------

---[FILE: exchange_organization_mailtips_enabled_test.py]---
Location: prowler-master/tests/providers/m365/services/exchange/exchange_organization_mailtips_enabled/exchange_organization_mailtips_enabled_test.py

```python
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_exchange_organization_mailtips_enabled:
    def test_no_organization(self):
        exchange_client = mock.MagicMock()
        exchange_client.audited_tenant = "audited_tenant"
        exchange_client.audited_domain = DOMAIN
        exchange_client.organization_config = None

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.exchange.exchange_organization_mailtips_enabled.exchange_organization_mailtips_enabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_organization_mailtips_enabled.exchange_organization_mailtips_enabled import (
                exchange_organization_mailtips_enabled,
            )

            check = exchange_organization_mailtips_enabled()
            result = check.execute()
            assert result == []

    def test_mailtips_not_fully_enabled(self):
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
                "prowler.providers.m365.services.exchange.exchange_organization_mailtips_enabled.exchange_organization_mailtips_enabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_organization_mailtips_enabled.exchange_organization_mailtips_enabled import (
                exchange_organization_mailtips_enabled,
            )
            from prowler.providers.m365.services.exchange.exchange_service import (
                Organization,
            )

            exchange_client.audit_config = {
                "recommended_mailtips_large_audience_threshold": 25
            }

            exchange_client.organization_config = Organization(
                name="test-org",
                guid="org-guid",
                audit_disabled=False,
                oauth_enabled=True,
                mailtips_enabled=False,
                mailtips_external_recipient_enabled=False,
                mailtips_group_metrics_enabled=True,
                mailtips_large_audience_threshold=25,
            )

            check = exchange_organization_mailtips_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "MailTips are not fully enabled for Exchange Online."
            )
            assert result[0].resource_name == "test-org"
            assert result[0].resource_id == "org-guid"
            assert result[0].location == "global"
            assert result[0].resource == exchange_client.organization_config.dict()

    def test_mailtips_fully_enabled(self):
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
                "prowler.providers.m365.services.exchange.exchange_organization_mailtips_enabled.exchange_organization_mailtips_enabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_organization_mailtips_enabled.exchange_organization_mailtips_enabled import (
                exchange_organization_mailtips_enabled,
            )
            from prowler.providers.m365.services.exchange.exchange_service import (
                Organization,
            )

            exchange_client.audit_config = {
                "recommended_mailtips_large_audience_threshold": 25
            }

            exchange_client.organization_config = Organization(
                name="test-org",
                guid="org-guid",
                audit_disabled=False,
                oauth_enabled=True,
                mailtips_enabled=True,
                mailtips_external_recipient_enabled=True,
                mailtips_group_metrics_enabled=True,
                mailtips_large_audience_threshold=25,
            )

            check = exchange_organization_mailtips_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "MailTips are fully enabled for Exchange Online."
            )
            assert result[0].resource_name == "test-org"
            assert result[0].resource_id == "org-guid"
            assert result[0].location == "global"
            assert result[0].resource == exchange_client.organization_config.dict()
```

--------------------------------------------------------------------------------

---[FILE: exchange_organization_modern_authentication_enabled_test.py]---
Location: prowler-master/tests/providers/m365/services/exchange/exchange_organization_modern_authentication_enabled/exchange_organization_modern_authentication_enabled_test.py

```python
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_exchange_organization_modern_authentication_enabled:
    def test_no_organization(self):
        exchange_client = mock.MagicMock()
        exchange_client.audited_tenant = "audited_tenant"
        exchange_client.audited_domain = DOMAIN
        exchange_client.organization_config = None

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.exchange.exchange_organization_modern_authentication_enabled.exchange_organization_modern_authentication_enabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_organization_modern_authentication_enabled.exchange_organization_modern_authentication_enabled import (
                exchange_organization_modern_authentication_enabled,
            )

            check = exchange_organization_modern_authentication_enabled()
            result = check.execute()
            assert len(result) == 0

    def test_modern_authentication_disabled(self):
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
                "prowler.providers.m365.services.exchange.exchange_organization_modern_authentication_enabled.exchange_organization_modern_authentication_enabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_organization_modern_authentication_enabled.exchange_organization_modern_authentication_enabled import (
                exchange_organization_modern_authentication_enabled,
            )
            from prowler.providers.m365.services.exchange.exchange_service import (
                Organization,
            )

            exchange_client.organization_config = Organization(
                oauth_enabled=False,
                name="test",
                guid="test",
                audit_disabled=False,
                mailtips_enabled=False,
                mailtips_external_recipient_enabled=False,
                mailtips_group_metrics_enabled=True,
                mailtips_large_audience_threshold=25,
            )

            check = exchange_organization_modern_authentication_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Modern Authentication is not enabled for Exchange Online."
            )
            assert result[0].resource == exchange_client.organization_config.dict()
            assert result[0].resource_name == "test"
            assert result[0].resource_id == "test"
            assert result[0].location == "global"

    def test_modern_authentication_enabled(self):
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
                "prowler.providers.m365.services.exchange.exchange_organization_modern_authentication_enabled.exchange_organization_modern_authentication_enabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_organization_modern_authentication_enabled.exchange_organization_modern_authentication_enabled import (
                exchange_organization_modern_authentication_enabled,
            )
            from prowler.providers.m365.services.exchange.exchange_service import (
                Organization,
            )

            exchange_client.organization_config = Organization(
                oauth_enabled=True,
                name="test",
                guid="test",
                audit_disabled=False,
                mailtips_enabled=False,
                mailtips_external_recipient_enabled=False,
                mailtips_group_metrics_enabled=True,
                mailtips_large_audience_threshold=25,
            )

            check = exchange_organization_modern_authentication_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Modern Authentication is enabled for Exchange Online."
            )
            assert result[0].resource == exchange_client.organization_config.dict()
            assert result[0].resource_name == "test"
            assert result[0].resource_id == "test"
            assert result[0].location == "global"
```

--------------------------------------------------------------------------------

---[FILE: exchange_roles_assignment_policy_addins_disabled_test.py]---
Location: prowler-master/tests/providers/m365/services/exchange/exchange_roles_assignment_policy_addins_disabled/exchange_roles_assignment_policy_addins_disabled_test.py

```python
from unittest import mock

from prowler.providers.m365.services.exchange.exchange_service import (
    RoleAssignmentPolicy,
)
from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_exchange_roles_assignment_policy_addins_disabled:
    def test_no_policies(self):
        exchange_client = mock.MagicMock()
        exchange_client.audited_tenant = "audited_tenant"
        exchange_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online",
            ),
            mock.patch(
                "prowler.providers.m365.services.exchange.exchange_roles_assignment_policy_addins_disabled.exchange_roles_assignment_policy_addins_disabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_roles_assignment_policy_addins_disabled.exchange_roles_assignment_policy_addins_disabled import (
                exchange_roles_assignment_policy_addins_disabled,
            )

            exchange_client.role_assignment_policies = []

            check = exchange_roles_assignment_policy_addins_disabled()
            result = check.execute()

            assert len(result) == 0

    def test_policy_with_no_addin_roles(self):
        exchange_client = mock.MagicMock()
        exchange_client.audited_tenant = "audited_tenant"
        exchange_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online",
            ),
            mock.patch(
                "prowler.providers.m365.services.exchange.exchange_roles_assignment_policy_addins_disabled.exchange_roles_assignment_policy_addins_disabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_roles_assignment_policy_addins_disabled.exchange_roles_assignment_policy_addins_disabled import (
                exchange_roles_assignment_policy_addins_disabled,
            )

            exchange_client.role_assignment_policies = [
                RoleAssignmentPolicy(
                    name="Policy1",
                    id="id-policy1",
                    assigned_roles=["My Base Options", "My Voice Mail"],
                )
            ]

            check = exchange_roles_assignment_policy_addins_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Role assignment policy 'Policy1' does not allow Outlook add-ins."
            )
            assert result[0].resource_name == "Policy1"
            assert result[0].resource_id == "id-policy1"
            assert result[0].location == "global"
            assert (
                result[0].resource == exchange_client.role_assignment_policies[0].dict()
            )

    def test_policy_with_addin_roles(self):
        exchange_client = mock.MagicMock()
        exchange_client.audited_tenant = "audited_tenant"
        exchange_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online",
            ),
            mock.patch(
                "prowler.providers.m365.services.exchange.exchange_roles_assignment_policy_addins_disabled.exchange_roles_assignment_policy_addins_disabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_roles_assignment_policy_addins_disabled.exchange_roles_assignment_policy_addins_disabled import (
                exchange_roles_assignment_policy_addins_disabled,
            )

            exchange_client.role_assignment_policies = [
                RoleAssignmentPolicy(
                    name="Policy2",
                    id="id-policy2",
                    assigned_roles=["My Custom Apps", "My Voice Mail"],
                )
            ]

            check = exchange_roles_assignment_policy_addins_disabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Role assignment policy 'Policy2' allows Outlook add-ins via roles: My Custom Apps."
            )
            assert result[0].resource_name == "Policy2"
            assert result[0].resource_id == "id-policy2"
            assert result[0].location == "global"
            assert (
                result[0].resource == exchange_client.role_assignment_policies[0].dict()
            )
```

--------------------------------------------------------------------------------

````
