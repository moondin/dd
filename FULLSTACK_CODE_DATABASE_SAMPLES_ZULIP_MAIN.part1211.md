---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1211
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1211 of 1290)

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

---[FILE: ticket_assigned__agent_and_group.json]---
Location: zulip-main/zerver/webhooks/groove/fixtures/ticket_assigned__agent_and_group.json

```json
{
    "created_at": "2017-12-14 20:09:19 +0530",
    "href": "http://api.groovehq.com/v1/tickets/9",
    "links": {
        "customer": {
            "id": "0070883940",
            "href": "http://api.groovehq.com/v1/customers/customer@example.com"
        },
        "drafts": {
            "href": "http://api.groovehq.com/v1/tickets/9/drafts"
        },
        "state": {
            "href": "http://api.groovehq.com/v1/tickets/9/state"
        },
        "messages": {
            "href": "http://api.groovehq.com/v1/tickets/9/messages"
        },
        "assignee": {
            "id": "1734497920",
            "href": "http://api.groovehq.com/v1/agents/agent@example.com"
        }
    },
    "number": 9,
    "priority": "low",
    "resolution_time": null,
    "state": "opened",
    "title": "Test Subject",
    "updated_at": "2017-12-14 20:52:26 +0530",
    "system_updated_at": "2017-12-14 20:52:26 +0530",
    "assigned_group_id": "1414937220",
    "assigned_group": "group2",
    "closed_by": null,
    "tags": [],
    "tag_ids": [],
    "mailbox": "Inbox",
    "mailbox_id": "5063661921",
    "message_count": 1,
    "attachment_count": 0,
    "summary": "The content of the body goes here.",
    "search_summary": null,
    "last_message_type": "enduser",
    "last_message_author": {
        "id": "1734497920",
        "type": "Agent"
    },
    "type": "Widget",
    "snoozed_until": null,
    "snoozed_by_id": null,
    "interaction_count": 1,
    "state_changed_at": "2017-12-14 20:09:19 +0530",
    "assigned_at": "2017-12-14 20:52:26 +0530",
    "deleted_at": null,
    "browser": null,
    "page_title": null,
    "page_url": null,
    "platform": null,
    "last_message": "The content of the body goes here.",
    "assignee": "agent@example.com",
    "app_url": "https://testteam.groovehq.com/groove_client/tickets/68659446",
    "app_customer_url": "https://testteam.groovehq.com/groove_client/contacts/customers/49825873",
    "customer_name": "Test Name",
    "last_message_plain_text": "The content of the body goes here."
}
```

--------------------------------------------------------------------------------

---[FILE: ticket_assigned__agent_only.json]---
Location: zulip-main/zerver/webhooks/groove/fixtures/ticket_assigned__agent_only.json

```json
{
    "created_at": "2017-12-14 20:09:19 +0530",
    "href": "http://api.groovehq.com/v1/tickets/9",
    "links": {
        "customer": {
            "id": "0070883940",
            "href": "http://api.groovehq.com/v1/customers/customer@example.lcom"
        },
        "drafts": {
            "href": "http://api.groovehq.com/v1/tickets/9/drafts"
        },
        "state": {
            "href": "http://api.groovehq.com/v1/tickets/9/state"
        },
        "messages": {
            "href": "http://api.groovehq.com/v1/tickets/9/messages"
        },
        "assignee": {
            "id": "9804030737",
            "href": "http://api.groovehq.com/v1/agents/agent@example.com"
        }
    },
    "number": 9,
    "priority": "low",
    "resolution_time": null,
    "state": "opened",
    "title": "Test Subject",
    "updated_at": "2017-12-14 20:17:57 +0530",
    "system_updated_at": "2017-12-14 20:17:57 +0530",
    "assigned_group_id": null,
    "assigned_group": null,
    "closed_by": null,
    "tags": [],
    "tag_ids": [],
    "mailbox": "Inbox",
    "mailbox_id": "5063661921",
    "message_count": 1,
    "attachment_count": 0,
    "summary": "The content of the body goes here.",
    "search_summary": null,
    "last_message_type": "enduser",
    "last_message_author": {
        "id": "1734497920",
        "type": "Agent"
    },
    "type": "Widget",
    "snoozed_until": null,
    "snoozed_by_id": null,
    "interaction_count": 1,
    "state_changed_at": "2017-12-14 20:09:19 +0530",
    "assigned_at": "2017-12-14 20:17:57 +0530",
    "deleted_at": null,
    "browser": null,
    "page_title": null,
    "page_url": null,
    "platform": null,
    "last_message": "The content of the body goes here.",
    "assignee": "agent@example.com",
    "app_url": "https://testteam.groovehq.com/groove_client/tickets/68659446",
    "app_customer_url": "https://testteam.groovehq.com/groove_client/contacts/customers/49825873",
    "customer_name": "Test Name",
    "last_message_plain_text": "The content of the body goes here."
}
```

