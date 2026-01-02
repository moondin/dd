---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1233
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1233 of 1290)

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

---[FILE: assign_v2.json]---
Location: zulip-main/zerver/webhooks/pagerduty/fixtures/assign_v2.json

```json
{
    "messages":[
        {
            "event":"incident.assign",
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

---[FILE: auto_resolved.json]---
Location: zulip-main/zerver/webhooks/pagerduty/fixtures/auto_resolved.json

```json
{
    "messages": [
        {
            "created_on": "2015-02-07T21:29:42Z",
            "data": {
                "incident": {
                    "assigned_to": [],
                    "assigned_to_user": null,
                    "created_on": "2015-02-07T21:19:42Z",
                    "escalation_policy": {
                        "deleted_at": null,
                        "id": "PUIGL4T",
                        "name": "Default"
                    },
                    "html_url": "https://zulip-test.pagerduty.com/incidents/PX7K9J2",
                    "id": "PX7K9J2",
                    "incident_key": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                    "incident_number": 2,
                    "last_status_change_by": null,
                    "last_status_change_on": "2015-02-07T21:29:42Z",
                    "number_of_escalations": 0,
                    "resolved_by_user": null,
                    "service": {
                        "deleted_at": null,
                        "html_url": "https://zulip-test.pagerduty.com/services/PIL5CUQ",
                        "id": "PIL5CUQ",
                        "name": "Test service"
                    },
                    "status": "resolved",
                    "trigger_details_html_url": "https://zulip-test.pagerduty.com/incidents/PX7K9J2/log_entries/Q2LOVDWN1FGDPC",
                    "trigger_summary_data": {
                        "subject": "new"
                    },
                    "trigger_type": "web_trigger"
                }
            },
            "id": "6e0d4b20-af10-11e4-8aca-f23c91739642",
            "type": "incident.resolve"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: mp_fail.json]---
Location: zulip-main/zerver/webhooks/pagerduty/fixtures/mp_fail.json

```json
{
    "messages": [
        {
            "created_on": "2015-02-09T18:31:05Z",
            "data": {
                "incident": {
                    "assigned_to": [],
                    "assigned_to_user": null,
                    "created_on": "2015-02-09T18:30:06Z",
                    "escalation_policy": {
                        "deleted_at": null,
                        "id": "P4BZUGM",
                        "name": "MP on-call"
                    },
                    "html_url": "https://dropbox.pagerduty.com/incidents/PJKGZF9",
                    "id": "PJKGZF9",
                    "incident_key": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                    "incident_number": 48219,
                    "last_status_change_by": null,
                    "last_status_change_on": "2015-02-09T18:31:05Z",
                    "number_of_escalations": 0,
                    "resolved_by_user": null,
                    "service": {
                        "deleted_at": null,
                        "html_url": "https://dropbox.pagerduty.com/services/PINP5IV",
                        "id": "PINP5IV",
                        "name": "MP API"
                    },
                    "status": "resolved",
                    "trigger_details_html_url": "https://dropbox.pagerduty.com/incidents/PJKGZF9/log_entries/Q1TF6UA8WN4AK8",
                    "trigger_summary_data": {
                        "description": "mp_error_block_down_criticalℙƴ"
                    },
                    "trigger_type": "trigger_svc_event"
                }
            },
            "id": "cf419f70-b089-11e4-9e4c-f23c91739642",
            "type": "incident.resolve"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: reassigned_v3.json]---
Location: zulip-main/zerver/webhooks/pagerduty/fixtures/reassigned_v3.json

```json
{
  "event": {
    "id": "01BZY282OVDQMFPDC3VB98DR1L",
    "event_type": "incident.reassigned",
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

---[FILE: resolved.json]---
Location: zulip-main/zerver/webhooks/pagerduty/fixtures/resolved.json

```json
{
    "messages": [
        {
            "created_on": "2015-02-07T21:31:53Z",
            "data": {
                "incident": {
                    "assigned_to": [],
                    "assigned_to_user": null,
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
                    "last_status_change_on": "2015-02-07T21:31:53Z",
                    "number_of_escalations": 0,
                    "resolved_by_user": {
                        "email": "armooo@zulip.com",
                        "html_url": "https://zulip-test.pagerduty.com/users/POBCFRJ",
                        "id": "POBCFRJ",
                        "name": "Jason MIchalski"
                    },
                    "service": {
                        "deleted_at": null,
                        "html_url": "https://zulip-test.pagerduty.com/services/PIL5CUQ",
                        "id": "PIL5CUQ",
                        "name": "Test service"
                    },
                    "status": "resolved",
                    "trigger_details_html_url": "https://zulip-test.pagerduty.com/incidents/PO1XIJ5/log_entries/Q01ZH27LNRIAUB",
                    "trigger_summary_data": {
                        "subject": "It is on fire"
                    },
                    "trigger_type": "email_trigger"
                }
            },
            "id": "bc3d9ed0-af10-11e4-947f-22000ad9bf74",
            "type": "incident.resolve"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: resolved_v3.json]---
Location: zulip-main/zerver/webhooks/pagerduty/fixtures/resolved_v3.json

```json
{
  "event": {
    "id": "01BZYH1JJY09P9LEIST8HG2PMN",
    "event_type": "incident.resolved",
    "resource_type": "incident",
    "occurred_at": "2021-06-04T13:16:53.816Z",
    "agent": {
      "html_url": "https://pig208.pagerduty.com/users/PJ0LVEB",
      "id": "PJ0LVEB",
      "self": "https://api.pagerduty.com/users/PJ0LVEB",
      "summary": "PIG 208",
      "type": "user_reference"
    },
    "client": null,
    "data": {
      "id": "PCPZE64",
      "type": "incident",
      "self": "https://api.pagerduty.com/incidents/PCPZE64",
      "html_url": "https://pig208.pagerduty.com/incidents/PCPZE64",
      "number": 6,
      "status": "resolved",
      "title": "Test Incident",
      "service": {
        "html_url": "https://pig208.pagerduty.com/services/PA2P440",
        "id": "PA2P440",
        "self": "https://api.pagerduty.com/services/PA2P440",
        "summary": "pig208",
        "type": "service_reference"
      },
      "assignees": [],
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

---[FILE: resolve_v2.json]---
Location: zulip-main/zerver/webhooks/pagerduty/fixtures/resolve_v2.json

```json
{
    "messages":[
        {
            "event":"incident.resolve",
            "log_entries":[
                {
                    "id":"RNAJ8DLJGWHBXXYX1CC5G50C9O",
                    "type":"resolve_log_entry",
                    "summary":"Resolved by Laura Haley",
                    "self":"https://api.pagerduty.com/log_entries/RNAJ8DLJGWHBXXYX1CC5G50C9O",
                    "html_url":null,
                    "created_at":"2017-09-26T15:18:09+00:00",
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
                "status":"resolved",
                "pending_actions":[

                ],
                "incident_key":null,
                "service":{
                    "id":"PN49J75",
                    "name":"Production XDB Cluster",
                    "description":"This service was created during onboarding on July 5, 2017.",
                    "auto_resolve_timeout":14400,
                    "acknowledgement_timeout":1800,
                    "created_at":"2017-07-05T17:33:09Z",
                    "status":"active",
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
                "last_status_change_at":"2017-09-26T15:18:09Z",
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
                "resolve_reason":null,
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
            "id":"e82195c0-a2cd-11e7-8f69-22000affca53",
            "created_on":"2017-09-26T15:18:09Z"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: trigger.json]---
Location: zulip-main/zerver/webhooks/pagerduty/fixtures/trigger.json

```json
{
    "messages": [
        {
            "created_on": "2015-02-07T21:42:52Z",
            "data": {
                "incident": {
                    "assigned_to": [
                        {
                            "at": "2015-02-07T21:42:52Z",
                            "object": {
                                "email": "armooo@zulip.com",
                                "html_url": "https://zulip-test.pagerduty.com/users/POBCFRJ",
                                "id": "POBCFRJ",
                                "name": "Jason Michalski",
                                "type": "user"
                            }
                        }
                    ],
                    "assigned_to_user": {
                        "email": "armooo@zulip.com",
                        "html_url": "https://zulip-test.pagerduty.com/users/POBCFRJ",
                        "id": "POBCFRJ",
                        "name": "Jason Michalski"
                    },
                    "created_on": "2015-02-07T21:42:52Z",
                    "escalation_policy": {
                        "deleted_at": null,
                        "id": "PUIGL4T",
                        "name": "Default"
                    },
                    "html_url": "https://zulip-test.pagerduty.com/incidents/P140S4Y",
                    "id": "P140S4Y",
                    "incident_key": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                    "incident_number": 3,
                    "last_status_change_by": null,
                    "last_status_change_on": "2015-02-07T21:42:52Z",
                    "number_of_escalations": 0,
                    "service": {
                        "deleted_at": null,
                        "html_url": "https://zulip-test.pagerduty.com/services/PIL5CUQ",
                        "id": "PIL5CUQ",
                        "name": "Test service"
                    },
                    "status": "triggered",
                    "trigger_details_html_url": "https://zulip-test.pagerduty.com/incidents/P140S4Y/log_entries/Q3P8OPKZDJWLKB",
                    "trigger_summary_data": {
                        "subject": "foo"
                    },
                    "trigger_type": "web_trigger"
                }
            },
            "id": "44df6240-af12-11e4-8e1e-22000ae31361",
            "type": "incident.trigger"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: triggered_v3.json]---
Location: zulip-main/zerver/webhooks/pagerduty/fixtures/triggered_v3.json

```json
{
  "event": {
    "id": "01BZYIL05THJDFF2Y08X9SVMTU",
    "event_type": "incident.triggered",
    "resource_type": "incident",
    "occurred_at": "2021-06-04T13:35:29.781Z",
    "agent": {
      "html_url": "https://pig208.pagerduty.com/users/PJ0LVEB",
      "id": "PJ0LVEB",
      "self": "https://api.pagerduty.com/users/PJ0LVEB",
      "summary": "PIG 208",
      "type": "user_reference"
    },
    "client": null,
    "data": {
      "id": "PFQZPSY",
      "type": "incident",
      "self": "https://api.pagerduty.com/incidents/PFQZPSY",
      "html_url": "https://pig208.pagerduty.com/incidents/PFQZPSY",
      "number": 9,
      "status": "triggered",
      "title": "Test Incident 3",
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

````
