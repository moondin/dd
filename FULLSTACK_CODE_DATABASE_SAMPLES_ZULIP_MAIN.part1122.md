---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1122
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1122 of 1290)

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

---[FILE: derail_worried.json]---
Location: zulip-main/zerver/webhooks/beeminder/fixtures/derail_worried.json

```json
{
    "goal": {
        "slug": "gainweight",
        "title": "Have to get back to the shape I want!",
        "description": null,
        "goalval": 60,
        "rate": null,
        "goaldate": 1515258000,
        "graph_url": "https://bmndr.s3.amazonaws.com/uploads/e5eec384-d736-4a96-a22c-724784598dd0.png",
        "thumb_url": "https://bmndr.s3.amazonaws.com/uploads/e5eec384-d736-4a96-a22c-724784598dd0-thumb.png",
        "goal_type": "gainer",
        "autodata": null,
        "healthkitmetric": "",
        "losedate": 1517759100,
        "deadline": -4500,
        "leadtime": 0,
        "alertstart": 81720,
        "use_defaults": true,
        "id": "5a47c445bfec034a59000d75",
        "ephem": false,
        "queued": false,
        "panic": 54000,
        "updated_at": 1514653620,
        "burner": "frontburner",
        "yaw": 1,
        "lane": 666,
        "lanewidth": 0,
        "delta": 0.5,
        "runits": "d",
        "limsum": "+2 in 7 days (60)",
        "frozen": false,
        "lost": false,
        "won": false,
        "contract": {
            "amount": 0,
            "stepdown_at": null,
            "pending_amount": null,
            "pending_at": null
        },
        "delta_text": "✔ ✔ ✔",
        "safebump": 60,
        "limsumdate": "+2 due Sat by 22:45",
        "limsumdays": "+2 due in 7 days",
        "baremin": "+2",
        "baremintotal": "60",
        "roadstatuscolor": "green",
        "lasttouch": "2017-12-30T16:53:18Z",
        "safebuf": 7,
        "sadbrink": false,
        "coasting": false,
        "fineprint": null,
        "yaxis": "kilograms",
        "nomercy": true,
        "initday": 1514653200,
        "initval": 57.5,
        "curday": 1514653200,
        "curval": 58,
        "lastday": 1514653200,
        "dir": 1,
        "exprd": false,
        "kyoom": false,
        "odom": false,
        "noisy": false,
        "aggday": "max",
        "plotall": false,
        "steppy": false,
        "rosy": true,
        "movingav": true,
        "aura": true,
        "numpts": 2,
        "road": [
            [
                1515258000,
                null,
                0
            ]
        ],
        "roadall": [
            [
                1514653200,
                57.5,
                null
            ],
            [
                1515258000,
                null,
                0
            ],
            [
                1515258000,
                60,
                null
            ]
        ],
        "fullroad": [
            [
                1514653200,
                57.5,
                0
            ],
            [
                1515258000,
                57.5,
                0
            ],
            [
                1515258000,
                60,
                0
            ]
        ],
        "secret": true,
        "pledge": 5,
        "mathishard": [
            1515258000,
            60,
            0
        ],
        "headsum": "Coasting on a currently flat yellow brick road",
        "datapublic": false,
        "graphsum": "58 on 2017.12.30 (1 datapoint in 1 day) targeting 60 on 2018.01.06 (7 more days). Yellow Brick Rd = +0 / day.",
        "rah": 60,
        "last_datapoint": {
            "timestamp": 1514654099,
            "value": 58,
            "comment": "",
            "id": "5a47c47ebfec034a4e0036b3",
            "updated_at": 1514652798,
            "requestid": null,
            "canonical": "30 58",
            "fulltext": "2017-Dec-30 entered at 22:23 via Beeminder Web",
            "origin": "Beeminder Web",
            "daystamp": "20171230"
        },
        "callback_url": null
    }
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/bitbucket/doc.md

```text
Zulip supports both Git and Mercurial notifications from
Bitbucket. This integration is for the old-style Bitbucket
webhooks used by Bitbucket Enterprise.

{!create-channel.md!}

The integration will use the default channel `commits` if no
channel is supplied in the hook; you still need to create the
channel even if you are using this default.

Next, from your repository's web page, go to the **Administration**
page and choose **Hooks** on the left-hand side. Choose the **POST**
hook from the list presented and click **Add hook**.

{!webhook-url-with-bot-email.md!}

By default, notifications are sent to the `commits` channel. To
send notifications to a different channel, append
`?stream=channel_name` to the URL.

{!congrats.md!}

![](/static/images/integrations/bitbucket/002.png)
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/bitbucket/tests.py

