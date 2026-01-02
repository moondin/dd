---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1206
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1206 of 1290)

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

---[FILE: wiki_page_hook__wiki_page_edited.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/wiki_page_hook__wiki_page_edited.json

```json
{
   "object_kind":"wiki_page",
   "user":{
      "name":"Tomasz Kolek",
      "username":"tomaszkolek0",
      "avatar_url":"https://secure.gravatar.com/avatar/116a6fdbcfd00466297a39174da11fbb?s=80\u0026d=identicon"
   },
   "project":{
      "name":"my-awesome-project",
      "description":"",
      "web_url":"https://gitlab.com/tomaszkolek0/my-awesome-project",
      "avatar_url":null,
      "git_ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "git_http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git",
      "namespace":"tomaszkolek0",
      "visibility_level":0,
      "path_with_namespace":"tomaszkolek0/my-awesome-project",
      "default_branch":"master",
      "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project",
      "url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git"
   },
   "wiki":{
      "web_url":"https://gitlab.com/tomaszkolek0/my-awesome-project/wikis/home",
      "git_ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.wiki.git",
      "git_http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.wiki.git",
      "path_with_namespace":"tomaszkolek0/my-awesome-project.wiki",
      "default_branch":"master"
   },
   "object_attributes":{
      "slug":"how-to",
      "title":"how to",
      "format":"markdown",
      "content":"abcaaa",
      "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/wikis/how-to",
      "action":"update"
   }
}
```

--------------------------------------------------------------------------------

---[FILE: wiki_page_hook__wiki_page_opened.json]---
Location: zulip-main/zerver/webhooks/gitlab/fixtures/wiki_page_hook__wiki_page_opened.json

```json
{
   "object_kind":"wiki_page",
   "user":{
      "name":"Tomasz Kolek",
      "username":"tomaszkolek0",
      "avatar_url":"https://secure.gravatar.com/avatar/116a6fdbcfd00466297a39174da11fbb?s=80\u0026d=identicon"
   },
   "project":{
      "name":"my-awesome-project",
      "description":"",
      "web_url":"https://gitlab.com/tomaszkolek0/my-awesome-project",
      "avatar_url":null,
      "git_ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "git_http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git",
      "namespace":"tomaszkolek0",
      "visibility_level":0,
      "path_with_namespace":"tomaszkolek0/my-awesome-project",
      "default_branch":"master",
      "homepage":"https://gitlab.com/tomaszkolek0/my-awesome-project",
      "url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.git",
      "http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.git"
   },
   "wiki":{
      "web_url":"https://gitlab.com/tomaszkolek0/my-awesome-project/wikis/home",
      "git_ssh_url":"git@gitlab.com:tomaszkolek0/my-awesome-project.wiki.git",
      "git_http_url":"https://gitlab.com/tomaszkolek0/my-awesome-project.wiki.git",
      "path_with_namespace":"tomaszkolek0/my-awesome-project.wiki",
      "default_branch":"master"
   },
   "object_attributes":{
      "title":"how to",
      "content":"abc",
      "format":"markdown",
      "message":"",
      "slug":"how-to",
      "url":"https://gitlab.com/tomaszkolek0/my-awesome-project/wikis/how-to",
      "action":"create"
   }
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/gocd/doc.md

```text
# Zulip GoCD integration

Get GoCD notifications in Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. [Download][1] and [install][2] Sentry's **GoCD WebHook Notification
   plugin**.

    !!! warn ""

        **Note**: the GoCD WebHook Notification plugin will only send
        webhook payloads over HTTPS.

1. In your GoCD server, go to **Admin > Server Configuration > Plugins**,
   and click on the gear icon beside the **GoCD WebHook Notification
   plugin** that you installed.

1. Set **WebHook URL** to the URL generated above, and click **Save**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/gocd/001.png)

### Related Branches

- [GoCD plugin user guide][3]

{!webhooks-url-specification.md!}

