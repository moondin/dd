---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 916
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 916 of 1290)

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

---[FILE: user_message.py]---
Location: zulip-main/zerver/lib/user_message.py
Signals: Django

```python
from django.db import connection
from psycopg2.extras import execute_values
from psycopg2.sql import SQL, Composable, Literal

from zerver.models import UserMessage


class UserMessageLite:
    """
    The Django ORM is too slow for bulk operations.  This class
    is optimized for the simple use case of inserting a bunch of
    rows into zerver_usermessage.
    """

    def __init__(self, user_profile_id: int, message_id: int, flags: int) -> None:
        self.user_profile_id = user_profile_id
        self.message_id = message_id
        self.flags = flags

    def flags_list(self) -> list[str]:
        return UserMessage.flags_list_for_flags(self.flags)


DEFAULT_HISTORICAL_FLAGS = UserMessage.flags.historical | UserMessage.flags.read


def create_historical_user_messages(
    *,
    user_id: int,
    message_ids: list[int],
    flagattr: int | None = None,
    flag_target: int | None = None,
) -> None:
    # Users can see and interact with messages sent to streams with
    # public history for which they do not have a UserMessage because
    # they were not a subscriber at the time the message was sent.
    # In order to add emoji reactions or mutate message flags for
    # those messages, we create UserMessage objects for those messages;
    # these have the special historical flag which keeps track of the
    # fact that the user did not receive the message at the time it was sent.
    if flagattr is not None and flag_target is not None:
        conflict = SQL(
            "(user_profile_id, message_id) DO UPDATE SET flags = excluded.flags & ~ {mask} | {attr}"
        ).format(mask=Literal(flagattr), attr=Literal(flag_target))
        flags = (DEFAULT_HISTORICAL_FLAGS & ~flagattr) | flag_target
    else:
        conflict = None
        flags = DEFAULT_HISTORICAL_FLAGS
    bulk_insert_all_ums([user_id], message_ids, flags, conflict)


def bulk_insert_ums(ums: list[UserMessageLite]) -> None:
    """
    Doing bulk inserts this way is much faster than using Django,
    since we don't have any ORM overhead.  Profiling with 1000
    users shows a speedup of 0.436 -> 0.027 seconds, so we're
    talking about a 15x speedup.
    """
    if not ums:
        return

    vals = [(um.user_profile_id, um.message_id, um.flags) for um in ums]
    query = SQL(
        """
        INSERT into
            zerver_usermessage (user_profile_id, message_id, flags)
        VALUES %s
        ON CONFLICT DO NOTHING
    """
    )

    with connection.cursor() as cursor:
        execute_values(cursor.cursor, query, vals)


def bulk_insert_all_ums(
    user_ids: list[int], message_ids: list[int], flags: int, conflict: Composable | None = None
) -> None:
    if not user_ids or not message_ids:
        return

    query = SQL(
        """
        INSERT INTO zerver_usermessage (user_profile_id, message_id, flags)
        SELECT user_profile_id, message_id, %s AS flags
          FROM UNNEST(%s) user_profile_id
          CROSS JOIN UNNEST(%s) message_id
        ON CONFLICT {conflict}
        """
    ).format(conflict=conflict if conflict is not None else SQL("DO NOTHING"))

    with connection.cursor() as cursor:
        cursor.execute(query, [flags, user_ids, message_ids])
```

--------------------------------------------------------------------------------

---[FILE: user_status.py]---
Location: zulip-main/zerver/lib/user_status.py
Signals: Django