```python
from unittest.mock import MagicMock, patch

from zerver.lib.test_classes import WebhookTestCase

TOPIC = "Repository name"
TOPIC_BRANCH_EVENTS = "Repository name / master"


class BitbucketHookTests(WebhookTestCase):
    CHANNEL_NAME = "bitbucket"
    URL_TEMPLATE = "/api/v1/external/bitbucket?stream={stream}"
    WEBHOOK_DIR_NAME = "bitbucket"

    def test_bitbucket_on_push_event(self) -> None:
        fixture_name = "push"
        self.url = self.build_webhook_url(payload=self.get_body(fixture_name))
        commit_info = "* c ([25f93d22b71](https://bitbucket.org/kolaszek/repository-name/commits/25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12))"
        expected_message = f"kolaszek pushed 1 commit to branch master.\n\n{commit_info}"
        self.api_channel_message(
            self.test_user, fixture_name, TOPIC_BRANCH_EVENTS, expected_message
        )

    def test_bitbucket_on_push_event_without_user_info(self) -> None:
        fixture_name = "push_without_user_info"
        self.url = self.build_webhook_url(payload=self.get_body(fixture_name))
        commit_info = "* c ([25f93d22b71](https://bitbucket.org/kolaszek/repository-name/commits/25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12))"
        expected_message = (
            f"Someone pushed 1 commit to branch master. Commits by eeshangarg (1).\n\n{commit_info}"
        )
        self.api_channel_message(
            self.test_user, fixture_name, TOPIC_BRANCH_EVENTS, expected_message
        )

    def test_bitbucket_on_push_event_filtered_by_branches(self) -> None:
        fixture_name = "push"
        self.url = self.build_webhook_url(
            payload=self.get_body(fixture_name), branches="master,development"
        )
        commit_info = "* c ([25f93d22b71](https://bitbucket.org/kolaszek/repository-name/commits/25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12))"
        expected_message = f"kolaszek pushed 1 commit to branch master.\n\n{commit_info}"
        self.api_channel_message(
            self.test_user, fixture_name, TOPIC_BRANCH_EVENTS, expected_message
        )

    def test_bitbucket_on_push_commits_above_limit_event(self) -> None:
        fixture_name = "push_commits_above_limit"
        self.url = self.build_webhook_url(payload=self.get_body(fixture_name))
        commit_info = "* c ([25f93d22b71](https://bitbucket.org/kolaszek/repository-name/commits/25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12))\n"
        expected_message = f"kolaszek pushed 50 commits to branch master.\n\n{commit_info * 20}[and 30 more commit(s)]"
        self.api_channel_message(
            self.test_user, fixture_name, TOPIC_BRANCH_EVENTS, expected_message
        )

    def test_bitbucket_on_push_commits_above_limit_event_filtered_by_branches(self) -> None:
        fixture_name = "push_commits_above_limit"
        self.url = self.build_webhook_url(
            payload=self.get_body(fixture_name), branches="master,development"
        )
        commit_info = "* c ([25f93d22b71](https://bitbucket.org/kolaszek/repository-name/commits/25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12))\n"
        expected_message = f"kolaszek pushed 50 commits to branch master.\n\n{commit_info * 20}[and 30 more commit(s)]"
        self.api_channel_message(
            self.test_user, fixture_name, TOPIC_BRANCH_EVENTS, expected_message
        )

    def test_bitbucket_on_force_push_event(self) -> None:
        fixture_name = "force_push"
        self.url = self.build_webhook_url(payload=self.get_body(fixture_name))
        expected_message = (
            "kolaszek [force pushed](https://bitbucket.org/kolaszek/repository-name)."
        )
        self.api_channel_message(self.test_user, fixture_name, TOPIC, expected_message)

    def test_bitbucket_on_force_push_event_without_user_info(self) -> None:
        fixture_name = "force_push_without_user_info"
        self.url = self.build_webhook_url(payload=self.get_body(fixture_name))
        expected_message = (
            "Someone [force pushed](https://bitbucket.org/kolaszek/repository-name/)."
        )
        self.api_channel_message(self.test_user, fixture_name, TOPIC, expected_message)

    @patch("zerver.webhooks.bitbucket.view.check_send_webhook_message")
    def test_bitbucket_on_push_event_filtered_by_branches_ignore(
        self, check_send_webhook_message_mock: MagicMock
    ) -> None:
        fixture_name = "push"
        payload = self.get_body(fixture_name)
        self.url = self.build_webhook_url(payload=payload, branches="changes,development")
        result = self.api_post(self.test_user, self.url, payload, content_type="application/json,")
        self.assertFalse(check_send_webhook_message_mock.called)
        self.assert_json_success(result)

    @patch("zerver.webhooks.bitbucket.view.check_send_webhook_message")
    def test_bitbucket_push_commits_above_limit_filtered_by_branches_ignore(
        self, check_send_webhook_message_mock: MagicMock
    ) -> None:
        fixture_name = "push_commits_above_limit"
        payload = self.get_body(fixture_name)
        self.url = self.build_webhook_url(payload=payload, branches="changes,development")
        result = self.api_post(self.test_user, self.url, payload, content_type="application/json,")
        self.assertFalse(check_send_webhook_message_mock.called)
        self.assert_json_success(result)
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/bitbucket/view.py
Signals: Django

```python
from django.http import HttpRequest, HttpResponse

from zerver.decorator import authenticated_rest_api_view
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.lib.webhooks.git import (
    TOPIC_WITH_BRANCH_TEMPLATE,
    get_push_commits_event_message,
    is_branch_name_notifiable,
)
from zerver.models import UserProfile


