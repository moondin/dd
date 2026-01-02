---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 559
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 559 of 1290)

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

---[FILE: generate-integration-docs-screenshot]---
Location: zulip-main/tools/screenshots/generate-integration-docs-screenshot

```text
#!/usr/bin/env python3
"""Create or update a webhook integration screenshot using a test fixture."""

import argparse
import base64
import os
import re
import subprocess
import sys
from typing import Any
from urllib.parse import parse_qsl, urlencode

import zulip

SCREENSHOTS_DIR = os.path.abspath(os.path.dirname(__file__))
TOOLS_DIR = os.path.abspath(os.path.dirname(SCREENSHOTS_DIR))
ROOT_DIR = os.path.dirname(TOOLS_DIR)
sys.path.insert(0, ROOT_DIR)

# check for the venv
from tools.lib import sanity_check

sanity_check.check_venv(__file__)

from scripts.lib.setup_path import setup_path

setup_path()

os.environ["DJANGO_SETTINGS_MODULE"] = "zproject.settings"
import django

django.setup()

import orjson
import requests

from scripts.lib.zulip_tools import BOLDRED, ENDC
from tools.lib.test_script import prepare_puppeteer_run
from zerver.actions.create_user import do_create_user, notify_created_bot
from zerver.actions.streams import bulk_add_subscriptions
from zerver.actions.user_settings import do_change_avatar_fields
from zerver.lib.integrations import (
    FIXTURELESS_INTEGRATIONS_WITH_SCREENSHOTS,
    INCOMING_WEBHOOK_INTEGRATIONS,
    INTEGRATIONS,
    FixturelessScreenshotConfig,
    IncomingWebhookIntegration,
    Integration,
    WebhookScreenshotConfig,
    get_fixture_path,
    get_image_path,
    split_fixture_path,
)
from zerver.lib.storage import static_path
from zerver.lib.streams import create_stream_if_needed
from zerver.lib.upload import upload_avatar_image
from zerver.lib.webhooks.common import get_fixture_http_headers, parse_multipart_string
from zerver.models import Message, UserProfile
from zerver.models.realms import get_realm
from zerver.models.users import get_user_by_delivery_email


def create_integration_bot(integration: Integration, bot_name: str | None = None) -> UserProfile:
    realm = get_realm("zulip")
    owner = get_user_by_delivery_email("iago@zulip.com", realm)
    email_prefix = (
        re.sub(r"[^a-zA-Z0-9_-]", "", bot_name.strip()).lower()[:64]
        if bot_name
        else integration.name
    )
    bot_email = f"{email_prefix}-bot@example.com"
    if bot_name is None:
        bot_name = f"{integration.display_name} Bot"
    try:
        bot = UserProfile.objects.get(email=bot_email)
    except UserProfile.DoesNotExist:
        bot = do_create_user(
            email=bot_email,
            password="123",
            realm=owner.realm,
            full_name=bot_name,
            bot_type=UserProfile.INCOMING_WEBHOOK_BOT,
            bot_owner=owner,
            acting_user=owner,
        )
        notify_created_bot(bot)

        bot_avatar_path = integration.get_bot_avatar_path()
        bot_avatar_path = static_path(bot_avatar_path)
        if os.path.isfile(bot_avatar_path):
            with open(bot_avatar_path, "rb") as f:
                upload_avatar_image(f, bot)
                do_change_avatar_fields(bot, UserProfile.AVATAR_FROM_USER, acting_user=owner)
        else:
            raise ValueError(f"Bot avatar file {bot_avatar_path} does not exist.")

    return bot


def create_integration_channel(channel_name: str, bot: UserProfile) -> None:
    assert isinstance(bot.bot_owner, UserProfile)
    realm = bot.bot_owner.realm
    channel, _created = create_stream_if_needed(realm, channel_name)
    bulk_add_subscriptions(realm, [channel], [bot, bot.bot_owner], acting_user=bot)


def get_fixture_info(fixture_path: str) -> tuple[Any, bool, bool, str]:
    json_fixture = fixture_path.endswith(".json")
    multipart_fixture = fixture_path.endswith(".multipart")
    _, fixture_name = split_fixture_path(fixture_path)

    if fixture_name:
        if not os.path.exists(fixture_path):
            raise FileNotFoundError(
                f"{BOLDRED}The fixture '{fixture_path}' does not exist. Please check the fixture file name and try again.{ENDC}"
            )
        if json_fixture:
            with open(fixture_path, "rb") as fb:
                data = orjson.loads(fb.read())
        else:
            with open(fixture_path) as f:
                data = f.read().strip()
            if multipart_fixture:
                data = parse_multipart_string(data)
    else:
        data = ""

    return data, json_fixture, multipart_fixture, fixture_name


def get_requests_headers(integration_dir_name: str, fixture_name: str) -> dict[str, Any]:
    headers = get_fixture_http_headers(integration_dir_name, fixture_name)

    def fix_name(header: str) -> str:
        return header.removeprefix("HTTP_").replace("_", "-")

    return {fix_name(k): v for k, v in headers.items()}


def custom_headers(headers_json: str) -> dict[str, str]:
    if not headers_json:
        return {}
    try:
        return orjson.loads(headers_json)
    except orjson.JSONDecodeError as ve:
        raise argparse.ArgumentTypeError(
            f"Encountered an error while attempting to parse custom headers: {ve}\n"
            "Note: all strings must be enclosed within \"\" instead of ''"
        )


def send_bot_payload_message(
    bot: UserProfile,
    integration: IncomingWebhookIntegration,
    fixture_path: str,
    config: WebhookScreenshotConfig,
) -> bool:
    # Delete all messages, so new message is the only one it's message group
    Message.objects.filter(realm_id=bot.realm_id, sender=bot).delete()
    data, json_fixture, multipart_fixture, fixture_name = get_fixture_info(fixture_path)

    headers = get_requests_headers(integration.dir_name, fixture_name)
    if config.custom_headers:
        headers.update(config.custom_headers)
    if config.use_basic_auth:
        credentials = base64.b64encode(f"{bot.email}:{bot.api_key}".encode()).decode()
        auth = f"basic {credentials}"
        headers.update(dict(Authorization=auth))

    assert isinstance(bot.bot_owner, UserProfile)
    channel_name = config.channel or integration.name
    url = f"{bot.bot_owner.realm.url}/{integration.url}"
    params = {"api_key": bot.api_key, "stream": channel_name}
    params.update(config.extra_params)

    extra_args = {}
    if multipart_fixture:
        extra_args = {"data": data}

    elif not json_fixture and data:
        assert isinstance(data, str)

        # fixtures with url parameters
        if "&" in data:
            # Overwrite the fixture params, in case of overlap.
            parsed_params = dict(parse_qsl(data))
            parsed_params.update(params)
            params = parsed_params

        # fixtures with plain/text payload
        else:
            extra_args = {"data": data}

    elif config.payload_as_query_param:
        params[config.payload_param_name] = orjson.dumps(data).decode()

    else:
        extra_args = {"json": data}

    url = f"{url}?{urlencode(params)}"

    try:
        response = requests.post(url=url, headers=headers, **extra_args)
    except requests.exceptions.ConnectionError:
        print(
            "This tool needs the local dev server to be running. "
            "Please start it using tools/run-dev before running this tool."
        )
        sys.exit(1)
    if response.status_code != 200:
        print(response.json())
        print("Failed to trigger webhook")
        return False
    else:
        print(f"Triggered {integration.name} webhook")
        return True


def send_bot_mock_message(bot: UserProfile, channel: str, topic: str, message: str) -> None:
    # Delete all messages, so that the new message is the only one in its message group
    Message.objects.filter(realm_id=bot.realm_id, sender=bot).delete()
    assert bot.bot_owner is not None
    url = f"{bot.bot_owner.realm.url}"
    client = zulip.Client(email=bot.email, api_key=bot.api_key, site=url)

    request = {"type": "stream", "to": channel, "topic": topic, "content": message}
    client.send_message(request)


def capture_last_message_screenshot(bot: UserProfile, image_path: str) -> None:
    message = Message.objects.filter(realm_id=bot.realm_id, sender=bot).last()
    realm = get_realm("zulip")
    if message is None:
        print(f"No message found for {bot.full_name}")
        return
    message_id = str(message.id)
    screenshot_script = os.path.join(SCREENSHOTS_DIR, "message-screenshot.ts")
    subprocess.check_call(["node", screenshot_script, message_id, image_path, realm.url])


def generate_screenshots_for_integration(integration: Integration) -> None:
    if integration.screenshot_configs is not None:
        for screenshot_config in integration.screenshot_configs:
            generate_screenshot_from_config(integration.name, screenshot_config)


def generate_screenshot_from_config(
    integration_name: str, screenshot_config: WebhookScreenshotConfig | FixturelessScreenshotConfig
) -> None:
    integration = INTEGRATIONS[integration_name]
    bot = create_integration_bot(integration, screenshot_config.bot_name)
    channel_name = screenshot_config.channel or integration.name
    create_integration_channel(channel_name, bot)
    image_path = get_image_path(integration, screenshot_config)

    if isinstance(integration, IncomingWebhookIntegration):
        assert isinstance(screenshot_config, WebhookScreenshotConfig)
        fixture_path = get_fixture_path(integration, screenshot_config)
        message_sent = send_bot_payload_message(bot, integration, fixture_path, screenshot_config)
    else:
        assert isinstance(screenshot_config, FixturelessScreenshotConfig)
        send_bot_mock_message(
            bot,
            channel=channel_name,
            topic=screenshot_config.topic,
            message=screenshot_config.message,
        )
        message_sent = True

    if message_sent:
        capture_last_message_screenshot(bot, image_path)
        print(f"Screenshot captured to: {BOLDRED}{image_path}{ENDC}")


parser = argparse.ArgumentParser()

batch_group = parser.add_mutually_exclusive_group(required=True)
batch_group.add_argument("--all", action="store_true")
batch_group.add_argument("--all-webhook", action="store_true")
batch_group.add_argument("--all-fixtureless", action="store_true")
batch_group.add_argument(
    "--skip-until",
    help="Name of the integration to start processing from, including all that follow in alphabetical order. Similar to --all",
)
batch_group.add_argument("--integration", nargs="+", help="Names of specific integrations")

common_group = parser.add_argument_group()
common_group.add_argument("--image-name", help="Name for the screenshot image")
common_group.add_argument("--image-dir", help="Directory name where to save the screenshot image")
common_group.add_argument("--bot-name", help="Name to use for the bot")

webhook_group = parser.add_argument_group("Webhook integrations options")
webhook_group.add_argument(
    "--fixture-name",
    help="Name of the fixture file to use. All other webhook options are ignored if the fixture is not specified.",
)
webhook_group.add_argument(
    "-A", "--use-basic-auth", action="store_true", help="Add basic auth headers to the request"
)
webhook_group.add_argument(
    "-Q",
    "--payload-as-query-param",
    action="store_true",
    help="Send payload as query param instead of body",
)
webhook_group.add_argument("-P", "--payload-param-name", help="Param name to use for the payload")
webhook_group.add_argument(
    "-H",
    "--custom-headers",
    type=custom_headers,
    help="Any additional headers to be sent with the request.",
)

fixtureless_group = parser.add_argument_group("Fixtureless non-webhook integrations options")
fixtureless_group.add_argument("-T", "--topic", help="Topic to use for the mock message")
fixtureless_group.add_argument("-M", "--message", help="Message to use for the mock message")
fixtureless_group.add_argument(
    "-C",
    "--channel",
    help="Channel name to use for the mock message. Ignored if --topic and --message are not specified.",
)

options = parser.parse_args()
prepare_puppeteer_run()


def validate_integration_count(
    options: argparse.Namespace, parser: argparse.ArgumentParser, option_name: str
) -> None:
    if len(options.integration) != 1:
        parser.error(
            f"Exactly one integration should be specified with --integration when --{option_name} is provided"
        )


def build_config(options: argparse.Namespace, config_keys: list[str]) -> dict[str, Any]:
    config = {
        key: getattr(options, key) for key in config_keys if getattr(options, key) is not None
    }
    return config


def generate_full_batch_screenshots(
    option_key: str,
    integration_list: list[Integration] | list[IncomingWebhookIntegration],
    batch_type: str,
) -> None:
    for key, value in vars(options).items():
        if key != option_key and value:
            print(f"Generating screenshots for {batch_type}. Ignoring all command-line options")
            break
    for integration in integration_list:
        generate_screenshots_for_integration(integration)


if options.all:
    generate_full_batch_screenshots("all", list(INTEGRATIONS.values()), "all integrations")
elif options.all_webhook:
    generate_full_batch_screenshots(
        "all_webhook", INCOMING_WEBHOOK_INTEGRATIONS, "all incoming webhook integrations"
    )
elif options.all_fixtureless:
    fixtureless_integrations_list = [
        INTEGRATIONS[name] for name in FIXTURELESS_INTEGRATIONS_WITH_SCREENSHOTS
    ]
    generate_full_batch_screenshots(
        "all_fixtureless", fixtureless_integrations_list, "all fixtureless integrations"
    )
elif options.skip_until:
    for key, value in vars(options).items():
        if key != "skip_until" and value:
            print(
                f"Generating screenshots for all integrations starting from {options.skip_until}. Ignoring all command-line options"
            )
            break
    skip = True
    for integration_name in sorted(INTEGRATIONS):
        if integration_name == options.skip_until:
            skip = False
        if skip:
            continue
        generate_screenshots_for_integration(INTEGRATIONS[integration_name])

elif options.fixture_name:
    validate_integration_count(options, parser, "fixture-name")
    webhook_options = [action.dest for action in webhook_group._group_actions]
    common_options = [action.dest for action in common_group._group_actions]
    config = build_config(options, webhook_options + common_options)
    webhook_screenshot_config = WebhookScreenshotConfig(**config)
    generate_screenshot_from_config(options.integration[0], webhook_screenshot_config)

elif options.topic or options.message:
    if not options.topic or not options.message:
        parser.error("Both --topic and --message must be specified together")
    validate_integration_count(options, parser, "topic")
    fixtureless_options = [action.dest for action in fixtureless_group._group_actions]
    common_options = [action.dest for action in common_group._group_actions]
    config = build_config(options, fixtureless_options + common_options)
    fixtureless_screenshot_config = FixturelessScreenshotConfig(**config)
    generate_screenshot_from_config(options.integration[0], fixtureless_screenshot_config)

elif options.integration:
    for integration in options.integration:
        assert integration in INTEGRATIONS
        configs = INTEGRATIONS[integration].screenshot_configs
        if configs is None:
            parser.error(f"Could not find screenshot configuration for integration {integration}. ")
        for screenshot_config in configs:
            generate_screenshot_from_config(integration, screenshot_config)

else:
    parser.error(
        "Could not find configuration for integration. "
        "You can specify a fixture file to use, using the --fixture flag. "
        "Or add a configuration to the corresponding integration in zerver.lib.integrations.INTEGRATIONS.",
    )
```