--------------------------------------------------------------------------------

---[FILE: ticket_assigned__group_only.json]---
Location: zulip-main/zerver/webhooks/groove/fixtures/ticket_assigned__group_only.json

```json
{
    "created_at": "2017-12-14 20:09:19 +0530",
    "href": "http://api.groovehq.com/v1/tickets/9",
    "links": {
        "customer": {
            "id": "0070883940",
            "href": "http://api.groovehq.com/v1/customers/customer@example.com"
        },
        "drafts": {
            "href": "http://api.groovehq.com/v1/tickets/9/drafts"
        },
        "state": {
            "href": "http://api.groovehq.com/v1/tickets/9/state"
        },
        "messages": {
            "href": "http://api.groovehq.com/v1/tickets/9/messages"
        }
    },
    "number": 9,
    "priority": "low",
    "resolution_time": null,
    "state": "pending",
    "title": "Test Subject",
    "updated_at": "2017-12-14 20:52:26 +0530",
    "system_updated_at": "2017-12-14 20:52:26 +0530",
    "assigned_group_id": "1414937220",
    "assigned_group": "group2",
    "closed_by": null,
    "tags": [],
    "tag_ids": [],
    "mailbox": "Inbox",
    "mailbox_id": "5063661921",
    "message_count": 1,
    "attachment_count": 0,
    "summary": "The content of the body goes here.",
    "search_summary": null,
    "last_message_type": "enduser",
    "last_message_author": {
        "id": "1734497920",
        "type": "Agent"
    },
    "type": "Widget",
    "snoozed_until": null,
    "snoozed_by_id": null,
    "interaction_count": 1,
    "state_changed_at": "2017-12-14 20:09:19 +0530",
    "assigned_at": "2017-12-14 20:52:26 +0530",
    "deleted_at": null,
    "browser": null,
    "page_title": null,
    "page_url": null,
    "platform": null,
    "last_message": "The content of the body goes here.",
    "assignee": null,
    "app_url": "https://testteam.groovehq.com/groove_client/tickets/68659446",
    "app_customer_url": "https://testteam.groovehq.com/groove_client/contacts/customers/49825873",
    "customer_name": "Test Name",
    "last_message_plain_text": "The content of the body goes here."
}
```

--------------------------------------------------------------------------------

---[FILE: ticket_assigned__no_one.json]---
Location: zulip-main/zerver/webhooks/groove/fixtures/ticket_assigned__no_one.json

```json
{
    "created_at": "2017-12-14 20:09:19 +0530",
    "href": "http://api.groovehq.com/v1/tickets/9",
    "links": {
        "customer": {
            "id": "0070883940",
            "href": "http://api.groovehq.com/v1/customers/customer@example.lcom"
        },
        "drafts": {
            "href": "http://api.groovehq.com/v1/tickets/9/drafts"
        },
        "state": {
            "href": "http://api.groovehq.com/v1/tickets/9/state"
        },
        "messages": {
            "href": "http://api.groovehq.com/v1/tickets/9/messages"
        }
    },
    "number": 9,
    "priority": "low",
    "resolution_time": null,
    "state": "closed",
    "title": "Test Subject",
    "updated_at": "2017-12-14 20:17:57 +0530",
    "system_updated_at": "2017-12-14 20:17:57 +0530",
    "assigned_group_id": null,
    "assigned_group": null,
    "closed_by": null,
    "tags": [],
    "tag_ids": [],
    "mailbox": "Inbox",
    "mailbox_id": "5063661921",
    "message_count": 1,
    "attachment_count": 0,
    "summary": "The content of the body goes here.",
    "search_summary": null,
    "last_message_type": "enduser",
    "last_message_author": {
        "id": "1734497920",
        "type": "Agent"
    },
    "type": "Widget",
    "snoozed_until": null,
    "snoozed_by_id": null,
    "interaction_count": 1,
    "state_changed_at": "2017-12-14 20:09:19 +0530",
    "assigned_at": "2017-12-14 20:17:57 +0530",
    "deleted_at": null,
    "browser": null,
    "page_title": null,
    "page_url": null,
    "platform": null,
    "last_message": "The content of the body goes here.",
    "assignee": null,
    "app_url": "https://testteam.groovehq.com/groove_client/tickets/68659446",
    "app_customer_url": "https://testteam.groovehq.com/groove_client/contacts/customers/49825873",
    "customer_name": "Test Name",
    "last_message_plain_text": "The content of the body goes here."
}
```

--------------------------------------------------------------------------------

---[FILE: ticket_started.json]---
Location: zulip-main/zerver/webhooks/groove/fixtures/ticket_started.json

