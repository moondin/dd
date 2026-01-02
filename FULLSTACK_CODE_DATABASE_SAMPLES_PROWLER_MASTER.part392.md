---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 392
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 392 of 867)

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

---[FILE: sharepoint_guest_sharing_restricted.py]---
Location: prowler-master/prowler/providers/m365/services/sharepoint/sharepoint_guest_sharing_restricted/sharepoint_guest_sharing_restricted.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.sharepoint.sharepoint_client import (
    sharepoint_client,
)


class sharepoint_guest_sharing_restricted(Check):
    """
    Check if Microsoft 365 SharePoint guest sharing is restricted.

    This check verifies that guest users in SharePoint cannot share items they do not own.
    When guest resharing is enabled, external users might share content they don't own,
    increasing the risk of unauthorized data exposure. This control ensures that the setting
    to prevent external users from resharing is enabled.
    """

    def execute(self) -> List[CheckReportM365]:
        """
        Execute the SharePoint guest sharing restriction check.

        Iterates over the SharePoint settings retrieved from the Microsoft 365 SharePoint client
        and generates a report indicating whether guest users are prevented from sharing items they do not own.

        Returns:
            List[CheckReportM365]: A list containing a report with the result of the check.
        """
        findings = []
        settings = sharepoint_client.settings
        if settings:
            report = CheckReportM365(
                self.metadata(),
                resource=settings if settings else {},
                resource_name="SharePoint Settings",
                resource_id="sharepointSettings",
            )
            report.status = "FAIL"
            report.status_extended = "Guest sharing is not restricted; guest users can share items they do not own."
            if not settings.resharingEnabled:
                report.status = "PASS"
                report.status_extended = "Guest sharing is restricted; guest users cannot share items they do not own."

            findings.append(report)
        return findings
