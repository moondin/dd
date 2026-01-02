---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 902
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 902 of 1290)

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

---[FILE: stream_color.py]---
Location: zulip-main/zerver/lib/stream_color.py

```python
STREAM_ASSIGNMENT_COLORS = [
    "#76ce90",
    "#fae589",
    "#a6c7e5",
    "#e79ab5",
    "#bfd56f",
    "#f4ae55",
    "#b0a5fd",
    "#addfe5",
    "#f5ce6e",
    "#c2726a",
    "#94c849",
    "#bd86e5",
    "#ee7e4a",
    "#a6dcbf",
    "#95a5fd",
    "#53a063",
    "#9987e1",
    "#e4523d",
    "#c2c2c2",
    "#4f8de4",
    "#c6a8ad",
    "#e7cc4d",
    "#c8bebf",
    "#a47462",
]


def pick_colors(
    used_colors: set[str], color_map: dict[int, str], recipient_ids: list[int]
) -> dict[int, str]:
    used_colors = set(used_colors)
    recipient_ids = sorted(recipient_ids)
    result = {}

    other_recipient_ids = []
    for recipient_id in recipient_ids:
        if recipient_id in color_map:
            color = color_map[recipient_id]
            result[recipient_id] = color
            used_colors.add(color)
        else:
            other_recipient_ids.append(recipient_id)

    available_colors = [s for s in STREAM_ASSIGNMENT_COLORS if s not in used_colors]

    for i, recipient_id in enumerate(other_recipient_ids):
        if i < len(available_colors):
            color = available_colors[i]
        else:
            # We have to start reusing old colors, and we use recipient_id
            # to choose the color.
            color = STREAM_ASSIGNMENT_COLORS[recipient_id % len(STREAM_ASSIGNMENT_COLORS)]
        result[recipient_id] = color

    return result
```

--------------------------------------------------------------------------------

---[FILE: stream_subscription.py]---
Location: zulip-main/zerver/lib/stream_subscription.py
Signals: Django