```json
{
    "created_at": "2017-12-14 20:09:19 +0530",
    "href": "http://api.groovehq.com/v1/tickets/9",
    "links": {
        "customer": {
            "id": "0070883940",
            "href": "http://api.groovehq.com/v1/customers/customer@example.lcom"
        },
        "drafts": {
            "href": "http://api.groovehq.com/v1/tickets/9/drafts"
        },
        "state": {
            "href": "http://api.groovehq.com/v1/tickets/9/state"
        },
        "messages": {
            "href": "http://api.groovehq.com/v1/tickets/9/messages"
        }
    },
    "number": 9,
    "priority": "low",
    "resolution_time": null,
    "state": "opened",
    "title": "Test Subject",
    "updated_at": "2017-12-14 20:09:19 +0530",
    "system_updated_at": "2017-12-14 20:09:19 +0530",
    "assigned_group_id": null,
    "assigned_group": null,
    "closed_by": null,
    "tags": [],
    "tag_ids": [],
    "mailbox": "Inbox",
    "mailbox_id": "5063661921",
    "message_count": 1,
    "attachment_count": 0,
    "summary": "The content of the body goes here.",
    "search_summary": null,
    "last_message_type": "enduser",
    "last_message_author": {
        "id": "1734497920",
        "type": "Agent"
    },
    "type": "Widget",
    "snoozed_until": null,
    "snoozed_by_id": null,
    "interaction_count": 1,
    "state_changed_at": "2017-12-14 20:09:19 +0530",
    "assigned_at": null,
    "deleted_at": null,
    "browser": null,
    "page_title": null,
    "page_url": null,
    "platform": null,
    "last_message": "The content of the body goes here.",
    "assignee": null,
    "app_url": "https://ghostfox.groovehq.com/groove_client/tickets/68659446",
    "app_customer_url": "https://ghostfox.groovehq.com/groove_client/contacts/customers/49825873",
    "customer_name": "Test Name",
    "last_message_plain_text": "The content of the body goes here."
}
```

--------------------------------------------------------------------------------

---[FILE: ticket_state_changed.json]---
Location: zulip-main/zerver/webhooks/groove/fixtures/ticket_state_changed.json

```json
{
    "href": "/v1/tickets/776",
    "state": "pending",
    "ticket_number": 776,
    "ticket": {
        "created_at": "2017-12-14 21:12:24 +0530",
        "href": "http://api.groovehq.com/v1/tickets/776",
        "links": {
            "customer": {
                "id": "6383949050",
                "href": "http://api.groovehq.com/v1/customers/rambo@example.com"
            },
            "drafts": {
                "href": "http://api.groovehq.com/v1/tickets/776/drafts"
            },
            "state": {
                "href": "http://api.groovehq.com/v1/tickets/776/state"
            },
            "messages": {
                "href": "http://api.groovehq.com/v1/tickets/776/messages"
            },
            "assignee": {
                "id": "1734497920",
                "href": "http://api.groovehq.com/v1/agents/agent@example.com"
            }
        },
        "number": 776,
        "priority": "low",
        "resolution_time": null,
        "state": "pending",
        "title": "Subject will be here",
        "updated_at": "2017-12-14 21:17:29 +0530",
        "system_updated_at": "2017-12-14 21:17:29 +0530",
        "assigned_group_id": null,
        "assigned_group": null,
        "closed_by": null,
        "tags": [],
        "tag_ids": [],
        "mailbox": "Inbox",
        "mailbox_id": "5063661921",
        "message_count": 2,
        "attachment_count": 0,
        "summary": "Hello , This is a reply from an agent to a ticket",
        "search_summary": null,
        "last_message_type": "enduser",
        "last_message_author": {
            "id": "1734497920",
            "type": "Agent"
        },
        "type": "Email",
        "snoozed_until": null,
        "snoozed_by_id": null,
        "interaction_count": 4,
        "state_changed_at": "2017-12-14 21:17:29 +0530",
        "assigned_at": "2017-12-14 21:17:29 +0530",
        "deleted_at": null,
        "browser": null,
        "page_title": null,
        "page_url": null,
        "platform": null,
        "last_message": "Hello , This is a reply from an agent to a ticket",
        "assignee": "agent@example.com",
        "app_url": "https://ghostfox.groovehq.com/groove_client/tickets/68667295",
        "app_customer_url": "https://ghostfox.groovehq.com/groove_client/contacts/customers/49829231",
        "customer_name": "RAMBO",
        "last_message_plain_text": "Hello , This is a reply from an agent to a ticket"
    },
    "app_url": "https://ghostfox.groovehq.com/groove_client/tickets/68667295"
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/harbor/doc.md

```text
# Zulip Harbor integration

