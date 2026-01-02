---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 749
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 749 of 867)

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

---[FILE: teams_service_test.py]---
Location: prowler-master/tests/providers/m365/services/teams/teams_service_test.py

```python
from unittest import mock
from unittest.mock import patch

from prowler.providers.m365.models import M365IdentityInfo
from prowler.providers.m365.services.teams.teams_service import (
    CloudStorageSettings,
    GlobalMeetingPolicy,
    GlobalMessagingPolicy,
    Teams,
    TeamsSettings,
    UserSettings,
)
from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


def mock_get_teams_client_configuration(_):
    return TeamsSettings(
        cloud_storage_settings=CloudStorageSettings(
            allow_box=False,
            allow_drop_box=False,
            allow_egnyte=False,
            allow_google_drive=False,
            allow_share_file=False,
        )
    )


def mock_get_global_meeting_policy(_):
    return GlobalMeetingPolicy(
        allow_anonymous_users_to_join_meeting=False,
        allow_anonymous_users_to_start_meeting=False,
        allow_external_participant_give_request_control=False,
        allow_external_non_trusted_meeting_chat=False,
        allow_cloud_recording=False,
        designated_presenter_role_mode="EveryoneUserOverride",
        allow_external_users_to_bypass_lobby="EveryoneInCompanyExcludingGuests",
        allow_pstn_users_to_bypass_lobby=False,
        meeting_chat_enabled_type="EnabledExceptAnonymous",
    )


def mock_get_global_messaging_policy(_):
    return GlobalMessagingPolicy(allow_security_end_user_reporting=True)


def mock_get_user_settings(_):
    return UserSettings(
        allow_external_access=False,
        allow_teams_consumer=False,
        allow_teams_consumer_inbound=False,
    )


class Test_Teams_Service:
    def test_get_client(self):
        with (
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_microsoft_teams"
            ),
        ):
            teams_client = Teams(
                set_mocked_m365_provider(
                    identity=M365IdentityInfo(tenant_domain=DOMAIN)
                )
            )
            assert teams_client.client.__class__.__name__ == "GraphServiceClient"
            assert teams_client.powershell.__class__.__name__ == "M365PowerShell"
            teams_client.powershell.close()

    @patch(
        "prowler.providers.m365.services.teams.teams_service.Teams._get_teams_client_configuration",
        new=mock_get_teams_client_configuration,
    )
    def test_get_settings(self):
        with (
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_microsoft_teams"
            ),
        ):
            teams_client = Teams(
                set_mocked_m365_provider(
                    identity=M365IdentityInfo(tenant_domain=DOMAIN)
                )
            )
            assert teams_client.teams_settings == TeamsSettings(
                cloud_storage_settings=CloudStorageSettings(
                    allow_box=False,
                    allow_drop_box=False,
                    allow_egnyte=False,
                    allow_google_drive=False,
                    allow_share_file=False,
                ),
                allow_email_into_channel=True,
            )
            teams_client.powershell.close()

    @patch(
        "prowler.providers.m365.services.teams.teams_service.Teams._get_user_settings",
        new=mock_get_user_settings,
    )
    def test_get_user_settings(self):
        with (
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_microsoft_teams"
            ),
        ):
            teams_client = Teams(
                set_mocked_m365_provider(
                    identity=M365IdentityInfo(tenant_domain=DOMAIN)
                )
            )
            assert teams_client.user_settings == UserSettings(
                allow_external_access=False,
                allow_teams_consumer=False,
                allow_teams_consumer_inbound=False,
            )
            teams_client.powershell.close()

    @patch(
        "prowler.providers.m365.services.teams.teams_service.Teams._get_global_meeting_policy",
        new=mock_get_global_meeting_policy,
    )
    def test_get_global_meeting_policy(self):
        with (
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_microsoft_teams"
            ),
        ):
            teams_client = Teams(
                set_mocked_m365_provider(
                    identity=M365IdentityInfo(tenant_domain=DOMAIN)
                )
            )
            assert teams_client.global_meeting_policy == GlobalMeetingPolicy(
                allow_anonymous_users_to_join_meeting=False,
                allow_anonymous_users_to_start_meeting=False,
                allow_external_participant_give_request_control=False,
                allow_external_non_trusted_meeting_chat=False,
                allow_cloud_recording=False,
                designated_presenter_role_mode="EveryoneUserOverride",
                allow_external_users_to_bypass_lobby="EveryoneInCompanyExcludingGuests",
                allow_pstn_users_to_bypass_lobby=False,
                meeting_chat_enabled_type="EnabledExceptAnonymous",
            )
            teams_client.powershell.close()

    @patch(
        "prowler.providers.m365.services.teams.teams_service.Teams._get_global_messaging_policy",
        new=mock_get_global_messaging_policy,
    )
    def test_get_global_messaging_policy(self):
        with (
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_microsoft_teams"
            ),
        ):
            teams_client = Teams(
                set_mocked_m365_provider(
                    identity=M365IdentityInfo(tenant_domain=DOMAIN)
                )
            )
            assert teams_client.global_messaging_policy == GlobalMessagingPolicy(
                allow_security_end_user_reporting=True
            )
```

