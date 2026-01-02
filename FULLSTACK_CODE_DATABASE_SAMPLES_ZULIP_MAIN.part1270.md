---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1270
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1270 of 1290)

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

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/uptimerobot/view.py
Signals: Django

```python
from django.core.exceptions import ValidationError
from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _

from zerver.actions.message_send import send_rate_limited_pm_notification_to_bot_owner
from zerver.decorator import webhook_view
from zerver.lib.exceptions import JsonableError, UnsupportedWebhookEventTypeError
from zerver.lib.response import json_success
from zerver.lib.send_email import FromAddress
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

MISCONFIGURED_PAYLOAD_ERROR_MESSAGE = """
Hi there! Your bot {bot_name} just received a UptimeRobot payload that is missing
some data that Zulip requires. This usually indicates a configuration issue
in your UptimeRobot webhook settings. Please make sure that you set the required parameters
when configuring the UptimeRobot webhook. Contact {support_email} if you
need further help!
"""

UPTIMEROBOT_TOPIC_TEMPLATE = "{monitor_friendly_name}"
UPTIMEROBOT_MESSAGE_UP_TEMPLATE = """
{monitor_friendly_name} ({monitor_url}) is back UP ({alert_details}).
It was down for {alert_friendly_duration}.
""".strip()
UPTIMEROBOT_MESSAGE_DOWN_TEMPLATE = (
    "{monitor_friendly_name} ({monitor_url}) is DOWN ({alert_details})."
)
ALL_EVENT_TYPES = ["up", "down"]


@webhook_view("UptimeRobot", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_uptimerobot_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    event_type = payload["alert_type_friendly_name"].tame(check_string)
    if event_type == "Up":
        event = "up"
    elif event_type == "Down":
        event = "down"

    try:
        body = get_body_for_http_request(payload, event_type)
        topic_name = get_topic_for_http_request(payload)
    except ValidationError:
        message = MISCONFIGURED_PAYLOAD_ERROR_MESSAGE.format(
            bot_name=user_profile.full_name,
            support_email=FromAddress.SUPPORT,
        ).strip()
        send_rate_limited_pm_notification_to_bot_owner(user_profile, user_profile.realm, message)

        raise JsonableError(_("Invalid payload"))

    check_send_webhook_message(request, user_profile, topic_name, body, event)
    return json_success(request)


def get_topic_for_http_request(payload: WildValue) -> str:
    return UPTIMEROBOT_TOPIC_TEMPLATE.format(
        monitor_friendly_name=payload["monitor_friendly_name"].tame(check_string)
    )


def get_body_for_http_request(payload: WildValue, event_type: str) -> str:
    if event_type == "Up":
        monitor_friendly_name = payload["monitor_friendly_name"].tame(check_string)
        monitor_url = payload["monitor_url"].tame(check_string)
        alert_details = payload["alert_details"].tame(check_string)
        alert_friendly_duration = payload["alert_friendly_duration"].tame(check_string)
        body = UPTIMEROBOT_MESSAGE_UP_TEMPLATE.format(
            monitor_friendly_name=monitor_friendly_name,
            monitor_url=monitor_url,
            alert_details=alert_details,
            alert_friendly_duration=alert_friendly_duration,
        )
    elif event_type == "Down":
        monitor_friendly_name = payload["monitor_friendly_name"].tame(check_string)
        monitor_url = payload["monitor_url"].tame(check_string)
        alert_details = payload["alert_details"].tame(check_string)
        body = UPTIMEROBOT_MESSAGE_DOWN_TEMPLATE.format(
            monitor_friendly_name=monitor_friendly_name,
            monitor_url=monitor_url,
            alert_details=alert_details,
        )
    else:
        raise UnsupportedWebhookEventTypeError(event_type)

    return body
```

--------------------------------------------------------------------------------

---[FILE: uptimerobot_invalid_payload_with_missing_data.json]---
Location: zulip-main/zerver/webhooks/uptimerobot/fixtures/uptimerobot_invalid_payload_with_missing_data.json

```json
{
	"monitor_url": "server1.example.com",
	"alert_type": "1",
	"alert_type_friendly_name": "Down",
	"alert_details": "Host Is Unreachable",
	"alert_friendly_duration": "*alertFriendlyDuration*"
  }
```

--------------------------------------------------------------------------------

---[FILE: uptimerobot_monitor_down.json]---
Location: zulip-main/zerver/webhooks/uptimerobot/fixtures/uptimerobot_monitor_down.json

