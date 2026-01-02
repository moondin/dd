---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1143
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1143 of 1290)

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

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/freshstatus/doc.md

```text
# Zulip Freshstatus integration

Receive Freshstatus notifications in Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. On your Freshstatus dashboard, select **Settings** and then click
   **Integrations**. Under **Webhooks**, select **Manage**, and click
   **New Webhook**.

1. Set **Webhook Name** to a name of your choice, such as `Zulip`, and
   **Description** to any suitable description.

1. Under **Condition**, select the [events](#filtering-incoming-events)
   you'd like to be notified for. Under **Action**, set **Request Type**
   to `POST`. Set **Callback URL** to the **URL** generated above.

1. Leave **Requires Authentication** untoggled, and set **Content** to
   **Advanced**.

1. Set **Incident JSON** to the following:

      ```
      {
         "id": "{id}",
         "title": "{title}",
         "description": "{description}",
         "start_time": "{start_time}",
         "end_time": "{end_time}",
         "is_private": "{is_private}",
         "source": "{source}",
         "affected_services": "{affected_services}",
         "notification_options": "{notification_options}"
      }
      ```

1. Set **Maintenance JSON** to the following:

      ```
      {
         "id": "{id}",
         "title": "{title}",
         "description": "{description}",
         "start_time": "{start_time}",
         "end_time": "{end_time}",
         "is_private": "{is_private}",
         "source": "{source}",
         "affected_services": "{affected_services}",
         "notification_options": "{notification_options}",
         "scheduled_start_time": "{scheduled_start_time}",
         "scheduled_end_time": "{scheduled_end_time}",
         "is_auto_update_status_on_scheduled_start": "{is_auto_update_status_on_scheduled_start}",
         "is_auto_update_status_on_scheduled_end": "{is_auto_update_status_on_scheduled_end}",
         "is_auto_update_component_status_on_scheduled_start": "{is_auto_update_component_status_on_scheduled_start}",
         "is_auto_update_component_status_on_scheduled_end": "{is_auto_update_component_status_on_scheduled_end}"
      }
      ```

1. Set **Incident/Maintenance Note JSON** to the following:

      ```
      {
         "id": "{note_id}",
         "title": "{title}",
         "incident_id": "{note_incident_id}",
         "incident_status": "{note_incident_status}",
         "message": "{note_message}",
         "status": "{note_status}",
         "is_private": "{note_is_private}",
         "notification_options": "{note_notification_options}"
      }
      ```

1. Click **Save**. Once the webhook is saved, you can check whether it
   is configured correctly by clicking **Test**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/freshstatus/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/freshstatus/tests.py

```python
from zerver.lib.send_email import FromAddress
from zerver.lib.test_classes import WebhookTestCase
from zerver.models import Recipient
from zerver.webhooks.freshstatus.view import MISCONFIGURED_PAYLOAD_ERROR_MESSAGE


