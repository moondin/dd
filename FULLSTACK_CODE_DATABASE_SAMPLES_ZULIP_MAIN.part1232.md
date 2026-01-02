---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1232
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1232 of 1290)

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
Location: zulip-main/zerver/webhooks/pagerduty/view.py
Signals: Django

```python
from email.headerregistry import Address
from typing import TypeAlias

from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.exceptions import UnsupportedWebhookEventTypeError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_int, check_none_or, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

FormatDictType: TypeAlias = dict[str, str | int]

PAGER_DUTY_EVENT_NAMES = {
    "incident.trigger": "triggered",
    "incident.acknowledge": "acknowledged",
    "incident.unacknowledge": "unacknowledged",
    "incident.resolve": "resolved",
    "incident.assign": "assigned",
    "incident.escalate": "escalated",
    "incident.delegate": "delineated",
}

PAGER_DUTY_EVENT_NAMES_V2 = {
    "incident.trigger": "triggered",
    "incident.acknowledge": "acknowledged",
    "incident.resolve": "resolved",
    "incident.assign": "assigned",
}

PAGER_DUTY_EVENT_NAMES_V3 = {
    "incident.triggered": "triggered",
    "incident.acknowledged": "acknowledged",
    "incident.unacknowledged": "unacknowledged",
    "incident.resolved": "resolved",
    "incident.reassigned": "reassigned",
}

ALL_EVENT_TYPES = [
    "resolved",
    "assigned",
    "unacknowledged",
    "acknowledged",
    "triggered",
    "reassigned",
]

AGENT_TEMPLATE = "[{username}]({url})"

INCIDENT_WITH_SERVICE_AND_ASSIGNEE = (
    "Incident [{incident_num_title}]({incident_url}) {action} by [{service_name}]"
    "({service_url}) (assigned to {assignee_info}).\n\n{trigger_message}"
)

TRIGGER_MESSAGE = "``` quote\n{message}\n```"

NUM_TITLE = "{incident_title} (#{incident_num})"

INCIDENT_WITH_ASSIGNEE = """
Incident [{incident_num_title}]({incident_url}) {action} by {assignee_info}.

{trigger_message}
""".strip()

INCIDENT_ASSIGNED = """
Incident [{incident_num_title}]({incident_url}) {action} to {assignee_info}.

{trigger_message}
""".strip()

INCIDENT_RESOLVED_WITH_AGENT = """
Incident [{incident_num_title}]({incident_url}) resolved by {agent_info}.

{trigger_message}
""".strip()

INCIDENT_RESOLVED = """
Incident [{incident_num_title}]({incident_url}) resolved.

{trigger_message}
""".strip()


def build_pagerduty_formatdict(message: WildValue) -> FormatDictType:
    format_dict: FormatDictType = {}
    format_dict["action"] = PAGER_DUTY_EVENT_NAMES[message["type"].tame(check_string)]

    format_dict["incident_id"] = message["data"]["incident"]["id"].tame(check_string)
    format_dict["incident_num_title"] = message["data"]["incident"]["incident_number"].tame(
        check_int
    )
    format_dict["incident_url"] = message["data"]["incident"]["html_url"].tame(check_string)

    format_dict["service_name"] = message["data"]["incident"]["service"]["name"].tame(check_string)
    format_dict["service_url"] = message["data"]["incident"]["service"]["html_url"].tame(
        check_string
    )

    if message["data"]["incident"].get("assigned_to_user"):
        assigned_to_user = message["data"]["incident"]["assigned_to_user"]
        format_dict["assignee_info"] = AGENT_TEMPLATE.format(
            username=Address(addr_spec=assigned_to_user["email"].tame(check_string)).username,
            url=assigned_to_user["html_url"].tame(check_string),
        )
    else:
        format_dict["assignee_info"] = "nobody"

    if message["data"]["incident"].get("resolved_by_user"):
        resolved_by_user = message["data"]["incident"]["resolved_by_user"]
        format_dict["agent_info"] = AGENT_TEMPLATE.format(
            username=Address(addr_spec=resolved_by_user["email"].tame(check_string)).username,
            url=resolved_by_user["html_url"].tame(check_string),
        )

    trigger_message = []
    trigger_summary_data = message["data"]["incident"].get("trigger_summary_data")
    if trigger_summary_data:
        trigger_subject = trigger_summary_data.get("subject", "").tame(check_string)
        if trigger_subject:
            trigger_message.append(trigger_subject)

        trigger_description = trigger_summary_data.get("description", "").tame(check_string)
        if trigger_description:
            trigger_message.append(trigger_description)

    format_dict["trigger_message"] = TRIGGER_MESSAGE.format(message="\n".join(trigger_message))
    return format_dict


def build_pagerduty_formatdict_v2(message: WildValue) -> FormatDictType:
    format_dict: FormatDictType = {}
    format_dict["action"] = PAGER_DUTY_EVENT_NAMES_V2[message["event"].tame(check_string)]

    format_dict["incident_id"] = message["incident"]["id"].tame(check_string)
    format_dict["incident_num_title"] = message["incident"]["incident_number"].tame(check_int)
    format_dict["incident_url"] = message["incident"]["html_url"].tame(check_string)

    format_dict["service_name"] = message["incident"]["service"]["name"].tame(check_string)
    format_dict["service_url"] = message["incident"]["service"]["html_url"].tame(check_string)

    assignments = message["incident"]["assignments"]
    if assignments:
        assignee = assignments[0]["assignee"]
        format_dict["assignee_info"] = AGENT_TEMPLATE.format(
            username=assignee["summary"].tame(check_string),
            url=assignee["html_url"].tame(check_string),
        )
    else:
        format_dict["assignee_info"] = "nobody"

    last_status_change_by = message["incident"].get("last_status_change_by")
    if last_status_change_by is not None:
        format_dict["agent_info"] = AGENT_TEMPLATE.format(
            username=last_status_change_by["summary"].tame(check_string),
            url=last_status_change_by["html_url"].tame(check_string),
        )

    trigger_description = message["incident"].get("description").tame(check_none_or(check_string))
    if trigger_description is not None:
        format_dict["trigger_message"] = TRIGGER_MESSAGE.format(message=trigger_description)
    return format_dict


def build_pagerduty_formatdict_v3(event: WildValue) -> FormatDictType:
    format_dict: FormatDictType = {}
    format_dict["action"] = PAGER_DUTY_EVENT_NAMES_V3[event["event_type"].tame(check_string)]

    format_dict["incident_id"] = event["data"]["id"].tame(check_string)
    format_dict["incident_url"] = event["data"]["html_url"].tame(check_string)
    format_dict["incident_num_title"] = NUM_TITLE.format(
        incident_num=event["data"]["number"].tame(check_int),
        incident_title=event["data"]["title"].tame(check_string),
    )

    format_dict["service_name"] = event["data"]["service"]["summary"].tame(check_string)
    format_dict["service_url"] = event["data"]["service"]["html_url"].tame(check_string)

    assignees = event["data"]["assignees"]
    if assignees:
        assignee = assignees[0]
        format_dict["assignee_info"] = AGENT_TEMPLATE.format(
            username=assignee["summary"].tame(check_string),
            url=assignee["html_url"].tame(check_string),
        )
    else:
        format_dict["assignee_info"] = "nobody"

    agent = event.get("agent")
    if agent is not None:
        format_dict["agent_info"] = AGENT_TEMPLATE.format(
            username=agent["summary"].tame(check_string),
            url=agent["html_url"].tame(check_string),
        )

    # V3 doesn't have trigger_message
    format_dict["trigger_message"] = ""

    return format_dict


def send_formatted_pagerduty(
    request: HttpRequest,
    user_profile: UserProfile,
    message_type: str,
    format_dict: FormatDictType,
) -> None:
    if message_type in (
        "incident.trigger",
        "incident.triggered",
        "incident.unacknowledge",
        "incident.unacknowledged",
    ):
        template = INCIDENT_WITH_SERVICE_AND_ASSIGNEE
    elif message_type in ("incident.resolve", "incident.resolved"):
        if "agent_info" in format_dict:
            template = INCIDENT_RESOLVED_WITH_AGENT
        else:
            template = INCIDENT_RESOLVED
    elif message_type in ("incident.assign", "incident.reassigned"):
        template = INCIDENT_ASSIGNED
    else:
        template = INCIDENT_WITH_ASSIGNEE

    topic_name = "Incident {incident_num_title}".format(**format_dict)
    body = template.format(**format_dict)
    assert isinstance(format_dict["action"], str)
    check_send_webhook_message(request, user_profile, topic_name, body, format_dict["action"])


@webhook_view("PagerDuty", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_pagerduty_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    messages = payload.get("messages")
    if messages:
        for message in messages:
            message_type = message.get("type").tame(check_none_or(check_string))

            # If the message has no "type" key, then this payload came from a
            # Pagerduty Webhook V2.
            if message_type is None:
                break

            if message_type not in PAGER_DUTY_EVENT_NAMES:
                raise UnsupportedWebhookEventTypeError(message_type)

            format_dict = build_pagerduty_formatdict(message)
            send_formatted_pagerduty(request, user_profile, message_type, format_dict)

        for message in messages:
            message_event = message.get("event").tame(check_none_or(check_string))

            # If the message has no "event" key, then this payload came from a
            # Pagerduty Webhook V1.
            if message_event is None:
                break

            if message_event not in PAGER_DUTY_EVENT_NAMES_V2:
                raise UnsupportedWebhookEventTypeError(message_event)

            format_dict = build_pagerduty_formatdict_v2(message)
            send_formatted_pagerduty(request, user_profile, message_event, format_dict)
    else:
        if "event" in payload:
            # V3 has no "messages" field, and it has key "event" instead
            event = payload["event"]
            event_type = event.get("event_type").tame(check_none_or(check_string))

            if event_type not in PAGER_DUTY_EVENT_NAMES_V3:
                raise UnsupportedWebhookEventTypeError(event_type)

            format_dict = build_pagerduty_formatdict_v3(event)
            send_formatted_pagerduty(request, user_profile, event_type, format_dict)

    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: acknowledge.json]---
Location: zulip-main/zerver/webhooks/pagerduty/fixtures/acknowledge.json

```json
{
    "messages": [
        {
            "created_on": "2015-02-07T21:09:49Z",
            "data": {
                "incident": {
                    "acknowledgers": [
                        {
                            "at": "2015-02-07T21:09:49Z",
                            "object": {
                                "email": "armooo@zulip.com",
                                "html_url": "https://zulip-test.pagerduty.com/users/POBCFRJ",
                                "id": "POBCFRJ",
                                "name": "Jason MIchalski",
                                "type": "user"
                            }
                        }
                    ],
                    "assigned_to": [
                        {
                            "at": "2015-02-07T21:08:36Z",
                            "object": {
                                "email": "armooo+2@zulip.com",
                                "html_url": "https://zulip-test.pagerduty.com/users/PJ9ODL1",
                                "id": "PJ9ODL1",
                                "name": "Armooo2",
                                "type": "user"
                            }
                        },
                        {
                            "at": "2015-02-07T21:09:49Z",
                            "object": {
                                "email": "armooo@zulip.com",
                                "html_url": "https://zulip-test.pagerduty.com/users/POBCFRJ",
                                "id": "POBCFRJ",
                                "name": "Jason MIchalski",
                                "type": "user"
                            }
                        }
                    ],
                    "assigned_to_user": {
                        "email": "armooo@zulip.com",
                        "html_url": "https://zulip-test.pagerduty.com/users/POBCFRJ",
                        "id": "POBCFRJ",
                        "name": "Jason MIchalski"
                    },
                    "created_on": "2015-02-07T21:05:47Z",
                    "escalation_policy": {
                        "deleted_at": null,
                        "id": "PUIGL4T",
                        "name": "Default"
                    },
                    "html_url": "https://zulip-test.pagerduty.com/incidents/PO1XIJ5",
                    "id": "PO1XIJ5",
                    "incident_key": "It is on fire",
                    "incident_number": 1,
                    "last_status_change_by": {
                        "email": "armooo@zulip.com",
                        "html_url": "https://zulip-test.pagerduty.com/users/POBCFRJ",
                        "id": "POBCFRJ",
                        "name": "Jason MIchalski"
                    },
                    "last_status_change_on": "2015-02-07T21:09:49Z",
                    "number_of_escalations": 0,
                    "service": {
                        "deleted_at": null,
                        "html_url": "https://zulip-test.pagerduty.com/services/PIL5CUQ",
                        "id": "PIL5CUQ",
                        "name": "Test service"
                    },
                    "status": "acknowledged",
                    "trigger_details_html_url": "https://zulip-test.pagerduty.com/incidents/PO1XIJ5/log_entries/Q01ZH27LNRIAUB",
                    "trigger_summary_data": {
                        "subject": "It is on fire"
                    },
                    "trigger_type": "email_trigger"
                }
            },
            "id": "a710cfd0-af0d-11e4-8aca-f23c91739642",
            "type": "incident.assign"
        },
        {
            "created_on": "2015-02-07T21:09:49Z",
            "data": {
                "incident": {
                    "acknowledgers": [
                        {
                            "at": "2015-02-07T21:09:49Z",
                            "object": {
                                "email": "armooo@zulip.com",
                                "html_url": "https://zulip-test.pagerduty.com/users/POBCFRJ",
                                "id": "POBCFRJ",
                                "name": "Jason MIchalski",
                                "type": "user"
                            }
                        }
                    ],
                    "assigned_to": [
                        {
                            "at": "2015-02-07T21:08:36Z",
                            "object": {
                                "email": "armooo+2@zulip.com",
                                "html_url": "https://zulip-test.pagerduty.com/users/PJ9ODL1",
                                "id": "PJ9ODL1",
                                "name": "Armooo2",
                                "type": "user"
                            }
                        },
                        {
                            "at": "2015-02-07T21:09:49Z",
                            "object": {
                                "email": "armooo@zulip.com",
                                "html_url": "https://zulip-test.pagerduty.com/users/POBCFRJ",
                                "id": "POBCFRJ",
                                "name": "Jason MIchalski",
                                "type": "user"
                            }
                        }
                    ],
                    "assigned_to_user": {
                        "email": "armooo@zulip.com",
                        "html_url": "https://zulip-test.pagerduty.com/users/POBCFRJ",
                        "id": "POBCFRJ",
                        "name": "Jason MIchalski"
                    },
                    "created_on": "2015-02-07T21:05:47Z",
                    "escalation_policy": {
                        "deleted_at": null,
                        "id": "PUIGL4T",
                        "name": "Default"
                    },
                    "html_url": "https://zulip-test.pagerduty.com/incidents/PO1XIJ5",
                    "id": "PO1XIJ5",
                    "incident_key": "It is on fire",
                    "incident_number": 1,
                    "last_status_change_by": {
                        "email": "armooo@zulip.com",
                        "html_url": "https://zulip-test.pagerduty.com/users/POBCFRJ",
                        "id": "POBCFRJ",
                        "name": "Jason MIchalski"
                    },
                    "last_status_change_on": "2015-02-07T21:09:49Z",
                    "number_of_escalations": 0,
                    "service": {
                        "deleted_at": null,
                        "html_url": "https://zulip-test.pagerduty.com/services/PIL5CUQ",
                        "id": "PIL5CUQ",
                        "name": "Test service"
                    },
                    "status": "acknowledged",
                    "trigger_details_html_url": "https://zulip-test.pagerduty.com/incidents/PO1XIJ5/log_entries/Q01ZH27LNRIAUB",
                    "trigger_summary_data": {
                        "subject": "It is on fire"
                    },
                    "trigger_type": "email_trigger"
                }
            },
            "id": "a7169c30-af0d-11e4-8aca-f23c91739642",
            "type": "incident.acknowledge"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: acknowledged_v3.json]---
Location: zulip-main/zerver/webhooks/pagerduty/fixtures/acknowledged_v3.json

```json
{
  "event": {
    "id": "01BZYK8N47N5JG55J1EEEHPEJI",
    "event_type": "incident.acknowledged",
    "resource_type": "incident",
    "occurred_at": "2021-06-04T13:55:30.394Z",
    "agent": {
      "html_url": "https://pig208.pagerduty.com/users/PJ0LVEB",
      "id": "PJ0LVEB",
      "self": "https://api.pagerduty.com/users/PJ0LVEB",
      "summary": "PIG 208",
      "type": "user_reference"
    },
    "client": null,
    "data": {
      "id": "PQ1K5C8",
      "type": "incident",
      "self": "https://api.pagerduty.com/incidents/PQ1K5C8",
      "html_url": "https://pig208.pagerduty.com/incidents/PQ1K5C8",
      "number": 10,
      "status": "acknowledged",
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
          "html_url": "https://pig208.pagerduty.com/users/PJ0LVEB",
          "id": "PJ0LVEB",
          "self": "https://api.pagerduty.com/users/PJ0LVEB",
          "summary": "PIG 208",
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

---[FILE: acknowledge_v2.json]---
Location: zulip-main/zerver/webhooks/pagerduty/fixtures/acknowledge_v2.json

```json
{
    "messages":[
        {
            "event":"incident.acknowledge",
            "log_entries":[
                {
                    "id":"RRPP3746OFFZZ742NSP1G67AWC",
                    "type":"acknowledge_log_entry",
                    "summary":"Acknowledged by Laura Haley",
                    "self":"https://api.pagerduty.com/log_entries/RRPP3746OFFZZ742NSP1G67AWC",
                    "html_url":null,
                    "created_at":"2017-09-26T15:15:17Z",
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
                    "acknowledgement_timeout":1800,
                    "event_details":{

                    }
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
                "status":"acknowledged",
                "pending_actions":[
                    {
                        "type":"unacknowledge",
                        "at":"2017-09-26T15:45:17Z"
                    },
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
                    "status":"warning",
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
                        "at":"2017-09-26T15:14:36Z",
                        "assignee":{
                            "id":"P553OPV",
                            "type":"user_reference",
                            "summary":"Laura Haley",
                            "self":"https://api.pagerduty.com/users/P553OPV",
                            "html_url":"https://webdemo.pagerduty.com/users/P553OPV"
                        }
                    }
                ],
                "acknowledgements":[
                    {
                        "at":"2017-09-26T15:15:17Z",
                        "acknowledger":{
                            "id":"P553OPV",
                            "type":"user_reference",
                            "summary":"Laura Haley",
                            "self":"https://api.pagerduty.com/users/P553OPV",
                            "html_url":"https://webdemo.pagerduty.com/users/P553OPV"
                        }
                    }
                ],
                "last_status_change_at":"2017-09-26T15:15:17Z",
                "last_status_change_by":{
                    "id":"P553OPV",
                    "type":"user_reference",
                    "summary":"Laura Haley",
                    "self":"https://api.pagerduty.com/users/P553OPV",
                    "html_url":"https://webdemo.pagerduty.com/users/P553OPV"
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
            "id":"82a33960-a2cd-11e7-8f69-22000affca53",
            "created_on":"2017-09-26T15:15:17Z"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: acknowledge_without_trigger_summary_data.json]---
Location: zulip-main/zerver/webhooks/pagerduty/fixtures/acknowledge_without_trigger_summary_data.json

```json
{
    "messages": [
        {
            "created_on": "2015-02-07T21:09:49Z",
            "data": {
                "incident": {
                    "acknowledgers": [
                        {
                            "at": "2015-02-07T21:09:49Z",
                            "object": {
                                "email": "armooo@zulip.com",
                                "html_url": "https://zulip-test.pagerduty.com/users/POBCFRJ",
                                "id": "POBCFRJ",
                                "name": "Jason MIchalski",
                                "type": "user"
                            }
                        }
                    ],
                    "assigned_to": [
                        {
                            "at": "2015-02-07T21:08:36Z",
                            "object": {
                                "email": "armooo+2@zulip.com",
                                "html_url": "https://zulip-test.pagerduty.com/users/PJ9ODL1",
                                "id": "PJ9ODL1",
                                "name": "Armooo2",
                                "type": "user"
                            }
                        },
                        {
                            "at": "2015-02-07T21:09:49Z",
                            "object": {
                                "email": "armooo@zulip.com",
                                "html_url": "https://zulip-test.pagerduty.com/users/POBCFRJ",
                                "id": "POBCFRJ",
                                "name": "Jason MIchalski",
                                "type": "user"
                            }
                        }
                    ],
                    "assigned_to_user": {
                        "email": "armooo@zulip.com",
                        "html_url": "https://zulip-test.pagerduty.com/users/POBCFRJ",
                        "id": "POBCFRJ",
                        "name": "Jason MIchalski"
                    },
                    "created_on": "2015-02-07T21:05:47Z",
                    "escalation_policy": {
                        "deleted_at": null,
                        "id": "PUIGL4T",
                        "name": "Default"
                    },
                    "html_url": "https://zulip-test.pagerduty.com/incidents/PO1XIJ5",
                    "id": "PO1XIJ5",
                    "incident_key": "It is on fire",
                    "incident_number": 1,
                    "last_status_change_by": {
                        "email": "armooo@zulip.com",
                        "html_url": "https://zulip-test.pagerduty.com/users/POBCFRJ",
                        "id": "POBCFRJ",
                        "name": "Jason MIchalski"
                    },
                    "last_status_change_on": "2015-02-07T21:09:49Z",
                    "number_of_escalations": 0,
                    "service": {
                        "deleted_at": null,
                        "html_url": "https://zulip-test.pagerduty.com/services/PIL5CUQ",
                        "id": "PIL5CUQ",
                        "name": "Test service"
                    },
                    "status": "acknowledged",
                    "trigger_details_html_url": "https://zulip-test.pagerduty.com/incidents/PO1XIJ5/log_entries/Q01ZH27LNRIAUB",
                    "trigger_summary_data": null,
                    "trigger_type": "email_trigger"
                }
            },
            "id": "a710cfd0-af0d-11e4-8aca-f23c91739642",
            "type": "incident.assign"
        },
        {
            "created_on": "2015-02-07T21:09:49Z",
            "data": {
                "incident": {
                    "acknowledgers": [
                        {
                            "at": "2015-02-07T21:09:49Z",
                            "object": {
                                "email": "armooo@zulip.com",
                                "html_url": "https://zulip-test.pagerduty.com/users/POBCFRJ",
                                "id": "POBCFRJ",
                                "name": "Jason MIchalski",
                                "type": "user"
                            }
                        }
                    ],
                    "assigned_to": [
                        {
                            "at": "2015-02-07T21:08:36Z",
                            "object": {
                                "email": "armooo+2@zulip.com",
                                "html_url": "https://zulip-test.pagerduty.com/users/PJ9ODL1",
                                "id": "PJ9ODL1",
                                "name": "Armooo2",
                                "type": "user"
                            }
                        },
                        {
                            "at": "2015-02-07T21:09:49Z",
                            "object": {
                                "email": "armooo@zulip.com",
                                "html_url": "https://zulip-test.pagerduty.com/users/POBCFRJ",
                                "id": "POBCFRJ",
                                "name": "Jason MIchalski",
                                "type": "user"
                            }
                        }
                    ],
                    "assigned_to_user": {
                        "email": "armooo@zulip.com",
                        "html_url": "https://zulip-test.pagerduty.com/users/POBCFRJ",
                        "id": "POBCFRJ",
                        "name": "Jason MIchalski"
                    },
                    "created_on": "2015-02-07T21:05:47Z",
                    "escalation_policy": {
                        "deleted_at": null,
                        "id": "PUIGL4T",
                        "name": "Default"
                    },
                    "html_url": "https://zulip-test.pagerduty.com/incidents/PO1XIJ5",
                    "id": "PO1XIJ5",
                    "incident_key": "It is on fire",
                    "incident_number": 1,
                    "last_status_change_by": {
                        "email": "armooo@zulip.com",
                        "html_url": "https://zulip-test.pagerduty.com/users/POBCFRJ",
                        "id": "POBCFRJ",
                        "name": "Jason MIchalski"
                    },
                    "last_status_change_on": "2015-02-07T21:09:49Z",
                    "number_of_escalations": 0,
                    "service": {
                        "deleted_at": null,
                        "html_url": "https://zulip-test.pagerduty.com/services/PIL5CUQ",
                        "id": "PIL5CUQ",
                        "name": "Test service"
                    },
                    "status": "acknowledged",
                    "trigger_details_html_url": "https://zulip-test.pagerduty.com/incidents/PO1XIJ5/log_entries/Q01ZH27LNRIAUB",
                    "trigger_summary_data": null,
                    "trigger_type": "email_trigger"
                }
            },
            "id": "a7169c30-af0d-11e4-8aca-f23c91739642",
            "type": "incident.acknowledge"
        }
    ]
}
```

--------------------------------------------------------------------------------

````