```json
{
	"monitor_url": "server1.example.com",
	"monitor_friendly_name": "Web Server",
	"alert_type": "1",
	"alert_type_friendly_name": "Down",
	"alert_details": "Host Is Unreachable",
	"alert_friendly_duration": "*alertFriendlyDuration*"
  }
```

--------------------------------------------------------------------------------

---[FILE: uptimerobot_monitor_up.json]---
Location: zulip-main/zerver/webhooks/uptimerobot/fixtures/uptimerobot_monitor_up.json

```json
{
    "monitor_url": "server2.example.com",
    "monitor_friendly_name": "Mail Server",
    "alert_type": "2",
    "alert_type_friendly_name": "Up",
    "alert_details": "Host Is Reachable",
    "alert_friendly_duration": "44 minutes and 37 seconds"
  }
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/wekan/doc.md

```text
# Zulip Wekan integration

Get Wekan notifications in Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to Wekan, click the **Settings** icon, and select **Outgoing Webhooks**.

1. Set **URL** to the URL generated above, and click **Add Webhook**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/wekan/001.png)

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/wekan/tests.py

```python
from typing_extensions import override

from zerver.lib.test_classes import WebhookTestCase


class WekanHookTests(WebhookTestCase):
    CHANNEL_NAME = "wekan"
    URL_TEMPLATE = "/api/v1/external/wekan?stream={stream}&api_key={api_key}"
    FIXTURE_DIR_NAME = "wekan"

    def test_add_attachment_message(self) -> None:
        expected_message = 'JohnFish added attachment "hGfm5ksud8k" to card "Markdown and emoji\'s" at list "Design" at swimlane "Default" at board "Bucket List".\n\n[See in Wekan](http://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/pMtu7kPZvMuhhC4hL)'
        self.check_webhook(
            "add_attachment",
            "Wekan Notification",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_add_checklist_item_message(self) -> None:
        expected_message = 'JohnFish added checklist item "merge commit 9dfe" to checklist "To do" at card "Markdown and emoji\'s" at list "Design" at swimlane "Default" at board "Bucket List".\n\n[See in Wekan](http://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/pMtu7kPZvMuhhC4hL)'
        self.check_webhook(
            "add_checklist_item",
            "Wekan Notification",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_add_checklist_message(self) -> None:
        expected_message = 'JohnFish added checklist "To do" to card "Markdown and emoji\'s" at list "Design" at swimlane "Default" at board "bucked-list".\n\n[See in Wekan](http://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/pMtu7kPZvMuhhC4hL)'
        self.check_webhook(
            "add_checklist",
            "Wekan Notification",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_add_label_message(self) -> None:
        expected_message = 'JohnFish Added label Language to card "Markdown & emojis" at list "Design" at swimlane "Default" at board "Bucket List".\n\n[See in Wekan](http://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/TMmjFnQGuZPsbjXzS)'
        self.check_webhook(
            "add_label",
            "Wekan Notification",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_archived_swimlane_message(self) -> None:
        expected_message = 'JohnFish Swimlane "Default" at board "Bucket List" moved to Archive.\n\n[See in Wekan](http://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list)'
        self.check_webhook(
            "archived_swimlane",
            "Wekan Notification",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_archived_card_message(self) -> None:
        expected_message = 'JohnFish Card "Markdown and emoji\'s" at list "Design" at swimlane "Default" at board "Bucket List" moved to Archive.\n\n[See in Wekan](http://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/pMtu7kPZvMuhhC4hL)'
        self.check_webhook(
            "archived_card",
            "Wekan Notification",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_archived_list_message(self) -> None:
        expected_message = 'JohnFish List "Design" at swimlane "Default" at board "Bucket List" moved to Archive.\n\n[See in Wekan](http://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list)'
        self.check_webhook(
            "archived_list",
            "Wekan Notification",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_checked_item_message(self) -> None:
        expected_message = 'JohnFish checked To do of checklist "To do" at card "Markdown and emoji\'s" at list "Design" at swimlane "Default" at board "bucket-list".\n\n[See in Wekan](http://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/pMtu7kPZvMuhhC4hL)'
        self.check_webhook(
            "checked_item",
            "Wekan Notification",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_add_comment_message(self) -> None:
        expected_message = 'JohnFish commented on card "Markdown and emoji\'s": "This feature is important" at list "Design" at swimlane "Default" at board "Bucket List".\n\n[See in Wekan](http://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/pMtu7kPZvMuhhC4hL)'
        self.check_webhook(
            "add_comment",
            "Wekan Notification",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_create_card_message(self) -> None:
        expected_message = 'JohnFish created card "Markdown and emoji\'s" to list "Development & Implementation" at swimlane "Default" at board "Bucket List".\n\n[See in Wekan](http://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/pMtu7kPZvMuhhC4hL)'
        self.check_webhook(
            "create_card",
            "Wekan Notification",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_create_custom_field_message(self) -> None:
        expected_message = 'JohnFish created custom field Language at board "Bucket List".\n\n[See in Wekan](http://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list)'
        self.check_webhook(
            "create_custom_field",
            "Wekan Notification",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_create_list_message(self) -> None:
        expected_message = 'JohnFish added list "Testing & Maintenance" to board "Bucket List".\n\n[See in Wekan](http://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list)'
        self.check_webhook(
            "create_list",
            "Wekan Notification",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_create_swimlane_message(self) -> None:
        expected_message = 'JohnFish created swimlane "Jasper" to board "Bucket List".\n\n[See in Wekan](http://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list)'
        self.check_webhook(
            "create_swimlane",
            "Wekan Notification",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_delete_attachment_message(self) -> None:
        expected_message = 'JohnFish deleted attachment "hGfm5ksud8k.jpg" at card "Markdown and emoji\'s" at list "Design" at swimlane "Default" at board "Bucket List".\n\n[See in Wekan](http://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/pMtu7kPZvMuhhC4hL)'
        self.check_webhook(
            "delete_attachment",
            "Wekan Notification",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_join_member_message(self) -> None:
        expected_message = 'JohnFish added member kokoboss to card "Markdown & emojis" at list "Design" at swimlane "Default" at board "Bucket List".\n\n[See in Wekan](http://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/TMmjFnQGuZPsbjXzS)'
        self.check_webhook(
            "join_member",
            "Wekan Notification",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_move_card_message(self) -> None:
        expected_message = 'JohnFish moved card "Markdown and emoji\'s" at board "Bucket List" from list "Development & Implementation" at swimlane "Default" to list "Design" at swimlane "Default".\n\n[See in Wekan](http://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/pMtu7kPZvMuhhC4hL)'
        self.check_webhook(
            "move_card",
            "Wekan Notification",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_remove_list_message(self) -> None:
        expected_message = "JohnFish act-removeList.\n\n[See in Wekan](http://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list)"
        self.check_webhook(
            "remove_list",
            "Wekan Notification",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_remove_swimlane_message(self) -> None:
        expected_message = "JohnFish act-removeSwimlane.\n\n[See in Wekan](http://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list)"
        self.check_webhook(
            "remove_swimlane",
            "Wekan Notification",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_removed_checklist_item_message(self) -> None:
        expected_message = "JohnFish act-removedChecklistItem.\n\n[See in Wekan](http://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/pMtu7kPZvMuhhC4hL)"
        self.check_webhook(
            "removed_checklist_item",
            "Wekan Notification",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_removed_checklist_message(self) -> None:
        expected_message = 'JohnFish removed checklist "To do" from card "Markdown and emoji\'s" at list "Design" at swimlane "Default" at board "Bucket List".\n\n[See in Wekan](http://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/pMtu7kPZvMuhhC4hL)'
        self.check_webhook(
            "removed_checklist",
            "Wekan Notification",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_restored_card_message(self) -> None:
        expected_message = 'JohnFish restored card "Markdown and emoji\'s" to list "Design" at swimlane "Default" at board "Bucket List".\n\n[See in Wekan](http://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/pMtu7kPZvMuhhC4hL)'
        self.check_webhook(
            "restored_card",
            "Wekan Notification",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_set_custom_field_message(self) -> None:
        expected_message = "JohnFish act-setCustomField.\n\n[See in Wekan](http://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/pMtu7kPZvMuhhC4hL)"
        self.check_webhook(
            "set_custom_field",
            "Wekan Notification",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_uncomplete_checklist_message(self) -> None:
        expected_message = 'JohnFish uncompleted checklist To do at card "Markdown and emoji\'s" at list "Design" at swimlane "Default" at board "Bucket List".\n\n[See in Wekan](http://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/pMtu7kPZvMuhhC4hL)'
        self.check_webhook(
            "uncomplete_checklist",
            "Wekan Notification",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    @override
    def get_body(self, fixture_name: str) -> str:
        return self.webhook_fixture_data("wekan", fixture_name, file_type="json")
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/wekan/view.py
Signals: Django

```python
from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

