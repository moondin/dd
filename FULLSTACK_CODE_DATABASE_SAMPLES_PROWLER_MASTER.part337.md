---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 337
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 337 of 867)

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

---[FILE: entra_service.py]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_service.py
Signals: Pydantic

```python
import asyncio
from asyncio import gather
from typing import List, Optional
from uuid import UUID

from msgraph import GraphServiceClient
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.azure.azure_provider import AzureProvider
from prowler.providers.azure.config import GUEST_USER_ACCESS_NO_RESTRICTICTED
from prowler.providers.azure.lib.service.service import AzureService


class Entra(AzureService):
    def __init__(self, provider: AzureProvider):
        super().__init__(GraphServiceClient, provider)

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
                "Cannot initialize Entra service while event loop is running"
            )

        # Get users first alone because it is a dependency for other attributes
        self.users = loop.run_until_complete(self._get_users())

        attributes = loop.run_until_complete(
            gather(
                self._get_authorization_policy(),
                self._get_group_settings(),
                self._get_security_default(),
                self._get_named_locations(),
                self._get_directory_roles(),
                self._get_conditional_access_policy(),
            )
        )

        self.authorization_policy = attributes[0]
        self.group_settings = attributes[1]
        self.security_default = attributes[2]
        self.named_locations = attributes[3]
        self.directory_roles = attributes[4]
        self.conditional_access_policy = attributes[5]

        if created_loop:
            asyncio.set_event_loop(None)
            loop.close()

    async def _get_users(self):
        logger.info("Entra - Getting users...")
        users = {}
        try:
            for tenant, client in self.clients.items():
                users.update({tenant: {}})
                users_response = await client.users.get()

                try:
                    while users_response:
                        for user in getattr(users_response, "value", []) or []:
                            users[tenant].update(
                                {
                                    user.id: User(
                                        id=user.id,
                                        name=user.display_name,
                                        authentication_methods=[
                                            AuthMethod(
                                                id=auth_method.id,
                                                type=getattr(
                                                    auth_method, "odata_type", None
                                                ),
                                            )
                                            for auth_method in (
                                                await client.users.by_user_id(
                                                    user.id
                                                ).authentication.methods.get()
                                            ).value
                                        ],
                                    )
                                }
                            )

                        next_link = getattr(users_response, "odata_next_link", None)
                        if not next_link:
                            break
                        users_response = await client.users.with_url(next_link).get()

                except Exception as error:
                    if (
                        error.__class__.__name__ == "ODataError"
                        and error.__dict__.get("response_status_code", None) == 403
                    ):
                        logger.error(
                            "You need 'UserAuthenticationMethod.Read.All' permission to access this information. It only can be granted through Service Principal authentication."
                        )
                    else:
                        logger.error(
                            f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
                        )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

        return users

    async def _get_authorization_policy(self):
        logger.info("Entra - Getting authorization policy...")

        authorization_policy = {}
        try:
            for tenant, client in self.clients.items():
                auth_policy = await client.policies.authorization_policy.get()

                default_user_role_permissions = getattr(
                    auth_policy, "default_user_role_permissions", None
                )

                authorization_policy.update(
                    {
                        tenant: AuthorizationPolicy(
                            id=auth_policy.id,
                            name=auth_policy.display_name,
                            description=auth_policy.description,
                            default_user_role_permissions=DefaultUserRolePermissions(
                                allowed_to_create_apps=getattr(
                                    default_user_role_permissions,
                                    "allowed_to_create_apps",
                                    None,
                                ),
                                allowed_to_create_security_groups=getattr(
                                    default_user_role_permissions,
                                    "allowed_to_create_security_groups",
                                    None,
                                ),
                                allowed_to_create_tenants=getattr(
                                    default_user_role_permissions,
                                    "allowed_to_create_tenants",
                                    None,
                                ),
                                allowed_to_read_bitlocker_keys_for_owned_device=getattr(
                                    default_user_role_permissions,
                                    "allowed_to_read_bitlocker_keys_for_owned_device",
                                    None,
                                ),
                                allowed_to_read_other_users=getattr(
                                    default_user_role_permissions,
                                    "allowed_to_read_other_users",
                                    None,
                                ),
                                odata_type=getattr(
                                    default_user_role_permissions, "odata_type", None
                                ),
                                permission_grant_policies_assigned=[
                                    policy_assigned
                                    for policy_assigned in getattr(
                                        default_user_role_permissions,
                                        "permission_grant_policies_assigned",
                                        [],
                                    )
                                ],
                            ),
                            guest_invite_settings=(
                                auth_policy.allow_invites_from.value
                                if getattr(auth_policy, "allow_invites_from", None)
                                else "everyone"
                            ),
                            guest_user_role_id=getattr(
                                auth_policy,
                                "guest_user_role_id",
                                GUEST_USER_ACCESS_NO_RESTRICTICTED,
                            ),
                        )
                    }
                )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

        return authorization_policy

    async def _get_group_settings(self):
        logger.info("Entra - Getting group settings...")
        group_settings = {}
        try:
            for tenant, client in self.clients.items():
                group_settings_list = await client.group_settings.get()
                group_settings.update({tenant: {}})
                for group_setting in group_settings_list.value:
                    group_settings[tenant].update(
                        {
                            group_setting.id: GroupSetting(
                                name=getattr(group_setting, "display_name", None),
                                template_id=getattr(group_setting, "template_id", None),
                                settings=[
                                    SettingValue(
                                        name=setting.name,
                                        odata_type=setting.odata_type,
                                        value=setting.value,
                                    )
                                    for setting in getattr(group_setting, "values", [])
                                ],
                            )
                        }
                    )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

        return group_settings

    async def _get_security_default(self):
        logger.info("Entra - Getting security default...")
        try:
            security_defaults = {}
            for tenant, client in self.clients.items():
                security_default = (
                    await client.policies.identity_security_defaults_enforcement_policy.get()
                )
                security_defaults.update(
                    {
                        tenant: SecurityDefault(
                            id=security_default.id,
                            name=security_default.display_name,
                            is_enabled=security_default.is_enabled,
                        ),
                    }
                )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

        return security_defaults

    async def _get_named_locations(self):
        logger.info("Entra - Getting named locations...")
        named_locations = {}
        try:
            for tenant, client in self.clients.items():
                named_locations_list = (
                    await client.identity.conditional_access.named_locations.get()
                )
                named_locations.update({tenant: {}})
                for named_location in getattr(named_locations_list, "value", []):
                    named_locations[tenant].update(
                        {
                            named_location.id: NamedLocation(
                                id=named_location.id,
                                name=named_location.display_name,
                                ip_ranges_addresses=[
                                    getattr(ip_range, "cidr_address", None)
                                    for ip_range in getattr(
                                        named_location, "ip_ranges", []
                                    )
                                ],
                                is_trusted=getattr(named_location, "is_trusted", False),
                            )
                        }
                    )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

        return named_locations

    async def _get_directory_roles(self):
        logger.info("Entra - Getting directory roles...")
        directory_roles_with_members = {}
        try:
            for tenant, client in self.clients.items():
                directory_roles_with_members.update({tenant: {}})
                directory_roles = await client.directory_roles.get()
                for directory_role in directory_roles.value:
                    directory_role_members = (
                        await client.directory_roles.by_directory_role_id(
                            directory_role.id
                        ).members.get()
                    )
                    directory_roles_with_members[tenant].update(
                        {
                            directory_role.display_name: DirectoryRole(
                                id=directory_role.id,
                                members=[
                                    self.users[tenant][member.id]
                                    for member in directory_role_members.value
                                    if self.users[tenant].get(member.id, None)
                                ],
                            )
                        }
                    )

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return directory_roles_with_members

    async def _get_conditional_access_policy(self):
        logger.info("Entra - Getting conditional access policy...")
        conditional_access_policy = {}
        try:
            for tenant, client in self.clients.items():
                conditional_access_policies = (
                    await client.identity.conditional_access.policies.get()
                )
                conditional_access_policy.update({tenant: {}})
                for policy in getattr(conditional_access_policies, "value", []):
                    conditions = getattr(policy, "conditions", None)

                    included_apps = []
                    excluded_apps = []

                    if getattr(conditions, "applications", None):
                        if getattr(conditions.applications, "include_applications", []):
                            included_apps = conditions.applications.include_applications
                        elif getattr(
                            conditions.applications, "include_user_actions", []
                        ):
                            included_apps = conditions.applications.include_user_actions

                        if getattr(conditions.applications, "exclude_applications", []):
                            excluded_apps = conditions.applications.exclude_applications
                        elif getattr(
                            conditions.applications, "exclude_user_actions", []
                        ):
                            excluded_apps = conditions.applications.exclude_user_actions

                    grant_access_controls = []
                    block_access_controls = []

                    for access_control in (
                        getattr(policy.grant_controls, "built_in_controls")
                        if policy.grant_controls
                        else []
                    ):
                        if "Grant" in str(access_control):
                            grant_access_controls.append(str(access_control))
                        else:
                            block_access_controls.append(str(access_control))

                    conditional_access_policy[tenant].update(
                        {
                            policy.id: ConditionalAccessPolicy(
                                id=policy.id,
                                name=policy.display_name,
                                state=getattr(policy, "state", "None"),
                                users={
                                    "include": (
                                        getattr(conditions.users, "include_users", [])
                                        if getattr(conditions, "users", None)
                                        else []
                                    ),
                                    "exclude": (
                                        getattr(conditions.users, "exclude_users", [])
                                        if getattr(conditions, "users", None)
                                        else []
                                    ),
                                },
                                target_resources={
                                    "include": included_apps,
                                    "exclude": excluded_apps,
                                },
                                access_controls={
                                    "grant": grant_access_controls,
                                    "block": block_access_controls,
                                },
                            )
                        }
                    )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

        return conditional_access_policy


class AuthMethod(BaseModel):
    id: str
    type: str


class User(BaseModel):
    id: str
    name: str
    authentication_methods: List[AuthMethod] = []


class DefaultUserRolePermissions(BaseModel):
    allowed_to_create_apps: Optional[bool] = None
    allowed_to_create_security_groups: Optional[bool] = None
    allowed_to_create_tenants: Optional[bool] = None
    allowed_to_read_bitlocker_keys_for_owned_device: Optional[bool] = None
    allowed_to_read_other_users: Optional[bool] = None
    odata_type: Optional[str] = None
    permission_grant_policies_assigned: Optional[List[str]] = None


class AuthorizationPolicy(BaseModel):
    id: str
    name: str
    description: str
    default_user_role_permissions: Optional[DefaultUserRolePermissions] = None
    guest_invite_settings: str
    guest_user_role_id: UUID


class SettingValue(BaseModel):
    name: Optional[str] = None
    odata_type: Optional[str] = None
    value: Optional[str] = None


class GroupSetting(BaseModel):
    name: Optional[str] = None
    template_id: Optional[str] = None
    settings: List[SettingValue]


class SecurityDefault(BaseModel):
    id: str
    name: str
    is_enabled: bool


class NamedLocation(BaseModel):
    id: str
    name: str
    ip_ranges_addresses: List[str]
    is_trusted: bool


class DirectoryRole(BaseModel):
    id: str
    members: List[User]


class ConditionalAccessPolicy(BaseModel):
    id: str
    name: str
    state: str
    users: dict[str, List[str]]
    target_resources: dict[str, List[str]]
    access_controls: dict[str, List[str]]
```

