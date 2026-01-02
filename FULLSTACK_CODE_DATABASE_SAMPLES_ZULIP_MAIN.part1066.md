---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 1066
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1066 of 1290)

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

---[FILE: test_urls.py]---
Location: zulip-main/zerver/tests/test_urls.py
Signals: Django

```python
import os
from unittest import mock

from django.test import Client

from zerver.lib.test_classes import ZulipTestCase
from zerver.lib.url_redirects import (
    API_DOCUMENTATION_REDIRECTS,
    LANDING_PAGE_REDIRECTS,
    POLICY_DOCUMENTATION_REDIRECTS,
)
from zerver.models import Stream


class PublicURLTest(ZulipTestCase):
    """
    Account creation URLs are accessible even when not logged in. Authenticated
    URLs redirect to a page.
    """

    def fetch(self, method: str, urls: list[str], expected_status: int) -> None:
        for url in urls:
            # e.g. self.client_post(url) if method is "post"
            response = getattr(self, method)(url)
            self.assertEqual(
                response.status_code,
                expected_status,
                msg=f"Expected {expected_status}, received {response.status_code} for {method} to {url}",
            )

    def test_api_doc_pages(self) -> None:
        # Test all files in api_docs documentation directory (except for 'index.md',
        # 'missing.md', "api-doc-template.md", `api_docs/include/` and `api_docs/unmerged.d/` files).

        api_doc_urls = []
        for doc in os.listdir("./api_docs/"):
            if doc.startswith(".") or "~" in doc or "#" in doc:
                continue  # nocoverage -- just here for convenience
            if doc in {"index.md", "include", "missing.md", "api-doc-template.md", "unmerged.d"}:
                continue
            url = "/api/" + os.path.splitext(doc)[0]  # Strip the extension.
            api_doc_urls.append(url)

        # We have lots of api_docs files, so this will be expensive!
        self.assertGreater(len(api_doc_urls), 25)

        expected_tag = """<meta property="og:description" content="This is an API docs page" />"""

        for url in api_doc_urls:
            with mock.patch(
                "zerver.lib.html_to_text.html_to_text", return_value="This is an API docs page"
            ) as m:
                response = self.client_get(url)
                m.assert_called_once()
                self.assertIn(expected_tag, response.content.decode())
                self.assertEqual(response.status_code, 200)

    def test_design_testing_pages(self) -> None:
        urls = {
            "/devtools/buttons/": "Button styles browser",
            "/devtools/banners/": "Banner styles browser",
            "/devtools/inputs/": "Input styles browser",
        }

        for url, expected_content in urls.items():
            result = self.client_get(url)
            self.assertEqual(result.status_code, 200)
            self.assert_in_success_response([expected_content], result)

    def test_public_urls(self) -> None:
        """
        Test which views are accessible when not logged in.
        """
        # FIXME: We should also test the Tornado URLs -- this codepath
        # can't do so because this Django test mechanism doesn't go
        # through Tornado.
        denmark_stream_id = Stream.objects.get(name="Denmark").id
        get_urls = {
            200: [
                "/accounts/home/",
                "/accounts/login/",
                "/en/accounts/home/",
                "/ru/accounts/home/",
                "/en/accounts/login/",
                "/ru/accounts/login/",
                "/api/",
                # Since web-public streams are enabled in this `zulip`
                # instance, the public access experience is loaded directly.
                "/",
                "/en/",
                "/ru/",
            ],
            400: [
                "/json/messages",
            ],
            401: [
                f"/json/streams/{denmark_stream_id}/members",
                "/api/v1/users/me/subscriptions",
                "/api/v1/messages",
                "/api/v1/streams",
            ],
            404: [
                "/api/api-doc-template",
                "/api/nonexistent",
                "/api/include/admin",
                "/api/" + "z" * 1000,
            ],
        }

        post_urls = {
            200: ["/accounts/login/"],
            302: ["/accounts/logout/"],
            401: [
                "/json/messages",
                "/json/invites",
                "/api/v1/users/me/subscriptions/properties",
                "/json/fetch_api_key",
                "/json/users/me/subscriptions",
                "/api/v1/users/me/subscriptions",
                "/json/export/realm",
            ],
            400: [
                "/api/v1/external/github",
                "/api/v1/fetch_api_key",
            ],
        }
        patch_urls = {
            401: ["/json/settings"],
        }

        for status_code, url_set in get_urls.items():
            self.fetch("client_get", url_set, status_code)
        for status_code, url_set in post_urls.items():
            self.fetch("client_post", url_set, status_code)
        for status_code, url_set in patch_urls.items():
            self.fetch("client_patch", url_set, status_code)

    def test_config_error_endpoints_dev_env(self) -> None:
        """
        The content of these pages is tested separately.
        Here we simply sanity-check that all the URLs load
        correctly.
        """
        auth_error_pages = [
            "apple",
            "dev_not_supported",
            "github",
            "gitlab",
            "google",
            "ldap",
            "remote_user_backend_disabled",
            "remote_user_header_missing",
            "saml",
            "smtp",
        ]
        urls = [f"/config-error/{err_page_name}" for err_page_name in auth_error_pages]
        with self.settings(DEVELOPMENT=True):
            for url in urls:
                with self.assertLogs("django.request", level="ERROR") as m:
                    response = self.client_get(url)
                    self.assertEqual(response.status_code, 500)
                    self.assert_in_response("Configuration error", response)
                    self.assertEqual(
                        m.output,
                        [f"ERROR:django.request:Internal Server Error: {url}"],
                    )


class ErrorPageTest(ZulipTestCase):
    def test_bogus_http_host(self) -> None:
        # This tests that we've successfully worked around a certain bug in
        # Django's exception handling.  The enforce_csrf_checks=True,
        # secure=True, and HTTP_REFERER with an `https:` scheme are all
        # there to get us down just the right path for Django to blow up
        # when presented with an HTTP_HOST that's not a valid DNS name.
        client = Client(enforce_csrf_checks=True)
        result = client.post(
            "/json/users", secure=True, HTTP_REFERER="https://somewhere", HTTP_HOST="$nonsense"
        )
        self.assertEqual(result.status_code, 400)


class RedirectURLTest(ZulipTestCase):
    def test_api_redirects(self) -> None:
        for redirect in API_DOCUMENTATION_REDIRECTS:
            result = self.client_get(redirect.old_url, follow=True)
            self.assert_in_success_response(["Zulip homepage", "API documentation home"], result)

    def test_policy_redirects(self) -> None:
        for redirect in POLICY_DOCUMENTATION_REDIRECTS:
            result = self.client_get(redirect.old_url, follow=True)
            self.assert_in_success_response(["Policies", "Archive"], result)

    def test_landing_page_redirects(self) -> None:
        for redirect in LANDING_PAGE_REDIRECTS:
            if redirect.old_url != "/try-zulip/":
                result = self.client_get(redirect.old_url, follow=True)
                self.assert_in_success_response(["Download"], result)

            result = self.client_get(redirect.old_url)
            self.assertEqual(result.status_code, 301)
            self.assertIn(redirect.new_url, result["Location"])
```