```python
import itertools
from collections import defaultdict
from collections.abc import Set as AbstractSet
from dataclasses import dataclass
from operator import itemgetter
from typing import Any, Literal

from django.db import connection, transaction
from django.db.models import F, Q, QuerySet
from psycopg2 import sql
from psycopg2.extras import execute_values

from zerver.models import AlertWord, Recipient, Stream, Subscription, UserProfile, UserTopic


@dataclass
class SubInfo:
    user: UserProfile
    sub: Subscription
    stream: Stream


@dataclass
class SubscriberPeerInfo:
    subscribed_ids: dict[int, set[int]]
    private_peer_dict: dict[int, set[int]]


def get_active_subscriptions_for_stream_id(
    stream_id: int, *, include_deactivated_users: bool
) -> QuerySet[Subscription]:
    query = Subscription.objects.filter(
        recipient__type=Recipient.STREAM,
        recipient__type_id=stream_id,
        active=True,
    )
    if not include_deactivated_users:
        # Note that non-active users may still have "active" subscriptions, because we
        # want to be able to easily reactivate them with their old subscriptions.  This
        # is why the query here has to look at the is_user_active flag.
        query = query.filter(is_user_active=True)

    return query


def get_active_subscriptions_for_stream_ids(stream_ids: set[int]) -> QuerySet[Subscription]:
    return Subscription.objects.filter(
        recipient__type=Recipient.STREAM,
        recipient__type_id__in=stream_ids,
        active=True,
        is_user_active=True,
    )


def get_subscribed_stream_ids_for_user(
    user_profile: UserProfile,
) -> QuerySet[Subscription, int]:
    return Subscription.objects.filter(
        user_profile_id=user_profile,
        recipient__type=Recipient.STREAM,
        active=True,
    ).values_list("recipient__type_id", flat=True)


def get_subscribed_stream_recipient_ids_for_user(
    user_profile: UserProfile,
) -> QuerySet[Subscription, int]:
    return Subscription.objects.filter(
        user_profile_id=user_profile,
        recipient__type=Recipient.STREAM,
        active=True,
    ).values_list("recipient_id", flat=True)


def get_stream_subscriptions_for_user(user_profile: UserProfile) -> QuerySet[Subscription]:
    return Subscription.objects.filter(
        user_profile=user_profile,
        recipient__type=Recipient.STREAM,
    )


def get_user_subscribed_streams(user_profile: UserProfile) -> QuerySet[Stream]:
    return Stream.objects.filter(
        recipient_id__in=get_subscribed_stream_recipient_ids_for_user(user_profile)
    )


def get_used_colors_for_user_ids(user_ids: list[int]) -> dict[int, set[str]]:
    """Fetch which stream colors have already been used for each user in
    user_ids. Uses an optimized query designed to support picking
    colors when bulk-adding users to streams, which requires
    inspecting all Subscription objects for the users, which can often
    end up being all Subscription objects in the realm.
    """
    query = (
        Subscription.objects.filter(
            user_profile_id__in=user_ids,
            recipient__type=Recipient.STREAM,
        )
        .values("user_profile_id", "color")
        .distinct()
    )

    result: dict[int, set[str]] = defaultdict(set)

    for row in query:
        assert row["color"] is not None
        result[row["user_profile_id"]].add(row["color"])

    return result


def get_bulk_stream_subscriber_info(
    users: list[UserProfile],
    streams: list[Stream],
) -> dict[int, list[SubInfo]]:
    stream_ids = {stream.id for stream in streams}

    subs = Subscription.objects.filter(
        user_profile__in=users,
        recipient__type=Recipient.STREAM,
        recipient__type_id__in=stream_ids,
        active=True,
    ).only("user_profile_id", "recipient_id")

    stream_map = {stream.recipient_id: stream for stream in streams}
    user_map = {user.id: user for user in users}

    result: dict[int, list[SubInfo]] = {user.id: [] for user in users}

    for sub in subs:
        user_id = sub.user_profile_id
        user = user_map[user_id]
        recipient_id = sub.recipient_id
        stream = stream_map[recipient_id]
        sub_info = SubInfo(
            user=user,
            sub=sub,
            stream=stream,
        )

        result[user_id].append(sub_info)

    return result


def num_subscribers_for_stream_id(stream_id: int) -> int:
    return get_active_subscriptions_for_stream_id(
        stream_id, include_deactivated_users=False
    ).count()


def get_user_ids_for_stream_query(
    query: QuerySet[Subscription, Subscription],
) -> dict[int, set[int]]:
    all_subs = query.values(
        "recipient__type_id",
        "user_profile_id",
    ).order_by(
        "recipient__type_id",
    )

    get_stream_id = itemgetter("recipient__type_id")

    result: dict[int, set[int]] = defaultdict(set)
    for stream_id, rows in itertools.groupby(all_subs, get_stream_id):
        user_ids = {row["user_profile_id"] for row in rows}
        result[stream_id] = user_ids

    return result


def get_user_ids_for_streams(stream_ids: set[int]) -> dict[int, set[int]]:
    return get_user_ids_for_stream_query(get_active_subscriptions_for_stream_ids(stream_ids))


def get_guest_user_ids_for_streams(stream_ids: set[int]) -> dict[int, set[int]]:
    return get_user_ids_for_stream_query(
        get_active_subscriptions_for_stream_ids(stream_ids).filter(
            user_profile__role=UserProfile.ROLE_GUEST
        )
    )


def get_users_for_streams(stream_ids: set[int]) -> dict[int, set[UserProfile]]:
    all_subs = (
        get_active_subscriptions_for_stream_ids(stream_ids)
        .select_related("user_profile", "recipient")
        .order_by("recipient__type_id")
    )

    result: dict[int, set[UserProfile]] = defaultdict(set)
    for stream_id, rows in itertools.groupby(all_subs, key=lambda obj: obj.recipient.type_id):
        users = {row.user_profile for row in rows}
        result[stream_id] = users

    return result


def handle_stream_notifications_compatibility(
    user_profile: UserProfile | None,
    stream_dict: dict[str, Any],
    notification_settings_null: bool,
) -> None:
    # Old versions of the mobile apps don't support `None` as a
    # value for the stream-level notifications properties, so we
    # have to handle the normally frontend-side defaults for these
    # settings here for those older clients.
    #
    # Note that this situation results in these older mobile apps
    # having a subtle bug where changes to the user-level stream
    # notification defaults will not properly propagate to the
    # mobile app "stream notification settings" UI until the app
    # re-registers.  This is an acceptable level of
    # backwards-compatibility problem in our view.
    assert not notification_settings_null

    for notification_type in [
        "desktop_notifications",
        "audible_notifications",
        "push_notifications",
        "email_notifications",
    ]:
        # Values of true/false are supported by older clients.
        if stream_dict[notification_type] is not None:
            continue
        target_attr = "enable_stream_" + notification_type
        stream_dict[notification_type] = (
            False if user_profile is None else getattr(user_profile, target_attr)
        )


def subscriber_ids_with_stream_history_access(stream: Stream) -> set[int]:
    """Returns the set of active user IDs who can access any message
    history on this stream (regardless of whether they have a
    UserMessage) based on the stream's configuration.

    1. if !history_public_to_subscribers:
          History is not available to anyone
    2. if history_public_to_subscribers:
          All subscribers can access the history including guests

    The results of this function need to be kept consistent with
    what can_access_stream_history would dictate.

    """

    if not stream.is_history_public_to_subscribers():
        return set()

    return set(
        get_active_subscriptions_for_stream_id(
            stream.id, include_deactivated_users=False
        ).values_list("user_profile_id", flat=True)
    )


def get_subscriptions_for_send_message(
    *,
    realm_id: int,
    stream_id: int,
    topic_name: str,
    possible_stream_wildcard_mention: bool,
    topic_participant_user_ids: AbstractSet[int],
    possibly_mentioned_user_ids: AbstractSet[int],
) -> QuerySet[Subscription]:
    """This function optimizes an important use case for large
    streams. Open realms often have many long_term_idle users, which
    can result in 10,000s of long_term_idle recipients in default
    streams. do_send_messages has an optimization to avoid doing work
    for long_term_idle unless message flags or notifications should be
    generated.

    However, it's expensive even to fetch and process them all in
    Python at all. This function returns all recipients of a stream
    message that could possibly require action in the send-message
    codepath.

    Basically, it returns all subscribers, excluding all long-term
    idle users who it can prove will not receive a UserMessage row or
    notification for the message (i.e. no alert words, mentions, or
    email/push notifications are configured) and thus are not needed
    for processing the message send.

    Critically, this function is called before the Markdown
    processor. As a result, it returns all subscribers who have ANY
    configured alert words, even if their alert words aren't present
    in the message. Similarly, it returns all subscribers who match
    the "possible mention" parameters.

    Downstream logic, which runs after the Markdown processor has
    parsed the message, will do the precise determination.
    """

    query = get_active_subscriptions_for_stream_id(
        stream_id,
        include_deactivated_users=False,
    )

    if possible_stream_wildcard_mention:
        return query

    query = query.filter(
        Q(user_profile__long_term_idle=False)
        | Q(push_notifications=True)
        | (Q(push_notifications=None) & Q(user_profile__enable_stream_push_notifications=True))
        | Q(email_notifications=True)
        | (Q(email_notifications=None) & Q(user_profile__enable_stream_email_notifications=True))
        | Q(user_profile_id__in=possibly_mentioned_user_ids)
        | Q(user_profile_id__in=topic_participant_user_ids)
        | Q(
            user_profile_id__in=AlertWord.objects.filter(realm_id=realm_id).values_list(
                "user_profile_id"
            )
        )
        | Q(
            user_profile_id__in=UserTopic.objects.filter(
                stream_id=stream_id,
                topic_name__iexact=topic_name,
                visibility_policy=UserTopic.VisibilityPolicy.FOLLOWED,
            ).values_list("user_profile_id")
        )
    )
    return query


def update_all_subscriber_counts_for_user(
    user_profile: UserProfile, direction: Literal[1, -1]
) -> None:
    """
    Increment/Decrement number of stream subscribers by 1, when reactivating/deactivating user.

    direction -> 1=increment, -1=decrement
    """
    get_user_subscribed_streams(user_profile).update(
        subscriber_count=F("subscriber_count") + direction
    )


def bulk_update_subscriber_counts(
    direction: Literal[1, -1],
    streams: dict[int, set[int]],
) -> None:
    """Increment/Decrement number of stream subscribers for multiple users.

    direction -> 1=increment, -1=decrement
    """
    if len(streams) == 0:
        return

    # list of tuples (stream_id, delta_subscribers) used as the
    # columns of the temporary table delta_table.
    stream_delta_values = [
        (stream_id, len(subscribers) * direction) for stream_id, subscribers in streams.items()
    ]

    # The goal here is to update subscriber_count in a bulk efficient way,
    # letting the database handle the deltas to avoid some race conditions.
    #
    # But unlike update_all_subscriber_counts_for_user which uses F()
    # for a single delta value, we can't use F() to apply different
    # deltas per row in a single update using ORM, so we use a raw
    # SQL query.
    query = sql.SQL(
        """UPDATE {stream_table}
            SET subscriber_count = {stream_table}.subscriber_count + delta_table.delta
            FROM (VALUES %s) AS delta_table(id, delta)
            WHERE {stream_table}.id = delta_table.id;
        """
    ).format(stream_table=sql.Identifier(Stream._meta.db_table))

    cursor = connection.cursor()
    execute_values(cursor.cursor, query, stream_delta_values)


@transaction.atomic(savepoint=False)
def create_stream_subscription(
    user_profile: UserProfile,
    recipient: Recipient,
    stream: Stream,
    color: str = Subscription.DEFAULT_STREAM_COLOR,
) -> None:
    """
    Creates a single stream Subscription object, incrementing
    stream.subscriber_count by 1 if user is active, in the same
    transaction.
    """

    # We only create a stream subscription in this function
    assert recipient.type == Recipient.STREAM

    Subscription.objects.create(
        recipient=recipient,
        user_profile=user_profile,
        is_user_active=user_profile.is_active,
        color=color,
    )

    if user_profile.is_active:
        Stream.objects.filter(id=stream.id).update(subscriber_count=F("subscriber_count") + 1)


@transaction.atomic(savepoint=False)
def bulk_create_stream_subscriptions(  # nocoverage
    subs: list[Subscription], streams: dict[int, set[int]]
) -> None:
    """
    Bulk create subscripions for streams, incrementing
    stream.subscriber_count in the same transaction.

    Currently only used in populate_db.
    """
    Subscription.objects.bulk_create(subs)
    bulk_update_subscriber_counts(direction=1, streams=streams)
```

