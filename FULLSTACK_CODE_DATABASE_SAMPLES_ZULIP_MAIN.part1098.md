---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1098
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1098 of 1290)

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

---[FILE: message_edit.py]---
Location: zulip-main/zerver/views/message_edit.py
Signals: Django, Pydantic

```python
from datetime import timedelta
from typing import Literal

import orjson
from django.contrib.auth.models import AnonymousUser
from django.db import IntegrityError, transaction
from django.http import HttpRequest, HttpResponse
from django.utils.timezone import now as timezone_now
from django.utils.translation import gettext as _
from pydantic import Json, NonNegativeInt

from zerver.actions.message_delete import do_delete_messages
from zerver.actions.message_edit import check_update_message
from zerver.context_processors import get_valid_realm_from_request
from zerver.lib.exceptions import JsonableError
from zerver.lib.html_diff import highlight_html_differences
from zerver.lib.message import (
    access_message,
    access_message_and_usermessage,
    access_web_public_message,
    messages_for_ids,
    visible_edit_history_for_message,
)
from zerver.lib.request import RequestNotes
from zerver.lib.response import json_success
from zerver.lib.streams import can_delete_any_message_in_channel, can_delete_own_message_in_channel
from zerver.lib.timestamp import datetime_to_timestamp
from zerver.lib.topic import maybe_rename_empty_topic_to_general_chat
from zerver.lib.typed_endpoint import OptionalTopic, PathOnly, typed_endpoint
from zerver.lib.types import EditHistoryEvent, FormattedEditHistoryEvent
from zerver.models import Message, UserProfile
from zerver.models.realms import MessageEditHistoryVisibilityPolicyEnum
from zerver.models.streams import Stream, get_stream_by_id_in_realm


def fill_edit_history_entries(
    raw_edit_history: list[EditHistoryEvent],
    message: Message,
    allow_empty_topic_name: bool,
) -> list[FormattedEditHistoryEvent]:
    """
    This fills out the message edit history entries from the database
    to have the current topic + content as of that time, plus data on
    whatever changed. This makes it much simpler to do future
    processing.
    """
    prev_content = message.content
    prev_rendered_content = message.rendered_content
    is_channel_message = message.is_channel_message
    if is_channel_message:
        prev_topic_name = maybe_rename_empty_topic_to_general_chat(
            message.topic_name(), is_channel_message, allow_empty_topic_name
        )
    else:
        prev_topic_name = ""

    # Make sure that the latest entry in the history corresponds to the
    # message's last edit time
    if len(raw_edit_history) > 0:
        assert message.last_edit_time is not None
        assert datetime_to_timestamp(message.last_edit_time) == raw_edit_history[0]["timestamp"]

    formatted_edit_history: list[FormattedEditHistoryEvent] = []
    for edit_history_event in raw_edit_history:
        formatted_entry: FormattedEditHistoryEvent = {
            "content": prev_content,
            "rendered_content": prev_rendered_content,
            "timestamp": edit_history_event["timestamp"],
            "topic": prev_topic_name,
            "user_id": edit_history_event["user_id"],
        }

        if "prev_topic" in edit_history_event:
            prev_topic_name = maybe_rename_empty_topic_to_general_chat(
                edit_history_event["prev_topic"], is_channel_message, allow_empty_topic_name
            )
            formatted_entry["prev_topic"] = prev_topic_name

        # Fill current values for content/rendered_content.
        if "prev_content" in edit_history_event:
            formatted_entry["prev_content"] = edit_history_event["prev_content"]
            prev_content = formatted_entry["prev_content"]
            formatted_entry["prev_rendered_content"] = edit_history_event["prev_rendered_content"]
            prev_rendered_content = formatted_entry["prev_rendered_content"]
            assert prev_rendered_content is not None
            rendered_content = formatted_entry["rendered_content"]
            assert rendered_content is not None
            formatted_entry["content_html_diff"] = highlight_html_differences(
                prev_rendered_content, rendered_content, message.id
            )

        if "prev_stream" in edit_history_event:
            formatted_entry["prev_stream"] = edit_history_event["prev_stream"]
            formatted_entry["stream"] = edit_history_event["stream"]

        formatted_edit_history.append(formatted_entry)

    initial_message_history: FormattedEditHistoryEvent = {
        "content": prev_content,
        "rendered_content": prev_rendered_content,
        "timestamp": datetime_to_timestamp(message.date_sent),
        "topic": prev_topic_name,
        "user_id": message.sender_id,
    }

    formatted_edit_history.append(initial_message_history)

    return formatted_edit_history


@typed_endpoint
def get_message_edit_history(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    allow_empty_topic_name: Json[bool] = False,
    message_id: PathOnly[NonNegativeInt],
) -> HttpResponse:
    user_realm_message_edit_history_visibility_policy = (
        user_profile.realm.message_edit_history_visibility_policy
    )
    if (
        user_realm_message_edit_history_visibility_policy
        == MessageEditHistoryVisibilityPolicyEnum.none.value
    ):
        raise JsonableError(_("Message edit history is disabled in this organization"))
    message = access_message(user_profile, message_id, is_modifying_message=False)

    # Extract the message edit history from the message
    if message.edit_history is not None:
        raw_edit_history = orjson.loads(message.edit_history)
    else:
        raw_edit_history = []

    # Fill in all the extra data that will make it usable
    message_edit_history = fill_edit_history_entries(
        raw_edit_history, message, allow_empty_topic_name
    )

    visible_message_edit_history = visible_edit_history_for_message(
        user_realm_message_edit_history_visibility_policy, message_edit_history
    )

    return json_success(
        request, data={"message_history": list(reversed(visible_message_edit_history))}
    )


@typed_endpoint
def update_message_backend(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    content: str | None = None,
    message_id: PathOnly[NonNegativeInt],
    prev_content_sha256: str | None = None,
    propagate_mode: Literal["change_later", "change_one", "change_all"] = "change_one",
    send_notification_to_new_thread: Json[bool] = True,
    send_notification_to_old_thread: Json[bool] = False,
    stream_id: Json[NonNegativeInt] | None = None,
    topic_name: OptionalTopic = None,
) -> HttpResponse:
    updated_message_result = check_update_message(
        user_profile,
        message_id,
        stream_id,
        topic_name,
        propagate_mode,
        send_notification_to_old_thread,
        send_notification_to_new_thread,
        content,
        prev_content_sha256,
    )

    # Include the number of messages changed in the logs
    log_data = RequestNotes.get_notes(request).log_data
    assert log_data is not None
    log_data["extra"] = f"[{updated_message_result.changed_message_count}]"

    return json_success(request, data={"detached_uploads": updated_message_result.detached_uploads})


def validate_can_delete_message(user_profile: UserProfile, message: Message) -> None:
    if user_profile.can_delete_any_message():
        return

    stream: Stream | None = None
    if message.is_channel_message:
        stream = get_stream_by_id_in_realm(message.recipient.type_id, user_profile.realm)
        if can_delete_any_message_in_channel(user_profile, stream):
            return

    if message.sender != user_profile and message.sender.bot_owner_id != user_profile.id:
        # Users can only delete messages sent by them or by their bots.
        raise JsonableError(_("You don't have permission to delete this message"))

    if not user_profile.can_delete_own_message():
        if not message.is_channel_message:
            raise JsonableError(_("You don't have permission to delete this message"))

        assert stream is not None
        # For channel messages, users are required to have either the
        # channel-level permission or the organization-level permission to delete
        # their own messages.
        if not can_delete_own_message_in_channel(user_profile, stream):
            raise JsonableError(_("You don't have permission to delete this message"))

    deadline_seconds: int | None = user_profile.realm.message_content_delete_limit_seconds
    if deadline_seconds is None:
        # None means no time limit to delete message
        return
    if (timezone_now() - message.date_sent) > timedelta(seconds=deadline_seconds):
        # User cannot delete message after deadline time of realm
        raise JsonableError(_("The time limit for deleting this message has passed"))
    return


@transaction.atomic(durable=True)
@typed_endpoint
def delete_message_backend(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    message_id: PathOnly[NonNegativeInt],
) -> HttpResponse:
    # We lock the `Message` object to ensure that any transactions modifying the `Message` object
    # concurrently are serialized properly with deleting the message; this prevents a deadlock
    # that would otherwise happen because of the other transaction holding a lock on the `Message`
    # row.
    message = access_message(user_profile, message_id, lock_message=True, is_modifying_message=True)
    validate_can_delete_message(user_profile, message)
    try:
        do_delete_messages(user_profile.realm, [message], acting_user=user_profile)
    except (Message.DoesNotExist, IntegrityError):
        raise JsonableError(_("Message already deleted"))
    return json_success(request)


@typed_endpoint
def json_fetch_raw_message(
    request: HttpRequest,
    maybe_user_profile: UserProfile | AnonymousUser,
    *,
    allow_empty_topic_name: Json[bool] = False,
    apply_markdown: Json[bool] = True,
    message_id: PathOnly[NonNegativeInt],
) -> HttpResponse:
    if not maybe_user_profile.is_authenticated:
        realm = get_valid_realm_from_request(request)
        message = access_web_public_message(realm, message_id)
        user_profile = None
    else:
        (message, user_message) = access_message_and_usermessage(
            maybe_user_profile, message_id, is_modifying_message=False
        )
        user_profile = maybe_user_profile

    flags = ["read"]
    if not maybe_user_profile.is_authenticated:
        message_edit_history_visibility_policy = realm.message_edit_history_visibility_policy
    else:
        if user_message:
            flags = user_message.flags_list()
        else:
            flags = ["read", "historical"]
        message_edit_history_visibility_policy = (
            maybe_user_profile.realm.message_edit_history_visibility_policy
        )

    # Security note: It's important that we call this only with a
    # message already fetched via `access_message` type methods,
    # as we do above.
    message_dict_list = messages_for_ids(
        message_ids=[message.id],
        user_message_flags={message_id: flags},
        search_fields={},
        apply_markdown=apply_markdown,
        client_gravatar=True,
        message_edit_history_visibility_policy=message_edit_history_visibility_policy,
        allow_empty_topic_name=allow_empty_topic_name,
        user_profile=user_profile,
        realm=message.realm,
    )
    response = dict(
        message=message_dict_list[0],
        # raw_content is deprecated; we will need to wait until
        # clients have been fully migrated to using the modern API
        # before removing this, probably in 2023.
        raw_content=message.content,
    )
    return json_success(request, response)
```

