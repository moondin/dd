---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 747
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 747 of 867)

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

---[FILE: exchange_transport_config_smtp_auth_disabled_test.py]---
Location: prowler-master/tests/providers/m365/services/exchange/exchange_transport_config_smtp_auth_disabled/exchange_transport_config_smtp_auth_disabled_test.py

```python
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_exchange_transport_config_smtp_auth_disabled:
    def test_no_transport_config(self):
        exchange_client = mock.MagicMock()
        exchange_client.audited_tenant = "audited_tenant"
        exchange_client.audited_domain = DOMAIN
        exchange_client.transport_config = None

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.exchange.exchange_transport_config_smtp_auth_disabled.exchange_transport_config_smtp_auth_disabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_transport_config_smtp_auth_disabled.exchange_transport_config_smtp_auth_disabled import (
                exchange_transport_config_smtp_auth_disabled,
            )

            check = exchange_transport_config_smtp_auth_disabled()
            result = check.execute()
            assert len(result) == 0

    def test_smtp_auth_enabled(self):
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
                "prowler.providers.m365.services.exchange.exchange_transport_config_smtp_auth_disabled.exchange_transport_config_smtp_auth_disabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_service import (
                TransportConfig,
            )
            from prowler.providers.m365.services.exchange.exchange_transport_config_smtp_auth_disabled.exchange_transport_config_smtp_auth_disabled import (
                exchange_transport_config_smtp_auth_disabled,
            )

            exchange_client.transport_config = TransportConfig(smtp_auth_disabled=False)

            check = exchange_transport_config_smtp_auth_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "SMTP AUTH is enabled in the Exchange Online Transport Config."
            )
            assert result[0].resource == exchange_client.transport_config.dict()
            assert result[0].resource_name == "Transport Configuration"
            assert result[0].resource_id == "transport_config"
            assert result[0].location == "global"

    def test_smtp_auth_disabled(self):
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
                "prowler.providers.m365.services.exchange.exchange_transport_config_smtp_auth_disabled.exchange_transport_config_smtp_auth_disabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_service import (
                TransportConfig,
            )
            from prowler.providers.m365.services.exchange.exchange_transport_config_smtp_auth_disabled.exchange_transport_config_smtp_auth_disabled import (
                exchange_transport_config_smtp_auth_disabled,
            )

            exchange_client.transport_config = TransportConfig(smtp_auth_disabled=True)

            check = exchange_transport_config_smtp_auth_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "SMTP AUTH is disabled in the Exchange Online Transport Config."
            )
            assert result[0].resource == exchange_client.transport_config.dict()
            assert result[0].resource_name == "Transport Configuration"
            assert result[0].resource_id == "transport_config"
            assert result[0].location == "global"
```

--------------------------------------------------------------------------------

---[FILE: exchange_transport_rules_mail_forwarding_disabled_test.py]---
Location: prowler-master/tests/providers/m365/services/exchange/exchange_transport_rules_mail_forwarding_disabled/exchange_transport_rules_mail_forwarding_disabled_test.py

