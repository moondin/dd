---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1226
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1226 of 1290)

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
Location: zulip-main/zerver/webhooks/netlify/view.py
Signals: Django

```python
from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.exceptions import UnsupportedWebhookEventTypeError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import (
    check_send_webhook_message,
    get_http_headers_from_filename,
    validate_extract_webhook_http_header,
)
from zerver.models import UserProfile

ALL_EVENT_TYPES = [
    "deploy_failed",
    "deploy_locked",
    "deploy_unlocked",
    "deploy_building",
    "deploy_created",
]

fixture_to_headers = get_http_headers_from_filename("HTTP_X_NETLIFY_EVENT")


@webhook_view("Netlify", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_netlify_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    message_template, event = get_template(request, payload)

    body = message_template.format(
        build_name=payload["name"].tame(check_string),
        build_url=payload["url"].tame(check_string),
        branch_name=payload["branch"].tame(check_string),
        state=payload["state"].tame(check_string),
    )

    topic_name = "{topic}".format(topic=payload["branch"].tame(check_string))

    check_send_webhook_message(request, user_profile, topic_name, body, event)

    return json_success(request)


def get_template(request: HttpRequest, payload: WildValue) -> tuple[str, str]:
    message_template = "The build [{build_name}]({build_url}) on branch {branch_name} "
    event = validate_extract_webhook_http_header(request, "X-Netlify-Event", "Netlify")

    if event == "deploy_failed":
        message_template += payload["error_message"].tame(check_string)
    elif event == "deploy_locked":
        message_template += "is now locked."
    elif event == "deploy_unlocked":
        message_template += "is now unlocked."
    elif event in ALL_EVENT_TYPES:
        message_template += "is now {state}.".format(state=payload["state"].tame(check_string))
    else:
        raise UnsupportedWebhookEventTypeError(event)

    return message_template, event
```

--------------------------------------------------------------------------------

---[FILE: deploy_building.json]---
Location: zulip-main/zerver/webhooks/netlify/fixtures/deploy_building.json

```json
{
   "id":"5b78192ac9659217dbf7c9aa",
   "site_id":"573f11b2-f5f3-481f-a1f8-85feb457ff49",
   "build_id":"5b78192ac9659217dbf7c9ab",
   "state":"building",
   "name":"objective-jepsen-35fbb2",
   "url":"http://objective-jepsen-35fbb2.netlify.com",
   "ssl_url":"https://objective-jepsen-35fbb2.netlify.com",
   "admin_url":"https://app.netlify.com/sites/objective-jepsen-35fbb2",
   "deploy_url":"http://5b78192ac9659217dbf7c9aa.objective-jepsen-35fbb2.netlify.com",
   "deploy_ssl_url":"https://5b78192ac9659217dbf7c9aa--objective-jepsen-35fbb2.netlify.com",
   "created_at":"2018-08-18T13:03:38.315Z",
   "updated_at":"2018-08-18T13:03:39.800Z",
   "user_id":"5b68ca02b13fb17905788d44",
   "error_message":null,
   "required":[

   ],
   "required_functions":null,
   "commit_ref":null,
   "review_id":null,
   "branch":"master",
   "commit_url":null,
   "skipped":null,
   "locked":null,
   "log_access_attributes":{
      "type":"firebase",
      "url":"https://netlify.firebaseio.com/builds/5b78192ac9659217dbf7c9ab/log"
   },
   "title":null,
   "review_url":null,
   "published_at":null,
   "context":"production",
   "deploy_time":null,
   "available_functions":[

   ],
   "summary":{
      "status":"building",
      "messages":[

      ]
   },
   "screenshot_url":null
}
```

--------------------------------------------------------------------------------

---[FILE: deploy_created.json]---
Location: zulip-main/zerver/webhooks/netlify/fixtures/deploy_created.json

```json
{
   "id":"5b78192ac9659217dbf7c9aa",
   "site_id":"573f11b2-f5f3-481f-a1f8-85feb457ff49",
   "build_id":"5b78192ac9659217dbf7c9ab",
   "state":"ready",
   "name":"objective-jepsen-35fbb2",
   "url":"http://objective-jepsen-35fbb2.netlify.com",
   "ssl_url":"https://objective-jepsen-35fbb2.netlify.com",
   "admin_url":"https://app.netlify.com/sites/objective-jepsen-35fbb2",
   "deploy_url":"http://5b78192ac9659217dbf7c9aa.objective-jepsen-35fbb2.netlify.com",
   "deploy_ssl_url":"https://5b78192ac9659217dbf7c9aa--objective-jepsen-35fbb2.netlify.com",
   "created_at":"2018-08-18T13:03:38.315Z",
   "updated_at":"2018-08-18T13:03:44.609Z",
   "user_id":"5b68ca02b13fb17905788d44",
   "error_message":null,
   "required":[

   ],
   "required_functions":[

   ],
   "commit_ref":null,
   "review_id":null,
   "branch":"master",
   "commit_url":null,
   "skipped":null,
   "locked":null,
   "log_access_attributes":{
      "type":"firebase",
      "url":"https://netlify.firebaseio.com/builds/5b78192ac9659217dbf7c9ab/log"
   },
   "title":null,
   "review_url":null,
   "published_at":"2018-08-18T13:03:42.462Z",
   "context":"production",
   "deploy_time":3,
   "available_functions":[

   ],
   "summary":{
      "status":"ready",
      "messages":[
         {
            "type":"info",
            "title":"No new files created for this deploy",
            "description":null,
            "image":null
         }
      ]
   },
   "screenshot_url":"https://353a23c500dde3b2ad58-c49fe7e7355d384845270f4a7a0a7aa1.ssl.cf2.rackcdn.com/5b78192ac9659217dbf7c9aa/screenshot.png"
}
```

