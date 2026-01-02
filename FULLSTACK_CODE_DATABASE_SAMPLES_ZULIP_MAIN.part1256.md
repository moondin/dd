---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1256
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1256 of 1290)

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

---[FILE: missing_host.json]---
Location: zulip-main/zerver/webhooks/splunk/fixtures/missing_host.json

```json
{
    "results_link": "http://example.com:8000/app/search/search?q=%7Cloadjob%20rt_scheduler__admin__search__sudo_at_1483557185_2.2%20%7C%20head%201%20%7C%20tail%201&earliest=0&latest=now",
    "app": "search",
    "result": {
        "timestartpos": "0",
        "_serial": "2",
        "splunk_server": "myserver",
        "date_month": "january",
        "USER": "",
        "date_second": "32",
        "source": "/var/log/auth.log",
        "timeendpos": "15",
        "_si": [
            "myserver",
            "main"
        ],
        "punct": "___::_-_:_(:):_____",
        "TTY": "",
        "_raw": "Jan  4 11:14:32 myserver sudo: pam_unix(sudo:session): session closed for user root",
        "_sourcetype": "syslog",
        "index": "main",
        "date_minute": "14",
        "date_year": "2017",
        "_kv": "1",
        "process": "sudo",
        "PWD": "",
        "pid": "",
        "_time": "1483557272",
        "uid": "",
        "date_zone": "local",
        "sourcetype": "syslog",
        "_indextime": "1483557272",
        "date_hour": "11",
        "date_mday": "4",
        "linecount": "",
        "eventtype": "",
        "COMMAND": "",
        "_eventtype_color": "",
        "date_wday": "wednesday",
        "_confstr": "source::/var/log/auth.log|host::myserver|syslog"
    },
    "sid": "rt_scheduler__admin__search__sudo_at_1483557185_2.2",
    "search_name": "sudo",
    "owner": "admin"
}
```

--------------------------------------------------------------------------------

---[FILE: missing_raw.json]---
Location: zulip-main/zerver/webhooks/splunk/fixtures/missing_raw.json

```json
{
    "results_link": "http://example.com:8000/app/search/search?q=%7Cloadjob%20rt_scheduler__admin__search__sudo_at_1483557185_2.2%20%7C%20head%201%20%7C%20tail%201&earliest=0&latest=now",
    "app": "search",
    "result": {
        "timestartpos": "0",
        "_serial": "2",
        "splunk_server": "myserver",
        "date_month": "january",
        "USER": "",
        "date_second": "32",
        "source": "/var/log/auth.log",
        "timeendpos": "15",
        "_si": [
            "myserver",
            "main"
        ],
        "punct": "___::_-_:_(:):_____",
        "host": "myserver",
        "TTY": "",
        "_sourcetype": "syslog",
        "index": "main",
        "date_minute": "14",
        "date_year": "2017",
        "_kv": "1",
        "process": "sudo",
        "PWD": "",
        "pid": "",
        "_time": "1483557272",
        "uid": "",
        "date_zone": "local",
        "sourcetype": "syslog",
        "_indextime": "1483557272",
        "date_hour": "11",
        "date_mday": "4",
        "linecount": "",
        "eventtype": "",
        "COMMAND": "",
        "_eventtype_color": "",
        "date_wday": "wednesday",
        "_confstr": "source::/var/log/auth.log|host::myserver|syslog"
    },
    "sid": "rt_scheduler__admin__search__sudo_at_1483557185_2.2",
    "search_name": "sudo",
    "owner": "admin"
}
```

--------------------------------------------------------------------------------

---[FILE: missing_results_link.json]---
Location: zulip-main/zerver/webhooks/splunk/fixtures/missing_results_link.json

