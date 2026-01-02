---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1136
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1136 of 1290)

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
Location: zulip-main/zerver/webhooks/canarytoken/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class CanarytokensHookTests(WebhookTestCase):
    CHANNEL_NAME = "canarytoken"
    URL_TEMPLATE = "/api/v1/external/canarytoken?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "canarytoken"

    def test_canarytoken_new(self) -> None:
        expected_message = (
            "**:alert: Canarytoken has been triggered on <time:2020-06-09T14:04:39+00:00>!**\n\n"
            "Congrats! The newly saved webhook works \n\n"
            "[Manage this canarytoken](http://example.com/test/url/for/webhook)"
        )

        self.check_webhook(
            "canarytoken_new",
            "canarytoken alert",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_canarytoken_real(self) -> None:
        expected_message = (
            "**:alert: Canarytoken has been triggered on <time:2020-06-09T14:04:47+00:00>!**\n\n"
            "Canarytoken example \n\n"
            "[Manage this canarytoken]"
            "(https://canarytokens.org/manage?token=foo&auth=bar)"
        )

        self.check_webhook(
            "canarytoken_real",
            "canarytoken alert",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_canarytoken_with_specific_topic(self) -> None:
        self.url = self.build_webhook_url(topic="foo")
        expected_message = (
            "**:alert: Canarytoken has been triggered on <time:2020-06-09T14:04:47+00:00>!**\n\n"
            "Canarytoken example \n\n"
            "[Manage this canarytoken]"
            "(https://canarytokens.org/manage?token=foo&auth=bar)"
        )

        self.check_webhook(
            "canarytoken_real",
            "foo",
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/canarytoken/view.py
Signals: Django

```python
# Webhooks for external integrations.

from datetime import datetime

from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.response import json_success
from zerver.lib.timestamp import datetime_to_global_time
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import OptionalUserSpecifiedTopicStr, check_send_webhook_message
from zerver.models import UserProfile


@webhook_view("Canarytokens")
@typed_endpoint
def api_canarytoken_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    message: JsonBodyPayload[WildValue],
    user_specified_topic: OptionalUserSpecifiedTopicStr = None,
) -> HttpResponse:
    """
    Construct a response to a webhook event from a Thinkst canarytoken from
    canarytokens.org. Canarytokens from Thinkst's paid product have a different
    schema and should use the "thinkst" integration. See linked documentation
    below for a schema:

    https://help.canary.tools/hc/en-gb/articles/360002426577-How-do-I-configure-notifications-for-a-Generic-Webhook-
    """
    topic_name = "canarytoken alert"
    time = message["time"].tame(check_string)
    formatted_time = datetime_to_global_time(
        datetime.fromisoformat(time.replace("(UTC)", "").strip() + "+00:00")
    )
    body = (
        f"**:alert: Canarytoken has been triggered on {formatted_time}!**\n\n"
        f"{message['memo'].tame(check_string)} \n\n"
        f"[Manage this canarytoken]({message['manage_url'].tame(check_string)})"
    )

    if user_specified_topic:
        topic_name = user_specified_topic

    check_send_webhook_message(request, user_profile, topic_name, body)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: canarytoken_new.json]---
Location: zulip-main/zerver/webhooks/canarytoken/fixtures/canarytoken_new.json

```json
{
  "manage_url": "http://example.com/test/url/for/webhook",
  "memo": "Congrats! The newly saved webhook works",
  "additional_data": {
    "src_ip": "1.1.1.1",
    "useragent": "Mozilla/5.0...",
    "referer": "http://example.com/referrer",
    "location": "http://example.com/location"
  },
  "channel": "HTTP",
  "time": "2020-06-09 14:04:39"
}
```

--------------------------------------------------------------------------------

---[FILE: canarytoken_real.json]---
Location: zulip-main/zerver/webhooks/canarytoken/fixtures/canarytoken_real.json

```json
{
  "manage_url": "https://canarytokens.org/manage?token=foo&auth=bar",
  "memo": "Canarytoken example",
  "additional_data": {
    "src_ip": "81.151.13.3",
    "useragent": "Mozilla/5.0 (X11; Linux x86_64; rv:76.0) Gecko/20100101 Firefox/76.0",
    "referer": null,
    "location": null
  },
  "channel": "HTTP",
  "time": "2020-06-09 14:04:47 (UTC)"
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/circleci/doc.md

```text
# Zulip CircleCI integration

Zulip supports integration with CircleCI and can notify you of your
job and workflow statuses. This integration currently supports using
CircleCI with GitHub, BitBucket and GitLab.

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to **Project Settings** in your project on CircleCI. Select
   **Webhooks** from the list on the left, and click **Add Webhook**.

1. In the form that opens, give your webhook a name and set the
   **Receiver URL** field to the URL generated above. Choose the
   [events](#filtering-incoming-events) you'd like to be notified about,
   and click **Add Webhook**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/circleci/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/circleci/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class CircleCiHookTests(WebhookTestCase):
    CHANNEL_NAME = "circleci"
    URL_TEMPLATE = "/api/v1/external/circleci?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "circleci"

    def test_ping(self) -> None:
        expected_topic_name = "Test event"
        expected_message = "Webhook 'Testing' test event successful."
        self.check_webhook("ping", expected_topic_name, expected_message)

    def test_bitbucket_job_completed(self) -> None:
        expected_topic_name = "circleci-webhook-testing"
        expected_message = """
Job `build-and-test` within Pipeline #4 has succeeded.

Triggered on [`8ab595d2de9: app.py edited online with Bitbucket`](https://bitbucket.org/hariprashant1/circleci-webhook-testing/commits/8ab595d2de95767993472837df2cb7884519a92b) on branch `master` by Hari Prashant Bhimaraju.
""".strip()
        self.check_webhook("bitbucket_job_completed", expected_topic_name, expected_message)

    def test_bitbucket_manual_workflow_completed(self) -> None:
        expected_topic_name = "circleci-webhook-testing"
        expected_message = """
Workflow [`sample`](https://app.circleci.com/pipelines/bitbucket/hariprashant1/circleci-webhook-testing/2/workflows/baa45986-84db-47a0-bc6c-89e9fe751bc9) within Pipeline #2 has succeeded.

Triggered on `master`'s HEAD on [cab5eacb4cc](https://bitbucket.org/hariprashant1/circleci-webhook-testing/commits/cab5eacb4ccee2710529894425341fa20a48fe6a).
""".strip()
        self.check_webhook(
            "bitbucket_manual_workflow_completed", expected_topic_name, expected_message
        )

    def test_bitbucket_workflow_completed(self) -> None:
        expected_topic_name = "circleci-webhook-testing"
        expected_message = """
Workflow [`sample`](https://app.circleci.com/pipelines/bitbucket/hariprashant1/circleci-webhook-testing/4/workflows/fd29ef0c-3e39-4c8f-b1d5-d8be1bab8165) within Pipeline #4 has succeeded.

Triggered on [`8ab595d2de9: app.py edited online with Bitbucket`](https://bitbucket.org/hariprashant1/circleci-webhook-testing/commits/8ab595d2de95767993472837df2cb7884519a92b) on branch `master` by Hari Prashant Bhimaraju.
""".strip()
        self.check_webhook("bitbucket_workflow_completed", expected_topic_name, expected_message)

    def test_github_job_completed(self) -> None:
        expected_topic_name = "main branch - build notifications"
        expected_message = """
Job `build-and-test` within Pipeline #4 has succeeded.

Triggered on [`a5e30a90822: Fix remove-op on reaction event.`](https://github.com/zulip-testing/circleci-webhook-test/commit/a5e30a908224e46626a796d058289475f6d387b5) on branch `main` by Hari Prashant Bhimaraju.
""".strip()
        self.check_webhook("github_job_completed", expected_topic_name, expected_message)

    def test_github_tag_workflow_completed(self) -> None:
        expected_topic_name = "circleci-webhook-test"
        expected_message = """
Workflow [`sample`](https://app.circleci.com/pipelines/github/prah23/circleci-webhook-test/20/workflows/045c6271-78e2-4802-8a62-f4fa6d25d0c9) within Pipeline #20 has succeeded.

Triggered on the latest tag on [0e6e66c14e6](https://github.com/prah23/circleci-webhook-test/commit/0e6e66c14e61fbcd95db716b0f30d67dbcce7814).
""".strip()
        self.check_webhook("github_tag_workflow_completed", expected_topic_name, expected_message)

    def test_github_workflow_completed(self) -> None:
        expected_topic_name = "circleci-webhook-test"
        expected_message = """
Workflow [`sample`](https://app.circleci.com/pipelines/github/zulip-testing/circleci-webhook-test/4/workflows/7381218b-d04c-4aa3-b8b8-8c00a9319d1f) within Pipeline #4 has succeeded.

Triggered on [`a5e30a90822: .circleci: Update Webhook URL.`](https://github.com/zulip-testing/circleci-webhook-test/commit/a5e30a908224e46626a796d058289475f6d387b5) on branch `main` by Hari Prashant Bhimaraju.
""".strip()
        self.check_webhook("github_workflow_completed", expected_topic_name, expected_message)

    def test_gitlab_job_completed(self) -> None:
        expected_topic_name = "circleci-webhook-test"
        expected_message = """
Job `build-and-test` within Pipeline #3 has succeeded.

Triggered on [`c31f86994c5: app: Enhance message within hello().`](https://gitlab.com/zulip-testing/circleci-webhook-test/-/commit/c31f86994c54672f97b5bd5e544315b7bd40e4c1) on branch `main` by Hari Prashant Bhimaraju.
""".strip()
        self.check_webhook("gitlab_job_completed", expected_topic_name, expected_message)

    def test_gitlab_workflow_completed(self) -> None:
        expected_topic_name = "circleci-webhook-test"
        expected_message = """
Workflow [`sample`](https://app.circleci.com/pipelines/circleci/89xcrx7UvWQfzcUPAEmu5Q/63AY3yf3XeUQojmQcGZTtB/3/workflows/b23ceb64-127a-4075-a27c-d204a7a0a3b3) within Pipeline #3 has succeeded.

Triggered on [`c31f86994c5: app: Enhance message within hello().`](https://gitlab.com/zulip-testing/circleci-webhook-test/-/commit/c31f86994c54672f97b5bd5e544315b7bd40e4c1) on branch `main` by Hari Prashant Bhimaraju.
""".strip()
        self.check_webhook("gitlab_workflow_completed", expected_topic_name, expected_message)
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/circleci/view.py
Signals: Django

```python
from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _

from zerver.decorator import webhook_view
from zerver.lib.exceptions import JsonableError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import (
    WildValue,
    check_int,
    check_none_or,
    check_string,
    check_string_in,
    check_url,
)
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.lib.webhooks.git import get_short_sha
from zerver.models import UserProfile

outcome_to_formatted_status_map = {
    "success": "has succeeded",
    "failed": "has failed",
    "canceled": "was canceled",
    "unauthorized": "was unauthorized",
    "error": "had an error",
}

GITHUB_COMMIT_LINK = "{target_repository_url}/commit/{commit_sha}"

BITBUCKET_COMMIT_LINK = "{target_repository_url}/commits/{commit_sha}"

GITLAB_COMMIT_LINK = "{web_url}/-/commit/{commit_sha}"

FULL_COMMIT_INFO_TEMPLATE = """
Triggered on [`{commit_details}`]({commit_link}) on branch `{branch_name}` by {author_name}.
"""

MANUAL_TRIGGER_INFO_TEMPLATE = """
Triggered on `{branch_name}`'s HEAD on [{commit_sha}]({commit_link}).
"""

TAG_TRIGGER_INFO_TEMPLATE = """
Triggered on the latest tag on [{commit_sha}]({commit_link}).
"""

WORKFLOW_BODY_TEMPLATE = """
Workflow [`{workflow_name}`]({workflow_url}) within Pipeline #{pipeline_number} {formatted_status}.
{commit_details}
"""

JOB_BODY_TEMPLATE = """
Job `{job_name}` within Pipeline #{pipeline_number} {formatted_status}.
{commit_details}
"""

ALL_EVENT_TYPES = ["ping", "job-completed", "workflow-completed"]


@webhook_view("CircleCI", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_circleci_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    type = payload["type"].tame(check_string)
    if type == "ping":
        # Ping events don't have full payloads, so our normal codepath won't work
        topic_name = "Test event"
        body = "Webhook '{name}' test event successful.".format(
            name=payload["webhook"]["name"].tame(check_string)
        )
    else:
        topic_name = get_topic(payload)
        body = get_body(payload)

        # We currently don't support projects using VCS providers other than GitHub,
        # BitBucket and GitLab.
        pipeline = payload["pipeline"]
        if (
            "trigger_parameters" in pipeline
            and pipeline["trigger"]["type"].tame(check_string) != "gitlab"
        ):
            raise JsonableError(
                _("Projects using this version control system provider aren't supported")
            )  # nocoverage

    check_send_webhook_message(
        request,
        user_profile,
        topic_name,
        body,
        payload["type"].tame(check_string),
    )
    return json_success(request)


def get_topic(payload: WildValue) -> str:
    return payload["project"]["name"].tame(check_string)


def get_commit_details(payload: WildValue) -> str:
    if "vcs" in payload["pipeline"]:  # GitHub and BitBucket associated pipelines.
        revision = payload["pipeline"]["vcs"]["revision"].tame(check_string)
        commit_id = get_short_sha(revision)

        if payload["pipeline"]["vcs"]["provider_name"].tame(check_string) == "github":
            commit_link = GITHUB_COMMIT_LINK.format(
                target_repository_url=payload["pipeline"]["vcs"]["target_repository_url"].tame(
                    check_url
                ),
                commit_sha=revision,
            )
        else:
            commit_link = BITBUCKET_COMMIT_LINK.format(
                target_repository_url=payload["pipeline"]["vcs"]["target_repository_url"].tame(
                    check_url
                ),
                commit_sha=revision,
            )

        branch = payload["pipeline"]["vcs"]["branch"].tame(check_none_or(check_string))
        commit_subject = payload["pipeline"]["vcs"]["commit"]["subject"].tame(
            check_none_or(check_string)
        )
        if not commit_subject:
            # Manually triggered pipelines (possible only for GitHub and BitBucket projects currently).
            if not branch:
                return TAG_TRIGGER_INFO_TEMPLATE.format(
                    commit_sha=commit_id, commit_link=commit_link
                )
            return MANUAL_TRIGGER_INFO_TEMPLATE.format(
                branch_name=branch, commit_sha=commit_id, commit_link=commit_link
            )

        commit_details = f"{commit_id}: {commit_subject}"
        author_name = payload["pipeline"]["vcs"]["commit"]["author"]["name"].tame(check_string)

    else:  # Other providers (GitLab).
        commit_title = payload["pipeline"]["trigger_parameters"]["gitlab"]["commit_title"].tame(
            check_string
        )
        checkout_sha = payload["pipeline"]["trigger_parameters"]["gitlab"]["checkout_sha"].tame(
            check_string
        )
        commit_id = get_short_sha(checkout_sha)
        commit_details = f"{commit_id}: {commit_title}"

        author_name = payload["pipeline"]["trigger_parameters"]["gitlab"][
            "commit_author_name"
        ].tame(check_string)

        commit_link = GITLAB_COMMIT_LINK.format(
            web_url=payload["pipeline"]["trigger_parameters"]["gitlab"]["web_url"].tame(check_url),
            commit_sha=checkout_sha,
        )

        branch = payload["pipeline"]["trigger_parameters"]["gitlab"]["branch"].tame(check_string)

    return FULL_COMMIT_INFO_TEMPLATE.format(
        commit_details=commit_details,
        commit_link=commit_link,
        author_name=author_name,
        branch_name=branch,
    )


def get_body(payload: WildValue) -> str:
    pipeline_number = payload["pipeline"]["number"].tame(check_int)
    commit_details = get_commit_details(payload)
    payload_type = payload["type"].tame(check_string_in(["job-completed", "workflow-completed"]))

    if payload_type == "job-completed":
        job_name = payload["job"]["name"].tame(check_string)
        status = payload["job"]["status"].tame(check_string)
        formatted_status = outcome_to_formatted_status_map.get(status)
        return JOB_BODY_TEMPLATE.format(
            job_name=job_name,
            pipeline_number=pipeline_number,
            formatted_status=formatted_status,
            commit_details=commit_details,
        )

    else:
        workflow_name = payload["workflow"]["name"].tame(check_string)
        workflow_url = payload["workflow"]["url"].tame(check_url)
        status = payload["workflow"]["status"].tame(check_string)
        formatted_status = outcome_to_formatted_status_map.get(status)
        return WORKFLOW_BODY_TEMPLATE.format(
            workflow_name=workflow_name,
            workflow_url=workflow_url,
            pipeline_number=pipeline_number,
            formatted_status=formatted_status,
            commit_details=commit_details,
        )
```

--------------------------------------------------------------------------------

---[FILE: bitbucket_job_completed.json]---
Location: zulip-main/zerver/webhooks/circleci/fixtures/bitbucket_job_completed.json

```json
{
    "happened_at": "2022-11-07T15:42:15.023009Z",
    "pipeline": {
        "id": "c0c9b267-b287-4c3f-ba40-bcbcc61bcf4c",
        "number": 4,
        "created_at": "2022-11-07T15:41:35.870Z",
        "trigger": {
            "type": "webhook"
        },
        "vcs": {
            "provider_name": "bitbucket",
            "origin_repository_url": "https://bitbucket.org/hariprashant1/circleci-webhook-testing",
            "target_repository_url": "https://bitbucket.org/hariprashant1/circleci-webhook-testing",
            "revision": "8ab595d2de95767993472837df2cb7884519a92b",
            "commit": {
                "subject": "app.py edited online with Bitbucket",
                "body": "",
                "author": {
                    "name": "Hari Prashant Bhimaraju",
                    "email": "hariprashant17@gmail.com"
                },
                "authored_at": "2022-11-07T15:39:51Z",
                "committer": {
                    "name": null,
                    "email": null
                },
                "committed_at": null
            },
            "branch": "master"
        }
    },
    "webhook": {
        "id": "cb3565f3-a064-457c-ae20-45c21892721d",
        "name": "Webhook Site - Testing"
    },
    "type": "job-completed",
    "organization": {
        "id": "c6f6a77e-03f9-4d15-ba42-7ccb1b765dd8",
        "name": "hariprashant1"
    },
    "workflow": {
        "id": "fd29ef0c-3e39-4c8f-b1d5-d8be1bab8165",
        "name": "sample",
        "created_at": "2022-11-07T15:41:36.135Z",
        "stopped_at": "2022-11-07T15:42:14.944Z",
        "url": "https://app.circleci.com/pipelines/bitbucket/hariprashant1/circleci-webhook-testing/4/workflows/fd29ef0c-3e39-4c8f-b1d5-d8be1bab8165"
    },
    "project": {
        "id": "171594bb-8f19-4010-a3f6-5ae0007e109a",
        "name": "circleci-webhook-testing",
        "slug": "bitbucket/hariprashant1/circleci-webhook-testing"
    },
    "id": "381567cf-8247-3b82-b0ff-352a901ecbdb",
    "job": {
        "id": "0978b96a-7044-4ee0-ad60-0a4aa1668dda",
        "name": "build-and-test",
        "started_at": "2022-11-07T15:41:38.124Z",
        "stopped_at": "2022-11-07T15:42:14.944Z",
        "status": "success",
        "number": 4
    }
}
```

--------------------------------------------------------------------------------

---[FILE: bitbucket_manual_workflow_completed.json]---
Location: zulip-main/zerver/webhooks/circleci/fixtures/bitbucket_manual_workflow_completed.json

```json
{
    "type": "workflow-completed",
    "id": "2039ae23-831c-3e12-a905-e3a1dc24e2d6",
    "happened_at": "2022-11-07T11:45:47.000864Z",
    "webhook": {
        "id": "cb3565f3-a064-457c-ae20-45c21892721d",
        "name": "Webhook Site - Testing"
    },
    "workflow": {
        "id": "baa45986-84db-47a0-bc6c-89e9fe751bc9",
        "name": "sample",
        "created_at": "2022-11-07T11:45:36.683Z",
        "stopped_at": "2022-11-07T11:45:46.906Z",
        "url": "https://app.circleci.com/pipelines/bitbucket/hariprashant1/circleci-webhook-testing/2/workflows/baa45986-84db-47a0-bc6c-89e9fe751bc9",
        "status": "success"
    },
    "pipeline": {
        "id": "20d131f5-8cc3-472e-ac7f-346c7f6f2a49",
        "number": 2,
        "created_at": "2022-11-07T11:45:36.570Z",
        "trigger": {
            "type": "api"
        },
        "vcs": {
            "provider_name": "bitbucket",
            "origin_repository_url": "https://bitbucket.org/hariprashant1/circleci-webhook-testing",
            "target_repository_url": "https://bitbucket.org/hariprashant1/circleci-webhook-testing",
            "revision": "cab5eacb4ccee2710529894425341fa20a48fe6a",
            "commit": {
                "subject": null,
                "body": null,
                "author": {
                    "name": null,
                    "email": null
                },
                "authored_at": null,
                "committer": {
                    "name": null,
                    "email": null
                },
                "committed_at": null
            },
            "branch": "master"
        }
    },
    "project": {
        "id": "171594bb-8f19-4010-a3f6-5ae0007e109a",
        "name": "circleci-webhook-testing",
        "slug": "bitbucket/hariprashant1/circleci-webhook-testing"
    },
    "organization": {
        "id": "c6f6a77e-03f9-4d15-ba42-7ccb1b765dd8",
        "name": "hariprashant1"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: bitbucket_workflow_completed.json]---
Location: zulip-main/zerver/webhooks/circleci/fixtures/bitbucket_workflow_completed.json

```json
{
    "type": "workflow-completed",
    "id": "5cec7374-2683-3717-a1d8-d7e2a47198ac",
    "happened_at": "2022-11-07T15:42:15.076628Z",
    "webhook": {
        "id": "cb3565f3-a064-457c-ae20-45c21892721d",
        "name": "Webhook Site - Testing"
    },
    "workflow": {
        "id": "fd29ef0c-3e39-4c8f-b1d5-d8be1bab8165",
        "name": "sample",
        "created_at": "2022-11-07T15:41:36.135Z",
        "stopped_at": "2022-11-07T15:42:14.944Z",
        "url": "https://app.circleci.com/pipelines/bitbucket/hariprashant1/circleci-webhook-testing/4/workflows/fd29ef0c-3e39-4c8f-b1d5-d8be1bab8165",
        "status": "success"
    },
    "pipeline": {
        "id": "c0c9b267-b287-4c3f-ba40-bcbcc61bcf4c",
        "number": 4,
        "created_at": "2022-11-07T15:41:35.870Z",
        "trigger": {
            "type": "webhook"
        },
        "vcs": {
            "provider_name": "bitbucket",
            "origin_repository_url": "https://bitbucket.org/hariprashant1/circleci-webhook-testing",
            "target_repository_url": "https://bitbucket.org/hariprashant1/circleci-webhook-testing",
            "revision": "8ab595d2de95767993472837df2cb7884519a92b",
            "commit": {
                "subject": "app.py edited online with Bitbucket",
                "body": "",
                "author": {
                    "name": "Hari Prashant Bhimaraju",
                    "email": "hariprashant17@gmail.com"
                },
                "authored_at": "2022-11-07T15:39:51Z",
                "committer": {
                    "name": null,
                    "email": null
                },
                "committed_at": null
            },
            "branch": "master"
        }
    },
    "project": {
        "id": "171594bb-8f19-4010-a3f6-5ae0007e109a",
        "name": "circleci-webhook-testing",
        "slug": "bitbucket/hariprashant1/circleci-webhook-testing"
    },
    "organization": {
        "id": "c6f6a77e-03f9-4d15-ba42-7ccb1b765dd8",
        "name": "hariprashant1"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: github_job_completed.json]---
Location: zulip-main/zerver/webhooks/circleci/fixtures/github_job_completed.json

```json
{
    "happened_at": "2022-09-20T12:54:38.685719Z",
    "pipeline": {
      "id": "877c620f-900a-455b-ad51-1a772b5a3eab",
      "number": 4,
      "created_at": "2022-09-20T12:48:46.741Z",
      "trigger": {
        "type": "webhook"
      },
      "vcs": {
        "provider_name": "github",
        "origin_repository_url": "https://github.com/zulip-testing/circleci-webhook-test",
        "target_repository_url": "https://github.com/zulip-testing/circleci-webhook-test",
        "revision": "a5e30a908224e46626a796d058289475f6d387b5",
        "commit": {
          "subject": "Fix remove-op on reaction event.",
          "body": "",
          "author": {
            "name": "Hari Prashant Bhimaraju",
            "email": "haripb01@gmail.com"
          },
          "authored_at": "2022-09-20T12:48:34Z",
          "committer": {
            "name": "Hari Prashant Bhimaraju",
            "email": "haripb01@gmail.com"
          },
          "committed_at": "2022-09-20T12:48:34Z"
        },
        "branch": "main"
      }
    },
    "webhook": {
      "id": "20d1ec27-1d95-43df-9f92-cadcff3eb6a1",
      "name": "Webhook Site"
    },
    "type": "job-completed",
    "organization": {
      "id": "b4567a7d-7c4e-446b-82b7-a1e798c1afcf",
      "name": "zulip-testing"
    },
    "workflow": {
      "id": "7381218b-d04c-4aa3-b8b8-8c00a9319d1f",
      "name": "sample",
      "created_at": "2022-09-20T12:54:26.737Z",
      "stopped_at": "2022-09-20T12:54:38.599Z",
      "url": "https://app.circleci.com/pipelines/github/zulip-testing/circleci-webhook-test/4/workflows/7381218b-d04c-4aa3-b8b8-8c00a9319d1f"
    },
    "project": {
      "id": "c4fa043c-d2ba-4d97-a6ca-2745b3518114",
      "name": "main branch - build notifications",
      "slug": "github/zulip-testing/circleci-webhook-test"
    },
    "id": "e7346c18-44cb-331d-9d45-698a38edb2e0",
    "job": {
      "id": "bc772f25-9fd4-49f3-a3b8-d5a0cb5a2ab6",
      "name": "build-and-test",
      "started_at": "2022-09-20T12:54:28.900Z",
      "stopped_at": "2022-09-20T12:54:38.599Z",
      "status": "success",
      "number": 6
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: github_tag_workflow_completed.json]---
Location: zulip-main/zerver/webhooks/circleci/fixtures/github_tag_workflow_completed.json

```json
{
    "type": "workflow-completed",
    "id": "f2fa57fa-fc6f-3ecc-a84f-5d983f150a9f",
    "happened_at": "2022-11-08T11:13:21.949388Z",
    "webhook": {
        "id": "20d1ec27-1d95-43df-9f92-cadcff3eb6a1",
        "name": "Webhook Site"
    },
    "workflow": {
        "id": "045c6271-78e2-4802-8a62-f4fa6d25d0c9",
        "name": "sample",
        "created_at": "2022-11-08T11:13:02.522Z",
        "stopped_at": "2022-11-08T11:13:21.855Z",
        "url": "https://app.circleci.com/pipelines/github/prah23/circleci-webhook-test/20/workflows/045c6271-78e2-4802-8a62-f4fa6d25d0c9",
        "status": "success"
    },
    "pipeline": {
        "id": "0659423a-fc7f-4b86-9986-33e321b30b25",
        "number": 20,
        "created_at": "2022-11-08T11:13:02.383Z",
        "trigger": {
            "type": "webhook"
        },
        "vcs": {
            "provider_name": "github",
            "origin_repository_url": "https://github.com/prah23/circleci-webhook-test",
            "target_repository_url": "https://github.com/prah23/circleci-webhook-test",
            "revision": "0e6e66c14e61fbcd95db716b0f30d67dbcce7814",
            "commit": {
                "subject": null,
                "body": null,
                "author": {
                    "name": null,
                    "email": null
                },
                "authored_at": null,
                "committer": {
                    "name": null,
                    "email": null
                },
                "committed_at": null
            },
            "branch": null
        }
    },
    "project": {
        "id": "c4fa043c-d2ba-4d97-a6ca-2745b3518114",
        "name": "circleci-webhook-test",
        "slug": "github/prah23/circleci-webhook-test"
    },
    "organization": {
        "id": "b4567a7d-7c4e-446b-82b7-a1e798c1afcf",
        "name": "prah23"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: github_workflow_completed.json]---
Location: zulip-main/zerver/webhooks/circleci/fixtures/github_workflow_completed.json

```json
{
    "type": "workflow-completed",
    "id": "630a6132-5bf1-3600-b26d-a020d41358f9",
    "happened_at": "2022-09-20T12:54:38.733348Z",
    "webhook": {
      "id": "20d1ec27-1d95-43df-9f92-cadcff3eb6a1",
      "name": "Webhook Site"
    },
    "workflow": {
      "id": "7381218b-d04c-4aa3-b8b8-8c00a9319d1f",
      "name": "sample",
      "created_at": "2022-09-20T12:54:26.737Z",
      "stopped_at": "2022-09-20T12:54:38.599Z",
      "url": "https://app.circleci.com/pipelines/github/zulip-testing/circleci-webhook-test/4/workflows/7381218b-d04c-4aa3-b8b8-8c00a9319d1f",
      "status": "success"
    },
    "pipeline": {
      "id": "877c620f-900a-455b-ad51-1a772b5a3eab",
      "number": 4,
      "created_at": "2022-09-20T12:48:46.741Z",
      "trigger": {
        "type": "webhook"
      },
      "vcs": {
        "provider_name": "github",
        "origin_repository_url": "https://github.com/zulip-testing/circleci-webhook-test",
        "target_repository_url": "https://github.com/zulip-testing/circleci-webhook-test",
        "revision": "a5e30a908224e46626a796d058289475f6d387b5",
        "commit": {
          "subject": ".circleci: Update Webhook URL.",
          "body": "",
          "author": {
            "name": "Hari Prashant Bhimaraju",
            "email": "haripb01@gmail.com"
          },
          "authored_at": "2022-09-20T12:48:34Z",
          "committer": {
            "name": "Hari Prashant Bhimaraju",
            "email": "haripb01@gmail.com"
          },
          "committed_at": "2022-09-20T12:48:34Z"
        },
        "branch": "main"
      }
    },
    "project": {
      "id": "c4fa043c-d2ba-4d97-a6ca-2745b3518114",
      "name": "circleci-webhook-test",
      "slug": "github/zulip-testing/circleci-webhook-test"
    },
    "organization": {
      "id": "b4567a7d-7c4e-446b-82b7-a1e798c1afcf",
      "name": "zulip-testing"
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: gitlab_job_completed.json]---
Location: zulip-main/zerver/webhooks/circleci/fixtures/gitlab_job_completed.json

```json
{
  "happened_at": "2022-09-30T21:03:15.074581Z",
  "pipeline": {
    "id": "18448206-98fd-4ed2-abef-896da41340c0",
    "number": 3,
    "created_at": "2022-09-30T21:03:00.809Z",
    "trigger": {
      "type": "gitlab"
    },
    "trigger_parameters": {
      "gitlab": {
        "web_url": "https://gitlab.com/zulip-testing/circleci-webhook-test",
        "x_gitlab_event_id": "",
        "commit_author_name": "Hari Prashant Bhimaraju",
        "user_id": "12677834",
        "user_name": "Hari Prashant Bhimaraju",
        "user_username": "hariprashant1",
        "branch": "main",
        "commit_title": "app: Enhance message within hello().",
        "tag": "",
        "commit_message": "app: Enhance message within hello().",
        "total_commits_count": "1",
        "repo_url": "git@gitlab.com:zulip-testing/circleci-webhook-test.git",
        "user_avatar": "https://secure.gravatar.com/avatar/8527d1b08a499c8e274790c6b4575d24?s=80&d=identicon",
        "type": "push",
        "project_id": "39861975",
        "ref": "refs/heads/main",
        "repo_name": "circleci-webhook-test",
        "commit_author_email": "haripb01@gmail.com",
        "checkout_sha": "c31f86994c54672f97b5bd5e544315b7bd40e4c1",
        "commit_timestamp": "2022-09-30T21:02:59+00:00",
        "default_branch": "",
        "commit_sha": "c31f86994c54672f97b5bd5e544315b7bd40e4c1",
        "is_fork_merge_request": false
      },
      "circleci": {
        "config_source_id": "f31f5e00-2d0c-412f-b246-57a0a2317671",
        "event_time": "2022-09-30T21:03:00.278Z",
        "actor_id": "1836b5d5-24a6-43f9-9618-21a2d876bbd2",
        "trigger_id": "7eba7e4c-62e4-48ab-9ab3-252f15ea167d",
        "event_type": "push",
        "trigger_type": "gitlab"
      },
      "git": {
        "tag": "",
        "checkout_sha": "c31f86994c54672f97b5bd5e544315b7bd40e4c1",
        "ref": "refs/heads/main",
        "branch": "main",
        "checkout_url": "git@gitlab.com:zulip-testing/circleci-webhook-test.git"
      }
    }
  },
  "webhook": {
    "id": "e6bf8ebb-fc5e-490b-9460-46c464d4f9db",
    "name": "Webhook (Site)"
  },
  "type": "job-completed",
  "organization": {
    "id": "39f0325f-b957-4b73-bdf5-05eb3d76699f",
    "name": "zulip-testing"
  },
  "workflow": {
    "id": "b23ceb64-127a-4075-a27c-d204a7a0a3b3",
    "name": "sample",
    "created_at": "2022-09-30T21:03:00.929Z",
    "stopped_at": "2022-09-30T21:03:15.017Z",
    "url": "https://app.circleci.com/pipelines/circleci/89xcrx7UvWQfzcUPAEmu5Q/63AY3yf3XeUQojmQcGZTtB/3/workflows/b23ceb64-127a-4075-a27c-d204a7a0a3b3"
  },
  "project": {
    "id": "28cb0ea5-e88c-43e0-a052-ed0294f0b6d0",
    "name": "circleci-webhook-test",
    "slug": "circleci/89xcrx7UvWQfzcUPAEmu5Q/63AY3yf3XeUQojmQcGZTtB"
  },
  "id": "b17b2fea-ca08-3f0c-b0a1-e60547af1305",
  "job": {
    "id": "fa6d0b0f-473d-40ea-b1ed-da1e89298f47",
    "name": "build-and-test",
    "started_at": "2022-09-30T21:03:03.359Z",
    "stopped_at": "2022-09-30T21:03:15.017Z",
    "status": "success",
    "number": 2
  }
}
```

--------------------------------------------------------------------------------

---[FILE: gitlab_workflow_completed.json]---
Location: zulip-main/zerver/webhooks/circleci/fixtures/gitlab_workflow_completed.json

```json
{
  "type": "workflow-completed",
  "id": "02ca6868-629c-3f34-b574-6f2d506357f8",
  "happened_at": "2022-09-30T21:03:15.110144Z",
  "webhook": {
    "id": "e6bf8ebb-fc5e-490b-9460-46c464d4f9db",
    "name": "Webhook (Site)"
  },
  "workflow": {
    "id": "b23ceb64-127a-4075-a27c-d204a7a0a3b3",
    "name": "sample",
    "created_at": "2022-09-30T21:03:00.929Z",
    "stopped_at": "2022-09-30T21:03:15.017Z",
    "url": "https://app.circleci.com/pipelines/circleci/89xcrx7UvWQfzcUPAEmu5Q/63AY3yf3XeUQojmQcGZTtB/3/workflows/b23ceb64-127a-4075-a27c-d204a7a0a3b3",
    "status": "success"
  },
  "pipeline": {
    "id": "18448206-98fd-4ed2-abef-896da41340c0",
    "number": 3,
    "created_at": "2022-09-30T21:03:00.809Z",
    "trigger": {
      "type": "gitlab"
    },
    "trigger_parameters": {
      "gitlab": {
        "web_url": "https://gitlab.com/zulip-testing/circleci-webhook-test",
        "x_gitlab_event_id": "",
        "commit_author_name": "Hari Prashant Bhimaraju",
        "user_id": "12677834",
        "user_name": "Hari Prashant Bhimaraju",
        "user_username": "hariprashant1",
        "branch": "main",
        "commit_title": "app: Enhance message within hello().",
        "tag": "",
        "commit_message": "app: Enhance message within hello().",
        "total_commits_count": "1",
        "repo_url": "git@gitlab.com:zulip-testing/circleci-webhook-test.git",
        "user_avatar": "https://secure.gravatar.com/avatar/8527d1b08a499c8e274790c6b4575d24?s=80&d=identicon",
        "type": "push",
        "project_id": "39861975",
        "ref": "refs/heads/main",
        "repo_name": "circleci-webhook-test",
        "commit_author_email": "haripb01@gmail.com",
        "checkout_sha": "c31f86994c54672f97b5bd5e544315b7bd40e4c1",
        "commit_timestamp": "2022-09-30T21:02:59+00:00",
        "default_branch": "",
        "commit_sha": "c31f86994c54672f97b5bd5e544315b7bd40e4c1",
        "is_fork_merge_request": false
      },
      "circleci": {
        "config_source_id": "f31f5e00-2d0c-412f-b246-57a0a2317671",
        "event_time": "2022-09-30T21:03:00.278Z",
        "actor_id": "1836b5d5-24a6-43f9-9618-21a2d876bbd2",
        "trigger_id": "7eba7e4c-62e4-48ab-9ab3-252f15ea167d",
        "event_type": "push",
        "trigger_type": "gitlab"
      },
      "git": {
        "tag": "",
        "checkout_sha": "c31f86994c54672f97b5bd5e544315b7bd40e4c1",
        "ref": "refs/heads/main",
        "branch": "main",
        "checkout_url": "git@gitlab.com:zulip-testing/circleci-webhook-test.git"
      }
    }
  },
  "project": {
    "id": "28cb0ea5-e88c-43e0-a052-ed0294f0b6d0",
    "name": "circleci-webhook-test",
    "slug": "circleci/89xcrx7UvWQfzcUPAEmu5Q/63AY3yf3XeUQojmQcGZTtB"
  },
  "organization": {
    "id": "39f0325f-b957-4b73-bdf5-05eb3d76699f",
    "name": "zulip-testing"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ping.json]---
Location: zulip-main/zerver/webhooks/circleci/fixtures/ping.json

```json
{
    "happened_at": "2023-06-17T19:50:27.457981Z",
    "id": "d1264809-3541-48db-9d72-68f04f074877",
    "type": "ping",
    "webhook": {
        "id": "87f2e824-39f9-4fa8-985e-ce1a0571ad93",
        "name": "Testing"
    }
}
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/clubhouse/doc.md

```text
# Zulip Clubhouse integration

Get Zulip notifications for your Clubhouse Stories and Epics!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. Go to your Clubhouse Dashboard, and click on the settings icon in the
   top-right corner. Go to **Integrations**, and select **Webhooks**.
   Click **+ Add New Webhook**.

1. Set **Payload URL** to the URL generated above, and click **Add New
   Webhook**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/clubhouse/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

````
