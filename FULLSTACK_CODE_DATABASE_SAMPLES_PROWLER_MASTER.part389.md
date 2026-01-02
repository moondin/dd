---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 389
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 389 of 867)

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

---[FILE: entra_policy_ensure_default_user_cannot_create_tenants.py]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_policy_ensure_default_user_cannot_create_tenants/entra_policy_ensure_default_user_cannot_create_tenants.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.entra.entra_client import entra_client


class entra_policy_ensure_default_user_cannot_create_tenants(Check):
    """Check if default users are restricted from creating tenants.

    This check verifies whether the authorization policy prevents non-admin users
    from creating new tenants in Microsoft Entra ID.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """Execute the check for tenant creation restrictions.

        This method examines the authorization policy settings to determine if
        non-admin users are allowed to create new tenants. If tenant creation is
        restricted, the check passes.

        Returns:
            List[Check_Report_M365]: A list containing the result of the check.
        """
        findings = []
        auth_policy = entra_client.authorization_policy

        report = CheckReportM365(
            metadata=self.metadata(),
            resource=auth_policy if auth_policy else {},
            resource_name=auth_policy.name if auth_policy else "Authorization Policy",
            resource_id=auth_policy.id if auth_policy else "authorizationPolicy",
        )
        report.status = "FAIL"
        report.status_extended = "Tenant creation is not disabled for non-admin users."

        if getattr(
            entra_client.authorization_policy, "default_user_role_permissions", None
        ) and not getattr(
            entra_client.authorization_policy.default_user_role_permissions,
            "allowed_to_create_tenants",
            True,
        ):
            report.status = "PASS"
            report.status_extended = "Tenant creation is disabled for non-admin users."

        findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_policy_guest_invite_only_for_admin_roles.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_policy_guest_invite_only_for_admin_roles/entra_policy_guest_invite_only_for_admin_roles.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "entra_policy_guest_invite_only_for_admin_roles",
  "CheckTitle": "Ensure that 'Guest invite restrictions' is set to 'Only users assigned to specific admin roles can invite guest users'",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Authorization Policy",
  "Description": "Restrict invitations to users with specific administrative roles only.",
  "Risk": "Restricting invitations to users with specific administrator roles ensures that only authorized accounts have access to cloud resources. This helps to maintain 'Need to Know' permissions and prevents inadvertent access to data. By default the setting Guest invite restrictions is set to Anyone in the organization can invite guest users including guests and non-admins. This would allow anyone within the organization to invite guests and non-admins to the tenant, posing a security risk.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/external-id/external-collaboration-settings-configure",
  "Remediation": {
    "Code": {
      "CLI": "Update-MgPolicyAuthorizationPolicy -AllowInvitesFrom 'adminsAndGuestInviters'",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft Entra admin center https://entra.microsoft.com/. 2. Expand Identity > External Identities and select External collaboration settings. 3. Under Guest invite settings, set 'Guest invite restrictions' to 'Only users assigned to specific admin roles can invite guest users'. 4. Click Save.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict guest user invitations to only designated administrators or the Guest Inviter role to enhance security.",
      "Url": "https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/permissions-reference#guest-inviter"
    }
  },
  "Categories": [
    "e3"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "A more restrictive setting is acceptable, but the minimum requirement is limiting invitations to admins and Guest Inviters."
}
```

--------------------------------------------------------------------------------

---[FILE: entra_policy_guest_invite_only_for_admin_roles.py]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_policy_guest_invite_only_for_admin_roles/entra_policy_guest_invite_only_for_admin_roles.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.entra.entra_client import entra_client
from prowler.providers.m365.services.entra.entra_service import InvitationsFrom


class entra_policy_guest_invite_only_for_admin_roles(Check):
    """Check if guest invitations are restricted to users with specific administrative roles.

    This check verifies the `guest_invite_settings` property of the authorization policy.
    If the setting is set to either "adminsAndGuestInviters" or "none", guest invitations
    are limited accordingly. Otherwise, they are not restricted.
    """

    def execute(self) -> List[CheckReportM365]:
        """
        Execute the guest invitation restriction check.

        Retrieves the authorization policy from the Microsoft Entra client and checks
        whether the 'guest_invite_settings' is set to restrict invitations to users with
        specific administrative roles only.

        Returns:
            List[CheckReportM365]: A list containing a single check report that
            details the pass/fail status and description.
        """
        findings = []
        auth_policy = entra_client.authorization_policy

        report = CheckReportM365(
            metadata=self.metadata(),
            resource=auth_policy if auth_policy else {},
            resource_name=auth_policy.name if auth_policy else "Authorization Policy",
            resource_id=auth_policy.id if auth_policy else "authorizationPolicy",
        )
        report.status = "FAIL"
        report.status_extended = "Guest invitations are not restricted to users with specific administrative roles only."

        if (
            getattr(auth_policy, "guest_invite_settings", None)
            == InvitationsFrom.ADMINS_AND_GUEST_INVITERS.value
        ) or (
            getattr(auth_policy, "guest_invite_settings", None)
            == InvitationsFrom.NONE.value
        ):
            report.status = "PASS"
            report.status_extended = "Guest invitations are restricted to users with specific administrative roles only."

        findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_policy_guest_users_access_restrictions.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_policy_guest_users_access_restrictions/entra_policy_guest_users_access_restrictions.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "entra_policy_guest_users_access_restrictions",
  "CheckTitle": "Ensure That 'Guest users access restrictions' is set to 'Guest user access is restricted to properties and memberships of their own directory objects'",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Authorization Policy",
  "Description": "Limit guest user permissions.",
  "Risk": "Limiting guest access ensures that guest accounts do not have permission for certain directory tasks, such as enumerating users, groups or other directory resources, and cannot be assigned to administrative roles in your directory. Guest access has three levels of restriction. 1. Guest users have the same access as members (most inclusive), 2. Guest users have limited access to properties and memberships of directory objects (default value), 3. Guest user access is restricted to properties and memberships of their own directory objects (most restrictive). The recommended option is the 3rd, most restrictive: 'Guest user access is restricted to their own directory object'.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/identity/users/users-restrict-guest-permissions",
  "Remediation": {
    "Code": {
      "CLI": "Update-MgPolicyAuthorizationPolicy -GuestUserRoleId <GUEST_ROLE_ID>",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft Entra admin center https://entra.microsoft.com/. 2. Expand Identity > External Identities and select External collaboration settings. 3. Under Guest user access, set 'Guest user access restrictions' to either 'Guest users have limited access to properties and memberships of directory objects' or 'Guest user access is restricted to properties and memberships of their own directory objects (most restrictive)'.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict guest user access in Microsoft Entra to limit the exposure of directory objects and reduce security risks.",
      "Url": "https://learn.microsoft.com/en-us/entra/fundamentals/users-default-permissions#member-and-guest-users"
    }
  },
  "Categories": [
    "e3"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Either of the two restrictive settings ensures compliance. The most restrictive setting prevents guests from viewing other directory objects entirely."
}
```

--------------------------------------------------------------------------------

---[FILE: entra_policy_guest_users_access_restrictions.py]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_policy_guest_users_access_restrictions/entra_policy_guest_users_access_restrictions.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.entra.entra_client import entra_client
from prowler.providers.m365.services.entra.entra_service import AuthPolicyRoles


class entra_policy_guest_users_access_restrictions(Check):
    """Check if guest user access is restricted to their own directory objects.

    This check verifies whether the authorization policy is configured so that guest users
    are limited to accessing only the properties and memberships of their own directory objects.
    """

    def execute(self) -> List[CheckReportM365]:
        """
        Execute the guest user access restriction check.

        This method retrieves the authorization policy from the M365 Entra client,
        and then checks if the 'guest_user_role_id' matches the predefined restricted role ID.
        If it matches, the check passes; otherwise, it fails.

        Returns:
            List[CheckReportM365]: A list containing a single check report detailing
            the status and details of the guest user access restriction.
        """
        findings = []
        auth_policy = entra_client.authorization_policy

        report = CheckReportM365(
            metadata=self.metadata(),
            resource=auth_policy if auth_policy else {},
            resource_name=auth_policy.name if auth_policy else "Authorization Policy",
            resource_id=auth_policy.id if auth_policy else "authorizationPolicy",
        )
        report.status = "FAIL"
        report.status_extended = "Guest user access is not restricted to properties and memberships of their own directory objects"

        if (
            getattr(auth_policy, "guest_user_role_id", None)
            == AuthPolicyRoles.GUEST_USER_ACCESS_RESTRICTED.value
        ) or (
            getattr(auth_policy, "guest_user_role_id", None)
            == AuthPolicyRoles.GUEST_USER.value
        ):
            report.status = "PASS"
            report.status_extended = "Guest user access is restricted to properties and memberships of their own directory objects"

        findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_policy_restricts_user_consent_for_apps.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_policy_restricts_user_consent_for_apps/entra_policy_restricts_user_consent_for_apps.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "entra_policy_restricts_user_consent_for_apps",
  "CheckTitle": "Ensure 'User consent for applications' is set to 'Do not allow user consent'",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Authorization Policy",
  "Description": "Require administrators to provide consent for applications before use.",
  "Risk": "If Microsoft Entra ID is running as an identity provider for third-party applications, permissions and consent should be limited to administrators or pre-approved. Malicious applications may attempt to exfiltrate data or abuse privileged user accounts.",
  "RelatedUrl": "https://learn.microsoft.com/en-gb/entra/identity/enterprise-apps/configure-user-consent?pivots=portal",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft Entra admin center (https://entra.microsoft.com/); 2. Click to expand Identity > Applications and select Enterprise applications; 3. Under Security select Consent and permissions > User consent settings; 4. Under User consent for applications select Do not allow user consent; 5. Click the Save option at the top of the window.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Disable user consent for applications in the Microsoft Entra admin center. This ensures that end users and group owners cannot grant consent to applications, requiring administrator approval for all future consent operations, thereby reducing the risk of unauthorized access to company data.",
      "Url": "https://learn.microsoft.com/en-gb/entra/identity/enterprise-apps/configure-user-consent?pivots=portal"
    }
  },
  "Categories": [
    "e3"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Enforcing this setting may create additional requests that administrators need to review."
}
```

--------------------------------------------------------------------------------

---[FILE: entra_policy_restricts_user_consent_for_apps.py]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_policy_restricts_user_consent_for_apps/entra_policy_restricts_user_consent_for_apps.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.entra.entra_client import entra_client


class entra_policy_restricts_user_consent_for_apps(Check):
    """Check if the authorization policy restricts users from consenting apps.

    This check verifies whether the default user role permissions in Microsoft Entra
    prevent users from consenting to apps that access company data on their behalf.
    If such consent is disabled, the check passes.
    """

    def execute(self) -> List[CheckReportM365]:
        """Execute the check for user consent restrictions.

        Returns:
            List[CheckReportM365]: A list containing the result of the check.
        """
        findings = []
        auth_policy = entra_client.authorization_policy

        report = CheckReportM365(
            metadata=self.metadata(),
            resource=auth_policy if auth_policy else {},
            resource_name=auth_policy.name if auth_policy else "Authorization Policy",
            resource_id=auth_policy.id if auth_policy else "authorizationPolicy",
        )
        report.status = "FAIL"
        report.status_extended = (
            "Entra allows users to consent apps accessing company data on their behalf."
        )

        if getattr(auth_policy, "default_user_role_permissions", None) and not any(
            "ManagePermissionGrantsForSelf" in policy_assigned
            for policy_assigned in getattr(
                auth_policy.default_user_role_permissions,
                "permission_grant_policies_assigned",
                ["ManagePermissionGrantsForSelf.microsoft-user-default-legacy"],
            )
        ):
            report.status = "PASS"
            report.status_extended = "Entra does not allow users to consent apps accessing company data on their behalf."

        findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_thirdparty_integrated_apps_not_allowed.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_thirdparty_integrated_apps_not_allowed/entra_thirdparty_integrated_apps_not_allowed.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "entra_thirdparty_integrated_apps_not_allowed",
  "CheckTitle": "Ensure third party integrated applications are not allowed",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "User settings",
  "Description": "Require administrators or appropriately delegated users to register third-party applications.",
  "Risk": "It is recommended to only allow an administrator to register custom-developed applications. This ensures that the application undergoes a formal security review and approval process prior to exposing Azure Active Directory data. Certain users like developers or other high-request users may also be delegated permissions to prevent them from waiting on an administrative user. Your organization should review your policies and decide your needs.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/identity-platform/how-applications-are-added#who-has-permission-to-add-applications-to-my-microsoft-entra-instance",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. From Entra select the Portal Menu 2. Select Azure Active Directory 3. Select Users 4. Select User settings 5. Ensure that Users can register applications is set to No",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Disable third-party integrated application permissions unless explicitly required. If third-party applications are necessary, implement strict approval processes and security controls to mitigate risks associated with external integrations.",
      "Url": "https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/delegate-app-roles#restrict-who-can-create-applications"
    }
  },
  "Categories": [
    "e3"
  ],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Enforcing this setting will create additional requests for approval that will need to be addressed by an administrator. If permissions are delegated, a user may approve a malevolent third party application, potentially giving it access to your data."
}
```

--------------------------------------------------------------------------------

---[FILE: entra_thirdparty_integrated_apps_not_allowed.py]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_thirdparty_integrated_apps_not_allowed/entra_thirdparty_integrated_apps_not_allowed.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.entra.entra_client import entra_client


class entra_thirdparty_integrated_apps_not_allowed(Check):
    """Check if third-party integrated apps are not allowed for non-admin users in Entra.

    This check verifies that non-admin users are not allowed to create third-party apps.
    If the policy allows app creation, the check fails.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """Execute the check to ensure third-party integrated apps are not allowed for non-admin users.

        This method checks if the authorization policy allows non-admin users to create apps.
        If the policy allows app creation, the check fails. Otherwise, the check passes.

        Returns:
            List[CheckReportM365]: A list containing the result of the check for app creation policy.
        """
        findings = []
        auth_policy = entra_client.authorization_policy

        if auth_policy:
            report = CheckReportM365(
                metadata=self.metadata(),
                resource=auth_policy if auth_policy else {},
                resource_name=(
                    auth_policy.name if auth_policy else "Authorization Policy"
                ),
                resource_id=auth_policy.id if auth_policy else "authorizationPolicy",
            )
            if getattr(
                auth_policy, "default_user_role_permissions", None
            ) and not getattr(
                auth_policy.default_user_role_permissions,
                "allowed_to_create_apps",
                True,
            ):
                report.status = "PASS"
                report.status_extended = "App creation is disabled for non-admin users."
            else:
                report.status = "FAIL"
                report.status_extended = (
                    "App creation is not disabled for non-admin users."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_users_mfa_capable.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_users_mfa_capable/entra_users_mfa_capable.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "entra_users_mfa_capable",
  "CheckTitle": "Ensure all users are MFA capable",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "Conditional Access Policy",
  "Description": "Ensure all users are being registered and enabled for multifactor authentication.",
  "Risk": "Users who are not MFA capable are more vulnerable to account compromise, as they may rely solely on single-factor authentication (typically a password), which can be easily phished or cracked.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/identity/authentication/concept-mfa-howitworks",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "Remediation steps will depend on the status of the personnel in question or configuration of Conditional Access policies. Administrators should review each user identified on a case-by-case basis.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure all member users are MFA capable by registering and enabling a strong authentication method that complies with the organization's authentication policy. Regularly review user status to detect gaps in MFA deployment and correct misconfigurations.",
      "Url": "https://learn.microsoft.com/en-us/entra/identity/authentication/concept-mfa-howitworks"
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

---[FILE: entra_users_mfa_capable.py]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_users_mfa_capable/entra_users_mfa_capable.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.entra.entra_client import entra_client


class entra_users_mfa_capable(Check):
    """
    Ensure all users are MFA capable.

    This check verifies if users are MFA capable.

    The check fails if any user is not MFA capable.
    """

    def execute(self) -> List[CheckReportM365]:
        """
        Execute the admin MFA capable check for all users.

        Iterates over the users retrieved from the Entra client and generates a report
        indicating if users are MFA capable.

        Returns:
            List[CheckReportM365]: A list containing a single report with the result of the check.
        """
        findings = []

        for user in entra_client.users.values():
            if user.account_enabled:
                report = CheckReportM365(
                    metadata=self.metadata(),
                    resource=user,
                    resource_name=user.name,
                    resource_id=user.id,
                )

                if not user.is_mfa_capable:
                    report.status = "FAIL"
                    report.status_extended = f"User {user.name} is not MFA capable."
                else:
                    report.status = "PASS"
                    report.status_extended = f"User {user.name} is MFA capable."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_users_mfa_enabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_users_mfa_enabled/entra_users_mfa_enabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "entra_users_mfa_enabled",
  "CheckTitle": "Ensure multifactor authentication is enabled for all users.",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "Conditional Access Policy",
  "Description": "Ensure that multifactor authentication (MFA) is enabled for all users to enhance security and reduce the risk of unauthorized access.",
  "Risk": "Without multifactor authentication (MFA), users are at a higher risk of account compromise due to credential theft, phishing, or brute-force attacks. A single-factor authentication method, such as passwords, is often insufficient to protect against modern cyber threats.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/identity/authentication/tutorial-enable-azure-mfa",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. Navigate to the Microsoft Entra admin center https://entra.microsoft.com. 2. Click expand Protection > Conditional Access select Policies. 3. Click New policy. Under Users include All users (and do not exclude any user). Under Target resources include All cloud apps and do not create any exclusions. Under Grant select Grant Access and check Require multifactor authentication. Click Select at the bottom of the pane. 4. Under Enable policy set it to Report Only until the organization is ready to enable it. 5. Click Create.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable multifactor authentication for all users in the Microsoft 365 tenant. Ensure users register at least one strong second-factor authentication method, such as Microsoft Authenticator, SMS codes, or phone calls. Educate users on the importance of MFA and provide clear instructions for enrollment to minimize disruptions.",
      "Url": "https://learn.microsoft.com/en-us/entra/identity/authentication/tutorial-enable-azure-mfa"
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

---[FILE: entra_users_mfa_enabled.py]---
Location: prowler-master/prowler/providers/m365/services/entra/entra_users_mfa_enabled/entra_users_mfa_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.entra.entra_client import entra_client
from prowler.providers.m365.services.entra.entra_service import (
    ConditionalAccessGrantControl,
    ConditionalAccessPolicyState,
)


class entra_users_mfa_enabled(Check):
    """
    Ensure multifactor authentication is enabled for all users.

    This check verifies that at least one Conditional Access Policy in Microsoft Entra, which is in an enabled state,
    requires multifactor authentication for all users.

    The check fails if no enabled policy is found that requires MFA for all users.
    """

    def execute(self) -> List[CheckReportM365]:
        """
        Execute the admin MFA requirement check for all users.

        Iterates over the Conditional Access Policies retrieved from the Entra client and generates a report
        indicating whether MFA is enforced for users in all users.

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
        report.status_extended = (
            "No Conditional Access Policy enforces MFA for all users."
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
                    report.status_extended = f"Conditional Access Policy '{policy.display_name}' reports MFA requirement for all users but does not enforce it."
                else:
                    report.status = "PASS"
                    report.status_extended = f"Conditional Access Policy '{policy.display_name}' enforces MFA for all users."
                    break

        findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: exchange_client.py]---
Location: prowler-master/prowler/providers/m365/services/exchange/exchange_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.m365.services.exchange.exchange_service import Exchange

exchange_client = Exchange(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
