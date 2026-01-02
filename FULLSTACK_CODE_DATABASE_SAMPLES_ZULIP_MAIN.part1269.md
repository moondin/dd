---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1269
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1269 of 1290)

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

---[FILE: setting_due_date_to_card.json]---
Location: zulip-main/zerver/webhooks/trello/fixtures/setting_due_date_to_card.json

```json
{
   "model":{
      "id":"53582e2da0fac5676a714277",
      "name":"Welcome Board",
      "desc":"",
      "descData":null,
      "closed":false,
      "idOrganization":null,
      "pinned":false,
      "url":"https://trello.com/b/iqXXzYEj/welcome-board",
      "shortUrl":"https://trello.com/b/iqXXzYEj",
      "prefs":{
         "permissionLevel":"private",
         "voting":"disabled",
         "comments":"members",
         "invitations":"members",
         "selfJoin":false,
         "cardCovers":true,
         "calendarFeedEnabled":false,
         "background":"blue",
         "backgroundImage":null,
         "backgroundImageScaled":null,
         "backgroundTile":false,
         "backgroundBrightness":"dark",
         "backgroundColor":"#0079BF",
         "canBePublic":true,
         "canBeOrg":true,
         "canBePrivate":true,
         "canInvite":true
      },
      "labelNames":{
         "green":"",
         "yellow":"",
         "orange":"",
         "red":"",
         "purple":"",
         "blue":"",
         "sky":"",
         "lime":"",
         "pink":"",
         "black":""
      }
   },
   "action":{
      "id":"572b701647e1a8d7834b186a",
      "idMemberCreator":"53582e2da0fac5676a714276",
      "data":{
         "list":{
            "name":"Intermediate",
            "id":"53582e2da0fac5676a71427a"
         },
         "board":{
            "shortLink":"iqXXzYEj",
            "name":"Welcome Board",
            "id":"53582e2da0fac5676a714277"
         },
         "old":{
            "due":null
         },
         "card":{
            "shortLink":"9BduUcVQ",
            "idShort":8,
            "name":"Card name",
            "id":"53582e2da0fac5676a71428b",
            "due":"2016-05-11T10:00:00.000Z"
         }
      },
      "type":"updateCard",
      "date":"2016-05-05T16:08:54.559Z",
      "memberCreator":{
         "id":"53582e2da0fac5676a714276",
         "avatarHash":null,
         "fullName":"TomaszKolek",
         "initials":"T",
         "username":"tomaszkolek"
      }
   }
}
```

--------------------------------------------------------------------------------

---[FILE: uncheck_item_on_card_checklist.json]---
Location: zulip-main/zerver/webhooks/trello/fixtures/uncheck_item_on_card_checklist.json

```json
{
    "model":{
        "id":"597958d15c95392f2830e9f5",
        "name":"Zulip",
        "desc":"",
        "descData":null,
        "closed":false,
        "idOrganization":null,
        "pinned":false,
        "url":"https://trello.com/b/l9NqJcCd/zulip",
        "shortUrl":"https://trello.com/b/l9NqJcCd",
        "prefs":{
            "permissionLevel":"private",
            "voting":"disabled",
            "comments":"members",
            "invitations":"members",
            "selfJoin":false,
            "cardCovers":true,
            "cardAging":"regular",
            "calendarFeedEnabled":false,
            "background":"blue",
            "backgroundImage":null,
            "backgroundImageScaled":null,
            "backgroundTile":false,
            "backgroundBrightness":"dark",
            "backgroundColor":"#0079BF",
            "backgroundBottomColor":"#0079BF",
            "backgroundTopColor":"#0079BF",
            "canBePublic":true,
            "canBeEnterprise":true,
            "canBeOrg":true,
            "canBePrivate":true,
            "canInvite":true
        },
        "labelNames":{
            "green":"",
            "yellow":"",
            "orange":"",
            "red":"",
            "purple":"",
            "blue":"",
            "sky":"",
            "lime":"",
            "pink":"",
            "black":""
        }
    },
    "action":{
        "id":"5c6f28a04e959901fe61a6de",
        "idMemberCreator":"59780df0f985476615f5ea66",
        "data":{
            "checkItem":{
                "state":"incomplete",
                "name":"Tomatoes",
                "id":"5c6f1a64af711461f2534921"
            },
            "checklist":{
                "name":"Checklist",
                "id":"5c6f1a58d61c527c91892ba1"
            },
            "card":{
                "shortLink":"R2thJK3P",
                "idShort":3,
                "name":"Something something",
                "id":"5abd0cc638506013c1ebb33f"
            },
            "board":{
                "shortLink":"l9NqJcCd",
                "name":"Zulip",
                "id":"597958d15c95392f2830e9f5"
            }
        },
        "type":"updateCheckItemStateOnCard",
        "date":"2019-02-21T22:39:28.225Z",
        "limits":{

        },
        "display":{
            "translationKey":"action_marked_checkitem_incomplete",
            "entities":{
                "checkitem":{
                    "type":"checkItem",
                    "nameHtml":"Tomatoes",
                    "id":"5c6f1a64af711461f2534921",
                    "state":"incomplete",
                    "text":"Tomatoes"
                },
                "card":{
                    "type":"card",
                    "id":"5abd0cc638506013c1ebb33f",
                    "shortLink":"R2thJK3P",
                    "text":"Something something"
                },
                "memberCreator":{
                    "type":"member",
                    "id":"59780df0f985476615f5ea66",
                    "username":"eeshangarg",
                    "text":"Eeshan Garg"
                }
            }
        },
        "memberCreator":{
            "id":"59780df0f985476615f5ea66",
            "avatarHash":null,
            "avatarUrl":null,
            "fullName":"Eeshan Garg",
            "idMemberReferrer":null,
            "initials":"EG",
            "nonPublic":{

            },
            "username":"eeshangarg"
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: board_actions.py]---
Location: zulip-main/zerver/webhooks/trello/view/board_actions.py

```python
from collections.abc import Mapping

