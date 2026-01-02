---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 910
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 910 of 1290)

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

---[FILE: topic.py]---
Location: zulip-main/zerver/lib/topic.py
Signals: Django

```python
from collections.abc import Callable
from datetime import datetime
from typing import Any

import orjson
from django.db import connection
from django.db.models import F, Func, JSONField, Q, QuerySet, Subquery, TextField, Value
from django.db.models.functions import Cast
from django.utils.translation import gettext as _
from django.utils.translation import override as override_language

from zerver.lib.types import EditHistoryEvent, StreamMessageEditRequest
from zerver.lib.utils import assert_is_not_none
from zerver.models import Message, Reaction, UserMessage, UserProfile

# Only use these constants for events.
ORIG_TOPIC = "orig_subject"
TOPIC_NAME = "subject"
TOPIC_LINKS = "topic_links"
MATCH_TOPIC = "match_subject"

# Prefix use to mark topic as resolved.
RESOLVED_TOPIC_PREFIX = "✔ "

# This constant is pretty closely coupled to the
# database, but it's the JSON field.
EXPORT_TOPIC_NAME = "subject"

"""
The following functions are for user-facing APIs
where we'll want to support "subject" for a while.
"""


def get_topic_from_message_info(message_info: dict[str, Any]) -> str:
    """
    Use this where you are getting dicts that are based off of messages
    that may come from the outside world, especially from third party
    APIs and bots.

    We prefer 'topic' to 'subject' here.  We expect at least one field
    to be present (or the caller must know how to handle KeyError).
    """
    if "topic" in message_info:
        return message_info["topic"]

    return message_info["subject"]


"""
TRY TO KEEP THIS DIVIDING LINE.

Below this line we want to make it so that functions are only
using "subject" in the DB sense, and nothing customer facing.

"""

# This is used in low-level message functions in
# zerver/lib/message.py, and it's not user facing.
DB_TOPIC_NAME = "subject"
MESSAGE__TOPIC = "message__subject"


def filter_by_topic_name_via_message(
    query: QuerySet[UserMessage], topic_name: str
) -> QuerySet[UserMessage]:
    return query.filter(message__is_channel_message=True, message__subject__iexact=topic_name)


def messages_for_topic(
    realm_id: int, stream_recipient_id: int, topic_name: str
) -> QuerySet[Message]:
    return Message.objects.filter(
        # Uses index: zerver_message_realm_recipient_upper_subject
        realm_id=realm_id,
        recipient_id=stream_recipient_id,
        subject__iexact=topic_name,
        is_channel_message=True,
    )


def get_latest_message_for_user_in_topic(
    realm_id: int,
    user_profile: UserProfile | None,
    recipient_id: int,
    topic_name: str,
    history_public_to_subscribers: bool,
    acting_user_has_channel_content_access: bool = False,
) -> int | None:
    # Guard against incorrectly calling this function without
    # first checking for channel access.
    assert acting_user_has_channel_content_access

    if history_public_to_subscribers:
        return (
            messages_for_topic(realm_id, recipient_id, topic_name)
            .values_list("id", flat=True)
            .last()
        )

    elif user_profile is not None:
        return (
            UserMessage.objects.filter(
                user_profile=user_profile,
                message__recipient_id=recipient_id,
                message__subject__iexact=topic_name,
                message__is_channel_message=True,
            )
            .values_list("message_id", flat=True)
            .last()
        )

    return None


def save_message_for_edit_use_case(message: Message) -> None:
    message.save(
        update_fields=[
            TOPIC_NAME,
            "content",
            "rendered_content",
            "rendered_content_version",
            "last_edit_time",
            "edit_history",
            "has_attachment",
            "has_image",
            "has_link",
            "recipient_id",
        ]
    )


def user_message_exists_for_topic(
    user_profile: UserProfile, recipient_id: int, topic_name: str
) -> bool:
    return UserMessage.objects.filter(
        user_profile=user_profile,
        message__recipient_id=recipient_id,
        message__subject__iexact=topic_name,
        message__is_channel_message=True,
    ).exists()


def update_edit_history(
    message: Message, last_edit_time: datetime, edit_history_event: EditHistoryEvent
) -> None:
    message.last_edit_time = last_edit_time
    if message.edit_history is not None:
        edit_history: list[EditHistoryEvent] = orjson.loads(message.edit_history)
        edit_history.insert(0, edit_history_event)
    else:
        edit_history = [edit_history_event]
    message.edit_history = orjson.dumps(edit_history).decode()


def update_messages_for_topic_edit(
    acting_user: UserProfile,
    edited_message: Message,
    message_edit_request: StreamMessageEditRequest,
    edit_history_event: EditHistoryEvent,
    last_edit_time: datetime,
) -> tuple[QuerySet[Message], Callable[[], QuerySet[Message]]]:
    # Uses index: zerver_message_realm_recipient_upper_subject
    old_stream = message_edit_request.orig_stream
    messages = Message.objects.filter(
        realm_id=old_stream.realm_id,
        recipient_id=assert_is_not_none(old_stream.recipient_id),
        subject__iexact=message_edit_request.orig_topic_name,
        is_channel_message=True,
    )
    if message_edit_request.propagate_mode == "change_all":
        messages = messages.exclude(id=edited_message.id)
    if message_edit_request.propagate_mode == "change_later":
        messages = messages.filter(id__gt=edited_message.id)

    if message_edit_request.is_stream_edited:
        # If we're moving the messages between streams, only move
        # messages that the acting user can access, so that one cannot
        # gain access to messages through moving them.
        from zerver.lib.message import bulk_access_stream_messages_query

        messages = bulk_access_stream_messages_query(acting_user, messages, old_stream)
    else:
        # For single-message edits or topic moves within a stream, we
        # allow moving history the user may not have access in order
        # to keep topics together.
        pass

    update_fields: dict[str, object] = {
        "last_edit_time": last_edit_time,
        # We cast the `edit_history` column to jsonb (defaulting NULL
        # to `[]`), apply the `||` array concatenation operator to it,
        # and cast the result back to text.  See #26496 for making
        # this column itself jsonb, which is a complicated migration.
        #
        # This equates to:
        #    "edit_history" = (
        #      ( '[{ ..json event.. }]' )::jsonb
        #      ||
        #      (COALESCE("zerver_message"."edit_history", '[]'))::jsonb
        #     )::text
        "edit_history": Cast(
            Func(
                Cast(
                    Value(orjson.dumps([edit_history_event]).decode()),
                    JSONField(),
                ),
                Cast(
                    Func(
                        F("edit_history"),
                        Value("[]"),
                        function="COALESCE",
                    ),
                    JSONField(),
                ),
                function="",
                arg_joiner=" || ",
            ),
            TextField(),
        ),
    }
    if message_edit_request.is_stream_edited:
        update_fields["recipient"] = message_edit_request.target_stream.recipient
    if message_edit_request.is_topic_edited:
        update_fields["subject"] = message_edit_request.target_topic_name

    # The update will cause the 'messages' query to no longer match
    # any rows; we capture the set of matching ids first, do the
    # update, and then return a fresh collection -- so we know their
    # metadata has been updated for the UPDATE command, and the caller
    # can update the remote cache with that.
    message_ids = [edited_message.id, *messages.values_list("id", flat=True)]

    def propagate() -> QuerySet[Message]:
        messages.update(**update_fields)
        return Message.objects.filter(id__in=message_ids).select_related(
            *Message.DEFAULT_SELECT_RELATED
        )

    return messages, propagate


def generate_topic_history_from_db_rows(
    rows: list[tuple[str, int]],
    allow_empty_topic_name: bool,
) -> list[dict[str, Any]]:
    canonical_topic_names: dict[str, tuple[int, str]] = {}

    # Sort rows by max_message_id so that if a topic
    # has many different casings, we use the most
    # recent row.
    rows = sorted(rows, key=lambda tup: tup[1])

    for topic_name, max_message_id in rows:
        canonical_name = topic_name.lower()
        canonical_topic_names[canonical_name] = (max_message_id, topic_name)

    history = []
    for max_message_id, topic_name in canonical_topic_names.values():
        if topic_name == "" and not allow_empty_topic_name:
            topic_name = Message.EMPTY_TOPIC_FALLBACK_NAME
        history.append(
            dict(name=topic_name, max_id=max_message_id),
        )
    return sorted(history, key=lambda x: -x["max_id"])


def get_topic_history_for_public_stream(
    realm_id: int,
    recipient_id: int,
    allow_empty_topic_name: bool,
) -> list[dict[str, Any]]:
    cursor = connection.cursor()
    # Uses index: zerver_message_realm_recipient_subject
    # Note that this is *case-sensitive*, so that we can display the
    # most recently-used case (in generate_topic_history_from_db_rows)
    query = """
    SELECT
        "zerver_message"."subject" as topic,
        max("zerver_message".id) as max_message_id
    FROM "zerver_message"
    WHERE (
        "zerver_message"."realm_id" = %s AND
        "zerver_message"."recipient_id" = %s AND
        "zerver_message"."is_channel_message"
    )
    GROUP BY (
        "zerver_message"."subject"
    )
    ORDER BY max("zerver_message".id) DESC
    """
    cursor.execute(query, [realm_id, recipient_id])
    rows = cursor.fetchall()
    cursor.close()

    return generate_topic_history_from_db_rows(rows, allow_empty_topic_name)


def get_topic_history_for_stream(
    user_profile: UserProfile,
    recipient_id: int,
    public_history: bool,
    allow_empty_topic_name: bool,
) -> list[dict[str, Any]]:
    if public_history:
        return get_topic_history_for_public_stream(
            user_profile.realm_id,
            recipient_id,
            allow_empty_topic_name,
        )

    cursor = connection.cursor()
    # Uses index: zerver_message_realm_recipient_subject
    # Note that this is *case-sensitive*, so that we can display the
    # most recently-used case (in generate_topic_history_from_db_rows)
    query = """
    SELECT
        "zerver_message"."subject" as topic,
        max("zerver_message".id) as max_message_id
    FROM "zerver_message"
    INNER JOIN "zerver_usermessage" ON (
        "zerver_usermessage"."message_id" = "zerver_message"."id"
    )
    WHERE (
        "zerver_usermessage"."user_profile_id" = %s AND
        "zerver_message"."realm_id" = %s AND
        "zerver_message"."recipient_id" = %s AND
        "zerver_message"."is_channel_message"
    )
    GROUP BY (
        "zerver_message"."subject"
    )
    ORDER BY max("zerver_message".id) DESC
    """
    cursor.execute(query, [user_profile.id, user_profile.realm_id, recipient_id])
    rows = cursor.fetchall()
    cursor.close()

    return generate_topic_history_from_db_rows(rows, allow_empty_topic_name)


def get_topic_resolution_and_bare_name(stored_name: str) -> tuple[bool, str]:
    """
    Resolved topics are denoted only by a title change, not by a boolean toggle in a database column. This
    method inspects the topic name and returns a tuple of:

    - Whether the topic has been resolved
    - The topic name with the resolution prefix, if present in stored_name, removed
    """
    if stored_name.startswith(RESOLVED_TOPIC_PREFIX):
        return (True, stored_name.removeprefix(RESOLVED_TOPIC_PREFIX))

    return (False, stored_name)


def participants_for_topic(realm_id: int, recipient_id: int, topic_name: str) -> set[int]:
    """
    Users who either sent or reacted to the messages in the topic.
    The function is expensive for large numbers of messages in the topic.
    """
    messages = Message.objects.filter(
        # Uses index: zerver_message_realm_recipient_upper_subject
        realm_id=realm_id,
        recipient_id=recipient_id,
        subject__iexact=topic_name,
        is_channel_message=True,
    )
    participants = set(
        UserProfile.objects.filter(
            Q(id__in=Subquery(messages.values("sender_id")))
            | Q(
                id__in=Subquery(
                    Reaction.objects.filter(message__in=messages).values("user_profile_id")
                )
            )
        ).values_list("id", flat=True)
    )
    return participants


def maybe_rename_general_chat_to_empty_topic(topic_name: str) -> str:
    if topic_name == Message.EMPTY_TOPIC_FALLBACK_NAME:
        topic_name = ""
    return topic_name


def maybe_rename_no_topic_to_empty_topic(topic_name: str) -> str:
    if topic_name == "(no topic)":
        topic_name = ""
    return topic_name


def maybe_rename_empty_topic_to_general_chat(
    topic_name: str, is_channel_message: bool, allow_empty_topic_name: bool
) -> str:
    if is_channel_message and topic_name == "" and not allow_empty_topic_name:
        return Message.EMPTY_TOPIC_FALLBACK_NAME
    return topic_name


def get_topic_display_name(topic_name: str, language: str) -> str:
    if topic_name == "":
        with override_language(language):
            return _(Message.EMPTY_TOPIC_FALLBACK_NAME)
    return topic_name
```

