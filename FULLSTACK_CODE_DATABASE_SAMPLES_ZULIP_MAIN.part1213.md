---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1213
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1213 of 1290)

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
Location: zulip-main/zerver/webhooks/intercom/tests.py

```python
from unittest.mock import MagicMock, patch

from zerver.lib.test_classes import WebhookTestCase


class IntercomWebHookTests(WebhookTestCase):
    CHANNEL_NAME = "test"
    URL_TEMPLATE = "/api/v1/external/intercom?&api_key={api_key}&stream={stream}"
    WEBHOOK_DIR_NAME = "intercom"

    @patch("zerver.webhooks.intercom.view.check_send_webhook_message")
    def test_ping_ignore(self, check_send_webhook_message_mock: MagicMock) -> None:
        self.url = self.build_webhook_url()
        payload = self.get_body("ping")
        result = self.client_post(self.url, payload, content_type="application/json")
        self.assertFalse(check_send_webhook_message_mock.called)
        self.assert_json_success(result)

    def test_company_created(self) -> None:
        expected_topic_name = "Companies"
        expected_message = """
New company **Kandra Labs** created:
* **User count**: 1
* **Monthly spending**: 0
""".strip()
        self.check_webhook(
            "company_created",
            expected_topic_name,
            expected_message,
        )

    def test_contact_added_email(self) -> None:
        expected_topic_name = "Contact: Azure Bus from St. John's"
        expected_message = "New email jerryguitarist@gmail.com added to contact."
        self.check_webhook(
            "contact_added_email",
            expected_topic_name,
            expected_message,
        )

    def test_contact_created(self) -> None:
        expected_topic_name = "Contact: Azure Bus from St. John's"
        expected_message = """
New contact created:
* **Name (or pseudonym)**: Azure Bus from St. John's
* **Email**: aaron@zulip.com
* **Location**: St. John's, Newfoundland and Labrador, Canada
""".strip()
        self.check_webhook(
            "contact_created",
            expected_topic_name,
            expected_message,
        )

    def test_contact_signed_up(self) -> None:
        expected_topic_name = "User: Lilac Raindrop from St. John's"
        expected_message = """
Contact signed up:
* **Email**: iago@zulip.com
* **Location**: St. John's, Newfoundland and Labrador, Canada
""".strip()
        self.check_webhook(
            "contact_signed_up",
            expected_topic_name,
            expected_message,
        )

    def test_contact_tag_created(self) -> None:
        expected_topic_name = "Contact: Eeshan Garg"
        expected_message = "Contact tagged with the `developer` tag."
        self.check_webhook(
            "contact_tag_created",
            expected_topic_name,
            expected_message,
        )

    def test_contact_tag_deleted(self) -> None:
        expected_topic_name = "Contact: Eeshan Garg"
        expected_message = "The tag `developer` was removed from the contact."
        self.check_webhook(
            "contact_tag_deleted",
            expected_topic_name,
            expected_message,
        )

    def test_conversation_admin_assigned(self) -> None:
        expected_topic_name = "Lead: Eeshan Garg"
        expected_message = "Tim Abbott assigned to conversation."
        self.check_webhook(
            "conversation_admin_assigned",
            expected_topic_name,
            expected_message,
        )

    def test_conversation_admin_opened(self) -> None:
        expected_topic_name = "Lead: Cordelia, Lear's daughter"
        expected_message = "Eeshan Garg opened the conversation."
        self.check_webhook(
            "conversation_admin_opened",
            expected_topic_name,
            expected_message,
        )

    def test_conversation_admin_closed(self) -> None:
        expected_topic_name = "Lead: Eeshan Garg"
        expected_message = "Cordelia, Lear's daughter closed the conversation."
        self.check_webhook(
            "conversation_admin_closed",
            expected_topic_name,
            expected_message,
        )

    def test_conversation_admin_snoozed(self) -> None:
        expected_topic_name = "Lead: Eeshan Garg"
        expected_message = "Cordelia, Lear's daughter snoozed the conversation."
        self.check_webhook(
            "conversation_admin_snoozed",
            expected_topic_name,
            expected_message,
        )

    def test_conversation_admin_unsnoozed(self) -> None:
        expected_topic_name = "Lead: Eeshan Garg"
        expected_message = "Cordelia, Lear's daughter unsnoozed the conversation."
        self.check_webhook(
            "conversation_admin_unsnoozed",
            expected_topic_name,
            expected_message,
        )

    def test_conversation_admin_replied(self) -> None:
        expected_topic_name = "Lead: Eeshan Garg"
        expected_message = """
Cordelia, Lear's daughter replied to the conversation:

``` quote
Hey Eeshan! How can I help?
```
""".strip()
        self.check_webhook(
            "conversation_admin_replied",
            expected_topic_name,
            expected_message,
        )

    def test_conversation_admin_noted(self) -> None:
        expected_topic_name = "Lead: Eeshan Garg"
        expected_message = """
Cordelia, Lear's daughter added a note to the conversation:

``` quote
Talk to Tim about this user's query.
```
""".strip()
        self.check_webhook(
            "conversation_admin_noted",
            expected_topic_name,
            expected_message,
        )

    def test_conversation_admin_single_created(self) -> None:
        expected_topic_name = "Lead: Eeshan Garg"
        expected_message = """
Cordelia, Lear's daughter initiated a conversation:

``` quote
Hi Eeshan, What's up
```
""".strip()
        self.check_webhook(
            "conversation_admin_single_created",
            expected_topic_name,
            expected_message,
        )

    def test_conversation_user_created(self) -> None:
        expected_topic_name = "Lead: Rose Poodle from St. John's"
        expected_message = """
Rose Poodle from St. John's initiated a conversation:

``` quote
Hello everyone!
```
""".strip()
        self.check_webhook(
            "conversation_user_created",
            expected_topic_name,
            expected_message,
        )

    def test_conversation_user_replied(self) -> None:
        expected_topic_name = "Lead: Eeshan Garg"
        expected_message = """
Eeshan Garg replied to the conversation:

``` quote
Well, I need some help getting access to a developer account.
```
""".strip()
        self.check_webhook(
            "conversation_user_replied",
            expected_topic_name,
            expected_message,
        )

    def test_event_created(self) -> None:
        expected_topic_name = "Events"
        expected_message = "New event **invited-friend** created."
        self.check_webhook(
            "event_created",
            expected_topic_name,
            expected_message,
        )

    def test_user_created(self) -> None:
        expected_topic_name = "User: Aaron Smith"
        expected_message = """
New user created:
* **Name**: Aaron Smith
* **Email**: aaron@zulip.com
""".strip()

        self.check_webhook(
            "user_created",
            expected_topic_name,
            expected_message,
        )

    def test_user_deleted(self) -> None:
        self.check_webhook(
            "user_deleted",
            "User: jerryguitarist@gmail.com",
            "User deleted.",
        )

    def test_user_email_updated(self) -> None:
        self.check_webhook(
            "user_email_updated",
            "Contact: Azure Bus from St. John's",
            "User's email was updated to aaron@zulip.com.",
        )

    def test_user_tag_created(self) -> None:
        self.check_webhook(
            "user_tag_created",
            "User: eeshangarg",
            "The tag `developer` was added to the user.",
        )

    def test_user_tag_deleted(self) -> None:
        expected_topic_name = "User: eeshangarg"
        expected_message = (
            "The tag `CSV Import - 2019-03-26 22:46:04 UTC` was removed from the user."
        )

        self.check_webhook(
            "user_tag_deleted",
            expected_topic_name,
            expected_message,
        )

    def test_user_unsubscribed(self) -> None:
        self.check_webhook(
            "user_unsubscribed",
            "Contact: Eeshan Garg",
            "User unsubscribed from emails.",
        )

    def test_success_on_http_head(self) -> None:
        result = self.client_head(self.url)
        self.assertEqual(result.status_code, 200)
```