class FreshstatusHookTests(WebhookTestCase):
    CHANNEL_NAME = "freshstatus"
    URL_TEMPLATE = "/api/v1/external/freshstatus?api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "freshstatus"

    def test_freshstatus_incident_open_multiple_services(self) -> None:
        """
        Tests if freshstatus incident open multiple services is handled correctly
        """
        expected_topic_name = "Degradation of Multiple Servers"
        expected_message = """
The following incident has been opened: **Degradation of Multiple Servers**
**Description:** This issue is being investigated.
**Start Time:** <time:2021-04-12T16:29:00+00:00>
**Affected Services:**
* Database Server
* Web Server
* Web Server 2
        """.strip()
        self.check_webhook(
            "freshstatus_incident_open_multiple_services", expected_topic_name, expected_message
        )

    def test_freshstatus_incident_open_multiple_services_over_limit(self) -> None:
        """
        Tests if freshstatus incident open multiple services over limit is handled correctly
        """
        expected_topic_name = "Degradation of Multiple Servers"
        expected_message = """
The following incident has been opened: **Degradation of Multiple Servers**
**Description:** This issue is being investigated.
**Start Time:** <time:2021-04-12T16:29:00+00:00>
**Affected Services:**
* Database Server
* Web Server
* Web Server 2
* Database Server 2
* Active Directory Server
[and 2 more service(s)]
        """.strip()
        self.check_webhook(
            "freshstatus_incident_open_multiple_services_over_limit",
            expected_topic_name,
            expected_message,
        )

    def test_freshstatus_incident_open(self) -> None:
        """
        Tests if freshstatus incident open is handled correctly
        """
        expected_topic_name = "Degradation of Database Server"
        expected_message = """
The following incident has been opened: **Degradation of Database Server**
**Description:** This issue is being investigated.
**Start Time:** <time:2021-04-12T16:29:00+00:00>
**Affected Services:**
* Database Server
        """.strip()
        self.check_webhook("freshstatus_incident_open", expected_topic_name, expected_message)

    def test_freshstatus_incident_note_created(self) -> None:
        """
        Tests if freshstatus incident note created is handled correctly
        """
        expected_topic_name = "Degradation of Database Server"
        expected_message = """
The following note has been added to the incident: **Degradation of Database Server**
**Note:** The incident is being worked on.
        """.strip()
        self.check_webhook(
            "freshstatus_incident_note_created", expected_topic_name, expected_message
        )

    def test_freshstatus_incident_closed(self) -> None:
        """
        Tests if freshstatus incident closed is handled correctly
        """
        expected_topic_name = "Degradation of Database Server"
        expected_message = """
The following incident has been closed: **Degradation of Database Server**
**Note:** The incident has been resolved.
        """.strip()
        self.check_webhook("freshstatus_incident_closed", expected_topic_name, expected_message)

    def test_freshstatus_scheduled_maintenance_planned(self) -> None:
        """
        Tests if freshstatus scheduled maintenance planned is handled correctly
        """
        expected_topic_name = "Expect some services downtime due to server maintenance"
        expected_message = """
The following scheduled maintenance has been opened: **Expect some services downtime due to server maintenance**
**Description:** As part of the upgrade routine, we will be carrying out server maintenance work for this Service. This work will affect the Service to be unavailable during the maintenance window. We apologize for any inconvenience this may cause. Please do not hesitate to contact our support team at support@example.com if you have any questions regarding this server upgrading exercise.
**Scheduled Start Time:** <time:2021-04-12T17:08:00+00:00>
**Scheduled End Time:** <time:2021-04-12T18:08:00+00:00>
**Affected Services:**
* Sample Service
        """.strip()
        self.check_webhook(
            "freshstatus_scheduled_maintenance_planned", expected_topic_name, expected_message
        )

    def test_freshstatus_scheduled_maintenance_planned_multiple_services(self) -> None:
        """
        Tests if freshstatus scheduled maintenance planned multiple services is handled correctly
        """
        expected_topic_name = "Expect some services downtime due to server maintenance"
        expected_message = """
The following scheduled maintenance has been opened: **Expect some services downtime due to server maintenance**
**Description:** As part of the upgrade routine, we will be carrying out server maintenance work for this Service. This work will affect the Service to be unavailable during the maintenance window. We apologize for any inconvenience this may cause. Please do not hesitate to contact our support team at support@example.com if you have any questions regarding this server upgrading exercise.
**Scheduled Start Time:** <time:2021-04-12T17:08:00+00:00>
**Scheduled End Time:** <time:2021-04-12T18:08:00+00:00>
**Affected Services:**
* Sample Service
* Sample Service 2
        """.strip()
        self.check_webhook(
            "freshstatus_scheduled_maintenance_planned_multiple_services",
            expected_topic_name,
            expected_message,
        )

    def test_freshstatus_scheduled_maintenance_planned_multiple_services_over_limit(self) -> None:
        """
        Tests if freshstatus scheduled maintenance planned multiple services over limit is handled correctly
        """
        expected_topic_name = "Expect some services downtime due to server maintenance"
        expected_message = """
The following scheduled maintenance has been opened: **Expect some services downtime due to server maintenance**
**Description:** As part of the upgrade routine, we will be carrying out server maintenance work for this Service. This work will affect the Service to be unavailable during the maintenance window. We apologize for any inconvenience this may cause. Please do not hesitate to contact our support team at support@example.com if you have any questions regarding this server upgrading exercise.
**Scheduled Start Time:** <time:2021-04-12T17:08:00+00:00>
**Scheduled End Time:** <time:2021-04-12T18:08:00+00:00>
**Affected Services:**
* Sample Service
* Sample Service 2
* Sample Service 3
* Sample Service 4
* Sample Service 5
[and 2 more service(s)]
        """.strip()
        self.check_webhook(
            "freshstatus_scheduled_maintenance_planned_multiple_services_over_limit",
            expected_topic_name,
            expected_message,
        )

    def test_freshstatus_scheduled_maintenance_note_created(self) -> None:
        """
        Tests if freshstatus scheduled maintenance note created is handled correctly
        """
        expected_topic_name = "Scheduled Maintenance Test"
        expected_message = """
The following note has been added to the scheduled maintenance: **Scheduled Maintenance Test**
**Note:** We are about to start the maintenance.
        """.strip()
        self.check_webhook(
            "freshstatus_scheduled_maintenance_note_created", expected_topic_name, expected_message
        )

    def test_freshstatus_scheduled_maintenance_closed(self) -> None:
        """
        Tests if freshstatus scheduled maintenance closed is handled correctly
        """
        expected_topic_name = "Scheduled Maintenance Test"
        expected_message = """
The following scheduled maintenance has been closed: **Scheduled Maintenance Test**
**Note:** The maintenance is now complete.
        """.strip()
        self.check_webhook(
            "freshstatus_scheduled_maintenance_closed", expected_topic_name, expected_message
        )

    def test_freshstatus_test(self) -> None:
        """
        Tests if freshstatus test is handled correctly
        """
        expected_topic_name = "Freshstatus"
        expected_message = "Freshstatus webhook has been successfully configured."
        self.check_webhook("freshstatus_test", expected_topic_name, expected_message)

    def test_freshstatus_event_not_supported(self) -> None:
        """
        Tests if freshstatus event not supported is handled correctly
        """
        expected_topic_name = "Sample title"
        expected_message = "The event (INCIDENT_REOPEN) is not supported yet."
        self.check_webhook("freshstatus_event_not_supported", expected_topic_name, expected_message)

    def test_freshstatus_invalid_payload_with_missing_data(self) -> None:
        """
        Tests if invalid Freshstatus payloads are handled correctly
        """
        self.url = self.build_webhook_url()
        payload = self.get_body("freshstatus_invalid_payload_with_missing_data")
        result = self.client_post(self.url, payload, content_type="application/json")
        self.assert_json_error(result, "Invalid payload")

        expected_message = MISCONFIGURED_PAYLOAD_ERROR_MESSAGE.format(
            bot_name=self.test_user.full_name,
            support_email=FromAddress.SUPPORT,
        ).strip()

        msg = self.get_last_message()
        self.assertEqual(msg.content, expected_message)
        self.assertEqual(msg.recipient.type, Recipient.PERSONAL)
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/freshstatus/view.py
Signals: Django