```json
{
    "app": "search",
    "result": {
        "timestartpos": "0",
        "_serial": "2",
        "splunk_server": "myserver",
        "date_month": "january",
        "USER": "",
        "date_second": "32",
        "source": "/var/log/auth.log",
        "timeendpos": "15",
        "_si": [
            "myserver",
            "main"
        ],
        "punct": "___::_-_:_(:):_____",
        "host": "myserver",
        "TTY": "",
        "_raw": "Jan  4 11:14:32 myserver sudo: pam_unix(sudo:session): session closed for user root",
        "_sourcetype": "syslog",
        "index": "main",
        "date_minute": "14",
        "date_year": "2017",
        "_kv": "1",
        "process": "sudo",
        "PWD": "",
        "pid": "",
        "_time": "1483557272",
        "uid": "",
        "date_zone": "local",
        "sourcetype": "syslog",
        "_indextime": "1483557272",
        "date_hour": "11",
        "date_mday": "4",
        "linecount": "",
        "eventtype": "",
        "COMMAND": "",
        "_eventtype_color": "",
        "date_wday": "wednesday",
        "_confstr": "source::/var/log/auth.log|host::myserver|syslog"
    },
    "sid": "rt_scheduler__admin__search__sudo_at_1483557185_2.2",
    "search_name": "sudo",
    "owner": "admin"
}
```

--------------------------------------------------------------------------------

---[FILE: missing_search_name.json]---
Location: zulip-main/zerver/webhooks/splunk/fixtures/missing_search_name.json

```json
{
    "results_link": "http://example.com:8000/app/search/search?q=%7Cloadjob%20rt_scheduler__admin__search__sudo_at_1483557185_2.2%20%7C%20head%201%20%7C%20tail%201&earliest=0&latest=now",
    "app": "search",
    "result": {
        "timestartpos": "0",
        "_serial": "2",
        "splunk_server": "myserver",
        "date_month": "january",
        "USER": "",
        "date_second": "32",
        "source": "/var/log/auth.log",
        "timeendpos": "15",
        "_si": [
            "myserver",
            "main"
        ],
        "punct": "___::_-_:_(:):_____",
        "host": "myserver",
        "TTY": "",
        "_raw": "Jan  4 11:14:32 myserver sudo: pam_unix(sudo:session): session closed for user root",
        "_sourcetype": "syslog",
        "index": "main",
        "date_minute": "14",
        "date_year": "2017",
        "_kv": "1",
        "process": "sudo",
        "PWD": "",
        "pid": "",
        "_time": "1483557272",
        "uid": "",
        "date_zone": "local",
        "sourcetype": "syslog",
        "_indextime": "1483557272",
        "date_hour": "11",
        "date_mday": "4",
        "linecount": "",
        "eventtype": "",
        "COMMAND": "",
        "_eventtype_color": "",
        "date_wday": "wednesday",
        "_confstr": "source::/var/log/auth.log|host::myserver|syslog"
    },
    "sid": "rt_scheduler__admin__search__sudo_at_1483557185_2.2",
    "owner": "admin"
}
```

--------------------------------------------------------------------------------

---[FILE: missing_source.json]---
Location: zulip-main/zerver/webhooks/splunk/fixtures/missing_source.json

```json
{
    "results_link": "http://example.com:8000/app/search/search?q=%7Cloadjob%20rt_scheduler__admin__search__sudo_at_1483557185_2.2%20%7C%20head%201%20%7C%20tail%201&earliest=0&latest=now",
    "app": "search",
    "result": {
        "timestartpos": "0",
        "_serial": "2",
        "splunk_server": "myserver",
        "date_month": "january",
        "USER": "",
        "date_second": "32",
        "timeendpos": "15",
        "_si": [
            "myserver",
            "main"
        ],
        "punct": "___::_-_:_(:):_____",
        "host": "myserver",
        "TTY": "",
        "_raw": "Jan  4 11:14:32 myserver sudo: pam_unix(sudo:session): session closed for user root",
        "_sourcetype": "syslog",
        "index": "main",
        "date_minute": "14",
        "date_year": "2017",
        "_kv": "1",
        "process": "sudo",
        "PWD": "",
        "pid": "",
        "_time": "1483557272",
        "uid": "",
        "date_zone": "local",
        "sourcetype": "syslog",
        "_indextime": "1483557272",
        "date_hour": "11",
        "date_mday": "4",
        "linecount": "",
        "eventtype": "",
        "COMMAND": "",
        "_eventtype_color": "",
        "date_wday": "wednesday",
        "_confstr": "source::/var/log/auth.log|host::myserver|syslog"
    },
    "sid": "rt_scheduler__admin__search__sudo_at_1483557185_2.2",
    "search_name": "sudo",
    "owner": "admin"
}
```