```

--------------------------------------------------------------------------------

---[FILE: sharepoint_modern_authentication_required.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/sharepoint/sharepoint_modern_authentication_required/sharepoint_modern_authentication_required.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "sharepoint_modern_authentication_required",
  "CheckTitle": "Ensure modern authentication for SharePoint applications is required.",
  "CheckType": [],
  "ServiceName": "sharepoint",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "Sharepoint Settings",
  "Description": "Ensure that modern authentication is required for SharePoint applications in Microsoft 365, preventing the use of legacy authentication protocols and blocking access to apps that don't use modern authentication.",
  "Risk": "If modern authentication is not enforced, SharePoint applications may rely on basic authentication, which lacks strong security measures like MFA and increases the risk of credential theft.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/graph/api/resources/sharepoint?view=graph-rest-1.0",
  "Remediation": {
    "Code": {
      "CLI": "Set-SPOTenant -LegacyAuthProtocolsEnabled $false",
      "NativeIaC": "",
      "Other": "1. Navigate to SharePoint admin center https://admin.microsoft.com/sharepoint. 2. Click to expand Policies select Access control. 3. Select Apps that don't use modern authentication. 4. Select the radio button for Block access. 5. Click Save.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Block access for SharePoint applications that don't use modern authentication to ensure secure authentication mechanisms.",
      "Url": "https://learn.microsoft.com/en-us/powershell/module/sharepoint-online/set-spotenant?view=sharepoint-ps"
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

---[FILE: sharepoint_modern_authentication_required.py]---
Location: prowler-master/prowler/providers/m365/services/sharepoint/sharepoint_modern_authentication_required/sharepoint_modern_authentication_required.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.sharepoint.sharepoint_client import (
    sharepoint_client,
)


class sharepoint_modern_authentication_required(Check):
    """
    Check if Microsoft 365 SharePoint requires modern authentication.

    This check verifies that modern authentication is enforced for SharePoint applications in Microsoft 365.
    Modern authentication leverages OAuth 2.0 and supports advanced security features such as multi-factor
    authentication (MFA) and conditional access. Legacy authentication protocols (e.g., basic authentication)
    do not support these features and increase the risk of credential compromise.

    The check fails if modern authentication is not enforced, indicating that legacy protocols may be used.
    """

    def execute(self) -> List[CheckReportM365]:
        """
        Execute the SharePoint modern authentication requirement check.

        Iterates over the SharePoint configuration retrieved from the Microsoft 365 SharePoint client and
        generates a report indicating whether modern authentication is required for SharePoint applications.

        Returns:
            List[CheckReportM365]: A list containing the report object with the result of the check.
        """
        findings = []
        settings = sharepoint_client.settings
        if settings:
            report = CheckReportM365(
                self.metadata(),
                resource=settings if settings else {},
                resource_name="SharePoint Settings",
                resource_id="sharepointSettings",
            )
            report.status = "PASS"
            report.status_extended = "Microsoft 365 SharePoint does not allow access to apps that don't use modern authentication."

            # Legacy Auth being True means that SharePoint allow access to apps that do NOT use modern authentication
            if settings.legacyAuth:
                report.status = "FAIL"
                report.status_extended = "Microsoft 365 SharePoint allows access to apps that don't use modern authentication."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: sharepoint_onedrive_sync_restricted_unmanaged_devices.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/sharepoint/sharepoint_onedrive_sync_restricted_unmanaged_devices/sharepoint_onedrive_sync_restricted_unmanaged_devices.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "sharepoint_onedrive_sync_restricted_unmanaged_devices",
  "CheckTitle": "Ensure OneDrive sync is restricted for unmanaged devices.",
  "CheckType": [],
  "ServiceName": "sharepoint",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "Sharepoint Settings",
  "Description": "Microsoft OneDrive allows users to sign in their cloud tenant account and begin syncing select folders or the entire contents of OneDrive to a local computer. By default, this includes any computer with OneDrive already installed, whether it is Entra Joined, Entra Hybrid Joined or Active Directory Domain joined. The recommended state for this setting is Allow syncing only on computers joined to specific domains Enabled: Specify the AD domain GUID(s).",
  "Risk": "Unmanaged devices can pose a security risk by allowing users to sync sensitive data to unauthorized devices, potentially leading to data leakage or unauthorized access.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/graph/api/resources/sharepoint?view=graph-rest-1.0",
  "Remediation": {
    "Code": {
      "CLI": "Set-SPOTenantSyncClientRestriction -Enable -DomainGuids '<domain_guid_1>; <domain_guid_2>; ...'",
      "NativeIaC": "",
      "Other": "1. Navigate to SharePoint admin center https://admin.microsoft.com/sharepoint 2. Click Settings then select OneDrive - Sync. 3. Check the Allow syncing only on computers joined to specific domains. 4. Use the Get-ADDomain PowerShell command on the on-premises server to obtain the GUID for each on-premises domain. 5. Click Save.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict OneDrive sync to managed devices to prevent unauthorized access to sensitive data.",
      "Url": "https://learn.microsoft.com/en-us/sharepoint/allow-syncing-only-on-specific-domains"
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

---[FILE: sharepoint_onedrive_sync_restricted_unmanaged_devices.py]---
Location: prowler-master/prowler/providers/m365/services/sharepoint/sharepoint_onedrive_sync_restricted_unmanaged_devices/sharepoint_onedrive_sync_restricted_unmanaged_devices.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.sharepoint.sharepoint_client import (
    sharepoint_client,
)


class sharepoint_onedrive_sync_restricted_unmanaged_devices(Check):
    """
    Check if OneDrive sync is restricted for unmanaged devices.

    This check verifies that OneDrive sync is restricted to managed devices only.
    Unmanaged devices can pose a security risk by allowing users to sync sensitive data to unauthorized devices,
    potentially leading to data leakage or unauthorized access.

    The check fails if OneDrive sync is not restricted to managed devices (AllowedDomainGuidsForSyncApp is empty).
    """

    def execute(self) -> List[CheckReportM365]:
        """
        Execute the OneDrive sync restriction check.

        Retrieves the OneDrive sync settings from the Microsoft 365 SharePoint client and
        generates a report indicating whether OneDrive sync is restricted to managed devices only.

        Returns:
            List[CheckReportM365]: A list containing the report object with the result of the check.
        """
        findings = []
        settings = sharepoint_client.settings
        if settings:
            report = CheckReportM365(
                self.metadata(),
                resource=settings if settings else {},
                resource_name="SharePoint Settings",
                resource_id="sharepointSettings",
            )
            report.status = "PASS"
            report.status_extended = "Microsoft 365 SharePoint does not allow OneDrive sync to unmanaged devices."

            if len(settings.allowedDomainGuidsForSyncApp) == 0:
                report.status = "FAIL"
                report.status_extended = "Microsoft 365 SharePoint allows OneDrive sync to unmanaged devices."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: teams_client.py]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_client.py

```python
from prowler.providers.common.provider import Provider
from prowler.providers.m365.services.teams.teams_service import Teams

