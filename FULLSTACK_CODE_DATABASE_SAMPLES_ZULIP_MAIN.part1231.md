---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1231
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1231 of 1290)

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
Location: zulip-main/zerver/webhooks/opensearch/view.py
Signals: Django

```python
from typing import Annotated

from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import ApiParamConfig, typed_endpoint
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile


@webhook_view("OpenSearch")
@typed_endpoint
def api_opensearch_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: Annotated[str, ApiParamConfig(argument_type_is_body=True)],
) -> HttpResponse:
    """
    OpenSearch only sends text/plain payloads, even when the Content-Type is
    set to other formats.
    Supports passing in the topic as the first line of the payload, with the
    topic prefixed by "topic:".
    """
    end_of_line = payload.find("\n")
    if payload.startswith("topic:") and end_of_line != -1:
        topic = payload[6:end_of_line].strip()
        message = payload[end_of_line + 1 :]
        check_send_webhook_message(request, user_profile, topic, message)
    else:
        check_send_webhook_message(request, user_profile, "OpenSearch alerts", payload)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: default_template.txt]---
Location: zulip-main/zerver/webhooks/opensearch/fixtures/default_template.txt

```text
Monitor Storage size monitor just entered alert status. Please investigate the issue.
- Trigger: Storage size over 1TB
- Severity: 1
- Period start: 2025-02-25T00:58:39.607Z
- Period end: 2025-02-25T00:59:39.607Z
```

--------------------------------------------------------------------------------

---[FILE: example_template.txt]---
Location: zulip-main/zerver/webhooks/opensearch/fixtures/example_template.txt

```text
topic: Resource Monitor
Alert of severity **3** triggered by **Insufficient memory**.
```

--------------------------------------------------------------------------------

---[FILE: test_notification.txt]---
Location: zulip-main/zerver/webhooks/opensearch/fixtures/test_notification.txt

```text
Test message content body for config id Uz5bK5UBeE4fYdADfbg0
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/opsgenie/doc.md