Get Zulip notifications for your [Harbor](https://goharbor.io/) projects!

Harbor's webhooks feature is available in version 1.9 and later.

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to your Harbor **Projects** page, open a project, and click on the **Webhooks** tab.

1. Set **Endpoint URL** to the URL generated above, and click on **Continue**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/harbor/001.png)

{% if all_event_types is defined %}

{!event-filtering-additional-feature.md!}

{% endif %}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/harbor/tests.py

```python
from unittest.mock import MagicMock, patch

from zerver.lib.test_classes import WebhookTestCase


class HarborHookTests(WebhookTestCase):
    CHANNEL_NAME = "harbor"
    URL_TEMPLATE = "/api/v1/external/harbor?api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "harbor"

    def test_push_image(self) -> None:
        expected_topic_name = "example/test"
        expected_message = """**admin** pushed image `example/test:latest`"""
        self.check_webhook("push_image", expected_topic_name, expected_message)

    @patch("zerver.lib.webhooks.common.check_send_webhook_message")
    def test_delete_image_ignored(self, check_send_webhook_message_mock: MagicMock) -> None:
        self.url = self.build_webhook_url()
        payload = self.get_body("delete_image")
        result = self.client_post(self.url, payload, content_type="application/json")
        self.assertFalse(check_send_webhook_message_mock.called)
        self.assert_json_success(result)

    def test_scanning_completed(self) -> None:
        expected_topic_name = "test/alpine/helm"

        expected_message = """
Image scan completed for `test/alpine/helm:3.8.1`. Vulnerabilities by severity:

* High: **4**
* Unknown: **1**
        """.strip()

        self.check_webhook("scanning_completed", expected_topic_name, expected_message)

    def test_scanning_completed_no_vulnerability(self) -> None:
        expected_topic_name = "test123/test-image"

        expected_message = """
Image scan completed for `test123/test-image:latest`. Vulnerabilities by severity:

None
        """.strip()

        self.check_webhook(
            "scanning_completed_no_vulnerability", expected_topic_name, expected_message
        )

    def test_scanning_completed_no_tag(self) -> None:
        expected_topic_name = "test/alpine/helm"

        expected_message = """
Image scan completed for `test/alpine/helm@sha256:b50334049354ed01330403212605dce2f4676a4e787ed113506861d9cf3c5424`. Vulnerabilities by severity:

* High: **4**
* Unknown: **1**
        """.strip()

        self.check_webhook("scanning_completed_no_tag", expected_topic_name, expected_message)
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/harbor/view.py
Signals: Django

```python
# Webhooks for external integrations.

from django.db.models import Q
from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.exceptions import UnsupportedWebhookEventTypeError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_int, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import Realm, UserProfile

IGNORED_EVENTS = [
    "DOWNLOAD_CHART",
    "DELETE_CHART",
    "UPLOAD_CHART",
    "PULL_ARTIFACT",
    "DELETE_ARTIFACT",
    "SCANNING_FAILED",
]


def guess_zulip_user_from_harbor(harbor_username: str, realm: Realm) -> UserProfile | None:
    try:
        # Try to find a matching user in Zulip
        # We search a user's full name, short name,
        # and beginning of email address
        user = UserProfile.objects.filter(
            Q(full_name__iexact=harbor_username) | Q(email__istartswith=harbor_username),
            is_active=True,
            realm=realm,
        ).order_by("id")[0]
        return user  # nocoverage
    except IndexError:
        return None


def image_id(payload: WildValue) -> str:
    image_name = payload["event_data"]["repository"]["repo_full_name"].tame(check_string)
    resource = payload["event_data"]["resources"][0]
    if "tag" in resource:
        return image_name + ":" + resource["tag"].tame(check_string)
    else:
        return image_name + "@" + resource["digest"].tame(check_string)


def handle_push_image_event(
    payload: WildValue, user_profile: UserProfile, operator_username: str
) -> str:
    return f"{operator_username} pushed image `{image_id(payload)}`"


SCANNING_COMPLETED_TEMPLATE = """
Image scan completed for `{image_id}`. Vulnerabilities by severity:

{scan_results}
""".strip()


def handle_scanning_completed_event(
    payload: WildValue, user_profile: UserProfile, operator_username: str
) -> str:
    scan_results = ""
    scan_overview = payload["event_data"]["resources"][0]["scan_overview"]
    if "application/vnd.security.vulnerability.report; version=1.1" not in scan_overview:
        raise UnsupportedWebhookEventTypeError(str(list(scan_overview.keys())))
    scan_summaries = scan_overview["application/vnd.security.vulnerability.report; version=1.1"][
        "summary"
    ]["summary"]
    if len(scan_summaries) > 0:
        for severity, count in scan_summaries.items():
            scan_results += f"* {severity}: **{count.tame(check_int)}**\n"
    else:
        scan_results += "None\n"

    return SCANNING_COMPLETED_TEMPLATE.format(
        image_id=image_id(payload),
        scan_results=scan_results,
    )


