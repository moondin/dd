---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1144
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1144 of 1290)

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
Location: zulip-main/zerver/webhooks/front/tests.py

```python
import orjson

from zerver.lib.test_classes import WebhookTestCase


class FrontHookTests(WebhookTestCase):
    CHANNEL_NAME = "front"
    URL_TEMPLATE = "/api/v1/external/front?&api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "front"

    # Scenario 1: Conversation starts from an outbound message.

    # Conversation automatically assigned to a teammate who started it.
    def test_conversation_assigned_outbound(self) -> None:
        expected_topic_name = "cnv_keo696"
        expected_message = "**Leela Turanga** assigned themselves."

        self.check_webhook(
            "conversation_assigned_outbound",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_outbound_message(self) -> None:
        expected_topic_name = "cnv_keo696"
        expected_message = (
            "[Outbound message](https://app.frontapp.com/open/msg_1176ie2) "
            "from **support@planet-express.com** "
            "to **calculon@momsbot.com**:\n"
            "```quote\n*Subject*: Your next delivery is on Epsilon 96Z\n```"
        )

        self.check_webhook(
            "outbound_message",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_conversation_archived(self) -> None:
        expected_topic_name = "cnv_keo696"
        expected_message = "Archived by **Leela Turanga**."

        self.check_webhook(
            "conversation_archived",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_conversation_reopened(self) -> None:
        expected_topic_name = "cnv_keo696"
        expected_message = "Reopened by **Leela Turanga**."

        self.check_webhook(
            "conversation_reopened",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_conversation_deleted(self) -> None:
        expected_topic_name = "cnv_keo696"
        expected_message = "Deleted by **Leela Turanga**."

        self.check_webhook(
            "conversation_deleted",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_conversation_restored(self) -> None:
        expected_topic_name = "cnv_keo696"
        expected_message = "Restored by **Leela Turanga**."

        self.check_webhook(
            "conversation_restored",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_conversation_unassigned(self) -> None:
        expected_topic_name = "cnv_keo696"
        expected_message = "Unassigned by **Leela Turanga**."

        self.check_webhook(
            "conversation_unassigned",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_mention_all(self) -> None:
        expected_topic_name = "cnv_keo696"
        expected_message = (
            "**Leela Turanga** left a comment:\n```quote\n@all Could someone else take this?\n```"
        )

        self.check_webhook(
            "mention_all",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    # Scenario 2: Conversation starts from an inbound message.

    def test_inbound_message(self) -> None:
        expected_topic_name = "2x9c5v"
        expected_message = (
            "[Inbound message](https://app.frontapp.com/open/msg_1176r8y) "
            "from **calculon@momsbot.com** "
            "to **support@planet-express.com**:\n"
            "```quote\n*Subject*: Cancellation Request for Subscription #SUB-67890\n```"
        )

        self.check_webhook(
            "inbound_message",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_conversation_tagged(self) -> None:
        expected_topic_name = "cnv_keocka"
        expected_message = "**Leela Turanga** added tag **Urgent**."

        self.check_webhook(
            "conversation_tagged",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    # Conversation automatically assigned to a teammate who replied to it.
    def test_conversation_assigned_reply(self) -> None:
        expected_topic_name = "cnv_keocka"
        expected_message = "**Leela Turanga** assigned themselves."

        self.check_webhook(
            "conversation_assigned_reply",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_outbound_reply(self) -> None:
        expected_topic_name = "cnv_keocka"
        expected_message = (
            "[Outbound reply](https://app.frontapp.com/open/msg_1176ryy) "
            "from **support@planet-express.com** "
            "to **calculon@momsbot.com**."
        )

        self.check_webhook(
            "outbound_reply",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_conversation_untagged(self) -> None:
        expected_topic_name = "cnv_keocka"
        expected_message = "**Leela Turanga** removed tag **Urgent**."

        self.check_webhook(
            "conversation_untagged",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_mention(self) -> None:
        expected_topic_name = "cnv_keocka"
        expected_message = (
            "**Leela Turanga** left a comment:\n```quote\n@bender Could you take it from here?\n```"
        )

        self.check_webhook(
            "mention",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_comment(self) -> None:
        expected_topic_name = "cnv_keocka"
        expected_message = "**Bender Rodriguez** left a comment:\n```quote\nSure.\n```"

        self.check_webhook(
            "comment",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    # Conversation manually assigned to another teammate.
    def test_conversation_assigned(self) -> None:
        expected_topic_name = "cnv_keocka"
        expected_message = "**Leela Turanga** assigned **Bender Rodriguez**."

        self.check_webhook(
            "conversation_assigned",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_conversation_assigned_by_rule(self) -> None:
        expected_topic_name = "cnv_keocka"
        expected_message = "**'Important deliveries' rule** assigned **Bender Rodriguez**."

        self.check_webhook(
            "rule",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_conversation_assigned_by_gmail(self) -> None:
        expected_topic_name = "cnv_keo696"
        expected_message = "Archived by **(gmail)**."

        self.check_webhook(
            "gmail",
            expected_topic_name,
            expected_message,
            content_type="application/x-www-form-urlencoded",
        )

    def test_unknown_webhook_request(self) -> None:
        payload = self.get_body("conversation_assigned")
        payload_json = orjson.loads(payload)
        payload_json["type"] = "qwerty"
        result = self.client_post(
            self.url, orjson.dumps(payload_json), content_type="application/x-www-form-urlencoded"
        )

        self.assert_json_error(result, "Unknown webhook request")
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/front/view.py
Signals: Django

```python
from collections.abc import Callable

from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _

from zerver.decorator import webhook_view
from zerver.lib.exceptions import JsonableError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile


def get_message_data(payload: WildValue) -> tuple[str, str, str, str]:
    link = "https://app.frontapp.com/open/" + payload["target"]["data"]["id"].tame(check_string)
    outbox = payload["conversation"]["recipient"]["handle"].tame(check_string)
    inbox = payload["source"]["data"][0]["address"].tame(check_string)
    subject = payload["conversation"]["subject"].tame(check_string)
    return link, outbox, inbox, subject


def get_source_name(payload: WildValue) -> str:
    type = payload["source"]["_meta"]["type"].tame(check_string)
    if type == "teammate":
        first_name = payload["source"]["data"]["first_name"].tame(check_string)
        last_name = payload["source"]["data"]["last_name"].tame(check_string)
        return f"{first_name} {last_name}"
    elif type == "rule":
        name = payload["source"]["data"]["name"].tame(check_string)
        return f"'{name}' rule"
    return f"({type})"


def get_target_name(payload: WildValue) -> str:
    first_name = payload["target"]["data"]["first_name"].tame(check_string)
    last_name = payload["target"]["data"]["last_name"].tame(check_string)
    return f"{first_name} {last_name}"


def get_inbound_message_body(payload: WildValue) -> str:
    link, outbox, inbox, subject = get_message_data(payload)
    return (
        f"[Inbound message]({link}) from **{outbox}** to **{inbox}**:\n"
        f"```quote\n*Subject*: {subject}\n```"
    )


def get_outbound_message_body(payload: WildValue) -> str:
    link, outbox, inbox, subject = get_message_data(payload)
    return (
        f"[Outbound message]({link}) from **{inbox}** to **{outbox}**:\n"
        f"```quote\n*Subject*: {subject}\n```"
    )


def get_outbound_reply_body(payload: WildValue) -> str:
    link, outbox, inbox, _subject = get_message_data(payload)
    return f"[Outbound reply]({link}) from **{inbox}** to **{outbox}**."


def get_comment_body(payload: WildValue) -> str:
    name = get_source_name(payload)
    comment = payload["target"]["data"]["body"].tame(check_string)
    return f"**{name}** left a comment:\n```quote\n{comment}\n```"


def get_conversation_assigned_body(payload: WildValue) -> str:
    source_name = get_source_name(payload)
    target_name = get_target_name(payload)

    if source_name == target_name:
        return f"**{source_name}** assigned themselves."

    return f"**{source_name}** assigned **{target_name}**."


def get_conversation_unassigned_body(payload: WildValue) -> str:
    name = get_source_name(payload)
    return f"Unassigned by **{name}**."


def get_conversation_archived_body(payload: WildValue) -> str:
    name = get_source_name(payload)
    return f"Archived by **{name}**."


def get_conversation_reopened_body(payload: WildValue) -> str:
    name = get_source_name(payload)
    return f"Reopened by **{name}**."


def get_conversation_deleted_body(payload: WildValue) -> str:
    name = get_source_name(payload)
    return f"Deleted by **{name}**."


def get_conversation_restored_body(payload: WildValue) -> str:
    name = get_source_name(payload)
    return f"Restored by **{name}**."


def get_conversation_tagged_body(payload: WildValue) -> str:
    name = get_source_name(payload)
    tag = payload["target"]["data"]["name"].tame(check_string)
    return f"**{name}** added tag **{tag}**."


def get_conversation_untagged_body(payload: WildValue) -> str:
    name = get_source_name(payload)
    tag = payload["target"]["data"]["name"].tame(check_string)
    return f"**{name}** removed tag **{tag}**."


EVENT_FUNCTION_MAPPER = {
    "inbound": get_inbound_message_body,
    "outbound": get_outbound_message_body,
    "out_reply": get_outbound_reply_body,
    "comment": get_comment_body,
    "mention": get_comment_body,
    "assign": get_conversation_assigned_body,
    "unassign": get_conversation_unassigned_body,
    "archive": get_conversation_archived_body,
    "reopen": get_conversation_reopened_body,
    "trash": get_conversation_deleted_body,
    "restore": get_conversation_restored_body,
    "tag": get_conversation_tagged_body,
    "untag": get_conversation_untagged_body,
}

ALL_EVENT_TYPES = list(EVENT_FUNCTION_MAPPER.keys())


def get_body_based_on_event(event: str) -> Callable[[WildValue], str]:
    return EVENT_FUNCTION_MAPPER[event]


@webhook_view("Front", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_front_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    event = payload["type"].tame(check_string)
    if event not in EVENT_FUNCTION_MAPPER:
        raise JsonableError(_("Unknown webhook request"))

    topic_name = payload["conversation"]["id"].tame(check_string)
    body = get_body_based_on_event(event)(payload)
    check_send_webhook_message(request, user_profile, topic_name, body, event)

    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: comment.json]---
Location: zulip-main/zerver/webhooks/front/fixtures/comment.json
Signals: Express

```json
{
  "_links": {
    "self": "https://api2.frontapp.com/events/evt_28duvr6"
  },
  "id": "evt_28duvr6",
  "type": "comment",
  "emitted_at": 1518309749.673,
  "conversation": {
    "_links": {
      "self": "https://api2.frontapp.com/conversations/cnv_keocka",
      "related": {
        "events": "https://api2.frontapp.com/conversations/cnv_keocka/events",
        "followers": "https://api2.frontapp.com/conversations/cnv_keocka/followers",
        "messages": "https://api2.frontapp.com/conversations/cnv_keocka/messages",
        "comments": "https://api2.frontapp.com/conversations/cnv_keocka/comments",
        "inboxes": "https://api2.frontapp.com/conversations/cnv_keocka/inboxes"
      }
    },
    "id": "cnv_keocka",
    "subject": "Re: Being a robot is great, but...",
    "status": "assigned",
    "assignee": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40yq",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
        }
      },
      "id": "tea_40yq",
      "email": "leela@planet-express.com",
      "username": "leela",
      "first_name": "Leela",
      "last_name": "Turanga",
      "is_admin": true,
      "is_available": true
    },
    "recipient": {
      "_links": {
        "related": {
          "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
        }
      },
      "handle": "calculon@momsbot.com",
      "role": "to"
    },
    "tags": [],
    "last_message": {
      "_links": {
        "self": "https://api2.frontapp.com/messages/msg_1176ryy",
        "related": {
          "conversation": "https://api2.frontapp.com/conversations/cnv_keocka",
          "message_replied_to": "https://api2.frontapp.com/messages/msg_1176r8y"
        }
      },
      "id": "msg_1176ryy",
      "type": "email",
      "is_inbound": false,
      "created_at": 1518309342.896,
      "blurb": "Emotions are dumb and should be hated. ",
      "body": "<div>Emotions are dumb and should be hated.</div>",
      "text": "Emotions are dumb and should be hated.\n",
      "metadata": {},
      "author": {
        "_links": {
          "self": "https://api2.frontapp.com/teammates/tea_40yq",
          "related": {
            "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
            "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
          }
        },
        "id": "tea_40yq",
        "email": "leela@planet-express.com",
        "username": "leela",
        "first_name": "Leela",
        "last_name": "Turanga",
        "is_admin": true,
        "is_available": true
      },
      "recipients": [
        {
          "_links": {
            "related": {
              "contact": null
            }
          },
          "handle": "support@planet-express.com",
          "role": "from"
        },
        {
          "_links": {
            "related": {
              "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
            }
          },
          "handle": "calculon@momsbot.com",
          "role": "to"
        }
      ],
      "attachments": []
    },
    "created_at": 1518309203.872
  },
  "source": {
    "_meta": {
      "type": "teammate"
    },
    "data": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40z6",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40z6/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40z6/conversations"
        }
      },
      "id": "tea_40z6",
      "email": "bender@planet-express.com",
      "username": "bender",
      "first_name": "Bender",
      "last_name": "Rodriguez",
      "is_admin": false,
      "is_available": true
    }
  },
  "target": {
    "_meta": {
      "type": "comment"
    },
    "data": {
      "_links": {
        "self": "https://api2.frontapp.com/comments/com_shgc2",
        "related": {
          "conversation": "https://api2.frontapp.com/conversations/cnv_keocka",
          "mentions": "https://api2.frontapp.com/comments/com_shgc2/mentions"
        }
      },
      "id": "com_shgc2",
      "body": "Sure.",
      "posted_at": 1518309749.657,
      "author": {
        "_links": {
          "self": "https://api2.frontapp.com/teammates/tea_40z6",
          "related": {
            "inboxes": "https://api2.frontapp.com/teammates/tea_40z6/inboxes",
            "conversations": "https://api2.frontapp.com/teammates/tea_40z6/conversations"
          }
        },
        "id": "tea_40z6",
        "email": "bender@planet-express.com",
        "username": "bender",
        "first_name": "Bender",
        "last_name": "Rodriguez",
        "is_admin": false,
        "is_available": true
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: conversation_archived.json]---
Location: zulip-main/zerver/webhooks/front/fixtures/conversation_archived.json
Signals: Next.js, Express

```json
{
  "_links": {
    "self": "https://api2.frontapp.com/events/evt_28du7y2"
  },
  "id": "evt_28du7y2",
  "type": "archive",
  "emitted_at": 1518307966.678,
  "conversation": {
    "_links": {
      "self": "https://api2.frontapp.com/conversations/cnv_keo696",
      "related": {
        "events": "https://api2.frontapp.com/conversations/cnv_keo696/events",
        "followers": "https://api2.frontapp.com/conversations/cnv_keo696/followers",
        "messages": "https://api2.frontapp.com/conversations/cnv_keo696/messages",
        "comments": "https://api2.frontapp.com/conversations/cnv_keo696/comments",
        "inboxes": "https://api2.frontapp.com/conversations/cnv_keo696/inboxes"
      }
    },
    "id": "cnv_keo696",
    "subject": "Your next delivery is on Epsilon 96Z",
    "status": "archived",
    "assignee": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40yq",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
        }
      },
      "id": "tea_40yq",
      "email": "leela@planet-express.com",
      "username": "leela",
      "first_name": "Leela",
      "last_name": "Turanga",
      "is_admin": true,
      "is_available": true
    },
    "recipient": {
      "_links": {
        "related": {
          "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
        }
      },
      "handle": "calculon@momsbot.com",
      "role": "to"
    },
    "tags": [],
    "last_message": {
      "_links": {
        "self": "https://api2.frontapp.com/messages/msg_1176ie2",
        "related": {
          "conversation": "https://api2.frontapp.com/conversations/cnv_keo696"
        }
      },
      "id": "msg_1176ie2",
      "type": "email",
      "is_inbound": false,
      "created_at": 1518307909.541,
      "blurb": "There will be plenty of time to discuss your objections when and if you return. ",
      "body": "<div>There will be plenty of time to discuss your objections when and if you return.</div>",
      "text": "There will be plenty of time to discuss your objections when and if you return.\n",
      "metadata": {},
      "author": {
        "_links": {
          "self": "https://api2.frontapp.com/teammates/tea_40yq",
          "related": {
            "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
            "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
          }
        },
        "id": "tea_40yq",
        "email": "leela@planet-express.com",
        "username": "leela",
        "first_name": "Leela",
        "last_name": "Turanga",
        "is_admin": true,
        "is_available": true
      },
      "recipients": [
        {
          "_links": {
            "related": {
              "contact": null
            }
          },
          "handle": "support@planet-express.com",
          "role": "from"
        },
        {
          "_links": {
            "related": {
              "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
            }
          },
          "handle": "calculon@momsbot.com",
          "role": "to"
        }
      ],
      "attachments": []
    },
    "created_at": 1518307874.673
  },
  "source": {
    "_meta": {
      "type": "teammate"
    },
    "data": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40yq",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
        }
      },
      "id": "tea_40yq",
      "email": "leela@planet-express.com",
      "username": "leela",
      "first_name": "Leela",
      "last_name": "Turanga",
      "is_admin": true,
      "is_available": true
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: conversation_assigned.json]---
Location: zulip-main/zerver/webhooks/front/fixtures/conversation_assigned.json
Signals: Express

```json
{
  "_links": {
    "self": "https://api2.frontapp.com/events/evt_28duxju"
  },
  "id": "evt_28duxju",
  "type": "assign",
  "emitted_at": 1518309907.474,
  "conversation": {
    "_links": {
      "self": "https://api2.frontapp.com/conversations/cnv_keocka",
      "related": {
        "events": "https://api2.frontapp.com/conversations/cnv_keocka/events",
        "followers": "https://api2.frontapp.com/conversations/cnv_keocka/followers",
        "messages": "https://api2.frontapp.com/conversations/cnv_keocka/messages",
        "comments": "https://api2.frontapp.com/conversations/cnv_keocka/comments",
        "inboxes": "https://api2.frontapp.com/conversations/cnv_keocka/inboxes"
      }
    },
    "id": "cnv_keocka",
    "subject": "Re: Being a robot is great, but...",
    "status": "assigned",
    "assignee": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40z6",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40z6/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40z6/conversations"
        }
      },
      "id": "tea_40z6",
      "email": "bender@planet-express.com",
      "username": "bender",
      "first_name": "Bender",
      "last_name": "Rodriguez",
      "is_admin": false,
      "is_available": true
    },
    "recipient": {
      "_links": {
        "related": {
          "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
        }
      },
      "handle": "calculon@momsbot.com",
      "role": "to"
    },
    "tags": [],
    "last_message": {
      "_links": {
        "self": "https://api2.frontapp.com/messages/msg_1176ryy",
        "related": {
          "conversation": "https://api2.frontapp.com/conversations/cnv_keocka",
          "message_replied_to": "https://api2.frontapp.com/messages/msg_1176r8y"
        }
      },
      "id": "msg_1176ryy",
      "type": "email",
      "is_inbound": false,
      "created_at": 1518309342.896,
      "blurb": "Emotions are dumb and should be hated. ",
      "body": "<div>Emotions are dumb and should be hated.</div>",
      "text": "Emotions are dumb and should be hated.\n",
      "metadata": {},
      "author": {
        "_links": {
          "self": "https://api2.frontapp.com/teammates/tea_40yq",
          "related": {
            "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
            "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
          }
        },
        "id": "tea_40yq",
        "email": "leela@planet-express.com",
        "username": "leela",
        "first_name": "Leela",
        "last_name": "Turanga",
        "is_admin": true,
        "is_available": true
      },
      "recipients": [
        {
          "_links": {
            "related": {
              "contact": null
            }
          },
          "handle": "support@planet-express.com",
          "role": "from"
        },
        {
          "_links": {
            "related": {
              "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
            }
          },
          "handle": "calculon@momsbot.com",
          "role": "to"
        }
      ],
      "attachments": []
    },
    "created_at": 1518309203.872
  },
  "source": {
    "_meta": {
      "type": "teammate"
    },
    "data": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40yq",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
        }
      },
      "id": "tea_40yq",
      "email": "leela@planet-express.com",
      "username": "leela",
      "first_name": "Leela",
      "last_name": "Turanga",
      "is_admin": true,
      "is_available": true
    }
  },
  "target": {
    "_meta": {
      "type": "teammate"
    },
    "data": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40z6",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40z6/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40z6/conversations"
        }
      },
      "id": "tea_40z6",
      "email": "bender@planet-express.com",
      "username": "bender",
      "first_name": "Bender",
      "last_name": "Rodriguez",
      "is_admin": false,
      "is_available": true
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: conversation_assigned_outbound.json]---
Location: zulip-main/zerver/webhooks/front/fixtures/conversation_assigned_outbound.json
Signals: Express