--------------------------------------------------------------------------------

---[FILE: deploy_failed.json]---
Location: zulip-main/zerver/webhooks/netlify/fixtures/deploy_failed.json

```json
{
    "id":"5b64d77c02ed83730664c2f6",
    "site_id":"6f2ad239-fce7-4b54-81fe-873d4fcf5c78",
    "build_id":"5b64d77c02ed83730664c2f7",
    "state":"error",
    "name":"objective-jepsen-35fbb2",
    "url":"http://objective-jepsen-35fbb2.netlify.com",
    "ssl_url":"https://objective-jepsen-35fbb2.netlify.com",
    "admin_url":"https://app.netlify.com/sites/objective-jepsen-35fbb2",
    "deploy_url":"http://5b78192ac9659217dbf7c9aa.objective-jepsen-35fbb2.netlify.com",
    "deploy_ssl_url":"https://5b78192ac9659217dbf7c9aa--objective-jepsen-35fbb2.netlify.com",
    "created_at":"2018-08-03T22:30:20.261Z",
    "updated_at":"2018-08-03T22:30:27.734Z",
    "user_id":"5b64d15c82d3f16bcbbdcdbe",
    "error_message":"failed during stage 'building site': Build script returned non-zero exit code: 127",
    "required":[

    ],
    "required_functions":null,
    "commit_ref":null,
    "review_id":null,
    "branch":"master",
    "commit_url":null,
    "skipped":null,
    "locked":null,
    "log_access_attributes":{
        "type":"firebase",
        "url":"https://netlify.firebaseio.com/builds/5b64d77c02ed83730664c2f7/log"
    },
    "title":null,
    "review_url":null,
    "published_at":null,
    "context":"production",
    "deploy_time":null,
    "available_functions":[

    ],
    "summary":{

    }
}
```

--------------------------------------------------------------------------------

---[FILE: deploy_locked.json]---
Location: zulip-main/zerver/webhooks/netlify/fixtures/deploy_locked.json

```json
{
    "id":"5b64d2c3792f8946ae9ddc8b",
    "site_id":"6f2ad239-fce7-4b54-81fe-873d4fcf5c78",
    "build_id":"5b64d2c3792f8946ae9ddc8c",
    "state":"ready",
    "name":"objective-jepsen-35fbb2",
    "url":"http://objective-jepsen-35fbb2.netlify.com",
    "ssl_url":"https://objective-jepsen-35fbb2.netlify.com",
    "admin_url":"https://app.netlify.com/sites/objective-jepsen-35fbb2",
    "deploy_url":"http://5b78192ac9659217dbf7c9aa.objective-jepsen-35fbb2.netlify.com",
    "deploy_ssl_url":"https://5b78192ac9659217dbf7c9aa--objective-jepsen-35fbb2.netlify.com",
    "created_at":"2018-08-03T22:10:11.180Z",
    "updated_at":"2018-08-03T22:21:59.875Z",
    "user_id":"5b64d15c82d3f16bcbbdcdbe",
    "error_message":null,
    "required":[

    ],
    "required_functions":[

    ],
    "commit_ref":null,
    "review_id":null,
    "branch":"master",
    "commit_url":null,
    "skipped":null,
    "locked":true,
    "log_access_attributes":{
        "type":"firebase",
        "url":"https://netlify.firebaseio.com/builds/5b64d2c3792f8946ae9ddc8c/log"
    },
    "title":null,
    "review_url":null,
    "published_at":"2018-08-03T22:21:59.747Z",
    "context":"production",
    "deploy_time":2,
    "available_functions":[

    ],
    "summary":{

    }
}
```

--------------------------------------------------------------------------------

---[FILE: deploy_unlocked.json]---
Location: zulip-main/zerver/webhooks/netlify/fixtures/deploy_unlocked.json

