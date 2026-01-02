---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 1026
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1026 of 1290)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - zulip-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/zulip-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: test_microsoft_teams_importer.py]---
Location: zulip-main/zerver/tests/test_microsoft_teams_importer.py
Signals: Django

```python
import json
import os
from collections.abc import Callable
from functools import wraps
from typing import Any, Concatenate, TypeAlias
from urllib.parse import parse_qs, urlsplit

import responses
from django.utils.timezone import now as timezone_now
from requests import PreparedRequest
from typing_extensions import ParamSpec

from zerver.data_import.microsoft_teams import (
    MICROSOFT_GRAPH_API_URL,
    MicrosoftTeamsFieldsT,
    MicrosoftTeamsUserIdToZulipUserIdT,
    MicrosoftTeamsUserRoleData,
    ODataQueryParameter,
    convert_users,
    do_convert_directory,
    get_microsoft_graph_api_data,
    get_user_roles,
)
from zerver.lib.import_realm import do_import_realm
from zerver.lib.test_classes import ZulipTestCase
from zerver.models.realms import get_realm
from zerver.models.recipients import Recipient
from zerver.models.streams import Stream, Subscription
from zerver.models.users import UserProfile
from zerver.tests.test_import_export import make_export_output_dir

ParamT = ParamSpec("ParamT")

ResponseTuple: TypeAlias = tuple[int, dict[str, str], str]

EXPORTED_MICROSOFT_TEAMS_USER_EMAIL = dict(
    aaron="aaron@ZulipChat.onmicrosoft.com",
    alya="alya@ZulipChat.onmicrosoft.com",
    cordelia="cordelia@ZulipChat.onmicrosoft.com",
    guest="guest@example.com",
    pieter="pieterk@ZulipChat.onmicrosoft.com",
    zoe="zoe@ZulipChat.onmicrosoft.com",
)

EXPORTED_REALM_OWNER_EMAILS = [
    EXPORTED_MICROSOFT_TEAMS_USER_EMAIL["pieter"],
    EXPORTED_MICROSOFT_TEAMS_USER_EMAIL["alya"],
]

GUEST_USER_EMAILS = [EXPORTED_MICROSOFT_TEAMS_USER_EMAIL["guest"]]

MICROSOFT_TEAMS_EXPORT_USER_ROLE_DATA = MicrosoftTeamsUserRoleData(
    global_administrator_user_ids={
        "88cbf3c2-0810-4d32-aa19-863c12bf7be9",
        "3c6ee395-529d-4681-b5f7-582c707570f6",
    },
    guest_user_ids={"16741626-4cd8-46cc-bf36-42ecc2b5fdce"},
)


EXPORTED_MICROSOFT_TEAMS_TEAM_ID: dict[str, str] = {
    "Core team": "7c050abd-3cbb-448b-a9de-405f54cc14b2",
    "Community": "002145f2-eaba-4962-997d-6d841a9f50af",
    "Contributors": "2a00a70a-00f5-4da5-8618-8281194f0de0",
    "Feedback & support": "5e5f1988-3216-4ca0-83e9-18c04ecc7533",
    "Kandra Labs": "1d513e46-d8cd-41db-b84f-381fe5730794",
}


def get_exported_microsoft_teams_user_data() -> list[MicrosoftTeamsFieldsT]:
    test_class = ZulipTestCase()
    return json.loads(
        test_class.fixture_data(
            "usersList.json", "microsoft_teams_fixtures/TeamsData_ZulipChat/users"
        )
    )


def get_exported_team_data(team_id: str) -> MicrosoftTeamsFieldsT:
    test_class = ZulipTestCase()
    team_list = json.loads(
        test_class.fixture_data(
            "teamsList.json",
            "microsoft_teams_fixtures/TeamsData_ZulipChat/teams",
        )
    )

    team_list_data = next(team_data for team_data in team_list if team_id == team_data["GroupsId"])
    team_settings = json.loads(
        test_class.fixture_data(
            "teamsSettings.json",
            "microsoft_teams_fixtures/TeamsData_ZulipChat/teams",
        )
    )
    team_settings_data = next(
        team_data for team_data in team_settings if team_data["Id"] == team_id
    )
    return {**team_list_data, **team_settings_data}


def get_exported_team_subscription_list(team_id: str) -> list[MicrosoftTeamsFieldsT]:
    test_class = ZulipTestCase()
    return json.loads(
        test_class.fixture_data(
            f"teamMembers_{team_id}.json",
            f"microsoft_teams_fixtures/TeamsData_ZulipChat/teams/{team_id}",
        )
    )


def graph_api_users_callback(request: PreparedRequest) -> ResponseTuple:
    assert request.url is not None
    parsed = urlsplit(request.url)
    query_params = parse_qs(parsed.query)

    if query_params.get("$filter") == ["userType eq 'Guest'"]:
        test_class = ZulipTestCase()
        body = test_class.fixture_data(
            "users_guest.json",
            "microsoft_graph_api_response_fixtures",
        )
    else:
        raise AssertionError("There are no response fixture for this request.")

    # https://learn.microsoft.com/en-us/graph/query-parameters?tabs=http#select
    selected_fields = query_params.get("$select")
    if selected_fields:
        trimmed_values = []
        response = json.loads(body)
        for data in response["value"]:
            trimmed_data = {}
            for field in selected_fields:
                trimmed_data[field] = data[field]
            trimmed_values.append(trimmed_data)

        response["value"] = trimmed_values
        body = json.dumps(response)

    headers = {"Content-Type": "application/json"}
    return 200, headers, body


def mock_microsoft_graph_api_calls(
    test_func: Callable[Concatenate["MicrosoftTeamsImporterIntegrationTest", ParamT], None],
) -> Callable[Concatenate["MicrosoftTeamsImporterIntegrationTest", ParamT], None]:
    @wraps(test_func)
    @responses.activate
    def _wrapped(
        self: "MicrosoftTeamsImporterIntegrationTest",
        /,
        *args: ParamT.args,
        **kwargs: ParamT.kwargs,
    ) -> None:
        responses.add_callback(
            responses.GET,
            "https://graph.microsoft.com/v1.0/users",
            callback=graph_api_users_callback,
            content_type="application/json",
        )
        responses.add(
            responses.GET,
            "https://graph.microsoft.com/v1.0/directoryRoles",
            self.fixture_data("directory_roles.json", "microsoft_graph_api_response_fixtures"),
        )
        responses.add(
            responses.GET,
            "https://graph.microsoft.com/v1.0/directoryRoles/240d3723-f4d5-4e70-aa3b-2e574c4f6ea3/members",
            self.fixture_data(
                "directory_roles_global_administrator_members.json",
                "microsoft_graph_api_response_fixtures",
            ),
        )
        test_func(self, *args, **kwargs)

    return _wrapped


class MicrosoftTeamsImportTestCase(ZulipTestCase):
    def get_exported_microsoft_teams_user_data(self) -> list[MicrosoftTeamsFieldsT]:
        return json.loads(
            self.fixture_data(
                "usersList.json", "microsoft_teams_fixtures/TeamsData_ZulipChat/users"
            )
        )


class MicrosoftTeamsImporterIntegrationTest(MicrosoftTeamsImportTestCase):
    def get_imported_channel_subscriber_emails(self, channel: str | Stream) -> set[str]:
        if isinstance(channel, str):
            imported_channel = Stream.objects.get(
                name=channel,
                realm=get_realm(self.test_realm_subdomain),
            )
        else:
            imported_channel = channel  # nocoverage
        subscriptions = Subscription.objects.filter(recipient=imported_channel.recipient)
        users = {sub.user_profile.email for sub in subscriptions}
        return users

    def convert_microsoft_teams_export_fixture(self, fixture_folder: str) -> None:
        fixture_file_path = self.fixture_file_name(fixture_folder, "microsoft_teams_fixtures")
        if not os.path.isdir(fixture_file_path):
            raise AssertionError(f"Fixture file not found: {fixture_file_path}")
        with self.assertLogs(level="INFO"), self.settings(EXTERNAL_HOST="zulip.example.com"):
            do_convert_directory(
                fixture_file_path, self.converted_file_output_dir, "MICROSOFT_GRAPH_API_TOKEN"
            )

    def import_microsoft_teams_export_fixture(self, fixture_folder: str) -> None:
        self.convert_microsoft_teams_export_fixture(fixture_folder)
        with self.settings(BILLING_ENABLED=False), self.assertLogs(level="INFO"):
            do_import_realm(self.converted_file_output_dir, self.test_realm_subdomain)

    @mock_microsoft_graph_api_calls
    def do_import_realm_fixture(self, fixture: str = "TeamsData_ZulipChat/") -> None:
        self.converted_file_output_dir = make_export_output_dir()
        self.test_realm_subdomain = "test-import-teams-realm"
        self.import_microsoft_teams_export_fixture(fixture)
        exported_user_data = get_exported_microsoft_teams_user_data()
        self.exported_user_data_map = {u["Id"]: u for u in exported_user_data}

    def get_imported_realm_user_field_values(self, field: str, **kwargs: Any) -> list[str | int]:
        return list(
            UserProfile.objects.filter(
                realm=get_realm(self.test_realm_subdomain),
                **kwargs,
            ).values_list(field, flat=True)
        )

    def test_imported_users(self) -> None:
        self.do_import_realm_fixture()
        imported_user_emails = set(
            self.get_imported_realm_user_field_values(
                "email", is_mirror_dummy=False, is_active=True
            )
        )
        self.assertSetEqual(imported_user_emails, set(EXPORTED_MICROSOFT_TEAMS_USER_EMAIL.values()))

        # For now the importer doesn't generate any mirror dummy accounts.
        mirror_dummy_accounts = self.get_imported_realm_user_field_values(
            "id", is_mirror_dummy=True, is_active=False
        )
        self.assertListEqual(mirror_dummy_accounts, [])

        imported_realm_owner_emails = set(
            self.get_imported_realm_user_field_values("email", role=UserProfile.ROLE_REALM_OWNER)
        )
        self.assertSetEqual(imported_realm_owner_emails, set(EXPORTED_REALM_OWNER_EMAILS))

        imported_guest_user_emails = set(
            self.get_imported_realm_user_field_values("email", role=UserProfile.ROLE_GUEST)
        )
        self.assertSetEqual(imported_guest_user_emails, set(GUEST_USER_EMAILS))

        raw_exported_users_data = self.get_exported_microsoft_teams_user_data()

        raw_exported_user_full_names = [user["DisplayName"] for user in raw_exported_users_data]
        imported_user_full_names = self.get_imported_realm_user_field_values("full_name")
        self.assertEqual(sorted(raw_exported_user_full_names), sorted(imported_user_full_names))

    def test_imported_channels(self) -> None:
        self.do_import_realm_fixture()
        all_imported_channels = Stream.objects.filter(
            realm=get_realm(self.test_realm_subdomain),
        )

        self.assert_length(all_imported_channels, len(EXPORTED_MICROSOFT_TEAMS_TEAM_ID))

        for channel in all_imported_channels:
            channel_name = channel.name

            # Teams data are imported correctly
            raw_team_data = get_exported_team_data(EXPORTED_MICROSOFT_TEAMS_TEAM_ID[channel_name])
            self.assertEqual(channel_name, raw_team_data["Name"])
            self.assertEqual(channel.description, raw_team_data["Description"] or "")
            self.assertEqual(channel.deactivated, raw_team_data["IsArchived"])
            self.assertEqual(channel.invite_only, raw_team_data["Visibility"] == "private")

            # Teams subscription are imported correctly.
            imported_channel_subscriber_emails = self.get_imported_channel_subscriber_emails(
                channel_name
            )
            raw_subscription_list = get_exported_team_subscription_list(
                EXPORTED_MICROSOFT_TEAMS_TEAM_ID[channel_name]
            )
            expected_subscriber_emails: set[str] = {
                self.exported_user_data_map[sub["UserId"]]["Mail"] for sub in raw_subscription_list
            }
            self.assertSetEqual(expected_subscriber_emails, imported_channel_subscriber_emails)


class MicrosoftTeamsImporterUnitTest(MicrosoftTeamsImportTestCase):
    def convert_users_handler(
        self,
        realm: dict[str, Any] | None = None,
        realm_id: int = 0,
        users_list: list[MicrosoftTeamsFieldsT] | None = None,
        user_data_fixture_name: str | None = None,
        microsoft_teams_user_role_data: MicrosoftTeamsUserRoleData = MICROSOFT_TEAMS_EXPORT_USER_ROLE_DATA,
    ) -> MicrosoftTeamsUserIdToZulipUserIdT:
        if users_list is None:
            users_list = self.get_exported_microsoft_teams_user_data()

        if realm is None:
            realm = {}
            realm["zerver_stream"] = []
            realm["zerver_defaultstream"] = []
            realm["zerver_recipient"] = []
            realm["zerver_subscription"] = []

        if user_data_fixture_name is not None:
            users_list = json.loads(
                self.fixture_data(user_data_fixture_name, "microsoft_teams_fixtures/test_fixtures")
            )

        return convert_users(
            realm=realm,
            realm_id=realm_id,
            users_list=users_list,
            microsoft_teams_user_role_data=microsoft_teams_user_role_data,
            timestamp=int(float(timezone_now().timestamp())),
        )

    @responses.activate
    def get_user_roles_handler(
        self,
        directory_roles_response_fixture: str | None = "directory_roles.json",
        global_administrators_response_fixture: str
        | None = "directory_roles_global_administrator_members.json",
        guest_users_response_fixture: str | None = "users_guest.json",
    ) -> MicrosoftTeamsUserRoleData:
        # TODO: For simplicity, this test assumes we only query for the guest userss.
        # This can be updated to use `add_callback` and call something like
        # `graph_api_users_callback` if the importer performs other types of queries.
        responses.add(
            responses.GET,
            "https://graph.microsoft.com/v1.0/users?%24filter=userType+eq+%27Guest%27&%24select=id",
            self.fixture_data(
                guest_users_response_fixture,
                "microsoft_graph_api_response_fixtures",
            )
            if guest_users_response_fixture
            else json.dumps({"value": []}),
        )
        responses.add(
            responses.GET,
            "https://graph.microsoft.com/v1.0/directoryRoles",
            self.fixture_data(
                directory_roles_response_fixture, "microsoft_graph_api_response_fixtures"
            )
            if directory_roles_response_fixture
            else json.dumps({"value": []}),
        )
        responses.add(
            responses.GET,
            "https://graph.microsoft.com/v1.0/directoryRoles/240d3723-f4d5-4e70-aa3b-2e574c4f6ea3/members",
            self.fixture_data(
                global_administrators_response_fixture,
                "microsoft_graph_api_response_fixtures",
            )
            if global_administrators_response_fixture
            else json.dumps({"value": []}),
        )
        return get_user_roles("MICROSOFT_GRAPH_API_TOKEN")

    def test_convert_users_with_no_admin(self) -> None:
        microsoft_teams_user_role_data = MicrosoftTeamsUserRoleData(
            global_administrator_user_ids=set(), guest_user_ids=set()
        )
        with self.assertLogs(level="INFO") as info_logs:
            self.convert_users_handler(
                microsoft_teams_user_role_data=microsoft_teams_user_role_data
            )
        self.assertIn(
            "INFO:root:Converted realm has no owners!",
            info_logs.output,
        )

    def test_conver_users_with_missing_email(self) -> None:
        with self.assertLogs(level="INFO"), self.assertRaises(AssertionError) as e:
            self.convert_users_handler(user_data_fixture_name="user_list_with_missing_email.json")
        self.assertEqual(
            "Could not find email address for Microsoft Teams user {'BusinessPhones': [], 'JobTitle': None, 'Mail': None, 'MobilePhone': None, 'OfficeLocation': None, 'PreferredLanguage': None, 'UserPrincipalName': None, 'Id': '5dbe468a-1e96-4aaa-856d-cdf825081e11', 'UserId': None, 'DisplayName': 'zoe', 'UserName': None, 'PhoneNumber': None, 'Location': None, 'InterpretedUserType': None, 'DirectoryStatus': None, 'AudioConferencing': None, 'PhoneSystems': None, 'CallingPlan': None, 'AssignedPlans': None, 'OnlineDialinConferencingPolicy': None, 'FeatureTypes': None, 'State': None, 'City': None, 'Surname': None, 'GivenName': 'zoe'}",
            str(e.exception),
        )

    def test_at_least_one_recipient_per_user(self) -> None:
        """
        Make sure each user at least has a recipient field. This makes sure the
        the onboarding messages, runs smoothly even for users without any
        personal messages.
        """
        realm: dict[str, Any] = {}
        realm["zerver_stream"] = []
        realm["zerver_defaultstream"] = []
        realm["zerver_recipient"] = []
        realm["zerver_subscription"] = []
        with self.assertLogs(level="INFO"):
            microsoft_teams_user_id_to_zulip_user_id = self.convert_users_handler(
                realm=realm, microsoft_teams_user_role_data=MICROSOFT_TEAMS_EXPORT_USER_ROLE_DATA
            )

        self.assert_length(
            realm["zerver_recipient"], len(self.get_exported_microsoft_teams_user_data())
        )
        zulip_user_ids = set(microsoft_teams_user_id_to_zulip_user_id.values())
        for recipient in realm["zerver_recipient"]:
            self.assertTrue(recipient["type_id"] in zulip_user_ids)
            self.assertTrue(recipient["type"] == Recipient.PERSONAL)

    @responses.activate
    def test_failed_get_microsoft_graph_api_data(self) -> None:
        responses.add(
            method=responses.GET,
            url="https://graph.microsoft.com/v1.0/directoryRoles",
            status=403,
        )
        with self.assertRaises(Exception) as e, self.assertLogs(level="INFO"):
            get_microsoft_graph_api_data(
                MICROSOFT_GRAPH_API_URL.format(endpoint="/directoryRoles"),
                token="MICROSOFT_GRAPH_API_TOKEN",
            )
        self.assertEqual("HTTP error accessing the Microsoft Graph API.", str(e.exception))

    def test_get_user_roles(self) -> None:
        with (
            self.subTest("No global administrator role found"),
            self.assertRaises(AssertionError) as e,
        ):
            # This is primarily only for test coverage, it's likely a very rare case since
            # this role is one of the built-in roles.
            self.get_user_roles_handler(directory_roles_response_fixture=None)
            self.assertEqual(  # nocoverage
                "Could not find Microsoft Teams organization owners/administrators.",
                str(e.exception),
            )
        microsoft_teams_user_role_data: MicrosoftTeamsUserRoleData = self.get_user_roles_handler()
        self.assertSetEqual(
            microsoft_teams_user_role_data.global_administrator_user_ids,
            MICROSOFT_TEAMS_EXPORT_USER_ROLE_DATA.global_administrator_user_ids,
        )
        self.assertSetEqual(
            microsoft_teams_user_role_data.guest_user_ids,
            MICROSOFT_TEAMS_EXPORT_USER_ROLE_DATA.guest_user_ids,
        )

    @responses.activate
    def test_paginated_get_microsoft_graph_api_data(self) -> None:
        def paginated_graph_api_users_callback(request: PreparedRequest) -> ResponseTuple:
            assert request.url is not None
            parsed = urlsplit(request.url)
            query_params = parse_qs(parsed.query)
            queries = set(query_params.keys())

            if queries == {"$filter", "$top"}:
                body = self.fixture_data(
                    "paginated_users_member.json",
                    "microsoft_graph_api_response_fixtures",
                )
            elif queries == {"$filter", "$skiptoken", "$top"}:
                body = self.fixture_data(
                    "paginated_users_member_2.json",
                    "microsoft_graph_api_response_fixtures",
                )
            else:
                raise AssertionError("There is no response fixture for this request.")

            headers = {"Content-Type": "application/json"}
            return 200, headers, body

        responses.add_callback(
            responses.GET,
            "https://graph.microsoft.com/v1.0/users",
            callback=paginated_graph_api_users_callback,
            content_type="application/json",
        )

        odata_parameter = [
            ODataQueryParameter(parameter="$filter", expression="userType eq 'Member'"),
            ODataQueryParameter(parameter="$top", expression="3"),
        ]
        result = get_microsoft_graph_api_data(
            MICROSOFT_GRAPH_API_URL.format(endpoint="/users"),
            odata_parameter,
            token="MICROSOFT_GRAPH_API_TOKEN",
        )
        result_user_ids = {user["id"] for user in result}
        expected_member_users = {
            user["Id"]
            for user in self.get_exported_microsoft_teams_user_data()
            if user["Mail"] not in GUEST_USER_EMAILS
        }
        self.assertSetEqual(result_user_ids, expected_member_users)
```