LINK_TEMPLATE = "[See in Wekan]({url})"
MESSAGE_TEMPLATE = "{body}\n\n{footer}"


def get_url(text: str) -> str:
    return text.split("\n")[-1]


def get_hyperlinked_url(text: str) -> str:
    url = get_url(text)
    return LINK_TEMPLATE.format(url=url)


def clean_payload_text(text: str) -> str:
    url = get_url(text)
    return text.replace(url, "").replace("\n", "")


def get_message_body(payload: WildValue) -> str:
    footer = get_hyperlinked_url(payload["text"].tame(check_string))
    body = process_message_data(payload)
    return MESSAGE_TEMPLATE.format(body=body, footer=footer)


def process_message_data(payload: WildValue) -> str:
    text = clean_payload_text(payload["text"].tame(check_string))
    return f"{text}."


@webhook_view("Wekan")
@typed_endpoint
def api_wekan_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    topic_name = "Wekan Notification"
    body = get_message_body(payload)
    check_send_webhook_message(request, user_profile, topic_name, body)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: add_attachment.json]---
Location: zulip-main/zerver/webhooks/wekan/fixtures/add_attachment.json

```json
{
  "text": "JohnFish added attachment \"hGfm5ksud8k\" to card \"Markdown and emoji's\" at list \"Design\" at swimlane \"Default\" at board \"Bucket List\"\nhttp://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/pMtu7kPZvMuhhC4hL",
  "cardId": "pMtu7kPZvMuhhC4hL",
  "boardId": "Jinj4Xj7qnHLRmrTY",
  "user": "JohnFish",
  "card": "Markdown and emoji's",
  "description": "act-addAttachment"
}
```