```json
{
    "id":"5b64d2c3792f8946ae9ddc8b",
    "site_id":"6f2ad239-fce7-4b54-81fe-873d4fcf5c78",
    "build_id":"5b64d2c3792f8946ae9ddc8c",
    "state":"ready",
    "name":"objective-jepsen-35fbb2",
    "url":"http://objective-jepsen-35fbb2.netlify.com",
    "ssl_url":"https://objective-jepsen-35fbb2.netlify.com",
    "admin_url":"https://app.netlify.com/sites/objective-jepsen-35fbb2",
    "deploy_url":"http://5b78192ac9659217dbf7c9aa.objective-jepsen-35fbb2.netlify.com",
    "deploy_ssl_url":"https://5b78192ac9659217dbf7c9aa--objective-jepsen-35fbb2.netlify.com",
    "created_at":"2018-08-03T22:10:11.180Z",
    "updated_at":"2018-08-03T22:24:04.622Z",
    "user_id":"5b64d15c82d3f16bcbbdcdbe",
    "error_message":null,
    "required":[

    ],
    "required_functions":[

    ],
    "commit_ref":null,
    "review_id":null,
    "branch":"master",
    "commit_url":null,
    "skipped":null,
    "locked":false,
    "log_access_attributes":{
        "type":"firebase",
        "url":"https://netlify.firebaseio.com/builds/5b64d2c3792f8946ae9ddc8c/log"
    },
    "title":null,
    "review_url":null,
    "published_at":"2018-08-03T22:21:59.747Z",
    "context":"production",
    "deploy_time":2,
    "available_functions":[

    ],
    "summary":{

    }
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/newrelic/doc.md

```text
# Zulip New Relic integration

Get Zulip notification for New Relic incidents.

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. In New Relic, go to the **Alerts** menu, and select **Destinations**.
   Choose **Webhook** in the **Add a destination** section.

1. Set a **Webhook name**, such as `Zulip`. Set the **Endpoint URL** to
   the URL generated above. Click **Save destination**.

1. In the **Alerts** menu, select **Workflows**. Click on
   **+ Add a Workflow**.

1. Set your workflow name, and filter the trigger conditions. In the
   **Notify** section, choose **Webhook**. In the **Edit notification
   message** menu, select the destination for Zulip created above.

1. In the **Payload** section, you can configure the payload for this
   workflow. The default payload template is sufficient to get the
   integration working, but using the message template below will enable
   the integration to notify you of any **acknowledged** New Relic
   incidents. To include additional custom fields, refer to
   [configuration options](#configuration-options):

         {
            {% raw %}
            "id": {{ json issueId }},
            "issueUrl": {{ json issuePageUrl }},
            "title": {{ json annotations.title.[0] }},
            "priority": {{ json priority }},
            "totalIncidents": {{json totalIncidents}},
            "state": {{ json state }},
            "createdAt": {{ createdAt }},
            "updatedAt": {{ updatedAt }},
            "alertPolicyNames": {{ json accumulations.policyName }},
            "alertConditionNames": {{ json accumulations.conditionName }},
            "owner": {{ json owner }},
            "zulipCustomFields": {}
            {% endraw %}
         }

1. Click **Send test notification** to receive a test notification. Select
   **Save message**, and click **Activate Workflow**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/newrelic/001.png)

### Configuration options

* With New Relic's [custom payload feature][1], you can include custom
  fields in your Zulip notifications by configuring a `zulipCustomFields`
  dictionary in your notification payload template. The keys of
  `zulipCustomFields` will be displayed in the Zulip notification
  message, so we recommend that they be human-readable and descriptive.
  The values of the dictionary can be strings, integers, booleans, or
  lists of the those same data types.

### Related documentation

* [**New Relic webhook integration**][2]

* [**New Relic message templates**][1]

{!webhooks-url-specification.md!}