--------------------------------------------------------------------------------

---[FILE: test_middleware.py]---
Location: zulip-main/zerver/tests/test_middleware.py
Signals: Django

```python
import time
from unittest.mock import patch

from bs4 import BeautifulSoup
from django.http import HttpResponse

from zerver.lib.realm_icon import get_realm_icon_url
from zerver.lib.request import RequestNotes
from zerver.lib.test_classes import ZulipTestCase
from zerver.lib.test_helpers import HostRequestMock
from zerver.lib.utils import assert_is_not_none
from zerver.middleware import LogRequests, is_slow_query, write_log_line
from zerver.models.realms import get_realm
from zilencer.models import RemoteZulipServer


class SlowQueryTest(ZulipTestCase):
    SLOW_QUERY_TIME = 10
    log_data = {
        "extra": "[transport=websocket]",
        "time_started": 0,
        "markdown_requests_start": 0,
        "markdown_time_start": 0,
        "remote_cache_time_start": 0,
        "remote_cache_requests_start": 0,
    }

    def test_is_slow_query(self) -> None:
        self.assertFalse(is_slow_query(1.1, "/some/random/url"))
        self.assertTrue(is_slow_query(2, "/some/random/url"))
        self.assertTrue(is_slow_query(5.1, "/activity"))
        self.assertFalse(is_slow_query(2, "/activity"))
        self.assertFalse(is_slow_query(2, "/realm_activity/whatever"))
        self.assertFalse(is_slow_query(2, "/user_activity/whatever"))

    def test_slow_query_log(self) -> None:
        self.log_data["time_started"] = time.time() - self.SLOW_QUERY_TIME
        with (
            self.assertLogs("zulip.slow_queries", level="INFO") as slow_query_logger,
            self.assertLogs("zulip.requests", level="INFO") as middleware_normal_logger,
        ):
            write_log_line(
                self.log_data,
                path="/some/endpoint/",
                method="GET",
                remote_ip="123.456.789.012",
                requester_for_logs="unknown",
                client_name="?",
            )
            self.assert_length(middleware_normal_logger.output, 1)
            self.assert_length(slow_query_logger.output, 1)

            self.assertRegex(
                slow_query_logger.output[0],
                r"123\.456\.789\.012 GET     200 10\.\ds .* \(unknown via \?\)",
            )


class OpenGraphTest(ZulipTestCase):
    def check_title_and_description(
        self,
        path: str,
        title: str,
        in_description: list[str],
        not_in_description: list[str],
        status_code: int = 200,
    ) -> None:
        response = self.client_get(path)
        self.assertEqual(response.status_code, status_code)
        bs = BeautifulSoup(response.content, features="lxml")
        open_graph_title = assert_is_not_none(bs.select_one('meta[property="og:title"]')).get(
            "content"
        )
        self.assertEqual(open_graph_title, title)

        open_graph_description = assert_is_not_none(
            bs.select_one('meta[property="og:description"]')
        ).get("content")
        assert isinstance(open_graph_description, str)
        for substring in in_description:
            self.assertIn(substring, open_graph_description)
        for substring in not_in_description:
            self.assertNotIn(substring, open_graph_description)

    def test_index_pages(self) -> None:
        self.check_title_and_description(
            "/api/",
            "Zulip API documentation",
            [
                (
                    "Zulip's APIs allow you to integrate other services with Zulip. This "
                    "guide should help you find the API you need:"
                )
            ],
            # This is added to maintain coverage for the not_in_description
            # block since we might want to keep using that for future tests.
            ["No such article."],
        )

    def test_nonexistent_page(self) -> None:
        self.check_title_and_description(
            "/api/not-a-real-page",
            # Probably we should make this "Zulip help center"
            "No such article. | Zulip API documentation",
            [
                "No such article.",
                "Your feedback helps us make Zulip better for everyone! Please contact us",
            ],
            [],
            # Test that our open graph logic doesn't throw a 500
            404,
        )

    def test_login_page_simple_description(self) -> None:
        name = "Zulip Dev"
        description = (
            "The Zulip development environment default organization. It's great for testing!"
        )

        self.check_title_and_description("/login/", name, [description], [])

    def test_login_page_markdown_description(self) -> None:
        realm = get_realm("zulip")
        description = (
            "Welcome to **Clojurians Zulip** - the place where the Clojure community meets.\n\n"
            "Before you signup/login:\n\n"
            "* note-1\n"
            "* note-2\n"
            "* note-3\n\n"
            "Enjoy!"
        )
        realm.description = description
        realm.save(update_fields=["description"])

        self.check_title_and_description(
            "/login/",
            "Zulip Dev",
            [
                "Welcome to Clojurians Zulip - the place where the Clojure community meets",
                "* note-1 * note-2 * note-3 | Enjoy!",
            ],
            [],
        )

    def test_login_page_realm_icon(self) -> None:
        realm = get_realm("zulip")
        realm.icon_source = "U"
        realm.save(update_fields=["icon_source"])
        realm_icon = get_realm_icon_url(realm)

        response = self.client_get("/login/")
        self.assertEqual(response.status_code, 200)

        bs = BeautifulSoup(response.content, features="lxml")
        open_graph_image = assert_is_not_none(bs.select_one('meta[property="og:image"]')).get(
            "content"
        )
        self.assertEqual(open_graph_image, f"{realm.url}{realm_icon}")

    def test_login_page_realm_icon_absolute_url(self) -> None:
        realm = get_realm("zulip")
        realm.icon_source = "U"
        realm.save(update_fields=["icon_source"])
        icon_url = f"https://foo.s3.amazonaws.com/{realm.id}/realm/icon.png?version={1}"
        with patch(
            "zerver.lib.realm_icon.upload_backend.get_realm_icon_url", return_value=icon_url
        ):
            response = self.client_get("/login/")
        self.assertEqual(response.status_code, 200)

        bs = BeautifulSoup(response.content, features="lxml")
        open_graph_image = assert_is_not_none(bs.select_one('meta[property="og:image"]')).get(
            "content"
        )
        self.assertEqual(open_graph_image, icon_url)

    def test_no_realm_api_page_og_url(self) -> None:
        response = self.client_get("/api/", subdomain="")
        self.assertEqual(response.status_code, 200)

        bs = BeautifulSoup(response.content, features="lxml")
        open_graph_url = assert_is_not_none(bs.select_one('meta[property="og:url"]')).get("content")

        assert isinstance(open_graph_url, str)
        self.assertTrue(open_graph_url.endswith("/api/"))


class LogRequestsTest(ZulipTestCase):
    meta_data = {"REMOTE_ADDR": "127.0.0.1"}

    def test_requester_for_logs_as_user(self) -> None:
        hamlet = self.example_user("hamlet")
        request = HostRequestMock(user_profile=hamlet, meta_data=self.meta_data)
        RequestNotes.get_notes(request).log_data = None

        with self.assertLogs("zulip.requests", level="INFO") as m:
            LogRequests(lambda _: HttpResponse())(request)
            self.assertIn(hamlet.format_requester_for_logs(), m.output[0])

    def test_requester_for_logs_as_remote_server(self) -> None:
        remote_server = RemoteZulipServer()
        request = HostRequestMock(remote_server=remote_server, meta_data=self.meta_data)
        RequestNotes.get_notes(request).log_data = None

        with self.assertLogs("zulip.requests", level="INFO") as m:
            LogRequests(lambda _: HttpResponse())(request)
            self.assertIn(remote_server.format_requester_for_logs(), m.output[0])

    def test_requester_for_logs_unauthenticated(self) -> None:
        request = HostRequestMock(meta_data=self.meta_data)
        RequestNotes.get_notes(request).log_data = None

        expected_requester = "unauth@root"
        with self.assertLogs("zulip.requests", level="INFO") as m:
            LogRequests(lambda _: HttpResponse())(request)
            self.assertIn(expected_requester, m.output[0])
```

