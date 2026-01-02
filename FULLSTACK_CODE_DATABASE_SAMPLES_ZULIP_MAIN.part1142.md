---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1142
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1142 of 1290)

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

---[FILE: reminder.json]---
Location: zulip-main/zerver/webhooks/flock/fixtures/reminder.json

```json
{
    "attachments": [
        {
            "id": "3d5774d9-ec8e-4664-9286-c54d0034e401",
            "appId": "905f9943396442448b5d259d72c6d5fe",
            "title": "FlockBot undefined in mychannel:  Hey ",
            "color": "#efb80b",
            "forward": false,
            "buttons": [
                {
                    "name": "Snooze for me",
                    "icon": "https://apps-static.flock.co/reminder/snooze.svg",
                    "action": {
                        "mobileType": "modal",
                        "type": "openWidget",
                        "desktopType": "modal",
                        "url": "https://apps-static.flock.co/reminder3/production/html/snooze.html",
                        "width": 570,
                        "height": 270,
                        "sendContext": false
                    },
                    "id": "22841"
                }
            ]
        }
    ],
    "id": "wzXJN",
    "to": "g:183ff1e90d79465793273a31d7d1e537",
    "from": "u:Bu4v779hlh4uuug5",
    "text": "Rishabh rawat wanted me to remind All",
    "sendAs": {
        "name": "Reminder Bot",
        "profileImage": "https://apps-static.flock.co/reminder/reminder-bot.png"
    },
    "appId": "905f9943396442448b5d259d72c6d5fe",
    "timestamp": "2018-03-01T08:00:03.587Z",
    "timestampInMillis": 1519891203587,
    "uid": "1519891203587-Nhj-m201",
    "onBehalfOf": "u:9qehqo3ixo3t93e3"
}
```

--------------------------------------------------------------------------------

---[FILE: reply.json]---
Location: zulip-main/zerver/webhooks/flock/fixtures/reply.json

```json
{
    "attachments": [
        {
            "appId": "7d7d0856-f0a1-45bc-a66e-8c9ed504e620",
            "title": "in reply to Rishabh R",
            "description": "This is the welcome message!",
            "color": "#0BBE51",
            "forward": false
        }
    ],
    "id": "BPsjQ",
    "to": "g:183ff1e90d79465793273a31d7d1e537",
    "from": "u:9qehqo3ixo3t93e3",
    "text": "It's interesting how high productivity will go...",
    "appId": "7d7d0856-f0a1-45bc-a66e-8c9ed504e620",
    "timestamp": "2018-03-01T07:44:45.493Z",
    "timestampInMillis": 1519890285493,
    "uid": "1519890285493-eed-m203",
    "onBehalfOf": ""
}
```

--------------------------------------------------------------------------------

---[FILE: reply_note.json]---
Location: zulip-main/zerver/webhooks/flock/fixtures/reply_note.json

```json
{
    "attachments": [
        {
            "appId": "7d7d0856-f0a1-45bc-a66e-8c9ed504e620",
            "title": "in reply to Rishabh R",
            "description": "NoteTitle",
            "color": "#0BBE51",
            "forward": false
        }
    ],
    "id": "WPDlW",
    "to": "g:183ff1e90d79465793273a31d7d1e537",
    "from": "u:9qehqo3ixo3t93e3",
    "text": "This is reply to Note.",
    "appId": "7d7d0856-f0a1-45bc-a66e-8c9ed504e620",
    "timestamp": "2018-03-01T08:16:57.793Z",
    "timestampInMillis": 1519892217793,
    "uid": "1519892217793-lt2-m203",
    "onBehalfOf": ""
}
```

--------------------------------------------------------------------------------

---[FILE: reply_pinned.json]---
Location: zulip-main/zerver/webhooks/flock/fixtures/reply_pinned.json

```json
{
    "attachments": [
        {
            "appId": "7d7d0856-f0a1-45bc-a66e-8c9ed504e620",
            "title": "in reply to Rishabh R",
            "description": "Rishabh rawat pinned an item to this conversation. You can access it via the Files",
            "color": "#0BBE51",
            "forward": false
        }
    ],
    "id": "QPJia",
    "to": "g:183ff1e90d79465793273a31d7d1e537",
    "from": "u:9qehqo3ixo3t93e3",
    "text": "This is reply to pinned message.",
    "appId": "7d7d0856-f0a1-45bc-a66e-8c9ed504e620",
    "timestamp": "2018-03-01T08:11:46.549Z",
    "timestampInMillis": 1519891906549,
    "uid": "1519891906549-rzZ-m203",
    "onBehalfOf": ""
}
```

