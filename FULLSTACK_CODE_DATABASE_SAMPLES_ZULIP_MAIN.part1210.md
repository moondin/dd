---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1210
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1210 of 1290)

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

---[FILE: alert_values_v11.json]---
Location: zulip-main/zerver/webhooks/grafana/fixtures/alert_values_v11.json

```json
{
	"receiver": "Debug webhook",
	"status": "firing",
	"alerts": [
		{
			"status": "firing",
			"labels": {
				"alertname": "Memory (copy)",
				"debug": "true",
				"grafana_folder": "device"
			},
			"annotations": {
				"summary": "High memory usage"
			},
			"startsAt": "2024-03-01T02:09:00Z",
			"endsAt": "0001-01-01T00:00:00Z",
			"generatorURL": "https://play.grafana.org/alerting/grafana/dd2f0260-3cfc-4c65-a4c4-f3f632c551f4/view?orgId=1",
			"fingerprint": "e6349a25f5ef0e9e",
			"silenceURL": "https://play.grafana.org/alerting/silence/new?alertmanager=grafana\u0026matcher=alertname%3DMemory+%28copy%29\u0026matcher=debug%3Dtrue\u0026matcher=grafana_folder%3Ddevice\u0026orgId=1",
			"dashboardURL": "https://play.grafana.org/d/ece9fb32-7f71-4be9-bd94-2f23608ae5b9?orgId=1",
			"panelURL": "https://play.grafana.org/d/ece9fb32-7f71-4be9-bd94-2f23608ae5b9?orgId=1\u0026viewPanel=2",
			"values": {
				"A": 2473545728,
				"B": 0,
				"C": 1,
				"minute": 9
			},
			"valueString": "[ var='A' labels={instance=node_exporter:9100, job=node} value=2.473545728e+09 ], [ var='B' labels={instance=node_exporter:9100, job=node} value=0 ], [ var='C' labels={} value=1 ], [ var='minute' labels={} value=9 ]",
	    "imageURL": "https://grafana.com/assets/img/blog/mixed_styles.png"
		}
	],
	"groupLabels": {
		"alertname": "Memory (copy)",
		"grafana_folder": "device"
	},
	"commonLabels": {
		"alertname": "Memory (copy)",
		"debug": "true",
		"grafana_folder": "device"
	},
	"commonAnnotations": {
		"summary": "High memory usage"
	},
	"externalURL": "https://play.grafana.org/",
	"version": "1",
	"groupKey": "{}/{debug=\"true\"}:{alertname=\"Memory (copy)\", grafana_folder=\"device\"}",
	"truncatedAlerts": 0,
	"orgId": 1,
	"title": "[FIRING:1] Memory (copy) device (true)",
	"state": "alerting",
	"message": "**Firing**\n\nValue: A=2.473545728e+09, B=0, C=1, minute=9\nLabels:\n - alertname = Memory (copy)\n - debug = true\n - grafana_folder = device\nAnnotations:\n - summary = High memory usage\nSource: https://play.grafana.org/alerting/grafana/dd2f0260-3cfc-4c65-a4c4-f3f632c551f4/view?orgId=1\nSilence: https://play.grafana.org/alerting/silence/new?alertmanager=grafana\u0026matcher=alertname%3DMemory+%28copy%29\u0026matcher=debug%3Dtrue\u0026matcher=grafana_folder%3Ddevice\u0026orgId=1\nDashboard: https://play.grafana.org/d/ece9fb32-7f71-4be9-bd94-2f23608ae5b9?orgId=1\nPanel: https://play.grafana.org/d/ece9fb32-7f71-4be9-bd94-2f23608ae5b9?orgId=1\u0026viewPanel=2\n"
}
```

--------------------------------------------------------------------------------

---[FILE: no_data_alert_v7.json]---
Location: zulip-main/zerver/webhooks/grafana/fixtures/no_data_alert_v7.json

```json
{
    "dashboardId": 2,
    "evalMatches": [],
    "message": "The panel has no data.",
    "orgId": 1,
    "panelId": 6,
    "ruleId": 3,
    "ruleName": "No Data alert",
    "ruleUrl": "http://localhost:3000/d/GG2qhR3Wz/alerttest?fullscreen&edit&tab=alert&panelId=6&orgId=1",
    "state": "alerting",
    "tags": {},
    "title": "[Alerting] No Data alert"
  }
```

--------------------------------------------------------------------------------

---[FILE: no_message_alert_v7.json]---
Location: zulip-main/zerver/webhooks/grafana/fixtures/no_message_alert_v7.json