```text
# Zulip Opsgenie integration

Get Zulip notifications for your Opsgenie events!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to <https://app.opsgenie.com/integration>. Click on
   **Add New Integrations**, and select **Webhook**.

1. Set **Name** to a name of your choice, such as `Zulip`. Set
   **Webhook URL** to the URL generated above, and click on
   **Save Integration**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/opsgenie/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/opsgenie/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class OpsgenieHookTests(WebhookTestCase):
    CHANNEL_NAME = "opsgenie"
    URL_TEMPLATE = "/api/v1/external/opsgenie?&api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "opsgenie"

    def test_acknowledge_alert(self) -> None:
        expected_topic_name = "Integration1"
        expected_message = """
[Opsgenie alert for Integration1](https://app.opsgenie.com/alert/V2#/show/052652ac-5d1c-464a-812a-7dd18bbfba8c):
* **Type**: Acknowledge
* **Message**: test alert
* **Tags**: `tag1`, `tag2`
""".strip()

        self.check_webhook(
            "acknowledge",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_addnote_alert(self) -> None:
        expected_topic_name = "Integration1"
        expected_message = """
[Opsgenie alert for Integration1](https://app.opsgenie.com/alert/V2#/show/052652ac-5d1c-464a-812a-7dd18bbfba8c):
* **Type**: AddNote
* **Note**: note to test alert
* **Message**: test alert
* **Tags**: `tag1`, `tag2`
""".strip()

        self.check_webhook(
            "addnote",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_addrecipient_alert(self) -> None:
        expected_topic_name = "Integration1"
        expected_message = """
[Opsgenie alert for Integration1](https://app.opsgenie.com/alert/V2#/show/052652ac-5d1c-464a-812a-7dd18bbfba8c):
* **Type**: AddRecipient
* **Recipient**: team2_escalation
* **Message**: test alert
* **Tags**: `tag1`, `tag2`
""".strip()

        self.check_webhook(
            "addrecipient",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_addtags_alert(self) -> None:
        expected_topic_name = "Integration1"
        expected_message = """
[Opsgenie alert for Integration1](https://app.opsgenie.com/alert/V2#/show/052652ac-5d1c-464a-812a-7dd18bbfba8c):
* **Type**: AddTags
* **Tags added**: tag1,tag2,tag3
* **Message**: test alert
* **Tags**: `tag1`, `tag2`, `tag3`
""".strip()

        self.check_webhook(
            "addtags",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_addteam_alert(self) -> None:
        expected_topic_name = "Integration1"
        expected_message = """
[Opsgenie alert for Integration1](https://app.opsgenie.com/alert/V2#/show/052652ac-5d1c-464a-812a-7dd18bbfba8c):
* **Type**: AddTeam
* **Team added**: team2
* **Message**: test alert
* **Tags**: `tag1`, `tag2`
""".strip()

        self.check_webhook(
            "addteam",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_assignownership_alert(self) -> None:
        expected_topic_name = "Integration1"
        expected_message = """
[Opsgenie alert for Integration1](https://app.opsgenie.com/alert/V2#/show/052652ac-5d1c-464a-812a-7dd18bbfba8c):
* **Type**: AssignOwnership
* **Assigned owner**: user2@ifountain.com
* **Message**: test alert
* **Tags**: `tag1`, `tag2`
""".strip()

        self.check_webhook(
            "assignownership",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_close_alert(self) -> None:
        expected_topic_name = "Integration1"
        expected_message = """
[Opsgenie alert for Integration1](https://app.opsgenie.com/alert/V2#/show/052652ac-5d1c-464a-812a-7dd18bbfba8c):
* **Type**: Close
* **Message**: test alert
""".strip()

        self.check_webhook(
            "close",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_create_alert(self) -> None:
        expected_topic_name = "Webhook"
        expected_message = """
[Opsgenie alert for Webhook](https://app.opsgenie.com/alert/V2#/show/ec03dad6-62c8-4c94-b38b-d88f398e900f):
* **Type**: Create
* **Message**: another alert
* **Tags**: `vip`
""".strip()

        self.check_webhook(
            "create",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_customaction_alert(self) -> None:
        expected_topic_name = "Integration1"
        expected_message = """
[Opsgenie alert for Integration1](https://app.opsgenie.com/alert/V2#/show/052652ac-5d1c-464a-812a-7dd18bbfba8c):
* **Type**: TestAction
* **Message**: test alert
* **Tags**: `tag1`, `tag2`
""".strip()

        self.check_webhook(
            "customaction",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_delete_alert(self) -> None:
        expected_topic_name = "Integration1"
        expected_message = """
[Opsgenie alert for Integration1](https://app.opsgenie.com/alert/V2#/show/052652ac-5d1c-464a-812a-7dd18bbfba8c):
* **Type**: Delete
* **Message**: test alert
""".strip()

        self.check_webhook(
            "delete",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_escalate_alert(self) -> None:
        expected_topic_name = "Webhook_Test"
        expected_message = """
[Opsgenie alert for Webhook_Test](https://app.opsgenie.com/alert/V2#/show/7ba97e3a-d328-4b5e-8f9a-39e945a3869a):
* **Type**: Escalate
* **Escalation**: test_esc
""".strip()

        self.check_webhook(
            "escalate",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_removetags_alert(self) -> None:
        expected_topic_name = "Integration1"
        expected_message = """
[Opsgenie alert for Integration1](https://app.opsgenie.com/alert/V2#/show/052652ac-5d1c-464a-812a-7dd18bbfba8c):
* **Type**: RemoveTags
* **Tags removed**: tag3
* **Message**: test alert
* **Tags**: `tag1`, `tag2`
""".strip()

        self.check_webhook(
            "removetags",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_takeownership_alert(self) -> None:
        expected_topic_name = "Webhook"
        expected_message = """
[Opsgenie alert for Webhook](https://app.opsgenie.com/alert/V2#/show/8a745a79-3ed3-4044-8427-98e067c0623c):
* **Type**: TakeOwnership
* **Message**: message test
* **Tags**: `tag1`, `tag2`
""".strip()

        self.check_webhook(
            "takeownership",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_unacknowledge_alert(self) -> None:
        expected_topic_name = "Integration1"
        expected_message = """
[Opsgenie alert for Integration1](https://app.opsgenie.com/alert/V2#/show/052652ac-5d1c-464a-812a-7dd18bbfba8c):
* **Type**: UnAcknowledge
* **Message**: test alert
* **Tags**: `tag1`, `tag2`
""".strip()

        self.check_webhook(
            "unacknowledge",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/opsgenie/view.py
Signals: Django, Pydantic

```python
from django.http import HttpRequest, HttpResponse
from pydantic import Json

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