--------------------------------------------------------------------------------

---[FILE: reply_reminder.json]---
Location: zulip-main/zerver/webhooks/flock/fixtures/reply_reminder.json

```json
{
    "attachments": [
        {
            "appId": "7d7d0856-f0a1-45bc-a66e-8c9ed504e620",
            "title": "in reply to Reminders B",
            "description": "Rishabh rawat wanted me to remind All",
            "color": "#0BBE51",
            "forward": false
        }
    ],
    "id": "Oprnr",
    "to": "g:183ff1e90d79465793273a31d7d1e537",
    "from": "u:9qehqo3ixo3t93e3",
    "text": "This is a reply to Reminder.",
    "appId": "7d7d0856-f0a1-45bc-a66e-8c9ed504e620",
    "timestamp": "2018-03-01T08:14:17.985Z",
    "timestampInMillis": 1519892057985,
    "uid": "1519892057985-B1f-m203",
    "onBehalfOf": ""
}
```

--------------------------------------------------------------------------------

---[FILE: reply_todo.json]---
Location: zulip-main/zerver/webhooks/flock/fixtures/reply_todo.json

```json
{
    "attachments": [
        {
            "appId": "7d7d0856-f0a1-45bc-a66e-8c9ed504e620",
            "title": "in reply to To-do bot",
            "description": "Study for end term exams.",
            "color": "#0BBE51",
            "forward": false
        }
    ],
    "id": "WoBGB",
    "to": "g:183ff1e90d79465793273a31d7d1e537",
    "from": "u:9qehqo3ixo3t93e3",
    "text": "This is a reply to Todo notification.",
    "appId": "7d7d0856-f0a1-45bc-a66e-8c9ed504e620",
    "timestamp": "2018-03-01T08:13:24.950Z",
    "timestampInMillis": 1519892004950,
    "uid": "1519892004950-1re-m203",
    "onBehalfOf": ""
}
```

--------------------------------------------------------------------------------

---[FILE: todo.json]---
Location: zulip-main/zerver/webhooks/flock/fixtures/todo.json

```json
{
    "attachments": [
        {
            "id": "todo_attachment",
            "appId": "6d0aa37b00944ec0a7426d34ca2df048",
            "color": "#2A83Fc",
            "views": {
                "flockml": "<flockml>Study for end term exams.</flockml>"
            },
            "buttons": [
                {
                    "name": "View",
                    "action": {
                        "mobileType": "modal",
                        "type": "openWidget",
                        "desktopType": "sidebar",
                        "url": "https://apps-static.flock.co/todo/index.html?type=chat&chat&chatName=mychannel&listId=li%3Ac5f13a8a-e90a-4396-b810-1cfe85ef7c31&todoId=to%3Ab4273700-ac8c-44d0-91a3-d13d3d11e500",
                        "sendContext": false
                    },
                    "id": "view"
                },
                {
                    "name": "Mark as done",
                    "icon": "https://apps-static.flock.com/todo/markasdone.svg",
                    "action": {
                        "type": "sendEvent",
                        "sendContext": false
                    },
                    "id": "complete;g:183ff1e90d79465793273a31d7d1e537;li:c5f13a8a-e90a-4396-b810-1cfe85ef7c31;to:b4273700-ac8c-44d0-91a3-d13d3d11e500"
                }
            ]
        }
    ],
    "id": "LrAbZ",
    "to": "g:183ff1e90d79465793273a31d7d1e537",
    "from": "u:Bgcq3pt33pqpllbt",
    "notification": "Rishabh rawat added a to-do in New List 1 list",
    "flockml": "<flockml>Rishabh rawat added a to-do in New List 1 list</flockml>",
    "text": "",
    "sendAs": {
        "name": "To-do bot",
        "profileImage": "https://apps-static.flock.com/todo/todoboticon.png"
    },
    "appId": "6d0aa37b00944ec0a7426d34ca2df048",
    "timestamp": "2018-03-01T07:56:41.413Z",
    "timestampInMillis": 1519891001413,
    "uid": "1519891001413-vNe-m201",
    "onBehalfOf": "u:9qehqo3ixo3t93e3"
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/freshdesk/doc.md

```text
# Zulip Freshdesk integration

