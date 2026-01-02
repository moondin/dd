---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 388
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 388 of 867)

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

---[FILE: entra_identity_protection_sign_in_risk_enabled.py]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_identity_protection_sign_in_risk_enabled/entra_identity_protection_sign_in_risk_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.entra.entra_client import entra_client
from prowler.providers.m365.services.entra.entra_service import (
    ConditionalAccessGrantControl,
    ConditionalAccessPolicyState,
    RiskLevel,
    SignInFrequencyInterval,
)


class entra_identity_protection_sign_in_risk_enabled(Check):
    """Check if at least one Conditional Access policy is an Identity Protection sign-in risk policy.

    This check ensures that at least one Conditional Access policy is an Identity Protection sign-in risk policy.
    """

    def execute(self) -> list[CheckReportM365]:
        """Execute the check to ensure that at least one Conditional Access policy is an Identity Protection sign-in risk policy.

        Returns:
            list[CheckReportM365]: A list containing the results of the check.
        """
        findings = []

        report = CheckReportM365(
            metadata=self.metadata(),
            resource={},
            resource_name="Conditional Access Policies",
            resource_id="conditionalAccessPolicies",
        )
        report.status = "FAIL"
        report.status_extended = "No Conditional Access Policy is a sign-in risk based Identity Protection Policy."

        for policy in entra_client.conditional_access_policies.values():
            if policy.state == ConditionalAccessPolicyState.DISABLED:
                continue

            if "All" not in policy.conditions.user_conditions.included_users:
                continue

            if (
                "All"
                not in policy.conditions.application_conditions.included_applications
            ):
                continue

            if (
                ConditionalAccessGrantControl.MFA
                not in policy.grant_controls.built_in_controls
            ):
                continue

            if (
                SignInFrequencyInterval.EVERY_TIME
                != policy.session_controls.sign_in_frequency.interval
            ):
                continue

            report = CheckReportM365(
                metadata=self.metadata(),
                resource=policy,
                resource_name=policy.display_name,
                resource_id=policy.id,
            )
            if (
                RiskLevel.HIGH not in policy.conditions.sign_in_risk_levels
                or RiskLevel.MEDIUM not in policy.conditions.sign_in_risk_levels
            ):
                report.status = "FAIL"
                report.status_extended = f"Conditional Access Policy '{policy.display_name}' is a sign-in risk based Identity Protection Policy but does not protect against high and medium sign-in risk attempts."
            elif policy.state == ConditionalAccessPolicyState.ENABLED_FOR_REPORTING:
                report.status = "FAIL"
                report.status_extended = f"Conditional Access Policy '{policy.display_name}' is a sign-in risk based Identity Protection Policy and reports high and medium risk potential sign-in attempts, but does not protect against them."
            else:
                report.status = "PASS"
                report.status_extended = f"Conditional Access Policy '{policy.display_name}' is a sign-in risk based Identity Protection Policy and does protect against high and medium risk potential sign-in attempts."
                break

        findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_identity_protection_user_risk_enabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_identity_protection_user_risk_enabled/entra_identity_protection_user_risk_enabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "entra_identity_protection_user_risk_enabled",
  "CheckTitle": "Ensure that Identity Protection user risk policies are enabled",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Conditional Access Policy",
  "Description": "Ensure that Identity Protection user risk policies are enabled to detect and respond to high risk potential account compromises.",
  "Risk": "Without Identity Protection user risk policies enabled, compromised accounts may go undetected, allowing attackers to exploit breached credentials and gain unauthorized access. The absence of automated responses to user risk levels increases the likelihood of security incidents, such as data breaches or privilege escalation.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. Navigate to the Microsoft Entra admin center https://entra.microsoft.com. 2. Click expand Protection > Conditional Access select Policies. 3. Create a new policy by selecting New policy. 4. Set the following conditions within the policy: Under Users or workload identities choose All users. Under Cloud apps or actions choose All cloud apps. Under Conditions choose User risk then Yes and select the user risk level High. Under Access Controls select Grant then in the right pane click Grant access then select Require multifactor authentication and Require password change. Under Session ensure Sign-in frequency is set to Every time. Click Select. 5. Under Enable policy set it to Report Only until the organization is ready to enable it. 6. Click Create.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable Identity Protection user risk policies to detect and respond to potential account compromises. Configure Conditional Access policies to enforce MFA or password resets when a high user risk level is detected. Regularly review the Risky Users section to assess potential threats before enforcing strict access controls.",
      "Url": "https://learn.microsoft.com/en-us/entra/id-protection/howto-identity-protection-configure-risk-policies"
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