--------------------------------------------------------------------------------

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/intercom/view.py
Signals: Django

```python
from collections.abc import Callable
from html.parser import HTMLParser

from django.http import HttpRequest, HttpResponse
from typing_extensions import override

from zerver.decorator import return_success_on_head_request, webhook_view
from zerver.lib.exceptions import UnsupportedWebhookEventTypeError
from zerver.lib.partial import partial
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_int, check_none_or, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile

COMPANY_CREATED = """
New company **{name}** created:
* **User count**: {user_count}
* **Monthly spending**: {monthly_spend}
""".strip()

CONTACT_EMAIL_ADDED = "New email {email} added to contact."

CONTACT_CREATED = """
New contact created:
* **Name (or pseudonym)**: {name}
* **Email**: {email}
* **Location**: {location_info}
""".strip()

CONTACT_SIGNED_UP = """
Contact signed up:
* **Email**: {email}
* **Location**: {location_info}
""".strip()

CONTACT_TAG_CREATED = "Contact tagged with the `{name}` tag."

CONTACT_TAG_DELETED = "The tag `{name}` was removed from the contact."

CONVERSATION_ADMIN_ASSIGNED = "{name} assigned to conversation."

CONVERSATION_ADMIN_TEMPLATE = "{admin_name} {action} the conversation."

CONVERSATION_ADMIN_REPLY_TEMPLATE = """
{admin_name} {action} the conversation:

``` quote
{content}
```
""".strip()

CONVERSATION_ADMIN_INITIATED_CONVERSATION = """
{admin_name} initiated a conversation:

``` quote
{content}
```
""".strip()

EVENT_CREATED = "New event **{event_name}** created."

USER_CREATED = """
New user created:
* **Name**: {name}
* **Email**: {email}
""".strip()


class MLStripper(HTMLParser):
    def __init__(self) -> None:
        self.reset()
        self.strict = False
        self.convert_charrefs = True
        self.fed: list[str] = []

    @override
    def handle_data(self, d: str) -> None:
        self.fed.append(d)

    def get_data(self) -> str:
        return "".join(self.fed)


def strip_tags(html: str) -> str:
    s = MLStripper()
    s.feed(html)
    return s.get_data()


def get_topic_for_contacts(user: WildValue) -> str:
    topic_name = "{type}: {name}".format(
        type=user["type"].tame(check_string).capitalize(),
        name=user.get("name").tame(check_none_or(check_string))
        or user.get("pseudonym").tame(check_none_or(check_string))
        or user.get("email").tame(check_none_or(check_string)),
    )

    return topic_name


def get_company_created_message(payload: WildValue) -> tuple[str, str]:
    body = COMPANY_CREATED.format(
        name=payload["data"]["item"]["name"].tame(check_string),
        user_count=payload["data"]["item"]["user_count"].tame(check_int),
        monthly_spend=payload["data"]["item"]["monthly_spend"].tame(check_int),
    )
    return ("Companies", body)


def get_contact_added_email_message(payload: WildValue) -> tuple[str, str]:
    user = payload["data"]["item"]
    body = CONTACT_EMAIL_ADDED.format(email=user["email"].tame(check_string))
    topic_name = get_topic_for_contacts(user)
    return (topic_name, body)


def get_contact_created_message(payload: WildValue) -> tuple[str, str]:
    contact = payload["data"]["item"]
    body = CONTACT_CREATED.format(
        name=contact.get("name").tame(check_none_or(check_string))
        or contact.get("pseudonym").tame(check_none_or(check_string)),
        email=contact["email"].tame(check_string),
        location_info="{city_name}, {region_name}, {country_name}".format(
            city_name=contact["location_data"]["city_name"].tame(check_string),
            region_name=contact["location_data"]["region_name"].tame(check_string),
            country_name=contact["location_data"]["country_name"].tame(check_string),
        ),
    )
    topic_name = get_topic_for_contacts(contact)
    return (topic_name, body)


def get_contact_signed_up_message(payload: WildValue) -> tuple[str, str]:
    contact = payload["data"]["item"]
    body = CONTACT_SIGNED_UP.format(
        email=contact["email"].tame(check_string),
        location_info="{city_name}, {region_name}, {country_name}".format(
            city_name=contact["location_data"]["city_name"].tame(check_string),
            region_name=contact["location_data"]["region_name"].tame(check_string),
            country_name=contact["location_data"]["country_name"].tame(check_string),
        ),
    )
    topic_name = get_topic_for_contacts(contact)
    return (topic_name, body)


def get_contact_tag_created_message(payload: WildValue) -> tuple[str, str]:
    body = CONTACT_TAG_CREATED.format(
        name=payload["data"]["item"]["tag"]["name"].tame(check_string)
    )
    contact = payload["data"]["item"]["contact"]
    topic_name = get_topic_for_contacts(contact)
    return (topic_name, body)


def get_contact_tag_deleted_message(payload: WildValue) -> tuple[str, str]:
    body = CONTACT_TAG_DELETED.format(
        name=payload["data"]["item"]["tag"]["name"].tame(check_string)
    )
    contact = payload["data"]["item"]["contact"]
    topic_name = get_topic_for_contacts(contact)
    return (topic_name, body)


def get_conversation_admin_assigned_message(payload: WildValue) -> tuple[str, str]:
    body = CONVERSATION_ADMIN_ASSIGNED.format(
        name=payload["data"]["item"]["assignee"]["name"].tame(check_string)
    )
    user = payload["data"]["item"]["user"]
    topic_name = get_topic_for_contacts(user)
    return (topic_name, body)


def get_conversation_admin_message(
    action: str,
    payload: WildValue,
) -> tuple[str, str]:
    assignee = payload["data"]["item"]["assignee"]
    user = payload["data"]["item"]["user"]
    body = CONVERSATION_ADMIN_TEMPLATE.format(
        admin_name=assignee.get("name").tame(check_none_or(check_string)),
        action=action,
    )
    topic_name = get_topic_for_contacts(user)
    return (topic_name, body)


def get_conversation_admin_reply_message(
    action: str,
    payload: WildValue,
) -> tuple[str, str]:
    assignee = payload["data"]["item"]["assignee"]
    user = payload["data"]["item"]["user"]
    note = payload["data"]["item"]["conversation_parts"]["conversation_parts"][0]
    content = strip_tags(note["body"].tame(check_string))
    body = CONVERSATION_ADMIN_REPLY_TEMPLATE.format(
        admin_name=assignee.get("name").tame(check_none_or(check_string)),
        action=action,
        content=content,
    )
    topic_name = get_topic_for_contacts(user)
    return (topic_name, body)


def get_conversation_admin_single_created_message(payload: WildValue) -> tuple[str, str]:
    assignee = payload["data"]["item"]["assignee"]
    user = payload["data"]["item"]["user"]
    conversation_body = payload["data"]["item"]["conversation_message"]["body"].tame(check_string)
    content = strip_tags(conversation_body)
    body = CONVERSATION_ADMIN_INITIATED_CONVERSATION.format(
        admin_name=assignee.get("name").tame(check_none_or(check_string)),
        content=content,
    )
    topic_name = get_topic_for_contacts(user)
    return (topic_name, body)


def get_conversation_user_created_message(payload: WildValue) -> tuple[str, str]:
    user = payload["data"]["item"]["user"]
    conversation_body = payload["data"]["item"]["conversation_message"]["body"].tame(check_string)
    content = strip_tags(conversation_body)
    body = CONVERSATION_ADMIN_INITIATED_CONVERSATION.format(
        admin_name=user.get("name").tame(check_none_or(check_string)),
        content=content,
    )
    topic_name = get_topic_for_contacts(user)
    return (topic_name, body)


def get_conversation_user_replied_message(payload: WildValue) -> tuple[str, str]:
    user = payload["data"]["item"]["user"]
    note = payload["data"]["item"]["conversation_parts"]["conversation_parts"][0]
    content = strip_tags(note["body"].tame(check_string))
    body = CONVERSATION_ADMIN_REPLY_TEMPLATE.format(
        admin_name=user.get("name").tame(check_none_or(check_string)),
        action="replied to",
        content=content,
    )
    topic_name = get_topic_for_contacts(user)
    return (topic_name, body)


def get_event_created_message(payload: WildValue) -> tuple[str, str]:
    event = payload["data"]["item"]
    body = EVENT_CREATED.format(event_name=event["event_name"].tame(check_string))
    return ("Events", body)


def get_user_created_message(payload: WildValue) -> tuple[str, str]:
    user = payload["data"]["item"]
    body = USER_CREATED.format(
        name=user["name"].tame(check_string), email=user["email"].tame(check_string)
    )
    topic_name = get_topic_for_contacts(user)
    return (topic_name, body)


def get_user_deleted_message(payload: WildValue) -> tuple[str, str]:
    user = payload["data"]["item"]
    topic_name = get_topic_for_contacts(user)
    return (topic_name, "User deleted.")


def get_user_email_updated_message(payload: WildValue) -> tuple[str, str]:
    user = payload["data"]["item"]
    body = "User's email was updated to {}.".format(user["email"].tame(check_string))
    topic_name = get_topic_for_contacts(user)
    return (topic_name, body)


def get_user_tagged_message(
    action: str,
    payload: WildValue,
) -> tuple[str, str]:
    user = payload["data"]["item"]["user"]
    tag = payload["data"]["item"]["tag"]
    topic_name = get_topic_for_contacts(user)
    body = "The tag `{tag_name}` was {action} the user.".format(
        tag_name=tag["name"].tame(check_string),
        action=action,
    )
    return (topic_name, body)


def get_user_unsubscribed_message(payload: WildValue) -> tuple[str, str]:
    user = payload["data"]["item"]
    body = "User unsubscribed from emails."
    topic_name = get_topic_for_contacts(user)
    return (topic_name, body)


EVENT_TO_FUNCTION_MAPPER: dict[str, Callable[[WildValue], tuple[str, str]]] = {
    "company.created": get_company_created_message,
    "contact.added_email": get_contact_added_email_message,
    "contact.created": get_contact_created_message,
    "contact.signed_up": get_contact_signed_up_message,
    "contact.tag.created": get_contact_tag_created_message,
    "contact.tag.deleted": get_contact_tag_deleted_message,
    "conversation.admin.assigned": get_conversation_admin_assigned_message,
    "conversation.admin.closed": partial(get_conversation_admin_message, "closed"),
    "conversation.admin.opened": partial(get_conversation_admin_message, "opened"),
    "conversation.admin.snoozed": partial(get_conversation_admin_message, "snoozed"),
    "conversation.admin.unsnoozed": partial(get_conversation_admin_message, "unsnoozed"),
    "conversation.admin.replied": partial(get_conversation_admin_reply_message, "replied to"),
    "conversation.admin.noted": partial(get_conversation_admin_reply_message, "added a note to"),
    "conversation.admin.single.created": get_conversation_admin_single_created_message,
    "conversation.user.created": get_conversation_user_created_message,
    "conversation.user.replied": get_conversation_user_replied_message,
    "event.created": get_event_created_message,
    "user.created": get_user_created_message,
    "user.deleted": get_user_deleted_message,
    "user.email.updated": get_user_email_updated_message,
    "user.tag.created": partial(get_user_tagged_message, "added to"),
    "user.tag.deleted": partial(get_user_tagged_message, "removed from"),
    "user.unsubscribed": get_user_unsubscribed_message,
    # Note that we do not have a payload for visitor.signed_up
    # but it should be identical to contact.signed_up
    "visitor.signed_up": get_contact_signed_up_message,
}

ALL_EVENT_TYPES = list(EVENT_TO_FUNCTION_MAPPER.keys())


@webhook_view("Intercom", all_event_types=ALL_EVENT_TYPES)
# Intercom sends a HEAD request to validate the webhook URL. In this case, we just assume success.
@return_success_on_head_request
@typed_endpoint
def api_intercom_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
) -> HttpResponse:
    event_type = payload["topic"].tame(check_string)
    if event_type == "ping":
        return json_success(request)

    handler = EVENT_TO_FUNCTION_MAPPER.get(event_type)
    if handler is None:
        raise UnsupportedWebhookEventTypeError(event_type)
    topic_name, body = handler(payload)

    check_send_webhook_message(request, user_profile, topic_name, body, event_type)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: company_created.json]---
Location: zulip-main/zerver/webhooks/intercom/fixtures/company_created.json

```json
{
    "type": "notification_event",
    "app_id": "i6wc9ipe",
    "data": {
        "type": "notification_event_data",
        "item": {
            "type": "company",
            "id": "5c96b2c0d1c4c1a2d455b937",
            "company_id": "5c96b2c0d1c4c1a2d455b936-qualification-company",
            "app_id": "i6wc9ipe",
            "name": "Kandra Labs",
            "plan_id": null,
            "remote_created_at": null,
            "created_at": "2019-03-23T22:27:12.078Z",
            "updated_at": "2019-03-23T22:27:12.147Z",
            "last_request_at": "2019-03-23T22:20:52.453Z",
            "monthly_spend": 0,
            "session_count": 0,
            "user_count": 1,
            "tag_ids": [],
            "custom_attributes": {}
        }
    },
    "links": {},
    "id": "notif_1126b848-48b0-4bbb-8106-3df9d42f1a90",
    "topic": "company.created",
    "delivery_status": "pending",
    "delivery_attempts": 1,
    "delivered_at": 0,
    "first_sent_at": 1553380032,
    "created_at": 1553380032,
    "self": null
}
```

--------------------------------------------------------------------------------

---[FILE: contact_added_email.json]---
Location: zulip-main/zerver/webhooks/intercom/fixtures/contact_added_email.json

```json
{
    "type": "notification_event",
    "app_id": "i6wc9ipe",
    "data": {
        "type": "notification_event_data",
        "item": {
            "type": "contact",
            "id": "5c96b122177026171b401e20",
            "user_id": "8f9ef493-c5f9-4817-895d-874c3704ea49",
            "anonymous": true,
            "email": "jerryguitarist@gmail.com",
            "phone": null,
            "name": null,
            "pseudonym": "Azure Bus from St. John's",
            "avatar": {
                "type": "avatar",
                "image_url": null
            },
            "app_id": "i6wc9ipe",
            "companies": {
                "type": "company.list",
                "companies": []
            },
            "location_data": {
                "type": "location_data",
                "city_name": "St. John's",
                "continent_code": "NA",
                "country_name": "Canada",
                "postal_code": "A1B",
                "region_name": "Newfoundland and Labrador",
                "timezone": "America/St_Johns",
                "country_code": "CAN",
                "latitude": null,
                "longitude": null
            },
            "last_request_at": "2019-03-23T22:20:52.453+00:00",
            "created_at": "2019-03-23T22:20:18.253+00:00",
            "remote_created_at": null,
            "signed_up_at": null,
            "updated_at": "2019-03-23T22:21:46.437+00:00",
            "session_count": 0,
            "social_profiles": {
                "type": "social_profile.list",
                "social_profiles": []
            },
            "unsubscribed_from_emails": false,
            "marked_email_as_spam": false,
            "has_hard_bounced": false,
            "tags": {
                "type": "tag.list",
                "tags": []
            },
            "segments": {
                "type": "segment.list",
                "segments": []
            },
            "custom_attributes": {},
            "referrer": null,
            "utm_campaign": null,
            "utm_content": null,
            "utm_medium": null,
            "utm_source": null,
            "utm_term": null,
            "do_not_track": null,
            "last_seen_ip": null,
            "user_agent_data": null
        }
    },
    "links": {},
    "id": "notif_0cdd6657-8227-439f-899e-957646831785",
    "topic": "contact.added_email",
    "delivery_status": "pending",
    "delivery_attempts": 1,
    "delivered_at": 0,
    "first_sent_at": 1553379706,
    "created_at": 1553379706,
    "self": null
}
```

--------------------------------------------------------------------------------

---[FILE: contact_created.json]---
Location: zulip-main/zerver/webhooks/intercom/fixtures/contact_created.json

```json
{
    "type": "notification_event",
    "app_id": "i6wc9ipe",
    "data": {
        "type": "notification_event_data",
        "item": {
            "type": "contact",
            "id": "5c96b122177026171b401e20",
            "user_id": "8f9ef493-c5f9-4817-895d-874c3704ea49",
            "anonymous": true,
            "email": "aaron@zulip.com",
            "phone": null,
            "name": null,
            "pseudonym": "Azure Bus from St. John's",
            "avatar": {
                "type": "avatar",
                "image_url": "https://static.intercomassets.com/app/pseudonym_avatars_2019/azure-bus.png"
            },
            "app_id": "i6wc9ipe",
            "companies": {
                "type": "company.list",
                "companies": []
            },
            "location_data": {
                "type": "location_data",
                "city_name": "St. John's",
                "continent_code": "NA",
                "country_name": "Canada",
                "postal_code": "A1B",
                "region_name": "Newfoundland and Labrador",
                "timezone": "America/St_Johns",
                "country_code": "CAN",
                "latitude": null,
                "longitude": null
            },
            "last_request_at": "2019-03-23T22:20:52.453+00:00",
            "created_at": "2019-03-23T22:20:18.253+00:00",
            "remote_created_at": null,
            "signed_up_at": null,
            "updated_at": "2019-03-23T22:20:52.000Z",
            "session_count": 0,
            "social_profiles": {
                "type": "social_profile.list",
                "social_profiles": []
            },
            "unsubscribed_from_emails": false,
            "marked_email_as_spam": false,
            "has_hard_bounced": false,
            "tags": {
                "type": "tag.list",
                "tags": []
            },
            "segments": {
                "type": "segment.list",
                "segments": []
            },
            "custom_attributes": {},
            "referrer": null,
            "utm_campaign": null,
            "utm_content": null,
            "utm_medium": null,
            "utm_source": null,
            "utm_term": null,
            "do_not_track": null,
            "last_seen_ip": null,
            "user_agent_data": null
        }
    },
    "links": {},
    "id": "notif_dc69e41e-58c6-49d0-8d36-69669db7fc67",
    "topic": "contact.created",
    "delivery_status": "pending",
    "delivery_attempts": 1,
    "delivered_at": 0,
    "first_sent_at": 1553379652,
    "created_at": 1553379652,
    "self": null
}
```

--------------------------------------------------------------------------------

---[FILE: contact_signed_up.json]---
Location: zulip-main/zerver/webhooks/intercom/fixtures/contact_signed_up.json

```json
{
    "type": "notification_event",
    "app_id": "i6wc9ipe",
    "data": {
        "type": "notification_event_data",
        "item": {
            "type": "user",
            "id": "5c96bcd732ba0a1531c0264c",
            "user_id": null,
            "anonymous": false,
            "email": "iago@zulip.com",
            "phone": null,
            "name": null,
            "pseudonym": "Lilac Raindrop from St. John's",
            "avatar": {
                "type": "avatar",
                "image_url": null
            },
            "app_id": "i6wc9ipe",
            "companies": {
                "type": "company.list",
                "companies": []
            },
            "location_data": {
                "type": "location_data",
                "city_name": "St. John's",
                "continent_code": "NA",
                "country_name": "Canada",
                "postal_code": "A1B",
                "region_name": "Newfoundland and Labrador",
                "timezone": "America/St_Johns",
                "country_code": "CAN",
                "latitude": null,
                "longitude": null
            },
            "last_request_at": "2019-03-23T23:14:41.517+00:00",
            "created_at": "2019-03-23T23:10:15.062+00:00",
            "remote_created_at": "2019-03-26T23:04:14.500+00:00",
            "signed_up_at": "2019-03-26T23:04:14.500+00:00",
            "updated_at": "2019-03-26T23:04:14.634+00:00",
            "session_count": 0,
            "social_profiles": {
                "type": "social_profile.list",
                "social_profiles": []
            },
            "unsubscribed_from_emails": false,
            "marked_email_as_spam": false,
            "has_hard_bounced": false,
            "tags": {
                "type": "tag.list",
                "tags": [
                    {
                        "type": "tag",
                        "id": "2525085"
                    }
                ]
            },
            "segments": {
                "type": "segment.list",
                "segments": [
                    {
                        "type": "segment",
                        "id": "5ac7ad3ed9cd4bd75b1575e0"
                    },
                    {
                        "type": "segment",
                        "id": "5ac7ad3ed9cd4bd75b1575e1"
                    }
                ]
            },
            "custom_attributes": {},
            "referrer": "http://localhost:9991/devlogin/",
            "utm_campaign": null,
            "utm_content": null,
            "utm_medium": null,
            "utm_source": null,
            "utm_term": null,
            "do_not_track": null,
            "last_seen_ip": null,
            "user_agent_data": null
        }
    },
    "links": {},
    "id": "notif_ed7d1f52-8a8e-4389-b715-ab7d5c027354",
    "topic": "contact.signed_up",
    "delivery_status": "pending",
    "delivery_attempts": 1,
    "delivered_at": 0,
    "first_sent_at": 1553641454,
    "created_at": 1553641454,
    "self": null
}
```

--------------------------------------------------------------------------------

---[FILE: contact_tag_created.json]---
Location: zulip-main/zerver/webhooks/intercom/fixtures/contact_tag_created.json

```json
{
    "type":"notification_event",
    "app_id":"i6wc9ipe",
    "data":{
        "type":"notification_event_data",
        "item":{
            "type":"contact_tag",
            "created_at":1553291522,
            "tag":{
                "type":"tag",
                "id":"2525085",
                "name":"developer"
            },
            "contact":{
                "type":"contact",
                "id":"5c9553cb27e377f24eed49f7",
                "user_id":"75067020-1204-495c-8edc-abb7d88bdd43",
                "anonymous":true,
                "email":"jerryguitarist@gmail.com",
                "phone":"+17093452342",
                "name":"Eeshan Garg",
                "pseudonym":"Rose Poodle from St. John's",
                "avatar":{
                    "type":"avatar",
                    "image_url":"https://img.fullcontact.com/static/85ce413bcdac4cec3cfdb3a8da530f8b_8a853b478c3122d7e4ec9e14f81d9a3d9ea9da198d85c1985efc2403fa6bdb0c"
                },
                "app_id":"i6wc9ipe",
                "companies":{
                    "type":"company.list",
                    "companies":[
                        {
                            "type":"company",
                            "company_id":"5c9555b50af2951cc897b79a-qualification-company",
                            "id":"5c9555b50af2951cc897b79b",
                            "name":"Kandra Labs"
                        }
                    ]
                },
                "location_data":{
                    "type":"location_data",
                    "city_name":"St. John's",
                    "continent_code":"NA",
                    "country_name":"Canada",
                    "postal_code":"A1B",
                    "region_name":"Newfoundland and Labrador",
                    "timezone":"America/St_Johns",
                    "country_code":"CAN",
                    "latitude":null,
                    "longitude":null
                },
                "last_request_at":"2019-03-22T21:42:36.634+00:00",
                "created_at":"2019-03-22T21:29:47.980+00:00",
                "remote_created_at":null,
                "signed_up_at":null,
                "updated_at":"2019-03-22T21:52:02.210+00:00",
                "session_count":0,
                "social_profiles":{
                    "type":"social_profile.list",
                    "social_profiles":[
                        {
                            "type":"social_profile",
                            "name":"github",
                            "id":null,
                            "username":"eeshangarg",
                            "url":"https://github.com/eeshangarg"
                        }
                    ]
                },
                "unsubscribed_from_emails":false,
                "marked_email_as_spam":false,
                "has_hard_bounced":false,
                "tags":{
                    "type":"tag.list",
                    "tags":[
                        {
                            "type":"tag",
                            "id":"2525085"
                        }
                    ]
                },
                "segments":{
                    "type":"segment.list",
                    "segments":[

                    ]
                },
                "custom_attributes":{

                },
                "referrer":null,
                "utm_campaign":null,
                "utm_content":null,
                "utm_medium":null,
                "utm_source":null,
                "utm_term":null,
                "do_not_track":null,
                "last_seen_ip":null,
                "user_agent_data":null
            }
        }
    },
    "links":{

    },
    "id":"notif_cac9735a-d7a1-4425-8b8b-c45cdf915892",
    "topic":"contact.tag.created",
    "delivery_status":"pending",
    "delivery_attempts":1,
    "delivered_at":0,
    "first_sent_at":1553291522,
    "created_at":1553291522,
    "self":null
}
```

--------------------------------------------------------------------------------

---[FILE: contact_tag_deleted.json]---
Location: zulip-main/zerver/webhooks/intercom/fixtures/contact_tag_deleted.json

```json
{
    "type":"notification_event",
    "app_id":"i6wc9ipe",
    "data":{
        "type":"notification_event_data",
        "item":{
            "type":"contact_tag",
            "created_at":1553291644,
            "tag":{
                "type":"tag",
                "id":"2525085",
                "name":"developer"
            },
            "contact":{
                "type":"contact",
                "id":"5c9553cb27e377f24eed49f7",
                "user_id":"75067020-1204-495c-8edc-abb7d88bdd43",
                "anonymous":true,
                "email":"jerryguitarist@gmail.com",
                "phone":"+17093452342",
                "name":"Eeshan Garg",
                "pseudonym":"Rose Poodle from St. John's",
                "avatar":{
                    "type":"avatar",
                    "image_url":"https://img.fullcontact.com/static/85ce413bcdac4cec3cfdb3a8da530f8b_8a853b478c3122d7e4ec9e14f81d9a3d9ea9da198d85c1985efc2403fa6bdb0c"
                },
                "app_id":"i6wc9ipe",
                "companies":{
                    "type":"company.list",
                    "companies":[
                        {
                            "type":"company",
                            "company_id":"5c9555b50af2951cc897b79a-qualification-company",
                            "id":"5c9555b50af2951cc897b79b",
                            "name":"Kandra Labs"
                        }
                    ]
                },
                "location_data":{
                    "type":"location_data",
                    "city_name":"St. John's",
                    "continent_code":"NA",
                    "country_name":"Canada",
                    "postal_code":"A1B",
                    "region_name":"Newfoundland and Labrador",
                    "timezone":"America/St_Johns",
                    "country_code":"CAN",
                    "latitude":null,
                    "longitude":null
                },
                "last_request_at":"2019-03-22T21:42:36.634+00:00",
                "created_at":"2019-03-22T21:29:47.980+00:00",
                "remote_created_at":null,
                "signed_up_at":null,
                "updated_at":"2019-03-22T21:54:04.618+00:00",
                "session_count":0,
                "social_profiles":{
                    "type":"social_profile.list",
                    "social_profiles":[
                        {
                            "type":"social_profile",
                            "name":"github",
                            "id":null,
                            "username":"eeshangarg",
                            "url":"https://github.com/eeshangarg"
                        }
                    ]
                },
                "unsubscribed_from_emails":false,
                "marked_email_as_spam":false,
                "has_hard_bounced":false,
                "tags":{
                    "type":"tag.list",
                    "tags":[

                    ]
                },
                "segments":{
                    "type":"segment.list",
                    "segments":[

                    ]
                },
                "custom_attributes":{

                },
                "referrer":null,
                "utm_campaign":null,
                "utm_content":null,
                "utm_medium":null,
                "utm_source":null,
                "utm_term":null,
                "do_not_track":null,
                "last_seen_ip":null,
                "user_agent_data":null
            }
        }
    },
    "links":{

    },
    "id":"notif_5cecbde1-e2f4-46dc-8f6a-378ddd22b1f7",
    "topic":"contact.tag.deleted",
    "delivery_status":"pending",
    "delivery_attempts":1,
    "delivered_at":0,
    "first_sent_at":1553291644,
    "created_at":1553291644,
    "self":null
}
```

--------------------------------------------------------------------------------

````