--------------------------------------------------------------------------------

---[FILE: search_one_result.json]---
Location: zulip-main/zerver/webhooks/splunk/fixtures/search_one_result.json

```json
{
    "results_link": "http://example.com:8000/app/search/search?q=%7Cloadjob%20rt_scheduler__admin__search__sudo_at_1483557185_2.2%20%7C%20head%201%20%7C%20tail%201&earliest=0&latest=now",
    "app": "search",
    "result": {
        "timestartpos": "0",
        "_serial": "2",
        "splunk_server": "myserver",
        "date_month": "january",
        "USER": "",
        "date_second": "32",
        "source": "/var/log/auth.log",
        "timeendpos": "15",
        "_si": [
            "myserver",
            "main"
        ],
        "punct": "___::_-_:_(:):_____",
        "host": "myserver",
        "TTY": "",
        "_raw": "Jan  4 11:14:32 myserver sudo: pam_unix(sudo:session): session closed for user root",
        "_sourcetype": "syslog",
        "index": "main",
        "date_minute": "14",
        "date_year": "2017",
        "_kv": "1",
        "process": "sudo",
        "PWD": "",
        "pid": "",
        "_time": "1483557272",
        "uid": "",
        "date_zone": "local",
        "sourcetype": "syslog",
        "_indextime": "1483557272",
        "date_hour": "11",
        "date_mday": "4",
        "linecount": "",
        "eventtype": "",
        "COMMAND": "",
        "_eventtype_color": "",
        "date_wday": "wednesday",
        "_confstr": "source::/var/log/auth.log|host::myserver|syslog"
    },
    "sid": "rt_scheduler__admin__search__sudo_at_1483557185_2.2",
    "search_name": "sudo",
    "owner": "admin"
}
```

--------------------------------------------------------------------------------

---[FILE: short_search_name.json]---
Location: zulip-main/zerver/webhooks/splunk/fixtures/short_search_name.json

```json
{
    "results_link": "http://example.com:8000/app/search/search?q=%7Cloadjob%20rt_scheduler__admin__search__sudo_at_1483557185_2.2%20%7C%20head%201%20%7C%20tail%201&earliest=0&latest=now",
    "app": "search",
    "result": {
        "timestartpos": "0",
        "_serial": "2",
        "splunk_server": "myserver",
        "date_month": "january",
        "USER": "",
        "date_second": "32",
        "source": "/var/log/auth.log",
        "timeendpos": "15",
        "_si": [
            "myserver",
            "main"
        ],
        "punct": "___::_-_:_(:):_____",
        "host": "myserver",
        "TTY": "",
        "_raw": "Jan  4 11:14:32 myserver sudo: pam_unix(sudo:session): session closed for user root",
        "_sourcetype": "syslog",
        "index": "main",
        "date_minute": "14",
        "date_year": "2017",
        "_kv": "1",
        "process": "sudo",
        "PWD": "",
        "pid": "",
        "_time": "1483557272",
        "uid": "",
        "date_zone": "local",
        "sourcetype": "syslog",
        "_indextime": "1483557272",
        "date_hour": "11",
        "date_mday": "4",
        "linecount": "",
        "eventtype": "",
        "COMMAND": "",
        "_eventtype_color": "",
        "date_wday": "wednesday",
        "_confstr": "source::/var/log/auth.log|host::myserver|syslog"
    },
    "sid": "rt_scheduler__admin__search__sudo_at_1483557185_2.2",
    "search_name": "This search's name isn't that long",
    "owner": "admin"
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/statuspage/doc.md

```text
# Zulip Statuspage integration

Get Zulip notifications for your Statuspage.io subscriptions!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to your Statuspage Dashboard, and click on **Notifications**
   near the bottom-left corner. Select the **Webhook** tab. If webhook
   notifications are disabled, click **reactivate webhook
   notifications now** to enable them. Click on the
   **gear** (<i class="fa fa-cog"></i>) icon next to
   **Subscribers**, and select **Add subscriber**.