from zerver.lib.exceptions import UnsupportedWebhookEventTypeError
from zerver.lib.validator import WildValue, check_string

SUPPORTED_BOARD_ACTIONS = [
    "removeMemberFromBoard",
    "addMemberToBoard",
    "createList",
    "updateBoard",
]

REMOVE_MEMBER = "removeMemberFromBoard"
ADD_MEMBER = "addMemberToBoard"
CREATE_LIST = "createList"
CHANGE_NAME = "changeName"

TRELLO_BOARD_URL_TEMPLATE = "[{board_name}]({board_url})"

ACTIONS_TO_MESSAGE_MAPPER = {
    REMOVE_MEMBER: "removed {member_name} from {board_url_template}.",
    ADD_MEMBER: "added {member_name} to {board_url_template}.",
    CREATE_LIST: "added {list_name} list to {board_url_template}.",
    CHANGE_NAME: "renamed the board from {old_name} to {board_url_template}.",
}


def process_board_action(payload: WildValue, action_type: str | None) -> tuple[str, str] | None:
    action_type = get_proper_action(payload, action_type)
    if action_type is not None:
        return get_topic(payload), get_body(payload, action_type)
    return None


def get_proper_action(payload: WildValue, action_type: str | None) -> str | None:
    if action_type == "updateBoard":
        data = get_action_data(payload)
        # we don't support events for when a board's background
        # is changed
        if "background" in data["old"].get("prefs", {}):
            return None
        elif data["old"]["name"].tame(check_string):
            return CHANGE_NAME
        raise UnsupportedWebhookEventTypeError(action_type)
    return action_type


def get_topic(payload: WildValue) -> str:
    return get_action_data(payload)["board"]["name"].tame(check_string)


def get_body(payload: WildValue, action_type: str) -> str:
    message_body = ACTIONS_TO_FILL_BODY_MAPPER[action_type](payload, action_type)
    creator = payload["action"]["memberCreator"]["fullName"].tame(check_string)
    return f"{creator} {message_body}"


def get_managed_member_body(payload: WildValue, action_type: str) -> str:
    data = {
        "member_name": payload["action"]["member"]["fullName"].tame(check_string),
    }
    return fill_appropriate_message_content(payload, action_type, data)


def get_create_list_body(payload: WildValue, action_type: str) -> str:
    data = {
        "list_name": get_action_data(payload)["list"]["name"].tame(check_string),
    }
    return fill_appropriate_message_content(payload, action_type, data)


def get_change_name_body(payload: WildValue, action_type: str) -> str:
    data = {
        "old_name": get_action_data(payload)["old"]["name"].tame(check_string),
    }
    return fill_appropriate_message_content(payload, action_type, data)


def fill_appropriate_message_content(
    payload: WildValue, action_type: str, data: Mapping[str, str] = {}
) -> str:
    data = dict(data)
    if "board_url_template" not in data:
        data["board_url_template"] = get_filled_board_url_template(payload)
    message_body = get_message_body(action_type)
    return message_body.format(**data)


def get_filled_board_url_template(payload: WildValue) -> str:
    return TRELLO_BOARD_URL_TEMPLATE.format(
        board_name=get_board_name(payload), board_url=get_board_url(payload)
    )


def get_board_name(payload: WildValue) -> str:
    return get_action_data(payload)["board"]["name"].tame(check_string)


def get_board_url(payload: WildValue) -> str:
    return "https://trello.com/b/{}".format(
        get_action_data(payload)["board"]["shortLink"].tame(check_string)
    )


