---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1253
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1253 of 1290)

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

---[FILE: attachment_pieces_text_null.json]---
Location: zulip-main/zerver/webhooks/slack_incoming/fixtures/attachment_pieces_text_null.json

```json
{
    "attachments": [
        {
            "title": "Sample title.",
            "title_link": "https://www.google.com",
            "image_url": "https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg",
            "ts": 1655945306,
            "text": null,
            "pretext": "Sample pretext.",
            "footer": "Sample footer."
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: attachment_pieces_title_link_null.json]---
Location: zulip-main/zerver/webhooks/slack_incoming/fixtures/attachment_pieces_title_link_null.json

```json
{
    "attachments": [
        {
            "title": "Sample title.",
            "title_link": null,
            "image_url": "https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg",
            "ts": 1655945306,
            "text": "Sample text.",
            "pretext": "Sample pretext.",
            "footer": "Sample footer."
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: attachment_pieces_title_null.json]---
Location: zulip-main/zerver/webhooks/slack_incoming/fixtures/attachment_pieces_title_null.json

```json
{
    "attachments": [
        {
            "title": null,
            "title_link": "https://www.google.com",
            "image_url": "https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg",
            "ts": 1655945306,
            "text": "Sample text.",
            "pretext": "Sample pretext.",
            "footer": "Sample footer."
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: attachment_pieces_ts_null.json]---
Location: zulip-main/zerver/webhooks/slack_incoming/fixtures/attachment_pieces_ts_null.json

```json
{
    "attachments": [
        {
            "title": "Sample title.",
            "title_link": "https://www.google.com",
            "image_url": "https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg",
            "ts": null,
            "text": "Sample text.",
            "pretext": "Sample pretext.",
            "footer": "Sample footer."
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: blocks.json]---
Location: zulip-main/zerver/webhooks/slack_incoming/fixtures/blocks.json

```json
{
    "text": "Danny Torrence left a 1 star review for your property.",
    "blocks": [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "Danny Torrence left the following review for your property:"
            }
        },
        {
            "type": "section",
            "block_id": "section567",
            "text": {
                "type": "mrkdwn",
                "text": "<https://example.com|Overlook Hotel> \n :star: \n Doors had too many axe holes, guest in room 237 was far too rowdy, whole place felt stuck in the 1920s."
            },
            "accessory": {
                "type": "image",
                "image_url": "https://is5-ssl.mzstatic.com/image/thumb/Purple3/v4/d3/72/5c/d3725c8f-c642-5d69-1904-aa36e4297885/source/256x256bb.jpg",
                "alt_text": "Haunted hotel image"
            }
        },
        {
            "type": "section",
            "block_id": "section789",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": "*Average Rating*\n1.0"
                }
            ]
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: complicated.json]---
Location: zulip-main/zerver/webhooks/slack_incoming/fixtures/complicated.json

```json
{
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "Hello from TaskBot",
        "emoji": true
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "Hey there 👋 I'm TaskBot. I'm here to help you create and manage tasks in Slack.\nThere are two ways to quickly create tasks:"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*1️⃣ Use the `/task` command*. Type `/task` followed by a short description of your tasks and I'll ask for a due date (if applicable). Try it out by using the `/task` command in this channel."
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*2️⃣ Use the _Create a Task_ action.* If you want to create a task from a message, select `Create a Task` in a message's context menu. Try it out by selecting the _Create a Task_ action for this message (shown below)."
      }
    },
    {
      "type": "image",
      "title": {
        "type": "plain_text",
        "text": "image1",
        "emoji": true
      },
      "image_url": "https://api.slack.com/img/blocks/bkb_template_images/onboardingComplex.jpg",
      "alt_text": "image1"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "➕ To start tracking your team's tasks, *add me to a channel* and I'll introduce myself. I'm usually added to a team or project channel. Type `/invite @TaskBot` from the channel or pick a channel on the right."
      },
      "accessory": {
        "type": "conversations_select",
        "placeholder": {
          "type": "plain_text",
          "text": "Select a channel...",
          "emoji": true
        }
      }
    },
    {
      "type": "input",
      "element": {
        "type": "plain_text_input",
        "action_id": "plain_text_input-action"
      },
      "label": {
        "type": "plain_text",
        "text": "Try writing some task in here:",
        "emoji": true
      }
    },
    {
      "type": "divider"
    },
    {
      "type": "context",
      "elements": [
        {
          "type": "image",
          "image_url": "https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg",
          "alt_text": "cute cat"
        },
        {
          "type": "mrkdwn",
          "text": "👀 View all tasks with `/task list`"
        },
        {
          "type": "mrkdwn",
            "text": "❓Get help at any time with:\n- `/task help`, or\n- type *help* in a DM with me"
        }
      ]
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: null_text.json]---
Location: zulip-main/zerver/webhooks/slack_incoming/fixtures/null_text.json

```json
{
    "text": null
}
```

--------------------------------------------------------------------------------

---[FILE: text.json]---
Location: zulip-main/zerver/webhooks/slack_incoming/fixtures/text.json

```json
{
    "text": "Hello, world."
}
```

--------------------------------------------------------------------------------

---[FILE: urlencoded_text.txt]---
Location: zulip-main/zerver/webhooks/slack_incoming/fixtures/urlencoded_text.txt

```text
payload=%7B%22username%22%3A%22DeployBot%22%2C%22icon_url%22%3A%22https%3A%2F%2Fraw.githubusercontent.com%2Fphallstrom%2Fslackistrano%2Fmaster%2Fimages%2Fslackistrano.png%22%2C%22icon_emoji%22%3A%22%3Azap%3A%22%2C%22text%22%3A%22chris+has+started+deploying+project+tag+v0.0.2rc10+to+staging%22%2C%22channel%22%3A%22%23devops%22%7D
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/sonarqube/doc.md

```text
# Zulip Sonarqube integration

Get Zulip notifications for your Sonarqube code analysis!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. To configure webhooks for a specific SonarQube project, go to the project,
    and select **Administration**. Select **Webhooks**, and click **Create**.

1. Set **Name** of the webhook to a name of your choice, such as `Zulip`.
    Set **URL** to the URL generated above, and click **Create**.

!!! tip ""

    You can also configure webhooks globally in SonarQube via
    **Configurations** -> **Webhooks**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/sonarqube/001.png)

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/sonarqube/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class SonarqubeHookTests(WebhookTestCase):
    CHANNEL_NAME = "SonarQube"
    URL_TEMPLATE = "/api/v1/external/sonarqube?api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "sonarqube"

    def test_analysis_success(self) -> None:
        expected_topic_name = "test-sonar / master"

        expected_message = """
Project [test-sonar](http://localhost:9000/dashboard?id=test-sonar) analysis of branch master resulted in success.
        """.strip()

        self.check_webhook(
            "success",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_analysis_error(self) -> None:
        expected_topic_name = "test-sonar / master"

        expected_message = """
Project [test-sonar](http://localhost:9000/dashboard?id=test-sonar) analysis of branch master resulted in error:
* coverage: **error** 0.0 should be greater than or equal to 80.
* duplicated lines density: **error** 89.39828080229226 should be less than or equal to 3.
        """.strip()

        self.check_webhook(
            "error",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_analysis_error_no_value(self) -> None:
        expected_topic_name = "test-sonar / master"

        expected_message = """
Project [test-sonar](http://localhost:9000/dashboard?id=test-sonar) analysis of branch master resulted in error:
* coverage: **error** 0.0 should be greater than or equal to 80.
* duplicated lines density: **error**.
        """.strip()

        self.check_webhook(
            "error_no_value",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_analysis_success_no_branch(self) -> None:
        expected_topic_name = "test-sonar"

        expected_message = """
Project [test-sonar](http://localhost:9000/dashboard?id=test-sonar) analysis resulted in success.
        """.strip()

        self.check_webhook(
            "success_no_branch",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_analysis_error_no_branch(self) -> None:
        expected_topic_name = "test-sonar"

        expected_message = """
Project [test-sonar](http://localhost:9000/dashboard?id=test-sonar) analysis resulted in error:
* coverage: **error** 0.0 should be greater than or equal to 80.
* duplicated lines density: **error** 89.39828080229226 should be less than or equal to 3.
        """.strip()

        self.check_webhook(
            "error_no_branch",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/sonarqube/view.py
Signals: Django

```python
# Webhooks for external integrations.
from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_none_or, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

TOPIC_WITH_BRANCH = "{} / {}"

MESSAGE_WITH_BRANCH_AND_CONDITIONS = "Project [{}]({}) analysis of branch {} resulted in {}:\n"
MESSAGE_WITH_BRANCH_AND_WITHOUT_CONDITIONS = (
    "Project [{}]({}) analysis of branch {} resulted in {}."
)
MESSAGE_WITHOUT_BRANCH_AND_WITH_CONDITIONS = "Project [{}]({}) analysis resulted in {}:\n"
MESSAGE_WITHOUT_BRANCH_AND_CONDITIONS = "Project [{}]({}) analysis resulted in {}."

INVERSE_OPERATORS = {
    "WORSE_THAN": "should be better or equal to",
    "GREATER_THAN": "should be less than or equal to",
    "LESS_THAN": "should be greater than or equal to",
}

TEMPLATES = {
    "default": "* {}: **{}** {} {} {}.",
    "no_value": "* {}: **{}**.",
}


def parse_metric_name(metric_name: str) -> str:
    return " ".join(metric_name.split("_"))


def parse_condition(condition: WildValue) -> str:
    metric = condition["metric"].tame(check_string)

    metric_name = parse_metric_name(metric)
    operator = condition["operator"].tame(check_string)
    operator = INVERSE_OPERATORS.get(operator, operator)
    value = condition.get("value", "no value").tame(check_string)
    status = condition["status"].tame(check_string).lower()
    threshold = condition["errorThreshold"].tame(check_string)

    if value == "no value":
        return TEMPLATES["no_value"].format(metric_name, status)

    template = TEMPLATES["default"]

    return template.format(metric_name, status, value, operator, threshold)


def parse_conditions(conditions: WildValue) -> str:
    return "\n".join(
        [
            parse_condition(condition)
            for condition in conditions
            if condition["status"].tame(check_string).lower() != "ok"
            and condition["status"].tame(check_string).lower() != "no_value"
        ]
    )


def render_body_with_branch(payload: WildValue) -> str:
    project_name = payload["project"]["name"].tame(check_string)
    project_url = payload["project"]["url"].tame(check_string)
    quality_gate_status = payload["qualityGate"]["status"].tame(check_string).lower()
    if quality_gate_status == "ok":
        quality_gate_status = "success"
    else:
        quality_gate_status = "error"
    branch = payload["branch"]["name"].tame(check_string)

    conditions = parse_conditions(payload["qualityGate"]["conditions"])

    if not conditions:
        return MESSAGE_WITH_BRANCH_AND_WITHOUT_CONDITIONS.format(
            project_name, project_url, branch, quality_gate_status
        )
    msg = MESSAGE_WITH_BRANCH_AND_CONDITIONS.format(
        project_name, project_url, branch, quality_gate_status
    )
    msg += conditions

    return msg


def render_body_without_branch(payload: WildValue) -> str:
    project_name = payload["project"]["name"].tame(check_string)
    project_url = payload["project"]["url"].tame(check_string)
    quality_gate_status = payload["qualityGate"]["status"].tame(check_string).lower()
    if quality_gate_status == "ok":
        quality_gate_status = "success"
    else:
        quality_gate_status = "error"
    conditions = parse_conditions(payload["qualityGate"]["conditions"])

    if not conditions:
        return MESSAGE_WITHOUT_BRANCH_AND_CONDITIONS.format(
            project_name, project_url, quality_gate_status
        )
    msg = MESSAGE_WITHOUT_BRANCH_AND_WITH_CONDITIONS.format(
        project_name, project_url, quality_gate_status
    )
    msg += conditions

    return msg


@webhook_view("Sonarqube")
@typed_endpoint
def api_sonarqube_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    project = payload["project"]["name"].tame(check_string)
    branch = None
    if "branch" in payload:
        branch = payload["branch"].get("name").tame(check_none_or(check_string))
    if branch:
        topic_name = TOPIC_WITH_BRANCH.format(project, branch)
        message = render_body_with_branch(payload)
    else:
        topic_name = project
        message = render_body_without_branch(payload)
    check_send_webhook_message(request, user_profile, topic_name, message)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: error.json]---
Location: zulip-main/zerver/webhooks/sonarqube/fixtures/error.json

```json
{
    "serverUrl": "http://localhost:9000",
    "taskId": "AXgTFfXRZCzhMRNj54bo",
    "status": "SUCCESS",
    "analysedAt": "2021-03-08T18:25:04+0000",
    "changedAt": "2021-03-08T18:25:04+0000",
    "project": {
      "key": "test-sonar",
      "name": "test-sonar",
      "url": "http://localhost:9000/dashboard?id=test-sonar"
    },
    "branch": {
      "name": "master",
      "type": "BRANCH",
      "isMain": true,
      "url": "http://localhost:9000/dashboard?id=test-sonar"
    },
    "qualityGate": {
      "name": "Sonar way",
      "status": "ERROR",
      "conditions": [
        {
            "metric": "maintainability_rating",
            "operator": "GREATER_THAN",
            "value": "1",
            "status": "OK",
            "errorThreshold": "1"
          },
          {
            "metric": "coverage",
            "operator": "LESS_THAN",
            "value": "0.0",
            "status": "ERROR",
            "errorThreshold": "80"
          },
          {
            "metric": "duplicated_lines_density",
            "operator": "GREATER_THAN",
            "value": "89.39828080229226",
            "status": "ERROR",
            "errorThreshold": "3"
          }
      ]
    },
    "properties": {}
  }
```

--------------------------------------------------------------------------------

---[FILE: error_no_branch.json]---
Location: zulip-main/zerver/webhooks/sonarqube/fixtures/error_no_branch.json

```json
{
    "serverUrl": "http://localhost:9000",
    "taskId": "AXgTFfXRZCzhMRNj54bo",
    "status": "SUCCESS",
    "analysedAt": "2021-03-08T18:25:04+0000",
    "changedAt": "2021-03-08T18:25:04+0000",
    "project": {
      "key": "test-sonar",
      "name": "test-sonar",
      "url": "http://localhost:9000/dashboard?id=test-sonar"
    },
    "qualityGate": {
      "name": "Sonar way",
      "status": "ERROR",
      "conditions": [
        {
            "metric": "maintainability_rating",
            "operator": "GREATER_THAN",
            "value": "1",
            "status": "OK",
            "errorThreshold": "1"
          },
          {
            "metric": "coverage",
            "operator": "LESS_THAN",
            "value": "0.0",
            "status": "ERROR",
            "errorThreshold": "80"
          },
          {
            "metric": "duplicated_lines_density",
            "operator": "GREATER_THAN",
            "value": "89.39828080229226",
            "status": "ERROR",
            "errorThreshold": "3"
          }
      ]
    },
    "properties": {}
  }
```

--------------------------------------------------------------------------------

---[FILE: error_no_value.json]---
Location: zulip-main/zerver/webhooks/sonarqube/fixtures/error_no_value.json

```json
{
    "serverUrl": "http://localhost:9000",
    "taskId": "AXgTFfXRZCzhMRNj54bo",
    "status": "SUCCESS",
    "analysedAt": "2021-03-08T18:25:04+0000",
    "changedAt": "2021-03-08T18:25:04+0000",
    "project": {
      "key": "test-sonar",
      "name": "test-sonar",
      "url": "http://localhost:9000/dashboard?id=test-sonar"
    },
    "branch": {
      "name": "master",
      "type": "BRANCH",
      "isMain": true,
      "url": "http://localhost:9000/dashboard?id=test-sonar"
    },
    "qualityGate": {
      "name": "Sonar way",
      "status": "ERROR",
      "conditions": [
        {
            "metric": "maintainability_rating",
            "operator": "GREATER_THAN",
            "value": "1",
            "status": "OK",
            "errorThreshold": "1"
          },
          {
            "metric": "coverage",
            "operator": "LESS_THAN",
            "value": "0.0",
            "status": "ERROR",
            "errorThreshold": "80"
          },
          {
            "metric": "duplicated_lines_density",
            "operator": "GREATER_THAN",
            "status": "ERROR",
            "errorThreshold": "3"
          }
      ]
    },
    "properties": {}
  }
```

--------------------------------------------------------------------------------

---[FILE: success.json]---
Location: zulip-main/zerver/webhooks/sonarqube/fixtures/success.json

```json
{
  "serverUrl": "http://localhost:9000",
  "taskId": "AXgTFfXRZCzhMRNj54bo",
  "status": "SUCCESS",
  "analysedAt": "2021-03-08T18:25:04+0000",
  "changedAt": "2021-03-08T18:25:04+0000",
  "project": {
    "key": "test-sonar",
    "name": "test-sonar",
    "url": "http://localhost:9000/dashboard?id=test-sonar"
  },
  "branch": {
    "name": "master",
    "type": "BRANCH",
    "isMain": true,
    "url": "http://localhost:9000/dashboard?id=test-sonar"
  },
  "qualityGate": {
    "name": "Sonar way",
    "status": "OK",
    "conditions": [
      {
        "metric": "new_reliability_rating",
        "operator": "GREATER_THAN",
        "value": "1",
        "status": "OK",
        "errorThreshold": "1"
      },
      {
        "metric": "new_security_rating",
        "operator": "GREATER_THAN",
        "value": "1",
        "status": "OK",
        "errorThreshold": "1"
      },
      {
        "metric": "new_maintainability_rating",
        "operator": "GREATER_THAN",
        "value": "1",
        "status": "OK",
        "errorThreshold": "1"
      },
      {
        "metric": "new_coverage",
        "operator": "LESS_THAN",
        "status": "NO_VALUE",
        "errorThreshold": "80"
      },
      {
        "metric": "new_duplicated_lines_density",
        "operator": "GREATER_THAN",
        "status": "NO_VALUE",
        "errorThreshold": "3"
      },
      {
        "metric": "new_security_hotspots_reviewed",
        "operator": "LESS_THAN",
        "status": "NO_VALUE",
        "errorThreshold": "100"
      }
    ]
  },
  "properties": {}
}
```

--------------------------------------------------------------------------------

---[FILE: success_no_branch.json]---
Location: zulip-main/zerver/webhooks/sonarqube/fixtures/success_no_branch.json

```json
{
    "serverUrl": "http://localhost:9000",
    "taskId": "AXgTFfXRZCzhMRNj54bo",
    "status": "SUCCESS",
    "analysedAt": "2021-03-08T18:25:04+0000",
    "changedAt": "2021-03-08T18:25:04+0000",
    "project": {
      "key": "test-sonar",
      "name": "test-sonar",
      "url": "http://localhost:9000/dashboard?id=test-sonar"
    },
    "qualityGate": {
      "name": "Sonar way",
      "status": "OK",
      "conditions": [
        {
          "metric": "new_reliability_rating",
          "operator": "GREATER_THAN",
          "value": "1",
          "status": "OK",
          "errorThreshold": "1"
        },
        {
          "metric": "new_security_rating",
          "operator": "GREATER_THAN",
          "value": "1",
          "status": "OK",
          "errorThreshold": "1"
        },
        {
          "metric": "new_maintainability_rating",
          "operator": "GREATER_THAN",
          "value": "1",
          "status": "OK",
          "errorThreshold": "1"
        },
        {
          "metric": "new_coverage",
          "operator": "LESS_THAN",
          "status": "NO_VALUE",
          "errorThreshold": "80"
        },
        {
          "metric": "new_duplicated_lines_density",
          "operator": "GREATER_THAN",
          "status": "NO_VALUE",
          "errorThreshold": "3"
        },
        {
          "metric": "new_security_hotspots_reviewed",
          "operator": "LESS_THAN",
          "status": "NO_VALUE",
          "errorThreshold": "100"
        }
      ]
    },
    "properties": {}
  }
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/sonarr/doc.md

```text
# Zulip Sonarr integration

Receive Sonarr notifications in Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to your Sonarr dashboard. Open **Settings**, and select **Connect**.
    Click the plus (**+**) icon.

1. Select **Webhook**, and set the name of the webhook to any name of your
   choice, such as `Zulip`. Select the scenarios you would like to receive
   notifications for. You may also enter tags if you would like to be
   notified about series with specific tags.

1. Set **URL** to the URL generated above, and set **Method** to **POST**.
   Leave the **Username** and **Password** fields blank. Click **Save**,
   which will send a test message to Zulip.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/sonarr/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/sonarr/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class SonarrHookTests(WebhookTestCase):
    CHANNEL_NAME = "sonarr"
    URL_TEMPLATE = "/api/v1/external/sonarr?api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "sonarr"

    def test_sonarr_test(self) -> None:
        """
        Tests if sonarr test payload is handled correctly
        """
        expected_topic_name = "Sonarr - Test"
        expected_message = "Sonarr webhook has been successfully configured."
        self.check_webhook("sonarr_test", expected_topic_name, expected_message)

    def test_sonarr_series_deleted(self) -> None:
        """
        Tests if sonarr series deleted payload is handled correctly
        """
        expected_topic_name = "Breaking Bad"
        expected_message = "Breaking Bad has been deleted."
        self.check_webhook("sonarr_series_deleted", expected_topic_name, expected_message)

    def test_sonarr_health_check_warning(self) -> None:
        """
        Tests if sonarr health check warning payload is handled correctly
        """
        expected_topic_name = "Health warning"
        expected_message = "Indexers unavailable due to failures for more than 6 hours: Academic Torrents - Jackett, ACG - Jackett, KickAssTorrent - Jackett, EXT Torrents - Jackett, Extra Torrents - Jackett, SkyTorrents - Jackett, iDope - Jackett."
        self.check_webhook("sonarr_health_check_warning", expected_topic_name, expected_message)

    def test_sonarr_health_check_error(self) -> None:
        """
        Tests if sonarr health check error payload is handled correctly
        """
        expected_topic_name = "Health error"
        expected_message = "No indexers available with RSS sync enabled, Sonarr will not grab new releases automatically."
        self.check_webhook("sonarr_health_check_error", expected_topic_name, expected_message)

    def test_sonarr_episodes_renamed(self) -> None:
        """
        Tests if sonarr episodes renamed payload is handled correctly
        """
        expected_topic_name = "The L Word"
        expected_message = "The L Word episodes have been renamed."
        self.check_webhook("sonarr_episodes_renamed", expected_topic_name, expected_message)

    def test_sonarr_episode_imported(self) -> None:
        """
        Tests if sonarr episode imported payload is handled correctly
        """
        expected_topic_name = "Grey's Anatomy"
        expected_message = "Grey's Anatomy - 17x9 - In My Life has been imported."
        self.check_webhook("sonarr_episode_imported", expected_topic_name, expected_message)

    def test_sonarr_episode_imported_upgrade(self) -> None:
        """
        Tests if sonarr episode imported upgrade payload is handled correctly
        """
        expected_topic_name = "NCIS"
        expected_message = "NCIS - 18x10 - Watchdog has been upgraded from SDTV to HDTV-720p."
        self.check_webhook("sonarr_episode_imported_upgrade", expected_topic_name, expected_message)

    def test_sonarr_episode_grabbed(self) -> None:
        """
        Tests if sonarr episode grabbed payload is handled correctly
        """
        expected_topic_name = "NCIS"
        expected_message = "NCIS - 18x10 - Watchdog has been grabbed."
        self.check_webhook("sonarr_episode_grabbed", expected_topic_name, expected_message)

    def test_sonarr_episode_deleted(self) -> None:
        """
        Tests if sonarr episode deleted payload is handled correctly
        """
        expected_topic_name = "Breaking Bad"
        expected_message = "Breaking Bad - 1x1 - Pilot has been deleted."
        self.check_webhook("sonarr_episode_deleted", expected_topic_name, expected_message)

    def test_sonarr_episode_deleted_upgrade(self) -> None:
        """
        Tests if sonarr episode deleted upgrade payload is handled correctly
        """
        expected_topic_name = "S.W.A.T. (2017)"
        expected_message = (
            "S.W.A.T. (2017) - 4x10 - Buried has been deleted due to quality upgrade."
        )
        self.check_webhook("sonarr_episode_deleted_upgrade", expected_topic_name, expected_message)
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/sonarr/view.py
Signals: Django

```python
from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.exceptions import UnsupportedWebhookEventTypeError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_bool, check_int, check_string
from zerver.lib.webhooks.common import check_send_webhook_message, get_setup_webhook_message
from zerver.models import UserProfile

SONARR_TOPIC_TEMPLATE = "{series_title}".strip()
SONARR_TOPIC_TEMPLATE_TEST = "Sonarr - Test".strip()
SONARR_TOPIC_TEMPLATE_HEALTH_CHECK = "Health {level}".strip()

SONARR_MESSAGE_TEMPLATE_SERIES_DELETED = "{series_title} has been deleted.".strip()
SONARR_MESSAGE_TEMPLATE_HEALTH_CHECK = "{message}.".strip()
SONARR_MESSAGE_TEMPLATE_EPISODES_RENAMED = "{series_title} episodes have been renamed.".strip()
SONARR_MESSAGE_TEMPLATE_EPISODE_IMPORTED = (
    "{series_title} - {series_number}x{episode_number} - {episode_name} has been imported.".strip()
)
SONARR_MESSAGE_TEMPLATE_EPISODE_IMPORTED_UPGRADE = "{series_title} - {series_number}x{episode_number} - {episode_name} has been upgraded from {old_quality} to {new_quality}.".strip()
SONARR_MESSAGE_TEMPLATE_EPISODE_GRABBED = (
    "{series_title} - {series_number}x{episode_number} - {episode_name} has been grabbed.".strip()
)
SONARR_MESSAGE_TEMPLATE_EPISODE_DELETED = (
    "{series_title} - {series_number}x{episode_number} - {episode_name} has been deleted.".strip()
)
SONARR_MESSAGE_TEMPLATE_EPISODE_DELETED_UPGRADE = "{series_title} - {series_number}x{episode_number} - {episode_name} has been deleted due to quality upgrade.".strip()

ALL_EVENT_TYPES = [
    "Grab",
    "EpisodeFileDelete",
    "Test",
    "Download",
    "SeriesDelete",
    "Health",
    "Rename",
]


@webhook_view("Sonarr", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_sonarr_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    body = get_body_for_http_request(payload)
    topic_name = get_topic_for_http_request(payload)

    check_send_webhook_message(
        request, user_profile, topic_name, body, payload["eventType"].tame(check_string)
    )
    return json_success(request)


def get_topic_for_http_request(payload: WildValue) -> str:
    event_type = payload["eventType"].tame(check_string)
    if event_type == "Test":
        topic_name = SONARR_TOPIC_TEMPLATE_TEST
    elif event_type == "Health":
        topic_name = SONARR_TOPIC_TEMPLATE_HEALTH_CHECK.format(
            level=payload["level"].tame(check_string)
        )
    else:
        topic_name = SONARR_TOPIC_TEMPLATE.format(
            series_title=payload["series"]["title"].tame(check_string)
        )

    return topic_name


def get_body_for_health_check_event(payload: WildValue) -> str:
    return SONARR_MESSAGE_TEMPLATE_HEALTH_CHECK.format(
        message=payload["message"].tame(check_string)
    )


def get_body_for_episodes_renamed_event(payload: WildValue) -> str:
    return SONARR_MESSAGE_TEMPLATE_EPISODES_RENAMED.format(
        series_title=payload["series"]["title"].tame(check_string)
    )


def get_body_for_series_deleted_event(payload: WildValue) -> str:
    return SONARR_MESSAGE_TEMPLATE_SERIES_DELETED.format(
        series_title=payload["series"]["title"].tame(check_string)
    )


def get_body_for_episode_imported_upgrade_event(payload: WildValue) -> str:
    data = {
        "series_title": payload["series"]["title"].tame(check_string),
        "series_number": payload["episodes"][0]["seasonNumber"].tame(check_int),
        "episode_number": payload["episodes"][0]["episodeNumber"].tame(check_int),
        "episode_name": payload["episodes"][0]["title"].tame(check_string),
        "new_quality": payload["episodeFile"]["quality"].tame(check_string),
        "old_quality": payload["deletedFiles"][0]["quality"].tame(check_string),
    }

    return SONARR_MESSAGE_TEMPLATE_EPISODE_IMPORTED_UPGRADE.format(**data)


def get_body_for_episode_imported_event(payload: WildValue) -> str:
    data = {
        "series_title": payload["series"]["title"].tame(check_string),
        "series_number": payload["episodes"][0]["seasonNumber"].tame(check_int),
        "episode_number": payload["episodes"][0]["episodeNumber"].tame(check_int),
        "episode_name": payload["episodes"][0]["title"].tame(check_string),
    }

    return SONARR_MESSAGE_TEMPLATE_EPISODE_IMPORTED.format(**data)


def get_body_for_episode_grabbed_event(payload: WildValue) -> str:
    data = {
        "series_title": payload["series"]["title"].tame(check_string),
        "series_number": payload["episodes"][0]["seasonNumber"].tame(check_int),
        "episode_number": payload["episodes"][0]["episodeNumber"].tame(check_int),
        "episode_name": payload["episodes"][0]["title"].tame(check_string),
    }

    return SONARR_MESSAGE_TEMPLATE_EPISODE_GRABBED.format(**data)


def get_body_for_episode_deleted_upgrade_event(payload: WildValue) -> str:
    data = {
        "series_title": payload["series"]["title"].tame(check_string),
        "series_number": payload["episodes"][0]["seasonNumber"].tame(check_int),
        "episode_number": payload["episodes"][0]["episodeNumber"].tame(check_int),
        "episode_name": payload["episodes"][0]["title"].tame(check_string),
    }

    return SONARR_MESSAGE_TEMPLATE_EPISODE_DELETED_UPGRADE.format(**data)


def get_body_for_episode_deleted_event(payload: WildValue) -> str:
    data = {
        "series_title": payload["series"]["title"].tame(check_string),
        "series_number": payload["episodes"][0]["seasonNumber"].tame(check_int),
        "episode_number": payload["episodes"][0]["episodeNumber"].tame(check_int),
        "episode_name": payload["episodes"][0]["title"].tame(check_string),
    }

    return SONARR_MESSAGE_TEMPLATE_EPISODE_DELETED.format(**data)


def get_body_for_http_request(payload: WildValue) -> str:
    event_type = payload["eventType"].tame(check_string)

    if event_type == "Test":
        return get_setup_webhook_message("Sonarr")
    elif event_type == "Health":
        return get_body_for_health_check_event(payload)
    elif event_type == "Rename":
        return get_body_for_episodes_renamed_event(payload)
    elif event_type == "SeriesDelete":
        return get_body_for_series_deleted_event(payload)
    elif event_type == "Download" and "isUpgrade" in payload:
        if payload["isUpgrade"].tame(check_bool):
            return get_body_for_episode_imported_upgrade_event(payload)
        else:
            return get_body_for_episode_imported_event(payload)
    elif event_type == "Grab":
        return get_body_for_episode_grabbed_event(payload)
    elif event_type == "EpisodeFileDelete" and "deleteReason" in payload:
        if payload["deleteReason"].tame(check_string) == "upgrade":
            return get_body_for_episode_deleted_upgrade_event(payload)
        else:
            return get_body_for_episode_deleted_event(payload)
    else:
        raise UnsupportedWebhookEventTypeError(event_type)
```

--------------------------------------------------------------------------------

---[FILE: sonarr_episodes_renamed.json]---
Location: zulip-main/zerver/webhooks/sonarr/fixtures/sonarr_episodes_renamed.json

```json
{
    "series": {
      "id": 85,
      "title": "The L Word",
      "path": "/home36/adbtech/media/TV Shows/The L Word",
      "tvdbId": 72477,
      "tvMazeId": 823,
      "imdbId": "tt0330251",
      "type": "standard"
    },
    "eventType": "Rename"
}
```

--------------------------------------------------------------------------------

````
