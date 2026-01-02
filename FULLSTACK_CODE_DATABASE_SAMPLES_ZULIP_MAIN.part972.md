---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 972
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 972 of 1290)

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

---[FILE: testing.yaml]---
Location: zulip-main/zerver/openapi/testing.yaml

```yaml
openapi: 3.0.1
info:
  title: Test API
  version: 1.0.0
servers:
  - url: "http://localhost:9991/api/v1"
paths:
  /test1:
    get:
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                type: object
                additionalProperties: false
                properties:
                  top_array:
                    type: array
                    items:
                      oneOf:
                        - type: object
                          properties:
                            obj:
                              oneOf:
                                - type: array
                                  items:
                                    type: string
                                - type: object
                                  properties:
                                    str3:
                                      type: string
                        - type: array
                          items:
                            type: object
                            properties:
                              str1:
                                type: string
                              str2:
                                type: string
  /test2:
    get:
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                type: object
                additionalProperties: false
                properties:
                  top_array:
                    type: array
                    items:
                      oneOf:
                        - type: object
                          properties:
                            obj:
                              oneOf:
                                - type: array
                                  items:
                                    type: string
                                - type: object
                                  additionalProperties: false
                                  properties:
                                    str3:
                                      type: string
                        - type: array
                          items:
                            type: object
                            properties:
                              str1:
                                type: string
                              str2:
                                type: string
  /test3:
    get:
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                type: object
                additionalProperties: false
                properties:
                  top_array:
                    type: array
                    items:
                      oneOf:
                        - type: object
                          properties:
                            obj:
                              oneOf:
                                - type: array
                                  items:
                                    type: string
                                - type: object
                        - type: array
                          items:
                            type: object
                            properties:
                              str1:
                                type: string
                              str2:
                                type: string
```

--------------------------------------------------------------------------------

---[FILE: test_curl_examples.py]---
Location: zulip-main/zerver/openapi/test_curl_examples.py
Signals: Django