--------------------------------------------------------------------------------

---[FILE: test_url_decoding.py]---
Location: zulip-main/zerver/tests/test_url_decoding.py

```python
import orjson

from zerver.lib.narrow_helpers import NarrowTerm
from zerver.lib.test_classes import ZulipTestCase
from zerver.lib.url_decoding import is_same_server_message_link, parse_narrow_url


class URLDecodeTest(ZulipTestCase):
    def test_is_same_server_message_link(self) -> None:
        tests = orjson.loads(self.fixture_data("message_link_test_cases.json"))
        for test in tests:
            self.assertEqual(
                is_same_server_message_link(test["message_link"]), test["expected_output"]
            )


class NarrowURLDecodeTest(ZulipTestCase):
    def test_decode_narrow_url(self) -> None:
        tests = orjson.loads(self.fixture_data("narrow_url_to_narrow_terms.json"))

        for test_case in tests:
            with self.subTest(name=test_case["name"]):
                parsed_terms = parse_narrow_url(test_case["near_link"])
                expected_output = test_case.get("expected_output")

                if expected_output is None:
                    self.assertEqual(parsed_terms, expected_output)
                else:
                    assert parsed_terms is not None
                    expected_narrow_terms: list[NarrowTerm] = [
                        NarrowTerm(**term) for term in expected_output
                    ]
                    self.assertListEqual(parsed_terms, expected_narrow_terms)
```

--------------------------------------------------------------------------------

---[FILE: test_url_encoding.py]---
Location: zulip-main/zerver/tests/test_url_encoding.py