```python
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_exchange_transport_rules_mail_forwarding_disabled:
    def test_empty_rule_list(self):
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
                "prowler.providers.m365.services.exchange.exchange_transport_rules_mail_forwarding_disabled.exchange_transport_rules_mail_forwarding_disabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_transport_rules_mail_forwarding_disabled.exchange_transport_rules_mail_forwarding_disabled import (
                exchange_transport_rules_mail_forwarding_disabled,
            )

            exchange_client.transport_rules = []

            check = exchange_transport_rules_mail_forwarding_disabled()
            result = check.execute()

            assert len(result) == 0

    def test_forwarding_disabled(self):
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
                "prowler.providers.m365.services.exchange.exchange_transport_rules_mail_forwarding_disabled.exchange_transport_rules_mail_forwarding_disabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_service import (
                TransportRule,
            )
            from prowler.providers.m365.services.exchange.exchange_transport_rules_mail_forwarding_disabled.exchange_transport_rules_mail_forwarding_disabled import (
                exchange_transport_rules_mail_forwarding_disabled,
            )

            exchange_client.transport_rules = [
                TransportRule(
                    name="Rule1", redirect_message_to=[], sender_domain_is=[]
                ),
                TransportRule(
                    name="Rule2", redirect_message_to=[], sender_domain_is=[]
                ),
            ]

            check = exchange_transport_rules_mail_forwarding_disabled()
            result = check.execute()

            assert len(result) == 2
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Transport rule Rule1 does not allow forwarding mail to external domains."
            )
            assert result[0].resource_name == "Rule1"
            assert result[0].resource_id == "ExchangeTransportRule"
            assert result[1].status == "PASS"
            assert (
                result[1].status_extended
                == "Transport rule Rule2 does not allow forwarding mail to external domains."
            )
            assert result[1].resource_name == "Rule2"

    def test_forwarding_enabled(self):
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
                "prowler.providers.m365.services.exchange.exchange_transport_rules_mail_forwarding_disabled.exchange_transport_rules_mail_forwarding_disabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_service import (
                TransportRule,
            )
            from prowler.providers.m365.services.exchange.exchange_transport_rules_mail_forwarding_disabled.exchange_transport_rules_mail_forwarding_disabled import (
                exchange_transport_rules_mail_forwarding_disabled,
            )

            exchange_client.transport_rules = [
                TransportRule(
                    name="ForwardingRule",
                    redirect_message_to=["external@example.com"],
                    sender_domain_is=[],
                ),
                TransportRule(
                    name="NoForwardingRule",
                    redirect_message_to=[],
                    sender_domain_is=[],
                ),
            ]

            check = exchange_transport_rules_mail_forwarding_disabled()
            result = check.execute()

            assert len(result) == 2
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Transport rule ForwardingRule allows forwarding mail to external domains: external@example.com."
            )
            assert result[0].resource_name == "ForwardingRule"
            assert result[0].resource_id == "ExchangeTransportRule"
            assert result[0].location == "global"
            assert result[1].status == "PASS"
            assert (
                result[1].status_extended
                == "Transport rule NoForwardingRule does not allow forwarding mail to external domains."
            )
            assert result[1].resource_name == "NoForwardingRule"
            assert result[1].resource_id == "ExchangeTransportRule"
            assert result[1].location == "global"
```

--------------------------------------------------------------------------------

---[FILE: exchange_transport_rules_whitelist_disabled_test.py]---
Location: prowler-master/tests/providers/m365/services/exchange/exchange_transport_rules_whitelist_disabled/exchange_transport_rules_whitelist_disabled_test.py

```python
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_exchange_transport_rules_whitelist_disabled:
    def test_no_whitelist_domains(self):
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
                "prowler.providers.m365.services.exchange.exchange_transport_rules_whitelist_disabled.exchange_transport_rules_whitelist_disabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_service import (
                TransportRule,
            )
            from prowler.providers.m365.services.exchange.exchange_transport_rules_whitelist_disabled.exchange_transport_rules_whitelist_disabled import (
                exchange_transport_rules_whitelist_disabled,
            )

            exchange_client.transport_rules = [
                TransportRule(name="Rule1", scl=0, sender_domain_is=[]),
                TransportRule(name="Rule2", scl=0, sender_domain_is=["example.com"]),
            ]

            check = exchange_transport_rules_whitelist_disabled()
            result = check.execute()

            assert len(result) == 2
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Transport rule Rule1 does not whitelist any domains."
            )
            assert result[0].resource_name == "Rule1"
            assert result[0].resource_id == "ExchangeTransportRule"
            assert result[1].status == "PASS"
            assert (
                result[1].status_extended
                == "Transport rule Rule2 does not whitelist any domains."
            )
            assert result[1].resource_name == "Rule2"

    def test_whitelist_detected(self):
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
                "prowler.providers.m365.services.exchange.exchange_transport_rules_whitelist_disabled.exchange_transport_rules_whitelist_disabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_service import (
                TransportRule,
            )
            from prowler.providers.m365.services.exchange.exchange_transport_rules_whitelist_disabled.exchange_transport_rules_whitelist_disabled import (
                exchange_transport_rules_whitelist_disabled,
            )

            exchange_client.transport_rules = [
                TransportRule(
                    name="WhitelistRule", scl=-1, sender_domain_is=["whitelist.com"]
                ),
                TransportRule(name="NoWhitelistRule", scl=-1, sender_domain_is=[]),
            ]

            check = exchange_transport_rules_whitelist_disabled()
            result = check.execute()

            assert len(result) == 2
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Transport rule WhitelistRule whitelists domains: whitelist.com."
            )
            assert result[0].resource_name == "WhitelistRule"
            assert result[0].resource_id == "ExchangeTransportRule"
            assert result[0].location == "global"
            assert result[1].status == "PASS"
            assert (
                result[1].status_extended
                == "Transport rule NoWhitelistRule does not whitelist any domains."
            )
            assert result[1].resource_name == "NoWhitelistRule"
            assert result[1].resource_id == "ExchangeTransportRule"
            assert result[1].location == "global"

    def test_empty_rule_list(self):
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
                "prowler.providers.m365.services.exchange.exchange_transport_rules_whitelist_disabled.exchange_transport_rules_whitelist_disabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_transport_rules_whitelist_disabled.exchange_transport_rules_whitelist_disabled import (
                exchange_transport_rules_whitelist_disabled,
            )

            exchange_client.transport_rules = []

            check = exchange_transport_rules_whitelist_disabled()
            result = check.execute()

            assert len(result) == 0
```