```json
{
    "dashboardId": 2,
    "evalMatches": [
      {
        "value": 21.573108436586445,
        "metric": "A-series",
        "tags": {}
      }
    ],
    "orgId": 1,
    "panelId": 8,
    "ruleId": 4,
    "ruleName": "No Message alert",
    "ruleUrl": "http://localhost:3000/d/GG2qhR3Wz/alerttest?fullscreen&edit&tab=alert&panelId=8&orgId=1",
    "state": "alerting",
    "tags": {},
    "title": "[Alerting] No Message alert"
  }
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/greenhouse/doc.md

```text
# Zulip Greenhouse integration

Receive Greenhouse notifications in Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. On your Greenhouse **Dashboard**, click on the
   **gear** (<i class="fa fa-cog"></i>) icon in the upper right
   corner. Click on **Dev Center**, and click **Web Hooks**.
   Click on **Web Hooks** one more time.

1. Set **Name this web hook** to a name of your choice, such as
   `Zulip`. Set **When** to the event you'd like to be notified
   about. Set **Endpoint URL** to the URL generated above.

1. Greenhouse requires you to provide a **Secret key**, but Zulip
   doesn't expect any particular value. Set **Secret key** to any
   random value, and click **Create Web hook**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/greenhouse/001.png)

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/greenhouse/tests.py

```python
from unittest.mock import MagicMock, patch

from zerver.lib.test_classes import WebhookTestCase


class GreenhouseHookTests(WebhookTestCase):
    CHANNEL_NAME = "greenhouse"
    URL_TEMPLATE = "/api/v1/external/greenhouse?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "greenhouse"
    CONTENT_TYPE = "application/x-www-form-urlencoded"

    def test_message_candidate_hired(self) -> None:
        expected_topic_name = "Hire Candidate - 19"
        expected_message = """
Hire Candidate Johnny Smith (ID: 19), applying for:
* **Role**: Developer
* **Emails**: personal@example.com (Personal), work@example.com (Work)
* **Attachments**: [Resume](https://prod-heroku.s3.amazonaws.com/...)
""".strip()

        self.check_webhook(
            "candidate_hired", expected_topic_name, expected_message, content_type=self.CONTENT_TYPE
        )

    def test_message_candidate_rejected(self) -> None:
        expected_topic_name = "Reject Candidate - 265788"
        expected_message = """
Reject Candidate Hector Porter (ID: 265788), applying for:
* **Role**: Designer
* **Emails**: hector.porter.265788@example.com (Personal)
* **Attachments**: [Resume](https://prod-heroku.s3.amazonaws.com/...)
""".strip()

        self.check_webhook(
            "candidate_rejected",
            expected_topic_name,
            expected_message,
            content_type=self.CONTENT_TYPE,
        )

    def test_message_candidate_stage_change(self) -> None:
        expected_topic_name = "Candidate Stage Change - 265772"
        expected_message = """
Candidate Stage Change Giuseppe Hurley (ID: 265772), applying for:
* **Role**: Designer
* **Emails**: giuseppe.hurley@example.com (Personal)
* **Attachments**: [Resume](https://prod-heroku.s3.amazonaws.com/...), [Cover_Letter](https://prod-heroku.s3.amazonaws.com/...), [Attachment](https://prod-heroku.s3.amazonaws.com/...)
""".strip()

        self.check_webhook(
            "candidate_stage_change",
            expected_topic_name,
            expected_message,
            content_type=self.CONTENT_TYPE,
        )

    def test_message_prospect_created(self) -> None:
        expected_topic_name = "New Prospect Application - 968190"
        expected_message = """
New Prospect Application Trisha Troy (ID: 968190), applying for:
* **Role**: Designer
* **Emails**: t.troy@example.com (Personal)
* **Attachments**: [Resume](https://prod-heroku.s3.amazonaws.com/...)
""".strip()

        self.check_webhook(
            "prospect_created",
            expected_topic_name,
            expected_message,
            content_type=self.CONTENT_TYPE,
        )

    @patch("zerver.webhooks.greenhouse.view.check_send_webhook_message")
    def test_ping_message_ignore(self, check_send_webhook_message_mock: MagicMock) -> None:
        self.url = self.build_webhook_url()
        payload = self.get_body("ping_event")
        result = self.client_post(self.url, payload, content_type=self.CONTENT_TYPE)
        self.assertFalse(check_send_webhook_message_mock.called)
        self.assert_json_success(result)
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/greenhouse/view.py
Signals: Django

```python
from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_int, check_none_or, check_string, check_url
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

MESSAGE_TEMPLATE = """
{action} {first_name} {last_name} (ID: {candidate_id}), applying for:
* **Role**: {role}
* **Emails**: {emails}
* **Attachments**: {attachments}
""".strip()