--------------------------------------------------------------------------------

---[FILE: teams_email_sending_to_channel_disabled_test.py]---
Location: prowler-master/tests/providers/m365/services/teams/teams_email_sending_to_channel_disabled/teams_email_sending_to_channel_disabled_test.py

```python
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_teams_email_sending_to_channel_disabled:
    def test_email_sending_to_channel_no_restricted(self):
        teams_client = mock.MagicMock()
        teams_client.audited_tenant = "audited_tenant"
        teams_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_microsoft_teams"
            ),
            mock.patch(
                "prowler.providers.m365.services.teams.teams_email_sending_to_channel_disabled.teams_email_sending_to_channel_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_email_sending_to_channel_disabled.teams_email_sending_to_channel_disabled import (
                teams_email_sending_to_channel_disabled,
            )
            from prowler.providers.m365.services.teams.teams_service import (
                CloudStorageSettings,
                TeamsSettings,
            )

            teams_client.teams_settings = TeamsSettings(
                cloud_storage_settings=CloudStorageSettings(
                    allow_box=True,
                    allow_drop_box=True,
                    allow_egnyte=True,
                    allow_google_drive=True,
                    allow_share_file=True,
                ),
                allow_email_into_channel=True,
            )

            check = teams_email_sending_to_channel_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Teams users can send emails to channel email addresses."
            )
            assert result[0].resource == teams_client.teams_settings.dict()
            assert result[0].resource_name == "Teams Settings"
            assert result[0].resource_id == "teamsSettings"
            assert result[0].location == "global"

    def test_email_sending_to_channel_restricted(self):
        teams_client = mock.MagicMock()
        teams_client.audited_tenant = "audited_tenant"
        teams_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_microsoft_teams"
            ),
            mock.patch(
                "prowler.providers.m365.services.teams.teams_email_sending_to_channel_disabled.teams_email_sending_to_channel_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_email_sending_to_channel_disabled.teams_email_sending_to_channel_disabled import (
                teams_email_sending_to_channel_disabled,
            )
            from prowler.providers.m365.services.teams.teams_service import (
                CloudStorageSettings,
                TeamsSettings,
            )

            teams_client.teams_settings = TeamsSettings(
                cloud_storage_settings=CloudStorageSettings(
                    allow_box=True,
                    allow_drop_box=True,
                    allow_egnyte=True,
                    allow_google_drive=True,
                    allow_share_file=True,
                ),
                allow_email_into_channel=False,
            )

            check = teams_email_sending_to_channel_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Teams users cannot send emails to channel email addresses."
            )
            assert result[0].resource == teams_client.teams_settings.dict()
            assert result[0].resource_name == "Teams Settings"
            assert result[0].resource_id == "teamsSettings"
            assert result[0].location == "global"
```

--------------------------------------------------------------------------------

---[FILE: teams_external_domains_restricted_test.py]---
Location: prowler-master/tests/providers/m365/services/teams/teams_external_domains_restricted/teams_external_domains_restricted_test.py

