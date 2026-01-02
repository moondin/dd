---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1243
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1243 of 1290)

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

---[FILE: failure.json]---
Location: zulip-main/zerver/webhooks/rundeck/fixtures/failure.json
Signals: Next.js

```json
{
  "trigger": "failure",
  "status": "failed",
  "executionId": 7,
  "execution": {
    "id": 7,
    "href": "http://localhost:4440/project/welcome-project-community/execution/show/7",
    "permalink": null,
    "status": "failed",
    "project": "welcome-project-community",
    "executionType": "user",
    "user": "admin",
    "date-started": {
      "unixtime": 1680848123396,
      "date": "2023-04-07T06:15:23Z"
    },
    "job": {
      "id": "a0296d93-4b10-48d7-8b7d-86ad3f603b85",
      "averageDuration": 2659,
      "name": "Global Log Filter Usage",
      "group": "Basic Examples/Basic Workflows",
      "project": "welcome-project-community",
      "description": "Global Log Filter basic example.\r\n\r\nGlobal Log Filter allows you to capture information from the whole job. This example shows how to capture env command data and use it later in the next step as [key-value](https://docs.rundeck.com/docs/manual/log-filters/key-value-data.html#key-value-data) data.\r\n\r\nMore information [here](https://docs.rundeck.com/docs/manual/log-filters/#log-filters).",
      "href": "http://localhost:4440/api/42/job/a0296d93-4b10-48d7-8b7d-86ad3f603b85",
      "permalink": "http://localhost:4440/project/welcome-project-community/job/show/a0296d93-4b10-48d7-8b7d-86ad3f603b85"
    },
    "description": "env ('Using env command we can extract a lot of keys/values :-)') [... 4 steps]",
    "argstring": null,
    "serverUUID": "a14bc3e6-75e8-4fe4-a90d-a16dcc976bf6"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: scheduled_start.json]---
Location: zulip-main/zerver/webhooks/rundeck/fixtures/scheduled_start.json

```json
{
    "trigger": "start",
    "status": "scheduled",
    "executionId": 12,
    "execution": {
      "id": 12,
      "href": "https://rundeck.com/project/myproject/execution/follow/12",
      "permalink": null,
      "status": "scheduled",
      "project": "myproject",
      "executionType": "user",
      "user": "guest",
      "job": {
        "id": "a0296d93-4b10-48d7-8b7d-86ad3f603b85",
        "name": "Global Log Filter Usage",
        "group": "Basic Examples/Basic Workflows",
        "project": "MyProject",
        "description": "Global Log Filter basic example. \n\nMore information: https://docs.rundeck.com/docs/manual/log-filters/#log-filters",
        "href": "https://rundeck.com/api/1/job/a0296d93-4b10-48d7-8b7d-86ad3f603b85",
        "permalink": "https://rundeck.com/project/myproject/job/show/a0296d93-4b10-48d7-8b7d-86ad3f603b85"
      }
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: start.json]---
Location: zulip-main/zerver/webhooks/rundeck/fixtures/start.json
Signals: Next.js

```json
{
  "trigger": "start",
  "status": "running",
  "executionId": 3,
  "execution": {
    "id": 3,
    "href": "http://localhost:4440/project/welcome-project-community/execution/show/3",
    "permalink": null,
    "status": "running",
    "project": "welcome-project-community",
    "executionType": "user",
    "user": "admin",
    "date-started": {
      "unixtime": 1680847933368,
      "date": "2023-04-07T06:12:13Z"
    },
    "job": {
      "id": "a0296d93-4b10-48d7-8b7d-86ad3f603b85",
      "averageDuration": 2354,
      "name": "Global Log Filter Usage",
      "group": "Basic Examples/Basic Workflows",
      "project": "welcome-project-community",
      "description": "Global Log Filter basic example.\r\n\r\nGlobal Log Filter allows you to capture information from the whole job. This example shows how to capture env command data and use it later in the next step as [key-value](https://docs.rundeck.com/docs/manual/log-filters/key-value-data.html#key-value-data) data.\r\n\r\nMore information [here](https://docs.rundeck.com/docs/manual/log-filters/#log-filters).",
      "href": "http://localhost:4440/api/42/job/a0296d93-4b10-48d7-8b7d-86ad3f603b85",
      "permalink": "http://localhost:4440/project/welcome-project-community/job/show/a0296d93-4b10-48d7-8b7d-86ad3f603b85"
    },
    "description": "env ('Using env command we can extract a lot of keys/values :-)') [... 2 steps]",
    "argstring": null,
    "serverUUID": "a14bc3e6-75e8-4fe4-a90d-a16dcc976bf6"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: success.json]---
Location: zulip-main/zerver/webhooks/rundeck/fixtures/success.json
Signals: Next.js

```json
{
  "trigger": "success",
  "status": "succeeded",
  "executionId": 3,
  "execution": {
    "id": 3,
    "href": "http://localhost:4440/project/welcome-project-community/execution/show/3",
    "permalink": null,
    "status": "succeeded",
    "project": "welcome-project-community",
    "executionType": "user",
    "user": "admin",
    "date-started": {
      "unixtime": 1680847933368,
      "date": "2023-04-07T06:12:13Z"
    },
    "job": {
      "id": "a0296d93-4b10-48d7-8b7d-86ad3f603b85",
      "averageDuration": 2354,
      "name": "Global Log Filter Usage",
      "group": "Basic Examples/Basic Workflows",
      "project": "welcome-project-community",
      "description": "Global Log Filter basic example.\r\n\r\nGlobal Log Filter allows you to capture information from the whole job. This example shows how to capture env command data and use it later in the next step as [key-value](https://docs.rundeck.com/docs/manual/log-filters/key-value-data.html#key-value-data) data.\r\n\r\nMore information [here](https://docs.rundeck.com/docs/manual/log-filters/#log-filters).",
      "href": "http://localhost:4440/api/42/job/a0296d93-4b10-48d7-8b7d-86ad3f603b85",
      "permalink": "http://localhost:4440/project/welcome-project-community/job/show/a0296d93-4b10-48d7-8b7d-86ad3f603b85"
    },
    "description": "env ('Using env command we can extract a lot of keys/values :-)') [... 2 steps]",
    "argstring": null,
    "serverUUID": "a14bc3e6-75e8-4fe4-a90d-a16dcc976bf6"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: test_failed_payload.json]---
Location: zulip-main/zerver/webhooks/runscope/fixtures/test_failed_payload.json

```json
{
   "finished_at":1514527802.89439,
   "variables":{

   },
   "agent":null,
   "team_id":"541c9408-2d06-4fa2-a453-eb595d32f20d",
   "result":"fail",
   "team_name":"Zulip",
   "started_at":1514527800.321657,
   "agent_expired":null,
   "environment_uuid":"e6a5d189-4179-4854-b3d2-43cc44028d41",
   "environment_name":"Test Settings",
   "test_run_url":"https://www.runscope.com/radar/pmsim6ddzfaw/2ed4267a-6338-44ff-9d5e-400465080ab5/results/20be1051-4f09-4261-8a6e-254d3413e6c0",
   "test_run_id":"20be1051-4f09-4261-8a6e-254d3413e6c0",
   "bucket_key":"pmsim6ddzfaw",
   "region_name":"US Virginia - None",
   "bucket_name":"Wooly Snow",
   "test_name":"Zulip Integration",
   "test_id":"2ed4267a-6338-44ff-9d5e-400465080ab5",
   "region":"us1",
   "initial_variables":{

   },
   "test_url":"https://www.runscope.com/radar/pmsim6ddzfaw/2ed4267a-6338-44ff-9d5e-400465080ab5",
   "trigger_url":"https://api.runscope.com/radar/26206a81-360f-476e-9c93-ffa8bc79f7e8/trigger",
   "requests":[
      {
         "response_size_bytes":-1,
         "url":"https://efuihaefiuhed.com",
         "variables":{
            "fail":0,
            "total":0,
            "pass":0
         },
         "step_type":"request",
         "note":"",
         "result":"fail",
         "response_status_code":"None",
         "scripts":{
            "fail":0,
            "total":0,
            "pass":0
         },
         "method":"GET",
         "response_time_ms":-1,
         "assertions":{
            "fail":1,
            "total":1,
            "pass":0
         }
      },
      {
         "response_size_bytes":194,
         "url":"https://yourapihere.com/",
         "variables":{
            "fail":0,
            "total":0,
            "pass":0
         },
         "step_type":"request",
         "note":"",
         "result":"pass",
         "response_status_code":"200",
         "scripts":{
            "fail":0,
            "total":0,
            "pass":0
         },
         "method":"GET",
         "response_time_ms":10,
         "assertions":{
            "fail":0,
            "total":1,
            "pass":1
         }
      }
   ]
}
```

--------------------------------------------------------------------------------

---[FILE: test_pass_payload.json]---
Location: zulip-main/zerver/webhooks/runscope/fixtures/test_pass_payload.json

```json
{
   "finished_at":1514527125.09317,
   "variables":{

   },
   "agent":null,
   "team_id":"541c9408-2d06-4fa2-a453-eb595d32f20d",
   "result":"pass",
   "team_name":"Zulip",
   "started_at":1514527121.931801,
   "agent_expired":null,
   "environment_uuid":"e6a5d189-4179-4854-b3d2-43cc44028d41",
   "environment_name":"Test Settings",
   "test_run_url":"https://www.runscope.com/radar/pmsim6ddzfaw/2ed4267a-6338-44ff-9d5e-400465080ab5/results/d6e39045-c571-4638-803f-ec196cef9790",
   "test_run_id":"d6e39045-c571-4638-803f-ec196cef9790",
   "bucket_key":"pmsim6ddzfaw",
   "region_name":"US Virginia - None",
   "bucket_name":"Wooly Snow",
   "test_name":"Zulip Integration",
   "test_id":"2ed4267a-6338-44ff-9d5e-400465080ab5",
   "region":"us1",
   "initial_variables":{

   },
   "test_url":"https://www.runscope.com/radar/pmsim6ddzfaw/2ed4267a-6338-44ff-9d5e-400465080ab5",
   "trigger_url":"https://api.runscope.com/radar/26206a81-360f-476e-9c93-ffa8bc79f7e8/trigger",
   "requests":[
      {
         "response_size_bytes":195,
         "url":"https://yourapihere.com/",
         "variables":{
            "fail":0,
            "total":0,
            "pass":0
         },
         "step_type":"request",
         "note":null,
         "result":"pass",
         "response_status_code":"200",
         "scripts":{
            "fail":0,
            "total":0,
            "pass":0
         },
         "method":"GET",
         "response_time_ms":11,
         "assertions":{
            "fail":0,
            "total":1,
            "pass":1
         }
      },
      {
         "response_size_bytes":196,
         "url":"https://yourapihere.com/",
         "variables":{
            "fail":0,
            "total":0,
            "pass":0
         },
         "step_type":"request",
         "note":"",
         "result":"pass",
         "response_status_code":"200",
         "scripts":{
            "fail":0,
            "total":0,
            "pass":0
         },
         "method":"GET",
         "response_time_ms":9,
         "assertions":{
            "fail":0,
            "total":1,
            "pass":1
         }
      }
   ]
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/semaphore/doc.md

```text
# Zulip Semaphore integration

Get Zulip notifications for your Semaphore builds!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. In the **Configuration** section of the sidebar in Semaphore, select
   **Notifications**. Click on **Create New Notification**.

1. Add a name for the notification, such as `Zulip`, and configure any
   rules you'd like for the notifications. Add the URL generated above
   to the Webhook **Endpoint** field, and click **Save Changes**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/semaphore/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/semaphore/tests.py

```python
from unittest.mock import patch

import orjson

from zerver.lib.test_classes import WebhookTestCase


class SemaphoreHookTests(WebhookTestCase):
    CHANNEL_NAME = "semaphore"
    URL_TEMPLATE = "/api/v1/external/semaphore?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "semaphore"

    # Messages are generated by Semaphore on git push. The subject lines below
    # contain information on the repo and branch, and the message has links and
    # details about the build, deploy, server, author, and commit

    # Tests for Semaphore Classic
    def test_semaphore_build(self) -> None:
        expected_topic_name = "knighthood/master"  # repo/branch
        expected_message = """
[Build 314](https://semaphoreci.com/donquixote/knighthood/branches/master/builds/314) passed:
* **Commit**: [a490b8d508e: Create user account for Rocinante](https://github.com/donquixote/knighthood/commit/a490b8d508ebbdab1d77a5c2aefa35ceb2d62daf)
* **Author**: don@lamancha.com
""".strip()
        self.check_webhook(
            "build",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_semaphore_deploy(self) -> None:
        expected_topic_name = "knighthood/master"
        expected_message = """
[Deploy 17](https://semaphoreci.com/donquixote/knighthood/servers/lamancha-271/deploys/17) of [build 314](https://semaphoreci.com/donquixote/knighthood/branches/master/builds/314) passed:
* **Commit**: [a490b8d508e: Create user account for Rocinante](https://github.com/donquixote/knighthood/commit/a490b8d508ebbdab1d77a5c2aefa35ceb2d62daf)
* **Author**: don@lamancha.com
* **Server**: lamancha-271
""".strip()
        self.check_webhook(
            "deploy",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    # Tests for Semaphore 2.0

    def test_semaphore2_push(self) -> None:
        expected_topic_name = "notifications/rw/webhook_impl"  # repo/branch
        expected_message = """
[Notifications](https://semaphore.semaphoreci.com/workflows/acabe58e-4bcc-4d39-be06-e98d71917703) pipeline **stopped**:
* **Commit**: [(2d9f5fcec1c)](https://github.com/renderedtext/notifications/commit/2d9f5fcec1ca7c68fa7bd44dd58ec4ff65814563) Implement webhooks for SemaphoreCI
* **Branch**: rw/webhook_impl
* **Author**: [radwo](https://github.com/radwo)
""".strip()
        self.check_webhook(
            "push", expected_topic_name, expected_message, content_type="application/json"
        )

    def test_semaphore2_push_non_gh_repo(self) -> None:
        expected_topic_name = "notifications/rw/webhook_impl"  # repo/branch
        expected_message = """
[Notifications](https://semaphore.semaphoreci.com/workflows/acabe58e-4bcc-4d39-be06-e98d71917703) pipeline **stopped**:
* **Commit**: (2d9f5fcec1c) Implement webhooks for SemaphoreCI
* **Branch**: rw/webhook_impl
* **Author**: radwo
""".strip()
        with patch("zerver.webhooks.semaphore.view.is_github_repo", return_value=False):
            self.check_webhook(
                "push", expected_topic_name, expected_message, content_type="application/json"
            )

    def test_semaphore_pull_request(self) -> None:
        expected_topic_name = "notifications/test-notifications"
        expected_message = """
[Notifications](https://semaphore.semaphoreci.com/workflows/84383f37-d025-4811-b719-61c6acc92a1e) pipeline **failed**:
* **Pull request**: [Testing PR notifications](https://github.com/renderedtext/notifications/pull/3)
* **Branch**: test-notifications
* **Author**: [radwo](https://github.com/radwo)
""".strip()
        self.check_webhook(
            "pull_request", expected_topic_name, expected_message, content_type="application/json"
        )

    def test_semaphore_pull_request_non_gh_repo(self) -> None:
        expected_topic_name = "notifications/test-notifications"
        expected_message = """
[Notifications](https://semaphore.semaphoreci.com/workflows/84383f37-d025-4811-b719-61c6acc92a1e) pipeline **failed**:
* **Pull request**: Testing PR notifications (#3)
* **Branch**: test-notifications
* **Author**: radwo
""".strip()
        with patch("zerver.webhooks.semaphore.view.is_github_repo", return_value=False):
            self.check_webhook(
                "pull_request",
                expected_topic_name,
                expected_message,
                content_type="application/json",
            )

    def test_semaphore_tag(self) -> None:
        expected_topic_name = "notifications"
        expected_message = """
[Notifications](https://semaphore.semaphoreci.com/workflows/a8704319-2422-4828-9b11-6b2afa3554e6) pipeline **stopped**:
* **Tag**: [v1.0.1](https://github.com/renderedtext/notifications/tree/v1.0.1)
* **Author**: [radwo](https://github.com/radwo)
""".strip()
        self.check_webhook(
            "tag", expected_topic_name, expected_message, content_type="application/json"
        )

    def test_semaphore_tag_non_gh_repo(self) -> None:
        expected_topic_name = "notifications"
        expected_message = """
[Notifications](https://semaphore.semaphoreci.com/workflows/a8704319-2422-4828-9b11-6b2afa3554e6) pipeline **stopped**:
* **Tag**: v1.0.1
* **Author**: radwo
""".strip()
        with patch("zerver.webhooks.semaphore.view.is_github_repo", return_value=False):
            self.check_webhook(
                "tag", expected_topic_name, expected_message, content_type="application/json"
            )

    def test_semaphore_unknown(self) -> None:
        expected_topic_name = "knighthood/master"
        expected_message = "unknown: passed"
        self.check_webhook(
            "unknown",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_semaphore_unknown_event(self) -> None:
        expected_topic_name = "notifications"
        expected_message = """
[Notifications](https://semaphore.semaphoreci.com/workflows/a8704319-2422-4828-9b11-6b2afa3554e6) pipeline **stopped** for unknown event
""".strip()
        with patch(
            "zerver.webhooks.semaphore.tests.SemaphoreHookTests.get_body", self.get_unknown_event
        ):
            self.check_webhook(
                "tag", expected_topic_name, expected_message, content_type="application/json"
            )

    def get_unknown_event(self, fixture_name: str) -> str:
        """Return modified payload with revision.reference_type changed"""
        fixture_data = orjson.loads(
            self.webhook_fixture_data("semaphore", fixture_name, file_type="json")
        )
        fixture_data["revision"]["reference_type"] = "unknown"
        return fixture_data
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/semaphore/view.py
Signals: Django

```python
# Webhooks for external integrations.
from urllib.parse import urlsplit

from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_int, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.lib.webhooks.git import get_short_sha
from zerver.models import UserProfile

# Semaphore Classic templates

BUILD_TEMPLATE = """
[Build {build_number}]({build_url}) {status}:
* **Commit**: [{commit_hash}: {commit_message}]({commit_url})
* **Author**: {email}
""".strip()

DEPLOY_TEMPLATE = """
[Deploy {deploy_number}]({deploy_url}) of [build {build_number}]({build_url}) {status}:
* **Commit**: [{commit_hash}: {commit_message}]({commit_url})
* **Author**: {email}
* **Server**: {server_name}
""".strip()

# Semaphore 2.0 templates

# Currently, Semaphore 2.0 only supports GitHub, while Semaphore Classic
# supports Bitbucket too. The payload does not have URLs for commits, tags,
# pull requests, etc. So, we use separate templates for GitHub and construct
# the URLs ourselves. For any other repository hosting services we use
# templates that don't have any links in them.

GH_PUSH_TEMPLATE = """
[{pipeline_name}]({workflow_url}) pipeline **{pipeline_result}**:
* **Commit**: [({commit_hash})]({commit_url}) {commit_message}
* **Branch**: {branch_name}
* **Author**: [{author_name}]({author_url})
""".strip()

PUSH_TEMPLATE = """
[{pipeline_name}]({workflow_url}) pipeline **{pipeline_result}**:
* **Commit**: ({commit_hash}) {commit_message}
* **Branch**: {branch_name}
* **Author**: {author_name}
""".strip()

GH_PULL_REQUEST_TEMPLATE = """
[{pipeline_name}]({workflow_url}) pipeline **{pipeline_result}**:
* **Pull request**: [{pull_request_title}]({pull_request_url})
* **Branch**: {branch_name}
* **Author**: [{author_name}]({author_url})
""".strip()

PULL_REQUEST_TEMPLATE = """
[{pipeline_name}]({workflow_url}) pipeline **{pipeline_result}**:
* **Pull request**: {pull_request_title} (#{pull_request_number})
* **Branch**: {branch_name}
* **Author**: {author_name}
""".strip()

GH_TAG_TEMPLATE = """
[{pipeline_name}]({workflow_url}) pipeline **{pipeline_result}**:
* **Tag**: [{tag_name}]({tag_url})
* **Author**: [{author_name}]({author_url})
""".strip()

TAG_TEMPLATE = """
[{pipeline_name}]({workflow_url}) pipeline **{pipeline_result}**:
* **Tag**: {tag_name}
* **Author**: {author_name}
""".strip()

DEFAULT_TEMPLATE = """
[{pipeline_name}]({workflow_url}) pipeline **{pipeline_result}** for {event_name} event
""".strip()

TOPIC_TEMPLATE = "{project}/{branch}"

GITHUB_URL_TEMPLATES = {
    "commit": "{repo_url}/commit/{commit_id}",
    "pull_request": "{repo_url}/pull/{pr_number}",
    "tag": "{repo_url}/tree/{tag_name}",
    "user": "https://github.com/{username}",
}

ALL_EVENT_TYPES = ["build", "tag", "unknown", "branch", "deploy", "pull_request"]


@webhook_view("Semaphore", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_semaphore_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    content, project_name, branch_name, event = (
        semaphore_classic(payload) if "event" in payload else semaphore_2(payload)
    )
    topic_name = (
        TOPIC_TEMPLATE.format(project=project_name, branch=branch_name)
        if branch_name
        else project_name
    )
    check_send_webhook_message(request, user_profile, topic_name, content, event)
    return json_success(request)


def semaphore_classic(payload: WildValue) -> tuple[str, str, str, str]:
    # semaphore only gives the last commit, even if there were multiple commits
    # since the last build
    branch_name = payload["branch_name"].tame(check_string)
    project_name = payload["project_name"].tame(check_string)
    result = payload["result"].tame(check_string)
    event = payload["event"].tame(check_string)
    commit_id = payload["commit"]["id"].tame(check_string)
    commit_url = payload["commit"]["url"].tame(check_string)
    author_email = payload["commit"]["author_email"].tame(check_string)
    message = summary_line(payload["commit"]["message"].tame(check_string))

    if event == "build":
        build_url = payload["build_url"].tame(check_string)
        build_number = payload["build_number"].tame(check_int)
        content = BUILD_TEMPLATE.format(
            build_number=build_number,
            build_url=build_url,
            status=result,
            commit_hash=get_short_sha(commit_id),
            commit_message=message,
            commit_url=commit_url,
            email=author_email,
        )

    elif event == "deploy":
        build_url = payload["build_html_url"].tame(check_string)
        build_number = payload["build_number"].tame(check_int)
        deploy_url = payload["html_url"].tame(check_string)
        deploy_number = payload["number"].tame(check_int)
        server_name = payload["server_name"].tame(check_string)
        content = DEPLOY_TEMPLATE.format(
            deploy_number=deploy_number,
            deploy_url=deploy_url,
            build_number=build_number,
            build_url=build_url,
            status=result,
            commit_hash=get_short_sha(commit_id),
            commit_message=message,
            commit_url=commit_url,
            email=author_email,
            server_name=server_name,
        )

    else:  # should never get here
        content = f"{event}: {result}"

    return content, project_name, branch_name, event


def semaphore_2(payload: WildValue) -> tuple[str, str, str | None, str]:
    repo_url = payload["repository"]["url"].tame(check_string)
    project_name = payload["project"]["name"].tame(check_string)
    organization_name = payload["organization"]["name"].tame(check_string)
    author_name = payload["revision"]["sender"]["login"].tame(check_string)
    workflow_id = payload["workflow"]["id"].tame(check_string)
    context = dict(
        author_name=author_name,
        author_url=GITHUB_URL_TEMPLATES["user"].format(repo_url=repo_url, username=author_name),
        pipeline_name=payload["pipeline"]["name"].tame(check_string),
        pipeline_result=payload["pipeline"]["result"].tame(check_string),
        workflow_url=f"https://{organization_name}.semaphoreci.com/workflows/{workflow_id}",
    )
    event = payload["revision"]["reference_type"].tame(check_string)

    if event == "branch":  # push event
        commit_id = payload["revision"]["commit_sha"].tame(check_string)
        branch_name = payload["revision"]["branch"]["name"].tame(check_string)
        context.update(
            branch_name=branch_name,
            commit_id=commit_id,
            commit_hash=get_short_sha(commit_id),
            commit_message=summary_line(payload["revision"]["commit_message"].tame(check_string)),
            commit_url=GITHUB_URL_TEMPLATES["commit"].format(
                repo_url=repo_url, commit_id=commit_id
            ),
        )
        template = GH_PUSH_TEMPLATE if is_github_repo(repo_url) else PUSH_TEMPLATE
        content = template.format(**context)
    elif event == "pull_request":
        pull_request = payload["revision"]["pull_request"]
        branch_name = pull_request["branch_name"].tame(check_string)
        pull_request_title = pull_request["name"].tame(check_string)
        pull_request_number = pull_request["number"].tame(check_string)
        pull_request_url = GITHUB_URL_TEMPLATES["pull_request"].format(
            repo_url=repo_url, pr_number=pull_request_number
        )
        context.update(
            branch_name=branch_name,
            pull_request_title=pull_request_title,
            pull_request_url=pull_request_url,
            pull_request_number=pull_request_number,
        )
        template = GH_PULL_REQUEST_TEMPLATE if is_github_repo(repo_url) else PULL_REQUEST_TEMPLATE
        content = template.format(**context)
    elif event == "tag":
        branch_name = ""
        tag_name = payload["revision"]["tag"]["name"].tame(check_string)
        tag_url = GITHUB_URL_TEMPLATES["tag"].format(repo_url=repo_url, tag_name=tag_name)
        context.update(
            tag_name=tag_name,
            tag_url=tag_url,
        )
        template = GH_TAG_TEMPLATE if is_github_repo(repo_url) else TAG_TEMPLATE
        content = template.format(**context)
    else:  # should never get here: unknown event
        branch_name = ""
        context.update(event_name=event)
        content = DEFAULT_TEMPLATE.format(**context)
    return content, project_name, branch_name, event


def is_github_repo(repo_url: str) -> bool:
    return urlsplit(repo_url).hostname == "github.com"


def summary_line(message: str) -> str:
    return message.splitlines()[0]
```

--------------------------------------------------------------------------------

---[FILE: build.json]---
Location: zulip-main/zerver/webhooks/semaphore/fixtures/build.json

```json
{
   "branch_name":"master",
   "branch_url":"https://semaphoreci.com/rishig/semaphore-test/branches/master",
   "project_name":"knighthood",
   "project_hash_id":"dff749fa-6acf-467c-85c9-119d63c8af4b",
   "build_url":"https://semaphoreci.com/donquixote/knighthood/branches/master/builds/314",
   "build_number":314,
   "result":"passed",
   "event":"build",
   "started_at":"1605-01-16T00:01:58Z",
   "finished_at":"1605-01-16T00:02:09Z",
   "commit":{
      "id":"a490b8d508ebbdab1d77a5c2aefa35ceb2d62daf",
      "url":"https://github.com/donquixote/knighthood/commit/a490b8d508ebbdab1d77a5c2aefa35ceb2d62daf",
      "author_name":"Don Quixote",
      "author_email":"don@lamancha.com",
      "message":"Create user account for Rocinante",
      "timestamp":"1605-01-16T00:01:41Z"
   }
}
```

--------------------------------------------------------------------------------

---[FILE: deploy.json]---
Location: zulip-main/zerver/webhooks/semaphore/fixtures/deploy.json

```json
{
   "project_name":"knighthood",
   "project_hash_id":"dff749fa-6acf-467c-85c9-119d63c8af4b",
   "server_name":"lamancha-271",
   "number":17,
   "event":"deploy",
   "result":"passed",
   "created_at":"2016-06-17T00:59:09Z",
   "updated_at":"2016-06-17T01:00:11Z",
   "started_at":"2016-06-17T00:59:11Z",
   "finished_at":"2016-06-17T00:59:21Z",
   "html_url":"https://semaphoreci.com/donquixote/knighthood/servers/lamancha-271/deploys/17",
   "build_number":314,
   "build_html_url":"https://semaphoreci.com/donquixote/knighthood/branches/master/builds/314",
   "branch_name":"master",
   "branch_html_url":"https://semaphoreci.com/donquixote/knighthood/branches/master",
   "commit":{
      "id":"a490b8d508ebbdab1d77a5c2aefa35ceb2d62daf",
      "url":"https://github.com/donquixote/knighthood/commit/a490b8d508ebbdab1d77a5c2aefa35ceb2d62daf",
      "author_name":"Don Quixote",
      "author_email":"don@lamancha.com",
      "message":"Create user account for Rocinante\n\nThe user is an admin user",
      "timestamp":"2016-06-16T18:29:08Z"
   }
}
```

--------------------------------------------------------------------------------

---[FILE: pull_request.json]---
Location: zulip-main/zerver/webhooks/semaphore/fixtures/pull_request.json

```json
{
  "workflow": {
    "initial_pipeline_id": "17e8dfaf-6649-413d-b611-4a888aebc29e",
    "id": "84383f37-d025-4811-b719-61c6acc92a1e",
    "created_at": "2020-04-08T12:54:46Z"
  },
  "version": "1.0.0",
  "revision": {
    "tag": null,
    "sender": {
      "login": "radwo",
      "email": "",
      "avatar_url": "https://avatars0.githubusercontent.com/u/315678?v=4"
    },
    "reference_type": "pull_request",
    "reference": "refs/semaphoreci/0387f435823058fdc05f3ef86fb9f28b885ccf7f",
    "pull_request": {
      "number": "3",
      "name": "Testing PR notifications",
      "head_sha": "6fd84f4c2aecae7b1e6ce516b634c220d4a3e3e4",
      "head_repo_slug": "renderedtext/notifications",
      "commit_range": "8d31831ff2a512e23a8042a76cf39246908256a1...6fd84f4c2aecae7b1e6ce516b634c220d4a3e3e4",
      "branch_name": "test-notifications"
    },
    "commit_sha": "0387f435823058fdc05f3ef86fb9f28b885ccf7f",
    "commit_message": "Add docs for webhook notifications",
    "branch": null
  },
  "repository": {
    "url": "https://github.com/renderedtext/notifications",
    "slug": "renderedtext/notifications"
  },
  "project": {
    "name": "notifications",
    "id": "7379341d-a22a-475f-b0c9-4553b06a926c"
  },
  "pipeline": {
    "yaml_file_name": "semaphore.yml",
    "working_directory": ".semaphore",
    "stopping_at": "1970-01-01T00:00:00Z",
    "state": "done",
    "running_at": "2020-04-08T12:54:46Z",
    "result_reason": "test",
    "result": "failed",
    "queuing_at": "2020-04-08T12:54:46Z",
    "pending_at": "2020-04-08T12:54:46Z",
    "name": "Notifications",
    "id": "17e8dfaf-6649-413d-b611-4a888aebc29e",
    "error_description": "",
    "done_at": "2020-04-08T12:54:54Z",
    "created_at": "2020-04-08T12:54:46Z"
  },
  "organization": {
    "name": "semaphore",
    "id": "0172946d-5523-48d8-912d-e13f01189e20"
  },
  "blocks": [
    {
      "state": "done",
      "result_reason": "test",
      "result": "failed",
      "name": "Test",
      "jobs": [
        {
          "status": "finished",
          "result": "failed",
          "name": "pytest",
          "index": 0,
          "id": "570f998f-4f20-4529-a1b6-afeba9c8f5bd"
        }
      ]
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: push.json]---
Location: zulip-main/zerver/webhooks/semaphore/fixtures/push.json

```json
{
    "version": "1.0.0",
    "organization": {
        "name": "semaphore",
        "id": "36360e31-fee6-42b2-9f6c-999d4c06ce81"
    },
    "project": {
        "name": "notifications",
        "id": "91e34570-bebe-42b6-b47a-ca710b2b8927"
    },
    "repository": {
        "url": "https://github.com/renderedtext/notifications",
        "slug": "renderedtext/notifications"
    },
    "revision": {
        "tag": null,
        "sender": {
            "login": "radwo",
            "email": "184065+radwo@users.noreply.github.com",
            "avatar_url": "https://avatars2.githubusercontent.com/u/184065?v=4"
        },
        "reference_type": "branch",
        "reference": "refs/heads/rw/webhook_impl",
        "pull_request": null,
        "commit_sha": "2d9f5fcec1ca7c68fa7bd44dd58ec4ff65814563",
        "commit_message": "Implement webhooks for SemaphoreCI\n\nThis implements the webhooks for Semaphore2",
        "branch": {
            "name": "rw/webhook_impl",
            "commit_range": "36ebdf6e906cf3491391442d2f779b512ca49485...2d9f5fcec1ca7c68fa7bd44dd58ec4ff65814563"
        }
    },
    "workflow": {
        "initial_pipeline_id": "fa02c7bd-7a8b-42e0-8d6e-aa0d8a194e19",
        "id": "acabe58e-4bcc-4d39-be06-e98d71917703",
        "created_at": "2019-12-10T13:09:54Z"
    },
    "pipeline": {
        "yaml_file_name": "semaphore.yml",
        "working_directory": ".semaphore",
        "stopping_at": "2019-12-10T13:10:22Z",
        "state": "done",
        "running_at": "2019-12-10T13:09:58Z",
        "result_reason": "user",
        "result": "stopped",
        "queuing_at": "2019-12-10T13:09:55Z",
        "pending_at": "2019-12-10T13:09:55Z",
        "name": "Notifications",
        "id": "fa02c7bd-7a8b-42e0-8d6e-aa0d8a194e19",
        "error_description": "",
        "done_at": "2019-12-10T13:10:28Z",
        "created_at": "2019-12-10T13:09:54Z"
    },
    "blocks": [
        {
            "state": "done",
            "result_reason": "user",
            "result": "stopped",
            "name": "List & Test & Build",
            "jobs": [
                {
                    "status": "finished",
                    "result": "stopped",
                    "name": "Test",
                    "index": 1,
                    "id": "21df03d2-c4e0-4e0a-acd7-5ff60dc0727e"
                },
                {
                    "status": "finished",
                    "result": "stopped",
                    "name": "Build",
                    "index": 2,
                    "id": "84190263-362c-4051-8260-e43637f148de"
                },
                {
                    "status": "finished",
                    "result": "passed",
                    "name": "Lint",
                    "index": 0,
                    "id": "d4b93a5b-69a5-43e6-ab24-06b095fc49bf"
                }
            ]
        },
        {
            "state": "done",
            "result_reason": "user",
            "result": "stopped",
            "name": "List & Test & Build 2",
            "jobs": [
                {
                    "status": "finished",
                    "result": "stopped",
                    "name": "Test 2",
                    "index": 1,
                    "id": "21df03d2-c4e0-4e0a-acd7-5ff60dc0727e"
                },
                {
                    "status": "finished",
                    "result": "stopped",
                    "name": "Build 2",
                    "index": 2,
                    "id": "84190263-362c-4051-8260-e43637f148de"
                },
                {
                    "status": "finished",
                    "result": "passed",
                    "name": "Lint",
                    "index": 0,
                    "id": "d4b93a5b-69a5-43e6-ab24-06b095fc49bf"
                }
            ]
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: tag.json]---
Location: zulip-main/zerver/webhooks/semaphore/fixtures/tag.json

```json
{
  "workflow": {
    "initial_pipeline_id": "cbe5d41a-a1a0-4a54-ba2c-ca0bab4a5db7",
    "id": "a8704319-2422-4828-9b11-6b2afa3554e6",
    "created_at": "2020-04-05T13:35:22Z"
  },
  "version": "1.0.0",
  "revision": {
    "tag": {
      "name": "v1.0.1"
    },
    "sender": {
      "login": "radwo",
      "email": "radwo@semaphoreci.com",
      "avatar_url": "https://avatars0.githubusercontent.com/u/1111?v=4"
    },
    "reference_type": "tag",
    "reference": "refs/tags/v1.0.1",
    "pull_request": null,
    "commit_sha": "8d31831ff2a512e23a8042a76cf39246908256a1",
    "commit_message": "Use pytest starter workflow",
    "branch": null
  },
  "repository": {
    "url": "https://github.com/renderedtext/notifications",
    "slug": "renderedtext/notifications"
  },
  "project": {
    "name": "notifications",
    "id": "7379341d-a22a-475f-b0c9-4553b06a926c"
  },
  "pipeline": {
    "yaml_file_name": "semaphore.yml",
    "working_directory": ".semaphore",
    "stopping_at": "1970-01-01T00:00:00Z",
    "state": "done",
    "running_at": "2020-04-05T13:35:23Z",
    "result_reason": "test",
    "result": "stopped",
    "queuing_at": "2020-04-05T13:35:23Z",
    "pending_at": "2020-04-05T13:35:22Z",
    "name": "Notifications",
    "id": "cbe5d41a-a1a0-4a54-ba2c-ca0bab4a5db7",
    "error_description": "",
    "done_at": "2020-04-05T13:35:31Z",
    "created_at": "2020-04-05T13:35:22Z"
  },
  "organization": {
    "name": "semaphore",
    "id": "0172946d-5523-48d8-912d-e13f01189e20"
  },
  "blocks": [
    {
      "state": "done",
      "result_reason": "test",
      "result": "stopped",
      "name": "List & Test & Build",
      "jobs": [
        {
          "status": "finished",
          "result": "stopped",
          "name": "pytest",
          "index": 0,
          "id": "c10604e1-1519-419a-ba84-2a2df4a053d2"
        }
      ]
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: unknown.json]---
Location: zulip-main/zerver/webhooks/semaphore/fixtures/unknown.json

```json
{
   "project_name":"knighthood",
   "project_hash_id":"dff749fa-6acf-467c-85c9-119d63c8af4b",
   "server_name":"lamancha-271",
   "number":17,
   "event":"unknown",
   "result":"passed",
   "created_at":"2016-06-17T00:59:09Z",
   "updated_at":"2016-06-17T01:00:11Z",
   "started_at":"2016-06-17T00:59:11Z",
   "finished_at":"2016-06-17T00:59:21Z",
   "html_url":"https://semaphoreci.com/donquixote/knighthood/servers/lamancha-271/deploys/17",
   "build_number":314,
   "build_html_url":"https://semaphoreci.com/donquixote/knighthood/branches/master/builds/314",
   "branch_name":"master",
   "branch_html_url":"https://semaphoreci.com/donquixote/knighthood/branches/master",
   "commit":{
      "id":"a490b8d508ebbdab1d77a5c2aefa35ceb2d62daf",
      "url":"https://github.com/donquixote/knighthood/commit/a490b8d508ebbdab1d77a5c2aefa35ceb2d62daf",
      "author_name":"Don Quixote",
      "author_email":"don@lamancha.com",
      "message":"Create user account for Rocinante\n\nThe user is an admin user",
      "timestamp":"2016-06-16T18:29:08Z"
   }
}
```

--------------------------------------------------------------------------------

````
