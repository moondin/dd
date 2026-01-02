---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 387
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 387 of 867)

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

---[FILE: entra_admin_consent_workflow_enabled.py]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_admin_consent_workflow_enabled/entra_admin_consent_workflow_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.entra.entra_client import entra_client


class entra_admin_consent_workflow_enabled(Check):
    """
    Ensure the admin consent workflow is enabled in Microsoft Entra.

    This check verifies that the admin consent workflow is enabled in Microsoft Entra to allow users
    to request admin approval for applications requiring consent. Enabling the admin consent workflow
    ensures that applications which require additional permissions are only granted access after an
    administrator’s approval, reducing the risk of unauthorized access and work disruptions.

    The check fails if the admin consent workflow is not enabled, indicating that users might be blocked
    from accessing critical applications or forced to use insecure workarounds.
    """

    def execute(self) -> List[CheckReportM365]:
        """
        Execute the admin consent workflow requirement check.

        Retrieves the admin consent policy from the Microsoft Entra client and generates a report indicating
        whether the admin consent workflow is enabled.

        Returns:
            List[CheckReportM365]: A list containing the report with the result of the check.
        """
        findings = []
        admin_consent_policy = entra_client.admin_consent_policy
        if admin_consent_policy:
            report = CheckReportM365(
                self.metadata(),
                resource=admin_consent_policy,
                resource_name="Admin Consent Policy",
                resource_id=entra_client.tenant_domain,
            )
            report.status = "FAIL"
            report.status_extended = "The admin consent workflow is not enabled in Microsoft Entra; users may be blocked from accessing applications that require admin consent."
            if admin_consent_policy.admin_consent_enabled:
                report.status = "PASS"
                report.status_extended = "The admin consent workflow is enabled in Microsoft Entra, allowing users to request admin approval for applications."
                if admin_consent_policy.notify_reviewers:
                    report.status_extended += " Reviewers will be notified."
                else:
                    report.status_extended += (
                        " Reviewers will not be notified, we recommend notifying them."
                    )

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_admin_portals_access_restriction.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_admin_portals_access_restriction/entra_admin_portals_access_restriction.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "entra_admin_portals_access_restriction",
  "CheckTitle": "Ensure that only administrative roles have access to Microsoft Admin Portals",
  "CheckAliases": [
    "entra_admin_portals_role_limited_access"
  ],
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Conditional Access Policy",
  "Description": "Ensure that only administrative roles have access to Microsoft Admin Portals to prevent unauthorized changes, privilege escalation, and security misconfigurations.",
  "Risk": "Allowing non-administrative users to access Microsoft Admin Portals increases the risk of unauthorized changes, privilege escalation, and potential security misconfigurations. Attackers could exploit these privileges to manipulate settings, disable security features, or access sensitive data.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/microsoft-365/admin/add-users/about-admin-roles?view=o365-worldwide",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. Navigate to the Microsoft Entra admin center https://entra.microsoft.com. 2. Click expand Protection > Conditional Access select Policies. 3. Click New Policy. Under Users include All Users. Under Users select Exclude and check Directory roles and select only administrative roles and a group of PIM eligible users. Under Target resources select Cloud apps and Select apps then select the Microsoft Admin Portals app. Confirm by clicking Select. Under Grant select Block access and click Select. 4. Under Enable policy set it to Report Only until the organization is ready to enable it. 5. Click Create.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enforce Conditional Access policies to restrict Microsoft Admin Portals to predefined administrative roles. Ensure that only necessary users have access to these portals, applying the principle of least privilege and conducting periodic access reviews to maintain security compliance.",
      "Url": "https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview"
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

---[FILE: entra_admin_portals_access_restriction.py]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_admin_portals_access_restriction/entra_admin_portals_access_restriction.py

