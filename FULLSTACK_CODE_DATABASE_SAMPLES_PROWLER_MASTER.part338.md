---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 338
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 338 of 867)

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

---[FILE: entra_policy_ensure_default_user_cannot_create_tenants.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_policy_ensure_default_user_cannot_create_tenants/entra_policy_ensure_default_user_cannot_create_tenants.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "entra_policy_ensure_default_user_cannot_create_tenants",
  "CheckTitle": "Ensure that 'Restrict non-admin users from creating tenants' is set to 'Yes'",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "#microsoft.graph.authorizationPolicy",
  "Description": "Require administrators or appropriately delegated users to create new tenants.",
  "Risk": "It is recommended to only allow an administrator to create new tenants. This prevent users from creating new Azure AD or Azure AD B2C tenants and ensures that only authorized users are able to do so.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/fundamentals/users-default-permissions",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. From Azure Home select the Portal Menu 2. Select Azure Active Directory 3. Select Users 4. Select User settings 5. Set 'Restrict non-admin users from creating' tenants to 'Yes'",
      "Url": "https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/permissions-reference#tenant-creator"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Enforcing this setting will ensure that only authorized users are able to create new tenants."
}
```

--------------------------------------------------------------------------------

---[FILE: entra_policy_ensure_default_user_cannot_create_tenants.py]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_policy_ensure_default_user_cannot_create_tenants/entra_policy_ensure_default_user_cannot_create_tenants.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.entra.entra_client import entra_client


class entra_policy_ensure_default_user_cannot_create_tenants(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for tenant_domain, auth_policy in entra_client.authorization_policy.items():
            report = Check_Report_Azure(metadata=self.metadata(), resource=auth_policy)
            report.subscription = f"Tenant: {tenant_domain}"
            report.resource_name = getattr(auth_policy, "name", "Authorization Policy")
            report.resource_id = getattr(auth_policy, "id", "authorizationPolicy")
            report.status = "FAIL"
            report.status_extended = (
                "Tenants creation is not disabled for non-admin users."
            )

            if getattr(
                auth_policy, "default_user_role_permissions", None
            ) and not getattr(
                auth_policy.default_user_role_permissions,
                "allowed_to_create_tenants",
                True,
            ):
                report.status = "PASS"
                report.status_extended = (
                    "Tenants creation is disabled for non-admin users."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_policy_guest_invite_only_for_admin_roles.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_policy_guest_invite_only_for_admin_roles/entra_policy_guest_invite_only_for_admin_roles.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "entra_policy_guest_invite_only_for_admin_roles",
  "CheckTitle": "Ensure that 'Guest invite restrictions' is set to 'Only users assigned to specific admin roles can invite guest users'",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "#microsoft.graph.authorizationPolicy",
  "Description": "Restrict invitations to users with specific administrative roles only.",
  "Risk": "Restricting invitations to users with specific administrator roles ensures that only authorized accounts have access to cloud resources. This helps to maintain 'Need to Know' permissions and prevents inadvertent access to data. By default the setting Guest invite restrictions is set to Anyone in the organization can invite guest users including guests and non-admins. This would allow anyone within the organization to invite guests and non-admins to the tenant, posing a security risk.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/external-id/external-collaboration-settings-configure",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. From Azure Home select the Portal Menu 2. Select Microsoft Entra ID 3. Then External Identities 4. Select External collaboration settings 5. Under Guest invite settings, for Guest invite restrictions, ensure that Only users assigned to specific admin roles can invite guest users is selected",
      "Url": "https://learn.microsoft.com/en-us/answers/questions/685101/how-to-allow-only-admins-to-add-guests"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "With the option of Only users assigned to specific admin roles can invite guest users selected, users with specific admin roles will be in charge of sending invitations to the external users, requiring additional overhead by them to manage user accounts. This will mean coordinating with other departments as they are onboarding new users."
}
```

--------------------------------------------------------------------------------

---[FILE: entra_policy_guest_invite_only_for_admin_roles.py]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_policy_guest_invite_only_for_admin_roles/entra_policy_guest_invite_only_for_admin_roles.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.entra.entra_client import entra_client