--------------------------------------------------------------------------------

---[FILE: topic_link_util.py]---
Location: zulip-main/zerver/lib/topic_link_util.py

```python
# See the Zulip URL spec at https://zulip.com/api/zulip-urls
#
# Keep this synchronized with web/src/topic_link_util.ts

import re

from zerver.lib.url_encoding import encode_channel, encode_hash_component
from zerver.models.messages import Message

invalid_stream_topic_regex = re.compile(r"[`>*&\[\]]|(\$\$)")


def will_produce_broken_stream_topic_link(word: str) -> bool:
    return bool(invalid_stream_topic_regex.search(word))


escape_mapping = {
    "`": "&#96;",
    ">": "&gt;",
    "*": "&#42;",
    "&": "&amp;",
    "$$": "&#36;&#36;",
    "[": "&#91;",
    "]": "&#93;",
}


def escape_invalid_stream_topic_characters(text: str) -> str:
    return re.sub(
        invalid_stream_topic_regex,
        lambda match: escape_mapping.get(match.group(0), match.group(0)),
        text,
    )


def get_fallback_markdown_link(
    stream_id: int, stream_name: str, topic_name: str | None = None, message_id: int | None = None
) -> str:
    """
    Helper that should only be called by other methods in this file.

    Generates the vanilla markdown link syntax for a stream/topic/message link, as
    a fallback for cases where the nicer Zulip link syntax would not
    render properly due to special characters in the channel or topic name.
    """
    escape = escape_invalid_stream_topic_characters
    link = f"#narrow/channel/{encode_channel(stream_id, stream_name)}"
    text = f"#{escape(stream_name)}"
    if topic_name is not None:
        link += f"/topic/{encode_hash_component(topic_name)}"
        if topic_name == "":
            topic_name = Message.EMPTY_TOPIC_FALLBACK_NAME
        text += f" > {escape(topic_name)}"

    if message_id is not None:
        link += f"/near/{message_id}"
        text += " @ 💬"

    return f"[{text}]({link})"