def dict_list_to_string(some_list: WildValue) -> str:
    response_chunks = []
    for item in some_list:
        item_type = item.get("type", "").tame(check_string).title()
        item_value = item.get("value").tame(check_none_or(check_string))
        item_url = item.get("url").tame(check_none_or(check_url))
        if item_type and item_value:
            response_chunks.append(f"{item_value} ({item_type})")
        elif item_type and item_url:
            response_chunks.append(f"[{item_type}]({item_url})")

    return ", ".join(response_chunks)


@webhook_view("Greenhouse")
@typed_endpoint
def api_greenhouse_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    action = payload["action"].tame(check_string)
    if action == "ping":
        return json_success(request)

    if action == "update_candidate":
        candidate = payload["payload"]["candidate"]
    else:
        candidate = payload["payload"]["application"]["candidate"]
    action = action.replace("_", " ").title()
    application = payload["payload"]["application"]

    body = MESSAGE_TEMPLATE.format(
        action=action,
        first_name=candidate["first_name"].tame(check_string),
        last_name=candidate["last_name"].tame(check_string),
        candidate_id=str(candidate["id"].tame(check_int)),
        role=application["jobs"][0]["name"].tame(check_string),
        emails=dict_list_to_string(application["candidate"]["email_addresses"]),
        attachments=dict_list_to_string(application["candidate"]["attachments"]),
    )

    topic_name = "{} - {}".format(action, str(candidate["id"].tame(check_int)))

    check_send_webhook_message(request, user_profile, topic_name, body)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: candidate_created.json]---
Location: zulip-main/zerver/webhooks/greenhouse/fixtures/candidate_created.json

