---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1207
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1207 of 1290)

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
Location: zulip-main/zerver/webhooks/gogs/view.py
Signals: Django

```python
# vim:fenc=utf-8
from typing import Protocol

from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.exceptions import UnsupportedWebhookEventTypeError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_bool, check_int, check_string
from zerver.lib.webhooks.common import (
    OptionalUserSpecifiedTopicStr,
    check_send_webhook_message,
    get_http_headers_from_filename,
    validate_extract_webhook_http_header,
)
from zerver.lib.webhooks.git import (
    TOPIC_WITH_BRANCH_TEMPLATE,
    TOPIC_WITH_PR_OR_ISSUE_INFO_TEMPLATE,
    TOPIC_WITH_RELEASE_TEMPLATE,
    get_create_branch_event_message,
    get_issue_event_message,
    get_pull_request_event_message,
    get_push_commits_event_message,
    get_release_event_message,
    is_branch_name_notifiable,
)
from zerver.models import UserProfile

fixture_to_headers = get_http_headers_from_filename("HTTP_X_GOGS_EVENT")


def get_issue_url(repo_url: str, issue_nr: int) -> str:
    return f"{repo_url}/issues/{issue_nr}"


def format_push_event(payload: WildValue) -> str:
    user_name = payload["sender"]["username"].tame(check_string)
    compare_url = payload["compare_url"].tame(check_string)
    branch_name = payload["ref"].tame(check_string).replace("refs/heads/", "")
    commits_data = _transform_commits_list_to_common_format(payload["commits"])
    return get_push_commits_event_message(
        user_name=user_name,
        compare_url=compare_url,
        branch_name=branch_name,
        commits_data=commits_data,
    )


def _transform_commits_list_to_common_format(commits: WildValue) -> list[dict[str, str]]:
    return [
        {
            "name": commit["author"]["username"].tame(check_string)
            or commit["author"]["name"].tame(check_string).split()[0],
            "sha": commit["id"].tame(check_string),
            "url": commit["url"].tame(check_string),
            "message": commit["message"].tame(check_string),
        }
        for commit in commits
    ]


def format_new_branch_event(payload: WildValue) -> str:
    branch_name = payload["ref"].tame(check_string)
    url = "{}/src/{}".format(payload["repository"]["html_url"].tame(check_string), branch_name)

    data = {
        "user_name": payload["sender"]["username"].tame(check_string),
        "url": url,
        "branch_name": branch_name,
    }
    return get_create_branch_event_message(**data)


def format_pull_request_event(payload: WildValue, include_title: bool = False) -> str:
    if payload["pull_request"]["merged"].tame(check_bool):
        user_name = payload["pull_request"]["merged_by"]["username"].tame(check_string)
        action = "merged"
    else:
        user_name = payload["pull_request"]["user"]["username"].tame(check_string)
        action = payload["action"].tame(check_string)
    url = payload["pull_request"]["html_url"].tame(check_string)
    number = payload["pull_request"]["number"].tame(check_int)
    target_branch = None
    base_branch = None
    if action != "edited":
        target_branch = payload["pull_request"]["head_branch"].tame(check_string)
        base_branch = payload["pull_request"]["base_branch"].tame(check_string)
    title = payload["pull_request"]["title"].tame(check_string) if include_title else None
    stringified_assignee = (
        payload["pull_request"]["assignee"]["login"].tame(check_string)
        if payload["action"] and payload["pull_request"]["assignee"]
        else None
    )

    return get_pull_request_event_message(
        user_name=user_name,
        action=action,
        url=url,
        number=number,
        target_branch=target_branch,
        base_branch=base_branch,
        title=title,
        assignee_updated=stringified_assignee,
    )


def format_issues_event(payload: WildValue, include_title: bool = False) -> str:
    issue_nr = payload["issue"]["number"].tame(check_int)
    assignee = payload["issue"]["assignee"]
    stringified_assignee = assignee["login"].tame(check_string) if assignee else None
    action = payload["action"].tame(check_string)
    return get_issue_event_message(
        user_name=payload["sender"]["login"].tame(check_string),
        action=payload["action"].tame(check_string),
        url=get_issue_url(payload["repository"]["html_url"].tame(check_string), issue_nr),
        number=issue_nr,
        message=payload["issue"]["body"].tame(check_string),
        assignee=stringified_assignee,
        title=payload["issue"]["title"].tame(check_string) if include_title else None,
        assignee_updated=stringified_assignee if action == "assigned" else None,
    )


def format_issue_comment_event(payload: WildValue, include_title: bool = False) -> str:
    action = payload["action"].tame(check_string)
    comment = payload["comment"]
    issue = payload["issue"]

    if action == "created":
        action = "[commented]"
    else:
        action = f"{action} a [comment]"
    action += "({}) on".format(comment["html_url"].tame(check_string))

    return get_issue_event_message(
        user_name=payload["sender"]["login"].tame(check_string),
        action=action,
        url=get_issue_url(
            payload["repository"]["html_url"].tame(check_string), issue["number"].tame(check_int)
        ),
        number=issue["number"].tame(check_int),
        message=comment["body"].tame(check_string),
        title=issue["title"].tame(check_string) if include_title else None,
    )


def format_release_event(payload: WildValue, include_title: bool = False) -> str:
    data = {
        "user_name": payload["release"]["author"]["username"].tame(check_string),
        "action": payload["action"].tame(check_string),
        "tagname": payload["release"]["tag_name"].tame(check_string),
        "release_name": payload["release"]["name"].tame(check_string),
        "url": payload["repository"]["html_url"].tame(check_string),
    }

    return get_release_event_message(**data)


ALL_EVENT_TYPES = ["issue_comment", "issues", "create", "pull_request", "push", "release"]


@webhook_view("Gogs", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_gogs_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
    branches: str | None = None,
    user_specified_topic: OptionalUserSpecifiedTopicStr = None,
) -> HttpResponse:
    return gogs_webhook_main(
        "Gogs",
        "X-Gogs-Event",
        format_pull_request_event,
        request,
        user_profile,
        payload,
        branches,
        user_specified_topic,
    )


class FormatPullRequestEvent(Protocol):
    def __call__(self, payload: WildValue, include_title: bool) -> str: ...


def gogs_webhook_main(
    integration_name: str,
    http_header_name: str,
    format_pull_request_event: FormatPullRequestEvent,
    request: HttpRequest,
    user_profile: UserProfile,
    payload: WildValue,
    branches: str | None,
    user_specified_topic: str | None,
) -> HttpResponse:
    repo = payload["repository"]["name"].tame(check_string)
    event = validate_extract_webhook_http_header(request, http_header_name, integration_name)
    if event == "push":
        branch = payload["ref"].tame(check_string).replace("refs/heads/", "")
        if not is_branch_name_notifiable(branch, branches):
            return json_success(request)
        body = format_push_event(payload)
        topic_name = TOPIC_WITH_BRANCH_TEMPLATE.format(
            repo=repo,
            branch=branch,
        )
    elif event == "create":
        body = format_new_branch_event(payload)
        topic_name = TOPIC_WITH_BRANCH_TEMPLATE.format(
            repo=repo,
            branch=payload["ref"].tame(check_string),
        )
    elif event == "pull_request":
        body = format_pull_request_event(
            payload,
            include_title=user_specified_topic is not None,
        )
        topic_name = TOPIC_WITH_PR_OR_ISSUE_INFO_TEMPLATE.format(
            repo=repo,
            type="PR",
            id=payload["pull_request"]["id"].tame(check_int),
            title=payload["pull_request"]["title"].tame(check_string),
        )
    elif event == "issues":
        body = format_issues_event(
            payload,
            include_title=user_specified_topic is not None,
        )
        topic_name = TOPIC_WITH_PR_OR_ISSUE_INFO_TEMPLATE.format(
            repo=repo,
            type="issue",
            id=payload["issue"]["number"].tame(check_int),
            title=payload["issue"]["title"].tame(check_string),
        )
    elif event == "issue_comment":
        body = format_issue_comment_event(
            payload,
            include_title=user_specified_topic is not None,
        )
        topic_name = TOPIC_WITH_PR_OR_ISSUE_INFO_TEMPLATE.format(
            repo=repo,
            type="issue",
            id=payload["issue"]["number"].tame(check_int),
            title=payload["issue"]["title"].tame(check_string),
        )
    elif event == "release":
        body = format_release_event(
            payload,
            include_title=user_specified_topic is not None,
        )
        topic_name = TOPIC_WITH_RELEASE_TEMPLATE.format(
            repo=repo,
            tag=payload["release"]["tag_name"].tame(check_string),
            title=payload["release"]["name"].tame(check_string),
        )

    else:
        raise UnsupportedWebhookEventTypeError(event)

    check_send_webhook_message(request, user_profile, topic_name, body, event)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: create__branch.json]---
Location: zulip-main/zerver/webhooks/gogs/fixtures/create__branch.json

```json
{
  "secret": "",
  "ref": "my_feature",
  "ref_type": "branch",
  "repository": {
    "id": 1,
    "owner": {
      "id": 1,
      "login": "john",
      "full_name": "",
      "email": "john@example.com",
      "avatar_url": "https://secure.gravatar.com/avatar/715cb4680284423d81d2e75e94f812a1",
      "username": "john"
    },
    "name": "try-git",
    "full_name": "john/try-git",
    "description": "",
    "private": false,
    "fork": false,
    "html_url": "http://localhost:3000/john/try-git",
    "ssh_url": "john@localhost:john/try-git.git",
    "clone_url": "http://localhost:3000/john/try-git.git",
    "website": "",
    "stars_count": 0,
    "forks_count": 0,
    "watchers_count": 1,
    "open_issues_count": 0,
    "default_branch": "master",
    "created_at": "2017-02-19T13:23:39-05:00",
    "updated_at": "2017-02-19T13:57:06-05:00"
  },
  "sender": {
    "id": 1,
    "login": "john",
    "full_name": "",
    "email": "john@example.com",
    "avatar_url": "https://secure.gravatar.com/avatar/715cb4680284423d81d2e75e94f812a1",
    "username": "john"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: issues__assigned.json]---
Location: zulip-main/zerver/webhooks/gogs/fixtures/issues__assigned.json

```json
{
  "action": "assigned",
  "number": 3,
  "issue": {
    "id": 5267,
    "number": 3,
    "user": {
      "id": 43132,
      "username": "kostekIV",
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
    },
    "title": "New test issue",
    "body": "Test",
    "labels": [],
    "milestone": null,
    "assignee": {
      "id": 43132,
      "username": "kostekIV",
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
    },
    "state": "open",
    "comments": 2,
    "created_at": "2019-11-17T20:50:48Z",
    "updated_at": "2019-11-17T22:59:12Z",
    "pull_request": null
  },
  "repository": {
    "id": 23925,
    "owner": {
      "id": 43132,
      "username": "kostekIV",
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
    },
    "name": "test",
    "full_name": "kostekIV/test",
    "description": "",
    "private": false,
    "fork": false,
    "parent": null,
    "empty": false,
    "mirror": false,
    "size": 40960,
    "html_url": "https://try.gogs.io/kostekIV/test",
    "ssh_url": "git@try.gogs.io:kostekIV/test.git",
    "clone_url": "https://try.gogs.io/kostekIV/test.git",
    "website": "",
    "stars_count": 0,
    "forks_count": 0,
    "watchers_count": 1,
    "open_issues_count": 2,
    "default_branch": "master",
    "created_at": "2019-11-16T08:08:03Z",
    "updated_at": "2019-11-16T08:12:33Z"
  },
  "sender": {
    "id": 43132,
    "username": "kostekIV",
    "login": "kostekIV",
    "full_name": "",
    "email": "koscis.j@gmail.com",
    "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: issues__closed.json]---
Location: zulip-main/zerver/webhooks/gogs/fixtures/issues__closed.json

```json
{
  "action": "closed",
  "number": 3,
  "issue": {
    "id": 5267,
    "number": 3,
    "user": {
      "id": 43132,
      "username": "kostekIV",
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
    },
    "title": "New test issue",
    "body": "Closed #3",
    "labels": [],
    "milestone": null,
    "assignee": null,
    "state": "closed",
    "comments": 1,
    "created_at": "2019-11-17T20:50:48Z",
    "updated_at": "2019-11-17T20:51:01Z",
    "pull_request": null
  },
  "repository": {
    "id": 23925,
    "owner": {
      "id": 43132,
      "username": "kostekIV",
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
    },
    "name": "test",
    "full_name": "kostekIV/test",
    "description": "",
    "private": false,
    "fork": false,
    "parent": null,
    "empty": false,
    "mirror": false,
    "size": 40960,
    "html_url": "https://try.gogs.io/kostekIV/test",
    "ssh_url": "git@try.gogs.io:kostekIV/test.git",
    "clone_url": "https://try.gogs.io/kostekIV/test.git",
    "website": "",
    "stars_count": 0,
    "forks_count": 0,
    "watchers_count": 1,
    "open_issues_count": 1,
    "default_branch": "master",
    "created_at": "2019-11-16T08:08:03Z",
    "updated_at": "2019-11-16T08:12:33Z"
  },
  "sender": {
    "id": 43132,
    "username": "kostekIV",
    "login": "kostekIV",
    "full_name": "",
    "email": "koscis.j@gmail.com",
    "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: issues__edited.json]---
Location: zulip-main/zerver/webhooks/gogs/fixtures/issues__edited.json

```json
{
  "action": "edited",
  "number": 3,
  "issue": {
    "id": 5268,
    "number": 3,
    "user": {
      "id": 43132,
      "username": "kostekIV",
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
    },
    "title": "New test issue",
    "body": "Test edit",
    "labels": [],
    "milestone": null,
    "assignee": null,
    "state": "open",
    "comments": 0,
    "created_at": "2019-11-17T21:52:57Z",
    "updated_at": "2019-11-17T21:52:57Z",
    "pull_request": null
  },
  "changes": {
    "body": {
      "from": ""
    }
  },
  "repository": {
    "id": 23925,
    "owner": {
      "id": 43132,
      "username": "kostekIV",
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
    },
    "name": "test",
    "full_name": "kostekIV/test",
    "description": "",
    "private": false,
    "fork": false,
    "parent": null,
    "empty": false,
    "mirror": false,
    "size": 40960,
    "html_url": "https://try.gogs.io/kostekIV/test",
    "ssh_url": "git@try.gogs.io:kostekIV/test.git",
    "clone_url": "https://try.gogs.io/kostekIV/test.git",
    "website": "",
    "stars_count": 0,
    "forks_count": 0,
    "watchers_count": 1,
    "open_issues_count": 1,
    "default_branch": "master",
    "created_at": "2019-11-16T08:08:03Z",
    "updated_at": "2019-11-16T08:12:33Z"
  },
  "sender": {
    "id": 43132,
    "username": "kostekIV",
    "login": "kostekIV",
    "full_name": "",
    "email": "koscis.j@gmail.com",
    "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: issues__opened.json]---
Location: zulip-main/zerver/webhooks/gogs/fixtures/issues__opened.json

```json
{
  "action": "opened",
  "number": 3,
  "issue": {
    "id": 5267,
    "number": 3,
    "user": {
      "id": 43132,
      "username": "kostekIV",
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
    },
    "title": "New test issue",
    "body": "Test",
    "labels": [],
    "milestone": null,
    "assignee": null,
    "state": "open",
    "comments": 0,
    "created_at": "0001-01-01T00:00:00Z",
    "updated_at": "0001-01-01T00:00:00Z",
    "pull_request": null
  },
  "repository": {
    "id": 23925,
    "owner": {
      "id": 43132,
      "username": "kostekIV",
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
    },
    "name": "test",
    "full_name": "kostekIV/test",
    "description": "",
    "private": false,
    "fork": false,
    "parent": null,
    "empty": false,
    "mirror": false,
    "size": 40960,
    "html_url": "https://try.gogs.io/kostekIV/test",
    "ssh_url": "git@try.gogs.io:kostekIV/test.git",
    "clone_url": "https://try.gogs.io/kostekIV/test.git",
    "website": "",
    "stars_count": 0,
    "forks_count": 0,
    "watchers_count": 1,
    "open_issues_count": 0,
    "default_branch": "master",
    "created_at": "2019-11-16T08:08:03Z",
    "updated_at": "2019-11-16T08:12:33Z"
  },
  "sender": {
    "id": 43132,
    "username": "kostekIV",
    "login": "kostekIV",
    "full_name": "",
    "email": "koscis.j@gmail.com",
    "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: issues__reopened.json]---
Location: zulip-main/zerver/webhooks/gogs/fixtures/issues__reopened.json

```json
{
  "action": "reopened",
  "number": 3,
  "issue": {
    "id": 5267,
    "number": 3,
    "user": {
      "id": 43132,
      "username": "kostekIV",
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
    },
    "title": "New test issue",
    "body": "Test",
    "labels": [],
    "milestone": null,
    "assignee": null,
    "state": "open",
    "comments": 2,
    "created_at": "2019-11-17T20:50:48Z",
    "updated_at": "2019-11-17T20:51:06Z",
    "pull_request": null
  },
  "repository": {
    "id": 23925,
    "owner": {
      "id": 43132,
      "username": "kostekIV",
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
    },
    "name": "test",
    "full_name": "kostekIV/test",
    "description": "",
    "private": false,
    "fork": false,
    "parent": null,
    "empty": false,
    "mirror": false,
    "size": 40960,
    "html_url": "https://try.gogs.io/kostekIV/test",
    "ssh_url": "git@try.gogs.io:kostekIV/test.git",
    "clone_url": "https://try.gogs.io/kostekIV/test.git",
    "website": "",
    "stars_count": 0,
    "forks_count": 0,
    "watchers_count": 1,
    "open_issues_count": 1,
    "default_branch": "master",
    "created_at": "2019-11-16T08:08:03Z",
    "updated_at": "2019-11-16T08:12:33Z"
  },
  "sender": {
    "id": 43132,
    "username": "kostekIV",
    "login": "kostekIV",
    "full_name": "",
    "email": "koscis.j@gmail.com",
    "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: issue_comment__edited.json]---
Location: zulip-main/zerver/webhooks/gogs/fixtures/issue_comment__edited.json

```json
{
  "action": "edited",
  "issue": {
    "id": 5267,
    "number": 3,
    "user": {
      "id": 43132,
      "username": "kostekIV",
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
    },
    "title": "New test issue",
    "body": "Test",
    "labels": [],
    "milestone": null,
    "assignee": {
      "id": 43132,
      "username": "kostekIV",
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
    },
    "state": "open",
    "comments": 2,
    "created_at": "2019-11-17T20:50:48Z",
    "updated_at": "2019-11-17T23:01:06Z",
    "pull_request": null
  },
  "comment": {
    "id": 3634,
    "html_url": "https://try.gogs.io/kostekIV/test/issues/3#issuecomment-3634",
    "user": {
      "id": 43132,
      "username": "kostekIV",
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
    },
    "body": "edit comment",
    "created_at": "2019-11-17T20:51:01Z",
    "updated_at": "2019-11-17T20:51:01Z"
  },
  "changes": {
    "body": {
      "from": "comment"
    }
  },
  "repository": {
    "id": 23925,
    "owner": {
      "id": 43132,
      "username": "kostekIV",
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
    },
    "name": "test",
    "full_name": "kostekIV/test",
    "description": "",
    "private": false,
    "fork": false,
    "parent": null,
    "empty": false,
    "mirror": false,
    "size": 49152,
    "html_url": "https://try.gogs.io/kostekIV/test",
    "ssh_url": "git@try.gogs.io:kostekIV/test.git",
    "clone_url": "https://try.gogs.io/kostekIV/test.git",
    "website": "",
    "stars_count": 1,
    "forks_count": 0,
    "watchers_count": 1,
    "open_issues_count": 2,
    "default_branch": "master",
    "created_at": "2019-11-16T08:08:03Z",
    "updated_at": "2019-11-17T23:18:17Z"
  },
  "sender": {
    "id": 43132,
    "username": "kostekIV",
    "login": "kostekIV",
    "full_name": "",
    "email": "koscis.j@gmail.com",
    "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: issue_comment__new.json]---
Location: zulip-main/zerver/webhooks/gogs/fixtures/issue_comment__new.json

```json
{
  "action": "created",
  "issue": {
    "id": 5267,
    "number": 3,
    "user": {
      "id": 43132,
      "username": "kostekIV",
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
    },
    "title": "New test issue",
    "body": "Closing",
    "labels": [],
    "milestone": null,
    "assignee": null,
    "state": "open",
    "comments": 1,
    "created_at": "2019-11-17T20:50:48Z",
    "updated_at": "2019-11-17T20:51:01Z",
    "pull_request": null
  },
  "comment": {
    "id": 3635,
    "html_url": "https://try.gogs.io/kostekIV/test/issues/3#issuecomment-3635",
    "user": {
      "id": 43132,
      "username": "kostekIV",
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
    },
    "body": "Test comment",
    "created_at": "0001-01-01T00:00:00Z",
    "updated_at": "0001-01-01T00:00:00Z"
  },
  "repository": {
    "id": 23925,
    "owner": {
      "id": 43132,
      "username": "kostekIV",
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
    },
    "name": "test",
    "full_name": "kostekIV/test",
    "description": "",
    "private": false,
    "fork": false,
    "parent": null,
    "empty": false,
    "mirror": false,
    "size": 40960,
    "html_url": "https://try.gogs.io/kostekIV/test",
    "ssh_url": "git@try.gogs.io:kostekIV/test.git",
    "clone_url": "https://try.gogs.io/kostekIV/test.git",
    "website": "",
    "stars_count": 0,
    "forks_count": 0,
    "watchers_count": 1,
    "open_issues_count": 1,
    "default_branch": "master",
    "created_at": "2019-11-16T08:08:03Z",
    "updated_at": "2019-11-16T08:12:33Z"
  },
  "sender": {
    "id": 43132,
    "username": "kostekIV",
    "login": "kostekIV",
    "full_name": "",
    "email": "koscis.j@gmail.com",
    "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: pull_request__assigned.json]---
Location: zulip-main/zerver/webhooks/gogs/fixtures/pull_request__assigned.json

```json
{
  "action": "assigned",
  "number": 2,
  "pull_request": {
    "id": 1349,
    "number": 2,
    "user": {
      "id": 43132,
      "username": "kostekIV",
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
    },
    "title": "Test",
    "body": "",
    "labels": [],
    "milestone": null,
    "assignee": {
      "id": 43132,
      "username": "kostekIV",
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
    },
    "state": "open",
    "comments": 3,
    "head_branch": "c",
    "head_repo": {
      "id": 23925,
      "owner": {
        "id": 43132,
        "username": "kostekIV",
        "login": "kostekIV",
        "full_name": "",
        "email": "koscis.j@gmail.com",
        "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
      },
      "name": "test",
      "full_name": "kostekIV/test",
      "description": "",
      "private": false,
      "fork": false,
      "parent": null,
      "empty": false,
      "mirror": false,
      "size": 40960,
      "html_url": "https://try.gogs.io/kostekIV/test",
      "ssh_url": "git@try.gogs.io:kostekIV/test.git",
      "clone_url": "https://try.gogs.io/kostekIV/test.git",
      "website": "",
      "stars_count": 1,
      "forks_count": 0,
      "watchers_count": 1,
      "open_issues_count": 2,
      "default_branch": "master",
      "created_at": "2019-11-16T08:08:03Z",
      "updated_at": "2019-11-16T08:12:33Z"
    },
    "base_branch": "master",
    "base_repo": {
      "id": 23925,
      "owner": {
        "id": 43132,
        "username": "kostekIV",
        "login": "kostekIV",
        "full_name": "",
        "email": "koscis.j@gmail.com",
        "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
      },
      "name": "test",
      "full_name": "kostekIV/test",
      "description": "",
      "private": false,
      "fork": false,
      "parent": null,
      "empty": false,
      "mirror": false,
      "size": 40960,
      "html_url": "https://try.gogs.io/kostekIV/test",
      "ssh_url": "git@try.gogs.io:kostekIV/test.git",
      "clone_url": "https://try.gogs.io/kostekIV/test.git",
      "website": "",
      "stars_count": 1,
      "forks_count": 0,
      "watchers_count": 1,
      "open_issues_count": 2,
      "default_branch": "master",
      "created_at": "2019-11-16T08:08:03Z",
      "updated_at": "2019-11-16T08:12:33Z"
    },
    "html_url": "https://try.gogs.io/kostekIV/test/pulls/2",
    "mergeable": false,
    "merged": false,
    "merged_at": null,
    "merge_commit_sha": null,
    "merged_by": null
  },
  "repository": {
    "id": 23925,
    "owner": {
      "id": 43132,
      "username": "kostekIV",
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
    },
    "name": "test",
    "full_name": "kostekIV/test",
    "description": "",
    "private": false,
    "fork": false,
    "parent": null,
    "empty": false,
    "mirror": false,
    "size": 40960,
    "html_url": "https://try.gogs.io/kostekIV/test",
    "ssh_url": "git@try.gogs.io:kostekIV/test.git",
    "clone_url": "https://try.gogs.io/kostekIV/test.git",
    "website": "",
    "stars_count": 1,
    "forks_count": 0,
    "watchers_count": 1,
    "open_issues_count": 2,
    "default_branch": "master",
    "created_at": "2019-11-16T08:08:03Z",
    "updated_at": "2019-11-16T08:12:33Z"
  },
  "sender": {
    "id": 43132,
    "username": "kostekIV",
    "login": "kostekIV",
    "full_name": "",
    "email": "koscis.j@gmail.com",
    "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: pull_request__closed.json]---
Location: zulip-main/zerver/webhooks/gogs/fixtures/pull_request__closed.json

```json
{
  "secret": "",
  "action": "closed",
  "number": 1,
  "pull_request": {
    "id": 1,
    "number": 1,
    "user": {
      "id": 2,
      "login": "john",
      "full_name": "",
      "email": "john@example.com",
      "avatar_url": "https://secure.gravatar.com/avatar/3e55b4d0f779dd3b7ab3be7960dc157a",
      "username": "john"
    },
    "title": "Title Text for Pull Request",
    "body": "Description Text",
    "labels": [],
    "milestone": null,
    "assignee": null,
    "state": "closed",
    "comments": 0,
    "head_branch": "feature",
    "head_repo": {
      "id": 2,
      "owner": {
        "id": 2,
        "login": "john",
        "full_name": "",
        "email": "john@example.com",
        "avatar_url": "https://secure.gravatar.com/avatar/3e55b4d0f779dd3b7ab3be7960dc157a",
        "username": "john"
      },
      "name": "try-git",
      "full_name": "john/try-git",
      "description": "",
      "private": false,
      "fork": true,
      "html_url": "http://localhost:3000/john/try-git",
      "ssh_url": "john@localhost:john/try-git.git",
      "clone_url": "http://localhost:3000/john/try-git.git",
      "website": "",
      "stars_count": 0,
      "forks_count": 0,
      "watchers_count": 1,
      "open_issues_count": 0,
      "default_branch": "master",
      "created_at": "2017-02-19T18:10:53-05:00",
      "updated_at": "2017-02-19T18:13:08-05:00"
    },
    "base_branch": "master",
    "base_repo": {
      "id": 1,
      "owner": {
        "id": 1,
        "login": "john",
        "full_name": "",
        "email": "john@example.com",
        "avatar_url": "https://secure.gravatar.com/avatar/715cb4680284423d81d2e75e94f812a1",
        "username": "john"
      },
      "name": "try-git",
      "full_name": "john/try-git",
      "description": "",
      "private": false,
      "fork": false,
      "html_url": "http://localhost:3000/john/try-git",
      "ssh_url": "john@localhost:john/try-git.git",
      "clone_url": "http://localhost:3000/john/try-git.git",
      "website": "",
      "stars_count": 0,
      "forks_count": 1,
      "watchers_count": 1,
      "open_issues_count": 0,
      "default_branch": "master",
      "created_at": "2017-02-19T13:23:39-05:00",
      "updated_at": "2017-02-19T17:56:41-05:00"
    },
    "html_url": "http://localhost:3000/john/try-git/pulls/1",
    "mergeable": true,
    "merged": false,
    "merged_at": null,
    "merge_commit_sha": null,
    "merged_by": null
  },
  "repository": {
    "id": 1,
    "owner": {
      "id": 1,
      "login": "john",
      "full_name": "",
      "email": "john@example.com",
      "avatar_url": "https://secure.gravatar.com/avatar/715cb4680284423d81d2e75e94f812a1",
      "username": "john"
    },
    "name": "try-git",
    "full_name": "john/try-git",
    "description": "",
    "private": false,
    "fork": false,
    "html_url": "http://localhost:3000/john/try-git",
    "ssh_url": "john@localhost:john/try-git.git",
    "clone_url": "http://localhost:3000/john/try-git.git",
    "website": "",
    "stars_count": 0,
    "forks_count": 1,
    "watchers_count": 1,
    "open_issues_count": 0,
    "default_branch": "master",
    "created_at": "2017-02-19T13:23:39-05:00",
    "updated_at": "2017-02-19T17:56:41-05:00"
  },
  "sender": {
    "id": 1,
    "login": "john",
    "full_name": "",
    "email": "john@example.com",
    "avatar_url": "https://secure.gravatar.com/avatar/715cb4680284423d81d2e75e94f812a1",
    "username": "john"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: pull_request__edited.json]---
Location: zulip-main/zerver/webhooks/gogs/fixtures/pull_request__edited.json

```json
{
  "action": "edited",
  "number": 2,
  "pull_request": {
    "id": 1349,
    "number": 2,
    "user": {
      "id": 43132,
      "username": "kostekIV",
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
    },
    "title": "Test",
    "body": "",
    "labels": [],
    "milestone": null,
    "assignee": null,
    "state": "open",
    "comments": 3,
    "head_branch": "c",
    "head_repo": {
      "id": 23925,
      "owner": {
        "id": 43132,
        "username": "kostekIV",
        "login": "kostekIV",
        "full_name": "",
        "email": "koscis.j@gmail.com",
        "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
      },
      "name": "test",
      "full_name": "kostekIV/test",
      "description": "",
      "private": false,
      "fork": false,
      "parent": null,
      "empty": false,
      "mirror": false,
      "size": 40960,
      "html_url": "https://try.gogs.io/kostekIV/test",
      "ssh_url": "git@try.gogs.io:kostekIV/test.git",
      "clone_url": "https://try.gogs.io/kostekIV/test.git",
      "website": "",
      "stars_count": 0,
      "forks_count": 0,
      "watchers_count": 1,
      "open_issues_count": 2,
      "default_branch": "master",
      "created_at": "2019-11-16T08:08:03Z",
      "updated_at": "2019-11-16T08:12:33Z"
    },
    "base_branch": "master",
    "base_repo": {
      "id": 23925,
      "owner": {
        "id": 43132,
        "username": "kostekIV",
        "login": "kostekIV",
        "full_name": "",
        "email": "koscis.j@gmail.com",
        "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
      },
      "name": "test",
      "full_name": "kostekIV/test",
      "description": "",
      "private": false,
      "fork": false,
      "parent": null,
      "empty": false,
      "mirror": false,
      "size": 40960,
      "html_url": "https://try.gogs.io/kostekIV/test",
      "ssh_url": "git@try.gogs.io:kostekIV/test.git",
      "clone_url": "https://try.gogs.io/kostekIV/test.git",
      "website": "",
      "stars_count": 0,
      "forks_count": 0,
      "watchers_count": 1,
      "open_issues_count": 2,
      "default_branch": "master",
      "created_at": "2019-11-16T08:08:03Z",
      "updated_at": "2019-11-16T08:12:33Z"
    },
    "html_url": "https://try.gogs.io/kostekIV/test/pulls/2",
    "mergeable": false,
    "merged": false,
    "merged_at": null,
    "merge_commit_sha": null,
    "merged_by": null
  },
  "changes": {
    "title": {
      "from": "23r"
    }
  },
  "repository": {
    "id": 23925,
    "owner": {
      "id": 43132,
      "username": "kostekIV",
      "login": "kostekIV",
      "full_name": "",
      "email": "koscis.j@gmail.com",
      "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
    },
    "name": "test",
    "full_name": "kostekIV/test",
    "description": "",
    "private": false,
    "fork": false,
    "parent": null,
    "empty": false,
    "mirror": false,
    "size": 40960,
    "html_url": "https://try.gogs.io/kostekIV/test",
    "ssh_url": "git@try.gogs.io:kostekIV/test.git",
    "clone_url": "https://try.gogs.io/kostekIV/test.git",
    "website": "",
    "stars_count": 0,
    "forks_count": 0,
    "watchers_count": 1,
    "open_issues_count": 2,
    "default_branch": "master",
    "created_at": "2019-11-16T08:08:03Z",
    "updated_at": "2019-11-16T08:12:33Z"
  },
  "sender": {
    "id": 43132,
    "username": "kostekIV",
    "login": "kostekIV",
    "full_name": "",
    "email": "koscis.j@gmail.com",
    "avatar_url": "https://secure.gravatar.com/avatar/91fe35565bf6198f03688b89fdb0a19a?d=identicon"
  }
}
```

--------------------------------------------------------------------------------

````
