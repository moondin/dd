---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 385
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 385 of 867)

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

---[FILE: defender_antispam_policy_inbound_no_allowed_domains.py]---
Location: prowler-master/prowler/providers/m365/services/defender/defender_antispam_policy_inbound_no_allowed_domains/defender_antispam_policy_inbound_no_allowed_domains.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.defender.defender_client import defender_client


class defender_antispam_policy_inbound_no_allowed_domains(Check):
    """
    Check if the inbound anti-spam policies do not contain allowed domains in Microsoft 365 Defender.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """
        Execute the check to verify if inbound anti-spam policies do not contain allowed domains.

        This method checks each inbound anti-spam policy to determine if the AllowedSenderDomains
        list is empty or undefined.

        Returns:
            List[CheckReportM365]: A list of reports containing the result of the check.
        """
        findings = []

        if defender_client.inbound_spam_policies:
            # Only Default Defender Inbound Spam Policy exists
            if not defender_client.inbound_spam_rules:
                policy = defender_client.inbound_spam_policies[0]

                report = CheckReportM365(
                    metadata=self.metadata(),
                    resource=policy,
                    resource_name=policy.identity,
                    resource_id=policy.identity,
                )

                if self._has_no_allowed_domains(policy):
                    # Case 1: Default policy exists and has no allowed domains
                    report.status = "PASS"
                    report.status_extended = f"{policy.identity} is the only policy and it does not contain allowed domains."
                else:
                    # Case 5: Default policy exists but contains allowed domains
                    report.status = "FAIL"
                    report.status_extended = f"{policy.identity} is the only policy and it contains allowed domains: {', '.join(policy.allowed_sender_domains)}."
                findings.append(report)

            # Multiple Defender Inbound Spam Policies exist
            else:
                default_policy_well_configured = False

                for policy in defender_client.inbound_spam_policies:
                    report = CheckReportM365(
                        metadata=self.metadata(),
                        resource=policy,
                        resource_name=policy.identity,
                        resource_id=policy.identity,
                    )

                    if policy.default:
                        if not self._has_no_allowed_domains(policy):
                            # Case 4: Default policy contains allowed domains
                            report.status = "FAIL"
                            report.status_extended = (
                                f"{policy.identity} is the default policy and it contains allowed domains: {', '.join(policy.allowed_sender_domains)}, "
                                "but it could be overridden by another well-configured Custom Policy."
                            )
                            findings.append(report)
                        else:
                            # Case 2: Default policy has no allowed domains and there are other policies
                            report.status = "PASS"
                            report.status_extended = (
                                f"{policy.identity} is the default policy and it does not contain allowed domains, "
                                "but it could be overridden by another misconfigured Custom Policy."
                            )
                            default_policy_well_configured = True
                            findings.append(report)
                    else:
                        if not self._has_no_allowed_domains(policy):
                            included_resources = []

                            if defender_client.inbound_spam_rules[
                                policy.identity
                            ].users:
                                included_resources.append(
                                    f"users: {', '.join(defender_client.inbound_spam_rules[policy.identity].users)}"
                                )
                            if defender_client.inbound_spam_rules[
                                policy.identity
                            ].groups:
                                included_resources.append(
                                    f"groups: {', '.join(defender_client.inbound_spam_rules[policy.identity].groups)}"
                                )
                            if defender_client.inbound_spam_rules[
                                policy.identity
                            ].domains:
                                included_resources.append(
                                    f"domains: {', '.join(defender_client.inbound_spam_rules[policy.identity].domains)}"
                                )

                            included_resources_str = "; ".join(included_resources)
                            priority = defender_client.inbound_spam_rules[
                                policy.identity
                            ].priority

                            if default_policy_well_configured:
                                # Case 3: Default policy has no allowed domains but custom one does
                                report.status = "FAIL"
                                report.status_extended = (
                                    f"Custom Inbound Spam policy {policy.identity} contains allowed domains and includes {included_resources_str}, "
                                    f"with priority {priority} (0 is the highest). However, the default policy does not contain allowed domains, "
                                    "so entities not included by this custom policy could be correctly protected."
                                )
                            else:
                                # Case 5: Neither default nor custom policies are correctly configured
                                report.status = "FAIL"
                                report.status_extended = (
                                    f"Custom Inbound Spam policy {policy.identity} contains allowed domains and includes {included_resources_str}, "
                                    f"with priority {priority} (0 is the highest). Also, the default policy contains allowed domains, "
                                    "so entities not included by this custom policy could not be correctly protected."
                                )
                            findings.append(report)
                        else:
                            included_resources = []

                            if defender_client.inbound_spam_rules[
                                policy.identity
                            ].users:
                                included_resources.append(
                                    f"users: {', '.join(defender_client.inbound_spam_rules[policy.identity].users)}"
                                )
                            if defender_client.inbound_spam_rules[
                                policy.identity
                            ].groups:
                                included_resources.append(
                                    f"groups: {', '.join(defender_client.inbound_spam_rules[policy.identity].groups)}"
                                )
                            if defender_client.inbound_spam_rules[
                                policy.identity
                            ].domains:
                                included_resources.append(
                                    f"domains: {', '.join(defender_client.inbound_spam_rules[policy.identity].domains)}"
                                )

                            included_resources_str = "; ".join(included_resources)
                            priority = defender_client.inbound_spam_rules[
                                policy.identity
                            ].priority

                            if default_policy_well_configured:
                                # Case 2: Both default and custom policies do not contain allowed domains
                                report.status = "PASS"
                                report.status_extended = (
                                    f"Custom Inbound Spam policy {policy.identity} does not contain allowed domains and includes {included_resources_str}, "
                                    f"with priority {priority} (0 is the highest). Also, the default policy does not contain allowed domains, "
                                    "so entities not included by this custom policy could still be correctly protected."
                                )
                            else:
                                # Case 6: Default policy contains allowed domains, custom policy does not
                                report.status = "PASS"
                                report.status_extended = (
                                    f"Custom Inbound Spam policy {policy.identity} does not contain allowed domains and includes {included_resources_str}, "
                                    f"with priority {priority} (0 is the highest). However, the default policy contains allowed domains, "
                                    "so entities not included by this custom policy could not be correctly protected."
                                )
                            findings.append(report)

        return findings

    def _has_no_allowed_domains(self, policy) -> bool:
        """
        Check if the policy has no allowed domains.

        Args:
            policy: The inbound spam policy to check.

        Returns:
            bool: True if the policy has no allowed domains, False otherwise.
        """
        return (
            policy.default
            or defender_client.inbound_spam_rules[policy.identity].state.lower()
            == "enabled"
        ) and not policy.allowed_sender_domains
```

--------------------------------------------------------------------------------

---[FILE: defender_chat_report_policy_configured.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/defender/defender_chat_report_policy_configured/defender_chat_report_policy_configured.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "defender_chat_report_policy_configured",
  "CheckTitle": "Ensure chat report submission policy is properly configured in Defender",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Defender Report Submission Policy",
  "Description": "Ensure Defender report submission policy is properly configured to use customized addresses and enable chat message reporting to customized addresses, while disabling report chat message to Microsoft.",
  "Risk": "If Defender report submission policy is not properly configured, reported messages from Teams may not be handled or routed correctly, reducing the organization's ability to respond to threats.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/defender-office-365/submissions-teams?view=o365-worldwide",
  "Remediation": {
    "Code": {
      "CLI": "Set-ReportSubmissionPolicy -Identity DefaultReportSubmissionPolicy -EnableReportToMicrosoft $false -ReportChatMessageEnabled $false -ReportChatMessageToCustomizedAddressEnabled $true -ReportJunkToCustomizedAddress $true -ReportNotJunkToCustomizedAddress $true -ReportPhishToCustomizedAddress $true -ReportJunkAddresses $usersub -ReportNotJunkAddresses $usersub -ReportPhishAddresses $usersub",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft 365 Defender (https://security.microsoft.com/). 2. Click on Settings > Email & collaboration > User reported settings. 3. Scroll to Microsoft Teams section. 4. Ensure Monitor reported messages in Microsoft Teams is checked. 5. Ensure Send reported messages to: is set to My reporting mailbox only with report email addresses defined for authorized staff.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Configure Defender report submission policy to use customized addresses and enable chat message reporting to customized addresses, while disabling report chat message to Microsoft.",
      "Url": "https://learn.microsoft.com/en-us/defender-office-365/submissions-teams?view=o365-worldwide"
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

---[FILE: defender_chat_report_policy_configured.py]---
Location: prowler-master/prowler/providers/m365/services/defender/defender_chat_report_policy_configured/defender_chat_report_policy_configured.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.defender.defender_client import defender_client


class defender_chat_report_policy_configured(Check):
    """Check if Defender report submission policy is properly configured for Teams security reporting.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """Execute the check for Defender report submission policy settings.

        This method checks if Defender report submission policy is properly configured for Teams security reporting.

        Returns:
            List[CheckReportM365]: A list of reports containing the result of the check.
        """
        findings = []
        report_submission_policy = defender_client.report_submission_policy

        if report_submission_policy:
            report = CheckReportM365(
                metadata=self.metadata(),
                resource=report_submission_policy,
                resource_name="Defender Security Reporting Policy",
                resource_id="defenderSecurityReportingPolicy",
            )

            defender_settings_valid = (
                report_submission_policy.report_junk_to_customized_address
                and report_submission_policy.report_not_junk_to_customized_address
                and report_submission_policy.report_phish_to_customized_address
                and report_submission_policy.report_junk_addresses
                and report_submission_policy.report_not_junk_addresses
                and report_submission_policy.report_phish_addresses
                and not report_submission_policy.report_chat_message_enabled
                and report_submission_policy.report_chat_message_to_customized_address_enabled
            )

            if defender_settings_valid:
                report.status = "PASS"
                report.status_extended = "Defender report submission policy is properly configured for Teams security reporting."
            else:
                report.status = "FAIL"
                report.status_extended = "Defender report submission policy is not properly configured for Teams security reporting."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: defender_domain_dkim_enabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/defender/defender_domain_dkim_enabled/defender_domain_dkim_enabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "defender_domain_dkim_enabled",
  "CheckTitle": "Ensure that DKIM is enabled for all Exchange Online Domains",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Exchange Online Domain",
  "Description": "This check ensures that DomainKeys Identified Mail (DKIM) is enabled for all Exchange Online domains. DKIM is a crucial authentication method that, along with SPF and DMARC, helps prevent attackers from sending spoofed emails that appear to originate from your domain. By adding a digital signature to outbound emails, DKIM allows receiving email systems to verify the legitimacy of incoming messages.",
  "Risk": "If DKIM is not enabled, attackers may send spoofed emails that appear to originate from your domain, potentially leading to phishing attacks and damage to your domain's reputation.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/microsoft-365/security/office-365-security/use-dkim-to-validate-outbound-email?view=o365-worldwide",
  "Remediation": {
    "Code": {
      "CLI": "Set-DkimSigningConfig -Identity <domainName> -Enabled $True",
      "NativeIaC": "",
      "Other": "1. After DNS records are created, enable DKIM signing in Microsoft 365 Defender. 2. Navigate to Microsoft 365 Defender at https://security.microsoft.com/. 3. Go to Email & collaboration > Policies & rules > Threat policies. 4. Under Rules, select Email authentication settings. 5. Choose DKIM, click on each domain, and enable 'Sign messages for this domain with DKIM signature'.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable DKIM for all your Exchange Online domains to ensure emails are cryptographically signed and to protect against email spoofing.",
      "Url": "https://learn.microsoft.com/en-us/powershell/module/exchange/set-dkimsigningconfig?view=exchange-ps"
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

---[FILE: defender_domain_dkim_enabled.py]---
Location: prowler-master/prowler/providers/m365/services/defender/defender_domain_dkim_enabled/defender_domain_dkim_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.defender.defender_client import defender_client


class defender_domain_dkim_enabled(Check):
    """
    Check if DKIM is enabled for all Exchange Online domains.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """
        Execute the check to verify if DKIM is enabled for all domains.

        This method checks the DKIM signing configuration for each domain to determine if DKIM is enabled.

        Returns:
            List[CheckReportM365]: A list of reports containing the result of the check.
        """
        findings = []
        for config in defender_client.dkim_configurations:
            report = CheckReportM365(
                metadata=self.metadata(),
                resource=config,
                resource_name=config.id,
                resource_id=config.id,
            )
            report.status = "FAIL"
            report.status_extended = (
                f"DKIM is not enabled for domain with ID {config.id}."
            )

            if config.dkim_signing_enabled:
                report.status = "PASS"
                report.status_extended = (
                    f"DKIM is enabled for domain with ID {config.id}."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: defender_malware_policy_common_attachments_filter_enabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/defender/defender_malware_policy_common_attachments_filter_enabled/defender_malware_policy_common_attachments_filter_enabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "defender_malware_policy_common_attachments_filter_enabled",
  "CheckTitle": "Ensure the Common Attachment Types Filter is enabled.",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "Defender Malware Policy",
  "Description": "Ensure that the Common Attachment Types Filter is enabled in anti-malware policies to block known and custom malicious file types from being attached to emails.",
  "Risk": "If this setting is not enabled, users may receive emails with malicious attachments that could contain malware, increasing the risk of endpoint infection or data compromise.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/defender-office-365/anti-malware-policies-configure?view=o365-worldwide",
  "Remediation": {
    "Code": {
      "CLI": "Set-MalwareFilterPolicy -Identity Default -EnableFileFilter $true",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft 365 Defender https://security.microsoft.com. 2. Click to expand Email & collaboration and select Policies & rules. 3. On the Policies & rules page select Threat policies. 4. Under Policies, select Anti-malware and click on the Default (Default) policy. 5. On the policy page, scroll to the bottom and click Edit protection settings. 6. Check the option Enable the common attachments filter. 7. Click Save.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable the common attachment types filter in your default or custom anti-malware policy to prevent the delivery of emails with potentially dangerous attachments.",
      "Url": "https://learn.microsoft.com/en-us/powershell/module/exchange/set-malwarefilterpolicy?view=exchange-ps"
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

---[FILE: defender_malware_policy_common_attachments_filter_enabled.py]---
Location: prowler-master/prowler/providers/m365/services/defender/defender_malware_policy_common_attachments_filter_enabled/defender_malware_policy_common_attachments_filter_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.defender.defender_client import defender_client


class defender_malware_policy_common_attachments_filter_enabled(Check):
    """
    Check if the Common Attachment Types Filter is enabled in the Defender anti-malware policy.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """
        Execute the check to verify if the Common Attachment Types Filter is enabled.

        This method checks the Defender anti-malware policies to determine if the
        Common Attachment Types Filter is enabled.

        Returns:
            List[CheckReportM365]: A list of reports containing the result of the check.
        """
        findings = []

        if defender_client.malware_policies:
            # Only Default Defender Malware Policy exists
            if not defender_client.malware_rules:
                policy = defender_client.malware_policies[0]

                report = CheckReportM365(
                    metadata=self.metadata(),
                    resource=policy,
                    resource_name=policy.identity,
                    resource_id=policy.identity,
                )

                if policy.enable_file_filter:
                    # Case 1: Default policy exists and has the setting enabled
                    report.status = "PASS"
                    report.status_extended = f"{policy.identity} is the only policy and Common Attachment Types Filter is enabled."
                else:
                    # Case 5: Default policy exists but doesn't have the setting enabled
                    report.status = "FAIL"
                    report.status_extended = f"{policy.identity} is the only policy and Common Attachment Types Filter is not enabled."
                findings.append(report)

            # Multiple Defender Malware Policies exist
            else:
                default_policy_well_configured = False

                for policy in defender_client.malware_policies:
                    report = CheckReportM365(
                        metadata=self.metadata(),
                        resource=policy,
                        resource_name=policy.identity,
                        resource_id=policy.identity,
                    )

                    if policy.is_default:
                        if not policy.enable_file_filter:
                            # Case 4: Default policy doesn't have the setting enabled and there are other policies
                            report.status = "FAIL"
                            report.status_extended = (
                                f"{policy.identity} is the default policy and Common Attachment Types Filter is not enabled, "
                                "but it could be overridden by another well-configured Custom Policy."
                            )
                            findings.append(report)
                        else:
                            # Case 2: Default policy has the setting enabled and there are other policies
                            report.status = "PASS"
                            report.status_extended = (
                                f"{policy.identity} is the default policy and Common Attachment Types Filter is enabled, "
                                "but it could be overridden by another misconfigured Custom Policy."
                            )
                            default_policy_well_configured = True
                            findings.append(report)
                    else:
                        if not policy.enable_file_filter:
                            included_resources = []

                            if defender_client.malware_rules[policy.identity].users:
                                included_resources.append(
                                    f"users: {', '.join(defender_client.malware_rules[policy.identity].users)}"
                                )
                            if defender_client.malware_rules[policy.identity].groups:
                                included_resources.append(
                                    f"groups: {', '.join(defender_client.malware_rules[policy.identity].groups)}"
                                )
                            if defender_client.malware_rules[policy.identity].domains:
                                included_resources.append(
                                    f"domains: {', '.join(defender_client.malware_rules[policy.identity].domains)}"
                                )

                            included_resources_str = "; ".join(included_resources)

                            if default_policy_well_configured:
                                # Case 3: Default policy enables the setting but custom one doesn't
                                report.status = "FAIL"
                                report.status_extended = (
                                    f"Custom Malware policy {policy.identity} does not enable Common Attachment Types Filter and includes {included_resources_str}, "
                                    f"with priority {defender_client.malware_rules[policy.identity].priority} (0 is the highest). "
                                    "However, the default policy enables the filter, so entities not included by this custom policy could be correctly protected."
                                )
                                findings.append(report)
                            else:
                                # Case 5: Neither default nor custom policies enable the setting
                                report.status = "FAIL"
                                report.status_extended = (
                                    f"Custom Malware policy {policy.identity} does not enable Common Attachment Types Filter and includes {included_resources_str}, "
                                    f"with priority {defender_client.malware_rules[policy.identity].priority} (0 is the highest). "
                                    "Also, the default policy does not enable the filter, so entities not included by this custom policy could not be correctly protected."
                                )
                                findings.append(report)
                        else:
                            included_resources = []

                            if defender_client.malware_rules[policy.identity].users:
                                included_resources.append(
                                    f"users: {', '.join(defender_client.malware_rules[policy.identity].users)}"
                                )
                            if defender_client.malware_rules[policy.identity].groups:
                                included_resources.append(
                                    f"groups: {', '.join(defender_client.malware_rules[policy.identity].groups)}"
                                )
                            if defender_client.malware_rules[policy.identity].domains:
                                included_resources.append(
                                    f"domains: {', '.join(defender_client.malware_rules[policy.identity].domains)}"
                                )

                            included_resources_str = "; ".join(included_resources)

                            if default_policy_well_configured:
                                # Case 2: Both default and custom policies enable the setting
                                report.status = "PASS"
                                report.status_extended = (
                                    f"Custom Malware policy {policy.identity} enables Common Attachment Types Filter and includes {included_resources_str}, "
                                    f"with priority {defender_client.malware_rules[policy.identity].priority} (0 is the highest). "
                                    "Also, the default policy enables the filter, so entities not included by this custom policy could still be correctly protected."
                                )
                                findings.append(report)
                            else:
                                # Case 6: Default policy doesn't enable the setting, but custom policy does
                                report.status = "PASS"
                                report.status_extended = (
                                    f"Custom Malware policy {policy.identity} enables Common Attachment Types Filter and includes {included_resources_str}, "
                                    f"with priority {defender_client.malware_rules[policy.identity].priority} (0 is the highest). "
                                    "However, the default policy does not enable the filter, so entities not included by this custom policy could not be correctly protected."
                                )
                                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