--------------------------------------------------------------------------------

---[FILE: message_fetch.py]---
Location: zulip-main/zerver/views/message_fetch.py
Signals: Django, Pydantic, SQLAlchemy

```python
from collections.abc import Iterable
from typing import Annotated

from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.db import connection, transaction
from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _
from pydantic import Json, NonNegativeInt
from sqlalchemy.sql import column, func
from sqlalchemy.types import Integer, Text

from zerver.context_processors import get_valid_realm_from_request
from zerver.lib.exceptions import (
    IncompatibleParametersError,
    JsonableError,
    MissingAuthenticationError,
)
from zerver.lib.message import get_first_visible_message_id, messages_for_ids
from zerver.lib.narrow import (
    NarrowParameter,
    add_narrow_conditions,
    clean_narrow_for_message_fetch,
    fetch_messages,
    get_base_query_for_search,
    is_spectator_compatible,
    is_web_public_narrow,
    parse_anchor_value,
    update_narrow_terms_containing_empty_topic_fallback_name,
)
from zerver.lib.request import RequestNotes
from zerver.lib.response import json_success
from zerver.lib.sqlalchemy_utils import get_sqlalchemy_connection
from zerver.lib.topic import MATCH_TOPIC
from zerver.lib.topic_sqlalchemy import topic_column_sa
from zerver.lib.typed_endpoint import ApiParamConfig, typed_endpoint
from zerver.models import UserMessage, UserProfile

MAX_MESSAGES_PER_FETCH = 5000


def highlight_string(text: str, locs: Iterable[tuple[int, int]]) -> str:
    highlight_start = '<span class="highlight">'
    highlight_stop = "</span>"
    pos = 0
    result = ""
    in_tag = False

    for loc in locs:
        (offset, length) = loc

        prefix_start = pos
        prefix_end = offset
        match_start = offset
        match_end = offset + length

        prefix = text[prefix_start:prefix_end]
        match = text[match_start:match_end]

        for character in prefix + match:
            if character == "<":
                in_tag = True
            elif character == ">":
                in_tag = False
        if in_tag:
            result += prefix
            result += match
        else:
            result += prefix
            result += highlight_start
            result += match
            result += highlight_stop
        pos = match_end

    result += text[pos:]
    return result


def get_search_fields(
    rendered_content: str,
    escaped_topic_name: str,
    content_matches: Iterable[tuple[int, int]],
    topic_matches: Iterable[tuple[int, int]],
) -> dict[str, str]:
    return {
        "match_content": highlight_string(rendered_content, content_matches),
        MATCH_TOPIC: highlight_string(escaped_topic_name, topic_matches),
    }


def clean_narrow_for_web_public_api(
    narrow: list[NarrowParameter] | None,
) -> list[NarrowParameter] | None:
    if narrow is None:
        return None

    # Remove {'operator': 'in', 'operand': 'home', 'negated': False} from narrow.
    # This is to allow spectators to access all messages. The narrow should still pass
    # is_web_public_narrow check after this change.
    return [
        term
        for term in narrow
        if not (term.operator == "in" and term.operand == "home" and not term.negated)
    ]


@typed_endpoint
def get_messages_backend(
    request: HttpRequest,
    maybe_user_profile: UserProfile | AnonymousUser,
    *,
    allow_empty_topic_name: Json[bool] = False,
    anchor_val: Annotated[str | None, ApiParamConfig("anchor")] = None,
    apply_markdown: Json[bool] = True,
    client_gravatar: Json[bool] = True,
    client_requested_message_ids: Annotated[
        Json[list[NonNegativeInt] | None], ApiParamConfig("message_ids")
    ] = None,
    include_anchor: Json[bool] = True,
    narrow: Json[list[NarrowParameter] | None] = None,
    num_after: Json[NonNegativeInt] = 0,
    num_before: Json[NonNegativeInt] = 0,
    use_first_unread_anchor_val: Annotated[
        Json[bool], ApiParamConfig("use_first_unread_anchor")
    ] = False,
) -> HttpResponse:
    # User has to either provide message_ids or both num_before and num_after.
    if (
        num_before or num_after or anchor_val is not None or use_first_unread_anchor_val
    ) and client_requested_message_ids is not None:
        raise IncompatibleParametersError(
            [
                "num_before",
                "num_after",
                "anchor",
                "message_ids",
                "include_anchor",
                "use_first_unread_anchor",
            ]
        )
    elif client_requested_message_ids is not None:
        include_anchor = False

    anchor = None
    if client_requested_message_ids is None:
        anchor = parse_anchor_value(anchor_val, use_first_unread_anchor_val)

    realm = get_valid_realm_from_request(request)
    narrow = clean_narrow_for_message_fetch(narrow, realm, maybe_user_profile)

    num_of_messages_requested = num_before + num_after
    if client_requested_message_ids is not None:
        num_of_messages_requested = len(client_requested_message_ids)

    if num_of_messages_requested > MAX_MESSAGES_PER_FETCH:
        raise JsonableError(
            _("Too many messages requested (maximum {max_messages}).").format(
                max_messages=MAX_MESSAGES_PER_FETCH,
            )
        )
    if num_before > 0 and num_after > 0 and not include_anchor:
        raise JsonableError(_("The anchor can only be excluded at an end of the range"))

    if not maybe_user_profile.is_authenticated:
        # If user is not authenticated, clients must include
        # `streams:web-public` in their narrow query to indicate this
        # is a web-public query.  This helps differentiate between
        # cases of web-public queries (where we should return the
        # web-public results only) and clients with buggy
        # authentication code (where we should return an auth error).
        #
        # GetOldMessagesTest.test_unauthenticated_* tests ensure
        # that we are not leaking any secure data (direct messages and
        # non-web-public stream messages) via this path.
        if not realm.allow_web_public_streams_access():
            raise MissingAuthenticationError
        narrow = clean_narrow_for_web_public_api(narrow)
        if not is_web_public_narrow(narrow):
            raise MissingAuthenticationError
        assert narrow is not None
        if not is_spectator_compatible(narrow):
            raise MissingAuthenticationError

        # We use None to indicate unauthenticated requests as it's more
        # readable than using AnonymousUser, and the lack of Django
        # stubs means that mypy can't check AnonymousUser well.
        user_profile: UserProfile | None = None
        is_web_public_query = True
    else:
        assert isinstance(maybe_user_profile, UserProfile)
        user_profile = maybe_user_profile
        assert user_profile is not None
        is_web_public_query = False

    assert realm is not None

    if is_web_public_query:
        # client_gravatar here is just the user-requested value. "finalize_payload" function
        # is responsible for sending avatar_url based on each individual sender's
        # email_address_visibility setting.
        client_gravatar = False

    if narrow is not None:
        # Add some metadata to our logging data for narrows
        verbose_operators = []
        for term in narrow:
            if term.operator == "is":
                verbose_operators.append("is:" + term.operand)
            else:
                verbose_operators.append(term.operator)
        log_data = RequestNotes.get_notes(request).log_data
        assert log_data is not None
        log_data["extra"] = "[{}]".format(",".join(verbose_operators))

    with transaction.atomic(durable=True):
        # We're about to perform a search, and then get results from
        # it; this is done across multiple queries.  To prevent race
        # conditions, we want the messages returned to be consistent
        # with the version of the messages that was searched, to
        # prevent changes which happened between them from leaking to
        # clients who should not be able to see the new values, and
        # when messages are deleted in between.  We set up
        # repeatable-read isolation for this transaction, so that we
        # prevent both phantom reads and non-repeatable reads.
        #
        # In a read-only repeatable-read transaction, it is not
        # possible to encounter deadlocks or need retries due to
        # serialization errors.
        #
        # You can only set the isolation level before any queries in
        # the transaction, meaning it must be the top-most
        # transaction, which durable=True establishes.  Except in
        # tests, where durable=True is a lie, because there is an
        # outer transaction for each test.  We thus skip this command
        # in tests, since it would fail.
        if not settings.TEST_SUITE:  # nocoverage
            cursor = connection.cursor()
            cursor.execute("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY")

        query_info = fetch_messages(
            narrow=narrow,
            user_profile=user_profile,
            realm=realm,
            is_web_public_query=is_web_public_query,
            anchor=anchor,
            include_anchor=include_anchor,
            num_before=num_before,
            num_after=num_after,
            client_requested_message_ids=client_requested_message_ids,
        )

        anchor = query_info.anchor
        include_history = query_info.include_history
        is_search = query_info.is_search
        rows = query_info.rows

        # The following is a little messy, but ensures that the code paths
        # are similar regardless of the value of include_history.  The
        # 'user_messages' dictionary maps each message to the user's
        # UserMessage object for that message, which we will attach to the
        # rendered message dict before returning it.  We attempt to
        # bulk-fetch rendered message dicts from remote cache using the
        # 'messages' list.
        result_message_ids: list[int] = []
        user_message_flags: dict[int, list[str]] = {}
        if is_web_public_query:
            # For spectators, we treat all historical messages as read.
            for row in rows:
                message_id = row[0]
                result_message_ids.append(message_id)
                user_message_flags[message_id] = ["read"]
        elif include_history:
            assert user_profile is not None
            result_message_ids = [row[0] for row in rows]

            # TODO: This could be done with an outer join instead of two queries
            um_rows = UserMessage.objects.filter(
                user_profile=user_profile, message_id__in=result_message_ids
            )
            user_message_flags = {um.message_id: um.flags_list() for um in um_rows}

            for message_id in result_message_ids:
                if message_id not in user_message_flags:
                    user_message_flags[message_id] = ["read", "historical"]
        else:
            for row in rows:
                message_id = row[0]
                flags = row[1]
                user_message_flags[message_id] = UserMessage.flags_list_for_flags(flags)
                result_message_ids.append(message_id)

        search_fields: dict[int, dict[str, str]] = {}
        if is_search:
            for row in rows:
                message_id = row[0]
                (escaped_topic_name, rendered_content, content_matches, topic_matches) = row[-4:]
                search_fields[message_id] = get_search_fields(
                    rendered_content, escaped_topic_name, content_matches, topic_matches
                )

        message_list = messages_for_ids(
            message_ids=result_message_ids,
            user_message_flags=user_message_flags,
            search_fields=search_fields,
            apply_markdown=apply_markdown,
            client_gravatar=client_gravatar,
            allow_empty_topic_name=allow_empty_topic_name,
            message_edit_history_visibility_policy=realm.message_edit_history_visibility_policy,
            user_profile=user_profile,
            realm=realm,
        )

    if client_requested_message_ids is not None:
        ret = dict(
            messages=message_list,
            result="success",
            msg="",
            history_limited=query_info.history_limited,
            found_anchor=False,
            found_oldest=False,
            found_newest=False,
        )
    else:
        ret = dict(
            messages=message_list,
            result="success",
            msg="",
            found_anchor=query_info.found_anchor,
            found_oldest=query_info.found_oldest,
            found_newest=query_info.found_newest,
            history_limited=query_info.history_limited,
            anchor=anchor,
        )

    return json_success(request, data=ret)


@typed_endpoint
def messages_in_narrow_backend(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    msg_ids: Json[list[int]],
    narrow: Json[list[NarrowParameter]],
) -> HttpResponse:
    first_visible_message_id = get_first_visible_message_id(user_profile.realm)
    msg_ids = [message_id for message_id in msg_ids if message_id >= first_visible_message_id]
    # This query is limited to messages the user has access to because they
    # actually received them, as reflected in `zerver_usermessage`.
    query, inner_msg_id_col = get_base_query_for_search(
        user_profile.realm_id, user_profile, need_user_message=True
    )
    query = query.where(column("message_id", Integer).in_(msg_ids))

    updated_narrow = update_narrow_terms_containing_empty_topic_fallback_name(narrow)
    query, is_search, _is_dm_narrow = add_narrow_conditions(
        user_profile=user_profile,
        inner_msg_id_col=inner_msg_id_col,
        query=query,
        narrow=updated_narrow,
        is_web_public_query=False,
        realm=user_profile.realm,
    )

    if not is_search:
        # `add_narrow_conditions` adds the following columns only if narrow has search operands.
        query = query.add_columns(
            func.escape_html(topic_column_sa(), type_=Text).label("escaped_topic_name"),
            column("rendered_content", Text),
        )

    search_fields = {}
    with get_sqlalchemy_connection() as sa_conn:
        for row in sa_conn.execute(query).mappings():
            message_id = row["message_id"]
            escaped_topic_name: str = row["escaped_topic_name"]
            rendered_content: str = row["rendered_content"]
            content_matches = row.get("content_matches", [])
            topic_matches = row.get("topic_matches", [])
            search_fields[str(message_id)] = get_search_fields(
                rendered_content,
                escaped_topic_name,
                content_matches,
                topic_matches,
            )

    return json_success(request, data={"messages": search_fields})
```