EVENT_FUNCTION_MAPPER = {
    "PUSH_ARTIFACT": handle_push_image_event,
    "SCANNING_COMPLETED": handle_scanning_completed_event,
}

ALL_EVENT_TYPES = list(EVENT_FUNCTION_MAPPER.keys())


@webhook_view("Harbor", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_harbor_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    operator_username = "**{}**".format(payload["operator"].tame(check_string))

    if operator_username != "auto":
        operator_profile = guess_zulip_user_from_harbor(operator_username, user_profile.realm)

    if operator_profile:
        operator_username = f"@**{operator_profile.full_name}**"  # nocoverage

    event = payload["type"].tame(check_string)
    topic_name = payload["event_data"]["repository"]["repo_full_name"].tame(check_string)

    if event in IGNORED_EVENTS:
        return json_success(request)

    content_func = EVENT_FUNCTION_MAPPER.get(event)

    if content_func is None:
        raise UnsupportedWebhookEventTypeError(event)

    content: str = content_func(payload, user_profile, operator_username)

    check_send_webhook_message(
        request, user_profile, topic_name, content, event, unquote_url_parameters=True
    )
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: delete_image.json]---
Location: zulip-main/zerver/webhooks/harbor/fixtures/delete_image.json

```json
{
    "type": "DELETE_ARTIFACT",
    "occur_at": 1571334977,
    "event_data": {
        "resources": [
            {
                "digest": "sha256:59856107563b1e1b2e48c8635e5cb44fa9b194f6a425e0b668917602213bb5b4",
                "tag": "latest",
                "resource_url": "harbor.example.com/example/test:latest"
            }
        ],
        "repository": {
            "date_created": 1571333978,
            "name": "test",
            "namespace": "example",
            "repo_full_name": "example/test",
            "repo_type": "private"
        }
    },
    "operator": "admin"
}
```

--------------------------------------------------------------------------------

---[FILE: push_image.json]---
Location: zulip-main/zerver/webhooks/harbor/fixtures/push_image.json

```json
{
    "type": "PUSH_ARTIFACT",
    "occur_at": 1571334632,
    "event_data": {
        "resources": [
            {
                "digest": "sha256:d72f37f783ed6a8d58ac70b4db052707d1ec9d4ea010ef5ccd84652faf9ed844",
                "tag": "latest",
                "resource_url": "harbor.example.com/example/test:latest"
            }
        ],
        "repository": {
            "date_created": 1571334632,
            "name": "test",
            "namespace": "example",
            "repo_full_name": "example/test",
            "repo_type": "private"
        }
    },
    "operator": "admin"
}
```

--------------------------------------------------------------------------------

---[FILE: scanning_completed.json]---
Location: zulip-main/zerver/webhooks/harbor/fixtures/scanning_completed.json

