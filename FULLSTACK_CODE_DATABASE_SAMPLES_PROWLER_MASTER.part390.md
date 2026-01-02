---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 390
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 390 of 867)

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

---[FILE: exchange_service.py]---
Location: prowler-master/prowler/providers/m365/services/exchange/exchange_service.py
Signals: Pydantic

```python
from enum import Enum
from typing import Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.m365.lib.service.service import M365Service
from prowler.providers.m365.m365_provider import M365Provider


class Exchange(M365Service):
    def __init__(self, provider: M365Provider):
        super().__init__(provider)
        self.organization_config = None
        self.mailboxes_config = []
        self.external_mail_config = []
        self.transport_rules = []
        self.transport_config = None
        self.mailbox_policies = []
        self.role_assignment_policies = []
        self.mailbox_audit_properties = []

        if self.powershell:
            if self.powershell.connect_exchange_online():
                self.organization_config = self._get_organization_config()
                self.mailboxes_config = self._get_mailbox_audit_config()
                self.external_mail_config = self._get_external_mail_config()
                self.transport_rules = self._get_transport_rules()
                self.transport_config = self._get_transport_config()
                self.mailbox_policies = self._get_mailbox_policy()
                self.role_assignment_policies = self._get_role_assignment_policies()
                self.mailbox_audit_properties = self._get_mailbox_audit_properties()
            self.powershell.close()

    def _get_organization_config(self):
        logger.info("Microsoft365 - Getting Exchange Organization configuration...")
        organization_config = None
        try:
            organization_configuration = self.powershell.get_organization_config()
            if organization_configuration:
                organization_config = Organization(
                    name=organization_configuration.get("Name", ""),
                    guid=organization_configuration.get("Guid", ""),
                    audit_disabled=organization_configuration.get(
                        "AuditDisabled", False
                    ),
                    oauth_enabled=organization_configuration.get(
                        "OAuth2ClientProfileEnabled", True
                    ),
                    mailtips_enabled=organization_configuration.get(
                        "MailTipsAllTipsEnabled", True
                    ),
                    mailtips_external_recipient_enabled=organization_configuration.get(
                        "MailTipsExternalRecipientsTipsEnabled", False
                    ),
                    mailtips_group_metrics_enabled=organization_configuration.get(
                        "MailTipsGroupMetricsEnabled", True
                    ),
                    mailtips_large_audience_threshold=organization_configuration.get(
                        "MailTipsLargeAudienceThreshold", 25
                    ),
                )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return organization_config

    def _get_mailbox_audit_config(self):
        logger.info("Microsoft365 - Getting mailbox audit configuration...")
        mailboxes_config = []
        try:
            mailbox_audit_data = self.powershell.get_mailbox_audit_config()
            for mailbox_audit_config in mailbox_audit_data:
                mailboxes_config.append(
                    MailboxAuditConfig(
                        name=mailbox_audit_config.get("Name", ""),
                        id=mailbox_audit_config.get("Id", ""),
                        audit_bypass_enabled=mailbox_audit_config.get(
                            "AuditBypassEnabled", True
                        ),
                    )
                )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return mailboxes_config

    def _get_external_mail_config(self):
        logger.info("Microsoft365 - Getting external mail configuration...")
        external_mail_config = []
        try:
            external_mail_configuration = self.powershell.get_external_mail_config()
            if not external_mail_configuration:
                return external_mail_config
            if isinstance(external_mail_configuration, dict):
                external_mail_configuration = [external_mail_configuration]
            for external_mail in external_mail_configuration:
                if external_mail:
                    external_mail_config.append(
                        ExternalMailConfig(
                            identity=external_mail.get("Identity", ""),
                            external_mail_tag_enabled=external_mail.get(
                                "Enabled", False
                            ),
                        )
                    )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return external_mail_config

    def _get_transport_rules(self):
        logger.info("Microsoft365 - Getting transport rules configuration...")
        transport_rules = []
        try:
            rules_data = self.powershell.get_transport_rules()
            if not rules_data:
                return transport_rules
            if isinstance(rules_data, dict):
                rules_data = [rules_data]
            for rule in rules_data:
                if rule:
                    sender_domain_is = rule.get("SenderDomainIs", [])
                    if sender_domain_is is None:
                        sender_domain_is = []

                    redirect_message_to = rule.get("RedirectMessageTo", [])
                    if redirect_message_to is None:
                        redirect_message_to = []

                    transport_rules.append(
                        TransportRule(
                            name=rule.get("Name", ""),
                            scl=rule.get("SetSCL", None),
                            sender_domain_is=sender_domain_is,
                            redirect_message_to=redirect_message_to,
                        )
                    )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return transport_rules

    def _get_transport_config(self):
        logger.info("Microsoft365 - Getting transport configuration...")
        transport_config = []
        try:
            transport_configuration = self.powershell.get_transport_config()
            if transport_configuration:
                transport_config = TransportConfig(
                    smtp_auth_disabled=transport_configuration.get(
                        "SmtpClientAuthenticationDisabled", False
                    ),
                )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return transport_config

    def _get_mailbox_policy(self):
        logger.info("Microsoft365 - Getting mailbox policy configuration...")
        mailbox_policies = []
        try:
            policies_data = self.powershell.get_mailbox_policy()
            if policies_data:
                if isinstance(policies_data, dict):
                    policies_data = [policies_data]
                for policy in policies_data:
                    if policy:
                        mailbox_policies.append(
                            MailboxPolicy(
                                id=policy.get("Id", ""),
                                additional_storage_enabled=policy.get(
                                    "AdditionalStorageProvidersAvailable", True
                                ),
                            )
                        )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return mailbox_policies

    def _get_role_assignment_policies(self):
        logger.info("Microsoft365 - Getting role assignment policies...")
        role_assignment_policies = []
        try:
            policies_data = self.powershell.get_role_assignment_policies()
            if not policies_data:
                return role_assignment_policies
            if isinstance(policies_data, dict):
                policies_data = [policies_data]
            for policy in policies_data:
                if policy:
                    role_assignment_policies.append(
                        RoleAssignmentPolicy(
                            name=policy.get("Name", ""),
                            id=policy.get("Guid", ""),
                            assigned_roles=policy.get("AssignedRoles", []),
                        )
                    )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return role_assignment_policies

    def _get_mailbox_audit_properties(self):
        logger.info("Microsoft365 - Getting mailbox audit properties...")
        mailbox_audit_properties = []
        try:
            mailbox_audit_properties_info = (
                self.powershell.get_mailbox_audit_properties()
            )
            if not mailbox_audit_properties_info:
                return mailbox_audit_properties
            if isinstance(mailbox_audit_properties_info, dict):
                mailbox_audit_properties_info = [mailbox_audit_properties_info]
            for mailbox_audit_property in mailbox_audit_properties_info:
                if mailbox_audit_property:
                    mailbox_audit_properties.append(
                        MailboxAuditProperties(
                            name=mailbox_audit_property.get("UserPrincipalName", ""),
                            audit_enabled=mailbox_audit_property.get(
                                "AuditEnabled", False
                            ),
                            audit_admin=mailbox_audit_property.get("AuditAdmin", []),
                            audit_delegate=mailbox_audit_property.get(
                                "AuditDelegate", []
                            ),
                            audit_owner=mailbox_audit_property.get("AuditOwner", []),
                            audit_log_age=int(
                                mailbox_audit_property.get(
                                    "AuditLogAgeLimit", "90.00:00:00"
                                ).split(".")[0]
                            ),
                            identity=mailbox_audit_property.get("Identity", ""),
                        )
                    )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return mailbox_audit_properties


class Organization(BaseModel):
    name: str
    guid: str
    audit_disabled: bool
    oauth_enabled: bool
    mailtips_enabled: bool
    mailtips_external_recipient_enabled: bool
    mailtips_group_metrics_enabled: bool
    mailtips_large_audience_threshold: int


class MailboxAuditConfig(BaseModel):
    name: str
    id: str
    audit_bypass_enabled: bool


class ExternalMailConfig(BaseModel):
    identity: str
    external_mail_tag_enabled: bool


class TransportRule(BaseModel):
    name: str
    scl: Optional[int]
    sender_domain_is: Optional[list[str]]
    redirect_message_to: Optional[list[str]]


class TransportConfig(BaseModel):
    smtp_auth_disabled: bool


class MailboxPolicy(BaseModel):
    id: str
    additional_storage_enabled: bool


class RoleAssignmentPolicy(BaseModel):
    name: str
    id: str
    assigned_roles: list[str]


class AddinRoles(Enum):
    MY_CUSTOM_APPS = "My Custom Apps"
    MY_MARKETPLACE_APPS = "My Marketplace Apps"
    MY_READWRITE_MAILBOX_APPS = "My ReadWriteMailbox Apps"


class MailboxAuditProperties(BaseModel):
    name: str
    audit_enabled: bool
    audit_admin: list[str]
    audit_delegate: list[str]
    audit_owner: list[str]
    audit_log_age: int
    identity: str


class AuditAdmin(Enum):
    APPLY_RECORD = "ApplyRecord"
    COPY = "Copy"
    CREATE = "Create"
    FOLDER_BIND = "FolderBind"
    HARD_DELETE = "HardDelete"
    MOVE = "Move"
    MOVE_TO_DELETED_ITEMS = "MoveToDeletedItems"
    SEND_AS = "SendAs"
    SEND_ON_BEHALF = "SendOnBehalf"
    SOFT_DELETE = "SoftDelete"
    UPDATE = "Update"
    UPDATE_CALENDAR_DELEGATION = "UpdateCalendarDelegation"
    UPDATE_FOLDER_PERMISSIONS = "UpdateFolderPermissions"
    UPDATE_INBOX_RULES = "UpdateInboxRules"


class AuditDelegate(Enum):
    APPLY_RECORD = "ApplyRecord"
    CREATE = "Create"
    FOLDER_BIND = "FolderBind"
    HARD_DELETE = "HardDelete"
    MOVE = "Move"
    MOVE_TO_DELETED_ITEMS = "MoveToDeletedItems"
    SEND_AS = "SendAs"
    SEND_ON_BEHALF = "SendOnBehalf"
    SOFT_DELETE = "SoftDelete"
    UPDATE = "Update"
    UPDATE_FOLDER_PERMISSIONS = "UpdateFolderPermissions"
    UPDATE_INBOX_RULES = "UpdateInboxRules"


class AuditOwner(Enum):
    APPLY_RECORD = "ApplyRecord"
    CREATE = "Create"
    HARD_DELETE = "HardDelete"
    MAILBOX_LOGIN = "MailboxLogin"
    MOVE = "Move"
    MOVE_TO_DELETED_ITEMS = "MoveToDeletedItems"
    SOFT_DELETE = "SoftDelete"
    UPDATE = "Update"
    UPDATE_CALENDAR_DELEGATION = "UpdateCalendarDelegation"
    UPDATE_FOLDER_PERMISSIONS = "UpdateFolderPermissions"
    UPDATE_INBOX_RULES = "UpdateInboxRules"
```