--------------------------------------------------------------------------------

---[FILE: add_checklist.json]---
Location: zulip-main/zerver/webhooks/wekan/fixtures/add_checklist.json

```json
{
  "text": "JohnFish added checklist \"To do\" to card \"Markdown and emoji's\" at list \"Design\" at swimlane \"Default\" at board \"bucked-list\"\nhttp://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/pMtu7kPZvMuhhC4hL",
  "cardId": "pMtu7kPZvMuhhC4hL",
  "boardId": "Jinj4Xj7qnHLRmrTY",
  "user": "JohnFish",
  "card": "Markdown and emoji's",
  "description": "act-addChecklist"
}
```

--------------------------------------------------------------------------------

---[FILE: add_checklist_item.json]---
Location: zulip-main/zerver/webhooks/wekan/fixtures/add_checklist_item.json

```json
{
  "text": "JohnFish added checklist item \"merge commit 9dfe\" to checklist \"To do\" at card \"Markdown and emoji's\" at list \"Design\" at swimlane \"Default\" at board \"Bucket List\"\nhttp://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/pMtu7kPZvMuhhC4hL",
  "cardId": "pMtu7kPZvMuhhC4hL",
  "boardId": "Jinj4Xj7qnHLRmrTY",
  "user": "JohnFish",
  "card": "Markdown and emoji's",
  "description": "act-addChecklistItem"
}
```

--------------------------------------------------------------------------------

---[FILE: add_comment.json]---
Location: zulip-main/zerver/webhooks/wekan/fixtures/add_comment.json

```json
{
  "text": "JohnFish commented on card \"Markdown and emoji's\": \"This feature is important\" at list \"Design\" at swimlane \"Default\" at board \"Bucket List\"\nhttp://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/pMtu7kPZvMuhhC4hL",
  "cardId": "pMtu7kPZvMuhhC4hL",
  "boardId": "Jinj4Xj7qnHLRmrTY",
  "comment": "This feature is important",
  "user": "JohnFish",
  "card": "Markdown and emoji's",
  "commentId": "tNko8hJZvMudkX4pt",
  "description": "act-addComment"
}
```

--------------------------------------------------------------------------------

---[FILE: add_label.json]---
Location: zulip-main/zerver/webhooks/wekan/fixtures/add_label.json

```json
{
  "text": "JohnFish Added label Language to card \"Markdown & emojis\" at list \"Design\" at swimlane \"Default\" at board \"Bucket List\"\nhttp://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/TMmjFnQGuZPsbjXzS",
  "cardId": "TMmjFnQGuZPsbjXzS",
  "listId": "m6ZKFcprEbX6hmFGy",
  "boardId": "Jinj4Xj7qnHLRmrTY",
  "user": "JohnFish",
  "card": "Markdown & emojis",
  "swimlaneId": "9KQqj2M37hztEr68d",
  "description": "act-addedLabel"
}
```

