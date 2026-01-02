---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 393
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 393 of 867)

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

---[FILE: teams_meeting_anonymous_user_start_disabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_meeting_anonymous_user_start_disabled/teams_meeting_anonymous_user_start_disabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "teams_meeting_anonymous_user_start_disabled",
  "CheckTitle": "Ensure anonymous users are not able to start meetings.",
  "CheckType": [],
  "ServiceName": "teams",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "Teams Global Meeting Policy",
  "Description": "Ensure anonymous users and dial-in callers are not able to start meetings.",
  "Risk": "Allowing anonymous users and dial-in callers to start meetings without an authenticated participant present can lead to meeting spamming, unauthorized activity, and potential misuse of organizational resources.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/powershell/module/teams/set-csteamsmeetingpolicy?view=teams-ps",
  "Remediation": {
    "Code": {
      "CLI": "Set-CsTeamsMeetingPolicy -Identity Global -AllowAnonymousUsersToStartMeeting $false",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft Teams admin center https://admin.teams.microsoft.com. 2. Click to expand Meetings select Meeting policies. 3. Click Global (Org-wide default). 4. Under meeting join & lobby set Anonymous users and dial-in callers can start a meeting to Off.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that anonymous users and dial-in callers are required to wait in the lobby until a verified user from the organization or a trusted external domain starts the meeting. This reduces the risk of abuse and maintains meeting integrity.",
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

---[FILE: teams_meeting_anonymous_user_start_disabled.py]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_meeting_anonymous_user_start_disabled/teams_meeting_anonymous_user_start_disabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.teams.teams_client import teams_client


class teams_meeting_anonymous_user_start_disabled(Check):
    """Check if anonymous users are not able to start meetings.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """Execute the check for anonymous users are not able to start meetings.

        This method checks if anonymous users and dial-in callers are not able to start meetings.

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
            report.status_extended = "Anonymous Teams users can start meetings."

            if not global_meeting_policy.allow_anonymous_users_to_start_meeting:
                report.status = "PASS"
                report.status_extended = "Anonymous Teams users can not start meetings."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: teams_meeting_chat_anonymous_users_disabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_meeting_chat_anonymous_users_disabled/teams_meeting_chat_anonymous_users_disabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "teams_meeting_chat_anonymous_users_disabled",
  "CheckTitle": "Ensure meeting chat does not allow anonymous users",
  "CheckType": [],
  "ServiceName": "teams",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "Teams Global Meeting Policy",
  "Description": "Ensure meeting chat does not allow anonymous users.",
  "Risk": "Allowing anonymous users to participate in meeting chat can expose sensitive information and increase the risk of inappropriate content being shared by unverified participants.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/powershell/module/teams/set-csteamsmeetingpolicy?view=teams-ps",
  "Remediation": {
    "Code": {
      "CLI": "Set-CsTeamsMeetingPolicy -Identity Global -MeetingChatEnabledType 'EnabledExceptAnonymous'",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft Teams admin center https://admin.teams.microsoft.com. 2. Click to expand Meetings select Meeting policies. 3. Click Global (Org-wide default). 4. Under meeting engagement verify that Meeting chat is set to On for everyone but anonymous users.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict chat access during meetings to only authenticated and authorized users. Disable chat capabilities for anonymous users to maintain confidentiality and prevent misuse.",
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

---[FILE: teams_meeting_chat_anonymous_users_disabled.py]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_meeting_chat_anonymous_users_disabled/teams_meeting_chat_anonymous_users_disabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.teams.teams_client import teams_client


class teams_meeting_chat_anonymous_users_disabled(Check):
    """Check if meeting chat does not allow anonymous users.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """Execute the check for meeting chat does not allow anonymous users.

        This method checks if meeting chat does not allow anonymous users.

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
            report.status_extended = "Meeting chat allows anonymous users."

            allowed_meeting_chat_settings = {
                "EnabledExceptAnonymous",
                "EnabledInMeetingOnlyForAllExceptAnonymous",
            }

            if (
                global_meeting_policy.meeting_chat_enabled_type
                in allowed_meeting_chat_settings
            ):
                report.status = "PASS"
                report.status_extended = "Meeting chat does not allow anonymous users."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: teams_meeting_dial_in_lobby_bypass_disabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_meeting_dial_in_lobby_bypass_disabled/teams_meeting_dial_in_lobby_bypass_disabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "teams_meeting_dial_in_lobby_bypass_disabled",
  "CheckTitle": "Ensure that dial-in users cannot bypass the lobby in Teams meetings",
  "CheckType": [],
  "ServiceName": "teams",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "Teams Global Meeting Policy",
  "Description": "Ensure that dial-in users cannot bypass the lobby in Teams meetings",
  "Risk": "Allowing dial-in users to bypass the lobby may result in unauthorized or unauthenticated individuals joining sensitive meetings without prior validation, increasing the risk of information leakage or meeting disruptions.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/powershell/module/teams/set-csteamsmeetingpolicy?view=teams-ps",
  "Remediation": {
    "Code": {
      "CLI": "Set-CsTeamsMeetingPolicy -Identity Global -AllowPSTNUsersToBypassLobby $false",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft Teams admin center https://admin.teams.microsoft.com. 2. Click to expand Meetings select Meeting policies. 3. Click Global (Org-wide default). 4. Under meeting join & lobby set People dialing in can bypass the lobby to Off.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Require all users dialing in by phone to wait in the lobby until admitted by the meeting organizer, co-organizer, or presenter. This ensures proper vetting before granting access to potentially sensitive discussions.",
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

---[FILE: teams_meeting_dial_in_lobby_bypass_disabled.py]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_meeting_dial_in_lobby_bypass_disabled/teams_meeting_dial_in_lobby_bypass_disabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.teams.teams_client import teams_client


class teams_meeting_dial_in_lobby_bypass_disabled(Check):
    """Check if users dialing in can't bypass the lobby.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """Execute the check for users dialing in can't bypass the lobby.

        This method checks if users dialing in can't bypass the lobby.

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
            report.status_extended = "Dial-in users can bypass the lobby."

            if not global_meeting_policy.allow_pstn_users_to_bypass_lobby:
                report.status = "PASS"
                report.status_extended = "Dial-in users cannot bypass the lobby."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: teams_meeting_external_chat_disabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_meeting_external_chat_disabled/teams_meeting_external_chat_disabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "teams_meeting_external_chat_disabled",
  "CheckTitle": "Ensure external meeting chat is off",
  "CheckType": [],
  "ServiceName": "teams",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Teams Global Meeting Policy",
  "Description": "Ensure users can't read or write messages in external meeting chats with untrusted organizations.",
  "Risk": "Allowing chat in external meetings increases the risk of exploits like GIFShell or DarkGate malware being delivered to users through untrusted organizations.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/powershell/module/teams/set-csteamsmeetingpolicy?view=teams-ps",
  "Remediation": {
    "Code": {
      "CLI": "Set-CsTeamsMeetingPolicy -Identity Global -AllowExternalNonTrustedMeetingChat $false",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft Teams admin center https://admin.teams.microsoft.com. 2. Click to expand Meetings select Meeting policies. 3. Click Global (Org-wide default). 4. Under meeting engagement set External meeting chat to Off.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Disable external meeting chat to prevent potential security risks from untrusted organizations. This helps protect against exploits like GIFShell or DarkGate malware.",
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

---[FILE: teams_meeting_external_chat_disabled.py]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_meeting_external_chat_disabled/teams_meeting_external_chat_disabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.teams.teams_client import teams_client


class teams_meeting_external_chat_disabled(Check):
    """Check if external meeting chat is disabled.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """Execute the check for external meeting chat settings.

        This method checks if external meeting chat is disabled for untrusted organizations.

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
            report.status_extended = (
                "External meeting chat is enabled for untrusted organizations."
            )

            if not global_meeting_policy.allow_external_non_trusted_meeting_chat:
                report.status = "PASS"
                report.status_extended = (
                    "External meeting chat is disabled for untrusted organizations."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: teams_meeting_external_control_disabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_meeting_external_control_disabled/teams_meeting_external_control_disabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "teams_meeting_external_control_disabled",
  "CheckTitle": "Ensure external participants can't give or request control",
  "CheckType": [],
  "ServiceName": "teams",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Teams Global Meeting Policy",
  "Description": "Ensure external participants can't give or request control in Teams meetings.",
  "Risk": "Allowing external participants to give or request control during meetings could lead to unauthorized content sharing or malicious actions by external users.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/powershell/module/teams/set-csteamsmeetingpolicy?view=teams-ps",
  "Remediation": {
    "Code": {
      "CLI": "Set-CsTeamsMeetingPolicy -Identity Global -AllowExternalParticipantGiveRequestControl $false",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft Teams admin center https://admin.teams.microsoft.com. 2. Click to expand Meetings select Meeting policies. 3. Click Global (Org-wide default). 4. Under content sharing set External participants can give or request control to Off.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Disable the ability for external participants to give or request control during Teams meetings to prevent unauthorized content sharing and maintain meeting security.",
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

---[FILE: teams_meeting_external_control_disabled.py]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_meeting_external_control_disabled/teams_meeting_external_control_disabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.teams.teams_client import teams_client


class teams_meeting_external_control_disabled(Check):
    """Check if external participants can't give or request control in meetings.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """Execute the check for external participants' control permissions in meetings.

        This method checks if external participants are prevented from giving or requesting control in meetings.

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
            report.status_extended = (
                "External participants can give or request control."
            )

            if (
                not global_meeting_policy.allow_external_participant_give_request_control
            ):
                report.status = "PASS"
                report.status_extended = (
                    "External participants cannot give or request control."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: teams_meeting_external_lobby_bypass_disabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_meeting_external_lobby_bypass_disabled/teams_meeting_external_lobby_bypass_disabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "teams_meeting_external_lobby_bypass_disabled",
  "CheckTitle": "Ensure only people in the organization can bypass the lobby.",
  "CheckType": [],
  "ServiceName": "teams",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "Teams Global Meeting Policy",
  "Description": "Ensure only people in the organization can bypass the lobby.",
  "Risk": "Allowing external users or unauthenticated participants to bypass the lobby increases the risk of unauthorized access to sensitive meetings and potential disruptions. It may also lead to unscheduled meetings being initiated by external parties.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/powershell/module/teams/set-csteamsmeetingpolicy?view=teams-ps",
  "Remediation": {
    "Code": {
      "CLI": "Set-CsTeamsMeetingPolicy -Identity Global -AutoAdmittedUsers 'EveryoneInCompanyExcludingGuests' ",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft Teams admin center https://admin.teams.microsoft.com. 2. Click to expand Meetings select Meeting policies. 3. Click Global (Org-wide default). 4. Under meeting join & lobby set Who can bypass the lobby to People in my org.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Ensure that only people within the organization can bypass the lobby, requiring external users and dial-in participants to wait for approval from an organizer, co-organizer, or presenter. This helps secure sensitive meetings and prevents unauthorized access.",
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

---[FILE: teams_meeting_external_lobby_bypass_disabled.py]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_meeting_external_lobby_bypass_disabled/teams_meeting_external_lobby_bypass_disabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.teams.teams_client import teams_client


class teams_meeting_external_lobby_bypass_disabled(Check):
    """Check if only people in the organization can bypass the lobby.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """Execute the check for only people in the organization can bypass the lobby.

        This method checks if only people in the organization can bypass the lobby.

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
            report.status_extended = (
                "People outside the organization can bypass the lobby."
            )

            allowed_bypass_settings = {
                "EveryoneInCompanyExcludingGuests",
                "OrganizerOnly",
                "InvitedUsers",
            }
            if (
                global_meeting_policy.allow_external_users_to_bypass_lobby
                in allowed_bypass_settings
            ):
                report.status = "PASS"
                report.status_extended = (
                    "Only people in the organization can bypass the lobby."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: teams_meeting_presenters_restricted.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_meeting_presenters_restricted/teams_meeting_presenters_restricted.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "teams_meeting_presenters_restricted",
  "CheckTitle": "Ensure only organizers and co-organizers can present",
  "CheckType": [],
  "ServiceName": "teams",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Teams Global Meeting Policy",
  "Description": "Ensure only organizers and co-organizers can present in a Teams meeting. The recommended state is 'Only organizers and co-organizers'.",
  "Risk": "Allowing everyone to present increases the risk that a malicious user can inadvertently show inappropriate content.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/microsoftteams/meeting-who-present-request-control",
  "Remediation": {
    "Code": {
      "CLI": "Set-CsTeamsMeetingPolicy -Identity Global -DesignatedPresenterRoleMode \"OrganizerOnlyUserOverride\"",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft Teams admin center https://admin.teams.microsoft.com. 2. Click to expand Meetings select Meeting policies. 3. Click Global (Org-wide default). 4. Under content sharing set Who can present to Only organizers and co-organizers.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Restrict presentation capabilities to only organizers and co-organizers to reduce the risk of inappropriate content being shown.",
      "Url": "https://learn.microsoft.com/en-us/microsoftteams/meeting-who-present-request-control"
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

---[FILE: teams_meeting_presenters_restricted.py]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_meeting_presenters_restricted/teams_meeting_presenters_restricted.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.teams.teams_client import teams_client


class teams_meeting_presenters_restricted(Check):
    """Check if only organizers and co-organizers can present.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """Execute the check for meeting presenter settings.

        This method checks if only organizers and co-organizers can present.

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
            report.status_extended = (
                "Not only organizers and co-organizers can present."
            )

            if (
                global_meeting_policy.designated_presenter_role_mode
                == "OrganizerOnlyUserOverride"
            ):
                report.status = "PASS"
                report.status_extended = (
                    "Only organizers and co-organizers can present."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: teams_meeting_recording_disabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_meeting_recording_disabled/teams_meeting_recording_disabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "teams_meeting_recording_disabled",
  "CheckTitle": "Ensure meeting recording is disabled by default",
  "CheckType": [],
  "ServiceName": "teams",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "high",
  "ResourceType": "Teams Global Meeting Policy",
  "Description": "Ensures that only authorized users, such as organizers, co-organizers, and leads, can initiate a recording.",
  "Risk": "Allowing meeting recordings by default increases the risk of unauthorized individuals capturing and potentially sharing sensitive meeting content.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/powershell/module/teams/set-csteamsmeetingpolicy?view=teams-ps",
  "Remediation": {
    "Code": {
      "CLI": "Set-CsTeamsMeetingPolicy -Identity Global -AllowCloudRecording $false",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft Teams admin center https://admin.teams.microsoft.com. 2. Click to expand Meetings select Meeting policies. 3. Click Global (Org-wide default). 4. Under Recording & transcription set Meeting recording to Off.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Disable meeting recording in the Global meeting policy to ensure only authorized users can initiate recordings. Create separate policies for users or groups who need recording capabilities.",
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

---[FILE: teams_meeting_recording_disabled.py]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_meeting_recording_disabled/teams_meeting_recording_disabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.teams.teams_client import teams_client


class teams_meeting_recording_disabled(Check):
    """Check if meeting recording is disabled by default.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """Execute the check for meeting recording settings.

        This method checks if meeting recording is disabled in the Global meeting policy.

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
            report.status_extended = "Meeting recording is enabled by default."

            if not global_meeting_policy.allow_cloud_recording:
                report.status = "PASS"
                report.status_extended = "Meeting recording is disabled by default."

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: teams_security_reporting_enabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_security_reporting_enabled/teams_security_reporting_enabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "teams_security_reporting_enabled",
  "CheckTitle": "Ensure users can report security concerns in Teams",
  "CheckType": [],
  "ServiceName": "teams",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "medium",
  "ResourceType": "Teams Global Messaging Policy",
  "Description": "Ensure Teams user reporting settings allow a user to report a message as malicious for further analysis",
  "Risk": "Without proper security reporting enabled, users cannot effectively report suspicious or malicious messages, potentially allowing security threats to go unnoticed.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/defender-office-365/submissions-teams?view=o365-worldwide",
  "Remediation": {
    "Code": {
      "CLI": "Set-CsTeamsMessagingPolicy -Identity Global -AllowSecurityEndUserReporting $true",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft Teams admin center (https://admin.teams.microsoft.com). 2. Click to expand Messaging and select Messaging policies. 3. Click Global (Org-wide default). 4. Ensure Report a security concern is On.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Enable security reporting in Teams messaging policy.",
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

---[FILE: teams_security_reporting_enabled.py]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_security_reporting_enabled/teams_security_reporting_enabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.teams.teams_client import teams_client


class teams_security_reporting_enabled(Check):
    """Check if users can report security concerns in Teams.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """Execute the check for Teams security reporting settings.

        This method checks if security reporting is properly configured in Teams settings.

        Returns:
            List[CheckReportM365]: A list of reports containing the result of the check.
        """
        findings = []
        global_messaging_policy = teams_client.global_messaging_policy

        if global_messaging_policy:
            report = CheckReportM365(
                metadata=self.metadata(),
                resource=global_messaging_policy,
                resource_name="Teams Security Reporting Settings",
                resource_id="teamsSecurityReporting",
            )

            teams_reporting_enabled = (
                global_messaging_policy.allow_security_end_user_reporting
            )

            if teams_reporting_enabled:
                report.status = "PASS"
                report.status_extended = (
                    "Security reporting is enabled in Teams messaging policy."
                )
            else:
                report.status = "FAIL"
                report.status_extended = (
                    "Security reporting is not enabled in Teams messaging policy."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: teams_unmanaged_communication_disabled.metadata.json]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_unmanaged_communication_disabled/teams_unmanaged_communication_disabled.metadata.json

```json
{
  "Provider": "m365",
  "CheckID": "teams_unmanaged_communication_disabled",
  "CheckTitle": "Ensure unmanaged communication is disabled.",
  "CheckType": [],
  "ServiceName": "teams",
  "SubServiceName": "",
  "ResourceIdTemplate": "",
  "Severity": "critical",
  "ResourceType": "Teams Settings",
  "Description": "Ensure unmanaged communication is disabled in Teams admin center.",
  "Risk": "Allowing communication with unmanaged Microsoft Teams users increases the risk of targeted attacks such as phishing, malware distribution (e.g., DarkGate), and exploitation techniques like GIFShell and username enumeration. Unmanaged accounts are easier for threat actors to create and use as attack vectors.",
  "RelatedUrl": "https://learn.microsoft.com/en-us/powershell/module/teams/set-cstenantfederationconfiguration?view=teams-ps",
  "Remediation": {
    "Code": {
      "CLI": "Set-CsTenantFederationConfiguration -AllowTeamsConsumer $false",
      "NativeIaC": "",
      "Other": "1. Navigate to Microsoft Teams admin center https://admin.teams.microsoft.com/. 2. Click to expand Users select External access. 3. Scroll to Teams accounts not managed by an organization. 4. Set People in my organization can communicate with Teams users whose accounts aren't managed by an organization to Off. 5. Click Save.",
      "Terraform": ""
    },
    "Recommendation": {
      "Text": "Disable communication with Teams users whose accounts aren't managed by an organization by setting 'People in my organization can communicate with Teams users whose accounts aren't managed by an organization' to Off. This helps prevent unauthorized or risky external interactions.",
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

---[FILE: teams_unmanaged_communication_disabled.py]---
Location: prowler-master/prowler/providers/m365/services/teams/teams_unmanaged_communication_disabled/teams_unmanaged_communication_disabled.py

```python
from typing import List

from prowler.lib.check.models import Check, CheckReportM365
from prowler.providers.m365.services.teams.teams_client import teams_client


class teams_unmanaged_communication_disabled(Check):
    """Check if unmanaged communication is disabled in Teams admin center.

    Attributes:
        metadata: Metadata associated with the check (inherited from Check).
    """

    def execute(self) -> List[CheckReportM365]:
        """Execute the check for unmanaged communication disabled.

        This method checks if unmanaged communication is disabled in Teams admin center.

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
            report.status_extended = "Teams users can communicate with unmanaged users."

            if user_settings and not user_settings.allow_teams_consumer:
                report.status = "PASS"
                report.status_extended = (
                    "Teams users cannot communicate with unmanaged users."
                )

            findings.append(report)

        return findings
```

--------------------------------------------------------------------------------

---[FILE: config.py]---
Location: prowler-master/prowler/providers/mongodbatlas/config.py

```python
# Supported encryption providers
ATLAS_ENCRYPTION_PROVIDERS = ["AWS", "AZURE", "GCP", "NONE"]
```

--------------------------------------------------------------------------------

---[FILE: models.py]---
Location: prowler-master/prowler/providers/mongodbatlas/models.py
Signals: Pydantic

```python
from typing import List, Optional

from pydantic.v1 import BaseModel

from prowler.config.config import output_file_timestamp
from prowler.providers.common.models import ProviderOutputOptions


class MongoDBAtlasSession(BaseModel):
    """MongoDB Atlas session model"""

    public_key: str
    private_key: str
    base_url: str = "https://cloud.mongodb.com/api/atlas/v2"


class MongoDBAtlasIdentityInfo(BaseModel):
    """MongoDB Atlas identity information model"""

    organization_id: str
    organization_name: str
    roles: Optional[List[str]] = []


class MongoDBAtlasOutputOptions(ProviderOutputOptions):
    """MongoDB Atlas output options"""

    def __init__(self, arguments, bulk_checks_metadata, identity):
        super().__init__(arguments, bulk_checks_metadata)

        if (
            not hasattr(arguments, "output_filename")
            or arguments.output_filename is None
        ):
            self.output_filename = (
                f"prowler-output-{identity.organization_id}-{output_file_timestamp}"
            )
        else:
            self.output_filename = arguments.output_filename
```

--------------------------------------------------------------------------------

````