def get_message_link_syntax(
    stream_id: int, stream_name: str, topic_name: str, message_id: int
) -> str:
    # If the stream/topic name is such that it will
    # generate an invalid #**stream>topic@message_id** syntax,
    # we revert to generating the normal markdown syntax for a link.
    if will_produce_broken_stream_topic_link(topic_name) or will_produce_broken_stream_topic_link(
        stream_name
    ):
        return get_fallback_markdown_link(stream_id, stream_name, topic_name, message_id)
    return f"#**{stream_name}>{topic_name}@{message_id}**"


def get_stream_topic_link_syntax(stream_id: int, stream_name: str, topic_name: str) -> str:
    # If the stream/topic name is such that it will generate an invalid #**stream>topic** syntax,
    # we revert to generating the normal markdown syntax for a link.
    if will_produce_broken_stream_topic_link(topic_name) or will_produce_broken_stream_topic_link(
        stream_name
    ):
        return get_fallback_markdown_link(stream_id, stream_name, topic_name)
    return f"#**{stream_name}>{topic_name}**"


def get_stream_link_syntax(stream_id: int, stream_name: str) -> str:
    # If the stream name is such that it will generate an invalid #**stream** syntax,
    # we revert to generating the normal markdown syntax for a link.
    if will_produce_broken_stream_topic_link(stream_name):
        return get_fallback_markdown_link(stream_id, stream_name)
    return f"#**{stream_name}**"