--------------------------------------------------------------------------------

---[FILE: exchange_user_mailbox_auditing_enabled_test.py]---
Location: prowler-master/tests/providers/m365/services/exchange/exchange_user_mailbox_auditing_enabled/exchange_user_mailbox_auditing_enabled_test.py

```python
from unittest import mock

from prowler.providers.m365.services.exchange.exchange_service import (
    AuditAdmin,
    AuditDelegate,
    AuditOwner,
    MailboxAuditProperties,
)
from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_exchange_user_mailbox_auditing_enabled:
    def test_no_auditing_mailboxes(self):
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
                "prowler.providers.m365.services.exchange.exchange_user_mailbox_auditing_enabled.exchange_user_mailbox_auditing_enabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_user_mailbox_auditing_enabled.exchange_user_mailbox_auditing_enabled import (
                exchange_user_mailbox_auditing_enabled,
            )

            exchange_client.mailbox_audit_properties = []

            check = exchange_user_mailbox_auditing_enabled()
            result = check.execute()

            assert len(result) == 0

    def test_auditing_fully_configured_and_log_age_valid(self):
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
                "prowler.providers.m365.services.exchange.exchange_user_mailbox_auditing_enabled.exchange_user_mailbox_auditing_enabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_user_mailbox_auditing_enabled.exchange_user_mailbox_auditing_enabled import (
                exchange_user_mailbox_auditing_enabled,
            )

            exchange_client.audit_config = {"audit_log_age": 180}

            exchange_client.mailbox_audit_properties = [
                MailboxAuditProperties(
                    name="User1",
                    audit_enabled=True,
                    audit_admin=[e.value for e in AuditAdmin],
                    audit_delegate=[e.value for e in AuditDelegate],
                    audit_owner=[e.value for e in AuditOwner],
                    audit_log_age=180,
                    identity="User1",
                )
            ]

            check = exchange_user_mailbox_auditing_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Mailbox Audit Properties for Mailbox User1 is enabled with an audit log age of 180 days."
            )
            assert result[0].resource_name == "User1"
            assert result[0].resource_id == "User1"
            assert result[0].location == "global"
            assert (
                result[0].resource == exchange_client.mailbox_audit_properties[0].dict()
            )

    def test_audit_enabled_but_incomplete_configuration(self):
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
                "prowler.providers.m365.services.exchange.exchange_user_mailbox_auditing_enabled.exchange_user_mailbox_auditing_enabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_user_mailbox_auditing_enabled.exchange_user_mailbox_auditing_enabled import (
                exchange_user_mailbox_auditing_enabled,
            )

            exchange_client.audit_config = {"audit_log_age": 90}

            exchange_client.mailbox_audit_properties = [
                MailboxAuditProperties(
                    name="User2",
                    audit_enabled=True,
                    audit_admin=["SendAs"],
                    audit_delegate=["Send"],
                    audit_owner=["Update"],
                    audit_log_age=180,
                    identity="User2",
                )
            ]

            check = exchange_user_mailbox_auditing_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Mailbox Audit Properties for Mailbox User2 is enabled but without all audit actions configured."
            )
            assert result[0].resource_name == "User2"
            assert result[0].resource_id == "User2"
            assert result[0].location == "global"
            assert (
                result[0].resource == exchange_client.mailbox_audit_properties[0].dict()
            )

    def test_audit_not_enabled(self):
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
                "prowler.providers.m365.services.exchange.exchange_user_mailbox_auditing_enabled.exchange_user_mailbox_auditing_enabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_user_mailbox_auditing_enabled.exchange_user_mailbox_auditing_enabled import (
                exchange_user_mailbox_auditing_enabled,
            )

            exchange_client.audit_config = {"audit_log_age": 90}

            exchange_client.mailbox_audit_properties = [
                MailboxAuditProperties(
                    name="User3",
                    audit_enabled=False,
                    audit_admin=[],
                    audit_delegate=[],
                    audit_owner=[],
                    audit_log_age=0,
                    identity="User3",
                )
            ]

            check = exchange_user_mailbox_auditing_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Mailbox Audit Properties for Mailbox User3 is not enabled."
            )
            assert result[0].resource_name == "User3"
            assert result[0].resource_id == "User3"
            assert result[0].location == "global"
            assert (
                result[0].resource == exchange_client.mailbox_audit_properties[0].dict()
            )

    def test_audit_enabled_but_log_age_too_low(self):
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
                "prowler.providers.m365.services.exchange.exchange_user_mailbox_auditing_enabled.exchange_user_mailbox_auditing_enabled.exchange_client",
                new=exchange_client,
            ),
        ):
            from prowler.providers.m365.services.exchange.exchange_user_mailbox_auditing_enabled.exchange_user_mailbox_auditing_enabled import (
                exchange_user_mailbox_auditing_enabled,
            )

            exchange_client.audit_config = {"audit_log_age": 90}

            exchange_client.mailbox_audit_properties = [
                MailboxAuditProperties(
                    name="User4",
                    audit_enabled=True,
                    audit_admin=[e.value for e in AuditAdmin],
                    audit_delegate=[e.value for e in AuditDelegate],
                    audit_owner=[e.value for e in AuditOwner],
                    audit_log_age=30,
                    identity="User4",
                )
            ]

            check = exchange_user_mailbox_auditing_enabled()
            result = check.execute()

            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Mailbox Audit Properties for Mailbox User4 is enabled but the audit log age is less than 90 days (30 days)."
            )
            assert result[0].resource_name == "User4"
            assert result[0].resource_id == "User4"
            assert result[0].location == "global"
            assert (
                result[0].resource == exchange_client.mailbox_audit_properties[0].dict()
            )
```

