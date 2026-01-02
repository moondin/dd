---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 871
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 871 of 1290)

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

---[FILE: dev_ldap_directory.py]---
Location: zulip-main/zerver/lib/dev_ldap_directory.py
Signals: Django

```python
import glob
import logging
import os
from email.headerregistry import Address
from typing import Any

from django.conf import settings

from zerver.lib.storage import static_path

# See https://jackstromberg.com/2013/01/useraccountcontrol-attributeflag-values/
# for docs on what these values mean.
LDAP_USER_ACCOUNT_CONTROL_NORMAL = "512"
LDAP_USER_ACCOUNT_CONTROL_DISABLED = "514"


def generate_dev_ldap_dir(mode: str, num_users: int = 8) -> dict[str, dict[str, Any]]:
    mode = mode.lower()
    ldap_data = []
    for i in range(1, num_users + 1):
        name = f"LDAP User {i}"
        email = f"ldapuser{i}@zulip.com"
        phone_number = f"999999999{i}"
        birthdate = f"19{i:02}-{i:02}-{i:02}"
        ldap_data.append((name, email, phone_number, birthdate))

    profile_images = []
    for path in glob.glob(os.path.join(static_path("images/test-images/avatars"), "*")):
        with open(path, "rb") as f:
            profile_images.append(f.read())
    ldap_dir = {}
    for i, user_data in enumerate(ldap_data):
        email = user_data[1].lower()
        email_username = Address(addr_spec=email).username
        common_data = {
            "cn": [user_data[0]],
            "userPassword": [email_username],
            "phoneNumber": [user_data[2]],
            "birthDate": [user_data[3]],
        }
        if mode == "a":
            ldap_dir[f"uid={email},ou=users,dc=zulip,dc=com"] = dict(
                uid=[email],
                thumbnailPhoto=[profile_images[i % len(profile_images)]],
                userAccountControl=[LDAP_USER_ACCOUNT_CONTROL_NORMAL],
                **common_data,
            )
        elif mode == "b":
            ldap_dir[f"uid={email_username},ou=users,dc=zulip,dc=com"] = dict(
                uid=[email_username],
                jpegPhoto=[profile_images[i % len(profile_images)]],
                **common_data,
            )
        elif mode == "c":
            ldap_dir[f"uid={email_username},ou=users,dc=zulip,dc=com"] = dict(
                uid=[email_username], email=[email], **common_data
            )

    return ldap_dir


def init_fakeldap(
    directory: dict[str, dict[str, list[str]]] | None = None,
) -> None:  # nocoverage
    # We only use this in development.  Importing mock inside
    # this function is an import time optimization, which
    # avoids the expensive import of the mock module (slow
    # because its dependency pbr uses pkgresources, which is
    # really slow to import.)
    from unittest import mock

    from fakeldap import MockLDAP

    # Silent `django_auth_ldap` logger in dev mode to avoid
    # spammy user not found log messages.
    ldap_auth_logger = logging.getLogger("django_auth_ldap")
    ldap_auth_logger.setLevel(logging.CRITICAL)

    fakeldap_logger = logging.getLogger("fakeldap")
    fakeldap_logger.setLevel(logging.CRITICAL)

    ldap_patcher = mock.patch("django_auth_ldap.config.ldap.initialize")
    mock_initialize = ldap_patcher.start()
    mock_ldap = MockLDAP()
    mock_initialize.return_value = mock_ldap

    assert settings.FAKE_LDAP_MODE is not None
    mock_ldap.directory = directory or generate_dev_ldap_dir(
        settings.FAKE_LDAP_MODE, settings.FAKE_LDAP_NUM_USERS
    )
```

--------------------------------------------------------------------------------

---[FILE: digest.py]---
Location: zulip-main/zerver/lib/digest.py
Signals: Django