```python
# Zulip's OpenAPI-based API documentation system is documented at
#   https://zulip.readthedocs.io/en/latest/documentation/api.html
#
# This file contains the top-level logic for testing the cURL examples
# in Zulip's API documentation; the details are in
# zerver.openapi.curl_param_value_generators.

import html
import json
import os
import re
import shlex
import subprocess

import markdown
from django.conf import settings
from zulip import Client

from zerver.models.realms import get_realm
from zerver.openapi import markdown_extension
from zerver.openapi.curl_param_value_generators import (
    AUTHENTICATION_LINE,
    assert_all_helper_functions_called,
)
from zerver.openapi.openapi import get_endpoint_from_operationid

UNTESTED_GENERATED_CURL_EXAMPLES = {
    # Would need push notification bouncer set up to test the
    # generated curl example for the following three endpoints.
    "e2ee-test-notify",
    "test-notify",
    "register-remote-push-device",
    # Having a message for a specific user available to test this endpoint
    # is tricky for testing.
    "delete-reminder",
}


def test_generated_curl_examples_for_success(client: Client) -> None:
    default_authentication_line = f"{client.email}:{client.api_key}"
    # A limited Markdown engine that just processes the code example syntax.
    realm = get_realm("zulip")
    md_engine = markdown.Markdown(
        extensions=[markdown_extension.makeExtension(api_url=realm.url + "/api")]
    )

    # We run our curl tests in alphabetical order (except that we
    # delay the deactivate-user test to the very end), since we depend
    # on "add" tests coming before "remove" tests in some cases.  We
    # should try to either avoid ordering dependencies or make them
    # very explicit.
    rest_endpoints_path = os.path.join(settings.DEPLOY_ROOT, "api_docs/include/rest-endpoints.md")
    with open(rest_endpoints_path) as f:
        rest_endpoints_raw = f.read()
    ENDPOINT_REGEXP = re.compile(r"/api/\s*(.*?)\)")
    documented_endpoints = set(re.findall(ENDPOINT_REGEXP, rest_endpoints_raw))
    endpoints_to_test = sorted(documented_endpoints.difference(UNTESTED_GENERATED_CURL_EXAMPLES))

    for endpoint in endpoints_to_test:
        article_name = endpoint + ".md"
        file_name = os.path.join(settings.DEPLOY_ROOT, "api_docs/", article_name)

        if os.path.exists(file_name):
            with open(file_name) as f:
                curl_commands_to_test = [
                    # A typical example from the Markdown source looks like this:
                    #     {generate_code_example(curl)|...|...}
                    line
                    for line in f
                    if line.startswith("{generate_code_example(curl")
                ]
        else:
            # If the file doesn't exist, then it has been
            # deleted and its page is generated by the
            # template. Thus, the curl example would just
            # a single one following the template's pattern.
            endpoint_path, endpoint_method = get_endpoint_from_operationid(endpoint)
            endpoint_string = endpoint_path + ":" + endpoint_method
            command = f"{{generate_code_example(curl)|{endpoint_string}|example}}"
            curl_commands_to_test = [command]

        for line in curl_commands_to_test:
            # To do an end-to-end test on the documentation examples
            # that will be actually shown to users, we use the
            # Markdown rendering pipeline to compute the user-facing
            # example, and then run that to test it.

            # Set AUTHENTICATION_LINE to default_authentication_line.
            # Set this every iteration, because deactivate_own_user
            # will override this for its test.
            AUTHENTICATION_LINE[0] = default_authentication_line

            curl_command_html = md_engine.convert(line.strip())
            unescaped_html = html.unescape(curl_command_html)
            curl_regex = re.compile(r"<code>curl\n(.*?)</code>", re.DOTALL)
            commands = re.findall(curl_regex, unescaped_html)

            for curl_command_text in commands:
                curl_command_text = curl_command_text.replace(
                    "BOT_EMAIL_ADDRESS:BOT_API_KEY", AUTHENTICATION_LINE[0]
                )

                print("Testing {} ...".format(curl_command_text.split("\n")[0]))

                # Turn the text into an arguments list.
                generated_curl_command = [x for x in shlex.split(curl_command_text) if x != "\n"]

                response_json = None
                response = None
                try:
                    # We split this across two lines so if curl fails and
                    # returns non-JSON output, we'll still print it.
                    response_json = subprocess.check_output(generated_curl_command, text=True)
                    response = json.loads(response_json)
                    assert response["result"] == "success"
                except (AssertionError, Exception):
                    error_template = """
Error verifying the success of the API documentation curl example.

File: {file_name}
Line: {line}
Curl command:
{curl_command}
Response:
{response}

This test is designed to check each generate_code_example(curl) instance in the
API documentation for success. If this fails then it means that the curl example
that was generated was faulty and when tried, it resulted in an unsuccessful
response.

Common reasons for why this could occur:
    1. One or more example values in zerver/openapi/zulip.yaml for this endpoint
       do not line up with the values in the test database.
    2. One or more mandatory parameters were included in the "exclude" list.

To learn more about the test itself, see zerver/openapi/test_curl_examples.py.
"""
                    print(
                        error_template.format(
                            file_name=file_name,
                            line=line,
                            curl_command=generated_curl_command,
                            response=(
                                response_json
                                if response is None
                                else json.dumps(response, indent=4)
                            ),
                        )
                    )
                    raise

    assert_all_helper_functions_called()
```

--------------------------------------------------------------------------------

---[FILE: test_alert_words.py]---
Location: zulip-main/zerver/tests/test_alert_words.py