@authenticated_rest_api_view(webhook_client_name="Bitbucket")
@typed_endpoint
def api_bitbucket_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
    branches: str | None = None,
) -> HttpResponse:
    repository = payload["repository"]

    commits = [
        {
            "name": (
                commit["author"].tame(check_string)
                if "author" in commit
                else payload.get("user", "Someone").tame(check_string)
            ),
            "sha": commit["raw_node"].tame(check_string),
            "message": commit["message"].tame(check_string),
            "url": "{}{}commits/{}".format(
                payload["canon_url"].tame(check_string),
                repository["absolute_url"].tame(check_string),
                commit["raw_node"].tame(check_string),
            ),
        }
        for commit in payload["commits"]
    ]

    if len(commits) == 0:
        # Bitbucket doesn't give us enough information to really give
        # a useful message :/
        topic_name = repository["name"].tame(check_string)
        content = "{} [force pushed]({}).".format(
            payload.get("user", "Someone").tame(check_string),
            payload["canon_url"].tame(check_string) + repository["absolute_url"].tame(check_string),
        )
    else:
        branch = payload["commits"][-1]["branch"].tame(check_string)
        if not is_branch_name_notifiable(branch, branches):
            return json_success(request)

        committer = payload.get("user", "Someone").tame(check_string)
        content = get_push_commits_event_message(committer, None, branch, commits)
        topic_name = TOPIC_WITH_BRANCH_TEMPLATE.format(
            repo=repository["name"].tame(check_string), branch=branch
        )

    check_send_webhook_message(
        request, user_profile, topic_name, content, unquote_url_parameters=True
    )
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: force_push.json]---
Location: zulip-main/zerver/webhooks/bitbucket/fixtures/force_push.json

```json
{
   "repository":{
      "name":"Repository name",
      "absolute_url": "kolaszek/repository-name"
   },
   "user":"kolaszek",
   "commits":[],
   "canon_url": "https://bitbucket.org/"
}
```

--------------------------------------------------------------------------------

---[FILE: force_push_without_user_info.json]---
Location: zulip-main/zerver/webhooks/bitbucket/fixtures/force_push_without_user_info.json

```json
{
    "canon_url": "https://bitbucket.org/",
    "commits":[],
    "repository":{
        "name": "Repository name",
        "absolute_url": "kolaszek/repository-name/",
        "fork": false,
        "is_private": true,
        "scm": "git",
        "owner": "kolaszek",
        "website": ""
    },
    "truncated": false,
    "user_uuid": "387gs94h-2lk0-4sdb-b23f-71234rhty871"
}
```

--------------------------------------------------------------------------------

---[FILE: push.json]---
Location: zulip-main/zerver/webhooks/bitbucket/fixtures/push.json

```json
{
   "repository":{
      "name":"Repository name",
      "absolute_url": "kolaszek/repository-name/"
   },
   "user":"kolaszek",
   "commits":[
               {
                  "message":"c\n",
                  "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
                  "branch": "master"
               }
            ],
   "canon_url": "https://bitbucket.org/"
}
```

--------------------------------------------------------------------------------

---[FILE: push_commits_above_limit.json]---
Location: zulip-main/zerver/webhooks/bitbucket/fixtures/push_commits_above_limit.json

```json
{
   "repository":{
      "name":"Repository name",
      "absolute_url": "kolaszek/repository-name/"
   },
   "user":"kolaszek",
   "commits":[
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      },
      {
         "message":"c\n",
         "raw_node":"25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
         "branch": "master"
      }
   ],
   "canon_url": "https://bitbucket.org/"
}
```

--------------------------------------------------------------------------------

---[FILE: push_without_user_info.json]---
Location: zulip-main/zerver/webhooks/bitbucket/fixtures/push_without_user_info.json

```json
{
    "repository":{
        "name": "Repository name",
        "absolute_url": "kolaszek/repository-name/"
    },
    "commits":[
        {
            "author": "eeshangarg",
            "message": "c\n",
            "raw_node": "25f93d22b719e2d678a7ad5ee0ef0d1fcdf39c12",
            "branch": "master"
        }
    ],
    "canon_url": "https://bitbucket.org/"
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/bitbucket2/doc.md

```text
# Zulip Bitbucket integration

Zulip supports both Git and Mercurial notifications from
Bitbucket. This integration is for the new-style Bitbucket
webhooks used by the Bitbucket SAAS service.

For the old-style Bitbucket webhooks used by Bitbucket Enterprise,
click [here](./bitbucket), and for the new-style webhooks used by
Bitbucket Server click [here](./bitbucket3).

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-with-branch-filtering.md!}

1. On your repository's web page, go to **Settings**. Select
   **Webhooks**, and then click **Add webhook**.

1. Set **Title** to a title of your choice, such as `Zulip`. Set **URL**
   to the URL generated above, and toggle the **Active** checkbox.
   Select the **Triggers** you'd like to be notified about, and click
   **Save**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/bitbucket/003.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

````