ALL_EVENT_TYPES = [
    "AddTeam",
    "UnAcknowledge",
    "AddNote",
    "TestAction",
    "Close",
    "Escalate",
    "AddRecipient",
    "RemoveTags",
    "Acknowledge",
    "Delete",
    "AddTags",
    "TakeOwnership",
    "Create",
    "AssignOwnership",
]


@webhook_view("Opsgenie", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_opsgenie_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
    eu_region: Json[bool] = False,
) -> HttpResponse:
    # construct the body of the message
    info = {
        "additional_info": "",
        "url_region": "eu." if eu_region else "",
        "alert_type": payload["action"].tame(check_string),
        "alert_id": payload["alert"]["alertId"].tame(check_string),
        "integration_name": payload["integrationName"].tame(check_string),
        "tags": ", ".join(
            "`" + tag.tame(check_string) + "`" for tag in payload["alert"].get("tags", [])
        ),
    }

    topic_name = info["integration_name"]
    bullet_template = "* **{key}**: {value}\n"

    fields = {
        "note": "Note",
        "recipient": "Recipient",
        "addedTags": "Tags added",
        "team": "Team added",
        "owner": "Assigned owner",
        "removedTags": "Tags removed",
        "message": "Message",
        "tags": "Tags",
        "escalationName": "Escalation",
    }

    for field, display_name in fields.items():
        if field == "tags" and info["tags"]:
            value = info["tags"]
        elif field == "escalationName" and field in payload:
            value = payload[field].tame(check_string)
        elif field in payload.get("alert", {}) and field != "tags":
            value = payload["alert"][field].tame(check_string)
        else:
            continue
        info["additional_info"] += bullet_template.format(key=display_name, value=value)

    body_template = """
[Opsgenie alert for {integration_name}](https://app.{url_region}opsgenie.com/alert/V2#/show/{alert_id}):
* **Type**: {alert_type}
{additional_info}
""".strip()

    body = body_template.format(**info)
    check_send_webhook_message(request, user_profile, topic_name, body, info["alert_type"])

    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: acknowledge.json]---
Location: zulip-main/zerver/webhooks/opsgenie/fixtures/acknowledge.json

```json
{
    "source":{
        "name":"",
        "type":"web"
    },
    "alert":{
        "updatedAt":1420452224764002246,
        "tags": [
            "tag1", "tag2"
        ],
        "message":"test alert",
        "username":"fili@ifountain.com",
        "alertId":"052652ac-5d1c-464a-812a-7dd18bbfba8c",
        "source":"fili@ifountain.com",
        "alias":"aliastest",
        "tinyId":"23",
        "createdAt":1420452191104,
        "userId":"daed1180-0ce8-438b-8f8e-57e1a5920a2d",
        "entity":""
    },
    "action":"Acknowledge",
    "integrationId":"37c8f316-17c6-49d7-899b-9c7e540c048d",
    "integrationName":"Integration1"
}
```

--------------------------------------------------------------------------------

---[FILE: addnote.json]---
Location: zulip-main/zerver/webhooks/opsgenie/fixtures/addnote.json