```python
from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.entra.entra_client import entra_client
from prowler.providers.m365.services.entra.entra_service import (
    AdminRoles,
    ConditionalAccessGrantControl,
    ConditionalAccessPolicyState,
)


class entra_admin_portals_access_restriction(Check):
    """Check if Conditional Access policies deny access to the Microsoft 365 admin center for users with limited access roles.

    This check ensures that Conditional Access policies are in place to deny access to the Microsoft 365 admin center for users with limited access roles.
    """

    def execute(self) -> list[CheckReportM365]:
        """Execute the check to ensure that Conditional Access policies deny access to the Microsoft 365 admin center for users with limited access roles.

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
        report.status_extended = "No Conditional Access Policy limits Entra Admin Center access to administrative roles."

        for policy in entra_client.conditional_access_policies.values():
            if policy.state == ConditionalAccessPolicyState.DISABLED:
                continue

            if not (
                {
                    role for role in policy.conditions.user_conditions.excluded_roles
                }.issubset({admin_role.value for admin_role in AdminRoles})
                and "All" in policy.conditions.user_conditions.included_users
            ):
                continue

            if (
                "MicrosoftAdminPortals"
                not in policy.conditions.application_conditions.included_applications
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
                    report.status_extended = f"Conditional Access Policy '{policy.display_name}' reports Entra Admin Center access to administrative roles but does not limit it."
                else:
                    report.status = "PASS"
                    report.status_extended = f"Conditional Access Policy '{policy.display_name}' limits Entra Admin Center access to administrative roles."
                    break

        findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_admin_users_cloud_only.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_admin_users_cloud_only/entra_admin_users_cloud_only.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "entra_admin_users_cloud_only",
  "CheckTitle": "Ensure all Microsoft 365 administrative users are cloud-only",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Administrative User",
  "Description": "This check verifies that all Microsoft 365 administrative users are cloud-only, not synchronized from an on-premises directory, by querying administrative users and checking their synchronization status.",
  "Risk": "On-premises synchronized administrative users increase the attack surface and compromise the security posture of the cloud environment.  Compromise of on-premises systems could lead to unauthorized access to Microsoft 365 administrative functionalities.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/best-practices#9-use-cloud-native-accounts-for-microsoft-entra-roles",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. Identify on-premises synchronized administrative users using Microsoft Entra Connect or equivalent tools. 2.  Create new cloud-only administrative user with appropriate permissions. 3. Migrate administrative tasks from on-premises synchronized users to the new cloud-only user. 4. Disable or remove the on-premises synchronized administrative users.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure all Microsoft 365 administrative users are cloud-only to reduce the attack surface and improve security posture.",
      "Url": "https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/best-practices#9-use-cloud-native-accounts-for-microsoft-entra-roles"
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

---[FILE: entra_admin_users_cloud_only.py]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_admin_users_cloud_only/entra_admin_users_cloud_only.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.entra.entra_client import entra_client
from prowler.providers.m365.services.entra.entra_service import AdminRoles


class entra_admin_users_cloud_only(Check):
    """
    Check to ensure that there are no admin accounts with non-cloud-only accounts in Microsoft 365.
    This check verifies if any user with admin roles has an on-premises synchronized account.
    If such users are found, the check will fail.
    """

    def execute(self) -> List[CheckReportM365]:
        """
        Execute the check to identify admin accounts with non-cloud-only accounts.
        Returns:
            List[CheckReportM365]: A list containing the check report with the status and details.
        """
        findings = []
        if entra_client.users:
            non_cloud_admins = []
            for user_id, user in entra_client.users.items():
                for role in user.directory_roles_ids:
                    if (
                        role in {admin_role.value for admin_role in AdminRoles}
                        and user.on_premises_sync_enabled
                    ):
                        non_cloud_admins.append(user_id)

            report = CheckReportM365(
                metadata=self.metadata(),
                resource={},
                resource_name="Cloud-only account",
                resource_id="cloudOnlyAccount",
            )
            report.status = "PASS"
            report.status_extended = (
                "All the users with administrative roles are cloud-only accounts."
            )

            if non_cloud_admins:
                report.status = "FAIL"
                ids_str = ", ".join(non_cloud_admins)
                report.status_extended = f"There are some users with administrative roles that are not cloud-only accounts: {ids_str}"

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_admin_users_mfa_enabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_admin_users_mfa_enabled/entra_admin_users_mfa_enabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "entra_admin_users_mfa_enabled",
  "CheckTitle": "Ensure multifactor authentication is enabled for all users in administrative roles.",
  "CheckAliases": [
    "entra_admin_mfa_enabled_for_administrative_roles"
  ],
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Conditional Access Policy",
  "Description": "Ensure that multifactor authentication (MFA) is enabled for all users in administrative roles to enhance security and reduce the risk of unauthorized access.",
  "Risk": "Without MFA enabled for administrative roles, attackers could compromise privileged accounts with only a single authentication factor, increasing the risk of data breaches and unauthorized access to sensitive resources.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/identity/conditional-access/howto-conditional-access-policy-admin-mfa",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft Entra admin center https://entra.microsoft.com. 2. Expand Protection > Conditional Access and select Policies. 3. Click 'New policy' and configure: Users: Select users and groups > Directory roles (include admin roles). Target resources: Include 'All cloud apps' with no exclusions. Grant: Select 'Grant Access' and check 'Require multifactor authentication'. 4. Set policy to 'Report Only' for testing before full enforcement. 5. Click 'Create'.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable MFA for all users in administrative roles using a Conditional Access policy in Microsoft Entra.",
      "Url": "https://learn.microsoft.com/en-us/entra/identity/conditional-access/howto-conditional-access-policy-admin-mfa"
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

---[FILE: entra_admin_users_mfa_enabled.py]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_admin_users_mfa_enabled/entra_admin_users_mfa_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.entra.entra_client import entra_client
from prowler.providers.m365.services.entra.entra_service import (
    AdminRoles,
    ConditionalAccessGrantControl,
    ConditionalAccessPolicyState,
)


class entra_admin_users_mfa_enabled(Check):
    """
    Ensure multifactor authentication is enabled for all users in administrative roles.

    This check verifies that at least one Conditional Access Policy in Microsoft Entra, which is in an enabled state,
    applies to administrative roles and enforces multifactor authentication (MFA). Enforcing MFA for privileged accounts
    is critical to reduce the risk of unauthorized access through compromised credentials.

    The check fails if no enabled policy is found that requires MFA for any administrative role.
    """

    def execute(self) -> List[CheckReportM365]:
        """
        Execute the admin MFA requirement check for administrative roles.

        Iterates over the Conditional Access Policies retrieved from the Entra client and generates a report
        indicating whether MFA is enforced for users in administrative roles.

        Returns:
            List[CheckReportM365]: A list containing a single report with the result of the check.
        """
        findings = []

        report = CheckReportM365(
            metadata=self.metadata(),
            resource={},
            resource_name="Conditional Access Policies",
            resource_id="conditionalAccessPolicies",
        )

        report.status = "FAIL"
        report.status_extended = "No Conditional Access Policy requiring MFA for administrative roles was found."

        for policy in entra_client.conditional_access_policies.values():
            if policy.state == ConditionalAccessPolicyState.DISABLED:
                continue

            if not ({admin_role.value for admin_role in AdminRoles}).issubset(
                set(policy.conditions.user_conditions.included_roles)
            ):
                if "All" not in policy.conditions.user_conditions.included_users:
                    continue

            if (
                "All"
                not in policy.conditions.application_conditions.included_applications
            ):
                continue

            if (
                ConditionalAccessGrantControl.MFA
                in policy.grant_controls.built_in_controls
            ):
                report = CheckReportM365(
                    metadata=self.metadata(),
                    resource=entra_client.conditional_access_policies,
                    resource_name=policy.display_name,
                    resource_id=policy.id,
                )
                if policy.state == ConditionalAccessPolicyState.ENABLED_FOR_REPORTING:
                    report.status = "FAIL"
                    report.status_extended = f"Conditional Access Policy '{policy.display_name}' only reports MFA for administrative roles but does not enforce it."
                else:
                    report.status = "PASS"
                    report.status_extended = f"Conditional Access Policy '{policy.display_name}' enforces MFA for administrative roles."
                    break

        findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_admin_users_phishing_resistant_mfa_enabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_admin_users_phishing_resistant_mfa_enabled/entra_admin_users_phishing_resistant_mfa_enabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "entra_admin_users_phishing_resistant_mfa_enabled",
  "CheckTitle": "Ensure phishing-resistant MFA strength is required for all administrator accounts",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Conditional Access Policy",
  "Description": "This check verifies that phishing-resistant MFA strength is required for all administrator accounts. Phishing-resistant MFA includes authentication methods that are resistant to phishing attacks and MFA fatigue attacks compared to weaker methods like SMS or push notifications.",
  "Risk": "Administrators using weaker MFA methods, such as SMS or push notifications, are vulnerable to phishing attacks and MFA fatigue attacks. Attackers can intercept codes or trick users into approving fraudulent authentication requests, leading to unauthorized access to critical systems.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-admin-phish-resistant-mfa",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. Navigate to the Microsoft Entra admin center https://entra.microsoft.com. 2. Click expand Protection > Conditional Access select Policies. 3. Click New policy. Under Users include Select users and groups and check Directory roles. At a minimum, include the directory roles listed below in this section of the document. Under Target resources include All cloud apps and do not create any exclusions. Under Grant select Grant Access and check Require authentication strength and set Phishing-resistant MFA in the dropdown box. Click Select. 4. Under Enable policy set it to Report Only until the organization is ready to enable it. 5. Click Create.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Require phishing-resistant MFA strength for all administrator accounts through Conditional Access policies. Enforce the use of FIDO2 security keys, Windows Hello for Business, or certificate-based authentication. Ensure administrators are pre-registered for these methods before enforcement to prevent lockouts. Maintain a break-glass account exempt from this policy for emergency access.",
      "Url": "https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-admin-phish-resistant-mfa#create-a-conditional-access-policy"
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

---[FILE: entra_admin_users_phishing_resistant_mfa_enabled.py]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_admin_users_phishing_resistant_mfa_enabled/entra_admin_users_phishing_resistant_mfa_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.entra.entra_client import entra_client
from prowler.providers.m365.services.entra.entra_service import (
    AdminRoles,
    ConditionalAccessPolicyState,
)


class entra_admin_users_phishing_resistant_mfa_enabled(Check):
    """Check if Conditional Access policies require Phishing-resistant MFA strength for admin users."""

    def execute(self) -> list[CheckReportM365]:
        """Execute the check to ensure that Conditional Access policies require Phishing-resistant MFA strength for admin users.

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
        report.status_extended = "No Conditional Access Policy requires Phishing-resistant MFA strength for admin users."

        for policy in entra_client.conditional_access_policies.values():
            if policy.state == ConditionalAccessPolicyState.DISABLED:
                continue

            if not (
                {role.value for role in AdminRoles}.issuperset(
                    policy.conditions.user_conditions.included_roles
                )
            ):
                continue

            if (
                "All"
                not in policy.conditions.application_conditions.included_applications
                or policy.conditions.application_conditions.excluded_applications != []
            ):
                continue

            if (
                policy.grant_controls.authentication_strength is not None
                and policy.grant_controls.authentication_strength
                != "Multifactor authentication"
                and policy.grant_controls.authentication_strength != "Passwordless MFA"
                and policy.grant_controls.authentication_strength
                != "Phishing-resistant MFA"
            ):
                report = CheckReportM365(
                    metadata=self.metadata(),
                    resource=policy,
                    resource_name=policy.display_name,
                    resource_id=policy.id,
                )
                report.status = "MANUAL"
                report.status_extended = f"Conditional Access Policy '{policy.display_name}' has a custom authentication strength, review it is Phishing-resistant MFA."
                continue

            if (
                policy.grant_controls.authentication_strength is not None
                and policy.grant_controls.authentication_strength
                == "Phishing-resistant MFA"
            ):
                report = CheckReportM365(
                    metadata=self.metadata(),
                    resource=policy,
                    resource_name=policy.display_name,
                    resource_id=policy.id,
                )
                if policy.state == ConditionalAccessPolicyState.ENABLED_FOR_REPORTING:
                    report.status = "FAIL"
                    report.status_extended = f"Conditional Access Policy '{policy.display_name}' reports Phishing-resistant MFA strength for admin users but does not require it."
                else:
                    report.status = "PASS"
                    report.status_extended = f"Conditional Access Policy '{policy.display_name}' requires Phishing-resistant MFA strength for admin users."
                    break

        findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_admin_users_sign_in_frequency_enabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_admin_users_sign_in_frequency_enabled/entra_admin_users_sign_in_frequency_enabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "entra_admin_users_sign_in_frequency_enabled",
  "CheckTitle": "Ensure Sign-in frequency periodic reauthentication is enabled and properly configured.",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Conditional Access Policy",
  "Description": "Ensure Sign-in frequency periodic reauthentication is enabled and properly configured to reduce the risk of unauthorized access and session hijacking.",
  "Risk": "Allowing persistent browser sessions and long sign-in frequencies for administrative users increases the risk of unauthorized access. Attackers could exploit session persistence to maintain access to an admin account without reauthentication, increasing the likelihood of account compromise, especially in cases of credential theft or session hijacking.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-conditional-access-session#sign-in-frequency",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft Entra admin center https://entra.microsoft.com/. 2. Click to expand Protection > Conditional Access Select Policies. 3. Click New policy. Under Users include, select users and groups and check Directory roles. At a minimum, include the directory roles listed below in this section of the document. Under Target resources, include All cloud apps and do not create any exclusions. Under Grant, select Grant Access and check Require multifactor authentication. Under Session, select Sign-in frequency, select Periodic reauthentication, and set it to 4 hours for E3 tenants. E5 tenants with PIM can be set to a maximum value of 24 hours. Check Persistent browser session, then select Never persistent in the drop-down menu. 4. Under Enable policy, set it to Report Only until the organization is ready to enable it.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enforce a sign-in frequency limit of no more than 4 hours for E3 tenants (or 24 hours for E5 with Privileged Identity Management) and set browser sessions to Never persistent. This ensures that administrative users are regularly reauthenticated, reducing the risk of prolonged unauthorized access and mitigating session hijacking threats.",
      "Url": "https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-session-lifetime#user-sign-in-frequency"
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

---[FILE: entra_admin_users_sign_in_frequency_enabled.py]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_admin_users_sign_in_frequency_enabled/entra_admin_users_sign_in_frequency_enabled.py

```python
from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.entra.entra_client import entra_client
from prowler.providers.m365.services.entra.entra_service import (
    AdminRoles,
    ConditionalAccessPolicyState,
    SignInFrequencyInterval,
    SignInFrequencyType,
)