--------------------------------------------------------------------------------

---[FILE: entra_conditional_access_policy_require_mfa_for_management_api.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_conditional_access_policy_require_mfa_for_management_api/entra_conditional_access_policy_require_mfa_for_management_api.metadata.json
Signals: Next.js

```json
{
  "Provider": "azure",
  "CheckID": "entra_conditional_access_policy_require_mfa_for_management_api",
  "CheckTitle": "Ensure Multifactor Authentication is Required for Windows Azure Service Management API",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "#microsoft.graph.conditionalAccess",
  "Description": "This recommendation ensures that users accessing the Windows Azure Service Management API (i.e. Azure Powershell, Azure CLI, Azure Resource Manager API, etc.) are required to use multifactor authentication (MFA) credentials when accessing resources through the Windows Azure Service Management API.",
  "Risk": "Administrative access to the Windows Azure Service Management API should be secured with a higher level of scrutiny to authenticating mechanisms. Enabling multifactor authentication is recommended to reduce the potential for abuse of Administrative actions, and to prevent intruders or compromised admin credentials from changing administrative settings.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/identity/conditional-access/howto-conditional-access-policy-azure-management",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. From the Azure Admin Portal dashboard, open Microsoft Entra ID. 2. Click Security in the Entra ID blade. 3. Click Conditional Access in the Security blade. 4. Click Policies in the Conditional Access blade. 5. Click + New policy. 6. Enter a name for the policy. 7. Click the blue text under Users. 8. Under Include, select All users. 9. Under Exclude, check Users and groups. 10. Select users or groups to be exempted from this policy (e.g. break-glass emergency accounts, and non-interactive service accounts) then click the Select button. 11. Click the blue text under Target Resources. 12. Under Include, click the Select apps radio button. 13. Click the blue text under Select. 14. Check the box next to Windows Azure Service Management APIs then click the Select button. 15. Click the blue text under Grant. 16. Under Grant access check the box for Require multifactor authentication then click the Select button. 17. Before creating, set Enable policy to Report-only. 18. Click Create. After testing the policy in report-only mode, update the Enable policy setting from Report-only to On.",
      "Url": "https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-conditional-access-cloud-apps"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Conditional Access policies require Microsoft Entra ID P1 or P2 licenses. Similarly, they may require additional overhead to maintain if users lose access to their MFA. Any users or groups which are granted an exception to this policy should be carefully tracked, be granted only minimal necessary privileges, and conditional access exceptions should be regularly reviewed or investigated."
}
```

--------------------------------------------------------------------------------

---[FILE: entra_conditional_access_policy_require_mfa_for_management_api.py]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_conditional_access_policy_require_mfa_for_management_api/entra_conditional_access_policy_require_mfa_for_management_api.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.config import WINDOWS_AZURE_SERVICE_MANAGEMENT_API
from prowler.providers.azure.services.entra.entra_client import entra_client


class entra_conditional_access_policy_require_mfa_for_management_api(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for (
            tenant_name,
            conditional_access_policies,
        ) in entra_client.conditional_access_policy.items():
            for policy in conditional_access_policies.values():
                if (
                    policy.state == "enabled"
                    and "All" in policy.users["include"]
                    and WINDOWS_AZURE_SERVICE_MANAGEMENT_API
                    in policy.target_resources["include"]
                    and any(
                        "mfa" in access_control.lower()
                        for access_control in policy.access_controls["grant"]
                    )
                ):
                    report = Check_Report_Azure(
                        metadata=self.metadata(), resource=policy
                    )
                    report.subscription = f"Tenant: {tenant_name}"
                    report.status = "PASS"
                    report.status_extended = (
                        "Conditional Access Policy requires MFA for management API."
                    )
                    break
            else:
                report = Check_Report_Azure(
                    metadata=self.metadata(),
                    resource=conditional_access_policies,
                )
                report.subscription = f"Tenant: {tenant_name}"
                report.resource_name = "Conditional Access Policy"
                report.resource_id = "Conditional Access Policy"
                report.status = "FAIL"
                report.status_extended = (
                    "Conditional Access Policy does not require MFA for management API."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_global_admin_in_less_than_five_users.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_global_admin_in_less_than_five_users/entra_global_admin_in_less_than_five_users.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "entra_global_admin_in_less_than_five_users",
  "CheckTitle": "Ensure fewer than 5 users have global administrator assignment",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "#microsoft.graph.directoryRole",
  "Description": "This recommendation aims to maintain a balance between security and operational efficiency by ensuring that a minimum of 2 and a maximum of 4 users are assigned the Global Administrator role in Microsoft Entra ID. Having at least two Global Administrators ensures redundancy, while limiting the number to four reduces the risk of excessive privileged access.",
  "Risk": "The Global Administrator role has extensive privileges across all services in Microsoft Entra ID. The Global Administrator role should never be used in regular daily activities, administrators should have a regular user account for daily activities, and a separate account for administrative responsibilities. Limiting the number of Global Administrators helps mitigate the risk of unauthorized access, reduces the potential impact of human error, and aligns with the principle of least privilege to reduce the attack surface of an Azure tenant. Conversely, having at least two Global Administrators ensures that administrative functions can be performed without interruption in case of unavailability of a single admin.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/best-practices#5-limit-the-number-of-global-administrators-to-less-than-5",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. From Azure Home select the Portal Menu 2. Select Microsoft Entra ID 3. Select Roles and Administrators 4. Select Global Administrator 5. Ensure less than 5 users are actively assigned the role. 6. Ensure that at least 2 users are actively assigned the role.",
      "Url": "https://learn.microsoft.com/en-us/microsoft-365/admin/add-users/about-admin-roles?view=o365-worldwide#security-guidelines-for-assigning-roles"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Implementing this recommendation may require changes in administrative workflows or the redistribution of roles and responsibilities. Adequate training and awareness should be provided to all Global Administrators."
}
```

--------------------------------------------------------------------------------

---[FILE: entra_global_admin_in_less_than_five_users.py]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_global_admin_in_less_than_five_users/entra_global_admin_in_less_than_five_users.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.entra.entra_client import entra_client


class entra_global_admin_in_less_than_five_users(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for tenant_domain, directory_roles in entra_client.directory_roles.items():
            report = Check_Report_Azure(
                metadata=self.metadata(),
                resource=directory_roles.get("Global Administrator", {}),
            )
            report.status = "FAIL"
            report.subscription = f"Tenant: {tenant_domain}"
            report.resource_name = "Global Administrator"

            if "Global Administrator" in directory_roles:
                report.resource_id = getattr(
                    directory_roles["Global Administrator"],
                    "id",
                    "Global Administrator",
                )

                num_global_admins = len(
                    getattr(directory_roles["Global Administrator"], "members", [])
                )

                if num_global_admins < 5:
                    report.status = "PASS"
                    report.status_extended = (
                        f"There are {num_global_admins} global administrators."
                    )
                else:
                    report.status_extended = f"There are {num_global_admins} global administrators. It should be less than five."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_non_privileged_user_has_mfa.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_non_privileged_user_has_mfa/entra_non_privileged_user_has_mfa.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "entra_non_privileged_user_has_mfa",
  "CheckTitle": "Ensure that 'Multi-Factor Auth Status' is 'Enabled' for all Non-Privileged Users",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "#microsoft.graph.users",
  "Description": "Enable multi-factor authentication for all non-privileged users.",
  "Risk": "Multi-factor authentication requires an individual to present a minimum of two separate forms of authentication before access is granted. Multi-factor authentication provides additional assurance that the individual attempting to gain access is who they claim to be. With multi-factor authentication, an attacker would need to compromise at least two different authentication mechanisms, increasing the difficulty of compromise and thus reducing the risk.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/identity/authentication/concept-mfa-howitworks",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/ActiveDirectory/multi-factor-authentication-for-all-non-privileged-users.html#",
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
  "Notes": "Users would require two forms of authentication before any access is granted. Also, this requires an overhead for managing dual forms of authentication."
}
```

--------------------------------------------------------------------------------

---[FILE: entra_non_privileged_user_has_mfa.py]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_non_privileged_user_has_mfa/entra_non_privileged_user_has_mfa.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.entra.entra_client import entra_client
from prowler.providers.azure.services.entra.lib.user_privileges import (
    is_privileged_user,
)


class entra_non_privileged_user_has_mfa(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for tenant_domain, users in entra_client.users.items():
            for user in users.values():
                if not is_privileged_user(
                    user, entra_client.directory_roles[tenant_domain]
                ):
                    report = Check_Report_Azure(metadata=self.metadata(), resource=user)
                    report.subscription = f"Tenant: {tenant_domain}"
                    report.status = "FAIL"
                    report.status_extended = (
                        f"Non-privileged user {user.name} does not have MFA."
                    )

                    if len(user.authentication_methods) > 1:
                        report.status = "PASS"
                        report.status_extended = (
                            f"Non-privileged user {user.name} has MFA."
                        )

                    findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_policy_default_users_cannot_create_security_groups.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_policy_default_users_cannot_create_security_groups/entra_policy_default_users_cannot_create_security_groups.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "entra_policy_default_users_cannot_create_security_groups",
  "CheckTitle": "Ensure that 'Users can create security groups in Azure portals, API or PowerShell' is set to 'No'",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "#microsoft.graph.authorizationPolicy",
  "Description": "Restrict security group creation to administrators only.",
  "Risk": "When creating security groups is enabled, all users in the directory are allowed to create new security groups and add members to those groups. Unless a business requires this day-to-day delegation, security group creation should be restricted to administrators only.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/identity/users/groups-self-service-management",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/ActiveDirectory/users-can-create-security-groups.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. From Azure Home select the Portal Menu 2. Select Microsoft Entra ID 3. Select Groups 4. Select General under Settings 5. Set Users can create security groups in Azure portals, API or PowerShell to No",
      "Url": ""
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Enabling this setting could create a number of requests that would need to be managed by an administrator."
}
```

--------------------------------------------------------------------------------

---[FILE: entra_policy_default_users_cannot_create_security_groups.py]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_policy_default_users_cannot_create_security_groups/entra_policy_default_users_cannot_create_security_groups.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.entra.entra_client import entra_client


class entra_policy_default_users_cannot_create_security_groups(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for tenant_domain, auth_policy in entra_client.authorization_policy.items():
            report = Check_Report_Azure(metadata=self.metadata(), resource=auth_policy)
            report.subscription = f"Tenant: {tenant_domain}"
            report.resource_name = getattr(auth_policy, "name", "Authorization Policy")
            report.resource_id = getattr(auth_policy, "id", "authorizationPolicy")
            report.status = "FAIL"
            report.status_extended = "Non-privileged users are able to create security groups via the Access Panel and the Azure administration portal."

            if getattr(
                auth_policy, "default_user_role_permissions", None
            ) and not getattr(
                auth_policy.default_user_role_permissions,
                "allowed_to_create_security_groups",
                True,
            ):
                report.status = "PASS"
                report.status_extended = "Non-privileged users are not able to create security groups via the Access Panel and the Azure administration portal."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: entra_policy_ensure_default_user_cannot_create_apps.metadata.json]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_policy_ensure_default_user_cannot_create_apps/entra_policy_ensure_default_user_cannot_create_apps.metadata.json

```json
{
  "Provider": "azure",
  "CheckID": "entra_policy_ensure_default_user_cannot_create_apps",
  "CheckTitle": "Ensure That 'Users Can Register Applications' Is Set to 'No'",
  "CheckType": [],
  "ServiceName": "entra",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "#microsoft.graph.authorizationPolicy",
  "Description": "Require administrators or appropriately delegated users to register third-party applications.",
  "Risk": "It is recommended to only allow an administrator to register custom-developed applications. This ensures that the application undergoes a formal security review and approval process prior to exposing Azure Active Directory data. Certain users like developers or other high-request users may also be delegated permissions to prevent them from waiting on an administrative user. Your organization should review your policies and decide your needs.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/identity-platform/how-applications-are-added#who-has-permission-to-add-applications-to-my-azure-ad-instance",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "https://www.trendmicro.com/cloudoneconformity/knowledge-base/azure/ActiveDirectory/users-can-register-applications.html",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "1. From Azure Home select the Portal Menu 2. Select Azure Active Directory 3. Select Users 4. Select User settings 5. Ensure that Users can register applications is set to No",
      "Url": "https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/delegate-app-roles#restrict-who-can-create-applications"
    }
  },
  "Categories": [],
  "DependsOn": [],
  "RelatedTo": [],
  "Notes": "Enforcing this setting will create additional requests for approval that will need to be addressed by an administrator. If permissions are delegated, a user may approve a malevolent third party application, potentially giving it access to your data."
}
```

--------------------------------------------------------------------------------

---[FILE: entra_policy_ensure_default_user_cannot_create_apps.py]---
Location: prowler-master/prowler/providers/azure/services/entra/entra_policy_ensure_default_user_cannot_create_apps/entra_policy_ensure_default_user_cannot_create_apps.py

```python
from prowler.lib.check.models import Check, Check_Report_Azure
from prowler.providers.azure.services.entra.entra_client import entra_client


class entra_policy_ensure_default_user_cannot_create_apps(Check):
    def execute(self) -> Check_Report_Azure:
        findings = []

        for tenant_domain, auth_policy in entra_client.authorization_policy.items():
            report = Check_Report_Azure(metadata=self.metadata(), resource=auth_policy)
            report.subscription = f"Tenant: {tenant_domain}"
            report.resource_name = getattr(auth_policy, "name", "Authorization Policy")
            report.resource_id = getattr(auth_policy, "id", "authorizationPolicy")
            report.status = "FAIL"
            report.status_extended = "App creation is not disabled for non-admin users."

            if getattr(
                auth_policy, "default_user_role_permissions", None
            ) and not getattr(
                auth_policy.default_user_role_permissions,
                "allowed_to_create_apps",
                True,
            ):
                report.status = "PASS"
                report.status_extended = "App creation is disabled for non-admin users."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