--------------------------------------------------------------------------------

---[FILE: message_flags.py]---
Location: zulip-main/zerver/views/message_flags.py
Signals: Django, Pydantic

```python
from typing import Annotated

from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _
from pydantic import Json, NonNegativeInt

from zerver.actions.message_flags import (
    do_mark_all_as_read,
    do_mark_stream_messages_as_read,
    do_update_message_flags,
)
from zerver.lib.exceptions import JsonableError
from zerver.lib.narrow import (
    NarrowParameter,
    fetch_messages,
    parse_anchor_value,
    update_narrow_terms_containing_empty_topic_fallback_name,
)
from zerver.lib.request import RequestNotes
from zerver.lib.response import json_success
from zerver.lib.streams import access_stream_by_id
from zerver.lib.topic import maybe_rename_general_chat_to_empty_topic, user_message_exists_for_topic
from zerver.lib.typed_endpoint import (
    ApiParamConfig,
    typed_endpoint,
    typed_endpoint_without_parameters,
)
from zerver.models import UserActivity, UserProfile


def get_latest_update_message_flag_activity(user_profile: UserProfile) -> UserActivity | None:
    return (
        UserActivity.objects.filter(
            user_profile=user_profile,
            query__in=["update_message_flags", "update_message_flags_for_narrow"],
        )
        .order_by("last_visit")
        .last()
    )


# NOTE: If this function name is changed, add the new name to the
# query in get_latest_update_message_flag_activity
@typed_endpoint
def update_message_flags(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    flag: str,
    messages: Json[list[int]],
    operation: Annotated[str, ApiParamConfig("op")],
) -> HttpResponse:
    request_notes = RequestNotes.get_notes(request)
    assert request_notes.log_data is not None

    (count, ignored_because_not_subscribed_channels) = do_update_message_flags(
        user_profile, operation, flag, messages
    )

    target_count_str = str(len(messages))
    log_data_str = f"[{operation} {flag}/{target_count_str}] actually {count}"
    request_notes.log_data["extra"] = log_data_str

    return json_success(
        request,
        data={
            "messages": messages,  # Useless, but included for backwards compatibility.
            "ignored_because_not_subscribed_channels": ignored_because_not_subscribed_channels,
        },
    )


MAX_MESSAGES_PER_UPDATE = 5000


# NOTE: If this function name is changed, add the new name to the
# query in get_latest_update_message_flag_activity
@typed_endpoint
def update_message_flags_for_narrow(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    anchor_val: Annotated[str, ApiParamConfig("anchor")],
    flag: str,
    include_anchor: Json[bool] = True,
    narrow: Json[list[NarrowParameter] | None],
    num_after: Json[NonNegativeInt],
    num_before: Json[NonNegativeInt],
    operation: Annotated[str, ApiParamConfig("op")],
) -> HttpResponse:
    anchor = parse_anchor_value(anchor_val, use_first_unread_anchor=False)

    if num_before > 0 and num_after > 0 and not include_anchor:
        raise JsonableError(_("The anchor can only be excluded at an end of the range"))

    # Clamp such that num_before + num_after <= MAX_MESSAGES_PER_UPDATE.
    num_before = min(
        num_before, max(MAX_MESSAGES_PER_UPDATE - num_after, MAX_MESSAGES_PER_UPDATE // 2)
    )
    num_after = min(num_after, MAX_MESSAGES_PER_UPDATE - num_before)

    narrow = update_narrow_terms_containing_empty_topic_fallback_name(narrow)

    query_info = fetch_messages(
        narrow=narrow,
        user_profile=user_profile,
        realm=user_profile.realm,
        is_web_public_query=False,
        anchor=anchor,
        include_anchor=include_anchor,
        num_before=num_before,
        num_after=num_after,
    )

    messages = [row[0] for row in query_info.rows]
    (updated_count, ignored_because_not_subscribed_channels) = do_update_message_flags(
        user_profile, operation, flag, messages
    )

    return json_success(
        request,
        data={
            "processed_count": len(messages),
            "updated_count": updated_count,
            "first_processed_id": messages[0] if messages else None,
            "last_processed_id": messages[-1] if messages else None,
            "found_oldest": query_info.found_oldest,
            "found_newest": query_info.found_newest,
            "ignored_because_not_subscribed_channels": ignored_because_not_subscribed_channels,
        },
    )


@typed_endpoint_without_parameters
def mark_all_as_read(request: HttpRequest, user_profile: UserProfile) -> HttpResponse:
    request_notes = RequestNotes.get_notes(request)
    count = do_mark_all_as_read(user_profile, timeout=50)
    if count is None:
        return json_success(request, data={"complete": False})

    log_data_str = f"[{count} updated]"
    assert request_notes.log_data is not None
    request_notes.log_data["extra"] = log_data_str

    return json_success(request, data={"complete": True})


@typed_endpoint
def mark_stream_as_read(
    request: HttpRequest, user_profile: UserProfile, *, stream_id: Json[int]
) -> HttpResponse:
    stream, _sub = access_stream_by_id(user_profile, stream_id)
    assert stream.recipient_id is not None
    count = do_mark_stream_messages_as_read(user_profile, stream.recipient_id)

    log_data_str = f"[{count} updated]"
    log_data = RequestNotes.get_notes(request).log_data
    assert log_data is not None
    log_data["extra"] = log_data_str

    return json_success(request)


@typed_endpoint
def mark_topic_as_read(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    topic_name: str,
    stream_id: Json[int],
) -> HttpResponse:
    stream, _sub = access_stream_by_id(user_profile, stream_id)
    assert stream.recipient_id is not None

    if topic_name:
        topic_name = maybe_rename_general_chat_to_empty_topic(topic_name)
        topic_exists = user_message_exists_for_topic(
            user_profile=user_profile,
            recipient_id=stream.recipient_id,
            topic_name=topic_name,
        )

        if not topic_exists:
            raise JsonableError(_("No such topic '{topic}'").format(topic=topic_name))

    count = do_mark_stream_messages_as_read(user_profile, stream.recipient_id, topic_name)

    log_data_str = f"[{count} updated]"
    log_data = RequestNotes.get_notes(request).log_data
    assert log_data is not None
    log_data["extra"] = log_data_str

    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: message_report.py]---
Location: zulip-main/zerver/views/message_report.py
Signals: Django, Pydantic

```python
from typing import Annotated