class entra_admin_users_sign_in_frequency_enabled(Check):
    """Check if Conditional Access policies enforce sign-in frequency for admin users."""

    def execute(self) -> list[CheckReportM365]:
        """Validate sign-in frequency enforcement for admin users."""
        findings = []
        report = CheckReportM365(
            metadata=self.metadata(),
            resource={},
            resource_name="Conditional Access Policies",
            resource_id="conditionalAccessPolicies",
        )
        report.status = "FAIL"
        report.status_extended = (
            "No Conditional Access Policy enforces sign-in frequency for admin users."
        )
        recommended_frequency = entra_client.audit_config.get("sign_in_frequency", 4)

        for policy in entra_client.conditional_access_policies.values():
            if (
                policy.state == ConditionalAccessPolicyState.DISABLED
                or not {role.value for role in AdminRoles}.issuperset(
                    policy.conditions.user_conditions.included_roles
                )
                or "All"
                not in policy.conditions.application_conditions.included_applications
                or not policy.session_controls.sign_in_frequency.is_enabled
                or not policy.session_controls.persistent_browser.is_enabled
                or policy.session_controls.persistent_browser.mode != "never"
            ):
                continue

            report = CheckReportM365(
                metadata=self.metadata(),
                resource=policy,
                resource_name=policy.display_name,
                resource_id=policy.id,
            )

            if (
                policy.session_controls.sign_in_frequency.interval
                == SignInFrequencyInterval.EVERY_TIME
            ):
                if policy.state == ConditionalAccessPolicyState.ENABLED_FOR_REPORTING:
                    report.status = "FAIL"
                    report.status_extended = f"Conditional Access Policy '{policy.display_name}' only reports when sign-in frequency is 'Every Time' for admin users but does not enforce it."
                else:
                    report.status = "PASS"
                    report.status_extended = f"Conditional Access Policy '{policy.display_name}' enforces sign-in frequency 'Every Time' for admin users."
                    break
            elif (
                policy.session_controls.sign_in_frequency.interval
                == SignInFrequencyInterval.TIME_BASED
            ):
                frequency_hours = (
                    policy.session_controls.sign_in_frequency.frequency
                    if policy.session_controls.sign_in_frequency.type
                    == SignInFrequencyType.HOURS
                    else policy.session_controls.sign_in_frequency.frequency * 24
                )
                if frequency_hours > recommended_frequency:
                    report.status = "FAIL"
                    report.status_extended = f"Conditional Access Policy '{policy.display_name}' enforces sign-in frequency at {frequency_hours} hours for admin users, exceeding the recommended {recommended_frequency} hours."
                else:
                    if (
                        policy.state
                        == ConditionalAccessPolicyState.ENABLED_FOR_REPORTING
                    ):
                        report.status = "FAIL"
                        report.status_extended = f"Conditional Access Policy '{policy.display_name}' only reports when sign-in frequency is {frequency_hours} hours for admin users but does not enforce it."
                    else:
                        report.status = "PASS"
                        report.status_extended = f"Conditional Access Policy '{policy.display_name}' enforces sign-in frequency at {frequency_hours} hours for admin users."
                        break

        findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_dynamic_group_for_guests_created.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_dynamic_group_for_guests_created/entra_dynamic_group_for_guests_created.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "entra_dynamic_group_for_guests_created",
  "CheckTitle": "Ensure a dynamic group for guest users is created.",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Group Settings",
  "Description": "Ensure that a dynamic group is created for guest users in Microsoft Entra to enforce conditional access policies and security controls automatically.",
  "Risk": "Without a dynamic group for guest users, administrators may need to manually manage access controls, leading to potential security gaps and inconsistent policy enforcement.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/identity/users/groups-create-rule",
  "Remediation": {
    "Code": {
      "CLI": "New-MgGroup -DisplayName 'Dynamic Guest Users' -MailNickname 'DynGuestUsers' -MailEnabled $false -SecurityEnabled $true -GroupTypes 'DynamicMembership' -MembershipRule '(user.userType -eq \"Guest\")' -MembershipRuleProcessingState 'On'",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft Entra admin center https://entra.microsoft.com/. 2. Click to expand Identity > Groups and select All groups. 3. Select 'New group' and configure: Group type: Security, Membership type: Dynamic User. 4. Add dynamic query with rule: (user.userType -eq 'Guest'). 5. Click Save.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Create a dynamic group for guest users to automate policy enforcement and access control.",
      "Url": "https://learn.microsoft.com/en-us/entra/identity/users/groups-create-rule"
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

---[FILE: entra_dynamic_group_for_guests_created.py]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_dynamic_group_for_guests_created/entra_dynamic_group_for_guests_created.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.entra.entra_client import entra_client


class entra_dynamic_group_for_guests_created(Check):
    """
    Check if a dynamic group for guest users is created in Microsoft Entra.

    This check verifies that a dynamic group exists for guest users in Microsoft Entra.
    A dynamic group for guest users should have the group type 'DynamicMembership' and a membership rule
    that restricts membership to users with a userType equal to 'Guest'. This configuration enables
    automated enforcement of conditional access policies and reduces manual management of guest access.
    """

    def execute(self) -> List[CheckReportM365]:
        """
        Execute the dynamic group for guest users check.

        Iterates over the groups retrieved from the Microsoft Entra client and generates a report
        indicating whether at least one dynamic group exists with a membership rule targeting guest users.

        Returns:
            List[CheckReportM365]: A list containing a single report with the result of the check.
        """
        findings = []
        if entra_client.groups:
            dynamic_group = None
            for group in entra_client.groups:
                if "DynamicMembership" in group.groupTypes and group.membershipRule:
                    if 'user.userType -eq "Guest"' in group.membershipRule:
                        dynamic_group = group
                        break

            report = CheckReportM365(
                self.metadata(),
                resource=dynamic_group if dynamic_group else {},
                resource_name=dynamic_group.name if dynamic_group else "Group",
                resource_id=dynamic_group.id if dynamic_group else "group",
            )
            report.status = "FAIL"
            report.status_extended = (
                "No dynamic group for guest users was found in Microsoft Entra."
            )

            if dynamic_group:
                report.status = "PASS"
                report.status_extended = (
                    "A dynamic group for guest users is created in Microsoft Entra."
                )

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_identity_protection_sign_in_risk_enabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_identity_protection_sign_in_risk_enabled/entra_identity_protection_sign_in_risk_enabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "entra_identity_protection_sign_in_risk_enabled",
  "CheckTitle": "Ensure that Identity Protection sign-in risk policies are enabled",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Conditional Access Policy",
  "Description": "Ensure that Identity Protection sign-in risk policies are enabled to detect and respond to suspicious high and medium risk login attempts in real time.",
  "Risk": "Without Identity Protection sign-in risk policies enabled, suspicious sign-in attempts may go unnoticed, allowing attackers to access accounts using stolen or compromised credentials. This increases the risk of unauthorized access, data breaches, and privilege escalation.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. Navigate to the Microsoft Entra admin center https://entra.microsoft.com. 2. Click expand Protection > Conditional Access select Policies. 3. Create a new policy by selecting New policy. 4. Set the following conditions within the policy. Under Users or workload identities choose All users. Under Cloud apps or actions choose All cloud apps. Under Conditions choose Sign-in risk then Yes and check the risk level boxes High and Medium. Under Access Controls select Grant then in the right pane click Grant access then select Require multifactor authentication. Under Session select Sign-in Frequency and set to Every time. Click Select. 5. Under Enable policy set it to Report Only until the organization is ready to enable it. 6. Click Create.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable Identity Protection sign-in risk policies to detect and respond to suspicious login attempts in real time. Configure Conditional Access to require MFA for risky sign-ins and ensure all users are enrolled in MFA to prevent account lockouts. Regularly review sign-in risk reports to identify and mitigate potential security threats.",
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

````