--------------------------------------------------------------------------------

---[FILE: archived_card.json]---
Location: zulip-main/zerver/webhooks/wekan/fixtures/archived_card.json

```json
{
  "text": "JohnFish Card \"Markdown and emoji's\" at list \"Design\" at swimlane \"Default\" at board \"Bucket List\" moved to Archive\nhttp://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/pMtu7kPZvMuhhC4hL",
  "cardId": "pMtu7kPZvMuhhC4hL",
  "listId": "m6ZKFcprEbX6hmFGy",
  "boardId": "Jinj4Xj7qnHLRmrTY",
  "user": "JohnFish",
  "card": "Markdown and emoji's",
  "swimlaneId": "QxJLobhCKvgwvy4vu",
  "description": "act-archivedCard"
}
```

--------------------------------------------------------------------------------

---[FILE: archived_list.json]---
Location: zulip-main/zerver/webhooks/wekan/fixtures/archived_list.json

```json
{
  "text": "JohnFish List \"Design\" at swimlane \"Default\" at board \"Bucket List\" moved to Archive\nhttp://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list",
  "listId": "BB7dtJSo4zB5QBzhY",
  "boardId": "Jinj4Xj7qnHLRmrTY",
  "user": "JohnFish",
  "description": "act-archivedList"
}
```

--------------------------------------------------------------------------------

---[FILE: archived_swimlane.json]---
Location: zulip-main/zerver/webhooks/wekan/fixtures/archived_swimlane.json

```json
{
  "text": "JohnFish Swimlane \"Default\" at board \"Bucket List\" moved to Archive\nhttp://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list",
  "boardId": "Jinj4Xj7qnHLRmrTY",
  "user": "JohnFish",
  "swimlaneId": "QxJLobhCKvgwvy4vu",
  "description": "act-archivedSwimlane"
}
```

--------------------------------------------------------------------------------

---[FILE: checked_item.json]---
Location: zulip-main/zerver/webhooks/wekan/fixtures/checked_item.json

```json
{
  "text": "JohnFish checked To do of checklist \"To do\" at card \"Markdown and emoji's\" at list \"Design\" at swimlane \"Default\" at board \"bucket-list\"\nhttp://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/pMtu7kPZvMuhhC4hL",
  "cardId": "pMtu7kPZvMuhhC4hL",
  "boardId": "Jinj4Xj7qnHLRmrTY",
  "user": "JohnFish",
  "card": "Markdown and emoji's",
  "description": "act-checkedItem"
}
```

--------------------------------------------------------------------------------

---[FILE: create_card.json]---
Location: zulip-main/zerver/webhooks/wekan/fixtures/create_card.json

```json
{
  "text": "JohnFish created card \"Markdown and emoji's\" to list \"Development & Implementation\" at swimlane \"Default\" at board \"Bucket List\"\nhttp://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/pMtu7kPZvMuhhC4hL",
  "cardId": "pMtu7kPZvMuhhC4hL",
  "listId": "BB7dtJSo4zB5QBzhY",
  "boardId": "Jinj4Xj7qnHLRmrTY",
  "user": "JohnFish",
  "card": "Markdown and emoji's",
  "swimlaneId": "QxJLobhCKvgwvy4vu",
  "description": "act-createCard"
}
```

--------------------------------------------------------------------------------

---[FILE: create_custom_field.json]---
Location: zulip-main/zerver/webhooks/wekan/fixtures/create_custom_field.json

```json
{
  "text": "JohnFish created custom field Language at board \"Bucket List\"\nhttp://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list",
  "boardId": "Jinj4Xj7qnHLRmrTY",
  "user": "JohnFish",
  "description": "act-createCustomField"
}
```

--------------------------------------------------------------------------------

---[FILE: create_list.json]---
Location: zulip-main/zerver/webhooks/wekan/fixtures/create_list.json

```json
{
  "text": "JohnFish added list \"Testing & Maintenance\" to board \"Bucket List\"\nhttp://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list",
  "listId": "ygpBp4a94TcwTSXP9",
  "boardId": "Jinj4Xj7qnHLRmrTY",
  "user": "JohnFish",
  "description": "act-createList"
}
```

