---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 982
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 982 of 1290)

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

---[FILE: test_checks.py]---
Location: zulip-main/zerver/tests/test_checks.py
Signals: Django

```python
import os
import re
from contextlib import ExitStack
from typing import Any

from django.core.management import call_command
from django.core.management.base import SystemCheckError
from django.test import override_settings

from zerver.lib.test_classes import ZulipTestCase


class TestChecks(ZulipTestCase):
    def assert_check_with_error(self, test: re.Pattern[str] | str | None, **kwargs: Any) -> None:
        with open(os.devnull, "w") as DEVNULL, override_settings(**kwargs), ExitStack() as stack:
            if isinstance(test, str):
                stack.enter_context(self.assertRaisesMessage(SystemCheckError, test))
            elif isinstance(test, re.Pattern):
                stack.enter_context(self.assertRaisesRegex(SystemCheckError, test))
            call_command("check", stdout=DEVNULL)

    def test_checks_required_setting(self) -> None:
        self.assert_check_with_error(
            "(zulip.E001) You must set ZULIP_ADMINISTRATOR in /etc/zulip/settings.py",
            ZULIP_ADMINISTRATOR="zulip-admin@example.com",
        )

        self.assert_check_with_error(
            "(zulip.E001) You must set ZULIP_ADMINISTRATOR in /etc/zulip/settings.py",
            ZULIP_ADMINISTRATOR="",
        )

        self.assert_check_with_error(
            "(zulip.E001) You must set ZULIP_ADMINISTRATOR in /etc/zulip/settings.py",
            ZULIP_ADMINISTRATOR=None,
        )

    @override_settings(DEVELOPMENT=False, PRODUCTION=True)
    def test_checks_external_host_domain(self) -> None:
        message_re = r"\(zulip\.E002\) EXTERNAL_HOST \(\S+\) does not contain a domain part"
        try:
            # We default to skippping this check in CI, because
            # "testserver" is part of so many tests.  We temporarily
            # strip out the environment variable we use to detect
            # that, so we can trigger the check.
            del os.environ["ZULIP_TEST_SUITE"]

            self.assert_check_with_error(None, EXTERNAL_HOST="server-1.local")

            self.assert_check_with_error(
                re.compile(rf"{message_re}\s*HINT: Add .local to the end"), EXTERNAL_HOST="server-1"
            )

            self.assert_check_with_error(
                re.compile(rf"{message_re}\s*HINT: Add .localdomain to the end"),
                EXTERNAL_HOST="localhost",
            )

        finally:
            os.environ["ZULIP_TEST_SUITE"] = "true"

    def test_checks_external_host_value(self) -> None:
        self.assert_check_with_error(None, EXTERNAL_HOST="testserver.local")
        self.assert_check_with_error(None, EXTERNAL_HOST="testserver.local:443")
        self.assert_check_with_error(None, EXTERNAL_HOST="testserver.local:https")

        self.assert_check_with_error(
            re.compile(r"EXTERNAL_HOST \(\S+\) is too long"),
            EXTERNAL_HOST=("a234567890." * 25 + "local"),
        )

        self.assert_check_with_error(
            re.compile(
                r"\(zulip\.E002\) EXTERNAL_HOST \(\S+\) contains non-ASCII characters\n.*xn--wgv71a119e\.example\.com"
            ),
            EXTERNAL_HOST="日本語.example.com",
        )

        self.assert_check_with_error(
            "EXTERNAL_HOST (-bogus-.example.com) does not validate as a hostname",
            EXTERNAL_HOST="-bogus-.example.com:443",
        )

    def test_checks_auth(self) -> None:
        self.assert_check_with_error(
            (
                'SOCIAL_AUTH_SAML_ENABLED_IDPS["idp_name"]["extra_attrs"]: '
                "(zulip.E003) zulip_groups can't be listed in extra_attrs"
            ),
            SOCIAL_AUTH_SAML_ENABLED_IDPS={
                "idp_name": {
                    "entity_id": "https://idp.testshib.org/idp/shibboleth",
                    "url": "https://idp.testshib.org/idp/profile/SAML2/Redirect/SSO",
                    "attr_user_permanent_id": "email",
                    "attr_first_name": "first_name",
                    "attr_last_name": "last_name",
                    "attr_username": "email",
                    "attr_email": "email",
                    "extra_attrs": ["title", "mobilePhone", "zulip_role", "zulip_groups"],
                }
            },
        )

        self.assert_check_with_error(
            (
                'settings.SOCIAL_AUTH_SYNC_ATTRS_DICT["example_org"]["saml"]["custom__groups"]: '
                "(zulip.E004) zulip_groups can't be listed as a SAML attribute"
            ),
            SOCIAL_AUTH_SYNC_ATTRS_DICT={
                "example_org": {
                    "saml": {
                        "role": "zulip_role",
                        "custom__groups": "zulip_groups",
                        "custom__title": "title",
                        "groups": ["group1", "group2", ("samlgroup3", "zulipgroup3"), "group4"],
                    }
                }
            },
        )
```