--------------------------------------------------------------------------------

---[FILE: generate-user-messages-screenshot]---
Location: zulip-main/tools/screenshots/generate-user-messages-screenshot

```text
#!/usr/bin/env python3
"""Create or update a message thread screenshot using a thread file."""

import argparse
import os
import subprocess
import sys
from datetime import datetime, timezone

from django.conf import settings
from pydantic import BaseModel, ConfigDict

SCREENSHOTS_DIR = os.path.abspath(os.path.dirname(__file__))
TOOLS_DIR = os.path.abspath(os.path.dirname(SCREENSHOTS_DIR))
ROOT_DIR = os.path.dirname(TOOLS_DIR)
sys.path.insert(0, ROOT_DIR)

# check for the venv
from tools.lib import sanity_check

sanity_check.check_venv(__file__)

from scripts.lib.setup_path import setup_path

setup_path()

os.environ["DJANGO_SETTINGS_MODULE"] = "zproject.settings"
import django

django.setup()

import json

from tools.lib.test_script import prepare_puppeteer_run
from zerver.actions.create_user import do_create_user
from zerver.actions.message_edit import check_update_message
from zerver.actions.message_flags import do_update_message_flags
from zerver.actions.message_send import do_send_messages, internal_prep_stream_message
from zerver.actions.reactions import do_add_reaction
from zerver.actions.streams import bulk_add_subscriptions, do_change_subscription_property
from zerver.actions.user_groups import check_add_user_group
from zerver.actions.user_settings import do_change_avatar_fields
from zerver.lib.emoji import get_emoji_data
from zerver.lib.message import SendMessageRequest, access_message
from zerver.lib.stream_subscription import get_active_subscriptions_for_stream_id
from zerver.lib.streams import access_stream_by_id, ensure_stream
from zerver.lib.timestamp import datetime_to_timestamp
from zerver.lib.upload import upload_avatar_image
from zerver.lib.url_encoding import topic_narrow_url
from zerver.models import Message, UserProfile
from zerver.models.groups import NamedUserGroup
from zerver.models.realms import get_realm
from zerver.models.users import get_system_bot, get_user_by_delivery_email

realm = get_realm("zulip")
realm.message_content_edit_limit_seconds = None
realm.save()

DEFAULT_USER = get_user_by_delivery_email("iago@zulip.com", realm)
NOTIFICATION_BOT = get_system_bot(settings.NOTIFICATION_BOT, realm.id)
message_thread_ids: list[int] = []

USER_AVATARS_MAP = {
    "Ariella Drake": "tools/screenshots/user_avatars/AriellaDrake.png",
    "Elena García": "tools/screenshots/user_avatars/ElenaGarcia.jpg",
    "Kevin Lin": "tools/screenshots/user_avatars/KevinLin.png",
    "Zoe Davis": "tools/screenshots/user_avatars/ZoeDavis.png",
    "Bo Williams": "tools/screenshots/user_avatars/BoWilliams.png",
    "James Williams": "tools/screenshots/user_avatars/JamesWilliams.png",
    "Manvir Singh": "tools/screenshots/user_avatars/ManvirSingh.png",
    "Dal Kim": "tools/screenshots/user_avatars/DalKim.jpg",
    "John Lin": "tools/screenshots/user_avatars/JohnLin.png",
    "Maxy Stert": "tools/screenshots/user_avatars/MaxyStert.jpg",
}


class MessageThread(BaseModel):
    model_config = ConfigDict(frozen=True)

    sender: str
    content: str
    starred: bool
    edited: bool
    reactions: dict[str, list[str]]
    date: dict[str, int]


def create_user(full_name: str, avatar_filename: str | None) -> None:
    email = f"{full_name.replace(' ', '').replace('í', 'i')}@zulip.com"
    try:
        user = UserProfile.objects.get(realm=realm, full_name=full_name)
    except UserProfile.DoesNotExist:
        user = do_create_user(email, "password", realm, full_name, acting_user=DEFAULT_USER)

    if avatar_filename is not None:
        set_avatar(user, avatar_filename)


def set_avatar(user: UserProfile, filename: str) -> None:
    with open(filename, "rb") as f:
        upload_avatar_image(f, user)
    do_change_avatar_fields(user, UserProfile.AVATAR_FROM_USER, acting_user=DEFAULT_USER)


def create_and_subscribe_stream(
    stream_name: str, users: list[str], color: str | None = None, invite_only: bool = False
) -> None:
    stream = ensure_stream(realm, stream_name, invite_only=invite_only, acting_user=DEFAULT_USER)
    bulk_add_subscriptions(
        realm,
        [stream],
        list(UserProfile.objects.filter(realm=realm, full_name__in=users)),
        acting_user=DEFAULT_USER,
    )

    (stream, sub) = access_stream_by_id(DEFAULT_USER, stream.id)
    assert sub is not None
    if color is not None:
        do_change_subscription_property(
            DEFAULT_USER, sub, stream, "color", color, acting_user=DEFAULT_USER
        )


def send_stream_messages(
    stream_name: str, topic: str, staged_messages_data: list[MessageThread]
) -> list[int]:
    staged_messages = [dict(staged_message) for staged_message in staged_messages_data]
    stream = ensure_stream(realm, stream_name, acting_user=DEFAULT_USER)
    subscribers_query = get_active_subscriptions_for_stream_id(
        stream.id, include_deactivated_users=False
    ).values_list("user_profile", flat=True)

    subscribers: dict[str, UserProfile] = {}
    for subscriber_id in subscribers_query:
        subscriber = UserProfile.objects.get(realm=realm, id=subscriber_id)
        subscribers[subscriber.full_name] = subscriber

    subscribers["Notification Bot"] = NOTIFICATION_BOT

    messages: list[SendMessageRequest | None] = []

    for message in staged_messages:
        date_sent = message["date"]

        message_request = internal_prep_stream_message(
            subscribers[message["sender"]],
            stream,
            topic,
            message["content"],
            forged=True,
            forged_timestamp=datetime_to_timestamp(
                datetime(
                    date_sent["year"],
                    date_sent["month"],
                    date_sent["day"],
                    date_sent["hour"],
                    date_sent["minute"],
                    tzinfo=timezone.utc,
                )
            ),
        )
        messages.append(message_request)

    message_ids = [
        sent_message_result.message_id for sent_message_result in do_send_messages(messages)
    ]
    global message_thread_ids
    message_thread_ids += message_ids

    for message, message_id in zip(staged_messages, message_ids, strict=False):
        if message.get("reactions") is not None:
            reactions = message["reactions"]
            for reaction, user_names in reactions.items():
                users = [subscribers[user_name] for user_name in user_names]
                add_message_reactions(message_id, reaction, users)

        if message.get("starred"):
            do_update_message_flags(DEFAULT_USER, "add", "starred", [message_id])

        if message.get("edited"):
            sender = UserProfile.objects.get(realm=realm, full_name=message["sender"])
            updated_content = message["content"] + " "
            check_update_message(sender, message_id, content=updated_content)

    return message_ids


def add_message_reactions(message_id: int, emoji: str, users: list[UserProfile]) -> None:
    preview_message = access_message(
        user_profile=DEFAULT_USER, message_id=message_id, is_modifying_message=False
    )
    emoji_data = get_emoji_data(realm.id, emoji)
    for user in users:
        do_add_reaction(
            user, preview_message, emoji, emoji_data.emoji_code, emoji_data.reaction_type
        )


def create_user_group(group_name: str, members: list[str]) -> None:
    member_profiles = [
        UserProfile.objects.get(realm=realm, full_name=member_name) for member_name in members
    ]
    member_profiles.append(DEFAULT_USER)
    check_add_user_group(realm, group_name, member_profiles, acting_user=DEFAULT_USER)


def capture_streams_narrow_screenshot(
    image_path: str, stream_name: str, topic: str, unread_msg_id: int
) -> None:
    stream = ensure_stream(realm, stream_name, acting_user=DEFAULT_USER)

    narrow_uri = topic_narrow_url(realm=realm, stream=stream, topic_name=topic)
    narrow = f"{stream_name}/{topic}"
    screenshot_script = os.path.join(SCREENSHOTS_DIR, "thread-screenshot.ts")
    subprocess.check_call(
        ["node", screenshot_script, narrow_uri, narrow, str(unread_msg_id), image_path, realm.url]
    )


DESCRIPTION = """
Generate screenshots of messages for corporate pages.

This script takes a json file with conversation details, and runs
tools/thread-screenshot.ts to take cropped screenshots of the
generated messages with puppeteer.

Make sure you have the dev environment up and running in a separate
terminal window when you run the script.

Note that you will often want to update the content of existing
json files (e.g., tools/screenshots/for-events.json) when you are
taking updated screenshots. For example, updating any dates for
the current year is recommended.

Also, note that you may need to adjust the viewport width in the
puppeteer code and/or update the channel or topic names in the json
content so that message header bars don't have truncated (...)
channel or topic names due to web app UI changes.
"""

parser = argparse.ArgumentParser(
    description=DESCRIPTION, formatter_class=argparse.RawTextHelpFormatter
)
group = parser.add_mutually_exclusive_group(required=True)

group.add_argument(
    "--thread",
    nargs="+",
    help="Path of the file where the thread for screenshot is present",
)
fixture_group = parser.add_argument_group("thread")

options = parser.parse_args()
prepare_puppeteer_run()

try:
    realm = get_realm("zulip")
    with open(options.thread[0]) as f:
        threads = json.load(f)
        for thread in threads:
            for user in thread["users"]:
                user_avatar = USER_AVATARS_MAP.get(user)
                create_user(user, user_avatar)

            if thread["recipient_type"] == "channel":
                users = list(thread["users"].keys())
                users.append("Iago")

                if thread.get("user_groups") is not None:
                    for user_group in thread.get("user_groups"):
                        user_grp = NamedUserGroup.objects.filter(
                            name=user_group["group_name"], realm_for_sharding=realm
                        ).first()
                        if user_grp is not None:
                            user_grp.delete()

                        create_user_group(user_group["group_name"], user_group["members"])

                invite_only = (
                    False if thread.get("invite_only") is None else thread.get("invite_only")
                )
                create_and_subscribe_stream(thread["channel"], users, thread["color"], invite_only)
                message_ids = send_stream_messages(
                    thread["channel"], thread["topic"], thread["messages"]
                )
                capture_streams_narrow_screenshot(
                    thread["screenshot"], thread["channel"], thread["topic"], min(message_ids)
                )


finally:
    Message.objects.filter(id__in=message_thread_ids).delete()
```