--------------------------------------------------------------------------------

---[FILE: create_swimlane.json]---
Location: zulip-main/zerver/webhooks/wekan/fixtures/create_swimlane.json

```json
{
  "text": "JohnFish created swimlane \"Jasper\" to board \"Bucket List\"\nhttp://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list",
  "boardId": "Jinj4Xj7qnHLRmrTY",
  "user": "JohnFish",
  "swimlaneId": "ZDyaRSF83EWkkeK5Y",
  "description": "act-createSwimlane"
}
```

--------------------------------------------------------------------------------

---[FILE: delete_attachment.json]---
Location: zulip-main/zerver/webhooks/wekan/fixtures/delete_attachment.json

```json
{
  "text": "JohnFish deleted attachment \"hGfm5ksud8k.jpg\" at card \"Markdown and emoji's\" at list \"Design\" at swimlane \"Default\" at board \"Bucket List\"\nhttp://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/pMtu7kPZvMuhhC4hL",
  "cardId": "pMtu7kPZvMuhhC4hL",
  "boardId": "Jinj4Xj7qnHLRmrTY",
  "user": "JohnFish",
  "card": "Markdown and emoji's",
  "description": "act-deleteAttachment"
}
```

--------------------------------------------------------------------------------

---[FILE: join_member.json]---
Location: zulip-main/zerver/webhooks/wekan/fixtures/join_member.json

```json
{
  "text": "JohnFish added member kokoboss to card \"Markdown & emojis\" at list \"Design\" at swimlane \"Default\" at board \"Bucket List\"\nhttp://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/TMmjFnQGuZPsbjXzS",
  "cardId": "TMmjFnQGuZPsbjXzS",
  "listId": "m6ZKFcprEbX6hmFGy",
  "boardId": "Jinj4Xj7qnHLRmrTY",
  "user": "JohnFish",
  "card": "Markdown & emojis",
  "swimlaneId": "9KQqj2M37hztEr68d",
  "description": "act-joinMember"
}
```

--------------------------------------------------------------------------------

---[FILE: move_card.json]---
Location: zulip-main/zerver/webhooks/wekan/fixtures/move_card.json

```json
{
  "text": "JohnFish moved card \"Markdown and emoji's\" at board \"Bucket List\" from list \"Development & Implementation\" at swimlane \"Default\" to list \"Design\" at swimlane \"Default\"\nhttp://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/pMtu7kPZvMuhhC4hL",
  "cardId": "pMtu7kPZvMuhhC4hL",
  "listId": "m6ZKFcprEbX6hmFGy",
  "oldListId": "BB7dtJSo4zB5QBzhY",
  "boardId": "Jinj4Xj7qnHLRmrTY",
  "user": "JohnFish",
  "card": "Markdown and emoji's",
  "swimlaneId": "QxJLobhCKvgwvy4vu",
  "description": "act-moveCard"
}
```

--------------------------------------------------------------------------------

---[FILE: removed_checklist.json]---
Location: zulip-main/zerver/webhooks/wekan/fixtures/removed_checklist.json

```json
{
  "text": "JohnFish removed checklist \"To do\" from card \"Markdown and emoji's\" at list \"Design\" at swimlane \"Default\" at board \"Bucket List\"\nhttp://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/pMtu7kPZvMuhhC4hL",
  "cardId": "pMtu7kPZvMuhhC4hL",
  "boardId": "Jinj4Xj7qnHLRmrTY",
  "user": "JohnFish",
  "card": "Markdown and emoji's",
  "description": "act-removeChecklist"
}
```

--------------------------------------------------------------------------------

---[FILE: removed_checklist_item.json]---
Location: zulip-main/zerver/webhooks/wekan/fixtures/removed_checklist_item.json

```json
{
  "text": "JohnFish act-removedChecklistItem\nhttp://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/pMtu7kPZvMuhhC4hL",
  "cardId": "pMtu7kPZvMuhhC4hL",
  "boardId": "Jinj4Xj7qnHLRmrTY",
  "user": "JohnFish",
  "card": "Markdown and emoji's",
  "description": "act-removedChecklistItem"
}
```

--------------------------------------------------------------------------------

---[FILE: remove_list.json]---
Location: zulip-main/zerver/webhooks/wekan/fixtures/remove_list.json

```json
{
  "text": "JohnFish act-removeList\nhttp://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list",
  "listId": "ksHcqWxZjN6RLEnxd",
  "boardId": "Jinj4Xj7qnHLRmrTY",
  "user": "JohnFish",
  "description": "act-removeList"
}
```