class entra_policy_guest_invite_only_for_admin_roles(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for tenant_domain, auth_policy in entra_client.authorization_policy.items():
            report = Check_Report_Azure(metadata=self.metadata(), resource=auth_policy)
            report.subscription = f"Tenant: {tenant_domain}"
            report.resource_name = getattr(auth_policy, "name", "Authorization Policy")
            report.resource_id = getattr(auth_policy, "id", "authorizationPolicy")
            report.status = "FAIL"
            report.status_extended = "Guest invitations are not restricted to users with specific administrative roles only."

            if (
                getattr(auth_policy, "guest_invite_settings", "everyone")
                == "adminsAndGuestInviters"
                or getattr(auth_policy, "guest_invite_settings", "everyone") == "none"
            ):
                report.status = "PASS"
                report.status_extended = "Guest invitations are restricted to users with specific administrative roles only."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_policy_guest_users_access_restrictions.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_policy_guest_users_access_restrictions/entra_policy_guest_users_access_restrictions.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "entra_policy_guest_users_access_restrictions",
  "CheckTitle": "Ensure That 'Guest users access restrictions' is set to 'Guest user access is restricted to properties and memberships of their own directory objects'",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "#microsoft.graph.authorizationPolicy",
  "Description": "Limit guest user permissions.",
  "Risk": "Limiting guest access ensures that guest accounts do not have permission for certain directory tasks, such as enumerating users, groups or other directory resources, and cannot be assigned to administrative roles in your directory. Guest access has three levels of restriction. 1. Guest users have the same access as members (most inclusive), 2. Guest users have limited access to properties and memberships of directory objects (default value), 3. Guest user access is restricted to properties and memberships of their own directory objects (most restrictive). The recommended option is the 3rd, most restrictive: 'Guest user access is restricted to their own directory object'.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/identity/users/users-restrict-guest-permissions",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. From Azure Home select the Portal Menu 2. Select Microsoft Entra ID 3. Then External Identities 4. Select External collaboration settings 5. Under Guest user access, change Guest user access restrictions to be Guest user access is restricted to properties and memberships of their own directory objects",
      "Url": "https://learn.microsoft.com/en-us/entra/fundamentals/users-default-permissions#member-and-guest-users"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "This may create additional requests for permissions to access resources that administrators will need to approve. According to https://learn.microsoft.com/en-us/azure/active-directory/enterprise- users/users-restrict-guest-permissions#services-currently-not-supported Service without current support might have compatibility issues with the new guest restriction setting."
}
```

--------------------------------------------------------------------------------

---[FILE: entra_policy_guest_users_access_restrictions.py]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_policy_guest_users_access_restrictions/entra_policy_guest_users_access_restrictions.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.config import GUEST_USER_ACCESS_RESTRICTICTED
from prowler.providers.azure.services.entra.entra_client import entra_client


class entra_policy_guest_users_access_restrictions(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for tenant_domain, auth_policy in entra_client.authorization_policy.items():
            report = Check_Report_Azure(metadata=self.metadata(), resource=auth_policy)
            report.subscription = f"Tenant: {tenant_domain}"
            report.resource_name = getattr(auth_policy, "name", "Authorization Policy")
            report.resource_id = getattr(auth_policy, "id", "authorizationPolicy")
            report.status = "FAIL"
            report.status_extended = "Guest user access is not restricted to properties and memberships of their own directory objects"

            if (
                getattr(auth_policy, "guest_user_role_id", None)
                == GUEST_USER_ACCESS_RESTRICTICTED
            ):
                report.status = "PASS"
                report.status_extended = "Guest user access is restricted to properties and memberships of their own directory objects"

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_policy_restricts_user_consent_for_apps.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_policy_restricts_user_consent_for_apps/entra_policy_restricts_user_consent_for_apps.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "entra_policy_restricts_user_consent_for_apps",
  "CheckTitle": "Ensure 'User consent for applications' is set to 'Do not allow user consent'",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "#microsoft.graph.authorizationPolicy",
  "Description": "Require administrators to provide consent for applications before use.",
  "Risk": "If Microsoft Entra ID is running as an identity provider for third-party applications, permissions and consent should be limited to administrators or pre-approved. Malicious applications may attempt to exfiltrate data or abuse privileged user accounts.",
  "RelatedUrl": "https://learn.microsoft.com/en-gb/entra/identity/enterprise-apps/configure-user-consent?pivots=portal",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/ActiveDirectory/users-can-consent-to-apps-accessing-company-data-on-their-behalf.html#",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. From Azure Home select the Portal Menu 2. Select Microsoft Entra ID 3. Select Enterprise Applications 4. Select Consent and permissions 5. Select User consent settings 6. Set User consent for applications to Do not allow user consent 7. Click save",
      "Url": "https://learn.microsoft.com/en-us/security/benchmark/azure/mcsb-privileged-access#pa-1-separate-and-limit-highly-privilegedadministrative-users"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Enforcing this setting may create additional requests that administrators need to review."
}
```