```json
{
    "source":{
        "name":"",
        "type":"web"
    },
    "alert":{
        "updatedAt":1420452275002000962,
        "tags": [
            "tag1", "tag2"
        ],
        "message":"test alert",
        "username":"fili@ifountain.com",
        "alertId":"052652ac-5d1c-464a-812a-7dd18bbfba8c",
        "source":"fili@ifountain.com",
        "alias":"aliastest",
        "tinyId":"23",
        "createdAt":1420452191104,
        "userId":"daed1180-0ce8-438b-8f8e-57e1a5920a2d",
        "entity":"",
        "note":"note to test alert"
    },
    "action":"AddNote",
    "integrationId":"37c8f316-17c6-49d7-899b-9c7e540c048d",
    "integrationName":"Integration1"
}
```

--------------------------------------------------------------------------------

---[FILE: addrecipient.json]---
Location: zulip-main/zerver/webhooks/opsgenie/fixtures/addrecipient.json

```json
{
    "source":{
        "name":"",
        "type":"web"
    },
    "alert":{
        "updatedAt":1420452274617001925,
        "tags": [
            "tag1", "tag2"
        ],
        "message":"test alert",
        "username":"fili@ifountain.com",
        "alertId":"052652ac-5d1c-464a-812a-7dd18bbfba8c",
        "source":"fili@ifountain.com",
        "alias":"aliastest",
        "tinyId":"23",
        "createdAt":1420452191104,
        "userId":"daed1180-0ce8-438b-8f8e-57e1a5920a2d",
        "entity":"",
        "recipient":"team2_escalation"
    },
    "action":"AddRecipient",
    "integrationId":"37c8f316-17c6-49d7-899b-9c7e540c048d",
    "integrationName":"Integration1"
}
```

--------------------------------------------------------------------------------

---[FILE: addtags.json]---
Location: zulip-main/zerver/webhooks/opsgenie/fixtures/addtags.json

```json
{
    "source":{
        "name":"",
        "type":"web"
    },
    "alert":{
        "updatedAt":1420452275002000962,
        "tags": [
            "tag1", "tag2", "tag3"
        ],
        "addedTags":"tag1,tag2,tag3",
        "message":"test alert",
        "username":"fili@ifountain.com",
        "alertId":"052652ac-5d1c-464a-812a-7dd18bbfba8c",
        "source":"fili@ifountain.com",
        "alias":"aliastest",
        "tinyId":"23",
        "createdAt":1420452191104,
        "userId":"daed1180-0ce8-438b-8f8e-57e1a5920a2d",
        "entity":""
    },
    "action":"AddTags",
    "integrationId":"37c8f316-17c6-49d7-899b-9c7e540c048d",
    "integrationName":"Integration1"
}
```

--------------------------------------------------------------------------------

---[FILE: addteam.json]---
Location: zulip-main/zerver/webhooks/opsgenie/fixtures/addteam.json

```json
{
    "source":{
        "name":"",
        "type":"web"
    },
    "alert":{
        "updatedAt":1420452256147001924,
        "tags": [
            "tag1", "tag2"
        ],
        "message":"test alert",
        "username":"fili@ifountain.com",
        "alertId":"052652ac-5d1c-464a-812a-7dd18bbfba8c",
        "source":"fili@ifountain.com",
        "alias":"aliastest",
        "tinyId":"23",
        "createdAt":1420452191104,
        "userId":"daed1180-0ce8-438b-8f8e-57e1a5920a2d",
        "entity":"",
        "team":"team2"
    },
    "action":"AddTeam",
    "integrationId":"37c8f316-17c6-49d7-899b-9c7e540c048d",
    "integrationName":"Integration1"
}
```

--------------------------------------------------------------------------------

---[FILE: assignownership.json]---
Location: zulip-main/zerver/webhooks/opsgenie/fixtures/assignownership.json