```python
import orjson

from zerver.actions.alert_words import do_add_alert_words, do_remove_alert_words
from zerver.lib.alert_words import alert_words_in_realm, user_alert_words
from zerver.lib.test_classes import ZulipTestCase
from zerver.lib.test_helpers import most_recent_message, most_recent_usermessage
from zerver.models import AlertWord, UserProfile


class AlertWordTests(ZulipTestCase):
    interesting_alert_word_list = ["alert", "multi-word word", "☃"]

    def get_user(self) -> UserProfile:
        # One nice thing about Hamlet is that he is
        # already subscribed to Denmark.
        user = self.example_user("hamlet")

        # delete words from populate_db to simplify tests
        AlertWord.objects.filter(user_profile=user).delete()
        return user

    def test_internal_endpoint(self) -> None:
        user = self.get_user()
        self.login_user(user)

        params = {
            "alert_words": orjson.dumps(["milk", "cookies"]).decode(),
        }
        result = self.client_post("/json/users/me/alert_words", params)
        self.assert_json_success(result)

        words = user_alert_words(user)
        self.assertEqual(set(words), {"milk", "cookies"})

    def test_default_no_words(self) -> None:
        """
        Users start out with no alert words.
        """
        user = self.get_user()
        words = user_alert_words(user)
        self.assertEqual(words, [])

    def test_basics(self) -> None:
        """
        Verifies the basic behavior of modifying alert words.

        Also verifies the cache-flushing behavior.
        """
        user = self.get_user()
        realm_alert_words = alert_words_in_realm(user.realm)
        self.assert_length(realm_alert_words.get(user.id, []), 0)

        # Add several words, including multi-word and non-ascii words.
        do_add_alert_words(user, self.interesting_alert_word_list)

        words = user_alert_words(user)
        self.assertEqual(set(words), set(self.interesting_alert_word_list))
        realm_alert_words = alert_words_in_realm(user.realm)
        self.assert_length(realm_alert_words[user.id], 3)

        # Test the case-insensitivity of adding words
        do_add_alert_words(user, {"ALert", "ALERT"})
        words = user_alert_words(user)
        self.assertEqual(set(words), set(self.interesting_alert_word_list))
        realm_alert_words = alert_words_in_realm(user.realm)
        self.assert_length(realm_alert_words[user.id], 3)

        # Test the case-insensitivity of removing words
        do_remove_alert_words(user, {"ALert"})
        words = user_alert_words(user)
        self.assertEqual(set(words), set(self.interesting_alert_word_list) - {"alert"})
        realm_alert_words = alert_words_in_realm(user.realm)
        self.assert_length(realm_alert_words[user.id], 2)

    def test_remove_word(self) -> None:
        """
        Removing alert words works via do_remove_alert_words, even
        for multi-word and non-ascii words.
        """
        user = self.get_user()

        expected_remaining_alerts = set(self.interesting_alert_word_list)
        do_add_alert_words(user, self.interesting_alert_word_list)

        for alert_word in self.interesting_alert_word_list:
            do_remove_alert_words(user, [alert_word])
            expected_remaining_alerts.remove(alert_word)
            actual_remaining_alerts = user_alert_words(user)
            self.assertEqual(set(actual_remaining_alerts), expected_remaining_alerts)

    def test_realm_words(self) -> None:
        """
        We can gather alert words for an entire realm via
        alert_words_in_realm. Alerts added for one user do not impact other
        users.
        """

        # Clear all the words that we got from populate_db.
        AlertWord.objects.all().delete()

        user1 = self.get_user()

        do_add_alert_words(user1, self.interesting_alert_word_list)

        user2 = self.example_user("othello")
        do_add_alert_words(user2, ["another"])

        realm_words = alert_words_in_realm(user2.realm)
        self.assert_length(realm_words, 2)
        self.assertEqual(set(realm_words.keys()), {user1.id, user2.id})
        self.assertEqual(set(realm_words[user1.id]), set(self.interesting_alert_word_list))
        self.assertEqual(set(realm_words[user2.id]), {"another"})

    def test_json_list_default(self) -> None:
        user = self.get_user()
        self.login_user(user)

        result = self.client_get("/json/users/me/alert_words")
        response_dict = self.assert_json_success(result)
        self.assertEqual(response_dict["alert_words"], [])

    def test_json_list_nonempty(self) -> None:
        user = self.get_user()
        do_add_alert_words(user, ["one", "two", "three"])

        self.login_user(user)
        result = self.client_get("/json/users/me/alert_words")
        response_dict = self.assert_json_success(result)
        self.assertEqual(set(response_dict["alert_words"]), {"one", "two", "three"})

    def test_json_list_add(self) -> None:
        user = self.get_user()
        self.login_user(user)

        result = self.client_post(
            "/json/users/me/alert_words",
            {"alert_words": orjson.dumps(["one ", "\n two", "three"]).decode()},
        )
        response_dict = self.assert_json_success(result)
        self.assertEqual(set(response_dict["alert_words"]), {"one", "two", "three"})

        result = self.client_post(
            "/json/users/me/alert_words",
            {"alert_words": orjson.dumps(["long" * 26]).decode()},
        )
        self.assert_json_error(result, "alert_words[0] is too long (limit: 100 characters)")

    def test_json_list_remove(self) -> None:
        user = self.get_user()
        self.login_user(user)

        result = self.client_post(
            "/json/users/me/alert_words",
            {"alert_words": orjson.dumps(["one", "two", "three"]).decode()},
        )
        response_dict = self.assert_json_success(result)
        self.assertEqual(set(response_dict["alert_words"]), {"one", "two", "three"})

        result = self.client_delete(
            "/json/users/me/alert_words", {"alert_words": orjson.dumps(["one"]).decode()}
        )
        response_dict = self.assert_json_success(result)
        self.assertEqual(set(response_dict["alert_words"]), {"two", "three"})

    def message_does_alert(self, user: UserProfile, message: str) -> bool:
        """Send a bunch of messages as othello, so our user is notified"""
        self.send_stream_message(self.example_user("othello"), "Denmark", message)
        user_message = most_recent_usermessage(user)
        return "has_alert_word" in user_message.flags_list()

    def test_alert_flags(self) -> None:
        user = self.get_user()
        self.login_user(user)

        result = self.client_post(
            "/json/users/me/alert_words",
            {"alert_words": orjson.dumps(["one", "two", "three"]).decode()},
        )
        response_dict = self.assert_json_success(result)
        self.assertEqual(set(response_dict["alert_words"]), {"one", "two", "three"})

        # Alerts in the middle of messages work.
        self.assertTrue(self.message_does_alert(user, "Normal alert one time"))
        # Alerts at the end of messages work.
        self.assertTrue(self.message_does_alert(user, "Normal alert one"))
        # Alerts at the beginning of messages work.
        self.assertTrue(self.message_does_alert(user, "two normal alerts"))
        # Alerts with surrounding punctuation work.
        self.assertTrue(self.message_does_alert(user, "This one? should alert"))
        self.assertTrue(self.message_does_alert(user, "Definitely time for three."))
        # Multiple alerts in a message work.
        self.assertTrue(self.message_does_alert(user, "One two three o'clock"))
        # Alerts are case-insensitive.
        self.assertTrue(self.message_does_alert(user, "One o'clock"))
        self.assertTrue(self.message_does_alert(user, "Case of ONE, won't stop me"))

        # We don't cause alerts for matches in URLs.
        self.assertFalse(self.message_does_alert(user, "Don't alert on http://t.co/one/ URLs"))
        self.assertFalse(self.message_does_alert(user, "Don't alert on http://t.co/one URLs"))

        # We don't cause alerts for matches within a word.
        self.assertFalse(
            self.message_does_alert(user, "Don't alert on clone, twofold or seventytwofold")
        )

    def test_update_alert_words(self) -> None:
        user = self.get_user()
        self.login_user(user)

        result = self.client_post(
            "/json/users/me/alert_words", {"alert_words": orjson.dumps(["ALERT"]).decode()}
        )

        content = "this is an ALERT for you"
        self.send_stream_message(user, "Denmark", content)
        self.assert_json_success(result)

        original_message = most_recent_message(user)

        user_message = most_recent_usermessage(user)
        self.assertIn("has_alert_word", user_message.flags_list())

        result = self.client_patch(
            "/json/messages/" + str(original_message.id),
            {
                "content": "new ALERT for you",
            },
        )
        self.assert_json_success(result)

        user_message = most_recent_usermessage(user)
        self.assertEqual(user_message.message.content, "new ALERT for you")
        self.assertIn("has_alert_word", user_message.flags_list())

        result = self.client_patch(
            "/json/messages/" + str(original_message.id),
            {
                "content": "sorry false alarm",
            },
        )
        self.assert_json_success(result)

        user_message = most_recent_usermessage(user)
        self.assertEqual(user_message.message.content, "sorry false alarm")
        self.assertNotIn("has_alert_word", user_message.flags_list())
```

