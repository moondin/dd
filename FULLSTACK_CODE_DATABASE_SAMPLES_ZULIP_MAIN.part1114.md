---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1114
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1114 of 1290)

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
Location: zulip-main/zerver/webhooks/appveyor/view.py
Signals: Django, Pydantic

```python
from datetime import datetime, timezone

from django.http import HttpRequest, HttpResponse
from pydantic.alias_generators import to_snake

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.timestamp import datetime_to_global_time
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

APPVEYOR_TOPIC_TEMPLATE = "{project_name}"
APPVEYOR_MESSAGE_TEMPLATE = """
[Build {project_name} {build_version} {status}]({build_url}):
* **Commit**: [{commit_id}: {commit_message}]({commit_url}) by {committer_name}
* **Started**: {started}
* **Finished**: {finished}
""".strip()


def get_global_time(dt_str: str) -> str:
    return datetime_to_global_time(
        datetime.strptime(dt_str, "%m/%d/%Y %I:%M %p").replace(tzinfo=timezone.utc)
    )


@webhook_view("Appveyor")
@typed_endpoint
def api_appveyor_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    body = get_body(payload)
    topic_name = get_topic_name(payload)

    check_send_webhook_message(request, user_profile, topic_name, body)
    return json_success(request)


def get_topic_name(payload: WildValue) -> str:
    event_data = payload["eventData"]
    return APPVEYOR_TOPIC_TEMPLATE.format(project_name=event_data["projectName"].tame(check_string))


def get_body(payload: WildValue) -> str:
    event_data = payload["eventData"]
    fields = [
        "projectName",
        "buildVersion",
        "status",
        "buildUrl",
        "commitUrl",
        "committerName",
        "commitDate",
        "commitMessage",
        "commitId",
        "started",
        "finished",
    ]
    data = {
        to_snake(field): get_global_time(value) if field in ["started", "finished"] else value
        for field, value in ((field, event_data[field].tame(check_string)) for field in fields)
    }

    return APPVEYOR_MESSAGE_TEMPLATE.format(**data)
```

--------------------------------------------------------------------------------

---[FILE: appveyor_build_failure.json]---
Location: zulip-main/zerver/webhooks/appveyor/fixtures/appveyor_build_failure.json