```json
{
    "source":{
        "name":"",
        "type":"web"
    },
    "alert":{
        "updatedAt":1420452374669001603,
        "tags": [
            "tag1", "tag2"
        ],
        "message":"test alert",
        "username":"fili@ifountain.com",
        "alertId":"052652ac-5d1c-464a-812a-7dd18bbfba8c",
        "source":"fili@ifountain.com",
        "alias":"aliastest",
        "tinyId":"23",
        "createdAt":1420452191104,
        "userId":"daed1180-0ce8-438b-8f8e-57e1a5920a2d",
        "entity":"",
        "owner" : "user2@ifountain.com"
    },
    "action":"AssignOwnership",
    "integrationId":"37c8f316-17c6-49d7-899b-9c7e540c048d",
    "integrationName":"Integration1"
}
```

--------------------------------------------------------------------------------

---[FILE: close.json]---
Location: zulip-main/zerver/webhooks/opsgenie/fixtures/close.json

```json
{
    "source":{
        "name":"",
        "type":"web"
    },
    "alert":{
        "updatedAt":1420452374669001603,
        "tags": [
        ],
        "message":"test alert",
        "username":"fili@ifountain.com",
        "alertId":"052652ac-5d1c-464a-812a-7dd18bbfba8c",
        "source":"fili@ifountain.com",
        "alias":"aliastest",
        "tinyId":"23",
        "createdAt":1420452191104,
        "userId":"daed1180-0ce8-438b-8f8e-57e1a5920a2d",
        "entity":""
    },
    "action":"Close",
    "integrationId":"37c8f316-17c6-49d7-899b-9c7e540c048d",
    "integrationName":"Integration1"
}
```

--------------------------------------------------------------------------------

---[FILE: create.json]---
Location: zulip-main/zerver/webhooks/opsgenie/fixtures/create.json

```json
{
   "action":"Create",
   "alert":{
      "alertId":"ec03dad6-62c8-4c94-b38b-d88f398e900f",
      "message":"another alert",
      "tags":[
         "vip"
      ],
      "tinyId":"2",
      "source":"test@example.com",
      "entity":"Server",
      "alias":"alert-alias",
      "createdAt":1502709956288,
      "updatedAt":1502709956288000110,
      "username":"test@example.com",
      "userId":"8d43133c-a002-4e95-bf2b-2d6f95e47c96",
      "recipients":[

      ],
      "teams":[
      ],
      "insertedAt":1502709956288000110,
      "priority":3
   },
   "source":{
      "name":"web",
      "type":"API"
   },
   "integrationId":"daca46c6-e26b-4dda-8f8a-21f6db7eeaef",
   "integrationName":"Webhook",
   "integrationType":"Webhook",
   "alertFlowContext":{
      "requestId":"df3ad546-c7b6-4520-8de3-52bb12d1e99a",
      "traceId":"df3ad546-c7b6-4520-8de3-52bb12d1e99a",
      "content":{

      }
   }
}
```

--------------------------------------------------------------------------------

---[FILE: customaction.json]---
Location: zulip-main/zerver/webhooks/opsgenie/fixtures/customaction.json

```json
{
    "source":{
        "name":"",
        "type":"web"
    },
    "alert":{
        "updatedAt":1420452275002000962,
        "tags": [
            "tag1", "tag2"
        ],
        "message":"test alert",
        "username":"fili@ifountain.com",
        "alertId":"052652ac-5d1c-464a-812a-7dd18bbfba8c",
        "source":"fili@ifountain.com",
        "alias":"aliastest",
        "tinyId":"23",
        "createdAt":1420452191104,
        "userId":"daed1180-0ce8-438b-8f8e-57e1a5920a2d",
        "entity":""
    },
    "action":"TestAction",
    "integrationId":"37c8f316-17c6-49d7-899b-9c7e540c048d",
    "integrationName":"Integration1"
}
```

--------------------------------------------------------------------------------

---[FILE: delete.json]---
Location: zulip-main/zerver/webhooks/opsgenie/fixtures/delete.json