```

--------------------------------------------------------------------------------

---[FILE: topic_sqlalchemy.py]---
Location: zulip-main/zerver/lib/topic_sqlalchemy.py
Signals: SQLAlchemy

```python
from sqlalchemy.sql import ColumnElement, and_, column, func, literal, literal_column, select, table
from sqlalchemy.types import Boolean, Text

from zerver.lib.topic import RESOLVED_TOPIC_PREFIX
from zerver.models import UserTopic


def topic_match_sa(topic_name: str) -> ColumnElement[Boolean]:
    # _sa is short for SQLAlchemy, which we use mostly for
    # queries that search messages
    topic_cond = and_(
        func.upper(column("subject", Text)) == func.upper(literal(topic_name)),
        column("is_channel_message", Boolean),
    )
    return topic_cond


def get_resolved_topic_condition_sa() -> ColumnElement[Boolean]:
    resolved_topic_cond = and_(
        column("subject", Text).startswith(RESOLVED_TOPIC_PREFIX),
        column("is_channel_message", Boolean),
    )
    return resolved_topic_cond


def topic_column_sa() -> ColumnElement[Text]:
    return column("subject", Text)


def get_followed_topic_condition_sa(user_id: int) -> ColumnElement[Boolean]:
    follow_topic_cond = (
        select(1)
        .select_from(table("zerver_usertopic"))
        .where(
            and_(
                literal_column("zerver_usertopic.user_profile_id") == literal(user_id),
                literal_column("zerver_usertopic.visibility_policy")
                == literal(UserTopic.VisibilityPolicy.FOLLOWED),
                func.upper(literal_column("zerver_usertopic.topic_name"))
                == func.upper(literal_column("zerver_message.subject")),
                literal_column("zerver_message.is_channel_message", Boolean),
                literal_column("zerver_usertopic.recipient_id")
                == literal_column("zerver_message.recipient_id"),
            )
        )
    ).exists()
    return follow_topic_cond