--------------------------------------------------------------------------------

---[FILE: entra_policy_restricts_user_consent_for_apps.py]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_policy_restricts_user_consent_for_apps/entra_policy_restricts_user_consent_for_apps.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.entra.entra_client import entra_client


class entra_policy_restricts_user_consent_for_apps(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for tenant_domain, auth_policy in entra_client.authorization_policy.items():
            report = Check_Report_Azure(metadata=self.metadata(), resource=auth_policy)
            report.subscription = f"Tenant: {tenant_domain}"
            report.resource_name = getattr(auth_policy, "name", "Authorization Policy")
            report.resource_id = getattr(auth_policy, "id", "authorizationPolicy")
            report.status = "FAIL"
            report.status_extended = "Entra allows users to consent apps accessing company data on their behalf"

            if getattr(auth_policy, "default_user_role_permissions", None) and not any(
                "ManagePermissionGrantsForSelf" in policy_assigned
                for policy_assigned in getattr(
                    auth_policy.default_user_role_permissions,
                    "permission_grant_policies_assigned",
                    ["ManagePermissionGrantsForSelf.microsoft-user-default-legacy"],
                )
            ):
                report.status = "PASS"
                report.status_extended = "Entra does not allow users to consent apps accessing company data on their behalf"

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_policy_user_consent_for_verified_apps.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_policy_user_consent_for_verified_apps/entra_policy_user_consent_for_verified_apps.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "entra_policy_user_consent_for_verified_apps",
  "CheckTitle": "Ensure 'User consent for applications' Is Set To 'Allow for Verified Publishers'",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "#microsoft.graph.authorizationPolicy",
  "Description": "Allow users to provide consent for selected permissions when a request is coming from a verified publisher.",
  "Risk": "If Microsoft Entra ID is running as an identity provider for third-party applications, permissions and consent should be limited to administrators or pre-approved. Malicious applications may attempt to exfiltrate data or abuse privileged user accounts.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/configure-user-consent?pivots=portal#configure-user-consent-to-applications",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. From Azure Home select the Portal Menu 2. Select Microsoft Entra ID 3. Select Enterprise Applications 4. Select Consent and permissions 5. Select User consent settings 6. Under User consent for applications, select Allow user consent for apps from verified publishers, for selected permissions 7. Select Save",
      "Url": "https://learn.microsoft.com/en-us/security/benchmark/azure/mcsb-privileged-access#pa-1-separate-and-limit-highly-privilegedadministrative-users"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Enforcing this setting may create additional requests that administrators need to review."
}
```

--------------------------------------------------------------------------------

---[FILE: entra_policy_user_consent_for_verified_apps.py]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_policy_user_consent_for_verified_apps/entra_policy_user_consent_for_verified_apps.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.entra.entra_client import entra_client


class entra_policy_user_consent_for_verified_apps(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for tenant_domain, auth_policy in entra_client.authorization_policy.items():
            report = Check_Report_Azure(metadata=self.metadata(), resource=auth_policy)
            report.subscription = f"Tenant: {tenant_domain}"
            report.resource_name = getattr(auth_policy, "name", "Authorization Policy")
            report.resource_id = getattr(auth_policy, "id", "authorizationPolicy")
            report.status = "PASS"
            report.status_extended = "Entra does not allow users to consent non-verified apps accessing company data on their behalf."

            if getattr(auth_policy, "default_user_role_permissions", None) and any(
                "ManagePermissionGrantsForSelf.microsoft-user-default-legacy"
                in policy_assigned
                for policy_assigned in getattr(
                    auth_policy.default_user_role_permissions,
                    "permission_grant_policies_assigned",
                    ["ManagePermissionGrantsForSelf.microsoft-user-default-legacy"],
                )
            ):
                report.status = "FAIL"
                report.status_extended = "Entra allows users to consent apps accessing company data on their behalf."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_privileged_user_has_mfa.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_privileged_user_has_mfa/entra_privileged_user_has_mfa.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "entra_privileged_user_has_mfa",
  "CheckTitle": "Ensure that 'Multi-Factor Auth Status' is 'Enabled' for all Privileged Users",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "#microsoft.graph.users",
  "Description": "Enable multi-factor authentication for all roles, groups, and users that have write access or permissions to Azure resources. These include custom created objects or built-in roles such as, - Service Co-Administrators - Subscription Owners - Contributors",
  "Risk": "Multi-factor authentication requires an individual to present a minimum of two separate forms of authentication before access is granted. Multi-factor authentication provides additional assurance that the individual attempting to gain access is who they claim to be. With multi-factor authentication, an attacker would need to compromise at least two different authentication mechanisms, increasing the difficulty of compromise and thus reducing the risk.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/identity/authentication/concept-mfa-howitworks",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/ActiveDirectory/multi-factor-authentication-for-all-privileged-users.html#",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Activate one of the available multi-factor authentication methods for users in Microsoft Entra ID.",
      "Url": "https://learn.microsoft.com/en-us/entra/identity/authentication/tutorial-enable-azure-mfa"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Users would require two forms of authentication before any access is granted. Additional administrative time will be required for managing dual forms of authentication when enabling multi-factor authentication."
}
```

