---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 383
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 383 of 867)

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

---[FILE: defender_service.py]---
Location: prowler-master/prowler/providers/m365/services/defender/defender_service.py
Signals: Pydantic

```python
from typing import List, Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.m365.lib.service.service import M365Service
from prowler.providers.m365.m365_provider import M365Provider


class Defender(M365Service):
    def __init__(self, provider: M365Provider):
        super().__init__(provider)
        self.malware_policies = []
        self.outbound_spam_policies = {}
        self.outbound_spam_rules = {}
        self.antiphishing_policies = {}
        self.antiphishing_rules = {}
        self.connection_filter_policy = None
        self.dkim_configurations = []
        self.inbound_spam_policies = []
        self.inbound_spam_rules = {}
        self.report_submission_policy = None
        if self.powershell:
            if self.powershell.connect_exchange_online():
                self.malware_policies = self._get_malware_filter_policy()
                self.malware_rules = self._get_malware_filter_rule()
                self.outbound_spam_policies = self._get_outbound_spam_filter_policy()
                self.outbound_spam_rules = self._get_outbound_spam_filter_rule()
                self.antiphishing_policies = self._get_antiphishing_policy()
                self.antiphishing_rules = self._get_antiphishing_rules()
                self.connection_filter_policy = self._get_connection_filter_policy()
                self.dkim_configurations = self._get_dkim_config()
                self.inbound_spam_policies = self._get_inbound_spam_filter_policy()
                self.inbound_spam_rules = self._get_inbound_spam_filter_rule()
                self.report_submission_policy = self._get_report_submission_policy()
            self.powershell.close()

    def _get_malware_filter_policy(self):
        logger.info("M365 - Getting Defender malware filter policy...")
        malware_policies = []
        try:
            malware_policy = self.powershell.get_malware_filter_policy()
            if isinstance(malware_policy, dict):
                malware_policy = [malware_policy]
            for policy in malware_policy:
                if policy:
                    file_types_raw = policy.get("FileTypes", [])
                    file_types = []
                    if file_types_raw is not None:
                        if isinstance(file_types_raw, list):
                            file_types = file_types_raw
                        else:
                            try:
                                if isinstance(file_types_raw, str):
                                    file_types = [file_types_raw]
                                else:
                                    file_types = [str(file_types_raw)]
                            except (ValueError, TypeError):
                                logger.warning(
                                    f"Skipping invalid file_types value: {file_types_raw}"
                                )
                                file_types = []

                    malware_policies.append(
                        MalwarePolicy(
                            enable_file_filter=policy.get("EnableFileFilter", False),
                            identity=policy.get("Identity", ""),
                            enable_internal_sender_admin_notifications=policy.get(
                                "EnableInternalSenderAdminNotifications", False
                            ),
                            internal_sender_admin_address=policy.get(
                                "InternalSenderAdminAddress", ""
                            ),
                            file_types=file_types,
                            is_default=policy.get("IsDefault", False),
                        )
                    )
                    malware_policies.sort(key=lambda x: x.is_default, reverse=True)
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return malware_policies

    def _get_malware_filter_rule(self):
        logger.info("Microsoft365 - Getting Defender malware filter rule...")
        malware_rules = {}
        try:
            malware_rule = self.powershell.get_malware_filter_rule()
            if isinstance(malware_rule, dict):
                malware_rule = [malware_rule]
            for rule in malware_rule:
                if rule:
                    malware_rules[rule.get("MalwareFilterPolicy", "")] = MalwareRule(
                        state=rule.get("State", ""),
                        priority=rule.get("Priority", 0),
                        users=rule.get("SentTo", None),
                        groups=rule.get("SentToMemberOf", None),
                        domains=rule.get("RecipientDomainIs", None),
                    )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return malware_rules

    def _get_antiphishing_policy(self):
        logger.info("Microsoft365 - Getting Defender antiphishing policy...")
        antiphishing_policies = {}
        try:
            antiphishing_policy = self.powershell.get_antiphishing_policy()
            if isinstance(antiphishing_policy, dict):
                antiphishing_policy = [antiphishing_policy]
            for policy in antiphishing_policy:
                if policy:
                    antiphishing_policies[policy.get("Name", "")] = AntiphishingPolicy(
                        name=policy.get("Name", ""),
                        spoof_intelligence=policy.get("EnableSpoofIntelligence", True),
                        spoof_intelligence_action=policy.get(
                            "AuthenticationFailAction", ""
                        ),
                        dmarc_reject_action=policy.get("DmarcRejectAction", ""),
                        dmarc_quarantine_action=policy.get("DmarcQuarantineAction", ""),
                        safety_tips=policy.get("EnableFirstContactSafetyTips", True),
                        unauthenticated_sender_action=policy.get(
                            "EnableUnauthenticatedSender", True
                        ),
                        show_tag=policy.get("EnableViaTag", True),
                        honor_dmarc_policy=policy.get("HonorDmarcPolicy", True),
                        default=policy.get("IsDefault", False),
                    )

                    antiphishing_policies = dict(
                        sorted(
                            antiphishing_policies.items(),
                            key=lambda item: item[1].default,
                            reverse=True,
                        )
                    )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return antiphishing_policies

    def _get_antiphishing_rules(self):
        logger.info("Microsoft365 - Getting Defender antiphishing rules...")
        antiphishing_rules = {}
        try:
            antiphishing_rule = self.powershell.get_antiphishing_rules()
            if isinstance(antiphishing_rule, dict):
                antiphishing_rule = [antiphishing_rule]
            for rule in antiphishing_rule:
                if rule:
                    antiphishing_rules[rule.get("AntiPhishPolicy", "")] = (
                        AntiphishingRule(
                            state=rule.get("State", ""),
                            priority=rule.get("Priority", 0),
                            users=rule.get("SentTo", None),
                            groups=rule.get("SentToMemberOf", None),
                            domains=rule.get("RecipientDomainIs", None),
                        )
                    )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return antiphishing_rules

    def _get_connection_filter_policy(self):
        logger.info("Microsoft365 - Getting connection filter policy...")
        connection_filter_policy = None
        try:
            policy = self.powershell.get_connection_filter_policy()
            if policy:
                connection_filter_policy = ConnectionFilterPolicy(
                    ip_allow_list=policy.get("IPAllowList", []),
                    identity=policy.get("Identity", ""),
                    enable_safe_list=policy.get("EnableSafeList", False),
                )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return connection_filter_policy

    def _get_dkim_config(self):
        logger.info("Microsoft365 - Getting DKIM settings...")
        dkim_configs = []
        try:
            dkim_config = self.powershell.get_dkim_config()
            if isinstance(dkim_config, dict):
                dkim_config = [dkim_config]
            for config in dkim_config:
                if config:
                    dkim_configs.append(
                        DkimConfig(
                            dkim_signing_enabled=config.get("Enabled", False),
                            id=config.get("Id", ""),
                        )
                    )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return dkim_configs

    def _get_outbound_spam_filter_policy(self):
        logger.info("Microsoft365 - Getting Defender outbound spam filter policy...")
        outbound_spam_policies = {}
        try:
            outbound_spam_policy = self.powershell.get_outbound_spam_filter_policy()
            if isinstance(outbound_spam_policy, dict):
                outbound_spam_policy = [outbound_spam_policy]
            for policy in outbound_spam_policy:
                if policy:
                    outbound_spam_policies[policy.get("Name", "")] = OutboundSpamPolicy(
                        name=policy.get("Name", ""),
                        notify_sender_blocked=policy.get("NotifyOutboundSpam", True),
                        notify_limit_exceeded=policy.get(
                            "BccSuspiciousOutboundMail", True
                        ),
                        notify_limit_exceeded_addresses=policy.get(
                            "BccSuspiciousOutboundAdditionalRecipients", []
                        ),
                        notify_sender_blocked_addresses=policy.get(
                            "NotifyOutboundSpamRecipients", []
                        ),
                        auto_forwarding_mode=policy.get("AutoForwardingMode", "On"),
                        default=policy.get("IsDefault", False),
                    )

                    outbound_spam_policies = dict(
                        sorted(
                            outbound_spam_policies.items(),
                            key=lambda item: item[1].default,
                            reverse=True,
                        )
                    )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return outbound_spam_policies

    def _get_outbound_spam_filter_rule(self):
        logger.info("Microsoft365 - Getting Defender outbound spam filter rule...")
        outbound_spam_rules = {}
        try:
            outbound_spam_rule = self.powershell.get_outbound_spam_filter_rule()
            if isinstance(outbound_spam_rule, dict):
                outbound_spam_rule = [outbound_spam_rule]
            for rule in outbound_spam_rule:
                if rule:
                    outbound_spam_rules[
                        rule.get("HostedOutboundSpamFilterPolicy", "")
                    ] = OutboundSpamRule(
                        state=rule.get("State", "Disabled"),
                        priority=rule.get("Priority", 0),
                        users=rule.get("From", None),
                        groups=rule.get("FromMemberOf", None),
                        domains=rule.get("SenderDomainIs", None),
                    )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return outbound_spam_rules

    def _get_inbound_spam_filter_policy(self):
        logger.info("Microsoft365 - Getting Defender inbound spam filter policy...")
        inbound_spam_policies = []
        try:
            inbound_spam_policy = self.powershell.get_inbound_spam_filter_policy()
            if not inbound_spam_policy:
                return inbound_spam_policies
            if isinstance(inbound_spam_policy, dict):
                inbound_spam_policy = [inbound_spam_policy]
            for policy in inbound_spam_policy:
                if policy:
                    allowed_domains_raw = policy.get("AllowedSenderDomains", [])
                    allowed_domains = []

                    if isinstance(allowed_domains_raw, str):
                        try:
                            import json

                            parsed_domains = json.loads(allowed_domains_raw)
                            if isinstance(parsed_domains, list):
                                allowed_domains_raw = parsed_domains
                            else:
                                logger.warning(
                                    f"Expected list from JSON string, got: {type(parsed_domains)}"
                                )
                                allowed_domains_raw = []
                        except (json.JSONDecodeError, ValueError) as e:
                            logger.warning(
                                f"Failed to parse AllowedSenderDomains as JSON: {e}"
                            )
                            allowed_domains_raw = []

                    if allowed_domains_raw:
                        for domain in allowed_domains_raw:
                            if isinstance(domain, str):
                                allowed_domains.append(domain)
                            else:
                                try:
                                    allowed_domains.append(str(domain))
                                except (ValueError, TypeError):
                                    logger.warning(
                                        f"Skipping invalid domain value: {domain}"
                                    )

                    inbound_spam_policies.append(
                        DefenderInboundSpamPolicy(
                            identity=policy.get("Identity", ""),
                            allowed_sender_domains=allowed_domains,
                            default=policy.get("IsDefault", False),
                        )
                    )
                    inbound_spam_policies.sort(key=lambda x: x.default, reverse=True)
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return inbound_spam_policies

    def _get_inbound_spam_filter_rule(self):
        logger.info("Microsoft365 - Getting Defender inbound spam filter rule...")
        inbound_spam_rules = {}
        try:
            inbound_spam_rule = self.powershell.get_inbound_spam_filter_rule()
            if isinstance(inbound_spam_rule, dict):
                inbound_spam_rule = [inbound_spam_rule]
            for rule in inbound_spam_rule:
                if rule:
                    inbound_spam_rules[rule.get("HostedContentFilterPolicy", "")] = (
                        InboundSpamRule(
                            state=rule.get("State", "Disabled"),
                            priority=rule.get("Priority", 0),
                            users=rule.get("SentTo", None),
                            groups=rule.get("SentToMemberOf", None),
                            domains=rule.get("RecipientDomainIs", None),
                        )
                    )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return inbound_spam_rules

    def _get_report_submission_policy(self):
        logger.info("Microsoft365 - Getting Defender report submission policy...")
        report_submission_policy = None
        try:
            report_submission_policy = self.powershell.get_report_submission_policy()
            if report_submission_policy:
                report_submission_policy = ReportSubmissionPolicy(
                    report_junk_to_customized_address=report_submission_policy.get(
                        "ReportJunkToCustomizedAddress", True
                    ),
                    report_not_junk_to_customized_address=report_submission_policy.get(
                        "ReportNotJunkToCustomizedAddress", True
                    ),
                    report_phish_to_customized_address=report_submission_policy.get(
                        "ReportPhishToCustomizedAddress", True
                    ),
                    report_junk_addresses=report_submission_policy.get(
                        "ReportJunkAddresses", []
                    ),
                    report_not_junk_addresses=report_submission_policy.get(
                        "ReportNotJunkAddresses", []
                    ),
                    report_phish_addresses=report_submission_policy.get(
                        "ReportPhishAddresses", []
                    ),
                    report_chat_message_enabled=report_submission_policy.get(
                        "ReportChatMessageEnabled", True
                    ),
                    report_chat_message_to_customized_address_enabled=report_submission_policy.get(
                        "ReportChatMessageToCustomizedAddressEnabled", True
                    ),
                )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return report_submission_policy


class MalwarePolicy(BaseModel):
    enable_file_filter: bool
    identity: str
    enable_internal_sender_admin_notifications: bool
    internal_sender_admin_address: str
    file_types: list[str]
    is_default: bool


class MalwareRule(BaseModel):
    state: str
    priority: int
    users: Optional[list[str]]
    groups: Optional[list[str]]
    domains: Optional[list[str]]


class AntiphishingPolicy(BaseModel):
    name: str
    spoof_intelligence: bool
    spoof_intelligence_action: str
    dmarc_reject_action: str
    dmarc_quarantine_action: str
    safety_tips: bool
    unauthenticated_sender_action: bool
    show_tag: bool
    honor_dmarc_policy: bool
    default: bool


class AntiphishingRule(BaseModel):
    state: str
    priority: int
    users: Optional[list[str]]
    groups: Optional[list[str]]
    domains: Optional[list[str]]


class ConnectionFilterPolicy(BaseModel):
    ip_allow_list: list
    identity: str
    enable_safe_list: bool


class DkimConfig(BaseModel):
    dkim_signing_enabled: bool
    id: str


class OutboundSpamPolicy(BaseModel):
    name: str
    notify_sender_blocked: bool
    notify_limit_exceeded: bool
    notify_limit_exceeded_addresses: List[str]
    notify_sender_blocked_addresses: List[str]
    auto_forwarding_mode: str
    default: bool


class OutboundSpamRule(BaseModel):
    state: str
    priority: int
    users: Optional[list[str]]
    groups: Optional[list[str]]
    domains: Optional[list[str]]


class DefenderInboundSpamPolicy(BaseModel):
    identity: str
    allowed_sender_domains: list[str] = []
    default: bool


class InboundSpamRule(BaseModel):
    state: str
    priority: int
    users: Optional[list[str]]
    groups: Optional[list[str]]
    domains: Optional[list[str]]


class ReportSubmissionPolicy(BaseModel):
    report_junk_to_customized_address: bool
    report_not_junk_to_customized_address: bool
    report_phish_to_customized_address: bool
    report_junk_addresses: list[str]
    report_not_junk_addresses: list[str]
    report_phish_addresses: list[str]
    report_chat_message_enabled: bool
    report_chat_message_to_customized_address_enabled: bool
```