```python
import functools
import heapq
import logging
from collections import defaultdict
from collections.abc import Collection, Iterator
from datetime import datetime, timedelta, timezone
from typing import Any, TypeAlias

from django.conf import settings
from django.db import transaction
from django.db.models import Exists, OuterRef, QuerySet
from django.utils.timezone import now as timezone_now
from django.utils.translation import gettext as _
from markupsafe import Markup

from confirmation.models import one_click_unsubscribe_link
from zerver.context_processors import common_context
from zerver.lib.email_notifications import (
    build_message_list,
    get_channel_privacy_icon,
    message_content_allowed_in_missedmessage_emails,
)
from zerver.lib.logging_util import log_to_file
from zerver.lib.message import get_last_message_id
from zerver.lib.queue import queue_json_publish_rollback_unsafe
from zerver.lib.send_email import FromAddress, send_future_email
from zerver.lib.url_encoding import stream_narrow_url
from zerver.models import (
    Message,
    Realm,
    RealmAuditLog,
    Recipient,
    Stream,
    Subscription,
    UserActivityInterval,
    UserMessage,
    UserProfile,
)
from zerver.models.realm_audit_logs import AuditLogEventType
from zerver.models.streams import get_active_streams

logger = logging.getLogger(__name__)
log_to_file(logger, settings.DIGEST_LOG_PATH)

DIGEST_CUTOFF = 5
MAX_HOT_TOPICS_TO_BE_INCLUDED_IN_DIGEST = 4

TopicKey: TypeAlias = tuple[int, str]


class DigestTopic:
    def __init__(self, topic_key: TopicKey) -> None:
        self.topic_key = topic_key
        self.human_senders: set[str] = set()
        self.sample_messages: list[Message] = []
        self.num_human_messages = 0

    def stream_id(self) -> int:
        # topic_key is (stream_id, topic_name)
        return self.topic_key[0]

    def add_message(self, message: Message) -> None:
        if len(self.sample_messages) < 2:
            self.sample_messages.append(message)

        if not message.sender.is_bot:
            self.human_senders.add(message.sender.full_name)
            self.num_human_messages += 1

    def length(self) -> int:
        return self.num_human_messages

    def diversity(self) -> int:
        return len(self.human_senders)

    def teaser_data(self, user: UserProfile, stream_id_map: dict[int, Stream]) -> dict[str, Any]:
        teaser_count = self.num_human_messages - len(self.sample_messages)
        first_few_messages = build_message_list(
            user=user,
            messages=self.sample_messages,
            stream_id_map=stream_id_map,
        )
        return {
            "participants": sorted(self.human_senders),
            "count": teaser_count,
            "first_few_messages": first_few_messages,
        }


# Digests accumulate 2 types of interesting traffic for a user:
# 1. New streams
# 2. Interesting stream traffic, as determined by the longest and most
#    diversely comment upon topics.


# Changes to this should also be reflected in
# zerver/worker/digest_emails.py:DigestWorker.consume()
def queue_digest_user_ids(user_ids: list[int], cutoff: datetime) -> None:
    # Convert cutoff to epoch seconds for transit.
    event = {"user_ids": user_ids, "cutoff": cutoff.strftime("%s")}
    queue_json_publish_rollback_unsafe("digest_emails", event)


def enqueue_emails(cutoff: datetime) -> None:
    if not settings.SEND_DIGEST_EMAILS:
        return

    weekday = timezone_now().weekday()
    for realm in Realm.objects.filter(
        deactivated=False, digest_emails_enabled=True, digest_weekday=weekday
    ).exclude(string_id__in=settings.SYSTEM_ONLY_REALMS):
        _enqueue_emails_for_realm(realm, cutoff)


def _enqueue_emails_for_realm(realm: Realm, cutoff: datetime) -> None:
    # This should only be called directly by tests.  Use enqueue_emails
    # to process all realms that are set up for processing on any given day.
    twelve_hours_ago = timezone_now() - timedelta(hours=12)

    target_users = (
        UserProfile.objects.filter(
            realm=realm,
            is_active=True,
            is_bot=False,
            enable_digest_emails=True,
        )
        .alias(
            recent_activity=Exists(
                UserActivityInterval.objects.filter(user_profile_id=OuterRef("id"), end__gt=cutoff)
            )
        )
        .filter(recent_activity=False)
        .alias(
            sent_recent_digest=Exists(
                RealmAuditLog.objects.filter(
                    realm_id=realm.id,
                    event_type=AuditLogEventType.USER_DIGEST_EMAIL_CREATED,
                    event_time__gt=twelve_hours_ago,
                    modified_user_id=OuterRef("id"),
                )
            )
        )
        .filter(sent_recent_digest=False)
    )

    user_ids = target_users.order_by("id").values_list("id", flat=True)

    # We process batches of 30.  We want a big enough batch
    # to amortize work, but not so big that a single item
    # from the queue takes too long to process.
    chunk_size = 30
    for i in range(0, len(user_ids), chunk_size):
        chunk_user_ids = list(user_ids[i : i + chunk_size])
        queue_digest_user_ids(chunk_user_ids, cutoff)
        logger.info(
            "Queuing user_ids for potential digest: %s",
            chunk_user_ids,
        )


last_realm_id: int | None = None
last_cutoff: float | None = None


def maybe_clear_recent_topics_cache(realm_id: int, cutoff: float) -> None:
    # As an optimization, we clear the digest caches when we switch to
    # a new realm or cutoff value.  Since these values are part of the
    # cache key, this is not necessary for correctness -- it merely
    # helps reduce the memory footprint of the cache.
    global last_realm_id, last_cutoff
    if last_realm_id != realm_id or last_cutoff != cutoff:
        logger.info("Flushing stream cache: %s", get_recent_topics.cache_info())
        get_recent_topics.cache_clear()
    last_realm_id = realm_id
    last_cutoff = cutoff


# We cache both by stream-id and cutoff, which ensures the per-stream
# cache also does not contain data from old digests
@functools.lru_cache(maxsize=5000)
def get_recent_topics(
    realm_id: int,
    stream_id: int,
    cutoff_date: datetime,
) -> list[DigestTopic]:
    # Gather information about topic conversations, then
    # classify by:
    #   * topic length
    #   * number of senders

    messages = (
        # Uses index: zerver_message_realm_recipient_date_sent
        Message.objects.filter(
            realm_id=realm_id,
            recipient__type=Recipient.STREAM,
            recipient__type_id=stream_id,
            date_sent__gt=cutoff_date,
        )
        .order_by(
            "id",  # we will sample the first few messages
        )
        .select_related(
            "recipient",  # build_message_list looks up recipient.type
            "sender",  # we need the sender's full name
        )
        .defer(
            # This construction, to only fetch the sender's full_name and is_bot,
            # is because `.only()` doesn't work with select_related tables.
            *{
                f"sender__{f.name}"
                for f in UserProfile._meta.fields
                if f.name not in {"full_name", "is_bot"}
            }
        )
    )

    digest_topic_map: dict[TopicKey, DigestTopic] = {}
    for message in messages:
        topic_key = (stream_id, message.topic_name())

        if topic_key not in digest_topic_map:
            digest_topic_map[topic_key] = DigestTopic(topic_key)

        digest_topic_map[topic_key].add_message(message)

    topics = list(digest_topic_map.values())

    return topics


def get_hot_topics(
    all_topics: list[DigestTopic],
    stream_ids: set[int],
) -> list[DigestTopic]:
    topics = [topic for topic in all_topics if topic.stream_id() in stream_ids]

    hot_topics = heapq.nlargest(2, topics, key=DigestTopic.diversity)

    for topic in heapq.nlargest(
        MAX_HOT_TOPICS_TO_BE_INCLUDED_IN_DIGEST, topics, key=DigestTopic.length
    ):
        if topic not in hot_topics:
            hot_topics.append(topic)
        if len(hot_topics) == MAX_HOT_TOPICS_TO_BE_INCLUDED_IN_DIGEST:
            break

    return hot_topics


def get_recently_created_streams(realm: Realm, threshold: datetime) -> list[Stream]:
    fields = ["id", "name", "is_web_public", "invite_only"]
    return list(get_active_streams(realm).filter(date_created__gt=threshold).only(*fields))


def gather_new_streams(
    realm: Realm,
    recently_created_streams: list[Stream],  # streams only need id and name
    can_access_public: bool,
) -> tuple[int, dict[str, list[Markup] | list[str]]]:
    if can_access_public:
        new_streams = [stream for stream in recently_created_streams if not stream.invite_only]
    else:
        new_streams = [stream for stream in recently_created_streams if stream.is_web_public]

    channels_html = []
    channels_plain = []

    for stream in new_streams:
        narrow_url = stream_narrow_url(realm, stream)
        channel_link = Markup(
            "<a href='{narrow_url}'>{channel_privacy_icon}{stream_name}</a>"
        ).format(
            narrow_url=narrow_url,
            channel_privacy_icon=get_channel_privacy_icon(stream),
            stream_name=stream.name,
        )
        channels_html.append(channel_link)
        channels_plain.append(stream.name)

    return len(new_streams), {"html": channels_html, "plain": channels_plain}


def get_new_messages_count(user: UserProfile, threshold: datetime) -> int:
    count = UserMessage.objects.filter(
        user_profile=user, message__date_sent__gte=threshold, message__sender__is_bot=False
    ).count()
    return count


def enough_traffic(
    hot_conversations: int, new_streams: int, new_messages: int, show_message_content: bool
) -> bool:
    if new_streams > 0:
        return True
    if not show_message_content:
        return new_messages > 0
    return hot_conversations > 0


def get_user_stream_map(user_ids: list[int], cutoff_date: datetime) -> dict[int, set[int]]:
    """Skipping streams where the user's subscription status has changed
    when constructing digests is critical to ensure correctness for
    streams without shared history, guest users, and long-term idle
    users, because it means that every user has the same view of the
    history of a given stream whose message history is being included
    (and thus we can share a lot of work).

    The downside is that newly created streams are never included in
    the first digest email after their creation.  Should we wish to
    change that, we will need to be very careful to avoid creating
    bugs for any of those classes of users.
    """
    events = [
        AuditLogEventType.SUBSCRIPTION_CREATED,
        AuditLogEventType.SUBSCRIPTION_ACTIVATED,
        AuditLogEventType.SUBSCRIPTION_DEACTIVATED,
    ]
    # This uses the zerver_realmauditlog_user_subscriptions_idx
    # partial index on RealmAuditLog which is specifically for those
    # three event types.
    rows = (
        Subscription.objects.filter(
            user_profile_id__in=user_ids,
            recipient__type=Recipient.STREAM,
            active=True,
            is_muted=False,
        )
        .alias(
            was_modified=Exists(
                RealmAuditLog.objects.filter(
                    modified_stream_id=OuterRef("recipient__type_id"),
                    modified_user_id=OuterRef("user_profile_id"),
                    event_time__gt=cutoff_date,
                    event_type__in=events,
                )
            )
        )
        .filter(was_modified=False)
        .values("user_profile_id", "recipient__type_id")
    )

    # maps user_id -> {stream_id, stream_id, ...}
    dct: dict[int, set[int]] = defaultdict(set)
    for row in rows:
        dct[row["user_profile_id"]].add(row["recipient__type_id"])

    return dct


def get_slim_stream_id_map(realm: Realm) -> dict[int, Stream]:
    # "slim" because it only fetches the names of the stream objects,
    # suitable for passing into build_message_list.
    streams = get_active_streams(realm).only("id", "name")
    return {stream.id: stream for stream in streams}


def bulk_get_digest_context(
    users: Collection[UserProfile] | QuerySet[UserProfile], cutoff: float
) -> Iterator[tuple[UserProfile, dict[str, Any]]]:
    # We expect a non-empty list of users all from the same realm.
    assert users
    realm = next(iter(users)).realm
    for user in users:
        assert user.realm_id == realm.id

    # Convert from epoch seconds to a datetime object.
    cutoff_date = datetime.fromtimestamp(int(cutoff), tz=timezone.utc)

    maybe_clear_recent_topics_cache(realm.id, cutoff)

    stream_id_map = get_slim_stream_id_map(realm)
    recently_created_streams = get_recently_created_streams(realm, cutoff_date)

    user_ids = [user.id for user in users]
    user_stream_map = get_user_stream_map(user_ids, cutoff_date)

    for user in users:
        context = common_context(user)

        # Start building email template data.
        unsubscribe_link = one_click_unsubscribe_link(user, "digest")
        context.update(unsubscribe_link=unsubscribe_link)

        # Gather new streams.
        new_streams_count, new_streams = gather_new_streams(
            realm=realm,
            recently_created_streams=recently_created_streams,
            can_access_public=user.can_access_public_streams(),
        )

        context["new_streams_count"] = new_streams_count
        context[
            "message_content_disabled_by_realm"
        ] = not realm.message_content_allowed_in_email_notifications
        context[
            "message_content_disabled_by_user"
        ] = not user.message_content_in_email_notifications

        if not message_content_allowed_in_missedmessage_emails(user):
            # Count new messages when message content is hidden in email notifications.
            context["new_messages_count"] = get_new_messages_count(user, cutoff_date)
            context["hot_conversations"] = []
            context["show_message_content"] = False
        else:
            # Otherwise, get context data for hot conversations.
            stream_ids = user_stream_map[user.id]
            recent_topics = []
            for stream_id in stream_ids:
                recent_topics += get_recent_topics(realm.id, stream_id, cutoff_date)
            hot_topics = get_hot_topics(recent_topics, stream_ids)

            context["hot_conversations"] = [
                hot_topic.teaser_data(user, stream_id_map) for hot_topic in hot_topics
            ]
            context["new_channels"] = new_streams
            context["new_messages_count"] = 0
            context["show_message_content"] = True

        yield user, context


def get_digest_context(user: UserProfile, cutoff: float) -> dict[str, Any]:
    for ignored, context in bulk_get_digest_context([user], cutoff):
        return context
    raise AssertionError("Unreachable")


@transaction.atomic(durable=True)
def bulk_handle_digest_email(user_ids: list[int], cutoff: float) -> None:
    # We go directly to the database to get user objects,
    # since inactive users are likely to not be in the cache.
    users = (
        UserProfile.objects.filter(id__in=user_ids, is_active=True, realm__deactivated=False)
        .order_by("id")
        .select_related("realm")
    )
    digest_users = []

    for user, context in bulk_get_digest_context(users, cutoff):
        # We don't want to send emails containing almost no information.
        if not enough_traffic(
            len(context["hot_conversations"]),
            context["new_streams_count"],
            context["new_messages_count"],
            context["show_message_content"],
        ):
            continue

        digest_users.append(user)
        logger.info("Enqueuing digest email for user %s", user.id)

        # Send now, as a ScheduledEmail
        send_future_email(
            "zerver/emails/digest",
            user.realm,
            to_user_ids=[user.id],
            from_name=_("{service_name} digest").format(service_name=settings.INSTALLATION_NAME),
            from_address=FromAddress.no_reply_placeholder,
            context=context,
        )

    bulk_write_realm_audit_logs(digest_users)


def bulk_write_realm_audit_logs(users: list[UserProfile]) -> None:
    if not users:
        return

    # We write RealmAuditLog rows for auditing, and we will also
    # use these rows during the next run to possibly exclude the
    # users (if insufficient time has passed).
    last_message_id = get_last_message_id()
    now = timezone_now()

    log_rows = [
        RealmAuditLog(
            realm_id=user.realm_id,
            modified_user_id=user.id,
            event_last_message_id=last_message_id,
            event_time=now,
            event_type=AuditLogEventType.USER_DIGEST_EMAIL_CREATED,
        )
        for user in users
    ]

    RealmAuditLog.objects.bulk_create(log_rows)
```