```python
from typing import TypedDict

from django.db.models import Q
from django.utils.timezone import now as timezone_now

from zerver.lib.users import check_user_can_access_all_users, get_accessible_user_ids
from zerver.models import Realm, UserProfile, UserStatus


class UserInfoDict(TypedDict, total=False):
    status_text: str
    emoji_name: str
    emoji_code: str
    reaction_type: str
    away: bool


class RawUserInfoDict(TypedDict):
    user_profile_id: int
    user_profile__presence_enabled: bool
    status_text: str
    emoji_name: str
    emoji_code: str
    reaction_type: str


def format_user_status(row: RawUserInfoDict) -> UserInfoDict:
    # Deprecated way for clients to access the user's `presence_enabled`
    # setting, with away != presence_enabled. Can be removed when clients
    # migrate "away" (also referred to as "unavailable") feature to directly
    # use and update the user's presence_enabled setting.
    presence_enabled = row["user_profile__presence_enabled"]
    away = not presence_enabled
    status_text = row["status_text"]
    emoji_name = row["emoji_name"]
    emoji_code = row["emoji_code"]
    reaction_type = row["reaction_type"]

    dct: UserInfoDict = {}
    if away:
        dct["away"] = away
    if status_text:
        dct["status_text"] = status_text
    if emoji_name:
        dct["emoji_name"] = emoji_name
        dct["emoji_code"] = emoji_code
        dct["reaction_type"] = reaction_type

    return dct


def get_all_users_status_dict(realm: Realm, user_profile: UserProfile) -> dict[str, UserInfoDict]:
    query = UserStatus.objects.filter(
        user_profile__realm_id=realm.id,
        user_profile__is_active=True,
    ).exclude(
        Q(user_profile__presence_enabled=True)
        & Q(status_text="")
        & Q(emoji_name="")
        & Q(emoji_code="")
        & Q(reaction_type=UserStatus.UNICODE_EMOJI),
    )

    if not check_user_can_access_all_users(user_profile):
        accessible_user_ids = get_accessible_user_ids(realm, user_profile)
        query = query.filter(user_profile_id__in=accessible_user_ids)

    rows = query.values(
        "user_profile_id",
        "user_profile__presence_enabled",
        "status_text",
        "emoji_name",
        "emoji_code",
        "reaction_type",
    )

    user_dict: dict[str, UserInfoDict] = {}
    for row in rows:
        user_id = row["user_profile_id"]
        user_dict[str(user_id)] = format_user_status(row)

    return user_dict


def update_user_status(
    user_profile_id: int,
    status_text: str | None,
    client_id: int,
    emoji_name: str | None,
    emoji_code: str | None,
    reaction_type: str | None,
) -> None:
    timestamp = timezone_now()

    defaults = dict(
        client_id=client_id,
        timestamp=timestamp,
    )

    if status_text is not None:
        defaults["status_text"] = status_text

    if emoji_name is not None:
        defaults["emoji_name"] = emoji_name

        if emoji_code is not None:
            defaults["emoji_code"] = emoji_code

        if reaction_type is not None:
            defaults["reaction_type"] = reaction_type

    UserStatus.objects.update_or_create(
        user_profile_id=user_profile_id,
        defaults=defaults,
    )


def get_user_status(user_profile: UserProfile) -> UserInfoDict:
    status_set_by_user = (
        UserStatus.objects.filter(user_profile=user_profile)
        .values(
            "user_profile_id",
            "user_profile__presence_enabled",
            "status_text",
            "emoji_name",
            "emoji_code",
            "reaction_type",
        )
        .first()
    )

    if not status_set_by_user:
        return {}
    return format_user_status(status_set_by_user)
```

--------------------------------------------------------------------------------

---[FILE: user_topics.py]---
Location: zulip-main/zerver/lib/user_topics.py
Signals: Django, SQLAlchemy

