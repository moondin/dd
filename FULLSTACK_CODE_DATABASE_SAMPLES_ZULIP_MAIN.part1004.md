---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 1004
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1004 of 1290)

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

---[FILE: test_integrations.py]---
Location: zulip-main/zerver/tests/test_integrations.py

```python
import os

from zerver.lib.integrations import (
    BOT_INTEGRATIONS,
    EMBEDDED_BOTS,
    EMBEDDED_INTEGRATIONS,
    HUBOT_INTEGRATIONS,
    INCOMING_WEBHOOK_INTEGRATIONS,
    INTEGRATIONS,
    NO_SCREENSHOT_CONFIG,
    PLUGIN_INTEGRATIONS,
    PYTHON_API_INTEGRATIONS,
    STANDALONE_REPO_INTEGRATIONS,
    VIDEO_CALL_INTEGRATIONS,
    ZAPIER_INTEGRATIONS,
    BotIntegration,
    HubotIntegration,
    IncomingWebhookIntegration,
    Integration,
    PythonAPIIntegration,
    WebhookScreenshotConfig,
    get_fixture_path,
    get_image_path,
    split_fixture_path,
)
from zerver.lib.test_classes import ZulipTestCase


class IntegrationsTestCase(ZulipTestCase):
    def test_split_fixture_path(self) -> None:
        path = "zerver/webhooks/semaphore/fixtures/push.json"
        integration_name, fixture_name = split_fixture_path(path)
        self.assertEqual(integration_name, "semaphore")
        self.assertEqual(fixture_name, "push")

    def test_get_fixture_and_image_paths(self) -> None:
        integration = INTEGRATIONS["airbrake"]
        assert isinstance(integration, IncomingWebhookIntegration)
        screenshot_config = WebhookScreenshotConfig("error_message.json", "002.png", "ci")
        fixture_path = get_fixture_path(integration, screenshot_config)
        image_path = get_image_path(integration, screenshot_config)
        self.assertEqual(fixture_path, "zerver/webhooks/airbrake/fixtures/error_message.json")
        self.assertEqual(image_path, "static/images/integrations/ci/002.png")

    def test_get_logo_path(self) -> None:
        # Test with an integration that passed logo as an argument
        integration = INTEGRATIONS["slack_incoming"]
        with self.assertRaises(AssertionError):
            integration.get_logo_path()

        # Test with an integration that has only a PNG option
        integration = INTEGRATIONS["onyx"]
        self.assertEqual(integration.get_logo_path(), "images/integrations/logos/onyx.png")

        # Test the fallback logo with an embedded integration without a logo
        ZULIP_LOGO_STATIC_PATH_PNG = "images/logo/zulip-icon-128x128.png"
        integration = EMBEDDED_BOTS[0]
        with self.assertRaises(AssertionError):
            integration.get_logo_path()
        self.assertEqual(
            integration.get_logo_path(ZULIP_LOGO_STATIC_PATH_PNG), ZULIP_LOGO_STATIC_PATH_PNG
        )

        # Test with a bot integration that has a logo
        # They use different DEFAULT_* paths.
        integration = INTEGRATIONS["xkcd"]
        logo_path = integration.get_logo_path()
        self.assertEqual(logo_path, "generated/bots/xkcd/logo.png")
        self.assertTrue(logo_path.startswith("generated/bots/"))

    def test_get_bot_avatar_path(self) -> None:
        integration = INTEGRATIONS["alertmanager"]
        self.assertEqual(
            integration.get_bot_avatar_path(), "images/integrations/bot_avatars/prometheus.png"
        )

        with self.assertRaises(AssertionError):
            integration = Integration("alertmanager", ["misc"])

    def test_no_missing_doc_screenshot_config(self) -> None:
        integration_names = {integration.name for integration in INTEGRATIONS.values()}
        integrations_with_screenshot_configs = {
            integration_name
            for integration_name, integration in INTEGRATIONS.items()
            if integration.screenshot_configs
        }

        missing_integration_screenshots = (
            integration_names - integrations_with_screenshot_configs - NO_SCREENSHOT_CONFIG
        )
        extra_integration_configs = integrations_with_screenshot_configs - integration_names
        extra_integration_no_configs = NO_SCREENSHOT_CONFIG - integration_names

        def construct_message(title: str, integrations: set[str], action: str) -> str:
            return (
                f"\n\n{title}\n" + "\n".join(integrations) + f"\n{action}" if integrations else ""
            )

        self.assertEqual(
            integrations_with_screenshot_configs,
            integration_names - NO_SCREENSHOT_CONFIG,
            construct_message(
                "The following integrations are missing their example screenshot configuration:",
                missing_integration_screenshots,
                "Add them to zerver.lib.integrations.INTEGRATIONS",
            )
            + construct_message(
                "The following integrations have a screenshot configuration but no longer exist:",
                extra_integration_configs,
                "Remove them from zerver.lib.integrations.INTEGRATIONS",
            )
            + construct_message(
                "The following integrations are listed in NO_SCREENSHOT_CONFIG but no longer exist:",
                extra_integration_no_configs,
                "Remove them from zerver.lib.integrations.NO_SCREENSHOT_CONFIG",
            ),
        )

    def test_no_missing_screenshot_path(self) -> None:
        message = '"{path}" does not exist for integration {integration_name}.\n'
        tip = '\nConsider updating screenshot configs in zerver.lib.integrations.INTEGRATIONS\n and running "tools/screenshots/generate-integration-docs-screenshot" to keep the screenshots up-to-date.'
        error_message = ""

        for integration in INTEGRATIONS.values():
            if integration.screenshot_configs is None:
                continue
            for screenshot_config in integration.screenshot_configs:
                if isinstance(integration, IncomingWebhookIntegration):
                    assert isinstance(screenshot_config, WebhookScreenshotConfig)
                    if screenshot_config.fixture_name == "":
                        # Skip screenshot configs of webhooks with a placeholder fixture_name
                        continue
                    fixture_path = get_fixture_path(integration, screenshot_config)
                    error_message = (
                        error_message
                        + message.format(path=fixture_path, integration_name=integration.name)
                        if not os.path.isfile(fixture_path)
                        else error_message
                    )
                image_path = get_image_path(integration, screenshot_config)
                error_message = (
                    error_message
                    + message.format(path=image_path, integration_name=integration.name)
                    if not os.path.isfile(image_path)
                    else error_message
                )
        self.assertEqual(error_message, "", tip)

    def test_sorting(self) -> None:
        integration_lists: dict[
            str,
            list[Integration]
            | list[IncomingWebhookIntegration]
            | list[BotIntegration]
            | list[HubotIntegration]
            | list[PythonAPIIntegration],
        ] = {
            "INCOMING_WEBHOOK_INTEGRATIONS": INCOMING_WEBHOOK_INTEGRATIONS,
            "PYTHON_API_INTEGRATIONS": PYTHON_API_INTEGRATIONS,
            "BOT_INTEGRATIONS": BOT_INTEGRATIONS,
            "HUBOT_INTEGRATIONS": HUBOT_INTEGRATIONS,
            "VIDEO_CALL_INTEGRATIONS": VIDEO_CALL_INTEGRATIONS,
            "EMBEDDED_INTEGRATIONS": EMBEDDED_INTEGRATIONS,
            "ZAPIER_INTEGRATIONS": ZAPIER_INTEGRATIONS,
            "PLUGIN_INTEGRATIONS": PLUGIN_INTEGRATIONS,
            "STANDALONE_REPO_INTEGRATIONS": STANDALONE_REPO_INTEGRATIONS,
        }

        errors: list[str] = []

        for list_name, integration_list in integration_lists.items():
            names = [integration.name for integration in integration_list]
            errors.extend(
                f"{list_name} is not sorted: '{names[i]}' > '{names[i + 1]}'"
                for i in range(len(names) - 1)
                if names[i] > names[i + 1]
            )

        assert not errors, "\n".join(errors)
```