--------------------------------------------------------------------------------

---[FILE: display_recipient.py]---
Location: zulip-main/zerver/lib/display_recipient.py
Signals: Django

```python
from typing import TYPE_CHECKING, Optional, TypedDict

from django.db.models import QuerySet

from zerver.lib.cache import (
    bulk_cached_fetch,
    cache_with_key,
    display_recipient_cache_key,
    generic_bulk_cached_fetch,
    single_user_display_recipient_cache_key,
)
from zerver.lib.per_request_cache import return_same_value_during_entire_request
from zerver.lib.types import DisplayRecipientT, UserDisplayRecipient

if TYPE_CHECKING:
    from zerver.models import Recipient

display_recipient_fields = [
    "id",
    "email",
    "full_name",
    "is_mirror_dummy",
]


class TinyStreamResult(TypedDict):
    recipient_id: int
    name: str


def get_display_recipient_cache_key(
    recipient_id: int, recipient_type: int, recipient_type_id: int | None
) -> str:
    return display_recipient_cache_key(recipient_id)


# Note that the _same_ cache key is used for streams, which contain a
# string, not a list[UserDisplayRecipient]!  This works because the
# recipient space is distinct between the two.
@cache_with_key(get_display_recipient_cache_key, timeout=3600 * 24 * 7)
def get_display_recipient_remote_cache(
    recipient_id: int, recipient_type: int, recipient_type_id: int | None
) -> list[UserDisplayRecipient]:
    """
    This returns an appropriate object describing the recipient of a
    direct message (whether individual or group).

    It will be an array of dicts for each recipient.

    Do not use this for streams.
    """

    from zerver.models import Recipient, UserProfile

    assert recipient_type != Recipient.STREAM

    # The main priority for ordering here is being deterministic.
    # Right now, we order by ID, which matches the ordering of user
    # names in the left sidebar.
    user_profile_list = (
        UserProfile.objects.filter(
            subscription__recipient_id=recipient_id,
        )
        .order_by("id")
        .values(*display_recipient_fields)
    )
    return list(user_profile_list)


def user_dict_id_fetcher(user_dict: UserDisplayRecipient) -> int:
    return user_dict["id"]


def bulk_fetch_single_user_display_recipients(uids: list[int]) -> dict[int, UserDisplayRecipient]:
    from zerver.models import UserProfile

    return bulk_cached_fetch(
        # Use a separate cache key to protect us from conflicts with
        # the get_user_profile_by_id cache.
        # (Since we fetch only several fields here)
        cache_key_function=single_user_display_recipient_cache_key,
        query_function=lambda ids: list(
            UserProfile.objects.filter(id__in=ids).values(*display_recipient_fields)
        ),
        object_ids=uids,
        id_fetcher=user_dict_id_fetcher,
    )


def bulk_fetch_stream_names(
    recipient_tuples: set[tuple[int, int, int]],
) -> dict[int, str]:
    """
    Takes set of tuples of the form (recipient_id, recipient_type, recipient_type_id)
    Returns dict mapping recipient_id to corresponding display_recipient
    """

    from zerver.models import Stream

    if len(recipient_tuples) == 0:
        return {}

    recipient_id_to_stream_id = {tup[0]: tup[2] for tup in recipient_tuples}
    recipient_ids = [tup[0] for tup in recipient_tuples]

    def get_tiny_stream_rows(
        recipient_ids: list[int],
    ) -> QuerySet[Stream, TinyStreamResult]:
        stream_ids = [recipient_id_to_stream_id[recipient_id] for recipient_id in recipient_ids]
        return Stream.objects.filter(id__in=stream_ids).values("recipient_id", "name")

    def get_recipient_id(row: TinyStreamResult) -> int:
        return row["recipient_id"]

    def get_name(row: TinyStreamResult) -> str:
        return row["name"]

    # ItemT = TinyStreamResult, CacheItemT = str (name), ObjKT = int (recipient_id)
    stream_display_recipients: dict[int, str] = generic_bulk_cached_fetch(
        cache_key_function=display_recipient_cache_key,
        query_function=get_tiny_stream_rows,
        object_ids=recipient_ids,
        id_fetcher=get_recipient_id,
        cache_transformer=get_name,
        setter=lambda obj: obj,
        extractor=lambda obj: obj,
        pickled_tupled=False,
    )

    return stream_display_recipients


def bulk_fetch_user_display_recipients(
    recipient_tuples: set[tuple[int, int, int]],
) -> dict[int, list[UserDisplayRecipient]]:
    """
    Takes set of tuples of the form (recipient_id, recipient_type, recipient_type_id)
    Returns dict mapping recipient_id to corresponding display_recipient
    """

    from zerver.models import Recipient
    from zerver.models.recipients import bulk_get_direct_message_group_user_ids

    if len(recipient_tuples) == 0:
        return {}

    get_recipient_id = lambda tup: tup[0]
    get_type = lambda tup: tup[1]

    personal_tuples = [tup for tup in recipient_tuples if get_type(tup) == Recipient.PERSONAL]
    direct_message_group_tuples = [
        tup for tup in recipient_tuples if get_type(tup) == Recipient.DIRECT_MESSAGE_GROUP
    ]

    direct_message_group_recipient_ids = [
        get_recipient_id(tup) for tup in direct_message_group_tuples
    ]
    user_ids_in_direct_message_groups = bulk_get_direct_message_group_user_ids(
        direct_message_group_recipient_ids
    )

    # Find all user ids whose UserProfiles we will need to fetch:
    user_ids_to_fetch = {
        user_id for ignore_recipient_id, ignore_recipient_type, user_id in personal_tuples
    }

    for recipient_id in direct_message_group_recipient_ids:
        direct_message_group_user_ids = user_ids_in_direct_message_groups[recipient_id]
        user_ids_to_fetch |= direct_message_group_user_ids

    # Fetch the needed user dictionaries.
    user_display_recipients = bulk_fetch_single_user_display_recipients(list(user_ids_to_fetch))

    result = {}

    for recipient_id, ignore_recipient_type, user_id in personal_tuples:
        display_recipients = [user_display_recipients[user_id]]
        result[recipient_id] = display_recipients

    for recipient_id in direct_message_group_recipient_ids:
        user_ids = sorted(user_ids_in_direct_message_groups[recipient_id])
        display_recipients = [user_display_recipients[user_id] for user_id in user_ids]
        result[recipient_id] = display_recipients

    return result


def bulk_fetch_display_recipients(
    recipient_tuples: set[tuple[int, int, int]],
) -> dict[int, DisplayRecipientT]:
    """
    Takes set of tuples of the form (recipient_id, recipient_type, recipient_type_id)
    Returns dict mapping recipient_id to corresponding display_recipient
    """

    from zerver.models import Recipient

    stream_recipients = {
        recipient for recipient in recipient_tuples if recipient[1] == Recipient.STREAM
    }
    direct_message_recipients = recipient_tuples - stream_recipients

    stream_display_recipients = bulk_fetch_stream_names(stream_recipients)
    direct_message_display_recipients = bulk_fetch_user_display_recipients(
        direct_message_recipients
    )

    # Glue the dicts together and return:
    return {**stream_display_recipients, **direct_message_display_recipients}


@return_same_value_during_entire_request
def get_display_recipient_by_id(
    recipient_id: int, recipient_type: int, recipient_type_id: int | None
) -> list[UserDisplayRecipient]:
    """
    returns: an object describing the recipient (using a cache).
    If the type is a stream, the type_id must be an int; a string is returned.
    Otherwise, type_id may be None; an array of recipient dicts is returned.
    """
    # Have to import here, to avoid circular dependency.
    from zerver.lib.display_recipient import get_display_recipient_remote_cache

    return get_display_recipient_remote_cache(recipient_id, recipient_type, recipient_type_id)


def get_display_recipient(recipient: "Recipient") -> list[UserDisplayRecipient]:
    return get_display_recipient_by_id(
        recipient.id,
        recipient.type,
        recipient.type_id,
    )


def get_recipient_ids(
    recipient: Optional["Recipient"], user_profile_id: int
) -> tuple[list[int], str]:
    from zerver.models import Recipient

    if recipient is None:
        recipient_type_str = ""
        to = []
    elif recipient.type == Recipient.STREAM:
        recipient_type_str = "stream"
        to = [recipient.type_id]
    else:
        recipient_type_str = "private"
        if recipient.type == Recipient.PERSONAL:
            to = [recipient.type_id]
        else:
            to = []
            recipients = get_display_recipient(recipient)
            for r in recipients:
                assert not isinstance(r, str)  # It will only be a string for streams
                if r["id"] != user_profile_id or len(recipients) == 1:
                    to.append(r["id"])
    return to, recipient_type_str
```

