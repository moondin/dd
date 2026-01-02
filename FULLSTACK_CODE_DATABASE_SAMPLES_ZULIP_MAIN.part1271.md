---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1271
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1271 of 1290)

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
Location: zulip-main/zerver/webhooks/zabbix/doc.md

```text
# Zulip Zabbix integration

Receive Zabbix notifications in Zulip!

!!! warn ""

    **Note:** This guide is for Zabbix 5.4 and above; some older Zabbix
    versions have a different workflow for creating an outgoing webhook.

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to **Administration** in your Zabbix web interface. Click on
   **General**, and select **Macros** from the dropdown. Click **Add**.

1. Set the macro to `{$ZABBIX_URL}`. Set the value as the URL to your
   Zabbix server, e.g., `https://zabbix.example.com`, and ensure that there
   are no trailing slashes. Click **Update**.

1. Go back to **Administration** in your Zabbix web interface. Select
   **Media Types**, and click **Create Media Type**.

1. Set **Name** to a name of your choice, such as `Zulip`. Set **Type** to
   **Webhook**, and add the following **Parameters**:

    * `hostname`: `{HOST.NAME}`
    * `item`: `{ITEM.NAME1} is {ITEM.VALUE1}`
    * `link`: `{$ZABBIX_URL}/tr_events.php?triggerid={TRIGGER.ID}&eventid={EVENT.ID}`
    * `severity`: `{TRIGGER.SEVERITY}`
    * `status`: `{TRIGGER.STATUS}`
    * `trigger`: `{TRIGGER.NAME}`
    * `zulip_endpoint`: the URL generated above

1. Click the **Pencil** to edit the script, and replace any existing content
   with the script below. Then, check the **Enabled** option.

         try {
            Zabbix.Log(4, 'zulip webhook script value='+value);

            var result = {
               'tags': {
                     'endpoint': 'zulip'
               }
            },
            params = JSON.parse(value),
            req = new HttpRequest(),
            payload = {},
            resp;

            req.addHeader('Content-Type: application/json');

            payload.hostname = params.hostname;
            payload.severity = params.severity;
            payload.status = params.status;
            payload.item = params.item;
            payload.trigger = params.trigger;
            payload.link = params.link;
            resp = req.post(params.zulip_endpoint,
               JSON.stringify(payload))

            if (req.getStatus() != 200) {
               throw 'Response code: '+req.getStatus();
            }

            resp = JSON.parse(resp);
            result.tags.issue_id = resp.id;
            result.tags.issue_key = resp.key;
         } catch (error) {
            Zabbix.Log(4, 'zulip issue creation failed json : '+JSON.stringify(payload));
            Zabbix.Log(4, 'zulip issue creation failed : '+error);

            result = {};
         }

         return JSON.stringify(result);

1. Open **Message Templates** from the top bar. Click **Add** under **Message Type**,
   and select **Problem**.

1. Set **Subject** to `{TRIGGER.STATUS}-{TRIGGER.SEVERITY}-{TRIGGER.NAME}`.
   Set **Message** to the following, and click **Add**:

         {
            "hostname": "{HOST.NAME}",
            "severity": "{TRIGGER.SEVERITY}",
            "status": "{TRIGGER.STATUS}",
            "item": "{ITEM.NAME1} is {ITEM.VALUE1}",
            "trigger": "{TRIGGER.NAME}",
            "link": "{$ZABBIX_URL}/tr_events.php?triggerid={TRIGGER.ID}&eventid={EVENT.ID}"
         }

1. Go back to **Administration** in your Zabbix web interface. Click on
   **Users**, and select the alias of the user you would like to use to
   set the notification. Select **Media**, and click **Add**.

1. Set **Type** to the name you assigned to the media type above.
   Set **Send To** to `Zulip` or any text, as this field requires text, but
   it isn't used. Set the severity and active periods for notifications as
   suitable, and check the **Enabled** option. Click **Add**, and
   select **Update**.

1. Go back to your Zabbix web interface, and click **Configuration**.
   Select **Actions**, and choose **Create Action**.

1. Set **Name** to a name of your choice, such as `Zulip`. Under
   **New Conditions**, add the conditions for triggering a notification.
   Check the **Enabled** option, and click **Operations**.

1. Under **Operations**, click **Add**, and then set **Operation Type** to
   `Send Message`. Under **Send to Users**, choose **Add**, and select the user
   you added the alert to above, and click **Select**. Under **Send only to**,
   select **Zulip** or the name of your media type. Click **Add** twice.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/zabbix/001.png)

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/zabbix/tests.py