```json
{
  "_links": {
    "self": "https://api2.frontapp.com/events/evt_28du6my"
  },
  "id": "evt_28du6my",
  "type": "assign",
  "emitted_at": 1518307894.354,
  "conversation": {
    "_links": {
      "self": "https://api2.frontapp.com/conversations/cnv_keo696",
      "related": {
        "events": "https://api2.frontapp.com/conversations/cnv_keo696/events",
        "followers": "https://api2.frontapp.com/conversations/cnv_keo696/followers",
        "messages": "https://api2.frontapp.com/conversations/cnv_keo696/messages",
        "comments": "https://api2.frontapp.com/conversations/cnv_keo696/comments",
        "inboxes": "https://api2.frontapp.com/conversations/cnv_keo696/inboxes"
      }
    },
    "id": "cnv_keo696",
    "subject": "",
    "status": "invisible",
    "assignee": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40yq",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
        }
      },
      "id": "tea_40yq",
      "email": "leela@planet-express.com",
      "username": "leela",
      "first_name": "Leela",
      "last_name": "Turanga",
      "is_admin": true,
      "is_available": true
    },
    "recipient": {
      "_links": {
        "related": {
          "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
        }
      },
      "handle": "calculon@momsbot.com",
      "role": "to"
    },
    "tags": [],
    "last_message": {},
    "created_at": 1518307874.673
  },
  "source": {
    "_meta": {
      "type": "teammate"
    },
    "data": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40yq",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
        }
      },
      "id": "tea_40yq",
      "email": "leela@planet-express.com",
      "username": "leela",
      "first_name": "Leela",
      "last_name": "Turanga",
      "is_admin": true,
      "is_available": true
    }
  },
  "target": {
    "_meta": {
      "type": "teammate"
    },
    "data": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40yq",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
        }
      },
      "id": "tea_40yq",
      "email": "leela@planet-express.com",
      "username": "leela",
      "first_name": "Leela",
      "last_name": "Turanga",
      "is_admin": true,
      "is_available": true
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: conversation_assigned_reply.json]---
Location: zulip-main/zerver/webhooks/front/fixtures/conversation_assigned_reply.json
Signals: Express

```json
{
  "_links": {
    "self": "https://api2.frontapp.com/events/evt_28dupte"
  },
  "id": "evt_28dupte",
  "type": "assign",
  "emitted_at": 1518309327.693,
  "conversation": {
    "_links": {
      "self": "https://api2.frontapp.com/conversations/cnv_keocka",
      "related": {
        "events": "https://api2.frontapp.com/conversations/cnv_keocka/events",
        "followers": "https://api2.frontapp.com/conversations/cnv_keocka/followers",
        "messages": "https://api2.frontapp.com/conversations/cnv_keocka/messages",
        "comments": "https://api2.frontapp.com/conversations/cnv_keocka/comments",
        "inboxes": "https://api2.frontapp.com/conversations/cnv_keocka/inboxes"
      }
    },
    "id": "cnv_keocka",
    "subject": "Being a robot is great, but...",
    "status": "assigned",
    "assignee": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40yq",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
        }
      },
      "id": "tea_40yq",
      "email": "leela@planet-express.com",
      "username": "leela",
      "first_name": "Leela",
      "last_name": "Turanga",
      "is_admin": true,
      "is_available": true
    },
    "recipient": {
      "_links": {
        "related": {
          "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
        }
      },
      "handle": "calculon@momsbot.com",
      "role": "to"
    },
    "tags": [
      {
        "_links": {
          "self": "https://api2.frontapp.com/tags/tag_11dg2",
          "related": {
            "conversations": "https://api2.frontapp.com/tags/tag_11dg2/conversations"
          }
        },
        "id": "tag_11dg2",
        "name": "Urgent"
      }
    ],
    "last_message": {
      "_links": {
        "self": "https://api2.frontapp.com/messages/msg_1176ryy",
        "related": {
          "conversation": "https://api2.frontapp.com/conversations/cnv_keocka",
          "message_replied_to": "https://api2.frontapp.com/messages/msg_1176r8y"
        }
      },
      "id": "msg_1176ryy",
      "type": "email",
      "is_inbound": false,
      "created_at": 1518309342.784,
      "blurb": "Emotions are dumb and should be hated. ",
      "body": "<div>Emotions are dumb and should be hated.</div>",
      "text": "Emotions are dumb and should be hated.\n",
      "metadata": {},
      "author": {
        "_links": {
          "self": "https://api2.frontapp.com/teammates/tea_40yq",
          "related": {
            "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
            "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
          }
        },
        "id": "tea_40yq",
        "email": "leela@planet-express.com",
        "username": "leela",
        "first_name": "Leela",
        "last_name": "Turanga",
        "is_admin": true,
        "is_available": true
      },
      "recipients": [
        {
          "_links": {
            "related": {
              "contact": null
            }
          },
          "handle": "support@planet-express.com",
          "role": "from"
        },
        {
          "_links": {
            "related": {
              "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
            }
          },
          "handle": "calculon@momsbot.com",
          "role": "to"
        }
      ],
      "attachments": []
    },
    "created_at": 1518309203.872
  },
  "source": {
    "_meta": {
      "type": "teammate"
    },
    "data": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40yq",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
        }
      },
      "id": "tea_40yq",
      "email": "leela@planet-express.com",
      "username": "leela",
      "first_name": "Leela",
      "last_name": "Turanga",
      "is_admin": true,
      "is_available": true
    }
  },
  "target": {
    "_meta": {
      "type": "teammate"
    },
    "data": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40yq",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
        }
      },
      "id": "tea_40yq",
      "email": "leela@planet-express.com",
      "username": "leela",
      "first_name": "Leela",
      "last_name": "Turanga",
      "is_admin": true,
      "is_available": true
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: conversation_deleted.json]---
Location: zulip-main/zerver/webhooks/front/fixtures/conversation_deleted.json
Signals: Next.js, Express