--------------------------------------------------------------------------------

---[FILE: purview_service_test.py]---
Location: prowler-master/tests/providers/m365/services/purview/purview_service_test.py

```python
from unittest import mock
from unittest.mock import patch

from prowler.providers.m365.models import M365IdentityInfo
from prowler.providers.m365.services.purview.purview_service import (
    AuditLogConfig,
    Purview,
)
from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


def mock_get_audit_log_config(_):
    return AuditLogConfig(audit_log_search=True)


class Test_Purview_Service:
    def test_get_client(self):
        with (
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
        ):
            purview_client = Purview(
                set_mocked_m365_provider(
                    identity=M365IdentityInfo(tenant_domain=DOMAIN)
                )
            )
            assert purview_client.client.__class__.__name__ == "GraphServiceClient"
            assert purview_client.powershell.__class__.__name__ == "M365PowerShell"

    @patch(
        "prowler.providers.m365.services.purview.purview_service.Purview._get_audit_log_config",
        new=mock_get_audit_log_config,
    )
    def test_get_settings(self):
        with (
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
        ):
            purview_client = Purview(
                set_mocked_m365_provider(
                    identity=M365IdentityInfo(tenant_domain=DOMAIN)
                )
            )
            assert purview_client.audit_log_config == AuditLogConfig(
                audit_log_search=True
            )
```

--------------------------------------------------------------------------------

---[FILE: purview_audit_log_search_enabled_test.py]---
Location: prowler-master/tests/providers/m365/services/purview/purview_audit_log_search_enabled/purview_audit_log_search_enabled_test.py