[1]: https://docs.newrelic.com/docs/alerts-applied-intelligence/notifications/message-templates/
[2]: https://docs.newrelic.com/docs/alerts/get-notified/notification-integrations/#webhook
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/newrelic/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class NewRelicHookTests(WebhookTestCase):
    CHANNEL_NAME = "newrelic"
    URL_TEMPLATE = "/api/v1/external/newrelic?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "newrelic"

    def test_incident_activated_new_default_payload(self) -> None:
        expected_topic_name = "zulip_app query result is > 1.0 for 1 minutes on 'Zulip S..."
        expected_message = """
:red_circle: **[zulip_app query result is > 1.0 for 1 minutes on 'Zulip Server Low Storage'](https://radar-api.service.newrelic.com/accounts/4420147/issues/c5faa7e6-7b54-402d-af79-f99601e0278c?notifier=WEBHOOK)**

```quote
**Priority**: CRITICAL
**State**: ACTIVATED
**Updated at**: <time:2024-04-22T07:08:28+00:00>

```

```spoiler :file: Incident details

- **Alert policies**: `Golden Signals`
- **Conditions**: `Zulip Server Low Storage`
- **Total incidents**: 1
- **Incident created at**: <time:2024-04-22T03:05:31+00:00>

```
""".strip()

        self.check_webhook(
            "incident_activated_new_default_payload",
            expected_topic_name,
            expected_message,
            content_type="application/json",
        )

    def test_incident_activated_new_provided_base_payload(self) -> None:
        expected_topic_name = "PIETER-UBUNTU query result is > 1.0 for 5 minutes on 'Sto..."
        expected_message = """
:orange_circle: **[PIETER-UBUNTU query result is > 1.0 for 5 minutes on 'Storage on Host Exceeded Threshold'](https://radar-api.service.newrelic.com/accounts/4420147/issues/13bbcdca-f0b6-470d-b0be-b34583c58869?notifier=WEBHOOK)**

```quote
**Priority**: HIGH
**State**: ACTIVATED
**Updated at**: <time:2024-04-22T07:12:29+00:00>

```

```spoiler :file: Incident details

- **Alert policies**: `Golden Signals`
- **Conditions**: `Storage on Host Exceeded Threshold`
- **Total incidents**: 1
- **Incident created at**: <time:2024-04-22T07:12:29+00:00>
- **Your custom payload**: somedata123

```
""".strip()

        self.check_webhook(
            "incident_activated_new_provided_base_payload",
            expected_topic_name,
            expected_message,
            content_type="application/json",
        )

    def test_incident_closed_default_payload(self) -> None:
        expected_topic_name = "main_app-UBUNTU query result is > 2.0 for 1 minutes on 'H..."
        expected_message = """
:red_circle: **[main_app-UBUNTU query result is > 2.0 for 1 minutes on 'High CPU'](https://radar-api.service.newrelic.com/accounts/1/issues/0ea2df1c-adab-45d2-aae0-042b609d2322?notifier=SLACK)**

```quote
**Priority**: CRITICAL
**State**: CLOSED
**Updated at**: <time:2024-04-22T06:17:37+00:00>

```

```spoiler :file: Incident details

- **Alert policies**: `Golden Signals`
- **Conditions**: `High CPU`
- **Total incidents**: 1
- **Incident created at**: <time:2024-04-22T06:16:30+00:00>

```
""".strip()

        self.check_webhook(
            "incident_closed_default_payload",
            expected_topic_name,
            expected_message,
            content_type="application/json",
        )

    def test_incident_closed_provided_base_payload(self) -> None:
        expected_topic_name = "PIETER-UBUNTU query result is > 1.0 for 5 minutes on 'Sto..."
        expected_message = """
:orange_circle: **[PIETER-UBUNTU query result is > 1.0 for 5 minutes on 'Storage on Host Exceeded Threshold'](https://radar-api.service.newrelic.com/accounts/4420147/issues/13bbcdca-f0b6-470d-b0be-b34583c58869?notifier=WEBHOOK)**

```quote
**Priority**: HIGH
**State**: CLOSED
**Updated at**: <time:2024-04-22T07:15:35+00:00>
**Acknowledged by**: Pieter Cardillo Kwok
```

```spoiler :file: Incident details

- **Alert policies**: `Golden Signals`
- **Conditions**: `Storage on Host Exceeded Threshold`
- **Total incidents**: 1
- **Incident created at**: <time:2024-04-22T07:12:29+00:00>
- **Your custom payload**: somedata123

```
""".strip()

        self.check_webhook(
            "incident_closed_provided_base_payload",
            expected_topic_name,
            expected_message,
            content_type="application/json",
        )

    def test_incident_acknowledged_default_payload(self) -> None:
        expected_topic_name = "PIETER-UBUNTU query result is > 1.0 for 5 minutes on 'Sto..."
        expected_message = """
:orange_circle: **[PIETER-UBUNTU query result is > 1.0 for 5 minutes on 'Storage on Host Exceeded Threshold'](https://radar-api.service.newrelic.com/accounts/4420147/issues/13bbcdca-f0b6-470d-b0be-b34583c58869?notifier=WEBHOOK)**

```quote
**Priority**: HIGH
**State**: ACTIVATED
**Updated at**: <time:2024-04-22T07:14:37+00:00>

```

```spoiler :file: Incident details

- **Alert policies**: `Golden Signals`
- **Conditions**: `Storage on Host Exceeded Threshold`
- **Total incidents**: 1
- **Incident created at**: <time:2024-04-22T07:12:29+00:00>

```
""".strip()

        self.check_webhook(
            "incident_acknowledged_default_payload",
            expected_topic_name,
            expected_message,
            content_type="application/json",
        )

    def test_incident_acknowledged_provided_base_payload(self) -> None:
        expected_topic_name = "PIETER-UBUNTU query result is > 1.0 for 5 minutes on 'Sto..."
        expected_message = """
:orange_circle: **[PIETER-UBUNTU query result is > 1.0 for 5 minutes on 'Storage on Host Exceeded Threshold'](https://radar-api.service.newrelic.com/accounts/4420147/issues/13bbcdca-f0b6-470d-b0be-b34583c58869?notifier=WEBHOOK)**

```quote
**Priority**: HIGH
**State**: ACTIVATED
**Updated at**: <time:2024-04-22T07:14:37+00:00>
**Acknowledged by**: Pieter Cardillo Kwok
```

```spoiler :file: Incident details

- **Alert policies**: `Golden Signals`
- **Conditions**: `Storage on Host Exceeded Threshold`
- **Total incidents**: 1
- **Incident created at**: <time:2024-04-22T07:12:29+00:00>

```
""".strip()

        self.check_webhook(
            "incident_acknowledged_provided_base_payload",
            expected_topic_name,
            expected_message,
            content_type="application/json",
        )

    def test_incident_created_default_payload(self) -> None:
        expected_topic_name = "MAIN-APP-UBUNTU query result is > 2.0 for 1 minutes on 'H..."
        expected_message = """
:red_circle: **[MAIN-APP-UBUNTU query result is > 2.0 for 1 minutes on 'High CPU'](https://radar-api.service.newrelic.com/accounts/1/issues/0ea2df1c-adab-45d2-aae0-042b609d2322?notifier=SLACK)**

```quote
**Priority**: CRITICAL
**State**: CREATED
**Updated at**: <time:2024-04-22T06:36:29+00:00>

```

```spoiler :file: Incident details

- **Alert policies**: `Golden Signals`
- **Conditions**: `High CPU`
- **Total incidents**: 1
- **Incident created at**: <time:2024-04-22T06:36:29+00:00>

```
""".strip()

        self.check_webhook(
            "incident_created_default_payload",
            expected_topic_name,
            expected_message,
            content_type="application/json",
        )

    def test_incident_created_provided_base_payload(self) -> None:
        expected_topic_name = "PIETER-UBUNTU query result is > 2.0 for 1 minutes on 'Hig..."
        expected_message = """
:red_circle: **[PIETER-UBUNTU query result is > 2.0 for 1 minutes on 'High CPU'](https://radar-api.service.newrelic.com/accounts/1/issues/0ea2df1c-adab-45d2-aae0-042b609d2322?notifier=SLACK)**

```quote
**Priority**: CRITICAL
**State**: CREATED
**Updated at**: <time:2024-04-22T06:36:29+00:00>
**Acknowledged by**: John Doe
```

```spoiler :file: Incident details

- **Alert policies**: `Golden Signals`
- **Conditions**: `High CPU`
- **Total incidents**: 1
- **Incident created at**: <time:2024-04-22T06:36:29+00:00>

```
""".strip()

        self.check_webhook(
            "incident_created_provided_base_payload",
            expected_topic_name,
            expected_message,
            content_type="application/json",
        )

    def test_incident_default_base_with_zulip_custom_fields(self) -> None:
        expected_topic_name = "PIETER-UBUNTU query result is > 1.0 for 5 minutes on 'Sto..."
        expected_message = """
:orange_circle: **[PIETER-UBUNTU query result is > 1.0 for 5 minutes on 'Storage on Host Exceeded Threshold'](https://radar-api.service.newrelic.com/accounts/4420147/issues/13bbcdca-f0b6-470d-b0be-b34583c58869?notifier=WEBHOOK)**

```quote
**Priority**: HIGH
**State**: ACTIVATED
**Updated at**: <time:2024-04-22T07:12:29+00:00>

```

```spoiler :file: Incident details

- **Alert policies**: `Golden Signals`
- **Conditions**: `Storage on Host Exceeded Threshold`
- **Total incidents**: 1
- **Incident created at**: <time:2024-04-22T07:12:29+00:00>
- **Your custom payload**: somedata123
- **Custom status 1**: True
- **Custom list 1**: SSD, 2000, False, None, 13.33
- **Custom field 1**: None
- **Custom field 2**: 9000

```
""".strip()

        self.check_webhook(
            "incident_default_base_with_zulip_custom_fields",
            expected_topic_name,
            expected_message,
            content_type="application/json",
        )

    def test_incident_provided_base_with_zulip_custom_fields(self) -> None:
        expected_topic_name = "main_app-UBUNTU query result is > 2.0 for 1 minutes on 'H..."
        expected_message = """
:red_circle: **[main_app-UBUNTU query result is > 2.0 for 1 minutes on 'High CPU'](https://radar-api.service.newrelic.com/accounts/1/issues/0ea2df1c-adab-45d2-aae0-042b609d2322?notifier=SLACK)**

```quote
**Priority**: CRITICAL
**State**: CLOSED
**Updated at**: <time:2024-04-22T06:17:37+00:00>

```

```spoiler :file: Incident details

- **Alert policies**: `Golden Signals`
- **Conditions**: `High CPU`
- **Total incidents**: 1
- **Incident created at**: <time:2024-04-22T06:16:30+00:00>
- **Your custom payload**: somedata123
- **Custom status 1**: True
- **Custom list 1**: SSD, 2000, False, None, 13.33
- **Custom field 1**: None
- **Custom field 2**: 9000

```
""".strip()

        self.check_webhook(
            "incident_provided_base_with_zulip_custom_fields",
            expected_topic_name,
            expected_message,
            content_type="application/json",
        )

    def test_incident_with_invalid_zulip_custom_fields(self) -> None:
        expected_topic_name = "PIETER-UBUNTU query result is > 1.0 for 5 minutes on 'Sto..."
        expected_message = """
:orange_circle: **[PIETER-UBUNTU query result is > 1.0 for 5 minutes on 'Storage on Host Exceeded Threshold'](https://radar-api.service.newrelic.com/accounts/4420147/issues/13bbcdca-f0b6-470d-b0be-b34583c58869?notifier=WEBHOOK)**

```quote
**Priority**: HIGH
**State**: ACTIVATED
**Updated at**: <time:2024-04-22T07:12:29+00:00>

```

```spoiler :file: Incident details

- **Alert policies**: `Golden Signals`
- **Conditions**: `Storage on Host Exceeded Threshold`
- **Total incidents**: 1
- **Incident created at**: <time:2024-04-22T07:12:29+00:00>
- **Invalid fields 1**: *Value is not a supported data type*
- **Invalid field 2**: *Value is not a supported data type*
- **Is valid**: True

```
""".strip()

        self.check_webhook(
            "incident_with_invalid_zulip_custom_fields",
            expected_topic_name,
            expected_message,
            content_type="application/json",
        )

    def test_missing_essential_fields_default_payload(self) -> None:
        expected_topic_name = "New Relic incident alerts"
        expected_message = """
:danger: A New Relic [incident](https://one.newrelic.com/alerts-ai) updated

**Warning**: Unable to use the default notification format because at least one expected field was missing from the incident payload. See [New Relic integration documentation](/integrations/newrelic).

**Missing fields**: `issueUrl`, `title`, `priority`, `totalIncidents`, `state`, `createdAt`, `updatedAt`, `alertPolicyNames`, `alertConditionNames`
""".strip()

        self.check_webhook(
            "missing_essential_fields_default_payload",
            expected_topic_name,
            expected_message,
            content_type="application/json",
        )
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/newrelic/view.py
Signals: Django

