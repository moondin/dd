---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 750
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 750 of 867)

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

---[FILE: teams_meeting_chat_anonymous_users_disabled_test.py]---
Location: prowler-master/tests/providers/m365/services/teams/teams_meeting_chat_anonymous_users_disabled/teams_meeting_chat_anonymous_users_disabled_test.py

```python
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_teams_meeting_chat_anonymous_users_disabled:
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
                "prowler.providers.m365.services.teams.teams_meeting_chat_anonymous_users_disabled.teams_meeting_chat_anonymous_users_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_chat_anonymous_users_disabled.teams_meeting_chat_anonymous_users_disabled import (
                teams_meeting_chat_anonymous_users_disabled,
            )

            check = teams_meeting_chat_anonymous_users_disabled()
            result = check.execute()
            assert len(result) == 0

    def test_meeting_chat_allows_anonymous_users(self):
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
                "prowler.providers.m365.services.teams.teams_meeting_chat_anonymous_users_disabled.teams_meeting_chat_anonymous_users_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_chat_anonymous_users_disabled.teams_meeting_chat_anonymous_users_disabled import (
                teams_meeting_chat_anonymous_users_disabled,
            )
            from prowler.providers.m365.services.teams.teams_service import (
                GlobalMeetingPolicy,
            )

            teams_client.global_meeting_policy = GlobalMeetingPolicy(
                meeting_chat_enabled_type="EnabledForEveryone"
            )

            check = teams_meeting_chat_anonymous_users_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == "Meeting chat allows anonymous users."
            assert result[0].resource == teams_client.global_meeting_policy.dict()
            assert (
                result[0].resource_name
                == "Teams Meetings Global (Org-wide default) Policy"
            )
            assert result[0].resource_id == "teamsMeetingsGlobalPolicy"

    def test_meeting_chat_does_not_allow_anonymous_users_enabled_except_anonymous(self):
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
                "prowler.providers.m365.services.teams.teams_meeting_chat_anonymous_users_disabled.teams_meeting_chat_anonymous_users_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_chat_anonymous_users_disabled.teams_meeting_chat_anonymous_users_disabled import (
                teams_meeting_chat_anonymous_users_disabled,
            )
            from prowler.providers.m365.services.teams.teams_service import (
                GlobalMeetingPolicy,
            )

            teams_client.global_meeting_policy = GlobalMeetingPolicy(
                meeting_chat_enabled_type="EnabledExceptAnonymous"
            )

            check = teams_meeting_chat_anonymous_users_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Meeting chat does not allow anonymous users."
            )
            assert result[0].resource == teams_client.global_meeting_policy.dict()
            assert (
                result[0].resource_name
                == "Teams Meetings Global (Org-wide default) Policy"
            )
            assert result[0].resource_id == "teamsMeetingsGlobalPolicy"

    def test_meeting_chat_does_not_allow_anonymous_users_enabled_in_meeting_only(self):
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
                "prowler.providers.m365.services.teams.teams_meeting_chat_anonymous_users_disabled.teams_meeting_chat_anonymous_users_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_chat_anonymous_users_disabled.teams_meeting_chat_anonymous_users_disabled import (
                teams_meeting_chat_anonymous_users_disabled,
            )
            from prowler.providers.m365.services.teams.teams_service import (
                GlobalMeetingPolicy,
            )

            teams_client.global_meeting_policy = GlobalMeetingPolicy(
                meeting_chat_enabled_type="EnabledInMeetingOnlyForAllExceptAnonymous"
            )

            check = teams_meeting_chat_anonymous_users_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Meeting chat does not allow anonymous users."
            )
            assert result[0].resource == teams_client.global_meeting_policy.dict()
            assert (
                result[0].resource_name
                == "Teams Meetings Global (Org-wide default) Policy"
            )
            assert result[0].resource_id == "teamsMeetingsGlobalPolicy"
```

--------------------------------------------------------------------------------

---[FILE: teams_meeting_dial_in_lobby_bypass_disabled_test.py]---
Location: prowler-master/tests/providers/m365/services/teams/teams_meeting_dial_in_lobby_bypass_disabled/teams_meeting_dial_in_lobby_bypass_disabled_test.py

