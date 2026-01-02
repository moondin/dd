---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1212
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1212 of 1290)

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

---[FILE: signatures_with_own_subject.json]---
Location: zulip-main/zerver/webhooks/hellosign/fixtures/signatures_with_own_subject.json

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

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/helloworld/doc.md

```text
# Zulip Hello World integration

Learn how Zulip integrations work with this simple Hello World example!

This webhook is Zulip's official [example
integration](/api/incoming-webhooks-walkthrough).

{start_tabs}

1. The Hello World webhook will use the `test` channel, which is created
    by default in the Zulip development environment. If you are running
    Zulip in production, you should make sure that this channel exists.

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. To trigger a notification using this example webhook, you can use
    `send_webhook_fixture_message` from a [Zulip development
    environment](https://zulip.readthedocs.io/en/latest/development/overview.html):

    ```
        (zulip-server) vagrant@vagrant:/srv/zulip$
        ./manage.py send_webhook_fixture_message \
        > --fixture=zerver/tests/fixtures/helloworld/hello.json \
        > '--url=http://localhost:9991/api{{ integration_url }}?api_key=abcdefgh&stream=channel%20name;'
    ```

    Or, use curl:

    ```
    curl -X POST -H "Content-Type: application/json" -d '{ "featured_title":"Marilyn Monroe", "featured_url":"https://en.wikipedia.org/wiki/Marilyn_Monroe" }' http://localhost:9991/api{{ integration_url }}?api_key=abcdefgh&stream=channel%20name;
    ```

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/helloworld/001.png)

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/helloworld/tests.py
Signals: Django

```python
from django.conf import settings

from zerver.lib.test_classes import WebhookTestCase
from zerver.models.realms import get_realm
from zerver.models.users import get_system_bot