--------------------------------------------------------------------------------

---[FILE: test_compatibility.py]---
Location: zulip-main/zerver/tests/test_compatibility.py

```python
from unittest import mock

from zerver.lib.compatibility import (
    find_mobile_os,
    is_outdated_desktop_app,
    is_pronouns_field_type_supported,
    version_lt,
)
from zerver.lib.test_classes import ZulipTestCase


class VersionTest(ZulipTestCase):
    data = [
        case.split()
        for case in """
        1.2.3    <  1.2.4
        1.2.3    =  1.2.3
        1.4.1    >  1.2.3
        1.002a   =  1.2a
        1.2      <  1.2.3
        1.2.3    ?  1.2-dev
        1.2-dev  ?  1.2a
        1.2a     ?  1.2rc3
        1.2rc3   ?  1.2
        1.2      ?  1.2-g0f1e2d3c4
        10.1     >  1.2
        0.17.18  <  16.2.96
        9.10.11  <  16.2.96
        15.1.95  <  16.2.96
        16.2.96  =  16.2.96
        20.0.103 >  16.2.96
    """.strip().split("\n")
    ] + [
        ["", "?", "1"],
        ["", "?", "a"],
    ]

    def test_version_lt(self) -> None:
        for ver1, cmp, ver2 in self.data:
            msg = f"expected {ver1} {cmp} {ver2}"
            if cmp == "<":
                self.assertTrue(version_lt(ver1, ver2), msg=msg)
                self.assertFalse(version_lt(ver2, ver1), msg=msg)
            elif cmp == "=":
                self.assertFalse(version_lt(ver1, ver2), msg=msg)
                self.assertFalse(version_lt(ver2, ver1), msg=msg)
            elif cmp == ">":
                self.assertFalse(version_lt(ver1, ver2), msg=msg)
                self.assertTrue(version_lt(ver2, ver1), msg=msg)
            elif cmp == "?":
                self.assertIsNone(version_lt(ver1, ver2), msg=msg)
                self.assertIsNone(version_lt(ver2, ver1), msg=msg)
            else:
                raise AssertionError  # nocoverage

    mobile_os_data = [
        case.split(None, 1)
        for case in """
      android ZulipMobile/1.2.3 (Android 4.5)
      ios     ZulipMobile/1.2.3 (iPhone OS 2.1)
      ios     ZulipMobile/1.2.3 (iOS 6)
      None    ZulipMobile/1.2.3 (Windows 8)
    """.strip().split("\n")
    ]

    def test_find_mobile_os(self) -> None:
        for expected_, user_agent in self.mobile_os_data:
            expected = None if expected_ == "None" else expected_
            self.assertEqual(find_mobile_os(user_agent), expected, msg=user_agent)


class CompatibilityTest(ZulipTestCase):
    data = [
        case.split(None, 1)
        for case in """
      old ZulipInvalid/5.0
      ok  ZulipMobile/5.0
      ok  ZulipMobile/5.0 (iOS 11)
      ok  ZulipMobile/5.0 (Androidish 9)
      old ZulipMobile/5.0 (Android 9)
      old ZulipMobile/15.1.95 (Android 9)
      old ZulipMobile/16.1.94 (Android 9)
      ok  ZulipMobile/16.2.96 (Android 9)
      ok  ZulipMobile/20.0.103 (Android 9)

      ok  ZulipMobile/0.7.1.1 (iOS 11.4)
      old ZulipMobile/1.0.13 (Android 9)
      ok  ZulipMobile/17.1.98 (iOS 12.0)
      ok  ZulipMobile/19.2.102 (Android 6.0)
      ok  ZulipMobile/1 CFNetwork/974.2.1 Darwin/18.0.0
      ok  ZulipMobile/20.0.103 (Android 6.0.1)
      ok  ZulipMobile/20.0.103 (iOS 12.1)
    """.strip().split("\n")
        if case
    ]

    def test_compatibility_without_user_agent(self) -> None:
        result = self.client_get("/compatibility", skip_user_agent=True)
        self.assert_json_error(result, "User-Agent header missing from request")

    def test_compatibility(self) -> None:
        for expected, user_agent in self.data:
            result = self.client_get("/compatibility", HTTP_USER_AGENT=user_agent)
            if expected == "ok":
                self.assert_json_success(result)
            elif expected == "old":
                self.assert_json_error(result, "Client is too old")
            else:
                raise AssertionError  # nocoverage

    @mock.patch("zerver.lib.compatibility.DESKTOP_MINIMUM_VERSION", "5.0.0")
    @mock.patch("zerver.lib.compatibility.DESKTOP_WARNING_VERSION", "5.2.0")
    def test_insecure_desktop_app(self) -> None:
        self.assertEqual(is_outdated_desktop_app("ZulipDesktop/0.5.2 (Mac)"), (True, True, True))
        self.assertEqual(
            is_outdated_desktop_app(
                "ZulipElectron/2.3.82 Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Zulip/2.3.82 Chrome/61.0.3163.100 Electron/2.0.9 Safari/537.36"
            ),
            (True, True, True),
        )
        self.assertEqual(
            is_outdated_desktop_app(
                "ZulipElectron/4.0.0 Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Zulip/4.0.3 Chrome/66.0.3359.181 Electron/3.1.10 Safari/537.36"
            ),
            (True, True, False),
        )

        self.assertEqual(
            is_outdated_desktop_app(
                "ZulipElectron/4.0.3 Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Zulip/4.0.3 Chrome/66.0.3359.181 Electron/3.1.10 Safari/537.36"
            ),
            (True, True, False),
        )

        # Verify what happens if DESKTOP_MINIMUM_VERSION < v < DESKTOP_WARNING_VERSION
        with mock.patch("zerver.lib.compatibility.DESKTOP_MINIMUM_VERSION", "4.0.3"):
            self.assertEqual(
                is_outdated_desktop_app(
                    "ZulipElectron/4.0.3 Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Zulip/4.0.3 Chrome/66.0.3359.181 Electron/3.1.10 Safari/537.36"
                ),
                (True, False, False),
            )

        self.assertEqual(
            is_outdated_desktop_app(
                "ZulipElectron/5.2.0 Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Zulip/5.2.0 Chrome/80.0.3987.165 Electron/8.2.5 Safari/537.36"
            ),
            (False, False, False),
        )

        self.assertEqual(
            is_outdated_desktop_app(
                "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36"
            ),
            (False, False, False),
        )

        self.assertEqual(is_outdated_desktop_app(""), (False, False, False))

    def test_is_pronouns_field_type_supported(self) -> None:
        self.assertEqual(
            is_pronouns_field_type_supported("ZulipMobile/20.0.103 (Android 6.0.1)"), False
        )
        self.assertEqual(is_pronouns_field_type_supported("ZulipMobile/20.0.103 (iOS 12.0)"), False)

        self.assertEqual(
            is_pronouns_field_type_supported("ZulipMobile/27.191 (Android 6.0.1)"), False
        )
        self.assertEqual(is_pronouns_field_type_supported("ZulipMobile/27.191 (iOS 12.0)"), False)

        self.assertEqual(
            is_pronouns_field_type_supported("ZulipMobile/27.192 (Android 6.0.1)"), True
        )
        self.assertEqual(is_pronouns_field_type_supported("ZulipMobile/27.192 (iOS 12.0)"), True)

        self.assertEqual(
            is_pronouns_field_type_supported(
                "ZulipElectron/5.2.0 Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Zulip/5.2.0 Chrome/80.0.3987.165 Electron/8.2.5 Safari/537.36"
            ),
            True,
        )
```