[1]: https://github.com/getsentry/gocd-webhook-notification-plugin/releases
[2]: https://docs.gocd.org/current/extension_points/plugin_user_guide.html#installing-and-uninstalling-of-plugins
[3]: https://docs.gocd.org/current/extension_points/plugin_user_guide.html
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/gocd/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class GocdHookTests(WebhookTestCase):
    CHANNEL_NAME = "gocd"
    URL_TEMPLATE = "/api/v1/external/gocd?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "gocd"

    def test_building_pipeline(self) -> None:
        expected_topic = "Pipeline / Stage"
        expected_message = """**Pipeline building**: Pipeline / Stage
- **Commit**: [`59f3c6e4540`](https://github.com/swayam0322/Test/commit/59f3c6e4540) on branch `main`
- **Started**: <time:Feb 1, 2024, 1:58:13 AM>"""

        self.check_webhook(
            "pipeline_building",
            expected_topic,
            expected_message,
        )

    def test_completed_pipeline_success(self) -> None:
        expected_topic = "Pipeline / Stage"
        expected_message = """:green_circle: **Build passed**: Pipeline / Stage
- **Commit**: [`59f3c6e4540`](https://github.com/swayam0322/Test/commit/59f3c6e4540) on branch `main`
- **Started**: <time:Feb 1, 2024, 1:58:13 AM>
- **Finished**: <time:Feb 1, 2024, 1:58:40 AM>
- **Passed**: `Job`"""

        self.check_webhook("pipeline_passed", expected_topic, expected_message)

    def test_completed_pipeline_fail(self) -> None:
        expected_topic = "pipeline-one / stage-two"
        expected_message = """:red_circle: **Build failed**: pipeline-one / stage-two
- **Commit**: [`963eb239c7b`](https://github.com/PieterCK/getting-started-repo.git/commit/963eb239c7b) on branch `master`
- **Started**: <time:Aug 28, 2024, 9:30:19 PM>
- **Finished**: <time:Aug 28, 2024, 9:31:00 PM>
- **Failed**: `task-two`"""
        self.check_webhook("pipeline_failed", expected_topic, expected_message)

    def test_completed_pipeline_with_mixed_result(self) -> None:
        expected_topic = "test-pipeline / backend-tests"
        expected_message = """:red_circle: **Build failed**: test-pipeline / backend-tests
- **Commit**: [`963eb239c7b`](https://github.com/PieterCK/getting-started-repo.git/commit/963eb239c7b) on branch `master`
- **Started**: <time:Aug 29, 2024, 3:59:18 PM>
- **Finished**: <time:Aug 29, 2024, 4:00:15 PM>
- **Failed**: `check-backend-lints`, `test-frontend-js`
- **Passed**: `check-backend-tests`, `zulip-ci-debian-12`"""
        self.check_webhook("pipeline_with_mixed_job_result", expected_topic, expected_message)
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/gocd/view.py
Signals: Django