--------------------------------------------------------------------------------

---[FILE: defender_antiphishing_policy_configured.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/defender/defender_antiphishing_policy_configured/defender_antiphishing_policy_configured.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "defender_antiphishing_policy_configured",
  "CheckTitle": "Ensure anti-phishing policies are properly configured and active.",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "Defender Anti-Phishing Policy",
  "Description": "Ensure that anti-phishing policies are created and configured for specific users, groups, or domains, taking precedence over the default policy. This check verifies the existence of rules within policies and validates specific policy settings such as spoof intelligence, DMARC actions, safety tips, and unauthenticated sender actions.",
  "Risk": "Without anti-phishing policies, organizations may rely solely on default settings, which might not adequately protect against phishing attacks targeted at specific users, groups, or domains. This increases the risk of successful phishing attempts and potential data breaches.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/microsoft-365/security/office-365-security/set-up-anti-phishing-policies?view=o365-worldwide",
  "Remediation": {
    "Code": {
      "CLI": "$params = @{Name='<policy_name>';PhishThresholdLevel=3;EnableTargetedUserProtection=$true;EnableOrganizationDomainsProtection=$true;EnableMailboxIntelligence=$true;EnableMailboxIntelligenceProtection=$true;EnableSpoofIntelligence=$true;TargetedUserProtectionAction='Quarantine';TargetedDomainProtectionAction='Quarantine';MailboxIntelligenceProtectionAction='Quarantine';TargetedUserQuarantineTag='DefaultFullAccessWithNotificationPolicy';MailboxIntelligenceQuarantineTag='DefaultFullAccessWithNotificationPolicy';TargetedDomainQuarantineTag='DefaultFullAccessWithNotificationPolicy';EnableFirstContactSafetyTips=$true;EnableSimilarUsersSafetyTips=$true;EnableSimilarDomainsSafetyTips=$true;EnableUnusualCharactersSafetyTips=$true;HonorDmarcPolicy=$true}; New-AntiPhishPolicy @params; New-AntiPhishRule -Name $params.Name -AntiPhishPolicy $params.Name -RecipientDomainIs (Get-AcceptedDomain).Name -Priority 0",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft 365 Defender https://security.microsoft.com. 2. Click to expand Email & collaboration and select Policies & rules. 3. On the Policies & rules page select Threat policies. 4. Under Policies, select Anti-phishing 5. Ensure policies have rules with the state set to 'on' and validate settings: spoof intelligence enabled, spoof intelligence action set to 'Quarantine', DMARC reject and quarantine actions, safety tips enabled, unauthenticated sender action enabled, show tag enabled, and honor DMARC policy enabled. If not, modify them to be as recommended.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Create and configure anti-phishing policies for specific users, groups, or domains to enhance protection against phishing attacks.",
      "Url": "https://learn.microsoft.com/en-us/microsoft-365/security/office-365-security/set-up-anti-phishing-policies?view=o365-worldwide"
    }
  },
  "Categories": [
    "e5"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": ""
}
```

--------------------------------------------------------------------------------

---[FILE: defender_antiphishing_policy_configured.py]---
Location: prowler-master/prowler/providers/m365/services/defender/defender_antiphishing_policy_configured/defender_antiphishing_policy_configured.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.defender.defender_client import defender_client


class defender_antiphishing_policy_configured(Check):
    """
    Check if an anti-phishing policy is established and properly configured in the Defender service.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """
        Execute the check to verify if an anti-phishing policy is established and properly configured.

        This method checks the Defender anti-phishing policies to ensure they are configured
        according to best practices.

        Returns:
            List[CheckReportM365]: A list of reports containing the result of the check.
        """
        findings = []

        if defender_client.antiphishing_policies:
            # Only Default Defender Anti-Phishing Policy exists since there are only anti phishing rules when there are custom policies
            if not defender_client.antiphishing_rules:
                # Get the only policy in the dictionary since there is only the default policy
                policy = next(iter(defender_client.antiphishing_policies.values()))

                report = CheckReportM365(
                    metadata=self.metadata(),
                    resource=policy,
                    resource_name=policy.name,
                    resource_id=policy.name,
                )

                if self._is_policy_properly_configured(policy):
                    # Case 1: Default policy exists and is properly configured
                    report.status = "PASS"
                    report.status_extended = f"{policy.name} is the only policy and it's properly configured in the default Defender Anti-Phishing Policy."
                else:
                    # Case 5: Default policy exists but is not properly configured
                    report.status = "FAIL"
                    report.status_extended = f"{policy.name} is the only policy and it's not properly configured in the default Defender Anti-Phishing Policy."
                findings.append(report)

            # Multiple Defender Anti-Phishing Policies
            else:
                default_policy_well_configured = False

                for (
                    policy_name,
                    policy,
                ) in defender_client.antiphishing_policies.items():
                    report = CheckReportM365(
                        metadata=self.metadata(),
                        resource=policy,
                        resource_name=policy_name,
                        resource_id=policy_name,
                    )
                    if policy.default:
                        if not self._is_policy_properly_configured(policy):
                            # Case 4: Default policy is not properly configured and there are other policies
                            report.status = "FAIL"
                            report.status_extended = f"{policy_name} is not properly configured in the default Defender Anti-Phishing Policy, but could be overridden by another well-configured Custom Policy."
                            findings.append(report)
                        else:
                            # Case 2: Default policy is properly configured and there are other policies
                            report.status = "PASS"
                            report.status_extended = f"{policy_name} is properly configured in the default Defender Anti-Phishing Policy, but could be overridden by another bad-configured Custom Policy."
                            default_policy_well_configured = True
                            findings.append(report)
                    else:
                        if not self._is_policy_properly_configured(policy):
                            included_resources = []

                            if defender_client.antiphishing_rules[policy.name].users:
                                included_resources.append(
                                    f"users: {', '.join(defender_client.antiphishing_rules[policy.name].users)}"
                                )
                            if defender_client.antiphishing_rules[policy.name].groups:
                                included_resources.append(
                                    f"groups: {', '.join(defender_client.antiphishing_rules[policy.name].groups)}"
                                )
                            if defender_client.antiphishing_rules[policy.name].domains:
                                included_resources.append(
                                    f"domains: {', '.join(defender_client.antiphishing_rules[policy.name].domains)}"
                                )

                            included_resources_str = "; ".join(included_resources)

                            # Case 3: Default policy is properly configured but other custom policies are not
                            if default_policy_well_configured:
                                report.status = "FAIL"
                                report.status_extended = (
                                    f"Custom Anti-phishing policy {policy_name} is not properly configured and includes {included_resources_str}, "
                                    f"with priority {defender_client.antiphishing_rules[policy.name].priority} (0 is the highest). "
                                    "However, the default policy is properly configured, so entities not included by this custom policy could be correctly protected."
                                )
                                findings.append(report)
                            # Case 5: Default policy is not properly configured and other custom policies are not
                            else:
                                report.status = "FAIL"
                                report.status_extended = (
                                    f"Custom Anti-phishing policy {policy_name} is not properly configured and includes {included_resources_str}, "
                                    f"with priority {defender_client.antiphishing_rules[policy.name].priority} (0 is the highest). "
                                    "Also, the default policy is not properly configured, so entities not included by this custom policy could not be correctly protected."
                                )
                                findings.append(report)
                        else:
                            included_resources = []

                            if defender_client.antiphishing_rules[policy.name].users:
                                included_resources.append(
                                    f"users: {', '.join(defender_client.antiphishing_rules[policy.name].users)}"
                                )
                            if defender_client.antiphishing_rules[policy.name].groups:
                                included_resources.append(
                                    f"groups: {', '.join(defender_client.antiphishing_rules[policy.name].groups)}"
                                )
                            if defender_client.antiphishing_rules[policy.name].domains:
                                included_resources.append(
                                    f"domains: {', '.join(defender_client.antiphishing_rules[policy.name].domains)}"
                                )

                            included_resources_str = "; ".join(included_resources)

                            # Case 2: Default policy is properly configured and other custom policies are too
                            if default_policy_well_configured:
                                report.status = "PASS"
                                report.status_extended = (
                                    f"Custom Anti-phishing policy {policy_name} is properly configured and includes {included_resources_str}, "
                                    f"with priority {defender_client.antiphishing_rules[policy.name].priority} (0 is the highest). "
                                    "Also, the default policy is properly configured, so entities not included by this custom policy could still be correctly protected."
                                )
                                findings.append(report)

                            # Case 6: Default policy is not properly configured but other custom policies are
                            else:
                                report.status = "PASS"
                                report.status_extended = (
                                    f"Custom Anti-phishing policy {policy_name} is properly configured and includes {included_resources_str}, "
                                    f"with priority {defender_client.antiphishing_rules[policy.name].priority} (0 is the highest). "
                                    "However, the default policy is not properly configured, so entities not included by this custom policy could not be correctly protected."
                                )
                                findings.append(report)

        return findings

    def _is_policy_properly_configured(self, policy) -> bool:
        """
        Check if a policy is properly configured according to best practices.

        Args:
            policy: The anti-phishing policy to check.

        Returns:
            bool: True if the policy is properly configured, False otherwise.
        """
        return (
            (
                policy.default
                or defender_client.antiphishing_rules[policy.name].state.lower()
                == "enabled"
            )
            and policy.spoof_intelligence
            and policy.spoof_intelligence_action.lower() == "quarantine"
            and policy.dmarc_reject_action.lower() == "quarantine"
            and policy.dmarc_quarantine_action.lower() == "quarantine"
            and policy.safety_tips
            and policy.unauthenticated_sender_action
            and policy.show_tag
            and policy.honor_dmarc_policy
        )
```

--------------------------------------------------------------------------------

---[FILE: defender_antispam_connection_filter_policy_empty_ip_allowlist.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/defender/defender_antispam_connection_filter_policy_empty_ip_allowlist/defender_antispam_connection_filter_policy_empty_ip_allowlist.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "defender_antispam_connection_filter_policy_empty_ip_allowlist",
  "CheckTitle": "Ensure the Anti-Spam Connection Filter Policy IP Allowlist is empty or undefined.",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Defender Anti-Spam Policy",
  "Description": "This check focuses on Microsoft 365 organizations with Exchange Online mailboxes or standalone Exchange Online Protection (EOP) organizations. It ensures that the connection filter policy's IP Allowlist is empty or undefined to prevent bypassing spam filtering and sender authentication checks, which could lead to successful delivery of malicious emails.",
  "Risk": "Using the IP Allowlist without additional verification like mail flow rules poses a risk, as emails from these sources skip essential security checks (SPF, DKIM, DMARC). This could allow attackers to deliver harmful emails directly to the Inbox.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "Set-HostedConnectionFilterPolicy -Identity Default -IPAllowList @{}",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft 365 Defender https://security.microsoft.com. 2. Click to expand Email & collaboration and select Policies & rules. 3. On the Policies & rules page select Threat policies. 4. Under Policies, select Anti-spam and click on the Connection filter policy (Default). 5. Remove IP entries from the allow list. 6. Click Save.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that the IP Allowlist in your connection filter policy is empty or undefined to prevent bypassing essential security checks.",
      "Url": "https://learn.microsoft.com/en-us/powershell/module/exchange/set-hostedconnectionfilterpolicy?view=exchange-ps"
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

---[FILE: defender_antispam_connection_filter_policy_empty_ip_allowlist.py]---
Location: prowler-master/prowler/providers/m365/services/defender/defender_antispam_connection_filter_policy_empty_ip_allowlist/defender_antispam_connection_filter_policy_empty_ip_allowlist.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.defender.defender_client import defender_client


class defender_antispam_connection_filter_policy_empty_ip_allowlist(Check):
    """
    Check if the IP Allowlist is not used in the Antispam Connection Filter Policy.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """
        Execute the check to verify if the IP Allowlist is not used.

        This method checks the Antispam Connection Filter Policy to determine if the
        IP Allowlist is empty or undefined.

        Returns:
            List[CheckReportM365]: A list of reports containing the result of the check.
        """
        findings = []
        policy = defender_client.connection_filter_policy
        if policy:
            report = CheckReportM365(
                metadata=self.metadata(),
                resource=policy,
                resource_name="Defender Antispam Connection Filter Policy",
                resource_id=policy.identity,
            )
            report.status = "PASS"
            report.status_extended = f"IP Allowlist is not used in the Antispam Connection Filter Policy {policy.identity}."

            if policy.ip_allow_list:
                report.status = "FAIL"
                report.status_extended = f"IP Allowlist is used in the Antispam Connection Filter Policy {policy.identity} with IPs: {policy.ip_allow_list}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