--------------------------------------------------------------------------------

---[FILE: message-screenshot.ts]---
Location: zulip-main/tools/screenshots/message-screenshot.ts
Signals: Zod

```typescript
/* global $, CSS */

import * as assert from "node:assert/strict";
import * as fs from "node:fs";
import path from "node:path";
import {parseArgs} from "node:util";

import "css.escape";
import * as puppeteer from "puppeteer";
import * as z from "zod/mini";

const usage = "Usage: message-screenshot.ts <message_id> <image_path> <realm_url>";
const {
    values: {help},
    positionals,
} = parseArgs({options: {help: {type: "boolean"}}, allowPositionals: true});

if (help) {
    console.log(usage);
    process.exit(0);
}

const parsed = z
    .tuple([
        z.string(),
        z.templateLiteral([z.string(), z.enum([".png", ".jpeg", ".webp"])]),
        z.url(),
    ])
    .safeParse(positionals);
if (!parsed.success) {
    console.error(usage);
    process.exit(1);
}
const [messageId, imagePath, realmUrl] = parsed.data;

console.log(`Capturing screenshot for message ${messageId} to ${imagePath}`);

// TODO: Refactor to share code with web/e2e-tests/realm-creation.test.ts
async function run(): Promise<void> {
    const browser = await puppeteer.launch({
        args: [
            "--window-size=1400,1024",
            "--no-sandbox",
            "--disable-setuid-sandbox",
            // Helps render fonts correctly on Ubuntu: https://github.com/puppeteer/puppeteer/issues/661
            "--font-render-hinting=none",
        ],
        defaultViewport: null,
        headless: true,
    });
    try {
        const page = await browser.newPage();
        // deviceScaleFactor:2 gives better quality screenshots (higher pixel density)
        await page.setViewport({width: 1280, height: 1024, deviceScaleFactor: 2});
        await page.goto(`${realmUrl}/devlogin`);
        // wait for Iago devlogin button and click on it.
        await page.waitForSelector('[value="iago@zulip.com"]');

        // By waiting till DOMContentLoaded we're confirming that Iago is logged in.
        await Promise.all([
            page.waitForNavigation({waitUntil: "domcontentloaded"}),
            page.click('[value="iago@zulip.com"]'),
        ]);

        // Navigate to message and capture screenshot
        await page.goto(`${realmUrl}/#narrow/id/${messageId}`, {
            waitUntil: "networkidle2",
        });
        // eslint-disable-next-line no-undef
        const message_list_id = await page.evaluate(() => zulip_test.current_msg_list?.id);
        assert.ok(message_list_id !== undefined);
        const messageSelector = `#message-row-${message_list_id}-${CSS.escape(messageId)}`;
        await page.waitForSelector(messageSelector);
        // remove unread marker and don't select message
        const marker = `#message-row-${message_list_id}-${CSS.escape(messageId)} .unread_marker`;
        await page.evaluate((sel) => $(sel).remove(), marker);
        const messageBox = await page.$(messageSelector);
        assert.ok(messageBox !== null);
        await page.evaluate((msg) => $(msg).removeClass("selected_message"), messageSelector);
        const messageGroup = await messageBox.$("xpath/..");
        assert.ok(messageGroup !== null);
        // Compute screenshot area, with some padding around the message group
        const box = await messageGroup.boundingBox();
        assert.ok(box !== null);
        const imageDir = path.dirname(imagePath);
        await fs.promises.mkdir(imageDir, {recursive: true});
        await page.screenshot({
            path: imagePath,
            clip: {x: box.x - 5, y: box.y + 5, width: box.width + 10, height: box.height},
        });
    } finally {
        await browser.close();
    }
}