```python
# Webhooks for external integrations.

from collections import defaultdict

from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.lib.webhooks.git import get_short_sha
from zerver.models import UserProfile

COMMIT_INFO_TEMPLATE = """[`{commit_details}`]({commit_link}) on branch `{branch_name}`"""
TOPIC_TEMPLATE = "{pipeline} / {stage}"

SCHEDULED_BODY_TEMPLATE = """
**Pipeline {status}**: {pipeline} / {stage}
- **Commit**: {commit_details}
- **Started**: <time:{start_time}>
"""

COMPLETED_BODY_TEMPLATE = """
{emoji} **Build {status}**: {pipeline} / {stage}
- **Commit**: {commit_details}
- **Started**: <time:{start_time}>
- **Finished**: <time:{end_time}>
"""


@webhook_view("Gocd")
@typed_endpoint
def api_gocd_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    type = payload["type"].tame(check_string)
    if type == "stage":
        body = get_body(payload)
        topic_name = get_topic(payload)
        check_send_webhook_message(request, user_profile, topic_name, body)
    return json_success(request)


def get_topic(payload: WildValue) -> str:
    return TOPIC_TEMPLATE.format(
        pipeline=payload["data"]["pipeline"]["name"].tame(check_string),
        stage=payload["data"]["pipeline"]["stage"]["name"].tame(check_string),
    )


def get_commit_details(payload: WildValue) -> str:
    build = payload["data"]["pipeline"]["build-cause"][0]
    material = build["material"]
    url_base = material["git-configuration"]["url"].tame(check_string)
    revision = build["modifications"][0]["revision"].tame(check_string)
    commit_sha = get_short_sha(revision)
    url = f"{url_base}/commit/{commit_sha}"
    branch = material["git-configuration"]["branch"].tame(check_string)
    return COMMIT_INFO_TEMPLATE.format(
        commit_details=commit_sha,
        commit_link=url,
        branch_name=branch,
    )


def get_jobs_details(pipeline_data: WildValue) -> str:
    job_dict_list = pipeline_data["stage"]["jobs"]
    formatted_job_dict = defaultdict(list)
    job_details_template = ""

    for job in job_dict_list:
        job_name = job["name"].tame(check_string)
        job_result = job["result"].tame(check_string)
        formatted_job_dict[job_result].append(f"`{job_name}`")

    for key in formatted_job_dict:
        formatted_job_list = ", ".join(formatted_job_dict[key])
        job_details_template += f"- **{key}**: {formatted_job_list}\n"

    return job_details_template


def get_body(payload: WildValue) -> str:
    pipeline_data = payload["data"]["pipeline"]
    body_details = {
        "commit_details": get_commit_details(payload),
        "status": pipeline_data["stage"]["state"].tame(check_string).lower(),
        "pipeline": pipeline_data["name"].tame(check_string),
        "stage": pipeline_data["stage"]["name"].tame(check_string),
        "start_time": pipeline_data["stage"]["create-time"].tame(check_string),
    }

    if body_details["status"] == "building":
        return SCHEDULED_BODY_TEMPLATE.format(**body_details)

    result = pipeline_data["stage"]["result"].tame(check_string)
    body_details.update(
        {
            "result": result,
            "emoji": ":green_circle:" if result == "Passed" else ":red_circle:",
            "end_time": pipeline_data["stage"]["last-transition-time"].tame(check_string),
        }
    )
    body = COMPLETED_BODY_TEMPLATE.format(**body_details)

    body += get_jobs_details(pipeline_data)
    return body
```

--------------------------------------------------------------------------------

---[FILE: pipeline_building.json]---
Location: zulip-main/zerver/webhooks/gocd/fixtures/pipeline_building.json

```json
{
  "data": {
      "pipeline": {
          "name": "Pipeline",
          "counter": "90",
          "group": "defaultGroup",
          "build-cause": [
              {
                  "material": {
                      "git-configuration": {
                          "shallow-clone": false,
                          "branch": "main",
                          "url": "https://github.com/swayam0322/Test"
                      },
                      "type": "git"
                  },
                  "changed": false,
                  "modifications": [
                      {
                          "revision": "59f3c6e4540b6a89ad5505790e5efdf964e7b837",
                          "modified-time": "Jan 31, 2024, 1:56:14 AM",
                          "data": {}
                      }
                  ]
              }
          ],
          "stage": {
              "name": "Stage",
              "counter": "1",
              "approval-type": "success",
              "approved-by": "anonymous",
              "state": "Building",
              "result": "Unknown",
              "create-time": "Feb 1, 2024, 1:58:13 AM",
              "jobs": [
                  {
                      "name": "Job",
                      "schedule-time": "Feb 1, 2024, 1:58:13 AM",
                      "state": "Scheduled",
                      "result": "Unknown"
                  }
              ]
          }
      }
  },
  "type": "stage"
}
```

--------------------------------------------------------------------------------

---[FILE: pipeline_failed.json]---
Location: zulip-main/zerver/webhooks/gocd/fixtures/pipeline_failed.json

```json
{
    "data": {
      "pipeline": {
        "name": "pipeline-one",
        "counter": "7",
        "group": "defaultGroup",
        "build-cause": [
          {
            "material": {
              "git-configuration": {
                "shallow-clone": false,
                "branch": "master",
                "url": "https://github.com/PieterCK/getting-started-repo.git"
              },
              "type": "git"
            },
            "changed": false,
            "modifications": [
              {
                "revision": "963eb239c7b91eac2e15c727e06e908fd334e6f9",
                "modified-time": "Dec 14, 2016, 5:09:14 AM",
                "data": {}
              }
            ]
          }
        ],
        "stage": {
          "name": "stage-two",
          "counter": "1",
          "approval-type": "success",
          "approved-by": "anonymous",
          "state": "Failed",
          "result": "Failed",
          "create-time": "Aug 28, 2024, 9:30:19 PM",
          "last-transition-time": "Aug 28, 2024, 9:31:00 PM",
          "jobs": [
            {
              "name": "task-two",
              "schedule-time": "Aug 28, 2024, 9:30:19 PM",
              "complete-time": "Aug 28, 2024, 9:31:00 PM",
              "state": "Completed",
              "result": "Failed",
              "agent-uuid": "a35cf64c-7746-46ae-ba65-597d70898d50"
            }
          ]
        }
      }
    },
    "type": "stage"
  }
```