```

--------------------------------------------------------------------------------

---[FILE: transfer.py]---
Location: zulip-main/zerver/lib/transfer.py
Signals: Django

```python
import logging
import os
from glob import glob

import magic
from django.conf import settings

from zerver.lib.avatar_hash import user_avatar_path
from zerver.lib.mime_types import guess_type
from zerver.lib.parallel import run_parallel
from zerver.lib.thumbnail import BadImageError
from zerver.lib.upload import upload_emoji_image, write_avatar_images
from zerver.lib.upload.s3 import S3UploadBackend, upload_content_to_s3
from zerver.models import Attachment, RealmEmoji, UserProfile

s3backend = S3UploadBackend()
mime_magic = magic.Magic(mime=True)


def transfer_uploads_to_s3(processes: int) -> None:
    # TODO: Eventually, we'll want to add realm icon and logo
    transfer_avatars_to_s3(processes)
    transfer_message_files_to_s3(processes)
    transfer_emoji_to_s3(processes)


def _transfer_avatar_to_s3(user: UserProfile) -> None:
    avatar_path = user_avatar_path(user)
    assert settings.LOCAL_UPLOADS_DIR is not None
    assert settings.LOCAL_AVATARS_DIR is not None
    file_path = os.path.join(settings.LOCAL_AVATARS_DIR, avatar_path)
    try:
        with open(file_path + ".original", "rb") as f:
            # We call write_avatar_images directly to walk around the
            # content-type checking in upload_avatar_image.  We don't
            # know the original file format, and we don't need to know
            # it because we never serve them directly.
            write_avatar_images(
                user_avatar_path(user, future=False),
                user,
                f.read(),
                content_type="application/octet-stream",
                backend=s3backend,
                future=False,
            )
            logging.info("Uploaded avatar for %s in realm %s", user.id, user.realm.name)
    except FileNotFoundError:
        pass