await run();
```

--------------------------------------------------------------------------------

---[FILE: thread-screenshot.ts]---
Location: zulip-main/tools/screenshots/thread-screenshot.ts
Signals: Zod

```typescript
/* global $, CSS */

import * as assert from "node:assert/strict";
import * as fs from "node:fs";
import path from "node:path";
import {parseArgs} from "node:util";

import "css.escape";
import * as puppeteer from "puppeteer";
import * as z from "zod/mini";

const usage =
    "Usage: thread-screenshot.ts <narrow_uri> <narrow> <message_id> <image_path> <realm_url>";
const {
    values: {help},
    positionals,
} = parseArgs({options: {help: {type: "boolean"}}, allowPositionals: true});

if (help) {
    console.log(usage);
    process.exit(0);
}

const parsed = z
    .tuple([
        z.url(),
        z.string(),
        z.string(),
        z.templateLiteral([z.string(), z.enum([".png", ".jpeg", ".webp"])]),
        z.url(),
    ])
    .safeParse(positionals);
if (!parsed.success) {
    console.error(usage);
    process.exit(1);
}
const [narrowUri, narrow, messageId, imagePath, realmUrl] = parsed.data;

console.log(`Capturing screenshot for ${narrow} to ${imagePath}`);

// TODO: Refactor to share code with web/e2e-tests/realm-creation.test.ts
async function run(): Promise<void> {
    const browser = await puppeteer.launch({
        args: [
            "--window-size=500,1024",
            "--no-sandbox",
            "--disable-setuid-sandbox",
            // Helps render fonts correctly on Ubuntu: https://github.com/puppeteer/puppeteer/issues/661
            "--font-render-hinting=none",
        ],
        defaultViewport: null,
        headless: true,
    });
    try {
        const page = await browser.newPage();
        // deviceScaleFactor:2 gives better quality screenshots (higher pixel density)
        await page.setViewport({width: 580, height: 1024, deviceScaleFactor: 2});
        await page.goto(`${realmUrl}/devlogin`);
        // wait for Iago devlogin button and click on it.
        await page.waitForSelector('[value="iago@zulip.com"]');

        // By waiting till DOMContentLoaded we're confirming that Iago is logged in.
        await Promise.all([
            page.waitForNavigation({waitUntil: "domcontentloaded"}),
            page.click('[value="iago@zulip.com"]'),
        ]);

        // Close any banner at the top of the app before taking any screenshots.
        const top_banner_close_button_selector = ".banner-close-action";
        await page.waitForSelector(top_banner_close_button_selector);
        await page.click(top_banner_close_button_selector);

        // Navigate to message and capture screenshot
        await page.goto(narrowUri, {
            waitUntil: "networkidle2",
        });
        // eslint-disable-next-line no-undef
        const message_list_id = await page.evaluate(() => zulip_test.current_msg_list?.id);
        assert.ok(message_list_id !== undefined);
        const messageListSelector = "#message-lists-container";
        await page.waitForSelector(messageListSelector);

        // remove unread marker and don't select message
        const marker = `.message-list[data-message-list-id="${CSS.escape(
            `${message_list_id}`,
        )}"] .unread_marker`;
        await page.evaluate((sel) => {
            $(sel).remove();
        }, marker);

        const messageSelector = `#message-row-${message_list_id}-${CSS.escape(messageId)}`;
        await page.waitForSelector(messageSelector);

        const messageListBox = await page.$(messageListSelector);
        assert.ok(messageListBox !== null);
        await page.evaluate((msg) => $(msg).removeClass("selected_message"), messageSelector);

        // This is done so as to get white background while capturing screenshots.
        const background_selectors = [".app-main", ".message-feed", ".message_header"];
        await page.evaluate((selectors) => {
            for (const selector of selectors) {
                $(selector).css("background-color", "white");
            }
        }, background_selectors);

        // This is done so that the message control buttons are not visible.
        await page.hover(".compose_new_conversation_button");

        // Compute screenshot area, with some padding around the message group
        const box = await messageListBox.boundingBox();
        assert.ok(box !== null);
        const imageDir = path.dirname(imagePath);
        await fs.promises.mkdir(imageDir, {recursive: true});
        await page.screenshot({
            path: imagePath,
            clip: {x: box.x, y: box.y + 10, width: box.width - 70, height: box.height - 8},
        });
    } finally {
        await browser.close();
    }
}