```python
from zerver.lib.send_email import FromAddress
from zerver.lib.test_classes import WebhookTestCase
from zerver.models import Recipient
from zerver.webhooks.zabbix.view import MISCONFIGURED_PAYLOAD_ERROR_MESSAGE


class ZabbixHookTests(WebhookTestCase):
    CHANNEL_NAME = "zabbix"
    URL_TEMPLATE = "/api/v1/external/zabbix?api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "zabbix"

    def test_zabbix_alert_message(self) -> None:
        """
        Tests if zabbix alert is handled correctly
        """
        expected_topic_name = "www.example.com"
        expected_message = "PROBLEM (Average) alert on [www.example.com](https://zabbix.example.com/tr_events.php?triggerid=14032&eventid=10528):\n* Zabbix agent on www.example.com is unreachable for 5 minutes\n* Agent ping is Up (1)"
        self.check_webhook("zabbix_alert", expected_topic_name, expected_message)

    def test_zabbix_invalid_payload_with_missing_data(self) -> None:
        """
        Tests if invalid Zabbix payloads are handled correctly
        """
        self.url = self.build_webhook_url()
        payload = self.get_body("zabbix_invalid_payload_with_missing_data")
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
Location: zulip-main/zerver/webhooks/zabbix/view.py
Signals: Django

```python
from django.core.exceptions import ValidationError
from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _

from zerver.actions.message_send import send_rate_limited_pm_notification_to_bot_owner
from zerver.decorator import webhook_view
from zerver.lib.exceptions import JsonableError
from zerver.lib.response import json_success
from zerver.lib.send_email import FromAddress
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

MISCONFIGURED_PAYLOAD_ERROR_MESSAGE = """
Hi there! Your bot {bot_name} just received a Zabbix payload that is missing
some data that Zulip requires. This usually indicates a configuration issue
in your Zabbix webhook settings. Please make sure that you set the
script correctly and provide all the required parameters
when configuring the Zabbix webhook. Contact {support_email} if you
need further help!
"""

ZABBIX_TOPIC_TEMPLATE = "{hostname}"
ZABBIX_MESSAGE_TEMPLATE = """
{status} ({severity}) alert on [{hostname}]({link}):
* {trigger}
* {item}
""".strip()