--------------------------------------------------------------------------------

---[FILE: remove_swimlane.json]---
Location: zulip-main/zerver/webhooks/wekan/fixtures/remove_swimlane.json

```json
{
  "text": "JohnFish act-removeSwimlane\nhttp://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list",
  "boardId": "Jinj4Xj7qnHLRmrTY",
  "user": "JohnFish",
  "swimlaneId": "QxJLobhCKvgwvy4vu",
  "description": "act-removeSwimlane"
}
```

--------------------------------------------------------------------------------

---[FILE: restored_card.json]---
Location: zulip-main/zerver/webhooks/wekan/fixtures/restored_card.json

```json
{
  "text": "JohnFish restored card \"Markdown and emoji's\" to list \"Design\" at swimlane \"Default\" at board \"Bucket List\"\nhttp://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/pMtu7kPZvMuhhC4hL",
  "cardId": "pMtu7kPZvMuhhC4hL",
  "listId": "m6ZKFcprEbX6hmFGy",
  "boardId": "Jinj4Xj7qnHLRmrTY",
  "user": "JohnFish",
  "card": "Markdown and emoji's",
  "swimlaneId": "QxJLobhCKvgwvy4vu",
  "description": "act-restoredCard"
}
```

--------------------------------------------------------------------------------

---[FILE: set_custom_field.json]---
Location: zulip-main/zerver/webhooks/wekan/fixtures/set_custom_field.json

```json
{
  "text": "JohnFish act-setCustomField\nhttp://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/pMtu7kPZvMuhhC4hL",
  "cardId": "pMtu7kPZvMuhhC4hL",
  "boardId": "Jinj4Xj7qnHLRmrTY",
  "user": "JohnFish",
  "card": "Markdown and emoji's",
  "description": "act-setCustomField"
}
```

--------------------------------------------------------------------------------

---[FILE: uncomplete_checklist.json]---
Location: zulip-main/zerver/webhooks/wekan/fixtures/uncomplete_checklist.json

```json
{
  "text": "JohnFish uncompleted checklist To do at card \"Markdown and emoji's\" at list \"Design\" at swimlane \"Default\" at board \"Bucket List\"\nhttp://127.0.0.1/b/Jinj4Xj7qnHLRmrTY/bucket-list/pMtu7kPZvMuhhC4hL",
  "cardId": "pMtu7kPZvMuhhC4hL",
  "boardId": "Jinj4Xj7qnHLRmrTY",
  "user": "JohnFish",
  "card": "Markdown and emoji's",
  "description": "act-uncompleteChecklist"
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/wordpress/doc.md

```text
# Zulip WordPress integration

Get WordPress notifications in Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Add `/wp-admin/options-general.php?page=webhooks` to the end of your
   WordPress URL, and navigate to the site. Click **Add webhook**.

1. Select an **Action** from the [supported
   events](#filtering-incoming-events) that you'd like to be notified
   about, along with these corresponding **Fields**: `post_title`,
   `post_type`, and `post_url`.

1. Set **URL** to the URL generated above, and click **Add new webhook**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/wordpress/wordpress_post_created.png)

{!event-filtering-additional-feature.md!}

### Related documentation

- [WordPress webhooks documentation][1]

{!webhooks-url-specification.md!}

[1]: https://wordpress.com/support/webhooks/
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/wordpress/tests.py