--------------------------------------------------------------------------------

---[FILE: entra_privileged_user_has_mfa.py]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_privileged_user_has_mfa/entra_privileged_user_has_mfa.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.entra.entra_client import entra_client
from prowler.providers.azure.services.entra.lib.user_privileges import (
    is_privileged_user,
)


class entra_privileged_user_has_mfa(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for tenant_domain, users in entra_client.users.items():
            for user_domain_name, user in users.items():
                if is_privileged_user(
                    user, entra_client.directory_roles[tenant_domain]
                ):
                    report = Check_Report_Azure(metadata=self.metadata(), resource=user)
                    report.subscription = f"Tenant: {tenant_domain}"
                    report.status = "FAIL"
                    report.status_extended = (
                        f"Privileged user {user.name} does not have MFA."
                    )

                    if len(user.authentication_methods) > 1:
                        report.status = "PASS"
                        report.status_extended = f"Privileged user {user.name} has MFA."

                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_security_defaults_enabled.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_security_defaults_enabled/entra_security_defaults_enabled.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "entra_security_defaults_enabled",
  "CheckTitle": "Ensure Security Defaults is enabled on Microsoft Entra ID",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "#microsoft.graph.identitySecurityDefaultsEnforcementPolicy",
  "Description": "Security defaults in Microsoft Entra ID make it easier to be secure and help protect your organization. Security defaults contain preconfigured security settings for common attacks. Security defaults is available to everyone. The goal is to ensure that all organizations have a basic level of security enabled at no extra cost. You may turn on security defaults in the Azure portal.",
  "Risk": "Security defaults provide secure default settings that we manage on behalf of organizations to keep customers safe until they are ready to manage their own identity security settings. For example, doing the following: - Requiring all users and admins to register for MFA. - Challenging users with MFA - when necessary, based on factors such as location, device, role, and task. - Disabling authentication from legacy authentication clients, which can’t do MFA.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/fundamentals/security-defaults",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/ActiveDirectory/security-defaults-enabled.html#",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. From Azure Home select the Portal Menu. 2. Browse to Microsoft Entra ID > Properties 3. Select Manage security defaults 4. Set the Enable security defaults to Enabled 5. Select Save",
      "Url": "https://techcommunity.microsoft.com/t5/microsoft-entra-blog/introducing-security-defaults/ba-p/1061414"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "This recommendation should be implemented initially and then may be overridden by other service/product specific CIS Benchmarks. Administrators should also be aware that certain configurations in Microsoft Entra ID may impact other Microsoft services such as Microsoft 365."
}
```

--------------------------------------------------------------------------------

---[FILE: entra_security_defaults_enabled.py]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_security_defaults_enabled/entra_security_defaults_enabled.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.entra.entra_client import entra_client


class entra_security_defaults_enabled(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            tenant,
            security_default,
        ) in entra_client.security_default.items():
            report = Check_Report_Azure(
                metadata=self.metadata(), resource=security_default
            )
            report.subscription = f"Tenant: {tenant}"
            report.status = "FAIL"
            report.status_extended = "Entra security defaults is disabled."

            if getattr(security_default, "is_enabled", False):
                report.status = "PASS"
                report.status_extended = "Entra security defaults is enabled."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_trusted_named_locations_exists.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_trusted_named_locations_exists/entra_trusted_named_locations_exists.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "entra_trusted_named_locations_exists",
  "CheckTitle": "Ensure Trusted Locations Are Defined",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "#microsoft.graph.ipNamedLocation",
  "Description": "Microsoft Entra ID Conditional Access allows an organization to configure Named locations and configure whether those locations are trusted or untrusted. These settings provide organizations the means to specify Geographical locations for use in conditional access policies, or define actual IP addresses and IP ranges and whether or not those IP addresses and/or ranges are trusted by the organization.",
  "Risk": "Defining trusted source IP addresses or ranges helps organizations create and enforce Conditional Access policies around those trusted or untrusted IP addresses and ranges. Users authenticating from trusted IP addresses and/or ranges may have less access restrictions or access requirements when compared to users that try to authenticate to Microsoft Entra ID from untrusted locations or untrusted source IP addresses/ranges.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/identity/conditional-access/location-condition",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Navigate to the Microsoft Entra ID Conditional Access Blade 2. Click on the Named locations blade 3. Within the Named locations blade, click on IP ranges location 4. Enter a name for this location setting in the Name text box 5. Click on the + sign 6. Add an IP Address Range in CIDR notation inside the text box that appears 7. Click on the Add button 8. Repeat steps 5 through 7 for each IP Range that needs to be added 9. If the information entered are trusted ranges, select the Mark as trusted location check box 10. Once finished, click on Create",
      "Url": "https://learn.microsoft.com/en-us/security/benchmark/azure/mcsb-identity-management#im-7-restrict-resource-access-based-on--conditions"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "When configuring Named locations, the organization can create locations using Geographical location data or by defining source IP addresses or ranges. Configuring Named locations using a Country location does not provide the organization the ability to mark those locations as trusted, and any Conditional Access policy relying on those Countries location setting will not be able to use the All trusted locations setting within the Conditional Access policy. They instead will have to rely on the Select locations setting. This may add additional resource requirements when configuring, and will require thorough organizational testing. In general, Conditional Access policies may completely prevent users from authenticating to Microsoft Entra ID, and thorough testing is recommended. To avoid complete lockout, a 'Break Glass' account with full Global Administrator rights is recommended in the event all other administrators are locked out of authenticating to Microsoft Entra ID. This 'Break Glass' account should be excluded from Conditional Access Policies and should be configured with the longest pass phrase feasible. This account should only be used in the event of an emergency and complete administrator lockout."
}
```