--------------------------------------------------------------------------------

---[FILE: pipeline_passed.json]---
Location: zulip-main/zerver/webhooks/gocd/fixtures/pipeline_passed.json

```json
{
  "data": {
    "pipeline": {
      "name": "Pipeline",
      "counter": "90",
      "group": "defaultGroup",
      "build-cause": [
        {
          "material": {
            "git-configuration": {
              "shallow-clone": false,
              "branch": "main",
              "url": "https://github.com/swayam0322/Test"
            },
            "type": "git"
          },
          "changed": false,
          "modifications": [
            {
              "revision": "59f3c6e4540b6a89ad5505790e5efdf964e7b837",
              "modified-time": "Jan 31, 2024, 1:56:14 AM",
              "data": {}
            }
          ]
        }
      ],
      "stage": {
        "name": "Stage",
        "counter": "1",
        "approval-type": "success",
        "approved-by": "anonymous",
        "state": "Passed",
        "result": "Passed",
        "create-time": "Feb 1, 2024, 1:58:13 AM",
        "last-transition-time": "Feb 1, 2024, 1:58:40 AM",
        "jobs": [
          {
            "name": "Job",
            "schedule-time": "Feb 1, 2024, 1:58:13 AM",
            "complete-time": "Feb 1, 2024, 1:58:40 AM",
            "state": "Completed",
            "result": "Passed",
            "agent-uuid": "95dde0d9-8da7-48ae-8572-5c7de18bff88"
          }
        ]
      }
    }
  },
  "type": "stage"
}
```

--------------------------------------------------------------------------------

---[FILE: pipeline_with_mixed_job_result.json]---
Location: zulip-main/zerver/webhooks/gocd/fixtures/pipeline_with_mixed_job_result.json

```json

{
  "data": {
    "pipeline": {
      "name": "test-pipeline",
      "counter": "6",
      "group": "defaultGroup",
      "build-cause": [
        {
          "material": {
            "git-configuration": {
              "shallow-clone": false,
              "branch": "master",
              "url": "https://github.com/PieterCK/getting-started-repo.git"
            },
            "type": "git"
          },
          "changed": false,
          "modifications": [
            {
              "revision": "963eb239c7b91eac2e15c727e06e908fd334e6f9",
              "modified-time": "Dec 14, 2016, 5:09:14 AM",
              "data": {}
            }
          ]
        }
      ],
      "stage": {
        "name": "backend-tests",
        "counter": "1",
        "approval-type": "success",
        "approved-by": "changes",
        "state": "Failed",
        "result": "Failed",
        "create-time": "Aug 29, 2024, 3:59:18 PM",
        "last-transition-time": "Aug 29, 2024, 4:00:15 PM",
        "jobs": [
          {
            "name": "check-backend-lints",
            "schedule-time": "Aug 29, 2024, 3:59:18 PM",
            "complete-time": "Aug 29, 2024, 3:59:23 PM",
            "state": "Completed",
            "result": "Failed",
            "agent-uuid": "a35cf64c-7746-46ae-ba65-597d70898d50"
          },
          {
            "name": "check-backend-tests",
            "schedule-time": "Aug 29, 2024, 3:59:18 PM",
            "complete-time": "Aug 29, 2024, 3:59:47 PM",
            "state": "Completed",
            "result": "Passed",
            "agent-uuid": "a35cf64c-7746-46ae-ba65-597d70898d50"
          },
          {
            "name": "test-frontend-js",
            "schedule-time": "Aug 29, 2024, 3:59:18 PM",
            "complete-time": "Aug 29, 2024, 4:00:15 PM",
            "state": "Completed",
            "result": "Failed",
            "agent-uuid": "a35cf64c-7746-46ae-ba65-597d70898d50"
          },
          {
            "name": "zulip-ci-debian-12",
            "schedule-time": "Aug 29, 2024, 3:59:18 PM",
            "complete-time": "Aug 29, 2024, 4:00:11 PM",
            "state": "Completed",
            "result": "Passed",
            "agent-uuid": "a35cf64c-7746-46ae-ba65-597d70898d50"
          }
        ]
      }
    }
  },
  "type": "stage"
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/gogs/doc.md

```text
# Zulip Gogs integration