```python
from typing_extensions import override

from zerver.lib.test_classes import WebhookTestCase


class WordPressHookTests(WebhookTestCase):
    CHANNEL_NAME = "wordpress"
    URL_TEMPLATE = "/api/v1/external/wordpress?api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "wordpress"

    def test_publish_post(self) -> None:
        expected_topic_name = "WordPress Post"
        expected_message = "New post published:\n* [New Blog Post](http://example.com\n)"

        self.check_webhook(
            "publish_post",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_publish_post_type_not_provided(self) -> None:
        expected_topic_name = "WordPress Post"
        expected_message = "New post published:\n* [New Blog Post](http://example.com\n)"

        self.check_webhook(
            "publish_post_type_not_provided",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_publish_post_no_data_provided(self) -> None:
        # If the user forgot to configure the fields for the action in WordPress.
        expected_topic_name = "WordPress notification"
        expected_message = "New post published:\n* [New WordPress post](WordPress post URL)"

        self.check_webhook(
            "publish_post_no_data_provided",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_publish_page(self) -> None:
        expected_topic_name = "WordPress Page"
        expected_message = "New page published:\n* [New Blog Page](http://example.com\n)"

        self.check_webhook(
            "publish_page",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_unknown_action_no_data(self) -> None:
        # Mimic check_webhook() to manually execute a negative test.
        # Otherwise its call to send_webhook_payload() would assert on the non-success
        # we are testing. The value of result is the error message the webhook should
        # return if no params are sent. The fixture for this test is an empty file.

        # subscribe to the target channel
        self.subscribe(self.test_user, self.CHANNEL_NAME)

        # post to the webhook url
        result = self.client_post(
            self.url,
            self.get_body("unknown_action_no_data"),
            content_type="application/x-www-form-urlencoded",
        )

        # check that we got the expected error message
        self.assert_json_error(result, "Unknown WordPress webhook action: WordPress action")

    def test_unknown_action_no_hook_provided(self) -> None:
        # Similar to unknown_action_no_data, except the fixture contains valid blog post
        # params but without the hook parameter. This should also return an error.

        self.subscribe(self.test_user, self.CHANNEL_NAME)
        result = self.client_post(
            self.url,
            self.get_body("unknown_action_no_hook_provided"),
            content_type="application/x-www-form-urlencoded",
        )

        self.assert_json_error(result, "Unknown WordPress webhook action: WordPress action")

    @override
    def get_body(self, fixture_name: str) -> str:
        return self.webhook_fixture_data("wordpress", fixture_name, file_type="txt")
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/wordpress/view.py
Signals: Django

```python
# Webhooks for external integrations.
from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _

from zerver.decorator import webhook_view
from zerver.lib.exceptions import JsonableError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import typed_endpoint
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

PUBLISH_POST_OR_PAGE_TEMPLATE = """
New {type} published:
* [{title}]({url})
""".strip()
ALL_EVENT_TYPES = [
    "publish_post",
    "publish_page",
]


@webhook_view("WordPress", notify_bot_owner_on_invalid_json=False, all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_wordpress_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    hook: str = "WordPress action",
    post_title: str = "New WordPress post",
    post_type: str = "post",
    post_url: str = "WordPress post URL",
) -> HttpResponse:
    # remove trailing whitespace (issue for some test fixtures)
    hook = hook.rstrip()

    if hook in ("publish_post", "publish_page"):
        data = PUBLISH_POST_OR_PAGE_TEMPLATE.format(type=post_type, title=post_title, url=post_url)
    else:
        raise JsonableError(_("Unknown WordPress webhook action: {hook}").format(hook=hook))

    topic_name = "WordPress notification"

    check_send_webhook_message(request, user_profile, topic_name, data, hook)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: publish_page.txt]---
Location: zulip-main/zerver/webhooks/wordpress/fixtures/publish_page.txt

```text
stream=wordpress&topic=WordPress%20Page&hook=publish_page&post_type=page&post_title=New%20Blog%20Page&post_url=http%3A%2F%2Fexample.com
```

--------------------------------------------------------------------------------

---[FILE: publish_post.txt]---
Location: zulip-main/zerver/webhooks/wordpress/fixtures/publish_post.txt

```text
stream=wordpress&topic=WordPress%20Post&hook=publish_post&post_type=post&post_title=New%20Blog%20Post&post_url=http%3A%2F%2Fexample.com
```

--------------------------------------------------------------------------------

---[FILE: publish_post_no_data_provided.txt]---
Location: zulip-main/zerver/webhooks/wordpress/fixtures/publish_post_no_data_provided.txt

```text
hook=publish_post
```

--------------------------------------------------------------------------------

---[FILE: publish_post_type_not_provided.txt]---
Location: zulip-main/zerver/webhooks/wordpress/fixtures/publish_post_type_not_provided.txt

```text
stream=wordpress&topic=WordPress%20Post&hook=publish_post&post_title=New%20Blog%20Post&post_url=http%3A%2F%2Fexample.com
```

--------------------------------------------------------------------------------

---[FILE: unknown_action_no_hook_provided.txt]---
Location: zulip-main/zerver/webhooks/wordpress/fixtures/unknown_action_no_hook_provided.txt

```text
stream=wordpress&topic=WordPress%20Post&post_type=post&post_title=New%20Blog%20Post&post_url=http%3A%2F%2Fexample.com
```

--------------------------------------------------------------------------------

````