class HelloWorldHookTests(WebhookTestCase):
    CHANNEL_NAME = "test"
    URL_TEMPLATE = "/api/v1/external/helloworld?&api_key={api_key}&stream={stream}"
    DIRECT_MESSAGE_URL_TEMPLATE = "/api/v1/external/helloworld?&api_key={api_key}"
    WEBHOOK_DIR_NAME = "helloworld"

    # Note: Include a test function per each distinct message condition your integration supports
    def test_hello_message(self) -> None:
        expected_topic_name = "Hello World"
        expected_message = "Hello! I am happy to be here! :smile:\nThe Wikipedia featured article for today is **[Marilyn Monroe](https://en.wikipedia.org/wiki/Marilyn_Monroe)**"

        # use fixture named helloworld_hello
        self.check_webhook(
            "hello",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_goodbye_message(self) -> None:
        expected_topic_name = "Hello World"
        expected_message = "Hello! I am happy to be here! :smile:\nThe Wikipedia featured article for today is **[Goodbye](https://en.wikipedia.org/wiki/Goodbye)**"

        # use fixture named helloworld_goodbye
        self.check_webhook(
            "goodbye",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_pm_to_bot_owner(self) -> None:
        # Note that this is really just a test for check_send_webhook_message
        self.URL_TEMPLATE = self.DIRECT_MESSAGE_URL_TEMPLATE
        self.url = self.build_webhook_url()
        expected_message = "Hello! I am happy to be here! :smile:\nThe Wikipedia featured article for today is **[Goodbye](https://en.wikipedia.org/wiki/Goodbye)**"

        self.send_and_test_private_message(
            "goodbye",
            expected_message=expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_stream_error_pm_to_bot_owner(self) -> None:
        # Note that this is really just a test for check_send_webhook_message
        self.CHANNEL_NAME = "nonexistent"
        self.url = self.build_webhook_url()
        realm = get_realm("zulip")
        notification_bot = get_system_bot(settings.NOTIFICATION_BOT, realm.id)
        expected_message = "Your bot `webhook-bot@zulip.com` tried to send a message to channel #**nonexistent**, but that channel does not exist. Click [here](#channels/new) to create it."
        self.send_and_test_private_message(
            "goodbye",
            expected_message=expected_message,
            content_type="application/x-www-form-urlencoded",
            sender=notification_bot,
        )

    def test_custom_topic(self) -> None:
        # Note that this is really just a test for check_send_webhook_message
        expected_topic_name = "Custom Topic"
        self.url = self.build_webhook_url(topic=expected_topic_name)
        expected_message = "Hello! I am happy to be here! :smile:\nThe Wikipedia featured article for today is **[Goodbye](https://en.wikipedia.org/wiki/Goodbye)**"

        self.check_webhook(
            "goodbye",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/helloworld/view.py
Signals: Django

```python
# Webhooks for external integrations.

from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile


@webhook_view("HelloWorld")
@typed_endpoint
def api_helloworld_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    # construct the body of the message
    body = "Hello! I am happy to be here! :smile:"

    # try to add the Wikipedia article of the day
    body_template = (
        "\nThe Wikipedia featured article for today is **[{featured_title}]({featured_url})**"
    )
    body += body_template.format(
        featured_title=payload["featured_title"].tame(check_string),
        featured_url=payload["featured_url"].tame(check_string),
    )

    topic_name = "Hello World"

    # send the message
    check_send_webhook_message(request, user_profile, topic_name, body)

    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: goodbye.json]---
Location: zulip-main/zerver/webhooks/helloworld/fixtures/goodbye.json

```json
{
  "featured_title":"Goodbye",
  "featured_url":"https://en.wikipedia.org/wiki/Goodbye"
}
```

--------------------------------------------------------------------------------

---[FILE: hello.json]---
Location: zulip-main/zerver/webhooks/helloworld/fixtures/hello.json

```json
{
  "featured_title":"Marilyn Monroe",
  "featured_url":"https://en.wikipedia.org/wiki/Marilyn_Monroe"
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/heroku/doc.md

```text
# Zulip Heroku integration

Receive notifications in Zulip whenever a new version of an app
is pushed to Heroku using the Zulip Heroku plugin!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. In your project on Heroku, go to the **Resources** tab.

1. Add the **Deploy Hooks** add-on. Select the **HTTP Post Hook** plan,
   and click **Provision**. Click on the **Deploy Hooks** add-on you
   just added.

1. Set **URL** to the URL generated above. Click **Save and Send Test**
   to send a test message to your Zulip organization.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/heroku/001.png)

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/heroku/tests.py

```python
from typing_extensions import override

from zerver.lib.test_classes import WebhookTestCase


class HerokuHookTests(WebhookTestCase):
    CHANNEL_NAME = "heroku"
    URL_TEMPLATE = "/api/v1/external/heroku?stream={stream}&api_key={api_key}"

    def test_deployment(self) -> None:
        expected_topic_name = "sample-project"
        expected_message = """
user@example.com deployed version 3eb5f44 of [sample-project](http://sample-project.herokuapp.com):

``` quote
  * Example User: Test commit for Deploy Hook 2
```
""".strip()
        self.check_webhook(
            "deploy",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_deployment_multiple_commits(self) -> None:
        expected_topic_name = "sample-project"
        expected_message = """user@example.com deployed version 3eb5f44 of \
[sample-project](http://sample-project.herokuapp.com)
``` quote
  * Example User: Test commit for Deploy Hook
  * Example User: Second test commit for Deploy Hook 2
```"""

        expected_message = """
user@example.com deployed version 3eb5f44 of [sample-project](http://sample-project.herokuapp.com):

``` quote
  * Example User: Test commit for Deploy Hook
  * Example User: Second test commit for Deploy Hook 2
```
""".strip()
        self.check_webhook(
            "deploy_multiple_commits",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    @override
    def get_body(self, fixture_name: str) -> str:
        return self.webhook_fixture_data("heroku", fixture_name, file_type="txt")
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/heroku/view.py
Signals: Django

```python
# Webhooks for external integrations.
from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import typed_endpoint
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

TEMPLATE = """
{user} deployed version {head} of [{app}]({url}):

``` quote
{git_log}
```
""".strip()


@webhook_view("Heroku", notify_bot_owner_on_invalid_json=False)
@typed_endpoint
def api_heroku_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    head: str,
    app: str,
    user: str,
    url: str,
    git_log: str,
) -> HttpResponse:
    content = TEMPLATE.format(user=user, head=head, app=app, url=url, git_log=git_log)

    check_send_webhook_message(request, user_profile, app, content)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: deploy.txt]---
Location: zulip-main/zerver/webhooks/heroku/fixtures/deploy.txt

```text
app=sample-project&app_uuid=f46ffea9-d6be-4293-ae6e-4449fa5ae29a&user=user%40example.com&url=http%3A%2F%2Fsample-project.herokuapp.com&head=3eb5f44&head_long=3eb5f447a2f6bcf254e63fbf2426b8e6738608eb&prev_head=32d184c097b04182483999046e91c32328c07562&git_log=%20%20*%20Example%20User%3A%20Test%20commit%20for%20Deploy%20Hook%202&release=v9
```

--------------------------------------------------------------------------------

---[FILE: deploy_multiple_commits.txt]---
Location: zulip-main/zerver/webhooks/heroku/fixtures/deploy_multiple_commits.txt

```text
app=sample-project&app_uuid=f46ffea9-d6be-4293-ae6e-4449fa5ae29a&user=user%40example.com&url=http%3A%2F%2Fsample-project.herokuapp.com&head=3eb5f44&head_long=3eb5f447a2f6bcf254e63fbf2426b8e6738608eb&prev_head=32d184c097b04182483999046e91c32328c07562&git_log=%20%20*%20Example%20User%3A%20Test%20commit%20for%20Deploy%20Hook%0A%20%20*%20Example%20User%3A%20Second%20test%20commit%20for%20Deploy%20Hook%202&release=v9
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/homeassistant/doc.md

```text
1. {!create-channel.md!}

1. {!create-an-incoming-webhook.md!}

1. In Home Assistant, you need to add the `notify` service to your
    `configuration.yaml` file.  This should look something like this:

    ```
    notify:
      - platform: rest
        resource: http: {{ external_api_uri }}v1/external/homeassistant?api_key=<API key>
        method: POST_JSON
        title_param_name: topic
    ```

1. The `api_key` parameter should correspond to your bot's key. The `stream`
    parameter is not necessarily required; if not given, it will default to
    the `homeassistant` channel.

1. And the URL under `resource` should start with:

    `{{ api_url }}/v1/external/homeassistant`

1. Finally, you need to configure a trigger for the service by adding
    an automation entry in the HomeAssistant `configuration.yaml` file.

    ```
    automation:
      trigger:
        platform: sun
        event: sunrise
      action:
        - service: notify.notify
          data:
            message: "It will be 30 degrees Celsius out there today!"
            title: "Weather forecast"
    ```

    The `data` object takes at least a `message` property and an optional
    `title` parameter which will be the conversation topic and which defaults
    to `homeassistant` if not given.

{!congrats.md!}

![](/static/images/integrations/homeassistant/001.png)
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/homeassistant/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class HomeAssistantHookTests(WebhookTestCase):
    CHANNEL_NAME = "homeassistant"
    URL_TEMPLATE = "/api/v1/external/homeassistant?&api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "homeassistant"

    def test_simplereq(self) -> None:
        expected_topic_name = "homeassistant"
        expected_message = "The sun will be shining today!"

        self.check_webhook(
            "simplereq",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_req_with_title(self) -> None:
        expected_topic_name = "Weather forecast"
        expected_message = "It will be 30 degrees Celsius out there today!"

        self.check_webhook(
            "reqwithtitle",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/homeassistant/view.py
Signals: Django

```python
from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile


@webhook_view("HomeAssistant")
@typed_endpoint
def api_homeassistant_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    # construct the body of the message
    body = payload["message"].tame(check_string)

    # set the topic to the topic parameter, if given
    if "topic" in payload:
        topic_name = payload["topic"].tame(check_string)
    else:
        topic_name = "homeassistant"

    # send the message
    check_send_webhook_message(request, user_profile, topic_name, body)

    # return json result
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: reqwithtitle.json]---
Location: zulip-main/zerver/webhooks/homeassistant/fixtures/reqwithtitle.json

```json
{
    "topic": "Weather forecast",
    "message": "It will be 30 degrees Celsius out there today!"
}
```

--------------------------------------------------------------------------------

---[FILE: simplereq.json]---
Location: zulip-main/zerver/webhooks/homeassistant/fixtures/simplereq.json

```json
{
  "message": "The sun will be shining today!"
}
```

--------------------------------------------------------------------------------

---[FILE: checkin.json]---
Location: zulip-main/zerver/webhooks/honeybadger/fixtures/checkin.json

```json
{
   "event":"check_in_missing",
   "message":"[Zulip Integration] MISSING: Zulip hasn't checked in for 6 minutes",
   "project":{
      "id":54639,
      "name":"Zulip Integration",
      "token":"d144e04c",
      "created_at":"2017-12-29T14:18:50.512753Z",
      "disable_public_links":false,
      "pivotal_project_id":null,
      "asana_workspace_id":null,
      "github_project":null,
      "environments":[

      ],
      "owner":{
         "id":57245,
         "email":"madelf1337@gmail.com",
         "name":"Pranav Kulkarni"
      },
      "last_notice_at":null,
      "earliest_notice_at":"2017-11-29T14:59:09.234554Z",
      "unresolved_fault_count":0,
      "fault_count":0,
      "active":true,
      "users":[
         {
            "id":57245,
            "email":"madelf1337@gmail.com",
            "name":"Pranav Kulkarni"
         }
      ],
      "sites":[
         {
            "id":"59ad71ac-6d2e-4fd0-a04f-b5c916c8f57e",
            "active":true,
            "last_checked_at":"2017-12-29T14:59:09.191265Z",
            "name":"Zulip",
            "state":"up",
            "url":"https://zulipint.slack.com"
         }
      ],
      "team_id":34534
   },
   "check_in":{
      "state":"missing",
      "schedule_type":"simple",
      "reported_at":"2017-12-29T14:53:02.498067Z",
      "expected_at":"2017-12-29T15:04:08.980590Z",
      "missed_count":1,
      "grace_period":60,
      "id":"15mIYe",
      "name":"Zulip",
      "url":"https://api.honeybadger.io/v1/check_in/15mIYe",
      "report_period":300
   }
}
```

--------------------------------------------------------------------------------

---[FILE: test_error.json]---
Location: zulip-main/zerver/webhooks/honeybadger/fixtures/test_error.json

```json
{
   "event":"occurred",
   "message":"[Zulip Integration/production] TestingException: This is a test error generated by Honeybadger",
   "project":{
      "id":54639,
      "name":"Zulip Integration",
      "token":"d144e04c",
      "created_at":"2017-12-29T14:18:50.512753Z",
      "disable_public_links":false,
      "pivotal_project_id":null,
      "asana_workspace_id":null,
      "github_project":null,
      "environments":[

      ],
      "owner":{
         "id":57245,
         "email":"madelf1337@gmail.com",
         "name":"Pranav Kulkarni"
      },
      "last_notice_at":null,
      "earliest_notice_at":"2017-11-29T14:24:48.144908Z",
      "unresolved_fault_count":0,
      "fault_count":0,
      "active":true,
      "users":[
         {
            "id":57245,
            "email":"madelf1337@gmail.com",
            "name":"Pranav Kulkarni"
         }
      ],
      "sites":[

      ],
      "team_id":34534
   },
   "fault":{
      "project_id":54639,
      "klass":"TestingException",
      "component":null,
      "action":null,
      "environment":null,
      "resolved":false,
      "ignored":false,
      "created_at":null,
      "comments_count":0,
      "message":"This is a test error generated by Honeybadger",
      "notices_count":1,
      "last_notice_at":null,
      "tags":[

      ],
      "id":123,
      "assignee":null,
      "url":"https://app.honeybadger.io/projects/54639/faults/123",
      "deploy":null
   },
   "notice":{
      "id":null,
      "environment":{
         "environment_name":"production"
      },
      "created_at":"2017-12-29T14:24:48.114317Z",
      "message":"This is a test error generated by Honeybadger",
      "token":null,
      "fault_id":123,
      "request":{

      },
      "backtrace":[
         {
            "file":"[PROJECT_ROOT]/lib/testing.rb",
            "number":"1",
            "method":"testing",
            "application_file":"lib/testing.rb",
            "context":"app"
         }
      ],
      "application_trace":[
         {
            "file":"[PROJECT_ROOT]/lib/testing.rb",
            "number":"1",
            "method":"testing",
            "application_file":"lib/testing.rb",
            "context":"app"
         }
      ],
      "web_environment":{

      },
      "deploy":null,
      "url":"https://app.honeybadger.io/projects/54639/faults/123/0636e982-eca4-11e7-9974-1058555bf71c"
   },
   "context":null
}
```

--------------------------------------------------------------------------------

---[FILE: uptime.json]---
Location: zulip-main/zerver/webhooks/honeybadger/fixtures/uptime.json

```json
{
   "event":"up",
   "message":"[Zulip Integration] Zulip will now receive uptime alerts.",
   "project":{
      "id":54639,
      "name":"Zulip Integration",
      "token":"d144e04c",
      "created_at":"2017-12-29T14:18:50.512753Z",
      "disable_public_links":false,
      "pivotal_project_id":null,
      "asana_workspace_id":null,
      "github_project":null,
      "environments":[

      ],
      "owner":{
         "id":57245,
         "email":"madelf1337@gmail.com",
         "name":"Pranav Kulkarni"
      },
      "last_notice_at":null,
      "earliest_notice_at":"2017-11-29T14:51:11.443833Z",
      "unresolved_fault_count":0,
      "fault_count":0,
      "active":true,
      "users":[
         {
            "id":57245,
            "email":"madelf1337@gmail.com",
            "name":"Pranav Kulkarni"
         }
      ],
      "sites":[
         {
            "id":"59ad71ac-6d2e-4fd0-a04f-b5c916c8f57e",
            "active":true,
            "last_checked_at":null,
            "name":"Zulip",
            "state":"up",
            "url":"https://zulipint.slack.com"
         }
      ],
      "team_id":34534
   },
   "site":{
      "id":"59ad71ac-6d2e-4fd0-a04f-b5c916c8f57e",
      "name":"Zulip",
      "url":"https://zulipint.slack.com",
      "frequency":5,
      "match_type":"success",
      "match":"",
      "state":"pending",
      "active":true,
      "last_checked_at":null,
      "retries":0,
      "proxy":0
   },
   "outage":{
      "down_at":null,
      "up_at":null,
      "status":null,
      "reason":null,
      "headers":null
   }
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/ifttt/doc.md

```text
# Zulip IFTTT integration

IFTTT supports integrations with hundreds of
[physical and digital products](https://ifttt.com/services), like
dishwashers, cars, web services, and more. Get IFTTT notifications directly
in Zulip.

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Create an [IFTTT account](https://ifttt.com/join). Select the service
   you'd like to receive notifications from as `this`. Select
   **Webhooks** as `that`. Select the **Make a web request** action.

1. Set **URL** to the URL generated above. Set **Method** to `POST`,
   and set **Content Type** to `application/json`.

1. Set **Body** to a JSON object with two parameters: `content` and
   `topic`, like so:

    `{"content": "message body", "topic": "message topic"}`

    You will most likely want to specify some IFTTT **Ingredients** to
    customize the topic and content of your messages. Click **Add ingredient**
    to see the available options and customize the `content` and `topic`
    parameters as necessary.

1.  Click **Create action**, and click **Finish**.

{end_tabs}

Congratulations! You're done!

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/ifttt/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class IFTTTHookTests(WebhookTestCase):
    CHANNEL_NAME = "ifttt"
    URL_TEMPLATE = "/api/v1/external/ifttt?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "ifttt"
    VIEW_FUNCTION_NAME = "api_ifttt_webhook"

    def test_ifttt_when_subject_and_body_are_correct(self) -> None:
        expected_topic_name = "Email sent from email@email.com"
        expected_message = "Email subject: Subject"
        self.check_webhook("correct_subject_and_body", expected_topic_name, expected_message)

    def test_ifttt_when_topic_and_body_are_correct(self) -> None:
        expected_topic_name = "Email sent from email@email.com"
        expected_message = "Email subject: Subject"
        self.check_webhook("correct_topic_and_body", expected_topic_name, expected_message)

    def test_ifttt_when_topic_is_missing(self) -> None:
        self.url = self.build_webhook_url()
        payload = self.get_body("invalid_payload_with_missing_topic")
        result = self.client_post(self.url, payload, content_type="application/json")
        self.assert_json_error(result, "Topic can't be empty")

    def test_ifttt_when_content_is_missing(self) -> None:
        self.url = self.build_webhook_url()
        payload = self.get_body("invalid_payload_with_missing_content")
        result = self.client_post(self.url, payload, content_type="application/json")
        self.assert_json_error(result, "Content can't be empty")

    def test_ifttt_when_topic_is_dict(self) -> None:
        self.url = self.build_webhook_url()
        payload = self.get_body("invalid_payload_with_dict_topic")
        result = self.client_post(self.url, payload, content_type="application/json")
        self.assert_json_error(result, "Malformed payload")

    def test_ifttt_when_content_is_dict(self) -> None:
        self.url = self.build_webhook_url()
        payload = self.get_body("invalid_payload_with_dict_content")
        result = self.client_post(self.url, payload, content_type="application/json")
        self.assert_json_error(result, "Malformed payload")
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/ifttt/view.py
Signals: Django

```python
from django.core.exceptions import ValidationError
from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _

from zerver.decorator import webhook_view
from zerver.lib.exceptions import JsonableError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_none_or, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile


@webhook_view("IFTTT")
@typed_endpoint
def api_ifttt_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    try:
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

    except ValidationError:
        raise JsonableError(_("Malformed payload"))

    check_send_webhook_message(request, user_profile, topic_name, content)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: correct_subject_and_body.json]---
Location: zulip-main/zerver/webhooks/ifttt/fixtures/correct_subject_and_body.json

```json
{
  "subject": "Email sent from email@email.com",
  "content": "Email subject: Subject"
}
```

--------------------------------------------------------------------------------

---[FILE: correct_topic_and_body.json]---
Location: zulip-main/zerver/webhooks/ifttt/fixtures/correct_topic_and_body.json

```json
{
  "topic": "Email sent from email@email.com",
  "content": "Email subject: Subject"
}
```

--------------------------------------------------------------------------------

---[FILE: invalid_payload_with_dict_content.json]---
Location: zulip-main/zerver/webhooks/ifttt/fixtures/invalid_payload_with_dict_content.json

```json
{
  "topic": "Email sent from email@email.com",
  "content": {"wrong": "example"}
}
```

--------------------------------------------------------------------------------

---[FILE: invalid_payload_with_dict_topic.json]---
Location: zulip-main/zerver/webhooks/ifttt/fixtures/invalid_payload_with_dict_topic.json

```json
{
  "topic": {"wrong": "example"},
  "content": "Email subject: Subject"
}
```

--------------------------------------------------------------------------------

---[FILE: invalid_payload_with_missing_content.json]---
Location: zulip-main/zerver/webhooks/ifttt/fixtures/invalid_payload_with_missing_content.json

```json
{
  "topic": "Email sent from email@email.com"
}
```

--------------------------------------------------------------------------------

---[FILE: invalid_payload_with_missing_topic.json]---
Location: zulip-main/zerver/webhooks/ifttt/fixtures/invalid_payload_with_missing_topic.json

```json
{
  "content": "Email subject: Subject"
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/insping/doc.md

```text
# Zulip Insping integration

Get Insping notifications in Zulip! Insping (stylized as !nsping) is a
simple uptime and performance monitoring tool, which notifies you when
a website or service is up and running or down.

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. On your Insping **Dashboard**, go to **Integrations**. Click
   on **Create Webhook**.

1. Set **Webhook URL** to the URL generated above. Set **Organization**
   to the organization you would like to receive notifications for, and
   click **Create**. To send a test message to your Zulip organization,
   click on **Test**, and then click **Send Test Data**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/insping/001.png)

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/insping/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class InspingHookTests(WebhookTestCase):
    CHANNEL_NAME = "test"
    URL_TEMPLATE = "/api/v1/external/insping?&api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "insping"

    def test_website_state_available_message(self) -> None:
        expected_topic_name = "insping"
        expected_message = """
State changed to **Available**:
* **URL**: http://privisus.zulipdev.org:9991
* **Response time**: 223 ms
* **Timestamp**: <time:2017-12-29T17:23:46+00:00>
""".strip()

        self.check_webhook(
            "website_state_available",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_website_state_not_responding_message(self) -> None:
        expected_topic_name = "insping"
        expected_message = """
State changed to **Not Responding**:
* **URL**: http://privisus.zulipdev.org:9991
* **Response time**: 942 ms
* **Timestamp**: <time:2017-12-29T17:13:46+00:00>
""".strip()

        self.check_webhook(
            "website_state_not_responding",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/insping/view.py
Signals: Django

```python
from datetime import datetime

from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.timestamp import datetime_to_global_time
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_int, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

MESSAGE_TEMPLATE = """
State changed to **{state}**:
* **URL**: {url}
* **Response time**: {response_time} ms
* **Timestamp**: {timestamp}
""".strip()


def get_global_time(dt_str: str) -> str:
    dt = datetime.fromisoformat(dt_str)
    return datetime_to_global_time(dt)


@webhook_view("Insping")
@typed_endpoint
def api_insping_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    data = payload["webhook_event_data"]

    state_name = data["check_state_name"].tame(check_string)
    url_tested = data["request_url"].tame(check_string)
    response_time = data["response_time"].tame(check_int)
    timestamp = get_global_time(data["request_start_time"].tame(check_string))

    body = MESSAGE_TEMPLATE.format(
        state=state_name,
        url=url_tested,
        response_time=response_time,
        timestamp=timestamp,
    )

    topic_name = "insping"

    check_send_webhook_message(request, user_profile, topic_name, body)

    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: website_state_available.json]---
Location: zulip-main/zerver/webhooks/insping/fixtures/website_state_available.json

```json
{
	"organization_name": "test",
	"webhook_event_id": 73418,
	"organization_id": 2587,
	"webhook_type": "AL",
	"webhook_event_data": {
		"check_state_name": "Available",
		"application_id": 2971,
		"check_id": 5630,
		"recently_started_check_start_time": null,
		"http_status_code": 200,
		"request_start_time": "2017-12-29T17:23:46.457990+00:00",
		"recently_started_check_state_name": null,
		"recently_started_check_http_status_code": null,
		"application_name": "test",
		"recently_started_check_response_time": null,
		"request_url": "http://privisus.zulipdev.org:9991",
		"response_time": 223
	},
	"webhook_id": 290,
	"webhook_event_created_on": "2017-12-29T17:23:47.790118+00:00"
}
```

--------------------------------------------------------------------------------

---[FILE: website_state_not_responding.json]---
Location: zulip-main/zerver/webhooks/insping/fixtures/website_state_not_responding.json

```json
{
	"organization_name": "test",
	"webhook_event_id": 73417,
	"organization_id": 2587,
	"webhook_type": "AL",
	"webhook_event_data": {
		"check_state_name": "Not Responding",
		"application_id": 2971,
		"check_id": 5630,
		"recently_started_check_start_time": null,
		"http_status_code": null,
		"request_start_time": "2017-12-29T17:13:46.788129+00:00",
		"recently_started_check_state_name": null,
		"recently_started_check_http_status_code": null,
		"application_name": "test",
		"recently_started_check_response_time": null,
		"request_url": "http://privisus.zulipdev.org:9991",
		"response_time": 942
	},
	"webhook_id": 290,
	"webhook_event_created_on": "2017-12-29T17:13:48.265870+00:00"
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/intercom/doc.md

```text
# Zulip Intercom integration

Get Intercom notifications in Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to **Settings** in your Intercom account, and click on
   **Developers** in the left sidebar. Click on **Developer Hub**,
   and click **New app**.

1. Set **App name** to a name of your choice, such as `Zulip`. Set
   **Workspace** to the Intercom workspace of your choice, and click
   **Create app**.

1. Click on **Webhooks** in the left sidebar. Set **Your request
   endpoint URL** to the URL generated above. Select the topics you'd
   like to be notified about, and click **Save**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/intercom/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

````