--------------------------------------------------------------------------------

---[FILE: test_attachments.py]---
Location: zulip-main/zerver/tests/test_attachments.py

```python
from typing import Any
from unittest import mock

from typing_extensions import override

from zerver.lib.attachments import user_attachments
from zerver.lib.test_classes import ZulipTestCase
from zerver.models import Attachment


class AttachmentsTests(ZulipTestCase):
    @override
    def setUp(self) -> None:
        super().setUp()
        user_profile = self.example_user("cordelia")
        self.attachment = Attachment.objects.create(
            file_name="test.txt",
            path_id="foo/bar/test.txt",
            owner=user_profile,
            realm=user_profile.realm,
            size=512,
        )

    def test_list_by_user(self) -> None:
        user_profile = self.example_user("cordelia")
        self.login_user(user_profile)
        result = self.client_get("/json/attachments")
        response_dict = self.assert_json_success(result)
        attachments = user_attachments(user_profile)
        self.assertEqual(response_dict["attachments"], attachments)

    def test_remove_attachment_exception(self) -> None:
        user_profile = self.example_user("cordelia")
        self.login_user(user_profile)
        with mock.patch(
            "zerver.lib.attachments.delete_message_attachment", side_effect=Exception()
        ):
            result = self.client_delete(f"/json/attachments/{self.attachment.id}")
        self.assert_json_error(
            result, "An error occurred while deleting the attachment. Please try again later."
        )

    @mock.patch("zerver.lib.attachments.delete_message_attachment")
    def test_remove_attachment(self, ignored: Any) -> None:
        user_profile = self.example_user("cordelia")
        self.login_user(user_profile)
        result = self.client_delete(f"/json/attachments/{self.attachment.id}")
        self.assert_json_success(result)
        attachments = user_attachments(user_profile)
        self.assertEqual(attachments, [])

    def test_list_another_user(self) -> None:
        user_profile = self.example_user("iago")
        self.login_user(user_profile)
        result = self.client_get("/json/attachments")
        response_dict = self.assert_json_success(result)
        self.assertEqual(response_dict["attachments"], [])

    def test_remove_another_user(self) -> None:
        user_profile = self.example_user("iago")
        self.login_user(user_profile)
        result = self.client_delete(f"/json/attachments/{self.attachment.id}")
        self.assert_json_error(result, "Invalid attachment")
        user_profile_to_remove = self.example_user("cordelia")
        attachments = user_attachments(user_profile_to_remove)
        self.assertEqual(attachments, [self.attachment.to_dict()])

    def test_list_unauthenticated(self) -> None:
        result = self.client_get("/json/attachments")
        self.assert_json_error(
            result, "Not logged in: API authentication or user session required", status_code=401
        )

    def test_delete_unauthenticated(self) -> None:
        result = self.client_delete(f"/json/attachments/{self.attachment.id}")
        self.assert_json_error(
            result, "Not logged in: API authentication or user session required", status_code=401
        )
```

--------------------------------------------------------------------------------

````