teams_client = Teams(Provider.get_global_provider())
```

--------------------------------------------------------------------------------

---[FILE: teams_service.py]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_service.py
Signals: Pydantic

```python
from pydantic.v1 import BaseModel

from prowler.lib.logger import logger
from prowler.providers.m365.lib.service.service import M365Service
from prowler.providers.m365.m365_provider import M365Provider


class Teams(M365Service):
    def __init__(self, provider: M365Provider):
        super().__init__(provider)
        self.teams_settings = None
        self.global_meeting_policy = None
        self.global_messaging_policy = None
        self.user_settings = None

        if self.powershell:
            if self.powershell.connect_microsoft_teams():
                self.teams_settings = self._get_teams_client_configuration()
                self.global_meeting_policy = self._get_global_meeting_policy()
                self.global_messaging_policy = self._get_global_messaging_policy()
                self.user_settings = self._get_user_settings()
            self.powershell.close()

    def _get_teams_client_configuration(self):
        logger.info("M365 - Getting Teams settings...")
        teams_settings = None
        try:
            settings = self.powershell.get_teams_settings()
            if settings:
                teams_settings = TeamsSettings(
                    cloud_storage_settings=CloudStorageSettings(
                        allow_box=settings.get("AllowBox", True),
                        allow_drop_box=settings.get("AllowDropBox", True),
                        allow_egnyte=settings.get("AllowEgnyte", True),
                        allow_google_drive=settings.get("AllowGoogleDrive", True),
                        allow_share_file=settings.get("AllowShareFile", True),
                    ),
                    allow_email_into_channel=settings.get(
                        "AllowEmailIntoChannel", True
                    ),
                )

        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return teams_settings

    def _get_global_meeting_policy(self):
        logger.info("M365 - Getting Teams global (org-wide default) meeting policy...")
        global_meeting_policy = None
        try:
            global_meeting_policy = self.powershell.get_global_meeting_policy()
            if global_meeting_policy:
                global_meeting_policy = GlobalMeetingPolicy(
                    allow_anonymous_users_to_join_meeting=global_meeting_policy.get(
                        "AllowAnonymousUsersToJoinMeeting", True
                    ),
                    allow_anonymous_users_to_start_meeting=global_meeting_policy.get(
                        "AllowAnonymousUsersToStartMeeting", True
                    ),
                    allow_external_participant_give_request_control=global_meeting_policy.get(
                        "AllowExternalParticipantGiveRequestControl", True
                    ),
                    allow_external_users_to_bypass_lobby=global_meeting_policy.get(
                        "AutoAdmittedUsers", "Everyone"
                    ),
                    allow_pstn_users_to_bypass_lobby=global_meeting_policy.get(
                        "AllowPSTNUsersToBypassLobby", True
                    ),
                    allow_external_non_trusted_meeting_chat=global_meeting_policy.get(
                        "AllowExternalNonTrustedMeetingChat", True
                    ),
                    allow_cloud_recording=global_meeting_policy.get(
                        "AllowCloudRecording", True
                    ),
                    designated_presenter_role_mode=global_meeting_policy.get(
                        "DesignatedPresenterRoleMode", "EveryoneUserOverride"
                    ),
                    allow_security_end_user_reporting=global_meeting_policy.get(
                        "AllowSecurityEndUserReporting", False
                    ),
                    meeting_chat_enabled_type=global_meeting_policy.get(
                        "MeetingChatEnabledType", "EnabledForEveryone"
                    ),
                )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return global_meeting_policy

    def _get_global_messaging_policy(self):
        logger.info("M365 - Getting Teams global messaging policy...")
        global_messaging_policy = None
        try:
            global_messaging_policy = self.powershell.get_global_messaging_policy()
            if global_messaging_policy:
                global_messaging_policy = GlobalMessagingPolicy(
                    allow_security_end_user_reporting=global_messaging_policy.get(
                        "AllowSecurityEndUserReporting", False
                    ),
                )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return global_messaging_policy

    def _get_user_settings(self):
        logger.info("M365 - Getting Teams user settings...")
        user_settings = None
        try:
            settings = self.powershell.get_user_settings()
            if settings:
                user_settings = UserSettings(
                    allow_external_access=settings.get("AllowFederatedUsers", True),
                    allow_teams_consumer=settings.get("AllowTeamsConsumer", True),
                    allow_teams_consumer_inbound=settings.get(
                        "AllowTeamsConsumerInbound", True
                    ),
                )
        except Exception as error:
            logger.error(
                f"{error.__class__.__name__}[{error.__traceback__.tb_lineno}]: {error}"
            )
        return user_settings