--------------------------------------------------------------------------------

---[FILE: stream_topic.py]---
Location: zulip-main/zerver/lib/stream_topic.py

```python
from zerver.models import UserTopic


class StreamTopicTarget:
    """
    This class is designed to help us move to a
    StreamTopic table or something similar.  It isolates
    places where we are still using `topic_name` as
    a key into tables.
    """

    def __init__(self, stream_id: int, topic_name: str) -> None:
        self.stream_id = stream_id
        self.topic_name = topic_name

    def user_ids_with_visibility_policy(self, visibility_policy: int) -> set[int]:
        query = UserTopic.objects.filter(
            stream_id=self.stream_id,
            topic_name__iexact=self.topic_name,
            visibility_policy=visibility_policy,
        ).values(
            "user_profile_id",
        )
        return {row["user_profile_id"] for row in query}

    def user_id_to_visibility_policy_dict(self) -> dict[int, int]:
        user_id_to_visibility_policy: dict[int, int] = {}

        query = UserTopic.objects.filter(
            stream_id=self.stream_id, topic_name__iexact=self.topic_name
        ).values(
            "visibility_policy",
            "user_profile_id",
        )
        for row in query:
            user_id_to_visibility_policy[row["user_profile_id"]] = row["visibility_policy"]
        return user_id_to_visibility_policy
```