```json
{
    "type": "SCANNING_COMPLETED",
    "occur_at": 1648715576,
    "operator": "auto",
    "event_data": {
      "resources": [
        {
          "digest": "sha256:b50334049354ed01330403212605dce2f4676a4e787ed113506861d9cf3c5424",
          "tag": "3.8.1",
          "resource_url": "harbor.xxx.xxxx.com/test/alpine/helm:3.8.1",
          "scan_overview": {
            "application/vnd.security.vulnerability.report; version=1.1": {
              "report_id": "65e8a295-749c-44e2-93fe-2ebb49b9e51a",
              "scan_status": "Success",
              "severity": "High",
              "duration": 3,
              "summary": {
                "total": 5,
                "fixable": 5,
                "summary": {
                  "High": 4,
                  "Unknown": 1
                }
              },
              "start_time": "2022-03-31T08:32:53Z",
              "end_time": "2022-03-31T08:32:56Z",
              "scanner": {
                "name": "Trivy",
                "vendor": "Aqua Security",
                "version": "v0.20.1"
              },
              "complete_percent": 100
            }
          }
        }
      ],
      "repository": {
        "name": "alpine/helm",
        "namespace": "test",
        "repo_full_name": "test/alpine/helm",
        "repo_type": "private"
      }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: scanning_completed_no_tag.json]---
Location: zulip-main/zerver/webhooks/harbor/fixtures/scanning_completed_no_tag.json

```json
{
    "type": "SCANNING_COMPLETED",
    "occur_at": 1648715576,
    "operator": "auto",
    "event_data": {
      "resources": [
        {
          "digest": "sha256:b50334049354ed01330403212605dce2f4676a4e787ed113506861d9cf3c5424",
          "resource_url": "harbor.xxx.xxxx.com/test/alpine/helm:3.8.1",
            "scan_overview": {
                "application/vnd.security.vulnerability.report; version=1.1": {
                    "report_id": "65e8a295-749c-44e2-93fe-2ebb49b9e51a",
                    "scan_status": "Success",
                    "severity": "High",
                    "duration": 3,
                    "summary": {
                        "total": 5,
                        "fixable": 5,
                        "summary": {
                            "High": 4,
                            "Unknown": 1
                        }
                    },
                    "start_time": "2022-03-31T08:32:53Z",
                    "end_time": "2022-03-31T08:32:56Z",
                    "scanner": {
                        "name": "Trivy",
                        "vendor": "Aqua Security",
                        "version": "v0.20.1"
                    },
                    "complete_percent": 100
                }
            }
        }
      ],
      "repository": {
        "name": "alpine/helm",
        "namespace": "test",
        "repo_full_name": "test/alpine/helm",
        "repo_type": "private"
      }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: scanning_completed_no_vulnerability.json]---
Location: zulip-main/zerver/webhooks/harbor/fixtures/scanning_completed_no_vulnerability.json

```json
{
    "type": "SCANNING_COMPLETED",
    "occur_at": 1655522951,
    "operator": "auto",
    "event_data": {
        "resources": [
            {
                "digest": "sha256:59856107563b1e1b2e48c8635e5cb44fa9b194f6a425e0b668917602213bb5b4",
                "tag": "latest",
                "resource_url": "demo.goharbor.io/test123/test-image:latest",
                "scan_overview": {
                    "application/vnd.security.vulnerability.report; version=1.1": {
                        "report_id": "f316b072-38e4-41b1-a1da-91ec0b2e7767",
                        "scan_status": "Success",
                        "severity": "None",
                        "duration": 8,
                        "summary": {
                            "total": 0,
                            "fixable": 0,
                            "summary": {}
                        },
                        "start_time": "2022-06-18T03:29:03Z",
                        "end_time": "2022-06-18T03:29:11Z",
                        "scanner": {
                            "name": "Trivy",
                            "vendor": "Aqua Security",
                            "version": "v0.24.2"
                        },
                        "complete_percent": 100
                    }
                }
            }
        ],
        "repository": {
            "name": "test-image",
            "namespace": "test123",
            "repo_full_name": "test123/test-image",
            "repo_type": "public"
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/hellosign/doc.md

```text
# Zulip HelloSign integration

Configuring the HelloSign integration is easy!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to your HelloSign account **Settings**. Select **Integrations**,
   and click on **API**.

1. Set **Account Callback** to the URL generated above. Click **Test**
   to send a test notification to your Zulip organization.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/hellosign/001.png)

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/hellosign/tests.py

```python
from typing_extensions import override

from zerver.lib.test_classes import WebhookTestCase


class HelloSignHookTests(WebhookTestCase):
    CHANNEL_NAME = "hellosign"
    URL_TEMPLATE = "/api/v1/external/hellosign?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "hellosign"

    def test_signatures_message(self) -> None:
        expected_topic_name = "NDA with Acme Co."
        expected_message = (
            "The `NDA with Acme Co.` document is awaiting the signature of "
            "Jack, and was just signed by Jill."
        )
        self.check_webhook("signatures", expected_topic_name, expected_message, content_type=None)

    def test_signatures_message_signed_by_one(self) -> None:
        expected_topic_name = "NDA with Acme Co."
        expected_message = "The `NDA with Acme Co.` document was just signed by Jill."
        self.check_webhook(
            "signatures_signed_by_one_signatory",
            expected_topic_name,
            expected_message,
            content_type=None,
        )

    def test_signatures_message_with_four_signatories(self) -> None:
        expected_topic_name = "Signature doc"
        expected_message = (
            "The `Signature doc` document is awaiting the signature of "
            "Eeshan Garg, John Smith, Jane Doe, and Stephen Strange."
        )
        self.check_webhook(
            "signatures_with_four_signatories",
            expected_topic_name,
            expected_message,
            content_type=None,
        )

    def test_signatures_message_with_own_subject(self) -> None:
        expected_topic_name = "Our own subject."
        self.url = self.build_webhook_url(topic=expected_topic_name)
        expected_message = (
            "The `NDA with Acme Co.` document is awaiting the signature of "
            "Jack, and was just signed by Jill."
        )
        self.check_webhook(
            "signatures_with_own_subject",
            expected_topic_name,
            expected_message,
            content_type=None,
            topic=expected_topic_name,
        )

    @override
    def get_payload(self, fixture_name: str) -> dict[str, str]:
        return {"json": self.webhook_fixture_data("hellosign", fixture_name, file_type="json")}
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/hellosign/view.py
Signals: Django, Pydantic

```python
from typing import Annotated

from django.http import HttpRequest, HttpResponse
from pydantic import Json

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import ApiParamConfig, typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