```python
# Webhooks for external integrations.

from django.core.exceptions import ValidationError
from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.timestamp import datetime_to_global_time, timestamp_to_datetime
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import (
    WildValue,
    check_float,
    check_int,
    check_list,
    check_none_or,
    check_string,
    check_string_in,
    check_union,
)
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

MISSING_FIELDS_NOTIFICATION = """
:danger: A New Relic [incident]({url}) updated

**Warning**: Unable to use the default notification format because at least one expected field was missing from the incident payload. See [New Relic integration documentation](/integrations/newrelic).

**Missing fields**: {formatted_missing_fields}
"""

NOTIFICATION_TEMPLATE = """
{priority_symbol} **[{title}]({incident_url})**

```quote
**Priority**: {priority}
**State**: {state}
**Updated at**: {time_updated}
{owner}
```

```spoiler :file: Incident details
{details}
```
"""

NOTIFICATION_DETAILS = """
- **Alert policies**: {alert_policy}
- **Conditions**: {conditions}
- **Total incidents**: {total_incidents}
- **Incident created at**: {time_created}
"""

ALL_EVENT_TYPES = ["CREATED", "ACTIVATED", "CLOSED"]

PRIORITIES = {
    "CRITICAL": ":red_circle:",
    "HIGH": ":orange_circle:",
    "MEDIUM": ":yellow:",
    "LOW": ":blue_circle:",
}

DEFAULT_NEWRELIC_URL = "https://one.newrelic.com/alerts-ai"


EXPECTED_FIELDS = [
    "issueUrl",
    "title",
    "priority",
    "totalIncidents",
    "state",
    "createdAt",
    "updatedAt",
    "alertPolicyNames",
    "alertConditionNames",
]


def get_timestamp_string(payload: WildValue, field: str) -> str:
    unix_time = payload[field].tame(check_int)
    return datetime_to_global_time(timestamp_to_datetime(unix_time / 1000))


def parse_payload(payload: WildValue) -> dict[str, str]:
    priority = payload["priority"].tame(check_string_in(PRIORITIES.keys()))
    priority_symbol = PRIORITIES.get(priority, ":alert:")
    conditions_list = payload.get("alertConditionNames", ["Unknown condition"]).tame(
        check_list(check_string)
    )
    conditions = ", ".join([f"`{c}`" for c in conditions_list])
    policy_list = payload.get("alertPolicyNames", ["Unknown policy"]).tame(check_list(check_string))
    alert_policy = ", ".join([f"`{p}`" for p in policy_list])

    owner = payload.get("owner").tame(check_none_or(check_string))
    acknowledged = ""
    if owner and owner != "N/A":
        acknowledged = f"**Acknowledged by**: {owner}"

    message_context: dict[str, str] = {
        "title": payload["title"].tame(check_string),
        "incident_url": payload.get("issueUrl", DEFAULT_NEWRELIC_URL).tame(check_string),
        "total_incidents": str(payload["totalIncidents"].tame(check_int)),
        "state": payload["state"].tame(check_string_in(ALL_EVENT_TYPES)),
        "time_created": get_timestamp_string(payload, "createdAt"),
        "time_updated": get_timestamp_string(payload, "updatedAt"),
        "priority": priority,
        "priority_symbol": priority_symbol,
        "conditions": conditions,
        "alert_policy": alert_policy,
        "owner": acknowledged,
    }

    return message_context


def format_zulip_custom_fields(payload: WildValue) -> str:
    body_custom_field_detail: str = ""
    zulip_custom_fields = payload.get("zulipCustomFields", {})

    for key, value in zulip_custom_fields.items():
        custom_field_name = key.capitalize()
        try:
            details = value.tame(
                check_none_or(
                    check_union(
                        [
                            check_int,
                            check_float,
                            check_string,
                            check_list(
                                check_none_or(check_union([check_int, check_float, check_string]))
                            ),
                        ]
                    )
                )
            )
            if isinstance(details, list):
                custom_field_detail = ", ".join([f"{detail}" for detail in details])
            else:
                custom_field_detail = f"{details}"

            custom_field_message = f"- **{custom_field_name}**: {custom_field_detail}\n"
            body_custom_field_detail += custom_field_message
        except ValidationError:
            invalid_field_message = (
                f"- **{custom_field_name}**: *Value is not a supported data type*\n"
            )
            body_custom_field_detail += invalid_field_message
    return body_custom_field_detail


def check_for_expected_fields(payload: WildValue) -> list[str]:
    return [key for key in EXPECTED_FIELDS if key not in payload]


@webhook_view("NewRelic", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_newrelic_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    missing_fields = check_for_expected_fields(payload)
    if missing_fields:
        formatted_missing_fields = ", ".join([f"`{fields}`" for fields in missing_fields])
        content = MISSING_FIELDS_NOTIFICATION.format(
            url=DEFAULT_NEWRELIC_URL,
            formatted_missing_fields=formatted_missing_fields,
        )
        topic = "New Relic incident alerts"
        check_send_webhook_message(request, user_profile, topic, content)
        return json_success(request)

    message_context = parse_payload(payload)
    incident_details = NOTIFICATION_DETAILS.format(**message_context)
    incident_details += format_zulip_custom_fields(payload)
    content = NOTIFICATION_TEMPLATE.format(details=incident_details, **message_context)
    topic = message_context["title"]
    check_send_webhook_message(request, user_profile, topic, content, message_context["state"])
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: essential_fields_default_payload.json]---
Location: zulip-main/zerver/webhooks/newrelic/fixtures/essential_fields_default_payload.json

```json
{
	"issueUrl": "https://radar-api.service.newrelic.com/accounts/1/issues/0ea2df1c-adab-45d2-aae0-042b609d2322?notifier=SLACK",
	"title": "PIETER-UBUNTU query result is > 2.0 for 1 minutes on 'High CPU'",
	"priority": "CRITICAL",
	"totalIncidents": 1,
	"state": "CREATED",
	"createdAt": 1713592289021,
	"updatedAt": 1713592289021,
	"alertPolicyNames": ["Golden Signals"],
	"alertConditionNames": ["High CPU"]
}
```

--------------------------------------------------------------------------------

---[FILE: incident_acknowledged_default_payload.json]---
Location: zulip-main/zerver/webhooks/newrelic/fixtures/incident_acknowledged_default_payload.json

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
    "trigger": "USER_ACTION",
    "isCorrelated": "false",
    "createdAt": 1713769949493,
    "updatedAt": 1713770077412,
    "sources": [
      "newrelic"
    ],
    "alertPolicyNames": [
      "Golden Signals"
    ],
    "alertConditionNames": [
      "Storage on Host Exceeded Threshold"
    ],
    "workflowName": "issue workflow"
  }
```