```python
from datetime import datetime

from django.core.exceptions import ValidationError
from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _

from zerver.actions.message_send import send_rate_limited_pm_notification_to_bot_owner
from zerver.decorator import webhook_view
from zerver.lib.exceptions import JsonableError
from zerver.lib.response import json_success
from zerver.lib.send_email import FromAddress
from zerver.lib.timestamp import datetime_to_global_time
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import check_send_webhook_message, get_setup_webhook_message
from zerver.models import UserProfile

MISCONFIGURED_PAYLOAD_ERROR_MESSAGE = """
Hi there! Your bot {bot_name} just received a Freshstatus payload that is missing
some data that Zulip requires. This usually indicates a configuration issue
in your Freshstatus webhook settings. Please make sure that you provide all the required parameters
when configuring the Freshstatus webhook. Contact {support_email} if you
need further help!
"""

FRESHSTATUS_TOPIC_TEMPLATE = "{title}".strip()
FRESHSTATUS_TOPIC_TEMPLATE_TEST = "Freshstatus"

FRESHSTATUS_MESSAGE_TEMPLATE_INCIDENT_OPEN = """
The following incident has been opened: **{title}**
**Description:** {description}
**Start Time:** {start_time}
**Affected Services:**
{affected_services}
""".strip()

FRESHSTATUS_MESSAGE_TEMPLATE_INCIDENT_CLOSED = """
The following incident has been closed: **{title}**
**Note:** {message}
""".strip()

FRESHSTATUS_MESSAGE_TEMPLATE_INCIDENT_NOTE_CREATED = """
The following note has been added to the incident: **{title}**
**Note:** {message}
""".strip()

FRESHSTATUS_MESSAGE_TEMPLATE_SCHEDULED_MAINTENANCE_PLANNED = """
The following scheduled maintenance has been opened: **{title}**
**Description:** {description}
**Scheduled Start Time:** {scheduled_start_time}
**Scheduled End Time:** {scheduled_end_time}
**Affected Services:**
{affected_services}
""".strip()

FRESHSTATUS_MESSAGE_TEMPLATE_SCHEDULED_MAINTENANCE_CLOSED = """
The following scheduled maintenance has been closed: **{title}**
**Note:** {message}
""".strip()

FRESHSTATUS_MESSAGE_TEMPLATE_SCHEDULED_MAINTENANCE_NOTE_CREATED = """
The following note has been added to the scheduled maintenance: **{title}**
**Note:** {message}
""".strip()

FRESHSTATUS_MESSAGE_EVENT_NOT_SUPPORTED = "The event ({event_type}) is not supported yet."

FRESHSTATUS_SERVICES_ROW_TEMPLATE = "* {service_name}\n"
FRESHSTATUS_SERVICES_OTHERS_ROW_TEMPLATE = "[and {services_number} more service(s)]"
FRESHSTATUS_SERVICES_LIMIT = 5

ALL_EVENT_TYPES = [
    "MAINTENANCE_NOTE_CREATE",
    "INCIDENT_NOTE_CREATE",
    "INCIDENT_OPEN",
    "MAINTENANCE_PLANNED",
    "INCIDENT_REOPEN",
]


def get_global_time(dt_str: str) -> str:
    dt = datetime.fromisoformat(dt_str)
    return datetime_to_global_time(dt)


@webhook_view("Freshstatus", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_freshstatus_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    try:
        body = get_body_for_http_request(payload)
        topic_name = get_topic_for_http_request(payload)
    except ValidationError:
        message = MISCONFIGURED_PAYLOAD_ERROR_MESSAGE.format(
            bot_name=user_profile.full_name,
            support_email=FromAddress.SUPPORT,
        ).strip()
        send_rate_limited_pm_notification_to_bot_owner(user_profile, user_profile.realm, message)

        raise JsonableError(_("Invalid payload"))

    check_send_webhook_message(
        request,
        user_profile,
        topic_name,
        body,
        payload["event_data"]["event_type"].tame(check_string),
    )
    return json_success(request)


def get_services_content(services_data: list[dict[str, str]]) -> str:
    services_content = ""
    for service in services_data[:FRESHSTATUS_SERVICES_LIMIT]:
        services_content += FRESHSTATUS_SERVICES_ROW_TEMPLATE.format(
            service_name=service.get("service_name")
        )

    if len(services_data) > FRESHSTATUS_SERVICES_LIMIT:
        services_content += FRESHSTATUS_SERVICES_OTHERS_ROW_TEMPLATE.format(
            services_number=len(services_data) - FRESHSTATUS_SERVICES_LIMIT,
        )
    return services_content.rstrip()


def get_topic_for_http_request(payload: WildValue) -> str:
    event_data = payload["event_data"]
    if (
        event_data["event_type"].tame(check_string) == "INCIDENT_OPEN"
        and payload["id"].tame(check_string) == "1"
    ):
        return FRESHSTATUS_TOPIC_TEMPLATE_TEST
    else:
        return FRESHSTATUS_TOPIC_TEMPLATE.format(title=payload["title"].tame(check_string))


def get_body_for_maintenance_planned_event(payload: WildValue) -> str:
    services_data = [
        {"service_name": service}
        for service in payload["affected_services"].tame(check_string).split(",")
    ]
    data = {
        "title": payload["title"].tame(check_string),
        "description": payload["description"].tame(check_string),
        "scheduled_start_time": get_global_time(payload["scheduled_start_time"].tame(check_string)),
        "scheduled_end_time": get_global_time(payload["scheduled_end_time"].tame(check_string)),
        "affected_services": get_services_content(services_data),
    }
    return FRESHSTATUS_MESSAGE_TEMPLATE_SCHEDULED_MAINTENANCE_PLANNED.format(**data)


def get_body_for_incident_open_event(payload: WildValue) -> str:
    services_data = [
        {"service_name": service}
        for service in payload["affected_services"].tame(check_string).split(",")
    ]
    data = {
        "title": payload["title"].tame(check_string),
        "description": payload["description"].tame(check_string),
        "start_time": get_global_time(payload["start_time"].tame(check_string)),
        "affected_services": get_services_content(services_data),
    }
    return FRESHSTATUS_MESSAGE_TEMPLATE_INCIDENT_OPEN.format(**data)


def get_body_for_http_request(payload: WildValue) -> str:
    event_data = payload["event_data"]
    event_type = event_data["event_type"].tame(check_string)
    if event_type == "INCIDENT_OPEN" and payload["id"].tame(check_string) == "1":
        return get_setup_webhook_message("Freshstatus")
    elif event_type == "INCIDENT_OPEN":
        return get_body_for_incident_open_event(payload)
    elif event_type == "INCIDENT_NOTE_CREATE":
        incident_status = payload["incident_status"].tame(check_string)
        title = payload["title"].tame(check_string)
        message = payload["message"].tame(check_string)
        if incident_status == "Closed":
            return FRESHSTATUS_MESSAGE_TEMPLATE_INCIDENT_CLOSED.format(title=title, message=message)
        elif incident_status == "Open":
            return FRESHSTATUS_MESSAGE_TEMPLATE_INCIDENT_NOTE_CREATED.format(
                title=title, message=message
            )
    elif event_type == "MAINTENANCE_PLANNED":
        return get_body_for_maintenance_planned_event(payload)
    elif event_type == "MAINTENANCE_NOTE_CREATE":
        title = payload["title"].tame(check_string)
        message = payload["message"].tame(check_string)
        if payload["incident_status"].tame(check_string) == "Closed":
            return FRESHSTATUS_MESSAGE_TEMPLATE_SCHEDULED_MAINTENANCE_CLOSED.format(
                title=title, message=message
            )
        else:
            return FRESHSTATUS_MESSAGE_TEMPLATE_SCHEDULED_MAINTENANCE_NOTE_CREATED.format(
                title=title, message=message
            )

    return FRESHSTATUS_MESSAGE_EVENT_NOT_SUPPORTED.format(event_type=event_type)
```