IS_AWAITING_SIGNATURE = "is awaiting the signature of {awaiting_recipients}"
WAS_JUST_SIGNED_BY = "was just signed by {signed_recipients}"
BODY = "The `{contract_title}` document {actions}."


def get_message_body(payload: WildValue) -> str:
    contract_title = payload["signature_request"]["title"].tame(check_string)
    recipients: dict[str, list[str]] = {}
    signatures = payload["signature_request"]["signatures"]

    for signature in signatures:
        status_code = signature["status_code"].tame(check_string)
        recipients.setdefault(status_code, [])
        recipients[status_code].append(signature["signer_name"].tame(check_string))

    recipients_text = ""
    if recipients.get("awaiting_signature"):
        recipients_text += IS_AWAITING_SIGNATURE.format(
            awaiting_recipients=get_recipients_text(recipients["awaiting_signature"]),
        )

    if recipients.get("signed"):
        text = WAS_JUST_SIGNED_BY.format(
            signed_recipients=get_recipients_text(recipients["signed"]),
        )

        if recipients_text:
            recipients_text = f"{recipients_text}, and {text}"
        else:
            recipients_text = text

    return BODY.format(contract_title=contract_title, actions=recipients_text).strip()


def get_recipients_text(recipients: list[str]) -> str:
    recipients_text = ""
    if len(recipients) == 1:
        recipients_text = "{}".format(*recipients)
    else:
        for recipient in recipients[:-1]:
            recipients_text += f"{recipient}, "
        recipients_text += f"and {recipients[-1]}"

    return recipients_text


@webhook_view("HelloSign")
@typed_endpoint
def api_hellosign_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: Annotated[Json[WildValue], ApiParamConfig("json")],
) -> HttpResponse:
    if "signature_request" in payload:
        body = get_message_body(payload)
        topic_name = payload["signature_request"]["title"].tame(check_string)
        check_send_webhook_message(request, user_profile, topic_name, body)

    return json_success(request, data={"msg": "Hello API Event Received"})
