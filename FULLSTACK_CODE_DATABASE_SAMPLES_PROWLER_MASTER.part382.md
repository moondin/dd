---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 382
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 382 of 867)

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

---[FILE: admincenter_service.py]---
Location: prowler-master/prowler/providers/m365/services/admincenter/admincenter_service.py
Signals: Pydantic

```python
import asyncio
from typing import List, Optional

from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.m365.lib.service.service import M365Service
from prowler.providers.m365.m365_provider import M365Provider


class AdminCenter(M365Service):
    def __init__(self, provider: M365Provider):
        super().__init__(provider)

        self.organization_config = None
        self.sharing_policy = None
        if self.powershell:
            if self.powershell.connect_exchange_online():
                self.organization_config = self._get_organization_config()
                self.sharing_policy = self._get_sharing_policy()
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
                "Cannot initialize AdminCenter service while event loop is running"
            )

        # Get users first alone because it is a dependency for other attributes
        self.users = loop.run_until_complete(self._get_users())

        attributes = loop.run_until_complete(
            asyncio.gather(
                self._get_directory_roles(),
                self._get_groups(),
                self._get_password_policy(),
            )
        )

        self.directory_roles = attributes[0]
        self.groups = attributes[1]
        self.password_policy = attributes[2]

        if created_loop:
            asyncio.set_event_loop(None)
            loop.close()

    def _get_organization_config(self):
        logger.info("Microsoft365 - Getting Exchange Organization configuration...")
        organization_config = None
        try:
            organization_configuration = self.powershell.get_organization_config()
            if organization_configuration:
                organization_config = Organization(
                    name=organization_configuration.get("Name", ""),
                    guid=organization_configuration.get("Guid", ""),
                    customer_lockbox_enabled=organization_configuration.get(
                        "CustomerLockboxEnabled", False
                    ),
                )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return organization_config

    def _get_sharing_policy(self):
        logger.info("M365 - Getting sharing policy...")
        sharing_policy = None
        try:
            sharing_policy_data = self.powershell.get_sharing_policy()
            if sharing_policy_data:
                sharing_policy = SharingPolicy(
                    name=sharing_policy_data.get("Name", ""),
                    guid=sharing_policy_data.get("Guid", ""),
                    enabled=sharing_policy_data.get("Enabled", False),
                )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return sharing_policy

    async def _get_users(self):
        logger.info("M365 - Getting users...")
        users = {}
        try:
            users.update({})
            users_response = await self.client.users.get()

            while users_response:
                for user in getattr(users_response, "value", []) or []:
                    license_details = await self.client.users.by_user_id(
                        user.id
                    ).license_details.get()
                    users.update(
                        {
                            user.id: User(
                                id=user.id,
                                name=getattr(user, "display_name", ""),
                                license=(
                                    getattr(
                                        license_details.value[0],
                                        "sku_part_number",
                                        None,
                                    )
                                    if license_details.value
                                    else None
                                ),
                            )
                        }
                    )

                next_link = getattr(users_response, "odata_next_link", None)
                if not next_link:
                    break
                users_response = await self.client.users.with_url(next_link).get()
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )

        return users

    async def _get_directory_roles(self):
        logger.info("M365 - Getting directory roles...")
        directory_roles_with_members = {}
        try:
            directory_roles_with_members.update({})
            directory_roles = await self.client.directory_roles.get()
            for directory_role in directory_roles.value:
                directory_role_members = (
                    await self.client.directory_roles.by_directory_role_id(
                        directory_role.id
                    ).members.get()
                )
                members_with_roles = []
                for member in directory_role_members.value:
                    user = self.users.get(member.id, None)
                    if user:
                        user.directory_roles.append(directory_role.display_name)
                        members_with_roles.append(user)

                directory_roles_with_members.update(
                    {
                        directory_role.display_name: DirectoryRole(
                            id=directory_role.id,
                            name=directory_role.display_name,
                            members=members_with_roles,
                        )
                    }
                )

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return directory_roles_with_members

    async def _get_groups(self):
        logger.info("M365 - Getting groups...")
        groups = {}
        try:
            groups_list = await self.client.groups.get()
            groups.update({})
            for group in groups_list.value:
                groups.update(
                    {
                        group.id: Group(
                            id=group.id,
                            name=getattr(group, "display_name", ""),
                            visibility=getattr(group, "visibility", ""),
                        )
                    }
                )

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return groups

    async def _get_password_policy(self):
        logger.info("M365 - Getting password policy...")
        password_policy = None
        try:
            logger.info("M365 - Getting domains...")
            domains_list = await self.client.domains.get()
            for domain in getattr(domains_list, "value", []) or []:
                if not domain:
                    continue
                password_validity_period = getattr(
                    domain, "password_validity_period_in_days", None
                )
                if password_validity_period is None:
                    password_validity_period = 0

                password_policy = PasswordPolicy(
                    password_validity_period=password_validity_period,
                )
                break

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return password_policy


class User(BaseModel):
    id: str
    name: str
    directory_roles: List[str] = []
    license: Optional[str] = None
    user_type: Optional[str] = None


class DirectoryRole(BaseModel):
    id: str
    name: str
    members: List[User]


class Group(BaseModel):
    id: str
    name: str
    visibility: Optional[str]


class PasswordPolicy(BaseModel):
    password_validity_period: int


class Organization(BaseModel):
    name: str
    guid: str
    customer_lockbox_enabled: bool


class SharingPolicy(BaseModel):
    name: str
    guid: str
    enabled: bool
```