def get_message_body(action_type: str) -> str:
    return ACTIONS_TO_MESSAGE_MAPPER[action_type]


def get_action_data(payload: WildValue) -> WildValue:
    return payload["action"]["data"]


ACTIONS_TO_FILL_BODY_MAPPER = {
    REMOVE_MEMBER: get_managed_member_body,
    ADD_MEMBER: get_managed_member_body,
    CREATE_LIST: get_create_list_body,
    CHANGE_NAME: get_change_name_body,
}
```

--------------------------------------------------------------------------------

---[FILE: card_actions.py]---
Location: zulip-main/zerver/webhooks/trello/view/card_actions.py

```python
from collections.abc import Mapping
from datetime import datetime

from zerver.lib.exceptions import UnsupportedWebhookEventTypeError
from zerver.lib.timestamp import datetime_to_global_time
from zerver.lib.validator import WildValue, check_bool, check_none_or, check_string

SUPPORTED_CARD_ACTIONS = [
    "updateCard",
    "createCard",
    "addLabelToCard",
    "removeLabelFromCard",
    "addMemberToCard",
    "removeMemberFromCard",
    "addAttachmentToCard",
    "addChecklistToCard",
    "commentCard",
    "updateCheckItemStateOnCard",
]

IGNORED_CARD_ACTIONS = [
    "copyCard",
    "createCheckItem",
    "updateCheckItem",
    "updateList",
]

CREATE = "createCard"
CHANGE_LIST = "changeList"
CHANGE_NAME = "changeName"
SET_DESC = "setDesc"
CHANGE_DESC = "changeDesc"
REMOVE_DESC = "removeDesc"
ARCHIVE = "archiveCard"
REOPEN = "reopenCard"
SET_DUE_DATE = "setDueDate"
CHANGE_DUE_DATE = "changeDueDate"
REMOVE_DUE_DATE = "removeDueDate"
ADD_LABEL = "addLabelToCard"
REMOVE_LABEL = "removeLabelFromCard"
ADD_MEMBER = "addMemberToCard"
REMOVE_MEMBER = "removeMemberFromCard"
ADD_ATTACHMENT = "addAttachmentToCard"
ADD_CHECKLIST = "addChecklistToCard"
COMMENT = "commentCard"
UPDATE_CHECK_ITEM_STATE = "updateCheckItemStateOnCard"

TRELLO_CARD_URL_TEMPLATE = "[{card_name}]({card_url})"

ACTIONS_TO_MESSAGE_MAPPER = {
    CREATE: "created {card_url_template}.",
    CHANGE_LIST: "moved {card_url_template} from {old_list} to {new_list}.",
    CHANGE_NAME: 'renamed the card from "{old_name}" to {card_url_template}.',
    SET_DESC: "set description for {card_url_template} to:\n~~~ quote\n{desc}\n~~~\n",
    CHANGE_DESC: (
        "changed description for {card_url_template} from\n"
        "~~~ quote\n{old_desc}\n~~~\nto\n~~~ quote\n{desc}\n~~~\n"
    ),
    REMOVE_DESC: "removed description from {card_url_template}.",
    ARCHIVE: "archived {card_url_template}.",
    REOPEN: "reopened {card_url_template}.",
    SET_DUE_DATE: "set due date for {card_url_template} to {due_date}.",
    CHANGE_DUE_DATE: "changed due date for {card_url_template} from {old_due_date} to {due_date}.",
    REMOVE_DUE_DATE: "removed the due date from {card_url_template}.",
    ADD_LABEL: 'added a {color} label with "{text}" to {card_url_template}.',
    REMOVE_LABEL: 'removed a {color} label with "{text}" from {card_url_template}.',
    ADD_MEMBER: "added {member_name} to {card_url_template}.",
    REMOVE_MEMBER: "removed {member_name} from {card_url_template}.",
    ADD_ATTACHMENT: "added [{attachment_name}]({attachment_url}) to {card_url_template}.",
    ADD_CHECKLIST: "added the {checklist_name} checklist to {card_url_template}.",
    COMMENT: "commented on {card_url_template}:\n~~~ quote\n{text}\n~~~\n",
    UPDATE_CHECK_ITEM_STATE: "{action} **{item_name}** in **{checklist_name}** ({card_url_template}).",
}


def prettify_date(date_string: str) -> str:
    dt = datetime.fromisoformat(date_string)
    return datetime_to_global_time(dt)


def process_card_action(payload: WildValue, action_type: str) -> tuple[str, str] | None:
    proper_action = get_proper_action(payload, action_type)
    if proper_action is not None:
        return get_topic(payload), get_body(payload, proper_action)
    return None