---[FILE: entra_identity_protection_user_risk_enabled.py]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_identity_protection_user_risk_enabled/entra_identity_protection_user_risk_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.entra.entra_client import entra_client
from prowler.providers.m365.services.entra.entra_service import (
    ConditionalAccessGrantControl,
    ConditionalAccessPolicyState,
    GrantControlOperator,
    RiskLevel,
)


class entra_identity_protection_user_risk_enabled(Check):
    """Check if at least one Conditional Access policy is an Identity Protection user risk policy.

    This check ensures that at least one Conditional Access policy is an Identity Protection user risk policy.
    """

    def execute(self) -> list[CheckReportM365]:
        """Execute the check to ensure that at least one Conditional Access policy is an Identity Protection user risk policy.

        Returns:
            list[CheckReportM365]: A list containing the results of the check.
        """
        findings = []

        report = CheckReportM365(
            metadata=self.metadata(),
            resource={},
            resource_name="Conditional Access Policies",
            resource_id="conditionalAccessPolicies",
        )
        report.status = "FAIL"
        report.status_extended = "No Conditional Access Policy is a user risk based Identity Protection Policy."

        for policy in entra_client.conditional_access_policies.values():
            if policy.state == ConditionalAccessPolicyState.DISABLED:
                continue

            if "All" not in policy.conditions.user_conditions.included_users:
                continue

            if (
                "All"
                not in policy.conditions.application_conditions.included_applications
            ):
                continue

            if (
                ConditionalAccessGrantControl.PASSWORD_CHANGE
                not in policy.grant_controls.built_in_controls
                or ConditionalAccessGrantControl.MFA
                not in policy.grant_controls.built_in_controls
                or policy.grant_controls.operator != GrantControlOperator.AND
            ):
                continue

            if policy.conditions.user_risk_levels:
                report = CheckReportM365(
                    metadata=self.metadata(),
                    resource=policy,
                    resource_name=policy.display_name,
                    resource_id=policy.id,
                )
                if RiskLevel.HIGH not in policy.conditions.user_risk_levels:
                    report.status = "FAIL"
                    report.status_extended = f"Conditional Access Policy '{policy.display_name}' is a user risk based Identity Protection Policy but does not protect against high risk potential account compromises."
                elif policy.state == ConditionalAccessPolicyState.ENABLED_FOR_REPORTING:
                    report.status = "FAIL"
                    report.status_extended = f"Conditional Access Policy '{policy.display_name}' is a user risk based Identity Protection Policy and reports high risk potential account compromises, but does not protect against them."
                else:
                    report.status = "PASS"
                    report.status_extended = f"Conditional Access Policy '{policy.display_name}' is a user risk based Identity Protection Policy and does protect against high risk potential account compromises."
                    break

        findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_intune_enrollment_sign_in_frequency_every_time.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_intune_enrollment_sign_in_frequency_every_time/entra_intune_enrollment_sign_in_frequency_every_time.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "entra_intune_enrollment_sign_in_frequency_every_time",
  "CheckTitle": "Ensure sign-in frequency for Intune Enrollment is set to every time",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Conditional Access Policy",
  "Description": "Ensure that Conditional Access policies enforce sign-in frequency to Every time for Microsoft Intune Enrollment Application.",
  "Risk": "If not enforced, attackers with compromised credentials may enroll a new device into Intune and gain persistent and elevated access through a bypass of compliance-based Conditional Access rules.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/intune/intune-service/fundamentals/deployment-guide-enrollment",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. Navigate to the Microsoft Entra admin center https://entra.microsoft.com. 2. Click expand Protection > Conditional Access select Policies. 3. Create a new policy by selecting New policy. o Under Users include All users. o Under Target resources select Resources (formerly cloud apps), choose Select resources and add Microsoft Intune Enrollment to the list. o Under Grant select Grant access. o Check either Require multifactor authentication or Require authentication strength. o Under Session check Sign-in frequency and select Every time. 4. Under Enable policy set it to Report-only until the organization is ready to enable it. 5. Click Create",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Configure a Conditional Access policy that targets Microsoft Intune Enrollment and enforces sign-in frequency to 'Every time'. This ensures that users must reauthenticate for each Intune enrollment action, reducing the risk of unauthorized device enrollment using compromised credentials. Note: Microsoft accounts for a five-minute clock skew when 'every time' is selected, ensuring users are not prompted more frequently than once every five minutes.",
      "Url": "https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-conditional-access-session#sign-in-frequency"
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