--------------------------------------------------------------------------------

---[FILE: domains.py]---
Location: zulip-main/zerver/lib/domains.py
Signals: Django

```python
import re

from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _


def validate_domain(domain: str | None) -> None:
    if domain is None or len(domain) == 0:
        raise ValidationError(_("Domain can't be empty."))
    if "." not in domain:
        raise ValidationError(_("Domain must have at least one dot (.)"))
    if len(domain) > 255:
        raise ValidationError(_("Domain is too long"))
    if domain[0] == "." or domain[-1] == ".":
        raise ValidationError(_("Domain cannot start or end with a dot (.)"))
    for subdomain in domain.split("."):
        if not subdomain:
            raise ValidationError(_("Consecutive '.' are not allowed."))
        if subdomain[0] == "-" or subdomain[-1] == "-":
            raise ValidationError(_("Subdomains cannot start or end with a '-'."))
        if not re.match(r"^[a-z0-9-]*$", subdomain):
            raise ValidationError(_("Domain can only have letters, numbers, '.' and '-'s."))
```

--------------------------------------------------------------------------------

---[FILE: drafts.py]---
Location: zulip-main/zerver/lib/drafts.py
Signals: Django, Pydantic

```python
import time
from collections.abc import Callable
from functools import wraps
from typing import Annotated, Any, Concatenate, Literal

from django.core.exceptions import ValidationError
from django.db import transaction
from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _
from pydantic import BaseModel, ConfigDict
from typing_extensions import ParamSpec

from zerver.lib.addressee import get_user_profiles_by_ids
from zerver.lib.exceptions import JsonableError, ResourceNotFoundError
from zerver.lib.message import normalize_body, truncate_topic
from zerver.lib.recipient_users import recipient_for_user_profiles
from zerver.lib.streams import access_stream_by_id
from zerver.lib.timestamp import timestamp_to_datetime
from zerver.lib.typed_endpoint import RequiredStringConstraint
from zerver.models import Draft, UserProfile
from zerver.tornado.django_api import send_event_on_commit

ParamT = ParamSpec("ParamT")


class DraftData(BaseModel):
    model_config = ConfigDict(extra="forbid")

    type: Literal["private", "stream", ""]
    to: list[int]
    topic: str
    content: Annotated[str, RequiredStringConstraint()]
    timestamp: int | float | None = None


def further_validated_draft_dict(
    draft_dict: DraftData, user_profile: UserProfile
) -> dict[str, Any]:
    """Take a DraftData object that was already validated by the @typed_endpoint
    decorator then further sanitize, validate, and transform it.
    Ultimately return this "further validated" draft dict.
    It will have a slightly different set of keys the values
    for which can be used to directly create a Draft object."""

    content = normalize_body(draft_dict.content)

    timestamp = draft_dict.timestamp
    if timestamp is None:
        timestamp = time.time()
    timestamp = round(timestamp, 6)
    if timestamp < 0:
        # While it's not exactly an invalid timestamp, it's not something
        # we want to allow either.
        raise JsonableError(_("Timestamp must not be negative."))
    last_edit_time = timestamp_to_datetime(timestamp)

    topic_name = ""
    recipient_id = None
    to = draft_dict.to
    if draft_dict.type == "stream":
        topic_name = truncate_topic(draft_dict.topic)
        if "\0" in topic_name:
            raise JsonableError(_("Topic must not contain null bytes"))
        if len(to) != 1:
            raise JsonableError(_("Must specify exactly 1 channel ID for channel messages"))
        stream, _sub = access_stream_by_id(user_profile, to[0])
        recipient_id = stream.recipient_id
    elif draft_dict.type == "private" and len(to) != 0:
        to_users = get_user_profiles_by_ids(set(to), user_profile.realm)
        try:
            recipient_id = recipient_for_user_profiles(to_users, False, None, user_profile).id
        except ValidationError as e:  # nocoverage
            raise JsonableError(e.messages[0])

    return {
        "recipient_id": recipient_id,
        "topic": topic_name,
        "content": content,
        "last_edit_time": last_edit_time,
    }


def draft_endpoint(
    view_func: Callable[Concatenate[HttpRequest, UserProfile, ParamT], HttpResponse],
) -> Callable[Concatenate[HttpRequest, UserProfile, ParamT], HttpResponse]:
    @wraps(view_func)
    def draft_view_func(
        request: HttpRequest,
        user_profile: UserProfile,
        /,
        *args: ParamT.args,
        **kwargs: ParamT.kwargs,
    ) -> HttpResponse:
        if not user_profile.enable_drafts_synchronization:
            raise JsonableError(_("User has disabled synchronizing drafts."))
        return view_func(request, user_profile, *args, **kwargs)

    return draft_view_func


def do_create_drafts(drafts: list[DraftData], user_profile: UserProfile) -> list[Draft]:
    """Create drafts in bulk for a given user based on the DraftData objects. Since
    currently, the only place this method is being used (apart from tests) is from
    the create_draft view, we assume that these are syntactically valid
    (i.e. they satisfy the @typed_endpoint validation for DraftData)."""
    draft_objects = []
    for draft in drafts:
        valid_draft_dict = further_validated_draft_dict(draft, user_profile)
        draft_objects.append(
            Draft(
                user_profile=user_profile,
                recipient_id=valid_draft_dict["recipient_id"],
                topic=valid_draft_dict["topic"],
                content=valid_draft_dict["content"],
                last_edit_time=valid_draft_dict["last_edit_time"],
            )
        )

    with transaction.atomic(durable=True):
        created_draft_objects = Draft.objects.bulk_create(draft_objects)

        event = {
            "type": "drafts",
            "op": "add",
            "drafts": [draft.to_dict() for draft in created_draft_objects],
        }
        send_event_on_commit(user_profile.realm, event, [user_profile.id])

    return created_draft_objects


def do_edit_draft(draft_id: int, draft: DraftData, user_profile: UserProfile) -> None:
    """Edit/update a single draft for a given user. Since the only place this method is being
    used from (apart from tests) is the edit_draft view, we assume that the DraftData object
    is syntactically valid (i.e. it satisfies the @typed_endpoint validation for DraftData)."""
    try:
        draft_object = Draft.objects.get(id=draft_id, user_profile=user_profile)
    except Draft.DoesNotExist:
        raise ResourceNotFoundError(_("Draft does not exist"))
    valid_draft_dict = further_validated_draft_dict(draft, user_profile)
    draft_object.content = valid_draft_dict["content"]
    draft_object.topic = valid_draft_dict["topic"]
    draft_object.recipient_id = valid_draft_dict["recipient_id"]
    draft_object.last_edit_time = valid_draft_dict["last_edit_time"]

    with transaction.atomic(durable=True):
        draft_object.save()

        event = {"type": "drafts", "op": "update", "draft": draft_object.to_dict()}
        send_event_on_commit(user_profile.realm, event, [user_profile.id])


@transaction.atomic(durable=True)
def do_delete_draft(draft_id: int, user_profile: UserProfile) -> None:
    """Delete a draft belonging to a particular user."""
    try:
        draft_object = Draft.objects.get(id=draft_id, user_profile=user_profile)
    except Draft.DoesNotExist:
        raise ResourceNotFoundError(_("Draft does not exist"))

    draft_id = draft_object.id
    draft_object.delete()

    event = {"type": "drafts", "op": "remove", "draft_id": draft_id}
    send_event_on_commit(user_profile.realm, event, [user_profile.id])
```

--------------------------------------------------------------------------------

````