```python
import logging
from collections import defaultdict
from collections.abc import Callable
from datetime import datetime
from typing import TypedDict

from django.db import connection, transaction
from django.db.models import QuerySet
from django.utils.timezone import now as timezone_now
from psycopg2.sql import SQL, Literal
from sqlalchemy.sql import ClauseElement, and_, column, not_, or_
from sqlalchemy.types import Integer

from zerver.lib.timestamp import datetime_to_timestamp
from zerver.lib.topic_sqlalchemy import topic_match_sa
from zerver.lib.types import UserTopicDict
from zerver.models import Recipient, Subscription, UserProfile, UserTopic
from zerver.models.streams import get_stream


def get_user_topics(
    user_profile: UserProfile,
    include_deactivated: bool = False,
    include_stream_name: bool = False,
    visibility_policy: int | None = None,
) -> list[UserTopicDict]:
    """
    Fetches UserTopic objects associated with the target user.
    * include_deactivated: Whether to include those associated with
      deactivated streams.
    * include_stream_name: Whether to include stream names in the
      returned dictionaries.
    * visibility_policy: If specified, returns only UserTopic objects
      with the specified visibility_policy value.
    """
    query = UserTopic.objects.filter(user_profile=user_profile)

    if visibility_policy is not None:
        query = query.filter(visibility_policy=visibility_policy)

    # Exclude user topics that are part of deactivated streams unless
    # explicitly requested.
    if not include_deactivated:
        query = query.filter(stream__deactivated=False)

    rows = query.values(
        "stream_id", "stream__name", "topic_name", "last_updated", "visibility_policy"
    )

    result = []
    for row in rows:
        user_topic_dict: UserTopicDict = {
            "stream_id": row["stream_id"],
            "topic_name": row["topic_name"],
            "visibility_policy": row["visibility_policy"],
            "last_updated": datetime_to_timestamp(row["last_updated"]),
        }

        if include_stream_name:
            user_topic_dict["stream__name"] = row["stream__name"]

        result.append(user_topic_dict)

    return result


def get_topic_mutes(
    user_profile: UserProfile, include_deactivated: bool = False
) -> list[list[str | int]]:
    user_topics = get_user_topics(
        user_profile=user_profile,
        include_deactivated=include_deactivated,
        include_stream_name=True,
        visibility_policy=UserTopic.VisibilityPolicy.MUTED,
    )

    return [
        [user_topic["stream__name"], user_topic["topic_name"], user_topic["last_updated"]]
        for user_topic in user_topics
    ]


@transaction.atomic(savepoint=False)
def set_topic_visibility_policy(
    user_profile: UserProfile,
    topics: list[list[str]],
    visibility_policy: int,
    last_updated: datetime | None = None,
) -> None:
    """
    This is only used in tests.
    """

    UserTopic.objects.filter(
        user_profile=user_profile,
        visibility_policy=visibility_policy,
    ).delete()

    if last_updated is None:
        last_updated = timezone_now()
    for stream_name, topic_name in topics:
        stream = get_stream(stream_name, user_profile.realm)
        recipient_id = stream.recipient_id
        assert recipient_id is not None

        bulk_set_user_topic_visibility_policy_in_database(
            user_profiles=[user_profile],
            stream_id=stream.id,
            recipient_id=recipient_id,
            topic_name=topic_name,
            visibility_policy=visibility_policy,
            last_updated=last_updated,
        )


def get_topic_visibility_policy(
    user_profile: UserProfile,
    stream_id: int,
    topic_name: str,
) -> int:
    try:
        user_topic = UserTopic.objects.get(
            user_profile=user_profile, stream_id=stream_id, topic_name__iexact=topic_name
        )
        visibility_policy = user_topic.visibility_policy
    except UserTopic.DoesNotExist:
        visibility_policy = UserTopic.VisibilityPolicy.INHERIT
    return visibility_policy


@transaction.atomic(savepoint=False)
def bulk_set_user_topic_visibility_policy_in_database(
    user_profiles: list[UserProfile],
    stream_id: int,
    topic_name: str,
    *,
    visibility_policy: int,
    recipient_id: int | None = None,
    last_updated: datetime | None = None,
) -> list[UserProfile]:
    # returns the list of user_profiles whose user_topic row
    # is either deleted, updated, or created.
    rows = UserTopic.objects.filter(
        user_profile__in=user_profiles,
        stream_id=stream_id,
        topic_name__iexact=topic_name,
    ).select_related("user_profile", "user_profile__realm")

    user_profiles_with_visibility_policy = [row.user_profile for row in rows]
    user_profiles_without_visibility_policy = list(
        set(user_profiles) - set(user_profiles_with_visibility_policy)
    )

    if visibility_policy == UserTopic.VisibilityPolicy.INHERIT:
        for user_profile in user_profiles_without_visibility_policy:
            # The user doesn't already have a visibility_policy for this topic.
            logging.info(
                "User %s tried to remove visibility_policy, which actually doesn't exist",
                user_profile.id,
            )
        rows.delete()
        return user_profiles_with_visibility_policy

    assert last_updated is not None
    assert recipient_id is not None

    user_profiles_seeking_user_topic_update_or_create: list[UserProfile] = (
        user_profiles_without_visibility_policy
    )
    for row in rows:
        if row.visibility_policy == visibility_policy:
            logging.info(
                "User %s tried to set visibility_policy to its current value of %s",
                row.user_profile_id,
                visibility_policy,
            )
            continue
        # The request is to just 'update' the visibility policy of a topic
        user_profiles_seeking_user_topic_update_or_create.append(row.user_profile)

    if user_profiles_seeking_user_topic_update_or_create:
        user_profile_ids_array = SQL("ARRAY[{}]").format(
            SQL(", ").join(
                [
                    Literal(user_profile.id)
                    for user_profile in user_profiles_seeking_user_topic_update_or_create
                ]
            )
        )

        query = SQL("""
            INSERT INTO zerver_usertopic(user_profile_id, stream_id, recipient_id, topic_name, last_updated, visibility_policy)
            SELECT * FROM UNNEST({user_profile_ids_array}) AS user_profile(user_profile_id)
            CROSS JOIN (VALUES ({stream_id}, {recipient_id}, {topic_name}, {last_updated}, {visibility_policy}))
            AS other_values(stream_id, recipient_id, topic_name, last_updated, visibility_policy)
            ON CONFLICT (user_profile_id, stream_id, lower(topic_name)) DO UPDATE SET
            last_updated = EXCLUDED.last_updated,
            visibility_policy = EXCLUDED.visibility_policy;
        """).format(
            user_profile_ids_array=user_profile_ids_array,
            stream_id=Literal(stream_id),
            recipient_id=Literal(recipient_id),
            topic_name=Literal(topic_name),
            last_updated=Literal(last_updated),
            visibility_policy=Literal(visibility_policy),
        )

        with connection.cursor() as cursor:
            cursor.execute(query)

    return user_profiles_seeking_user_topic_update_or_create


def topic_has_visibility_policy(
    user_profile: UserProfile, stream_id: int, topic_name: str, visibility_policy: int
) -> bool:
    if visibility_policy == UserTopic.VisibilityPolicy.INHERIT:
        has_user_topic_row = UserTopic.objects.filter(
            user_profile=user_profile, stream_id=stream_id, topic_name__iexact=topic_name
        ).exists()
        return not has_user_topic_row
    has_visibility_policy = UserTopic.objects.filter(
        user_profile=user_profile,
        stream_id=stream_id,
        topic_name__iexact=topic_name,
        visibility_policy=visibility_policy,
    ).exists()
    return has_visibility_policy


def exclude_stream_and_topic_mutes(
    conditions: list[ClauseElement], user_profile: UserProfile, stream_id: int | None
) -> list[ClauseElement]:
    # Note: Unlike get_topic_mutes, here we always want to
    # consider topics in deactivated streams, so they are
    # never filtered from the query in this method.
    query = UserTopic.objects.filter(
        user_profile=user_profile,
        visibility_policy=UserTopic.VisibilityPolicy.MUTED,
    )

    if stream_id is not None:
        # If we are narrowed to a stream, we can optimize the query
        # by not considering topic mutes outside the stream.
        query = query.filter(stream_id=stream_id)

    excluded_topic_rows = query.values(
        "recipient_id",
        "topic_name",
    )

    class RecipientTopicDict(TypedDict):
        recipient_id: int
        topic_name: str

    def topic_cond(row: RecipientTopicDict) -> ClauseElement:
        recipient_id = row["recipient_id"]
        topic_name = row["topic_name"]
        stream_cond = column("recipient_id", Integer) == recipient_id
        topic_cond = topic_match_sa(topic_name)
        return and_(stream_cond, topic_cond)

    # Add this query later to reduce the number of messages it has to run on.
    if excluded_topic_rows:
        exclude_muted_topics_condition = not_(or_(*map(topic_cond, excluded_topic_rows)))
        conditions = [*conditions, exclude_muted_topics_condition]

    # Channel-level muting only applies when looking at views that
    # include multiple channels, since we do want users to be able to
    # browser messages within a muted channel.
    if stream_id is None:
        rows = Subscription.objects.filter(
            user_profile=user_profile,
            active=True,
            is_muted=True,
            recipient__type=Recipient.STREAM,
        ).values("recipient_id")
        muted_recipient_ids = [row["recipient_id"] for row in rows]

        if len(muted_recipient_ids) == 0:
            return conditions

        # Add entries with visibility_policy FOLLOWED or UNMUTED in muted_recipient_ids
        query = UserTopic.objects.filter(
            user_profile=user_profile,
            recipient_id__in=muted_recipient_ids,
            visibility_policy__in=[
                UserTopic.VisibilityPolicy.FOLLOWED,
                UserTopic.VisibilityPolicy.UNMUTED,
            ],
        )

        included_topic_rows = query.values(
            "recipient_id",
            "topic_name",
        )

        # Exclude muted_recipient_ids unless they match include_followed_or_unmuted_topics_condition
        muted_stream_condition = column("recipient_id", Integer).in_(muted_recipient_ids)

        if included_topic_rows:
            include_followed_or_unmuted_topics_condition = or_(
                *map(topic_cond, included_topic_rows)
            )

            exclude_muted_streams_condition = not_(
                and_(
                    muted_stream_condition,
                    not_(include_followed_or_unmuted_topics_condition),
                )
            )
        else:
            # If no included topics, exclude all muted streams
            exclude_muted_streams_condition = not_(muted_stream_condition)

        conditions = [*conditions, exclude_muted_streams_condition]

    return conditions


def build_get_topic_visibility_policy(
    user_profile: UserProfile,
) -> Callable[[int, str], int]:
    """Prefetch the visibility policies the user has configured for
    various topics.

    The prefetching helps to avoid the db queries later in the loop
    to determine the user's visibility policy for a topic.
    """
    rows = UserTopic.objects.filter(user_profile=user_profile).values(
        "recipient_id",
        "topic_name",
        "visibility_policy",
    )

    topic_to_visibility_policy: dict[tuple[int, str], int] = defaultdict(int)
    for row in rows:
        recipient_id = row["recipient_id"]
        topic_name = row["topic_name"]
        visibility_policy = row["visibility_policy"]
        topic_to_visibility_policy[(recipient_id, topic_name)] = visibility_policy

    def get_topic_visibility_policy(recipient_id: int, topic_name: str) -> int:
        return topic_to_visibility_policy[(recipient_id, topic_name.lower())]

    return get_topic_visibility_policy


def get_users_with_user_topic_visibility_policy(
    stream_id: int, topic_name: str
) -> QuerySet[UserTopic]:
    return UserTopic.objects.filter(
        stream_id=stream_id, topic_name__iexact=topic_name
    ).select_related("user_profile", "user_profile__realm")
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: zulip-main/zerver/lib/utils.py
Signals: Django

```python
import hashlib
import logging
import re
import secrets
from collections.abc import Callable
from typing import TypeVar