--------------------------------------------------------------------------------

---[FILE: stream_traffic.py]---
Location: zulip-main/zerver/lib/stream_traffic.py
Signals: Django

```python
from datetime import datetime, timedelta

from django.db.models import Sum
from django.utils.timezone import now as timezone_now

from analytics.lib.counts import COUNT_STATS
from analytics.models import StreamCount
from zerver.models import Realm


def get_streams_traffic(realm: Realm, stream_ids: set[int] | None = None) -> dict[int, int] | None:
    stat = COUNT_STATS["messages_in_stream:is_bot:day"]
    traffic_from = timezone_now() - timedelta(days=28)

    filter_kwargs = dict(
        # The realm_id is important, as it makes this significantly better-indexed
        realm_id=realm.id,
        property=stat.property,
        end_time__gt=traffic_from,
    )
    if stream_ids is not None:
        filter_kwargs["stream_id__in"] = stream_ids

    query = StreamCount.objects.filter(**filter_kwargs)

    traffic_list = query.values("stream_id").annotate(sum_value=Sum("value"))
    traffic_dict = {}
    for traffic in traffic_list:
        traffic_dict[traffic["stream_id"]] = traffic["sum_value"]

    return traffic_dict


def round_to_2_significant_digits(number: int) -> int:
    return int(round(number, 2 - len(str(number))))


STREAM_TRAFFIC_CALCULATION_MIN_AGE_DAYS = 7


def get_average_weekly_stream_traffic(
    stream_id: int, stream_date_created: datetime, recent_traffic: dict[int, int]
) -> int | None:
    try:
        stream_traffic = recent_traffic[stream_id]
    except KeyError:
        stream_traffic = 0

    stream_age = (timezone_now() - stream_date_created).days

    if stream_age >= 28:
        average_weekly_traffic = int(stream_traffic // 4)
    elif stream_age >= STREAM_TRAFFIC_CALCULATION_MIN_AGE_DAYS:
        average_weekly_traffic = int(stream_traffic * 7 // stream_age)
    else:
        return None

    if average_weekly_traffic == 0 and stream_traffic > 0:
        average_weekly_traffic = 1

    return round_to_2_significant_digits(average_weekly_traffic)
```