```python
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_teams_external_domains_restricted:
    def test_no_user_settings(self):
        teams_client = mock.MagicMock()
        teams_client.audited_tenant = "audited_tenant"
        teams_client.audited_domain = DOMAIN
        teams_client.user_settings = None

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_microsoft_teams"
            ),
            mock.patch(
                "prowler.providers.m365.services.teams.teams_external_domains_restricted.teams_external_domains_restricted.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_external_domains_restricted.teams_external_domains_restricted import (
                teams_external_domains_restricted,
            )

            check = teams_external_domains_restricted()
            result = check.execute()
            assert len(result) == 0

    def test_external_domains_allowed(self):
        teams_client = mock.MagicMock()
        teams_client.audited_tenant = "audited_tenant"
        teams_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_microsoft_teams"
            ),
            mock.patch(
                "prowler.providers.m365.services.teams.teams_external_domains_restricted.teams_external_domains_restricted.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_external_domains_restricted.teams_external_domains_restricted import (
                teams_external_domains_restricted,
            )
            from prowler.providers.m365.services.teams.teams_service import UserSettings

            teams_client.user_settings = UserSettings(
                allow_external_access=True,
            )

            check = teams_external_domains_restricted()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == "Users can access external domains."
            assert result[0].resource == teams_client.user_settings.dict()
            assert result[0].resource_name == "Teams User Settings"
            assert result[0].resource_id == "userSettings"
            assert result[0].location == "global"

    def test_external_domains_restricted(self):
        teams_client = mock.MagicMock()
        teams_client.audited_tenant = "audited_tenant"
        teams_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_microsoft_teams"
            ),
            mock.patch(
                "prowler.providers.m365.services.teams.teams_external_domains_restricted.teams_external_domains_restricted.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_external_domains_restricted.teams_external_domains_restricted import (
                teams_external_domains_restricted,
            )
            from prowler.providers.m365.services.teams.teams_service import UserSettings

            teams_client.user_settings = UserSettings(
                allow_external_access=False,
            )

            check = teams_external_domains_restricted()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == "Users can not access external domains."
            assert result[0].resource == teams_client.user_settings.dict()
            assert result[0].resource_name == "Teams User Settings"
            assert result[0].resource_id == "userSettings"
            assert result[0].location == "global"
```

--------------------------------------------------------------------------------

---[FILE: teams_external_file_sharing_restricted_test.py]---
Location: prowler-master/tests/providers/m365/services/teams/teams_external_file_sharing_restricted/teams_external_file_sharing_restricted_test.py

```python
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_teams_external_file_sharing_restricted:
    def test_file_sharing_no_restricted(self):
        teams_client = mock.MagicMock()
        teams_client.audited_tenant = "audited_tenant"
        teams_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_microsoft_teams"
            ),
            mock.patch(
                "prowler.providers.m365.services.teams.teams_external_file_sharing_restricted.teams_external_file_sharing_restricted.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_external_file_sharing_restricted.teams_external_file_sharing_restricted import (
                teams_external_file_sharing_restricted,
            )
            from prowler.providers.m365.services.teams.teams_service import (
                CloudStorageSettings,
                TeamsSettings,
            )

            teams_client.teams_settings = TeamsSettings(
                cloud_storage_settings=CloudStorageSettings(
                    allow_box=True,
                    allow_drop_box=True,
                    allow_egnyte=True,
                    allow_google_drive=True,
                    allow_share_file=True,
                )
            )

            teams_client.audit_config = {"allowed_cloud_storage_services": []}

            check = teams_external_file_sharing_restricted()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "External file sharing is not restricted to only approved cloud storage services."
            )
            assert (
                result[0].resource
                == teams_client.teams_settings.cloud_storage_settings.dict()
            )
            assert result[0].resource_name == "Cloud Storage Settings"
            assert result[0].resource_id == "cloudStorageSettings"
            assert result[0].location == "global"

    def test_file_sharing_restricted(self):
        teams_client = mock.MagicMock()
        teams_client.audited_tenant = "audited_tenant"
        teams_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_microsoft_teams"
            ),
            mock.patch(
                "prowler.providers.m365.services.teams.teams_external_file_sharing_restricted.teams_external_file_sharing_restricted.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_external_file_sharing_restricted.teams_external_file_sharing_restricted import (
                teams_external_file_sharing_restricted,
            )
            from prowler.providers.m365.services.teams.teams_service import (
                CloudStorageSettings,
                TeamsSettings,
            )

            teams_client.teams_settings = TeamsSettings(
                cloud_storage_settings=CloudStorageSettings(
                    allow_box=True,
                    allow_drop_box=True,
                    allow_egnyte=False,
                    allow_google_drive=True,
                    allow_share_file=True,
                )
            )

            teams_client.audit_config = {
                "allowed_cloud_storage_services": [
                    "allow_box",
                    "allow_drop_box",
                    # "allow_egnyte",
                    "allow_google_drive",
                    "allow_share_file",
                ]
            }

            check = teams_external_file_sharing_restricted()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "External file sharing is restricted to only approved cloud storage services."
            )
            assert (
                result[0].resource
                == teams_client.teams_settings.cloud_storage_settings.dict()
            )
            assert result[0].resource_name == "Cloud Storage Settings"
            assert result[0].resource_id == "cloudStorageSettings"
            assert result[0].location == "global"
```

--------------------------------------------------------------------------------

---[FILE: teams_external_users_cannot_start_conversations_test.py]---
Location: prowler-master/tests/providers/m365/services/teams/teams_external_users_cannot_start_conversations/teams_external_users_cannot_start_conversations_test.py