```json
{
  "_links": {
    "self": "https://api2.frontapp.com/events/evt_28du84i"
  },
  "id": "evt_28du84i",
  "type": "trash",
  "emitted_at": 1518307977.111,
  "conversation": {
    "_links": {
      "self": "https://api2.frontapp.com/conversations/cnv_keo696",
      "related": {
        "events": "https://api2.frontapp.com/conversations/cnv_keo696/events",
        "followers": "https://api2.frontapp.com/conversations/cnv_keo696/followers",
        "messages": "https://api2.frontapp.com/conversations/cnv_keo696/messages",
        "comments": "https://api2.frontapp.com/conversations/cnv_keo696/comments",
        "inboxes": "https://api2.frontapp.com/conversations/cnv_keo696/inboxes"
      }
    },
    "id": "cnv_keo696",
    "subject": "Your next delivery is on Epsilon 96Z",
    "status": "deleted",
    "assignee": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40yq",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
        }
      },
      "id": "tea_40yq",
      "email": "leela@planet-express.com",
      "username": "leela",
      "first_name": "Leela",
      "last_name": "Turanga",
      "is_admin": true,
      "is_available": true
    },
    "recipient": {
      "_links": {
        "related": {
          "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
        }
      },
      "handle": "calculon@momsbot.com",
      "role": "to"
    },
    "tags": [],
    "last_message": {
      "_links": {
        "self": "https://api2.frontapp.com/messages/msg_1176ie2",
        "related": {
          "conversation": "https://api2.frontapp.com/conversations/cnv_keo696"
        }
      },
      "id": "msg_1176ie2",
      "type": "email",
      "is_inbound": false,
      "created_at": 1518307909.541,
      "blurb": "There will be plenty of time to discuss your objections when and if you return. ",
      "body": "<div>There will be plenty of time to discuss your objections when and if you return.</div>",
      "text": "There will be plenty of time to discuss your objections when and if you return.\n",
      "metadata": {},
      "author": {
        "_links": {
          "self": "https://api2.frontapp.com/teammates/tea_40yq",
          "related": {
            "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
            "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
          }
        },
        "id": "tea_40yq",
        "email": "leela@planet-express.com",
        "username": "leela",
        "first_name": "Leela",
        "last_name": "Turanga",
        "is_admin": true,
        "is_available": true
      },
      "recipients": [
        {
          "_links": {
            "related": {
              "contact": null
            }
          },
          "handle": "support@planet-express.com",
          "role": "from"
        },
        {
          "_links": {
            "related": {
              "contact": "https://api2.frontapp.com/contacts/crd_62euuy"
            }
          },
          "handle": "calculon@momsbot.com",
          "role": "to"
        }
      ],
      "attachments": []
    },
    "created_at": 1518307874.673
  },
  "source": {
    "_meta": {
      "type": "teammate"
    },
    "data": {
      "_links": {
        "self": "https://api2.frontapp.com/teammates/tea_40yq",
        "related": {
          "inboxes": "https://api2.frontapp.com/teammates/tea_40yq/inboxes",
          "conversations": "https://api2.frontapp.com/teammates/tea_40yq/conversations"
        }
      },
      "id": "tea_40yq",
      "email": "leela@planet-express.com",
      "username": "leela",
      "first_name": "Leela",
      "last_name": "Turanga",
      "is_admin": true,
      "is_available": true
    }
  }
}
```

--------------------------------------------------------------------------------

````
