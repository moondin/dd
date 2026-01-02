---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1250
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1250 of 1290)

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

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/slack/tests.py

```python
from collections.abc import Callable
from functools import wraps
from typing import Concatenate
from unittest.mock import patch

import responses
from typing_extensions import ParamSpec, override

from zerver.lib.test_classes import WebhookTestCase
from zerver.webhooks.slack.view import INVALID_SLACK_TOKEN_MESSAGE

EXPECTED_TOPIC = "Message from Slack"

MESSAGE_WITH_NORMAL_TEXT = "Hello, this is a normal text message"
USER = "John Doe"
CHANNEL = "general"
API_CHANNEL_NAME = "Slack general"
EXPECTED_MESSAGE = "**{user}**: {message}"
TOPIC_WITH_CHANNEL = "channel: {channel}"
DEFAULT_TOPIC_NAME = "Message from Slack"
LEGACY_USER = "slack_user"

ParamT = ParamSpec("ParamT")


def mock_slack_api_calls(
    test_func: Callable[Concatenate["SlackWebhookTests", ParamT], None],
) -> Callable[Concatenate["SlackWebhookTests", ParamT], None]:
    @wraps(test_func)
    @responses.activate
    def _wrapped(self: "SlackWebhookTests", /, *args: ParamT.args, **kwargs: ParamT.kwargs) -> None:
        self.make_stream(API_CHANNEL_NAME)
        responses.add(
            responses.GET,
            "https://slack.com/api/users.info",
            self.webhook_fixture_data("slack", "slack_users_info_api_response"),
        )
        responses.add(
            responses.GET,
            "https://slack.com/api/conversations.info",
            self.webhook_fixture_data("slack", "slack_conversations_info_api_response"),
        )
        test_func(self, *args, **kwargs)

    return _wrapped


class SlackWebhookTests(WebhookTestCase):
    CHANNEL_NAME = "slack"
    URL_TEMPLATE = "/api/v1/external/slack?stream={stream}&api_key={api_key}&slack_app_token=xoxp-XXXXXXXXXXXXXXXXXXXXX"
    WEBHOOK_DIR_NAME = "slack"

    @mock_slack_api_calls
    def test_slack_only_stream_parameter(self) -> None:
        expected_message = EXPECTED_MESSAGE.format(user=USER, message=MESSAGE_WITH_NORMAL_TEXT)
        self.check_webhook(
            "message_with_normal_text",
            EXPECTED_TOPIC,
            expected_message,
            content_type="application/json",
        )

    @mock_slack_api_calls
    def test_slack_with_user_specified_topic(self) -> None:
        expected_topic_name = "test"
        self.url = self.build_webhook_url(topic=expected_topic_name)
        expected_message = EXPECTED_MESSAGE.format(user=USER, message=MESSAGE_WITH_NORMAL_TEXT)
        self.check_webhook(
            "message_with_normal_text",
            expected_topic_name,
            expected_message,
            content_type="application/json",
        )

    @mock_slack_api_calls
    def test_slack_channels_map_to_topics_true(self) -> None:
        self.url = self.build_webhook_url(channels_map_to_topics="1")
        expected_message = EXPECTED_MESSAGE.format(user=USER, message=MESSAGE_WITH_NORMAL_TEXT)
        expected_topic_name = TOPIC_WITH_CHANNEL.format(channel=API_CHANNEL_NAME)
        self.check_webhook(
            "message_with_normal_text",
            expected_topic_name,
            expected_message,
            content_type="application/json",
        )

    @mock_slack_api_calls
    def test_slack_channels_map_to_topics_true_and_user_specified_topic(self) -> None:
        expected_topic_name = "test"
        self.url = self.build_webhook_url(topic=expected_topic_name, channels_map_to_topics="1")
        expected_message = EXPECTED_MESSAGE.format(user=USER, message=MESSAGE_WITH_NORMAL_TEXT)
        self.check_webhook(
            "message_with_normal_text",
            expected_topic_name,
            expected_message,
            content_type="application/json",
        )

    @mock_slack_api_calls
    def test_slack_channels_map_to_topics_false(self) -> None:
        self.CHANNEL_NAME = API_CHANNEL_NAME
        self.url = self.build_webhook_url(channels_map_to_topics="0")
        expected_message = EXPECTED_MESSAGE.format(user=USER, message=MESSAGE_WITH_NORMAL_TEXT)
        self.check_webhook(
            "message_with_normal_text",
            EXPECTED_TOPIC,
            expected_message,
            content_type="application/json",
        )

    @mock_slack_api_calls
    def test_url_options_channels_mapping_true(self) -> None:
        self.CHANNEL_NAME = API_CHANNEL_NAME
        self.url = self.build_webhook_url(mapping="channels")
        expected_message = EXPECTED_MESSAGE.format(user=USER, message=MESSAGE_WITH_NORMAL_TEXT)
        expected_topic_name = DEFAULT_TOPIC_NAME
        self.check_webhook(
            "message_with_normal_text",
            expected_topic_name,
            expected_message,
            content_type="application/json",
        )

    @mock_slack_api_calls
    def test_slack_channels_map_to_topics_false_and_user_specified_topic(self) -> None:
        self.CHANNEL_NAME = API_CHANNEL_NAME
        expected_topic_name = "test"
        self.url = self.build_webhook_url(topic=expected_topic_name, channels_map_to_topics="0")
        expected_message = EXPECTED_MESSAGE.format(user=USER, message=MESSAGE_WITH_NORMAL_TEXT)
        self.check_webhook(
            "message_with_normal_text",
            expected_topic_name,
            expected_message,
            content_type="application/json",
        )

    @mock_slack_api_calls
    def test_url_options_map_to_channels_and_user_specified_topic(self) -> None:
        self.CHANNEL_NAME = API_CHANNEL_NAME
        expected_topic_name = DEFAULT_TOPIC_NAME
        self.url = self.build_webhook_url(topic=expected_topic_name, mapping="channels")
        expected_message = EXPECTED_MESSAGE.format(user=USER, message=MESSAGE_WITH_NORMAL_TEXT)
        self.check_webhook(
            "message_with_normal_text",
            expected_topic_name,
            expected_message,
            content_type="application/json",
        )

    @mock_slack_api_calls
    def test_invalid_channels_map_to_topics(self) -> None:
        payload = self.get_body("message_with_normal_text")
        url = self.build_webhook_url(channels_map_to_topics="abc")
        result = self.client_post(url, payload, content_type="application/json")
        self.assert_json_error(result, "Error: channels_map_to_topics parameter other than 0 or 1")

    @mock_slack_api_calls
    def test_challenge_handshake_payload(self) -> None:
        url = self.build_webhook_url(channels_map_to_topics="1")
        payload = self.get_body("challenge_handshake_payload")
        with self.assertLogs(level="INFO") as info_logs:
            result = self.client_post(url, payload, content_type="application/json")
        expected_challenge_response = {
            "msg": "",
            "result": "success",
            "challenge": "3eZbrw1aBm2rZgRNFdxV2595E9CY3gmdALWMmHkvFXO7tYXAYM8P",
        }
        self.assertTrue(
            "INFO:root:This is a Slack user token, which grants all rights the user has!"
            in info_logs.output[0]
        )
        self.assertJSONEqual(result.content.decode("utf-8"), expected_challenge_response)

    @mock_slack_api_calls
    def test_block_message_from_slack_bridge_bot(self) -> None:
        self.check_webhook(
            "message_from_slack_bridge_bot",
            "",
            "",
            content_type="application/json",
            expect_noop=True,
        )

    @mock_slack_api_calls
    def test_message_with_bullet_points(self) -> None:
        message_body = "• list three\n• list two"
        expected_message = EXPECTED_MESSAGE.format(user=USER, message=message_body)
        self.check_webhook(
            "message_with_bullet_points",
            EXPECTED_TOPIC,
            expected_message,
            content_type="application/json",
        )

    @mock_slack_api_calls
    def test_message_with_channel_and_user_mentions(self) -> None:
        message_body = "@**John Doe** **#general** message with both channel and user mentions"
        expected_message = EXPECTED_MESSAGE.format(user=USER, message=message_body)
        self.check_webhook(
            "message_with_channel_and_user_mentions",
            EXPECTED_TOPIC,
            expected_message,
            content_type="application/json",
        )

    @mock_slack_api_calls
    def test_message_with_channel_mentions(self) -> None:
        message_body = "**#zulip-mirror** **#general** message with channel mentions"
        expected_message = EXPECTED_MESSAGE.format(user=USER, message=message_body)
        self.check_webhook(
            "message_with_channel_mentions",
            EXPECTED_TOPIC,
            expected_message,
            content_type="application/json",
        )

    @mock_slack_api_calls
    def test_message_with_formatted_texts(self) -> None:
        message_body = "**Bold text** *italic text* ~~strikethrough~~"
        expected_message = EXPECTED_MESSAGE.format(user=USER, message=message_body)
        self.check_webhook(
            "message_with_formatted_texts",
            EXPECTED_TOPIC,
            expected_message,
            content_type="application/json",
        )

    @mock_slack_api_calls
    def test_message_with_image_files(self) -> None:
        message_body = """
*[5e44bcbc-e43c-4a2e-85de-4be126f392f4.jpg](https://ds-py62195.slack.com/files/U06NU4E26M9/F079E4173BL/5e44bcbc-e43c-4a2e-85de-4be126f392f4.jpg)*
*[notif_bot.png](https://ds-py62195.slack.com/files/U06NU4E26M9/F079GJ49X4L/notif_bot.png)*
*[books.jpg](https://ds-py62195.slack.com/files/U06NU4E26M9/F07A2TA6PPS/books.jpg)*"""
        expected_message = EXPECTED_MESSAGE.format(user=USER, message=message_body)
        self.check_webhook(
            "message_with_image_files",
            EXPECTED_TOPIC,
            expected_message,
            content_type="application/json",
        )

    @mock_slack_api_calls
    def test_message_with_inline_code(self) -> None:
        message_body = "`asdasda this is a code block`"
        expected_message = EXPECTED_MESSAGE.format(user=USER, message=message_body)
        self.check_webhook(
            "message_with_inline_code",
            EXPECTED_TOPIC,
            expected_message,
            content_type="application/json",
        )

    @mock_slack_api_calls
    def test_message_with_ordered_list(self) -> None:
        message_body = "1. point one\n2. point two\n3. mix both\n4. pour water\n5. etc"
        expected_message = EXPECTED_MESSAGE.format(user=USER, message=message_body)
        self.check_webhook(
            "message_with_ordered_list",
            EXPECTED_TOPIC,
            expected_message,
            content_type="application/json",
        )

    @mock_slack_api_calls
    def test_message_with_user_mentions(self) -> None:
        message_body = (
            "@**John Doe** @**John Doe** @**John Doe** hello, this is a message with mentions"
        )
        expected_message = EXPECTED_MESSAGE.format(user=USER, message=message_body)
        self.check_webhook(
            "message_with_user_mentions",
            EXPECTED_TOPIC,
            expected_message,
            content_type="application/json",
        )

    @mock_slack_api_calls
    def test_message_with_variety_files(self) -> None:
        message_body = """Message with an assortment of file types
*[postman-agent-0.4.25-linux-x64.tar.gz](https://ds-py62195.slack.com/files/U06NU4E26M9/F079E4CMY5Q/postman-agent-0.4.25-linux-x64.tar.gz)*
*[discord-0.0.55.deb](https://ds-py62195.slack.com/files/U06NU4E26M9/F079SQ33CBT/discord-0.0.55.deb)*
*[Slack-bot-scopes-List.xlsx](https://ds-py62195.slack.com/files/U06NU4E26M9/F079SQ721A5/slack-bot-scopes-list.xlsx)*
*[wallpaper.jpg](https://ds-py62195.slack.com/files/U06NU4E26M9/F079B7G7NUD/wallpaper.jpg)*
*[TestPDFfile.pdf](https://ds-py62195.slack.com/files/U06NU4E26M9/F07A2TVKNQ0/testpdffile.pdf)*
*[channels.json](https://ds-py62195.slack.com/files/U06NU4E26M9/F07A2TVQ7C0/channels.json)*"""
        expected_message = EXPECTED_MESSAGE.format(user=USER, message=message_body)
        self.check_webhook(
            "message_with_variety_files",
            EXPECTED_TOPIC,
            expected_message,
            content_type="application/json",
        )

    @mock_slack_api_calls
    def test_message_with_workspace_mentions(self) -> None:
        message_body = "@**all** @**all** Sorry for mentioning. This is for the test fixtures for the Slack integration update PR I'm working on and can't be done in a private channel. :bow:"
        expected_message = EXPECTED_MESSAGE.format(user=USER, message=message_body)
        self.check_webhook(
            "message_with_workspace_mentions",
            EXPECTED_TOPIC,
            expected_message,
            content_type="application/json",
        )

    @mock_slack_api_calls
    def test_message_from_slack_integration_bot(self) -> None:
        self.check_webhook(
            "message_from_slack_integration_bot",
            "",
            "",
            content_type="application/json",
            expect_noop=True,
        )

    @mock_slack_api_calls
    def test_message_with_code_block(self) -> None:
        message_body = """```def is_bot_message(payload: WildValue) -&gt; bool:\n    app_api_id = payload.get(\"api_app_id\").tame(check_none_or(check_string))\n    bot_app_id = (\n        payload.get(\"event\", {})\n        .get(\"bot_profile\", {})\n        .get(\"app_id\")\n        .tame(check_none_or(check_string))\n    )\n    return bot_app_id is not None and app_api_id == bot_app_id```"""
        expected_message = EXPECTED_MESSAGE.format(user=USER, message=message_body)
        self.check_webhook(
            "message_with_code_block",
            EXPECTED_TOPIC,
            expected_message,
            content_type="application/json",
        )

    @mock_slack_api_calls
    def test_message_with_complex_formatted_texts(self) -> None:
        message_body = "this is text messages with overlapping formatting\n***bold with italic***\n~~**bold with strike through**~~\n~~*italic with strike through*~~\n~~***all three***~~"
        expected_message = EXPECTED_MESSAGE.format(user=USER, message=message_body)
        self.check_webhook(
            "message_with_complex_formatted_texts",
            EXPECTED_TOPIC,
            expected_message,
            content_type="application/json",
        )

    @mock_slack_api_calls
    def test_message_with_complex_formatted_mentions(self) -> None:
        message_body = "@**John Doe** **#general** ~~***@**all*****~~"
        expected_message = EXPECTED_MESSAGE.format(user=USER, message=message_body)
        self.check_webhook(
            "message_with_complex_formatted_mentions",
            EXPECTED_TOPIC,
            expected_message,
            content_type="application/json",
        )

    @mock_slack_api_calls
    def test_message_with_quote_block(self) -> None:
        message_body = "&gt; This is a quote"
        expected_message = EXPECTED_MESSAGE.format(user=USER, message=message_body)
        self.check_webhook(
            "message_with_quote_block",
            EXPECTED_TOPIC,
            expected_message,
            content_type="application/json",
        )

    @mock_slack_api_calls
    def test_block_slack_retries(self) -> None:
        payload = self.get_body("message_with_normal_text")
        with patch("zerver.webhooks.slack.view.check_send_webhook_message") as m:
            result = self.client_post(
                self.url,
                payload,
                headers={"X-Slack-Retry-Num": 1},
                content_type="application/json",
            )
        self.assertFalse(m.called)
        self.assert_json_success(result)

    @mock_slack_api_calls
    def test_missing_api_token_scope(self) -> None:
        error_message = "Slack token is missing the following required scopes: ['users:read', 'users:read.email']"
        user_facing_error_message = INVALID_SLACK_TOKEN_MESSAGE.format(error_message=error_message)
        # We tested how `check_slack_token_access` may raise these errors in
        # `test_slack_importer.py`. So, for simplicitys sake the function
        # is directly mocked here to raise the ValueError we expect.
        with (
            patch("zerver.webhooks.slack.view.check_slack_token_access") as e,
            patch("zerver.webhooks.slack.view.send_rate_limited_pm_notification_to_bot_owner") as s,
        ):
            e.side_effect = ValueError(error_message)
            self.check_webhook(
                "challenge_handshake_payload",
                expect_noop=True,
                content_type="application/json",
            )

        s.assert_called_once()
        _, _, actual_error_message = s.call_args[0]

        self.assertEqual(actual_error_message, user_facing_error_message)

    @mock_slack_api_calls
    def test_missing_slack_api_token(self) -> None:
        error_message = "slack_app_token is missing."
        self.url = self.build_webhook_url(slack_app_token="")
        user_facing_error_message = INVALID_SLACK_TOKEN_MESSAGE.format(error_message=error_message)
        with (
            patch("zerver.webhooks.slack.view.send_rate_limited_pm_notification_to_bot_owner") as s,
        ):
            self.check_webhook(
                "challenge_handshake_payload",
                expect_noop=True,
                content_type="application/json",
            )

        s.assert_called_once()
        _, _, actual_error_message = s.call_args[0]

        self.assertEqual(actual_error_message, user_facing_error_message)


class SlackLegacyWebhookTests(WebhookTestCase):
    CHANNEL_NAME = "slack"
    URL_TEMPLATE = "/api/v1/external/slack?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "slack"

    def test_slack_only_stream_parameter(self) -> None:
        expected_topic_name = "Message from Slack"
        expected_message = EXPECTED_MESSAGE.format(user=LEGACY_USER, message="test")
        self.check_webhook(
            "message_info",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_slack_with_user_specified_topic(self) -> None:
        self.url = self.build_webhook_url(topic="test")
        expected_topic_name = "test"
        expected_message = EXPECTED_MESSAGE.format(user=LEGACY_USER, message="test")
        self.check_webhook(
            "message_info",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_slack_channels_map_to_topics_true(self) -> None:
        self.url = self.build_webhook_url(channels_map_to_topics="1")
        expected_topic_name = "channel: general"
        expected_message = EXPECTED_MESSAGE.format(user=LEGACY_USER, message="test")
        self.check_webhook(
            "message_info",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_slack_channels_map_to_topics_true_and_user_specified_topic(self) -> None:
        self.url = self.build_webhook_url(topic="test", channels_map_to_topics="1")
        expected_topic_name = "test"
        expected_message = EXPECTED_MESSAGE.format(user=LEGACY_USER, message="test")
        self.check_webhook(
            "message_info",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_slack_channels_map_to_topics_false(self) -> None:
        self.CHANNEL_NAME = "general"
        self.url = self.build_webhook_url(channels_map_to_topics="0")
        expected_topic_name = "Message from Slack"
        expected_message = EXPECTED_MESSAGE.format(user=LEGACY_USER, message="test")
        self.check_webhook(
            "message_info",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_slack_channels_map_to_topics_false_and_user_specified_topic(self) -> None:
        self.CHANNEL_NAME = "general"
        self.url = self.build_webhook_url(topic="test", channels_map_to_topics="0")
        expected_topic_name = "test"
        expected_message = EXPECTED_MESSAGE.format(user=LEGACY_USER, message="test")
        self.check_webhook(
            "message_info",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_missing_data_user_name(self) -> None:
        payload = self.get_body("message_info_missing_user_name")
        url = self.build_webhook_url()
        result = self.client_post(url, payload, content_type="application/x-www-form-urlencoded")
        self.assert_json_error(result, "Missing 'user_name' argument")

    def test_missing_data_channel_name(self) -> None:
        payload = self.get_body("message_info_missing_channel_name")
        url = self.build_webhook_url()
        result = self.client_post(url, payload, content_type="application/x-www-form-urlencoded")
        self.assert_json_error(result, "Missing 'channel_name' argument")

    def test_missing_data_text(self) -> None:
        payload = self.get_body("message_info_missing_text")
        url = self.build_webhook_url()
        result = self.client_post(url, payload, content_type="application/x-www-form-urlencoded")
        self.assert_json_error(result, "Missing 'text' argument")

    @override
    def get_body(self, fixture_name: str) -> str:
        return self.webhook_fixture_data("slack", fixture_name, file_type="txt")
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/slack/view.py
Signals: Django

```python
import re
from typing import Annotated, Any, TypeAlias

from django.http import HttpRequest
from django.http.response import HttpResponse
from django.utils.translation import gettext as _

from zerver.actions.message_send import send_rate_limited_pm_notification_to_bot_owner
from zerver.data_import.slack import check_slack_token_access, get_slack_api_data
from zerver.data_import.slack_message_conversion import (
    SLACK_USERMENTION_REGEX,
    convert_slack_formatting,
    convert_slack_workspace_mentions,
    replace_links,
)
from zerver.decorator import webhook_view
from zerver.lib.exceptions import JsonableError, UnsupportedWebhookEventTypeError
from zerver.lib.request import RequestVariableMissingError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import ApiParamConfig, typed_endpoint
from zerver.lib.validator import WildValue, check_none_or, check_string, to_wild_value
from zerver.lib.webhooks.common import check_send_webhook_message, get_setup_webhook_message
from zerver.models import UserProfile

FILE_LINK_TEMPLATE = "\n*[{file_name}]({file_link})*"
ZULIP_MESSAGE_TEMPLATE = "**{sender}**: {text}"
VALID_OPTIONS = {"SHOULD_NOT_BE_MAPPED": "0", "SHOULD_BE_MAPPED": "1"}

SlackFileListT: TypeAlias = list[dict[str, str]]
SlackAPIResponseT: TypeAlias = dict[str, Any]

SLACK_CHANNELMENTION_REGEX = r"(?<=<#)(.*)(?=>)"


def is_zulip_slack_bridge_bot_message(payload: WildValue) -> bool:
    app_api_id = payload.get("api_app_id").tame(check_none_or(check_string))
    bot_app_id = (
        payload.get("event", {})
        .get("bot_profile", {})
        .get("app_id")
        .tame(check_none_or(check_string))
    )
    return bot_app_id is not None and app_api_id == bot_app_id


def get_slack_channel_name(channel_id: str, token: str) -> str:
    slack_channel_data = get_slack_api_data(
        "https://slack.com/api/conversations.info",
        get_param="channel",
        # Sleeping is not permitted from webhook code.
        raise_if_rate_limited=True,
        token=token,
        channel=channel_id,
    )
    return slack_channel_data["name"]


def get_slack_sender_name(user_id: str, token: str) -> str:
    slack_user_data = get_slack_api_data(
        "https://slack.com/api/users.info",
        get_param="user",
        # Sleeping is not permitted from webhook code.
        raise_if_rate_limited=True,
        token=token,
        user=user_id,
    )
    return slack_user_data["real_name"]


def convert_slack_user_and_channel_mentions(text: str, app_token: str) -> str:
    tokens = text.split(" ")
    for iterator in range(len(tokens)):
        slack_usermention_match = re.search(SLACK_USERMENTION_REGEX, tokens[iterator], re.VERBOSE)
        slack_channelmention_match = re.search(
            SLACK_CHANNELMENTION_REGEX, tokens[iterator], re.MULTILINE
        )
        if slack_usermention_match:
            # Convert Slack user mentions to a mention-like syntax since there
            # is no way to map Slack and Zulip users.
            slack_id = slack_usermention_match.group(2)
            user_name = get_slack_sender_name(user_id=slack_id, token=app_token)
            tokens[iterator] = "@**" + user_name + "**"
        elif slack_channelmention_match:
            # Convert Slack channel mentions to a mention-like syntax so that
            # a mention isn't triggered for a Zulip channel with the same name.
            channel_info: list[str] = slack_channelmention_match.group(0).split("|")
            channel_name = channel_info[1]
            tokens[iterator] = (
                f"**#{channel_name}**" if channel_name else "**#[private Slack channel]**"
            )
    text = " ".join(tokens)
    return text


# This is a modified version of `convert_to_zulip_markdown` in
# `slack_message_conversion.py`, which cannot be used directly
# due to differences in the Slack import data and Slack webhook
# payloads.
def convert_to_zulip_markdown(text: str, slack_app_token: str) -> str:
    text = convert_slack_formatting(text)
    text = convert_slack_workspace_mentions(text)
    text = convert_slack_user_and_channel_mentions(text, slack_app_token)
    return text


def convert_raw_file_data(file_dict: WildValue) -> SlackFileListT:
    files = [
        {
            "file_link": file.get("permalink").tame(check_string),
            "file_name": file.get("title").tame(check_string),
        }
        for file in file_dict
    ]
    return files


def get_message_body(text: str, sender: str, files: SlackFileListT) -> str:
    body = ZULIP_MESSAGE_TEMPLATE.format(sender=sender, text=text)
    for file in files:
        body += FILE_LINK_TEMPLATE.format(**file)
    return body


def is_challenge_handshake(payload: WildValue) -> bool:
    return payload.get("type").tame(check_string) == "url_verification"


def handle_slack_webhook_message(
    request: HttpRequest,
    user_profile: UserProfile,
    content: str,
    channel: str | None,
    channels_map_to_topics: str | None,
) -> None:
    topic_name = "Message from Slack"
    if channels_map_to_topics is None:
        check_send_webhook_message(request, user_profile, topic_name, content)
    elif channels_map_to_topics == VALID_OPTIONS["SHOULD_BE_MAPPED"]:
        topic_name = f"channel: {channel}"
        check_send_webhook_message(request, user_profile, topic_name, content)
    elif channels_map_to_topics == VALID_OPTIONS["SHOULD_NOT_BE_MAPPED"]:
        check_send_webhook_message(
            request,
            user_profile,
            topic_name,
            content,
            stream=channel,
        )
    else:
        raise JsonableError(_("Error: channels_map_to_topics parameter other than 0 or 1"))


def is_retry_call_from_slack(request: HttpRequest) -> bool:
    return "X-Slack-Retry-Num" in request.headers


SLACK_INTEGRATION_TOKEN_SCOPES = {
    # For Slack's users.info endpoint: https://api.slack.com/methods/users.info
    "users:read",
    # For Slack's conversations.info endpoint: https://api.slack.com/methods/conversations.info
    "channels:read",
    # For Slack's Event's API: https://api.slack.com/events/message.channels
    "channels:history",
}

INVALID_SLACK_TOKEN_MESSAGE = """
Hi there! It looks like you're trying to set up a Slack webhook
integration. There seems to be an issue with the Slack app token
you've included in the URL (if any). Please check the error message
below to see if you're missing anything:

Error: {error_message}

Feel free to reach out to the [Zulip development community](https://chat.zulip.org/#narrow/channel/127-integrations)
if you need further help!
"""


@webhook_view("Slack", notify_bot_owner_on_invalid_json=False)
@typed_endpoint
def api_slack_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    slack_app_token: str = "",
    channels_map_to_topics: str | None = None,
    map_to_channels: Annotated[str | None, ApiParamConfig("mapping")] = None,
) -> HttpResponse:
    if request.content_type != "application/json":
        # Handle Slack's legacy Outgoing Webhook Service payload.
        expected_legacy_variable = ["user_name", "text", "channel_name"]
        legacy_payload = {}
        for variable in expected_legacy_variable:
            if variable in request.POST:
                legacy_payload[variable] = request.POST[variable]
            elif variable in request.GET:  # nocoverage
                legacy_payload[variable] = request.GET[variable]
            else:
                raise RequestVariableMissingError(variable)

        text = convert_slack_formatting(legacy_payload["text"])
        text = replace_links(text)
        text = get_message_body(text, legacy_payload["user_name"], [])
        handle_slack_webhook_message(
            request,
            user_profile,
            text,
            legacy_payload["channel_name"],
            channels_map_to_topics,
        )
        return json_success(request)

    try:
        val = request.body.decode(request.encoding or "utf-8")
    except UnicodeDecodeError:  # nocoverage
        raise JsonableError(_("Malformed payload"))
    payload = to_wild_value("payload", val)

    # Handle initial URL verification handshake for Slack Events API.
    if is_challenge_handshake(payload):
        challenge = payload.get("challenge").tame(check_string)
        try:
            if slack_app_token == "":
                raise ValueError("slack_app_token is missing.")
            check_slack_token_access(slack_app_token, SLACK_INTEGRATION_TOKEN_SCOPES)
        except (ValueError, Exception) as e:
            send_rate_limited_pm_notification_to_bot_owner(
                user_profile,
                user_profile.realm,
                INVALID_SLACK_TOKEN_MESSAGE.format(error_message=e),
            )
            # Return json success here as to not trigger retry calls
            # from Slack.
            return json_success(request)
        check_send_webhook_message(
            request,
            user_profile,
            "Integration events",
            get_setup_webhook_message("Slack"),
        )
        return json_success(request=request, data={"challenge": challenge})

    # A Slack fail condition occurs when we don't respond with HTTP 200
    # within 3 seconds after Slack calls our endpoint. If this happens,
    # Slack will retry sending the same payload. This is often triggered
    # because of we have to do two callbacks for each call. To avoid
    # sending the same message multiple times, we block subsequent retry
    # calls from Slack.
    if is_retry_call_from_slack(request):
        return json_success(request)

    # Prevent any Zulip messages sent through the Slack Bridge from looping
    # back here.
    if is_zulip_slack_bridge_bot_message(payload):
        return json_success(request)

    event_dict = payload.get("event", {})
    event_type = event_dict.get("type").tame(check_string)

    if event_type != "message":
        raise UnsupportedWebhookEventTypeError(event_type)

    raw_files = event_dict.get("files")
    files = convert_raw_file_data(raw_files) if raw_files else []
    raw_text = event_dict.get("text", "").tame(check_string)
    text = convert_to_zulip_markdown(raw_text, slack_app_token)
    user_id = event_dict.get("user").tame(check_none_or(check_string))
    if user_id is None:
        # This is likely a Slack integration bot message. The sender of these
        # messages doesn't have a user profile and would require additional
        # formatting to handle. Refer to the Slack Incoming Webhook integration
        # for how to add support for this type of payload.
        raise UnsupportedWebhookEventTypeError(
            "integration bot message"
            if event_dict["subtype"].tame(check_string) == "bot_message"
            else "unknown Slack event"
        )
    sender = get_slack_sender_name(user_id, slack_app_token)
    content = get_message_body(text, sender, files)

    # channels_map_to_topics=0 is ported to use UrlPreset.CHANNELS_MAPPING
    # (map_to_channels).
    if map_to_channels == "channels" and channels_map_to_topics is None:
        channels_map_to_topics = VALID_OPTIONS["SHOULD_NOT_BE_MAPPED"]

    channel_id = event_dict.get("channel").tame(check_string)
    channel = (
        get_slack_channel_name(channel_id, slack_app_token) if channels_map_to_topics else None
    )

    handle_slack_webhook_message(request, user_profile, content, channel, channels_map_to_topics)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: challenge_handshake_payload.json]---
Location: zulip-main/zerver/webhooks/slack/fixtures/challenge_handshake_payload.json

```json
{
  "token": "Jhj5dZrVaK7ZwHHjRyZWjbDl",
  "challenge": "3eZbrw1aBm2rZgRNFdxV2595E9CY3gmdALWMmHkvFXO7tYXAYM8P",
  "type": "url_verification"
}
```

--------------------------------------------------------------------------------

---[FILE: message_from_slack_bridge_bot.json]---
Location: zulip-main/zerver/webhooks/slack/fixtures/message_from_slack_bridge_bot.json

```json
{
  "token": "CqCsBJmXoNSHaNCt3wGWYSEe",
  "team_id": "T06NRA6HM3P",
  "context_team_id": "T06NRA6HM3P",
  "context_enterprise_id": null,
  "api_app_id": "A0757RM31HN",
  "event": {
    "user": "U074G5E1ANR",
    "type": "message",
    "ts": "1718856814.111759",
    "bot_id": "B074K2M1NF4",
    "app_id": "A0757RM31HN",
    "text": "&lt;Desdemona&gt; koo",
    "team": "T06NRA6HM3P",
    "bot_profile": {
      "id": "B074K2M1NF4",
      "deleted": false,
      "name": "export-bot",
      "updated": 1716360210,
      "app_id": "A0757RM31HN",
      "icons": {
        "image_36": "https://a.slack-edge.com/80588/img/plugins/app/bot_36.png",
        "image_48": "https://a.slack-edge.com/80588/img/plugins/app/bot_48.png",
        "image_72": "https://a.slack-edge.com/80588/img/plugins/app/service_72.png"
      },
      "team_id": "T06NRA6HM3P"
    },
    "blocks": [
      {
        "type": "rich_text",
        "block_id": "a6Fvn",
        "elements": [
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "text",
                "text": "<Desdemona> koo"
              }
            ]
          }
        ]
      }
    ],
    "channel": "C06NRA6JLER",
    "event_ts": "1718856814.111759",
    "channel_type": "channel"
  },
  "type": "event_callback",
  "event_id": "Ev078H33MYDV",
  "event_time": 1718856814,
  "authorizations": [
    {
      "enterprise_id": null,
      "team_id": "T06NRA6HM3P",
      "user_id": "U074G5E1ANR",
      "is_bot": true,
      "is_enterprise_install": false
    }
  ],
  "is_ext_shared_channel": false,
  "event_context": "4-eyJldCI6Im1lc3NhZ2UiLCJ0aWQiOiJUMDZOUkE2SE0zUCIsImFpZCI6IkEwNzU3Uk0zMUhOIiwiY2lkIjoiQzA2TlJBNkpMRVIifQ"
}
```

--------------------------------------------------------------------------------

---[FILE: message_from_slack_integration_bot.json]---
Location: zulip-main/zerver/webhooks/slack/fixtures/message_from_slack_integration_bot.json

```json
{
    "token": "x8GlZSSaBheFZWjZPbxPasEY",
    "team_id": "T06NRA6HM3P",
    "context_team_id": "T06NRA6HM3P",
    "context_enterprise_id": null,
    "api_app_id": "A07A20JQSAG",
    "event": {
      "subtype": "bot_message",
      "text": "*Task status changed* from `complete` to `to do`",
      "username": "ClickUp",
      "attachments": [
        {
          "id": 1,
          "blocks": [
            {
              "type": "section",
              "block_id": "bZ4XB",
              "text": {
                "type": "mrkdwn",
                "text": "*<https://app.clickup.com/t/25567147/86cw30wf2|asd>*",
                "verbatim": false
              }
            },
            {
              "type": "context",
              "block_id": "TEfLM",
              "elements": [
                {
                  "type": "image",
                  "image_url": "https://search.clickup-au.com/media/app-icons/clickup/logo_alpha.png",
                  "alt_text": "Cookie / The Goodiest of Cstdddddsdd / dds"
                },
                {
                  "type": "mrkdwn",
                  "text": "in dds",
                  "verbatim": false
                },
                {
                  "type": "image",
                  "image_url": "https://search.clickup-au.com/media/app-icons/clickup/status.png",
                  "alt_text": "Status"
                },
                {
                  "type": "mrkdwn",
                  "text": "To Do",
                  "verbatim": false
                }
              ]
            },
            {
              "type": "actions",
              "block_id": "cg8fg",
              "elements": [
                {
                  "type": "button",
                  "action_id": "NOOP",
                  "text": {
                    "type": "plain_text",
                    "text": "View task",
                    "emoji": true
                  },
                  "url": "https://app.clickup.com/t/25567147/86cw30wf2"
                },
                {
                  "type": "button",
                  "action_id": "EDIT_TASK_ACTION",
                  "text": {
                    "type": "plain_text",
                    "text": "Edit task",
                    "emoji": true
                  },
                  "value": "{\"taskID\":\"86cw30wf2\",\"teamID\":\"25567147\",\"taskUrl\":\"https://app.clickup.com/t/25567147/86cw30wf2\"}"
                }
              ]
            }
          ],
          "color": "#656f7d",
          "fallback": "[no preview available]"
        }
      ],
      "type": "message",
      "ts": "1723609070.703489",
      "bot_id": "B06NWMNUQ3W",
      "app_id": "A3G4A68V9",
      "blocks": [
        {
          "type": "section",
          "block_id": "X0xqC",
          "text": {
            "type": "mrkdwn",
            "text": "*Task status changed* from `complete` to `to do`",
            "verbatim": false
          }
        }
      ],
      "channel": "C06P6T3QGD7",
      "event_ts": "1723609070.703489",
      "channel_type": "channel"
    },
    "type": "event_callback",
    "event_id": "Ev07GMTJQFEJ",
    "event_time": 1723609070,
    "authorizations": [
      {
        "enterprise_id": null,
        "team_id": "T06NRA6HM3P",
        "user_id": "U07A1PEN4JW",
        "is_bot": true,
        "is_enterprise_install": false
      }
    ],
    "is_ext_shared_channel": false,
    "event_context": "4-eyJldCI6Im1lc3NhZ2UiLCJ0aWQiOiJUMDZOUkE2SE0zUCIsImFpZCI6IkEwN0EyMEpRU0FHIiwiY2lkIjoiQzA2UDZUM1FHRDcifQ"
  }
```

--------------------------------------------------------------------------------

---[FILE: message_info.txt]---
Location: zulip-main/zerver/webhooks/slack/fixtures/message_info.txt

```text
token=aotJImaVOVEVWssawxmegDWt&team_id=T3W8CTX0F&team_domain=gsoc2017&service_id=133126759712&channel_id=C3W8CTZFZ&channel_name=general&timestamp=1485947263.000010&user_id=U3W8CTX2T&user_name=slack_user&text=test
```

--------------------------------------------------------------------------------

---[FILE: message_info_missing_channel_name.txt]---
Location: zulip-main/zerver/webhooks/slack/fixtures/message_info_missing_channel_name.txt

```text
token=aotJImaVOVEVWssawxmegDWt&team_id=T3W8CTX0F&team_domain=gsoc2017&service_id=133126759712&channel_id=C3W8CTZFZ&timestamp=1485947263.000010&user_id=U3W8CTX2T&user_name=slack_user&text=test
```

--------------------------------------------------------------------------------

---[FILE: message_info_missing_text.txt]---
Location: zulip-main/zerver/webhooks/slack/fixtures/message_info_missing_text.txt

```text
token=aotJImaVOVEVWssawxmegDWt&team_id=T3W8CTX0F&team_domain=gsoc2017&service_id=133126759712&channel_id=C3W8CTZFZ&channel_name=general&timestamp=1485947263.000010&user_name=slack_user&user_id=U3W8CTX2T
```

--------------------------------------------------------------------------------

````