await run();
```

--------------------------------------------------------------------------------

---[FILE: bootstrap-aws-installer]---
Location: zulip-main/tools/setup/bootstrap-aws-installer

```text
#!/bin/env bash

# Prepended to this automatically are the following:
#SERVER=
#HOSTNAME=
#FULL_ROLES=
#REPO_URL=
#BRANCH=

export RUNNING_IN_CLOUD_INIT=1
if ! curl -fLs -m 5 -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 10" >/dev/null; then
    echo "This should be run on AWS instances, not locally."
    exit 1
fi

set -e
set -x

# Set the hostname early
echo "$HOSTNAME" >/etc/hostname
hostname "$HOSTNAME"
sed -i "s/localhost$/localhost $HOSTNAME $SERVER/" /etc/hosts

# Make sure root doesn't have a password
passwd -d root

# Allow root logins
sed -i 's/disable_root: true/disable_root: false/' /etc/cloud/cloud.cfg

# Ensure all apt updates (here and in the installer) are non-interactive
export DEBIAN_FRONTEND=noninteractive

# Dependencies to install AWS CLI
(
    apt-get -qy update
    apt-get -qy --with-new-pkgs -o "Dpkg::Options::=--force-confdef" -o "Dpkg::Options::=--force-confold" upgrade
    apt-get -qy install jq unzip curl
    apt-get -qy autoclean
)