---[FILE: entra_intune_enrollment_sign_in_frequency_every_time.py]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_intune_enrollment_sign_in_frequency_every_time/entra_intune_enrollment_sign_in_frequency_every_time.py

```python
from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.entra.entra_client import entra_client
from prowler.providers.m365.services.entra.entra_service import (
    ConditionalAccessPolicyState,
    SignInFrequencyInterval,
)


class entra_intune_enrollment_sign_in_frequency_every_time(Check):
    """Ensure sign-in frequency for Intune Enrollment is set to 'Every time'."""

    def execute(self) -> list[CheckReportM365]:
        """Execute the check to ensure that sign-in frequency for Intune Enrollment is set to 'Every time'.

        Returns:
            list[CheckReportM365]: A list containing the results of the check.
        """
        findings = []

        report = CheckReportM365(
            metadata=self.metadata(),
            resource={},
            resource_name="Conditional Access Policies",
            resource_id="conditionalAccessPolicies",
        )
        report.status = "FAIL"
        report.status_extended = "No Conditional Access Policy enforces Every Time sign-in frequency for Intune Enrollment."

        for policy in entra_client.conditional_access_policies.values():
            if policy.state == ConditionalAccessPolicyState.DISABLED:
                continue

            if (
                "d4ebce55-015a-49b5-a083-c84d1797ae8c"
                not in policy.conditions.application_conditions.included_applications
            ):
                continue

            if (
                "d4ebce55-015a-49b5-a083-c84d1797ae8c"
                in policy.conditions.application_conditions.excluded_applications
            ):
                continue

            if "All" not in policy.conditions.user_conditions.included_users:
                continue

            if not policy.session_controls.sign_in_frequency.is_enabled:
                continue

            if (
                policy.session_controls.sign_in_frequency.interval
                == SignInFrequencyInterval.EVERY_TIME
            ):
                report = CheckReportM365(
                    metadata=self.metadata(),
                    resource=policy,
                    resource_name=policy.display_name,
                    resource_id=policy.id,
                )
                if policy.state == ConditionalAccessPolicyState.ENABLED_FOR_REPORTING:
                    report.status = "FAIL"
                    report.status_extended = f"Conditional Access Policy {policy.display_name} reports Every Time sign-in frequency for Intune Enrollment but does not enforce it."
                else:
                    report.status = "PASS"
                    report.status_extended = f"Conditional Access Policy {policy.display_name} enforces Every Time sign-in frequency for Intune Enrollment."
                    break

        findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_legacy_authentication_blocked.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_legacy_authentication_blocked/entra_legacy_authentication_blocked.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "entra_legacy_authentication_blocked",
  "CheckTitle": "Ensure that Conditional Access policy blocks legacy authentication",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "Conditional Access Policy",
  "Description": "Ensure that Conditional Access policy blocks legacy authentication in Microsoft Entra ID to enforce modern authentication methods and protect against credential-stuffing and brute-force attacks.",
  "Risk": "Legacy authentication protocols do not support MFA, making them vulnerable to credential-stuffing and brute-force attacks. Attackers commonly exploit these protocols to bypass security controls and gain unauthorized access.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-block-legacy-authentication",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. Navigate to the Microsoft Entra admin center https://entra.microsoft.com. 2. Click expand Protection > Conditional Access select Policies. 3. Create a new policy by selecting New policy. Under Users include All users. Under Target resources include All cloud apps and do not create any exclusions. Under Conditions select Client apps and check the boxes for Exchange ActiveSync clients and Other clients. Under Grant select Block Access. Click Select. 4. Set the policy On and click Create.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enforce Conditional Access policies to block legacy authentication across all users in Microsoft Entra ID. Ensure all applications and devices use modern authentication methods such as OAuth 2.0. For necessary exceptions (e.g., multifunction printers), configure secure alternatives following Microsoft's mail flow best practices.",
      "Url": "https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-block-legacy-authentication"
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

---[FILE: entra_legacy_authentication_blocked.py]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_legacy_authentication_blocked/entra_legacy_authentication_blocked.py

```python
from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.entra.entra_client import entra_client
from prowler.providers.m365.services.entra.entra_service import (
    ClientAppType,
    ConditionalAccessGrantControl,
    ConditionalAccessPolicyState,
)