--------------------------------------------------------------------------------

---[FILE: exchange_external_email_tagging_enabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/exchange/exchange_external_email_tagging_enabled/exchange_external_email_tagging_enabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "exchange_external_email_tagging_enabled",
  "CheckTitle": "Ensure email from external senders is identified.",
  "CheckType": [],
  "ServiceName": "exchange",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Exchange External Mail Tagging",
  "Description": "Ensure that emails from external senders are identified using the native External tag experience in Outlook clients, which helps users recognize messages originating outside the organization.",
  "Risk": "If external email tagging is not enabled, users may be unable to quickly identify emails coming from outside the organization, increasing the risk of phishing or social engineering attacks.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/powershell/module/exchange/set-externalinoutlook?view=exchange-ps",
  "Remediation": {
    "Code": {
      "CLI": "Set-ExternalInOutlook -Enabled $true",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable the External tag for Outlook to help users visually identify emails from outside the organization.",
      "Url": "https://techcommunity.microsoft.com/t5/exchange-team-blog/native-external-sender-callouts-on-email-in-outlook/ba-p/2250098"
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

---[FILE: exchange_external_email_tagging_enabled.py]---
Location: prowler-master/prowler/providers/m365/services/exchange/exchange_external_email_tagging_enabled/exchange_external_email_tagging_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.exchange.exchange_client import exchange_client


class exchange_external_email_tagging_enabled(Check):
    """Ensure email from external senders is identified.

    This check verifies that the native "External" sender tag feature is enabled
    in Exchange so that messages from outside the organization are automatically marked.
    """

    def execute(self) -> List[CheckReportM365]:
        """Run the check to validate that external sender tagging is enabled.

        Iterates through the external mail configuration to determine if the
        ExternalInOutlook setting is turned on and generates a report accordingly.

        Returns:
            List[CheckReportM365]: A list of reports for each organization identity.
        """
        findings = []

        for mail_config in exchange_client.external_mail_config:
            report = CheckReportM365(
                metadata=self.metadata(),
                resource=mail_config,
                resource_name=mail_config.identity,
                resource_id=mail_config.identity,
            )
            report.status = "FAIL"
            report.status_extended = f"External sender tagging is disabled for Exchange identity {mail_config.identity}."

            if mail_config.external_mail_tag_enabled:
                report.status = "PASS"
                report.status_extended = f"External sender tagging is enabled for Exchange identity {mail_config.identity}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: exchange_mailbox_audit_bypass_disabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/exchange/exchange_mailbox_audit_bypass_disabled/exchange_mailbox_audit_bypass_disabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "exchange_mailbox_audit_bypass_disabled",
  "CheckTitle": "Ensure 'AuditBypassEnabled' is not enabled on any mailbox in the organization.",
  "CheckType": [],
  "ServiceName": "exchange",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Exchange Mailboxes",
  "Description": "Ensure that no mailboxes in the organization have 'AuditBypassEnabled' set to true. This setting prevents mailbox audit logging and can allow unauthorized access without traceability.",
  "Risk": "If 'AuditBypassEnabled' is set to true for any mailbox, access to those mailboxes won't be logged, creating a blind spot in forensic analysis and increasing the risk of undetected malicious activity.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/powershell/module/exchange/get-mailboxauditbypassassociation?view=exchange-ps",
  "Remediation": {
    "Code": {
      "CLI": "$MBXAudit = Get-MailboxAuditBypassAssociation -ResultSize unlimited | Where-Object { $_.AuditBypassEnabled -eq $true }; foreach ($mailbox in $MBXAudit) { $mailboxName = $mailbox.Name; Set-MailboxAuditBypassAssociation -Identity $mailboxName -AuditBypassEnabled $false; Write-Host \"Audit Bypass disabled for mailbox Identity: $mailboxName\" -ForegroundColor Green }",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that no mailboxes have 'AuditBypassEnabled' enabled to guarantee full audit logging for all mailbox activities.",
      "Url": "https://learn.microsoft.com/en-us/powershell/module/exchange/set-mailboxauditbypassassociation?view=exchange-ps"
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

---[FILE: exchange_mailbox_audit_bypass_disabled.py]---
Location: prowler-master/prowler/providers/m365/services/exchange/exchange_mailbox_audit_bypass_disabled/exchange_mailbox_audit_bypass_disabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.exchange.exchange_client import exchange_client


class exchange_mailbox_audit_bypass_disabled(Check):
    """Verify if Exchange mailbox auditing is enabled.

    This check ensures that mailbox auditing is not bypassed and is properly enabled.
    """

    def execute(self) -> List[CheckReportM365]:
        """Run the check to validate Exchange mailbox auditing.

        Iterates through the mailbox configurations to determine if auditing is enabled
        and generates a report for each mailbox.

        Returns:
            List[CheckReportM365]: A list of reports with the audit status for each mailbox.
        """
        findings = []
        for mailbox_config in exchange_client.mailboxes_config:
            report = CheckReportM365(
                metadata=self.metadata(),
                resource=mailbox_config,
                resource_name=mailbox_config.name,
                resource_id=mailbox_config.id,
            )
            report.status = "FAIL"
            report.status_extended = f"Exchange mailbox auditing is bypassed and not enabled for mailbox: {mailbox_config.name}."

            if not mailbox_config.audit_bypass_enabled:
                report.status = "PASS"
                report.status_extended = f"Exchange mailbox auditing is enabled for mailbox: {mailbox_config.name}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: exchange_mailbox_policy_additional_storage_restricted.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/exchange/exchange_mailbox_policy_additional_storage_restricted/exchange_mailbox_policy_additional_storage_restricted.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "exchange_mailbox_policy_additional_storage_restricted",
  "CheckTitle": "Ensure additional storage providers are restricted in Outlook on the web.",
  "CheckType": [],
  "ServiceName": "exchange",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Exchange Mailboxes Policy",
  "Description": "Restrict the availability of additional storage providers (e.g., Box, Dropbox, Google Drive) in Outlook on the web to prevent users from accessing external storage services through the OWA interface.",
  "Risk": "Allowing users to access third-party storage providers from Outlook on the web increases the risk of data exfiltration and exposure to untrusted content or malware.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/powershell/module/exchange/set-owamailboxpolicy?view=exchange-ps",
  "Remediation": {
    "Code": {
      "CLI": "Set-OwaMailboxPolicy -Identity OwaMailboxPolicy-Default -AdditionalStorageProvidersAvailable $false",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Disable access to additional storage providers in Outlook on the web to reduce the risk of data leakage.",
      "Url": "https://learn.microsoft.com/en-us/powershell/module/exchange/set-owamailboxpolicy?view=exchange-ps"
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

---[FILE: exchange_mailbox_policy_additional_storage_restricted.py]---
Location: prowler-master/prowler/providers/m365/services/exchange/exchange_mailbox_policy_additional_storage_restricted/exchange_mailbox_policy_additional_storage_restricted.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.exchange.exchange_client import exchange_client


class exchange_mailbox_policy_additional_storage_restricted(Check):
    """Check if Exchange mailbox policy restricts additional storage providers.

    This check ensures that the mailbox policy does not allow additional storage providers.
    """

    def execute(self) -> List[CheckReportM365]:
        """Run the check to validate Exchange mailbox policy restrictions.

        Iterates through all mailbox policies to determine if additional storage
        providers are restricted and generates reports for each policy.

        Returns:
            List[CheckReportM365]: A list of reports with the restriction status for each mailbox policy.
        """
        findings = []
        for mailbox_policy in exchange_client.mailbox_policies:
            if mailbox_policy:
                report = CheckReportM365(
                    metadata=self.metadata(),
                    resource=mailbox_policy,
                    resource_name=f"Exchange Mailbox Policy - {mailbox_policy.id}",
                    resource_id=mailbox_policy.id,
                )
                report.status = "FAIL"
                report.status_extended = f"Exchange mailbox policy '{mailbox_policy.id}' allows additional storage providers."

                if not mailbox_policy.additional_storage_enabled:
                    report.status = "PASS"
                    report.status_extended = f"Exchange mailbox policy '{mailbox_policy.id}' restricts additional storage providers."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: exchange_organization_mailbox_auditing_enabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/exchange/exchange_organization_mailbox_auditing_enabled/exchange_organization_mailbox_auditing_enabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "exchange_organization_mailbox_auditing_enabled",
  "CheckTitle": "Ensure AuditDisabled organizationally is set to False.",
  "CheckType": [],
  "ServiceName": "exchange",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Exchange Organization Configuration",
  "Description": "Ensure that the AuditDisabled property is set to False at the organizational level in Exchange Online. This enables mailbox auditing by default for all mailboxes and overrides individual mailbox settings.",
  "Risk": "If mailbox auditing is disabled at the organization level, no mailbox actions are audited, limiting forensic investigation capabilities and exposing the organization to undetected malicious activity.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/purview/audit-mailboxes?view=o365-worldwide",
  "Remediation": {
    "Code": {
      "CLI": "Set-OrganizationConfig -AuditDisabled $false",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Set AuditDisabled to False at the organization level to ensure mailbox auditing is always enforced.",
      "Url": "https://learn.microsoft.com/en-us/powershell/module/exchange/set-organizationconfig?view=exchange-ps#-auditdisabled"
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

---[FILE: exchange_organization_mailbox_auditing_enabled.py]---
Location: prowler-master/prowler/providers/m365/services/exchange/exchange_organization_mailbox_auditing_enabled/exchange_organization_mailbox_auditing_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.exchange.exchange_client import exchange_client


class exchange_organization_mailbox_auditing_enabled(Check):
    """Check if Exchange mailbox auditing is enabled.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """Execute the check for Exchange mailbox auditing.

        This method checks if mailbox auditing is enabled in the Exchange organization configuration.

        Returns:
            List[CheckReportM365]: A list of reports containing the result of the check.
        """
        findings = []
        organization_config = exchange_client.organization_config
        if organization_config:
            report = CheckReportM365(
                metadata=self.metadata(),
                resource=organization_config,
                resource_name=organization_config.name,
                resource_id=organization_config.guid,
            )
            report.status = "FAIL"
            report.status_extended = (
                "Exchange mailbox auditing is not enabled on your organization."
            )

            if not organization_config.audit_disabled:
                report.status = "PASS"
                report.status_extended = (
                    "Exchange mailbox auditing is enabled on your organization."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: exchange_organization_mailtips_enabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/exchange/exchange_organization_mailtips_enabled/exchange_organization_mailtips_enabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "exchange_organization_mailtips_enabled",
  "CheckTitle": "Ensure MailTips are enabled for end users.",
  "CheckType": [],
  "ServiceName": "exchange",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Exchange Organization Configuration",
  "Description": "Ensure that MailTips are enabled in Exchange Online to provide users with informative messages while composing emails, helping to avoid issues such as sending to large groups or external recipients unintentionally.",
  "Risk": "Without MailTips, users may inadvertently send sensitive information externally or generate non-delivery reports, leading to communication errors and potential data exposure.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/mailtips/mailtips",
  "Remediation": {
    "Code": {
      "CLI": "$TipsParams = @{ MailTipsAllTipsEnabled = $true; MailTipsExternalRecipientsTipsEnabled = $true; MailTipsGroupMetricsEnabled = $true; MailTipsLargeAudienceThreshold = '25' }; Set-OrganizationConfig @TipsParams",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable MailTips features in Exchange Online and configure the large audience threshold appropriately to assist users when composing emails.",
      "Url": "https://learn.microsoft.com/en-us/powershell/module/exchange/set-organizationconfig?view=exchange-ps"
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

---[FILE: exchange_organization_mailtips_enabled.py]---
Location: prowler-master/prowler/providers/m365/services/exchange/exchange_organization_mailtips_enabled/exchange_organization_mailtips_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.exchange.exchange_client import exchange_client


class exchange_organization_mailtips_enabled(Check):
    """
    Check if MailTips are enabled for Exchange Online.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """
        Execute the check for MailTips in Exchange Online.

        This method checks if MailTips are enabled in the Exchange organization configuration.

        Returns:
            List[CheckReportM365]: A list of reports containing the result of the check.
        """
        findings = []
        organization_config = exchange_client.organization_config
        if organization_config:
            report = CheckReportM365(
                metadata=self.metadata(),
                resource=organization_config,
                resource_name=organization_config.name,
                resource_id=organization_config.guid,
            )
            report.status = "FAIL"
            report.status_extended = (
                "MailTips are not fully enabled for Exchange Online."
            )

            if (
                organization_config.mailtips_enabled
                and organization_config.mailtips_external_recipient_enabled
                and organization_config.mailtips_group_metrics_enabled
                and organization_config.mailtips_large_audience_threshold
                <= exchange_client.audit_config.get(
                    "recommended_mailtips_large_audience_threshold", 25
                )
            ):
                report.status = "PASS"
                report.status_extended = (
                    "MailTips are fully enabled for Exchange Online."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: exchange_organization_modern_authentication_enabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/exchange/exchange_organization_modern_authentication_enabled/exchange_organization_modern_authentication_enabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "exchange_organization_modern_authentication_enabled",
  "CheckTitle": "Ensure Modern Authentication for Exchange Online is enabled.",
  "CheckType": [],
  "ServiceName": "exchange",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "Exchange Organization Configuration",
  "Description": "Ensure that modern authentication is enabled for Exchange Online, requiring exchange and mailboxes clients to use strong authentication mechanisms instead of basic authentication.",
  "Risk": "If modern authentication is not enabled, Exchange Online email clients may fall back to basic authentication, making it easier for attackers to bypass multifactor authentication and compromise user credentials.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/enable-or-disable-modern-authentication-in-exchange-online",
  "Remediation": {
    "Code": {
      "CLI": "Set-OrganizationConfig -OAuth2ClientProfileEnabled $True",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable modern authentication in Exchange Online to enforce secure authentication methods for email clients.",
      "Url": "https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/enable-or-disable-modern-authentication-in-exchange-online"
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

---[FILE: exchange_organization_modern_authentication_enabled.py]---
Location: prowler-master/prowler/providers/m365/services/exchange/exchange_organization_modern_authentication_enabled/exchange_organization_modern_authentication_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.exchange.exchange_client import exchange_client


class exchange_organization_modern_authentication_enabled(Check):
    """
    Check if Modern Authentication is enabled for Exchange Online.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """
        Execute the check for Modern Authentication in Exchange Online.

        This method checks if Modern Authentication is enabled in the Exchange organization configuration.

        Returns:
            List[CheckReportM365]: A list of reports containing the result of the check.
        """
        findings = []
        organization_config = exchange_client.organization_config
        if organization_config:
            report = CheckReportM365(
                metadata=self.metadata(),
                resource=organization_config,
                resource_name=organization_config.name,
                resource_id=organization_config.guid,
            )
            report.status = "FAIL"
            report.status_extended = (
                "Modern Authentication is not enabled for Exchange Online."
            )

            if organization_config.oauth_enabled:
                report.status = "PASS"
                report.status_extended = (
                    "Modern Authentication is enabled for Exchange Online."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: exchange_roles_assignment_policy_addins_disabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/exchange/exchange_roles_assignment_policy_addins_disabled/exchange_roles_assignment_policy_addins_disabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "exchange_roles_assignment_policy_addins_disabled",
  "CheckTitle": "Ensure there is no policy with Outlook add-ins allowed.",
  "CheckType": [],
  "ServiceName": "exchange",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Exchange Role Assignment Policy",
  "Description": "Restricting users from installing Outlook add-ins reduces the risk of data exposure or exploitation through unapproved or vulnerable add-ins.",
  "Risk": "Allowing users to install add-ins may expose sensitive information or introduce malicious behavior through third-party integrations. Disabling this capability mitigates the risk of unauthorized data access.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/exchange/clients-and-mobile-in-exchange-online/add-ins-for-outlook/specify-who-can-install-and-manage-add-ins",
  "Remediation": {
    "Code": {
      "CLI": "$policy = \"Role Assignment Policy - Prevent Add-ins\"; $roles = \"MyTextMessaging\", \"MyDistributionGroups\", \"MyMailSubscriptions\", \"MyBaseOptions\", \"MyVoiceMail\", \"MyProfileInformation\", \"MyContactInformation\", \"MyRetentionPolicies\", \"MyDistributionGroupMembership\"; New-RoleAssignmentPolicy -Name $policy -Roles $roles; Set-RoleAssignmentPolicy -id $policy -IsDefault; Get-EXOMailbox -ResultSize Unlimited | Set-Mailbox -RoleAssignmentPolicy $policy",
      "NativeIaC": "",
      "Other": "1. Navigate to Exchange admin center https://admin.exchange.microsoft.com. 2. Click to expand Roles > User roles. 3. Select Default Role Assignment Policy. 4. In the right pane, click Manage permissions. 5. Uncheck My Custom Apps, My Marketplace Apps and My ReadWriteMailboxApps under Other roles. 6. Save changes.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict Outlook add-in installation by updating the Role Assignment Policy to exclude roles that allow app installation.",
      "Url": "https://learn.microsoft.com/en-us/exchange/permissions-exo/role-assignment-policies"
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