--------------------------------------------------------------------------------

---[FILE: incident_acknowledged_provided_base_payload.json]---
Location: zulip-main/zerver/webhooks/newrelic/fixtures/incident_acknowledged_provided_base_payload.json

```json
{
    "id": "13bbcdca-f0b6-470d-b0be-b34583c58869",
    "issueUrl": "https://radar-api.service.newrelic.com/accounts/4420147/issues/13bbcdca-f0b6-470d-b0be-b34583c58869?notifier=WEBHOOK",
    "title": "PIETER-UBUNTU query result is > 1.0 for 5 minutes on 'Storage on Host Exceeded Threshold'",
    "priority": "HIGH",
    "totalIncidents": 1,
    "state": "ACTIVATED",
    "createdAt": 1713769949493,
    "updatedAt": 1713770077412,
    "alertPolicyNames": [
      "Golden Signals"
    ],
    "alertConditionNames": [
      "Storage on Host Exceeded Threshold"
    ],
    "owner": "Pieter Cardillo Kwok",
    "zulipCustomFields": {
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: incident_activated_new_default_payload.json]---
Location: zulip-main/zerver/webhooks/newrelic/fixtures/incident_activated_new_default_payload.json

```json
{
    "id": "c5faa7e6-7b54-402d-af79-f99601e0278c",
    "issueUrl": "https://radar-api.service.newrelic.com/accounts/4420147/issues/c5faa7e6-7b54-402d-af79-f99601e0278c?notifier=WEBHOOK",
    "title": "zulip_app query result is > 1.0 for 1 minutes on 'Zulip Server Low Storage'",
    "priority": "CRITICAL",
    "impactedEntities": [
      "zulip_app"
    ],
    "totalIncidents": 1,
    "state": "ACTIVATED",
    "trigger": "STATE_CHANGE",
    "isCorrelated": false,
    "createdAt": 1713755131352,
    "updatedAt": 1713769708699,
    "sources": [
      "newrelic"
    ],
    "alertPolicyNames": [
      "Golden Signals"
    ],
    "alertConditionNames": [
      "Zulip Server Low Storage"
    ],
    "workflowName": "testWorkflow"
  }