```python
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_teams_meeting_dial_in_lobby_bypass_disabled:
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
                "prowler.providers.m365.services.teams.teams_meeting_dial_in_lobby_bypass_disabled.teams_meeting_dial_in_lobby_bypass_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_dial_in_lobby_bypass_disabled.teams_meeting_dial_in_lobby_bypass_disabled import (
                teams_meeting_dial_in_lobby_bypass_disabled,
            )

            check = teams_meeting_dial_in_lobby_bypass_disabled()
            result = check.execute()
            assert len(result) == 0

    def test_dial_in_users_can_bypass_lobby(self):
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
                "prowler.providers.m365.services.teams.teams_meeting_dial_in_lobby_bypass_disabled.teams_meeting_dial_in_lobby_bypass_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_dial_in_lobby_bypass_disabled.teams_meeting_dial_in_lobby_bypass_disabled import (
                teams_meeting_dial_in_lobby_bypass_disabled,
            )
            from prowler.providers.m365.services.teams.teams_service import (
                GlobalMeetingPolicy,
            )

            teams_client.global_meeting_policy = GlobalMeetingPolicy(
                allow_pstn_users_to_bypass_lobby=True
            )

            check = teams_meeting_dial_in_lobby_bypass_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert result[0].status_extended == "Dial-in users can bypass the lobby."
            assert result[0].resource == teams_client.global_meeting_policy.dict()
            assert (
                result[0].resource_name
                == "Teams Meetings Global (Org-wide default) Policy"
            )
            assert result[0].resource_id == "teamsMeetingsGlobalPolicy"

    def test_dial_in_users_cannot_bypass_lobby(self):
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
                "prowler.providers.m365.services.teams.teams_meeting_dial_in_lobby_bypass_disabled.teams_meeting_dial_in_lobby_bypass_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_dial_in_lobby_bypass_disabled.teams_meeting_dial_in_lobby_bypass_disabled import (
                teams_meeting_dial_in_lobby_bypass_disabled,
            )
            from prowler.providers.m365.services.teams.teams_service import (
                GlobalMeetingPolicy,
            )

            teams_client.global_meeting_policy = GlobalMeetingPolicy(
                allow_pstn_users_to_bypass_lobby=False
            )

            check = teams_meeting_dial_in_lobby_bypass_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert result[0].status_extended == "Dial-in users cannot bypass the lobby."
            assert result[0].resource == teams_client.global_meeting_policy.dict()
            assert (
                result[0].resource_name
                == "Teams Meetings Global (Org-wide default) Policy"
            )
            assert result[0].resource_id == "teamsMeetingsGlobalPolicy"
```

--------------------------------------------------------------------------------

---[FILE: teams_meeting_external_chat_disabled_test.py]---
Location: prowler-master/tests/providers/m365/services/teams/teams_meeting_external_chat_disabled/teams_meeting_external_chat_disabled_test.py

```python
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_teams_meeting_external_chat_disabled:
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
                "prowler.providers.m365.services.teams.teams_meeting_external_chat_disabled.teams_meeting_external_chat_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_external_chat_disabled.teams_meeting_external_chat_disabled import (
                teams_meeting_external_chat_disabled,
            )

            check = teams_meeting_external_chat_disabled()
            result = check.execute()
            assert len(result) == 0

    def test_external_chat_enabled(self):
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
                "prowler.providers.m365.services.teams.teams_meeting_external_chat_disabled.teams_meeting_external_chat_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_external_chat_disabled.teams_meeting_external_chat_disabled import (
                teams_meeting_external_chat_disabled,
            )
            from prowler.providers.m365.services.teams.teams_service import (
                GlobalMeetingPolicy,
            )

            teams_client.global_meeting_policy = GlobalMeetingPolicy(
                allow_external_non_trusted_meeting_chat=True
            )

            check = teams_meeting_external_chat_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "External meeting chat is enabled for untrusted organizations."
            )
            assert result[0].resource == teams_client.global_meeting_policy.dict()
            assert (
                result[0].resource_name
                == "Teams Meetings Global (Org-wide default) Policy"
            )
            assert result[0].resource_id == "teamsMeetingsGlobalPolicy"

    def test_external_chat_disabled(self):
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
                "prowler.providers.m365.services.teams.teams_meeting_external_chat_disabled.teams_meeting_external_chat_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_external_chat_disabled.teams_meeting_external_chat_disabled import (
                teams_meeting_external_chat_disabled,
            )
            from prowler.providers.m365.services.teams.teams_service import (
                GlobalMeetingPolicy,
            )

            teams_client.global_meeting_policy = GlobalMeetingPolicy(
                allow_external_non_trusted_meeting_chat=False
            )

            check = teams_meeting_external_chat_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "External meeting chat is disabled for untrusted organizations."
            )
            assert result[0].resource == teams_client.global_meeting_policy.dict()
            assert (
                result[0].resource_name
                == "Teams Meetings Global (Org-wide default) Policy"
            )
            assert result[0].resource_id == "teamsMeetingsGlobalPolicy"
```

--------------------------------------------------------------------------------

---[FILE: teams_meeting_external_control_disabled_test.py]---
Location: prowler-master/tests/providers/m365/services/teams/teams_meeting_external_control_disabled/teams_meeting_external_control_disabled_test.py