--------------------------------------------------------------------------------

---[FILE: test_migrations.py]---
Location: zulip-main/zerver/tests/test_migrations.py
Signals: Django

```python
# These are tests for Zulip's database migrations.  System documented at:
#   https://zulip.readthedocs.io/en/latest/subsystems/schema-migrations.html
#
# You can also read
#   https://www.caktusgroup.com/blog/2016/02/02/writing-unit-tests-django-migrations/
# to get a tutorial on the framework that inspired this feature.
from unittest import skip
from unittest.mock import patch

from django.db.migrations.state import StateApps
from typing_extensions import override

from zerver.lib.test_classes import MigrationsTestCase

# Important note: These tests are very expensive, and details of
# Django's database transaction model mean it does not super work to
# have a lot of migrations tested in this file at once; so we usually
# delete the old migration tests when adding a new one, so this file
# always has a single migration test in it as an example.
#
# The error you get with multiple similar tests doing migrations on
# the same table is this (table name may vary):
#
#   django.db.utils.OperationalError: cannot ALTER TABLE
#   "zerver_subscription" because it has pending trigger events


@skip("Fails because newer migrations have since been merged.")  # nocoverage
class RenameUserHotspot(MigrationsTestCase):
    migrate_from = "0492_realm_push_notifications_enabled_and_more"
    migrate_to = "0493_rename_userhotspot_to_onboardingstep"

    @override
    def setUp(self) -> None:
        with patch("builtins.print") as _:
            super().setUp()

    @override
    def setUpBeforeMigration(self, apps: StateApps) -> None:
        self.assertRaises(LookupError, lambda: apps.get_model("zerver", "onboardingstep"))

        UserHotspot = apps.get_model("zerver", "userhotspot")

        expected_field_names = {"id", "hotspot", "timestamp", "user"}
        fields_name = {field.name for field in UserHotspot._meta.get_fields()}

        self.assertEqual(fields_name, expected_field_names)

    def test_renamed_model_and_field(self) -> None:
        self.assertRaises(LookupError, lambda: self.apps.get_model("zerver", "userhotspot"))

        OnboardingStep = self.apps.get_model("zerver", "onboardingstep")

        expected_field_names = {"id", "onboarding_step", "timestamp", "user"}
        fields_name = {field.name for field in OnboardingStep._meta.get_fields()}

        self.assertEqual(fields_name, expected_field_names)
```