```

--------------------------------------------------------------------------------

---[FILE: signatures.json]---
Location: zulip-main/zerver/webhooks/hellosign/fixtures/signatures.json

```json
{
	"signature_request": {
		"signature_request_id": "2b388914e3ae3b738bd4e2ee2850c677e6dc53d2",
		"title": "NDA with Acme Co.",
		"subject": "The NDA we talked about",
		"message": "Please sign this NDA and then we can discuss more. Let me know if you have any questions.",
		"test_mode": true,
		"metadata": {
			"custom_id": "1234",
			"custom_text": "NDA #9"
		},
		"is_complete": false,
		"is_declined": false,
		"has_error": false,
		"custom_fields": [],
		"response_data": [],
		"signing_url": "https://www.hellosign.com/sign/2b388914e3ae3b738bd4e2ee2850c677e6dc53d2",
		"signing_redirect_url": null,
		"final_copy_uri": "/v3/signature_request/final_copy/2b388914e3ae3b738bd4e2ee2850c677e6dc53d2",
		"files_url": "https://api.hellosign.com/v3/signature_request/files/2b388914e3ae3b738bd4e2ee2850c677e6dc53d2",
		"details_url": "https://www.hellosign.com/home/manage?guid=2b388914e3ae3b738bd4e2ee2850c677e6dc53d2",
		"requester_email_address": "me@hellosign.com",
		"signatures": [{
			"signature_id": "78caf2a1d01cd39cea2bc1cbb340dac3",
			"signer_email_address": "jack@example.com",
			"signer_name": "Jack",
			"order": 0,
			"status_code": "awaiting_signature",
			"signed_at": null,
			"last_viewed_at": null,
			"last_reminded_at": null,
			"has_pin": false
		}, {
			"signature_id": "616629ed37f8588d28600be17ab5d6b7",
			"signer_email_address": "jill@example.com",
			"signer_name": "Jill",
			"order": 1,
			"status_code": "signed",
			"signed_at": null,
			"last_viewed_at": null,
			"last_reminded_at": null,
			"has_pin": false
		}],
		"cc_email_addresses": [
			"lawyer1@hellosign.com",
			"lawyer2@example.com"
		]
	}
}
```

--------------------------------------------------------------------------------

---[FILE: signatures_signed_by_one_signatory.json]---
Location: zulip-main/zerver/webhooks/hellosign/fixtures/signatures_signed_by_one_signatory.json

```json
{
	"signature_request": {
		"signature_request_id": "2b388914e3ae3b738bd4e2ee2850c677e6dc53d2",
		"title": "NDA with Acme Co.",
		"subject": "The NDA we talked about",
		"message": "Please sign this NDA and then we can discuss more. Let me know if you have any questions.",
		"test_mode": true,
		"metadata": {
			"custom_id": "1234",
			"custom_text": "NDA #9"
		},
		"is_complete": false,
		"is_declined": false,
		"has_error": false,
		"custom_fields": [],
		"response_data": [],
		"signing_url": "https://www.hellosign.com/sign/2b388914e3ae3b738bd4e2ee2850c677e6dc53d2",
		"signing_redirect_url": null,
		"final_copy_uri": "/v3/signature_request/final_copy/2b388914e3ae3b738bd4e2ee2850c677e6dc53d2",
		"files_url": "https://api.hellosign.com/v3/signature_request/files/2b388914e3ae3b738bd4e2ee2850c677e6dc53d2",
		"details_url": "https://www.hellosign.com/home/manage?guid=2b388914e3ae3b738bd4e2ee2850c677e6dc53d2",
		"requester_email_address": "me@hellosign.com",
		"signatures": [{
			"signature_id": "616629ed37f8588d28600be17ab5d6b7",
			"signer_email_address": "jill@example.com",
			"signer_name": "Jill",
			"order": 1,
			"status_code": "signed",
			"signed_at": null,
			"last_viewed_at": null,
			"last_reminded_at": null,
			"has_pin": false
		}],
		"cc_email_addresses": [
			"lawyer1@hellosign.com",
			"lawyer2@example.com"
		]
	}
}
```

--------------------------------------------------------------------------------

---[FILE: signatures_with_four_signatories.json]---
Location: zulip-main/zerver/webhooks/hellosign/fixtures/signatures_with_four_signatories.json

```json
{
    "event":{
        "event_type":"signature_request_sent",
        "event_time":"1538590065",
        "event_hash":"a755305281fde7bee3517cfd6858e5300bc12c85a2c0f51b47babe98800258d4",
        "event_metadata":{
            "related_signature_id":null,
            "reported_for_account_id":"4686cb274933adf9c9b3a450c4131b0105a2ac14",
            "reported_for_app_id":null
        }
    },
    "account_guid":"4686cb274933adf9c9b3a450c4131b0105a2ac14",
    "client_id":null,
    "signature_request":{
        "signature_request_id":"a6ce6526d1e7496c96a1cdd11276efb5c4504084",
        "test_mode":false,
        "title":"Signature doc",
        "original_title":"Signature doc",
        "subject":"Signature doc",
        "message":null,
        "metadata":{

        },
        "is_complete":false,
        "is_declined":false,
        "has_error":false,
        "custom_fields":[

        ],
        "response_data":[

        ],
        "signing_url":"https:\/\/app.hellosign.com\/sign\/a6ce6526d1e7496c96a1cdd11276efb5c4504084",
        "signing_redirect_url":null,
        "final_copy_uri":"\/\/signature_request\/final_copy\/a6ce6526d1e7496c96a1cdd11276efb5c4504084",
        "files_url":"https:\/\/api.hellosign.com\/signature_request\/files\/a6ce6526d1e7496c96a1cdd11276efb5c4504084",
        "details_url":"https:\/\/app.hellosign.com\/home\/manage?guid=a6ce6526d1e7496c96a1cdd11276efb5c4504084",
        "requester_email_address":"jerryguitarist@gmail.com",
        "signatures":[
            {
                "signature_id":"1d3e6160c86ce2ffadc5032f449ccc7f",
                "has_pin":false,
                "signer_email_address":"jerryguitarist@gmail.com",
                "signer_name":"Eeshan Garg",
                "order":null,
                "status_code":"awaiting_signature",
                "signed_at":null,
                "last_viewed_at":null,
                "last_reminded_at":null,
                "error":null
            },
            {
                "signature_id":"4f6270cc1df39ffe86a47fd9293bc49c",
                "has_pin":false,
                "signer_email_address":"johnsmith@example.com",
                "signer_name":"John Smith",
                "order":null,
                "status_code":"awaiting_signature",
                "signed_at":null,
                "last_viewed_at":null,
                "last_reminded_at":null,
                "error":null
            },
            {
                "signature_id":"4f532706f781664d50bca2c88da81361",
                "has_pin":false,
                "signer_email_address":"janedoe@example.com",
                "signer_name":"Jane Doe",
                "order":null,
                "status_code":"awaiting_signature",
                "signed_at":null,
                "last_viewed_at":null,
                "last_reminded_at":null,
                "error":null
            },
            {
                "signature_id":"d13912af43be9cfc8119597b0d6e9c68",
                "has_pin":false,
                "signer_email_address":"drstrange@example.com",
                "signer_name":"Stephen Strange",
                "order":null,
                "status_code":"awaiting_signature",
                "signed_at":null,
                "last_viewed_at":null,
                "last_reminded_at":null,
                "error":null
            }
        ],
        "cc_email_addresses":[

        ]
    }
}
```

--------------------------------------------------------------------------------

````