--------------------------------------------------------------------------------

---[FILE: admincenter_external_calendar_sharing_disabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/admincenter/admincenter_external_calendar_sharing_disabled/admincenter_external_calendar_sharing_disabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "admincenter_external_calendar_sharing_disabled",
  "CheckTitle": "Ensure external sharing of calendars is disabled",
  "CheckType": [],
  "ServiceName": "admincenter",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Sharing Policy",
  "Description": "Restrict the ability for users to share their calendars externally in Microsoft 365. This prevents users from sending calendar sharing links to external recipients, reducing information exposure.",
  "Risk": "Allowing calendar sharing outside the organization can help attackers build knowledge of personnel availability, relationships, and activity patterns, aiding social engineering or targeted attacks.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/microsoft-365/admin/manage/share-calendars-with-external-users?view=o365-worldwide",
  "Remediation": {
    "Code": {
      "CLI": "Set-SharingPolicy -Identity \"Default Sharing Policy\" -Enabled $False",
      "NativeIaC": "",
      "Other": "1. Navigate to https://admin.microsoft.com. 2. Click Settings > Org settings. 3. Select Calendar in the Services section. 4. Uncheck 'Let your users share their calendars with people outside of your organization who have Office 365 or Exchange'. 5. Click Save.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Disable external calendar sharing by setting the Default Sharing Policy to disabled.",
      "Url": "https://learn.microsoft.com/en-us/microsoft-365/admin/manage/share-calendars-with-external-users?view=o365-worldwide"
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

---[FILE: admincenter_external_calendar_sharing_disabled.py]---
Location: prowler-master/prowler/providers/m365/services/admincenter/admincenter_external_calendar_sharing_disabled/admincenter_external_calendar_sharing_disabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.admincenter.admincenter_client import (
    admincenter_client,
)


class admincenter_external_calendar_sharing_disabled(Check):
    """
    Ensure that external calendar sharing is disabled for the organization.

    Disabling external calendar sharing restricts the ability for users to share their
    calendars externally in Microsoft 365. This prevents users from sending calendar
    sharing links to external recipients, reducing information exposure.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """
        Execute the check for external calendar sharing in Microsoft 365.

        This method checks if external calendar sharing is disabled in the organization configuration.

        Returns:
            List[CheckReportM365]: A list of reports containing the result of the check.
        """
        findings = []
        sharing_policy = admincenter_client.sharing_policy
        if sharing_policy:
            report = CheckReportM365(
                metadata=self.metadata(),
                resource=sharing_policy,
                resource_name=sharing_policy.name,
                resource_id=sharing_policy.guid,
            )
            report.status = "FAIL"
            report.status_extended = (
                "External calendar sharing is enabled at the organization level."
            )

            if not sharing_policy.enabled:
                report.status = "PASS"
                report.status_extended = (
                    "External calendar sharing is disabled at the organization level."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: admincenter_groups_not_public_visibility.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/admincenter/admincenter_groups_not_public_visibility/admincenter_groups_not_public_visibility.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "admincenter_groups_not_public_visibility",
  "CheckTitle": "Ensure that only organizationally managed/approved public groups exist",
  "CheckType": [],
  "ServiceName": "admincenter",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Active teams & groups",
  "Description": "Ensure that only organizationally managed and approved public groups exist to prevent unauthorized access to sensitive group resources like SharePoint, Teams, or other shared assets.",
  "Risk": "Unmanaged public groups can allow unauthorized access to organizational resources, posing a risk of data leakage or misuse through easily guessable SharePoint URLs or self-adding to groups via the Azure portal.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/microsoft-365/admin/create-groups/manage-groups?view=o365-worldwide",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft 365 admin center https://admin.microsoft.com. 2. Click to expand Teams & groups select Active teams & groups. 3. On the Active teams and groups page, select the group's name that is public. 4. On the popup groups name page, select Settings. 5. Under Privacy, select Private.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Review and adjust the privacy settings of Microsoft 365 Groups to ensure only organizationally managed and approved public groups exist.",
      "Url": "https://learn.microsoft.com/en-us/microsoft-365/security/office-365-security/microsoft-365-groups-governance"
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

---[FILE: admincenter_groups_not_public_visibility.py]---
Location: prowler-master/prowler/providers/m365/services/admincenter/admincenter_groups_not_public_visibility/admincenter_groups_not_public_visibility.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.admincenter.admincenter_client import (
    admincenter_client,
)


class admincenter_groups_not_public_visibility(Check):
    """Check if groups in Microsoft Admin Center have public visibility.

    This check verifies whether the visibility of groups in Microsoft Admin Center
    is set to 'Private'. If any group has a 'Public' visibility, the check fails.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """Execute the check for groups with public visibility.

        This method iterates through all groups in Microsoft Admin Center and checks
        if any group has 'Public' visibility. If so, the check fails for that group.

        Returns:
            List[CheckReportM365]: A list containing the results of the check for each group.
        """
        findings = []
        for group in admincenter_client.groups.values():
            report = CheckReportM365(
                metadata=self.metadata(),
                resource=group,
                resource_name=group.name,
                resource_id=group.id,
            )
            report.status = "FAIL"
            report.status_extended = f"Group {group.name} has {group.visibility} visibility and should be Private."

            if group.visibility and group.visibility != "Public":
                report.status = "PASS"
                report.status_extended = (
                    f"Group {group.name} has {group.visibility} visibility."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: admincenter_organization_customer_lockbox_enabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/admincenter/admincenter_organization_customer_lockbox_enabled/admincenter_organization_customer_lockbox_enabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "admincenter_organization_customer_lockbox_enabled",
  "CheckTitle": "Ensure that customer lockbox is enabled for the organization",
  "CheckType": [],
  "ServiceName": "admincenter",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Exchange Organization Configuration",
  "Description": "Customer Lockbox ensures that Microsoft support engineers cannot access content in your tenant to perform a service operation without explicit approval. This feature provides an additional layer of control and transparency over data access requests.",
  "Risk": "If Customer Lockbox is not enabled, Microsoft support personnel can access your organization's data for troubleshooting without explicit approval, potentially increasing the risk of unauthorized access or data exfiltration.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/azure/security/fundamentals/customer-lockbox-overview",
  "Remediation": {
    "Code": {
      "CLI": "Set-OrganizationConfig -CustomerLockBoxEnabled $true",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft 365 admin center https://admin.microsoft.com. 2. Click Settings > Org settings. 3. Select the Security & privacy tab. 4. Click Customer lockbox. 5. Check the box 'Require approval for all data access requests'. 6. Click Save.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable the Customer Lockbox feature to ensure explicit approval is required before Microsoft engineers can access your data during support operations.",
      "Url": "https://learn.microsoft.com/en-us/azure/security/fundamentals/customer-lockbox-overview"
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

---[FILE: admincenter_organization_customer_lockbox_enabled.py]---
Location: prowler-master/prowler/providers/m365/services/admincenter/admincenter_organization_customer_lockbox_enabled/admincenter_organization_customer_lockbox_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.admincenter.admincenter_client import (
    admincenter_client,
)


class admincenter_organization_customer_lockbox_enabled(Check):
    """
    Ensure the customer lockbox feature is enabled.

    Customer Lockbox ensures that Microsoft support engineers cannot access content
    in your tenant to perform a service operation without explicit approval. This feature
    provides an additional layer of control and transparency over data access requests.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """
        Execute the check for the Customer Lockbox feature in Microsoft 365.

        This method checks if the Customer Lockbox feature is enabled in the organization configuration.

        Returns:
            List[CheckReportM365]: A list of reports containing the result of the check.
        """
        findings = []
        organization_config = admincenter_client.organization_config
        if organization_config:
            report = CheckReportM365(
                metadata=self.metadata(),
                resource=organization_config,
                resource_name=organization_config.name,
                resource_id=organization_config.guid,
            )
            report.status = "FAIL"
            report.status_extended = (
                "Customer Lockbox is not enabled at organization level."
            )

            if organization_config.customer_lockbox_enabled:
                report.status = "PASS"
                report.status_extended = (
                    "Customer Lockbox is enabled at organization level."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: admincenter_settings_password_never_expire.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/admincenter/admincenter_settings_password_never_expire/admincenter_settings_password_never_expire.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "admincenter_settings_password_never_expire",
  "CheckTitle": "Ensure the 'Password expiration policy' is set to 'Set passwords to never expire (recommended)'",
  "CheckType": [],
  "ServiceName": "admincenter",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Security & privacy settings",
  "Description": "This control ensures that the password expiration policy is set to 'Set passwords to never expire (recommended)'. This aligns with modern recommendations to enhance security by avoiding arbitrary password changes and focusing on supplementary controls like MFA.",
  "Risk": "Arbitrary password expiration policies can lead to weaker passwords due to frequent changes. Users may adopt insecure habits such as using simple, memorable passwords.",
  "RelatedUrl": "https://www.cisecurity.org/insights/white-papers/cis-password-policy-guide",
  "Remediation": {
    "Code": {
      "CLI": "Set-MsolUser -UserPrincipalName <user> -PasswordNeverExpires $true",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft 365 admin center https://admin.microsoft.com. 2. Click to expand Settings select Org Settings. 3. Click on Security & privacy. 4. Check the Set passwords to never expire (recommended) box. 5. Click Save.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable the 'Never Expire Passwords' option in Microsoft 365 Admin Center.",
      "Url": "https://learn.microsoft.com/en-us/microsoft-365/admin/misc/password-policy-recommendations?view=o365-worldwide"
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

---[FILE: admincenter_settings_password_never_expire.py]---
Location: prowler-master/prowler/providers/m365/services/admincenter/admincenter_settings_password_never_expire/admincenter_settings_password_never_expire.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.admincenter.admincenter_client import (
    admincenter_client,
)


class admincenter_settings_password_never_expire(Check):
    """Check if the tenant enforces a 'Password never expires' policy.

    This check verifies whether the tenant-wide password policy (surfaced through the first
    domain returned by Microsoft 365) is set to never expire. If the password validity period
    is set to `2147483647`, the policy is considered to have 'password never expires'.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """Execute the check for password never expires policy.

        This method inspects the tenant-level password validity configuration (exposed through
        the first available domain) and checks if the password validity period is set to
        `2147483647`, indicating that passwords for users in the domain never expire.

        Returns:
            List[CheckReportM365]: A list of reports indicating whether the domain's password
            policy is set to never expire.
        """
        findings = []
        password_policy = getattr(admincenter_client, "password_policy", None)
        if password_policy:
            report = CheckReportM365(
                self.metadata(),
                resource=password_policy,
                resource_name="Password Policy",
                resource_id="passwordPolicy",
            )
            report.status = "FAIL"
            report.status_extended = (
                "Tenant Password policy does not have a Password never expires policy."
            )

            if password_policy.password_validity_period == 2147483647:
                report.status = "PASS"
                report.status_extended = (
                    "Tenant Password policy is set to never expire."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: admincenter_users_admins_reduced_license_footprint.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/admincenter/admincenter_users_admins_reduced_license_footprint/admincenter_users_admins_reduced_license_footprint.metadata.json
Signals: Next.js

```json
{
  "Provider": "m365",
  "CheckID": "admincenter_users_admins_reduced_license_footprint",
  "CheckTitle": "Ensure administrative accounts use licenses with a reduced application footprint",
  "CheckType": [],
  "ServiceName": "admincenter",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Active users",
  "Description": "Administrative accounts must use licenses with a reduced application footprint, such as Microsoft Entra ID P1 or P2, or avoid licenses entirely when possible. This minimizes the attack surface associated with privileged identities.",
  "Risk": "Licensing administrative accounts with applications like email or collaborative tools increases their exposure to social engineering attacks and malicious content, putting privileged accounts at risk.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/microsoft-365/enterprise/protect-your-global-administrator-accounts?view=o365-worldwide",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft 365 admin center https://admin.microsoft.com. 2. Click to expand Users select Active users. 3. Click Add a user. 4. Fill out the appropriate fields for Name, user, etc. 5. When prompted to assign licenses select as needed Microsoft Entra ID P1 or Microsoft Entra ID P2, then click Next. 6. Under the Option settings screen you may choose from several types of privileged roles. Choose Admin center access followed by the appropriate role then click Next. 7. Select Finish adding.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Assign Microsoft Entra ID P1 or P2 licenses to administrative accounts to participate in essential security services without enabling access to vulnerable applications.",
      "Url": "https://learn.microsoft.com/en-us/microsoft-365/admin/add-users/add-users?view=o365-worldwide"
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

---[FILE: admincenter_users_admins_reduced_license_footprint.py]---
Location: prowler-master/prowler/providers/m365/services/admincenter/admincenter_users_admins_reduced_license_footprint/admincenter_users_admins_reduced_license_footprint.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.admincenter.admincenter_client import (
    admincenter_client,
)


class admincenter_users_admins_reduced_license_footprint(Check):
    """Check if users with administrative roles have a reduced license footprint.

    This check ensures that users with administrative roles (like Global Administrator)
    have valid licenses, specifically one of the allowed licenses. If a user with
    administrative roles has an invalid license, the check fails.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """Execute the check for users with administrative roles and their licenses.

        This method iterates over all users and checks if those with administrative roles
        have an allowed license. If a user has a valid license (AAD_PREMIUM or AAD_PREMIUM_P2) or no license,
        the check passes; otherwise, it fails.

        Returns:
            List[CheckReportM365]: A list containing the result of the check for each user.
        """
        findings = []
        allowed_licenses = ["AAD_PREMIUM", "AAD_PREMIUM_P2"]
        for user in admincenter_client.users.values():
            admin_roles = ", ".join(
                [
                    role
                    for role in user.directory_roles
                    if "Administrator" in role or "Global Reader" in role
                ]
            )

            if admin_roles:
                report = CheckReportM365(
                    metadata=self.metadata(),
                    resource=user,
                    resource_name=user.name,
                    resource_id=user.id,
                )
                report.status = "PASS"
                report.status_extended = f"User {user.name} has administrative roles {admin_roles} and does not have a license."

                if user.license:
                    if user.license not in allowed_licenses:
                        report.status = "FAIL"
                        report.status_extended = f"User {user.name} has administrative roles {admin_roles} and an invalid license: {user.license}."
                    else:
                        report.status = "PASS"
                        report.status_extended = f"User {user.name} has administrative roles {admin_roles} and a valid license: {user.license}."

                findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: admincenter_users_between_two_and_four_global_admins.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/admincenter/admincenter_users_between_two_and_four_global_admins/admincenter_users_between_two_and_four_global_admins.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "admincenter_users_between_two_and_four_global_admins",
  "CheckTitle": "Ensure that between two and four global admins are designated",
  "CheckType": [],
  "ServiceName": "admincenter",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Active users",
  "Description": "Ensure that there are between two and four global administrators designated in your tenant. This ensures monitoring, redundancy, and reduces the risk associated with having too many privileged accounts.",
  "Risk": "Having only one global administrator increases the risk of unmonitored actions and operational disruptions if that administrator is unavailable. Having more than four increases the likelihood of a breach through one of these highly privileged accounts.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/best-practices#5-limit-the-number-of-global-administrators-to-less-than-5",
  "Remediation": {
    "Code": {
      "CLI": "",
      "NativeIaC": "",
      "Other": "1. Navigate to the Microsoft 365 admin center https://admin.microsoft.com 2. Select Users > Active Users. 3. In the Search field enter the name of the user to be made a Global Administrator. 4. To create a new Global Admin: 1. Select the user's name. 2. A window will appear to the right. 3. Select Manage roles. 4. Select Admin center access. 5. Check Global Administrator. 6. Click Save changes. 5. To remove Global Admins: 1. Select User. 2. Under Roles select Manage roles. 3. De-Select the appropriate role. 4. Click Save changes.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Review the number of global administrators in your tenant. Add or remove global admins as necessary to ensure compliance with the recommended range of two to four.",
      "Url": "https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/manage-roles-portal"
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

---[FILE: admincenter_users_between_two_and_four_global_admins.py]---
Location: prowler-master/prowler/providers/m365/services/admincenter/admincenter_users_between_two_and_four_global_admins/admincenter_users_between_two_and_four_global_admins.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.admincenter.admincenter_client import (
    admincenter_client,
)


class admincenter_users_between_two_and_four_global_admins(Check):
    """Check if there are between two and four Global Administrators in Microsoft Admin Center.

    This check verifies that the number of users with the 'Global Administrator' role is
    between 2 and 4, inclusive. If there are fewer than two or more than four, the check fails.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """Execute the check for the number of Global Administrators.

        This method checks if the number of users with the 'Global Administrator' role
        is between two and four. If the condition is met, the check passes; otherwise, it fails.

        Returns:
            List[CheckReportM365]: A list containing the result of the check for the Global Administrators.
        """
        findings = []
        directory_roles = admincenter_client.directory_roles
        global_admin_role = directory_roles.get("Global Administrator", {})

        if global_admin_role:
            report = CheckReportM365(
                metadata=self.metadata(),
                resource=global_admin_role,
                resource_name=global_admin_role.name,
                resource_id=global_admin_role.id,
            )
            report.status = "FAIL"
            report.status_extended = (
                "There are not between two and four global administrators."
            )

            num_global_admins = len(getattr(global_admin_role, "members", []))
            if 1 < num_global_admins < 5:
                report.status = "PASS"
                report.status_extended = (
                    f"There are {num_global_admins} global administrators."
                )
            else:
                report.status_extended = f"There are {num_global_admins} global administrators. It should be more than one and less than five."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: defender_client.py]---
Location: prowler-master/prowler/providers/m365/services/defender/defender_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.m365.services.defender.defender_service import Defender

defender_client = Defender(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

````
