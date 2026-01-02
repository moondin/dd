---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 384
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 384 of 867)

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

---[FILE: defender_antispam_connection_filter_policy_safe_list_off.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/defender/defender_antispam_connection_filter_policy_safe_list_off/defender_antispam_connection_filter_policy_safe_list_off.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "defender_antispam_connection_filter_policy_safe_list_off",
  "CheckTitle": "Ensure the default connection filter policy has the SafeList setting disabled",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Defender Anti-Spam Policy",
  "Description": "This check ensures that the EnableSafeList setting in the default connection filter policy is set to False. The safe list, managed dynamically by Microsoft, allows emails from listed IPs to bypass spam filtering and sender authentication checks, posing a security risk.",
  "Risk": "If the safe list is enabled, emails from IPs on this list can bypass essential security checks (SPF, DKIM, DMARC), potentially allowing malicious emails to be delivered directly to users' inboxes.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/defender-office-365/connection-filter-policies-configure",
  "Remediation": {
    "Code": {
      "CLI": "Set-HostedConnectionFilterPolicy -Identity Default -EnableSafeList $false",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft 365 Defender https://security.microsoft.com. 2. Click to expand Email & collaboration and select Policies & rules. 3. On the Policies & rules page select Threat policies. 4. Under Policies, select Anti-spam and click on the Connection filter policy (Default). 5. Disable the safe list option. 6. Click Save.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that the EnableSafeList setting in your connection filter policy is set to False to prevent bypassing essential security checks.",
      "Url": "https://learn.microsoft.com/en-us/defender-office-365/create-safe-sender-lists-in-office-365#use-the-ip-allow-list"
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

---[FILE: defender_antispam_connection_filter_policy_safe_list_off.py]---
Location: prowler-master/prowler/providers/m365/services/defender/defender_antispam_connection_filter_policy_safe_list_off/defender_antispam_connection_filter_policy_safe_list_off.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.defender.defender_client import defender_client


class defender_antispam_connection_filter_policy_safe_list_off(Check):
    """
    Check if the Safe List is off in the Antispam Connection Filter Policy.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """
        Execute the check to verify if the Safe List is off.

        This method checks the Antispam Connection Filter Policy to determine if the
        Safe List is disabled.

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
            report.status_extended = f"Safe List is disabled in the Antispam Connection Filter Policy {policy.identity}."

            if policy.enable_safe_list:
                report.status = "FAIL"
                report.status_extended = f"Safe List is not disabled in the Antispam Connection Filter Policy {policy.identity}."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: defender_antispam_outbound_policy_configured.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/defender/defender_antispam_outbound_policy_configured/defender_antispam_outbound_policy_configured.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "defender_antispam_outbound_policy_configured",
  "CheckTitle": "Ensure Defender Outbound Spam Policies are set to notify administrators.",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "Defender Anti-Spam Outbound Policy",
  "Description": "Ensure that outbound anti-spam policies are configured to notify administrators and copy suspicious outbound messages to designated recipients when a sender is blocked for sending spam emails.",
  "Risk": "Without outbound spam notifications and message copies, compromised accounts may go undetected, increasing the risk of reputation damage or data leakage through unauthorized email activity.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/defender-office-365/outbound-spam-protection-about",
  "Remediation": {
    "Code": {
      "CLI": "$BccEmailAddress = @(\"<INSERT-EMAIL>\")\n$NotifyEmailAddress = @(\"<INSERT-EMAIL>\")\nSet-HostedOutboundSpamFilterPolicy -Identity Default -BccSuspiciousOutboundAdditionalRecipients $BccEmailAddress -BccSuspiciousOutboundMail $true -NotifyOutboundSpam $true -NotifyOutboundSpamRecipients $NotifyEmailAddress",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft 365 Defender https://security.microsoft.com. 2. Click to expand Email & collaboration and select Policies & rules > Threat policies. 3. Under Policies, select Anti-spam. 4. Click on the Anti-spam outbound policy (default). 5. Select Edit protection settings then under Notifications: 6. Check 'Send a copy of suspicious outbound messages or message that exceed these limits to these users and groups' and enter the email addresses. 7. Check 'Notify these users and groups if a sender is blocked due to sending outbound spam' and enter the desired email addresses. 8. Click Save.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Configure Defender outbound spam filter policies to notify administrators and copy suspicious outbound messages when users are blocked for sending spam.",
      "Url": "https://learn.microsoft.com/en-us/defender-office-365/outbound-spam-protection-about"
    }
  },
  "Categories": [
    "e3"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Ensure settings are applied to the highest priority policy if custom policies exist. Default values do not notify or copy outbound spam messages by default."
}
```

--------------------------------------------------------------------------------

---[FILE: defender_antispam_outbound_policy_configured.py]---
Location: prowler-master/prowler/providers/m365/services/defender/defender_antispam_outbound_policy_configured/defender_antispam_outbound_policy_configured.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.defender.defender_client import defender_client


class defender_antispam_outbound_policy_configured(Check):
    """
    Check if the outbound spam policy is established and properly configured in the Defender service.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """
        Execute the check to verify if an outbound spam policy is established and properly configured.

        This method checks the Defender outbound spam policies to ensure they are configured
        according to best practices.

        Returns:
            List[CheckReportM365]: A list of reports containing the result of the check.
        """
        findings = []

        if defender_client.outbound_spam_policies:
            # Only Default Defender Outbound Spam Policy
            if not defender_client.outbound_spam_rules:
                # Get the only policy in the dictionary
                policy = next(iter(defender_client.outbound_spam_policies.values()))

                report = CheckReportM365(
                    metadata=self.metadata(),
                    resource=policy,
                    resource_name=policy.name,
                    resource_id=policy.name,
                )

                if self._is_policy_properly_configured(policy):
                    # Case 1: Default policy exists and is properly configured
                    report.status = "PASS"
                    report.status_extended = f"{policy.name} is the only policy and it's properly configured in the default Defender Outbound Spam Policy."
                else:
                    # Case 5: Default policy exists but is not properly configured
                    report.status = "FAIL"
                    report.status_extended = f"{policy.name} is the only policy and it's not properly configured in the default Defender Outbound Spam Policy."
                findings.append(report)

            # Multiple Defender Outbound Spam Policies
            else:
                default_policy_well_configured = False

                for (
                    policy_name,
                    policy,
                ) in defender_client.outbound_spam_policies.items():
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
                            report.status_extended = f"{policy_name} is not properly configured in the default Defender Outbound Spam Policy, but could be overridden by another well-configured Custom Policy."
                            findings.append(report)
                        else:
                            # Case 2: Default policy is properly configured and there are other policies
                            report.status = "PASS"
                            report.status_extended = f"{policy_name} is properly configured in the default Defender Outbound Spam Policy, but could be overridden by another bad-configured Custom Policy."
                            default_policy_well_configured = True
                            findings.append(report)
                    else:
                        if not self._is_policy_properly_configured(policy):
                            included_resources = []

                            if defender_client.outbound_spam_rules[policy.name].users:
                                included_resources.append(
                                    f"users: {', '.join(defender_client.outbound_spam_rules[policy.name].users)}"
                                )
                            if defender_client.outbound_spam_rules[policy.name].groups:
                                included_resources.append(
                                    f"groups: {', '.join(defender_client.outbound_spam_rules[policy.name].groups)}"
                                )
                            if defender_client.outbound_spam_rules[policy.name].domains:
                                included_resources.append(
                                    f"domains: {', '.join(defender_client.outbound_spam_rules[policy.name].domains)}"
                                )

                            included_resources_str = "; ".join(included_resources)

                            # Case 3: Default policy is properly configured but other custom policies are not
                            if default_policy_well_configured:
                                report.status = "FAIL"
                                report.status_extended = (
                                    f"Custom Outbound Spam policy {policy_name} is not properly configured and includes {included_resources_str}, "
                                    f"with priority {defender_client.outbound_spam_rules[policy.name].priority} (0 is the highest). "
                                    "However, the default policy is properly configured, so entities not included by this custom policy could be correctly protected."
                                )
                                findings.append(report)
                            # Case 5: Default policy is not properly configured and other custom policies are not
                            else:
                                report.status = "FAIL"
                                report.status_extended = (
                                    f"Custom Outbound Spam policy {policy_name} is not properly configured and includes {included_resources_str}, "
                                    f"with priority {defender_client.outbound_spam_rules[policy.name].priority} (0 is the highest). "
                                    "Also, the default policy is not properly configured, so entities not included by this custom policy could not be correctly protected."
                                )
                                findings.append(report)
                        else:
                            included_resources = []

                            if defender_client.outbound_spam_rules[policy.name].users:
                                included_resources.append(
                                    f"users: {', '.join(defender_client.outbound_spam_rules[policy.name].users)}"
                                )
                            if defender_client.outbound_spam_rules[policy.name].groups:
                                included_resources.append(
                                    f"groups: {', '.join(defender_client.outbound_spam_rules[policy.name].groups)}"
                                )
                            if defender_client.outbound_spam_rules[policy.name].domains:
                                included_resources.append(
                                    f"domains: {', '.join(defender_client.outbound_spam_rules[policy.name].domains)}"
                                )

                            included_resources_str = "; ".join(included_resources)

                            # Case 2: Default policy is properly configured and other custom policies are too
                            if default_policy_well_configured:
                                report.status = "PASS"
                                report.status_extended = (
                                    f"Custom Outbound Spam policy {policy_name} is properly configured and includes {included_resources_str}, "
                                    f"with priority {defender_client.outbound_spam_rules[policy.name].priority} (0 is the highest). "
                                    "Also, the default policy is properly configured, so entities not included by this custom policy could still be correctly protected."
                                )
                                findings.append(report)
                            # Case 6: Default policy is not properly configured but other custom policies are
                            else:
                                report.status = "PASS"
                                report.status_extended = (
                                    f"Custom Outbound Spam policy {policy_name} is properly configured and includes {included_resources_str}, "
                                    f"with priority {defender_client.outbound_spam_rules[policy.name].priority} (0 is the highest). "
                                    "However, the default policy is not properly configured, so entities not included by this custom policy could not be correctly protected."
                                )
                                findings.append(report)

        return findings

    def _is_policy_properly_configured(self, policy) -> bool:
        """
        Check if a policy is properly configured according to best practices.

        Args:
            policy: The outbound spam policy to check.

        Returns:
            bool: True if the policy is properly configured, False otherwise.
        """
        return (
            (
                policy.default
                or defender_client.outbound_spam_rules[policy.name].state.lower()
                == "enabled"
            )
            and policy.notify_limit_exceeded
            and policy.notify_sender_blocked
            and policy.notify_limit_exceeded_addresses
            and policy.notify_sender_blocked_addresses
        )
```

--------------------------------------------------------------------------------

---[FILE: defender_antispam_outbound_policy_forwarding_disabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/defender/defender_antispam_outbound_policy_forwarding_disabled/defender_antispam_outbound_policy_forwarding_disabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "defender_antispam_outbound_policy_forwarding_disabled",
  "CheckTitle": "Ensure Defender Outbound Spam Policies are set to disable mail forwarding.",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Defender Anti-Spam Outbound Policy",
  "Description": "Ensure Defender Outbound Spam Policies are set to disable mail forwarding.",
  "Risk": "Enabling email auto-forwarding can be exploited by attackers or malicious insiders to exfiltrate sensitive data outside the organization, often without detection.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/defender-office-365/outbound-spam-protection-about",
  "Remediation": {
    "Code": {
      "CLI": "Set-HostedOutboundSpamFilterPolicy -Identity {policyName} -AutoForwardingMode Off",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft 365 Defender https://security.microsoft.com/. 2. Expand E-mail & collaboration then select Policies & rules. 3. Select Threat policies > Anti-spam. 4. Select Anti-spam outbound policy (default). 5. Click Edit protection settings. 6. Set Automatic forwarding rules dropdown to Off - Forwarding is disabled and click Save. 7. Repeat steps 4-6 for any additional higher priority, custom policies.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Block all forms of mail forwarding using Anti-spam outbound policies in Exchange Online. Apply exclusions only where justified by organizational policy.",
      "Url": "https://learn.microsoft.com/en-us/defender-office-365/outbound-spam-protection-about"
    }
  },
  "Categories": [
    "e3"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Ensure settings are applied to the highest priority policy if custom policies exist."
}
```

--------------------------------------------------------------------------------

---[FILE: defender_antispam_outbound_policy_forwarding_disabled.py]---
Location: prowler-master/prowler/providers/m365/services/defender/defender_antispam_outbound_policy_forwarding_disabled/defender_antispam_outbound_policy_forwarding_disabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.defender.defender_client import defender_client


class defender_antispam_outbound_policy_forwarding_disabled(Check):
    """
    Check if the Defender Outbound Spam Policies are configured to disable mail forwarding.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """
        Execute the check to verify if the Defender Outbound Spam Policies disable mail forwarding.

        Returns:
            List[CheckReportM365]: A list of reports containing the result of the check.
        """
        findings = []

        if defender_client.outbound_spam_policies:
            # Only Default Defender Outbound Spam Policy exists
            if not defender_client.outbound_spam_rules:
                policy = next(iter(defender_client.outbound_spam_policies.values()))

                report = CheckReportM365(
                    metadata=self.metadata(),
                    resource=policy,
                    resource_name=policy.name,
                    resource_id=policy.name,
                )

                if self._is_forwarding_disabled(policy):
                    # Case 1: Default policy exists and has forwarding disabled
                    report.status = "PASS"
                    report.status_extended = f"{policy.name} is the only policy and mail forwarding is disabled."
                else:
                    # Case 5: Default policy exists but allows forwarding
                    report.status = "FAIL"
                    report.status_extended = f"{policy.name} is the only policy and mail forwarding is allowed."
                findings.append(report)

            # Multiple Defender Outbound Spam Policies exist
            else:
                default_policy_well_configured = False

                for (
                    policy_name,
                    policy,
                ) in defender_client.outbound_spam_policies.items():
                    report = CheckReportM365(
                        metadata=self.metadata(),
                        resource=policy,
                        resource_name=policy_name,
                        resource_id=policy_name,
                    )

                    if policy.default:
                        if not self._is_forwarding_disabled(policy):
                            # Case 4: Default policy allows forwarding and there are other policies
                            report.status = "FAIL"
                            report.status_extended = (
                                f"{policy_name} is the default policy and mail forwarding is allowed, "
                                "but it could be overridden by another well-configured Custom Policy."
                            )
                            findings.append(report)
                        else:
                            # Case 2: Default policy disables forwarding and there are other policies
                            report.status = "PASS"
                            report.status_extended = (
                                f"{policy_name} is the default policy and mail forwarding is disabled, "
                                "but it could be overridden by another misconfigured Custom Policy."
                            )
                            default_policy_well_configured = True
                            findings.append(report)
                    else:
                        if not self._is_forwarding_disabled(policy):
                            included_resources = []

                            if defender_client.outbound_spam_rules[policy.name].users:
                                included_resources.append(
                                    f"users: {', '.join(defender_client.outbound_spam_rules[policy.name].users)}"
                                )
                            if defender_client.outbound_spam_rules[policy.name].groups:
                                included_resources.append(
                                    f"groups: {', '.join(defender_client.outbound_spam_rules[policy.name].groups)}"
                                )
                            if defender_client.outbound_spam_rules[policy.name].domains:
                                included_resources.append(
                                    f"domains: {', '.join(defender_client.outbound_spam_rules[policy.name].domains)}"
                                )

                            included_resources_str = "; ".join(included_resources)

                            if default_policy_well_configured:
                                # Case 3: Default policy disables forwarding but custom one doesn't
                                report.status = "FAIL"
                                report.status_extended = (
                                    f"Custom Outbound Spam policy {policy_name} allows mail forwarding and includes {included_resources_str}, "
                                    f"with priority {defender_client.outbound_spam_rules[policy.name].priority} (0 is the highest). "
                                    "However, the default policy disables mail forwarding, so entities not included by this custom policy could be correctly protected."
                                )
                                findings.append(report)
                            else:
                                # Case 5: Neither default nor custom policies disable forwarding
                                report.status = "FAIL"
                                report.status_extended = (
                                    f"Custom Outbound Spam policy {policy_name} allows mail forwarding and includes {included_resources_str}, "
                                    f"with priority {defender_client.outbound_spam_rules[policy.name].priority} (0 is the highest). "
                                    "Also, the default policy allows mail forwarding, so entities not included by this custom policy could not be correctly protected."
                                )
                                findings.append(report)
                        else:
                            included_resources = []

                            if defender_client.outbound_spam_rules[policy.name].users:
                                included_resources.append(
                                    f"users: {', '.join(defender_client.outbound_spam_rules[policy.name].users)}"
                                )
                            if defender_client.outbound_spam_rules[policy.name].groups:
                                included_resources.append(
                                    f"groups: {', '.join(defender_client.outbound_spam_rules[policy.name].groups)}"
                                )
                            if defender_client.outbound_spam_rules[policy.name].domains:
                                included_resources.append(
                                    f"domains: {', '.join(defender_client.outbound_spam_rules[policy.name].domains)}"
                                )

                            included_resources_str = "; ".join(included_resources)

                            if default_policy_well_configured:
                                # Case 2: Both default and custom policies disable forwarding
                                report.status = "PASS"
                                report.status_extended = (
                                    f"Custom Outbound Spam policy {policy_name} disables mail forwarding and includes {included_resources_str}, "
                                    f"with priority {defender_client.outbound_spam_rules[policy.name].priority} (0 is the highest). "
                                    "Also, the default policy disables mail forwarding, so entities not included by this custom policy could still be correctly protected."
                                )
                                findings.append(report)
                            else:
                                # Case 6: Default policy allows forwarding, custom policy disables it
                                report.status = "PASS"
                                report.status_extended = (
                                    f"Custom Outbound Spam policy {policy_name} disables mail forwarding and includes {included_resources_str}, "
                                    f"with priority {defender_client.outbound_spam_rules[policy.name].priority} (0 is the highest). "
                                    "However, the default policy allows mail forwarding, so entities not included by this custom policy could not be correctly protected."
                                )
                                findings.append(report)

        return findings

    def _is_forwarding_disabled(self, policy) -> bool:
        """
        Check if mail forwarding is disabled in the policy.

        Args:
            policy: The outbound spam policy to check.

        Returns:
            bool: True if mail forwarding is disabled, False otherwise.
        """
        return (
            policy.default
            or defender_client.outbound_spam_rules[policy.name].state.lower()
            == "enabled"
        ) and policy.auto_forwarding_mode == "Off"
```

--------------------------------------------------------------------------------

---[FILE: defender_antispam_policy_inbound_no_allowed_domains.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/defender/defender_antispam_policy_inbound_no_allowed_domains/defender_antispam_policy_inbound_no_allowed_domains.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "defender_antispam_policy_inbound_no_allowed_domains",
  "CheckTitle": "Ensure inbound anti-spam policies do not contain allowed domains",
  "CheckType": [],
  "ServiceName": "defender",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "low",
  "ResourceType": "Defender Anti-Spam Policy",
  "Description": "Ensure that inbound anti-spam policies do not have any domains listed in the AllowedSenderDomains. Messages from these domains bypass most email protections, increasing the risk of successful phishing attacks.",
  "Risk": "Having domains in the AllowedSenderDomains list allows emails from these domains to bypass essential security checks, increasing the risk of phishing attacks and other malicious activities.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/defender-office-365/anti-spam-protection-about#allow-and-block-lists-in-anti-spam-policies",
  "Remediation": {
    "Code": {
      "CLI": "Set-HostedContentFilterPolicy -Identity <Policy name> -AllowedSenderDomains @{}",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft 365 Defender (https://security.microsoft.com). 2. Click to expand Email & collaboration and select Policies & rules > Threat policies. 3. Under Policies, select Anti-spam. 4. Open each out-of-compliance inbound anti-spam policy by clicking on it. 5. Click Edit allowed and blocked senders and domains. 6. Select Allow domains. 7. Delete each domain from the domains list. 8. Click Done > Save. 9. Repeat as needed.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that the AllowedSenderDomains list in your inbound anti-spam policies is empty to prevent bypassing essential security checks.",
      "Url": "https://learn.microsoft.com/en-us/microsoft-365/security/office-365-security/configure-the-allowed-sender-domains?view=o365-worldwide"
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
