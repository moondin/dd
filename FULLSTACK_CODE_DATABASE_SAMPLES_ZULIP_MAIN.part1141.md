---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1141
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1141 of 1290)

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
Location: zulip-main/zerver/webhooks/dbt/view.py
Signals: Django

```python
from urllib.parse import urljoin

from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_int, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

DBT_NOTIFICATION_TEMPLATE = """
{emoji} {job_name} {run_text} {status} in **{environment}**.

{job_text} was {run_reason} at <time:{start_time}>.
"""

DBT_EVENT_TYPE_MAPPER = {
    "job.run.started": {
        "running": (":yellow_circle:", "started"),
    },
    "job.run.completed": {
        "success": (":green_circle:", "succeeded"),
        "errored": (":cross_mark:", "completed with errors"),
    },
    "job.run.errored": {
        "errored": (":cross_mark:", "failed"),
    },
}

ALL_EVENT_TYPES = list(DBT_EVENT_TYPE_MAPPER.keys())


def extract_data_from_payload(payload: JsonBodyPayload[WildValue]) -> dict[str, str]:
    data: dict[str, str] = {
        "account_id": str(payload["accountId"].tame(check_int)),
        "event_type": payload["eventType"].tame(check_string),
        "job_id": payload["data"]["jobId"].tame(check_string),
        "job_name": payload["data"]["jobName"].tame(check_string),
        "project_name": payload["data"]["projectName"].tame(check_string),
        "project_id": payload["data"]["projectId"].tame(check_string),
        "environment": payload["data"]["environmentName"].tame(check_string),
        "run_id": payload["data"]["runId"].tame(check_string),
        "start_time": payload["data"]["runStartedAt"].tame(check_string),
        "run_status": payload["data"]["runStatus"].tame(check_string).lower(),
    }
    # We only change the capitalization of the first letter in this
    # string for the formatting of our notification template.
    run_reason = payload["data"]["runReason"].tame(check_string)
    data["run_reason"] = run_reason[:1].lower() + run_reason[1:]
    return data


def get_job_run_body(data: dict[str, str], access_url: str | None) -> str:
    emoji, status = DBT_EVENT_TYPE_MAPPER[data["event_type"]][data["run_status"]]

    project_url = (
        urljoin(
            access_url,
            f"/deploy/{data['account_id']}/projects/{data['project_id']}",
        )
        if access_url
        else None
    )
    job_text = (
        f"[Job #{data['job_id']}]({project_url}/jobs/{data['job_id']})"
        if project_url
        else f"Job #{data['job_id']}"
    )
    run_text = f"[deployment]({project_url}/runs/{data['run_id']})" if project_url else "deployment"

    body = DBT_NOTIFICATION_TEMPLATE.format(
        emoji=emoji,
        status=status,
        run_text=run_text,
        job_text=job_text,
        **data,
    )
    return body


@webhook_view("DBT", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_dbt_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
    access_url: str | None = None,
) -> HttpResponse:
    data = extract_data_from_payload(payload)
    body = get_job_run_body(data, access_url)
    topic_name = data["project_name"]
    event = data["event_type"]
    check_send_webhook_message(request, user_profile, topic_name, body, event)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: job_run_completed_errored.json]---
Location: zulip-main/zerver/webhooks/dbt/fixtures/job_run_completed_errored.json

```json
{
  "accountId": 1,
  "webhookId": "wsu_12345abcde",
  "eventId": "wev_2LkSAiWzKkSA59oilyd7FDeacXD",
  "timestamp": "2025-10-05T19:16:11.818389474Z",
  "eventType": "job.run.completed",
  "webhookName": "test",
  "data": {
    "jobId": "123",
    "jobName": "Daily Job (dbt build)",
    "runId": "12345",
    "environmentId": "1234",
    "environmentName": "Production",
    "dbtVersion": "2025.9.30+21d3fd7",
    "projectName": "Example Project",
    "projectId": "167194",
    "runStatus": "Errored",
    "runStatusCode": 20,
    "runStatusMessage": "dbt command failed",
    "runReason": "Kicked off from the UI by bwilliams@example.com",
    "runStartedAt": "2025-10-05T19:15:56Z",
    "runFinishedAt": "2025-10-05T19:16:06Z"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: job_run_completed_success.json]---
Location: zulip-main/zerver/webhooks/dbt/fixtures/job_run_completed_success.json

```json
{
  "accountId": 1,
  "webhookId": "wsu_12345abcde",
  "eventId": "wev_2L6ZDoilyiWzKkSA59Gmc2d7FDD",
  "timestamp": "2023-01-31T19:29:35.789265936Z",
  "eventType": "job.run.completed",
  "webhookName": "test",
  "data": {
    "jobId": "123",
    "jobName": "Daily Job (dbt build)",
    "runId": "12345",
    "environmentId": "1234",
    "environmentName": "Production",
    "dbtVersion": "1.0.0",
    "projectName": "Example Project",
    "projectId": "167194",
    "runStatus": "Success",
    "runStatusCode": 10,
    "runStatusMessage": "None",
    "runReason": "Kicked off from the UI by bwilliams@example.com",
    "runStartedAt": "2023-01-31T19:28:07Z",
    "runFinishedAt": "2023-01-31T19:29:32Z"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: job_run_errored.json]---
Location: zulip-main/zerver/webhooks/dbt/fixtures/job_run_errored.json

```json
{
  "accountId": 1,
  "webhookId": "wsu_12345abcde",
  "eventId": "wev_2L6m5BggBw9uPNuSmtg4MUiW4Re",
  "timestamp": "2023-01-31T21:15:20.419714619Z",
  "eventType": "job.run.errored",
  "webhookName": "test",
  "data": {
    "jobId": "123",
    "jobName": "Daily Job (dbt build)",
    "runId": "12345",
    "environmentId": "1234",
    "environmentName": "Production",
    "dbtVersion": "1.0.0",
    "projectName": "Example Project",
    "projectId": "167194",
    "runStatus": "Errored",
    "runStatusCode": 20,
    "runStatusMessage": "None",
    "runReason": "Kicked off from the UI by bwilliams@example.com",
    "runStartedAt": "2023-01-31T21:14:41Z",
    "runErroredAt": "2023-01-31T21:15:20Z"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: job_run_started.json]---
Location: zulip-main/zerver/webhooks/dbt/fixtures/job_run_started.json

```json
{
  "accountId": 1,
  "webhookId": "wsu_12345abcde",
  "eventId": "wev_2L6Z3l8uPedXKPq9D2nWbPIip7Z",
  "timestamp": "2023-01-31T19:28:15.742843678Z",
  "eventType": "job.run.started",
  "webhookName": "test",
  "data": {
    "jobId": "123",
    "jobName": "Daily Job (dbt build)",
    "runId": "12345",
    "environmentId": "1234",
    "environmentName": "Production",
    "dbtVersion": "1.0.0",
    "projectName": "Example Project",
    "projectId": "167194",
    "runStatus": "Running",
    "runStatusCode": 3,
    "runStatusMessage": "None",
    "runReason": "Kicked off from the UI by bwilliams@example.com",
    "runStartedAt": "2023-01-31T19:28:07Z"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/delighted/doc.md

```text
# Zulip Delighted integration

Get notifications about updates in feedback responses organized by
Delighted in Zulip.

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. On your Delighted dashboard, select **Settings** in the
   top-right corner.

1. Select **Integrations**, and then select **Webhooks**.

1. Under **Send webhook notifications for**, set **Webhook URL**
   to the URL generated above.

1. Select **Save and turn on**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/delighted/001.png)

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/delighted/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class DelightedHookTests(WebhookTestCase):
    CHANNEL_NAME = "delighted"
    URL_TEMPLATE = "/api/v1/external/delighted?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "delighted"

    def test_feedback_message_promoter(self) -> None:
        expected_topic_name = "Survey response"
        expected_message = """
Kudos! You have a new promoter. Score of 9/10 from charlie_gravis@example.com:

``` quote
Your service is fast and flawless!
```
""".strip()

        self.check_webhook(
            "survey_response_updated_promoter",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_feedback_message_non_promoter(self) -> None:
        expected_topic_name = "Survey response"
        expected_message = (
            "Great! You have new feedback.\n"
            ">Score of 5/10 from paul_gravis@example.com"
            "\n>Your service is slow, but nearly flawless! "
            "Keep up the good work!"
        )
        expected_message = """
Great! You have new feedback. Score of 5/10 from paul_gravis@example.com:

``` quote
Your service is slow, but nearly flawless! Keep up the good work!
```
""".strip()

        self.check_webhook(
            "survey_response_updated_non_promoter",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/delighted/view.py
Signals: Django

```python
from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_int, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

PROMOTER = """
Kudos! You have a new promoter. Score of {score}/10 from {email}:

``` quote
{comment}
```
""".strip()

FEEDBACK = """
Great! You have new feedback. Score of {score}/10 from {email}:

``` quote
{comment}
```
""".strip()


def body_template(score: int) -> str:
    if score >= 7:
        return PROMOTER
    else:
        return FEEDBACK


@webhook_view("Delighted")
@typed_endpoint
def api_delighted_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    person = payload["event_data"]["person"]
    email = person["email"].tame(check_string)
    score = payload["event_data"]["score"].tame(check_int)
    comment = payload["event_data"]["comment"].tame(check_string)

    BODY_TEMPLATE = body_template(score)
    body = BODY_TEMPLATE.format(email=email, score=score, comment=comment)
    topic_name = "Survey response"

    check_send_webhook_message(request, user_profile, topic_name, body)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: survey_response_updated_non_promoter.json]---
Location: zulip-main/zerver/webhooks/delighted/fixtures/survey_response_updated_non_promoter.json

```json
{
  "event_type": "survey_response.updated",
  "event_id": "b8d057c59327541d7ec2104c0a9a255ad1997fb00831b9c6bbf09561e6d5cbd0",
  "event_data": {
    "id": "5435",
    "person": {
      "id": "5975",
      "email": "paul_gravis@example.com",
      "name": "Paul Gravis",
      "created_at": 1482589349
    },
    "score": 5,
    "comment": "Your service is slow, but nearly flawless! Keep up the good work!",
    "permalink": "https://delighted.com/r/5pFDpmlyC8GUc5oxU6USto5VonSKAqOa",
    "created_at": 1482589409,
    "updated_at": 1482590009,
    "person_properties": null,
    "notes": [],
    "tags": []
  }
}
```

--------------------------------------------------------------------------------

---[FILE: survey_response_updated_promoter.json]---
Location: zulip-main/zerver/webhooks/delighted/fixtures/survey_response_updated_promoter.json

```json
{
  "event_type": "survey_response.updated",
  "event_id": "b8d057c59327541d7ec2104c0a9a255ad1997fb00831b9c6bbf09561e6d5cbd0",
  "event_data": {
    "id": "5435",
    "person": {
      "id": "5975",
      "email": "charlie_gravis@example.com",
      "name": "Charlie Gravis",
      "created_at": 1482589349
    },
    "score": 9,
    "comment": "Your service is fast and flawless!",
    "permalink": "https://delighted.com/r/5pFDpmlyC8GUc5oxU6USto5VonSKAqOa",
    "created_at": 1482589409,
    "updated_at": 1482590009,
    "person_properties": null,
    "notes": [],
    "tags": []
  }
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/dialogflow/doc.md

```text
Get personal message notifications in Zulip for the results of your
Dialogflow queries!

1. {!create-channel.md!}

1. {!create-an-incoming-webhook.md!}

    The API key for an incoming webhook bot cannot be used to read messages out
    of Zulip. Thus, using an incoming webhook bot lowers the security risk of
    exposing the bot's API key to a third-party service.

    Construct the URL for the Dialogflow bot using the bot's API key and your
    Zulip email. The webhook URL should look like:

    `{{api_url}}?api_key=BOT'S_API_KEY&email=foo@example.com`

    Modify the parameters of the URL above where `api_key` is the API key of your Zulip bot
    and `email` is your Zulip email.

1. Go to the **Fulfillment** settings of your Dialogflow app and enable **Webhooks**.
   Set **URL** to the URL constructed above.
   Go to **Intents** and at the bottom, check the box **Use webhook**
   under **Fulfillment**.

{!congrats.md!}

![](/static/images/integrations/dialogflow/001.png)
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/dialogflow/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class DialogflowHookTests(WebhookTestCase):
    URL_TEMPLATE = "/api/v1/external/dialogflow?api_key={api_key}&email=AARON@zulip.com"
    WEBHOOK_DIR_NAME = "dialogflow"

    def test_dialogflow_default(self) -> None:
        email = self.example_user("aaron").email
        self.url = self.build_webhook_url(
            email=email,
            username="aaron",
            user_ip="127.0.0.1",
        )
        expected_message = "The weather sure looks great !"
        self.send_and_test_private_message("default", expected_message)

    def test_dialogflow_alternate_result(self) -> None:
        email = self.example_user("aaron").email
        self.url = self.build_webhook_url(
            email=email,
            username="aaron",
            user_ip="127.0.0.1",
        )
        expected_message = "Weather in New Delhi is nice!"
        self.send_and_test_private_message("alternate_result", expected_message)

    def test_dialogflow_error_status(self) -> None:
        email = self.example_user("aaron").email
        self.url = self.build_webhook_url(
            email=email,
            username="aaron",
            user_ip="127.0.0.1",
        )
        expected_message = "403 - Access Denied"
        self.send_and_test_private_message("error_status", expected_message)

    def test_dialogflow_exception(self) -> None:
        email = self.example_user("aaron").email
        self.url = self.build_webhook_url(
            email=email,
            username="aaron",
            user_ip="127.0.0.1",
        )
        expected_message = "Dialogflow couldn't process your query."
        self.send_and_test_private_message("exception", expected_message)
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/dialogflow/view.py
Signals: Django

```python
# Webhooks for external integrations.
from django.http import HttpRequest, HttpResponse

from zerver.actions.message_send import check_send_private_message
from zerver.decorator import webhook_view
from zerver.lib.request import RequestNotes
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_int, check_string
from zerver.models import UserProfile
from zerver.models.users import get_user


@webhook_view("Dialogflow")
@typed_endpoint
def api_dialogflow_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
    email: str,
) -> HttpResponse:
    status = payload["status"]["code"].tame(check_int)

    if status == 200:
        result = payload["result"]["fulfillment"]["speech"].tame(check_string)
        if not result:
            alternate_result = payload["alternateResult"]["fulfillment"]["speech"].tame(
                check_string
            )
            if not alternate_result:
                body = "Dialogflow couldn't process your query."
            else:
                body = alternate_result
        else:
            body = result
    else:
        error_status = payload["status"]["errorDetails"].tame(check_string)
        body = f"{status} - {error_status}"

    receiving_user = get_user(email, user_profile.realm)
    client = RequestNotes.get_notes(request).client
    assert client is not None
    check_send_private_message(user_profile, client, receiving_user, body)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: alternate_result.json]---
Location: zulip-main/zerver/webhooks/dialogflow/fixtures/alternate_result.json

```json
{
  "id": "69316a96-cce1-4322-9bdc-d94e8298f0d2",
  "timestamp": "2018-01-12T12:22:31.283Z",
  "lang": "en",
  "result": {
    "source": "agent",
    "resolvedQuery": "what's the weather in New Delhi",
    "action": "yahooWeatherForecast",
    "actionIncomplete": false,
    "parameters": {
      "geo-city": "New Delhi"
    },
    "contexts": [],
    "metadata": {
      "intentId": "a61266c2-b6af-4dc8-a7b9-72dfb11b72d8",
      "webhookUsed": "true",
      "webhookForSlotFillingUsed": "false",
      "webhookResponseTime": 115,
      "intentName": "weather-intent"
    },
    "fulfillment": {
      "speech": "",
      "source": "apiai-weather-webhook-sample",
      "displayText": "",
      "messages": [
        {
          "type": 0,
          "speech": ""
        }
      ]
    },
    "score": 0.7099999785423279
  },
  "alternateResult": {
    "fulfillment": {
      "speech": "Weather in New Delhi is nice!"
    }
  },
  "status": {
    "code": 200,
    "errorType": "success",
    "webhookTimedOut": false
  },
  "sessionId": "2507496e-8028-4be5-ac52-1624f752b188"
}
```

--------------------------------------------------------------------------------

---[FILE: default.json]---
Location: zulip-main/zerver/webhooks/dialogflow/fixtures/default.json

```json
{
  "id": "1faaa328-dad8-4532-be7e-c4103dfdbf40",
  "timestamp": "2018-01-12T12:09:15.699Z",
  "lang": "en",
  "result": {
    "source": "agent",
    "resolvedQuery": "how is the weather in Sunnyvale",
    "action": "",
    "actionIncomplete": false,
    "parameters": {
      "geo-city": "Sunnyvale"
    },
    "contexts": [],
    "metadata": {
      "intentId": "a61266c2-b6af-4dc8-a7b9-72dfb11b72d8",
      "webhookUsed": "false",
      "webhookForSlotFillingUsed": "false",
      "intentName": "weather-intent"
    },
    "fulfillment": {
      "speech": "The weather sure looks great !",
      "messages": [
        {
          "type": 0,
          "speech": "The weather sure looks great !"
        }
      ]
    },
    "score": 1
  },
  "status": {
    "code": 200,
    "errorType": "success",
    "webhookTimedOut": false
  },
  "sessionId": "2507496e-8028-4be5-ac52-1624f752b188"
}
```

--------------------------------------------------------------------------------

---[FILE: error_status.json]---
Location: zulip-main/zerver/webhooks/dialogflow/fixtures/error_status.json

```json
{
  "id": "69316a96-cce1-4322-9bdc-d94e8298f0d2",
  "timestamp": "2018-01-12T12:22:31.283Z",
  "lang": "en",
  "result": {
    "resolvedQuery": "what's the weather in New Delhi"
  },
  "status": {
    "code": 403,
    "errorType": "fail",
    "errorDetails": "Access Denied"
  },
  "sessionId": "2507496e-8028-4be5-ac52-1624f752b188"
}
```

--------------------------------------------------------------------------------

---[FILE: exception.json]---
Location: zulip-main/zerver/webhooks/dialogflow/fixtures/exception.json

```json
{
  "id": "69316a96-cce1-4322-9bdc-d94e8298f0d2",
  "timestamp": "2018-01-12T12:22:31.283Z",
  "lang": "en",
  "result": {
    "source": "agent",
    "resolvedQuery": "what's the weather in New Delhi",
    "action": "yahooWeatherForecast",
    "actionIncomplete": false,
    "parameters": {
      "geo-city": "New Delhi"
    },
    "contexts": [],
    "metadata": {
      "intentId": "a61266c2-b6af-4dc8-a7b9-72dfb11b72d8",
      "webhookUsed": "true",
      "webhookForSlotFillingUsed": "false",
      "webhookResponseTime": 115,
      "intentName": "weather-intent"
    },
    "fulfillment": {
      "speech": "",
      "source": "apiai-weather-webhook-sample",
      "displayText": "",
      "messages": [
        {
          "type": 0,
          "speech": ""
        }
      ]
    },
    "score": 0.7099999785423279
  },
  "alternateResult": {
    "fulfillment": {
      "speech": ""
    }
  },
  "status": {
    "code": 200,
    "errorType": "success",
    "webhookTimedOut": false
  },
  "sessionId": "2507496e-8028-4be5-ac52-1624f752b188"
}
```

--------------------------------------------------------------------------------

---[FILE: weather_app.json]---
Location: zulip-main/zerver/webhooks/dialogflow/fixtures/weather_app.json

```json
{
  "id": "69316a96-cce1-4322-9bdc-d94e8298f0d2",
  "timestamp": "2018-01-12T12:22:31.283Z",
  "lang": "en",
  "result": {
    "source": "agent",
    "resolvedQuery": "what's the weather in New Delhi",
    "action": "yahooWeatherForecast",
    "actionIncomplete": false,
    "parameters": {
      "geo-city": "New Delhi"
    },
    "contexts": [],
    "metadata": {
      "intentId": "a61266c2-b6af-4dc8-a7b9-72dfb11b72d8",
      "webhookUsed": "true",
      "webhookForSlotFillingUsed": "false",
      "webhookResponseTime": 115,
      "intentName": "weather-intent"
    },
    "fulfillment": {
      "speech": "Today the weather in Delhi: Sunny, And the temperature is 65 F",
      "source": "apiai-weather-webhook-sample",
      "displayText": "Today the weather in Delhi: Sunny, And the temperature is 65 F",
      "messages": [
        {
          "type": 0,
          "speech": "Today the weather in Delhi: Sunny, And the temperature is 65 F"
        }
      ]
    },
    "score": 0.7099999785423279
  },
  "status": {
    "code": 200,
    "errorType": "success",
    "webhookTimedOut": false
  },
  "sessionId": "2507496e-8028-4be5-ac52-1624f752b188"
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/dropbox/doc.md

```text
# Zulip Dropbox integration

Get Dropbox notifications in Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to your [Dropbox apps page](https://www.dropbox.com/developers/apps),
   and select **Create app** near the top-right corner. Follow the on-screen
   instructions to create an app.

1. Once you've created the app, you will be redirected to the **Settings**
   tab for your app. Scroll down to the **Webhooks** section.

1. Go to the **Oauth 2** section, at the bottom of which you'll find a
   **Generate** button. Click on it to activate the app for your account.

    ![](/static/images/integrations/dropbox/oauth2_generate.png)

1. Set **Webhook URIs** to the URL generated above, and select **Add**.
   The status of the webhook should say **Enabled**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/dropbox/001.png)

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/dropbox/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class DropboxHookTests(WebhookTestCase):
    CHANNEL_NAME = "test"
    URL_TEMPLATE = "/api/v1/external/dropbox?&api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "dropbox"

    def test_file_updated(self) -> None:
        expected_topic_name = "Dropbox"
        expected_message = "File has been updated on Dropbox!"

        self.check_webhook(
            "file_updated",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_verification_request(self) -> None:
        self.subscribe(self.test_user, self.CHANNEL_NAME)
        get_params = {"stream_name": self.CHANNEL_NAME, "api_key": self.test_user.api_key}
        result = self.client_get(self.url, get_params)
        self.assert_json_error(result, "Missing 'challenge' argument", 400)

        get_params["challenge"] = "9B2SVL4orbt5DxLMqJHI6pOTipTqingt2YFMIO0g06E"
        result = self.client_get(self.url, get_params)

        self.assertEqual(result.status_code, 200)
        self.assertEqual(result["Content-Type"], "text/plain; charset=UTF-8")
        self.assert_in_response("9B2SVL4orbt5DxLMqJHI6pOTipTqingt2YFMIO0g06E", result)
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/dropbox/view.py
Signals: Django

```python
from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.request import RequestVariableMissingError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import typed_endpoint
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile


@webhook_view("Dropbox", notify_bot_owner_on_invalid_json=False)
@typed_endpoint
def api_dropbox_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    challenge: str | None = None,
) -> HttpResponse:
    if request.method == "POST":
        topic_name = "Dropbox"
        check_send_webhook_message(
            request, user_profile, topic_name, "File has been updated on Dropbox!"
        )
        return json_success(request)
    else:
        if challenge is None:
            raise RequestVariableMissingError("challenge")
        return HttpResponse(challenge, content_type="text/plain; charset=UTF-8")
```

--------------------------------------------------------------------------------

---[FILE: file_updated.json]---
Location: zulip-main/zerver/webhooks/dropbox/fixtures/file_updated.json

```json
{
    "list_folder": {
        "accounts": [
            "dbid:AAH4f99T0taONIb-OurWxbNQ6ywGRopQngc"
        ]
    },
    "delta": {
        "users": [
            12345678
        ]
    }
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/errbit/doc.md

```text
# Zulip Errbit integration

Get Zulip notifications for the Errbit error tracker!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to your project's settings on the Errbit site. Click on the
   **Edit** button for your Errbit app, and select **Webhook**.

1. Enter the URL generated above, and toggle **Enabled**.

1. Select **Save**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/errbit/001.png)

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/errbit/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class ErrBitHookTests(WebhookTestCase):
    CHANNEL_NAME = "errbit"
    URL_TEMPLATE = "/api/v1/external/errbit?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "errbit"

    def test_errbit_error_message(self) -> None:
        expected_topic_name = "ZulipIntegrationTest / ErrbitEnvName"
        expected_message = '[IllegalStateException](https://errbit.example.com/apps/5e1ed1ff1a603f3916f4f0de/problems/5e1fe93e1a603f3916f4f0e3): "Invalid state error" occurred.'
        self.check_webhook("error_message", expected_topic_name, expected_message)
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/errbit/view.py
Signals: Django

```python
from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

ERRBIT_TOPIC_TEMPLATE = "{project_name}"
ERRBIT_MESSAGE_TEMPLATE = '[{error_class}]({error_url}): "{error_message}" occurred.'


@webhook_view("Errbit")
@typed_endpoint
def api_errbit_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    topic_name = get_topic(payload)
    body = get_body(payload)
    check_send_webhook_message(request, user_profile, topic_name, body)
    return json_success(request)


def get_topic(payload: WildValue) -> str:
    project = payload["problem"]["app_name"].tame(check_string)
    project += " / " + payload["problem"]["environment"].tame(check_string)
    return ERRBIT_TOPIC_TEMPLATE.format(project_name=project)


def get_body(payload: WildValue) -> str:
    data = {
        "error_url": payload["problem"]["url"].tame(check_string),
        "error_class": payload["problem"]["error_class"].tame(check_string),
        "error_message": payload["problem"]["message"].tame(check_string),
    }
    return ERRBIT_MESSAGE_TEMPLATE.format(**data)
```

--------------------------------------------------------------------------------

---[FILE: error_message.json]---
Location: zulip-main/zerver/webhooks/errbit/fixtures/error_message.json

```json
{
    "problem": {
        "url": "https://errbit.example.com/apps/5e1ed1ff1a603f3916f4f0de/problems/5e1fe93e1a603f3916f4f0e3",
        "_id": "5e1fe93e1a603f3916f4f0e3",
        "app_id": "5e1ed1ff1a603f3916f4f0de",
        "app_name": "ZulipIntegrationTest",
        "comments_count": 0,
        "created_at": "2020-01-15T23:40:30.989-05:00",
        "environment": "ErrbitEnvName",
        "error_class": "IllegalStateException",
        "first_notice_at": "2020-01-15T23:40:30.987-05:00",
        "hosts": {
            "382b0f5185773fa0f67a8ed8056c7759": {
                "count": 5,
                "value": "N/A"
            }
        },
        "issue_link": null,
        "issue_type": null,
        "last_notice_at": "2020-01-16T00:30:04.835-05:00",
        "message": "Invalid state error",
        "messages": {
            "f721d9a468a891c5138eeb52c8b3831e": {
                "count": 5,
                "value": "Invalid state error"
            }
        },
        "notices_count": 5,
        "resolved": false,
        "resolved_at": null,
        "updated_at": "2020-01-15T23:45:19.246-05:00",
        "user_agents": {
            "382b0f5185773fa0f67a8ed8056c7759": {
                "count": 5,
                "value": "N/A"
            }
        },
        "where": "unknown"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/flock/doc.md

```text
# Zulip Flock integration

Get Zulip notifications from your Flock channels.

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. In Flock, click on **Apps** in the bottom-right corner. Got to the
   **Admin Panel**, and click on **Webhooks**. Select **Outgoing
   Webhook**, and click **Add**.

1. Set **Send messages from a channel** to the Flock channel you'd like
   to be notified about. Set **Name that the webhook will post as** to a
   name of your choice, such as `Zulip`. Finally, set **Callback URL**
   to the URL generated above, and click **Save Settings**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/flock/001.png)

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/flock/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class FlockHookTests(WebhookTestCase):
    CHANNEL_NAME = "test"
    URL_TEMPLATE = "/api/v1/external/flock?api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "flock"

    def test_flock_message(self) -> None:
        expected_topic_name = "Flock notifications"
        expected_message = "This is the welcome message!"
        self.check_webhook(
            "messages", expected_topic_name, expected_message, content_type="application/json"
        )

    def test_flock_reply(self) -> None:
        expected_topic_name = "Flock notifications"
        expected_message = "It's interesting how high productivity will go..."
        self.check_webhook(
            "reply", expected_topic_name, expected_message, content_type="application/json"
        )

    def test_flock_note(self) -> None:
        expected_topic_name = "Flock notifications"
        expected_message = "Shared a note"
        self.check_webhook(
            "note", expected_topic_name, expected_message, content_type="application/json"
        )

    def test_flock_reply_note(self) -> None:
        expected_topic_name = "Flock notifications"
        expected_message = "This is reply to Note."
        self.check_webhook(
            "reply_note", expected_topic_name, expected_message, content_type="application/json"
        )

    def test_flock_reply_pinned(self) -> None:
        expected_topic_name = "Flock notifications"
        expected_message = "This is reply to pinned message."
        self.check_webhook(
            "reply_pinned", expected_topic_name, expected_message, content_type="application/json"
        )

    def test_flock_reply_reminder(self) -> None:
        expected_topic_name = "Flock notifications"
        expected_message = "This is a reply to Reminder."
        self.check_webhook(
            "reply_reminder", expected_topic_name, expected_message, content_type="application/json"
        )

    def test_flock_reply_todo(self) -> None:
        expected_topic_name = "Flock notifications"
        expected_message = "This is a reply to Todo notification."
        self.check_webhook(
            "reply_todo", expected_topic_name, expected_message, content_type="application/json"
        )

    def test_flock_pinned(self) -> None:
        expected_topic_name = "Flock notifications"
        expected_message = "Rishabh rawat pinned an item to the conversation"
        self.check_webhook(
            "pinned", expected_topic_name, expected_message, content_type="application/json"
        )

    def test_flock_reminder(self) -> None:
        expected_topic_name = "Flock notifications"
        expected_message = "Rishabh rawat wanted me to remind All"
        self.check_webhook(
            "reminder", expected_topic_name, expected_message, content_type="application/json"
        )

    def test_flock_todo(self) -> None:
        expected_topic_name = "Flock notifications"
        expected_message = "Rishabh rawat added a to-do in New List 1 list"
        self.check_webhook(
            "todo", expected_topic_name, expected_message, content_type="application/json"
        )
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/flock/view.py
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


@webhook_view("Flock")
@typed_endpoint
def api_flock_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    text = payload["text"].tame(check_string)
    if len(text) != 0:
        message_body = text
    else:
        message_body = payload["notification"].tame(check_string)

    topic_name = "Flock notifications"
    body = f"{message_body}"

    check_send_webhook_message(request, user_profile, topic_name, body)

    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: messages.json]---
Location: zulip-main/zerver/webhooks/flock/fixtures/messages.json

```json
{
    "id": "1519889547187_0",
    "to": "g:183ff1e90d79465793273a31d7d1e537",
    "from": "u:9qehqo3ixo3t93e3",
    "text": "This is the welcome message!",
    "timestamp": "2018-03-01T07:32:25.238Z",
    "timestampInMillis": 1519889545238,
    "uid": "1519889545238-gg8-m203",
    "onBehalfOf": "",
    "visibleTo": []
}
```

--------------------------------------------------------------------------------

---[FILE: note.json]---
Location: zulip-main/zerver/webhooks/flock/fixtures/note.json

```json
{
    "attachments": [
        {
            "appId": "bd05fb5b1e39e29b396e03c2efe053196e3b9458",
            "title": "NoteTitle",
            "forward": true,
            "views": {
                "widget": {
                    "src": "https://apps.flock.co:443/flock-notes/notes/8a0fc0c2-e567-4685-a7a7-883898da47c3/preview",
                    "width": 0,
                    "height": 65
                }
            }
        }
    ],
    "id": "Amreh",
    "to": "g:183ff1e90d79465793273a31d7d1e537",
    "from": "u:9qehqo3ixo3t93e3",
    "notification": "Shared a note",
    "text": "",
    "appId": "bd05fb5b1e39e29b396e03c2efe053196e3b9458",
    "timestamp": "2018-03-01T08:16:08.335Z",
    "timestampInMillis": 1519892168335,
    "uid": "1519892168335-y7J-m203",
    "onBehalfOf": ""
}
```

--------------------------------------------------------------------------------

---[FILE: pinned.json]---
Location: zulip-main/zerver/webhooks/flock/fixtures/pinned.json

```json
{
    "id": "SMzzJ",
    "to": "g:183ff1e90d79465793273a31d7d1e537",
    "from": "u:9qehqo3ixo3t93e3",
    "notification": "Rishabh rawat pinned an item to the conversation",
    "flockml": "<flockml>Rishabh rawat pinned an <action id='act1' type='openWidget' url='https://apps-static.flock.co/smartbar/index.html' desktopType='sidebar' mobileType='modal'>item</action> to this conversation. You can access it via the <action id='act1' type='openWidget' url='https://apps-static.flock.co/smartbar/index.html' desktopType='sidebar' mobileType='modal'>Files</action> App.</flockml>",
    "text": "",
    "sendAs": {
        "name": "Pinner Bot",
        "profileImage": "https://apps-static.flock.co/smartbar/bot-icon.png"
    },
    "appId": "6937451c-edbf-4ecb-b715-1e26574b5168",
    "timestamp": "2018-03-01T07:49:06.284Z",
    "timestampInMillis": 1519890546284,
    "uid": "1519890546284-f3t-m203",
    "onBehalfOf": ""
}
```

--------------------------------------------------------------------------------

````