```

--------------------------------------------------------------------------------

---[FILE: incident_activated_new_provided_base_payload.json]---
Location: zulip-main/zerver/webhooks/newrelic/fixtures/incident_activated_new_provided_base_payload.json

```json
{
    "id": "13bbcdca-f0b6-470d-b0be-b34583c58869",
    "issueUrl": "https://radar-api.service.newrelic.com/accounts/4420147/issues/13bbcdca-f0b6-470d-b0be-b34583c58869?notifier=WEBHOOK",
    "title": "PIETER-UBUNTU query result is > 1.0 for 5 minutes on 'Storage on Host Exceeded Threshold'",
    "priority": "HIGH",
    "totalIncidents": 1,
    "state": "ACTIVATED",
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
      "Your custom payload": "somedata123"
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: incident_closed_default_payload.json]---
Location: zulip-main/zerver/webhooks/newrelic/fixtures/incident_closed_default_payload.json

```json
{
	"id": "95a9344a-2590-48ce-8d83-07e28b6d22c6",
	"issueUrl": "https://radar-api.service.newrelic.com/accounts/1/issues/0ea2df1c-adab-45d2-aae0-042b609d2322?notifier=SLACK",
	"title": "main_app-UBUNTU query result is > 2.0 for 1 minutes on 'High CPU'",
	"priority": "CRITICAL",
	"impactedEntities": ["main_app-UBUNTU"],
	"totalIncidents": 1,
	"state": "CLOSED",
	"trigger": "INCIDENT_CLOSED",
	"isCorrelated": false,
	"createdAt": 1713766590228,
	"updatedAt": 1713766657383,
	"sources": ["newrelic"],
	"alertPolicyNames": ["Golden Signals"],
	"alertConditionNames": ["High CPU"],
	"workflowName": "DBA Team workflow"
}
```

