---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1118
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1118 of 1290)

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
Location: zulip-main/zerver/webhooks/basecamp/view.py
Signals: Django

```python
import re
import string

from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.exceptions import UnsupportedWebhookEventTypeError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

from .support_event import SUPPORT_EVENTS

DOCUMENT_TEMPLATE = "{user_name} {verb} the document [{title}]({url})"
QUESTION_TEMPLATE = "{user_name} {verb} the question [{title}]({url})"
QUESTIONS_ANSWER_TEMPLATE = (
    "{user_name} {verb} the [answer]({answer_url})"
    " of the question [{question_title}]({question_url})"
)
COMMENT_TEMPLATE = (
    "{user_name} {verb} the [comment]({answer_url}) of the task [{task_title}]({task_url})"
)
MESSAGE_TEMPLATE = "{user_name} {verb} the message [{title}]({url})"
TODO_LIST_TEMPLATE = "{user_name} {verb} the todo list [{title}]({url})"
TODO_TEMPLATE = "{user_name} {verb} the todo task [{title}]({url})"

ALL_EVENT_TYPES = [
    "document",
    "question_answer",
    "question",
    "message",
    "todolist",
    "todo",
    "comment",
]


@webhook_view("Basecamp", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_basecamp_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    event = get_event_type(payload)

    if event not in SUPPORT_EVENTS:
        raise UnsupportedWebhookEventTypeError(event)

    topic_name = get_project_name(payload)
    if event.startswith("document_"):
        body = get_document_body(event, payload)
        event = "document"
    elif event.startswith("question_answer_"):
        body = get_questions_answer_body(event, payload)
        event = "question_answer"
    elif event.startswith("question_"):
        body = get_questions_body(event, payload)
        event = "question"
    elif event.startswith("message_"):
        body = get_message_body(event, payload)
        event = "message"
    elif event.startswith("todolist_"):
        body = get_todo_list_body(event, payload)
        event = "todolist"
    elif event.startswith("todo_"):
        body = get_todo_body(event, payload)
        event = "todo"
    elif event.startswith("comment_"):
        body = get_comment_body(event, payload)
        event = "comment"
    else:
        raise UnsupportedWebhookEventTypeError(event)

    check_send_webhook_message(request, user_profile, topic_name, body, event)
    return json_success(request)


def get_project_name(payload: WildValue) -> str:
    return payload["recording"]["bucket"]["name"].tame(check_string)


def get_event_type(payload: WildValue) -> str:
    return payload["kind"].tame(check_string)


def get_event_creator(payload: WildValue) -> str:
    return payload["creator"]["name"].tame(check_string)


def get_topic_url(payload: WildValue) -> str:
    return payload["recording"]["app_url"].tame(check_string)


def get_topic_title(payload: WildValue) -> str:
    return payload["recording"]["title"].tame(check_string)


def get_verb(event: str, prefix: str) -> str:
    verb = event.replace(prefix, "")
    if verb == "active":
        return "activated"

    matched = re.match(r"(?P<subject>[A-z]*)_changed", verb)
    if matched:
        return "changed {} of".format(matched.group("subject"))
    return verb


def add_punctuation_if_necessary(body: str, title: str) -> str:
    if title[-1] not in string.punctuation:
        body = f"{body}."
    return body


def get_document_body(event: str, payload: WildValue) -> str:
    return get_generic_body(event, payload, "document_", DOCUMENT_TEMPLATE)


def get_questions_answer_body(event: str, payload: WildValue) -> str:
    verb = get_verb(event, "question_answer_")
    question = payload["recording"]["parent"]
    title = question["title"].tame(check_string)
    template = add_punctuation_if_necessary(QUESTIONS_ANSWER_TEMPLATE, title)

    return template.format(
        user_name=get_event_creator(payload),
        verb=verb,
        answer_url=get_topic_url(payload),
        question_title=title,
        question_url=question["app_url"].tame(check_string),
    )


def get_comment_body(event: str, payload: WildValue) -> str:
    verb = get_verb(event, "comment_")
    task = payload["recording"]["parent"]
    template = add_punctuation_if_necessary(COMMENT_TEMPLATE, task["title"].tame(check_string))

    return template.format(
        user_name=get_event_creator(payload),
        verb=verb,
        answer_url=get_topic_url(payload),
        task_title=task["title"].tame(check_string),
        task_url=task["app_url"].tame(check_string),
    )


def get_questions_body(event: str, payload: WildValue) -> str:
    return get_generic_body(event, payload, "question_", QUESTION_TEMPLATE)


def get_message_body(event: str, payload: WildValue) -> str:
    return get_generic_body(event, payload, "message_", MESSAGE_TEMPLATE)


def get_todo_list_body(event: str, payload: WildValue) -> str:
    return get_generic_body(event, payload, "todolist_", TODO_LIST_TEMPLATE)


def get_todo_body(event: str, payload: WildValue) -> str:
    return get_generic_body(event, payload, "todo_", TODO_TEMPLATE)


def get_generic_body(event: str, payload: WildValue, prefix: str, template: str) -> str:
    verb = get_verb(event, prefix)
    title = get_topic_title(payload)
    template = add_punctuation_if_necessary(template, title)

    return template.format(
        user_name=get_event_creator(payload),
        verb=verb,
        title=get_topic_title(payload),
        url=get_topic_url(payload),
    )
```