class CloudStorageSettings(BaseModel):
    allow_box: bool
    allow_drop_box: bool
    allow_egnyte: bool
    allow_google_drive: bool
    allow_share_file: bool


class TeamsSettings(BaseModel):
    cloud_storage_settings: CloudStorageSettings
    allow_email_into_channel: bool = True


class GlobalMeetingPolicy(BaseModel):
    allow_anonymous_users_to_join_meeting: bool = True
    allow_anonymous_users_to_start_meeting: bool = True
    allow_external_participant_give_request_control: bool = True
    allow_external_non_trusted_meeting_chat: bool = True
    allow_cloud_recording: bool = True
    designated_presenter_role_mode: str = "EveryoneUserOverride"
    allow_external_users_to_bypass_lobby: str = "Everyone"
    allow_pstn_users_to_bypass_lobby: bool = True
    meeting_chat_enabled_type: str = "EnabledForEveryone"


class GlobalMessagingPolicy(BaseModel):
    allow_security_end_user_reporting: bool = False


class UserSettings(BaseModel):
    allow_external_access: bool = True
    allow_teams_consumer: bool = True
    allow_teams_consumer_inbound: bool = True
```

--------------------------------------------------------------------------------

---[FILE: teams_email_sending_to_channel_disabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_email_sending_to_channel_disabled/teams_email_sending_to_channel_disabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "teams_email_sending_to_channel_disabled",
  "CheckTitle": "Ensure users are not be able to email the channel directly.",
  "CheckType": [],
  "ServiceName": "teams",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Teams Settings",
  "Description": "Ensure users can not send emails to channel email addresses.",
  "Risk": "Allowing users to send emails to Teams channel email addresses introduces a security risk, as these addresses are outside the tenant’s domain and lack proper security controls. This creates a potential attack vector where threat actors could exploit the channel email to deliver malicious content or spam.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/powershell/module/teams/get-csteamsclientconfiguration?view=teams-ps",
  "Remediation": {
    "Code": {
      "CLI": "Set-CsTeamsClientConfiguration -Identity Global -AllowEmailIntoChannel $false",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft Teams admin center https://admin.teams.microsoft.com. 2. Click to expand Teams select Teams settings. 3. Under email integration set Users can send emails to a channel email address to Off.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Disable the ability for users to send emails to Teams channel email addresses to reduce the risk of external abuse and enhance control over organizational communications.",
      "Url": "https://learn.microsoft.com/en-us/powershell/module/teams/get-csteamsclientconfiguration?view=teams-ps"
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

---[FILE: teams_email_sending_to_channel_disabled.py]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_email_sending_to_channel_disabled/teams_email_sending_to_channel_disabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.teams.teams_client import teams_client


class teams_email_sending_to_channel_disabled(Check):
    """Check if users can send emails to channel email addresses.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """Execute the check for

        This method checks if users can send emails to channel email addresses.

        Returns:
            List[CheckReportM365]: A list of reports containing the result of the check.
        """
        findings = []
        teams_settings = teams_client.teams_settings
        if teams_settings:
            report = CheckReportM365(
                metadata=self.metadata(),
                resource=teams_settings if teams_settings else {},
                resource_name="Teams Settings",
                resource_id="teamsSettings",
            )
            report.status = "FAIL"
            report.status_extended = (
                "Teams users can send emails to channel email addresses."
            )

            if teams_settings and not teams_settings.allow_email_into_channel:
                report.status = "PASS"
                report.status_extended = (
                    "Teams users cannot send emails to channel email addresses."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: teams_external_domains_restricted.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_external_domains_restricted/teams_external_domains_restricted.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "teams_external_domains_restricted",
  "CheckTitle": "Ensure external domains are restricted.",
  "CheckType": [],
  "ServiceName": "teams",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Teams Settings",
  "Description": "Ensure external domains are restricted from being used in Teams admin center.",
  "Risk": "Allowing unrestricted communication with external domains in Microsoft Teams increases the risk of exposure to social engineering attacks, phishing, malware delivery (e.g., DarkGate), and exploitation tactics such as GIFShell or username enumeration.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/powershell/module/teams/set-cstenantfederationconfiguration?view=teams-ps",
  "Remediation": {
    "Code": {
      "CLI": "Set-CsTenantFederationConfiguration -AllowFederatedUsers $false",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft Teams admin center https://admin.teams.microsoft.com/. 2. Click to expand Users select External access. 3. Under Teams and Skype for Business users in external organizations set Choose which external domains your users have access to to one of the following: Allow only specific external domains or Block all external domains. 4. Click Save.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict external collaboration by configuring Teams to either Block all external domains or Allow only specific, trusted external domains. This ensures users can only interact with vetted organizations, significantly reducing the attack surface.",
      "Url": "https://learn.microsoft.com/en-us/powershell/module/teams/set-cstenantfederationconfiguration?view=teams-ps"
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

---[FILE: teams_external_domains_restricted.py]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_external_domains_restricted/teams_external_domains_restricted.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.teams.teams_client import teams_client


class teams_external_domains_restricted(Check):
    """Check if external domains are restricted from being used in Teams admin center.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """Execute the check for

        This method checks if external domains are restricted from being used in Teams admin center.

        Returns:
            List[CheckReportM365]: A list of reports containing the result of the check.
        """
        findings = []
        user_settings = teams_client.user_settings
        if user_settings:
            report = CheckReportM365(
                metadata=self.metadata(),
                resource=user_settings if user_settings else {},
                resource_name="Teams User Settings",
                resource_id="userSettings",
            )
            report.status = "FAIL"
            report.status_extended = "Users can access external domains."

            if user_settings and not user_settings.allow_external_access:
                report.status = "PASS"
                report.status_extended = "Users can not access external domains."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: teams_external_file_sharing_restricted.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_external_file_sharing_restricted/teams_external_file_sharing_restricted.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "teams_external_file_sharing_restricted",
  "CheckTitle": "Ensure external file sharing in Teams is enabled for only approved cloud storage services",
  "CheckType": [],
  "ServiceName": "teams",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Teams Settings",
  "Description": "",
  "Risk": "Allowing unrestricted third-party cloud storage services in Teams increases the risk of data exfiltration, compliance violations, and unauthorized access to sensitive information. Users may store or share data through unapproved platforms with weaker security controls.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/powershell/module/teams/get-csteamsclientconfiguration?view=teams-ps",
  "Remediation": {
    "Code": {
      "CLI": "Set-CsTeamsClientConfiguration -AllowGoogleDrive $false -AllowShareFile $false -AllowBox $false -AllowDropBox $false -AllowEgnyte $false",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft Teams admin center https://admin.teams.microsoft.com. 2. Click to expand Teams select Teams settings. 3. Set any unauthorized providers to Off.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict external file sharing in Teams to only approved cloud storage providers, such as SharePoint Online and OneDrive. Configure Teams policies to block unauthorized services and enforce compliance with organizational data protection standards.",
      "Url": "https://learn.microsoft.com/en-us/powershell/module/teams/get-csteamsclientconfiguration?view=teams-ps"
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

---[FILE: teams_external_file_sharing_restricted.py]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_external_file_sharing_restricted/teams_external_file_sharing_restricted.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.teams.teams_client import teams_client
from prowler.providers.m365.services.teams.teams_service import CloudStorageSettings


class teams_external_file_sharing_restricted(Check):
    """Check if external file sharing is restricted in Teams.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """Execute the check for external file sharing settings in Teams.

        This method checks if external file sharing is restricted in Teams. If external file sharing
        is restricted to only approved cloud storage services the check passes; otherwise, it fails.

        Returns:
            List[CheckReportM365]: A list of reports containing the result of the check.
        """
        findings = []
        if teams_client.teams_settings:
            cloud_storage_settings = teams_client.teams_settings.cloud_storage_settings
            report = CheckReportM365(
                metadata=self.metadata(),
                resource=cloud_storage_settings if cloud_storage_settings else {},
                resource_name="Cloud Storage Settings",
                resource_id="cloudStorageSettings",
            )
            report.status = "FAIL"
            report.status_extended = "External file sharing is not restricted to only approved cloud storage services."

            allowed_services = teams_client.audit_config.get(
                "allowed_cloud_storage_services", []
            )
            if cloud_storage_settings:
                # Get storage services from CloudStorageSettings class items
                storage_services = [
                    attr
                    for attr, type in CloudStorageSettings.__annotations__.items()
                    if type is bool
                ]

                # Check if all services are disabled when no allowed services are specified
                # or if all enabled services are in the allowed list
                if (
                    not allowed_services
                    and all(
                        not getattr(cloud_storage_settings, service, True)
                        for service in storage_services
                    )
                ) or (
                    allowed_services
                    and not any(
                        getattr(cloud_storage_settings, service, True)
                        and service not in allowed_services
                        for service in storage_services
                    )
                ):
                    report.status = "PASS"
                    report.status_extended = "External file sharing is restricted to only approved cloud storage services."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: teams_external_users_cannot_start_conversations.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_external_users_cannot_start_conversations/teams_external_users_cannot_start_conversations.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "teams_external_users_cannot_start_conversations",
  "CheckTitle": "Ensure external users cannot start conversations.",
  "CheckType": [],
  "ServiceName": "teams",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "Teams Settings",
  "Description": "Ensure external users cannot initiate conversations.",
  "Risk": "Allowing unmanaged external Teams users to initiate conversations increases the risk of phishing, malware distribution such as DarkGate, social engineering attacks like those by Midnight Blizzard, GIFShell exploitation, and username enumeration.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/powershell/module/teams/set-cstenantfederationconfiguration?view=teams-ps",
  "Remediation": {
    "Code": {
      "CLI": "Set-CsTenantFederationConfiguration -AllowTeamsConsumerInbound $false",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft Teams admin center https://admin.teams.microsoft.com/. 2. Click to expand Users select External access. 3. Scroll to Teams accounts not managed by an organization. 4. Uncheck External users with Teams accounts not managed by an organization can contact users in my organization. 5. Click Save.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Disable the ability for external Teams users not managed by an organization to initiate conversations by unchecking the option that permits them to contact users in your organization. This provides an added layer of protection, especially if exceptions are made to allow limited communication with unmanaged users.",
      "Url": "https://learn.microsoft.com/en-us/powershell/module/teams/set-cstenantfederationconfiguration?view=teams-ps"
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

---[FILE: teams_external_users_cannot_start_conversations.py]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_external_users_cannot_start_conversations/teams_external_users_cannot_start_conversations.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.teams.teams_client import teams_client


class teams_external_users_cannot_start_conversations(Check):
    """Check if external users cannot start conversations.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """Execute the check for external users cannot start conversations.

        This method checks if external users cannot start conversations.

        Returns:
            List[CheckReportM365]: A list of reports containing the result of the check.
        """
        findings = []
        user_settings = teams_client.user_settings
        if user_settings:
            report = CheckReportM365(
                metadata=self.metadata(),
                resource=user_settings if user_settings else {},
                resource_name="Teams User Settings",
                resource_id="userSettings",
            )
            report.status = "FAIL"
            report.status_extended = "External Teams users can initiate conversations."

            if user_settings and not user_settings.allow_teams_consumer_inbound:
                report.status = "PASS"
                report.status_extended = (
                    "External Teams users cannot initiate conversations."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: teams_meeting_anonymous_user_join_disabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_meeting_anonymous_user_join_disabled/teams_meeting_anonymous_user_join_disabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "teams_meeting_anonymous_user_join_disabled",
  "CheckTitle": "Ensure anonymous users are not able to join meetings.",
  "CheckType": [],
  "ServiceName": "teams",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "Teams Global Meeting Policy",
  "Description": "Ensure individuals who are not sent or forwarded a meeting invite will not be able to join the meeting automatically.",
  "Risk": "Allowing anonymous users to join meetings can lead to unauthorized access, information leakage, and potential disruptions, especially in meetings involving sensitive data.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/powershell/module/teams/set-csteamsmeetingpolicy?view=teams-ps",
  "Remediation": {
    "Code": {
      "CLI": "Set-CsTeamsMeetingPolicy -Identity Global -AllowAnonymousUsersToJoinMeeting $false",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft Teams admin center https://admin.teams.microsoft.com. 2. Click to expand Meetings select Meeting policies. 3. Click Global (Org-wide default). 4. Under meeting join & lobby set Anonymous users can join a meeting to Off.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Disable anonymous user access to Microsoft Teams meetings to ensure only invited participants can join. This adds a layer of vetting by requiring organizer approval for anyone not explicitly invited.",
      "Url": "https://learn.microsoft.com/en-us/powershell/module/teams/set-csteamsmeetingpolicy?view=teams-ps"
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

---[FILE: teams_meeting_anonymous_user_join_disabled.py]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_meeting_anonymous_user_join_disabled/teams_meeting_anonymous_user_join_disabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.teams.teams_client import teams_client


class teams_meeting_anonymous_user_join_disabled(Check):
    """Check if anonymous users are not able to join meetings.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """Execute the check for anonymous users are not able to join meetings.

        This method checks if anonymous users are not able to join meetings.

        Returns:
            List[CheckReportM365]: A list of reports containing the result of the check.
        """
        findings = []
        global_meeting_policy = teams_client.global_meeting_policy
        if global_meeting_policy:
            report = CheckReportM365(
                metadata=self.metadata(),
                resource=global_meeting_policy if global_meeting_policy else {},
                resource_name="Teams Meetings Global (Org-wide default) Policy",
                resource_id="teamsMeetingsGlobalPolicy",
            )
            report.status = "FAIL"
            report.status_extended = "Anonymous Teams users can join meetings."

            if not global_meeting_policy.allow_anonymous_users_to_join_meeting:
                report.status = "PASS"
                report.status_extended = "Anonymous Teams users can not join meetings."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

````