def get_proper_action(payload: WildValue, action_type: str) -> str | None:
    if action_type == "updateCard":
        data = get_action_data(payload)
        old_data = data["old"]
        card_data = data["card"]
        if data.get("listBefore"):
            return CHANGE_LIST
        if old_data.get("name").tame(check_none_or(check_string)):
            return CHANGE_NAME
        if old_data.get("desc").tame(check_none_or(check_string)) == "":
            return SET_DESC
        if old_data.get("desc").tame(check_none_or(check_string)):
            if card_data.get("desc").tame(check_none_or(check_string)) == "":
                return REMOVE_DESC
            else:
                return CHANGE_DESC
        if old_data.get("due", "").tame(check_none_or(check_string)) is None:
            return SET_DUE_DATE
        if old_data.get("due").tame(check_none_or(check_string)):
            if card_data.get("due", "").tame(check_none_or(check_string)) is None:
                return REMOVE_DUE_DATE
            else:
                return CHANGE_DUE_DATE
        if old_data.get("closed").tame(check_none_or(check_bool)) is False and card_data.get(
            "closed", False
        ).tame(check_bool):
            return ARCHIVE
        if (
            old_data.get("closed").tame(check_none_or(check_bool))
            and card_data.get("closed").tame(check_none_or(check_bool)) is False
        ):
            return REOPEN
        # We don't support events for when a card is moved up or down
        # within a single list (pos), or when the cover changes (cover).
        # We also don't know if "dueComplete" is just a new name for "due".
        ignored_fields = [
            "cover",
            "dueComplete",
            "idAttachmentCover",
            "pos",
        ]
        for field in ignored_fields:
            if field in old_data:
                return None
        raise UnsupportedWebhookEventTypeError(action_type)

    return action_type


def get_topic(payload: WildValue) -> str:
    return get_action_data(payload)["board"]["name"].tame(check_string)


def get_body(payload: WildValue, action_type: str) -> str:
    message_body = ACTIONS_TO_FILL_BODY_MAPPER[action_type](payload, action_type)
    creator = payload["action"]["memberCreator"].get("fullName").tame(check_none_or(check_string))
    return f"{creator} {message_body}"


def get_added_checklist_body(payload: WildValue, action_type: str) -> str:
    data = {
        "checklist_name": get_action_data(payload)["checklist"]["name"].tame(check_string),
    }
    return fill_appropriate_message_content(payload, action_type, data)


def get_update_check_item_body(payload: WildValue, action_type: str) -> str:
    action = get_action_data(payload)
    state = action["checkItem"]["state"].tame(check_string)
    data = {
        "action": "checked" if state == "complete" else "unchecked",
        "checklist_name": action["checklist"]["name"].tame(check_string),
        "item_name": action["checkItem"]["name"].tame(check_string),
    }
    return fill_appropriate_message_content(payload, action_type, data)


def get_added_attachment_body(payload: WildValue, action_type: str) -> str:
    data = {
        "attachment_url": get_action_data(payload)["attachment"]["url"].tame(check_string),
        "attachment_name": get_action_data(payload)["attachment"]["name"].tame(check_string),
    }
    return fill_appropriate_message_content(payload, action_type, data)


def get_updated_card_body(payload: WildValue, action_type: str) -> str:
    data = {
        "card_name": get_card_name(payload),
        "old_list": get_action_data(payload)["listBefore"]["name"].tame(check_string),
        "new_list": get_action_data(payload)["listAfter"]["name"].tame(check_string),
    }
    return fill_appropriate_message_content(payload, action_type, data)


def get_renamed_card_body(payload: WildValue, action_type: str) -> str:
    data = {
        "old_name": get_action_data(payload)["old"]["name"].tame(check_string),
        "new_name": get_action_data(payload)["old"]["name"].tame(check_string),
    }
    return fill_appropriate_message_content(payload, action_type, data)


def get_added_label_body(payload: WildValue, action_type: str) -> str:
    data = {
        "color": get_action_data(payload)["value"].tame(check_string),
        "text": get_action_data(payload)["text"].tame(check_string),
    }
    return fill_appropriate_message_content(payload, action_type, data)


def get_managed_member_body(payload: WildValue, action_type: str) -> str:
    data = {
        "member_name": payload["action"]["member"]["fullName"].tame(check_string),
    }
    return fill_appropriate_message_content(payload, action_type, data)


def get_comment_body(payload: WildValue, action_type: str) -> str:
    data = {
        "text": get_action_data(payload)["text"].tame(check_string),
    }
    return fill_appropriate_message_content(payload, action_type, data)


def get_managed_due_date_body(payload: WildValue, action_type: str) -> str:
    data = {
        "due_date": prettify_date(get_action_data(payload)["card"]["due"].tame(check_string)),
    }
    return fill_appropriate_message_content(payload, action_type, data)