@webhook_view("Zabbix")
@typed_endpoint
def api_zabbix_webhook(
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

    check_send_webhook_message(request, user_profile, topic_name, body)
    return json_success(request)


def get_topic_for_http_request(payload: WildValue) -> str:
    return ZABBIX_TOPIC_TEMPLATE.format(hostname=payload["hostname"].tame(check_string))


def get_body_for_http_request(payload: WildValue) -> str:
    hostname = payload["hostname"].tame(check_string)
    severity = payload["severity"].tame(check_string)
    status = payload["status"].tame(check_string)
    item = payload["item"].tame(check_string)
    trigger = payload["trigger"].tame(check_string)
    link = payload["link"].tame(check_string)

    data = {
        "hostname": hostname,
        "severity": severity,
        "status": status,
        "item": item,
        "trigger": trigger,
        "link": link,
    }
    return ZABBIX_MESSAGE_TEMPLATE.format(**data)
```

--------------------------------------------------------------------------------

---[FILE: zabbix_alert.json]---
Location: zulip-main/zerver/webhooks/zabbix/fixtures/zabbix_alert.json

```json
{
    "hostname": "www.example.com",
    "severity": "Average",
    "status": "PROBLEM",
    "item": "Agent ping is Up (1)",
    "trigger": "Zabbix agent on www.example.com is unreachable for 5 minutes",
    "link": "https://zabbix.example.com/tr_events.php?triggerid=14032&eventid=10528"
}
```

--------------------------------------------------------------------------------

---[FILE: zabbix_invalid_payload_with_missing_data.json]---
Location: zulip-main/zerver/webhooks/zabbix/fixtures/zabbix_invalid_payload_with_missing_data.json

```json
{
    "severity": "Average",
    "status": "PROBLEM",
    "item": "Agent ping is Up (1)",
    "trigger": "Zabbix agent on www.example.com is unreachable for 5 minutes",
    "link": "https://zabbix.example.com/tr_events.php?triggerid=14032&eventid=10528"
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/zapier/doc.md

```text
# Zulip Zapier integration

Zapier supports integrations with
[hundreds of popular products](https://zapier.com/apps). Get notifications
sent by Zapier directly in Zulip.

{start_tabs}

1. {!create-channel.md!}

1. {!create-an-incoming-webhook.md!}

1. Create an account on [Zapier](https://zapier.com). Go to [Zulip
   Integrations][1], and select the app you want to connect to Zulip.

1. Under **Choose a Trigger**, select an event in the app you are
   connecting to Zulip. Under **Choose an Action**, select **Send a
   Private Message** or **Send a Stream Message**. Click **Connect**.

1. Follow the instructions in the right sidebar to set up the trigger
   event.

1. Select the Zulip action in the center panel, and under **Account** in
   the right sidebar, click **Sign in** to connect your bot to Zapier.

1. On the **Allow Zapier to access your Zulip Account** screen, enter
   the URL for your Zulip organization, and the email address and API
   key of the bot you created above.

1. Under **Action** in the right sidebar, configure **Recipients** for
   direct messages, or **Stream name** and **Topic** for channel
   messages. Configure **Message content**.

    !!! tip ""
        To receive notifications as direct messages, if your email
        in Zulip is [configured](/help/configure-email-visibility)
        to be visible to **Admins, moderators, members and guests**,
        enter the email associated with your Zulip account in the
        **Recipients** field. Otherwise, enter `user` +
        [your user ID](/help/view-someones-profile) +
        `@` + your Zulip domain, e.g., `user123@{{ display_host }}`.

1. Click **Publish** to enable your Zap.

{end_tabs}

[1]: https://zapier.com/apps/zulip/integrations
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/zapier/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class ZapierHookTests(WebhookTestCase):
    CHANNEL_NAME = "zapier"
    URL_TEMPLATE = "/api/v1/external/zapier?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "zapier"

    def test_zapier_when_subject_and_body_are_correct(self) -> None:
        expected_topic_name = "New email from zulip@zulip.com"
        expected_message = "Your email content is: \nMy Email content."
        self.check_webhook("correct_subject_and_body", expected_topic_name, expected_message)

    def test_zapier_when_topic_and_body_are_correct(self) -> None:
        expected_topic_name = "New email from zulip@zulip.com"
        expected_message = "Your email content is: \nMy Email content."
        self.check_webhook("correct_topic_and_body", expected_topic_name, expected_message)

    def test_zapier_weather_update(self) -> None:
        expected_topic_name = "Here is your weather update for the day:"
        expected_message = (
            "Foggy in the morning.\nMaximum temperature to be 24.\nMinimum temperature to be 12"
        )
        self.check_webhook("weather_update", expected_topic_name, expected_message)


class ZapierZulipAppTests(WebhookTestCase):
    CHANNEL_NAME = "zapier"
    URL_TEMPLATE = "/api/v1/external/zapier?api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "zapier"

    def test_auth(self) -> None:
        payload = self.get_body("zapier_zulip_app_auth")
        result = self.client_post(self.url, payload, content_type="application/json")
        json_result = self.assert_json_success(result)
        self.assertEqual(json_result["full_name"], "Zulip Webhook Bot")
        self.assertEqual(json_result["email"], "webhook-bot@zulip.com")
        self.assertIn("id", json_result)
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/zapier/view.py
Signals: Django

```python
from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _

from zerver.decorator import webhook_view
from zerver.lib.exceptions import JsonableError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_none_or, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile


@webhook_view("Zapier", notify_bot_owner_on_invalid_json=False)
@typed_endpoint
def api_zapier_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    if payload.get("type").tame(check_none_or(check_string)) == "auth":
        # The bot's details are used by our Zapier app to format a connection
        # label for users to be able to distinguish between different Zulip
        # bots and API keys in their UI
        return json_success(
            request,
            data={
                "full_name": user_profile.full_name,
                "email": user_profile.email,
                "id": user_profile.id,
            },
        )

    topic_name = payload.get("topic").tame(check_none_or(check_string))
    content = payload.get("content").tame(check_none_or(check_string))

    if topic_name is None:
        topic_name = payload.get("subject").tame(
            check_none_or(check_string)
        )  # Backwards-compatibility
        if topic_name is None:
            raise JsonableError(_("Topic can't be empty"))

    if content is None:
        raise JsonableError(_("Content can't be empty"))

    check_send_webhook_message(request, user_profile, topic_name, content)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: correct_subject_and_body.json]---
Location: zulip-main/zerver/webhooks/zapier/fixtures/correct_subject_and_body.json

```json
{
  "content": "Your email content is: \nMy Email content.\n",
  "subject": "New email from zulip@zulip.com"
}
```

--------------------------------------------------------------------------------

---[FILE: correct_topic_and_body.json]---
Location: zulip-main/zerver/webhooks/zapier/fixtures/correct_topic_and_body.json

```json
{
  "content": "Your email content is: \nMy Email content.\n",
  "topic": "New email from zulip@zulip.com"
}
```

--------------------------------------------------------------------------------

---[FILE: weather_update.json]---
Location: zulip-main/zerver/webhooks/zapier/fixtures/weather_update.json

```json
{
  "content": "Foggy in the morning.\nMaximum temperature to be 24.\nMinimum temperature to be 12",
  "subject": "Here is your weather update for the day:"
}
```

--------------------------------------------------------------------------------

---[FILE: zapier_zulip_app_auth.json]---
Location: zulip-main/zerver/webhooks/zapier/fixtures/zapier_zulip_app_auth.json

```json
{
    "type": "auth"
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/zendesk/doc.md

```text
# Zulip Zendesk integration

Get notifications about Zendesk tickets in Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Append `{%raw%}&ticket_title={{ ticket.title }}&ticket_id={{ ticket.id }}{%endraw%}`
   to the URL generated above.

1. In Zendesk, click the **gear** (<i class="fa fa-cog"></i>) icon in the
    bottom-left corner. Click on **Extensions**, and then click **add
    target**.

1. Click the **URL target**, and fill in the form with the following:

    * **Title**: Zulip
    * **URL**: the URL generated and updated above
    * **Method**: POST
    * **Attribute Name**: message
    * **Username**: your bot's user name, e.g., `zendesk-bot@yourdomain.com`
    * **Password**: your bot's API key

1. Select **Test Target**, and click **Submit**. A test message should
   appear Zulip. Save the target by selecting **Create target**, and
   clicking **Submit**.

1. Add a new trigger, for every action you'd like to be notified about.
   To add a trigger, select **Triggers** in the left menu, and click
   **add trigger**.

1. Give the trigger a descriptive title (e.g., "Announce ticket update").
   Under **Meet all of the following conditions**, select the conditions
   for the trigger. In the **Perform these actions** section, select
   **Notification: Notify target**, and select the target created above
   (e.g., "Zulip").

1. Enter the message body into the **Message** field. You can use both
   Zulip Markdown and Zendesk placeholders. Here's an example message
   body template that you can optionally use:

        {% raw %}Ticket [#{{ ticket.id }}: {{ ticket.title }}]({{ ticket.link }}), was updated by {{ current_user.name }}
        * Status: {{ ticket.status }}
        * Priority: {{ ticket.priority }}
        * Type: {{ ticket.ticket_type }}
        * Assignee: {{ ticket.assignee.name }}
        * Tags: {{ ticket.tags }}
        * Description:
        ``` quote
        {{ ticket.description }}
        ```{% endraw %}

1.  Click **Submit**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/zendesk/001.png)

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/zendesk/tests.py

```python
from typing_extensions import override

from zerver.lib.test_classes import WebhookTestCase


class ZenDeskHookTests(WebhookTestCase):
    CHANNEL_NAME = "zendesk"
    URL_TEMPLATE = "/api/v1/external/zendesk?stream={stream}"

    @override
    def get_payload(self, fixture_name: str) -> dict[str, str]:
        return {
            "ticket_title": self.TICKET_TITLE,
            "ticket_id": str(self.TICKET_ID),
            "message": self.MESSAGE,
            "stream": self.CHANNEL_NAME,
        }

    def do_test(self, expected_topic: str, expected_message: str) -> None:
        self.api_channel_message(
            self.test_user,
            "",
            expected_topic,
            expected_message,
            content_type=None,
        )

    def test_short_topic(self) -> None:
        self.TICKET_ID = 4
        self.TICKET_TITLE = "Test ticket"
        self.MESSAGE = "some message"
        self.do_test(
            expected_topic="#4: Test ticket",
            expected_message="some message",
        )

    def test_long_subject(self) -> None:
        self.TICKET_ID = 4
        self.TICKET_TITLE = "Test ticket" + "!" * 80
        self.MESSAGE = "some message"
        self.do_test(
            expected_topic="#4: Test ticket" + "!" * 42 + "...",
            expected_message="some message",
        )

    def test_long_content(self) -> None:
        self.TICKET_ID = 5
        self.TICKET_TITLE = "Some ticket"
        self.MESSAGE = "New comment:\n> It is better\n* here"
        self.do_test(
            expected_topic="#5: Some ticket",
            expected_message="New comment:\n> It is better\n* here",
        )
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/zendesk/view.py
Signals: Django

```python
# Webhooks for external integrations.
from django.http import HttpRequest, HttpResponse

from zerver.decorator import authenticated_rest_api_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import typed_endpoint
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile


def truncate(string: str, length: int) -> str:
    if len(string) > length:
        string = string[: length - 3] + "..."
    return string


@authenticated_rest_api_view(webhook_client_name="Zendesk")
@typed_endpoint
def api_zendesk_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    ticket_title: str,
    ticket_id: str,
    message: str,
) -> HttpResponse:
    """
    Zendesk uses triggers with message templates. This webhook uses the
    ticket_id and ticket_title to create a topic. And passes with zendesk
    user's configured message to zulip.
    """
    topic_name = truncate(f"#{ticket_id}: {ticket_title}", 60)
    check_send_webhook_message(request, user_profile, topic_name, message)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: base.py]---