Receive Gogs notifications in Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-with-branch-filtering.md!}

1. Go to your repository on Gogs and click on **Settings**. Select
   **Webhooks** on the left sidebar, and click **Add Webhook**.
   Select **Gogs**.

1. Set **Payload URL** to the URL generated above. Set **Content type**
   to `application/json`. Select the [events](#filtering-incoming-events)
   you would like to receive notifications for, and click **Add Webhook**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/gogs/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/gogs/tests.py

```python
from unittest.mock import MagicMock, patch

from zerver.lib.test_classes import WebhookTestCase
from zerver.lib.webhooks.git import COMMITS_LIMIT


class GogsHookTests(WebhookTestCase):
    CHANNEL_NAME = "commits"
    URL_TEMPLATE = "/api/v1/external/gogs?&api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "gogs"

    def test_push(self) -> None:
        expected_topic_name = "try-git / master"
        expected_message = """john [pushed](http://localhost:3000/john/try-git/compare/479e6b772b7fba19412457483f50b201286d0103...d8fce16c72a2ff56a5afc8a08645a6ce45491794) 1 commit to branch master. Commits by John (1).

* Webhook Test ([d8fce16c72a](http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794))"""
        self.check_webhook("push", expected_topic_name, expected_message)

    def test_push_multiple_committers(self) -> None:
        commit_info = "* Webhook Test ([d8fce16c72a](http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794))\n"
        expected_topic_name = "try-git / master"
        expected_message = f"""john [pushed](http://localhost:3000/john/try-git/compare/479e6b772b7fba19412457483f50b201286d0103...d8fce16c72a2ff56a5afc8a08645a6ce45491794) 2 commits to branch master. Commits by Benjamin (1) and John (1).\n\n{commit_info}* Webhook Test ([d8fce16c72a](http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794))"""
        self.check_webhook(
            "push__commits_multiple_committers", expected_topic_name, expected_message
        )

    def test_push_multiple_committers_filtered_by_branches(self) -> None:
        self.url = self.build_webhook_url(branches="master,development")
        commit_info = "* Webhook Test ([d8fce16c72a](http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794))\n"
        expected_topic_name = "try-git / master"
        expected_message = f"""john [pushed](http://localhost:3000/john/try-git/compare/479e6b772b7fba19412457483f50b201286d0103...d8fce16c72a2ff56a5afc8a08645a6ce45491794) 2 commits to branch master. Commits by Benjamin (1) and John (1).\n\n{commit_info}* Webhook Test ([d8fce16c72a](http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794))"""
        self.check_webhook(
            "push__commits_multiple_committers", expected_topic_name, expected_message
        )

    def test_push_filtered_by_branches(self) -> None:
        self.url = self.build_webhook_url(branches="master,development")
        expected_topic_name = "try-git / master"
        expected_message = """john [pushed](http://localhost:3000/john/try-git/compare/479e6b772b7fba19412457483f50b201286d0103...d8fce16c72a2ff56a5afc8a08645a6ce45491794) 1 commit to branch master. Commits by John (1).

* Webhook Test ([d8fce16c72a](http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794))"""
        self.check_webhook("push", expected_topic_name, expected_message)

    def test_push_commits_more_than_limits(self) -> None:
        expected_topic_name = "try-git / master"
        commits_info = "* Webhook Test ([d8fce16c72a](http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794))\n"
        expected_message = f"john [pushed](http://localhost:3000/john/try-git/compare/479e6b772b7fba19412457483f50b201286d0103...d8fce16c72a2ff56a5afc8a08645a6ce45491794) 30 commits to branch master. Commits by John (30).\n\n{commits_info * COMMITS_LIMIT}[and {30 - COMMITS_LIMIT} more commit(s)]"
        self.check_webhook("push__commits_more_than_limits", expected_topic_name, expected_message)

    def test_push_commits_more_than_limits_filtered_by_branches(self) -> None:
        self.url = self.build_webhook_url(branches="master,development")
        expected_topic_name = "try-git / master"
        commits_info = "* Webhook Test ([d8fce16c72a](http://localhost:3000/john/try-git/commit/d8fce16c72a2ff56a5afc8a08645a6ce45491794))\n"
        expected_message = f"john [pushed](http://localhost:3000/john/try-git/compare/479e6b772b7fba19412457483f50b201286d0103...d8fce16c72a2ff56a5afc8a08645a6ce45491794) 30 commits to branch master. Commits by John (30).\n\n{commits_info * COMMITS_LIMIT}[and {30 - COMMITS_LIMIT} more commit(s)]"
        self.check_webhook("push__commits_more_than_limits", expected_topic_name, expected_message)

    def test_new_branch(self) -> None:
        expected_topic_name = "try-git / my_feature"
        expected_message = (
            "john created [my_feature](http://localhost:3000/john/try-git/src/my_feature) branch."
        )
        self.check_webhook("create__branch", expected_topic_name, expected_message)

    def test_pull_request_opened(self) -> None:
        expected_topic_name = "try-git / PR #1 Title Text for Pull Request"
        expected_message = """john opened [PR #1](http://localhost:3000/john/try-git/pulls/1) from `feature` to `master`."""
        self.check_webhook("pull_request__opened", expected_topic_name, expected_message)

    def test_pull_request_opened_with_custom_topic_in_url(self) -> None:
        self.url = self.build_webhook_url(topic="notifications")
        expected_topic_name = "notifications"
        expected_message = """john opened [PR #1 Title Text for Pull Request](http://localhost:3000/john/try-git/pulls/1) from `feature` to `master`."""
        self.check_webhook("pull_request__opened", expected_topic_name, expected_message)

    def test_pull_request_closed(self) -> None:
        expected_topic_name = "try-git / PR #1 Title Text for Pull Request"
        expected_message = """john closed [PR #1](http://localhost:3000/john/try-git/pulls/1) from `feature` to `master`."""
        self.check_webhook("pull_request__closed", expected_topic_name, expected_message)

    def test_pull_request_merged(self) -> None:
        expected_topic_name = "try-git / PR #2 Title Text for Pull Request"
        expected_message = """john merged [PR #2](http://localhost:3000/john/try-git/pulls/2) from `feature` to `master`."""
        self.check_webhook("pull_request__merged", expected_topic_name, expected_message)

    def test_pull_request_reopened(self) -> None:
        expected_topic_name = "test / PR #1349 reopened"
        expected_message = """kostekIV reopened [PR #2](https://try.gogs.io/kostekIV/test/pulls/2) from `c` to `master`."""
        self.check_webhook("pull_request__reopened", expected_topic_name, expected_message)

    def test_pull_request_edited(self) -> None:
        expected_topic_name = "test / PR #1349 Test"
        expected_message = """kostekIV edited [PR #2](https://try.gogs.io/kostekIV/test/pulls/2)."""
        self.check_webhook("pull_request__edited", expected_topic_name, expected_message)

    def test_pull_request_assigned(self) -> None:
        expected_topic_name = "test / PR #1349 Test"
        expected_message = """kostekIV assigned kostekIV to [PR #2](https://try.gogs.io/kostekIV/test/pulls/2) from `c` to `master`."""
        self.check_webhook("pull_request__assigned", expected_topic_name, expected_message)

    def test_pull_request_synchronized(self) -> None:
        expected_topic_name = "test / PR #1349 Test"
        expected_message = """kostekIV synchronized [PR #2](https://try.gogs.io/kostekIV/test/pulls/2) from `c` to `master`."""
        self.check_webhook("pull_request__synchronized", expected_topic_name, expected_message)

    def test_issues_opened(self) -> None:
        expected_topic_name = "test / issue #3 New test issue"
        expected_message = """kostekIV opened [issue #3](https://try.gogs.io/kostekIV/test/issues/3):\n\n~~~ quote\nTest\n~~~"""
        self.check_webhook("issues__opened", expected_topic_name, expected_message)

    def test_issues_reopened(self) -> None:
        expected_topic_name = "test / issue #3 New test issue"
        expected_message = """kostekIV reopened [issue #3](https://try.gogs.io/kostekIV/test/issues/3):\n\n~~~ quote\nTest\n~~~"""
        self.check_webhook("issues__reopened", expected_topic_name, expected_message)

    def test_issues_edited(self) -> None:
        expected_topic_name = "test / issue #3 New test issue"
        expected_message = """kostekIV edited [issue #3](https://try.gogs.io/kostekIV/test/issues/3):\n\n~~~ quote\nTest edit\n~~~"""
        self.check_webhook("issues__edited", expected_topic_name, expected_message)

    def test_issues_assignee(self) -> None:
        expected_topic_name = "test / issue #3 New test issue"
        expected_message = """kostekIV assigned kostekIV to [issue #3](https://try.gogs.io/kostekIV/test/issues/3) (assigned to kostekIV):\n\n~~~ quote\nTest\n~~~"""
        self.check_webhook("issues__assigned", expected_topic_name, expected_message)

    def test_issues_closed(self) -> None:
        expected_topic_name = "test / issue #3 New test issue"
        expected_message = """kostekIV closed [issue #3](https://try.gogs.io/kostekIV/test/issues/3):\n\n~~~ quote\nClosed #3\n~~~"""
        self.check_webhook("issues__closed", expected_topic_name, expected_message)

    def test_issue_comment_new(self) -> None:
        expected_topic_name = "test / issue #3 New test issue"
        expected_message = """kostekIV [commented](https://try.gogs.io/kostekIV/test/issues/3#issuecomment-3635) on [issue #3](https://try.gogs.io/kostekIV/test/issues/3):\n\n~~~ quote\nTest comment\n~~~"""
        self.check_webhook("issue_comment__new", expected_topic_name, expected_message)

    def test_issue_comment_edited(self) -> None:
        expected_topic_name = "test / issue #3 New test issue"
        expected_message = """kostekIV edited a [comment](https://try.gogs.io/kostekIV/test/issues/3#issuecomment-3634) on [issue #3](https://try.gogs.io/kostekIV/test/issues/3):\n\n~~~ quote\nedit comment\n~~~"""
        self.check_webhook("issue_comment__edited", expected_topic_name, expected_message)

    def test_release_published(self) -> None:
        expected_topic_name = "zulip_test / v1.4 Title"
        expected_message = """cestrell published release [Title](https://try.gogs.io/cestrell/zulip_test) for tag v1.4."""
        self.check_webhook("release__published", expected_topic_name, expected_message)

    @patch("zerver.webhooks.gogs.view.check_send_webhook_message")
    def test_push_filtered_by_branches_ignore(
        self, check_send_webhook_message_mock: MagicMock
    ) -> None:
        self.url = self.build_webhook_url(branches="changes,development")
        payload = self.get_body("push")
        result = self.client_post(
            self.url, payload, HTTP_X_GOGS_EVENT="push", content_type="application/json"
        )
        self.assertFalse(check_send_webhook_message_mock.called)
        self.assert_json_success(result)

    @patch("zerver.webhooks.gogs.view.check_send_webhook_message")
    def test_push_commits_more_than_limits_filtered_by_branches_ignore(
        self, check_send_webhook_message_mock: MagicMock
    ) -> None:
        self.url = self.build_webhook_url(branches="changes,development")
        payload = self.get_body("push__commits_more_than_limits")
        result = self.client_post(
            self.url, payload, HTTP_X_GOGS_EVENT="push", content_type="application/json"
        )
        self.assertFalse(check_send_webhook_message_mock.called)
        self.assert_json_success(result)

    @patch("zerver.webhooks.gogs.view.check_send_webhook_message")
    def test_push_multiple_committers_filtered_by_branches_ignore(
        self, check_send_webhook_message_mock: MagicMock
    ) -> None:
        self.url = self.build_webhook_url(branches="changes,development")
        payload = self.get_body("push__commits_multiple_committers")
        result = self.client_post(
            self.url, payload, HTTP_X_GOGS_EVENT="push", content_type="application/json"
        )
        self.assertFalse(check_send_webhook_message_mock.called)
        self.assert_json_success(result)
```

--------------------------------------------------------------------------------

````
