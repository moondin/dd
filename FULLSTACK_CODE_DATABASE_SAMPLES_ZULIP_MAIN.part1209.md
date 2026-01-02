---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1209
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1209 of 1290)

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

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/gosquared/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase
from zerver.webhooks.gosquared.view import CHAT_MESSAGE_TEMPLATE


class GoSquaredHookTests(WebhookTestCase):
    CHANNEL_NAME = "gosquared"
    URL_TEMPLATE = "/api/v1/external/gosquared?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "gosquared"

    # Note: Include a test function per each distinct message condition your integration supports
    def test_traffic_message(self) -> None:
        expected_topic_name = "GoSquared - requestb.in"
        expected_message = (
            "[requestb.in](https://www.gosquared.com/now/GSN-595854-T) has 33 visitors online."
        )

        self.check_webhook(
            "traffic_spike",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_chat_message(self) -> None:
        expected_topic_name = "Live chat session - Zulip Chat"
        expected_message = CHAT_MESSAGE_TEMPLATE.format(
            status="visitor",
            name="John Smith",
            content="Zulip is awesome!",
        )

        self.check_webhook(
            "chat_message",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/gosquared/view.py
Signals: Django

```python
from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.exceptions import UnsupportedWebhookEventTypeError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_bool, check_int, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

TRAFFIC_SPIKE_TEMPLATE = "[{website_name}]({website_url}) has {user_num} visitors online."
CHAT_MESSAGE_TEMPLATE = """
The {status} **{name}** messaged:

``` quote
{content}
```
""".strip()


ALL_EVENT_TYPES = ["chat_message", "traffic_spike"]


@webhook_view("GoSquared", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_gosquared_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    body = ""
    topic_name = ""

    # Unfortunately, there is no other way to infer the event type
    # than just inferring it from the payload's attributes
    # Traffic spike/dip event
    if "concurrents" in payload and "siteDetails" in payload:
        domain_name = payload["siteDetails"]["domain"].tame(check_string)
        user_num = payload["concurrents"].tame(check_int)
        user_acc = payload["siteDetails"]["acct"].tame(check_string)
        acc_url = "https://www.gosquared.com/now/" + user_acc
        body = TRAFFIC_SPIKE_TEMPLATE.format(
            website_name=domain_name, website_url=acc_url, user_num=user_num
        )
        topic_name = f"GoSquared - {domain_name}"
        check_send_webhook_message(request, user_profile, topic_name, body, "traffic_spike")

    # Live chat message event
    elif payload.get("message") is not None and payload.get("person") is not None:
        # Only support non-direct messages
        if not payload["message"]["private"].tame(check_bool):
            session_title = payload["message"]["session"]["title"].tame(check_string)
            topic_name = f"Live chat session - {session_title}"
            body = CHAT_MESSAGE_TEMPLATE.format(
                status=payload["person"]["status"].tame(check_string),
                name=payload["person"]["_anon"]["name"].tame(check_string),
                content=payload["message"]["content"].tame(check_string),
            )
            check_send_webhook_message(request, user_profile, topic_name, body, "chat_message")
    else:
        raise UnsupportedWebhookEventTypeError("unknown_event")

    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: chat_message.json]---
Location: zulip-main/zerver/webhooks/gosquared/fixtures/chat_message.json

```json
{
    "site_token":"GSN-47568-O",
    "timestamp":"2018-11-07T21:48:16.072Z",
    "version":"0.0.1",
    "person":{
        "status":"visitor",
        "_anon":{
            "name":"John Smith",
            "shape":"sun-shape",
            "color":"#1F3A93"
        },
        "presence":"online",
        "chat":{
            "language":"de-DE",
            "agent":{
                "assigned":null,
                "delivered":1541627243633,
                "read":1541623962177
            },
            "client":{
                "delivered":0,
                "read":1541627243633
            },
            "archived":null,
            "translationPaused":false,
            "latest":{
                "timestamp":1541627296072,
                "message":{
                    "session":{
                        "title":"Zulip Chat",
                        "href":"https:\/\/www.zulipchat.com\/"
                    },
                    "data":{

                    },
                    "content":"Zulip is awesome!",
                    "id":"984fde4-86fd-2345-sldk-2sdkfksldff",
                    "from":"client",
                    "type":"message",
                    "timestamp":1541627296072,
                    "private":false,
                    "entities":[

                    ]
                }
            }
        },
        "lead":{
            "email":""
        },
        "_links":[
            {
                "method":"GET",
                "rel":"self",
                "href":"https:\/\/api.gosquared.com\/chat\/v1\/chats\/lkjsdfsdflkj"
            }
        ],
        "avatar":"",
        "id":"Zulip Chat: cslkjfd09347kjldf098342",
        "email":"",
        "name":"",
        "deleted":false
    },
    "message":{
        "session":{
            "title":"Zulip Chat",
            "href":"https:\/\/www.zulipchat.com\/"
        },
        "person_id":"Zulip Chat: cslkjfd09347kjldf098342",
        "data":{

        },
        "content":"Zulip is awesome!",
        "id":"984fde4-86fd-2345-sldk-2sdkfksldff",
        "from":"client",
        "type":"message",
        "timestamp":1541627296072,
        "private":false,
        "entities":[

        ]
    }
}
```

--------------------------------------------------------------------------------

---[FILE: traffic_spike.json]---
Location: zulip-main/zerver/webhooks/gosquared/fixtures/traffic_spike.json

```json
{
	"triggeredAlert": {
		"id": 28632,
		"boundary": "lower",
		"value": "3",
		"type": "concurrents"
	},
	"siteDetails": {
		"user_id": 81923,
		"acct": "GSN-595854-T",
		"email": "asdasd@fasdf.com",
		"first_name": "sadasd",
		"last_name": "",
		"site_name": "http://requestb.in/",
		"domain": "requestb.in",
		"url": "http://requestb.in/",
		"timezone": "Australia/Sydney"
	},
	"snapshot": {
		"time": {
			"time": 1481952442380,
			"local": "2016-12-17T16:27:22+11:00"
		},
		"concurrents": {
			"visitors": 0,
			"returning": 0,
			"pages": 0,
			"active": 0,
			"tagged": 0
		},
		"timeSeries": {
			"visitors.total": [{
				"time": "2016-12-17T15:57:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T15:58:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T15:59:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T16:00:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T16:01:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T16:02:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T16:03:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T16:04:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T16:05:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T16:06:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T16:07:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T16:08:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T16:09:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T16:10:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T16:11:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T16:12:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T16:13:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T16:14:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T16:15:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T16:16:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T16:17:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T16:18:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T16:19:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T16:20:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T16:21:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T16:22:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T16:23:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T16:24:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T16:25:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T16:26:22+11:00",
				"value": 0
			}, {
				"time": "2016-12-17T16:27:22+11:00",
				"value": 0
			}]
		},
		"pages": {
			"list": [],
			"cardinality": 0
		},
		"sources": {
			"direct": 0,
			"site": {
				"list": [],
				"visitors": 0,
				"cardinality": 0
			},
			"social": {
				"list": [],
				"visitors": 0,
				"cardinality": 0
			},
			"organic": {
				"list": [],
				"visitors": 0,
				"cardinality": 0
			},
			"internal": {
				"list": [],
				"visitors": 0,
				"cardinality": 0
			}
		},
		"engagement": {
			"timeOnSite": {
				"breakdown": {
					"0": 0,
					"10": 0,
					"30": 0,
					"60": 0,
					"300": 0,
					"900": 0,
					"1800": 0
				},
				"average": 0
			},
			"visitDepth": {
				"breakdown": {
					"1": 0,
					"2": 0,
					"5": 0,
					"15": 0,
					"30": 0,
					"60": 0
				},
				"detailedBreakdown": {},
				"average": 0
			}
		}
	},
	"concurrents": 33
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/grafana/doc.md

```text
# Zulip Grafana integration

See your Grafana dashboard alerts in Zulip!

### Create Zulip bot for Grafana alerts

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

{end_tabs}

### Instructions for Grafana

{start_tabs}

{tab|grafana-latest}

1. In Grafana, go to **Alerting**. Click on **Contact points**, and then
   **Add contact point**.

1. Set a name for the contact point, such as `Zulip`. Under
   **Integration**, choose  **Webhook**, and set **URL** to the URL
   generated above. Under **Optional Webhook settings**, choose **POST**
   as the **HTTP method**. Click on **Test** to send a test
   notification, and if it's successful, click **Save contact point**.

1. Go to **Notification policies**, and create a new policy, e.g., a
   **New nested policy** of the **Default policy**. Set the **Matching
   label** as **Zulip** = 1, and set the **Contact point** to the one
   created above. Click **Save policy**.

1. Go to **Alert rules**, and click **Create alert rule**. Make sure you
   set a **Rule name**. In the **Notifications** section, add a label
   that matches the label created for the notification policy above.
   You can customize the **query and alert condition**, **alert
   evaluation behavior**, and other conditions for your alerts. When
   you're done, click **Save rule**.

{tab|grafana-older-version}

1. In Grafana, go to **Alerting**. Click on **Notification channels**.

1. Configure **Edit Notification Channel** as appropriate for your
   alert notification. Set a name for the notification channel, such
   as `Zulip`. Under **Type**, choose **webhook**. In **Webhook
   Settings**, set **URL** to the URL generated above. Under **HTTP
   method**, choose **POST**. Click **Save**.

1. Create an alert. In your new alert rule, go to the **Notifications**
   section. Click on the button next to **Send to** and select the
   webhook notification channel you created above. You can also choose
   to write a message, which will be included in your Zulip
   notifications.

1. Return to **Notification channels**, and click **Send Test**. You
   should see a Grafana test alert notification in Zulip.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/grafana/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/grafana/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class GrafanaHookTests(WebhookTestCase):
    CHANNEL_NAME = "grafana"
    URL_TEMPLATE = "/api/v1/external/grafana?&api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "grafana"

    def test_alert_v7(self) -> None:
        expected_topic_name = "[Alerting] Test notification"
        expected_message = """
:alert: **ALERTING**

[Test rule](http://localhost:3000/)

Someone is testing the alert notification within grafana.

**High value:** 100
**Higher Value:** 200

[Click to view visualization](https://grafana.com/assets/img/blog/mixed_styles.png)
""".strip()

        self.check_webhook(
            "alert_v7",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_no_data_alert_v7(self) -> None:
        expected_topic_name = "[Alerting] No Data alert"
        expected_message = """
:alert: **ALERTING**

[No Data alert](http://localhost:3000/d/GG2qhR3Wz/alerttest?fullscreen&edit&tab=alert&panelId=6&orgId=1)

The panel has no data.

""".strip()

        self.check_webhook(
            "no_data_alert_v7",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_no_message_alert_v7(self) -> None:
        expected_topic_name = "[Alerting] No Message alert"
        expected_message = """
:alert: **ALERTING**

[No Message alert](http://localhost:3000/d/GG2qhR3Wz/alerttest?fullscreen&edit&tab=alert&panelId=8&orgId=1)

**A-series:** 21.573108436586445
""".strip()

        self.check_webhook(
            "no_message_alert_v7",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_alert_ok_v7(self) -> None:
        expected_topic_name = "[Ok] Test notification"
        expected_message = """
:squared_ok: **OK**

[Test rule](http://localhost:3000/)

Someone is testing the alert notification within grafana.

**High value:** 0

[Click to view visualization](https://grafana.com/assets/img/blog/mixed_styles.png)
""".strip()

        self.check_webhook(
            "alert_ok_v7",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_alert_paused_v7(self) -> None:
        expected_topic_name = "[Paused] Test notification"
        expected_message = """
:info: **PAUSED**

[Test rule](http://localhost:3000/)

Someone is testing the alert notification within grafana.


[Click to view visualization](https://grafana.com/assets/img/blog/mixed_styles.png)
""".strip()

        self.check_webhook(
            "alert_paused_v7",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_alert_pending_v7(self) -> None:
        expected_topic_name = "[Pending] Test notification"
        expected_message = """
:info: **PENDING**

[Test rule](http://localhost:3000/)

Someone is testing the alert notification within grafana.

**High value:** 100
**Higher Value:** 200

[Click to view visualization](https://grafana.com/assets/img/blog/mixed_styles.png)
""".strip()

        # use fixture named helloworld_hello
        self.check_webhook(
            "alert_pending_v7",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_alert_v8(self) -> None:
        expected_topic_name = "[TestAlert]"
        expected_message = """
:checkbox: **RESOLVED**

**TestAlert**

This alert was fired at <time:2022-08-31T05:54:04+00:00>.

This alert was resolved at <time:2022-08-31T10:30:00+00:00>.

Labels:
- alertname: TestAlert
- instance: Grafana

Values:
[ metric='foo' labels={instance=bar} value=10 ]

Annotations:
- summary: Notification test

[Silence](https://zuliptestingwh2.grafana.net/alerting/silence/new?alertmanager=grafana&matcher=alertname%3DTestAlert&matcher=instance%3DGrafana)
""".strip()

        self.check_webhook(
            "alert_v8",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_alert_multiple_v8(self) -> None:
        expected_topic_name_1 = "[High memory usage]"
        expected_topic_name_2 = "[High CPU usage]"
        expected_message_1 = """
:alert: **FIRING**

**High memory usage**

This alert was fired at <time:2021-10-12T09:51:03+02:00>.

Labels:
- alertname: High memory usage
- team: blue
- zone: us-1

Values:
[ metric='' labels={} value=14151.331895396988 ]

Annotations:
- description: The system has high memory usage
- runbook_url: https://myrunbook.com/runbook/1234
- summary: This alert was triggered for zone us-1

[Generator](https://play.grafana.org/alerting/1afz29v7z/edit)
[Silence](https://play.grafana.org/alerting/silence/new?alertmanager=grafana&matchers=alertname%3DT2%2Cteam%3Dblue%2Czone%3Dus-1)
""".strip()
        expected_message_2 = """
:alert: **FIRING**

**High CPU usage**

This alert was fired at <time:2021-10-12T09:56:03+02:00>.

Labels:
- alertname: High CPU usage
- team: blue
- zone: eu-1

Values:
[ metric='' labels={} value=47043.702386305304 ]

Annotations:
- description: The system has high CPU usage
- runbook_url: https://myrunbook.com/runbook/1234
- summary: This alert was triggered for zone eu-1

[Generator](https://play.grafana.org/alerting/d1rdpdv7k/edit)
[Silence](https://play.grafana.org/alerting/silence/new?alertmanager=grafana&matchers=alertname%3DT1%2Cteam%3Dblue%2Czone%3Deu-1)
""".strip()

        self.subscribe(self.test_user, self.CHANNEL_NAME)
        payload = self.get_body("alert_multiple_v8")

        msg = self.send_webhook_payload(
            self.test_user,
            self.url,
            payload,
            content_type="application/json",
        )

        msg = self.get_second_to_last_message()
        self.assert_channel_message(
            message=msg,
            channel_name=self.CHANNEL_NAME,
            topic_name=expected_topic_name_1,
            content=expected_message_1,
        )

        msg = self.get_last_message()
        self.assert_channel_message(
            message=msg,
            channel_name=self.CHANNEL_NAME,
            topic_name=expected_topic_name_2,
            content=expected_message_2,
        )

    def test_alert_values_v11(self) -> None:
        expected_topic_name = "[Memory (copy)]"  # alertname
        expected_message = """
:alert: **FIRING**

**Memory (copy)**

This alert was fired at <time:2024-03-01T02:09:00+00:00>.

Labels:
- alertname: Memory (copy)
- debug: true
- grafana_folder: device

Values:
- A: 2473545728
- B: 0
- C: 1
- minute: 9

Annotations:
- summary: High memory usage

[Generator](https://play.grafana.org/alerting/grafana/dd2f0260-3cfc-4c65-a4c4-f3f632c551f4/view?orgId=1)
[Silence](https://play.grafana.org/alerting/silence/new?alertmanager=grafana\u0026matcher=alertname%3DMemory+%28copy%29\u0026matcher=debug%3Dtrue\u0026matcher=grafana_folder%3Ddevice\u0026orgId=1)
[Image](https://grafana.com/assets/img/blog/mixed_styles.png)
""".strip()

        self.check_webhook(
            "alert_values_v11",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_alert_no_alertname_v11(self) -> None:
        expected_topic_name = "[e6349a25f5ef0e9e]"  # fingerprint
        expected_message = """
:alert: **FIRING**

This alert was fired at <time:2024-03-01T02:09:00+00:00>.

Labels:
- debug: true
- grafana_folder: device

Values:
- A: 2473545728
- B: 0
- C: 1
- minute: 9

Annotations:
- summary: High memory usage

[Generator](https://play.grafana.org/alerting/grafana/dd2f0260-3cfc-4c65-a4c4-f3f632c551f4/view?orgId=1)
[Silence](https://play.grafana.org/alerting/silence/new?alertmanager=grafana\u0026matcher=alertname%3DMemory+%28copy%29\u0026matcher=debug%3Dtrue\u0026matcher=grafana_folder%3Ddevice\u0026orgId=1)
[Image](https://grafana.com/assets/img/blog/mixed_styles.png)
""".strip()

        self.check_webhook(
            "alert_no_alertname_v11",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/grafana/view.py
Signals: Django

```python
from datetime import datetime

from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.timestamp import datetime_to_global_time
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import (
    WildValue,
    check_anything,
    check_float,
    check_int,
    check_none_or,
    check_string,
    check_string_in,
    check_union,
)
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

OLD_TOPIC_TEMPLATE = "{alert_title}"

ALERT_STATUS_TEMPLATE = "{alert_icon} **{alert_state}**\n\n"

OLD_MESSAGE_TEMPLATE = "{alert_status}[{rule_name}]({rule_url})\n\n{alert_message}{eval_matches}"

NEW_TOPIC_TEMPLATE = "[{alertname}]"

START_TIME_TEMPLATE = "This alert was fired at {start_time}."

END_TIME_TEMPLATE = "\n\nThis alert was resolved at {end_time}."

MESSAGE_LABELS_TEMPLATE = "\n\nLabels:\n{label_information}\n"

MESSAGE_VALUES_TEMPLATE = "Values:\n{value_information}\n"

MESSAGE_ANNOTATIONS_TEMPLATE = "Annotations:\n{annotation_information}"

MESSAGE_GENERATOR_TEMPLATE = "\n[Generator]({generator_url})"

MESSAGE_SILENCE_TEMPLATE = "\n[Silence]({silence_url})"

MESSAGE_IMAGE_TEMPLATE = "\n[Image]({image_url})"

LEGACY_EVENT_TYPES = ["ok", "pending", "alerting", "paused"]

NEW_EVENT_TYPES = ["firing", "resolved"]

ALL_EVENT_TYPES = LEGACY_EVENT_TYPES + NEW_EVENT_TYPES


def get_global_time(dt_str: str) -> str:
    dt = datetime.fromisoformat(dt_str)
    return datetime_to_global_time(dt)


@webhook_view("Grafana", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_grafana_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    # Grafana alerting system.
    if "alerts" in payload:
        # Grafana 8.0 and above alerting; works for:
        # - https://grafana.com/docs/grafana/v8.0/alerting/unified-alerting/message-templating/template-data/
        # - https://grafana.com/docs/grafana/v9.0/alerting/contact-points/notifiers/webhook-notifier/
        # - https://grafana.com/docs/grafana/v10.0/alerting/alerting-rules/manage-contact-points/webhook-notifier/
        # - https://grafana.com/docs/grafana/v11.0/alerting/configure-notifications/manage-contact-points/integrations/webhook-notifier/
        for alert in payload["alerts"]:
            status = alert["status"].tame(check_string_in(["firing", "resolved"]))
            if status == "firing":
                body = ALERT_STATUS_TEMPLATE.format(
                    alert_icon=":alert:", alert_state=status.upper()
                )
            else:
                body = ALERT_STATUS_TEMPLATE.format(
                    alert_icon=":checkbox:", alert_state=status.upper()
                )

            if "alertname" in alert["labels"] and alert["labels"]["alertname"]:
                alertname = alert["labels"]["alertname"].tame(check_string)
                topic_name = NEW_TOPIC_TEMPLATE.format(alertname=alertname)
                body += "**" + alertname + "**\n\n"
            else:
                # if no alertname, fallback to the alert fingerprint
                topic_name = NEW_TOPIC_TEMPLATE.format(
                    alertname=alert["fingerprint"].tame(check_string)
                )

            body += START_TIME_TEMPLATE.format(
                start_time=get_global_time(alert["startsAt"].tame(check_string))
            )

            end_time = alert["endsAt"].tame(check_string)
            if end_time != "0001-01-01T00:00:00Z":
                body += END_TIME_TEMPLATE.format(end_time=get_global_time(end_time))

            if alert["labels"]:
                label_information = ""
                for key, value in alert["labels"].items():
                    label_information += "- " + key + ": " + value.tame(check_string) + "\n"
                body += MESSAGE_LABELS_TEMPLATE.format(label_information=label_information)

            if alert.get("values"):
                value_information = ""
                for key, value in alert["values"].items():
                    value_information += "- " + key + ": " + str(value.tame(check_anything)) + "\n"
                body += MESSAGE_VALUES_TEMPLATE.format(value_information=value_information)
            elif alert.get("valueString"):
                body += (
                    MESSAGE_VALUES_TEMPLATE.format(
                        value_information=alert["valueString"].tame(check_string)
                    )
                    + "\n"
                )

            if alert.get("annotations"):
                annotation_information = ""
                for key, value in alert["annotations"].items():
                    annotation_information += "- " + key + ": " + value.tame(check_string) + "\n"
                body += MESSAGE_ANNOTATIONS_TEMPLATE.format(
                    annotation_information=annotation_information
                )

            if alert.get("generatorURL"):
                body += MESSAGE_GENERATOR_TEMPLATE.format(
                    generator_url=alert["generatorURL"].tame(check_string)
                )

            if alert.get("silenceURL"):
                body += MESSAGE_SILENCE_TEMPLATE.format(
                    silence_url=alert["silenceURL"].tame(check_string)
                )

            if alert.get("imageURL"):
                body += MESSAGE_IMAGE_TEMPLATE.format(
                    image_url=alert["imageURL"].tame(check_string)
                )

            body += "\n"

            check_send_webhook_message(request, user_profile, topic_name, body, status)

        return json_success(request)

    else:
        # Grafana 7.0 alerts:
        # https://grafana.com/docs/grafana/v7.0/alerting/notifications/#webhook
        topic_name = OLD_TOPIC_TEMPLATE.format(alert_title=payload["title"].tame(check_string))

        eval_matches_text = ""
        if "evalMatches" in payload and payload["evalMatches"] is not None:
            for match in payload["evalMatches"]:
                eval_matches_text += "**{}:** {}\n".format(
                    match["metric"].tame(check_string),
                    match["value"].tame(check_none_or(check_union([check_int, check_float]))),
                )

        message_text = ""
        if "message" in payload:
            message_text = payload["message"].tame(check_string) + "\n\n"

        state = payload["state"].tame(
            check_string_in(["no_data", "paused", "alerting", "ok", "pending", "unknown"])
        )
        if state == "alerting":
            alert_status = ALERT_STATUS_TEMPLATE.format(
                alert_icon=":alert:", alert_state=state.upper()
            )
        elif state == "ok":
            alert_status = ALERT_STATUS_TEMPLATE.format(
                alert_icon=":squared_ok:", alert_state=state.upper()
            )
        else:
            alert_status = ALERT_STATUS_TEMPLATE.format(
                alert_icon=":info:", alert_state=state.upper()
            )

        body = OLD_MESSAGE_TEMPLATE.format(
            alert_message=message_text,
            alert_status=alert_status,
            rule_name=payload["ruleName"].tame(check_string),
            rule_url=payload["ruleUrl"].tame(check_string),
            eval_matches=eval_matches_text,
        )

        if "imageUrl" in payload:
            body += "\n[Click to view visualization]({visualization})".format(
                visualization=payload["imageUrl"].tame(check_string)
            )

        body = body.strip()

        # send the message
        check_send_webhook_message(request, user_profile, topic_name, body, state)

        return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: alert_multiple_v8.json]---
Location: zulip-main/zerver/webhooks/grafana/fixtures/alert_multiple_v8.json

```json
{
    "receiver": "My Super Webhook",
    "status": "firing",
    "orgId": 1,
    "alerts": [
      {
        "status": "firing",
        "labels": {
          "alertname": "High memory usage",
          "team": "blue",
          "zone": "us-1"
        },
        "annotations": {
          "description": "The system has high memory usage",
          "runbook_url": "https://myrunbook.com/runbook/1234",
          "summary": "This alert was triggered for zone us-1"
        },
        "startsAt": "2021-10-12T09:51:03.157076+02:00",
        "endsAt": "0001-01-01T00:00:00Z",
        "generatorURL": "https://play.grafana.org/alerting/1afz29v7z/edit",
        "fingerprint": "c6eadffa33fcdf37",
        "silenceURL": "https://play.grafana.org/alerting/silence/new?alertmanager=grafana&matchers=alertname%3DT2%2Cteam%3Dblue%2Czone%3Dus-1",
        "dashboardURL": "",
        "panelURL": "",
        "valueString": "[ metric='' labels={} value=14151.331895396988 ]"
      },
      {
        "status": "firing",
        "labels": {
          "alertname": "High CPU usage",
          "team": "blue",
          "zone": "eu-1"
        },
        "annotations": {
          "description": "The system has high CPU usage",
          "runbook_url": "https://myrunbook.com/runbook/1234",
          "summary": "This alert was triggered for zone eu-1"
        },
        "startsAt": "2021-10-12T09:56:03.157076+02:00",
        "endsAt": "0001-01-01T00:00:00Z",
        "generatorURL": "https://play.grafana.org/alerting/d1rdpdv7k/edit",
        "fingerprint": "bc97ff14869b13e3",
        "silenceURL": "https://play.grafana.org/alerting/silence/new?alertmanager=grafana&matchers=alertname%3DT1%2Cteam%3Dblue%2Czone%3Deu-1",
        "dashboardURL": "",
        "panelURL": "",
        "valueString": "[ metric='' labels={} value=47043.702386305304 ]"
      }
    ],
    "groupLabels": {},
    "commonLabels": {
      "team": "blue"
    },
    "commonAnnotations": {},
    "externalURL": "https://play.grafana.org/",
    "version": "1",
    "groupKey": "{}:{}",
    "truncatedAlerts": 0,
    "title": "[FIRING:2]  (blue)",
    "state": "alerting",
    "message": "Webhook test message."
}
```

--------------------------------------------------------------------------------

---[FILE: alert_no_alertname_v11.json]---
Location: zulip-main/zerver/webhooks/grafana/fixtures/alert_no_alertname_v11.json

```json
{
	"receiver": "Debug webhook",
	"status": "firing",
	"alerts": [
		{
			"status": "firing",
			"labels": {
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

---[FILE: alert_ok_v7.json]---
Location: zulip-main/zerver/webhooks/grafana/fixtures/alert_ok_v7.json

```json
{
    "dashboardId": 1,
    "evalMatches": [
      {
        "value": 0,
        "metric": "High value",
        "tags": null
      }
    ],
    "imageUrl": "https://grafana.com/assets/img/blog/mixed_styles.png",
    "message": "Someone is testing the alert notification within grafana.",
    "orgId": 0,
    "panelId": 1,
    "ruleId": 0,
    "ruleName": "Test rule",
    "ruleUrl": "http://localhost:3000/",
    "state": "ok",
    "tags": {},
    "title": "[Ok] Test notification"
  }
```

--------------------------------------------------------------------------------

---[FILE: alert_paused_v7.json]---
Location: zulip-main/zerver/webhooks/grafana/fixtures/alert_paused_v7.json

```json
{
    "dashboardId": 1,
    "imageUrl": "https://grafana.com/assets/img/blog/mixed_styles.png",
    "message": "Someone is testing the alert notification within grafana.",
    "orgId": 0,
    "panelId": 1,
    "ruleId": 0,
    "ruleName": "Test rule",
    "ruleUrl": "http://localhost:3000/",
    "state": "paused",
    "tags": {},
    "title": "[Paused] Test notification"
  }
```

--------------------------------------------------------------------------------

---[FILE: alert_pending_v7.json]---
Location: zulip-main/zerver/webhooks/grafana/fixtures/alert_pending_v7.json

```json
{
    "dashboardId": 1,
    "evalMatches": [
      {
        "value": 100,
        "metric": "High value",
        "tags": null
      },
      {
        "value": 200,
        "metric": "Higher Value",
        "tags": null
      }
    ],
    "imageUrl": "https://grafana.com/assets/img/blog/mixed_styles.png",
    "message": "Someone is testing the alert notification within grafana.",
    "orgId": 0,
    "panelId": 1,
    "ruleId": 0,
    "ruleName": "Test rule",
    "ruleUrl": "http://localhost:3000/",
    "state": "pending",
    "tags": {},
    "title": "[Pending] Test notification"
  }
```

--------------------------------------------------------------------------------

---[FILE: alert_v7.json]---
Location: zulip-main/zerver/webhooks/grafana/fixtures/alert_v7.json

```json
{
    "dashboardId": 1,
    "evalMatches": [
      {
        "value": 100,
        "metric": "High value",
        "tags": null
      },
      {
        "value": 200,
        "metric": "Higher Value",
        "tags": null
      }
    ],
    "imageUrl": "https://grafana.com/assets/img/blog/mixed_styles.png",
    "message": "Someone is testing the alert notification within grafana.",
    "orgId": 0,
    "panelId": 1,
    "ruleId": 0,
    "ruleName": "Test rule",
    "ruleUrl": "http://localhost:3000/",
    "state": "alerting",
    "tags": {},
    "title": "[Alerting] Test notification"
  }
```

--------------------------------------------------------------------------------

---[FILE: alert_v8.json]---
Location: zulip-main/zerver/webhooks/grafana/fixtures/alert_v8.json

```json
{
    "receiver": "",
    "status": "resolved",
    "alerts": [
      {
        "status": "resolved",
        "labels": {
          "alertname": "TestAlert",
          "instance": "Grafana"
        },
        "annotations": {
          "summary": "Notification test"
        },
        "startsAt": "2022-08-31T05:54:04.52289368Z",
        "endsAt": "2022-08-31T10:30:00.52288431Z",
        "generatorURL": "",
        "fingerprint": "57c6d9296de2ad39",
        "silenceURL": "https://zuliptestingwh2.grafana.net/alerting/silence/new?alertmanager=grafana&matcher=alertname%3DTestAlert&matcher=instance%3DGrafana",
        "dashboardURL": "",
        "panelURL": "",
        "valueString": "[ metric='foo' labels={instance=bar} value=10 ]"
      }
    ],
    "groupLabels": {},
    "commonLabels": {
      "alertname": "TestAlert",
      "instance": "Grafana"
    },
    "commonAnnotations": {
      "summary": "Notification test"
    },
    "externalURL": "https://zuliptestingwh2.grafana.net/",
    "version": "1",
    "groupKey": "{alertname=\"TestAlert\", instance=\"Grafana\"}2022-08-31 05:54:04.52289368 +0000 UTC m=+42208.256292221",
    "truncatedAlerts": 1,
    "orgId": 1,
    "title": "[RESOLVED:1]  (TestAlert Grafana)",
    "state": "alerting",
    "message": "Webhook test message."
}
```

--------------------------------------------------------------------------------

````