--------------------------------------------------------------------------------

---[FILE: string_validation.py]---
Location: zulip-main/zerver/lib/string_validation.py
Signals: Django

```python
import unicodedata

from django.utils.translation import gettext as _

from zerver.lib.exceptions import JsonableError
from zerver.models import Stream

# There are 66 Unicode non-characters; see
# https://www.unicode.org/faq/private_use.html#nonchar4
unicode_non_chars = {
    chr(x)
    for r in [
        range(0xFDD0, 0xFDF0),  # FDD0 through FDEF, inclusive
        range(0xFFFE, 0x110000, 0x10000),  # 0xFFFE, 0x1FFFE, ... 0x10FFFE inclusive
        range(0xFFFF, 0x110000, 0x10000),  # 0xFFFF, 0x1FFFF, ... 0x10FFFF inclusive
    ]
    for x in r
}


def is_character_printable(char: str) -> bool:
    unicode_category = unicodedata.category(char)
    if (unicode_category in ["Cc", "Cs"]) or char in unicode_non_chars:
        return False

    return True


def check_string_is_printable(var: str) -> int | None:
    # Return position (1-indexed!) of the character which is not
    # printable, None if no such character is present.
    for i, char in enumerate(var):
        if not is_character_printable(char):
            return i + 1
    return None


def check_stream_name(stream_name: str) -> None:
    if stream_name.strip() == "":
        raise JsonableError(_("Channel name can't be empty."))

    if len(stream_name) > Stream.MAX_NAME_LENGTH:
        raise JsonableError(
            _("Channel name too long (limit: {max_length} characters).").format(
                max_length=Stream.MAX_NAME_LENGTH
            )
        )

    invalid_character_pos = check_string_is_printable(stream_name)
    if invalid_character_pos is not None:
        raise JsonableError(
            _("Invalid character in channel name, at position {position}.").format(
                position=invalid_character_pos
            )
        )


def check_stream_topic(topic_name: str) -> None:
    invalid_character_pos = check_string_is_printable(topic_name)
    if invalid_character_pos is not None:
        raise JsonableError(
            _("Invalid character in topic, at position {position}!").format(
                position=invalid_character_pos
            )
        )
```