from django.db import models

T = TypeVar("T")


def generate_api_key() -> str:
    api_key = ""
    while len(api_key) < 32:
        # One iteration suffices 99.4992% of the time.
        api_key += secrets.token_urlsafe(3 * 9).replace("_", "").replace("-", "")
    return api_key[:32]


def has_api_key_format(key: str) -> bool:
    return bool(re.fullmatch(r"([A-Za-z0-9]){32}", key))


def assert_is_not_none(value: T | None) -> T:
    assert value is not None
    return value


def process_list_in_batches(
    lst: list[T], chunk_size: int, process_batch: Callable[[list[T]], None]
) -> None:
    offset = 0
    total_message_length = len(lst)
    while True:
        items = lst[offset : offset + chunk_size]
        if not items:
            break
        process_batch(items)
        offset = min(offset + chunk_size, total_message_length)
        logging.info("Processed messages up to %s / %s", offset, total_message_length)


def optional_bytes_to_mib(value: int | None) -> int | None:
    if value is None:
        return None
    else:
        return value >> 20


def get_fk_field_name(model: type[models.Model], related_model: type[models.Model]) -> str | None:
    """
    Get the name of the foreign key field in model, pointing the related_model table.
    Returns None if there is no such field.

    Example usage:

    get_fk_field_name(UserProfile, Realm) returns "realm"
    """

    fields = model._meta.get_fields()
    foreign_key_fields_to_related_model = [
        field
        for field in fields
        if hasattr(field, "related_model") and field.related_model == related_model
    ]

    if len(foreign_key_fields_to_related_model) == 0:
        return None

    assert len(foreign_key_fields_to_related_model) == 1

    return foreign_key_fields_to_related_model[0].name


def sha256_hash(text: str) -> str:
    return hashlib.sha256(text.encode()).hexdigest()
```

--------------------------------------------------------------------------------

````