```python
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_teams_meeting_external_control_disabled:
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
                "prowler.providers.m365.services.teams.teams_meeting_external_control_disabled.teams_meeting_external_control_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_external_control_disabled.teams_meeting_external_control_disabled import (
                teams_meeting_external_control_disabled,
            )

            check = teams_meeting_external_control_disabled()
            result = check.execute()
            assert len(result) == 0

    def test_external_participants_can_control(self):
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
                "prowler.providers.m365.services.teams.teams_meeting_external_control_disabled.teams_meeting_external_control_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_external_control_disabled.teams_meeting_external_control_disabled import (
                teams_meeting_external_control_disabled,
            )
            from prowler.providers.m365.services.teams.teams_service import (
                GlobalMeetingPolicy,
            )

            teams_client.global_meeting_policy = GlobalMeetingPolicy(
                allow_external_participant_give_request_control=True
            )

            check = teams_meeting_external_control_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "External participants can give or request control."
            )
            assert result[0].resource == teams_client.global_meeting_policy.dict()
            assert (
                result[0].resource_name
                == "Teams Meetings Global (Org-wide default) Policy"
            )
            assert result[0].resource_id == "teamsMeetingsGlobalPolicy"

    def test_external_participants_cannot_control(self):
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
                "prowler.providers.m365.services.teams.teams_meeting_external_control_disabled.teams_meeting_external_control_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_external_control_disabled.teams_meeting_external_control_disabled import (
                teams_meeting_external_control_disabled,
            )
            from prowler.providers.m365.services.teams.teams_service import (
                GlobalMeetingPolicy,
            )

            teams_client.global_meeting_policy = GlobalMeetingPolicy(
                allow_external_participant_give_request_control=False
            )

            check = teams_meeting_external_control_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "External participants cannot give or request control."
            )
            assert result[0].resource == teams_client.global_meeting_policy.dict()
            assert (
                result[0].resource_name
                == "Teams Meetings Global (Org-wide default) Policy"
            )
            assert result[0].resource_id == "teamsMeetingsGlobalPolicy"
```

--------------------------------------------------------------------------------

---[FILE: teams_meeting_external_lobby_bypass_disabled_test.py]---
Location: prowler-master/tests/providers/m365/services/teams/teams_meeting_external_lobby_bypass_disabled/teams_meeting_external_lobby_bypass_disabled_test.py

```python
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_teams_meeting_external_lobby_bypass_disabled:
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
                "prowler.providers.m365.services.teams.teams_meeting_external_lobby_bypass_disabled.teams_meeting_external_lobby_bypass_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_external_lobby_bypass_disabled.teams_meeting_external_lobby_bypass_disabled import (
                teams_meeting_external_lobby_bypass_disabled,
            )

            check = teams_meeting_external_lobby_bypass_disabled()
            result = check.execute()
            assert len(result) == 0

    def test_external_users_can_bypass_lobby(self):
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
                "prowler.providers.m365.services.teams.teams_meeting_external_lobby_bypass_disabled.teams_meeting_external_lobby_bypass_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_external_lobby_bypass_disabled.teams_meeting_external_lobby_bypass_disabled import (
                teams_meeting_external_lobby_bypass_disabled,
            )
            from prowler.providers.m365.services.teams.teams_service import (
                GlobalMeetingPolicy,
            )

            teams_client.global_meeting_policy = GlobalMeetingPolicy(
                allow_external_users_to_bypass_lobby="Everyone"
            )

            check = teams_meeting_external_lobby_bypass_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "People outside the organization can bypass the lobby."
            )
            assert result[0].resource == teams_client.global_meeting_policy.dict()
            assert (
                result[0].resource_name
                == "Teams Meetings Global (Org-wide default) Policy"
            )
            assert result[0].resource_id == "teamsMeetingsGlobalPolicy"

    def test_only_internal_users_can_bypass_lobby(self):
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
                "prowler.providers.m365.services.teams.teams_meeting_external_lobby_bypass_disabled.teams_meeting_external_lobby_bypass_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_external_lobby_bypass_disabled.teams_meeting_external_lobby_bypass_disabled import (
                teams_meeting_external_lobby_bypass_disabled,
            )
            from prowler.providers.m365.services.teams.teams_service import (
                GlobalMeetingPolicy,
            )

            teams_client.global_meeting_policy = GlobalMeetingPolicy(
                allow_external_users_to_bypass_lobby="EveryoneInCompanyExcludingGuests"
            )

            check = teams_meeting_external_lobby_bypass_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Only people in the organization can bypass the lobby."
            )
            assert result[0].resource == teams_client.global_meeting_policy.dict()
            assert (
                result[0].resource_name
                == "Teams Meetings Global (Org-wide default) Policy"
            )
            assert result[0].resource_id == "teamsMeetingsGlobalPolicy"

    def test_organizer_only_can_bypass_lobby(self):
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
                "prowler.providers.m365.services.teams.teams_meeting_external_lobby_bypass_disabled.teams_meeting_external_lobby_bypass_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_external_lobby_bypass_disabled.teams_meeting_external_lobby_bypass_disabled import (
                teams_meeting_external_lobby_bypass_disabled,
            )
            from prowler.providers.m365.services.teams.teams_service import (
                GlobalMeetingPolicy,
            )

            teams_client.global_meeting_policy = GlobalMeetingPolicy(
                allow_external_users_to_bypass_lobby="OrganizerOnly"
            )

            check = teams_meeting_external_lobby_bypass_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Only people in the organization can bypass the lobby."
            )
            assert result[0].resource == teams_client.global_meeting_policy.dict()
            assert (
                result[0].resource_name
                == "Teams Meetings Global (Org-wide default) Policy"
            )
            assert result[0].resource_id == "teamsMeetingsGlobalPolicy"

    def test_invited_users_can_bypass_lobby(self):
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
                "prowler.providers.m365.services.teams.teams_meeting_external_lobby_bypass_disabled.teams_meeting_external_lobby_bypass_disabled.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_external_lobby_bypass_disabled.teams_meeting_external_lobby_bypass_disabled import (
                teams_meeting_external_lobby_bypass_disabled,
            )
            from prowler.providers.m365.services.teams.teams_service import (
                GlobalMeetingPolicy,
            )

            teams_client.global_meeting_policy = GlobalMeetingPolicy(
                allow_external_users_to_bypass_lobby="InvitedUsers"
            )

            check = teams_meeting_external_lobby_bypass_disabled()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Only people in the organization can bypass the lobby."
            )
            assert result[0].resource == teams_client.global_meeting_policy.dict()
            assert (
                result[0].resource_name
                == "Teams Meetings Global (Org-wide default) Policy"
            )
            assert result[0].resource_id == "teamsMeetingsGlobalPolicy"
```