```python
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_teams_external_users_cannot_start_conversations:
    def test_no_user_settings(self):
        teams_client = mock.MagicMock()
        teams_client.audited_tenant = "audited_tenant"
        teams_client.audited_domain = DOMAIN
        teams_client.user_settings = None

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_microsoft_teams"
            ),
            mock.patch(
                "prowler.providers.m365.services.teams.teams_external_users_cannot_start_conversations.teams_external_users_cannot_start_conversations.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_external_users_cannot_start_conversations.teams_external_users_cannot_start_conversations import (
                teams_external_users_cannot_start_conversations,
            )

            check = teams_external_users_cannot_start_conversations()
            result = check.execute()
            assert len(result) == 0

    def test_unmanaged_communication_allowed(self):
        teams_client = mock.MagicMock()
        teams_client.audited_tenant = "audited_tenant"
        teams_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_microsoft_teams"
            ),
            mock.patch(
                "prowler.providers.m365.services.teams.teams_external_users_cannot_start_conversations.teams_external_users_cannot_start_conversations.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_external_users_cannot_start_conversations.teams_external_users_cannot_start_conversations import (
                teams_external_users_cannot_start_conversations,
            )
            from prowler.providers.m365.services.teams.teams_service import UserSettings

            teams_client.user_settings = UserSettings(
                allow_teams_consumer_inbound=True,
            )

            check = teams_external_users_cannot_start_conversations()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "External Teams users can initiate conversations."
            )
            assert result[0].resource == teams_client.user_settings.dict()
            assert result[0].resource_name == "Teams User Settings"
            assert result[0].resource_id == "userSettings"
            assert result[0].location == "global"

    def test_unmanaged_communication_restricted(self):
        teams_client = mock.MagicMock()
        teams_client.audited_tenant = "audited_tenant"
        teams_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_microsoft_teams"
            ),
            mock.patch(
                "prowler.providers.m365.services.teams.teams_external_users_cannot_start_conversations.teams_external_users_cannot_start_conversations.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_external_users_cannot_start_conversations.teams_external_users_cannot_start_conversations import (
                teams_external_users_cannot_start_conversations,
            )
            from prowler.providers.m365.services.teams.teams_service import UserSettings

            teams_client.user_settings = UserSettings(
                allow_teams_consumer_inbound=False,
            )

            check = teams_external_users_cannot_start_conversations()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "External Teams users cannot initiate conversations."
            )
            assert result[0].resource == teams_client.user_settings.dict()
            assert result[0].resource_name == "Teams User Settings"
            assert result[0].resource_id == "userSettings"
            assert result[0].location == "global"
```

--------------------------------------------------------------------------------

---[FILE: teams_meeting_anonymous_user_join_disabled_test.py]---
Location: prowler-master/tests/providers/m365/services/teams/teams_meeting_anonymous_user_join_disabled/teams_meeting_anonymous_user_join_disabled_test.py

```python
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_teams_meeting_anonymous_user_join_disabled:
    def test_no_global_meeting_policy(self):
        teams_client = mock.MagicMock()
        teams_client.global_meeting_policy = None

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_microsoft_teams"
            ),
            mock.patch(
                "prowler.providers.m365.services.teams.teams_meeting_anonymous_user_join_disabled.teams_meeting_anonymous_user_join_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_anonymous_user_join_disabled.teams_meeting_anonymous_user_join_disabled import (
                teams_meeting_anonymous_user_join_disabled,
            )

            check = teams_meeting_anonymous_user_join_disabled()
            result = check.execute()
            assert len(result) == 0

    def test_anonymous_users_can_join_meetings(self):
        teams_client = mock.MagicMock()
        teams_client.audited_tenant = "audited_tenant"
        teams_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_microsoft_teams"
            ),
            mock.patch(
                "prowler.providers.m365.services.teams.teams_meeting_anonymous_user_join_disabled.teams_meeting_anonymous_user_join_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_anonymous_user_join_disabled.teams_meeting_anonymous_user_join_disabled import (
                teams_meeting_anonymous_user_join_disabled,
            )
            from prowler.providers.m365.services.teams.teams_service import (
                GlobalMeetingPolicy,
            )

            teams_client.global_meeting_policy = GlobalMeetingPolicy(
                allow_anonymous_users_to_join_meeting=True
            )

            check = teams_meeting_anonymous_user_join_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended == "Anonymous Teams users can join meetings."
            )
            assert result[0].resource == teams_client.global_meeting_policy.dict()
            assert (
                result[0].resource_name
                == "Teams Meetings Global (Org-wide default) Policy"
            )
            assert result[0].resource_id == "teamsMeetingsGlobalPolicy"

    def test_anonymous_users_cannot_join_meetings(self):
        teams_client = mock.MagicMock()
        teams_client.audited_tenant = "audited_tenant"
        teams_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_microsoft_teams"
            ),
            mock.patch(
                "prowler.providers.m365.services.teams.teams_meeting_anonymous_user_join_disabled.teams_meeting_anonymous_user_join_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_anonymous_user_join_disabled.teams_meeting_anonymous_user_join_disabled import (
                teams_meeting_anonymous_user_join_disabled,
            )
            from prowler.providers.m365.services.teams.teams_service import (
                GlobalMeetingPolicy,
            )

            teams_client.global_meeting_policy = GlobalMeetingPolicy(
                allow_anonymous_users_to_join_meeting=False
            )

            check = teams_meeting_anonymous_user_join_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Anonymous Teams users can not join meetings."
            )
            assert result[0].resource == teams_client.global_meeting_policy.dict()
            assert (
                result[0].resource_name
                == "Teams Meetings Global (Org-wide default) Policy"
            )
            assert result[0].resource_id == "teamsMeetingsGlobalPolicy"
```