class entra_legacy_authentication_blocked(Check):
    """Check if at least one Conditional Access policy blocks legacy authentication.

    This check ensures that at least one Conditional Access policy blocks legacy authentication.
    """

    def execute(self) -> list[CheckReportM365]:
        """Execute the check to ensure that at least one Conditional Access policy blocks legacy authentication.

        Returns:
            list[CheckReportM365]: A list containing the results of the check.
        """
        findings = []
        report = CheckReportM365(
            metadata=self.metadata(),
            resource={},
            resource_name="Conditional Access Policies",
            resource_id="conditionalAccessPolicies",
        )
        report.status = "FAIL"
        report.status_extended = (
            "No Conditional Access Policy blocks legacy authentication."
        )

        for policy in entra_client.conditional_access_policies.values():
            if policy.state == ConditionalAccessPolicyState.DISABLED:
                continue

            if "All" not in policy.conditions.user_conditions.included_users:
                continue

            if (
                "All"
                not in policy.conditions.application_conditions.included_applications
            ):
                continue

            if (
                ClientAppType.EXCHANGE_ACTIVE_SYNC
                not in policy.conditions.client_app_types
                or ClientAppType.OTHER_CLIENTS not in policy.conditions.client_app_types
            ):
                continue

            if (
                ConditionalAccessGrantControl.BLOCK
                in policy.grant_controls.built_in_controls
            ):
                report = CheckReportM365(
                    metadata=self.metadata(),
                    resource=policy,
                    resource_name=policy.display_name,
                    resource_id=policy.id,
                )
                if policy.state == ConditionalAccessPolicyState.ENABLED_FOR_REPORTING:
                    report.status = "FAIL"
                    report.status_extended = f"Conditional Access Policy '{policy.display_name}' reports legacy authentication but does not block it."
                else:
                    report.status = "PASS"
                    report.status_extended = f"Conditional Access Policy '{policy.display_name}' blocks legacy authentication."
                    break

        findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_managed_device_required_for_authentication.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_managed_device_required_for_authentication/entra_managed_device_required_for_authentication.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "entra_managed_device_required_for_authentication",
  "CheckTitle": "Ensure that only managed devices are required for authentication",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "Conditional Access Policy",
  "Description": "Ensure that only managed devices are required for authentication to reduce the risk of unauthorized access from unsecured or unmanaged devices.",
  "Risk": "Allowing authentication from unmanaged devices increases the attack surface, as these devices may lack security controls, endpoint detection, and compliance policies. Attackers could leverage compromised credentials from unsecured devices to gain unauthorized access to corporate resources.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. Navigate to the Microsoft Entra admin center https://entra.microsoft.com. 2. Click expand Protection > Conditional Access select Policies. 3. Create a new policy by selecting New policy. Under Users include All users. Under Target resources include All cloud apps. Under Grant select Grant access. Check Require multifactor authentication and Require Microsoft Entra hybrid joined device. Choose Require one of the selected controls and click Select at the bottom. 4. Under Enable policy set it to Report Only until the organization is ready to enable it. 5. Click Create.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enforce Conditional Access policies requiring authentication only from managed devices. Configure policies to allow access only from Entra hybrid joined or Intune-compliant devices. This ensures that only secure, policy-enforced endpoints can access corporate resources, reducing the risk of credential theft and unauthorized access.",
      "Url": "https://learn.microsoft.com/en-us/mem/intune/protect/create-conditional-access-intune"
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

---[FILE: entra_managed_device_required_for_authentication.py]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_managed_device_required_for_authentication/entra_managed_device_required_for_authentication.py