# The following line gets subbed in by a call to pack-local-script,
# which will make $AWS_INSTALLER the path to a local copy of install-aws-cli
AWS_INSTALLER="inline!puppet/kandra/files/install-aws-cli"

# We then call it, to install the AWS CLI
"$AWS_INSTALLER"

# Set up a bare-bones AWS configuration
mkdir -p /root/.aws
cat >/root/.aws/config <<EOF
[default]
region = us-east-1
output = text
# Credentials are from the IAM role attached to the EC2 instance
EOF

# The following line gets replaced by pack-local-script output, which
# smuggles the install-ssh-keys binary into this one.
# install-ssh-keys, in turn, pulls key data from AWS' secret manager.
INSTALL_SSH_KEYS="inline!puppet/kandra/files/install-ssh-keys"
"$INSTALL_SSH_KEYS" root prod/ssh/keys/internal-read-only-deploy-key

# Provide GitHub known_hosts setup; you can verify against fingerprints at
# https://docs.github.com/en/github/authenticating-to-github/githubs-ssh-key-fingerprints
# via `ssh-keygen -lf`
GITHUB_KEYS="inline!puppet/kandra/files/github.keys"
cat "$GITHUB_KEYS" >>/root/.ssh/known_hosts

cd /root
git clone "$REPO_URL" zulip -b "$BRANCH"
git -C zulip checkout "$BRANCH"