--------------------------------------------------------------------------------

---[FILE: comment_created.json]---
Location: zulip-main/zerver/webhooks/basecamp/fixtures/comment_created.json

```json
{
  "id": 657037928,
  "kind": "comment_created",
  "details": {
    "notified_recipient_ids": []
  },
  "created_at": "2017-03-13T08:31:54.661+01:00",
  "recording": {
    "id": 427058780,
    "status": "active",
    "created_at": "2017-03-13T08:31:54.647+01:00",
    "updated_at": "2017-03-13T08:31:54.647+01:00",
    "type": "Comment",
    "url": "https://3.basecampapi.com/3688623/buckets/2957043/comments/427058780.json",
    "app_url": "https://3.basecamp.com/3688623/buckets/2957043/todos/427055624#__recording_427058780",
    "parent": {
      "id": 427055624,
      "title": "New task",
      "type": "Todo",
      "url": "https://3.basecampapi.com/3688623/buckets/2957043/todos/427055624.json",
      "app_url": "https://3.basecamp.com/3688623/buckets/2957043/todos/427055624"
    },
    "bucket": {
      "id": 2957043,
      "name": "Zulip HQ",
      "type": "Project"
    },
    "creator": {
      "id": 10695738,
      "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
      "name": "Tomasz",
      "email_address": "tomaszkolek0@gmail.com",
      "personable_type": "User",
      "title": null,
      "bio": null,
      "created_at": "2017-03-07T07:21:08.088+01:00",
      "updated_at": "2017-03-07T07:21:27.633+01:00",
      "admin": true,
      "owner": true,
      "time_zone": "Europe/Amsterdam",
      "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
      "company": {
        "id": 796227,
        "name": "Zulip"
      }
    },
    "title": "Re: New task",
    "content": "\u003cdiv\u003eComment\u003c/div\u003e"
  },
  "creator": {
    "id": 10695738,
    "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
    "name": "Tomasz",
    "email_address": "tomaszkolek0@gmail.com",
    "personable_type": "User",
    "title": null,
    "bio": null,
    "created_at": "2017-03-07T07:21:08.088+01:00",
    "updated_at": "2017-03-07T07:21:27.633+01:00",
    "admin": true,
    "owner": true,
    "time_zone": "Europe/Amsterdam",
    "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
    "company": {
      "id": 796227,
      "name": "Zulip"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: doc_active.json]---
Location: zulip-main/zerver/webhooks/basecamp/fixtures/doc_active.json

```json
{
  "id": 664749146,
  "kind": "document_active",
  "details": {
    "status_was": "drafted",
    "notified_recipient_ids": []
  },
  "created_at": "2017-03-16T07:39:52.731+01:00",
  "recording": {
    "id": 432522214,
    "status": "active",
    "created_at": "2017-03-16T07:39:52.725+01:00",
    "updated_at": "2017-03-16T07:39:52.727+01:00",
    "type": "Document",
    "url": "https://3.basecampapi.com/3688623/buckets/2957043/documents/432522214.json",
    "app_url": "https://3.basecamp.com/3688623/buckets/2957043/documents/432522214",
    "parent": {
      "id": 419211339,
      "title": "Docs \u0026 Files",
      "type": "Vault",
      "url": "https://3.basecampapi.com/3688623/buckets/2957043/vaults/419211339.json",
      "app_url": "https://3.basecamp.com/3688623/buckets/2957043/vaults/419211339"
    },
    "bucket": {
      "id": 2957043,
      "name": "Event Planning - Annual Conference",
      "type": "Project"
    },
    "creator": {
      "id": 10695738,
      "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
      "name": "Tomasz",
      "email_address": "tomaszkolek0@gmail.com",
      "personable_type": "User",
      "title": null,
      "bio": null,
      "created_at": "2017-03-07T07:21:08.088+01:00",
      "updated_at": "2017-03-07T07:21:27.633+01:00",
      "admin": true,
      "owner": true,
      "time_zone": "Europe/Amsterdam",
      "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
      "company": {
        "id": 796227,
        "name": "Zulip"
      }
    },
    "title": "Sponsorship Package Outline",
    "content": "\u003cdiv\u003eabc\u003c/div\u003e"
  },
  "creator": {
    "id": 10695738,
    "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
    "name": "Tomasz",
    "email_address": "tomaszkolek0@gmail.com",
    "personable_type": "User",
    "title": null,
    "bio": null,
    "created_at": "2017-03-07T07:21:08.088+01:00",
    "updated_at": "2017-03-07T07:21:27.633+01:00",
    "admin": true,
    "owner": true,
    "time_zone": "Europe/Amsterdam",
    "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
    "company": {
      "id": 796227,
      "name": "Zulip"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: doc_archived.json]---
Location: zulip-main/zerver/webhooks/basecamp/fixtures/doc_archived.json

```json
{
  "id": 667389851,
  "kind": "document_archived",
  "details": {
    "status_was": "active"
  },
  "created_at": "2017-03-17T07:51:26.948+01:00",
  "recording": {
    "id": 434455988,
    "status": "archived",
    "created_at": "2017-03-17T07:49:41.480+01:00",
    "updated_at": "2017-03-17T07:51:26.944+01:00",
    "type": "Document",
    "url": "https://3.basecampapi.com/3688623/buckets/2957043/documents/434455988.json",
    "app_url": "https://3.basecamp.com/3688623/buckets/2957043/documents/434455988",
    "parent": {
      "id": 419211339,
      "title": "Docs \u0026 Files",
      "type": "Vault",
      "url": "https://3.basecampapi.com/3688623/buckets/2957043/vaults/419211339.json",
      "app_url": "https://3.basecamp.com/3688623/buckets/2957043/vaults/419211339"
    },
    "bucket": {
      "id": 2957043,
      "name": "Zulip HQ",
      "type": "Project"
    },
    "creator": {
      "id": 10695738,
      "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
      "name": "Tomasz",
      "email_address": "tomaszkolek0@gmail.com",
      "personable_type": "User",
      "title": null,
      "bio": null,
      "created_at": "2017-03-07T07:21:08.088+01:00",
      "updated_at": "2017-03-07T07:21:27.633+01:00",
      "admin": true,
      "owner": true,
      "time_zone": "Europe/Amsterdam",
      "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
      "company": {
        "id": 796227,
        "name": "Zulip"
      }
    },
    "title": "new doc",
    "content": "\u003cdiv\u003econtent\u003c/div\u003e"
  },
  "creator": {
    "id": 10695738,
    "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
    "name": "Tomasz",
    "email_address": "tomaszkolek0@gmail.com",
    "personable_type": "User",
    "title": null,
    "bio": null,
    "created_at": "2017-03-07T07:21:08.088+01:00",
    "updated_at": "2017-03-07T07:21:27.633+01:00",
    "admin": true,
    "owner": true,
    "time_zone": "Europe/Amsterdam",
    "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
    "company": {
      "id": 796227,
      "name": "Zulip"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: doc_content_changed.json]---
Location: zulip-main/zerver/webhooks/basecamp/fixtures/doc_content_changed.json

```json
{
  "id": 664750610,
  "kind": "document_content_changed",
  "details": {},
  "created_at": "2017-03-16T07:41:19.273+01:00",
  "recording": {
    "id": 432522214,
    "status": "active",
    "created_at": "2017-03-16T07:39:52.725+01:00",
    "updated_at": "2017-03-16T07:41:19.266+01:00",
    "type": "Document",
    "url": "https://3.basecampapi.com/3688623/buckets/2957043/documents/432522214.json",
    "app_url": "https://3.basecamp.com/3688623/buckets/2957043/documents/432522214",
    "parent": {
      "id": 419211339,
      "title": "Docs \u0026 Files",
      "type": "Vault",
      "url": "https://3.basecampapi.com/3688623/buckets/2957043/vaults/419211339.json",
      "app_url": "https://3.basecamp.com/3688623/buckets/2957043/vaults/419211339"
    },
    "bucket": {
      "id": 2957043,
      "name": "Zulip HQ",
      "type": "Project"
    },
    "creator": {
      "id": 10695738,
      "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
      "name": "Tomasz",
      "email_address": "tomaszkolek0@gmail.com",
      "personable_type": "User",
      "title": null,
      "bio": null,
      "created_at": "2017-03-07T07:21:08.088+01:00",
      "updated_at": "2017-03-07T07:21:27.633+01:00",
      "admin": true,
      "owner": true,
      "time_zone": "Europe/Amsterdam",
      "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
      "company": {
        "id": 796227,
        "name": "Zulip"
      }
    },
    "title": "New doc edit",
    "content": "\u003cdiv\u003eabc new\u003c/div\u003e"
  },
  "creator": {
    "id": 10695738,
    "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
    "name": "Tomasz",
    "email_address": "tomaszkolek0@gmail.com",
    "personable_type": "User",
    "title": null,
    "bio": null,
    "created_at": "2017-03-07T07:21:08.088+01:00",
    "updated_at": "2017-03-07T07:21:27.633+01:00",
    "admin": true,
    "owner": true,
    "time_zone": "Europe/Amsterdam",
    "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
    "company": {
      "id": 796227,
      "name": "Zulip"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: doc_created.json]---
Location: zulip-main/zerver/webhooks/basecamp/fixtures/doc_created.json

```json
{
  "id": 667388601,
  "kind": "document_created",
  "details": {
    "notified_recipient_ids": []
  },
  "created_at": "2017-03-17T07:49:41.495+01:00",
  "recording": {
    "id": 434455988,
    "status": "active",
    "created_at": "2017-03-17T07:49:41.480+01:00",
    "updated_at": "2017-03-17T07:49:41.486+01:00",
    "type": "Document",
    "url": "https://3.basecampapi.com/3688623/buckets/2957043/documents/434455988.json",
    "app_url": "https://3.basecamp.com/3688623/buckets/2957043/documents/434455988",
    "parent": {
      "id": 419211339,
      "title": "Docs \u0026 Files",
      "type": "Vault",
      "url": "https://3.basecampapi.com/3688623/buckets/2957043/vaults/419211339.json",
      "app_url": "https://3.basecamp.com/3688623/buckets/2957043/vaults/419211339"
    },
    "bucket": {
      "id": 2957043,
      "name": "Zulip HQ",
      "type": "Project"
    },
    "creator": {
      "id": 10695738,
      "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
      "name": "Tomasz",
      "email_address": "tomaszkolek0@gmail.com",
      "personable_type": "User",
      "title": null,
      "bio": null,
      "created_at": "2017-03-07T07:21:08.088+01:00",
      "updated_at": "2017-03-07T07:21:27.633+01:00",
      "admin": true,
      "owner": true,
      "time_zone": "Europe/Amsterdam",
      "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
      "company": {
        "id": 796227,
        "name": "Zulip"
      }
    },
    "title": "new doc",
    "content": "\u003cdiv\u003econtent\u003c/div\u003e"
  },
  "creator": {
    "id": 10695738,
    "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
    "name": "Tomasz",
    "email_address": "tomaszkolek0@gmail.com",
    "personable_type": "User",
    "title": null,
    "bio": null,
    "created_at": "2017-03-07T07:21:08.088+01:00",
    "updated_at": "2017-03-07T07:21:27.633+01:00",
    "admin": true,
    "owner": true,
    "time_zone": "Europe/Amsterdam",
    "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
    "company": {
      "id": 796227,
      "name": "Zulip"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: doc_publicized.json]---
Location: zulip-main/zerver/webhooks/basecamp/fixtures/doc_publicized.json

```json
{
  "id": 667390593,
  "kind": "document_publicized",
  "details": {},
  "created_at": "2017-03-17T07:52:24.586+01:00",
  "recording": {
    "id": 434455988,
    "status": "active",
    "created_at": "2017-03-17T07:49:41.480+01:00",
    "updated_at": "2017-03-17T07:52:24.560+01:00",
    "type": "Document",
    "url": "https://3.basecampapi.com/3688623/buckets/2957043/documents/434455988.json",
    "app_url": "https://3.basecamp.com/3688623/buckets/2957043/documents/434455988",
    "parent": {
      "id": 419211339,
      "title": "Docs \u0026 Files",
      "type": "Vault",
      "url": "https://3.basecampapi.com/3688623/buckets/2957043/vaults/419211339.json",
      "app_url": "https://3.basecamp.com/3688623/buckets/2957043/vaults/419211339"
    },
    "bucket": {
      "id": 2957043,
      "name": "Zulip HQ",
      "type": "Project"
    },
    "creator": {
      "id": 10695738,
      "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
      "name": "Tomasz",
      "email_address": "tomaszkolek0@gmail.com",
      "personable_type": "User",
      "title": null,
      "bio": null,
      "created_at": "2017-03-07T07:21:08.088+01:00",
      "updated_at": "2017-03-07T07:21:27.633+01:00",
      "admin": true,
      "owner": true,
      "time_zone": "Europe/Amsterdam",
      "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
      "company": {
        "id": 796227,
        "name": "Zulip"
      }
    },
    "title": "new doc",
    "content": "\u003cdiv\u003econtent\u003c/div\u003e"
  },
  "creator": {
    "id": 10695738,
    "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
    "name": "Tomasz",
    "email_address": "tomaszkolek0@gmail.com",
    "personable_type": "User",
    "title": null,
    "bio": null,
    "created_at": "2017-03-07T07:21:08.088+01:00",
    "updated_at": "2017-03-07T07:21:27.633+01:00",
    "admin": true,
    "owner": true,
    "time_zone": "Europe/Amsterdam",
    "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
    "company": {
      "id": 796227,
      "name": "Zulip"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: doc_title_changed.json]---
Location: zulip-main/zerver/webhooks/basecamp/fixtures/doc_title_changed.json

```json
{
  "id": 664750302,
  "kind": "document_title_changed",
  "details": {},
  "created_at": "2017-03-16T07:40:40.056+01:00",
  "recording": {
    "id": 432522214,
    "status": "active",
    "created_at": "2017-03-16T07:39:52.725+01:00",
    "updated_at": "2017-03-16T07:40:40.049+01:00",
    "type": "Document",
    "url": "https://3.basecampapi.com/3688623/buckets/2957043/documents/432522214.json",
    "app_url": "https://3.basecamp.com/3688623/buckets/2957043/documents/432522214",
    "parent": {
      "id": 419211339,
      "title": "Docs \u0026 Files",
      "type": "Vault",
      "url": "https://3.basecampapi.com/3688623/buckets/2957043/vaults/419211339.json",
      "app_url": "https://3.basecamp.com/3688623/buckets/2957043/vaults/419211339"
    },
    "bucket": {
      "id": 2957043,
      "name": "Zulip HQ",
      "type": "Project"
    },
    "creator": {
      "id": 10695738,
      "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
      "name": "Tomasz",
      "email_address": "tomaszkolek0@gmail.com",
      "personable_type": "User",
      "title": null,
      "bio": null,
      "created_at": "2017-03-07T07:21:08.088+01:00",
      "updated_at": "2017-03-07T07:21:27.633+01:00",
      "admin": true,
      "owner": true,
      "time_zone": "Europe/Amsterdam",
      "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
      "company": {
        "id": 796227,
        "name": "Zulip"
      }
    },
    "title": "New doc edit",
    "content": "\u003cdiv\u003eabc\u003c/div\u003e"
  },
  "creator": {
    "id": 10695738,
    "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
    "name": "Tomasz",
    "email_address": "tomaszkolek0@gmail.com",
    "personable_type": "User",
    "title": null,
    "bio": null,
    "created_at": "2017-03-07T07:21:08.088+01:00",
    "updated_at": "2017-03-07T07:21:27.633+01:00",
    "admin": true,
    "owner": true,
    "time_zone": "Europe/Amsterdam",
    "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
    "company": {
      "id": 796227,
      "name": "Zulip"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: doc_trashed.json]---
Location: zulip-main/zerver/webhooks/basecamp/fixtures/doc_trashed.json

```json
{
  "id": 667391344,
  "kind": "document_trashed",
  "details": {
    "status_was": "archived"
  },
  "created_at": "2017-03-17T07:53:08.753+01:00",
  "recording": {
    "id": 434455988,
    "status": "trashed",
    "created_at": "2017-03-17T07:49:41.480+01:00",
    "updated_at": "2017-03-17T07:53:08.750+01:00",
    "type": "Document",
    "url": "https://3.basecampapi.com/3688623/buckets/2957043/documents/434455988.json",
    "app_url": "https://3.basecamp.com/3688623/buckets/2957043/documents/434455988",
    "parent": {
      "id": 419211339,
      "title": "Docs \u0026 Files",
      "type": "Vault",
      "url": "https://3.basecampapi.com/3688623/buckets/2957043/vaults/419211339.json",
      "app_url": "https://3.basecamp.com/3688623/buckets/2957043/vaults/419211339"
    },
    "bucket": {
      "id": 2957043,
      "name": "Zulip HQ",
      "type": "Project"
    },
    "creator": {
      "id": 10695738,
      "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
      "name": "Tomasz",
      "email_address": "tomaszkolek0@gmail.com",
      "personable_type": "User",
      "title": null,
      "bio": null,
      "created_at": "2017-03-07T07:21:08.088+01:00",
      "updated_at": "2017-03-07T07:21:27.633+01:00",
      "admin": true,
      "owner": true,
      "time_zone": "Europe/Amsterdam",
      "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
      "company": {
        "id": 796227,
        "name": "Zulip"
      }
    },
    "title": "new doc",
    "content": "\u003cdiv\u003econtent\u003c/div\u003e"
  },
  "creator": {
    "id": 10695738,
    "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
    "name": "Tomasz",
    "email_address": "tomaszkolek0@gmail.com",
    "personable_type": "User",
    "title": null,
    "bio": null,
    "created_at": "2017-03-07T07:21:08.088+01:00",
    "updated_at": "2017-03-07T07:21:27.633+01:00",
    "admin": true,
    "owner": true,
    "time_zone": "Europe/Amsterdam",
    "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
    "company": {
      "id": 796227,
      "name": "Zulip"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: doc_unarchive.json]---
Location: zulip-main/zerver/webhooks/basecamp/fixtures/doc_unarchive.json

```json
{
  "id": 667390272,
  "kind": "document_unarchived",
  "details": {},
  "created_at": "2017-03-17T07:52:01.726+01:00",
  "recording": {
    "id": 434455988,
    "status": "active",
    "created_at": "2017-03-17T07:49:41.480+01:00",
    "updated_at": "2017-03-17T07:52:01.722+01:00",
    "type": "Document",
    "url": "https://3.basecampapi.com/3688623/buckets/2957043/documents/434455988.json",
    "app_url": "https://3.basecamp.com/3688623/buckets/2957043/documents/434455988",
    "parent": {
      "id": 419211339,
      "title": "Docs \u0026 Files",
      "type": "Vault",
      "url": "https://3.basecampapi.com/3688623/buckets/2957043/vaults/419211339.json",
      "app_url": "https://3.basecamp.com/3688623/buckets/2957043/vaults/419211339"
    },
    "bucket": {
      "id": 2957043,
      "name": "Zulip HQ",
      "type": "Project"
    },
    "creator": {
      "id": 10695738,
      "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
      "name": "Tomasz",
      "email_address": "tomaszkolek0@gmail.com",
      "personable_type": "User",
      "title": null,
      "bio": null,
      "created_at": "2017-03-07T07:21:08.088+01:00",
      "updated_at": "2017-03-07T07:21:27.633+01:00",
      "admin": true,
      "owner": true,
      "time_zone": "Europe/Amsterdam",
      "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
      "company": {
        "id": 796227,
        "name": "Zulip"
      }
    },
    "title": "new doc",
    "content": "\u003cdiv\u003econtent\u003c/div\u003e"
  },
  "creator": {
    "id": 10695738,
    "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
    "name": "Tomasz",
    "email_address": "tomaszkolek0@gmail.com",
    "personable_type": "User",
    "title": null,
    "bio": null,
    "created_at": "2017-03-07T07:21:08.088+01:00",
    "updated_at": "2017-03-07T07:21:27.633+01:00",
    "admin": true,
    "owner": true,
    "time_zone": "Europe/Amsterdam",
    "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
    "company": {
      "id": 796227,
      "name": "Zulip"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: message_archived.json]---
Location: zulip-main/zerver/webhooks/basecamp/fixtures/message_archived.json

```json
{
  "id": 662187149,
  "kind": "message_archived",
  "details": {
    "status_was": "active"
  },
  "created_at": "2017-03-15T06:35:09.047+01:00",
  "recording": {
    "id": 430680605,
    "status": "archived",
    "created_at": "2017-03-15T06:32:23.357+01:00",
    "updated_at": "2017-03-15T06:35:09.042+01:00",
    "type": "Message",
    "url": "https://3.basecampapi.com/3688623/buckets/2957043/messages/430680605.json",
    "app_url": "https://3.basecamp.com/3688623/buckets/2957043/messages/430680605",
    "parent": {
      "id": 419211298,
      "title": "Message Board",
      "type": "Message::Board",
      "url": "https://3.basecampapi.com/3688623/buckets/2957043/message_boards/419211298.json",
      "app_url": "https://3.basecamp.com/3688623/buckets/2957043/message_boards/419211298"
    },
    "bucket": {
      "id": 2957043,
      "name": "Zulip HQ",
      "type": "Project"
    },
    "creator": {
      "id": 10695738,
      "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
      "name": "Tomasz",
      "email_address": "tomaszkolek0@gmail.com",
      "personable_type": "User",
      "title": null,
      "bio": null,
      "created_at": "2017-03-07T07:21:08.088+01:00",
      "updated_at": "2017-03-07T07:21:27.633+01:00",
      "admin": true,
      "owner": true,
      "time_zone": "Europe/Amsterdam",
      "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
      "company": {
        "id": 796227,
        "name": "Zulip"
      }
    },
    "title": "Message Title new",
    "content": "\u003cdiv\u003emessage content new\u003c/div\u003e"
  },
  "creator": {
    "id": 10695738,
    "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
    "name": "Tomasz",
    "email_address": "tomaszkolek0@gmail.com",
    "personable_type": "User",
    "title": null,
    "bio": null,
    "created_at": "2017-03-07T07:21:08.088+01:00",
    "updated_at": "2017-03-07T07:21:27.633+01:00",
    "admin": true,
    "owner": true,
    "time_zone": "Europe/Amsterdam",
    "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
    "company": {
      "id": 796227,
      "name": "Zulip"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: message_content_changed.json]---
Location: zulip-main/zerver/webhooks/basecamp/fixtures/message_content_changed.json

```json
{
  "id": 662185533,
  "kind": "message_content_changed",
  "details": {},
  "created_at": "2017-03-15T06:33:46.917+01:00",
  "recording": {
    "id": 430680605,
    "status": "active",
    "created_at": "2017-03-15T06:32:23.357+01:00",
    "updated_at": "2017-03-15T06:33:46.905+01:00",
    "type": "Message",
    "url": "https://3.basecampapi.com/3688623/buckets/2957043/messages/430680605.json",
    "app_url": "https://3.basecamp.com/3688623/buckets/2957043/messages/430680605",
    "parent": {
      "id": 419211298,
      "title": "Message Board",
      "type": "Message::Board",
      "url": "https://3.basecampapi.com/3688623/buckets/2957043/message_boards/419211298.json",
      "app_url": "https://3.basecamp.com/3688623/buckets/2957043/message_boards/419211298"
    },
    "bucket": {
      "id": 2957043,
      "name": "Zulip HQ",
      "type": "Project"
    },
    "creator": {
      "id": 10695738,
      "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
      "name": "Tomasz",
      "email_address": "tomaszkolek0@gmail.com",
      "personable_type": "User",
      "title": null,
      "bio": null,
      "created_at": "2017-03-07T07:21:08.088+01:00",
      "updated_at": "2017-03-07T07:21:27.633+01:00",
      "admin": true,
      "owner": true,
      "time_zone": "Europe/Amsterdam",
      "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
      "company": {
        "id": 796227,
        "name": "Zulip"
      }
    },
    "title": "Message Title new",
    "content": "\u003cdiv\u003emessage content new\u003c/div\u003e"
  },
  "creator": {
    "id": 10695738,
    "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
    "name": "Tomasz",
    "email_address": "tomaszkolek0@gmail.com",
    "personable_type": "User",
    "title": null,
    "bio": null,
    "created_at": "2017-03-07T07:21:08.088+01:00",
    "updated_at": "2017-03-07T07:21:27.633+01:00",
    "admin": true,
    "owner": true,
    "time_zone": "Europe/Amsterdam",
    "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
    "company": {
      "id": 796227,
      "name": "Zulip"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: message_created.json]---
Location: zulip-main/zerver/webhooks/basecamp/fixtures/message_created.json

```json
{
  "id": 662184942,
  "kind": "message_created",
  "details": {
    "notified_recipient_ids": []
  },
  "created_at": "2017-03-15T06:32:23.372+01:00",
  "recording": {
    "id": 430680605,
    "status": "active",
    "created_at": "2017-03-15T06:32:23.357+01:00",
    "updated_at": "2017-03-15T06:32:23.363+01:00",
    "type": "Message",
    "url": "https://3.basecampapi.com/3688623/buckets/2957043/messages/430680605.json",
    "app_url": "https://3.basecamp.com/3688623/buckets/2957043/messages/430680605",
    "parent": {
      "id": 419211298,
      "title": "Message Board",
      "type": "Message::Board",
      "url": "https://3.basecampapi.com/3688623/buckets/2957043/message_boards/419211298.json",
      "app_url": "https://3.basecamp.com/3688623/buckets/2957043/message_boards/419211298"
    },
    "bucket": {
      "id": 2957043,
      "name": "Zulip HQ",
      "type": "Project"
    },
    "creator": {
      "id": 10695738,
      "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
      "name": "Tomasz",
      "email_address": "tomaszkolek0@gmail.com",
      "personable_type": "User",
      "title": null,
      "bio": null,
      "created_at": "2017-03-07T07:21:08.088+01:00",
      "updated_at": "2017-03-07T07:21:27.633+01:00",
      "admin": true,
      "owner": true,
      "time_zone": "Europe/Amsterdam",
      "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
      "company": {
        "id": 796227,
        "name": "Zulip"
      }
    },
    "title": "Message Title",
    "content": "\u003cdiv\u003emessage content\u003c/div\u003e"
  },
  "creator": {
    "id": 10695738,
    "attachable_sgid": "BAh7CEkiCGdpZAY6BkVUSSIpZ2lkOi8vYmMzL1BlcnNvbi8xMDY5NTczOD9leHBpcmVzX2luBjsAVEkiDHB1cnBvc2UGOwBUSSIPYXR0YWNoYWJsZQY7AFRJIg9leHBpcmVzX2F0BjsAVDA=--eb8f230d022d5e8ab202e2f62a86f767219c1c83",
    "name": "Tomasz",
    "email_address": "tomaszkolek0@gmail.com",
    "personable_type": "User",
    "title": null,
    "bio": null,
    "created_at": "2017-03-07T07:21:08.088+01:00",
    "updated_at": "2017-03-07T07:21:27.633+01:00",
    "admin": true,
    "owner": true,
    "time_zone": "Europe/Amsterdam",
    "avatar_url": "https://3.basecamp-static.com/3688623/people/BAhpAzo0ow==--9f2bd7e6c043c8b45d6afb82efc1a897fbbee92c/avatar-64-x4",
    "company": {
      "id": 796227,
      "name": "Zulip"
    }
  }
}
```

--------------------------------------------------------------------------------

````