--------------------------------------------------------------------------------

---[FILE: test_create_video_call.py]---
Location: zulip-main/zerver/tests/test_create_video_call.py
Signals: Django

```python
from unittest import mock

import orjson
import responses
from django.core.signing import Signer
from django.http import HttpResponseRedirect
from django.test import override_settings
from typing_extensions import override

from zerver.lib.test_classes import ZulipTestCase
from zerver.lib.url_encoding import append_url_query_string


@override_settings(VIDEO_ZOOM_SERVER_TO_SERVER_ACCOUNT_ID=None)
class ZoomVideoCallTestUserAuth(ZulipTestCase):
    @override
    def setUp(self) -> None:
        super().setUp()
        self.user = self.example_user("hamlet")
        self.login_user(self.user)

    def test_register_zoom_request_no_settings(self) -> None:
        with self.settings(VIDEO_ZOOM_CLIENT_ID=None):
            response = self.client_get("/calls/zoom/register")
            self.assert_json_error(
                response,
                "Zoom credentials have not been configured",
            )

    def test_register_zoom_request(self) -> None:
        response = self.client_get("/calls/zoom/register")
        self.assertEqual(response.status_code, 302)

    @responses.activate
    def test_create_zoom_video_and_audio_links(self) -> None:
        responses.add(
            responses.POST,
            "https://zoom.example.com/oauth/token",
            json={"access_token": "oldtoken", "expires_in": -60},
        )

        response = self.client_get(
            "/calls/zoom/complete",
            {"code": "code", "state": '{"realm":"zulip","sid":""}'},
        )
        self.assertEqual(response.status_code, 200)

        # Test creating a video link
        responses.replace(
            responses.POST,
            "https://zoom.example.com/oauth/token",
            json={"access_token": "newtoken", "expires_in": 60},
        )

        responses.add(
            responses.POST,
            "https://api.zoom.us/v2/users/me/meetings",
            json={"join_url": "example.com"},
        )

        response = self.client_post("/json/calls/zoom/create", {"is_video_call": "true"})
        self.assertEqual(
            responses.calls[-1].request.url,
            "https://api.zoom.us/v2/users/me/meetings",
        )
        assert responses.calls[-1].request.body is not None
        self.assertEqual(
            orjson.loads(responses.calls[-1].request.body),
            {
                "settings": {
                    "host_video": True,
                    "participant_video": True,
                },
                "default_password": True,
            },
        )
        self.assertEqual(
            responses.calls[-1].request.headers["Authorization"],
            "Bearer newtoken",
        )
        json = self.assert_json_success(response)
        self.assertEqual(json["url"], "example.com")

        # Test creating an audio link
        responses.replace(
            responses.POST,
            "https://zoom.example.com/oauth/token",
            json={"access_token": "newtoken", "expires_in": 60},
        )

        responses.add(
            responses.POST,
            "https://api.zoom.us/v2/users/me/meetings",
            json={"join_url": "example.com"},
        )

        response = self.client_post("/json/calls/zoom/create", {"is_video_call": "false"})
        self.assertEqual(
            responses.calls[-1].request.url,
            "https://api.zoom.us/v2/users/me/meetings",
        )
        assert responses.calls[-1].request.body is not None
        self.assertEqual(
            orjson.loads(responses.calls[-1].request.body),
            {
                "settings": {
                    "host_video": False,
                    "participant_video": False,
                },
                "default_password": True,
            },
        )
        self.assertEqual(
            responses.calls[-1].request.headers["Authorization"],
            "Bearer newtoken",
        )
        json = self.assert_json_success(response)
        self.assertEqual(json["url"], "example.com")

        # Test for authentication error
        self.logout()
        self.login_user(self.user)

        response = self.client_post("/json/calls/zoom/create")
        self.assert_json_error(response, "Invalid Zoom access token")

    def test_create_zoom_realm_redirect(self) -> None:
        response = self.client_get(
            "/calls/zoom/complete",
            {"code": "code", "state": '{"realm":"zephyr","sid":"somesid"}'},
        )
        self.assertEqual(response.status_code, 302)
        self.assertIn("http://zephyr.testserver/", response["Location"])
        self.assertIn("somesid", response["Location"])

    def test_create_zoom_sid_error(self) -> None:
        response = self.client_get(
            "/calls/zoom/complete",
            {"code": "code", "state": '{"realm":"zulip","sid":"bad"}'},
        )
        self.assert_json_error(response, "Invalid Zoom session identifier")

    @responses.activate
    def test_create_zoom_credential_error(self) -> None:
        responses.add(responses.POST, "https://zoom.example.com/oauth/token", status=400)

        response = self.client_get(
            "/calls/zoom/complete",
            {"code": "code", "state": '{"realm":"zulip","sid":""}'},
        )
        self.assert_json_error(response, "Invalid Zoom credentials")

    @responses.activate
    def test_create_zoom_refresh_error(self) -> None:
        responses.add(
            responses.POST,
            "https://zoom.example.com/oauth/token",
            json={"access_token": "token", "expires_in": -60},
        )

        response = self.client_get(
            "/calls/zoom/complete",
            {"code": "code", "state": '{"realm":"zulip","sid":""}'},
        )
        self.assertEqual(response.status_code, 200)

        responses.replace(responses.POST, "https://zoom.example.com/oauth/token", status=400)

        response = self.client_post("/json/calls/zoom/create")
        self.assert_json_error(response, "Invalid Zoom access token")

    @responses.activate
    def test_create_zoom_request_error(self) -> None:
        responses.add(
            responses.POST,
            "https://zoom.example.com/oauth/token",
            json={"access_token": "token"},
        )

        responses.add(
            responses.POST,
            "https://api.zoom.us/v2/users/me/meetings",
            status=400,
        )

        response = self.client_get(
            "/calls/zoom/complete",
            {"code": "code", "state": '{"realm":"zulip","sid":""}'},
        )
        self.assertEqual(response.status_code, 200)

        response = self.client_post("/json/calls/zoom/create")
        self.assert_json_error(response, "Failed to create Zoom call")

        responses.replace(
            responses.POST,
            "https://api.zoom.us/v2/users/me/meetings",
            status=401,
        )

        response = self.client_post("/json/calls/zoom/create")
        self.assert_json_error(response, "Invalid Zoom access token")

    @responses.activate
    def test_deauthorize_zoom_user(self) -> None:
        response = self.client_post(
            "/calls/zoom/deauthorize",
            """\
{
  "event": "app_deauthorized",
  "payload": {
    "user_data_retention": "false",
    "account_id": "EabCDEFghiLHMA",
    "user_id": "z9jkdsfsdfjhdkfjQ",
    "signature": "827edc3452044f0bc86bdd5684afb7d1e6becfa1a767f24df1b287853cf73000",
    "deauthorization_time": "2019-06-17T13:52:28.632Z",
    "client_id": "ADZ9k9bTWmGUoUbECUKU_a"
  }
}
""",
            content_type="application/json",
        )
        self.assert_json_success(response)


class ZoomVideoCallTestServerAuth(ZulipTestCase):
    @override
    def setUp(self) -> None:
        super().setUp()
        self.user = self.example_user("hamlet")
        self.login_user(self.user)
        self.user_zoom_meeting_url = (
            f"https://api.zoom.us/v2/users/{self.user.delivery_email}/meetings"
        )

    @responses.activate
    def test_zoom_invalid_settings(self) -> None:
        with self.settings(VIDEO_ZOOM_CLIENT_ID=None):
            response = self.client_post("/json/calls/zoom/create")
            self.assert_json_error(
                response,
                "Zoom credentials have not been configured",
            )

        responses.add(responses.POST, "https://zoom.example.com/oauth/token", status=400)
        response = self.client_post("/json/calls/zoom/create")
        self.assert_json_error(response, "Invalid Zoom credentials")

    @responses.activate
    def test_zoom_invalid_access_token_error(self) -> None:
        responses.add(
            responses.POST,
            "https://zoom.example.com/oauth/token",
            json={"access_token": "token"},
        )

        responses.add(
            responses.POST,
            self.user_zoom_meeting_url,
            status=400,
            json={"code": 124, "message": "API key expired"},
        )
        with self.assertLogs(level="ERROR") as error_log:
            response = self.client_post("/json/calls/zoom/create")
            self.assertEqual(
                error_log.output[0],
                "ERROR:root:Unexpected Zoom error 124: API key expired",
            )
        self.assert_json_error(response, "Failed to create Zoom call")

    @responses.activate
    def test_zoom_unknown_email_error(self) -> None:
        responses.add(
            responses.POST,
            "https://zoom.example.com/oauth/token",
            json={"access_token": "token"},
        )

        responses.add(responses.POST, self.user_zoom_meeting_url, status=400, json={"code": 1001})
        response = self.client_post("/json/calls/zoom/create")
        self.assert_json_error(response, "Unknown Zoom user email")

    @responses.activate
    def test_zoom_error_api_response_code_unknown(self) -> None:
        responses.add(
            responses.POST,
            "https://zoom.example.com/oauth/token",
            json={"access_token": "token"},
        )

        responses.add(responses.POST, self.user_zoom_meeting_url, status=400, json={"code": 300})
        response = self.client_post("/json/calls/zoom/create")
        self.assert_json_error(response, "Failed to create Zoom call")

    @responses.activate
    def test_zoom_create_video_call(self) -> None:
        responses.add(
            responses.POST,
            "https://zoom.example.com/oauth/token",
            json={"access_token": "token", "expires_in": 3599},
        )

        responses.add(
            responses.POST,
            self.user_zoom_meeting_url,
            json={"join_url": "example.com"},
        )

        response = self.client_post("/json/calls/zoom/create", {"is_video_call": "true"})
        self.assertEqual(
            responses.calls[-1].request.url,
            self.user_zoom_meeting_url,
        )
        assert responses.calls[-1].request.body is not None
        self.assertEqual(
            orjson.loads(responses.calls[-1].request.body),
            {
                "settings": {
                    "host_video": True,
                    "participant_video": True,
                },
                "default_password": True,
            },
        )
        self.assertEqual(
            responses.calls[-1].request.headers["Authorization"],
            "Bearer token",
        )
        json = self.assert_json_success(response)
        self.assertEqual(json["url"], "example.com")

    @responses.activate
    def test_zoom_create_audio_call(self) -> None:
        responses.add(
            responses.POST,
            "https://zoom.example.com/oauth/token",
            json={"access_token": "token", "expires_in": 3599},
        )

        responses.add(
            responses.POST,
            self.user_zoom_meeting_url,
            json={"join_url": "example.com"},
        )

        response = self.client_post("/json/calls/zoom/create", {"is_video_call": "false"})
        self.assertEqual(
            responses.calls[-1].request.url,
            self.user_zoom_meeting_url,
        )
        assert responses.calls[-1].request.body is not None
        self.assertEqual(
            orjson.loads(responses.calls[-1].request.body),
            {
                "settings": {
                    "host_video": False,
                    "participant_video": False,
                },
                "default_password": True,
            },
        )
        self.assertEqual(
            responses.calls[-1].request.headers["Authorization"],
            "Bearer token",
        )
        json = self.assert_json_success(response)
        self.assertEqual(json["url"], "example.com")


class BigBlueButtonVideoCallTest(ZulipTestCase):
    @override
    def setUp(self) -> None:
        super().setUp()
        self.user = self.example_user("hamlet")
        self.login_user(self.user)
        self.signer = Signer()
        self.signed_bbb_a_object = self.signer.sign_object(
            {
                "meeting_id": "a",
                "name": "a",
                "lock_settings_disable_cam": True,
                "moderator": self.user.id,
            }
        )
        # For testing viewer role (different creator / moderator from self)
        self.signed_bbb_a_object_different_creator = self.signer.sign_object(
            {
                "meeting_id": "a",
                "name": "a",
                "lock_settings_disable_cam": True,
                "moderator": self.example_user("cordelia").id,
            }
        )

    def test_create_bigbluebutton_link(self) -> None:
        with (
            mock.patch("zerver.views.video_calls.random.randint", return_value="1"),
            mock.patch("secrets.token_bytes", return_value=b"\x00" * 20),
        ):
            with mock.patch("zerver.views.video_calls.random.randint", return_value="1"):
                response = self.client_get(
                    "/json/calls/bigbluebutton/create?meeting_name=general > meeting&voice_only=false"
                )
            response_dict = self.assert_json_success(response)
            self.assertEqual(
                response_dict["url"],
                append_url_query_string(
                    "/calls/bigbluebutton/join",
                    "bigbluebutton="
                    + self.signer.sign_object(
                        {
                            "meeting_id": "zulip-1",
                            "name": "general > meeting",
                            "lock_settings_disable_cam": False,
                            "moderator": self.user.id,
                        }
                    ),
                ),
            )

            # Testing for audio call
            response = self.client_get(
                "/json/calls/bigbluebutton/create?meeting_name=general > meeting&voice_only=true"
            )
            response_dict = self.assert_json_success(response)
            self.assertEqual(
                response_dict["url"],
                append_url_query_string(
                    "/calls/bigbluebutton/join",
                    "bigbluebutton="
                    + self.signer.sign_object(
                        {
                            "meeting_id": "zulip-1",
                            "name": "general > meeting",
                            "lock_settings_disable_cam": True,
                            "moderator": self.user.id,
                        }
                    ),
                ),
            )

    @responses.activate
    def test_join_bigbluebutton_redirect(self) -> None:
        responses.add(
            responses.GET,
            "https://bbb.example.com/bigbluebutton/api/create?meetingID=a&name=a&lockSettingsDisableCam=True"
            "&checksum=33349e6374ca9b2d15a0c6e51a42bc3e8f770de13f88660815c6449859856e20",
            "<response><returncode>SUCCESS</returncode><messageKey/><createTime>0</createTime></response>",
        )
        response = self.client_get(
            "/calls/bigbluebutton/join", {"bigbluebutton": self.signed_bbb_a_object}
        )
        self.assertEqual(response.status_code, 302)
        self.assertEqual(isinstance(response, HttpResponseRedirect), True)
        self.assertEqual(
            response["Location"],
            "https://bbb.example.com/bigbluebutton/api/join?meetingID=a&"
            "role=MODERATOR&fullName=King%20Hamlet&createTime=0&checksum=54259b884a7c20ddcd7b280a1b62e59d7990568fe4f22001812bc4bcfd161a46",
        )
        # Testing for viewer role
        response = self.client_get(
            "/calls/bigbluebutton/join",
            {"bigbluebutton": self.signed_bbb_a_object_different_creator},
        )
        self.assertEqual(response.status_code, 302)
        self.assertEqual(isinstance(response, HttpResponseRedirect), True)
        self.assertEqual(
            response["Location"],
            "https://bbb.example.com/bigbluebutton/api/join?meetingID=a&"
            "role=VIEWER&fullName=King%20Hamlet&createTime=0&checksum=52efaf64109ca4ec5a20a1d295f315af53f9e6ec30b50ed3707fd2909ac6bd94",
        )

    @responses.activate
    def test_join_bigbluebutton_invalid_signature(self) -> None:
        responses.add(
            responses.GET,
            "https://bbb.example.com/bigbluebutton/api/create?meetingID=a&name=a&lockSettingsDisableCam=True"
            "&checksum=33349e6374ca9b2d15a0c6e51a42bc3e8f770de13f88660815c6449859856e20",
            "<response><returncode>SUCCESS</returncode><messageKey/><createTime>0</createTime></response>",
        )
        response = self.client_get(
            "/calls/bigbluebutton/join", {"bigbluebutton": self.signed_bbb_a_object + "zoo"}
        )
        self.assert_json_error(response, "Invalid signature.")

    @responses.activate
    def test_join_bigbluebutton_redirect_wrong_big_blue_button_checksum(self) -> None:
        responses.add(
            responses.GET,
            "https://bbb.example.com/bigbluebutton/api/create?meetingID=a&name=a&lockSettingsDisableCam=True&checksum=33349e6374ca9b2d15a0c6e51a42bc3e8f770de13f88660815c6449859856e20",
            "<response><returncode>FAILED</returncode><messageKey>checksumError</messageKey>"
            "<message>You did not pass the checksum security check</message></response>",
        )
        response = self.client_get(
            "/calls/bigbluebutton/join",
            {"bigbluebutton": self.signed_bbb_a_object},
        )
        self.assert_json_error(response, "Error authenticating to the BigBlueButton server.")

    @responses.activate
    def test_join_bigbluebutton_redirect_server_error(self) -> None:
        # Simulate bbb server error
        responses.add(
            responses.GET,
            "https://bbb.example.com/bigbluebutton/api/create?meetingID=a&name=a&lockSettingsDisableCam=True&checksum=33349e6374ca9b2d15a0c6e51a42bc3e8f770de13f88660815c6449859856e20",
            "",
            status=500,
        )
        response = self.client_get(
            "/calls/bigbluebutton/join",
            {"bigbluebutton": self.signed_bbb_a_object},
        )
        self.assert_json_error(response, "Error connecting to the BigBlueButton server.")

    @responses.activate
    def test_join_bigbluebutton_redirect_error_by_server(self) -> None:
        # Simulate bbb server error
        responses.add(
            responses.GET,
            "https://bbb.example.com/bigbluebutton/api/create?meetingID=a&name=a&lockSettingsDisableCam=True&checksum=33349e6374ca9b2d15a0c6e51a42bc3e8f770de13f88660815c6449859856e20",
            "<response><returncode>FAILURE</returncode><messageKey>otherFailure</messageKey></response>",
        )
        response = self.client_get(
            "/calls/bigbluebutton/join",
            {"bigbluebutton": self.signed_bbb_a_object},
        )
        self.assert_json_error(response, "BigBlueButton server returned an unexpected error.")

    def test_join_bigbluebutton_redirect_not_configured(self) -> None:
        with self.settings(BIG_BLUE_BUTTON_SECRET=None, BIG_BLUE_BUTTON_URL=None):
            response = self.client_get(
                "/calls/bigbluebutton/join",
                {"bigbluebutton": self.signed_bbb_a_object},
            )
            self.assert_json_error(response, "BigBlueButton is not configured.")
```

--------------------------------------------------------------------------------

````