See customer support interactions in Zulip with our Freshdesk
integration!

### Create Zulip bot for Freshdesk notifications

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

{end_tabs}


### Add notifications for new Freshdesk tickets

{start_tabs}

1. Go to your Freshdesk **Admin** page.

1. Under **Helpdesk Productivity**, select **Dispatch'r**, and then
   select **New rule**.

1. Set **Rule Name** to a name of your choice, such as `Zulip`.

1. There isn't a shortcut to "always generate a notification on ticket
   creation", so we'll have to fake it by picking two complementary
   conditions: when the source **is email**, and when the source **is
   not email**. Set up the **Conditions** for the new rule, like so:

     ![](/static/images/integrations/freshdesk/001.png)

1. Under **Actions**, set the **Select Action** dropdown to **Trigger
   Webhook**.

1. Set **Request Type** to **POST**, and set **Callback URL** to the URL
   [generated above][create-bot].

1. Toggle the **Requires Authentication** checkbox.

1. Set **Username** to the email of the bot [created above][create-bot],
   and set **Password** to the bot's API key.

1. Set **Encoding** to **JSON**, and select the **Advanced** option.
   Copy and paste the following JSON into the **Content** box:

    ```
    {% raw %}
    {"freshdesk_webhook":
        {
            "triggered_event":"{{triggered_event}}",
            "ticket_id":"{{ticket.id}}",
            "ticket_url":"{{ticket.url}}",
            "ticket_type":"{{ticket.ticket_type}}",
            "ticket_subject":"{{ticket.subject}}",
            "ticket_description":"{{ticket.description}}",
            "ticket_status":"{{ticket.status}}",
            "ticket_priority":"{{ticket.priority}}",
            "requester_name":"{{ticket.requester.name}}",
            "requester_email":"{{ticket.requester.email}}"
        }
    }
    {% endraw %}
    ```

1. Click **Save**.

{end_tabs}

### Get notifications for changes to existing Freshdesk tickets

{start_tabs}

1. Go to your Freshdesk **Admin** page.

1. Under **Helpdesk Productivity**, select **Observer**, and then select
   **New rule**.

1. Set **Rule Name** to a name of your choice, such as `Zulip`.

1. Under **involves any of these events**, create new events as shown below:

    ![](/static/images/integrations/freshdesk/002.png)

1. Unfortunately, there isn't a shortcut for specifying "all tickets",
   so we'll have to fake it by picking two complementary conditions:
   when the source **is email**, and when the source **is not email**.
   Under **on tickets with these properties**, create new conditions,
   like so:

    ![](/static/images/integrations/freshdesk/003.png)

1. Under **perform these actions**, set the **Select Action** dropdown
   to **Trigger Webhook**.

1. Set **Request Type** to **POST**, and set **Callback URL** to the URL
   [generated above][create-bot].

1. Toggle the **Requires Authentication** checkbox.

1. Set **Username** to the email of the bot [created above][create-bot],
   and set **Password** to the bot's API key.

1. Set **Encoding** to **JSON** and select the **Advanced** option.
   Copy and paste the following JSON into the **Content** box:

    ```
    {% raw %}
    {"freshdesk_webhook":
        {
            "triggered_event":"{{triggered_event}}",
            "ticket_id":"{{ticket.id}}",
            "ticket_url":"{{ticket.url}}",
            "ticket_type":"{{ticket.ticket_type}}",
            "ticket_subject":"{{ticket.subject}}",
            "ticket_description":"{{ticket.description}}",
            "ticket_status":"{{ticket.status}}",
            "ticket_priority":"{{ticket.priority}}",
            "requester_name":"{{ticket.requester.name}}",
            "requester_email":"{{ticket.requester.email}}"
        }
    }
    {% endraw %}
    ```

1. Select **Save**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/freshdesk/004.png)

### Related documentation

{!webhooks-url-specification.md!}

[create-bot]: #create-zulip-bot-for-freshdesk-notifications
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/freshdesk/tests.py