```python
from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.entra.entra_client import entra_client
from prowler.providers.m365.services.entra.entra_service import (
    ConditionalAccessGrantControl,
    ConditionalAccessPolicyState,
    GrantControlOperator,
)


class entra_managed_device_required_for_authentication(Check):
    """Check if Conditional Access policies enforce managed device requirement for authentication.

    This check ensures that Conditional Access policies are in place to enforce managed device requirement for authentication.
    """

    def execute(self) -> list[CheckReportM365]:
        """Execute the check to ensure that Conditional Access policies enforce managed device requirement for authentication.

        Returns:
            list[CheckReportM365]: A list containing the results of the check.
        """
        findings = []

        report = CheckReportM365(
            metadata=self.metadata(),
            resource={},
            resource_name="Conditional Access Policies",
            resource_id="conditionalAccessPolicies",
        )
        report.status = "FAIL"
        report.status_extended = (
            "No Conditional Access Policy requires a managed device for authentication."
        )

        for policy in entra_client.conditional_access_policies.values():
            if policy.state == ConditionalAccessPolicyState.DISABLED:
                continue

            if "All" not in policy.conditions.user_conditions.included_users:
                continue

            if (
                "All"
                not in policy.conditions.application_conditions.included_applications
            ):
                continue

            if (
                ConditionalAccessGrantControl.DOMAIN_JOINED_DEVICE
                not in policy.grant_controls.built_in_controls
                or ConditionalAccessGrantControl.MFA
                not in policy.grant_controls.built_in_controls
            ):
                continue

            if policy.grant_controls.operator == GrantControlOperator.OR:
                report = CheckReportM365(
                    metadata=self.metadata(),
                    resource=policy,
                    resource_name=policy.display_name,
                    resource_id=policy.id,
                )
                if policy.state == ConditionalAccessPolicyState.ENABLED_FOR_REPORTING:
                    report.status = "FAIL"
                    report.status_extended = f"Conditional Access Policy '{policy.display_name}' reports the requirement of a managed device for authentication but does not enforce it."
                else:
                    report.status = "PASS"
                    report.status_extended = f"Conditional Access Policy '{policy.display_name}' does require a managed device for authentication."
                    break

        findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_managed_device_required_for_mfa_registration.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_managed_device_required_for_mfa_registration/entra_managed_device_required_for_mfa_registration.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "entra_managed_device_required_for_mfa_registration",
  "CheckTitle": "Ensure that only managed devices are required for MFA registration",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "Conditional Access Policy",
  "Description": "Ensure that only managed devices are required for MFA registration. This ensures that users enroll MFA using secure, organization-controlled devices.",
  "Risk": "If users are allowed to register MFA on unmanaged or potentially compromised devices, attackers with stolen credentials may register their own MFA methods, effectively locking out legitimate users and taking over accounts. This increases the risk of unauthorized access, data breaches, and privilege escalation.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. Navigate to the Microsoft Entra admin center https://entra.microsoft.com. 2. Click expand Protection > Conditional Access select Policies. 3. Create a new policy by selecting New policy. Under Users include All users. Under Target resources select User actions and check Register security information. Under Grant select Grant access. Check Require multifactor authentication and Require Microsoft Entra hybrid joined device. Choose Require one of the selected controls and click Select at the bottom. 4. Under Enable policy set it to Report Only until the organization is ready to enable it. 5. Click Create.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enforce MFA registration only from managed devices by requiring compliance through Intune or Entra hybrid join. This ensures that users enroll MFA using secure, organization-controlled devices.",
      "Url": "https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-device-registration"
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

---[FILE: entra_managed_device_required_for_mfa_registration.py]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_managed_device_required_for_mfa_registration/entra_managed_device_required_for_mfa_registration.py

```python
from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.entra.entra_client import entra_client
from prowler.providers.m365.services.entra.entra_service import (
    ConditionalAccessGrantControl,
    ConditionalAccessPolicyState,
    GrantControlOperator,
    UserAction,
)


class entra_managed_device_required_for_mfa_registration(Check):
    """Check if Conditional Access policies enforce MFA registration on a managed device.

    This check ensures that Conditional Access policies are in place to enforce MFA registration on a managed device.
    """

    def execute(self) -> list[CheckReportM365]:
        """Execute the check to ensure that Conditional Access policies enforce MFA registration on a managed device.

        Returns:
            list[CheckReportM365]: A list containing the results of the check.
        """
        findings = []

        report = CheckReportM365(
            metadata=self.metadata(),
            resource={},
            resource_name="Conditional Access Policies",
            resource_id="conditionalAccessPolicies",
        )
        report.status = "FAIL"
        report.status_extended = "No Conditional Access Policy requires a managed device for MFA registration."

        for policy in entra_client.conditional_access_policies.values():
            if policy.state == ConditionalAccessPolicyState.DISABLED:
                continue

            if "All" not in policy.conditions.user_conditions.included_users:
                continue

            if (
                UserAction.REGISTER_SECURITY_INFO
                not in policy.conditions.application_conditions.included_user_actions
            ):
                continue

            if (
                ConditionalAccessGrantControl.DOMAIN_JOINED_DEVICE
                not in policy.grant_controls.built_in_controls
                or ConditionalAccessGrantControl.MFA
                not in policy.grant_controls.built_in_controls
            ):
                continue

            if policy.grant_controls.operator == GrantControlOperator.OR:
                report = CheckReportM365(
                    metadata=self.metadata(),
                    resource=policy,
                    resource_name=policy.display_name,
                    resource_id=policy.id,
                )
                if policy.state == ConditionalAccessPolicyState.ENABLED_FOR_REPORTING:
                    report.status = "FAIL"
                    report.status_extended = f"Conditional Access Policy '{policy.display_name}' reports the requirement of a managed device for MFA registration but does not enforce it."
                else:
                    report.status = "PASS"
                    report.status_extended = f"Conditional Access Policy '{policy.display_name}' does require a managed device for MFA registration."
                    break

        findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_password_hash_sync_enabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_password_hash_sync_enabled/entra_password_hash_sync_enabled.metadata.json