--------------------------------------------------------------------------------

---[FILE: entra_trusted_named_locations_exists.py]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_trusted_named_locations_exists/entra_trusted_named_locations_exists.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.entra.entra_client import entra_client


class entra_trusted_named_locations_exists(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for tenant, named_locations in entra_client.named_locations.items():
            report = Check_Report_Azure(
                metadata=self.metadata(), resource=named_locations
            )
            report.status = "FAIL"
            report.subscription = f"Tenant: {tenant}"
            report.resource_name = "Named Locations"
            report.resource_id = "Named Locations"
            report.status_extended = (
                "There is no trusted location with IP ranges defined."
            )
            for named_location in named_locations.values():
                if named_location.ip_ranges_addresses and named_location.is_trusted:
                    report = Check_Report_Azure(
                        metadata=self.metadata(), resource=named_location
                    )
                    report.subscription = f"Tenant: {tenant}"
                    report.status = "PASS"
                    report.status_extended = f"Exits trusted location with trusted IP ranges, this IPs ranges are: {[ip_range for ip_range in named_location.ip_ranges_addresses if ip_range]}"
                    break

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_users_cannot_create_microsoft_365_groups.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_users_cannot_create_microsoft_365_groups/entra_users_cannot_create_microsoft_365_groups.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "entra_users_cannot_create_microsoft_365_groups",
  "CheckTitle": "Ensure that 'Users can create Microsoft 365 groups in Azure portals, API or PowerShell' is set to 'No'",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Microsoft.Users/Settings",
  "Description": "Restrict Microsoft 365 group creation to administrators only.",
  "Risk": "Restricting Microsoft 365 group creation to administrators only ensures that creation of Microsoft 365 groups is controlled by the administrator. Appropriate groups should be created and managed by the administrator and group creation rights should not be delegated to any other user.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/microsoft-365/community/all-about-groups#microsoft-365-groups",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/ActiveDirectory/users-can-create-office-365-groups.html#",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. From Azure Home select the Portal Menu 2. Select Microsoft Entra ID 3. Then Groups 4. Select General in settings 5. Set Users can create Microsoft 365 groups in Azure portals, API or PowerShell to No",
      "Url": "https://learn.microsoft.com/en-us/microsoft-365/solutions/manage-creation-of-groups?view=o365-worldwide&redirectSourcePath=%252fen-us%252farticle%252fControl-who-can-create-Office-365-Groups-4c46c8cb-17d0-44b5-9776-005fced8e618"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Enabling this setting could create a number of requests that would need to be managed by an administrator."
}
```

--------------------------------------------------------------------------------

---[FILE: entra_users_cannot_create_microsoft_365_groups.py]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_users_cannot_create_microsoft_365_groups/entra_users_cannot_create_microsoft_365_groups.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.entra.entra_client import entra_client


class entra_users_cannot_create_microsoft_365_groups(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for tenant_domain, group_settings in entra_client.group_settings.items():
            report = Check_Report_Azure(
                metadata=self.metadata(), resource=group_settings
            )
            report.status = "FAIL"
            report.subscription = f"Tenant: {tenant_domain}"
            report.resource_name = "Microsoft365 Groups"
            report.resource_id = "Microsoft365 Groups"
            report.status_extended = "Users can create Microsoft 365 groups."

            for group_setting in group_settings.values():
                if group_setting.name == "Group.Unified":
                    for setting_value in group_setting.settings:
                        if (
                            getattr(setting_value, "name", "") == "EnableGroupCreation"
                            and setting_value.value != "true"
                        ):
                            report.status = "PASS"
                            report.status_extended = (
                                "Users cannot create Microsoft 365 groups."
                            )
                            break

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_user_with_vm_access_has_mfa.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_user_with_vm_access_has_mfa/entra_user_with_vm_access_has_mfa.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "entra_user_with_vm_access_has_mfa",
  "CheckTitle": "Ensure only MFA enabled identities can access privileged Virtual Machine",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "#microsoft.graph.users",
  "Description": "Verify identities without MFA that can log in to a privileged virtual machine using separate login credentials. An adversary can leverage the access to move laterally and perform actions with the virtual machine's managed identity. Make sure the virtual machine only has necessary permissions, and revoke the admin-level permissions according to the least privileges principal",
  "Risk": "Managed disks are by default encrypted on the underlying hardware, so no additional encryption is required for basic protection. It is available if additional encryption is required. Managed disks are by design more resilient that storage accounts. For ARM-deployed Virtual Machines, Azure Adviser will at some point recommend moving VHDs to managed disks both from a security and cost management perspective.",
  "RelatedUrl": "",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. Log in to the Azure portal. Reducing access of managed identities attached to virtual machines. 2. This can be remediated by enabling MFA for user, Removing user access or • Case I : Enable MFA for users having access on virtual machines. 1. Navigate to Azure AD from the left pane and select Users from the Manage section. 2. Click on Per-User MFA from the top menu options and select each user with MULTI-FACTOR AUTH STATUS as Disabled and can login to virtual machines:  From quick steps on the right side select enable.  Click on enable multi-factor auth and share the link with the user to setup MFA as required. • Case II : Removing user access on a virtual machine. 1. Select the Subscription, then click on Access control (IAM). 2. Select Role assignments and search for Virtual Machine Administrator Login or Virtual Machine User Login or any role that provides access to log into virtual machines. 3. Click on Role Name, Select Assignments, and remove identities with no MFA configured. • Case III : Reducing access of managed identities attached to virtual machines. 1. Select the Subscription, then click on Access control (IAM). 2. Select Role Assignments from the top menu and apply filters on Assignment type as Privileged administrator roles and Type as Virtual Machines. 3. Click on Role Name, Select Assignments, and remove identities access make sure this follows the least privileges principal.",
      "Url": ""
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "This recommendation requires an Azure AD P2 License to implement. Ensure that identities that are provisioned to a virtual machine utilizes an RBAC/ABAC group and is allocated a role using Azure PIM, and the Role settings require MFA or use another PAM solution (like CyberArk) for accessing Virtual Machines."
}
```

--------------------------------------------------------------------------------

````