--------------------------------------------------------------------------------

---[FILE: incident_closed_provided_base_payload.json]---
Location: zulip-main/zerver/webhooks/newrelic/fixtures/incident_closed_provided_base_payload.json

```json
{
    "id": "13bbcdca-f0b6-470d-b0be-b34583c58869",
    "issueUrl": "https://radar-api.service.newrelic.com/accounts/4420147/issues/13bbcdca-f0b6-470d-b0be-b34583c58869?notifier=WEBHOOK",
    "title": "PIETER-UBUNTU query result is > 1.0 for 5 minutes on 'Storage on Host Exceeded Threshold'",
    "priority": "HIGH",
    "totalIncidents": 1,
    "state": "CLOSED",
    "createdAt": 1713769949493,
    "updatedAt": 1713770135419,
    "alertPolicyNames": [
      "Golden Signals"
    ],
    "alertConditionNames": [
      "Storage on Host Exceeded Threshold"
    ],
    "owner": "Pieter Cardillo Kwok",
    "zulipCustomFields": {
      "Your custom payload": "somedata123"
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: incident_created_default_payload.json]---
Location: zulip-main/zerver/webhooks/newrelic/fixtures/incident_created_default_payload.json

```json
{
    "id": "208c5e92-f250-40be-b7c2-50508c268c15",
    "issueUrl": "https://radar-api.service.newrelic.com/accounts/1/issues/0ea2df1c-adab-45d2-aae0-042b609d2322?notifier=SLACK",
    "title": "MAIN-APP-UBUNTU query result is > 2.0 for 1 minutes on 'High CPU'",
    "priority": "CRITICAL",
    "impactedEntities": [
        "MAIN-APP-UBUNTU"
    ],
    "totalIncidents": 1,
    "state": "CREATED",
    "trigger": "INCIDENT_ADDED",
    "isCorrelated": false,
    "createdAt": 1713767789495,
    "updatedAt": 1713767789495,
    "sources": [
        "newrelic"
    ],
    "alertPolicyNames": [
        "Golden Signals"
    ],
    "alertConditionNames": [
        "High CPU"
    ],
    "workflowName": "DBA Team workflow"
}
```

--------------------------------------------------------------------------------

---[FILE: incident_created_provided_base_payload.json]---
Location: zulip-main/zerver/webhooks/newrelic/fixtures/incident_created_provided_base_payload.json

```json
{
	"id": "208c5e92-f250-40be-b7c2-50508c268c15",
	"issueUrl": "https://radar-api.service.newrelic.com/accounts/1/issues/0ea2df1c-adab-45d2-aae0-042b609d2322?notifier=SLACK",
	"title": "PIETER-UBUNTU query result is > 2.0 for 1 minutes on 'High CPU'",
	"priority": "CRITICAL",
	"totalIncidents": 1,
	"state": "CREATED",
	"createdAt": 1713767789495,
	"updatedAt": 1713767789495,
	"alertPolicyNames": ["Golden Signals"],
	"alertConditionNames": ["High CPU"],
    "owner": "John Doe",
    "zulipCustomFields":{
    }
}
```

--------------------------------------------------------------------------------

````