```python
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_purview_audit_log_search_enabled:
    def test_audit_log_search_disabled(self):
        purview_client = mock.MagicMock()
        purview_client.audited_tenant = "audited_tenant"
        purview_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.purview.purview_audit_log_search_enabled.purview_audit_log_search_enabled.purview_client",
                new=purview_client,
            ),
        ):
            from prowler.providers.m365.services.purview.purview_audit_log_search_enabled.purview_audit_log_search_enabled import (
                purview_audit_log_search_enabled,
            )
            from prowler.providers.m365.services.purview.purview_service import (
                AuditLogConfig,
            )

            purview_client.audit_log_config = AuditLogConfig(audit_log_search=False)

            check = purview_audit_log_search_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended == "Purview audit log search is not enabled."
            )
            assert result[0].resource == purview_client.audit_log_config.dict()
            assert result[0].resource_name == "Purview Settings"
            assert result[0].resource_id == "purviewSettings"
            assert result[0].location == "global"
            purview_client.powershell.close()

    def test_audit_log_search_enabled(self):
        purview_client = mock.MagicMock()
        purview_client.audited_tenant = "audited_tenant"
        purview_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_exchange_online"
            ),
            mock.patch(
                "prowler.providers.m365.services.purview.purview_audit_log_search_enabled.purview_audit_log_search_enabled.purview_client",
                new=purview_client,
            ),
        ):
            from prowler.providers.m365.services.purview.purview_audit_log_search_enabled.purview_audit_log_search_enabled import (
                purview_audit_log_search_enabled,
            )
            from prowler.providers.m365.services.purview.purview_service import (
                AuditLogConfig,
            )

            purview_client.audit_log_config = AuditLogConfig(audit_log_search=True)

            check = purview_audit_log_search_enabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == "Purview audit log search is enabled."
            assert result[0].resource == purview_client.audit_log_config.dict()
            assert result[0].resource_name == "Purview Settings"
            assert result[0].resource_id == "purviewSettings"
            assert result[0].location == "global"
```

--------------------------------------------------------------------------------

---[FILE: sharepoint_service_test.py]---
Location: prowler-master/tests/providers/m365/services/sharepoint/sharepoint_service_test.py

```python
import uuid
from unittest.mock import patch

from prowler.providers.m365.models import M365IdentityInfo
from prowler.providers.m365.services.sharepoint.sharepoint_service import (
    SharePoint,
    SharePointSettings,
)
from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider

uuid_value = uuid.uuid4()


async def mock_sharepoint_get_settings(_):
    return SharePointSettings(
        sharingCapability="ExternalUserAndGuestSharing",
        sharingAllowedDomainList=["allowed-domain.com"],
        sharingBlockedDomainList=["blocked-domain.com"],
        sharingDomainRestrictionMode="allowList",
        resharingEnabled=False,
        legacyAuth=True,
        allowedDomainGuidsForSyncApp=[uuid_value],
    )


@patch(
    "prowler.providers.m365.services.sharepoint.sharepoint_service.SharePoint._get_settings",
    new=mock_sharepoint_get_settings,
)
class Test_SharePoint_Service:
    def test_get_client(self):
        with patch("prowler.providers.m365.lib.service.service.M365PowerShell"):
            sharepoint_client = SharePoint(
                set_mocked_m365_provider(
                    identity=M365IdentityInfo(tenant_domain=DOMAIN)
                )
            )
        assert sharepoint_client.client.__class__.__name__ == "GraphServiceClient"

    def test_get_settings(self):
        with patch("prowler.providers.m365.lib.service.service.M365PowerShell"):
            sharepoint_client = SharePoint(set_mocked_m365_provider())
        settings = sharepoint_client.settings
        assert settings.sharingCapability == "ExternalUserAndGuestSharing"
        assert settings.sharingAllowedDomainList == ["allowed-domain.com"]
        assert settings.sharingBlockedDomainList == ["blocked-domain.com"]
        assert settings.sharingDomainRestrictionMode == "allowList"
        assert settings.resharingEnabled is False
        assert settings.legacyAuth is True
        assert settings.allowedDomainGuidsForSyncApp == [uuid_value]
        assert len(settings.allowedDomainGuidsForSyncApp) == 1
```

--------------------------------------------------------------------------------

````
