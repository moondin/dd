---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 887
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 887 of 1290)

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

---[FILE: message_cache.py]---
Location: zulip-main/zerver/lib/message_cache.py
Signals: Django

```python
import copy
from collections.abc import Iterable
from datetime import datetime
from email.headerregistry import Address
from typing import Any, TypedDict

import orjson

from zerver.lib.avatar import get_avatar_field, get_avatar_for_inaccessible_user
from zerver.lib.cache import cache_set_many, cache_with_key, to_dict_cache_key, to_dict_cache_key_id
from zerver.lib.display_recipient import bulk_fetch_display_recipients
from zerver.lib.markdown import render_message_markdown, topic_links
from zerver.lib.markdown import version as markdown_version
from zerver.lib.query_helpers import query_for_ids
from zerver.lib.timestamp import datetime_to_timestamp
from zerver.lib.topic import DB_TOPIC_NAME, TOPIC_LINKS, TOPIC_NAME
from zerver.lib.types import DisplayRecipientT, EditHistoryEvent, UserDisplayRecipient
from zerver.models import Message, Reaction, Realm, Recipient, Stream, SubMessage, UserProfile
from zerver.models.realms import get_fake_email_domain


class RawReactionRow(TypedDict):
    emoji_code: str
    emoji_name: str
    message_id: int
    reaction_type: str
    user_profile_id: int


def sew_messages_and_reactions(
    messages: list[dict[str, Any]], reactions: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    """Given a iterable of messages and reactions stitch reactions
    into messages.
    """
    # Add all messages with empty reaction item
    for message in messages:
        message["reactions"] = []

    # Convert list of messages into dictionary to make reaction stitching easy
    converted_messages = {message["id"]: message for message in messages}

    for reaction in reactions:
        converted_messages[reaction["message_id"]]["reactions"].append(reaction)

    return list(converted_messages.values())


def sew_messages_and_submessages(
    messages: list[dict[str, Any]], submessages: list[dict[str, Any]]
) -> None:
    # This is super similar to sew_messages_and_reactions.
    for message in messages:
        message["submessages"] = []

    message_dict = {message["id"]: message for message in messages}

    for submessage in submessages:
        message_id = submessage["message_id"]
        if message_id in message_dict:
            message = message_dict[message_id]
            message["submessages"].append(submessage)


def extract_message_dict(message_bytes: bytes) -> dict[str, Any]:
    return orjson.loads(message_bytes)


def stringify_message_dict(message_dict: dict[str, Any]) -> bytes:
    return orjson.dumps(message_dict)


@cache_with_key(to_dict_cache_key, timeout=3600 * 24, pickled_tupled=False)
def message_to_encoded_cache(message: Message, realm_id: int | None = None) -> bytes:
    return MessageDict.messages_to_encoded_cache([message], realm_id)[message.id]


def update_message_cache(
    changed_messages: Iterable[Message], realm_id: int | None = None
) -> list[int]:
    """Updates the message as stored in the to_dict cache (for serving
    messages)."""
    items_for_remote_cache = {}
    changed_messages_to_dict = MessageDict.messages_to_encoded_cache(changed_messages, realm_id)
    for msg_id, msg in changed_messages_to_dict.items():
        items_for_remote_cache[to_dict_cache_key_id(msg_id)] = msg

    cache_set_many(items_for_remote_cache)
    return list(changed_messages_to_dict.keys())


def save_message_rendered_content(message: Message, content: str) -> str:
    rendering_result = render_message_markdown(message, content, realm=message.get_realm())
    rendered_content = None
    if rendering_result is not None:
        rendered_content = rendering_result.rendered_content
    message.rendered_content = rendered_content
    message.rendered_content_version = markdown_version
    message.save_rendered_content()
    return rendered_content


class ReactionDict:
    @staticmethod
    def build_dict_from_raw_db_row(row: RawReactionRow) -> dict[str, Any]:
        return {
            "emoji_name": row["emoji_name"],
            "emoji_code": row["emoji_code"],
            "reaction_type": row["reaction_type"],
            "user_id": row["user_profile_id"],
        }


class MessageDict:
    """MessageDict is the core class responsible for marshalling Message
    objects obtained from the database into a format that can be sent
    to clients via the Zulip API, whether via `GET /messages`,
    outgoing webhooks, or other code paths.  There are two core flows through
    which this class is used:

    * For just-sent messages, we construct a single `wide_dict` object
      containing all the data for the message and the related
      UserProfile models (sender_info and recipient_info); this object
      can be stored in queues, caches, etc., and then later turned
      into an API-format JSONable dictionary via finalize_payload.

    * When fetching messages from the database, we fetch their data in
      bulk using messages_for_ids, which makes use of caching, bulk
      fetches that skip the Django ORM, etc., to provide an optimized
      interface for fetching hundreds of thousands of messages from
      the database and then turning them into API-format JSON
      dictionaries.

    """

    @staticmethod
    def wide_dict(message: Message, realm_id: int | None = None) -> dict[str, Any]:
        """
        The next two lines get the cacheable field related
        to our message object, with the side effect of
        populating the cache.
        """
        encoded_object_bytes = message_to_encoded_cache(message, realm_id)
        obj = extract_message_dict(encoded_object_bytes)

        """
        The steps below are similar to what we do in
        post_process_dicts(), except we don't call finalize_payload(),
        since that step happens later in the queue
        processor.
        """
        MessageDict.bulk_hydrate_sender_info([obj])
        MessageDict.bulk_hydrate_recipient_info([obj])

        return obj

    @staticmethod
    def post_process_dicts(
        objs: list[dict[str, Any]],
        *,
        apply_markdown: bool,
        client_gravatar: bool,
        allow_empty_topic_name: bool,
        realm: Realm,
        user_recipient_id: int | None,
    ) -> None:
        """
        NOTE: This function mutates the objects in
              the `objs` list, rather than making
              shallow copies.  It might be safer to
              make shallow copies here, but performance
              is somewhat important here, as we are
              often fetching hundreds of messages.
        """
        MessageDict.bulk_hydrate_sender_info(objs)
        MessageDict.bulk_hydrate_recipient_info(objs)

        for obj in objs:
            can_access_sender = obj.get("can_access_sender", True)
            MessageDict.finalize_payload(
                obj,
                apply_markdown=apply_markdown,
                client_gravatar=client_gravatar,
                allow_empty_topic_name=allow_empty_topic_name,
                skip_copy=True,
                can_access_sender=can_access_sender,
                realm_host=realm.host,
                is_incoming_1_to_1=obj["recipient_id"] == user_recipient_id,
            )

    @staticmethod
    def finalize_payload(
        obj: dict[str, Any],
        *,
        apply_markdown: bool,
        client_gravatar: bool,
        allow_empty_topic_name: bool,
        keep_rendered_content: bool = False,
        skip_copy: bool = False,
        can_access_sender: bool,
        realm_host: str,
        is_incoming_1_to_1: bool,
    ) -> dict[str, Any]:
        """
        By default, we make a shallow copy of the incoming dict to avoid
        mutation-related bugs.  Code paths that are passing a unique object
        can pass skip_copy=True to avoid this extra work.
        """
        if not skip_copy:
            obj = copy.copy(obj)

        # Compatibility code to change topic="" to topic=Message.EMPTY_TOPIC_FALLBACK_NAME
        # for older clients with no support for empty topic name.
        if (
            obj["recipient_type"] == Recipient.STREAM
            and obj["subject"] == ""
            and not allow_empty_topic_name
        ):
            obj["subject"] = Message.EMPTY_TOPIC_FALLBACK_NAME

        if obj["sender_email_address_visibility"] != UserProfile.EMAIL_ADDRESS_VISIBILITY_EVERYONE:
            # If email address of the sender is only available to administrators,
            # clients cannot compute gravatars, so we force-set it to false.
            # If we plumbed the current user's role, we could allow client_gravatar=True
            # here if the current user's role has access to the target user's email address.
            client_gravatar = False

        if not can_access_sender:
            # Enforce inability to access details of inaccessible
            # users. We should be able to remove the realm_host and
            # can_access_user plumbing to this function if/when we
            # shift the Zulip API to not send these denormalized
            # fields about message senders favor of just sending the
            # sender's user ID.
            obj["sender_full_name"] = str(UserProfile.INACCESSIBLE_USER_NAME)
            sender_id = obj["sender_id"]
            obj["sender_email"] = Address(
                username=f"user{sender_id}", domain=get_fake_email_domain(realm_host)
            ).addr_spec

        MessageDict.set_sender_avatar(obj, client_gravatar, can_access_sender)
        if apply_markdown:
            obj["content_type"] = "text/html"
            obj["content"] = obj["rendered_content"]
        else:
            obj["content_type"] = "text/x-markdown"

        if is_incoming_1_to_1 and "sender_recipient_id" in obj:
            # For an incoming 1:1 DM, the recipient’s own recipient_id is
            # useless to the recipient themselves. Substitute the sender’s
            # recipient_id, so the recipient can use recipient_id as documented
            # to uniquely represent the set of 2 users in this conversation.
            obj["recipient_id"] = obj["sender_recipient_id"]

        for item in obj.get("edit_history", []):
            if "prev_rendered_content_version" in item:
                del item["prev_rendered_content_version"]
            if not allow_empty_topic_name:
                if "prev_topic" in item and item["prev_topic"] == "":
                    item["prev_topic"] = Message.EMPTY_TOPIC_FALLBACK_NAME
                if "topic" in item and item["topic"] == "":
                    item["topic"] = Message.EMPTY_TOPIC_FALLBACK_NAME

        if not keep_rendered_content:
            del obj["rendered_content"]
        obj.pop("sender_recipient_id")
        del obj["sender_realm_id"]
        del obj["sender_avatar_source"]
        del obj["sender_delivery_email"]
        del obj["sender_avatar_version"]

        del obj["recipient_type"]
        del obj["recipient_type_id"]
        del obj["sender_is_mirror_dummy"]
        del obj["sender_email_address_visibility"]
        if "can_access_sender" in obj:
            del obj["can_access_sender"]
        return obj

    @staticmethod
    def sew_submessages_and_reactions_to_msgs(
        messages: list[dict[str, Any]],
    ) -> list[dict[str, Any]]:
        msg_ids = [msg["id"] for msg in messages]
        submessages = SubMessage.get_raw_db_rows(msg_ids)
        sew_messages_and_submessages(messages, submessages)

        reactions = Reaction.get_raw_db_rows(msg_ids)
        return sew_messages_and_reactions(messages, reactions)

    @staticmethod
    def messages_to_encoded_cache(
        messages: Iterable[Message], realm_id: int | None = None
    ) -> dict[int, bytes]:
        messages_dict = MessageDict.messages_to_encoded_cache_helper(messages, realm_id)
        encoded_messages = {msg["id"]: stringify_message_dict(msg) for msg in messages_dict}
        return encoded_messages

    @staticmethod
    def messages_to_encoded_cache_helper(
        messages: Iterable[Message], realm_id: int | None = None
    ) -> list[dict[str, Any]]:
        # Near duplicate of the build_message_dict + get_raw_db_rows
        # code path that accepts already fetched Message objects
        # rather than message IDs.

        def get_rendering_realm_id(message: Message) -> int:
            # realm_id can differ among users, currently only possible
            # with cross realm bots.
            if realm_id is not None:
                return realm_id
            if message.recipient.type == Recipient.STREAM:
                return Stream.objects.get(id=message.recipient.type_id).realm_id
            return message.realm_id

        message_rows = [
            {
                "id": message.id,
                DB_TOPIC_NAME: message.topic_name(),
                "date_sent": message.date_sent,
                "last_edit_time": message.last_edit_time,
                "edit_history": message.edit_history,
                "content": message.content,
                "rendered_content": message.rendered_content,
                "rendered_content_version": message.rendered_content_version,
                "recipient_id": message.recipient.id,
                "recipient__type": message.recipient.type,
                "recipient__type_id": message.recipient.type_id,
                "rendering_realm_id": get_rendering_realm_id(message),
                "sender_id": message.sender.id,
                "sending_client__name": message.sending_client.name,
                "sender__realm_id": message.sender.realm_id,
            }
            for message in messages
        ]

        MessageDict.sew_submessages_and_reactions_to_msgs(message_rows)
        return [MessageDict.build_dict_from_raw_db_row(row) for row in message_rows]

    @staticmethod
    def ids_to_dict(needed_ids: list[int]) -> list[dict[str, Any]]:
        # This is a special purpose function optimized for
        # callers like get_messages_backend().
        fields = [
            "id",
            DB_TOPIC_NAME,
            "date_sent",
            "last_edit_time",
            "edit_history",
            "content",
            "rendered_content",
            "rendered_content_version",
            "recipient_id",
            "recipient__type",
            "recipient__type_id",
            "sender_id",
            "sending_client__name",
            "sender__realm_id",
        ]
        # Uses index: zerver_message_pkey
        messages = Message.objects.filter(id__in=needed_ids).values(*fields)
        MessageDict.sew_submessages_and_reactions_to_msgs(messages)
        return [MessageDict.build_dict_from_raw_db_row(row) for row in messages]

    @staticmethod
    def build_dict_from_raw_db_row(row: dict[str, Any]) -> dict[str, Any]:
        """
        row is a row from a .values() call, and it needs to have
        all the relevant fields populated
        """

        def get_message_topic(row: dict[str, Any]) -> str:
            if row["recipient__type"] == Recipient.STREAM:
                return row[DB_TOPIC_NAME]
            return ""

        return MessageDict.build_message_dict(
            message_id=row["id"],
            last_edit_time=row["last_edit_time"],
            edit_history_json=row["edit_history"],
            content=row["content"],
            topic_name=get_message_topic(row),
            date_sent=row["date_sent"],
            rendered_content=row["rendered_content"],
            rendered_content_version=row["rendered_content_version"],
            sender_id=row["sender_id"],
            sender_realm_id=row["sender__realm_id"],
            sending_client_name=row["sending_client__name"],
            rendering_realm_id=row.get("rendering_realm_id", row["sender__realm_id"]),
            recipient_id=row["recipient_id"],
            recipient_type=row["recipient__type"],
            recipient_type_id=row["recipient__type_id"],
            reactions=row["reactions"],
            submessages=row["submessages"],
        )

    @staticmethod
    def build_message_dict(
        message_id: int,
        last_edit_time: datetime | None,
        edit_history_json: str | None,
        content: str,
        topic_name: str,
        date_sent: datetime,
        rendered_content: str | None,
        rendered_content_version: int | None,
        sender_id: int,
        sender_realm_id: int,
        sending_client_name: str,
        rendering_realm_id: int,
        recipient_id: int,
        recipient_type: int,
        recipient_type_id: int,
        reactions: list[RawReactionRow],
        submessages: list[dict[str, Any]],
    ) -> dict[str, Any]:
        obj = dict(
            id=message_id,
            sender_id=sender_id,
            content=content,
            recipient_type_id=recipient_type_id,
            recipient_type=recipient_type,
            recipient_id=recipient_id,
            timestamp=datetime_to_timestamp(date_sent),
            client=sending_client_name,
        )

        obj[TOPIC_NAME] = topic_name
        obj["sender_realm_id"] = sender_realm_id

        # Render topic_links with the stream's realm instead of the
        # sender's realm; this is important for messages sent by
        # cross-realm bots like NOTIFICATION_BOT.
        obj[TOPIC_LINKS] = topic_links(rendering_realm_id, topic_name)

        if last_edit_time is not None:
            obj["last_edit_timestamp"] = datetime_to_timestamp(last_edit_time)
            assert edit_history_json is not None
            edit_history: list[EditHistoryEvent] = orjson.loads(edit_history_json)
            obj["edit_history"] = edit_history

        if Message.need_to_render_content(
            rendered_content, rendered_content_version, markdown_version
        ):
            # We really shouldn't be rendering objects in this method, but there is
            # a scenario where we upgrade the version of Markdown and fail to run
            # management commands to re-render historical messages, and then we
            # need to have side effects.  This method is optimized to not need full
            # blown ORM objects, but the Markdown renderer is unfortunately highly
            # coupled to Message, and we also need to persist the new rendered content.
            # If we don't have a message object passed in, we get one here.  The cost
            # of going to the DB here should be overshadowed by the cost of rendering
            # and updating the row.
            # TODO: see #1379 to eliminate Markdown dependencies
            message = Message.objects.select_related("sender").get(id=message_id)

            assert message is not None  # Hint for mypy.
            # It's unfortunate that we need to have side effects on the message
            # in some cases.
            rendered_content = save_message_rendered_content(message, content)

        if rendered_content is not None:
            obj["rendered_content"] = rendered_content
        else:
            obj["rendered_content"] = (
                "<p>[Zulip note: Sorry, we could not understand the formatting of your message]</p>"
            )

        if rendered_content is not None:
            obj["is_me_message"] = Message.is_status_message(content, rendered_content)
        else:
            obj["is_me_message"] = False

        obj["reactions"] = [
            ReactionDict.build_dict_from_raw_db_row(reaction) for reaction in reactions
        ]
        obj["submessages"] = submessages
        return obj

    @staticmethod
    def bulk_hydrate_sender_info(objs: list[dict[str, Any]]) -> None:
        sender_ids = list({obj["sender_id"] for obj in objs})

        if not sender_ids:
            return

        query = UserProfile.objects.values(
            "id",
            "full_name",
            "delivery_email",
            "email",
            "recipient_id",
            "realm__string_id",
            "avatar_source",
            "avatar_version",
            "is_mirror_dummy",
            "email_address_visibility",
        )

        rows = query_for_ids(query, sender_ids, "zerver_userprofile.id")

        sender_dict = {row["id"]: row for row in rows}

        for obj in objs:
            sender_id = obj["sender_id"]
            user_row = sender_dict[sender_id]
            obj["sender_recipient_id"] = user_row["recipient_id"]
            obj["sender_full_name"] = user_row["full_name"]
            obj["sender_email"] = user_row["email"]
            obj["sender_delivery_email"] = user_row["delivery_email"]
            obj["sender_realm_str"] = user_row["realm__string_id"]
            obj["sender_avatar_source"] = user_row["avatar_source"]
            obj["sender_avatar_version"] = user_row["avatar_version"]
            obj["sender_is_mirror_dummy"] = user_row["is_mirror_dummy"]
            obj["sender_email_address_visibility"] = user_row["email_address_visibility"]

    @staticmethod
    def hydrate_recipient_info(obj: dict[str, Any], display_recipient: DisplayRecipientT) -> None:
        """
        This method hyrdrates recipient info with things
        like full names and emails of senders.  Eventually
        our clients should be able to hyrdrate these fields
        themselves with info they already have on users.
        """

        recipient_type = obj["recipient_type"]
        recipient_type_id = obj["recipient_type_id"]
        sender_is_mirror_dummy = obj["sender_is_mirror_dummy"]
        sender_email = obj["sender_email"]
        sender_full_name = obj["sender_full_name"]
        sender_id = obj["sender_id"]

        if recipient_type == Recipient.STREAM:
            display_type = "stream"
        elif recipient_type in (Recipient.DIRECT_MESSAGE_GROUP, Recipient.PERSONAL):
            assert not isinstance(display_recipient, str)
            display_type = "private"
            if len(display_recipient) == 1:
                # add the sender in if this isn't a message between
                # someone and themself, preserving ordering
                recip: UserDisplayRecipient = {
                    "email": sender_email,
                    "full_name": sender_full_name,
                    "id": sender_id,
                    "is_mirror_dummy": sender_is_mirror_dummy,
                }
                if recip["email"] < display_recipient[0]["email"]:
                    display_recipient = [recip, display_recipient[0]]
                elif recip["email"] > display_recipient[0]["email"]:
                    display_recipient = [display_recipient[0], recip]
        else:
            raise AssertionError(f"Invalid recipient type {recipient_type}")

        obj["display_recipient"] = display_recipient
        obj["type"] = display_type
        if obj["type"] == "stream":
            obj["stream_id"] = recipient_type_id

    @staticmethod
    def bulk_hydrate_recipient_info(objs: list[dict[str, Any]]) -> None:
        recipient_tuples = {  # We use set to eliminate duplicate tuples.
            (
                obj["recipient_id"],
                obj["recipient_type"],
                obj["recipient_type_id"],
            )
            for obj in objs
        }
        display_recipients = bulk_fetch_display_recipients(recipient_tuples)

        for obj in objs:
            MessageDict.hydrate_recipient_info(obj, display_recipients[obj["recipient_id"]])

    @staticmethod
    def set_sender_avatar(
        obj: dict[str, Any], client_gravatar: bool, can_access_sender: bool = True
    ) -> None:
        if not can_access_sender:
            obj["avatar_url"] = get_avatar_for_inaccessible_user()
            return

        sender_id = obj["sender_id"]
        sender_realm_id = obj["sender_realm_id"]
        sender_delivery_email = obj["sender_delivery_email"]
        sender_avatar_source = obj["sender_avatar_source"]
        sender_avatar_version = obj["sender_avatar_version"]

        obj["avatar_url"] = get_avatar_field(
            user_id=sender_id,
            realm_id=sender_realm_id,
            email=sender_delivery_email,
            avatar_source=sender_avatar_source,
            avatar_version=sender_avatar_version,
            medium=False,
            client_gravatar=client_gravatar,
        )
```