def get_changed_due_date_body(payload: WildValue, action_type: str) -> str:
    data = {
        "due_date": prettify_date(get_action_data(payload)["card"]["due"].tame(check_string)),
        "old_due_date": prettify_date(get_action_data(payload)["old"]["due"].tame(check_string)),
    }
    return fill_appropriate_message_content(payload, action_type, data)


def get_managed_desc_body(payload: WildValue, action_type: str) -> str:
    data = {
        "desc": get_action_data(payload)["card"]["desc"].tame(check_string),
    }
    return fill_appropriate_message_content(payload, action_type, data)


def get_changed_desc_body(payload: WildValue, action_type: str) -> str:
    data = {
        "desc": get_action_data(payload)["card"]["desc"].tame(check_string),
        "old_desc": get_action_data(payload)["old"]["desc"].tame(check_string),
    }
    return fill_appropriate_message_content(payload, action_type, data)


def get_body_by_action_type_without_data(payload: WildValue, action_type: str) -> str:
    return fill_appropriate_message_content(payload, action_type)


def fill_appropriate_message_content(
    payload: WildValue, action_type: str, data: Mapping[str, str] = {}
) -> str:
    data = dict(data)
    if "card_url_template" not in data:
        data["card_url_template"] = get_filled_card_url_template(payload)
    message_body = get_message_body(action_type)
    return message_body.format(**data)


def get_filled_card_url_template(payload: WildValue) -> str:
    return TRELLO_CARD_URL_TEMPLATE.format(
        card_name=get_card_name(payload), card_url=get_card_url(payload)
    )


def get_card_url(payload: WildValue) -> str:
    return "https://trello.com/c/{}".format(
        get_action_data(payload)["card"]["shortLink"].tame(check_string)
    )


def get_message_body(action_type: str) -> str:
    return ACTIONS_TO_MESSAGE_MAPPER[action_type]


def get_card_name(payload: WildValue) -> str:
    return get_action_data(payload)["card"]["name"].tame(check_string)


def get_action_data(payload: WildValue) -> WildValue:
    return payload["action"]["data"]


ACTIONS_TO_FILL_BODY_MAPPER = {
    CREATE: get_body_by_action_type_without_data,
    CHANGE_LIST: get_updated_card_body,
    CHANGE_NAME: get_renamed_card_body,
    SET_DESC: get_managed_desc_body,
    CHANGE_DESC: get_changed_desc_body,
    REMOVE_DESC: get_body_by_action_type_without_data,
    ARCHIVE: get_body_by_action_type_without_data,
    REOPEN: get_body_by_action_type_without_data,
    SET_DUE_DATE: get_managed_due_date_body,
    CHANGE_DUE_DATE: get_changed_due_date_body,
    REMOVE_DUE_DATE: get_body_by_action_type_without_data,
    ADD_LABEL: get_added_label_body,
    REMOVE_LABEL: get_added_label_body,
    ADD_MEMBER: get_managed_member_body,
    REMOVE_MEMBER: get_managed_member_body,
    ADD_ATTACHMENT: get_added_attachment_body,
    ADD_CHECKLIST: get_added_checklist_body,
    COMMENT: get_comment_body,
    UPDATE_CHECK_ITEM_STATE: get_update_check_item_body,
}
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: zulip-main/zerver/webhooks/trello/view/__init__.py
Signals: Django

```python
# Webhooks for external integrations.
from django.http import HttpRequest, HttpResponse

from zerver.decorator import return_success_on_head_request, webhook_view
from zerver.lib.exceptions import UnsupportedWebhookEventTypeError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

from .board_actions import SUPPORTED_BOARD_ACTIONS, process_board_action
from .card_actions import IGNORED_CARD_ACTIONS, SUPPORTED_CARD_ACTIONS, process_card_action


@webhook_view("Trello")
@return_success_on_head_request
@typed_endpoint
def api_trello_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    action_type = payload["action"]["type"].tame(check_string)
    message = get_topic_and_body(payload, action_type)
    if message is None:
        return json_success(request)
    else:
        topic, body = message

    check_send_webhook_message(request, user_profile, topic, body)
    return json_success(request)


def get_topic_and_body(payload: WildValue, action_type: str) -> tuple[str, str] | None:
    if action_type in SUPPORTED_CARD_ACTIONS:
        return process_card_action(payload, action_type)
    if action_type in IGNORED_CARD_ACTIONS:
        return None
    if action_type in SUPPORTED_BOARD_ACTIONS:
        return process_board_action(payload, action_type)

    raise UnsupportedWebhookEventTypeError(action_type)
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/updown/doc.md

```text
# Zulip Updown integration

