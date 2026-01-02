---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1235
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1235 of 1290)

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

---[FILE: unsupported_v2.json]---
Location: zulip-main/zerver/webhooks/pagerduty/fixtures/unsupported_v2.json

```json
{
    "messages":[
        {
            "event":"incident.unsupported",
            "log_entries":[
                {
                    "id":"R6XNGC35VF6U1TUSVIE2DWXD4Z",
                    "type":"assign_log_entry",
                    "summary":"Assigned to Wiley Jacobson by Laura Haley",
                    "self":"https://api.pagerduty.com/log_entries/R6XNGC35VF6U1TUSVIE2DWXD4Z",
                    "html_url":null,
                    "created_at":"2017-09-26T15:16:05Z",
                    "agent":{
                        "id":"P553OPV",
                        "type":"user_reference",
                        "summary":"Laura Haley",
                        "self":"https://api.pagerduty.com/users/P553OPV",
                        "html_url":"https://webdemo.pagerduty.com/users/P553OPV"
                    },
                    "channel":{
                        "type":"website"
                    },
                    "service":{
                        "id":"PN49J75",
                        "type":"service_reference",
                        "summary":"Production XDB Cluster",
                        "self":"https://api.pagerduty.com/services/PN49J75",
                        "html_url":"https://webdemo.pagerduty.com/services/PN49J75"
                    },
                    "incident":{
                        "id":"PRORDTY",
                        "type":"incident_reference",
                        "summary":"[#33] My new incident",
                        "self":"https://api.pagerduty.com/incidents/PRORDTY",
                        "html_url":"https://webdemo.pagerduty.com/incidents/PRORDTY"
                    },
                    "teams":[
                        {
                            "id":"P4SI59S",
                            "type":"team_reference",
                            "summary":"Engineering",
                            "self":"https://api.pagerduty.com/teams/P4SI59S",
                            "html_url":"https://webdemo.pagerduty.com/teams/P4SI59S"
                        }
                    ],
                    "contexts":[

                    ],
                    "assignees":[
                        {
                            "id":"PFBSJ2Z",
                            "type":"user_reference",
                            "summary":"Wiley Jacobson",
                            "self":"https://api.pagerduty.com/users/PFBSJ2Z",
                            "html_url":"https://webdemo.pagerduty.com/users/PFBSJ2Z"
                        }
                    ]
                }
            ],
            "webhook":{
                "endpoint_url":"https://requestb.in/18ao6fs1",
                "name":"V2 wabhook",
                "description":null,
                "webhook_object":{
                    "id":"PN49J75",
                    "type":"service_reference",
                    "summary":"Production XDB Cluster",
                    "self":"https://api.pagerduty.com/services/PN49J75",
                    "html_url":"https://webdemo.pagerduty.com/services/PN49J75"
                },
                "config":{

                },
                "outbound_integration":{
                    "id":"PJFWPEP",
                    "type":"outbound_integration_reference",
                    "summary":"Generic V2 Webhook",
                    "self":"https://api.pagerduty.com/outbound_integrations/PJFWPEP",
                    "html_url":null
                },
                "accounts_addon":null,
                "id":"PKT9NNX",
                "type":"webhook",
                "summary":"V2 wabhook",
                "self":"https://api.pagerduty.com/webhooks/PKT9NNX",
                "html_url":null
            },
            "incident":{
                "incident_number":33,
                "title":"My new incident",
                "description":"My new incident",
                "created_at":"2017-09-26T15:14:36Z",
                "status":"triggered",
                "pending_actions":[
                    {
                        "type":"resolve",
                        "at":"2017-09-26T19:14:36Z"
                    }
                ],
                "incident_key":null,
                "service":{
                    "id":"PN49J75",
                    "name":"Production XDB Cluster",
                    "description":"This service was created during onboarding on July 5, 2017.",
                    "auto_resolve_timeout":14400,
                    "acknowledgement_timeout":1800,
                    "created_at":"2017-07-05T17:33:09Z",
                    "status":"critical",
                    "last_incident_timestamp":"2017-09-26T15:14:36Z",
                    "teams":[
                        {
                            "id":"P4SI59S",
                            "type":"team_reference",
                            "summary":"Engineering",
                            "self":"https://api.pagerduty.com/teams/P4SI59S",
                            "html_url":"https://webdemo.pagerduty.com/teams/P4SI59S"
                        }
                    ],
                    "incident_urgency_rule":{
                        "type":"constant",
                        "urgency":"high"
                    },
                    "scheduled_actions":[

                    ],
                    "support_hours":null,
                    "escalation_policy":{
                        "id":"PINYWEF",
                        "type":"escalation_policy_reference",
                        "summary":"Default",
                        "self":"https://api.pagerduty.com/escalation_policies/PINYWEF",
                        "html_url":"https://webdemo.pagerduty.com/escalation_policies/PINYWEF"
                    },
                    "addons":[

                    ],
                    "privilege":null,
                    "alert_creation":"create_alerts_and_incidents",
                    "integrations":[
                        {
                            "id":"PUAYF96",
                            "type":"generic_events_api_inbound_integration_reference",
                            "summary":"API",
                            "self":"https://api.pagerduty.com/services/PN49J75/integrations/PUAYF96",
                            "html_url":"https://webdemo.pagerduty.com/services/PN49J75/integrations/PUAYF96"
                        },
                        {
                            "id":"P90GZUH",
                            "type":"generic_email_inbound_integration_reference",
                            "summary":"Email",
                            "self":"https://api.pagerduty.com/services/PN49J75/integrations/P90GZUH",
                            "html_url":"https://webdemo.pagerduty.com/services/PN49J75/integrations/P90GZUH"
                        }
                    ],
                    "metadata":{

                    },
                    "type":"service",
                    "summary":"Production XDB Cluster",
                    "self":"https://api.pagerduty.com/services/PN49J75",
                    "html_url":"https://webdemo.pagerduty.com/services/PN49J75"
                },
                "assignments":[
                    {
                        "at":"2017-09-26T15:16:05Z",
                        "assignee":{
                            "id":"PFBSJ2Z",
                            "type":"user_reference",
                            "summary":"Wiley Jacobson",
                            "self":"https://api.pagerduty.com/users/PFBSJ2Z",
                            "html_url":"https://webdemo.pagerduty.com/users/PFBSJ2Z"
                        }
                    }
                ],
                "acknowledgements":[

                ],
                "last_status_change_at":"2017-09-26T15:16:05Z",
                "last_status_change_by":{
                    "id":"PN49J75",
                    "type":"service_reference",
                    "summary":"Production XDB Cluster",
                    "self":"https://api.pagerduty.com/services/PN49J75",
                    "html_url":"https://webdemo.pagerduty.com/services/PN49J75"
                },
                "first_trigger_log_entry":{
                    "id":"R2XGXEI3W0FHMSDXHDIBQGBQ5E",
                    "type":"trigger_log_entry_reference",
                    "summary":"Triggered through the website",
                    "self":"https://api.pagerduty.com/log_entries/R2XGXEI3W0FHMSDXHDIBQGBQ5E",
                    "html_url":"https://webdemo.pagerduty.com/incidents/PRORDTY/log_entries/R2XGXEI3W0FHMSDXHDIBQGBQ5E"
                },
                "escalation_policy":{
                    "id":"PINYWEF",
                    "type":"escalation_policy_reference",
                    "summary":"Default",
                    "self":"https://api.pagerduty.com/escalation_policies/PINYWEF",
                    "html_url":"https://webdemo.pagerduty.com/escalation_policies/PINYWEF"
                },
                "privilege":null,
                "teams":[
                    {
                        "id":"P4SI59S",
                        "type":"team_reference",
                        "summary":"Engineering",
                        "self":"https://api.pagerduty.com/teams/P4SI59S",
                        "html_url":"https://webdemo.pagerduty.com/teams/P4SI59S"
                    }
                ],
                "alert_counts":{
                    "all":0,
                    "triggered":0,
                    "resolved":0
                },
                "impacted_services":[
                    {
                        "id":"PN49J75",
                        "type":"service_reference",
                        "summary":"Production XDB Cluster",
                        "self":"https://api.pagerduty.com/services/PN49J75",
                        "html_url":"https://webdemo.pagerduty.com/services/PN49J75"
                    }
                ],
                "is_mergeable":true,
                "basic_alert_grouping":null,
                "alert_grouping":null,
                "metadata":{

                },
                "external_references":[
                    {
                        "id":"PLF5V5G",
                        "type":"incident_external_reference",
                        "summary":"Slack",
                        "self":null,
                        "html_url":null,
                        "external_id":"1506438878.000302",
                        "external_url":"http://webdemo.slack.com/archives/C6975FLAZ/p1506438878.000302",
                        "sync":false,
                        "webhook":{
                            "id":"PRXV5AH",
                            "type":"webhook_reference",
                            "summary":"Slack M2M",
                            "self":"https://api.pagerduty.com/webhooks/PRXV5AH",
                            "html_url":null
                        }
                    }
                ],
                "importance":null,
                "incidents_responders":[

                ],
                "responder_requests":[

                ],
                "subscriber_requests":[

                ],
                "urgency":"high",
                "id":"PRORDTY",
                "type":"incident",
                "summary":"[#33] My new incident",
                "self":"https://api.pagerduty.com/incidents/PRORDTY",
                "html_url":"https://webdemo.pagerduty.com/incidents/PRORDTY",
                "alerts":[
                    {
                        "alert_key":"c24117fc42e44b44b4d6876190583378"
                    },
                    {
                        "alert_key":"2d6ee0a6b58040f7996a4047ae5edcd7"
                    }
                ]
            },
            "id":"9e7850d0-a2cd-11e7-8f69-22000affca53",
            "created_on":"2017-09-26T15:16:05Z"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: unsupported_v3.json]---
Location: zulip-main/zerver/webhooks/pagerduty/fixtures/unsupported_v3.json

```json
{
  "event": {
    "id": "01BZY282OVDQMFPDC3VB98DR1L",
    "event_type": "incident.unsupported",
    "resource_type": "incident",
    "occurred_at": "2021-06-04T10:17:54.838Z",
    "agent": {
      "html_url": "https://pig208.pagerduty.com/users/PJ0LVEB",
      "id": "PJ0LVEB",
      "self": "https://api.pagerduty.com/users/PJ0LVEB",
      "summary": "PIG 208",
      "type": "user_reference"
    },
    "client": null,
    "data": {
      "id": "PIQUG8X",
      "type": "incident",
      "self": "https://api.pagerduty.com/incidents/PIQUG8X",
      "html_url": "https://pig208.pagerduty.com/incidents/PIQUG8X",
      "number": 3,
      "status": "triggered",
      "title": "Test Incident",
      "service": {
        "html_url": "https://pig208.pagerduty.com/services/PA2P440",
        "id": "PA2P440",
        "self": "https://api.pagerduty.com/services/PA2P440",
        "summary": "pig208",
        "type": "service_reference"
      },
      "assignees": [
        {
          "html_url": "https://pig208.pagerduty.com/users/PI9DT01",
          "id": "PI9DT01",
          "self": "https://api.pagerduty.com/users/PI9DT01",
          "summary": "Test User",
          "type": "user_reference"
        }
      ],
      "escalation_policy": {
        "html_url": "https://pig208.pagerduty.com/escalation_policies/PY82TC6",
        "id": "PY82TC6",
        "self": "https://api.pagerduty.com/escalation_policies/PY82TC6",
        "summary": "Default",
        "type": "escalation_policy_reference"
      },
      "teams": [],
      "priority": null,
      "urgency": "high",
      "conference_bridge": null,
      "resolve_reason": null
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/papertrail/doc.md

```text
# Zulip Papertrail integration

Get Zulip notifications for your Papertrail logs!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. On your Papertrail dashboard, search for the logs you'd like to set
   up alerts for, and click on **Save Search**.

1. Provide a name for the search, and click **Save & Setup an Alert**.

1. Under **Create an alert**, click on **Webhook**.

1. Select options under **Alert Conditions** as appropriate. Set **URL**
   to the URL generated above, and click **Create Alert**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/papertrail/001.png)

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/papertrail/tests.py

```python
from urllib.parse import urlencode

from typing_extensions import override

from zerver.lib.test_classes import WebhookTestCase


class PapertrailHookTests(WebhookTestCase):
    CHANNEL_NAME = "papertrail"
    URL_TEMPLATE = "/api/v1/external/papertrail?&api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "papertrail"

    def test_short_message(self) -> None:
        expected_topic_name = "logs"
        expected_message = """
[Search for "Important stuff"](https://papertrailapp.com/searches/42) found **2** matches:

<time:2011-05-18T20:30:02-07:00> - abc - cron OR server1:
``` quote
message body
```
<time:2011-05-18T20:30:02-07:00> - server1 - cron OR server1:
``` quote
A short event
```
""".strip()

        self.check_webhook(
            "short_post",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_long_message(self) -> None:
        expected_topic = "logs"
        expected_message = """
[Search for "Important stuff"](https://papertrailapp.com/searches/42) found **5** matches:

<time:2011-05-18T20:30:02-07:00> - abc - cron OR server1:
``` quote
message body 1
```
<time:2011-05-18T20:30:02-07:00> - abc - cron OR server1:
``` quote
message body 2
```
<time:2011-05-18T20:30:02-07:00> - abc - cron OR server1:
``` quote
message body 3
```
<time:2011-05-18T20:30:02-07:00> - abc - cron OR server1:
``` quote
message body 4
```
[See more](https://papertrailapp.com/searches/42)
""".strip()

        self.check_webhook(
            "long_post",
            expected_topic,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_incorrect_message(self) -> None:
        with self.assertRaises(AssertionError) as e:
            self.check_webhook(
                "incorrect_post", "", "", content_type="application/x-www-form-urlencoded"
            )

        self.assertIn("Events key is missing from payload", e.exception.args[0])

    @override
    def get_body(self, fixture_name: str) -> str:
        # Papertrail webhook sends a POST request with payload parameter
        # containing the JSON body. Documented here:
        # https://help.papertrailapp.com/kb/how-it-works/web-hooks#encoding
        body = self.webhook_fixture_data("papertrail", fixture_name, file_type="json")
        return urlencode({"payload": body})
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/papertrail/view.py
Signals: Django, Pydantic

```python
from datetime import datetime

from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _
from pydantic import Json

from zerver.decorator import webhook_view
from zerver.lib.exceptions import JsonableError
from zerver.lib.response import json_success
from zerver.lib.timestamp import datetime_to_global_time
from zerver.lib.typed_endpoint import typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

MATCHES_TEMPLATE = '[Search for "{name}"]({url}) found **{number}** matches:\n'
SEARCH_TEMPLATE = """
{timestamp} - {source} - {query}:
``` quote
{message}
```
""".strip()


@webhook_view("Papertrail")
@typed_endpoint
def api_papertrail_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: Json[WildValue],
) -> HttpResponse:
    if "events" not in payload:
        raise JsonableError(_("Events key is missing from payload"))

    matches = MATCHES_TEMPLATE.format(
        name=payload["saved_search"]["name"].tame(check_string),
        url=payload["saved_search"]["html_search_url"].tame(check_string),
        number=str(len(payload["events"])),
    )
    message = [matches]

    for i, event in enumerate(payload["events"]):
        event_text = SEARCH_TEMPLATE.format(
            timestamp=datetime_to_global_time(
                datetime.fromisoformat(event["received_at"].tame(check_string))
            ),
            source=event["source_name"].tame(check_string),
            query=payload["saved_search"]["query"].tame(check_string),
            message=event["message"].tame(check_string),
        )

        message.append(event_text)

        if i >= 3:
            message.append(
                "[See more]({})".format(
                    payload["saved_search"]["html_search_url"].tame(check_string)
                )
            )
            break

    post = "\n".join(message)
    topic_name = "logs"

    check_send_webhook_message(request, user_profile, topic_name, post)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: incorrect_post.json]---
Location: zulip-main/zerver/webhooks/papertrail/fixtures/incorrect_post.json

```json
{
  "saved_search": {
    "id": 42,
    "name": "Important stuff",
    "query": "cron OR server1",
    "html_edit_url": "https://papertrailapp.com/searches/42/edit",
    "html_search_url": "https://papertrailapp.com/searches/42"
  },
  "max_id": 7711582041804800,
  "min_id": 7711561783320576
}
```

--------------------------------------------------------------------------------

---[FILE: long_post.json]---
Location: zulip-main/zerver/webhooks/papertrail/fixtures/long_post.json

```json
{
  "events": [
    {
      "id": 7711561783320576,
      "received_at": "2011-05-18T20:30:02-07:00",
      "display_received_at": "May 18 20:30:02",
      "source_ip": "208.75.57.121",
      "source_name": "abc",
      "source_id": 2,
      "hostname": "abc",
      "program": "CROND",
      "severity": "Info",
      "facility": "Cron",
      "message": "message body 1"
    },
    {
      "id": 7711561783320576,
      "received_at": "2011-05-18T20:30:02-07:00",
      "display_received_at": "May 18 20:30:02",
      "source_ip": "208.75.57.121",
      "source_name": "abc",
      "source_id": 2,
      "hostname": "abc",
      "program": "CROND",
      "severity": "Info",
      "facility": "Cron",
      "message": "message body 2"
    },
    {
      "id": 7711561783320576,
      "received_at": "2011-05-18T20:30:02-07:00",
      "display_received_at": "May 18 20:30:02",
      "source_ip": "208.75.57.121",
      "source_name": "abc",
      "source_id": 2,
      "hostname": "abc",
      "program": "CROND",
      "severity": "Info",
      "facility": "Cron",
      "message": "message body 3"
    },
    {
      "id": 7711561783320576,
      "received_at": "2011-05-18T20:30:02-07:00",
      "display_received_at": "May 18 20:30:02",
      "source_ip": "208.75.57.121",
      "source_name": "abc",
      "source_id": 2,
      "hostname": "abc",
      "program": "CROND",
      "severity": "Info",
      "facility": "Cron",
      "message": "message body 4"
    },
    {
      "id": 7711562567655424,
      "received_at": "2011-05-18T20:30:02-07:00",
      "display_received_at": "May 18 20:30:02",
      "source_ip": "208.75.57.120",
      "source_name": "server1",
      "source_id": 19,
      "hostname": "def",
      "program": "CROND",
      "severity": "Info",
      "facility": "Cron",
      "message": "A short event"
    }
  ],
  "saved_search": {
    "id": 42,
    "name": "Important stuff",
    "query": "cron OR server1",
    "html_edit_url": "https://papertrailapp.com/searches/42/edit",
    "html_search_url": "https://papertrailapp.com/searches/42"
  },
  "max_id": 7711582041804800,
  "min_id": 7711561783320576
}
```

--------------------------------------------------------------------------------

---[FILE: short_post.json]---
Location: zulip-main/zerver/webhooks/papertrail/fixtures/short_post.json

```json
{
  "events": [
    {
      "id": 7711561783320576,
      "received_at": "2011-05-18T20:30:02-07:00",
      "display_received_at": "May 18 20:30:02",
      "source_ip": "208.75.57.121",
      "source_name": "abc",
      "source_id": 2,
      "hostname": "abc",
      "program": "CROND",
      "severity": "Info",
      "facility": "Cron",
      "message": "message body"
    },
    {
      "id": 7711562567655424,
      "received_at": "2011-05-18T20:30:02-07:00",
      "display_received_at": "May 18 20:30:02",
      "source_ip": "208.75.57.120",
      "source_name": "server1",
      "source_id": 19,
      "hostname": "def",
      "program": "CROND",
      "severity": "Info",
      "facility": "Cron",
      "message": "A short event"
    }
  ],
  "saved_search": {
    "id": 42,
    "name": "Important stuff",
    "query": "cron OR server1",
    "html_edit_url": "https://papertrailapp.com/searches/42/edit",
    "html_search_url": "https://papertrailapp.com/searches/42"
  },
  "max_id": 7711582041804800,
  "min_id": 7711561783320576
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/patreon/doc.md

```text
# Zulip Patreon integration

Get Patreon notifications in Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Login to your Patreon developer account, navigate to your Patreon
   Portal, and click on **My Webhooks**

1. Paste the URL generated above in the webhook URL field, and click the
   **plus** (**+**) button. Enable the [events](#filtering-incoming-events)
   you would like to receive notifications for, and click **Send Test**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/patreon/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

- [Patreon webhook events](https://docs.patreon.com/#webhooks)

- [Patreon webhook triggers](https://docs.patreon.com/#triggers-v2)

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/patreon/tests.py

```python
from unittest.mock import patch

import orjson

from zerver.lib.test_classes import WebhookTestCase

EXPECTED_TOPIC = "membership notifications"
IGNORED_EVENTS = [
    "pledges:create",
    "pledges:update",
    "pledges:delete",
]


class PatreonHookTests(WebhookTestCase):
    CHANNEL_NAME = "Patreon"
    URL_TEMPLATE = "/api/v1/external/patreon?&api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "patreon"

    def test_patreon_members_create(self) -> None:
        expected_message = "Kopi has joined as a member!"
        self.check_webhook(
            "members_create",
            EXPECTED_TOPIC,
            expected_message,
        )

    def test_patreon_members_update(self) -> None:
        expected_message = "Kopi's membership has been updated to active patron."
        self.check_webhook(
            "members_update",
            EXPECTED_TOPIC,
            expected_message,
        )

    def test_patreon_members_delete(self) -> None:
        expected_message = "Kopi's membership has ended."
        self.check_webhook(
            "members_delete",
            EXPECTED_TOPIC,
            expected_message,
        )

    def test_patreon_members_pledge_create(self) -> None:
        expected_message = "Kopi has pledged $5.00 per month. :tada:\nTotal number of patrons: 5"
        self.check_webhook(
            "members_pledge_create",
            EXPECTED_TOPIC,
            expected_message,
        )

    def test_patreon_members_pledge_update(self) -> None:
        expected_message = "Kopi has updated their pledge to $10.00 per month. :gear:"
        self.check_webhook(
            "members_pledge_update",
            EXPECTED_TOPIC,
            expected_message,
        )

    def test_patreon_members_pledge_delete(self) -> None:
        expected_message = (
            "Kopi's pledge has been cancelled. :cross_mark:\nTotal number of patrons: 4"
        )
        self.check_webhook(
            "members_pledge_delete",
            EXPECTED_TOPIC,
            expected_message,
        )

    def test_ignored_events(self) -> None:
        # The payload for these events never gets looked at in the
        # webhook itself; it only needs to be valid JSON.
        payload = "{}"

        for event in IGNORED_EVENTS:
            self.verify_post_is_ignored(payload, event)

    def test_ignored_payloads(self) -> None:
        payload = orjson.loads(self.get_body("members_create"))
        payload["data"]["attributes"]["last_charge_status"] = "Declined"
        payload["data"]["attributes"]["patron_status"] = "declined_patron"

        event_types = [
            "members:create",
            "members:update",
            "members:delete",
            "members:pledge:create",
            "members:pledge:update",
            "members:pledge:delete",
        ]

        for event in event_types:
            self.verify_post_is_ignored(orjson.dumps(payload).decode(), event)

    def verify_post_is_ignored(self, payload: str, http_x_patreon_event: str) -> None:
        with patch("zerver.webhooks.patreon.view.check_send_webhook_message") as m:
            result = self.client_post(
                self.url,
                payload,
                HTTP_X_PATREON_EVENT=http_x_patreon_event,
                content_type="application/json",
            )
        if http_x_patreon_event in IGNORED_EVENTS:
            self.assertFalse(m.called)
        self.assert_json_success(result)
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/patreon/view.py
Signals: Django

```python
from collections.abc import Callable

from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.exceptions import UnsupportedWebhookEventTypeError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_int, check_none_or, check_string
from zerver.lib.webhooks.common import (
    check_send_webhook_message,
    validate_extract_webhook_http_header,
)
from zerver.models import UserProfile


# The events for this integration contain the ":" character, which is not appropriate in a
# filename and requires us to deviate from the common `get_http_headers_from_filename` method
# from zerver.lib.webhooks.common.
def get_custom_http_headers_from_filename(http_header_key: str) -> Callable[[str], dict[str, str]]:
    def fixture_to_headers(filename: str) -> dict[str, str]:
        event_type = filename.replace("_", ":")
        return {http_header_key: event_type}

    return fixture_to_headers


fixture_to_headers = get_custom_http_headers_from_filename("HTTP_X_PATREON_EVENT")


def get_members_create_body(payload: WildValue) -> str | None:
    last_charge_status = get_last_charge_status(payload)
    patron_status = get_patron_status(payload)
    # null values indicate the member has never pledged
    if last_charge_status is None and patron_status is None:
        template = "{user_name} has joined as a member!"
        return template.format(
            user_name=get_user_name(payload),
        ).rstrip()
    return None


def get_members_update_body(payload: WildValue) -> str | None:
    last_charge_status = get_last_charge_status(payload)
    patron_status = get_patron_status(payload)
    if last_charge_status in ("Paid", None) and patron_status in ("active_patron", "former_patron"):
        template = "{user_name}'s membership has been updated to {patron_status}."
        return template.format(
            user_name=get_user_name(payload),
            patron_status=str(patron_status).replace("_", " "),
        ).rstrip()
    return None


def get_members_delete_body(payload: WildValue) -> str | None:
    last_charge_status = get_last_charge_status(payload)
    patron_status = get_patron_status(payload)
    # null value indicates the member has never pledged
    if last_charge_status in ("Paid", None) and patron_status != "declined_patron":
        template = "{user_name}'s membership has ended."
        return template.format(
            user_name=get_user_name(payload),
        ).rstrip()
    return None


def get_members_pledge_create_body(payload: WildValue) -> str | None:
    last_charge_status = get_last_charge_status(payload)
    pledge_amount = get_pledge_amount(payload)
    # The only successful charge status is "Paid". null if not yet charged.
    if last_charge_status in ("Paid", None) and pledge_amount > 0:
        template = "{user_name} has pledged ${pledge_amount:.2f} per {pay_per_name}. :tada:\nTotal number of patrons: {patron_count}"
        return template.format(
            user_name=get_user_name(payload),
            pledge_amount=pledge_amount,
            pay_per_name=get_pay_per_name(payload),
            patron_count=get_patron_count(payload),
        ).rstrip()
    return None


def get_members_pledge_update_body(payload: WildValue) -> str | None:
    last_charge_status = get_last_charge_status(payload)
    pledge_amount = get_pledge_amount(payload)
    # The only successful charge status is "Paid". null if not yet charged.
    if last_charge_status in ("Paid", None) and pledge_amount > 0:
        template = "{user_name} has updated their pledge to ${pledge_amount:.2f} per {pay_per_name}. :gear:"
        return template.format(
            user_name=get_user_name(payload),
            pledge_amount=pledge_amount,
            pay_per_name=get_pay_per_name(payload),
        ).rstrip()
    return None


def get_members_pledge_delete_body(payload: WildValue) -> str | None:
    last_charge_status = get_last_charge_status(payload)
    if last_charge_status in ("Paid", "Deleted", None):
        template = "{user_name}'s pledge has been cancelled. :cross_mark:\nTotal number of patrons: {patron_count}"
        return template.format(
            user_name=get_user_name(payload),
            patron_count=get_patron_count(payload),
        ).rstrip()
    return None


def get_last_charge_status(payload: WildValue) -> str | None:
    return payload["data"]["attributes"]["last_charge_status"].tame(check_none_or(check_string))


def get_patron_status(payload: WildValue) -> str | None:
    return payload["data"]["attributes"]["patron_status"].tame(check_none_or(check_string))


def get_user_name(payload: WildValue) -> str:
    return payload["data"]["attributes"]["full_name"].tame(check_string)


def get_pledge_amount(payload: WildValue) -> float:
    return payload["data"]["attributes"]["currently_entitled_amount_cents"].tame(check_int) / 100


def get_patron_count(payload: WildValue) -> int:
    return payload["included"][0]["attributes"]["patron_count"].tame(check_int)


def get_pay_per_name(payload: WildValue) -> str:
    return payload["included"][0]["attributes"]["pay_per_name"].tame(check_string)


EVENT_FUNCTION_MAPPER: dict[str, Callable[[WildValue], str | None]] = {
    "members:create": get_members_create_body,
    "members:update": get_members_update_body,
    "members:delete": get_members_delete_body,
    "members:pledge:create": get_members_pledge_create_body,
    "members:pledge:update": get_members_pledge_update_body,
    "members:pledge:delete": get_members_pledge_delete_body,
}

# deprecated events
IGNORED_EVENTS = [
    "pledges:create",
    "pledges:update",
    "pledges:delete",
]

ALL_EVENT_TYPES = list(EVENT_FUNCTION_MAPPER.keys())


@webhook_view("Patreon", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_patreon_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    header_event = validate_extract_webhook_http_header(request, "X-Patreon-Event", "Patreon")

    event_name = get_zulip_event_name(header_event, payload)
    if event_name is None:
        # See IGNORED_EVENTS.
        return json_success(request)
    topic = "membership notifications"

    body_function = EVENT_FUNCTION_MAPPER[event_name]
    body = body_function(payload)

    if body is None:
        # None for payloads that are valid,
        # but where we intentionally do not send a message.
        return json_success(request)

    check_send_webhook_message(request, user_profile, topic, body, event_name)
    return json_success(request)


def get_zulip_event_name(
    header_event: str,
    payload: WildValue,
) -> str | None:
    """
    Usually, we return an event name that is a key in EVENT_FUNCTION_MAPPER.
    We return None for an event that we know we don't want to handle.
    """
    if header_event in EVENT_FUNCTION_MAPPER:
        return header_event
    elif header_event in IGNORED_EVENTS:
        return None
    raise UnsupportedWebhookEventTypeError(header_event)
```

--------------------------------------------------------------------------------

---[FILE: members_create.json]---
Location: zulip-main/zerver/webhooks/patreon/fixtures/members_create.json

```json
{
    "data": {
      "attributes": {
        "campaign_lifetime_support_cents": 0,
        "currently_entitled_amount_cents": 0,
        "email": "kopi@pangea.com",
        "full_name": "Kopi",
        "is_follower": false,
        "is_free_trial": false,
        "last_charge_date": null,
        "last_charge_status": null,
        "lifetime_support_cents": 0,
        "next_charge_date": null,
        "note": "",
        "patron_status": null,
        "pledge_cadence": null,
        "pledge_relationship_start": "2023-12-29T02:59:46.036+00:00",
        "will_pay_amount_cents": 0
      },
      "id": "38c264ba-0612-4bb9-bc33-f9755cc68bb0",
      "relationships": {
        "address": {
          "data": null
        },
        "campaign": {
          "data": {
            "id": "11539233",
            "type": "campaign"
          },
          "links": {
            "related": "https://www.patreon.com/api/oauth2/v2/campaigns/11539233"
          }
        },
        "currently_entitled_tiers": {
          "data": []
        },
        "user": {
          "data": {
            "id": "111836593",
            "type": "user"
          },
          "links": {
            "related": "https://www.patreon.com/api/oauth2/v2/user/111836593"
          }
        }
      },
      "type": "member"
    },
    "included": [
      {
        "attributes": {
          "created_at": "2023-12-29T01:11:16.000+00:00",
          "creation_name": "",
          "discord_server_id": null,
          "google_analytics_id": null,
          "has_rss": false,
          "has_sent_rss_notify": false,
          "image_small_url": "https://c10.patreonusercontent.com/4/patreon-media/p/campaign/11539233/e1a083b0bf3a44d399523f2f08e59d9c/eyJ3IjoxOTIwLCJ3ZSI6MX0%3D/1.png?token-time=1704326400&token-hash=Qb6nRUM96w1o5QgxEpHevoF7TZ5LjFVPAxpQBOLKHas%3D",
          "image_url": "https://c10.patreonusercontent.com/4/patreon-media/p/campaign/11539233/e1a083b0bf3a44d399523f2f08e59d9c/eyJ3IjoxOTIwLCJ3ZSI6MX0%3D/1.png?token-time=1704326400&token-hash=Qb6nRUM96w1o5QgxEpHevoF7TZ5LjFVPAxpQBOLKHas%3D",
          "is_charged_immediately": true,
          "is_monthly": true,
          "is_nsfw": false,
          "main_video_embed": null,
          "main_video_url": null,
          "one_liner": null,
          "patron_count": 0,
          "pay_per_name": "month",
          "pledge_url": "/checkout/11539233",
          "published_at": "2023-12-29T01:29:54.000+00:00",
          "rss_artwork_url": null,
          "rss_feed_title": null,
          "summary": null,
          "thanks_embed": null,
          "thanks_msg": null,
          "thanks_video_url": null,
          "url": "https://www.patreon.com/user?u=111828554",
          "vanity": null
        },
        "id": "11539233",
        "type": "campaign"
      },
      {
        "attributes": {
          "about": null,
          "created": "2023-12-29T02:38:24.000+00:00",
          "first_name": "Kopi",
          "full_name": "Kopi",
          "hide_pledges": true,
          "image_url": "https://c10.patreonusercontent.com/4/patreon-media/p/user/111836593/7e238b05a88548e2ac1afed4e0f95b74/eyJ3IjoyMDB9/1.png?token-time=2145916800&token-hash=NI0mVHbv2rxc8cQ1qGsRCOFHPbHe4Le_0L1OLKZJsYo%3D",
          "is_creator": false,
          "last_name": "",
          "like_count": 0,
          "thumb_url": "https://c10.patreonusercontent.com/4/patreon-media/p/user/111836593/7e238b05a88548e2ac1afed4e0f95b74/eyJ3IjoyMDB9/1.png?token-time=2145916800&token-hash=NI0mVHbv2rxc8cQ1qGsRCOFHPbHe4Le_0L1OLKZJsYo%3D",
          "url": "https://www.patreon.com/user?u=111836593",
          "vanity": null
        },
        "id": "111836593",
        "type": "user"
      }
    ],
    "links": {
      "self": "https://www.patreon.com/api/oauth2/v2/members/38c264ba-0612-4bb9-bc33-f9755cc68bb0"
    }
}
```

--------------------------------------------------------------------------------

````