--------------------------------------------------------------------------------

---[FILE: test_integrations_dev_panel.py]---
Location: zulip-main/zerver/tests/test_integrations_dev_panel.py
Signals: Django

```python
from unittest.mock import MagicMock, patch

import orjson
from django.core.exceptions import ValidationError

from zerver.lib.test_classes import ZulipTestCase
from zerver.models import Message, Stream
from zerver.models.realms import get_realm
from zerver.models.users import get_user


class TestIntegrationsDevPanel(ZulipTestCase):
    zulip_realm = get_realm("zulip")

    def test_check_send_webhook_fixture_message_for_error(self) -> None:
        bot = get_user("webhook-bot@zulip.com", self.zulip_realm)
        url = f"/api/v1/external/airbrake?api_key={bot.api_key}"
        target_url = "/devtools/integrations/check_send_webhook_fixture_message"
        body = "{}"  # This empty body should generate a ValidationError on the webhook code side.

        data = {
            "url": url,
            "body": body,
            "custom_headers": "{}",
            "is_json": "true",
        }
        with (
            self.assertLogs(level="ERROR") as logs,
            self.settings(TEST_SUITE=False),
            self.assertRaises(ValidationError),
        ):
            self.client_post(target_url, data)

        # Intention of this test looks like to trigger ValidationError
        # so just testing ValidationError is printed along with Traceback in logs
        self.assert_length(logs.output, 2)
        self.assertTrue(
            logs.output[0].startswith(
                "ERROR:django.request:Internal Server Error: /api/v1/external/airbrake\n"
                "Traceback (most recent call last):\n"
            )
        )
        self.assertTrue("ValidationError" in logs.output[0])
        self.assertTrue(
            logs.output[1].startswith(
                "ERROR:django.request:Internal Server Error: /devtools/integrations/check_send_webhook_fixture_message\n"
                "Traceback (most recent call last):\n"
            )
        )
        self.assertTrue("ValidationError" in logs.output[1])

    def test_check_send_webhook_fixture_message_for_success_without_headers(self) -> None:
        bot = get_user("webhook-bot@zulip.com", self.zulip_realm)
        url = f"/api/v1/external/airbrake?api_key={bot.api_key}&stream=Denmark&topic=Airbrake notifications"
        target_url = "/devtools/integrations/check_send_webhook_fixture_message"
        with open("zerver/webhooks/airbrake/fixtures/error_message.json") as f:
            body = f.read()

        data = {
            "url": url,
            "body": body,
            "custom_headers": "{}",
            "is_json": "true",
        }

        response = self.client_post(target_url, data)
        expected_response = {
            "responses": [{"status_code": 200, "message": {"result": "success", "msg": ""}}],
            "result": "success",
            "msg": "",
        }
        response_content = orjson.loads(response.content)
        response_content["responses"][0]["message"] = orjson.loads(
            response_content["responses"][0]["message"]
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_content, expected_response)

        latest_msg = Message.objects.latest("id")
        expected_message = '[ZeroDivisionError](https://zulip.airbrake.io/projects/125209/groups/1705190192091077626): "Error message from logger" occurred.'
        self.assertEqual(latest_msg.content, expected_message)
        self.assertEqual(Stream.objects.get(id=latest_msg.recipient.type_id).name, "Denmark")
        self.assertEqual(latest_msg.topic_name(), "Airbrake notifications")

    def test_check_send_webhook_fixture_message_for_success_with_headers(self) -> None:
        bot = get_user("webhook-bot@zulip.com", self.zulip_realm)
        url = f"/api/v1/external/github?api_key={bot.api_key}&stream=Denmark&topic=GitHub notifications"
        target_url = "/devtools/integrations/check_send_webhook_fixture_message"
        with open("zerver/webhooks/github/fixtures/ping__organization.json") as f:
            body = f.read()

        data = {
            "url": url,
            "body": body,
            "custom_headers": orjson.dumps({"X-GitHub-Event": "ping"}).decode(),
            "is_json": "true",
        }

        response = self.client_post(target_url, data)
        self.assertEqual(response.status_code, 200)

        latest_msg = Message.objects.latest("id")
        expected_message = "GitHub webhook has been successfully configured by eeshangarg."
        self.assertEqual(latest_msg.content, expected_message)
        self.assertEqual(Stream.objects.get(id=latest_msg.recipient.type_id).name, "Denmark")
        self.assertEqual(latest_msg.topic_name(), "GitHub notifications")

    def test_check_send_webhook_fixture_message_for_success_with_headers_and_non_json_fixtures(
        self,
    ) -> None:
        bot = get_user("webhook-bot@zulip.com", self.zulip_realm)
        url = f"/api/v1/external/wordpress?api_key={bot.api_key}&stream=Denmark&topic=WordPress notifications"
        target_url = "/devtools/integrations/check_send_webhook_fixture_message"
        with open("zerver/webhooks/wordpress/fixtures/publish_post_no_data_provided.txt") as f:
            body = f.read()

        data = {
            "url": url,
            "body": body,
            "custom_headers": orjson.dumps(
                {"Content-Type": "application/x-www-form-urlencoded"}
            ).decode(),
            "is_json": "false",
        }

        response = self.client_post(target_url, data)
        self.assertEqual(response.status_code, 200)

        latest_msg = Message.objects.latest("id")
        expected_message = "New post published:\n* [New WordPress post](WordPress post URL)"
        self.assertEqual(latest_msg.content, expected_message)
        self.assertEqual(Stream.objects.get(id=latest_msg.recipient.type_id).name, "Denmark")
        self.assertEqual(latest_msg.topic_name(), "WordPress notifications")

    def test_get_fixtures_for_nonexistent_integration(self) -> None:
        target_url = "/devtools/integrations/somerandomnonexistentintegration/fixtures"
        response = self.client_get(target_url)
        expected_response = {
            "code": "BAD_REQUEST",
            "msg": '"somerandomnonexistentintegration" is not a valid webhook integration.',
            "result": "error",
        }
        self.assertEqual(response.status_code, 404)
        self.assertEqual(orjson.loads(response.content), expected_response)

    @patch("zerver.views.development.integrations.os.path.exists")
    def test_get_fixtures_for_integration_without_fixtures(
        self, os_path_exists_mock: MagicMock
    ) -> None:
        os_path_exists_mock.return_value = False
        target_url = "/devtools/integrations/airbrake/fixtures"
        response = self.client_get(target_url)
        expected_response = {
            "code": "BAD_REQUEST",
            "msg": 'The integration "airbrake" does not have fixtures.',
            "result": "error",
        }
        self.assertEqual(response.status_code, 404)
        self.assertEqual(orjson.loads(response.content), expected_response)

    def test_get_fixtures_for_success(self) -> None:
        target_url = "/devtools/integrations/airbrake/fixtures"
        response = self.client_get(target_url)
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(orjson.loads(response.content)["fixtures"])

    def test_get_dev_panel_page(self) -> None:
        # Just to satisfy the test suite.
        target_url = "/devtools/integrations/"
        response = self.client_get(target_url)
        self.assertEqual(response.status_code, 200)

    def test_send_all_webhook_fixture_messages_for_success(self) -> None:
        bot = get_user("webhook-bot@zulip.com", self.zulip_realm)
        url = f"/api/v1/external/appfollow?api_key={bot.api_key}&stream=Denmark&topic=Appfollow bulk notifications"
        target_url = "/devtools/integrations/send_all_webhook_fixture_messages"

        data = {
            "url": url,
            "custom_headers": "{}",
            "integration_name": "appfollow",
        }

        response = self.client_post(target_url, data)
        expected_responses = [
            {
                "fixture_name": "sample.json",
                "status_code": 200,
                "message": {"msg": "", "result": "success"},
            },
            {
                "fixture_name": "review.json",
                "status_code": 200,
                "message": {"msg": "", "result": "success"},
            },
        ]
        responses = orjson.loads(response.content)["responses"]
        for r in responses:
            r["message"] = orjson.loads(r["message"])
        self.assertEqual(response.status_code, 200)
        for r in responses:
            # We have to use this roundabout manner since the order may vary each time.
            # This is not an issue.
            self.assertTrue(r in expected_responses)
            expected_responses.remove(r)

        new_messages = Message.objects.order_by("-id")[0:2]
        expected_messages = [
            "Webhook integration was successful.\nTest User / Acme (Google Play)",
            "Acme - Group chat\nApp Store, Acme Technologies, Inc.\n★★★★★ United States\n**Great for Information Management**\nAcme enables me to manage the flow of information quite well. I only wish I could create and edit my Acme Post files in the iOS app.\n*by* **Mr RESOLUTIONARY** *for v3.9*\n[Permalink](http://appfollow.io/permalink) · [Add tag](http://watch.appfollow.io/add_tag)",
        ]
        for msg in new_messages:
            # new_messages -> expected_messages or expected_messages -> new_messages shouldn't make
            # a difference since equality is commutative.
            self.assertTrue(msg.content in expected_messages)
            expected_messages.remove(msg.content)
            self.assertEqual(Stream.objects.get(id=msg.recipient.type_id).name, "Denmark")
            self.assertEqual(msg.topic_name(), "Appfollow bulk notifications")

    def test_send_all_webhook_fixture_messages_for_success_with_non_json_fixtures(self) -> None:
        bot = get_user("webhook-bot@zulip.com", self.zulip_realm)
        url = f"/api/v1/external/wordpress?api_key={bot.api_key}&stream=Denmark&topic=WordPress bulk notifications"
        target_url = "/devtools/integrations/send_all_webhook_fixture_messages"

        data = {
            "url": url,
            "custom_headers": "{}",
            "integration_name": "wordpress",
        }

        response = self.client_post(target_url, data)
        expected_responses = [
            {
                "message": {
                    "msg": "Unknown WordPress webhook action: WordPress action",
                    "result": "error",
                    "code": "BAD_REQUEST",
                },
                "fixture_name": "user_register.txt",
                "status_code": 400,
            },
            {
                "message": {
                    "msg": "Unknown WordPress webhook action: WordPress action",
                    "result": "error",
                    "code": "BAD_REQUEST",
                },
                "fixture_name": "publish_post_no_data_provided.txt",
                "status_code": 400,
            },
            {
                "message": {
                    "msg": "Unknown WordPress webhook action: WordPress action",
                    "result": "error",
                    "code": "BAD_REQUEST",
                },
                "fixture_name": "unknown_action_no_data.txt",
                "status_code": 400,
            },
            {
                "message": {
                    "msg": "Unknown WordPress webhook action: WordPress action",
                    "result": "error",
                    "code": "BAD_REQUEST",
                },
                "fixture_name": "publish_page.txt",
                "status_code": 400,
            },
            {
                "message": {
                    "msg": "Unknown WordPress webhook action: WordPress action",
                    "result": "error",
                    "code": "BAD_REQUEST",
                },
                "fixture_name": "unknown_action_no_hook_provided.txt",
                "status_code": 400,
            },
            {
                "message": {
                    "msg": "Unknown WordPress webhook action: WordPress action",
                    "result": "error",
                    "code": "BAD_REQUEST",
                },
                "fixture_name": "publish_post_type_not_provided.txt",
                "status_code": 400,
            },
            {
                "message": {
                    "msg": "Unknown WordPress webhook action: WordPress action",
                    "result": "error",
                    "code": "BAD_REQUEST",
                },
                "fixture_name": "wp_login.txt",
                "status_code": 400,
            },
            {
                "message": {
                    "msg": "Unknown WordPress webhook action: WordPress action",
                    "result": "error",
                    "code": "BAD_REQUEST",
                },
                "fixture_name": "publish_post.txt",
                "status_code": 400,
            },
        ]
        responses = orjson.loads(response.content)["responses"]
        for r in responses:
            r["message"] = orjson.loads(r["message"])
        self.assertEqual(response.status_code, 200)
        for r in responses:
            # We have to use this roundabout manner since the order may vary each time. This is not
            # an issue. Basically, we're trying to compare 2 lists and since we're not resorting to
            # using sets or a sorted order, we're sticking with O(n*m) time complexity for this
            # comparison (where n and m are the lengths of the two lists respectively). But since
            # this is just a unit test and more importantly n = m = some-low-number we don't really
            # care about the time complexity being what it is.
            self.assertTrue(r in expected_responses)
            expected_responses.remove(r)

    @patch("zerver.views.development.integrations.os.path.exists")
    def test_send_all_webhook_fixture_messages_for_missing_fixtures(
        self, os_path_exists_mock: MagicMock
    ) -> None:
        os_path_exists_mock.return_value = False
        bot = get_user("webhook-bot@zulip.com", self.zulip_realm)
        url = f"/api/v1/external/appfollow?api_key={bot.api_key}&stream=Denmark&topic=Appfollow bulk notifications"
        data = {
            "url": url,
            "custom_headers": "{}",
            "integration_name": "appfollow",
        }
        response = self.client_post(
            "/devtools/integrations/send_all_webhook_fixture_messages", data
        )
        expected_response = {
            "code": "BAD_REQUEST",
            "msg": 'The integration "appfollow" does not have fixtures.',
            "result": "error",
        }
        self.assertEqual(response.status_code, 404)
        self.assertEqual(orjson.loads(response.content), expected_response)
```

--------------------------------------------------------------------------------

---[FILE: test_internet.py]---
Location: zulip-main/zerver/tests/test_internet.py

```python
import requests
import responses

from zerver.lib.test_classes import ZulipTestCase


class ResponsesTest(ZulipTestCase):
    def test_responses(self) -> None:
        # With our test setup, accessing the internet should be blocked.
        with self.assertRaisesRegex(
            Exception,
            r"^Outgoing network requests are not allowed in the Zulip tests\.",
        ):
            result = requests.request("GET", "https://www.google.com")

        # A test can invoke its own responses.RequestsMock context manager
        # and register URLs to mock, accessible from within the context.
        with responses.RequestsMock() as requests_mock:
            requests_mock.add(
                responses.GET,
                "https://www.google.com",
                body="{}",
                status=200,
                content_type="application/json",
            )
            result = requests.request("GET", "https://www.google.com")
            self.assertEqual(result.status_code, 200)
            self.assertEqual(result.text, "{}")
```

--------------------------------------------------------------------------------

````
