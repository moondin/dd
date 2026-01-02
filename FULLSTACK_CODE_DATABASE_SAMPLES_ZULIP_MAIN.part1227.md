---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1227
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1227 of 1290)

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

---[FILE: incident_default_base_with_zulip_custom_fields.json]---
Location: zulip-main/zerver/webhooks/newrelic/fixtures/incident_default_base_with_zulip_custom_fields.json

```json
{
    "id": "13bbcdca-f0b6-470d-b0be-b34583c58869",
    "issueUrl": "https://radar-api.service.newrelic.com/accounts/4420147/issues/13bbcdca-f0b6-470d-b0be-b34583c58869?notifier=WEBHOOK",
    "title": "PIETER-UBUNTU query result is > 1.0 for 5 minutes on 'Storage on Host Exceeded Threshold'",
    "priority": "HIGH",
    "impactedEntities": [
      "PIETER-UBUNTU"
    ],
    "totalIncidents": 1,
    "state": "ACTIVATED",
    "trigger": "STATE_CHANGE",
    "isCorrelated": "false",
    "createdAt": 1713769949493,
    "updatedAt": 1713769949494,
    "sources": [
      "newrelic"
    ],
    "alertPolicyNames": [
      "Golden Signals"
    ],
    "alertConditionNames": [
      "Storage on Host Exceeded Threshold"
    ],
    "workflowName": "issue workflow",
    "owner": "N/A",
    "zulipCustomFields": {
      "Your custom payload": "somedata123",
      "custom status 1": true,
      "Custom list 1": ["SSD", 2000, false, null, 13.33],
      "Custom field 1": null,
      "Custom field 2": 9000
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: incident_provided_base_with_zulip_custom_fields.json]---
Location: zulip-main/zerver/webhooks/newrelic/fixtures/incident_provided_base_with_zulip_custom_fields.json

```json
{
	"id": "95a9344a-2590-48ce-8d83-07e28b6d22c6",
	"issueUrl": "https://radar-api.service.newrelic.com/accounts/1/issues/0ea2df1c-adab-45d2-aae0-042b609d2322?notifier=SLACK",
	"title": "main_app-UBUNTU query result is > 2.0 for 1 minutes on 'High CPU'",
	"priority": "CRITICAL",
	"totalIncidents": 1,
	"state": "CLOSED",
	"createdAt": 1713766590228,
	"updatedAt": 1713766657383,
	"alertPolicyNames": ["Golden Signals"],
	"alertConditionNames": ["High CPU"],
    "zulipCustomFields": {
        "Your custom payload": "somedata123",
        "custom status 1": true,
        "Custom list 1": ["SSD", 2000, false, null, 13.33],
        "Custom field 1": null,
        "Custom field 2": 9000
      }
}
```

--------------------------------------------------------------------------------

---[FILE: incident_with_invalid_zulip_custom_fields.json]---
Location: zulip-main/zerver/webhooks/newrelic/fixtures/incident_with_invalid_zulip_custom_fields.json

```json
{
    "id": "13bbcdca-f0b6-470d-b0be-b34583c58869",
    "issueUrl": "https://radar-api.service.newrelic.com/accounts/4420147/issues/13bbcdca-f0b6-470d-b0be-b34583c58869?notifier=WEBHOOK",
    "title": "PIETER-UBUNTU query result is > 1.0 for 5 minutes on 'Storage on Host Exceeded Threshold'",
    "priority": "HIGH",
    "totalIncidents": 1,
    "state": "ACTIVATED",
    "trigger": "STATE_CHANGE",
    "createdAt": 1713769949493,
    "updatedAt": 1713769949494,
    "alertPolicyNames": [
      "Golden Signals"
    ],
    "alertConditionNames": [
      "Storage on Host Exceeded Threshold"
    ],
    "owner": "N/A",
    "zulipCustomFields": {
      "Invalid fields 1": ["SSD", 2000, false, null, {}],
      "Invalid field 2": {},
      "Is valid": true
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: missing_essential_fields_default_payload.json]---
Location: zulip-main/zerver/webhooks/newrelic/fixtures/missing_essential_fields_default_payload.json

```json
{
	"unrecognized1": "https://radar-api.service.newrelic.com/accounts/1/issues/0ea2df1c-adab-45d2-aae0-042b609d2322?notifier=SLACK",
	"unrecognized2": "PIETER-UBUNTU query result is > 2.0 for 1 minutes on 'High CPU'",
	"unrecognized3": "CRITICAL",
	"updatedField1": 1,
	"updatedField2": "CREATED",
	"updatedField3": 1713592289021,
	"changedField1": 1713592289021,
	"changedField2": ["Golden Signals"],
	"changedField3": ["High CPU"]
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/opencollective/doc.md

```text
# Zulip Open Collective integration

Get Zulip notifications for new sign-ups on your **Open Collective** page.

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. In Open Collective, navigate to one of the collectives under
   **My Collectives**. Go to **Settings** > **Webhooks**.

1. Set **URL** to the URL generated above, and choose **Activity** >
   **New Member**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/opencollective/001.png)

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/opencollective/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class OpenCollectiveHookTests(WebhookTestCase):
    CHANNEL_NAME = "test"
    URL_TEMPLATE = "/api/v1/external/opencollective?&api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "opencollective"

    # Note: Include a test function per each distinct message condition your integration supports
    def test_one_time_donation(self) -> None:  # test one time donation
        expected_topic_name = "New Member"
        expected_message = "@_**Λευτέρης Κυριαζάνος** donated **€1.00**! :tada:"

        self.check_webhook(
            "one_time_donation",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_one_time_incognito_donation(self) -> None:  # test one time incognito donation
        expected_topic_name = "New Member"
        expected_message = "An **Incognito** member donated **$1.00**! :tada:"

        # use fixture named helloworld_hello
        self.check_webhook(
            "one_time_incognito_donation",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/opencollective/view.py
Signals: Django

```python
from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

MEMBER_NAME_TEMPLATE = "{name}"
AMOUNT_TEMPLATE = "{amount}"


@webhook_view("OpenCollective")
@typed_endpoint
def api_opencollective_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    name = get_name(payload)
    amount = get_amount(payload)

    # construct the body of the message
    body = ""

    if name == "Incognito":  # Incognito donation
        body = f"An **Incognito** member donated **{amount}**! :tada:"
    else:  # non-Incognito donation
        body = f"@_**{name}** donated **{amount}**! :tada:"

    topic_name = "New Member"

    # send the message
    check_send_webhook_message(request, user_profile, topic_name, body)

    return json_success(request)


def get_name(payload: WildValue) -> str:
    return MEMBER_NAME_TEMPLATE.format(
        name=payload["data"]["member"]["memberCollective"]["name"].tame(check_string)
    )


def get_amount(payload: WildValue) -> str:
    return AMOUNT_TEMPLATE.format(
        amount=payload["data"]["order"]["formattedAmount"].tame(check_string)
    )
```

--------------------------------------------------------------------------------

---[FILE: one_time_donation.json]---
Location: zulip-main/zerver/webhooks/opencollective/fixtures/one_time_donation.json

```json
{
  "createdAt": "2021-06-21T17:25:24.344Z",
  "id": 1242511,
  "type": "collective.member.created",
  "CollectiveId": 281290,
  "data": {
    "member": {
      "role": "BACKER",
      "description": null,
      "since": "2021-06-21T17:25:24.332Z",
      "memberCollective": {
        "id": 280138,
        "type": "USER",
        "slug": "leyteris-kyriazanos",
        "name": "Λευτέρης Κυριαζάνος",
        "company": null,
        "website": null,
        "twitterHandle": null,
        "githubHandle": null,
        "description": null,
        "previewImage": null
      }
    },
    "order": {
      "id": 183773,
      "totalAmount": 100,
      "currency": "EUR",
      "description": "Financial contribution to Test-Webhooks",
      "interval": null,
      "createdAt": "2021-06-21T17:25:17.968Z",
      "quantity": 1,
      "formattedAmount": "€1.00",
      "formattedAmountWithInterval": "€1.00"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: one_time_incognito_donation.json]---
Location: zulip-main/zerver/webhooks/opencollective/fixtures/one_time_incognito_donation.json

```json
{
    "createdAt": "2021-04-30T19:20:04.346Z",
    "id": 1121199,
    "type": "collective.member.created",
    "CollectiveId": 30312,
    "data": {
      "member": {
        "role": "BACKER",
        "description": null,
        "since": "2021-04-30T19:20:04.314Z",
        "memberCollective": {
          "type": "USER",
          "name": "Incognito",
          "previewImage": null
        }
      },
      "order": {
        "id": 168629,
        "totalAmount": 100,
        "currency": "USD",
        "description": "Monthly financial contribution to Zulip",
        "interval": "month",
        "createdAt": "2021-04-30T19:19:58.647Z",
        "quantity": 1,
        "formattedAmount": "$1.00",
        "formattedAmountWithInterval": "$1.00 / month"
      }
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/openproject/doc.md

```text
# Zulip OpenProject integration

Get Zulip notifications for your OpenProject work packages and projects!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. From your OpenProject organization, click on your user profile icon.
   Select **Administration** from the dropdown menu, and navigate to
   **API and Webhooks**. Select the **Webhooks** tab from the left panel,
   and click on **+ Webhook**.

1. Enter a name of your choice for the webhook, such as `Zulip`. Set
   **Payload URL** to the URL generated above, and ensure the webhook is
   enabled.

1. Select the events and projects you want to receive notifications for,
   and click **Create**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/openproject/001.png)

### Related documentation

* [**OpenProject webhook guide**][1]

{!webhooks-url-specification.md!}

[1]: https://www.openproject.org/docs/system-admin-guide/api-and-webhooks/#webhooks
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/openproject/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class OpenProjectHookTests(WebhookTestCase):
    CHANNEL_NAME = "OpenProjectUpdates"
    URL_TEMPLATE = "/api/v1/external/openproject?api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "openproject"
    STREAM_NAME = "OpenProjectUpdates"

    def test_project_with_parent_created(self) -> None:
        expected_topic = "AI Backend"
        expected_message = (
            "Project **AI Backend** was created as a sub-project of **Demo project**."
        )

        self.check_webhook(
            "project_created__with_parent",
            expected_topic,
            expected_message,
        )

    def test_project_without_parent_created(self) -> None:
        expected_topic = "AI Backend"
        expected_message = "Project **AI Backend** was created."

        self.check_webhook(
            "project_created__without_parent",
            expected_topic,
            expected_message,
        )

    def test_project_updated(self) -> None:
        expected_topic = "AI Backend"
        expected_message = "Project **AI Backend** was updated."
        self.check_webhook(
            "project_updated",
            expected_topic,
            expected_message,
        )

    def test_work_package_created(self) -> None:
        expected_topic = "Demo project"
        expected_message = "**Task1** (work package **Task**) was created by **Nirved Mishra**."
        self.check_webhook(
            "work_package_created",
            expected_topic,
            expected_message,
        )

    def test_work_package_updated(self) -> None:
        expected_topic = "Demo project"
        expected_message = "**Task1** (work package **Task**) was updated by **Nirved Mishra**."
        self.check_webhook(
            "work_package_updated",
            expected_topic,
            expected_message,
        )

    def test_time_entry_with_workpackage_created(self) -> None:
        expected_topic = "Project1"
        expected_message = "**Nirved Mishra** logged **1 hour** on **kl**."
        self.check_webhook(
            "time_entry_created__with_workpackage",
            expected_topic,
            expected_message,
        )

    def test_time_entry_without_workpackage_created(self) -> None:
        expected_topic = "Project1"
        expected_message = "**Nirved Mishra** logged **1 hour** on **Project1**."
        self.check_webhook(
            "time_entry_created__without_workpackage",
            expected_topic,
            expected_message,
        )

    def test_time_entry_with_iso_hm(self) -> None:
        expected_topic = "Project1"
        expected_message = "**Nirved Mishra** logged **7 hours and 42 minutes** on **kl**."
        self.check_webhook(
            "time_entry_created__with_iso_hm",
            expected_topic,
            expected_message,
        )

    def test_time_entry_with_invalid_iso(self) -> None:
        expected_topic = "Project1"
        expected_message = "**Nirved Mishra** logged a time entry on **kl**."
        self.check_webhook(
            "time_entry_created__with_invalid_iso",
            expected_topic,
            expected_message,
        )

    def test_attachment_created(self) -> None:
        expected_topic = "Project 2"
        expected_message = "**Nirved Mishra** uploaded **a.out** in **task2**."
        self.check_webhook(
            "attachment_created",
            expected_topic,
            expected_message,
        )
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/openproject/view.py
Signals: Django

```python
import regex as re
from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.exceptions import UnsupportedWebhookEventTypeError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

ALL_EVENT_TYPES: list[str] = [
    "project:created",
    "project:updated",
    "work_package:created",
    "work_package:updated",
    "time_entry:created",
    "attachment:created",
]

PROJECT_MESSAGE_TEMPLATE = "Project **{name}** was {action}{parent_project_message}."

WORK_PACKAGE_MESSAGE_TEMPLATE = (
    "**{subject}** (work package **{type}**) was {action} by **{author}**."
)

ATTACHMENT_MESSAGE_TEMPLATE = "**{author}** uploaded **{filename}** in **{container_name}**."

TIME_ENTRY_MESSAGE_TEMPLATE = "**{user}** logged {duration_message}{parent_message}."


def format_duration(iso_duration: str) -> str:
    duration = re.fullmatch(
        r"P(?:(?P<days>\d+)D)?(?:T(?:(?P<hours>\d+)H)?(?:(?P<minutes>\d+)M)?(?:(?P<seconds>\d+)S)?)?",
        iso_duration,
    )
    if duration is None:
        raise ValueError(f"Invalid ISO 8601 duration format: {iso_duration}")

    time_units = ["days", "hours", "minutes", "seconds"]
    formatted_duration = [
        f"{int(duration.group(unit))} {unit[:-1] if int(duration.group(unit)) == 1 else unit}"
        for unit in time_units
        if duration.group(unit)
    ]

    if len(formatted_duration) > 1:
        return ", ".join(formatted_duration[:-1]) + " and " + formatted_duration[-1]
    return formatted_duration[0]


@webhook_view("OpenProject", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_openproject_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    event_type: str = payload["action"].tame(check_string)
    item, action = event_type.split(":")
    action_data: WildValue = payload[item]

    if item == "project":
        parent_project_message: str = ""
        parent_project: str = (
            action_data.get("_embedded", {}).get("parent", {}).get("name", "").tame(check_string)
        )
        if parent_project and action == "created":
            parent_project_message = f" as a sub-project of **{parent_project}**"
        message = PROJECT_MESSAGE_TEMPLATE.format(
            name=action_data["name"].tame(check_string),
            action=action,
            parent_project_message=parent_project_message,
        )
        topic = action_data["name"].tame(check_string)
    elif item == "work_package":
        message = WORK_PACKAGE_MESSAGE_TEMPLATE.format(
            subject=action_data["subject"].tame(check_string),
            type=action_data["_embedded"]["type"]["name"].tame(check_string),
            action=action,
            author=action_data["_embedded"]["author"]["name"].tame(check_string),
        )
        topic = action_data["_embedded"]["project"]["name"].tame(check_string)
    elif item == "attachment":
        message = ATTACHMENT_MESSAGE_TEMPLATE.format(
            filename=action_data["fileName"].tame(check_string),
            author=action_data["_embedded"]["author"]["name"].tame(check_string),
            container_name=action_data["_embedded"]["container"]["subject"].tame(check_string),
        )
        topic = action_data["_embedded"]["container"]["_links"]["project"]["title"].tame(
            check_string
        )
    elif item == "time_entry":
        parent_message: str = (
            f" on **{action_data['_embedded']['project']['name'].tame(check_string)}**"
        )
        workpackage: str = (
            action_data.get("_embedded", {})
            .get("workPackage", {})
            .get("subject", "")
            .tame(check_string)
        )
        if workpackage:
            parent_message = f" on **{workpackage}**"

        try:
            formatted_duration = format_duration(action_data["hours"].tame(check_string))
            duration_message = f"**{formatted_duration}**"
        except ValueError:
            duration_message = "a time entry"

        message = TIME_ENTRY_MESSAGE_TEMPLATE.format(
            duration_message=duration_message,
            user=action_data["_embedded"]["user"]["name"].tame(check_string),
            parent_message=parent_message,
        )
        topic = action_data["_embedded"]["project"]["name"].tame(check_string)
    else:
        raise UnsupportedWebhookEventTypeError(event_type)

    check_send_webhook_message(request, user_profile, topic, message)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: attachment_created.json]---
Location: zulip-main/zerver/webhooks/openproject/fixtures/attachment_created.json

```json
{
    "action": "attachment:created",
    "attachment": {
      "_type": "Attachment",
      "id": 3,
      "fileName": "a.out",
      "fileSize": 20144,
      "description": {
        "format": "plain",
        "raw": "",
        "html": ""
      },
      "status": "uploaded",
      "contentType": "application/x-pie-executable",
      "digest": {
        "algorithm": "md5",
        "hash": "f9d1a2d6c97e33acc10b858001bc0ea1"
      },
      "createdAt": "2025-01-01T21:27:50.230Z",
      "_embedded": {
        "author": {
          "_type": "User",
          "id": 4,
          "name": "Nirved Mishra",
          "createdAt": "2024-12-31T12:52:44.786Z",
          "updatedAt": "2025-01-01T18:28:20.852Z",
          "login": "nirved431@gmail.com",
          "admin": true,
          "firstName": "Nirved",
          "lastName": "Mishra",
          "email": "nirved431@gmail.com",
          "avatar": "https://secure.gravatar.com/avatar/aef06c318f044c985140e4ecae344c4a?default=404&secure=true",
          "status": "active",
          "identityUrl": null,
          "language": "en",
          "_links": {
            "self": {
              "href": "/api/v3/users/4",
              "title": "Nirved Mishra"
            },
            "memberships": {
              "href": "/api/v3/memberships?filters=%5B%7B%22principal%22%3A%7B%22operator%22%3A%22%3D%22%2C%22values%22%3A%5B%224%22%5D%7D%7D%5D",
              "title": "Memberships"
            },
            "showUser": {
              "href": "/users/4",
              "type": "text/html"
            },
            "updateImmediately": {
              "href": "/api/v3/users/4",
              "title": "Update nirved431@gmail.com",
              "method": "patch"
            },
            "lock": {
              "href": "/api/v3/users/4/lock",
              "title": "Set lock on nirved431@gmail.com",
              "method": "post"
            },
            "delete": {
              "href": "/api/v3/users/4",
              "title": "Delete nirved431@gmail.com",
              "method": "delete"
            }
          }
        },
        "container": {
          "_type": "WorkPackage",
          "id": 39,
          "lockVersion": 1,
          "subject": "task2",
          "description": {
            "format": "markdown",
            "raw": "x vxcv x\n\n<br>",
            "html": "<p class=\"op-uc-p\">x vxcv x</p>\n<br>"
          },
          "scheduleManually": false,
          "startDate": null,
          "dueDate": null,
          "derivedStartDate": null,
          "derivedDueDate": null,
          "estimatedTime": null,
          "derivedEstimatedTime": null,
          "derivedRemainingTime": null,
          "duration": null,
          "ignoreNonWorkingDays": false,
          "spentTime": "PT0S",
          "percentageDone": null,
          "derivedPercentageDone": null,
          "createdAt": "2025-01-01T20:44:41.255Z",
          "updatedAt": "2025-01-01T21:27:53.926Z",
          "readonly": false,
          "laborCosts": "0.00 EUR",
          "materialCosts": "0.00 EUR",
          "overallCosts": "0.00 EUR",
          "_links": {
            "attachments": {
              "href": "/api/v3/work_packages/39/attachments"
            },
            "prepareAttachment": {
              "href": "/api/v3/work_packages/39/attachments/prepare",
              "method": "post"
            },
            "addAttachment": {
              "href": "/api/v3/work_packages/39/attachments",
              "method": "post"
            },
            "fileLinks": {
              "href": "/api/v3/work_packages/39/file_links"
            },
            "addFileLink": {
              "href": "/api/v3/work_packages/39/file_links",
              "method": "post"
            },
            "self": {
              "href": "/api/v3/work_packages/39",
              "title": "task2"
            },
            "update": {
              "href": "/api/v3/work_packages/39/form",
              "method": "post"
            },
            "schema": {
              "href": "/api/v3/work_packages/schemas/4-1"
            },
            "updateImmediately": {
              "href": "/api/v3/work_packages/39",
              "method": "patch"
            },
            "delete": {
              "href": "/api/v3/work_packages/39",
              "method": "delete"
            },
            "logTime": {
              "href": "/api/v3/time_entries",
              "title": "Log time on work package 'task2'"
            },
            "move": {
              "href": "/work_packages/39/move/new",
              "type": "text/html",
              "title": "Move work package 'task2'"
            },
            "copy": {
              "href": "/work_packages/39/copy",
              "type": "text/html",
              "title": "Copy work package 'task2'"
            },
            "pdf": {
              "href": "/work_packages/39.pdf",
              "type": "application/pdf",
              "title": "Export as PDF"
            },
            "atom": {
              "href": "/work_packages/39.atom",
              "type": "application/rss+xml",
              "title": "Atom feed"
            },
            "availableRelationCandidates": {
              "href": "/api/v3/work_packages/39/available_relation_candidates",
              "title": "Potential work packages to relate to"
            },
            "customFields": {
              "href": "/projects/project-2/settings/custom_fields",
              "type": "text/html",
              "title": "Custom fields"
            },
            "configureForm": {
              "href": "/types/1/edit?tab=form_configuration",
              "type": "text/html",
              "title": "Configure form"
            },
            "activities": {
              "href": "/api/v3/work_packages/39/activities"
            },
            "availableWatchers": {
              "href": "/api/v3/work_packages/39/available_watchers"
            },
            "relations": {
              "href": "/api/v3/work_packages/39/relations"
            },
            "revisions": {
              "href": "/api/v3/work_packages/39/revisions"
            },
            "watchers": {
              "href": "/api/v3/work_packages/39/watchers"
            },
            "addWatcher": {
              "href": "/api/v3/work_packages/39/watchers",
              "method": "post",
              "payload": {
                "user": {
                  "href": "/api/v3/users/{user_id}"
                }
              },
              "templated": true
            },
            "removeWatcher": {
              "href": "/api/v3/work_packages/39/watchers/{user_id}",
              "method": "delete",
              "templated": true
            },
            "addRelation": {
              "href": "/api/v3/work_packages/39/relations",
              "method": "post",
              "title": "Add relation"
            },
            "addChild": {
              "href": "/api/v3/projects/project-2/work_packages",
              "method": "post",
              "title": "Add child of task2"
            },
            "changeParent": {
              "href": "/api/v3/work_packages/39",
              "method": "patch",
              "title": "Change parent of task2"
            },
            "addComment": {
              "href": "/api/v3/work_packages/39/activities",
              "method": "post",
              "title": "Add comment"
            },
            "previewMarkup": {
              "href": "/api/v3/render/markdown?context=/api/v3/work_packages/39",
              "method": "post"
            },
            "timeEntries": {
              "href": "/api/v3/time_entries?filters=%5B%7B%22work_package_id%22%3A%7B%22operator%22%3A%22%3D%22%2C%22values%22%3A%5B%2239%22%5D%7D%7D%5D",
              "title": "Time entries"
            },
            "ancestors": [],
            "category": {
              "href": null
            },
            "type": {
              "href": "/api/v3/types/1",
              "title": "Task"
            },
            "priority": {
              "href": "/api/v3/priorities/8",
              "title": "Normal"
            },
            "project": {
              "href": "/api/v3/projects/4",
              "title": "Project 2"
            },
            "status": {
              "href": "/api/v3/statuses/1",
              "title": "New"
            },
            "author": {
              "href": "/api/v3/users/4",
              "title": "Nirved Mishra"
            },
            "responsible": {
              "href": null
            },
            "assignee": {
              "href": "/api/v3/users/4",
              "title": "Nirved Mishra"
            },
            "version": {
              "href": null
            },
            "parent": {
              "href": null,
              "title": null
            },
            "customActions": [],
            "logCosts": {
              "href": "/work_packages/39/cost_entries/new",
              "type": "text/html",
              "title": "Log costs on task2"
            },
            "showCosts": {
              "href": "/projects/4/cost_reports?fields%5B%5D=WorkPackageId&operators%5BWorkPackageId%5D=%3D&set_filter=1&values%5BWorkPackageId%5D=39",
              "type": "text/html",
              "title": "Show cost entries"
            },
            "costsByType": {
              "href": "/api/v3/work_packages/39/summarized_costs_by_type"
            },
            "meetings": {
              "href": "/work_packages/39/tabs/meetings",
              "title": "meetings"
            },
            "github": {
              "href": "/work_packages/39/tabs/github",
              "title": "github"
            },
            "github_pull_requests": {
              "href": "/api/v3/work_packages/39/github_pull_requests",
              "title": "GitHub pull requests"
            },
            "gitlab": {
              "href": "/work_packages/39/tabs/gitlab",
              "title": "gitlab"
            },
            "gitlab_merge_requests": {
              "href": "/api/v3/work_packages/39/gitlab_merge_requests",
              "title": "Gitlab merge requests"
            },
            "gitlab_issues": {
              "href": "/api/v3/work_packages/39/gitlab_issues",
              "title": "Gitlab Issues"
            },
            "convertBCF": {
              "href": "/api/bcf/2.1/projects/project-2/topics",
              "title": "Convert to BCF",
              "payload": {
                "reference_links": [
                  "/api/v3/work_packages/39"
                ]
              },
              "method": "post"
            }
          }
        }
      },
      "_links": {
        "self": {
          "href": "/api/v3/attachments/3",
          "title": "a.out"
        },
        "author": {
          "href": "/api/v3/users/4",
          "title": "Nirved Mishra"
        },
        "container": {
          "href": "/api/v3/work_packages/39",
          "title": "task2"
        },
        "staticDownloadLocation": {
          "href": "/api/v3/attachments/3/content"
        },
        "downloadLocation": {
          "href": "https://saas-openproject-aws-de-trials2-20241119125120412800000002.s3.eu-central-1.amazonaws.com/1735649550_8932652_b7d27008_3959_4391_8bd2_083b23bbd9d0/attachment/file/3/a.out?response-content-disposition=attachment&X-Amz-Expires=600&X-Amz-Date=20250101T212754Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAUF2KCI5YK2B2YLH6%2F20250101%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=ce1ce0ece048498ed44704da6d4eab8aabbe34b38a67780fea218628b91e4e46"
        },
        "delete": {
          "href": "/api/v3/attachments/3",
          "method": "delete"
        }
      }
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: project_created__without_parent.json]---
Location: zulip-main/zerver/webhooks/openproject/fixtures/project_created__without_parent.json

```json
{
    "action": "project:created",
    "project": {
        "_type": "Project",
        "id": 3,
        "identifier": "ai backend",
        "name": "AI Backend",
        "active": true,
        "public": false,
        "description": {
            "format": "markdown",
            "raw": "",
            "html": ""
        },
        "createdAt": "2024-12-31T18:07:24.546Z",
        "updatedAt": "2024-12-31T18:07:24.609Z",
        "statusExplanation": {
            "format": "markdown",
            "raw": "",
            "html": ""
        },
        "_links": {
            "self": {
                "href": "/api/v3/projects/3",
                "title": "AI Backend"
            },
            "createWorkPackage": {
                "href": "/api/v3/projects/3/work_packages/form",
                "method": "post"
            },
            "createWorkPackageImmediately": {
                "href": "/api/v3/projects/3/work_packages",
                "method": "post"
            },
            "workPackages": {
                "href": "/api/v3/projects/3/work_packages"
            },
            "storages": [],
            "categories": {
                "href": "/api/v3/projects/3/categories"
            },
            "versions": {
                "href": "/api/v3/projects/3/versions"
            },
            "memberships": {
                "href": "/api/v3/memberships?filters=%5B%7B%22project%22%3A%7B%22operator%22%3A%22%3D%22%2C%22values%22%3A%5B%223%22%5D%7D%7D%5D"
            },
            "types": {
                "href": "/api/v3/projects/3/types"
            },
            "update": {
                "href": "/api/v3/projects/3/form",
                "method": "post"
            },
            "updateImmediately": {
                "href": "/api/v3/projects/3",
                "method": "patch"
            },
            "delete": {
                "href": "/api/v3/projects/3",
                "method": "delete"
            },
            "schema": {
                "href": "/api/v3/projects/schema"
            },
            "ancestors": [
                {
                    "href": "/api/v3/projects/1",
                    "title": "Demo project"
                }
            ],
            "projectStorages": {
                "href": "/api/v3/project_storages?filters=%5B%7B%22projectId%22%3A%7B%22operator%22%3A%22%3D%22%2C%22values%22%3A%5B%223%22%5D%7D%7D%5D"
            },
            "parent": {
                "href": "/api/v3/projects/1",
                "title": "Demo project"
            },
            "status": {
                "href": null
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: project_created__with_parent.json]---
Location: zulip-main/zerver/webhooks/openproject/fixtures/project_created__with_parent.json

```json
{
  "action": "project:created",
  "project": {
    "_type": "Project",
    "id": 3,
    "identifier": "ai backend",
    "name": "AI Backend",
    "active": true,
    "public": false,
    "description": {
      "format": "markdown",
      "raw": "",
      "html": ""
    },
    "createdAt": "2024-12-31T18:07:24.546Z",
    "updatedAt": "2024-12-31T18:07:24.609Z",
    "statusExplanation": {
      "format": "markdown",
      "raw": "",
      "html": ""
    },
    "_embedded": {
      "parent": {
        "_type": "Project",
        "id": 1,
        "identifier": "demo-project",
        "name": "Demo project",
        "active": true,
        "public": true,
        "description": {
          "format": "markdown",
          "raw": "This is a short summary of the goals of this demo project.",
          "html": "<p class=\"op-uc-p\">This is a short summary of the goals of this demo project.</p>"
        },
        "createdAt": "2024-12-31T12:52:45.287Z",
        "updatedAt": "2024-12-31T18:07:24.609Z",
        "statusExplanation": {
          "format": "markdown",
          "raw": "All tasks are on schedule. The people involved know their tasks. The system is completely set up.",
          "html": "<p class=\"op-uc-p\">All tasks are on schedule. The people involved know their tasks. The system is completely set up.</p>"
        },
        "_links": {
          "self": {
            "href": "/api/v3/projects/1",
            "title": "Demo project"
          },
          "createWorkPackage": {
            "href": "/api/v3/projects/1/work_packages/form",
            "method": "post"
          },
          "createWorkPackageImmediately": {
            "href": "/api/v3/projects/1/work_packages",
            "method": "post"
          },
          "workPackages": {
            "href": "/api/v3/projects/1/work_packages"
          },
          "storages": [],
          "categories": {
            "href": "/api/v3/projects/1/categories"
          },
          "versions": {
            "href": "/api/v3/projects/1/versions"
          },
          "memberships": {
            "href": "/api/v3/memberships?filters=%5B%7B%22project%22%3A%7B%22operator%22%3A%22%3D%22%2C%22values%22%3A%5B%221%22%5D%7D%7D%5D"
          },
          "types": {
            "href": "/api/v3/projects/1/types"
          },
          "update": {
            "href": "/api/v3/projects/1/form",
            "method": "post"
          },
          "updateImmediately": {
            "href": "/api/v3/projects/1",
            "method": "patch"
          },
          "delete": {
            "href": "/api/v3/projects/1",
            "method": "delete"
          },
          "schema": {
            "href": "/api/v3/projects/schema"
          },
          "ancestors": [],
          "projectStorages": {
            "href": "/api/v3/project_storages?filters=%5B%7B%22projectId%22%3A%7B%22operator%22%3A%22%3D%22%2C%22values%22%3A%5B%221%22%5D%7D%7D%5D"
          },
          "parent": {
            "href": null
          },
          "status": {
            "href": "/api/v3/project_statuses/on_track",
            "title": "On track"
          }
        }
      }
    },
    "_links": {
      "self": {
        "href": "/api/v3/projects/3",
        "title": "AI Backend"
      },
      "createWorkPackage": {
        "href": "/api/v3/projects/3/work_packages/form",
        "method": "post"
      },
      "createWorkPackageImmediately": {
        "href": "/api/v3/projects/3/work_packages",
        "method": "post"
      },
      "workPackages": {
        "href": "/api/v3/projects/3/work_packages"
      },
      "storages": [],
      "categories": {
        "href": "/api/v3/projects/3/categories"
      },
      "versions": {
        "href": "/api/v3/projects/3/versions"
      },
      "memberships": {
        "href": "/api/v3/memberships?filters=%5B%7B%22project%22%3A%7B%22operator%22%3A%22%3D%22%2C%22values%22%3A%5B%223%22%5D%7D%7D%5D"
      },
      "types": {
        "href": "/api/v3/projects/3/types"
      },
      "update": {
        "href": "/api/v3/projects/3/form",
        "method": "post"
      },
      "updateImmediately": {
        "href": "/api/v3/projects/3",
        "method": "patch"
      },
      "delete": {
        "href": "/api/v3/projects/3",
        "method": "delete"
      },
      "schema": {
        "href": "/api/v3/projects/schema"
      },
      "ancestors": [
        {
          "href": "/api/v3/projects/1",
          "title": "Demo project"
        }
      ],
      "projectStorages": {
        "href": "/api/v3/project_storages?filters=%5B%7B%22projectId%22%3A%7B%22operator%22%3A%22%3D%22%2C%22values%22%3A%5B%223%22%5D%7D%7D%5D"
      },
      "parent": {
        "href": "/api/v3/projects/1",
        "title": "Demo project"
      },
      "status": {
        "href": null
      }
    }
  }
}
```

--------------------------------------------------------------------------------

````