```python
from zerver.lib.test_classes import ZulipTestCase
from zerver.lib.url_encoding import (
    encode_channel,
    encode_hash_component,
    encode_user_full_name_and_id,
    encode_user_ids,
    stream_message_url,
)
from zerver.models.messages import Message
from zerver.models.realms import get_realm
from zerver.models.streams import get_stream


class URLEncodeTest(ZulipTestCase):
    def test_encode_channel(self) -> None:
        # We have more tests for this function in `test_topic_link_utils.py`
        self.assertEqual(encode_channel(9, "Verona"), "9-Verona")
        self.assertEqual(encode_channel(123, "General"), "123-General")
        self.assertEqual(encode_channel(7, "random_channel"), "7-random_channel")
        self.assertEqual(encode_channel(9, "Verona", with_operator=True), "channel/9-Verona")

    def test_encode_user_ids(self) -> None:
        # Group narrow URL has 3 or more user IDs
        self.assertEqual(encode_user_ids([1, 2, 3]), "1,2,3-group")
        self.assertEqual(encode_user_ids([3, 1, 2]), "1,2,3-group")

        # One-on-one narrow URL has 2 user IDs
        self.assertEqual(encode_user_ids([1, 2]), "1,2")

        # Narrow URL to ones own direct message conversation
        self.assertEqual(encode_user_ids([1]), "1")

        self.assertEqual(encode_user_ids([1, 2, 3], with_operator=True), "dm/1,2,3-group")
        with self.assertRaises(AssertionError):
            encode_user_ids([])

    def test_encode_user_full_name_and_id(self) -> None:
        self.assertEqual(encode_user_full_name_and_id("King Hamlet", 9), "9-King-Hamlet")
        self.assertEqual(
            encode_user_full_name_and_id("King Hamlet", 9, with_operator=True), "dm/9-King-Hamlet"
        )
        self.assertEqual(encode_user_full_name_and_id("ZOE", 1), "1-ZOE")
        self.assertEqual(encode_user_full_name_and_id("  User Name  ", 100), "100-User-Name")
        self.assertEqual(encode_user_full_name_and_id("User  Name", 101), "101-User-Name")
        self.assertEqual(encode_user_full_name_and_id("User/Name", 200), "200-User-Name")
        self.assertEqual(encode_user_full_name_and_id("User%Name", 201), "201-User-Name")
        self.assertEqual(encode_user_full_name_and_id("User<Name>", 202), "202-User-Name-")
        self.assertEqual(encode_user_full_name_and_id('User"Name`', 203), "203-User-Name-")
        self.assertEqual(encode_user_full_name_and_id('User/ % < > ` " Name', 204), "204-User-Name")
        self.assertEqual(encode_user_full_name_and_id("User--Name", 205), "205-User--Name")
        self.assertEqual(encode_user_full_name_and_id("User%%Name", 206), "206-User-Name")
        self.assertEqual(encode_user_full_name_and_id("User_Name", 5), "5-User_Name")

    def test_stream_message_url(self) -> None:
        realm = get_realm("zulip")
        topic = "test topic"
        channel = get_stream("Verona", realm)
        channel_message_id = self.send_stream_message(
            sender=self.example_user("hamlet"), stream_name=channel.name, topic_name=topic
        )
        channel_message = Message.objects.get(id=channel_message_id, realm=realm)
        message_dict = dict(
            id=channel_message_id,
            stream_id=channel.id,
            display_recipient=channel_message.recipient.label(),
            topic=topic,
        )
        channel_message_url = stream_message_url(
            realm,
            message_dict,
        )
        expected_channel_message_url = f"{realm.url}/#narrow/{encode_channel(channel.id, channel.name, True)}/topic/{encode_hash_component(topic)}/near/{channel_message_id}"
        self.assertEqual(channel_message_url, expected_channel_message_url)

        relative_channel_message_url = stream_message_url(
            realm, message_dict, include_base_url=False
        )
        expected_relative_channel_message_url = f"#narrow/{encode_channel(channel.id, channel.name, True)}/topic/{encode_hash_component(topic)}/near/{channel_message_id}"
        self.assertEqual(relative_channel_message_url, expected_relative_channel_message_url)

        with self.assertRaises(ValueError) as e:
            stream_message_url(realm=None, message=message_dict, include_base_url=True)
        self.assertEqual(str(e.exception), "realm is required when include_base_url=True")
```

--------------------------------------------------------------------------------

````