--------------------------------------------------------------------------------

---[FILE: teams_meeting_anonymous_user_start_disabled_test.py]---
Location: prowler-master/tests/providers/m365/services/teams/teams_meeting_anonymous_user_start_disabled/teams_meeting_anonymous_user_start_disabled_test.py

```python
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_teams_meeting_anonymous_user_start_disabled:
    def test_no_global_meeting_policy(self):
        teams_client = mock.MagicMock()
        teams_client.global_meeting_policy = None

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_microsoft_teams"
            ),
            mock.patch(
                "prowler.providers.m365.services.teams.teams_meeting_anonymous_user_start_disabled.teams_meeting_anonymous_user_start_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_anonymous_user_start_disabled.teams_meeting_anonymous_user_start_disabled import (
                teams_meeting_anonymous_user_start_disabled,
            )

            check = teams_meeting_anonymous_user_start_disabled()
            result = check.execute()
            assert len(result) == 0

    def test_anonymous_users_can_start_meetings(self):
        teams_client = mock.MagicMock()
        teams_client.audited_tenant = "audited_tenant"
        teams_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_microsoft_teams"
            ),
            mock.patch(
                "prowler.providers.m365.services.teams.teams_meeting_anonymous_user_start_disabled.teams_meeting_anonymous_user_start_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_anonymous_user_start_disabled.teams_meeting_anonymous_user_start_disabled import (
                teams_meeting_anonymous_user_start_disabled,
            )
            from prowler.providers.m365.services.teams.teams_service import (
                GlobalMeetingPolicy,
            )

            teams_client.global_meeting_policy = GlobalMeetingPolicy(
                allow_anonymous_users_to_start_meeting=True
            )

            check = teams_meeting_anonymous_user_start_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended == "Anonymous Teams users can start meetings."
            )
            assert result[0].resource == teams_client.global_meeting_policy.dict()
            assert (
                result[0].resource_name
                == "Teams Meetings Global (Org-wide default) Policy"
            )
            assert result[0].resource_id == "teamsMeetingsGlobalPolicy"

    def test_anonymous_users_cannot_start_meetings(self):
        teams_client = mock.MagicMock()
        teams_client.audited_tenant = "audited_tenant"
        teams_client.audited_domain = DOMAIN

        with (
            mock.patch(
                "prowler.providers.common.provider.Provider.get_global_provider",
                return_value=set_mocked_m365_provider(),
            ),
            mock.patch(
                "prowler.providers.m365.lib.powershell.m365_powershell.M365PowerShell.connect_microsoft_teams"
            ),
            mock.patch(
                "prowler.providers.m365.services.teams.teams_meeting_anonymous_user_start_disabled.teams_meeting_anonymous_user_start_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_anonymous_user_start_disabled.teams_meeting_anonymous_user_start_disabled import (
                teams_meeting_anonymous_user_start_disabled,
            )
            from prowler.providers.m365.services.teams.teams_service import (
                GlobalMeetingPolicy,
            )

            teams_client.global_meeting_policy = GlobalMeetingPolicy(
                allow_anonymous_users_to_start_meeting=False
            )

            check = teams_meeting_anonymous_user_start_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Anonymous Teams users can not start meetings."
            )
            assert result[0].resource == teams_client.global_meeting_policy.dict()
            assert (
                result[0].resource_name
                == "Teams Meetings Global (Org-wide default) Policy"
            )
            assert result[0].resource_id == "teamsMeetingsGlobalPolicy"
```

--------------------------------------------------------------------------------

````