Signals: Next.js

```json
{
  "Provider": "m365",
  "CheckID": "entra_password_hash_sync_enabled",
  "CheckTitle": "Ensure that password hash sync is enabled for hybrid deployments.",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Organization Settings",
  "Description": "Ensure that password hash synchronization is enabled in hybrid Microsoft Entra deployments to facilitate seamless authentication and leaked credential protection.",
  "Risk": "If password hash synchronization is not enabled, users may need to maintain multiple passwords, increasing security risks. Additionally, leaked credential detection for hybrid accounts would not be available, reducing the organization's ability to prevent account compromises.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/whatis-phs",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. Log in to the on-premises server hosting Microsoft Entra Connect. 2. Open Azure AD Connect and click Configure. 3. Select 'Customize synchronization options' and click Next. 4. Provide admin credentials. 5. On the Optional features screen, check 'Password hash synchronization' and click Next. 6. Click Configure and wait for the process to complete.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable password hash synchronization in Microsoft Entra Connect to streamline authentication and enhance security monitoring.",
      "Url": "https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/whatis-phs"
    }
  },
  "Categories": [
    "e3"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Applies only to hybrid Microsoft Entra deployments using Entra Connect sync and does not apply to federated domains."
}
```

--------------------------------------------------------------------------------

---[FILE: entra_password_hash_sync_enabled.py]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_password_hash_sync_enabled/entra_password_hash_sync_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.entra.entra_client import entra_client


class entra_password_hash_sync_enabled(Check):
    """
    Check if password hash synchronization is enabled for hybrid Microsoft Entra deployments.

    This check verifies that password hash synchronization is enabled in hybrid Microsoft Entra deployments.
    Enabling password hash sync ensures that on-premises passwords are synchronized to Microsoft Entra,
    facilitating seamless authentication and enhancing leaked credential protection. Without password hash
    synchronization, users might have to manage multiple passwords and detection of leaked credentials would be compromised.

    Note: This control applies only to hybrid deployments using Microsoft Entra Connect sync and does not apply to federated domains.
    """

    def execute(self) -> List[CheckReportM365]:
        """
        Execute the password hash synchronization requirement check.

        Retrieves the organization settings from the Entra client and generates a report indicating whether
        password hash synchronization is enabled.

        Returns:
            List[CheckReportM365]: A list containing the report object with the result of the check.
        """
        findings = []
        for organization in entra_client.organizations:
            report = CheckReportM365(
                self.metadata(),
                resource=organization,
                resource_id=organization.id,
                resource_name=organization.name,
            )
            report.status = "FAIL"
            report.status_extended = "Password hash synchronization is not enabled for hybrid Microsoft Entra deployments."

            if organization.on_premises_sync_enabled:
                report.status = "PASS"
                report.status_extended = "Password hash synchronization is enabled for hybrid Microsoft Entra deployments."

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_policy_ensure_default_user_cannot_create_tenants.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_policy_ensure_default_user_cannot_create_tenants/entra_policy_ensure_default_user_cannot_create_tenants.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "entra_policy_ensure_default_user_cannot_create_tenants",
  "CheckTitle": "Ensure that 'Restrict non-admin users from creating tenants' is set to 'Yes'",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Authorization Policy",
  "Description": "Require administrators or appropriately delegated users to create new tenants.",
  "Risk": "It is recommended to only allow an administrator to create new tenants. This prevent users from creating new Azure AD or Azure AD B2C tenants and ensures that only authorized users are able to do so.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/fundamentals/users-default-permissions",
  "Remediation": {
    "Code": {
      "CLI": "Update-MgPolicyAuthorizationPolicy -DefaultUserRolePermissions @{ AllowedToCreateTenants = $false }",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft Entra admin center https://entra.microsoft.com 2. Click to expand Identity > Users > User settings 3. Set 'Restrict non-admin users from creating tenants' to 'Yes' then 'Save'",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enforcing this setting will ensure that only authorized users are able to create new tenants.",
      "Url": "https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/permissions-reference#tenant-creator"
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