from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _
from django.utils.translation import override as override_language
from pydantic import StringConstraints

from zerver.lib.exceptions import JsonableError
from zerver.lib.message import access_message
from zerver.lib.message_report import send_message_report
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import typed_endpoint
from zerver.lib.typed_endpoint_validators import check_string_in_validator
from zerver.models import Realm, UserProfile


@typed_endpoint
def report_message_backend(
    request: HttpRequest,
    user_profile: UserProfile,
    message_id: int,
    *,
    description: Annotated[
        str, StringConstraints(max_length=Realm.MAX_REPORT_MESSAGE_EXPLANATION_LENGTH)
    ] = "",
    report_type: Annotated[str, check_string_in_validator(Realm.REPORT_MESSAGE_REASONS)],
) -> HttpResponse:
    if report_type == "other" and description == "":
        raise JsonableError(_("An explanation is required."))

    if user_profile.realm.moderation_request_channel is None:
        raise JsonableError(_("Message reporting is not enabled in this organization."))

    reported_message = access_message(user_profile, message_id, is_modifying_message=False)
    with override_language(user_profile.realm.default_language):
        send_message_report(
            user_profile,
            user_profile.realm,
            reported_message,
            report_type,
            description,
        )

    return json_success(request)
```

--------------------------------------------------------------------------------

````