--------------------------------------------------------------------------------

---[FILE: freshstatus_event_not_supported.json]---
Location: zulip-main/zerver/webhooks/freshstatus/fixtures/freshstatus_event_not_supported.json

```json
{
    "id": "1",
    "title": "Sample title",
    "source": "",
    "end_time": "None",
    "is_private": "False",
    "start_time": "2021-04-12 16:53:00.080999+00:00",
    "description": "Sample description",
    "affected_services": "'service 1','service 2','service 3'",
    "notification_options": "{notification_options}",
    "event_data": {
        "webhook_id": 102,
        "account_id": 25868,
        "account_name": "example",
        "event_id": 1364,
        "event_type": "INCIDENT_REOPEN",
        "event_created_on": "2021-04-12 16:53:00.081344+00:00"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: freshstatus_incident_closed.json]---
Location: zulip-main/zerver/webhooks/freshstatus/fixtures/freshstatus_incident_closed.json

```json
{
    "id": "130594",
    "title": "Degradation of Database Server",
    "status": "",
    "message": "The incident has been resolved.",
    "is_private": "False",
    "incident_id": "53482",
    "incident_status": "Closed",
    "notification_options": {
        "send_tweet": "false",
        "send_email": "false"
    },
    "event_data": {
        "webhook_id": 102,
        "account_id": 25868,
        "account_name": "example",
        "event_id": 1370,
        "event_type": "INCIDENT_NOTE_CREATE",
        "event_created_on": "2021-04-12 16:55:58.663440+00:00"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: freshstatus_incident_note_created.json]---
Location: zulip-main/zerver/webhooks/freshstatus/fixtures/freshstatus_incident_note_created.json

```json
{
    "id": "130594",
    "title": "Degradation of Database Server",
    "status": "",
    "message": "The incident is being worked on.",
    "is_private": "False",
    "incident_id": "53482",
    "incident_status": "Open",
    "notification_options": {
        "send_tweet": "false",
        "send_email": "false"
    },
    "event_data": {
        "webhook_id": 102,
        "account_id": 25868,
        "account_name": "example",
        "event_id": 1370,
        "event_type": "INCIDENT_NOTE_CREATE",
        "event_created_on": "2021-04-12 16:55:58.663440+00:00"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: freshstatus_incident_open.json]---
Location: zulip-main/zerver/webhooks/freshstatus/fixtures/freshstatus_incident_open.json

```json
{
    "id": "53481",
    "title": "Degradation of Database Server",
    "source": "Monitoring System",
    "end_time": "None",
    "is_private": "False",
    "start_time": "2021-04-12 16:29:00+00:00",
    "description": "This issue is being investigated.",
    "affected_services": "Database Server",
    "notification_options": {
        "send_tweet": "false",
        "send_email": "false"
    },
    "status": "Open",
    "event_data": {
        "webhook_id": 102,
        "account_id": 2300,
        "account_name": "example",
        "event_id": 1361,
        "event_type": "INCIDENT_OPEN",
        "event_created_on": "2021-04-12 16:30:43.392582+00:00"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: freshstatus_incident_open_multiple_services.json]---
Location: zulip-main/zerver/webhooks/freshstatus/fixtures/freshstatus_incident_open_multiple_services.json

```json
{
    "id": "53481",
    "title": "Degradation of Multiple Servers",
    "source": "Monitoring System",
    "end_time": "None",
    "is_private": "False",
    "start_time": "2021-04-12 16:29:00+00:00",
    "description": "This issue is being investigated.",
    "affected_services": "Database Server,Web Server,Web Server 2",
    "notification_options": {
        "send_tweet": "false",
        "send_email": "false"
    },
    "status": "Open",
    "event_data": {
        "webhook_id": 102,
        "account_id": 2300,
        "account_name": "example",
        "event_id": 1361,
        "event_type": "INCIDENT_OPEN",
        "event_created_on": "2021-04-12 16:30:43.392582+00:00"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: freshstatus_incident_open_multiple_services_over_limit.json]---
Location: zulip-main/zerver/webhooks/freshstatus/fixtures/freshstatus_incident_open_multiple_services_over_limit.json

```json
{
    "id": "53481",
    "title": "Degradation of Multiple Servers",
    "source": "Monitoring System",
    "end_time": "None",
    "is_private": "False",
    "start_time": "2021-04-12 16:29:00+00:00",
    "description": "This issue is being investigated.",
    "affected_services": "Database Server,Web Server,Web Server 2,Database Server 2,Active Directory Server,Exchange Server,Web Server 3",
    "notification_options": {
        "send_tweet": "false",
        "send_email": "false"
    },
    "status": "Open",
    "event_data": {
        "webhook_id": 102,
        "account_id": 2300,
        "account_name": "example",
        "event_id": 1361,
        "event_type": "INCIDENT_OPEN",
        "event_created_on": "2021-04-12 16:30:43.392582+00:00"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: freshstatus_invalid_payload_with_missing_data.json]---
Location: zulip-main/zerver/webhooks/freshstatus/fixtures/freshstatus_invalid_payload_with_missing_data.json

```json
{
    "id": "130610",
    "status": "",
    "message": "The maintenance is now complete.",
    "is_private": "False",
    "incident_id": "53492",
    "incident_status": "Closed",
    "notification_options": {
        "send_tweet": "false",
        "send_email": "false"
    },
    "event_data": {
        "webhook_id": 102,
        "account_id": 25868,
        "account_name": "adbwebdesigns",
        "event_id": 1379,
        "event_created_on": "2021-04-12 17:09:35.727448+00:00"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: freshstatus_scheduled_maintenance_closed.json]---
Location: zulip-main/zerver/webhooks/freshstatus/fixtures/freshstatus_scheduled_maintenance_closed.json

```json
{
    "id": "130610",
    "title": "Scheduled Maintenance Test",
    "status": "",
    "message": "The maintenance is now complete.",
    "is_private": "False",
    "incident_id": "53492",
    "incident_status": "Closed",
    "notification_options": {
        "send_tweet": "false",
        "send_email": "false"
    },
    "event_data": {
        "webhook_id": 102,
        "account_id": 2300,
        "account_name": "example",
        "event_id": 1379,
        "event_type": "MAINTENANCE_NOTE_CREATE",
        "event_created_on": "2021-04-12 17:09:35.727448+00:00"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: freshstatus_scheduled_maintenance_note_created.json]---
Location: zulip-main/zerver/webhooks/freshstatus/fixtures/freshstatus_scheduled_maintenance_note_created.json

```json
{
    "id": "130632",
    "title": "Scheduled Maintenance Test",
    "status": "",
    "message": "We are about to start the maintenance.",
    "is_private": "False",
    "incident_id": "53490",
    "incident_status": "Planned",
    "notification_options": {
        "send_tweet": "false",
        "send_email": "false"
    },
    "event_data": {
        "webhook_id": 102,
        "account_id": 2300,
        "account_name": "example",
        "event_id": 1380,
        "event_type": "MAINTENANCE_NOTE_CREATE",
        "event_created_on": "2021-04-12 17:36:01.847400+00:00"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: freshstatus_scheduled_maintenance_planned.json]---
Location: zulip-main/zerver/webhooks/freshstatus/fixtures/freshstatus_scheduled_maintenance_planned.json

```json
{
    "id": "53492",
    "title": "Expect some services downtime due to server maintenance",
    "source": "Release",
    "end_time": "2021-04-12 18:08:00+00:00",
    "is_private": "False",
    "start_time": "2021-04-12 17:08:00+00:00",
    "description": "As part of the upgrade routine, we will be carrying out server maintenance work for this Service. This work will affect the Service to be unavailable during the maintenance window. We apologize for any inconvenience this may cause. Please do not hesitate to contact our support team at support@example.com if you have any questions regarding this server upgrading exercise.",
    "affected_services": "Sample Service",
    "scheduled_end_time": "2021-04-12 18:08:00+00:00",
    "notification_options": {
        "email_before_one_hour": "true",
        "email_before_day_hour": "true",
        "email_on_start": "true",
        "email_on_complete": "true",
        "send_tweet": "false",
        "send_email": "false"
    },
    "scheduled_start_time": "2021-04-12 17:08:00+00:00",
    "is_auto_update_status_on_scheduled_end": "True",
    "is_auto_update_status_on_scheduled_start": "True",
    "is_auto_update_component_status_on_scheduled_end": "True",
    "is_auto_update_component_status_on_scheduled_start": "True",
    "status": "Planned",
    "event_data": {
        "webhook_id": 102,
        "account_id": 2300,
        "account_name": "example",
        "event_id": 1376,
        "event_type": "MAINTENANCE_PLANNED",
        "event_created_on": "2021-04-12 17:07:41.131632+00:00"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: freshstatus_scheduled_maintenance_planned_multiple_services.json]---
Location: zulip-main/zerver/webhooks/freshstatus/fixtures/freshstatus_scheduled_maintenance_planned_multiple_services.json

```json
{
    "id": "53492",
    "title": "Expect some services downtime due to server maintenance",
    "source": "Release",
    "end_time": "2021-04-12 18:08:00+00:00",
    "is_private": "False",
    "start_time": "2021-04-12 17:08:00+00:00",
    "description": "As part of the upgrade routine, we will be carrying out server maintenance work for this Service. This work will affect the Service to be unavailable during the maintenance window. We apologize for any inconvenience this may cause. Please do not hesitate to contact our support team at support@example.com if you have any questions regarding this server upgrading exercise.",
    "affected_services": "Sample Service,Sample Service 2",
    "scheduled_end_time": "2021-04-12 18:08:00+00:00",
    "notification_options": {
        "email_before_one_hour": "true",
        "email_before_day_hour": "true",
        "email_on_start": "true",
        "email_on_complete": "true",
        "send_tweet": "false",
        "send_email": "false"
    },
    "scheduled_start_time": "2021-04-12 17:08:00+00:00",
    "is_auto_update_status_on_scheduled_end": "True",
    "is_auto_update_status_on_scheduled_start": "True",
    "is_auto_update_component_status_on_scheduled_end": "True",
    "is_auto_update_component_status_on_scheduled_start": "True",
    "status": "Planned",
    "event_data": {
        "webhook_id": 102,
        "account_id": 2300,
        "account_name": "example",
        "event_id": 1376,
        "event_type": "MAINTENANCE_PLANNED",
        "event_created_on": "2021-04-12 17:07:41.131632+00:00"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: freshstatus_scheduled_maintenance_planned_multiple_services_over_limit.json]---
Location: zulip-main/zerver/webhooks/freshstatus/fixtures/freshstatus_scheduled_maintenance_planned_multiple_services_over_limit.json

```json
{
    "id": "53492",
    "title": "Expect some services downtime due to server maintenance",
    "source": "Release",
    "end_time": "2021-04-12 18:08:00+00:00",
    "is_private": "False",
    "start_time": "2021-04-12 17:08:00+00:00",
    "description": "As part of the upgrade routine, we will be carrying out server maintenance work for this Service. This work will affect the Service to be unavailable during the maintenance window. We apologize for any inconvenience this may cause. Please do not hesitate to contact our support team at support@example.com if you have any questions regarding this server upgrading exercise.",
    "affected_services": "Sample Service,Sample Service 2,Sample Service 3,Sample Service 4,Sample Service 5,Sample Service 6,Sample Service 7",
    "scheduled_end_time": "2021-04-12 18:08:00+00:00",
    "notification_options": {
        "email_before_one_hour": "true",
        "email_before_day_hour": "true",
        "email_on_start": "true",
        "email_on_complete": "true",
        "send_tweet": "false",
        "send_email": "false"
    },
    "scheduled_start_time": "2021-04-12 17:08:00+00:00",
    "is_auto_update_status_on_scheduled_end": "True",
    "is_auto_update_status_on_scheduled_start": "True",
    "is_auto_update_component_status_on_scheduled_end": "True",
    "is_auto_update_component_status_on_scheduled_start": "True",
    "status": "Planned",
    "event_data": {
        "webhook_id": 102,
        "account_id": 2300,
        "account_name": "example",
        "event_id": 1376,
        "event_type": "MAINTENANCE_PLANNED",
        "event_created_on": "2021-04-12 17:07:41.131632+00:00"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: freshstatus_test.json]---
Location: zulip-main/zerver/webhooks/freshstatus/fixtures/freshstatus_test.json

```json
{
    "id": "1",
    "title": "Sample title",
    "source": "",
    "end_time": "None",
    "is_private": "False",
    "start_time": "2021-04-12 16:53:00.080999+00:00",
    "description": "Sample description",
    "affected_services": "'service 1','service 2','service 3'",
    "notification_options": "{notification_options}",
    "event_data": {
        "webhook_id": 102,
        "account_id": 25868,
        "account_name": "example",
        "event_id": 1364,
        "event_type": "INCIDENT_OPEN",
        "event_created_on": "2021-04-12 16:53:00.081344+00:00"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/front/doc.md

```text
# Zulip Front integration

Front lets you manage all of your communication channels in one place,
and helps your team collaborate around every message. Follow these steps
to receive Front notifications without leaving Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to the **Settings** page of your Front organization, and select
   the **App store** tab. Search for the **Webhooks** integration that's
   published by Front, and enable the app.

1. Select the **Rules** tab, and add a new shared rule. Set the **When**
   and **If** conditions you would like to be notified about. Set **Send
   to a Webhook** as the action, and input the URL generated above in
   the **Target Webhook** field. Click **Save**.

1. [Add a new linkifier](/help/add-a-custom-linkifier) in your Zulip
   organization. Set the pattern to `cnv_(?P<id>[0-9a-z]+)` and the URL
   template to `https://app.frontapp.com/open/cnv_{id}`. This step maps
   Front conversations to topics in Zulip.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/front/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

````