--------------------------------------------------------------------------------

---[FILE: teams_meeting_presenters_restricted_test.py]---
Location: prowler-master/tests/providers/m365/services/teams/teams_meeting_presenters_restricted/teams_meeting_presenters_restricted_test.py

```python
from unittest import mock

from tests.providers.m365.m365_fixtures import DOMAIN, set_mocked_m365_provider


class Test_teams_meeting_presenters_restricted:
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
                "prowler.providers.m365.services.teams.teams_meeting_presenters_restricted.teams_meeting_presenters_restricted.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_presenters_restricted.teams_meeting_presenters_restricted import (
                teams_meeting_presenters_restricted,
            )

            check = teams_meeting_presenters_restricted()
            result = check.execute()
            assert len(result) == 0

    def test_presenters_not_restricted(self):
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
                "prowler.providers.m365.services.teams.teams_meeting_presenters_restricted.teams_meeting_presenters_restricted.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_presenters_restricted.teams_meeting_presenters_restricted import (
                teams_meeting_presenters_restricted,
            )
            from prowler.providers.m365.services.teams.teams_service import (
                GlobalMeetingPolicy,
            )

            teams_client.global_meeting_policy = GlobalMeetingPolicy(
                designated_presenter_role_mode="EveryoneUserOverride"
            )

            check = teams_meeting_presenters_restricted()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "FAIL"
            assert (
                result[0].status_extended
                == "Not only organizers and co-organizers can present."
            )
            assert result[0].resource == teams_client.global_meeting_policy.dict()
            assert (
                result[0].resource_name
                == "Teams Meetings Global (Org-wide default) Policy"
            )
            assert result[0].resource_id == "teamsMeetingsGlobalPolicy"

    def test_presenters_restricted(self):
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
                "prowler.providers.m365.services.teams.teams_meeting_presenters_restricted.teams_meeting_presenters_restricted.teams_client",
                new=teams_client,
            ),
        ):
            from prowler.providers.m365.services.teams.teams_meeting_presenters_restricted.teams_meeting_presenters_restricted import (
                teams_meeting_presenters_restricted,
            )
            from prowler.providers.m365.services.teams.teams_service import (
                GlobalMeetingPolicy,
            )

            teams_client.global_meeting_policy = GlobalMeetingPolicy(
                designated_presenter_role_mode="OrganizerOnlyUserOverride"
            )

            check = teams_meeting_presenters_restricted()
            result = check.execute()
            assert len(result) == 1
            assert result[0].status == "PASS"
            assert (
                result[0].status_extended
                == "Only organizers and co-organizers can present."
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