```json
{
    "source":{
        "name":"",
        "type":"web"
    },
    "alert":{
        "tinyId":"23",
        "alias":"aliastest",
        "entity":"",
        "message":"test alert",
        "updatedAt":1420452374669001603,
        "alertId":"052652ac-5d1c-464a-812a-7dd18bbfba8c",
        "username":"fili@ifountain.com",
        "source":"fili@ifountain.com",
        "createdAt":1420452191104,
        "userId":"daed1180-0ce8-438b-8f8e-57e1a5920a2d"
    },
    "action":"Delete",
    "integrationId":"37c8f316-17c6-49d7-899b-9c7e540c048d",
    "integrationName":"Integration1"
}
```

--------------------------------------------------------------------------------

---[FILE: escalate.json]---
Location: zulip-main/zerver/webhooks/opsgenie/fixtures/escalate.json

```json
{
    "escalationId":"51859f57-7fad-467b-ad79-59acbc69cb6a",
    "headers":{
        "foo":"bar"
    },
    "integrationName":"Webhook_Test",
    "escalationNotify":{
        "name":"test@ifountain.com",
        "id":"64818849-71d6-40ce-87c6-ed5e588702fd",
        "type":"default",
        "entity":"user"
    },
    "integrationId":"868be72a-8015-432e-8b23-c1f7f4374baa",
    "escalationName":"test_esc",
    "alert":{
        "alertId":"7ba97e3a-d328-4b5e-8f9a-39e945a3869a"
    },
    "escalationTime":0,
    "action":"Escalate",
    "repeatCount":0
}
```

--------------------------------------------------------------------------------

---[FILE: removetags.json]---
Location: zulip-main/zerver/webhooks/opsgenie/fixtures/removetags.json

```json
{
    "source":{
        "name":"",
        "type":"web"
    },
    "alert":{
        "updatedAt":1420452275002000962,
        "tags": [
            "tag1", "tag2"
        ],
        "removedTags":"tag3",
        "message":"test alert",
        "username":"fili@ifountain.com",
        "alertId":"052652ac-5d1c-464a-812a-7dd18bbfba8c",
        "source":"fili@ifountain.com",
        "alias":"aliastest",
        "tinyId":"23",
        "createdAt":1420452191104,
        "userId":"daed1180-0ce8-438b-8f8e-57e1a5920a2d",
        "entity":""
    },
    "action":"RemoveTags",
    "integrationId":"37c8f316-17c6-49d7-899b-9c7e540c048d",
    "integrationName":"Integration1"
}
```

--------------------------------------------------------------------------------

---[FILE: takeownership.json]---
Location: zulip-main/zerver/webhooks/opsgenie/fixtures/takeownership.json

```json
{
   "integrationType":"Integration1",
   "alert":{
      "createdAt":1470226893192,
      "tinyId":"47",
      "alias":"8a745a79-3ed3-4044-8427-98e067c0623c",
      "alertId":"8a745a79-3ed3-4044-8427-98e067c0623c",
      "source":"test@test.com",
      "message":"message test",
      "userId":"ac6a9ab7-98fe-4256-8a0e-30dc082a55e7",
      "entity":"",
      "tags":[
         "tag1","tag2"
      ],
      "updatedAt":1470383477928000335,
      "username":"test@test.com"
   },
   "integrationName":"Webhook",
   "action":"TakeOwnership",
   "integrationId":"fd8755c1-7a5e-4829-9ecc-8990e1a2eed3",
   "source":{
      "name":"",
      "type":"web"
   }
}
```

--------------------------------------------------------------------------------

---[FILE: unacknowledge.json]---
Location: zulip-main/zerver/webhooks/opsgenie/fixtures/unacknowledge.json

```json
{
    "source":{
        "name":"",
        "type":"web"
    },
    "alert":{
        "updatedAt":1420452224764002246,
        "tags": [
            "tag1", "tag2"
        ],
        "message":"test alert",
        "username":"fili@ifountain.com",
        "alertId":"052652ac-5d1c-464a-812a-7dd18bbfba8c",
        "source":"fili@ifountain.com",
        "alias":"aliastest",
        "tinyId":"23",
        "createdAt":1420452191104,
        "userId":"daed1180-0ce8-438b-8f8e-57e1a5920a2d",
        "entity":""
    },
    "action":"UnAcknowledge",
    "integrationId":"37c8f316-17c6-49d7-899b-9c7e540c048d",
    "integrationName":"Integration1"
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/pagerduty/doc.md

```text
# Zulip PagerDuty integration