```json
{
  "action": "new_candidate_application",
  "payload": {
    "application": {
      "id": 265293,
      "rejected_at": null,
      "prospect": false,
      "status": "active",
      "applied_at": "2013-03-22T00:00:00Z",
      "last_activity_at": "2015-03-18T20:28:09Z",
      "source": {
        "id": 27,
        "public_name": "LinkedIn"
      },
      "credited_to": null,
      "rejection_reason": null,
      "current_stage": {
        "id": 678901,
        "name": "Application Review",
        "interviews": [
          {
            "id": 989099,
            "name":"Application Review",
            "status": "collect_feedback",
            "interview_kit": {
              "url": "http://app.greenhouse.io/guides/67656/people/265788",
              "content": "",
              "questions": []
            },
            "interviewers": []
          }
        ]
      },
      "candidate": {
        "id": 265788,
        "created_at": "2013-10-04T01:24:48Z",
        "first_name": "Hector",
        "last_name": "Porter",
        "title": null,
        "company": null,
        "phone_numbers": [
          {
            "value": "330-281-8004",
            "type": "home"
          }
        ],
        "email_addresses": [
          {
            "value": "hector.porter.265788@example.com",
            "type": "personal"
          }
        ],
        "addresses": [],
        "website_addresses": [],
        "social_media_addresses": [],
        "recruiter": null,
        "coordinator": null,
        "photo_url": "https://prod-heroku.s3.amazonaws.com/...",
        "attachments": [
          {
            "filename": "resume.pdf",
            "url": "https://prod-heroku.s3.amazonaws.com/...",
            "type": "resume"
          }
        ],
        "tags": [
          "Import from Previous ATS"
        ],
        "custom_fields": {
          "favorite_color": {
            "name": "Favorite Color",
            "type": "short_text",
            "value": "Blue"
          }
        }
      },
      "jobs": [
        {
          "id": 3485,
          "name": "Designer",
          "requisition_id": null,
          "notes": "Digital and print",
          "job_post_id": 54321,
          "status": "open",
          "created_at": "2013-10-02T22:59:29Z",
          "opened_at": "2015-01-23T00:25:04Z",
          "closed_at": null,
          "departments": [
            {
              "id": 237,
              "name": "Community"
            }
          ],
          "offices": [
            {
              "id": 54,
              "name": "New York",
              "location": "New York, NY"
            }
          ],
          "custom_fields": {
            "employment_type": {
              "name": "Employment Type",
              "type": "single_select",
              "value": "Full Time"
            }
          }
        }
      ]
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: candidate_hired.json]---
Location: zulip-main/zerver/webhooks/greenhouse/fixtures/candidate_hired.json

```json
{
	"action": "hire_candidate",
	"payload": {
		"application": {
			"id": 20,
			"opening": {
				"opening_id": "1234-56"
			},
			"credited_to": {
				"id": 57,
				"email": "bob_johnson1@localhost.com",
				"name": "Robert Johnson"
			},
			"source": {
				"id": 25,
				"public_name": "Monster"
			},
			"candidate": {
				"id": 19,
				"first_name": "Johnny",
				"last_name": "Smith",
				"title": "Previous Title",
				"external_id": "00000",
				"phone_numbers": [{
					"value": "518-555-1212",
					"type": "work"
				}, {
					"value": "212-555-1212",
					"type": "home"
				}],
				"email_addresses": [{
					"value": "personal@example.com",
					"type": "personal"
				}, {
					"value": "work@example.com",
					"type": "work"
				}],
				"addresses": [{
					"value": "455 Broadway New York, NY 10280",
					"type": "home"
				}],
				"recruiter": {
					"id": 55,
					"email": "bob_johnson@localhost.com",
					"name": "Bob Johnson"
				},
				"coordinator": {
					"id": 56,
					"email": "bob_johnson_approver1@localhost.com",
					"name": "Robert J Approver"
				},
				"attachments": [{
					"filename": "resume.pdf",
					"url": "https://prod-heroku.s3.amazonaws.com/...",
					"type": "resume"
				}],
				"custom_fields": {
					"desired_level": {
						"name": "Desired Level",
						"type": "short_text",
						"value": "Senior"
					},
					"favorite_programming_language": {
						"name": "Favorite Programming Language",
						"type": "short_text",
						"value": "Rails"
					}
				}
			},
			"job": {
				"id": 20,
				"name": "Developer",
				"open_date": "2014-11-20T22:49:14Z",
				"close_date": "2014-11-25T22:49:14Z",
				"requisition_id": null,
				"departments": [{
					"id": 7,
					"name": "Technology"
				}],
				"offices": [{
					"id": 13,
					"name": "New York City",
					"location": {
						"name": "New York, NY"
					}
				}, {
					"id": 14,
					"name": "St. Louis",
					"location": null
				}],
				"custom_fields": {
					"approved": {
						"name": "Approved",
						"type": "boolean",
						"value": true
					},
					"employment_type": {
						"name": "Employment Type",
						"type": "single_select",
						"value": "Full-time"
					},
					"salary_range": {
						"name": "SalaryRange",
						"type": "currency_range",
						"value": {
							"unit": "USD",
							"min_value": "10000.0",
							"max_value": "20000.0"
						}
					}
				}
			},
			"jobs": [{
				"id": 20,
				"name": "Developer",
				"opened_at": "2014-11-20T22:49:14Z",
				"closed_at": "2014-11-25T22:49:14Z",
				"requisition_id": null,
				"departments": [{
					"id": 7,
					"name": "Technology"
				}],
				"offices": [{
					"id": 13,
					"name": "New York City",
					"location": {
						"name": "New York, NY"
					}
				}, {
					"id": 14,
					"name": "St. Louis",
					"location": null
				}],
				"custom_fields": {
					"approved": {
						"name": "Approved",
						"type": "boolean",
						"value": true
					},
					"employment_type": {
						"name": "Employment Type",
						"type": "single_select",
						"value": "Full-time"
					},
					"salary_range": {
						"name": "SalaryRange",
						"type": "currency_range",
						"value": {
							"unit": "USD",
							"min_value": "10000.0",
							"max_value": "20000.0"
						}
					}
				}
			}],
			"offer": {
				"id": 13,
				"version": 2,
				"created_at": "2014-11-20T22:49:14Z",
				"sent_at": "2014-11-10",
				"resolved_at": "2014-11-20T22:49:14Z",
				"starts_at": "2015-01-23",
				"custom_fields": {
					"salary": {
						"name": "Salary",
						"type": "currency",
						"value": {
							"amount": 80000,
							"unit": "USD"
						}
					},
					"seasons": {
						"name": "Seasons",
						"type": "multi_select",
						"value": [
							"Season 1",
							"Season 2"
						]
					}
				}
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: candidate_rejected.json]---
Location: zulip-main/zerver/webhooks/greenhouse/fixtures/candidate_rejected.json

```json
{
	"action": "reject_candidate",
	"payload": {
		"application": {
			"id": 265293,
			"rejected_at": "2015-02-11T15:50:41Z",
			"prospect": false,
			"status": "rejected",
			"applied_at": "2013-03-22T00:00:00Z",
			"last_activity_at": "2015-02-11T15:50:41Z",
			"source": {
				"id": 27,
				"public_name": "LinkedIn"
			},
			"credited_to": null,
			"rejection_reason": {
				"id": 14,
				"name": "Too Junior",
				"type": {
					"id": 3,
					"name": "Wrong skill set"
				}
			},
			"candidate": {
				"id": 265788,
				"created_at": "2013-10-04T01:24:48Z",
				"first_name": "Hector",
				"last_name": "Porter",
				"title": null,
				"company": null,
				"phone_numbers": [{
					"value": "330-281-8004",
					"type": "home"
				}],
				"email_addresses": [{
					"value": "hector.porter.265788@example.com",
					"type": "personal"
				}],
				"addresses": [],
				"website_addresses": [],
				"social_media_addresses": [],
				"recruiter": null,
				"coordinator": null,
				"photo_url": "www.example.com/photo.png",
				"attachments": [{
					"filename": "resume.pdf",
					"url": "https://prod-heroku.s3.amazonaws.com/...",
					"type": "resume"
				}],
				"tags": [
					"Imported"
				],
				"custom_fields": {
					"favorite_color": {
						"name": "Favorite Color",
						"type": "short_text",
						"value": "Blue"
					}
				}
			},
			"jobs": [{
				"id": 3485,
				"name": "Designer",
				"requisition_id": null,
				"notes": "Digital and print",
				"job_post_id": 54321,
				"status": "open",
				"created_at": "2013-10-02T22:59:29Z",
				"opened_at": "2015-01-23T00:25:04Z",
				"closed_at": null,
				"departments": [{
					"id": 237,
					"name": "Community"
				}],
				"offices": [{
					"id": 54,
					"name": "New York",
					"location": "New York, NY"
				}],
				"custom_fields": {
					"employment_type": {
						"name": "Employment Type",
						"type": "single_select",
						"value": "Full Time"
					}
				}
			}]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: candidate_stage_change.json]---
Location: zulip-main/zerver/webhooks/greenhouse/fixtures/candidate_stage_change.json

```json
{
	"action": "candidate_stage_change",
	"payload": {
		"application": {
			"id": 265277,
			"rejected_at": null,
			"prospect": false,
			"status": "active",
			"applied_at": "2013-03-22T00:00:00Z",
			"last_activity_at": "2015-02-09T16:38:36Z",
			"source": {
				"id": 31,
				"name": "Agency"
			},
			"credited_to": {
				"id": 15,
				"email": "ada@example.com",
				"name": "Ada Lacey"
			},
			"rejection_reason": null,
			"current_stage": {
				"id": 71416,
				"name": "Assessment",
				"interviews": [{
					"id": 113101,
					"name": "Assessment",
					"status": "to_be_scheduled",
					"interview_kit": {
						"url": "https://app.greenhouse.io/guides/113153/people/265772",
						"content": "Assess their skills",
						"questions": []
					},
					"interviewers": [{
						"id": 2622,
						"display_name": "Carl Buddha",
						"status": "tentative"
					}]
				}]
			},
			"candidate": {
				"id": 265772,
				"created_at": "2013-10-04T01:24:44Z",
				"first_name": "Giuseppe",
				"last_name": "Hurley",
				"external_id": "241b399ce4b0fd1c84e5528d",
				"title": "Great Person",
				"company": null,
				"photo_url": "https://prod-heroku.s3.amazonaws.com/...",
				"phone_numbers": [{
					"value": "330-281-8004",
					"type": "home"
				}],
				"email_addresses": [{
					"value": "giuseppe.hurley@example.com",
					"type": "personal"
				}],
				"addresses": [{
					"value": "123 Fake St.",
					"type": "home"
				}],
				"website_addresses": [{
					"value": "ghurley.example.com",
					"type": "personal"
				}],
				"social_media_addresses": [{
					"value": "linkedin.example.com/ghurley"
				}],
				"recruiter": {
					"id": 3128,
					"email": "alicia.flopple.3128@example.com",
					"name": "Alicia Flopple"
				},
				"coordinator": {
					"id": 3128,
					"email": "alicia.flopple.3128@example.com",
					"name": "Alicia Flopple"
				},
				"attachments": [{
					"filename": "resume.pdf",
					"url": "https://prod-heroku.s3.amazonaws.com/...",
					"type": "resume"
				}, {
					"filename": "cover_letter.pdf",
					"url": "https://prod-heroku.s3.amazonaws.com/...",
					"type": "cover_letter"
				}, {
					"filename": "portfolio.pdf",
					"url": "https://prod-heroku.s3.amazonaws.com/...",
					"type": "attachment"
				}],
				"tags": [
					"Import from Previous ATS"
				],
				"custom_fields": {
					"favorite_color": {
						"name": "Favorite Color",
						"type": "short_text",
						"value": "Blue"
					}
				}
			},
			"jobs": [{
				"id": 3485,
				"name": "Designer",
				"requisition_id": null,
				"notes": "Digital and print",
				"status": "open",
				"created_at": "2013-10-02T22:59:29Z",
				"opened_at": "2015-01-23T00:25:04Z",
				"closed_at": null,
				"departments": [{
					"id": 237,
					"name": "Community"
				}],
				"offices": [{
					"id": 54,
					"name": "New York",
					"location": "New York, NY"
				}],
				"custom_fields": {
					"employment_type": {
						"name": "Employment Type",
						"type": "single_select",
						"value": "Full Time"
					}
				}
			}]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: ping_event.json]---
Location: zulip-main/zerver/webhooks/greenhouse/fixtures/ping_event.json

```json
{
    "payload":{
        "active":true,
        "created_at":"2018-10-19T16:25:57Z",
        "web_hook_id":9590,
        "name":"Zulip",
        "endpoint_url":"https:\/\/zulip.example.com\/",
        "content-type":"application\/json",
        "updated_at":"2018-10-19T16:49:16Z",
        "event":"Candidate has been hired"
    },
    "action":"ping"
}
```

--------------------------------------------------------------------------------

---[FILE: prospect_created.json]---
Location: zulip-main/zerver/webhooks/greenhouse/fixtures/prospect_created.json

```json
{
  "action": "new_prospect_application",
  "payload": {
    "application": {
      "id": 979554,
      "rejected_at": null,
      "prospect": true,
      "status": "active",
      "applied_at": "2014-12-02T23:10:16Z",
      "last_activity_at": "2014-12-02T23:10:16Z",
      "current_stage": null,
      "source": {
        "id": 13,
        "public_name": "Referral"
      },
      "credited_to": {
        "id": 2622,
        "email": "carl.buddha.2622@example.com",
        "name": "Carl Buddha"
      },
      "rejection_reason": null,
      "candidate": {
        "id": 968190,
        "created_at": "2014-12-02T23:10:16Z",
        "first_name": "Trisha",
        "last_name": "Troy",
        "title": null,
        "company": null,
        "phone_numbers": [
          {
            "value": "123456",
            "type": "other"
          }
        ],
        "email_addresses": [
          {
            "value": "t.troy@example.com",
            "type": "personal"
          }
        ],
        "addresses": [],
        "website_addresses": [],
        "social_media_addresses": [],
        "recruiter": {
          "id": 3128,
          "email": "alicia.flopple.3128@example.com",
          "name": "Alicia Flopple"
        },
        "coordinator": null,
        "photo_url": "https://prod-heroku.s3.amazonaws.com/...",
        "attachments": [
          {
            "filename": "resume.pdf",
            "url": "https://prod-heroku.s3.amazonaws.com/...",
            "type": "resume"
          }
        ],
        "tags": [
          "Import from Previous ATS"
        ],
        "custom_fields": {
          "favorite_color": {
            "name": "Favorite Color",
            "type": "short_text",
            "value": "Blue"
          }
        }
      },
      "jobs": [
        {
          "id": 3485,
          "name": "Designer",
          "requisition_id": null,
          "notes": "Digital and print",
          "job_post_id": 54321,
          "status": "open",
          "created_at": "2013-10-02T22:59:29Z",
          "opened_at": "2015-01-23T00:25:04Z",
          "closed_at": null,
          "departments": [
            {
              "id": 237,
              "name": "Community"
            }
          ],
          "offices": [
            {
              "id": 54,
              "name": "New York",
              "location": "New York, NY"
            }
          ],
          "custom_fields": {
            "employment_type": {
              "name": "Employment Type",
              "type": "single_select",
              "value": "Full Time"
            }
          }
        }
      ]
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/groove/doc.md

```text
# Zulip Groove integration

Get Zulip notifications for your Groove events!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Got to **Settings** on your Groove dashboard. Under **Company**,
   click on **API**. Open the **Add Webhook** dropdown and select one
   of the [events](#filtering-incoming-events) supported by this
   integration.

1. In the space below the event, enter the URL generated above. Click
   **Add Webhook**.

1. Repeat the last two steps, using the same generated URL, for every
   event listed below that you'd like to be notified about.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/groove/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/groove/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class GrooveHookTests(WebhookTestCase):
    CHANNEL_NAME = "groove"
    URL_TEMPLATE = "/api/v1/external/groove?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "groove"

    # This test simulates the condition when a new ticket comes.
    def test_groove_ticket_started(self) -> None:
        expected_topic_name = "notifications"
        expected_message = """
Test Name submitted new ticket [#9: Test Subject](https://ghostfox.groovehq.com/groove_client/tickets/68659446):

``` quote
The content of the body goes here.
```
""".strip()

        self.check_webhook(
            "ticket_started",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    # This simulates the condition when a ticket
    # is assigned to an agent.
    def test_groove_ticket_assigned_agent_only(self) -> None:
        expected_topic_name = "notifications"
        expected_message = "[#9: Test Subject](https://testteam.groovehq.com/groove_client/tickets/68659446) (open) assigned to agent@example.com."
        self.check_webhook(
            "ticket_assigned__agent_only",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    # This simulates the condition when a ticket
    # is assigned to an agent in a group.
    def test_groove_ticket_assigned_agent_and_group(self) -> None:
        expected_topic_name = "notifications"
        expected_message = "[#9: Test Subject](https://testteam.groovehq.com/groove_client/tickets/68659446) (open) assigned to agent@example.com from group2."

        self.check_webhook(
            "ticket_assigned__agent_and_group",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    # This simulates the condition when a ticket
    # is assigned to a group.
    def test_groove_ticket_assigned_group_only(self) -> None:
        expected_topic_name = "notifications"
        expected_message = "[#9: Test Subject](https://testteam.groovehq.com/groove_client/tickets/68659446) (pending) assigned to group2."
        self.check_webhook(
            "ticket_assigned__group_only",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    # This simulates the condition when a ticket
    # is assigned to no one.
    def test_groove_ticket_assigned_no_one(self) -> None:
        self.subscribe(self.test_user, self.CHANNEL_NAME)
        result = self.client_post(
            self.url,
            self.get_body("ticket_assigned__no_one"),
            content_type="application/x-www-form-urlencoded",
            HTTP_X_GROOVE_EVENT="ticket_assigned",
        )
        self.assert_json_success(result)

    # This simulates the notification when an agent replied to a ticket.
    def test_groove_agent_replied(self) -> None:
        expected_topic_name = "notifications"
        expected_message = """
agent@example.com replied to [ticket #776](https://ghostfox.groovehq.com/groove_client/tickets/68667295):

``` quote
Hello , This is a reply from an agent to a ticket
```
""".strip()

        self.check_webhook(
            "agent_replied",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    # This simulates the condition when a customer replied to a ticket.
    def test_groove_customer_replied(self) -> None:
        expected_topic_name = "notifications"
        expected_message = """
rambo@example.com replied to [ticket #440](https://ghostfox.groovehq.com/groove_client/tickets/68666538):

``` quote
Hello agent, thanks for getting back. This is how a reply from customer looks like.
```
""".strip()

        self.check_webhook(
            "customer_replied",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    # This simulates the condition when an agent left a note.
    def test_groove_note_added(self) -> None:
        expected_topic_name = "notifications"
        expected_message = """
anotheragent@example.com left a note on [ticket #776](https://ghostfox.groovehq.com/groove_client/tickets/68667295):

``` quote
This is a note added to  a ticket
```
""".strip()

        self.check_webhook(
            "note_added",
            expected_topic_name,
            expected_message,
            content_type="application/x-ww-form-urlencoded",
        )
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/groove/view.py
Signals: Django

```python
# Webhooks for external integrations.
from collections.abc import Callable

from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.exceptions import UnsupportedWebhookEventTypeError
from zerver.lib.partial import partial
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_int, check_none_or, check_string, check_url
from zerver.lib.webhooks.common import (
    check_send_webhook_message,
    get_http_headers_from_filename,
    validate_extract_webhook_http_header,
)
from zerver.models import UserProfile

TICKET_STARTED_TEMPLATE = """
{customer_name} submitted new ticket [#{number}: {title}]({app_url}):

``` quote
{summary}
```
""".strip()

TICKET_ASSIGNED_TEMPLATE = "[#{number}: {title}]({app_url}) ({state}) assigned to {assignee_info}."

AGENT_REPLIED_TEMPLATE = """
{actor} {action} [ticket #{number}]({app_ticket_url}):

``` quote
{plain_text_body}
```
""".strip()


def ticket_started_body(payload: WildValue) -> str:
    return TICKET_STARTED_TEMPLATE.format(
        customer_name=payload["customer_name"].tame(check_string),
        number=payload["number"].tame(check_int),
        title=payload["title"].tame(check_string),
        app_url=payload["app_url"].tame(check_url),
        summary=payload["summary"].tame(check_string),
    )


def ticket_assigned_body(payload: WildValue) -> str | None:
    state = payload["state"].tame(check_string)
    kwargs = {
        "state": "open" if state == "opened" else state,
        "number": payload["number"].tame(check_int),
        "title": payload["title"].tame(check_string),
        "app_url": payload["app_url"].tame(check_url),
    }

    assignee = payload["assignee"].tame(check_none_or(check_string))
    assigned_group = payload["assigned_group"].tame(check_none_or(check_string))

    if assignee or assigned_group:
        if assignee and assigned_group:
            kwargs["assignee_info"] = f"{assignee} from {assigned_group}"
        elif assignee:
            kwargs["assignee_info"] = f"{assignee}"
        elif assigned_group:
            kwargs["assignee_info"] = f"{assigned_group}"

        return TICKET_ASSIGNED_TEMPLATE.format(**kwargs)
    else:
        return None


def replied_body(actor: str, action: str, payload: WildValue) -> str:
    actor_url = "http://api.groovehq.com/v1/{}/".format(actor + "s")
    actor = payload["links"]["author"]["href"].tame(check_url).split(actor_url)[1]
    number = (
        payload["links"]["ticket"]["href"]
        .tame(check_url)
        .split("http://api.groovehq.com/v1/tickets/")[1]
    )

    body = AGENT_REPLIED_TEMPLATE.format(
        actor=actor,
        action=action,
        number=number,
        app_ticket_url=payload["app_ticket_url"].tame(check_url),
        plain_text_body=payload["plain_text_body"].tame(check_string),
    )

    return body


EVENTS_FUNCTION_MAPPER: dict[str, Callable[[WildValue], str | None]] = {
    "ticket_started": ticket_started_body,
    "ticket_assigned": ticket_assigned_body,
    "agent_replied": partial(replied_body, "agent", "replied to"),
    "customer_replied": partial(replied_body, "customer", "replied to"),
    "note_added": partial(replied_body, "agent", "left a note on"),
}

ALL_EVENT_TYPES = list(EVENTS_FUNCTION_MAPPER.keys())


@webhook_view("Groove", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_groove_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    event = validate_extract_webhook_http_header(request, "X-Groove-Event", "Groove")
    handler = EVENTS_FUNCTION_MAPPER.get(event)
    if handler is None:
        raise UnsupportedWebhookEventTypeError(event)

    body = handler(payload)
    topic_name = "notifications"

    if body is not None:
        check_send_webhook_message(request, user_profile, topic_name, body, event)

    return json_success(request)


fixture_to_headers = get_http_headers_from_filename("HTTP_X_GROOVE_EVENT")
```

--------------------------------------------------------------------------------

---[FILE: agent_replied.json]---
Location: zulip-main/zerver/webhooks/groove/fixtures/agent_replied.json

```json
{
    "links": {
        "author": {
            "href": "http://api.groovehq.com/v1/agents/agent@example.com"
        },
        "recipient": {
            "href": "http://api.groovehq.com/v1/customers/rambo@example.com"
        },
        "ticket": {
            "href": "http://api.groovehq.com/v1/tickets/776"
        }
    },
    "created_at": "2017-12-14 21:17:29 +0530",
    "updated_at": "2017-12-14 21:17:29 +0530",
    "note": false,
    "id": "5308968422",
    "body": "Hello , This is a reply from an agent to a ticket",
    "href": "http://api.groovehq.com/v1/messages/5308968422",
    "plain_text_body": "Hello , This is a reply from an agent to a ticket",
    "agent_response": true,
    "type": "Comment",
    "attachments": [],
    "deliver_by": null,
    "app_ticket_url": "https://ghostfox.groovehq.com/groove_client/tickets/68667295"
}
```

--------------------------------------------------------------------------------

---[FILE: customer_replied.json]---
Location: zulip-main/zerver/webhooks/groove/fixtures/customer_replied.json

```json
{
    "links": {
        "author": {
            "href": "http://api.groovehq.com/v1/customers/rambo@example.com"
        },
        "ticket": {
            "href": "http://api.groovehq.com/v1/tickets/440"
        }
    },
    "created_at": "2017-12-14 15:54:26 UTC",
    "updated_at": "2017-12-14 15:54:26 UTC",
    "note": false,
    "id": "4810291604",
    "body": "<p>Hello agent, thanks for getting back. This is how a reply from customer looks like.</p>",
    "href": "http://api.groovehq.com/v1/messages/4810291604",
    "plain_text_body": "Hello agent, thanks for getting back. This is how a reply from customer looks like.",
    "agent_response": false,
    "type": null,
    "attachments": [],
    "deliver_by": null,
    "app_ticket_url": "https://ghostfox.groovehq.com/groove_client/tickets/68666538"
}
```

--------------------------------------------------------------------------------

---[FILE: note_added.json]---
Location: zulip-main/zerver/webhooks/groove/fixtures/note_added.json

```json
{
    "links": {
        "author": {
            "href": "http://api.groovehq.com/v1/agents/anotheragent@example.com"
        },
        "ticket": {
            "href": "http://api.groovehq.com/v1/tickets/776"
        }
    },
    "created_at": "2017-12-14 15:53:33 UTC",
    "updated_at": "2017-12-14 15:53:33 UTC",
    "note": true,
    "id": "4658911092",
    "body": "<div>This is a note added to a ticket.\n</div>",
    "href": "http://api.groovehq.com/v1/messages/4658911092",
    "plain_text_body": "This is a note added to  a ticket",
    "agent_response": true,
    "type": null,
    "attachments": [],
    "deliver_by": null,
    "app_ticket_url": "https://ghostfox.groovehq.com/groove_client/tickets/68667295"
}
```

--------------------------------------------------------------------------------

````