--------------------------------------------------------------------------------

---[FILE: message_report.py]---
Location: zulip-main/zerver/lib/message_report.py
Signals: Django

```python
from django.conf import settings
from django.utils.translation import gettext as _

from zerver.actions.message_send import internal_send_stream_message
from zerver.lib.display_recipient import get_display_recipient
from zerver.lib.markdown.fenced_code import get_unused_fence
from zerver.lib.mention import silent_mention_syntax_for_user
from zerver.lib.message import is_1_to_1_message, truncate_content
from zerver.lib.timestamp import datetime_to_global_time
from zerver.lib.topic_link_util import get_message_link_syntax
from zerver.lib.url_encoding import pm_message_url
from zerver.models import Message, Realm, UserProfile
from zerver.models.recipients import Recipient
from zerver.models.streams import StreamTopicsPolicyEnum
from zerver.models.users import get_system_bot

# We shrink the truncate length for the reported message to ensure
# that the "notes" included by the reporting user fit within the
# limit. The extra 500 is an arbitrary buffer for all the extra
# template strings.
MAX_REPORT_MESSAGE_SNIPPET_LENGTH = (
    settings.MAX_MESSAGE_LENGTH - Realm.MAX_REPORT_MESSAGE_EXPLANATION_LENGTH - 500
)


def send_message_report(
    reporting_user: UserProfile,
    realm: Realm,
    reported_message: Message,
    report_type: str,
    description: str,
) -> None:
    moderation_request_channel = realm.moderation_request_channel
    assert moderation_request_channel is not None

    reported_user = reported_message.sender
    reported_user_mention = silent_mention_syntax_for_user(reported_user)
    reporting_user_mention = silent_mention_syntax_for_user(reporting_user)
    report_reason = Realm.REPORT_MESSAGE_REASONS[report_type]
    reported_message_date_sent = datetime_to_global_time(reported_message.date_sent)

    # Build reported message header
    if is_1_to_1_message(reported_message):
        if reported_user != reporting_user:
            report_header = _(
                "{reporting_user_mention} reported a direct message sent by {reported_user_mention} at {reported_message_date_sent}."
            ).format(
                reporting_user_mention=reporting_user_mention,
                reported_user_mention=reported_user_mention,
                reported_message_date_sent=reported_message_date_sent,
            )
        else:
            # Clearly mention the direct message recipient if someone is
            # reporting their own message in a 1-on-1 direct message.
            if reported_message.recipient.type_id != reporting_user.id:
                recipient_user = next(
                    silent_mention_syntax_for_user(user)
                    for user in get_display_recipient(reported_message.recipient)
                    if user["id"] != reporting_user.id
                )
            else:
                recipient_user = reporting_user_mention
            report_header = _(
                "{reporting_user_mention} reported a direct message sent by {reported_user_mention} to {recipient_user} at {reported_message_date_sent}."
            ).format(
                reporting_user_mention=reporting_user_mention,
                reported_user_mention=reported_user_mention,
                recipient_user=recipient_user,
                reported_message_date_sent=reported_message_date_sent,
            )
    elif reported_message.recipient.type == Recipient.DIRECT_MESSAGE_GROUP:
        recipient_list = sorted(
            [
                silent_mention_syntax_for_user(user)
                for user in get_display_recipient(reported_message.recipient)
                if user["id"] is not reported_user.id
            ]
        )
        last_recipient_user = recipient_list.pop()
        recipient_users: str = ", ".join(recipient_list)
        if len(recipient_list) > 1:
            recipient_users += ","
        report_header = _(
            "{reporting_user_mention} reported a direct message sent by {reported_user_mention} to {recipient_users} and {last_recipient_user} at {reported_message_date_sent}."
        ).format(
            reporting_user_mention=reporting_user_mention,
            reported_user_mention=reported_user_mention,
            recipient_users=recipient_users,
            last_recipient_user=last_recipient_user,
            reported_message_date_sent=reported_message_date_sent,
        )
    else:
        assert reported_message.is_channel_message is True
        topic_name = reported_message.topic_name()
        channel_id = reported_message.recipient.type_id
        channel_name = reported_message.recipient.label()
        channel_message_link = get_message_link_syntax(
            channel_id,
            channel_name,
            topic_name,
            reported_message.id,
        )
        report_header = _(
            "{reporting_user_mention} reported a message sent by {reported_user_mention} at {reported_message_date_sent}."
        ).format(
            reporting_user_mention=reporting_user_mention,
            reported_user_mention=reported_user_mention,
            reported_message_date_sent=reported_message_date_sent,
        )

    content = report_header

    # Build report context and message preview block
    if reported_message.is_channel_message:
        original_message_string = _("Original message at {channel_message_link}").format(
            channel_message_link=channel_message_link
        )
    else:
        direct_message_link = pm_message_url(
            realm,
            dict(
                id=reported_message.id,
                display_recipient=get_display_recipient(reported_message.recipient),
            ),
        )
        original_message_string = _("[Original message]({direct_message_link})").format(
            direct_message_link=direct_message_link
        )

    reported_message_content = truncate_content(
        reported_message.content, MAX_REPORT_MESSAGE_SNIPPET_LENGTH, "\n[message truncated]"
    )
    reported_message_preview_block = """
```quote
**{report_reason}**. {description}
```

{fence} spoiler {original_message_string}
{reported_message}
{fence}
""".format(
        report_reason=report_reason,
        description=description,
        original_message_string=original_message_string,
        reported_message=reported_message_content,
        fence=get_unused_fence(reported_message_content),
    )
    content += reported_message_preview_block

    topic_name = _("{fullname} moderation").format(fullname=reported_user.full_name)
    if moderation_request_channel.topics_policy == StreamTopicsPolicyEnum.empty_topic_only.value:
        topic_name = ""

    internal_send_stream_message(
        sender=get_system_bot(settings.NOTIFICATION_BOT, moderation_request_channel.realm.id),
        stream=moderation_request_channel,
        topic_name=topic_name,
        content=content,
        acting_user=reporting_user,
    )
```