def transfer_avatars_to_s3(processes: int) -> None:
    run_parallel(_transfer_avatar_to_s3, UserProfile.objects.all(), processes)


def _transfer_message_files_to_s3(attachment: Attachment) -> None:
    assert settings.LOCAL_UPLOADS_DIR is not None
    assert settings.LOCAL_FILES_DIR is not None
    file_path = os.path.join(settings.LOCAL_FILES_DIR, attachment.path_id)
    try:
        with open(file_path, "rb") as f:
            guessed_type = guess_type(attachment.file_name)[0]
            upload_content_to_s3(
                s3backend.uploads_bucket,
                attachment.path_id,
                guessed_type,
                attachment.owner,
                f.read(),
                storage_class=settings.S3_UPLOADS_STORAGE_CLASS,
            )
            logging.info("Uploaded message file in path %s", file_path)
        thumbnail_dir = os.path.join(settings.LOCAL_FILES_DIR, "thumbnail", attachment.path_id)
        if os.path.isdir(thumbnail_dir):
            thumbnails = 0
            for thumbnail_path in glob(os.path.join(thumbnail_dir, "*")):
                with open(thumbnail_path, "rb") as f:
                    # This relies on the thumbnails having guessable
                    # content-type from their path, in order to avoid
                    # having to fetch the ImageAttachment inside the
                    # ProcessPoolExecutor.  We also have no clean way
                    # to prefetch those rows via select_related in the
                    # outer query, as they match on `path_id`, which
                    # is not supported as a foreign key.
                    guessed_type = guess_type(thumbnail_path)[0]
                    upload_content_to_s3(
                        s3backend.uploads_bucket,
                        os.path.join(
                            "thumbnail", attachment.path_id, os.path.basename(thumbnail_path)
                        ),
                        guessed_type,
                        None,
                        f.read(),
                        storage_class=settings.S3_UPLOADS_STORAGE_CLASS,
                    )
                thumbnails += 1
            logging.info(
                "Uploaded %d thumbnails into %s",
                thumbnails,
                os.path.join("thumbnail", attachment.path_id),
            )
    except FileNotFoundError:  # nocoverage
        pass


def transfer_message_files_to_s3(processes: int) -> None:
    run_parallel(_transfer_message_files_to_s3, Attachment.objects.all(), processes)


def _transfer_emoji_to_s3(realm_emoji: RealmEmoji) -> None:
    if not realm_emoji.file_name or not realm_emoji.author:
        return  # nocoverage
    emoji_path = RealmEmoji.PATH_ID_TEMPLATE.format(
        realm_id=realm_emoji.realm.id,
        emoji_file_name=realm_emoji.file_name,
    )
    assert settings.LOCAL_UPLOADS_DIR is not None
    assert settings.LOCAL_AVATARS_DIR is not None
    content_type = guess_type(emoji_path)[0]
    emoji_path = os.path.join(settings.LOCAL_AVATARS_DIR, emoji_path) + ".original"
    if content_type is None:  # nocoverage
        # This should not be possible after zerver/migrations/0553_copy_emoji_images.py
        logging.error("Emoji %d has no recognizable file extension", realm_emoji.id)
        return
    try:
        with open(emoji_path, "rb") as f:
            upload_emoji_image(
                f, realm_emoji.file_name, realm_emoji.author, content_type, backend=s3backend
            )
            logging.info("Uploaded emoji file in path %s", emoji_path)
    except FileNotFoundError:  # nocoverage
        logging.error("Emoji %d could not be loaded from local disk", realm_emoji.id)
    except BadImageError as e:  # nocoverage
        # This should not be possible after zerver/migrations/0553_copy_emoji_images.py
        logging.error("Emoji %d is invalid: %s", realm_emoji.id, e)


def transfer_emoji_to_s3(processes: int) -> None:
    run_parallel(_transfer_emoji_to_s3, RealmEmoji.objects.filter(), processes)
```

--------------------------------------------------------------------------------

````