```python
from unittest.mock import MagicMock, patch

from zerver.lib.test_classes import WebhookTestCase


class FreshdeskHookTests(WebhookTestCase):
    CHANNEL_NAME = "freshdesk"
    URL_TEMPLATE = "/api/v1/external/freshdesk?stream={stream}"
    WEBHOOK_DIR_NAME = "freshdesk"

    def test_ticket_creation(self) -> None:
        """
        Messages are generated on ticket creation through Freshdesk's
        "Dispatch'r" service.
        """
        expected_topic_name = "#11: Test ticket subject ☃"
        expected_message = """
Requester ☃ Bob <requester-bob@example.com> created [ticket #11](http://test1234zzz.freshdesk.com/helpdesk/tickets/11):

``` quote
Test ticket description ☃.
```

* **Type**: Incident
* **Priority**: High
* **Status**: Pending
""".strip()

        self.api_channel_message(
            self.test_user,
            "ticket_created",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_status_change(self) -> None:
        """
        Messages are generated when a ticket's status changes through
        Freshdesk's "Observer" service.
        """
        expected_topic_name = "#11: Test ticket subject ☃"
        expected_message = """
Requester Bob <requester-bob@example.com> updated [ticket #11](http://test1234zzz.freshdesk.com/helpdesk/tickets/11):

* **Status**: Resolved -> Waiting on Customer
""".strip()

        self.api_channel_message(
            self.test_user,
            "status_changed",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_priority_change(self) -> None:
        """
        Messages are generated when a ticket's priority changes through
        Freshdesk's "Observer" service.
        """
        expected_topic_name = "#11: Test ticket subject"
        expected_message = """
Requester Bob <requester-bob@example.com> updated [ticket #11](http://test1234zzz.freshdesk.com/helpdesk/tickets/11):

* **Priority**: High -> Low
""".strip()
        self.api_channel_message(
            self.test_user,
            "priority_changed",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    @patch("zerver.lib.webhooks.common.check_send_webhook_message")
    def test_unknown_event_payload_ignore(self, check_send_webhook_message_mock: MagicMock) -> None:
        """
        Ignore unknown event payloads.
        """
        self.url = self.build_webhook_url()
        payload = self.get_body("unknown_payload")
        result = self.client_post(
            self.url,
            payload,
            HTTP_AUTHORIZATION=self.encode_email(self.test_user.email),
            content_type="application/x-www-form-urlencoded",
        )
        self.assertFalse(check_send_webhook_message_mock.called)
        self.assert_json_success(result)

    def note_change(self, fixture: str, note_type: str) -> None:
        """
        Messages are generated when a note gets added to a ticket through
        Freshdesk's "Observer" service.
        """
        expected_topic_name = "#11: Test ticket subject"
        expected_message = """
Requester Bob <requester-bob@example.com> added a {} note to \
[ticket #11](http://test1234zzz.freshdesk.com/helpdesk/tickets/11).
""".strip().format(note_type)
        self.api_channel_message(
            self.test_user,
            fixture,
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_private_note_change(self) -> None:
        self.note_change("private_note", "private")

    def test_public_note_change(self) -> None:
        self.note_change("public_note", "public")

    def test_inline_image(self) -> None:
        """
        Freshdesk sends us descriptions as HTML, so we have to make the
        descriptions Zulip Markdown-friendly while still doing our best to
        preserve links and images.
        """
        expected_topic_name = "#12: Not enough ☃ guinea pigs"
        expected_message = """
Requester \u2603 Bob <requester-bob@example.com> created [ticket #12](http://test1234zzz.freshdesk.com/helpdesk/tickets/12):\n\n``` quote\nThere are too many cat pictures on the internet \u2603. We need more guinea pigs.\nExhibit 1:\n\n  \n\n[guinea_pig.png](http://cdn.freshdesk.com/data/helpdesk/attachments/production/12744808/original/guinea_pig.png)\n```\n\n* **Type**: Problem\n* **Priority**: Urgent\n* **Status**: Open
""".strip()
        self.api_channel_message(
            self.test_user,
            "inline_images",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/freshdesk/view.py
Signals: Django

```python
"""Webhooks for external integrations."""

from django.http import HttpRequest, HttpResponse

from zerver.decorator import authenticated_rest_api_view
from zerver.lib.email_notifications import convert_html_to_markdown
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

NOTE_TEMPLATE = "{name} <{email}> added a {note_type} note to [ticket #{ticket_id}]({ticket_url})."
PROPERTY_CHANGE_TEMPLATE = """
{name} <{email}> updated [ticket #{ticket_id}]({ticket_url}):

* **{property_name}**: {old} -> {new}
""".strip()
TICKET_CREATION_TEMPLATE = """
{name} <{email}> created [ticket #{ticket_id}]({ticket_url}):

``` quote
{description}
```

* **Type**: {type}
* **Priority**: {priority}
* **Status**: {status}
""".strip()


def property_name(property: str, index: int) -> str:
    """The Freshdesk API is currently pretty broken: statuses are customizable
    but the API will only tell you the number associated with the status, not
    the name. While we engage the Freshdesk developers about exposing this
    information through the API, since only FlightCar uses this integration,
    hardcode their statuses.
    """
    statuses = [
        "",
        "",
        "Open",
        "Pending",
        "Resolved",
        "Closed",
        "Waiting on Customer",
        "Job Application",
        "Monthly",
    ]
    priorities = ["", "Low", "Medium", "High", "Urgent"]

    name = ""
    if property == "status":
        name = statuses[index] if index < len(statuses) else str(index)
    elif property == "priority":
        name = priorities[index] if index < len(priorities) else str(index)

    return name


def parse_freshdesk_event(event_string: str) -> list[str]:
    """These are always of the form "{ticket_action:created}" or
    "{status:{from:4,to:6}}". Note the lack of string quoting: this isn't
    valid JSON so we have to parse it ourselves.
    """
    data = event_string.replace("{", "").replace("}", "").replace(",", ":").split(":")

    if len(data) == 2:
        # This is a simple ticket action event, like
        # {ticket_action:created}.
        return data
    else:
        # This is a property change event, like {status:{from:4,to:6}}. Pull out
        # the property, from, and to states.
        property, _, from_state, _, to_state = data
        return [
            property,
            property_name(property, int(from_state)),
            property_name(property, int(to_state)),
        ]


def format_freshdesk_note_message(ticket: WildValue, event_info: list[str]) -> str:
    """There are public (visible to customers) and private note types."""
    note_type = event_info[1]
    content = NOTE_TEMPLATE.format(
        name=ticket["requester_name"].tame(check_string),
        email=ticket["requester_email"].tame(check_string),
        note_type=note_type,
        ticket_id=ticket["ticket_id"].tame(check_string),
        ticket_url=ticket["ticket_url"].tame(check_string),
    )

    return content


def format_freshdesk_property_change_message(ticket: WildValue, event_info: list[str]) -> str:
    """Freshdesk will only tell us the first event to match our webhook
    configuration, so if we change multiple properties, we only get the before
    and after data for the first one.
    """
    content = PROPERTY_CHANGE_TEMPLATE.format(
        name=ticket["requester_name"].tame(check_string),
        email=ticket["requester_email"].tame(check_string),
        ticket_id=ticket["ticket_id"].tame(check_string),
        ticket_url=ticket["ticket_url"].tame(check_string),
        property_name=event_info[0].capitalize(),
        old=event_info[1],
        new=event_info[2],
    )

    return content


def format_freshdesk_ticket_creation_message(ticket: WildValue) -> str:
    """They send us the description as HTML."""
    cleaned_description = convert_html_to_markdown(ticket["ticket_description"].tame(check_string))
    content = TICKET_CREATION_TEMPLATE.format(
        name=ticket["requester_name"].tame(check_string),
        email=ticket["requester_email"].tame(check_string),
        ticket_id=ticket["ticket_id"].tame(check_string),
        ticket_url=ticket["ticket_url"].tame(check_string),
        description=cleaned_description,
        type=ticket["ticket_type"].tame(check_string),
        priority=ticket["ticket_priority"].tame(check_string),
        status=ticket["ticket_status"].tame(check_string),
    )

    return content


@authenticated_rest_api_view(webhook_client_name="Freshdesk")
@typed_endpoint
def api_freshdesk_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    ticket = payload["freshdesk_webhook"]

    topic_name = (
        f"#{ticket['ticket_id'].tame(check_string)}: {ticket['ticket_subject'].tame(check_string)}"
    )
    event_info = parse_freshdesk_event(ticket["triggered_event"].tame(check_string))

    if event_info[1] == "created":
        content = format_freshdesk_ticket_creation_message(ticket)
    elif event_info[0] == "note_type":
        content = format_freshdesk_note_message(ticket, event_info)
    elif event_info[0] in ("status", "priority"):
        content = format_freshdesk_property_change_message(ticket, event_info)
    else:
        # Not an event we know handle; do nothing.
        return json_success(request)

    check_send_webhook_message(request, user_profile, topic_name, content)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: inline_images.json]---
Location: zulip-main/zerver/webhooks/freshdesk/fixtures/inline_images.json

```json
{"freshdesk_webhook":
    {
    "triggered_event":"{ticket_action:created}",
    "ticket_id":"12",
        "ticket_url":"http://test1234zzz.freshdesk.com/helpdesk/tickets/12",
    "ticket_type":"Problem",
        "ticket_subject":"Not enough ☃ guinea pigs",
        "ticket_description":"<div>There are too many cat pictures on the internet ☃. We need more guinea pigs. Exhibit 1:</div>\n<div><br></div>\n<div></div>\n<div><img src=\"http://cdn.freshdesk.com/data/helpdesk/attachments/production/12744808/original/guinea_pig.png?1383958880\" class=\"inline-image\" data-id=\"12744808\" style=\"\"></div>\n<br>",
        "ticket_status":"Open",
        "ticket_priority":"Urgent",
    "requester_name":"Requester ☃ Bob",
        "requester_email":"requester-bob@example.com"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: priority_changed.json]---
Location: zulip-main/zerver/webhooks/freshdesk/fixtures/priority_changed.json

```json
{"freshdesk_webhook":
    {
    "triggered_event":"{priority:{from:3,to:1}}",
    "ticket_id":"11",
        "ticket_url":"http://test1234zzz.freshdesk.com/helpdesk/tickets/11",
    "ticket_type":"Incident",
        "ticket_subject":"Test ticket subject",
        "ticket_description":"<div>Test ticket description.</div>",
        "ticket_status":"Resolved",
        "ticket_priority":"Low",
    "requester_name":"Requester Bob",
        "requester_email":"requester-bob@example.com"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: private_note.json]---
Location: zulip-main/zerver/webhooks/freshdesk/fixtures/private_note.json

```json
{"freshdesk_webhook":
    {
    "triggered_event":"{note_type:private}",
    "ticket_id":"11",
        "ticket_url":"http://test1234zzz.freshdesk.com/helpdesk/tickets/11",
    "ticket_type":"Incident",
        "ticket_subject":"Test ticket subject",
        "ticket_description":"<div>Test ticket description.</div>",
        "ticket_status":"Open",
        "ticket_priority":"Medium",
    "requester_name":"Requester Bob",
        "requester_email":"requester-bob@example.com"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: public_note.json]---
Location: zulip-main/zerver/webhooks/freshdesk/fixtures/public_note.json

```json
{"freshdesk_webhook":
    {
    "triggered_event":"{note_type:public}",
    "ticket_id":"11",
        "ticket_url":"http://test1234zzz.freshdesk.com/helpdesk/tickets/11",
    "ticket_type":"Incident",
        "ticket_subject":"Test ticket subject",
        "ticket_description":"<div>Test ticket description.</div>",
        "ticket_status":"Open",
        "ticket_priority":"Medium",
    "requester_name":"Requester Bob",
        "requester_email":"requester-bob@example.com"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: status_changed.json]---
Location: zulip-main/zerver/webhooks/freshdesk/fixtures/status_changed.json

```json
{"freshdesk_webhook":
    {
    "triggered_event":"{status:{from:4,to:6}}",
    "ticket_id":"11",
        "ticket_url":"http://test1234zzz.freshdesk.com/helpdesk/tickets/11",
    "ticket_type":"Incident",
        "ticket_subject":"Test ticket subject ☃",
        "ticket_description":"<div>Test ticket description ☃.</div>",
        "ticket_status":"Waiting on Customer",
        "ticket_priority":"Low",
    "requester_name":"Requester Bob",
        "requester_email":"requester-bob@example.com"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: status_changed_fixture_with_missing_key.json]---
Location: zulip-main/zerver/webhooks/freshdesk/fixtures/status_changed_fixture_with_missing_key.json

```json
{"freshdesk_webhook":
    {
    "ticket_id":"11",
        "ticket_url":"http://test1234zzz.freshdesk.com/helpdesk/tickets/11",
    "ticket_type":"Incident",
        "ticket_subject":"Test ticket subject ☃",
        "ticket_description":"<div>Test ticket description ☃.</div>",
        "ticket_status":"Waiting on Customer",
        "ticket_priority":"Low",
    "requester_name":"Requester Bob",
        "requester_email":"requester-bob@example.com"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: ticket_created.json]---
Location: zulip-main/zerver/webhooks/freshdesk/fixtures/ticket_created.json

```json
{"freshdesk_webhook":
    {
    "triggered_event":"{ticket_action:created}",
    "ticket_id":"11",
    "ticket_url":"http://test1234zzz.freshdesk.com/helpdesk/tickets/11",
    "ticket_type":"Incident",
    "ticket_subject":"Test ticket subject ☃",
    "ticket_description":"<div>Test ticket description ☃.</div>",
    "ticket_status":"Pending",
    "ticket_priority":"High",
    "requester_name":"Requester ☃ Bob",
    "requester_email":"requester-bob@example.com"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: unknown_payload.json]---
Location: zulip-main/zerver/webhooks/freshdesk/fixtures/unknown_payload.json

```json
{"freshdesk_webhook":
    {
    "triggered_event":"{unknown_event:{from:3,to:1}}",
    "ticket_id":"11",
        "ticket_url":"http://test1234zzz.freshdesk.com/helpdesk/tickets/11",
    "ticket_type":"Incident",
        "ticket_subject":"Test ticket subject",
        "ticket_description":"<div>Test ticket description.</div>",
        "ticket_status":"Resolved",
        "ticket_priority":"Low",
    "requester_name":"Requester Bob",
        "requester_email":"requester-bob@example.com"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/freshping/doc.md

```text
# Zulip Freshping integration

Receive Freshping notifications in Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to your **Freshping** dashboard, and select **Settings**. Click
   **Integrations**, and select **Create Integration** under **Webhooks**.

1. Set **Domain URL** to the URL generated above, and click **Create**.
   Once you've created the webhook, you can see if it's configured
   correctly by clicking **Test**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/freshping/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/freshping/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class FreshpingHookTests(WebhookTestCase):
    CHANNEL_NAME = "freshping"
    URL_TEMPLATE = "/api/v1/external/freshping?api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "freshping"

    def test_freshping_check_test(self) -> None:
        """
        Tests if freshping check test is handled correctly
        """
        expected_topic_name = "Freshping"
        expected_message = "Freshping webhook has been successfully configured."
        self.check_webhook("freshping_check_test", expected_topic_name, expected_message)

    def test_freshping_check_unreachable(self) -> None:
        """
        Tests if freshping check unreachable is handled correctly
        """
        expected_topic_name = "Test Check"
        expected_message = """
https://example.com has just become unreachable.
Error code: 521.
""".strip()
        self.check_webhook("freshping_check_unreachable", expected_topic_name, expected_message)

    def test_freshping_check_reachable(self) -> None:
        """
        Tests if freshping check reachable is handled correctly
        """
        expected_topic_name = "Test Check"
        expected_message = "https://example.com is back up and no longer unreachable."
        self.check_webhook("freshping_check_reachable", expected_topic_name, expected_message)
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/freshping/view.py
Signals: Django

```python
from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.exceptions import UnsupportedWebhookEventTypeError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_int, check_string
from zerver.lib.webhooks.common import check_send_webhook_message, get_setup_webhook_message
from zerver.models import UserProfile

FRESHPING_TOPIC_TEMPLATE_TEST = "Freshping"
FRESHPING_TOPIC_TEMPLATE = "{check_name}"

FRESHPING_MESSAGE_TEMPLATE_UNREACHABLE = """
{request_url} has just become unreachable.
Error code: {http_status_code}.
""".strip()
FRESHPING_MESSAGE_TEMPLATE_UP = "{request_url} is back up and no longer unreachable."
CHECK_STATE_NAME_TO_EVENT_TYPE = {"Reporting Error": "reporting_error", "Available": "available"}
ALL_EVENT_TYPES = list(CHECK_STATE_NAME_TO_EVENT_TYPE.values())


@webhook_view("Freshping", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_freshping_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    check_state_name = payload["webhook_event_data"]["check_state_name"].tame(check_string)
    if check_state_name not in CHECK_STATE_NAME_TO_EVENT_TYPE:
        raise UnsupportedWebhookEventTypeError(check_state_name)
    body = get_body_for_http_request(payload)
    topic_name = get_topic_for_http_request(payload)

    check_send_webhook_message(
        request,
        user_profile,
        topic_name,
        body,
        CHECK_STATE_NAME_TO_EVENT_TYPE[check_state_name],
    )
    return json_success(request)


def get_topic_for_http_request(payload: WildValue) -> str:
    webhook_event_data = payload["webhook_event_data"]
    if webhook_event_data["application_name"].tame(check_string) == "Webhook test":
        topic_name = FRESHPING_TOPIC_TEMPLATE_TEST
    else:
        topic_name = FRESHPING_TOPIC_TEMPLATE.format(
            check_name=webhook_event_data["check_name"].tame(check_string)
        )
    return topic_name


def get_body_for_http_request(payload: WildValue) -> str:
    webhook_event_data = payload["webhook_event_data"]
    if webhook_event_data["check_state_name"].tame(check_string) == "Reporting Error":
        body = FRESHPING_MESSAGE_TEMPLATE_UNREACHABLE.format(
            request_url=webhook_event_data["request_url"].tame(check_string),
            http_status_code=webhook_event_data["http_status_code"].tame(check_int),
        )
    elif webhook_event_data["check_state_name"].tame(check_string) == "Available":
        if webhook_event_data["application_name"].tame(check_string) == "Webhook test":
            body = get_setup_webhook_message("Freshping")
        else:
            body = FRESHPING_MESSAGE_TEMPLATE_UP.format(
                request_url=webhook_event_data["request_url"].tame(check_string)
            )

    return body
```

--------------------------------------------------------------------------------

---[FILE: freshping_check_reachable.json]---
Location: zulip-main/zerver/webhooks/freshping/fixtures/freshping_check_reachable.json

```json
{
    "organization_name": "Example Org",
    "webhook_event_id": 5301955,
    "organization_id": 156000,
    "webhook_type": "AL",
    "webhook_event_data": {
        "check_state_name": "Available",
        "check_computed_target_response_time": 1000,
        "application_id": 155565,
        "recently_started_check_state_name": null,
        "check_id": 585767,
        "recently_started_check_start_time": null,
        "http_status_code": 200,
        "request_start_time": "2021-04-15T19:57:32.607484+00:00",
        "check_name": "Test Check",
        "recently_started_check_http_status_code": null,
        "application_name": " 's Application",
        "recently_started_check_response_time": null,
        "request_url": "https://example.com",
        "check_target_response_time": 1000,
        "@type": "MessageCard",
        "response_time": 140
    },
    "webhook_id": 24172,
    "webhook_event_created_on": "2021-04-15T19:57:33.035824+00:00"
}
```

--------------------------------------------------------------------------------

---[FILE: freshping_check_test.json]---
Location: zulip-main/zerver/webhooks/freshping/fixtures/freshping_check_test.json

```json
{
    "organization_name": "Example Org",
    "webhook_event_id": 5301811,
    "organization_id": 156000,
    "webhook_type": "AL",
    "webhook_event_data": {
        "check_state_name": "Available",
        "check_target_response_time": 100,
        "recently_started_check_state_name": null,
        "check_id": 1,
        "recently_started_check_start_time": null,
        "http_status_code": 200,
        "request_start_time": "2021-04-15T19:36:31.812658+00:00",
        "check_name": "Example check",
        "recently_started_check_http_status_code": null,
        "application_name": "Webhook test",
        "recently_started_check_response_time": null,
        "request_url": "https://www.example.com/",
        "check_computed_target_response_time": 200,
        "response_time": 50
    },
    "webhook_id": 24172,
    "webhook_event_created_on": "2021-04-15T19:36:31.812999+00:00"
}
```

--------------------------------------------------------------------------------

---[FILE: freshping_check_unreachable.json]---
Location: zulip-main/zerver/webhooks/freshping/fixtures/freshping_check_unreachable.json

```json
{
    "organization_name": "Example Org",
    "webhook_event_id": 5301855,
    "organization_id": 156000,
    "webhook_type": "AL",
    "webhook_event_data": {
        "check_state_name": "Reporting Error",
        "check_computed_target_response_time": 1000,
        "application_id": 155565,
        "recently_started_check_state_name": null,
        "check_id": 585767,
        "recently_started_check_start_time": null,
        "http_status_code": 521,
        "request_start_time": "2021-04-15T19:46:47.644166+00:00",
        "check_name": "Test Check",
        "recently_started_check_http_status_code": null,
        "application_name": " 's Application",
        "recently_started_check_response_time": null,
        "request_url": "https://example.com",
        "check_target_response_time": 1000,
        "@type": "MessageCard",
        "response_time": 635
    },
    "webhook_id": 24172,
    "webhook_event_created_on": "2021-04-15T19:46:49.077370+00:00"
}
```

--------------------------------------------------------------------------------

````