--------------------------------------------------------------------------------

---[FILE: migrate.py]---
Location: zulip-main/zerver/lib/migrate.py
Signals: Django

```python
import time
from collections.abc import Callable
from typing import Any

from django.db import connection
from django.db.backends.base.schema import BaseDatabaseSchemaEditor
from django.db.backends.utils import CursorWrapper
from django.db.migrations.state import StateApps
from psycopg2.sql import SQL, Composable, Identifier


def do_batch_update(
    cursor: CursorWrapper,
    table: str,
    assignments: list[Composable],
    batch_size: int = 10000,
    sleep: float = 0.1,
) -> None:
    # The string substitution below is complicated by our need to
    # support multiple PostgreSQL versions.
    stmt = SQL(
        """
        UPDATE {}
        SET {}
        WHERE id >= %s AND id < %s
    """
    ).format(
        Identifier(table),
        SQL(", ").join(assignments),
    )

    cursor.execute(SQL("SELECT MIN(id), MAX(id) FROM {}").format(Identifier(table)))
    (min_id, max_id) = cursor.fetchone()
    if min_id is None:
        return

    print(f"\n    Range of rows to update: [{min_id}, {max_id}]")
    while min_id <= max_id:
        lower = min_id
        upper = min_id + batch_size
        print(f"    Updating range [{lower},{upper})")
        cursor.execute(stmt, [lower, upper])

        min_id = upper
        time.sleep(sleep)

        # Once we've finished, check if any new rows were inserted to the table
        if min_id > max_id:
            cursor.execute(SQL("SELECT MAX(id) FROM {}").format(Identifier(table)))
            (max_id,) = cursor.fetchone()

    print("    Finishing...", end="")


def rename_indexes_constraints(
    old_table: str, new_table: str
) -> Callable[[StateApps, BaseDatabaseSchemaEditor], None]:
    # NOTE: `get_constraints`, which this uses, does not include any
    # information about if the index name was manually set from
    # Django, nor if it is a partial index.  This has the theoretical
    # possibility to cause false positives in the duplicate-index
    # check below, which would incorrectly drop one of the wanted
    # indexes.
    #
    # Before using this on a table, ensure that it does not use
    # partial indexes, nor manually-named indexes.
    def inner_migration(apps: StateApps, schema_editor: Any) -> None:
        seen_indexes = set()
        with connection.cursor() as cursor:
            constraints = connection.introspection.get_constraints(cursor, old_table)

            for old_name, infodict in constraints.items():
                if infodict["check"]:
                    suffix = "_check"
                    is_index = False
                elif infodict["foreign_key"] is not None:
                    is_index = False
                    to_table, to_column = infodict["foreign_key"]
                    suffix = f"_fk_{to_table}_{to_column}"
                elif infodict["primary_key"]:
                    suffix = "_pk"
                    is_index = True
                elif infodict["unique"]:
                    suffix = "_uniq"
                    is_index = True
                else:
                    suffix = "_idx" if len(infodict["columns"]) > 1 else ""
                    is_index = True
                new_name = schema_editor._create_index_name(new_table, infodict["columns"], suffix)
                if new_name in seen_indexes:
                    # This index duplicates one we already renamed,
                    # and attempting to rename it would cause a
                    # conflict.  Drop the duplicated index.
                    if is_index:
                        raw_query = SQL("DROP INDEX {old_name}").format(
                            old_name=Identifier(old_name)
                        )
                    else:
                        raw_query = SQL(
                            "ALTER TABLE {table_name} DROP CONSTRAINT {old_name}"
                        ).format(table_name=Identifier(old_table), old_name=Identifier(old_name))
                    cursor.execute(raw_query)
                    continue

                seen_indexes.add(new_name)
                if is_index:
                    raw_query = SQL("ALTER INDEX {old_name} RENAME TO {new_name}").format(
                        old_name=Identifier(old_name), new_name=Identifier(new_name)
                    )
                else:
                    raw_query = SQL(
                        "ALTER TABLE {old_table} RENAME CONSTRAINT {old_name} TO {new_name}"
                    ).format(
                        old_table=Identifier(old_table),
                        old_name=Identifier(old_name),
                        new_name=Identifier(new_name),
                    )
                cursor.execute(raw_query)

            for infodict in connection.introspection.get_sequences(cursor, old_table):
                old_name = infodict["name"]
                column = infodict["column"]
                new_name = f"{new_table}_{column}_seq"

                raw_query = SQL("ALTER SEQUENCE {old_name} RENAME TO {new_name}").format(
                    old_name=Identifier(old_name),
                    new_name=Identifier(new_name),
                )
                cursor.execute(raw_query)

            cursor.execute(
                SQL("ALTER TABLE {old_table} RENAME TO {new_table}").format(
                    old_table=Identifier(old_table), new_table=Identifier(new_table)
                )
            )

    return inner_migration
```

--------------------------------------------------------------------------------

````