See Updown reports in Zulip!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. On [your Updown settings page](https://updown.io/settings/edit), go to **Webhooks**.

1. Add the URL generated above to the list of **Webhook endpoint URLs**.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/updown/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/updown/tests.py

```python
from zerver.lib.test_classes import WebhookTestCase


class UpdownHookTests(WebhookTestCase):
    CHANNEL_NAME = "updown"
    URL_TEMPLATE = "/api/v1/external/updown?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "updown"

    def test_updown_check_down_event(self) -> None:
        expected_topic_name = "https://updown.io"
        expected_message = (
            "Service is `down`. It returned a 500 error at <time:2016-02-07T13:11:43+00:00>."
        )
        self.check_webhook("check_down_one_event", expected_topic_name, expected_message)

    def test_updown_check_up_again_event(self) -> None:
        expected_topic_name = "https://updown.io"
        expected_message = "Service is `up` again after 4 minutes 25 seconds."
        self.check_webhook("check_up_again_one_event", expected_topic_name, expected_message)

    def test_updown_check_up_event(self) -> None:
        expected_topic_name = "https://updown.io"
        expected_message = "Service is `up`."
        self.check_webhook("check_up_first_time", expected_topic_name, expected_message)

    def test_updown_check_up_multiple_events(self) -> None:
        topic_name = "https://updown.io"

        down_content = (
            "Service is `down`. It returned a 500 error at <time:2016-02-07T13:11:43+00:00>."
        )
        up_content = "Service is `up` again after 1 second."

        self.subscribe(self.test_user, self.CHANNEL_NAME)
        payload = self.get_body("check_multiple_events")

        msg = self.send_webhook_payload(
            self.test_user,
            self.url,
            payload,
            content_type="application/json",
        )

        msg = self.get_second_to_last_message()
        self.assert_channel_message(
            message=msg,
            channel_name=self.CHANNEL_NAME,
            topic_name=topic_name,
            content=down_content,
        )

        msg = self.get_last_message()
        self.assert_channel_message(
            message=msg,
            channel_name=self.CHANNEL_NAME,
            topic_name=topic_name,
            content=up_content,
        )

    def test_unknown_event(self) -> None:
        self.check_webhook("unknown_event", expect_noop=True)
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/updown/view.py
Signals: Django

```python
# Webhooks for external integrations.
import re
from datetime import datetime

from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.exceptions import UnsupportedWebhookEventTypeError
from zerver.lib.response import json_success
from zerver.lib.timestamp import datetime_to_global_time
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_int, check_none_or, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

TOPIC_TEMPLATE = "{service_url}"


def send_message_for_event(
    request: HttpRequest, user_profile: UserProfile, event: WildValue
) -> None:
    event_type = get_event_type(event)
    topic_name = TOPIC_TEMPLATE.format(service_url=event["check"]["url"].tame(check_string))
    body = EVENT_TYPE_BODY_MAPPER[event_type](event)
    check_send_webhook_message(request, user_profile, topic_name, body, event_type)


def get_body_for_up_event(event: WildValue) -> str:
    body = "Service is `up`"
    event_downtime = event["downtime"]
    if event_downtime["started_at"].tame(check_none_or(check_string)):
        body = f"{body} again"
        duration = event_downtime["duration"].tame(check_none_or(check_int))
        if duration:
            string_date = get_time_string_based_on_duration(duration)
            if string_date:
                body = f"{body} after {string_date}"
    return f"{body}."


def get_time_string_based_on_duration(duration: int) -> str:
    days, reminder = divmod(duration, 86400)
    hours, reminder = divmod(reminder, 3600)
    minutes, seconds = divmod(reminder, 60)

    string_date = ""
    string_date += add_time_part_to_string_date_if_needed(days, "day")
    string_date += add_time_part_to_string_date_if_needed(hours, "hour")
    string_date += add_time_part_to_string_date_if_needed(minutes, "minute")
    string_date += add_time_part_to_string_date_if_needed(seconds, "second")
    return string_date.rstrip()


def add_time_part_to_string_date_if_needed(value: int, text_name: str) -> str:
    if value == 1:
        return f"1 {text_name} "
    if value > 1:
        return f"{value} {text_name}s "
    return ""


def get_body_for_down_event(event: WildValue) -> str:
    started_at = event["downtime"]["started_at"].tame(check_string)
    dt = datetime.fromisoformat(started_at)
    pretty_started_at = datetime_to_global_time(dt)
    return "Service is `down`. It returned a {} error at {}.".format(
        event["downtime"]["error"].tame(check_none_or(check_string)),
        # started_at is not None in a "down" event.
        pretty_started_at,
    )


EVENT_TYPE_BODY_MAPPER = {
    "up": get_body_for_up_event,
    "down": get_body_for_down_event,
}
ALL_EVENT_TYPES = list(EVENT_TYPE_BODY_MAPPER.keys())


@webhook_view("Updown", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_updown_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    for event in payload:
        send_message_for_event(request, user_profile, event)
    return json_success(request)


def get_event_type(event: WildValue) -> str:
    event_type_match = re.match(r"check.(.*)", event["event"].tame(check_string))
    if event_type_match:
        event_type = event_type_match.group(1)
        if event_type in EVENT_TYPE_BODY_MAPPER:
            return event_type
    raise UnsupportedWebhookEventTypeError(event["event"].tame(check_string))
```

--------------------------------------------------------------------------------

---[FILE: check_down_one_event.json]---
Location: zulip-main/zerver/webhooks/updown/fixtures/check_down_one_event.json

```json
[{
  "event": "check.down",
  "check": {
    "token": "ngg8",
    "url": "https://updown.io",
    "alias": "",
    "last_status": 500,
    "uptime": 100.0,
    "down": true,
    "down_since": "2016-02-07T13:11:43Z",
    "error": "500",
    "period": 30,
    "apdex_t": 0.25,
    "string_match": "",
    "enabled": true,
    "published": true,
    "last_check_at": "2016-02-07T13:12:13Z",
    "next_check_at": "2016-02-07T13:12:43Z",
    "favicon_url": "https://updown.io/favicon.png"
  },
  "downtime": {
    "error": "500",
    "started_at": "2016-02-07T13:11:43Z",
    "ended_at": null,
    "duration": null
  }
}]
```

--------------------------------------------------------------------------------

---[FILE: check_multiple_events.json]---
Location: zulip-main/zerver/webhooks/updown/fixtures/check_multiple_events.json

```json
[
  {
    "event": "check.down",
    "check": {
      "token": "ngg8",
      "url": "https://updown.io",
      "alias": "",
      "last_status": 200,
      "uptime": 99.954,
      "down": false,
      "down_since": null,
      "error": null,
      "period": 30,
      "apdex_t": 0.25,
      "string_match": "",
      "enabled": true,
      "published": true,
      "last_check_at": "2016-02-07T13:16:07Z",
      "next_check_at": "2016-02-07T13:16:37Z",
      "favicon_url": "https://updown.io/favicon.png"
    },
    "downtime": {
      "error": "500",
      "started_at": "2016-02-07T13:11:43Z",
      "ended_at": null,
      "duration": null
    }
  },
  {
    "event": "check.up",
    "check": {
      "token": "ngg8",
      "url": "https://updown.io",
      "alias": "",
      "last_status": 200,
      "uptime": 99.954,
      "down": false,
      "down_since": null,
      "error": null,
      "period": 30,
      "apdex_t": 0.25,
      "string_match": "",
      "enabled": true,
      "published": true,
      "last_check_at": "2016-02-07T13:16:07Z",
      "next_check_at": "2016-02-07T13:16:37Z",
      "favicon_url": "https://updown2.io/favicon.png"
    },
    "downtime": {
      "error": "500",
      "started_at": "2016-02-07T13:11:43Z",
      "ended_at": "2016-02-07T13:11:44Z",
      "duration": 1
    }
  }
]
```

--------------------------------------------------------------------------------

---[FILE: check_up_again_one_event.json]---
Location: zulip-main/zerver/webhooks/updown/fixtures/check_up_again_one_event.json

```json
[{
  "event": "check.up",
  "check": {
    "token": "ngg8",
    "url": "https://updown.io",
    "alias": "",
    "last_status": 200,
    "uptime": 99.954,
    "down": false,
    "down_since": null,
    "error": null,
    "period": 30,
    "apdex_t": 0.25,
    "string_match": "",
    "enabled": true,
    "published": true,
    "last_check_at": "2016-02-07T13:16:07Z",
    "next_check_at": "2016-02-07T13:16:37Z",
    "favicon_url": "https://updown.io/favicon.png"
  },
  "downtime": {
    "error": "500",
    "started_at": "2016-02-07T13:11:43Z",
    "ended_at": "2016-02-07T13:16:07Z",
    "duration": 265
  }
}]
```

--------------------------------------------------------------------------------

---[FILE: check_up_first_time.json]---
Location: zulip-main/zerver/webhooks/updown/fixtures/check_up_first_time.json

```json
[{
  "event": "check.up",
  "check": {
    "token": "ngg8",
    "url": "https://updown.io",
    "alias": "",
    "last_status": 200,
    "uptime": 99.954,
    "down": false,
    "down_since": null,
    "error": null,
    "period": 30,
    "apdex_t": 0.25,
    "string_match": "",
    "enabled": true,
    "published": true,
    "last_check_at": "2016-02-07T13:16:07Z",
    "next_check_at": "2016-02-07T13:16:37Z",
    "favicon_url": "https://updown.io/favicon.png"
  },
  "downtime": {
    "error": null,
    "started_at": null,
    "ended_at": null,
    "duration": null
  }
}]
```

--------------------------------------------------------------------------------

---[FILE: unknown_event.json]---
Location: zulip-main/zerver/webhooks/updown/fixtures/unknown_event.json

```json
[{
  "event": "unknown",
  "check": {
    "token": "ngg8",
    "url": "https://updown.io",
    "alias": "",
    "last_status": 200,
    "uptime": 99.954,
    "down": false,
    "down_since": null,
    "error": null,
    "period": 30,
    "apdex_t": 0.25,
    "string_match": "",
    "enabled": true,
    "published": true,
    "last_check_at": "2016-02-07T13:16:07Z",
    "next_check_at": "2016-02-07T13:16:37Z",
    "favicon_url": "https://updown.io/favicon.png"
  },
  "downtime": {
    "error": null,
    "started_at": null,
    "ended_at": null,
    "duration": null
  }
}]
```

--------------------------------------------------------------------------------

---[FILE: doc.md]---
Location: zulip-main/zerver/webhooks/uptimerobot/doc.md

```text
# Zulip UptimeRobot integration

Receive Zulip notifications from UptimeRobot!

{start_tabs}

1. {!create-an-incoming-webhook.md!}

1. {!generate-webhook-url-basic.md!}

1. On UptimeRobot, go to **My Settings**, and select **Add Alert Contact**.

1. Set **Alert Contact Type** to **webhook**, set **Friendly Name** to
   a name of your choice, such as `Zulip`, and set **URL to notify** to the
   URL generated above.

1. Under **POST Value (JSON Format)**, select **Send as JSON (application/json)**,
   and then set the value to:

         {
            "monitor_url":"*monitorURL*",
            "monitor_friendly_name":"*monitorFriendlyName*",
            "alert_type":"*alertType*",
            "alert_type_friendly_name":"*alertTypeFriendlyName*",
            "alert_details":"*alertDetails*",
            "alert_friendly_duration":"*alertFriendlyDuration*"
         }

1. Set **Enable Notifications For** the [events](#filtering-incoming-events)
   you'd like to be notified about, and save the form.

{end_tabs}

{!congrats.md!}

![](/static/images/integrations/uptimerobot/001.png)

{!event-filtering-additional-feature.md!}

### Related documentation

{!webhooks-url-specification.md!}
```

--------------------------------------------------------------------------------

---[FILE: tests.py]---
Location: zulip-main/zerver/webhooks/uptimerobot/tests.py

```python
from zerver.lib.send_email import FromAddress
from zerver.lib.test_classes import WebhookTestCase
from zerver.models import Recipient
from zerver.webhooks.uptimerobot.view import MISCONFIGURED_PAYLOAD_ERROR_MESSAGE


class UptimeRobotHookTests(WebhookTestCase):
    CHANNEL_NAME = "uptimerobot"
    URL_TEMPLATE = "/api/v1/external/uptimerobot?stream={stream}&api_key={api_key}"
    WEBHOOK_DIR_NAME = "uptimerobot"

    def test_uptimerobot_monitor_down(self) -> None:
        """
        Tests if uptimerobot monitor down is handled correctly
        """
        expected_topic_name = "Web Server"
        expected_message = "Web Server (server1.example.com) is DOWN (Host Is Unreachable)."
        self.check_webhook("uptimerobot_monitor_down", expected_topic_name, expected_message)

    def test_uptimerobot_monitor_up(self) -> None:
        """
        Tests if uptimerobot monitor up is handled correctly
        """
        expected_topic_name = "Mail Server"
        expected_message = """
Mail Server (server2.example.com) is back UP (Host Is Reachable).
It was down for 44 minutes and 37 seconds.
""".strip()
        self.check_webhook("uptimerobot_monitor_up", expected_topic_name, expected_message)

    def test_uptimerobot_invalid_payload_with_missing_data(self) -> None:
        """
        Tests if invalid UptimeRobot payloads are handled correctly
        """
        self.url = self.build_webhook_url()
        payload = self.get_body("uptimerobot_invalid_payload_with_missing_data")
        result = self.client_post(self.url, payload, content_type="application/json")
        self.assert_json_error(result, "Invalid payload")

        expected_message = MISCONFIGURED_PAYLOAD_ERROR_MESSAGE.format(
            bot_name=self.test_user.full_name,
            support_email=FromAddress.SUPPORT,
        ).strip()

        msg = self.get_last_message()
        self.assertEqual(msg.content, expected_message)
        self.assertEqual(msg.recipient.type, Recipient.PERSONAL)
```

--------------------------------------------------------------------------------

````