--------------------------------------------------------------------------------

---[FILE: test_migration_status.py]---
Location: zulip-main/zerver/tests/test_migration_status.py
Signals: Django

```python
from unittest.mock import patch

from django.db import connection
from django.db.migrations.recorder import MigrationRecorder

from zerver.lib.migration_status import (
    STALE_MIGRATIONS,
    AppMigrations,
    get_migration_status,
    parse_migration_status,
)
from zerver.lib.test_classes import ZulipTestCase


class MigrationStatusTests(ZulipTestCase):
    def parse_showmigrations(
        self,
        migration_status_print: str,
        stale_migrations: list[tuple[str, str]] = STALE_MIGRATIONS,
    ) -> AppMigrations:
        """
        Parses the output of Django's `showmigrations` into a data structure
        identical to the output `parse_migration_status` generates.

        Makes sure this accurately parses the output of `showmigrations`.
        """
        lines = migration_status_print.strip().split("\n")
        migrations_dict: AppMigrations = {}
        current_app = None
        line_prefix = ("[X]", "[ ]", "[-]", "(no migrations)")

        stale_migrations_dict: dict[str, list[str]] = {}
        for app, migration in stale_migrations:
            if app not in stale_migrations_dict:
                stale_migrations_dict[app] = []
            stale_migrations_dict[app].append(migration)

        for line in lines:
            line = line.strip()
            if not line.startswith(line_prefix) and line:
                current_app = line
                migrations_dict[current_app] = []
            elif line.startswith(line_prefix):
                assert current_app is not None
                apps_stale_migrations = stale_migrations_dict.get(current_app)
                if (
                    apps_stale_migrations is not None
                    and line != "(no migrations)"
                    and line[4:] in apps_stale_migrations
                ):
                    continue
                migrations_dict[current_app].append(line)

        # Installed apps that have no migrations and we still use will have
        # "(no migrations)" as its only "migrations" list. Ones that just
        # have [] means it's just a left over stale app we can clean up.
        return {app: migrations for app, migrations in migrations_dict.items() if migrations != []}

    def test_parse_showmigrations(self) -> None:
        """
        This function tests a helper test function `parse_showmigrations`.
        It is critical that this correctly checks the behavior of
        `parse_showmigrations`. Make sure it is accurately parsing the
        output of `showmigrations`.
        """
        showmigrations_sample = """
analytics
 [X] 0001_squashed_0021_alter_fillstate_id (21 squashed migrations)
auth
 [ ] 0012_alter_user_first_name_max_length
zerver
 [-] 0015_alter_confirmation_object_id
two_factor
 (no migrations)
"""
        app_migrations = self.parse_showmigrations(showmigrations_sample)
        expected: AppMigrations = {
            "analytics": ["[X] 0001_squashed_0021_alter_fillstate_id (21 squashed migrations)"],
            "auth": ["[ ] 0012_alter_user_first_name_max_length"],
            "zerver": ["[-] 0015_alter_confirmation_object_id"],
            "two_factor": ["(no migrations)"],
        }
        self.assertDictEqual(app_migrations, expected)

        # Run one with the real showmigrations. A more thorough tests of these
        # functions are done in the test_import_export.py as part of the import-
        # export suite.
        showmigrations = get_migration_status(app_label="zerver")
        app_migrations = self.parse_showmigrations(showmigrations)
        zerver_migrations = app_migrations.get("zerver")
        self.assertIsNotNone(zerver_migrations)
        self.assertNotEqual(zerver_migrations, [])

    def test_parse_showmigrations_filters_out_stale_migrations(self) -> None:
        """
        This function tests a helper test function `parse_showmigrations`.
        It is critical that this correctly checks the behavior of
        `parse_showmigrations`. Make sure it is accurately parsing the
        output of `showmigrations`.
        """
        assert ("guardian", "0001_initial") in STALE_MIGRATIONS
        showmigrations_sample = """
analytics
 [X] 0001_squashed_0021_alter_fillstate_id (21 squashed migrations)
auth
 [ ] 0012_alter_user_first_name_max_length
zerver
 [-] 0015_alter_confirmation_object_id
two_factor
 (no migrations)
guardian
 [X] 0001_initial
"""
        app_migrations = self.parse_showmigrations(showmigrations_sample)
        expected: AppMigrations = {
            "analytics": ["[X] 0001_squashed_0021_alter_fillstate_id (21 squashed migrations)"],
            "auth": ["[ ] 0012_alter_user_first_name_max_length"],
            "zerver": ["[-] 0015_alter_confirmation_object_id"],
            "two_factor": ["(no migrations)"],
        }
        self.assertDictEqual(app_migrations, expected)

    def test_parse_migration_status(self) -> None:
        """
        This test asserts that the algorithm in `parse_migration_status` is the same
        as Django's `showmigrations`.
        """
        migration_status_print = get_migration_status()
        parsed_showmigrations = self.parse_showmigrations(migration_status_print)
        migration_status_dict = parse_migration_status()
        self.assertDictEqual(migration_status_dict, parsed_showmigrations)

    def test_applied_but_not_recorded(self) -> None:
        # Mock applied_migrations() to simulate empty recorded_migrations.
        with patch(
            "zerver.lib.migration_status.MigrationRecorder.applied_migrations",
        ):
            result = parse_migration_status()
            self.assertIn("[-] 0010_alter_group_name_max_length", result["auth"])

    def test_generate_unapplied_migration(self) -> None:
        recorder = MigrationRecorder(connection)
        recorder.record_unapplied("auth", "0010_alter_group_name_max_length")
        result = parse_migration_status()
        self.assertIn("[ ] 0010_alter_group_name_max_length", result["auth"])
```

--------------------------------------------------------------------------------

````