Location: zulip-main/zerver/worker/base.py
Signals: Django

```python
# Documented in https://zulip.readthedocs.io/en/latest/subsystems/queuing.html
import logging
import os
import signal
import time
from abc import ABC, abstractmethod
from collections import deque
from collections.abc import Callable, MutableSequence
from types import FrameType
from typing import Any, TypeVar

import orjson
import sentry_sdk
from django.conf import settings
from django.db import connection
from typing_extensions import override

from zerver.lib.context_managers import lockfile
from zerver.lib.db_connections import reset_queries
from zerver.lib.partial import partial
from zerver.lib.per_request_cache import flush_per_request_caches
from zerver.lib.pysa import mark_sanitized
from zerver.lib.queue import SimpleQueueClient

logger = logging.getLogger(__name__)


class WorkerTimeoutError(Exception):
    def __init__(self, queue_name: str, limit: int, event_count: int) -> None:
        self.queue_name = queue_name
        self.limit = limit
        self.event_count = event_count

    @override
    def __str__(self) -> str:
        return f"Timed out in {self.queue_name} after {self.limit * self.event_count} seconds processing {self.event_count} events"


class InterruptConsumeError(Exception):
    """
    This exception is to be thrown inside event consume function
    if the intention is to simply interrupt the processing
    of the current event and normally continue the work of the queue.
    """


class WorkerDeclarationError(Exception):
    pass


ConcreteQueueWorker = TypeVar("ConcreteQueueWorker", bound="QueueProcessingWorker")


def assign_queue(
    queue_name: str,
    enabled: bool = True,
    is_test_queue: bool = False,
) -> Callable[[type[ConcreteQueueWorker]], type[ConcreteQueueWorker]]:
    def decorate(clazz: type[ConcreteQueueWorker]) -> type[ConcreteQueueWorker]:
        clazz.queue_name = queue_name
        if enabled:
            register_worker(queue_name, clazz, is_test_queue)
        return clazz

    return decorate


worker_classes: dict[str, type["QueueProcessingWorker"]] = {}
test_queues: set[str] = set()


def register_worker(
    queue_name: str, clazz: type["QueueProcessingWorker"], is_test_queue: bool = False
) -> None:
    worker_classes[queue_name] = clazz
    if is_test_queue:
        test_queues.add(queue_name)


def check_and_send_restart_signal() -> None:
    try:
        if not connection.is_usable():
            logging.warning("*** Sending self SIGUSR1 to trigger a restart.")
            os.kill(os.getpid(), signal.SIGUSR1)
    except Exception:
        pass


class QueueProcessingWorker(ABC):
    queue_name: str
    MAX_CONSUME_SECONDS: int | None = 30
    CONSUME_ITERATIONS_BEFORE_UPDATE_STATS_NUM = 50
    MAX_SECONDS_BEFORE_UPDATE_STATS = 30

    # How many un-acknowledged events the worker should have on hand,
    # fetched from the rabbitmq server.  Larger values may be more
    # performant, but if queues are large, cause more network IO at
    # startup and steady-state memory.
    PREFETCH = 100

    def __init__(
        self,
        threaded: bool = False,
        disable_timeout: bool = False,
        worker_num: int | None = None,
    ) -> None:
        self.q: SimpleQueueClient | None = None
        self.threaded = threaded
        self.disable_timeout = disable_timeout
        self.worker_num = worker_num
        if not hasattr(self, "queue_name"):
            raise WorkerDeclarationError("Queue worker declared without queue_name")

        self.initialize_statistics()

    def initialize_statistics(self) -> None:
        self.queue_last_emptied_timestamp = time.time()
        self.consumed_since_last_emptied = 0
        self.recent_consume_times: MutableSequence[tuple[int, float]] = deque(maxlen=50)
        self.consume_iteration_counter = 0
        self.idle = True
        self.last_statistics_update_time = 0.0

        self.update_statistics()

    @sentry_sdk.trace
    def update_statistics(self) -> None:
        total_seconds = sum(seconds for _, seconds in self.recent_consume_times)
        total_events = sum(events_number for events_number, _ in self.recent_consume_times)
        if total_events == 0:
            recent_average_consume_time = None
        else:
            recent_average_consume_time = total_seconds / total_events
        stats_dict = dict(
            update_time=time.time(),
            recent_average_consume_time=recent_average_consume_time,
            queue_last_emptied_timestamp=self.queue_last_emptied_timestamp,
            consumed_since_last_emptied=self.consumed_since_last_emptied,
        )

        os.makedirs(settings.QUEUE_STATS_DIR, exist_ok=True)

        fname = f"{self.queue_name}.stats"
        fn = os.path.join(settings.QUEUE_STATS_DIR, fname)
        with lockfile(fn + ".lock"):
            tmp_fn = fn + ".tmp"
            with open(tmp_fn, "wb") as f:
                f.write(
                    orjson.dumps(stats_dict, option=orjson.OPT_APPEND_NEWLINE | orjson.OPT_INDENT_2)
                )
            os.rename(tmp_fn, fn)
        self.last_statistics_update_time = time.time()

    def get_remaining_local_queue_size(self) -> int:
        if self.q is not None:
            return self.q.local_queue_size()
        else:
            # This is a special case that will happen if we're operating without
            # using RabbitMQ (e.g. in tests). In that case there's no queuing to speak of
            # and the only reasonable size to return is 0.
            return 0

    @abstractmethod
    def consume(self, data: dict[str, Any]) -> None:
        pass

    def do_consume(
        self, consume_func: Callable[[list[dict[str, Any]]], None], events: list[dict[str, Any]]
    ) -> None:
        consume_time_seconds: float | None = None
        with sentry_sdk.start_transaction(
            op="task",
            name=f"consume {self.queue_name}",
            custom_sampling_context={"queue": self.queue_name},
        ):
            if sentry_sdk.is_initialized():
                sentry_sdk.add_breadcrumb(
                    type="debug",
                    category="queue_processor",
                    message=f"Consuming {self.queue_name}",
                    data={
                        "events": events,
                        "local_queue_size": self.get_remaining_local_queue_size(),
                    },
                )
            try:
                if self.idle:
                    # We're reactivating after having gone idle due to emptying the queue.
                    # We should update the stats file to keep it fresh and to make it clear
                    # that the queue started processing, in case the event we're about to process
                    # makes us freeze.
                    self.idle = False
                    self.update_statistics()

                time_start = time.time()
                if self.MAX_CONSUME_SECONDS and not self.threaded and not self.disable_timeout:
                    try:
                        signal.signal(
                            signal.SIGALRM,
                            partial(self.timer_expired, self.MAX_CONSUME_SECONDS, events),
                        )
                        try:
                            signal.alarm(self.MAX_CONSUME_SECONDS * len(events))
                            consume_func(events)
                        finally:
                            signal.alarm(0)
                    finally:
                        signal.signal(signal.SIGALRM, signal.SIG_DFL)
                else:
                    consume_func(events)
                consume_time_seconds = time.time() - time_start
                self.consumed_since_last_emptied += len(events)
            except Exception as e:
                self._handle_consume_exception(events, e)
            finally:
                flush_per_request_caches()
                reset_queries()

                with sentry_sdk.start_span(name="statistics"):
                    if consume_time_seconds is not None:
                        self.recent_consume_times.append((len(events), consume_time_seconds))

                    remaining_local_queue_size = self.get_remaining_local_queue_size()
                    if remaining_local_queue_size == 0:
                        self.queue_last_emptied_timestamp = time.time()
                        self.consumed_since_last_emptied = 0
                        # We've cleared all the events from the queue, so we don't
                        # need to worry about the small overhead of doing a disk write.
                        # We take advantage of this to update the stats file to keep it fresh,
                        # especially since the queue might go idle until new events come in.
                        self.update_statistics()
                        self.idle = True
                    else:
                        self.consume_iteration_counter += 1
                        if (
                            self.consume_iteration_counter
                            >= self.CONSUME_ITERATIONS_BEFORE_UPDATE_STATS_NUM
                            or time.time() - self.last_statistics_update_time
                            >= self.MAX_SECONDS_BEFORE_UPDATE_STATS
                        ):
                            self.consume_iteration_counter = 0
                            self.update_statistics()

    def consume_single_event(self, event: dict[str, Any]) -> None:
        consume_func = lambda events: self.consume(events[0])
        self.do_consume(consume_func, [event])

    def timer_expired(
        self, limit: int, events: list[dict[str, Any]], signal: int, frame: FrameType | None
    ) -> None:
        raise WorkerTimeoutError(self.queue_name, limit, len(events))

    def _handle_consume_exception(self, events: list[dict[str, Any]], exception: Exception) -> None:
        if isinstance(exception, InterruptConsumeError):
            # The exception signals that no further error handling
            # is needed and the worker can proceed.
            return

        with sentry_sdk.new_scope() as scope:
            scope.set_context(
                "events",
                {
                    "data": events,
                    "queue_name": self.queue_name,
                },
            )
            if isinstance(exception, WorkerTimeoutError):
                scope.fingerprint = ["worker-timeout", self.queue_name]
                logging.exception(exception, stack_info=True)
            else:
                logging.exception(
                    "Problem handling data on queue %s", self.queue_name, stack_info=True
                )
        if not os.path.exists(settings.QUEUE_ERROR_DIR):
            os.mkdir(settings.QUEUE_ERROR_DIR)  # nocoverage
        # Use 'mark_sanitized' to prevent Pysa from detecting this false positive
        # flow. 'queue_name' is always a constant string.
        fname = mark_sanitized(f"{self.queue_name}.errors")
        fn = os.path.join(settings.QUEUE_ERROR_DIR, fname)
        line = f"{time.asctime()}\t{orjson.dumps(events).decode()}\n"
        lock_fn = fn + ".lock"
        with lockfile(lock_fn), open(fn, "a") as f:
            f.write(line)
        check_and_send_restart_signal()

    def setup(self) -> None:
        self.q = SimpleQueueClient(prefetch=self.PREFETCH)

    def start(self) -> None:
        assert self.q is not None
        self.initialize_statistics()
        self.q.start_json_consumer(
            self.queue_name,
            lambda events: self.consume_single_event(events[0]),
        )

    def stop(self) -> None:  # nocoverage
        assert self.q is not None
        self.q.stop_consuming()


class LoopQueueProcessingWorker(QueueProcessingWorker):
    sleep_delay = 1
    batch_size = 100

    @override
    def setup(self) -> None:
        self.q = SimpleQueueClient(prefetch=max(self.PREFETCH, self.batch_size))

    @override
    def start(self) -> None:  # nocoverage
        assert self.q is not None
        self.initialize_statistics()
        self.q.start_json_consumer(
            self.queue_name,
            lambda events: self.do_consume(self.consume_batch, events),
            batch_size=self.batch_size,
            timeout=self.sleep_delay,
        )

    @abstractmethod
    def consume_batch(self, events: list[dict[str, Any]]) -> None:
        pass

    @override
    def consume(self, event: dict[str, Any]) -> None:
        """In LoopQueueProcessingWorker, consume is used just for automated tests"""
        self.consume_batch([event])
```

--------------------------------------------------------------------------------

---[FILE: deferred_email_senders.py]---
Location: zulip-main/zerver/worker/deferred_email_senders.py

```python
# Documented in https://zulip.readthedocs.io/en/latest/subsystems/queuing.html
from zerver.worker.base import assign_queue
from zerver.worker.email_senders_base import EmailSendingWorker


@assign_queue("deferred_email_senders")
class DeferredEmailSenderWorker(EmailSendingWorker):
    pass
```

--------------------------------------------------------------------------------

````