1. Set **Subscriber type** to **Webhook**. Set **Endpoint URL** to
   the URL generated above, and provide an email address. Statuspage
   will send email notifications to this address if the webhook endpoint
   fails. Click **Add Subscriber**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/statuspage/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/statuspage/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class StatuspageHookTests(WebhookTestCase):
    CHANNEL_NAME = "statuspage-test"
    URL_TEMPLATE = "/api/v1/external/statuspage?api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "statuspage"

    def test_statuspage_incident(self) -> None:
        expected_topic_name = "Database query delays: All Systems Operational"
        expected_message = """
**Database query delays**:
* State: **identified**
* Description: We just encountered that database queries are timing out resulting in inconvenience to our end users...we'll do quick fix latest by tomorrow !!!
""".strip()
        self.check_webhook(
            "incident_created",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_statuspage_incident_update(self) -> None:
        expected_topic_name = "Database query delays: All Systems Operational"
        expected_message = """
**Database query delays**:
* State: **resolved**
* Description: The database issue is resolved.
""".strip()
        self.check_webhook(
            "incident_update",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_statuspage_component(self) -> None:
        expected_topic_name = "Database component: Service Under Maintenance"
        expected_message = "**Database component** has changed status from **operational** to **under_maintenance**."
        self.check_webhook(
            "component_status_update",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_statuspage_anomalous_payload(self) -> None:
        result = self.client_post(
            self.url,
            {},
            content_type="application/json",
        )
        self.assert_json_error(
            result, "Unable to parse request: Did Statuspage generate this event?", 400
        )
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/statuspage/view.py
Signals: Django

```python
# Webhooks for external integrations.
from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.exceptions import AnomalousWebhookPayloadError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

INCIDENT_TEMPLATE = """
**{name}**:
* State: **{state}**
* Description: {content}
""".strip()

COMPONENT_TEMPLATE = "**{name}** has changed status from **{old_status}** to **{new_status}**."

TOPIC_TEMPLATE = "{name}: {description}"

ALL_EVENT_TYPES = ["incident", "component"]


def get_incident_events_body(payload: WildValue) -> str:
    return INCIDENT_TEMPLATE.format(
        name=payload["incident"]["name"].tame(check_string),
        state=payload["incident"]["status"].tame(check_string),
        content=payload["incident"]["incident_updates"][0]["body"].tame(check_string),
    )


def get_components_update_body(payload: WildValue) -> str:
    return COMPONENT_TEMPLATE.format(
        name=payload["component"]["name"].tame(check_string),
        old_status=payload["component_update"]["old_status"].tame(check_string),
        new_status=payload["component_update"]["new_status"].tame(check_string),
    )


def get_incident_topic(payload: WildValue) -> str:
    return TOPIC_TEMPLATE.format(
        name=payload["incident"]["name"].tame(check_string),
        description=payload["page"]["status_description"].tame(check_string),
    )


def get_component_topic(payload: WildValue) -> str:
    return TOPIC_TEMPLATE.format(
        name=payload["component"]["name"].tame(check_string),
        description=payload["page"]["status_description"].tame(check_string),
    )


@webhook_view("Statuspage", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_statuspage_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    if "incident" in payload:
        event = "incident"
        topic_name = get_incident_topic(payload)
        body = get_incident_events_body(payload)
    elif "component" in payload:
        event = "component"
        topic_name = get_component_topic(payload)
        body = get_components_update_body(payload)
    else:
        raise AnomalousWebhookPayloadError

    check_send_webhook_message(request, user_profile, topic_name, body, event)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: component_status_update.json]---
Location: zulip-main/zerver/webhooks/statuspage/fixtures/component_status_update.json

```json
{
    "meta": {
        "unsubscribe": "http://mycompany24.statuspage.io/?unsubscribe=zjcdb6727vmj",
        "documentation": "http://doers.statuspage.io/customer-notifications/webhooks/",
        "generated_at": "2017-12-26T07:59:09.498Z"
    },
    "page": {
        "id": "jb7j80lkgqvb",
        "status_indicator": "maintenance",
        "status_description": "Service Under Maintenance"
    },
    "component": {
        "status": "under_maintenance",
        "name": "Database component",
        "created_at": "2017-12-26T07:57:28.743Z",
        "updated_at": "2017-12-26T07:59:09.371Z",
        "position": 3,
        "description": null,
        "showcase": true,
        "id": "sqm6pl84wzjc",
        "page_id": "jb7j80lkgqvb",
        "group_id": null
    },
    "component_update": {
        "old_status": "operational",
        "new_status": "under_maintenance",
        "created_at": "2017-12-26T07:59:09.379Z",
        "component_type": "Component",
        "id": "nd963wv4j30b",
        "component_id": "sqm6pl84wzjc"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: incident_created.json]---
Location: zulip-main/zerver/webhooks/statuspage/fixtures/incident_created.json

```json
{
    "meta": {
        "unsubscribe": "http://mycompany24.statuspage.io/?unsubscribe=zjcdb6727vmj",
        "documentation": "http://doers.statuspage.io/customer-notifications/webhooks/",
        "generated_at": "2017-12-26T07:32:00.770Z"
    },
    "page": {
        "id": "jb7j80lkgqvb",
        "status_indicator": "critical",
        "status_description": "All Systems Operational"
    },
    "incident": {
        "name": "Database query delays",
        "status": "identified",
        "created_at": "2017-12-26T07:32:00.507Z",
        "updated_at": "2017-12-26T07:32:00.603Z",
        "monitoring_at": null,
        "resolved_at": null,
        "impact": "none",
        "shortlink": "http://stspg.io/646947c1e",
        "postmortem_ignored": false,
        "postmortem_body": null,
        "postmortem_body_last_updated_at": null,
        "postmortem_published_at": null,
        "postmortem_notified_subscribers": false,
        "postmortem_notified_twitter": false,
        "backfilled": false,
        "scheduled_for": null,
        "scheduled_until": null,
        "scheduled_remind_prior": false,
        "scheduled_reminded_at": null,
        "impact_override": null,
        "scheduled_auto_in_progress": false,
        "scheduled_auto_completed": false,
        "id": "z3lct0r596n4",
        "page_id": "jb7j80lkgqvb",
        "incident_updates": [
            {
                "status": "identified",
                "body": "We just encountered that database queries are timing out resulting in inconvenience to our end users...we'll do quick fix latest by tomorrow !!!",
                "created_at": "2017-12-26T07:32:00.548Z",
                "wants_twitter_update": false,
                "twitter_updated_at": null,
                "updated_at": "2017-12-26T07:32:00.548Z",
                "display_at": "2017-12-26T07:32:00.548Z",
                "affected_components": [
                    {
                        "code": "zvdm6f7gf76j",
                        "name": "Management Portal (example)",
                        "old_status": "operational",
                        "new_status": "operational"
                    }
                ],
                "custom_tweet": null,
                "deliver_notifications": true,
                "id": "qm8bgczn0p2n",
                "incident_id": "z3lct0r596n4"
            }
        ],
        "components": [
            {
                "status": "operational",
                "name": "Management Portal (example)",
                "created_at": "2017-12-25T18:44:27.901Z",
                "updated_at": "2017-12-25T18:44:27.901Z",
                "position": 2,
                "description": null,
                "showcase": true,
                "id": "zvdm6f7gf76j",
                "page_id": "jb7j80lkgqvb",
                "group_id": null
            }
        ]
    }
}
```

--------------------------------------------------------------------------------

---[FILE: incident_update.json]---
Location: zulip-main/zerver/webhooks/statuspage/fixtures/incident_update.json

```json
{
    "meta": {
        "unsubscribe": "http://mycompany24.statuspage.io/?unsubscribe=zjcdb6727vmj",
        "documentation": "http://doers.statuspage.io/customer-notifications/webhooks/",
        "generated_at": "2017-12-26T07:37:21.000Z"
    },
    "page": {
        "id": "jb7j80lkgqvb",
        "status_indicator": "none",
        "status_description": "All Systems Operational"
    },
    "incident": {
        "name": "Database query delays",
        "status": "resolved",
        "created_at": "2017-12-26T07:32:00.507Z",
        "updated_at": "2017-12-26T07:37:20.837Z",
        "monitoring_at": null,
        "resolved_at": "2017-12-26T07:37:20.785Z",
        "impact": "none",
        "shortlink": "http://stspg.io/646947c1e",
        "postmortem_ignored": false,
        "postmortem_body": null,
        "postmortem_body_last_updated_at": null,
        "postmortem_published_at": null,
        "postmortem_notified_subscribers": false,
        "postmortem_notified_twitter": false,
        "backfilled": false,
        "scheduled_for": null,
        "scheduled_until": null,
        "scheduled_remind_prior": false,
        "scheduled_reminded_at": null,
        "impact_override": null,
        "scheduled_auto_in_progress": false,
        "scheduled_auto_completed": false,
        "id": "z3lct0r596n4",
        "page_id": "jb7j80lkgqvb",
        "incident_updates": [
            {
                "status": "resolved",
                "body": "The database issue is resolved.",
                "created_at": "2017-12-26T07:37:20.785Z",
                "wants_twitter_update": false,
                "twitter_updated_at": null,
                "updated_at": "2017-12-26T07:37:20.785Z",
                "display_at": "2017-12-26T07:37:20.785Z",
                "affected_components": [
                    {
                        "code": "zvdm6f7gf76j",
                        "name": "Management Portal (example)",
                        "old_status": "operational",
                        "new_status": "operational"
                    }
                ],
                "custom_tweet": null,
                "deliver_notifications": true,
                "id": "cdwfdrjlp53y",
                "incident_id": "z3lct0r596n4"
            },
            {
                "status": "identified",
                "body": "We just encountered that database queries are timing out resulting in inconvenience to our end users...we'll do quick fix latest by tomorrow !!!",
                "created_at": "2017-12-26T07:32:00.548Z",
                "wants_twitter_update": false,
                "twitter_updated_at": null,
                "updated_at": "2017-12-26T07:32:00.548Z",
                "display_at": "2017-12-26T07:32:00.548Z",
                "affected_components": [
                    {
                        "code": "zvdm6f7gf76j",
                        "name": "Management Portal (example)",
                        "old_status": "operational",
                        "new_status": "operational"
                    }
                ],
                "custom_tweet": null,
                "deliver_notifications": true,
                "id": "qm8bgczn0p2n",
                "incident_id": "z3lct0r596n4"
            }
        ],
        "components": [
            {
                "status": "operational",
                "name": "Management Portal (example)",
                "created_at": "2017-12-25T18:44:27.901Z",
                "updated_at": "2017-12-25T18:44:27.901Z",
                "position": 2,
                "description": null,
                "showcase": true,
                "id": "zvdm6f7gf76j",
                "page_id": "jb7j80lkgqvb",
                "group_id": null
            }
        ]
    }
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/stripe/doc.md

```text
# Zulip Stripe integration

Get Zulip notifications for Stripe events!

{% if 'http:' in external_url_scheme %}

!!! tip ""

    Stripe will only send webhook payloads over HTTPS, but your Zulip
    server is configured to only accept HTTP. To use the Stripe
    webhook with this Zulip server, you will need to use a tunneling
    service like ngrok or Ultrahook.

{% endif %}

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. On your Stripe Dashboard, select **Developers** on the left
   sidebar. Select **Webhooks**, and click on **+ Add endpoint**.

1. Set the **URL to be called** to the URL generated above. Select the
   [event types](#filtering-incoming-events) you would like to be notified
   about, and click **Add endpoint**.

1. [Add a new linkifier](/help/add-a-custom-linkifier) in your Zulip
   organization. Set the pattern to `(?P<id>cus_[0-9a-zA-Z]+)` and the URL
   template to `https://dashboard.stripe.com/customers/{id}`. This step
   creates links to Stripe customers in Zulip messages and topics.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/stripe/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/stripe/tests.py

```python
from unittest import mock
from unittest.mock import MagicMock, patch

from zerver.lib.test_classes import WebhookTestCase


class StripeHookTests(WebhookTestCase):
    CHANNEL_NAME = "test"
    URL_TEMPLATE = "/api/v1/external/stripe?&api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "stripe"

    def test_charge_dispute_closed(self) -> None:
        expected_topic_name = "disputes"
        expected_message = "[Dispute](https://dashboard.stripe.com/disputes/dp_00000000000000) closed. Current status: won."
        self.check_webhook(
            "charge_dispute_closed",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_charge_dispute_created(self) -> None:
        expected_topic_name = "disputes"
        expected_message = "[Dispute](https://dashboard.stripe.com/disputes/dp_00000000000000) created. Current status: needs response."
        self.check_webhook(
            "charge_dispute_created",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_charge_failed(self) -> None:
        expected_topic_name = "charges"
        expected_message = (
            "[Charge](https://dashboard.stripe.com/charges/ch_00000000000000) for 1.00 AUD failed"
        )
        self.check_webhook(
            "charge_failed",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    # Credit card charge
    def test_charge_succeeded__card(self) -> None:
        expected_topic_name = "cus_00000000000000"
        expected_message = "[Charge](https://dashboard.stripe.com/charges/ch_000000000000000000000000) for 1.00 AUD succeeded"
        self.check_webhook(
            "charge_succeeded__card",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    # ACH payment (really a 'payment', rather than a 'charge')
    def test_charge_succeeded__invoice(self) -> None:
        expected_topic_name = "cus_00000000000000"
        expected_message = "[Payment](https://dashboard.stripe.com/payments/py_000000000000000000000000) for $1.00 succeeded"
        self.check_webhook(
            "charge_succeeded__invoice",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_customer_created(self) -> None:
        expected_topic_name = "cus_00000000000000"
        expected_message = (
            "[Customer](https://dashboard.stripe.com/customers/cus_00000000000000) created"
        )
        self.check_webhook(
            "customer_created",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_customer_created_email(self) -> None:
        expected_topic_name = "cus_00000000000000"
        expected_message = "[Customer](https://dashboard.stripe.com/customers/cus_00000000000000) created\nEmail: example@abc.com"
        self.check_webhook(
            "customer_created_email",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_customer_deleted(self) -> None:
        expected_topic_name = "cus_00000000000000"
        expected_message = (
            "[Customer](https://dashboard.stripe.com/customers/cus_00000000000000) deleted"
        )
        self.check_webhook(
            "customer_deleted",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_customer_subscription_created(self) -> None:
        expected_topic_name = "cus_00000000000000"
        expected_message = """\
[Subscription](https://dashboard.stripe.com/subscriptions/sub_E6STM5w5EX3K28) created
Plan: [flatrate](https://dashboard.stripe.com/plans/plan_E6SQ6RAtmLVtzg)
Quantity: 800
Billing method: send invoice"""
        self.check_webhook(
            "customer_subscription_created",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_customer_subscription_created_no_nickname(self) -> None:
        expected_topic_name = "cus_00000000000000"
        expected_message = """\
[Subscription](https://dashboard.stripe.com/subscriptions/sub_E6STM5w5EX3K28) created
Plan: https://dashboard.stripe.com/plans/plan_E6SQ6RAtmLVtzg
Quantity: 800
Billing method: send invoice"""
        self.check_webhook(
            "customer_subscription_created_no_nickname",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_customer_subscription_deleted(self) -> None:
        expected_topic_name = "cus_00000000000000"
        expected_message = (
            "[Subscription](https://dashboard.stripe.com/subscriptions/sub_00000000000000) deleted"
        )
        self.check_webhook(
            "customer_subscription_deleted",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_customer_subscription_updated(self) -> None:
        expected_topic_name = "cus_00000000000000"
        expected_message = """\
[Subscription](https://dashboard.stripe.com/subscriptions/sub_E6STM5w5EX3K28) updated
* Billing cycle anchor is now <time:2019-11-01T12:00:00+00:00>
* Current period end is now <time:2019-11-01T12:00:00+00:00>
* Current period start is now <time:2018-12-06T05:53:55+00:00>
* Start is now <time:2018-12-06T05:53:55+00:00>
* Status is now trialing
* Trial end is now <time:2019-11-01T12:00:00+00:00>
* Trial start is now <time:2018-12-06T05:53:55+00:00>"""
        self.check_webhook(
            "customer_subscription_updated",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_customer_subscription_trial_will_end(self) -> None:
        expected_topic_name = "cus_00000000000000"
        expected_message = "[Subscription](https://dashboard.stripe.com/subscriptions/sub_00000000000000) trial will end in 3 days"
        # 3 days before the end of the trial, plus a little bit to make sure the rounding is working
        with mock.patch("time.time", return_value=1480892861 - 3 * 3600 * 24 + 100):
            # use fixture named stripe_customer_subscription_trial_will_end
            self.check_webhook(
                "customer_subscription_trial_will_end",
                expected_topic_name,
                expected_message,
                content_type="application/x-www-form-urlencoded",
            )

    def test_customer_updated__account_balance(self) -> None:
        expected_topic_name = "cus_00000000000000"
        expected_message = (
            "[Customer](https://dashboard.stripe.com/customers/cus_00000000000000) updated"
            "\n* Account balance is now 100"
        )
        self.check_webhook(
            "customer_updated__account_balance",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_customer_discount_created(self) -> None:
        expected_topic_name = "cus_00000000000000"
        expected_message = "Discount created ([25.5% off](https://dashboard.stripe.com/coupons/25_00000000000000))."
        self.check_webhook(
            "customer_discount_created",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_invoice_payment_failed(self) -> None:
        expected_topic_name = "cus_00000000000000"
        expected_message = (
            "[Invoice](https://dashboard.stripe.com/invoices/in_00000000000000) payment failed"
        )
        self.check_webhook(
            "invoice_payment_failed",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_invoice_created(self) -> None:
        expected_topic_name = "cus_HH97asvHvaYQYp"
        expected_message = """
[Invoice](https://dashboard.stripe.com/invoices/in_1GpmuuHLwdCOCoR7ghzQDQLW) created (manual)
Total: 0.00 INR
Amount due: 0.00 INR
""".strip()
        self.check_webhook("invoice_created", expected_topic_name, expected_message)

    def test_invoiceitem_created(self) -> None:
        expected_topic_name = "cus_00000000000000"
        expected_message = "[Invoice item](https://dashboard.stripe.com/invoiceitems/ii_00000000000000) created for 10.00 CAD"
        self.check_webhook(
            "invoiceitem_created",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_invoice_paid(self) -> None:
        expected_topic_name = "cus_FDmrSwQt9Fck5M"
        expected_message = "[Invoice](https://dashboard.stripe.com/invoices/in_1EjLINHuGUuNWDDZjDf2WNqd) is now paid"
        self.check_webhook(
            "invoice_updated__paid",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_refund_event(self) -> None:
        expected_topic_name = "refunds"
        expected_message = "A [refund](https://dashboard.stripe.com/refunds/re_1Gib6ZHLwdCOCoR7VrzCnXlj) for a [charge](https://dashboard.stripe.com/charges/ch_1Gib61HLwdCOCoR71rnkccye) of 300000.00 INR was updated."
        self.check_webhook("refund_event", expected_topic_name, expected_message)

    def test_pseudo_refund_event(self) -> None:
        expected_topic_name = "refunds"
        expected_message = "A [refund](https://dashboard.stripe.com/refunds/pyr_abcde12345ABCDF) for a [payment](https://dashboard.stripe.com/payments/py_abcde12345ABCDG) of 12.34 EUR was updated."
        self.check_webhook("pseudo_refund_event", expected_topic_name, expected_message)

    @patch("zerver.webhooks.stripe.view.check_send_webhook_message")
    def test_account_updated_without_previous_attributes_ignore(
        self, check_send_webhook_message_mock: MagicMock
    ) -> None:
        self.url = self.build_webhook_url()
        payload = self.get_body("account_updated_without_previous_attributes")
        result = self.client_post(self.url, payload, content_type="application/json")
        self.assertFalse(check_send_webhook_message_mock.called)
        self.assert_json_success(result)
```

--------------------------------------------------------------------------------

````
