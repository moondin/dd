---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1234
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1234 of 1290)

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

---[FILE: trigger_v2.json]---
Location: zulip-main/zerver/webhooks/pagerduty/fixtures/trigger_v2.json

```json
{
    "messages":[
        {
            "event":"incident.trigger",
            "log_entries":[
                {
                    "id":"R2XGXEI3W0FHMSDXHDIBQGBQ5E",
                    "type":"trigger_log_entry",
                    "summary":"Triggered through the website",
                    "self":"https://api.pagerduty.com/log_entries/R2XGXEI3W0FHMSDXHDIBQGBQ5E",
                    "html_url":"https://webdemo.pagerduty.com/incidents/PRORDTY/log_entries/R2XGXEI3W0FHMSDXHDIBQGBQ5E",
                    "created_at":"2017-09-26T15:14:36Z",
                    "agent":{
                        "id":"P553OPV",
                        "type":"user_reference",
                        "summary":"Laura Haley",
                        "self":"https://api.pagerduty.com/users/P553OPV",
                        "html_url":"https://webdemo.pagerduty.com/users/P553OPV"
                    },
                    "channel":{
                        "type":"web_trigger",
                        "summary":"My new incident",
                        "subject":"My new incident",
                        "details":"Oh my gosh"
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
                        "description":"My new incident"
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
                "status":"triggered",
                "pending_actions":[
                    {
                        "type":"escalate",
                        "at":"2017-09-26T15:44:36Z"
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

                ],
                "last_status_change_at":"2017-09-26T15:14:36Z",
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
                    }
                ]
            },
            "id":"69a7ced0-a2cd-11e7-a799-22000a15839c",
            "created_on":"2017-09-26T15:14:36Z"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: trigger_without_assignee_v2.json]---
Location: zulip-main/zerver/webhooks/pagerduty/fixtures/trigger_without_assignee_v2.json

```json
{
    "messages":[
        {
            "event":"incident.trigger",
            "log_entries":[
                {
                    "id":"R2XGXEI3W0FHMSDXHDIBQGBQ5E",
                    "type":"trigger_log_entry",
                    "summary":"Triggered through the website",
                    "self":"https://api.pagerduty.com/log_entries/R2XGXEI3W0FHMSDXHDIBQGBQ5E",
                    "html_url":"https://webdemo.pagerduty.com/incidents/PRORDTY/log_entries/R2XGXEI3W0FHMSDXHDIBQGBQ5E",
                    "created_at":"2017-09-26T15:14:36Z",
                    "agent":{
                        "id":"P553OPV",
                        "type":"user_reference",
                        "summary":"Laura Haley",
                        "self":"https://api.pagerduty.com/users/P553OPV",
                        "html_url":"https://webdemo.pagerduty.com/users/P553OPV"
                    },
                    "channel":{
                        "type":"web_trigger",
                        "summary":"My new incident",
                        "subject":"My new incident",
                        "details":"Oh my gosh"
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
                        "description":"My new incident"
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
                "status":"triggered",
                "pending_actions":[
                    {
                        "type":"escalate",
                        "at":"2017-09-26T15:44:36Z"
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
                "assignments":[],
                "acknowledgements":[

                ],
                "last_status_change_at":"2017-09-26T15:14:36Z",
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
                    }
                ]
            },
            "id":"69a7ced0-a2cd-11e7-a799-22000a15839c",
            "created_on":"2017-09-26T15:14:36Z"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: unacknowledge.json]---
Location: zulip-main/zerver/webhooks/pagerduty/fixtures/unacknowledge.json

```json
{
    "messages": [
        {
            "created_on": "2015-02-07T21:53:09Z",
            "data": {
                "incident": {
                    "assigned_to": [
                        {
                            "at": "2015-02-07T21:42:52Z",
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
                    "last_status_change_on": "2015-02-07T21:53:09Z",
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
            "id": "b4695980-af13-11e4-8a3a-12313f0a2181",
            "type": "incident.unacknowledge"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: unacknowledged_v3.json]---
Location: zulip-main/zerver/webhooks/pagerduty/fixtures/unacknowledged_v3.json

```json
{
  "event": {
    "id": "01BZYK5B3WC0QI62S87MJX7FCD",
    "event_type": "incident.unacknowledged",
    "resource_type": "incident",
    "occurred_at": "2021-06-04T13:54:23.185Z",
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

---[FILE: unsupported_v1.json]---
Location: zulip-main/zerver/webhooks/pagerduty/fixtures/unsupported_v1.json

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
            "type": "incident.unsupported"
        }
    ]
}
```

--------------------------------------------------------------------------------

````