Get Zulip notifications for your PagerDuty services!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Open the **Integrations** tab, and click **Generic Webhooks (v3)**.
   Click **Add Webhook**.

1. Set **Webhook URL** to the URL generated above, configure the **Scope
   Type** and **Scope** you want to receive notifications for, select
   the [events](#filtering-incoming-events) you want to send under
   **Events to Send**, and click **Add Webhook**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/pagerduty/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/pagerduty/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class PagerDutyHookTests(WebhookTestCase):
    CHANNEL_NAME = "pagerduty"
    URL_TEMPLATE = "/api/v1/external/pagerduty?api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "pagerduty"

    def test_trigger(self) -> None:
        expected_message = "Incident [3](https://zulip-test.pagerduty.com/incidents/P140S4Y) triggered by [Test service](https://zulip-test.pagerduty.com/services/PIL5CUQ) (assigned to [armooo](https://zulip-test.pagerduty.com/users/POBCFRJ)).\n\n``` quote\nfoo\n```"
        self.check_webhook("trigger", "Incident 3", expected_message)

    def test_trigger_v2(self) -> None:
        expected_message = "Incident [33](https://webdemo.pagerduty.com/incidents/PRORDTY) triggered by [Production XDB Cluster](https://webdemo.pagerduty.com/services/PN49J75) (assigned to [Laura Haley](https://webdemo.pagerduty.com/users/P553OPV)).\n\n``` quote\nMy new incident\n```"
        self.check_webhook("trigger_v2", "Incident 33", expected_message)

    def test_triggerer_v3(self) -> None:
        expected_message = "Incident [Test Incident 3 (#9)](https://pig208.pagerduty.com/incidents/PFQZPSY) triggered by [pig208](https://pig208.pagerduty.com/services/PA2P440) (assigned to [PIG 208](https://pig208.pagerduty.com/users/PJ0LVEB))."
        self.check_webhook("triggered_v3", "Incident Test Incident 3 (#9)", expected_message)

    def test_trigger_without_assignee_v2(self) -> None:
        expected_message = "Incident [33](https://webdemo.pagerduty.com/incidents/PRORDTY) triggered by [Production XDB Cluster](https://webdemo.pagerduty.com/services/PN49J75) (assigned to nobody).\n\n``` quote\nMy new incident\n```"
        self.check_webhook("trigger_without_assignee_v2", "Incident 33", expected_message)

    def test_unacknowledge(self) -> None:
        expected_message = "Incident [3](https://zulip-test.pagerduty.com/incidents/P140S4Y) unacknowledged by [Test service](https://zulip-test.pagerduty.com/services/PIL5CUQ) (assigned to [armooo](https://zulip-test.pagerduty.com/users/POBCFRJ)).\n\n``` quote\nfoo\n```"
        self.check_webhook("unacknowledge", "Incident 3", expected_message)

    def test_unacknowledged_v3(self) -> None:
        expected_message = "Incident [Test Incident (#10)](https://pig208.pagerduty.com/incidents/PQ1K5C8) unacknowledged by [pig208](https://pig208.pagerduty.com/services/PA2P440) (assigned to [PIG 208](https://pig208.pagerduty.com/users/PJ0LVEB))."
        self.check_webhook("unacknowledged_v3", "Incident Test Incident (#10)", expected_message)

    def test_resolved(self) -> None:
        expected_message = "Incident [1](https://zulip-test.pagerduty.com/incidents/PO1XIJ5) resolved by [armooo](https://zulip-test.pagerduty.com/users/POBCFRJ).\n\n``` quote\nIt is on fire\n```"
        self.check_webhook("resolved", "Incident 1", expected_message)

    def test_resolved_v2(self) -> None:
        expected_message = "Incident [33](https://webdemo.pagerduty.com/incidents/PRORDTY) resolved by [Laura Haley](https://webdemo.pagerduty.com/users/P553OPV).\n\n``` quote\nMy new incident\n```"
        self.check_webhook("resolve_v2", "Incident 33", expected_message)

    def test_resolved_v3(self) -> None:
        expected_message = "Incident [Test Incident (#6)](https://pig208.pagerduty.com/incidents/PCPZE64) resolved by [PIG 208](https://pig208.pagerduty.com/users/PJ0LVEB)."
        self.check_webhook("resolved_v3", "Incident Test Incident (#6)", expected_message)

    def test_auto_resolved(self) -> None:
        expected_message = "Incident [2](https://zulip-test.pagerduty.com/incidents/PX7K9J2) resolved.\n\n``` quote\nnew\n```"
        self.check_webhook("auto_resolved", "Incident 2", expected_message)

    def test_acknowledge(self) -> None:
        expected_message = "Incident [1](https://zulip-test.pagerduty.com/incidents/PO1XIJ5) acknowledged by [armooo](https://zulip-test.pagerduty.com/users/POBCFRJ).\n\n``` quote\nIt is on fire\n```"
        self.check_webhook("acknowledge", "Incident 1", expected_message)

    def test_acknowledge_without_trigger_summary_data(self) -> None:
        expected_message = "Incident [1](https://zulip-test.pagerduty.com/incidents/PO1XIJ5) acknowledged by [armooo](https://zulip-test.pagerduty.com/users/POBCFRJ).\n\n``` quote\n\n```"
        self.check_webhook(
            "acknowledge_without_trigger_summary_data", "Incident 1", expected_message
        )

    def test_acknowledged_v3(self) -> None:
        expected_message = "Incident [Test Incident (#10)](https://pig208.pagerduty.com/incidents/PQ1K5C8) acknowledged by [PIG 208](https://pig208.pagerduty.com/users/PJ0LVEB)."
        self.check_webhook("acknowledged_v3", "Incident Test Incident (#10)", expected_message)

    def test_acknowledge_v2(self) -> None:
        expected_message = "Incident [33](https://webdemo.pagerduty.com/incidents/PRORDTY) acknowledged by [Laura Haley](https://webdemo.pagerduty.com/users/P553OPV).\n\n``` quote\nMy new incident\n```"
        self.check_webhook("acknowledge_v2", "Incident 33", expected_message)

    def test_incident_assigned_v2(self) -> None:
        expected_message = "Incident [33](https://webdemo.pagerduty.com/incidents/PRORDTY) assigned to [Wiley Jacobson](https://webdemo.pagerduty.com/users/PFBSJ2Z).\n\n``` quote\nMy new incident\n```"
        self.check_webhook("assign_v2", "Incident 33", expected_message)

    def test_reassigned_v3(self) -> None:
        expected_message = "Incident [Test Incident (#3)](https://pig208.pagerduty.com/incidents/PIQUG8X) reassigned to [Test User](https://pig208.pagerduty.com/users/PI9DT01)."
        self.check_webhook("reassigned_v3", "Incident Test Incident (#3)", expected_message)

    def test_no_subject(self) -> None:
        expected_message = "Incident [48219](https://dropbox.pagerduty.com/incidents/PJKGZF9) resolved.\n\n``` quote\nmp_error_block_down_critical\u2119\u01b4\n```"
        self.check_webhook("mp_fail", "Incident 48219", expected_message)

    def test_unsupported_webhook_event(self) -> None:
        for version in range(1, 4):
            payload = self.get_body(f"unsupported_v{version}")
            result = self.client_post(self.url, payload, content_type="application/json")
            self.assert_json_success(result)
            self.assert_in_response(
                "The 'incident.unsupported' event isn't currently supported by the PagerDuty webhook; ignoring",
                result,
            )
```

--------------------------------------------------------------------------------

````