(
    export APT_OPTIONS="-o Dpkg::Options::=--force-confnew"
    /root/zulip/scripts/setup/install --puppet-classes "$FULL_ROLES" --postgresql-version=17
)

# Delete the ubuntu user
userdel ubuntu

reboot
```

--------------------------------------------------------------------------------

---[FILE: build_pygments_data]---
Location: zulip-main/tools/setup/build_pygments_data

```text
#!/usr/bin/env python3
import json
import os

from pygments.lexers import get_all_lexers

ZULIP_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../")
# The current priorities data set is based on StackOverflow's 2020 survey.
# We also prioritize text, quote, math, spoiler over others to enhance UX.
DATA_PATH = os.path.join(ZULIP_PATH, "tools", "setup", "lang.json")
OUT_PATH = os.path.join(ZULIP_PATH, "web", "generated", "pygments_data.json")

with open(DATA_PATH) as f:
    pygments_data = json.load(f)
    priorities = dict(
        **pygments_data["default"], **pygments_data["custom"], **pygments_data["aliases"]
    )

excluded_aliases = {"🔥"}
lexers = get_all_lexers()
langs = {
    alias: {
        "priority": priorities.get(alias, 0),
        "pretty_name": longname,
    }
    for longname, aliases, filename_patterns, mimetypes in lexers
    for alias in aliases
    if alias not in excluded_aliases
}

langs |= {
    name: {
        "priority": priority,
        "pretty_name": name,
    }
    for name, priority in priorities.items()
    if name not in langs
}

with open(OUT_PATH, "w") as f:
    json.dump({"langs": langs}, f)
```

--------------------------------------------------------------------------------

````