--------------------------------------------------------------------------------

---[FILE: subdomains.py]---
Location: zulip-main/zerver/lib/subdomains.py
Signals: Django

```python
import re
from urllib.parse import urlsplit

from django.conf import settings
from django.http import HttpRequest

from zerver.lib.upload import get_public_upload_root_url
from zerver.models import Realm, UserProfile


def get_subdomain(request: HttpRequest) -> str:
    # The HTTP spec allows, but doesn't require, a client to omit the
    # port in the `Host` header if it's "the default port for the
    # service requested", i.e. typically either 443 or 80; and
    # whatever Django gets there, or from proxies reporting that via
    # X-Forwarded-Host, it passes right through the same way.  So our
    # logic is a bit complicated to allow for that variation.
    #
    # For both EXTERNAL_HOST and REALM_HOSTS, we take a missing port
    # to mean that any port should be accepted in Host.  It's not
    # totally clear that's the right behavior, but it keeps
    # compatibility with older versions of Zulip, so that's a start.

    host = request.get_host().lower()
    subdomain = get_subdomain_from_hostname(host)
    assert subdomain is not None
    return subdomain


def get_subdomain_from_hostname(
    host: str, default_subdomain: str | None = Realm.SUBDOMAIN_FOR_ROOT_DOMAIN
) -> str | None:
    # Set `default_subdomain` as None to check if a valid subdomain was found.
    m = re.search(rf"\.{settings.EXTERNAL_HOST}(:\d+)?$", host)
    if m:
        subdomain = host[: m.start()]
        if default_subdomain is not None and subdomain in settings.ROOT_SUBDOMAIN_ALIASES:
            return default_subdomain
        return subdomain

    for subdomain, realm_host in settings.REALM_HOSTS.items():
        if re.search(rf"^{realm_host}(:\d+)?$", host):
            return subdomain

    return default_subdomain


def is_subdomain_root_or_alias(request: HttpRequest) -> bool:
    return get_subdomain(request) == Realm.SUBDOMAIN_FOR_ROOT_DOMAIN


def user_matches_subdomain(realm_subdomain: str, user_profile: UserProfile) -> bool:
    return user_profile.realm.subdomain == realm_subdomain


def is_root_domain_available() -> bool:
    if settings.ROOT_DOMAIN_LANDING_PAGE:
        return False
    return not Realm.objects.filter(string_id=Realm.SUBDOMAIN_FOR_ROOT_DOMAIN).exists()


def is_static_or_current_realm_url(url: str, realm: Realm | None) -> bool:
    assert settings.STATIC_URL is not None
    split_url = urlsplit(url)
    split_static_url = urlsplit(settings.STATIC_URL)

    # The netloc check here is important to correctness if STATIC_URL
    # does not contain a `/`; see the tests for why.
    if split_url.netloc == split_static_url.netloc and url.startswith(settings.STATIC_URL):
        return True

    # HTTPS access to this Zulip organization's domain; our existing
    # HTTPS protects this request, and there's no privacy benefit to
    # using camo in front of the Zulip server itself.
    if (
        realm is not None
        and split_url.netloc == realm.host
        and f"{split_url.scheme}://" == settings.EXTERNAL_URI_SCHEME
    ):
        return True

    # Relative URLs will be processed by the browser the same way as the above.
    if split_url.netloc == "" and split_url.scheme == "":
        return True

    # S3 storage we control, if used, is also static and thus exempt
    if settings.LOCAL_UPLOADS_DIR is None:
        # The startswith check is correct here because the public
        # upload base URL is guaranteed to end with /.
        public_upload_root_url = get_public_upload_root_url()
        assert public_upload_root_url.endswith("/")
        if url.startswith(public_upload_root_url):
            return True

    return False
```

--------------------------------------------------------------------------------

````