```json
{
    "eventName": "build_failure",
    "eventData": {
      "passed": false,
      "failed": true,
      "status": "failed",
      "started": "9/9/2018 7:04 PM",
      "finished": "9/9/2018 7:06 PM",
      "duration": "00:02:54.1586505",
      "projectId": 456857,
      "projectName": "Hubot-DSC-Resource",
      "buildId": 18638796,
      "buildNumber": 59,
      "buildVersion": "2.0.59",
      "repositoryProvider": "gitHub",
      "repositoryScm": "git",
      "repositoryName": "joebloggs/Hubot-DSC-Resource",
      "branch": "master",
      "commitId": "c06e208b47",
      "commitAuthor": "Joe Bloggs",
      "commitAuthorEmail": "joe.bloggs@example.com",
      "commitAuthorUsername": "joebloggs",
      "commitDate": "6/12/2018 6:22 PM",
      "commitMessage": "Increment version number.",
      "commitMessageExtended": "Signed-off-by: Joe Bloggs <joe.bloggs@example.com>",
      "committerName": "Joe Bloggs",
      "committerEmail": "joe.bloggs@example.com",
      "buildUrl": "https://ci.appveyor.com/project/joebloggs/hubot-dsc-resource/build/2.0.59",
      "commitUrl": "https://github.com/joebloggs/Hubot-DSC-Resource/commit/c06e208b47",
      "notificationSettingsUrl": "https://ci.appveyor.com/notifications",
      "isPullRequest": false,
      "messages": [],
      "jobs": [
        {
          "id": "flhhi1o73j0tbbt8",
          "name": "",
          "passed": false,
          "failed": true,
          "status": "Failed",
          "started": "9/9/2018 7:04 PM",
          "finished": "9/9/2018 7:06 PM",
          "duration": "00:02:54.1117792",
          "messages": [],
          "messagesTotal": 0,
          "messagesError": 0,
          "compilationMessages": [],
          "artifacts": [
            {
              "permalink": "https://ci.appveyor.com/api/buildjobs/flhhi1o73j0tbbts8/artifacts/InstallHubot-2.0.59.zip",
              "fileName": "InstallHubot-2.0.59.zip",
              "type": "Zip",
              "size": 41423,
              "url": "https://storage.googleapis.com/appveyor-artifacts/joebloggs-98248/hubot-dsc-resource/2-0-59/flhhi1o73j0tbbt8/InstallHubot-2.0.59.zip?GoogleAccessId=646512516365-bidt3t59mctt8vti6cffe2sbq65pnmb1@developer.gserviceaccount.com&Expires=1536523617&Signature=GDTsHhyTif5UZv6qDOa87DVYD5ubBmUPDk%2bppImEmp9KO%2bFHqt%2b9brLqN7k4wmz7EqIAG9skvNTfIRiOfIBTKvFyhsWaYGswnx6eUIbGdlloHTON%2fJpzsffQqXnA7eOznqizphrcpph0YAql1%2fmLgCk21dL31HB0RhJ5Qiah%2bQhVTyBlu8W7fzvOEJSaDCwqS6GRUYd3DoaUpjvGa9QaGGzBCLVkLLZIizz2xbvtxJfZVUB1EO3Uk6W17Rz4rxE4EFYFyZZsOIv%2bQcizEdmjcyapwJFBST7kpaN%2fK0Kw5LikFIMjyl0sgZa0ycf3V3a35mmdcfvAox5jN%2fLFgWwctg%3d%3d",
              "created": "0001-01-01T00:00:00+00:00"
            },
            {
              "permalink": "https://ci.appveyor.com/api/buildjobs/flhhi1o73j0tbbts8/artifacts/InstallHubot.zip",
              "fileName": "InstallHubot.zip",
              "type": "Zip",
              "size": 7335,
              "url": "https://storage.googleapis.com/appveyor-artifacts/joebloggs-98248/hubot-dsc-resource/2-0-59/flhhi1o73j0tbbt8/InstallHubot.zip?GoogleAccessId=646512516365-bidt3t59mctt8vti6cffe2sbq65pnmb1@developer.gserviceaccount.com&Expires=1536523617&Signature=P9SKuynprwgTm1%2f9PrQtivza39bq%2bA7FyPfN%2fk2DWrXTDoYLJqrePHPQC2fX4FAYhDPBk8YpwsEA8psn%2fI86Ye5fbkN%2f5AEUrdt%2b2jUAcAaysChnX2CGbHWCKl65Tiks8eG2ZuDnKpwLsB0X%2bUGP8q54pO1VuUqK8x5l%2fDV79pHY1p6wH8bF5bX%2bSDOYPmBX6mcpEDbou9NDGDqzox08OYyb76wWnDf0Uqzwzz5sB845TipoKMP4idtT3ODHCIkcojzBGl%2bl9avv6vWzTusZHARvbBm%2bQGdStmzvwaBhtvKOrFMJMS%2bau5YKiKVCDh9z480ok17OyCRIbVHLXSQ5Ew%3d%3d",
              "created": "0001-01-01T00:00:00+00:00"
            },
            {
              "permalink": "https://ci.appveyor.com/api/buildjobs/flhhi1o73j0tbbts8/artifacts/InstallHubot.2.0.59.nupkg",
              "fileName": "InstallHubot.2.0.59.nupkg",
              "type": "NuGetPackage",
              "size": 8663,
              "url": "https://storage.googleapis.com/appveyor-artifacts/joebloggs-98248/hubot-dsc-resource/2-0-59/flhhi1o73j0tbbt8/InstallHubot.2.0.59.nupkg?GoogleAccessId=646512516365-bidt3t59mctt8vti6cffe2sbq65pnmb1@developer.gserviceaccount.com&Expires=1536523617&Signature=B7HYnZRjKkplSCI9rIsY%2bVlp9Fnukinraj4utPNbopzyvKCNtgJ1RVPqr6h1%2bVRZQ2VXPQW6kpNj4PBpG%2bc24hOciFKFy0hkGvAddEKv4Q%2bP18MAS3cx%2bXnQBxPolFJtgq%2bfzA7XeTl6mzDT727WpjAnaByZuWVcLhf%2bXeuNHI2h121Vl8Ppdcd52y2dhhrBI5JPqspMOZ8d346ZQhWqbnfwZfBRuTO2CfG7MNy4pF4cKyMY5fLU2wlnm4VwJnd7xJqwt9qmx7x7vbFcyVdS404uD0Rd5PhPiBuUNVrDGcywL0TcwxMF9%2bd45UKyKBr5%2f31DqIdmUa0DCwaDZV2rYQ%3d%3d",
              "created": "0001-01-01T00:00:00+00:00"
            }
          ]
        }
      ]
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: appveyor_build_success.json]---
Location: zulip-main/zerver/webhooks/appveyor/fixtures/appveyor_build_success.json

```json
{
    "eventName": "build_success",
    "eventData": {
      "passed": true,
      "failed": false,
      "status": "completed",
      "started": "9/9/2018 7:04 PM",
      "finished": "9/9/2018 7:06 PM",
      "duration": "00:02:54.1586505",
      "projectId": 456857,
      "projectName": "Hubot-DSC-Resource",
      "buildId": 18638796,
      "buildNumber": 59,
      "buildVersion": "2.0.59",
      "repositoryProvider": "gitHub",
      "repositoryScm": "git",
      "repositoryName": "joebloggs/Hubot-DSC-Resource",
      "branch": "master",
      "commitId": "c06e208b47",
      "commitAuthor": "Joe Bloggs",
      "commitAuthorEmail": "joe.bloggs@example.com",
      "commitAuthorUsername": "joebloggs",
      "commitDate": "6/12/2018 6:22 PM",
      "commitMessage": "Increment version number.",
      "commitMessageExtended": "Signed-off-by: Joe Bloggs <joe.bloggs@example.com>",
      "committerName": "Joe Bloggs",
      "committerEmail": "joe.bloggs@example.com",
      "buildUrl": "https://ci.appveyor.com/project/joebloggs/hubot-dsc-resource/build/2.0.59",
      "commitUrl": "https://github.com/joebloggs/Hubot-DSC-Resource/commit/c06e208b47",
      "notificationSettingsUrl": "https://ci.appveyor.com/notifications",
      "isPullRequest": false,
      "messages": [],
      "jobs": [
        {
          "id": "flhhi1o73j0tbbt8",
          "name": "",
          "passed": true,
          "failed": false,
          "status": "Success",
          "started": "9/9/2018 7:04 PM",
          "finished": "9/9/2018 7:06 PM",
          "duration": "00:02:54.1117792",
          "messages": [],
          "messagesTotal": 0,
          "messagesError": 0,
          "compilationMessages": [],
          "artifacts": [
            {
              "permalink": "https://ci.appveyor.com/api/buildjobs/flhhi1o73j0tbbts8/artifacts/InstallHubot-2.0.59.zip",
              "fileName": "InstallHubot-2.0.59.zip",
              "type": "Zip",
              "size": 41423,
              "url": "https://storage.googleapis.com/appveyor-artifacts/joebloggs-98248/hubot-dsc-resource/2-0-59/flhhi1o73j0tbbt8/InstallHubot-2.0.59.zip?GoogleAccessId=646512516365-bidt3t59mctt8vti6cffe2sbq65pnmb1@developer.gserviceaccount.com&Expires=1536523617&Signature=GDTsHhyTif5UZv6qDOa87DVYD5ubBmUPDk%2bppImEmp9KO%2bFHqt%2b9brLqN7k4wmz7EqIAG9skvNTfIRiOfIBTKvFyhsWaYGswnx6eUIbGdlloHTON%2fJpzsffQqXnA7eOznqizphrcpph0YAql1%2fmLgCk21dL31HB0RhJ5Qiah%2bQhVTyBlu8W7fzvOEJSaDCwqS6GRUYd3DoaUpjvGa9QaGGzBCLVkLLZIizz2xbvtxJfZVUB1EO3Uk6W17Rz4rxE4EFYFyZZsOIv%2bQcizEdmjcyapwJFBST7kpaN%2fK0Kw5LikFIMjyl0sgZa0ycf3V3a35mmdcfvAox5jN%2fLFgWwctg%3d%3d",
              "created": "0001-01-01T00:00:00+00:00"
            },
            {
              "permalink": "https://ci.appveyor.com/api/buildjobs/flhhi1o73j0tbbts8/artifacts/InstallHubot.zip",
              "fileName": "InstallHubot.zip",
              "type": "Zip",
              "size": 7335,
              "url": "https://storage.googleapis.com/appveyor-artifacts/joebloggs-98248/hubot-dsc-resource/2-0-59/flhhi1o73j0tbbt8/InstallHubot.zip?GoogleAccessId=646512516365-bidt3t59mctt8vti6cffe2sbq65pnmb1@developer.gserviceaccount.com&Expires=1536523617&Signature=P9SKuynprwgTm1%2f9PrQtivza39bq%2bA7FyPfN%2fk2DWrXTDoYLJqrePHPQC2fX4FAYhDPBk8YpwsEA8psn%2fI86Ye5fbkN%2f5AEUrdt%2b2jUAcAaysChnX2CGbHWCKl65Tiks8eG2ZuDnKpwLsB0X%2bUGP8q54pO1VuUqK8x5l%2fDV79pHY1p6wH8bF5bX%2bSDOYPmBX6mcpEDbou9NDGDqzox08OYyb76wWnDf0Uqzwzz5sB845TipoKMP4idtT3ODHCIkcojzBGl%2bl9avv6vWzTusZHARvbBm%2bQGdStmzvwaBhtvKOrFMJMS%2bau5YKiKVCDh9z480ok17OyCRIbVHLXSQ5Ew%3d%3d",
              "created": "0001-01-01T00:00:00+00:00"
            },
            {
              "permalink": "https://ci.appveyor.com/api/buildjobs/flhhi1o73j0tbbts8/artifacts/InstallHubot.2.0.59.nupkg",
              "fileName": "InstallHubot.2.0.59.nupkg",
              "type": "NuGetPackage",
              "size": 8663,
              "url": "https://storage.googleapis.com/appveyor-artifacts/joebloggs-98248/hubot-dsc-resource/2-0-59/flhhi1o73j0tbbt8/InstallHubot.2.0.59.nupkg?GoogleAccessId=646512516365-bidt3t59mctt8vti6cffe2sbq65pnmb1@developer.gserviceaccount.com&Expires=1536523617&Signature=B7HYnZRjKkplSCI9rIsY%2bVlp9Fnukinraj4utPNbopzyvKCNtgJ1RVPqr6h1%2bVRZQ2VXPQW6kpNj4PBpG%2bc24hOciFKFy0hkGvAddEKv4Q%2bP18MAS3cx%2bXnQBxPolFJtgq%2bfzA7XeTl6mzDT727WpjAnaByZuWVcLhf%2bXeuNHI2h121Vl8Ppdcd52y2dhhrBI5JPqspMOZ8d346ZQhWqbnfwZfBRuTO2CfG7MNy4pF4cKyMY5fLU2wlnm4VwJnd7xJqwt9qmx7x7vbFcyVdS404uD0Rd5PhPiBuUNVrDGcywL0TcwxMF9%2bd45UKyKBr5%2f31DqIdmUa0DCwaDZV2rYQ%3d%3d",
              "created": "0001-01-01T00:00:00+00:00"
            }
          ]
        }
      ]
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/azuredevops/doc.md

```text
# Zulip Azure DevOps integration

Get Azure DevOps notifications in Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-with-branch-filtering.md!}

1. Go to your project on Azure DevOps, click on the **Project
   settings** in the bottom left corner and select **Service
   hooks**. Click on **Create subscription**, select
   **Web hooks**, and click **Next**.

1. Select the [events](#filtering-incoming-events) you would like to receive
   notifications for, and click **Next**.

1. Set **URL** to the URL you generated. Ensure that **Resource
   details to send** and **Detailed messages to send** are set to
   **All**. Click **Finish**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/azuredevops/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/azuredevops/tests.py

```python
from unittest.mock import MagicMock, patch

from zerver.lib.test_classes import WebhookTestCase
from zerver.lib.webhooks.git import COMMITS_LIMIT


class AzuredevopsHookTests(WebhookTestCase):
    CHANNEL_NAME = "azure-devops"
    URL_TEMPLATE = "/api/v1/external/azuredevops?&api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "azuredevops"

    def test_push_event_message(self) -> None:
        expected_topic_name = "test-zulip / main"
        expected_message = "Yuro Itaki [pushed](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/branchCompare?baseVersion=GC51515957669f93c543df09f8f3e7f47c3613c879&targetVersion=GCb0ce2f2009c3c87dbefadf61d7eb2c0697a6f369&_a=files) 1 commit to branch main.\n\n* Modify readme ([b0ce2f2009c](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/commit/b0ce2f2009c3c87dbefadf61d7eb2c0697a6f369))"
        self.check_webhook("code_push", expected_topic_name, expected_message)

    def test_push_event_message_filtered_by_branches(self) -> None:
        self.url = self.build_webhook_url(branches="main,dev")
        expected_topic_name = "test-zulip / main"
        expected_message = "Yuro Itaki [pushed](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/branchCompare?baseVersion=GC51515957669f93c543df09f8f3e7f47c3613c879&targetVersion=GCb0ce2f2009c3c87dbefadf61d7eb2c0697a6f369&_a=files) 1 commit to branch main.\n\n* Modify readme ([b0ce2f2009c](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/commit/b0ce2f2009c3c87dbefadf61d7eb2c0697a6f369))"
        self.check_webhook("code_push", expected_topic_name, expected_message)

    @patch("zerver.lib.webhooks.common.check_send_webhook_message")
    def test_push_event_message_filtered_by_branches_ignore(
        self, check_send_webhook_message_mock: MagicMock
    ) -> None:
        self.url = self.build_webhook_url(branches="development")
        payload = self.get_body("code_push")
        result = self.client_post(self.url, payload, content_type="application/json")
        self.assertFalse(check_send_webhook_message_mock.called)
        self.assert_json_success(result)

    def test_push_local_branch_without_commits(self) -> None:
        expected_topic_name = "test-zulip / dev"
        expected_message = "Yuro Itaki [pushed](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/branchCompare?baseVersion=GC0000000000000000000000000000000000000000&targetVersion=GC0929a3404b39f6e39076a640779b2c1c961e19b5&_a=files) the branch dev."
        self.check_webhook(
            "code_push__local_branch_without_commits", expected_topic_name, expected_message
        )

    def test_push_multiple_committers(self) -> None:
        expected_topic_name = "test-zulip / main"
        expected_message = "Yuro Itaki [pushed](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/branchCompare?baseVersion=GCcc21b940719cc372b364d932eb39e528b0ec2a91&targetVersion=GC0929a3404b39f6e39076a640779b2c1c961e19b5&_a=files) 2 commits to branch main. Commits by Itachi Sensei (1) and Yuro Itaki (1).\n\n* Add reply ([0929a3404b3](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/commit/0929a3404b39f6e39076a640779b2c1c961e19b5))\n* Add how are you ([819ce8de51b](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/commit/819ce8de51bedfc250c202edcaee0ce8dc70bf3b))"
        self.check_webhook("code_push__multiple_committers", expected_topic_name, expected_message)

    def test_push_multiple_committers_with_others(self) -> None:
        expected_topic_name = "test-zulip / main"
        commits_info = "* Add how are you ([819ce8de51b](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/commit/819ce8de51bedfc250c202edcaee0ce8dc70bf3b))\n"
        expected_message = f"Yuro Itaki [pushed](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/branchCompare?baseVersion=GCcc21b940719cc372b364d932eb39e528b0ec2a91&targetVersion=GC0929a3404b39f6e39076a640779b2c1c961e19b5&_a=files) 6 commits to branch main. Commits by Itachi Sensei (2), Yuro Itaki (2), Jonas Nielsen (1) and others (1).\n\n* Add reply ([0929a3404b3](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/commit/0929a3404b39f6e39076a640779b2c1c961e19b5))\n{commits_info * 4}* Add reply ([0929a3404b3](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/commit/0929a3404b39f6e39076a640779b2c1c961e19b5))"
        self.check_webhook(
            "code_push__multiple_committers_with_others", expected_topic_name, expected_message
        )

    def test_push_commits_more_than_limit(self) -> None:
        expected_topic_name = "test-zulip / main"
        commits_info = "* Modify readme ([b0ce2f2009c](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/commit/b0ce2f2009c3c87dbefadf61d7eb2c0697a6f369))\n"
        expected_message = f"Yuro Itaki [pushed](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/branchCompare?baseVersion=GC51515957669f93c543df09f8f3e7f47c3613c879&targetVersion=GCb0ce2f2009c3c87dbefadf61d7eb2c0697a6f369&_a=files) 50 commits to branch main.\n\n{commits_info * COMMITS_LIMIT}[and {50 - COMMITS_LIMIT} more commit(s)]"
        self.check_webhook(
            "code_push__commits_more_than_limit", expected_topic_name, expected_message
        )

    def test_push_remove_branch(self) -> None:
        expected_topic_name = "test-zulip / dev"
        expected_message = "Yuro Itaki [pushed](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/branchCompare?baseVersion=GC0929a3404b39f6e39076a640779b2c1c961e19b5&targetVersion=GC0000000000000000000000000000000000000000&_a=files) the branch dev."
        self.check_webhook("code_push__remove_branch", expected_topic_name, expected_message)

    def test_pull_request_opened(self) -> None:
        expected_topic_name = "test-zulip / PR #1 Add PR request"
        expected_message = "Yuro Itaki created [PR #1 Add PR request](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/1) from `dev` to `main`:\n\n~~~ quote\nAdd PR request\n~~~"
        self.check_webhook("code_pull_request__opened", expected_topic_name, expected_message)

    def test_pull_request_opened_without_description(self) -> None:
        expected_topic_name = "test-zulip / PR #2 Raised 2nd PR!"
        expected_message = "Yuro Itaki created [PR #2 Raised 2nd PR!](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/2) from `stg` to `main`."
        self.check_webhook(
            "code_pull_request__opened_without_description", expected_topic_name, expected_message
        )

    def test_pull_request_merged(self) -> None:
        expected_topic_name = "test-zulip / PR #1 Add PR request"
        expected_message = "Yuro Itaki merged [PR #1 Add PR request](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/1) from `dev` to `main`."
        self.check_webhook("code_pull_request__merged", expected_topic_name, expected_message)

    @patch("zerver.lib.webhooks.common.check_send_webhook_message")
    def test_pull_request_merge_attempted_ignore(
        self, check_send_webhook_message_mock: MagicMock
    ) -> None:
        self.url = self.build_webhook_url()
        payload = self.get_body("code_pull_request__merge_attempted")
        result = self.client_post(self.url, payload, content_type="application/json")
        self.assertFalse(check_send_webhook_message_mock.called)
        self.assert_json_success(result)

    def test_pull_request_updated(self) -> None:
        expected_topic_name = "test-zulip / PR #2 Raised 2nd PR!"
        expected_message = "Yuro Itaki updated [PR #2 Raised 2nd PR!](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/2)\n\n~~~ quote\nYuro Itaki updated the source branch of [pull request 2](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/2) (Raised 2nd PR!) in [test-zulip](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/)\r\nRaised 2nd PR!\r\n\n~~~"
        self.check_webhook("code_pull_request__updated", expected_topic_name, expected_message)
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/azuredevops/view.py
Signals: Django

```python
from collections.abc import Callable

from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.exceptions import UnsupportedWebhookEventTypeError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_int, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.lib.webhooks.git import (
    TOPIC_WITH_BRANCH_TEMPLATE,
    TOPIC_WITH_PR_OR_ISSUE_INFO_TEMPLATE,
    get_pull_request_event_message,
    get_push_commits_event_message,
    is_branch_name_notifiable,
)
from zerver.models import UserProfile


def get_code_pull_request_updated_body(payload: WildValue) -> str:
    return get_pull_request_event_message(
        user_name=get_code_pull_request_user_name(payload),
        action="updated",
        url=get_code_pull_request_url(payload),
        number=get_code_pull_request_id(payload),
        message=payload["detailedMessage"]["markdown"].tame(check_string),
        title=get_code_pull_request_title(payload),
    )


def get_code_pull_request_merged_body(payload: WildValue) -> str:
    return get_pull_request_event_message(
        user_name=get_code_pull_request_user_name(payload),
        action="merged",
        url=get_code_pull_request_url(payload),
        number=get_code_pull_request_id(payload),
        target_branch=payload["resource"]["sourceRefName"]
        .tame(check_string)
        .replace("refs/heads/", ""),
        base_branch=payload["resource"]["targetRefName"]
        .tame(check_string)
        .replace("refs/heads/", ""),
        title=get_code_pull_request_title(payload),
    )


def get_code_pull_request_opened_body(payload: WildValue) -> str:
    if payload["resource"].get("description"):
        description = payload["resource"]["description"].tame(check_string)
    else:
        description = None
    return get_pull_request_event_message(
        user_name=get_code_pull_request_user_name(payload),
        action="created",
        url=get_code_pull_request_url(payload),
        number=get_code_pull_request_id(payload),
        target_branch=payload["resource"]["sourceRefName"]
        .tame(check_string)
        .replace("refs/heads/", ""),
        base_branch=payload["resource"]["targetRefName"]
        .tame(check_string)
        .replace("refs/heads/", ""),
        message=description,
        title=get_code_pull_request_title(payload),
    )


def get_code_push_commits_body(payload: WildValue) -> str:
    compare_url = "{}/branchCompare?baseVersion=GC{}&targetVersion=GC{}&_a=files".format(
        get_code_repository_url(payload),
        payload["resource"]["refUpdates"][0]["oldObjectId"].tame(check_string),
        payload["resource"]["refUpdates"][0]["newObjectId"].tame(check_string),
    )
    commits_data = [
        {
            "name": commit["author"]["name"].tame(check_string),
            "sha": commit["commitId"].tame(check_string),
            "url": "{}/commit/{}".format(
                get_code_repository_url(payload), commit["commitId"].tame(check_string)
            ),
            "message": commit["comment"].tame(check_string),
        }
        for commit in payload["resource"].get("commits", [])
    ]
    return get_push_commits_event_message(
        get_code_push_user_name(payload),
        compare_url,
        get_code_push_branch_name(payload),
        commits_data,
    )


def get_code_push_user_name(payload: WildValue) -> str:
    return payload["resource"]["pushedBy"]["displayName"].tame(check_string)


def get_code_push_branch_name(payload: WildValue) -> str:
    return (
        payload["resource"]["refUpdates"][0]["name"].tame(check_string).replace("refs/heads/", "")
    )


def get_code_repository_name(payload: WildValue) -> str:
    return payload["resource"]["repository"]["name"].tame(check_string)


def get_code_repository_url(payload: WildValue) -> str:
    return payload["resource"]["repository"]["remoteUrl"].tame(check_string)


def get_code_pull_request_id(payload: WildValue) -> int:
    return payload["resource"]["pullRequestId"].tame(check_int)


def get_code_pull_request_title(payload: WildValue) -> str:
    return payload["resource"]["title"].tame(check_string)


def get_code_pull_request_url(payload: WildValue) -> str:
    return payload["resource"]["_links"]["web"]["href"].tame(check_string)


def get_code_pull_request_user_name(payload: WildValue) -> str:
    return payload["resource"]["createdBy"]["displayName"].tame(check_string)


def get_topic_based_on_event(payload: WildValue, event: str) -> str:
    if event == "git.push":
        return TOPIC_WITH_BRANCH_TEMPLATE.format(
            repo=get_code_repository_name(payload), branch=get_code_push_branch_name(payload)
        )
    elif "pullrequest" in event:
        return TOPIC_WITH_PR_OR_ISSUE_INFO_TEMPLATE.format(
            repo=get_code_repository_name(payload),
            type="PR",
            id=get_code_pull_request_id(payload),
            title=get_code_pull_request_title(payload),
        )
    return get_code_repository_name(payload)  # nocoverage


def get_event_name(payload: WildValue, branches: str | None) -> str | None:
    event_name = payload["eventType"].tame(check_string)
    if event_name == "git.push" and branches is not None:
        branch = get_code_push_branch_name(payload)
        if not is_branch_name_notifiable(branch, branches):
            return None
    if event_name == "git.pullrequest.merged":
        status = payload["resource"]["status"].tame(check_string)
        merge_status = payload["resource"]["mergeStatus"].tame(check_string)
        # azure devops sends webhook messages when a merge is attempted, i.e. there is a merge conflict
        # after a PR is created, or when there is no conflict when PR is updated
        # we're only interested in the case when the PR is merged successfully
        if status != "completed" or merge_status != "succeeded":
            return None
    if event_name in EVENT_FUNCTION_MAPPER:
        return event_name
    raise UnsupportedWebhookEventTypeError(event_name)


EVENT_FUNCTION_MAPPER: dict[str, Callable[[WildValue], str]] = {
    "git.push": get_code_push_commits_body,
    "git.pullrequest.created": get_code_pull_request_opened_body,
    "git.pullrequest.merged": get_code_pull_request_merged_body,
    "git.pullrequest.updated": get_code_pull_request_updated_body,
}

ALL_EVENT_TYPES = list(EVENT_FUNCTION_MAPPER.keys())


@webhook_view("AzureDevOps", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_azuredevops_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
    branches: str | None = None,
) -> HttpResponse:
    event = get_event_name(payload, branches)
    if event is None:
        return json_success(request)

    topic_name = get_topic_based_on_event(payload, event)

    body_function = EVENT_FUNCTION_MAPPER[event]
    body = body_function(payload)

    check_send_webhook_message(request, user_profile, topic_name, body)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: code_pull_request__merged.json]---
Location: zulip-main/zerver/webhooks/azuredevops/fixtures/code_pull_request__merged.json

```json
{
    "subscriptionId": "4f1eccb6-04ff-45dd-90aa-713078e5c395",
    "notificationId": 8,
    "id": "d4cbc5f3-be4a-4fa6-80df-bfad83e313c5",
    "eventType": "git.pullrequest.merged",
    "publisherId": "tfs",
    "message": {
      "text": "Merge attempted  for pull request 1 (Add PR request) in test-zulip\r\nhttps://dev.azure.com/ttchong/test-zulip/_git/test-zulip/",
      "html": "Merge attempted  for <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/1\">pull request 1</a> (Add PR request) in <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/\">test-zulip</a>",
      "markdown": "Merge attempted  for [pull request 1](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/1) (Add PR request) in [test-zulip](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/)"
    },
    "detailedMessage": {
      "text": "Merge attempted  for pull request 1 (Add PR request) in test-zulip\r\nhttps://dev.azure.com/ttchong/test-zulip/_git/test-zulip/\r\nAdd PR request\r\n",
      "html": "Merge attempted  for <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/1\">pull request 1</a> (Add PR request) in <a href=\"https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/\">test-zulip</a><p>Add PR request</p>",
      "markdown": "Merge attempted  for [pull request 1](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/1) (Add PR request) in [test-zulip](https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/)\r\nAdd PR request\r\n"
    },
    "resource": {
      "repository": {
        "id": "98f0ce59-a912-43d5-96d2-bc0942a03f7b",
        "name": "test-zulip",
        "url": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b",
        "project": {
          "id": "068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2",
          "name": "test-zulip",
          "url": "https://dev.azure.com/ttchong/_apis/projects/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2",
          "state": "wellFormed",
          "revision": 11,
          "visibility": "private",
          "lastUpdateTime": "2022-07-17T05:01:05.987Z"
        },
        "size": 7840,
        "remoteUrl": "https://ttchong@dev.azure.com/ttchong/test-zulip/_git/test-zulip",
        "sshUrl": "git@ssh.dev.azure.com:v3/ttchong/test-zulip/test-zulip",
        "webUrl": "https://dev.azure.com/ttchong/test-zulip/_git/test-zulip",
        "isDisabled": false
      },
      "pullRequestId": 1,
      "codeReviewId": 1,
      "status": "completed",
      "createdBy": {
        "displayName": "Yuro Itaki",
        "url": "https://spsprodsea2.vssps.visualstudio.com/Aa56cba4a-dc80-4dd2-91fa-6fe7047fea7c/_apis/Identities/107e08c7-2725-675e-a1b0-281729035ea6",
        "_links": {
          "avatar": {
            "href": "https://dev.azure.com/ttchong/_apis/GraphProfile/MemberAvatars/msa.MTA3ZTA4YzctMjcyNS03NzVlLWExYjAtMjgxNzI5MDM1ZWE2"
          }
        },
        "id": "107e08c7-2725-675e-a1b0-281729035ea6",
        "uniqueName": "yuroitaki@email.com",
        "imageUrl": "https://dev.azure.com/ttchong/_api/_common/identityImage?id=107e08c7-2725-675e-a1b0-281729035ea6",
        "descriptor": "msa.MTA3ZTA4YzctMjcyNS03NzVlLWExYjAtMjgxNzI5MDM1ZWE2"
      },
      "creationDate": "2022-07-24T08:02:50.160355Z",
      "closedDate": "2022-07-30T07:55:03.5006647Z",
      "title": "Add PR request",
      "description": "Add PR request",
      "sourceRefName": "refs/heads/dev",
      "targetRefName": "refs/heads/main",
      "mergeStatus": "succeeded",
      "isDraft": false,
      "mergeId": "3cb082bf-62fd-4ff9-81f2-bea41241eadb",
      "lastMergeSourceCommit": {
        "commitId": "179f0b4e4a9318d1907402662b0a416550926ebb",
        "url": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/commits/179f0b4e4a9318d1907402662b0a416550926ebb"
      },
      "lastMergeTargetCommit": {
        "commitId": "6c86f973c0cd02726af8a5da074795745927e0d2",
        "url": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/commits/6c86f973c0cd02726af8a5da074795745927e0d2"
      },
      "lastMergeCommit": {
        "commitId": "b2606c193460441311f4d31f4729589c77f5efe0",
        "author": {
          "name": "Yuro Itaki",
          "email": "yuroitaki@email.com",
          "date": "2022-07-30T07:55:02Z"
        },
        "committer": {
          "name": "Yuro Itaki",
          "email": "yuroitaki@email.com",
          "date": "2022-07-30T07:55:02Z"
        },
        "comment": "Merged PR 1: Add PR request",
        "commentTruncated": true,
        "url": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/commits/b2606c193460441311f4d31f4729589c77f5efe0"
      },
      "reviewers": [],
      "url": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/pullRequests/1",
      "_links": {
        "web": {
          "href": "https://dev.azure.com/ttchong/test-zulip/_git/test-zulip/pullrequest/1"
        },
        "statuses": {
          "href": "https://dev.azure.com/ttchong/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2/_apis/git/repositories/98f0ce59-a912-43d5-96d2-bc0942a03f7b/pullRequests/1/statuses"
        }
      },
      "completionOptions": {
        "mergeCommitMessage": "Merged PR 1: Add PR request\n\nAdd PR request",
        "mergeStrategy": "noFastForward",
        "transitionWorkItems": true,
        "autoCompleteIgnoreConfigIds": []
      },
      "supportsIterations": true,
      "completionQueueTime": "2022-07-30T07:55:02.6159917Z",
      "closedBy": {
        "displayName": "Yuro Itaki",
        "url": "https://spsprodsea2.vssps.visualstudio.com/Aa56cba4a-dc80-4dd2-91fa-6fe7047fea7c/_apis/Identities/107e08c7-2725-675e-a1b0-281729035ea6",
        "_links": {
          "avatar": {
            "href": "https://dev.azure.com/ttchong/_apis/GraphProfile/MemberAvatars/msa.MTA3ZTA4YzctMjcyNS03NzVlLWExYjAtMjgxNzI5MDM1ZWE2"
          }
        },
        "id": "107e08c7-2725-675e-a1b0-281729035ea6",
        "uniqueName": "yuroitaki@email.com",
        "imageUrl": "https://dev.azure.com/ttchong/_api/_common/identityImage?id=107e08c7-2725-675e-a1b0-281729035ea6",
        "descriptor": "msa.MTA3ZTA4YzctMjcyNS03NzVlLWExYjAtMjgxNzI5MDM1ZWE2"
      },
      "artifactId": "vstfs:///Git/PullRequestId/068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2%2f98f0ce59-a912-43d5-96d2-bc0942a03f7b%2f1"
    },
    "resourceVersion": "1.0",
    "resourceContainers": {
      "collection": {
        "id": "ad9e1dcf-6055-4fc7-a146-5511ab5ab1e8",
        "baseUrl": "https://dev.azure.com/ttchong/"
      },
      "account": {
        "id": "a56cba4a-dc80-4dd2-91fa-6fe7047fea7c",
        "baseUrl": "https://dev.azure.com/ttchong/"
      },
      "project": {
        "id": "068d2409-14eb-4d8a-88bf-c8a9e7f5b4e2",
        "baseUrl": "https://dev.azure.com/ttchong/"
      }
    },
    "createdDate": "2022-07-30T07:55:09.816217Z"
}
```

--------------------------------------------------------------------------------

````
