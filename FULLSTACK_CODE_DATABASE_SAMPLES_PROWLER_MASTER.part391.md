---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 391
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 391 of 867)

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

---[FILE: exchange_roles_assignment_policy_addins_disabled.py]---
Location: prowler-master/prowler/providers/m365/services/exchange/exchange_roles_assignment_policy_addins_disabled/exchange_roles_assignment_policy_addins_disabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.exchange.exchange_client import exchange_client
from prowler.providers.m365.services.exchange.exchange_service import AddinRoles


class exchange_roles_assignment_policy_addins_disabled(Check):
    """Check if any Exchange role assignment policy allows Outlook add-ins.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """Execute the check for role assignment policies that allow Outlook add-ins.

        This method checks all Exchange Online Role Assignment Policies to verify
        whether any of them allow the installation of add-ins by including risky roles.

        Returns:
            List[CheckReportM365]: A list of reports containing the result of the check.
        """
        findings = []

        addin_roles = [e.value for e in AddinRoles]

        for policy in exchange_client.role_assignment_policies:
            report = CheckReportM365(
                metadata=self.metadata(),
                resource=policy,
                resource_name=policy.name,
                resource_id=policy.id,
            )

            report.status = "PASS"
            report.status_extended = f"Role assignment policy '{policy.name}' does not allow Outlook add-ins."

            risky_roles_found = []
            for role in policy.assigned_roles:
                if role in addin_roles:
                    risky_roles_found.append(role)

            if risky_roles_found:
                report.status = "FAIL"
                report.status_extended = f"Role assignment policy '{policy.name}' allows Outlook add-ins via roles: {', '.join(risky_roles_found)}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: exchange_transport_config_smtp_auth_disabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/exchange/exchange_transport_config_smtp_auth_disabled/exchange_transport_config_smtp_auth_disabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "exchange_transport_config_smtp_auth_disabled",
  "CheckTitle": "Ensure SMTP AUTH is disabled.",
  "CheckType": [],
  "ServiceName": "exchange",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Exchange Transport Config",
  "Description": "Ensure that SMTP AUTH is disabled at the organization level in Exchange Online to reduce exposure to legacy protocols that can be exploited for malicious use.",
  "Risk": "Leaving SMTP AUTH enabled allows legacy clients to authenticate using outdated methods, increasing the risk of credential compromise and unauthorized email sending.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission",
  "Remediation": {
    "Code": {
      "CLI": "Set-TransportConfig -SmtpClientAuthenticationDisabled $true",
      "NativeIaC": "",
      "Other": "1. Navigate to Exchange admin center https://admin.exchange.microsoft.com. 2. Select Settings > Mail flow. 3. Ensure 'Turn off SMTP AUTH protocol for your organization' is checked.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Disable SMTP AUTH at the organization level to support secure, modern authentication practices and block legacy protocol usage.",
      "Url": "https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission"
    }
  },
  "Categories": [
    "e3"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: exchange_transport_config_smtp_auth_disabled.py]---
Location: prowler-master/prowler/providers/m365/services/exchange/exchange_transport_config_smtp_auth_disabled/exchange_transport_config_smtp_auth_disabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.exchange.exchange_client import exchange_client


class exchange_transport_config_smtp_auth_disabled(Check):
    """Check if SMTP AUTH is disabled in Exchange Online Transport Config.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """Execute the check for SMTP AUTH setting in Transport Config.

        This method checks if SMTP AUTH is disabled at the organization level in Exchange Online.

        Returns:
            List[CheckReportM365]: A list of reports containing the result of the check.
        """
        findings = []
        transport_config = exchange_client.transport_config
        if transport_config:
            report = CheckReportM365(
                metadata=self.metadata(),
                resource=transport_config,
                resource_name="Transport Configuration",
                resource_id="transport_config",
            )
            report.status = "FAIL"
            report.status_extended = (
                "SMTP AUTH is enabled in the Exchange Online Transport Config."
            )

            if transport_config.smtp_auth_disabled:
                report.status = "PASS"
                report.status_extended = (
                    "SMTP AUTH is disabled in the Exchange Online Transport Config."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: exchange_transport_rules_mail_forwarding_disabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/exchange/exchange_transport_rules_mail_forwarding_disabled/exchange_transport_rules_mail_forwarding_disabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "exchange_transport_rules_mail_forwarding_disabled",
  "CheckTitle": "Ensure mail transport rules are set to disable mail forwarding.",
  "CheckType": [],
  "ServiceName": "exchange",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Exchange Transport Rules",
  "Description": "Ensure mail transport rules are set to disable mail forwarding.",
  "Risk": "Enabling email auto-forwarding can be exploited by attackers or malicious insiders to exfiltrate sensitive data outside the organization, often without detection.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/exchange/security-and-compliance/mail-flow-rules/configuration-best-practices",
  "Remediation": {
    "Code": {
      "CLI": "Remove-TransportRule -Identity <RuleName>",
      "NativeIaC": "",
      "Other": "1. Select Exchange to open the Exchange admin center. 2. Select Mail Flow then Rules. 3. For each rule that redirects email to external domains, select the rule and click the 'Delete' icon.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Block all forms of mail forwarding using Transport rules in Exchange Online. Apply exclusions only where justified by organizational policy.",
      "Url": "https://learn.microsoft.com/en-us/exchange/security-and-compliance/mail-flow-rules/mail-flow-rules"
    }
  },
  "Categories": [
    "e3"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: exchange_transport_rules_mail_forwarding_disabled.py]---
Location: prowler-master/prowler/providers/m365/services/exchange/exchange_transport_rules_mail_forwarding_disabled/exchange_transport_rules_mail_forwarding_disabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.exchange.exchange_client import exchange_client


class exchange_transport_rules_mail_forwarding_disabled(Check):
    """
    Check to ensure that no mail transport rules allow forwarding mail to external domains.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """
        Execute the check to validate that no transport rules allow forwarding mail to external domains.

        This method retrieves all transport rules from the Exchange service and evaluates
        whether any of them allow forwarding mail to external domains. A report is generated for each
        transport rule.

        Returns:
            List[CheckReportM365]: A list of findings with the status of each transport rule.
        """
        findings = []
        for rule in exchange_client.transport_rules:
            report = CheckReportM365(
                metadata=self.metadata(),
                resource=rule,
                resource_name=rule.name,
                resource_id="ExchangeTransportRule",
            )
            report.status = "PASS"
            report.status_extended = f"Transport rule {rule.name} does not allow forwarding mail to external domains."

            if rule.redirect_message_to:
                report.status = "FAIL"
                report.status_extended = f"Transport rule {rule.name} allows forwarding mail to external domains: {', '.join(rule.redirect_message_to)}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: exchange_transport_rules_whitelist_disabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/exchange/exchange_transport_rules_whitelist_disabled/exchange_transport_rules_whitelist_disabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "exchange_transport_rules_whitelist_disabled",
  "CheckTitle": "Ensure mail transport rules do not whitelist specific domains",
  "CheckType": [],
  "ServiceName": "exchange",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Exchange Transport Rules",
  "Description": "Mail flow rules (transport rules) in Exchange Online are used to identify and take action on messages that flow through the organization.",
  "Risk": "Whitelisting domains in transport rules bypasses regular malware and phishing scanning, which can enable an attacker to launch attacks against your users from a safe haven domain.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/exchange/security-and-compliance/mail-flow-rules/configuration-best-practices",
  "Remediation": {
    "Code": {
      "CLI": "Remove-TransportRule -Identity <RuleName>",
      "NativeIaC": "",
      "Other": "1. Navigate to Exchange admin center https://admin.exchange.microsoft.com.. 2. Click to expand Mail Flow and then select Rules. 3. For each rule that whitelists specific domains, select the rule and click the 'Delete' icon.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Remove transport rules that whitelist specific domains to ensure proper scanning.",
      "Url": "https://learn.microsoft.com/en-us/exchange/security-and-compliance/mail-flow-rules/mail-flow-rules"
    }
  },
  "Categories": [
    "e3"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: exchange_transport_rules_whitelist_disabled.py]---
Location: prowler-master/prowler/providers/m365/services/exchange/exchange_transport_rules_whitelist_disabled/exchange_transport_rules_whitelist_disabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.exchange.exchange_client import exchange_client


class exchange_transport_rules_whitelist_disabled(Check):
    """
    Check to ensure that no mail transport rules whitelist specific domains.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """
        Execute the check to validate that no transport rules whitelist specific domains.

        This method retrieves all transport rules from the Exchange service and evaluates
        whether any of them whitelist specific domains. A report is generated for each
        transport rule.

        Returns:
            List[CheckReportM365]: A list of findings with the status of each transport rule.
        """
        findings = []

        for rule in exchange_client.transport_rules:
            report = CheckReportM365(
                metadata=self.metadata(),
                resource=rule,
                resource_name=rule.name,
                resource_id="ExchangeTransportRule",
            )

            report.status = "PASS"
            report.status_extended = (
                f"Transport rule {rule.name} does not whitelist any domains."
            )

            if rule.sender_domain_is and rule.scl == -1:
                report.status = "FAIL"
                report.status_extended = f"Transport rule {rule.name} whitelists domains: {', '.join(rule.sender_domain_is)}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: exchange_user_mailbox_auditing_enabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/exchange/exchange_user_mailbox_auditing_enabled/exchange_user_mailbox_auditing_enabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "exchange_user_mailbox_auditing_enabled",
  "CheckTitle": "Ensure mailbox auditing is enabled for all user mailboxes.",
  "CheckType": [],
  "ServiceName": "exchange",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Exchange Mailboxes Properties",
  "Description": "Ensure mailbox auditing is enabled for all user mailboxes, including the configuration of audit actions for owners, delegates, and admins beyond the Microsoft defaults. The difference between both subscription is the log age so this parameter is configurable and users can set it to their subscription needs.",
  "Risk": "If auditing is not properly enabled and configured, critical mailbox actions may go unrecorded, reducing the ability to investigate incidents, enforce compliance, or detect malicious behavior.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/purview/audit-mailboxes?view=o365-worldwide",
  "Remediation": {
    "Code": {
      "CLI": "$AuditAdmin = @(\"ApplyRecord\", \"Copy\", \"Create\", \"FolderBind\", \"HardDelete\", \"Move\", \"MoveToDeletedItems\", \"SendAs\", \"SendOnBehalf\", \"SoftDelete\", \"Update\", \"UpdateCalendarDelegation\", \"UpdateFolderPermissions\", \"UpdateInboxRules\"); $AuditDelegate = @(\"ApplyRecord\", \"Create\", \"FolderBind\", \"HardDelete\", \"Move\", \"MoveToDeletedItems\", \"SendAs\", \"SendOnBehalf\", \"SoftDelete\", \"Update\", \"UpdateFolderPermissions\", \"UpdateInboxRules\"); $AuditOwner = @(\"ApplyRecord\", \"Create\", \"HardDelete\", \"MailboxLogin\", \"Move\", \"MoveToDeletedItems\", \"SoftDelete\", \"Update\", \"UpdateCalendarDelegation\", \"UpdateFolderPermissions\", \"UpdateInboxRules\"); $MBX = Get-EXOMailbox -ResultSize Unlimited | Where-Object { $_.RecipientTypeDetails -eq \"UserMailbox\" }; $MBX | Set-Mailbox -AuditEnabled $true -AuditLogAgeLimit 90 -AuditAdmin $AuditAdmin -AuditDelegate $AuditDelegate -AuditOwner $AuditOwner",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable mailbox auditing for all user mailboxes and configure auditing for key mailbox actions for owners, delegates, and admins.",
      "Url": "https://learn.microsoft.com/en-us/purview/audit-mailboxes?view=o365-worldwide"
    }
  },
  "Categories": [
    "e3",
    "e5"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: exchange_user_mailbox_auditing_enabled.py]---
Location: prowler-master/prowler/providers/m365/services/exchange/exchange_user_mailbox_auditing_enabled/exchange_user_mailbox_auditing_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.exchange.exchange_client import exchange_client
from prowler.providers.m365.services.exchange.exchange_service import (
    AuditAdmin,
    AuditDelegate,
    AuditOwner,
)


class exchange_user_mailbox_auditing_enabled(Check):
    """
    Check to ensure mailbox auditing is enabled for all user mailboxes.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """
        Execute the check to validate that mailbox auditing is enabled for all user mailboxes.

        This method retrieves all mailbox audit properties from the Exchange service and evaluates
        whether auditing is enabled and correctly configured for each mailbox. A report is generated
        for each mailbox.

        Returns:
            List[CheckReportM365]: A list of findings with the status of each mailbox.
        """
        findings = []

        required_admin = {e.value for e in AuditAdmin}
        required_delegate = {e.value for e in AuditDelegate}
        required_owner = {e.value for e in AuditOwner}

        for mailbox in exchange_client.mailbox_audit_properties:
            report = CheckReportM365(
                metadata=self.metadata(),
                resource=mailbox,
                resource_name=mailbox.name,
                resource_id=mailbox.identity,
            )

            report.status = "FAIL"
            report.status_extended = (
                f"Mailbox Audit Properties for Mailbox {mailbox.name} is not enabled."
            )

            if mailbox.audit_enabled:
                audit_admin = set(mailbox.audit_admin or [])
                audit_delegate = set(mailbox.audit_delegate or [])
                audit_owner = set(mailbox.audit_owner or [])

                if (
                    required_admin.issubset(audit_admin)
                    and required_delegate.issubset(audit_delegate)
                    and required_owner.issubset(audit_owner)
                ):
                    if mailbox.audit_log_age >= exchange_client.audit_config.get(
                        "audit_log_age", 90
                    ):
                        report.status = "PASS"
                        report.status_extended = f"Mailbox Audit Properties for Mailbox {mailbox.name} is enabled with an audit log age of {mailbox.audit_log_age} days."
                    else:
                        report.status_extended = f"Mailbox Audit Properties for Mailbox {mailbox.name} is enabled but the audit log age is less than {exchange_client.audit_config.get('audit_log_age', 90)} days ({mailbox.audit_log_age} days)."
                else:
                    report.status_extended = f"Mailbox Audit Properties for Mailbox {mailbox.name} is enabled but without all audit actions configured."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: purview_client.py]---
Location: prowler-master/prowler/providers/m365/services/purview/purview_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.m365.services.purview.purview_service import Purview

purview_client = Purview(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: purview_service.py]---
Location: prowler-master/prowler/providers/m365/services/purview/purview_service.py
Signals: Pydantic

```python
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.m365.lib.service.service import M365Service
from prowler.providers.m365.m365_provider import M365Provider


class Purview(M365Service):
    def __init__(self, provider: M365Provider):
        super().__init__(provider)
        self.audit_log_config = None

        if self.powershell:
            if self.powershell.connect_exchange_online():
                self.audit_log_config = self._get_audit_log_config()
            self.powershell.close()

    def _get_audit_log_config(self):
        logger.info("M365 - Getting Admin Audit Log settings...")
        audit_log_config = None
        try:
            audit_log_config_response = self.powershell.get_audit_log_config()
            if audit_log_config_response:
                audit_log_config = AuditLogConfig(
                    audit_log_search=audit_log_config_response.get(
                        "UnifiedAuditLogIngestionEnabled", False
                    )
                )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return audit_log_config


class AuditLogConfig(BaseModel):
    audit_log_search: bool
```

--------------------------------------------------------------------------------

---[FILE: purview_audit_log_search_enabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/purview/purview_audit_log_search_enabled/purview_audit_log_search_enabled.metadata.json
Signals: Next.js

```json
{
  "Provider": "m365",
  "CheckID": "purview_audit_log_search_enabled",
  "CheckTitle": "Ensure Purview audit log search is enabled",
  "CheckType": [],
  "ServiceName": "purview",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "Purview Settings",
  "Description": "Ensure Purview audit log search is enabled.",
  "Risk": "Disabling Microsoft 365 audit log search can hinder the ability to track and monitor user and admin activities, making it harder to detect suspicious behavior, security incidents, or compliance violations. This can result in undetected breaches and inability to respond to incidents effectively.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/purview/audit-search?tabs=microsoft-purview-portal",
  "Remediation": {
    "Code": {
      "CLI": "Set-AdminAuditLogConfig -UnifiedAuditLogIngestionEnabled $true",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft Purview https://compliance.microsoft.com. 2. Select Audit to open the audit search. 3. Click Start recording user and admin activity next to the information warning at the top. 4. Click Yes on the dialog box to confirm.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that Microsoft 365 audit log search is enabled to maintain a comprehensive record of user and admin activities. This will help improve security monitoring, support compliance needs, and provide critical insights for responding to incidents.",
      "Url": "https://learn.microsoft.com/en-us/purview/audit-search?tabs=microsoft-purview-portal"
    }
  },
  "Categories": [
    "e3"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: purview_audit_log_search_enabled.py]---
Location: prowler-master/prowler/providers/m365/services/purview/purview_audit_log_search_enabled/purview_audit_log_search_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.purview.purview_client import purview_client


class purview_audit_log_search_enabled(Check):
    """Check if Purview audit log search is enabled.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """Execute the check for audit log search

        This method checks if audit log search is enabled Purview settings

        Returns:
            List[CheckReportM365]: A list of reports containing the result of the check.
        """
        findings = []
        audit_log_config = purview_client.audit_log_config
        if audit_log_config:
            report = CheckReportM365(
                metadata=self.metadata(),
                resource=audit_log_config if audit_log_config else {},
                resource_name="Purview Settings",
                resource_id="purviewSettings",
            )
            report.status = "FAIL"
            report.status_extended = "Purview audit log search is not enabled."

            if purview_client.audit_log_config and getattr(
                purview_client.audit_log_config, "audit_log_search", False
            ):
                report.status = "PASS"
                report.status_extended = "Purview audit log search is enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sharepoint_client.py]---
Location: prowler-master/prowler/providers/m365/services/sharepoint/sharepoint_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.m365.services.sharepoint.sharepoint_service import SharePoint

sharepoint_client = SharePoint(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: sharepoint_service.py]---
Location: prowler-master/prowler/providers/m365/services/sharepoint/sharepoint_service.py
Signals: Pydantic

```python
import asyncio
import uuid
from typing import List, Optional

from msgraph.generated.models.o_data_errors.o_data_error import ODataError
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.m365.lib.service.service import M365Service
from prowler.providers.m365.m365_provider import M365Provider


class SharePoint(M365Service):
    def __init__(self, provider: M365Provider):
        super().__init__(provider)
        if self.powershell:
            self.powershell.close()

        created_loop = False
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            created_loop = True

        if loop.is_closed():
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            created_loop = True

        if loop.is_running():
            raise RuntimeError(
                "Cannot initialize SharePoint service while event loop is running"
            )

        self.tenant_domain = provider.identity.tenant_domain
        attributes = loop.run_until_complete(
            asyncio.gather(
                self._get_settings(),
            )
        )
        self.settings = attributes[0]

        if created_loop:
            asyncio.set_event_loop(None)
            loop.close()

    async def _get_settings(self):
        logger.info("M365 - Getting SharePoint global settings...")
        settings = None
        try:
            global_settings = await self.client.admin.sharepoint.settings.get()
            settings = SharePointSettings(
                sharingCapability=(
                    str(global_settings.sharing_capability).split(".")[-1]
                    if global_settings.sharing_capability
                    else None
                ),
                sharingAllowedDomainList=global_settings.sharing_allowed_domain_list,
                sharingBlockedDomainList=global_settings.sharing_blocked_domain_list,
                sharingDomainRestrictionMode=global_settings.sharing_domain_restriction_mode,
                legacyAuth=global_settings.is_legacy_auth_protocols_enabled,
                resharingEnabled=global_settings.is_resharing_by_external_users_enabled,
                allowedDomainGuidsForSyncApp=global_settings.allowed_domain_guids_for_sync_app,
            )

        except ODataError as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return None
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
            return None
        return settings


class SharePointSettings(BaseModel):
    sharingCapability: str
    sharingAllowedDomainList: Optional[List[str]]
    sharingBlockedDomainList: Optional[List[str]]
    sharingDomainRestrictionMode: str
    resharingEnabled: bool
    legacyAuth: bool
    allowedDomainGuidsForSyncApp: List[uuid.UUID]
```

--------------------------------------------------------------------------------

---[FILE: sharepoint_external_sharing_managed.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/sharepoint/sharepoint_external_sharing_managed/sharepoint_external_sharing_managed.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "sharepoint_external_sharing_managed",
  "CheckTitle": "Ensure SharePoint external sharing is managed through domain whitelists/blacklists.",
  "CheckType": [],
  "ServiceName": "sharepoint",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Sharepoint Settings",
  "Description": "Control the sharing of documents to external domains by either blocking specific domains or only allowing sharing with named trusted domains.",
  "Risk": "If domain-based sharing restrictions are not enforced, users may share documents with untrusted external entities, increasing the risk of data exfiltration or unauthorized access.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/sharepoint/turn-external-sharing-on-or-off",
  "Remediation": {
    "Code": {
      "CLI": "Set-SPOTenant -SharingDomainRestrictionMode AllowList -SharingAllowedDomainList 'domain1.com domain2.com'",
      "NativeIaC": "",
      "Other": "1. Navigate to SharePoint admin center https://admin.microsoft.com/sharepoint. 2. Expand Policies then click Sharing. 3. Expand More external sharing settings and check 'Limit external sharing by domain'. 4. Select 'Add domains' to configure a list of approved domains. 5. Click Save.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enforce domain-based restrictions for SharePoint external sharing to control document sharing with trusted domains.",
      "Url": "https://learn.microsoft.com/en-us/powershell/module/sharepoint-online/set-spotenant?view=sharepoint-ps"
    }
  },
  "Categories": [
    "e3"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: sharepoint_external_sharing_managed.py]---
Location: prowler-master/prowler/providers/m365/services/sharepoint/sharepoint_external_sharing_managed/sharepoint_external_sharing_managed.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.sharepoint.sharepoint_client import (
    sharepoint_client,
)


class sharepoint_external_sharing_managed(Check):
    """
    Check if Microsoft 365 SharePoint external sharing is managed through domain whitelists/blacklists.

    This check verifies that SharePoint external sharing settings are configured to restrict document sharing
    to external domains by enforcing domain-based restrictions. When external sharing is enabled, the setting
    'sharingDomainRestrictionMode' must be set to either "AllowList" or "BlockList" with a corresponding
    domain list. If external sharing is disabled at the organization level, the check passes.
    """

    def execute(self) -> List[CheckReportM365]:
        """
        Execute the SharePoint external sharing management check.

        Iterates over the SharePoint settings retrieved from the Microsoft 365 SharePoint client and
        generates a report indicating whether external sharing is managed via domain restrictions.

        Returns:
            List[CheckReportM365]: A list containing a report with the result of the check.
        """
        findings = []
        settings = sharepoint_client.settings
        if settings:
            report = CheckReportM365(
                self.metadata(),
                resource=settings if settings else {},
                resource_name="SharePoint Settings",
                resource_id="sharepointSettings",
            )
            report.status = "FAIL"
            report.status_extended = "SharePoint external sharing is not managed through domain restrictions."
            if settings.sharingCapability == "Disabled":
                report.status = "PASS"
                report.status_extended = (
                    "External sharing is disabled at organization level."
                )
            elif settings.sharingDomainRestrictionMode in ["allowList", "blockList"]:
                report.status_extended = f"SharePoint external sharing is managed through domain restrictions with mode '{settings.sharingDomainRestrictionMode}' but the list is empty."
                if (
                    settings.sharingDomainRestrictionMode == "allowList"
                    and settings.sharingAllowedDomainList
                ):
                    report.status = "PASS"
                    report.status_extended = f"SharePoint external sharing is managed through domain restrictions with mode '{settings.sharingDomainRestrictionMode}'."
                elif (
                    settings.sharingDomainRestrictionMode == "blockList"
                    and settings.sharingBlockedDomainList
                ):
                    report.status = "PASS"
                    report.status_extended = f"SharePoint external sharing is managed through domain restrictions with mode '{settings.sharingDomainRestrictionMode}'."

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: sharepoint_external_sharing_restricted.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/sharepoint/sharepoint_external_sharing_restricted/sharepoint_external_sharing_restricted.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "sharepoint_external_sharing_restricted",
  "CheckTitle": "Ensure external content sharing is restricted.",
  "CheckType": [],
  "ServiceName": "sharepoint",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Sharepoint Settings",
  "Description": "Ensure that external sharing settings in SharePoint are restricted to 'New and existing guests' or a less permissive level to enforce authentication and control over shared content.",
  "Risk": "If external sharing is not restricted, unauthorized users may gain access to sensitive information, increasing the risk of data breaches and compliance violations.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/sharepoint/turn-external-sharing-on-or-off",
  "Remediation": {
    "Code": {
      "CLI": "Set-SPOTenant -SharingCapability ExternalUserSharingOnly",
      "NativeIaC": "",
      "Other": "1. Navigate to SharePoint admin center https://admin.microsoft.com/sharepoint. 2. Click to expand Policies > Sharing. 3. Locate the External sharing section. 4. Under SharePoint, move the slider bar to 'New and existing guests' or a less permissive level.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict external sharing in SharePoint to 'New and existing guests' or a more restrictive setting to enhance security.",
      "Url": "https://learn.microsoft.com/en-us/powershell/module/sharepoint-online/set-spotenant?view=sharepoint-ps"
    }
  },
  "Categories": [
    "e3"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: sharepoint_external_sharing_restricted.py]---
Location: prowler-master/prowler/providers/m365/services/sharepoint/sharepoint_external_sharing_restricted/sharepoint_external_sharing_restricted.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.sharepoint.sharepoint_client import (
    sharepoint_client,
)


class sharepoint_external_sharing_restricted(Check):
    """
    Check if Microsoft 365 SharePoint restricts external sharing at organization level.

    This check verifies that external sharing settings in SharePoint are configured to allow only "New and existing guests"
    (i.e., ExternalUserSharingOnly), which enforces authentication and limits access to external users. If a more permissive
    setting is used, legacy sharing may be allowed, increasing the risk of unauthorized data access.
    """

    def execute(self) -> List[CheckReportM365]:
        """
        Execute the SharePoint external sharing restriction check.

        Iterates over the SharePoint settings retrieved from the Microsoft 365 SharePoint client and generates a report
        indicating whether external sharing is restricted to 'New and existing guests' (ExternalUserSharingOnly).

        Returns:
            List[Check_Report_M365]: A list containing a report with the result of the check.
        """
        findings = []
        settings = sharepoint_client.settings
        if settings:
            report = CheckReportM365(
                self.metadata(),
                resource=settings if settings else {},
                resource_name="SharePoint Settings",
                resource_id="sharepointSettings",
            )
            report.status = "FAIL"
            report.status_extended = (
                "External sharing is not restricted and guests users can access."
            )

            if settings.sharingCapability in [
                "ExistingExternalUserSharingOnly",
                "ExternalUserSharingOnly",
                "Disabled",
            ]:
                report.status = "PASS"
                report.status_extended = "External sharing is restricted to external user sharing or more restrictive."

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: sharepoint_guest_sharing_restricted.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/sharepoint/sharepoint_guest_sharing_restricted/sharepoint_guest_sharing_restricted.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "sharepoint_guest_sharing_restricted",
  "CheckTitle": "Ensure that SharePoint guest users cannot share items they don't own.",
  "CheckType": [],
  "ServiceName": "sharepoint",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Sharepoint Settings",
  "Description": "Ensure that guest users in SharePoint cannot share items they do not own, preventing unauthorized disclosure of shared content.",
  "Risk": "If guest users are allowed to share items they don't own, there is a higher risk of unauthorized data exposure, as external users could share content beyond intended recipients.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/sharepoint/external-sharing-overview",
  "Remediation": {
    "Code": {
      "CLI": "Set-SPOTenant -PreventExternalUsersFromResharing $True",
      "NativeIaC": "",
      "Other": "1. Navigate to SharePoint admin center https://admin.microsoft.com/sharepoint. 2. Click to expand Policies then select Sharing. 3. Expand More external sharing settings and uncheck 'Allow guests to share items they don't own'. 4. Click Save.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict guest users from sharing items they don't own to enhance security and prevent unauthorized access.",
      "Url": "https://learn.microsoft.com/en-us/sharepoint/turn-external-sharing-on-or-off"
    }
  },
  "Categories": [
    "e3"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

````
